/**
 * 서버가 실제로 보내는 형태를 그대로 적는다. 명세의 `UserResponseDto`.
 *
 * 도메인 모델(`model/user.model.ts`의 `Gender`·`Provider`)과 다르다는 점이 중요하다.
 * `UNKNOWN`은 서버가 보내는 값이 아니라 매핑 과정에서 만들어내는 도메인 값이고,
 * 반대로 `null`은 서버가 실제로 보내지만 도메인 모델에는 없다.
 * 그 변환은 `lib/user.mapper.ts`가 담당한다.
 */
export interface UserDTO {
  id: number;
  email: string;
  name: string | null;
  /** ISO 8601 문자열 */
  birthday: string | null;
  gender: "MALE" | "FEMALE" | null;
  provider: "LOCAL" | "KAKAO";
  /** 프로필 이미지 URL */
  profile: string | null;
}

/** `GET /api/auth/me`의 페이로드. 명세의 `AuthUserResponseDto`. */
export interface AccessDTO {
  user: UserDTO;
}
