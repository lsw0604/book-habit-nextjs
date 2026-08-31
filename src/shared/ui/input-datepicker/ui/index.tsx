"use client";

import { ko } from "date-fns/locale";
import { AlertCircleIcon, CalendarIcon, XIcon } from "lucide-react";
import { forwardRef, useId } from "react";

import { Button, buttonVariants } from "@/shared/ui/button";
import { Calendar } from "@/shared/ui/calendar";
import { FieldError as ErrorMessage } from "@/shared/ui";
import { Label } from "@/shared/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/ui/popover";
import { cn } from "@/shared/lib";

import { useInputDatepicker } from "../hooks";
import { INPUT_DATEPICKER_CONSTRAINTS } from "../lib/constants";
import type { DateBounds } from "../lib/validator";

import { datepickerVariants } from "./variants";

interface InputDatepickerProps {
  value: Date | undefined;
  /** react-day-picker의 4인자 핸들러 대신 값만 받는다 — RHF의 onChange와 그대로 맞물린다 */
  onChange: (date: Date | undefined) => void;
  id?: string;
  className?: string;
  label?: string;
  /** 에러 메시지. 존재하면 aria-invalid가 켜지고 메시지가 렌더링된다. */
  error?: string;
  disabled?: boolean;
  /** 선택 가능한 첫 날. 캘린더와 텍스트 입력 검증에 함께 쓰인다 */
  fromDate?: Date;
  /** 선택 가능한 마지막 날 */
  toDate?: Date;
}

const DEFAULT_FROM_DATE = new Date(INPUT_DATEPICKER_CONSTRAINTS.MIN_YEAR, 0, 1);
const DEFAULT_TO_DATE = new Date(
  INPUT_DATEPICKER_CONSTRAINTS.MAX_YEAR,
  11,
  31,
);

const InputDatepicker = forwardRef<HTMLInputElement, InputDatepickerProps>(
  (
    {
      id,
      label,
      value,
      onChange,
      disabled,
      className,
      error,
      fromDate = DEFAULT_FROM_DATE,
      toDate = DEFAULT_TO_DATE,
    },
    ref,
  ) => {
    const generatedId = useId();
    const inputId = id ?? generatedId;
    const errorId = `${inputId}-error`;

    const bounds: DateBounds = { fromDate, toDate };

    const {
      error: internalError,
      dateStr,
      hasError,
      handleClearDate,
      handleInputChange,
      handleCalendarSelect,
    } = useInputDatepicker({ onChange, value, bounds, externalError: !!error });

    const finalErrorMessage = internalError || error;
    const showErrorMessage = hasError && !!finalErrorMessage;

    return (
      <div className={cn("flex flex-col", className)}>
        {label && (
          <Label htmlFor={inputId} className="mb-2">
            {label}
          </Label>
        )}
        <div className={datepickerVariants({ error: hasError, disabled })}>
          <Popover>
            <PopoverTrigger
              disabled={disabled}
              aria-label="달력 열기"
              className={cn(
                buttonVariants({ variant: "ghost", size: "icon-sm" }),
                "shrink-0",
              )}
            >
              <CalendarIcon size={16} className="text-muted-foreground" />
            </PopoverTrigger>
            {/*
             * ActivityCalendar와 같은 이유로 라이트에서는 bg-card 대신 bg-background를 쓴다:
             * bg-card는 primary 계열이라 선택 표시(bg-primary)와 뒤섞인다.
             * 다크는 지면이 색 램프의 최저점이라 그 혼동이 없고 ⑥의 계층 규칙상
             * 페이지보다 밝은 서피스가 필요하므로 bg-card를 유지한다.
             */}
            <PopoverContent
              align="start"
              className="w-auto bg-background p-2 dark:bg-card"
            >
              <Calendar
                locale={ko}
                mode="single"
                autoFocus
                selected={value}
                defaultMonth={value}
                onSelect={handleCalendarSelect}
                startMonth={bounds.fromDate}
                endMonth={bounds.toDate}
                disabled={[{ before: bounds.fromDate }, { after: bounds.toDate }]}
              />
            </PopoverContent>
          </Popover>
          <input
            ref={ref}
            id={inputId}
            disabled={disabled}
            placeholder="YYYY-MM-DD"
            className="w-full min-w-0 bg-transparent text-base text-foreground outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed"
            value={dateStr}
            onChange={handleInputChange}
            inputMode="numeric"
            autoComplete="off"
            aria-invalid={hasError}
            aria-describedby={showErrorMessage ? errorId : undefined}
          />
          {hasError ? (
            <AlertCircleIcon size={16} className="shrink-0 text-destructive" />
          ) : (
            value && (
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                disabled={disabled}
                aria-label="날짜 지우기"
                className="shrink-0"
                onClick={handleClearDate}
              >
                <XIcon size={16} />
              </Button>
            )
          )}
        </div>
        {showErrorMessage && (
          <ErrorMessage id={errorId}>{finalErrorMessage}</ErrorMessage>
        )}
      </div>
    );
  },
);

InputDatepicker.displayName = "InputDatepicker";

export default InputDatepicker;
