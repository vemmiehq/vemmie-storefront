import type { Metadata } from "next";
import type { ReactNode } from "react";

import Footer from "@/components/Footer";
import Header from "@/components/Header";

import "./globals.css";

export const metadata: Metadata = {
  title: "Vemmie",
  description: "Vemmie headless storefront."
};

type RootLayoutProps = {
  children: ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body>
        <Header />
        <main className="mx-auto w-full max-w-6xl px-4 py-8">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
