import { industries } from "../data/industries";

export default function IndustrySection() {
  return (
    <section className="industry-section" id="industries">
      <div className="container">

        {/* Section Header */}
        <div className="section-header">
          <div>
            <span className="section-label">
              INDUSTRIES
            </span>

            <h2>
              Explore by Industry
            </h2>

            <p>
              Discover trusted suppliers and products across
              India's leading industries.
            </p>
          </div>

          <button className="view-all-button">
            View All Industries →
          </button>
        </div>

        {/* Industry Cards */}
        <div className="industry-grid">
          {industries.map((industry) => (
            <div
              className="industry-card"
              key={industry.name}
            >
              <div className="industry-icon">
                {industry.icon}
              </div>

              <div className="industry-card-content">
                <h3>{industry.name}</h3>

                <p>{industry.description}</p>

                <span className="industry-link">
                  Explore →
                </span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}