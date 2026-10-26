

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function Navbar() {
const [menuOpen, setMenuOpen] = useState(false);
const [isLoggedIn, setIsLoggedIn] = useState(false);
const [mounted, setMounted] = useState(false);

/* ==============================
CHECK LOGIN
============================== */

const checkLogin = () => {
const token = localStorage.getItem("advixio_token");


setIsLoggedIn(Boolean(token));


};

useEffect(() => {
setMounted(true);
checkLogin();


/*
  Login/Register ke baad agar localStorage change ho
  to navbar update karne ke liye custom event.
*/

const handleAuthChange = () => {
  checkLogin();
};

window.addEventListener(
  "advixio-auth-change",
  handleAuthChange
);

return () => {
  window.removeEventListener(
    "advixio-auth-change",
    handleAuthChange
  );
};


}, []);

/* ==============================
CLOSE MOBILE MENU
============================== */

const closeMenu = () => {
setMenuOpen(false);
};

/* ==============================
LOGOUT
============================== */

const handleLogout = () => {
localStorage.removeItem("advixio_token");
localStorage.removeItem("advixio_user");


setIsLoggedIn(false);
setMenuOpen(false);

window.location.href = "/";


};

return ( <header className="navbar"> <div className="navbar-container">


    {/* ==============================
        LOGO
    ============================== */}

    <Link
      href="/"
      className="navbar-logo"
      onClick={closeMenu}
    >
      
<img
  src="/footerLogo.png"
  alt="Advixio360 Logo"
  className="footer-logo-icon"
  width={42}
  height={42}
  style={{
    display: "block",
    width: "42px",
    height: "42px",
    marginRight: "5px",
    objectFit: "contain",
    borderRadius: "8px",
  }}
/>


      <span>
        Advixio
      </span>
    </Link>


    {/* ==============================
        DESKTOP NAVIGATION
    ============================== */}

    <nav className="desktop-nav">

      <Link href="/categories">
        Categories
      </Link>

      <Link href="/products">
        Products
      </Link>

      <Link href="/services">
        Services
      </Link>

      <Link href="/suppliers">
        Suppliers
      </Link>

    </nav>


    {/* ==============================
        DESKTOP ACTIONS
    ============================== */}

    <div className="navbar-actions">

      {mounted && isLoggedIn ? (
        <>
          <Link
            href="/dashboard"
            className="dashboard-button"
          >
            Dashboard
          </Link>

          <Link
            href="/requirements"
            className="post-button"
          >
            Post Buy Requirement
          </Link>

          <button
            type="button"
            className="logout-button"
            onClick={handleLogout}
          >
            Logout
          </button>
        </>
      ) : (
        <>
          <Link
            href="/login"
            className="login-button"
          >
            Login
          </Link>

          <Link
            href="/requirements"
            className="post-button"
          >
            Post Buy Requirement
          </Link>
        </>
      )}

    </div>


    {/* ==============================
        MOBILE MENU BUTTON
    ============================== */}

    <button
      type="button"
      className="mobile-menu-button"
      onClick={() => setMenuOpen(!menuOpen)}
      aria-label="Toggle menu"
      aria-expanded={menuOpen}
    >
      {menuOpen ? "✕" : "☰"}
    </button>

  </div>


  {/* ==============================
      MOBILE NAVIGATION
  ============================== */}

  {menuOpen && (
    <div className="mobile-menu">

      <Link
        href="/categories"
        onClick={closeMenu}
      >
        Categories
      </Link>

      <Link
        href="/products"
        onClick={closeMenu}
      >
        Products
      </Link>

      <Link
        href="/services"
        onClick={closeMenu}
      >
        Services
      </Link>

      <Link
        href="/suppliers"
        onClick={closeMenu}
      >
        Suppliers
      </Link>


      {/* ==============================
          MOBILE ACTIONS
      ============================== */}

      <div className="mobile-actions">

        {mounted && isLoggedIn ? (
          <>
            <Link
              href="/dashboard"
              className="mobile-dashboard-button"
              onClick={closeMenu}
            >
              Dashboard
            </Link>

            <Link
              href="/requirements"
              className="post-button mobile-post-button"
              onClick={closeMenu}
            >
              Post Buy Requirement
            </Link>

            <button
              type="button"
              className="mobile-logout-button"
              onClick={handleLogout}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link
              href="/login"
              className="mobile-login-button"
              onClick={closeMenu}
            >
              Login
            </Link>

            <Link
              href="/requirements"
              className="post-button mobile-post-button"
              onClick={closeMenu}
            >
              Post Buy Requirement
            </Link>
          </>
        )}

      </div>

    </div>
  )}
</header>


);
}




