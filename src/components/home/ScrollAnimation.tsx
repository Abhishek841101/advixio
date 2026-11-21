
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
            // Reveal once — never remove the classes again, otherwise the
            // section re-enters its hidden state on every threshold crossing
            // and the long fade/slide transition restarts, causing vibration.
            observer.unobserve(entry.target);
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
