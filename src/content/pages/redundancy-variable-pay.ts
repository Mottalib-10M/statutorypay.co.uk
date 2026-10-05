import { definePage } from '../../lib/guide-types';
import { CAP_GB, P } from '../../lib/engine/params';
import { averageWeek, computeRedundancy, reckonerWeeks } from '../../lib/engine/redundancy';
import { statutoryNoticeWeeks } from '../../lib/engine/notice';
import { addDays, addWeeks, dayOfWeek } from '../../lib/engine/dates';
import { formatMoney } from '../../lib/format';

const g = (n: number, d = 0) => formatMoney(n, d);
const N = P.redundancy.averagingWeeks;
// 1. Which weeks: a sales adviser working three months' contractual notice.
const adv = computeRedundancy({ dob: '1988-06-14', start: '2017-02-06', noticeGiven: '2026-09-07', end: '2026-12-07', weeklyPay: 0 });
const advNotice = statutoryNoticeWeeks('2017-02-06', adv.relevantDate);
const calcDate = addWeeks(adv.relevantDate, -advNotice);
// Weeks run Sunday to Saturday; the period ends with the last complete week before the calculation date.
const lastSat = dayOfWeek(calcDate) === 6 ? calcDate : addDays(calcDate, -((dayOfWeek(calcDate) + 1) % 7 || 7));
const firstSun = addDays(lastSat, -(7 * N - 1));
// 2. Pay history of a delivery driver with no normal hours: one week without pay is replaced.
const weeksPaid = [612, 588, 0, 640, 702, 575, 660, 598, 615, 701, 556, 634, 590];
const counted = weeksPaid.filter((w) => w > 0).slice(0, N);
const driverWeek = averageWeek(counted.reduce((s, w) => s + w, 0), N);
const driverWeeks = reckonerWeeks(31, 7);
// 3. Back from furlough on more hours: nidirect's own pattern, recomputed.
const furlough = averageWeek(9 * 300 + 3 * 400, N);
// 4. Commission on top of a fixed basic.
const basic = 520;
const commission12 = 3480;
const salesWeek = averageWeek(basic * N + commission12, N);

