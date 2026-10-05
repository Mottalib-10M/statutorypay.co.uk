/** Northern Ireland against Great Britain: the same redundancy case under the two weekly caps. */
import { reckonerWeeks } from '../engine/redundancy';
import { CAP_GB, CAP_NI, P } from '../engine/params';
import { gbp, num } from './_kit';
import type { MiniSpec } from '../mini-types';

export default (): MiniSpec => ({
  title: 'Belfast or Birmingham: the same redundancy',
  cta: 'Full calculator, Northern Ireland option',
  inputs: [
    { id: 'age', label: 'Age when your notice ends', def: 47, unit: 'years', max: 99 },
    { id: 'years', label: 'Complete years with the employer', def: 16, unit: 'years', max: 60 },
    { id: 'pay', label: 'Gross weekly pay', def: 820, unit: '£', max: 100000 },
  ],
  run: ({ age, years, pay }) => {
    const ok = years >= P.redundancy.qualifyingYears;
    const weeks = ok ? reckonerWeeks(age, Math.min(years, P.redundancy.maxYears)) : 0;
    const ni = weeks * Math.min(pay, CAP_NI), gb = weeks * Math.min(pay, CAP_GB);
    return {
      head: ['Statutory redundancy pay in Northern Ireland', gbp(ni)],
      rows: [
        ['Weeks of pay (same in both)', num(weeks, 1)],
        ['Same case in Great Britain', gbp(gb)],
        ['Extra from the NI cap', gbp(ni - gb)],
      ],
      note: ok ? undefined : 'Under two complete years: no statutory payment in either jurisdiction.',
    };
  },
});
