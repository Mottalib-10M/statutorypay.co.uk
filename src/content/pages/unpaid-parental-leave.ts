import { definePage } from '../../lib/guide-types';
import { P } from '../../lib/engine/params';

const F = P.familyPay;

export default definePage({
  id: 'unpaid-parental-leave',
  group: 'family',
  order: 140,
  mini: 'parentalLeave',
  related: ['paternity-leave-2026', 'shared-parental-pay-calculator', 'parental-bereavement-pay', 'employment-status-rights', 'northern-ireland-employment-rights'],
  sources: ['govParentalLeave', 'era2025', 'nidParentalLeave'],
  slug: 'unpaid-parental-leave',
  nav: 'Unpaid parental leave',
  card: '18 weeks per child before the 18th birthday, now from day one in Great Britain.',
  title: `Unpaid Parental Leave 2026: ${F.parentalLeaveWeeksPerChild} Weeks per Child, Day One`,
  description: `Unpaid parental leave in 2026: ${F.parentalLeaveWeeksPerChild} weeks per child up to age ${F.parentalLeaveAgeLimit}, ${F.parentalLeaveWeeksPerYear} weeks a year, a day-one right in Great Britain since April, one year of service in NI.`,
  h1: 'Unpaid parental leave: 18 weeks for each child',
  intro: 'Time off to look after a child’s welfare, separate from maternity and paternity leave: how much, how to book it, and when an employer can delay it.',
  resume: `Unpaid parental leave lets each parent take up to ${F.parentalLeaveWeeksPerChild} weeks off for each child, adopted children included, until the child’s ${F.parentalLeaveAgeLimit}th birthday. It is unpaid by law, though some contracts pay part of it, and your employment rights continue while you are away. In Great Britain it became a day-one right on 6 April 2026: the old condition of one year’s service was removed by the Employment Rights Act 2025, and GOV.UK now lists only the employee, parental-responsibility and age conditions. In Northern Ireland a year of continuous service is still required. Unless the employer agrees otherwise, you can take at most ${F.parentalLeaveWeeksPerYear} weeks a year for each child, in whole weeks, a week being your normal working days. You must give ${F.parentalLeaveNoticeDays} days’ notice, and the employer can postpone the leave for up to ${F.parentalLeavePostponeMonths} months for a significant business reason, but never leave a father or partner takes right after a birth or adoption.`,
  faqs: [
    { q: 'Does unpaid parental leave restart with a new employer?', a: `No. The ${F.parentalLeaveWeeksPerChild} weeks belong to the child, not to the job. GOV.UK’s example: an employee who used 10 weeks with a previous employer can take up to 8 more with the new one, if eligible. Keep a note of the weeks used, because a new employer may ask.` },
    { q: 'Can I take parental leave one day at a time?', a: 'Only if your employer agrees, or if your child is disabled. Otherwise leave is taken in whole weeks. For a part-timer a week is the days normally worked in a week, so a three-day worker taking one week of parental leave is off for three days.' },
    { q: 'Can my employer refuse parental leave at a busy time?', a: `They can postpone it, not refuse it, and only if your absence would cause serious disruption. They must write within 7 days of your request giving the reason and a new start date no more than ${F.parentalLeavePostponeMonths} months later, and they cannot reduce the length or delay it past the child’s 18th birthday.` },
    { q: 'Do I keep my job and benefits while on unpaid parental leave?', a: 'Yes. Your employment rights continue during the leave: you return to the same job after a period of four weeks or less, holiday keeps building up, and the period counts as continuous employment. Contractual benefits that depend on pay, such as pension contributions, follow the terms of your contract and scheme.' },
  ],
  body: (h) => `
<h2>What it is for</h2>
<p>The leave is meant for the child’s welfare, read broadly. GOV.UK gives examples: attending the birth, spending more time with young children, looking at new schools, settling a child into new childcare, or spending time with family such as grandparents. Caring for a child does not mean being with them every hour of the day. What it is not designed for is an emergency on the day itself, which the right to time off for dependants covers.</p>

<h2>Who can take it</h2>
<p>Parental leave is for employees, not workers or the self-employed, who are named on the child’s birth or adoption certificate or who have, or expect to have, parental responsibility. Agency workers and contractors are excluded, and foster parents only qualify if they have secured parental responsibility through the courts. Employers may extend it to others, for example grandparents or foster carers, through their own policy. In Great Britain there is no longer any length-of-service condition: someone who started a new job last week can book parental leave with the right notice. In Northern Ireland, ${h.src('nidParentalLeave', 'nidirect')} still requires ${F.parentalLeaveServiceNIYears} year of continuous service.</p>

<h2>How much, and how fast</h2>
<p>The two limits work together: ${F.parentalLeaveWeeksPerChild} weeks in total for each child, and no more than ${F.parentalLeaveWeeksPerYear} weeks a year for each child unless the employer agrees to more. With two children, a parent can take up to ${2 * F.parentalLeaveWeeksPerYear} weeks in a year, four for each. Both parents have their own allowance; it cannot be transferred from one to the other.</p>
${h.table(['Child’s age when you start', 'Years left before 18', `Weeks you can take at ${F.parentalLeaveWeeksPerYear} a year`], [0, 6, 12, 14, 15, 16, 17].map((age) => { const years = F.parentalLeaveAgeLimit - age; return [age, years, Math.min(F.parentalLeaveWeeksPerChild, years * F.parentalLeaveWeeksPerYear)]; }), 'Assuming no leave used yet and no extra weeks agreed by the employer.', ['r', 'r', 'r'])}
<p>The table shows why it is worth starting before the teenage years: a parent who first uses the right at 15 can only take ${3 * F.parentalLeaveWeeksPerYear} of the ${F.parentalLeaveWeeksPerChild} weeks at the standard pace.</p>
<p>A “week” follows your pattern. Someone working three days a week takes three days for each week. For irregular patterns, GOV.UK divides the days worked in a year by 52 to find the length of a week. The calculator above converts your remaining weeks into days on that basis and shows how many of them the yearly limit lets you use before the 18th birthday, which is the figure to put in your request.</p>

<h2>Booking it</h2>
<p>Give your employer ${F.parentalLeaveNoticeDays} days’ notice of the start and end dates. If the leave is to start at a birth or an adoption, the notice is ${F.parentalLeaveNoticeDays} days before the week the baby is due or the child is expected. Notice need not be in writing unless the employer asks. The employer can ask for reasonable evidence of parental responsibility or of the child’s age, such as a birth certificate, but not every time you ask for leave.</p>

<h2>Postponement</h2>
<p>An employer with a significant reason, such as serious disruption to the business, can postpone the leave once. It must write to you within seven days of your request, explain why and propose new dates within ${F.parentalLeavePostponeMonths} months of the dates you asked for. It cannot postpone leave that would push past the child’s 18th birthday, and it cannot postpone leave that a father or partner wants to take immediately after the birth or adoption.</p>

<h2>Parental leave next to the other rights</h2>
<p>Parental leave is separate from ${h.a('paternity-leave-2026', 'paternity leave')}, ${h.a('shared-parental-pay-calculator', 'shared parental leave')} and maternity leave, and can be taken before, after or between them. It does not stop holiday from building up. Unlike shared parental leave it carries no statutory pay; low-income parents may get help from Universal Credit during it. For a short emergency, such as a childminder letting you down or a child falling ill, the separate right to reasonable unpaid time off for dependants is the better tool: it has no qualifying period and no notice period.</p>
`,
});
