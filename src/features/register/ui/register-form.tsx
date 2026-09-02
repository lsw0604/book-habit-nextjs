"use client";

import Link from "next/link";
import { format, startOfDay } from "date-fns";
import { type Control, Controller } from "react-hook-form";
import { MailIcon, UserIcon } from "lucide-react";

import {
  Button,
  FieldError,
  Separator,
  FormInput,
  FieldGroup,
  PasswordInput,
  InputDatepicker,
  RadioGroup,
  RadioGroupItem,
  Label,
} from "@/shared/ui";
import { MaleIcon, FemaleIcon } from "@/shared/assets";
import { isAPIError } from "@/shared/api";
import { Gender } from "@/entities/user";

import { useRegisterForm, useRegister } from "../hooks";
import { RegisterType } from "../model";

export function RegisterForm() {
  const {
    handleSubmit,
    control,
    setError,
    formState: { errors, isSubmitting },
  } = useRegisterForm();
  const { mutateAsync } = useRegister();

  const onSubmit = async (data: RegisterType) => {
    const { checkPassword, birthday, gender, ...rest } = data;

    try {
      await mutateAsync({
        ...rest,
        birthday: birthday ? format(birthday, "yyyy-MM-dd") : undefined,
        gender: gender as "MALE" | "FEMALE",
      });
    } catch (error) {
      if (isAPIError(error) && error.statusCode === 409) {
        setError("email", { message: error.message });
        return;
      }
      setError("root", {
        message: isAPIError(error) ? error.message : "회원가입에 실패했어요.",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FieldGroup>
        <EmailField control={control} />
        <NameField control={control} />
        <BirthdayField control={control} />
        <PasswordField control={control} />
        <CheckPasswordField control={control} />
        <GenderField control={control} />
      </FieldGroup>
      {errors.root && (
        <FieldError className="mt-2 whitespace-pre-line">
          {errors.root.message}
        </FieldError>
      )}
      <Separator className="my-4" />
      <RegisterFooter isSubmitting={isSubmitting} />
    </form>
  );
}

function EmailField({ control }: { control: Control<RegisterType> }) {
  return (
    <Controller
      name="email"
      control={control}
      render={({ field, formState: { errors } }) => (
        <FormInput
          id="email"
          type="email"
          label="이메일"
          icon={MailIcon}
          autoComplete="off"
          error={errors.email?.message}
          {...field}
        />
      )}
    />
  );
}

function NameField({ control }: { control: Control<RegisterType> }) {
  return (
    <Controller
      name="name"
      control={control}
      render={({ field, formState: { errors } }) => (
        <FormInput
          id="name"
          label="이름"
          icon={UserIcon}
          autoComplete="off"
          error={errors.name?.message}
          {...field}
        />
      )}
    />
  );
}

function BirthdayField({ control }: { control: Control<RegisterType> }) {
  return (
    <Controller
      name="birthday"
      control={control}
      render={({ field: { value, onChange }, formState: { errors } }) => (
        <InputDatepicker
          id="birthday"
          label="생년월일"
          value={value}
          onChange={onChange}
          toDate={startOfDay(new Date())}
          error={errors.birthday?.message}
        />
      )}
    />
  );
}

function PasswordField({ control }: { control: Control<RegisterType> }) {
  return (
    <Controller
      name="password"
      control={control}
      render={({ field, formState: { errors } }) => (
        <PasswordInput
          id="password"
          label="비밀번호"
          autoComplete="off"
          error={errors.password?.message}
          {...field}
        />
      )}
    />
  );
}

function CheckPasswordField({ control }: { control: Control<RegisterType> }) {
  return (
    <Controller
      name="checkPassword"
      control={control}
      render={({ field, formState: { errors } }) => (
        <FormInput
          id="checkPassword"
          label="비밀번호 확인"
          type="password"
          autoComplete="off"
          error={errors.checkPassword?.message}
          {...field}
        />
      )}
    />
  );
}

function GenderField({ control }: { control: Control<RegisterType> }) {
  return (
    <Controller
      name="gender"
      control={control}
      render={({ field: { value, onChange }, formState: { errors } }) => (
        <div>
          <Label className="mb-2">성별</Label>
          <RadioGroup
            value={value}
            onValueChange={onChange}
            className="grid-flow-col justify-start gap-6"
          >
            <div className="flex items-center gap-2">
              <RadioGroupItem id="gender-male" value={Gender.MALE} />
              <MaleIcon className="size-4 text-muted-foreground" />
              <Label htmlFor="gender-male">남성</Label>
            </div>
            <div className="flex items-center gap-2">
              <RadioGroupItem id="gender-female" value={Gender.FEMALE} />
              <FemaleIcon className="size-4 text-muted-foreground" />
              <Label htmlFor="gender-female">여성</Label>
            </div>
          </RadioGroup>
          {errors.gender?.message && (
            <FieldError className="mt-2">{errors.gender.message}</FieldError>
          )}
        </div>
      )}
    />
  );
}

function RegisterFooter({ isSubmitting }: { isSubmitting: boolean }) {
  return (
    <footer className="mt-4 flex flex-col gap-2">
      <Button
        variant="default"
        type="submit"
        disabled={isSubmitting}
        className="w-full"
      >
        {isSubmitting ? "가입 중…" : "회원가입"}
      </Button>
      <p className="text-sm leading-normal text-muted-foreground">
        이미 계정이 있으신가요?{" "}
        <Link
          href="/login"
          className="text-primary underline-offset-4 hover:underline"
        >
          로그인
        </Link>
      </p>
    </footer>
  );
}
