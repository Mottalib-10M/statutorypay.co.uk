import { definePage } from '../../lib/guide-types';
import { P } from '../../lib/engine/params';
import { computeNotice, statutoryNoticeWeeks } from '../../lib/engine/notice';
import { addDays, addMonths, addYears, diffDays } from '../../lib/engine/dates';
import { formatMoney, displayDate } from '../../lib/format';

const N = P.notice;
const d = (iso: string) => displayDate(iso, 'en-GB');
// The example already filled in on the calculator, computed by the engine.
const ex = computeNotice({ start: '2019-03-11', noticeGiven: '2026-10-05', contractualWeeks: 4, weeklyPay: 620 });
// Same person, but the contract says "one calendar month": count the month in days from the day after notice.
const monthEnd = addMonths('2026-10-05', 1);
const monthDays = diffDays('2026-10-05', monthEnd);
// Statutory employer notice for a number of complete years, notice given on 5 October 2026.
const weeksFor = (y: number) => statutoryNoticeWeeks(addYears(addDays('2026-10-05', 1), -y), '2026-10-05');
// First number of complete years at which the statutory weeks are longer than any calendar month (31 days).
const beatsAnyMonth = Array.from({ length: N.maxWeeks }, (_, i) => i + 1).find((y) => weeksFor(y) * 7 > 31) ?? N.maxWeeks;
const vsMonth = (days: number) => (days > 31 ? 'Yes, always' : days >= 28 ? 'Equal to a month starting in February' : 'No');
const scaleRows = [1, 3, beatsAnyMonth - 1, beatsAnyMonth, N.maxWeeks].map((y) => { const w = weeksFor(y); return [y, w, w * 7, vsMonth(w * 7)]; });
// A resignation under the same contract.
const quit = computeNotice({ start: '2019-03-11', noticeGiven: '2026-10-05', contractualWeeks: 4, weeklyPay: 620, byEmployee: true });
const short = computeNotice({ start: '2026-07-20', noticeGiven: '2026-10-05', contractualWeeks: 0, weeklyPay: 620 });

