// // "use client";

// // import Link from "next/link";
// // import { useEffect, useState } from "react";

// // type User = {
// // id: string;
// // name: string;
// // email: string;
// // phone?: string;
// // companyName?: string;
// // city?: string;
// // state?: string;
// // };

// // export default function DashboardPage() {
// // const [user, setUser] = useState<User | null>(null);

// // useEffect(() => {
// // const storedUser = localStorage.getItem("advixio_user");


// // if (storedUser) {
// //   try {
// //     setUser(JSON.parse(storedUser));
// //   } catch (error) {
// //     console.error("Unable to read user data:", error);
// //   }
// // }


// // }, []);

// // const displayName = user?.name || "Supplier";

// // const companyName =
// // user?.companyName || "Your Company";

// // const location =
// // [user?.city, user?.state]
// // .filter(Boolean)
// // .join(", ") || "Location not added";

// // const firstLetter =
// // displayName.charAt(0).toUpperCase();

// // return ( <main className="dashboard-page">


// //   <div className="dashboard-container">

// //     {/* =========================================
// //         TOP HEADER
// //     ========================================= */}

// //     <div className="dashboard-topbar">

// //       <div>
// //         <span className="dashboard-eyebrow">
// //           ADVIXIO BUSINESS
// //         </span>

// //         <h1>
// //           Welcome back, {displayName}
// //         </h1>

// //         <p>
// //           Manage your business, products and
// //           marketplace activity from one place.
// //         </p>
// //       </div>

// //       <div className="dashboard-top-actions">

// //         <Link
// //           href="/products"
// //           className="dashboard-marketplace-button"
// //         >
// //           Browse Marketplace
// //         </Link>

// //         <Link
// //           href="/dashboard/products/add"
// //           className="dashboard-add-button"
// //         >
// //           + Add Product
// //         </Link>

// //       </div>

// //     </div>


// //     {/* =========================================
// //         DASHBOARD LAYOUT
// //     ========================================= */}

// //     <div className="dashboard-layout">

// //       {/* =======================================
// //           LEFT PROFILE SIDEBAR
// //       ======================================= */}

// //       <aside className="dashboard-sidebar">

// //         {/* PROFILE CARD */}

// //         <div className="dashboard-profile-card">

// //           <div className="dashboard-avatar">
// //             {firstLetter}
// //           </div>

// //           <h2>
// //             {displayName}
// //           </h2>

// //           <p className="dashboard-profile-company">
// //             {companyName}
// //           </p>

// //           <span className="dashboard-verified">
// //             ✓ Verified Account
// //           </span>

// //           <div className="dashboard-profile-divider" />

// //           <div className="dashboard-profile-info">

// //             <div>
// //               <span>Email</span>
// //               <strong>
// //                 {user?.email || "Not available"}
// //               </strong>
// //             </div>

// //             <div>
// //               <span>Phone</span>
// //               <strong>
// //                 {user?.phone || "Not added"}
// //               </strong>
// //             </div>

// //             <div>
// //               <span>Location</span>
// //               <strong>
// //                 {location}
// //               </strong>
// //             </div>

// //           </div>

// //           <Link
// //             href="/dashboard/profile"
// //             className="dashboard-edit-profile"
// //           >
// //             Edit Profile
// //           </Link>

// //         </div>


// //         {/* SIDEBAR MENU */}

// //         <nav className="dashboard-sidebar-menu">

// //           <Link
// //             href="/dashboard"
// //             className="dashboard-menu-active"
// //           >
// //             <span>▦</span>
// //             Overview
// //           </Link>

// //           <Link href="/dashboard/products">
// //             <span>📦</span>
// //             My Products
// //           </Link>

// //           <Link href="/dashboard/products/add">
// //             <span>＋</span>
// //             Add Product
// //           </Link>

// //           <Link href="/dashboard/requirements">
// //             <span>📋</span>
// //             My Requirements
// //           </Link>

// //           <Link href="/dashboard/profile">
// //             <span>👤</span>
// //             Business Profile
// //           </Link>

// //           <Link href="/products">
// //             <span>🛒</span>
// //             Marketplace
// //           </Link>

// //         </nav>

// //       </aside>


// //       {/* =======================================
// //           MAIN DASHBOARD
// //       ======================================= */}

// //       <section className="dashboard-content">

