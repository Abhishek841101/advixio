"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import "./supplier-dashboard.css";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

type ShellUser = {
  name?: string;
  companyName?: string;
  profileImage?: string;
  email?: string;
};

function isActivePath(pathname: string, href: string) {
  if (href === "/dashboard") return pathname === "/dashboard";
  return pathname === href || pathname.startsWith(href + "/");
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState<ShellUser | null>(null);

  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  useEffect(() => {
    const stored = localStorage.getItem("advixio_user");
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        // ignore
      }
    }

    const token = localStorage.getItem("advixio_token");
    if (!token) return;

    (async () => {
      try {
        const res = await fetch(`${API_URL}/auth/profile`, {
          headers: { Authorization: `Bearer ${token}` },
          cache: "no-store",
        });
        const data = await res.json().catch(() => null);
        if (res.ok && data?.success && data.data) {
          setUser(data.data);
        }
      } catch {
        // keep cached/local user for shell display
      }
    })();
  }, []);

  const initials = useMemo(() => {
    const name = user?.name || "Supplier";
    return name
      .split(" ")
      .filter(Boolean)
      .map((w) => w[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  }, [user?.name]);

  const logout = () => {
    localStorage.removeItem("advixio_token");
    localStorage.removeItem("advixio_user");
    router.push("/");
  };

  const nav = [
    {
      title: "OVERVIEW",
      items: [
        { href: "/dashboard", label: "Dashboard", icon: "▦" },
      ],
    },
    {
      title: "BUSINESS",
      items: [
        { href: "/dashboard/profile", label: "My Profile", icon: "👤" },
      ],
    },
    {
      title: "PRODUCTS",
      items: [
        { href: "/dashboard/products", label: "My Products", icon: "📦" },
        { href: "/dashboard/products/add", label: "Add Product", icon: "＋" },
      ],
    },
    {
      title: "LEADS",
      items: [
        {
          href: "/dashboard/requirements",
          label: "My Requirements",
          icon: "📋",
        },
      ],
    },
    {
      title: "ACCOUNT",
      items: [
        { href: "/dashboard/settings", label: "Settings", icon: "⚙" },
      ],
    },
  ];

  return (
    <div className="supplier-dash">
      <div className="sd-app">
        <aside className={`sd-sidebar${sidebarOpen ? " open" : ""}`}>
          <div className="sd-brand">Advixio360</div>
          <div className="sd-side-scroll">
            {nav.map((group) => (
              <div key={group.title}>
                <div className="sd-menu-title">{group.title}</div>
                {group.items.map((item) => {
                  const active = isActivePath(pathname, item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`sd-menu-item${active ? " active" : ""}`}
                    >
                      <span className="sd-icon">{item.icon}</span>
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            ))}
            <div className="sd-menu-title">SESSION</div>
            <button type="button" className="sd-menu-item" onClick={logout}>
              <span className="sd-icon">↪</span>
              <span>Logout</span>
            </button>
          </div>
          <div className="sd-side-bottom">
            <div className="sd-profile-mini">
              <div className="sd-avatar">
                {user?.profileImage ? (
                  <img src={user.profileImage} alt={user.name || "Profile"} />
                ) : (
                  initials
                )}
              </div>
              <div style={{ minWidth: 0 }}>
                <strong
                  style={{
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {user?.companyName || user?.name || "Supplier"}
                </strong>
                <span>{user?.name || "Account"}</span>
              </div>
              <span className="sd-profile-arrow">›</span>
            </div>
          </div>
        </aside>

        <main className="sd-main">
          <header className="sd-topbar">
            <button
              type="button"
              className="sd-mobile-menu"
              aria-label="Toggle menu"
              onClick={() => setSidebarOpen((v) => !v)}
            >
              ☰
            </button>
            <div className="sd-search">
              <span>⌕</span>
              <input placeholder="Search products, enquiries..." readOnly />
            </div>
            <div className="sd-top-actions">
              <button type="button" className="sd-icon-btn" aria-label="Notifications">
                🔔
                <span className="sd-dot" />
              </button>
              <div className="sd-top-profile">
                <div className="sd-avatar" style={{ width: 34, height: 34, borderRadius: 9, fontSize: 11 }}>
                  {user?.profileImage ? (
                    <img src={user.profileImage} alt={user.name || "Profile"} />
                  ) : (
                    initials
                  )}
                </div>
                <div>
                  <strong>{user?.name || "Supplier"}</strong>
                  <span>{user?.companyName || "Advixio360"}</span>
                </div>
              </div>
            </div>
          </header>

          <div className="sd-content">{children}</div>
        </main>
      </div>
      {sidebarOpen ? (
        <button
          type="button"
          aria-label="Close menu"
          onClick={() => setSidebarOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(23, 37, 84, 0.25)",
            border: 0,
            zIndex: 45,
          }}
        />
      ) : null}
    </div>
  );
}