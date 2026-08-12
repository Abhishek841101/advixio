// "use client";

// import { useState } from "react";
// import Link from "next/link";

// export default function Navbar() {
//   const [menuOpen, setMenuOpen] = useState(false);

//   return (
//     <header className="navbar">
//       <div className="navbar-container">

//         {/* Logo */}
//         <a href="/" className="navbar-logo">
//           <span className="logo-icon">A</span>
//           <span>Advixio</span>
//         </a>

//         {/* Desktop Navigation */}
//         <nav className="desktop-nav">
//           <a href="#industries">Categories</a>
//           <a href="#products">Products</a>
//           <a href="#services">Services</a>
//           <a href="#suppliers">Suppliers</a>
//         </nav>

//         {/* Desktop Actions */}
//         <div className="navbar-actions">
//           <button className="login-button">
//             Login
//           </button>

//           <button className="post-button">
//             Post Buy Requirement
//           </button>
//         </div>

//         {/* Mobile Menu Button */}
//         <button
//           className="mobile-menu-button"
//           onClick={() => setMenuOpen(!menuOpen)}
//           aria-label="Toggle menu"
//         >
//           {menuOpen ? "✕" : "☰"}
//         </button>
//       </div>

//       {/* Mobile Navigation */}
//       {menuOpen && (
//         <div className="mobile-menu">
//           <a href="#industries" onClick={() => setMenuOpen(false)}>
//             Categories
//           </a>

//           <a href="#products" onClick={() => setMenuOpen(false)}>
//             Products
//           </a>

//           <a href="#services" onClick={() => setMenuOpen(false)}>
//             Services
//           </a>

//           <a href="#suppliers" onClick={() => setMenuOpen(false)}>
//             Suppliers
//           </a>

//           <div className="mobile-actions">
//             <button className="mobile-login-button">
//               Login
//             </button>

//             <button className="post-button mobile-post-button">
//               Post Buy Requirement
//             </button>
//           </div>
//         </div>
//       )}
//     </header>
//   );
// }



"use client";

import { useState } from "react";
import Link from "next/link";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <header className="navbar">
      <div className="navbar-container">

        {/* Logo */}
        <Link href="/" className="navbar-logo" onClick={closeMenu}>
          <span className="logo-icon">A</span>
          <span>Advixio</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="desktop-nav">
          <Link href="/categories">
            Categories
          </Link>

          <Link href="/products">
            Products
          </Link>

          <Link href="/services">
            Services
          </Link>

          <Link href="/suppliers">
            Suppliers
          </Link>
        </nav>

        {/* Desktop Actions */}
        <div className="navbar-actions">

          <Link href="/login" className="login-button">
            Login
          </Link>

          <Link href="/requirements" className="post-button">
            Post Buy Requirement
          </Link>

        </div>

        {/* Mobile Menu Button */}
        <button
          className="mobile-menu-button"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* Mobile Navigation */}
      {menuOpen && (
        <div className="mobile-menu">

          <Link href="/categories" onClick={closeMenu}>
            Categories
          </Link>

          <Link href="/products" onClick={closeMenu}>
            Products
          </Link>

          <Link href="/services" onClick={closeMenu}>
            Services
          </Link>

          <Link href="/suppliers" onClick={closeMenu}>
            Suppliers
          </Link>

          <div className="mobile-actions">

            <Link
              href="/login"
              className="mobile-login-button"
              onClick={closeMenu}
            >
              Login
            </Link>

            <Link
              href="/requirements"
              className="post-button mobile-post-button"
              onClick={closeMenu}
            >
              Post Buy Requirement
            </Link>

          </div>
        </div>
      )}
    </header>
  );
}