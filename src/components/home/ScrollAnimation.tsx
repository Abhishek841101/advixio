
"use client";

import { useEffect } from "react";

export default function ScrollAnimation() {
  useEffect(() => {
    const sections = document.querySelectorAll(
      ".page-scroll > .hero, .page-scroll > .scroll-section"
    );

    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("scroll-reveal", "is-revealed", "active");
          } else {
            entry.target.classList.remove("is-revealed", "active");
          }
        });
      },
      {
        threshold: 0.12,
      }
    );

    sections.forEach((section) => {
      section.classList.add("scroll-reveal");
      observer.observe(section);
    });

    return () => observer.disconnect();
  }, []);

  return null;
}
