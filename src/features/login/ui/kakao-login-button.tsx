import { API_ENDPOINTS } from "@/shared/api";
import { KakaoIcon } from "@/shared/assets";
import { Button } from "@/shared/ui";

const KAKAO_LOGIN_URL = `${process.env.NEXT_PUBLIC_SERVER}${API_ENDPOINTS.AUTH.KAKAO_AUTHORIZE}`;

export function KakaoLoginButton() {
  return (
    <Button
      render={<a href={KAKAO_LOGIN_URL} />}
      nativeButton={false}
      variant="secondary"
      className="w-full bg-[#FEE500] text-black/85 hover:bg-[#FDD800] hover:text-black/85"
    >
      <KakaoIcon className="size-5" />
      카카오로 로그인
    </Button>
  );
}
