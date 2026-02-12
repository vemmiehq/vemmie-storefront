import type { Metadata } from "next";

import { absoluteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy",
  description: "How Vemmie collects, uses, and protects customer information.",
  alternates: {
    canonical: absoluteUrl("/privacy"),
  },
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-8 py-2">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold text-slate-900">
          Privacy Policy
        </h1>
        <p className="text-slate-600">
          We respect your privacy and only collect data needed to process orders
          and improve the shopping experience.
        </p>
      </header>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold text-slate-900">
          Information We Collect
        </h2>
        <p className="text-slate-600">
          We may collect contact details, shipping information, and order
          history when you make a purchase.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold text-slate-900">
          How We Use Information
        </h2>
        <p className="text-slate-600">
          Your information is used for order fulfillment, customer support, and
          essential store operations.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold text-slate-900">
          Data Protection
        </h2>
        <p className="text-slate-600">
          We use trusted commerce providers and reasonable safeguards to protect
          personal information.
        </p>
      </section>
    </div>
  );
}
