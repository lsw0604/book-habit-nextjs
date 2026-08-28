import {
  isAxiosError,
  isCancel,
  type AxiosInstance,
  type AxiosRequestConfig,
  type AxiosResponse,
} from "axios";

import { APIError, isAPIError } from "../types";
import type { ErrorDTO, ResponseDTO } from "../types";

/**
 * 서비스가 axios를 몰라도 되도록 응답 봉투를 벗기고 실패를 APIError로 정규화한다.
 *
 * 정규화를 끝까지 하지 않으면 훅에 선언된 `APIError` 타입이 거짓이 되고,
 * 결국 UI가 axios를 알아야 한다. 그래서 취소까지 APIError로 감싼다 —
 * 다만 `kind`가 `"canceled"`라 호출부에서 `isCanceled`로 걸러낼 수 있다.
 */
async function handleRequest<T>(
  request: Promise<AxiosResponse<ResponseDTO<T>>>,
): Promise<T> {
  try {
    const response = await request;
    const body = response.data;

    // 2xx인데 success:false는 BE 예외 필터 구조상 나올 수 없다.
    // 계약이 바뀌면 undefined가 조용히 흘러다니는 대신 여기서 걸린다.
    if (!body.success) {
      const failed = body as unknown as ErrorDTO;
      throw new APIError(failed.message, "server", failed.statusCode);
    }

    return body.data;
  } catch (err) {
    // 인터셉터가 이미 정규화한 실패(갱신 실패 등)는 그대로 통과시킨다.
    if (isAPIError(err)) throw err;

    if (isCancel(err)) throw APIError.canceled(err);

    if (isAxiosError<ErrorDTO>(err)) {
      if (err.code === "ECONNABORTED" || err.code === "ETIMEDOUT") {
        throw APIError.timeout(err);
      }

      const data = err.response?.data;
      if (data && typeof data.message === "string") {
        throw new APIError(data.message, "server", data.statusCode, {
          cause: err,
        });
      }

      // 응답은 왔지만 봉투 형태가 아닌 경우 (게이트웨이 HTML 등)
      if (err.response) {
        throw new APIError(err.message, "server", err.response.status, {
          cause: err,
        });
      }

      throw APIError.network(err);
    }

    throw new APIError(
      err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다.",
      "unknown",
      undefined,
      { cause: err },
    );
  }
}

/**
 * axios 인스턴스를 감싸 봉투를 벗긴 클라이언트를 만든다.
 *
 * 인스턴스별로 인터셉터가 달라도(인증 재시도 유무) 언래핑·정규화 로직은
 * 하나를 공유한다.
 */
export const createApiWrapper = (client: AxiosInstance) => ({
  get: <T = void>(url: string, config?: AxiosRequestConfig): Promise<T> =>
    handleRequest(client.get<ResponseDTO<T>>(url, config)),

  delete: <T = void>(url: string, config?: AxiosRequestConfig): Promise<T> =>
    handleRequest(client.delete<ResponseDTO<T>>(url, config)),

  post: <T = void, D = unknown>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig,
  ): Promise<T> => handleRequest(client.post<ResponseDTO<T>>(url, data, config)),

  patch: <T = void, D = unknown>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig,
  ): Promise<T> =>
    handleRequest(client.patch<ResponseDTO<T>>(url, data, config)),

  put: <T = void, D = unknown>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig,
  ): Promise<T> => handleRequest(client.put<ResponseDTO<T>>(url, data, config)),
});
