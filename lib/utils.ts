/**
 * Shared formatting and identifier helpers used by storefront UI components.
 */
/**
 * Converts a Shopify GraphQL global variant ID into the numeric ID required by
 * Shopify cart and checkout redirect URLs.
 */
export function toNumericVariantId(gid: string): string {
  const parts = gid.split("/");
  const last = parts[parts.length - 1] ?? "";
  if (!/^\d+$/.test(last)) {
    throw new Error(`Invalid Shopify variant gid: ${gid}`);
  }
  return last;
}

/**
 * Formats a Shopify money amount for US storefront display.
 * Falls back to raw amount+currency if the value cannot be parsed.
 */
export function formatPrice(amount: string, currencyCode: string): string {
  const value = Number(amount);
  if (!Number.isFinite(value)) {
    return `${amount} ${currencyCode}`;
  }
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currencyCode
  }).format(value);
}
