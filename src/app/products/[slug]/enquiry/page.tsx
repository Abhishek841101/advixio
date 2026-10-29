
import type { Metadata } from "next";
import EnquiryForm from "@/components/products/EnquiryForm";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  const { slug } = await params;

  return {
    title: `Send Product Enquiry | Advixio360`,
    description:
      "Contact a product supplier and submit your requirement on Advixio360.",
    robots: {
      index: false,
      follow: true,
    },
    alternates: {
      canonical: `https://advixio360.com/products/${encodeURIComponent(
        slug
      )}/enquiry`,
    },
  };
}

export default async function ProductEnquiryPage({ params }: Props) {
  const { slug } = await params;

  return <EnquiryForm slug={slug} />;
}
