import {
  isAxiosError,
  type AxiosError,
  type AxiosInstance,
  type InternalAxiosRequestConfig,
} from "axios";

import { API_ENDPOINTS } from "../constants";
import { APIError } from "../types";
import type { ErrorDTO } from "../types";

interface InterceptorOptions {
  /** 토큰 갱신을 수행한다. 실패하면 throw 해야 한다. */
  refreshFn: () => Promise<void>;
  /** 갱신까지 실패해 세션이 끝났을 때 호출된다. 리다이렉트는 상위가 맡는다. */
  onRefreshFailed: (reason: string) => void;
}

/**
 * 재시도 여부 표시.
 *
 * 이 플래그가 없으면 "갱신은 성공했는데 재시도가 또 401"인 경우 인터셉터가
 * 다시 진입해 갱신을 반복한다.
 */
interface RetryableConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

let isRefreshing = false;

let pendingQueue: Array<{
  resolve: () => void;
  reject: (error: unknown) => void;
}> = [];

const flushQueue = (error: unknown | null) => {
  const queue = pendingQueue;
  pendingQueue = [];
  queue.forEach(({ resolve, reject }) => {
    if (error) reject(error);
    else resolve();
  });
};

/**
 * 401을 받으면 토큰을 갱신하고 원요청을 한 번 재시도한다.
 *
 * 갱신은 동시에 여러 번 나가지 않는다. 갱신 중에 401을 받은 요청들은
 * 큐에서 기다렸다가 갱신이 끝나면 재시도한다. refresh 토큰을 회전시키는
 * 서버라면 동시 갱신이 서로를 무효화해 멀쩡한 세션이 끊기기 때문이다.
 *
 * 인증이 필요 없는 인스턴스(로그인·회원가입·갱신)에는 붙이지 않는다.
 */
export const setupApiResponseInterceptor = (
  instance: AxiosInstance,
  options: InterceptorOptions,
): number => {
  const { refreshFn, onRefreshFailed } = options;

  return instance.interceptors.response.use(
    (response) => response,
    async (error: AxiosError<ErrorDTO>) => {
      const originalRequest = error.config as RetryableConfig | undefined;

      if (error.response?.status !== 401 || !originalRequest) {
        return Promise.reject(error);
      }

      // 이미 갱신 후 재시도한 요청이 또 401이면 세션이 끝난 것으로 본다.
      if (originalRequest._retry) {
        onRefreshFailed("Retry after refresh still returned 401");
        return Promise.reject(APIError.unauthorized(error));
      }

      // 갱신 요청 자체가 401이면 재귀를 멈춘다.
      // (갱신은 별도 인스턴스로 나가므로 보통 여기 오지 않는 방어 코드다.)
      if (originalRequest.url === API_ENDPOINTS.AUTH.REFRESH) {
        onRefreshFailed("Refresh API returned 401");
        return Promise.reject(APIError.unauthorized(error));
      }

      originalRequest._retry = true;

      // 이미 다른 요청이 갱신 중이면 끝날 때까지 기다렸다가 재시도한다.
      if (isRefreshing) {
        return new Promise<void>((resolve, reject) => {
          pendingQueue.push({ resolve, reject });
        }).then(() => instance(originalRequest));
      }

      isRefreshing = true;
      try {
        await refreshFn();
      } catch (refreshError) {
        const rejection = APIError.unauthorized(refreshError);
        flushQueue(rejection);
        onRefreshFailed(
          isAxiosError(refreshError)
            ? `Refresh failed (${refreshError.response?.status ?? "no response"})`
            : "Refresh failed",
        );
        return Promise.reject(rejection);
      } finally {
        // 재시도보다 먼저 해제해야 한다. 재시도가 또 401일 때
        // 여기가 아직 true면 그 요청이 이미 비운 큐에 들어가 영원히 멈춘다.
        isRefreshing = false;
      }

      flushQueue(null);
      return instance(originalRequest);
    },
  );
};
