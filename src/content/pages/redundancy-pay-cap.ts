import { definePage } from '../../lib/guide-types';
import { CAP_GB, CAP_NI, MAX_REDUNDANCY_GB, MAX_REDUNDANCY_NI, P, redundancyCapOn } from '../../lib/engine/params';
import { computeRedundancy, reckonerWeeks } from '../../lib/engine/redundancy';
import { formatMoney } from '../../lib/format';

const g = (n: number) => formatMoney(n);
const R = P.redundancy;
const topWeeks = R.maxYears * R.bands[0].weeks;
const prevGB = R.weeklyCapGB[R.weeklyCapGB.length - 2].cap;
const prevNI = R.weeklyCapNI[R.weeklyCapNI.length - 2].cap;
// Two colleagues, same career, one day apart (engine-computed).
const base = { dob: '1972-08-19', start: '2008-01-07', weeklyPay: 1150 };
const sat = computeRedundancy({ ...base, noticeGiven: '2026-01-09', end: '2026-04-05' });
const mon = computeRedundancy({ ...base, noticeGiven: '2026-01-12', end: '2026-04-06' });
// Paid in lieu in March: service is extended past 6 April, the cap is not.
const pilon = computeRedundancy({ dob: '1981-11-02', start: '2019-06-03', noticeGiven: '2026-03-20', end: '2026-03-20', weeklyPay: 900 });
// A below-cap earner is untouched by the uprating.
const lowWeeks = reckonerWeeks(35, 10);

