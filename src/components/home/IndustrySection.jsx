"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { categories } from "@/data/categories";

const categoryIcons = {
  "industrial-machinery": (
    <>
      <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
      <path d="M19.4 15a1 1 0 0 0 .2 1.1l.1.1a2 2 0 0 1-2.8 2.8l-.1-.1a1 1 0 0 0-1.1-.2 1 1 0 0 0-.6.9V20a2 2 0 0 1-4 0v-.1a1 1 0 0 0-.7-.9 1 1 0 0 0-1.1.2l-.1.1a2 2 0 0 1-2.8-2.8l.1-.1a1 1 0 0 0 .2-1.1 1 1 0 0 0-.9-.6H4a2 2 0 0 1 0-4h.1a1 1 0 0 0 .9-.7 1 1 0 0 0-.2-1.1l-.1-.1a2 2 0 0 1 2.8-2.8l.1.1a1 1 0 0 0 1.1.2h.1a1 1 0 0 0 .6-.9V4a2 2 0 0 1 4 0v.1a1 1 0 0 0 .6.9 1 1 0 0 0 1.1-.2l.1-.1a2 2 0 0 1 2.8 2.8l-.1.1a1 1 0 0 0-.2 1.1v.1a1 1 0 0 0 .9.6H20a2 2 0 0 1 0 4h-.1a1 1 0 0 0-.9.6Z" />
    </>
  ),
  "automobile-auto-parts": (
    <>
      <path d="M5 17h14v-5l-2-4H7l-2 4v5Z" />
      <path d="M3 17h2m14 0h2M7 17a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm10 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4ZM7 12h10" />
    </>
  ),
  "electrical-electronics": (
    <path d="M13 2 4.5 13H11l-1 9 9.5-11H13z" />
  ),
  "construction-building-materials": (
    <>
      <path d="M3 21h18M6 21V8l6-4 6 4v13" />
      <path d="M9 10h.01M15 10h.01M9 14h.01M15 14h.01M10 21v-4h4v4" />
    </>
  ),
  "tools-hardware": (
    <path d="M14.7 6.3a4 4 0 0 0-5.66 5.66L3 18l3 3 6.04-6.04a4 4 0 0 0 5.66-5.66l-3 3-2.7-2.7z" />
  ),
  "safety-security": (
    <>
      <path d="M12 3 5 6v6c0 5 3.4 7.4 7 9 3.6-1.6 7-4 7-9V6l-7-3Z" />
      <path d="m9 12 2 2 4-4" />
    </>
  ),
  "agriculture-farming": (
    <>
      <path d="M11 20A7 7 0 0 1 9 6.2C9 4.5 10.5 3 12 2c1.5 1 3 2.5 3 4.2A7 7 0 0 1 13 20" />
      <path d="M12 10v10" />
    </>
  ),
  "food-processing-machinery": (
    <>
      <path d="M6 3h12M7 3v4a5 5 0 0 0 10 0V3M12 12v9M8 21h8" />
    </>
  ),
};

function CategoryIcon({ slug }) {
  const icon = categoryIcons[slug] || <path d="M4 6h16M4 12h16M4 18h16" />;

  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {icon}
    </svg>
  );
}

export default function IndustrySection() {
  const visibleCategories = categories.slice(0, 8);

  const trackRef = useRef(null);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

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
  }, [updateArrows]);

  const scrollByCards = (direction) => {
    const track = trackRef.current;
    if (!track) return;

    const card = track.querySelector(".industry-card");
    const step = card ? card.offsetWidth + 16 : track.clientWidth * 0.8;

    track.scrollBy({
      left: direction * step * 2,
      behavior: "smooth",
    });
  };

  return (
    <section className="industry-section" id="categories">
      <div className="container">

        <div className="section-header">
          <div>
            <h2>Explore Business Categories</h2>
            <p>
              Find businesses, suppliers and products across India's
              major B2B industries.
            </p>
          </div>

          <Link
            href="/categories"
            className="view-all-button desktop-view-all"
          >
            View All Categories →
          </Link>
        </div>

        <div className="industry-carousel">
          <button
            type="button"
            className="industry-carousel-arrow industry-carousel-prev"
            aria-label="Scroll categories left"
            disabled={!canScrollPrev}
            onClick={() => scrollByCards(-1)}
          >
            ‹
          </button>

          <div
            className="industry-track"
            ref={trackRef}
            role="list"
            aria-label="Business categories"
          >
            {visibleCategories.map((category) => (
              <Link
                href={`/products?category=${encodeURIComponent(category.slug)}`}
                className="industry-card"
                key={category.id}
                role="listitem"
              >
                <div className="industry-icon">
                  <CategoryIcon slug={category.slug} />
                </div>

                <div className="industry-card-content">
                  <h3>{category.name}</h3>
                  <p>{category.description}</p>
                </div>
              </Link>
            ))}
          </div>

          <button
            type="button"
            className="industry-carousel-arrow industry-carousel-next"
            aria-label="Scroll categories right"
            disabled={!canScrollNext}
            onClick={() => scrollByCards(1)}
          >
            ›
          </button>
        </div>

        <Link
          href="/categories"
          className="view-all-button mobile-view-all"
        >
          View All Categories →
        </Link>

      </div>
    </section>
  );
}
