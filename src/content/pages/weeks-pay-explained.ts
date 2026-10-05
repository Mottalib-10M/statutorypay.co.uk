import { definePage } from '../../lib/guide-types';
import { CAP_GB, CAP_NI, P } from '../../lib/engine/params';
import { averageWeek } from '../../lib/engine/redundancy';
import { averageWeeksPay } from '../../lib/engine/holiday';
import { formatMoney } from '../../lib/format';

const W12 = P.redundancy.averagingWeeks;
const W52 = P.holiday.referenceWeeks;
const g = (n: number, dec = 0) => formatMoney(n, dec);
// A care assistant on a 37.5-hour contract at £13.20 an hour, with variable paid extras.
const BASIC = 37.5 * 13.2;
const EXTRAS_12 = 1460; // premium shifts and commission in the last 12 weeks (a busy winter)
const EXTRAS_52 = 3900; // the same items over the last 52 weeks
const shortAvg = averageWeek(BASIC * W12 + EXTRAS_12, W12);
const longAvg = averageWeeksPay(BASIC * W52 + EXTRAS_52, W52);
// Zero-hours worker paid in 9 of the last 12 weeks: unpaid weeks are skipped and earlier ones brought in.
const zeroHours = averageWeek(4380, W12);
// A high earner: the cap bites for redundancy pay, not for notice or holiday.
const HIGH = 1150;

