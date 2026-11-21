
"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";

const API_URL = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"
).replace(/\/+$/, "");

type Product = {
  _id: string;
  name: string;
  slug: string;
  shortDescription?: string;
  description?: string;
  price?: number;
  unit?: string;
  images?: string[];
  createdAt?: string;
  category?: {
    name?: string;
  } | null;
  seller?: {
    name?: string;
    companyName?: string;
    city?: string;
    state?: string;
  } | null;
  companyName?: string;
  location?: {
    city?: string;
    state?: string;
  };
};

export default function TrendingProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* --- Carousel controls (prev/next arrows) --- */

  const trackRef = useRef<HTMLDivElement>(null);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  /* --- Auto-scroll + center focus --- */

  // Duplicate the list only when there are enough cards that the copy
  // is wider than the viewport (otherwise the seam would be visible).
  const loop = products.length >= 4;

  const focusRef = useRef<HTMLElement | null>(null);
  const hoverRef = useRef(false);
  const dragRef = useRef(false);

  const updateArrows = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;

    setCanScrollPrev(track.scrollLeft > 2);
    setCanScrollNext(
      track.scrollLeft < track.scrollWidth - track.clientWidth - 2
    );
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return undefined;

    updateArrows();
    track.addEventListener("scroll", updateArrows, { passive: true });
    window.addEventListener("resize", updateArrows);

    return () => {
      track.removeEventListener("scroll", updateArrows);
      window.removeEventListener("resize", updateArrows);
    };
    // products.length: the track only exists once the data has loaded
  }, [updateArrows, products.length]);

  const scrollByCards = (direction: number) => {
    const track = trackRef.current;
    if (!track) return;

    const card = track.querySelector<HTMLElement>(".trending-product-card");
    const step = card
      ? card.getBoundingClientRect().width + 12
      : track.clientWidth * 0.8;

    track.scrollBy({ left: direction * step, behavior: "smooth" });
  };

  /* Auto-scroll the row forever (seamless loop) and keep exactly one
     card — the one at the visible middle — marked as "in focus". */
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return undefined;

    const SPEED = 0.6; // px per frame (~36px/s at 60fps)
    const PAUSE_MS = 2000;

    let raf = 0;
    let copyWidth = 0;
    let cards: HTMLElement[] = [];
    let pauseUntil = 0;

    const measure = () => {
      cards = Array.from(
        track.querySelectorAll<HTMLElement>(".trending-product-card")
      );
      // Distance from the first card of copy A to the first card of copy B
      copyWidth = cards.length
        ? (cards[products.length]?.offsetLeft ?? 0) - cards[0].offsetLeft
        : 0;
    };

    const applyFocus = () => {
      if (!cards.length) return;

      const rect = track.getBoundingClientRect();
      const middle = rect.left + rect.width / 2;

      let best: HTMLElement | null = null;
      let bestDist = Infinity;

      for (const card of cards) {
        const c = card.getBoundingClientRect();
        const dist = Math.abs(c.left + c.width / 2 - middle);
        if (dist < bestDist) {
          bestDist = dist;
          best = card;
        }
      }

      if (best && best !== focusRef.current) {
        const hadFocus = focusRef.current !== null;
        focusRef.current?.classList.remove("is-focus");
        best.classList.add("is-focus");
        focusRef.current = best;
        if (hadFocus) {
          pauseUntil = Date.now() + PAUSE_MS;
        }
      }
    };

    const tick = () => {
      // Fresh API data can re-render the list under us (even at the same
      // card count), detaching our cached nodes — detect and re-measure.
      if (!cards.length || !cards[0].isConnected) {
        measure();
        focusRef.current = null;
        applyFocus();
      }

      const paused = Date.now() < pauseUntil;
      if (!paused && !hoverRef.current && !dragRef.current && copyWidth > 0) {
        track.scrollLeft += SPEED;
        // Wrapped past the first copy -> jump back one copy (identical
        // content, so the seam is invisible)
        if (track.scrollLeft >= copyWidth) {
          track.scrollLeft -= copyWidth;
        }
      }
      applyFocus();
      raf = requestAnimationFrame(tick);
    };

    measure();
    applyFocus();
    raf = requestAnimationFrame(tick);

    const onResize = () => {
      measure();
      applyFocus();
    };

    // A mouseup outside the carousel never reaches its onMouseUp — clear
    // the drag flag globally so the row always resumes after a drag.
    const endDrag = () => {
      dragRef.current = false;
    };

    window.addEventListener("resize", onResize);
    window.addEventListener("mouseup", endDrag);
    window.addEventListener("pointercancel", endDrag);
    // Images/fonts can shift card widths after first paint
    const imgs = track.querySelectorAll("img");
    imgs.forEach((img) => img.addEventListener("load", onResize));

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("mouseup", endDrag);
      window.removeEventListener("pointercancel", endDrag);
      imgs.forEach((img) => img.removeEventListener("load", onResize));
      focusRef.current?.classList.remove("is-focus");
      focusRef.current = null;
    };
  }, [products.length, loop]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(`${API_URL}/products`, {
          method: "GET",
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }

        const result = await response.json();

        if (!result.success) {
          throw new Error(
            result.message || "Unable to load products"
          );
        }

        const allowedSuppliers = ["play project", "mayur computers"];

        const list = (result.data || [])
          .filter((product: Product) => {
            const names = [
              product.seller?.companyName,
              product.seller?.name,
              product.companyName,
            ]
              .filter(Boolean)
              .map((value) => String(value).toLowerCase().trim());

            return allowedSuppliers.some((supplier) => names.includes(supplier));
          })
          .slice()
          .sort((a: Product, b: Product) => {
            const da = a.createdAt ? new Date(a.createdAt).getTime() : Infinity;
            const db = b.createdAt ? new Date(b.createdAt).getTime() : Infinity;
            return da - db;
          })
          .slice(0, 10);
        setProducts(list);
      } catch (err) {
        console.error("Trending products API error:", err);
        setError("Unable to load products");
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const formatPrice = (price?: number, unit?: string) => {
    if (price === undefined || price === null) {
      return "Price on Request";
    }

    return `₹${price.toLocaleString("en-IN")}${
      unit ? ` / ${unit}` : ""
    }`;
  };

  return (
    <section className="trending-section">
      <div className="container">

        {/* HEADER */}

        <div className="trending-header">
          <div>
            <h2>Trending Products</h2>
            <p>
              Discover products from businesses across different industries.
            </p>
          </div>

          <Link
            href="/products"
            className="trending-view-all"
          >
            View All Products →
          </Link>
        </div>

        {/* LOADING */}

        {loading && (
          <div className="trending-status">
            Loading products...
          </div>
        )}

        {/* ERROR */}

        {!loading && error && (
          <div className="trending-status">
            Unable to load products. Please try again later.
          </div>
        )}

        {/* EMPTY */}

        {!loading && !error && products.length === 0 && (
          <div className="trending-status">
            No products available right now.
          </div>
        )}

        {/* ACTUAL PRODUCTS */}

        {!loading && !error && products.length > 0 && (
          <div
            className="trending-carousel"
            onMouseEnter={() => {
              hoverRef.current = true;
            }}
            onMouseLeave={() => {
              hoverRef.current = false;
              dragRef.current = false;
            }}
            onMouseDown={() => {
              dragRef.current = true;
            }}
            onMouseUp={() => {
              dragRef.current = false;
            }}
          >
            <button
              type="button"
              className="trending-carousel-arrow trending-carousel-prev"
              aria-label="Scroll products left"
              disabled={!canScrollPrev}
              onClick={() => scrollByCards(-1)}
            >
              ‹
            </button>

            <div className="trending-products-scroll" ref={trackRef}>
            {/* Two identical copies -> when we jump back by one copy's
                width the row looks unchanged, so the loop never seams */}
            {(loop ? [...products, ...products] : products).map(
              (product, i) => {
              const image = product.images?.[0];

              const location =
                product.location?.city ||
                product.seller?.city ||
                product.location?.state ||
                product.seller?.state ||
                "India";

              const company =
                product.seller?.companyName ||
                product.companyName ||
                product.seller?.name ||
                "Advixio Supplier";

              return (
                <article
                  className="trending-product-card"
                  key={`${product._id}-${i}`}
                  /* Second copy is decorative: don't announce it twice */
                  aria-hidden={i >= products.length || undefined}
                >
                  <div className="trending-product-image">
                    {image ? (
                      <img
                        src={image}
                        alt={product.name}
                        loading="lazy"
                      />
                    ) : (
                      <div className="trending-no-image">
                        No Image Available
                      </div>
                    )}
                  </div>

                  <div className="trending-product-content">

                    {product.category?.name && (
                      <div className="trending-verified">
                        {product.category.name}
                      </div>
                    )}

                    <h3>{product.name}</h3>

                    <div className="trending-product-price">
                      {formatPrice(product.price, product.unit)}
                    </div>

                    <div className="trending-product-bottom">
                      <span>
                        {location} · {company}
                      </span>

                      <Link
                        href="/products"
                        className="trending-enquire"
                        /* duplicate copy: keep it out of the tab order */
                        tabIndex={i >= products.length ? -1 : undefined}
                      >
                        Enquire →
                      </Link>
                    </div>

                  </div>
                </article>
              );
            })}
            </div>

            <button
              type="button"
              className="trending-carousel-arrow trending-carousel-next"
              aria-label="Scroll products right"
              disabled={!canScrollNext}
              onClick={() => scrollByCards(1)}
            >
              ›
            </button>
          </div>
        )}

      </div>
    </section>
  );
}
