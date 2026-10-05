/** Value of a payment in lieu of notice: basic pay plus contractual benefits for the notice weeks. */
import { computeFinal } from '../engine/final';
import { gbp } from './_kit';
import type { MiniSpec } from '../mini-types';

export default (): MiniSpec => ({
  title: 'What your notice is worth if paid in lieu',
  cta: 'Add redundancy and holiday in the final pay calculator',
  inputs: [
    { id: 'weeks', label: 'Weeks of notice not worked', def: 8, unit: 'weeks', max: 52 },
    { id: 'pay', label: 'Gross weekly basic pay', def: 690, unit: '£', max: 100000 },
    { id: 'extras', label: 'Weekly value of contractual benefits', def: 45, unit: '£', max: 20000 },
  ],
  run: ({ weeks, pay, extras }) => {
    const basic = computeFinal({ statutoryRedundancy: 0, extraRedundancy: 0, noticeWeeks: weeks, weeklyPay: pay, holidayDays: 0, daysPerWeek: 5, arrears: 0 });
    const perks = computeFinal({ statutoryRedundancy: 0, extraRedundancy: 0, noticeWeeks: weeks, weeklyPay: extras, holidayDays: 0, daysPerWeek: 5, arrears: 0 });
    return {
      head: ['Payment in lieu of notice, gross', gbp(basic.notice + perks.notice)],
      rows: [
        ['Basic pay for the notice weeks', gbp(basic.notice)],
        ['Pension, health cover and other extras', gbp(perks.notice)],
        [`Covered by the ${gbp(basic.threshold)} threshold`, gbp(0)],
      ],
      note: 'Pay in lieu of notice is taxed as earnings: the redundancy threshold never applies to it.',
    };
  },
});
