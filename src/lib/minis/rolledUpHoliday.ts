/** Rolled-up holiday pay (reg 16A, Great Britain): the 12.07% uplift on pay for work done in a pay
 *  period, the hours of leave accrued at the same time (reg 15B) and the yearly equivalent. */
import { rolledUp, irregularAccrual } from '../engine/holiday';
import { P } from '../engine/params';
import { gbp, num, pct } from './_kit';
import type { MiniSpec } from '../mini-types';

const PERIODS = [52, 26, 13, 12];
const LABELS = ['Weekly', 'Fortnightly', 'Every 4 weeks', 'Monthly'];

export default (): MiniSpec => ({
  title: 'Rolled-up holiday pay on your payslip',
  cta: 'Irregular hours calculator: accrual and rolled-up pay',
  inputs: [
    { id: 'pay', label: 'Pay for work done in the period', def: 1220, unit: '£', max: 100000 },
    { id: 'hours', label: 'Hours worked in the period', def: 96, unit: 'hours', max: 800, decimals: 1 },
    { id: 'freq', label: 'Pay period', def: 3, options: LABELS.map((label, i) => ({ value: String(i), label })) },
  ],
  run: ({ pay, hours, freq }) => {
    const per = PERIODS[Math.max(0, Math.min(3, Math.round(freq)))];
    const up = rolledUp(pay);
    return {
      head: [`Holiday pay line (${pct(P.holiday.irregularAccrualRate, 2)})`, gbp(up, 2)],
      rows: [
        ['Total for the period, work plus holiday pay', gbp(pay + up, 2)],
        ['Hours of leave accrued this period', `${num(irregularAccrual(hours).credited)} hours`],
        [`Holiday pay over a year (${per} such periods)`, gbp(up * per)],
      ],
      note: 'Great Britain only, irregular-hours and part-year workers, leave years from 1 April 2024.',
    };
  },
});
