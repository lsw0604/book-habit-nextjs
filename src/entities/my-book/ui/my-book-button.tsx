import { cn } from "@/shared/lib";
import { LucideIcon } from "lucide-react";

export interface MyBookButtonProps {
  onClick: () => void;
  icon: LucideIcon;
  label: string;
  isActive?: boolean;
  disabled?: boolean;
  className?: string;
}

export function MyBookButton({
  onClick,
  icon: Icon,
  label,
  isActive = false,
  disabled,
  className,
}: MyBookButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "flex flex-col items-center justify-center py-3 rounded-xl border transition-all active:scale-[0.97]",
        "disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-disabled disabled:text-muted-foreground disabled:border-transparent",
        /*
         * 활성 상태의 hover는 `hover:bg-primary-hover`(버튼 기본값)를 쓰지 않는다.
         * 이미 `bg-primary`로 꽉 찬 칸이 짙은 남색(`--primary-hover`)까지 가면
         * 대비 변화가 너무 커서 깜빡이듯 튄다. DESIGN.md가 active(눌림)처럼
         * 전용 토큰이 없는 자리에 허용하는 대안(opacity 85%)을 그대로 쓴다.
         */
        isActive
          ? "bg-primary text-primary-foreground border-primary font-bold hover:bg-primary/85"
          : "bg-card text-foreground border-border hover:bg-accent",
        className,
      )}
    >
      <Icon size={22} className="mb-1.5" />
      <span className="text-xs font-bold">{label}</span>
    </button>
  );
}
