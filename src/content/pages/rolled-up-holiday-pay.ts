import { definePage } from '../../lib/guide-types';
import { P } from '../../lib/engine/params';
import { rolledUp, irregularAccrual } from '../../lib/engine/holiday';
import { formatMoney, formatNumber, formatPercent, displayDate } from '../../lib/format';

const H = P.holiday;
const rate = formatPercent(H.irregularAccrualRate, 2);
const g2 = (n: number) => formatMoney(n, 2);
const from = displayDate(H.irregularRegimeFrom, 'en-GB');
// A monthly payslip for a zero-hours care worker, computed by the engine.
const hours = 82, hourly = 13.5, overtime = 113;
const basic = hours * hourly;
const forWork = basic + overtime;
const uplift = rolledUp(forWork);
const accrued = irregularAccrual(hours);
// Sick leave: average holiday pay of the previous 52 weeks, here 12 monthly payslips.
const pastUplifts = [148.2, 131.4, 162.9, 119.6, 140.3, 155.1, 128.8, 137.5, 150.2, 144.7, 126.3, 160.4];
const sickPeriodPay = pastUplifts.reduce((a, b) => a + b, 0) / pastUplifts.length;
// A fortnightly worker paid the same amount every period, over a year.
const yearly = rolledUp(640) * 26;

