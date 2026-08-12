const features = [
  {
    icon: "✓",
    title: "Verified Suppliers",
    description:
      "Every supplier undergoes strict GST and credential verification before listing.",
    type: "green",
  },
  {
    icon: "◇",
    title: "Bulk Pricing",
    description:
      "Get direct manufacturer pricing and volume discounts without middlemen.",
    type: "blue",
  },
  {
    icon: "🚚",
    title: "Pan-India Network",
    description:
      "Source from anywhere in India with our extensive nationwide supplier base.",
    type: "orange",
  },
  {
    icon: "♧",
    title: "Free RFQ Posting",
    description:
      "Post your requirements for free and let the right suppliers come to you.",
    type: "purple",
  },
];

export default function WhyChoose() {
  return (
    <section className="why-choose">
      <div className="container">

        <div className="why-header">
          <h2>Why Choose Advixio?</h2>
        </div>

        <div className="why-grid">
          {features.map((feature) => (
            <div className="why-card" key={feature.title}>
              
              <div className={`why-icon ${feature.type}`}>
                {feature.icon}
              </div>

              <h3>{feature.title}</h3>

              <p>{feature.description}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}