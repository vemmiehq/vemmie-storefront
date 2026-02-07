/**
 * Shared collection routing and title-based grouping rules.
 * Maps URL slugs to human labels and infers collection membership from product titles.
 */
import type { ProductListItem } from "./types";

export type CollectionSlug =
  | "iphone-17"
  | "iphone-17-pro"
  | "iphone-17-air"
  | "iphone-17-pro-max";

export const COLLECTIONS: Array<{ slug: CollectionSlug; label: string; match: string }> = [
  { slug: "iphone-17-pro-max", label: "iPhone 17 Pro Max", match: "iPhone 17 Pro Max" },
  { slug: "iphone-17-pro", label: "iPhone 17 Pro", match: "iPhone 17 Pro" },
  { slug: "iphone-17-air", label: "iPhone 17 Air", match: "iPhone 17 Air" },
  { slug: "iphone-17", label: "iPhone 17", match: "iPhone 17" }
];

export function isCollectionSlug(value: string): value is CollectionSlug {
  return COLLECTIONS.some((collection) => collection.slug === value);
}

/**
 * Resolves a slug into its configured collection metadata.
 * Throws on impossible input to keep callers honest when invariants break.
 */
export function getCollectionBySlug(slug: CollectionSlug): { slug: CollectionSlug; label: string; match: string } {
  const found = COLLECTIONS.find((collection) => collection.slug === slug);
  if (!found) {
    throw new Error(`Unknown collection slug: ${slug}`);
  }
  return found;
}

/**
 * Filters products for a single collection by title matching.
 *
 * Important constraint:
 * Matching runs from most specific to least specific model names to prevent false matches
 * (for example, "iPhone 17 Pro Max" should not be grouped under "iPhone 17 Pro").
 */
export function filterProductsForCollection(
  products: ProductListItem[],
  slug: CollectionSlug
): ProductListItem[] {
  return products.filter((product) => {
    const title = product.title.toLowerCase();

    let inferred: CollectionSlug | null = null;

    // Longest → shortest (CRITICAL)
    if (title.includes("iphone 17 pro max")) {
      inferred = "iphone-17-pro-max";
    } else if (title.includes("iphone 17 pro")) {
      inferred = "iphone-17-pro";
    } else if (title.includes("iphone 17 air")) {
      inferred = "iphone-17-air";
    } else if (title.includes("iphone 17")) {
      inferred = "iphone-17";
    }

    return inferred === slug;
  });
}
