
const steps = [
  {
    number: "01",
    icon: "⌕",
    title: "Search",
    description:
      "Search for products, suppliers, manufacturers or services.",
  },
  {
    number: "02",
    icon: "▦",
    title: "Explore & Compare",
    description:
      "Review business profiles, products, locations and details.",
  },
  {
    number: "03",
    icon: "➜",
    title: "Send Enquiry",
    description:
      "Contact relevant businesses or share your requirement.",
  },
  {
    number: "04",
    icon: "✓",
    title: "Connect & Grow",
    description:
      "Discuss your requirements and build valuable business connections.",
  },
];

export default function HowAdvixioWorks() {
  return (
    <section className="how-advixio-section">
      <div className="how-advixio-container">

        <div className="how-advixio-heading">
          <h2>How Advixio360 Works</h2>
          <p>
            A simple four-step journey from discovery to business connection.
          </p>
        </div>

        <div className="how-advixio-grid">
          {steps.map((step) => (
            <div className="how-advixio-card" key={step.number}>
              <div className="how-advixio-step">
                STEP {step.number}
              </div>

              <div className="how-advixio-icon">
                <span>{step.icon}</span>
              </div>

              <h3>{step.title}</h3>

              <p>{step.description}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
