// import Link from "next/link";

// export default function ProductCard({ product }) {
//   if (!product) {
//     return null;
//   }

//   const supplierName =
//     product.seller?.companyName ||
//     product.companyName ||
//     product.seller?.name ||
//     "Supplier";

//   const location = product.location
//     ? [
//         product.location.city,
//         product.location.state,
//       ]
//         .filter(Boolean)
//         .join(", ")
//     : product.seller?.city
//       ? [
//           product.seller.city,
//           product.seller.state,
//         ]
//           .filter(Boolean)
//           .join(", ")
//       : "Location not available";

//   const image =
//     Array.isArray(product.images) && product.images.length > 0
//       ? product.images[0]
//       : "/products/product-placeholder.jpg";

//   const price =
//     typeof product.price === "number"
//       ? `₹${product.price.toLocaleString("en-IN")}`
//       : product.price || "Price on Request";

//   return (
//     <Link
//       href={`/products/${product.slug}`}
//       className="product-card"
//     >
//       <div className="product-image">
//         <img
//           src={image}
//           alt={product.name || "Product"}
//         />
//       </div>

//       <div className="product-content">
//         <h3>
//           {product.name || "Unnamed Product"}
//         </h3>

//         <p>
//           {product.shortDescription ||
//             product.description ||
//             "Industrial product"}
//         </p>

//         <div className="product-price">
//           {price}

//           {product.unit && (
//             <span>
//               {" "}
//               / {product.unit}
//             </span>
//           )}
//         </div>

//         <div className="product-supplier">
//           <strong>
//             {supplierName}
//           </strong>

//           <span>
//             {location}
//           </span>
//         </div>

//         <div className="product-view">
//           View Details →
//         </div>
//       </div>
//     </Link>
//   );
// }




"use client";

import Link from "next/link";
import { useState } from "react";

function getPhoneNumber(product) {
  const rawPhone =
    product?.seller?.phone ||
    product?.seller?.mobile ||
    product?.seller?.phoneNumber ||
    product?.seller?.contactNumber ||
    product?.seller?.contact?.phone ||
    product?.seller?.contact?.mobile ||
    product?.sellerPhone ||
    product?.supplierPhone ||
    product?.supplier?.phone ||
    product?.supplier?.mobile ||
    product?.phone ||
    "";

  let number = String(rawPhone).replace(/\D/g, "");

  if (number.startsWith("00")) {
    number = number.slice(2);
  }

  if (number.length === 10) {
    number = `91${number}`;
  } else if (number.length === 11 && number.startsWith("0")) {
    number = `91${number.slice(1)}`;
  }

  return number;
}

function formatPhoneNumber(number) {
  if (!number) return "";

  if (number.startsWith("91") && number.length === 12) {
    return `+91 ${number.slice(2, 7)} ${number.slice(7)}`;
  }

  return `+${number}`;
}

