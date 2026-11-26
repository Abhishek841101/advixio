import { Search, MapPin, SlidersHorizontal, CircleCheck } from "lucide-react";

const STEPS = [
  {
    title: "Search",
    text: "Enter product, supplier or service name.",
    Icon: Search,
  },
  {
    title: "Set Location",
    text: "Choose All India or preferred city/state.",
    Icon: MapPin,
  },
  {
    title: "Apply Filters",
    text: "Refine results by category, price, MOQ, etc.",
    Icon: SlidersHorizontal,
  },
  {
    title: "Get Results",
    text: "Explore relevant products, suppliers and services.",
    Icon: CircleCheck,
  },
] as const;

export default function SearchHowItWorks() {
  return (
    <section
      className="search-how"
      aria-labelledby="search-how-title"
    >
      <div className="search-how__inner">
        <h2 id="search-how-title" className="search-how__title">
          <span className="search-how__title-accent" aria-hidden="true" />
          How Search Works on Advixio360
        </h2>

        <ol className="search-how__steps">
          {STEPS.map((step, index) => {
            const Icon = step.Icon;
            const number = index + 1;
            return (
              <li key={step.title} className="search-how__step">
                <div className="search-how__icon-wrap" aria-hidden="true">
                  <span className="search-how__icon">
                    <Icon size={20} strokeWidth={2} />
                  </span>
                  <span className="search-how__badge">{number}</span>
                </div>
                <div className="search-how__content">
                  <p className="search-how__step-title">{step.title}</p>
                  <p className="search-how__step-text">{step.text}</p>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}