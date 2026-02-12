import type { Metadata } from "next";

import { absoluteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Shipping & Returns",
  description:
    "Shipping timelines, order processing, and returns policy for Vemmie orders.",
  alternates: {
    canonical: absoluteUrl("/shipping-returns"),
  },
};

export default function ShippingReturnsPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-8 py-2">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold text-slate-900">
          Shipping &amp; Returns
        </h1>
        <p className="text-slate-600">
          We keep fulfillment simple and transparent so you know what to expect
          from purchase to delivery.
        </p>
      </header>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold text-slate-900">
          Order Processing
        </h2>
        <p className="text-slate-600">
          Orders are typically processed within 1-2 business days. During major
          launches or holidays, processing times may be slightly longer.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold text-slate-900">Shipping</h2>
        <p className="text-slate-600">
          Shipping speed and pricing are shown at checkout. Tracking details are
          sent by email once your order ships.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold text-slate-900">
          Returns &amp; Exchanges
        </h2>
        <p className="text-slate-600">
          If your item arrives damaged or incorrect, contact support within 14
          days of delivery and we will help resolve it quickly.
        </p>
      </section>
    </div>
  );
}
