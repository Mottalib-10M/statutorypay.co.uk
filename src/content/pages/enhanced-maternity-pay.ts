import { definePage } from '../../lib/guide-types';
import { FAMILY_RATE, LEL, P } from '../../lib/engine/params';
import { smpSchedule } from '../../lib/engine/family';
import { firstSundayOfApril } from '../../lib/engine/dates';
import { formatMoney } from '../../lib/format';

const g = (n: number, d = 0) => formatMoney(n, d);
const F = P.familyPay;
const pc = `${Math.round(F.earningsShare * 100)}%`;
const h_pct = (x: number) => `${Math.round(x * 100)}%`;
const start = firstSundayOfApril(P.year);
const pay = 650;
const smp = smpSchedule(pay, start);
/** Scheme pay includes SMP: each week pays the higher of the scheme amount and the SMP due (HMRC SPM182600). */
function scheme(full: number, half: number, halfPlusSmp = false) {
  const weeks = Math.max(F.smpWeeks, full + half);
  let total = 0;
  for (let n = 1; n <= weeks; n++) {
    const s = n <= F.smpWeeks ? smp.weeks[n - 1].amount : 0;
    const contractual = n <= full ? pay : n <= full + half ? (halfPlusSmp ? pay / 2 + s : pay / 2) : 0;
    total += Math.max(contractual, s);
  }
  return total;
}
const schemes = [
  { label: 'Statutory Maternity Pay only', total: smp.total },
  { label: '6 weeks full pay, then SMP', total: scheme(6, 0) },
  { label: '12 weeks full pay, 12 weeks half pay', total: scheme(12, 12) },
  { label: '12 weeks full pay, 12 weeks half pay plus SMP', total: scheme(12, 12, true) },
  { label: '26 weeks full pay', total: scheme(26, 0) },
];
// A half-pay week that falls below SMP for a lower earner.
const lowPay = 300;
const lowSmpWeek = smpSchedule(lowPay, start).weeks[F.smpWeeks - 1].amount;

