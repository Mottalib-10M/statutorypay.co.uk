import { definePage } from '../../lib/guide-types';
import { P } from '../../lib/engine/params';
import { irregularAccrual } from '../../lib/engine/holiday';
import { formatPercent } from '../../lib/format';
const rate = formatPercent(P.holiday.irregularAccrualRate, 2);

const H = P.holiday;
// Term-time contracts: weeks worked × weekly hours, weekly pay periods, accrual by the engine.
const contracts: Array<[string, number, number]> = [
  ['Teaching assistant, 39 weeks × 32.5 hours', 39, 32.5],
  ['School cook, 38 weeks × 25 hours', 38, 25],
  ['Exam invigilator, 12 weeks × 20 hours', 12, 20],
  ['Summer festival crew, 10 weeks × 45 hours', 10, 45],
];
const year = (weeks: number, hours: number) => irregularAccrual(hours).credited * weeks;

export default definePage({
  id: 'term-time-part-year-holiday',
  group: 'holiday',
  order: 130,
  mini: 'partYearHoliday',
  related: ['irregular-hours-holiday-calculator', 'rolled-up-holiday-pay', 'zero-hours-holiday-pay', 'holiday-entitlement-calculator', 'northern-ireland-employment-rights'],
  sources: ['wtr15B', 'govHoliday', 'si2023_1426', 'nidHoliday'],
  slug: 'term-time-part-year-holiday',
  nav: 'Term-time and part-year holiday',
  card: 'Holiday for school-year and seasonal contracts under the 12.07% rule.',
  title: `Term-Time Holiday Entitlement 2026: Part-Year Rule, ${rate}`,
  description: `Term-time and part-year holiday entitlement in 2026: leave accrues at ${rate} of hours worked in Great Britain, at most ${H.maxDays} days, rolled-up pay allowed.`,
  h1: 'Holiday for term-time and other part-year workers',
  intro: 'School-year contracts, seasonal work and anyone with unpaid weeks off: how leave is now built up, paid and taken.',
  resume: `A part-year worker is someone whose contract requires work for only part of the year, with periods of at least a week in which they are neither required to work nor paid: term-time school staff, seasonal workers, some sports and events contracts. In Great Britain, for leave years starting on or after 1 April 2024, regulation 15B of the Working Time Regulations makes their holiday accrue at ${rate} of the hours actually worked in each pay period, a fraction of an hour being rounded to the nearest hour, up to a maximum of ${H.maxDays} days in a leave year. The rule replaced the older position under which a part-year worker could claim the full 5.6 weeks whatever the number of weeks worked. Their employer may also choose rolled-up holiday pay, an extra ${rate} on each payslip. All their leave is paid at the normal rate, overtime and commission included. In Northern Ireland the 2024 reform does not apply and the 5.6-week rule continues.`,
  faqs: [
    { q: 'Do school holidays count as my annual leave on a term-time contract?', a: 'Usually, yes. An employer can set when statutory leave is taken, and most term-time contracts require it during the school holidays, when you are not needed. Many contracts say so expressly. The accrued hours are then paid as holiday pay in those weeks, unless your employer uses rolled-up holiday pay.' },
    { q: 'Does a week of sickness during term stop my holiday building up?', a: 'No. For part-year workers on sick or statutory leave, regulation 15C credits holiday for each week off based on the average hours worked in the 52 weeks before. You keep accruing as if you had worked your usual hours, and leave lost to sickness can be carried over.' },
    { q: 'I work 39 weeks a year but my salary is paid in 12 equal instalments. Am I still a part-year worker?', a: 'Not necessarily. The definition needs periods of at least a week in which you are not required to work and not paid. If your annual salary is spread over twelve months so that every week is paid, the contract may not fit the definition; the terms decide, and Acas can help read them.' },
  ],
  body: (h) => `
<h2>Who is a part-year worker</h2>
<p>Regulation 15F(1)(b) gives the test: under the contract you are required to work only part of the year, and within it there are periods of at least a week that you are not required to work and for which you are not paid. Sick leave and statutory leave are ignored when deciding. A worker whose paid hours vary wholly or mostly is an irregular-hours worker instead, under regulation 15F(1)(a); the accrual method is the same for both. If a contract does not meet either test, the ordinary 5.6-week rules apply, pro rata for part-time hours.</p>

<h2>What the ${h.pct(H.irregularAccrualRate, 2)} produces over a year</h2>
<p>The percentage was chosen because 5.6 weeks is ${h.pct(H.irregularAccrualRate, 2)} of the 46.4 weeks a full-year worker works. Applied to the hours of a part-year contract, it gives leave in proportion to the work actually done. The table assumes weekly pay periods, each week rounded separately.</p>
${h.table(['Contract', 'Weeks worked', 'Hours a week', 'Holiday hours in the year', 'In working weeks'], contracts.map(([label, weeks, hours]) => [label, weeks, h.num(hours, 1), h.num(year(weeks, hours)), h.num(year(weeks, hours) / hours, 1)]), `Accrual at ${h.pct(H.irregularAccrualRate, 2)} of hours worked each week, rounded to the nearest hour.`, ['l', 'r', 'r', 'r', 'r'])}
<p>Rounding works per pay period: on weekly pay, ${h.num(32.5, 1)} hours gives ${irregularAccrual(32.5).credited} hours of holiday a week, while on monthly pay the hours of the month are added up first and rounded once, which can give a slightly different annual total. The calculator above uses weekly periods; the ${h.a('irregular-hours-holiday-calculator', 'irregular hours holiday calculator')} lets you choose the pay period.</p>

<h2>Paying it: holiday pay or rolled-up</h2>
<p>There are two lawful routes in Great Britain. The employer can pay holiday pay when you take the leave, at the normal rate, averaged over the last ${H.referenceWeeks} weeks in which you were paid, so that the unpaid summer weeks do not drag the average down. Or it can use rolled-up holiday pay under regulation 16A: ${h.pct(H.irregularAccrualRate, 2)} added to the pay for work done in each pay period, shown separately on the payslip, with no further pay when the leave is taken (${h.a('rolled-up-holiday-pay', 'rolled-up holiday pay')}). Rolled-up pay suits seasonal work, where the contract may end before any leave is taken. Either way, regular-hours rules on basic rate for 1.6 weeks do not apply to part-year workers: all their leave is paid at the normal rate.</p>

<h2>Contracts that started before April 2024</h2>
<p>The accrual method applies to leave years beginning on or after 1 April 2024. For earlier leave years, the Supreme Court’s approach in 2022 meant that a part-year worker was entitled to the full 5.6 weeks a year, unreduced, whatever the weeks worked; it was that outcome the 2024 reform changed. Claims about holiday pay for those years follow the old rules and the usual time limits for unlawful deductions from wages, which Acas can explain.</p>

<h2>Starting or leaving mid-year</h2>
<p>Because leave accrues pay period by pay period, a part-year worker who joins in spring has simply worked fewer periods by the end of the leave year: there is no separate pro-rata calculation. Leave accrued in one pay period can be taken from the next. If the contract ends, any accrued leave not yet taken or paid is paid on the final payslip at the normal rate, unless rolled-up pay already covered it. Seasonal workers re-engaged each year by the same employer should check whether the leave year runs from their start date each season or from a fixed date: the contract decides, and without a clause the leave year starts on the first day of employment.</p>

<h2>Northern Ireland</h2>
<p>The 2024 changes were made by ${h.src('si2023_1426', 'SI 2023/1426')}, whose holiday provisions extend to England, Wales and Scotland only. In Northern Ireland, term-time and seasonal workers keep the entitlement of 5.6 weeks a year under the Working Time Regulations (Northern Ireland) 2016, and ${h.src('nidHoliday', 'nidirect')} says casual or irregular workers, such as term-time workers, are entitled to paid time off for every hour they work. Rolled-up holiday pay has not been authorised there.</p>
`,
});
