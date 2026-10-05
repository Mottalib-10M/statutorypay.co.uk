import { definePage } from '../../lib/guide-types';
import { P } from '../../lib/engine/params';
import { smpSchedule } from '../../lib/engine/family';

const F = P.familyPay;
const X = P.familyExtra;
const pcText = () => `${Math.round(F.earningsShare * 100)}%`;
// Example: pay of £600 for a five-day week, SMP from Wednesday 3 March 2027 (pay weeks Wednesday to Tuesday).
const pay = 600;
const workDays = 5;
const day = pay / workDays;
const smpStart = '2027-03-03';
const s = smpSchedule(pay, smpStart);
const flatWeek = s.weeks[F.smpHigherRateWeeks].amount;
// Days of work in four SMP pay weeks; the last block goes beyond the KIT allowance.
const wk = (n: number) => s.weeks[n - 1];
const plan = [
  { n: 20, days: 2 },
  { n: 21, days: 3 },
  { n: 26, days: 2 },
  { n: 30, days: workDays },
];
let used = 0;
const rows = plan.map(({ n, days }) => {
  const before = used;
  used += days;
  return { n, days, kitUsed: Math.min(used, F.kitDays), lost: used > F.kitDays, start: wk(n).start, end: wk(n).end, before };
});
const last = rows[rows.length - 1];
const firstExtra = F.kitDays - last.before + 1;
const kitInLast = F.kitDays - last.before;

