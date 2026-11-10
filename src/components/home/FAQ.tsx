"use client";

import { useState } from "react";

const faqs = [
  {
    question: "What is Advixio360?",
    answer:
      "Advixio360 is a B2B marketplace designed to help buyers discover suppliers, products, manufacturers, wholesalers and business service providers.",
  },
  {
    question: "Can suppliers list their products?",
    answer:
      "Yes. Suppliers can use the product listing flow to showcase products and make their business easier for buyers to discover.",
  },
  {
    question: "Can buyers contact suppliers directly?",
    answer:
      "Yes. Business and product listings can provide enquiry and contact options so buyers can connect with relevant suppliers.",
  },
  {
    question: "Can I search suppliers by city?",
    answer:
      "Yes. You can explore suppliers by city and discover businesses across different locations in India.",
  },
  {
    question: "Is posting a product free?",
    answer:
      "Suppliers can use the product-posting flow according to the platform's current listing and subscription rules.",
  },
];

export default function FAQ() {
  const [activeIndex, setActiveIndex] = useState<number | null>(0);

  return (
    <section className="faq-section">
      <div className="faq-container">
        <div className="faq-layout">
          <div className="faq-art">
            <div className="faq-character">
              <span>?</span>
            </div>

            <span className="faq-label">HELP CENTER</span>

            <h2>Questions? We're here to help.</h2>

            <p>
              Learn how buyers and suppliers can use Advixio360 to discover
              products and grow their business.
            </p>
          </div>

          <div className="faq-content">
            <div className="faq-heading">
              
              
            </div>

            <div className="faq-list">
              {faqs.map((item, index) => {
                const isOpen = activeIndex === index;

                return (
                  <div
                    className={`faq-item ${isOpen ? "open" : ""}`}
                    key={item.question}
                  >
                    <button
                      type="button"
                      className="faq-question"
                      aria-expanded={isOpen}
                      onClick={() =>
                        setActiveIndex(isOpen ? null : index)
                      }
                    >
                      <span>{item.question}</span>
                      <span className="faq-toggle">
                        {isOpen ? "−" : "+"}
                      </span>
                    </button>

                    <div className="faq-answer">
                      <div>
                        <p>{item.answer}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}