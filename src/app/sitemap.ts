import type { MetadataRoute } from "next";

const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://advixio360.com"
).replace(/\/+$/, "");

const API_URL = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"
).replace(/\/+$/, "");

type SupplierRef = {
  slug?: string;
  companyName?: string;
  name?: string;
  _id?: string;
  id?: string;
};

type SitemapItem = {
  slug?: string;
  _id?: string;
  id?: string;
  updatedAt?: string;
  createdAt?: string;
  isActive?: boolean;
  status?: string;
  published?: boolean;
  isPublished?: boolean;

  // Product ke supplier ki information
  supplier?: SupplierRef | string | null;
  seller?: SupplierRef | string | null;
  supplierSlug?: string;
  sellerSlug?: string;
};

function getLastModified(item?: SitemapItem): Date {
  const value = item?.updatedAt || item?.createdAt;

  if (value) {
    const date = new Date(value);
    if (!Number.isNaN(date.getTime())) return date;
  }

  return new Date();
}

function isPublicItem(item: SitemapItem): boolean {
  if (item.isActive === false) return false;
  if (item.published === false) return false;
  if (item.isPublished === false) return false;

  if (
    typeof item.status === "string" &&
    ["draft", "inactive", "deleted", "rejected", "pending"].includes(
      item.status.toLowerCase()
    )
  ) {
    return false;
  }

  return true;
}

function extractItems(result: unknown): SitemapItem[] {
  if (Array.isArray(result)) return result as SitemapItem[];
  if (!result || typeof result !== "object") return [];

  const data = result as Record<string, unknown>;

  for (const key of ["products", "categories", "suppliers", "items"]) {
    if (Array.isArray(data[key])) return data[key] as SitemapItem[];
  }

  if (Array.isArray(data.data)) return data.data as SitemapItem[];

  if (data.data && typeof data.data === "object") {
    const nested = data.data as Record<string, unknown>;

    for (const key of ["products", "categories", "suppliers", "items"]) {
      if (Array.isArray(nested[key])) {
        return nested[key] as SitemapItem[];
      }
    }
  }

  return [];
}

async function fetchItems(endpoint: string): Promise<SitemapItem[]> {
  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      console.error(
        `Sitemap fetch failed: ${endpoint} (HTTP ${response.status})`
      );
      return [];
    }

    const result: unknown = await response.json();

    return extractItems(result).filter(
      (item) =>
        typeof item.slug === "string" &&
        item.slug.trim().length > 0 &&
        isPublicItem(item)
    );
  } catch (error) {
    console.error(`Sitemap fetch error: ${endpoint}`, error);
    return [];
  }
}


function makeSlug(value: string): string {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function getSupplierSlug(product: SitemapItem): string | undefined {
  if (typeof product.supplierSlug === "string" && product.supplierSlug.trim()) {
    return product.supplierSlug.trim();
  }

  if (typeof product.sellerSlug === "string" && product.sellerSlug.trim()) {
    return product.sellerSlug.trim();
  }

  for (const key of ["supplier", "seller"] as const) {
    const value = product[key];

    if (value && typeof value === "object") {
      const seller = value as SupplierRef;

      if (seller.slug?.trim()) return seller.slug.trim();

      const companyName = seller.companyName?.trim();
      if (companyName) return makeSlug(companyName);

      if (seller.name?.trim()) return makeSlug(seller.name);
    }
  }

  return undefined;
}


export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticRoutes = [
    { route: "", priority: 1 },
    { route: "/products", priority: 0.9 },
    { route: "/categories", priority: 0.8 },
    { route: "/suppliers", priority: 0.8 },
    { route: "/about", priority: 0.5 },
    { route: "/contact", priority: 0.5 },
  ];

  const staticPages: MetadataRoute.Sitemap = staticRoutes.map(
    ({ route, priority }) => ({
      url: `${SITE_URL}${route}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority,
    })
  );

  const [products, categories, suppliers] = await Promise.all([
    fetchItems("/products"),
    fetchItems("/categories"),
    fetchItems("/suppliers"),
  ]);

  const productPages: MetadataRoute.Sitemap = products.map((product) => ({
    url: `${SITE_URL}/products/${encodeURIComponent(product.slug!)}`,
    lastModified: getLastModified(product),
    changeFrequency: "daily",
    priority: 0.8,
  }));

  const categoryPages: MetadataRoute.Sitemap = categories.map((category) => ({
    url: `${SITE_URL}/categories/${encodeURIComponent(category.slug!)}`,
    lastModified: getLastModified(category),
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  const supplierPages: MetadataRoute.Sitemap = suppliers.map((supplier) => ({
    url: `${SITE_URL}/suppliers/${encodeURIComponent(supplier.slug!)}`,
    lastModified: getLastModified(supplier),
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  // Product ke saath supplier slug available ho tabhi nested URL banao.
  const nestedSupplierPages: MetadataRoute.Sitemap = products.flatMap(
    (product) => {
      const supplierSlug = getSupplierSlug(product);

      if (!supplierSlug || !product.slug) return [];

      return [
        {
          url: `${SITE_URL}/products/${encodeURIComponent(
            product.slug
          )}/supplier/${encodeURIComponent(supplierSlug)}`,
          lastModified: getLastModified(product),
          changeFrequency: "weekly" as const,
          priority: 0.5,
        },
      ];
    }
  );

  const allPages = [
    ...staticPages,
    ...productPages,
    ...categoryPages,
    ...supplierPages,
    ...nestedSupplierPages,
  ];

  return Array.from(
    new Map(allPages.map((page) => [page.url, page])).values()
  );
}