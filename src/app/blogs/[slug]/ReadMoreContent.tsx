
"use client";

import { useState } from "react";

type ReadMoreContentProps = {
  paragraphs: string[];
  previewParagraphs?: number;
};

export default function ReadMoreContent({
  paragraphs,
  previewParagraphs = 3,
}: ReadMoreContentProps) {
  const [expanded, setExpanded] = useState(false);

  if (!paragraphs.length) {
    return (
      <p className="text-slate-500">
        This article does not have any content yet.
      </p>
    );
  }

  const isLong = paragraphs.length > previewParagraphs;
  const visibleParagraphs =
    expanded || !isLong
      ? paragraphs
      : paragraphs.slice(0, previewParagraphs);

  return (
    <div>
      <div className="space-y-5">
        {visibleParagraphs.map((paragraph, index) => (
          <p
            key={index}
            className="whitespace-pre-line text-base leading-8 text-slate-700 sm:text-lg sm:leading-9"
          >
            {paragraph}
          </p>
        ))}
      </div>

      {isLong && (
        <button
          type="button"
          onClick={() => setExpanded((previous) => !previous)}
          aria-expanded={expanded}
          className="mt-5 inline-flex items-center gap-2 rounded-lg border border-indigo-200 bg-indigo-50 px-5 py-2.5 text-sm font-semibold text-indigo-700 transition hover:border-indigo-600 hover:bg-indigo-100"
        >
          {expanded ? "Read Less" : "Read More"}
          <span aria-hidden="true">{expanded ? "↑" : "↓"}</span>
        </button>
      )}
    </div>
  );
}
