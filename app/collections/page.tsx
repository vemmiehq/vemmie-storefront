import Link from "next/link";

import { COLLECTIONS } from "@/lib/collections";

export default function CollectionsHubPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-semibold text-slate-900">Collections</h1>
      <p className="text-slate-600">Shop by device model.</p>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {COLLECTIONS.map((collection) => (
          <Link
            key={collection.slug}
            href={`/collections/${collection.slug}`}
            className="rounded-xl border border-slate-200 bg-white p-6 text-lg font-medium text-slate-900 shadow-sm transition hover:border-slate-300 hover:shadow"
          >
            {collection.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
