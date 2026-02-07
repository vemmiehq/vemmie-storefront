/**
 * Shared product preview card.
 * Used across home and collection grids to present a compact route into PDP.
 */
import Image from "next/image";
import Link from "next/link";

import type { ProductListItem } from "@/lib/types";
import { formatPrice } from "@/lib/utils";

type ProductCardProps = {
  product: ProductListItem;
};

/**
 * ProductCard
 * Props in: lightweight product list data.
 * UI out: image, title, starting price, and deep-link to the product handle route.
 */
export default function ProductCard({ product }: ProductCardProps) {
  return (
    <article className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <Link href={`/products/${product.handle}`} className="block">
        <div className="relative aspect-square w-full bg-slate-100">
          {product.featuredImage ? (
            <Image
              src={product.featuredImage.url}
              alt={product.featuredImage.altText ?? product.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 25vw"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-slate-500">No image</div>
          )}
        </div>
        <div className="space-y-2 p-4">
          <h3 className="line-clamp-2 text-base font-semibold text-slate-900">{product.title}</h3>
          <p className="text-sm text-slate-600">
            {formatPrice(
              product.priceRange.minVariantPrice.amount,
              product.priceRange.minVariantPrice.currencyCode
            )}
          </p>
        </div>
      </Link>
    </article>
  );
}
