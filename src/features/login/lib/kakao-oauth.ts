const KAKAO_AUTH_URL = "https://kauth.kakao.com/oauth/authorize";
const KAKAO_CLIENT_ID = process.env.NEXT_PUBLIC_KAKAO_REST_API || "";
const KAKAO_REDIRECT_URI = process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URI || "";

const KAKAO_STATE_KEY = "kakao_oauth_state";

export function buildKakaoAuthorizeUrl(): string {
  const state = crypto.randomUUID();
  sessionStorage.setItem(KAKAO_STATE_KEY, state);

  const params = new URLSearchParams({
    client_id: KAKAO_CLIENT_ID,
    redirect_uri: KAKAO_REDIRECT_URI,
    response_type: "code",
    state,
  });

  return `${KAKAO_AUTH_URL}?${params}`;
}

// 반환값이 false면 CSRF 의심 -> 호출부에서 BE 요청 자체를 하지 말 것
export function verifyAndConsumeKakaoState(
  returnedState: string | null,
): boolean {
  const savedState = sessionStorage.getItem(KAKAO_STATE_KEY);
  sessionStorage.removeItem(KAKAO_STATE_KEY); // 1회용
  return Boolean(returnedState) && returnedState === savedState;
}
