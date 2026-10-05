import { definePage } from '../../lib/guide-types';
import { P } from '../../lib/engine/params';
import { weeklySsp, sspForDays } from '../../lib/engine/ssp';
import { formatMoney } from '../../lib/format';

const S = P.ssp;
const g = (n: number, d = 2) => formatMoney(n, d);
const threshold = S.weeklyRate / S.earningsShare;

export default definePage({
  id: 'statutory-sick-pay',
  group: 'sickness',
  order: 20,
  mini: 'sspQuick',
  related: ['statutory-sick-pay-calculator', 'ssp-changes-april-2026', 'fit-note-rules', 'ssp-part-time-multiple-jobs', 'holiday-during-sick-leave'],
  sources: ['govSsp', 'govEmployerSsp', 'hmrcRates', 'upratingOrder2026', 'acasSsp'],
  slug: 'statutory-sick-pay',
  nav: 'Statutory Sick Pay',
  card: 'Who gets SSP in 2026/27, how much, for how long and who pays it.',
  title: `Statutory Sick Pay 2026/27: ${g(S.weeklyRate)} a Week or 80% of Pay`,
  description: `Statutory Sick Pay in 2026/27: ${g(S.weeklyRate)} a week or 80% of earnings if lower, from the first day off, up to ${S.maxWeeks} weeks, for UK employees and agency workers.`,
  h1: 'Statutory Sick Pay: who gets it and how much',
  intro: 'The weekly rate, the 80% cap for lower earners, the 28-week limit and the cases where SSP is not owed.',
  resume: `Statutory Sick Pay (SSP) is the minimum an employer must pay an employee who is too ill to work. For 2026/27 it is ${g(S.weeklyRate)} a week, or 80% of the employee’s normal weekly earnings when that is lower, which is the case for anyone earning under ${g(threshold)} a week. Since 6 April 2026 it is paid from the first day of sickness on which you would have worked and there is no longer a minimum level of earnings, so part-timers on small hours qualify. It is paid for up to ${S.maxWeeks} weeks by the employer, through payroll, with income tax and National Insurance deducted, and it is owed by each employer separately if you have several jobs. Your contract can promise company sick pay on top; it can never pay less than SSP. The rules and the rate are the same in Great Britain and Northern Ireland.`,
  faqs: [
    { q: 'How much SSP do I get for a single day off?', a: `The weekly rate divided by the number of days you normally work. On a five-day week at the flat rate that is ${g(sspForDays(1000, 5, 1))} for one day; on a three-day week, ${g(sspForDays(1000, 3, 1))}. If your earnings are low, the weekly rate is 80% of them and the daily figure shrinks in proportion.` },
    { q: 'Can I get SSP if I am on a zero-hours contract?', a: 'Yes, if you are an employee or agency worker on the payroll and have done some work under the contract. Since April 2026 there is no earnings threshold to meet, but SSP is only due for days you would have worked, which is harder to show without a set pattern; your employer averages your recent working days.' },
    { q: 'Is SSP paid on top of my wages for a day I went home early?', a: 'No. A day counts for SSP only if you did no work at all. If you worked even a short time before going home ill, that day is a working day paid under your contract, and SSP can start on the next qualifying day you are off.' },
    { q: 'Does SSP stop if I am dismissed while off sick?', a: 'Your employer cannot dismiss you to avoid paying SSP. If your employment ends for another reason, SSP stops on the last day of the contract and your employer gives you form SSP1 so that you can claim Universal Credit or Employment and Support Allowance.' },
    { q: 'Who checks that my employer pays SSP correctly?', a: 'HMRC. Ask your employer first for a written explanation of the decision or the amount. If that does not settle it, the HMRC Statutory Payment Disputes Team can make a formal decision, and it also pays SSP when an insolvent employer cannot.' },
  ],
  body: (h) => `
<h2>The rate in 2026/27</h2>
<p>The weekly rate was raised to ${h.gbp(S.weeklyRate, 2)} on 6 April 2026 by the ${h.src('upratingOrder2026', 'Social Security Benefits Up-rating Order 2026')}; it was ${h.gbp(S.pre2026.weeklyRate, 2)} in 2025/26. The same day, the Employment Rights Act 2025 added a second ceiling: 80% of normal weekly earnings. The lower of the two is paid. The table shows what that gives at different levels of pay, for a full week of sickness:</p>
${h.table(['Normal weekly earnings', 'Weekly SSP', 'Rule that applies'], [80, 120, 150, 154, 200, 400, 800].map((e) => [h.gbp(e), h.gbp(weeklySsp(e), 2), weeklySsp(e) < S.weeklyRate ? '80% of earnings' : 'flat rate']), 'Weekly SSP from 6 April 2026, before tax.', ['r', 'r', 'l'])}
<p>Normal weekly earnings are usually the average of the eight weeks before the sickness, counted from paydays: weekly pay divided by eight, or monthly pay multiplied by twelve and divided by fifty-two. Pay that counts for National Insurance counts here, overtime and commission included.</p>

<h2>Who qualifies</h2>
<p>You must be an employee, or an agency worker, who has done some work under the contract and is ill for at least one full working day. There is no qualifying period of service, and since April 2026 no earnings test. SSP is not paid to the self-employed, and it is not paid to someone who is receiving Statutory Maternity Pay or Maternity Allowance; the four weeks before the expected week of childbirth also fall outside SSP when the absence is pregnancy-related, because maternity leave and pay start automatically. A person in custody or on strike on the first day of sickness does not qualify for that spell. If you are not eligible, the employer must give you form SSP1 within seven days of your first day off.</p>

<h2>How long it lasts</h2>
<p>SSP is paid for up to ${S.maxWeeks} weeks in a period of sickness. Two spells separated by ${S.linkGapWeeks} weeks or less count as one period, so a second illness soon after the first draws on what is left of the same ${S.maxWeeks} weeks; and a chain of linked spells cannot run for more than ${S.linkedSeriesMaxYears} years. When SSP is about to run out, the employer sends form SSP1 by the start of week ${S.ssp1Week} at the latest, so that you can apply for Universal Credit or New Style Employment and Support Allowance before the money stops. ${h.a('ssp-linked-periods', 'Linked spells of sickness')} gives worked examples.</p>

<h2>Telling your employer and proving it</h2>
<p>Report sickness by the deadline your employer sets, or within seven days if there is none. They cannot insist that you report in person or on a special form, but they can refuse SSP for the days you were late without a good reason. For the first seven calendar days you sign your own statement; after that, your employer can ask for a fit note from a GP, hospital doctor, nurse, pharmacist, physiotherapist or occupational therapist. ${h.a('fit-note-rules', 'The fit note rules')} cover the “may be fit for work” box and what happens when you disagree with your employer.</p>

<h2>SSP alongside other money</h2>
<p>If your contract has a company sick pay scheme, SSP is the floor under it: the employer can pay more, never less, and usually counts SSP as part of what it pays (${h.a('company-sick-pay-vs-ssp', 'company sick pay against SSP')}). If you have two jobs, each employer looks at its own earnings and pays its own SSP, and you can be sick for one job while fit for the other (${h.a('ssp-part-time-multiple-jobs', 'SSP with several jobs')}). Holiday keeps building up while you are off sick, and you can ask to take paid holiday instead of SSP, but your employer cannot force you to. For your own dates and days, use ${h.a('statutory-sick-pay-calculator', 'the Statutory Sick Pay calculator')}.</p>
`,
});
