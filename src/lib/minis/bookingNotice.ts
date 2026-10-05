/** Notice to book holiday, and notice an employer needs to refuse it. */
import { bookingNotice } from '../engine/holiday';
import { num } from './_kit';
import type { MiniSpec } from '../mini-types';

export default (): MiniSpec => ({
  title: 'How much notice to book your holiday',
  cta: 'Holiday entitlement calculator',
  inputs: [
    { id: 'days', label: 'Days of holiday you want', def: 5, unit: 'days', max: 60 },
    { id: 'ahead', label: 'Days before the first day of leave', def: 9, unit: 'days', max: 365 },
  ],
  run: ({ days, ahead }) => {
    const n = bookingNotice(days);
    return {
      head: ['Minimum notice from you', `${num(n.worker)} days`],
      rows: [
        ['Your request is in time', ahead >= n.worker ? 'yes' : 'no'],
        ['Notice your employer needs to refuse it', `${num(n.employerRefusal)} days`],
        ['Notice to make you take this much leave', `${num(n.employerImposed)} days`],
      ],
      note: 'Default rules of the Working Time Regulations; your contract can set other periods.',
    };
  },
});
