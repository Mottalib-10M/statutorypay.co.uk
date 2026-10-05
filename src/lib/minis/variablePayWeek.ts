/** A week's pay for redundancy when pay varies: 12-week average (ERA 1996 ss.221-224), then the reckoner. */
import { averageWeek, reckonerWeeks } from '../engine/redundancy';
import { CAP_GB, P } from '../engine/params';
import { gbp, num } from './_kit';
import type { MiniSpec } from '../mini-types';

const N = P.redundancy.averagingWeeks;

export default (): MiniSpec => ({
  title: 'From 12 weeks of payslips to redundancy pay',
  cta: 'Use the average in the full calculator',
  inputs: [
    { id: 'total', label: `Gross pay in the last ${N} paid weeks`, def: 7380, unit: '£', max: 2000000 },
    { id: 'age', label: 'Age on your last day', def: 37, unit: 'years', max: 99 },
    { id: 'years', label: 'Complete years with the employer', def: 9, unit: 'years', max: 60 },
  ],
  run: ({ total, age, years }) => {
    const week = averageWeek(total, N);
    const ok = years >= P.redundancy.qualifyingYears;
    const weeks = ok ? reckonerWeeks(age, years) : 0;
    const used = Math.min(week, CAP_GB);
    return {
      head: ['Statutory redundancy pay', gbp(weeks * used)],
      rows: [
        ['Average week’s pay', gbp(week, 2)],
        ['Week’s pay used', `${gbp(used, 2)}${week > CAP_GB ? ' (capped)' : ''}`],
        ['Weeks of pay', num(weeks, 1)],
      ],
      note: ok ? undefined : 'Under two complete years: no statutory redundancy pay.',
    };
  },
});
