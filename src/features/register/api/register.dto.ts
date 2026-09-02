/** `POST /api/auth/signup`의 요청 바디. 명세의 `CreateUserDto`. */
export interface RegisterRequestDTO {
  email: string;
  password: string;
  /** 닉네임 */
  name: string;
  /** ISO 8601 문자열 */
  birthday?: string;
  gender?: "MALE" | "FEMALE";
}
