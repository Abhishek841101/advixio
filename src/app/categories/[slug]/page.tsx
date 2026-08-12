import { notFound } from "next/navigation";

import { categories } from "@/data/categories";

import CategoryHeader from "@/components/categories/CategoryHeader";
import CategorySidebar from "@/components/categories/CategorySidebar";
import CategoryGrid from "@/components/categories/CategoryGrid";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;

  const category = categories.find(
    (item) => item.slug === slug
  );

  if (!category) {
    notFound();
  }

  return (
    <main className="category-page">

      <CategoryHeader category={category} />

      <div className="category-layout">

        <CategorySidebar />

        <CategoryGrid />

      </div>

    </main>
  );
}