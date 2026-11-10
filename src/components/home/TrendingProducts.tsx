
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const API_URL = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"
).replace(/\/+$/, "");

type Product = {
  _id: string;
  name: string;
  slug: string;
  shortDescription?: string;
  description?: string;
  price?: number;
  unit?: string;
  images?: string[];
  category?: {
    name?: string;
  } | null;
  seller?: {
    name?: string;
    companyName?: string;
    city?: string;
    state?: string;
  } | null;
  companyName?: string;
  location?: {
    city?: string;
    state?: string;
  };
};

export default function TrendingProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(`${API_URL}/products`, {
          method: "GET",
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }

        const result = await response.json();

        if (!result.success) {
          throw new Error(
            result.message || "Unable to load products"
          );
        }

        // Show actual products from database
        setProducts((result.data || []).slice(0, 5));
      } catch (err) {
        console.error("Trending products API error:", err);

        setError(
          err instanceof Error
            ? err.message
            : "Unable to load products"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const formatPrice = (price?: number, unit?: string) => {
    if (price === undefined || price === null) {
      return "Price on Request";
    }

    return `₹${price.toLocaleString("en-IN")}${
      unit ? ` / ${unit}` : ""
    }`;
  };

  return (
    <section className="trending-section">
      <div className="container">

        {/* HEADER */}

        <div className="trending-header">
          <div>
            <h2>Trending Products</h2>
            <p>
              Discover products from businesses across different industries.
            </p>
          </div>

          <Link
            href="/products"
            className="trending-view-all"
          >
            View All Products →
          </Link>
        </div>

        {/* LOADING */}

        {loading && (
          <div className="trending-status">
            Loading products...
          </div>
        )}

        {/* ERROR */}

        {!loading && error && (
          <div className="trending-status">
            Unable to load products. Please try again later.
          </div>
        )}

        {/* EMPTY */}

        {!loading && !error && products.length === 0 && (
          <div className="trending-status">
            No products available right now.
          </div>
        )}

        {/* ACTUAL PRODUCTS */}

        {!loading && !error && products.length > 0 && (
          <div className="trending-products-scroll">
            {products.map((product) => {
              const image = product.images?.[0];

              const location =
                product.location?.city ||
                product.seller?.city ||
                product.location?.state ||
                product.seller?.state ||
                "India";

              const company =
                product.seller?.companyName ||
                product.companyName ||
                product.seller?.name ||
                "Advixio Supplier";

              return (
                <article
                  className="trending-product-card"
                  key={product._id}
                >
                  <div className="trending-product-image">
                    {image ? (
                      <img
                        src={image}
                        alt={product.name}
                        loading="lazy"
                      />
                    ) : (
                      <div className="trending-no-image">
                        No Image Available
                      </div>
                    )}
                  </div>

                  <div className="trending-product-content">

                    {product.category?.name && (
                      <div className="trending-verified">
                        {product.category.name}
                      </div>
                    )}

                    <h3>{product.name}</h3>

                    <div className="trending-product-price">
                      {formatPrice(product.price, product.unit)}
                    </div>

                    <div className="trending-product-bottom">
                      <span>
                        {location} · {company}
                      </span>

                      <Link
                        href="/products"
                        className="trending-enquire"
                      >
                        Enquire →
                      </Link>
                    </div>

                  </div>
                </article>
              );
            })}
          </div>
        )}

      </div>
    </section>
  );
}
