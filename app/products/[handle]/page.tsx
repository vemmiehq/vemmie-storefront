import { notFound } from "next/navigation";

import ProductPdpClient from "@/components/ProductPdpClient";
import { getProductByHandle } from "@/lib/shopify";

type ProductPageProps = {
  params: {
    handle: string;
  };
};

export default async function ProductPage({ params }: ProductPageProps) {
  const storeDomain = process.env.SHOPIFY_STORE_DOMAIN;
  if (!storeDomain) {
    return (
      <div className="rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-700">
        Missing SHOPIFY_STORE_DOMAIN in environment variables.
      </div>
    );
  }

  try {
    const product = await getProductByHandle(params.handle);
    if (!product) {
      notFound();
    }

    return (
      <ProductPdpClient
        title={product.title}
        description={product.description}
        featuredImage={product.featuredImage}
        images={product.images}
        variants={product.variants}
        storeDomain={storeDomain}
      />
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "";
    if (message.toLowerCase().includes("not found")) {
      notFound();
    }

    return (
      <div className="rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-700">
        Could not load this product from Shopify. Check Storefront API
        permissions and product channel availability.
      </div>
    );
  }
}
