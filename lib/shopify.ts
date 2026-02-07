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
      node: ProductListItem;
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
  return data.products.edges.map((edge) => edge.node);
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
