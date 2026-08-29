import { useFormWithSchema } from "@/shared/hooks";
import { DEFAULT_LOGIN, loginSchema, type LoginType } from "../model";

export const useLoginForm = (initialValue?: LoginType) =>
  useFormWithSchema(loginSchema, {
    defaultValues: initialValue ?? DEFAULT_LOGIN,
  });
