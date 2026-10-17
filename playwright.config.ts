import { defineConfig } from "@playwright/test";

// Uses the locally installed Google Chrome (channel: "chrome") so no browser
// download is needed. Set E2E_BASE_URL to test an already-running server;
// otherwise a production build is started on port 3100.
const baseURL = process.env.E2E_BASE_URL ?? "http://localhost:3100";

export default defineConfig({
  testDir: "./e2e",
  outputDir: "./test-results/playwright",
  timeout: 60_000,
  fullyParallel: true,
  reporter: [["list"]],
  use: { baseURL, channel: "chrome", headless: true },
  webServer: process.env.E2E_BASE_URL
    ? undefined
    : { command: "npm run build && npx next start -p 3100", url: baseURL, timeout: 240_000, reuseExistingServer: true }
});
