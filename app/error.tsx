"use client";

type ErrorPageProps = {
  error: Error;
  reset: () => void;
};

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  return (
    <div className="space-y-4 rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-700">
      <p>Something went wrong while loading data from Shopify.</p>
      <p className="text-xs text-red-600">{error.message}</p>
      <button
        type="button"
        onClick={() => reset()}
        className="rounded-md bg-red-600 px-3 py-2 text-white hover:bg-red-700"
      >
        Try again
      </button>
    </div>
  );
}
