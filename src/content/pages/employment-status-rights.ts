import { definePage } from '../../lib/guide-types';
import { FAMILY_RATE, MAX_REDUNDANCY_GB, P } from '../../lib/engine/params';
import { entitlementDays } from '../../lib/engine/holiday';
import { weeklySsp } from '../../lib/engine/ssp';
import { displayDate, formatMoney, formatPercent } from '../../lib/format';

const g = (n: number, d = 0) => formatMoney(n, d);
const A = P.leavingExtra.agencyEqualTreatmentWeeks;
const BREAK = P.leavingExtra.agencyMaxBreakWeeks;
// A casual worker averaging £260 a week: SSP from the 2026 rules.
const casualSsp = weeklySsp(260);
const daysFull = entitlementDays(5);

export default definePage({
  id: 'employment-status-rights',
  group: 'leaving',
  order: 70,
  mini: 'statusRights',
  miniHref: 'statutory-redundancy-pay',
  related: ['statutory-redundancy-pay', 'statutory-notice-period', 'zero-hours-holiday-pay', 'statutory-sick-pay', 'maternity-allowance', 'paternity-leave-2026'],
  sources: ['govEmploymentStatus', 'lv_era230', 'lv_govAgency', 'govMaternityPay', 'govSsp', 'govPaternity'],
  slug: 'employment-status-rights',
  nav: 'Employee, worker or self-employed',
  card: 'Which of the money rights on this site an employee, a worker and a self-employed person each get.',
  title: `Employment Status Rights 2026: Employee, Worker or Freelance`,
  description: `Employment status in 2026: employees get notice and up to ${g(MAX_REDUNDANCY_GB)} redundancy pay, workers get holiday and statutory pay, the self-employed neither. Agency too.`,
  h1: 'Employee, worker or self-employed: which rights you have',
  intro: 'Every right on this site depends first on your employment status in law, and the label in your contract does not settle it.',
  resume: `UK employment law sorts people who work into three main groups, and the rights in this site follow them. An employee works under a contract of employment and has the full set: statutory notice of up to ${P.notice.maxWeeks} weeks, statutory redundancy pay of up to ${g(MAX_REDUNDANCY_GB)} after ${P.redundancy.qualifyingYears} years, paid holiday of ${P.holiday.statutoryWeeks} weeks, Statutory Sick Pay, and maternity, paternity, adoption and shared parental leave and pay. A worker, such as many casual, zero-hours and agency staff, personally does work under a looser arrangement and gets paid holiday and the National Minimum Wage, and may also be entitled to SSP and the statutory family payments, but not to statutory notice, redundancy pay or the leave rights. The self-employed run their own business and have none of these. Courts and tribunals decide status from how the work happens in practice, and HMRC can reach a different view for tax.`,
  faqs: [
    { q: 'My contract calls me a freelancer. Can I still be a worker or an employee?', a: 'Yes. Status turns on how the relationship works, not on the label. GOV.UK says a court or tribunal makes the final decision by looking at the arrangement in practice: whether you must do the work personally, whether the business controls how and when, whether it must offer work and you must accept it, and whether you are paid through PAYE.' },
    { q: 'Are zero-hours workers entitled to holiday pay?', a: `Yes. Paid holiday is a worker’s right, and GOV.UK lists workers with irregular hours among those entitled to ${P.holiday.statutoryWeeks} weeks a year. In Great Britain, for leave years starting on or after ${displayDate(P.holiday.irregularRegimeFrom, 'en-GB')}, irregular-hours workers build up leave at ${formatPercent(P.holiday.irregularAccrualRate, 2)} of the hours they work in each pay period.` },
    { q: 'I am an agency worker. When do I get the same terms as permanent staff?', a: `After ${A} weeks in the same role with the same hirer. From the first day you have a worker’s rights, including paid holiday and the National Minimum Wage. The ${A}-week clock pauses for sickness, annual leave and breaks of ${BREAK} weeks or less, and restarts with a substantively different role or a new workplace.` },
    { q: 'Can a worker who is not an employee get Statutory Maternity Pay?', a: `Yes, if they are on the payroll and meet the earnings and service tests. GOV.UK says workers may be entitled to SMP and the other statutory payments, while maternity leave itself is for employees only. An agency worker, for example, can receive SMP while having no statutory maternity leave, so the right to return to the same job is not protected in the same way.` },
    { q: 'I am self-employed and pregnant. Is there anything I can claim?', a: `Not from a client, but you may qualify for Maternity Allowance from the government. GOV.UK says self-employed people registered with HMRC can get between ${g(P.familyPay.maLowRate)} and ${g(FAMILY_RATE, 2)} a week for up to ${P.familyPay.maWeeks} weeks, depending on their National Insurance record. There is no statutory paternity or sick pay for self-employed work.` },
  ],
  body: (h) => `
<h2>The three statuses in law</h2>
<p>Section 230 of the Employment Rights Act 1996 defines an employee as someone who works under a contract of employment, and a worker as someone who either has such a contract or personally performs work for another party who is not their client or customer. Every employee is therefore also a worker, but not the other way round. The self-employed fall outside both: they run a business and their customers are clients.</p>
<p>GOV.UK’s employment status guide gives the practical signs. You are probably an <strong>employee</strong> if you must work regularly, do a minimum number of hours, are supervised, cannot send a substitute, get paid holiday and sick pay, and are covered by the employer’s disciplinary procedures. You are probably a <strong>worker</strong> if you work occasionally, the business need not offer work and you need not accept it, the contract says “casual”, “freelance” or “zero hours”, yet you must do the work yourself under someone’s control. You are probably <strong>self-employed</strong> if you bid or quote for work, invoice, are not directly supervised and pay your own tax and National Insurance.</p>

<h2>Rights on this site, status by status</h2>
${h.table(['Right', 'Employee', 'Worker', 'Self-employed'], [
    ['Statutory notice', `Yes, ${P.notice.underTwoYearsWeeks} to ${P.notice.maxWeeks} weeks`, 'No', 'No'],
    ['Statutory redundancy pay', `Yes, after ${P.redundancy.qualifyingYears} years`, 'No', 'No'],
    ['Paid holiday', `Yes, ${P.holiday.statutoryWeeks} weeks`, `Yes, ${P.holiday.statutoryWeeks} weeks`, 'No'],
    ['Statutory Sick Pay', 'Yes', 'May be entitled', 'No'],
    ['SMP, SPP, SAP, ShPP', 'Yes, if conditions met', 'May be entitled', 'No (Maternity Allowance instead)'],
    ['Maternity, paternity, adoption leave', 'Yes', 'No', 'No'],
  ], 'From GOV.UK, Employment status (worker and employee sections) and the guides to each right.', ['l', 'l', 'l', 'l'])}
<p>Holiday is the right that reaches furthest: a worker on a five-day pattern has the same ${h.num(daysFull)} days as an employee. Sick pay changed in April 2026: SSP is now paid from the first day of sickness with no lower earnings limit, so a casual worker averaging ${h.gbp(260)} a week who qualifies would receive ${h.gbp(casualSsp, 2)} a week, ${h.pct(P.ssp.earningsShare, 0)} of earnings. GOV.UK’s SSP page states the condition as being “classed as an employee” and adds that agency workers may be entitled; the ${h.a('statutory-sick-pay', 'SSP guide')} explains who is covered.</p>

<h2>Agency workers</h2>
<p>An agency worker has a contract with an agency and works temporarily for a hirer. GOV.UK says you have a worker’s rights from the first day, plus access to the hirer’s shared facilities such as a canteen or car parking. After ${A} weeks in the same job you qualify for “equal treatment”: the same pay as a permanent colleague doing the same work, automatic pension enrolment and paid annual leave on the same basis. The ${A} weeks need not be in a row. The count pauses, without restarting, for sickness, annual leave and breaks of ${BREAK} weeks or less; it continues through pregnancy, maternity, adoption and paternity leave; and it starts again with a substantively different role or a different workplace.</p>
<p>Agency workers may get SMP but cannot get statutory maternity leave, and after ${A} weeks they gain paid time off for antenatal care. Whether an agency worker is an employee of the agency, with redundancy and notice rights, depends on the terms of engagement, which must state whether the contract is a contract of employment or a contract for services.</p>

<h2>Directors and office holders</h2>
<p>GOV.UK treats an office holder, such as a club treasurer, a trustee or a registered company secretary, as neither an employee nor a worker, unless they also have an employment contract with the same organisation that meets the test for employees. A company director who does other work for the company may likewise have an employment contract and the rights that go with it. Employee shareholders, who hold shares in exchange for some rights, are excluded from statutory redundancy pay.</p>

<h2>When status is disputed</h2>
<p>Contact Acas, or the Labour Relations Agency in Northern Ireland, for free advice. A final decision on status for employment rights belongs to an employment tribunal (an industrial tribunal in Northern Ireland) or a court; HMRC may separately treat someone as self-employed for tax, and a tribunal can still find them a worker or an employee. Rights that need service, such as redundancy pay and the longer notice periods, are counted from the start of continuous employment as an employee: check ${h.a('statutory-redundancy-pay', 'statutory redundancy pay')} and ${h.a('statutory-notice-period', 'statutory notice')} with your real start date.</p>
`,
});
