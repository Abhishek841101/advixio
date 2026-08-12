export default function ProductCard({ product }) {
  return (
    <article className="product-card">
      <div className="product-image">
        Product Image
      </div>

      <h3>{product.name}</h3>

      <p>{product.description}</p>

      <strong>{product.price}</strong>

      <button>View Product</button>
    </article>
  );
}