import ProductCard from "./ProductCard";
import SupplierCard from "./SupplierCard";

export default function CategoryGrid() {
  const products = [
    {
      id: 1,
      name: "Industrial Machine",
      description: "Heavy duty industrial equipment",
      price: "₹1,25,000",
    },
    {
      id: 2,
      name: "CNC Machine",
      description: "Precision manufacturing machine",
      price: "₹4,50,000",
    },
  ];

  const suppliers = [
    {
      id: 1,
      name: "ABC Industries",
      location: "Pune, Maharashtra",
      verified: true,
    },
    {
      id: 2,
      name: "XYZ Engineering",
      location: "Mumbai, Maharashtra",
      verified: true,
    },
  ];

  return (
    <section className="category-results">

      <div>
        <h2>Products</h2>

        <div>
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
            />
          ))}
        </div>
      </div>

      <div>
        <h2>Top Suppliers</h2>

        <div>
          {suppliers.map((supplier) => (
            <SupplierCard
              key={supplier.id}
              supplier={supplier}
            />
          ))}
        </div>
      </div>

    </section>
  );
}