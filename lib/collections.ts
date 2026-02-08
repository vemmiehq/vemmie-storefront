/**
 * Shared collection constants for route behavior.
 * Maintains legacy model slugs used by pre-existing /collections/:slug URLs.
 */
export const LEGACY_MODEL_SLUGS = [
  "iphone-17",
  "iphone-17-pro",
  "iphone-17-air",
  "iphone-17-pro-max"
] as const;

export type LegacyModelSlug = (typeof LEGACY_MODEL_SLUGS)[number];

export function isLegacyModelSlug(value: string): value is LegacyModelSlug {
  return LEGACY_MODEL_SLUGS.some((slug) => slug === value);
}
