/**
 * Statutory redundancy pay: Employment Rights Act 1996 ss.145, 155, 162, 227 (GB); Employment Rights
 * (NI) Order 1996 arts 180, 190, 197, 23 (NI, same structure, its own cap).
 *
 *  - Service is counted back from the relevant date in complete years, 20 at most (s.162(1)-(3)).
 *  - Each year earns 1.5 weeks if the employee was 41 or over for the whole of it, 1 week if 22 or
 *    over, half a week otherwise (s.162(2)).
 *  - When the employer gives less than the statutory minimum notice (or pays in lieu), the relevant
 *    date for service and age is pushed to the end of the statutory notice (s.145(5)).
 *  - The weekly pay cap is the one in force on the relevant date (Increase of Limits Order art. 4).
 */
import { P, redundancyCapOn, type Jurisdiction } from './params';
import { addDays, addMonths, addYears, fullYears, maxISO, type ISO } from './dates';
import { statutoryNoticeWeeks, noticeEnd } from './notice';

/** Weeks earned for one year of employment, from the age at the start of that year. */
export function weeksForAge(ageAtYearStart: number): number {
  for (const b of P.redundancy.bands) if (ageAtYearStart >= b.fromAge) return b.weeks;
  return 0.5;
}

/** Ready reckoner (gov.uk table logic): weeks for an age at the relevant date and complete years,
 *  each earlier year one year younger. Used for the age × service table. */
export function reckonerWeeks(ageAtRelevantDate: number, years: number): number {
  const n = Math.min(years, P.redundancy.maxYears);
  let w = 0;
  for (let k = 1; k <= n; k++) w += weeksForAge(ageAtRelevantDate - k);
  return w;
}

export interface RedundancyInput {
  dob: ISO; start: ISO;
  /** Day notice was given, or the termination date when no notice was given. */
  noticeGiven: ISO;
  /** Day employment ends (end of notice actually worked, or termination date when paid in lieu). */
  end: ISO;
  weeklyPay: number;
  jurisdiction?: Jurisdiction;
}
export interface YearLine { from: ISO; to: ISO; age: number; weeks: number }
export interface RedundancyResult {
  eligible: boolean; reason?: 'service' | 'dates';
  relevantDate: ISO; extendedDate: ISO; extended: boolean; statutoryNoticeWeeks: number;
  completeYears: number; countedYears: number; ageAtRelevantDate: number;
  weeks: number; cap: number; capped: boolean; weekUsed: number; amount: number;
  byBand: { half: number; one: number; oneHalf: number };
  lines: YearLine[]; claimDeadline: ISO; nextYearOn: ISO | null;
}

export function computeRedundancy(i: RedundancyInput): RedundancyResult {
  const j = i.jurisdiction ?? 'GB';
  const pay = Math.max(0, i.weeklyPay || 0);
  const relevantDate = i.end;
  const statWeeks = statutoryNoticeWeeks(i.start, i.noticeGiven);
  const statEnd = noticeEnd(i.noticeGiven, statWeeks);
  const extendedDate = maxISO(relevantDate, statEnd);
  const extended = extendedDate > relevantDate;
  const cap = redundancyCapOn(relevantDate, j);
  const weekUsed = Math.min(pay, cap);
  const completeYears = fullYears(i.start, addDays(extendedDate, 1));
  const ageAtRelevantDate = fullYears(i.dob, extendedDate);
  const base = { relevantDate, extendedDate, extended, statutoryNoticeWeeks: statWeeks, completeYears, ageAtRelevantDate, cap, capped: pay > cap, weekUsed };
  const claimDeadline = addDays(addMonths(relevantDate, P.redundancy.claimMonths), -1);
  const datesOk = i.dob < i.start && i.start <= i.noticeGiven && i.noticeGiven <= i.end;
  if (!datesOk) return { ...base, claimDeadline, eligible: false, reason: 'dates', countedYears: 0, weeks: 0, amount: 0, byBand: { half: 0, one: 0, oneHalf: 0 }, lines: [], nextYearOn: null };
  const nextYearOn = completeYears < P.redundancy.maxYears ? addDays(addYears(i.start, completeYears + 1), -1) : null;
  if (completeYears < P.redundancy.qualifyingYears) return { ...base, claimDeadline, eligible: false, reason: 'service', countedYears: 0, weeks: 0, amount: 0, byBand: { half: 0, one: 0, oneHalf: 0 }, lines: [], nextYearOn };
  const countedYears = Math.min(completeYears, P.redundancy.maxYears);
  const lines: YearLine[] = [];
  const byBand = { half: 0, one: 0, oneHalf: 0 };
  let weeks = 0;
  for (let k = 1; k <= countedYears; k++) {
    const to = addYears(extendedDate, -(k - 1));
    const from = addDays(addYears(extendedDate, -k), 1);
    const age = fullYears(i.dob, from);
    const w = weeksForAge(age);
    weeks += w;
    if (w === 1.5) byBand.oneHalf += 1; else if (w === 1) byBand.one += 1; else byBand.half += 1;
    lines.push({ from, to, age, weeks: w });
  }
  return { ...base, claimDeadline, eligible: true, countedYears, weeks, amount: Math.round(weeks * weekUsed * 100) / 100, byBand, lines, nextYearOn };
}

/** Average week's pay over the 12 weeks before the calculation date, for pay that varies (s.221(3), s.224). */
export const averageWeek = (totalPay: number, weeksCounted: number) => (weeksCounted > 0 ? Math.max(0, totalPay) / weeksCounted : 0);
