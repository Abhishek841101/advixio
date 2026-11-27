"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ProductGrid from "@/components/products/ProductGrid";
import { categories } from "@/data/categories";
import {
  CATEGORY_PARAM,
  LOCATION_PARAM,
  PAGE_PARAM,
  SEARCH_PARAM,
  SORT_PARAM,
  buildSearchUrl,
  normalizeCategoryValue,
  normalizeLocationValue,
  normalizeSearchKeyword,
} from "@/lib/search";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

const PRODUCTS_PER_PAGE = 12;

const banners = [
  {
    id: 1,
    title: "Find the Right Industrial Products",
    description:
      "Discover machinery, tools, equipment and products from trusted suppliers.",
    button: "Explore Products",
    image: "/products/banner-1.jpg",
  },
  {
    id: 2,
    title: "Connect With Verified Suppliers",
    description:
      "Find manufacturers, wholesalers and suppliers for your business needs.",
    button: "Find Suppliers",
    image: "/products/banner-2.jpg",
  },
  {
    id: 3,
    title: "Post Your Buying Requirement",
    description:
      "Tell suppliers what you need and receive competitive quotations.",
    button: "Post Requirement",
    image: "/products/banner-3.jpg",
  },
];

const supplierTypes = [
  "Manufacturer",
  "Wholesaler",
  "Distributor",
  "Retailer",
];

type Product = {
  _id: string;
  name: string;
  slug: string;
  shortDescription?: string;
  description?: string;
  category?: {
    _id: string;
    name: string;
    slug: string;
  } | null;
  subcategory?: string;
  brand?: string;
  model?: string;
  price?: number;
  unit?: string;
  images?: string[];
  specifications?: { label: string; value: string }[];
  seller?: {
    _id: string;
    name: string;
    email?: string;
    phone?: string;
    companyName?: string;
    city?: string;
    state?: string;
  } | null;
  companyName?: string;
  location?: { city?: string; state?: string; country?: string };
};

function parsePage(value: string | null): number {
  const n = Number(value);
  if (!Number.isFinite(n) || n < 1) return 1;
  return Math.floor(n);
}

