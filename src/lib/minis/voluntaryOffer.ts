/** Statutory floor of a voluntary redundancy offer and two common ways of enhancing it. */
import { reckonerWeeks } from '../engine/redundancy';
import { CAP_GB, P } from '../engine/params';
import { gbp, num } from './_kit';
import type { MiniSpec } from '../mini-types';

export default (): MiniSpec => ({
  title: 'The legal floor under a voluntary redundancy offer',
  cta: 'Compute the statutory amount from your dates',
  inputs: [
    { id: 'age', label: 'Age on your last day', def: 49, unit: 'years', max: 99 },
    { id: 'years', label: 'Complete years with the employer', def: 15, unit: 'years', max: 60 },
    { id: 'pay', label: 'Gross weekly pay', def: 950, unit: '£', max: 100000 },
  ],
  run: ({ age, years, pay }) => {
    const ok = years >= P.redundancy.qualifyingYears;
    const weeks = ok ? reckonerWeeks(age, years) : 0;
    const floor = weeks * Math.min(pay, CAP_GB);
    return {
      head: ['No offer can be lower than', gbp(floor)],
      rows: [
        ['Statutory weeks', num(weeks, 1)],
        ['Same weeks on your actual pay', gbp(weeks * pay)],
        ['Twice the weeks on your actual pay', gbp(2 * weeks * pay)],
      ],
      note: ok ? undefined : 'Under two complete years there is no statutory floor: any payment is the employer’s choice.',
    };
  },
});
