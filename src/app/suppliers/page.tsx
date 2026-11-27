import type { Metadata } from "next";
import { Suspense } from "react";
import SuppliersPageClient from "./SuppliersPageClient";

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
    alternates: { canonical: "/suppliers" },
    robots: hasSearch ? { index: false, follow: true } : undefined,
  };
}

export default function SuppliersPage() {
  return (
    <Suspense fallback={<main className="min-h-screen bg-[#FFFFFF]"><div className="mx-auto max-w-7xl px-5 py-16 text-sm text-slate-500">Loading suppliers...</div></main>}>
      <SuppliersPageClient />
    </Suspense>
  );
}
