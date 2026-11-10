 "use client";

import { useCallback, useEffect, useMemo, useState } from "react";
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
  category?: string;
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

type FilterKey = "all" | "Nagpur" | "Industrial Supplies" | "Electronics";
type SortKey = "default" | "az" | "products";

const API_URL = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"
).replace(/\/+$/, "");

const PAGE_SIZE = 20;

function formatNumber(value: number) {
  return new Intl.NumberFormat("en-IN").format(value || 0);
}

function getInitials(name: string) {
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (!words.length) return "S";
  return words.length === 1
    ? words[0].slice(0, 2).toUpperCase()
    : `${words[0][0]}${words[1][0]}`.toUpperCase();
}

function LocationIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  );
}

function BoxIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path d="m12 2 9 5-9 5-9-5 9-5Z" />
      <path d="m3 7 9 5 9-5M3 7v10l9 5 9-5V7M12 12v10" />
    </svg>
  );
}

function BrandMark() {
  return (
    <span className="sd-brandmark">
      <svg viewBox="0 0 40 40" fill="none" aria-hidden="true">
        <path d="M7 27 17 8h7L14 27H7Z" fill="white" />
        <path d="M18 27 28 8h5L23 27h-5Z" fill="#8CC7FF" />
        <path d="M7 30h26" stroke="white" strokeWidth="3" strokeLinecap="round" />
        <path d="M25 18 34 30" stroke="white" strokeWidth="3" strokeLinecap="round" />
      </svg>
    </span>
  );
}

