"use client";

import {
  Suspense,
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent,
} from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
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
import {
  CATEGORY_PARAM,
  LOCATION_PARAM,
  SEARCH_MAX_LENGTH,
  SEARCH_PARAM,
  SEARCH_TABS,
  POPULAR_SEARCHES,
  buildSearchUrl,
  normalizeCategoryValue,
  normalizeLocationValue,
  normalizeSearchKeyword,
  type SearchTab,
} from "@/lib/search";

const API_URL = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"
).replace(/\/+$/, "");

const MAX_PER_GROUP = 5;
const DEBOUNCE_MS = 250;
const MIN_CHARS = 2;
const SUGGESTION_CACHE_MAX = 50;

type CategoryOption = { slug: string; name: string };
type SuggestionItem = { id: string; label: string; sublabel: string; href: string };
type SuggestionGroups = { products: SuggestionItem[]; categories: SuggestionItem[]; suppliers: SuggestionItem[] };
type ProductLike = {
  _id?: string;
  slug?: string;
  name?: string;
  brand?: string;
  model?: string;
  subcategory?: string;
  category?: { name?: string; slug?: string } | null;
  seller?: { companyName?: string; name?: string; city?: string; state?: string } | null;
  location?: { city?: string; state?: string } | null;
};
type SupplierLike = {
  _id?: string;
  slug?: string;
  name?: string;
  companyName?: string;
  city?: string;
  state?: string;
};
type DataCache = { products: ProductLike[] | null; suppliers: SupplierLike[] | null };

const suggestionCache = new Map<string, SuggestionGroups>();
let categoriesCache: CategoryOption[] | null = null;
let categoriesPromise: Promise<CategoryOption[]> | null = null;
const dataCache: DataCache = { products: null, suppliers: null };
const dataPromises: { products: Promise<ProductLike[]> | null; suppliers: Promise<SupplierLike[]> | null } = {
  products: null,
  suppliers: null,
};

function normalize(value: unknown): string {
  return String(value || "").trim().toLowerCase();
}

