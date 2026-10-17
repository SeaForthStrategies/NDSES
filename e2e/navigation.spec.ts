import { expect, test } from "@playwright/test";

const desktop = { width: 1440, height: 900 };
const mobile = { width: 390, height: 844 };

test.describe("desktop navigation", () => {
  test.use({ viewport: desktop });

  test.beforeEach(async ({ page }) => {
    await page.goto(process.env.E2E_TARGET === "wp" ? "/about/" : "/about");
  });

  const trigger = (page: import("@playwright/test").Page, name: string) => page.getByRole("navigation", { name: "Primary" }).getByRole("button", { name });
  const panel = (page: import("@playwright/test").Page, index: number) => page.locator(`#nav-menu-${index}`);

  test("hover opens, leaving the trigger and menu closes", async ({ page }) => {
    await trigger(page, "Residential").hover();
    await expect(panel(page, 0)).toBeVisible();
    await expect(trigger(page, "Residential")).toHaveAttribute("aria-expanded", "true");

    // Move down through the gap into the menu: it must stay open.
    const box = (await trigger(page, "Residential").boundingBox())!;
    await page.mouse.move(box.x + box.width / 2, box.y + box.height + 4, { steps: 4 });
    await page.mouse.move(box.x + 40, box.y + box.height + 60, { steps: 6 });
    await page.waitForTimeout(300);
    await expect(panel(page, 0)).toBeVisible();

    // Leave the whole trigger + menu region: it closes.
    await page.mouse.move(700, 700, { steps: 8 });
    await expect(panel(page, 0)).toBeHidden({ timeout: 1000 });
    await expect(trigger(page, "Residential")).toHaveAttribute("aria-expanded", "false");
  });

  test("moving across triggers switches menus without leaving one stuck", async ({ page }) => {
    await trigger(page, "Residential").hover();
    await expect(panel(page, 0)).toBeVisible();
    await trigger(page, "Commercial").hover();
    await expect(panel(page, 1)).toBeVisible();
    await expect(panel(page, 0)).toBeHidden();
  });

  test("a mouse click on an open trigger keeps it open", async ({ page }) => {
    await trigger(page, "Commercial").hover();
    await trigger(page, "Commercial").click();
    await expect(panel(page, 1)).toBeVisible();
  });

  test("clicking outside closes the menu", async ({ page }) => {
    await trigger(page, "Dumpster Rentals").hover();
    await expect(panel(page, 2)).toBeVisible();
    // Click on the page while the pointer is still within the hover grace
    // period, so the close comes from the outside click, not pointer-leave.
    await page.mouse.click(720, 600);
    await expect(panel(page, 2)).toBeHidden();
  });

  test("Escape closes the menu and returns focus to its trigger", async ({ page }) => {
    await trigger(page, "Resources").focus();
    await page.keyboard.press("Enter");
    await expect(panel(page, 3)).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(panel(page, 3)).toBeHidden();
    await expect(trigger(page, "Resources")).toBeFocused();
  });

  test("keyboard: arrows move into and through the menu, Tab past the end closes", async ({ page }) => {
    await trigger(page, "Commercial").focus();
    await page.keyboard.press("ArrowDown");
    await expect(panel(page, 1)).toBeVisible();
    const links = panel(page, 1).getByRole("link");
    await expect(links.first()).toBeFocused();
    await page.keyboard.press("ArrowDown");
    await expect(links.nth(1)).toBeFocused();
    await page.keyboard.press("End");
    await expect(links.last()).toBeFocused();
    await page.keyboard.press("Tab");
    await expect(panel(page, 1)).toBeHidden();
  });

  test("keyboard: ArrowRight moves to the next trigger", async ({ page }) => {
    await trigger(page, "Residential").focus();
    await page.keyboard.press("ArrowRight");
    await expect(trigger(page, "Commercial")).toBeFocused();
  });

  test("choosing a destination navigates and closes the menu", async ({ page }) => {
    await trigger(page, "Dumpster Rentals").hover();
    await panel(page, 2).getByRole("link", { name: /Dumpster Calculator/ }).click();
    await expect(page).toHaveURL(/\/dumpster-calculator\/?$/);
    await expect(panel(page, 2)).toBeHidden();
    await expect(trigger(page, "Dumpster Rentals")).toHaveAttribute("aria-expanded", "false");
    await expect(trigger(page, "Dumpster Rentals")).toHaveClass(/is-active/);
  });

  test("the open menu fits inside the viewport", async ({ page }) => {
    await trigger(page, "Resources").hover();
    const box = (await panel(page, 3).boundingBox())!;
    expect(box.x).toBeGreaterThanOrEqual(0);
    expect(box.x + box.width).toBeLessThanOrEqual(desktop.width);
  });
});

test.describe("mobile navigation", () => {
  test.use({ viewport: mobile, hasTouch: true, isMobile: true });

  test.beforeEach(async ({ page }) => {
    await page.goto(process.env.E2E_TARGET === "wp" ? "/about/" : "/about");
  });

  test("menu button opens and closes the sheet, locking page scroll", async ({ page }) => {
    const toggle = page.getByRole("button", { name: "Menu" });
    await expect(page.getByRole("navigation", { name: "Primary" })).toBeHidden();
    await toggle.tap();
    const sheet = page.getByRole("navigation", { name: "Mobile" });
    await expect(sheet).toBeVisible();
    await expect(page.getByRole("button", { name: "Close" })).toHaveAttribute("aria-expanded", "true");
    expect(await page.evaluate(() => document.body.style.overflow)).toBe("hidden");

    const box = (await sheet.boundingBox())!;
    expect(box.x).toBeGreaterThanOrEqual(0);
    expect(box.x + box.width).toBeLessThanOrEqual(mobile.width);

    await page.getByRole("button", { name: "Close" }).tap();
    await expect(sheet).toBeHidden();
    expect(await page.evaluate(() => document.body.style.overflow)).toBe("");
  });

  test("sections expand and collapse, and a destination closes the sheet", async ({ page }) => {
    await page.getByRole("button", { name: "Menu" }).tap();
    const group = page.getByRole("button", { name: "Commercial" });
    await group.tap();
    await expect(group).toHaveAttribute("aria-expanded", "true");
    const link = page.getByRole("navigation", { name: "Mobile" }).getByRole("link", { name: "Container Options" });
    await expect(link).toBeVisible();
    await group.tap();
    await expect(link).toBeHidden();

    await group.tap();
    await link.tap();
    await expect(page).toHaveURL(/\/commercial\/?#containers$/);
    await expect(page.getByRole("navigation", { name: "Mobile" })).toBeHidden();
    expect(await page.evaluate(() => document.body.style.overflow)).toBe("");
  });

  test("Escape closes the sheet", async ({ page }) => {
    await page.getByRole("button", { name: "Menu" }).tap();
    await page.keyboard.press("Escape");
    await expect(page.getByRole("navigation", { name: "Mobile" })).toBeHidden();
  });

  test("tap targets are at least 44px tall", async ({ page }) => {
    await page.getByRole("button", { name: "Menu" }).tap();
    const heights = await page.locator(".mobile-nav-link, .mobile-nav-group, .mobile-nav-actions .btn").evaluateAll((els) => els.map((el) => el.getBoundingClientRect().height));
    for (const h of heights) expect(h).toBeGreaterThanOrEqual(44);
  });
});
