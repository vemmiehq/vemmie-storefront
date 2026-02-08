# Vemmie Storefront (Option B)

Tier-1 headless commerce storefront for `www.vemmie.com`, with Shopify as the system of record and model collections auto-discovered from product metafields.

## Scope implemented

- Home page with hero, model links, and featured product grid
- Collections hub with dynamic model tiles + accessories
- Dynamic model collection pages: `/collections/models/[model]`
- Accessories collection page: `/collections/accessories`
- Backward-compatible model URLs (redirect to canonical model routes):
  - `/collections/iphone-17`
  - `/collections/iphone-17-pro`
  - `/collections/iphone-17-air`
  - `/collections/iphone-17-pro-max`
- Product detail page: `/products/[handle]`
- Variant (color) selection with price update
- Shopify cart + checkout redirects using numeric variant ID:
  - Add to cart: `https://shop.vemmie.com/cart/{NUMERIC_VARIANT_ID}:1`
  - Buy now: `https://shop.vemmie.com/cart/{NUMERIC_VARIANT_ID}:1?checkout`
- Dynamic sitemap route: `/sitemap.xml`

## Explicit non-goals

The following remain intentionally out of scope:

- Embedded Shopify checkout
- Client-side cart state
- Custom payment handling (Stripe direct, etc.)
- Shopify collections as a storefront data source
- Inventory management outside Shopify

## Architecture notes

- Shopify Storefront API access is server-only (`lib/shopify.ts`)
- All interactive PDP behavior (variant selection, image switching) lives in client components
- Only JSON-serializable data is passed from server to client components to comply with Next.js App Router constraints
- Checkout is redirected to Shopify cart/checkout URLs; checkout is not embedded in this app

## Tech

- Next.js 14+ App Router
- TypeScript strict
- TailwindCSS
- Minimal dependencies

## Environment variables

Create `.env.local`:

```bash
SHOPIFY_STORE_DOMAIN=shop.vemmie.com
SHOPIFY_STOREFRONT_PRIVATE_TOKEN=your_private_token_here
SHOPIFY_API_VERSION=2024-10
```

Security note:

- `SHOPIFY_STOREFRONT_PRIVATE_TOKEN` is only used server-side in `lib/shopify.ts`.

## Shopify metafield contract

This build expects metafields in namespace `custom`:

- `custom.category`:
  - `case` for model collections
  - `wallet`, `charger`, or `cable` for accessories
- `custom.model`:
  - required for case products (for example `iphone-17`, `iphone-18`)

Rules:

- Missing `custom.category`: product is excluded from all collections.
- `custom.category=case` with missing `custom.model`: excluded from model collections.

## Install and run

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Project structure

```text
app/
components/
lib/
```

## Routing notes

- Canonical model collection route: `/collections/models/<model>`
- Legacy model URLs under `/collections/<slug>` redirect to canonical model routes.
- Collections and sitemap entries update automatically when new `case` products with `custom.model` are added.

## Cache / revalidation

- `REVALIDATE_SECONDS = 300` is centralized in `lib/constants.ts` and used in Shopify fetches.
