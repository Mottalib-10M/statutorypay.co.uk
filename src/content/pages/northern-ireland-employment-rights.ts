import { definePage } from '../../lib/guide-types';
import { CAP_GB, CAP_NI, FAMILY_RATE, LEL, P } from '../../lib/engine/params';
import { computeSpp } from '../../lib/engine/family';
import { displayDate, formatMoney, formatPercent } from '../../lib/format';

const g = (n: number, d = 0) => formatMoney(n, d);
const d = (iso: string) => displayDate(iso, 'en-GB');
const F = P.familyPay;
type Day = [string, string];
const ni2026 = (P.bankHolidays['northern-ireland'] as Day[]).filter(([x]) => x.startsWith('2026'));
const ew2026 = (P.bankHolidays['england-and-wales'] as Day[]).filter(([x]) => x.startsWith('2026'));
const niOnly = ni2026.filter(([x]) => !ew2026.some(([y]) => y === x));
// Paternity: a father who joined in October 2026, baby due 14 March 2027.
const sppBase = { dueDate: '2027-03-14', awe: 610, employmentStart: '2026-10-12', weeks: 2 as const, leaveStart: '2027-03-14' };
const pNI = computeSpp({ ...sppBase, jurisdiction: 'NI' });
const pGB = computeSpp({ ...sppBase, jurisdiction: 'GB' });

