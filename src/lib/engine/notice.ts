/**
 * Statutory minimum notice: Employment Rights Act 1996 s.86 (GB), Employment Rights (NI) Order 1996
 * art. 118 (same scale). Employer: one week under two years, then one week per complete year of
 * continuous employment, up to twelve. Employee: one week. Nothing under one month of service.
 */
import { P } from './params';
import { addDays, addWeeks, addYears, fullMonths, fullYears, maxISO, type ISO } from './dates';

/** Weeks of notice the employer must give, from continuous service on the day notice is given. */
export function statutoryNoticeWeeks(start: ISO, noticeGiven: ISO): number {
  const months = fullMonths(start, addDays(noticeGiven, 1));
  if (months < P.notice.minServiceMonths) return 0;
  const years = fullYears(start, addDays(noticeGiven, 1));
  if (years < 2) return P.notice.underTwoYearsWeeks;
  return Math.min(years, P.notice.maxWeeks);
}

/** Last day of a notice of `weeks` weeks given on `noticeGiven` (notice runs from the next day). */
export const noticeEnd = (noticeGiven: ISO, weeks: number): ISO => addWeeks(noticeGiven, weeks);

export interface NoticeInput { start: ISO; noticeGiven: ISO; contractualWeeks: number; weeklyPay: number; byEmployee?: boolean }
export interface NoticeResult {
  statutoryWeeks: number; contractualWeeks: number; appliedWeeks: number; ruleApplied: 'statutory' | 'contract' | 'none';
  endDate: ISO; serviceYears: number; serviceMonths: number; noticePay: number; nextStepUp: ISO | null;
}

/** Notice owed: the longer of the contract and the statute (s.86(3): a shorter contract term is overridden). */
export function computeNotice(i: NoticeInput): NoticeResult {
  const serviceMonths = fullMonths(i.start, addDays(i.noticeGiven, 1));
  const serviceYears = fullYears(i.start, addDays(i.noticeGiven, 1));
  const statutoryWeeks = i.byEmployee
    ? (serviceMonths >= P.notice.minServiceMonths ? P.notice.employeeWeeks : 0)
    : statutoryNoticeWeeks(i.start, i.noticeGiven);
  const contractualWeeks = Math.max(0, i.contractualWeeks || 0);
  const appliedWeeks = Math.max(statutoryWeeks, contractualWeeks);
  const ruleApplied = appliedWeeks === 0 ? 'none' : contractualWeeks > statutoryWeeks ? 'contract' : 'statutory';
  // Date on which the statutory scale next rises by a week (employer notice only, 2 to 11 years).
  let nextStepUp: ISO | null = null;
  if (!i.byEmployee && serviceYears < P.notice.maxWeeks) {
    const target = serviceYears < 2 ? 2 : serviceYears + 1;
    nextStepUp = addDays(addYears(i.start, target), -1);
  }
  return { statutoryWeeks, contractualWeeks, appliedWeeks, ruleApplied, endDate: noticeEnd(i.noticeGiven, appliedWeeks), serviceYears, serviceMonths, noticePay: appliedWeeks * Math.max(0, i.weeklyPay || 0), nextStepUp: nextStepUp ? maxISO(nextStepUp, i.noticeGiven) : null };
}
