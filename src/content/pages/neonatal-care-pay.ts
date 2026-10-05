import { definePage } from '../../lib/guide-types';
import { P, FAMILY_RATE, LEL } from '../../lib/engine/params';
import { ninety, ceilPenny } from '../../lib/engine/family';
import { formatMoney } from '../../lib/format';

const F = P.familyPay;
const g = (n: number, d = 2) => formatMoney(n, d);
const weeksFor = (days: number) => (days >= F.neonatalMinDays ? Math.min(Math.floor(days / 7), F.neonatalMaxWeeks) : 0);
const weekly = (awe: number) => ceilPenny(Math.min(FAMILY_RATE, ninety(awe)));

export default definePage({
  id: 'neonatal-care-pay',
  group: 'family',
  order: 120,
  mini: 'neonatal',
  related: ['maternity-pay-calculator', 'paternity-pay-calculator', 'shared-parental-pay-calculator', 'parental-bereavement-pay', 'statutory-maternity-pay'],
  sources: ['govNeonatal', 'hmrcRates', 'upratingOrder2026'],
  slug: 'neonatal-care-pay',
  nav: 'Neonatal care leave and pay',
  card: 'Up to 12 extra weeks when a newborn needs a week or more of neonatal care.',
  title: `Neonatal Care Pay 2026/27: Up to ${F.neonatalMaxWeeks} Weeks at ${g(FAMILY_RATE)}`,
  description: `Neonatal care pay and leave in 2026/27: one week per 7 days in neonatal care, up to ${F.neonatalMaxWeeks} weeks, paid at ${g(FAMILY_RATE)} or 90% of earnings, added to maternity leave.`,
  h1: 'Neonatal care leave and pay when a newborn is in hospital',
  intro: 'A right in force since April 2025 in England, Scotland and Wales: extra weeks for parents whose baby spends a week or more in neonatal care.',
  resume: `Neonatal Care Leave gives each eligible parent one week of leave for every seven full, continuous days their baby spends in neonatal care that starts within 28 days of the birth, up to ${F.neonatalMaxWeeks} weeks. It is a day-one right for employees in England, Scotland and Wales, for babies born on or after 6 April 2025, and it comes on top of maternity, paternity, adoption and shared parental leave. Statutory Neonatal Care Pay for 2026/27 is ${g(FAMILY_RATE)} a week or 90% of average weekly earnings, whichever is lower; it needs 26 weeks of continuous employment by the end of the relevant qualifying week and average earnings of at least the lower earnings limit, ${g(LEL, 0)} a week. Parents already on maternity or adoption leave add the neonatal weeks at the end of it, so the time spent in hospital is not lost. All of it must be taken within ${F.neonatalWindowWeeks} weeks of the birth.`,
  faqs: [
    { q: 'Our baby was in neonatal care for 10 days. How much leave do we get?', a: `One week each. Leave is earned in complete blocks of seven days: ${weeksFor(10)} week for 10 days, ${weeksFor(14)} weeks for 14, and so on up to ${F.neonatalMaxWeeks}. Both parents can claim if each meets the conditions, so a couple with a baby in care for three weeks can each take up to three weeks.` },
    { q: 'Does care at home count towards the days in neonatal care?', a: 'It can. Neonatal care includes care in hospital, palliative or end-of-life care, and medical care after discharge that is under a consultant and includes ongoing visits or checks arranged by the treating hospital. Ordinary check-ups with a GP or health visitor do not count.' },
    { q: 'Why does GOV.UK show a different weekly rate for neonatal care pay?', a: `Its neonatal page was last updated in April 2025 and still shows the 2025/26 figures. From 6 April 2026 the weekly rate is ${g(FAMILY_RATE)}, set by the Social Security Benefits Up-rating Order 2026 and listed in HMRC’s rates and thresholds for 2026 to 2027, the same rate as SMP and paternity pay.` },
    { q: 'Is there neonatal care leave in Northern Ireland?', a: 'Not under the scheme described here. GOV.UK states that Neonatal Care Leave is for employees in England, Scotland and Wales, and we found no equivalent page on nidirect. Parents in Northern Ireland should check their employer’s policy and ask the Labour Relations Agency about any new provision before relying on it.' },
  ],
  body: (h) => `
<h2>How many weeks for how many days</h2>
<p>The entitlement grows with the length of the stay, in whole weeks, and stops at ${F.neonatalMaxWeeks}. The table also shows the pay for an employee earning ${h.gbp(540)} a week, whose weekly rate is ${h.gbp(weekly(540), 2)}.</p>
${h.table(['Full days in neonatal care', 'Weeks of leave', `Pay at ${h.gbp(540)} a week`], [6, 7, 13, 20, 35, 56, 84, 100].map((dd) => [dd, weeksFor(dd), h.gbp(weeksFor(dd) * weekly(540), 2)]), 'Only complete, continuous periods of seven days count. Pay needs the service and earnings conditions.', ['r', 'r', 'r'])}
<p>A stay of six days gives nothing, however serious the illness. Twins in care at the same time give one entitlement, not two; babies in care at different times can each give an entitlement, still within a total of ${F.neonatalMaxWeeks} weeks.</p>

<h2>Two tiers of leave</h2>
<p>The rules distinguish leave taken while the baby is in neonatal care or in the week after (tier 1) from leave taken later (tier 2). In tier 1 you can take the leave in separate blocks of at least a week, and notice is light: on the day you want to start, before your usual start time if you can, by phone, voicemail or text, renewed each week. In tier 2 the remaining leave is taken in one continuous block, with written notice of ${F.neonatalNoticeOneWeekDays} days for a single week or 28 days for two weeks or more. Tier 1 leave cannot be cancelled; tier 2 can, with the same notice.</p>

<h2>With maternity, paternity and shared parental leave</h2>
<p>For a mother on maternity leave, or an adopter on adoption leave, the neonatal weeks are added after that leave ends. GOV.UK gives the example of a baby in care for 56 days: eight weeks of neonatal leave are added to the end of the maternity leave rather than lost while the baby was in hospital. For a partner, neonatal leave can come before paternity leave or shared parental leave, or between blocks of shared parental leave booked before the baby entered neonatal care. The rules for paternity leave itself are on ${h.a('paternity-leave-2026', 'the paternity leave page')}.</p>

<h2>Who can claim the pay</h2>
<p>The leave needs only employee status. The pay adds three conditions. First, 26 weeks of continuous employment with your employer by the end of the qualifying week: the 15th week before the expected week of childbirth if you also get maternity or paternity pay, the matching week for adopters, otherwise the week before the baby entered neonatal care. Second, average weekly earnings at the lower earnings limit over eight weeks. Third, still being employed in the week before the pay starts. Notice for the pay can be given up to 28 days after tier 1 leave starts, in writing. Employers recover most of it from HMRC, as with maternity pay (${h.pct(F.standardRecovery, 0)}, or ${h.pct(F.smallEmployerRecovery, 0)} for small employers).</p>

<h2>What to tell your employer, and when</h2>
<p>GOV.UK lists the information an employer can ask for: your name, the baby’s date of birth (and placement date for an adoption), the dates the neonatal care started and ended, when you want the leave to begin and how many weeks you are taking. The first time you claim, you also confirm that you are the baby’s parent, or the mother’s partner, with responsibility for the baby’s care, and that you will care for the baby during the leave. The online declaration form NEO3 does this, but an email or the employer’s own form is enough. Tell your employer the date the baby comes home as soon as you know it, because that date decides when tier 1 ends. If you disagree with a decision on the pay, the HMRC Statutory Payment Disputes Team can decide, provided you contact it within six months of the employer’s decision.</p>

<h2>What it adds up to for a family</h2>
<p>A couple whose baby spent five weeks in a neonatal unit can each take five extra weeks. If both earn above the threshold where 90% of pay exceeds the flat rate, that is ${h.gbp(5 * FAMILY_RATE, 2)} each before tax, on top of SMP and paternity pay. Use the calculator above for your own days and earnings, and the ${h.a('maternity-pay-calculator', 'maternity pay calculator')} for the weeks that come before.</p>
`,
});
