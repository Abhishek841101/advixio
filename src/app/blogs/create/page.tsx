 "use client";

import {
  FormEvent,
  ChangeEvent,
  useEffect,
  useState,
} from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { EditorContent, useEditor } from "@tiptap/react";
import { Extension, Node } from "@tiptap/core";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Image from "@tiptap/extension-image";
import LinkExtension from "@tiptap/extension-link";
import TextAlign from "@tiptap/extension-text-align";
// import TextStyle from "@tiptap/extension-text-style";
import { TextStyle } from "@tiptap/extension-text-style";
import FontFamily from "@tiptap/extension-font-family";
import Color from "@tiptap/extension-color";
import Highlight from "@tiptap/extension-highlight";
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

const MAX_IMAGE_SIZE = 10 * 1024 * 1024;
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

const toolbarButtonStyle = {
  border: "1px solid #dbe3ef",
  borderRadius: "7px",
  background: "#ffffff",
  color: "#1e293b",
  padding: "8px 10px",
  fontSize: "13px",
  fontWeight: 700,
  cursor: "pointer",
};

const FontSize = Extension.create({
  name: "fontSize",
  addGlobalAttributes() {
    return [
      {
        types: ["textStyle"],
        attributes: {
          fontSize: {
            default: null,
            parseHTML: (element) => element.style.fontSize || null,
            renderHTML: (attributes) => {
              if (!attributes.fontSize) return {};
              return { style: `font-size: ${attributes.fontSize}` };
            },
          },
        },
      },
    ];
  },
});

const VideoEmbed = Node.create({
  name: "videoEmbed",
  group: "block",
  atom: true,
  addAttributes() {
    return {
      src: { default: null },
      title: { default: "Article video" },
    };
  },
  parseHTML() {
    return [{ tag: "video[src]" }];
  },
  renderHTML({ HTMLAttributes }) {
    return [
      "video",
      {
        ...HTMLAttributes,
        controls: "true",
        playsinline: "true",
        preload: "metadata",
        style: "display:block;width:100%;max-width:100%;border-radius:12px;margin:20px 0;",
      },
    ];
  },
});

function formatFileSize(bytes: number) {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function isValidMediaUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}

type RichTextEditorProps = {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
};

