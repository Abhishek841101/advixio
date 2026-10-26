
// "use client";

// import Link from "next/link";
// import Navbar from "@/components/layout/Navbar";
// import Footer from "@/components/layout/Footer";
// import { useCallback, useEffect, useMemo, useState } from "react";

// type Supplier = {
//   _id: string;
//   slug?: string;
//   name: string;
//   companyName?: string;
//   email?: string;
//   phone?: string;
//   city?: string;
//   state?: string;
//   productCount?: number;
//   createdAt?: string;
// };

// type ApiResponse = {
//   success: boolean;
//   message?: string;
//   data?: Supplier[];
//   pagination?: {
//     page: number;
//     limit: number;
//     total: number;
//     totalPages: number;
//     hasNextPage: boolean;
//     hasPrevPage: boolean;
//   };
// };

// const API_URL = (
//   process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"
// ).replace(/\/+$/, "");

// const PAGE_SIZE = 20;

// function initials(name: string) {
//   return (
//     name
//       .trim()
//       .split(/\s+/)
//       .slice(0, 2)
//       .map((part) => part[0])
//       .join("")
//       .toUpperCase() || "S"
//   );
// }

// export default function SuppliersPage() {
//   const [suppliers, setSuppliers] = useState<Supplier[]>([]);
//   const [searchInput, setSearchInput] = useState("");
//   const [search, setSearch] = useState("");
//   const [page, setPage] = useState(1);
//   const [total, setTotal] = useState(0);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     const timer = setTimeout(() => {
//       setPage(1);
//       setSearch(searchInput.trim());
//     }, 350);

//     return () => clearTimeout(timer);
//   }, [searchInput]);

//   const fetchSuppliers = useCallback(async () => {
//     setLoading(true);
//     setError("");

//     try {
//       const params = new URLSearchParams({
//         page: String(page),
//         limit: String(PAGE_SIZE),
//       });

//       if (search) params.set("search", search);

//       const response = await fetch(
//         `${API_URL}/suppliers?${params.toString()}`
//       );

//       if (!response.ok) {
//         throw new Error(`Server returned HTTP ${response.status}`);
//       }

//       const result = (await response.json()) as ApiResponse;

//       if (!result.success || !Array.isArray(result.data)) {
//         throw new Error(result.message || "Invalid supplier response");
//       }

//       setSuppliers(result.data);
//       setTotal(result.pagination?.total ?? result.data.length);
//     } catch (err) {
//       setSuppliers([]);
//       setTotal(0);
//       setError(
//         err instanceof Error
//           ? err.message
//           : "Could not load suppliers. Please try again."
//       );
//     } finally {
//       setLoading(false);
//     }
//   }, [page, search]);

//   useEffect(() => {
//     void fetchSuppliers();
//   }, [fetchSuppliers]);

//   const activeProducts = useMemo(
//     () =>
//       suppliers.reduce(
//         (sum, supplier) => sum + (supplier.productCount || 0),
//         0
//       ),
//     [suppliers]
//   );

//   const locations = useMemo(
//     () =>
//       new Set(
//         suppliers
//           .map((supplier) => supplier.state?.trim().toLowerCase())
//           .filter(Boolean)
//       ).size,
//     [suppliers]
//   );

//   const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

//   return (
//     <>
//       <Navbar />

//       <main className="min-h-screen bg-[#f7f8fc] text-slate-900">
//         {/* Hero */}
//         <section className="relative overflow-hidden bg-[#0b1530]">
//           <div className="pointer-events-none absolute -right-20 -top-32 h-96 w-96 rounded-full bg-blue-500/20 blur-3xl" />
//           <div className="pointer-events-none absolute -bottom-40 left-1/4 h-80 w-80 rounded-full bg-indigo-500/20 blur-3xl" />

//           <div className="relative mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20">
//             <div className="max-w-3xl">
//               <div className="inline-flex items-center gap-2 rounded-full border border-blue-300/20 bg-blue-400/10 px-3.5 py-2 text-xs font-semibold tracking-wide text-blue-200">
//                 <span className="h-2 w-2 rounded-full bg-emerald-400" />
//                 ADVIXIO BUSINESS DIRECTORY
//               </div>

//               <h1 className="mt-6 text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
//                 Find the right suppliers.
//                 <span className="mt-2 block text-blue-400">
//                   Build better business.
//                 </span>
//               </h1>

