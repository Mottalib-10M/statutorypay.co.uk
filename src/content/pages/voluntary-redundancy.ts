import { definePage } from '../../lib/guide-types';
import { CAP_GB, P } from '../../lib/engine/params';
import { computeRedundancy } from '../../lib/engine/redundancy';
import { computeFinal } from '../../lib/engine/final';
import { formatMoney } from '../../lib/format';

const g = (n: number) => formatMoney(n);
const R = P.redundancy;
// A volunteer aged 52 with 18 years on £1,100 a week; offers compared with the statutory floor.
const pay = 1100;
const v = computeRedundancy({ dob: '1974-02-11', start: '2008-03-03', noticeGiven: '2026-11-02', end: '2027-01-25', weeklyPay: pay });
const offers = [
  { name: 'Statutory only', amount: v.amount },
  { name: 'Statutory weeks, cap removed', amount: v.weeks * pay },
  { name: 'Twice the statutory weeks, cap removed', amount: 2 * v.weeks * pay },
  { name: 'Four weeks’ pay per complete year', amount: 4 * v.completeYears * pay },
];
const best = offers[offers.length - 1].amount;
const split = computeFinal({ statutoryRedundancy: v.amount, extraRedundancy: best - v.amount, noticeWeeks: 0, weeklyPay: pay, holidayDays: 0, daysPerWeek: 5, arrears: 0 });

