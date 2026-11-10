// "use client";

// import { useState } from "react";

// export default function SearchBar() {
//   const [category, setCategory] = useState("All Categories");

//   return (
//     <div className="hero-search">
//       <div className="search-input-wrapper">
//         <span className="search-icon">⌕</span>

//         <input
//           type="text"
//           placeholder="What are you looking to buy?"
//           aria-label="Search products"
//         />
//       </div>

//       <div className="search-category">
//         <select
//           value={category}
//           onChange={(e) => setCategory(e.target.value)}
//           aria-label="Select category"
//         >
//           <option>All Categories</option>
//           <option>Automotive</option>
//           <option>Industrial Machinery</option>
//           <option>Electrical & Electronics</option>
//           <option>Construction</option>
//           <option>Raw Materials</option>
//           <option>Packaging</option>
//           <option>Textiles</option>
//           <option>Chemicals</option>
//           <option>IT & Software</option>
//         </select>
//       </div>

//       <button className="hero-search-button">
//         Search
//       </button>
//     </div>
//   );
// }




"use client";

import { useState } from "react";

export default function SearchBar() {
  const [category, setCategory] = useState("All Categories");
  const [search, setSearch] = useState("");

  const categories = [
    "All Categories",
    "Industrial Machinery",
    "Construction & Building",
    "Electronics & Electrical",
    "Textiles & Garments",
    "Packaging & Printing",
    "Food & Agriculture",
    "Health & Medical",
    "Chemicals",
    "Raw Materials",
  ];

  const handleSearch = (e) => {
    e.preventDefault();

    if (!search.trim()) return;

    const params = new URLSearchParams({
      search: search.trim(),
      category,
    });

    window.location.href = `/products?${params.toString()}`;
  };

  return (
    <form
      className="hero-search hero-search-redesign"
      onSubmit={handleSearch}
    >
      <div className="search-input-wrapper">
        <span className="search-icon">⌕</span>

        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search products, suppliers or services..."
          aria-label="Search products and suppliers"
        />
      </div>

      <div className="search-category">
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          aria-label="Select category"
        >
          {categories.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </div>

      <button type="submit" className="hero-search-button">
        Search <span>→</span>
      </button>
    </form>
  );
}