export default definePage({
  id: 'rolled-up-holiday-pay',
  group: 'holiday',
  order: 50,
  mini: 'rolledUpHoliday',
  miniHref: 'irregular-hours-holiday-calculator',
  related: ['irregular-hours-holiday-calculator', 'zero-hours-holiday-pay', 'holiday-pay-calculator', 'carry-over-holiday', 'term-time-part-year-holiday'],
  sources: ['wtr16A', 'wtr15B', 'hol_wtr15D', 'hol_wtr15E', 'govHoliday', 'hol_nidTakingHolidays'],
  slug: 'rolled-up-holiday-pay',
  nav: 'Rolled-up holiday pay',
  card: `The ${rate} uplift on each payslip: who can be paid that way and what it must show.`,
  title: `Rolled-Up Holiday Pay 2026/27: The ${rate} Uplift Explained`,
  description: `Rolled-up holiday pay in 2026/27: a ${rate} uplift paid with wages, only for irregular-hours and part-year workers in Great Britain, shown on the payslip.`,
  h1: 'Rolled-up holiday pay: the uplift paid with your wages',
  intro: 'Instead of paying you when you take time off, your employer may add holiday pay to every payslip. The law allows it for some workers only, and on strict conditions.',
  resume: `Rolled-up holiday pay means paying holiday pay as an uplift on wages instead of paying it when the leave is taken. Regulation 16A of the Working Time Regulations 1998 allows it in Great Britain only for irregular-hours and part-year workers, for leave years beginning on or after ${from}. The uplift is ${rate} of the pay for work done in the period, counting everything that would go into a week’s holiday pay, so regular overtime and commission are uplifted too. It must be paid at the same time as the wages it relates to and shown as a separate amount on the payslip. During sick leave or statutory leave it continues as the average holiday pay of the previous ${H.referenceWeeks} weeks. Paying it discharges the employer, so the time off is later taken unpaid. Workers on regular hours cannot be paid this way, and Northern Ireland does not allow it. If rolled-up pay that was due is not paid, GOV.UK says the whole entitlement can be carried over.`,
  faqs: [
    { q: 'Is rolled-up holiday pay legal for zero-hours workers?', a: `Yes in England, Wales and Scotland, for leave years beginning on or after ${from}. A zero-hours contract has wholly variable paid hours, which makes the worker an irregular-hours worker under regulation 15F, and regulation 16A then lets the employer pay holiday as a ${rate} uplift. It is an option for the employer, not an obligation: holiday can still be paid when taken.` },
    { q: 'My payslip shows one hourly rate with holiday “included”. Is that rolled-up holiday pay?', a: 'Not as the law defines it. Regulation 16A(7) requires the payslip to show the amount of holiday pay for the period. A single blended rate does not show it. GOV.UK says that where a worker did not receive rolled-up holiday pay they were entitled to, they can carry over their whole leave entitlement, so the point is worth raising with the employer, in writing.' },
    { q: 'Do I get paid again when I actually take the time off?', a: 'No. Regulation 16A(8) says an employer who has paid the uplift has met its duty to pay for that leave. You still accrue the hours under regulation 15B and still have the right to take them, but the days off themselves are unpaid. Setting some of each uplift aside is the practical answer.' },
    { q: 'What happens to rolled-up pay while I am on maternity leave?', a: `It carries on. Regulation 16A(4) to (6) requires a payment in each pay period of the leave equal to the average holiday pay you received per pay period over the ${H.referenceWeeks} weeks before the leave started, or over a shorter period if you have been paid this way for less time. You also keep accruing leave under regulation 15C.` },
    { q: 'Does the uplift apply to overtime and commission too?', a: `Yes. Regulation 16A(9) defines the remuneration to be uplifted as every type of payment that goes into a week’s holiday pay under regulation 16. That includes commission, regularly paid overtime and payments for seniority or qualifications. A one-off discretionary bonus, which GOV.UK says does not usually count in normal pay, would normally fall outside it.` },
  ],
  body: (h) => `
<h2>Who can be paid this way</h2>
<p>Only workers whose leave is calculated under ${h.src('wtr15B', 'regulation 15B')}: irregular-hours workers, whose paid hours are wholly or mostly variable under their contract, and part-year workers, who have unpaid weeks off each year. The rules start with the first leave year beginning on or after ${h.date(H.irregularRegimeFrom)}. Before that, and for anyone on regular hours today, rolled-up pay is not allowed: GOV.UK says an employer cannot include an amount for holiday pay in the hourly rate of a regular-hours worker, full-time or part-time (${h.src('govHoliday', 'GOV.UK, Holiday entitlement')}). An employer who has a mix of staff can therefore use it for the casual pool and not for the contracted team.</p>

<h2>The three conditions in regulation 16A</h2>
<ol>
<li><strong>The rate</strong>: ${rate} of the worker’s remuneration for work done, where remuneration means every kind of payment included in a week’s pay for holiday purposes (${h.src('wtr16A', 'regulation 16A(2) and (9)')}).</li>
<li><strong>The timing</strong>: paid at the same time as the pay for the work it relates to (regulation 16A(3)). Holding it back to a later month, or paying it only at the end of a contract, does not satisfy the rule.</li>
<li><strong>The payslip</strong>: the itemised pay statement must show the amount of holiday pay paid for the period (regulation 16A(7)).</li>
</ol>

<h2>What a correct payslip looks like</h2>
<p>A care worker on a zero-hours contract works ${hours} hours in September at ${h.gbp(hourly, 2)} an hour and is paid ${h.gbp(overtime)} of regular overtime premium. The holiday pay line is calculated on both, as regulation 16A(9) requires.</p>
${h.table(['Payslip line', 'Amount'], [
    [`Basic pay, ${hours} hours × ${g2(hourly)}`, g2(basic)],
    ['Overtime premium', g2(overtime)],
    [`Holiday pay, ${rate} of ${g2(forWork)}`, g2(uplift)],
    ['Gross pay for the month', g2(forWork + uplift)],
  ], 'Uplift calculated by the site engine; tax and National Insurance then apply to the gross total.', ['l', 'r'])}
<p>The same month also adds ${accrued.credited} hours to the worker’s leave balance (${hours} × ${rate} = ${h.num(accrued.exact, 2)}, rounded to the nearest hour). Rolled-up pay changes when holiday is paid, not how much leave is built up.</p>

<h2>Sick leave, maternity and other statutory leave</h2>
<p>A worker who was paid rolled-up holiday pay before going on sick leave or statutory leave must keep receiving it during that leave, but the amount changes. Instead of ${rate} of pay for work done, which would be nothing, each pay period carries the average holiday pay paid per period over the ${H.referenceWeeks} weeks before the leave started (regulation 16A(4) to (6)). If the worker had been paid this way for less than ${H.referenceWeeks} complete weeks, the shorter period is used. For the care worker above, twelve earlier payslips with holiday pay lines ranging from ${g2(Math.min(...pastUplifts))} to ${g2(Math.max(...pastUplifts))} give ${g2(sickPeriodPay)} for each month of sick leave.</p>

<h2>Taking the time off</h2>
<p>Because the money has already been paid, regulation 16A(8) discharges the employer from paying again when the leave is taken. The leave itself does not disappear: it builds up at ${rate} of hours worked, it can be booked with the normal notice, and the employer must still let you take it. Over a year the sums are not small. Someone earning ${h.gbp(640)} a fortnight receives ${h.gbp(yearly)} of rolled-up holiday pay across 26 payslips, which is the pay for the weeks they will spend on holiday.</p>

<h2>When the rules are broken</h2>
<p>Regulation 15D(5) and (6) let a worker carry forward all of their leave, untaken or taken but not paid, where the employer failed to recognise the right to pay for it. GOV.UK puts it simply: a worker can carry over their whole leave entitlement if they did not receive rolled-up holiday pay they were entitled to (${h.a('carry-over-holiday', 'carrying over holiday')}). That leave can be carried until the end of the first full leave year in which the failure no longer applies. On leaving, ${h.src('hol_wtr15E', 'regulation 15E')} requires payment in lieu of accrued leave not taken, except leave already paid through a valid uplift.</p>

<h2>Northern Ireland</h2>
<p>None of this applies in Northern Ireland, where SI 2023/1426 does not extend. nidirect is explicit that holiday pay should be paid for the time when the holiday is taken, that an employer cannot include an amount for holiday pay in the hourly rate, and that a contract which still does so should be renegotiated (${h.src('hol_nidTakingHolidays', 'nidirect, Taking your holidays')}).</p>
`,
});
