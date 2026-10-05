/** SSP from two employers: each job is assessed on its own earnings. */
import { weeklySsp } from '../engine/ssp';
import { gbp } from './_kit';
import type { MiniSpec } from '../mini-types';

export default (): MiniSpec => ({
  title: 'Sick pay when you have two jobs',
  cta: 'Daily breakdown in the sick pay calculator',
  inputs: [
    { id: 'a', label: 'Weekly earnings in job A', def: 300, unit: '£', max: 100000 },
    { id: 'b', label: 'Weekly earnings in job B', def: 90, unit: '£', max: 100000 },
  ],
  run: ({ a, b }) => {
    const sa = weeklySsp(a), sb = weeklySsp(b);
    return {
      head: ['SSP a week from both employers', gbp(sa + sb, 2)],
      rows: [
        ['From job A', gbp(sa, 2)],
        ['From job B', gbp(sb, 2)],
        ['If both jobs were one job', gbp(weeklySsp(a + b), 2)],
      ],
      note: 'Only if you are unfit for both jobs; fit for one, you are paid SSP by the other only.',
    };
  },
});
