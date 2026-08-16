import { notFound } from "next/navigation";
import Link from "next/link";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ProductImageGallery from "@/components/products/ProductImageGallery";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

type Specification = {
  label: string;
  value: string;
};

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

  specifications?: Specification[];

  companyName?: string;

  location?: {
    city?: string;
    state?: string;
    country?: string;
  };

  seller?: {
    _id: string;
    name?: string;
    email?: string;
    phone?: string;
    companyName?: string;
    city?: string;
    state?: string;
  };

  status?: string;
  isFeatured?: boolean;
};

type ProductResponse = {
  success: boolean;
  data: Product;
};

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:5000/api";

async function getProduct(
  slug: string
): Promise<Product | null> {
  try {
    const response = await fetch(
      `${API_URL}/products/${encodeURIComponent(slug)}`,
      {
        cache: "no-store",
      }
    );

    if (!response.ok) {
      return null;
    }

    const result: ProductResponse =
      await response.json();

    if (!result.success || !result.data) {
      return null;
    }

    return result.data;
  } catch (error) {
    console.error(
      "Product fetch error:",
      error
    );

    return null;
  }
}

function formatPrice(price?: number) {
  if (
    price === undefined ||
    price === null
  ) {
    return "Price on Request";
  }

  return `₹${price.toLocaleString("en-IN")}`;
}

function getLocation(product: Product) {
  const location = product.location;

  if (!location) {
    return "Location not available";
  }

  return [
    location.city,
    location.state,
    location.country,
  ]
    .filter(Boolean)
    .join(", ");
}

function getSupplierName(product: Product) {
  return (
    product.seller?.companyName ||
    product.companyName ||
    product.seller?.name ||
    "Supplier"
  );
}

export default async function ProductDetailPage({
  params,
}: Props) {
  const { slug } = await params;

  const product = await getProduct(slug);

  if (!product) {
    notFound();
    
  }

console.log("PRODUCT IMAGES:", product.images);
  const specifications =
    product.specifications || [];

  const supplierName =
    getSupplierName(product);

  const supplierLocation =
    getLocation(product);

  return (
    <>
      <Navbar />

      <main className="product-detail-page">

        {/* =========================================
            BREADCRUMB
        ========================================= */}

        <div className="product-breadcrumb">

          <Link href="/">
            Home
          </Link>

          <span>›</span>

          <Link href="/products">
            Products
          </Link>

          <span>›</span>

          <span>
            {product.name}
          </span>

        </div>


        {/* =========================================
            PRODUCT MAIN
        ========================================= */}

        <section className="product-main-container">

          {/* =====================================
              PRODUCT IMAGE GALLERY
          ===================================== */}

          <div className="product-gallery">

            <ProductImageGallery
              images={product.images}
              productName={product.name}
            />

          </div>


          {/* =====================================
              PRODUCT INFORMATION
          ===================================== */}

          <div className="product-main-info">

            <span className="product-category-badge">

              {product.subcategory ||
                product.category?.name ||
                "Industrial Product"}

            </span>


            <h1>
              {product.name}
            </h1>


            <p className="product-short-description">

              {product.shortDescription ||
                "Quality industrial product from a verified supplier."}

            </p>


            {/* PRICE */}

            <div className="product-price-box">

              <span className="product-price-label">
                Starting Price
              </span>

              <div className="product-detail-price">

                {formatPrice(product.price)}

                {product.unit && (
                  <span>
                    {" "}
                    / {product.unit}
                  </span>
                )}

              </div>

            </div>


            {/* PRODUCT META */}

            <div className="product-basic-info">

              <div>

                <span>
                  Brand
                </span>

                <strong>
                  {product.brand || "N/A"}
                </strong>

              </div>


              <div>

                <span>
                  Model
                </span>

                <strong>
                  {product.model || "N/A"}
                </strong>

              </div>


              <div>

                <span>
                  Category
                </span>

                <strong>
                  {product.category?.name ||
                    product.subcategory ||
                    "N/A"}
                </strong>

              </div>

            </div>


            {/* ACTIONS */}

            <div className="product-actions">

              <button
                type="button"
                className="contact-supplier-button"
              >
                Contact Supplier
              </button>


              <button
                type="button"
                className="send-enquiry-button"
              >
                Send Enquiry
              </button>

            </div>

          </div>


          {/* =====================================
              ENQUIRY CARD
          ===================================== */}

          <aside className="product-enquiry-card">

            <h2>
              Interested in this product?
            </h2>


            <p>
              Send an enquiry to the supplier and
              get the best quotation.
            </p>


            <button
              type="button"
              className="enquiry-primary-button"
            >
              Send Enquiry
            </button>


            <button
              type="button"
              className="enquiry-secondary-button"
            >
              Contact Supplier
            </button>


            {/* SUPPLIER MINI */}

            <div className="supplier-mini-card">

              <span>
                Supplier
              </span>


              <strong>
                {supplierName}
              </strong>


              <p>
                📍 {supplierLocation}
              </p>


              <span className="verified-supplier">
                ✓ Verified Supplier
              </span>

            </div>

          </aside>

        </section>


        {/* =========================================
            DESCRIPTION + SPECIFICATIONS
        ========================================= */}

        <section className="product-information-layout">

          <div className="product-information-main">

            {/* DESCRIPTION */}

            <div className="product-information-card">

              <h2>
                Product Description
              </h2>


              <p>
                {product.description ||
                  product.shortDescription ||
                  "No product description available."}
              </p>

            </div>


            {/* SPECIFICATIONS */}

            <div className="product-information-card">

              <h2>
                Product Specifications
              </h2>


              {specifications.length > 0 ? (

                <div className="specifications-table">

                  {specifications.map(
                    (specification, index) => (

                      <div
                        className="specification-row"
                        key={`${specification.label}-${index}`}
                      >

                        <div className="specification-label">
                          {specification.label}
                        </div>


                        <div className="specification-value">
                          {specification.value}
                        </div>

                      </div>

                    )
                  )}

                </div>

              ) : (

                <p>
                  No specifications available.
                </p>

              )}

            </div>

          </div>


          {/* =====================================
              SUPPLIER CARD
          ===================================== */}

          <aside className="product-supplier-card">

            <span className="supplier-label">
              SUPPLIER
            </span>


            <h2>
              {supplierName}
            </h2>


            <p>
              📍 {supplierLocation}
            </p>


            <div className="supplier-status">
              ✓ Verified Supplier
            </div>


            <hr />


            <p className="supplier-description">
              Trusted supplier offering quality
              products and industrial solutions.
            </p>


            <button
              type="button"
              className="supplier-contact-button"
            >
              Contact Supplier
            </button>

          </aside>

        </section>


        {/* =========================================
            BUYING CTA
        ========================================= */}

        <section className="product-bottom-cta">

          <div>

            <span>
              LOOKING FOR THIS PRODUCT?
            </span>


            <h2>
              Get the best price from suppliers
            </h2>


            <p>
              Send your requirement and connect
              directly with verified suppliers.
            </p>

          </div>


          <button type="button">
            Send Your Requirement →
          </button>

        </section>

      </main>

      <Footer />
    </>
  );
}