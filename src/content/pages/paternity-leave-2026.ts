import { definePage } from '../../lib/guide-types';
import { FAMILY_RATE, LEL, P } from '../../lib/engine/params';
import { computeSpp } from '../../lib/engine/family';
import { formatMoney, formatDecimal, displayDate } from '../../lib/format';

const g = (n: number, d = 0) => formatMoney(n, d);
const d = (iso: string) => displayDate(iso, 'en-GB');
const F = P.familyPay;
const X = P.familyExtra;
// Engine example: baby due 10 May 2027, father started 1 March 2027 in Great Britain.
const ex = computeSpp({ dueDate: '2027-05-10', awe: 600, employmentStart: '2027-03-01', weeks: 2, leaveStart: '2027-05-10', jurisdiction: 'GB' });
const exNI = computeSpp({ dueDate: '2027-05-10', awe: 600, employmentStart: '2027-03-01', weeks: 2, leaveStart: '2027-05-10', jurisdiction: 'NI' });

export default definePage({
  id: 'paternity-leave-2026',
  group: 'family',
  order: 90,
  mini: 'paternityWindow',
  miniHref: 'paternity-pay-calculator',
  related: ['paternity-pay-calculator', 'shared-parental-pay-calculator', 'unpaid-parental-leave', 'parental-bereavement-pay', 'northern-ireland-employment-rights'],
  sources: ['era2025s16', 'fam_era2025s17', 'fam_paternityAmend2024', 'fam_pal6', 'govPaternity', 'fam_govEmployerPaternity', 'nidPaternityLeave'],
  slug: 'paternity-leave-day-one',
  nav: 'Paternity leave since April 2026',
  card: 'Day-one paternity leave in Great Britain, two separate weeks, the notice rules and how Northern Ireland differs.',
  title: 'Paternity Leave 2026: Day-One Right, Two Separate Weeks',
  description: `Paternity leave 2026: a day-one right in Great Britain since ${d(F.paternityDayOneGBFrom)}, ${F.paternityWeeks} weeks within ${F.paternityWindowWeeksGB} weeks, after shared parental leave too. Notice and NI rules.`,
  h1: 'Paternity leave as a day-one right: what changed and what did not',
  intro: 'Three reforms in two years have reshaped paternity leave in England, Scotland and Wales. Northern Ireland has kept the older rules.',
  resume: `Since ${d(F.paternityDayOneGBFrom)}, paternity leave in England, Scotland and Wales is a day-one right: section 16 of the Employment Rights Act 2025 removed the ${F.serviceWeeks}-week qualifying period, so any employee who is the father, the mother’s partner or an intended parent can take it from the first day in the job. Section 17 of the same Act also allows paternity leave to be taken after shared parental leave, which used to cancel it. These changes build on the 2024 reform, under which the ${F.paternityWeeks} weeks can be taken together or as two separate weeks at any time in the first ${F.paternityWindowWeeksGB} weeks after the birth. Notice is still required: the due date by the ${F.qualifyingWeekBeforeEWC}th week before the baby is due, and ${X.paternityStartChangeNoticeDays} days before each week of leave. Paternity pay did not change: it still needs ${F.serviceWeeks} weeks of service and earnings of ${g(LEL)} a week. Northern Ireland keeps the ${F.serviceWeeks}-week condition for leave and a single block within ${F.paternityWindowDaysNI} days.`,
  faqs: [
    { q: 'Can I take my paternity leave six months after the birth?', a: `In Great Britain, yes: each week of leave must simply end within ${F.paternityWindowWeeksGB} weeks of the birth, or of the due date if the baby came early, so a week at six months and another at nine is allowed with ${X.paternityStartChangeNoticeDays} days’ notice before each. In Northern Ireland the leave must be finished within ${F.paternityWindowDaysNI} days of the birth.` },
    { q: 'I started a new job last month and our baby is due soon. Can I take paternity leave?', a: `In Great Britain, yes, if the baby is due after the reform and you give the notice: leave has no qualifying period. You will not get Statutory Paternity Pay unless you had ${F.serviceWeeks} weeks of service by the qualifying week, so the leave may be unpaid unless your contract says otherwise. In Northern Ireland a new starter has no statutory paternity leave.` },
    { q: 'Can I take paternity leave after shared parental leave?', a: `In Great Britain, since ${d(X.paternityAfterSplFrom)}, yes: section 17 of the Employment Rights Act 2025 removed the rule that shared parental leave taken first cancelled paternity leave, and GOV.UK now says they can be taken in any order. In Northern Ireland nidirect still states that you cannot take paternity leave if you have first taken shared parental leave.` },
    { q: 'Do I get paid for going to antenatal appointments with my partner?', a: `Not by law. The father, the expectant mother’s spouse, civil partner or long-term partner, and an intended parent in a surrogacy arrangement can take unpaid time off for ${X.antenatalAppointments} antenatal appointments of up to ${formatDecimal(X.antenatalHoursEach, 1)} hours each. Employees have the right from day one; agency workers after ${X.antenatalAgencyWeeks} weeks in the same job. Your employer can choose to give more.` },
    { q: 'Do I need to show my employer proof of the pregnancy for paternity leave?', a: `No. GOV.UK says you do not need to give proof of the pregnancy or the birth to claim paternity leave or pay. You declare the due date and your relationship to the child, usually with the online form that replaced form SC3, or your employer’s own form. Proof is only needed for adoption, where a matching certificate or agency letter is required for pay.` },
  ],
  body: (hp) => `
<h2>Three reforms, one table</h2>
<p>Paternity leave has changed twice in Great Britain since 2024, and the rules that apply depend on the expected week of childbirth and, for the day-one right, the date the leave starts. Northern Ireland has followed neither change.</p>
${hp.table(['Rule', 'Before April 2024', 'April 2024 to April 2026', `From ${d(F.paternityDayOneGBFrom)} (GB)`, 'Northern Ireland now'], [
    ['Service needed for leave', `${F.serviceWeeks} weeks`, `${F.serviceWeeks} weeks`, 'None', `${F.serviceWeeks} weeks`],
    ['Service needed for pay', `${F.serviceWeeks} weeks`, `${F.serviceWeeks} weeks`, `${F.serviceWeeks} weeks`, `${F.serviceWeeks} weeks`],
    ['How the weeks are taken', 'One block', 'Together or two separate weeks', 'Together or two separate weeks', 'One block'],
    ['Deadline', `${F.paternityWindowDaysNI} days`, `${F.paternityWindowWeeksGB} weeks`, `${F.paternityWindowWeeksGB} weeks`, `${F.paternityWindowDaysNI} days`],
    ['After shared parental leave', 'Not possible', 'Not possible', 'Possible', 'Not possible'],
  ], 'Statutory paternity leave for a birth. Sources: SI 2024/329; Employment Rights Act 2025, ss.16-17; nidirect.', ['l', 'l', 'l', 'l', 'l'])}

<h3>April 2024: two separate weeks, a year to take them</h3>
<p>The ${hp.src('fam_paternityAmend2024', 'Paternity Leave (Amendment) Regulations 2024')} apply to babies whose expected week of birth begins after ${hp.date(X.paternitySeparateWeeksEwcAfter)}. They let the employee take a single period of one or two weeks, or two non-consecutive weeks, and replaced the ${F.paternityWindowDaysNI}-day deadline with ${F.paternityWindowWeeksGB} weeks. They also split the notice: the entitlement by the ${F.qualifyingWeekBeforeEWC}th week before the due week, and the dates ${X.paternityStartChangeNoticeDays} days before each period of leave.</p>
<h3>April 2026: day one, and after shared parental leave</h3>
<p>${hp.src('era2025s16', 'Section 16')} of the Employment Rights Act 2025 deletes the continuous employment condition from section 80A of the Employment Rights Act 1996, in force in full from ${hp.date(F.paternityDayOneGBFrom)}. ${hp.src('fam_era2025s17', 'Section 17')} removes the bar on paternity leave once shared parental leave has been taken, and the matching bar on paternity pay in the Social Security Contributions and Benefits Act 1992. A father can now, for example, share the later months of leave with his partner and keep his two paternity weeks for the end of the first year.</p>

<h2>Notice, including the 2026 transition</h2>
<ol>
<li>By the end of the ${F.qualifyingWeekBeforeEWC}th week before the expected week of childbirth: tell your employer the due date and that you intend to take paternity leave. For Statutory Paternity Pay this notice is the claim itself.</li>
<li>At least ${X.paternityStartChangeNoticeDays} days before each week: say when it starts and whether you take one week or two. A start can be given as the day of birth or a set number of days after it.</li>
<li>To move or cancel a week, give ${X.paternityStartChangeNoticeDays} days’ notice before whichever is earlier, the old date or the new one.</li>
</ol>
<p>Removing the qualifying period created a problem for people who joined an employer too late to give notice ${F.qualifyingWeekBeforeEWC} weeks before the due week. GOV.UK’s employer guide sets out the transitional rule: from ${hp.date(X.paternityTransitionNoticeFrom)}, an employee whose baby was due between ${hp.date(X.paternityTransitionDueFrom)} and ${hp.date(X.paternityTransitionDueTo)}, and who would have had fewer than ${F.serviceWeeks} weeks of service in the qualifying week, did not need to give the ${F.qualifyingWeekBeforeEWC}-week notice of the due date. The ${X.paternityStartChangeNoticeDays}-day notice still applied. For babies due from the following day, both usual notices apply.</p>
<p>Take a father who starts a job on ${hp.date('2027-03-01')} with a baby due on ${hp.date(ex.dates.dueDate)}. His qualifying week ended on ${hp.date(ex.dates.qwEnd)}, before he was even employed, so the due-date notice could not be given on time. ${hp.src('fam_pal6', 'Regulation 6')} of the Paternity and Adoption Leave Regulations 2002 covers him: where notice by that week is not reasonably practicable, it is given as soon as reasonably practicable. He should then ask for leave at least ${X.paternityStartChangeNoticeDays} days ahead. In Great Britain he ${ex.leaveEligible ? 'can take' : 'cannot take'} paternity leave, ending by ${hp.date(ex.windowEnd)}, but ${ex.payEligible ? 'is' : 'is not'} entitled to SPP. In Northern Ireland he ${exNI.leaveEligible ? 'would' : 'would not'} have a right to the leave.</p>

<h2>What else comes with paternity leave</h2>
<p>A week of leave is the number of days you normally work in a week, and the entitlement does not double for twins. Your employment rights continue during the leave, including pay rises, holiday accrual and the right to return. If the baby is stillborn from ${X.stillbirthFromWeekOfPregnancy} weeks of pregnancy or dies after birth, you keep the right to paternity leave and pay; leave already booked can be taken, and remaining leave must be booked and taken within ${X.paternityBookAfterLossWeeks} weeks of the death, alongside ${hp.a('parental-bereavement-pay', 'parental bereavement leave and pay')}. Pay itself, ${g(FAMILY_RATE, 2)} a week or less, is worked out in the ${hp.a('paternity-pay-calculator', 'paternity pay calculator')}.</p>

<h2>Northern Ireland, in detail</h2>
<p>${hp.src('nidPaternityLeave', 'nidirect')} sets out the rules that still apply there: ${F.serviceWeeks} weeks with the employer by the end of the ${F.qualifyingWeekBeforeEWC}th week before the due week; one week or two consecutive weeks, never odd days; leave starting on or after the birth and ending within ${F.paternityWindowDaysNI} days of it, or of the first day of the expected week if the baby is early; a single period even for a multiple birth; and no paternity leave once shared parental leave has been taken. Agency workers and office holders do not normally have the right to the leave but may get the pay. The 2024 regulations extend only to England, Wales and Scotland, and the 2026 sections amend the Employment Rights Act 1996, which does not apply in Northern Ireland; nidirect still describes the older scheme.</p>
`,
});

