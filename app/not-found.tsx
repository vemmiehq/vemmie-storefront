import Link from "next/link";

export default function NotFoundPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-semibold text-slate-900">404 - Not Found</h1>
      <p className="text-slate-600">The page or product you requested could not be found.</p>
      <Link href="/" className="inline-block rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white">
        Back to Home
      </Link>
    </div>
  );
}
