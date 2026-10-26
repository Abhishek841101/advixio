

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
      return { data: null, error: "The supplier API returned an invalid response." };
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

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const result = await getSupplier(slug);
  const supplier = result.data?.supplier;

  if (!supplier) {
    return {
      title: "Supplier Profile | Advixio",
      description: "Explore suppliers and products on Advixio.",
    };
  }

  const companyName = supplier.companyName?.trim() || supplier.name || "Supplier";

  return {
    title: `${companyName} | Advixio`,
    description: `View ${companyName}'s company profile and listed products on Advixio.`,
  };
}

function formatPrice(price?: number, unit?: string) {
  if (price === undefined || price === null) return "Contact supplier for price";
  return `₹${price.toLocaleString("en-IN")}${unit ? ` / ${unit}` : ""}`;
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex min-w-0 items-start justify-between gap-4 border-b border-[#eee9f8] px-4 py-4 last:border-b-0">
      <span className="shrink-0 text-sm text-[#777181]">{label}</span>
      <strong className="break-words text-right text-sm font-semibold text-[#292333]">
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
        <main className="min-h-[65vh] bg-[#f8f7fb] px-5 py-20">
          <div className="mx-auto max-w-2xl rounded-3xl border border-red-100 bg-white p-8 shadow-[0_20px_60px_rgba(31,20,54,0.07)]">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-2xl text-red-600">
              !
            </div>
            <h1 className="text-2xl font-bold text-[#211a30]">Unable to load supplier</h1>
            <p className="mt-3 leading-7 text-[#6e687a]">{result.error}</p>
            <p className="mt-4 break-all rounded-xl bg-[#f8f6fc] p-3 text-xs text-[#817a8d]">
              API: {API_URL}/suppliers/{slug}
            </p>
            <Link
              href="/suppliers"
              className="mt-6 inline-flex rounded-xl bg-gradient-to-r from-[#5e2cd3] to-[#8257e8] px-5 py-3 text-sm font-bold text-white shadow-lg shadow-violet-200 transition hover:-translate-y-0.5 hover:shadow-xl"
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
  const companyName = supplier.companyName?.trim() || supplier.name || "Supplier";
  const location = [supplier.city, supplier.state].filter(Boolean).join(", ");
  const initials = companyName
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  return (
    <>
      <Navbar />

    <main className="supplier-profile-page min-h-screen bg-[#f7f6fa] text-[#211b2b]">
        {/* Breadcrumb */}
        
{/* Breadcrumb */}
<div className="border-b border-[#ece8f3] bg-white">
  <nav
    aria-label="Breadcrumb"
    className="mx-auto flex max-w-7xl flex-wrap items-center gap-2 px-5 py-4 text-sm text-[#8a8495]"
  >
    <Link href="/" className="transition hover:text-[#5e2cd3]">
      Home
    </Link>

    <span>/</span>

    <Link href="/products" className="transition hover:text-[#5e2cd3]">
      Products
    </Link>

    <span>/</span>

    <span className="max-w-[260px] truncate font-medium text-[#3a3148]">
      {companyName}
    </span>
  </nav>
</div>


        {/* Hero */}
        <section className="relative overflow-hidden border-b border-[#eae4f5] bg-white">
          <div className="pointer-events-none absolute -right-28 -top-36 h-96 w-96 rounded-full bg-[#eee5ff] blur-3xl" />
          <div className="pointer-events-none absolute -left-28 bottom-0 h-72 w-72 rounded-full bg-[#f6eefe] blur-3xl" />
          <div className="relative mx-auto max-w-7xl px-5 py-9 sm:py-12">
            <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
              <div className="min-w-0">
                <div className="rounded-[28px] border border-[#e9e2f6] bg-gradient-to-br from-white via-[#fdfbff] to-[#f3edff] p-5 shadow-[0_18px_55px_rgba(56,33,94,0.07)] sm:p-8">
                  <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
                    <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-[24px] bg-gradient-to-br from-[#5e2cd3] via-[#7141df] to-[#a18af4] text-3xl font-extrabold tracking-wide text-white shadow-xl shadow-violet-200 ring-4 ring-white">
                      {initials || "S"}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="mb-3 flex flex-wrap items-center gap-2">
                        <span className="rounded-full border border-[#e2d7fa] bg-white/90 px-3 py-1 text-[11px] font-extrabold uppercase tracking-[0.15em] text-[#5e2cd3]">
                          Supplier profile
                        </span>
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                          Listed on Advixio
                        </span>
                      </div>
                      <h1 className="break-words text-2xl font-extrabold leading-tight tracking-tight text-[#21172f] sm:text-3xl lg:text-[38px]">
                        {companyName}
                      </h1>
                      <p className="mt-3 text-sm leading-6 text-[#71697f]">
                        Contact person: <span className="font-semibold text-[#40364f]">{supplier.name}</span>
                      </p>
                      {location && (
                        <p className="mt-2 flex items-center gap-2 text-sm text-[#71697f]">
                          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-white text-[#6b3ad6] shadow-sm">⌖</span>
                          {location}
                        </p>
                      )}
                      <div className="mt-6 flex flex-wrap gap-3">
                        {supplier.email && (
                          <a
                            href={`mailto:${supplier.email}`}
                            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#5e2cd3] to-[#8053e5] px-5 py-3 text-sm font-bold text-white shadow-lg shadow-violet-200 transition hover:-translate-y-0.5 hover:shadow-xl"
                          >
                            <span>✉</span> Contact Supplier <span aria-hidden="true">↗</span>
                          </a>
                        )}
                        {supplier.phone && (
                          <a
                            href={`tel:${supplier.phone}`}
                            className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#ded5ee] bg-white px-5 py-3 text-sm font-bold text-[#4c2a8d] transition hover:border-[#bca7ed] hover:bg-[#f8f4ff]"
                          >
                            <span>☎</span> Call Supplier
                          </a>
                        )}
                        <a
                          href="#products"
                          className="inline-flex items-center justify-center gap-2 rounded-xl border border-transparent px-4 py-3 text-sm font-bold text-[#5e2cd3] transition hover:bg-white"
                        >
                          Explore products ↓
                        </a>
                      </div>
                    </div>
                  </div>
                  <div className="mt-8 grid grid-cols-2 gap-3 border-t border-[#e9e2f6] pt-5 sm:grid-cols-3">
                    <div className="rounded-2xl bg-white/90 p-4 ring-1 ring-[#eee8f7]">
                      <p className="text-xs font-semibold text-[#8a8297]">Products listed</p>
                      <p className="mt-1 text-2xl font-extrabold text-[#39215f]">{productCount}</p>
                    </div>
                    <div className="rounded-2xl bg-white/90 p-4 ring-1 ring-[#eee8f7]">
                      <p className="text-xs font-semibold text-[#8a8297]">Supplier location</p>
                      <p className="mt-1 line-clamp-2 text-base font-bold text-[#39215f]">{location || "Not provided"}</p>
                    </div>
                    <div className="col-span-2 rounded-2xl bg-white/90 p-4 ring-1 ring-[#eee8f7] sm:col-span-1">
                      <p className="text-xs font-semibold text-[#8a8297]">Member since</p>
                      <p className="mt-1 text-base font-bold text-[#39215f]">
                        {supplier.createdAt
                          ? new Date(supplier.createdAt).toLocaleDateString("en-IN", { month: "short", year: "numeric" })
                          : "Advixio supplier"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Trust strip */}
                <div className="mt-4 grid gap-3 sm:grid-cols-3">
                  {[
                    { icon: "◇", title: "Business enquiries", text: "Contact the supplier directly" },
                    { icon: "▦", title: "Product catalogue", text: `${productCount} listed ${productCount === 1 ? "product" : "products"}` },
                    { icon: "⌖", title: "Location details", text: location || "Location not provided" },
                  ].map((item) => (
                    <div key={item.title} className="flex items-center gap-3 rounded-2xl border border-[#ebe5f4] bg-white p-4">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#f1eaff] text-lg font-bold text-[#6532d2]">
                        {item.icon}
                      </span>
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-[#352943]">{item.title}</p>
                        <p className="mt-0.5 truncate text-xs text-[#898193]">{item.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Contact panel */}
              <aside className="h-fit rounded-[26px] border border-[#e9e2f5] bg-white p-5 shadow-[0_18px_55px_rgba(56,33,94,0.07)] sm:p-6 xl:sticky xl:top-24">
                <div className="flex items-start gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#f0e9ff] text-xl text-[#5e2cd3]">↗</div>
                  <div>
                    <h2 className="text-lg font-extrabold text-[#241b32]">Get in touch</h2>
                    <p className="mt-1 text-sm leading-5 text-[#898193]">Reach out to this supplier for product details and pricing.</p>
                  </div>
                </div>
                <div className="my-5 rounded-2xl border border-[#e8defb] bg-gradient-to-br from-[#faf7ff] to-[#f2eaff] p-4">
                  <p className="text-xs font-bold uppercase tracking-wider text-[#7c62a9]">Supplier</p>
                  <p className="mt-1 break-words text-sm font-extrabold text-[#382354]">{companyName}</p>
                  <p className="mt-2 text-xs text-[#81758f]">Mention your product requirement when contacting the supplier.</p>
                </div>
                <div className="space-y-3">
                  {supplier.email ? (
                    <a href={`mailto:${supplier.email}`} className="flex w-full items-center justify-between rounded-xl bg-[#5e2cd3] px-4 py-3.5 text-sm font-bold text-white transition hover:bg-[#4c1db8]">
                      <span>Email supplier</span><span>↗</span>
                    </a>
                  ) : (
                    <div className="rounded-xl bg-[#f8f6fb] px-4 py-3 text-sm text-[#8b8495]">Email not provided</div>
                  )}
                  {supplier.phone ? (
                    <a href={`tel:${supplier.phone}`} className="flex w-full items-center justify-between rounded-xl border border-[#e4dcef] px-4 py-3.5 text-sm font-bold text-[#4b2b82] transition hover:bg-[#f8f4ff]">
                      <span>Call supplier</span><span>☎</span>
                    </a>
                  ) : (
                    <div className="rounded-xl bg-[#f8f6fb] px-4 py-3 text-sm text-[#8b8495]">Phone not provided</div>
                  )}
                </div>
                <p className="mt-4 text-center text-[11px] leading-5 text-[#9b94a5]">
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
                    <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#7545d7]">Catalogue</p>
                    <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-[#261c35] sm:text-3xl">
                      Products by {companyName}
                    </h2>
                    <p className="mt-2 text-sm text-[#81798e]">Explore products currently listed by this supplier.</p>
                  </div>
                  <span className="rounded-full border border-[#e5daf8] bg-white px-4 py-2 text-sm font-bold text-[#6230ce]">
                    {productCount} {productCount === 1 ? "product" : "products"}
                  </span>
                </div>

                {products.length === 0 ? (
                  <div className="rounded-3xl border border-dashed border-[#d9cbed] bg-white px-6 py-16 text-center">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#f2ebff] text-2xl text-[#7542d8]">▦</div>
                    <h3 className="mt-5 text-lg font-extrabold text-[#2c2239]">No active products yet</h3>
                    <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#898193]">
                      This supplier has not listed any active products. Browse the full catalogue to discover more.
                    </p>
                    <Link href="/products" className="mt-5 inline-flex rounded-xl bg-[#5e2cd3] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#4c1db8]">
                      Browse all products →
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
                    {products.map((product) => {
                      const image = product.images?.[0];
                      const productLocation = [product.location?.city, product.location?.state]
                        .filter(Boolean)
                        .join(", ");

                      return (
                        <article
                          key={product._id}
                          className="group overflow-hidden rounded-[22px] border border-[#ebe5f4] bg-white shadow-[0_5px_22px_rgba(35,22,58,0.035)] transition duration-300 hover:-translate-y-1 hover:border-[#d4c2f5] hover:shadow-[0_18px_42px_rgba(70,38,128,0.12)]"
                        >
                          <Link href={`/products/${product.slug}`} className="block">
                            <div className="relative flex h-56 items-center justify-center overflow-hidden bg-gradient-to-br from-[#f6f2fc] to-[#eae2f8]">
                              <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/50 blur-2xl" />
                              {image ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                  src={image}
                                  alt={product.name}
                                  className="relative h-full w-full object-contain p-5 transition duration-500 group-hover:scale-105"
                                />
                              ) : (
                                <div className="relative flex flex-col items-center gap-2 text-[#9a8ab4]">
                                  <span className="text-4xl">▧</span>
                                  <span className="text-xs font-semibold">Product image unavailable</span>
                                </div>
                              )}
                              {product.category?.name && (
                                <span className="absolute left-4 top-4 max-w-[80%] truncate rounded-full border border-white/80 bg-white/90 px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-wide text-[#6331ce] shadow-sm backdrop-blur">
                                  {product.category.name}
                                </span>
                              )}
                            </div>
                            <div className="p-5">
                              <h3 className="line-clamp-2 min-h-12 text-base font-extrabold leading-6 text-[#2b2238] transition group-hover:text-[#5e2cd3]">
                                {product.name}
                              </h3>
                              {product.shortDescription && (
                                <p className="mt-2 line-clamp-2 min-h-10 text-sm leading-5 text-[#898193]">
                                  {product.shortDescription}
                                </p>
                              )}
                              <div className="mt-4 flex items-end justify-between gap-3 border-t border-[#f0ebf6] pt-4">
                                <div className="min-w-0">
                                  <p className="text-[10px] font-bold uppercase tracking-wider text-[#9b93a7]">Price</p>
                                  <p className="mt-1 break-words text-sm font-extrabold text-[#37234f]">
                                    {formatPrice(product.price, product.unit)}
                                  </p>
                                </div>
                                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#f1eaff] text-lg font-bold text-[#6230ce] transition group-hover:bg-[#5e2cd3] group-hover:text-white">
                                  ↗
                                </span>
                              </div>
                              {productLocation && (
                                <p className="mt-4 flex items-center gap-2 text-xs text-[#898193]">
                                  <span className="text-[#7542d8]">⌖</span>{productLocation}
                                </p>
                              )}
                              <div className="mt-4 border-t border-[#f0ebf6] pt-4 text-sm font-extrabold text-[#6331ce]">
                                View product details <span className="transition group-hover:ml-1">→</span>
                              </div>
                            </div>
                          </Link>
                        </article>
                      );
                    })}
                  </div>
                )}
              </section>

              <section className="mt-8 rounded-[24px] border border-[#ebe5f4] bg-white p-5 shadow-[0_5px_22px_rgba(35,22,58,0.035)] sm:p-7">
                <div className="mb-5 flex items-center gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#f1eaff] text-xl text-[#6331ce]">▤</span>
                  <div>
                    <h2 className="text-xl font-extrabold text-[#2b2238]">Supplier information</h2>
                    <p className="mt-1 text-sm text-[#898193]">Contact and location details available on this profile.</p>
                  </div>
                </div>
                <div className="overflow-hidden rounded-2xl border border-[#eee8f7]">
                  <InfoRow label="Company name" value={companyName} />
                  <InfoRow label="Contact person" value={supplier.name} />
                  <InfoRow label="Email address" value={supplier.email || ""} />
                  <InfoRow label="Phone number" value={supplier.phone || ""} />
                  <InfoRow label="City" value={supplier.city || ""} />
                  <InfoRow label="State" value={supplier.state || ""} />
                  <InfoRow
                    label="Member since"
                    value={supplier.createdAt ? new Date(supplier.createdAt).toLocaleDateString("en-IN") : ""}
                  />
                </div>
              </section>
            </div>

            {/* Sidebar */}
            <aside className="space-y-5 lg:sticky lg:top-24">
              <div className="rounded-[22px] border border-[#ebe5f4] bg-white p-5 shadow-[0_5px_22px_rgba(35,22,58,0.035)]">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f1eaff] text-lg text-[#6331ce]">✦</span>
                  <h3 className="text-base font-extrabold text-[#2b2238]">Profile overview</h3>
                </div>
                <div className="mt-4 space-y-3">
                  <div className="flex items-center justify-between gap-3 rounded-xl bg-[#faf8fd] p-3">
                    <span className="text-sm text-[#898193]">Listed products</span>
                    <strong className="text-sm font-extrabold text-[#5e2cd3]">{productCount}</strong>
                  </div>
                  <div className="flex items-center justify-between gap-3 rounded-xl bg-[#faf8fd] p-3">
                    <span className="text-sm text-[#898193]">Location</span>
                    <strong className="max-w-[55%] text-right text-sm font-bold text-[#3b3049]">{location || "Not provided"}</strong>
                  </div>
                </div>
              </div>

              <div className="rounded-[22px] border border-[#ebe5f4] bg-white p-5 shadow-[0_5px_22px_rgba(35,22,58,0.035)]">
                <h3 className="text-base font-extrabold text-[#2b2238]">Before placing an order</h3>
                <ul className="mt-4 space-y-3">
                  {[
                    "Confirm current product price",
                    "Ask about minimum order quantity",
                    "Verify delivery timeline",
                    "Agree on payment terms",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-sm leading-5 text-[#777181]">
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#f0e9ff] text-xs font-extrabold text-[#6331ce]">✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="overflow-hidden rounded-[22px] bg-gradient-to-br from-[#4d20b6] via-[#6733d2] to-[#8b60eb] p-5 text-white shadow-xl shadow-violet-200">
                <div className="text-2xl">✉</div>
                <h3 className="mt-3 text-lg font-extrabold">Have a requirement?</h3>
                <p className="mt-2 text-sm leading-6 text-white/80">
                  Contact the supplier to discuss product specifications, pricing and availability.
                </p>
                {supplier.email ? (
                  <a href={`mailto:${supplier.email}`} className="mt-5 inline-flex w-full items-center justify-center rounded-xl bg-white px-4 py-3 text-sm font-extrabold text-[#5e2cd3] transition hover:bg-[#f4efff]">
                    Contact supplier →
                  </a>
                ) : (
                  <p className="mt-4 rounded-xl bg-white/10 px-3 py-3 text-sm text-white/80">Supplier email is not available.</p>
                )}
              </div>

              <div className="rounded-[22px] border border-[#ebe5f4] bg-white p-5">
                <h3 className="text-base font-extrabold text-[#2b2238]">Discover more</h3>
                <p className="mt-2 text-sm leading-6 text-[#898193]">Explore other suppliers and products listed on Advixio.</p>
                <Link href="/suppliers" className="mt-4 inline-flex w-full items-center justify-center rounded-xl border border-[#ded2f5] px-4 py-3 text-sm font-extrabold text-[#6331ce] transition hover:bg-[#f8f4ff]">
                  Browse suppliers →
                </Link>
                <Link href="/products" className="mt-2 inline-flex w-full items-center justify-center rounded-xl bg-[#f1eaff] px-4 py-3 text-sm font-extrabold text-[#6331ce] transition hover:bg-[#e8dcff]">
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
