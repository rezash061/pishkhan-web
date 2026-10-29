import { describe, expect, it } from "vitest";
import { buildSignupUrl, readAttribution } from "@/components/signup-link";

describe("sign-up handoff (WS-1.8)", () => {
  it("keeps UTM and ref from the URL, falling back to the stored session values", () => {
    expect(readAttribution("?utm_source=ig&foo=1", JSON.stringify({ ref: "ali", utm_source: "old" }))).toEqual({ utm_source: "ig", ref: "ali" });
  });
  it("ignores broken stored values", () => expect(readAttribution("", "{not json")).toEqual({}));
  it("builds the panel sign-up URL with plan and params", () => {
    expect(buildSignupUrl("https://app.pishkhan.ir", { plan: "growth", template: undefined, utm_source: "ig" })).toBe("https://app.pishkhan.ir/signup?plan=growth&utm_source=ig");
  });
});
