"use client";

import { useEffect } from "react";
import type {
  DeepPartialSkipArrayKey,
  FieldValues,
  UseFormWatch,
} from "react-hook-form";
import { useDebounceCallback, useEventCallback } from "usehooks-ts";

/** 마지막 입력 후 대기 시간. 한글은 조합 중에도 값이 바뀌어 짧으면 요청이 잦다. */
const DEFAULT_DELAY_MS = 500;

interface UseAutoSubmitOptions<TFieldValues extends FieldValues> {
  watch: UseFormWatch<TFieldValues>;
  /**
   * 값이 바뀌고 {@link UseAutoSubmitOptions.delay}만큼 조용해지면 실행된다.
   *
   * 받는 값이 **부분(partial)이고 검증을 거치지 않았다**는 점이 중요하다.
   * 입력 중에는 필드가 비어 있을 수 있고 zod 스키마도 통과하지 않은 원본이다.
   * 초안 저장처럼 불완전한 값을 그대로 받아도 되는 곳에만 쓴다.
   */
  onSubmit: (values: DeepPartialSkipArrayKey<TFieldValues>) => void;
  /** @default 500 */
  delay?: number;
  /** `false`면 구독하지 않는다. 조건부 자동 저장에 쓴다. @default true */
  enabled?: boolean;
}

/**
 * 폼 값이 바뀌면 일정 시간 뒤 자동으로 제출한다.
 *
 * `watch` 구독은 **키 입력마다** 발화하므로 디바운스가 필수다. 없으면
 * "서평"을 입력할 때 글자 수만큼 요청이 나간다.
 *
 * @example
 * ```tsx
 * const { watch } = useFormWithSchema(draftSchema, { defaultValues });
 *
 * useAutoSubmit({
 *   watch,
 *   onSubmit: (draft) => saveDraft(draft),   // draft.title은 undefined일 수 있다
 *   delay: 1000,
 * });
 * ```
 */
export function useAutoSubmit<TFieldValues extends FieldValues>({
  watch,
  onSubmit,
  delay = DEFAULT_DELAY_MS,
  enabled = true,
}: UseAutoSubmitOptions<TFieldValues>) {
  // 항상 최신 콜백을 부르면서 참조는 고정된다. 덕분에 콜백이 매 렌더
  // 새로 만들어져도 구독을 다시 걸 필요가 없다.
  const handleSubmit = useEventCallback(onSubmit);
  const debouncedSubmit = useDebounceCallback(handleSubmit, delay);

  useEffect(() => {
    if (!enabled) return;

    const subscription = watch((values) => {
      debouncedSubmit(values);
    });

    return () => {
      // 대기 중인 호출을 버린다. 취소하지 않으면 언마운트된 뒤에 실행된다.
      debouncedSubmit.cancel();
      subscription.unsubscribe();
    };
  }, [watch, debouncedSubmit, enabled]);
}
