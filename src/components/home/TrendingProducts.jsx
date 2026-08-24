const products = [
  {
    name: "Industrial Pumps (Heavy Duty)",
    price: "₹45,000 - ₹1,20,000",
    moq: "5 Units",
    supplier: "Sharma Industrial Supplies",
    image:
      "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Premium Cotton Yarn (100% Pure)",
    price: "₹250 - ₹400 / kg",
    moq: "500 kg",
    supplier: "Gupta Textile Mills",
    image:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "MS Angle Iron (40×40)",
    price: "₹58 - ₹70 / kg",
    moq: "5 Tons",
    supplier: "Reddy Construction Materials",
    image:
      "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Lithium Ion Battery Cells",
    price: "₹180 - ₹350 / cell",
    moq: "500 cells",
    supplier: "Mehta Electronics",
    image:
      "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "BOPP Packaging Film",
    price: "₹120 - ₹180 / kg",
    moq: "500 kg",
    supplier: "Atlas Packaging",
    image:
      "https://images.unsplash.com/photo-1531058020387-3be344556be6?auto=format&fit=crop&w=800&q=80",
  },
];

export default function TrendingProducts() {
  return (
    <section className="trending-section">
      <div className="container">

        {/* Header */}
        <div className="products-section-header">
          <div>
            <span className="section-label">
              TRENDING PRODUCTS
            </span>

            <h2>
              Trending in B2B
            </h2>

            <p>
              Most requested products right now
            </p>
          </div>

          {/* Desktop */}
          <button className="view-all-button desktop-product-view-all">
            View All Products →
          </button>
        </div>


        {/* Product Cards */}
        <div className="trending-grid">

          {products.map((product) => (
            <div
              className="product-card"
              key={product.name}
            >

              {/* Image */}
              <div className="product-image-wrapper">
                <img
                  src={product.image}
                  alt={product.name}
                  className="product-image"
                />
              </div>


              {/* Content */}
              <div className="product-content">

                <h3>
                  {product.name}
                </h3>

                <div className="product-price">
                  {product.price}
                </div>

                <div className="product-moq">
                  MOQ: {product.moq}
                </div>

                <div className="product-footer">

                  <span>
                    by {product.supplier}
                  </span>

                  <button className="quote-button">
                    Get Quote
                  </button>

                </div>

              </div>

            </div>
          ))}

        </div>


        {/* Mobile */}
        <div className="mobile-product-view-all">
          <button className="view-all-button">
            View All Products →
          </button>
        </div>

      </div>
    </section>
  );
}