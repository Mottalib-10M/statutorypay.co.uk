/** Paid time off to look for work during redundancy notice: pay capped at 40% of a week's pay (ERA 1996 s.53(5)). */
import { P } from '../engine/params';
import { gbp, num } from './_kit';
import type { MiniSpec } from '../mini-types';

const share = P.redundancy.jobSearchPayCapShareOfWeek;

export default (): MiniSpec => ({
  title: 'Days off to job-hunt: how many are paid?',
  cta: 'See your whole notice period',
  inputs: [
    { id: 'days', label: 'Days off taken during notice', def: 4, unit: 'days', max: 365, decimals: 1 },
    { id: 'dpw', label: 'Days you work in a week', def: 5, unit: 'days', max: 7, decimals: 1 },
    { id: 'pay', label: 'Gross weekly pay', def: 500, unit: '£', max: 100000 },
  ],
  run: ({ days, dpw, pay }) => {
    const perDay = dpw > 0 ? pay / dpw : 0;
    const capPay = share * pay;
    const owed = Math.min(Math.max(0, days) * perDay, capPay);
    return {
      head: ['Statutory pay for the time off', gbp(owed, 2)],
      rows: [
        ['Days the law pays for', num(perDay > 0 ? owed / perDay : 0, 1)],
        ['Ceiling for the whole notice', gbp(capPay, 2)],
        ['Unpaid by law', gbp(Math.max(0, days * perDay - owed), 2)],
      ],
      note: 'Only for employees with two years’ service by the end of notice. A contract can pay more.',
    };
  },
});
