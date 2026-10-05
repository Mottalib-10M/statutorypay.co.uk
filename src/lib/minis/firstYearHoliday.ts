/** Holiday available during the first year (reg 15A): one-twelfth a month, rounded up to a half day. */
import { firstYearAccrued, entitlementDays } from '../engine/holiday';
import { num } from './_kit';
import type { MiniSpec } from '../mini-types';

export default (): MiniSpec => ({
  title: 'Holiday you can already book in your first year',
  cta: 'Holiday entitlement calculator',
  inputs: [
    { id: 'months', label: 'Month of employment you are in', def: 4, unit: 'month', max: 12 },
    { id: 'dpw', label: 'Days worked per week', def: 5, unit: 'days', max: 7, decimals: 1 },
    { id: 'taken', label: 'Days already taken', def: 2, unit: 'days', max: 28, decimals: 1 },
  ],
  run: ({ months, dpw, taken }) => {
    const acc = firstYearAccrued(dpw, months);
    return {
      head: ['Days you can take now', num(Math.max(0, acc - taken), 1)],
      rows: [
        ['Accrued so far (rounded up to a half day)', num(acc, 1)],
        ['Full year’s statutory entitlement', num(entitlementDays(dpw), 1)],
        ['Accrues each month', num(entitlementDays(dpw) / 12, 2)],
      ],
    };
  },
});
