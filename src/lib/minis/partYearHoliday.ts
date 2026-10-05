/** Term-time or part-year worker in Great Britain: holiday accrued over the working weeks. */
import { irregularAccrual } from '../engine/holiday';
import { P } from '../engine/params';
import { num } from './_kit';
import type { MiniSpec } from '../mini-types';

export default (): MiniSpec => ({
  title: 'Holiday for a term-time or part-year contract',
  cta: 'Irregular hours holiday calculator',
  inputs: [
    { id: 'weeks', label: 'Weeks worked in the year', def: 39, unit: 'weeks', max: 52 },
    { id: 'hpw', label: 'Hours worked in a working week', def: 30, unit: 'hours', max: 80, decimals: 1 },
  ],
  run: ({ weeks, hpw }) => {
    const perWeek = irregularAccrual(hpw).credited;
    const yearHours = perWeek * weeks;
    return {
      head: ['Holiday hours accrued in the year (weekly pay)', num(yearHours)],
      rows: [
        ['Accrued each working week', `${num(perWeek)} hours`],
        ['In working weeks of these hours', num(hpw > 0 ? yearHours / hpw : 0, 1)],
        ['If it were 5.6 weeks of a full year', `${num(P.holiday.statutoryWeeks * hpw)} hours`],
      ],
      note: 'Great Britain, leave years from 1 April 2024. Weekly pay periods; monthly ones round once a month.',
    };
  },
});
