
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ProductImageGallery from "@/components/products/ProductImageGallery";
import ProductDescription from "@/components/products/ProductDescription";
import ProductDetailTabs from "@/components/products/ProductDetailTabs";

type Props = {
  params: Promise<{ slug: string }>;
};

type Specification = {
  label?: string;
  name?: string;
  value?: string;
};

type CustomField = {
  name?: string;
  label?: string;
  value?: string;
};

type ProductLocation = {
  city?: string;
  state?: string;
  country?: string;
};

type Seller = {
  _id?: string;
  slug?: string;
  name?: string;
  email?: string;
  phone?: string;
  companyName?: string;
  city?: string;
  state?: string;
};

type Product = {
  _id: string;
  name: string;
  slug: string;
  shortDescription?: string;
  description?: string;
  category?: {
    _id?: string;
    name?: string;
    slug?: string;
  } | null;
  subcategory?: string;
  brand?: string;
  model?: string;
  price?: number;
  unit?: string;
  images?: string[];
  specifications?: Specification[];
  customFields?: CustomField[];
  companyName?: string;
  location?: ProductLocation;
  seller?: Seller;
  status?: string;
  isFeatured?: boolean;
};

type ProductResponse = {
  success: boolean;
  data: Product;
};

type SupplierProductsResponse = {
  success: boolean;
  message?: string;
  data?: {
    supplier?: Seller;
    products?: Product[];
    productCount?: number;
  };
};

const API_URL = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"
).replace(/\/+$/, "");

const SITE_URL = "https://advixio360.com";

/* =====================================================
   GET PRODUCT
===================================================== */

async function getProduct(slug: string): Promise<Product | null> {
  try {
    const response = await fetch(
      `${API_URL}/products/${encodeURIComponent(slug)}`,
      { cache: "no-store" }
    );

    if (!response.ok) return null;

    const result: ProductResponse = await response.json();

    if (!result.success || !result.data) return null;

    return result.data;
  } catch (error) {
    console.error("Product fetch error:", error);
    return null;
  }
}

/* =====================================================
   GET OTHER PRODUCTS FROM SAME SUPPLIER
===================================================== */

async function getSupplierProducts(
  supplierIdentifier: string | undefined,
  currentProduct: Product
): Promise<Product[]> {
  if (!supplierIdentifier) return [];

  try {
    const response = await fetch(
      `${API_URL}/suppliers/${encodeURIComponent(supplierIdentifier)}`,
      { cache: "no-store" }
    );

    if (!response.ok) return [];

    const result =
      (await response.json()) as SupplierProductsResponse;

    if (!result.success || !Array.isArray(result.data?.products)) {
      return [];
    }

    return result.data.products.filter(
      (item) =>
        item._id !== currentProduct._id &&
        item.slug !== currentProduct.slug
    );
  } catch (error) {
    console.error("Supplier products fetch error:", error);
    return [];
  }
}

/* =====================================================
   SEO METADATA
===================================================== */

