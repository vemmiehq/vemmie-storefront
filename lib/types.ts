/**
 * Shared storefront domain types.
 * Defines the JSON-safe product/variant shape exchanged between server data loaders and UI components.
 *
 * Architecture note:
 * Only plain serializable values are modeled here so data can be safely passed
 * from Server Components to Client Components.
 */
export type Money = {
  amount: string;
  currencyCode: string;
};

export type ProductImage = {
  url: string;
  altText: string | null;
};

export type ProductListItem = {
  title: string;
  handle: string;
  featuredImage: ProductImage | null;
  priceRange: {
    minVariantPrice: Money;
  };
};

export type ProductVariant = {
  id: string;
  title: string;
  availableForSale: boolean;
  price: Money;
  image: ProductImage | null;
};

export type ProductDetail = {
  title: string;
  description: string;
  featuredImage: ProductImage | null;
  images: ProductImage[];
  variants: ProductVariant[];
};
