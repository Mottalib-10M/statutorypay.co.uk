/** Holiday built up during maternity or adoption leave. */
import { entitlementDays } from '../engine/holiday';
import { num } from './_kit';
import type { MiniSpec } from '../mini-types';

export default (): MiniSpec => ({
  title: 'Holiday that builds up while you are on maternity leave',
  cta: 'Maternity leave dates calculator',
  inputs: [
    { id: 'months', label: 'Months of maternity leave', def: 12, unit: 'months', max: 12 },
    { id: 'dpw', label: 'Days worked per week', def: 5, unit: 'days', max: 7, decimals: 1 },
    { id: 'extra', label: 'Contractual days above the statutory minimum', def: 3, unit: 'days', max: 30, decimals: 1 },
  ],
  run: ({ months, dpw, extra }) => {
    const statutory = entitlementDays(dpw) * months / 12;
    const contract = extra * months / 12;
    return {
      head: ['Holiday accrued during the leave', `${num(statutory + contract, 1)} days`],
      rows: [
        ['Statutory part (5.6 weeks a year)', num(statutory, 1)],
        ['Contractual part', num(contract, 1)],
      ],
      note: 'Bank holidays during the leave are part of this if your contract counts them in your allowance.',
    };
  },
});
