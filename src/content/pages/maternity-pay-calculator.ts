import { definePage } from '../../lib/guide-types';
import { FAMILY_RATE, LEL, P } from '../../lib/engine/params';
import { computeSmp, smpSchedule, uprating } from '../../lib/engine/family';
import { formatMoney } from '../../lib/format';

const g = (n: number, d = 0) => formatMoney(n, d);
const F = P.familyPay;
const later = F.smpWeeks - F.smpHigherRateWeeks;
const pc = `${Math.round(F.earningsShare * 100)}%`;
const X = P.familyExtra;
const prevRate = F.rates[F.rates.length - 2].weekly;
// Worked example computed by the engine: the calculator's own defaults.
const ex = computeSmp({ dueDate: '2027-03-15', leaveStart: '2027-02-28', awe: 560, employmentStart: '2024-04-01' });
const exChange = uprating(P.year + 1, '2027-02-28');
// Leave that straddled the April 2026 change: old rate, then new rate.
const straddle = smpSchedule(560, '2026-01-04');
const oldWeeks = straddle.weeks.filter((w) => w.rule === 'flat' && w.amount === prevRate).length;
const newWeeks = straddle.weeks.filter((w) => w.rule === 'flat' && w.amount === FAMILY_RATE).length;

export default definePage({
  id: 'maternity-pay-calculator',
  group: 'family',
  order: 10,
  tool: 'smp',
  related: ['statutory-maternity-pay', 'smp-average-weekly-earnings', 'maternity-leave-dates-calculator', 'maternity-allowance', 'enhanced-maternity-pay', 'shared-parental-pay-calculator'],
  sources: ['govMaternityPay', 'govEmployerSmp', 'hmrcRates', 'upratingOrder2026', 'nidSmp', 'smartAnswers'],
  slug: 'maternity-pay-calculator',
  nav: 'Maternity pay calculator',
  card: 'Every week of SMP with its date and amount, from your due date and pay.',
  title: `Maternity Pay Calculator 2026/27: SMP Week by Week, ${g(FAMILY_RATE, 2)}`,
  description: `Maternity pay calculator 2026/27: SMP for ${F.smpWeeks} weeks, ${F.smpHigherRateWeeks} at ${pc} of pay then ${g(FAMILY_RATE, 2)} or ${pc}, with your qualifying week, eligibility check and every weekly pay date.`,
  h1: 'Maternity pay calculator, week by week',
  intro: `Give your due date, the day leave starts, your start date with the employer and your average pay: the calculator checks eligibility and prices each of the ${F.smpWeeks} weeks.`,
  resume: `Statutory Maternity Pay (SMP) lasts ${F.smpWeeks} weeks. For the first ${F.smpHigherRateWeeks} weeks it is ${pc} of your average weekly earnings before tax, with no ceiling; for the remaining ${later} weeks it is ${g(FAMILY_RATE, 2)} a week, or ${pc} of your earnings if that is less. To be paid it you need average earnings of at least ${g(LEL)} a week, the lower earnings limit, and ${F.serviceWeeks} weeks of continuous employment with the same employer by the end of the qualifying week, which is the ${F.qualifyingWeekBeforeEWC}th week before the week your baby is due. The flat rate goes up every April, but not on 6 April: the new figure starts with the first pay week beginning on or after the first Sunday of April, which is how HMRC’s own calculator applies it. Someone earning ${g(560)} a week whose baby is due on 15 March 2027 receives ${g(ex.schedule.total, 2)} in total before tax, according to this calculator, with ${ex.schedule.unknownRateWeeks} weeks priced at today’s rate because the 2027/28 rate is not yet published.`,
  faqs: [
    { q: 'Which pay figure do I type into the maternity pay calculator?', a: `Your average gross weekly earnings over the relevant period: roughly the ${X.relevantPeriodWeeks} weeks of pay up to the last payday before the end of your qualifying week. If you are paid monthly, switch the toggle to a yearly figure or convert two monthly payslips yourself. Use pay before tax and before any salary sacrifice deductions only if the sacrifice was not in place.` },
    { q: 'Why are some weeks in my schedule marked with a warning?', a: `Those weeks start after the April ${P.year + 1} change, when the flat rate of ${g(FAMILY_RATE, 2)} will be replaced by a new figure set in the next Up-rating Order. Until it is published, the calculator prices them at the current rate. The real amount will almost certainly be slightly higher, never lower.` },
    { q: 'Does the calculator account for a baby born before leave starts?', a: `Not automatically. If the baby arrives before the date you planned, leave and SMP start the day after the birth. Re-enter the day after the birth as the start of leave and the calculator recalculates the ${F.smpWeeks} weeks from there; the qualifying week and eligibility still come from the due date.` },
    { q: 'Can I start my maternity pay on a weekday rather than a Sunday?', a: `Yes. SMP weeks run from whatever day your pay starts, so a Wednesday start gives Wednesday-to-Tuesday pay weeks. Only the statutory weeks used for the qualifying week and the expected week of childbirth run Sunday to Saturday. The calculator lets you pick any start day from ${F.earliestStartWeeksBeforeEWC} weeks before the due week.` },
    { q: 'Is the result the amount that lands in my bank account?', a: `No, it is gross. SMP goes through payroll like a salary, so income tax, National Insurance and usually pension contributions are taken off. Your employer pays it on your normal paydays, which means a monthly-paid employee sees about four or five weeks of SMP added together on each payslip.` },
  ],
  body: (h) => `
<h2>Reading your schedule</h2>
<p>The headline is the total SMP for ${F.smpWeeks} weeks, before deductions. The first two lines split it between the earnings-related block and the later weeks, and the table below lists every pay week with its start date, end date and amount. With the example already filled in (pay of ${h.gbp(560)} a week, baby due on ${h.date(ex.dates.dueDate)}, leave from ${h.date('2027-02-28')}), the qualifying week runs from ${h.date(ex.dates.qwStart)} to ${h.date(ex.dates.qwEnd)} and employment must have started by ${h.date(ex.dates.startedBy)}. Weeks 1 to ${F.smpHigherRateWeeks} pay ${h.gbp(ex.schedule.weeks[0].amount, 2)} each, ${h.gbp(ex.schedule.first6, 2)} in all; each of the ${later} remaining weeks pays ${h.gbp(ex.schedule.weeks[F.smpWeeks - 1].amount, 2)}. SMP stops on ${h.date(ex.schedule.lastDay)} and leave, if all ${F.maternityLeaveWeeks} weeks are taken, on ${h.date(ex.leaveEnd)}. The request for SMP should reach the employer by ${h.date(ex.noticeForPay)}, ${F.noticeDaysPay} days before it starts.</p>
${h.table(['Pay weeks', 'From', 'To', 'Amount a week'], [
    [`1 to ${F.smpHigherRateWeeks}`, h.date(ex.schedule.weeks[0].start), h.date(ex.schedule.weeks[F.smpHigherRateWeeks - 1].end), h.gbp(ex.schedule.weeks[0].amount, 2)],
    [`${F.smpHigherRateWeeks + 1} to ${F.smpWeeks}`, h.date(ex.schedule.weeks[F.smpHigherRateWeeks].start), h.date(ex.schedule.lastDay), `${h.gbp(ex.schedule.weeks[F.smpWeeks - 1].amount, 2)} (provisional)`],
  ], `Example: ${h.gbp(560)} a week, due ${h.date(ex.dates.dueDate)}. Total ${h.gbp(ex.schedule.total, 2)} before tax.`, ['l', 'l', 'l', 'r'])}

<h2>The April uprating inside a single leave</h2>
<p>Because SMP runs for nine months, most pay periods cross an April. The rule HMRC applies is precise: the higher rate starts with the first SMP week that begins on or after the first Sunday in April, shifted to the weekday your pay weeks start on. In the example, pay weeks start on a Sunday, so the 2027 change would apply from ${h.date(exChange)}; every flat-rate week falls after it, so all ${ex.schedule.unknownRateWeeks} are flagged as provisional. A leave that began on ${h.date('2026-01-04')} shows the mechanism with known figures: ${oldWeeks} flat-rate weeks were paid at ${h.gbp(prevRate, 2)}, then ${newWeeks} at ${h.gbp(FAMILY_RATE, 2)} from ${h.date(F.rates[F.rates.length - 1].from)}. The earnings-related weeks never change, since ${pc} of your own pay does not depend on the uprating.</p>

<h2>When the result says “not due”</h2>
<p>Three reasons can stop the payment, and the calculator names the one that applies. Average earnings under ${h.gbp(LEL)} fail the earnings test; a start date after the last qualifying day fails the service test; a leave date earlier than ${F.earliestStartWeeksBeforeEWC} weeks before the expected week of childbirth is simply not allowed. In the first two cases the employer must give you form SMP1 explaining the refusal, and you can then claim ${h.a('maternity-allowance', 'Maternity Allowance')} from Jobcentre Plus, which pays the same flat rate for the same number of weeks if you meet its own work test.</p>

<h2>Northern Ireland and two jobs</h2>
<p>The rates, the lower earnings limit and the dates are the same in Northern Ireland, where ${h.src('nidSmp', 'nidirect')} applies the identical ${h.gbp(FAMILY_RATE, 2)} figure for 2026/27, so the calculator needs no nation setting. If you have two employers and qualify with each, each one pays SMP on its own earnings; run the calculator once per job. To understand where the average weekly figure comes from, read ${h.a('smp-average-weekly-earnings', 'how SMP average weekly earnings are worked out')}; for the dates alone, the ${h.a('maternity-leave-dates-calculator', 'maternity leave dates calculator')} lays out the calendar without the money.</p>
`,
});
