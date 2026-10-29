import { toLatinDigits } from "./persian";

// Form validation shared by the browser (instant feedback) and the route handlers (never trust the browser).
// Results are message keys under `forms.*` in messages/fa.json.

/** Normalizes an Iranian mobile number to `09xxxxxxxxx`, accepting Persian digits, spaces, dashes, +98 and 0098. */
export function normalizeIranMobile(input: string): string | null {
  let digits = toLatinDigits(input).replace(/[\s\-()]/g, "");
  if (digits.startsWith("+98")) {
    digits = `0${digits.slice(3)}`;
  } else if (digits.startsWith("0098")) {
    digits = `0${digits.slice(4)}`;
  } else if (digits.startsWith("98") && digits.length === 12) {
    digits = `0${digits.slice(2)}`;
  } else if (digits.startsWith("9") && digits.length === 10) {
    digits = `0${digits}`;
  }
  return /^09\d{9}$/.test(digits) ? digits : null;
}

/** Instagram usernames: letters, digits, `.` and `_`, up to 30 characters. A leading `@` is removed. */
export function normalizeInstagramHandle(input: string): string | null {
  const handle = input.trim().replace(/^@/, "").toLowerCase();
  if (handle === "") {
    return "";
  }
  return /^[a-z0-9._]{1,30}$/.test(handle) ? handle : null;
}

export interface LeadInput {
  type: "waitlist" | "contact";
  name: string;
  phone: string;
  instagramHandle: string;
  vertical: string;
  monthlyDms: string;
  message: string;
}

export type LeadErrors = Partial<Record<keyof LeadInput, "required" | "phoneInvalid" | "instagramInvalid" | "messageTooLong">>;

export function validateLead(input: LeadInput): { errors: LeadErrors; value: LeadInput } {
  const errors: LeadErrors = {};
  const phone = normalizeIranMobile(input.phone);
  if (input.phone.trim() === "") {
    errors.phone = "required";
  } else if (phone === null) {
    errors.phone = "phoneInvalid";
  }

  const handle = normalizeInstagramHandle(input.instagramHandle);
  if (handle === null) {
    errors.instagramHandle = "instagramInvalid";
  } else if (input.type === "waitlist" && handle === "") {
    errors.instagramHandle = "required";
  }

  if (input.type === "contact") {
    if (input.name.trim() === "") {
      errors.name = "required";
    }
    if (input.message.trim() === "") {
      errors.message = "required";
    }
  }
  if (input.message.length > 2000) {
    errors.message = "messageTooLong";
  }

  return {
    errors,
    value: {
      ...input,
      name: input.name.trim().slice(0, 100),
      phone: phone ?? input.phone,
      instagramHandle: handle ?? input.instagramHandle,
      vertical: input.vertical.slice(0, 40),
      monthlyDms: input.monthlyDms.slice(0, 40),
      message: input.message.trim(),
    },
  };
}
