
"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Phone,
  MessageCircle,
  Package,
  MapPin,
  CalendarDays,
  UserRound,
  Search,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Mail,
  ClipboardList,
} from "lucide-react";

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
  hasNextPage?: boolean;
  hasPrevPage?: boolean;
};

type Stats = {
  total: number;
  new: number;
  contacted: number;
  closed: number;
};

type StatusFilter = "all" | "new" | "closed";

const initialStats: Stats = {
  total: 0,
  new: 0,
  contacted: 0,
  closed: 0,
};

const initialPagination: Pagination = {
  total: 0,
  page: 1,
  limit: 20,
  totalPages: 1,
};

const statusConfig = {
  new: {
    label: "New",
    style: "bg-blue-50 text-blue-700 ring-blue-100",
    dot: "bg-blue-500",
  },
  contacted: {
    label: "Contacted",
    style: "bg-amber-50 text-amber-700 ring-amber-100",
    dot: "bg-amber-500",
  },
  closed: {
    label: "Closed",
    style: "bg-emerald-50 text-emerald-700 ring-emerald-100",
    dot: "bg-emerald-500",
  },
};

const filterOptions: { label: string; value: StatusFilter }[] = [
  { label: "All Enquiries", value: "all" },
  { label: "New", value: "new" },
  { label: "Closed", value: "closed" },
];

const cleanPhone = (phone: string) =>
  phone.replace(/[^\d+]/g, "");

const whatsappPhone = (phone: string) => {
  let number = phone.replace(/\D/g, "");
  if (number.length === 10) number = `91${number}`;
  return number;
};

