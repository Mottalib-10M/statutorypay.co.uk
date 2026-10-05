import { definePage } from '../../lib/guide-types';
import { P } from '../../lib/engine/params';
import { bookingNotice } from '../../lib/engine/holiday';

const H = P.holiday;

export default definePage({
  id: 'booking-holiday-notice',
  group: 'holiday',
  order: 100,
  mini: 'bookingNotice',
  related: ['holiday-entitlement-calculator', 'holiday-first-year', 'carry-over-holiday', 'bank-holidays-and-annual-leave', 'part-time-holiday-entitlement'],
  sources: ['govHoliday', 'acasHolidayPay', 'nidHoliday'],
  slug: 'booking-holiday-notice',
  nav: 'Booking holiday: notice rules',
  card: 'How far ahead to ask, when an employer can say no, and when it can make you take leave.',
  title: 'Holiday Notice Period 2026: Booking, Refusal and Shutdowns',
  description: `Holiday notice period rules in 2026: ask ${bookingNotice(1).worker} days ahead for 1 day off, ${bookingNotice(5).worker} days for a week; an employer refusing needs ${bookingNotice(5).employerRefusal} days; contracts can change both.`,
  h1: 'Booking holiday: how much notice, and when an employer can refuse',
  intro: 'The default notice rules in the Working Time Regulations, what a contract can change, and the limits on refusing or imposing dates.',
  resume: `Unless your contract sets other rules, the Working Time Regulations fix how holiday is booked. You must give notice at least twice as long as the leave you want, plus one day: ${bookingNotice(1).worker} days’ notice for one day off, ${bookingNotice(5).worker} days for a five-day week, ${bookingNotice(10).worker} days for two weeks. Your employer can refuse the dates by giving counter-notice at least as long as the leave plus one day, so ${bookingNotice(10).employerRefusal} days for a ten-day request. It can also require you to take leave on particular days, such as a Christmas shutdown or bank holidays, by giving notice of twice the leave. An employer can refuse or move particular dates but cannot refuse to let you take your statutory leave at all, and cannot make a sick worker take holiday. A contract, staff handbook or workforce agreement can replace all of these periods, which is why many employers ask for four weeks’ notice of any holiday.`,
  faqs: [
    { q: 'My manager approved my holiday and now wants to cancel it. Can they?', a: `Under the default rules, an employer can cancel by giving notice at least as long as the leave plus one day: ${bookingNotice(5).employerRefusal} days before a five-day holiday. If cancellation costs you money already spent, the regulations give no compensation, but your contract or policy might; ask for the reason in writing.` },
    { q: 'Can my employer make me use my holiday during a quiet period?', a: 'Yes. An employer can tell workers when to take statutory leave, for example during a shutdown or a slow month, giving notice of at least twice the length of the leave. It must leave you able to rest: GOV.UK notes that an employer cannot force someone who is sick to take holiday instead.' },
    { q: 'Do the notice rules apply to half days?', a: 'Yes. Regulation 15 counts days or part-days, so a half day off needs notice of twice a part-day plus one day under the default rule. How a part day is taken is otherwise up to the employer, and part-time workers often need it when their entitlement is not a whole number of days.' },
  ],
  body: (h) => `
<h2>The default periods, in one table</h2>
<p>Regulation 15 of the Working Time Regulations sets three periods, all counted back from the first day of leave. GOV.UK expresses the worker’s and the refusing employer’s periods with an extra day, because notice has to arrive before the date the regulation calculates.</p>
${h.table(['Days of leave', 'Worker asking', 'Employer refusing or cancelling', 'Employer imposing the dates'], [1, 2, 3, 5, 10, 15, 20].map((d) => { const n = bookingNotice(d); return [d, `${n.worker} days`, `${n.employerRefusal} days`, `${n.employerImposed} days`]; }), 'Days of notice before the first day of leave, under regulation 15, unless a relevant agreement says otherwise.', ['r', 'r', 'r', 'r'])}
<p>These are minimums under the default regime. A “relevant agreement”, which includes a contract of employment, a collective agreement or a workforce agreement, can lengthen, shorten or replace them entirely (regulation 15(5)). If your contract says “four weeks’ notice for any holiday”, that clause applies instead.</p>

<h2>Refusal is about dates, not entitlement</h2>
<p>An employer can refuse a request for specific dates, for example because too many colleagues are off or a deadline falls in that week. It can also forbid holiday at peak times through a policy, such as December in retail. What it cannot do is leave you unable to take your statutory entitlement within the leave year. If refusals pile up so that you could not take the leave, the law protects it: where an employer did not give you a reasonable opportunity to take leave, or did not tell you that untaken leave would be lost, the leave can be carried forward (${h.a('carry-over-holiday', 'carrying over holiday')}).</p>
<p>Refusal must also be lawful in its reasons. Turning down leave for a religious festival, or systematically refusing part-time staff, can raise discrimination or less-favourable-treatment issues that go beyond the Working Time Regulations; Acas can advise on those.</p>

<h2>Shutdowns and bank holidays</h2>
<p>Many employers close between Christmas and New Year, or on bank holidays, and count those days against the ${H.statutoryWeeks}-week entitlement. That is lawful if notice is given, at least twice the length of the closure, and many contracts give it once a year by listing the closure days. Part-time workers should check that bank holidays deducted from their allowance are in proportion to their days, which the ${h.a('bank-holidays-and-annual-leave', 'bank holiday calculator')} shows. New starters may find that a shutdown uses more leave than they have yet accrued (${h.a('holiday-first-year', 'holiday in the first year')}).</p>

<h2>Making the request count</h2>
<p>Notice need not be in writing under the regulations, but a written request, by email or through the employer’s system, gives you the date it was made. State the first and last days, and whether any are half days. If you hear nothing, ask again in writing before the employer’s refusal deadline, which is the leave plus one day before the first day: after that date, under the default rules, the employer can no longer refuse by counter-notice. Keep the answers: since 6 April 2026 employers in Great Britain must keep records of annual leave and holiday pay for ${H.recordsYears} years, and your own copy is the quickest way to settle a disagreement.</p>

<h2>Three situations that cause most disputes</h2>
<p><strong>Leave booked, then a new manager.</strong> An approved request is not automatically safe: the default rules let an employer cancel with counter-notice. A clause in the policy saying approved leave will only be cancelled in exceptional circumstances is worth pointing to.</p>
<p><strong>Leave requested late in the year.</strong> If you ask in November for the ten days you have left and the employer refuses all of them for business reasons, the days may be lost unless your contract allows carry-over, or unless the employer failed in its duty to let you take the leave and to warn you. Asking early, in writing, protects you.</p>
<p><strong>Notice of resignation.</strong> During a notice period you can usually take the statutory leave left, with the same booking rules, and your employer can also tell you to take it, with notice of twice its length. Anything not taken by the last day is paid (${h.a('holiday-pay-when-leaving', 'holiday pay when leaving')}).</p>

<h2>Northern Ireland</h2>
<p>Northern Ireland has its own Working Time Regulations, from 2016. ${h.src('nidHoliday', 'nidirect')} states that your employer can control when you take your holiday and that bank holidays can be included in the minimum, so check your contract for the notice it sets. For a dispute about holiday dates, the Labour Relations Agency gives free advice in Northern Ireland, as Acas does in Great Britain.</p>
`,
});
