
// "use client";

// import { FormEvent, useEffect, useState } from "react";
// import Link from "next/link";
// import { useRouter } from "next/navigation";

// const API_URL =
//   process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

// type Category = {
//   _id: string;
//   name: string;
//   slug: string;
// };

// export default function AddProductPage() {
//   const router = useRouter();

//   const [categories, setCategories] = useState<Category[]>([]);

//   const [name, setName] = useState("");
//   const [shortDescription, setShortDescription] =
//     useState("");
//   const [description, setDescription] = useState("");
//   const [category, setCategory] = useState("");
//   const [subcategory, setSubcategory] = useState("");
//   const [brand, setBrand] = useState("");
//   const [model, setModel] = useState("");
//   const [price, setPrice] = useState("");
//   const [unit, setUnit] = useState("Piece");

//   const [companyName, setCompanyName] = useState("");
//   const [city, setCity] = useState("");
//   const [state, setState] = useState("");

//   // Product images
//   const [images, setImages] = useState<File[]>([]);
//   const [imagePreviews, setImagePreviews] = useState<string[]>([]);

//   const [loading, setLoading] = useState(false);
//   const [categoryLoading, setCategoryLoading] =
//     useState(true);

//   const [error, setError] = useState("");

//   // ==========================================
//   // LOAD USER + CATEGORIES
//   // ==========================================

//   useEffect(() => {
//     loadUser();
//     loadCategories();

//     return () => {
//       imagePreviews.forEach((preview) => {
//         URL.revokeObjectURL(preview);
//       });
//     };
//   }, []);

//   // ==========================================
//   // LOAD USER
//   // ==========================================

//   const loadUser = () => {
//     const storedUser =
//       localStorage.getItem("advixio_user");

//     if (!storedUser) {
//       return;
//     }

//     try {
//       const user = JSON.parse(storedUser);

//       setCompanyName(user.companyName || "");
//       setCity(user.city || "");
//       setState(user.state || "");
//     } catch {
//       console.error("Invalid user data");
//     }
//   };

//   // ==========================================
//   // LOAD CATEGORIES
//   // ==========================================

//   const loadCategories = async () => {
//     try {
//       setCategoryLoading(true);

//       const response = await fetch(
//         `${API_URL}/categories`,
//         {
//           cache: "no-store",
//         }
//       );

//       const result = await response.json();

//       if (!response.ok || !result.success) {
//         throw new Error(
//           result.message ||
//             "Failed to load categories."
//         );
//       }

//       setCategories(result.data || []);
//     } catch (err) {
//       console.error(err);

//       setError(
//         err instanceof Error
//           ? err.message
//           : "Failed to load categories."
//       );
//     } finally {
//       setCategoryLoading(false);
//     }
//   };

//   // ==========================================
//   // IMAGE SELECT
//   // ==========================================

//   const handleImageChange = (
//     event: React.ChangeEvent<HTMLInputElement>
//   ) => {
//     const files = Array.from(
//       event.target.files || []
//     );

//     if (files.length === 0) {
//       return;
//     }

//     setError("");

//     // Maximum 3 images
//     if (files.length > 3) {
//       setError(
//         "You can upload maximum 3 images."
//       );

//       event.target.value = "";
//       return;
//     }

//     // Check file type
//     const invalidFile = files.find(
//       (file) =>
//         !file.type.startsWith("image/")
//     );

//     if (invalidFile) {
//       setError(
//         "Only image files are allowed."
//       );

//       event.target.value = "";
//       return;
//     }

//     // Maximum 5MB per image
//     const tooLarge = files.find(
//       (file) =>
//         file.size > 5 * 1024 * 1024
//     );

//     if (tooLarge) {
//       setError(
//         "Each image must be less than 5MB."
//       );

//       event.target.value = "";
//       return;
//     }

//     // Remove old previews
//     imagePreviews.forEach((preview) => {
//       URL.revokeObjectURL(preview);
//     });

//     // Save files
//     setImages(files);

