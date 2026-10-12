"use client";

import Link from "next/link";
import { Mail, ArrowRight } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-950 text-white">
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <Link
              href="/"
              className="inline-block text-2xl font-bold tracking-tight"
            >
              Advixio<span className="text-blue-400">360</span>
            </Link>

            <p className="mt-4 max-w-sm text-sm leading-6 text-slate-400">
              Connecting businesses with manufacturers, suppliers, and trusted
              sourcing opportunities.
            </p>

            {/* Social Links */}
            <div className="mt-5 flex items-center gap-4 text-sm">
              <a
                href="https://www.facebook.com/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="font-semibold text-slate-400 transition hover:text-white"
              >
                Facebook
              </a>

              <a
                href="https://www.instagram.com/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="text-slate-400 transition hover:text-white"
              >
                Instagram
              </a>

              <a
                href="https://www.linkedin.com/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="text-slate-400 transition hover:text-white"
              >
                LinkedIn
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider">
              Quick Links
            </h3>

            <ul className="mt-4 space-y-3 text-sm text-slate-400">
              <li>
                <Link href="/" className="transition hover:text-white">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="transition hover:text-white">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/products" className="transition hover:text-white">
                  Products
                </Link>
              </li>
              <li>
                <Link href="/contact" className="transition hover:text-white">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Business */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider">
              For Business
            </h3>

            <ul className="mt-4 space-y-3 text-sm text-slate-400">
              <li>
                <Link
                  href="/suppliers"
                  className="transition hover:text-white"
                >
                  Find Suppliers
                </Link>
              </li>
              <li>
                <Link
                  href="/categories"
                  className="transition hover:text-white"
                >
                  Browse Categories
                </Link>
              </li>
              <li>
                <Link
                  href="/register"
                  className="transition hover:text-white"
                >
                  Join Advixio
                </Link>
              </li>
              <li>
                <Link href="/login" className="transition hover:text-white">
                  Sign In
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider">
              Contact
            </h3>

            <p className="mt-4 text-sm leading-6 text-slate-400">
              Have questions about sourcing or joining our platform? Get in
              touch with our team.
            </p>

            <Link
              href="/contact"
              className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-blue-400 transition hover:text-blue-300"
            >
              Contact Us <ArrowRight size={16} />
            </Link>

            <a
              href="mailto:support@advixio360.com"
              className="mt-3 flex items-center gap-2 text-sm text-slate-400 transition hover:text-white"
            >
              <Mail size={16} />
              support@advixio360.com
            </a>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-10 border-t border-slate-800 pt-6 text-center text-sm text-slate-500">
          © {currentYear} Advixio360. All rights reserved.
        </div>
      </div>
    </footer>
  );
}