import Link from "next/link";
import { categories } from "@/data/categories";

const icons = [
  "⚙",
  "🚗",
  "⚡",
  "🏗",
  "🔧",
  "🛡",
  "🌾",
  "🏭",
  "📦",
  "🧪",
  "⚕",
  "🧵",
  "◈",
  "▣",
  "⚒",
  "◉",
  "◌",
  "❄",
  "🏗",
  "🔬",
  "☀",
  "🔋",
  "💻",
  "📡",
  "▤",
  "▦",
  "⌂",
  "◈",
  "◉",
  "◍",
  "▣",
  "✦",
  "♻",
  "⛏",
  "◉",
  "♻",
  "▤",
  "◇",
  "◆",
  "▥",
  "▰",
  "▤",
  "⚕",
  "✦",
  "◇",
  "♟",
  "⚽",
  "▣",
  "⌁",
  "⚙",
];

export default function CategoriesPage() {
  return (
    <main className="categories-page">

      {/* ================================
          HERO
      ================================= */}
      <section className="categories-hero">
        <div className="categories-hero-content">

          <div className="categories-breadcrumb">
            <Link href="/">Home</Link>
            <span>/</span>
            <span>Categories</span>
          </div>

          <span className="categories-eyebrow">
            ADVIXIO MARKETPLACE
          </span>

          <h1>
            Explore Products by{" "}
            <span>Category</span>
          </h1>

          <p>
            Discover products, manufacturers, suppliers and business
            solutions across multiple industries.
          </p>

          {/* Search */}
          <div className="category-search">
            <span className="category-search-icon">
              ⌕
            </span>

            <input
              type="text"
              placeholder="Search categories..."
            />

            <button>
              Search
            </button>
          </div>

          <div className="category-hero-stats">
            <div>
              <strong>{categories.length}+</strong>
              <span>Categories</span>
            </div>

            <div>
              <strong>10K+</strong>
              <span>Products</span>
            </div>

            <div>
              <strong>5K+</strong>
              <span>Suppliers</span>
            </div>
          </div>

        </div>
      </section>


      {/* ================================
          POPULAR CATEGORIES
      ================================= */}
      <section className="popular-category-section">

        <div className="category-section-header">
          <div>
            <span className="section-label">
              MOST SEARCHED
            </span>

            <h2>Popular Categories</h2>

            <p>
              Explore some of the most popular business categories
              on Advixio.
            </p>
          </div>

          <span className="category-count">
            {categories.length} Categories
          </span>
        </div>


        <div className="popular-category-grid">
          {categories.slice(0, 8).map((category, index) => (
            <Link
              href={`/categories/${category.slug}`}
              key={category.id}
              className="popular-category-card"
            >
              <div className="popular-icon">
                {icons[index]}
              </div>

              <div>
                <h3>{category.name}</h3>

                <p>
                  Explore products
                </p>
              </div>

              <span className="category-arrow">
                →
              </span>
            </Link>
          ))}
        </div>

      </section>


      {/* ================================
          ALL CATEGORIES
      ================================= */}
      <section className="all-categories-section">

        <div className="category-section-header">
          <div>
            <span className="section-label">
              BROWSE INDUSTRIES
            </span>

            <h2>All Categories</h2>

            <p>
              Find the right products and suppliers for your
              business requirements.
            </p>
          </div>

          <div className="category-result-count">
            Showing{" "}
            <strong>{categories.length}</strong>{" "}
            categories
          </div>
        </div>


        <div className="categories-grid">

          {categories.map((category, index) => (

            <Link
              href={`/categories/${category.slug}`}
              key={category.id}
              className="category-card"
            >

              {/* Icon */}
              <div className="category-card-top">

                <div className="category-icon">
                  {icons[index % icons.length]}
                </div>

                <span className="category-number">
                  {String(category.id).padStart(2, "0")}
                </span>

              </div>


              {/* Content */}
              <div className="category-card-content">

                <h3>
                  {category.name}
                </h3>

                <p>
                  {category.description}
                </p>

              </div>


              {/* Footer */}
              <div className="category-card-footer">

                <span>
                  Explore Category
                </span>

                <span className="category-card-arrow">
                  →
                </span>

              </div>

            </Link>

          ))}

        </div>

      </section>


      {/* ================================
          SUPPLIER CTA
      ================================= */}
      <section className="category-supplier-cta">

        <div className="supplier-cta-content">

          <div className="supplier-cta-icon">
            ◈
          </div>

          <div>
            <span className="section-label">
              FOR BUSINESS
            </span>

            <h2>
              Are you a Manufacturer or Supplier?
            </h2>

            <p>
              List your products on Advixio and connect with
              buyers looking for products and services like yours.
            </p>
          </div>

          <div className="supplier-cta-actions">

            <Link
              href="/register"
              className="supplier-primary-button"
            >
              Become a Supplier
            </Link>

            <Link
              href="/products"
              className="supplier-secondary-button"
            >
              Explore Products →
            </Link>

          </div>

        </div>

      </section>

    </main>
  );
}