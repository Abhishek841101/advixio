
"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

type Enquiry = {
  _id: string;
  buyerName: string;
  buyerPhone: string;
  quantity?: string;
  message: string;
  status: "new" | "contacted" | "closed";
  createdAt: string;
  product?: {
    name?: string;
    slug?: string;
    images?: string[];
    price?: number;
    unit?: string;
  };
  supplier?: {
    name?: string;
    email?: string;
    phone?: string;
    companyName?: string;
    city?: string;
    state?: string;
  };
};

type Pagination = {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export default function AdminEnquiriesPage() {
  const router = useRouter();

  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState<Pagination>({
    total: 0,
    page: 1,
    limit: 20,
    totalPages: 1,
  });

  const getToken = () =>
    typeof window !== "undefined"
      ? localStorage.getItem("advixio_admin_token") || ""
      : "";

  const fetchEnquiries = useCallback(async () => {
    const token = getToken();

    if (!token) {
      router.replace("/admin/login");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: "20",
        search,
        status,
      });

      const response = await fetch(
        `${API_URL}/enquiries/admin/all?${params.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          cache: "no-store",
        }
      );

      if (response.status === 401 || response.status === 403) {
        localStorage.removeItem("advixio_admin_token");
        localStorage.removeItem("advixio_admin");
        router.replace("/admin/login");
        return;
      }

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Unable to load enquiries");
      }

      setEnquiries(result.data || []);
      setPagination(
        result.pagination || {
          total: 0,
          page: 1,
          limit: 20,
          totalPages: 1,
        }
      );
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to load enquiries."
      );
    } finally {
      setLoading(false);
    }
  }, [page, search, status, router]);

  useEffect(() => {
    fetchEnquiries();
  }, [fetchEnquiries]);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPage(1);
    setSearch(searchInput.trim());
  };

  const formatDate = (date: string) =>
    new Date(date).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  const statusStyle = (value: string) => {
    if (value === "new") return "bg-blue-50 text-blue-700";
    if (value === "contacted") return "bg-amber-50 text-amber-700";
    return "bg-emerald-50 text-emerald-700";
  };

  return (
    <main className="min-h-screen bg-[#F6F7FB] px-4 py-7 text-slate-800 sm:px-7 lg:px-9">
      <div className="mx-auto max-w-[1500px]">
        <div className="mb-7 flex flex-wrap items-center justify-between gap-4">
          <div>
            <Link
              href="/admin/dashboard"
              className="text-sm font-semibold text-indigo-600 hover:text-indigo-800"
            >
              ← Back to Dashboard
            </Link>

            <h1 className="mt-3 text-2xl font-extrabold text-slate-900 sm:text-3xl">
              All Enquiries
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Enquiries received for products from all suppliers.
            </p>
          </div>

          <button
            onClick={fetchEnquiries}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:border-indigo-300 hover:text-indigo-600"
          >
            ↻ Refresh
          </button>
        </div>

        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <p className="text-sm text-slate-500">Total Enquiries</p>
            <p className="mt-2 text-3xl font-extrabold text-slate-900">
              {pagination.total.toLocaleString("en-IN")}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <p className="text-sm text-slate-500">Showing on this page</p>
            <p className="mt-2 text-3xl font-extrabold text-indigo-600">
              {enquiries.length}
            </p>
          </div>
        </div>

        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col gap-3 border-b border-slate-100 p-4 sm:flex-row sm:items-center sm:justify-between">
            <form
              onSubmit={handleSearch}
              className="flex w-full gap-2 sm:max-w-lg"
            >
              <input
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search buyer name, phone or message..."
                className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none focus:border-indigo-400 focus:bg-white"
              />
              <button
                type="submit"
                className="rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
              >
                Search
              </button>
            </form>

            <select
              value={status}
              onChange={(e) => {
                setStatus(e.target.value);
                setPage(1);
              }}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium outline-none"
            >
              <option value="all">All Status</option>
              <option value="new">New</option>
              <option value="contacted">Contacted</option>
              <option value="closed">Closed</option>
            </select>
          </div>

          {error && (
            <div className="m-4 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
              {error}
            </div>
          )}

          {loading ? (
            <div className="py-20 text-center text-sm text-slate-500">
              Loading enquiries...
            </div>
          ) : enquiries.length === 0 ? (
            <div className="py-20 text-center">
              <p className="font-semibold text-slate-700">
                No enquiries found
              </p>
              <p className="mt-2 text-sm text-slate-400">
                New product enquiries will appear here.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {enquiries.map((enquiry) => (
                <article key={enquiry._id} className="p-5 sm:p-6">
                  <div className="flex flex-col justify-between gap-3 sm:flex-row">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-indigo-600">
                        Buyer Enquiry
                      </p>
                      <h2 className="mt-1 text-lg font-bold text-slate-900">
                        {enquiry.buyerName}
                      </h2>
                      <p className="mt-1 text-sm text-slate-500">
                        {formatDate(enquiry.createdAt)}
                      </p>
                    </div>

                    <span
                      className={`h-fit w-fit rounded-full px-3 py-1.5 text-xs font-bold capitalize ${statusStyle(enquiry.status)}`}
                    >
                      {enquiry.status}
                    </span>
                  </div>

                  <div className="mt-5 grid gap-5 md:grid-cols-2">
                    <div className="rounded-xl bg-slate-50 p-4">
                      <p className="text-xs font-bold uppercase text-slate-400">
                        Buyer Details
                      </p>
                      <p className="mt-3 text-sm font-semibold">
                        {enquiry.buyerName}
                      </p>
                      <a
                        href={`tel:${enquiry.buyerPhone}`}
                        className="mt-1 block text-sm font-semibold text-indigo-600"
                      >
                        {enquiry.buyerPhone}
                      </a>
                      {enquiry.quantity && (
                        <p className="mt-2 text-sm text-slate-600">
                          Quantity: {enquiry.quantity}
                        </p>
                      )}
                    </div>

                    <div className="rounded-xl bg-slate-50 p-4">
                      <p className="text-xs font-bold uppercase text-slate-400">
                        Product Details
                      </p>
                      <p className="mt-3 text-sm font-semibold text-slate-800">
                        {enquiry.product?.name || "Product unavailable"}
                      </p>
                      {enquiry.product?.slug && (
                        <Link
                          href={`/products/${enquiry.product.slug}`}
                          target="_blank"
                          className="mt-1 inline-block text-xs font-semibold text-indigo-600"
                        >
                          View Product →
                        </Link>
                      )}
                    </div>
                  </div>

                  <div className="mt-4 rounded-xl border border-slate-100 p-4">
                    <p className="text-xs font-bold uppercase text-slate-400">
                      Supplier Details
                    </p>
                    <p className="mt-2 text-sm font-bold text-slate-800">
                      {enquiry.supplier?.companyName ||
                        enquiry.supplier?.name ||
                        "Supplier unavailable"}
                    </p>
                    <p className="mt-1 text-sm text-slate-500">
                      {[
                        enquiry.supplier?.city,
                        enquiry.supplier?.state,
                      ]
                        .filter(Boolean)
                        .join(", ") || "Location unavailable"}
                    </p>
                    {enquiry.supplier?.email && (
                      <p className="mt-1 text-sm text-slate-500">
                        {enquiry.supplier.email}
                      </p>
                    )}
                    {enquiry.supplier?.phone && (
                      <p className="mt-1 text-sm text-slate-500">
                        {enquiry.supplier.phone}
                      </p>
                    )}
                  </div>

                  <div className="mt-4">
                    <p className="text-xs font-bold uppercase text-slate-400">
                      Buyer Message
                    </p>
                    <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-700">
                      {enquiry.message}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          )}

          <div className="flex flex-col items-center justify-between gap-3 border-t border-slate-100 px-5 py-4 sm:flex-row">
            <p className="text-xs text-slate-500">
              Total {pagination.total.toLocaleString("en-IN")} enquiries
            </p>

            <div className="flex items-center gap-3">
              <button
                disabled={page <= 1 || loading}
                onClick={() => setPage((p) => p - 1)}
                className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold disabled:opacity-40"
              >
                Previous
              </button>

              <span className="text-xs font-bold text-slate-600">
                {pagination.page} / {pagination.totalPages}
              </span>

              <button
                disabled={page >= pagination.totalPages || loading}
                onClick={() => setPage((p) => p + 1)}
                className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
