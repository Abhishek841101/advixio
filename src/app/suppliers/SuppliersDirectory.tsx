
"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

type Supplier = {
  _id: string;
  slug?: string;
  name: string;
  companyName?: string;
  city?: string;
  state?: string;
  productCount?: number;
  createdAt?: string;
};

type Pagination = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
};

type ApiResponse = {
  success: boolean;
  message?: string;
  data?: Supplier[];
  pagination?: Pagination;
};

const API_URL = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"
).replace(/\/+$/, "");

const PAGE_SIZE = 20;

function getInitial(name: string) {
  return name.trim().charAt(0).toUpperCase() || "S";
}

function getInitials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word.charAt(0))
    .join("")
    .toUpperCase() || "S";
}

function formatNumber(value: number) {
  return new Intl.NumberFormat("en-IN").format(value);
}

function SupplierIcon({ type }: { type: "location" | "products" | "company" }) {
  if (type === "location") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z" />
        <circle cx="12" cy="10" r="2.5" />
      </svg>
    );
  }

  if (type === "company") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <rect x="4" y="3" width="16" height="18" rx="2" />
        <path d="M9 7h2m2 0h2M9 11h2m2 0h2M9 15h2m2 0h2M10 21v-3h4v3" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="m12 2 9 5-9 5-9-5 9-5Z" />
      <path d="m3 7 9 5 9-5M3 7v10l9 5 9-5V7M12 12v10" />
    </svg>
  );
}

