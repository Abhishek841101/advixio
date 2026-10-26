
import type { Metadata } from "next";
import SupplierProfilePage from "@/app/suppliers/[slug]/page";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{
    slug: string;
    supplierSlug: string;
  }>;
};

export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  const { supplierSlug } = await params;

  const companyName = decodeURIComponent(
    supplierSlug
  ).replace(/-/g, " ");

  return {
    title: `${companyName} | Advixio`,
    description: `View supplier details and products from ${companyName} on Advixio.`,
  };
}

export default async function ProductSupplierPage({
  params,
}: Props) {
  const { supplierSlug } = await params;

  if (!supplierSlug) {
    notFound();
  }

  return (
    <SupplierProfilePage
      params={Promise.resolve({
        slug: supplierSlug,
      })}
    />
  );
}