// //         {/* =====================================
// //             STATISTICS
// //         ===================================== */}

// //         <div className="dashboard-stats">

// //           <div className="dashboard-stat-card">

// //             <div className="dashboard-stat-icon">
// //               📦
// //             </div>

// //             <div>
// //               <span>
// //                 My Products
// //               </span>

// //               <strong>
// //                 0
// //               </strong>

// //               <small>
// //                 Products listed
// //               </small>
// //             </div>

// //           </div>


// //           <div className="dashboard-stat-card">

// //             <div className="dashboard-stat-icon">
// //               📋
// //             </div>

// //             <div>
// //               <span>
// //                 Requirements
// //               </span>

// //               <strong>
// //                 0
// //               </strong>

// //               <small>
// //                 Active requirements
// //               </small>
// //             </div>

// //           </div>


// //           <div className="dashboard-stat-card">

// //             <div className="dashboard-stat-icon">
// //               💬
// //             </div>

// //             <div>
// //               <span>
// //                 Enquiries
// //               </span>

// //               <strong>
// //                 0
// //               </strong>

// //               <small>
// //                 Customer enquiries
// //               </small>

// //             </div>

// //           </div>


// //           <div className="dashboard-stat-card">

// //             <div className="dashboard-stat-icon">
// //               👁
// //             </div>

// //             <div>
// //               <span>
// //                 Product Views
// //               </span>

// //               <strong>
// //                 0
// //               </strong>

// //               <small>
// //                 Total product views
// //               </small>
// //             </div>

// //           </div>

// //         </div>


// //         {/* =====================================
// //             BUSINESS PROFILE BANNER
// //         ===================================== */}

// //         <div className="dashboard-business-banner">

// //           <div className="dashboard-business-content">

// //             <span>
// //               BUSINESS PROFILE
// //             </span>

// //             <h2>
// //               Complete your business profile
// //             </h2>

// //             <p>
// //               Add your company information,
// //               location and contact details to
// //               build trust with buyers.
// //             </p>

// //             <Link href="/dashboard/profile">
// //               Complete Profile →
// //             </Link>

// //           </div>

// //           <div className="dashboard-business-progress">

// //             <strong>
// //               70%
// //             </strong>

// //             <span>
// //               Profile Complete
// //             </span>

// //             <div className="dashboard-progress-bar">
// //               <div />
// //             </div>

// //           </div>

// //         </div>


// //         {/* =====================================
// //             QUICK ACTIONS
// //         ===================================== */}

// //         <div className="dashboard-section-header">

// //           <div>
// //             <span>
// //               QUICK ACTIONS
// //             </span>

// //             <h2>
// //               Manage your business
// //             </h2>
// //           </div>

// //         </div>


// //         <div className="dashboard-action-grid">

// //           <Link
// //             href="/dashboard/products/add"
// //             className="dashboard-action-card dashboard-action-primary"
// //           >
// //             <div className="dashboard-action-icon">
// //               ＋
// //             </div>

// //             <div>
// //               <h3>
// //                 Add New Product
// //               </h3>

// //               <p>
// //                 List your products and reach
// //                 new buyers.
// //               </p>
// //             </div>

// //             <span>
// //               →
// //             </span>
// //           </Link>


// //           <Link
// //             href="/dashboard/products"
// //             className="dashboard-action-card"
// //           >
// //             <div className="dashboard-action-icon">
// //               📦
// //             </div>

// //             <div>
// //               <h3>
// //                 Manage Products
// //               </h3>

// //               <p>
// //                 Edit, update or remove your
// //                 product listings.
// //               </p>
// //             </div>

// //             <span>
// //               →
// //             </span>
// //           </Link>


// //           <Link
// //             href="/dashboard/requirements"
// //             className="dashboard-action-card"
// //           >
// //             <div className="dashboard-action-icon">
// //               📋
// //             </div>

// //             <div>
// //               <h3>
// //                 Post Requirement
// //               </h3>

// //               <p>
// //                 Tell suppliers what products
// //                 you are looking for.
// //               </p>
// //             </div>

// //             <span>
// //               →
// //             </span>
// //           </Link>

// //         </div>


// //         {/* =====================================
// //             RECENT ACTIVITY
// //         ===================================== */}

// //         <div className="dashboard-lower-grid">

