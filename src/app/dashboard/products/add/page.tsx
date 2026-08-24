


"use client";

import {
  FormEvent,
  useEffect,
  useState,
} from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:5000/api";

console.log("API URL BEING USED:", API_URL);

type Specification = {
  label: string;
  value: string;
};

type CustomField = {
  name: string;
  value: string;
};

type Category = {
  _id: string;
  name: string;
  slug: string;
};

export default function AddProductPage() {
  const router = useRouter();

  const [categories, setCategories] =
    useState<Category[]>([]);

  const [name, setName] = useState("");
  const [shortDescription, setShortDescription] =
    useState("");
  const [description, setDescription] =
    useState("");

  const [category, setCategory] =
    useState("");
  const [subcategory, setSubcategory] =
    useState("");

  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [price, setPrice] = useState("");
  const [unit, setUnit] = useState("Piece");

  const [specifications, setSpecifications] =
    useState<Specification[]>([]);

  const [customFields, setCustomFields] =
    useState<CustomField[]>([]);

  const [companyName, setCompanyName] =
    useState("");

  const [city, setCity] = useState("");
  const [state, setState] = useState("");

  const [images, setImages] =
    useState<File[]>([]);

  const [imagePreviews, setImagePreviews] =
    useState<string[]>([]);

  const [loading, setLoading] =
    useState(false);

  const [categoryLoading, setCategoryLoading] =
    useState(true);

  const [error, setError] = useState("");

  // =========================================================
  // LOAD
  // =========================================================

  useEffect(() => {
    loadUser();
    loadCategories();

    return () => {
      imagePreviews.forEach((preview) => {
        URL.revokeObjectURL(preview);
      });
    };
  }, []);

  // =========================================================
  // USER
  // =========================================================

  const loadUser = () => {
    const storedUser =
      localStorage.getItem("advixio_user");

    if (!storedUser) return;

    try {
      const user = JSON.parse(storedUser);

      setCompanyName(
        user.companyName || ""
      );

      setCity(user.city || "");
      setState(user.state || "");
    } catch (error) {
      console.error(
        "Invalid user data:",
        error
      );
    }
  };

  // =========================================================
  // CATEGORIES
  // =========================================================

  const loadCategories = async () => {
    try {
      setCategoryLoading(true);
      setError("");

      const response = await fetch(
        `${API_URL}/categories`,
        {
          cache: "no-store",
        }
      );

      const result =
        await response.json();

      if (
        !response.ok ||
        !result.success
      ) {
        throw new Error(
          result.message ||
            "Failed to load categories"
        );
      }

      setCategories(
        Array.isArray(result.data)
          ? result.data
          : []
      );
    } catch (error) {
      console.error(
        "Category loading error:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "Failed to load categories"
      );
    } finally {
      setCategoryLoading(false);
    }
  };

  // =========================================================
  // SPECIFICATIONS
  // =========================================================

  const addSpecification = () => {
    setSpecifications((previous) => [
      ...previous,
      {
        label: "",
        value: "",
      },
    ]);
  };

  const removeSpecification = (
    index: number
  ) => {
    setSpecifications((previous) =>
      previous.filter(
        (_, i) => i !== index
      )
    );
  };

  const updateSpecification = (
    index: number,
    key: keyof Specification,
    value: string
  ) => {
    setSpecifications((previous) =>
      previous.map((item, i) =>
        i === index
          ? {
              ...item,
              [key]: value,
            }
          : item
      )
    );
  };

  // =========================================================
  // CUSTOM FIELDS
  // =========================================================

  const addCustomField = () => {
    setCustomFields((previous) => [
      ...previous,
      {
        name: "",
        value: "",
      },
    ]);
  };

  const removeCustomField = (
    index: number
  ) => {
    setCustomFields((previous) =>
      previous.filter(
        (_, i) => i !== index
      )
    );
  };

  const updateCustomField = (
    index: number,
    key: keyof CustomField,
    value: string
  ) => {
    setCustomFields((previous) =>
      previous.map((item, i) =>
        i === index
          ? {
              ...item,
              [key]: value,
            }
          : item
      )
    );
  };

  // =========================================================
  // IMAGES
  // =========================================================

  const handleImageChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = Array.from(
      event.target.files || []
    );

    if (!files.length) return;

    setError("");

    if (files.length > 3) {
      setError(
        "You can upload maximum 3 images."
      );
      event.target.value = "";
      return;
    }

    const invalidFile = files.find(
      (file) =>
        !file.type.startsWith("image/")
    );

    if (invalidFile) {
      setError(
        "Only image files are allowed."
      );
      event.target.value = "";
      return;
    }

    const tooLarge = files.find(
      (file) =>
        file.size > 5 * 1024 * 1024
    );

    if (tooLarge) {
      setError(
        "Each image must be less than 5MB."
      );
      event.target.value = "";
      return;
    }

    imagePreviews.forEach((preview) => {
      URL.revokeObjectURL(preview);
    });

    const previews = files.map((file) =>
      URL.createObjectURL(file)
    );

    setImages(files);
    setImagePreviews(previews);
  };

  const removeImage = (
    index: number
  ) => {
    setImages((previous) =>
      previous.filter(
        (_, i) => i !== index
      )
    );

    setImagePreviews((previous) => {
      const preview =
        previous[index];

      if (preview) {
        URL.revokeObjectURL(preview);
      }

      return previous.filter(
        (_, i) => i !== index
      );
    });
  };

  // =========================================================
  // SUBMIT
  // =========================================================

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setError("");

    if (!name.trim()) {
      setError(
        "Product name is required."
      );
      return;
    }

    if (!category) {
      setError(
        "Please select a category."
      );
      return;
    }

    if (!images.length) {
      setError(
        "Please upload at least one product image."
      );
      return;
    }

    if (images.length > 3) {
      setError(
        "You can upload maximum 3 images."
      );
      return;
    }

    const token =
      localStorage.getItem(
        "advixio_token"
      );

    if (!token) {
      window.location.href = "/login";
      return;
    }

    try {
      setLoading(true);

      // =====================================================
      // CLEAN SPECIFICATIONS
      // =====================================================

      const cleanedSpecifications =
        specifications
          .map((item) => ({
            label: item.label.trim(),
            value: item.value.trim(),
          }))
          .filter(
            (item) =>
              item.label.length > 0 &&
              item.value.length > 0
          );

      // =====================================================
      // CLEAN CUSTOM FIELDS
      // =====================================================

      const cleanedCustomFields =
        customFields
          .map((item) => ({
            name: item.name.trim(),
            value: item.value.trim(),
          }))
          .filter(
            (item) =>
              item.name.length > 0 &&
              item.value.length > 0
          );

      // =====================================================
      // DEBUG
      // =====================================================

      console.log(
        "========================================"
      );

      console.log(
        "SPECIFICATIONS PAYLOAD:",
        cleanedSpecifications
      );

      console.log(
        "CUSTOM FIELDS PAYLOAD:",
        cleanedCustomFields
      );

      console.log(
        "CUSTOM FIELDS JSON:",
        JSON.stringify(
          cleanedCustomFields,
          null,
          2
        )
      );

      // =====================================================
      // FORM DATA
      // =====================================================

      const formData =
        new FormData();

      formData.append(
        "name",
        name.trim()
      );

      formData.append(
        "shortDescription",
        shortDescription.trim()
      );

      formData.append(
        "description",
        description.trim()
      );

      formData.append(
        "category",
        category
      );

      formData.append(
        "subcategory",
        subcategory.trim()
      );

      formData.append(
        "brand",
        brand.trim()
      );

      formData.append(
        "model",
        model.trim()
      );

      formData.append(
        "price",
        price.trim()
      );

      formData.append(
        "unit",
        unit.trim() || "Piece"
      );

      // =====================================================
      // SPECIFICATIONS
      // =====================================================

      formData.append(
        "specifications",
        JSON.stringify(
          cleanedSpecifications
        )
      );

      // =====================================================
      // CUSTOM FIELDS
      // =====================================================

      formData.append(
        "customFields",
        JSON.stringify(
          cleanedCustomFields
        )
      );

      // =====================================================
      // BUSINESS
      // =====================================================

      formData.append(
        "companyName",
        companyName.trim()
      );

      // =====================================================
      // LOCATION
      // =====================================================

      const locationData = {
        city: city.trim(),
        state: state.trim(),
        country: "India",
      };

      formData.append(
        "location",
        JSON.stringify(
          locationData
        )
      );

      // =====================================================
      // IMAGES
      // =====================================================

      images.forEach((file) => {
        formData.append(
          "images",
          file
        );
      });

      // =====================================================
      // FORMDATA DEBUG
      // =====================================================

      console.log(
        "========== FORMDATA DEBUG =========="
      );

      for (const [
        key,
        value,
      ] of formData.entries()) {
        if (value instanceof File) {
          console.log(
            key,
            "FILE:",
            value.name,
            value.type,
            value.size
          );
        } else {
          console.log(
            key,
            ":",
            value
          );
        }
      }

      // =====================================================
      // API
      // =====================================================

      const response =
        await fetch(
          `${API_URL}/products`,
          {
            method: "POST",
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
            body: formData,
          }
        );

      const result =
        await response.json();

      // =====================================================
      // RESPONSE DEBUG
      // =====================================================

      console.log(
        "========== CREATE PRODUCT RESPONSE =========="
      );

      console.log(result);

      if (
        response.status === 401
      ) {
        localStorage.removeItem(
          "advixio_token"
        );

        localStorage.removeItem(
          "advixio_user"
        );

        window.location.href =
          "/login";

        return;
      }

      if (
        !response.ok ||
        !result.success
      ) {
        throw new Error(
          result.message ||
            "Failed to create product."
        );
      }

      // =====================================================
      // SUCCESS
      // =====================================================

      console.log(
        "========================================"
      );

      console.log(
        "PRODUCT CREATED SUCCESSFULLY"
      );

      console.log(
        "PRODUCT:",
        result.data
      );

      console.log(
        "SPECIFICATIONS FROM API:",
        result.data?.specifications
      );

      console.log(
        "CUSTOM FIELDS FROM API:",
        result.data?.customFields
      );

      console.log(
        "SPECIFICATION COUNT:",
        result.data?.specifications?.length
      );

      console.log(
        "CUSTOM FIELD COUNT:",
        result.data?.customFields?.length
      );

      console.log(
        "========================================"
      );

      router.push(
        "/dashboard/products"
      );

      router.refresh();

    } catch (error) {
      console.error(
        "Create product error:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "Failed to create product."
      );

    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // UI
  // =========================================================

  return (
    <>
      <style jsx>{`
        .product-page {
          width: 100%;
          min-height: 100vh;
          padding: 24px;
          box-sizing: border-box;
        }

        .product-container {
          width: 100%;
          max-width: 1200px;
          margin: 0 auto;
        }

        .topbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 20px;
          margin-bottom: 24px;
        }

        .eyebrow {
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.08em;
          color: #6b7280;
        }

        .topbar h1 {
          margin: 5px 0;
          font-size: 32px;
          line-height: 1.2;
        }

        .topbar p {
          margin: 0;
          color: #6b7280;
        }

        .marketplace-button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-height: 42px;
          padding: 0 16px;
          border: 1px solid #d1d5db;
          border-radius: 9px;
          text-decoration: none;
          color: #111827;
          background: #fff;
          font-weight: 600;
          white-space: nowrap;
        }

        .form-panel {
          width: 100%;
          background: #fff;
          border: 1px solid #e5e7eb;
          border-radius: 16px;
          overflow: hidden;
        }

        .section {
          padding: 24px;
          border-bottom: 1px solid #e5e7eb;
        }

        .section:last-child {
          border-bottom: 0;
        }

        .section-title {
          margin: 0 0 18px;
          font-size: 20px;
          color: #111827;
        }

        .section-description {
          margin: -10px 0 18px;
          color: #6b7280;
          font-size: 14px;
        }

        .form-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 18px;
        }

        .field {
          min-width: 0;
        }

        .field.full {
          grid-column: 1 / -1;
        }

        .field label {
          display: block;
          margin-bottom: 7px;
          font-size: 14px;
          font-weight: 600;
          color: #374151;
        }

        .field input,
        .field textarea,
        .field select {
          width: 100%;
          box-sizing: border-box;
          border: 1px solid #d1d5db;
          border-radius: 9px;
          padding: 11px 12px;
          font-size: 14px;
          background: #fff;
          color: #111827;
          outline: none;
        }

        .field textarea {
          resize: vertical;
          min-height: 120px;
        }

        .field input:focus,
        .field textarea:focus,
        .field select:focus {
          border-color: #111827;
        }

        .section-head {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 16px;
          margin-bottom: 18px;
        }

        .section-head h2 {
          margin: 0;
          font-size: 20px;
        }

        .section-head p {
          margin: 6px 0 0;
          color: #6b7280;
          font-size: 14px;
        }

        .add-button {
          border: 0;
          border-radius: 9px;
          background: #111827;
          color: #fff;
          padding: 11px 16px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          white-space: nowrap;
        }

        .add-button:disabled,
        .remove-button:disabled,
        .submit-button:disabled {
          opacity: 0.55;
          cursor: not-allowed;
        }

        .empty-box {
          border: 1px dashed #d1d5db;
          border-radius: 12px;
          padding: 32px 20px;
          text-align: center;
          background: #fafafa;
        }

        .empty-box p {
          margin: 0 0 16px;
          color: #6b7280;
          font-size: 14px;
        }

        /* Desktop rows */

        .desktop-table {
          width: 100%;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          overflow: hidden;
        }

        .table-header,
        .table-row {
          display: grid;
          grid-template-columns:
            minmax(180px, 1fr)
            minmax(220px, 1.5fr)
            100px;
        }

        .table-header {
          background: #f9fafb;
          border-bottom: 1px solid #e5e7eb;
        }

        .table-row {
          border-bottom: 1px solid #e5e7eb;
          align-items: center;
        }

        .table-row:last-child {
          border-bottom: 0;
        }

        .table-cell {
          padding: 12px 14px;
        }

        .table-header .table-cell {
          padding: 14px;
          font-size: 13px;
          font-weight: 600;
          color: #374151;
        }

        .table-cell input {
          width: 100%;
          box-sizing: border-box;
          padding: 10px 11px;
          border: 1px solid #d1d5db;
          border-radius: 8px;
          font-size: 14px;
        }

        .action-cell {
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .remove-button {
          border: 1px solid #e5e7eb;
          background: #fff;
          color: #dc2626;
          border-radius: 8px;
          padding: 8px 10px;
          cursor: pointer;
          font-size: 13px;
        }

        /* Mobile cards */

        .mobile-fields {
          display: none;
        }

        .mobile-field-card {
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          padding: 14px;
          margin-bottom: 12px;
          background: #fff;
        }

        .mobile-field-card:last-child {
          margin-bottom: 0;
        }

        .mobile-field-label {
          display: block;
          margin-bottom: 6px;
          font-size: 12px;
          font-weight: 700;
          color: #6b7280;
        }

        .mobile-field-card input {
          width: 100%;
          box-sizing: border-box;
          padding: 11px 12px;
          border: 1px solid #d1d5db;
          border-radius: 8px;
          font-size: 14px;
          margin-bottom: 12px;
        }

        .mobile-remove {
          width: 100%;
        }

        .image-upload {
          width: 100%;
        }

        .image-upload small {
          display: block;
          margin-top: 7px;
          color: #6b7280;
          font-size: 12px;
        }

        .image-preview-grid {
          display: grid;
          grid-template-columns:
            repeat(3, minmax(0, 1fr));
          gap: 14px;
          margin-top: 18px;
        }

        .image-preview {
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          overflow: hidden;
          background: #fff;
        }

        .image-preview img {
          display: block;
          width: 100%;
          aspect-ratio: 1 / 1;
          object-fit: cover;
        }

        .image-preview-info {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
          padding: 9px 10px;
          font-size: 12px;
        }

        .image-preview-info button {
          border: 0;
          background: transparent;
          color: #dc2626;
          cursor: pointer;
          font-size: 12px;
        }

        .error {
          margin: 20px 24px 0;
          padding: 12px 14px;
          border-radius: 9px;
          background: #fef2f2;
          color: #b91c1c;
          border: 1px solid #fecaca;
          font-size: 14px;
        }

        .footer {
          display: flex;
          justify-content: flex-end;
          gap: 12px;
          padding: 20px 24px;
          background: #fafafa;
          border-top: 1px solid #e5e7eb;
        }

        .cancel-button,
        .submit-button {
          min-height: 44px;
          padding: 0 18px;
          border-radius: 9px;
          font-size: 14px;
          font-weight: 600;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          text-decoration: none;
        }

        .cancel-button {
          border: 1px solid #d1d5db;
          color: #374151;
          background: #fff;
        }

        .submit-button {
          border: 0;
          background: #111827;
          color: #fff;
          cursor: pointer;
        }

        /* =========================================
           TABLET
        ========================================= */

        @media (max-width: 768px) {
          .product-page {
            padding: 14px;
          }

          .topbar {
            align-items: flex-start;
            flex-direction: column;
          }

          .topbar h1 {
            font-size: 26px;
          }

          .marketplace-button {
            width: 100%;
          }

          .form-grid {
            grid-template-columns: 1fr;
          }

          .field.full {
            grid-column: auto;
          }

          .section {
            padding: 18px;
          }

          .section-head {
            flex-direction: column;
          }

          .section-head .add-button {
            width: 100%;
          }

          .image-preview-grid {
            grid-template-columns:
              repeat(2, minmax(0, 1fr));
          }
        }

        /* =========================================
           PHONE
        ========================================= */

        @media (max-width: 600px) {
          .product-page {
            padding: 8px;
          }

          .topbar {
            margin-bottom: 14px;
            gap: 12px;
          }

          .topbar h1 {
            font-size: 23px;
          }

          .topbar p {
            font-size: 13px;
            line-height: 1.5;
          }

          .form-panel {
            border-radius: 12px;
          }

          .section {
            padding: 14px;
          }

          .section-title {
            font-size: 18px;
          }

          .section-head h2 {
            font-size: 18px;
          }

          .section-head p {
            line-height: 1.5;
          }

          .field input,
          .field textarea,
          .field select {
            font-size: 16px;
            min-height: 46px;
          }

          .field textarea {
            min-height: 120px;
          }

          /* Hide desktop tables */
          .desktop-table {
            display: none;
          }

          /* Show mobile cards */
          .mobile-fields {
            display: block;
          }

          .image-preview-grid {
            grid-template-columns: 1fr;
          }

          .footer {
            flex-direction: column-reverse;
            padding: 14px;
          }

          .cancel-button,
          .submit-button {
            width: 100%;
          }

          .error {
            margin: 14px;
          }
        }
      `}</style>

      <main className="product-page">
        <div className="product-container">

          {/* =================================================
              TOP BAR
          ================================================= */}

          <div className="topbar">

            <div>
              <span className="eyebrow">
                PRODUCT MANAGEMENT
              </span>

              <h1>
                Add Product
              </h1>

              <p>
                Create a new product listing
                for the Advixio marketplace.
              </p>
            </div>

            <Link
              href="/dashboard/products"
              className="marketplace-button"
            >
              My Products
            </Link>

          </div>

          {/* =================================================
              FORM
          ================================================= */}

          <form
            onSubmit={handleSubmit}
            className="form-panel"
          >

            {/* ERROR */}

            {error && (
              <div className="error">
                {error}
              </div>
            )}

            {/* =================================================
                BASIC INFORMATION
            ================================================= */}

            <div className="section">

              <h2 className="section-title">
                Basic Information
              </h2>

              <div className="form-grid">

                <div className="field full">
                  <label>
                    Product Name *
                  </label>

                  <input
                    type="text"
                    value={name}
                    onChange={(event) =>
                      setName(
                        event.target.value
                      )
                    }
                    placeholder="Enter product name"
                    disabled={loading}
                    required
                  />
                </div>

                <div className="field full">
                  <label>
                    Short Description
                  </label>

                  <input
                    type="text"
                    value={
                      shortDescription
                    }
                    onChange={(event) =>
                      setShortDescription(
                        event.target.value
                      )
                    }
                    placeholder="Short product description"
                    disabled={loading}
                  />
                </div>

                <div className="field full">
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
                    placeholder="Describe your product"
                    rows={5}
                    disabled={loading}
                  />
                </div>

              </div>
            </div>

            {/* =================================================
                CATEGORY
            ================================================= */}

            <div className="section">

              <h2 className="section-title">
                Category
              </h2>

              <div className="form-grid">

                <div className="field">
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
                    disabled={
                      loading ||
                      categoryLoading
                    }
                    required
                  >
                    <option value="">
                      {categoryLoading
                        ? "Loading categories..."
                        : "Select category"}
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

                <div className="field">
                  <label>
                    Subcategory
                  </label>

                  <input
                    type="text"
                    value={subcategory}
                    onChange={(event) =>
                      setSubcategory(
                        event.target.value
                      )
                    }
                    placeholder="Enter subcategory"
                    disabled={loading}
                  />
                </div>

              </div>
            </div>

            {/* =================================================
                PRODUCT INFORMATION
            ================================================= */}

            <div className="section">

              <h2 className="section-title">
                Product Information
              </h2>

              <div className="form-grid">

                <div className="field">
                  <label>
                    Brand
                  </label>

                  <input
                    type="text"
                    value={brand}
                    onChange={(event) =>
                      setBrand(
                        event.target.value
                      )
                    }
                    placeholder="Enter brand"
                    disabled={loading}
                  />
                </div>

                <div className="field">
                  <label>
                    Model
                  </label>

                  <input
                    type="text"
                    value={model}
                    onChange={(event) =>
                      setModel(
                        event.target.value
                      )
                    }
                    placeholder="Enter model"
                    disabled={loading}
                  />
                </div>

                <div className="field">
                  <label>
                    Price
                  </label>

                  <input
                    type="number"
                    value={price}
                    onChange={(event) =>
                      setPrice(
                        event.target.value
                      )
                    }
                    placeholder="Enter price"
                    min="0"
                    step="any"
                    disabled={loading}
                  />
                </div>

                <div className="field">
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
                    disabled={loading}
                  >
                    <option value="Piece">
                      Piece
                    </option>

                    <option value="Kg">
                      Kg
                    </option>

                    <option value="Ton">
                      Ton
                    </option>

                    <option value="Meter">
                      Meter
                    </option>

                    <option value="Liter">
                      Liter
                    </option>

                    <option value="Set">
                      Set
                    </option>

                    <option value="Box">
                      Box
                    </option>

                    <option value="Pack">
                      Pack
                    </option>
                  </select>
                </div>

              </div>
            </div>

            {/* =================================================
                SPECIFICATIONS
            ================================================= */}

            <div className="section">

              <div className="section-head">

                <div>
                  <h2>
                    Specifications
                  </h2>

                  <p>
                    Add standard product
                    specifications such as
                    Weight, Dimensions,
                    Material, Capacity, etc.
                  </p>
                </div>

                <button
                  type="button"
                  className="add-button"
                  onClick={
                    addSpecification
                  }
                  disabled={loading}
                >
                  + Add Specification
                </button>

              </div>

              {specifications.length === 0 ? (

                <div className="empty-box">

                  <p>
                    No specifications
                    added yet.
                  </p>

                  <button
                    type="button"
                    className="add-button"
                    onClick={
                      addSpecification
                    }
                    disabled={loading}
                  >
                    + Add First Specification
                  </button>

                </div>

              ) : (

                <>
                  {/* DESKTOP */}

                  <div className="desktop-table">

                    <div className="table-header">

                      <div className="table-cell">
                        Specification
                      </div>

                      <div className="table-cell">
                        Value
                      </div>

                      <div className="table-cell">
                        Action
                      </div>

                    </div>

                    {specifications.map(
                      (
                        specification,
                        index
                      ) => (

                        <div
                          key={index}
                          className="table-row"
                        >

                          <div className="table-cell">

                            <input
                              type="text"
                              value={
                                specification.label
                              }
                              onChange={(
                                event
                              ) =>
                                updateSpecification(
                                  index,
                                  "label",
                                  event.target
                                    .value
                                )
                              }
                              placeholder="e.g. Voltage"
                              disabled={loading}
                            />

                          </div>

                          <div className="table-cell">

                            <input
                              type="text"
                              value={
                                specification.value
                              }
                              onChange={(
                                event
                              ) =>
                                updateSpecification(
                                  index,
                                  "value",
                                  event.target
                                    .value
                                )
                              }
                              placeholder="e.g. 5V"
                              disabled={loading}
                            />

                          </div>

                          <div className="table-cell action-cell">

                            <button
                              type="button"
                              className="remove-button"
                              onClick={() =>
                                removeSpecification(
                                  index
                                )
                              }
                              disabled={loading}
                            >
                              Remove
                            </button>

                          </div>

                        </div>
                      )
                    )}

                  </div>

                  {/* MOBILE */}

                  <div className="mobile-fields">

                    {specifications.map(
                      (
                        specification,
                        index
                      ) => (

                        <div
                          key={index}
                          className="mobile-field-card"
                        >

                          <label className="mobile-field-label">
                            Specification
                          </label>

                          <input
                            type="text"
                            value={
                              specification.label
                            }
                            onChange={(
                              event
                            ) =>
                              updateSpecification(
                                index,
                                "label",
                                event.target
                                  .value
                              )
                            }
                            placeholder="e.g. Voltage"
                            disabled={loading}
                          />

                          <label className="mobile-field-label">
                            Value
                          </label>

                          <input
                            type="text"
                            value={
                              specification.value
                            }
                            onChange={(
                              event
                            ) =>
                              updateSpecification(
                                index,
                                "value",
                                event.target
                                  .value
                              )
                            }
                            placeholder="e.g. 5V"
                            disabled={loading}
                          />

                          <button
                            type="button"
                            className="remove-button mobile-remove"
                            onClick={() =>
                              removeSpecification(
                                index
                              )
                            }
                            disabled={loading}
                          >
                            Remove
                          </button>

                        </div>
                      )
                    )}

                  </div>
                </>
              )}

            </div>

            {/* =================================================
                PRODUCT DETAILS / CUSTOM FIELDS
            ================================================= */}

            <div className="section">

              <div className="section-head">

                <div>
                  <h2>
                    Product Details
                  </h2>

                  <p>
                    Add custom product
                    attributes such as
                    Warranty, Color, Size,
                    Capacity, Voltage, etc.
                  </p>
                </div>

                {/* ONLY ONE ADD ROW BUTTON */}

                <button
                  type="button"
                  className="add-button"
                  onClick={
                    addCustomField
                  }
                  disabled={loading}
                >
                  + Add Row
                </button>

              </div>

              {customFields.length === 0 ? (

                <div className="empty-box">

                  <p>
                    No custom product
                    details added yet.
                  </p>

                  <button
                    type="button"
                    className="add-button"
                    onClick={
                      addCustomField
                    }
                    disabled={loading}
                  >
                    + Add First Row
                  </button>

                </div>

              ) : (

                <>
                  {/* DESKTOP */}

                  <div className="desktop-table">

                    <div className="table-header">

                      <div className="table-cell">
                        Field Name
                      </div>

                      <div className="table-cell">
                        Value
                      </div>

                      <div className="table-cell">
                        Action
                      </div>

                    </div>

                    {customFields.map(
                      (
                        field,
                        index
                      ) => (

                        <div
                          key={index}
                          className="table-row"
                        >

                          <div className="table-cell">

                            <input
                              type="text"
                              value={
                                field.name
                              }
                              onChange={(
                                event
                              ) =>
                                updateCustomField(
                                  index,
                                  "name",
                                  event.target
                                    .value
                                )
                              }
                              placeholder="e.g. Color"
                              disabled={loading}
                            />

                          </div>

                          <div className="table-cell">

                            <input
                              type="text"
                              value={
                                field.value
                              }
                              onChange={(
                                event
                              ) =>
                                updateCustomField(
                                  index,
                                  "value",
                                  event.target
                                    .value
                                )
                              }
                              placeholder="e.g. White"
                              disabled={loading}
                            />

                          </div>

                          <div className="table-cell action-cell">

                            <button
                              type="button"
                              className="remove-button"
                              onClick={() =>
                                removeCustomField(
                                  index
                                )
                              }
                              disabled={loading}
                            >
                              Remove
                            </button>

                          </div>

                        </div>
                      )
                    )}

                  </div>

                  {/* MOBILE */}

                  <div className="mobile-fields">

                    {customFields.map(
                      (
                        field,
                        index
                      ) => (

                        <div
                          key={index}
                          className="mobile-field-card"
                        >

                          <label className="mobile-field-label">
                            Field Name
                          </label>

                          <input
                            type="text"
                            value={
                              field.name
                            }
                            onChange={(
                              event
                            ) =>
                              updateCustomField(
                                index,
                                "name",
                                event.target
                                  .value
                              )
                            }
                            placeholder="e.g. Color"
                            disabled={loading}
                          />

                          <label className="mobile-field-label">
                            Value
                          </label>

                          <input
                            type="text"
                            value={
                              field.value
                            }
                            onChange={(
                              event
                            ) =>
                              updateCustomField(
                                index,
                                "value",
                                event.target
                                  .value
                              )
                            }
                            placeholder="e.g. White"
                            disabled={loading}
                          />

                          <button
                            type="button"
                            className="remove-button mobile-remove"
                            onClick={() =>
                              removeCustomField(
                                index
                              )
                            }
                            disabled={loading}
                          >
                            Remove
                          </button>

                        </div>
                      )
                    )}

                  </div>
                </>
              )}

            </div>

            {/* =================================================
                BUSINESS INFORMATION
            ================================================= */}

            <div className="section">

              <h2 className="section-title">
                Business Information
              </h2>

              <div className="form-grid">

                <div className="field full">
                  <label>
                    Company Name
                  </label>

                  <input
                    type="text"
                    value={companyName}
                    onChange={(event) =>
                      setCompanyName(
                        event.target.value
                      )
                    }
                    disabled={loading}
                  />
                </div>

                <div className="field">
                  <label>
                    City
                  </label>

                  <input
                    type="text"
                    value={city}
                    onChange={(event) =>
                      setCity(
                        event.target.value
                      )
                    }
                    placeholder="Enter city"
                    disabled={loading}
                  />
                </div>

                <div className="field">
                  <label>
                    State
                  </label>

                  <input
                    type="text"
                    value={state}
                    onChange={(event) =>
                      setState(
                        event.target.value
                      )
                    }
                    placeholder="Enter state"
                    disabled={loading}
                  />
                </div>

              </div>

            </div>

            {/* =================================================
                IMAGES
            ================================================= */}

            <div className="section">

              <h2 className="section-title">
                Product Images
              </h2>

              <div className="field full">

                <label>
                  Upload Product Images *
                </label>

                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={
                    handleImageChange
                  }
                  disabled={loading}
                />

                <small>
                  Upload maximum 3 images.
                  Each image must be less
                  than 5MB.
                </small>

              </div>

              {imagePreviews.length > 0 && (

                <div className="image-preview-grid">

                  {imagePreviews.map(
                    (
                      preview,
                      index
                    ) => (

                      <div
                        key={preview}
                        className="image-preview"
                      >

                        <img
                          src={preview}
                          alt={
                            `Product preview ${
                              index + 1
                            }`
                          }
                        />

                        <div className="image-preview-info">

                          <span>
                            Image{" "}
                            {index + 1}
                          </span>

                          <button
                            type="button"
                            onClick={() =>
                              removeImage(
                                index
                              )
                            }
                            disabled={loading}
                          >
                            Remove
                          </button>

                        </div>

                      </div>
                    )
                  )}

                </div>
              )}

            </div>

            {/* =================================================
                FOOTER
            ================================================= */}

            <div className="footer">

              <Link
                href="/dashboard/products"
                className="cancel-button"
              >
                Cancel
              </Link>

              <button
                type="submit"
                className="submit-button"
                disabled={loading}
              >
                {loading
                  ? "Uploading & Publishing..."
                  : "Publish Product"}
              </button>

            </div>

          </form>

        </div>
      </main>
    </>
  );
}