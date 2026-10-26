"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const categories = [
  "All Articles",
  "Business Growth",
  "Procurement",
  "B2B Marketing",
  "Sourcing",
];

const articles = [
  {
    id: 1,
    category: "Business Growth",
    title: "How Digital Marketing Helps Businesses Grow in 2026",
    description:
      "Discover practical digital marketing strategies to increase brand awareness, reach your target audience, and generate quality leads.",
    date: "Apr 12, 2026",
    read: "6 min read",
    color: "#0284c7",
    bg: "linear-gradient(135deg, #082f49, #0284c7, #67e8f9)",
    symbol: "↗",
  },
  {
    id: 2,
    category: "Procurement",
    title: "Smarter Procurement Strategies for Modern Businesses",
    description:
      "Learn how better supplier discovery and procurement planning can help businesses save time and resources.",
    date: "Apr 8, 2026",
    read: "5 min read",
    color: "#059669",
    bg: "linear-gradient(135deg, #064e3b, #10b981, #a7f3d0)",
    symbol: "◇",
  },
  {
    id: 3,
    category: "B2B Marketing",
    title: "B2B Marketing Strategies That Build Lasting Relationships",
    description:
      "Explore ways to connect with business buyers, build trust and generate meaningful opportunities.",
    date: "Apr 2, 2026",
    read: "7 min read",
    color: "#9333ea",
    bg: "linear-gradient(135deg, #3b0764, #9333ea, #e9d5ff)",
    symbol: "◎",
  },
  {
    id: 4,
    category: "Sourcing",
    title: "Finding the Right Suppliers for Your Business",
    description:
      "Understand what to consider when evaluating suppliers and building a dependable sourcing network.",
    date: "Mar 28, 2026",
    read: "4 min read",
    color: "#ea580c",
    bg: "linear-gradient(135deg, #7c2d12, #f97316, #fed7aa)",
    symbol: "⌁",
  },
  {
    id: 5,
    category: "Business Growth",
    title: "The Power of B2B E-Commerce in 2026",
    description:
      "Explore how digital marketplaces and e-commerce platforms are transforming the way businesses buy and sell.",
    date: "Mar 22, 2026",
    read: "6 min read",
    color: "#2563eb",
    bg: "linear-gradient(135deg, #172554, #2563eb, #93c5fd)",
    symbol: "▥",
  },
  {
    id: 6,
    category: "B2B Marketing",
    title: "Building Stronger Supplier Relationships",
    description:
      "Learn practical tips to improve communication, manage risks and create long-term value with your suppliers.",
    date: "Mar 15, 2026",
    read: "5 min read",
    color: "#0e7490",
    bg: "linear-gradient(135deg, #164e63, #0891b2, #a5f3fc)",
    symbol: "↔",
  },
];