//     // Create previews
//     const previews = files.map((file) =>
//       URL.createObjectURL(file)
//     );

//     setImagePreviews(previews);
//   };

//   // ==========================================
//   // REMOVE IMAGE
//   // ==========================================

//   const removeImage = (index: number) => {
//     setImages((previous) =>
//       previous.filter(
//         (_, imageIndex) =>
//           imageIndex !== index
//       )
//     );

//     setImagePreviews((previous) => {
//       const previewToRemove =
//         previous[index];

//       if (previewToRemove) {
//         URL.revokeObjectURL(
//           previewToRemove
//         );
//       }

//       return previous.filter(
//         (_, imageIndex) =>
//           imageIndex !== index
//       );
//     });
//   };

//   // ==========================================
//   // SUBMIT PRODUCT
//   // ==========================================

//   const handleSubmit = async (
//     event: FormEvent<HTMLFormElement>
//   ) => {
//     event.preventDefault();

//     setError("");

//     // Product name validation
//     if (!name.trim()) {
//       setError(
//         "Product name is required."
//       );
//       return;
//     }

//     // Category validation
//     if (!category) {
//       setError(
//         "Please select a category."
//       );
//       return;
//     }

//     // Image validation
//     if (images.length === 0) {
//       setError(
//         "Please upload at least one product image."
//       );
//       return;
//     }

//     if (images.length > 3) {
//       setError(
//         "You can upload maximum 3 images."
//       );
//       return;
//     }

//     try {
//       setLoading(true);

//       // ==========================================
//       // GET LOGIN TOKEN
//       // ==========================================

//       const token =
//         localStorage.getItem(
//           "advixio_token"
//         );

//       if (!token) {
//         window.location.href =
//           "/login";
//         return;
//       }

//       // ==========================================
//       // CREATE FORMDATA
//       // ==========================================

//       const formData = new FormData();

//       formData.append(
//         "name",
//         name.trim()
//       );

//       formData.append(
//         "shortDescription",
//         shortDescription.trim()
//       );

//       formData.append(
//         "description",
//         description.trim()
//       );

//       formData.append(
//         "category",
//         category
//       );

//       formData.append(
//         "subcategory",
//         subcategory.trim()
//       );

//       formData.append(
//         "brand",
//         brand.trim()
//       );

//       formData.append(
//         "model",
//         model.trim()
//       );

//       if (price) {
//         formData.append(
//           "price",
//           price
//         );
//       }

//       formData.append(
//         "unit",
//         unit
//       );

//       formData.append(
//         "companyName",
//         companyName.trim()
//       );

//       // Location JSON
//       formData.append(
//         "location",
//         JSON.stringify({
//           city: city.trim(),
//           state: state.trim(),
//           country: "India",
//         })
//       );

//       // Specifications
//       formData.append(
//         "specifications",
//         JSON.stringify([])
//       );

//       // ==========================================
//       // ADD IMAGES
//       // FIELD NAME MUST BE "images"
//       // ==========================================

//       images.forEach((file) => {
//         formData.append(
//           "images",
//           file
//         );
//       });

//       // ==========================================
//       // SEND TO BACKEND
//       // ==========================================

//       const response = await fetch(
//         `${API_URL}/products`,
//         {
//           method: "POST",

//           headers: {
//             Authorization:
//               `Bearer ${token}`,
//           },

//           body: formData,
//         }
//       );

//       const result =
//         await response.json();

//       // ==========================================
//       // TOKEN EXPIRED
//       // ==========================================

//       if (response.status === 401) {
//         localStorage.removeItem(
//           "advixio_token"
//         );

//         localStorage.removeItem(
//           "advixio_user"
//         );

//         window.location.href =
//           "/login";

//         return;
//       }

//       // ==========================================
//       // API ERROR
//       // ==========================================

//       if (
//         !response.ok ||
//         !result.success
//       ) {
//         throw new Error(
//           result.message ||
//             "Failed to create product."
//         );
//       }