//               <p className="mt-5 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
//                 Discover supplier companies, compare their offerings, and find
//                 the right business partners for your next opportunity.
//               </p>
//             </div>

//             {/* Search */}
//             <div className="mt-9 max-w-3xl">
//               <label
//                 htmlFor="supplier-search"
//                 className="mb-2 block text-sm font-medium text-slate-200"
//               >
//                 Search the supplier directory
//               </label>

//               <div className="flex flex-col gap-3 rounded-2xl border border-white/15 bg-white p-2 shadow-2xl shadow-black/20 sm:flex-row">
//                 <div className="flex min-w-0 flex-1 items-center gap-3 px-3">
//                   <svg
//                     viewBox="0 0 24 24"
//                     fill="none"
//                     stroke="currentColor"
//                     strokeWidth="1.8"
//                     className="h-5 w-5 shrink-0 text-slate-400"
//                     aria-hidden="true"
//                   >
//                     <circle cx="11" cy="11" r="7" />
//                     <path d="m16 16 4 4" />
//                   </svg>

//                   <input
//                     id="supplier-search"
//                     type="search"
//                     value={searchInput}
//                     onChange={(event) => setSearchInput(event.target.value)}
//                     placeholder="Company, supplier or city..."
//                     className="h-12 w-full min-w-0 bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
//                   />
//                 </div>

//                 <Link
//                   href="/products"
//                   className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-blue-700 px-6 text-sm font-semibold text-white transition hover:bg-blue-800"
//                 >
//                   Explore products <span aria-hidden="true">→</span>
//                 </Link>
//               </div>

//               <p className="mt-3 text-xs text-slate-400">
//                 Search by company name, supplier name, city or state.
//               </p>
//             </div>

//             {/* Stats */}
//             <div className="mt-12 grid grid-cols-1 gap-3 sm:grid-cols-3">
//               {[
//                 {
//                   label: "Suppliers found",
//                   value: loading && total === 0 ? "…" : total.toLocaleString(),
//                   note: "Matching your search",
//                   icon: "▦",
//                 },
//                 {
//                   label: "Products on this page",
//                   value: loading ? "…" : activeProducts.toLocaleString(),
//                   note: "Combined active products",
//                   icon: "◇",
//                 },
//                 {
//                   label: "Locations represented",
//                   value: loading ? "…" : String(locations),
//                   note: "Across visible suppliers",
//                   icon: "⌖",
//                 },
//               ].map((stat) => (
//                 <div
//                   key={stat.label}
//                   className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.06] p-5 backdrop-blur-sm"
//                 >
//                   <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/10 text-2xl text-blue-300">
//                     {stat.icon}
//                   </div>
//                   <div>
//                     <p className="text-sm text-slate-400">{stat.label}</p>
//                     <p className="mt-1 text-2xl font-bold text-white">
//                       {stat.value}
//                     </p>
//                     <p className="mt-1 text-xs text-slate-400">{stat.note}</p>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </section>

//         {/* Directory */}
//         <section
//           id="supplier-directory"
//           className="mx-auto max-w-7xl px-5 py-12 sm:px-8 sm:py-16"
//         >
//           <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
//             <div>
//               <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-700">
//                 Business network
//               </p>
//               <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
//                 Supplier directory
//               </h2>
//               <p className="mt-3 max-w-xl text-sm leading-6 text-slate-500 sm:text-base">
//                 Explore company details and discover businesses offering
//                 products for your industry.
//               </p>
//             </div>

//             <div className="inline-flex w-fit items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-600">
//               <span className="h-2 w-2 rounded-full bg-emerald-500" />
//               {total.toLocaleString()}{" "}
//               {total === 1 ? "supplier" : "suppliers"}
//             </div>
//           </div>

//           <div className="mt-7 flex flex-col gap-3 border-b border-slate-200 pb-4 sm:flex-row sm:items-center sm:justify-between">
//             <p className="text-sm text-slate-500">
//               {search
//                 ? `Results for “${search}”`
//                 : "Companies currently listed on Advixio"}
//             </p>

//             {searchInput && (
//               <button
//                 type="button"
//                 onClick={() => setSearchInput("")}
//                 className="w-fit text-sm font-semibold text-blue-700 hover:text-blue-900"
//               >
//                 Clear search ×
//               </button>
//             )}
//           </div>

