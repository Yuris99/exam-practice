import type { Metadata, Viewport } from "next";
import { themeInitializationScript } from "@/lib/theme";
import "./globals.css";
import "./design-refresh.css";
import "./themes.css";
import "katex/dist/katex.min.css";

export const metadata: Metadata = {
  title: "자격증 문제 연습",
  description: "필기 CBT와 실기 필답형 자격증 문제 연습",
  applicationName: "자격증 문제 연습",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "자격증 연습"
  },
  icons: {
    icon: "/icon.svg",
    apple: "/icon-192.png"
  }
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#eef2f0"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <head><script dangerouslySetInnerHTML={{ __html: themeInitializationScript }} /></head>
      <body>{children}</body>
    </html>
  );
}
