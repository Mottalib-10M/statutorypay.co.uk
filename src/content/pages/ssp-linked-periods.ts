import { definePage } from '../../lib/guide-types';
import { P } from '../../lib/engine/params';
import { computeSsp, linked } from '../../lib/engine/ssp';
import { addDays, diffDays } from '../../lib/engine/dates';
import { formatMoney, displayDate } from '../../lib/format';

const S = P.ssp;
const d = (iso: string) => displayDate(iso, 'en-GB');
// A worked chain of spells for a Monday-to-Friday employee earning £520 a week, computed by the engine.
const mf = [1, 2, 3, 4, 5];
const first = computeSsp({ awe: 520, pattern: mf, firstDay: '2026-05-04', lastDay: '2026-06-26' });
const secondStart = '2026-08-17';
const isLinked = linked('2026-06-26', secondStart);
const second = computeSsp({ awe: 520, pattern: mf, firstDay: secondStart, lastDay: '2026-12-18', alreadyPaidDays: isLinked ? first.paidDays : 0 });
const lastLinkDay = addDays('2026-06-26', S.linkGapWeeks * 7 + 1);

export default definePage({
  id: 'ssp-linked-periods',
  group: 'sickness',
  order: 40,
  mini: 'sspLinked',
  related: ['statutory-sick-pay', 'statutory-sick-pay-calculator', 'fit-note-rules', 'ssp-changes-april-2026'],
  sources: ['govEmployerSsp', 'govSsp', 'hmrcRates', 'smartAnswers'],
  slug: 'ssp-linked-periods',
  nav: 'Linked spells and the 28 weeks',
  card: 'When two spells of sickness count as one, and when SSP runs out.',
  title: `SSP Linked Periods 2026/27: the 8-Week Rule and ${S.maxWeeks} Weeks`,
  description: `SSP linked periods in 2026/27: spells ${S.linkGapWeeks} weeks or less apart count as one, sharing ${S.maxWeeks} weeks of sick pay, with a ${S.linkedSeriesMaxYears}-year limit and form SSP1 by week ${S.ssp1Week} of SSP.`,
  h1: 'Linked spells of sickness: when the 28 weeks run out',
  intro: 'Two absences close together are one period of sickness in law. How to count the gap, the weeks used and the date SSP stops.',
  resume: `Statutory Sick Pay is limited to ${S.maxWeeks} weeks in any one period of incapacity for work, and the law joins separate spells of sickness into a single period when they are ${S.linkGapWeeks} weeks (56 days) or less apart. Each spell has to last at least one full working day to count. Once linked, the spells share the same allowance: a second illness three weeks after returning to work continues the count rather than starting a new one. The allowance is counted in qualifying days, ${S.maxWeeks} times the days you normally work in a week, so a five-day employee has ${S.maxWeeks * 5} days and a three-day employee ${S.maxWeeks * 3}. A chain of linked spells cannot stretch beyond ${S.linkedSeriesMaxYears} years. When SSP is going to end while you are still ill, your employer must send form SSP1 at the latest at the start of week ${S.ssp1Week}, so that you can claim Universal Credit or Employment and Support Allowance in time.`,
  faqs: [
    { q: 'Do the 56 days between two spells include weekends?', a: 'Yes. The gap is counted in calendar days between the last day of the first spell and the first day of the second, weekends and bank holidays included. Fifty-six days or fewer and the spells link; fifty-seven and the second spell starts a fresh period with a full allowance.' },
    { q: 'Does holiday taken between two sick spells break the link?', a: 'No. The link depends only on the number of days between the spells, whatever you did in between. GOV.UK also notes, in its employer guide, that taking annual leave inside a period of sickness does not interrupt the period of incapacity for work.' },
    { q: 'What happens after 28 weeks if I am still too ill to work?', a: `SSP stops, but your job does not end automatically. Your employer gives you form SSP1, which supports a claim for Universal Credit or New Style Employment and Support Allowance. Any company sick pay continues only if your contract says so. A new period of SSP needs a gap of more than ${S.linkGapWeeks} weeks back at work.` },
    { q: 'Does the 28-week allowance reset every year?', a: `No. There is no calendar or tax-year reset. The allowance belongs to a period of incapacity for work, which can stretch across April or across New Year as long as each gap between spells stays within ${S.linkGapWeeks} weeks. It starts again only after a longer gap back at work, or when the three-year limit ends the chain.` },
  ],
  body: (h) => `
<h2>A worked chain of spells</h2>
<p>Take an employee working Monday to Friday and earning ${h.gbp(520)} a week. She is off from ${d('2026-05-04')} to ${d('2026-06-26')}: that spell pays ${first.paidDays} qualifying days, ${h.gbp(first.total, 2)}. She returns to work and falls ill again on ${d(secondStart)}. The gap is ${h.num(diffDays('2026-06-26', secondStart) - 1)} days, under the ${S.linkGapWeeks * 7}-day limit, so the second spell ${isLinked ? 'links to the first' : 'does not link'}. Her remaining allowance is ${S.maxWeeks * 5 - first.paidDays} days. If the second spell lasts until ${d('2026-12-18')}, SSP stops on ${second.exhaustedOn ? d(second.exhaustedOn) : 'no date in that range'}, after ${second.paidDays} more days paid, ${h.gbp(second.total, 2)}. Had she come back to work for one more week, any new spell starting after ${d(lastLinkDay)} would have opened a fresh allowance.</p>

<h2>Counting the allowance in days, not weeks</h2>
<p>The ${S.maxWeeks}-week limit is applied in qualifying days, because SSP itself is paid by the day. The ceiling is ${S.maxWeeks} times the number of days in your working pattern. That matters when the pattern changes, or for part-timers whose short weeks make each week of sickness use fewer days.</p>
${h.table(['Days worked a week', 'Allowance in qualifying days', 'SSP if paid at the flat rate'], [1, 2, 3, 4, 5, 6, 7].map((q) => [q, S.maxWeeks * q, h.gbp(S.maxWeeks * S.weeklyRate, 2)]), 'The amount is the same; only the count of days differs.', ['r', 'r', 'r'])}
<p>The GOV.UK calculator for employers uses the same method: the days already paid in a linked period are taken off the ceiling before the new spell is paid. The calculator on this site asks for that number directly.</p>

<h2>The three-year limit</h2>
<p>Linking can go on as long as the gaps stay short. To stop indefinite chains, a continuous series of linked periods cannot last more than ${S.linkedSeriesMaxYears} years. In practice it bites for long-term conditions with frequent short absences: once the series passes three years, SSP is no longer payable even if the ${S.maxWeeks} weeks have not all been used, and the employer issues form SSP1.</p>

<h2>What changed, and what did not, in April 2026</h2>
<p>Before 6 April 2026 the link mattered for a second reason: waiting days were served only once per linked period, so linking spells meant losing fewer unpaid days. That disappeared with the waiting days themselves. The ${S.linkGapWeeks}-week test, the ${S.maxWeeks}-week ceiling and the three-year limit are unchanged, in Great Britain and in Northern Ireland. ${h.a('ssp-changes-april-2026', 'The April 2026 reform')} covers the rest.</p>

<h2>Keeping your own count</h2>
<p>Employers keep sickness records, but mistakes in linking are common when absences are short and spread over months, especially across a change of payroll provider or manager. Keep a simple list: the first and last day of each spell, the days you would have worked inside it, and the SSP shown on each payslip. Two checks then settle most disputes. First, measure every gap in calendar days: a single day too many breaks the link and restores the full allowance. Second, add up the qualifying days paid since the start of the chain and compare them with ${S.maxWeeks} times your working days. A part-timer working Tuesday and Thursday has an allowance of ${S.maxWeeks * 2} days, which can last many months of intermittent illness, and an employer applying a five-day count by mistake would stop SSP far too early.</p>
<p>If you believe SSP was stopped too soon, ask your employer for the dates and the count they used. They must give their reasons, and HMRC’s Statutory Payment Disputes Team can decide if you still disagree.</p>

<h2>Form SSP1 and what comes next</h2>
<p>Your employer must send form SSP1 within seven days if SSP ends unexpectedly while you are still sick, or by the start of week ${S.ssp1Week} if they can see it will run out first. If they know from the outset that you will be off for more than ${S.maxWeeks} weeks, they can send it earlier, which lets you start a claim for Employment and Support Allowance before the money stops. Keep your fit notes: the benefit claim will ask for medical evidence covering the whole period. To see your own dates laid out week by week, use the ${h.a('statutory-sick-pay-calculator', 'Statutory Sick Pay calculator')} and enter the days already paid in the linked spell.</p>
`,
});