// "use client";

// import { useState, useEffect } from "react";
// import Link from "next/link";
// import { useRouter, usePathname } from "next/navigation";
// import {
//   Menu,
//   X,
//   User,
//   Home,
//   Phone,
//   Info,
//   ArrowRight,
// } from "lucide-react";

// export default function Navbar() {
//   const router = useRouter();
//   const pathname = usePathname();

//   const [menuOpen, setMenuOpen] = useState(false);
//   const [token, setToken] = useState(null);
//   const [mounted, setMounted] = useState(false);

//   // Read login state safely after mounting in the browser.
//   const checkLogin = () => {
//     const savedToken =
//       localStorage.getItem("token") ||
//       localStorage.getItem("advixio_token");

//     setToken(savedToken);
//   };

//   useEffect(() => {
//     checkLogin();
//     setMounted(true);

//     const handleAuthChange = () => {
//       checkLogin();
//     };

//     window.addEventListener(
//       "advixio-auth-change",
//       handleAuthChange
//     );

//     window.addEventListener("storage", handleAuthChange);

//     return () => {
//       window.removeEventListener(
//         "advixio-auth-change",
//         handleAuthChange
//       );

//       window.removeEventListener(
//         "storage",
//         handleAuthChange
//       );
//     };
//   }, []);

//   // Close mobile menu when the route changes.
//   useEffect(() => {
//     setMenuOpen(false);
//   }, [pathname]);

//   // Prevent background scrolling while mobile menu is open.
//   useEffect(() => {
//     document.body.style.overflow = menuOpen ? "hidden" : "";

//     return () => {
//       document.body.style.overflow = "";
//     };
//   }, [menuOpen]);

//   const closeMenu = () => {
//     setMenuOpen(false);
//   };

//   const isActive = (path) => pathname === path;

//   // Open the correct profile page.
//   const profileClick = () => {
//     const savedToken =
//       localStorage.getItem("token") ||
//       localStorage.getItem("advixio_token");

//     const role = localStorage.getItem("role");

//     closeMenu();

//     if (!savedToken) {
//       router.push("/login");
//       return;
//     }

//     router.push(
//       role === "admin" ? "/admin/profile" : "/profile"
//     );
//   };

//   // Logout.
//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     localStorage.removeItem("advixio_token");
//     localStorage.removeItem("advixio_user");

//     setToken(null);
//     closeMenu();

//     window.dispatchEvent(
//       new Event("advixio-auth-change")
//     );

//     router.push("/");
//   };

//   const navItems = [
//     {
//       href: "/",
//       label: "Home",
//       Icon: Home,
//     },
//     {
//       href: "/about",
//       label: "About",
//       Icon: Info,
//     },
//     {
//       href: "/contact",
//       label: "Contact",
//       Icon: Phone,
//     },
//   ];

//   const desktopLinkClass = (path) =>
//     `group flex items-center gap-2 px-4 py-2 rounded-xl font-semibold transition-all duration-300 ${
//       isActive(path)
//         ? "bg-orange-50 text-[#FF7300]"
//         : "text-gray-700 hover:bg-orange-50 hover:text-[#FF7300]"
//     }`;

//   const desktopIconClass = (path) =>
//     `w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-300 ${
//       isActive(path)
//         ? "bg-[#FF7300] text-white shadow-md shadow-orange-500/20"
//         : "bg-[#002341]/10 text-[#002341] group-hover:bg-[#FF7300] group-hover:text-white group-hover:scale-110 group-hover:rotate-3"
//     }`;

//   const mobileLinkClass = (path) =>
//     `group flex items-center justify-between p-3 rounded-2xl transition-all duration-300 ${
//       isActive(path)
//         ? "bg-orange-50 text-[#FF7300]"
//         : "text-gray-700 hover:bg-orange-50 hover:text-[#FF7300]"
//     }`;