export default definePage({
  id: 'voluntary-redundancy',
  group: 'redundancy',
  order: 70,
  mini: 'voluntaryOffer',
  related: ['statutory-redundancy-pay', 'redundancy-pay-tax', 'redundancy-consultation', 'redundancy-pay-calculator', 'final-pay-calculator'],
  sources: ['red_acasVoluntary', 'red_acasSettlement', 'govRedundancy', 'red_govStaffRedundant', 'era162'],
  slug: 'voluntary-redundancy',
  nav: 'Voluntary redundancy',
  card: 'Volunteering, the legal floor under any offer, and how to compare enhanced terms.',
  title: `Voluntary Redundancy 2026: Offers, the Statutory Floor, Tax`,
  description: `Voluntary redundancy in 2026: the employer chooses who goes, statutory pay (cap ${g(CAP_GB)} a week) is still the floor, and a settlement needs independent advice.`,
  h1: 'Voluntary redundancy: volunteering, offers and the legal minimum',
  intro: 'Putting your hand up does not change what the law guarantees; it changes what you can negotiate on top.',
  resume: `Voluntary redundancy means putting yourself forward, or answering your employer’s call for volunteers, before anyone is selected. It is still a dismissal by reason of redundancy, so with two years’ continuous service the statutory payment is owed exactly as for a compulsory redundancy: half a week, one week or one and a half weeks’ pay per complete year depending on age, up to ${R.maxYears} years, on a week’s pay capped at ${g(CAP_GB)}. The employer does not have to accept a volunteer, and it may not limit the scheme to an age group. What volunteering usually buys is an enhanced package: a multiple of the statutory weeks, the cap lifted, a lump sum, or pension terms. Any enhancement must at least match the statutory figure, shares the ${g(P.termination.taxFreeThreshold)} tax threshold with it, and is often paid under a settlement agreement, which only binds you if you have taken advice from a named, insured, independent adviser. Early retirement is a different route and does not carry statutory redundancy pay.`,
  faqs: [
    { q: 'Does my employer have to accept me if I volunteer for redundancy?', a: 'No. Acas is clear that the employer weighs the needs of the business and may keep a volunteer whose skills it needs. It does not have to open voluntary redundancy to everyone either, but refusing a volunteer because of age, sex, disability or another protected characteristic can be discrimination. Put your request in writing and follow any voluntary redundancy policy.' },
    { q: 'Do I get statutory redundancy pay if I volunteered?', a: `Yes, provided the employer dismisses you because the job is going and you have two complete years of service. Volunteering decides who is dismissed, not why. Make sure the paperwork records a dismissal for redundancy: a resignation, even a negotiated one, carries no statutory right. The floor is the same ${g(CAP_GB)}-capped statutory amount as for compulsory redundancy.` },
    { q: 'Is early retirement the same thing as voluntary redundancy?', a: 'No. GOV.UK’s employer guide treats early retirement as an alternative: an incentive to retire, offered across the workforce, never forced on anyone. Employees who opt for early retirement do not qualify for a statutory redundancy payment. A voluntary redundancy package can include early retirement terms, but only as one option within a scheme open to all.' },
    { q: 'Why does a voluntary redundancy deal need a solicitor to sign it off?', a: 'When the package is paid under a settlement agreement, Acas lists the conditions for it to be legally valid: it must be in writing, relate to particular complaints or claims, and you must have received advice from a relevant independent adviser who carries insurance and is named in the agreement. It must state those conditions are met and list the claims it settles.' },
    { q: 'Can voluntary redundancy be offered only to staff over 50?', a: 'Not as a stand-alone scheme. GOV.UK warns that offering voluntary redundancy only to the age groups eligible for an early retirement package could be unlawful age discrimination. An early retirement option for certain ages may sit inside a voluntary redundancy offer that is open to every employee in the affected group.' },
  ],
  body: (h) => `
<h2>How volunteering works</h2>
<p>An employer that expects to cut jobs will often ask for volunteers first, because it reduces compulsory dismissals and the disputes they bring. You can also volunteer without being asked, ideally in writing (${h.src('red_acasVoluntary', 'Acas')}). The employer then picks from the volunteers using its own business needs: a volunteer in a team that is not shrinking, or with skills the business wants to keep, can be turned down. GOV.UK’s employer guide adds that the selection among volunteers must be fair and transparent, and that volunteers should be told they will not be chosen automatically (${h.src('red_govStaffRedundant', 'Making staff redundant')}).</p>
<p>Volunteers still count. Where 20 or more redundancies are proposed at one establishment, the people who volunteer are included in the number that triggers collective consultation, so a scheme does not escape the ${h.a('redundancy-consultation', 'consultation rules')} by filling its quota with volunteers.</p>

<h2>The floor that cannot be negotiated away</h2>
<p>Whatever is offered, the statutory amount is the minimum for anyone with two years’ service who is dismissed for redundancy. A package described as “generous” can still fall short if it is a flat sum and you have long service at an older age. Work out the statutory figure first with the ${h.a('redundancy-pay-calculator', 'calculator')}, then compare.</p>
<p>The same goes for notice. A volunteer is dismissed, so statutory notice of up to ${P.notice.maxWeeks} weeks, or pay in lieu, is due on top of the redundancy payment unless the contract gives more. Holiday accrued and not taken is paid as well.</p>

<h2>Comparing enhanced offers</h2>
<p>Enhanced schemes usually take the statutory formula and improve one or more of its three limits: the weekly cap, the multiplier per year, or the ${R.maxYears}-year count. Some ignore it and pay a set number of weeks per year. The table compares common shapes for a volunteer aged ${v.ageAtRelevantDate} with ${v.completeYears} complete years on ${h.gbp(pay)} a week.</p>
${h.table(['Offer', 'Amount', 'Above statutory'], offers.map((o) => [o.name, h.gbp(o.amount), h.gbp(o.amount - v.amount)]),
    `Statutory weeks (${h.num(v.weeks, 1)}) from the site’s redundancy engine; weekly pay ${h.gbp(pay)} against a ${h.gbp(v.cap)} cap.`, ['l', 'r', 'r'])}
<p>Lifting the cap matters most to higher earners: at ${h.gbp(pay)} a week it adds ${h.gbp(v.weeks * (pay - v.cap))} before any multiplier. For someone on ${h.gbp(500)} a week, removing the cap adds nothing and only the multiplier helps.</p>

<h3>What else to put in the comparison</h3>
<ul>
<li><strong>Notice:</strong> is it worked, paid in lieu, or folded into the lump sum? Pay in lieu is taxed as earnings either way.</li>
<li><strong>Pension:</strong> an employer contribution into a registered scheme is not taxed as a termination payment, within your annual allowance.</li>
<li><strong>Timing:</strong> a later last day may move you past a birthday at 41, an anniversary of your start date, or the April uprating of the cap.</li>
<li><strong>Conditions:</strong> confidentiality, references, and the claims you give up.</li>
</ul>

<h2>Tax on a bigger package</h2>
<p>Statutory and enhanced redundancy pay share one ${h.gbp(P.termination.taxFreeThreshold)} threshold. In the four-weeks-per-year offer above, ${h.gbp(split.withinThreshold)} falls inside it and ${h.gbp(split.aboveThreshold)} is taxed as income, with Class 1A National Insurance paid by the employer on that excess. If the notice is not worked and not paid in lieu, part of the enhanced sum is reclassified as post-employment notice pay and taxed like salary. ${h.a('redundancy-pay-tax', 'Redundancy pay and tax')} sets out the split.</p>

<h2>Settlement agreements</h2>
<p>Many voluntary packages are paid under a settlement agreement, in which you agree not to bring specified tribunal claims in exchange for the money. Acas sets out the conditions for one to be legally valid (${h.src('red_acasSettlement', 'Acas, Settlement agreements')}):</p>
<ul>
<li>it is in writing;</li>
<li>it relates to a particular complaint or proceedings;</li>
<li>you have received advice from a relevant independent adviser on its terms and effect;</li>
<li>the adviser is insured and is named in the agreement;</li>
<li>it states that these conditions are satisfied and names the claims it covers.</li>
</ul>
<p>A clause settling “all claims” in general terms does not meet the test. Before you sign, check that the statutory redundancy amount, notice and holiday pay are identified, and that the payment date is stated.</p>

<h2>If the offer is withdrawn or you are not chosen</h2>
<p>If your application is turned down you remain employed and may still be selected compulsorily later; the normal rules on fair selection, consultation, ${h.a('suitable-alternative-employment', 'alternative jobs')} and time limits then apply. If you are chosen, you have ${R.claimMonths} months from the relevant date to claim any statutory redundancy pay that is not paid.</p>
`,
});
