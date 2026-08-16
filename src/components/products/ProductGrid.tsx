import ProductCard from "./ProductCard";

export type Product = {
  _id: string;
  id?: string;

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

  price?: number | string;
  unit?: string;

  image?: string;
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

type ProductGridProps = {
  products: Product[];
};

export default function ProductGrid({
  products,
}: ProductGridProps) {
  return (
    <div className="product-grid">
      {products.map((product, index) => (
        <ProductCard
          key={
            product._id ||
            product.id ||
            product.slug ||
            `product-${index}`
          }
          product={product}
        />
      ))}
    </div>
  );
}