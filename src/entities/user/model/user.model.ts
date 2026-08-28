export enum Gender {
  MALE = "MALE",
  FEMALE = "FEMALE",
  UNKNOWN = "UNKNOWN",
}

export enum Provider {
  LOCAL = "LOCAL",
  KAKAO = "KAKAO",
  UNKNOWN = "UNKNOWN",
}

export interface User {
  id: number;
  email: string;
  name: string | null;
  birthday: Date | null;
  profile: string;
  gender: Gender;
  provider: Provider;
}
