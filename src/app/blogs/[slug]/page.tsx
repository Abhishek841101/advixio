import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import DOMPurify from "isomorphic-dompurify";
import ArticleActions from "./ArticleActions";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const API_URL = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"
).replace(/\/$/, "");

type BlogImage = { url: string; publicId?: string; alt?: string };
type Blog = {
  _id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  category?: string;
  tags?: string[];
  coverImage?: BlogImage;
  images?: BlogImage[];
  video?: { url?: string; duration?: number; format?: string };
  author?: string;
  status?: string;
  publishedAt?: string;
  createdAt?: string;
  updatedAt?: string;
  seo?: { metaTitle?: string; metaDescription?: string; keywords?: string[] };
  views?: number;
};
type ApiResponse = { success?: boolean; data?: Blog | { blog?: Blog }; message?: string };
type BlogsResponse = { success?: boolean; data?: Blog[]; message?: string };
type Product = {
  _id: string;
  name: string;
  slug: string;
  shortDescription?: string;
  description?: string;
  category?: { _id?: string; name?: string; slug?: string } | null;
  brand?: string;
  model?: string;
  price?: number;
  unit?: string;
  images?: string[];
  seller?: { name?: string; companyName?: string } | null;
  companyName?: string;
  location?: { city?: string; state?: string; country?: string };
};
type ProductsResponse = { success?: boolean; data?: Product[]; message?: string };
type PageProps = { params: Promise<{ slug: string }> };
type TocItem = { id: string; title: string };

async function getBlog(slug: string): Promise<Blog | null> {
  try {
    const response = await fetch(
      `${API_URL}/blogs/slug/${encodeURIComponent(slug)}`,
      { next: { revalidate: 60 } }
    );
    if (!response.ok) return null;
    const result: ApiResponse = await response.json();
    if (result.success === false || !result.data) return null;
    const data = result.data;
    const blog = "blog" in data && data.blog ? data.blog : (data as Blog);
    return blog?.slug ? blog : null;
  } catch (error) {
    console.error("Unable to fetch blog:", error);
    return null;
  }
}

async function getPublishedBlogs(): Promise<Blog[]> {
  try {
    const response = await fetch(`${API_URL}/blogs?page=1&limit=100`, {
      next: { revalidate: 60 },
    });
    if (!response.ok) return [];
    const result: BlogsResponse = await response.json();
    if (result.success === false || !Array.isArray(result.data)) return [];
    return result.data.filter((item) => item?.title && item?.slug && item.status === "published");
  } catch (error) {
    console.error("Unable to fetch related blogs:", error);
    return [];
  }
}

async function getProducts(): Promise<Product[]> {
  try {
    const response = await fetch(`${API_URL}/products`, {
      next: { revalidate: 60 },
    });
    if (!response.ok) return [];
    const result: ProductsResponse = await response.json();
    if (result.success === false || !Array.isArray(result.data)) return [];
    return result.data.filter((item) => item?._id && item.name && item.slug);
  } catch (error) {
    console.error("Unable to fetch marketplace products:", error);
    return [];
  }
}

function formatPrice(price?: number, unit?: string) {
  if (typeof price !== "number" || !Number.isFinite(price) || price <= 0) {
    return "Contact for price";
  }
  const formatted = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(price);
  return unit ? `${formatted} / ${unit}` : formatted;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const blog = await getBlog(slug);
  if (!blog) return { title: "Blog Not Found | Advixio360", robots: { index: false } };

  const title = blog.seo?.metaTitle || blog.title;
  const description = blog.seo?.metaDescription || blog.excerpt || `${blog.title} — Advixio360`;
  const canonical = `https://advixio360.com/blogs/${blog.slug}`;

  return {
    title: `${title} | Advixio360`,
    description,
    keywords: blog.seo?.keywords?.length ? blog.seo.keywords : blog.tags,
    alternates: { canonical },
    robots: { index: blog.status === "published", follow: true },
    openGraph: {
      title, description, url: canonical, type: "article", siteName: "Advixio360",
      publishedTime: blog.publishedAt || blog.createdAt,
      images: blog.coverImage?.url ? [{ url: blog.coverImage.url, alt: blog.coverImage.alt || blog.title }] : [],
    },
    twitter: {
      card: "summary_large_image", title, description,
      images: blog.coverImage?.url ? [blog.coverImage.url] : [],
    },
  };
}

function formatDate(date?: string) {
  if (!date) return "";
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return "";
  return new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "long", year: "numeric" }).format(parsed);
}

function escapeHtml(value: string) {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}

