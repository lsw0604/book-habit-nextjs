/** 응답을 받지 못한 실패에는 HTTP 상태가 없으므로 0을 쓴다. */
export const NO_HTTP_STATUS = 0;

/**
 * 실패 원인. `server`·`unauthorized`만 서버가 준 `statusCode`를 갖는다.
 *
 * `network`와 `timeout`을 나누는 이유는 UI 대응이 다르기 때문이다.
 * 타임아웃은 재시도가 통할 수 있지만 오프라인은 그렇지 않다.
 */
export type APIErrorKind =
  | "server"
  /** 토큰 갱신까지 실패해 세션이 끝난 상태. 상위에서 로그인으로 보낸다. */
  | "unauthorized"
  | "network"
  | "timeout"
  /** `AbortController` 취소. 정상 흐름이라 에러로 표시하면 안 된다. */
  | "canceled"
  | "unknown";

/** 모든 API 실패가 정규화되어 도달하는 에러. */
export class APIError extends Error {
  public readonly kind: APIErrorKind;
  /** 응답을 받지 못한 경우 {@link NO_HTTP_STATUS}. */
  public readonly statusCode: number;

  constructor(
    message: string,
    kind: APIErrorKind,
    statusCode: number = NO_HTTP_STATUS,
    options?: { cause?: unknown },
  ) {
    super(message, { cause: options?.cause });
    this.name = "APIError";
    this.kind = kind;
    this.statusCode = statusCode;
    Object.setPrototypeOf(this, APIError.prototype);
  }

  /** 취소는 정상 흐름에서도 발생하므로 에러 토스트를 띄우면 안 된다. */
  get isCanceled(): boolean {
    return this.kind === "canceled";
  }

  /**
   * 화면에 그대로 띄워도 되는 문구.
   *
   * `network`·`timeout`은 이 클래스가 만든 사용자용 문구지만, `server`·`unknown`의
   * `message`는 BE 원문(검증 실패 메시지가 `, `로 이어진 문자열 등)이라 그대로
   * 노출하면 화면에 개발자용 텍스트가 새어 나간다. 원문은 로깅용으로 `message`에 남긴다.
   */
  get userMessage(): string {
    return this.kind === "network" || this.kind === "timeout"
      ? this.message
      : "잠시 후 다시 시도해 주세요.";
  }

  static network(cause?: unknown): APIError {
    return new APIError(
      "서버에 연결할 수 없습니다.\n네트워크 상태를 확인해주세요.",
      "network",
      NO_HTTP_STATUS,
      { cause },
    );
  }

  static timeout(cause?: unknown): APIError {
    return new APIError(
      "요청 시간이 초과되었습니다.\n잠시 후 다시 시도해주세요.",
      "timeout",
      NO_HTTP_STATUS,
      { cause },
    );
  }

  static canceled(cause?: unknown): APIError {
    return new APIError("요청이 취소되었습니다.", "canceled", NO_HTTP_STATUS, {
      cause,
    });
  }

  /** 토큰 갱신 실패. 인터셉터가 대기 중이던 요청을 이 에러로 정리한다. */
  static unauthorized(cause?: unknown): APIError {
    return new APIError(
      "로그인이 필요합니다.",
      "unauthorized",
      401,
      { cause },
    );
  }
}

export function isAPIError(error: unknown): error is APIError {
  return error instanceof APIError;
}
