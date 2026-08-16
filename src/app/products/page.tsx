"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ProductGrid from "@/components/products/ProductGrid";
import { categories } from "@/data/categories";

const API_URL = "http://localhost:5000/api";

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
  specifications?: {
    label: string;
    value: string;
  }[];
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
  location?: {
    city?: string;
    state?: string;
    country?: string;
  };
};

export default function ProductsPage() {
  const [activeBanner, setActiveBanner] = useState(0);

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedSuppliers, setSelectedSuppliers] = useState<string[]>([]);
  const [sort, setSort] = useState("relevance");
  const [showAllCategories, setShowAllCategories] = useState(false);

  /* =========================================
     FETCH PRODUCTS FROM BACKEND
  ========================================= */

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
          throw new Error(result.message || "Failed to fetch products");
        }

        setProducts(result.data || []);
      } catch (err) {
        console.error("Products API error:", err);

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

  /* =========================================
     BANNER AUTO SLIDER
  ========================================= */

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveBanner((current) =>
        current === banners.length - 1 ? 0 : current + 1
      );
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const banner = banners[activeBanner];

  /* =========================================
     CATEGORY FILTER
  ========================================= */

  const toggleCategory = (category: string) => {
    setSelectedCategories((current) => {
      if (current.includes(category)) {
        return current.filter((item) => item !== category);
      }

      return [...current, category];
    });
  };

  /* =========================================
     SUPPLIER FILTER
  ========================================= */

  const toggleSupplier = (supplier: string) => {
    setSelectedSuppliers((current) => {
      if (current.includes(supplier)) {
        return current.filter((item) => item !== supplier);
      }

      return [...current, supplier];
    });
  };

  /* =========================================
     CLEAR FILTERS
  ========================================= */

  const clearFilters = () => {
    setSelectedCategories([]);
    setSelectedSuppliers([]);
    setSearch("");
    setSort("relevance");
  };

  /* =========================================
     FILTER PRODUCTS
  ========================================= */

  const filteredProducts = useMemo(() => {
    let result = [...products];

    /* SEARCH */

    if (search.trim()) {
      const query = search.toLowerCase().trim();

      result = result.filter((product) => {
        return (
          product.name?.toLowerCase().includes(query) ||
          product.description?.toLowerCase().includes(query) ||
          product.shortDescription?.toLowerCase().includes(query) ||
          product.brand?.toLowerCase().includes(query) ||
          product.model?.toLowerCase().includes(query) ||
          product.subcategory?.toLowerCase().includes(query) ||
          product.category?.name?.toLowerCase().includes(query) ||
          product.seller?.name?.toLowerCase().includes(query) ||
          product.seller?.companyName?.toLowerCase().includes(query)
        );
      });
    }

    /* CATEGORY */

    if (selectedCategories.length > 0) {
      result = result.filter((product) => {
        return selectedCategories.some(
          (category) =>
            product.category?.name?.toLowerCase() ===
              category.toLowerCase() ||
            product.subcategory?.toLowerCase() ===
              category.toLowerCase()
        );
      });
    }

    /* SUPPLER TYPE */

    if (selectedSuppliers.length > 0) {
      result = result.filter((product) => {
        const supplierName =
          product.seller?.name?.toLowerCase() || "";

        const companyName =
          product.seller?.companyName?.toLowerCase() || "";

        return selectedSuppliers.some((supplier) => {
          const value = supplier.toLowerCase();

          return (
            supplierName.includes(value) ||
            companyName.includes(value)
          );
        });
      });
    }

    /* SORT */

    if (sort === "name") {
      result.sort((a, b) =>
        a.name.localeCompare(b.name)
      );
    }

    if (sort === "price-low") {
      result.sort(
        (a, b) => Number(a.price || 0) - Number(b.price || 0)
      );
    }

    if (sort === "price-high") {
      result.sort(
        (a, b) => Number(b.price || 0) - Number(a.price || 0)
      );
    }

    return result;
  }, [
    products,
    search,
    selectedCategories,
    selectedSuppliers,
    sort,
  ]);

  const visibleCategories = showAllCategories
    ? categories
    : categories.slice(0, 8);

  return (
    <>
      <Navbar />

      <main className="products-page">

        {/* =========================================
            HERO
        ========================================= */}

        <section className="products-hero">
          <div className="products-hero-content">

            <div className="products-hero-text">

              <span className="products-hero-label">
                ADVIXIO MARKETPLACE
              </span>

              <h1>{banner.title}</h1>

              <p>{banner.description}</p>

              <Link
                href="/categories"
                className="hero-product-button"
              >
                {banner.button}
              </Link>

            </div>

            <div className="products-hero-image">
              <img
                src={banner.image}
                alt={banner.title}
              />
            </div>

          </div>

          <div className="products-slider-controls">
            {banners.map((item, index) => (
              <button
                key={item.id}
                type="button"
                className={
                  index === activeBanner
                    ? "slider-dot active"
                    : "slider-dot"
                }
                onClick={() => setActiveBanner(index)}
                aria-label={`Show banner ${index + 1}`}
              />
            ))}
          </div>
        </section>

        {/* =========================================
            SEARCH
        ========================================= */}

        <section className="product-search-section">

          <div className="product-search-box">

            <input
              type="text"
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Search products, machinery, suppliers..."
            />

            <button type="button">
              Search
            </button>

          </div>

        </section>

        {/* =========================================
            POPULAR CATEGORIES
        ========================================= */}

        <section className="popular-products-section">

          <div className="section-heading">

            <div>
              <span>EXPLORE</span>

              <h2>
                Popular Categories
              </h2>
            </div>

            <Link href="/categories">
              View All Categories →
            </Link>

          </div>

          <div className="popular-category-list">

            {categories.slice(0, 6).map((category) => (
              <button
                key={category.id}
                type="button"
                onClick={() =>
                  toggleCategory(category.name)
                }
                className={
                  selectedCategories.includes(category.name)
                    ? "category-pill active"
                    : "category-pill"
                }
              >
                {category.name}
              </button>
            ))}

          </div>

        </section>

        {/* =========================================
            PRODUCTS
        ========================================= */}

        <section className="products-section">

          <div className="products-toolbar">

            <div>

              <span className="products-toolbar-label">
                MARKETPLACE
              </span>

              <h2>
                Explore Products
              </h2>

              <p>
                {loading
                  ? "Loading products..."
                  : `Showing ${filteredProducts.length} of ${products.length} products`}
              </p>

            </div>

            <div className="products-sort">

              <label htmlFor="sort">
                Sort by
              </label>

              <select
                id="sort"
                value={sort}
                onChange={(event) =>
                  setSort(event.target.value)
                }
              >
                <option value="relevance">
                  Relevance
                </option>

                <option value="name">
                  Name
                </option>

                <option value="price-low">
                  Price: Low to High
                </option>

                <option value="price-high">
                  Price: High to Low
                </option>
              </select>

            </div>

          </div>

          <div className="products-layout">

            {/* =====================================
                SIDEBAR
            ===================================== */}

            <aside className="products-sidebar">

              <div className="filter-box">

                <div className="filter-header">

                  <h3>
                    Categories
                  </h3>

                  {selectedCategories.length > 0 && (
                    <button
                      type="button"
                      onClick={() =>
                        setSelectedCategories([])
                      }
                    >
                      Clear
                    </button>
                  )}

                </div>

                <div className="filter-list">

                  {visibleCategories.map((category) => (

                    <label
                      key={category.id}
                      className="filter-option"
                    >

                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(
                          category.name
                        )}
                        onChange={() =>
                          toggleCategory(category.name)
                        }
                      />

                      <span>
                        {category.name}
                      </span>

                    </label>

                  ))}

                </div>

                <button
                  type="button"
                  className="view-more-filter"
                  onClick={() =>
                    setShowAllCategories(
                      (current) => !current
                    )
                  }
                >
                  {showAllCategories
                    ? "Show Less ↑"
                    : `View All ${categories.length} Categories ↓`}
                </button>

              </div>

              {/* SUPPLIER FILTER */}

              <div className="filter-box">

                <div className="filter-header">

                  <h3>
                    Supplier Type
                  </h3>

                  {selectedSuppliers.length > 0 && (
                    <button
                      type="button"
                      onClick={() =>
                        setSelectedSuppliers([])
                      }
                    >
                      Clear
                    </button>
                  )}

                </div>

                <div className="filter-list">

                  {supplierTypes.map((supplier) => (

                    <label
                      key={supplier}
                      className="filter-option"
                    >

                      <input
                        type="checkbox"
                        checked={selectedSuppliers.includes(
                          supplier
                        )}
                        onChange={() =>
                          toggleSupplier(supplier)
                        }
                      />

                      <span>
                        {supplier}
                      </span>

                    </label>

                  ))}

                </div>

              </div>

              {(selectedCategories.length > 0 ||
                selectedSuppliers.length > 0 ||
                search) && (

                <button
                  type="button"
                  className="clear-all-filters"
                  onClick={clearFilters}
                >
                  Clear All Filters
                </button>

              )}

            </aside>

            {/* =====================================
                PRODUCT RESULTS
            ===================================== */}

            <div className="products-results">

              {loading && (
                <div className="no-products">
                  <h3>
                    Loading products...
                  </h3>

                  <p>
                    Please wait while we load products
                    from Advixio marketplace.
                  </p>
                </div>
              )}

              {!loading && error && (
                <div className="no-products">

                  <div className="no-products-icon">
                    ⚠️
                  </div>

                  <h3>
                    Unable to load products
                  </h3>

                  <p>
                    {error}
                  </p>

                  <button
                    type="button"
                    onClick={() =>
                      window.location.reload()
                    }
                  >
                    Retry
                  </button>

                </div>
              )}

              {!loading &&
                !error &&
                filteredProducts.length > 0 && (

                  <ProductGrid
                    products={filteredProducts}
                  />

                )}

              {!loading &&
                !error &&
                filteredProducts.length === 0 && (

                  <div className="no-products">

                    <div className="no-products-icon">
                      🔎
                    </div>

                    <h3>
                      No products found
                    </h3>

                    <p>
                      Try changing your search or
                      filter selection.
                    </p>

                    <button
                      type="button"
                      onClick={clearFilters}
                    >
                      Clear Filters
                    </button>

                  </div>

                )}

            </div>

          </div>

        </section>

        {/* =========================================
            SUPPLIER CTA
        ========================================= */}

        <section className="supplier-cta">

          <div className="supplier-cta-content">

            <div className="supplier-cta-icon">
              🏭
            </div>

            <div className="supplier-cta-text">

              <span>
                GROW YOUR BUSINESS
              </span>

              <h2>
                Are You a Supplier?
              </h2>

              <p>
                List your products on Advixio and
                connect with buyers looking for
                products like yours.
              </p>

              <div className="supplier-cta-points">

                <span>
                  ✓ Reach new buyers
                </span>

                <span>
                  ✓ Showcase your products
                </span>

                <span>
                  ✓ Get business enquiries
                </span>

              </div>

            </div>

            <div className="supplier-cta-action">

              <Link
                href="/register"
                className="supplier-primary-button"
              >
                Become a Supplier
              </Link>

              <Link
                href="/dashboard"
                className="supplier-secondary-button"
              >
                Manage Products
              </Link>

            </div>

          </div>

        </section>

      </main>

      <Footer />
    </>
  );
}