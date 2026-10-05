/** Statutory Maternity Pay total from average weekly earnings (39 weeks priced at the 2026/27 rates). */
import { smpSchedule } from '../engine/family';
import { firstSundayOfApril } from '../engine/dates';
import { FAMILY_RATE, LEL, P } from '../engine/params';
import { gbp, pct } from './_kit';
import type { MiniSpec } from '../mini-types';

const F = P.familyPay;

export default (): MiniSpec => ({
  title: 'Your Statutory Maternity Pay from one number',
  cta: 'Maternity pay calculator with your due date',
  inputs: [
    { id: 'awe', label: 'Average gross weekly earnings', def: 480, unit: '£', max: 100000 },
  ],
  run: ({ awe }) => {
    // Leave starting on the first Sunday of April of the tax year: all 39 weeks at the 2026/27 rate.
    const s = smpSchedule(awe, firstSundayOfApril(P.year));
    const later = F.smpWeeks - F.smpHigherRateWeeks;
    return {
      head: [`Statutory Maternity Pay over ${F.smpWeeks} weeks`, awe < LEL ? 'Not due' : gbp(s.total, 2)],
      rows: [
        [`Weeks 1 to ${F.smpHigherRateWeeks}, each`, gbp(s.weeks[0].amount, 2)],
        [`Weeks ${F.smpHigherRateWeeks + 1} to ${F.smpWeeks}, each`, gbp(s.weeks[F.smpWeeks - 1].amount, 2)],
        [`The ${later} later weeks together`, gbp(s.rest, 2)],
      ],
      note: awe < LEL
        ? `Below the ${gbp(LEL)} lower earnings limit: no SMP, but Maternity Allowance may be payable.`
        : awe * F.earningsShare < FAMILY_RATE ? `${pct(F.earningsShare, 0)} of your earnings is below the flat rate, so it applies to all ${F.smpWeeks} weeks.` : `The flat ${gbp(FAMILY_RATE, 2)} applies from week ${F.smpHigherRateWeeks + 1}. Before tax and National Insurance.`,
    };
  },
});
