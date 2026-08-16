// // "use client";

// // import { useState } from "react";
// // import Link from "next/link";

// // export default function Navbar() {
// //   const [menuOpen, setMenuOpen] = useState(false);

// //   return (
// //     <header className="navbar">
// //       <div className="navbar-container">

// //         {/* Logo */}
// //         <a href="/" className="navbar-logo">
// //           <span className="logo-icon">A</span>
// //           <span>Advixio</span>
// //         </a>

// //         {/* Desktop Navigation */}
// //         <nav className="desktop-nav">
// //           <a href="#industries">Categories</a>
// //           <a href="#products">Products</a>
// //           <a href="#services">Services</a>
// //           <a href="#suppliers">Suppliers</a>
// //         </nav>

// //         {/* Desktop Actions */}
// //         <div className="navbar-actions">
// //           <button className="login-button">
// //             Login
// //           </button>

// //           <button className="post-button">
// //             Post Buy Requirement
// //           </button>
// //         </div>

// //         {/* Mobile Menu Button */}
// //         <button
// //           className="mobile-menu-button"
// //           onClick={() => setMenuOpen(!menuOpen)}
// //           aria-label="Toggle menu"
// //         >
// //           {menuOpen ? "✕" : "☰"}
// //         </button>
// //       </div>

// //       {/* Mobile Navigation */}
// //       {menuOpen && (
// //         <div className="mobile-menu">
// //           <a href="#industries" onClick={() => setMenuOpen(false)}>
// //             Categories
// //           </a>

// //           <a href="#products" onClick={() => setMenuOpen(false)}>
// //             Products
// //           </a>

// //           <a href="#services" onClick={() => setMenuOpen(false)}>
// //             Services
// //           </a>

// //           <a href="#suppliers" onClick={() => setMenuOpen(false)}>
// //             Suppliers
// //           </a>

// //           <div className="mobile-actions">
// //             <button className="mobile-login-button">
// //               Login
// //             </button>

// //             <button className="post-button mobile-post-button">
// //               Post Buy Requirement
// //             </button>
// //           </div>
// //         </div>
// //       )}
// //     </header>
// //   );
// // }



// "use client";

// import { useState } from "react";
// import Link from "next/link";

// export default function Navbar() {
//   const [menuOpen, setMenuOpen] = useState(false);

//   const closeMenu = () => {
//     setMenuOpen(false);
//   };

//   return (
//     <header className="navbar">
//       <div className="navbar-container">

//         {/* Logo */}
//         <Link href="/" className="navbar-logo" onClick={closeMenu}>
//           <span className="logo-icon">A</span>
//           <span>Advixio</span>
//         </Link>

//         {/* Desktop Navigation */}
//         <nav className="desktop-nav">
//           <Link href="/categories">
//             Categories
//           </Link>

//           <Link href="/products">
//             Products
//           </Link>

//           <Link href="/services">
//             Services
//           </Link>

//           <Link href="/suppliers">
//             Suppliers
//           </Link>
//         </nav>

//         {/* Desktop Actions */}
//         <div className="navbar-actions">

//           <Link href="/login" className="login-button">
//             Login
//           </Link>

//           <Link href="/requirements" className="post-button">
//             Post Buy Requirement
//           </Link>

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

//           <Link href="/categories" onClick={closeMenu}>
//             Categories
//           </Link>

//           <Link href="/products" onClick={closeMenu}>
//             Products
//           </Link>

//           <Link href="/services" onClick={closeMenu}>
//             Services
//           </Link>

//           <Link href="/suppliers" onClick={closeMenu}>
//             Suppliers
//           </Link>

//           <div className="mobile-actions">

//             <Link
//               href="/login"
//               className="mobile-login-button"
//               onClick={closeMenu}
//             >
//               Login
//             </Link>

//             <Link
//               href="/requirements"
//               className="post-button mobile-post-button"
//               onClick={closeMenu}
//             >
//               Post Buy Requirement
//             </Link>

