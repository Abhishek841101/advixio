import Link from "next/link";

export default function ProductCard({ product }) {
  const image =
    product.images?.length > 0
      ? product.images[0]
      : null;

  const price =
    product.price !== undefined &&
    product.price !== null
      ? `₹${Number(product.price).toLocaleString(
          "en-IN"
        )}`
      : "Price on request";

  return (
    <article className="product-card">

      {/* Image */}
      <div className="product-image">

        {image ? (
          <img
            src={image}
            alt={product.name}
            loading="lazy"
          />
        ) : (
          <span>
            No Image
          </span>
        )}

      </div>

      {/* Product Info */}
      <div className="product-card-content">

        <h3>
          {product.name}
        </h3>

        {product.shortDescription && (
          <p>
            {product.shortDescription}
          </p>
        )}

        {product.companyName && (
          <span className="product-company">
            {product.companyName}
          </span>
        )}

        {product.location?.city && (
          <span className="product-location">
            📍 {product.location.city}
            {product.location.state
              ? `, ${product.location.state}`
              : ""}
          </span>
        )}

        <strong>
          {price}
          {product.unit && (
            <small>
              / {product.unit}
            </small>
          )}
        </strong>

        <Link
          href={`/products/${product.slug}`}
          className="product-view-button"
        >
          View Product
        </Link>

      </div>

    </article>
  );
}