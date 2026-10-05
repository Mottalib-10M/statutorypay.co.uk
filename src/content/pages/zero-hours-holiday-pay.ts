import { definePage } from '../../lib/guide-types';
import { P } from '../../lib/engine/params';
import { irregularAccrual, averageWeeksPay, rolledUp } from '../../lib/engine/holiday';
import { formatPercent, formatMoney } from '../../lib/format';

const H = P.holiday;
const rate = formatPercent(H.irregularAccrualRate, 2);
// A zero-hours month by month: hours worked and pay, monthly pay periods.
const months: Array<[string, number]> = [['April', 62], ['May', 118], ['June', 0], ['July', 141], ['August', 96], ['September', 33.5]];
const hourly = P.minimumWage.age21plus;

export default definePage({
  id: 'zero-hours-holiday-pay',
  group: 'holiday',
  order: 140,
  mini: 'zeroHoursHoliday',
  related: ['irregular-hours-holiday-calculator', 'rolled-up-holiday-pay', 'holiday-pay-calculator', 'term-time-part-year-holiday', 'employment-status-rights'],
  sources: ['wtr15B', 'wtr16', 'wtr16A', 'govHoliday', 'nidHoliday'],
  slug: 'zero-hours-holiday-pay',
  nav: 'Zero-hours holiday pay',
  card: 'Holiday on a zero-hours or casual contract: accrual, average pay, rolled-up pay.',
  title: `Zero-Hours Holiday Pay 2026: ${rate} Accrual, 52-Week Pay`,
  description: `Zero-hours holiday pay in 2026: leave accrues at ${rate} of the hours you work, holiday pay averages your last ${H.referenceWeeks} paid weeks, and rolled-up pay is allowed.`,
  h1: 'Holiday pay on a zero-hours contract',
  intro: 'No guaranteed hours does not mean no holiday: how leave builds up month by month, what a day off is worth, and when the payslip can include it.',
  resume: `Zero-hours and casual workers are entitled to paid holiday like everyone else; what differs is how it is counted. In Great Britain, since leave years starting on or after 1 April 2024, a worker whose paid hours are wholly or mostly variable builds up leave at ${rate} of the hours actually worked in each pay period, rounded to the nearest hour, up to ${H.maxDays} days a year. The leave can be taken from the next pay period. When you take it, a week’s holiday pay is the average of your pay in the last ${H.referenceWeeks} weeks in which you were paid, looking back up to ${H.maxLookbackWeeks} weeks so that weeks with no work do not pull the average down; overtime and commission are included. Instead, your employer may pay rolled-up holiday pay, an extra ${rate} on each payslip, shown on its own line. In Northern Ireland the 2024 rules do not apply, and casual workers accrue paid time off for every hour worked under the Northern Ireland regulations.`,
  faqs: [
    { q: 'I worked no hours last month. Do I lose holiday?', a: 'You build up nothing for a month without work, because accrual follows hours worked, but you keep what you had already accrued. When you take leave later, the empty month does not lower your holiday pay either: weeks without pay are skipped when the 52-week average is calculated.' },
    { q: 'Can my employer refuse to let me take holiday because I am on zero hours?', a: 'No. You can book accrued leave with the normal notice of twice the length plus one day, and the employer can only refuse particular dates with counter-notice, as for any worker. Not offering shifts during booked leave is not the same as paying for it: the leave must be paid.' },
    { q: 'How do I know if my hourly rate already includes holiday pay?', a: `Only if the payslip shows it. Rolled-up holiday pay is lawful in Great Britain for irregular-hours workers only if it is ${rate} of pay, paid at the same time as the wages and itemised separately. A single rate described as “including holiday” in the contract, without a separate line, does not meet those conditions.` },
    { q: 'Can I ask for my holiday to be paid instead of taking it?', a: 'Not while the job continues: statutory leave can only be swapped for money when the employment ends. The exception is rolled-up holiday pay, where the money is paid with each payslip, but even then you remain entitled to take the time off, unpaid at that point because it was already paid.' },
  ],
  body: (h) => `
<h2>Six months on a zero-hours contract</h2>
<p>Take a worker paid monthly at the National Living Wage, ${h.gbp(hourly, 2)} an hour. Each month’s hours are multiplied by ${rate} and rounded to the nearest hour, and what has accrued can be taken from the next month.</p>
${h.table(['Month', 'Hours worked', 'Pay for the month', 'Holiday hours accrued', 'Rolled-up pay alternative'], months.map(([m, hrs]) => [m, h.num(hrs, 1), h.gbp(hrs * hourly, 2), irregularAccrual(hrs).credited, h.gbp(rolledUp(hrs * hourly), 2)]), `Accrual at ${rate} of hours worked in the pay period, rounded to the nearest hour (regulation 15B(5)).`, ['l', 'r', 'r', 'r', 'r'])}
<p>Over the six months the worker accrues ${h.num(months.reduce((s, [, hrs]) => s + irregularAccrual(hrs).credited, 0))} hours of holiday. Notice that rounding happens once per pay period: the ${h.num(33.5, 1)} hours of September give ${irregularAccrual(33.5).credited} hours, not the ${h.num(irregularAccrual(33.5).exact, 2)} of the exact percentage.</p>

<h2>What a day off is worth</h2>
<p>Hours of leave are converted into money with the holiday pay rules of regulation 16. A week’s pay is the average of the weeks in which you were paid, up to ${H.referenceWeeks}, looking back no more than ${H.maxLookbackWeeks} weeks; regulation 16(1A) turns it into an hourly rate by dividing by the average hours worked in those weeks. For the worker in the table, paid in ${months.filter(([, x]) => x > 0).length} of the six months, the average comes from those months only. A simple way to check: total pay in the paid weeks divided by the number of paid weeks, as the calculator above does, gives ${formatMoney(averageWeeksPay(9800, 40))} a week for ${h.gbp(9800)} over 40 paid weeks.</p>

<h2>Rolled-up pay: when it is allowed</h2>
<p>Regulation 16A allows employers of irregular-hours and part-year workers in Great Britain to pay holiday as a ${rate} uplift on all pay for work done, including overtime and commission. Three conditions apply: the uplift is paid at the same time as the wages, the payslip shows it as holiday pay on its own line, and during sick or statutory leave the employer pays the average holiday pay of the previous ${H.referenceWeeks} weeks. When rolled-up pay is used, nothing more is paid when the leave is taken, so put some aside: the time off is still yours to take. If an employer was entitled to pay rolled-up holiday pay and did not, GOV.UK says the whole leave entitlement can be carried over (${h.a('rolled-up-holiday-pay', 'rolled-up holiday pay')}).</p>

<h2>Keeping your own record</h2>
<p>Zero-hours work makes holiday disputes likely, because hours change every month and payslips are rarely read line by line. Keep a running note of the hours on each payslip and the holiday hours shown as accrued; if your payslip does not show accrued holiday, ask for the figure. When you book leave, ask in writing how many hours it will cover and at what rate. Since 6 April 2026 employers in Great Britain must keep records of annual leave and holiday pay for ${H.recordsYears} years, so the information exists and you can ask for it if a disagreement arises later.</p>

<h2>Worker or employee?</h2>
<p>Holiday rights belong to workers, not only to employees, so a zero-hours contract almost always carries them. Other rights do depend on being an employee, such as statutory notice and redundancy pay, and your status may also affect sick pay and family pay (${h.a('employment-status-rights', 'employment status and your rights')}). A genuinely self-employed contractor has no statutory paid holiday.</p>

<h2>Leaving, and Northern Ireland</h2>
<p>When a zero-hours engagement ends, holiday accrued and not taken is paid in the final pay, unless rolled-up pay already covered it. Agencies are responsible for their temporary workers’ holiday in the same way. In Northern Ireland, ${h.src('nidHoliday', 'nidirect')} states that casual and irregular workers are entitled to paid time off for every hour worked, under the Working Time Regulations (Northern Ireland) 2016; the ${rate} accrual and rolled-up pay rules of Great Britain do not apply there.</p>
`,
});
