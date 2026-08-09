"use client";

import { useState } from "react";

export default function SearchBar() {
  const [category, setCategory] = useState("All Categories");

  return (
    <div className="hero-search">
      <div className="search-input-wrapper">
        <span className="search-icon">⌕</span>

        <input
          type="text"
          placeholder="What are you looking to buy?"
          aria-label="Search products"
        />
      </div>

      <div className="search-category">
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          aria-label="Select category"
        >
          <option>All Categories</option>
          <option>Automotive</option>
          <option>Industrial Machinery</option>
          <option>Electrical & Electronics</option>
          <option>Construction</option>
          <option>Raw Materials</option>
          <option>Packaging</option>
          <option>Textiles</option>
          <option>Chemicals</option>
          <option>IT & Software</option>
        </select>
      </div>

      <button className="hero-search-button">
        Search
      </button>
    </div>
  );
}