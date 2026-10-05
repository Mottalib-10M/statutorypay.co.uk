/** Paternity leave in Northern Ireland against Great Britain: qualifying service and the deadline to take it. */
import { computeSpp } from '../engine/family';
import { addMonths } from '../engine/dates';
import { P } from '../engine/params';
import { date, iso, monthOptions } from './_kit';

/** Months from October 2026 to December 2027, value yyyymm. */
const MONTHS = [2026, 2027].flatMap((y) => monthOptions().map((m) => ({ value: String(y * 100 + Number(m.value)), label: `${m.label} ${y}` }))).filter((o) => Number(o.value) >= 202610);
import type { MiniSpec } from '../mini-types';

export default (): MiniSpec => ({
  title: 'Paternity leave: Northern Ireland against Great Britain',
  cta: 'Paternity pay calculator',
  inputs: [
    { id: 'day', label: 'Due date: day', def: 14, max: 31 },
    { id: 'month', label: 'Due date: month', def: 202703, options: MONTHS },
    { id: 'months', label: 'Months in the job by the due date', def: 5, unit: 'months', max: 600 },
  ],
  run: ({ day, month, months }) => {
    const y = Math.floor(month / 100), m = month % 100;
    const last = new Date(Date.UTC(y, m, 0)).getUTCDate();
    const due = iso(y, m, Math.max(1, Math.min(Math.round(day) || 1, last)));
    const start = addMonths(due, -Math.max(0, Math.round(months)));
    const base = { dueDate: due, awe: 600, employmentStart: start, weeks: 2 as const, leaveStart: due };
    const ni = computeSpp({ ...base, jurisdiction: 'NI' });
    const gb = computeSpp({ ...base, jurisdiction: 'GB' });
    return {
      head: ['NI leave must end by', date(ni.windowEnd)],
      rows: [
        ['Leave in Northern Ireland', ni.leaveEligible ? 'Yes, one block of 1 or 2 weeks' : `No: ${P.familyPay.serviceWeeks} weeks’ service needed`],
        ['Must have started by (NI)', date(ni.dates.startedBy)],
        ['Leave in Great Britain', gb.leaveEligible ? 'Yes, from day one' : 'No'],
        ['GB leave can run until', date(gb.windowEnd)],
      ],
    };
  },
});
