
import Link from "next/link";
import { categories } from "@/data/categories";

const icons = [
  <><path d="M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8Z"/><path d="M19 12a7 7 0 0 0-.2-1.5l1.5-1.2-1.5-2.6-1.8.6a7 7 0 0 0-2.5-1.4L14.2 4h-3l-.3 1.9a7 7 0 0 0-2.5 1.4l-1.8-.6-1.5 2.6 1.5 1.2a7 7 0 0 0 0 3l-1.5 1.2 1.5 2.6 1.8-.6a7 7 0 0 0 2.5 1.4l.3 1.9h3l.3-1.9a7 7 0 0 0 2.5-1.4l1.8.6 1.5-2.6-1.5-1.2A7 7 0 0 0 19 12Z"/></>,
  <><path d="M3 17h18M5 17v-5l2-5h10l2 5v5M8 12h8M10 7V4h4v3"/></>,
  <><rect x="6" y="6" width="12" height="12" rx="2"/><path d="M9 2v4m6-4v4M9 18v4m6-4v4M2 9h4m-4 6h4m12-6h4m-4 6h4"/></>,
  <><path d="m8 4-5 3 2 5 3-1v9h8v-9l3 1 2-5-5-3-2 2h-4L8 4Z"/></>,
  <><path d="m12 3 9 5-9 5-9-5 9-5Z"/><path d="M3 8v9l9 5 9-5V8M12 13v9"/></>,
  <><path d="M20 4c-8 0-14 3-14 10a6 6 0 0 0 6 6c7 0 10-8 8-16Z"/><path d="M4 21c3-6 7-9 12-12"/></>,
  <><path d="M10 3h4v7h7v4h-7v7h-4v-7H3v-4h7V3Z"/></>,
  <><path d="M4 11V8a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v3M3 11a2 2 0 0 1 2 2v4h14v-4a2 2 0 0 1 2-2v8H3v-8ZM6 17v3m12-3v3"/></>,
];

function CategoryIcon({ index }) {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {icons[index]}
    </svg>
  );
}

export default function IndustrySection() {
  const visibleCategories = categories.slice(0, 8);

  return (
    <section className="industry-section" id="categories">
      <div className="container">

        <div className="section-header">
          <div>
            <h2>Explore Business Categories</h2>
            <p>
              Find businesses, suppliers and products across India's
              major B2B industries.
            </p>
          </div>

          <Link
            href="/categories"
            className="view-all-button desktop-view-all"
          >
            View All Categories →
          </Link>
        </div>

        <div className="industry-grid">
          {visibleCategories.map((category, index) => (
            <Link
              href={`/products?category=${encodeURIComponent(category.slug)}`}
              className="industry-card"
              key={category.id}
            >
              <div className="industry-icon">
                <CategoryIcon index={index} />
              </div>

              <div className="industry-card-content">
                <h3>{category.name}</h3>
                <p>{category.description}</p>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}
