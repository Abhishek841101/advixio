export const SEARCH_PARAM = "search";
export const CATEGORY_PARAM = "category";
export const LOCATION_PARAM = "location";
export const PAGE_PARAM = "page";
export const SORT_PARAM = "sort";

export const SEARCH_MAX_LENGTH = 100;
export const DEFAULT_LOCATION = "All India";

export type SearchTab = "products" | "suppliers" | "services";

export type SearchFilters = {
  search?: string;
  category?: string;
  location?: string;
  page?: number | string;
  sort?: string;
};

export const SEARCH_TABS: Array<{
  id: SearchTab | "requirement";
  label: string;
  placeholder: string;
  type: "search" | "navigate";
  href?: string;
}> = [
  {
    id: "products",
    label: "Products",
    placeholder: "Search products, suppliers or services...",
    type: "search",
  },
  {
    id: "suppliers",
    label: "Suppliers",
    placeholder: "Search suppliers or companies...",
    type: "search",
  },
  {
    id: "services",
    label: "Services",
    placeholder: "Search services...",
    type: "search",
  },
  {
    id: "requirement",
    label: "Post Buy Requirement",
    placeholder: "",
    type: "navigate",
    href: "/requirements",
  },
];

// Popular search chips: static fallback. Replace with a dynamic endpoint later if one exists.
export const POPULAR_SEARCHES = [
  "Industrial Machinery",
  "Auto Parts",
  "Electrical Components",
  "Packaging Materials",
  "Safety Equipment",
  "Pumps & Valves",
] as const;

export function normalizeSearchKeyword(value: string | null | undefined): string {
  return String(value ?? "").trim().slice(0, SEARCH_MAX_LENGTH);
}

export function normalizeLocationValue(value: string | null | undefined): string {
  const v = String(value ?? "").trim();
  if (!v || v.toLowerCase() === "all india") return "";
  return v;
}

export function normalizeCategoryValue(value: string | null | undefined): string {
  return String(value ?? "").trim();
}

export function buildSearchUrl(tab: SearchTab, filters: SearchFilters = {}): string {
  const params = new URLSearchParams();
  const search = normalizeSearchKeyword(filters.search);
  const category = normalizeCategoryValue(filters.category);
  const location = normalizeLocationValue(filters.location);
  const page = Number(filters.page);
  const sort = String(filters.sort ?? "").trim();

  if (search) params.set(SEARCH_PARAM, search);

  if (tab !== "suppliers" && category && category !== "all") {
    params.set(CATEGORY_PARAM, category);
  }

  if (location) params.set(LOCATION_PARAM, location);

  if (Number.isFinite(page) && page > 1) {
    params.set(PAGE_PARAM, String(Math.floor(page)));
  }

  if (sort) params.set(SORT_PARAM, sort);

  const qs = params.toString();
  const base =
    tab === "products" ? "/products" : tab === "suppliers" ? "/suppliers" : "/services";
  return qs ? `${base}?${qs}` : base;
}