import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, {
      message: "email을 입력해주세요.",
    })
    .email({
      message: "유효한 email을 입력해주세요.",
    }),
  password: z.string().min(1, {
    message: "password를 입력해주세요.",
  }),
});

export type LoginType = z.infer<typeof loginSchema>;

export const DEFAULT_LOGIN: LoginType = {
  email: "",
  password: "",
};
