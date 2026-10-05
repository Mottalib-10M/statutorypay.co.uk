import { definePage } from '../../lib/guide-types';
import { P } from '../../lib/engine/params';
import { weeklySsp, sspForDays } from '../../lib/engine/ssp';
import { formatMoney } from '../../lib/format';

const S = P.ssp;
const g = (n: number, d = 2) => formatMoney(n, d);
// Part-time patterns at the 2026 rules, computed by the engine.
const patterns: Array<[string, number, number]> = [['2 days a week, 7.5 hours a day at £12.71', 2, 2 * 7.5 * P.minimumWage.age21plus], ['3 days a week at £150', 3, 150], ['4 days a week at £400', 4, 400], ['Weekends only, 2 days at £180', 2, 180]];

export default definePage({
  id: 'ssp-part-time-multiple-jobs',
  group: 'sickness',
  order: 70,
  mini: 'sspTwoJobs',
  related: ['statutory-sick-pay', 'statutory-sick-pay-calculator', 'employment-status-rights', 'part-time-holiday-entitlement', 'ssp-changes-april-2026'],
  sources: ['govEmployerSsp', 'govSsp', 'sspQualifyingDays', 'hmrcRates', 'govPartTime'],
  slug: 'ssp-part-time-multiple-jobs',
  nav: 'SSP for part-timers and two jobs',
  card: 'Sick pay on short weeks, irregular days and more than one job.',
  title: `SSP for Part-Time Workers 2026/27: Short Weeks and Two Jobs`,
  description: `SSP for part-time workers in 2026/27: paid from day one with no earnings limit, the lower of ${g(S.weeklyRate)} and 80% of pay per job, and daily rates for short weeks.`,
  h1: 'Sick pay for part-timers and people with two jobs',
  intro: 'Since April 2026 a few hours a week are enough for SSP. How the daily rate works on short weeks, and why each employer pays separately.',
  resume: `Part-time employees have always been entitled to Statutory Sick Pay on the same footing as full-timers, but until 5 April 2026 anyone earning less than the lower earnings limit of ${g(S.pre2026.lel, 0)} a week got nothing. That condition went on 6 April 2026: now every employee or agency worker on the payroll qualifies from the first day of sickness, at the lower of ${g(S.weeklyRate)} a week and 80% of normal weekly earnings. On a short week the weekly rate is divided by the days you normally work, so a two-day worker receives half the weekly rate for each day off. With two or more jobs, each employer assesses SSP on the earnings it pays you and pays its own SSP; you can be off sick from one job and still fit for the other, in which case only the first employer pays. The 28-week limit also runs separately in each job.`,
  faqs: [
    { q: 'I work two days a week. Is my SSP half of a full-timer’s?', a: 'Not necessarily. For each day off you receive the weekly rate divided by two, so a full week of sickness pays the whole weekly rate. What is lower is the weekly rate itself when your earnings are low, because it cannot exceed 80% of what you normally earn from that job.' },
    { q: 'My hours change every week. Which days count as qualifying days?', a: 'Qualifying days are the days you would have been required to work. Without a fixed pattern, you and your employer can agree which days count; employers usually look at the days you actually worked in recent weeks. A rota published before you fell ill is the best evidence of the days you lost.' },
    { q: 'If I earn £300 in one job and £90 in another, is SSP worked out on £390?', a: `No. Each employer looks only at its own pay. Here, job A pays ${g(weeklySsp(300))} a week and job B ${g(weeklySsp(90))}, ${g(weeklySsp(300) + weeklySsp(90))} together, against ${g(weeklySsp(390))} if the two were one job. Being split across employers can raise the total, because each job gets its own flat-rate ceiling.` },
    { q: 'Do agency workers get SSP from the agency or from the client?', a: 'From whoever pays them and deducts National Insurance, normally the agency. GOV.UK lists agency workers among those who may be entitled to SSP. The agency looks at your recent earnings through it and the days you would have worked on the assignment.' },
  ],
  body: (h) => `
<h2>Short weeks, worked through</h2>
<p>The table applies the 2026 rules to four part-time patterns. The weekly rate is the lower of the flat rate and 80% of earnings; the daily rate is that weekly rate divided by the days worked; a day off pays one daily rate.</p>
${h.table(['Pattern', 'Weekly earnings', 'Weekly SSP', 'One day off'], patterns.map(([label, q, awe]) => [label, h.gbp(awe, 2), h.gbp(weeklySsp(awe), 2), h.gbp(sspForDays(awe, q, 1), 2)]), 'Rules from 6 April 2026; all four would have received nothing below the old earnings limit for short spells.', ['l', 'r', 'r', 'r'])}
<p>The first line shows the effect of the reform most clearly: fifteen hours at the National Living Wage of ${h.gbp(P.minimumWage.age21plus, 2)} an hour is ${h.gbp(2 * 7.5 * P.minimumWage.age21plus, 2)} a week, below the old limit, and now carries SSP of four fifths of that from the first day.</p>

<h2>Days you would have worked</h2>
<p>SSP is paid for qualifying days only, the days your contract or agreed rota required you to work. A part-timer who works Monday and Tuesday and is ill from Wednesday to Friday loses no qualifying days and gets no SSP for that week, even with a fit note, because there was nothing to be paid for. Ill from Monday to Wednesday, the same person is paid for two days. Where working days are not fixed, the employer and employee can agree which days count. Without such an agreement, ${h.src('sspQualifyingDays', 'regulation 5 of the 1982 SSP regulations')} takes the days on which it is agreed you were required to work; if it is agreed there were none in a week, the Wednesday counts; and with no agreement at all, every day except those on which none of the employer’s staff work. Keeping rotas and messages showing which shifts you were due to work is the simplest protection, and a written agreement on your normal days, made before any sickness, settles the question for good.</p>

<h2>Two jobs, two employers, two calculations</h2>
<p>Each employment is a separate contract, and SSP attaches to each. The employer in job A ignores job B entirely: its own earnings set its 80% cap, its own pattern sets the daily rate, its own records count the ${S.maxWeeks} weeks. The consequence, shown in the calculator above, is that two modest jobs can produce more SSP together than one job paying the same total, because each is capped at the flat rate separately. The reverse also happens: if you are too ill for a physically demanding job but able to do a desk job, only the first employer pays SSP, and you keep working, and earning, in the second.</p>
<p>Holiday follows the same logic: each employer owes 5.6 weeks pro rata to your days with them (${h.a('part-time-holiday-entitlement', 'part-time holiday')}).</p>

<h2>Zero-hours and casual work</h2>
<p>On a zero-hours contract you are often a worker rather than an employee, but SSP covers anyone on the payroll as an employed earner who has done some work under the contract, which includes most casual workers. The practical question is which days you would have worked. If shifts were already offered and accepted for the days you were ill, they are qualifying days. If no work was scheduled, there is nothing to pay. Since April 2026 a single lost shift is enough to trigger SSP, where it used to fall inside the waiting days. Whether you are an employee or a worker matters for other rights; ${h.a('employment-status-rights', 'employment status')} sets out which.</p>

<h2>Checking your own case</h2>
<p>Enter each job separately in the ${h.a('statutory-sick-pay-calculator', 'Statutory Sick Pay calculator')}: the earnings from that job, its working days and your dates of sickness. The total for each job is what that employer should put on your payslip. If one of them applies an old rule, such as three waiting days or a refusal because you earn under ${h.gbp(S.pre2026.lel, 0)}, the ${h.a('ssp-changes-april-2026', 'guide to the April 2026 changes')} gives the legal references to show them.</p>
`,
});
