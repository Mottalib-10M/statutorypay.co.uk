import { definePage } from '../../lib/guide-types';
import { P } from '../../lib/engine/params';
import { irregularAccrual, rolledUp } from '../../lib/engine/holiday';
import { formatMoney, formatNumber, formatPercent, displayDate } from '../../lib/format';

const H = P.holiday;
const X = P.holidayExtra;
const rate = formatPercent(H.irregularAccrualRate, 2);
const n2 = (x: number) => formatNumber(x, 2);
// Worked examples computed by the engine (reg 15B(3), (5)).
const weekly = irregularAccrual(30); // the GOV.UK example: 30 hours in a weekly pay period
const monthly = irregularAccrual(96);
const tiny = irregularAccrual(4);
const short = irregularAccrual(4.5);
// 12.07% is 5.6 weeks of leave spread over the weeks left in a year once the leave is taken.
const workingWeeks = 52 - H.statutoryWeeks;

export default definePage({
  id: 'irregular-hours-holiday-calculator',
  group: 'holiday',
  order: 40,
  tool: 'irregular',
  related: ['rolled-up-holiday-pay', 'zero-hours-holiday-pay', 'term-time-part-year-holiday', 'holiday-pay-calculator', 'holiday-entitlement-calculator'],
  sources: ['wtr15B', 'hol_wtr15F', 'hol_wtr15C', 'hol_wtr15E', 'govHoliday', 'si2023_1426'],
  slug: 'irregular-hours-holiday-calculator',
  nav: 'Irregular hours holiday',
  card: `Holiday built up at ${rate} of the hours worked in each pay period, Great Britain.`,
  title: `Irregular Hours Holiday Calculator 2026/27: ${rate} Accrual`,
  description: `Irregular hours holiday calculator for 2026/27: leave accrues at ${rate} of hours worked each pay period, rounded to the nearest hour, up to ${H.maxDays} days. GB only.`,
  h1: `Irregular hours holiday calculator: the ${rate} accrual`,
  intro: 'For zero-hours, casual and term-time workers in England, Wales and Scotland, holiday is earned hour by hour: enter the hours of a pay period and see what it adds.',
  resume: `In Great Britain, a worker whose paid hours are wholly or mostly variable under the contract (an irregular-hours worker), or who is required to work only part of the year with unpaid weeks off (a part-year worker), builds up holiday at ${rate} of the hours actually worked in each pay period, for leave years starting on or after ${displayDate(H.irregularRegimeFrom, 'en-GB')}. The leave is credited on the last day of the pay period, and a fraction of an hour is rounded to the nearest whole hour: ${X.irregularRoundingMinutes} minutes or more counts as an hour, less counts as nothing. Thirty hours worked in a week gives ${n2(weekly.exact)} hours, credited as ${weekly.credited}. Accrual stops at ${H.maxDays} days in a leave year. The rule is in regulation 15B of the Working Time Regulations 1998, added by SI 2023/1426, which does not extend to Northern Ireland: there, irregular and casual workers still receive ${H.statutoryWeeks} weeks a year in proportion to the time they work.`,
  faqs: [
    { q: 'Am I an irregular hours worker if my contract guarantees some hours but I usually work more?', a: 'It depends on whether your paid hours are wholly or mostly variable under the contract (regulation 15F(1)(a)). A contract of 10 guaranteed hours on which you usually work 30 is likely to be mostly variable; one of 35 fixed hours with occasional overtime is unlikely to be. The test looks at the contract terms for the leave year, read together if you have several contracts with the same employer.' },
    { q: 'Do I keep building up holiday while I am off sick?', a: `Yes. Regulation 15C gives you leave for each week of sick leave or statutory leave, such as maternity leave: ${rate} of your average weekly hours over the ${H.referenceWeeks} weeks before the absence. Weeks already spent on sick or statutory leave are left out and replaced by earlier ones, going back no further than ${H.maxLookbackWeeks} weeks.` },
    { q: 'When can I use the holiday I built up this month?', a: `From the start of the next pay period, according to GOV.UK’s example. The hours are credited on the last day of the period in which you worked them, so ${monthly.credited} hours earned in a monthly pay period ending on 30 September can be booked from 1 October, subject to the usual notice rules.` },
    { q: 'Why did a short shift add no holiday at all?', a: `Because of rounding. Four hours worked in a pay period gives ${n2(tiny.exact)} hours of leave, under half an hour, so regulation 15B(5) treats it as zero. Four and a half hours gives ${n2(short.exact)}, still under half an hour. Rounding is applied to each pay period, not to the year, so many small periods can lose a little each time.` },
    { q: 'Do these rules apply to me in Northern Ireland?', a: `No. The ${rate} accrual, the definitions of irregular-hours and part-year workers and rolled-up holiday pay came from SI 2023/1426, whose holiday provisions extend to England, Wales and Scotland only. In Northern Ireland the Working Time Regulations (Northern Ireland) 2016 still give ${H.statutoryWeeks} weeks a year, and nidirect says casual workers are entitled to paid time off for every hour they work.` },
  ],
  body: (h) => `
<h2>Who counts as irregular-hours or part-year</h2>
<p>${h.src('hol_wtr15F', 'Regulation 15F')} sets two tests, each applied leave year by leave year.</p>
<ul>
<li><strong>Irregular-hours worker</strong>: the number of paid hours you will work in each pay period is, under the contract, wholly or mostly variable. Zero-hours and many casual and bank contracts meet it.</li>
<li><strong>Part-year worker</strong>: the contract requires you to work only part of the year, and there are periods of at least ${X.partYearMinUnpaidWeeks} week in which you are neither required to work nor paid. Sick leave and statutory leave are ignored when applying this test. A term-time contract with unpaid school holidays is the classic case.</li>
</ul>
<p>Everyone else, including part-timers on a fixed pattern, stays on the ${H.statutoryWeeks}-week system (${h.a('holiday-entitlement-calculator', 'holiday entitlement calculator')}).</p>

<h2>Why ${rate}</h2>
<p>The rate is the statutory ${H.statutoryWeeks} weeks of leave divided by the ${h.num(workingWeeks, 1)} weeks that remain in a year once that leave is taken: ${H.statutoryWeeks} ÷ ${h.num(workingWeeks, 1)} = ${h.num(H.statutoryWeeks / workingWeeks, 4)}. Someone who works every one of those weeks therefore ends the year with ${H.statutoryWeeks} weeks of leave, and someone who works half of them ends with half as much.</p>
${h.table(['Hours worked in the pay period', `× ${rate}`, 'Credited (nearest hour)'], [
    [h.num(30), h.num(weekly.exact, 3), h.num(weekly.credited)],
    [h.num(96), h.num(monthly.exact, 3), h.num(monthly.credited)],
    [h.num(4.5, 1), h.num(short.exact, 3), h.num(short.credited)],
  ], 'Regulation 15B(3) and (5), calculated by the site engine.', ['r', 'r', 'r'])}

<h2>Pay, leaving and carrying over</h2>
<p>Each hour of leave is paid at the normal rate: a week’s pay averaged over the last ${H.referenceWeeks} paid weeks, divided by the average weekly hours of the same weeks (regulation 16(1A)). An employer may instead add ${rate} to each payslip as ${h.a('rolled-up-holiday-pay', 'rolled-up holiday pay')}: ${h.gbp(1220)} earned in a month carries ${formatMoney(rolledUp(1220), 2)} of holiday pay. On leaving, ${h.src('hol_wtr15E', 'regulation 15E')} replaces the usual (A × B) − C formula with something simpler: whatever has accrued and not been taken is paid, unless it was already paid as rolled-up holiday pay. Accrued hours can be carried into the next leave year after sickness or statutory leave, or by agreement (regulation 15D).</p>
`,
});
