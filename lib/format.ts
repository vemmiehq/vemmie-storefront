/**
 * Shared display formatting helpers for collection and model labels.
 */

function toTitleWord(word: string): string {
  if (word.length === 0) {
    return "";
  }
  return word[0].toUpperCase() + word.slice(1);
}

/**
 * Converts model slugs into user-facing labels.
 * Example: iphone-17-pro-max -> iPhone 17 Pro Max
 */
export function formatModelLabel(modelSlug: string): string {
  const normalized = modelSlug.toLowerCase().trim();
  if (normalized.length === 0) {
    return "";
  }

  const parts = normalized.split("-").filter(Boolean);
  if (parts.length === 0) {
    return normalized;
  }

  return parts
    .map((part, index) => {
      if (index === 0 && part === "iphone") {
        return "iPhone";
      }
      if (/^\d+$/.test(part)) {
        return part;
      }
      return toTitleWord(part);
    })
    .join(" ");
}
