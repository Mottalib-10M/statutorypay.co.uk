import { definePage } from '../../lib/guide-types';
import { P } from '../../lib/engine/params';
import { computeNotice, statutoryNoticeWeeks } from '../../lib/engine/notice';
import { addDays, addMonths, addYears } from '../../lib/engine/dates';
import { displayDate } from '../../lib/format';

const N = P.notice;
const L = P.leavingExtra;
const d = (iso: string) => displayDate(iso, 'en-GB');
const GIVEN = '2026-11-02';
// Statutory employer notice for a length of service ending the day notice is given.
const weeksAfter = (years: number, months = 0) => statutoryNoticeWeeks(addMonths(addYears(addDays(GIVEN, 1), -years), -months), GIVEN);
const scale: Array<[string, number]> = [
  [`Under ${N.minServiceMonths} month`, statutoryNoticeWeeks(addDays(GIVEN, -10), GIVEN)],
  [`${N.minServiceMonths} month to under 2 years`, weeksAfter(0, N.minServiceMonths)],
  ...Array.from({ length: N.maxWeeks - 1 }, (_, i) => [`${i + 2} complete years`, weeksAfter(i + 2)] as [string, number]),
  [`${N.maxWeeks + 1} years or more`, weeksAfter(N.maxWeeks + 1)],
];
// Worked case: an anniversary falls a few days after the dismissal letter.
const before = computeNotice({ start: '2020-11-09', noticeGiven: GIVEN, contractualWeeks: 0, weeklyPay: 0 });
const after = computeNotice({ start: '2020-11-09', noticeGiven: '2026-11-09', contractualWeeks: 0, weeklyPay: 0 });

