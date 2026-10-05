import { definePage } from '../../lib/guide-types';
import { P } from '../../lib/engine/params';
import { computeNotice } from '../../lib/engine/notice';
import { computeRedundancy } from '../../lib/engine/redundancy';
import { computeFinal } from '../../lib/engine/final';
import { displayDate, formatMoney } from '../../lib/format';

const d = (iso: string) => displayDate(iso, 'en-GB');
const g = (n: number) => formatMoney(n);
const T = P.termination.taxFreeThreshold;
const PENP = P.leavingExtra.penpFrom;
// Ten years of service, an eight-week clause: the statute decides the weeks paid in lieu.
const pilon = computeNotice({ start: '2016-05-03', noticeGiven: '2026-11-13', contractualWeeks: 8, weeklyPay: 700 });
const perks = computeFinal({ statutoryRedundancy: 0, extraRedundancy: 0, noticeWeeks: pilon.appliedWeeks, weeklyPay: 38, holidayDays: 0, daysPerWeek: 5, arrears: 0 });
// Just short of two years: paid in lieu on 13 November 2026, the statutory week carries service past the second anniversary.
const shortCase = computeRedundancy({ dob: '1990-04-01', start: '2024-11-20', noticeGiven: '2026-11-13', end: '2026-11-13', weeklyPay: 560 });
// A package where redundancy pay alone is under the threshold and notice pay is on top.
const pack = computeFinal({ statutoryRedundancy: 9000, extraRedundancy: 18000, noticeWeeks: pilon.appliedWeeks, weeklyPay: 700, holidayDays: 0, daysPerWeek: 5, arrears: 0 });

