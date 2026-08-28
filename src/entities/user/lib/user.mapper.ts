import { UserDTO } from "../api";
import { User } from "../model";
import { formatGender, formatProfile, formatProvider } from "./user.formatter";
import { normalizedDate } from "@/shared/lib";

export const toUserViewModel = (dto: UserDTO): User => {
  const { profile, birthday, gender, provider, ...rest } = dto;
  const formattedProfile = formatProfile(profile);
  const formattedGender = formatGender(gender);
  const formattedProvider = formatProvider(provider);

  return {
    ...rest,
    profile: formattedProfile,
    birthday: birthday ? normalizedDate(birthday) : null,
    gender: formattedGender,
    provider: formattedProvider,
  };
};
