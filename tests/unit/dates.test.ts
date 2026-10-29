import { describe, expect, it } from "vitest";
import { formatJalaliDate, formatJalaliDateTime } from "@/lib/dates";

describe("Jalali dates in Tehran time", () => {
  it("formats a UTC timestamp as a Jalali date", () => expect(formatJalaliDate("2026-10-29T00:00:00Z")).toBe("۷ آبان ۱۴۰۵"));
  it("uses Asia/Tehran for the day boundary", () => expect(formatJalaliDate("2026-10-28T21:00:00Z")).toBe("۷ آبان ۱۴۰۵"));
  it("formats date and time", () => expect(formatJalaliDateTime("2026-10-29T10:00:00Z")).toBe("۷ آبان ۱۴۰۵، ساعت ۱۳:۳۰"));
});