export default definePage({
  id: 'weeks-pay-explained',
  group: 'leaving',
  order: 60,
  mini: 'weekPayCompare',
  miniHref: 'redundancy-pay-calculator',
  related: ['redundancy-variable-pay', 'holiday-pay-overtime-commission', 'statutory-notice-period', 'redundancy-pay-cap', 'smp-average-weekly-earnings'],
  sources: ['era221', 'era226', 'lv_era227', 'wtr16', 'govRedundancy', 'hol_nidTakingHolidays'],
  slug: 'weeks-pay-explained',
  nav: 'A week’s pay explained',
  card: 'The 12-week rule for notice and redundancy, the 52-week rule for holiday, and the cap.',
  title: `Week’s Pay 2026: ${W12}-Week and ${W52}-Week Averages, ${g(CAP_GB)} Cap`,
  description: `A week’s pay in UK employment law, 2026: fixed pay, variable pay and no normal hours, the ${W12}-week average against the ${W52}-week holiday rule, and the ${g(CAP_GB)} cap.`,
  h1: 'A week’s pay: the measure behind notice, redundancy and holiday',
  intro: 'Most statutory payments on leaving are counted in weeks of pay, but the law measures that week differently depending on the right.',
  resume: `“A week’s pay” is the unit that statutory redundancy pay, pay during notice and holiday pay are counted in, and the Employment Rights Act 1996 defines it in sections 221 to 224. With normal working hours and pay that does not vary, it is simply what the contract pays for a normal week. When pay varies with the work done, or hours fall on different days and times, it is the normal weekly hours at the average hourly rate of the last ${W12} complete weeks before the calculation date. With no normal hours at all, it is the average weekly pay of those ${W12} weeks, skipping any week with no pay. For holiday pay in Great Britain, regulation 16 of the Working Time Regulations stretches the period to ${W52} paid weeks and adds commission and regular overtime. Only some uses are capped: for redundancy pay a week’s pay cannot exceed ${g(CAP_GB)} in Great Britain or ${g(CAP_NI)} in Northern Ireland, while notice pay and holiday pay have no ceiling.`,
  faqs: [
    { q: 'Does voluntary overtime count in my week’s pay for redundancy?', a: `Usually not. For redundancy and notice, sections 221 to 223 look at pay for normal working hours, and section 234 makes overtime part of those hours only when the contract fixes a minimum number of hours above the point where overtime starts. For holiday pay in Great Britain the rule is wider: overtime regularly paid in the ${W52} weeks before the leave counts.` },
    { q: 'Which twelve weeks are used if I am paid monthly?', a: `The twelve complete weeks ending with the last complete week before the calculation date, or with the week that ends on it. GOV.UK’s convention is a week running Sunday to Saturday, unless your pay is worked out over another seven-day period. For holiday pay, its method for monthly pay is to take the month’s pay divided by the hours worked, then multiply by your weekly hours.` },
    { q: 'Is a week’s pay before or after tax?', a: `Before. The Act counts the remuneration payable by the employer, so the starting point is gross pay, before income tax and National Insurance come off your payslip. The ${g(CAP_GB)} cap for redundancy pay is a gross weekly figure too, which is why the calculators on this site ask for gross weekly pay.` },
    { q: 'I had no work for three of the last twelve weeks. Do those weeks pull my average down?', a: `No. Where no pay was due in a week, sections 223(2) and 224(3) bring in earlier weeks so that twelve weeks with pay are counted. A zero-hours worker who earned ${g(4380)} across the twelve paid weeks therefore has a week’s pay of ${g(zeroHours, 2)}, not a lower figure diluted by the empty weeks.` },
    { q: 'Is the week’s pay for holiday different in Northern Ireland?', a: `Yes. The ${W52}-week reference period was introduced in Great Britain only. nidirect says that in Northern Ireland, holiday pay for pay that varies is the average weekly wage over the previous ${P.holidayExtra.niVariablePayAverageWeeks} weeks, and should take account of guaranteed and non-guaranteed overtime and commission.` },
  ],
  body: (h) => `
<h2>Four cases in the statute</h2>
<p>The Act starts from one question: does the employee have normal working hours under the contract in force on the calculation date? The answer sends the calculation down one of four routes.</p>
${h.table(['Situation', 'Section', 'A week’s pay is'], [
    ['Normal hours, pay fixed for those hours', '221(2)', 'The contractual pay for working the normal hours in a week'],
    ['Normal hours, pay varies with work done (piece rates, commission)', '221(3)', `Normal weekly hours × average hourly rate over ${W12} weeks`],
    ['Normal hours worked on days or times that change (shifts, rotas)', '222', `Average weekly hours × average hourly rate, both over ${W12} weeks`],
    ['No normal working hours (zero hours, casual)', '224', `Average weekly pay over the last ${W12} paid weeks`],
  ], 'Employment Rights Act 1996, ss.221 to 224. The Northern Ireland Order 1996 has matching articles.', ['l', 'r', 'l'])}
<p>Section 223 adds three refinements for the averaging routes. Only hours actually worked and the pay for them are counted. A week with no pay is replaced by an earlier one, so the average always runs over ${W12} paid weeks. And where overtime is part of normal hours but was paid at a premium, the premium is stripped out and those hours are valued at the ordinary rate.</p>

<h2>The calculation date</h2>
<p>The ${W12} weeks end with the last complete week before a calculation date that depends on the right (${h.src('era226', 'section 226')}):</p>
<ul>
<li><strong>Pay during notice</strong> (sections 88 and 89): the day before the statutory notice period begins.</li>
<li><strong>Redundancy pay</strong>: the day on which statutory minimum notice would have been given if it had expired on the relevant date. For someone with ten years of service, that is ten weeks before the last day, so a pay rise in the final weeks may not be counted. When pay in lieu of notice pushes the relevant date later under section 145(5), section 226(5)(b) takes the real, unextended relevant date instead.</li>
<li><strong>Holiday pay</strong>: the first day of the leave in question (regulation 16(3)(c)).</li>
</ul>

<h2>Holiday pay: ${W52} weeks and a wider net</h2>
<p>Regulation 16 of the Working Time Regulations borrows sections 221 to 224 but changes three things for Great Britain. The reference period becomes ${W52} weeks, or the number of complete weeks worked if the worker has been there for less than a year, and unpaid weeks are skipped back to a limit of ${P.holiday.maxLookbackWeeks} weeks. The cap in section 227 does not apply. And for the first ${P.holiday.basicWeeks} weeks of leave, and all leave of irregular-hours and part-year workers, the week’s pay must include commission tied to the job, payments for seniority or professional qualifications, and overtime regularly paid in the previous ${W52} weeks (regulation 16(3ZA)); the rule that strips overtime premiums does not apply. The ${h.a('holiday-pay-overtime-commission', 'guide to overtime and commission in holiday pay')} goes through the details.</p>
<p>The same pay history can therefore give two different weeks’ pay. Take a care assistant on a 37.5-hour contract at ${h.gbp(13.2, 2)} an hour, so ${h.gbp(BASIC, 2)} basic, who earned ${h.gbp(EXTRAS_12)} of variable extras in a busy last ${W12} weeks and ${h.gbp(EXTRAS_52)} across the last ${W52}:</p>
${h.table(['Average', 'Used for', 'A week’s pay'], [
    [`${W12} weeks`, 'Notice pay guarantee, redundancy pay (if the extras count)', h.gbp(shortAvg, 2)],
    [`${W52} weeks`, 'Statutory holiday pay in Great Britain', h.gbp(longAvg, 2)],
    ['Difference', '', h.gbp(Math.abs(shortAvg - longAvg), 2)],
  ], 'Computed with the redundancy and holiday engines of this site.', ['l', 'l', 'r'])}
<p>A seasonal peak just before notice lifts the ${W12}-week figure; the ${W52}-week figure smooths it out. The opposite happens after a quiet spell.</p>

<h2>The cap and where it applies</h2>
<p>Section 227 caps a week’s pay at ${h.gbp(CAP_GB)} for a redundancy payment and for the basic and additional awards in unfair dismissal claims; article 23 of the Northern Ireland Order sets ${h.gbp(CAP_NI)}. Notice pay is not on that list, and regulation 16 switches the cap off for holiday pay. Someone earning ${h.gbp(HIGH)} a week has redundancy pay priced at ${h.gbp(CAP_GB)} a week, but notice and holiday priced at the full ${h.gbp(HIGH)}. The ${h.a('redundancy-pay-cap', 'redundancy pay cap')} page lists the caps by year.</p>

<h2>Not to be confused with average weekly earnings</h2>
<p>Statutory Maternity Pay, Paternity Pay and Sick Pay use a different measure, “average weekly earnings”, taken from pay received in a relevant period of about ${P.familyExtra.relevantPeriodWeeks} weeks under social security rules. It answers a different question (do you qualify, and what is ${h.pct(P.familyPay.earningsShare, 0)} or ${h.pct(P.ssp.earningsShare, 0)} of your pay) and can give a different figure from a week’s pay under the 1996 Act. See ${h.a('smp-average-weekly-earnings', 'average weekly earnings for SMP')}. For variable pay in a redundancy, ${h.a('redundancy-variable-pay', 'redundancy pay with variable pay')} applies the ${W12}-week rule step by step.</p>
`,
});
