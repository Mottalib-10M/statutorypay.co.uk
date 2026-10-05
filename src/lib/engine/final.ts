/**
 * Final pay when a job ends: statutory redundancy pay, any extra redundancy pay from the employer,
 * notice pay (worked or in lieu), and pay for untaken holiday. Only the redundancy elements fall
 * under the £30,000 threshold of ITEPA 2003 s.403; notice pay (including post-employment notice
 * pay) and holiday pay are taxed as earnings (HMRC EIM13505). Gross figures only: this site does not
 * compute income tax or National Insurance.
 */
import { P } from './params';

export interface FinalInput { statutoryRedundancy: number; extraRedundancy: number; noticeWeeks: number; weeklyPay: number; holidayDays: number; daysPerWeek: number; arrears: number }
export interface FinalResult {
  redundancy: number; notice: number; holiday: number; arrears: number; total: number;
  withinThreshold: number; aboveThreshold: number; earnings: number; threshold: number;
}
export function computeFinal(i: FinalInput): FinalResult {
  const pos = (x: number) => Math.max(0, x || 0);
  const redundancy = pos(i.statutoryRedundancy) + pos(i.extraRedundancy);
  const notice = pos(i.noticeWeeks) * pos(i.weeklyPay);
  const holiday = i.daysPerWeek > 0 ? pos(i.holidayDays) * pos(i.weeklyPay) / i.daysPerWeek : 0;
  const arrears = pos(i.arrears);
  const threshold = P.termination.taxFreeThreshold;
  const withinThreshold = Math.min(redundancy, threshold);
  return { redundancy, notice, holiday, arrears, total: redundancy + notice + holiday + arrears, withinThreshold, aboveThreshold: redundancy - withinThreshold, earnings: notice + holiday + arrears, threshold };
}
