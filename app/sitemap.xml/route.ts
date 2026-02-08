/**
 * Dynamic XML sitemap route.
 * Includes core pages, discovered model collections, accessories, PDPs, and optional policy/contact pages.
 */
import { existsSync } from "node:fs";
import path from "node:path";

import { getAllProductsWithMeta, getDiscoveredModels } from "@/lib/shopify";

const STATIC_PATHS = ["/", "/collections", "/collections/accessories"];
const OPTIONAL_PAGES = ["/contact", "/policies", "/privacy-policy", "/refund-policy", "/shipping-policy", "/terms"];
const PAGE_EXTENSIONS = [".tsx", ".ts", ".jsx", ".js", ".mdx", ".md"];

function getBaseUrl(): string {
  return process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.vemmie.com";
}

function toAbsoluteUrl(pathname: string): string {
  return `${getBaseUrl()}${pathname}`;
}

function xmlEscape(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

function appRouteExists(pathname: string): boolean {
  const segments = pathname.split("/").filter(Boolean);
  const routeDir = path.join(process.cwd(), "app", ...segments);
  return PAGE_EXTENSIONS.some((extension) => existsSync(path.join(routeDir, `page${extension}`)));
}

function buildUrlNode(url: string): string {
  return `<url><loc>${xmlEscape(url)}</loc></url>`;
}

export async function GET() {
  const [products, models] = await Promise.all([getAllProductsWithMeta(), getDiscoveredModels()]);

  const optionalRoutes = OPTIONAL_PAGES.filter((pathname) => appRouteExists(pathname));
  const productRoutes = products.map((product) => `/products/${product.handle}`);
  const modelRoutes = models.map((model) => `/collections/models/${model}`);

  const allPaths = [...STATIC_PATHS, ...optionalRoutes, ...modelRoutes, ...productRoutes];
  const deduped = Array.from(new Set(allPaths));

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${deduped.map((pathname) => buildUrlNode(toAbsoluteUrl(pathname))).join("\n")}
</urlset>`;

  return new Response(body, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=300, stale-while-revalidate=300"
    }
  });
}
