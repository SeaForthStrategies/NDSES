import { expect, test, type Page } from "@playwright/test";
import { mkdirSync, writeFileSync } from "node:fs";
import { routes, widths } from "./routes";

type Finding = { route: string; width: number; kind: string; detail: string };

// Measures the rendered page: horizontal overflow, text boxes that overlap
// other text, and text clipped by its container.
async function measure(page: Page) {
  return page.evaluate(() => {
    const out: { kind: string; detail: string }[] = [];
    const doc = document.documentElement;
    if (doc.scrollWidth > doc.clientWidth + 1) {
      const wide = [...document.querySelectorAll<HTMLElement>("body *")]
        .filter((el) => el.getBoundingClientRect().right > doc.clientWidth + 1 && getComputedStyle(el).position !== "fixed")
        .slice(0, 3)
        .map((el) => `${el.tagName.toLowerCase()}.${[...el.classList].join(".")}`);
      out.push({ kind: "horizontal-overflow", detail: `${doc.scrollWidth}px > ${doc.clientWidth}px (${wide.join(", ")})` });
    }

    const label = (el: Element) => `${el.tagName.toLowerCase()}${el.className && typeof el.className === "string" ? "." + el.className.trim().split(/\s+/).join(".") : ""} "${(el.textContent ?? "").trim().slice(0, 40)}"`;
    const visible = (el: Element) => {
      // Content of a closed <details> (other than its summary) isn't shown,
      // even though Chrome still reports layout boxes for it.
      for (let d = el.closest("details"); d; d = d.parentElement?.closest("details") ?? null) {
        const inOwnSummary = [...d.children].some((c) => c.tagName === "SUMMARY" && c.contains(el));
        if (!d.open && !inOwnSummary) return false;
      }
      if (el.closest("[inert]")) return false;
      const cs = getComputedStyle(el);
      return cs.visibility !== "hidden" && cs.display !== "none" && Number(cs.opacity) > 0.05;
    };

    // One box per text node, measured with a Range so it covers the glyphs.
    const boxes: { el: Element; r: DOMRect }[] = [];
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    while (walker.nextNode()) {
      const node = walker.currentNode as Text;
      const parent = node.parentElement;
      if (!parent || !node.textContent?.trim() || !visible(parent) || parent.closest("script,style,noscript,[hidden],[aria-hidden='true'],.sr-only")) continue;
      const range = document.createRange();
      range.selectNodeContents(node);
      for (const r of range.getClientRects()) if (r.width > 2 && r.height > 2) boxes.push({ el: parent, r });
    }
    const seen = new Set<string>();
    for (let i = 0; i < boxes.length; i++) {
      for (let j = i + 1; j < boxes.length; j++) {
        const a = boxes[i], b = boxes[j];
        if (a.el === b.el) continue;
        const w = Math.min(a.r.right, b.r.right) - Math.max(a.r.left, b.r.left);
        const h = Math.min(a.r.bottom, b.r.bottom) - Math.max(a.r.top, b.r.top);
        if (w > 3 && h > 3) {
          const key = `${label(a.el)}|${label(b.el)}`;
          if (!seen.has(key)) {
            seen.add(key);
            out.push({ kind: "text-overlap", detail: `${label(a.el)} ⟷ ${label(b.el)}` });
          }
        }
      }
    }

    for (const el of document.querySelectorAll<HTMLElement>("h1,h2,h3,h4,p,a,button,li,label,dt,dd,span,strong,summary")) {
      if (!visible(el) || !el.textContent?.trim()) continue;
      const cs = getComputedStyle(el);
      const clips = cs.overflow === "hidden" || cs.overflowX === "hidden" || cs.textOverflow === "ellipsis";
      if (clips && (el.scrollWidth > el.clientWidth + 2 || el.scrollHeight > el.clientHeight + 2)) {
        out.push({ kind: "clipped-text", detail: label(el) });
      }
    }
    return out.slice(0, 40);
  });
}

const findings: Finding[] = [];
const shotWidths = new Set([390, 1440]);
const phase = process.env.AUDIT_PHASE ?? "current";

test.describe.configure({ mode: "parallel" });

for (const route of routes) {
  test(`layout ${route}`, async ({ page }) => {
    const errors: string[] = [];
    page.on("console", (msg) => { if (msg.type() === "error") errors.push(`${msg.text().slice(0, 120)} @ ${msg.location().url}`); });
    page.on("pageerror", (err) => errors.push(err.message.slice(0, 160)));
    page.on("requestfailed", (req) => errors.push(`request failed: ${req.url()}`));
    page.on("response", (res) => { if (res.status() >= 400 && !res.url().includes("/_next/webpack-hmr")) errors.push(`HTTP ${res.status()}: ${res.url()}`); });

    for (const width of widths) {
      await page.setViewportSize({ width, height: 900 });
      // Reduced motion before load, so scroll-reveal never hides content.
      await page.emulateMedia({ reducedMotion: "reduce" });
      await page.goto(route, { waitUntil: "networkidle" });
      await page.waitForTimeout(150);
      for (const f of await measure(page)) findings.push({ route, width, ...f });
      if (shotWidths.has(width)) {
        const dir = `test-results/screens/${phase}`;
        mkdirSync(dir, { recursive: true });
        await page.screenshot({ path: `${dir}/${route === "/" ? "home" : route.slice(1).replace(/\//g, "_")}-${width}.png`, fullPage: true });
      }
    }
    for (const e of [...new Set(errors)]) findings.push({ route, width: 0, kind: "console-or-network", detail: e });
    mkdirSync("test-results/audit", { recursive: true });
    writeFileSync(`test-results/audit/${phase}-${route === "/" ? "home" : route.slice(1).replace(/\//g, "_")}.json`, JSON.stringify(findings.filter((f) => f.route === route), null, 2));
    expect.soft(findings.filter((f) => f.route === route), `layout findings on ${route}`).toEqual([]);
  });
}
