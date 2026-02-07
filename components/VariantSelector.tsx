/**
 * Client-only variant purchase controls.
 * Renders selectable variants, displays price/availability, and builds Shopify cart/checkout redirects.
 *
 * Architecture note:
 * Checkout is intentionally redirected to Shopify instead of embedded here so Shopify remains
 * the system of record for cart, tax, payment, and fraud flows.
 */
"use client";

import { useEffect, useMemo, useState } from "react";

import type { ProductVariant } from "@/lib/types";
import { formatPrice, toNumericVariantId } from "@/lib/utils";

type VariantSelectorProps = {
  variants: ProductVariant[];
  storeDomain: string;
  onSelectedVariantChange?: (variant: ProductVariant) => void;
};

/**
 * VariantSelector
 * Props in: variant list + Shopify domain + optional selection callback.
 * UI out: color buttons, live price, stock state, and purchase links.
 *
 * State ownership:
 * The selector owns which variant is active and emits changes upward when parent components
 * need to react (for example, swapping PDP imagery).
 */
export default function VariantSelector({
  variants,
  storeDomain,
  onSelectedVariantChange,
}: VariantSelectorProps) {
  const [selectedVariantId, setSelectedVariantId] = useState<string>(
    variants[0]?.id ?? "",
  );

  const selectedVariant = useMemo(
    () =>
      variants.find((variant) => variant.id === selectedVariantId) ??
      variants[0] ??
      null,
    [selectedVariantId, variants],
  );

  if (!selectedVariant) {
    return <p className="text-sm text-slate-600">No variants available.</p>;
  }

  /**
   * Keep parent UI in sync with this component's local variant selection.
   */
  useEffect(() => {
    onSelectedVariantChange?.(selectedVariant);
  }, [onSelectedVariantChange, selectedVariant]);

  const numericId = toNumericVariantId(selectedVariant.id);
  const cartUrl = `https://${storeDomain}/cart/${numericId}:1`;
  const checkoutUrl = `${cartUrl}?checkout`;

  return (
    <div className="space-y-4">
      <div>
        <p className="mb-2 text-sm font-medium text-slate-700">Color</p>
        <div className="flex flex-wrap gap-2">
          {variants.map((variant) => {
            const isSelected = variant.id === selectedVariant.id;
            return (
              <button
                key={variant.id}
                type="button"
                onClick={() => setSelectedVariantId(variant.id)}
                className={`rounded-md border px-3 py-2 text-sm transition ${
                  isSelected
                    ? "border-slate-900 bg-slate-900 text-white"
                    : "border-slate-300 bg-white text-slate-700 hover:border-slate-400"
                }`}
              >
                {variant.title}
              </button>
            );
          })}
        </div>
      </div>

      <p className="text-lg font-semibold text-slate-900">
        {formatPrice(
          selectedVariant.price.amount,
          selectedVariant.price.currencyCode,
        )}
      </p>

      {!selectedVariant.availableForSale && (
        <p className="text-sm font-medium text-red-600">Out of stock</p>
      )}

      <div className="flex flex-col gap-3 sm:flex-row">
        <a
          href={cartUrl}
          className="inline-flex items-center justify-center rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-800 transition hover:bg-slate-100"
        >
          Add to Cart
        </a>
        <a
          href={selectedVariant.availableForSale ? checkoutUrl : "#"}
          aria-disabled={!selectedVariant.availableForSale}
          className={`inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium text-white ${
            selectedVariant.availableForSale
              ? "bg-slate-900 hover:bg-slate-800"
              : "cursor-not-allowed bg-slate-400"
          }`}
          onClick={(event) => {
            if (!selectedVariant.availableForSale) {
              event.preventDefault();
            }
          }}
        >
          Buy Now
        </a>
      </div>

      <p className="text-sm text-slate-500">
        Secure checkout powered by Shopify.
      </p>
    </div>
  );
}
