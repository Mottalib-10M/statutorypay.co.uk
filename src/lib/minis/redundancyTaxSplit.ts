/** Splits a leaving package between the £30,000 threshold and earnings (ITEPA 2003 s.403; no tax computed). */
import { computeFinal } from '../engine/final';
import { P } from '../engine/params';
import { gbp } from './_kit';
import type { MiniSpec } from '../mini-types';

export default (): MiniSpec => ({
  title: `Which part of your package sits under the ${gbp(P.termination.taxFreeThreshold)} threshold?`,
  cta: 'Add notice and holiday pay in the final pay calculator',
  inputs: [
    { id: 'stat', label: 'Statutory redundancy pay', def: 11000, unit: '£', max: 1000000 },
    { id: 'extra', label: 'Enhanced or ex gratia redundancy pay', def: 26000, unit: '£', max: 10000000 },
    { id: 'notice', label: 'Notice pay or pay in lieu', def: 5200, unit: '£', max: 1000000 },
  ],
  run: ({ stat, extra, notice }) => {
    const f = computeFinal({ statutoryRedundancy: stat, extraRedundancy: extra, noticeWeeks: 1, weeklyPay: notice, holidayDays: 0, daysPerWeek: 5, arrears: 0 });
    return {
      head: ['Inside the threshold', gbp(f.withinThreshold)],
      rows: [
        ['Redundancy pay above the threshold', gbp(f.aboveThreshold)],
        ['Taxed as earnings like wages', gbp(f.earnings)],
        ['Employer Class 1A on the excess', gbp(f.aboveThreshold * P.termination.class1ARate)],
      ],
      note: 'Gross amounts only. The share above the threshold and the earnings go through PAYE.',
    };
  },
});
