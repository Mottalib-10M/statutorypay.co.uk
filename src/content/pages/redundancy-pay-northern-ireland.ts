import { definePage } from '../../lib/guide-types';
import { CAP_GB, CAP_NI, MAX_REDUNDANCY_GB, MAX_REDUNDANCY_NI, P } from '../../lib/engine/params';
import { computeRedundancy, reckonerWeeks } from '../../lib/engine/redundancy';
import { displayDate, formatMoney } from '../../lib/format';

const R = P.redundancy;
const g = (n: number) => formatMoney(n);
const d = (iso: string) => displayDate(iso, 'en-GB');
const NOW = R.weeklyCapNI[R.weeklyCapNI.length - 1];
const OLD = R.bands[0].fromAge, MID = R.bands[1].fromAge;
// nidirect's three worked examples, recomputed with the engine.
const w1 = reckonerWeeks(45, 15);
const w2 = reckonerWeeks(30, 10);
const w3 = reckonerWeeks(35, 5);
// A Belfast case with real dates, above both caps, in each jurisdiction.
const base = { dob: '1975-08-21', start: '2008-01-07', noticeGiven: '2026-09-28', end: '2026-12-21', weeklyPay: 900 };
const ni = computeRedundancy({ ...base, jurisdiction: 'NI' });
const gb = computeRedundancy({ ...base, jurisdiction: 'GB' });
// Same case with a last day before 6 April 2026: the old NI cap applies.
const old = computeRedundancy({ ...base, noticeGiven: '2025-12-15', end: '2026-03-27', jurisdiction: 'NI' });

