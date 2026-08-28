import axios from "axios";

import { axiosConfig } from "./config";
import { createApiWrapper } from "./wrapper";

/**
 * 인증이 필요한 일반 API용.
 *
 * 401을 받으면 토큰을 갱신하고 재시도한다. 인터셉터는 앱 상위(Provider)에서
 * `setupApiResponseInterceptor`로 붙인다 — `shared`가 라우팅을 알지 않도록
 * 갱신 함수와 실패 콜백을 주입받는 구조다.
 */
export const apiAxiosInstance = axios.create(axiosConfig);
export const apiClient = createApiWrapper(apiAxiosInstance);

/**
 * 세션을 수립하거나 갱신하는 요청용. 인터셉터를 붙이지 않는다.
 *
 * `login`·`signup`·`kakao/callback`·`refresh` 전용이다. 특히 `refresh`가
 * 이 인스턴스로 나가야 갱신 실패가 다시 갱신을 부르는 재귀가 생기지 않는다.
 *
 * `me`·`logout`은 세션이 이미 있는 상태의 요청이므로 {@link apiClient}를 쓴다.
 */
export const authAxiosInstance = axios.create(axiosConfig);
export const authClient = createApiWrapper(authAxiosInstance);
