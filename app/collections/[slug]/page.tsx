/**
 * Server-rendered collection detail route.
 * Validates collection slug, fetches product list, then applies title-based grouping rules.
 */
import { notFound } from "next/navigation";

import ProductCard from "@/components/ProductCard";
import { COLLECTIONS, filterProductsForCollection, isCollectionSlug } from "@/lib/collections";
import { getAllProducts } from "@/lib/shopify";

type CollectionPageProps = {
  params: {
    slug: string;
  };
};

/**
 * Pre-generates known collection slugs for predictable routing and caching behavior.
 */
export function generateStaticParams() {
  return COLLECTIONS.map((collection) => ({ slug: collection.slug }));
}

/**
 * CollectionPage
 * Params in: collection slug.
 * UI out: collection header plus filtered product grid, with empty/error fallbacks.
 */
export default async function CollectionPage({ params }: CollectionPageProps) {
  if (!isCollectionSlug(params.slug)) {
    notFound();
  }

  const collection = COLLECTIONS.find((item) => item.slug === params.slug);
  if (!collection) {
    notFound();
  }

  try {
    const allProducts = await getAllProducts();
    const products = filterProductsForCollection(allProducts, collection.slug);

    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-semibold text-slate-900">{collection.label}</h1>

        {products.length === 0 ? (
          <p className="rounded-md border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
            No products found for this model. In Shopify, check product availability to the Headless sales channel.
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
        Could not load products from Shopify. Check your Storefront API credentials and Headless channel access.
      </div>
    );
  }
}
