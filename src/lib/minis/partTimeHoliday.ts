/** Part-time holiday: 5.6 × days worked, the same in hours, and the pro-rata share of bank holidays
 *  when the employer gives them on top of the statutory minimum (2026 calendar year, by nation). */
import { entitlementDays, entitlementHours, bankHolidaysBetween, bankHolidayProRata, type Nation } from '../engine/holiday';
import { num } from './_kit';
import type { MiniSpec } from '../mini-types';

const NATIONS: Nation[] = ['england-and-wales', 'scotland', 'northern-ireland'];
const LABELS = ['England and Wales', 'Scotland', 'Northern Ireland'];

export default (): MiniSpec => ({
  title: 'Your part-time holiday, with bank holidays',
  cta: 'Full holiday calculator: hours, shifts, starters and leavers',
  inputs: [
    { id: 'dpw', label: 'Days worked per week', def: 3, unit: 'days', max: 7, decimals: 1 },
    { id: 'hpd', label: 'Hours in a working day', def: 7.5, unit: 'hours', max: 24, decimals: 1 },
    { id: 'nation', label: 'Where you work', def: 0, options: LABELS.map((label, i) => ({ value: String(i), label })) },
  ],
  run: ({ dpw, hpd, nation }) => {
    const n = NATIONS[Math.max(0, Math.min(2, Math.round(nation)))];
    const days = entitlementDays(dpw);
    const bh = bankHolidaysBetween(n, '2026-01-01', '2026-12-31').length;
    const share = bankHolidayProRata(bh, dpw);
    return {
      head: ['Statutory holiday a year', `${num(days, 1)} days`],
      rows: [
        ['Same entitlement in hours', `${num(entitlementHours(dpw * hpd, dpw), 1)} hours`],
        [`Bank holidays in 2026 (${LABELS[NATIONS.indexOf(n)]})`, String(bh)],
        ['Your pro-rata share if they are given on top', `${num(share, 1)} days`],
      ],
      note: 'Bank holidays can also sit inside the 5.6 weeks: check which way your contract counts them.',
    };
  },
});
