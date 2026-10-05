/** Parental Bereavement Leave and Pay: two weeks within 56 weeks, flat rate or 90%. */
import { P, FAMILY_RATE, LEL } from '../engine/params';
import { ninety, ceilPenny } from '../engine/family';
import { gbp } from './_kit';
import type { MiniSpec } from '../mini-types';

export default (): MiniSpec => ({
  title: 'Parental Bereavement Pay for one or two weeks',
  cta: 'Paternity and family pay calculators',
  inputs: [
    { id: 'awe', label: 'Average gross weekly earnings', def: 460, unit: '£', max: 100000 },
    { id: 'weeks', label: 'Weeks of leave', def: 2, options: [{ value: '1', label: '1 week' }, { value: '2', label: '2 weeks' }] },
  ],
  run: ({ awe, weeks }) => {
    const weekly = ceilPenny(Math.min(FAMILY_RATE, ninety(awe)));
    const ok = awe >= LEL;
    return {
      head: ['Statutory Parental Bereavement Pay', ok ? gbp(weekly * weeks, 2) : gbp(0)],
      rows: [
        ['Weekly rate for these earnings', gbp(weekly, 2)],
        ['Earnings needed in Great Britain', `${gbp(LEL)} a week`],
        ['Window to take the leave', `${P.familyPay.bereavementWindowWeeks} weeks`],
      ],
      note: ok ? undefined : 'Below the lower earnings limit: leave is still available, pay is not (Great Britain).',
    };
  },
});
