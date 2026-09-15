"use client";

import { useEffect } from "react";

/**
 * Fades/slides each section's content in as it scrolls into view. Renders
 * nothing itself — attaches [data-reveal] to section containers, which
 * globals.css uses to animate. Skipped when the visitor prefers reduced
 * motion or IntersectionObserver isn't available; content just stays visible.
 */
export function ScrollReveal() {
  useEffect(() => {
    const prefersMotion = window.matchMedia("(prefers-reduced-motion: no-preference)").matches;
    if (!prefersMotion || !("IntersectionObserver" in window)) return;

    const targets = document.querySelectorAll<HTMLElement>(".section > .container");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );

    targets.forEach((target) => {
      target.setAttribute("data-reveal", "");
      observer.observe(target);
    });

    return () => observer.disconnect();
  }, []);

  return null;
}
