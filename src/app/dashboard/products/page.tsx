"use client";

import { useEffect, useState } from "react";
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
          : "Failed to load products."
      );
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (id: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeleting(id);
      setError("");
      setSuccess("");

      const token = localStorage.getItem("advixio_token");

      if (!token) {
        window.location.href = "/login";
        return;
      }

      const response = await fetch(
        `${API_URL}/products/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
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
          result.message || "Failed to delete product."
        );
      }

      setProducts((current) =>
        current.filter(
          (product) => product._id !== id
        )
      );

      setSuccess("Product deleted successfully.");
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : "Failed to delete product."
      );
    } finally {
      setDeleting("");
    }
  };

  return (
    <main className="dashboard-page">
      <div className="dashboard-container">

        <div className="dashboard-topbar">

          <div>
            <span className="dashboard-eyebrow">
              MY PRODUCTS
            </span>

            <h1>My Products</h1>

            <p>
              Manage all products listed by your
              business.
            </p>
          </div>

          <div className="dashboard-top-actions">

            <Link
              href="/dashboard"
              className="dashboard-marketplace-button"
            >
              Dashboard
            </Link>

            <Link
              href="/dashboard/products/add"
              className="dashboard-add-button"
            >
              + Add Product
            </Link>

          </div>
        </div>

        {error && (
          <div className="dashboard-error">
            {error}
          </div>
        )}

        {success && (
          <div className="dashboard-success">
            {success}
          </div>
        )}

        <div className="dashboard-panel">

          <div className="dashboard-panel-header">

            <div>
              <span>INVENTORY</span>

              <h2>
                Your Product Listings
              </h2>
            </div>

            <strong className="dashboard-product-count">
              {products.length} Products
            </strong>

          </div>

          {loading ? (
            <div className="dashboard-loading">
              Loading your products...
            </div>
          ) : products.length === 0 ? (
            <div className="dashboard-empty-state">

              <div>📦</div>

              <h3>
                No products found
              </h3>

              <p>
                You haven't listed any products yet.
                Add your first product to start
                selling on Advixio.
              </p>

              <Link href="/dashboard/products/add">
                + Add Product
              </Link>

            </div>
          ) : (
            <div className="my-products-table">

              <div className="my-products-header">
                <span>Product</span>
                <span>Category</span>
                <span>Price</span>
                <span>Status</span>
                <span>Actions</span>
              </div>

              {products.map((product) => (
                <div
                  key={product._id}
                  className="my-product-row"
                >

                  <div className="my-product-name">

                    <div className="my-product-image">
                      📦
                    </div>

                    <div>
                      <strong>
                        {product.name}
                      </strong>

                      <span>
                        {product.brand
                          ? product.brand
                          : "No brand"}
                      </span>
                    </div>

                  </div>

                  <div className="my-product-category">
                    {product.category?.name ||
                      "Uncategorized"}
                  </div>

                  <div className="my-product-price">
                    {product.price
                      ? `₹${Number(
                          product.price
                        ).toLocaleString("en-IN")}`
                      : "On Request"}

                    {product.unit && (
                      <small>
                        / {product.unit}
                      </small>
                    )}
                  </div>

                  <div>
                    <span
                      className={`product-status ${
                        product.status === "active"
                          ? "product-status-active"
                          : "product-status-inactive"
                      }`}
                    >
                      {product.status || "active"}
                    </span>
                  </div>

                  <div className="my-product-actions">

                    <Link
                      href={`/dashboard/products/${product._id}/edit`}
                      className="product-edit-button"
                    >
                      Edit
                    </Link>

                    <button
                      type="button"
                      className="product-delete-button"
                      onClick={() =>
                        deleteProduct(product._id)
                      }
                      disabled={
                        deleting === product._id
                      }
                    >
                      {deleting === product._id
                        ? "Deleting..."
                        : "Delete"}
                    </button>

                  </div>

                </div>
              ))}

            </div>
          )}

        </div>
      </div>
    </main>
  );
}