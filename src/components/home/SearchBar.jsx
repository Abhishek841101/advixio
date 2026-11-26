"use client";

import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  X,
  MapPin,
  ChevronDown,
  Package,
  Building2,
  Wrench,
  FileText,
  Tag,
  Loader2,
} from "lucide-react";
import { categories as fallbackCategories } from "@/data/categories";

const API_URL = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"
).replace(/\/+$/, "");

const TABS = [
  {
    id: "products",
    label: "Products",
    placeholder: "Search products, suppliers or services...",
    Icon: Package,
    type: "search",
  },
  {
    id: "suppliers",
    label: "Suppliers",
    placeholder: "Search suppliers or companies...",
    Icon: Building2,
    type: "search",
  },
  {
    id: "services",
    label: "Services",
    placeholder: "Search services...",
    Icon: Wrench,
    type: "search",
  },
  {
    id: "requirement",
    label: "Post Buy Requirement",
    placeholder: "",
    Icon: FileText,
    type: "navigate",
    href: "/requirements",
  },
];

// Popular search chips: static fallback. Replace with a dynamic endpoint later if one exists.
const POPULAR_SEARCHES = [
  "Industrial Machinery",
  "Auto Parts",
  "Electrical Components",
  "Packaging Materials",
  "Safety Equipment",
  "Pumps & Valves",
];

const MAX_PER_GROUP = 5;
const DEBOUNCE_MS = 250;
const MIN_CHARS = 2;

function normalize(value) {
  return String(value || "").trim().toLowerCase();
}

