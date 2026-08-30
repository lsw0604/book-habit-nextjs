import { LoginForm } from "@/features/login";

export function LoginView() {
  return (
    <div className="flex w-full flex-col gap-6">
      <h1 className="text-[2rem] leading-tight font-bold tracking-[-0.01em] text-title">
        로그인
      </h1>
      <LoginForm />
    </div>
  );
}