// //           <div className="dashboard-panel">

// //             <div className="dashboard-panel-header">

// //               <div>
// //                 <span>
// //                   ACTIVITY
// //                 </span>

// //                 <h2>
// //                   Recent Activity
// //                 </h2>
// //               </div>

// //             </div>


// //             <div className="dashboard-empty-state">

// //               <div>
// //                 📊
// //               </div>

// //               <h3>
// //                 No activity yet
// //               </h3>

// //               <p>
// //                 Your product listings,
// //                 enquiries and requirements
// //                 will appear here.
// //               </p>

// //               <Link href="/dashboard/products/add">
// //                 Add Your First Product
// //               </Link>

// //             </div>

// //           </div>


// //           {/* =================================
// //               BUSINESS INFORMATION
// //           ================================= */}

// //           <div className="dashboard-panel">

// //             <div className="dashboard-panel-header">

// //               <div>
// //                 <span>
// //                   BUSINESS
// //                 </span>

// //                 <h2>
// //                   Business Information
// //                 </h2>
// //               </div>

// //               <Link href="/dashboard/profile">
// //                 Edit
// //               </Link>

// //             </div>


// //             <div className="dashboard-business-info">

// //               <div>
// //                 <span>
// //                   Business Name
// //                 </span>

// //                 <strong>
// //                   {companyName}
// //                 </strong>
// //               </div>

// //               <div>
// //                 <span>
// //                   Contact Person
// //                 </span>

// //                 <strong>
// //                   {displayName}
// //                 </strong>
// //               </div>

// //               <div>
// //                 <span>
// //                   Email
// //                 </span>

// //                 <strong>
// //                   {user?.email || "Not added"}
// //                 </strong>
// //               </div>

// //               <div>
// //                 <span>
// //                   Location
// //                 </span>

// //                 <strong>
// //                   {location}
// //                 </strong>
// //               </div>

// //             </div>

// //           </div>

// //         </div>


// //         {/* =====================================
// //             MARKETPLACE CTA
// //         ===================================== */}

// //         <div className="dashboard-marketplace-banner">

// //           <div>

// //             <span>
// //               ADVIXIO MARKETPLACE
// //             </span>

// //             <h2>
// //               Find products and connect with suppliers
// //             </h2>

// //             <p>
// //               Explore industrial products,
// //               manufacturers and verified suppliers.
// //             </p>

// //           </div>

// //           <Link href="/products">
// //             Explore Marketplace →
// //           </Link>

// //         </div>

// //       </section>

// //     </div>

// //   </div>

// // </main>


// // );
// // }





// "use client";

// import { useEffect, useMemo, useState } from "react";
// import Link from "next/link";

// const API_URL =
//   process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

// type User = {
//   id: string;
//   name: string;
//   email: string;
//   phone?: string;
//   companyName?: string;
//   city?: string;
//   state?: string;
// };

// type Product = {
//   _id: string;
//   name: string;
//   slug: string;
//   shortDescription?: string;
//   description?: string;
//   price?: number;
//   unit?: string;
//   status?: string;
//   images?: string[];
//   companyName?: string;
//   location?: {
//     city?: string;
//     state?: string;
//     country?: string;
//   };
//   category?: {
//     _id?: string;
//     name?: string;
//     slug?: string;
//   };
//   createdAt?: string;
// };

// type ProductsResponse = {
//   success: boolean;
//   count: number;
//   data: Product[];
//   message?: string;
// };

// export default function DashboardPage() {
//   const [user, setUser] = useState<User | null>(null);
//   const [products, setProducts] = useState<Product[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     const loadDashboard = async () => {
//       try {
//         setLoading(true);
//         setError("");

//         const storedUser = localStorage.getItem("advixio_user");
//         const token = localStorage.getItem("advixio_token");

//         if (!token) {
//           window.location.href = "/login";
//           return;
//         }

//         if (storedUser) {
//           try {
//             setUser(JSON.parse(storedUser));
//           } catch {
//             console.error("Invalid stored user data");
//           }
//         }

//         const response = await fetch(
//           `${API_URL}/products/my-listings`,
//           {
//             method: "GET",
//             headers: {
//               Authorization: `Bearer ${token}`,
//               "Content-Type": "application/json",
//             },
//             cache: "no-store",
//           }
//         );

