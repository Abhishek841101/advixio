
"use client";

import Link from "next/link";
import { useEffect, useState, type FormEvent } from "react";

type Product = {
  _id: string;
  name: string;
  slug: string;
  shortDescription?: string;
  description?: string;
  images?: string[];
  price?: number;
  unit?: string;
  seller?: {
    _id?: string;
    name?: string;
    companyName?: string;
    phone?: string;
    email?: string;
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

type Props = {
  slug: string;
};

const API_URL = (
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:5000/api"
).replace(/\/+$/, "");

function formatPrice(price?: number) {
  if (price == null || !Number.isFinite(price)) {
    return "Price on Request";
  }

  return `₹${price.toLocaleString("en-IN")}`;
}

function getSupplierName(product: Product) {
  return (
    product.companyName?.trim() ||
    product.seller?.companyName?.trim() ||
    product.seller?.name?.trim() ||
    "Supplier"
  );
}

function getSupplierPhone(product: Product) {
  return product.seller?.phone?.trim() || "";
}

function getWhatsAppNumber(phone: string) {
  let digits = phone.replace(/\D/g, "");

  if (digits.startsWith("00")) {
    digits = digits.slice(2);
  }

  // Indian 10-digit mobile number
  if (digits.length === 10) {
    digits = `91${digits}`;
  } else if (digits.length === 11 && digits.startsWith("0")) {
    digits = `91${digits.slice(1)}`;
  }

  // Only return a valid-looking international number.
  if (digits.length < 10 || digits.length > 15) {
    return "";
  }

  return digits;
}

export default function EnquiryForm({ slug }: Props) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loadingProduct, setLoadingProduct] = useState(true);
  const [productError, setProductError] = useState("");

  const [buyerName, setBuyerName] = useState("");
  const [buyerPhone, setBuyerPhone] = useState("");
  const [quantity, setQuantity] = useState("");
  const [message, setMessage] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadProduct() {
      setLoadingProduct(true);
      setProductError("");

      try {
        const response = await fetch(
          `${API_URL}/products/${encodeURIComponent(slug)}`,
          { cache: "no-store" }
        );

        const result = await response.json();

        if (!response.ok || !result.success || !result.data) {
          throw new Error(
            result.message || "Unable to load this product."
          );
        }

        if (!cancelled) {
          setProduct(result.data);
        }
      } catch (err) {
        if (!cancelled) {
          setProductError(
            err instanceof Error
              ? err.message
              : "Unable to load this product."
          );
        }
      } finally {
        if (!cancelled) {
          setLoadingProduct(false);
        }
      }
    }

    loadProduct();

    return () => {
      cancelled = true;
    };
  }, [slug]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!product) {
      setError("Product details are not available.");
      return;
    }

    if (buyerName.trim().length < 2) {
      setError("Please enter your full name.");
      return;
    }

    const phoneDigits = buyerPhone.replace(/\D/g, "");

    if (phoneDigits.length < 10 || phoneDigits.length > 15) {
      setError("Please enter a valid mobile number.");
      return;
    }

    if (message.trim().length < 5) {
      setError("Please describe your requirement.");
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch(`${API_URL}/enquiries`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productSlug: product.slug,
          buyerName: buyerName.trim(),
          buyerPhone: buyerPhone.trim(),
          quantity: quantity.trim(),
          message: message.trim(),
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Unable to submit your enquiry."
        );
      }

      setSuccess(
        "Your enquiry has been submitted successfully. The supplier can now follow up with you."
      );

      setBuyerName("");
      setBuyerPhone("");
      setQuantity("");
      setMessage("");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to submit your enquiry. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (loadingProduct) {
    return (
      <main className="min-h-[60vh] bg-slate-50 px-4 py-16">
        <div className="mx-auto max-w-5xl animate-pulse rounded-2xl border border-slate-200 bg-white p-8">
          <div className="h-6 w-56 rounded bg-slate-200" />
          <div className="mt-4 h-4 w-full max-w-md rounded bg-slate-100" />
          <div className="mt-8 h-48 rounded-xl bg-slate-100" />
        </div>
      </main>
    );
  }

  if (!product || productError) {
    return (
      <main className="min-h-[60vh] bg-slate-50 px-4 py-16">
        <div className="mx-auto max-w-2xl rounded-2xl border border-red-100 bg-white p-8 text-center">
          <h1 className="text-xl font-bold text-slate-900">
            Product unavailable
          </h1>
          <p className="mt-3 text-sm text-slate-600">
            {productError || "We could not find this product."}
          </p>
          <Link
            href="/products"
            className="mt-6 inline-flex rounded-xl bg-indigo-600 px-5 py-3 text-sm font-bold text-white hover:bg-indigo-700"
          >
            Browse Products
          </Link>
        </div>
      </main>
    );
  }

  const supplierName = getSupplierName(product);
  const supplierPhone = getSupplierPhone(product);
  const whatsAppNumber = getWhatsAppNumber(supplierPhone);

  const image = product.images?.find(
    (item) => typeof item === "string" && item.trim()
  );

  const location = [
    product.location?.city || product.seller?.city,
    product.location?.state || product.seller?.state,
    product.location?.country,
  ]
    .filter(Boolean)
    .join(", ");

  const whatsAppMessage = encodeURIComponent(
    `Hello ${supplierName}, I am interested in ${product.name} on Advixio360. Please share product details and quotation.`
  );

  const whatsAppUrl = whatsAppNumber
    ? `https://wa.me/${whatsAppNumber}?text=${whatsAppMessage}`
    : "";

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 sm:py-12">
      <div className="mx-auto max-w-6xl">
        <nav className="mb-6 flex flex-wrap items-center gap-2 text-sm text-slate-500">
          <Link href="/" className="hover:text-indigo-700">
            Home
          </Link>
          <span>/</span>
          <Link href="/products" className="hover:text-indigo-700">
            Products
          </Link>
          <span>/</span>
          <Link
            href={`/products/${encodeURIComponent(product.slug)}`}
            className="max-w-[220px] truncate hover:text-indigo-700"
          >
            {product.name}
          </Link>
          <span>/</span>
          <span className="text-slate-800">Send Enquiry</span>
        </nav>

        <div className="mb-8">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-indigo-700">
            ADVIXIO360 MARKETPLACE
          </p>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">
            Send Product Enquiry
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
            Tell the supplier what you need and request product details
            or a quotation. No buyer login is required.
          </p>
        </div>

        <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_350px]">
          {/* ENQUIRY FORM */}
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-700">
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="h-5 w-5"
                  stroke="currentColor"
                  strokeWidth="1.8"
                >
                  <path
                    d="M21 11.5a8.5 8.5 0 0 1-12.7 7.4L3 20l1.1-4.6A8.5 8.5 0 1 1 21 11.5Z"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M8 9.5h8M8 13h5"
                    strokeLinecap="round"
                  />
                </svg>
              </div>

              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  Your Requirement
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Fields marked * are required.
                </p>
              </div>
            </div>

            {success && (
              <div
                role="status"
                className="mb-5 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm leading-6 text-emerald-800"
              >
                <p className="font-bold">Enquiry submitted</p>
                <p className="mt-1">{success}</p>
                <Link
                  href={`/products/${encodeURIComponent(product.slug)}`}
                  className="mt-2 inline-flex font-bold underline underline-offset-4"
                >
                  Return to product
                </Link>
              </div>
            )}

            {error && (
              <div
                role="alert"
                className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
              >
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label
                  htmlFor="buyerName"
                  className="mb-2 block text-sm font-semibold text-slate-800"
                >
                  Full Name *
                </label>
                <input
                  id="buyerName"
                  name="buyerName"
                  autoComplete="name"
                  required
                  minLength={2}
                  maxLength={100}
                  value={buyerName}
                  onChange={(event) => setBuyerName(event.target.value)}
                  placeholder="Enter your full name"
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                />
              </div>

              <div>
                <label
                  htmlFor="buyerPhone"
                  className="mb-2 block text-sm font-semibold text-slate-800"
                >
                  Mobile Number *
                </label>
                <input
                  id="buyerPhone"
                  name="buyerPhone"
                  type="tel"
                  autoComplete="tel"
                  inputMode="tel"
                  required
                  maxLength={20}
                  value={buyerPhone}
                  onChange={(event) => setBuyerPhone(event.target.value)}
                  placeholder="Enter your mobile number"
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                />
                <p className="mt-2 text-xs text-slate-500">
                  Include your country code if you are outside India.
                </p>
              </div>

              <div>
                <label
                  htmlFor="quantity"
                  className="mb-2 block text-sm font-semibold text-slate-800"
                >
                  Quantity Required
                </label>
                <input
                  id="quantity"
                  name="quantity"
                  maxLength={100}
                  value={quantity}
                  onChange={(event) => setQuantity(event.target.value)}
                  placeholder="e.g. 100 pieces, 20 units, 5 kg"
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                />
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="mb-2 block text-sm font-semibold text-slate-800"
                >
                  Message / Requirement *
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  minLength={5}
                  maxLength={3000}
                  rows={5}
                  value={message}
                  onChange={(event) => setMessage(event.target.value)}
                  placeholder="Tell the supplier about your specifications, delivery location, budget or quotation requirements..."
                  className="w-full resize-y rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm leading-6 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="flex min-h-12 w-full items-center justify-center rounded-xl bg-indigo-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? "Submitting Enquiry..." : "Submit Enquiry"}
              </button>

              <p className="text-xs leading-5 text-slate-500">
                By submitting, you agree that the information provided
                may be shared with this product&apos;s supplier to
                respond to your enquiry.
              </p>
            </form>
          </section>

          {/* PRODUCT + SUPPLIER DETAILS */}
          <aside className="space-y-5 lg:sticky lg:top-6">
            <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-100 px-5 py-4">
                <h2 className="font-bold text-slate-900">
                  Product You&apos;re Interested In
                </h2>
              </div>

              {image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={image}
                  alt={product.name}
                  className="h-48 w-full bg-white object-contain p-5"
                />
              ) : (
                <div className="flex h-40 items-center justify-center bg-slate-50 text-sm text-slate-400">
                  Product image unavailable
                </div>
              )}

              <div className="p-5">
                <h3 className="text-base font-bold leading-6 text-slate-900">
                  {product.name}
                </h3>

                <p className="mt-2 text-lg font-extrabold text-slate-950">
                  {formatPrice(product.price)}
                  {product.unit && (
                    <span className="ml-1 text-xs font-semibold text-slate-500">
                      / {product.unit}
                    </span>
                  )}
                </p>

                <Link
                  href={`/products/${encodeURIComponent(product.slug)}`}
                  className="mt-4 inline-flex text-sm font-bold text-indigo-700 hover:text-indigo-900"
                >
                  View Product Details →
                </Link>
              </div>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-[0.15em] text-slate-500">
                Supplier Details
              </p>

              <h2 className="mt-2 break-words text-lg font-extrabold text-slate-900">
                {supplierName}
              </h2>

              {location && (
                <p className="mt-1 text-sm text-slate-500">
                  {location}
                </p>
              )}

              <div className="mt-5 space-y-3">
                {supplierPhone ? (
                  <a
                    href={`tel:${supplierPhone.replace(/[^\d+]/g, "")}`}
                    className="flex min-h-12 items-center justify-center rounded-xl border border-slate-300 px-4 py-3 text-sm font-bold text-slate-800 transition hover:bg-slate-50"
                  >
                    Call Supplier
                  </a>
                ) : (
                  <p className="rounded-xl bg-slate-50 p-3 text-sm leading-5 text-slate-500">
                    Supplier phone number is not available.
                  </p>
                )}

                {whatsAppUrl ? (
                  <a
                    href={whatsAppUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex min-h-12 items-center justify-center rounded-xl bg-emerald-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-emerald-700"
                  >
                    Chat on WhatsApp
                  </a>
                ) : (
                  <p className="rounded-xl bg-slate-50 p-3 text-sm leading-5 text-slate-500">
                    WhatsApp contact is unavailable because the
                    supplier has not provided a usable phone number.
                  </p>
                )}
              </div>

              <div className="mt-5 border-t border-slate-100 pt-4">
                <p className="text-xs leading-5 text-slate-500">
                  Your enquiry will be saved for the supplier to
                  review in their dashboard.
                </p>
              </div>
            </section>
          </aside>
        </div>
      </div>
    </main>
  );
}
