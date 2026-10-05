/** Typed access to `data/params-2026.json`: every statutory figure comes from here (RECETTE §4). */
import raw from '../../data/params-2026.json';
import type { ISO } from './dates';

export const P = raw;
export type Params = typeof raw;
export type SourceKey = keyof typeof raw.sources;
export type Jurisdiction = 'GB' | 'NI';

/** Value of a dated series on a date: the last entry whose `from` is on or before the date. */
function onDate<T extends { from: string }>(series: T[], date: ISO): T {
  let hit = series[0];
  for (const s of series) if (s.from <= date) hit = s;
  return hit;
}

/** Maximum week's pay for a redundancy payment, by the relevant date and the jurisdiction. */
export const redundancyCapOn = (date: ISO, j: Jurisdiction = 'GB') =>
  onDate(j === 'NI' ? P.redundancy.weeklyCapNI : P.redundancy.weeklyCapGB, date).cap;
/** Current caps (2026/27). */
export const CAP_GB = P.redundancy.weeklyCapGB[P.redundancy.weeklyCapGB.length - 1].cap;
export const CAP_NI = P.redundancy.weeklyCapNI[P.redundancy.weeklyCapNI.length - 1].cap;
export const MAX_REDUNDANCY_GB = CAP_GB * P.redundancy.maxYears * 1.5;
export const MAX_REDUNDANCY_NI = CAP_NI * P.redundancy.maxYears * 1.5;

/** Standard weekly rate of SMP, SAP, ShPP, SPP (the flat rate) in force on a date. */
export const familyRateOn = (date: ISO) => onDate(P.familyPay.rates, date).weekly;
export const FAMILY_RATE = P.familyPay.rates[P.familyPay.rates.length - 1].weekly;
/** Lower earnings limit in force on a date (the Saturday ending the qualifying week). */
export const lelOn = (date: ISO) => onDate(P.familyPay.lowerEarningsLimit, date).lel;
export const LEL = P.familyPay.lowerEarningsLimit[P.familyPay.lowerEarningsLimit.length - 1].lel;
