# NDSES UI/UX Remediation

Tracking document for the frontend remediation and redesign. Status is only **Done** after the change is implemented **and** verified in a real browser (Playwright on installed Google Chrome, plus manual screenshot review).

- Branch: `ui-redesign`
- Order: Next.js app (Vercel) first, then port the design to the WordPress theme (`wordpress/ndses-theme`, the Flywheel site).
- Browser tooling: `npm run test:e2e` (Playwright, `channel: "chrome"`). `e2e/layout-audit.spec.ts` measures every route at 320 / 375 / 390 / 430 / 768 / 1024 / 1280 / 1440 / 1920px for horizontal overflow, text that overlaps other text, clipped text, console errors, and failed requests, and saves full-page screenshots at 390 and 1440px to `test-results/screens/<phase>/`. `e2e/navigation.spec.ts` tests menu behavior.

## 1. Why earlier changes "did nothing" (root causes)

| # | Cause | Evidence |
| --- | --- | --- |
| R1 | **No overhaul was ever implemented.** | `git log --all` since 2026-10-15 shows only content, CMS, docs, and hero commits (`d30ebc0`…`88a62fc`). No branch or PR contains UI/UX overhaul work. |
| R2 | **Two separate frontends.** Vercel serves the Next.js app; Flywheel serves the WordPress theme. Changes to one never appear on the other. | Vercel Production deployment is commit `0d638db` at `ndses-m2cnoersv-seaforthstrategies.vercel.app`; `ndses.flywheelsites.com` renders `wordpress/ndses-theme` (`theme.css?ver=…`). |
| R3 | **Vercel Production lags the repo.** The truck-photo hero (PR #2) only exists as a Preview deployment. | GitHub deployments: Production `0d638db`; Previews `5743e35`, `88a62fc`. |
| R4 | **Dropdowns stick open by design.** Every menu is a native `<details>` element in a Server Component with no JavaScript, so it only toggles on click and ignores pointer-leave, outside clicks, Escape, and route changes. The header persists across client-side navigation, so an open menu stays open on the next page. | `components/layout/Header.tsx` (`<details className="nav-menu">`, `<details className="mobile-nav-panel">`). |
| R5 | **Stylesheet cancels its own fixes.** `app/globals.css` (2,052 lines) redefines the same selectors in seven media blocks and appended "override" sections, so a fix in one place is undone by a later rule. | e.g. `.hero` defined at lines 574, 1538, 1713; `.hero-meta` at 628, 1552, 1741, 1816; `.nav-menu summary` at 436 and 456. |

## 2. Route inventory

| Route | Template / key components | Phase |
| --- | --- | --- |
| `/` | Home: hero, action dock, notices, `SectionRenderer`, `DumpsterCard`, `ServiceAreaMap`, `FAQAccordion`, CTA band | B |
| `/residential` | Page hero, community cards, `ScheduleCalendar`, recycling lists, bulk items | C |
| `/residential/[communitySlug]` (5) | Page hero, schedule card, `ServiceNoticeList`, zone map, `DownloadList`, `FAQSection` | C |
| `/commercial` | Page hero, service-area map image, container cards, recycling, `FAQSection` | C |
| `/dumpster-rentals` | Page hero, `DumpsterCard` grid, materials lists, `RentalProcess`, `DumpsterGuide`, `InquiryForm` | C |
| `/dumpster-calculator` | Page hero, `DumpsterCalculator`, `DumpsterCard` grid | C |
| `/special-events` | Page hero, `SectionRenderer`, `InquiryForm` | C |
| `/about` | Page hero, Our Story, mission, `ServiceAreaMap`, team placeholder | D |
| `/contact` | Page hero, `InquiryForm`, contact card, notices | D |
| `/request-service` | Page hero (inline), `InquiryForm` | D |
| `/make-a-payment` | Page hero, `PaymentForm` (PayEngine SecureFields) | D |
| `/faqs` | Page hero, `FAQAccordion` per category | D |
| `/whats-new`, `/service-notices`, `/service-notices/[slug]` | Page hero, `ServiceNoticeList` / notice detail | D |
| `/privacy-policy`, `/terms` | Legal page hero + card | D |
| `/api/*` | Forms, payments, webhook, geocode, revalidate (no UI) | Preserve |

Shared across every route: `app/layout.tsx`, `AnnouncementBar`, `Header`, `Footer`, `ServiceNoticePopup`, `ScrollReveal`, `app/globals.css`.

## 3. Defects

Severity: **Critical** (broken interaction or unreadable content), **High** (clear visual or usability failure), **Medium**, **Low**.

| ID | Area | Defect | Severity | Status | Verified |
| --- | --- | --- | --- | --- | --- |
| G1 | Header nav | Dropdowns open only on click, never close on pointer-leave, outside click, or Escape; stay open after navigating (R4). | Critical | Open | — |
| G2 | Mobile nav | Native `<details>` sheet: no scroll lock, stays open after navigation, nested `<details>` per section, no `aria-expanded`. | Critical | Open | — |
| G3 | Global CSS | Conflicting duplicate rules across breakpoints (R5). | High | Open | — |
| G4 | Typography | No defined type scale or brand typefaces; system font stack; headline sizes vary by page. | High | Open | — |
| G5 | Footer | Plain three-column text list; no hours, no clear contact CTA, nav labels repeated without grouping. | Medium | Open | — |
| G6 | Public copy | Developer notes shown to visitors: "Client-supplied … from the NDS Website Redesign workbook" captions (Home/About/Residential/Commercial), "no Facebook integration" (What's New), "Payment and ACH form placeholder" (nav). | Medium | Open | — |
| G7 | Forms | Error messages aren't linked to fields (`aria-describedby`/`aria-invalid` missing); focus styles inconsistent. | Medium | Open | — |
| G8 | Console | PayEngine SDK logs "You must pass your Public API…" on `/make-a-payment` when no public key is configured; a 404 resource on most routes (to be traced). | Low | Open | — |
| H1 | Home | "Why NDS" text-image section renders an empty grey `image-placeholder` box. | High | Open | — |
| H2 | Home | Five dumpster cards squeezed into five columns at 1024–1280px. | Medium | Open | — |
| H3 | Home | Decorative "01 / 02 / 03" numbering on service cards that aren't a sequence. | Low | Open | — |
| C1 | Service pages | Every inner page uses the same pale text-only page hero; no imagery or hierarchy. | High | Open | — |
| C2 | Cards | Card padding, radius, and shadow differ between card types; lists inside cards unstyled. | Medium | Open | — |

Baseline audit (`AUDIT_PHASE=before`): no horizontal overflow or clipped text at any width; the overlap check's hits were inside closed menus (not visible) and have been excluded from the measurement; console/network issues per G8.

## 4. Phases

| Phase | Scope | Status |
| --- | --- | --- |
| A | Tokens, typography, layout, header, navigation, footer, shared interactions | In progress |
| B | Homepage | Not started |
| C | Residential, community, commercial, dumpster rentals, calculator, special events | Not started |
| D | About, contact, request service, payment, FAQs, notices, legal | Not started |
| E | Regression: all routes × widths, nav tests, typecheck/lint/unit/build | Not started |
| WP | Port design to `wordpress/ndses-theme` | Not started |