//         if (response.status === 401) {
//           localStorage.removeItem("advixio_token");
//           localStorage.removeItem("advixio_user");
//           window.location.href = "/login";
//           return;
//         }

//         const result =
//           (await response.json()) as ProductsResponse;

//         if (!response.ok || !result.success) {
//           throw new Error(
//             result.message ||
//               "Unable to load dashboard data."
//           );
//         }

//         setProducts(result.data || []);
//       } catch (err) {
//         console.error("Dashboard error:", err);

//         setError(
//           err instanceof Error
//             ? err.message
//             : "Unable to load dashboard."
//         );
//       } finally {
//         setLoading(false);
//       }
//     };

//     loadDashboard();
//   }, []);

//   const activeProducts = useMemo(
//     () =>
//       products.filter(
//         (product) =>
//           !product.status ||
//           product.status === "active"
//       ).length,
//     [products]
//   );

//   const draftProducts = useMemo(
//     () =>
//       products.filter(
//         (product) => product.status === "draft"
//       ).length,
//     [products]
//   );

//   const recentProducts = useMemo(
//     () => products.slice(0, 5),
//     [products]
//   );

//   const initials = useMemo(() => {
//     if (!user?.name) return "A";

//     return user.name
//       .split(" ")
//       .filter(Boolean)
//       .slice(0, 2)
//       .map((name) => name[0])
//       .join("")
//       .toUpperCase();
//   }, [user]);

//   const formatDate = (date?: string) => {
//     if (!date) return "Recently";

//     return new Date(date).toLocaleDateString(
//       "en-IN",
//       {
//         day: "2-digit",
//         month: "short",
//         year: "numeric",
//       }
//     );
//   };

//   const handleLogout = () => {
//     localStorage.removeItem("advixio_token");
//     localStorage.removeItem("advixio_user");

//     window.location.href = "/";
//   };

//   if (loading) {
//     return (
//       <main className="dashboard-page">
//         <div className="dashboard-loading">
//           <div className="dashboard-spinner" />

//           <h2>Loading Dashboard...</h2>

//           <p>
//             Fetching your business information and
//             product listings.
//           </p>
//         </div>
//       </main>
//     );
//   }

//   return (
//     <main className="dashboard-page">
//       <div className="dashboard-container">

//         {/* TOP BAR */}
//         <div className="dashboard-topbar">

//           <div>
//             <span className="dashboard-eyebrow">
//               ADVIXIO BUSINESS
//             </span>

//             <h1>
//               Welcome back,
//               {" "}
//               {user?.name || "User"} 👋
//             </h1>

//             <p>
//               Manage your business, products and
//               marketplace activity.
//             </p>
//           </div>

//           <div className="dashboard-top-actions">

//             <Link
//               href="/products"
//               className="dashboard-marketplace-button"
//             >
//               Browse Marketplace
//             </Link>

//             <Link
//               href="/dashboard/products/add"
//               className="dashboard-add-button"
//             >
//               + Add Product
//             </Link>

//           </div>
//         </div>

//         {/* ERROR */}
//         {error && (
//           <div className="dashboard-error">
//             <strong>Unable to load some data.</strong>
//             <span>{error}</span>
//           </div>
//         )}

//         <div className="dashboard-layout">

//           {/* SIDEBAR */}
//           <aside className="dashboard-sidebar">

//             {/* PROFILE */}
//             <div className="dashboard-profile-card">

//               <div className="dashboard-avatar">
//                 {initials}
//               </div>

//               <h2>
//                 {user?.name || "User"}
//               </h2>

//               <p className="dashboard-profile-company">
//                 {user?.companyName ||
//                   "Business Account"}
//               </p>

//               <span className="dashboard-verified">
//                 ✓ Account Active
//               </span>

//               <div className="dashboard-profile-divider" />

//               <div className="dashboard-profile-info">

//                 <div>
//                   <span>Email</span>
//                   <strong>
//                     {user?.email || "-"}
//                   </strong>
//                 </div>

//                 <div>
//                   <span>Phone</span>
//                   <strong>
//                     {user?.phone || "Not added"}
//                   </strong>
//                 </div>

//                 <div>
//                   <span>Location</span>
//                   <strong>
//                     {user?.city || "City not added"}
//                     {user?.state
//                       ? `, ${user.state}`
//                       : ""}
//                   </strong>
//                 </div>

