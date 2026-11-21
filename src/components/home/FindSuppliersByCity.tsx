"use client";

import { useState } from "react";

const cities = [
  "Nagpur",
  "Mumbai",
  "Pune",
  "Delhi",
  "Ahmedabad",
  "Bengaluru",
  "Hyderabad",
  "Chennai",
  "Kolkata",
  "Surat",
  "Jaipur",
  "Indore",
];

export default function FindSuppliersByCity() {
  const [showAll, setShowAll] = useState(false);

  return (
    <section className="find-city-section">
      <div className="find-city-container">
        <div className="find-city-heading">
          
          <h2>Find Suppliers by City</h2>
          <p>
            Explore businesses and suppliers in major Indian business markets.
          </p>
        </div>

        <div className={`find-city-grid ${showAll ? "expanded" : ""}`}>
          {cities.map((city) => (
            <a
              href={`/suppliers?search=${encodeURIComponent(city)}`}
              className="find-city-card"
              key={city}
            >
              <span className="find-city-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0Z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
              </span>
              <span className="find-city-name">{city}</span>
              <span className="find-city-arrow" aria-hidden="true">↗</span>
            </a>
          ))}
        </div>

        <button
          type="button"
          className="find-city-more"
          onClick={() => setShowAll((prev) => !prev)}
        >
          {showAll ? "Show Less" : "See More Cities"}
          <span>{showAll ? "↑" : "↓"}</span>
        </button>
      </div>
    </section>
  );
}