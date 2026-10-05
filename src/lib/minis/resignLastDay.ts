/** Resignation: the last day of employment from the day notice is handed in and the weeks owed. */
import { computeNotice } from '../engine/notice';
import { addYears, dayOfWeek } from '../engine/dates';
import { P } from '../engine/params';
import { date, iso, monthOptions } from './_kit';

/** Months from October 2026 to December 2027, value yyyymm. */
const MONTHS = [2026, 2027].flatMap((y) => monthOptions().map((m) => ({ value: String(y * 100 + Number(m.value)), label: `${m.label} ${y}` }))).filter((o) => Number(o.value) >= 202610);
import type { MiniSpec } from '../mini-types';

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export default (): MiniSpec => ({
  title: 'Your last day after resigning',
  cta: 'Check both sides in the notice calculator',
  inputs: [
    { id: 'day', label: 'Day you hand in notice', def: 16, max: 31 },
    { id: 'month', label: 'Month', def: 202610, options: MONTHS },
    { id: 'weeks', label: 'Notice in your contract', def: 4, unit: 'weeks', max: 52 },
  ],
  run: ({ day, month, weeks }) => {
    const y = Math.floor(month / 100), m = month % 100;
    const last = new Date(Date.UTC(y, m, 0)).getUTCDate();
    const given = iso(y, m, Math.max(1, Math.min(Math.round(day) || 1, last)));
    // Someone with a year of service: the statutory minimum for an employee applies.
    const r = computeNotice({ start: addYears(given, -1), noticeGiven: given, contractualWeeks: weeks, weeklyPay: 0, byEmployee: true });
    return {
      head: ['Last day of employment', date(r.endDate)],
      rows: [
        ['Weekday', DAYS[dayOfWeek(r.endDate)]],
        ['Notice that applies', `${r.appliedWeeks} week${r.appliedWeeks === 1 ? '' : 's'}`],
        ['Legal minimum for an employee', `${P.notice.employeeWeeks} week`],
      ],
      note: weeks < P.notice.employeeWeeks ? 'With no notice clause, the one-week minimum applies.' : undefined,
    };
  },
});
