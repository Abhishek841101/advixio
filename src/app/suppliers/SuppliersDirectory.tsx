
"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

type Supplier = {
  _id: string;
  slug?: string;
  name: string;
  companyName?: string;
  city?: string;
  state?: string;
  productCount?: number;
  createdAt?: string;
};

type Pagination = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
};

type ApiResponse = {
  success: boolean;
  message?: string;
  data?: Supplier[];
  pagination?: Pagination;
};

const API_URL = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"
).replace(/\/+$/, "");

const PAGE_SIZE = 20;

function getInitial(name: string) {
  return name.trim().charAt(0).toUpperCase() || "S";
}

function formatNumber(value: number) {
  return new Intl.NumberFormat("en-IN").format(value);
}

export default function SuppliersDirectory() {
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Debounce search to avoid making an API request for every keystroke.
  useEffect(() => {
    const timer = window.setTimeout(() => {
      setPage(1);
      setSearch(searchInput.trim());
    }, 350);

    return () => window.clearTimeout(timer);
  }, [searchInput]);

  const loadSuppliers = useCallback(
    async (signal: AbortSignal) => {
      setLoading(true);
      setError("");

      try {
        const params = new URLSearchParams({
          page: String(page),
          limit: String(PAGE_SIZE),
        });

        if (search) {
          params.set("search", search);
        }

        const response = await fetch(
          `${API_URL}/suppliers?${params.toString()}`,
          {
            signal,
            cache: "no-store",
          }
        );

        if (!response.ok) {
          throw new Error(`Unable to load suppliers (${response.status}).`);
        }

        const result = (await response.json()) as ApiResponse;

        if (!result.success || !Array.isArray(result.data)) {
          throw new Error(result.message || "Invalid supplier API response.");
        }

        if (!result.pagination) {
          throw new Error(
            "Supplier API pagination is missing. Update the backend API first."
          );
        }

        setSuppliers(result.data);
        setPagination(result.pagination);
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") {
          return;
        }

        setError(
          err instanceof Error
            ? err.message
            : "Something went wrong. Please try again."
        );
        setSuppliers([]);
        setPagination(null);
      } finally {
        if (!signal.aborted) {
          setLoading(false);
        }
      }
    },
    [page, search]
  );

  useEffect(() => {
    const controller = new AbortController();

    void loadSuppliers(controller.signal);

    return () => controller.abort();
  }, [loadSuppliers]);

  const clearSearch = () => {
    setSearchInput("");
    setSearch("");
    setPage(1);
  };

  const firstResult =
    pagination && pagination.total > 0
      ? (pagination.page - 1) * pagination.limit + 1
      : 0;

  const lastResult = pagination
    ? Math.min(pagination.page * pagination.limit, pagination.total)
    : 0;

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#f6f8fc] text-slate-900">
        {/* Hero */}
        <section className="relative overflow-hidden bg-[#0b1530]">
          <div className="pointer-events-none absolute -right-20 -top-28 h-80 w-80 rounded-full bg-blue-500/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-40 left-1/4 h-80 w-80 rounded-full bg-indigo-500/20 blur-3xl" />

          <div className="relative mx-auto max-w-7xl px-5 py-14 sm:py-20">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.06] px-3.5 py-2 text-xs font-semibold tracking-wide text-blue-200">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                ADVIXIO BUSINESS DIRECTORY
              </div>

              <h1 className="mt-6 text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl">
                Find suppliers.
                <span className="block text-blue-400">
                  Build better business.
                </span>
              </h1>

              <p className="mt-5 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
                Search supplier companies by name or location and discover
                businesses offering products for your requirements.
              </p>

              <a
                href="#supplier-directory"
                className="mt-8 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-500"
              >
                Explore directory <span aria-hidden="true">→</span>
              </a>
            </div>

            <div className="mt-12 grid max-w-2xl grid-cols-2 gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-4">
                <p className="text-sm text-slate-400">Total suppliers</p>
                <p className="mt-2 text-2xl font-bold text-white">
                  {pagination ? formatNumber(pagination.total) : "—"}
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-4">
                <p className="text-sm text-slate-400">Current page</p>
                <p className="mt-2 text-2xl font-bold text-white">
                  {pagination
                    ? `${pagination.page} / ${Math.max(pagination.totalPages, 1)}`
                    : "—"}
                </p>
              </div>

              <div className="col-span-2 rounded-2xl border border-white/10 bg-white/[0.06] p-4 sm:col-span-1">
                <p className="text-sm text-slate-400">Results per page</p>
                <p className="mt-2 text-2xl font-bold text-white">
                  {PAGE_SIZE}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Directory */}
        <section
          id="supplier-directory"
          className="mx-auto max-w-7xl scroll-mt-6 px-4 py-10 sm:px-5 sm:py-14"
        >
          <div className="mb-7">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-700">
              Supplier discovery
            </p>

            <h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
              Supplier directory
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-600 sm:text-base">
              Find a company, check its location, and explore its listed
              products.
            </p>
          </div>

          {/* Search */}
          <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm sm:p-4">
            <label
              htmlFor="supplier-search"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Search suppliers
            </label>

            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="relative min-w-0 flex-1">
                <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-lg text-slate-400">
                  ⌕
                </span>

                <input
                  id="supplier-search"
                  type="search"
                  value={searchInput}
                  onChange={(event) => setSearchInput(event.target.value)}
                  placeholder="Company, supplier name, city or state..."
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-11 pr-10 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                />

                {searchInput && (
                  <button
                    type="button"
                    onClick={clearSearch}
                    aria-label="Clear search"
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg px-2 py-1 text-sm text-slate-500 hover:bg-slate-200"
                  >
                    Clear
                  </button>
                )}
              </div>

              <Link
                href="/products"
                className="inline-flex shrink-0 items-center justify-center rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
              >
                Browse products →
              </Link>
            </div>

            <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
              <span>
                {search
                  ? `Searching for "${search}"`
                  : "Search by company or location"}
              </span>

              {pagination && !loading && (
                <span>
                  Showing {formatNumber(firstResult)}–{formatNumber(lastResult)}{" "}
                  of {formatNumber(pagination.total)}
                </span>
              )}
            </div>
          </div>

          {/* Results */}
          <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center justify-between gap-3 border-b border-slate-200 bg-slate-50 px-4 py-4 sm:px-6">
              <div>
                <h3 className="font-bold text-slate-900">
                  {search ? "Search results" : "All suppliers"}
                </h3>
                <p className="mt-1 text-xs text-slate-500">
                  Company information and active product listings
                </p>
              </div>

              {loading && (
                <span className="inline-flex items-center gap-2 text-xs font-medium text-blue-700">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-blue-600" />
                  Loading
                </span>
              )}
            </div>

            {error ? (
              <div className="px-5 py-14 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-xl text-red-600">
                  !
                </div>
                <h3 className="mt-4 font-bold">Unable to load suppliers</h3>
                <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-slate-600">
                  {error}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setPage((current) => current);
                    setSearch((current) => `${current}`);
                  }}
                  className="mt-5 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700"
                >
                  Retry
                </button>
              </div>
            ) : loading && suppliers.length === 0 ? (
              <div className="divide-y divide-slate-100">
                {Array.from({ length: 6 }).map((_, index) => (
                  <div
                    key={index}
                    className="flex animate-pulse items-center gap-4 px-4 py-5 sm:px-6"
                  >
                    <div className="h-11 w-11 shrink-0 rounded-xl bg-slate-200" />
                    <div className="min-w-0 flex-1">
                      <div className="h-4 w-1/2 rounded bg-slate-200" />
                      <div className="mt-2 h-3 w-1/3 rounded bg-slate-100" />
                    </div>
                    <div className="hidden h-8 w-24 rounded-lg bg-slate-100 sm:block" />
                  </div>
                ))}
              </div>
            ) : suppliers.length === 0 ? (
              <div className="px-5 py-16 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-2xl">
                  ⌕
                </div>
                <h3 className="mt-4 text-lg font-bold text-slate-900">
                  {search ? "No matching suppliers" : "No suppliers available"}
                </h3>
                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                  {search
                    ? "Try another company name, city or state."
                    : "Suppliers with active products will appear here."}
                </p>
                {search && (
                  <button
                    type="button"
                    onClick={clearSearch}
                    className="mt-5 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700"
                  >
                    Clear search
                  </button>
                )}
              </div>
            ) : (
              <>
                {/* Column headings */}
                <div className="hidden grid-cols-[minmax(0,1.7fr)_minmax(130px,1fr)_100px_130px] items-center gap-4 border-b border-slate-100 px-6 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-500 md:grid">
                  <span>Company</span>
                  <span>Location</span>
                  <span>Products</span>
                  <span className="text-right">Profile</span>
                </div>

                <div className="divide-y divide-slate-100">
                  {suppliers.map((supplier) => {
                    const companyName =
                      supplier.companyName?.trim() ||
                      supplier.name ||
                      "Supplier";

                    const location = [
                      supplier.city?.trim(),
                      supplier.state?.trim(),
                    ]
                      .filter(Boolean)
                      .join(", ");

                    const profileSlug = supplier.slug || supplier._id;

                    return (
                      <article
                        key={supplier._id}
                        className="grid grid-cols-1 gap-4 px-4 py-5 transition hover:bg-blue-50/40 sm:px-6 md:grid-cols-[minmax(0,1.7fr)_minmax(130px,1fr)_100px_130px] md:items-center md:gap-4"
                      >
                        {/* Company */}
                        <div className="flex min-w-0 items-center gap-3">
                          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-blue-100 bg-blue-50 text-base font-bold text-blue-800">
                            {getInitial(companyName)}
                          </div>

                          <div className="min-w-0">
                            <h4 className="break-words font-semibold text-slate-900">
                              {companyName}
                            </h4>
                            <p className="mt-1 break-words text-xs text-slate-500">
                              Contact: {supplier.name || "Not provided"}
                            </p>
                          </div>
                        </div>

                        {/* Location */}
                        <div className="flex items-start gap-2 text-sm text-slate-600">
                          <span aria-hidden="true">📍</span>
                          <div>
                            <p className="text-xs font-medium text-slate-400 md:hidden">
                              LOCATION
                            </p>
                            <span>{location || "Location not provided"}</span>
                          </div>
                        </div>

                        {/* Product count */}
                        <div className="flex items-center justify-between md:block">
                          <p className="text-xs font-medium text-slate-400 md:hidden">
                            ACTIVE PRODUCTS
                          </p>
                          <div>
                            <span className="font-bold tabular-nums text-slate-900">
                              {formatNumber(supplier.productCount || 0)}
                            </span>
                            <span className="ml-1 text-xs text-slate-500 md:hidden">
                              products
                            </span>
                          </div>
                        </div>

                        {/* Profile */}
                        <div className="md:text-right">
                          <Link
                            href={`/suppliers/${encodeURIComponent(profileSlug)}`}
                            className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-blue-300 hover:bg-blue-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 md:w-auto"
                            aria-label={`View ${companyName} supplier profile`}
                          >
                            View profile <span aria-hidden="true">→</span>
                          </Link>
                        </div>
                      </article>
                    );
                  })}
                </div>
              </>
            )}
          </div>

          {/* Pagination */}
          {!error && pagination && pagination.total > 0 && (
            <nav
              aria-label="Supplier pagination"
              className="mt-6 flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <p className="text-sm text-slate-600">
                Page{" "}
                <span className="font-semibold text-slate-900">
                  {pagination.page}
                </span>{" "}
                of{" "}
                <span className="font-semibold text-slate-900">
                  {Math.max(pagination.totalPages, 1)}
                </span>
              </p>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={!pagination.hasPrevPage || loading}
                  onClick={() => {
                    setPage((current) => Math.max(1, current - 1));
                    document
                      .getElementById("supplier-directory")
                      ?.scrollIntoView({ behavior: "smooth", block: "start" });
                  }}
                  className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  ← Previous
                </button>

                <button
                  type="button"
                  disabled={!pagination.hasNextPage || loading}
                  onClick={() => {
                    setPage((current) => current + 1);
                    document
                      .getElementById("supplier-directory")
                      ?.scrollIntoView({ behavior: "smooth", block: "start" });
                  }}
                  className="rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Next →
                </button>
              </div>
            </nav>
          )}

          <div className="mt-8 flex flex-col justify-between gap-4 rounded-2xl border border-blue-100 bg-blue-50/70 p-5 sm:flex-row sm:items-center sm:p-6">
            <div>
              <h3 className="font-bold text-slate-900">
                Looking for a specific product?
              </h3>
              <p className="mt-1 text-sm leading-6 text-slate-600">
                Browse available products to find options for your business.
              </p>
            </div>

            <Link
              href="/products"
              className="inline-flex shrink-0 items-center justify-center rounded-xl bg-white px-5 py-3 text-sm font-semibold text-blue-800 ring-1 ring-blue-200 transition hover:bg-blue-100"
            >
              Browse products →
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
