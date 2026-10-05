import { definePage } from '../../lib/guide-types';
import { P } from '../../lib/engine/params';
import { holidayPay, averageWeeksPay, entitlementDays } from '../../lib/engine/holiday';

const H = P.holiday;
// Three workers, five-day weeks, a year of statutory leave priced by the engine.
const people: Array<[string, number, number, number]> = [
  ['Sales adviser, commission on every sale', 450, 9100, 52],
  ['Care worker, rostered overtime most weeks', 520, 6240, 52],
  ['Engineer, seniority allowance and occasional call-outs', 700, 1300, 52],
];

export default definePage({
  id: 'holiday-pay-overtime-commission',
  group: 'holiday',
  order: 110,
  mini: 'overtimeHoliday',
  related: ['holiday-pay-calculator', 'rolled-up-holiday-pay', 'weeks-pay-explained', 'zero-hours-holiday-pay', 'holiday-pay-when-leaving'],
  sources: ['wtr16', 'govHoliday', 'acasHolidayPay', 'si2023_1426'],
  slug: 'holiday-pay-overtime-commission',
  nav: 'Overtime and commission in holiday pay',
  card: 'Which extras must be in your holiday pay, and for how many weeks.',
  title: 'Holiday Pay With Overtime and Commission 2026: What Counts',
  description: `Holiday pay with overtime and commission in 2026: regular overtime, commission and seniority pay count for the first ${H.basicWeeks} weeks of leave, averaged over ${H.referenceWeeks} weeks.`,
  h1: 'Overtime, commission and allowances in holiday pay',
  intro: 'Which payments on top of basic pay must follow you on holiday, which may be left out, and how the average is taken.',
  resume: `Holiday pay is meant to match what you normally earn, not just your basic rate. Since 1 January 2024, regulation 16(3ZA) of the Working Time Regulations lists the payments that must be included in a week’s holiday pay for the first ${H.basicWeeks} weeks of statutory leave in Great Britain: payments, including commission, intrinsically linked to tasks your contract obliges you to do; payments for professional or personal status, such as seniority, length of service or qualifications; and other payments, such as overtime, regularly paid in the ${H.referenceWeeks} weeks before the leave. The remaining ${H.additionalWeeks} weeks may be paid at basic pay for regular-hours workers, while irregular-hours and part-year workers are paid at the full normal rate for all leave. Variable elements are averaged over the last ${H.referenceWeeks} weeks in which you were paid, looking back up to ${H.maxLookbackWeeks} weeks. One-off bonuses and expenses are not usually included.`,
  faqs: [
    { q: 'Is guaranteed overtime treated differently from voluntary overtime?', a: 'Both can count. Overtime your contract obliges you to work is linked to your contractual tasks; voluntary overtime counts if it has been regularly paid in the 52 weeks before your leave. What matters is regularity, not the label. Occasional extra shifts worked a few times a year are unlikely to qualify.' },
    { q: 'My commission is paid quarterly. How does it get into my holiday pay?', a: 'The commission earned in the reference period is averaged into a weekly figure and added to the week’s pay, as regulation 16(3ZB) requires. Spreading quarterly payments over the paid weeks avoids the distortion of a holiday falling just before or after a big commission month.' },
    { q: 'Are travel allowances or expenses part of holiday pay?', a: 'Genuine expenses that reimburse costs you incur at work are not pay, so they stay out. An allowance that is really a pay supplement, paid regardless of costs, may be part of normal pay if it is linked to your tasks or status. The distinction turns on what the payment is for, not what it is called.' },
    { q: 'Does a shift premium for nights or weekends count in holiday pay?', a: 'Usually yes. A premium paid because your contract requires you to work nights, weekends or unsocial hours is linked to the tasks you are obliged to perform, so it falls within the first category of regulation 16(3ZA) and belongs in the normal rate for the first four weeks of statutory leave in Great Britain.' },
  ],
  body: (h) => `
<h2>The three categories, in plain words</h2>
<ul>
<li><strong>Payments tied to the job you must do</strong> (regulation 16(3ZA)(a)): commission on sales you are employed to make, shift premiums, productivity payments for the work in your contract.</li>
<li><strong>Payments for who you are at work</strong> (16(3ZA)(b)): seniority or long-service increments, qualification allowances, professional status payments.</li>
<li><strong>Other regular payments</strong> (16(3ZA)(c)): overtime and similar payments regularly made in the ${H.referenceWeeks} weeks before the leave, whether or not the overtime was compulsory.</li>
</ul>
<p>These categories codify years of tribunal and court decisions into the regulations. They apply to the 4 weeks of basic leave under regulation 13 and to all leave of irregular-hours and part-year workers under regulation 15B. The additional 1.6 weeks under regulation 13A can still be paid on basic pay for regular-hours workers, which explains why the same worker can see two daily rates on a holiday payslip.</p>

<h2>What it means over a year</h2>
<p>The table prices a full year of statutory leave, ${h.num(entitlementDays(5))} days, for three five-day workers, with their extras averaged over ${H.referenceWeeks} paid weeks. “Required minimum” applies the normal rate for 4 weeks and basic pay for 1.6 weeks; “basic only” is the unlawful practice of leaving the extras out entirely.</p>
${h.table(['Worker', 'Basic week', 'Extras a week', 'Required minimum for the year', 'Basic only'], people.map(([label, basic, extras, weeks]) => { const x = averageWeeksPay(extras, weeks); const ok = holidayPay({ basicWeek: basic, extrasWeek: x, daysPerWeek: 5, daysTaken: entitlementDays(5), irregular: false }); const bad = holidayPay({ basicWeek: basic, extrasWeek: 0, daysPerWeek: 5, daysTaken: entitlementDays(5), irregular: false }); return [label, h.gbp(basic), h.gbp(x), h.gbp(ok.pay), h.gbp(bad.pay)]; }), 'Gross amounts. Extras: yearly total divided by the paid weeks in the reference period.', ['l', 'r', 'r', 'r', 'r'])}
<p>For the sales adviser, leaving commission out of holiday pay costs ${h.gbp(4 * 5 * averageWeeksPay(9100, 52) / 5)} a year. Many contracts pay the normal rate for all ${H.statutoryWeeks} weeks anyway, which is simpler to administer and is always allowed.</p>

<h2>Taking the average</h2>
<p>For anyone whose pay varies, regulation 16 points to sections 221 to 224 of the Employment Rights Act 1996 with the reference period changed from 12 weeks to ${H.referenceWeeks}. Weeks in which you received no pay are skipped and earlier weeks used instead, going back no more than ${H.maxLookbackWeeks} weeks. A worker employed for less than ${H.referenceWeeks} complete weeks uses the complete weeks they have. Monthly-paid staff convert each month to an hourly rate, then to weeks, as GOV.UK describes (${h.a('weeks-pay-explained', 'a week’s pay explained')}). The ${h.a('holiday-pay-calculator', 'holiday pay calculator')} takes a yearly total of extras and the number of paid weeks.</p>

<h2>Checking your own holiday pay</h2>
<p>Take a payslip for a week of holiday and one for an ordinary week. Divide the holiday pay by the days of leave to get the daily rate actually paid. Then add up your overtime, commission and allowances over the last ${H.referenceWeeks} paid weeks, divide by the number of those weeks and by your working days a week, and add the result to your basic daily rate. If the first figure is below the second for leave within your first ${H.basicWeeks} weeks of the year, the extras are missing. Raise it in writing with payroll, quoting regulation 16(3ZA); unpaid holiday pay can be claimed as an unlawful deduction from wages if it is not corrected, within the time limits Acas explains.</p>

<h2>What is usually left out</h2>
<p>GOV.UK says the normal rate does not usually include bonus payments. A discretionary annual bonus, a one-off retention payment or a profit share tied to company results rather than your own tasks falls outside the three categories. Reimbursed expenses are not pay at all. Benefits in kind, such as a company car, continue during leave under the contract rather than through holiday pay.</p>

<h2>Northern Ireland and older leave years</h2>
<p>The categories were written into the Great Britain regulations by ${h.src('si2023_1426', 'SI 2023/1426')}, which does not extend to Northern Ireland. There, the duty to reflect normal pay in holiday pay comes from case law applied to the Northern Ireland regulations rather than from a written list, and Northern Ireland courts have their own decisions on overtime. For holiday taken before 1 January 2024 in Great Britain, the same case law, not regulation 16(3ZA), decides old claims. For a dispute about either, Acas or the Labour Relations Agency can help before a tribunal claim.</p>
`,
});

