import type { Metadata } from "next";
import { Suspense } from "react";
import ProductsPageClient from "./ProductsPageClient";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function hasSearchParam(sp: Record<string, string | string[] | undefined>) {
  const v = sp.search;
  const s = Array.isArray(v) ? v[0] : v;
  return Boolean(String(s || "").trim());
}

export async function generateMetadata({
  searchParams,
}: {
  searchParams: SearchParams;
}): Promise<Metadata> {
  const sp = await searchParams;
  const hasSearch = hasSearchParam(sp);
  return {
    alternates: { canonical: "/products" },
    robots: hasSearch ? { index: false, follow: true } : undefined,
  };
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<main className="products-page"><div className="container py-10 text-sm text-[#2563EB]">Loading products...</div></main>}>
      <ProductsPageClient />
    </Suspense>
  );
}
