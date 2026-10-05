import { definePage } from '../../lib/guide-types';
import { P } from '../../lib/engine/params';
import { entitlementDays } from '../../lib/engine/holiday';
import { addDays, addMonths } from '../../lib/engine/dates';
import { displayDate, formatNumber } from '../../lib/format';

const H = P.holiday;
const X = P.holidayExtra;
const d = (iso: string) => displayDate(iso, 'en-GB');
const n1 = (x: number) => formatNumber(x, 1);
const full = entitlementDays(5);
const fourWeeks = H.basicWeeks * 5;
const extra = full - fourWeeks;
// Part-timer on three days: the 1.6 weeks and the 4 weeks in days.
const ptFull = entitlementDays(3);
const ptFour = H.basicWeeks * 3;
// Sick-leave deadline for a calendar leave year 2026: 18 months from 31 December 2026.
const sickYearEnd = '2026-12-31';
const sickDeadline = addDays(addMonths(addDays(sickYearEnd, 1), X.sickCarryOverMonths), -1);

export default definePage({
  id: 'carry-over-holiday',
  group: 'holiday',
  order: 80,
  mini: 'carryOverHoliday',
  related: ['holiday-entitlement-calculator', 'holiday-during-sick-leave', 'holiday-on-maternity-leave', 'holiday-pay-when-leaving', 'rolled-up-holiday-pay', 'booking-holiday-notice'],
  sources: ['wtr13', 'wtr13A', 'hol_wtr15D', 'govHoliday', 'wtr14', 'hol_nidTakingHolidays'],
  slug: 'carry-over-holiday',
  nav: 'Carrying over holiday',
  card: 'When untaken leave moves into next year: by agreement, after sickness or family leave, or when the employer failed you.',
  title: `Carry Over Holiday 2026/27: ${H.carryOverMaxDays} Days, Sick Leave, ${X.sickCarryOverMonths} Months`,
  description: `Carry over holiday in 2026/27: up to ${H.carryOverMaxDays} days by agreement, ${H.sickCarryOverRegularDays} days after sickness to use within ${X.sickCarryOverMonths} months, and all of it if your employer gave you no chance.`,
  h1: 'Carrying over holiday into the next leave year',
  intro: 'Statutory leave is meant to be taken in the year it is earned. The law lists the situations where it is not lost, and they cover more people than most employers admit.',
  resume: `Statutory leave must normally be taken in the leave year it belongs to, and it cannot be swapped for money while you stay in the job. Several exceptions apply in Great Britain. The extra ${n1(H.additionalWeeks)} weeks, ${H.carryOverMaxDays} of a full-timer’s ${full} days, can be carried into the next leave year if the contract or another relevant agreement allows it. Leave you could not take because you were off sick is carried over up to the basic ${H.basicWeeks} weeks, ${H.sickCarryOverRegularDays} days for a five-day week, and must be used within ${X.sickCarryOverMonths} months of the end of the leave year in which it arose; for irregular-hours and part-year workers GOV.UK says up to ${H.sickCarryOverIrregularDays} days. Leave missed because of maternity, paternity, adoption or other statutory leave carries over in full. And if your employer did not give you a reasonable opportunity to take your leave, did not encourage you to, or did not warn you that it would be lost, all of it carries over. Northern Ireland is stricter: nidirect says only leave above four weeks can be carried, and only with the employer’s agreement.`,
  faqs: [
    { q: 'Can I carry over holiday I could not take because I was off sick?', a: `Yes, up to ${H.basicWeeks} weeks of it in Great Britain, which is ${H.sickCarryOverRegularDays} days for someone working five days a week (regulation 13(15)). The days must be used within ${X.sickCarryOverMonths} months of the end of the leave year in which they were earned. The extra ${n1(H.additionalWeeks)} weeks are not protected after sickness unless your contract says so.` },
    { q: 'My manager kept refusing my holiday requests. Do I lose the days?', a: 'Not if the refusals left you without a reasonable opportunity to take your leave. Regulation 13(16) and (17) let you carry forward all of the untaken statutory leave when the employer fails to give a reasonable opportunity, fails to encourage you to take it, or fails to tell you that it will be lost. Keep the refused requests in writing.' },
    { q: 'How long do I have to use carried-over sick leave?', a: `${X.sickCarryOverMonths} months from the end of the leave year in which the leave arose, under regulation 13(15) for regular-hours workers and regulation 15D(4) for irregular-hours and part-year workers. With a calendar leave year, leave from 2026 carried over because of sickness must be taken by ${d(sickDeadline)}. Days still unused after that are lost.` },
    { q: 'Does holiday I missed during maternity leave carry over?', a: `Yes, in full. Regulation 13(14) and regulation 13A(7A) carry forward any statutory leave you could not take because you were on statutory leave, meaning the family leave in Parts 8 and 8B of the Employment Rights Act 1996, such as maternity, paternity, adoption, shared parental and unpaid parental leave. Unlike sick-leave carry-over, the regulations set no ${X.sickCarryOverMonths}-month limit; the leave moves into the following leave year.` },
    { q: 'Can my employer pay me for holiday instead of letting me carry it over?', a: 'Not for statutory leave while you are still employed. Regulations 13(9)(b) and 13A(6) forbid replacing statutory leave with a payment in lieu except when employment ends. Days above the statutory minimum are contractual, so an employer can offer to buy those back if the contract or a separate agreement allows it.' },
  ],
  body: (h) => `
<h2>The starting point: use it in the year</h2>
<p>Leave under ${h.src('wtr13', 'regulation 13')}, the basic ${H.basicWeeks} weeks, may only be taken in the leave year in which it is due, unless one of the exceptions in paragraphs (14), (15) and (17) applies, and it cannot be replaced by money except on termination (regulation 13(9)). The additional ${h.num(H.additionalWeeks, 1)} weeks under ${h.src('wtr13A', 'regulation 13A')} are more flexible: paragraph (7) lets a relevant agreement, usually the contract, a collective agreement or a workforce agreement, carry them into the leave year immediately following. That is where GOV.UK’s figure comes from: a worker on ${full} days can carry over a maximum of ${H.carryOverMaxDays} if the contract allows it.</p>
${h.table(['Situation', 'Five-day week', 'Three-day week', 'Rule'], [
    ['Contract allows carry-over', `up to ${h.num(extra, 1)} days`, `up to ${h.num(ptFull - ptFour, 1)} days`, 'reg 13A(7)'],
    ['Off sick, could not take leave', `up to ${h.num(fourWeeks, 1)} days`, `up to ${h.num(ptFour, 1)} days`, 'reg 13(15)'],
    ['On maternity or other statutory leave', `up to ${h.num(full, 1)} days`, `up to ${h.num(ptFull, 1)} days`, 'regs 13(14), 13A(7A)'],
    ['Employer failed to give a real chance or warn', `up to ${h.num(full, 1)} days`, `up to ${h.num(ptFull, 1)} days`, 'reg 13(16) and (17)'],
  ], 'Regular-hours workers in Great Britain; days calculated from the statutory weeks by the site engine.', ['l', 'r', 'r', 'l'])}
<p>Contractual leave above ${H.maxDays} days is a separate matter. GOV.UK says an employer may allow it to be carried over, and the employment contract, handbook or intranet sets the rule.</p>

<h2>After sickness</h2>
<p>A worker who could not take leave because of sick leave keeps it, but only the basic ${H.basicWeeks} weeks under regulation 13 and only for a limited time: it must be taken by the end of the ${X.sickCarryOverMonths}-month period that starts when the leave year ends (regulation 13(15)). With a leave year ending on ${h.date(sickYearEnd)}, the deadline is ${h.date(sickDeadline)}. For irregular-hours and part-year workers, ${h.src('hol_wtr15D', 'regulation 15D(4)')} applies the same ${X.sickCarryOverMonths}-month limit to leave accrued under regulation 15B, and GOV.UK puts the ceiling at ${H.sickCarryOverIrregularDays} days. You do not have to have been off for the whole year; the test is whether the sick leave is the reason the holiday could not be taken. GOV.UK also notes that a worker can request holiday during sick leave, and that an employer cannot force a sick worker to take leave.</p>

<h2>After family leave</h2>
<p>Statutory leave such as maternity, paternity, adoption and shared parental leave keeps holiday accruing, and anything you could not take because of it carries over in full, under regulation 13(14) for the ${H.basicWeeks} weeks and regulation 13A(7A) for the additional ${h.num(H.additionalWeeks, 1)} weeks. A mother whose maternity leave covers the last eight months of the leave year can therefore return with most of a year’s statutory holiday still to take.</p>

<h2>When the employer is at fault</h2>
<p>Since ${h.date(X.reformsInForce)} the regulations have spelt out what was previously case law. Regulation 13(16) lists three failures: not recognising the right to leave or to holiday pay, not giving a reasonable opportunity to take leave or not encouraging the worker to take it, and not telling the worker that leave not taken by the end of the year, and which cannot be carried forward, will be lost. Any one of them lets the worker carry forward all untaken statutory leave, and also leave that was taken but not paid properly (regulation 13(17)). That leave does not run forever: under regulation 13(18) it lapses at the end of the first full leave year in which none of the failures applies. For irregular-hours and part-year workers the same rule sits in regulation 15D(5) to (7), and GOV.UK adds that unpaid ${h.a('rolled-up-holiday-pay', 'rolled-up holiday pay')} triggers it.</p>
<p>So the “use it or lose it” clause in many handbooks works only if the employer has done its part: offered real chances to book leave, encouraged staff to use it and warned them in good time. A reminder email in November, sent to everyone, is the kind of evidence an employer will point to; a refused request with no alternative offered is the kind a worker will.</p>

<h2>Leaving with carried-over days</h2>
<p>Leave carried into the current year under any of these statutory routes is paid when you leave, at the holiday pay rate, as ${h.src('wtr14', 'regulation 14(6)')} requires. Days carried under a contractual agreement follow the contract. The ${h.a('holiday-pay-when-leaving', 'leaving holiday calculator')} handles the current year; add carried days to its result.</p>

<h2>Northern Ireland</h2>
<p>The 2024 carry-over rules for statutory leave, sick leave and employer failures were made by SI 2023/1426 and do not extend to Northern Ireland. nidirect tells workers there that in the majority of cases there is no right to carry leave over, that at least ${H.basicWeeks} weeks must be taken in the year, and that only holiday above this can be carried, with the employer’s permission or under the contract. It also says a worker unable to take holiday because of illness may be entitled to carry it forward, without giving a time limit (${h.src('hol_nidTakingHolidays', 'nidirect, Taking your holidays')}).</p>
`,
});