function includesQuery(value: unknown, query: string): boolean {
  return normalize(value).includes(query);
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function Highlight({ text, query }: { text: string; query: string }) {
  const raw = String(text || "");
  const q = String(query || "").trim();
  if (!q) return <>{raw}</>;
  const parts = raw.split(new RegExp(`(${escapeRegExp(q)})`, "ig"));
  return (
    <>
      {parts.map((part, i) =>
        normalize(part) === normalize(q) ? (
          <mark key={i} className="hs-mark">
            {part}
          </mark>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  );
}

function useOutsideClick(refs: Array<{ current: HTMLElement | null }>, onOutside: () => void) {
  useEffect(() => {
    const handler = (e: MouseEvent | TouchEvent) => {
      const target = e.target as Node;
      const inside = refs.some((r) => r.current && r.current.contains(target));
      if (!inside) onOutside();
    };
    document.addEventListener("mousedown", handler);
    document.addEventListener("touchstart", handler, { passive: true });
    return () => {
      document.removeEventListener("mousedown", handler);
      document.removeEventListener("touchstart", handler);
    };
  }, [refs, onOutside]);
}

async function loadCategoriesOnce(): Promise<CategoryOption[]> {
  if (categoriesCache) return categoriesCache;
  if (categoriesPromise) return categoriesPromise;
  categoriesPromise = (async () => {
    try {
      const res = await fetch(`${API_URL}/categories`, { cache: "no-store" });
      const result = await res.json();
      const list = Array.isArray(result?.data) ? (result.data as Array<Record<string, unknown>>) : [];
      const normalized = list
        .map((c) => ({
          slug: String(c?.slug || normalize(c?.name).replace(/\s+/g, "-")),
          name: String(c?.name || c?.slug || "Category"),
        }))
        .filter((c: CategoryOption) => c.name && c.slug);
      if (normalized.length > 0) {
        categoriesCache = normalized;
        return normalized;
      }
    } catch {
      // fallback below
    }
    categoriesCache = fallbackCategories.map((c: { slug: string; name: string }) => ({ slug: c.slug, name: c.name }));
    return categoriesCache;
  })().finally(() => {
    categoriesPromise = null;
  });
  return categoriesPromise;
}

async function loadDataOnce(kind: "products"): Promise<ProductLike[]>;
async function loadDataOnce(kind: "suppliers"): Promise<SupplierLike[]>;
async function loadDataOnce(kind: "products" | "suppliers"): Promise<ProductLike[] | SupplierLike[]> {
  if (dataCache[kind]) return dataCache[kind] as ProductLike[] | SupplierLike[];
  if (dataPromises[kind]) return dataPromises[kind] as Promise<ProductLike[] | SupplierLike[]>;
  const promise = (async () => {
    try {
      const endpoint = kind === "products" ? "/products" : "/suppliers";
      const res = await fetch(`${API_URL}${endpoint}`, { cache: "no-store" });
      const result = await res.json();
      const list = Array.isArray(result?.data) ? (result.data as Array<Record<string, unknown>>) : [];
      if (kind === "products") {
        dataCache.products = list as ProductLike[];
        return dataCache.products;
      }
      dataCache.suppliers = list as SupplierLike[];
      return dataCache.suppliers;
    } catch {
      if (kind === "products") dataCache.products = [];
      else dataCache.suppliers = [];
      return [];
    } finally {
      dataPromises[kind] = null;
    }
  })();
  dataPromises[kind] = promise as Promise<ProductLike[]> & Promise<SupplierLike[]>;
  return promise;
}

function tabFromPathname(pathname: string): SearchTab {
  if (pathname.startsWith("/suppliers")) return "suppliers";
  if (pathname.startsWith("/services")) return "services";
  return "products";
}

function SearchBarInner() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const uid = useId();

  const pathTab = tabFromPathname(pathname || "/");
  const urlSearch = normalizeSearchKeyword(searchParams.get(SEARCH_PARAM));

  const [activeTab, setActiveTab] = useState<SearchTab>(pathTab);
  const [keyword, setKeyword] = useState(urlSearch);
  const [category, setCategory] = useState<CategoryOption>({ slug: "all", name: "All Categories" });
  const [location, setLocation] = useState<{ value: string; label: string }>({
    value: "all-india",
    label: "All India",
  });

  const [categories, setCategories] = useState<CategoryOption[]>(categoriesCache || []);
  const [categoriesLoading, setCategoriesLoading] = useState(!categoriesCache);

  const [suggestions, setSuggestions] = useState<SuggestionGroups>({ products: [], categories: [], suppliers: [] });
  const [suggestOpen, setSuggestOpen] = useState(false);
  const [suggestLoading, setSuggestLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const [catOpen, setCatOpen] = useState(false);
  const [catQuery, setCatQuery] = useState("");
  const [locOpen, setLocOpen] = useState(false);
  const [locQuery, setLocQuery] = useState("");
  const [dataVersion, setDataVersion] = useState(0);

  const rootRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const catRef = useRef<HTMLDivElement | null>(null);
  const locRef = useRef<HTMLDivElement | null>(null);
  const suggestAbortRef = useRef<AbortController | null>(null);
  const suggestTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const currentTab = SEARCH_TABS.find((t) => t.id === activeTab) || SEARCH_TABS[0];

  const closeAllDropdowns = useCallback(() => {
    setSuggestOpen(false);
    setCatOpen(false);
    setLocOpen(false);
    setActiveIndex(-1);
  }, []);

  useOutsideClick([rootRef, catRef, locRef], closeAllDropdowns);

  // Sync form state from URL on results pages / back-forward.
  useEffect(() => {
    const nextTab = tabFromPathname(pathname || "/");
    const nextKeyword = normalizeSearchKeyword(searchParams.get(SEARCH_PARAM));
    const loc = normalizeLocationValue(searchParams.get(LOCATION_PARAM));
    /* eslint-disable react-hooks/set-state-in-effect -- intentional URL -> form sync */
    setActiveTab(nextTab);
    setKeyword(nextKeyword);
    setLocation(loc ? { value: loc, label: loc } : { value: "all-india", label: "All India" });
    /* eslint-enable react-hooks/set-state-in-effect */
  }, [pathname, searchParams]);

  // Sync category after categories load. Unknown/invalid slug is ignored gracefully.
  useEffect(() => {
    const slug = normalizeCategoryValue(searchParams.get(CATEGORY_PARAM));
    if (!slug) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional URL -> form sync
      setCategory({ slug: "all", name: "All Categories" });
      return;
    }
    const match = categories.find((c) => c.slug === slug);
    setCategory(match ? { slug: match.slug, name: match.name } : { slug: "all", name: "All Categories" });
  }, [searchParams, categories]);

  useEffect(() => {
    let alive = true;
    loadCategoriesOnce()
      .then((list) => {
        if (alive) setCategories(list);
      })
      .finally(() => {
        if (alive) setCategoriesLoading(false);
      });
    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    let alive = true;
    Promise.all([loadDataOnce("products"), loadDataOnce("suppliers")]).then(() => {
      if (alive) setDataVersion((v) => v + 1);
    });
    return () => {
      alive = false;
    };
  }, []);

  const locationOptions = useMemo(() => {
    const set = new Set<string>();
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
    // eslint-disable-next-line react-hooks/exhaustive-deps -- dataVersion invalidates module cache reads
  }, [dataVersion]);

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
    const items: Array<SuggestionItem & { group: string }> = [];
    suggestions.products.forEach((item) => items.push({ ...item, group: "Products" }));
    suggestions.categories.forEach((item) => items.push({ ...item, group: "Categories" }));
    suggestions.suppliers.forEach((item) => items.push({ ...item, group: "Suppliers" }));
    return items;
  }, [suggestions]);

  const hasSuggestions =
    suggestions.products.length > 0 ||
    suggestions.categories.length > 0 ||
    suggestions.suppliers.length > 0;

  useEffect(() => {
    if (suggestTimerRef.current) clearTimeout(suggestTimerRef.current);
    if (suggestAbortRef.current) suggestAbortRef.current.abort();

    const q = normalize(keyword);
    if (q.length < MIN_CHARS) return () => undefined;

    suggestTimerRef.current = setTimeout(async () => {
      const controller = new AbortController();
      suggestAbortRef.current = controller;
      const cacheKey = `${activeTab}|${q}`;
      const cached = suggestionCache.get(cacheKey);
      if (cached) {
        setSuggestions(cached);
        setSuggestOpen(true);
        setActiveIndex(-1);
        setSuggestLoading(false);
        return;
      }

      setSuggestLoading(true);
      try {
        const [prodSource, supSource] = await Promise.all([loadDataOnce("products"), loadDataOnce("suppliers")]);
        const catSource = categoriesCache || categories || [];

        const productMatches = (prodSource || [])
          .filter((p) =>
            [p?.name, p?.brand, p?.model, p?.category?.name, p?.subcategory, p?.seller?.companyName, p?.seller?.name]
              .some((v) => includesQuery(v, q))
          )
          .slice(0, MAX_PER_GROUP)
          .map((p) => ({
            id: `p-${p._id || p.slug || p.name}`,
            label: String(p.name || "Product"),
            sublabel: String(p?.category?.name || p?.seller?.companyName || "Product"),
            href: p.slug ? `/products/${p.slug}` : buildSearchUrl("products", { search: p.name || q }),
          }));

        const categoryMatches = catSource
          .filter((c) => includesQuery(c.name, q) || includesQuery(c.slug, q))
          .slice(0, MAX_PER_GROUP)
          .map((c) => ({
            id: `c-${c.slug}`,
            label: c.name,
            sublabel: "Category",
            href: buildSearchUrl("products", { category: c.slug }),
          }));

        const supplierMatches = (supSource || [])
          .filter((s) => [s?.companyName, s?.name, s?.city, s?.state].some((v) => includesQuery(v, q)))
          .slice(0, MAX_PER_GROUP)
          .map((s) => ({
            id: `s-${s._id || s.slug || s.name}`,
            label: String(s.companyName || s.name || "Supplier"),
            sublabel: [s?.city, s?.state].filter(Boolean).join(", ") || "Supplier",
            href: s.slug || s._id ? `/suppliers/${s.slug || s._id}` : buildSearchUrl("suppliers", { search: s.companyName || s.name || q }),
          }));

        if (controller.signal.aborted) return;
        const next: SuggestionGroups = {
          products: activeTab === "suppliers" ? [] : productMatches,
          categories: activeTab === "suppliers" ? [] : categoryMatches,
          suppliers: activeTab === "services" ? [] : supplierMatches,
        };
        suggestionCache.set(cacheKey, next);
        while (suggestionCache.size > SUGGESTION_CACHE_MAX) {
          const first = suggestionCache.keys().next().value;
          if (!first) break;
          suggestionCache.delete(first);
        }
        setSuggestions(next);
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
  }, [keyword, categories, activeTab, dataVersion]);

  const navigate = useCallback(
    (href: string) => {
      closeAllDropdowns();
      router.push(href);
    },
    [closeAllDropdowns, router]
  );

  const submitSearch = useCallback(
    (e?: FormEvent) => {
      e?.preventDefault?.();
      const href = buildSearchUrl(activeTab, {
        search: keyword,
        category: activeTab === "suppliers" ? undefined : category.slug,
        location: location.value,
      });
      navigate(href);
    },
    [activeTab, keyword, category.slug, location.value, navigate]
  );

  const onInputKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
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
      setActiveIndex((i) => (suggestionItems.length ? (i <= 0 ? suggestionItems.length - 1 : i - 1) : -1));
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

  const focusTab = (index: number) => {
    const nextTab = SEARCH_TABS[index];
    const el = rootRef.current?.querySelector(`[data-tab-id="${nextTab.id}"]`) as HTMLElement | null;
    el?.focus();
  };

  const onTabKeyDown = (e: KeyboardEvent<HTMLElement>, index: number) => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    e.preventDefault();
    const dir = e.key === "ArrowRight" ? 1 : -1;
    const next = (index + dir + SEARCH_TABS.length) % SEARCH_TABS.length;
    const nextTab = SEARCH_TABS[next];
    if (nextTab.type === "search") {
      // Keep keyword/location, drop category when target tab doesn't use it.
      setActiveTab(nextTab.id as SearchTab);
      if (nextTab.id === "suppliers") setCategory({ slug: "all", name: "All Categories" });
      setActiveIndex(-1);
      setSuggestOpen(false);
    }
    focusTab(next);
  };

  const handleSearchTabClick = (tabId: SearchTab) => {
    setActiveTab(tabId);
    if (tabId === "suppliers") setCategory({ slug: "all", name: "All Categories" });
    setActiveIndex(-1);
    setSuggestOpen(false);
  };

  const selectCategory = (c: CategoryOption | null) => {
    setCategory(c ? { slug: c.slug, name: c.name } : { slug: "all", name: "All Categories" });
    setCatOpen(false);
    setCatQuery("");
  };

  const selectLocation = (value: string) => {
    setLocation(value && value !== "all-india" ? { value, label: value } : { value: "all-india", label: "All India" });
    setLocOpen(false);
    setLocQuery("");
  };

  const showCategory = activeTab !== "suppliers";
  const suggestListId = `${uid}-suggest-list`;
  const activeDescendant =
    activeIndex >= 0 && suggestionItems[activeIndex] ? `${uid}-opt-${suggestionItems[activeIndex].id}` : undefined;
  const suggestionsCount = suggestionItems.length;
  const liveMessage =
    keyword.trim().length >= MIN_CHARS && suggestOpen && !suggestLoading
      ? suggestionsCount > 0
        ? `${suggestionsCount} suggestions available`
        : "No suggestions"
      : "";

  return (
    <section className="hero-search-card hs-root adv-search" ref={rootRef} aria-labelledby={`${uid}-search-heading`} data-no-reveal>
      <h2 id={`${uid}-search-heading`} className="hs-sr-only">Search Advixio marketplace</h2>
      <div className="hero-search-tabs hs-tabs adv-search__tabs" role="tablist" aria-label="Search type">
        {SEARCH_TABS.map((tab, index) => {
          const isActive = tab.type === "search" && tab.id === activeTab;
          const Icon = tab.id === "products" ? Package : tab.id === "suppliers" ? Building2 : tab.id === "services" ? Wrench : FileText;
          if (tab.type === "navigate") {
            return (
              <Link
                key={tab.id}
                href={tab.href || "/requirements"}
                role="tab"
                data-tab-id={tab.id}
                aria-selected={false}
                tabIndex={-1}
                className="hs-tab adv-search__tab"
                onKeyDown={(e) => onTabKeyDown(e, index)}
              >
                <Icon className="hs-tab-icon" width={16} height={16} aria-hidden="true" />
                <span>{tab.label}</span>
              </Link>
            );
          }
          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              data-tab-id={tab.id}
              aria-selected={isActive}
              aria-controls={`${uid}-search-panel`}
              tabIndex={isActive ? 0 : -1}
              className={`hs-tab adv-search__tab ${isActive ? "active" : ""}`}
              onClick={() => handleSearchTabClick(tab.id as SearchTab)}
              onKeyDown={(e) => onTabKeyDown(e, index)}
            >
              <Icon className="hs-tab-icon" width={16} height={16} aria-hidden="true" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      <form
        id={`${uid}-search-panel`}
        className="hs-form adv-search__form"
        role="search"
        action="/products"
        method="get"
        onSubmit={submitSearch}
      >
        <div className="hs-row">
          <div className="hs-keyword">
            <label className="hs-sr-only" htmlFor={`${uid}-keyword`}>
              Search keyword
            </label>
            <span className="hs-leading-icon" aria-hidden="true">
              <Search size={18} width={18} height={18} />
            </span>
            <input
              ref={inputRef}
              id={`${uid}-keyword`}
              name={SEARCH_PARAM}
              type="text"
              className="hs-input"
              value={keyword}
              maxLength={SEARCH_MAX_LENGTH}
              placeholder={currentTab.placeholder}
              autoComplete="off"
              role="combobox"
              aria-expanded={suggestOpen}
              aria-controls={suggestListId}
              aria-activedescendant={activeDescendant}
              aria-autocomplete="list"
              onChange={(e) => {
                const next = normalizeSearchKeyword(e.target.value);
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
                <X size={16} width={16} height={16} />
              </button>
            )}

            <div className="hs-sr-only" aria-live="polite" aria-atomic="true">
              {liveMessage}
            </div>

            {suggestOpen && (keyword.trim().length >= MIN_CHARS || suggestLoading) && (
              <div className="hs-suggest" id={suggestListId} role="listbox" aria-label="Search suggestions">
                {suggestLoading && (
                  <div className="hs-suggest-state">
                    <Loader2 size={16} width={16} height={16} className="hs-spin" aria-hidden="true" />
                    <span>Loading suggestions...</span>
                  </div>
                )}
                {!suggestLoading && !hasSuggestions && (
                  <div className="hs-suggest-state">No suggestions</div>
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
                            <Icon size={14} width={14} height={14} aria-hidden="true" />
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
              <label className="hs-sr-only" id={`${uid}-cat-label`} htmlFor={`${uid}-cat-trigger`}>
                Category
              </label>
              <input type="hidden" name={CATEGORY_PARAM} value={category.slug !== "all" ? category.slug : ""} />
              <button
                id={`${uid}-cat-trigger`}
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
                <Tag size={16} width={16} height={16} className="hs-trigger-icon" aria-hidden="true" />
                <span className="hs-trigger-text">{category.name}</span>
                <ChevronDown size={16} width={16} height={16} className="hs-trigger-caret" aria-hidden="true" />
              </button>
              {catOpen && (
                <div className="hs-dropdown-panel">
                  <div className="hs-dropdown-search">
                    <Search size={14} width={14} height={14} aria-hidden="true" />
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
                    {categoriesLoading && <li className="hs-dropdown-empty">Loading categories...</li>}
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
            <label className="hs-sr-only" id={`${uid}-loc-label`} htmlFor={`${uid}-loc-trigger`}>
              Location
            </label>
            <input type="hidden" name={LOCATION_PARAM} value={location.value !== "all-india" ? location.value : ""} />
            <button
              id={`${uid}-loc-trigger`}
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
              <MapPin size={16} width={16} height={16} className="hs-trigger-icon" aria-hidden="true" />
              <span className="hs-trigger-text">{location.label}</span>
              <ChevronDown size={16} width={16} height={16} className="hs-trigger-caret" aria-hidden="true" />
            </button>
            {locOpen && (
              <div className="hs-dropdown-panel">
                <div className="hs-dropdown-search">
                  <Search size={14} width={14} height={14} aria-hidden="true" />
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

          <button type="submit" className="hs-submit" aria-label="Search">
            <Search size={18} width={18} height={18} aria-hidden="true" />
            <span>Search</span>
          </button>
        </div>
      </form>

      <div className="hs-popular">
        <span className="hs-popular-label">Popular:</span>
        <ul className="hs-popular-chips" aria-label="Popular searches">
          {POPULAR_SEARCHES.map((term) => (
            <li key={term}>
              <Link className="hs-chip" href={buildSearchUrl("products", { search: term })}>
                {term}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export default function SearchBar() {
  return (
    <Suspense
      fallback={
        <div className="hero-search-card hs-root adv-search" aria-hidden="true">
          <div className="hs-form" style={{ minHeight: 132 }} />
        </div>
      }
    >
      <SearchBarInner />
    </Suspense>
  );
}
