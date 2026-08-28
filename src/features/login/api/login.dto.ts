/** 명세의 `LoginDto`. */
export interface LoginRequestDTO {
  email: string;
  password: string;
}

/** 명세의 `KakaoCallbackDto`. 카카오 인가 서버에서 받은 authorization code. */
export interface KakaoLoginRequestDTO {
  code: string;
}
