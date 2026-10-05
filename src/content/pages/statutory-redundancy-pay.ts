import { definePage } from '../../lib/guide-types';
import { CAP_GB, CAP_NI, MAX_REDUNDANCY_GB, P } from '../../lib/engine/params';
import { reckonerWeeks } from '../../lib/engine/redundancy';
import { formatMoney } from '../../lib/format';

const g = (n: number) => formatMoney(n);
const R = P.redundancy;

export default definePage({
  id: 'statutory-redundancy-pay',
  group: 'redundancy',
  order: 20,
  mini: 'redundancyQuick',
  related: ['redundancy-pay-calculator', 'redundancy-pay-table', 'redundancy-pay-cap', 'suitable-alternative-employment', 'redundancy-pay-tax', 'voluntary-redundancy'],
  sources: ['govRedundancy', 'era155', 'era162', 'limitsOrder2026', 'acasRedundancyPay'],
  slug: 'statutory-redundancy-pay',
  nav: 'Statutory redundancy pay',
  card: 'Who qualifies, how the weeks are counted and the 2026/27 maximum.',
  title: `Statutory Redundancy Pay 2026/27: Who Gets It, Up to ${g(MAX_REDUNDANCY_GB)}`,
  description: `Statutory redundancy pay in 2026/27: two years’ service, 0.5 to 1.5 weeks per year by age, weekly pay capped at ${g(CAP_GB)} (${g(CAP_NI)} in NI), exclusions and deadlines.`,
  h1: 'Statutory redundancy pay: who qualifies and how much',
  intro: 'The legal minimum an employer must pay when a job disappears, the conditions that open the right, and the situations that close it.',
  resume: `Statutory redundancy pay is owed to an employee dismissed because the job has gone, provided they have at least two years of continuous employment with the employer on the relevant date. It is worth half a week’s pay for each complete year of service under the age of 22, one week’s pay for each year between 22 and 40, and one and a half weeks’ pay for each year at 41 or over, counting back from the relevant date and stopping at 20 years. A week’s pay is the normal weekly pay before tax, capped at ${g(CAP_GB)} in Great Britain and ${g(CAP_NI)} in Northern Ireland for relevant dates from 6 April 2026, so nobody can receive more than ${g(MAX_REDUNDANCY_GB)} in Great Britain. The payment is lost if you unreasonably refuse a suitable alternative job, and it is not due to the self-employed, to workers who are not employees, or after a dismissal for misconduct.`,
  faqs: [
    { q: 'Do part-time years count the same as full-time years for redundancy pay?', a: 'Yes. Every week of a contract counts towards continuous employment, whatever the hours, so a year of part-time work is a full year of service. The hours only show up in the weekly pay: a part-timer’s week’s pay is smaller, so the same number of weeks gives a smaller amount.' },
    { q: 'Is statutory redundancy pay owed at the end of a fixed-term contract?', a: 'It can be. When a fixed-term contract of two years or more ends and is not renewed because the work has gone, that is a dismissal for redundancy in law. The usual two-year qualifying period and the same age bands apply, and the relevant date is the day the contract ends.' },
    { q: 'Can my employer pay less than the statutory amount if the business is struggling?', a: 'No. The statutory figure is a debt the employer owes. If the employer is insolvent and cannot pay, you can claim it from the Redundancy Payments Service, which pays from the National Insurance Fund. A contract can improve on the statutory scheme but cannot reduce it.' },
    { q: 'I found a new job before my notice ended. Do I lose my redundancy pay?', a: 'Not if you leave correctly. If you give written counter-notice during the obligatory notice period and your employer does not object, you keep the payment. If the employer objects in writing and you leave anyway, a tribunal decides whether you keep all, part or none of it.' },
    { q: 'Are apprentices entitled to statutory redundancy pay?', a: 'An apprentice who is an employee with two years of service is covered like anyone else. An apprentice who is not kept on at the end of training, and who was not an employee when it ended, is excluded according to GOV.UK, as are Crown servants, the armed forces and police services.' },
  ],
  body: (h) => `
<h2>The two-year rule, measured on the right day</h2>
<p>The qualifying period is two years of continuous employment ending with the relevant date (${h.src('era155', 'section 155')}). The relevant date is normally the last day of notice. Where the employer pays in lieu or gives less than the statutory minimum notice, section 145(5) adds the statutory notice for this purpose. Someone with one year and fifty weeks of service on the day they are dismissed with pay in lieu therefore reaches two years once the week of statutory notice is added. Service starts on the first day of work; weeks of sickness, holiday or maternity leave inside a contract keep counting. The ${h.a('redundancy-relevant-date', 'guide to the relevant date')} gives worked dates for each case.</p>

<h2>The amount: three age bands and a cap</h2>
<p>Count back from the relevant date in complete years, at most ${R.maxYears}. Each year earns ${h.num(1.5, 1)} weeks if you were 41 or over for all of it, one week if you were 22 or over, half a week otherwise (${h.src('era162', 'section 162')}). Multiply by a week’s pay, capped at ${h.gbp(CAP_GB)}. The table shows what that gives for a few typical careers at a weekly pay of ${h.gbp(600)}:</p>
${h.table(['Age at the relevant date', 'Complete years', 'Weeks', `Pay at ${h.gbp(600)} a week`], [
    [25, 4, h.num(reckonerWeeks(25, 4), 1), h.gbp(reckonerWeeks(25, 4) * 600)],
    [34, 10, h.num(reckonerWeeks(34, 10), 1), h.gbp(reckonerWeeks(34, 10) * 600)],
    [45, 15, h.num(reckonerWeeks(45, 15), 1), h.gbp(reckonerWeeks(45, 15) * 600)],
    [58, 25, h.num(reckonerWeeks(58, 20), 1), h.gbp(reckonerWeeks(58, 20) * 600)],
  ], 'Weeks from the statutory age bands; 20 years at most are counted.', ['r', 'r', 'r', 'r'])}
<p>The cap is the one in force on the relevant date: ${h.gbp(CAP_GB)} from 6 April 2026, ${h.gbp(R.weeklyCapGB[R.weeklyCapGB.length - 2].cap)} in 2025/26, ${h.gbp(R.weeklyCapGB[R.weeklyCapGB.length - 3].cap)} in 2024/25. Earning above it changes nothing: at ${h.gbp(1200)} a week the calculation still uses ${h.gbp(CAP_GB)}. For the full grid of ages and years, see ${h.a('redundancy-pay-table', 'the redundancy pay table')}.</p>

<h2>What counts as redundancy</h2>
<p>The law recognises three situations: the business closes, the workplace where you are employed closes, or the employer needs fewer people to do work of a particular kind. Changing the job title while the work carries on, or replacing an employee with a contractor doing the same tasks, does not make a genuine redundancy. A redundancy that is genuine can still be unfair if the selection was not objective or the consultation was skipped; that question goes to a tribunal and does not change the statutory payment, which is due either way.</p>
<p>Selection pools, scoring and last-in-first-out are matters of fairness, not of the amount. GOV.UK lists reasons for which you can never be chosen lawfully: pregnancy or maternity leave, part-time or fixed-term status, trade union membership, whistleblowing and the other protected grounds. Being chosen for one of them is automatically unfair, whatever your length of service.</p>

<h2>When the right is lost</h2>
<p>Three situations remove the statutory payment. The first is accepting a new contract with the same or an associated employer that starts within four weeks of the old one ending: continuity carries on, so there is no redundancy. The second is unreasonably refusing an offer of suitable alternative employment; whether a job is suitable depends on the work, the pay, the hours, the place and your circumstances, and you are entitled to a ${R.trialPeriodWeeks}-week trial without losing the right (${h.a('suitable-alternative-employment', 'suitable alternative employment')}). The third is dismissal for misconduct, which is a different kind of dismissal altogether. Some groups are outside the scheme entirely: share fishermen, Crown servants, the armed forces and police, and domestic servants who are members of the employer’s family.</p>

<h2>Lay-offs and short-time working</h2>
<p>You do not always have to wait to be dismissed. An employee laid off without pay, or on short time earning less than half a week’s pay, for more than ${R.layOffWeeksInRow} weeks in a row or ${R.layOffWeeksIn13} weeks in a 13-week period can claim redundancy pay by writing to the employer, then giving notice. The employer can resist the claim only by showing that normal work is likely to resume within four weeks and last at least thirteen. The ${h.a('lay-off-short-time-redundancy', 'lay-off guide')} sets out the timetable.</p>

<h2>Getting paid, and the deadline</h2>
<p>The employer should pay on or soon after the last day, with a written statement showing how the amount was worked out. If nothing arrives, write to the employer, then go to Acas for early conciliation and, if needed, to an employment tribunal: the claim must be made within ${R.claimMonths} months of the relevant date. Statutory redundancy pay is tax-free up to ${h.gbp(P.termination.taxFreeThreshold)} together with any other redundancy payment from the employer; notice pay and holiday pay are taxed as earnings (${h.a('redundancy-pay-tax', 'redundancy pay and tax')}). If you are offered more than the statutory amount, the enhanced scheme in your contract or in the employer’s offer applies, and ${h.a('voluntary-redundancy', 'voluntary redundancy')} explains how to compare an offer with the legal floor.</p>
`,
});
