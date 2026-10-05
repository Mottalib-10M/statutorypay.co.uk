/** Weekly and daily SSP from earnings and the working pattern (rules from 6 April 2026). */
import { weeklySsp, dailySsp, sspForDays } from '../engine/ssp';
import { P } from '../engine/params';
import { gbp } from './_kit';
import type { MiniSpec } from '../mini-types';

export default (): MiniSpec => ({
  title: 'Your Statutory Sick Pay, week and day',
  cta: 'Sick pay calculator with your dates',
  inputs: [
    { id: 'awe', label: 'Average gross weekly earnings', def: 420, unit: '£', max: 100000 },
    { id: 'q', label: 'Days you normally work each week', def: 5, unit: 'days', max: 7 },
  ],
  run: ({ awe, q }) => {
    const qd = Math.max(1, Math.min(7, Math.round(q)));
    return {
      head: ['Statutory Sick Pay a week', gbp(weeklySsp(awe), 2)],
      rows: [
        ['For one day off', gbp(sspForDays(awe, qd, 1), 2)],
        ['Daily rate, cut at four decimals', gbp(dailySsp(awe, qd), 4)],
        [`Most for ${P.ssp.maxWeeks} weeks of sickness`, gbp(sspForDays(awe, qd, qd) * P.ssp.maxWeeks, 2)],
      ],
      note: awe * P.ssp.earningsShare < P.ssp.weeklyRate ? '80% of your earnings applies: it is lower than the flat rate.' : 'The flat rate applies: 80% of your earnings would be higher.',
    };
  },
});
