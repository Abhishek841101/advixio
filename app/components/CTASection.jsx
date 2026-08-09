export default function CTASection() {
  return (
    <section className="cta-section">

      {/* Buyer CTA */}
      <div className="cta-box buyer-cta">
        <div className="cta-content">
          <h2>Looking to buy?</h2>

          <p>
            Post your exact requirement and get
            customized quotes from multiple verified
            suppliers fast.
          </p>

          <button className="cta-primary-button">
            Post Requirement Free
          </button>
        </div>
      </div>

      {/* Supplier CTA */}
      <div className="cta-box seller-cta">
        <div className="cta-content">
          <h2>Grow your business</h2>

          <p>
            List your products, receive qualified B2B
            leads, and expand your reach across India.
          </p>

          <button className="cta-outline-button">
            List Products Free
          </button>
        </div>
      </div>

    </section>
  );
}