export default function ProductCard({ product }) {
  const [activeImage, setActiveImage] = useState(0);
  const [favorite, setFavorite] = useState(false);

  if (!product) return null;

  const slug = product.slug || product._id;
  const productUrl = `/products/${encodeURIComponent(slug)}`;

  const images = [
    ...(Array.isArray(product.images) ? product.images : []),
    product.image,
  ].filter(
    (image, index, array) =>
      typeof image === "string" &&
      image.trim() !== "" &&
      array.indexOf(image) === index
  );

  const gallery = images.length
    ? images
    : ["/products/product-placeholder.jpg"];

  const currentImage =
    gallery[Math.min(activeImage, gallery.length - 1)];

  const supplierName =
    product.seller?.companyName?.trim() ||
    product.companyName?.trim() ||
    product.seller?.name?.trim() ||
    "Supplier";

  const city = product.location?.city || product.seller?.city;
  const state = product.location?.state || product.seller?.state;
  const location = [city, state].filter(Boolean).join(", ");

  const hasPrice =
    product.price !== undefined &&
    product.price !== null &&
    String(product.price).trim() !== "";

  const price =
    hasPrice && Number.isFinite(Number(product.price))
      ? `₹${Number(product.price).toLocaleString("en-IN")}`
      : "Price on Request";

  const unit = product.unit || "Piece";

  const minimumOrder =
    product.minimumOrder ||
    product.minOrderQuantity ||
    product.minimumOrderQuantity ||
    1;

  const phone = getPhoneNumber(product);
  console.log("Product data:", product);
console.log("Seller data:", product?.seller);
console.log("Detected phone:", getPhoneNumber(product));
  const displayPhone = formatPhoneNumber(phone);

  const message = encodeURIComponent(
    `Hello, I am interested in ${product.name}. Please share the price and product details.`
  );

  const category =
    product.subcategory ||
    product.category?.name ||
    "Industrial Product";

  return (
    <article className="adv-product-card">
      <div className="adv-gallery">
        <Link
          href={productUrl}
          className="adv-product-image-link"
          aria-label={`View ${product.name || "product"}`}
        >
          <div className="adv-product-image">
            <img
              src={currentImage}
              alt={product.name || "Product"}
              loading="lazy"
              onError={(event) => {
                event.currentTarget.onerror = null;
                event.currentTarget.src =
                  "/products/product-placeholder.jpg";
              }}
            />
          </div>
        </Link>

        <Link
          href={productUrl}
          className="adv-image-details"
          aria-label={`View details for ${product.name || "product"}`}
        >
          View Details
          <span aria-hidden="true">↗</span>
        </Link>

        <button
          type="button"
          className={`adv-favorite ${favorite ? "is-favorite" : ""}`}
          onClick={() => setFavorite((previous) => !previous)}
          aria-label={
            favorite ? "Remove favorite" : "Add to favorites"
          }
          aria-pressed={favorite}
        >
          <svg
            viewBox="0 0 24 24"
            width="21"
            height="21"
            fill={favorite ? "currentColor" : "none"}
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z" />
          </svg>
        </button>

        {gallery.length > 1 && (
          <div className="adv-image-thumbnails">
            {gallery.slice(0, 4).map((image, index) => (
              <button
                type="button"
                key={`${image}-${index}`}
                className={`adv-thumbnail ${
                  activeImage === index ? "active" : ""
                }`}
                onClick={() => setActiveImage(index)}
                aria-label={`Show product image ${index + 1}`}
                aria-pressed={activeImage === index}
              >
                <img src={image} alt="" loading="lazy" />
              </button>
            ))}

            {gallery.length > 4 && (
              <Link
                href={productUrl}
                className="adv-thumbnail-more"
                aria-label="View all product images"
              >
                +{gallery.length - 4}
              </Link>
            )}
          </div>
        )}

        {gallery.length <= 1 && (
          <div
            className="adv-image-thumbnails"
            aria-hidden="true"
          />
        )}
      </div>

      <div className="adv-product-content">
        <span className="adv-product-category">
          {category}
        </span>

        <Link
          href={productUrl}
          className="adv-product-title-link"
        >
          <h2 className="adv-product-title">
            {product.name || "Unnamed Product"}
          </h2>
        </Link>

        <div className="adv-price-order-row">
          <div className="adv-product-price">
            <strong>{price}</strong>
            <span>/ {unit}</span>
          </div>

          <div className="adv-min-order">
            <span className="adv-min-order-label">
              Min. Order
            </span>
            <strong>
              {minimumOrder} {unit}
            </strong>
          </div>
        </div>

        <div className="adv-product-meta">
          <div className="adv-product-meta-row">
            <svg
              viewBox="0 0 24 24"
              width="18"
              height="18"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <rect x="3" y="7" width="18" height="14" rx="1" />
              <path d="M8 21V3h8v18M6 11h2m-2 4h2m8-4h2m-2 4h2M10 7h4" />
            </svg>
            <span>{supplierName}</span>
          </div>

          {/* <div className="adv-product-meta-row">
            <svg
              viewBox="0 0 24 24"
              width="18"
              height="18"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z" />
              <circle cx="12" cy="10" r="2.5" />
            </svg>
            <span>{location || "Location not available"}</span>
          </div> */}

          {/* {phone && (
            <div className="adv-product-meta-row adv-supplier-phone">
              <svg
                viewBox="0 0 24 24"
                width="18"
                height="18"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.96.35 1.9.69 2.8a2 2 0 0 1-.45 2.11L8.08 9.92a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.34 1.84.57 2.8.69a2 2 0 0 1 1.74 2.03Z" />
              </svg>

              <a
                href={`tel:+${phone}`}
                className="adv-supplier-phone-link"
              >
                {displayPhone}
              </a>
            </div>
          )} */}
        </div>

        <div className="adv-product-actions">
          {phone ? (
            <a
              href={`tel:+${phone}`}
              className="adv-call-button"
              aria-label={`Call ${supplierName} at ${displayPhone}`}
            >
              <svg
                viewBox="0 0 24 24"
                width="19"
                height="19"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.96.35 1.9.69 2.8a2 2 0 0 1-.45 2.11L8.08 9.92a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.34 1.84.57 2.8.69a2 2 0 0 1 1.74 2.03Z" />
              </svg>
              Call
            </a>
          ) : (
            <span className="adv-contact-unavailable">
              Call unavailable
            </span>
          )}

          {phone ? (
            <a
              href={`https://wa.me/${phone}?text=${message}`}
              target="_blank"
              rel="noopener noreferrer"
              className="adv-whatsapp-button"
              aria-label={`WhatsApp ${supplierName} at ${displayPhone}`}
            >
              <svg
                viewBox="0 0 24 24"
                width="20"
                height="20"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5Z" />
              </svg>
              WhatsApp
            </a>
          ) : (
            <span className="adv-contact-unavailable">
              WhatsApp unavailable
            </span>
          )}
        </div>
      </div>
    </article>
  );
}