export default function ProductsPageClient() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [activeBanner, setActiveBanner] = useState(0);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedSuppliers, setSelectedSuppliers] = useState<string[]>([]);
  const [sort, setSort] = useState("relevance");
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [categoryNotice, setCategoryNotice] = useState("");

  const lastUrlRef = useRef("");

  const urlState = useMemo(() => {
    const rawCategory = normalizeCategoryValue(searchParams.get(CATEGORY_PARAM));
    const matchedCategory = categories.find((c) => c.slug === rawCategory);
    return {
      search: normalizeSearchKeyword(searchParams.get(SEARCH_PARAM)),
      categorySlug: matchedCategory ? matchedCategory.slug : "",
      categoryName: matchedCategory ? matchedCategory.name : "",
      invalidCategory: Boolean(rawCategory && !matchedCategory),
      location: normalizeLocationValue(searchParams.get(LOCATION_PARAM)),
      page: parsePage(searchParams.get(PAGE_PARAM)),
      sort: (searchParams.get(SORT_PARAM) || "relevance").trim(),
    };
  }, [searchParams]);

  // Sync state from URL (back/forward, shared links, initial load).
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional URL -> state sync
    setSearch(urlState.search);
    setLocationFilter(urlState.location);
    setSelectedCategories(urlState.categoryName ? [urlState.categoryName] : []);
    setSort(urlState.sort || "relevance");
    setCurrentPage(urlState.page);
    setCategoryNotice(urlState.invalidCategory ? "Category not found. Showing all products." : "");
  }, [urlState.search, urlState.location, urlState.categoryName, urlState.invalidCategory, urlState.sort, urlState.page]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError("");
        const response = await fetch(`${API_URL}/products`, {
          method: "GET",
          cache: "no-store",
        });
        if (!response.ok) throw new Error("Failed to fetch products");
        const result = await response.json();
        if (!result.success) throw new Error(result.message || "Failed to fetch products");
        setProducts(result.data || []);
      } catch (err) {
        console.error("Products API error:", err);
        setError(err instanceof Error ? err.message : "Unable to load products");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveBanner((current) => (current === banners.length - 1 ? 0 : current + 1));
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const banner = banners[activeBanner];

  const replaceUrl = useCallback(
    (next: { search?: string; category?: string; location?: string; page?: number; sort?: string }) => {
      const href = buildSearchUrl("products", {
        search: next.search ?? "",
        category: next.category,
        location: next.location ?? "",
        page: next.page ?? 1,
        sort: next.sort && next.sort !== "relevance" ? next.sort : "",
      });
      const full = href || "/products";
      if (lastUrlRef.current === full) return;
      lastUrlRef.current = full;
      router.replace(full, { scroll: false });
    },
    [router]
  );

  // pushUrl intentionally omitted; filter changes use replace, explicit search uses SearchBar navigation.

  const currentCategorySlug = useMemo(() => {
    if (selectedCategories.length !== 1) return "";
    return categories.find((c) => c.name === selectedCategories[0])?.slug || "";
  }, [selectedCategories]);

  const toggleCategory = (categoryName: string) => {
    const nextCategories = selectedCategories.includes(categoryName)
      ? selectedCategories.filter((name) => name !== categoryName)
      : [...selectedCategories, categoryName];
    setSelectedCategories(nextCategories);
    setCurrentPage(1);
    const nextSlug =
      nextCategories.length === 1
        ? categories.find((c) => c.name === nextCategories[0])?.slug || ""
        : "";
    replaceUrl({ search, category: nextSlug, location: locationFilter, page: 1, sort });
  };

  const clearCategoryFilter = () => {
    setSelectedCategories([]);
    setCurrentPage(1);
    replaceUrl({ search, category: "", location: locationFilter, page: 1, sort });
  };

  const toggleSupplier = (supplier: string) => {
    setSelectedSuppliers((current) =>
      current.includes(supplier) ? current.filter((item) => item !== supplier) : [...current, supplier]
    );
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setSelectedSuppliers([]);
    setSearch("");
    setLocationFilter("");
    setSort("relevance");
    setCurrentPage(1);
    setCategoryNotice("");
    lastUrlRef.current = "/products";
    router.replace("/products", { scroll: false });
  };

  const onSortChange = (nextSort: string) => {
    setSort(nextSort);
    setCurrentPage(1);
    replaceUrl({ search, category: currentCategorySlug, location: locationFilter, page: 1, sort: nextSort });
  };

  const filteredProducts = useMemo(() => {
    let result = [...products];
    const q = normalizeSearchKeyword(search).toLowerCase();
    if (q) {
      result = result.filter((product) => {
        return (
          product.name?.toLowerCase().includes(q) ||
          product.description?.toLowerCase().includes(q) ||
          product.shortDescription?.toLowerCase().includes(q) ||
          product.brand?.toLowerCase().includes(q) ||
          product.model?.toLowerCase().includes(q) ||
          product.subcategory?.toLowerCase().includes(q) ||
          product.category?.name?.toLowerCase().includes(q) ||
          product.seller?.name?.toLowerCase().includes(q) ||
          product.seller?.companyName?.toLowerCase().includes(q)
        );
      });
    }

    if (selectedCategories.length > 0) {
      result = result.filter((product) => {
        return selectedCategories.some((category) => {
          const slug = categories.find((item) => item.name === category)?.slug?.toLowerCase();
          return (
            product.category?.name?.toLowerCase() === category.toLowerCase() ||
            (slug && product.category?.slug?.toLowerCase() === slug) ||
            product.subcategory?.toLowerCase() === category.toLowerCase()
          );
        });
      });
    }

    const loc = normalizeLocationValue(locationFilter).toLowerCase();
    if (loc) {
      result = result.filter((product) => {
        return (
          product.location?.city?.toLowerCase().includes(loc) ||
          product.location?.state?.toLowerCase().includes(loc) ||
          product.seller?.city?.toLowerCase().includes(loc) ||
          product.seller?.state?.toLowerCase().includes(loc)
        );
      });
    }

    if (selectedSuppliers.length > 0) {
      result = result.filter((product) => {
        const supplierName = product.seller?.name?.toLowerCase() || "";
        const companyName = product.seller?.companyName?.toLowerCase() || "";
        return selectedSuppliers.some((supplier) => {
          const value = supplier.toLowerCase();
          return supplierName.includes(value) || companyName.includes(value);
        });
      });
    }

    if (sort === "name") result.sort((a, b) => a.name.localeCompare(b.name));
    if (sort === "price-low") result.sort((a, b) => Number(a.price || 0) - Number(b.price || 0));
    if (sort === "price-high") result.sort((a, b) => Number(b.price || 0) - Number(a.price || 0));
    return result;
  }, [products, search, locationFilter, selectedCategories, selectedSuppliers, sort]);

  const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);
  const safePage = totalPages > 0 ? Math.min(currentPage, totalPages) : 1;

  const paginatedProducts = useMemo(() => {
    const startIndex = (safePage - 1) * PRODUCTS_PER_PAGE;
    return filteredProducts.slice(startIndex, startIndex + PRODUCTS_PER_PAGE);
  }, [filteredProducts, safePage]);

  useEffect(() => {
    if (totalPages > 0 && currentPage > totalPages) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- clamp page to valid range
      setCurrentPage(totalPages);
      replaceUrl({ search, category: currentCategorySlug, location: locationFilter, page: totalPages, sort });
    }
  }, [currentPage, totalPages, replaceUrl, search, currentCategorySlug, locationFilter, sort]);

  const goToPage = (page: number) => {
    if (page < 1 || (totalPages > 0 && page > totalPages)) return;
    setCurrentPage(page);
    replaceUrl({ search, category: currentCategorySlug, location: locationFilter, page, sort });
    document.querySelector(".products-section")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const visibleCategories = showAllCategories ? categories : categories.slice(0, 8);
  const startProduct = filteredProducts.length === 0 ? 0 : (safePage - 1) * PRODUCTS_PER_PAGE + 1;
  const endProduct = Math.min(safePage * PRODUCTS_PER_PAGE, filteredProducts.length);

  const getPageNumbers = () => {
    const pages: number[] = [];
    let start = Math.max(1, safePage - 2);
    let end = Math.min(totalPages, safePage + 2);
    if (safePage <= 3) end = Math.min(5, totalPages);
    if (safePage > totalPages - 3) start = Math.max(1, totalPages - 4);
    for (let page = start; page <= end; page++) pages.push(page);
    return pages;
  };

  return (
    <>
      <Navbar />
      <main className="products-page">
        <section className="products-hero">
          <div className="products-hero-content">
            <div className="products-hero-text">
              <span className="products-hero-label">ADVIXIO MARKETPLACE</span>
              <h1>{banner.title}</h1>
              <p>{banner.description}</p>
              <Link href="/categories" className="hero-product-button">{banner.button}</Link>
            </div>
            <div className="products-hero-image">
              <img src={banner.image} alt={banner.title} />
            </div>
          </div>
          <div className="products-slider-controls">
            {banners.map((item, index) => (
              <button
                key={item.id}
                type="button"
                className={index === activeBanner ? "slider-dot active" : "slider-dot"}
                onClick={() => setActiveBanner(index)}
                aria-label={`Show banner ${index + 1}`}
              />
            ))}
          </div>
        </section>

        <section className="product-search-section">
          <form
            className="product-search-box"
            role="search"
            onSubmit={(e) => {
              e.preventDefault();
              const next = normalizeSearchKeyword(search);
              setCurrentPage(1);
              const href = buildSearchUrl("products", {
                search: next,
                category: currentCategorySlug,
                location: locationFilter,
                page: 1,
                sort: sort && sort !== "relevance" ? sort : "",
              });
              router.push(href || "/products", { scroll: false });
            }}
          >
            <input
              type="text"
              name={SEARCH_PARAM}
              value={search}
              maxLength={100}
              onChange={(event) => {
                const next = normalizeSearchKeyword(event.target.value);
                setSearch(next);
                setCurrentPage(1);
                replaceUrl({ search: next, category: currentCategorySlug, location: locationFilter, page: 1, sort });
              }}
              placeholder="Search products, machinery, suppliers..."
              aria-label="Search products"
            />
            <button type="submit">Search</button>
          </form>
          {categoryNotice && (
            <p className="mt-2 text-center text-sm text-[#EA580C]" role="status">{categoryNotice}</p>
          )}
        </section>

        <section className="popular-products-section">
          <div className="section-heading">
            <div>
              <span>EXPLORE</span>
              <h2>Popular Categories</h2>
            </div>
            <Link href="/categories">View All Categories →</Link>
          </div>
          <div className="popular-category-list">
            {categories.slice(0, 6).map((category) => (
              <button
                key={category.id}
                type="button"
                onClick={() => toggleCategory(category.name)}
                className={selectedCategories.includes(category.name) ? "category-pill active" : "category-pill"}
              >
                {category.name}
              </button>
            ))}
          </div>
        </section>

        <section className="products-section">
          <div className="products-toolbar">
            <div>
              <span className="products-toolbar-label">MARKETPLACE</span>
              <h2>Explore Products</h2>
              <p>
                {loading
                  ? "Loading products..."
                  : `Showing ${startProduct}-${endProduct} of ${filteredProducts.length} products`}
              </p>
            </div>
            <div className="products-sort">
              <label htmlFor="sort">Sort by</label>
              <select id="sort" value={sort} onChange={(event) => onSortChange(event.target.value)}>
                <option value="relevance">Relevance</option>
                <option value="name">Name</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>
          </div>

          <div className="products-layout">
            <aside className="products-sidebar desktop-products-sidebar">
              <div className="filter-box">
                <div className="filter-header">
                  <h3>Categories</h3>
                  {selectedCategories.length > 0 && (
                    <button type="button" onClick={clearCategoryFilter}>Clear</button>
                  )}
                </div>
                <div className="filter-list">
                  {visibleCategories.map((category) => (
                    <label key={category.id} className="filter-option">
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(category.name)}
                        onChange={() => toggleCategory(category.name)}
                      />
                      <span>{category.name}</span>
                    </label>
                  ))}
                </div>
                <button type="button" className="view-more-filter" onClick={() => setShowAllCategories((c) => !c)}>
                  {showAllCategories ? "Show Less ↑" : `View All ${categories.length} Categories ↓`}
                </button>
              </div>

              <div className="filter-box">
                <div className="filter-header">
                  <h3>Supplier Type</h3>
                  {selectedSuppliers.length > 0 && (
                    <button type="button" onClick={() => setSelectedSuppliers([])}>Clear</button>
                  )}
                </div>
                <div className="filter-list">
                  {supplierTypes.map((supplier) => (
                    <label key={supplier} className="filter-option">
                      <input
                        type="checkbox"
                        checked={selectedSuppliers.includes(supplier)}
                        onChange={() => toggleSupplier(supplier)}
                      />
                      <span>{supplier}</span>
                    </label>
                  ))}
                </div>
              </div>

              {(selectedCategories.length > 0 || selectedSuppliers.length > 0 || search) && (
                <button type="button" className="clear-all-filters" onClick={clearFilters}>Clear All Filters</button>
              )}
            </aside>

            <div className="mobile-products-filters">
              <details className="mobile-filter-dropdown">
                <summary>
                  <span>
                    Categories
                    {selectedCategories.length > 0 && <small>{selectedCategories.length} selected</small>}
                  </span>
                  <span className="mobile-filter-arrow">⌄</span>
                </summary>
                <div className="mobile-filter-content">
                  <div className="mobile-filter-top">
                    <span>Select Categories</span>
                    {selectedCategories.length > 0 && (
                      <button type="button" onClick={clearCategoryFilter}>Clear</button>
                    )}
                  </div>
                  <div className="mobile-filter-options">
                    {visibleCategories.map((category) => (
                      <label key={category.id} className="filter-option">
                        <input
                          type="checkbox"
                          checked={selectedCategories.includes(category.name)}
                          onChange={() => toggleCategory(category.name)}
                        />
                        <span>{category.name}</span>
                      </label>
                    ))}
                  </div>
                  <button type="button" className="view-more-filter" onClick={() => setShowAllCategories((c) => !c)}>
                    {showAllCategories ? "Show Less ↑" : `View All ${categories.length} Categories ↓`}
                  </button>
                </div>
              </details>

              <details className="mobile-filter-dropdown">
                <summary>
                  <span>
                    Supplier Type
                    {selectedSuppliers.length > 0 && <small>{selectedSuppliers.length} selected</small>}
                  </span>
                  <span className="mobile-filter-arrow">⌄</span>
                </summary>
                <div className="mobile-filter-content">
                  <div className="mobile-filter-top">
                    <span>Select Supplier Type</span>
                    {selectedSuppliers.length > 0 && (
                      <button type="button" onClick={() => setSelectedSuppliers([])}>Clear</button>
                    )}
                  </div>
                  <div className="mobile-filter-options">
                    {supplierTypes.map((supplier) => (
                      <label key={supplier} className="filter-option">
                        <input
                          type="checkbox"
                          checked={selectedSuppliers.includes(supplier)}
                          onChange={() => toggleSupplier(supplier)}
                        />
                        <span>{supplier}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </details>

              {(selectedCategories.length > 0 || selectedSuppliers.length > 0 || search) && (
                <button type="button" className="mobile-clear-filters" onClick={clearFilters}>Clear All Filters</button>
              )}
            </div>

            <div className="products-results">
              {loading && (
                <div className="no-products">
                  <h3>Loading products...</h3>
                  <p>Please wait while we load products from Advixio marketplace.</p>
                </div>
              )}

              {!loading && error && (
                <div className="no-products">
                  <div className="no-products-icon">⚠️</div>
                  <h3>Unable to load products</h3>
                  <p>{error}</p>
                  <button type="button" onClick={() => window.location.reload()}>Retry</button>
                </div>
              )}

              {!loading && !error && filteredProducts.length > 0 && (
                <>
                  <ProductGrid products={paginatedProducts} />
                  {totalPages > 1 && (
                    <nav className="products-pagination" aria-label="Product pagination">
                      <button
                        type="button"
                        className="pagination-btn pagination-prev"
                        disabled={safePage === 1}
                        onClick={() => goToPage(safePage - 1)}
                      >
                        Previous
                      </button>
                      {getPageNumbers().map((page) => (
                        <button
                          key={page}
                          type="button"
                          className={safePage === page ? "pagination-btn active" : "pagination-btn"}
                          aria-current={safePage === page ? "page" : undefined}
                          onClick={() => goToPage(page)}
                        >
                          {page}
                        </button>
                      ))}
                      <button
                        type="button"
                        className="pagination-btn pagination-next"
                        disabled={safePage === totalPages}
                        onClick={() => goToPage(safePage + 1)}
                      >
                        Next
                      </button>
                    </nav>
                  )}
                  <p className="pagination-info">
                    Showing {startProduct}–{endProduct} of {filteredProducts.length} products
                  </p>
                </>
              )}

              {!loading && !error && filteredProducts.length === 0 && (
                <div className="no-products">
                  <div className="no-products-icon">🔎</div>
                  <h3>No products found</h3>
                  <p>Try changing your search or filter selection.</p>
                  <button type="button" onClick={clearFilters}>Clear Filters</button>
                </div>
              )}
            </div>
          </div>
        </section>

        <section className="supplier-cta">
          <div className="supplier-cta-content">
            <div className="supplier-cta-icon">🏭</div>
            <div className="supplier-cta-text">
              <span>GROW YOUR BUSINESS</span>
              <h2>Are You a Supplier?</h2>
              <p>
                List your products on Advixio and connect with buyers looking for products like yours.
              </p>
              <div className="supplier-cta-points">
                <span>✓ Reach new buyers</span>
                <span>✓ Showcase your products</span>
                <span>✓ Get business enquiries</span>
              </div>
            </div>
            <div className="supplier-cta-action">
              <Link href="/register" className="supplier-primary-button">Become a Supplier</Link>
              <Link href="/dashboard" className="supplier-secondary-button">Manage Products</Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
