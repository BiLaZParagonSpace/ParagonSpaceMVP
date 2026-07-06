import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "ParagonSpace — Цифровые активы на основе данных звезд",
  description: "Блокчейн-проект с 3D-картой звездного неба. Каждый NFT — это цифровой актив, основанный на реальных данных звезд, и к реальному владению небесными телами отношения не имеет.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ru">
      <body className="bg-slate-950 text-slate-100 antialiased">{children}</body>
    </html>
  );
}
