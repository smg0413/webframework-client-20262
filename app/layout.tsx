import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ReactNode } from "react";
import { AuthStoreProvider } from "@/providers/auth-store-providers";
import AppShell from "@/components/layout/AppShell";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "웹 프레임워크 실습",
  description: "회원가입과 로그인 실습",
};

export default function RootLayout(
  { children }: Readonly<{ children: ReactNode }>
) {
  return (
    <html lang="ko">
      <body>
      <AuthStoreProvider>
        <AppShell>
          {children}
        </AppShell>
      </AuthStoreProvider>
      </body>
    </html>
  );
}
