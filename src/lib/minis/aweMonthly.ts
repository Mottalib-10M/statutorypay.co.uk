/** SMP average weekly earnings for a monthly-paid employee: two monthly payments, × 12 ÷ 52 (SMP (General)
 *  Regulations 1986, reg. 21(5)), then the SMP weekly amounts from the engine. */
import { ninety, ceilPenny } from '../engine/family';
import { FAMILY_RATE, LEL, P } from '../engine/params';
import { gbp } from './_kit';
import type { MiniSpec } from '../mini-types';

const X = P.familyExtra;

export default (): MiniSpec => ({
  title: 'Average weekly earnings from two monthly payslips',
  cta: 'Maternity pay calculator with your dates',
  inputs: [
    { id: 'm1', label: 'Gross pay, earlier payday', def: 2400, unit: '£', max: 1000000 },
    { id: 'm2', label: 'Gross pay, last payday', def: 2650, unit: '£', max: 1000000 },
  ],
  run: ({ m1, m2 }) => {
    const months = 2;
    const awe = ((m1 + m2) / months) * X.monthsPerYear / X.weeksPerYear;
    const ok = awe >= LEL;
    return {
      head: ['Average weekly earnings', gbp(awe, 2)],
      rows: [
        ['Total paid in the relevant period', gbp(m1 + m2, 2)],
        [`SMP, first ${P.familyPay.smpHigherRateWeeks} weeks`, ok ? `${gbp(ceilPenny(ninety(awe)), 2)} a week` : 'Not due'],
        ['SMP, later weeks', ok ? `${gbp(ceilPenny(Math.min(FAMILY_RATE, ninety(awe))), 2)} a week` : 'Not due'],
      ],
      note: ok ? `Above the ${gbp(LEL)} lower earnings limit: the earnings test is met.` : `Below the ${gbp(LEL)} lower earnings limit: SMP is not payable.`,
    };
  },
});
