// import SearchBar from "./SearchBar";

// export default function Hero() {
//   return (
//     <section className="hero">
//       <div className="hero-overlay" />

//       <div className="hero-content container">
//         <div className="hero-badge">
//           <span className="hero-badge-dot" />
//           Trusted by 1,50,000+ Indian businesses
//         </div>

//         <h1>
//           India&apos;s #1 Platform
//           <br />
//           for <span>B2B Sourcing &amp; Trade</span>
//         </h1>

//         <p className="hero-description">
//           Connect with verified manufacturers, suppliers and businesses
//           across India. Find quality products and grow your business.
//         </p>

//         <SearchBar />

//         <div className="hero-stats">
//           <div className="hero-stat">
//             <strong>1,50,000+</strong>
//             <span>Verified Suppliers</span>
//           </div>

//           <div className="hero-stat-divider" />

//           <div className="hero-stat">
//             <strong>1,200+</strong>
//             <span>Industries</span>
//           </div>

//           <div className="hero-stat-divider" />

//           <div className="hero-stat verified-stat">
//             <strong>✓</strong>
//             <span>GST Verified</span>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }import SearchBar from "./SearchBar";

import SearchBar from "./SearchBar";

export default function Hero() {
  return (
    <section className="hero">

      <div className="hero-overlay" />

      <div className="hero-content container">

        <div className="hero-badge">
          <span className="hero-badge-dot" />
          INDIA'S #1 B2B BUSINESS MARKETPLACE
        </div>

        <h1>
          Find the Right
          <br />

          <span className="hero-highlight">
            Products &amp; Suppliers
          </span>

          <br />

          for Your Business
        </h1>

        <p className="hero-description">
          Discover manufacturers, suppliers, products and business services
          from across India in one place.
        </p>

        <SearchBar />

        <div className="hero-stats">

          <div className="hero-stat">
            <strong>1,50,000+</strong>
            <span>Verified Suppliers</span>
          </div>

          <div className="hero-stat-divider" />

          <div className="hero-stat">
            <strong>1,200+</strong>
            <span>Industries</span>
          </div>

          <div className="hero-stat-divider" />

          <div className="hero-stat verified-stat">
            <strong>✓</strong>
            <span>GST Verified</span>
          </div>

        </div>

      </div>

    </section>
  );
}