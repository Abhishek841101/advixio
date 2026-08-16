"use client";

import { useEffect, useState } from "react";
import ProductCard from "./ProductCard";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:5000/api";
console.log(
  "ENV API URL:",
  process.env.NEXT_PUBLIC_API_URL
);
export default function CategoryGrid({ slug }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!slug) {
      setError("Category slug missing");
      setLoading(false);
      return;
    }

    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError("");

        const url =
          `${API_URL}/products/category/${slug}`;

        console.log("PRODUCT API URL:", url);

        const response = await fetch(url, {
          cache: "no-store",
        });

        console.log(
          "PRODUCT API STATUS:",
          response.status
        );

        const text = await response.text();

        console.log(
          "PRODUCT API RESPONSE:",
          text
        );

        if (!response.ok) {
          throw new Error(
            `Products API failed: ${response.status}`
          );
        }

        let result;

        try {
          result = JSON.parse(text);
        } catch {
          throw new Error(
            "Backend returned invalid JSON"
          );
        }

        if (!result.success) {
          throw new Error(
            result.message ||
              "Failed to load products"
          );
        }

        const productList =
          Array.isArray(result.data)
            ? result.data
            : [];

        setProducts(productList);

      } catch (error) {
        console.error(
          "Products fetch error:",
          error
        );

        setProducts([]);

        setError(
          error instanceof Error
            ? error.message
            : "Unable to load products"
        );

      } finally {
        setLoading(false);
      }
    };

    fetchProducts();

  }, [slug]);

  // ==============================
  // LOADING
  // ==============================

  if (loading) {
    return (
      <section className="category-results">

        <div className="category-products-header">
          <h2>Products</h2>
        </div>

        <p>
          Loading products...
        </p>

      </section>
    );
  }

  // ==============================
  // ERROR
  // ==============================

  if (error) {
    return (
      <section className="category-results">

        <div className="category-products-header">
          <h2>Products</h2>
        </div>

        <p>
          ❌ {error}
        </p>

      </section>
    );
  }

  // ==============================
  // PRODUCTS
  // ==============================

  return (
    <section className="category-results">

      <div className="category-products-header">

        <h2>
          Products
        </h2>

        <span>
          {products.length}{" "}
          {products.length === 1
            ? "product"
            : "products"}
        </span>

      </div>

      {products.length === 0 ? (

        <p>
          No products found in this category.
        </p>

      ) : (

        <div className="products-grid">

          {products.map((product) => (

            <ProductCard
              key={product._id}
              product={product}
            />

          ))}

        </div>

      )}

    </section>
  );
}