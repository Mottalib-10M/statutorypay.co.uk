import { definePage } from '../../lib/guide-types';
import { P } from '../../lib/engine/params';
import { entitlementDays, entitlementHours, bankHolidaysBetween, bankHolidayProRata } from '../../lib/engine/holiday';
import { formatNumber } from '../../lib/format';

const H = P.holiday;
const n1 = (x: number) => formatNumber(x, 1);
const DAY = 7.5; // hours in the illustrative working day of the table
const steps = [0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5];
// Worked examples computed by the engine.
const three = entitlementDays(3);
const two = entitlementDays(2);
const unequal = entitlementHours(8 + 8 + 4, 3); // two 8-hour days and one 4-hour day
const compressedHours = entitlementHours(37.5, 4);
const compressedDays = entitlementDays(4);
const ew = bankHolidaysBetween('england-and-wales', '2026-01-01', '2026-12-31');
const sc = bankHolidaysBetween('scotland', '2026-01-01', '2026-12-31');
const ni = bankHolidaysBetween('northern-ireland', '2026-01-01', '2026-12-31');
const ewMondays = ew.filter(([d]) => new Date(`${d}T00:00:00Z`).getUTCDay() === 1).length;
const shareThree = bankHolidayProRata(ew.length, 3);
const contractual = 25; // an illustrative full-time contract: 25 days plus bank holidays
const fullTimePackage = contractual + ew.length;
const partPackage = fullTimePackage * 3 / 5;

