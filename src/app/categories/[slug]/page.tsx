import { notFound } from "next/navigation";

import CategoryHeader from "@/components/categories/CategoryHeader";
import CategorySidebar from "@/components/categories/CategorySidebar";
import CategoryGrid from "@/components/categories/CategoryGrid";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:5000/api";

type Category = {
  _id: string;
  name: string;
  slug: string;
  description: string;
  image?: string;
  icon?: string;
  isActive: boolean;
  sortOrder: number;
};

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function CategoryPage({
  params,
}: Props) {
  const { slug } = await params;

  console.log(
    "Category page slug:",
    slug
  );

  try {
    const categoryUrl =
      `${API_URL}/categories/${encodeURIComponent(slug)}`;

    console.log(
      "Fetching category:",
      categoryUrl
    );

    const response = await fetch(
      categoryUrl,
      {
        cache: "no-store",
      }
    );

    if (!response.ok) {
      console.error(
        "Category API failed:",
        response.status,
        categoryUrl
      );

      notFound();
    }

    const result = await response.json();

    const category: Category =
      result?.data;

    if (!category) {
      console.error(
        "Category data missing:",
        result
      );

      notFound();
    }

    return (
      <main className="category-page">

        {/* Category Header */}
        <CategoryHeader
          category={category}
        />

        <div className="category-layout">

          {/* Sidebar */}
          <CategorySidebar />

          {/* Products */}
          <CategoryGrid
            slug={category.slug}
          />

        </div>

      </main>
    );
  } catch (error) {
    console.error(
      "Category page error:",
      error
    );

    notFound();
  }
}