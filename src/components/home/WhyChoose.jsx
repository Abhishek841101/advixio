
const features = [
  {
    icon: "✓",
    title: "Verified Business Profiles",
    description:
      "Discover businesses with structured profiles and verification information.",
  },
  {
    icon: "⌕",
    title: "Easy Product Discovery",
    description:
      "Search products and suppliers by category, location and business type.",
  },
  {
    icon: "↗",
    title: "Direct Supplier Connection",
    description:
      "Move from discovery to enquiry without unnecessary complexity.",
  },
  {
    icon: "▣",
    title: "Detailed Listings",
    description:
      "See products, business information, location and useful supplier details.",
  },
  {
    icon: "＋",
    title: "Free Product Posting",
    description:
      "Give suppliers a simple way to showcase products and reach buyers.",
  },
  {
    icon: "◎",
    title: "Local + Pan-India Reach",
    description:
      "Discover businesses near you while exploring suppliers across India.",
  },
];

export default function WhyChooseAdvixio() {
  return (
    <section className="why-advixio-section">
      <div className="why-advixio-container">

        {/* Section Heading */}
        <div className="why-advixio-heading">
          

          <h2>Why Choose Advixio360?</h2>

          <p>
            Built to make B2B business discovery simpler,
            clearer and more accessible.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="why-advixio-grid">
          {features.map((feature, index) => (
            <div
              className="why-advixio-card"
              key={feature.title}
              style={{
                animationDelay: `${index * 100}ms`,
              }}
            >
              <div className="why-advixio-icon">
                <span>{feature.icon}</span>
              </div>

              <div className="why-advixio-card-content">
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>

              <span className="why-advixio-card-number">
                0{index + 1}
              </span>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
