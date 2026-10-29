import { defineConfig, devices } from "@playwright/test";

const port = 3200;
const mockPort = 5099;

export default defineConfig({
  testDir: "tests/e2e",
  fullyParallel: true,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [["github"], ["html", { open: "never" }]] : "list",
  use: { baseURL: `http://localhost:${port}`, locale: "fa-IR", timezoneId: "Asia/Tehran" },
  projects: [
    { name: "mobile", use: { ...devices["Pixel 7"], browserName: "chromium" } },
    { name: "desktop", use: { viewport: { width: 1280, height: 900 }, browserName: "chromium" } },
  ],
  // The mock backend starts first so `next build` renders pricing from its plans.
  webServer: [
    { command: "node tests/e2e/mock-backend.mjs", url: `http://localhost:${mockPort}/api/v1/public/plans`, reuseExistingServer: !process.env.CI, env: { MOCK_PORT: String(mockPort) } },
    {
      command: `pnpm build && pnpm start -p ${port}`,
      url: `http://localhost:${port}`,
      timeout: 240_000,
      reuseExistingServer: !process.env.CI,
      env: { PISHKHAN_API_URL: `http://localhost:${mockPort}`, SITE_URL: "https://pishkhan.ir", PANEL_URL: "https://app.pishkhan.ir", SIGNUP_MODE: "waitlist", REVALIDATE_SECRET: "e2e-secret" },
    },
  ],
});
