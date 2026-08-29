"use client";

import { type Control, Controller } from "react-hook-form";
import { useState } from "react";
import { EyeIcon, EyeOffIcon } from "lucide-react";

import {
  Button,
  FieldError,
  Separator,
  FormInput,
  FieldGroup,
} from "@/shared/ui";

import { useLoginForm } from "../hooks";
import { LoginType } from "../model";
import Link from "next/link";
import { KakaoLoginButton } from "./kakao-login-button";

export function LoginForm() {
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useLoginForm();
  const onSubmit = (data: LoginType) => {
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FieldGroup>
        <EmailField control={control} />
        <PasswordField control={control} />
        <p className="text-sm text-muted-foreground">
          혹시 계정이 없으신가요?{" "}
          <Link
            href="/register"
            className="text-primary underline-offset-4 hover:underline"
          >
            회원가입
          </Link>
        </p>
      </FieldGroup>
      {errors.root && <FieldError>{errors.root.message}</FieldError>}
      <Separator className="my-4" />
      <LoginFooter />
    </form>
  );
}

function EmailField({ control }: { control: Control<LoginType> }) {
  return (
    <Controller
      name="email"
      control={control}
      render={({ field, formState: { errors } }) => (
        <FormInput
          id="email"
          type="email"
          label="이메일"
          error={errors.email?.message}
          {...field}
        />
      )}
    />
  );
}

function PasswordField({ control }: { control: Control<LoginType> }) {
  const [visible, setVisible] = useState<boolean>(false);

  const onTogglePasswordVisibility = () => {
    setVisible((prev) => !prev);
  };

  return (
    <Controller
      name="password"
      control={control}
      render={({ field, formState: { errors } }) => (
        <FormInput
          id="password"
          type={visible ? "text" : "password"}
          label="비밀번호"
          icon={visible ? EyeIcon : EyeOffIcon}
          iconPosition="right"
          onIconClick={onTogglePasswordVisibility}
          iconLabel={visible ? "비밀번호 숨기기" : "비밀번호 표시"}
          error={errors.password?.message}
          {...field}
        />
      )}
    />
  );
}

function LoginFooter() {
  return (
    <footer>
      <Button variant="default" type="submit" className="mt-4 w-full">
        로그인
      </Button>
      <KakaoLoginButton />
    </footer>
  );
}
