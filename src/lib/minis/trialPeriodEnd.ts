/** End of the statutory four-week trial in an alternative job (ERA 1996 s.138(3)). */
import { addDays, addWeeks } from '../engine/dates';
import { P } from '../engine/params';
import { date, iso, monthOptions, yearOptions } from './_kit';
import type { MiniSpec } from '../mini-types';

const weeks = P.redundancy.trialPeriodWeeks;

export default (): MiniSpec => ({
  title: `Your ${weeks}-week trial: the day it runs out`,
  cta: 'Work out the redundancy pay at stake',
  inputs: [
    { id: 'day', label: 'Day you start the new job', def: 2, unit: 'day', max: 31 },
    { id: 'month', label: 'Month you start', def: 11, options: monthOptions() },
    { id: 'year', label: 'Year you start', def: P.year, options: yearOptions(P.year, P.year + 2) },
  ],
  run: ({ day, month, year }) => {
    const last = new Date(Date.UTC(year, month, 0)).getUTCDate();
    const start = iso(year, month, Math.min(Math.max(1, Math.round(day)), last));
    const end = addDays(addWeeks(start, weeks), -1);
    return {
      head: ['Last day of the trial', date(end)],
      rows: [
        ['Trial starts', date(start)],
        ['Say it is unsuitable, in writing, by', date(end)],
        ['Old job must have ended no earlier than', date(addWeeks(start, -P.redundancyExtra.renewalGapWeeks))],
      ],
      note: 'A longer trial for retraining counts only if agreed in writing before you start, with its end date.',
    };
  },
});