export default definePage({
  id: 'notice-period-calculator',
  group: 'leaving',
  order: 10,
  tool: 'notice',
  related: ['statutory-notice-period', 'payment-in-lieu-of-notice', 'resignation-notice-period', 'final-pay-calculator', 'redundancy-relevant-date', 'weeks-pay-explained'],
  sources: ['era86', 'acasNotice', 'govNoticeResign', 'govRedundancy', 'ni_erni118'],
  slug: 'notice-period-calculator',
  nav: 'Notice period calculator',
  card: 'Statutory against contractual notice, the last day and what the notice is worth.',
  title: `Notice Period Calculator 2026: 1 to ${N.maxWeeks} Weeks, Your Last Day`,
  description: `Notice period calculator for 2026: statutory notice of 1 to ${N.maxWeeks} weeks under ERA s.86 against your contract, your last day of work and the gross value of notice.`,
  h1: 'Notice period calculator: statute against contract',
  intro: 'Give your start date, the day notice is handed over and what the contract says: the calculator keeps the longer of the two notices and dates the end of the job.',
  resume: `An employer who ends a contract must give at least ${N.underTwoYearsWeeks} week of notice once the employee has ${N.minServiceMonths} month of continuous employment, then one week for each complete year of service from two years, stopping at ${N.maxWeeks} weeks after twelve years (Employment Rights Act 1996, section 86; article 118 of the Northern Ireland Order sets the same scale). An employee who resigns owes ${N.employeeWeeks} week unless the contract asks for more. A notice clause in the contract counts only when it is longer than the statutory figure: a shorter clause is overridden. Notice runs from the day after it is given, so a week given on a Monday ends on the following Monday. The calculator compares the two, applies the longer one, gives the last day of employment and multiplies the weeks by your gross weekly pay, which is the sum at stake if the notice is paid in lieu or not paid at all.`,
  faqs: [
    { q: 'Does the calculator count notice in weeks or in calendar months?', a: `In weeks, because section 86 is written in weeks. If your contract says one month, enter about four weeks, then check the date: a calendar month given on ${d('2026-10-05')} ends on ${d(monthEnd)}, which is ${monthDays} days. From ${beatsAnyMonth} complete years of service the statutory weeks are longer than any month, so the statute wins.` },
    { q: 'Why does the result show a date when my notice would grow by one more week?', a: 'Because the scale rises on each anniversary of your start date between two and twelve years. Notice handed over the day after an anniversary carries one more week than notice handed over the day before. Employers sometimes time a dismissal around that date; knowing it lets you check the arithmetic in the letter you receive.' },
    { q: 'I started less than a month ago. Is any notice owed?', a: `Not by statute. Section 86 starts after ${N.minServiceMonths} month of continuous employment, so in the first weeks only the contract, written or implied, fixes notice. Someone who began on ${d('2026-07-20')} and is told on ${d('2026-10-05')} is owed ${short.statutoryWeeks} week.` },
    { q: 'Can I use the calculator for notice I give when I resign?', a: `Yes. Choose “Employee” at the top. The statutory minimum is then ${N.employeeWeeks} week whatever your length of service, and the contract figure applies when it is longer. With the example contract of four weeks, a resignation handed in on ${d('2026-10-05')} ends employment on ${d(quit.endDate)}.` },
    { q: 'What weekly pay should I enter to value my notice?', a: `Your gross pay for a normal week. If your hours or commission vary, use the average of the ${P.redundancy.averagingWeeks} complete weeks before notice starts, which is the reference period GOV.UK gives for notice pay. Regular contractual extras belong in the figure; one-off expenses do not. The result is before tax and National Insurance.` },
  ],
  body: (h) => `
<h2>Reading the result</h2>
<p>The headline is the notice that applies: whichever is longer of the statutory minimum and the clause in your contract. The two lines under it show each figure separately, so you can see which one decided. “Rule applied” says “contract” only when the clause is strictly longer. The last day is counted from the day after notice is given, the rule GOV.UK states for resignations; the calculator counts a dismissal the same way. The value line is weeks × gross weekly pay: that is what you should receive if you work the notice, if you are sent on garden leave, or if the employer pays you in lieu.</p>
<p>The example already filled in describes someone who started on ${d('2019-03-11')} and receives notice on ${d('2026-10-05')}, with a four-week clause and ${formatMoney(620)} a week. They have ${ex.serviceYears} complete years, so the statute gives ${ex.statutoryWeeks} weeks and beats the contract. Employment ends on ${d(ex.endDate)} and the notice is worth ${h.gbp(ex.noticePay)} gross. ${ex.nextStepUp ? `Notice given from ${d(ex.nextStepUp)} would carry one more week.` : ''}</p>

<h2>Contract clauses written as months</h2>
<p>Many UK contracts say “one month” or “three months”. A month is a calendar month, so its length in days changes with the date it starts. The statutory scale is in weeks, and the comparison turns on years of service:</p>
${h.table(['Complete years', 'Statutory weeks', 'In days', 'Longer than one calendar month?'], scaleRows, 'Statutory employer notice under ERA 1996 s.86(1), against a contractual notice of one calendar month.', ['r', 'r', 'r', 'l'])}
<p>A three-month clause stays ahead of the statute at every length of service, because ${N.maxWeeks} weeks is ${N.maxWeeks * 7} days and three calendar months always run past that.</p>

<h2>What the calculator leaves to you</h2>
<ul>
<li><strong>Your start date.</strong> Use the date your employer counts continuous employment from; it is on the written statement of particulars. A transfer of business or a previous job with an associated employer can move it earlier.</li>
<li><strong>Dismissal for gross misconduct.</strong> Section 86(6) keeps the right to end a contract without notice for the other party’s conduct. The calculator assumes notice is owed.</li>
<li><strong>Fixed-term contracts.</strong> A contract simply ending on its agreed date needs no notice. Ending it early does.</li>
<li><strong>Redundancy pay and holiday.</strong> They are added in the ${h.a('final-pay-calculator', 'final pay calculator')}. If notice is paid in lieu, the date used for redundancy service moves to the end of the statutory notice: see ${h.a('redundancy-relevant-date', 'the relevant date')}.</li>
</ul>
<p>For the legal background of the scale, read ${h.a('statutory-notice-period', 'statutory notice periods')}; for the resigning side, ${h.a('resignation-notice-period', 'notice when you resign')}.</p>
`,
});
