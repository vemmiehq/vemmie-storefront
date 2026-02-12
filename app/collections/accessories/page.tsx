/**
 * Server-rendered accessories collection route.
 * Shows products where custom.category is wallet, charger, or cable.
 */
import type { Metadata } from "next";

import ProductCard from "@/components/ProductCard";
import { absoluteUrl } from "@/lib/site";
import { getAccessoryProducts } from "@/lib/shopify";

export const metadata: Metadata = {
  title: "Accessories",
  description: "Shop Vemmie wallets, chargers, and cables.",
  alternates: {
    canonical: absoluteUrl("/collections/accessories"),
  },
  openGraph: {
    title: "Accessories",
    description: "Shop Vemmie wallets, chargers, and cables.",
    url: absoluteUrl("/collections/accessories"),
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Accessories",
    description: "Shop Vemmie wallets, chargers, and cables.",
  },
};

export default async function AccessoriesCollectionPage() {
  try {
    const products = await getAccessoryProducts();

    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-semibold text-slate-900">Accessories</h1>

        {products.length === 0 ? (
          <p className="rounded-md border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
            No accessories found. In Shopify, set custom.category to wallet,
            charger, or cable.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <ProductCard key={product.handle} product={product} />
            ))}
          </div>
        )}
      </div>
    );
  } catch {
    return (
      <div className="rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-700">
        Could not load products from Shopify. Check your Storefront API
        credentials and Headless channel access.
      </div>
    );
  }
}
