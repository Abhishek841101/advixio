
"use client";

import { useState } from "react";

type ArticleActionsProps = {
  title: string;
};

export default function ArticleActions({
  title,
}: ArticleActionsProps) {
  const [helpful, setHelpful] = useState(false);
  const [copied, setCopied] = useState(false);

  // Helpful button
  const handleHelpful = () => {
    setHelpful((previous) => !previous);
  };

  // Share article
  const handleShare = async () => {
    const articleUrl = window.location.href;

    try {
      if (navigator.share) {
        await navigator.share({
          title: title,
          text: `Read this article: ${title}`,
          url: articleUrl,
        });
      } else {
        await navigator.clipboard.writeText(articleUrl);
        setCopied(true);

        setTimeout(() => {
          setCopied(false);
        }, 2000);
      }
    } catch (error) {
      if (error instanceof Error && error.name !== "AbortError") {
        console.error("Share failed:", error);
      }
    }
  };

  // Copy article link
  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(
        window.location.href
      );

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error("Unable to copy link:", error);
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-3">

      {/* Helpful Button */}
      <button
        type="button"
        onClick={handleHelpful}
        aria-pressed={helpful}
        className={`inline-flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-semibold transition ${
          helpful
            ? "border-blue-600 bg-blue-50 text-blue-700"
            : "border-slate-200 bg-white text-slate-700 hover:border-blue-400 hover:text-blue-600"
        }`}
      >
        <span aria-hidden="true">
          {helpful ? "♥" : "♡"}
        </span>

        {helpful ? "Helpful" : "Was this helpful?"}
      </button>

      {/* Share Button */}
      <button
        type="button"
        onClick={handleShare}
        className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-blue-400 hover:text-blue-600"
      >
        <span aria-hidden="true">↗</span>
        Share
      </button>

      {/* Copy Link Button */}
      <button
        type="button"
        onClick={handleCopyLink}
        className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-blue-400 hover:text-blue-600"
      >
        <span aria-hidden="true">
          {copied ? "✓" : "🔗"}
        </span>

        {copied ? "Copied!" : "Copy Link"}
      </button>

    </div>
  );
}
