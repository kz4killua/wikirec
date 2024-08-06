import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner"

const inter = Inter({ subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  title: "Wiki Rec - Recommendations for anything!",
  description: "A multi-purpose recommendation engine, powered by Wikipedia",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body id="body" className={inter.className}>
        {children}
        <Toaster richColors />
      </body>
    </html>
  );
}
