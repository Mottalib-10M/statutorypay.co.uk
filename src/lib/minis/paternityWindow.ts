/** Paternity leave window and pay eligibility from the due date and the start date with the employer. */
import { computeSpp } from '../engine/family';
import { addMonths } from '../engine/dates';
import { P } from '../engine/params';
import { date, iso, monthOptions, yearOptions } from './_kit';
import type { MiniSpec } from '../mini-types';

export default (): MiniSpec => ({
  title: 'Paternity leave: by when, and is it paid?',
  cta: 'Paternity pay calculator',
  inputs: [
    { id: 'm', label: 'Baby due (month)', def: 3, options: monthOptions() },
    { id: 'y', label: 'Baby due (year)', def: P.year + 1, options: yearOptions(P.year, P.year + 2) },
    { id: 'months', label: 'Months with your employer by then', def: 5, unit: 'months', max: 600 },
  ],
  run: ({ m, y, months }) => {
    const due = iso(y, m, 15);
    const emp = addMonths(due, -Math.max(0, Math.round(months)));
    const base = { dueDate: due, awe: 1000, employmentStart: emp, weeks: 2 as const, leaveStart: due };
    const gb = computeSpp({ ...base, jurisdiction: 'GB' });
    const ni = computeSpp({ ...base, jurisdiction: 'NI' });
    return {
      head: ['Leave must end by (Great Britain)', date(gb.windowEnd)],
      rows: [
        ['Paternity Pay', gb.payEligible ? 'Yes, if earnings reach the limit' : `No: start by ${date(gb.dates.startedBy)} needed`],
        ['Leave in Northern Ireland', ni.leaveEligible ? `Yes, ending by ${date(ni.windowEnd)}` : `No: ${P.familyPay.serviceWeeks} weeks’ service needed`],
        ['Tell your employer the due date by', date(gb.dates.noticeBy)],
      ],
      note: 'Due date taken as the 15th of the month; birth on the due date.',
    };
  },
});