//       // ==========================================
//       // SUCCESS
//       // ==========================================

//       router.push(
//         "/dashboard/products"
//       );

//       router.refresh();

//     } catch (err) {
//       console.error(
//         "Create product error:",
//         err
//       );

//       setError(
//         err instanceof Error
//           ? err.message
//           : "Failed to create product."
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ==========================================
//   // UI
//   // ==========================================

//   return (
//     <main className="dashboard-page">

//       <div className="dashboard-container">

//         {/* ======================================
//             TOP BAR
//         ====================================== */}

//         <div className="dashboard-topbar">

//           <div>

//             <span className="dashboard-eyebrow">
//               PRODUCT MANAGEMENT
//             </span>

//             <h1>
//               Add Product
//             </h1>

//             <p>
//               Create a new product listing
//               for the Advixio marketplace.
//             </p>

//           </div>

//           <div className="dashboard-top-actions">

//             <Link
//               href="/dashboard/products"
//               className="dashboard-marketplace-button"
//             >
//               My Products
//             </Link>

//           </div>

//         </div>

//         {/* ======================================
//             PRODUCT FORM
//         ====================================== */}

//         <form
//           onSubmit={handleSubmit}
//           className="product-form-panel"
//         >

//           {/* ERROR */}

//           {error && (
//             <div className="dashboard-error">
//               {error}
//             </div>
//           )}

//           {/* ====================================
//               BASIC INFORMATION
//           ==================================== */}

//           <div className="product-form-section">

//             <h2>
//               Basic Information
//             </h2>

//             <div className="product-form-grid">

//               {/* Product Name */}

//               <div className="product-form-field full">

//                 <label>
//                   Product Name *
//                 </label>

//                 <input
//                   value={name}
//                   onChange={(event) =>
//                     setName(
//                       event.target.value
//                     )
//                   }
//                   placeholder="Enter product name"
//                   disabled={loading}
//                   required
//                 />

//               </div>

//               {/* Short Description */}

//               <div className="product-form-field full">

//                 <label>
//                   Short Description
//                 </label>

//                 <input
//                   value={
//                     shortDescription
//                   }
//                   onChange={(event) =>
//                     setShortDescription(
//                       event.target.value
//                     )
//                   }
//                   placeholder="Short product description"
//                   disabled={loading}
//                 />

//               </div>

//               {/* Description */}

//               <div className="product-form-field full">

//                 <label>
//                   Description
//                 </label>

//                 <textarea
//                   value={description}
//                   onChange={(event) =>
//                     setDescription(
//                       event.target.value
//                     )
//                   }
//                   placeholder="Describe your product"
//                   rows={5}
//                   disabled={loading}
//                 />

//               </div>

//             </div>

//           </div>

//           {/* ====================================
//               CATEGORY
//           ==================================== */}

//           <div className="product-form-section">

//             <h2>
//               Category
//             </h2>

//             <div className="product-form-grid">

//               {/* Category */}

//               <div className="product-form-field">

//                 <label>
//                   Category *
//                 </label>

//                 <select
//                   value={category}
//                   onChange={(event) =>
//                     setCategory(
//                       event.target.value
//                     )
//                   }
//                   disabled={
//                     loading ||
//                     categoryLoading
//                   }
//                   required
//                 >

//                   <option value="">
//                     {categoryLoading
//                       ? "Loading categories..."
//                       : "Select category"}
//                   </option>

//                   {categories.map(
//                     (item) => (
//                       <option
//                         key={item._id}
//                         value={item._id}
//                       >
//                         {item.name}
//                       </option>
//                     )
//                   )}

//                 </select>

//               </div>

//               {/* Subcategory */}

//               <div className="product-form-field">

//                 <label>
//                   Subcategory
//                 </label>

//                 <input
//                   value={subcategory}
//                   onChange={(event) =>
//                     setSubcategory(
//                       event.target.value
//                     )
//                   }
//                   placeholder="Enter subcategory"
//                   disabled={loading}
//                 />

//               </div>

//             </div>

