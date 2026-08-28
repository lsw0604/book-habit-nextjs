/**
 * BE 공통 응답 봉투. 명세: http://localhost:3000/api-json
 *
 * `success`는 반드시 리터럴 `true`여야 한다. `boolean`으로 바꾸면
 * `ResponseDTO | ErrorDTO`가 판별 유니온이 아니게 되어 else 분기가
 * {@link ErrorDTO}로 좁혀지지 않는다.
 */
export interface ResponseDTO<TData> {
  success: true;
  statusCode: number;
  message: string;
  data: TData;
}

/**
 * 페이로드 없는 성공 응답. `data` 키 자체가 없다.
 *
 * 해당 엔드포인트 10개 — `DELETE` 8종(my-book, reading-log, my-book-review,
 * review-like, review-comment, my-book-tag, quote, reading-goal),
 * `POST /api/auth/logout`, `POST /api/auth/refresh`.
 */
export type ResponseDTOVoid = Omit<ResponseDTO<never>, "data">;

/**
 * 실패 응답 봉투.
 *
 * BE는 NestJS 기본 예외 형태가 아니라 `ResponseDto.error()`로 감싸서 보낸다.
 * `timestamp`·`path`는 존재하지 않는다 (401·400·404 실측 확인).
 *
 * 예외 필터가 HTTP 상태 코드와 `statusCode`를 같은 값에서 만들므로
 * 2xx인데 `success: false`인 응답은 나올 수 없다.
 * 검증 실패(400)는 여러 메시지가 `, `로 이어져 하나의 문자열로 온다.
 */
export interface ErrorDTO {
  success: false;
  statusCode: number;
  message: string;
}
