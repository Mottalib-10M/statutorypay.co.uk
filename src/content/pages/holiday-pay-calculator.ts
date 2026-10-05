import { definePage } from '../../lib/guide-types';
import { P } from '../../lib/engine/params';
import { holidayPay, averageWeeksPay, entitlementDays } from '../../lib/engine/holiday';
import { formatMoney, formatNumber, displayDate } from '../../lib/format';

const H = P.holiday;
const g = (n: number, dec = 0) => formatMoney(n, dec);
const n1 = (x: number) => formatNumber(x, 1);
// Worked example computed by the engine: £520 basic, £3,900 of regular overtime and commission over
// 52 paid weeks, five-day week, the whole statutory year priced.
const extras = averageWeeksPay(3900, H.referenceWeeks);
const ex = holidayPay({ basicWeek: 520, extrasWeek: extras, daysPerWeek: 5, daysTaken: entitlementDays(5), irregular: false });
const exIrr = holidayPay({ basicWeek: 520, extrasWeek: extras, daysPerWeek: 5, daysTaken: entitlementDays(5), irregular: true });
// Short service: £1,350 of commission over 18 complete weeks.
const shortWeeks = 18;
const shortExtras = averageWeeksPay(1350, shortWeeks);

export default definePage({
  id: 'holiday-pay-calculator',
  group: 'holiday',
  order: 20,
  tool: 'holidayPay',
  related: ['holiday-entitlement-calculator', 'holiday-pay-overtime-commission', 'irregular-hours-holiday-calculator', 'weeks-pay-explained', 'rolled-up-holiday-pay', 'holiday-pay-when-leaving'],
  sources: ['wtr16', 'govHoliday', 'acasHolidayPay', 'era221', 'hol_nidTakingHolidays'],
  slug: 'holiday-pay-calculator',
  nav: 'Holiday pay calculator',
  card: 'A week’s holiday pay with regular overtime and commission, averaged over 52 paid weeks.',
  title: `Holiday Pay Calculator 2026/27: ${H.referenceWeeks}-Week Average, Overtime`,
  description: `Holiday pay calculator for 2026/27: a week’s pay averaged over the last ${H.referenceWeeks} paid weeks, with regular overtime and commission for the first ${H.basicWeeks} weeks of leave.`,
  h1: 'Holiday pay calculator: what a week of leave is worth',
  intro: 'Enter basic weekly pay, the regular extras earned over the reference period and the days you are taking: the calculator prices each day at the rate the Working Time Regulations require.',
  resume: `Holiday pay is a week’s pay for each week of statutory leave (Working Time Regulations 1998, regulation 16). When pay varies, a week’s pay is the average over the last ${H.referenceWeeks} weeks in which you were paid, ending with the last complete week before the leave starts; weeks with no pay are skipped and replaced by earlier ones, looking back no further than ${H.maxLookbackWeeks} weeks. In Great Britain, regulation 16(3ZA), added from ${displayDate(P.holidayExtra.reformsInForce, 'en-GB')}, lists what must be in the average for the first ${H.basicWeeks} weeks: commission and other payments tied to tasks the contract requires, payments for seniority, length of service or professional qualifications, and overtime paid regularly over the previous ${H.referenceWeeks} weeks. For regular-hours workers the remaining ${n1(H.additionalWeeks)} weeks may be paid at basic rate. Irregular-hours and part-year workers get the full normal rate for all ${H.statutoryWeeks} weeks. With ${g(520)} basic and ${g(extras)} of regular extras a week, a full statutory year of holiday is worth ${g(ex.pay)}.`,
  faqs: [
    { q: 'Does voluntary overtime count towards my holiday pay?', a: `If it has been paid regularly in the ${H.referenceWeeks} weeks before your leave, yes. Regulation 16(3ZA)(c) includes overtime regularly paid in that period without asking whether it was compulsory or voluntary. Occasional overtime, worked once or twice in a year, is unlikely to qualify. The inclusion is required for your first ${H.basicWeeks} weeks of leave; a contract can extend it to the rest.` },
    { q: 'Are bonuses included in a week’s holiday pay?', a: 'GOV.UK says normal pay does not usually include bonus payments, such as a discretionary annual bonus. Commission is different: it is listed in regulation 16(3ZA) because it is tied to the work the contract requires. A bonus paid for each sale or each target hit can behave like commission, so look at what triggers it rather than its name.' },
    { q: 'I have worked here for less than a year. Which weeks are averaged?', a: `The complete weeks you have worked, if fewer than ${H.referenceWeeks} (regulation 16(3)(e)(i)). Someone with ${shortWeeks} complete weeks behind them who earned ${g(1350)} in commission over those weeks adds ${g(shortExtras, 2)} a week to the basic rate. If there is not a single week to use, regulation 16(3A) asks for an amount that fairly represents a week’s pay.` },
    { q: 'Why is part of my holiday paid at a lower rate than the rest?', a: `For workers with regular hours, the law requires the normal rate, including regular extras, for ${H.basicWeeks} weeks of leave only. The other ${n1(H.additionalWeeks)} weeks come from regulation 13A, which regulation 16(3ZA) does not cover, so basic pay is enough. On a five-day week that means ${n1(ex.daysAtNormal)} days at normal rate and ${n1(ex.daysAtBasic)} at basic.` },
    { q: 'I am paid monthly. How is a week’s holiday pay found?', a: 'GOV.UK sets out two steps. Divide the month’s pay by the hours worked in that month to get an average hourly rate, then multiply it by the hours worked in a week. Repeat for each week of the reference period and average the results to get a week’s pay for holiday.' },
  ],
  body: (h) => `
<h2>The example in the calculator</h2>
<p>The figures already filled in describe a regular-hours employee on ${h.gbp(520)} basic a week who earned ${h.gbp(3900)} of regular overtime and commission over ${H.referenceWeeks} paid weeks, an average of ${h.gbp(extras)} a week. A normal week is therefore ${h.gbp(ex.normalWeek)} and a normal day ${h.gbp(ex.dayNormal)}. Pricing the whole statutory year:</p>
${h.table(['Part of the leave', 'Days', 'Rate a day', 'Pay'], [
    [`First ${H.basicWeeks} weeks (normal rate)`, h.num(ex.daysAtNormal, 1), h.gbp(ex.dayNormal, 2), h.gbp(ex.daysAtNormal * ex.dayNormal)],
    [`Remaining ${h.num(H.additionalWeeks, 1)} weeks (basic rate allowed)`, h.num(ex.daysAtBasic, 1), h.gbp(ex.dayBasic, 2), h.gbp(ex.daysAtBasic * ex.dayBasic)],
    ['Total, regular hours', h.num(ex.daysAtNormal + ex.daysAtBasic, 1), '', h.gbp(ex.pay)],
    ['Same pay, irregular hours (all at normal rate)', h.num(exIrr.daysAtNormal + exIrr.daysAtBasic, 1), h.gbp(exIrr.dayNormal, 2), h.gbp(exIrr.pay)],
  ], 'Calculated by the site engine from regulation 16; a contract may pay every day at the normal rate.', ['l', 'r', 'r', 'r'])}
<p>The gap of ${h.gbp(exIrr.pay - ex.pay)} is the price of the ${h.num(H.additionalWeeks, 1)} weeks being paid without extras. Many employers pay the normal rate throughout because it is simpler; the calculator shows the legal floor.</p>

<h2>Counting the reference period</h2>
<p>The calculation date is the first day of the leave (${h.src('wtr16', 'regulation 16(3)(c)')}). Count back from the last complete week before it. A week ends on Saturday unless your pay week ends on another day, in which case that day is used (regulation 16(3B)). Skip any week in which nothing was paid, and for the extras listed in regulation 16(3ZA) also skip weeks in which you were on sick leave or statutory leave for any time at all (regulation 16(3ZE)), going further back to make up the ${H.referenceWeeks}. Nothing older than ${H.maxLookbackWeeks} weeks is used. The method behind “a week’s pay” comes from sections 221 to 224 of the Employment Rights Act 1996, which ${h.a('weeks-pay-explained', 'a week’s pay explained')} walks through.</p>

<h2>Irregular hours, and Northern Ireland</h2>
<p>For irregular-hours and part-year workers in Great Britain, holiday is accrued in hours and paid at an hourly rate: the week’s pay divided by the average weekly hours in the same weeks (regulation 16(1A)). Rolled-up pay, an uplift on each payslip, is the alternative an employer may use for them; see ${h.a('rolled-up-holiday-pay', 'rolled-up holiday pay')}. Northern Ireland did not adopt the 2024 changes. nidirect tells workers whose pay varies that holiday pay is their average weekly wage over the previous ${P.holidayExtra.niVariablePayAverageWeeks} weeks, including guaranteed and non-guaranteed overtime and commission (${h.src('hol_nidTakingHolidays', 'nidirect, Taking your holidays')}).</p>
`,
});
