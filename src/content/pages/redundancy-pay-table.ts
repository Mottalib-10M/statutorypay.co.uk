import { definePage } from '../../lib/guide-types';
import { CAP_GB, CAP_NI, MAX_REDUNDANCY_GB, P } from '../../lib/engine/params';
import { reckonerWeeks } from '../../lib/engine/redundancy';
import { formatMoney, formatNumber } from '../../lib/format';

const g = (n: number) => formatMoney(n);
const R = P.redundancy;
// Youngest age at which service can start in the grid: a cell is left blank when the years
// would have begun before the 16th birthday (the official ready reckoner does the same).
const START_AGE = 16;
const AGES = Array.from({ length: 64 - 18 + 1 }, (_, i) => 18 + i);
const cell = (age: number, years: number) => (age - years < START_AGE ? '' : formatNumber(reckonerWeeks(age, years), 1));
const grid = (from: number, to: number) => {
  const cols = Array.from({ length: to - from + 1 }, (_, i) => from + i);
  return { headers: ['Age', ...cols.map(String)], rows: AGES.map((a) => [String(a), ...cols.map((y) => cell(a, y))]), align: ['l', ...cols.map(() => 'r')] as Array<'l' | 'r'> };
};
const low = grid(2, 10);
const high = grid(11, 20);
// Reading examples, computed by the engine.
const exA = { age: 46, years: 12 };
const wA = reckonerWeeks(exA.age, exA.years);
const exB = { age: 23, years: 6 };
const wB = reckonerWeeks(exB.age, exB.years);
const payB = 430;

