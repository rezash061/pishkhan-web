import { format } from "date-fns-jalali";
import { TZDate } from "@date-fns/tz";
import { toPersianDigits } from "./persian";

const TEHRAN = "Asia/Tehran";

/** Formats an ISO 8601 UTC timestamp as a Jalali date in Tehran time, for example «۷ آبان ۱۴۰۵». */
export function formatJalaliDate(iso: string | Date): string {
  const date = new TZDate(typeof iso === "string" ? new Date(iso) : iso, TEHRAN);
  return toPersianDigits(format(date, "d MMMM yyyy"));
}

/** Jalali date and time in Tehran, for example «۷ آبان ۱۴۰۵، ساعت ۱۴:۳۰». */
export function formatJalaliDateTime(iso: string | Date): string {
  const date = new TZDate(typeof iso === "string" ? new Date(iso) : iso, TEHRAN);
  return toPersianDigits(format(date, "d MMMM yyyy، 'ساعت' HH:mm"));
}
