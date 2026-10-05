/**
 * Statutory family pay: maternity (SMP), adoption (SAP), paternity (SPP), shared parental (ShPP) pay
 * and Maternity Allowance. Statutory Maternity Pay (General) Regulations 1986; Statutory Paternity Pay
 * and Statutory Adoption Pay (General) Regulations 2002; Statutory Shared Parental Pay (General)
 * Regulations 2014; HMRC Rates and thresholds 2026 to 2027. Date logic follows HMRC's own calculator
 * (alphagov/smart-answers MaternityPayCalculator): weeks run Sunday to Saturday, the qualifying week is
 * the 15th week before the expected week of childbirth, the flat rate changes with the first pay week
 * that starts on or after the first Sunday in April.
 */
import { P, lelOn, type Jurisdiction } from './params';
import { addDays, addWeeks, dayOfWeek, firstSundayOfApril, weekStartSunday, diffDays, type ISO } from './dates';

const F = P.familyPay;
export const ceilPenny = (x: number) => Math.ceil(Math.round(x * 1e7) / 1e5) / 100;
/** 90% of average weekly earnings, truncated at 7 decimal places as HMRC does, per week. */
export const ninety = (awe: number) => Math.floor(Math.max(0, awe) * F.earningsShare * 1e7) / 1e7;

export interface BirthDates {
  dueDate: ISO; ewcStart: ISO; qwStart: ISO; qwEnd: ISO; startedBy: ISO; noticeBy: ISO;
  earliestLeave: ISO; sicknessTrigger: ISO; lel: number;
}
/** Key dates for a birth from the due date. `startedBy`: last day employment can have started for the
 *  26 weeks of continuous employment into the qualifying week. */
export function birthDates(dueDate: ISO): BirthDates {
  const ewcStart = weekStartSunday(dueDate);
  const qwStart = addWeeks(ewcStart, -F.qualifyingWeekBeforeEWC);
  const qwEnd = addDays(qwStart, 6);
  return {
    dueDate, ewcStart, qwStart, qwEnd,
    startedBy: addWeeks(qwEnd, -(F.serviceWeeks - 1)),
    noticeBy: qwEnd,
    earliestLeave: addWeeks(ewcStart, -F.earliestStartWeeksBeforeEWC),
    sicknessTrigger: addWeeks(ewcStart, -F.sickTriggerWeeksBeforeEWC),
    lel: lelOn(qwEnd),
  };
}

/** Date from which the new flat rate applies to a pay period that starts on the weekday of `payStart`. */
export function uprating(year: number, payStart: ISO): ISO {
  return addDays(firstSundayOfApril(year), dayOfWeek(payStart));
}
/** Flat weekly rate for a pay week starting on `weekStart`, for pay periods anchored on `payStart`. */
export function flatRateForWeek(weekStart: ISO, payStart: ISO): { rate: number; known: boolean } {
  let rate = F.rates[0].weekly;
  for (const r of F.rates) if (weekStart >= uprating(Number(r.from.slice(0, 4)), payStart)) rate = r.weekly;
  const latestYear = Number(F.rates[F.rates.length - 1].from.slice(0, 4));
  return { rate, known: weekStart < uprating(latestYear + 1, payStart) };
}

export interface PayWeek { n: number; start: ISO; end: ISO; amount: number; rule: 'earnings' | 'flat'; rateKnown: boolean }
export interface PaySchedule { weeks: PayWeek[]; total: number; first6: number; rest: number; lastDay: ISO; unknownRateWeeks: number }

/** Weekly schedule for SMP or SAP: 6 weeks at 90% of AWE, then the lower of the flat rate and 90%. */
export function smpSchedule(awe: number, payStart: ISO, weeks = F.smpWeeks, higherWeeks = F.smpHigherRateWeeks): PaySchedule {
  const nin = ninety(awe);
  const out: PayWeek[] = [];
  for (let n = 1; n <= weeks; n++) {
    const start = addWeeks(payStart, n - 1);
    if (n <= higherWeeks) { out.push({ n, start, end: addDays(start, 6), amount: ceilPenny(nin), rule: 'earnings', rateKnown: true }); continue; }
    const { rate, known } = flatRateForWeek(start, payStart);
    const flat = rate < nin;
    out.push({ n, start, end: addDays(start, 6), amount: ceilPenny(Math.min(rate, nin)), rule: flat ? 'flat' : 'earnings', rateKnown: known });
  }
  const total = out.reduce((s, w) => s + w.amount, 0);
  const first6 = out.slice(0, higherWeeks).reduce((s, w) => s + w.amount, 0);
  return { weeks: out, total: Math.round(total * 100) / 100, first6, rest: total - first6, lastDay: addDays(addWeeks(payStart, weeks), -1), unknownRateWeeks: out.filter((w) => !w.rateKnown).length };
}

/** Flat-or-90% weekly pay for every week (SPP, ShPP, Maternity Allowance, neonatal, bereavement). */
export function flatSchedule(awe: number, payStart: ISO, weeks: number): PaySchedule {
  return smpSchedule(awe, payStart, weeks, 0);
}

