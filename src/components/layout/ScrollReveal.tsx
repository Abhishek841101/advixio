
"use client";

import { useEffect, useSyncExternalStore } from "react";

const subscribe = () => () => {};
const getSnapshot = () => true;
const getServerSnapshot = () => false;

export default function ScrollReveal({
  children,
}: {
  children: React.ReactNode;
}) {
  // Wait until React has finished hydrating before touching the DOM.
  // Mutating classes during the first effect can race with streamed
  // server components and produce a hydration mismatch.
  const hydrated = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot
  );

  useEffect(() => {
    if (!hydrated) return;

    const elements = document.querySelectorAll<HTMLElement>(
      "main section:not([data-no-reveal]), main article:not([data-no-reveal]), main [data-reveal]"
    );

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (reduceMotion || !("IntersectionObserver" in window)) {
      elements.forEach((element) => {
        element.classList.add("is-revealed");
      });
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-revealed");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.08,
        rootMargin: "0px 0px -35px 0px",
      }
    );

    elements.forEach((element) => {
      element.classList.add("scroll-reveal");
      observer.observe(element);
    });

    return () => observer.disconnect();
  }, [hydrated]);

  return <>{children}</>;
}
