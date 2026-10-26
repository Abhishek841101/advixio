export default function Footer() {
  const styles = {
    footer: {
      background: "linear-gradient(135deg, #0d1022 0%, #151832 100%)",
      color: "#ffffff",
      paddingTop: "65px",
      fontFamily: "inherit",
    },

    main: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 220px), 1fr))",
      gap: "42px",
      paddingBottom: "50px",
    },

    logo: {
      display: "inline-flex",
      alignItems: "center",
      gap: "2px",
      color: "#ffffff",
      fontSize: "36px",
      fontWeight: 800,
      letterSpacing: "-1.5px",
      textDecoration: "none",
    },

    logoAccent: {
      color: "#a78bfa",
    },

    description: {
      maxWidth: "360px",
      marginTop: "22px",
      color: "#b8bfd3",
      fontSize: "17px",
      lineHeight: 1.9,
    },

    heading: {
      marginBottom: "24px",
      color: "#ffffff",
      fontSize: "21px",
      fontWeight: 750,
    },

    links: {
      display: "flex",
      flexDirection: "column",
      gap: "17px",
    },

    link: {
      color: "#b8bfd3",
      textDecoration: "none",
      fontSize: "17px",
      lineHeight: 1.6,
      overflowWrap: "anywhere",
    },

    socialLinks: {
      display: "flex",
      flexWrap: "wrap",
      gap: "12px",
      marginTop: "25px",
    },

    social: {
      display: "inline-flex",
      width: "44px",
      height: "44px",
      alignItems: "center",
      justifyContent: "center",
      border: "1px solid rgba(255,255,255,0.15)",
      borderRadius: "12px",
      background: "rgba(255,255,255,0.05)",
      color: "#ffffff",
      textDecoration: "none",
      fontSize: "18px",
      fontWeight: 700,
    },

    contactButton: {
      display: "inline-flex",
      alignItems: "center",
      gap: "9px",
      marginTop: "25px",
      padding: "14px 21px",
      borderRadius: "10px",
      background: "linear-gradient(135deg, #7c3aed, #6d28d9)",
      color: "#ffffff",
      textDecoration: "none",
      fontSize: "16px",
      fontWeight: 650,
    },

    bottom: {
      borderTop: "1px solid rgba(255,255,255,0.12)",
      padding: "25px 0",
    },

    bottomInner: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      flexWrap: "wrap",
      gap: "18px",
    },

    bottomText: {
      margin: 0,
      color: "#a5aec4",
      fontSize: "15px",
      lineHeight: 1.8,
    },

    bottomLinks: {
      display: "flex",
      flexWrap: "wrap",
      gap: "22px",
    },
  };

  const footerLink = (href, text) => (
    <a
      href={href}
      className="footer-redesign-link"
      style={styles.link}
    >
      {text}
    </a>
  );

  return (
    <footer className="footer" style={styles.footer}>
      {/* Main Footer */}
      <div
        className="footer-main container"
        style={styles.main}
      >
        {/* Brand */}
        <div className="footer-brand">
          <a href="/" className="footer-logo" style={styles.logo}>
            
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


            <span>
              Advixio
              <span style={styles.logoAccent}>360</span>
            </span>
          </a>

          <p style={styles.description}>
            India&apos;s trusted B2B sourcing platform connecting verified
            suppliers with buyers, products and business opportunities
            across the nation.
          </p>

          <div
            className="social-links"
            style={styles.socialLinks}
          >
            <a href="#" aria-label="LinkedIn" style={styles.social}>
              in
            </a>
            <a href="#" aria-label="X" style={styles.social}>
              𝕏
            </a>
            <a href="#" aria-label="Facebook" style={styles.social}>
              f
            </a>
            <a href="#" aria-label="Instagram" style={styles.social}>
              ◎
            </a>
          </div>
        </div>

        {/* Quick Links */}
        
<div className="footer-column">
  <h3 style={styles.heading}>Quick Links</h3>

  <div style={styles.links}>
    {footerLink("/", "Home")}
    {footerLink("/about", "About Us")}
    {footerLink("/blogs", "Blogs")}
    {footerLink("/products", "Products")}
    {footerLink("/contact", "Contact Us")}
  </div>
</div>


        {/* Categories */}
        <div className="footer-column">
          <h3 style={styles.heading}>Popular Categories</h3>

          <div style={styles.links}>
            {footerLink("#", "Industrial Machinery")}
            {footerLink("#", "Chemicals")}
            {footerLink("#", "Textiles & Apparel")}
            {footerLink("#", "Electronics & Electrical")}
          </div>
        </div>

        {/* Contact */}
        <div className="footer-column">
          <h3 style={styles.heading}>Contact Us</h3>

          <div style={styles.links}>
            {footerLink(
              "mailto:advixio12@gmail.com",
              "advixio12@gmail.com"
            )}

            {footerLink(
              "tel:+918530955850",
              "+91 8530955850"
            )}
          </div>

          <a href="/contact" style={styles.contactButton}>
            Get in Touch <span aria-hidden="true">→</span>
          </a>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="footer-bottom" style={styles.bottom}>
        <div
          className="container footer-bottom-inner"
          style={styles.bottomInner}
        >
          <div>
            <p style={styles.bottomText}>
              © 2026 Advixio360. All rights reserved.
            </p>

            <p
              style={{
                ...styles.bottomText,
                marginTop: "5px",
              }}
            >
              B2B Business Discovery Marketplace
            </p>
          </div>

          <div style={styles.bottomLinks}>
            {footerLink("#", "Terms of Service")}
            {footerLink("#", "Privacy Policy")}
          </div>
        </div>
      </div>
    </footer>
  );
}