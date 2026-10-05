import { definePage } from '../../lib/guide-types';
import { CAP_GB, MAX_REDUNDANCY_GB, P } from '../../lib/engine/params';
import { computeNotice } from '../../lib/engine/notice';
import { computeRedundancy } from '../../lib/engine/redundancy';
import { leavingPay } from '../../lib/engine/holiday';
import { computeFinal } from '../../lib/engine/final';
import { displayDate, formatMoney } from '../../lib/format';

const d = (iso: string) => displayDate(iso, 'en-GB');
const T = P.termination.taxFreeThreshold;
// Worked case: made redundant with pay in lieu on 2 November 2026, every element from the engines.
const PAY = 720;
const nt = computeNotice({ start: '2014-06-16', noticeGiven: '2026-11-02', contractualWeeks: 8, weeklyPay: PAY });
const red = computeRedundancy({ dob: '1981-03-02', start: '2014-06-16', noticeGiven: '2026-11-02', end: '2026-11-02', weeklyPay: PAY });
const hol = leavingPay({ daysPerWeek: 5, yearStart: '2026-04-01', leave: '2026-11-02', taken: 9, weekPay: PAY });
const fin = computeFinal({ statutoryRedundancy: red.amount, extraRedundancy: 22000, noticeWeeks: nt.appliedWeeks, weeklyPay: PAY, holidayDays: Math.max(0, hol.days), daysPerWeek: 5, arrears: 0 });