function includesQuery(value, query) {
  return normalize(value).includes(query);
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function Highlight({ text, query }) {
  const raw = String(text || "");
  const q = String(query || "").trim();
  if (!q) return raw;
  const parts = raw.split(new RegExp(`(${escapeRegExp(q)})`, "ig"));
  return parts.map((part, i) =>
    normalize(part) === normalize(q) ? (
      <mark key={i} className="hs-mark">
        {part}
      </mark>
    ) : (
      <span key={i}>{part}</span>
    )
  );
}

function buildSearchUrl(tab, { keyword, category, location }) {
  const params = new URLSearchParams();
  const q = keyword.trim();
  if (q) params.set("search", q);
  if (category && category !== "all") params.set("category", category);
  if (location && location !== "all-india") params.set("location", location);
  const qs = params.toString();

  if (tab === "products") return `/products${qs ? `?${qs}` : ""}`;
  if (tab === "suppliers") {
    const sp = new URLSearchParams();
    if (q) sp.set("search", q);
    if (location && location !== "all-india") sp.set("location", location);
    const s = sp.toString();
    return `/suppliers${s ? `?${s}` : ""}`;
  }
  if (tab === "services") return `/services${qs ? `?${qs}` : ""}`;
  return "/products";
}

function useOutsideClick(refs, onOutside) {
  useEffect(() => {
    const handler = (e) => {
      const inside = refs.some((r) => r.current && r.current.contains(e.target));
      if (!inside) onOutside();
    };
    document.addEventListener("mousedown", handler);
    document.addEventListener("touchstart", handler);
    return () => {
      document.removeEventListener("mousedown", handler);
      document.removeEventListener("touchstart", handler);
    };
  }, [refs, onOutside]);
}

export default function SearchBar() {
  const router = useRouter();
  const uid = useId();

  const [activeTab, setActiveTab] = useState("products");
  const [keyword, setKeyword] = useState("");
  const [category, setCategory] = useState({ slug: "all", name: "All Categories" });
  const [location, setLocation] = useState({ value: "all-india", label: "All India" });

  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);

  const [suggestions, setSuggestions] = useState({ products: [], categories: [], suppliers: [] });
  const [suggestOpen, setSuggestOpen] = useState(false);
  const [suggestLoading, setSuggestLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const [catOpen, setCatOpen] = useState(false);
  const [catQuery, setCatQuery] = useState("");
  const [locOpen, setLocOpen] = useState(false);
  const [locQuery, setLocQuery] = useState("");

  const [dataCache, setDataCache] = useState({ products: null, suppliers: null });
  const dataFetchRef = useRef({ products: false, suppliers: false });

  const rootRef = useRef(null);
  const inputRef = useRef(null);
  const catRef = useRef(null);
  const locRef = useRef(null);
  const suggestAbortRef = useRef(null);
  const suggestTimerRef = useRef(null);

  const currentTab = TABS.find((t) => t.id === activeTab) || TABS[0];

  const closeAllDropdowns = useCallback(() => {
    setSuggestOpen(false);
    setCatOpen(false);
    setLocOpen(false);
    setActiveIndex(-1);
  }, []);

  useOutsideClick([rootRef], closeAllDropdowns);

  // Load categories once (API, fallback to static data).
  useEffect(() => {
    let alive = true;
    const load = async () => {
      try {
        const res = await fetch(`${API_URL}/categories`, { cache: "no-store" });
        const result = await res.json();
        const list = Array.isArray(result?.data) ? result.data : [];
        const normalized = list
          .map((c) => ({
            slug: c.slug || normalize(c.name).replace(/\s+/g, "-"),
            name: c.name || c.slug || "Category",
          }))
          .filter((c) => c.name);
        if (alive && normalized.length > 0) {
          setCategories(normalized);
          return;
        }
      } catch {
        // fall back below
      }
      if (alive) {
        setCategories(
          fallbackCategories.map((c) => ({ slug: c.slug, name: c.name }))
        );
      }
    };
    load().finally(() => {
      if (alive) setCategoriesLoading(false);
    });
    return () => {
      alive = false;
    };
  }, []);

  // Lazy data fetch for autocomplete/locations (client-side fallback; no dedicated endpoint).

  useEffect(() => {
    let alive = true;
    const load = async (kind) => {
      if (dataFetchRef.current[kind]) return;
      dataFetchRef.current[kind] = true;
      try {
        const endpoint = kind === "products" ? "/products" : "/suppliers";
        const res = await fetch(`${API_URL}${endpoint}`, { cache: "no-store" });
        const result = await res.json();
        const list = Array.isArray(result?.data) ? result.data : [];
        if (alive) setDataCache((prev) => (prev[kind] ? prev : { ...prev, [kind]: list }));
      } catch {
        if (alive) setDataCache((prev) => (prev[kind] ? prev : { ...prev, [kind]: [] }));
      } finally {
        dataFetchRef.current[kind] = false;
      }
    };
    void load("products");
    void load("suppliers");
    return () => {
      alive = false;
    };
  }, []);

  const locationOptions = useMemo(() => {
    const set = new Set();
    (dataCache.products || []).forEach((p) => {
      const city = String(p?.location?.city || p?.seller?.city || "").trim();
      const state = String(p?.location?.state || p?.seller?.state || "").trim();
      if (city) set.add(city);
      if (state) set.add(state);
    });
    (dataCache.suppliers || []).forEach((s) => {
      const city = String(s?.city || "").trim();
      const state = String(s?.state || "").trim();
      if (city) set.add(city);
      if (state) set.add(state);
    });
    return Array.from(set)
      .filter((v) => v && v.toLowerCase() !== "india")
      .sort((a, b) => a.localeCompare(b));
  }, [dataCache.products, dataCache.suppliers]);

  const filteredCategories = useMemo(() => {
    const q = normalize(catQuery);
    if (!q) return categories;
    return categories.filter((c) => includesQuery(c.name, q) || includesQuery(c.slug, q));
  }, [categories, catQuery]);

  const filteredLocations = useMemo(() => {
    const q = normalize(locQuery);
    if (!q) return locationOptions;
    return locationOptions.filter((l) => includesQuery(l, q));
  }, [locationOptions, locQuery]);

  const suggestionItems = useMemo(() => {
    const items = [];
    suggestions.products.forEach((item) => items.push({ ...item, group: "Products" }));
    suggestions.categories.forEach((item) => items.push({ ...item, group: "Categories" }));
    suggestions.suppliers.forEach((item) => items.push({ ...item, group: "Suppliers" }));
    return items;
  }, [suggestions]);

  const hasSuggestions =
    suggestions.products.length > 0 ||
    suggestions.categories.length > 0 ||
    suggestions.suppliers.length > 0;

  // Autocomplete (debounced, min 2 chars, AbortController for stale requests).
  useEffect(() => {
    if (suggestTimerRef.current) clearTimeout(suggestTimerRef.current);
    if (suggestAbortRef.current) suggestAbortRef.current.abort();

    const q = normalize(keyword);
    if (q.length < MIN_CHARS) {
      return () => {
        if (suggestTimerRef.current) clearTimeout(suggestTimerRef.current);
        if (suggestAbortRef.current) suggestAbortRef.current.abort();
      };
    }

    suggestTimerRef.current = setTimeout(async () => {
      const controller = new AbortController();
      suggestAbortRef.current = controller;
      setSuggestLoading(true);
      try {
        // Client-side filtering fallback from existing endpoints/data.
        const prodSource = dataCache.products || [];
        const supSource = dataCache.suppliers || [];
        const catSource = categories || [];

        const productMatches = prodSource
          .filter((p) => {
            return [
              p?.name,
              p?.brand,
              p?.model,
              p?.category?.name,
              p?.subcategory,
              p?.seller?.companyName,
              p?.seller?.name,
            ].some((v) => includesQuery(v, q));
          })
          .slice(0, MAX_PER_GROUP)
          .map((p) => ({
            id: `p-${p._id || p.slug || p.name}`,
            label: p.name || "Product",
            sublabel: p?.category?.name || p?.seller?.companyName || "Product",
            href: p.slug ? `/products/${p.slug}` : `/products?search=${encodeURIComponent(p.name || q)}`,
          }));

        const categoryMatches = catSource
          .filter((c) => includesQuery(c.name, q) || includesQuery(c.slug, q))
          .slice(0, MAX_PER_GROUP)
          .map((c) => ({
            id: `c-${c.slug}`,
            label: c.name,
            sublabel: "Category",
            href: `/products?category=${encodeURIComponent(c.slug)}`,
          }));

        const supplierMatches = supSource
          .filter((s) =>
            [s?.companyName, s?.name, s?.city, s?.state].some((v) => includesQuery(v, q))
          )
          .slice(0, MAX_PER_GROUP)
          .map((s) => ({
            id: `s-${s._id || s.slug || s.name}`,
            label: s.companyName || s.name || "Supplier",
            sublabel: [s?.city, s?.state].filter(Boolean).join(", ") || "Supplier",
            href: s.slug || s._id ? `/suppliers/${s.slug || s._id}` : `/suppliers?search=${encodeURIComponent(s.companyName || s.name || q)}`,
          }));

        if (controller.signal.aborted) return;
        setSuggestions({
          products: activeTab === "suppliers" ? [] : productMatches,
          categories: activeTab === "suppliers" ? [] : categoryMatches,
          suppliers: activeTab === "services" ? [] : supplierMatches,
        });
        setSuggestOpen(true);
        setActiveIndex(-1);
      } finally {
        if (!controller.signal.aborted) setSuggestLoading(false);
      }
    }, DEBOUNCE_MS);

    return () => {
      if (suggestTimerRef.current) clearTimeout(suggestTimerRef.current);
      if (suggestAbortRef.current) suggestAbortRef.current.abort();
    };
  }, [keyword, categories, dataCache.products, dataCache.suppliers, activeTab]);

  const navigate = useCallback(
    (href) => {
      closeAllDropdowns();
      router.push(href);
    },
    [closeAllDropdowns, router]
  );

  const submitSearch = useCallback(
    (e) => {
      e?.preventDefault?.();
      const href = buildSearchUrl(activeTab, {
        keyword,
        category: category.slug,
        location: location.value,
      });
      navigate(href);
    },
    [activeTab, keyword, category.slug, location.value, navigate]
  );

  const onInputKeyDown = (e) => {
    if (!suggestOpen && (e.key === "ArrowDown" || e.key === "ArrowUp") && suggestionItems.length) {
      setSuggestOpen(true);
      return;
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSuggestOpen(true);
      setActiveIndex((i) => (suggestionItems.length ? (i + 1) % suggestionItems.length : -1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSuggestOpen(true);
      setActiveIndex((i) =>
        suggestionItems.length ? (i <= 0 ? suggestionItems.length - 1 : i - 1) : -1
      );
    } else if (e.key === "Enter") {
      if (suggestOpen && activeIndex >= 0 && suggestionItems[activeIndex]) {
        e.preventDefault();
        navigate(suggestionItems[activeIndex].href);
      }
    } else if (e.key === "Escape") {
      if (suggestOpen) {
        e.preventDefault();
        setSuggestOpen(false);
        setActiveIndex(-1);
      }
    }
  };

  const onTabKeyDown = (e, index) => {
    const searchableTabs = TABS;
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    e.preventDefault();
    const dir = e.key === "ArrowRight" ? 1 : -1;
    const next = (index + dir + searchableTabs.length) % searchableTabs.length;
    const nextTab = searchableTabs[next];
    handleTabClick(nextTab);
    const btn = rootRef.current?.querySelector(`[data-tab-id="${nextTab.id}"]`);
    btn?.focus();
  };

  const handleTabClick = (tab) => {
    if (tab.type === "navigate") {
      router.push(tab.href);
      return;
    }
    setActiveTab(tab.id);
    setActiveIndex(-1);
    setSuggestOpen(false);
  };

  const selectCategory = (c) => {
    setCategory(c ? { slug: c.slug, name: c.name } : { slug: "all", name: "All Categories" });
    setCatOpen(false);
    setCatQuery("");
  };

  const selectLocation = (value) => {
    setLocation(
      value && value !== "all-india"
        ? { value, label: value }
        : { value: "all-india", label: "All India" }
    );
    setLocOpen(false);
    setLocQuery("");
  };

  const showCategory = activeTab !== "suppliers";
  const suggestListId = `${uid}-suggest-list`;
  const activeDescendant =
    activeIndex >= 0 && suggestionItems[activeIndex]
      ? `${uid}-opt-${suggestionItems[activeIndex].id}`
      : undefined;

  return (
    <div className="hero-search-card hs-root" ref={rootRef}>
      <div className="hero-search-tabs hs-tabs" role="tablist" aria-label="Search type">
        {TABS.map((tab, index) => {
          const isActive = tab.type === "search" && tab.id === activeTab;
          const Icon = tab.Icon;
          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              data-tab-id={tab.id}
              aria-selected={isActive}
              tabIndex={isActive || (activeTab === "products" && tab.id === "products") ? 0 : -1}
              className={`hs-tab ${isActive ? "active" : ""}`}
              onClick={() => handleTabClick(tab)}
              onKeyDown={(e) => onTabKeyDown(e, index)}
            >
              <Icon className="hs-tab-icon" aria-hidden="true" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      <form className="hs-form" onSubmit={submitSearch} role="search">
        <div className="hs-row">
          <div className="hs-keyword">
            <label className="hs-sr-only" htmlFor={`${uid}-keyword`}>
              Search keyword
            </label>
            <span className="hs-leading-icon" aria-hidden="true">
              <Search size={18} />
            </span>
            <input
              ref={inputRef}
              id={`${uid}-keyword`}
              type="text"
              className="hs-input"
              value={keyword}
              placeholder={currentTab.placeholder}
              autoComplete="off"
              role="combobox"
              aria-expanded={suggestOpen}
              aria-controls={suggestListId}
              aria-activedescendant={activeDescendant}
              aria-autocomplete="list"
              onChange={(e) => {
                const next = e.target.value;
                setKeyword(next);
                if (normalize(next).length < MIN_CHARS) {
                  setSuggestions({ products: [], categories: [], suppliers: [] });
                  setSuggestOpen(false);
                  setSuggestLoading(false);
                  setActiveIndex(-1);
                } else {
                  setSuggestOpen(true);
                }
              }}
              onFocus={() => {
                if (keyword.trim().length >= MIN_CHARS) setSuggestOpen(true);
              }}
              onKeyDown={onInputKeyDown}
            />
            {keyword && (
              <button
                type="button"
                className="hs-clear"
                aria-label="Clear search"
                onClick={() => {
                  setKeyword("");
                  setSuggestions({ products: [], categories: [], suppliers: [] });
                  setSuggestOpen(false);
                  setActiveIndex(-1);
                  inputRef.current?.focus();
                }}
              >
                <X size={16} />
              </button>
            )}

            {suggestOpen && (keyword.trim().length >= MIN_CHARS || suggestLoading) && (
              <div className="hs-suggest" id={suggestListId} role="listbox" aria-label="Search suggestions">
                {suggestLoading && (
                  <div className="hs-suggest-state" aria-live="polite">
                    <Loader2 size={16} className="hs-spin" aria-hidden="true" />
                    <span>Loading suggestions...</span>
                  </div>
                )}
                {!suggestLoading && !hasSuggestions && (
                  <div className="hs-suggest-state" aria-live="polite">
                    No suggestions found
                  </div>
                )}
                {!suggestLoading && hasSuggestions && (
                  <>
                    {[
                      { key: "products", label: "Products", Icon: Package, items: suggestions.products },
                      { key: "categories", label: "Categories", Icon: Tag, items: suggestions.categories },
                      { key: "suppliers", label: "Suppliers", Icon: Building2, items: suggestions.suppliers },
                    ].map(({ key, label, Icon, items }) =>
                      items.length ? (
                        <div className="hs-suggest-group" key={key}>
                          <div className="hs-suggest-group-label">
                            <Icon size={14} aria-hidden="true" />
                            <span>{label}</span>
                          </div>
                          {items.map((item) => {
                            const flatIndex = suggestionItems.findIndex((s) => s.id === item.id);
                            const active = flatIndex === activeIndex;
                            return (
                              <button
                                key={item.id}
                                id={`${uid}-opt-${item.id}`}
                                type="button"
                                role="option"
                                aria-selected={active}
                                className={`hs-suggest-item ${active ? "active" : ""}`}
                                onMouseEnter={() => setActiveIndex(flatIndex)}
                                onMouseDown={(e) => e.preventDefault()}
                                onClick={() => navigate(item.href)}
                              >
                                <span className="hs-suggest-text">
                                  <span className="hs-suggest-title">
                                    <Highlight text={item.label} query={keyword} />
                                  </span>
                                  <span className="hs-suggest-sub">{item.sublabel}</span>
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      ) : null
                    )}
                  </>
                )}
              </div>
            )}
          </div>

          {showCategory && (
            <div className="hs-dropdown" ref={catRef}>
              <label className="hs-sr-only" id={`${uid}-cat-label`}>
                Category
              </label>
              <button
                type="button"
                className="hs-dropdown-trigger"
                aria-labelledby={`${uid}-cat-label`}
                aria-haspopup="listbox"
                aria-expanded={catOpen}
                onClick={() => {
                  setCatOpen((v) => !v);
                  setLocOpen(false);
                  setSuggestOpen(false);
                }}
              >
                <Tag size={16} className="hs-trigger-icon" aria-hidden="true" />
                <span className="hs-trigger-text">{category.name}</span>
                <ChevronDown size={16} className="hs-trigger-caret" aria-hidden="true" />
              </button>
              {catOpen && (
                <div className="hs-dropdown-panel">
                  <div className="hs-dropdown-search">
                    <Search size={14} aria-hidden="true" />
                    <input
                      type="text"
                      value={catQuery}
                      onChange={(e) => setCatQuery(e.target.value)}
                      placeholder="Search categories..."
                      aria-label="Search categories"
                      className="hs-dropdown-input"
                    />
                  </div>
                  <ul className="hs-dropdown-list" role="listbox" aria-label="Categories">
                    <li>
                      <button
                        type="button"
                        role="option"
                        aria-selected={category.slug === "all"}
                        className={`hs-dropdown-option ${category.slug === "all" ? "selected" : ""}`}
                        onClick={() => selectCategory(null)}
                      >
                        All Categories
                      </button>
                    </li>
                    {categoriesLoading && (
                      <li className="hs-dropdown-empty">Loading categories...</li>
                    )}
                    {!categoriesLoading && filteredCategories.length === 0 && (
                      <li className="hs-dropdown-empty">No categories found</li>
                    )}
                    {!categoriesLoading &&
                      filteredCategories.map((c) => (
                        <li key={c.slug}>
                          <button
                            type="button"
                            role="option"
                            aria-selected={category.slug === c.slug}
                            className={`hs-dropdown-option ${category.slug === c.slug ? "selected" : ""}`}
                            onClick={() => selectCategory(c)}
                          >
                            {c.name}
                          </button>
                        </li>
                      ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          <div className="hs-dropdown" ref={locRef}>
            <label className="hs-sr-only" id={`${uid}-loc-label`}>
              Location
            </label>
            <button
              type="button"
              className="hs-dropdown-trigger"
              aria-labelledby={`${uid}-loc-label`}
              aria-haspopup="listbox"
              aria-expanded={locOpen}
              onClick={() => {
                setLocOpen((v) => !v);
                setCatOpen(false);
                setSuggestOpen(false);
              }}
            >
              <MapPin size={16} className="hs-trigger-icon" aria-hidden="true" />
              <span className="hs-trigger-text">{location.label}</span>
              <ChevronDown size={16} className="hs-trigger-caret" aria-hidden="true" />
            </button>
            {locOpen && (
              <div className="hs-dropdown-panel">
                <div className="hs-dropdown-search">
                  <Search size={14} aria-hidden="true" />
                  <input
                    type="text"
                    value={locQuery}
                    onChange={(e) => setLocQuery(e.target.value)}
                    placeholder="Type city or state..."
                    aria-label="Search locations"
                    className="hs-dropdown-input"
                  />
                </div>
                <ul className="hs-dropdown-list" role="listbox" aria-label="Locations">
                  <li>
                    <button
                      type="button"
                      role="option"
                      aria-selected={location.value === "all-india"}
                      className={`hs-dropdown-option ${location.value === "all-india" ? "selected" : ""}`}
                      onClick={() => selectLocation("all-india")}
                    >
                      All India
                    </button>
                  </li>
                  {filteredLocations.length === 0 && locQuery && (
                    <li className="hs-dropdown-empty">No locations found</li>
                  )}
                  {filteredLocations.map((l) => (
                    <li key={l}>
                      <button
                        type="button"
                        role="option"
                        aria-selected={location.value === l}
                        className={`hs-dropdown-option ${location.value === l ? "selected" : ""}`}
                        onClick={() => selectLocation(l)}
                      >
                        {l}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <button type="submit" className="hs-submit">
            <Search size={18} aria-hidden="true" />
            <span>Search</span>
          </button>
        </div>
      </form>

      <div className="hs-popular">
        <span className="hs-popular-label">Popular:</span>
        <div className="hs-popular-chips">
          {POPULAR_SEARCHES.map((term) => (
            <button
              key={term}
              type="button"
              className="hs-chip"
              onClick={() => navigate(`/products?search=${encodeURIComponent(term)}`)}
            >
              {term}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
