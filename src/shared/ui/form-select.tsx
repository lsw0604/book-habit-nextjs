"use client";

import { cn } from "../lib";
import { FieldError } from "./field";
import { Label } from "./label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select";

export interface FormSelectOption<TValue extends string | number> {
  label: string;
  value: TValue;
}

interface FormSelectProps<TValue extends string | number> {
  /** Label 연결과 에러 메시지 id 생성에 쓰인다. 필수. */
  id: string;
  label: string;
  value: TValue;
  onChange: (value: TValue | null) => void;
  options: ReadonlyArray<FormSelectOption<TValue>>;
  /** 존재하면 `aria-invalid`가 켜지고 메시지가 렌더링된다. */
  error?: string;
  disabled?: boolean;
  /** 바깥 wrapper용. 트리거 자체는 `triggerClassName`을 쓴다. */
  className?: string;
  triggerClassName?: string;
}

/**
 * Label + Select + FieldError 조합. {@link FormInput}의 Select판이라
 * `id` 필수·`error`로 `aria-invalid` 연결까지 같은 계약을 따른다.
 *
 * 라벨은 `FormInput`과 달리 **필수**다. 라벨 없는 select는 스크린리더에서
 * 무엇을 고르는 자리인지 알 수 없고, 실제로 그렇게 쓸 일도 없었다.
 * 필요해지면 그때 optional로 푼다.
 */
export function FormSelect<TValue extends string | number>({
  id,
  label,
  value,
  onChange,
  options,
  error,
  disabled,
  className,
  triggerClassName,
}: FormSelectProps<TValue>) {
  const errorId = `${id}-error`;

  return (
    <div className={cn("w-full space-y-2", className)}>
      <Label htmlFor={id}>{label}</Label>
      <Select
        value={value}
        onValueChange={onChange}
        items={options}
        disabled={disabled}
      >
        <SelectTrigger
          id={id}
          aria-invalid={!!error}
          aria-describedby={error ? errorId : undefined}
          className={cn("w-full", triggerClassName)}
        >
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {error && <FieldError id={errorId}>{error}</FieldError>}
    </div>
  );
}