export default definePage({
  id: 'final-pay-calculator',
  group: 'leaving',
  order: 50,
  tool: 'final',
  related: ['redundancy-pay-calculator', 'payment-in-lieu-of-notice', 'holiday-pay-when-leaving', 'redundancy-pay-tax', 'notice-period-calculator'],
  sources: ['hmrcTermination', 'govRedundancy', 'wtr14', 'govHoliday', 'lv_govInsolvent'],
  slug: 'final-pay-calculator',
  nav: 'Final pay calculator',
  card: 'Redundancy pay, notice, untaken holiday and arrears in one gross total, split at the tax threshold.',
  title: `Final Pay Calculator 2026: Notice, Holiday, Redundancy Pay`,
  description: `Final pay calculator for 2026: add redundancy pay, notice or pay in lieu, untaken holiday and arrears, and see what sits inside the ${formatMoney(T)} tax-free threshold.`,
  h1: 'Final pay calculator: everything owed when a job ends',
  intro: 'Put the separate amounts side by side, check them against your last payslip, and see which of them are taxed like wages.',
  resume: `Final pay is everything an employer owes on the day a job ends, and it usually comes from four separate rights. Statutory redundancy pay, worth up to ${formatMoney(MAX_REDUNDANCY_GB)} in Great Britain in 2026/27, is due after ${P.redundancy.qualifyingYears} years’ service when the job has gone, plus any enhanced amount your employer adds. Notice pay covers the notice period, whether you work it, spend it on garden leave or receive pay in lieu. Holiday pay covers statutory leave accrued but not taken, and is owed even after a dismissal for gross misconduct. Arrears are wages, overtime or commission already earned and still unpaid. Only the redundancy elements share the ${formatMoney(T)} tax-free threshold for termination payments; notice pay, holiday pay and arrears go through payroll and are taxed like salary. The calculator adds the four, shows the gross total and splits the redundancy money at the threshold.`,
  faqs: [
    { q: 'Is holiday pay still owed if I am sacked for gross misconduct?', a: `Yes, for statutory leave. GOV.UK states that employers must pay for untaken statutory leave even if the worker is dismissed for gross misconduct. Contractual leave above the ${P.holiday.statutoryWeeks} weeks can follow different rules set out in the contract. Notice pay, by contrast, is normally not due after a genuine gross misconduct dismissal, and redundancy pay does not arise.` },
    { q: 'Which parts of my final pay can be tax-free?', a: `Only redundancy money: statutory redundancy pay and any enhanced or ex gratia payment, together up to ${formatMoney(T)}. Notice pay, including pay in lieu, holiday pay, arrears and any bonus earned for work done are earnings, taxed through payroll. The calculator shows how much of your redundancy money sits under the threshold and how much is above it.` },
    { q: 'What should I enter as untaken holiday?', a: 'The days of leave you have accrued in the current leave year, minus those you have already taken, at the date employment ends. For statutory leave the accrued figure follows regulation 14 of the Working Time Regulations: your annual entitlement times the share of the leave year that has passed. The holiday pay on leaving page works it out from your dates.' },
    { q: 'My employer has gone bust. Who pays my final pay?', a: `You can apply to the government. GOV.UK lists redundancy pay, holiday pay, unpaid wages, overtime and commission, and statutory notice pay, each capped at ${formatMoney(CAP_GB)} a week for dismissals from ${d(P.redundancy.weeklyCapGB[P.redundancy.weeklyCapGB.length - 1].from)}. The insolvency practitioner gives you a case reference to apply with. In Northern Ireland, nidirect points to the NI Redundancy Payments Service.` },
  ],
  body: (h) => `
<h2>A worked example</h2>
<p>An employee born on ${d('1981-03-02')} started on ${d('2014-06-16')} and earns ${h.gbp(PAY)} a week, five days a week. On ${d('2026-11-02')} the job is made redundant with pay in lieu of an ${nt.contractualWeeks}-week contractual notice. The leave year started on ${d('2026-04-01')} and ${h.num(9)} days have been taken. Each line below comes from the site’s calculators:</p>
${h.table(['Element', 'How it is worked out', 'Gross amount'], [
    ['Statutory redundancy pay', `${h.num(red.weeks, 1)} weeks × ${h.gbp(red.weekUsed)} (service counted to ${d(red.extendedDate)})`, h.gbp(red.amount)],
    ['Enhanced redundancy pay', 'From the employer’s scheme', h.gbp(22000)],
    ['Pay in lieu of notice', `${nt.appliedWeeks} weeks (statutory, longer than the contract) × ${h.gbp(PAY)}`, h.gbp(fin.notice)],
    ['Untaken holiday', `${h.num(hol.days, 1)} days × ${h.gbp(hol.dayPay)}`, h.gbp(fin.holiday)],
    ['Total before tax', '', `<strong>${h.gbp(fin.total)}</strong>`],
  ], 'Computed with the redundancy, notice, holiday and final pay engines of this site.', ['l', 'l', 'r'])}
<p>The redundancy money comes to ${h.gbp(fin.redundancy)}: ${h.gbp(fin.withinThreshold)} falls inside the ${h.gbp(T)} threshold and ${h.gbp(fin.aboveThreshold)} is above it and taxable. The ${h.gbp(fin.earnings)} of notice and holiday pay is taxed as earnings whatever happens. Because the notice was paid in lieu, section 145(5) pushes the date used for service and age to ${d(red.extendedDate)}, the end of the ${red.statutoryNoticeWeeks} weeks of statutory notice.</p>

<h2>Checking your last payslip</h2>
<ul>
<li><strong>Wages to the last day.</strong> Normal pay up to the termination date, plus overtime and commission earned in the final period. If they are missing, enter them as arrears.</li>
<li><strong>Notice.</strong> The longer of the contract and the statute, priced at a week’s pay; see the ${h.a('notice-period-calculator', 'notice period calculator')}.</li>
<li><strong>Holiday.</strong> Accrued statutory leave not taken, priced at a day’s pay; the ${h.a('holiday-pay-when-leaving', 'holiday pay on leaving')} page shows the formula.</li>
<li><strong>Redundancy.</strong> The statutory figure from the ${h.a('redundancy-pay-calculator', 'redundancy pay calculator')}, and the enhanced amount, ideally shown on separate lines.</li>
</ul>
<p>Amounts are gross. This site does not work out income tax or National Insurance; it shows which part is sheltered by the threshold and which is not. For how the threshold works, see ${h.a('redundancy-pay-tax', 'redundancy pay and tax')}.</p>
`,
});
