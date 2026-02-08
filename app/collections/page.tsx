/**
 * Server-rendered collections hub.
 * Discovers case models from Shopify metafields and links users into model/accessory collection pages.
 */
import Link from "next/link";

import { formatModelLabel } from "@/lib/format";
import { getDiscoveredModels } from "@/lib/shopify";

export default async function CollectionsHubPage() {
  try {
    const models = await getDiscoveredModels();

    return (
      <div className="space-y-10">
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold text-slate-900">Collections</h1>
          <p className="text-slate-600">Shop by model or browse accessories.</p>
        </div>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-slate-900">Shop by Model</h2>
          {models.length === 0 ? (
            <p className="rounded-md border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
              No case models found. In Shopify, set custom.category=&quot;case&quot; and custom.model on products.
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {models.map((model) => (
                <Link
                  key={model}
                  href={`/collections/models/${model}`}
                  className="rounded-xl border border-slate-200 bg-white p-6 text-lg font-medium text-slate-900 shadow-sm transition hover:border-slate-300 hover:shadow"
                >
                  {formatModelLabel(model)}
                </Link>
              ))}
            </div>
          )}
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-slate-900">Accessories</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Link
              href="/collections/accessories"
              className="rounded-xl border border-slate-200 bg-white p-6 text-lg font-medium text-slate-900 shadow-sm transition hover:border-slate-300 hover:shadow"
            >
              Wallets, Chargers, and Cables
            </Link>
          </div>
        </section>
      </div>
    );
  } catch {
    return (
      <div className="rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-700">
        Could not load collections from Shopify. Check your Storefront API credentials and Headless channel access.
      </div>
    );
  }
}