export default definePage({
  id: 'redundancy-pay-cap',
  group: 'redundancy',
  order: 40,
  mini: 'redundancyCap',
  related: ['redundancy-pay-calculator', 'redundancy-relevant-date', 'redundancy-pay-table', 'redundancy-pay-northern-ireland', 'statutory-redundancy-pay'],
  sources: ['limitsOrder2026', 'limitsOrder2025', 'limitsOrderNI2026', 'nidRedundancy', 'era145', 'govRedundancy'],
  slug: 'redundancy-pay-cap',
  nav: 'Redundancy pay cap',
  card: 'The weekly cap for 2026/27, the earlier caps and the date that decides which one you get.',
  title: `Redundancy Pay Cap 2026/27: ${g(CAP_GB)} a Week, ${g(CAP_NI)} in NI`,
  description: `Redundancy pay cap for 2026/27: a week’s pay is limited to ${g(CAP_GB)} (${g(CAP_NI)} in NI) when notice ends from 6 April 2026, so the most anyone can get is ${g(MAX_REDUNDANCY_GB)}.`,
  h1: 'The redundancy pay cap: the weekly limit and the date that sets it',
  intro: 'Statutory redundancy pay multiplies weeks by a week’s pay, but the law puts a ceiling on that week, and the ceiling moves every April.',
  resume: `The redundancy pay cap is the highest weekly figure the law lets an employer use when it works out statutory redundancy pay. For a relevant date on or after 6 April 2026 it is ${g(CAP_GB)} in England, Wales and Scotland, up from ${g(prevGB)}, and ${g(CAP_NI)} in Northern Ireland, up from ${g(prevNI)}. Anyone earning more than that is paid as if they earned exactly the cap, so the largest possible statutory payment is ${topWeeks} weeks times the cap: ${g(MAX_REDUNDANCY_GB)} in Great Britain and ${g(MAX_REDUNDANCY_NI)} in Northern Ireland. The new cap does not depend on when you were told, nor on the day the money reaches your account. It depends on the relevant date as section 145 of the Employment Rights Act 1996 defines it, normally the day your notice expires, and the extension that a payment in lieu gives to your service does not move the cap. The limit is uprated every April in line with the retail prices index of the previous September.`,
  faqs: [
    { q: 'Why does my redundancy letter use a lower weekly figure than my salary?', a: `Because a week’s pay for statutory redundancy is limited by section 227 of the Employment Rights Act 1996. If your gross pay is above ${g(CAP_GB)} a week and your notice ends on or after 6 April 2026, the employer must use ${g(CAP_GB)}, whatever you actually earn. Enhanced schemes often remove the limit, so check your contract.` },
    { q: 'My notice ends on 5 April 2026. Do I get the old or the new cap?', a: `The old one: ${g(prevGB)} in Great Britain or ${g(prevNI)} in Northern Ireland. The Increase of Limits Orders keep the previous figure whenever the relevant date falls before 6 April. A notice that expires one day later, on 6 April, takes the new ${g(CAP_GB)} or ${g(CAP_NI)}. The day you were told and the day you are paid make no difference.` },
    { q: 'How is the redundancy cap worked out each year?', a: 'By formula. Section 34 of the Employment Relations Act 1999 makes the government move the limit by the change in the retail prices index from one September to the next, with set rounding. The 2026 Order applied the rise of 4.5% measured between September 2024 and September 2025. Northern Ireland follows the same method under its own 1999 Order.' },
    { q: 'Does the cap apply to enhanced or contractual redundancy pay?', a: 'Not automatically. The statutory limit governs only the statutory calculation. A contractual scheme can use your real salary, a fixed sum or any formula it chooses, as long as you end up with at least the statutory amount. Some schemes lift the cap and others copy it; only the wording of your scheme decides.' },
    { q: 'Is the redundancy cap the same as the limit on what the government pays if my employer goes bust?', a: `The figure is the same in 2026/27 but the rule is separate. The Increase of Limits Order sets ${g(CAP_GB)} both as the maximum week’s pay for redundancy pay and, under section 186, as the weekly limit on debts such as arrears of pay and notice pay that the Redundancy Payments Service pays when an employer is insolvent.` },
  ],
  body: (h) => `
<h2>Caps since 2022</h2>
<p>The limit is set by an Employment Rights (Increase of Limits) Order for Great Britain and by a separate Order for Northern Ireland, laid each spring and in force from 6 April. The Northern Ireland figure is the higher of the two in every year shown. The table gives the cap for each year and the highest payment it allows, ${topWeeks} weeks being the most anyone can earn under the age bands (${h.src('limitsOrder2026', 'SI 2026/310')}, ${h.src('limitsOrderNI2026', 'SR 2026/57')}).</p>
${h.table(['Relevant date from', 'Cap, Great Britain', 'Maximum, GB', 'Cap, Northern Ireland', 'Maximum, NI'],
    R.weeklyCapGB.map((c, i) => [h.date(c.from), h.gbp(c.cap), h.gbp(c.cap * topWeeks), h.gbp(R.weeklyCapNI[i].cap), h.gbp(R.weeklyCapNI[i].cap * topWeeks)]).reverse(),
    'Weekly limit on a week’s pay for statutory redundancy pay, and the resulting maximum payment.', ['l', 'r', 'r', 'r', 'r'])}
<p>Between ${h.date(R.weeklyCapGB[0].from)} and ${h.date(R.weeklyCapGB[R.weeklyCapGB.length - 1].from)} the British cap rose from ${h.gbp(R.weeklyCapGB[0].cap)} to ${h.gbp(CAP_GB)}, which lifted the maximum payment by ${h.gbp((CAP_GB - R.weeklyCapGB[0].cap) * topWeeks)}. A tribunal dealing with an old claim still applies the figure that was in force on that claimant’s relevant date.</p>

<h2>The date that picks the cap</h2>
<p>Article 4 of each Order keeps the old limit “in relation to a case where the appropriate date falls before 6th April”, and for a redundancy payment on dismissal the appropriate date is “the relevant date as defined by section 145”. That is the date in ${h.src('era145', 'section 145(2)')}: the day notice expires, the day a dismissal without notice takes effect, or the day a fixed-term contract runs out. It is not the day of the announcement, the start of consultation, or the payroll date.</p>
<p>Take two colleagues born on the same day, both earning ${h.gbp(base.weeklyPay)} a week with the same start date. One works out notice ending on Sunday ${h.date(sat.relevantDate)}; the other’s notice ends the next day. The first is capped at ${h.gbp(sat.cap)}, the second at ${h.gbp(mon.cap)}. For ${h.num(sat.weeks, 1)} weeks of entitlement that is ${h.gbp(sat.amount)} against ${h.gbp(mon.amount)}, a difference of ${h.gbp(mon.amount - sat.amount)} for a single day.</p>

<h3>Pay in lieu does not carry you into the new year</h3>
<p>Section 145(5) pushes the relevant date to the end of statutory notice when an employer pays in lieu or gives short notice, but only “for the purposes of sections 155, 162(1)”: the two-year test and the counting of years and ages. The cap is fixed under section 227 and is not on that list. So an employee dismissed with pay in lieu on ${h.date(pilon.relevantDate)}, whose ${pilon.statutoryNoticeWeeks} weeks of statutory notice would have run to ${h.date(pilon.extendedDate)}, keeps the ${h.gbp(pilon.cap)} cap even though the service count reaches into May. Here the payment is ${h.gbp(pilon.amount)}. Had the employer let the notice be worked to the same day, the cap would have been ${h.gbp(redundancyCapOn(pilon.extendedDate))}.</p>

<h2>Earning above the cap</h2>
<p>For anyone paid more than the cap, the only figures that change the statutory amount are age and service. A director on ${h.gbp(2500)} a week and a team leader on ${h.gbp(CAP_GB + 50)} a week with the same age and years receive the same statutory sum. That is why the gap between statutory and contractual pay tends to widen with salary, and why higher earners usually negotiate over the enhanced element rather than the statutory one.</p>
<p>Below the cap, the April uprating makes no difference. An employee on ${h.gbp(480)} a week with ${h.num(lowWeeks, 1)} weeks of entitlement receives ${h.gbp(lowWeeks * 480)} whether the notice ends in March or in May. Only people whose weekly pay sits above the old limit gain from the new one, and they gain at most ${h.gbp((CAP_GB - prevGB) * topWeeks)} in Great Britain.</p>

<h2>Which nation’s figure applies</h2>
<p>The Northern Ireland limit applies to employment governed by the Employment Rights (Northern Ireland) Order 1996, in practice someone who works in Northern Ireland. ${h.src('nidRedundancy', 'nidirect')} quotes ${h.gbp(CAP_NI)} and a maximum of ${h.gbp(MAX_REDUNDANCY_NI)}. Living in Northern Ireland while working for a branch in Scotland does not bring the higher figure. The ${h.a('redundancy-pay-northern-ireland', 'Northern Ireland redundancy page')} sets out the other points where the two systems part ways.</p>

<h2>What to check on your statement</h2>
<ul>
<li>The week’s pay used: your gross weekly pay or the cap, whichever is lower.</li>
<li>The cap quoted: it must match your relevant date, not the date of the letter.</li>
<li>The number of weeks: compare it with the ${h.a('redundancy-pay-table', 'ready reckoner')} or, for exact dates, with the ${h.a('redundancy-pay-calculator', 'calculator')}.</li>
</ul>
<p>Section 165 obliges the employer to give a written statement of how the amount was calculated. If the cap is wrong, write to the employer quoting the Order; the claim must reach a tribunal within ${R.claimMonths} months of the relevant date if it is not put right.</p>
`,
});
