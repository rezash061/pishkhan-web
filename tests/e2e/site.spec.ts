import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test("landing page is Persian, RTL and makes no third-party requests", async ({ page, baseURL }) => {
  const foreign: string[] = [];
  page.on("request", (r) => {
    if (!r.url().startsWith(baseURL!) && !r.url().startsWith("data:")) foreign.push(r.url());
  });
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("lang", "fa");
  await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("تیم فروش فارسی‌زبان");
  await page.waitForLoadState("networkidle");
  expect(foreign).toEqual([]);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  expect(await page.evaluate(() => window.scrollY)).toBe(0);
});

test("waitlist submission reaches the backend with a solved ALTCHA", async ({ page }) => {
  await page.goto("/waitlist?vertical=gold-jewelry");
  await expect(page.getByLabel("حوزه کسب‌وکار")).toHaveValue("gold-jewelry");
  await page.getByLabel("شماره موبایل").fill("۰۹۱۲۰۰۰۱۲۳۴");
  await page.getByLabel("آیدی پیج اینستاگرام").fill("@mahsa.shop");
  await page.getByRole("button", { name: "عضویت در لیست انتظار" }).click();
  await expect(page.getByRole("status")).toContainText("ممنون از اعتماد شما");
});

test("waitlist shows Persian validation errors", async ({ page }) => {
  await page.goto("/waitlist");
  await page.getByLabel("شماره موبایل").fill("12345");
  await page.getByRole("button", { name: "عضویت در لیست انتظار" }).click();
  await expect(page.getByText("شماره موبایل معتبر نیست")).toBeVisible();
  await expect(page.getByText("این فیلد لازم است.")).toBeVisible();
});

test("backend field errors are shown on the form", async ({ page }) => {
  await page.goto("/waitlist");
  await page.getByLabel("شماره موبایل").fill("09120009999");
  await page.getByLabel("آیدی پیج اینستاگرام").fill("shop");
  await page.getByRole("button", { name: "عضویت در لیست انتظار" }).click();
  await expect(page.getByText("شماره موبایل معتبر نیست")).toBeVisible();
});

test("demo chat answers and shows a graceful message when busy", async ({ page }) => {
  await page.goto("/#demo");
  await page.getByRole("button", { name: "قیمت این مانتو چنده؟" }).click();
  await expect(page.getByText("سلام! بله موجوده.")).toBeVisible();
  await expect(page.getByText("پاسخ از: کاتالوگ")).toBeVisible();
  await page.getByPlaceholder("پیام خود را بنویسید…").fill("busy");
  await page.getByRole("button", { name: "ارسال" }).click();
  await expect(page.getByText("سرور نمایشی الان شلوغ است")).toBeVisible();
});

test("pricing renders only backend plans, in Toman, with the annual toggle", async ({ page }) => {
  await page.goto("/pricing");
  await expect(page.getByText("۹۹۹٬۰۰۰").first()).toBeVisible();
  await expect(page.getByText("قیمت‌های نمونه")).toHaveCount(0);
  await page.getByRole("radio", { name: "سالانه" }).click();
  await expect(page.getByText("۹٬۹۹۰٬۰۰۰").first()).toBeVisible();
  await expect(page.getByRole("link", { name: "انتخاب رشد" })).toHaveAttribute("href", "/waitlist?plan=growth");
});

test("help search finds articles typed with Arabic letters", async ({ page }) => {
  await page.goto("/help/search?q=اتصال%20اينستاگرام");
  await expect(page.getByRole("link", { name: /چطور حساب حرفه‌ای اینستاگرام را وصل کنم/ })).toBeVisible();
});

test("data deletion status lookup from Meta's ?code= link", async ({ page }) => {
  await page.goto("/data-deletion?code=abcdef1234567890");
  await expect(page.getByText("حذف کامل شد")).toBeVisible();
  await page.getByPlaceholder("کد پیگیری").fill("0000000000000000");
  await page.getByRole("button", { name: "بررسی وضعیت" }).click();
  await expect(page.getByText("درخواستی با این کد پیدا نشد")).toBeVisible();
});

test("revalidation endpoint rejects unsigned requests", async ({ request }) => {
  const response = await request.post("/api/revalidate", { data: { tags: ["plans"] } });
  expect(response.status()).toBe(401);
});

test("lead endpoint rejects cross-site posts", async ({ request }) => {
  const response = await request.post("/api/leads", { data: { phone: "09120001234" }, headers: { Origin: "https://evil.example" } });
  expect(response.status()).toBe(403);
});

for (const path of ["/", "/pricing", "/features/ai-agent", "/data-deletion", "/blog/reply-speed", "/contact"]) {
  test(`no serious accessibility violations on ${path}`, async ({ page }) => {
    await page.goto(path);
    const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"]).analyze();
    const serious = results.violations.filter((v) => v.impact === "serious" || v.impact === "critical");
    expect(serious.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(" ")).slice(0, 3).join(", ")}`)).toEqual([]);
  });
}
