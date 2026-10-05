/**
 * Calendar arithmetic on ISO dates ("YYYY-MM-DD"), always in UTC so that a page built in London
 * and opened in New York gives the same answer. Pure functions, no clock: callers pass "today".
 */
export type ISO = string;

const ms = 86_400_000;
export const toDate = (iso: ISO) => new Date(`${iso}T00:00:00Z`);
export const toISO = (d: Date): ISO => d.toISOString().slice(0, 10);
export const isISO = (s: string) => /^\d{4}-\d{2}-\d{2}$/.test(s) && !Number.isNaN(toDate(s).getTime()) && toISO(toDate(s)) === s;

export const addDays = (iso: ISO, n: number): ISO => toISO(new Date(toDate(iso).getTime() + n * ms));
export const addWeeks = (iso: ISO, n: number): ISO => addDays(iso, 7 * n);
/** Days from a to b (b − a). */
export const diffDays = (a: ISO, b: ISO) => Math.round((toDate(b).getTime() - toDate(a).getTime()) / ms);
export const dayOfWeek = (iso: ISO) => toDate(iso).getUTCDay(); // 0 = Sunday

/** Same day n years later; 29 February becomes 28 February in a non-leap year (the anniversary rule
 *  used for ages and years of service). */
export function addYears(iso: ISO, n: number): ISO {
  const [y, m, d] = iso.split('-').map(Number);
  const ty = y + n;
  const last = new Date(Date.UTC(ty, m, 0)).getUTCDate();
  return `${ty}-${String(m).padStart(2, '0')}-${String(Math.min(d, last)).padStart(2, '0')}`;
}
export function addMonths(iso: ISO, n: number): ISO {
  const [y, m, d] = iso.split('-').map(Number);
  const t = new Date(Date.UTC(y, m - 1 + n, 1));
  const last = new Date(Date.UTC(t.getUTCFullYear(), t.getUTCMonth() + 1, 0)).getUTCDate();
  return toISO(new Date(Date.UTC(t.getUTCFullYear(), t.getUTCMonth(), Math.min(d, last))));
}

/** Completed years between two dates (age on a date, or full years of service). */
export function fullYears(from: ISO, to: ISO): number {
  if (to < from) return 0;
  let n = Number(to.slice(0, 4)) - Number(from.slice(0, 4));
  if (addYears(from, n) > to) n -= 1;
  return Math.max(0, n);
}
/** Completed months between two dates. */
export function fullMonths(from: ISO, to: ISO): number {
  if (to < from) return 0;
  let n = (Number(to.slice(0, 4)) - Number(from.slice(0, 4))) * 12 + Number(to.slice(5, 7)) - Number(from.slice(5, 7));
  if (addMonths(from, n) > to) n -= 1;
  return Math.max(0, n);
}

/** Sunday that starts the week containing the date (UK statutory weeks run Sunday to Saturday). */
export const weekStartSunday = (iso: ISO) => addDays(iso, -dayOfWeek(iso));
/** First Sunday of April of a year: the date the SMP/SAP/ShPP rate changes. */
export function firstSundayOfApril(year: number): ISO {
  const d = `${year}-04-01`;
  return addDays(d, (7 - dayOfWeek(d)) % 7);
}
export const minISO = (a: ISO, b: ISO) => (a < b ? a : b);
export const maxISO = (a: ISO, b: ISO) => (a > b ? a : b);
