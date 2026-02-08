/**
 * Server-only Shopify Storefront API client.
 * Centralizes GraphQL access, caching policy, and error normalization for all product reads.
 *
 * Architecture note:
 * Shopify Storefront access stays server-only so the private Storefront token is never exposed
 * to browser bundles or client-side network calls.
 */
import "server-only";

import { REVALIDATE_SECONDS } from "./constants";
import type { ProductDetail, ProductListItem } from "./types";

const STORE_DOMAIN = process.env.SHOPIFY_STORE_DOMAIN;
const PRIVATE_TOKEN = process.env.SHOPIFY_STOREFRONT_PRIVATE_TOKEN;
const API_VERSION = process.env.SHOPIFY_API_VERSION;

/**
 * Builds the Storefront GraphQL endpoint from env vars and fails fast on missing config.
 */
function getShopifyEndpoint(): string {
  if (!STORE_DOMAIN || !PRIVATE_TOKEN || !API_VERSION) {
    throw new Error(
      "Missing Shopify env vars. Expected SHOPIFY_STORE_DOMAIN, SHOPIFY_STOREFRONT_PRIVATE_TOKEN, SHOPIFY_API_VERSION."
    );
  }
  return `https://${STORE_DOMAIN}/api/${API_VERSION}/graphql.json`;
}

type ShopifyGraphQLError = {
  message: string;
};

type ShopifyResponse<T> = {
  data?: T;
  errors?: ShopifyGraphQLError[];
};

/**
 * Executes a typed Shopify GraphQL request with shared revalidation behavior.
 * Throws for transport-level failures and GraphQL error payloads so pages can render friendly UI.
 */
async function shopifyFetch<TData>(query: string, variables?: Record<string, unknown>): Promise<TData> {
  const endpoint = getShopifyEndpoint();

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Shopify-Storefront-Private-Token": PRIVATE_TOKEN as string
    },
    body: JSON.stringify({
      query,
      variables
    }),
    next: {
      revalidate: REVALIDATE_SECONDS
    }
  });

  if (!response.ok) {
    throw new Error(`Shopify request failed (${response.status} ${response.statusText})`);
  }

  const json = (await response.json()) as ShopifyResponse<TData>;
  if (json.errors && json.errors.length > 0) {
    throw new Error(json.errors.map((error) => error.message).join("; "));
  }
  if (!json.data) {
    throw new Error("Shopify response missing data.");
  }

  return json.data;
}

type ProductsQueryResult = {
  products: {
    edges: Array<{
      node: {
        title: string;
        handle: string;
        featuredImage: {
          url: string;
          altText: string | null;
        } | null;
        priceRange: {
          minVariantPrice: {
            amount: string;
            currencyCode: string;
          };
        };
        categoryMetafield: {
          value: string;
        } | null;
        modelMetafield: {
          value: string;
        } | null;
      };
    }>;
  };
};

type ProductByHandleQueryResult = {
  productByHandle: {
    title: string;
    description: string;
    featuredImage: {
      url: string;
      altText: string | null;
    } | null;
    images: {
      edges: Array<{
        node: {
          url: string;
          altText: string | null;
        };
      }>;
    };
    variants: {
      edges: Array<{
        node: {
          id: string;
          title: string;
          availableForSale: boolean;
          price: {
            amount: string;
            currencyCode: string;
          };
          image: {
            url: string;
            altText: string | null;
          } | null;
        };
      }>;
    };
  } | null;
};

const PRODUCTS_QUERY = `
  query ProductsQuery {
    products(first: 50) {
      edges {
        node {
          title
          handle
          featuredImage {
            url
            altText
          }
          priceRange {
            minVariantPrice {
              amount
              currencyCode
            }
          }
          categoryMetafield: metafield(namespace: "custom", key: "category") {
            value
          }
          modelMetafield: metafield(namespace: "custom", key: "model") {
            value
          }
        }
      }
    }
  }
`;

const PRODUCT_BY_HANDLE_QUERY = `
  query ProductByHandleQuery($handle: String!) {
    productByHandle(handle: $handle) {
      title
      description
      featuredImage {
        url
        altText
      }
      images(first: 10) {
        edges {
          node {
            url
            altText
          }
        }
      }
      variants(first: 50) {
        edges {
          node {
            id
            title
            availableForSale
            price {
              amount
              currencyCode
            }
            image {
              url
              altText
            }
          }
        }
      }
    }
  }
`;

