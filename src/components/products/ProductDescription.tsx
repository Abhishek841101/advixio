
"use client";

import { useState } from "react";

type Props = {
  description: string;
  maxLength?: number;
};

export default function ProductDescription({
  description,
  maxLength = 350,
}: Props) {
  const [expanded, setExpanded] = useState(false);

  const text = description?.trim() || "No product description available.";
  const isLong = text.length > maxLength;

  const visibleText =
    expanded || !isLong
      ? text
      : `${text.slice(0, maxLength).trimEnd()}...`;

  return (
    <div>
      <p className="whitespace-pre-line break-words leading-7 text-slate-600">
        {visibleText}
      </p>

      {isLong && (
        <button
          type="button"
          onClick={() => setExpanded((current) => !current)}
          className="mt-2 inline-flex font-bold text-violet-700 transition hover:text-violet-900"
          aria-expanded={expanded}
        >
          {expanded ? "Read Less ↑" : "Read More ↓"}
        </button>
      )}
    </div>
  );
}