//   const mobileIconClass = (path) =>
//     `w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-300 ${
//       isActive(path)
//         ? "bg-[#FF7300] text-white shadow-lg shadow-orange-500/20"
//         : "bg-[#002341]/10 text-[#002341] group-hover:bg-[#FF7300] group-hover:text-white group-hover:scale-110"
//     }`;

//   return (
//     <>
//       {/* ================= NAVBAR ================= */}

//       <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-gray-100 shadow-sm">
//         <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex items-center justify-between">

//           {/* LOGO */}

//           <Link
//             href="/"
//             onClick={closeMenu}
//             className="flex items-center gap-3 select-none"
//           >
//             <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#FF7300] to-[#002341] flex items-center justify-center text-white font-black text-xl shadow-lg shadow-orange-500/20 transition-all duration-300 hover:scale-105 hover:rotate-3">
//               A
//             </div>

//             <div>
//               <h1 className="text-2xl font-extrabold bg-gradient-to-r from-[#002341] to-[#FF7300] text-transparent bg-clip-text leading-none">
//                 Advixio
//               </h1>

//               <p className="text-[11px] text-gray-500 mt-1">
//                 Find • Connect • Grow
//               </p>
//             </div>
//           </Link>

//           {/* DESKTOP NAVIGATION */}

//           <div className="hidden md:flex items-center gap-2">
//             {navItems.map(({ href, label, Icon }) => (
//               <Link
//                 key={href}
//                 href={href}
//                 className={desktopLinkClass(href)}
//               >
//                 <span className={desktopIconClass(href)}>
//                   <Icon size={18} strokeWidth={2.5} />
//                 </span>

//                 <span>{label}</span>
//               </Link>
//             ))}
//           </div>

//           {/* RIGHT SIDE */}

//           <div className="flex items-center gap-3">

//             {/* PROFILE BUTTON */}

//             <button
//               type="button"
//               onClick={profileClick}
//               className="hidden md:flex items-center gap-2 bg-gradient-to-r from-[#002341] to-[#FF7300] text-white px-5 py-2.5 rounded-xl font-semibold shadow-lg shadow-orange-500/10 hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-300"
//             >
//               <User size={18} />
//               {mounted && token ? "Profile" : "Login"}
//             </button>

//             {/* MOBILE MENU BUTTON */}

//             <button
//               type="button"
//               onClick={() => setMenuOpen(true)}
//               aria-label="Open menu"
//               aria-expanded={menuOpen}
//               className="md:hidden w-11 h-11 rounded-xl bg-gradient-to-br from-[#002341] to-[#003b68] text-white flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-all duration-300"
//             >
//               <Menu size={24} />
//             </button>
//           </div>
//         </div>
//       </nav>

//       {/* ================= MOBILE DRAWER ================= */}

//       <div
//         className={`fixed inset-0 z-[999] transition-all duration-300 ${
//           menuOpen
//             ? "visible opacity-100"
//             : "invisible opacity-0 pointer-events-none"
//         }`}
//         aria-hidden={!menuOpen}
//       >
//         {/* BACKDROP */}

//         <button
//           type="button"
//           aria-label="Close mobile menu"
//           tabIndex={menuOpen ? 0 : -1}
//           onClick={closeMenu}
//           className="absolute inset-0 w-full h-full bg-black/60 backdrop-blur-sm cursor-default"
//         />

//         {/* DRAWER */}

//         <div
//           className={`absolute right-0 top-0 h-full w-[88%] max-w-sm bg-white shadow-2xl transition-transform duration-300 ${
//             menuOpen
//               ? "translate-x-0"
//               : "translate-x-full"
//           }`}
//         >
//           <div className="h-full overflow-y-auto p-6">

//             {/* DRAWER HEADER */}

//             <div className="flex items-center justify-between mb-8">
//               <Link
//                 href="/"
//                 onClick={closeMenu}
//                 className="flex items-center gap-3"
//               >
//                 <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FF7300] to-[#002341] flex items-center justify-center text-white font-black text-lg shadow-md">
//                   A
//                 </div>

