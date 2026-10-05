/** Pay for a week with Keeping in Touch days during the SMP period. */
import { ninety, ceilPenny } from '../engine/family';
import { FAMILY_RATE, P } from '../engine/params';
import { gbp } from './_kit';
import type { MiniSpec } from '../mini-types';

export default (): MiniSpec => ({
  title: 'A week with Keeping in Touch days',
  cta: 'Maternity pay week by week',
  inputs: [
    { id: 'pay', label: 'Normal gross weekly pay', def: 600, unit: '£', max: 100000 },
    { id: 'days', label: 'Days you normally work a week', def: 5, unit: 'days', max: 7 },
    { id: 'kit', label: 'KIT days worked that week', def: 2, unit: 'days', max: 7 },
  ],
  run: ({ pay, days, kit }) => {
    const d = Math.max(1, Math.min(7, Math.round(days)));
    const k = Math.max(0, Math.min(d, Math.round(kit)));
    const smp = ceilPenny(Math.min(FAMILY_RATE, ninety(pay)));
    const dayPay = (pay / d) * k;
    return {
      head: ['Week’s pay if KIT days are paid on top of SMP', gbp(smp + dayPay, 2)],
      rows: [
        ['SMP for the week (after week 6)', gbp(smp, 2)],
        [`${k} KIT day(s) at your normal daily pay`, gbp(dayPay, 2)],
        ['If the employer offsets SMP against KIT pay', gbp(Math.max(smp, dayPay), 2)],
      ],
      note: `Up to ${P.familyPay.kitDays} KIT days in the whole maternity pay period; a working day beyond them costs that week’s SMP.`,
    };
  },
});
