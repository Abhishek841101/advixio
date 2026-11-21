
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

type Props = {
  params: Promise<{ slug: string }>;
};

type Supplier = {
  _id: string;
  name: string;
  companyName?: string;
  email?: string;
  phone?: string;
  city?: string;
  state?: string;
  profileImage?: string;
  createdAt?: string;
};

type Product = {
  _id: string;
  name: string;
  slug: string;
  shortDescription?: string;
  price?: number;
  unit?: string;
  images?: string[];
  category?: { name?: string; slug?: string } | null;
  location?: { city?: string; state?: string; country?: string };
};

type SupplierResponse = {
  success: boolean;
  message?: string;
  data?: {
    supplier: Supplier;
    productCount: number;
    products: Product[];
  };
};

const API_URL = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"
).replace(/\/+$/, "");

type SupplierResult = {
  data: {
    supplier: Supplier;
    productCount: number;
    products: Product[];
  } | null;
  error: string | null;
};

async function getSupplier(slug: string): Promise<SupplierResult> {
  const url = `${API_URL}/suppliers/${encodeURIComponent(slug)}`;

  try {
    const response = await fetch(url, { cache: "no-store" });

    if (response.status === 404) {
      return { data: null, error: null };
    }

    const responseText = await response.text();

    if (!response.ok) {
      console.error("Supplier API request failed:", {
        url,
        status: response.status,
        response: responseText,
      });

      return {
        data: null,
        error: `Supplier API returned HTTP ${response.status}. Check the backend logs.`,
      };
    }

    let result: SupplierResponse;

    try {
      result = JSON.parse(responseText) as SupplierResponse;
    } catch {
      console.error("Supplier API returned invalid JSON:", responseText);

      return {
        data: null,
        error: "The supplier API returned an invalid response.",
      };
    }

    if (!result.success || !result.data?.supplier) {
      return {
        data: null,
        error: result.message || "Supplier information was not returned.",
      };
    }

    const products = Array.isArray(result.data.products)
      ? result.data.products
      : [];

    return {
      data: {
        supplier: result.data.supplier,
        products,
        productCount: products.length,
      },
      error: null,
    };
  } catch (error) {
    console.error("Supplier profile fetch error:", {
      url,
      error: error instanceof Error ? error.message : String(error),
    });

    return {
      data: null,
      error:
        "Could not connect to the supplier API. Check that the backend is running and NEXT_PUBLIC_API_URL is correct.",
    };
  }
}

export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  const { slug } = await params;
  const result = await getSupplier(slug);
  const supplier = result.data?.supplier;

  if (!supplier) {
    return {
      title: "Supplier Profile | Advixio",
      description: "Explore suppliers and products on Advixio.",
    };
  }

  const companyName =
    supplier.companyName?.trim() || supplier.name || "Supplier";

  return {
    title: `${companyName} | Advixio`,
    description: `View ${companyName}'s company profile and listed products on Advixio.`,
  };
}

function formatPrice(price?: number, unit?: string) {
  if (price === undefined || price === null) {
    return "Contact supplier for price";
  }

  return `₹${price.toLocaleString("en-IN")}${unit ? ` / ${unit}` : ""}`;
}

function InfoRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex min-w-0 items-start justify-between gap-4 border-b border-[#BFDBFE] px-4 py-4 last:border-b-0">
      <span className="shrink-0 text-sm text-[#1D4ED8]">{label}</span>

      <strong className="break-words text-right text-sm font-semibold text-[#1E3A8A]">
        {value || "Not provided"}
      </strong>
    </div>
  );
}

