/**
 * Statutory Sick Pay from 6 April 2026 (Employment Rights Act 2025 ss.10-13, SI 2026/373), Great Britain
 * and Northern Ireland alike: paid from the first qualifying day, no waiting days, no lower earnings
 * limit, at the lower of £123.25 a week and 80% of normal weekly earnings, for 28 weeks at most across
 * linked periods. The daily rate is the weekly rate divided by the qualifying days in the week, cut at
 * four decimal places; each week's payment is rounded up to the penny (HMRC daily-rate tables and the
 * GOV.UK SSP calculator).
 */
import { P } from './params';
import { addDays, dayOfWeek, diffDays, type ISO } from './dates';

const S = P.ssp;
export const floor4 = (x: number) => Math.floor(Math.round(x * 1e10) / 1e6) / 1e4;
export const ceilPenny = (x: number) => Math.ceil(Math.round(x * 1e7) / 1e5) / 100;

export const weeklySsp = (awe: number) => Math.min(S.weeklyRate, Math.max(0, awe) * S.earningsShare);
export const dailySsp = (awe: number, qualifyingDays: number) => (qualifyingDays > 0 ? floor4(weeklySsp(awe) / qualifyingDays) : 0);

/** Amount for a number of qualifying days within one week, as in HMRC's tables. */
export const sspForDays = (awe: number, qualifyingDays: number, days: number) => ceilPenny(dailySsp(awe, qualifyingDays) * days);

export interface SspInput {
  awe: number;
  /** Days of the week normally worked, 0 = Sunday … 6 = Saturday. */
  pattern: number[];
  firstDay: ISO; lastDay: ISO;
  /** Qualifying days of SSP already paid in a linked period (8 weeks or less apart). */
  alreadyPaidDays?: number;
}
export interface SspWeek { weekEnding: ISO; days: number; amount: number }
export interface SspResult {
  supported: boolean; weeklyRate: number; rule: 'flat' | 'earnings'; dailyRate: number;
  qualifyingDays: number; paidDays: number; remainingDays: number; maxDays: number;
  weeks: SspWeek[]; total: number; fitNoteNeeded: boolean; exhaustedOn: ISO | null;
}

export function computeSsp(i: SspInput): SspResult {
  const pattern = [...new Set(i.pattern)].filter((d) => d >= 0 && d <= 6);
  const q = pattern.length;
  const weeklyRate = weeklySsp(i.awe);
  const rule = i.awe * S.earningsShare < S.weeklyRate ? 'earnings' : 'flat';
  const dailyRate = dailySsp(i.awe, q);
  const maxDays = S.maxWeeks * q;
  const supported = i.firstDay >= S.reformDate && i.lastDay >= i.firstDay && q > 0;
  let room = Math.max(0, maxDays - Math.max(0, i.alreadyPaidDays ?? 0));
  const byWeek = new Map<ISO, number>();
  let qualifying = 0, paid = 0; let exhaustedOn: ISO | null = null;
  if (supported) {
    const span = diffDays(i.firstDay, i.lastDay);
    for (let k = 0; k <= span; k++) {
      const d = addDays(i.firstDay, k);
      if (!pattern.includes(dayOfWeek(d))) continue;
      qualifying++;
      if (room <= 0) { if (!exhaustedOn) exhaustedOn = d; continue; }
      room--; paid++;
      const sat = addDays(d, 6 - dayOfWeek(d));
      byWeek.set(sat, (byWeek.get(sat) ?? 0) + 1);
    }
  }
  const weeks: SspWeek[] = [...byWeek.entries()].map(([weekEnding, days]) => ({ weekEnding, days, amount: ceilPenny(dailyRate * days) }));
  const total = Math.round(weeks.reduce((s, w) => s + w.amount, 0) * 100) / 100;
  return {
    supported, weeklyRate, rule, dailyRate, qualifyingDays: qualifying, paidDays: paid,
    remainingDays: Math.max(0, maxDays - (i.alreadyPaidDays ?? 0) - paid), maxDays, weeks, total,
    fitNoteNeeded: diffDays(i.firstDay, i.lastDay) + 1 > S.fitNoteAfterDays, exhaustedOn,
  };
}

/** Two periods of sickness link when the gap between them is 8 weeks (56 days) or less. */
export const linked = (prevLastDay: ISO, nextFirstDay: ISO) => diffDays(prevLastDay, nextFirstDay) - 1 <= S.linkGapWeeks * 7;

/**
 * The rules before 6 April 2026, for comparison only (2025/26 figures in `ssp.pre2026`): no SSP below
 * the £125 lower earnings limit, nothing for spells shorter than 4 days, the first 3 qualifying days
 * unpaid, then £118.75 a week. `sickDays` = consecutive qualifying days off, starting a new spell.
 */
export function pre2026Ssp(awe: number, qualifyingDaysPerWeek: number, sickDays: number) {
  const o = S.pre2026;
  if (awe < o.lel || qualifyingDaysPerWeek <= 0 || sickDays < o.minPiwDays) return { paidDays: 0, amount: 0 };
  const paidDays = Math.max(0, sickDays - o.waitingDays);
  return { paidDays, amount: ceilPenny(floor4(o.weeklyRate / qualifyingDaysPerWeek) * paidDays) };
}
/** The 2026 rules for the same simple case (whole weeks not split by pay week). */
export function post2026Ssp(awe: number, qualifyingDaysPerWeek: number, sickDays: number) {
  const paidDays = Math.max(0, Math.min(sickDays, S.maxWeeks * qualifyingDaysPerWeek));
  return { paidDays, amount: ceilPenny(dailySsp(awe, qualifyingDaysPerWeek) * paidDays) };
}