export default definePage({
  id: 'part-time-holiday-entitlement',
  group: 'holiday',
  order: 30,
  mini: 'partTimeHoliday',
  related: ['holiday-entitlement-calculator', 'bank-holidays-and-annual-leave', 'holiday-pay-calculator', 'irregular-hours-holiday-calculator', 'term-time-part-year-holiday'],
  sources: ['govHoliday', 'hol_ptwr5', 'govPartTime', 'nidHoliday', 'hol_nidTakingHolidays', 'wtr13A'],
  slug: 'part-time-holiday-entitlement',
  nav: 'Part-time holiday',
  card: 'Days, hours and the bank holiday share for anyone working fewer than five days.',
  title: `Part-Time Holiday Entitlement 2026/27: ${H.statutoryWeeks} × Days Worked`,
  description: `Part-time holiday entitlement in 2026/27: ${H.statutoryWeeks} times the days you work, so ${n1(three)} days on a three-day week, plus your pro-rata share of bank holidays given on top.`,
  h1: 'Part-time holiday entitlement, in days and in hours',
  intro: 'A part-timer gets the same number of weeks off as a full-timer; only the length of a week changes, and bank holidays are where most of the disputes start.',
  resume: `A part-time worker with regular hours is entitled to ${H.statutoryWeeks} weeks of paid holiday a year, the same number of weeks as a full-timer, so the number of days is ${H.statutoryWeeks} times the days worked in a normal week. Three days a week gives ${n1(three)} days and two days gives ${n1(two)}, the example nidirect uses for Northern Ireland. When working days are not the same length, counting in hours is fairer: two eight-hour days and one four-hour day make ${formatNumber(20)} hours a week and ${n1(unequal)} hours of leave. Bank holidays are not a separate legal right. If an employer gives full-timers bank holidays on top of their leave, a part-timer is owed a proportionate share, worked out against a five-day week, whether or not the bank holidays fall on their working days: ${n1(shareThree)} days for a three-day worker in England and Wales in 2026. In Great Britain this comes from the pro rata principle of the Part-time Workers Regulations 2000; nidirect states the same rule for Northern Ireland.`,
  faqs: [
    { q: 'Do part-time workers get bank holidays off?', a: 'Not automatically. Nobody has a statutory right to a day off on a bank holiday, full-time or part-time. What part-timers have is a right not to be treated less favourably than comparable full-timers, so if full-timers get bank holidays as extra paid days, a part-timer should get a proportionate number of extra hours or days, taken when the employer agrees.' },
    { q: 'I only work Tuesdays and Thursdays. Do I lose out when bank holidays fall on a Monday?', a: `If bank holidays are given on top of leave and you get none of them, yes, you are treated less favourably than a full-timer. ${ewMondays} of the ${ew.length} bank holidays in England and Wales in 2026 fall on a Monday. The fix is a pro-rata allowance of ${n1(bankHolidayProRata(ew.length, 2))} days for a two-day week, usable on any day.` },
    { q: 'How many hours of holiday do I get on 20 hours a week?', a: `${n1(entitlementHours(20, 4))} hours: ${H.statutoryWeeks} times your weekly hours. The number of days over which the 20 hours are spread does not change the hours, only how many days off they buy. Four days of five hours each gives ${n1(entitlementDays(4))} days off, each worth five hours.` },
    { q: `Can my employer round my ${n1(three)} days down to ${Math.floor(three)}?`, a: `No. The ${H.statutoryWeeks} weeks are a minimum, and nidirect states that part days cannot be rounded down; they also do not have to be rounded up. The employer can round up to ${formatNumber(Math.ceil(three))} if it wishes, or let you take the part day as a shorter working day. Rounding down would leave you below the legal floor.` },
    { q: 'I work four long days instead of five. How is my holiday counted?', a: `Counting in hours avoids the trap. On ${n1(37.5)} hours over four days your entitlement is ${n1(compressedHours)} hours, the same as a five-day colleague on ${n1(37.5)} hours. Counted in days it is ${n1(compressedDays)} days of ${n1(37.5 / 4)} hours, which comes to the same total. Problems start when an employer counts four-day weeks in days but deducts bank holidays as standard days.` },
  ],
  body: (h) => `
<h2>The rule: weeks, not days</h2>
<p>The Working Time Regulations 1998 do not give anyone a number of days. They give ${H.statutoryWeeks} weeks of leave a year, and a week of leave is whatever a working week is for that person (${h.src('wtr13A', 'regulation 13A')}). For someone who works three days, a week off is three days off, so ${H.statutoryWeeks} weeks is ${h.num(three, 1)} days. GOV.UK puts it as “3 × ${H.statutoryWeeks}”. The ${H.maxDays}-day ceiling only ever reaches people working five days or more, so it never limits a part-timer.</p>
<p>The table gives the result for every half day from half a day to a full five-day week, with the equivalent in hours for a ${h.num(DAY, 1)}-hour working day. If your days are a different length, multiply the days column by your own day length, or use the hours figure from the mini-calculator above.</p>
${h.table(['Days worked per week', 'Statutory holiday in days', `In hours, ${h.num(DAY, 1)}-hour day`], steps.map((s) => [h.num(s, 1), h.num(entitlementDays(s), 1), h.num(entitlementHours(s * DAY, s), 1)]),
    `${H.statutoryWeeks} weeks of leave, calculated by the site engine; ${H.maxDays} days at most.`, ['r', 'r', 'r'])}

<h2>When hours work better than days</h2>
<p>Days are a fair unit only when every working day is the same length. Take someone who works two eight-hour days and one four-hour day. In days they are entitled to ${h.num(three, 1)}. But a day off on a long day uses twice as much time as a day off on the short day, so the same allowance can buy very different amounts of rest. In hours the answer does not depend on which days are booked: ${h.num(20)} hours a week times ${H.statutoryWeeks} is ${h.num(unequal, 1)} hours, and each day off uses up the hours that day would have been worked.</p>
<p>Compressed hours are the same problem from the other side. A full-time employee on ${h.num(37.5, 1)} hours squeezed into four days has ${h.num(compressedDays, 1)} days of leave, each ${h.num(37.5 / 4, 3)} hours long, which equals ${h.num(compressedHours, 1)} hours, exactly what a five-day colleague on the same hours gets. The total is the same; the risk is in how bank holidays are deducted. If the employer takes off a bank holiday as a standard ${h.num(DAY, 1)}-hour day from someone whose day is longer, the books stop balancing.</p>

<h2>Bank holidays for part-timers</h2>
<p>Bank holidays do not have to be given as paid leave at all (${h.src('govHoliday', 'GOV.UK, Holiday entitlement')}). They matter for part-timers only because of how full-timers are treated. Regulation 5 of the Part-time Workers (Prevention of Less Favourable Treatment) Regulations 2000 gives a part-time worker the right not to be treated less favourably than a comparable full-time worker on the terms of their contract, and says the pro rata principle applies unless it is inappropriate (${h.src('hol_ptwr5', 'regulation 5')}). Those regulations cover Great Britain; Northern Ireland has its own, and nidirect tells part-timers there that extra bank holiday time off given to staff “should be given pro rata to you as well, even if the bank holiday does not fall on your usual work day”.</p>
<p>There are two common contract wordings, and they lead to different calculations.</p>
<ul>
<li><strong>Bank holidays inside the ${H.statutoryWeeks} weeks.</strong> The worker has ${h.num(three, 1)} days in total on a three-day week, and any bank holiday that falls on a working day is taken out of that allowance. Nothing extra is owed.</li>
<li><strong>Bank holidays on top.</strong> A full-timer on ${contractual} days plus the ${ew.length} bank holidays of England and Wales has ${fullTimePackage} days in all. A three-day worker should get three fifths of that package, ${h.num(partPackage, 1)} days, from which the bank holidays that land on their working days are then deducted. The share attached to the bank holidays alone is ${h.num(shareThree, 1)} days.</li>
</ul>
<p>The number of bank holidays depends on where you work. In 2026 there are ${ew.length} in England and Wales, ${sc.length} in Scotland and ${ni.length} in Northern Ireland, so the same three-day contract carries a share of ${h.num(bankHolidayProRata(ew.length, 3), 1)}, ${h.num(bankHolidayProRata(sc.length, 3), 1)} or ${h.num(bankHolidayProRata(ni.length, 3), 1)} days. The ${h.a('bank-holidays-and-annual-leave', 'bank holiday tool')} lists the dates and counts them inside your own leave year.</p>

<h2>Part days and how to take them</h2>
<p>Fractions such as ${h.num(three, 1)} or ${h.num(two, 1)} are normal for part-timers. GOV.UK says how a part day is taken is up to the employer: it can be a shorter working day, a late start or an early finish. nidirect adds, for Northern Ireland, that part days cannot be rounded down and do not need to be rounded up, though an employer may choose to round up, and that the part day could be carried into the next holiday year.</p>

<h2>Overtime and holiday pay for part-timers</h2>
<p>A part-timer’s holiday pay follows the same rules as anyone else’s: a week’s pay for a week off, with regular overtime included for the first ${H.basicWeeks} weeks (${h.a('holiday-pay-calculator', 'holiday pay calculator')}). One specific rule in regulation 5(4) concerns overtime rates, not leave: an employer may pay a part-timer a lower overtime rate until their total hours exceed the full-timer’s normal hours, without that counting as less favourable treatment. GOV.UK’s part-time workers’ rights page makes the same point (${h.src('govPartTime', 'GOV.UK, Part-time workers’ rights')}).</p>

<h2>If your hours are not fixed</h2>
<p>Everything above assumes a regular pattern. If your hours vary from one pay period to the next, or your contract includes unpaid weeks off, the 2024 rules for irregular-hours and part-year workers in Great Britain may apply instead: holiday builds up at ${h.pct(H.irregularAccrualRate, 2)} of hours worked, see the ${h.a('irregular-hours-holiday-calculator', 'irregular hours calculator')}. Term-time contracts are covered in ${h.a('term-time-part-year-holiday', 'term-time and part-year holiday')}.</p>
`,
});
