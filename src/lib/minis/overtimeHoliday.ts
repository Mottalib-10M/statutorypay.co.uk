/** A year of holiday pay with regular overtime: the 4 weeks at normal rate against the 1.6 weeks. */
import { holidayPay } from '../engine/holiday';
import { gbp } from './_kit';
import type { MiniSpec } from '../mini-types';

export default (): MiniSpec => ({
  title: 'What regular overtime adds to a year of holiday pay',
  cta: 'Holiday pay calculator',
  inputs: [
    { id: 'basic', label: 'Basic weekly pay', def: 480, unit: '£', max: 100000 },
    { id: 'extra', label: 'Average weekly overtime and commission', def: 120, unit: '£', max: 100000 },
  ],
  run: ({ basic, extra }) => {
    const regular = holidayPay({ basicWeek: basic, extrasWeek: extra, daysPerWeek: 5, daysTaken: 28, irregular: false });
    const none = holidayPay({ basicWeek: basic, extrasWeek: 0, daysPerWeek: 5, daysTaken: 28, irregular: false });
    const irregular = holidayPay({ basicWeek: basic, extrasWeek: extra, daysPerWeek: 5, daysTaken: 28, irregular: true });
    return {
      head: ['Overtime and commission in your holiday pay', gbp(regular.pay - none.pay)],
      rows: [
        ['28 days, extras for the first 4 weeks only', gbp(regular.pay)],
        ['28 days at basic pay only (unlawful)', gbp(none.pay)],
        ['28 days, extras on every week', gbp(irregular.pay)],
      ],
    };
  },
});
