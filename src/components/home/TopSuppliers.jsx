const suppliers = [
  {
    name: "Sharma Industrial Supplies",
    type: "Manufacturer",
    location: "Mumbai, Maharashtra",
    rating: "4.8",
    reviews: "124",
    years: "15 Years in Business",
    initial: "S",
    image:
      "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Gupta Textile Mills",
    type: "Manufacturer",
    location: "Surat, Gujarat",
    rating: "4.6",
    reviews: "89",
    years: "22 Years in Business",
    initial: "G",
    image:
      "https://images.unsplash.com/photo-1567366782772-8a7c3f3d2d2c?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Patel Chemicals Ltd",
    type: "Manufacturer & Exporter",
    location: "Ahmedabad, Gujarat",
    rating: "4.9",
    reviews: "210",
    years: "18 Years in Business",
    initial: "P",
    image:
      "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Mehta Electronics",
    type: "Wholesaler",
    location: "Delhi, Delhi",
    rating: "4.5",
    reviews: "67",
    years: "10 Years in Business",
    initial: "M",
    image:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Singh Agro Industries",
    type: "Manufacturer",
    location: "Ludhiana, Punjab",
    rating: "4.7",
    reviews: "156",
    years: "30 Years in Business",
    initial: "S",
    image:
      "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Reddy Construction Materials",
    type: "Trader",
    location: "Hyderabad, Telangana",
    rating: "4.4",
    reviews: "45",
    years: "12 Years in Business",
    initial: "R",
    image:
      "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=800&q=80",
  },
];

export default function TopSuppliers() {
  return (
    <section className="top-suppliers-section">
      <div className="container">

        <div className="products-section-header">
          <div>
            <span className="section-label">
              VERIFIED SUPPLIERS
            </span>

            <h2>Top Rated Suppliers</h2>

            <p>
              Partner with India's most trusted manufacturers
            </p>
          </div>

          <button className="view-all-button desktop-supplier-view-all">
            View All Suppliers →
          </button>
        </div>

        <div className="supplier-grid">
          {suppliers.map((supplier) => (
            <div
              className="supplier-card"
              key={supplier.name}
            >
              <div className="supplier-image-wrapper">
                <img
                  src={supplier.image}
                  alt={supplier.name}
                  className="supplier-image"
                />

                <div className="supplier-initial">
                  {supplier.initial}
                </div>

                <span className="gst-badge">
                  ✓ GST Verified
                </span>
              </div>

              <div className="supplier-content">
                <h3>{supplier.name}</h3>

                <span className="supplier-type">
                  {supplier.type}
                </span>

                <div className="supplier-info">
                  <span>⌖</span>
                  <span>{supplier.location}</span>
                </div>

                <div className="supplier-info rating">
                  <span>★</span>

                  <strong>{supplier.rating}</strong>

                  <span className="review-text">
                    ({supplier.reviews} reviews)
                  </span>
                </div>

                <div className="supplier-info">
                  <span>♙</span>
                  <span>{supplier.years}</span>
                </div>

                <button className="profile-button">
                  View Profile
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mobile-supplier-view-all">
          <button className="view-all-button">
            View All Suppliers →
          </button>
        </div>

      </div>
    </section>
  );
}