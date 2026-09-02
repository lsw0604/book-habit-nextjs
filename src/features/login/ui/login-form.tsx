"use client";

import Link from "next/link";
import { type Control, Controller } from "react-hook-form";
import { useSyncExternalStore } from "react";

import {
  Button,
  FieldError,
  Separator,
  FormInput,
  FieldGroup,
  PasswordInput,
} from "@/shared/ui";
import { isAPIError } from "@/shared/api";

import { useLoginForm, useLogin } from "../hooks";
import { LoginType } from "../model";
import { KakaoLoginButton } from "./kakao-login-button";

export function LoginForm() {
  const {
    handleSubmit,
    control,
    setError,
    formState: { errors, isSubmitting },
  } = useLoginForm();
  const { mutateAsync } = useLogin();

  const onSubmit = async (data: LoginType) => {
    try {
      await mutateAsync(data);
    } catch (error) {
      setError("root", {
        message: isAPIError(error) ? error.message : "로그인에 실패했어요.",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <KakaoLoginError />
      <FieldGroup>
        <EmailField control={control} />
        <PasswordField control={control} />
        <p className="text-sm leading-normal text-muted-foreground">
          혹시 계정이 없으신가요?{" "}
          <Link
            href="/register"
            className="text-primary underline-offset-4 hover:underline"
          >
            회원가입
          </Link>
        </p>
      </FieldGroup>
      {errors.root && (
        <FieldError className="mt-2 whitespace-pre-line">
          {errors.root.message}
        </FieldError>
      )}
      <Separator className="my-4" />
      <LoginFooter isSubmitting={isSubmitting} />
    </form>
  );
}

const noopSubscribe = () => () => {};

/**
 * 백엔드가 카카오 콜백에서 CSRF state 불일치 등으로 실패하면 `?error=`를
 * 붙여 여기로 돌려보낸다. `useSearchParams`를 쓰면 이 페이지가 동적
 * 렌더링으로 바뀌므로, `redirectTo`와 같은 방식으로 `window.location`에서
 * 직접 읽는다. 서버 스냅샷은 항상 false라 하이드레이션 불일치가 없고,
 * 클라이언트 값은 커밋 이후에 반영된다.
 */
function KakaoLoginError() {
  const hasError = useSyncExternalStore(
    noopSubscribe,
    () => new URLSearchParams(window.location.search).has("error"),
    () => false,
  );

  if (!hasError) return null;

  return (
    <FieldError className="mb-4">
      카카오 로그인에 실패했어요. 다시 시도해주세요.
    </FieldError>
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
  return (
    <Controller
      name="password"
      control={control}
      render={({ field, formState: { errors } }) => (
        <PasswordInput
          id="password"
          label="비밀번호"
          error={errors.password?.message}
          {...field}
        />
      )}
    />
  );
}

function LoginFooter({ isSubmitting }: { isSubmitting: boolean }) {
  return (
    <footer className="mt-4 flex flex-col gap-2">
      <Button
        variant="default"
        type="submit"
        disabled={isSubmitting}
        className="w-full"
      >
        {isSubmitting ? "로그인 중…" : "로그인"}
      </Button>
      <KakaoLoginButton />
    </footer>
  );
}
