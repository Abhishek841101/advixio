
"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

type Admin = {
  id: string;
  name: string;
  email: string;
  role: string;
  lastLogin?: string | null;
};

type Stats = {
  totalProducts: number;
  activeProducts: number;
  inactiveProducts: number;
  pendingProducts: number;
  totalUsers: number;
  suppliers: number;
  buyers: number;
};

type Product = {
  _id: string;
  name: string;
  slug: string;
  images?: string[];
  price?: number;
  unit?: string;
  status: "active" | "inactive" | "pending";
  companyName?: string;
  brand?: string;
  createdAt: string;
  category?: {
    name?: string;
    slug?: string;
  };
  seller?: {
    name?: string;
    email?: string;
    companyName?: string;
    phone?: string;
  } | null;
  location?: {
    city?: string;
    state?: string;
  };
};

const emptyStats: Stats = {
  totalProducts: 0,
  activeProducts: 0,
  inactiveProducts: 0,
  pendingProducts: 0,
  totalUsers: 0,
  suppliers: 0,
  buyers: 0,
};

export default function AdminDashboard() {
  const router = useRouter();

  const [admin, setAdmin] = useState<Admin | null>(null);
  const [stats, setStats] = useState<Stats>(emptyStats);
  const [products, setProducts] = useState<Product[]>([]);

  const [loading, setLoading] = useState(true);
  const [productsLoading, setProductsLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);

  const [updatingId, setUpdatingId] = useState("");

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const getToken = () => {
    if (typeof window === "undefined") return "";
    return localStorage.getItem("advixio_admin_token") || "";
  };

  const logout = () => {
    localStorage.removeItem("advixio_admin_token");
    localStorage.removeItem("advixio_admin");
    router.replace("/admin/login");
  };

  // ==========================================
  // VERIFY ADMIN
  // ==========================================

  useEffect(() => {
    const verifyAdmin = async () => {
      const token = getToken();

      if (!token) {
        router.replace("/admin/login");
        return;
      }

      try {
        const response = await fetch(`${API_URL}/admin/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          cache: "no-store",
        });

        if (response.status === 401 || response.status === 403) {
          logout();
          return;
        }

        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(result.message || "Admin verification failed");
        }

        const currentAdmin = result.admin || result.data?.admin;

        if (currentAdmin) {
          setAdmin(currentAdmin);
          localStorage.setItem(
            "advixio_admin",
            JSON.stringify(currentAdmin)
          );
        }
      } catch (err) {
        console.error("Admin verification error:", err);
        setError("Unable to verify admin account.");
      } finally {
        setLoading(false);
      }
    };

    verifyAdmin();
  }, [router]);

  // ==========================================
  // FETCH STATISTICS
  // ==========================================

  const fetchStats = useCallback(async () => {
    const token = getToken();

    if (!token) return;

    try {
      const response = await fetch(`${API_URL}/admin/products/stats`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Unable to load statistics");
      }

      setStats({
        ...emptyStats,
        ...result.data,
      });
    } catch (err) {
      console.error("Statistics error:", err);
    }
  }, []);

  // ==========================================
  // FETCH PRODUCTS
  // ==========================================

  const fetchProducts = useCallback(async () => {
    const token = getToken();

    if (!token) return;

    setProductsLoading(true);

    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: "10",
        search,
        status: statusFilter,
      });

      const response = await fetch(
        `${API_URL}/admin/products?${params.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          cache: "no-store",
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Unable to load products");
      }

      setProducts(result.data || []);
      setTotalPages(result.pagination?.totalPages || 1);
      setTotalProducts(result.pagination?.total || 0);
    } catch (err) {
      console.error("Products error:", err);
      setError(
        err instanceof Error ? err.message : "Failed to load products"
      );
    } finally {
      setProductsLoading(false);
    }
  }, [page, search, statusFilter]);

  useEffect(() => {
    if (!loading && admin) {
      fetchStats();
      fetchProducts();
    }
  }, [loading, admin, fetchStats, fetchProducts]);

  // ==========================================
  // SEARCH
  // ==========================================

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPage(1);
    setSearch(searchInput.trim());
  };

  // ==========================================
  // STATUS UPDATE
  // ==========================================

  const updateProductStatus = async (
    productId: string,
    newStatus: Product["status"]
  ) => {
    const token = getToken();

    if (!token) {
      logout();
      return;
    }

    setUpdatingId(productId);

    try {
      const response = await fetch(
        `${API_URL}/admin/products/${productId}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Status update failed");
      }

      await Promise.all([fetchStats(), fetchProducts()]);
    } catch (err) {
      alert(
        err instanceof Error ? err.message : "Unable to update product"
      );
    } finally {
      setUpdatingId("");
    }
  };

  const formatDate = (date: string) => {
    if (!date) return "—";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatPrice = (price?: number, unit?: string) => {
    if (price === undefined || price === null) {
      return "Price on request";
    }

    return `₹${price.toLocaleString("en-IN")}${unit ? ` / ${unit}` : ""}`;
  };

  const statusClass = (status: string) => {
    if (status === "active") {
      return "bg-emerald-50 text-emerald-700 ring-emerald-600/20";
    }

    if (status === "pending") {
      return "bg-amber-50 text-amber-700 ring-amber-600/20";
    }

    return "bg-slate-100 text-slate-600 ring-slate-500/20";
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F6F7FB]">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-indigo-100 border-t-indigo-600" />
          <p className="mt-4 text-sm font-medium text-slate-500">
            Loading admin dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F6F7FB] text-slate-800">
      {/* MOBILE OVERLAY */}
      {sidebarOpen && (
        <button
          aria-label="Close sidebar"
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[260px] flex-col bg-[#171A35] text-white transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        <div className="flex h-[76px] items-center justify-between border-b border-white/10 px-6">
          <Link href="/admin/dashboard" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500 text-lg font-black">
              A
            </div>
            <div>
              <p className="text-lg font-bold tracking-tight">Advixio360</p>
              <p className="text-[10px] font-semibold uppercase tracking-[2px] text-indigo-300">
                Admin Panel
              </p>
            </div>
          </Link>

          <button
            onClick={() => setSidebarOpen(false)}
            className="text-2xl text-white/70 lg:hidden"
          >
            ×
          </button>
        </div>

        <div className="px-4 py-7">
          <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[2px] text-slate-500">
            Main Menu
          </p>

          <Link
            href="/admin/dashboard"
            className="flex items-center gap-3 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-950/20"
          >
            <span className="text-lg">▦</span>
            Dashboard
          </Link>

          <Link
            href="/admin/users"
            className="mt-2 flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-300 transition hover:bg-white/10 hover:text-white"
          >
            <span className="text-lg">♙</span>
            Manage Users
          </Link>

          <a
            href="/products"
            target="_blank"
            rel="noreferrer"
            className="mt-2 flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-300 transition hover:bg-white/10 hover:text-white"
          >
            <span className="text-lg">◇</span>
            Marketplace
          </a>

          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="mt-2 flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-300 transition hover:bg-white/10 hover:text-white"
          >
            <span className="text-lg">↗</span>
            Visit Website
          </a>
        </div>

        <div className="mt-auto border-t border-white/10 p-4">
          <div className="mb-4 flex items-center gap-3 rounded-xl bg-white/[0.06] p-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-500 text-sm font-bold">
              {admin?.name?.charAt(0)?.toUpperCase() || "A"}
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold">
                {admin?.name || "Administrator"}
              </p>
              <p className="truncate text-xs text-slate-400">
                {admin?.email || "Admin Account"}
              </p>
            </div>
          </div>

          <button
            onClick={logout}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-rose-300 transition hover:bg-rose-500/10"
          >
            <span>⇥</span>
            Logout
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="min-h-screen lg:ml-[260px]">
        {/* TOPBAR */}
        <header className="sticky top-0 z-30 flex h-[76px] items-center justify-between border-b border-slate-200 bg-white/90 px-4 backdrop-blur-xl sm:px-7 lg:px-9">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="rounded-lg border border-slate-200 p-2 text-xl lg:hidden"
            >
              ☰
            </button>

            <div>
              <p className="text-sm font-bold text-slate-800">
                Admin Dashboard
              </p>
              <p className="hidden text-xs text-slate-400 sm:block">
                Manage your marketplace from one place
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 sm:inline-flex">
              ● System Online
            </span>

            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-100 text-sm font-bold text-indigo-700">
              {admin?.name?.charAt(0)?.toUpperCase() || "A"}
            </div>
          </div>
        </header>

        <div className="mx-auto max-w-[1600px] px-4 py-7 sm:px-7 lg:px-9 lg:py-9">
          {/* PAGE HEADING */}
          <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="mb-2 text-xs font-bold uppercase tracking-[2px] text-indigo-600">
                Overview
              </p>

              <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
                Welcome back, {admin?.name?.split(" ")[0] || "Admin"}!
              </h1>

              <p className="mt-2 text-sm text-slate-500">
                Here&apos;s what&apos;s happening with your marketplace today.
              </p>
            </div>

            <button
              onClick={() => {
                fetchStats();
                fetchProducts();
              }}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-indigo-300 hover:text-indigo-600"
            >
              ↻ Refresh Data
            </button>
          </div>

          {error && (
            <div className="mb-6 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
              {error}
            </div>
          )}

          {/* PRODUCT STATISTICS */}
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900">
              Product Overview
            </h2>
            <span className="text-xs text-slate-400">
              Live database statistics
            </span>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
              title="Total Products"
              value={stats.totalProducts}
              subtitle="All listed products"
              icon="▦"
              color="indigo"
            />

            <StatCard
              title="Active Products"
              value={stats.activeProducts}
              subtitle="Visible in marketplace"
              icon="✓"
              color="emerald"
            />

            <StatCard
              title="Inactive Products"
              value={stats.inactiveProducts}
              subtitle="Currently not active"
              icon="◷"
              color="slate"
            />

            <StatCard
              title="Pending Products"
              value={stats.pendingProducts}
              subtitle="Awaiting approval"
              icon="!"
              color="amber"
            />
          </div>

          {/* USER STATISTICS */}
          <div className="mb-3 mt-9 flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900">
              User Overview
            </h2>

            <Link
              href="/admin/users"
              className="text-xs font-bold text-indigo-600 hover:text-indigo-800"
            >
              Manage Users →
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <StatCard
              title="Total Users"
              value={stats.totalUsers}
              subtitle="Registered accounts"
              icon="♙"
              color="indigo"
            />

            <StatCard
              title="Suppliers"
              value={stats.suppliers}
              subtitle="Users with active products"
              icon="▣"
              color="emerald"
            />

            <StatCard
              title="Buyers"
              value={stats.buyers}
              subtitle="Calculated remaining accounts"
              icon="♧"
              color="blue"
            />
          </div>

          {/* PRODUCTS TABLE */}
          <section className="mt-10 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="flex flex-col justify-between gap-4 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:p-6">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  All Products
                </h2>
                <p className="mt-1 text-xs text-slate-500">
                  Complete product listings from your marketplace
                </p>
              </div>

              <div className="rounded-lg bg-indigo-50 px-3 py-2 text-xs font-bold text-indigo-700">
                {totalProducts.toLocaleString("en-IN")} Products Found
              </div>
            </div>

            {/* SEARCH AND FILTER */}
            <div className="flex flex-col gap-3 border-b border-slate-100 p-4 sm:flex-row sm:items-center sm:justify-between">
              <form
                onSubmit={handleSearch}
                className="flex w-full gap-2 sm:max-w-md"
              >
                <input
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="Search product, supplier, category..."
                  className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100"
                />

                <button
                  type="submit"
                  className="rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
                >
                  Search
                </button>
              </form>

              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setPage(1);
                }}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 outline-none focus:border-indigo-400"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="pending">Pending</option>
              </select>
            </div>

            {/* TABLE */}
            <div className="overflow-x-auto">
              <table className="w-full min-w-[950px] text-left">
                <thead>
                  <tr className="bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    <th className="px-5 py-4">Product</th>
                    <th className="px-5 py-4">Supplier</th>
                    <th className="px-5 py-4">Category</th>
                    <th className="px-5 py-4">Price</th>
                    <th className="px-5 py-4">Location</th>
                    <th className="px-5 py-4">Date</th>
                    <th className="px-5 py-4">Status</th>
                    <th className="px-5 py-4">Action</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {productsLoading ? (
                    <tr>
                      <td colSpan={8} className="px-5 py-16 text-center">
                        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-indigo-100 border-t-indigo-600" />
                        <p className="mt-3 text-sm text-slate-500">
                          Loading products...
                        </p>
                      </td>
                    </tr>
                  ) : products.length === 0 ? (
                    <tr>
                      <td
                        colSpan={8}
                        className="px-5 py-16 text-center"
                      >
                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-2xl text-slate-400">
                          ▦
                        </div>
                        <p className="mt-4 font-semibold text-slate-700">
                          No products found
                        </p>
                        <p className="mt-1 text-xs text-slate-400">
                          Try another search or status filter.
                        </p>
                      </td>
                    </tr>
                  ) : (
                    products.map((product) => (
                      <tr
                        key={product._id}
                        className="transition hover:bg-slate-50/80"
                      >
                        <td className="px-5 py-4">
                          <div className="flex min-w-[220px] items-center gap-3">
                            <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-slate-100 bg-slate-100">
                              {product.images?.[0] ? (
                                <img
                                  src={product.images[0]}
                                  alt={product.name}
                                  className="h-full w-full object-contain p-1"
                                />
                              ) : (
                                <div className="flex h-full items-center justify-center text-xl text-slate-400">
                                  ▧
                                </div>
                              )}
                            </div>

                            <div className="min-w-0">
                              <p className="max-w-[200px] truncate text-sm font-bold text-slate-800">
                                {product.name}
                              </p>
                              <p className="mt-1 text-[11px] text-slate-400">
                                {product.brand || "No brand"}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-5 py-4">
                          <p className="max-w-[170px] truncate text-sm font-semibold text-slate-700">
                            {product.seller?.companyName ||
                              product.companyName ||
                              product.seller?.name ||
                              "Unknown"}
                          </p>
                          <p className="mt-1 max-w-[170px] truncate text-xs text-slate-400">
                            {product.seller?.email || "—"}
                          </p>
                        </td>

                        <td className="px-5 py-4">
  <p className="text-sm text-slate-600">
    {product.category?.name || "Uncategorized"}
  </p>
</td>
                        <td className="whitespace-nowrap px-5 py-4 text-sm font-semibold text-slate-700">
                          {formatPrice(product.price, product.unit)}
                        </td>

                        <td className="px-5 py-4">
                          <p className="text-sm text-slate-600">
                            {product.location?.city || "—"}
                          </p>
                          <p className="mt-1 text-xs text-slate-400">
                            {product.location?.state || ""}
                          </p>
                        </td>

                        <td className="whitespace-nowrap px-5 py-4 text-xs text-slate-500">
                          {formatDate(product.createdAt)}
                        </td>

                        <td className="px-5 py-4">
                          <span
                            className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-bold capitalize ring-1 ring-inset ${statusClass(
                              product.status
                            )}`}
                          >
                            {product.status}
                          </span>
                        </td>

                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2">
                            <a
                              href={`/products/${product.slug}`}
                              target="_blank"
                              rel="noreferrer"
                              title="View product"
                              className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600"
                            >
                              ↗
                            </a>

                            <select
                              aria-label={`Change status for ${product.name}`}
                              value={product.status}
                              disabled={updatingId === product._id}
                              onChange={(e) =>
                                updateProductStatus(
                                  product._id,
                                  e.target.value as Product["status"]
                                )
                              }
                              className="max-w-[105px] rounded-lg border border-slate-200 bg-white px-2 py-2 text-xs font-semibold text-slate-600 outline-none focus:border-indigo-400 disabled:opacity-50"
                            >
                              <option value="active">Active</option>
                              <option value="inactive">Inactive</option>
                              <option value="pending">Pending</option>
                            </select>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* PAGINATION */}
            <div className="flex flex-col items-center justify-between gap-3 border-t border-slate-100 px-5 py-4 sm:flex-row">
              <p className="text-xs text-slate-500">
                Showing{" "}
                <span className="font-bold text-slate-800">
                  {products.length}
                </span>{" "}
                of{" "}
                <span className="font-bold text-slate-800">
                  {totalProducts.toLocaleString("en-IN")}
                </span>{" "}
                products
              </p>

              <div className="flex items-center gap-2">
                <button
                  disabled={page <= 1 || productsLoading}
                  onClick={() => setPage((current) => current - 1)}
                  className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Previous
                </button>

                <span className="rounded-lg bg-indigo-50 px-3 py-2 text-xs font-bold text-indigo-700">
                  {page} / {totalPages}
                </span>

                <button
                  disabled={page >= totalPages || productsLoading}
                  onClick={() => setPage((current) => current + 1)}
                  className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            </div>
          </section>

          {/* FOOTER */}
          <div className="mt-7 flex flex-col justify-between gap-2 pb-4 text-xs text-slate-400 sm:flex-row">
            <p>© {new Date().getFullYear()} Advixio360 Admin Panel</p>
            <p>Secure Marketplace Administration</p>
          </div>
        </div>
      </main>
    </div>
  );
}

// ==========================================
// STATISTICS CARD
// ==========================================

function StatCard({
  title,
  value,
  subtitle,
  icon,
  color,
}: {
  title: string;
  value: number;
  subtitle: string;
  icon: string;
  color: "indigo" | "emerald" | "slate" | "amber" | "blue";
}) {
  const colors = {
    indigo: "bg-indigo-50 text-indigo-600",
    emerald: "bg-emerald-50 text-emerald-600",
    slate: "bg-slate-100 text-slate-600",
    amber: "bg-amber-50 text-amber-600",
    blue: "bg-blue-50 text-blue-600",
  };

  return (
    <div className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-indigo-200 hover:shadow-md sm:p-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold text-slate-500">{title}</p>
          <p className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900">
            {value.toLocaleString("en-IN")}
          </p>
        </div>

        <div
          className={`flex h-11 w-11 items-center justify-center rounded-xl text-xl font-bold ${colors[color]}`}
        >
          {icon}
        </div>
      </div>

      <p className="mt-4 text-xs text-slate-400">{subtitle}</p>
    </div>
  );
}
