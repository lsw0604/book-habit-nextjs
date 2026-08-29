"use client";

import * as React from "react";
import type { LucideIcon } from "lucide-react";

import { Input } from "./input";
import { Label } from "./label";
import { FieldError } from "./field";

import { cn } from "../lib";

type IconPosition = "left" | "right";

interface FormInputBaseProps extends React.ComponentProps<"input"> {
  /** input과 label을 연결하고 에러 메시지 id를 생성하는 데 쓰인다. 필수. */
  id: string;
  label?: string;
  icon?: LucideIcon;
  /** 아이콘 위치. 기본 left. 비밀번호 토글 등 조작형 아이콘은 right 권장. */
  iconPosition?: IconPosition;
  /** 에러 메시지. 존재하면 aria-invalid가 켜지고 메시지가 렌더링된다. */
  error?: string;
  /** 바깥 wrapper용 className. input 자체 스타일은 inputClassName을 쓴다. */
  className?: string;
  inputClassName?: string;
}

type FormInputProps = FormInputBaseProps &
  (
    | { onIconClick?: undefined; iconLabel?: string }
    | {
        /** 넘기면 아이콘이 버튼으로 렌더링된다. 없으면 장식용으로만 표시. */
        onIconClick: () => void;
        /** 아이콘 버튼의 접근성 레이블. 아이콘만 있는 버튼이라 필수. */
        iconLabel: string;
      }
  );

export function FormInput({
  id,
  label,
  icon: Icon,
  iconPosition = "left",
  onIconClick,
  iconLabel,
  error,
  className,
  inputClassName,
  disabled,
  ...props
}: FormInputProps) {
  const errorId = `${id}-error`;
  const hasIcon = !!Icon;

  return (
    <div className={cn("w-full space-y-2", className)}>
      {label && <Label htmlFor={id}>{label}</Label>}
      <div className="relative w-full">
        <Input
          id={id}
          disabled={disabled}
          aria-invalid={!!error}
          aria-describedby={error ? errorId : undefined}
          className={cn(
            hasIcon && iconPosition === "left" && "pl-10",
            hasIcon && iconPosition === "right" && "pr-10",
            inputClassName,
          )}
          {...props}
        />
        {Icon &&
          (onIconClick ? (
            <button
              type="button"
              onClick={onIconClick}
              aria-label={iconLabel}
              disabled={disabled}
              className={cn(
                "absolute inset-y-0 flex w-10 items-center justify-center rounded-lg",
                "text-muted-foreground transition-colors hover:text-foreground",
                "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                iconPosition === "left" ? "left-0" : "right-0",
              )}
            >
              <Icon size={16} />
            </button>
          ) : (
            <div
              aria-hidden="true"
              className={cn(
                "pointer-events-none absolute inset-y-0 flex w-10 items-center justify-center",
                "text-muted-foreground",
                iconPosition === "left" ? "left-0" : "right-0",
              )}
            >
              <Icon size={16} />
            </div>
          ))}
      </div>
      {error && <FieldError id={errorId}>{error}</FieldError>}
    </div>
  );
}
