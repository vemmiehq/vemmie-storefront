/**
 * Legacy collection route compatibility layer.
 * Redirects historical /collections/:slug model URLs to canonical /collections/models/:model pages.
 */
import { notFound, redirect } from "next/navigation";

import { isLegacyModelSlug, LEGACY_MODEL_SLUGS } from "@/lib/collections";

type LegacyCollectionPageProps = {
  params: {
    slug: string;
  };
};

export function generateStaticParams() {
  return LEGACY_MODEL_SLUGS.map((slug) => ({ slug }));
}

export default function LegacyCollectionPage({ params }: LegacyCollectionPageProps) {
  if (!isLegacyModelSlug(params.slug)) {
    notFound();
  }

  redirect(`/collections/models/${params.slug}`);
}
