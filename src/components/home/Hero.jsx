

"use client";

import { useEffect, useState } from "react";
import SearchBar from "./SearchBar";

export default function Hero() {
  const firstLine = "Find the right ";
  const secondLine = "suppliers &";
  const thirdLine = "products for your business.";

  const fullText = firstLine + secondLine + thirdLine;
  const [typedText, setTypedText] = useState("");

  useEffect(() => {
    let index = 0;

    const typingInterval = setInterval(() => {
      index++;
      setTypedText(fullText.slice(0, index));

      if (index >= fullText.length) {
        clearInterval(typingInterval);
      }
    }, 75);

    return () => clearInterval(typingInterval);
  }, []);

  const firstText = typedText.slice(0, firstLine.length);
  const secondText = typedText.slice(
    firstLine.length,
    firstLine.length + secondLine.length
  );
  const thirdText = typedText.slice(
    firstLine.length + secondLine.length
  );

  return (
    <section className="hero hero-redesign">

      {/* Moving background glow */}
      <div className="hero-decoration hero-decoration-one" />
      <div className="hero-decoration hero-decoration-two" />

      {/* Floating particles */}
      <div className="hero-particles" aria-hidden="true">
        <span />
        <span />
        <span />
        <span />
        <span />
        <span />
        <span />
        <span />
        <span />
        <span />
        <span />
        <span />
      </div>

      {/* Floating glass cards */}
      <div className="hero-floating-label hero-label-left">
        <span className="floating-icon">✓</span>
        Verified Suppliers
      </div>

      <div className="hero-floating-label hero-label-right">
        <span className="floating-icon">▣</span>
        1M+ Products
      </div>

      <div className="hero-floating-label hero-label-bottom-left">
        <span className="floating-icon">⌕</span>
        Smart Search
      </div>

      <div className="hero-floating-label hero-label-bottom-right">
        <span className="floating-icon">✓</span>
        Direct Enquiry
      </div>

      <div className="hero-content">

        <div className="hero-badge">
          <span className="hero-badge-dot" />
          INDIA'S B2B BUSINESS DISCOVERY MARKETPLACE
        </div>

        {/* Typing heading */}
        <h1 className="typing-heading">
          {firstText}
          <span className="hero-highlight">{secondText}</span>
          <br />
          <span className="hero-highlight">{thirdText}</span>
          <span className="typing-cursor">|</span>
        </h1>

        <p className="hero-description">
          Discover manufacturers, wholesalers, distributors and trusted
          suppliers. Explore products and connect directly with businesses
          across India.
        </p>

        <SearchBar />

        <div className="hero-actions">
          <a href="#categories" className="hero-primary-action">
            Explore Categories <span>→</span>
          </a>

          <a href="#post" className="hero-secondary-action">
            Post Your Product Free
          </a>
        </div>

        <div className="hero-trust-points">
          <span>✓ Manufacturers</span>
          <span>✓ Wholesalers</span>
          <span>✓ Distributors</span>
          <span>✓ Service Providers</span>
        </div>

      </div>
    </section>
  );
}
