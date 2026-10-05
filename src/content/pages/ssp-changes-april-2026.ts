import { definePage } from '../../lib/guide-types';
import { P } from '../../lib/engine/params';
import { pre2026Ssp, post2026Ssp } from '../../lib/engine/ssp';
import { formatMoney } from '../../lib/format';

const S = P.ssp;
const O = S.pre2026;
const g = (n: number, d = 2) => formatMoney(n, d);
// Worked comparisons, Monday-to-Friday pattern, computed by the engine.
const cases: Array<[string, number, number]> = [
  ['Office worker, 2 days of flu', 560, 2],
  ['Same worker, a full week off', 560, 5],
  ['Retail assistant on low hours, 4 days off', 110, 4],
  ['Warehouse operative, 3 weeks off', 480, 15],
];

export default definePage({
  id: 'ssp-changes-april-2026',
  group: 'sickness',
  order: 30,
  mini: 'sspBeforeAfter',
  related: ['statutory-sick-pay', 'statutory-sick-pay-calculator', 'ssp-linked-periods', 'company-sick-pay-vs-ssp', 'northern-ireland-employment-rights'],
  sources: ['era2025', 'ssp2026Commencement', 'hmrcRates', 'govEmployerSsp', 'nidSsp'],
  slug: 'ssp-changes-april',
  nav: 'SSP changes in April 2026',
  card: 'No waiting days, no earnings limit, an 80% cap: the reform case by case.',
  title: 'SSP Changes April 2026: Day-One Sick Pay and the 80% Rule',
  description: `SSP changes from 6 April 2026: no 3 waiting days, no £${O.lel} earnings limit, a rate of ${g(S.weeklyRate)} or 80% of pay, and transitional rules for spells running across.`,
  h1: 'Day-one sick pay: what changed in SSP, and for whom',
  intro: 'Three rules went and one arrived: the comparison on real absences, and what happens to a spell that started before the change.',
  resume: `On 6 April 2026 sections 10 to 13 of the Employment Rights Act 2025 came into force across the United Kingdom and rewrote Statutory Sick Pay. The three waiting days, during which nothing was paid, were abolished: SSP now starts on the first qualifying day of sickness. The lower earnings limit, ${g(O.lel, 0)} a week in 2025/26, no longer shuts anyone out, so employees on small hours are covered for the first time. In exchange, the weekly rate became the lower of ${g(S.weeklyRate)} and 80% of normal weekly earnings, which reduces the weekly amount for anyone earning less than about ${g(S.weeklyRate / S.earningsShare)}. The minimum length of a spell (four days in a row) disappeared with the waiting days. The 28-week limit, the eight-week link between spells, fit notes and form SSP1 did not change. Spells already running on 6 April are handled by the transitional rules of SI 2026/373.`,
  faqs: [
    { q: 'Does anyone get less SSP since the April 2026 reform?', a: `Over a long absence, yes, for a narrow band of earnings. Someone paid between ${g(O.lel, 0)} and about ${g(S.weeklyRate / S.earningsShare)} a week qualified under the old rules for the full flat rate after three waiting days; now each week is capped at 80% of earnings. The transitional rules protected those already being paid on 5 April at the flat rate.` },
    { q: 'I was off sick from 2 April to 10 April 2026. What was I paid?', a: 'Your waiting days before 6 April were not paid, but the transitional regulation 3 of SI 2026/373 makes the qualifying days from 6 April payable even if, under the old rules, they would still have been waiting days. The rate from 6 April is the new one. Ask your employer for the day-by-day working if in doubt.' },
    { q: 'Was there a waiting-day rule in Northern Ireland too?', a: 'Yes, and it went at the same time. Sections 12 and 13 of the Employment Rights Act 2025 make the same changes to the Northern Ireland Contributions and Benefits Act, also from 6 April 2026, and the Northern Ireland up-rating order sets the same weekly rate.' },
    { q: 'Can my employer still refuse SSP for the first three days if the company policy says so?', a: 'No. A contract or policy cannot pay less than the statutory minimum, and the statutory minimum now includes the first qualifying days. A company scheme that used to start on day four has to pay SSP from day one, even if its own enhanced pay still starts later.' },
  ],
  body: (h) => `
<h2>Before and after, on four real absences</h2>
<p>The table applies both sets of rules to the same absences, for a Monday-to-Friday employee, using the 2025/26 flat rate of ${h.gbp(O.weeklyRate, 2)} for the old scheme and the 2026/27 rate for the new. Amounts are gross.</p>
${h.table(['Absence', 'Weekly earnings', 'Days off', 'Old rules', 'New rules'], cases.map(([label, awe, days]) => [label, h.gbp(awe), days, h.gbp(pre2026Ssp(awe, 5, days).amount, 2), h.gbp(post2026Ssp(awe, 5, days).amount, 2)]), 'Old rules: 3 waiting days, at least 4 days in a row, nothing below the lower earnings limit.', ['l', 'r', 'r', 'r', 'r'])}
<p>The pattern is clear. Short absences, which used to be entirely unpaid, now pay from the first day; the shorter the spell, the bigger the relative gain. Low earners move from nothing to 80% of their pay. Over weeks of sickness for someone above the threshold, the only difference is the three days once lost at the start and the new flat rate.</p>

<h2>Waiting days: gone, with their arithmetic</h2>
<p>Under the old scheme a period of incapacity for work had to last at least four consecutive days, weekends included, and the first three qualifying days were waiting days. Linked spells did not repeat them: once served, they were not served again within the same linked period. All of that disappears for spells starting on or after 6 April 2026, which is why employers no longer need to track waiting days at all. A one-day migraine on a Tuesday is now worth a day of SSP.</p>

<h2>The earnings limit and the new 80% cap</h2>
<p>Until 5 April 2026 an employee whose average weekly earnings were below the lower earnings limit received no SSP, however long the illness. Section 11 of the 2025 Act removed that condition and replaced the fixed rate with “the lower of” two amounts. The point where they meet is ${h.gbp(S.weeklyRate / S.earningsShare, 2)} a week: earn more and you get ${h.gbp(S.weeklyRate, 2)}; earn less and you get four fifths of your pay. The cap is applied to the weekly rate before it is divided into a daily rate, so the rounding rules of HMRC’s tables still apply.</p>

<h2>Spells running across 6 April</h2>
<p>${h.src('ssp2026Commencement', 'The Commencement No. 3 and Transitional Provisions Regulations 2026')} deal with three situations. Regulation 3 covers someone who had served one or two waiting days by 5 April: qualifying days from 6 April are paid, even though they would have been waiting days. Regulation 4 protects employees earning between ${h.gbp(O.lel, 0)} and ${h.gbp(S.transitionalProtectionUpper, 2)} who were already receiving SSP: for the rest of that period of entitlement they keep the flat ${h.gbp(S.weeklyRate, 2)}, without the 80% cap. Regulation 5 (Great Britain) and regulation 6 (Northern Ireland) give low earners who were sick on 5 April and still sick afterwards a period of entitlement starting on their first day of sickness on or after 6 April, unless they had been off continuously since ${h.date(S.transitionalLongSpellSince)} or earlier.</p>
<p>The calculator on this site does not price those cross-over spells, because the outcome depends on which regulation applies and on days already served. Your payslips or your employer’s payroll records will show it.</p>

<h2>What stayed the same</h2>
<ul>
<li>The maximum of ${S.maxWeeks} weeks of SSP in a period of incapacity, and the link between spells ${S.linkGapWeeks} weeks or less apart (${h.a('ssp-linked-periods', 'linked spells')}).</li>
<li>Self-certification for seven days, then a fit note (${h.a('fit-note-rules', 'fit notes')}).</li>
<li>Form SSP1 when SSP is refused or about to end.</li>
<li>The exclusions for people on Statutory Maternity Pay or Maternity Allowance, in custody, or on strike on the first day.</li>
<li>Tax and National Insurance on SSP, and the fact that employers cannot recover it from HMRC, unlike family pay.</li>
</ul>
<p>Employers had to update their sickness policies: any clause that relied on waiting days or on the earnings limit to pay nothing is now below the statutory floor. The ${h.a('statutory-sick-pay-calculator', 'sick pay calculator')} applies the new rules to any spell from 6 April 2026.</p>
`,
});
