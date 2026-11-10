
import Link from "next/link";

type Supplier = {
  _id: string;
  slug?: string;
  name: string;
  companyName?: string;
  profileImage?: string;
  city?: string;
  state?: string;
  productCount?: number;
};

type ApiResponse = {
  success: boolean;
  message?: string;
  data?: Supplier[];
};

const API_URL = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"
).replace(/\/+$/, "");

function getInitials(name: string) {
  return (
    name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part[0])
      .join("")
      .toUpperCase() || "S"
  );
}

async function getFeaturedSuppliers(): Promise<Supplier[]> {
  try {
    const response = await fetch(
      `${API_URL}/suppliers?page=1&limit=20`,
      {
        cache: "no-store",
      }
    );

    if (!response.ok) {
      throw new Error(`Supplier API error: ${response.status}`);
    }

    const result = (await response.json()) as ApiResponse;

    if (!result.success || !Array.isArray(result.data)) {
      return [];
    }

    return result.data;
  } catch (error) {
    console.error("Featured suppliers fetch error:", error);
    return [];
  }
}

export default async function FeaturedSuppliers() {
  const suppliers = await getFeaturedSuppliers();

  return (
    <section className="featured-suppliers-section">
      <div className="featured-suppliers-container">

        {/* Section Heading */}
        <div className="featured-suppliers-heading">
          <div>
          

            <h2>Featured Suppliers</h2>

            <p>
              Explore supplier profiles, products, business information and enquiry options.
            </p>
          </div>

          <Link
            href="/suppliers"
            className="featured-suppliers-view-all"
          >
            <b>View All Suppliers</b>
            <span aria-hidden="true">→</span>
          </Link>
        </div>

        {/* Supplier Cards */}
        {suppliers.length > 0 ? (
          <div className="featured-suppliers-grid">
            {suppliers.map((supplier) => {
              const companyName =
                supplier.companyName?.trim() ||
                supplier.name ||
                "Supplier";

              const location = [
                supplier.city,
                supplier.state,
              ]
                .filter(Boolean)
                .join(", ");

              const profileUrl = `/suppliers/${
                supplier.slug || supplier._id
              }`;

              return (
                <Link
                  key={supplier._id}
                  href={profileUrl}
                  className="featured-supplier-card"
                  aria-label={`View ${companyName} profile`}
                >
                  {/* Supplier Header */}
                  <div className="featured-supplier-top">
                    <div className="featured-supplier-avatar">
                      {supplier.profileImage ? (
                        <img
                          src={supplier.profileImage}
                          alt={companyName}
                        />
                      ) : (
                        <span>
                          {getInitials(companyName)}
                        </span>
                      )}
                    </div>

                    <div className="featured-supplier-info">
                      <h3>{companyName}</h3>

                      <span className="featured-supplier-status">
                        <span className="featured-status-dot" />
                        Listed on Advixio
                      </span>
                    </div>
                  </div>

                  {/* Supplier Description */}
                  <p className="featured-supplier-description">
                    Explore products and connect directly with this
                    supplier through Advixio.
                  </p>

                  {/* Supplier Details */}
                  <div className="featured-supplier-details">
                    <div className="featured-supplier-location">
                      <span aria-hidden="true">📍</span>
                      <span>
                        {location || "Location not available"}
                      </span>
                    </div>

                    <div className="featured-supplier-products">
                      <strong>
                        {supplier.productCount ?? 0}
                      </strong>
                      <span>Products</span>
                    </div>
                  </div>

                  {/* Card Footer */}
                  <div className="featured-supplier-footer">
                    <span>View Supplier Profile</span>
                    <span aria-hidden="true">→</span>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="featured-suppliers-empty">
            <h3>No suppliers available</h3>
            <p>
              Supplier information will appear here once available.
            </p>
          </div>
        )}

      </div>
    </section>
  );
}