export default definePage({
  id: 'payment-in-lieu-of-notice',
  group: 'leaving',
  order: 30,
  mini: 'pilonValue',
  miniHref: 'final-pay-calculator',
  related: ['redundancy-relevant-date', 'final-pay-calculator', 'statutory-notice-period', 'redundancy-pay-tax', 'notice-period-calculator'],
  sources: ['govRedundancy', 'govNoticeResign', 'hmrcTermination', 'lv_eim12975', 'era145', 'nidNotice'],
  slug: 'payment-in-lieu-of-notice',
  nav: 'Pay in lieu of notice (PILON)',
  card: 'With or without a PILON clause, what the payment covers, how it is taxed and the date it moves.',
  title: `Payment in Lieu of Notice 2026: PILON Tax and What It Covers`,
  description: `Payment in lieu of notice in 2026: when a PILON clause applies, what it covers, why the ${g(T)} threshold never covers it and how it shifts the redundancy date.`,
  h1: 'Payment in lieu of notice (PILON)',
  intro: 'Your employer ends the job today and pays the notice period instead of letting you work it: what that payment has to contain, and what it changes.',
  resume: `Payment in lieu of notice, often shortened to PILON, is a sum an employer pays so that employment can end immediately instead of at the end of a notice period. An employer can do this without breaking the contract only when the contract contains a PILON clause or you agree; otherwise ending the job early is a breach, and the payment is in substance damages. GOV.UK says you should get all the basic pay you would have earned during the notice, plus contractual extras such as pension contributions or private health cover when the contract provides them. The notice length is the longer of your contract and the statutory scale of ${P.notice.underTwoYearsWeeks} to ${P.notice.maxWeeks} weeks. Since ${d(PENP)} the basic pay for unworked notice is taxed as earnings under HMRC’s post-employment notice pay rules, whether or not there is a clause, and the ${g(T)} tax-free threshold for termination payments does not cover it. For redundancy pay, a PILON pushes the date used for service and age to the end of the statutory notice.`,
  faqs: [
    { q: 'My contract has no PILON clause. Can my employer still pay me off and tell me to leave today?', a: 'In practice yes, but it is then a breach of contract and the payment stands in for the damages you could claim. GOV.UK says you only get pay in lieu if it is in your contract or you agree; if you do not agree, you can work out your notice. If you accept, you should still receive full pay and the contractual extras.' },
    { q: 'Is a payment in lieu of notice the same as garden leave?', a: 'No. On garden leave you have been given proper notice and stay employed until it ends, at home, with your normal pay and benefits; your employer can call you back to work. With a PILON the employment ends on the day you are told and the notice is paid as a lump sum. HMRC treats garden leave pay as ordinary salary.' },
    { q: 'Can my PILON be tax-free if it is paid with my redundancy money?', a: `No. Since ${d(PENP)}, HMRC treats the basic pay for any notice not worked as post-employment notice pay, taxed in full as earnings, whatever the contract says. The ${g(T)} threshold only applies to the rest of a termination award, such as statutory and enhanced redundancy pay. Older guidance saying otherwise predates that change.` },
    { q: 'Does a payment in lieu include commission and my company car?', a: 'It should cover what you would have earned during the notice. nidirect lists basic pay plus commission and compensation for benefits such as a company car, phone or medical insurance; GOV.UK mentions pension contributions and health cover where the contract includes them. Instead of paying for a benefit, an employer can let you keep using it until the notice would have ended.' },
    { q: 'Does pay in lieu of notice change when my redundancy pay is counted?', a: `Yes. Section 145(5) treats the end of the statutory minimum notice as the relevant date for counting service and age. Someone who started on ${d('2024-11-20')} and is paid in lieu on ${d('2026-11-13')} reaches ${shortCase.completeYears} complete years on ${d(shortCase.extendedDate)} and ${shortCase.eligible ? `qualifies for ${g(shortCase.amount)}` : 'still does not qualify'}.` },
  ],
  body: (h) => `
<h2>Clause, agreement or breach</h2>
<p>Whether a PILON is lawful depends on the paperwork, not on the amount. Three situations cover nearly every case.</p>
<ol>
<li><strong>The contract has a PILON clause.</strong> The employer may end the job at once and pay the notice instead. That is performance of the contract, not a breach. The clause usually says what is paid; if it only mentions “basic salary”, extras may be left out.</li>
<li><strong>No clause, but you agree.</strong> GOV.UK says your employer may still offer a payment in lieu even if your contract does not mention it, and that if you accept you should receive full pay and any contractual extras. Get the offer in writing.</li>
<li><strong>No clause and no agreement.</strong> Sending you home without notice is a breach of contract. What you can claim is damages for the lost notice: in most cases the pay and benefits you would have had. nidirect notes that some employers pay a sum simply to cover that potential claim.</li>
</ol>
<p>Section 86(3) of the Employment Rights Act 1996 confirms that the statutory notice rules do not stop either party from accepting a payment in lieu. The weeks you are paid for are those of your notice entitlement: the contract figure or the statutory one, whichever is longer, as worked out in the ${h.a('statutory-notice-period', 'statutory notice guide')}.</p>

<h2>What the payment should contain</h2>
<p>Take someone with ten years of service and an eight-week clause, paid in lieu on ${h.date('2026-11-13')}. The statute gives ${pilon.statutoryWeeks} weeks, more than the clause, so ${pilon.appliedWeeks} weeks are due. At ${h.gbp(700)} a week basic, plus ${h.gbp(38)} a week of employer pension contributions under the contract:</p>
${h.table(['Element', 'Basis', 'Amount'], [
    ['Basic pay', `${pilon.appliedWeeks} weeks × ${h.gbp(700)}`, h.gbp(pilon.noticePay)],
    ['Contractual pension contributions', `${pilon.appliedWeeks} weeks × ${h.gbp(38)}`, h.gbp(perks.notice)],
    ['Total payment in lieu', '', `<strong>${h.gbp(pilon.noticePay + perks.notice)}</strong>`],
  ], 'Gross amounts, computed with the site’s notice and final pay engines.', ['l', 'l', 'r'])}
<p>If your pay varies, a week’s pay for notice is the average over the ${P.redundancy.averagingWeeks} weeks before notice starts (GOV.UK), including commission and regular overtime; ${h.a('weeks-pay-explained', 'a week’s pay explained')} sets out the rules. Holiday accrued up to the termination date is paid separately under the Working Time Regulations, and with a PILON that date is the day you leave, so no further holiday builds up during the weeks you are paid for. On garden leave it does, because you are still employed.</p>

<h2>Tax: post-employment notice pay</h2>
<p>From ${h.date(PENP)} the tax rules stopped caring whether there was a clause. HMRC’s manual (${h.src('hmrcTermination', 'EIM13505')}) says the ${h.gbp(T)} threshold does not apply to post-employment notice pay, which is the basic pay for the part of the notice you did not work. It goes through payroll and is taxed like salary. Only what is left of a termination award after that slice, typically statutory and enhanced redundancy pay, can use the threshold.</p>
<p>With the ten-year example, a package of ${h.gbp(9000)} statutory redundancy pay and ${h.gbp(18000)} enhancement keeps all ${h.gbp(pack.withinThreshold)} of redundancy money inside the threshold, while the ${h.gbp(pack.notice)} of notice pay is taxed in full. Some older pages, including nidirect’s notice pay article, still describe the earlier position, where a non-contractual PILON could fall under the threshold; HMRC’s current manual is the reference. The page on ${h.a('redundancy-pay-tax', 'redundancy pay and tax')} covers the threshold itself.</p>

<h2>The knock-on effect on redundancy pay</h2>
<p>A PILON ends employment early, but section 145(5) stops that from costing you service. When the employer gives less than the statutory minimum notice, the relevant date for counting years and age becomes the day the statutory notice would have ended. In the example from the questions above, the employee is ${shortCase.statutoryNoticeWeeks} week short of two years on the day of the PILON; the extended date of ${h.date(shortCase.extendedDate)} gives ${shortCase.completeYears} complete years and ${shortCase.eligible ? `a statutory payment of ${h.gbp(shortCase.amount)}` : 'no payment'}. The weekly cap, however, is the one in force on the real termination date. The ${h.a('redundancy-relevant-date', 'relevant date guide')} works through more cases, and the ${h.a('final-pay-calculator', 'final pay calculator')} adds notice, redundancy and holiday together.</p>
`,
});
