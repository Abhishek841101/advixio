
"use client";

import {
  FormEvent,
  ChangeEvent,
  useEffect,
  useState,
} from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

const categories = [
  "Business Growth",
  "Procurement",
  "B2B Marketing",
  "Sourcing",
  "Technology",
  "Industry News",
];

const MAX_IMAGES = 10;
const MAX_IMAGE_SIZE = 10 * 1024 * 1024;
const MAX_VIDEO_SIZE = 100 * 1024 * 1024;
const MAX_CONTENT_LENGTH = 200000;

type FormState = {
  title: string;
  author: string;
  category: string;
  excerpt: string;
  content: string;
  tags: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string;
};

const initialForm: FormState = {
  title: "",
  author: "",
  category: "Business Growth",
  excerpt: "",
  content: "",
  tags: "",
  metaTitle: "",
  metaDescription: "",
  keywords: "",
};

const inputStyle = {
  width: "100%",
  boxSizing: "border-box" as const,
  border: "1px solid #dbe3ef",
  borderRadius: "10px",
  padding: "13px 14px",
  background: "#ffffff",
  color: "#0f172a",
  fontSize: "14px",
  outlineColor: "#2563eb",
};

const labelStyle = {
  display: "block",
  fontSize: "14px",
  fontWeight: 700,
  color: "#1e293b",
  marginBottom: "8px",
};

const primaryButtonStyle = {
  border: 0,
  borderRadius: "10px",
  padding: "14px 20px",
  background: "#2563eb",
  color: "#ffffff",
  fontSize: "14px",
  fontWeight: 800,
  cursor: "pointer",
};

