import type { Metadata } from "next";
import Link from "next/link";

import { absoluteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact Vemmie support for order or product questions.",
  alternates: {
    canonical: absoluteUrl("/contact"),
  },
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-8 py-2">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold text-slate-900">Contact</h1>
        <p className="text-slate-600">
          Need help with an order or product? Our support team is here to help.
        </p>
      </header>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold text-slate-900">Support Email</h2>
        <p className="text-slate-600">
          Reach us at{" "}
          <a
            href="mailto:support@vemmie.com"
            className="font-medium text-slate-900 underline hover:text-slate-700"
          >
            support@vemmie.com
          </a>
          .
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold text-slate-900">Response Time</h2>
        <p className="text-slate-600">
          We typically respond within 1-2 business days. Please include your
          order number when available.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold text-slate-900">Helpful Links</h2>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/shipping-returns"
            className="text-slate-700 underline hover:text-slate-900"
          >
            Shipping &amp; Returns
          </Link>
          <Link
            href="/privacy"
            className="text-slate-700 underline hover:text-slate-900"
          >
            Privacy
          </Link>
          <Link
            href="/terms"
            className="text-slate-700 underline hover:text-slate-900"
          >
            Terms
          </Link>
        </div>
      </section>
    </div>
  );
}
