/** Maternity Allowance weekly and total from earnings and the claim route. */
import { maternityAllowance } from '../engine/family';
import { firstSundayOfApril } from '../engine/dates';
import { FAMILY_RATE, P } from '../engine/params';
import { gbp, pct } from './_kit';
import type { MiniSpec } from '../mini-types';

const F = P.familyPay;
const X = P.familyExtra;

export default (): MiniSpec => ({
  title: 'Your Maternity Allowance, week and total',
  cta: 'Compare with Statutory Maternity Pay',
  inputs: [
    { id: 'route', label: 'Your situation', def: 0, options: [
      { value: '0', label: 'Employed or recently stopped work' },
      { value: '1', label: `Self-employed, Class 2 paid for ${X.maClass2WeeksForFullRate} weeks` },
      { value: '2', label: 'Unpaid work in spouse’s business' },
    ] },
    { id: 'awe', label: 'Average gross weekly earnings', def: 260, unit: '£', max: 100000 },
  ],
  run: ({ route, awe }) => {
    if (route === 2) {
      return {
        head: ['Maternity Allowance a week', gbp(F.maLowRate, 2)],
        rows: [['Weeks paid', String(X.maSpouseWeeks)], ['Total', gbp(F.maLowRate * X.maSpouseWeeks, 2)]],
        note: 'Your spouse or civil partner must be registered self-employed and paying Class 2 contributions.',
      };
    }
    if (route === 1) {
      return {
        head: ['Maternity Allowance a week', gbp(FAMILY_RATE, 2)],
        rows: [['Weeks paid', String(F.maWeeks)], ['Total', gbp(FAMILY_RATE * F.maWeeks, 2)], ['With no Class 2 paid', `${gbp(F.maLowRate, 2)} a week`]],
        note: `Fewer than ${X.maClass2WeeksForFullRate} weeks of Class 2 contributions gives a lower rate, from ${gbp(F.maLowRate, 2)} upwards.`,
      };
    }
    const r = maternityAllowance({ awe, payStart: firstSundayOfApril(P.year) });
    return {
      head: ['Maternity Allowance a week', r.eligible ? gbp(r.schedule.weeks[0].amount, 2) : 'Not due'],
      rows: [
        ['Weeks paid', r.eligible ? String(F.maWeeks) : '0'],
        ['Total', r.eligible ? gbp(r.schedule.total, 2) : gbp(0)],
        ['Weeks of leave left unpaid', r.eligible ? String(F.maternityLeaveWeeks - F.maWeeks) : String(F.maternityLeaveWeeks)],
      ],
      note: r.eligible ? `The lower of ${gbp(FAMILY_RATE, 2)} and ${pct(F.earningsShare, 0)} of your earnings.` : `You need at least ${gbp(F.maEarningsThreshold)} a week in ${X.maEarningWeeks} of the ${F.maTestPeriodWeeks} weeks before the due week.`,
    };
  },
});