export async function getAllProducts(): Promise<ProductListItem[]> {
  const data = await shopifyFetch<ProductsQueryResult>(PRODUCTS_QUERY);
  return data.products.edges.map(({ node }) => ({
    title: node.title,
    handle: node.handle,
    featuredImage: node.featuredImage,
    priceRange: node.priceRange,
    category: node.categoryMetafield?.value ?? null,
    model: node.modelMetafield?.value ?? null
  }));
}

/**
 * Returns all products with category/model metafields normalized into list items.
 */
export async function getAllProductsWithMeta(): Promise<ProductListItem[]> {
  return getAllProducts();
}

function normalizeMetaValue(value: string | null): string | null {
  if (!value) {
    return null;
  }
  const normalized = value.trim().toLowerCase();
  return normalized.length > 0 ? normalized : null;
}

/**
 * Discovers unique case model slugs from Shopify metafields.
 * Sorts by newest iPhone generation first when slug follows iphone-{number} pattern.
 */
export async function getDiscoveredModels(): Promise<string[]> {
  const products = await getAllProductsWithMeta();
  const modelSet = new Set<string>();

  for (const product of products) {
    const category = normalizeMetaValue(product.category);
    const model = normalizeMetaValue(product.model);
    if (category === "case" && model) {
      modelSet.add(model);
    }
  }

  const models = Array.from(modelSet);
  models.sort((a, b) => {
    const aMatch = a.match(/^iphone-(\d+)(?:-.+)?$/);
    const bMatch = b.match(/^iphone-(\d+)(?:-.+)?$/);
    const aGen = aMatch ? Number.parseInt(aMatch[1], 10) : Number.NaN;
    const bGen = bMatch ? Number.parseInt(bMatch[1], 10) : Number.NaN;

    const aHasGen = Number.isFinite(aGen);
    const bHasGen = Number.isFinite(bGen);
    if (aHasGen && bHasGen && aGen !== bGen) {
      return bGen - aGen;
    }
    if (aHasGen && !bHasGen) {
      return -1;
    }
    if (!aHasGen && bHasGen) {
      return 1;
    }
    return b.localeCompare(a);
  });

  return models;
}

const ACCESSORY_CATEGORIES = new Set(["wallet", "charger", "cable"]);

function normalizedCategory(product: ProductListItem): string | null {
  return normalizeMetaValue(product.category);
}

function normalizedModel(product: ProductListItem): string | null {
  return normalizeMetaValue(product.model);
}

/**
 * Filters case products for a given model slug using metafield-backed category/model rules.
 */
export function filterCaseProductsByModel(products: ProductListItem[], modelSlug: string): ProductListItem[] {
  const normalizedModelSlug = normalizeMetaValue(modelSlug);
  if (!normalizedModelSlug) {
    return [];
  }

  return products.filter((product) => {
    const category = normalizedCategory(product);
    const model = normalizedModel(product);
    return category === "case" && model === normalizedModelSlug;
  });
}

/**
 * Filters accessory products by category metafield.
 */
export function filterAccessoryProducts(products: ProductListItem[]): ProductListItem[] {
  return products.filter((product) => {
    const category = normalizedCategory(product);
    return category ? ACCESSORY_CATEGORIES.has(category) : false;
  });
}

/**
 * Fetches all case products for a model slug.
 */
export async function getCaseProductsByModel(modelSlug: string): Promise<ProductListItem[]> {
  const products = await getAllProductsWithMeta();
  return filterCaseProductsByModel(products, modelSlug);
}

/**
 * Fetches all accessory products.
 */
export async function getAccessoryProducts(): Promise<ProductListItem[]> {
  const data = await shopifyFetch<ProductsQueryResult>(PRODUCTS_QUERY);
  const products = data.products.edges.map(({ node }) => ({
    title: node.title,
    handle: node.handle,
    featuredImage: node.featuredImage,
    priceRange: node.priceRange,
    category: node.categoryMetafield?.value ?? null,
    model: node.modelMetafield?.value ?? null
  }));
  return filterAccessoryProducts(products);
}

/**
 * Fetches the complete PDP payload by handle.
 * Returns null when Shopify does not find a matching product so route handlers can trigger 404.
 */
export async function getProductByHandle(handle: string): Promise<ProductDetail | null> {
  const data = await shopifyFetch<ProductByHandleQueryResult>(PRODUCT_BY_HANDLE_QUERY, { handle });
  if (!data.productByHandle) {
    return null;
  }

  return {
    title: data.productByHandle.title,
    description: data.productByHandle.description,
    featuredImage: data.productByHandle.featuredImage,
    images: data.productByHandle.images.edges.map((edge) => edge.node),
    variants: data.productByHandle.variants.edges.map((edge) => edge.node)
  };
}
