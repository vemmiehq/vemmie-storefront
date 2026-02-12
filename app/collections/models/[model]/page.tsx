/**
 * Server-rendered dynamic model collection route.
 * Renders case products where custom.category=case and custom.model matches the route model slug.
 */
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import ProductCard from "@/components/ProductCard";
import { formatModelLabel } from "@/lib/format";
import { absoluteUrl } from "@/lib/site";
import {
  filterCaseProductsByModel,
  getAllProductsWithMeta,
  getDiscoveredModels,
} from "@/lib/shopify";

type ModelCollectionPageProps = {
  params: {
    model: string;
  };
};

export async function generateStaticParams() {
  const models = await getDiscoveredModels();
  return models.map((model) => ({ model }));
}

export async function generateMetadata({
  params,
}: ModelCollectionPageProps): Promise<Metadata> {
  const models = await getDiscoveredModels();
  const normalizedModel = params.model.toLowerCase().trim();
  if (!models.includes(normalizedModel)) {
    return {};
  }

  const label = formatModelLabel(normalizedModel);
  const title = `${label} Cases`;
  const description = `Shop Vemmie TPU cases for ${label}.`;
  const canonical = absoluteUrl(`/collections/models/${normalizedModel}`);

  return {
    title,
    description,
    alternates: {
      canonical,
    },
    openGraph: {
      title,
      description,
      url: canonical,
      type: "website",
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
  };
}

export default async function ModelCollectionPage({
  params,
}: ModelCollectionPageProps) {
  const normalizedModel = params.model.toLowerCase().trim();

  try {
    const [models, products] = await Promise.all([
      getDiscoveredModels(),
      getAllProductsWithMeta(),
    ]);
    if (!models.includes(normalizedModel)) {
      notFound();
    }

    const filtered = filterCaseProductsByModel(products, normalizedModel);

    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-semibold text-slate-900">
          {formatModelLabel(normalizedModel)}
        </h1>

        {filtered.length === 0 ? (
          <p className="rounded-md border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
            No products found for this model. In Shopify, ensure
            custom.category=&quot;case&quot; and custom.model=&quot;
            {normalizedModel}&quot;.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((product) => (
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
