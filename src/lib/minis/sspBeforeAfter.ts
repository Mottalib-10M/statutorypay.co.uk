/** Same absence under the pre-April 2026 rules and under the new ones. */
import { pre2026Ssp, post2026Ssp } from '../engine/ssp';
import { gbp, num } from './_kit';
import type { MiniSpec } from '../mini-types';

export default (): MiniSpec => ({
  title: 'One absence, old rules against new rules',
  cta: 'Work out your own sick pay',
  inputs: [
    { id: 'awe', label: 'Average gross weekly earnings', def: 110, unit: '£', max: 100000 },
    { id: 'days', label: 'Working days off sick in a row', def: 3, unit: 'days', max: 140 },
  ],
  run: ({ awe, days }) => {
    const before = pre2026Ssp(awe, 5, Math.round(days));
    const after = post2026Ssp(awe, 5, Math.round(days));
    return {
      head: ['Extra SSP under the 2026 rules', gbp(after.amount - before.amount, 2)],
      rows: [
        ['Spell starting from 6 April 2026', `${gbp(after.amount, 2)} for ${num(after.paidDays)} days`],
        ['Same spell under the old rules', `${gbp(before.amount, 2)} for ${num(before.paidDays)} days`],
      ],
      note: 'Monday-to-Friday worker. Old rules: 3 waiting days, nothing below £125 a week, £118.75 flat rate.',
    };
  },
});
