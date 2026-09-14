


"use client";

import {
  FormEvent,
  useEffect,
  useState,
} from "react";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:5000/api";

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

  // ==========================================
  // STATE
  // ==========================================

  const [categories, setCategories] =
    useState<Category[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState("");

  const [name, setName] =
    useState("");

  const [shortDescription, setShortDescription] =
    useState("");

  const [description, setDescription] =
    useState("");

  const [category, setCategory] =
    useState("");

  const [subcategory, setSubcategory] =
    useState("");

  const [brand, setBrand] =
    useState("");

  const [model, setModel] =
    useState("");

  const [price, setPrice] =
    useState("");

  const [unit, setUnit] =
    useState("Piece");

  const [companyName, setCompanyName] =
    useState("");

  const [city, setCity] =
    useState("");

  const [state, setState] =
    useState("");

  // ==========================================
  // IMPORTANT
  // ALL PRODUCT IMAGES
  // ==========================================

  const [images, setImages] =
    useState<string[]>([]);

  // ==========================================
  // LOAD PRODUCT + CATEGORIES
  // ==========================================

  useEffect(() => {
    if (!productId) return;

    loadProduct();
    loadCategories();
  }, [productId]);

  // ==========================================
  // LOAD PRODUCT
  // ==========================================

  const loadProduct = async () => {
    try {
      setLoading(true);
      setError("");

      const token =
        localStorage.getItem(
          "advixio_token"
        );

      if (!token) {
        window.location.href = "/login";
        return;
      }

      /*
       * Protected API.
       * This makes sure the product belongs
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

      const result =
        await response.json();

      // ========================================
      // AUTH ERROR
      // ========================================

      if (response.status === 401) {
        window.location.href = "/login";
        return;
      }

      // ========================================
      // API ERROR
      // ========================================

      if (
        !response.ok ||
        !result.success
      ) {
        throw new Error(
          result.message ||
            "Failed to load product."
        );
      }

      // ========================================
      // FIND PRODUCT
      // ========================================

      const product = (
        result.data as Product[]
      ).find(
        (item) =>
          item._id === productId
      );

      if (!product) {
        throw new Error(
          "Product not found or you do not have permission to edit it."
        );
      }

      // ========================================
      // SET PRODUCT DATA
      // ========================================

      setName(
        product.name || ""
      );

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

      setBrand(
        product.brand || ""
      );

      setModel(
        product.model || ""
      );

      setPrice(
        product.price !== undefined &&
        product.price !== null
          ? String(product.price)
          : ""
      );

      setUnit(
        product.unit || "Piece"
      );

      setCompanyName(
        product.companyName || ""
      );

      setCity(
        product.location?.city || ""
      );

      setState(
        product.location?.state || ""
      );

      // ========================================
      // IMPORTANT:
      // LOAD ALL IMAGES
      // ========================================

      const existingImages =
        Array.isArray(product.images)
          ? product.images.filter(
              (image) =>
                typeof image === "string" &&
                image.trim() !== ""
            )
          : [];

      console.log(
        "Existing product images:",
        existingImages
      );

      setImages(existingImages);

    } catch (err) {
      console.error(
        "Load product error:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Failed to load product."
      );

    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // LOAD CATEGORIES
  // ==========================================

  const loadCategories = async () => {
    try {
      const response = await fetch(
        `${API_URL}/categories`,
        {
          cache: "no-store",
        }
      );

      const result =
        await response.json();

      if (
        response.ok &&
        result.success
      ) {
        setCategories(
          result.data || []
        );
      }

    } catch (err) {
      console.error(
        "Category loading error:",
        err
      );
    }
  };

  // ==========================================
  // UPDATE IMAGE AT SPECIFIC INDEX
  // ==========================================

  const updateImage = (
    index: number,
    value: string
  ) => {
    setImages((currentImages) => {
      const updatedImages = [
        ...currentImages,
      ];

      updatedImages[index] =
        value;

      return updatedImages;
    });
  };

  // ==========================================
  // REMOVE IMAGE
  // ==========================================

  const removeImage = (
    index: number
  ) => {
    setImages((currentImages) =>
      currentImages.filter(
        (_, imageIndex) =>
          imageIndex !== index
      )
    );
  };

  // ==========================================
  // SUBMIT
  // ==========================================

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setError("");

    // ========================================
    // BASIC VALIDATION
    // ========================================

    if (!name.trim()) {
      setError(
        "Product name is required."
      );
      return;
    }

    if (!category) {
      setError(
        "Category is required."
      );
      return;
    }

    // ========================================
    // IMAGE VALIDATION
    // ========================================

    const cleanedImages =
      images
        .map((image) =>
          image.trim()
        )
        .filter(
          (image) =>
            image !== ""
        );

    if (cleanedImages.length > 3) {
      setError(
        "You can have maximum 3 images."
      );
      return;
    }

    try {
      setSaving(true);

      const token =
        localStorage.getItem(
          "advixio_token"
        );

      if (!token) {
        window.location.href =
          "/login";
        return;
      }

      // ========================================
      // UPDATE PRODUCT
      // ========================================

      const response = await fetch(
        `${API_URL}/products/${productId}`,
        {
          method: "PUT",

          headers: {
            "Content-Type":
              "application/json",

            Authorization:
              `Bearer ${token}`,
          },

          body: JSON.stringify({
            name:
              name.trim(),

            shortDescription:
              shortDescription.trim(),

            description:
              description.trim(),

            category,

            subcategory:
              subcategory.trim(),

            brand:
              brand.trim(),

            model:
              model.trim(),

            price:
              price !== ""
                ? Number(price)
                : undefined,

            unit,

            // ==================================
            // IMPORTANT:
            // SEND ALL IMAGES
            // ==================================

            images:
              cleanedImages,

            companyName:
              companyName.trim(),

            location: {
              city:
                city.trim(),

              state:
                state.trim(),

              country:
                "India",
            },
          }),
        }
      );

      const result =
        await response.json();

      // ========================================
      // AUTH ERROR
      // ========================================

      if (
        response.status === 401
      ) {
        window.location.href =
          "/login";
        return;
      }

      // ========================================
      // API ERROR
      // ========================================

      if (
        !response.ok ||
        !result.success
      ) {
        throw new Error(
          result.message ||
            "Failed to update product."
        );
      }

      // ========================================
      // SUCCESS
      // ========================================

      router.push(
        "/dashboard/products"
      );

      router.refresh();

    } catch (err) {
      console.error(
        "Update product error:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Failed to update product."
      );

    } finally {
      setSaving(false);
    }
  };

  // ==========================================
  // LOADING
  // ==========================================

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

  // ==========================================
  // PAGE
  // ==========================================

  return (
    <main className="dashboard-page">

      <div className="dashboard-container">

        {/* =====================================
            TOP BAR
        ====================================== */}

        <div className="dashboard-topbar">

          <div>

            <span className="dashboard-eyebrow">
              PRODUCT MANAGEMENT
            </span>

            <h1>
              Edit Product
            </h1>

            <p>
              Update your product
              information.
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

        {/* =====================================
            FORM
        ====================================== */}

        <form
          onSubmit={handleSubmit}
          className="product-form-panel"
        >

          {/* ===================================
              ERROR
          ==================================== */}

          {error && (
            <div className="dashboard-error">
              {error}
            </div>
          )}

          {/* ===================================
              BASIC INFORMATION
          ==================================== */}

          <div className="product-form-section">

            <h2>
              Basic Information
            </h2>

            <div className="product-form-grid">

              {/* PRODUCT NAME */}

              <div className="product-form-field full">

                <label>
                  Product Name *
                </label>

                <input
                  value={name}
                  onChange={(event) =>
                    setName(
                      event.target.value
                    )
                  }
                  disabled={saving}
                  required
                />

              </div>

              {/* SHORT DESCRIPTION */}

              <div className="product-form-field full">

                <label>
                  Short Description
                </label>

                <input
                  value={
                    shortDescription
                  }
                  onChange={(event) =>
                    setShortDescription(
                      event.target.value
                    )
                  }
                  disabled={saving}
                />

              </div>

              {/* DESCRIPTION */}

              <div className="product-form-field full">

                <label>
                  Description
                </label>

                <textarea
                  value={
                    description
                  }
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

          {/* ===================================
              CATEGORY
          ==================================== */}

          <div className="product-form-section">

            <h2>
              Category
            </h2>

            <div className="product-form-grid">

              {/* CATEGORY */}

              <div className="product-form-field">

                <label>
                  Category *
                </label>

                <select
                  value={
                    category
                  }
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
                        key={
                          item._id
                        }
                        value={
                          item._id
                        }
                      >
                        {item.name}
                      </option>
                    )
                  )}

                </select>

              </div>

              {/* SUBCATEGORY */}

              <div className="product-form-field">

                <label>
                  Subcategory
                </label>

                <input
                  value={
                    subcategory
                  }
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

          {/* ===================================
              PRODUCT DETAILS
          ==================================== */}

          <div className="product-form-section">

            <h2>
              Product Details
            </h2>

            <div className="product-form-grid">

              {/* BRAND */}

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

              {/* MODEL */}

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

              {/* PRICE */}

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

              {/* UNIT */}

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

                  <option>
                    Piece
                  </option>

                  <option>
                    Kg
                  </option>

                  <option>
                    Ton
                  </option>

                  <option>
                    Meter
                  </option>

                  <option>
                    Set
                  </option>

                  <option>
                    Box
                  </option>

                  <option>
                    Liter
                  </option>

                </select>

              </div>

            </div>

          </div>

          {/* ===================================
              BUSINESS INFORMATION
          ==================================== */}

          <div className="product-form-section">

            <h2>
              Business Information
            </h2>

            <div className="product-form-grid">

              {/* COMPANY */}

              <div className="product-form-field full">

                <label>
                  Company Name
                </label>

                <input
                  value={
                    companyName
                  }
                  onChange={(event) =>
                    setCompanyName(
                      event.target.value
                    )
                  }
                  disabled={saving}
                />

              </div>

              {/* CITY */}

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

              {/* STATE */}

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

          {/* ===================================
              PRODUCT IMAGES
          ==================================== */}

          <div className="product-form-section">

            <h2>
              Product Images
            </h2>

            <p className="product-form-help">
              Existing product images are
              shown below. You can update
              an individual image URL.
              Maximum 3 images are allowed.
            </p>

            {images.length === 0 ? (

              <div className="product-no-images">
                No product images available.
              </div>

            ) : (

              <div className="edit-product-images">

                {images.map(
                  (image, index) => (

                    <div
                      key={`${image}-${index}`}
                      className="edit-product-image-item"
                    >

                      {/* IMAGE PREVIEW */}

                      <div className="edit-product-image-preview">

                        <img
                          src={image}
                          alt={`Product image ${
                            index + 1
                          }`}
                        />

                      </div>

                      {/* IMAGE URL */}

                      <div className="product-form-field">

                        <label>
                          Image{" "}
                          {index + 1}{" "}
                          URL
                        </label>

                        <input
                          type="url"
                          value={
                            image
                          }
                          onChange={(
                            event
                          ) =>
                            updateImage(
                              index,
                              event
                                .target
                                .value
                            )
                          }
                          disabled={
                            saving
                          }
                        />

                      </div>

                      {/* REMOVE */}

                      <button
                        type="button"
                        className="product-remove-image-button"
                        onClick={() =>
                          removeImage(
                            index
                          )
                        }
                        disabled={
                          saving
                        }
                      >
                        Remove Image
                      </button>

                    </div>

                  )
                )}

              </div>

            )}

          </div>

          {/* ===================================
              FOOTER
          ==================================== */}

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