//           </div>

//           {/* ====================================
//               PRODUCT DETAILS
//           ==================================== */}

//           <div className="product-form-section">

//             <h2>
//               Product Details
//             </h2>

//             <div className="product-form-grid">

//               {/* Brand */}

//               <div className="product-form-field">

//                 <label>
//                   Brand
//                 </label>

//                 <input
//                   value={brand}
//                   onChange={(event) =>
//                     setBrand(
//                       event.target.value
//                     )
//                   }
//                   placeholder="Brand name"
//                   disabled={loading}
//                 />

//               </div>

//               {/* Model */}

//               <div className="product-form-field">

//                 <label>
//                   Model
//                 </label>

//                 <input
//                   value={model}
//                   onChange={(event) =>
//                     setModel(
//                       event.target.value
//                     )
//                   }
//                   placeholder="Model number"
//                   disabled={loading}
//                 />

//               </div>

//               {/* Price */}

//               <div className="product-form-field">

//                 <label>
//                   Price
//                 </label>

//                 <input
//                   type="number"
//                   min="0"
//                   value={price}
//                   onChange={(event) =>
//                     setPrice(
//                       event.target.value
//                     )
//                   }
//                   placeholder="0"
//                   disabled={loading}
//                 />

//               </div>

//               {/* Unit */}

//               <div className="product-form-field">

//                 <label>
//                   Unit
//                 </label>

//                 <select
//                   value={unit}
//                   onChange={(event) =>
//                     setUnit(
//                       event.target.value
//                     )
//                   }
//                   disabled={loading}
//                 >

//                   <option value="Piece">
//                     Piece
//                   </option>

//                   <option value="Kg">
//                     Kg
//                   </option>

//                   <option value="Ton">
//                     Ton
//                   </option>

//                   <option value="Meter">
//                     Meter
//                   </option>

//                   <option value="Set">
//                     Set
//                   </option>

//                   <option value="Box">
//                     Box
//                   </option>

//                   <option value="Liter">
//                     Liter
//                   </option>

//                 </select>

//               </div>

//             </div>

//           </div>

//           {/* ====================================
//               BUSINESS INFORMATION
//           ==================================== */}

//           <div className="product-form-section">

//             <h2>
//               Business Information
//             </h2>

//             <div className="product-form-grid">

//               {/* Company */}

//               <div className="product-form-field full">

//                 <label>
//                   Company Name
//                 </label>

//                 <input
//                   value={companyName}
//                   onChange={(event) =>
//                     setCompanyName(
//                       event.target.value
//                     )
//                   }
//                   disabled={loading}
//                 />

//               </div>

//               {/* City */}

//               <div className="product-form-field">

//                 <label>
//                   City
//                 </label>

//                 <input
//                   value={city}
//                   onChange={(event) =>
//                     setCity(
//                       event.target.value
//                     )
//                   }
//                   disabled={loading}
//                 />

//               </div>

//               {/* State */}

//               <div className="product-form-field">

//                 <label>
//                   State
//                 </label>

//                 <input
//                   value={state}
//                   onChange={(event) =>
//                     setState(
//                       event.target.value
//                     )
//                   }
//                   disabled={loading}
//                 />

//               </div>

//             </div>

//           </div>

//           {/* ====================================
//               PRODUCT IMAGES
//           ==================================== */}

//           <div className="product-form-section">

//             <h2>
//               Product Images
//             </h2>

//             <div className="product-form-field full">

//               <label>
//                 Upload Product Images *
//               </label>

//               <input
//                 type="file"
//                 accept="image/*"
//                 multiple
//                 onChange={
//                   handleImageChange
//                 }
//                 disabled={loading}
//               />

//               <small>
//                 Upload maximum 3 images.
//                 Each image must be less than
//                 5MB.
//               </small>

//             </div>

//             {/* IMAGE PREVIEWS */}

//             {imagePreviews.length > 0 && (

//               <div className="product-image-preview-grid">

//                 {imagePreviews.map(
//                   (
//                     preview,
//                     index
//                   ) => (

