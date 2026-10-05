import { definePage } from '../../lib/guide-types';
import { CAP_GB, P } from '../../lib/engine/params';
import { statutoryNoticeWeeks, noticeEnd } from '../../lib/engine/notice';
import { formatMoney, formatPercent } from '../../lib/format';

const g = (n: number, d = 0) => formatMoney(n, d);
const share = P.redundancy.jobSearchPayCapShareOfWeek;
const pctTxt = formatPercent(share, 0);
// GOV.UK's example: 5-day week, 4 days off in the notice period.
const govDays = 4;
const govDpw = 5;
const govPaidDays = Math.min(govDays, share * govDpw);
// A part-timer paid by the hour: 22.5 hours over three days, £420 a week.
const ptPay = 420;
const ptHours = 22.5;
const ptRate = ptPay / ptHours;
const ptCap = share * ptPay;
// The two-year test is met on the later of the notice expiry and the statutory notice expiry.
const start = '2024-11-16';
const told = '2026-10-05';
const statWeeks = statutoryNoticeWeeks(start, told);
const contractEnd = '2026-11-30';
const statEnd = noticeEnd(told, statWeeks);
// A high earner: the redundancy cap does not limit this payment.
const high = 1300;

export default definePage({
  id: 'redundancy-time-off-job-hunting',
  group: 'redundancy',
  order: 100,
  mini: 'jobSearchTimeOff',
  miniHref: 'notice-period-calculator',
  related: ['statutory-notice-period', 'redundancy-consultation', 'suitable-alternative-employment', 'notice-period-calculator', 'statutory-redundancy-pay'],
  sources: ['red_era52', 'red_era53', 'govRedundancy', 'red_acasJobSearch', 'era86'],
  slug: 'redundancy-time-off-job-hunting',
  nav: 'Time off to look for work',
  card: 'Paid time off during redundancy notice for interviews and training, and the 40% limit.',
  title: `Time Off to Look for Work in Redundancy 2026: the ${pctTxt} Rule`,
  description: `Time off to look for work in redundancy notice, 2026: reasonable time off after two years’ service, but only ${pctTxt} of a week’s pay must be paid in total.`,
  h1: 'Time off to look for work during redundancy notice',
  intro: 'Once you have been given notice of redundancy you can leave work for interviews and training, but the law only guarantees a small part of that time as paid.',
  resume: `An employee under notice of dismissal for redundancy is entitled to reasonable time off during working hours to look for a new job or to arrange training for one, under section 52 of the Employment Rights Act 1996. The condition is two years of continuous employment, measured on the day the notice ends or, if later, the day statutory minimum notice would have ended. How much time is reasonable depends on the circumstances, such as how hard work will be to find and how long the notice is. The pay is limited: under section 53, the employer owes the hourly rate for the hours taken, but never more than ${pctTxt} of one week’s pay across the whole notice period. GOV.UK’s example is someone on a five-day week who takes four days off during their notice: the employer has to pay for only the first two. That ${pctTxt} is worked out on your real weekly pay, without the ${g(CAP_GB)} cap used for redundancy pay, and a contract can pay more.`,
  faqs: [
    { q: 'Do I get paid for job interviews during my redundancy notice?', a: `Yes, up to a limit. Section 53 pays the time at your hourly rate, but the total the employer must pay for the whole notice period is ${pctTxt} of one week’s pay. On a five-day week that is two days’ pay, however many interviews you attend. Any time beyond that is unpaid by law unless your contract or the employer’s policy is more generous.` },
    { q: 'Can my employer refuse time off to go to an interview?', a: 'Only on reasonable grounds, Acas says, for example a request at a time the business genuinely cannot cover. If the employer refuses unreasonably, section 53(4) entitles you to the pay you would have received for the time off had it been allowed. It helps to agree in advance how much time you need and when.' },
    { q: 'Is the 40% limit per week or for the whole notice?', a: `For the whole notice period. Section 53(5) caps the employer’s liability “in respect of the notice period” at ${pctTxt} of a week’s pay. Acas’s example is Robyn, on ${g(500)} for a five-day week, who takes five days off during a twelve-week notice: Robyn is paid ${g(500 * share)}, the equivalent of two days.` },
    { q: 'Does time off to arrange retraining count as well as interviews?', a: 'Yes. Section 52(1) covers looking for new employment and making arrangements for training for future employment. Visiting a college, meeting a training provider or a careers adviser all fall within it, subject to the same reasonableness test and the same pay limit.' },
  ],
  body: (h) => `
<h2>Who qualifies</h2>
<p>The right in ${h.src('red_era52', 'section 52')} belongs to employees who have been given notice of dismissal because of redundancy. It does not cover workers who are not employees, people resigning for other reasons, or anyone whose contract ended with immediate effect. The service condition looks forward: you must have, or would have, two years of continuous employment on the later of two days, the day your notice is due to expire and the day statutory minimum notice would expire.</p>
<p>Example: someone who started on ${h.date(start)} is told on ${h.date(told)} that their job is going, with notice to ${h.date(contractEnd)}. On the day they are told they have under two years; statutory notice would be ${statWeeks} week${statWeeks === 1 ? '' : 's'}, ending on ${h.date(statEnd)}. They complete two years on ${h.date('2026-11-15')}, before the contractual notice ends, so they qualify for paid time off from the first day of notice.</p>

<h2>How much time is reasonable</h2>
<p>The Act gives no number of hours. Acas lists what weighs in the balance: how difficult it will be for you to find work, and the length of your notice period (${h.src('red_acasJobSearch', 'Acas, Finding a job with a new employer')}). A specialist in a shrinking trade may reasonably need more time than someone whose skills are in demand. The request should be made during the notice period, and the employer can say no only on reasonable grounds. The time is taken during your working hours, which section 52(3) defines as any time your contract requires you to be at work.</p>

<h2>How the pay is worked out</h2>
<p>${h.src('red_era53', 'Section 53')} pays the time off at the “appropriate hourly rate”: one week’s pay divided by your normal weekly hours under the contract in force on the day notice was given. If your hours vary, the divisor is the average of normal hours over the twelve weeks ending with the last complete week before that day. Then comes the limit: whatever time you take, the employer’s liability for the whole notice is at most ${h.pct(share, 0)} of a week’s pay.</p>
${h.table(['Case', 'Week’s pay', 'Hourly rate', `Most the law pays (${h.pct(share, 0)})`, 'Equivalent'], [
    [`GOV.UK: ${govDpw}-day week, ${govDays} days off`, 'Any', 'Any', `${h.pct(share, 0)} of a week`, `${h.num(govPaidDays, 0)} of ${govDays} days paid`],
    ['Acas: Robyn, 5 days off in 12 weeks', h.gbp(500), '', h.gbp(500 * share), '2 of 5 days paid'],
    [`Part-timer, ${h.num(ptHours, 1)} hours over 3 days`, h.gbp(ptPay), h.gbp(ptRate, 2), h.gbp(ptCap, 2), `${h.num(ptCap / ptRate, 1)} hours`],
    ['Senior manager, 5-day week', h.gbp(high), '', h.gbp(high * share), '2 days'],
  ], 'Limits under section 53(5), computed from each week’s pay.', ['l', 'r', 'r', 'r', 'r'])}
<p>The last line matters. The ${h.gbp(CAP_GB)} limit on a week’s pay in section 227 applies to redundancy payments and certain tribunal awards; time off under section 53 is not on its list. The ${h.pct(share, 0)} is therefore taken from your actual week’s pay: ${h.gbp(high * share)} for the manager on ${h.gbp(high)}, not ${h.gbp(CAP_GB * share, 2)}.</p>

<h3>Hours, not just days</h3>
<p>The limit is a sum of money, so it can be used in hours. The part-timer in the table earns ${h.gbp(ptRate, 2)} an hour and reaches the ${h.gbp(ptCap, 2)} ceiling after ${h.num(ptCap / ptRate, 0)} hours: three interviews of three hours each, including travel, would use it up. A fourth would be unpaid unless the contract or the employer’s policy pays more. Keeping a note of the dates and hours taken makes any dispute easy to settle, because the payment is owed for the notice period as a whole rather than week by week.</p>

<h3>Contract pay and statutory pay do not stack</h3>
<p>If your contract keeps paying full salary for the hours you are away, that contractual pay counts towards the statutory amount, and vice versa (section 53(6) and (7)). Most salaried employees therefore see no deduction at all for a few interviews. The statutory rule matters when the employer docks pay for absence, or for hourly-paid staff.</p>

<h2>If the employer says no</h2>
<p>An unreasonable refusal does not leave you empty-handed. Section 53(4) gives you the amount you would have been paid had the time off been allowed, within the same ${h.pct(share, 0)} ceiling, and an employment tribunal can order it. Keep the request and the refusal in writing.</p>

<h2>Help that is free during notice</h2>
<p>${h.src('govRedundancy', 'GOV.UK')} points employees under notice to the Jobcentre Plus Rapid Response Service in England, which helps with CVs, job search, training and some costs such as travel or childcare; it can be contacted during notice and up to 13 weeks after the job ends. Help with the cost of vocational training is only considered while you are still in your notice period, which is a reason to contact the service early rather than after your last day. Scotland has its own service, Partnership Action for Continuing Employment, and Wales has ReAct+. Meanwhile your notice itself is worth checking: the ${h.a('notice-period-calculator', 'notice period calculator')} gives the statutory minimum from your start date.</p>
`,
});
