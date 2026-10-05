/** Zero-hours worker: a week's holiday pay from the paid weeks, and hours accrued at 12.07%. */
import { averageWeeksPay, irregularAccrual } from '../engine/holiday';
import { gbp, num } from './_kit';
import type { MiniSpec } from '../mini-types';

export default (): MiniSpec => ({
  title: 'Holiday on a zero-hours contract',
  cta: 'Irregular hours holiday calculator',
  inputs: [
    { id: 'pay', label: 'Pay received in the reference period', def: 9800, unit: '£', max: 1000000 },
    { id: 'weeks', label: 'Weeks in which you were paid', def: 40, unit: 'weeks', max: 104 },
    { id: 'hours', label: 'Hours worked last pay period', def: 64, unit: 'hours', max: 800, decimals: 1 },
  ],
  run: ({ pay, weeks, hours }) => {
    const week = averageWeeksPay(pay, weeks);
    return {
      head: ['A week’s holiday pay', gbp(week)],
      rows: [
        ['Weeks averaged (52 at most)', num(Math.min(weeks, 52))],
        ['Holiday accrued on last period’s hours (GB)', `${num(irregularAccrual(hours).credited)} hours`],
        ['Hourly holiday pay if you averaged 20 hours', gbp(week / 20, 2)],
      ],
    };
  },
});
