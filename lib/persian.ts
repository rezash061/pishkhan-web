// Persian text, digit and money helpers. The rules mirror the backend `Pishkhan.Persian` normalizer
// (Arabic letters to Persian, Arabic-Indic and Persian digits to ASCII, kashida and diacritics removed).

const PERSIAN_DIGITS = "۰۱۲۳۴۵۶۷۸۹";
const ARABIC_DIGITS = "٠١٢٣٤٥٦٧٨٩";

/** Replaces ASCII digits with Persian digits. Use for display only. */
export function toPersianDigits(value: string | number): string {
  return String(value).replace(/[0-9]/g, (d) => PERSIAN_DIGITS[Number(d)] ?? d);
}

/** Replaces Persian and Arabic-Indic digits with ASCII digits. Use on every numeric input before sending it. */
export function toLatinDigits(value: string): string {
  return value.replace(/[۰-۹٠-٩]/g, (d) => {
    const persian = PERSIAN_DIGITS.indexOf(d);
    return String(persian >= 0 ? persian : ARABIC_DIGITS.indexOf(d));
  });
}

const LETTER_MAP: Record<string, string> = {
  "ي": "ی",
  "ى": "ی",
  "ئ": "ی",
  "ك": "ک",
  "ة": "ه",
  "ۀ": "ه",
  "ە": "ه",
  "أ": "ا",
  "إ": "ا",
  "ٱ": "ا",
  "ؤ": "و",
};

// Kashida, Arabic diacritics (harakat, tanwin, shadda, sukun, superscript alef) and invisible format characters.
const STRIP = /[ـً-ٰٟ​‍‎‏‪-‮⁦-⁩﻿­]/g;

/**
 * Normalizes text for search matching: the same letter and digit folding as the backend, lower-cased Latin,
 * ZWNJ treated as a space (so «می‌خواهم» and «می خواهم» match), and collapsed whitespace.
 */
export function normalizeForSearch(input: string): string {
  return toLatinDigits(input.normalize("NFKC"))
    .replace(STRIP, "")
    .replace(/[يىئكةۀەأإٱؤ]/g, (c) => LETTER_MAP[c] ?? c)
    .replace(/‌/g, " ")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

const numberFormat = new Intl.NumberFormat("fa-IR", { maximumFractionDigits: 0 });

/** Formats an integer with Persian digits and Persian thousands separators. */
export function formatNumber(value: number): string {
  return numberFormat.format(value);
}

/** Money as the backend sends it: an integer amount in the minor unit (IRR = Rial). */
export interface Money {
  amount: number;
  currency: string;
}

/** Converts Rial to Toman (÷ 10) and formats it, for example «۱۲۵٬۰۰۰ تومان». */
export function formatToman(money: Money | number, withUnit = true): string {
  const rial = typeof money === "number" ? money : money.amount;
  const toman = Math.round(rial / 10);
  const text = formatNumber(toman);
  return withUnit ? `${text} تومان` : text;
}