function formatFileSize(bytes: number) {
  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(0)} KB`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export default function CreateBlogPage() {
  const router = useRouter();

  const [form, setForm] = useState<FormState>(initialForm);
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [images, setImages] = useState<File[]>([]);
  const [video, setVideo] = useState<File | null>(null);

  const [coverPreview, setCoverPreview] = useState("");
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successSlug, setSuccessSlug] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    if (!coverImage) {
      setCoverPreview("");
      return;
    }

    const url = URL.createObjectURL(coverImage);
    setCoverPreview(url);

    return () => URL.revokeObjectURL(url);
  }, [coverImage]);

  useEffect(() => {
    const urls = images.map((file) => URL.createObjectURL(file));
    setImagePreviews(urls);

    return () => {
      urls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [images]);

  function update(field: keyof FormState, value: string) {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  }

  function handleCoverChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] || null;
    event.target.value = "";

    if (!file) return;

    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setError("Cover image must be JPG, PNG or WEBP.");
      return;
    }

    if (file.size > MAX_IMAGE_SIZE) {
      setError("Cover image must not exceed 10 MB.");
      return;
    }

    if (images.length + 1 > MAX_IMAGES) {
      setError("A blog can contain at most 10 images including its cover image.");
      return;
    }

    setError("");
    setCoverImage(file);
  }

  function handleImagesChange(event: ChangeEvent<HTMLInputElement>) {
    const selectedFiles = Array.from(event.target.files || []);
    event.target.value = "";

    if (!selectedFiles.length) return;

    const validTypes = ["image/jpeg", "image/png", "image/webp"];
    const invalidFile = selectedFiles.find(
      (file) => !validTypes.includes(file.type)
    );

    if (invalidFile) {
      setError("Only JPG, PNG and WEBP article images are allowed.");
      return;
    }

    const oversizedFile = selectedFiles.find(
      (file) => file.size > MAX_IMAGE_SIZE
    );

    if (oversizedFile) {
      setError(
        `Each image must not exceed 10 MB: ${oversizedFile.name}`
      );
      return;
    }

    const totalImages =
      images.length + selectedFiles.length + (coverImage ? 1 : 0);

    if (totalImages > MAX_IMAGES) {
      setError(
        `You can upload a maximum of ${MAX_IMAGES} images in total, including the cover image.`
      );
      return;
    }

    setError("");
    setImages((previous) => [...previous, ...selectedFiles]);
  }

  function removeImage(index: number) {
    setImages((previous) => previous.filter((_, i) => i !== index));
  }

  function handleVideoChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] || null;
    event.target.value = "";

    if (!file) return;

    const validTypes = [
      "video/mp4",
      "video/quicktime",
      "video/webm",
      "video/x-m4v",
    ];

    if (!validTypes.includes(file.type)) {
      setError("Video must be MP4, MOV, WEBM or M4V.");
      return;
    }

    if (file.size > MAX_VIDEO_SIZE) {
      setError("Video must not exceed 100 MB.");
      return;
    }

    setError("");
    setVideo(file);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSuccessMessage("");
    setSuccessSlug("");

    if (loading) return;

    const title = form.title.trim();
    const author = form.author.trim();
    const excerpt = form.excerpt.trim();
    const content = form.content.trim();

    if (title.length < 10 || title.length > 200) {
      setError("Title must contain between 10 and 200 characters.");
      return;
    }

    if (!author || author.length > 100) {
      setError("Please enter an author name of up to 100 characters.");
      return;
    }

    if (!excerpt || excerpt.length > 500) {
      setError("Short description is required and cannot exceed 500 characters.");
      return;
    }

    if (!content) {
      setError("Please write your article content.");
      return;
    }

    if (content.length > MAX_CONTENT_LENGTH) {
      setError("Article content cannot exceed 200,000 characters.");
      return;
    }

    if (images.length + (coverImage ? 1 : 0) > MAX_IMAGES) {
      setError("A blog can contain at most 10 images including its cover image.");
      return;
    }

    const totalFileSize =
      (coverImage?.size || 0) +
      images.reduce((total, file) => total + file.size, 0) +
      (video?.size || 0);

    if (totalFileSize > 150 * 1024 * 1024) {
      setError("The total selected media size must not exceed 150 MB.");
      return;
    }

    setLoading(true);

    try {
      const payload = new FormData();

      payload.append("title", title);
      payload.append("author", author);
      payload.append("category", form.category);
      payload.append("excerpt", excerpt);
      payload.append("content", content);

      const tags = form.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean);

      const keywords = form.keywords
        .split(",")
        .map((keyword) => keyword.trim())
        .filter(Boolean);

      payload.append("tags", JSON.stringify(tags));
      payload.append(
        "seo",
        JSON.stringify({
          metaTitle: form.metaTitle.trim() || title,
          metaDescription:
            form.metaDescription.trim() || excerpt,
          keywords,
        })
      );

      if (coverImage) {
        payload.append("coverImage", coverImage);
      }

      images.forEach((file) => {
        payload.append("images", file);
      });

      if (video) {
        payload.append("video", video);
      }

      const response = await fetch(`${API_URL}/blogs`, {
        method: "POST",
        body: payload,
      });

      const result = await response.json().catch(() => null);

      if (!response.ok || !result?.success) {
        throw new Error(
          result?.message ||
            `Unable to publish the article. Server returned ${response.status}.`
        );
      }

      const slug = result.data?.slug;

      if (!slug) {
        throw new Error(
          "The server accepted the request but did not return an article slug. Check the backend response."
        );
      }

      setSuccessSlug(slug);
      setSuccessMessage(
        result.message || "Your article has been published successfully."
      );
      setForm(initialForm);
      setCoverImage(null);
      setImages([]);
      setVideo(null);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong while publishing. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#f8fafc",
        color: "#0f172a",
        fontFamily: "Arial, Helvetica, sans-serif",
      }}
    >
      <Navbar />

      <section
        style={{
          background:
            "linear-gradient(120deg, #020617, #0b1f4b 60%, #173e86)",
          color: "#ffffff",
          padding: "48px 20px",
        }}
      >
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          <Link
            href="/blogs"
            style={{
              color: "#bfdbfe",
              fontSize: "14px",
              textDecoration: "none",
              fontWeight: 700,
            }}
          >
            ← Back to Blogs
          </Link>

          <p
            style={{
              color: "#67e8f9",
              fontWeight: 800,
              letterSpacing: "2px",
              fontSize: "12px",
              marginTop: "28px",
            }}
          >
            ADVIXIO360 COMMUNITY
          </p>

          <h1
            style={{
              fontSize: "clamp(32px, 5vw, 46px)",
              margin: "12px 0",
              lineHeight: 1.15,
            }}
          >
            Create a Blog
          </h1>

          <p style={{ color: "#dbeafe", lineHeight: 1.8, maxWidth: "680px" }}>
            Write your article, upload media and publish your business
            knowledge on Advixio360.
          </p>
        </div>
      </section>

      <section style={{ padding: "38px 20px 65px" }}>
        <div
          style={{
            maxWidth: "900px",
            margin: "0 auto",
            background: "#ffffff",
            border: "1px solid #e2e8f0",
            borderRadius: "18px",
            padding: "clamp(20px, 4vw, 36px)",
            boxShadow: "0 10px 35px rgba(15,23,42,0.05)",
          }}
        >
          {successSlug ? (
            <div role="status">
              <div
                style={{
                  width: "54px",
                  height: "54px",
                  borderRadius: "50%",
                  background: "#d1fae5",
                  color: "#047857",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "28px",
                  fontWeight: 800,
                }}
              >
                ✓
              </div>

              <h2
                style={{
                  color: "#047857",
                  fontSize: "27px",
                  marginTop: "20px",
                }}
              >
                Blog published successfully!
              </h2>

              <p style={{ color: "#475569", lineHeight: 1.8 }}>
                {successMessage}
              </p>

              <div
                style={{
                  display: "flex",
                  gap: "12px",
                  flexWrap: "wrap",
                  marginTop: "24px",
                }}
              >
                <button
                  type="button"
                  onClick={() => router.push(`/blogs/${successSlug}`)}
                  style={primaryButtonStyle}
                >
                  Read Published Blog
                </button>

                <Link
                  href="/blogs"
                  style={{
                    ...primaryButtonStyle,
                    background: "#eaf1fb",
                    color: "#1d4ed8",
                    textDecoration: "none",
                    display: "inline-flex",
                    alignItems: "center",
                  }}
                >
                  View All Blogs
                </Link>

                <button
                  type="button"
                  onClick={() => {
                    setSuccessSlug("");
                    setSuccessMessage("");
                  }}
                  style={{
                    ...primaryButtonStyle,
                    background: "#0f172a",
                  }}
                >
                  Create Another Blog
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: "24px" }}>
                <label htmlFor="title" style={labelStyle}>
                  Article title *
                </label>

                <input
                  id="title"
                  required
                  minLength={10}
                  maxLength={200}
                  value={form.title}
                  onChange={(event) => update("title", event.target.value)}
                  placeholder="Enter a clear, descriptive article title"
                  style={inputStyle}
                />

                <small style={{ color: "#64748b" }}>
                  {form.title.length}/200 characters
                </small>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "repeat(auto-fit, minmax(min(100%, 240px), 1fr))",
                  gap: "20px",
                  marginBottom: "24px",
                }}
              >
                <div>
                  <label htmlFor="author" style={labelStyle}>
                    Author name *
                  </label>

                  <input
                    id="author"
                    required
                    maxLength={100}
                    value={form.author}
                    onChange={(event) => update("author", event.target.value)}
                    placeholder="Your name or team name"
                    style={inputStyle}
                  />
                </div>

                <div>
                  <label htmlFor="category" style={labelStyle}>
                    Category *
                  </label>

                  <select
                    id="category"
                    value={form.category}
                    onChange={(event) => update("category", event.target.value)}
                    style={inputStyle}
                  >
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={{ marginBottom: "24px" }}>
                <label htmlFor="excerpt" style={labelStyle}>
                  Short description *
                </label>

                <textarea
                  id="excerpt"
                  required
                  minLength={20}
                  maxLength={500}
                  rows={3}
                  value={form.excerpt}
                  onChange={(event) => update("excerpt", event.target.value)}
                  placeholder="Explain what readers will learn from this article."
                  style={{ ...inputStyle, resize: "vertical" }}
                />

                <small style={{ color: "#64748b" }}>
                  {form.excerpt.length}/500 characters
                </small>
              </div>

              <div
                style={{
                  marginBottom: "28px",
                  padding: "20px",
                  background: "#f8fafc",
                  border: "1px solid #e2e8f0",
                  borderRadius: "12px",
                }}
              >
                <h2
                  style={{
                    fontSize: "18px",
                    margin: "0 0 8px",
                    color: "#10244e",
                  }}
                >
                  Cover image
                </h2>

                <p
                  style={{
                    fontSize: "13px",
                    color: "#64748b",
                    lineHeight: 1.7,
                  }}
                >
                  Optional. JPG, PNG or WEBP; maximum 10 MB.
                </p>

                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleCoverChange}
                  style={{
                    ...inputStyle,
                    padding: "10px",
                    background: "#ffffff",
                  }}
                />

                {coverImage && (
                  <div style={{ marginTop: "14px" }}>
                    {coverPreview && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={coverPreview}
                        alt="Cover image preview"
                        style={{
                          display: "block",
                          width: "100%",
                          maxWidth: "320px",
                          maxHeight: "220px",
                          objectFit: "cover",
                          borderRadius: "10px",
                          marginBottom: "10px",
                        }}
                      />
                    )}

                    <p style={{ fontSize: "13px", color: "#334155" }}>
                      {coverImage.name} · {formatFileSize(coverImage.size)}
                    </p>

                    <button
                      type="button"
                      onClick={() => setCoverImage(null)}
                      style={{
                        ...primaryButtonStyle,
                        padding: "9px 13px",
                        background: "#fee2e2",
                        color: "#b91c1c",
                      }}
                    >
                      Remove cover
                    </button>
                  </div>
                )}
              </div>

              <div
                style={{
                  marginBottom: "28px",
                  padding: "20px",
                  background: "#f8fafc",
                  border: "1px solid #e2e8f0",
                  borderRadius: "12px",
                }}
              >
                <h2
                  style={{
                    fontSize: "18px",
                    margin: "0 0 8px",
                    color: "#10244e",
                  }}
                >
                  Article images
                </h2>

                <p
                  style={{
                    fontSize: "13px",
                    color: "#64748b",
                    lineHeight: 1.7,
                  }}
                >
                  Upload up to 10 images in total, including the cover image.
                  Each image can be up to 10 MB.
                </p>

                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  multiple
                  disabled={
                    images.length + (coverImage ? 1 : 0) >= MAX_IMAGES
                  }
                  onChange={handleImagesChange}
                  style={{
                    ...inputStyle,
                    padding: "10px",
                    background: "#ffffff",
                  }}
                />

                <p
                  style={{
                    fontSize: "13px",
                    color: "#334155",
                    marginTop: "10px",
                  }}
                >
                  {images.length + (coverImage ? 1 : 0)} / {MAX_IMAGES} images
                  selected
                </p>

                {images.length > 0 && (
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns:
                        "repeat(auto-fit, minmax(140px, 1fr))",
                      gap: "12px",
                      marginTop: "16px",
                    }}
                  >
                    {images.map((file, index) => (
                      <div
                        key={`${file.name}-${file.size}-${index}`}
                        style={{
                          border: "1px solid #e2e8f0",
                          borderRadius: "10px",
                          padding: "8px",
                          minWidth: 0,
                        }}
                      >
                        {imagePreviews[index] && (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={imagePreviews[index]}
                            alt={`Article image ${index + 1}`}
                            style={{
                              width: "100%",
                              height: "100px",
                              objectFit: "cover",
                              borderRadius: "7px",
                            }}
                          />
                        )}

                        <p
                          style={{
                            fontSize: "12px",
                            color: "#475569",
                            overflowWrap: "anywhere",
                          }}
                        >
                          {file.name}
                        </p>

                        <p style={{ fontSize: "11px", color: "#64748b" }}>
                          {formatFileSize(file.size)}
                        </p>

                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          style={{
                            border: 0,
                            background: "transparent",
                            color: "#b91c1c",
                            fontSize: "12px",
                            fontWeight: 700,
                            cursor: "pointer",
                          }}
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div
                style={{
                  marginBottom: "28px",
                  padding: "20px",
                  background: "#f8fafc",
                  border: "1px solid #e2e8f0",
                  borderRadius: "12px",
                }}
              >
                <h2
                  style={{
                    fontSize: "18px",
                    margin: "0 0 8px",
                    color: "#10244e",
                  }}
                >
                  Article video
                </h2>

                <p
                  style={{
                    fontSize: "13px",
                    color: "#64748b",
                    lineHeight: 1.7,
                  }}
                >
                  Optional. MP4, MOV, WEBM or M4V; maximum 100 MB.
                </p>

                <input
                  type="file"
                  accept="video/mp4,video/quicktime,video/webm,video/x-m4v"
                  onChange={handleVideoChange}
                  style={{
                    ...inputStyle,
                    padding: "10px",
                    background: "#ffffff",
                  }}
                />

                {video && (
                  <div style={{ marginTop: "12px" }}>
                    <p style={{ fontSize: "13px", color: "#334155" }}>
                      {video.name} · {formatFileSize(video.size)}
                    </p>

                    <button
                      type="button"
                      onClick={() => setVideo(null)}
                      style={{
                        ...primaryButtonStyle,
                        padding: "9px 13px",
                        background: "#fee2e2",
                        color: "#b91c1c",
                      }}
                    >
                      Remove video
                    </button>
                  </div>
                )}
              </div>

              <div style={{ marginBottom: "28px" }}>
                <label htmlFor="content" style={labelStyle}>
                  Full article *
                </label>

                <textarea
                  id="content"
                  required
                  maxLength={MAX_CONTENT_LENGTH}
                  rows={16}
                  value={form.content}
                  onChange={(event) => update("content", event.target.value)}
                  placeholder={
                    "Write your full article here.\n\nSeparate paragraphs with blank lines. You can add images and a video using the upload sections above."
                  }
                  style={{
                    ...inputStyle,
                    lineHeight: 1.9,
                    resize: "vertical",
                    minHeight: "300px",
                  }}
                />

                <small style={{ color: "#64748b" }}>
                  {form.content.length.toLocaleString()} /{" "}
                  {MAX_CONTENT_LENGTH.toLocaleString()} characters. Plain text
                  content is supported by this form.
                </small>
              </div>

              <div
                style={{
                  marginBottom: "28px",
                  padding: "20px",
                  border: "1px solid #dbeafe",
                  background: "#eff6ff",
                  borderRadius: "12px",
                }}
              >
                <h2
                  style={{
                    fontSize: "18px",
                    margin: "0 0 18px",
                    color: "#10244e",
                  }}
                >
                  SEO settings (optional)
                </h2>

                <div style={{ marginBottom: "18px" }}>
                  <label htmlFor="metaTitle" style={labelStyle}>
                    SEO title
                  </label>

                  <input
                    id="metaTitle"
                    maxLength={200}
                    value={form.metaTitle}
                    onChange={(event) =>
                      update("metaTitle", event.target.value)
                    }
                    placeholder="Leave blank to use the article title"
                    style={inputStyle}
                  />
                </div>

                <div style={{ marginBottom: "18px" }}>
                  <label htmlFor="metaDescription" style={labelStyle}>
                    Meta description
                  </label>

                  <textarea
                    id="metaDescription"
                    rows={3}
                    maxLength={320}
                    value={form.metaDescription}
                    onChange={(event) =>
                      update("metaDescription", event.target.value)
                    }
                    placeholder="Leave blank to use the short description"
                    style={{ ...inputStyle, resize: "vertical" }}
                  />
                </div>

                <div style={{ marginBottom: "18px" }}>
                  <label htmlFor="keywords" style={labelStyle}>
                    SEO keywords
                  </label>

                  <input
                    id="keywords"
                    value={form.keywords}
                    onChange={(event) =>
                      update("keywords", event.target.value)
                    }
                    placeholder="B2B sourcing, procurement, business growth"
                    style={inputStyle}
                  />

                  <small style={{ color: "#64748b" }}>
                    Separate keywords with commas.
                  </small>
                </div>

                <div>
                  <label htmlFor="tags" style={labelStyle}>
                    Article tags
                  </label>

                  <input
                    id="tags"
                    value={form.tags}
                    onChange={(event) => update("tags", event.target.value)}
                    placeholder="Suppliers, Marketing, Business"
                    style={inputStyle}
                  />

                  <small style={{ color: "#64748b" }}>
                    Separate tags with commas.
                  </small>
                </div>
              </div>

              {error && (
                <p
                  role="alert"
                  style={{
                    color: "#b91c1c",
                    background: "#fef2f2",
                    border: "1px solid #fecaca",
                    borderRadius: "9px",
                    padding: "13px",
                    lineHeight: 1.7,
                    overflowWrap: "anywhere",
                  }}
                >
                  {error}
                </p>
              )}

              <p
                style={{
                  color: "#64748b",
                  fontSize: "13px",
                  lineHeight: 1.8,
                  margin: "20px 0",
                }}
              >
                By publishing, you confirm that you have permission to publish
                this content and media. Published articles are public
                immediately. Only upload content you have rights to use.
              </p>

              <button
                type="submit"
                disabled={loading}
                style={{
                  ...primaryButtonStyle,
                  width: "100%",
                  background: loading ? "#94a3b8" : "#2563eb",
                  cursor: loading ? "wait" : "pointer",
                  fontSize: "15px",
                }}
              >
                {loading ? "Uploading media and publishing..." : "Publish Blog"}
              </button>

              {loading && (
                <p
                  style={{
                    textAlign: "center",
                    color: "#64748b",
                    fontSize: "13px",
                    lineHeight: 1.7,
                  }}
                >
                  Please keep this page open while your media is uploading.
                </p>
              )}
            </form>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}