export default definePage({
  id: 'statutory-notice-period',
  group: 'leaving',
  order: 20,
  mini: 'noticeScale',
  miniHref: 'notice-period-calculator',
  related: ['notice-period-calculator', 'payment-in-lieu-of-notice', 'resignation-notice-period', 'weeks-pay-explained', 'redundancy-relevant-date'],
  sources: ['era86', 'lv_era87', 'lv_era212', 'era226', 'govDismissal', 'ni_erni118'],
  slug: 'statutory-notice-period',
  nav: 'Statutory notice periods',
  card: 'The section 86 scale year by year, pay during notice when you are off sick, and when no notice is owed.',
  title: `Statutory Notice Period 2026: The Week-by-Year Scale to ${N.maxWeeks}`,
  description: `Statutory notice period in 2026: ${N.underTwoYearsWeeks} week after a month, then a week per complete year up to ${N.maxWeeks}, pay if sick or on holiday during notice, and misconduct.`,
  h1: 'Statutory notice periods and your rights while notice runs',
  intro: 'The minimum notice an employer owes rises with each complete year of service; the law also protects your pay if you are ill or on leave while it runs.',
  resume: `The statutory notice period is the least notice an employer may give to end an employee’s contract. Under section 86 of the Employment Rights Act 1996 it is ${N.underTwoYearsWeeks} week once the employee has ${N.minServiceMonths} month of continuous employment, then one week for each complete year from two years onwards, reaching a ceiling of ${N.maxWeeks} weeks at twelve years; an employee who resigns owes ${N.employeeWeeks} week. Northern Ireland uses the identical scale in article 118 of its 1996 Order. A contract can give more notice but any shorter clause is overridden, and either side may waive notice or accept pay in lieu. Sections 87 to 91 add a less known guarantee: during the statutory minimum notice, an employee who is off sick, on holiday or on family leave must still receive at least a week’s pay for each week, unless the contractual notice is at least one week longer than the statutory figure.`,
  faqs: [
    { q: 'Does my notice go up if my work anniversary falls during the notice period?', a: `No. The weeks are fixed by complete years of continuous employment on the day notice is given. Someone who started on ${d('2020-11-09')} and is given notice on ${d(GIVEN)} has ${before.serviceYears} complete years and is owed ${before.statutoryWeeks} weeks, even though the sixth anniversary arrives a week later. The same notice handed over on ${d('2026-11-09')} would carry ${after.statutoryWeeks}.` },
    { q: 'I am off sick with no sick pay left. What am I paid during my notice?', a: `If your employer gives the statutory minimum notice, section 88 entitles you to at least a week’s pay for each week of it, even with your company sick pay and SSP exhausted. Any SSP or sick pay paid counts towards that sum. The protection is lost when your contract notice is a week or more longer than the statutory notice.` },
    { q: 'Does time on sick leave or maternity leave count towards my years of notice?', a: `Yes, as long as the contract continues. Section 212 counts every week in which your relations with the employer are governed by a contract of employment, whatever you were doing. Even without a contract, up to ${L.sicknessBridgeWeeks} weeks of incapacity through sickness or injury keep continuity between two periods of work.` },
    { q: 'Can my employer dismiss me with no notice at all?', a: 'Only where your own conduct justifies ending the contract immediately: section 86(6) preserves that right for both sides. GOV.UK gives violence towards a colleague, customer or property as an example of gross misconduct, and says the employer should still investigate first. Dismissal without notice in any other case is a breach of contract.' },
    { q: 'Who is outside the statutory notice rules?', a: 'Anyone who is not an employee, such as an independent contractor or freelance agent. nidirect also lists civil servants, the armed forces and certain merchant seafarers. A casual worker without an employment contract has whatever notice the arrangement says. Apprentices are covered, and if you stay on after an apprenticeship that time counts towards your notice.' },
  ],
  body: (h) => `
<h2>The scale, year by year</h2>
<p>Section 86(1) sets three bands, and the table below spells them out for every length of service. The weeks come from the same function the ${h.a('notice-period-calculator', 'notice calculator')} uses, with notice given on ${h.date(GIVEN)}.</p>
${h.table(['Continuous employment when notice is given', 'Minimum notice from the employer'], scale.map(([s, w]) => [s, w ? `${w} week${w === 1 ? '' : 's'}` : 'None by statute']), 'ERA 1996 s.86(1); identical scale in the Employment Rights (Northern Ireland) Order 1996, art. 118.', ['l', 'r'])}
<p>Two quirks follow from the wording. First, a year only counts once it is complete: eleven years and eleven months still give eleven weeks. Second, years between the first month and the second anniversary are flat at ${N.underTwoYearsWeeks} week, so an employee with twenty-three months has the same minimum as someone with five weeks.</p>

<h2>What “continuous employment” means here</h2>
<p>Service runs from the day you started work (section 211) to the day notice is given. Section 212 counts every week in which a contract of employment governs your relationship with the employer, so a week of holiday, sickness or maternity leave inside the contract counts like any other. Outside a contract, a gap caused by sickness or injury of up to ${L.sicknessBridgeWeeks} weeks, a temporary cessation of work, or an absence that the employer treats by arrangement as continuing employment can bridge two periods of work. Some periods, such as days on strike, do not break continuity but push the start date later. Your written statement of particulars should give the date your employer uses; if it is wrong, raise it before notice is calculated.</p>
<p>Section 86(4) closes one gap: a contract for a fixed term of ${L.shortTermContractMaxMonths} month or less, held by someone who has already worked ${L.shortTermContractServiceMonths} months or more, is treated as open-ended, so the scale applies to it.</p>

<h2>Contracts may add notice, never remove it</h2>
<p>Section 86(3) makes any shorter clause subject to the statutory minimum. A contract promising “one week’s notice in all cases” therefore gives ten weeks to someone with ten years of service. A contract can go further than the statute, and many do for senior posts. What section 86(3) does not stop is a waiver: on a given occasion either party may give up notice, or the employee may accept pay in lieu instead. The ${h.a('payment-in-lieu-of-notice', 'guide to pay in lieu')} explains what that payment must include.</p>

<h2>Pay while notice runs, if you are off work</h2>
<p>Sections 87 to 91 are the part of the law most people never hear about. They apply to the statutory minimum notice, whether the employer or the employee gave it, and they set a floor on pay for any time in that period when the employee:</p>
<ul>
<li>is ready and willing to work but the employer provides no work;</li>
<li>is incapable of work because of sickness or injury;</li>
<li>is absent because of pregnancy or childbirth, or on adoption, shared parental, carer’s, parental bereavement, neonatal care, parental or paternity leave;</li>
<li>is on holiday under the terms of the contract.</li>
</ul>
<p>For an employee with normal working hours, section 88 guarantees those hours at the average hourly rate of a week’s pay. For one without normal hours, section 89 guarantees a week’s pay for each week, provided the employee is ready and willing to do a reasonable amount of work; that condition is lifted during sickness, family leave and holiday. Statutory Sick Pay, SMP, holiday pay and any company payment all count towards the guarantee, so the employer only tops up the difference. The week’s pay used is measured on a calculation date set by section 226(1): the day before the statutory notice period starts. The method is in ${h.a('weeks-pay-explained', 'how a week’s pay is worked out')}.</p>
<h3>When the guarantee does not apply</h3>
<ul>
<li>The contract notice the employer must give is at least one week longer than the statutory minimum (section 87(4)). With a three-month clause and four years of service, the protection is gone.</li>
<li>The time off was leave you asked for and the employer granted, such as unpaid leave (section 91(1)).</li>
<li>You resigned and then took part in a strike before the contract ended (section 91(2)).</li>
<li>You resigned: the employer’s liability only arises once you actually leave at the end of your notice (sections 88(3) and 89(5)).</li>
</ul>

<h2>When no notice is owed</h2>
<p>Section 86(6) keeps the old common-law right to end a contract without notice because of the other party’s conduct. For employers, that means gross misconduct, such as violence towards a colleague or customer; for employees, a fundamental breach by the employer that justifies resigning at once, known as constructive dismissal. A fixed-term contract that simply reaches its agreed end needs no notice either. In every other case, dismissal with less than the minimum is a breach of contract, and the remedy is the notice pay you should have received: raise a grievance first, then, if needed, a breach of contract claim at the employment tribunal (an industrial tribunal in Northern Ireland).</p>
<p>Notice and redundancy interact: if the employer gives less than the statutory notice, the date used to count service for redundancy pay moves to where the statutory notice would have ended. See ${h.a('redundancy-relevant-date', 'the relevant date')}.</p>
`,
});
