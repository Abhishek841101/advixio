"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const icons = [
  "⚙",
  "🚗",
  "⚡",
  "🏗",
  "🔧",
  "🛡",
  "🌾",
  "🏭",
  "📦",
  "🧪",
  "⚕",
  "🧵",
  "◈",
  "▣",
  "⚒",
  "◉",
  "◌",
  "❄",
  "🏗",
  "🔬",
  "☀",
  "🔋",
  "💻",
  "📡",
  "▤",
  "▦",
  "⌂",
  "◈",
  "◉",
  "◍",
  "▣",
  "✦",
  "♻",
  "⛏",
  "◉",
  "♻",
  "▤",
  "◇",
  "◆",
  "▥",
  "▰",
  "▤",
  "⚕",
  "✦",
  "◇",
  "♟",
  "⚽",
  "▣",
  "⌁",
  "⚙",
];

type Category = {
  _id: string;
  name: string;
  slug: string;
  description: string;
  image?: string;
  icon?: string;
  isActive: boolean;
  sortOrder: number;
};

const categories: Category[] = [
  {
    _id: "1",
    name: "Industrial Machinery",
    slug: "industrial-machinery",
    description:
      "Industrial machines, production equipment and manufacturing solutions.",
    isActive: true,
    sortOrder: 1,
  },
  {
    _id: "2",
    name: "Automobile & Auto Parts",
    slug: "automobile-auto-parts",
    description:
      "Vehicles, automotive components, spare parts and accessories.",
    isActive: true,
    sortOrder: 2,
  },
  {
    _id: "3",
    name: "Electrical & Electronics",
    slug: "electrical-electronics",
    description:
      "Electrical equipment, electronic components, appliances and systems.",
    isActive: true,
    sortOrder: 3,
  },
  {
    _id: "4",
    name: "Construction & Building Materials",
    slug: "construction-building-materials",
    description:
      "Construction materials, building products, equipment and solutions.",
    isActive: true,
    sortOrder: 4,
  },
  {
    _id: "5",
    name: "Tools & Hardware",
    slug: "tools-hardware",
    description:
      "Hand tools, power tools, hardware and industrial accessories.",
    isActive: true,
    sortOrder: 5,
  },
  {
    _id: "6",
    name: "Safety & Security",
    slug: "safety-security",
    description:
      "Personal protective equipment, workplace safety and security products.",
    isActive: true,
    sortOrder: 6,
  },
  {
    _id: "7",
    name: "Agriculture & Farming",
    slug: "agriculture-farming",
    description:
      "Agricultural machinery, farming equipment, irrigation and farm supplies.",
    isActive: true,
    sortOrder: 7,
  },
  {
    _id: "8",
    name: "Food Processing Machinery",
    slug: "food-processing-machinery",
    description:
      "Food processing, packaging and commercial kitchen machinery.",
    isActive: true,
    sortOrder: 8,
  },
  {
    _id: "9",
    name: "Packaging & Printing",
    slug: "packaging-printing",
    description:
      "Packaging machines, packaging materials, printing equipment and supplies.",
    isActive: true,
    sortOrder: 9,
  },
  {
    _id: "10",
    name: "Chemicals",
    slug: "chemicals",
    description:
      "Industrial chemicals, specialty chemicals and chemical raw materials.",
    isActive: true,
    sortOrder: 10,
  },
  {
    _id: "11",
    name: "Pharmaceuticals & Medical",
    slug: "pharmaceuticals-medical",
    description:
      "Pharmaceutical products, medical equipment and healthcare supplies.",
    isActive: true,
    sortOrder: 11,
  },
  {
    _id: "12",
    name: "Textiles & Garments",
    slug: "textiles-garments",
    description:
      "Textile machinery, fabrics, garments, yarns and textile accessories.",
    isActive: true,
    sortOrder: 12,
  },
  {
    _id: "13",
    name: "Plastic & Rubber",
    slug: "plastic-rubber",
    description:
      "Plastic products, rubber products, raw materials and processing machinery.",
    isActive: true,
    sortOrder: 13,
  },
  {
    _id: "14",
    name: "Metals & Metal Products",
    slug: "metals-metal-products",
    description:
      "Steel, aluminium, copper, metal products and metal processing solutions.",
    isActive: true,
    sortOrder: 14,
  },
  {
    _id: "15",
    name: "Welding & Fabrication",
    slug: "welding-fabrication",
    description:
      "Welding machines, fabrication equipment, consumables and accessories.",
    isActive: true,
    sortOrder: 15,
  },
  {
    _id: "16",
    name: "Pumps & Motors",
    slug: "pumps-motors",
    description:
      "Industrial pumps, motors, pumping systems and related equipment.",
    isActive: true,
    sortOrder: 16,
  },
  {
    _id: "17",
    name: "Valves & Pipes",
    slug: "valves-pipes",
    description:
      "Industrial valves, pipes, fittings, flanges and piping systems.",
    isActive: true,
    sortOrder: 17,
  },
  {
    _id: "18",
    name: "HVAC & Refrigeration",
    slug: "hvac-refrigeration",
    description:
      "Heating, ventilation, air conditioning and refrigeration equipment.",
    isActive: true,
    sortOrder: 18,
  },
  {
    _id: "19",
    name: "Material Handling",
    slug: "material-handling",
    description:
      "Cranes, hoists, conveyors, forklifts and material handling equipment.",
    isActive: true,
    sortOrder: 19,
  },
  {
    _id: "20",
    name: "Laboratory Equipment",
    slug: "laboratory-equipment",
    description:
      "Laboratory instruments, testing equipment and scientific supplies.",
    isActive: true,
    sortOrder: 20,
  },
  {
    _id: "21",
    name: "Renewable Energy",
    slug: "renewable-energy",
    description:
      "Solar, wind, battery storage and renewable energy products.",
    isActive: true,
    sortOrder: 21,
  },
  {
    _id: "22",
    name: "Batteries & Power Solutions",
    slug: "batteries-power-solutions",
    description:
      "Batteries, UPS systems, inverters, generators and power backup solutions.",
    isActive: true,
    sortOrder: 22,
  },
  {
    _id: "23",
    name: "IT & Computer Hardware",
    slug: "it-computer-hardware",
    description:
      "Computers, networking equipment, servers, accessories and IT hardware.",
    isActive: true,
    sortOrder: 23,
  },
  {
    _id: "24",
    name: "Telecommunication",
    slug: "telecommunication",
    description:
      "Telecommunication equipment, networking products and communication systems.",
    isActive: true,
    sortOrder: 24,
  },
  {
    _id: "25",
    name: "Office Supplies & Equipment",
    slug: "office-supplies-equipment",
    description:
      "Office furniture, stationery, printers and workplace equipment.",
    isActive: true,
    sortOrder: 25,
  },
  {
    _id: "26",
    name: "Furniture",
    slug: "furniture",
    description:
      "Office, industrial, commercial and residential furniture.",
    isActive: true,
    sortOrder: 26,
  },
  {
    _id: "27",
    name: "Home Appliances",
    slug: "home-appliances",
    description:
      "Home appliances, kitchen appliances and consumer electrical products.",
    isActive: true,
    sortOrder: 27,
  },
  {
    _id: "28",
    name: "Industrial Automation",
    slug: "industrial-automation",
    description:
      "Automation systems, PLCs, sensors, robotics and control equipment.",
    isActive: true,
    sortOrder: 28,
  },
  {
    _id: "29",
    name: "Robotics",
    slug: "robotics",
    description:
      "Industrial robots, robotic systems, automation and robotic accessories.",
    isActive: true,
    sortOrder: 29,
  },
  {
    _id: "30",
    name: "Instrumentation & Control",
    slug: "instrumentation-control",
    description:
      "Industrial instruments, measurement systems and process control equipment.",
    isActive: true,
    sortOrder: 30,
  },
  {
    _id: "31",
    name: "Material & Handling Equipment",
    slug: "material-handling-equipment",
    description:
      "Industrial handling, lifting, storage and warehouse equipment.",
    isActive: true,
    sortOrder: 31,
  },
  {
    _id: "32",
    name: "Cleaning & Maintenance",
    slug: "cleaning-maintenance",
    description:
      "Industrial cleaning machines, maintenance products and facility supplies.",
    isActive: true,
    sortOrder: 32,
  },
  {
    _id: "33",
    name: "Water Treatment & Waste Management",
    slug: "water-treatment-waste-management",
    description:
      "Water treatment systems, filtration, wastewater and waste management equipment.",
    isActive: true,
    sortOrder: 33,
  },
  {
    _id: "34",
    name: "Mining & Quarrying",
    slug: "mining-quarrying",
    description:
      "Mining machinery, quarrying equipment and mineral processing solutions.",
    isActive: true,
    sortOrder: 34,
  },
  {
    _id: "35",
    name: "Petroleum & Oil Equipment",
    slug: "petroleum-oil-equipment",
    description:
      "Oil, gas, petroleum handling equipment and related industrial products.",
    isActive: true,
    sortOrder: 35,
  },
  {
    _id: "36",
    name: "Renewable & Environmental Solutions",
    slug: "renewable-environmental-solutions",
    description:
      "Environmental technology, renewable energy and pollution control solutions.",
    isActive: true,
    sortOrder: 36,
  },
  {
    _id: "37",
    name: "Woodworking Machinery",
    slug: "woodworking-machinery",
    description:
      "Wood cutting, processing, furniture and woodworking machinery.",
    isActive: true,
    sortOrder: 37,
  },
  {
    _id: "38",
    name: "Glass & Ceramics",
    slug: "glass-ceramics",
    description:
      "Glass products, ceramic products, manufacturing equipment and supplies.",
    isActive: true,
    sortOrder: 38,
  },
  {
    _id: "39",
    name: "Leather & Footwear",
    slug: "leather-footwear",
    description:
      "Leather products, footwear, machinery and manufacturing supplies.",
    isActive: true,
    sortOrder: 39,
  },
  {
    _id: "40",
    name: "Paper & Pulp",
    slug: "paper-pulp",
    description:
      "Paper products, pulp, paper manufacturing machinery and supplies.",
    isActive: true,
    sortOrder: 40,
  },
  {
    _id: "41",
    name: "Hospitality & Hotel Supplies",
    slug: "hospitality-hotel-supplies",
    description:
      "Hotel, restaurant, catering and hospitality equipment and supplies.",
    isActive: true,
    sortOrder: 41,
  },
  {
    _id: "42",
    name: "Restaurant & Commercial Kitchen",
    slug: "restaurant-commercial-kitchen",
    description:
      "Commercial kitchen equipment, restaurant supplies and food service products.",
    isActive: true,
    sortOrder: 42,
  },
  {
    _id: "43",
    name: "Medical & Hospital Equipment",
    slug: "medical-hospital-equipment",
    description:
      "Hospital equipment, medical devices, diagnostic equipment and healthcare supplies.",
    isActive: true,
    sortOrder: 43,
  },
  {
    _id: "44",
    name: "Beauty & Personal Care",
    slug: "beauty-personal-care",
    description:
      "Beauty products, salon equipment, cosmetics and personal care supplies.",
    isActive: true,
    sortOrder: 44,
  },
  {
    _id: "45",
    name: "Gems, Jewellery & Handicrafts",
    slug: "gems-jewellery-handicrafts",
    description:
      "Jewellery, gemstones, handicrafts, decorative products and artisan goods.",
    isActive: true,
    sortOrder: 45,
  },
  {
    _id: "46",
    name: "Apparel & Fashion",
    slug: "apparel-fashion",
    description:
      "Clothing, fashion accessories, footwear and fashion products.",
    isActive: true,
    sortOrder: 46,
  },
  {
    _id: "47",
    name: "Sports & Fitness",
    slug: "sports-fitness",
    description:
      "Sports equipment, gym equipment, fitness products and accessories.",
    isActive: true,
    sortOrder: 47,
  },
  {
    _id: "48",
    name: "Toys & Games",
    slug: "toys-games",
    description:
      "Toys, games, educational products and recreational equipment.",
    isActive: true,
    sortOrder: 48,
  },
  {
    _id: "49",
    name: "Electrical Cables & Wires",
    slug: "electrical-cables-wires",
    description:
      "Power cables, wires, control cables and electrical wiring products.",
    isActive: true,
    sortOrder: 49,
  },
  {
    _id: "50",
    name: "Industrial Supplies",
    slug: "industrial-supplies",
    description:
      "General industrial consumables, components and manufacturing supplies.",
    isActive: true,
    sortOrder: 50,
  },
];