//                 <div>
//                   <h2 className="text-xl font-extrabold text-[#002341]">
//                     Advixio
//                   </h2>

//                   <p className="text-[10px] text-gray-500">
//                     Find • Connect • Grow
//                   </p>
//                 </div>
//               </Link>

//               {/* CLOSE BUTTON */}

//               <button
//                 type="button"
//                 onClick={closeMenu}
//                 aria-label="Close menu"
//                 className="w-10 h-10 rounded-xl bg-gray-100 text-gray-600 flex items-center justify-center hover:bg-red-50 hover:text-red-500 transition-all"
//               >
//                 <X size={22} />
//               </button>
//             </div>

//             {/* WELCOME CARD */}

//             <div className="relative overflow-hidden bg-gradient-to-br from-[#002341] via-[#003b68] to-[#FF7300] rounded-3xl p-6 text-white mb-8 shadow-xl">
//               <div className="absolute -right-8 -top-8 w-28 h-28 rounded-full bg-white/10" />

//               <div className="absolute -right-12 -bottom-12 w-32 h-32 rounded-full bg-white/10" />

//               <div className="relative">
//                 <p className="text-white/70 text-xs font-medium mb-1">
//                   Welcome 👋
//                 </p>

//                 <h3 className="font-bold text-xl">
//                   Explore Advixio
//                 </h3>

//                 <p className="text-sm text-white/80 mt-1">
//                   Find trusted services and connect with professionals.
//                 </p>
//               </div>
//             </div>

//             {/* MOBILE NAVIGATION */}

//             <div className="space-y-3">
//               {navItems.map(({ href, label, Icon }) => (
//                 <Link
//                   key={href}
//                   href={href}
//                   onClick={closeMenu}
//                   className={mobileLinkClass(href)}
//                 >
//                   <div className="flex items-center gap-4">
//                     <span className={mobileIconClass(href)}>
//                       <Icon
//                         size={21}
//                         strokeWidth={2.5}
//                       />
//                     </span>

//                     <span className="text-lg font-semibold">
//                       {label}
//                     </span>
//                   </div>

//                   <ArrowRight
//                     size={19}
//                     className={`transition-transform duration-300 ${
//                       isActive(href)
//                         ? "text-[#FF7300]"
//                         : "text-gray-300 group-hover:text-[#FF7300] group-hover:translate-x-1"
//                     }`}
//                   />
//                 </Link>
//               ))}

//               {/* PROFILE / LOGIN */}

//               <button
//                 type="button"
//                 onClick={profileClick}
//                 className="group w-full flex items-center justify-between p-3 rounded-2xl text-gray-700 hover:bg-orange-50 hover:text-[#FF7300] transition-all duration-300"
//               >
//                 <div className="flex items-center gap-4">
//                   <span className="w-11 h-11 rounded-xl bg-[#002341]/10 text-[#002341] flex items-center justify-center group-hover:bg-[#FF7300] group-hover:text-white group-hover:scale-110 transition-all duration-300">
//                     <User
//                       size={21}
//                       strokeWidth={2.5}
//                     />
//                   </span>

//                   <span className="text-lg font-semibold">
//                     {mounted && token
//                       ? "My Profile"
//                       : "Login"}
//                   </span>
//                 </div>

//                 <ArrowRight
//                   size={19}
//                   className="text-gray-300 group-hover:text-[#FF7300] group-hover:translate-x-1 transition-all duration-300"
//                 />
//               </button>

//               {/* LOGOUT */}

//               {mounted && token && (
//                 <button
//                   type="button"
//                   onClick={handleLogout}
//                   className="w-full p-3 rounded-2xl text-left font-semibold text-red-600 hover:bg-red-50 transition-colors"
//                 >
//                   Logout
//                 </button>
//               )}
//             </div>

//             {/* BOTTOM BRANDING */}

//             <div className="mt-10 pt-6 border-t border-gray-100 text-center">
//               <p className="text-xs text-gray-400">
//                 Find • Connect • Grow
//               </p>

//               <p className="text-[10px] text-gray-300 mt-1">
//                 © {new Date().getFullYear()} Advixio
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }
