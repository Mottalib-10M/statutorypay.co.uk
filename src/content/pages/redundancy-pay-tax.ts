import { definePage } from '../../lib/guide-types';
import { CAP_GB, P } from '../../lib/engine/params';
import { computeRedundancy } from '../../lib/engine/redundancy';
import { computeFinal } from '../../lib/engine/final';
import { formatMoney, formatPercent } from '../../lib/format';

const g = (n: number) => formatMoney(n);
const T = P.termination;
// A senior engineer's package, every figure through the engines.
const stat = computeRedundancy({ dob: '1971-03-03', start: '2006-05-15', noticeGiven: '2026-10-02', end: '2026-10-02', weeklyPay: 1050 });
const pkg = computeFinal({ statutoryRedundancy: stat.amount, extraRedundancy: 26000, noticeWeeks: stat.statutoryNoticeWeeks, weeklyPay: 1050, holidayDays: 6, daysPerWeek: 5, arrears: 0 });
// A smaller package that stays inside the threshold.
const small = computeFinal({ statutoryRedundancy: 6200, extraRedundancy: 4000, noticeWeeks: 6, weeklyPay: 520, holidayDays: 3, daysPerWeek: 5, arrears: 0 });
// Post-employment notice pay: unworked notice weeks valued at basic weekly pay.
const penpWeeks = 4;
const penpWeekly = 650;

