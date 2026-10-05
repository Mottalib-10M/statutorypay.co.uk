/** Statutory notice owed by the employer from complete years of service, and the day it runs out. */
import { computeNotice } from '../engine/notice';
import { addYears } from '../engine/dates';
import { P } from '../engine/params';
import { date, iso, monthOptions, yearOptions } from './_kit';
import type { MiniSpec } from '../mini-types';

export default (): MiniSpec => ({
  title: 'Statutory notice from your years of service',
  cta: 'Notice calculator with your contract',
  inputs: [
    { id: 'years', label: 'Complete years of service', def: 7, unit: 'years', max: 60 },
    { id: 'month', label: 'Notice given on the 1st of', def: 11, options: monthOptions() },
    { id: 'year', label: 'Year', def: 2026, options: yearOptions(2026, 2027) },
  ],
  run: ({ years, month, year }) => {
    const given = iso(year, month, 1);
    // A start date exactly `years` years before the day after notice is given.
    const start = years > 0 ? addYears(iso(year, month, 2), -years) : iso(year, month, 1);
    const r = computeNotice({ start, noticeGiven: given, contractualWeeks: 0, weeklyPay: 0 });
    const wk = (n: number) => `${n} week${n === 1 ? '' : 's'}`;
    return {
      head: ['Notice your employer must give', wk(r.statutoryWeeks)],
      rows: [
        ['Notice starts', date(iso(year, month, 2))],
        ['Last day of notice', r.statutoryWeeks ? date(r.endDate) : 'None by statute'],
        ['Ceiling of the scale', wk(P.notice.maxWeeks)],
      ],
      note: years >= P.notice.maxWeeks ? 'The scale stops rising after twelve complete years.' : undefined,
    };
  },
});