export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) {
    return {
      title: "Product Not Found | Advixio360",
      description:
        "The requested product could not be found on Advixio360.",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const productName = product.name?.trim() || "Industrial Product";

  const rawDescription =
    product.shortDescription?.trim() ||
    product.description?.trim() ||
    `Explore ${productName} and connect with suppliers on Advixio360.`;

  const description =
    rawDescription.length > 160
      ? `${rawDescription.slice(0, 157).trimEnd()}...`
      : rawDescription;

  const canonicalUrl =
    `${SITE_URL}/products/${encodeURIComponent(slug)}`;

  const image = product.images?.find(
    (url) => typeof url === "string" && url.trim() !== ""
  );

  return {
    title: `${productName} | Advixio360`,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    robots: {
      index: product.status === "active",
      follow: true,
    },
    openGraph: {
      title: `${productName} | Advixio360`,
      description,
      url: canonicalUrl,
      siteName: "Advixio360",
      locale: "en_IN",
      ...(image
        ? {
            images: [
              {
                url: image,
                alt: productName,
              },
            ],
          }
        : {}),
    },
    twitter: {
      card: image ? "summary_large_image" : "summary",
      title: `${productName} | Advixio360`,
      description,
      ...(image ? { images: [image] } : {}),
    },
  };
}

/* =====================================================
   HELPERS
===================================================== */

function formatPrice(price?: number) {
  if (price === undefined || price === null) {
    return "Price on Request";
  }

  return `₹${price.toLocaleString("en-IN")}`;
}

function getLocation(product: Product) {
  const productLocation = product.location;

  if (
    productLocation?.city ||
    productLocation?.state ||
    productLocation?.country
  ) {
    return [
      productLocation.city,
      productLocation.state,
      productLocation.country,
    ]
      .filter(Boolean)
      .join(", ");
  }

  if (product.seller?.city || product.seller?.state) {
    return [product.seller.city, product.seller.state]
      .filter(Boolean)
      .join(", ");
  }

  return "Location not available";
}

function getSupplierName(product: Product) {
  return (
    product.companyName?.trim() ||
    product.seller?.companyName?.trim() ||
    product.seller?.name?.trim() ||
    "Supplier"
  );
}

function getFieldName(field: Specification | CustomField) {
  return field.name?.trim() || field.label?.trim() || "";
}

function getPhoneNumber(product: Product) {
  const rawPhone = product.seller?.phone || "";

  let phone = String(rawPhone).replace(/\D/g, "");

  if (phone.length === 10) {
    phone = `91${phone}`;
  } else if (phone.length === 11 && phone.startsWith("0")) {
    phone = `91${phone.slice(1)}`;
  }

  return phone.length >= 11 && phone.length <= 15 ? phone : "";
}

function makeSupplierSlug(product: Product, supplierName: string) {
  return (
    product.seller?.companyName ||
    product.seller?.name ||
    product.companyName ||
    supplierName ||
    "supplier"
  )
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

/* =====================================================
   PAGE
===================================================== */

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) notFound();

  const supplierIdentifier =
    product.seller?.slug || product.seller?._id;

  const supplierProducts = await getSupplierProducts(
    supplierIdentifier,
    product
  );

  const specifications = Array.isArray(product.specifications)
    ? product.specifications.filter(
        (item) =>
          getFieldName(item) &&
          item.value !== undefined &&
          item.value !== null &&
          String(item.value).trim() !== ""
      )
    : [];

  const customFields = Array.isArray(product.customFields)
    ? product.customFields.filter(
        (item) =>
          getFieldName(item) &&
          item.value !== undefined &&
          item.value !== null &&
          String(item.value).trim() !== ""
      )
    : [];

  const supplierName = getSupplierName(product);
  const supplierLocation = getLocation(product);
  const phone = getPhoneNumber(product);
  const supplierCompanySlug = makeSupplierSlug(product, supplierName);

  const whatsappMessage = encodeURIComponent(
    `Hello, I am interested in ${product.name}. Please share the price and product details.`
  );

  const enquiryUrl =
    `/products/${encodeURIComponent(product.slug)}/enquiry`;

  const productImages = Array.isArray(product.images)
    ? product.images.filter(
        (image) =>
          typeof image === "string" && image.trim() !== ""
      )
    : [];

  /* PRODUCT JSON-LD */

  const productDescription =
    product.description?.trim() ||
    product.shortDescription?.trim();

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    ...(productDescription
      ? { description: productDescription }
      : {}),
    ...(productImages.length > 0
      ? { image: productImages }
      : {}),
    ...(product.brand?.trim()
      ? {
          brand: {
            "@type": "Brand",
            name: product.brand.trim(),
          },
        }
      : {}),
    ...(product.price != null &&
    Number.isFinite(product.price) &&
    product.price >= 0
      ? {
          offers: {
            "@type": "Offer",
            url: `${SITE_URL}/products/${encodeURIComponent(
              product.slug
            )}`,
            priceCurrency: "INR",
            price: String(product.price),
          },
        }
      : {}),
  };

  /* BREADCRUMB JSON-LD */

  const categoryName = product.category?.name?.trim();
  const categorySlug = product.category?.slug?.trim();
  const productName = product.name?.trim() || "Product";
  const productUrl =
    `${SITE_URL}/products/${encodeURIComponent(product.slug)}`;

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: `${SITE_URL}/`,
      },
      categoryName && categorySlug
        ? {
            "@type": "ListItem",
            position: 2,
            name: categoryName,
            item: `${SITE_URL}/categories/${encodeURIComponent(
              categorySlug
            )}`,
          }
        : {
            "@type": "ListItem",
            position: 2,
            name: "Products",
            item: `${SITE_URL}/products`,
          },
      {
        "@type": "ListItem",
        position: 3,
        name: productName,
        item: productUrl,
      },
    ],
  };

  const customFieldData = customFields.map((field) => ({
    name: getFieldName(field),
    value: String(field.value),
  }));

  const specificationData = specifications.map((field) => ({
    name: getFieldName(field),
    value: String(field.value),
  }));

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(productSchema).replace(
            /</g,
            "\\u003c"
          ),
        }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema).replace(
            /</g,
            "\\u003c"
          ),
        }}
      />

      <Navbar />

      <main className="product-detail-page">
        {/* BREADCRUMB */}

        <div className="product-breadcrumb">
          <Link href="/">Home</Link>
          <span>›</span>

          {product.category?.name && product.category?.slug ? (
            <Link
              href={`/categories/${encodeURIComponent(
                product.category.slug
              )}`}
            >
              {product.category.name}
            </Link>
          ) : (
            <Link href="/products">Products</Link>
          )}

          <span>›</span>
          <span>{product.name}</span>
        </div>

        {/* MAIN PRODUCT SECTION */}

        <section className="product-main-container">
          {/* PRODUCT IMAGE */}

          <div className="product-gallery">
            <ProductImageGallery
              images={productImages}
              productName={product.name}
            />
          </div>

          {/* PRODUCT INFORMATION */}

          <div className="product-main-info">
            <span className="product-category-badge">
              {product.subcategory ||
                product.category?.name ||
                "Industrial Product"}
            </span>

            <h1>{product.name}</h1>

            <p className="product-short-description">
              {product.shortDescription ||
                "Quality industrial product from a verified supplier."}
            </p>

            <div className="product-price-box">
              <span className="product-price-label">
                Starting Price
              </span>

              <div className="product-detail-price">
                {formatPrice(product.price)}
                {product.unit && <span> / {product.unit}</span>}
              </div>
            </div>

            <div className="product-basic-info">
              <div>
                <span>Brand</span>
                <strong>{product.brand || "N/A"}</strong>
              </div>

              <div>
                <span>Model</span>
                <strong>{product.model || "N/A"}</strong>
              </div>

              <div>
                <span>Category</span>
                <strong>
                  {product.category?.name ||
                    product.subcategory ||
                    "N/A"}
                </strong>
              </div>
            </div>

            {/* DESKTOP PRODUCT ACTIONS */}

            <div className="product-actions">
              <a
                href={phone ? `tel:+${phone}` : undefined}
                className={`contact-supplier-button ${
                  !phone ? "is-disabled" : ""
                }`}
                aria-disabled={!phone}
              >
                Call Supplier
              </a>

              <a
                href={
                  phone
                    ? `https://wa.me/${phone}?text=${whatsappMessage}`
                    : undefined
                }
                target="_blank"
                rel="noopener noreferrer"
                className={`whatsapp-supplier-button ${
                  !phone ? "is-disabled" : ""
                }`}
                aria-disabled={!phone}
              >
                WhatsApp
              </a>

              <Link
                href={enquiryUrl}
                className="send-enquiry-button"
              >
                Send Enquiry
              </Link>
            </div>

            {/* MOBILE SUPPLIER SUMMARY */}

            <div className="mobile-supplier-summary">
              <div className="mobile-supplier-avatar">
                {supplierName.charAt(0).toUpperCase()}
              </div>

              <div className="mobile-supplier-text">
                <span>SUPPLIER</span>
                <strong>{supplierName}</strong>
                <small>{supplierLocation}</small>
              </div>

              <Link
                href={`/products/${encodeURIComponent(
                  product.slug
                )}/supplier/${encodeURIComponent(
                  supplierCompanySlug
                )}`}
                className="mobile-supplier-link"
              >
                View
              </Link>
            </div>
          </div>

          {/* DESKTOP ENQUIRY CARD */}

          <aside className="product-enquiry-card">
            <div className="enquiry-card-heading">
              <span className="enquiry-card-eyebrow">
                PRODUCT ENQUIRY
              </span>

              <h2>Interested in this product?</h2>

              <p>
                Share your requirements with the supplier and get a
                quotation tailored to your business needs.
              </p>
            </div>

            <Link
              href={enquiryUrl}
              className="enquiry-primary-button"
            >
              <span>Send Enquiry</span>
              <span className="enquiry-button-arrow" aria-hidden="true">
                →
              </span>
            </Link>

            <div className="enquiry-card-benefits">
              <div className="enquiry-benefit-item">
                <span className="enquiry-benefit-icon" aria-hidden="true">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11Z" />
                    <path d="m9 12 2 2 4-4" />
                  </svg>
                </span>

                <span>
                  <strong>Direct Supplier Enquiry</strong>
                  <small>Your requirement goes to the supplier</small>
                </span>
              </div>

              <div className="enquiry-benefit-item">
                <span className="enquiry-benefit-icon" aria-hidden="true">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="9" />
                    <path d="M12 7v5l3 2" />
                  </svg>
                </span>

                <span>
                  <strong>Discuss Price & Availability</strong>
                  <small>Confirm quantity, delivery and pricing</small>
                </span>
              </div>
            </div>

            <div className="enquiry-supplier-section">
              <div className="enquiry-supplier-avatar">
                {supplierName.charAt(0).toUpperCase()}
              </div>

              <div className="enquiry-supplier-details">
                <span className="enquiry-supplier-label">
                  SUPPLIER
                </span>

                <strong className="enquiry-supplier-name">
                  {supplierName}
                </strong>

                <span className="enquiry-supplier-location">
                  {supplierLocation}
                </span>
              </div>
            </div>

            <Link
              href={`/products/${encodeURIComponent(
                product.slug
              )}/supplier/${encodeURIComponent(
                supplierCompanySlug
              )}`}
              className="enquiry-view-supplier"
            >
              <span>View Supplier Profile</span>
              <span aria-hidden="true">↗</span>
            </Link>
          </aside>
        </section>

        {/* PRODUCT INFORMATION */}

        <section className="product-information-layout">
          <div className="product-information-main">
            {/* PRODUCT DESCRIPTION */}

            <div className="product-information-card min-w-0 max-w-full overflow-hidden">
              <h2>Product Description</h2>

              <div className="product-description-responsive">
                <ProductDescription
                  description={
                    product.description?.trim() ||
                    product.shortDescription?.trim() ||
                    "No product description available."
                  }
                  maxLength={350}
                />
              </div>
            </div>

            {/* MORE PRODUCTS FROM SUPPLIER */}

            {supplierProducts.length > 0 && (
              <section className="supplier-catalogue-section w-full min-w-0 max-w-full overflow-hidden">
                <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-xs font-bold uppercase tracking-[0.16em] text-violet-700">
                      Supplier catalogue
                    </p>

                    <h2 className="mt-1 text-xl font-extrabold text-slate-900 sm:text-2xl">
                      More Products From This Supplier
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                      Explore other products offered by {supplierName}.
                    </p>
                  </div>

                  {supplierIdentifier && (
                    <Link
                      href={`/suppliers/${encodeURIComponent(
                        supplierIdentifier
                      )}`}
                      className="shrink-0 text-sm font-bold text-violet-700 hover:text-violet-900"
                    >
                      View All →
                    </Link>
                  )}
                </div>

                <div className="supplier-products-scroll">
                  {supplierProducts.map((item) => {
                    const image = item.images?.find(
                      (url) =>
                        typeof url === "string" &&
                        url.trim() !== ""
                    );

                    return (
                      <article
                        key={item._id}
                        className="supplier-product-item"
                      >
                        <Link
                          href={`/products/${encodeURIComponent(
                            item.slug
                          )}`}
                          className="block h-full"
                        >
                          <div className="flex h-36 items-center justify-center overflow-hidden bg-slate-50 sm:h-40">
                            {image ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={image}
                                alt={item.name}
                                loading="lazy"
                                className="h-full w-full object-contain p-3 transition duration-300 hover:scale-105"
                              />
                            ) : (
                              <span className="px-4 text-center text-sm text-slate-400">
                                Product image unavailable
                              </span>
                            )}
                          </div>

                          <div className="p-3 sm:p-4">
                            <h3 className="line-clamp-2 min-h-10 text-sm font-bold leading-5 text-slate-800">
                              {item.name}
                            </h3>

                            <p className="mt-2 text-base font-extrabold text-slate-900">
                              {formatPrice(item.price)}
                              {item.unit && (
                                <span className="text-xs font-semibold text-slate-500">
                                  {" "}/ {item.unit}
                                </span>
                              )}
                            </p>

                            <p className="mt-3 border-t border-slate-100 pt-3 text-xs font-bold text-violet-700">
                              View product details →
                            </p>
                          </div>
                        </Link>
                      </article>
                    );
                  })}
                </div>

                <p className="mt-2 text-center text-xs text-slate-400 sm:hidden">
                  ← Swipe to explore more products →
                </p>
              </section>
            )}

            {/* COMBINED TABS: THREE SECTIONS IN ONE CARD */}

            <ProductDetailTabs
              customFields={customFieldData}
              specifications={specificationData}
              companyName={
                product.companyName ||
                product.seller?.companyName ||
                "Not provided"
              }
              city={
                product.location?.city ||
                product.seller?.city ||
                "Not provided"
              }
              state={
                product.location?.state ||
                product.seller?.state ||
                "Not provided"
              }
              country={product.location?.country || "India"}
            />
          </div>

          {/* SUPPLIER SIDEBAR */}

          <aside id="supplier" className="product-supplier-card">
            <span className="supplier-label">SUPPLIER</span>

            <h2>{supplierName}</h2>

            <p>{supplierLocation}</p>

            <div className="supplier-status">
              Verified Supplier
            </div>

            <hr />

            <p className="supplier-description">
              {product.companyName
                ? `${product.companyName} offers this product through the Advixio marketplace.`
                : "Trusted supplier offering quality products and industrial solutions."}
            </p>

            {product.seller?.email && (
              <p className="supplier-email">
                <strong>Email:</strong>{" "}
                {product.seller.email}
              </p>
            )}

            {product.seller?.phone && (
              <p className="supplier-phone">
                <strong>Phone:</strong>{" "}
                {product.seller.phone}
              </p>
            )}

            <Link
              href={`/products/${encodeURIComponent(
                product.slug
              )}/supplier/${encodeURIComponent(
                supplierCompanySlug
              )}`}
              className="supplier-contact-button"
            >
              Contact Supplier
              <span aria-hidden="true"> ↗</span>
            </Link>
          </aside>
        </section>

        {/* BOTTOM CTA */}

        <section className="product-bottom-cta">
          <div>
            <span>LOOKING FOR THIS PRODUCT?</span>

            <h2>Get the best price from suppliers</h2>

            <p>
              Send your requirement and connect directly with verified
              suppliers.
            </p>
          </div>

          <Link
            href={enquiryUrl}
            className="product-bottom-cta-link"
          >
            Send Your Requirement →
          </Link>
        </section>
      </main>

      {/* MOBILE FIXED ACTION BAR */}

      <div className="mobile-product-action-bar">
        <a
          href={phone ? `tel:+${phone}` : undefined}
          className={`mobile-action-call ${
            !phone ? "is-disabled" : ""
          }`}
          aria-disabled={!phone}
        >
          <span className="mobile-action-icon">☎</span>
          <span>Call</span>
        </a>

        <a
          href={
            phone
              ? `https://wa.me/${phone}?text=${whatsappMessage}`
              : undefined
          }
          target="_blank"
          rel="noopener noreferrer"
          className={`mobile-action-whatsapp ${
            !phone ? "is-disabled" : ""
          }`}
          aria-disabled={!phone}
        >
          <span className="mobile-action-icon">◉</span>
          <span>WhatsApp</span>
        </a>

        <Link
          href={enquiryUrl}
          className="mobile-action-enquiry"
        >
          <span className="mobile-action-icon">✉</span>
          <span>Enquiry</span>
        </Link>
      </div>

      <Footer />
    </>
  );
}
