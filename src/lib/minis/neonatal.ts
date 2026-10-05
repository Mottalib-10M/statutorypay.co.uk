/** Neonatal Care Leave and Pay: one week per 7 full days in neonatal care, 12 weeks at most. */
import { P, FAMILY_RATE } from '../engine/params';
import { ninety, ceilPenny } from '../engine/family';
import { gbp, num } from './_kit';
import type { MiniSpec } from '../mini-types';

export default (): MiniSpec => ({
  title: 'Neonatal Care Leave and Pay from the days in care',
  cta: 'Maternity pay calculator',
  inputs: [
    { id: 'days', label: 'Full consecutive days in neonatal care', def: 23, unit: 'days', max: 400 },
    { id: 'awe', label: 'Average gross weekly earnings', def: 540, unit: '£', max: 100000 },
  ],
  run: ({ days, awe }) => {
    const F = P.familyPay;
    const weeks = days >= F.neonatalMinDays ? Math.min(Math.floor(days / 7), F.neonatalMaxWeeks) : 0;
    const weekly = ceilPenny(Math.min(FAMILY_RATE, ninety(awe)));
    return {
      head: ['Neonatal Care Leave', `${num(weeks)} week${weeks === 1 ? '' : 's'}`],
      rows: [
        ['Neonatal Care Pay a week (if eligible)', gbp(weekly, 2)],
        ['Pay for all the weeks', gbp(weekly * weeks, 2)],
        ['Must be taken within', `${F.neonatalWindowWeeks} weeks of the birth`],
      ],
      note: days < F.neonatalMinDays ? 'Fewer than 7 full days in a row: no entitlement.' : undefined,
    };
  },
});
