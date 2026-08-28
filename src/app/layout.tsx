import type { Metadata } from "next";
import { Geist, Geist_Mono, Noto_Sans_KR } from "next/font/google";
import "./globals.css";
import { ApiProvider, AuthProvider, QueryProvider } from "./_providers";

/**
 * 라틴·숫자용. Geist에는 한글 글리프가 없다.
 * 폰트 폴백은 글리프 단위로 동작하므로, 한글은 아래 `notoSansKR`이 받는다.
 */
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

/** 스트릭 일수·통계 수치용. DESIGN.md의 Stat 스케일이 이 폰트를 쓴다. */
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

/**
 * 한글용.
 *
 * `subsets`에 `korean`이 없다 — Google Fonts가 CJK는 별도 subset으로 노출하지
 * 않고 unicode-range로 잘게 쪼개 서빙하기 때문이다. `latin`만 지정해도 한글
 * 슬라이스가 함께 생성된다.
 */
const notoSansKR = Noto_Sans_KR({
  variable: "--font-noto-sans-kr",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: "book-habit",
  description: "독서 습관 트래커",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="ko"
      className={`${geistSans.variable} ${geistMono.variable} ${notoSansKR.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <QueryProvider>
          <ApiProvider>
            <AuthProvider>{children}</AuthProvider>
          </ApiProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
