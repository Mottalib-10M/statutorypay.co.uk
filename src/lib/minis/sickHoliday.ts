/** Holiday a long-term sick employee can carry into the next leave year. */
import { entitlementDays } from '../engine/holiday';
import { P } from '../engine/params';
import { num } from './_kit';
import type { MiniSpec } from '../mini-types';

export default (): MiniSpec => ({
  title: 'Holiday you keep after a long sickness absence',
  cta: 'Holiday pay when leaving',
  inputs: [
    { id: 'dpw', label: 'Days worked per week', def: 5, unit: 'days', max: 7, decimals: 1 },
    { id: 'taken', label: 'Days taken before falling ill', def: 4, unit: 'days', max: 28, decimals: 1 },
    { id: 'irr', label: 'Working pattern', def: 0, options: [{ value: '0', label: 'Regular hours, whole year' }, { value: '1', label: 'Irregular hours or part-year (GB)' }] },
  ],
  run: ({ dpw, taken, irr }) => {
    const H = P.holiday;
    const ent = entitlementDays(dpw);
    const cap = irr ? Math.min(ent, H.sickCarryOverIrregularDays) : Math.min(H.basicWeeks * Math.min(dpw, 5), H.sickCarryOverRegularDays);
    const unused = Math.max(0, ent - taken);
    return {
      head: ['Days carried into the next leave year', num(irr ? Math.min(unused, cap) : Math.min(unused, Math.max(0, cap - taken)), 1)],
      rows: [
        ['Statutory entitlement this year', num(ent, 1)],
        [irr ? 'Ceiling for sickness carry-over' : 'Four weeks of your days (leave already taken counts first)', num(cap, 1)],
        ['Days unused at the end of the year', num(unused, 1)],
      ],
      note: 'Leave carried over because of sickness must be used within 18 months of the end of the year it belongs to.',
    };
  },
});