//                 <div>
//                   <span>Company</span>
//                   <strong>
//                     {user?.companyName ||
//                       "Not added"}
//                   </strong>
//                 </div>

//               </div>

//               <Link
//                 href="/dashboard/profile"
//                 className="dashboard-edit-profile"
//               >
//                 Edit Profile
//               </Link>

//             </div>

//             {/* MENU */}
//             <nav className="dashboard-sidebar-menu">

//               <Link
//                 href="/dashboard"
//                 className="dashboard-menu-active"
//               >
//                 <span>▦</span>
//                 Dashboard
//               </Link>

//               <Link href="/dashboard/products">
//                 <span>📦</span>
//                 My Products
//               </Link>

//               <Link href="/dashboard/products/add">
//                 <span>＋</span>
//                 Add Product
//               </Link>

//               <Link href="/products">
//                 <span>🛒</span>
//                 Marketplace
//               </Link>

//               <Link href="/dashboard/profile">
//                 <span>👤</span>
//                 My Profile
//               </Link>

//               <button
//                 type="button"
//                 className="dashboard-logout"
//                 onClick={handleLogout}
//               >
//                 <span>↪</span>
//                 Logout
//               </button>

//             </nav>

//           </aside>

//           {/* CONTENT */}
//           <section className="dashboard-content">

//             {/* STATS */}
//             <div className="dashboard-stats">

//               <div className="dashboard-stat-card">
//                 <div className="dashboard-stat-icon">
//                   📦
//                 </div>

//                 <div>
//                   <span>Total Products</span>
//                   <strong>{products.length}</strong>
//                   <small>Your listings</small>
//                 </div>
//               </div>

//               <div className="dashboard-stat-card">
//                 <div className="dashboard-stat-icon">
//                   ✓
//                 </div>

//                 <div>
//                   <span>Active Products</span>
//                   <strong>
//                     {activeProducts}
//                   </strong>
//                   <small>Currently visible</small>
//                 </div>
//               </div>

//               <div className="dashboard-stat-card">
//                 <div className="dashboard-stat-icon">
//                   📝
//                 </div>

//                 <div>
//                   <span>Draft Products</span>
//                   <strong>
//                     {draftProducts}
//                   </strong>
//                   <small>Not published</small>
//                 </div>
//               </div>

//               <div className="dashboard-stat-card">
//                 <div className="dashboard-stat-icon">
//                   🏢
//                 </div>

//                 <div>
//                   <span>Business</span>
//                   <strong>
//                     {user?.companyName ? "✓" : "—"}
//                   </strong>
//                   <small>
//                     {user?.companyName
//                       ? "Profile complete"
//                       : "Add company"}
//                   </small>
//                 </div>
//               </div>

//             </div>

//             {/* BUSINESS PROFILE */}
//             <div className="dashboard-business-banner">

//               <div className="dashboard-business-content">

//                 <span>
//                   BUSINESS PROFILE
//                 </span>

//                 <h2>
//                   {user?.companyName ||
//                     "Complete your business profile"}
//                 </h2>

//                 <p>
//                   Add complete business information
//                   to build trust with buyers.
//                 </p>

//                 <Link href="/dashboard/profile">
//                   Manage Business Profile →
//                 </Link>

//               </div>

//               <div className="dashboard-business-progress">

//                 <strong>
//                   {user?.companyName &&
//                   user?.phone &&
//                   user?.city &&
//                   user?.state
//                     ? "100%"
//                     : "70%"}
//                 </strong>

//                 <span>
//                   Profile completion
//                 </span>

//                 <div className="dashboard-progress-bar">
//                   <div
//                     style={{
//                       width:
//                         user?.companyName &&
//                         user?.phone &&
//                         user?.city &&
//                         user?.state
//                           ? "100%"
//                           : "70%",
//                     }}
//                   />
//                 </div>

//               </div>

//             </div>

//             {/* QUICK ACTIONS */}
//             <div className="dashboard-section-header">

//               <span>
//                 QUICK ACTIONS
//               </span>

//               <h2>
//                 Manage Your Business
//               </h2>

//             </div>

//             <div className="dashboard-action-grid">

//               <Link
//                 href="/dashboard/products/add"
//                 className="dashboard-action-card dashboard-action-primary"
//               >
//                 <div className="dashboard-action-icon">
//                   ＋
//                 </div>

