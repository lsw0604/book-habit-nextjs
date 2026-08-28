import { API_ENDPOINTS, authClient } from "@/shared/api";
import type { AccessDTO } from "@/entities/user";

import type { KakaoLoginRequestDTO, LoginRequestDTO } from "./login.dto";

export interface LoginService {
  login: (body: LoginRequestDTO) => Promise<AccessDTO>;
  kakaoLogin: (body: KakaoLoginRequestDTO) => Promise<AccessDTO>;
}

/**
 * 세션을 *만드는* 요청이라 `authClient`를 쓴다.
 *
 * `apiClient`를 쓰면 401(비밀번호 불일치)에 인터셉터가 토큰 갱신을 시도한다.
 * 아직 세션이 없으니 그 갱신도 실패하고, 결국 무의미한 요청만 한 번 더 나간다.
 */
export const loginService: LoginService = {
  login: (body) =>
    authClient.post<AccessDTO, LoginRequestDTO>(API_ENDPOINTS.AUTH.LOGIN, body),

  kakaoLogin: (body) =>
    authClient.post<AccessDTO, KakaoLoginRequestDTO>(
      API_ENDPOINTS.AUTH.KAKAO_CALLBACK,
      body,
    ),
};