function RichTextEditor({
  value,
  onChange,
  disabled = false,
}: RichTextEditorProps) {
  const [fontSize, setFontSize] = useState("16px");
  const [fontFamily, setFontFamily] = useState("Arial");
  const [textColor, setTextColor] = useState("#1e293b");

  const editor = useEditor({
    immediatelyRender: false,
    editable: !disabled,
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
      }),
      Underline,
      TextStyle,
      FontFamily,
      FontSize,
      Color,
      Highlight.configure({ multicolor: true }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
        alignments: ["left", "center", "right", "justify"],
      }),
      Image.configure({
        inline: false,
        allowBase64: false,
        HTMLAttributes: {
          style:
            "display:block;max-width:100%;height:auto;border-radius:12px;margin:20px auto;",
        },
      }),
      LinkExtension.configure({
        openOnClick: false,
        autolink: true,
        HTMLAttributes: {
          target: "_blank",
          rel: "noopener noreferrer",
        },
      }),
      VideoEmbed,
    ],
    content: value || "<p></p>",
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
  });

  useEffect(() => {
    if (!editor) return;
    const current = editor.getHTML();
    if (value !== current) {
      editor.commands.setContent(value || "<p></p>", { emitUpdate: false });
    }
  }, [editor, value]);

  useEffect(() => {
    if (editor) editor.setEditable(!disabled);
  }, [editor, disabled]);

  if (!editor) {
    return (
      <div style={{ ...inputStyle, minHeight: "320px", color: "#64748b" }}>
        Loading article editor...
      </div>
    );
  }

  const run = (callback: () => void) => {
    if (!disabled) callback();
  };

  const addImageByUrl = () => {
    const url = window.prompt("Paste the image URL (https://...)");
    if (!url) return;
    if (!isValidMediaUrl(url)) {
      window.alert("Please enter a valid HTTP or HTTPS image URL.");
      return;
    }
    editor.chain().focus().setImage({ src: url, alt: "Article image" }).run();
  };

  const addVideoByUrl = () => {
    const url = window.prompt("Paste a direct video URL (MP4/WEBM/MOV hosted URL)");
    if (!url) return;
    if (!isValidMediaUrl(url)) {
      window.alert("Please enter a valid HTTP or HTTPS video URL.");
      return;
    }
    editor.chain().focus().insertContent({
      type: "videoEmbed",
      attrs: { src: url, title: "Article video" },
    }).run();
  };

  const addLink = () => {
    const url = window.prompt("Enter link URL");
    if (!url) return;
    if (!isValidMediaUrl(url)) {
      window.alert("Please enter a valid HTTP or HTTPS link.");
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };

  return (
    <div
      style={{
        border: "1px solid #cbd5e1",
        borderRadius: "12px",
        overflow: "hidden",
        background: "#ffffff",
      }}
    >
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          gap: "7px",
          padding: "12px",
          background: "#f8fafc",
          borderBottom: "1px solid #e2e8f0",
        }}
      >
        <button type="button" style={toolbarButtonStyle} disabled={disabled}
          onClick={() => run(() => editor.chain().focus().toggleBold().run())}>B</button>
        <button type="button" style={{ ...toolbarButtonStyle, fontStyle: "italic" }} disabled={disabled}
          onClick={() => run(() => editor.chain().focus().toggleItalic().run())}>I</button>
        <button type="button" style={{ ...toolbarButtonStyle, textDecoration: "underline" }} disabled={disabled}
          onClick={() => run(() => editor.chain().focus().toggleUnderline().run())}>U</button>
        <button type="button" style={{ ...toolbarButtonStyle, textDecoration: "line-through" }} disabled={disabled}
          onClick={() => run(() => editor.chain().focus().toggleStrike().run())}>S</button>

        <select
          aria-label="Text style"
          value={
            editor.isActive("heading", { level: 1 }) ? "h1" :
            editor.isActive("heading", { level: 2 }) ? "h2" :
            editor.isActive("heading", { level: 3 }) ? "h3" : "paragraph"
          }
          disabled={disabled}
          onChange={(event) => {
            const value = event.target.value;
            if (value === "paragraph") editor.chain().focus().setParagraph().run();
            else editor.chain().focus().toggleHeading({ level: Number(value[1]) as 1 | 2 | 3 }).run();
          }}
          style={{ ...toolbarButtonStyle, fontWeight: 500 }}
        >
          <option value="paragraph">Paragraph</option>
          <option value="h1">Heading 1</option>
          <option value="h2">Heading 2</option>
          <option value="h3">Heading 3</option>
        </select>

        <select
          aria-label="Font family"
          value={fontFamily}
          disabled={disabled}
          onChange={(event) => {
            const family = event.target.value;
            setFontFamily(family);
            editor.chain().focus().setFontFamily(family).run();
          }}
          style={{ ...toolbarButtonStyle, fontWeight: 500 }}
        >
          {["Arial", "Roboto", "Inter", "Poppins", "Georgia", "Times New Roman", "Verdana", "Trebuchet MS"].map((font) => (
            <option key={font} value={font}>{font}</option>
          ))}
        </select>

        <select
          aria-label="Font size"
          value={fontSize}
          disabled={disabled}
          onChange={(event) => {
            const size = event.target.value;
            setFontSize(size);
            editor.chain().focus().setMark("textStyle", { fontSize: size }).run();
          }}
          style={{ ...toolbarButtonStyle, fontWeight: 500 }}
        >
          {["12px", "14px", "16px", "18px", "20px", "24px", "28px", "32px", "40px", "48px"].map((size) => (
            <option key={size} value={size}>{size}</option>
          ))}
        </select>

        <label title="Text color" style={{ ...toolbarButtonStyle, display: "inline-flex", alignItems: "center", gap: "6px" }}>
          <span>A</span>
          <input
            type="color"
            value={textColor}
            disabled={disabled}
            onChange={(event) => {
              setTextColor(event.target.value);
              editor.chain().focus().setColor(event.target.value).run();
            }}
            style={{ width: "22px", height: "20px", border: 0, padding: 0, cursor: "pointer" }}
          />
        </label>

        <button type="button" style={toolbarButtonStyle} disabled={disabled}
          onClick={() => run(() => editor.chain().focus().toggleHighlight().run())}>Highlight</button>
        <button type="button" style={toolbarButtonStyle} disabled={disabled}
          onClick={() => run(() => editor.chain().focus().toggleBulletList().run())}>• List</button>
        <button type="button" style={toolbarButtonStyle} disabled={disabled}
          onClick={() => run(() => editor.chain().focus().toggleOrderedList().run())}>1. List</button>

        <select
          aria-label="Text alignment"
          defaultValue="left"
          disabled={disabled}
          onChange={(event) => editor.chain().focus().setTextAlign(event.target.value as any).run()}
          style={{ ...toolbarButtonStyle, fontWeight: 500 }}
        >
          <option value="left">Align left</option>
          <option value="center">Align center</option>
          <option value="right">Align right</option>
          <option value="justify">Justify</option>
        </select>

        <button type="button" style={toolbarButtonStyle} disabled={disabled}
          onClick={addLink}>Add link</button>
        <button type="button" style={toolbarButtonStyle} disabled={disabled}
          onClick={addImageByUrl}>+ Image</button>
        <button type="button" style={toolbarButtonStyle} disabled={disabled}
          onClick={addVideoByUrl}>+ Video</button>
        <button type="button" style={toolbarButtonStyle} disabled={disabled}
          onClick={() => run(() => editor.chain().focus().undo().run())}>Undo</button>
        <button type="button" style={toolbarButtonStyle} disabled={disabled}
          onClick={() => run(() => editor.chain().focus().redo().run())}>Redo</button>
      </div>

      <EditorContent
        editor={editor}
        className="blog-rich-editor"
      />
      <style jsx global>{`
        .blog-rich-editor .tiptap {
          min-height: 360px;
          padding: 22px;
          outline: none;
          color: #1e293b;
          font-family: Arial, sans-serif;
          font-size: 16px;
          line-height: 1.85;
          overflow-wrap: anywhere;
        }
        .blog-rich-editor .tiptap p { margin: 0 0 1em; }
        .blog-rich-editor .tiptap h1 { font-size: 2.1rem; line-height: 1.2; margin: 1.1em 0 .55em; }
        .blog-rich-editor .tiptap h2 { font-size: 1.7rem; line-height: 1.3; margin: 1em 0 .5em; }
        .blog-rich-editor .tiptap h3 { font-size: 1.35rem; line-height: 1.4; margin: .9em 0 .45em; }
        .blog-rich-editor .tiptap ul, .blog-rich-editor .tiptap ol { padding-left: 1.5rem; margin: .8em 0; }
        .blog-rich-editor .tiptap img { display: block; max-width: 100%; height: auto; border-radius: 12px; margin: 20px auto; }
        .blog-rich-editor .tiptap video { display: block; width: 100%; max-width: 100%; border-radius: 12px; margin: 20px 0; }
        .blog-rich-editor .tiptap a { color: #2563eb; text-decoration: underline; }
        .blog-rich-editor .tiptap blockquote { border-left: 4px solid #93c5fd; padding-left: 1rem; color: #475569; margin: 1rem 0; }
        .blog-rich-editor .tiptap p.is-editor-empty:first-child::before { color: #94a3b8; content: "Start writing your article. Use the toolbar to format text or insert media..."; float: left; height: 0; pointer-events: none; }
      `}</style>
    </div>
  );
}

