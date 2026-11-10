
import React from "react";

const PostProductCTA = () => {
  const benefits = [
    "Free Product Listing",
    "Business Profile",
    "Buyer Enquiries",
    "Pan-India Discovery",
  ];

  return (
    <section className="post-product-section" id="post">
      <div className="post-product-container">
        <div className="post-product-content">
          <span className="post-product-tag">GROW YOUR BUSINESS</span>

          <h2>
            Free Post Your Product &amp;{" "}
            <span>Reach More Buyers</span>
          </h2>

          <p>
            Showcase your products on Advixio360 and make your business
            easier to discover by buyers searching for suppliers.
          </p>

          <div className="post-product-benefits">
            {benefits.map((item, index) => (
              <div className="post-product-benefit" key={index}>
                <span className="post-benefit-check">✓</span>
                {item}
              </div>
            ))}
          </div>
        </div>

        <div className="post-product-panel">
          <div className="post-panel-heading">
            <h3>Start Listing Your Product</h3>
            <p>Get your products in front of potential buyers.</p>
          </div>

          <form>
            <div className="post-form-group">
              <label htmlFor="post-product-name">Product Name</label>
              <input
                id="post-product-name"
                type="text"
                placeholder="Enter product name"
                required
              />
            </div>

            <div className="post-form-group">
              <label htmlFor="post-product-category">Product Category</label>
              <select
                id="post-product-category"
                required
                defaultValue=""
              >
                <option value="" disabled>
                  Select product category
                </option>
                <option value="Industrial Machinery">Industrial Machinery</option>
                <option value="Construction">Construction</option>
                <option value="Electronics">Electronics</option>
                <option value="Textiles">Textiles</option>
              </select>
            </div>

            <div className="post-form-group">
              <label htmlFor="post-business-location">
                Business Location
              </label>
              <input
                id="post-business-location"
                type="text"
                placeholder="Enter city or location"
                required
              />
            </div>

            <button type="submit" className="post-product-submit">
              List Product Free <span>→</span>
            </button>
          </form>

          <div className="post-panel-note">
            Free registration · No listing charges
          </div>
        </div>
      </div>
    </section>
  );
};

export default PostProductCTA;
