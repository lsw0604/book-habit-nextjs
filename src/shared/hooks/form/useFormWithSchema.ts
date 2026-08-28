"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  useForm,
  type DefaultValues,
  type FieldValues,
  type Resolver,
  type SubmitErrorHandler,
  type SubmitHandler,
  type UseFormHandleSubmit,
  type UseFormProps,
  type UseFormReturn,
} from "react-hook-form";
import type { input as ZodInput, output as ZodOutput, ZodType } from "zod";

/**
 * `useForm`의 옵션을 그대로 받되 두 가지만 손본다.
 *
 * - `resolver`: 스키마에서 만들어지므로 밖에서 넘길 수 없다
 * - `defaultValues`: 선택이 아니라 **필수**다. 없으면 첫 렌더에서 인풋이
 *   uncontrolled로 시작해 값을 넣는 순간 React가 경고한다.
 *
 * 나머지(`mode`·`values`·`criteriaMode`·`reValidateMode`·`shouldFocusError`
 * 등)는 열어둔다. 필요한 옵션이 생길 때마다 이 훅을 고치게 만들지 않기 위해서다.
 */
interface UseFormWithSchemaOptions<
  TFieldValues extends FieldValues,
  TContext,
  TTransformedValues,
> extends Omit<
    UseFormProps<TFieldValues, TContext, TTransformedValues>,
    "resolver" | "defaultValues"
  > {
  defaultValues: DefaultValues<TFieldValues>;
  /**
   * 제출이 **성공한 뒤에만** 폼을 비운다.
   *
   * 실패 시에는 비우지 않는다. 로그인이 401로 실패했는데 입력값이 사라지면
   * 사용자가 비밀번호를 다시 다 쳐야 한다.
   */
  resetOnSubmit?: boolean;
}

/**
 * zod 스키마로 검증하는 react-hook-form 훅.
 *
 * ## 제네릭이 둘인 이유
 *
 * 폼이 들고 있는 값(`z.input`)과 zod가 파싱한 값(`z.output`)은 다를 수 있다.
 * `z.coerce.number()`면 인풋에는 문자열이 들어가고 제출 시 숫자가 나온다.
 * 하나로 뭉뚱그리면 `defaultValues` 타입이 거짓이 된다.
 *
 * ## `isSubmitting`을 쓰려면 `onValid`가 Promise를 반환해야 한다
 *
 * react-hook-form은 핸들러가 반환한 Promise가 끝날 때까지 `isSubmitting`을
 * 유지한다. TanStack Query와 함께 쓴다면 `mutate`가 아니라 **`mutateAsync`**를
 * 써야 로딩 상태와 중복 제출 방지가 동작한다.
 *
 * @example
 * ```tsx
 * const form = useFormWithSchema(loginSchema, {
 *   defaultValues: { email: "", password: "" },
 * });
 *
 * <form onSubmit={form.handleSubmit(async (values) => {
 *   await login.mutateAsync(values); // mutate가 아니라 mutateAsync
 * })}>
 * ```
 */
export function useFormWithSchema<
  TSchema extends ZodType<FieldValues, FieldValues>,
>(
  schema: TSchema,
  options: UseFormWithSchemaOptions<
    ZodInput<TSchema>,
    unknown,
    ZodOutput<TSchema>
  >,
): UseFormReturn<ZodInput<TSchema>, unknown, ZodOutput<TSchema>> & {
  resetForm: () => void;
} {
  type TInput = ZodInput<TSchema>;
  type TOutput = ZodOutput<TSchema>;

  const {
    defaultValues,
    resetOnSubmit = false,
    mode = "onSubmit",
    ...formProps
  } = options;

  const methods = useForm<TInput, unknown, TOutput>({
    // 나머지 useForm 옵션을 그대로 흘려보낸다.
    ...formProps,
    // zodResolver는 제네릭 제약(ZodType<FieldValues, FieldValues>)까지만 보고
    // 실제 스키마의 input/output을 좁히지 못한다. 좁힘은 위 제네릭이 이미
    // 보장하므로 여기서만 단언한다.
    resolver: zodResolver(schema) as unknown as Resolver<
      TInput,
      unknown,
      TOutput
    >,
    defaultValues,
    mode,
  });

  const { handleSubmit: originalHandleSubmit, reset } = methods;

  /**
   * `TResult`를 그대로 흘려보낸다. react-hook-form의 `handleSubmit`은 핸들러의
   * 반환값을 호출부까지 전파하는데, 여기서 끊으면 그 계약이 깨진다.
   */
  const handleSubmit = <TResult>(
    onValid: SubmitHandler<TOutput, TResult>,
    onInvalid?: SubmitErrorHandler<TInput>,
  ) =>
    originalHandleSubmit<Promise<TResult>>(async (data, event) => {
      // await 해야 두 가지가 성립한다.
      // 1. 비동기 작업이 끝날 때까지 isSubmitting이 유지된다
      // 2. 실패해서 throw되면 아래 reset이 실행되지 않는다
      const result = await onValid(data, event);

      if (resetOnSubmit) reset(defaultValues);

      return result;
    }, onInvalid);

  const resetForm = () => reset(defaultValues);

  return {
    ...methods,
    handleSubmit: handleSubmit as UseFormHandleSubmit<TInput, TOutput>,
    resetForm,
  };
}
