"use client";

import { AlertDialog as AlertDialogPrimitive } from "@base-ui/react/alert-dialog";
import * as React from "react";

import { cn } from "@/shared/lib/utils";

import { Button } from "./button";

/**
 * DESIGN.md ④ AlertDialog 규정에 맞춰 shadcn 기본값을 수정했다.
 *
 * `shadcn add alert-dialog`로 재설치하면 이 파일이 덮어써진다. 그때는 아래
 * 항목들을 다시 적용해야 한다.
 *
 * - import: 생성기가 `from "cn"`으로 뽑는다(존재하지 않는 패키지). `@/shared/lib/utils`로 고친다
 * - z-index: z-50 → `z-40`(⑤ z-modal). 50은 툴팁 자리다
 * - 지면: `bg-popover` → `bg-background dark:bg-card`(④ 파생규칙 1, popover.tsx와 동일)
 * - 깊이: `ring-1 ring-foreground/10` → `border-border` + `shadow-elevation-4`(⑥, 그림자는 하나만)
 * - radius: `rounded-xl` → `rounded-2xl`(④ 모달 16px)
 * - 딤: `bg-black/10` + backdrop-blur → `bg-backdrop`(globals.css 토큰). 블러는 ⑦의 장식 금지에 걸린다
 * - 모션: `duration-100` → 200ms ease-out(⑤ Motion) + `motion-reduce:transition-none`.
 *   생성기의 `data-open:animate-in`(키프레임) 대신 transition을 쓰므로 시작/끝 상태는
 *   `data-[starting-style]` / `data-[ending-style]`로 잡는다 — `data-closed`는 닫혀 **있는**
 *   상태라 열릴 때는 한 번도 붙지 않아서, 그걸 시작점으로 쓰면 전환 없이 최종 위치에 바로 그려진다
 * - 타이포: Title은 H3(`text-xl font-semibold text-title`), Description은 Small
 * - Footer: `bg-muted/50` 툴바 제거 — ①의 미니멀 톤에서 버튼 줄에 지면을 깔지 않는다
 * - `AlertDialogMedia` 삭제: 40px `bg-muted` 아이콘 배지는 ④에 없는 규격이고,
 *   EmptyState가 같은 이유로 배지를 금지한다
 * - `size` prop 삭제: 폭은 `sm:max-w-md` 하나로 고정
 * - 모바일 바텀시트 / 데스크톱 중앙 다이얼로그 분기 추가(⑧)
 */

function AlertDialog({ ...props }: AlertDialogPrimitive.Root.Props) {
  return <AlertDialogPrimitive.Root data-slot="alert-dialog" {...props} />;
}

function AlertDialogTrigger({ ...props }: AlertDialogPrimitive.Trigger.Props) {
  return (
    <AlertDialogPrimitive.Trigger data-slot="alert-dialog-trigger" {...props} />
  );
}

function AlertDialogPortal({ ...props }: AlertDialogPrimitive.Portal.Props) {
  return (
    <AlertDialogPrimitive.Portal data-slot="alert-dialog-portal" {...props} />
  );
}

function AlertDialogOverlay({
  className,
  ...props
}: AlertDialogPrimitive.Backdrop.Props) {
  return (
    <AlertDialogPrimitive.Backdrop
      data-slot="alert-dialog-overlay"
      className={cn(
        "fixed inset-0 isolate z-40 bg-backdrop",
        "transition-opacity duration-200 ease-out motion-reduce:transition-none",
        "data-[starting-style]:opacity-0 data-[ending-style]:opacity-0",
        className,
      )}
      {...props}
    />
  );
}

/**
 * 모바일은 바텀 시트, `sm`↑는 중앙 다이얼로그.
 *
 * 화면 폭을 JS(`useMediaQuery`)로 읽지 않고 `sm:` 브레이크포인트로 가르는 이유는
 * 첫 프레임 때문이다 — JS로 읽으면 값이 확정되기 전에 한 프레임이 그려져 등장
 * 방향이 튄다. CSS는 그 문제 자체가 없다.
 *
 * Tailwind v4는 translate·scale을 각각 CSS 변수로 합성하므로, 중앙 정렬용
 * `-translate-1/2`와 등장 애니메이션용 변위가 같은 `transform`에서 충돌하지 않는다.
 */
