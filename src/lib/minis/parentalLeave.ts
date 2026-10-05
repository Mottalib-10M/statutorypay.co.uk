/** Unpaid parental leave left for a child, with the 4-week yearly limit. */
import { P } from '../engine/params';
import { num } from './_kit';
import type { MiniSpec } from '../mini-types';

export default (): MiniSpec => ({
  title: 'Unpaid parental leave you still have for a child',
  cta: 'Family leave calculators',
  inputs: [
    { id: 'age', label: 'Child’s age today', def: 6, unit: 'years', max: 17 },
    { id: 'used', label: 'Weeks already taken for this child', def: 3, unit: 'weeks', max: 18 },
    { id: 'dpw', label: 'Days you work a week', def: 4, unit: 'days', max: 7 },
  ],
  run: ({ age, used, dpw }) => {
    const F = P.familyPay;
    const left = Math.max(0, F.parentalLeaveWeeksPerChild - used);
    const yearsLeft = Math.max(0, F.parentalLeaveAgeLimit - age);
    const usable = Math.min(left, yearsLeft * F.parentalLeaveWeeksPerYear);
    return {
      head: ['Weeks you can still take', num(usable)],
      rows: [
        ['Left of the 18 weeks', num(left)],
        [`Most per year (${F.parentalLeaveWeeksPerYear} weeks) until the 18th birthday`, num(yearsLeft * F.parentalLeaveWeeksPerYear)],
        ['One week of leave equals', `${num(dpw, 1)} working days`],
      ],
    };
  },
});
