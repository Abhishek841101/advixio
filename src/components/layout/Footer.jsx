export default function Footer() {
  return (
    <footer className="footer">

      <div className="footer-main container">

        {/* Brand */}
        <div className="footer-brand">
          <a href="/" className="footer-logo">
            <span className="footer-logo-icon">A</span>
            <span>Advixio</span>
          </a>

          <p>
            India&apos;s trusted B2B sourcing platform
            connecting verified suppliers with buyers
            across the nation.
          </p>
        </div>

        {/* Quick Links */}
        <div className="footer-column">
          <h3>Quick Links</h3>

          <a href="#">Sell on Advixio</a>
          <a href="#">Post Buy Requirement</a>
          <a href="#">Browse Suppliers</a>
          <a href="#">Success Stories</a>
        </div>

        {/* Categories */}
        <div className="footer-column">
          <h3>Popular Categories</h3>

          <a href="#">Industrial Machinery</a>
          <a href="#">Chemicals</a>
          <a href="#">Textiles &amp; Apparel</a>
          <a href="#">Electronics &amp; Electrical</a>
        </div>

        {/* Contact */}
        <div className="footer-column">
          <h3>Contact Us</h3>

          <a href="mailto:support@advixio.com">
            support@advixio.com
          </a>

          <a href="tel:+911234567890">
            
            +91 9955607199
          </a>

          <div className="social-links">
            <a href="#" aria-label="LinkedIn">in</a>
            <a href="#" aria-label="Twitter">𝕏</a>
            <a href="#" aria-label="Facebook">f</a>
            <a href="#" aria-label="Instagram">◎</a>
          </div>
        </div>

      </div>

      {/* Bottom */}
      <div className="footer-bottom">
        <div className="container footer-bottom-inner">

          <p>
            © 2026 Advixio. All rights reserved.
          </p>

          <div>
            <a href="#">Terms of Service</a>
            <a href="#">Privacy Policy</a>
          </div>

        </div>
      </div>

    </footer>
  );
}