//           </div>
//         </div>
//       )}
//     </header>
//   );
// }




"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function Navbar() {
const [menuOpen, setMenuOpen] = useState(false);
const [isLoggedIn, setIsLoggedIn] = useState(false);
const [mounted, setMounted] = useState(false);

/* ==============================
CHECK LOGIN
============================== */

const checkLogin = () => {
const token = localStorage.getItem("advixio_token");


setIsLoggedIn(Boolean(token));


};

useEffect(() => {
setMounted(true);
checkLogin();


/*
  Login/Register ke baad agar localStorage change ho
  to navbar update karne ke liye custom event.
*/

const handleAuthChange = () => {
  checkLogin();
};

window.addEventListener(
  "advixio-auth-change",
  handleAuthChange
);

return () => {
  window.removeEventListener(
    "advixio-auth-change",
    handleAuthChange
  );
};


}, []);

/* ==============================
CLOSE MOBILE MENU
============================== */

const closeMenu = () => {
setMenuOpen(false);
};

/* ==============================
LOGOUT
============================== */

const handleLogout = () => {
localStorage.removeItem("advixio_token");
localStorage.removeItem("advixio_user");


setIsLoggedIn(false);
setMenuOpen(false);

window.location.href = "/";


};

return ( <header className="navbar"> <div className="navbar-container">


    {/* ==============================
        LOGO
    ============================== */}

    <Link
      href="/"
      className="navbar-logo"
      onClick={closeMenu}
    >
      <span className="logo-icon">
        A
      </span>

      <span>
        Advixio
      </span>
    </Link>


    {/* ==============================
        DESKTOP NAVIGATION
    ============================== */}

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


    {/* ==============================
        DESKTOP ACTIONS
    ============================== */}

    <div className="navbar-actions">

      {mounted && isLoggedIn ? (
        <>
          <Link
            href="/dashboard"
            className="dashboard-button"
          >
            Dashboard
          </Link>

          <Link
            href="/requirements"
            className="post-button"
          >
            Post Buy Requirement
          </Link>

          <button
            type="button"
            className="logout-button"
            onClick={handleLogout}
          >
            Logout
          </button>
        </>
      ) : (
        <>
          <Link
            href="/login"
            className="login-button"
          >
            Login
          </Link>

          <Link
            href="/requirements"
            className="post-button"
          >
            Post Buy Requirement
          </Link>
        </>
      )}

    </div>


    {/* ==============================
        MOBILE MENU BUTTON
    ============================== */}

    <button
      type="button"
      className="mobile-menu-button"
      onClick={() => setMenuOpen(!menuOpen)}
      aria-label="Toggle menu"
      aria-expanded={menuOpen}
    >
      {menuOpen ? "✕" : "☰"}
    </button>

  </div>


  {/* ==============================
      MOBILE NAVIGATION
  ============================== */}

  {menuOpen && (
    <div className="mobile-menu">

      <Link
        href="/categories"
        onClick={closeMenu}
      >
        Categories
      </Link>

      <Link
        href="/products"
        onClick={closeMenu}
      >
        Products
      </Link>

      <Link
        href="/services"
        onClick={closeMenu}
      >
        Services
      </Link>

      <Link
        href="/suppliers"
        onClick={closeMenu}
      >
        Suppliers
      </Link>


      {/* ==============================
          MOBILE ACTIONS
      ============================== */}

      <div className="mobile-actions">

        {mounted && isLoggedIn ? (
          <>
            <Link
              href="/dashboard"
              className="mobile-dashboard-button"
              onClick={closeMenu}
            >
              Dashboard
            </Link>

            <Link
              href="/requirements"
              className="post-button mobile-post-button"
              onClick={closeMenu}
            >
              Post Buy Requirement
            </Link>

            <button
              type="button"
              className="mobile-logout-button"
              onClick={handleLogout}
            >
              Logout
            </button>
          </>
        ) : (
          <>
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
          </>
        )}

      </div>

    </div>
  )}
</header>


);
}
