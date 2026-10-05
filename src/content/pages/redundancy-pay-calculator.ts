import { definePage } from '../../lib/guide-types';
import { CAP_GB, CAP_NI, MAX_REDUNDANCY_GB, MAX_REDUNDANCY_NI, P } from '../../lib/engine/params';
import { computeRedundancy } from '../../lib/engine/redundancy';
import { formatMoney } from '../../lib/format';

const g = (n: number) => formatMoney(n);
// Worked example computed by the engine, never typed (RECETTE §17.4 point 7).
const ex = computeRedundancy({ dob: '1979-05-14', start: '2011-09-05', noticeGiven: '2026-10-01', end: '2026-12-24', weeklyPay: 640 });

export default definePage({
  id: 'redundancy-pay-calculator',
  group: 'redundancy',
  order: 10,
  tool: 'redundancy',
  related: ['redundancy-pay-table', 'redundancy-relevant-date', 'redundancy-pay-cap', 'final-pay-calculator', 'redundancy-pay-tax', 'notice-period-calculator'],
  sources: ['era162', 'era145', 'limitsOrder2026', 'limitsOrderNI2026', 'govRedundancyCalc', 'acasRedundancyPay'],
  slug: 'redundancy-pay-calculator',
  nav: 'Redundancy pay calculator',
  card: 'Statutory redundancy pay from your real dates, with the cap of your relevant date.',
  title: `Redundancy Pay Calculator 2026/27: Cap ${g(CAP_GB)}, GB and NI`,
  description: `Redundancy pay calculator for 2026/27: enter your dates, get statutory pay with the ${g(CAP_GB)} cap (${g(CAP_NI)} in NI), the section 145(5) date and each year counted.`,
  h1: 'Redundancy pay calculator, from your real dates',
  intro: 'Enter four dates and your weekly pay: the calculator finds the relevant date, counts each year of service at the right age and applies the cap in force on that day.',
  resume: `Statutory redundancy pay is a number of weeks’ pay fixed by your age and your complete years of service on the relevant date: half a week for each year under 22, one week for each year from 22 to 40, one and a half weeks for each year at 41 or over, with only the last 20 years counted. A week’s pay is capped at ${g(CAP_GB)} in Great Britain and ${g(CAP_NI)} in Northern Ireland when the relevant date falls on or after 6 April 2026, which puts the maximum at ${g(MAX_REDUNDANCY_GB)} and ${g(MAX_REDUNDANCY_NI)}. You need two complete years of continuous employment. The relevant date is the day your notice ends; if your employer pays you in lieu or gives less than the statutory notice, the date used for your service and age moves to the end of the statutory notice. That is why this calculator asks for the day notice was given as well as your last day.`,
  faqs: [
    { q: 'Why does the calculator ask for the day notice was given as well as my last day?', a: `Because the law uses both. Your last day fixes the cap, while the end of the statutory notice that should have been given from the notice date fixes your service and age when it falls later (Employment Rights Act 1996, s.145(5)). With a payment in lieu, that extension can add up to ${P.notice.maxWeeks} weeks of service.` },
    { q: 'What weekly pay should I enter if my hours or overtime vary?', a: `The average of the 12 complete weeks before the calculation date, which is the date notice would have been given for statutory notice ending on your relevant date. Include regular overtime that your contract requires, commission and shift premiums. If you were paid less while on furlough, use your normal pay. Above ${g(CAP_GB)} the figure no longer matters in Great Britain.` },
    { q: 'Does a year of service count if I turned 41 halfway through it?', a: 'No. A year earns one and a half weeks only if you were 41 or over for all of it. The calculator dates each year of service, from the relevant date backwards, and shows your age on its first day. The year in which you turned 41 earns one week; the following one earns one and a half.' },
    { q: 'I worked 22 years. Why are only 20 counted?', a: `Section 162(3) stops the count at the 20 most recent years. The earliest years drop out first, which is usually good news: they tend to be the years when you were youngest and earned the lowest multiplier. At 41 or over for all 20 years you reach the ceiling of 30 weeks, ${g(MAX_REDUNDANCY_GB)} in Great Britain.` },
    { q: 'How long do I have to claim if my employer does not pay?', a: 'Six months from the relevant date to put a written claim to your employer or bring a tribunal claim; the calculator gives the last day. If the employer is insolvent, the Redundancy Payments Service pays statutory redundancy pay from the National Insurance Fund.' },
  ],
  body: (h) => `
<h2>Reading the result</h2>
<p>The large figure is your statutory redundancy pay before any enhancement in your contract. Under it, the bars split the weeks between the three age bands, so you can see how much of the payment comes from years at 41 or over. The line “weekly cap in force” names the cap that applied on your real last day, ${h.gbp(CAP_GB)} for a last day from 6 April 2026 in Great Britain, ${h.gbp(P.redundancy.weeklyCapGB[P.redundancy.weeklyCapGB.length - 2].cap)} for a last day in the 2025/26 year. The year-by-year table lists every counted year with its dates and your age on its first day: it is the check to make against your employer’s statement, which section 165 requires them to give you in writing.</p>
<p>With the example already filled in (born 14 May 1979, started 5 September 2011, notice given on 1 October 2026, last day 24 December 2026, ${h.gbp(640)} a week), the calculator counts ${ex.countedYears} years and ${h.num(ex.weeks, 1)} weeks, which comes to ${h.gbp(ex.amount)}. Change the last day to 1 October, as if the notice had been paid in lieu, and the service is still counted to the end of the ${ex.statutoryNoticeWeeks} weeks of statutory notice.</p>
<h2>What the calculator assumes</h2>
<p>It applies the statutory scheme to an employee with continuous employment from the start date you give. Breaks that do not count, transfers of undertaking and periods abroad can change that start date: use the date your employer uses for continuous service, often printed on the written statement of particulars. It does not add contractual or enhanced redundancy pay; enter that separately in the ${h.a('final-pay-calculator', 'final pay calculator')}, which also adds notice and holiday pay. To see the whole age × service grid at once, open ${h.a('redundancy-pay-table', 'the redundancy pay table')}.</p>
`,
});
