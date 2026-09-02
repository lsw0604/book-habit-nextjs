import { RegisterForm } from "@/features/register";

export function RegisterView() {
  return (
    <div className="flex w-full flex-col gap-6">
      <h1 className="text-[2rem] leading-tight font-bold tracking-[-0.01em] text-title">
        회원가입
      </h1>
      <RegisterForm />
    </div>
  );
}
