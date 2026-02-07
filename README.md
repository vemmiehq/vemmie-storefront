# Vemmie Storefront (Pass 1)

Tier-1 headless storefront for `www.vemmie.com` using Next.js App Router and Shopify Storefront API (read-only).

## Scope implemented

- Home page with hero, model links, and featured product grid
- Collections hub
- Model collection pages:
  - `/collections/iphone-17`
  - `/collections/iphone-17-pro`
  - `/collections/iphone-17-air`
  - `/collections/iphone-17-pro-max`
- Product detail page: `/products/[handle]`
- Variant (color) selection with price update
- Shopify cart + checkout redirects using numeric variant ID:
  - Add to cart: `https://shop.vemmie.com/cart/{NUMERIC_VARIANT_ID}:1`
  - Buy now: `https://shop.vemmie.com/cart/{NUMERIC_VARIANT_ID}:1?checkout`

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

## Shopify notes

- Product grouping on collection pages is title-based (not Shopify collections), matched in this order:
  1. `iPhone 17 Pro Max`
  2. `iPhone 17 Pro`
  3. `iPhone 17 Air`
  4. `iPhone 17`
- If no products are returned, UI shows a friendly message to check Headless channel availability in Shopify.

## Cache / revalidation

- `REVALIDATE_SECONDS = 300` is centralized in `lib/constants.ts` and used in Shopify fetches.
