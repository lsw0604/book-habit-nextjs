import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ApiProvider, QueryProvider } from "./_providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "book-habit",
  description: "독서 습관 트래커",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {/* ApiProvider가 세션 만료 시 queryClient.clear()를 호출하므로
            QueryProvider 안쪽에 있어야 한다. */}
        <QueryProvider>
          <ApiProvider>{children}</ApiProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
