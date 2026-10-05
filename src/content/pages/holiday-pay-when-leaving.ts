import { definePage } from '../../lib/guide-types';
import { P } from '../../lib/engine/params';
import { leavingPay } from '../../lib/engine/holiday';
import { formatMoney, formatNumber, formatPercent, displayDate } from '../../lib/format';

const g = (n: number, dec = 0) => formatMoney(n, dec);
const n1 = (x: number) => formatNumber(x, 1);
const n2 = (x: number) => formatNumber(x, 2);
const d = (iso: string) => displayDate(iso, 'en-GB');
// Worked examples computed by the engine (reg 14(3)).
const ex = leavingPay({ daysPerWeek: 5, yearStart: '2026-01-01', leave: '2026-10-30', taken: 14, weekPay: 600 });
const over = leavingPay({ daysPerWeek: 5, yearStart: '2026-01-01', leave: '2026-03-31', taken: 12, weekPay: 600 });
const part = leavingPay({ daysPerWeek: 3, yearStart: '2026-04-01', leave: '2026-12-18', taken: 6, weekPay: 330 });

export default definePage({
  id: 'holiday-pay-when-leaving',
  group: 'holiday',
  order: 60,
  tool: 'leavingHoliday',
  related: ['final-pay-calculator', 'holiday-entitlement-calculator', 'holiday-pay-calculator', 'carry-over-holiday', 'payment-in-lieu-of-notice', 'resignation-notice-period'],
  sources: ['wtr14', 'hol_wtr15E', 'govHoliday', 'hol_wtr15', 'hol_nidTakingHolidays'],
  slug: 'holiday-pay-when-leaving',
  nav: 'Holiday pay when leaving',
  card: 'Untaken holiday paid on your last payslip, with the (A × B) − C formula.',
  title: 'Holiday Pay When Leaving 2026/27: The (A × B) − C Formula',
  description: `Holiday pay when leaving a job in 2026/27: untaken leave paid with (A × B) − C, based on ${P.holiday.statutoryWeeks} weeks a year, and owed even after dismissal for gross misconduct.`,
  h1: 'Holiday pay when leaving: paying out untaken leave',
  intro: 'Leave you have earned and not taken turns into money on your last day. The calculator applies the statutory formula to your own leave year.',
  resume: `When employment ends part way through a leave year, the employer must pay for statutory leave that has been earned but not taken. Regulation 14 of the Working Time Regulations 1998 sets the formula (A × B) − C, unless a relevant agreement such as the contract sets another sum: A is the year’s statutory entitlement (${P.holiday.statutoryWeeks} weeks, ${P.holiday.maxDays} days at most), B the proportion of the leave year that has passed by the termination date, and C the leave already taken. A full-time employee with a calendar leave year who leaves on ${d('2026-10-30')} after taking 14 days has ${n2(ex.accrued)} days accrued and ${n2(ex.days)} to be paid: at ${g(600)} a week that is ${g(ex.pay)} gross. This payment in lieu is the only time statutory leave can be exchanged for money, it is due whatever the reason for leaving, including a dismissal for gross misconduct, and leave carried over from earlier years is paid as well.`,
  faqs: [
    { q: 'Will I be paid for unused holiday if I am sacked for gross misconduct?', a: 'Yes. GOV.UK states that employers must pay for untaken statutory leave even if the worker is dismissed for gross misconduct. Regulation 14 applies to any termination during the leave year, whatever its cause. A contract can make extra contractual days above the statutory minimum conditional, but not the statutory part.' },
    { q: 'Can my employer make me use up my holiday during my notice period?', a: 'Yes, if it gives notice of at least twice as many days as the leave it wants you to take (regulation 15(2) and (4)), unless your contract sets other rules. To require five days of holiday the employer must tell you at least ten days before the first of them. Leave taken this way reduces C in the formula.' },
    { q: 'I took more holiday than I had earned. Can it be taken out of my final pay?', a: `Only if a written agreement allows it. Regulation 14(4) lets a relevant agreement require the worker to compensate the employer, and GOV.UK says money must not be taken from final pay unless agreed beforehand in writing. Leaving on ${d('2026-03-31')} after taking 12 days of a ${P.holiday.maxDays}-day calendar year means ${n1(-over.days)} days taken in advance.` },
    { q: 'Is holiday carried over from last year paid out when I leave?', a: 'Yes, if it was carried forward under the statutory rules: after sick leave, after maternity or other statutory leave, or because your employer did not give you a reasonable chance to take it. Regulation 14(6) requires a payment in lieu for that leave too, at the regulation 16 rate. Days carried by a contractual agreement follow the contract.' },
    { q: 'Do the rules differ for irregular-hours workers?', a: `In Great Britain, for leave years beginning on or after ${d(P.holiday.irregularRegimeFrom)}, yes. Regulation 15E replaces the formula: an irregular-hours or part-year worker is paid for whatever leave has accrued at ${formatPercent(P.holiday.irregularAccrualRate, 2)} and not been taken, without the A × B step. Nothing more is due for leave already paid as rolled-up holiday pay.` },
  ],
  body: (h) => `
<h2>The formula, line by line</h2>
<p>${h.src('wtr14', 'Regulation 14(3)')} works in proportions, not in months. B is the share of the leave year that has expired by the termination date; the calculator counts it in days, including your last day. The example already filled in gives:</p>
${h.table(['Step', 'Value'], [
    ['A: statutory entitlement for the year', `${h.num(ex.A, 1)} days`],
    [`B: share of the year from ${h.date(ex.leaveYear.start)} to ${h.date('2026-10-30')}`, formatPercent(ex.B, 1)],
    ['A × B: leave accrued', `${h.num(ex.accrued, 2)} days`],
    ['C: leave taken', `${h.num(14)} days`],
    ['(A × B) − C: days to pay', `${h.num(ex.days, 2)} days`],
    [`Paid at a day’s pay of ${h.gbp(ex.dayPay, 2)}`, h.gbp(ex.pay, 2)],
  ], 'Calculated by the site engine from regulation 14(3)(b).', ['l', 'r'])}
<p>A part-timer works the same way with a smaller A. On three days a week, a leave year starting ${h.date('2026-04-01')}, a last day of ${h.date('2026-12-18')}, six days taken and ${h.gbp(330)} a week, the formula leaves ${h.num(part.days, 2)} days, or ${h.gbp(part.pay, 2)}.</p>

<h2>What a day is worth</h2>
<p>The days are paid at the rate regulation 16 sets for holiday, which means a week’s pay divided by the days in your working week. If your pay varies, a week’s pay is the average of your last ${P.holiday.referenceWeeks} paid weeks, with regular overtime and commission included; the ${h.a('holiday-pay-calculator', 'holiday pay calculator')} finds that figure, and the ${h.a('final-pay-calculator', 'final pay calculator')} adds the result to notice pay and any redundancy payment.</p>

<h2>Contracts, extra days and Northern Ireland</h2>
<p>A contract can set its own method for the payment in lieu, and it governs any contractual days above the statutory ${P.holiday.statutoryWeeks} weeks: some contracts pay them out, others do not. Enter extra days in the calculator only if yours does. In Northern Ireland the same right exists under the Working Time Regulations (Northern Ireland) 2016: nidirect says you have the right to be paid for any untaken statutory holiday you have accrued, and that money for leave taken in advance should not be taken from final pay unless agreed beforehand (${h.src('hol_nidTakingHolidays', 'nidirect')}).</p>
`,
});
