import { definePage } from '../../lib/guide-types';
import { P } from '../../lib/engine/params';
import { entitlementDays, entitlementHours, entitlementShifts, proRataDays, bankHolidaysBetween } from '../../lib/engine/holiday';
import { formatNumber, formatPercent, displayDate } from '../../lib/format';

const H = P.holiday;
const n1 = (x: number) => formatNumber(x, 1);
const d = (iso: string) => displayDate(iso, 'en-GB');
// Worked examples computed by the engine (RECETTE §17.4 point 7).
const threeDays = entitlementDays(3);
const sixDays = entitlementDays(6);
const fullTimeHours = entitlementHours(37.5, 5);
const fourOnFourOff = entitlementShifts(4, 8);
const starter = proRataDays({ daysPerWeek: 3, yearStart: '2026-01-01', start: '2026-06-15' });
const leaver = proRataDays({ daysPerWeek: 5, yearStart: '2026-04-01', leave: '2026-09-30' });
const ewBank = bankHolidaysBetween('england-and-wales', '2026-01-01', '2026-12-31').length;
const contractual = 25;

export default definePage({
  id: 'holiday-entitlement-calculator',
  group: 'holiday',
  order: 10,
  tool: 'holiday',
  related: ['part-time-holiday-entitlement', 'holiday-pay-calculator', 'irregular-hours-holiday-calculator', 'holiday-pay-when-leaving', 'bank-holidays-and-annual-leave', 'holiday-first-year'],
  sources: ['govHoliday', 'govHolidayCalc', 'wtr13', 'wtr13A', 'wtr15A', 'nidHoliday'],
  slug: 'holiday-entitlement-calculator',
  nav: 'Holiday entitlement calculator',
  card: 'Statutory leave in days, hours or shifts, for a full year, a starter or a leaver.',
  title: `Holiday Entitlement Calculator 2026/27: ${H.statutoryWeeks} Weeks, ${H.maxDays} Days`,
  description: `Holiday entitlement calculator for 2026/27: ${H.statutoryWeeks} weeks of paid leave in days, hours or shifts, capped at ${H.maxDays} days, pro rata for new starters and leavers.`,
  h1: 'Holiday entitlement calculator: days, hours or shifts',
  intro: 'Pick the way your working week is measured, say whether you worked the whole leave year, and the calculator gives the statutory minimum your employer must allow.',
  resume: `Statutory holiday entitlement is ${H.statutoryWeeks} weeks of paid leave in each leave year, made of ${H.basicWeeks} weeks under regulation 13 of the Working Time Regulations 1998 and ${n1(H.additionalWeeks)} more under regulation 13A, with a ceiling of ${H.maxDays} days. In days, multiply the days you work each week by ${H.statutoryWeeks}: a three-day week gives ${n1(threeDays)} days, a five-day week ${n1(entitlementDays(5))}, and a six-day week still stops at ${n1(sixDays)}. In hours, the same multiplier applies to your weekly hours, so ${n1(37.5)} hours a week gives ${n1(fullTimeHours)} hours. For a rota such as four shifts on and four off, the average of ${n1(4 / 8 * 7)} shifts a week gives ${n1(fourOnFourOff)} shifts. A starter gets the share of the year left, in twelfths, rounded up to the next half day; a leaver gets the exact share of the year worked. Bank holidays may be counted inside the total. Irregular-hours and part-year workers in Great Britain accrue ${formatPercent(H.irregularAccrualRate, 2)} of hours worked instead.`,
  faqs: [
    { q: 'I work six days a week. Why is my holiday still capped at 28 days?', a: `Regulation 13A(3) caps the combined statutory entitlement at ${H.maxDays} days, whatever the working pattern. Six days times ${H.statutoryWeeks} would be ${n1(6 * H.statutoryWeeks)}, but the law only guarantees ${H.maxDays}. Your employer can give more by contract, and many do, but the extra days are contractual and can come with their own conditions, such as a minimum length of service.` },
    { q: `My contract gives ${contractual} days plus bank holidays. Is that enough?`, a: `For a five-day week in England and Wales, yes. There are ${ewBank} bank holidays in 2026, so ${contractual} days plus those gives ${contractual + ewBank}, above the statutory ${H.maxDays}. Scotland and Northern Ireland have more bank holidays, which only widens the margin. A contract of 20 days that includes bank holidays would fall short and be unlawful.` },
    { q: 'When does my holiday year start if my contract says nothing?', a: `On the day you started the job, then on each anniversary of that date (regulation 13(3)). For someone employed since on or before ${d(P.holidayExtra.defaultLeaveYearCutoff)}, the leave year runs from that date instead. Most employers set a common year, such as 1 January or 1 April, in the contract or staff handbook, and that agreed date takes priority.` },
    { q: 'How does the calculator round a new starter’s holiday?', a: `It counts the months left in the leave year, including the month you start if your start day is on or before the day the leave year ends, and gives one twelfth of the annual figure for each. The total is rounded up to the next half day, as on GOV.UK. Starting on ${d('2026-06-15')} in a calendar leave year on three days a week gives ${n1(starter.shown)} days.` },
    { q: 'Do I build up holiday while I am on maternity or paternity leave?', a: 'Yes. GOV.UK states that the leave year and the holiday entitlement are not affected by maternity, paternity or adoption leave: the statutory days keep accruing throughout. If the leave stops you taking them before the year ends, regulation 13(14) lets you carry the untaken days into the following leave year.' },
  ],
  body: (h) => `
<h2>Choosing days, hours or shifts</h2>
<p>All three methods measure the same ${H.statutoryWeeks} weeks; they only change the unit. Days suit anyone whose working days are the same length. Hours are fairer when days vary, for example two long days and one short one, because a “day off” then means different amounts of time. Shifts suit rotas that repeat over a cycle longer than a week: enter the shifts in the cycle and its length in days, and the calculator averages them to a week and caps the result at five a week, the point at which the ${H.maxDays}-day ceiling bites (${h.src('wtr13A', 'regulation 13A')}).</p>
${h.table(['Working pattern', 'Input', 'Statutory leave a year'], [
    ['Three days a week', '3 days', `${h.num(threeDays, 1)} days`],
    ['Six days a week', '6 days', `${h.num(sixDays, 1)} days (capped)`],
    ['Full time in hours', `${h.num(37.5, 1)} hours over 5 days`, `${h.num(fullTimeHours, 1)} hours`],
    ['Four on, four off', '4 shifts in 8 days', `${h.num(fourOnFourOff, 1)} shifts`],
  ], 'Each figure is calculated by the engine behind the tool.', ['l', 'l', 'r'])}

<h2>Starting part way through the leave year</h2>
<p>A starter is entitled to the proportion of the year that remains (${h.src('wtr13', 'regulation 13(5)')}). GOV.UK counts it in whole months: each month left, including the month of the start date, earns one twelfth, and the result is rounded up to the nearest half day. With a leave year beginning on ${h.date('2026-01-01')} and a first day of ${h.date('2026-06-15')}, a three-day worker has ${h.num(starter.fraction * 12)} months to count, ${h.num(starter.days, 1)} days before rounding and ${h.num(starter.shown, 1)} after. During the first year of employment, ${h.src('wtr15A', 'regulation 15A')} also limits how much can be <em>taken</em> at any point to what has built up month by month, though an employer can allow more.</p>

<h2>Leaving before the leave year ends</h2>
<p>For a leaver the tool shows the exact share of the year worked, counted in days, without rounding. A full-time employee whose leave year starts on ${h.date('2026-04-01')} and who leaves on ${h.date('2026-09-30')} has worked ${h.pct(leaver.fraction, 1)} of the year, which is ${h.num(leaver.days, 2)} days of statutory leave. Take away what was used and the balance is paid on the last payslip: ${h.a('holiday-pay-when-leaving', 'holiday pay when leaving')} prices it.</p>

<h2>What the figure does not include</h2>
<p>The result is the legal minimum. Contractual days above it, long-service days and any “buy and sell” scheme sit on top and follow your contract. Bank holidays can be part of the minimum or extra to it; the ${h.a('bank-holidays-and-annual-leave', 'bank holiday tool')} lists them for each nation. Workers whose hours are wholly or mostly variable, or who have unpaid weeks off each year, use the ${h.a('irregular-hours-holiday-calculator', 'irregular hours calculator')} in Great Britain. In Northern Ireland the same ${H.statutoryWeeks}-week rule and ${H.maxDays}-day cap apply under the Working Time Regulations (Northern Ireland) 2016, and nidirect gives the same multiplier for part-timers (${h.src('nidHoliday', 'nidirect, Holiday entitlements')}).</p>
`,
});
