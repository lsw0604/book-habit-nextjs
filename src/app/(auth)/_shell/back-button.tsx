"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

import { getLastMainPath } from "@/shared/lib";
import { Button } from "@/shared/ui";

/** (main)에서 마지막으로 머문 경로로 돌아간다. 기록이 없으면 홈으로 이동한다. */
export function BackButton() {
  const router = useRouter();

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      aria-label="이전 화면으로 돌아가기"
      onClick={() => router.push(getLastMainPath())}
    >
      <ArrowLeft />
    </Button>
  );
}