export default definePage({
  id: 'keeping-in-touch-days',
  group: 'family',
  order: 70,
  mini: 'kitDayPay',
  miniHref: 'maternity-pay-calculator',
  related: ['statutory-maternity-pay', 'maternity-leave-dates-calculator', 'shared-parental-pay-calculator', 'adoption-pay-calculator', 'maternity-allowance'],
  sources: ['fam_mpl12A', 'fam_spmKit', 'fam_spmSplit', 'fam_spmWorking', 'govShared', 'fam_nidMaternityRights'],
  slug: 'keeping-in-touch-days',
  nav: 'Keeping in touch days',
  card: 'Ten days of work during maternity or adoption leave without losing pay, and what happens on day eleven.',
  title: `Keeping in Touch Days 2026/27: ${F.kitDays} KIT Days and Your SMP`,
  description: `Keeping in touch days in 2026/27: ${F.kitDays} KIT days on maternity or adoption leave, ${X.splitDays} SPLIT days on shared parental leave, how they are paid and when SMP is lost.`,
  h1: 'Keeping in touch days: working during maternity leave without losing pay',
  intro: 'A day of training, a team meeting or a handover in the middle of your leave: the rules that keep your SMP and your leave intact, and the one that costs a week’s pay.',
  resume: `Keeping in touch (KIT) days let an employee on maternity or adoption leave do up to ${F.kitDays} days of work for her employer without ending the leave or losing Statutory Maternity or Adoption Pay. They are optional on both sides: the employer cannot require them and the employee cannot insist on them. Any work on a day counts as a whole KIT day, even a one-hour meeting or a training session, and none can be worked in the ${F.compulsoryLeaveWeeks} weeks after the birth. Pay for the day is whatever the two of you agree; the employer may count SMP towards it, but the total for that pay week must not fall below the SMP due. Working on any day beyond the ${F.kitDays} costs the SMP for the whole pay week in which it falls. Parents on shared parental leave have a separate allowance of ${X.splitDays} SPLIT days each. The same ${F.kitDays}-day rule applies in Northern Ireland and to Maternity Allowance.`,
  faqs: [
    { q: 'Does an hour-long meeting use up a whole keeping in touch day?', a: `Yes. Regulation 12A of the Maternity and Parental Leave etc. Regulations 1999 says any work carried out on a day is a day’s work, and HMRC’s manual gives a one-hour visit, a training session or a meeting as examples. Plan short contacts on the same day where you can, or keep them to phone calls that count as reasonable contact.` },
    { q: 'Can my employer insist that I come in for KIT days?', a: `No. The regulation expressly gives the employer no right to require work during maternity leave, and gives you no right to demand it either. Both of you have to agree the day, the work and the pay. Turning down a KIT day does not affect your leave or your SMP.` },
    { q: 'What happens to my SMP if I work an eleventh day?', a: `You lose the SMP for the pay week in which that day falls, whatever the number of hours. The maternity pay period is not extended to make up for it, so the week is simply gone (HMRC, SPM200300). Your leave itself continues. Any later day of work causes the same loss for its own pay week.` },
    { q: 'Do keeping in touch days make my maternity leave longer?', a: `No. KIT days sit inside the ${F.maternityLeaveWeeks} weeks of leave and the ${F.smpWeeks} weeks of SMP; neither period is extended by the days you work. If you want extra time at the end, nidirect points out that holiday built up during the leave can be added to its beginning or end, booked in the usual way.` },
    { q: 'Are there keeping in touch days during paternity leave?', a: `No. The ${F.kitDays}-day allowance belongs to maternity and adoption leave, and the ${X.splitDays}-day allowance to shared parental leave. Statutory Paternity Pay is not payable for any week in which you work for the employer that pays it, so a day back in the office during a paid paternity week costs that week’s pay.` },
  ],
  body: (h) => `
<h2>The legal rule in five points</h2>
<p>KIT days come from ${h.src('fam_mpl12A', 'regulation 12A')} of the Maternity and Parental Leave etc. Regulations 1999 for the leave, and from the SMP rules described in ${h.src('fam_spmKit', 'HMRC’s Statutory Payments Manual, SPM200100')} for the pay.</p>
<ol>
<li><strong>Up to ${F.kitDays} days</strong> in the whole leave, taken singly or in blocks, at any point except the ${F.compulsoryLeaveWeeks} weeks after the birth (${F.compulsoryLeaveFactoryWeeks} weeks for factory workers, whose compulsory leave is longer).</li>
<li><strong>Any work on a day is a day.</strong> A shift that crosses midnight counts as one KIT day only if that is your normal working pattern.</li>
<li><strong>Work includes training</strong> and activities whose purpose is to keep in touch with the workplace, such as a team day or an away-day.</li>
<li><strong>Reasonable contact is not work.</strong> Calls or emails about your return, a reorganisation or job vacancies do not use up KIT days or end your leave.</li>
<li><strong>The leave does not get longer.</strong> KIT days are inside the ${F.maternityLeaveWeeks} weeks.</li>
</ol>

<h2>How the day is paid</h2>
<p>The law sets no rate for a KIT day: nidirect says you and your employer agree the work and the pay in advance. In practice there are two ways an employer can handle it, and the difference matters. Take an employee on ${h.gbp(pay)} for a ${workDays}-day week, so ${h.gbp(day)} a day, who is in the flat-rate part of her SMP at ${h.gbp(flatWeek, 2)} a week.</p>
${h.table(['KIT days in the pay week', 'Paid on top of SMP', 'SMP offset against the day’s pay'], [1, 2, 3].map((k) => [k, h.gbp(flatWeek + k * day, 2), h.gbp(Math.max(flatWeek, k * day), 2)]), `Gross pay for the week, normal pay ${h.gbp(pay)} a week, SMP ${h.gbp(flatWeek, 2)}.`, ['r', 'r', 'r'])}
<p>HMRC permits the second method: wages for the KIT day can be set against the SMP due, as long as the total for the SMP week is at least the SMP entitlement. Under it, a single KIT day paid at ${h.gbp(day)} adds nothing, because the SMP is higher. Agree the method before the day, in writing if possible. During the first ${F.smpHigherRateWeeks} weeks, when SMP is ${pcText()} of your average pay, an offset leaves you with even less extra.</p>

<h2>Counting days by pay week</h2>
<p>The ${F.kitDays}-day limit is counted across the whole leave, but the penalty for exceeding it is applied by SMP pay week, and pay weeks start on the weekday your SMP started, not on Monday. With SMP from Wednesday ${h.date(smpStart)}, every pay week runs Wednesday to Tuesday. Suppose the employee works these days:</p>
${h.table(['SMP week', 'Dates', 'Days worked', 'KIT days used so far', 'SMP for the week'], rows.map((r) => [r.n, `${h.date(r.start)} to ${h.date(r.end)}`, r.days, r.kitUsed, r.lost ? 'Lost: day beyond the limit' : h.gbp(wk(r.n).amount, 2)]), `SMP from ${h.date(smpStart)}, ${h.gbp(pay)} a week.`, ['r', 'l', 'r', 'r', 'l'])}
<p>Day ${firstExtra} of the block in week ${last.n} is day ${F.kitDays + 1} of work in the leave, so the SMP for that whole week, ${h.gbp(wk(last.n).amount, 2)}, is not payable, even though ${kitInLast} of the ${last.days} days were still KIT days. The earlier weeks are paid in full. Splitting a block of days so that it straddles two pay weeks does not help once the ${F.kitDays} are used: every later week with any work in it is lost.</p>

<h2>SPLIT days, adoption and Maternity Allowance</h2>
<p>Each parent taking shared parental leave can work up to ${X.splitDays} Shared Parental Leave in Touch (SPLIT) days, in addition to any KIT days used during maternity or adoption leave (${h.src('govShared', 'GOV.UK, Shared Parental Leave and Pay')}). The same counting rule applies, but the penalty is harsher: working more than ${X.splitDays} SPLIT days brings the shared parental pay period to an end (${h.src('fam_spmWorking', 'HMRC, SPM200300')}). Adoption leave has the same ${F.kitDays} KIT days as maternity leave. A woman on Maternity Allowance can also work ${F.kitDays} KIT days without losing any allowance, but must report each one to the Maternity Allowance helpline.</p>
<p>In Northern Ireland the allowance is the same ${F.kitDays} days, again only by agreement, and nidirect lists work, training and team events as typical uses (${h.src('fam_nidMaternityRights', 'nidirect, Entitlements during Statutory Maternity Leave')}). For the dates of your leave and pay weeks, use the ${h.a('maternity-leave-dates-calculator', 'maternity leave dates calculator')}.</p>
`,
});

