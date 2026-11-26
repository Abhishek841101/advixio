
import { notFound, redirect } from "next/navigation";

type Props = {
  params: Promise<{
    slug: string;
    supplierSlug: string;
  }>;
};

export default async function ProductSupplierPage({
  params,
}: Props) {
  const { supplierSlug } = await params;

  if (!supplierSlug) {
    notFound();
  }

  redirect(`/suppliers/${encodeURIComponent(supplierSlug)}`);
}
