
"use client";

import { useState } from "react";

type ProductField = {
  name?: string;
  label?: string;
  value?: string;
};

type ProductInfoTabsProps = {
  customFields: ProductField[];
  specifications: ProductField[];
  companyName: string;
  city: string;
  state: string;
  country: string;
};

type TabKey = "additional" | "specifications" | "business";

export default function ProductInfoTabs({
  customFields,
  specifications,
  companyName,
  city,
  state,
  country,
}: ProductInfoTabsProps) {
  const [activeTab, setActiveTab] = useState<TabKey>("additional");

  const tabs: { id: TabKey; label: string }[] = [
    { id: "additional", label: "Additional Details" },
    { id: "specifications", label: "Specifications" },
    { id: "business", label: "Business Information" },
  ];

  const getFieldName = (field: ProductField) =>
    field.name?.trim() || field.label?.trim() || "";

  const businessFields = [
    { label: "Company Name", value: companyName },
    { label: "City", value: city },
    { label: "State", value: state },
    { label: "Country", value: country },
  ];

  return (
    <section className="product-info-tabs-card">
      <div className="product-info-tabs-header">
        <div>
          <span className="product-info-tabs-eyebrow">
            PRODUCT INFORMATION
          </span>
          <h2>Product Details</h2>
        </div>
      </div>

      <div
        className="product-info-tabs-nav"
        role="tablist"
        aria-label="Product information"
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={activeTab === tab.id}
            className={`product-info-tab ${
              activeTab === tab.id ? "active" : ""
            }`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="product-info-tabs-content">
        {activeTab === "additional" && (
          <div role="tabpanel">
            {customFields.length > 0 ? (
              <div className="product-info-fields">
                {customFields.map((field, index) => (
                  <div
                    className="product-info-field"
                    key={`custom-${getFieldName(field)}-${index}`}
                  >
                    <span>{getFieldName(field)}</span>
                    <strong>{String(field.value)}</strong>
                  </div>
                ))}
              </div>
            ) : (
              <p className="product-info-empty">
                No additional product details available.
              </p>
            )}
          </div>
        )}

        {activeTab === "specifications" && (
          <div role="tabpanel">
            {specifications.length > 0 ? (
              <div className="product-info-fields">
                {specifications.map((field, index) => (
                  <div
                    className="product-info-field"
                    key={`spec-${getFieldName(field)}-${index}`}
                  >
                    <span>{getFieldName(field)}</span>
                    <strong>{String(field.value)}</strong>
                  </div>
                ))}
              </div>
            ) : (
              <p className="product-info-empty">
                No product specifications available.
              </p>
            )}
          </div>
        )}

        {activeTab === "business" && (
          <div role="tabpanel">
            <div className="product-info-fields">
              {businessFields.map((field) => (
                <div className="product-info-field" key={field.label}>
                  <span>{field.label}</span>
                  <strong>{field.value || "Not provided"}</strong>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
