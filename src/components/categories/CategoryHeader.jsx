export default function CategoryHeader({ category }) {
  return (
    <section className="category-header">
      <div>
        <p>Home / Categories / {category.name}</p>

        <h1>{category.name}</h1>

        <p>{category.description}</p>
      </div>

      <div className="category-search">
        <input
          type="text"
          placeholder={`Search in ${category.name}`}
        />

        <button>Search</button>
      </div>
    </section>
  );
}