export default definePage({
  id: 'redundancy-variable-pay',
  group: 'redundancy',
  order: 80,
  mini: 'variablePayWeek',
  related: ['weeks-pay-explained', 'redundancy-pay-calculator', 'redundancy-relevant-date', 'redundancy-pay-cap', 'redundancy-pay-table'],
  sources: ['era221', 'red_era224', 'era226', 'govRedundancy', 'nidRedundancy', 'red_acasPay'],
  slug: 'redundancy-variable-pay',
  nav: 'Redundancy with variable pay',
  card: 'Overtime, commission, shifts and zero hours: the 12-week average behind your redundancy pay.',
  title: 'Redundancy Pay With Variable Pay 2026: the 12-Week Average',
  description: `Redundancy pay when your pay varies, 2026: the ${N}-week average, which weeks count, commission, overtime, shifts and furlough, all capped at ${g(CAP_GB)} a week.`,
  h1: 'Redundancy pay when your pay varies week to week',
  intro: 'With a fixed salary a week’s pay is on your contract; with commission, shifts or no set hours it has to be rebuilt from twelve weeks of payslips.',
  resume: `When your earnings change from week to week, the week’s pay used for statutory redundancy pay is an average of the last ${N} complete weeks before a calculation date, under sections 221 to 224 of the Employment Rights Act 1996. Commission and piece rates are included, because the Act treats pay that varies with the work done as part of normal pay. Overtime counts only if your contract guarantees it; voluntary overtime is left out. With no normal working hours, as on a zero-hours employment contract, any week in which you earned nothing is skipped and an earlier paid week is used instead, so the average always covers ${N} paid weeks. For redundancy, the calculation date is the day statutory notice would have been given to end on your relevant date, which can put a late pay rise outside the period. GOV.UK says furlough must be ignored: use what you would normally have earned. Whatever the average, a week’s pay is capped at ${g(CAP_GB)}.`,
  faqs: [
    { q: 'Does commission count in my week’s pay for redundancy?', a: `Yes. Section 221(4) says pay that varies with the amount of work done includes commission or similar payments that vary in amount. Your week’s pay is then your normal weekly hours at the average hourly rate, commission included, over the ${N} weeks before the calculation date. Acas adds contractual bonuses you are entitled to; a purely discretionary bonus is a different matter.` },
    { q: 'I got a pay rise near the end of my notice. Is it included in my redundancy pay?', a: `Often not. For redundancy, the ${N} weeks end before the calculation date, which is the day statutory notice would have been given to finish on your relevant date. With nine years’ service that is nine weeks before your last day. A rise that starts after that date is outside the period, though your contract may treat it more generously.` },
    { q: 'My employer used my furlough pay to work out my redundancy. Is that right?', a: 'No. GOV.UK says that if you were paid less than usual because you were on furlough, statutory redundancy pay is based on what you would have earned normally. nidirect shows how this works when someone comes back on more hours: the weeks on furlough are taken at the pre-furlough pay, and the weeks after return at the new pay.' },
    { q: 'How is a week’s pay worked out on a zero-hours contract?', a: `If you are an employee, which is needed for redundancy pay, section 224 applies: average weekly pay over the last ${N} weeks in which you were paid, skipping empty weeks and reaching back to earlier ones. Acas warns that someone on a zero-hours contract is not likely to have employee status, so check that first.` },
    { q: 'Does a night or weekend shift allowance count?', a: 'Yes, if those shifts are part of your normal hours. Where normal hours fall on days or at times that change from week to week, section 222 takes the average weekly hours and the average hourly rate over twelve weeks, and that rate includes premiums paid for the normal hours. Premiums for overtime beyond normal hours are stripped back to the ordinary rate.' },
  ],
  body: (h) => `
<h2>Which twelve weeks</h2>
<p>The period ends with the last complete week before the calculation date, or with the week that ends on it. For a redundancy payment, ${h.src('era226', 'section 226(5) and (6)')} put the calculation date where statutory minimum notice would have been given had it expired on the relevant date. Where a payment in lieu has triggered the section 145(5) extension, the calculation date is instead the unextended relevant date itself, the actual last day.</p>
<p>A sales adviser who started on ${h.date('2017-02-06')} works three months’ contractual notice to ${h.date(adv.relevantDate)}. Statutory notice for ${advNotice} complete years would be ${advNotice} weeks, so the calculation date is ${h.date(calcDate)}. Counting weeks that end on a Saturday, the ${N} weeks run from ${h.date(firstSun)} to ${h.date(lastSat)}. A commission spike in November, or a pay rise in December, falls outside them.</p>

<h2>Commission and piece rates</h2>
<p>With normal working hours and pay that moves with the work done, ${h.src('era221', 'section 221(3)')} values a week as the normal hours at the average hourly rate over the ${N} weeks. Section 221(4) brings commission into that rate. In practice, when the hours are the same each week, the result equals average weekly pay. A sales adviser on a basic ${h.gbp(basic)} a week who earned ${h.gbp(commission12)} of commission over the ${N} weeks has a week’s pay of ${h.gbp(salesWeek, 2)}. Acas lists contractual bonuses and commission you are entitled to as part of weekly pay; a purely discretionary bonus is not something you are entitled to.</p>

<h2>Overtime: only when the contract fixes it</h2>
<p>Section 234 sets the normal working hours. Where overtime starts after a fixed number of hours, those are the normal hours, unless the contract also fixes a higher minimum that the employee must work: then the higher figure counts. Acas puts it simply: weekly pay includes “guaranteed overtime” that the employer must offer and you must work (${h.src('red_acasPay', 'Acas, Redundancy pay')}). Voluntary overtime and overtime the employer may offer but need not, however regular, stay outside the redundancy calculation. Where guaranteed overtime is paid at a premium, section 223(3) values those hours at the ordinary rate.</p>

<h2>No normal hours: skip the empty weeks</h2>
<p>Under ${h.src('red_era224', 'section 224')}, an employee with no normal working hours has a week’s pay equal to average weekly pay over the ${N} weeks, but “no account shall be taken of a week in which no remuneration was payable”, and earlier weeks are brought in instead. The table shows thirteen weeks of a delivery driver’s pay, most recent first; the empty third week drops out and the thirteenth is used.</p>
${h.table(['Week before calculation date', 'Gross pay', 'Counted?'], weeksPaid.map((w, i) => [String(i + 1), h.gbp(w), w > 0 && weeksPaid.slice(0, i + 1).filter((x) => x > 0).length <= N ? 'Yes' : 'No']),
    `Average of the ${N} paid weeks: ${h.gbp(driverWeek, 2)}. Computed with the site’s redundancy engine.`, ['r', 'r', 'l'])}
<p>At 31 with seven complete years, the driver is owed ${h.num(driverWeeks, 1)} weeks: ${h.gbp(driverWeeks * Math.min(driverWeek, CAP_GB))}. Had the empty week been averaged in, the figure would have been lower; the Act stops a quiet spell before redundancy from cutting the payment.</p>

<h2>Furlough, family leave and other reduced-pay weeks</h2>
<p>GOV.UK states that if you were paid less than usual because you were on furlough, your statutory redundancy pay is based on what you would have earned normally (${h.src('govRedundancy', 'Redundancy: your rights')}). ${h.src('nidRedundancy', 'nidirect')} works through a case where an employee on ${h.gbp(300)} a week (30 hours at ${h.gbp(10)}) is furloughed for five weeks, then returns for three weeks on 40 hours: the furlough weeks are counted at ${h.gbp(300)}, giving nine weeks at ${h.gbp(300)} and three at ${h.gbp(400)}, an average of ${h.gbp(furlough, 2)}.</p>
<p>Acas applies the same principle to family-related leave: if you are made redundant while on maternity, paternity, adoption, shared parental, neonatal care or carer’s leave, redundancy pay uses your normal contractual weekly pay, not the reduced pay received during the leave. The ${h.a('redundancy-maternity-leave', 'maternity leave page')} covers that case in full.</p>

<h2>Part-time and changing hours</h2>
<p>A part-time employee’s week’s pay is simply smaller; every year of part-time service still counts as a full year. Someone who cut their hours a few months before redundancy is priced at the new, lower pattern if it is the contract in force on the calculation date. Section 221 looks at that contract, not at an average of past contracts.</p>

<h2>Then the cap</h2>
<p>Whatever route gives your week’s pay, the result cannot exceed ${h.gbp(CAP_GB)} for a relevant date from 6 April 2026. A high month of commission therefore only helps up to that figure. The ${h.a('weeks-pay-explained', 'week’s pay guide')} compares these rules with the different ones used for holiday pay.</p>
`,
});
