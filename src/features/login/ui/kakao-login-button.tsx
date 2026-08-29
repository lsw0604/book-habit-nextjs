import { KakaoIcon } from "@/shared/assets";
import { Button } from "@/shared/ui";

import { useKakaoLogin } from "../hooks";

export function KakaoLoginButton() {
  const { pushToKakaoLogin } = useKakaoLogin();

  return (
    <Button
      type="button"
      variant="secondary"
      onClick={pushToKakaoLogin}
      className="w-full bg-[#FEE500] text-black/85 hover:bg-[#FDD800]"
    >
      <KakaoIcon className="size-5" />
      카카오로 로그인
    </Button>
  );
}
