import { definePage } from '../../lib/guide-types';
import { P } from '../../lib/engine/params';
import { entitlementDays, bankHolidaysBetween } from '../../lib/engine/holiday';
import { addDays, addWeeks } from '../../lib/engine/dates';
import { displayDate } from '../../lib/format';

const H = P.holiday;
const F = P.familyPay;
const d = (iso: string) => displayDate(iso, 'en-GB');
// A mother on a five-day week, leave from 2 November 2026 for 52 weeks, January leave year.
const start = '2026-11-02';
const end = addDays(addWeeks(start, F.maternityLeaveWeeks), -1);
const bh = bankHolidaysBetween('england-and-wales', start, end).length;

export default definePage({
  id: 'holiday-on-maternity-leave',
  group: 'holiday',
  order: 150,
  mini: 'maternityHoliday',
  related: ['maternity-leave-dates-calculator', 'carry-over-holiday', 'keeping-in-touch-days', 'bank-holidays-and-annual-leave', 'statutory-maternity-pay'],
  sources: ['govHoliday', 'govMaternityPay', 'wtr13', 'nidHoliday'],
  slug: 'holiday-on-maternity-leave',
  nav: 'Holiday during maternity leave',
  card: 'Leave keeps building up during maternity, adoption and shared parental leave.',
  title: 'Holiday on Maternity Leave 2026: Accrual and Bank Holidays',
  description: `Holiday on maternity leave in 2026: all ${entitlementDays(5)} days keep building up during 52 weeks off, bank holidays included, and untaken leave carries into the next year.`,
  h1: 'Holiday that builds up while you are on maternity leave',
  intro: 'A year away from work still earns a year of holiday: how much, how to use it before or after the leave, and what happens across two leave years.',
  resume: `Holiday continues to build up throughout maternity leave, ordinary and additional, as GOV.UK and nidirect both confirm; the same is true of adoption, paternity and shared parental leave. A mother on a five-day week who takes the full ${F.maternityLeaveWeeks} weeks therefore earns the whole statutory ${entitlementDays(5)} days for that period, and any extra contractual days her contract gives, even though she is not at work. Because she cannot take the leave while on maternity leave, the law lets her carry statutory leave she was unable to take into the next leave year. Many women add their accrued holiday to the end of maternity leave, which delays the return to work at full pay, or use it before the leave starts. Bank holidays that fall during the leave are part of this: if the contract counts them inside the allowance, they are added to the holiday to be taken later. Keeping-in-touch days do not reduce the holiday that has built up.`,
  faqs: [
    { q: 'Can I take my holiday at the end of maternity leave instead of going back?', a: 'Yes, with your employer’s agreement on the dates and the usual notice. It is a common arrangement: the accrued holiday is booked to start the day after maternity leave ends, so you return later but are paid in full for those weeks. Agree it in writing, because it changes your return date.' },
    { q: 'Do I build up my contractual holiday too, or only the statutory 5.6 weeks?', a: 'Both, during the whole of ordinary and additional maternity leave, as your terms and conditions are protected while you are away. Extra days your contract gives above the statutory minimum accrue too. Your employer cannot reduce your contractual allowance because you spent the year on maternity leave.' },
    { q: 'What happens to bank holidays that fall during my maternity leave?', a: 'If your contract includes bank holidays in your holiday allowance, those that fall during your leave are not taken, so you get the equivalent days to use later. If bank holidays are given on top of your allowance, check your contract: many policies give equivalent days for those that fall during statutory leave.' },
  ],
  body: (h) => `
<h2>A year away, worked through</h2>
<p>Consider an employee in England on a five-day week, with a calendar leave year and the statutory ${entitlementDays(5)} days including bank holidays. Her maternity leave runs from ${d(start)} to ${d(end)}. During those ${F.maternityLeaveWeeks} weeks, ${bh} bank holidays fall, which she does not take. Across the two leave years the leave touches, she keeps building up holiday the whole time.</p>
<ul>
<li><strong>Leave year 2026</strong>: she works until the end of October and takes, say, 18 days. The remaining ${entitlementDays(5) - 18} days of 2026 could not be taken because she was on maternity leave, so they can be carried into 2027.</li>
<li><strong>Leave year 2027</strong>: she is on maternity leave until ${d(end)}, and accrues the full ${entitlementDays(5)} days for 2027.</li>
<li>On her return she therefore has ${entitlementDays(5) - 18 + entitlementDays(5)} days, which she can partly add to the end of the maternity leave, with agreement on dates.</li>
</ul>
<p>The exact numbers depend on your contract’s leave year, on what was taken before the leave and on any extra days your contract adds, which follow its own carry-over clause, but the principle does not change: the time on maternity leave counts as if you had been at work for holiday purposes.</p>

<h2>Carrying it over: the legal basis</h2>
<p>Regulation 13(14) of the Working Time Regulations provides that where a worker cannot take some or all of their regulation 13 leave because of a period of statutory leave, they can carry the untaken leave into the following leave year; regulation 13A(7A) does the same for the additional 1.6 weeks. Statutory leave covers maternity, adoption, paternity and shared parental leave, among other family leave. GOV.UK sums it up for workers: if you cannot take your leave because you are on family-related leave, you can carry it over into the next year. The ${h.a('carry-over-holiday', 'carry-over guide')} compares this with the more limited rules after sickness.</p>

<h2>Before the leave starts</h2>
<p>Taking holiday before maternity leave is equally possible, provided you give notice and your employer agrees the dates. Some women use it to finish work earlier without starting maternity leave, and therefore without starting the 39 weeks of Statutory Maternity Pay, which keeps more paid weeks for after the birth. Be careful in the last four weeks before the expected week of childbirth: an absence for a pregnancy-related reason in that period starts maternity leave automatically, whatever was planned (${h.a('maternity-leave-dates-calculator', 'maternity leave dates')}).</p>

<h2>Irregular hours and part-year workers</h2>
<p>For workers whose holiday accrues at ${h.pct(H.irregularAccrualRate, 2)} of hours worked in Great Britain, regulation 15C makes holiday build up during statutory leave too, using the average weekly hours worked in the ${H.referenceWeeks} weeks before the leave began. If the employer uses rolled-up holiday pay, regulation 16A requires a payment for each pay period of the leave equal to the average rolled-up pay of the previous ${H.referenceWeeks} weeks.</p>

<h2>Keeping in touch and shared parental leave</h2>
<p>Working up to ${F.kitDays} keeping-in-touch days during maternity leave does not end the leave and does not affect the holiday you are building up (${h.a('keeping-in-touch-days', 'KIT days')}). Partners on shared parental leave accrue holiday in the same way; when the leave is taken in blocks, holiday can be booked in the weeks between them with the normal notice.</p>

<h2>Pay for the holiday you take afterwards</h2>
<p>Holiday taken after maternity leave is paid at your normal holiday rate, not at the rate of Statutory Maternity Pay. For the first four weeks of statutory leave in Great Britain, that rate includes regular overtime and commission, averaged over the last ${H.referenceWeeks} weeks in which you were paid; weeks in which no pay was received are skipped and earlier weeks used instead, back to ${H.maxLookbackWeeks} weeks. A pay rise awarded while you were away applies to the holiday pay too, because your terms and conditions continue during the leave. If payroll pays the holiday at the SMP rate by mistake, ask for the difference; the ${h.a('holiday-pay-calculator', 'holiday pay calculator')} gives the figure to quote.</p>

<h2>Northern Ireland</h2>
<p>${h.src('nidHoliday', 'nidirect')} states that holiday continues to accrue throughout ordinary and additional maternity leave and paternity and adoption leave in Northern Ireland, and the arrangements above for using it before or after the leave apply in the same way.</p>
`,
});
