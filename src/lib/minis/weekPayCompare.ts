/** A week's pay for variable earnings: 12-week average (notice, redundancy) against 52-week average (holiday). */
import { averageWeek } from '../engine/redundancy';
import { averageWeeksPay } from '../engine/holiday';
import { CAP_GB, P } from '../engine/params';
import { gbp } from './_kit';
import type { MiniSpec } from '../mini-types';

export default (): MiniSpec => ({
  title: 'Same pay slips, two different weeks’ pay',
  cta: 'Use the figure in the redundancy pay calculator',
  inputs: [
    { id: 'basic', label: 'Basic weekly pay', def: 540, unit: '£', max: 100000 },
    { id: 'ot12', label: `Overtime, last ${P.redundancy.averagingWeeks} weeks`, def: 2100, unit: '£', max: 1000000 },
    { id: 'ot52', label: `Overtime, last ${P.holiday.referenceWeeks} weeks`, def: 5200, unit: '£', max: 5000000 },
  ],
  run: ({ basic, ot12, ot52 }) => {
    const w = P.redundancy.averagingWeeks, y = P.holiday.referenceWeeks;
    const short = averageWeek(basic * w + ot12, w);
    const long = averageWeeksPay(basic * y + ot52, y);
    return {
      head: ['Gap between the two averages', gbp(Math.abs(short - long), 2)],
      rows: [
        [`${w}-week average (notice, redundancy)`, gbp(short, 2)],
        [`${y}-week average (holiday pay, GB)`, gbp(long, 2)],
        ['Used for redundancy pay after the cap', gbp(Math.min(short, CAP_GB), 2)],
      ],
    };
  },
});
