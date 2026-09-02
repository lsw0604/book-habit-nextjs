import { useFormWithSchema } from "@/shared/hooks";

import { type RegisterType, DEFAULT_REGISTER, registerSchema } from "../model";

export const useRegisterForm = (initialValue?: RegisterType) =>
  useFormWithSchema(registerSchema, {
    defaultValues: initialValue ?? DEFAULT_REGISTER,
  });
