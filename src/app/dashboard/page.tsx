"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

type User = {
  id?: string;
  _id?: string;
  name: string;
  email: string;
  phone?: string;
  companyName?: string;
  city?: string;
  state?: string;
  profileImage?: string;
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

  const loadUserProfile = async () => {
    try {
      const token = localStorage.getItem("advixio_token");
      if (!token) return;

      const response = await fetch(`${API_URL}/auth/profile`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      });

      const result = await response.json();

      if (response.status === 401) {
        localStorage.removeItem("advixio_token");
        localStorage.removeItem("advixio_user");
        window.location.href = "/login";
        return;
      }

      if (!response.ok || !result.success || !result.data) {
        throw new Error(result.message || "Failed to load profile.");
      }

      setUser(result.data);
      localStorage.setItem("advixio_user", JSON.stringify(result.data));
    } catch (err) {
      console.error("Failed to load profile:", err);
    }
  };

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("advixio_token");
      if (!token) {
        window.location.href = "/login";
        return;
      }

      const response = await fetch(`${API_URL}/products/my-listings`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      });

      const result = await response.json();

      if (response.status === 401) {
        localStorage.removeItem("advixio_token");
        localStorage.removeItem("advixio_user");
        window.location.href = "/login";
        return;
      }

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to load products.");
      }

      setProducts(result.data || []);
    } catch (err) {
      console.error(err);
      setError(
        err instanceof Error ? err.message : "Failed to load dashboard."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("advixio_user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem("advixio_user");
      }
    }

    loadUserProfile();
    loadProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const initials = useMemo(() => {
    if (!user?.name) return "A";
    return user.name
      .split(" ")
      .filter(Boolean)
      .map((word) => word[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  }, [user?.name]);

  const activeCount = products.filter((p) => p.status === "active").length;
  const categoryCount = new Set(
    products.map((p) => p.category?.slug).filter(Boolean)
  ).size;

  const recentProducts = [...products]
    .sort((a, b) => {
      const da = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const db = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return db - da;
    })
    .slice(0, 5);

  return (
    <>
      <div className="sd-page-head">
        <div>
          <h1>Good morning, {user?.name || "Supplier"} 👋</h1>
          <p>Manage your products, profile, and business activity.</p>
        </div>
        <div className="sd-actions">
          <Link href="/products" className="sd-btn">
            Browse Marketplace
          </Link>
          <Link href="/dashboard/products/add" className="sd-btn sd-btn-primary">
            ＋ Add Product
          </Link>
        </div>
      </div>

      <div className="sd-profile-progress">
        <div className="sd-progress-info">
          <strong>Business Profile</strong>
          <p>
            {user?.companyName
              ? `${user.companyName}${user.city ? ` · ${user.city}` : ""}`
              : "Complete your business details to build buyer trust"}
          </p>
        </div>
        <div className="sd-progress-track">
          <i
            style={{
              width: user?.companyName && user?.phone ? "85%" : "45%",
            }}
          />
        </div>
        <div className="sd-progress-value">
          {user?.companyName && user?.phone ? "85%" : "45%"}
        </div>
      </div>

      <div className="sd-stats four">
        <div className="sd-stat-card">
          <div className="sd-stat-top">
            <span className="sd-stat-label">TOTAL PRODUCTS</span>
            <span className="sd-stat-icon">📦</span>
          </div>
          <div className="sd-stat-value">{loading ? "…" : products.length}</div>
          <div className="sd-stat-change neutral">Listed by your business</div>
        </div>
        <div className="sd-stat-card">
          <div className="sd-stat-top">
            <span className="sd-stat-label">ACTIVE PRODUCTS</span>
            <span className="sd-stat-icon">✓</span>
          </div>
          <div className="sd-stat-value">{loading ? "…" : activeCount}</div>
          <div className="sd-stat-change neutral">Currently visible</div>
        </div>
        <div className="sd-stat-card">
          <div className="sd-stat-top">
            <span className="sd-stat-label">CATEGORIES</span>
            <span className="sd-stat-icon">🏷</span>
          </div>
          <div className="sd-stat-value">{loading ? "…" : categoryCount}</div>
          <div className="sd-stat-change neutral">Used in listings</div>
        </div>
        <div className="sd-stat-card">
          <div className="sd-stat-top">
            <span className="sd-stat-label">ACCOUNT</span>
            <span className="sd-stat-icon">🏢</span>
          </div>
          <div className="sd-stat-value">{user ? "Active" : "—"}</div>
          <div className="sd-stat-change neutral">
            {user?.companyName ? "Company profile set" : "Complete profile"}
          </div>
        </div>
      </div>

      <div className="sd-grid-main">
        <div>
          <section className="sd-card">
            <div className="sd-card-head">
              <div>
                <h2>Quick Actions</h2>
                <p>Manage your supplier account</p>
              </div>
            </div>
            <div className="sd-quick-grid">
              <Link href="/dashboard/products/add" className="sd-quick">
                <div className="sd-quick-icon">＋</div>
                <strong>Add Product</strong>
                <span>List a new item</span>
              </Link>
              <Link href="/dashboard/products" className="sd-quick">
                <div className="sd-quick-icon">📦</div>
                <strong>My Products</strong>
                <span>View and manage</span>
              </Link>
              <Link href="/dashboard/profile" className="sd-quick">
                <div className="sd-quick-icon">👤</div>
                <strong>My Profile</strong>
                <span>Company & contact</span>
              </Link>
              <Link href="/dashboard/requirements" className="sd-quick">
                <div className="sd-quick-icon">📋</div>
                <strong>Requirements</strong>
                <span>Buyer requests</span>
              </Link>

<Link href="/dashboard/enquiries" className="sd-quick">
  <div className="sd-quick-icon">📋</div>
  <strong>All Enquiries</strong>
  <span>View buyer enquiries</span>
</Link>

            </div>
          </section>

          <section className="sd-card">
            <div className="sd-card-head">
              <div>
                <h2>Recent Products</h2>
                <p>Your latest listings</p>
              </div>
              <Link href="/dashboard/products" className="sd-link">
                View All →
              </Link>
            </div>

            {error ? <div className="sd-error">{error}</div> : null}

            {loading ? (
              <div className="sd-loading">Loading your products...</div>
            ) : recentProducts.length === 0 ? (
              <div className="sd-empty">
                No products listed yet.{" "}
                <Link href="/dashboard/products/add" className="sd-link">
                  Add your first product →
                </Link>
              </div>
            ) : (
              <div className="sd-table-wrap">
                <table className="sd-table">
                  <thead>
                    <tr>
                      <th>PRODUCT</th>
                      <th>CATEGORY</th>
                      <th>PRICE</th>
                      <th>STATUS</th>
                      <th>ACTION</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentProducts.map((product) => (
                      <tr key={product._id}>
                        <td>
                          <div className="sd-product-cell">
                            <div className="sd-prod-img">📦</div>
                            <div>
                              <strong>{product.name}</strong>
                              <span>{product.shortDescription || "—"}</span>
                            </div>
                          </div>
                        </td>
                        <td>{product.category?.name || "Uncategorized"}</td>
                        <td>
                          {product.price
                            ? `₹${Number(product.price).toLocaleString("en-IN")}${
                                product.unit ? ` / ${product.unit}` : ""
                              }`
                            : "Price on request"}
                        </td>
                        <td>
                          <span
                            className={`sd-status ${
                              product.status === "active" ? "published" : "pending"
                            }`}
                          >
                            {product.status || "active"}
                          </span>
                        </td>
                        <td>
                          <Link
                            href={`/dashboard/products/${product._id}/edit`}
                            className="sd-link"
                          >
                            Edit
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </div>

        <div>
          <div className="sd-profile-box">
            <div className="sd-profile-company">
              <div className="sd-avatar">
                {user?.profileImage ? (
                  <img src={user.profileImage} alt={user.name || "Profile"} />
                ) : (
                  initials
                )}
              </div>
              <div>
                <strong>{user?.companyName || user?.name || "Your Business"}</strong>
                <span>
                  {[user?.city, user?.state].filter(Boolean).join(", ") ||
                    "Location not set"}
                </span>
              </div>
            </div>
            <div className="sd-profile-stat">
              <span>
                Products<br />
                <b>{loading ? "…" : products.length}</b>
              </span>
              <span>
                Active<br />
                <b>{loading ? "…" : activeCount}</b>
              </span>
              <span>
                Email<br />
                <b>{user?.email ? "Set" : "—"}</b>
              </span>
            </div>
          </div>

          <section className="sd-card">
            <div className="sd-card-head">
              <div>
                <h2>Account Details</h2>
                <p>Your supplier information</p>
              </div>
            </div>
            <div className="sd-verify">
              <div className="sd-verify-icon">✓</div>
              <div>
                <strong>Email</strong>
                <span>{user?.email || "—"}</span>
              </div>
            </div>
            <div className="sd-verify">
              <div className="sd-verify-icon">✓</div>
              <div>
                <strong>Phone</strong>
                <span>{user?.phone || "Not provided"}</span>
              </div>
            </div>
            <div className="sd-verify">
              <div className="sd-verify-icon">✓</div>
              <div>
                <strong>Company</strong>
                <span>{user?.companyName || "Not provided"}</span>
              </div>
            </div>
            <div style={{ marginTop: 12 }}>
              <Link href="/dashboard/profile" className="sd-link">
                View / Edit Profile →
              </Link>
            </div>
          </section>

          <section className="sd-card">
            <div className="sd-card-head">
              <div>
                <h2>Buyer Requirements</h2>
                <p>Relevant opportunities</p>
              </div>
            </div>
            <div className="sd-requirement">
              <div className="sd-req-head">
                <strong>Explore buyer requests</strong>
                <span className="sd-status new">NEW</span>
              </div>
              <div className="sd-req-body">
                View and respond to requirements that match your products.
              </div>
              <Link href="/dashboard/requirements" className="sd-req-btn">
                Open Requirements
              </Link>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}