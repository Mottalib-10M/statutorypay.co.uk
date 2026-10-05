import { definePage } from '../../lib/guide-types';
import { P, FAMILY_RATE, LEL } from '../../lib/engine/params';
import { adoptionDates, smpSchedule } from '../../lib/engine/family';
import { formatMoney, displayDate } from '../../lib/format';

const F = P.familyPay;
const g = (n: number, d = 2) => formatMoney(n, d);
const d = (iso: string) => displayDate(iso, 'en-GB');
const exDates = adoptionDates('2026-11-12');
const exPay = smpSchedule(610, '2026-12-07');

export default definePage({
  id: 'adoption-pay-calculator',
  group: 'family',
  order: 110,
  tool: 'adoption',
  related: ['shared-parental-pay-calculator', 'maternity-pay-calculator', 'paternity-pay-calculator', 'keeping-in-touch-days', 'smp-average-weekly-earnings'],
  sources: ['govAdoption', 'hmrcRates', 'nidAdoption', 'upratingOrder2026'],
  slug: 'adoption-pay-calculator',
  nav: 'Adoption pay calculator',
  card: 'Statutory Adoption Pay from the matching week, 39 weeks laid out.',
  title: `Adoption Pay Calculator 2026/27: SAP ${g(FAMILY_RATE)} After 6 Weeks`,
  description: `Adoption pay calculator 2026/27: Statutory Adoption Pay for 39 weeks, 6 at 90% of earnings then ${g(FAMILY_RATE)} or 90%, from the matching week, with leave dates.`,
  h1: 'Statutory Adoption Pay calculator',
  intro: 'The date you were told of the match, the day leave starts, your start date and your earnings: the calculator checks eligibility and lays out the 39 weeks.',
  resume: `Statutory Adoption Pay (SAP) mirrors maternity pay: ${F.smpWeeks} weeks, the first ${F.smpHigherRateWeeks} at 90% of your average weekly earnings and the remaining weeks at ${g(FAMILY_RATE)} or 90% if lower. What changes is the reference week. For an adoption in the UK it is the matching week, the week (Sunday to Saturday) in which the agency tells you that you have been matched with a child; you need 26 weeks of continuous employment with your employer by the end of it and average earnings of at least ${g(LEL, 0)} a week. Adoption leave of up to ${F.maternityLeaveWeeks} weeks has no qualifying period for an employee. Only one adopter in a couple takes adoption leave and pay; the other can take paternity leave and pay, and the couple can switch to shared parental leave. Leave for a UK adoption can start up to 14 days before the expected placement, and the same rules apply in Northern Ireland.`,
  faqs: [
    { q: 'Which of us should take adoption leave?', a: 'Either adopter can, but only one. The other partner may be entitled to paternity leave and pay instead. Couples often choose the person with the longer service or the better company adoption scheme, then use shared parental leave to redistribute the weeks once the first few months have passed.' },
    { q: 'When does adoption pay start if the placement is delayed?', a: 'Pay starts with the leave, which you can begin on the day of placement or up to 14 days before the expected date for a UK adoption. If the placement slips, tell your employer: the start date can be changed with notice, and pay follows the new leave start date.' },
    { q: 'Does adoption pay apply to fostering for adoption and surrogacy?', a: 'Yes. Foster carers approved for fostering for adoption, and intended parents in a surrogacy arrangement who apply for a parental order, can qualify for adoption leave and pay, with the qualifying week fixed by their own situation. GOV.UK sets out the notice rules for each case.' },
  ],
  body: (h) => `
<h2>Reading the result</h2>
<p>With the example filled in, the match is notified on ${d('2026-11-12')}: the matching week runs from ${d(exDates.mwStart)} to ${d(exDates.mwEnd)}, so employment must have started by ${d(exDates.startedBy)}. Leave and pay start on ${d('2026-12-07')}. An adopter earning ${h.gbp(610)} a week receives ${h.gbp(exPay.weeks[0].amount, 2)} for six weeks, then ${h.gbp(exPay.weeks[38].amount, 2)} a week, ${h.gbp(exPay.total)} in total. The schedule under the result lists every week; weeks starting after the April 2027 uprating are priced at the current rate until the new rate is published.</p>
<h2>Notice to give</h2>
<p>Tell your employer within 7 days of being matched how much leave you want and when it should start, and ask for SAP at least 28 days before you want it to begin. The employer can ask for the matching certificate from the agency. For an overseas adoption the dates run from the official notification and the child’s arrival in the UK instead; the calculator covers UK adoptions only.</p>
<p>Keeping in touch days work as for maternity leave (${h.a('keeping-in-touch-days', 'KIT days')}), and the averaging of earnings follows the same method as for SMP (${h.a('smp-average-weekly-earnings', 'average weekly earnings')}).</p>
`,
});
