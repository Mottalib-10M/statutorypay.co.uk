/** Pay in lieu of notice and the s.145(5) extension: service counted to the end of statutory notice. */
import { computeRedundancy, reckonerWeeks } from '../engine/redundancy';
import { addDays, addMonths, addYears, fullYears } from '../engine/dates';
import { gbp, num, date } from './_kit';
import type { MiniSpec } from '../mini-types';

// Reference day on which notice is given (or the contract is ended with a payment in lieu).
const NOTICE = '2026-10-01';

export default (): MiniSpec => ({
  title: 'Paid in lieu: does the statutory notice add a year?',
  cta: 'Check every year with your real dates',
  inputs: [
    { id: 'months', label: 'Service on the day you are told', def: 107, unit: 'months', max: 600 },
    { id: 'age', label: 'Age on that day', def: 44, unit: 'years', max: 99 },
    { id: 'pay', label: 'Gross weekly pay', def: 600, unit: '£', max: 100000 },
  ],
  run: ({ months, age, pay }) => {
    const start = addMonths(NOTICE, -Math.max(1, Math.round(months)));
    const dob = addDays(addYears(NOTICE, -Math.max(16, Math.round(age))), -100);
    // Contract ended at once with a payment in lieu: last day = notice day.
    const r = computeRedundancy({ dob, start, noticeGiven: NOTICE, end: NOTICE, weeklyPay: pay });
    const yearsOnLastDay = fullYears(start, addDays(NOTICE, 1));
    const withoutExt = yearsOnLastDay >= 2 ? reckonerWeeks(fullYears(dob, NOTICE), yearsOnLastDay) * r.weekUsed : 0;
    return {
      head: ['Statutory redundancy pay with the extension', gbp(r.amount)],
      rows: [
        ['Complete years on your last day', num(yearsOnLastDay)],
        [`Years counted to ${date(r.extendedDate)}`, num(r.eligible ? r.countedYears : r.completeYears)],
        ['Gained by the statutory notice', gbp(Math.max(0, r.amount - withoutExt))],
      ],
      note: `Statutory notice of ${r.statutoryNoticeWeeks} week${r.statutoryNoticeWeeks === 1 ? '' : 's'} is added to your service and age, never to the cap.`,
    };
  },
});
