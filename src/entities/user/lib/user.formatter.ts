import { DEFAULT_USER_IMAGE } from "../constants";
import { Gender, Provider } from "../model";

export const formatGender = (gender: string | null): Gender => {
  if (gender && Object.values(Gender).includes(gender as Gender)) {
    return gender as Gender;
  }
  return Gender.UNKNOWN;
};

export const formatProvider = (provider: string): Provider => {
  if (Object.values(Provider).includes(provider as Provider)) {
    return provider as Provider;
  }
  return Provider.UNKNOWN;
};

export const formatProfile = (profile: string | null): string =>
  profile ?? DEFAULT_USER_IMAGE;
