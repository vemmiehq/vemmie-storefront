/**
 * Server-rendered storefront home route.
 * Composes hero messaging, model navigation links, and the featured product grid.
 */
import Link from "next/link";

import ProductCard from "@/components/ProductCard";
import { formatModelLabel } from "@/lib/format";
import { getAllProducts, getDiscoveredModels } from "@/lib/shopify";

/**
 * HomePage
 * Data flow: server fetches product list, then renders static hero + dynamic featured cards.
 */
export default async function HomePage() {
  try {
    const [products, models] = await Promise.all([getAllProducts(), getDiscoveredModels()]);

    return (
      <div className="space-y-10">
        <section className="rounded-2xl bg-slate-900 px-6 py-12 text-white">
          <p className="text-sm uppercase tracking-[0.2em] text-slate-300">Vemmie TPU Collection</p>
          <h1 className="mt-3 text-3xl font-semibold sm:text-4xl">Protect your iPhone 17 with a clean TPU fit.</h1>
          <p className="mt-3 max-w-2xl text-slate-300">
            Minimal case design, reliable daily protection, and secure Shopify checkout.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            {models.map((model) => (
              <Link
                key={model}
                href={`/collections/models/${model}`}
                className="rounded-md bg-white/10 px-4 py-2 text-sm font-medium hover:bg-white/20"
              >
                {formatModelLabel(model)}
              </Link>
            ))}
            <Link
              href="/collections/accessories"
              className="rounded-md bg-white/10 px-4 py-2 text-sm font-medium hover:bg-white/20"
            >
              Accessories
            </Link>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-slate-900">Featured Products</h2>
          {products.length === 0 ? (
            <p className="rounded-md border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
              No products found. In Shopify, check product availability to the Headless sales channel.
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {products.map((product) => (
                <ProductCard key={product.handle} product={product} />
              ))}
            </div>
          )}
        </section>
      </div>
    );
  } catch (error) {
    return (
      <div className="rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-700">
        Could not load products from Shopify. Check your Storefront API credentials and Headless channel access.
      </div>
    );
  }
}
