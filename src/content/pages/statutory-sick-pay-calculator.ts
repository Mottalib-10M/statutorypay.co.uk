import { definePage } from '../../lib/guide-types';
import { P } from '../../lib/engine/params';
import { computeSsp } from '../../lib/engine/ssp';
import { formatMoney } from '../../lib/format';

const S = P.ssp;
const g = (n: number, d = 2) => formatMoney(n, d);
// The example filled in on the page, computed by the engine.
const ex = computeSsp({ awe: 480, pattern: [1, 2, 3, 4, 5], firstDay: '2026-10-12', lastDay: '2026-10-23' });
const low = computeSsp({ awe: 120, pattern: [1, 2, 3], firstDay: '2026-11-02', lastDay: '2026-11-04' });

export default definePage({
  id: 'statutory-sick-pay-calculator',
  group: 'sickness',
  order: 10,
  tool: 'ssp',
  related: ['statutory-sick-pay', 'ssp-changes-april-2026', 'ssp-linked-periods', 'fit-note-rules', 'company-sick-pay-vs-ssp'],
  sources: ['hmrcRates', 'ssp2026Commencement', 'govSsp', 'govEmployerSsp', 'nidSsp'],
  slug: 'statutory-sick-pay-calculator',
  nav: 'Sick pay calculator',
  card: 'SSP for your dates and working days, from day one, with the 80% rule.',
  title: `SSP Calculator 2026/27: Sick Pay From Day One, ${g(S.weeklyRate)}`,
  description: `SSP calculator 2026/27: sick pay from the first day off, the lower of ${g(S.weeklyRate)} a week and 80% of earnings, split by pay week, with the 28-week limit counted.`,
  h1: 'Statutory Sick Pay calculator for the new day-one rules',
  intro: 'Your average earnings, the days you normally work and the dates you were off: the calculator pays every qualifying day and shows each pay week.',
  resume: `Statutory Sick Pay for any spell of sickness that starts on or after 6 April 2026 is paid from the first day you would have worked, with no waiting days and no minimum earnings. The weekly rate is ${g(S.weeklyRate)} or 80% of your normal weekly earnings, whichever is lower, so anyone earning less than about ${g(S.weeklyRate / S.earningsShare)} a week receives 80% of their pay. That weekly rate is divided by the number of days you normally work to give a daily rate, cut at four decimal places, and each week’s payment is rounded up to the penny, exactly as in HMRC’s tables. Your employer pays it through payroll for up to ${S.maxWeeks} weeks, counting together spells that are no more than ${S.linkGapWeeks} weeks apart. The same rules apply in England, Wales, Scotland and Northern Ireland, and income tax and National Insurance are deducted from SSP as from wages.`,
  faqs: [
    { q: 'Which days count as qualifying days for SSP?', a: 'The days you would normally work under your contract. A Monday-to-Friday employee has five; someone on a three-day week has three, and the daily rate is the weekly rate divided by three. Weekends, rest days and bank holidays you would not have worked are not paid, even when you are off sick on them.' },
    { q: 'What earnings figure should I type if I started the job recently?', a: 'Normally the average of the 8 weeks before the sickness began. If you have been paid for less than 8 weeks, your employer averages what you have earned so far, or uses the pay you would have received under the contract if no payday has passed. GOV.UK confirms that a short service does not stop SSP.' },
    { q: 'My absence started in March 2026. Why does the calculator refuse it?', a: `Because transitional rules apply to it. A spell that began on or before 5 April 2026 started under the old scheme of ${S.pre2026.waitingDays} waiting days and the ${formatMoney(S.pre2026.lel)} earnings limit, and SI 2026/373 decides case by case how it carries on after 6 April. Those cases depend on facts the calculator cannot see, so it only prices spells starting on or after the reform.` },
    { q: 'Can my employer pay me less SSP because I told them late?', a: 'Yes, for the days you were late, unless you had a good reason. Employers can set their own deadline for reporting sickness, or 7 days if they set none, and need not pay SSP for the days before you told them. They cannot hold SSP back because a fit note arrives late.' },
  ],
  body: (h) => `
<h2>Reading the result</h2>
<p>The large figure is the SSP owed for the dates you entered. Each line below is a pay week ending on a Saturday, because SSP is worked out in weeks that run Sunday to Saturday; if your payroll runs monthly, your employer adds the weeks that fall in the month. With the example already filled in, a Monday-to-Friday employee earning ${h.gbp(480)} a week and off from 12 to 23 October 2026, the calculator pays ${ex.paidDays} days and gives ${h.gbp(ex.total, 2)}: two full weeks at the flat rate. The line “days left” counts what remains of the ${S.maxWeeks} weeks, expressed in your own qualifying days, which matters when another spell follows within ${S.linkGapWeeks} weeks.</p>
<p>Try a lower wage to see the 80% rule. A cleaner on three mornings a week earning ${h.gbp(120)} and off from Monday 2 to Wednesday 4 November 2026 receives ${h.gbp(low.total, 2)}: 80% of ${h.gbp(120)} is ${h.gbp(120 * S.earningsShare)}, divided by three days. Under the rules in force until April 2026 the same absence paid nothing at all, as ${h.a('ssp-changes-april-2026', 'the comparison of the old and new rules')} shows.</p>
<h2>What it assumes</h2>
<p>You are an employee or an agency worker on the payroll, you were too ill to work on full days (a day on which you did any work does not count), and you told your employer on time. The calculator does not apply the exclusions: SSP is not paid while you receive Statutory Maternity Pay or Maternity Allowance, nor in the four weeks before the week your baby is due if the absence is pregnancy-related, nor once ${S.maxWeeks} weeks have been paid in a linked period or a chain of linked spells has lasted three years. ${h.a('ssp-linked-periods', 'Linked periods')} explains the counting, and ${h.a('company-sick-pay-vs-ssp', 'company sick pay')} what changes when your contract pays more.</p>
`,
});