export default async function SupplierProfilePage({ params }: Props) {
  const { slug } = await params;
  const result = await getSupplier(slug);

  if (!result.data) {
    if (!result.error) notFound();

    return (
      <>
        <Navbar />

        <main className="min-h-[65vh] bg-[#FFFFFF] px-5 py-20">
          <div className="mx-auto max-w-2xl rounded-3xl border border-red-100 bg-white p-8 shadow-[0_20px_60px_rgba(23, 37, 84, 0.07)]">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-2xl text-red-600">
              !
            </div>

            <h1 className="text-2xl font-bold text-[#1E3A8A]">
              Unable to load supplier
            </h1>

            <p className="mt-3 leading-7 text-[#1D4ED8]">
              {result.error}
            </p>

            <p className="mt-4 break-all rounded-xl bg-[#FFFFFF] p-3 text-xs text-[#2563EB]">
              API: {API_URL}/suppliers/{slug}
            </p>

            <Link
              href="/suppliers"
              className="mt-6 inline-flex rounded-xl bg-gradient-to-r from-[#2563EB] to-[#3B82F6] px-5 py-3 text-sm font-bold text-white shadow-lg shadow-violet-200 transition hover:-translate-y-0.5 hover:shadow-xl"
            >
              ← Back to suppliers
            </Link>
          </div>
        </main>

        <Footer />
      </>
    );
  }

  const { supplier, products, productCount } = result.data;

  const companyName =
    supplier.companyName?.trim() || supplier.name || "Supplier";

  const location = [supplier.city, supplier.state]
    .filter(Boolean)
    .join(", ");

  const initials = companyName
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  const profileImage = supplier.profileImage?.trim();

  return (
    <>
      <Navbar />

      <main className="supplier-profile-page min-h-screen bg-[#FFFFFF] text-[#1E3A8A]">
        {/* Breadcrumb */}
        <div className="border-b border-[#BFDBFE] bg-white">
          <nav
            aria-label="Breadcrumb"
            className="mx-auto flex max-w-7xl flex-wrap items-center gap-2 px-5 py-4 text-sm text-[#3B82F6]"
          >
            <Link href="/" className="transition hover:text-[#2563EB]">
              Home
            </Link>

            <span>/</span>

            <Link
              href="/products"
              className="transition hover:text-[#2563EB]"
            >
              Products
            </Link>

            <span>/</span>

            <span className="max-w-[260px] truncate font-medium text-[#172554]">
              {companyName}
            </span>
          </nav>
        </div>

        {/* Hero */}
        <section className="relative overflow-hidden border-b border-[#BFDBFE] bg-white">
          <div className="pointer-events-none absolute -right-28 -top-36 h-96 w-96 rounded-full bg-[#FFEDD5] blur-3xl" />

          <div className="pointer-events-none absolute -left-28 bottom-0 h-72 w-72 rounded-full bg-[#93C5FD] blur-3xl" />

          <div className="relative mx-auto max-w-7xl px-5 py-9 sm:py-12">
            <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
              <div className="min-w-0">
                <div className="rounded-[28px] border border-[#BFDBFE] bg-gradient-to-br from-white via-[#FFFFFF] to-[#FFEDD5] p-5 shadow-[0_18px_55px_rgba(23, 37, 84, 0.07)] sm:p-8">
                  <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
                    {/* Supplier Profile Image */}
                    <div className="relative flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-[24px] bg-gradient-to-br from-[#2563EB] via-[#3B82F6] to-[#93C5FD] text-3xl font-extrabold tracking-wide text-white shadow-xl shadow-violet-200 ring-4 ring-white">
                      {profileImage ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={profileImage}
                          alt={`${companyName} profile`}
                          className="h-full w-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        initials || "S"
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="mb-3 flex flex-wrap items-center gap-2">
                        <span className="rounded-full border border-[#93C5FD] bg-white/90 px-3 py-1 text-[11px] font-extrabold uppercase tracking-[0.15em] text-[#2563EB]">
                          Supplier profile
                        </span>

                        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                          Listed on Advixio
                        </span>
                      </div>

                      <h1 className="break-words text-2xl font-extrabold leading-tight tracking-tight text-[#1E3A8A] sm:text-3xl lg:text-[38px]">
                        {companyName}
                      </h1>

                      <p className="mt-3 text-sm leading-6 text-[#1D4ED8]">
                        Contact person:{" "}
                        <span className="font-semibold text-[#172554]">
                          {supplier.name}
                        </span>
                      </p>

                      {location && (
                        <p className="mt-2 flex items-center gap-2 text-sm text-[#1D4ED8]">
                          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-white text-[#2563EB] shadow-sm">
                            ⌖
                          </span>
                          {location}
                        </p>
                      )}

                      <div className="mt-6 flex flex-wrap gap-3">
                        {supplier.email && (
                          <a
                            href={`mailto:${supplier.email}`}
                            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#2563EB] to-[#3B82F6] px-5 py-3 text-sm font-bold text-white shadow-lg shadow-violet-200 transition hover:-translate-y-0.5 hover:shadow-xl"
                          >
                            <span>✉</span> Contact Supplier{" "}
                            <span aria-hidden="true">↗</span>
                          </a>
                        )}

                        {supplier.phone && (
                          <a
                            href={`tel:${supplier.phone}`}
                            className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#BFDBFE] bg-white px-5 py-3 text-sm font-bold text-[#1E3A8A] transition hover:border-[#93C5FD] hover:bg-[#FFFFFF]"
                          >
                            <span>☎</span> Call Supplier
                          </a>
                        )}

                        <a
                          href="#products"
                          className="inline-flex items-center justify-center gap-2 rounded-xl border border-transparent px-4 py-3 text-sm font-bold text-[#2563EB] transition hover:bg-white"
                        >
                          Explore products ↓
                        </a>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 grid grid-cols-2 gap-3 border-t border-[#BFDBFE] pt-5 sm:grid-cols-3">
                    <div className="rounded-2xl bg-white/90 p-4 ring-1 ring-[#BFDBFE]">
                      <p className="text-xs font-semibold text-[#3B82F6]">
                        Products listed
                      </p>
                      <p className="mt-1 text-2xl font-extrabold text-[#172554]">
                        {productCount}
                      </p>
                    </div>

                    <div className="rounded-2xl bg-white/90 p-4 ring-1 ring-[#BFDBFE]">
                      <p className="text-xs font-semibold text-[#3B82F6]">
                        Supplier location
                      </p>
                      <p className="mt-1 line-clamp-2 text-base font-bold text-[#172554]">
                        {location || "Not provided"}
                      </p>
                    </div>

                    <div className="col-span-2 rounded-2xl bg-white/90 p-4 ring-1 ring-[#BFDBFE] sm:col-span-1">
                      <p className="text-xs font-semibold text-[#3B82F6]">
                        Member since
                      </p>
                      <p className="mt-1 text-base font-bold text-[#172554]">
                        {supplier.createdAt
                          ? new Date(supplier.createdAt).toLocaleDateString(
                              "en-IN",
                              { month: "short", year: "numeric" }
                            )
                          : "Advixio supplier"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Trust strip */}
                <div className="mt-4 grid gap-3 sm:grid-cols-3">
                  {[
                    {
                      icon: "◇",
                      title: "Business enquiries",
                      text: "Contact the supplier directly",
                    },
                    {
                      icon: "▦",
                      title: "Product catalogue",
                      text: `${productCount} listed ${productCount === 1 ? "product" : "products"}`,
                    },
                    {
                      icon: "⌖",
                      title: "Location details",
                      text: location || "Location not provided",
                    },
                  ].map((item) => (
                    <div
                      key={item.title}
                      className="flex items-center gap-3 rounded-2xl border border-[#BFDBFE] bg-white p-4"
                    >
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#FFEDD5] text-lg font-bold text-[#2563EB]">
                        {item.icon}
                      </span>

                      <div className="min-w-0">
                        <p className="text-sm font-bold text-[#172554]">
                          {item.title}
                        </p>
                        <p className="mt-0.5 truncate text-xs text-[#2563EB]">
                          {item.text}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Contact panel */}
              <aside className="h-fit rounded-[26px] border border-[#BFDBFE] bg-white p-5 shadow-[0_18px_55px_rgba(23, 37, 84, 0.07)] sm:p-6 xl:sticky xl:top-24">
                <div className="flex items-start gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#FFEDD5] text-xl text-[#2563EB]">
                    ↗
                  </div>

                  <div>
                    <h2 className="text-lg font-extrabold text-[#1E3A8A]">
                      Get in touch
                    </h2>
                    <p className="mt-1 text-sm leading-5 text-[#2563EB]">
                      Reach out to this supplier for product details and pricing.
                    </p>
                  </div>
                </div>

                <div className="my-5 rounded-2xl border border-[#93C5FD] bg-gradient-to-br from-[#FFFFFF] to-[#FFEDD5] p-4">
                  <p className="text-xs font-bold uppercase tracking-wider text-[#2563EB]">
                    Supplier
                  </p>
                  <p className="mt-1 break-words text-sm font-extrabold text-[#172554]">
                    {companyName}
                  </p>
                  <p className="mt-2 text-xs text-[#2563EB]">
                    Mention your product requirement when contacting the supplier.
                  </p>
                </div>

                <div className="space-y-3">
                  {supplier.email ? (
                    <a
                      href={`mailto:${supplier.email}`}
                      className="flex w-full items-center justify-between rounded-xl bg-[#2563EB] px-4 py-3.5 text-sm font-bold text-white transition hover:bg-[#1D4ED8]"
                    >
                      <span>Email supplier</span>
                      <span>↗</span>
                    </a>
                  ) : (
                    <div className="rounded-xl bg-[#FFFFFF] px-4 py-3 text-sm text-[#3B82F6]">
                      Email not provided
                    </div>
                  )}

                  {supplier.phone ? (
                    <a
                      href={`tel:${supplier.phone}`}
                      className="flex w-full items-center justify-between rounded-xl border border-[#BFDBFE] px-4 py-3.5 text-sm font-bold text-[#1E3A8A] transition hover:bg-[#FFFFFF]"
                    >
                      <span>Call supplier</span>
                      <span>☎</span>
                    </a>
                  ) : (
                    <div className="rounded-xl bg-[#FFFFFF] px-4 py-3 text-sm text-[#3B82F6]">
                      Phone not provided
                    </div>
                  )}
                </div>

                <p className="mt-4 text-center text-[11px] leading-5 text-[#3B82F6]">
                  Confirm price, minimum order quantity and delivery terms directly before placing an order.
                </p>
              </aside>
            </div>
          </div>
        </section>

        {/* Main content */}
        <section className="mx-auto max-w-7xl px-5 py-10 sm:py-12">
          <div className="grid items-start gap-7 lg:grid-cols-[minmax(0,1fr)_300px]">
            <div className="min-w-0">
              <section id="products" className="scroll-mt-28">
                <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
                  <div>
                    <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#3B82F6]">
                      Catalogue
                    </p>

                    <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-[#1E3A8A] sm:text-3xl">
                      Products by {companyName}
                    </h2>

                    <p className="mt-2 text-sm text-[#2563EB]">
                      Explore products currently listed by this supplier.
                    </p>
                  </div>

                  <span className="rounded-full border border-[#93C5FD] bg-white px-4 py-2 text-sm font-bold text-[#2563EB]">
                    {productCount} {productCount === 1 ? "product" : "products"}
                  </span>
                </div>

                {products.length === 0 ? (
                  <div className="rounded-3xl border border-dashed border-[#BFDBFE] bg-white px-6 py-16 text-center">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#FFEDD5] text-2xl text-[#3B82F6]">
                      ▦
                    </div>

                    <h3 className="mt-5 text-lg font-extrabold text-[#1E3A8A]">
                      No active products yet
                    </h3>

                    <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#2563EB]">
                      This supplier has not listed any active products. Browse the full catalogue to discover more.
                    </p>

                    <Link
                      href="/products"
                      className="mt-5 inline-flex rounded-xl bg-[#2563EB] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#1D4ED8]"
                    >
                      Browse all products →
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
                    {products.map((product) => {
                      const image = product.images?.[0];

                      const productLocation = [
                        product.location?.city,
                        product.location?.state,
                      ]
                        .filter(Boolean)
                        .join(", ");

                      return (
                        <article
                          key={product._id}
                          className="group overflow-hidden rounded-[22px] border border-[#BFDBFE] bg-white shadow-[0_5px_22px_rgba(23, 37, 84, 0.035)] transition duration-300 hover:-translate-y-1 hover:border-[#93C5FD] hover:shadow-[0_18px_42px_rgba(30, 58, 138, 0.12)]"
                        >
                          <Link
                            href={`/products/${product.slug}`}
                            className="block"
                          >
                            <div className="relative flex h-56 items-center justify-center overflow-hidden bg-gradient-to-br from-[#93C5FD] to-[#93C5FD]">
                              <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/50 blur-2xl" />

                              {image ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                  src={image}
                                  alt={product.name}
                                  className="relative h-full w-full object-contain p-5 transition duration-500 group-hover:scale-105"
                                />
                              ) : (
                                <div className="relative flex flex-col items-center gap-2 text-[#3B82F6]">
                                  <span className="text-4xl">▧</span>
                                  <span className="text-xs font-semibold">
                                    Product image unavailable
                                  </span>
                                </div>
                              )}

                              {product.category?.name && (
                                <span className="absolute left-4 top-4 max-w-[80%] truncate rounded-full border border-white/80 bg-white/90 px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-wide text-[#2563EB] shadow-sm backdrop-blur">
                                  {product.category.name}
                                </span>
                              )}
                            </div>

                            <div className="p-5">
                              <h3 className="line-clamp-2 min-h-12 text-base font-extrabold leading-6 text-[#1E3A8A] transition group-hover:text-[#2563EB]">
                                {product.name}
                              </h3>

                              {product.shortDescription && (
                                <p className="mt-2 line-clamp-2 min-h-10 text-sm leading-5 text-[#2563EB]">
                                  {product.shortDescription}
                                </p>
                              )}

                              <div className="mt-4 flex items-end justify-between gap-3 border-t border-[#BFDBFE] pt-4">
                                <div className="min-w-0">
                                  <p className="text-[10px] font-bold uppercase tracking-wider text-[#3B82F6]">
                                    Price
                                  </p>

                                  <p className="mt-1 break-words text-sm font-extrabold text-[#172554]">
                                    {formatPrice(product.price, product.unit)}
                                  </p>
                                </div>

                                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#FFEDD5] text-lg font-bold text-[#2563EB] transition group-hover:bg-[#2563EB] group-hover:text-white">
                                  ↗
                                </span>
                              </div>

                              {productLocation && (
                                <p className="mt-4 flex items-center gap-2 text-xs text-[#2563EB]">
                                  <span className="text-[#3B82F6]">⌖</span>
                                  {productLocation}
                                </p>
                              )}

                              <div className="mt-4 border-t border-[#BFDBFE] pt-4 text-sm font-extrabold text-[#2563EB]">
                                View product details{" "}
                                <span className="transition group-hover:ml-1">
                                  →
                                </span>
                              </div>
                            </div>
                          </Link>
                        </article>
                      );
                    })}
                  </div>
                )}
              </section>

              {/* Supplier information */}
              <section className="mt-8 rounded-[24px] border border-[#BFDBFE] bg-white p-5 shadow-[0_5px_22px_rgba(23, 37, 84, 0.035)] sm:p-7">
                <div className="mb-5 flex items-center gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#FFEDD5] text-xl text-[#2563EB]">
                    ▤
                  </span>

                  <div>
                    <h2 className="text-xl font-extrabold text-[#1E3A8A]">
                      Supplier information
                    </h2>
                    <p className="mt-1 text-sm text-[#2563EB]">
                      Contact and location details available on this profile.
                    </p>
                  </div>
                </div>

                <div className="overflow-hidden rounded-2xl border border-[#BFDBFE]">
                  <InfoRow label="Company name" value={companyName} />
                  <InfoRow label="Contact person" value={supplier.name} />
                  <InfoRow label="Email address" value={supplier.email || ""} />
                  <InfoRow label="Phone number" value={supplier.phone || ""} />
                  <InfoRow label="City" value={supplier.city || ""} />
                  <InfoRow label="State" value={supplier.state || ""} />

                  <InfoRow
                    label="Member since"
                    value={
                      supplier.createdAt
                        ? new Date(supplier.createdAt).toLocaleDateString(
                            "en-IN"
                          )
                        : ""
                    }
                  />
                </div>
              </section>
            </div>

            {/* Sidebar */}
            <aside className="space-y-5 lg:sticky lg:top-24">
              <div className="rounded-[22px] border border-[#BFDBFE] bg-white p-5 shadow-[0_5px_22px_rgba(23, 37, 84, 0.035)]">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FFEDD5] text-lg text-[#2563EB]">
                    ✦
                  </span>

                  <h3 className="text-base font-extrabold text-[#1E3A8A]">
                    Profile overview
                  </h3>
                </div>

                <div className="mt-4 space-y-3">
                  <div className="flex items-center justify-between gap-3 rounded-xl bg-[#FFFFFF] p-3">
                    <span className="text-sm text-[#2563EB]">
                      Listed products
                    </span>

                    <strong className="text-sm font-extrabold text-[#2563EB]">
                      {productCount}
                    </strong>
                  </div>

                  <div className="flex items-center justify-between gap-3 rounded-xl bg-[#FFFFFF] p-3">
                    <span className="text-sm text-[#2563EB]">Location</span>

                    <strong className="max-w-[55%] text-right text-sm font-bold text-[#172554]">
                      {location || "Not provided"}
                    </strong>
                  </div>
                </div>
              </div>

              <div className="rounded-[22px] border border-[#BFDBFE] bg-white p-5 shadow-[0_5px_22px_rgba(23, 37, 84, 0.035)]">
                <h3 className="text-base font-extrabold text-[#1E3A8A]">
                  Before placing an order
                </h3>

                <ul className="mt-4 space-y-3">
                  {[
                    "Confirm current product price",
                    "Ask about minimum order quantity",
                    "Verify delivery timeline",
                    "Agree on payment terms",
                  ].map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-2.5 text-sm leading-5 text-[#1D4ED8]"
                    >
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#FFEDD5] text-xs font-extrabold text-[#2563EB]">
                        ✓
                      </span>

                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="overflow-hidden rounded-[22px] bg-gradient-to-br from-[#1D4ED8] via-[#2563EB] to-[#60A5FA] p-5 text-white shadow-xl shadow-violet-200">
                <div className="text-2xl">✉</div>

                <h3 className="mt-3 text-lg font-extrabold">
                  Have a requirement?
                </h3>

                <p className="mt-2 text-sm leading-6 text-white/80">
                  Contact the supplier to discuss product specifications, pricing and availability.
                </p>

                {supplier.email ? (
                  <a
                    href={`mailto:${supplier.email}`}
                    className="mt-5 inline-flex w-full items-center justify-center rounded-xl bg-white px-4 py-3 text-sm font-extrabold text-[#2563EB] transition hover:bg-[#FFEDD5]"
                  >
                    Contact supplier →
                  </a>
                ) : (
                  <p className="mt-4 rounded-xl bg-white/10 px-3 py-3 text-sm text-white/80">
                    Supplier email is not available.
                  </p>
                )}
              </div>

              <div className="rounded-[22px] border border-[#BFDBFE] bg-white p-5">
                <h3 className="text-base font-extrabold text-[#1E3A8A]">
                  Discover more
                </h3>

                <p className="mt-2 text-sm leading-6 text-[#2563EB]">
                  Explore other suppliers and products listed on Advixio.
                </p>

                <Link
                  href="/suppliers"
                  className="mt-4 inline-flex w-full items-center justify-center rounded-xl border border-[#93C5FD] px-4 py-3 text-sm font-extrabold text-[#2563EB] transition hover:bg-[#FFFFFF]"
                >
                  Browse suppliers →
                </Link>

                <Link
                  href="/products"
                  className="mt-2 inline-flex w-full items-center justify-center rounded-xl bg-[#FFEDD5] px-4 py-3 text-sm font-extrabold text-[#2563EB] transition hover:bg-[#FFEDD5]"
                >
                  Browse products →
                </Link>
              </div>
            </aside>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
