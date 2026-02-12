/**
 * Dynamic XML sitemap route.
 * Includes core pages, discovered model collections, accessories, PDPs, and optional policy/contact pages.
 */
import { getAllProductsWithMeta, getDiscoveredModels } from "@/lib/shopify";
import { absoluteUrl } from "@/lib/site";

const STATIC_PATHS = ["/", "/collections", "/collections/accessories", "/shipping-returns", "/privacy", "/terms", "/contact"];

function xmlEscape(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

function buildUrlNode(url: string, lastmod: string): string {
  return `<url><loc>${xmlEscape(url)}</loc><lastmod>${xmlEscape(lastmod)}</lastmod></url>`;
}

export async function GET() {
  const [products, models] = await Promise.all([getAllProductsWithMeta(), getDiscoveredModels()]);

  const productRoutes = products.map((product) => `/products/${product.handle}`);
  const modelRoutes = models.map((model) => `/collections/models/${model}`);

  const allPaths = [...STATIC_PATHS, ...modelRoutes, ...productRoutes];
  const deduped = Array.from(new Set(allPaths));
  const lastmod = new Date().toISOString();

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${deduped.map((pathname) => buildUrlNode(absoluteUrl(pathname), lastmod)).join("\n")}
</urlset>`;

  return new Response(body, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=300, stale-while-revalidate=300"
    }
  });
}