function markdownInline(value: string): string {
  let text = escapeHtml(value);

  // Inline code first, so its contents are not parsed as formatting.
  const codeParts: string[] = [];
  text = text.replace(/`([^`]+)`/g, (_match, code) => {
    const token = `@@CODE${codeParts.length}@@`;
    codeParts.push(`<code>${code}</code>`);
    return token;
  });

  text = text
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/__(.+?)__/g, "<strong>$1</strong>")
    .replace(/(^|[^*])\*([^*]+)\*(?!\*)/g, "$1<em>$2</em>")
    .replace(/(^|[^_])_([^_]+)_(?!_)/g, "$1<em>$2</em>")
    .replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');

  codeParts.forEach((code, index) => {
    text = text.replace(`@@CODE${index}@@`, code);
  });

  return text;
}

function markdownToHtml(markdown: string): string {
  const lines = markdown.replace(/\r\n?/g, "\n").split("\n");
  const output: string[] = [];
  let paragraph: string[] = [];
  let listType: "ul" | "ol" | null = null;
  let codeLines: string[] | null = null;

  const flushParagraph = () => {
    if (paragraph.length) {
      output.push(`<p>${markdownInline(paragraph.join(" "))}</p>`);
      paragraph = [];
    }
  };

  const closeList = () => {
    if (listType) {
      output.push(`</${listType}>`);
      listType = null;
    }
  };

  for (const rawLine of lines) {
    const line = rawLine.trim();

    if (codeLines) {
      if (/^```/.test(line)) {
        output.push(`<pre><code>${escapeHtml(codeLines.join("\n"))}</code></pre>`);
        codeLines = null;
      } else {
        codeLines.push(rawLine);
      }
      continue;
    }

    if (/^```/.test(line)) {
      flushParagraph();
      closeList();
      codeLines = [];
      continue;
    }

    if (!line) {
      flushParagraph();
      closeList();
      continue;
    }

    const heading = line.match(/^(#{1,6})\s+(.+)$/);
    if (heading) {
      flushParagraph();
      closeList();
      const level = heading[1].length;
 const headingText = heading[2];
const numberedHeading = headingText.match(/^(\d+)\.\s+(.+)$/);

if (numberedHeading) {
  output.push(`
    <h${level} class="article-numbered-heading">
      <span class="heading-number">${numberedHeading[1]}.</span>
      <span>${markdownInline(numberedHeading[2])}</span>
    </h${level}>
  `);
} else {
  output.push(`<h${level}>${markdownInline(headingText)}</h${level}>`);
}     
      continue;
    }

    if (/^([-*_])(?:\s*\1){2,}$/.test(line)) {
      flushParagraph();
      closeList();
      output.push("<hr />");
      continue;
    }

    if (/^>\s?/.test(line)) {
      flushParagraph();
      closeList();
      output.push(`<blockquote><p>${markdownInline(line.replace(/^>\s?/, ""))}</p></blockquote>`);
      continue;
    }

    const unordered = line.match(/^[-*+]\s+(.+)$/);
    const ordered = line.match(/^\d+[.)]\s+(.+)$/);

    if (unordered || ordered) {
      flushParagraph();
      const nextType = unordered ? "ul" : "ol";
      if (listType !== nextType) {
        closeList();
        output.push(`<${nextType}>`);
        listType = nextType;
      }
      output.push(`<li>${markdownInline((unordered || ordered)![1])}</li>`);
      continue;
    }

    closeList();
    paragraph.push(line);
  }

  flushParagraph();
  closeList();

  if (codeLines) {
    output.push(`<pre><code>${escapeHtml(codeLines.join("\n"))}</code></pre>`);
  }

  return output.join("\n");
}
function prepareArticle(raw: string): { html: string; toc: TocItem[] } {
  let content = (raw || "").trim();
  if (!content) return { html: "", toc: [] };

  // Decode HTML entities only when the saved content is HTML-encoded.
  if (/&lt;\s*(h[1-6]|p|div|ul|ol|li|blockquote|strong|em|img|video|table)\b/i.test(content)) {
    content = content
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"')
      .replace(/&#39;|&apos;/g, "'");
  }

  content = content.replace(/\\(?=<\/?[a-z][^>]*>)/gi, "");

  // Convert Markdown (headings, bold text, bullets, numbered lists, etc.)
  // instead of displaying Markdown symbols literally in the article.
  if (!/<\/?[a-z][^>]*>/i.test(content)) {
    content = markdownToHtml(content);
  }

  const toc: TocItem[] = [];
  let headingIndex = 0;

  content = content.replace(/<h2([^>]*)>([\s\S]*?)<\/h2>/gi, (_match, attrs, inner) => {
    const plain = inner.replace(/<[^>]*>/g, "").replace(/&nbsp;/g, " ").trim();
    const existingId = attrs.match(/\bid=["']([^"']+)["']/i)?.[1];
    const id = existingId || `article-section-${++headingIndex}`;
    toc.push({ id, title: plain });
    const cleanAttrs = attrs.replace(/\s+id=["'][^"']*["']/i, "");
    return `<h2${cleanAttrs} id="${id}">${inner}</h2>`;
  });

  const safe = DOMPurify.sanitize(content, {
    USE_PROFILES: { html: true },
    ADD_TAGS: ["iframe"],
    ADD_ATTR: [
      "allow",
      "allowfullscreen",
      "frameborder",
      "loading",
      "referrerpolicy",
      "sandbox",
      "target",
      "rel",
    ],
  });

  return { html: safe, toc };
}


export default async function BlogDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const [blog, allBlogs, products] = await Promise.all([
    getBlog(slug),
    getPublishedBlogs(),
    getProducts(),
  ]);
  if (!blog || blog.status !== "published") notFound();

  const relatedBlogs = allBlogs.filter((item) => item.slug !== blog.slug).slice(0, 3);
  const categoryCounts = allBlogs.reduce<Record<string, number>>((acc, item) => {
    const category = item.category?.trim();
    if (category) acc[category] = (acc[category] || 0) + 1;
    return acc;
  }, {});
  const categories = Object.entries(categoryCounts).sort((a, b) => b[1] - a[1]).slice(0, 6);

  const publishedDate = formatDate(blog.publishedAt || blog.createdAt);
  const { html: articleHtml, toc } = prepareArticle(blog.content || "");
  const author = blog.author || "Advixio360 Editorial Team";
  const heroImage = blog.coverImage?.url || blog.images?.[0]?.url;
  const readMinutes = Math.max(1, Math.ceil((blog.content || "").replace(/<[^>]*>/g, " ").split(/\s+/).filter(Boolean).length / 200));

  return (
    <div className="blog-reading-page">
      <Navbar />



      <main>
        <div className="container breadcrumbs">
          <Link href="/">Home</Link><span>›</span><Link href="/blogs">Resources</Link>
          <span>›</span>{blog.category || "Insights"}<span>›</span>{blog.title}
        </div>

        <div className="container reading-page-grid">
          <main className="reading-main">
            <section className="container article-hero-layout">
              <div className="article-head">
                <div className="eyebrow">{blog.category || "Business Insights"}</div>
                <h1>{blog.title}</h1>
                {blog.excerpt && <p className="dek">{blog.excerpt}</p>}
                <div className="byline">
                  <div className="author-mini"><span className="avatar">A360</span><span>{author}</span></div>
                  {publishedDate && <><span className="meta-dot" /><span>Updated {publishedDate}</span></>}
                  <span className="meta-dot" /><span>{readMinutes} min read</span>
                </div>
                <ArticleActions title={blog.title} />
              </div>

              {heroImage && (
                <div className="hero-image-panel">
                  <div className="hero-image-frame">
                    <Image src={heroImage} alt={blog.coverImage?.alt || blog.title} fill priority unoptimized sizes="(max-width: 850px) 100vw, 55vw" />
                    <div className="hero-image-caption">
                      <span className="caption-mark">A360</span>
                      <span><strong>Source smarter. Buy confidently.</strong><small>Practical advice for business buyers</small></span>
                    </div>
                  </div>
                  <div className="hero-image-accent" />
                </div>
              )}
            </section>

            <section className="article-layout-inner">
              <article className="article-content">
                {articleHtml ? (
                  <div className="article-html" dangerouslySetInnerHTML={{ __html: articleHtml }} />
                ) : (
                  <p>Article content is not available.</p>
                )}
                {blog.tags?.length ? <div className="tags">{blog.tags.map((tag) => <span className="tag" key={tag}>{tag}</span>)}</div> : null}
                <div className="author-card">
                  <div className="author-large">A360</div>
                  <div><h3>{author}</h3><p>Practical resources to help businesses discover products, evaluate suppliers and make informed B2B decisions.</p></div>
                </div>
              </article>
            </section>
          </main>

          <aside className="sidebar">
            <section className="side-card listing-cta">
              <div className="listing-cta-icon">▣</div>
              <div className="listing-kicker">For businesses & suppliers</div>
              <h3>List Your Products on Advixio360</h3>
              <p>Showcase your products, reach more business buyers and grow your visibility on the marketplace.</p>
              <Link href="/auth/register">Start Product Listing <span>→</span></Link>
              <div className="listing-trust"><span>✓</span> Build your digital product catalogue</div>
            </section>

            <section className="side-card">
              <h3 className="side-title"><span className="side-heading-icon">▦</span> Browse Categories</h3>
              <div className="category-links">
                {categories.length ? categories.map(([name, count], index) => (
                  <Link className="category-link" href={`/blogs?category=${encodeURIComponent(name)}`} key={name}>
                    <span className="category-icon">{["◇", "▤", "⌂", "▣", "▥", "▧"][index % 6]}</span>
                    <span className="category-name">{name}</span><span className="category-count">{count}</span>
                  </Link>
                )) : <p className="toc-empty">No blog categories available yet.</p>}
              </div>
              <Link className="all-categories" href="/categories">View all categories <span>→</span></Link>
            </section>

            <section className="side-card product-side-card">
              <div className="product-side-head"><h3 className="side-title"><span className="side-heading-icon">◇</span> Products You May Need</h3><Link href="/products">View all</Link></div>
              <div className="product-grid">
                {products.slice(0, 4).map((product) => {
                  const imageUrl = product.images?.find((image) => typeof image === "string" && image.trim());
                  const supplier = product.seller?.companyName || product.companyName || product.seller?.name;
                  return (
                    <Link className="product-card-mini" href={`/products/${product.slug}`} key={product._id}>
                      {imageUrl ? (
                        <img src={imageUrl} alt={product.name} loading="lazy" />
                      ) : (
                        <div className="product-image-placeholder">Advixio360</div>
                      )}
                      <span className="product-card-body">
                        <strong>{product.name}</strong>
                        <b>{formatPrice(product.price, product.unit)}</b>
                        <small className="product-supplier-name">
                          {supplier || product.category?.name || "Marketplace product"}
                        </small>
                        <em>View product <span>→</span></em>
                      </span>
                    </Link>
                  );
                })}
                {!products.length && (
                  <p className="toc-empty">No published marketplace products are available right now.</p>
                )}
              </div>
              <p className="product-disclaimer">Products shown are loaded from the Advixio360 marketplace.</p>
            </section>

            <section className="side-card">
              <h3 className="side-title"><span className="side-heading-icon">☷</span> In This Article</h3>
              <nav className="toc-list">
                {toc.length ? toc.map((item) => <a href={`#${item.id}`} key={item.id}>{item.title}</a>) : <span className="toc-empty">Article sections will appear here.</span>}
              </nav>
            </section>
          </aside>
        </div>

        <section className="related-section">
          <div className="container">
            <div className="section-head"><div><div className="section-kicker">Continue learning</div><h2>More insights for smarter business</h2></div><p>Practical insights for growing businesses</p></div>
            <div className="related-grid">
              {relatedBlogs.map((item) => (
                <Link className="related-card" href={`/blogs/${item.slug}`} key={item.slug}>
                  {item.coverImage?.url ? <img src={item.coverImage.url} alt={item.coverImage.alt || item.title} loading="lazy" /> : <div className="related-image-placeholder">Advixio360</div>}
                  <div className="related-body"><small>{item.category || "Business Insights"}</small><h3>{item.title}</h3><p>{item.excerpt || "Read this published article for more business insights."}</p><span className="read-link">Read article →</span></div>
                </Link>
              ))}
              {!relatedBlogs.length && <p className="toc-empty">No other published articles are available yet.</p>}
            </div>
          </div>
        </section>

        <section className="newsletter">
          <div className="container newsletter-inner">
            <div><h2>Useful business insights, delivered simply.</h2><p>Explore practical buying guides and marketplace updates from Advixio360.</p></div>
            <Link className="newsletter-link" href="/blogs">Explore Insights</Link>
          </div>
        </section>
      </main>

      <Footer />

      <style>{`
      :root{
  --navy:#10233f;--navy-2:#18375b;--blue:#1769ff;--blue-dark:#0c4bc4;
  --cyan:#19b6c9;--cyan-soft:#e9f9fb;--sky:#eef5ff;--gold:#f4b544;
  --ink:#182437;--muted:#64748b;--line:#e4eaf1;--paper:#ffffff;--page:#f5f8fc;
  --green:#17845d;--shadow:0 12px 34px rgba(16,35,63,.08);--radius:18px;
}
.blog-reading-page *{box-sizing:border-box}
.blog-reading-page{scroll-behavior:smooth;scroll-padding-top:100px}
.blog-reading-page{margin:0;background:var(--page);color:var(--ink);font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;line-height:1.7}
.blog-reading-page a{color:inherit;text-decoration:none}
.blog-reading-page button,.blog-reading-page input{font:inherit}
.blog-reading-page .container{width:min(1200px,calc(100% - 40px));margin:auto}
.breadcrumbs{padding:24px 0 12px;color:#7b899c;font-size:12px;font-weight:600}
.breadcrumbs a{color:#52657e}.breadcrumbs span{margin:0 8px;color:#a8b3c1}
.article-head{max-width:920px;margin:0 auto;padding:10px 0 26px;text-align:center}
.eyebrow{display:inline-flex;align-items:center;gap:8px;color:var(--blue);background:#eaf1ff;border:1px solid #d7e5ff;padding:6px 11px;border-radius:99px;text-transform:uppercase;letter-spacing:1.2px;font-size:10px;font-weight:850}
.eyebrow:before{content:"";width:6px;height:6px;border-radius:50%;background:var(--cyan)}
.blog-reading-page h1{font-size:clamp(32px,4.3vw,54px);line-height:1.12;letter-spacing:-1.8px;color:var(--navy);margin:19px auto 16px;max-width:900px;font-weight:850}
.dek{max-width:760px;margin:0 auto;color:#5b6b80;font-size:16px;line-height:1.75}
.byline{display:flex;justify-content:center;align-items:center;flex-wrap:wrap;gap:13px;margin-top:22px;color:#64748b;font-size:12px}
.author-mini{display:flex;align-items:center;gap:8px;color:var(--navy);font-weight:800}
.avatar{width:32px;height:32px;display:grid;place-items:center;border-radius:50%;background:linear-gradient(135deg,#dcecff,#bdeff0);color:#164b88;font-size:11px;font-weight:900}
.meta-dot{width:4px;height:4px;border-radius:50%;background:#b4c0ce}
.featured-wrap{max-width:1040px;margin:0 auto 34px}
.featured-image{position:relative;overflow:hidden;border-radius:22px;background:#dbe8f6;box-shadow:var(--shadow);aspect-ratio:16/7}
.featured-image img{width:100%;height:100%;object-fit:cover;display:block}
.image-label{position:absolute;left:18px;bottom:18px;padding:8px 12px;border-radius:10px;background:rgba(16,35,63,.82);color:#fff;font-size:11px;font-weight:750;backdrop-filter:blur(8px)}
.article-toolbar{display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap;margin:18px 0 0}
.toolbar-left,.toolbar-right{display:flex;align-items:center;gap:9px;flex-wrap:wrap}
.reading-pill{display:flex;align-items:center;gap:7px;color:#607087;font-size:12px;font-weight:700}
.action-btn{display:inline-flex;align-items:center;gap:8px;border:1px solid var(--line);background:#fff;color:#41516a;padding:9px 12px;border-radius:10px;font-size:12px;font-weight:750;cursor:pointer;transition:.2s}
.action-btn:hover{border-color:#a9c7ff;color:var(--blue);transform:translateY(-1px)}
.action-btn.liked{background:#fff0f2;border-color:#ffd0d8;color:#d92d53}
.article-layout{display:grid;grid-template-columns:310px minmax(0,1fr);gap:28px;align-items:start;padding-bottom:56px}
.article-content{min-width:0;background:#fff;border:1px solid var(--line);border-radius:var(--radius);padding:clamp(24px,4vw,46px);box-shadow:0 4px 18px rgba(16,35,63,.025)}
.article-content p{font-size:15px;color:#43536a;margin:0 0 19px}
.article-content h2{font-size:27px;line-height:1.25;letter-spacing:-.7px;color:var(--navy);margin:42px 0 16px;scroll-margin-top:100px}
.article-content h3{font-size:18px;color:var(--navy);margin:25px 0 9px;line-height:1.4}
.article-content ul,.article-content ol{padding-left:22px;margin:0 0 22px;color:#43536a;font-size:14px}
.article-content li{padding-left:4px;margin:8px 0}
.lead{font-size:17px!important;color:#334760!important;line-height:1.85}
.note-card{display:flex;gap:15px;background:linear-gradient(110deg,#edf5ff,#f0fbfc);border:1px solid #d8e9f8;border-radius:15px;padding:19px;margin:26px 0}
.note-icon{width:38px;height:38px;flex:0 0 38px;border-radius:12px;display:grid;place-items:center;background:#fff;color:var(--blue);border:1px solid #d8e7fb;font-weight:900;font-size:18px}
.note-card strong{display:block;color:var(--navy);font-size:14px;margin-bottom:4px}
.note-card p{font-size:13px;margin:0;color:#52657d}
.checklist{list-style:none!important;padding:0!important;display:grid;gap:10px}
.checklist li{display:flex;align-items:flex-start;gap:11px;padding:12px;border:1px solid #e6edf5;border-radius:11px;margin:0;background:#fbfdff}
.checklist input{accent-color:var(--blue);margin-top:6px;width:16px;height:16px;flex:0 0 16px}
.inline-photo{margin:28px 0;border-radius:16px;overflow:hidden;background:#e6edf6}
.inline-photo img{display:block;width:100%;aspect-ratio:16/7;object-fit:cover}
.inline-photo figcaption{padding:10px 14px;background:#f7faff;color:#718096;font-size:11px}
.comparison-table-wrap{overflow-x:auto;margin:22px 0}
.comparison-table{width:100%;border-collapse:collapse;font-size:12px;min-width:500px}
.comparison-table th{background:var(--navy);color:#fff;text-align:left;padding:13px}
.comparison-table td{padding:12px;border:1px solid var(--line);color:#47566c}
.comparison-table tr:nth-child(even) td{background:#f7faff}
.tags{display:flex;flex-wrap:wrap;gap:8px;margin:28px 0 8px}
.tag{background:#f1f6fc;color:#52657b;border:1px solid #e2eaf3;border-radius:7px;padding:6px 10px;font-size:11px;font-weight:750}
.article-feedback{margin-top:32px;padding:22px;border:1px solid #dce8f5;border-radius:15px;background:#f8fbff;text-align:center}
.article-feedback h3{margin:0 0 4px;font-size:17px}
.article-feedback p{font-size:12px;margin-bottom:13px}
.feedback-actions{display:flex;justify-content:center;gap:9px;flex-wrap:wrap}
.feedback-actions button{border:1px solid #dbe5f0;background:#fff;border-radius:9px;padding:8px 13px;color:#3d526b;font-size:12px;font-weight:750;cursor:pointer}
.feedback-actions button.selected{border-color:var(--blue);background:#eaf1ff;color:var(--blue)}
.author-card{display:flex;gap:15px;align-items:center;border-top:1px solid var(--line);margin-top:30px;padding-top:24px}
.author-large{width:54px;height:54px;flex:0 0 54px;border-radius:17px;display:grid;place-items:center;background:linear-gradient(135deg,#cfe5ff,#b8f0ed);color:#164b88;font-weight:900;font-size:15px}
.author-card h3{margin:0 0 2px;font-size:15px}
.author-card p{margin:0;font-size:12px}
.sidebar{display:grid;gap:18px;position:sticky;top:94px;align-self:start;max-height:calc(100vh - 108px);overflow-y:auto;overscroll-behavior:contain;padding:0 5px 10px 0;scrollbar-width:thin;scrollbar-color:#c7d7ec transparent}
.side-card{background:#fff;border:1px solid var(--line);border-radius:16px;padding:21px;box-shadow:0 4px 18px rgba(16,35,63,.025)}
.side-title{font-size:15px;font-weight:850;color:var(--navy);margin:0 0 16px;display:flex;align-items:center;gap:9px}
.side-title:before{content:"";width:4px;height:18px;background:var(--cyan);border-radius:8px}
.toc-list{display:grid;gap:3px}
.toc-list a{padding:8px 10px;border-radius:8px;color:#617189;font-size:12px;line-height:1.45;border-left:2px solid transparent}
.toc-list a:hover,.toc-list a.active{background:#edf4ff;color:var(--blue);border-left-color:var(--blue);font-weight:800}
.side-article{display:grid;grid-template-columns:76px 1fr;gap:11px;margin:13px 0;align-items:center}
.side-article img{width:76px;height:68px;object-fit:cover;border-radius:10px;background:#e7eef8}
.side-article small{display:block;color:var(--blue);font-size:9px;font-weight:850;text-transform:uppercase;letter-spacing:.7px}
.side-article a{display:block;font-size:12px;line-height:1.45;font-weight:800;color:#26384f;margin-top:3px}
.side-article a:hover{color:var(--blue)}
.category-links{display:grid;gap:8px}
.category-link{display:flex;align-items:center;justify-content:space-between;gap:10px;padding:10px 11px;background:#f7faff;border:1px solid #eaf0f7;border-radius:10px;color:#465a72;font-size:12px;font-weight:750}
.category-link span:last-child{color:#8a9bb0}
.supplier-card{position:relative;overflow:hidden;background:linear-gradient(145deg,#10233f,#164b79);color:#fff;border:0}
.supplier-card:after{content:"";position:absolute;width:150px;height:150px;border-radius:50%;background:#19b6c933;right:-65px;top:-55px}
.supplier-card .side-title{color:#fff;position:relative;z-index:1}
.supplier-card .side-title:before{background:var(--gold)}
.supplier-card p{position:relative;z-index:1;color:#d4e1f2;font-size:12px;margin:0 0 16px}
.supplier-card a{position:relative;z-index:1;display:inline-flex;background:#fff;color:var(--navy);font-size:11px;font-weight:850;padding:10px 12px;border-radius:9px}
.related-section{padding:48px 0 58px;background:#fff;border-top:1px solid var(--line)}
.section-head{display:flex;align-items:end;justify-content:space-between;gap:16px;margin-bottom:22px}
.section-kicker{font-size:10px;color:var(--blue);font-weight:900;letter-spacing:1.5px;text-transform:uppercase}
.section-head h2{font-size:29px;line-height:1.2;color:var(--navy);letter-spacing:-.8px;margin:5px 0 0}
.section-head p{margin:0;color:#718096;font-size:12px}
.related-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:18px}
.related-card{border:1px solid var(--line);border-radius:15px;overflow:hidden;background:#fff;transition:.2s}
.related-card:hover{transform:translateY(-4px);box-shadow:var(--shadow);border-color:#c9dafa}
.related-card img{width:100%;height:170px;display:block;object-fit:cover;background:#e6eef8}.related-image-placeholder,.product-image-placeholder{display:flex;align-items:center;justify-content:center;background:linear-gradient(135deg,#eaf2ff,#d9f5f5);color:#1769ff;font-weight:900;min-height:170px}.product-image-placeholder{min-height:90px}
.related-body{padding:17px}
.related-body small{color:var(--blue);font-size:10px;font-weight:900;letter-spacing:.8px;text-transform:uppercase}
.related-body h3{font-size:16px;line-height:1.4;margin:7px 0;color:var(--navy)}
.related-body p{font-size:12px;color:#718096;margin:0 0 13px}
.read-link{color:var(--blue);font-size:11px;font-weight:850}
.newsletter{padding:42px 0;background:linear-gradient(110deg,#10233f,#173e66);color:#fff}
.newsletter-inner{display:flex;align-items:center;justify-content:space-between;gap:28px}
.newsletter h2{font-size:25px;line-height:1.25;letter-spacing:-.6px;margin:0 0 7px}
.newsletter p{margin:0;color:#c7d8eb;font-size:13px}
.newsletter-form{display:flex;gap:8px;width:min(440px,100%)}
.newsletter-form input{min-width:0;flex:1;border:1px solid #54708d;background:#ffffff12;border-radius:10px;padding:12px 14px;color:#fff;outline:none;font-size:12px}
.newsletter-form input::placeholder{color:#b9c9dc}
.newsletter-form button{border:0;border-radius:10px;background:var(--cyan);color:#08233d;font-size:12px;font-weight:900;padding:0 17px;cursor:pointer}
.faq-section{margin-top:44px;padding-top:28px;border-top:1px solid var(--line);scroll-margin-top:100px}
.faq-intro{display:flex;gap:16px;align-items:center;margin-bottom:21px}
.faq-symbol{width:58px;height:58px;flex:0 0 58px;display:grid;place-items:center;border-radius:17px;background:linear-gradient(145deg,#e5f0ff,#ddf8f6);border:1px solid #d3e7f5;color:var(--blue)}
.faq-symbol svg{width:29px;height:29px}
.faq-intro .mini-label{font-size:10px;color:var(--blue);letter-spacing:1.3px;font-weight:900;text-transform:uppercase}
.faq-intro h2{margin:3px 0 4px;font-size:26px;line-height:1.2}
.faq-intro p{font-size:12px;margin:0;color:#718096}
.faq-list{display:grid;gap:11px}
.faq-item{border:1px solid #e1eaf4;border-radius:14px;background:#fff;overflow:hidden;transition:.2s}
.faq-item[open]{border-color:#bdd7ff;box-shadow:0 8px 22px #1769ff0d}
.faq-item summary{display:grid;grid-template-columns:42px 1fr 30px;align-items:center;gap:13px;padding:15px 16px;list-style:none;cursor:pointer}
.faq-item summary::-webkit-details-marker{display:none}
.faq-icon{width:42px;height:42px;display:grid;place-items:center;background:#edf5ff;border:1px solid #dceaff;color:#1769ff;border-radius:12px}
.faq-icon svg{width:21px;height:21px;stroke:currentColor}
.faq-question{font-size:13px;line-height:1.45;font-weight:850;color:var(--navy)}
.faq-toggle{width:28px;height:28px;border-radius:9px;background:#f1f6fc;color:#506781;display:grid;place-items:center;font-size:18px;font-weight:500}
.faq-item[open] .faq-toggle{background:var(--blue);color:#fff}
.faq-answer{padding:0 22px 18px 71px}
.faq-answer p{font-size:13px;line-height:1.75;color:#596b81;margin:0}
.faq-item[open] .faq-icon{background:#e7fbfc;color:#087c8b;border-color:#c7f0f1}
.faq-footnote{display:flex;align-items:center;gap:10px;padding:13px 15px;margin-top:14px;background:#f4fafb;border:1px solid #d9eff0;border-radius:12px;color:#4f6b7b;font-size:11px}
.faq-footnote svg{width:20px;height:20px;flex:0 0 20px;color:#0c9ba7}


/* Desktop reading layout: sticky left marketplace sidebar, article on the right */
.article-head{text-align:left;max-width:none;margin:0;padding:18px 0 25px}
.article-head .blog-reading-page h1{max-width:900px;margin:16px 0 13px;font-size:clamp(34px,4vw,51px);line-height:1.1;color:#102f55}
.article-head .dek{max-width:850px;margin:0;color:#536780}
.article-head .byline{justify-content:flex-start}
.featured-wrap{max-width:none;margin:0 auto 30px}
.featured-image{aspect-ratio:16/6.5;border-radius:20px}
.article-toolbar{margin-top:14px}
.product-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}
.product-card{min-width:0;display:flex;flex-direction:column;overflow:hidden;border:1px solid #e2eaf4;border-radius:12px;background:#fff;transition:transform .2s,border-color .2s,box-shadow .2s}
.product-card:hover{transform:translateY(-3px);border-color:#b9d4ff;box-shadow:0 9px 20px #10233f10}
.product-card>img{width:100%;height:105px;object-fit:cover;background:#e8eff7;display:block}
.product-card-body{display:flex;flex-direction:column;align-items:flex-start;padding:10px;min-height:132px}
.product-card-body>strong{font-size:10px;line-height:1.45;color:#203650;min-height:29px}
.product-card-body .product-rating{margin:6px 0 4px}
.product-card-body>b{font-size:14px;color:#10233f;line-height:1.35}
.product-card-body>b small{font-size:9px;color:#8190a2;font-weight:600}
.product-card-body>em{display:flex;align-items:center;gap:4px;margin-top:7px;color:#1769ff;font-size:9px;font-style:normal;font-weight:900}
.product-card-body>em span{font-size:13px}
.product-supplier-name{display:block;margin-top:5px;color:#718096;font-size:9px;line-height:1.4;overflow-wrap:anywhere}


/* Article hero: left-aligned title and visual on the right */
.article-hero-layout{display:grid;grid-template-columns:minmax(0,1.05fr) minmax(0,.95fr);gap:38px;align-items:center;padding:18px 0 34px}
.article-hero-layout .article-head{max-width:none;margin:0;text-align:left;padding:0}
.article-hero-layout .blog-reading-page h1{font-size:clamp(34px,3.8vw,49px);line-height:1.08;letter-spacing:-1.7px;margin:18px 0 17px}
.article-hero-layout .dek{margin:0;max-width:590px;font-size:15px}
.article-hero-layout .byline{justify-content:flex-start;gap:10px;line-height:1.4}
.hero-actions{display:flex;flex-wrap:wrap;gap:8px;margin-top:21px}
.hero-actions .action-btn{background:#fff;border-color:#dce6f2}
.hero-image-panel{position:relative;min-width:0;padding:0 10px 12px 0}
.hero-image-frame{position:relative;z-index:1;overflow:hidden;border-radius:22px;aspect-ratio:4/3;background:#dbe8f6;box-shadow:0 18px 42px rgba(16,35,63,.14)}
.hero-image-frame>img{width:100%;height:100%;display:block;object-fit:cover}
.hero-image-caption{position:absolute;left:15px;right:15px;bottom:15px;display:flex;align-items:center;gap:11px;padding:12px 14px;border-radius:13px;background:rgba(10,31,56,.88);color:#fff;backdrop-filter:blur(12px)}
.caption-mark{display:grid;place-items:center;flex:0 0 37px;height:37px;border-radius:11px;background:linear-gradient(135deg,#1769ff,#19b6c9);font-size:10px;font-weight:900}
.hero-image-caption strong{display:block;font-size:12px;line-height:1.3}
.hero-image-caption small{display:block;font-size:10px;color:#c7d9ed;margin-top:3px}
.hero-image-accent{position:absolute;z-index:0;right:-2px;bottom:0;width:52%;height:55%;border-radius:22px;background:linear-gradient(135deg,#19b6c9,#1769ff);opacity:.17}
.article-layout{grid-template-columns:minmax(0,1fr) 340px;gap:26px}
.article-layout>.sidebar{position:sticky;top:94px;align-self:start;max-height:calc(100vh - 108px);overflow-y:auto;overscroll-behavior:contain;padding:2px 4px 8px 0;scrollbar-width:thin;scrollbar-color:#c9d9ed transparent}
.article-layout>.sidebar::-webkit-scrollbar{width:5px}
.article-layout>.sidebar::-webkit-scrollbar-thumb{background:#c9d9ed;border-radius:10px}
.product-side-card{padding:18px}
.product-side-head{display:flex;align-items:center;justify-content:space-between;gap:8px}
.product-side-head .side-title{margin-bottom:13px;font-size:14px}
.product-side-head>a{font-size:10px;color:#1769ff;font-weight:850;margin-bottom:12px;white-space:nowrap}
.product-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}
.product-card-mini{display:flex;flex-direction:column;min-width:0;border:1px solid #e4ebf4;border-radius:12px;overflow:hidden;background:#fff;transition:transform .2s,border-color .2s,box-shadow .2s}
.product-card-mini:hover{transform:translateY(-3px);border-color:#b7d0fb;box-shadow:0 9px 20px rgba(16,35,63,.08)}
.product-card-mini>img{display:block;width:100%;height:108px;object-fit:cover;background:#e8eff7}
.product-card-body{display:flex;flex-direction:column;align-items:flex-start;padding:10px;flex:1}
.product-card-body>strong{font-size:10px;line-height:1.45;color:#293c53;min-height:30px;margin-bottom:7px}
.product-card-body>b{font-size:14px;line-height:1.25;color:#10233f;margin-top:auto}
.product-card-body>b small{font-size:9px;font-weight:600;color:#8291a3}
.product-card-body>em{display:flex;justify-content:space-between;align-items:center;gap:3px;width:100%;font-style:normal;font-size:9px;line-height:1.3;font-weight:850;color:#1769ff;margin-top:8px;padding-top:7px;border-top:1px solid #edf2f8}
.product-card-body>em span{font-size:13px}
.product-disclaimer{font-size:9px;line-height:1.5;color:#8997a9;margin:12px 0 0;padding-top:10px;border-top:1px dashed #e1e8f0}

/* Refined blue marketplace sidebar */
.sidebar{gap:16px}
.sidebar::-webkit-scrollbar{width:5px}.sidebar::-webkit-scrollbar-thumb{background:#c7d7ec;border-radius:99px}.sidebar::-webkit-scrollbar-track{background:transparent}
.side-card{border-radius:17px;padding:20px}
.listing-cta{background:linear-gradient(145deg,#10233f 0%,#174f83 65%,#147c9b 100%);position:relative;overflow:hidden;padding:23px;color:#fff;border:0;box-shadow:0 14px 30px rgba(16,35,63,.17)}
.listing-cta:before{content:"";position:absolute;width:180px;height:180px;border:1px solid #ffffff20;border-radius:50%;right:-78px;top:-78px;box-shadow:0 0 0 20px #ffffff08,0 0 0 42px #ffffff05}
.listing-cta:after{content:"";position:absolute;width:85px;height:85px;border-radius:22px;right:20px;bottom:-48px;background:#22c5d433;transform:rotate(30deg)}
.listing-cta>*{position:relative;z-index:1}
.listing-cta-icon{width:46px;height:46px;display:grid;place-items:center;border-radius:14px;background:#ffffff17;border:1px solid #ffffff30;margin-bottom:16px}
.listing-cta-icon svg{width:25px;height:25px;stroke:#74edf0}
.listing-kicker{font-size:9px;text-transform:uppercase;letter-spacing:1.4px;font-weight:900;color:#82edf0}
.listing-cta h3{font-size:21px;line-height:1.22;letter-spacing:-.5px;margin:7px 0 10px;color:#fff}
.listing-cta p{font-size:12px;line-height:1.7;color:#d6e7f7;margin:0 0 17px}
.listing-cta>a{display:flex;align-items:center;justify-content:space-between;gap:10px;background:#fff;color:#123252;border-radius:10px;padding:12px 13px;font-size:12px;font-weight:900;box-shadow:0 5px 14px #061a3029}
.listing-cta>a span{font-size:18px;color:#1769ff}
.listing-trust{display:flex;align-items:center;gap:7px;color:#d4e6f7;font-size:10px;margin-top:13px}
.listing-trust span{display:grid;place-items:center;width:17px;height:17px;background:#1cc7bd;color:#092e46;border-radius:50%;font-size:10px;font-weight:900}
.side-heading-icon{width:27px;height:27px;border-radius:8px;display:grid;place-items:center;background:#edf5ff;border:1px solid #dceaff;color:#1769ff;font-size:16px;flex:0 0 27px}
.side-title{display:flex;align-items:center;gap:9px;margin-bottom:15px}
.category-links{gap:7px}
.category-link{display:grid;grid-template-columns:34px minmax(0,1fr) auto;justify-content:initial;padding:9px 10px;background:#fff;border:1px solid #e7edf5;transition:.2s}
.category-link:hover{background:#f2f7ff;border-color:#bcd5ff;transform:translateX(2px)}
.category-icon{width:32px;height:32px;display:grid;place-items:center;border-radius:9px;background:#edf5ff;color:#1769ff}
.category-icon svg{width:18px;height:18px;fill:none;stroke:currentColor;stroke-width:1.6;stroke-linecap:round;stroke-linejoin:round}
.category-name{align-self:center;font-size:11px;font-weight:800;color:#3a4d64}
.category-count{align-self:center;font-size:9px;color:#8292a6;background:#f3f6fa;padding:4px 6px;border-radius:6px;font-weight:800}
.all-categories{display:flex;justify-content:space-between;align-items:center;margin-top:12px;padding:10px 2px 0;border-top:1px solid #edf1f6;color:#1769ff;font-size:11px;font-weight:850}
.all-categories span{font-size:17px}
.product-side-head{display:flex;align-items:center;justify-content:space-between;gap:10px}
.product-side-head .side-title{margin-bottom:12px}
.product-side-head>a{font-size:10px;color:#1769ff;font-weight:850;margin-bottom:12px;white-space:nowrap}
.product-mini{display:grid;grid-template-columns:88px minmax(0,1fr);gap:11px;padding:12px 0;border-bottom:1px solid #edf1f6;align-items:center}
.product-mini:last-of-type{border-bottom:0}
.product-mini>img{width:88px;height:96px;border-radius:11px;object-fit:cover;background:#e8eff7;border:1px solid #e7edf4}
.product-mini-info{min-width:0;display:flex;flex-direction:column;align-items:flex-start}
.product-mini-info>strong{font-size:11px;line-height:1.4;color:#21354d;margin-bottom:4px}
.product-rating{display:flex;align-items:center;gap:5px;line-height:1.2;margin-bottom:5px}
.product-rating>span{font-size:10px;letter-spacing:-1px;color:#f2a91c}
.product-rating small{font-size:9px;color:#6e7e92;font-weight:800}
.product-mini-info>b{font-size:14px;color:#10233f;line-height:1.4}
.product-mini-info>b small{font-size:9px;color:#8190a2;font-weight:600}
.product-mini-info>em{display:flex;gap:5px;align-items:center;font-style:normal;font-size:10px;color:#1769ff;font-weight:850;margin-top:4px}
.product-mini-info>em span{font-size:14px}
.product-disclaimer{font-size:9px;line-height:1.5;color:#8997a9;margin:10px 0 0;padding-top:10px;border-top:1px dashed #e1e8f0}
.side-article{grid-template-columns:72px minmax(0,1fr);gap:10px}
.side-article img{width:72px;height:66px}
.side-article a{font-size:11px}
.toc-list a{font-size:11px}
@media(max-width:850px){.article-head{text-align:left}.article-head .byline{justify-content:flex-start}.sidebar{grid-template-columns:repeat(2,minmax(0,1fr));align-items:start}.sidebar .listing-cta{grid-column:1/-1}.sidebar .toc-card{grid-row:auto}.product-grid{grid-template-columns:repeat(2,minmax(0,1fr))}}
@media(max-width:600px){.article-hero-layout .blog-reading-page h1{font-size:34px;letter-spacing:-1.1px}.article-hero-layout .dek{font-size:14px}.article-hero-layout .byline{justify-content:flex-start}.hero-image-frame{aspect-ratio:4/3;border-radius:16px}.hero-image-caption{left:10px;right:10px;bottom:10px;padding:10px}.article-layout>.sidebar{grid-template-columns:1fr}.sidebar .listing-cta{grid-column:auto}.sidebar .product-side-card{grid-column:auto}.product-grid{grid-template-columns:repeat(2,minmax(0,1fr))}.product-card-mini>img{height:125px}.product-card-.blog-reading-page{padding:10px}.product-card-body>strong{font-size:11px;min-height:31px}.product-card-body>b{font-size:15px}.side-card{padding:18px}.listing-cta{padding:22px}}

.toast{position:fixed;bottom:22px;left:50%;transform:translate(-50%,20px);opacity:0;pointer-events:none;z-index:100;background:var(--navy);color:#fff;padding:11px 16px;border-radius:10px;font-size:12px;box-shadow:var(--shadow);transition:.25s}
.toast.show{opacity:1;transform:translate(-50%,0)}
@media(max-width:1050px){.nav{gap:14px}.brand{min-width:auto}.article-layout{grid-template-columns:275px minmax(0,1fr);gap:18px}.header-search{width:200px}}
@media(max-width:850px){.nav{display:none}.header-search{margin-left:auto;width:min(300px,38vw)}.header-cta{display:none}.mobile-menu{display:block}.article-layout{grid-template-columns:1fr}.sidebar{position:static;max-height:none;overflow:visible;grid-template-columns:repeat(2,minmax(0,1fr));padding:0}.sidebar .listing-cta{grid-column:1/-1}.sidebar .toc-card{grid-row:auto}.featured-image{aspect-ratio:16/8}.footer-top{grid-template-columns:repeat(2,1fr)}}
@media(max-width:600px){.blog-reading-page .container{width:min(100% - 28px,1200px)}.header-inner{height:66px;gap:10px}.brand{font-size:19px}.brand-mark{width:34px;height:34px}.header-search{width:auto;flex:1;height:38px}.header-search input{font-size:11px}.mobile-menu{font-size:12px;padding:8px}.breadcrumbs{padding:18px 0 8px}.article-head{padding-top:10px;text-align:left}.article-head .eyebrow{font-size:9px}.blog-reading-page h1{font-size:34px;letter-spacing:-1.1px;margin:15px 0 12px}.dek{font-size:14px}.byline{justify-content:flex-start;gap:9px;margin-top:16px}.featured-wrap{margin-bottom:25px}.featured-image{aspect-ratio:4/3;border-radius:15px}.image-label{left:10px;bottom:10px;font-size:9px}.article-toolbar{align-items:flex-start}.toolbar-right{width:100%}.action-btn{padding:8px 10px}.article-content{padding:22px 18px;border-radius:15px}.article-content h2{font-size:24px;margin-top:34px}.article-content p{font-size:14px}.lead{font-size:15px!important}.sidebar{grid-template-columns:1fr}.sidebar .toc-card{grid-row:auto}.side-card{padding:18px}.faq-intro{align-items:flex-start}.faq-symbol{width:48px;height:48px;flex-basis:48px;border-radius:14px}.faq-intro h2{font-size:23px}.faq-item summary{grid-template-columns:38px 1fr 26px;gap:10px;padding:12px}.faq-icon{width:38px;height:38px;border-radius:11px}.faq-question{font-size:12px}.faq-answer{padding:0 14px 16px 60px}.faq-answer p{font-size:12px}.related-section{padding:35px 0}.section-head{align-items:flex-start;flex-direction:column}.section-head h2{font-size:25px}.related-grid{grid-template-columns:1fr}.related-card{display:grid;grid-template-columns:120px 1fr}.related-card img{height:100%;min-height:150px}.related-body{padding:13px}.related-body h3{font-size:14px}.newsletter-inner{align-items:flex-start;flex-direction:column}.newsletter h2{font-size:23px}.newsletter-form{width:100%}.newsletter-form button{padding:0 12px}.footer-top{grid-template-columns:1fr 1fr;gap:22px}.footer-top>div:first-child{grid-column:1/-1}.footer-bottom{font-size:9px}.article-feedback{padding:18px 12px}}

/* FINAL LAYOUT POLISH */
.article-hero-layout{position:relative;max-width:1200px;margin:0 auto;grid-template-columns:minmax(0,1.04fr) minmax(0,.96fr);align-items:center;padding:24px 0 34px}
.article-hero-layout .article-head{width:100%;text-align:left}
.article-hero-layout .eyebrow{margin-bottom:2px}
.article-hero-layout .blog-reading-page h1{max-width:680px;color:#10233f}
.article-hero-layout .dek{max-width:610px;color:#536780}
.hero-image-frame{border:1px solid #dce7f4}
.hero-image-caption{box-shadow:0 8px 24px #071e3830}
.article-layout{grid-template-columns:minmax(0,1fr) 340px;align-items:start}
.article-layout>.sidebar{position:sticky;top:92px;max-height:calc(100vh - 104px);overflow-y:auto;align-self:start;display:grid;grid-template-columns:1fr;gap:16px;padding:0 4px 12px 0}
.article-layout>.sidebar .side-card{width:100%}
.product-grid{grid-template-columns:repeat(2,minmax(0,1fr))}
.product-card-mini>img{height:112px}
.product-card-body>strong{font-size:11px}
.product-card-body>b{font-size:15px}
.listing-cta h3{max-width:250px}
.toc-list a{scroll-margin-top:100px}
@media(max-width:1000px){
  .article-hero-layout{grid-template-columns:minmax(0,1fr) minmax(0,.9fr);gap:22px}
  .article-hero-layout .blog-reading-page h1{font-size:clamp(32px,4vw,43px)}
  .article-layout{grid-template-columns:minmax(0,1fr) 310px;gap:18px}
  .product-grid{grid-template-columns:repeat(2,minmax(0,1fr))}
}
@media(max-width:850px){
  .article-hero-layout{grid-template-columns:1fr;gap:22px;padding-top:14px}
  .article-hero-layout .article-head{max-width:760px}
  .hero-image-panel{max-width:100%;width:100%}
  .article-layout{grid-template-columns:1fr}
  .article-layout>.sidebar{position:static;max-height:none;overflow:visible;display:grid;grid-template-columns:repeat(2,minmax(0,1fr));padding:0}
  .article-layout>.sidebar .listing-cta,.article-layout>.sidebar .product-side-card{grid-column:1/-1}
  .article-layout>.sidebar .product-grid{grid-template-columns:repeat(3,minmax(0,1fr))}
}
@media(max-width:600px){
  .article-hero-layout{padding:10px 0 25px}
  .article-hero-layout .blog-reading-page h1{font-size:34px;line-height:1.1;letter-spacing:-1.15px}
  .article-hero-layout .dek{font-size:14px}
  .article-hero-layout .byline{font-size:11px}
  .hero-image-frame{aspect-ratio:4/3}
  .article-layout>.sidebar{grid-template-columns:1fr}
  .article-layout>.sidebar .listing-cta,.article-layout>.sidebar .product-side-card{grid-column:auto}
  .article-layout>.sidebar .product-grid{grid-template-columns:repeat(2,minmax(0,1fr))}
  .product-card-mini>img{height:135px}
  .product-card-body>strong{font-size:11px}
}


/* Final layout: title and image on the left; full-height marketplace sidebar on the right */
.reading-page-grid{display:grid;grid-template-columns:minmax(0,1fr) 340px;gap:26px;align-items:start;padding-bottom:56px}
.reading-main{min-width:0}.reading-main .blog-reading-page .container{width:100%;max-width:none}
.reading-main .article-hero-layout{display:flex;flex-direction:column;align-items:stretch;gap:20px;width:100%;max-width:none;margin:0;padding:10px 0 28px}
.reading-main .article-hero-layout .article-head{max-width:none;text-align:left}
.reading-main .article-hero-layout .blog-reading-page h1{max-width:760px;font-size:clamp(34px,3.6vw,48px);line-height:1.08;color:#10233f}
.reading-main .article-hero-layout .dek{max-width:720px;margin:0}
.reading-main .article-hero-layout .byline{justify-content:flex-start}
.reading-main .hero-image-panel{width:100%;max-width:none}
.reading-main .hero-image-frame{aspect-ratio:16/8.5}
.article-layout-inner .article-content{width:100%}
.reading-page-grid>.sidebar{position:sticky;top:92px;align-self:start;max-height:calc(100vh - 108px);overflow-y:auto;overscroll-behavior:contain;display:grid;grid-template-columns:1fr;gap:16px;padding:10px 4px 12px 0;scrollbar-width:thin;scrollbar-color:#c9d9ed transparent}
.reading-page-grid>.sidebar::-webkit-scrollbar{width:5px}
.reading-page-grid>.sidebar::-webkit-scrollbar-thumb{background:#c9d9ed;border-radius:10px}
.reading-page-grid>.sidebar .side-card{width:100%}
.reading-page-grid .product-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}
.reading-page-grid .product-card-mini>img{height:108px}
.article-layout-inner{min-width:0}
@media(max-width:1000px){.reading-page-grid{grid-template-columns:minmax(0,1fr) 300px;gap:18px}.reading-main .article-hero-layout .blog-reading-page h1{font-size:clamp(32px,3.8vw,42px)}}
@media(max-width:850px){.reading-page-grid{grid-template-columns:1fr}.reading-main .article-hero-layout{padding-top:8px}.reading-main .hero-image-frame{aspect-ratio:16/8.5}.reading-page-grid>.sidebar{position:static;max-height:none;overflow:visible;display:grid;grid-template-columns:repeat(2,minmax(0,1fr));padding:0}.reading-page-grid>.sidebar .listing-cta,.reading-page-grid>.sidebar .product-side-card{grid-column:1/-1}.reading-page-grid .product-grid{grid-template-columns:repeat(3,minmax(0,1fr))}}
@media(max-width:600px){.reading-main .article-hero-layout .blog-reading-page h1{font-size:34px;letter-spacing:-1.1px}.reading-main .article-hero-layout .dek{font-size:14px}.reading-main .hero-image-frame{aspect-ratio:4/3}.reading-page-grid>.sidebar{grid-template-columns:1fr}.reading-page-grid>.sidebar .listing-cta,.reading-page-grid>.sidebar .product-side-card{grid-column:auto}.reading-page-grid .product-grid{grid-template-columns:repeat(2,minmax(0,1fr))}.reading-page-grid .product-card-mini>img{height:132px}}


/* React page refinements and safe article rendering */
.blog-reading-page { min-height: 100vh; }
.blog-reading-page .article-content { line-height: 1.8; }
.blog-reading-page .article-html > *:first-child { margin-top: 0; }
.blog-reading-page .article-html p { font-size: 15px; color: #43536a; margin: 0 0 19px; }
.blog-reading-page .article-html h1,
.blog-reading-page .article-html h2,
.blog-reading-page .article-html h3,
.blog-reading-page .article-html h4 { color: #10233f; line-height: 1.3; scroll-margin-top: 100px; }
.blog-reading-page .article-html h1 { font-size: 32px; margin: 34px 0 15px; }
.blog-reading-page .article-html h2 { font-size: 27px; margin: 42px 0 16px; }
.blog-reading-page .article-html h3 { font-size: 18px; margin: 25px 0 9px; }
.blog-reading-page .article-html ul,
.blog-reading-page .article-html ol { padding-left: 22px; margin: 0 0 22px; color: #43536a; font-size: 14px; }
.blog-reading-page .article-html li { padding-left: 4px; margin: 8px 0; }
.blog-reading-page .article-html img,
.blog-reading-page .article-html video { display: block; max-width: 100%; height: auto; margin: 25px auto; border-radius: 16px; }
.blog-reading-page .article-html iframe { display: block; width: 100%; min-height: 360px; border: 0; border-radius: 14px; margin: 24px 0; }
.blog-reading-page .article-html blockquote { margin: 25px 0; padding: 18px 20px; border-left: 4px solid #19b6c9; background: #edf7fc; border-radius: 0 12px 12px 0; color: #43536a; }
.blog-reading-page .article-html table { display: block; width: 100%; overflow-x: auto; border-collapse: collapse; margin: 22px 0; font-size: 13px; }
.blog-reading-page .article-html th { background: #10233f; color: white; text-align: left; padding: 12px; }
.blog-reading-page .article-html td { padding: 11px; border: 1px solid #e4eaf1; color: #47566c; }
.blog-reading-page .article-html tr:nth-child(even) td { background: #f7faff; }
.blog-reading-page .article-html a { color: #1769ff; text-decoration: underline; text-underline-offset: 3px; }
.blog-reading-page .article-html strong,
.blog-reading-page .article-html b { color: #203650; font-weight: 800; }
.blog-reading-page .article-html hr { border: 0; border-top: 1px solid #e4eaf1; margin: 30px 0; }
.blog-reading-page .article-html .note-card { display: flex; gap: 15px; background: linear-gradient(110deg,#edf5ff,#f0fbfc); border: 1px solid #d8e9f8; border-radius: 15px; padding: 19px; margin: 26px 0; }
.blog-reading-page .article-html .lead { font-size: 17px; color: #334760; line-height: 1.85; }
.blog-reading-page .article-html .checklist { list-style: none; padding: 0; }
.blog-reading-page .article-html input[type="checkbox"] { accent-color: #1769ff; margin-right: 8px; }
.blog-reading-page .toc-empty { font-size: 12px; color: #718096; }
.blog-reading-page .newsletter-link { display: inline-flex; flex-shrink: 0; align-items: center; justify-content: center; border-radius: 10px; padding: 12px 18px; background: #19b6c9; color: #08233d; font-size: 12px; font-weight: 900; }
@media(max-width:850px) {
  .blog-reading-page .article-hero-layout { display: flex; flex-direction: column; align-items: stretch; gap: 22px; }
  .blog-reading-page .hero-image-panel { width: 100%; }
}
@media(max-width:600px) {
  .blog-reading-page .article-html p { font-size: 14px; }
  .blog-reading-page .article-html h2 { font-size: 24px; }
  .blog-reading-page .article-html iframe { min-height: 220px; }

}
  /* =====================================
   PROFESSIONAL BLOG CONTENT FORMATTING
===================================== */

/* Main headings */
.blog-reading-page .article-html h1,
.blog-reading-page .article-html h2 {
  font-weight: 850 !important;
  color: #10233f;
  line-height: 1.35;
}

/* Numbered headings */
.blog-reading-page .article-html h2.article-numbered-heading,
.blog-reading-page .article-html h3.article-numbered-heading {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  font-weight: 850 !important;
  margin: 36px 0 20px;
}

/* Heading number badge */
.blog-reading-page .article-html .heading-number {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  min-width: 34px;
  height: 34px;
  padding: 0 9px;
  border-radius: 9px;
  background: #eaf2ff;
  color: #1769ff;
  font-size: 17px;
  font-weight: 900;
  line-height: 1;
}

/* Subheadings */
.blog-reading-page .article-html h3,
.blog-reading-page .article-html h4 {
  font-weight: 800 !important;
  color: #18375b;
  margin: 25px 0 10px;
}

/* Paragraphs */
.blog-reading-page .article-html p {
  font-size: 15px;
  line-height: 1.85;
  color: #43536a;
  margin-bottom: 18px;
}

/* Bullet lists */
.blog-reading-page .article-html ul {
  list-style-type: disc !important;
  padding-left: 28px !important;
  margin: 12px 0 24px !important;
}

/* Numbered lists */
.blog-reading-page .article-html ol {
  list-style-type: decimal !important;
  padding-left: 30px !important;
  margin: 12px 0 24px !important;
}

/* List items */
.blog-reading-page .article-html li {
  display: list-item !important;
  padding-left: 5px;
  margin: 10px 0 !important;
  color: #43536a;
  font-size: 14px;
  line-height: 1.8;
}

/* Bold list numbers and bullet markers */
.blog-reading-page .article-html ol li::marker {
  color: #1769ff;
  font-weight: 900;
  font-size: 14px;
}

.blog-reading-page .article-html ul li::marker {
  color: #19b6c9;
  font-size: 16px;
}

/* Bold text inside article */
.blog-reading-page .article-html strong,
.blog-reading-page .article-html b {
  color: #102f55;
  font-weight: 850 !important;
}

/* Blockquote */
.blog-reading-page .article-html blockquote {
  border-left: 4px solid #1769ff;
  background: #f1f6ff;
  padding: 16px 20px;
  border-radius: 0 12px 12px 0;
  margin: 22px 0;
}

/* Mobile */
@media (max-width: 600px) {
  .blog-reading-page .article-html h2 {
    font-size: 23px;
  }

  .blog-reading-page .article-html .heading-number {
    min-width: 30px;
    height: 30px;
    font-size: 14px;
  }

  .blog-reading-page .article-html p,
  .blog-reading-page .article-html li {
    font-size: 14px;
  }
}
`}</style>
    </div>
  );
}