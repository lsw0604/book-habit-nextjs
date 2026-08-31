"use client";

import { EyeIcon, EyeOffIcon } from "lucide-react";
import { useState } from "react";
import type { ComponentProps } from "react";

import { FormInput } from "./form-input";

type PasswordInputProps = Omit<
  ComponentProps<typeof FormInput>,
  "type" | "icon" | "iconPosition" | "onIconClick" | "iconLabel"
>;

/** 표시/숨김 토글이 붙은 비밀번호 입력. 로그인·회원가입이 공유한다 */
export function PasswordInput(props: PasswordInputProps) {
  const [visible, setVisible] = useState(false);

  return (
    <FormInput
      {...props}
      type={visible ? "text" : "password"}
      icon={visible ? EyeIcon : EyeOffIcon}
      iconPosition="right"
      onIconClick={() => setVisible((prev) => !prev)}
      iconLabel={visible ? "비밀번호 숨기기" : "비밀번호 표시"}
    />
  );
}
