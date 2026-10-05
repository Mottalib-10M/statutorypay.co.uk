import { definePage } from '../../lib/guide-types';
import { FAMILY_RATE, LEL, P } from '../../lib/engine/params';
import { birthDates, ninety, ceilPenny } from '../../lib/engine/family';
import { addDays, addWeeks } from '../../lib/engine/dates';
import { formatMoney } from '../../lib/format';

const g = (n: number, d = 0) => formatMoney(n, d);
const F = P.familyPay;
const X = P.familyExtra;
const W = X.relevantPeriodWeeks;
const pc = `${Math.round(F.earningsShare * 100)}%`;
const monthly = (total: number, months: number) => (total / months) * X.monthsPerYear / X.weeksPerYear;
// Dates computed by the engine for a baby due on 15 March 2027.
const b = birthDates('2027-03-15');
// Weekly paid every Friday: the last Friday on or before the end of the qualifying week, and 8 weeks earlier.
const lastFriday = addDays(b.qwEnd, -1);
const fridayBack = addWeeks(lastFriday, -W);
const weeklyPays = [430, 430, 430, 430, 430, 430, 510, 510];
const weeklyAwe = weeklyPays.reduce((s, x) => s + x, 0) / W;
// Monthly paid on the 28th.
const lastMonthly = '2026-11-28';
const limitMonthly = addWeeks(lastMonthly, -W);
const prevMonthly = '2026-09-28';
const mAwe = monthly(2400 + 2650, 2);
// A near miss on the lower earnings limit, unrounded.
const nearPays = [555, 560];
const near = monthly(nearPays[0] + nearPays[1], 2);

