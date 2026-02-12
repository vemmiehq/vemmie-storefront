import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-12 border-t border-slate-200 bg-white">
      <div className="mx-auto w-full max-w-6xl space-y-3 px-4 py-6 text-sm text-slate-500">
        <p>Secure checkout powered by Shopify.</p>
        <nav className="flex flex-wrap gap-x-4 gap-y-2">
          <Link
            href="/shipping-returns"
            className="transition hover:text-slate-700"
          >
            Shipping &amp; Returns
          </Link>
          <Link href="/privacy" className="transition hover:text-slate-700">
            Privacy
          </Link>
          <Link href="/terms" className="transition hover:text-slate-700">
            Terms
          </Link>
          <Link href="/contact" className="transition hover:text-slate-700">
            Contact
          </Link>
        </nav>
      </div>
    </footer>
  );
}