export default function AdminEnquiriesPage() {
  const router = useRouter();

  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<StatusFilter>("all");
  const [page, setPage] = useState(1);

  const [stats, setStats] = useState<Stats>(initialStats);
  const [pagination, setPagination] =
    useState<Pagination>(initialPagination);

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
          method: "GET",
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
        throw new Error(
          result.message || "Unable to load enquiries."
        );
      }

      setEnquiries(
        Array.isArray(result.data) ? result.data : []
      );

      if (result.pagination) {
        setPagination({
          ...initialPagination,
          ...result.pagination,
        });
      }

      if (result.stats) {
        setStats({
          total: Number(result.stats.total) || 0,
          new: Number(result.stats.new) || 0,
          contacted: Number(result.stats.contacted) || 0,
          closed: Number(result.stats.closed) || 0,
        });
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load enquiries."
      );
    } finally {
      setLoading(false);
    }
  }, [page, search, status, router]);

  useEffect(() => {
    fetchEnquiries();
  }, [fetchEnquiries]);

  const handleSearch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPage(1);
    setSearch(searchInput.trim());
  };

  const clearFilters = () => {
    setSearchInput("");
    setSearch("");
    setStatus("all");
    setPage(1);
  };

  const handleStatusChange = (value: StatusFilter) => {
    setStatus(value);
    setPage(1);
  };

  const formatDate = (date: string) => {
    const parsed = new Date(date);

    if (Number.isNaN(parsed.getTime())) {
      return "Date unavailable";
    }

    return parsed.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const statCards = [
    {
      title: "Total Enquiries",
      value: stats.total,
      description: "All received enquiries",
      icon: ClipboardList,
      color: "indigo",
    },
    {
      title: "New Enquiries",
      value: stats.new,
      description: "Awaiting response",
      icon: UserRound,
      color: "blue",
    },
    {
      title: "Closed Enquiries",
      value: stats.closed,
      description: "Successfully completed",
      icon: Package,
      color: "emerald",
    },
  ];

  const colors = {
    indigo: {
      bg: "bg-indigo-50",
      text: "text-indigo-600",
      line: "bg-indigo-500",
      value: "text-indigo-950",
    },
    blue: {
      bg: "bg-blue-50",
      text: "text-blue-600",
      line: "bg-blue-500",
      value: "text-blue-950",
    },
    emerald: {
      bg: "bg-emerald-50",
      text: "text-emerald-600",
      line: "bg-emerald-500",
      value: "text-emerald-950",
    },
  };

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#F4F6FB] text-slate-800">
      <div className="mx-auto w-full max-w-[1500px] px-3 py-5 sm:px-6 sm:py-8 lg:px-9">

        {/* Header */}
        <header className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2 text-xs text-slate-400">
              <Link href="/admin/dashboard" className="hover:text-indigo-600">
                Dashboard
              </Link>
              <span>/</span>
              <span className="font-bold text-indigo-600">Enquiries</span>
            </div>

            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
              Enquiry Management
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Manage and respond to buyer enquiries across all suppliers.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2 sm:flex">
            <Link
              href="/admin/dashboard"
              className="flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-600 shadow-sm transition hover:border-indigo-200 hover:text-indigo-600"
            >
              ← Dashboard
            </Link>

            <button
              onClick={fetchEnquiries}
              disabled={loading}
              className="flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-700 disabled:opacity-60"
            >
              <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
              Refresh
            </button>
          </div>
        </header>

        {/* Statistics */}
        <section className="mb-7 grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
          {statCards.map((card) => {
            const color = colors[card.color as keyof typeof colors];
            const Icon = card.icon;

            return (
              <div
                key={card.title}
                className="relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-semibold text-slate-500">
                      {card.title}
                    </p>
                    <p className={`mt-3 text-3xl font-extrabold ${color.value}`}>
                      {card.value.toLocaleString("en-IN")}
                    </p>
                    <p className="mt-2 text-xs text-slate-400">
                      {card.description}
                    </p>
                  </div>

                  <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${color.bg} ${color.text}`}>
                    <Icon size={22} />
                  </div>
                </div>
                <div className={`absolute bottom-0 left-0 h-1 w-full ${color.line}`} />
              </div>
            );
          })}
        </section>

        {/* Main Panel */}
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

          {/* Panel Header */}
          <div className="flex flex-col gap-2 border-b border-slate-100 px-4 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <div>
              <h2 className="text-lg font-extrabold text-slate-900">
                Buyer Enquiries
              </h2>
              <p className="mt-1 text-xs text-slate-400">
                Buyer, product and supplier information
              </p>
            </div>

            <span className="w-fit rounded-lg bg-indigo-50 px-3 py-2 text-xs font-bold text-indigo-700">
              {pagination.total.toLocaleString("en-IN")} Records
            </span>
          </div>

          {/* Search and Filters */}
          <div className="border-b border-slate-100 bg-slate-50/70 p-4 sm:px-6 sm:py-5">
            <form onSubmit={handleSearch} className="flex gap-2">
              <div className="relative min-w-0 flex-1">
                <Search
                  size={17}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="Search buyer, phone or message..."
                  className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-bold text-white transition hover:bg-indigo-600 disabled:opacity-60"
              >
                Search
              </button>
            </form>

            <div className="mt-4 flex flex-wrap gap-2">
              {filterOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleStatusChange(option.value)}
                  className={`rounded-lg px-4 py-2.5 text-xs font-bold transition ${
                    status === option.value
                      ? "bg-indigo-600 text-white shadow-sm"
                      : "border border-slate-200 bg-white text-slate-500 hover:border-indigo-200 hover:text-indigo-600"
                  }`}
                >
                  {option.label}
                </button>
              ))}

              {(search || searchInput || status !== "all") && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="rounded-lg px-3 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50"
                >
                  Clear Filters
                </button>
              )}
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="m-4 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700 sm:m-6">
              <p>{error}</p>
              <button onClick={fetchEnquiries} className="mt-2 font-bold underline">
                Try again
              </button>
            </div>
          )}

          {/* Loading */}
          {loading ? (
            <div className="space-y-4 p-5 sm:p-6">
              {[1, 2, 3].map((item) => (
                <div key={item} className="animate-pulse rounded-2xl border border-slate-100 p-5">
                  <div className="h-5 w-40 rounded bg-slate-200" />
                  <div className="mt-4 h-28 rounded-xl bg-slate-100" />
                </div>
              ))}
            </div>
          ) : enquiries.length === 0 ? (
            <div className="px-4 py-16 text-center sm:py-20">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
                <ClipboardList size={28} />
              </div>
              <h3 className="mt-4 text-lg font-extrabold text-slate-800">
                No enquiries found
              </h3>
              <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-400">
                No enquiries match your current search or filter.
              </p>
              <button
                onClick={clearFilters}
                className="mt-5 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-bold text-white hover:bg-indigo-700"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {enquiries.map((enquiry) => {
                const currentStatus =
                  statusConfig[enquiry.status] || statusConfig.new;

                const phone = cleanPhone(enquiry.buyerPhone || "");
                const waPhone = whatsappPhone(enquiry.buyerPhone || "");
                const hasPhone = Boolean(phone.replace(/\D/g, ""));
                const whatsappMessage = `Hello ${enquiry.buyerName}, regarding your enquiry on Advixio360.`;

                return (
                  <article
                    key={enquiry._id}
                    className="p-4 transition hover:bg-slate-50/60 sm:p-6"
                  >
                    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-indigo-100 hover:shadow-md sm:p-5">

                      {/* Card Heading */}
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        <div className="flex min-w-0 items-center gap-3">
                          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-100 to-violet-100 text-lg font-extrabold text-indigo-700">
                            {enquiry.buyerName?.charAt(0)?.toUpperCase() || "B"}
                          </div>

                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <h3 className="break-words text-base font-extrabold text-slate-900 sm:text-lg">
                                {enquiry.buyerName}
                              </h3>
                              <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-extrabold ring-1 ${currentStatus.style}`}>
                                <span className={`h-1.5 w-1.5 rounded-full ${currentStatus.dot}`} />
                                {currentStatus.label}
                              </span>
                            </div>

                            <p className="mt-1 flex items-center gap-1.5 text-xs text-slate-400">
                              <CalendarDays size={13} />
                              {formatDate(enquiry.createdAt)}
                            </p>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2 sm:justify-end">
                          {hasPhone ? (
                            <>
                              <a
                                href={`tel:${phone}`}
                                className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-green-600 px-4 py-3 text-xs font-extrabold text-white shadow-sm transition hover:bg-green-700 sm:flex-none sm:text-sm"
                              >
                                <Phone size={16} />
                                Call Buyer
                              </a>

                              <a
                                href={`https://wa.me/${waPhone}?text=${encodeURIComponent(whatsappMessage)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-xs font-extrabold text-white shadow-sm transition hover:bg-emerald-700 sm:flex-none sm:text-sm"
                              >
                                <MessageCircle size={16} />
                                WhatsApp
                              </a>
                            </>
                          ) : (
                            <span className="rounded-xl bg-slate-100 px-4 py-3 text-xs font-semibold text-slate-400">
                              Phone unavailable
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Buyer and Product */}
                      <div className="mt-5 grid grid-cols-1 gap-3 lg:grid-cols-2">

                        {/* Buyer Information */}
                        <div className="rounded-xl border border-slate-100 bg-slate-50/80 p-4">
                          <div className="mb-3 flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-slate-400">
                            <UserRound size={15} />
                            Buyer Information
                          </div>

                          <p className="break-words text-sm font-bold text-slate-800">
                            {enquiry.buyerName}
                          </p>

                          <p className="mt-1 break-all text-sm text-slate-500">
                            {enquiry.buyerPhone || "Phone unavailable"}
                          </p>

                          {enquiry.quantity && (
                            <div className="mt-3 inline-flex items-center rounded-lg bg-white px-3 py-2 text-xs font-bold text-slate-600 ring-1 ring-slate-200">
                              Quantity: {enquiry.quantity}
                            </div>
                          )}
                        </div>

                        {/* Product Information */}
                        <div className="rounded-xl border border-slate-100 bg-slate-50/80 p-4">
                          <div className="mb-3 flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-slate-400">
                            <Package size={15} />
                            Product Information
                          </div>

                          <div className="flex min-w-0 items-center gap-3">
                            {enquiry.product?.images?.[0] ? (
                              <img
                                src={enquiry.product.images[0]}
                                alt={enquiry.product.name || "Product"}
                                loading="lazy"
                                className="h-16 w-16 shrink-0 rounded-xl border border-slate-200 bg-white object-contain p-1"
                              />
                            ) : (
                              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-[9px] font-bold text-slate-300">
                                NO IMAGE
                              </div>
                            )}

                            <div className="min-w-0">
                              <p className="line-clamp-2 break-words text-sm font-bold text-slate-800">
                                {enquiry.product?.name || "Product unavailable"}
                              </p>

                              {enquiry.product?.price != null && (
                                <p className="mt-1 text-sm font-extrabold text-indigo-600">
                                  ₹{enquiry.product.price.toLocaleString("en-IN")}
                                  {enquiry.product.unit ? ` / ${enquiry.product.unit}` : ""}
                                </p>
                              )}

                              {enquiry.product?.slug && (
                                <Link
                                  href={`/products/${enquiry.product.slug}`}
                                  target="_blank"
                                  className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-indigo-600 hover:underline"
                                >
                                  View Product <ExternalLink size={12} />
                                </Link>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Supplier Information */}
                      <div className="mt-3 rounded-xl border border-indigo-100 bg-indigo-50/50 p-4">
                        <div className="mb-2 flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-indigo-500">
                          <MapPin size={15} />
                          Assigned Supplier
                        </div>

                        <p className="break-words text-sm font-extrabold text-slate-800">
                          {enquiry.supplier?.companyName ||
                            enquiry.supplier?.name ||
                            "Supplier unavailable"}
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          {[enquiry.supplier?.city, enquiry.supplier?.state]
                            .filter(Boolean)
                            .join(", ") || "Location unavailable"}
                        </p>

                        <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:gap-5">
                          {enquiry.supplier?.email && (
                            <a
                              href={`mailto:${enquiry.supplier.email}`}
                              className="inline-flex items-center gap-2 break-all text-xs font-semibold text-indigo-600 hover:underline"
                            >
                              <Mail size={14} />
                              {enquiry.supplier.email}
                            </a>
                          )}

                          {enquiry.supplier?.phone && (
                            <span className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600">
                              <Phone size={14} />
                              {enquiry.supplier.phone}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Buyer Message */}
                      <div className="mt-3 rounded-xl border border-slate-100 bg-white p-4">
                        <div className="mb-2 flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-slate-400">
                          <MessageCircle size={15} />
                          Buyer Message
                        </div>

                        <p className="whitespace-pre-wrap break-words text-sm leading-6 text-slate-600">
                          {enquiry.message || "No message provided."}
                        </p>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}

          {/* Pagination */}
          {!loading && pagination.total > 0 && (
            <div className="flex flex-col gap-3 border-t border-slate-100 bg-slate-50/70 px-4 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
              <div className="text-center text-xs text-slate-500 sm:text-left">
                Showing{" "}
                <strong className="text-slate-800">
                  {(pagination.page - 1) * pagination.limit + 1}
                </strong>
                {" - "}
                <strong className="text-slate-800">
                  {Math.min(
                    pagination.page * pagination.limit,
                    pagination.total
                  )}
                </strong>
                {" of "}
                <strong className="text-slate-800">
                  {pagination.total.toLocaleString("en-IN")}
                </strong>
                {" enquiries"}
              </div>

              <div className="flex items-center justify-center gap-3">
                <button
                  type="button"
                  disabled={pagination.page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-600 transition hover:border-indigo-300 hover:text-indigo-600 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ChevronLeft size={16} />
                  Previous
                </button>

                <span className="whitespace-nowrap text-xs font-bold text-slate-700">
                  Page {pagination.page} of {pagination.totalPages}
                </span>

                <button
                  type="button"
                  disabled={pagination.page >= pagination.totalPages}
                  onClick={() =>
                    setPage((p) =>
                      Math.min(pagination.totalPages, p + 1)
                    )
                  }
                  className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-600 transition hover:border-indigo-300 hover:text-indigo-600 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Next
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </section>

        <footer className="py-6 text-center text-xs text-slate-400">
          Advixio360 Admin Panel · Enquiry Management
        </footer>
      </div>
    </main>
  );
}
