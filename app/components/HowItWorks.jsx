const steps = [
  {
    number: "01",
    icon: "📝",
    title: "Post Your Requirement",
    description:
      "Tell us what products or services you need and share your requirements.",
  },
  {
    number: "02",
    icon: "💬",
    title: "Receive Supplier Quotes",
    description:
      "Connect with verified suppliers and receive competitive quotes for your requirement.",
  },
  {
    number: "03",
    icon: "🤝",
    title: "Compare & Connect",
    description:
      "Compare suppliers, negotiate directly and choose the right business partner.",
  },
];

export default function HowItWorks() {
  return (
    <section className="how-it-works">
      <div className="container">

        <div className="how-header">
          <span className="section-label">
            SIMPLE &amp; FAST
          </span>

          <h2>How Advixio Works</h2>

          <p>
            Find the right suppliers and get your business requirements
            fulfilled in three simple steps.
          </p>
        </div>

        <div className="steps-container">
          {steps.map((step, index) => (
            <div className="step-wrapper" key={step.number}>

              <div className="step-card">

                <div className="step-top">
                  <span className="step-number">
                    {step.number}
                  </span>

                  <div className="step-icon">
                    {step.icon}
                  </div>
                </div>

                <h3>{step.title}</h3>

                <p>{step.description}</p>
              </div>

              {index < steps.length - 1 && (
                <div className="step-arrow">
                  →
                </div>
              )}

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}