import { definePage } from '../../lib/guide-types';
import { P } from '../../lib/engine/params';
import { birthDates } from '../../lib/engine/family';
import { addDays, addWeeks } from '../../lib/engine/dates';
import { displayDate } from '../../lib/format';

const d = (iso: string) => displayDate(iso, 'en-GB');

const F = P.familyPay;
const X = P.familyExtra;
const additional = F.maternityLeaveWeeks - F.ordinaryLeaveWeeks;
// Worked example computed by the engine: the tool's own defaults.
const due = '2027-04-20';
const leave = '2027-04-04';
const b = birthDates(due);
const omlEnd = addDays(addWeeks(leave, F.ordinaryLeaveWeeks), -1);
const amlEnd = addDays(addWeeks(leave, F.maternityLeaveWeeks), -1);
const back = addDays(amlEnd, 1);
// Coming back when SMP ends instead: the notice must be given 8 weeks before that day.
const earlyBack = addWeeks(leave, F.smpWeeks);
const earlyNotice = addWeeks(earlyBack, -F.returnChangeNoticeWeeks);

export default definePage({
  id: 'maternity-leave-dates-calculator',
  group: 'family',
  order: 30,
  tool: 'maternityDates',
  related: ['maternity-pay-calculator', 'statutory-maternity-pay', 'keeping-in-touch-days', 'holiday-on-maternity-leave', 'shared-parental-pay-calculator', 'redundancy-maternity-leave'],
  sources: ['govMaternityPay', 'govEmployerSmp', 'fam_mpl11', 'fam_mpl18', 'fam_nidMaternityLeave', 'fam_nidMaternityReturn', 'smartAnswers'],
  slug: 'maternity-leave-dates-calculator',
  nav: 'Maternity leave dates',
  card: 'Qualifying week, earliest start, notice deadline and return date from your due date.',
  title: 'Maternity Leave Dates Calculator 2026: Start, Notice, Return',
  description: `Maternity leave dates for 2026 and 2027: ${F.maternityLeaveWeeks} weeks from your chosen start, earliest ${F.earliestStartWeeksBeforeEWC} weeks before the due week, notice deadline and the day you return.`,
  h1: 'Maternity leave dates calculator',
  intro: 'One due date and one planned start: every deadline and every end date of your maternity leave, on a Sunday-to-Saturday calendar.',
  resume: `Statutory Maternity Leave is ${F.maternityLeaveWeeks} weeks long for every employee, whatever their length of service, hours or pay: ${F.ordinaryLeaveWeeks} weeks of Ordinary Maternity Leave followed by ${additional} weeks of Additional Maternity Leave. The earliest it can start is the Sunday ${F.earliestStartWeeksBeforeEWC} weeks before the expected week of childbirth, and your employer must know the due date and your chosen start by the end of the qualifying week, ${F.qualifyingWeekBeforeEWC} weeks before that week. Two events can start it sooner than planned: a birth before the chosen date, which starts leave the next day, and any pregnancy-related absence in the ${F.sickTriggerWeeksBeforeEWC} weeks before the due week. ${F.compulsoryLeaveWeeks} weeks after the birth are compulsory, ${F.compulsoryLeaveFactoryWeeks} for factory workers. If the baby is due on ${d(due)} and leave starts on ${d(leave)}, the full leave ends on ${d(amlEnd)}, and returning before then needs ${F.returnChangeNoticeWeeks} weeks’ notice.`,
  faqs: [
    { q: 'What day of the week does the expected week of childbirth start?', a: `Always a Sunday. The law counts the expected week of childbirth from the Sunday on or before your due date to the following Saturday, and every other deadline is counted in whole weeks back from that Sunday. A baby due on a Saturday and one due on the following Sunday therefore have qualifying weeks a week apart, with different notice deadlines.` },
    { q: 'I found out late that I was pregnant. Is my right to maternity leave lost if I miss the notice deadline?', a: `No. Where giving notice by the end of the qualifying week was not reasonably practicable, you give it as soon as you reasonably can; nidirect gives not knowing you were pregnant as the example. What you cannot do is start leave earlier than ${F.earliestStartWeeksBeforeEWC} weeks before the expected week of childbirth.` },
    { q: 'Can I move my maternity leave start date after telling my employer?', a: `Yes, with ${X.leaveStartChangeNoticeDays} days’ notice, according to GOV.UK’s employer guide; it cannot refuse the leave or shorten it. The SMP start moves with it, so the ${F.noticeDaysPay}-day notice for pay should be updated at the same time. Your employer then confirms the new end date of leave in writing.` },
    { q: `What happens if I go back to work early without giving ${F.returnChangeNoticeWeeks} weeks’ notice?`, a: `Your employer may postpone your return until ${F.returnChangeNoticeWeeks} weeks after you told them, though never beyond the end of your ${F.maternityLeaveWeeks} weeks of leave. If you turn up before the postponed date after being told not to, the employer does not have to pay you for those days (Maternity and Parental Leave etc. Regulations 1999, regulation 11).` },
    { q: `Do I need to tell my employer I am returning after the full ${F.maternityLeaveWeeks} weeks?`, a: `No. Your employer assumes you take all ${F.maternityLeaveWeeks} weeks and must have written to you with the end date, so you simply come back the day after. Notice is only required to come back earlier. If you decide not to come back at all, you resign by giving the notice in your contract.` },
  ],
  body: (h) => `
<h2>The example, date by date</h2>
<p>The calculator opens on a baby due on ${h.date(due)} and leave planned from ${h.date(leave)}. Here is what it works out, and why:</p>
${h.table(['Step', 'Date', 'Rule'], [
    ['Expected week of childbirth begins', h.date(b.ewcStart), 'The Sunday on or before the due date'],
    ['Qualifying week', `${h.date(b.qwStart)} to ${h.date(b.qwEnd)}`, `${F.qualifyingWeekBeforeEWC}th week before the due week`],
    ['Tell your employer by', h.date(b.noticeBy), 'End of the qualifying week'],
    ['Earliest possible start', h.date(b.earliestLeave), `${F.earliestStartWeeksBeforeEWC} weeks before the due week`],
    ['Pregnancy-related absence starts leave from', h.date(b.sicknessTrigger), `${F.sickTriggerWeeksBeforeEWC} weeks before the due week`],
    ['Ordinary Maternity Leave ends', h.date(omlEnd), `${F.ordinaryLeaveWeeks} weeks from the start`],
    ['Additional Maternity Leave ends', h.date(amlEnd), `${F.maternityLeaveWeeks} weeks from the start`],
    ['First day back', h.date(back), 'No notice needed'],
  ], `Due ${h.date(due)}, leave from ${h.date(leave)}.`, ['l', 'l', 'l'])}
<p>Suppose the plan changes and you want to come back on ${h.date(earlyBack)}, the day after the last week of Statutory Maternity Pay. You would need to tell your employer by ${h.date(earlyNotice)}, ${F.returnChangeNoticeWeeks} weeks before.</p>

<h2>Why the halfway point matters</h2>
<p>The ${F.ordinaryLeaveWeeks}-week boundary between ordinary and additional leave changes what you come back to. After ordinary leave alone, you return to the same job. After additional leave, you return to the same job unless that is not reasonably practicable, in which case the employer must offer another job that is suitable for you and appropriate in the circumstances (${h.src('fam_mpl18', 'regulation 18 of the 1999 Regulations')}). Anyone planning to stay away for six calendar months should check the end date: six months is a few days longer than ${F.ordinaryLeaveWeeks} weeks, which is enough to fall into additional leave.</p>

<h2>The automatic triggers</h2>
<p>You do not fully control the start. If you are off work for a reason connected with the pregnancy on any day from the Sunday ${F.sickTriggerWeeksBeforeEWC} weeks before the due week, leave and pay start the next day, even if you had planned to work until the due date. Ordinary sickness unrelated to the pregnancy does not trigger it. A birth before your planned start date also starts leave on the following day, and your employer will then need the birth certificate or a document signed by a doctor or midwife giving the actual date. The calculator keeps the deadlines that depend on the due date, which do not move when the baby arrives early.</p>

<h2>Northern Ireland</h2>
<p>The leave calendar is the same: ${F.maternityLeaveWeeks} weeks split into two halves of ${F.ordinaryLeaveWeeks}, notice by the ${F.qualifyingWeekBeforeEWC}th week before the due week, earliest start ${F.earliestStartWeeksBeforeEWC} weeks before, and ${F.returnChangeNoticeWeeks} weeks’ notice to come back early (${h.src('fam_nidMaternityLeave', 'nidirect, Statutory Maternity Leave')}). To add the money to the dates, use the ${h.a('maternity-pay-calculator', 'maternity pay calculator')}; to see how holiday builds up during these weeks, read ${h.a('holiday-on-maternity-leave', 'holiday on maternity leave')}.</p>
`,
});
