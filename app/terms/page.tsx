import type { Metadata } from "next";

import { absoluteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Terms",
  description:
    "Terms and conditions for using the Vemmie storefront and placing orders.",
  alternates: {
    canonical: absoluteUrl("/terms"),
  },
};

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-8 py-2">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold text-slate-900">
          Terms &amp; Conditions
        </h1>
        <p className="text-slate-600">
          By using this site and placing orders, you agree to the terms below.
        </p>
      </header>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold text-slate-900">Store Use</h2>
        <p className="text-slate-600">
          You agree to use this storefront lawfully and provide accurate
          information when placing an order.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold text-slate-900">
          Pricing &amp; Availability
        </h2>
        <p className="text-slate-600">
          Product prices and availability may change without notice. Checkout
          and payment are processed by Shopify.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold text-slate-900">Liability</h2>
        <p className="text-slate-600">
          Vemmie is not liable for indirect or incidental damages arising from
          use of the site or products.
        </p>
      </section>
    </div>
  );
}
