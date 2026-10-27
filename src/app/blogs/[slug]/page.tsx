
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import ReadMoreContent from "./ReadMoreContent";

const API_URL = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"
).replace(/\/$/, "");

type BlogImage = {
  url: string;
  publicId?: string;
  alt?: string;
};

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
  video?: {
    url?: string;
    duration?: number;
    format?: string;
  };
  author?: string;
  status?: string;
  publishedAt?: string;
  createdAt?: string;
  updatedAt?: string;
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string[];
  };
  views?: number;
};

type ApiResponse = {
  success?: boolean;
  data?: Blog | { blog?: Blog };
  message?: string;
};

type PageProps = {
  params: Promise<{ slug: string }>;
};

async function getBlog(slug: string): Promise<Blog | null> {
  try {
    const response = await fetch(
      `${API_URL}/blogs/slug/${encodeURIComponent(slug)}`,
      { next: { revalidate: 60 } }
    );

    if (!response.ok) {
      console.error("Blog API error:", response.status);
      return null;
    }

    const result: ApiResponse = await response.json();

    if (result.success === false || !result.data) {
      return null;
    }

    const data = result.data;
    const blog =
      "blog" in data && data.blog ? data.blog : (data as Blog);

    return blog?.slug ? blog : null;
  } catch (error) {
    console.error("Unable to fetch blog:", error);
    return null;
  }
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const blog = await getBlog(slug);

  if (!blog) {
    return {
      title: "Blog Not Found | Advixio360",
      robots: { index: false, follow: true },
    };
  }

  const title = blog.seo?.metaTitle || blog.title;
  const description =
    blog.seo?.metaDescription ||
    blog.excerpt ||
    `${blog.title} — Business insights from Advixio360.`;

  const canonical = `https://advixio360.com/blogs/${blog.slug}`;

  return {
    title: `${title} | Advixio360`,
    description,
    keywords: blog.seo?.keywords?.length
      ? blog.seo.keywords
      : blog.tags,
    alternates: { canonical },
    robots: {
      index: blog.status === "published",
      follow: true,
    },
    openGraph: {
      title,
      description,
      url: canonical,
      type: "article",
      siteName: "Advixio360",
      publishedTime: blog.publishedAt || blog.createdAt,
      images: blog.coverImage?.url
        ? [
            {
              url: blog.coverImage.url,
              alt: blog.coverImage.alt || blog.title,
            },
          ]
        : [],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: blog.coverImage?.url ? [blog.coverImage.url] : [],
    },
  };
}

function formatDate(date?: string) {
  if (!date) return "";

  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return "";

  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(parsed);
}

function getContentParagraphs(content: string): string[] {
  return content
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
}

