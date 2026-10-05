import { definePage } from '../../lib/guide-types';
import { P, FAMILY_RATE, LEL } from '../../lib/engine/params';
import { sharedParental } from '../../lib/engine/family';
import { formatMoney } from '../../lib/format';

const F = P.familyPay;
const g = (n: number, d = 2) => formatMoney(n, d);
const ex = sharedParental({ leaveWeeksTaken: 20, payWeeksTaken: 20 });

export default definePage({
  id: 'shared-parental-pay-calculator',
  group: 'family',
  order: 100,
  tool: 'shared',
  related: ['maternity-pay-calculator', 'paternity-pay-calculator', 'paternity-leave-2026', 'adoption-pay-calculator', 'keeping-in-touch-days'],
  sources: ['govShared', 'hmrcRates', 'nidShared', 'upratingOrder2026'],
  slug: 'shared-parental-pay-calculator',
  nav: 'Shared parental pay calculator',
  card: 'Turn unused maternity or adoption leave and pay into weeks either parent can take.',
  title: `Shared Parental Pay Calculator 2026/27: ${F.splLeaveWeeks} Weeks to Share`,
  description: `Shared parental pay calculator 2026/27: up to ${F.splLeaveWeeks} weeks of leave and ${F.shppWeeks} weeks of pay at ${g(FAMILY_RATE)} or 90% of earnings, split between the two parents as you choose.`,
  h1: 'Shared parental leave and pay calculator',
  intro: 'Enter how much maternity or adoption leave and pay the first parent has used: the calculator shows what is left to share and what the other parent would receive.',
  resume: `Shared Parental Leave (SPL) lets a mother or primary adopter end maternity or adoption leave early and pass the remaining weeks to her partner, or take them herself in blocks. The pool is ${F.maternityLeaveWeeks} weeks of leave minus the maternity or adoption leave taken, so at most ${F.splLeaveWeeks} weeks once the two compulsory weeks after a birth are used, and ${F.smpWeeks} weeks of statutory pay minus the weeks of SMP, SAP or Maternity Allowance already paid, so at most ${F.shppWeeks} weeks of Statutory Shared Parental Pay (ShPP). ShPP is paid at ${g(FAMILY_RATE)} a week or 90% of average weekly earnings, whichever is lower, with no higher-rate weeks; each parent claiming it must earn at least ${g(LEL, 0)} a week on average and meet the work tests. Leave and pay must be used within a year of the birth or placement, and each parent can book up to three separate blocks.`,
  faqs: [
    { q: 'If the mother takes 20 weeks of maternity leave, how much can her partner take?', a: `With 20 weeks of leave and 20 weeks of SMP used, ${ex.splWeeks} weeks of shared parental leave remain, of which ${ex.shppWeeks} weeks are paid. Her partner can take any part of them, and she can take the rest. The first six weeks at 90% of earnings are not part of ShPP: they belong to SMP.` },
    { q: 'Is shared parental pay higher than SMP?', a: `Never for the same weeks. ShPP is always the lower of ${g(FAMILY_RATE)} and 90% of earnings, the rate of SMP after week six. A mother who stops SMP during the first six weeks loses the higher 90% rate for the weeks she gives up, which is why most couples start SPL after week six.` },
    { q: 'Can we both be on shared parental leave at the same time?', a: 'Yes. The weeks are a shared pool, not a turn-taking system: both parents can be off together for part or all of it, as long as the total does not exceed what is left. The pay follows the same rule, each week of ShPP being claimed by one parent or the other.' },
  ],
  body: (h) => `
<h2>Reading the result</h2>
<p>The top figure is the leave left to share. Under it, the line for the other parent shows the weeks they take, their weekly ShPP, the amount and how many of their weeks are unpaid because the pay pool runs out before the leave pool. With the example filled in, the mother has used 20 weeks of leave and 20 weeks of SMP: ${ex.splWeeks} weeks of leave and ${ex.shppWeeks} weeks of pay are left, and a partner earning ${h.gbp(820)} a week who takes 12 weeks receives ${h.gbp(12 * Math.min(FAMILY_RATE, 820 * F.earningsShare), 2)}. The leave pool is always larger than the pay pool by 13 weeks, the unpaid tail of maternity leave.</p>
<h2>The conditions behind the numbers</h2>
<p>The parent taking SPL must be an employee with 26 weeks of service by the end of the 15th week before the due date (or by the matching week for adopters) and still employed in the week before the leave; the other parent must pass a lighter test of 26 weeks of work, employed or self-employed, in the ${F.splOtherParentTestWeeks} weeks before, with earnings of at least ${h.gbp(F.splOtherParentEarnings)} in 13 of them. ShPP adds the ${h.gbp(LEL, 0)} earnings test. Each block needs ${F.splBlockNoticeWeeks} weeks’ written notice. Northern Ireland runs the same scheme under its own regulations, with the same rates (${h.src('nidShared', 'nidirect')}).</p>
<p>Before choosing, compare with ${h.a('paternity-pay-calculator', 'paternity pay')}: the two weeks of paternity leave are separate from SPL and, since April 2026 in Great Britain, can be taken before or after it.</p>
`,
});
