import type { Metadata } from "next";
import type { ReactNode } from "react";

import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { SITE_NAME, SITE_URL, absoluteUrl } from "@/lib/site";

import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },
  description:
    "Shop Vemmie protective cases and accessories with secure Shopify checkout.",
  alternates: {
    canonical: absoluteUrl("/"),
  },
  openGraph: {
    siteName: SITE_NAME,
    type: "website",
    url: absoluteUrl("/"),
  },
  twitter: {
    card: "summary",
    title: SITE_NAME,
    description:
      "Shop Vemmie protective cases and accessories with secure Shopify checkout.",
  },
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