export default definePage({
  id: 'redundancy-pay-tax',
  group: 'redundancy',
  order: 60,
  mini: 'redundancyTaxSplit',
  miniHref: 'final-pay-calculator',
  related: ['final-pay-calculator', 'payment-in-lieu-of-notice', 'voluntary-redundancy', 'holiday-pay-when-leaving', 'statutory-redundancy-pay'],
  sources: ['hmrcTermination', 'red_hmrcEim13530', 'red_hmrcEim13874', 'red_govTermTax', 'hmrcRates'],
  slug: 'redundancy-pay-tax',
  nav: 'Redundancy pay and tax',
  card: `Which parts of a leaving package fall under the ${g(T.taxFreeThreshold)} threshold and which are taxed like wages.`,
  title: `Redundancy Pay Tax 2026/27: the ${g(T.taxFreeThreshold)} Threshold Explained`,
  description: `Redundancy pay tax in 2026/27: the first ${g(T.taxFreeThreshold)} of redundancy payments is not taxed, notice and holiday pay are, and employers pay ${formatPercent(T.class1ARate, 0)} Class 1A above it.`,
  h1: `Redundancy pay and tax: what the ${g(T.taxFreeThreshold)} threshold covers`,
  intro: 'A leaving package mixes payments that are taxed like wages with payments that are taxed only above a threshold; the split is decided by what each payment is for, not by what it is called.',
  resume: `Under section 403 of the Income Tax (Earnings and Pensions) Act 2003, the first ${g(T.taxFreeThreshold)} of payments made because your employment ends is not taxed. Statutory redundancy pay, enhanced or ex gratia redundancy pay and non-cash leaving benefits are added together, along with any similar payments from the same or an associated employer, and only the part above ${g(T.taxFreeThreshold)} is taxed; the employer also pays Class 1A National Insurance at ${formatPercent(T.class1ARate, 0)} on that excess, and you pay no National Insurance on it. Everything that rewards work is outside the threshold and goes through PAYE like a normal payslip: notice pay, whether worked or paid in lieu, pay for gardening leave, holiday pay, unpaid wages and bonuses. Since 6 April 2018 a part of any severance equal to basic pay for unworked notice, called post-employment notice pay, is also taxed as earnings. The statutory redundancy payment itself, which cannot exceed ${g(P.redundancy.maxYears * 1.5 * CAP_GB)}, never carries tax on its own.`,
  faqs: [
    { q: `Do I pay National Insurance on redundancy pay above ${g(T.taxFreeThreshold)}?`, a: `The National Insurance charged on the redundancy element above the threshold is the employer’s Class 1A contribution, not a deduction from you; the excess is subject to income tax only. The employer pays Class 1A at ${formatPercent(T.class1ARate, 0)} on the amount above ${g(T.taxFreeThreshold)}, reported through payroll in the tax year of payment. Notice pay and holiday pay are different: both carry employee and employer Class 1 contributions like wages.` },
    { q: 'Why was emergency tax taken from my redundancy payment?', a: 'Usually because the taxable part was paid after your P45 was issued. HMRC tells employers to use the 0T code on anything paid after the P45, which assumes your personal allowance is already used. If too much was deducted, the excess comes back through your next employer’s payroll, a refund claim or your Self Assessment return.' },
    { q: 'Is pay in lieu of notice tax-free if my contract does not mention it?', a: 'No. Since April 2018 every payment in lieu of notice is taxed as earnings, whether or not the contract has a PILON clause. Where no PILON is paid but the notice is not worked, the employer must still work out post-employment notice pay and tax that slice of any severance, as HMRC explains at EIM13874.' },
    { q: 'Can my employer pay part of my redundancy into my pension to avoid tax?', a: 'Yes, if you agree. Employer contributions into a registered pension scheme as part of a settlement are not taxed as a termination payment, according to GOV.UK, though any amount above your annual allowance is taxed under the pension rules. The money is then locked in the pension until you can draw it, so it suits people who do not need the cash now.' },
    { q: `Two employers in the same group are making me redundant. Do I get two ${g(T.taxFreeThreshold)} thresholds?`, a: 'No. HMRC adds together payments from the same employer and from associated employers before applying the threshold, so one threshold covers the lot. Its own example is a director paid £25,000 by each of two associated companies: £50,000 in total, of which £20,000 is taxable (EIM13530).' },
  ],
  body: (h) => `
<h2>Three kinds of money in one payslip</h2>
<p>HMRC sorts a leaving package by its purpose. Payments that reward work done or notice owed are <strong>earnings</strong>. Payments made because the job has ended are <strong>termination awards</strong>, taxed only above the threshold. A few payments are <strong>outside both</strong>.</p>
${h.table(['Payment', 'How it is treated', 'Under the threshold?'], [
    ['Statutory redundancy pay', 'Termination award', 'Yes'],
    ['Enhanced, contractual or ex gratia redundancy pay', 'Termination award, minus any post-employment notice pay', 'Yes'],
    ['Company car or laptop you keep', 'Termination award at its value', 'Yes'],
    ['Notice pay, worked or paid in lieu', 'Earnings', 'No'],
    ['Gardening leave pay', 'Earnings', 'No'],
    ['Holiday pay for untaken leave', 'Earnings', 'No'],
    ['Unpaid wages, bonus, commission', 'Earnings', 'No'],
    ['Payment for a restrictive covenant', 'Earnings', 'No'],
    ['Employer pension contribution to a registered scheme', 'Not taxed as a termination payment', 'Not needed'],
    ['Your legal costs paid directly to your solicitor', 'Not taxed', 'Not needed'],
  ], 'Classification from GOV.UK, Tax on termination payments, and HMRC’s Employment Income Manual.', ['l', 'l', 'l'])}

<h2>How the threshold is applied</h2>
<p>The ${h.gbp(T.taxFreeThreshold)} is not an allowance per payment. HMRC first adds up every termination award paid to you in connection with the job, including from associated employers (${h.src('red_hmrcEim13530', 'EIM13530')}), then exempts the first ${h.gbp(T.taxFreeThreshold)} of the total (${h.src('hmrcTermination', 'EIM13505')}). Statutory redundancy pay counts towards that total, but on its own it can never reach the threshold: even the largest statutory payment is well below it.</p>
<p>Above the threshold, the excess is added to your income for the year and taxed at your marginal rate. The employer adds Class 1A National Insurance of ${h.pct(T.class1ARate, 0)} on that excess, a cost to the employer that does not appear on your payslip (${h.src('hmrcRates', 'HMRC rates and thresholds 2026 to 2027')}).</p>

<h2>A package split, step by step</h2>
<p>An engineer aged 55, employed since ${h.date('2006-05-15')} on ${h.gbp(1050)} a week, is made redundant with pay in lieu of ${stat.statutoryNoticeWeeks} weeks’ notice, a statutory payment of ${h.gbp(stat.amount)} (capped at ${h.gbp(stat.cap)} a week), an enhanced redundancy payment of ${h.gbp(26000)} and six days of untaken holiday.</p>
${h.table(['Element', 'Amount', 'Treatment'], [
    ['Statutory redundancy pay', h.gbp(stat.amount), 'Inside the threshold'],
    ['Enhanced redundancy pay', h.gbp(26000), 'Inside, then above the threshold'],
    ['Pay in lieu of notice', h.gbp(pkg.notice), 'Earnings'],
    ['Holiday pay', h.gbp(pkg.holiday), 'Earnings'],
    ['<strong>Redundancy pay inside the threshold</strong>', `<strong>${h.gbp(pkg.withinThreshold)}</strong>`, 'Not taxed'],
    ['<strong>Redundancy pay above the threshold</strong>', `<strong>${h.gbp(pkg.aboveThreshold)}</strong>`, `Taxed; employer Class 1A ${h.gbp(pkg.aboveThreshold * T.class1ARate)}`],
    ['<strong>Earnings through PAYE</strong>', `<strong>${h.gbp(pkg.earnings)}</strong>`, 'Taxed and Class 1 NIC'],
  ], 'Gross amounts computed with the site’s final pay engine. Income tax itself is not calculated here.', ['l', 'r', 'l'])}
<p>Because the notice was paid in lieu, it is already taxed as earnings, and no further post-employment notice pay comes out of the enhanced payment. Of the ${h.gbp(pkg.total)} in total, ${h.gbp(pkg.withinThreshold)} reaches the engineer without deductions.</p>
<p>A smaller case for comparison: statutory pay of ${h.gbp(6200)}, a goodwill payment of ${h.gbp(4000)}, six weeks’ notice at ${h.gbp(520)} and three days’ holiday. The ${h.gbp(small.redundancy)} of redundancy pay sits entirely inside the threshold; the ${h.gbp(small.earnings)} of notice and holiday pay is taxed like any wage.</p>

<h2>Post-employment notice pay</h2>
<p>Before April 2018 an employer could leave notice unworked, pay nothing labelled “notice”, and fold the money into a larger tax-free severance. The rules in sections 402A to 402E of the 2003 Act closed that route (${h.src('red_hmrcEim13874', 'EIM13874')}). When notice is not worked in full, the employer must work out the basic pay you would have earned in the unworked part. That amount, post-employment notice pay, is taken out of any severance or enhanced payment and taxed as earnings. If ${penpWeeks} weeks of notice at ${h.gbp(penpWeekly)} a week go unworked and nothing is paid in lieu, ${h.gbp(penpWeeks * penpWeekly)} of the severance becomes taxable pay.</p>
<p>The rule never touches statutory redundancy pay. Where the post-employment notice pay is larger than the severance itself, only the severance actually paid is taxed, as ${h.src('red_govTermTax', 'GOV.UK’s own examples')} show.</p>

<h2>Payslip checks</h2>
<ul>
<li>The redundancy elements should appear separately from salary, notice and holiday pay.</li>
<li>No employee National Insurance should come off the redundancy elements.</li>
<li>If the money was paid after your P45, tax will have been taken at the 0T code; any overpayment is recoverable.</li>
<li>If you file a Self Assessment return, the termination payment goes in the additional information pages.</li>
</ul>
<p>To total the gross figures before tax, the ${h.a('final-pay-calculator', 'final pay calculator')} adds redundancy, notice and holiday pay and shows the same split. How notice pay itself is worked out is covered under ${h.a('payment-in-lieu-of-notice', 'payment in lieu of notice')}.</p>
`,
});
