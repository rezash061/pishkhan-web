import { describe, expect, it } from "vitest";
import { formatNumber, formatToman, normalizeForSearch, toLatinDigits, toPersianDigits } from "@/lib/persian";

describe("digits", () => {
  it("converts to Persian digits", () => expect(toPersianDigits("0912 345")).toBe("۰۹۱۲ ۳۴۵"));
  it("converts Persian and Arabic-Indic digits to Latin", () => expect(toLatinDigits("۰۹۱۲٣٤٥")).toBe("0912345"));
});

describe("money", () => {
  it("shows Rial amounts as Toman with Persian separators", () => {
    expect(formatToman({ amount: 12_500_000, currency: "IRR" })).toBe("۱٬۲۵۰٬۰۰۰ تومان");
    expect(formatToman(49_000_000, false)).toBe("۴٬۹۰۰٬۰۰۰");
  });
  it("formats numbers with Persian digits", () => expect(formatNumber(2000)).toBe("۲٬۰۰۰"));
});

describe("normalizeForSearch", () => {
  it("folds Arabic yeh and kaf to Persian", () => expect(normalizeForSearch("كيف")).toBe(normalizeForSearch("کیف")));
  it("treats ZWNJ as a space and collapses whitespace", () => expect(normalizeForSearch("می‌خواهم   این")).toBe("می خواهم این"));
  it("removes diacritics and kashida", () => expect(normalizeForSearch("كـتابٌ")).toBe("کتاب"));
  it("lower-cases Latin and converts digits", () => expect(normalizeForSearch("Instagram ۲۴")).toBe("instagram 24"));
});