export default function SuppliersDirectory() {
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState("default");

  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Debounced search
  useEffect(() => {
    const timer = window.setTimeout(() => {
      setPage(1);
      setSearch(searchInput.trim());
    }, 350);

    return () => window.clearTimeout(timer);
  }, [searchInput]);

  // Fetch suppliers
  const loadSuppliers = useCallback(
    async (signal: AbortSignal) => {
      setLoading(true);
      setError("");

      try {
        const params = new URLSearchParams({
          page: String(page),
          limit: String(PAGE_SIZE),
        });

        if (search) {
          params.set("search", search);
        }

        const response = await fetch(
          `${API_URL}/suppliers?${params.toString()}`,
          {
            signal,
            cache: "no-store",
          }
        );

        if (!response.ok) {
          throw new Error(`Unable to load suppliers (${response.status}).`);
        }

        const result = (await response.json()) as ApiResponse;

        if (!result.success || !Array.isArray(result.data)) {
          throw new Error(result.message || "Invalid supplier API response.");
        }

        if (!result.pagination) {
          throw new Error(
            "Supplier API pagination is missing. Update the backend API first."
          );
        }

        setSuppliers(result.data);
        setPagination(result.pagination);
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") {
          return;
        }

        setError(
          err instanceof Error
            ? err.message
            : "Something went wrong. Please try again."
        );

        setSuppliers([]);
        setPagination(null);
      } finally {
        if (!signal.aborted) {
          setLoading(false);
        }
      }
    },
    [page, search]
  );

  useEffect(() => {
    const controller = new AbortController();

    void loadSuppliers(controller.signal);

    return () => controller.abort();
  }, [loadSuppliers]);

  const clearSearch = () => {
    setSearchInput("");
    setSearch("");
    setPage(1);
  };

  const retry = () => {
    setPage((current) => current);
    setSearch((current) => `${current} `);
  };

  const sortedSuppliers = [...suppliers].sort((a, b) => {
    if (sort === "az") {
      return (a.companyName || a.name).localeCompare(
        b.companyName || b.name
      );
    }

    if (sort === "products") {
      return (b.productCount || 0) - (a.productCount || 0);
    }

    return 0;
  });

  const firstResult =
    pagination && pagination.total > 0
      ? (pagination.page - 1) * pagination.limit + 1
      : 0;

  const lastResult = pagination
    ? Math.min(pagination.page * pagination.limit, pagination.total)
    : 0;

  const goToPage = (nextPage: number) => {
    setPage(nextPage);

    document
      .getElementById("supplier-directory")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="supplier-directory-page">
      <Navbar />

      {/* HERO */}
      <section className="sd-hero">
        <div className="sd-hero-circle" />

        <div className="sd-container sd-hero-inner">
          <div className="sd-hero-content">
            <div className="sd-eyebrow">
              <span className="sd-dot" />
              Advixio360 supplier network
            </div>

            <h1>
              Find the right suppliers.
              <br />
              <span>Build better business.</span>
            </h1>

            <p>
              Explore businesses, compare product offerings and discover
              supplier partners for your next sourcing requirement. One
              directory to move your business forward.
            </p>

            <div className="sd-hero-points">
              <span>
                <i>✓</i> Discover businesses
              </span>
              <span>
                <i>✓</i> Explore product ranges
              </span>
              <span>
                <i>✓</i> Connect with suppliers
              </span>
            </div>

            <div className="sd-searchbox">
              <span className="sd-search-icon">⌕</span>

              <input
                type="search"
                value={searchInput}
                onChange={(event) => setSearchInput(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    setSearch(searchInput.trim());
                    setPage(1);
                  }
                }}
                placeholder="Search supplier, product category or city..."
                aria-label="Search suppliers"
              />

              {searchInput && (
                <button
                  type="button"
                  className="sd-clear-search"
                  onClick={clearSearch}
                >
                  Clear
                </button>
              )}

              <button
                type="button"
                onClick={() => {
                  setSearch(searchInput.trim());
                  setPage(1);
                }}
              >
                Find suppliers →
              </button>
            </div>

            <div className="sd-hero-note">
              Search by company name, city or state
            </div>
          </div>

          {/* Hero Side Card */}
          <aside className="sd-hero-side">
            <div className="sd-side-head">
              <div>
                <small>Your sourcing network</small>
                <strong>Find your next partner</strong>
              </div>

              <div className="sd-side-icon">
                <SupplierIcon type="company" />
              </div>
            </div>

            <div className="sd-steps">
              <div className="sd-step">
                <div className="sd-step-number">01</div>
                <div>
                  <b>Discover companies</b>
                  <small>Browse businesses in the directory</small>
                </div>
              </div>

              <div className="sd-step">
                <div className="sd-step-number">02</div>
                <div>
                  <b>Review their offerings</b>
                  <small>Explore products and categories</small>
                </div>
              </div>

              <div className="sd-step">
                <div className="sd-step-number">03</div>
                <div>
                  <b>Find the right fit</b>
                  <small>Review supplier details and location</small>
                </div>
              </div>

              <div className="sd-step">
                <div className="sd-step-number">04</div>
                <div>
                  <b>Move your sourcing forward</b>
                  <small>Shortlist suppliers for your requirement</small>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </section>

      {/* DIRECTORY */}
      <main className="sd-main" id="supplier-directory">
        <div className="sd-intro">
          <div>
            <div className="sd-section-label">Discover your partners</div>
            <h2>Supplier directory</h2>
            <p>
              Explore listed businesses, review supplier information and
              discover companies relevant to your sourcing needs.
            </p>
          </div>

          <div className="sd-total">
            <div className="sd-total-icon">
              <SupplierIcon type="company" />
            </div>

            <div>
              <strong>
                {pagination ? formatNumber(pagination.total) : "—"}
              </strong>
              <small>Suppliers listed</small>
            </div>
          </div>
        </div>

        {/* TOOLBAR */}
        <div className="sd-toolbar">
          <div className="sd-toolbar-left">
            <div className="sd-tool-icon">⌕</div>

            <div>
              <b>{search ? "Search results" : "All listed suppliers"}</b>
              <small>
                {loading
                  ? "Loading suppliers..."
                  : `Showing ${formatNumber(suppliers.length)} suppliers on this page`}
              </small>
            </div>
          </div>

          <div className="sd-toolbar-controls">
            <select
              className="sd-sort"
              value={sort}
              onChange={(event) => setSort(event.target.value)}
              aria-label="Sort suppliers"
            >
              <option value="default">Sort: Featured</option>
              <option value="az">Name: A to Z</option>
              <option value="products">Most products</option>
            </select>
          </div>
        </div>

        {/* ERROR */}
        {error && (
          <div className="sd-error">
            <strong>Unable to load suppliers</strong>
            <p>{error}</p>
            <button type="button" onClick={retry}>
              Try again
            </button>
          </div>
        )}

        {/* LOADING */}
        {loading && suppliers.length === 0 && !error && (
          <div className="sd-grid">
            {Array.from({ length: 6 }).map((_, index) => (
              <div className="sd-skeleton" key={index}>
                <div className="sd-skeleton-top">
                  <div className="sd-skeleton-avatar" />
                  <div className="sd-skeleton-lines">
                    <span />
                    <span />
                  </div>
                </div>
                <span className="sd-skeleton-line" />
                <span className="sd-skeleton-line short" />
                <span className="sd-skeleton-bottom" />
              </div>
            ))}
          </div>
        )}

        {/* EMPTY */}
        {!loading && !error && suppliers.length === 0 && (
          <div className="sd-empty">
            <div className="sd-empty-icon">⌕</div>
            <h3>
              {search ? "No matching suppliers" : "No suppliers available"}
            </h3>
            <p>
              {search
                ? "Try another company name, city or state."
                : "Suppliers with active products will appear here."}
            </p>

            {search && (
              <button type="button" onClick={clearSearch}>
                Clear search
              </button>
            )}
          </div>
        )}

        {/* SUPPLIER CARDS */}
        {!error && suppliers.length > 0 && (
          <div className="sd-grid">
            {sortedSuppliers.map((supplier, index) => {
              const companyName =
                supplier.companyName?.trim() || supplier.name || "Supplier";

              const location = [
                supplier.city?.trim(),
                supplier.state?.trim(),
              ]
                .filter(Boolean)
                .join(", ");

              const profileSlug = supplier.slug || supplier._id;

              return (
                <article className="sd-supplier-card" key={supplier._id}>
                  <div className="sd-card-top">
                    <div className="sd-avatar">
                      {getInitials(companyName)}
                    </div>

                    <div className="sd-name-wrap">
                      <div className="sd-meta">
                        <span className="sd-supplier-id">
                          SUPPLIER {String(firstResult + index).padStart(2, "0")}
                        </span>
                        <span className="sd-listed">Listed</span>
                      </div>

                      <h3>{companyName}</h3>
                      <div className="sd-subtitle">
                        {supplier.name || "Registered supplier"}
                      </div>
                    </div>
                  </div>

                  <p className="sd-description">
                    Discover products and business offerings from{" "}
                    {companyName}.
                  </p>

                  <div className="sd-divider" />

                  <div className="sd-details">
                    <div className="sd-detail">
                      <div className="sd-detail-icon">
                        <SupplierIcon type="location" />
                      </div>

                      <div className="sd-detail-text">
                        <label>LOCATION</label>
                        <strong>{location || "Not provided"}</strong>
                      </div>
                    </div>

                    <div className="sd-detail">
                      <div className="sd-detail-icon">
                        <SupplierIcon type="company" />
                      </div>

                      <div className="sd-detail-text">
                        <label>COMPANY</label>
                        <strong>{companyName}</strong>
                      </div>
                    </div>
                  </div>

                  <div className="sd-card-bottom">
                    <div className="sd-box-icon">
                      <SupplierIcon type="products" />
                    </div>

                    <div className="sd-count">
                      <strong>
                        {formatNumber(supplier.productCount || 0)}
                      </strong>
                      <small>Listed products</small>
                    </div>

                    <Link
                      href={`/suppliers/${encodeURIComponent(profileSlug)}`}
                      className="sd-view-btn"
                      aria-label={`View ${companyName} supplier profile`}
                    >
                      View profile <span>→</span>
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {/* PAGINATION */}
        {!error && pagination && pagination.total > 0 && (
          <div className="sd-pagination">
            <div>
              <strong>
                Page {pagination.page} of {Math.max(pagination.totalPages, 1)}
              </strong>
              <small>
                Showing {formatNumber(firstResult)}–{formatNumber(lastResult)}{" "}
                of {formatNumber(pagination.total)} suppliers
              </small>
            </div>

            <div className="sd-pages">
              <button
                type="button"
                className="sd-page-btn"
                disabled={!pagination.hasPrevPage || loading}
                onClick={() => goToPage(Math.max(1, page - 1))}
              >
                ← Previous
              </button>

              <span className="sd-current-page">{pagination.page}</span>

              <button
                type="button"
                className="sd-page-btn next"
                disabled={!pagination.hasNextPage || loading}
                onClick={() => goToPage(page + 1)}
              >
                Next →
              </button>
            </div>
          </div>
        )}

        {/* BOTTOM CTA */}
        <section className="sd-bottom-cta">
          <div>
            <span className="sd-cta-tag">EXPLORE MORE</span>
            <h2>Looking for a specific product?</h2>
            <p>
              Browse the product directory and discover options that match
              your business requirements.
            </p>
          </div>

          <Link href="/products" className="sd-cta-button">
            Browse products →
          </Link>
        </section>
      </main>

      <Footer />
    </div>
  );
}
