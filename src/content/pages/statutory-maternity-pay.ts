import { definePage } from '../../lib/guide-types';
import { FAMILY_RATE, LEL, P } from '../../lib/engine/params';
import { smpSchedule } from '../../lib/engine/family';
import { firstSundayOfApril } from '../../lib/engine/dates';
import { formatMoney } from '../../lib/format';

const g = (n: number, d = 0) => formatMoney(n, d);
const F = P.familyPay;
const X = P.familyExtra;
const pc = `${Math.round(F.earningsShare * 100)}%`;
const later = F.smpWeeks - F.smpHigherRateWeeks;
// Table computed by the engine: leave starting on the first Sunday of April, all weeks at the 2026/27 rate.
const start = firstSundayOfApril(P.year);
const rows = [150, 215, 300, 500, 800].map((awe) => ({ awe, s: smpSchedule(awe, start) }));
const crossover = FAMILY_RATE / F.earningsShare;

export default definePage({
  id: 'statutory-maternity-pay',
  group: 'family',
  order: 20,
  mini: 'smpQuick',
  miniHref: 'maternity-pay-calculator',
  related: ['maternity-pay-calculator', 'smp-average-weekly-earnings', 'maternity-allowance', 'enhanced-maternity-pay', 'keeping-in-touch-days', 'redundancy-maternity-leave'],
  sources: ['govMaternityPay', 'govEmployerSmp', 'hmrcRates', 'nidSmp', 'fam_nidSmpEligibility', 'fam_spmLeaving', 'fam_spmBackdatedPay'],
  slug: 'statutory-maternity-pay',
  nav: 'Statutory Maternity Pay',
  card: 'The two qualifying tests, the paperwork, and what SMP is worth at five levels of pay.',
  title: 'Statutory Maternity Pay 2026/27: Who Qualifies, How Much',
  description: `Statutory Maternity Pay 2026/27: earn ${g(LEL)} a week, ${F.serviceWeeks} weeks with your employer, then ${F.smpWeeks} weeks of pay at ${pc} and ${g(FAMILY_RATE, 2)}. Proof, notice, leaving and pay rises.`,
  h1: 'Statutory Maternity Pay: who qualifies and what it is worth',
  intro: 'The service and earnings tests, the forms your employer needs, and the situations people get wrong: resigning, pay rises and the employer who refuses.',
  resume: `Statutory Maternity Pay (SMP) is paid by your employer for up to ${F.smpWeeks} weeks when you stop work to have a baby. You qualify if you have been employed by the same employer for at least ${F.serviceWeeks} weeks continuing into the qualifying week, the ${F.qualifyingWeekBeforeEWC}th week before the week the baby is due, and if your average weekly earnings over the ${X.relevantPeriodWeeks}-week relevant period reach the lower earnings limit of ${g(LEL)}. You must also give ${F.noticeDaysPay} days’ notice of the date you want SMP to start and hand over medical proof of the due date, usually the MATB1 certificate. In 2026/27 the first ${F.smpHigherRateWeeks} weeks pay ${pc} of your average earnings and the other ${later} pay ${g(FAMILY_RATE, 2)} or ${pc} if lower, so a woman earning ${g(500)} a week receives ${g(rows[3].s.total, 2)} before tax. SMP is taxed like wages, it is still owed if you resign after qualifying, and you never repay it if you decide not to go back.`,
  faqs: [
    { q: 'I am on a fixed-term contract that ends before my baby is due. Can I still get SMP?', a: `Yes, provided you already met both tests. nidirect states the rule plainly: once you satisfy the continuous employment and earnings rules, the employer must pay SMP even if the contract ends at any time after the start of the ${F.qualifyingWeekBeforeEWC}th week before the expected week of childbirth. If the contract ends earlier, look at Maternity Allowance instead.` },
    { q: 'Do I get double SMP if I am expecting twins?', a: `No. SMP is the same for a multiple birth as for one baby: ${F.smpWeeks} weeks, ${F.smpHigherRateWeeks} at ${pc} of earnings and the rest at ${g(FAMILY_RATE, 2)} or ${pc}. What can double is the number of employers paying it: with two jobs, each employer that you qualify with pays SMP on its own earnings.` },
    { q: 'My employer says I gave my MATB1 too late. Can they refuse SMP?', a: `Proof is due within ${X.proofDaysAfterSmpStart} days of the SMP start date, but the employer can accept it later. GOV.UK’s employer guide says SMP does not have to be paid if no proof of the due date has arrived ${X.proofLatestWeeksAfterSmpStart} weeks after SMP was due to start. Between those two points a reasonable delay should not cost you the payment.` },
    { q: 'Does a backdated pay rise change the SMP I have already been paid?', a: `It can. If a rise takes effect at any point between the start of the relevant period and the end of your maternity leave, SMP is recalculated as if the higher pay applied throughout and the arrears are paid. HMRC allows a claim for ${X.smpRecalcYearsIfEmployed} years if you are still employed, ${X.smpRecalcMonthsIfLeft} months after you leave.` },
    { q: 'Can I get SMP if I have only just changed jobs?', a: `Usually not from the new employer, because the ${F.serviceWeeks}-week service test restarts with each employer and has to be met by the end of the qualifying week. Some breaks and transfers between employers count as continuous. If you fail the test, the new employer issues form SMP1 and you claim Maternity Allowance, which looks at work for any employer in the ${F.maTestPeriodWeeks} weeks before the due week.` },
  ],
  body: (h) => `
<h2>The two tests: service and earnings</h2>
<p><strong>Service.</strong> You must have worked for the employer without a break for ${F.serviceWeeks} weeks by the end of the qualifying week, and at least one day of that employment must fall inside the qualifying week itself (${h.src('fam_nidSmpEligibility', 'nidirect, SMP eligibility')}). Weeks are counted Sunday to Saturday, so the latest possible start date is a Sunday ${F.serviceWeeks - 1} weeks before the qualifying week ends. Agency workers meet the rule if they worked in each of those weeks, and a single day counts as a full week.</p>
<p><strong>Earnings.</strong> Your average weekly earnings in the relevant period must be at least the lower earnings limit in force on the Saturday that ends the qualifying week: ${h.gbp(LEL)} in 2026/27, ${h.gbp(F.lowerEarningsLimit[F.lowerEarningsLimit.length - 2].lel)} the year before. The average is taken over the ${X.relevantPeriodWeeks} weeks or two months of pay before that week, overtime, bonuses and sick pay included, as ${h.a('smp-average-weekly-earnings', 'the guide to SMP average weekly earnings')} explains. Hours do not matter: a part-timer on ${h.gbp(150)} a week qualifies, someone on ${h.gbp(120)} does not.</p>
<p>Maternity <em>leave</em> has neither test. Every employee can take ${F.maternityLeaveWeeks} weeks of leave from the first day in the job; it is only the money that needs ${F.serviceWeeks} weeks and the earnings threshold.</p>

<h2>What SMP is worth at five levels of pay</h2>
<p>The amount depends on one number, your average weekly earnings. Above ${h.gbp(crossover, 2)} a week, ${pc} of pay exceeds the flat rate, so the later weeks are capped at ${h.gbp(FAMILY_RATE, 2)}; below it, every week pays ${pc} of earnings. The table is computed for a leave starting on ${h.date(start)}, when all ${F.smpWeeks} weeks fall in the 2026/27 rate year.</p>
${h.table(['Average weekly earnings', `Weeks 1 to ${F.smpHigherRateWeeks}, each`, `Weeks ${F.smpHigherRateWeeks + 1} to ${F.smpWeeks}, each`, `Total, ${F.smpWeeks} weeks`],
    rows.map(({ awe, s }) => [h.gbp(awe), h.gbp(s.weeks[0].amount, 2), h.gbp(s.weeks[F.smpWeeks - 1].amount, 2), h.gbp(s.total, 2)]),
    'Gross SMP, 2026/27 rates, computed with the site’s SMP engine.', ['r', 'r', 'r', 'r'])}
<p>The step between the last two rows shows where the money goes: a higher earner gains only in the first ${F.smpHigherRateWeeks} weeks, because the flat rate is the same for everyone afterwards. A ${h.gbp(800)} earner receives about ${h.num(rows[4].s.total / (800 * F.smpWeeks) * 100, 0)}% of the pay they would have earned over the ${F.smpWeeks} weeks; a ${h.gbp(215)} earner keeps ${pc} throughout. For your own dates, including weeks that cross April, use the ${h.a('maternity-pay-calculator', 'maternity pay calculator')}.</p>

<h2>Notice, proof and the employer’s replies</h2>
<ol>
<li>By the end of the qualifying week, tell your employer you are pregnant, the due date and when you want leave to start.</li>
<li>At least ${F.noticeDaysPay} days before SMP is to start, say so, in writing if the employer asks. Usually it is the same day as leave.</li>
<li>Give medical evidence of the due date within ${X.proofDaysAfterSmpStart} days of the SMP start: a letter from a doctor or midwife, or the MATB1, which can be issued no earlier than ${X.matb1WeeksBeforeDue} weeks before the due date. Leave itself needs no proof.</li>
<li>The employer confirms within ${X.employerConfirmDays} days how much SMP you will receive and the start and end dates.</li>
</ol>
<p>An employer who decides you do not qualify must give you form SMP1 within ${X.smp1Days} days of that decision, with your MATB1 back. The SMP1 is the document Jobcentre Plus asks for when you claim ${h.a('maternity-allowance', 'Maternity Allowance')}, so ask for it if a refusal is only verbal. If you think the employer is wrong about eligibility or the amount, ask them to explain in writing and, failing that, contact HMRC’s Statutory Payment Disputes Team, which can make a formal decision.</p>

<h2>Leaving the job, before or after the birth</h2>
<p>SMP follows the woman, not the job. Once you have met both tests, the employer must pay the full ${F.smpWeeks} weeks even if you resign, are dismissed or reach the end of a contract (${h.src('fam_spmLeaving', 'HMRC, SPM200600')}). Payments stop early only if, after the birth, you start working for an employer who did not employ you in the qualifying week; it is up to you to tell the former employer. Nothing has to be paid back if you decide not to return to work. A contractual scheme that pays more than SMP is a different matter: its conditions are set by the contract, and ${h.a('enhanced-maternity-pay', 'enhanced maternity pay')} looks at the clauses that ask for money back.</p>

<h2>Pay rises during the relevant period or the leave</h2>
<p>A pay rise that applies to any part of the period from the start of the relevant period to the end of maternity leave is treated as if it had applied in every week of the relevant period (SMP (General) Regulations 1986, regulation 21(7), and ${h.src('fam_spmBackdatedPay', 'HMRC, SPM172200')}). The employer recalculates average weekly earnings, which raises the first ${F.smpHigherRateWeeks} weeks and, for low earners, the later weeks too, and pays the difference. A rise can also lift someone over the lower earnings limit after the event; HMRC then tells the employer to allow for any Maternity Allowance already received.</p>

<h2>Tax, deductions and who pays the bill</h2>
<p>SMP is earnings: income tax and National Insurance are deducted, and so can pension contributions and trade union subscriptions that normally come out of pay. It is paid on your usual paydays. The employer recovers ${h.pct(F.standardRecovery, 0)} of what it pays from HMRC, or ${h.pct(F.smallEmployerRecovery, 0)} if its Class 1 National Insurance bill for the previous tax year was ${h.gbp(F.smallEmployerNicThreshold)} or less (${h.src('hmrcRates', 'HMRC rates and thresholds 2026 to 2027')}). SMP must still be paid if the employer stops trading; if it is insolvent and cannot pay, the Statutory Payment Disputes Team deals with the claim.</p>
<p>The rules are the same in Northern Ireland, where SMP has the same rate and lower earnings limit. SMP ends early if you are taken into legal custody during the pay period, and it is still paid if the baby is stillborn after the start of the ${X.stillbirthFromWeekOfPregnancy}th week of pregnancy or dies after birth.</p>
`,
});
