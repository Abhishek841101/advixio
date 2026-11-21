"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

type Product = {
  _id: string;
  name: string;
  slug: string;
  shortDescription?: string;
  price?: number;
  unit?: string;
  brand?: string;
  model?: string;
  status?: string;
  createdAt?: string;
  category?: {
    name?: string;
    slug?: string;
  };
};

export default function MyProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    loadProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

      const response = await fetch(`${API_URL}/products/my-listings`, {
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
        err instanceof Error ? err.message : "Failed to load products."
      );
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (id: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this product?"
    );
    if (!confirmed) return;

    try {
      setDeleting(id);
      setError("");
      setSuccess("");

      const token = localStorage.getItem("advixio_token");
      if (!token) {
        window.location.href = "/login";
        return;
      }

      const response = await fetch(`${API_URL}/products/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      const result = await response.json();

      if (response.status === 401) {
        localStorage.removeItem("advixio_token");
        localStorage.removeItem("advixio_user");
        window.location.href = "/login";
        return;
      }

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to delete product.");
      }

      setProducts((current) => current.filter((product) => product._id !== id));
      setSuccess("Product deleted successfully.");
    } catch (err) {
      console.error(err);
      setError(
        err instanceof Error ? err.message : "Failed to delete product."
      );
    } finally {
      setDeleting("");
    }
  };

  const activeCount = useMemo(
    () => products.filter((p) => p.status === "active").length,
    [products]
  );
  const inactiveCount = Math.max(0, products.length - activeCount);

  return (
    <>
      <div className="sd-page-head">
        <div>
          <h1>My Products</h1>
          <p>Manage all products listed by your business.</p>
        </div>
        <div className="sd-actions">
          <Link href="/dashboard" className="sd-btn">
            Dashboard
          </Link>
          <Link href="/dashboard/products/add" className="sd-btn sd-btn-primary">
            ＋ Add Product
          </Link>
        </div>
      </div>

      <div className="sd-stats three">        <div className="sd-stat-card">
          <div className="sd-stat-top">
            <span className="sd-stat-label">TOTAL</span>
            <span className="sd-stat-icon">📦</span>
          </div>
          <div className="sd-stat-value">{loading ? "…" : products.length}</div>
          <div className="sd-stat-change neutral">All listings</div>
        </div>
        <div className="sd-stat-card">
          <div className="sd-stat-top">
            <span className="sd-stat-label">ACTIVE</span>
            <span className="sd-stat-icon">✓</span>
          </div>
          <div className="sd-stat-value">{loading ? "…" : activeCount}</div>
          <div className="sd-stat-change neutral">Published/active</div>
        </div>
        <div className="sd-stat-card">
          <div className="sd-stat-top">
            <span className="sd-stat-label">OTHER</span>
            <span className="sd-stat-icon">◷</span>
          </div>
          <div className="sd-stat-value">{loading ? "…" : inactiveCount}</div>
          <div className="sd-stat-change neutral">Non-active status</div>
        </div>
      </div>

      {error ? <div className="sd-error">{error}</div> : null}
      {success ? (
        <div
          className="sd-card"
          style={{
            background: "var(--sd-greenbg)",
            color: "var(--sd-green)",
            borderColor: "#FFEDD5",
            padding: "12px 14px",
            marginBottom: 16,
            boxShadow: "none",
          }}
        >
          {success}
        </div>
      ) : null}

      <section className="sd-card">
        <div className="sd-card-head">
          <div>
            <h2>Your Product Listings</h2>
            <p>Inventory overview</p>
          </div>
          <strong style={{ fontSize: 12, color: "var(--sd-muted)" }}>
            {products.length} Products
          </strong>
        </div>

        {loading ? (
          <div className="sd-loading">Loading your products...</div>
        ) : products.length === 0 ? (
          <div className="sd-empty">
            <div style={{ fontSize: 28, marginBottom: 8 }}>📦</div>
            <div style={{ fontWeight: 700, color: "var(--sd-text)" }}>
              No products found
            </div>
            <p style={{ margin: "6px 0 12px" }}>
              You haven&apos;t listed any products yet. Add your first product to
              start selling on Advixio.
            </p>
            <Link href="/dashboard/products/add" className="sd-btn sd-btn-primary">
              + Add Product
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
                  <th>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product._id}>
                    <td>
                      <div className="sd-product-cell">
                        <div className="sd-prod-img">📦</div>
                        <div>
                          <strong>{product.name}</strong>
                          <span>{product.brand || "No brand"}</span>
                        </div>
                      </div>
                    </td>
                    <td>{product.category?.name || "Uncategorized"}</td>
                    <td>
                      {product.price
                        ? `₹${Number(product.price).toLocaleString("en-IN")}`
                        : "On Request"}
                      {product.unit ? (
                        <span style={{ color: "var(--sd-muted)" }}>
                          {" "}
                          / {product.unit}
                        </span>
                      ) : null}
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
                      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                        <Link
                          href={`/dashboard/products/${product._id}/edit`}
                          className="sd-btn"
                          style={{ padding: "6px 10px", fontSize: 10 }}
                        >
                          Edit
                        </Link>
                        <button
                          type="button"
                          className="sd-btn"
                          style={{
                            padding: "6px 10px",
                            fontSize: 10,
                            color: "var(--sd-red)",
                            borderColor: "#FED7AA",
                            background: "#FFFFFF",
                          }}
                          onClick={() => deleteProduct(product._id)}
                          disabled={deleting === product._id}
                        >
                          {deleting === product._id ? "Deleting..." : "Delete"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </>
  );
}