//           {error ? (
//             <div className="mt-6 rounded-2xl border border-red-200 bg-white p-6">
//               <h3 className="font-bold text-red-700">
//                 Unable to load suppliers
//               </h3>
//               <p className="mt-2 break-words text-sm text-slate-600">
//                 {error}
//               </p>
//               <button
//                 type="button"
//                 onClick={() => void fetchSuppliers()}
//                 className="mt-4 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-700"
//               >
//                 Try again
//               </button>
//             </div>
//           ) : loading ? (
//             <div className="mt-6 space-y-3" aria-label="Loading suppliers">
//               {Array.from({ length: 5 }).map((_, index) => (
//                 <div
//                   key={index}
//                   className="h-28 animate-pulse rounded-2xl border border-slate-200 bg-white"
//                 />
//               ))}
//             </div>
//           ) : suppliers.length === 0 ? (
//             <div className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
//               <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-3xl">
//                 🏢
//               </div>
//               <h3 className="mt-5 text-xl font-bold">
//                 {search ? "No matching suppliers" : "No suppliers available"}
//               </h3>
//               <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
//                 {search
//                   ? "Try another company name, supplier name or location."
//                   : "Suppliers will appear here when the API returns supplier records."}
//               </p>
//               {search && (
//                 <button
//                   type="button"
//                   onClick={() => setSearchInput("")}
//                   className="mt-5 rounded-xl bg-blue-700 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-800"
//                 >
//                   View all suppliers
//                 </button>
//               )}
//             </div>
//           ) : (
//             <div className="mt-5 space-y-3">
//               {suppliers.map((supplier) => {
//                 const companyName =
//                   supplier.companyName?.trim() ||
//                   supplier.name ||
//                   "Supplier";

//                 const location = [
//                   supplier.city?.trim(),
//                   supplier.state?.trim(),
//                 ]
//                   .filter(Boolean)
//                   .join(", ");

//                 return (
//                   <article
//                     key={supplier._id}
//                     className="group rounded-2xl border border-slate-200 bg-white p-4 transition hover:border-blue-200 hover:shadow-lg hover:shadow-slate-200/50 sm:p-5"
//                   >
//                     <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
//                       <div className="flex min-w-0 flex-1 items-center gap-4">
//                         <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border border-blue-100 bg-gradient-to-br from-blue-50 to-indigo-100 text-lg font-extrabold text-blue-800">
//                           {initials(companyName)}
//                         </div>

//                         <div className="min-w-0 flex-1">
//                           <div className="flex flex-wrap items-center gap-2">
//                             <h3 className="break-words text-base font-bold text-slate-900 transition group-hover:text-blue-700 sm:text-lg">
//                               {companyName}
//                             </h3>
//                             <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-emerald-700">
//                               <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
//                               Active
//                             </span>
//                           </div>

//                           <p className="mt-1 text-sm text-slate-500">
//                             {supplier.name || "Supplier"}
//                           </p>

//                           <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
//                             {location && (
//                               <span className="inline-flex items-center gap-1.5">
//                                 <span aria-hidden="true">⌖</span>
//                                 {location}
//                               </span>
//                             )}
//                             {supplier.email && (
//                               <span className="break-all">
//                                 {supplier.email}
//                               </span>
//                             )}
//                           </div>
//                         </div>
//                       </div>

//                       <div className="flex items-center justify-between gap-4 border-t border-slate-100 pt-4 sm:justify-end sm:border-l sm:border-t-0 sm:pl-5 sm:pt-0">
//                         <div className="min-w-20">
//                           <p className="text-xl font-bold text-slate-900">
//                             {(supplier.productCount || 0).toLocaleString()}
//                           </p>
//                           <p className="mt-1 text-xs text-slate-500">
//                             Active products
//                           </p>
//                         </div>

//                         <Link
//   href={`/suppliers/${supplier.slug || supplier._id}`}
//   className="group/profile inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 px-5 py-3 text-sm font-semibold text-white shadow-md shadow-indigo-200/60 transition-all duration-300 hover:-translate-y-0.5 hover:from-indigo-700 hover:via-violet-700 hover:to-purple-700 hover:shadow-lg hover:shadow-indigo-300/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 active:translate-y-0"
// >
//   View profile
//   <span
//     aria-hidden="true"
//     className="transition-transform duration-200 group-hover/profile:translate-x-1"
//   >
//     →
//   </span>
// </Link>
//                       </div>
//                     </div>
//                   </article>
//                 );
//               })}
//             </div>
//           )}