function AlertDialogContent({
  className,
  ...props
}: AlertDialogPrimitive.Popup.Props) {
  return (
    <AlertDialogPortal>
      <AlertDialogOverlay />
      <AlertDialogPrimitive.Popup
        data-slot="alert-dialog-content"
        className={cn(
          "fixed z-40 flex flex-col gap-4 border border-border bg-background p-4 text-foreground shadow-elevation-4 outline-none md:p-6 dark:bg-card",
          "transition-all duration-200 ease-out motion-reduce:transition-none",
          // 모바일: 하단에 붙어 아래에서 올라온다. safe-area는 ⑤ 규정.
          "inset-x-0 bottom-0 max-h-[85dvh] overflow-y-auto rounded-t-2xl pb-[max(1rem,env(safe-area-inset-bottom))]",
          "data-[starting-style]:translate-y-full data-[starting-style]:opacity-0",
          "data-[ending-style]:translate-y-full data-[ending-style]:opacity-0",
          // sm↑: 화면 중앙에 떠오른다.
          "sm:inset-x-auto sm:top-1/2 sm:bottom-auto sm:left-1/2 sm:w-[calc(100%-2rem)] sm:max-w-md",
          "sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-2xl sm:pb-6",
          "sm:data-[starting-style]:translate-y-[calc(-50%+0.5rem)] sm:data-[starting-style]:scale-96",
          "sm:data-[ending-style]:translate-y-[calc(-50%+0.5rem)] sm:data-[ending-style]:scale-96",
          className,
        )}
        {...props}
      />
    </AlertDialogPortal>
  );
}

function AlertDialogHeader({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-dialog-header"
      className={cn("flex flex-col gap-1", className)}
      {...props}
    />
  );
}

/**
 * 취소가 먼저 오도록 `flex-col-reverse`를 쓴다. DOM 순서는 취소 → 실행이라
 * 키보드·스크린리더가 덜 파괴적인 쪽을 먼저 만나고, 좁은 화면에서는 실행 버튼이
 * 위로 쌓인다(엄지에서 가장 먼 자리).
 */
function AlertDialogFooter({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-dialog-footer"
      className={cn(
        "flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end",
        className,
      )}
      {...props}
    />
  );
}

function AlertDialogTitle({
  className,
  ...props
}: AlertDialogPrimitive.Title.Props) {
  return (
    <AlertDialogPrimitive.Title
      data-slot="alert-dialog-title"
      className={cn(
        "text-xl leading-[1.35] font-semibold text-title",
        className,
      )}
      {...props}
    />
  );
}

function AlertDialogDescription({
  className,
  ...props
}: AlertDialogPrimitive.Description.Props) {
  return (
    <AlertDialogPrimitive.Description
      data-slot="alert-dialog-description"
      className={cn("text-sm leading-normal text-muted-foreground", className)}
      {...props}
    />
  );
}

/**
 * 실행 버튼. 닫기를 겸하지 않는다 — 뮤테이션이 실패하면 모달이 열린 채 남아야
 * 사용자가 에러를 보고 다시 시도할 수 있다. 닫는 시점은 호출부가 정한다.
 */
function AlertDialogAction({
  variant = "destructive",
  ...props
}: React.ComponentProps<typeof Button>) {
  return <Button data-slot="alert-dialog-action" variant={variant} {...props} />;
}

function AlertDialogCancel({
  className,
  variant = "outline",
  size = "default",
  ...props
}: AlertDialogPrimitive.Close.Props &
  Pick<React.ComponentProps<typeof Button>, "variant" | "size">) {
  return (
    <AlertDialogPrimitive.Close
      data-slot="alert-dialog-cancel"
      className={cn(className)}
      render={<Button variant={variant} size={size} />}
      {...props}
    />
  );
}

export {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  AlertDialogPortal,
  AlertDialogTitle,
  AlertDialogTrigger,
};