export default async function BlogDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const blog = await getBlog(slug);

  if (!blog || blog.status !== "published") {
    notFound();
  }

  const publishedDate = formatDate(blog.publishedAt || blog.createdAt);
  const contentParagraphs = getContentParagraphs(blog.content || "");

  const galleryImages = (blog.images || []).filter(
    (image) => image.url && image.url !== blog.coverImage?.url
  );

  return (
    <main className="min-h-screen bg-[#f7f8fc] text-slate-800">
      {/* Breadcrumb navigation */}
      <div className="border-b border-slate-200/80 bg-white">
        <div className="mx-auto max-w-7xl px-5 py-4 sm:px-8">
          <nav
            aria-label="Breadcrumb"
            className="flex flex-wrap items-center gap-2 text-sm"
          >
            <Link
              href="/"
              className="text-slate-500 transition hover:text-indigo-600"
            >
              Home
            </Link>
            <span className="text-slate-300">/</span>
            <Link
              href="/blogs"
              className="text-slate-500 transition hover:text-indigo-600"
            >
              Insights
            </Link>
            <span className="text-slate-300">/</span>
            <span className="max-w-[220px] truncate font-medium text-slate-800">
              {blog.title}
            </span>
          </nav>
        </div>
      </div>

      {/* Main article header */}
      <section className="relative overflow-hidden border-b border-slate-200 bg-white">
        <div className="pointer-events-none absolute -right-24 -top-32 h-80 w-80 rounded-full bg-indigo-100/60 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-40 left-0 h-72 w-72 rounded-full bg-violet-100/50 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-5 pb-10 pt-10 sm:px-8 sm:pb-14 sm:pt-14 lg:pb-16 lg:pt-16">
          <div className="mx-auto max-w-4xl">
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50 px-3.5 py-2 text-xs font-bold uppercase tracking-wider text-indigo-700">
                <span className="h-1.5 w-1.5 rounded-full bg-indigo-600" />
                Business Insights
              </span>

              {blog.category && (
                <Link
                  href={`/blogs?category=${encodeURIComponent(blog.category)}`}
                  className="rounded-full border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-600 transition hover:border-indigo-200 hover:text-indigo-700"
                >
                  {blog.category}
                </Link>
              )}
            </div>

            <h1 className="mt-7 text-3xl font-extrabold leading-[1.18] tracking-tight text-slate-950 sm:text-4xl lg:text-[52px]">
              {blog.title}
            </h1>

            {blog.excerpt && (
              <p className="mt-6 max-w-3xl text-base leading-8 text-slate-600 sm:text-lg sm:leading-9">
                {blog.excerpt}
              </p>
            )}

            <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-4 border-t border-slate-200 pt-6">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-indigo-600 text-sm font-bold text-white shadow-sm">
                  {(blog.author || "A").trim().charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-xs text-slate-500">Written by</p>
                  <p className="mt-0.5 text-sm font-bold text-slate-900">
                    {blog.author || "Advixio360 Editorial Team"}
                  </p>
                </div>
              </div>

              {publishedDate && (
                <div className="sm:border-l sm:border-slate-200 sm:pl-5">
                  <p className="text-xs text-slate-500">Published on</p>
                  <time
                    dateTime={blog.publishedAt || blog.createdAt}
                    className="mt-0.5 block text-sm font-semibold text-slate-700"
                  >
                    {publishedDate}
                  </time>
                </div>
              )}

              {typeof blog.views === "number" && (
                <div className="sm:border-l sm:border-slate-200 sm:pl-5">
                  <p className="text-xs text-slate-500">Article views</p>
                  <p className="mt-0.5 text-sm font-semibold text-slate-700">
                    {blog.views.toLocaleString("en-IN")}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Cover image */}
      {blog.coverImage?.url && (
        <div className="mx-auto -mt-0 max-w-6xl px-5 pt-8 sm:px-8 sm:pt-10">
          <div className="relative aspect-[16/9] overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 shadow-lg shadow-slate-900/[0.06] sm:rounded-3xl">
            <Image
              src={blog.coverImage.url}
              alt={blog.coverImage.alt || blog.title}
              fill
              priority
              unoptimized
              sizes="(max-width: 768px) 100vw, 1152px"
              className="object-cover"
            />
          </div>
        </div>
      )}

      {/* Article body and sidebar */}
      <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8 sm:py-14">
        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-[minmax(0,1fr)_310px] lg:gap-10">
          {/* Main content */}
          <article className="min-w-0">
            <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm shadow-slate-900/[0.02] sm:rounded-3xl sm:p-8 lg:p-10">
              <div className="mb-7 flex items-center gap-3 border-b border-slate-100 pb-5">
                <div className="h-7 w-1 rounded-full bg-indigo-600" />
                <h2 className="text-lg font-bold text-slate-950 sm:text-xl">
                  Article Overview
                </h2>
              </div>

              <div className="blog-article-content">
                <ReadMoreContent
                  paragraphs={contentParagraphs}
                  previewParagraphs={3}
                />
              </div>
            </div>

            {/* Image gallery */}
            {galleryImages.length > 0 && (
              <section className="mt-8 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:rounded-3xl sm:p-8">
                <div className="mb-6">
                  <p className="text-xs font-bold uppercase tracking-widest text-indigo-600">
                    Visual Highlights
                  </p>
                  <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-950">
                    Image Gallery
                  </h2>
                </div>

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  {galleryImages.map((image, index) => (
                    <figure
                      key={image.publicId || image.url}
                      className="group overflow-hidden rounded-2xl border border-slate-200 bg-white"
                    >
                      <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
                        <Image
                          src={image.url}
                          alt={
                            image.alt ||
                            `${blog.title} - image ${index + 1}`
                          }
                          fill
                          unoptimized
                          sizes="(max-width: 640px) 100vw, 50vw"
                          className="object-cover transition duration-500 group-hover:scale-105"
                        />
                      </div>

                      {image.alt && (
                        <figcaption className="px-4 py-3 text-sm leading-6 text-slate-600">
                          {image.alt}
                        </figcaption>
                      )}
                    </figure>
                  ))}
                </div>
              </section>
            )}

            {/* Video */}
            {blog.video?.url && (
              <section className="mt-8 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:rounded-3xl sm:p-8">
                <p className="text-xs font-bold uppercase tracking-widest text-indigo-600">
                  Watch and Learn
                </p>
                <h2 className="mb-5 mt-2 text-2xl font-bold tracking-tight text-slate-950">
                  Related Video
                </h2>

                <video
                  controls
                  preload="metadata"
                  className="w-full rounded-2xl bg-black"
                >
                  <source
                    src={blog.video.url}
                    type={
                      blog.video.format
                        ? `video/${blog.video.format}`
                        : undefined
                    }
                  />
                  Your browser does not support video playback.
                </video>
              </section>
            )}

            {/* Tags */}
            {blog.tags && blog.tags.length > 0 && (
              <section className="mt-8 rounded-2xl border border-slate-200/80 bg-white p-5 sm:rounded-3xl sm:p-8">
                <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500">
                  Explore Topics
                </h2>

                <div className="mt-4 flex flex-wrap gap-2">
                  {blog.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-slate-200 bg-slate-50 px-3.5 py-2 text-sm font-medium text-slate-600 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </section>
            )}

            {/* Back navigation */}
            <div className="mt-8">
              <Link
                href="/blogs"
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700"
              >
                <span aria-hidden="true">←</span>
                Back to all articles
              </Link>
            </div>
          </article>

          {/* Sidebar */}
          <aside className="space-y-5 lg:sticky lg:top-6">
            <div className="overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-700 via-indigo-600 to-violet-700 p-6 text-black shadow-lg shadow-indigo-900/10 sm:rounded-3xl sm:p-7">
              <span className="inline-flex rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-semibold tracking-wide text-indigo-50">
                ADVIXIO360 INSIGHTS
              </span>

              <h2 className="mt-5 text-2xl font-bold leading-tight">
                Better insights.
                <br />
                Smarter business.
              </h2>

              <p className="mt-4 text-sm leading-7 text-indigo-50/90">
                Discover practical ideas to improve sourcing, find
                suppliers and grow your business with confidence.
              </p>

              <Link
                href="/blogs"
                className="mt-6 inline-flex w-full items-center justify-center rounded-xl bg-white px-5 py-3.5 text-sm font-bold text-indigo-700 transition hover:bg-indigo-50"
              >
                Explore All Articles
              </Link>
            </div>

            <div className="rounded-2xl border border-slate-200/80 bg-white p-6 sm:rounded-3xl sm:p-7">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-700">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  className="h-6 w-6"
                  aria-hidden="true"
                >
                  <path
                    d="M3 21h18M5 21V7l7-4 7 4v14M9 10h1m4 0h1m-6 4h1m4 0h1m-5 7v-4h4v4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>

              <h2 className="mt-5 text-xl font-bold text-slate-950">
                Find the right suppliers
              </h2>

              <p className="mt-3 text-sm leading-7 text-slate-600">
                Explore business products and discover suppliers for
                your sourcing requirements.
              </p>

              <Link
                href="/products"
                className="mt-5 inline-flex w-full items-center justify-center rounded-xl border border-indigo-200 bg-white px-4 py-3 text-sm font-bold text-indigo-700 transition hover:bg-indigo-50"
              >
                Explore Products
                <span className="ml-2" aria-hidden="true">
                  →
                </span>
              </Link>
            </div>

            <div className="rounded-2xl border border-slate-200/80 bg-white p-6 sm:rounded-3xl">
              <h2 className="text-base font-bold text-slate-950">
                Why Advixio360?
              </h2>

              <ul className="mt-4 space-y-4 text-sm leading-6 text-slate-600">
                <li className="flex gap-3">
                  <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-indigo-600" />
                  Discover products across business categories.
                </li>
                <li className="flex gap-3">
                  <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-indigo-600" />
                  Connect with suppliers for your requirements.
                </li>
                <li className="flex gap-3">
                  <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-indigo-600" />
                  Read practical insights for better decisions.
                </li>
              </ul>
            </div>
          </aside>
        </div>
      </div>

      {/* Bottom CTA */}
      <section className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8 sm:py-16">
          <div className="flex flex-col justify-between gap-6 rounded-2xl border border-indigo-100 bg-indigo-50/70 p-6 sm:rounded-3xl sm:p-9 md:flex-row md:items-center">
            <div className="max-w-2xl">
              <p className="text-xs font-bold uppercase tracking-widest text-indigo-700">
                Keep Exploring
              </p>
              <h2 className="mt-3 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
                Make your next business decision with confidence.
              </h2>
              <p className="mt-3 text-sm leading-7 text-slate-600 sm:text-base">
                Explore more insights and discover products for your
                business on Advixio360.
              </p>
            </div>

            <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
              <Link
                href="/blogs"
                className="inline-flex items-center justify-center rounded-xl bg-indigo-600 px-5 py-3.5 text-sm font-bold text-white transition hover:bg-indigo-700"
              >
                Read More Articles
              </Link>
              <Link
                href="/products"
                className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-5 py-3.5 text-sm font-bold text-slate-700 transition hover:border-indigo-300 hover:text-indigo-700"
              >
                Browse Products
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