export default function Blogs() {
  const [activeCategory, setActiveCategory] = useState("All Articles");
  const [search, setSearch] = useState("");
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const filteredArticles = articles.filter((article) => {
    const matchesCategory =
      activeCategory === "All Articles" || article.category === activeCategory;

    const query = search.toLowerCase();

    const matchesSearch =
      article.title.toLowerCase().includes(query) ||
      article.description.toLowerCase().includes(query) ||
      article.category.toLowerCase().includes(query);

    return matchesCategory && matchesSearch;
  });

  const page = {
    minHeight: "100vh",
    background: "#f8fafc",
    color: "#0f172a",
    fontFamily: "Arial, Helvetica, sans-serif",
  };

  const container = {
    width: "100%",
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "0 24px",
    boxSizing: "border-box" as const,
  };

  const buttonStyle = {
    border: "none",
    borderRadius: "30px",
    padding: "11px 18px",
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: 600,
    transition: "all 0.2s ease",
  };

  return (
    <main style={page}>
      {/* Existing site navbar */}
      <Navbar />

      {/* HERO */}
      <section
        style={{
          background:
            "radial-gradient(ellipse at 90% 20%, rgba(59,130,246,0.42), transparent 35%), linear-gradient(120deg, #020617 0%, #0b1f4b 55%, #173e86 100%)",
          color: "#ffffff",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            ...container,
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(min(100%, 360px), 1fr))",
            gap: "40px",
            alignItems: "center",
            paddingTop: "70px",
            paddingBottom: "70px",
          }}
        >
          <div>
            <p
              style={{
                color: "#67e8f9",
                fontSize: "13px",
                fontWeight: 800,
                letterSpacing: "2px",
                marginBottom: "20px",
              }}
            >
              ADVIXIO360 BLOG
            </p>

            <h1
              style={{
                fontSize: "clamp(36px, 5vw, 58px)",
                lineHeight: 1.12,
                letterSpacing: "-1.8px",
                margin: "0 0 22px",
                color: "#ffffff",
                fontWeight: 800,
              }}
            >
              Ideas, insights & practical knowledge for{" "}
              <span
                style={{
                  background: "linear-gradient(90deg, #38bdf8, #818cf8)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                modern businesses.
              </span>
            </h1>

            <p
              style={{
                color: "#dbeafe",
                fontSize: "16px",
                lineHeight: 1.9,
                maxWidth: "600px",
                marginBottom: "25px",
              }}
            >
              Explore practical articles on sourcing, selling, digital growth,
              procurement, supplier discovery and the changing B2B marketplace.
            </p>

            <div
              style={{
                display: "flex",
                gap: "10px",
                flexWrap: "wrap",
              }}
            >
              {[
                ["↗", "Business Growth"],
                ["▣", "Procurement"],
                ["◎", "B2B Marketing"],
                ["⌁", "Sourcing"],
              ].map(([symbol, label]) => (
                <button
                  key={label}
                  onClick={() => {
                    setActiveCategory(label);
                    document
                      .getElementById("articles")
                      ?.scrollIntoView({ behavior: "smooth" });
                  }}
                  style={{
                    ...buttonStyle,
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid #38bdf8",
                    color: "#ffffff",
                  }}
                >
                  <span style={{ color: "#38bdf8", marginRight: "7px" }}>
                    {symbol}
                  </span>
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div
            style={{
              minHeight: "290px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "20px",
            }}
          >
            <div
              style={{
                width: "100%",
                maxWidth: "430px",
                padding: "40px 28px",
                border: "1px solid rgba(147,197,253,0.4)",
                borderRadius: "28px",
                background:
                  "linear-gradient(145deg, rgba(255,255,255,0.14), rgba(255,255,255,0.03))",
                boxShadow: "0 25px 80px rgba(0,0,0,0.25)",
                transform: "rotate(-2deg)",
              }}
            >
              <div
                style={{ display: "flex", gap: "7px", marginBottom: "30px" }}
              >
                {["#fb7185", "#fbbf24", "#34d399"].map((color) => (
                  <span
                    key={color}
                    style={{
                      width: "10px",
                      height: "10px",
                      borderRadius: "50%",
                      background: color,
                    }}
                  />
                ))}
              </div>

              <p
                style={{
                  color: "#93c5fd",
                  fontSize: "12px",
                  letterSpacing: "2px",
                  fontWeight: 700,
                }}
              >
                BUSINESS INTELLIGENCE
              </p>

              <h2
                style={{
                  fontSize: "clamp(28px, 4vw, 42px)",
                  lineHeight: 1.2,
                  color: "#ffffff",
                  margin: "15px 0",
                }}
              >
                Better Ideas.
                <br />
                Bigger Growth.
              </h2>

              <div
                style={{
                  height: "100px",
                  display: "flex",
                  alignItems: "end",
                  gap: "12px",
                  borderBottom: "1px solid rgba(255,255,255,0.3)",
                  padding: "0 12px",
                }}
              >
                {[35, 55, 42, 75, 95].map((height, index) => (
                  <div
                    key={index}
                    style={{
                      height: `${height}%`,
                      flex: 1,
                      borderRadius: "6px 6px 0 0",
                      background: `linear-gradient(180deg, #67e8f9, #2563eb)`,
                    }}
                  />
                ))}
              </div>

              <p
                style={{
                  color: "#bfdbfe",
                  fontSize: "13px",
                  marginTop: "16px",
                }}
              >
                Insights that move your business forward.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* BLOG CONTENT */}
      <section id="articles" style={{ padding: "55px 0 70px" }}>
        <div style={container}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: "20px",
              flexWrap: "wrap",
              marginBottom: "24px",
            }}
          >
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  style={{
                    ...buttonStyle,
                    background:
                      activeCategory === category ? "#2563eb" : "#eaf1fb",
                    color: activeCategory === category ? "#ffffff" : "#334155",
                    boxShadow:
                      activeCategory === category
                        ? "0 5px 15px rgba(37,99,235,0.2)"
                        : "none",
                  }}
                >
                  {category}
                </button>
              ))}
            </div>

            <input
              type="search"
              placeholder="⌕  Search articles..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              aria-label="Search articles"
              style={{
                width: "100%",
                maxWidth: "300px",
                boxSizing: "border-box" as const,
                padding: "13px 17px",
                border: "1px solid #cbd5e1",
                borderRadius: "30px",
                outline: "none",
                fontSize: "14px",
                color: "#0f172a",
                background: "#ffffff",
              }}
            />
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(min(100%, 290px), 1fr))",
              gap: "24px",
            }}
          >
            {filteredArticles.map((article) => (
              <article
                key={article.id}
                style={{
                  background: "#ffffff",
                  border: "1px solid #e5edf6",
                  borderRadius: "15px",
                  overflow: "hidden",
                  boxShadow: "0 5px 22px rgba(15,23,42,0.055)",
                  transition: "transform 0.2s ease, box-shadow 0.2s ease",
                }}
              >
                <div
                  style={{
                    height: "180px",
                    background: article.bg,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    position: "relative",
                  }}
                >
                  <span
                    style={{
                      fontSize: "86px",
                      color: "rgba(255,255,255,0.85)",
                      fontWeight: 800,
                      textShadow: "0 8px 25px rgba(0,0,0,0.15)",
                    }}
                  >
                    {article.symbol}
                  </span>

                  <span
                    style={{
                      position: "absolute",
                      left: "15px",
                      top: "15px",
                      background: "#ffffff",
                      color: article.color,
                      padding: "7px 12px",
                      borderRadius: "20px",
                      fontSize: "11px",
                      fontWeight: 800,
                    }}
                  >
                    {article.category}
                  </span>
                </div>

                <div style={{ padding: "22px" }}>
                  <p
                    style={{
                      fontSize: "12px",
                      color: "#64748b",
                      margin: "0 0 12px",
                    }}
                  >
                    ▣ {article.date} &nbsp; · &nbsp; ◷ {article.read}
                  </p>

                  <h2
                    style={{
                      fontSize: "20px",
                      lineHeight: 1.45,
                      color: "#10244e",
                      margin: "0 0 12px",
                      fontWeight: 800,
                    }}
                  >
                    {article.title}
                  </h2>

                  <p
                    style={{
                      color: "#64748b",
                      fontSize: "14px",
                      lineHeight: 1.8,
                      marginBottom: "20px",
                    }}
                  >
                    {article.description}
                  </p>

                  <button
                    onClick={() =>
                      alert(
                        "Full article content is not available yet. Publish the article to enable reading.",
                      )
                    }
                    style={{
                      padding: 0,
                      background: "transparent",
                      border: "none",
                      color: article.color,
                      fontSize: "14px",
                      fontWeight: 800,
                      cursor: "pointer",
                    }}
                  >
                    Read More →
                  </button>
                </div>
              </article>
            ))}
          </div>

          {filteredArticles.length === 0 && (
            <div
              style={{
                background: "#ffffff",
                padding: "45px 20px",
                marginTop: "25px",
                textAlign: "center",
                borderRadius: "15px",
                color: "#475569",
              }}
            >
              <h3 style={{ color: "#0f172a" }}>No articles found</h3>
              <p>Try a different keyword or category.</p>
              <button
                onClick={() => {
                  setSearch("");
                  setActiveCategory("All Articles");
                }}
                style={{
                  ...buttonStyle,
                  background: "#2563eb",
                  color: "#ffffff",
                }}
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </section>

      {/* NEWSLETTER + CTA */}
      <section style={{ padding: "0 0 65px" }}>
        <div style={container}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(min(100%, 280px), 1fr))",
              gap: "24px",
            }}
          >
            <div
              style={{
                background: "linear-gradient(135deg, #dbeafe, #eff6ff)",
                border: "1px solid #bfdbfe",
                borderRadius: "18px",
                padding: "28px",
              }}
            >
              <div style={{ fontSize: "30px" }}>✉</div>
              <h2 style={{ color: "#10244e", fontSize: "22px" }}>
                Get the latest insights
              </h2>
              <p
                style={{ color: "#475569", lineHeight: 1.8, fontSize: "14px" }}
              >
                Stay informed with business ideas, practical guides and fresh
                perspectives from Advixio360.
              </p>

              <form
                onSubmit={(event) => {
                  event.preventDefault();
                  setSubscribed(true);
                }}
              >
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(event) => {
                    setEmail(event.target.value);
                    setSubscribed(false);
                  }}
                  placeholder="Enter your email address"
                  aria-label="Email address"
                  style={{
                    width: "100%",
                    boxSizing: "border-box" as const,
                    padding: "13px",
                    borderRadius: "9px",
                    border: "1px solid #cbd5e1",
                    background: "#ffffff",
                    color: "#0f172a",
                    marginBottom: "12px",
                  }}
                />
                <button
                  type="submit"
                  style={{
                    ...buttonStyle,
                    width: "100%",
                    borderRadius: "9px",
                    background: "linear-gradient(90deg, #3b82f6, #1d4ed8)",
                    color: "#ffffff",
                  }}
                >
                  Subscribe →
                </button>
              </form>

              {subscribed && (
                <p style={{ color: "#047857", fontSize: "13px" }}>
                  Thanks! This demo form does not yet save subscriptions to a
                  server.
                </p>
              )}
            </div>

            <div
              style={{
                background: "linear-gradient(135deg, #0f2460, #2563eb)",
                borderRadius: "18px",
                padding: "32px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "flex-start",
              }}
            >
              <p
                style={{
                  color: "#bfdbfe",
                  fontWeight: 800,
                  fontSize: "12px",
                  letterSpacing: "2px",
                }}
              >
                GROW WITH ADVIXIO360
              </p>
              <h2
                style={{
                  fontSize: "clamp(26px, 4vw, 35px)",
                  lineHeight: 1.3,
                  color: "#ffffff",
                  margin: "8px 0",
                }}
              >
                Ready to grow your business?
              </h2>
              <p style={{ color: "#dbeafe", lineHeight: 1.8 }}>
                Turn your digital presence into real opportunities with
                Advixio360.
              </p>
              <Link
                href="/contact"
                style={{
                  ...buttonStyle,
                  background: "#ffffff",
                  color: "#1d4ed8",
                  textDecoration: "none",
                  display: "inline-block",
                  marginTop: "12px",
                }}
              >
                Get Started →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Existing site footer */}
      <Footer />
    </main>
  );
}