export default function SuppliersDirectory() {
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeFilter, setActiveFilter] = useState<FilterKey>("all");
  const [sort, setSort] = useState<SortKey>("default");

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setPage(1);
      setSearch(searchInput.trim());
    }, 350);
    return () => window.clearTimeout(timer);
  }, [searchInput]);

  const loadSuppliers = useCallback(async (signal: AbortSignal) => {
    setLoading(true);
    setError("");

    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: String(PAGE_SIZE),
      });
      if (search) params.set("search", search);

      const response = await fetch(`${API_URL}/suppliers?${params.toString()}`, {
        signal,
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error(`Unable to load suppliers (${response.status}).`);
      }

      const result = (await response.json()) as ApiResponse;
      if (!result.success || !Array.isArray(result.data)) {
        throw new Error(result.message || "Invalid supplier API response.");
      }
      if (!result.pagination) {
        throw new Error("Supplier API pagination is missing. Update the backend API first.");
      }

      setSuppliers(result.data);
      setPagination(result.pagination);
    } catch (err) {
      if (err instanceof Error && err.name === "AbortError") return;
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      setSuppliers([]);
      setPagination(null);
    } finally {
      if (!signal.aborted) setLoading(false);
    }
  }, [page, search]);

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

  const filteredSuppliers = useMemo(() => {
    let result = [...suppliers];

    if (activeFilter === "Nagpur") {
      result = result.filter((supplier) =>
        `${supplier.city || ""} ${supplier.state || ""}`.toLowerCase().includes("nagpur")
      );
    } else if (activeFilter !== "all") {
      result = result.filter(
        (supplier) => (supplier.category || "").toLowerCase() === activeFilter.toLowerCase()
      );
    }

    if (sort === "az") {
      result.sort((a, b) =>
        (a.companyName || a.name).localeCompare(b.companyName || b.name)
      );
    } else if (sort === "products") {
      result.sort((a, b) => (b.productCount || 0) - (a.productCount || 0));
    }

    return result;
  }, [suppliers, activeFilter, sort]);

  const resultLabel = search ? `Results for "${search}"` : "All listed suppliers";
  const total = pagination?.total ?? 0;

  return (
    <>
      <Navbar />

      <div className="supplier-directory-page">
        {/* Hero section — matches the supplied HTML design */}
        <section className="sd-hero" id="top">
          <div className="sd-hero-inner">
            <div className="sd-hero-copy">
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
                Explore businesses, compare product offerings and discover supplier
                partners for your next sourcing requirement. One directory to move
                your business forward.
              </p>

              <div className="sd-hero-points">
                <span><i className="sd-check">✓</i> Discover businesses</span>
                <span><i className="sd-check">✓</i> Explore product ranges</span>
                <span><i className="sd-check">✓</i> Connect with suppliers</span>
              </div>

              <form
                className="sd-searchbox"
                onSubmit={(event) => {
                  event.preventDefault();
                  setSearch(searchInput.trim());
                  setPage(1);
                  document.getElementById("directory")?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                <span className="sd-searchicon" aria-hidden="true">⌕</span>
                <input
                  value={searchInput}
                  onChange={(event) => setSearchInput(event.target.value)}
                  placeholder="Search supplier, product category or city..."
                  aria-label="Search suppliers"
                />
                <button type="submit">Find suppliers&nbsp; →</button>
              </form>

              <div className="sd-hero-note">
                Try: Industrial supplies, Nagpur, electronics, packaging
              </div>
            </div>

            <aside className="sd-hero-side">
              <div className="sd-sidehead">
                <div>
                  <small>Your sourcing network</small>
                  <strong>Find your next partner</strong>
                </div>
                <div className="sd-sideicon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" aria-hidden="true">
                    <rect x="5" y="3" width="14" height="18" rx="2" />
                    <path d="M9 7h2m2 0h2M9 11h2m2 0h2M9 15h2m2 0h2M10 21v-3h4v3" />
                  </svg>
                </div>
              </div>

              <div className="sd-steps">
                {[
                  ["01", "Discover companies", "Browse businesses in the directory"],
                  ["02", "Review their offerings", "Explore products and categories"],
                  ["03", "Find the right fit", "Review supplier details and location"],
                  ["04", "Move your sourcing forward", "Shortlist suppliers for your requirement"],
                ].map(([number, title, description]) => (
                  <div className="sd-step" key={number}>
                    <div className="sd-stepnum">{number}</div>
                    <div>
                      <b>{title}</b>
                      <small>{description}</small>
                    </div>
                  </div>
                ))}
              </div>
            </aside>
          </div>
        </section>

        <main className="sd-main" id="directory">
          <div className="sd-intro">
            <div>
              <div className="sd-sectionlabel">Discover your partners</div>
              <h2>Supplier directory</h2>
              <p>
                Explore listed businesses, review supplier information and discover
                companies relevant to your sourcing needs.
              </p>
            </div>

            <div className="sd-total">
              <div className="sd-totalicon">
                <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                  <rect x="5" y="3" width="14" height="18" rx="2" />
                  <path d="M9 7h2m2 0h2M9 11h2m2 0h2M9 15h2m2 0h2" />
                </svg>
              </div>
              <div>
                <strong>{loading && !pagination ? "—" : formatNumber(total)}</strong>
                <small>Suppliers listed</small>
              </div>
            </div>
          </div>

          <div className="sd-toolbar">
            <div className="sd-toolbarleft">
              <div className="sd-toolicon">⌕</div>
              <div>
                <b>{resultLabel}</b>
                <small>
                  {loading
                    ? "Finding suppliers..."
                    : `Showing ${filteredSuppliers.length} supplier${filteredSuppliers.length === 1 ? "" : "s"} on this page`}
                </small>
              </div>
            </div>

            <div className="sd-filters">
              {([
                ["all", "All suppliers"],
                ["Nagpur", "Nagpur"],
                ["Industrial Supplies", "Industrial"],
                ["Electronics", "Electronics"],
              ] as [FilterKey, string][]).map(([value, label]) => (
                <button
                  type="button"
                  key={value}
                  className={`sd-filter${activeFilter === value ? " active" : ""}`}
                  onClick={() => setActiveFilter(value)}
                >
                  {label}
                </button>
              ))}

              <select
                className="sd-sort"
                value={sort}
                onChange={(event) => setSort(event.target.value as SortKey)}
                aria-label="Sort suppliers"
              >
                <option value="default">Sort: Featured</option>
                <option value="az">Name: A to Z</option>
                <option value="products">Most products</option>
              </select>
            </div>
          </div>

          {error ? (
            <div className="sd-empty sd-error">
              <h3>Unable to load suppliers</h3>
              <p>{error}</p>
              <button
                type="button"
                className="sd-retry"
                onClick={() => {
                  setPage((current) => current);
                  setSearch((current) => `${current} ` .trim());
                }}
              >
                Try again
              </button>
            </div>
          ) : loading && suppliers.length === 0 ? (
            <div className="sd-grid">
              {Array.from({ length: 6 }).map((_, index) => (
                <div className="sd-skeleton" key={index} />
              ))}
            </div>
          ) : filteredSuppliers.length === 0 ? (
            <div className="sd-empty">
              No suppliers match your search. Try another name, category or city.
            </div>
          ) : (
            <div className="sd-grid">
              {filteredSuppliers.map((supplier, index) => {
                const companyName = supplier.companyName?.trim() || supplier.name || "Supplier";
                const location = [supplier.city?.trim(), supplier.state?.trim()]
                  .filter(Boolean)
                  .join(", ") || "Location not provided";
                const category = supplier.category?.trim() || "Business supplier";
                const profileSlug = supplier.slug || supplier._id;

                return (
                  <article className="sd-supplier" key={supplier._id}>
                    <div className="sd-cardtop">
                      <div className="sd-avatar">{getInitials(companyName)}</div>
                      <div className="sd-namewrap">
                        <div className="sd-meta">
                          <span className="sd-sid">
                            SUPPLIER {String((page - 1) * PAGE_SIZE + index + 1).padStart(2, "0")}
                          </span>
                          <span className="sd-listed">Listed</span>
                        </div>
                        <h3>{companyName}</h3>
                        <div className="sd-subtitle">{supplier.name || companyName}</div>
                      </div>
                    </div>

                    <p className="sd-description">
                      Explore products and business supply options from this supplier.
                    </p>

                    <div className="sd-divider" />

                    <div className="sd-details">
                      <div className="sd-detail">
                        <div className="sd-detailicon"><LocationIcon /></div>
                        <div className="sd-detailtext">
                          <label>LOCATION</label>
                          <strong>{location}</strong>
                        </div>
                      </div>

                      <div className="sd-detail">
                        <div className="sd-detailicon"><BoxIcon /></div>
                        <div className="sd-detailtext">
                          <label>CATEGORY</label>
                          <strong>{category}</strong>
                        </div>
                      </div>
                    </div>

                    <div className="sd-cardbottom">
                      <div className="sd-boxicon"><BoxIcon /></div>
                      <div className="sd-count">
                        <strong>{formatNumber(supplier.productCount || 0)}</strong>
                        <small>Listed products</small>
                      </div>
                      <Link
                        className="sd-viewbtn"
                        href={`/suppliers/${encodeURIComponent(profileSlug)}`}
                        aria-label={`View ${companyName} profile`}
                      >
                        View profile <span>→</span>
                      </Link>
                    </div>
                  </article>
                );
              })}
            </div>
          )}

          {!error && pagination && pagination.total > 0 && (
            <div className="sd-pagination">
              <div>
                <strong>Page {pagination.page} of {Math.max(pagination.totalPages, 1)}</strong>
                <small>{formatNumber(pagination.total)} total suppliers</small>
              </div>
              <div className="sd-pages">
                <button
                  type="button"
                  className="sd-pagebtn"
                  disabled={!pagination.hasPrevPage || loading}
                  onClick={() => {
                    setPage((current) => Math.max(1, current - 1));
                    document.getElementById("directory")?.scrollIntoView({ behavior: "smooth" });
                  }}
                >
                  ← Previous
                </button>
                <span className="sd-page-current">{pagination.page}</span>
                <button
                  type="button"
                  className="sd-pagebtn"
                  disabled={!pagination.hasNextPage || loading}
                  onClick={() => {
                    setPage((current) => current + 1);
                    document.getElementById("directory")?.scrollIntoView({ behavior: "smooth" });
                  }}
                >
                  Next →
                </button>
              </div>
            </div>
          )}

          <section className="sd-bottomcta">
            <div>
              <span className="sd-ctatag">EXPLORE MORE</span>
              <h2>Looking for a specific product?</h2>
              <p>
                Browse the product directory and discover options that match your
                business requirements.
              </p>
            </div>
            <Link className="sd-ctaButton" href="/products">
              Browse products&nbsp; →
            </Link>
          </section>
        </main>
      </div>

      <Footer />
    </>
  );
}
