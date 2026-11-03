
"use client";

import { useState } from "react";

type DetailField = {
  name: string;
  value: string;
};

type Props = {
  customFields: DetailField[];
  specifications: DetailField[];
  companyName: string;
  city: string;
  state: string;
  country: string;
};

const tabs = [
  { id: "additional", label: "Additional Details" },
  { id: "specifications", label: "Specifications" },
  { id: "business", label: "Business Information" },
] as const;

type TabId = (typeof tabs)[number]["id"];

function DetailsTable({ fields }: { fields: DetailField[] }) {
  if (!fields.length) {
    return (
      <p className="product-tabs-empty">
        No information available.
      </p>
    );
  }

  return (
    <div className="specifications-table">
      {fields.map((field, index) => (
        <div
          className="specification-row"
          key={`${field.name}-${index}`}
        >
          <div className="specification-label">
            {field.name}
          </div>

          <div className="specification-value">
            {field.value}
          </div>
        </div>
      ))}
    </div>
  );
}

export default function ProductDetailTabs({
  customFields,
  specifications,
  companyName,
  city,
  state,
  country,
}: Props) {
  const [activeTab, setActiveTab] = useState<TabId>("additional");

  const businessFields: DetailField[] = [
    { name: "Company Name", value: companyName },
    { name: "City", value: city },
    { name: "State", value: state },
    { name: "Country", value: country },
  ];

  return (
    <section className="product-information-card product-tabs-card">
      <div className="product-tabs-heading">
        <span className="product-tabs-eyebrow">
          PRODUCT INFORMATION
        </span>

        <h2>Product Details</h2>
      </div>

      <div
        className="product-tabs-navigation"
        role="tablist"
        aria-label="Product information"
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={activeTab === tab.id}
            aria-controls={`product-panel-${tab.id}`}
            className={`product-tab-button ${
              activeTab === tab.id ? "active" : ""
            }`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div
        className="product-tabs-content"
        role="tabpanel"
        id={`product-panel-${activeTab}`}
      >
        {activeTab === "additional" && (
          <DetailsTable fields={customFields} />
        )}

        {activeTab === "specifications" && (
          <DetailsTable fields={specifications} />
        )}

        {activeTab === "business" && (
          <DetailsTable fields={businessFields} />
        )}
      </div>
    </section>
  );
}