//           {!loading && !error && total > 0 && (
//             <div className="mt-7 flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
//               <p className="text-sm text-slate-500">
//                 Page {page} of {totalPages}
//               </p>

//               <div className="flex items-center gap-2">
//                 <button
//                   type="button"
//                   disabled={page <= 1}
//                   onClick={() => {
//                     setPage((current) => Math.max(1, current - 1));
//                     document
//                       .getElementById("supplier-directory")
//                       ?.scrollIntoView({ behavior: "smooth" });
//                   }}
//                   className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
//                 >
//                   ← Previous
//                 </button>

//                 <button
//                   type="button"
//                   disabled={page >= totalPages}
//                   onClick={() => {
//                     setPage((current) => Math.min(totalPages, current + 1));
//                     document
//                       .getElementById("supplier-directory")
//                       ?.scrollIntoView({ behavior: "smooth" });
//                   }}
//                   className="rounded-xl bg-blue-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-40"
//                 >
//                   Next →
//                 </button>
//               </div>
//             </div>
//           )}

//           <div className="mt-10 flex flex-col gap-4 rounded-2xl border border-blue-100 bg-gradient-to-r from-blue-50 to-indigo-50 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
//             <div>
//               <h3 className="text-lg font-bold text-slate-900">
//                 Looking for a particular product?
//               </h3>
//               <p className="mt-2 max-w-xl text-sm leading-6 text-slate-600">
//                 Browse available products to find options that match your
//                 business requirements.
//               </p>
//             </div>

//             <Link
//               href="/products"
//               className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-blue-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-800"
//             >
//               Browse products <span aria-hidden="true">→</span>
//             </Link>
//           </div>
//         </section>
//       </main>

//       <Footer />
//     </>
//   );
// }





"use client";

import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useCallback, useEffect, useMemo, useState } from "react";

type Supplier = {
  _id: string;
  slug?: string;
  name: string;
  companyName?: string;
  email?: string;
  phone?: string;
  city?: string;
  state?: string;
  productCount?: number;
  createdAt?: string;
};

type ApiResponse = {
  success: boolean;
  message?: string;
  data?: Supplier[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
};

const API_URL = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"
).replace(/\/+$/, "");

const PAGE_SIZE = 20;

function getInitials(name: string) {
  return (
    name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part[0])
      .join("")
      .toUpperCase() || "S"
  );
}

function SearchIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className={className}
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m16 16 4 4" />
    </svg>
  );
}

function PinIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-4 w-4 shrink-0"
      aria-hidden="true"
    >
      <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  );
}

function BuildingIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      className="h-6 w-6"
      aria-hidden="true"
    >
      <rect x="4" y="3" width="16" height="18" rx="2" />
      <path d="M9 7h2m2 0h2M9 11h2m2 0h2M9 15h2m2 0h2M10 21v-3h4v3" />
    </svg>
  );
}

function PackageIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      className="h-6 w-6"
      aria-hidden="true"
    >
      <path d="m12 3 9 5-9 5-9-5 9-5Z" />
      <path d="m3 8 9 5 9-5M3 8v9l9 5 9-5V8M12 13v9" />
    </svg>
  );
}

function ArrowIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className={className}
      aria-hidden="true"
    >
      <path d="M5 12h14m-6-6 6 6-6 6" />
    </svg>
  );
}

