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
    default: "医療・介護求人ポータル",
    template: "%s | 医療・介護求人ポータル",
  },
  description: "医療・介護業界の求人情報を探すならこちら。看護師、介護士、医師など多数の求人を掲載中。",
  keywords: ["医療求人", "介護求人", "看護師", "介護士", "医師", "薬剤師", "転職"],
  openGraph: {
    type: "website",
    locale: "ja_JP",
    title: "医療・介護求人ポータル",
    description: "医療・介護業界の求人情報を探すならこちら。",
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
