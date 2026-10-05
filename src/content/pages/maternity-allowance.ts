import { definePage } from '../../lib/guide-types';
import { FAMILY_RATE, LEL, P } from '../../lib/engine/params';
import { birthDates, maternityAllowance, smpSchedule } from '../../lib/engine/family';
import { addDays, addWeeks, firstSundayOfApril } from '../../lib/engine/dates';
import { formatMoney } from '../../lib/format';

const g = (n: number, d = 0) => formatMoney(n, d);
const F = P.familyPay;
const X = P.familyExtra;
const pc = `${Math.round(F.earningsShare * 100)}%`;
const start = firstSundayOfApril(P.year);
// Engine figures: Maternity Allowance at several earnings levels, and SMP for comparison.
const levels = [60, 120, 180, 215, 400].map((awe) => ({ awe, ma: maternityAllowance({ awe, payStart: start }), smp: awe >= LEL ? smpSchedule(awe, start).total : 0 }));
// Test period for a baby due on 15 March 2027.
const b = birthDates('2027-03-15');
const testStart = addWeeks(b.ewcStart, -F.maTestPeriodWeeks);
const testEnd = addDays(b.ewcStart, -1);
const fullMa = FAMILY_RATE * F.maWeeks;

export default definePage({
  id: 'maternity-allowance',
  group: 'family',
  order: 50,
  mini: 'maQuick',
  miniHref: 'maternity-pay-calculator',
  related: ['statutory-maternity-pay', 'maternity-pay-calculator', 'smp-average-weekly-earnings', 'keeping-in-touch-days', 'shared-parental-pay-calculator'],
  sources: ['govMaternityAllowance', 'fam_nidMaternityAllowance', 'govMaternityPay', 'hmrcRates', 'upratingOrder2026'],
  slug: 'maternity-allowance',
  nav: 'Maternity Allowance',
  card: 'The state payment for mothers who cannot get SMP: the test period, the three rates and how to claim.',
  title: `Maternity Allowance 2026/27: ${g(FAMILY_RATE, 2)} a Week if No SMP`,
  description: `Maternity Allowance 2026/27: up to ${g(FAMILY_RATE, 2)} a week for ${F.maWeeks} weeks if you earned ${g(F.maEarningsThreshold)} a week in ${X.maEarningWeeks} of the ${F.maTestPeriodWeeks} weeks before the due week. Self-employed rules too.`,
  h1: 'Maternity Allowance: the payment when SMP is not due',
  intro: 'Paid by the state rather than the employer, with a far lower earnings bar than SMP and its own route for the self-employed.',
  resume: `Maternity Allowance (MA) is a benefit paid by the Department for Work and Pensions, or the Department for Communities in Northern Ireland, to women who cannot get Statutory Maternity Pay. An employed woman, or one who has recently stopped work, gets ${g(FAMILY_RATE, 2)} a week or ${pc} of her average weekly earnings, whichever is less, for up to ${F.maWeeks} weeks, if in the ${F.maTestPeriodWeeks} weeks before the week the baby is due she was employed or self-employed for at least ${F.maMinWeeksWorked} weeks and earned at least ${g(F.maEarningsThreshold)} a week in ${X.maEarningWeeks} of them, which need not be consecutive. A self-employed woman gets between ${g(F.maLowRate, 2)} and ${g(FAMILY_RATE, 2)} depending on how many weeks of Class 2 National Insurance were paid. A woman who works unpaid in her spouse’s or civil partner’s self-employed business can get ${g(F.maLowRate, 2)} a week for ${X.maSpouseWeeks} weeks. You can claim once you have been pregnant for ${X.maClaimFromPregnancyWeek} weeks, and payment can start from the ${F.earliestStartWeeksBeforeEWC}th week before the due week.`,
  faqs: [
    { q: 'Does Maternity Allowance reduce my Universal Credit?', a: `Yes. GOV.UK says your Universal Credit payment is reduced by an amount equal to your Maternity Allowance, so the household gains nothing from MA on top of a full Universal Credit award. You may still get the extra amount of Universal Credit for children, and help with childcare costs. Report the start of MA on your Universal Credit account straight away.` },
    { q: 'Can I work a few days while getting Maternity Allowance?', a: `Up to ${F.kitDays} keeping in touch days, without losing any allowance. You must still report each of them to the Maternity Allowance helpline. Any work beyond those days, or starting a new job, has to be reported too and can stop or reduce the allowance; failing to report a change can mean repaying an overpayment and a ${g(X.maLateReportPenalty)} fine.` },
    { q: 'How long does a Maternity Allowance claim take to be decided?', a: `GOV.UK says a decision usually arrives within ${X.maDecisionWorkingDaysGB} working days; nidirect gives an average of ${X.maDecisionWorkingDaysNI} working days in Northern Ireland. Claim as soon as you reach ${X.maClaimFromPregnancyWeek} weeks of pregnancy, because the full amount is only paid if the claim is made within ${X.maFullBackdateMonths} months of the date you want MA to start.` },
    { q: 'I am self-employed and have not paid Class 2. What will I receive?', a: `The minimum, ${g(F.maLowRate, 2)} a week for ${F.maWeeks} weeks, unless you top up. HMRC contacts you after the claim with the number of voluntary contributions needed; once they are linked to the claim the rate rises, up to ${g(FAMILY_RATE, 2)}, and is backdated. Paying for ${X.maClass2WeeksForFullRate} of the ${F.maTestPeriodWeeks} weeks gives the standard rate.` },
    { q: 'Is Maternity Allowance paid weekly like SMP?', a: `No. It goes straight into your bank, building society or credit union account every two or four weeks, not through payroll. Statutory Maternity Pay, by contrast, is paid by your employer on your usual payday, with tax and National Insurance deducted. MA lasts the same ${F.maWeeks} weeks as SMP, so the last ${X.maUnpaidWeeksOfLeave} weeks of a full year off are unpaid.` },
  ],
  body: (h) => `
<h2>Who it is for</h2>
<p>Maternity Allowance fills the gaps left by SMP. The typical claimants are women who changed jobs during pregnancy and so lack ${F.serviceWeeks} weeks with the current employer, women whose average pay falls below the ${h.gbp(LEL)} lower earnings limit, the self-employed, and women who stopped work shortly before or during pregnancy. It does not matter if you had several jobs or gaps of unemployment in the test period. An employer who refuses SMP gives you form SMP1, which you send with the claim.</p>
<p>The test period is the ${F.maTestPeriodWeeks} weeks before the week your baby is due. For a baby due on ${h.date(b.dueDate)}, the expected week of childbirth starts on ${h.date(b.ewcStart)} and the test period runs from ${h.date(testStart)} to ${h.date(testEnd)}. Within it you need two things: ${F.maMinWeeksWorked} weeks in which you were employed or self-employed, in any job, and ${X.maEarningWeeks} weeks, not necessarily together, in which you earned at least ${h.gbp(F.maEarningsThreshold)}.</p>

<h2>The three rates</h2>
<h3>Employed or recently employed: ${h.gbp(FAMILY_RATE, 2)} or ${pc}</h3>
<p>The weekly amount is the lower of the standard rate and ${pc} of your average weekly earnings, for ${F.maWeeks} weeks. Unlike SMP there is no ${F.smpHigherRateWeeks}-week period at ${pc} of full pay, so for anyone earning well above ${h.gbp(FAMILY_RATE / F.earningsShare, 2)} a week, MA is worth less than SMP would have been. The table, computed with the site’s engine, compares the two for a leave starting on ${h.date(start)}.</p>
${h.table(['Average weekly earnings', 'MA a week', `MA, ${F.maWeeks} weeks`, `SMP, ${F.maWeeks} weeks, if eligible`], levels.map(({ awe, ma, smp }) => [h.gbp(awe), ma.eligible ? h.gbp(ma.schedule.weeks[0].amount, 2) : 'Not due', ma.eligible ? h.gbp(ma.schedule.total, 2) : '-', smp ? h.gbp(smp, 2) : 'Below the earnings limit']), `MA at the 2026/27 rate; SMP shown only where earnings reach ${h.gbp(LEL)}.`, ['r', 'r', 'r', 'r'])}
<p>The lower rows show where Maternity Allowance matters most: on ${h.gbp(60)} or ${h.gbp(120)} a week there is no SMP at all, but MA pays ${pc} of earnings for the full ${F.maWeeks} weeks.</p>
<h3>Self-employed: from ${h.gbp(F.maLowRate, 2)} to ${h.gbp(FAMILY_RATE, 2)}</h3>
<p>The self-employed rate depends on Class 2 National Insurance in the test period. To get the standard ${h.gbp(FAMILY_RATE, 2)} you need to have been registered with HMRC for ${F.maMinWeeksWorked} weeks of the ${F.maTestPeriodWeeks} and to have paid Class 2 for at least ${X.maClass2WeeksForFullRate} of them. With fewer contributions the rate is scaled down, and with none it is ${h.gbp(F.maLowRate, 2)}. Since April 2024, Class 2 is treated as paid for people with profits above the small profits threshold, but nidirect warns that a self-employed woman may still need voluntary contributions to reach the standard rate of Maternity Allowance. You may be paid ${h.gbp(F.maLowRate, 2)} at first while HMRC links the contributions to the claim; the difference is then backdated.</p>
<h3>Unpaid work in a spouse’s business: ${h.gbp(F.maLowRate, 2)} for ${X.maSpouseWeeks} weeks</h3>
<p>If for at least ${F.maMinWeeksWorked} of the ${F.maTestPeriodWeeks} weeks you took part, unpaid, in the self-employed business of your husband, wife or civil partner and were neither employed nor self-employed yourself, you can get ${h.gbp(F.maLowRate, 2)} a week for ${X.maSpouseWeeks} weeks, ${h.gbp(F.maLowRate * X.maSpouseWeeks, 2)} in all. Your spouse or civil partner must be registered as self-employed and paying Class 2 contributions over the same weeks.</p>

<h2>Claiming, step by step</h2>
<ol>
<li>Wait until you have been pregnant for ${X.maClaimFromPregnancyWeek} weeks.</li>
<li>Fill in form MA1, on paper or online and then printed.</li>
<li>Send original payslips as proof of earnings, the MATB1 or a doctor’s or midwife’s letter for the due date, and the SMP1 if your employer refused SMP.</li>
<li>Choose a start date between the ${F.earliestStartWeeksBeforeEWC}th week before the due week and the day after the birth, and claim within ${X.maFullBackdateMonths} months of it.</li>
</ol>
<p>If the claim is refused, you can ask for a mandatory reconsideration and then appeal. While the allowance is paid, tell the helpline about any return to work, a new job, a move abroad or becoming entitled to SMP. If you later qualify for ${h.a('statutory-maternity-pay', 'Statutory Maternity Pay')} because of a backdated pay rise, the employer allows for the Maternity Allowance already received.</p>

<h2>Northern Ireland</h2>
<p>The rates, the ${F.maTestPeriodWeeks}-week test period and the ${h.gbp(F.maEarningsThreshold)} threshold are the same, but the claim goes to the Department for Communities through a Jobs and Benefits office, with the same MA1 form (${h.src('fam_nidMaternityAllowance', 'nidirect, Maternity Allowance')}). MA alone gives ${h.gbp(fullMa, 2)} at most over ${F.maWeeks} weeks. On either side of the Irish Sea, a mother on MA can give notice to end it early so that unused weeks become ${h.a('shared-parental-pay-calculator', 'Statutory Shared Parental Pay')} for her partner, as GOV.UK’s shared parental guide explains; once ended, MA cannot restart.</p>
`,
});