export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1);
      setSearch(searchInput.trim());
    }, 350);

    return () => clearTimeout(timer);
  }, [searchInput]);

  const fetchSuppliers = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: String(PAGE_SIZE),
      });

      if (search) params.set("search", search);

      const response = await fetch(
        `${API_URL}/suppliers?${params.toString()}`
      );

      if (!response.ok) {
        throw new Error(`Server returned HTTP ${response.status}`);
      }

      const result = (await response.json()) as ApiResponse;

      if (!result.success || !Array.isArray(result.data)) {
        throw new Error(result.message || "Invalid supplier response");
      }

      setSuppliers(result.data);
      setTotal(result.pagination?.total ?? result.data.length);
    } catch (err) {
      setSuppliers([]);
      setTotal(0);
      setError(
        err instanceof Error
          ? err.message
          : "Could not load suppliers. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => {
    void fetchSuppliers();
  }, [fetchSuppliers]);

  const activeProducts = useMemo(
    () =>
      suppliers.reduce(
        (sum, supplier) => sum + (supplier.productCount || 0),
        0
      ),
    [suppliers]
  );

  const locations = useMemo(
    () =>
      new Set(
        suppliers
          .map((supplier) => supplier.state?.trim().toLowerCase())
          .filter(Boolean)
      ).size,
    [suppliers]
  );

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const changePage = (nextPage: number) => {
    setPage(nextPage);
    document
      .getElementById("supplier-directory")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <>
      <Navbar />

      <main className="min-h-screen overflow-hidden bg-[#f7f8fc] text-slate-900">
        {/* HERO */}
        <section className="relative isolate overflow-hidden bg-[#0b1024]">
          <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,rgba(124,58,237,0.26),transparent_45%),radial-gradient(ellipse_at_bottom_left,rgba(79,70,229,0.22),transparent_45%)]" />

          <div className="pointer-events-none absolute -right-24 top-16 -z-10 h-72 w-72 rounded-full border border-white/[0.07] sm:h-96 sm:w-96" />
          <div className="pointer-events-none absolute -right-12 top-28 -z-10 h-56 w-56 rounded-full border border-white/[0.07] sm:h-72 sm:w-72" />

          <div className="mx-auto max-w-7xl px-5 pb-12 pt-14 sm:px-8 sm:pb-16 sm:pt-20 lg:pt-24">
            <div className="grid items-center gap-12 lg:grid-cols-[1.2fr_0.8fr]">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-indigo-300/20 bg-indigo-400/10 px-3.5 py-2 text-[11px] font-bold uppercase tracking-[0.18em] text-indigo-200 sm:text-xs">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.8)]" />
                  Advixio supplier network
                </div>

                <h1 className="mt-7 max-w-3xl text-4xl font-black leading-[1.12] tracking-tight text-white sm:text-5xl lg:text-[62px]">
                  Discover suppliers.
                  <span className="mt-2 block bg-gradient-to-r from-indigo-300 via-violet-300 to-fuchsia-300 bg-clip-text text-transparent">
                    Build something bigger.
                  </span>
                </h1>

                <p className="mt-6 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base sm:leading-8">
                  Find companies, explore product offerings and connect with
                  businesses that can help your next idea move forward.
                </p>

                <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-slate-300">
                  <span className="inline-flex items-center gap-2">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-400/15 text-emerald-300">
                      ✓
                    </span>
                    Business discovery
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-400/15 text-emerald-300">
                      ✓
                    </span>
                    Product exploration
                  </span>
                </div>

                {/* SEARCH */}
                <div className="mt-9 max-w-2xl rounded-2xl border border-white/10 bg-white/[0.07] p-2 shadow-2xl shadow-black/20 backdrop-blur-xl sm:flex sm:items-center">
                  <div className="flex min-w-0 flex-1 items-center gap-3 px-3">
                    <SearchIcon className="h-5 w-5 shrink-0 text-indigo-300" />
                    <input
                      id="supplier-search"
                      type="search"
                      value={searchInput}
                      onChange={(event) => setSearchInput(event.target.value)}
                      placeholder="Search companies, suppliers or cities..."
                      aria-label="Search suppliers"
                      className="h-12 w-full min-w-0 bg-transparent text-sm text-white outline-none placeholder:text-slate-400"
                    />
                    {searchInput && (
                      <button
                        type="button"
                        onClick={() => setSearchInput("")}
                        aria-label="Clear search"
                        className="rounded-lg px-2 py-1 text-lg text-slate-400 transition hover:bg-white/10 hover:text-white"
                      >
                        ×
                      </button>
                    )}
                  </div>

                  <Link
                    href="/products"
                    className="mt-2 inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 px-6 text-sm font-bold text-white shadow-lg shadow-indigo-950/20 transition hover:from-indigo-400 hover:to-violet-500 sm:mt-0 sm:w-auto"
                  >
                    Explore products
                    <ArrowIcon />
                  </Link>
                </div>

                <p className="mt-3 pl-1 text-xs text-slate-400">
                  Search by company name, supplier name, city or state.
                </p>
              </div>

              {/* HERO SIDE PANEL */}
              <div className="relative hidden lg:block">
                <div className="absolute -inset-6 rounded-[36px] bg-gradient-to-br from-indigo-500/20 to-fuchsia-500/10 blur-2xl" />

                <div className="relative rounded-[30px] border border-white/10 bg-white/[0.06] p-7 shadow-2xl backdrop-blur-xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-400">
                        Your business network
                      </p>
                      <p className="mt-1 text-xl font-bold text-white">
                        Find your next partner
                      </p>
                    </div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-lg shadow-indigo-950/40">
                      <BuildingIcon />
                    </div>
                  </div>

                  <div className="mt-7 space-y-3">
                    {[
                      {
                        number: "01",
                        title: "Explore companies",
                        subtitle: "Discover businesses in the directory",
                      },
                      {
                        number: "02",
                        title: "Review their offerings",
                        subtitle: "See products listed by suppliers",
                      },
                      {
                        number: "03",
                        title: "Find the right fit",
                        subtitle: "Open a supplier profile for details",
                      },
                    ].map((item) => (
                      <div
                        key={item.number}
                        className="flex items-center gap-4 rounded-2xl border border-white/[0.07] bg-white/[0.035] p-4"
                      >
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-400/10 text-sm font-extrabold text-indigo-300">
                          {item.number}
                        </span>
                        <div>
                          <p className="text-sm font-semibold text-white">
                            {item.title}
                          </p>
                          <p className="mt-1 text-xs leading-5 text-slate-400">
                            {item.subtitle}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-5 flex items-center gap-3 rounded-2xl border border-indigo-300/10 bg-indigo-400/[0.07] p-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-400/10 text-indigo-300">
                      <PackageIcon />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">
                        One business directory
                      </p>
                      <p className="mt-1 text-xs text-slate-400">
                        A simpler way to explore suppliers.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* STATS */}
            <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-3">
              {[
                {
                  label: "Listed suppliers",
                  value: loading && total === 0 ? "—" : total.toLocaleString(),
                  note: "Matching your search",
                  icon: <BuildingIcon />,
                },
                {
                  label: "Listed products",
                  value: loading ? "—" : activeProducts.toLocaleString(),
                  note: "On this page",
                  icon: <PackageIcon />,
                },
                {
                  label: "States represented",
                  value: loading ? "—" : locations.toLocaleString(),
                  note: "On this page",
                  icon: <PinIcon />,
                },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="group flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.055] p-5 transition hover:border-indigo-300/25 hover:bg-white/[0.09] sm:p-6"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500/20 to-violet-500/20 text-indigo-200 ring-1 ring-white/10 transition group-hover:scale-105">
                    {stat.icon}
                  </div>
                  <div>
                    <p className="text-sm text-slate-400">{stat.label}</p>
                    <p className="mt-1 text-2xl font-extrabold tracking-tight text-white">
                      {stat.value}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">{stat.note}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SUPPLIER DIRECTORY */}
        <section
          id="supplier-directory"
          className="scroll-mt-8 mx-auto max-w-7xl px-5 py-14 sm:px-8 sm:py-20"
        >
          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-indigo-600">
                <span className="h-px w-7 bg-indigo-500" />
                Discover your partners
              </div>
              <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
                Supplier directory
              </h2>
              <p className="mt-3 max-w-xl text-sm leading-7 text-slate-500 sm:text-base">
                Explore businesses, review supplier information and discover
                companies relevant to your sourcing needs.
              </p>
            </div>

            <div className="flex w-fit items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                <BuildingIcon />
              </div>
              <div>
                <p className="text-lg font-extrabold text-slate-900">
                  {total.toLocaleString()}
                </p>
                <p className="text-xs text-slate-500">
                  {total === 1 ? "Supplier found" : "Suppliers found"}
                </p>
              </div>
            </div>
          </div>

          {/* DIRECTORY TOOLBAR */}
          <div className="mt-9 flex flex-col gap-4 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:px-5">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
                <SearchIcon />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-800">
                  {search ? `Results for "${search}"` : "All listed suppliers"}
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  {loading
                    ? "Finding suppliers..."
                    : `Showing ${suppliers.length} supplier${suppliers.length === 1 ? "" : "s"} on this page`}
                </p>
              </div>
            </div>

            {searchInput && (
              <button
                type="button"
                onClick={() => setSearchInput("")}
                className="inline-flex w-fit items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700"
              >
                Clear search <span aria-hidden="true">×</span>
              </button>
            )}
          </div>

          {/* ERROR */}
          {error ? (
            <div className="mt-6 rounded-3xl border border-red-200 bg-white p-7 shadow-sm sm:p-10">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-xl text-red-600">
                !
              </div>
              <h3 className="mt-4 text-xl font-bold text-slate-900">
                Unable to load suppliers
              </h3>
              <p className="mt-2 break-words text-sm leading-6 text-slate-500">
                {error}
              </p>
              <button
                type="button"
                onClick={() => void fetchSuppliers()}
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-bold text-white transition hover:bg-indigo-700"
              >
                Try again <ArrowIcon />
              </button>
            </div>
          ) : loading ? (
            /* LOADING SKELETONS */
            <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2">
              {Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={index}
                  className="animate-pulse rounded-3xl border border-slate-200 bg-white p-6"
                >
                  <div className="flex gap-4">
                    <div className="h-16 w-16 rounded-2xl bg-slate-200" />
                    <div className="flex-1 pt-1">
                      <div className="h-4 w-3/4 rounded bg-slate-200" />
                      <div className="mt-3 h-3 w-1/2 rounded bg-slate-100" />
                      <div className="mt-3 h-3 w-2/3 rounded bg-slate-100" />
                    </div>
                  </div>
                  <div className="mt-7 h-11 rounded-xl bg-slate-100" />
                </div>
              ))}
            </div>
          ) : suppliers.length === 0 ? (
            /* EMPTY STATE */
            <div className="mt-6 rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center sm:py-20">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-50 to-violet-100 text-indigo-600">
                <BuildingIcon />
              </div>
              <h3 className="mt-5 text-xl font-extrabold text-slate-900">
                {search ? "No matching suppliers" : "No suppliers available yet"}
              </h3>
              <p className="mx-auto mt-2 max-w-md text-sm leading-7 text-slate-500">
                {search
                  ? "Try another company name or search by city or state."
                  : "Supplier profiles will appear here when records are available."}
              </p>
              {searchInput && (
                <button
                  type="button"
                  onClick={() => setSearchInput("")}
                  className="mt-6 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-200 transition hover:-translate-y-0.5 hover:shadow-indigo-300"
                >
                  View all suppliers
                </button>
              )}
            </div>
          ) : (
            /* SUPPLIER CARDS */
            <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2">
              {suppliers.map((supplier, index) => {
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

                return (
                  <article
                    key={supplier._id}
                    className="group relative flex min-w-0 flex-col overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-5 shadow-[0_4px_24px_rgba(15,23,42,0.035)] transition-all duration-300 hover:-translate-y-1 hover:border-indigo-200 hover:shadow-[0_18px_45px_rgba(79,70,229,0.10)] sm:p-6"
                  >
                    <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-500 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                    <div className="flex items-start gap-4">
                      <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700 text-xl font-black tracking-wide text-white shadow-lg shadow-indigo-200/60 ring-4 ring-indigo-50 transition duration-300 group-hover:scale-105">
                        {getInitials(companyName)}
                      </div>

                      <div className="min-w-0 flex-1 pt-0.5">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="rounded-lg bg-slate-100 px-2 py-1 text-[10px] font-extrabold uppercase tracking-wider text-slate-500">
                            Supplier {String(index + 1 + (page - 1) * PAGE_SIZE).padStart(2, "0")}
                          </span>
                          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-100 bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-700">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                            Listed
                          </span>
                        </div>

                        <h3 className="mt-3 break-words text-lg font-extrabold leading-snug tracking-tight text-slate-900 transition-colors group-hover:text-indigo-700 sm:text-xl">
                          {companyName}
                        </h3>

                        <p className="mt-1 break-words text-sm text-slate-500">
                          {supplier.name || "Business supplier"}
                        </p>
                      </div>
                    </div>

                    <div className="mt-6 space-y-3 border-t border-slate-100 pt-5">
                      <div className="flex min-w-0 items-start gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-50 text-slate-500 transition group-hover:bg-indigo-50 group-hover:text-indigo-600">
                          <PinIcon />
                        </div>
                        <div className="min-w-0 flex-1 pt-0.5">
                          <p className="text-[10px] font-bold uppercase tracking-[0.13em] text-slate-400">
                            Location
                          </p>
                          <p className="mt-1 break-words text-sm font-medium text-slate-700">
                            {location || "Location not provided"}
                          </p>
                        </div>
                      </div>

                      {supplier.email && (
                        <div className="flex min-w-0 items-start gap-3">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-50 text-slate-500 transition group-hover:bg-indigo-50 group-hover:text-indigo-600">
                            <svg
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="1.7"
                              className="h-4 w-4"
                              aria-hidden="true"
                            >
                              <rect x="3" y="5" width="18" height="14" rx="2" />
                              <path d="m3 7 9 6 9-6" />
                            </svg>
                          </div>
                          <div className="min-w-0 flex-1 pt-0.5">
                            <p className="text-[10px] font-bold uppercase tracking-[0.13em] text-slate-400">
                              Email address
                            </p>
                            <p className="mt-1 break-all text-sm font-medium text-slate-700">
                              {supplier.email}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="mt-6 flex items-center justify-between gap-3 rounded-2xl bg-slate-50 p-4 transition group-hover:bg-indigo-50/60">
                      <div className="flex min-w-0 items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-indigo-600 shadow-sm ring-1 ring-slate-100">
                          <PackageIcon />
                        </div>
                        <div>
                          <p className="text-xl font-black tracking-tight text-slate-900">
                            {(supplier.productCount || 0).toLocaleString()}
                          </p>
                          <p className="text-xs text-slate-500">
                            Listed products
                          </p>
                        </div>
                      </div>

                      <Link
                        href={`/suppliers/${supplier.slug || supplier._id}`}
                        className="group/profile inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 px-4 py-3 text-xs font-bold text-white shadow-md shadow-indigo-200/60 transition-all duration-300 hover:-translate-y-0.5 hover:from-indigo-700 hover:via-violet-700 hover:to-purple-700 hover:shadow-lg hover:shadow-indigo-300/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 sm:px-5 sm:text-sm"
                      >
                        View profile
                        <ArrowIcon className="h-4 w-4 transition-transform duration-200 group-hover/profile:translate-x-1" />
                      </Link>
                    </div>
                  </article>
                );
              })}
            </div>
          )}

          {/* PAGINATION */}
          {!loading && !error && total > 0 && (
            <div className="mt-8 flex flex-col gap-4 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:px-6">
              <div>
                <p className="text-sm font-bold text-slate-800">
                  Page {page} of {totalPages}
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  {total.toLocaleString()} total suppliers
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={page <= 1}
                  onClick={() => changePage(Math.max(1, page - 1))}
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-sm font-bold text-slate-700 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700 disabled:cursor-not-allowed disabled:opacity-40 sm:flex-none"
                >
                  <span aria-hidden="true">←</span> Previous
                </button>

                <span className="inline-flex h-11 min-w-11 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 px-3 text-sm font-extrabold text-white shadow-md shadow-indigo-200">
                  {page}
                </span>

                <button
                  type="button"
                  disabled={page >= totalPages}
                  onClick={() => changePage(Math.min(totalPages, page + 1))}
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-bold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-40 sm:flex-none"
                >
                  Next <span aria-hidden="true">→</span>
                </button>
              </div>
            </div>
          )}

          {/* BOTTOM CTA */}
          <div className="relative mt-14 overflow-hidden rounded-[28px] bg-[#11152e] p-6 shadow-xl shadow-indigo-950/10 sm:p-9 lg:p-10">
            <div className="pointer-events-none absolute -right-10 -top-24 h-64 w-64 rounded-full bg-violet-500/20 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-24 left-1/3 h-56 w-56 rounded-full bg-indigo-500/20 blur-3xl" />

            <div className="relative flex flex-col gap-7 sm:flex-row sm:items-center sm:justify-between">
              <div className="max-w-2xl">
                <div className="inline-flex items-center gap-2 rounded-full border border-indigo-300/20 bg-indigo-400/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-indigo-200">
                  Explore more
                </div>
                <h3 className="mt-4 text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
                  Looking for a specific product?
                </h3>
                <p className="mt-3 text-sm leading-7 text-slate-300">
                  Explore the product directory and discover options that match
                  your business requirements.
                </p>
              </div>

              <Link
                href="/products"
                className="inline-flex shrink-0 items-center justify-center gap-3 rounded-xl bg-white px-6 py-3.5 text-sm font-extrabold text-indigo-700 shadow-lg transition hover:-translate-y-0.5 hover:bg-indigo-50"
              >
                Browse products
                <ArrowIcon />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
