/** Redundancy on maternity leave: payment on normal pay (not SMP) and the SMP that stays payable. */
import { reckonerWeeks } from '../engine/redundancy';
import { smpSchedule } from '../engine/family';
import { CAP_GB, FAMILY_RATE, P } from '../engine/params';
import { gbp } from './_kit';
import type { MiniSpec } from '../mini-types';

// Pay weeks anchored on a Sunday in the current tax year.
const PAY_START = '2026-10-04';

export default (): MiniSpec => ({
  title: 'Made redundant on maternity leave: the two payments',
  cta: 'Check the redundancy pay with your dates',
  inputs: [
    { id: 'age', label: 'Age on your last day', def: 34, unit: 'years', max: 99 },
    { id: 'years', label: 'Complete years with the employer', def: 6, unit: 'years', max: 60 },
    { id: 'pay', label: 'Normal gross weekly pay', def: 640, unit: '£', max: 100000 },
  ],
  run: ({ age, years, pay }) => {
    const ok = years >= P.redundancy.qualifyingYears;
    const weeks = ok ? reckonerWeeks(age, years) : 0;
    const smp = smpSchedule(pay, PAY_START);
    return {
      head: ['Redundancy pay on your normal pay', gbp(weeks * Math.min(pay, CAP_GB))],
      rows: [
        ['If it were wrongly based on SMP', gbp(weeks * Math.min(FAMILY_RATE, CAP_GB))],
        [`Full ${P.familyPay.smpWeeks} weeks of SMP, still owed`, gbp(smp.total, 2)],
      ],
      note: `SMP continues after the job ends if you qualified. Weeks after April ${P.year + 1} are priced at today’s rate until the new rate is set.`,
    };
  },
});
