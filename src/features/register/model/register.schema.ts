import { isBefore, startOfDay } from "date-fns";
import { z } from "zod";

import { Gender } from "@/entities/user";

export const registerSchema = z
  .object({
    email: z.string().email("이메일 형식이 올바르지 않습니다."),
    password: z
      .string()
      .min(8, "비밀번호는 최소 8자 이상이어야 합니다.")
      .superRefine((value, ctx) => {
        if (!/[0-9]/.test(value)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "비밀번호에는 최소 하나의 숫자가 포함되어야 합니다.",
          });
        }

        if (!/[a-zA-Z]/.test(value)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "비밀번호에는 최소 하나의 영어 문자가 포함되어야 합니다.",
          });
        }

        if (!/[!@#$%^&*(),.?:{}|<>]/.test(value)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "비밀번호에는 최소 하나의 특수 문자가 포함되어야 합니다.",
          });
        }
      }),
    checkPassword: z.string().min(8, "비밀번호는 최소 8자 이상이어야 합니다."),
    name: z.string().min(2, "이름은 최소 2자 이상이어야 합니다."),
    gender: z.enum([Gender.MALE, Gender.FEMALE], {
      message: "성별은 남자 또는 여자여야 합니다.",
    }),
    birthday: z
      .date()
      .optional()
      .superRefine((value, ctx) => {
        if (value === undefined) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "생년월일을 입력해주세요.",
          });
        }

        if (value && !isBefore(value, startOfDay(new Date()))) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "생년월일은 오늘보다 이전 날짜여야합니다.",
          });
        }
      }),
  })
  .refine((data) => data.password === data.checkPassword, {
    message: "비밀번호가 일치하지 않습니다.",
    path: ["checkPassword"],
  });

export type RegisterType = z.infer<typeof registerSchema>;

export const DEFAULT_REGISTER: RegisterType = {
  email: "",
  password: "",
  checkPassword: "",
  name: "",
  gender: Gender.MALE,
  birthday: undefined,
};