//                 <div>
//                   <h3>
//                     Add New Product
//                   </h3>

//                   <p>
//                     List a new product and make
//                     it available to buyers.
//                   </p>
//                 </div>

//                 <span>→</span>
//               </Link>

//               <Link
//                 href="/dashboard/products"
//                 className="dashboard-action-card"
//               >
//                 <div className="dashboard-action-icon">
//                   📦
//                 </div>

//                 <div>
//                   <h3>
//                     Manage Products
//                   </h3>

//                   <p>
//                     Edit, update or remove your
//                     existing listings.
//                   </p>
//                 </div>

//                 <span>→</span>
//               </Link>

//               <Link
//                 href="/dashboard/profile"
//                 className="dashboard-action-card"
//               >
//                 <div className="dashboard-action-icon">
//                   👤
//                 </div>

//                 <div>
//                   <h3>
//                     Business Profile
//                   </h3>

//                   <p>
//                     Keep your company information
//                     updated.
//                   </p>
//                 </div>

//                 <span>→</span>
//               </Link>

//             </div>

//             {/* LOWER GRID */}
//             <div className="dashboard-lower-grid">

//               {/* RECENT PRODUCTS */}
//               <div className="dashboard-panel">

//                 <div className="dashboard-panel-header">

//                   <div>
//                     <span>
//                       YOUR LISTINGS
//                     </span>

//                     <h2>
//                       Recent Products
//                     </h2>
//                   </div>

//                   <Link href="/dashboard/products">
//                     View All
//                   </Link>

//                 </div>

//                 {recentProducts.length === 0 ? (

//                   <div className="dashboard-empty-state">

//                     <div>📦</div>

//                     <h3>
//                       No products yet
//                     </h3>

//                     <p>
//                       You haven't listed any products.
//                       Add your first product to start
//                       selling on Advixio.
//                     </p>

//                     <Link
//                       href="/dashboard/products/add"
//                     >
//                       Add Your First Product →
//                     </Link>

//                   </div>

//                 ) : (

//                   <div className="dashboard-products-list">

//                     {recentProducts.map(
//                       (product) => (

//                         <Link
//                           href={`/products/${product.slug}`}
//                           key={product._id}
//                           className="dashboard-product-row"
//                         >

//                           <div className="dashboard-product-image">

//                             {product.images &&
//                             product.images.length > 0 ? (
//                               <img
//                                 src={
//                                   product.images[0]
//                                 }
//                                 alt={product.name}
//                               />
//                             ) : (
//                               <span>
//                                 📦
//                               </span>
//                             )}

//                           </div>

//                           <div className="dashboard-product-details">

//                             <h3>
//                               {product.name}
//                             </h3>

//                             <p>
//                               {product.category
//                                 ?.name ||
//                                 "Product"}
//                             </p>

//                             <small>
//                               Listed{" "}
//                               {formatDate(
//                                 product.createdAt
//                               )}
//                             </small>

//                           </div>

//                           <span className="dashboard-product-arrow">
//                             →
//                           </span>

//                         </Link>

//                       )
//                     )}

//                   </div>

//                 )}

//               </div>

//               {/* BUSINESS INFO */}
//               <div className="dashboard-panel">

//                 <div className="dashboard-panel-header">

//                   <div>
//                     <span>
//                       BUSINESS DETAILS
//                     </span>

//                     <h2>
//                       Your Information
//                     </h2>
//                   </div>

//                   <Link href="/dashboard/profile">
//                     Edit
//                   </Link>

//                 </div>

//                 <div className="dashboard-business-info">

//                   <div>
//                     <span>Full Name</span>
//                     <strong>
//                       {user?.name || "-"}
//                     </strong>
//                   </div>

//                   <div>
//                     <span>Email Address</span>
//                     <strong>
//                       {user?.email || "-"}
//                     </strong>
//                   </div>

//                   <div>
//                     <span>Phone Number</span>
//                     <strong>
//                       {user?.phone || "Not added"}
//                     </strong>
//                   </div>

//                   <div>
//                     <span>Company</span>
//                     <strong>
//                       {user?.companyName ||
//                         "Not added"}
//                     </strong>
//                   </div>

