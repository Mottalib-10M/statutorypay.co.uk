import { definePage } from '../../lib/guide-types';
import { P } from '../../lib/engine/params';
import { entitlementDays, irregularAccrual } from '../../lib/engine/holiday';
import { weeklySsp } from '../../lib/engine/ssp';

const H = P.holiday;

export default definePage({
  id: 'holiday-during-sick-leave',
  group: 'holiday',
  order: 120,
  mini: 'sickHoliday',
  related: ['carry-over-holiday', 'statutory-sick-pay', 'holiday-pay-when-leaving', 'fit-note-rules', 'irregular-hours-holiday-calculator'],
  sources: ['govTakingSick', 'govHoliday', 'wtr13', 'nidHoliday'],
  slug: 'holiday-during-sick-leave',
  nav: 'Holiday and sick leave',
  card: 'Falling ill on holiday, holiday building up while off sick, and what is paid at the end.',
  title: 'Holiday and Sick Leave 2026: Accrual, Swaps and Carry-Over',
  description: `Holiday and sick leave in 2026: leave builds up while off sick, holiday spoilt by illness can be retaken, up to ${H.sickCarryOverRegularDays} days carry over, all paid if you leave.`,
  h1: 'Holiday while you are off sick, and sickness during a holiday',
  intro: 'What happens to your paid leave when illness gets in the way, from a fever on the first day of a holiday to a year of sick leave.',
  resume: `Being off sick does not stop holiday from building up. Statutory leave accrues throughout sickness absence, however long it lasts, so an employee who is off for a whole year still has the full 5.6 weeks for that year, ${entitlementDays(5)} days on a five-day week. If you fall ill just before or during a booked holiday, you can tell your employer and treat those days as sick leave instead, then take the holiday later; the usual proof applies, self-certification for up to seven days and a fit note after that. You can also choose to take paid holiday while off sick, which some people do when they get only Statutory Sick Pay, but your employer cannot force you to. Leave you could not take because of sickness can be carried into the next leave year, up to ${H.sickCarryOverRegularDays} days for a regular five-day week in Great Britain, and must be used within 18 months of the end of the year it came from. If the job ends, untaken leave is paid.`,
  faqs: [
    { q: 'I was ill for three days of my week in Spain. Can I get those days back?', a: 'Yes, if you tell your employer you were sick and can show it. Self-certification covers up to seven days; for longer, a fit note or, abroad, a local medical certificate your employer accepts. The days become sick leave, paid under your sick pay rules, and the holiday can be rebooked with normal notice.' },
    { q: 'If I take holiday while off sick, which rate am I paid?', a: 'Your normal holiday pay for those days, not sick pay. GOV.UK adds that when an employee changes holiday into sick leave, the Statutory Sick Pay received counts towards the holiday pay for those days, unless the employee did not qualify for SSP or was receiving occupational sick pay.' },
    { q: 'Can my employer dismiss me while I am on long-term sick leave and keep my holiday?', a: 'Dismissal for long-term sickness is possible as a last resort, after considering a return and consulting you. Whatever the outcome, statutory leave built up during the absence and not taken, including days carried over because of sickness, must be paid on your final payslip under regulation 14.' },
  ],
  body: (h) => `
<h2>Leave keeps accruing through sickness</h2>
<p>GOV.UK states it in one line: statutory holiday entitlement is built up while an employee is off work sick, no matter how long they are off. A contract cannot reduce the statutory part, though it can say what happens to extra contractual days during long absences. The practical consequence is that a long-term sick employee returns, or leaves, with a stock of leave that must be honoured.</p>
<p>For irregular-hours and part-year workers in Great Britain, whose leave accrues as ${h.pct(H.irregularAccrualRate, 2)} of hours worked, regulation 15C supplies the missing hours. Each week of sick leave accrues ${h.pct(H.irregularAccrualRate, 2)} of the average weekly hours worked in the ${H.referenceWeeks} weeks before the absence, ignoring weeks of earlier sick or statutory leave. Someone who averaged 25 hours before falling ill therefore accrues ${h.num(irregularAccrual(25).exact, 2)} hours of holiday for each week off.</p>

<h2>When sickness spoils a holiday</h2>
<p>If illness arrives just before or during your leave, you can ask to treat the affected days as sick leave. Tell your employer as soon as you can, following the sickness reporting rules, and keep evidence. Those days are then paid as sick leave, which for many people means Statutory Sick Pay, ${h.gbp(weeklySsp(10000), 2)} a week at most, and the holiday remains to be taken. Your employer may want the rebooked dates to fit the usual notice rules.</p>
<p>The reverse is also allowed: you can ask to take paid holiday during a period of sickness, for example to be paid normally rather than on SSP. It is your choice. GOV.UK is explicit that employers cannot force employees to take annual leave when they are eligible for sick leave.</p>

<h2>How much carries over, and for how long</h2>
<p>Regulation 13(15) lets a worker who could not take leave because of sickness carry the untaken part of the 4 weeks of regulation 13 leave into the next leave year, to be used within 18 months of the end of the year in which it arose. That is ${H.sickCarryOverRegularDays} days for a five-day week; for a part-timer, four weeks of their own working days. Irregular-hours and part-year workers can carry up to ${H.sickCarryOverIrregularDays} days. Leave already taken in the year counts against the four weeks first. The calculator above applies those limits; the ${h.a('carry-over-holiday', 'carry-over guide')} covers the other routes, including family leave and an employer who did not give you the chance to take leave.</p>

<h2>Coming back, or leaving</h2>
<p>On return, a long-term sick employee often has more leave than can be taken before the year ends. Planning it with the employer, as part of a phased return, can help: some use days of holiday to build a shorter working week for a few weeks. If the employment ends instead, regulation 14 converts the year’s accrued, untaken leave into money, and regulation 14(6) adds any leave carried over from earlier years (${h.a('holiday-pay-when-leaving', 'holiday pay when leaving')}). The pay for those days is a normal week’s holiday pay, not SSP.</p>

<h2>A long absence, worked through</h2>
<p>A warehouse worker on a five-day week has a January leave year. She takes 4 days in February, falls ill in March and stays off until the following February. For the first year she was entitled to ${entitlementDays(5)} days and took 4. Because sickness prevented the rest, she can carry over the part of the 4 weeks of regulation 13 leave she had not used: ${H.sickCarryOverRegularDays} minus 4, which is 16 days, to use by the end of June in the year after next. The additional 1.6 weeks is lost unless her contract allows it to be carried. She also has her full entitlement for the new year, which kept building up while she was off.</p>

<h2>Northern Ireland</h2>
<p>${h.src('nidHoliday', 'nidirect')} confirms that holiday is a statutory right for workers in Northern Ireland and that it builds up during maternity, paternity and adoption leave. The Great Britain rules on irregular-hours accrual during sickness (regulation 15C) do not apply there, and the carry-over of leave lost to sickness rests on case law under the Northern Ireland regulations rather than on a written regulation; the Labour Relations Agency can advise on a specific case.</p>
`,
});
