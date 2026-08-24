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
            entry.target.classList.add("active");
          }
        });
      },
      {
        threshold: 0.1,
      }
    );

    sections.forEach((section) => {
      observer.observe(section);
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  return null;
}