"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";

const slides = [
  {
    id: 1,
    title: "Find the Right Industrial Products",
    description:
      "Discover machinery, tools, equipment and products from trusted suppliers.",
    button: "Explore Products",
    href: "/products",
    image: "/products/banner-1.jpg",
  },
  {
    id: 2,
    title: "Connect With Verified Suppliers",
    description:
      "Find manufacturers, wholesalers and suppliers for your business needs.",
    button: "Find Suppliers",
    href: "/suppliers",
    image: "/products/banner-2.jpg",
  },
  {
    id: 3,
    title: "Post Your Buying Requirement",
    description:
      "Tell suppliers what you need and receive competitive quotations.",
    button: "Post Requirement",
    href: "/requirements",
    image: "/products/banner-3.jpg",
  },
];

const AUTOPLAY_MS = 5000;

export default function HeroSlider() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef(null);

  const goTo = useCallback((next) => {
    setIndex(((next % slides.length) + slides.length) % slides.length);
  }, []);

  useEffect(() => {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (reduceMotion || paused) return undefined;

    timerRef.current = window.setInterval(() => {
      setIndex((current) => (current + 1) % slides.length);
    }, AUTOPLAY_MS);

    return () => window.clearInterval(timerRef.current);
  }, [paused]);

  return (
    <div
      className="hero-slider"
      role="region"
      aria-roledescription="carousel"
      aria-label="Advixio highlights"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div className="hero-slider-viewport">
        {slides.map((slide, i) => (
          <div
            key={slide.id}
            className={`hero-slide${i === index ? " active" : ""}`}
            role="group"
            aria-roledescription="slide"
            aria-label={`${i + 1} of ${slides.length}`}
            aria-hidden={i !== index}
          >
            <img
              className="hero-slide-image"
              src={slide.image}
              alt=""
              loading={i === 0 ? "eager" : "lazy"}
              decoding="async"
            />

            <div className="hero-slide-overlay">
              <div className="hero-slide-copy">
                <h2 className="hero-slide-title">{slide.title}</h2>
                <p className="hero-slide-description">{slide.description}</p>
              </div>

              <Link href={slide.href} className="hero-slide-button">
                {slide.button}
              </Link>
            </div>
          </div>
        ))}
      </div>

      <button
        type="button"
        className="hero-slider-arrow hero-slider-prev"
        aria-label="Previous slide"
        onClick={() => goTo(index - 1)}
      >
        ‹
      </button>

      <button
        type="button"
        className="hero-slider-arrow hero-slider-next"
        aria-label="Next slide"
        onClick={() => goTo(index + 1)}
      >
        ›
      </button>

      <div className="hero-slider-dots" role="tablist" aria-label="Choose slide">
        {slides.map((slide, i) => (
          <button
            key={slide.id}
            type="button"
            role="tab"
            aria-selected={i === index}
            aria-label={`Go to slide ${i + 1}`}
            className={`hero-slider-dot${i === index ? " active" : ""}`}
            onClick={() => goTo(i)}
          />
        ))}
      </div>
    </div>
  );
}
