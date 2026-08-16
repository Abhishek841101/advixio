import Link from "next/link";

export default function ProductCard({ product }) {
  if (!product) {
    return null;
  }

  const supplierName =
    product.seller?.companyName ||
    product.companyName ||
    product.seller?.name ||
    "Supplier";

  const location = product.location
    ? [
        product.location.city,
        product.location.state,
      ]
        .filter(Boolean)
        .join(", ")
    : product.seller?.city
      ? [
          product.seller.city,
          product.seller.state,
        ]
          .filter(Boolean)
          .join(", ")
      : "Location not available";

  const image =
    Array.isArray(product.images) && product.images.length > 0
      ? product.images[0]
      : "/products/product-placeholder.jpg";

  const price =
    typeof product.price === "number"
      ? `₹${product.price.toLocaleString("en-IN")}`
      : product.price || "Price on Request";

  return (
    <Link
      href={`/products/${product.slug}`}
      className="product-card"
    >
      <div className="product-image">
        <img
          src={image}
          alt={product.name || "Product"}
        />
      </div>

      <div className="product-content">
        <h3>
          {product.name || "Unnamed Product"}
        </h3>

        <p>
          {product.shortDescription ||
            product.description ||
            "Industrial product"}
        </p>

        <div className="product-price">
          {price}

          {product.unit && (
            <span>
              {" "}
              / {product.unit}
            </span>
          )}
        </div>

        <div className="product-supplier">
          <strong>
            {supplierName}
          </strong>

          <span>
            {location}
          </span>
        </div>

        <div className="product-view">
          View Details →
        </div>
      </div>
    </Link>
  );
}