export default definePage({
  id: 'enhanced-maternity-pay',
  group: 'family',
  order: 60,
  mini: 'enhancedCompare',
  miniHref: 'maternity-pay-calculator',
  related: ['statutory-maternity-pay', 'maternity-pay-calculator', 'keeping-in-touch-days', 'shared-parental-pay-calculator', 'company-sick-pay-vs-ssp'],
  sources: ['fam_spmOffset', 'nidSmp', 'govEmployerSmp', 'govMaternityPay', 'fam_nidMaternityRights', 'hmrcRates'],
  slug: 'enhanced-maternity-pay',
  nav: 'Enhanced maternity pay',
  card: 'Company maternity schemes against the statutory floor, and the clauses to read before you sign.',
  title: 'Enhanced Maternity Pay 2026: Company Schemes vs Statutory',
  description: `Enhanced maternity pay in 2026: how company schemes include SMP at ${g(FAMILY_RATE, 2)}, full and half pay compared over ${F.smpWeeks} weeks, and repayment clauses if you leave.`,
  h1: 'Enhanced maternity pay: what a company scheme really adds',
  intro: 'Full pay for a few months sounds simple. The value depends on whether SMP is inside or on top of the scheme, and on what you agree to pay back.',
  resume: `Enhanced, or occupational, maternity pay is anything an employer pays above Statutory Maternity Pay under the contract or a staff policy: typically a number of weeks at full pay followed by weeks at half pay. Check your policy: most schemes include SMP in the payment rather than adding it. HMRC lets an employer treat contractual maternity pay for a week as paying the SMP due for that week, and nidirect puts it plainly: SMP counts towards any maternity payments your employer makes. So a scheme of 12 weeks’ full pay and 12 weeks’ half pay, for someone on ${g(pay)} a week, is worth ${g(schemes[2].total, 2)} over the ${F.smpWeeks} weeks, against ${g(smp.total, 2)} from SMP alone at 2026/27 rates. No week can fall below the SMP due. Repayment clauses, which ask for the enhanced part back if you do not return, are contractual only: SMP itself is never repayable.`,
  faqs: [
    { q: 'Is my company maternity pay paid on top of SMP or does it include it?', a: `Unless your policy says otherwise, assume it includes it. The employer can count its own maternity payment for a week towards the SMP due for that week, and the other way round. A policy that promises “half pay plus SMP” is more generous than one that promises “half pay including SMP”, so read the exact words in the handbook or contract.` },
    { q: 'Do I have to pay back enhanced maternity pay if I do not go back to work?', a: `Only if a repayment clause is part of your contract or of a policy you agreed to. Such clauses typically ask for a return to work for a set period and the exact wording decides what is owed. They can only reach the enhanced part: Statutory Maternity Pay is not repayable if you decide not to return, as nidirect confirms. Ask for the clause in writing before your leave starts.` },
    { q: 'My scheme pays half pay. Can a half-pay week ever be less than SMP?', a: `No. If the contractual payment for a week is lower than the SMP due, the employer must make up the difference. On ${g(lowPay)} a week, half pay is ${g(lowPay / 2)} while SMP in the later weeks is ${g(lowSmpWeek, 2)}, so ${g(lowSmpWeek, 2)} is paid. Payments from a scheme funded by employees cannot be counted towards SMP.` },
    { q: 'Is enhanced maternity pay taxed like my salary?', a: `Yes. Company maternity pay and SMP are both earnings, so they go through payroll with income tax and National Insurance deducted on your normal payday. The usual deductions, pension contributions and union subscriptions for example, can continue. Only the employer’s recovery from HMRC is limited to the statutory part, at ${h_pct(F.standardRecovery)} or ${h_pct(F.smallEmployerRecovery)}.` },
    { q: 'Does my employer keep paying into my pension during enhanced maternity pay?', a: `nidirect sets out the rule for Northern Ireland: an employer that contributes to an occupational scheme must carry on its usual contributions for the whole of ordinary maternity leave and for any period in which you receive SMP or contractual maternity pay. Your own contributions are based on the maternity pay you actually receive.` },
  ],
  body: (h) => `
<h2>How SMP sits inside a company scheme</h2>
<p>Statutory Maternity Pay is a floor, and an employer’s scheme is built on top of it. HMRC’s manual (${h.src('fam_spmOffset', 'SPM182600')}) allows an employer who pays wages or occupational maternity pay for a week in which SMP is due to treat that payment as SMP, or the SMP as part of that payment. If the contractual amount is lower than the SMP for that week, the employer pays the difference. What this means for you: under “full pay” the payslip shows your salary, part of which is labelled SMP, and you do not get SMP on top of it.</p>
<p>Some policies are written the other way, with half pay <em>plus</em> SMP. The difference is large, as the table shows. It is one line in a handbook, so read it.</p>
<p>For the employer, the enhancement is money it cannot get back. ${h.src('govEmployerSmp', 'GOV.UK’s employer guide')} says that even when an employer pays more than the statutory amount, it can usually reclaim only ${h.pct(F.standardRecovery, 0)} of the statutory part from HMRC, or ${h.pct(F.smallEmployerRecovery, 0)} under Small Employers’ Relief. That cost is the reason schemes come with conditions, and the reason they are worth reading line by line before you plan your leave.</p>

<h2>Five patterns compared</h2>
<p>All figures assume normal pay of ${h.gbp(pay)} a week and a leave starting on ${h.date(start)}, so that the statutory weeks are priced at the 2026/27 rate (${h.gbp(smp.weeks[0].amount, 2)} for ${F.smpHigherRateWeeks} weeks, then ${h.gbp(FAMILY_RATE, 2)}). Each week pays the higher of the scheme amount and the SMP due.</p>
${h.table(['Scheme', 'Total over the paid weeks', 'Gain over SMP alone'], schemes.map((s) => [s.label, h.gbp(s.total, 2), h.gbp(s.total - smp.total, 2)]), `Gross amounts, ${h.gbp(pay)} a week, SMP included in each scheme unless stated.`, ['l', 'r', 'r'])}
<p>Two things stand out. Six weeks at full pay adds less than people expect, because SMP already pays ${pc} of salary in those weeks: the gain is only the missing ${h.pct(1 - F.earningsShare, 0)}. And in the half-pay weeks of an “including SMP” scheme, the enhanced part is only the gap between half pay and the flat ${h.gbp(FAMILY_RATE, 2)}, which shrinks to nothing for anyone on less than ${h.gbp(FAMILY_RATE * 2, 2)} a week. The mini-calculator above runs the same comparison for your own pay and scheme.</p>

<h2>Conditions schemes attach</h2>
<p>The statutory scheme has two tests, ${F.serviceWeeks} weeks of service by the qualifying week and earnings of ${h.gbp(LEL)} a week. A company scheme can set its own, such as a longer service requirement or a promise to come back for a minimum period. These conditions come from the contract, not from statute, so they differ from one employer to the next. If you do not meet them you still receive SMP, which no contract can reduce: GOV.UK says an employer cannot offer less than the statutory amount.</p>
<h3>Repayment clauses</h3>
<p>A clawback clause asks for some or all of the enhanced pay back if you do not return to work, or if you leave within a set period after returning. Points to check in the wording:</p>
<ul>
<li>whether you signed or otherwise agreed to it before the leave began;</li>
<li>whether it is limited to the enhanced part, since SMP itself is never repaid;</li>
<li>what counts as returning: a part-time or flexible return, a return followed by a second maternity leave, or redundancy before the return date;</li>
<li>whether repayment tapers with the time you stay after coming back.</li>
</ul>
<p>Acas in Great Britain and the Labour Relations Agency in Northern Ireland can explain how such clauses are read; disputes about contractual pay go to an employment tribunal, or an industrial tribunal in Northern Ireland.</p>

<h2>What the scheme does not change</h2>
<p>Statutory rights run alongside the company scheme. You still accrue holiday during the whole of your leave, you can still work up to ${F.kitDays} ${h.a('keeping-in-touch-days', 'keeping in touch days')}, and ${h.a('statutory-maternity-pay', 'SMP')} remains payable even if you resign after qualifying. If you plan to end maternity leave early and share the rest, check whether your employer also enhances ${h.a('shared-parental-pay-calculator', 'shared parental pay')} too before converting weeks. Northern Ireland applies the same rules on how statutory and contractual pay combine (${h.src('nidSmp', 'nidirect, SMP: how it is worked out')}).</p>
`,
});

