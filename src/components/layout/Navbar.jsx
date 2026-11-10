
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

    const handleAuthChange = () => {
      checkLogin();
    };

    window.addEventListener("advixio-auth-change", handleAuthChange);

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

  /* ==============================
     NAVIGATION LINKS
  ============================== */

 const navLinks = [
  { label: "Categories", href: "/#categories" },
  { label: "Products", href: "/#trending-products" },
  { label: "Suppliers", href: "/#featured-suppliers" },
  { label: "How It Works", href: "/#how" },
  { label: "FAQ", href: "/#faq" },
  { label: "Contact", href: "/#contact" },
];

  return (
    <header className="navbar">
      <div className="navbar-container">

        {/* LOGO */}

        <Link
          href="/"
          className="navbar-logo"
          onClick={closeMenu}
        >
          <img
            src="/footerLogo.png"
            alt="Advixio360 Logo"
            className="footer-logo-icon"
            width={42}
            height={42}
            style={{
              display: "block",
              width: "42px",
              height: "42px",
              marginRight: "5px",
              objectFit: "contain",
              borderRadius: "8px",
            }}
          />

          <span>Advixio</span>
        </Link>

        {/* DESKTOP NAVIGATION */}

        <nav className="desktop-nav">
          {navLinks.map((link) => (
            <Link href={link.href} key={link.label}>
              {link.label}
            </Link>
          ))}
        </nav>

        {/* DESKTOP ACTIONS */}

        <div className="navbar-actions">
          {mounted && isLoggedIn ? (
            <>
              <Link
                href="/dashboard"
                className="dashboard-button"
              >
                Dashboard
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

        {/* MOBILE MENU BUTTON */}

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

      {/* MOBILE NAVIGATION */}

      {menuOpen && (
        <div className="mobile-menu">

          {navLinks.map((link) => (
            <Link
              href={link.href}
              key={link.label}
              onClick={closeMenu}
            >
              {link.label}
            </Link>
          ))}

          {/* MOBILE ACTIONS */}

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
