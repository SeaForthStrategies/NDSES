// Every route the app renders, including one instance of each dynamic route.
const nextRoutes = [
  "/",
  "/about",
  "/residential",
  "/residential/town-of-walworth",
  "/commercial",
  "/dumpster-rentals",
  "/dumpster-calculator",
  "/special-events",
  "/faqs",
  "/contact",
  "/request-service",
  "/make-a-payment",
  "/whats-new",
  "/service-notices",
  "/service-notices/local-alerts-placeholder",
  "/privacy-policy",
  "/terms"
];

// The WordPress theme (E2E_TARGET=wp) serves the same pages with trailing
// slashes; it has no /request-service or /service-notices routes.
const wordpressRoutes = [
  "/",
  "/about/",
  "/residential/",
  "/residential/town-of-walworth/",
  "/commercial/",
  "/dumpster-rentals/",
  "/dumpster-calculator/",
  "/special-events/",
  "/faqs/",
  "/contact/",
  "/make-a-payment/",
  "/whats-new/",
  "/terms/"
];

export const routes = process.env.E2E_TARGET === "wp" ? wordpressRoutes : nextRoutes;

export const widths = [320, 375, 390, 430, 768, 1024, 1280, 1440, 1920];
