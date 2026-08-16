

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

type User = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  companyName?: string;
  city?: string;
  state?: string;
};

type Product = {
  _id: string;
  name: string;
  slug: string;
  shortDescription?: string;
  price?: number;
  unit?: string;
  status?: string;
  createdAt?: string;
  category?: {
    _id?: string;
    name?: string;
    slug?: string;
  };
};

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const storedUser = localStorage.getItem("advixio_user");

    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem("advixio_user");
      }
    }

    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("advixio_token");

      if (!token) {
        window.location.href = "/login";
        return;
      }

      const response = await fetch(
        `${API_URL}/products/my-listings`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          cache: "no-store",
        }
      );

      const result = await response.json();

      if (response.status === 401) {
        localStorage.removeItem("advixio_token");
        localStorage.removeItem("advixio_user");
        window.location.href = "/login";
        return;
      }

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Failed to load products."
        );
      }

      setProducts(result.data || []);
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : "Failed to load dashboard."
      );
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("advixio_token");
    localStorage.removeItem("advixio_user");
    window.location.href = "/";
  };

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((word) => word[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "A";

  return (
    <main className="dashboard-page">
      <div className="dashboard-container">

        <div className="dashboard-topbar">
          <div>
            <span className="dashboard-eyebrow">
              ADVIXIO SUPPLIER
            </span>

            <h1>
              Welcome back, {user?.name || "Supplier"} 👋
            </h1>

            <p>
              Manage your products and business activity.
            </p>
          </div>

          <div className="dashboard-top-actions">
            <Link
              href="/products"
              className="dashboard-marketplace-button"
            >
              Browse Marketplace
            </Link>

            <Link
              href="/dashboard/products/add"
              className="dashboard-add-button"
            >
              + Add Product
            </Link>
          </div>
        </div>

        <div className="dashboard-layout">

          <aside className="dashboard-sidebar">

            <div className="dashboard-profile-card">

              <div className="dashboard-avatar">
                {initials}
              </div>

              <h2>
                {user?.name || "User"}
              </h2>

              <p className="dashboard-profile-company">
                {user?.companyName || "Business Account"}
              </p>

              <span className="dashboard-verified">
                ✓ Active Account
              </span>

              <div className="dashboard-profile-divider" />

              <div className="dashboard-profile-info">

                <div>
                  <span>Email</span>
                  <strong>{user?.email || "-"}</strong>
                </div>

                <div>
                  <span>Phone</span>
                  <strong>{user?.phone || "-"}</strong>
                </div>

                <div>
                  <span>Location</span>
                  <strong>
                    {user?.city || "-"}
                    {user?.state
                      ? `, ${user.state}`
                      : ""}
                  </strong>
                </div>

              </div>

              <Link
                href="/dashboard/profile"
                className="dashboard-edit-profile"
              >
                View Profile
              </Link>

            </div>

            <div className="dashboard-sidebar-menu">

              <Link
                href="/dashboard"
                className="dashboard-menu-active"
              >
                📊 Dashboard
              </Link>

              <Link href="/dashboard/products">
                📦 My Products
              </Link>

              <Link href="/dashboard/products/add">
                ➕ Add Product
              </Link>

              <Link href="/dashboard/requirements">
                📋 My Requirements
              </Link>

              <Link href="/dashboard/profile">
                👤 My Profile
              </Link>

              <Link href="/dashboard/settings">
                ⚙️ Settings
              </Link>

              <button
                type="button"
                onClick={logout}
                className="dashboard-logout"
              >
                ↪ Logout
              </button>

            </div>

          </aside>

          <section className="dashboard-content">

            <div className="dashboard-stats">

              <div className="dashboard-stat-card">
                <div className="dashboard-stat-icon">
                  📦
                </div>

                <div>
                  <span>Total Products</span>
                  <strong>
                    {loading ? "..." : products.length}
                  </strong>
                  <small>Your listed products</small>
                </div>
              </div>

              <div className="dashboard-stat-card">
                <div className="dashboard-stat-icon">
                  ✓
                </div>

                <div>
                  <span>Active Products</span>
                  <strong>
                    {loading
                      ? "..."
                      : products.filter(
                          (product) =>
                            product.status === "active"
                        ).length}
                  </strong>
                  <small>Currently visible</small>
                </div>
              </div>

              <div className="dashboard-stat-card">
                <div className="dashboard-stat-icon">
                  🏷️
                </div>

                <div>
                  <span>Categories</span>
                  <strong>
                    {loading
                      ? "..."
                      : new Set(
                          products
                            .map(
                              (product) =>
                                product.category?.slug
                            )
                            .filter(Boolean)
                        ).size}
                  </strong>
                  <small>Used in your products</small>
                </div>
              </div>

              <div className="dashboard-stat-card">
                <div className="dashboard-stat-icon">
                  🏢
                </div>

                <div>
                  <span>Business</span>
                  <strong>
                    {user?.companyName ? "✓" : "—"}
                  </strong>
                  <small>Company profile</small>
                </div>
              </div>

            </div>

            <div className="dashboard-section-header">
              <span>QUICK ACTIONS</span>
              <h2>Manage Your Business</h2>
            </div>

            <div className="dashboard-action-grid">

              <Link
                href="/dashboard/products/add"
                className="dashboard-action-card dashboard-action-primary"
              >
                <div className="dashboard-action-icon">
                  +
                </div>

                <div>
                  <h3>Add New Product</h3>
                  <p>
                    List a new product on the Advixio
                    marketplace.
                  </p>
                </div>

                <span>→</span>
              </Link>

              <Link
                href="/dashboard/products"
                className="dashboard-action-card"
              >
                <div className="dashboard-action-icon">
                  📦
                </div>

                <div>
                  <h3>My Products</h3>
                  <p>
                    View, edit and delete your listed
                    products.
                  </p>
                </div>

                <span>→</span>
              </Link>

              <Link
                href="/dashboard/profile"
                className="dashboard-action-card"
              >
                <div className="dashboard-action-icon">
                  👤
                </div>

                <div>
                  <h3>Business Profile</h3>
                  <p>
                    Manage your company and contact
                    information.
                  </p>
                </div>

                <span>→</span>
              </Link>

            </div>

            <div className="dashboard-panel dashboard-recent-panel">

              <div className="dashboard-panel-header">
                <div>
                  <span>PRODUCTS</span>
                  <h2>Recent Products</h2>
                </div>

                <Link href="/dashboard/products">
                  View All
                </Link>
              </div>

              {error && (
                <div className="dashboard-error">
                  {error}
                </div>
              )}

              {loading ? (
                <div className="dashboard-loading">
                  Loading your products...
                </div>
              ) : products.length === 0 ? (
                <div className="dashboard-empty-state">
                  <div>📦</div>

                  <h3>
                    No products listed yet
                  </h3>

                  <p>
                    Start selling by adding your first
                    product to the Advixio marketplace.
                  </p>

                  <Link href="/dashboard/products/add">
                    Add Your First Product →
                  </Link>
                </div>
              ) : (
                <div className="dashboard-product-list">

                  {products
                    .slice(0, 5)
                    .map((product) => (
                      <div
                        key={product._id}
                        className="dashboard-product-row"
                      >

                        <div className="dashboard-product-icon">
                          📦
                        </div>

                        <div className="dashboard-product-info">
                          <strong>
                            {product.name}
                          </strong>

                          <span>
                            {product.category?.name ||
                              "Uncategorized"}
                          </span>
                        </div>

                        <div className="dashboard-product-price">
                          {product.price
                            ? `₹${Number(
                                product.price
                              ).toLocaleString("en-IN")}`
                            : "Price on request"}
                        </div>

                        <Link
                          href={`/dashboard/products/${product._id}/edit`}
                        >
                          Edit
                        </Link>

                      </div>
                    ))}

                </div>
              )}

            </div>

          </section>
        </div>
      </div>
    </main>
  );
}