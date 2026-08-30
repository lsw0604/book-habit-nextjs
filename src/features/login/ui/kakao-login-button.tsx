import { API_ENDPOINTS } from "@/shared/api";
import { KakaoIcon } from "@/shared/assets";
import { Button } from "@/shared/ui";

const KAKAO_LOGIN_URL = `${process.env.NEXT_PUBLIC_SERVER}${API_ENDPOINTS.AUTH.KAKAO_AUTHORIZE}`;

/**
 * DESIGN.md ⑦은 버튼을 블루 계열로만 구성하도록 규정하지만, 카카오 로그인
 * 버튼은 카카오 개발자 가이드가 배경 #FEE500 · 텍스트 rgba(0,0,0,.85)를
 * 요구하는 서드파티 브랜드 규정이라 예외로 유지한다. KakaoIcon SVG는
 * 색상이 경로에 고정되어 있어 fill 유틸리티는 적용되지 않는다.
 *
 * 백엔드가 인가 URL 빌드·state 발급·콜백 처리를 전부 소유하므로(카카오 →
 * 백엔드 → 프론트 302 리다이렉트), 여기선 풀 페이지 이동만 하면 된다.
 * client-side 라우팅이 아닌 실제 `<a>`로 렌더링한다(base-ui Button의
 * `render` prop으로 폴리모픽 처리).
 */
export function KakaoLoginButton() {
  return (
    <Button
      render={<a href={KAKAO_LOGIN_URL} />}
      nativeButton={false}
      variant="secondary"
      className="w-full bg-[#FEE500] text-black/85 hover:bg-[#FDD800]"
    >
      <KakaoIcon className="size-5" />
      카카오로 로그인
    </Button>
  );
}
