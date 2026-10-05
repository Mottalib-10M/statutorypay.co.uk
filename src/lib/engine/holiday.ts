/**
 * Holiday entitlement and holiday pay. Working Time Regulations 1998 (GB) regs 13, 13A, 14, 15A, 15B,
 * 16, 16A; Working Time Regulations (Northern Ireland) 2016 for NI, where the 2024 irregular-hours
 * reforms (12.07% accrual, rolled-up pay) do not apply. Results are checked against the rules of the
 * GOV.UK holiday entitlement calculator (alphagov/smart-answers, HolidayEntitlement).
 */
import { P, type Jurisdiction } from './params';
import { addDays, addYears, diffDays, type ISO } from './dates';

const H = P.holiday;
export const ceilTo = (x: number, step: number) => Math.ceil(Math.round(x / step * 1e9) / 1e9) * step;

/** Statutory days for a full leave year: 5.6 × days per week, never above 28 (reg 13A(3)). */
export function entitlementDays(daysPerWeek: number): number {
  const d = Math.max(0, daysPerWeek);
  return Math.min(H.statutoryWeeks * Math.min(d, 5) , H.maxDays) ;
}
/** Statutory hours for a full leave year: 5.6 weeks of the average day, days capped at five. */
export function entitlementHours(hoursPerWeek: number, daysPerWeek: number): number {
  if (daysPerWeek <= 0) return 0;
  return H.statutoryWeeks * Math.min(daysPerWeek, 5) * (hoursPerWeek / daysPerWeek);
}
/** Shifts: average shifts per week from a repeating pattern, capped at five. */
export function entitlementShifts(shiftsInPattern: number, daysInPattern: number): number {
  if (daysInPattern <= 0) return 0;
  const perWeek = (shiftsInPattern / daysInPattern) * 7;
  return H.statutoryWeeks * Math.min(perWeek, 5);
}

export interface LeaveYear { start: ISO; end: ISO; days: number }
/** The leave year that contains `date`, for a leave year starting on `yearStart` (any year). */
export function leaveYearContaining(yearStart: ISO, date: ISO): LeaveYear {
  let s = yearStart;
  while (s > date) s = addYears(s, -1);
  while (addYears(s, 1) <= date) s = addYears(s, 1);
  const end = addDays(addYears(s, 1), -1);
  return { start: s, end, days: diffDays(s, end) + 1 };
}

/** Months counted for someone who starts part way through the leave year (GOV.UK method: the
 *  starting month counts in full when the start day is on or before the leave year's end day). */
export function monthsRemaining(start: ISO, ly: LeaveYear): number {
  const [sy, sm, sd] = start.split('-').map(Number);
  const [ey, em, ed] = ly.end.split('-').map(Number);
  const m = 12 * (ey - sy) + em - sm;
  return ed >= sd ? m + 1 : m;
}

export type PartYearCase = 'full' | 'started' | 'left' | 'both';
export interface ProRata { fraction: number; days: number; shown: number; basis: PartYearCase; leaveYear: LeaveYear }
/**
 * Pro-rata entitlement in days for a starter, a leaver or both. A starter's figure is rounded up to
 * the next half day (GOV.UK; reg 15A(3) for the first-year accrual); a leaver's figure is exact.
 */
export function proRataDays(o: { daysPerWeek: number; yearStart: ISO; start?: ISO; leave?: ISO }): ProRata {
  const full = entitlementDays(o.daysPerWeek);
  const anchor = o.leave ?? o.start ?? o.yearStart;
  const ly = leaveYearContaining(o.yearStart, anchor);
  let basis: PartYearCase = 'full'; let fraction = 1;
  if (o.start && o.leave) { basis = 'both'; fraction = (diffDays(o.start, o.leave) + 1) / ly.days; }
  else if (o.start) { basis = 'started'; fraction = monthsRemaining(o.start, ly) / 12; }
  else if (o.leave) { basis = 'left'; fraction = (diffDays(ly.start, o.leave) + 1) / ly.days; }
  fraction = Math.max(0, Math.min(1, fraction));
  const days = full * fraction;
  const shown = basis === 'started' ? ceilTo(days, 0.5) : days;
  return { fraction, days, shown, basis, leaveYear: ly };
}

/** Irregular-hours or part-year worker (GB, leave years from 1 April 2024): 12.07% of hours worked in
 *  the pay period, a fraction of an hour rounded to the nearest hour (reg 15B(3), (5)). */
