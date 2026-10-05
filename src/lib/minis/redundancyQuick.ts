/** Statutory redundancy pay from age, complete years and weekly pay (ready-reckoner count). */
import { reckonerWeeks } from '../engine/redundancy';
import { CAP_GB, CAP_NI, P } from '../engine/params';
import { gbp, num } from './_kit';
import type { MiniSpec } from '../mini-types';

export default (): MiniSpec => ({
  title: 'Your statutory redundancy pay in three numbers',
  cta: 'Full calculator with your exact dates',
  inputs: [
    { id: 'age', label: 'Age when your notice ends', def: 38, unit: 'years', max: 99 },
    { id: 'years', label: 'Complete years with the employer', def: 9, unit: 'years', max: 60 },
    { id: 'pay', label: 'Gross weekly pay', def: 580, unit: '£', max: 100000 },
  ],
  run: ({ age, years, pay }) => {
    const ok = years >= P.redundancy.qualifyingYears;
    const weeks = ok ? reckonerWeeks(age, Math.min(years, P.redundancy.maxYears)) : 0;
    const week = Math.min(pay, CAP_GB);
    return {
      head: ['Statutory redundancy pay (Great Britain)', gbp(weeks * week)],
      rows: [
        ['Weeks of pay', num(weeks, 1)],
        ['Weekly pay used', `${gbp(week)}${pay > CAP_GB ? ' (capped)' : ''}`],
        ['Same case in Northern Ireland', gbp(weeks * Math.min(pay, CAP_NI))],
      ],
      note: ok ? undefined : 'Under two complete years: nothing is due by law.',
    };
  },
});