//                     <div
//                       key={preview}
//                       className="product-image-preview"
//                     >

//                       <img
//                         src={preview}
//                         alt={
//                           `Product preview ${
//                             index + 1
//                           }`
//                         }
//                       />

//                       <div className="product-image-preview-info">

//                         <span>
//                           Image {index + 1}
//                         </span>

//                         <button
//                           type="button"
//                           onClick={() =>
//                             removeImage(
//                               index
//                             )
//                           }
//                           disabled={loading}
//                         >
//                           Remove
//                         </button>

//                       </div>

//                     </div>

//                   )
//                 )}

//               </div>

//             )}

//           </div>

//           {/* ====================================
//               FORM FOOTER
//           ==================================== */}

//           <div className="product-form-footer">

//             <Link
//               href="/dashboard/products"
//               className="product-cancel-button"
//             >
//               Cancel
//             </Link>

//             <button
//               type="submit"
//               className="dashboard-add-button"
//               disabled={loading}
//             >

//               {loading
//                 ? "Uploading & Publishing..."
//                 : "Publish Product"}

//             </button>

//           </div>

//         </form>

//       </div>

//     </main>
//   );
// }





"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

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

  const [categories, setCategories] = useState<Category[]>([]);

  const [name, setName] = useState("");
  const [shortDescription, setShortDescription] =
    useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [subcategory, setSubcategory] = useState("");

  const [customFields, setCustomFields] = useState<
    CustomField[]
  >([]);

  const [companyName, setCompanyName] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");

  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const [loading, setLoading] = useState(false);
  const [categoryLoading, setCategoryLoading] =
    useState(true);

  const [error, setError] = useState("");

  useEffect(() => {
    loadUser();
    loadCategories();

    return () => {
      imagePreviews.forEach((preview) => {
        URL.revokeObjectURL(preview);
      });
    };
  }, []);

  const loadUser = () => {
    const storedUser =
      localStorage.getItem("advixio_user");

    if (!storedUser) {
      return;
    }

    try {
      const user = JSON.parse(storedUser);

      setCompanyName(user.companyName || "");
      setCity(user.city || "");
      setState(user.state || "");
    } catch {
      console.error("Invalid user data");
    }
  };

  const loadCategories = async () => {
    try {
      setCategoryLoading(true);

      const response = await fetch(
        `${API_URL}/categories`,
        {
          cache: "no-store",
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message ||
            "Failed to load categories."
        );
      }

      setCategories(result.data || []);
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : "Failed to load categories."
      );
    } finally {
      setCategoryLoading(false);
    }
  };

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
        (_, fieldIndex) =>
          fieldIndex !== index
      )
    );
  };

  const updateCustomField = (
    index: number,
    key: keyof CustomField,
    value: string
  ) => {
    setCustomFields((previous) =>
      previous.map(
        (field, fieldIndex) =>
          fieldIndex === index
            ? {
                ...field,
                [key]: value,
              }
            : field
      )
    );
  };

  const handleImageChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = Array.from(
      event.target.files || []
    );

    if (files.length === 0) {
      return;
    }

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

    setImages(files);

    const previews = files.map((file) =>
      URL.createObjectURL(file)
    );

    setImagePreviews(previews);
  };

  const removeImage = (index: number) => {
    setImages((previous) =>
      previous.filter(
        (_, imageIndex) =>
          imageIndex !== index
      )
    );

    setImagePreviews((previous) => {
      const previewToRemove =
        previous[index];

      if (previewToRemove) {
        URL.revokeObjectURL(
          previewToRemove
        );
      }

      return previous.filter(
        (_, imageIndex) =>
          imageIndex !== index
      );
    });
  };

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

    if (images.length === 0) {
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

    try {
      setLoading(true);

      const token =
        localStorage.getItem(
          "advixio_token"
        );

      if (!token) {
        window.location.href =
          "/login";
        return;
      }

      const formData = new FormData();

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
        "customFields",
        JSON.stringify(
          customFields
            .filter(
              (field) =>
                field.name.trim() &&
                field.value.trim()
            )
            .map((field) => ({
              name: field.name.trim(),
              value: field.value.trim(),
            }))
        )
      );

      formData.append(
        "companyName",
        companyName.trim()
      );

      formData.append(
        "location",
        JSON.stringify({
          city: city.trim(),
          state: state.trim(),
          country: "India",
        })
      );

      formData.append(
        "specifications",
        JSON.stringify([])
      );

      images.forEach((file) => {
        formData.append(
          "images",
          file
        );
      });

      const response = await fetch(
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

      if (response.status === 401) {
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

      router.push(
        "/dashboard/products"
      );

      router.refresh();

    } catch (err) {
      console.error(
        "Create product error:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Failed to create product."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="dashboard-page">

      <div className="dashboard-container">

        <div className="dashboard-topbar">

          <div>

            <span className="dashboard-eyebrow">
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

          <div className="dashboard-top-actions">

            <Link
              href="/dashboard/products"
              className="dashboard-marketplace-button"
            >
              My Products
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

            <h2>
              Basic Information
            </h2>

            <div className="product-form-grid">

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
                  placeholder="Enter product name"
                  disabled={loading}
                  required
                />

              </div>

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
                  placeholder="Short product description"
                  disabled={loading}
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
                  placeholder="Describe your product"
                  rows={5}
                  disabled={loading}
                />

              </div>

            </div>

          </div>

          <div className="product-form-section">

            <h2>
              Category
            </h2>

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
                  placeholder="Enter subcategory"
                  disabled={loading}
                />

              </div>

            </div>

          </div>

          <div className="product-form-section">

            <div
              style={{
                display: "flex",
                justifyContent:
                  "space-between",
                alignItems: "center",
                marginBottom: "20px",
              }}
            >

              <div>

                <h2>
                  Product Details
                </h2>

              </div>

              <button
                type="button"
                className="dashboard-add-button"
                onClick={
                  addCustomField
                }
                disabled={loading}
              >
                + Add Field
              </button>

            </div>

            <div className="product-form-grid">

              {customFields.length === 0 && (
                <div className="product-form-field full">
                  <p>
                    No product details added yet.
                  </p>
                </div>
              )}

              {customFields.map(
                (field, index) => (
                  <div
                    key={index}
                    className="product-form-field full"
                  >

                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns:
                          "1fr 1fr auto",
                        gap: "12px",
                        alignItems:
                          "end",
                      }}
                    >

                      <div>

                        <label>
                          Column Name
                        </label>

                        <input
                          type="text"
                          placeholder="e.g. Warranty"
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
                          disabled={loading}
                        />

                      </div>

                      <div>

                        <label>
                          Value
                        </label>

                        <input
                          type="text"
                          placeholder="e.g. 2 Years"
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
                          disabled={loading}
                        />

                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          removeCustomField(
                            index
                          )
                        }
                        disabled={loading}
                        className="product-cancel-button"
                      >
                        Remove
                      </button>

                    </div>

                  </div>
                )
              )}

            </div>

          </div>

          <div className="product-form-section">

            <h2>
              Business Information
            </h2>

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
                  disabled={loading}
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
                  disabled={loading}
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
                  disabled={loading}
                />

              </div>

            </div>

          </div>

          <div className="product-form-section">

            <h2>
              Product Images
            </h2>

            <div className="product-form-field full">

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
                Each image must be less than
                5MB.
              </small>

            </div>

            {imagePreviews.length > 0 && (

              <div className="product-image-preview-grid">

                {imagePreviews.map(
                  (
                    preview,
                    index
                  ) => (

                    <div
                      key={preview}
                      className="product-image-preview"
                    >

                      <img
                        src={preview}
                        alt={
                          `Product preview ${
                            index + 1
                          }`
                        }
                      />

                      <div className="product-image-preview-info">

                        <span>
                          Image {index + 1}
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
  );
}