/** Enhanced maternity scheme (weeks at full pay, weeks at half pay) against statutory SMP alone. Scheme
 *  pay includes SMP: each week pays the higher of the scheme amount and the SMP due (HMRC SPM182600). */
import { smpSchedule } from '../engine/family';
import { firstSundayOfApril } from '../engine/dates';
import { P } from '../engine/params';
import { gbp } from './_kit';
import type { MiniSpec } from '../mini-types';

const F = P.familyPay;

export default (): MiniSpec => ({
  title: 'Company maternity scheme or statutory pay?',
  cta: 'Statutory pay week by week',
  inputs: [
    { id: 'pay', label: 'Normal gross weekly pay', def: 650, unit: '£', max: 100000 },
    { id: 'full', label: 'Weeks on full pay in the scheme', def: 12, unit: 'weeks', max: 52 },
    { id: 'half', label: 'Then weeks on half pay', def: 12, unit: 'weeks', max: 52 },
  ],
  run: ({ pay, full, half }) => {
    const s = smpSchedule(pay, firstSundayOfApril(P.year));
    const weeks = Math.max(F.smpWeeks, Math.round(full) + Math.round(half));
    let enhanced = 0;
    for (let n = 1; n <= weeks; n++) {
      const scheme = n <= full ? pay : n <= full + half ? pay / 2 : 0;
      const smp = n <= F.smpWeeks ? s.weeks[n - 1].amount : 0;
      enhanced += Math.max(scheme, smp);
    }
    return {
      head: ['Extra from the company scheme', gbp(enhanced - s.total, 2)],
      rows: [
        ['Company scheme, SMP included', gbp(enhanced, 2)],
        [`Statutory Maternity Pay alone, ${F.smpWeeks} weeks`, gbp(s.total, 2)],
      ],
      note: 'Assumes the scheme includes SMP rather than adding it: check the wording of your policy, and any condition to return to work.',
    };
  },
});
