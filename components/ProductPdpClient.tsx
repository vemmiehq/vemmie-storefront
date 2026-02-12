"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

import type { ProductImage, ProductVariant } from "@/lib/types";
import VariantSelector from "@/components/VariantSelector";

type ProductPdpClientProps = {
  title: string;
  description: string;
  featuredImage: ProductImage | null;
  images: ProductImage[];
  variants: ProductVariant[];
  storeDomain: string;
};

export default function ProductPdpClient({
  title,
  description,
  featuredImage,
  images,
  variants,
  storeDomain,
}: ProductPdpClientProps) {
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    variants[0] ?? null,
  );

  // ✅ Micro-fix: when navigating to a new product (new variants array),
  // reset the selected variant to the first option.
  useEffect(() => {
    setSelectedVariant(variants[0] ?? null);
  }, [variants]);

  const selectedImage = useMemo(() => {
    return selectedVariant?.image ?? images[0] ?? featuredImage ?? null;
  }, [featuredImage, images, selectedVariant]);

  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
      <div className="relative aspect-square overflow-hidden rounded-xl border border-slate-200 bg-white">
        {selectedImage ? (
          <Image
            src={selectedImage.url}
            alt={selectedImage.altText ?? title}
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
        <h1 className="text-3xl font-semibold text-slate-900">{title}</h1>
        {description ? <p className="text-slate-600">{description}</p> : null}

        <VariantSelector
          variants={variants}
          storeDomain={storeDomain}
          onSelectedVariantChange={setSelectedVariant}
        />
      </div>
    </div>
  );
}
