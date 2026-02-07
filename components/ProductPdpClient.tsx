/**
 * Client-side Product Detail Page controller.
 * Owns interactive PDP state and coordinates image switching with variant selection.
 *
 * Architecture note:
 * PDP interaction logic lives in a client wrapper because variant changes are immediate
 * browser interactions that do not require a server round-trip.
 */
"use client";

import Image from "next/image";
import { useMemo, useState } from "react";

import type { ProductDetail, ProductVariant } from "@/lib/types";
import VariantSelector from "@/components/VariantSelector";

type ProductPdpClientProps = {
  product: ProductDetail;
  storeDomain: string;
};

/**
 * ProductPdpClient
 * Props in: a serialized product payload from the server plus Shopify domain.
 * UI out: image panel + product details + variant purchase controls.
 */
export default function ProductPdpClient({
  product,
  storeDomain,
}: ProductPdpClientProps) {
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    product.variants[0] ?? null,
  );

  /**
   * Prefer variant-specific imagery, then product gallery fallback, then featured image.
   * This keeps the PDP visually stable even if some variants do not have dedicated images.
   */
  const selectedImage = useMemo(() => {
    return selectedVariant?.image ?? product.images[0] ?? product.featuredImage;
  }, [product.featuredImage, product.images, selectedVariant]);

  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
      <div className="relative aspect-square overflow-hidden rounded-xl border border-slate-200 bg-white">
        {selectedImage ? (
          <Image
            src={selectedImage.url}
            alt={selectedImage.altText ?? product.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-slate-500">
            No image
          </div>
        )}
      </div>

      <div className="space-y-4">
        <h1 className="text-3xl font-semibold text-slate-900">{product.title}</h1>
        {product.description ? (
          <p className="text-slate-600">{product.description}</p>
        ) : null}
        <VariantSelector
          variants={product.variants}
          storeDomain={storeDomain}
          onSelectedVariantChange={setSelectedVariant}
        />
      </div>
    </div>
  );
}
