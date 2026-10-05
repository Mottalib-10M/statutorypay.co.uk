import { definePage } from '../../lib/guide-types';
import { P, FAMILY_RATE, LEL } from '../../lib/engine/params';
import { ninety, ceilPenny } from '../../lib/engine/family';
import { formatMoney } from '../../lib/format';

const F = P.familyPay;
const g = (n: number, d = 2) => formatMoney(n, d);
const weekly = (awe: number) => ceilPenny(Math.min(FAMILY_RATE, ninety(awe)));

export default definePage({
  id: 'parental-bereavement-pay',
  group: 'family',
  order: 130,
  mini: 'bereavement',
  related: ['neonatal-care-pay', 'maternity-pay-calculator', 'northern-ireland-employment-rights', 'unpaid-parental-leave'],
  sources: ['govBereavement', 'nidBereavement2026', 'hmrcRates', 'upratingOrder2026'],
  slug: 'parental-bereavement-pay',
  nav: 'Parental bereavement leave and pay',
  card: 'Two weeks after the death of a child or a stillbirth, and what changed in Northern Ireland.',
  title: `Parental Bereavement Pay 2026/27: Two Weeks at ${g(FAMILY_RATE)}`,
  description: `Parental bereavement leave and pay in 2026/27: two weeks within ${F.bereavementWindowWeeks} weeks, paid at ${g(FAMILY_RATE)} or 90% of earnings; in Northern Ireland miscarriage is now covered.`,
  h1: 'Parental bereavement leave and pay',
  intro: 'The right to two weeks away from work after the death of a child under 18 or a stillbirth, how it is paid, and the wider rules now in force in Northern Ireland.',
  resume: `Parental Bereavement Leave gives an employee two weeks off after the death of a child under 18 or a stillbirth after 24 weeks of pregnancy. It is a day-one right: there is no qualifying period for the leave. The two weeks can be taken together, as two separate weeks, or as a single week, at any time within ${F.bereavementWindowWeeks} weeks of the death; a week means the days you normally work in a week. Statutory Parental Bereavement Pay for 2026/27 is ${g(FAMILY_RATE)} a week or 90% of average weekly earnings, whichever is lower. In Great Britain it requires 26 weeks of continuous employment by the end of the week before the death and average earnings of at least ${g(LEL, 0)} a week. In Northern Ireland, for bereavements from 6 April 2026, the pay is also a day-one right and the leave extends to miscarriage before 24 weeks.`,
  faqs: [
    { q: 'Do I need to prove the death or stillbirth to my employer?', a: 'Not for the leave. GOV.UK states that no proof of the death or stillbirth is required, and notice can be given by phone, voicemail, text or email. For the pay, you give your employer written details and a one-off declaration of your relationship to the child, on the online form, in a letter or on the employer’s own form.' },
    { q: 'Can I take bereavement leave straight after my maternity leave ends?', a: 'Yes, and that is the rule when the death happens during another statutory leave: bereavement leave starts after the other leave ends, not necessarily immediately after. Any part of it interrupted by a new period of statutory leave can be taken later, still within 56 weeks of the death.' },
    { q: 'Who counts as a parent for bereavement leave?', a: 'Biological, adoptive and intended parents in a surrogacy arrangement, their partners, and people who had day-to-day responsibility for a child living with them for four continuous weeks before the death, including foster parents paid a fee or allowance by a local authority. A biological parent loses the right after an adoption order, unless a contact order was in place.' },
  ],
  body: (h) => `
<h2>What the pay comes to</h2>
<p>Bereavement pay has no higher-rate weeks: each week is paid at the flat rate or 90% of earnings, whichever is lower, so two weeks give at most ${h.gbp(2 * FAMILY_RATE, 2)} before tax.</p>
${h.table(['Average weekly earnings', 'Weekly pay', 'Two weeks'], [129, 180, 216, 300, 600].map((e) => [h.gbp(e), h.gbp(weekly(e), 2), h.gbp(2 * weekly(e), 2)]), 'Statutory Parental Bereavement Pay from 6 April 2026, Great Britain and Northern Ireland.', ['r', 'r', 'r'])}
<p>Employers can recover most of the pay from HMRC, as for other family payments. Many employers also have a compassionate leave policy that pays more or gives more time; it sits on top of the statutory right.</p>

<h2>When to take it, and how much notice</h2>
<p>The ${F.bereavementWindowWeeks} weeks are split in two. In the first ${F.bereavementEarlyWindowWeeks} weeks after the death or stillbirth, you only need to tell your employer before the time you would normally start work on the first day of the leave, and you can cancel the same way. From week 9 to week ${F.bereavementWindowWeeks}, you need to give at least one week’s notice. Either way you say the date of the death, when you want the leave to start and whether you are taking one week or two. The pay is claimed in writing within ${F.bereavementPayClaimDays} days of the first day of the week you are claiming for.</p>

<h2>Northern Ireland since 6 April 2026</h2>
<p>For bereavements on or after 6 April 2026, ${h.src('nidBereavement2026', 'nidirect')} sets out two changes that go further than the rules in Great Britain. The right now covers miscarriage before 24 weeks of pregnancy, for the person who experienced it and for employees with a defined connection to them, counted from the date of the miscarriage or the date it was discovered. And Statutory Parental Bereavement Pay no longer needs 26 weeks of service: it is due from the first day of employment, with the employer estimating normal earnings when there are fewer than eight weeks of pay to average. Cases before 6 April 2026 stay under the earlier rules.</p>
<p>In Great Britain, the 26-week service test and the ${h.gbp(LEL, 0)} earnings test still apply to the pay, though the leave remains a day-one right. More on how the two jurisdictions differ is on the ${h.a('northern-ireland-employment-rights', 'Northern Ireland page')}.</p>

<h2>Adoption, surrogacy and carers: the details that decide eligibility</h2>
<p>Adoptive parents qualify once the adoption order is granted, and before it if the child had been placed with them and the placement had not been disrupted. For a child adopted from abroad before the order, the child must have been living with the adopters after entering the United Kingdom, with the official notification in hand. Intended parents in a surrogacy arrangement qualify after the parental order, or before it if they had applied, or intended to apply, within six months of the birth and expected it to be granted.</p>
<p>For someone who was not a parent but cared for the child, the test is practical: the child lived in your home for four continuous weeks ending with the death, and you or your partner had day-to-day responsibility for the care. Being paid to look after the child excludes you, except for a fee or allowance from a local authority as a foster parent, reimbursed expenses, or payments under a will or trust. The right is also excluded where a parent, or someone with parental responsibility, lived in the same household.</p>

<h2>Stillbirth, neonatal care and maternity rights</h2>
<p>A stillbirth after 24 weeks of pregnancy also keeps the mother’s right to maternity leave and, if she qualifies, Statutory Maternity Pay; her partner keeps paternity leave and pay. Bereavement leave is added to those rights, not taken from them. If a baby dies after a stay in neonatal care, neonatal care leave already earned can still be taken, and bereavement leave follows the other statutory leave (${h.a('neonatal-care-pay', 'neonatal care leave and pay')}).</p>

<h2>Other time off that may help</h2>
<p>Every employee also has a right to a reasonable amount of unpaid time off to deal with an emergency involving a dependant, including arranging a funeral, with no qualifying period. Paid holiday can be taken with the usual notice, and ${h.a('unpaid-parental-leave', 'unpaid parental leave')} remains available for other children under 18. If you are struggling to return, your GP can issue a fit note, and sick pay rules then apply.</p>
`,
});