export interface SmpInput { dueDate: ISO; leaveStart: ISO; awe: number; employmentStart: ISO }
export interface SmpResult { dates: BirthDates; eligible: boolean; reasons: Array<'earnings' | 'service' | 'leaveTooEarly'>; schedule: PaySchedule; leaveEnd: ISO; ordinaryEnd: ISO; noticeForPay: ISO; awe: number }
export function computeSmp(i: SmpInput): SmpResult {
  const dates = birthDates(i.dueDate);
  const reasons: SmpResult['reasons'] = [];
  if (i.awe < dates.lel) reasons.push('earnings');
  if (i.employmentStart > dates.startedBy) reasons.push('service');
  if (i.leaveStart < dates.earliestLeave) reasons.push('leaveTooEarly');
  const schedule = smpSchedule(i.awe, i.leaveStart);
  return {
    dates, eligible: reasons.length === 0, reasons, schedule, awe: i.awe,
    leaveEnd: addDays(addWeeks(i.leaveStart, F.maternityLeaveWeeks), -1),
    ordinaryEnd: addDays(addWeeks(i.leaveStart, F.ordinaryLeaveWeeks), -1),
    noticeForPay: addDays(i.leaveStart, -F.noticeDaysPay),
  };
}

export interface SppInput { dueDate: ISO; awe: number; employmentStart: ISO; weeks: 1 | 2; leaveStart: ISO; jurisdiction: Jurisdiction; birthDate?: ISO }
export interface SppResult { dates: BirthDates; leaveEligible: boolean; payEligible: boolean; reasons: Array<'earnings' | 'service'>; schedule: PaySchedule; windowEnd: ISO; consecutiveOnly: boolean }
/** Paternity: leave is a day-one right in Great Britain from 6 April 2026 (ERA 2025 s.16); Northern
 *  Ireland keeps the 26-week condition, a single block of 1 or 2 consecutive weeks within 56 days. Pay
 *  needs 26 weeks' service into the qualifying week and average earnings at the LEL, in both. */
export function computeSpp(i: SppInput): SppResult {
  const dates = birthDates(i.dueDate);
  const service = i.employmentStart <= dates.startedBy;
  const earnings = i.awe >= dates.lel;
  const reasons: SppResult['reasons'] = [];
  if (!earnings) reasons.push('earnings');
  if (!service) reasons.push('service');
  const dayOne = i.jurisdiction === 'GB' && i.leaveStart >= F.paternityDayOneGBFrom;
  const anchor = i.birthDate ?? i.dueDate;
  const windowEnd = i.jurisdiction === 'NI'
    ? addDays(i.birthDate && i.birthDate < dates.ewcStart ? dates.ewcStart : anchor, F.paternityWindowDaysNI - 1)
    : addDays(addWeeks(anchor, F.paternityWindowWeeksGB), -1);
  return { dates, leaveEligible: dayOne || service, payEligible: service && earnings, reasons, schedule: flatSchedule(i.awe, i.leaveStart, i.weeks), windowEnd, consecutiveOnly: i.jurisdiction === 'NI' };
}

/** Shared parental: what is left of the 52 weeks of leave and 39 weeks of pay once the mother (or
 *  adopter) ends maternity/adoption leave and pay early. */
export function sharedParental(o: { leaveWeeksTaken: number; payWeeksTaken: number }) {
  const leaveTaken = Math.max(F.compulsoryLeaveWeeks, Math.min(F.maternityLeaveWeeks, o.leaveWeeksTaken));
  const payTaken = Math.max(0, Math.min(F.smpWeeks, o.payWeeksTaken));
  return { splWeeks: Math.max(0, F.maternityLeaveWeeks - leaveTaken), shppWeeks: Math.max(0, Math.min(F.shppWeeks, F.smpWeeks - payTaken)) };
}

/** Maternity Allowance (employed route): lower of the flat rate and 90% of average earnings, 39 weeks,
 *  if earning at least £30 a week in 13 of the 66 weeks before the expected week of childbirth. */
export function maternityAllowance(o: { awe: number; payStart: ISO }) {
  const eligible = o.awe >= F.maEarningsThreshold;
  return { eligible, schedule: flatSchedule(o.awe, o.payStart, F.maWeeks) };
}

/** Adoption: the matching week replaces the qualifying week; service of 26 weeks by its end. */
export function adoptionDates(matchDate: ISO) {
  const mwStart = weekStartSunday(matchDate);
  const mwEnd = addDays(mwStart, 6);
  return { mwStart, mwEnd, startedBy: addWeeks(mwEnd, -(F.serviceWeeks - 1)), lel: lelOn(mwEnd) };
}

/** Weeks between two dates, for timelines. */
export const weeksBetween = (a: ISO, b: ISO) => diffDays(a, b) / 7;

/** Earliest expected week of childbirth for which someone who started on `start` meets the 26-week
 *  service test (employed by the end of the qualifying week, 26 weeks back): the Sunday on or after
 *  start + 40 weeks − 6 days. */
export function firstQualifyingEwc(start: ISO): ISO {
  const target = addDays(addWeeks(start, F.qualifyingWeekBeforeEWC + F.serviceWeeks - 1), -6);
  return addDays(target, (7 - dayOfWeek(target)) % 7);
}
