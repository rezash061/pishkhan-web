import { describe, expect, it } from "vitest";
import { normalizeInstagramHandle, normalizeIranMobile, validateLead } from "@/lib/validation";

describe("normalizeIranMobile", () => {
  it.each([
    ["09120001234", "09120001234"],
    ["۰۹۱۲۰۰۰۱۲۳۴", "09120001234"],
    ["+98 912 000 1234", "09120001234"],
    ["0098-912-000-1234", "09120001234"],
    ["9120001234", "09120001234"],
  ])("accepts %s", (input, expected) => expect(normalizeIranMobile(input)).toBe(expected));
  it.each(["0212345678", "0912000123", "abc", "091200012345"])("rejects %s", (input) => expect(normalizeIranMobile(input)).toBeNull());
});

describe("normalizeInstagramHandle", () => {
  it("strips @ and lower-cases", () => expect(normalizeInstagramHandle("@Mahsa.Shop_")).toBe("mahsa.shop_"));
  it("rejects invalid characters", () => expect(normalizeInstagramHandle("mahsa shop")).toBeNull());
  it("allows empty (optional on contact)", () => expect(normalizeInstagramHandle(" ")).toBe(""));
});

describe("validateLead", () => {
  const base = { name: "", phone: "09120001234", instagramHandle: "shop", vertical: "", monthlyDms: "", message: "" };
  it("requires an Instagram handle on the waitlist", () => {
    expect(validateLead({ ...base, type: "waitlist", instagramHandle: "" }).errors).toEqual({ instagramHandle: "required" });
  });
  it("requires name and message on contact", () => {
    expect(validateLead({ ...base, type: "contact" }).errors).toEqual({ name: "required", message: "required" });
  });
  it("returns the normalized phone", () => {
    expect(validateLead({ ...base, type: "waitlist", phone: "۰۹۱۲۰۰۰۱۲۳۴" }).value.phone).toBe("09120001234");
  });
});
