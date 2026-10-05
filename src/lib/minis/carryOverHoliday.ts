/** Holiday carried into the next leave year (regular hours, Great Britain): the 1.6 weeks by agreement
 *  (reg 13A(7)), the 4 weeks after sickness (reg 13(15)), everything after family leave or when the
 *  employer did not give a real chance to take it (regs 13(14), 13(17), 13A(7A)). */
import { entitlementDays } from '../engine/holiday';
import { P } from '../engine/params';
import { num } from './_kit';
import type { MiniSpec } from '../mini-types';

const REASONS = ['Just not used, contract allows carry-over', 'Just not used, nothing in the contract', 'Off sick', 'On maternity, paternity or other statutory leave', 'Employer refused or never warned me'];

export default (): MiniSpec => ({
  title: 'How much holiday can you carry over?',
  cta: 'Holiday entitlement calculator',
  inputs: [
    { id: 'dpw', label: 'Days worked per week', def: 5, unit: 'days', max: 7, decimals: 1 },
    { id: 'left', label: 'Statutory days not taken', def: 10, unit: 'days', max: 28, decimals: 1 },
    { id: 'why', label: 'Why they were not taken', def: 2, options: REASONS.map((label, i) => ({ value: String(i), label })) },
  ],
  run: ({ dpw, left, why }) => {
    const full = entitlementDays(dpw);
    const fourWeeks = Math.min(full, P.holiday.basicWeeks * Math.min(dpw, 5));
    const extra = full - fourWeeks;
    const untaken = Math.max(0, Math.min(left, full));
    const r = Math.max(0, Math.min(4, Math.round(why)));
    const carried = r === 0 ? Math.min(untaken, extra) : r === 1 ? 0 : r === 2 ? Math.min(untaken, fourWeeks) : untaken;
    return {
      head: ['Days you can carry over', `${num(carried, 1)} days`],
      rows: [
        ['Days lost at the end of the leave year', `${num(untaken - carried, 1)} days`],
        ['Your 4 weeks (the part protected after sickness)', `${num(fourWeeks, 1)} days`],
        ['Your extra 1.6 weeks (carried only by agreement)', `${num(extra, 1)} days`],
      ],
      note: r === 2 ? `Sick-leave days must be used within ${P.holidayExtra.sickCarryOverMonths} months of the end of the leave year.` : r === 1 ? 'Lost only if your employer gave you a real chance to take them and warned you in time.' : undefined,
    };
  },
});
