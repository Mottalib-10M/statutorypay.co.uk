import { definePage } from '../../lib/guide-types';
import { CAP_GB, P, redundancyCapOn } from '../../lib/engine/params';
import { reckonerWeeks } from '../../lib/engine/redundancy';
import { addDays, addWeeks } from '../../lib/engine/dates';
import { formatMoney } from '../../lib/format';

const g = (n: number) => formatMoney(n);
const R = P.redundancy;
const X = P.redundancyExtra;
const gNow = X.guaranteePayDay[X.guaranteePayDay.length - 1];
const gBefore = X.guaranteePayDay[X.guaranteePayDay.length - 2].day;
const gMax = gNow.day * X.guaranteeMaxDays;
// A machinist laid off from Sunday 6 September 2026: the timetable, computed.
const layStart = '2026-09-06';
const fourthWeekEnds = addDays(addWeeks(layStart, R.layOffWeeksInRow), -1);
const claimBy = addWeeks(fourthWeekEnds, X.layOffClaimWithinWeeks);
const served = '2026-10-09';
const counterBy = addDays(served, X.counterNoticeDays);
const resignBy = addWeeks(counterBy, X.layOffResignWindowWeeks);
const mAge = 46;
const mYears = 11;
const mPay = 640;
const mWeeks = reckonerWeeks(mAge, mYears);
const mAmount = mWeeks * Math.min(mPay, redundancyCapOn(fourthWeekEnds));

