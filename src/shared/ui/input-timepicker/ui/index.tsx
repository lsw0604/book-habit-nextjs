"use client";

import { ClockIcon } from "lucide-react";
import { forwardRef, useId, useImperativeHandle, useRef } from "react";

import { FieldError as ErrorMessage } from "@/shared/ui";
import { Label } from "@/shared/ui/label";
import { cn } from "@/shared/lib";

import { useTimepicker } from "../hooks";

import { TimeInput } from "./time-input";
import { timepickerVariants } from "./variants";

interface InputTimepickerProps {
  value: Date | undefined;
  onChange: (date: Date | undefined) => void;
  id?: string;
  className?: string;
  label?: string;
  /** 에러 메시지. 존재하면 aria-invalid가 켜지고 메시지가 렌더링된다. */
  error?: string;
  disabled?: boolean;
  /** 초 단위까지 입력받을지. 대부분의 화면은 분 단위면 충분하다 */
  showSeconds?: boolean;
}

const InputTimepicker = forwardRef<HTMLInputElement, InputTimepickerProps>(
  (
    {
      value,
      onChange,
      id,
      className,
      label,
      error,
      disabled,
      showSeconds = false,
    },
    ref,
  ) => {
    const hourRef = useRef<HTMLInputElement>(null);
    const minuteRef = useRef<HTMLInputElement>(null);
    const secondRef = useRef<HTMLInputElement>(null);

    /**
     * 한 화면에 여러 개가 놓이므로 id는 인스턴스마다 달라야 한다.
     * 예전에는 분·초가 "minutes"/"seconds"로 고정돼 있어
     * 시작/종료 시간을 함께 그리면 같은 id가 중복됐다.
     */
    const generatedId = useId();
    const baseId = id ?? generatedId;
    const hourId = `${baseId}-hours`;
    const errorId = `${baseId}-error`;

    // 폼 라이브러리가 넘긴 ref는 첫 칸(시)에 연결한다
    useImperativeHandle(ref, () => hourRef.current as HTMLInputElement);

    const { hour, minute, second, setTime, stepTime } = useTimepicker({
      date: value,
      setDate: onChange,
    });

    const showErrorMessage = !!error;

    return (
      <div className={cn("flex flex-col group", className)}>
        {label && (
          <Label htmlFor={hourId} className="mb-2">
            {label}
          </Label>
        )}
        <div
          className={timepickerVariants({ error: !!error, disabled })}
          aria-invalid={!!error}
          aria-describedby={showErrorMessage ? errorId : undefined}
        >
          <ClockIcon className="mr-2 text-muted-foreground" size={16} />
          <div className="flex items-center h-full">
            <TimeInput
              id={hourId}
              ref={hourRef}
              value={hour}
              disabled={disabled}
              onRightFocus={() => minuteRef.current?.focus()}
              onLeftFocus={() =>
                (showSeconds ? secondRef : minuteRef).current?.focus()
              }
              setValue={(digits) => setTime(digits, "hours")}
              stepTime={(step) => stepTime(step, "hours")}
              max={23}
              aria-label="시"
            />
            <span>:</span>
            <TimeInput
              id={`${baseId}-minutes`}
              ref={minuteRef}
              value={minute}
              disabled={disabled}
              setValue={(digits) => setTime(digits, "minutes")}
              stepTime={(step) => stepTime(step, "minutes")}
              onRightFocus={() =>
                (showSeconds ? secondRef : hourRef).current?.focus()
              }
              onLeftFocus={() => hourRef.current?.focus()}
              max={59}
              aria-label="분"
            />
            {showSeconds && (
              <>
                <span>:</span>
                <TimeInput
                  id={`${baseId}-seconds`}
                  ref={secondRef}
                  value={second}
                  disabled={disabled}
                  setValue={(digits) => setTime(digits, "seconds")}
                  stepTime={(step) => stepTime(step, "seconds")}
                  onRightFocus={() => hourRef.current?.focus()}
                  onLeftFocus={() => minuteRef.current?.focus()}
                  max={59}
                  aria-label="초"
                />
              </>
            )}
          </div>
        </div>
        {showErrorMessage && <ErrorMessage id={errorId}>{error}</ErrorMessage>}
      </div>
    );
  },
);

InputTimepicker.displayName = "InputTimepicker";

export default InputTimepicker;