export default definePage({
  id: 'northern-ireland-employment-rights',
  group: 'nations',
  order: 20,
  mini: 'niPaternityWindow',
  miniHref: 'paternity-pay-calculator',
  related: ['redundancy-pay-northern-ireland', 'paternity-leave-2026', 'irregular-hours-holiday-calculator', 'bank-holidays-and-annual-leave', 'ssp-changes-april-2026', 'statutory-notice-period'],
  sources: ['ni_lra', 'nidPaternityLeave', 'hol_nidTakingHolidays', 'nidBankHolidays', 'ni_era2025s12', 'upratingOrderNI2026', 'ni_erni140', 'si2023_1426'],
  slug: 'northern-ireland-employment-rights',
  nav: 'Employment rights in Northern Ireland',
  card: 'Every Northern Ireland rule that changes a figure on this site, and the ones that stay the same.',
  title: `Northern Ireland Employment Rights 2026: How They Differ`,
  description: `Northern Ireland employment rights in 2026: ${g(CAP_NI)} redundancy cap, paternity leave after ${F.serviceWeeks} weeks, ${ni2026.length} bank holidays, ${P.holidayExtra.niVariablePayAverageWeeks}-week holiday pay and the same SSP.`,
  h1: 'Employment rights in Northern Ireland: what is different',
  intro: 'Employment law is devolved, so Northern Ireland keeps its own Order, its own tribunals and several rules that Great Britain changed and Belfast did not.',
  resume: `Northern Ireland has its own employment law, made under the Employment Rights (Northern Ireland) Order 1996 and the Working Time Regulations (Northern Ireland) 2016, so several figures differ from Great Britain in 2026/27. Redundancy pay uses a weekly cap of ${g(CAP_NI)} instead of ${g(CAP_GB)}. Paternity leave still needs ${F.serviceWeeks} weeks’ service and must be one block of one or two consecutive weeks finishing within ${F.paternityWindowDaysNI} days of the birth, while Great Britain made it a day-one right with separate weeks across a year. The Great Britain holiday reforms, including the ${formatPercent(P.holiday.irregularAccrualRate, 2)} accrual and rolled-up holiday pay, do not extend to Northern Ireland, and variable holiday pay is averaged over ${P.holidayExtra.niVariablePayAverageWeeks} weeks rather than ${P.holiday.referenceWeeks}. There are ${ni2026.length} bank holidays in 2026. Statutory notice, SMP and SPP rates, and Statutory Sick Pay from day one are the same on both sides. Claims go to an industrial tribunal, and free advice comes from the Labour Relations Agency.`,
  faqs: [
    { q: 'Do I get St Patrick’s Day off work in Northern Ireland?', a: `Only if your contract gives it. ${d(niOnly[0][0])} is a bank holiday in Northern Ireland, but nidirect says there is no legal right to paid leave on bank or public holidays. If your employer gives the day off with pay, it can count towards your ${P.holiday.statutoryWeeks} weeks of statutory leave, and working it carries no automatic right to a higher rate.` },
    { q: 'Can my employer in Northern Ireland pay rolled-up holiday pay?', a: `No. nidirect says an employer cannot include an amount for holiday pay in your hourly rate, and that a contract with rolled-up pay should be renegotiated. In Great Britain it became lawful for irregular-hours and part-year workers, at ${formatPercent(P.holiday.irregularAccrualRate, 2)} of pay, for leave years from ${d(P.holiday.irregularRegimeFrom)}, but the regulations that allowed it extend to Great Britain only.` },
    { q: 'I started my job five months before the baby is due. Can I take paternity leave in Northern Ireland?', a: `Not as a statutory right. In Northern Ireland you need ${F.serviceWeeks} weeks’ service by the end of the 15th week before the expected week of childbirth. For a baby due on ${d(sppBase.dueDate)} you must have started by ${d(pNI.dates.startedBy)}. A father in Great Britain with the same dates would qualify for leave from his first day.` },
    { q: 'Is Statutory Sick Pay the same in Northern Ireland since April 2026?', a: `Yes. The Employment Rights Act 2025 amended the Northern Ireland social security legislation directly (sections 12 and 13), removing the waiting days and the lower earnings limit there too. SSP is ${g(P.ssp.weeklyRate, 2)} a week or ${formatPercent(P.ssp.earningsShare, 0)} of normal weekly earnings if lower, from the first day of sickness, for up to ${P.ssp.maxWeeks} weeks.` },
    { q: 'How long do I need to work in Northern Ireland before I can claim unfair dismissal?', a: `Normally ${P.leavingExtra.niUnfairDismissalYears} year of continuous employment, under article 140 of the Employment Rights (Northern Ireland) Order 1996. Article 140(3) then lists the automatically unfair reasons for which no qualifying period is needed at all. The claim goes to an industrial tribunal, and the Labour Relations Agency gives free advice before you file.` },
  ],
  body: (h) => `
<h2>Same subject, different statute book</h2>
<p>Employment rights in Great Britain sit in the Employment Rights Act 1996 and the Working Time Regulations 1998. In Northern Ireland, the equivalent texts are the Employment Rights (Northern Ireland) Order 1996, the Working Time Regulations (Northern Ireland) 2016 and Northern Ireland’s own social security legislation. Most of the time the wording is identical, but each set is amended separately, so a reform made at Westminster for Great Britain does not reach Belfast unless it says so. Disputes go to the industrial tribunals; the ${h.src('ni_lra', 'Labour Relations Agency')} does the advisory work Acas does in Great Britain, alongside Advice NI and trade unions.</p>

<h2>Where the figures differ</h2>
${h.table(['Topic', 'Northern Ireland rule', 'Source', 'Page'], [
    ['Redundancy pay', `Week’s pay capped at ${h.gbp(CAP_NI)} (GB ${h.gbp(CAP_GB)})`, 'SR 2026/57, art. 23 of the 1996 Order', h.a('redundancy-pay-northern-ireland', 'NI redundancy pay')],
    ['Paternity leave', `${F.serviceWeeks} weeks’ service; one block of up to ${F.paternityWeeks} weeks within ${F.paternityWindowDaysNI} days`, 'nidirect, Paternity leave', h.a('paternity-leave-2026', 'Paternity leave')],
    ['Irregular hours holiday', `${h.num(P.holiday.statutoryWeeks, 1)} weeks a year; no ${h.pct(P.holiday.irregularAccrualRate, 2)} accrual`, 'SI 2023/1426 extends to GB only', h.a('irregular-hours-holiday-calculator', 'Irregular hours')],
    ['Holiday pay, variable earnings', `Average of the last ${P.holidayExtra.niVariablePayAverageWeeks} weeks (GB ${P.holiday.referenceWeeks})`, 'nidirect, Taking your holidays', h.a('weeks-pay-explained', 'A week’s pay')],
    ['Unfair dismissal', `${P.leavingExtra.niUnfairDismissalYears} year’s service to claim`, 'Art. 140 of the 1996 Order', ''],
    ['Bank holidays 2026', `${ni2026.length}, including ${niOnly.map(([, n]) => n).join(' and ')}`, 'GOV.UK bank holidays', h.a('bank-holidays-and-annual-leave', 'Bank holidays')],
  ], 'Differences that change a figure or a date in the calculators on this site.', ['l', 'l', 'l', 'l'])}

<h3>Paternity leave in practice</h3>
<p>The paternity difference is the one most likely to catch people out, because Great Britain’s rules changed on ${h.date(F.paternityDayOneGBFrom)} and GOV.UK’s paternity guide now describes the British version, with a short note that Northern Ireland differs. Take a father who joined his employer on ${h.date(sppBase.employmentStart)}, with the baby due on ${h.date(sppBase.dueDate)}. In Great Britain he ${pGB.leaveEligible ? 'can take' : 'cannot take'} paternity leave, in two separate weeks if he wishes, until ${h.date(pGB.windowEnd)}. In Northern Ireland he ${pNI.leaveEligible ? 'can take it' : `has no statutory right to it, because he would have needed to start by ${h.date(pNI.dates.startedBy)}`}; a colleague who does qualify must take one or two consecutive weeks, starting no earlier than the birth and finishing by ${h.date(pNI.windowEnd)} if the baby arrives on time. Statutory Paternity Pay needs the ${F.serviceWeeks} weeks’ service on both sides of the Irish Sea, plus average earnings of at least ${h.gbp(LEL)} a week.</p>

<h3>Holiday</h3>
<p>The basic entitlement is the same ${h.num(P.holiday.statutoryWeeks, 1)} weeks, capped at ${P.holiday.maxDays} days, and part-timers get it pro rata. What Northern Ireland did not adopt is the 2024 package: there is no hours-based accrual for irregular-hours and part-year workers, no rolled-up holiday pay, and nidirect still gives a shorter reference period for variable pay than the ${P.holiday.referenceWeeks} weeks used in Great Britain: it says variable holiday pay is the average weekly wage over the previous ${P.holidayExtra.niVariablePayAverageWeeks} weeks and should reflect guaranteed and non-guaranteed overtime, commission and work-related travel payments. Northern Ireland’s ${ni2026.length} bank holidays are ${ni2026.length - ew2026.length} more than the ${ew2026.length} in England and Wales; in 2026 the Battle of the Boyne holiday falls on ${h.date(niOnly[niOnly.length - 1][0])} because 12 July is a Sunday.</p>

<h2>What is the same</h2>
<ul>
<li><strong>Statutory notice.</strong> Article 118 of the 1996 Order copies section 86: ${P.notice.underTwoYearsWeeks} week after a month, a week per complete year from two years, up to ${P.notice.maxWeeks}; ${P.notice.employeeWeeks} week from an employee.</li>
<li><strong>Redundancy formula.</strong> ${P.redundancy.qualifyingYears} years’ service, the three age bands and the ${P.redundancy.maxYears}-year limit; only the cap differs.</li>
<li><strong>Family pay rates.</strong> SMP, SPP, SAP and ShPP pay ${h.gbp(FAMILY_RATE, 2)} a week or ${h.pct(F.earningsShare, 0)} of earnings if lower, under the Northern Ireland Up-rating Order, with the same ${h.gbp(LEL)} lower earnings limit.</li>
<li><strong>Statutory Sick Pay.</strong> Since ${h.date(P.ssp.reformDate)}, from the first day of sickness and without a lower earnings limit, at ${h.gbp(P.ssp.weeklyRate, 2)} or ${h.pct(P.ssp.earningsShare, 0)} of earnings.</li>
<li><strong>Tax.</strong> The ${h.gbp(P.termination.taxFreeThreshold)} threshold for redundancy pay is UK-wide.</li>
</ul>
<p>Every calculator on this site asks where you work and switches to the Northern Ireland rule where one exists.</p>
`,
});