export default definePage({
  id: 'redundancy-pay-northern-ireland',
  group: 'nations',
  order: 10,
  mini: 'niRedundancyCompare',
  miniHref: 'redundancy-pay-calculator',
  related: ['northern-ireland-employment-rights', 'redundancy-pay-calculator', 'redundancy-pay-cap', 'statutory-redundancy-pay', 'redundancy-relevant-date'],
  sources: ['limitsOrderNI2026', 'nidRedundancy', 'ni_erni197', 'ni_lra', 'limitsOrder2026'],
  slug: 'redundancy-pay-northern-ireland',
  nav: 'Redundancy pay in Northern Ireland',
  card: `The ${g(CAP_NI)} Northern Ireland cap, its history, nidirect’s examples checked, and where to claim.`,
  title: `Northern Ireland Redundancy Pay 2026: ${g(CAP_NI)} Cap, ${g(MAX_REDUNDANCY_NI)} Max`,
  description: `Redundancy pay in Northern Ireland for 2026/27: weekly pay capped at ${g(CAP_NI)}, maximum ${g(MAX_REDUNDANCY_NI)}, the 1996 Order, past caps and claims to an industrial tribunal.`,
  h1: 'Redundancy pay in Northern Ireland',
  intro: 'Same formula as in Great Britain, written in a different law, with a higher cap and its own institutions.',
  resume: `Statutory redundancy pay in Northern Ireland comes from the Employment Rights (Northern Ireland) Order 1996, not the Great Britain Act, and since ${d(NOW.from)} a week’s pay is capped at ${g(CAP_NI)} instead of ${g(CAP_GB)}, which raises the maximum payment to ${g(MAX_REDUNDANCY_NI)} against ${g(MAX_REDUNDANCY_GB)}. The cap follows the relevant date, normally the last day of notice, so a job ending on or after ${d(NOW.from)} uses ${g(CAP_NI)} even if notice was given before. Everything else matches: ${R.qualifyingYears} years of continuous employment (article 190), half a week’s pay for each complete year under ${MID}, one week from ${MID} to ${OLD - 1} and one and a half weeks from ${OLD} (article 197), and at most ${R.maxYears} years counted. Claims go to an industrial tribunal within ${R.claimMonths} months, and free advice comes from the Labour Relations Agency or Advice NI. The cap only matters if you earn more than ${g(CAP_GB)} a week: below that, both jurisdictions give the same amount.`,
  faqs: [
    { q: 'How much more can the Northern Ireland cap give compared with Great Britain?', a: `At most ${g(CAP_NI - CAP_GB)} for each week of pay, so ${g(MAX_REDUNDANCY_NI - MAX_REDUNDANCY_GB)} on a maximum award of ${R.maxYears * R.bands[0].weeks} weeks. The gap only opens if you earn more than ${g(CAP_GB)} a week; between ${g(CAP_GB)} and ${g(CAP_NI)} it is partial, and below ${g(CAP_GB)} both jurisdictions pay exactly the same.` },
    { q: 'Is nidirect’s first redundancy pay example right?', a: `No. It multiplies ${w1} weeks by the ${g(CAP_NI)} cap for someone earning ${g(600)} a week and reaches ${g(w1 * CAP_NI)}. The cap is a ceiling, not a rate: the week’s pay is the lower of actual pay and the cap, so the correct figure is ${w1} × ${g(600)} = ${g(w1 * 600)}. The weeks are right.` },
    { q: 'Does Northern Ireland use the same age bands for redundancy pay?', a: `Yes. Article 197 gives one and a half weeks for each year at ${OLD} or over, one week for each year at ${MID} or over, and half a week for the rest. nidirect writes the youngest band as “21 and under”, which is the same thing as under ${MID}. The cap and the ${R.maxYears}-year limit apply on top.` },
    { q: 'Where do I claim if my Northern Ireland employer does not pay?', a: `Write to the employer first. If that fails, the claim goes to an industrial tribunal, which is the Northern Ireland name for an employment tribunal, within ${R.claimMonths} months of the relevant date. The Labour Relations Agency and Advice NI give free, impartial advice on the claim. If the employer is insolvent, nidirect points to the NI Redundancy Payments Service.` },
    { q: 'Is redundancy pay taxed differently in Northern Ireland?', a: `No. Income tax is a UK-wide matter, so the first ${g(P.termination.taxFreeThreshold)} of redundancy pay is tax-free in Northern Ireland as in the rest of the UK, and notice pay and holiday pay are taxed as earnings. nidirect directs readers to HMRC for whether pay in lieu of notice is taxable.` },
  ],
  body: (h) => `
<h2>A separate law with a higher cap</h2>
<p>Employment law is devolved to Northern Ireland, and redundancy pay sits in Part XII of the ${h.src('ni_erni197', 'Employment Rights (Northern Ireland) Order 1996')}. Article 170 creates the right, article 190 sets the ${R.qualifyingYears}-year qualifying period and article 197 the amount, in the same terms as the Great Britain Act of the same year. The difference is article 23, where the maximum week’s pay is set each April by its own Increase of Limits Order. For 2026 it is ${h.src('limitsOrderNI2026', 'SR 2026/57')}, which put the cap at ${h.gbp(CAP_NI)} from ${h.date(NOW.from)}.</p>
<p>The two caps have moved apart over the years, because each is set by its own order:</p>
${h.table(['From', 'NI weekly cap', 'NI maximum', 'GB weekly cap', 'NI above GB'], R.weeklyCapNI.map((c, i) => {
    const gbCap = R.weeklyCapGB[i].cap;
    return [h.date(c.from), h.gbp(c.cap), h.gbp(c.cap * R.maxYears * R.bands[0].weeks), h.gbp(gbCap), h.gbp(c.cap - gbCap)];
  }), `Maximum = cap × ${R.maxYears * R.bands[0].weeks} weeks (${R.maxYears} years at one and a half weeks). Caps from the Increase of Limits Orders for each year.`, ['l', 'r', 'r', 'r', 'r'])}

<h2>Which year’s cap applies</h2>
<p>The cap is fixed by the relevant date, which is normally the day notice ends or the day employment ends without notice. A Belfast employee born on ${d(base.dob)}, employed since ${d(base.start)} on ${h.gbp(base.weeklyPay)} a week, given notice on ${d(base.noticeGiven)} and leaving on ${d(base.end)}, has ${ni.countedYears} counted years worth ${h.num(ni.weeks, 1)} weeks. In Northern Ireland that is ${h.num(ni.weeks, 1)} × ${h.gbp(ni.weekUsed)} = ${h.gbp(ni.amount)}; the same person in Great Britain would get ${h.gbp(gb.amount)}. Had the job ended on ${d(old.relevantDate)}, before the April uprating, the ${h.gbp(old.cap)} cap would have applied and the payment would have been ${h.gbp(old.amount)}.</p>

<h2>nidirect’s worked examples, checked</h2>
<p>nidirect’s redundancy pay page gives three examples. The weeks in all three are correct, but the first one applies the cap to someone who earns less than it:</p>
${h.table(['Example', 'Weeks', 'Weekly pay used', 'nidirect’s figure', 'Correct figure'], [
    [`Age 45, 15 years, ${h.gbp(600)} a week`, h.num(w1, 1), h.gbp(600), h.gbp(w1 * CAP_NI), `<strong>${h.gbp(w1 * Math.min(600, CAP_NI))}</strong>`],
    [`Age 30, 10 years, ${h.gbp(450)} a week`, h.num(w2, 1), h.gbp(450), h.gbp(w2 * 450), h.gbp(w2 * Math.min(450, CAP_NI))],
    [`Age 35, 5 years, ${h.gbp(325)} averaged`, h.num(w3, 1), h.gbp(325), h.gbp(w3 * 325), h.gbp(w3 * Math.min(325, CAP_NI))],
  ], 'Weeks from the article 197 age bands; a week’s pay is the lower of actual pay and the cap.', ['l', 'r', 'r', 'r', 'r'])}
<p>The third example is useful for anyone whose hours rose recently: nidirect averages nine weeks at 30 hours and three at 40 hours across ${R.averagingWeeks} weeks, which is the same averaging rule as in Great Britain. A furlough period is valued at normal pay, not the reduced furlough rate.</p>

<h2>When the money arrives, and what to check</h2>
<p>nidirect says you do not have to claim statutory redundancy pay: the employer should pay it automatically, normally on the last day of notice, shortly afterwards or on the next pay day, with a written statement showing how the figure was worked out. Check three things on that statement. First, the cap: a last day from ${h.date(NOW.from)} must use ${h.gbp(CAP_NI)}, not the Great Britain figure of ${h.gbp(CAP_GB)}, a slip that is easy to make with a head office in England. Second, the weekly pay: nidirect says regular overtime, bonuses and commission belong in it. Third, the years: if notice was paid in lieu, the service count runs to the end of the statutory notice, as in Great Britain. A contract or staff handbook can promise more than the statutory sum, never less, and notice pay or pay in lieu is owed on top.</p>

<h2>Rules that differ around redundancy</h2>
<ul>
<li><strong>Unfair selection.</strong> In Northern Ireland the qualifying period to claim unfair dismissal is ${P.leavingExtra.niUnfairDismissalYears} year (article 140), so an employee with between one and two years can challenge an unfair selection while still having no right to statutory redundancy pay.</li>
<li><strong>Tribunal and advice.</strong> Claims go to the industrial tribunals, and the ${h.src('ni_lra', 'Labour Relations Agency')} plays the role Acas has in Great Britain. Advice NI also gives free help.</li>
<li><strong>Lay-off and short time.</strong> The same triggers apply: more than ${R.layOffWeeksInRow} weeks in a row or ${R.layOffWeeksIn13} weeks in a ${P.leavingExtra.layOffWindowWeeks}-week period, claimed in writing to the employer.</li>
</ul>
<p>For the full list of Northern Ireland differences across holiday, family leave and sick pay, see ${h.a('northern-ireland-employment-rights', 'employment rights in Northern Ireland')}. The ${h.a('redundancy-pay-calculator', 'redundancy pay calculator')} has a Northern Ireland option that applies the cap of your relevant date.</p>
`,
});