export default definePage({
  id: 'smp-average-weekly-earnings',
  group: 'family',
  order: 40,
  mini: 'aweMonthly',
  miniHref: 'maternity-pay-calculator',
  related: ['maternity-pay-calculator', 'statutory-maternity-pay', 'maternity-allowance', 'paternity-pay-calculator', 'shared-parental-pay-calculator'],
  sources: ['fam_smpReg21', 'fam_spmAweEarnings', 'fam_spmRelevantPeriod', 'nidSmp', 'govEmployerSmp', 'hmrcRates'],
  slug: 'smp-average-weekly-earnings',
  nav: 'SMP average weekly earnings',
  card: 'The relevant period, the monthly formula and what counts as earnings for SMP.',
  title: 'SMP Average Weekly Earnings 2026/27: How the 8 Weeks Work',
  description: `SMP average weekly earnings in 2026/27: the paydays that count, monthly pay × ${X.monthsPerYear} ÷ ${X.weeksPerYear}, bonuses and sick pay included, and the ${g(LEL)} lower earnings limit test.`,
  h1: 'SMP average weekly earnings: the figure behind your maternity pay',
  intro: `One average decides whether you get Statutory Maternity Pay at all and how much the first ${F.smpHigherRateWeeks} weeks are worth. Here is how payroll arrives at it, with real paydays.`,
  resume: `Average weekly earnings (AWE) for Statutory Maternity Pay are worked out from the gross pay actually paid to you in the relevant period: the stretch between the last normal payday on or before the Saturday that ends your qualifying week and the last normal payday at least ${W} weeks before it, that earlier payday excluded. If you are paid weekly or every few weeks, the total is divided by the number of weeks in the period. If you are paid monthly, regulation 21(5) of the SMP (General) Regulations 1986 divides the total by the number of calendar months, multiplies by ${X.monthsPerYear} and divides by ${X.weeksPerYear}, so two monthly payslips of ${g(2400)} and ${g(2650)} give ${g(mAwe, 2)} a week. Everything that counts for Class 1 National Insurance is included: overtime, bonuses, commission, holiday pay, sick pay and arrears, if paid on a payday inside the period. The result is compared, unrounded, with the lower earnings limit of ${g(LEL)}, then multiplied by ${pc} for the first ${F.smpHigherRateWeeks} weeks of SMP.`,
  faqs: [
    { q: 'Will a bonus paid during my relevant period increase my maternity pay?', a: `Yes. What counts is the date the money is paid, not the period it was earned in, so a bonus or commission paid on a payday inside the relevant period raises the average. For a high earner it raises the first ${F.smpHigherRateWeeks} weeks; for someone just under ${g(FAMILY_RATE / F.earningsShare)} a week it can also lift the later weeks up to the flat rate.` },
    { q: 'My salary sacrifice lowers my gross pay. Which figure does payroll use for SMP?', a: `The pay after the sacrifice, because only earnings that count for National Insurance are taken into account. nidirect warns that this can push average weekly earnings below the lower earnings limit of ${g(LEL)} and so remove SMP entirely. Some employers suspend a scheme before the relevant period; check with payroll in good time.` },
    { q: 'I was off sick and on Statutory Sick Pay for part of the eight weeks. Does that reduce my SMP?', a: `It can. Statutory Sick Pay and company sick pay are earnings for SMP, so weeks paid at the sick pay rate pull the average down. Unlike holiday pay, which is usually full pay, a few weeks on SSP during the relevant period lower the ${pc} paid in the first ${F.smpHigherRateWeeks} weeks of maternity pay.` },
    { q: 'Is my average rounded to the nearest penny before the lower earnings limit test?', a: `No. HMRC tells employers to use the unrounded figure when deciding whether average weekly earnings are high enough. An average of ${g(near, 4)} fails a ${g(LEL)} limit even though it would round to ${g(Math.round(near), 0)} at whole pounds. Rounding only enters later, when each weekly SMP amount is turned into pounds and pence.` },
    { q: 'My baby was born before the qualifying week. Which paydays are used?', a: `The period ends instead with the last normal payday on or before the Saturday of the week before the week of the birth, and runs back to the payday at least ${W} weeks earlier, according to HMRC’s Statutory Payments Manual (SPM171100). You are treated as qualifying if you would have met the service test by the qualifying week.` },
  ],
  body: (h) => `
<h2>Step one: find the two paydays</h2>
<p>Everything starts from the qualifying week, the ${F.qualifyingWeekBeforeEWC}th week before the week the baby is due, which always ends on a Saturday. For a baby due on ${h.date(b.dueDate)} it runs from ${h.date(b.qwStart)} to ${h.date(b.qwEnd)}. The relevant period then ends with the last <em>normal</em> payday on or before that Saturday, meaning the day your contract or your employer’s usual practice says you are paid (${h.src('fam_spmRelevantPeriod', 'HMRC, SPM171100')}). It starts the day after the last normal payday falling at least ${W} weeks earlier. Pay received early or late because of a bank holiday is handled by HMRC’s separate rules on mistimed payments, so check the payslip dates rather than assuming.</p>
<ul>
<li><strong>Paid every Friday.</strong> The last payday is ${h.date(lastFriday)}. Counting back ${W} weeks gives ${h.date(fridayBack)}, which is excluded, so the period covers the ${W} Fridays from ${h.date(addWeeks(fridayBack, 1))} to ${h.date(lastFriday)}.</li>
<li><strong>Paid on the 28th of each month.</strong> The last payday is ${h.date(lastMonthly)}. ${W} weeks before is ${h.date(limitMonthly)}; the last payday on or before that date is ${h.date(prevMonthly)}, excluded. The period runs from ${h.date(addDays(prevMonthly, 1))} to ${h.date(lastMonthly)} and contains two paydays.</li>
</ul>

<h2>Step two: add up what was paid</h2>
<p>The regulations define earnings broadly: any remuneration from the employment that is liable to Class 1 National Insurance, or would be if it were high enough (${h.src('fam_spmAweEarnings', 'HMRC, SPM171000')}). Everything paid on a payday inside the period goes in, even if it relates to work done earlier or later. A week in which nothing was due is counted as a week of zero pay rather than skipped.</p>
${h.table(['Payment', 'Counted?', 'Why'], [
    ['Basic pay, overtime, shift premiums', 'Yes', 'Class 1 earnings'],
    ['Bonus or commission paid in the period', 'Yes', 'Payment date decides'],
    ['Holiday pay, including for future leave', 'Yes', 'Paid in the period'],
    ['Statutory or company sick pay', 'Yes', 'Treated as earnings'],
    ['Arrears of pay received in the period', 'Yes', 'Payment date decides'],
    ['Pay given up under salary sacrifice', 'No', 'Not Class 1 earnings'],
    ['Student bursary', 'No', 'Excluded by nidirect guidance'],
  ], 'What goes into the SMP average.', ['l', 'l', 'l'])}

<h2>Step three: turn the total into a weekly figure</h2>
<p>Regulation 21 of the ${h.src('fam_smpReg21', 'Statutory Maternity Pay (General) Regulations 1986')} gives three methods. Weekly, fortnightly and four-weekly pay is divided by the number of weeks in the period. Pay at intervals of a calendar month is divided by the number of months, rounded to the nearest whole number if the period is not exact, then multiplied by ${X.monthsPerYear} and divided by ${X.weeksPerYear}. Any other pattern that does not give a whole number of weeks is divided by the number of days and multiplied by 7.</p>
${h.table(['Pay pattern', 'Paid in the period', 'Calculation', 'Average weekly earnings'], [
    [`Weekly (six weeks at ${h.gbp(430)}, two with overtime at ${h.gbp(510)})`, h.gbp(weeklyPays.reduce((s, x) => s + x, 0)), `÷ ${W}`, h.gbp(weeklyAwe, 2)],
    [`Monthly (${h.gbp(2400)} and ${h.gbp(2650)})`, h.gbp(2400 + 2650), `÷ 2 × ${X.monthsPerYear} ÷ ${X.weeksPerYear}`, h.gbp(mAwe, 2)],
    [`Monthly, low hours (${h.gbp(nearPays[0])} and ${h.gbp(nearPays[1])})`, h.gbp(nearPays[0] + nearPays[1]), `÷ 2 × ${X.monthsPerYear} ÷ ${X.weeksPerYear}`, h.gbp(near, 4)],
  ], 'Worked examples; the amounts are illustrations, the method is regulation 21.', ['l', 'r', 'l', 'r'])}
<p>The monthly formula is why a monthly salary gives a slightly lower weekly figure than dividing by four and a third would suggest at first glance: ${X.weeksPerYear} weeks are spread across ${X.monthsPerYear} months, so each month counts as about ${h.num(X.weeksPerYear / X.monthsPerYear, 2)} weeks.</p>

<h2>Step four: the earnings test and the weekly SMP</h2>
<p>The unrounded average is compared with the lower earnings limit in force on the last day of the qualifying week: ${h.gbp(LEL)} for 2026/27. The weekly employee clears it easily and would receive ${h.gbp(ceilPenny(ninety(weeklyAwe)), 2)} for each of the first ${F.smpHigherRateWeeks} weeks, then ${h.gbp(ceilPenny(Math.min(FAMILY_RATE, ninety(weeklyAwe))), 2)}. The monthly employee on ${h.gbp(mAwe, 2)} would receive ${h.gbp(ceilPenny(ninety(mAwe)), 2)} and then ${h.gbp(ceilPenny(Math.min(FAMILY_RATE, ninety(mAwe))), 2)}. The low-hours employee misses the limit by pennies and gets no SMP; her route is ${h.a('maternity-allowance', 'Maternity Allowance')}, which has a much lower earnings threshold.</p>
<p>Two later events can change the figure. A pay rise that applies to any part of the period from the start of the relevant period to the end of maternity leave is treated as if it had been paid throughout the relevant period, and the difference is paid as arrears. And a mistake in the pay actually received can be corrected where there is written evidence that employer and employee agreed what should have been paid. The same averaging rules apply to ${h.a('paternity-pay-calculator', 'Statutory Paternity Pay')}, which uses the same qualifying week, and to adoption pay, where the matching week takes its place; Northern Ireland uses the same method, as nidirect’s page on how SMP is worked out confirms.</p>
`,
});
