"use client";

import {
  FormEvent,
  useEffect,
  useState,
} from "react";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

type Product = {
  _id: string;
  name: string;
  shortDescription?: string;
  description?: string;
  category?: {
    _id?: string;
    name?: string;
  };
  subcategory?: string;
  brand?: string;
  model?: string;
  price?: number;
  unit?: string;
  images?: string[];
  companyName?: string;
  location?: {
    city?: string;
    state?: string;
  };
};

type Category = {
  _id: string;
  name: string;
};

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();

  const productId = params.id as string;

  const [categories, setCategories] = useState<
    Category[]
  >([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [name, setName] = useState("");
  const [shortDescription, setShortDescription] =
    useState("");
  const [description, setDescription] =
    useState("");
  const [category, setCategory] = useState("");
  const [subcategory, setSubcategory] =
    useState("");
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [price, setPrice] = useState("");
  const [unit, setUnit] = useState("Piece");
  const [companyName, setCompanyName] =
    useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  useEffect(() => {
    if (productId) {
      loadProduct();
      loadCategories();
    }
  }, [productId]);

  const loadProduct = async () => {
    try {
      setLoading(true);

      const token =
        localStorage.getItem("advixio_token");

      if (!token) {
        window.location.href = "/login";
        return;
      }

      /*
       * We use the protected my-listings API.
       * This also makes sure the product belongs
       * to the logged-in user.
       */
      const response = await fetch(
        `${API_URL}/products/my-listings`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          cache: "no-store",
        }
      );

      const result = await response.json();

      if (response.status === 401) {
        window.location.href = "/login";
        return;
      }

      if (!response.ok || !result.success) {
        throw new Error(
          result.message ||
            "Failed to load product."
        );
      }

      const product = (
        result.data as Product[]
      ).find(
        (item) => item._id === productId
      );

      if (!product) {
        throw new Error(
          "Product not found or you do not have permission to edit it."
        );
      }

      setName(product.name || "");
      setShortDescription(
        product.shortDescription || ""
      );
      setDescription(
        product.description || ""
      );
      setCategory(
        product.category?._id || ""
      );
      setSubcategory(
        product.subcategory || ""
      );
      setBrand(product.brand || "");
      setModel(product.model || "");
      setPrice(
        product.price !== undefined
          ? String(product.price)
          : ""
      );
      setUnit(product.unit || "Piece");
      setCompanyName(
        product.companyName || ""
      );
      setCity(
        product.location?.city || ""
      );
      setState(
        product.location?.state || ""
      );
      setImageUrl(
        product.images?.[0] || ""
      );
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : "Failed to load product."
      );
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const response = await fetch(
        `${API_URL}/categories`,
        {
          cache: "no-store",
        }
      );

      const result = await response.json();

      if (response.ok && result.success) {
        setCategories(result.data || []);
      }
    } catch (err) {
      console.error(
        "Category loading error:",
        err
      );
    }
  };

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setError("");

    if (!name.trim()) {
      setError("Product name is required.");
      return;
    }

    if (!category) {
      setError("Category is required.");
      return;
    }

    try {
      setSaving(true);

      const token =
        localStorage.getItem("advixio_token");

      if (!token) {
        window.location.href = "/login";
        return;
      }

      const response = await fetch(
        `${API_URL}/products/${productId}`,
        {
          method: "PUT",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            name: name.trim(),
            shortDescription:
              shortDescription.trim(),
            description: description.trim(),
            category,
            subcategory:
              subcategory.trim(),
            brand: brand.trim(),
            model: model.trim(),
            price: price
              ? Number(price)
              : undefined,
            unit,
            images: imageUrl.trim()
              ? [imageUrl.trim()]
              : [],
            companyName:
              companyName.trim(),
            location: {
              city: city.trim(),
              state: state.trim(),
              country: "India",
            },
          }),
        }
      );

      const result = await response.json();

      if (response.status === 401) {
        window.location.href = "/login";
        return;
      }

      if (!response.ok || !result.success) {
        throw new Error(
          result.message ||
            "Failed to update product."
        );
      }

      router.push("/dashboard/products");
      router.refresh();
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : "Failed to update product."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <main className="dashboard-page">
        <div className="dashboard-container">
          <div className="dashboard-loading">
            Loading product...
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="dashboard-page">
      <div className="dashboard-container">

        <div className="dashboard-topbar">

          <div>
            <span className="dashboard-eyebrow">
              PRODUCT MANAGEMENT
            </span>

            <h1>Edit Product</h1>

            <p>
              Update your product information.
            </p>
          </div>

          <div className="dashboard-top-actions">

            <Link
              href="/dashboard/products"
              className="dashboard-marketplace-button"
            >
              ← My Products
            </Link>

          </div>

        </div>

        <form
          onSubmit={handleSubmit}
          className="product-form-panel"
        >

          {error && (
            <div className="dashboard-error">
              {error}
            </div>
          )}

          <div className="product-form-section">

            <h2>Basic Information</h2>

            <div className="product-form-grid">

              <div className="product-form-field full">

                <label>
                  Product Name *
                </label>

                <input
                  value={name}
                  onChange={(event) =>
                    setName(event.target.value)
                  }
                  disabled={saving}
                  required
                />

              </div>

              <div className="product-form-field full">

                <label>
                  Short Description
                </label>

                <input
                  value={shortDescription}
                  onChange={(event) =>
                    setShortDescription(
                      event.target.value
                    )
                  }
                  disabled={saving}
                />

              </div>

              <div className="product-form-field full">

                <label>
                  Description
                </label>

                <textarea
                  value={description}
                  onChange={(event) =>
                    setDescription(
                      event.target.value
                    )
                  }
                  rows={5}
                  disabled={saving}
                />

              </div>

            </div>
          </div>

          <div className="product-form-section">

            <h2>Category</h2>

            <div className="product-form-grid">

              <div className="product-form-field">

                <label>
                  Category *
                </label>

                <select
                  value={category}
                  onChange={(event) =>
                    setCategory(
                      event.target.value
                    )
                  }
                  disabled={saving}
                  required
                >
                  <option value="">
                    Select category
                  </option>

                  {categories.map(
                    (item) => (
                      <option
                        key={item._id}
                        value={item._id}
                      >
                        {item.name}
                      </option>
                    )
                  )}
                </select>

              </div>

              <div className="product-form-field">

                <label>
                  Subcategory
                </label>

                <input
                  value={subcategory}
                  onChange={(event) =>
                    setSubcategory(
                      event.target.value
                    )
                  }
                  disabled={saving}
                />

              </div>

            </div>
          </div>

          <div className="product-form-section">

            <h2>Product Details</h2>

            <div className="product-form-grid">

              <div className="product-form-field">

                <label>
                  Brand
                </label>

                <input
                  value={brand}
                  onChange={(event) =>
                    setBrand(
                      event.target.value
                    )
                  }
                  disabled={saving}
                />

              </div>

              <div className="product-form-field">

                <label>
                  Model
                </label>

                <input
                  value={model}
                  onChange={(event) =>
                    setModel(
                      event.target.value
                    )
                  }
                  disabled={saving}
                />

              </div>

              <div className="product-form-field">

                <label>
                  Price
                </label>

                <input
                  type="number"
                  min="0"
                  value={price}
                  onChange={(event) =>
                    setPrice(
                      event.target.value
                    )
                  }
                  disabled={saving}
                />

              </div>

              <div className="product-form-field">

                <label>
                  Unit
                </label>

                <select
                  value={unit}
                  onChange={(event) =>
                    setUnit(
                      event.target.value
                    )
                  }
                  disabled={saving}
                >
                  <option>Piece</option>
                  <option>Kg</option>
                  <option>Ton</option>
                  <option>Meter</option>
                  <option>Set</option>
                  <option>Box</option>
                  <option>Liter</option>
                </select>

              </div>

            </div>
          </div>

          <div className="product-form-section">

            <h2>Business Information</h2>

            <div className="product-form-grid">

              <div className="product-form-field full">

                <label>
                  Company Name
                </label>

                <input
                  value={companyName}
                  onChange={(event) =>
                    setCompanyName(
                      event.target.value
                    )
                  }
                  disabled={saving}
                />

              </div>

              <div className="product-form-field">

                <label>
                  City
                </label>

                <input
                  value={city}
                  onChange={(event) =>
                    setCity(
                      event.target.value
                    )
                  }
                  disabled={saving}
                />

              </div>

              <div className="product-form-field">

                <label>
                  State
                </label>

                <input
                  value={state}
                  onChange={(event) =>
                    setState(
                      event.target.value
                    )
                  }
                  disabled={saving}
                />

              </div>

            </div>
          </div>

          <div className="product-form-section">

            <h2>Product Image</h2>

            <div className="product-form-field full">

              <label>
                Image URL
              </label>

              <input
                type="url"
                value={imageUrl}
                onChange={(event) =>
                  setImageUrl(
                    event.target.value
                  )
                }
                disabled={saving}
              />

            </div>

          </div>

          <div className="product-form-footer">

            <Link
              href="/dashboard/products"
              className="product-cancel-button"
            >
              Cancel
            </Link>

            <button
              type="submit"
              className="dashboard-add-button"
              disabled={saving}
            >
              {saving
                ? "Saving..."
                : "Save Changes"}
            </button>

          </div>

        </form>
      </div>
    </main>
  );
}