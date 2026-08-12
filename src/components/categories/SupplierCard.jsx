export default function SupplierCard({ supplier }) {
  return (
    <article className="supplier-card">
      <div className="supplier-logo">
        {supplier.name.charAt(0)}
      </div>

      <div>
        <h3>{supplier.name}</h3>

        <p>{supplier.location}</p>

        {supplier.verified && (
          <span>✓ Verified Supplier</span>
        )}
      </div>

      <button>View Supplier</button>
    </article>
  );
}