export default function CreateBlogPage() {
  const router = useRouter();

  const [form, setForm] = useState<FormState>(initialForm);
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState("");
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

  function update(field: keyof FormState, value: string) {
    setForm((previous) => ({ ...previous, [field]: value }));
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
    setError("");
    setCoverImage(file);
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
    if (!content || content === "<p></p>") {
      setError("Please write your article content.");
      return;
    }
    if (content.length > MAX_CONTENT_LENGTH) {
      setError("Article content cannot exceed 200,000 characters.");
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

      const tags = form.tags.split(",").map((tag) => tag.trim()).filter(Boolean);
      const keywords = form.keywords.split(",").map((keyword) => keyword.trim()).filter(Boolean);

      payload.append("tags", JSON.stringify(tags));
      payload.append(
        "seo",
        JSON.stringify({
          metaTitle: form.metaTitle.trim() || title,
          metaDescription: form.metaDescription.trim() || excerpt,
          keywords,
        })
      );

      if (coverImage) payload.append("coverImage", coverImage);

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
          "The server accepted the request but did not return an article slug."
        );
      }

      setSuccessSlug(slug);
      setSuccessMessage(result.message || "Your article has been published successfully.");
      setForm(initialForm);
      setCoverImage(null);
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
          background: "linear-gradient(120deg, #020617, #0b1f4b 60%, #173e86)",
          color: "#ffffff",
          padding: "48px 20px",
        }}
      >
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          <Link
            href="/blogs"
            style={{ color: "#bfdbfe", fontSize: "14px", textDecoration: "none", fontWeight: 700 }}
          >
            ← Back to Blogs
          </Link>
          <p style={{ color: "#67e8f9", fontWeight: 800, letterSpacing: "2px", fontSize: "12px", marginTop: "28px" }}>
            ADVIXIO360 COMMUNITY
          </p>
          <h1 style={{ fontSize: "clamp(32px, 5vw, 46px)", margin: "12px 0", lineHeight: 1.15 }}>
            Create a Blog
          </h1>
          <p style={{ color: "#dbeafe", lineHeight: 1.8, maxWidth: "680px" }}>
            Write and format your article, insert images and videos inside the article, and publish your business knowledge on Advixio360.
          </p>
        </div>
      </section>

      <section style={{ padding: "38px 20px 65px" }}>
        <div
          style={{
            maxWidth: "1000px",
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
              <div style={{ width: "54px", height: "54px", borderRadius: "50%", background: "#d1fae5", color: "#047857", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "28px", fontWeight: 800 }}>
                ✓
              </div>
              <h2 style={{ color: "#047857", fontSize: "27px", marginTop: "20px" }}>
                Blog published successfully!
              </h2>
              <p style={{ color: "#475569", lineHeight: 1.8 }}>{successMessage}</p>
              <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", marginTop: "24px" }}>
                <button type="button" onClick={() => router.push(`/blogs/${successSlug}`)} style={primaryButtonStyle}>
                  Read Published Blog
                </button>
                <Link href="/blogs" style={{ ...primaryButtonStyle, background: "#eaf1fb", color: "#1d4ed8", textDecoration: "none", display: "inline-flex", alignItems: "center" }}>
                  View All Blogs
                </Link>
                <button
                  type="button"
                  onClick={() => { setSuccessSlug(""); setSuccessMessage(""); }}
                  style={{ ...primaryButtonStyle, background: "#0f172a" }}
                >
                  Create Another Blog
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: "24px" }}>
                <label htmlFor="title" style={labelStyle}>Article title *</label>
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
                <small style={{ color: "#64748b" }}>{form.title.length}/200 characters</small>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 240px), 1fr))", gap: "20px", marginBottom: "24px" }}>
                <div>
                  <label htmlFor="author" style={labelStyle}>Author name *</label>
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
                  <label htmlFor="category" style={labelStyle}>Category *</label>
                  <select
                    id="category"
                    value={form.category}
                    onChange={(event) => update("category", event.target.value)}
                    style={inputStyle}
                  >
                    {categories.map((category) => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={{ marginBottom: "24px" }}>
                <label htmlFor="excerpt" style={labelStyle}>Short description *</label>
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
                <small style={{ color: "#64748b" }}>{form.excerpt.length}/500 characters</small>
              </div>

              <div style={{ marginBottom: "28px", padding: "20px", background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "12px" }}>
                <h2 style={{ fontSize: "18px", margin: "0 0 8px", color: "#10244e" }}>Cover image</h2>
                <p style={{ fontSize: "13px", color: "#64748b", lineHeight: 1.7 }}>
                  Optional. JPG, PNG or WEBP; maximum 10 MB. This is the blog thumbnail/cover image. Add other images inside the article editor.
                </p>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleCoverChange}
                  style={{ ...inputStyle, padding: "10px", background: "#ffffff" }}
                />
                {coverImage && (
                  <div style={{ marginTop: "14px" }}>
                    {coverPreview && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={coverPreview}
                        alt="Cover image preview"
                        style={{ display: "block", width: "100%", maxWidth: "320px", maxHeight: "220px", objectFit: "cover", borderRadius: "10px", marginBottom: "10px" }}
                      />
                    )}
                    <p style={{ fontSize: "13px", color: "#334155" }}>
                      {coverImage.name} · {formatFileSize(coverImage.size)}
                    </p>
                    <button
                      type="button"
                      onClick={() => setCoverImage(null)}
                      style={{ ...primaryButtonStyle, padding: "9px 13px", background: "#fee2e2", color: "#b91c1c" }}
                    >
                      Remove cover
                    </button>
                  </div>
                )}
              </div>

              <div style={{ marginBottom: "28px" }}>
                <label style={labelStyle}>Full article *</label>
                <RichTextEditor
                  value={form.content}
                  onChange={(value) => update("content", value)}
                  disabled={loading}
                />
                <small style={{ color: "#64748b", display: "block", marginTop: "8px" }}>
                  {form.content.length.toLocaleString()} / {MAX_CONTENT_LENGTH.toLocaleString()} characters. Use + Image or + Video in the editor toolbar to insert media at the cursor.
                </small>
                <p style={{ color: "#b45309", fontSize: "12px", lineHeight: 1.6, marginTop: "8px" }}>
                  Note: In this version, inline media is inserted using an existing public HTTP/HTTPS URL. Direct upload from your computer into the editor will be connected to your Cloudinary backend in the next step.
                </p>
              </div>

              <div style={{ marginBottom: "28px", padding: "20px", border: "1px solid #dbeafe", background: "#eff6ff", borderRadius: "12px" }}>
                <h2 style={{ fontSize: "18px", margin: "0 0 18px", color: "#10244e" }}>SEO settings (optional)</h2>
                <div style={{ marginBottom: "18px" }}>
                  <label htmlFor="metaTitle" style={labelStyle}>SEO title</label>
                  <input id="metaTitle" maxLength={200} value={form.metaTitle} onChange={(event) => update("metaTitle", event.target.value)} placeholder="Leave blank to use the article title" style={inputStyle} />
                </div>
                <div style={{ marginBottom: "18px" }}>
                  <label htmlFor="metaDescription" style={labelStyle}>Meta description</label>
                  <textarea id="metaDescription" rows={3} maxLength={320} value={form.metaDescription} onChange={(event) => update("metaDescription", event.target.value)} placeholder="Leave blank to use the short description" style={{ ...inputStyle, resize: "vertical" }} />
                </div>
                <div style={{ marginBottom: "18px" }}>
                  <label htmlFor="keywords" style={labelStyle}>SEO keywords</label>
                  <input id="keywords" value={form.keywords} onChange={(event) => update("keywords", event.target.value)} placeholder="B2B sourcing, procurement, business growth" style={inputStyle} />
                  <small style={{ color: "#64748b" }}>Separate keywords with commas.</small>
                </div>
                <div>
                  <label htmlFor="tags" style={labelStyle}>Article tags</label>
                  <input id="tags" value={form.tags} onChange={(event) => update("tags", event.target.value)} placeholder="Suppliers, Marketing, Business" style={inputStyle} />
                  <small style={{ color: "#64748b" }}>Separate tags with commas.</small>
                </div>
              </div>

              {error && (
                <p role="alert" style={{ color: "#b91c1c", background: "#fef2f2", border: "1px solid #fecaca", borderRadius: "9px", padding: "13px", lineHeight: 1.7, overflowWrap: "anywhere" }}>
                  {error}
                </p>
              )}

              <p style={{ color: "#64748b", fontSize: "13px", lineHeight: 1.8, margin: "20px 0" }}>
                By publishing, you confirm that you have permission to publish this content and media. Published articles are public immediately. Only upload content you have rights to use.
              </p>

              <button
                type="submit"
                disabled={loading}
                style={{ ...primaryButtonStyle, width: "100%", background: loading ? "#94a3b8" : "#2563eb", cursor: loading ? "wait" : "pointer", fontSize: "15px" }}
              >
                {loading ? "Publishing article..." : "Publish Blog"}
              </button>
              {loading && (
                <p style={{ textAlign: "center", color: "#64748b", fontSize: "13px", lineHeight: 1.7 }}>
                  Please keep this page open while your article is being published.
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
