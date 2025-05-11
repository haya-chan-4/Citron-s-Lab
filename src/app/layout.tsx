// src/app/layout.tsx
import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer/Footer";


const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "シトロンのサブカルラボ",
  description: "シトロンのサブカルラボです。",
  keywords: [
    "アニメ",
    "漫画",
    "AI",
    "X",
    "TikTok",
    "Blue Lock",
    "ブルーロック",
    "原神",
  ],
  openGraph: {
    title: "シトロンのサブカルラボ",
    description: "アニメ・漫画・AIなどを語るブログ",
    // url: "https://your-domain.com",
    siteName: "シトロンのサブカルラボ",
    images: [
      {
        url: "/public/images/Citron.png", // publicフォルダに置く
        width: 1200,
        height: 630,
        alt: "シトロンのサブカルラボのアイコンです",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "シトロンのサブカルラボ",
    description: "アニメ・漫画・AIなどを語るブログ",
    images: ["/og-image.png"],
  },
  icons: {
    icon: "/favicon.ico", // public フォルダに配置
  },
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="jp">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen text-gray-600 text-sm font-sans bg-white m-0`}
      >
        <Header title={"Citron's Lab"} />
        {children}
        <Footer />
      </body>
    </html>
  );
}