export function irregularAccrual(hoursWorked: number): { exact: number; credited: number } {
  const exact = Math.max(0, hoursWorked) * H.irregularAccrualRate;
  return { exact, credited: Math.round(exact) };
}

/** Rolled-up holiday pay (reg 16A): a 12.07% uplift on pay for work done, GB irregular-hours and
 *  part-year workers only. */
export const rolledUp = (pay: number) => Math.max(0, pay) * H.irregularAccrualRate;

/** A week's holiday pay for variable pay: average over the paid weeks in the reference period, up to 52
 *  (reg 16(3)(e)); weeks with no pay are skipped, looking back at most 104 weeks. */
export function averageWeeksPay(totalPay: number, paidWeeks: number): number {
  const w = Math.min(Math.max(0, paidWeeks), H.referenceWeeks);
  return w > 0 ? Math.max(0, totalPay) / w : 0;
}

export interface HolidayPayInput { basicWeek: number; extrasWeek: number; daysPerWeek: number; daysTaken: number; irregular: boolean }
export interface HolidayPayResult { normalWeek: number; basicWeek: number; dayNormal: number; dayBasic: number; daysAtNormal: number; daysAtBasic: number; pay: number; annualPay: number }
/**
 * Pay for days of statutory leave. Regular-hours workers: the first 4 weeks at the normal rate
 * (basic plus regular overtime, commission, seniority payments), the remaining 1.6 weeks may be paid at
 * basic rate (gov.uk; reg 16(3ZA) applies to reg 13 leave only). Irregular-hours workers: all at normal.
 */
export function holidayPay(i: HolidayPayInput): HolidayPayResult {
  const d = Math.max(0.0001, Math.min(i.daysPerWeek, 7));
  const normalWeek = Math.max(0, i.basicWeek) + Math.max(0, i.extrasWeek);
  const basicWeek = i.irregular ? normalWeek : Math.max(0, i.basicWeek);
  const dayNormal = normalWeek / d, dayBasic = basicWeek / d;
  const normalDays = H.basicWeeks * Math.min(d, 5);
  const daysAtNormal = Math.min(i.daysTaken, normalDays);
  const daysAtBasic = Math.max(0, i.daysTaken - normalDays);
  const ent = entitlementDays(d);
  const annualPay = Math.min(ent, normalDays) * dayNormal + Math.max(0, ent - normalDays) * dayBasic;
  return { normalWeek, basicWeek, dayNormal, dayBasic, daysAtNormal, daysAtBasic, pay: daysAtNormal * dayNormal + daysAtBasic * dayBasic, annualPay };
}

/** Payment in lieu of untaken leave on leaving (reg 14(3)): (A × B) − C days, paid at a day's pay. */
export function leavingPay(o: { daysPerWeek: number; yearStart: ISO; leave: ISO; taken: number; weekPay: number; extraContractDays?: number }) {
  const ly = leaveYearContaining(o.yearStart, o.leave);
  const A = entitlementDays(o.daysPerWeek) + Math.max(0, o.extraContractDays ?? 0);
  const B = (diffDays(ly.start, o.leave) + 1) / ly.days;
  const days = A * B - Math.max(0, o.taken);
  const day = o.daysPerWeek > 0 ? o.weekPay / o.daysPerWeek : 0;
  return { A, B, accrued: A * B, days, pay: days * day, dayPay: day, leaveYear: ly, owedByWorker: days < 0 };
}

/** Bank holidays of a nation inside a period. */
export type Nation = 'england-and-wales' | 'scotland' | 'northern-ireland';
export function bankHolidaysBetween(nation: Nation, from: ISO, to: ISO): Array<[string, string]> {
  return (P.bankHolidays[nation] as Array<[string, string]>).filter(([d]) => d >= from && d <= to);
}
/** Part-timer's share of bank holidays when the employer gives them on top of 5.6 weeks: pro rata to
 *  the days worked against a five-day week (Part-time Workers Regulations 2000). */
export const bankHolidayProRata = (bankHolidays: number, daysPerWeek: number) => bankHolidays * Math.min(daysPerWeek, 5) / 5;

/** Which regime applies to an irregular-hours worker. */
export const irregularRegime = (j: Jurisdiction, leaveYearStart: ISO) => (j === 'GB' && leaveYearStart >= H.irregularRegimeFrom ? 'accrual' : 'weeks');
