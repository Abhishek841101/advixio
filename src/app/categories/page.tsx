import Link from "next/link";
import { categories } from "@/data/categories";

export default function CategoriesPage() {
  return (
    <main>
      <h1>All Categories</h1>

      <p>
        Explore products, suppliers and services across different industries.
      </p>

      <section>
        {categories.map((category) => (
          <Link
            key={category.id}
            href={`/categories/${category.slug}`}
          >
            <div>
              <h2>{category.name}</h2>

              <p>{category.description}</p>

              <span>Explore Category →</span>
            </div>
          </Link>
        ))}
      </section>
    </main>
  );
}