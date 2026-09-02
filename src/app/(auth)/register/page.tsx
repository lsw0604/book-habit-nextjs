import type { Metadata } from "next";

import { RegisterView } from "@/views/register-view";

export const metadata: Metadata = {
  title: "회원가입 · book-habit",
};

export default function RegisterPage() {
  return <RegisterView />;
}
