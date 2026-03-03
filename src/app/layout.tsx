import type { Metadata } from "next";
import { Noto_Sans_JP } from "next/font/google";
import "./globals.css";

const notoSansJP = Noto_Sans_JP({
  subsets: ["latin"],
  variable: "--font-noto-sans-jp",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "沖縄介護求人ジョブ",
    template: "%s | 沖縄介護求人ジョブ",
  },
  description: "沖縄の医療・介護業界の求人情報を探すなら沖縄メディケアワーク。看護師、介護士、医師など多数の求人を掲載中。",
  keywords: ["沖縄", "介護求人", "看護師求人", "医療求人", "介護士", "転職", "沖縄メディケアワーク"],
  openGraph: {
    type: "website",
    locale: "ja_JP",
    title: "沖縄介護求人ジョブ | 沖縄メディケアワーク",
    description: "沖縄の医療・介護業界の求人情報を探すなら沖縄メディケアワーク。",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" suppressHydrationWarning>
      <body className={`${notoSansJP.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
