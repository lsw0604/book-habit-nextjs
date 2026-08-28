/**
 * 서비스 함수가 바깥에 노출하는 요청 옵션.
 *
 * `AxiosRequestConfig`를 그대로 노출하면 timeout·adapter·responseType 같은
 * 전송 계층 설정까지 도메인 시그니처로 새어 나온다. 실제로 필요한 것은
 * 헤더 주입(서버 컴포넌트의 쿠키 전달)과 요청 취소뿐이므로 그만큼만 연다.
 *
 * `AxiosRequestConfig`에 구조적으로 할당 가능하므로 그대로 넘길 수 있다.
 */
export interface RequestOptions {
  headers?: Record<string, string>;
  /** TanStack Query가 쿼리를 취소할 때 넘기는 시그널 */
  signal?: AbortSignal;
  /** 쿼리 스트링 */
  params?: Record<string, string | number | boolean | undefined>;
}
