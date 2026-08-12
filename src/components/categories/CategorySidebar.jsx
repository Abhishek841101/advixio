export default function CategorySidebar() {
  return (
    <aside className="category-sidebar">
      <h3>Filter</h3>

      <div>
        <h4>Location</h4>

        <label>
          <input type="checkbox" />
          Pune
        </label>

        <label>
          <input type="checkbox" />
          Mumbai
        </label>

        <label>
          <input type="checkbox" />
          Delhi
        </label>
      </div>

      <div>
        <h4>Supplier Type</h4>

        <label>
          <input type="checkbox" />
          Manufacturer
        </label>

        <label>
          <input type="checkbox" />
          Distributor
        </label>

        <label>
          <input type="checkbox" />
          Service Provider
        </label>
      </div>

      <div>
        <h4>Verification</h4>

        <label>
          <input type="checkbox" />
          Verified Suppliers
        </label>
      </div>
    </aside>
  );
}