export default definePage({
  id: 'redundancy-pay-table',
  group: 'redundancy',
  order: 30,
  tool: 'reckoner',
  related: ['redundancy-pay-calculator', 'statutory-redundancy-pay', 'redundancy-pay-cap', 'redundancy-relevant-date', 'redundancy-variable-pay'],
  sources: ['govRedundancyCalc', 'era162', 'limitsOrder2026', 'nidRedundancy', 'acasRedundancyPay'],
  slug: 'redundancy-pay-table',
  nav: 'Redundancy pay table',
  card: 'The ready reckoner: weeks of pay for every age from 18 to 64 and 2 to 20 years.',
  title: `Redundancy Pay Table 2026/27: Ready Reckoner, Ages 18 to 64`,
  description: `Redundancy pay table for 2026/27: the statutory ready reckoner in weeks for ages 18 to 64 and 2 to 20 years, then times weekly pay capped at ${g(CAP_GB)} (${g(CAP_NI)} in NI).`,
  h1: 'Redundancy pay table: the statutory ready reckoner',
  intro: 'Find your age on the day your job ends and your complete years of service: the cell gives the number of weeks’ pay the law guarantees.',
  resume: `The redundancy pay table, often called the ready reckoner, turns two whole numbers into a number of weeks: your age on the relevant date and the complete years you have worked for the employer, from 2 to ${R.maxYears}. Each year of service is valued by the age you were during it, half a week below 22, one week from 22 to 40 and one and a half weeks from 41, and the table adds those values up for you. Multiply the cell by your gross weekly pay, capped at ${g(CAP_GB)} in Great Britain or ${g(CAP_NI)} in Northern Ireland for a relevant date from 6 April 2026, and you have the statutory minimum. A 46-year-old with 12 years’ service reads ${formatNumber(wA, 1)} weeks; a 23-year-old with 6 years reads ${formatNumber(wB, 1)}. No cell exceeds ${formatNumber(reckonerWeeks(61, 20), 0)} weeks, which is why the ceiling is ${g(MAX_REDUNDANCY_GB)}. Under two complete years the table is empty, because nothing is owed by law.`,
  faqs: [
    { q: 'Why is the ready reckoner blank for some young ages?', a: `A blank cell is a combination that cannot happen: the years of service would have started before the 16th birthday. A 19-year-old cannot have five complete years with one employer, for instance. The grid starts at 18 and runs to 64; anyone older reads the row for 64, since every counted year is then at the top rate.` },
    { q: 'Which age do I look up if my birthday falls during the notice period?', a: 'Your age on the relevant date, which is normally the last day of notice, or the end of the statutory notice when that falls later because you were paid in lieu. If the birthday lands between the day you were told and that date, use the older age. The full calculator dates every year so you can check.' },
    { q: 'Does the redundancy pay table work for Northern Ireland?', a: `Yes. The age bands and the 20-year limit in the Employment Rights (Northern Ireland) Order 1996 are the same as in Great Britain, so the weeks in each cell do not change. Only the multiplier differs: a week’s pay is capped at ${g(CAP_NI)} rather than ${g(CAP_GB)} for relevant dates from 6 April 2026.` },
    { q: 'Can the table be wrong for me even if I read the right cell?', a: 'Rarely, and then by half a week. The grid assumes you were one year younger when each year of service began than when it ended. If your birthday falls on the very first day of a service year, the day after the anniversary of your relevant date, you were already older; when that birthday is your 22nd or 41st, the year earns more than the cell shows.' },
  ],
  body: (h) => `
<h2>How to read the grid</h2>
<p>Pick the row for your age on the relevant date, then the column for your complete years of continuous service. Part years are ignored: eleven years and ten months reads as 11. Service beyond ${R.maxYears} years reads as ${R.maxYears}, since only the most recent ${R.maxYears} years are counted (${h.src('era162', 'section 162(3)')}). The figure in the cell is a number of weeks, not pounds.</p>
<p>Two readings as examples. At ${exA.age} with ${exA.years} years, the row gives ${h.num(wA, 1)} weeks: the last ${exA.age - 41} years were at 41 or over and earn one and a half weeks each, the earlier ones one week each. At ${exB.age} with ${exB.years} years and pay of ${h.gbp(payB)} a week, the cell reads ${h.num(wB, 1)} weeks, so the payment is ${h.gbp(wB * payB)}.</p>

<h2>Weeks of pay: 2 to 10 years of service</h2>
${h.table(low.headers, low.rows, 'Statutory weeks of pay by age on the relevant date (rows) and complete years of service (columns 2 to 10).', low.align)}

<h2>Weeks of pay: 11 to 20 years of service</h2>
${h.table(high.headers, high.rows, 'Statutory weeks of pay by age on the relevant date (rows) and complete years of service (columns 11 to 20). Years beyond 20 are not counted.', high.align)}

<h2>From weeks to pounds</h2>
<p>Multiply the weeks by a week’s pay before tax. For a fixed salary that is the contractual weekly amount; for pay that moves with hours or commission it is a 12-week average (${h.a('redundancy-variable-pay', 'variable pay explained')}). The multiplier cannot exceed ${h.gbp(CAP_GB)} in England, Wales and Scotland, or ${h.gbp(CAP_NI)} in Northern Ireland, when the relevant date is on or after 6 April 2026. Someone earning ${h.gbp(1100)} a week with ${h.num(wA, 1)} weeks therefore gets ${h.gbp(wA * CAP_GB)}, not ${h.gbp(wA * 1100)}. Earlier caps and the date that decides between them are on the ${h.a('redundancy-pay-cap', 'redundancy pay cap')} page.</p>

<h2>When the grid is not precise enough</h2>
<p>The grid is a shortcut built on whole ages. It assumes that when each year of service began you were one year younger than when it ended. That is true unless your birthday falls on the first day of a service year, which is the day after the anniversary of your relevant date. A year that began on your 22nd birthday then earns one week rather than half, and a year that began on your 41st earns one and a half rather than one. A payment in lieu of notice can also push the relevant date forward and add a year the grid would miss. For those cases enter your real dates in the ${h.a('redundancy-pay-calculator', 'redundancy pay calculator')}, which lists every year with your age on its first day; the ${h.a('redundancy-relevant-date', 'relevant date guide')} explains which day to count from.</p>
`,
});