//                   <div>
//                     <span>Location</span>
//                     <strong>
//                       {user?.city || "-"}
//                       {user?.state
//                         ? `, ${user.state}`
//                         : ""}
//                     </strong>
//                   </div>

//                 </div>

//               </div>

//             </div>

//             {/* MARKETPLACE BANNER */}
//             <div className="dashboard-marketplace-banner">

//               <div>

//                 <span>
//                   ADVIXIO MARKETPLACE
//                 </span>

//                 <h2>
//                   Find products and connect
//                   with suppliers.
//                 </h2>

//                 <p>
//                   Explore thousands of products
//                   and discover new business
//                   opportunities.
//                 </p>

//               </div>

//               <Link href="/products">
//                 Explore Marketplace →
//               </Link>

//             </div>

//           </section>
//         </div>
//       </div>
//     </main>
//   );
// }




"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

type User = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  companyName?: string;
  city?: string;
  state?: string;
};

type Product = {
  _id: string;
  name: string;
  slug: string;
  shortDescription?: string;
  price?: number;
  unit?: string;
  status?: string;
  createdAt?: string;
  category?: {
    _id?: string;
    name?: string;
    slug?: string;
  };
};

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const storedUser = localStorage.getItem("advixio_user");

    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem("advixio_user");
      }
    }

    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("advixio_token");

      if (!token) {
        window.location.href = "/login";
        return;
      }

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
        localStorage.removeItem("advixio_token");
        localStorage.removeItem("advixio_user");
        window.location.href = "/login";
        return;
      }

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Failed to load products."
        );
      }

      setProducts(result.data || []);
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : "Failed to load dashboard."
      );
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("advixio_token");
    localStorage.removeItem("advixio_user");
    window.location.href = "/";
  };

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((word) => word[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "A";

  return (
    <main className="dashboard-page">
      <div className="dashboard-container">

        <div className="dashboard-topbar">
          <div>
            <span className="dashboard-eyebrow">
              ADVIXIO SUPPLIER
            </span>

            <h1>
              Welcome back, {user?.name || "Supplier"} 👋
            </h1>

            <p>
              Manage your products and business activity.
            </p>
          </div>

          <div className="dashboard-top-actions">
            <Link
              href="/products"
              className="dashboard-marketplace-button"
            >
              Browse Marketplace
            </Link>

            <Link
              href="/dashboard/products/add"
              className="dashboard-add-button"
            >
              + Add Product
            </Link>
          </div>
        </div>

        <div className="dashboard-layout">

          <aside className="dashboard-sidebar">

            <div className="dashboard-profile-card">

              <div className="dashboard-avatar">
                {initials}
              </div>

              <h2>
                {user?.name || "User"}
              </h2>

              <p className="dashboard-profile-company">
                {user?.companyName || "Business Account"}
              </p>

              <span className="dashboard-verified">
                ✓ Active Account
              </span>

              <div className="dashboard-profile-divider" />

              <div className="dashboard-profile-info">

                <div>
                  <span>Email</span>
                  <strong>{user?.email || "-"}</strong>
                </div>

                <div>
                  <span>Phone</span>
                  <strong>{user?.phone || "-"}</strong>
                </div>

                <div>
                  <span>Location</span>
                  <strong>
                    {user?.city || "-"}
                    {user?.state
                      ? `, ${user.state}`
                      : ""}
                  </strong>
                </div>

              </div>

              <Link
                href="/dashboard/profile"
                className="dashboard-edit-profile"
              >
                View Profile
              </Link>

            </div>

            <div className="dashboard-sidebar-menu">

              <Link
                href="/dashboard"
                className="dashboard-menu-active"
              >
                📊 Dashboard
              </Link>

              <Link href="/dashboard/products">
                📦 My Products
              </Link>

              <Link href="/dashboard/products/add">
                ➕ Add Product
              </Link>

              <Link href="/dashboard/requirements">
                📋 My Requirements
              </Link>

              <Link href="/dashboard/profile">
                👤 My Profile
              </Link>

              <Link href="/dashboard/settings">
                ⚙️ Settings
              </Link>

              <button
                type="button"
                onClick={logout}
                className="dashboard-logout"
              >
                ↪ Logout
              </button>

            </div>

          </aside>

          <section className="dashboard-content">

            <div className="dashboard-stats">

              <div className="dashboard-stat-card">
                <div className="dashboard-stat-icon">
                  📦
                </div>

                <div>
                  <span>Total Products</span>
                  <strong>
                    {loading ? "..." : products.length}
                  </strong>
                  <small>Your listed products</small>
                </div>
              </div>

              <div className="dashboard-stat-card">
                <div className="dashboard-stat-icon">
                  ✓
                </div>

                <div>
                  <span>Active Products</span>
                  <strong>
                    {loading
                      ? "..."
                      : products.filter(
                          (product) =>
                            product.status === "active"
                        ).length}
                  </strong>
                  <small>Currently visible</small>
                </div>
              </div>

              <div className="dashboard-stat-card">
                <div className="dashboard-stat-icon">
                  🏷️
                </div>

                <div>
                  <span>Categories</span>
                  <strong>
                    {loading
                      ? "..."
                      : new Set(
                          products
                            .map(
                              (product) =>
                                product.category?.slug
                            )
                            .filter(Boolean)
                        ).size}
                  </strong>
                  <small>Used in your products</small>
                </div>
              </div>

              <div className="dashboard-stat-card">
                <div className="dashboard-stat-icon">
                  🏢
                </div>

                <div>
                  <span>Business</span>
                  <strong>
                    {user?.companyName ? "✓" : "—"}
                  </strong>
                  <small>Company profile</small>
                </div>
              </div>

            </div>

            <div className="dashboard-section-header">
              <span>QUICK ACTIONS</span>
              <h2>Manage Your Business</h2>
            </div>

            <div className="dashboard-action-grid">

              <Link
                href="/dashboard/products/add"
                className="dashboard-action-card dashboard-action-primary"
              >
                <div className="dashboard-action-icon">
                  +
                </div>

                <div>
                  <h3>Add New Product</h3>
                  <p>
                    List a new product on the Advixio
                    marketplace.
                  </p>
                </div>

                <span>→</span>
              </Link>

              <Link
                href="/dashboard/products"
                className="dashboard-action-card"
              >
                <div className="dashboard-action-icon">
                  📦
                </div>

                <div>
                  <h3>My Products</h3>
                  <p>
                    View, edit and delete your listed
                    products.
                  </p>
                </div>

                <span>→</span>
              </Link>

              <Link
                href="/dashboard/profile"
                className="dashboard-action-card"
              >
                <div className="dashboard-action-icon">
                  👤
                </div>

                <div>
                  <h3>Business Profile</h3>
                  <p>
                    Manage your company and contact
                    information.
                  </p>
                </div>

                <span>→</span>
              </Link>

            </div>

            <div className="dashboard-panel dashboard-recent-panel">

              <div className="dashboard-panel-header">
                <div>
                  <span>PRODUCTS</span>
                  <h2>Recent Products</h2>
                </div>

                <Link href="/dashboard/products">
                  View All
                </Link>
              </div>

              {error && (
                <div className="dashboard-error">
                  {error}
                </div>
              )}

              {loading ? (
                <div className="dashboard-loading">
                  Loading your products...
                </div>
              ) : products.length === 0 ? (
                <div className="dashboard-empty-state">
                  <div>📦</div>

                  <h3>
                    No products listed yet
                  </h3>

                  <p>
                    Start selling by adding your first
                    product to the Advixio marketplace.
                  </p>

                  <Link href="/dashboard/products/add">
                    Add Your First Product →
                  </Link>
                </div>
              ) : (
                <div className="dashboard-product-list">

                  {products
                    .slice(0, 5)
                    .map((product) => (
                      <div
                        key={product._id}
                        className="dashboard-product-row"
                      >

                        <div className="dashboard-product-icon">
                          📦
                        </div>

                        <div className="dashboard-product-info">
                          <strong>
                            {product.name}
                          </strong>

                          <span>
                            {product.category?.name ||
                              "Uncategorized"}
                          </span>
                        </div>

                        <div className="dashboard-product-price">
                          {product.price
                            ? `₹${Number(
                                product.price
                              ).toLocaleString("en-IN")}`
                            : "Price on request"}
                        </div>

                        <Link
                          href={`/dashboard/products/${product._id}/edit`}
                        >
                          Edit
                        </Link>

                      </div>
                    ))}

                </div>
              )}

            </div>

          </section>
        </div>
      </div>
    </main>
  );
}