export default definePage({
  id: 'lay-off-short-time-redundancy',
  group: 'redundancy',
  order: 110,
  mini: 'layOffClaim',
  related: ['statutory-redundancy-pay', 'redundancy-pay-calculator', 'redundancy-relevant-date', 'redundancy-variable-pay', 'employment-status-rights'],
  sources: ['red_era148', 'red_era152', 'red_era150', 'red_era31', 'red_govLayOff', 'red_govStaffRedundant', 'red_limitsOrderNI2026'],
  slug: 'lay-off-short-time-redundancy',
  nav: 'Lay-offs and short time',
  card: `Guarantee pay while there is no work, and how to claim redundancy pay after ${R.layOffWeeksInRow} or ${R.layOffWeeksIn13} weeks.`,
  title: `Lay-Off and Short-Time Working 2026: £${gNow.day} Guarantee Pay`,
  description: `Lay-off and short-time working in 2026: guarantee pay of ${g(gNow.day)} a day for up to ${X.guaranteeMaxDays} days in 3 months, and a redundancy claim after ${R.layOffWeeksInRow} weeks in a row or ${R.layOffWeeksIn13} in ${X.layOffSeriesWindowWeeks}.`,
  h1: 'Laid off or on short time: guarantee pay and claiming redundancy',
  intro: 'When the work dries up but the job has not formally ended, the law gives a small daily payment first and, after a few weeks, a way out with redundancy pay.',
  resume: `A lay-off is a week in which your employer gives you no work and, because your contract ties pay to work provided, no pay; short-time working is a week in which reduced work leaves you with less than half a week’s pay. An employer can only do either if the contract or an agreement allows it. For each full day without work you are entitled to statutory guarantee pay, at most ${g(gNow.day)} a day from 6 April 2026 (${g(gBefore)} before), for no more than ${X.guaranteeMaxDays} days in any ${X.guaranteePeriodMonths} months, so ${g(gMax)}, with the same figure in Northern Ireland. After ${R.layOffWeeksInRow} or more consecutive weeks of lay-off or short time, or ${R.layOffWeeksIn13} or more in ${X.layOffSeriesWindowWeeks} weeks with no more than ${X.layOffMaxConsecutiveInSeries} in a row, you can write to the employer within ${X.layOffClaimWithinWeeks} weeks to claim a redundancy payment. The employer has ${X.counterNoticeDays} days to contest it by showing that at least ${X.layOffResumeLastsWeeks} weeks of normal work will start within ${X.layOffResumeWithinWeeks} weeks. If it does not, you resign with notice within ${X.layOffResignWindowWeeks} weeks and receive statutory redundancy pay as if dismissed.`,
  faqs: [
    { q: 'How much is guarantee pay in 2026?', a: `From 6 April 2026 the maximum is ${g(gNow.day)} for each workless day, under section 31 of the Employment Rights Act 1996, for up to ${X.guaranteeMaxDays} days in any ${X.guaranteePeriodMonths}-month period: ${g(gMax)} in all. If your normal daily pay is lower, you get that instead, and part-timers are paid proportionately. Northern Ireland’s 2026 Order sets the same ${g(gNow.day)} daily limit.` },
    { q: 'Do I have to resign to get redundancy pay after a lay-off?', a: `Yes. Section 150 makes resignation with notice a condition: one week, or longer if your contract requires more. It has to be given within ${X.layOffResignWindowWeeks} weeks of the end of the employer’s ${X.counterNoticeDays}-day window, or of a counter-notice being withdrawn, or of a tribunal’s decision in your favour. Resign too early or too late and the claim fails.` },
    { q: 'What is a counter-notice from my employer?', a: `It is the employer’s written answer to your notice of intention to claim, given within ${X.counterNoticeDays} days, saying it will contest liability. It succeeds only if, when you served your notice, it was reasonable to expect at least ${X.layOffResumeLastsWeeks} weeks of normal work starting within ${X.layOffResumeWithinWeeks} weeks. If you are still laid off in each of those ${X.layOffResumeWithinWeeks} weeks, the defence falls away.` },
    { q: 'Can my employer lay me off without pay if my contract says nothing about it?', a: 'Generally no. GOV.UK says you should get your full pay unless your contract allows unpaid or reduced-pay lay-offs. The power can also come from a collective agreement written into your contract, from a long-established practice, or from your agreement to change the contract. Without one of these, you should be paid in full during the lay-off.' },
    { q: 'Can I work for someone else while I am laid off?', a: 'Usually yes, unless your contract forbids it. GOV.UK suggests getting your employer’s agreement, avoiding work for a competitor and staying available to return when the lay-off ends. Universal Credit or New Style Jobseeker’s Allowance may also be available while you are laid off or on short time.' },
  ],
  body: (h) => `
<h2>What counts as a week of lay-off or short time</h2>
<p>${h.src('red_era148', 'Part XI')} of the Employment Rights Act 1996 uses two precise tests, applied week by week (section 147):</p>
<ul>
<li><strong>Laid off:</strong> your pay depends on being given work of the kind you are employed to do, the employer gives none, and you are entitled to no pay for the week.</li>
<li><strong>Short time:</strong> because there is less of that work, your pay for the week is less than half a week’s pay. The half-week test uses a week’s pay calculated on the day before the first of the weeks counted.</li>
</ul>
<p>A week of reduced hours that still pays half or more of your normal week does not count, however unwelcome. Section 235 makes a week end on a Saturday, unless your pay is calculated weekly by a week ending on another day.</p>

<h2>Guarantee pay while there is no work</h2>
<p>For each complete day in which you would normally work but the employer gives you none, you can claim a guarantee payment (${h.src('red_era31', 'section 31')}). The daily maximum and the cap on days are:</p>
${h.table(['Workless day on or after', 'Daily maximum', 'Days in any 3 months', 'Most in 3 months'], X.guaranteePayDay.map((r) => [h.date(r.from), h.gbp(r.day), X.guaranteeMaxDays, h.gbp(r.day * X.guaranteeMaxDays)]).reverse(),
    'ERA 1996 s.31 and the Increase of Limits Orders; Northern Ireland: SR 2026/57, same figures.', ['l', 'r', 'r', 'r'])}
<p>The number of days is capped at the days you normally work in a week, up to ${X.guaranteeMaxDays}; someone on a three-day week can claim three days in a quarter. GOV.UK sets the conditions (${h.src('red_govLayOff', 'Lay-offs and short-time working')}): ${X.guaranteeServiceMonths} month of continuous employment, being available for work, not refusing reasonable alternative work even outside your usual duties, and the lay-off not being caused by industrial action. No guarantee pay is due for a day on which you do some work. An employer’s own scheme can replace the statutory one but cannot pay less, and unpaid guarantee pay can be claimed at a tribunal as an unlawful deduction.</p>

<h2>Claiming redundancy pay: the two triggers</h2>
<p>Section 148 lets you claim once you have been laid off or kept on short time either:</p>
<ol>
<li>for ${R.layOffWeeksInRow} or more <strong>consecutive</strong> weeks, or</li>
<li>for a series of ${R.layOffWeeksIn13} or more weeks within ${X.layOffSeriesWindowWeeks} weeks, of which no more than ${X.layOffMaxConsecutiveInSeries} were consecutive.</li>
</ol>
<p>In both cases the last week of the run or series must have ended no more than ${X.layOffClaimWithinWeeks} weeks before you serve a written “notice of intention to claim”. Weeks of lay-off and weeks of short time can be mixed. The usual conditions still apply: you must be an employee with two years’ continuous service.</p>

<h2>A timetable, step by step</h2>
<p>A machinist aged ${mAge} with ${mYears} years’ service, normally on ${h.gbp(mPay)} a week, is laid off without pay from ${h.date(layStart)}.</p>
${h.table(['Step', 'Rule', 'Date'], [
    [`${R.layOffWeeksInRow}th consecutive week of lay-off ends`, 'Section 148(2)(a)', h.date(fourthWeekEnds)],
    ['Latest day to serve notice of intention to claim', `Within ${X.layOffClaimWithinWeeks} weeks of that week`, h.date(claimBy)],
    ['Notice of intention served', 'In writing', h.date(served)],
    ['Employer’s counter-notice deadline', `${X.counterNoticeDays} days (section 149)`, h.date(counterBy)],
    ['Last day to resign with notice, if no counter-notice', `${X.layOffResignWindowWeeks} weeks after those ${X.counterNoticeDays} days (section 150)`, h.date(resignBy)],
  ], 'Dates computed from the lay-off start; weeks end on Saturday.', ['l', 'l', 'l'])}
<p>The relevant date for this claim is set by section 153: the end of the last of the weeks relied on, here ${h.date(fourthWeekEnds)}. That date fixes the age, the years and the weekly cap, which is ${h.gbp(redundancyCapOn(fourthWeekEnds))} for a 2026/27 date. The machinist’s ${h.num(mWeeks, 1)} weeks at ${h.gbp(Math.min(mPay, CAP_GB))} come to ${h.gbp(mAmount)}. There is no statutory notice extension of the kind that applies to a dismissal.</p>

<h2>The employer’s defence</h2>
<p>A counter-notice served within ${X.counterNoticeDays} days stops the payment unless an employment tribunal decides otherwise. The employer wins under ${h.src('red_era152', 'section 152')} only if, on the day your notice was served, it was reasonable to expect that within ${X.layOffResumeWithinWeeks} weeks you would start at least ${X.layOffResumeLastsWeeks} weeks of work with no lay-off or short time. The defence collapses if you are in fact laid off or on short time in each of the next ${X.layOffResumeWithinWeeks} weeks. The employer may also withdraw a counter-notice in writing; your ${X.layOffResignWindowWeeks}-week resignation window then starts from the withdrawal.</p>

<h2>Lay-off or dismissal?</h2>
<p>If the employer ends your contract instead, the ordinary rules apply: notice, the relevant date of section 145 and, with two years’ service, redundancy pay on dismissal. GOV.UK’s employer guide treats lay-offs and short time as tools to avoid redundancies (${h.src('red_govStaffRedundant', 'Making staff redundant')}), which is why they come with this exit route attached.</p>
`,
});
