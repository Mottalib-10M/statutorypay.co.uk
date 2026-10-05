import { definePage } from '../../lib/guide-types';
import { FAMILY_RATE, LEL, P } from '../../lib/engine/params';
import { computeSpp } from '../../lib/engine/family';
import { formatMoney } from '../../lib/format';

const g = (n: number, d = 0) => formatMoney(n, d);
const F = P.familyPay;
const X = P.familyExtra;
const pc = `${Math.round(F.earningsShare * 100)}%`;
// Worked examples computed by the engine: the calculator's defaults, then a recent starter.
const base = { dueDate: '2027-01-18', awe: 690, weeks: 2 as const, leaveStart: '2027-01-18' };
const ex = computeSpp({ ...base, employmentStart: '2025-11-03', jurisdiction: 'GB' });
const exNI = computeSpp({ ...base, employmentStart: '2025-11-03', jurisdiction: 'NI' });
const newGB = computeSpp({ ...base, employmentStart: '2026-06-01', jurisdiction: 'GB' });
const newNI = computeSpp({ ...base, employmentStart: '2026-06-01', jurisdiction: 'NI' });
const low = computeSpp({ ...base, awe: 180, employmentStart: '2025-11-03', jurisdiction: 'GB' });

export default definePage({
  id: 'paternity-pay-calculator',
  group: 'family',
  order: 80,
  tool: 'paternity',
  related: ['paternity-leave-2026', 'shared-parental-pay-calculator', 'smp-average-weekly-earnings', 'unpaid-parental-leave', 'northern-ireland-employment-rights'],
  sources: ['govPaternity', 'fam_govEmployerPaternity', 'era2025s16', 'hmrcRates', 'nidPaternityLeave', 'nidPaternityPay'],
  slug: 'paternity-pay-calculator',
  nav: 'Paternity pay calculator',
  card: 'Statutory Paternity Pay and the leave deadline, with the Great Britain and Northern Ireland rules.',
  title: `Paternity Pay Calculator 2026/27: SPP at ${g(FAMILY_RATE, 2)}, GB and NI`,
  description: `Paternity pay calculator 2026/27: SPP of ${g(FAMILY_RATE, 2)} or ${pc} for 1 or ${F.paternityWeeks} weeks, ${F.serviceWeeks} weeks’ service and ${g(LEL)} earnings, and day-one leave in GB since April 2026.`,
  h1: 'Paternity pay calculator for Great Britain and Northern Ireland',
  intro: 'Where you work, the due date, your start date and your pay: the calculator separates the right to leave from the right to be paid, which since April 2026 no longer go together in Great Britain.',
  resume: `Statutory Paternity Pay (SPP) is ${g(FAMILY_RATE, 2)} a week, or ${pc} of average weekly earnings if that is less, for one week or two. To be paid it you must have worked for the employer for ${F.serviceWeeks} weeks by the end of the qualifying week, the ${F.qualifyingWeekBeforeEWC}th week before the baby is due, still be employed on the day of the birth and earn at least ${g(LEL)} a week on average. The leave works differently. In England, Scotland and Wales, section 16 of the Employment Rights Act 2025 removed the qualifying period from 6 April 2026, so paternity leave is now a right from the first day in the job, and the two weeks can be taken together or separately at any time in the ${F.paternityWindowWeeksGB} weeks after the birth. Northern Ireland still requires ${F.serviceWeeks} weeks’ service for the leave and a single block within ${F.paternityWindowDaysNI} days. Two paid weeks at the flat rate come to ${g(ex.schedule.total, 2)} before tax.`,
  faqs: [
    { q: 'Why does the paternity pay calculator say I can take leave but will not be paid?', a: `Because in Great Britain the two rights now have different conditions. Leave needs only employee status and the right notice; pay still needs ${F.serviceWeeks} weeks of service by the qualifying week and earnings of at least ${g(LEL)} a week. A father who joined the employer after the start date shown under the field gets unpaid paternity leave, and may be able to claim Universal Credit for those weeks.` },
    { q: 'Is a week of paternity leave five days if I work three days a week?', a: `No. A week of paternity leave is the number of days you normally work in a week, so for a three-day pattern it is three working days, and two weeks are six. The pay is still a weekly amount: SPP of up to ${g(FAMILY_RATE, 2)} for each week of leave, however many days that week contains.` },
    { q: 'I have two jobs. Can both employers pay me paternity pay?', a: `Yes, if you meet the service and earnings conditions in each job separately: nidirect confirms that someone with more than one job may get Statutory Paternity Pay from each employer. Run the calculator once for each job with that job’s start date and average pay.` },
    { q: 'What does my employer have to give me if it refuses paternity pay?', a: `Form SPP1, within ${X.sppRefusalDays} days of your request, explaining why you do not qualify. You can then ask for a written statement of the reasons. If you still think the decision is wrong, HMRC’s Statutory Payment Disputes Team can make a formal decision on entitlement.` },
  ],
  body: (h) => `
<h2>The example in the calculator</h2>
<p>The calculator opens on a baby due on ${h.date(ex.dates.dueDate)}, a father who started on ${h.date('2025-11-03')} and earns ${h.gbp(690)} a week, taking two weeks from the due date. The qualifying week runs from ${h.date(ex.dates.qwStart)} to ${h.date(ex.dates.qwEnd)}, so the latest start date that meets the service test for pay is ${h.date(ex.dates.startedBy)}. He qualifies for both leave and pay: ${ex.schedule.weeks.length} weeks at ${h.gbp(ex.schedule.weeks[0].amount, 2)}, ${h.gbp(ex.schedule.total, 2)} in all. Working in Great Britain, he has until ${h.date(ex.windowEnd)} to finish the leave; in Northern Ireland the last day would be ${h.date(exNI.windowEnd)}.</p>
${h.table(['Situation', 'Leave in GB', 'Leave in NI', 'Pay'], [
    [`Started ${h.date('2025-11-03')}, ${h.gbp(690)} a week`, ex.leaveEligible ? 'Yes' : 'No', exNI.leaveEligible ? 'Yes' : 'No', ex.payEligible ? h.gbp(ex.schedule.total, 2) : 'Not due'],
    [`Started ${h.date('2026-06-01')}, ${h.gbp(690)} a week`, newGB.leaveEligible ? 'Yes, day-one right' : 'No', newNI.leaveEligible ? 'Yes' : 'No', newGB.payEligible ? h.gbp(newGB.schedule.total, 2) : 'Not due'],
    [`Started ${h.date('2025-11-03')}, ${h.gbp(180)} a week`, low.leaveEligible ? 'Yes' : 'No', exNI.leaveEligible ? 'Yes' : 'No', low.payEligible ? `${h.gbp(low.schedule.total, 2)} (${pc} of pay)` : 'Not due'],
  ], `Baby due ${h.date(ex.dates.dueDate)}, two weeks of leave.`, ['l', 'l', 'l', 'r'])}
<p>The second row is the case the 2026 reform was written for. In Great Britain a father who joined in June 2026 can take two weeks of paternity leave, with his employment rights protected during it, but without SPP. In Northern Ireland he has no statutory paternity leave at all and would need holiday or his employer’s goodwill. The third row shows the ${pc} rule: on ${h.gbp(180)} a week, ${pc} is below the flat rate, so each week pays ${h.gbp(low.schedule.weeks[0].amount, 2)}.</p>

<h2>What the calculator checks</h2>
<ul>
<li><strong>Service for pay:</strong> employment that began on or before the date shown, so that ${F.serviceWeeks} weeks are completed by the end of the qualifying week. A baby born early does not change this: you qualify if you would have reached the ${F.serviceWeeks} weeks.</li>
<li><strong>Earnings:</strong> average weekly earnings over the ${X.relevantPeriodWeeks}-week relevant period of at least ${h.gbp(LEL)}, worked out like ${h.a('smp-average-weekly-earnings', 'SMP average weekly earnings')}.</li>
<li><strong>The deadline:</strong> ${F.paternityWindowWeeksGB} weeks from the birth in Great Britain, counted from the due date if the baby is early; ${F.paternityWindowDaysNI} days in Northern Ireland.</li>
<li><strong>The pattern:</strong> one or two weeks, separate or together in Great Britain; one block of one week or two consecutive weeks in Northern Ireland.</li>
</ul>
<p>It does not check notice. You must tell your employer the due date by the end of the qualifying week, ${h.date(ex.dates.noticeBy)} in the example, and give ${X.paternityStartChangeNoticeDays} days’ notice of when each week of leave starts. The rules for notice, the antenatal appointments and the reform itself are in ${h.a('paternity-leave-2026', 'paternity leave since April 2026')}. SPP is taxed like wages and paid on your usual payday; your employer recovers most of it from HMRC.</p>
`,
});
