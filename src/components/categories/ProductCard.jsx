// import Link from "next/link";
// import { MapPin, ArrowUpRight } from "lucide-react";

// export default function ProductCard({ product }) {
//   const image =
//     product.images?.length > 0
//       ? product.images[0]
//       : "/product-placeholder.jpg";

//   const price =
//     product.price !== undefined && product.price !== null
//       ? `₹${Number(product.price).toLocaleString("en-IN")}`
//       : "Price on request";

//   return (
//     <article className="product-card">

//       {/* Product Image */}
//       <Link
//         href={`/products/${product.slug}`}
//         className="product-image"
//       >
//         <img
//           src={image}
//           alt={product.name || "Product"}
//           loading="lazy"
//         />

//         {product.isFeatured && (
//           <span className="product-featured">
//             Featured
//           </span>
//         )}
//       </Link>

//       {/* Product Details */}
//       <div className="product-card-content">

//         <Link
//           href={`/products/${product.slug}`}
//           className="product-title"
//         >
//           {product.name}
//         </Link>

//         {product.shortDescription && (
//           <p className="product-description">
//             {product.shortDescription}
//           </p>
//         )}

//         {product.companyName && (
//           <p className="product-company">
//             {product.companyName}
//           </p>
//         )}

//         {product.location?.city && (
//           <div className="product-location">
//             <MapPin size={14} />

//             <span>
//               {product.location.city}
//               {product.location.state
//                 ? `, ${product.location.state}`
//                 : ""}
//             </span>
//           </div>
//         )}

//         <div className="product-bottom">

//           <div className="product-price">
//             {price}

//             {product.unit && (
//               <span>
//                 / {product.unit}
//               </span>
//             )}
//           </div>

//           <Link
//             href={`/products/${product.slug}`}
//             className="product-view-button"
//           >
//             View
//             <ArrowUpRight size={15} />
//           </Link>

//         </div>

//       </div>
//     </article>
//   );
// }



import Link from "next/link";
import { MapPin, ArrowUpRight } from "lucide-react";

export default function ProductCard({ product }) {
  const image =
    product.images?.length > 0
      ? product.images[0]
      : "/product-placeholder.jpg";

  const price =
    product.price !== undefined && product.price !== null
      ? `₹${Number(product.price).toLocaleString("en-IN")}`
      : "Price on request";

  return (
    <article className="product-card">

      <Link
        href={`/products/${product.slug}`}
        className="product-image"
      >
        <img
          src={image}
          alt={product.name || "Product"}
          loading="lazy"
        />

        {product.isFeatured && (
          <span className="product-featured">
            Featured
          </span>
        )}
      </Link>

      <div className="product-card-content">

        <Link
          href={`/products/${product.slug}`}
          className="product-title"
        >
          {product.name}
        </Link>

        {product.shortDescription && (
          <p className="product-description">
            {product.shortDescription}
          </p>
        )}

        {product.companyName && (
          <p className="product-company">
            {product.companyName}
          </p>
        )}

        {product.location?.city && (
          <div className="product-location">
            <MapPin size={14} />

            <span>
              {product.location.city}
              {product.location.state
                ? `, ${product.location.state}`
                : ""}
            </span>
          </div>
        )}

        <div className="product-bottom">

          <div className="product-price">
            {price}

            {product.unit && (
              <span>/ {product.unit}</span>
            )}
          </div>

          <Link
            href={`/products/${product.slug}`}
            className="product-view-button"
          >
            <span>View Details</span>
            <ArrowUpRight size={15} />
          </Link>

        </div>

      </div>
    </article>
  );
}