export default function CategoriesPage() {
  const [search, setSearch] = useState("");

  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <Navbar />

      <main className="categories-page">
        {/* HERO */}
        <section className="categories-hero">
          <div className="categories-hero-content">
            <div className="categories-breadcrumb">
              <Link href="/">Home</Link>
              <span>/</span>
              <span>Categories</span>
            </div>

            <span className="categories-eyebrow">
              ADVIXIO MARKETPLACE
            </span>

            <h1>
              Explore Products by <span>Category</span>
            </h1>

            <p>
              Discover products, manufacturers, suppliers and business
              solutions across multiple industries.
            </p>

            <div className="category-search">
              <span className="category-search-icon">⌕</span>

              <input
                type="text"
                placeholder="Search categories..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />

              <button type="button">Search</button>
            </div>

            <div className="category-hero-stats">
              <div>
                <strong>{categories.length}+</strong>
                <span>Categories</span>
              </div>

              <div>
                <strong>10K+</strong>
                <span>Products</span>
              </div>

              <div>
                <strong>5K+</strong>
                <span>Suppliers</span>
              </div>
            </div>
          </div>
        </section>

        {/* POPULAR CATEGORIES */}
        <section className="popular-category-section">
          <div className="category-section-header">
            <div>
              <span className="section-label">MOST SEARCHED</span>

              <h2>Popular Categories</h2>

              <p>
                Explore some of the most popular business categories
                on Advixio.
              </p>
            </div>

            <span className="category-count">
              {categories.length} Categories
            </span>
          </div>

          <div className="popular-category-grid">
            {filteredCategories.slice(0, 8).map((category, index) => (
              <Link
                href={`/categories/${category.slug}`}
                key={category._id}
                className="popular-category-card"
              >
                <div className="popular-icon">
                  {category.icon || icons[index % icons.length]}
                </div>

                <div>
                  <h3>{category.name}</h3>
                  <p>Explore products</p>
                </div>

                <span className="category-arrow">→</span>
              </Link>
            ))}
          </div>
        </section>

        {/* ALL CATEGORIES */}
        <section className="all-categories-section">
          <div className="category-section-header">
            <div>
              <span className="section-label">BROWSE INDUSTRIES</span>

              <h2>All Categories</h2>

              <p>
                Find the right products and suppliers for your
                business requirements.
              </p>
            </div>

            <div className="category-result-count">
              Showing{" "}
              <strong>{filteredCategories.length}</strong>{" "}
              categories
            </div>
          </div>

          <div className="categories-grid">
            {filteredCategories.map((category, index) => (
              <Link
                href={`/categories/${category.slug}`}
                key={category._id}
                className="category-card"
              >
                <div className="category-card-top">
                  <div className="category-icon">
                    {category.icon || icons[index % icons.length]}
                  </div>

                  <span className="category-number">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>

                <div className="category-card-content">
                  <h3>{category.name}</h3>

                  <p>{category.description}</p>
                </div>

                <div className="category-card-footer">
                  <span>Explore Category</span>

                  <span className="category-card-arrow">
                    →
                  </span>
                </div>
              </Link>
            ))}
          </div>

          {filteredCategories.length === 0 && (
            <div className="category-no-results">
              No categories found for "{search}"
            </div>
          )}
        </section>

        {/* SUPPLIER CTA */}
        <section className="category-supplier-cta">
          <div className="supplier-cta-content">
            <div className="supplier-cta-icon">◈</div>

            <div>
              <span className="section-label">FOR BUSINESS</span>

              <h2>
                Are you a Manufacturer or Supplier?
              </h2>

              <p>
                List your products on Advixio and connect with
                buyers looking for products and services like yours.
              </p>
            </div>

            <div className="supplier-cta-actions">
              <Link
                href="/register"
                className="supplier-primary-button"
              >
                Become a Supplier
              </Link>

              <Link
                href="/products"
                className="supplier-secondary-button"
              >
                Explore Products →
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}