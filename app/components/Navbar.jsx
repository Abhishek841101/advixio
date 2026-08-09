"use client";

import { useState } from "react";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="navbar">
      <div className="navbar-container">

        {/* Logo */}
        <a href="/" className="navbar-logo">
          <span className="logo-icon">A</span>
          <span>Advixio</span>
        </a>

        {/* Desktop Navigation */}
        <nav className="desktop-nav">
          <a href="#industries">Categories</a>
          <a href="#products">Products</a>
          <a href="#services">Services</a>
          <a href="#suppliers">Suppliers</a>
        </nav>

        {/* Desktop Actions */}
        <div className="navbar-actions">
          <button className="login-button">
            Login
          </button>

          <button className="post-button">
            Post Buy Requirement
          </button>
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
          <a href="#industries" onClick={() => setMenuOpen(false)}>
            Categories
          </a>

          <a href="#products" onClick={() => setMenuOpen(false)}>
            Products
          </a>

          <a href="#services" onClick={() => setMenuOpen(false)}>
            Services
          </a>

          <a href="#suppliers" onClick={() => setMenuOpen(false)}>
            Suppliers
          </a>

          <div className="mobile-actions">
            <button className="mobile-login-button">
              Login
            </button>

            <button className="post-button mobile-post-button">
              Post Buy Requirement
            </button>
          </div>
        </div>
      )}
    </header>
  );
}