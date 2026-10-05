import { definePage } from '../../lib/guide-types';
import { P } from '../../lib/engine/params';
import { firstYearAccrued, entitlementDays, proRataDays } from '../../lib/engine/holiday';

const H = P.holiday;
const jan13 = proRataDays({ daysPerWeek: 5, yearStart: '2026-01-01', start: '2026-01-13' });

export default definePage({
  id: 'holiday-first-year',
  group: 'holiday',
  order: 90,
  mini: 'firstYearHoliday',
  related: ['holiday-entitlement-calculator', 'booking-holiday-notice', 'part-time-holiday-entitlement', 'holiday-pay-when-leaving', 'carry-over-holiday'],
  sources: ['wtr15A', 'govHoliday', 'wtr13', 'nidHoliday'],
  slug: 'holiday-first-year',
  nav: 'Holiday in your first year',
  card: 'How much leave a new starter can take, month by month.',
  title: 'Holiday in the First Year of a Job 2026: Monthly Accrual',
  description: `Holiday in the first year of a new job in 2026: one-twelfth of ${entitlementDays(5)} days builds up each month, rounded up to a half day, and how a mid-year start changes it.`,
  h1: 'Holiday in your first year: what you can take, and when',
  intro: 'A new job gives the full 5.6 weeks a year, but not all at once: the first-year accrual rule, the rounding, and the difference with a mid-year start.',
  resume: `Statutory holiday starts building up on your first day at work: there is no waiting period before you are entitled to it. During the first year of a job, though, regulation 15A of the Working Time Regulations limits how much you can take at any moment to what has accrued so far: one-twelfth of the year’s entitlement on the first day of each month of employment. For a five-day week that is ${firstYearAccrued(5, 1)} days in the first month, ${firstYearAccrued(5, 3)} days after three months and the full ${entitlementDays(5)} days by the twelfth. A fraction of a day is rounded up to the next half day. Days already taken are deducted. This rule is separate from the pro-rata entitlement of someone who joins part way through the company’s leave year: that changes the total for the year, while the first-year accrual only changes the pace at which it can be used. It applies to regular-hours workers; irregular-hours and part-year workers in Great Britain accrue 12.07% of hours worked instead.`,
  faqs: [
    { q: 'Can my employer stop me taking any holiday during probation?', a: 'Not the statutory leave that has accrued. A probation clause can restrict extra contractual days, but under regulation 15A you can take the statutory leave built up so far, giving the usual notice. The employer can still refuse particular dates with counter-notice, as for any worker.' },
    { q: 'I started on the 13th of the month. Do I get a whole month’s holiday for it?', a: `Under the first-year rule, yes: one-twelfth accrues on the first day of each month of your employment, counted from your start date. For the leave-year total, GOV.UK gives the example of a 13 January start in a January leave year: ${jan13.shown} days for January, rounded up to the nearest half day.` },
    { q: 'What happens if I leave having taken more holiday than I built up?', a: 'Your employer can only recover the excess from your final pay if a written agreement, normally your contract, allows it. Without one, the overtaken days are not deducted. The calculation on leaving uses the share of the leave year worked, as explained on the holiday pay when leaving page.' },
  ],
  body: (h) => `
<h2>The monthly build-up, step by step</h2>
<p>Regulation 15A applies only during the first twelve months of employment. On the first day of each month of employment, one-twelfth of the annual statutory leave becomes available: the 4 weeks under regulation 13 plus the 1.6 additional weeks under regulation 13A, capped at ${H.maxDays} days. Where the running total contains a fraction of a day, it is treated as a half day if below a half and as a whole day if above (regulation 15A(3)), which in practice means rounding up to the next half day.</p>
${h.table(['Month of employment', '5 days a week', '4 days a week', '3 days a week', '2 days a week'], Array.from({ length: 12 }, (_, i) => [i + 1, h.num(firstYearAccrued(5, i + 1), 1), h.num(firstYearAccrued(4, i + 1), 1), h.num(firstYearAccrued(3, i + 1), 1), h.num(firstYearAccrued(2, i + 1), 1)]), 'Days of statutory holiday available, before deducting days already taken.', ['r', 'r', 'r', 'r', 'r'])}
<p>The table is cumulative. Someone four months into a five-day job who has already taken two days can book ${h.num(firstYearAccrued(5, 4) - 2, 1)} more. Bank holidays count against these figures if the employer includes them in the allowance, which is common: a new starter in December may find most of their accrued leave used by the Christmas closure.</p>

<h2>Two different questions: pace and total</h2>
<p>New starters often mix up two rules. The first-year accrual rule answers “how much can I take so far?”. The pro-rata rule answers “how much will I get in this leave year?”. If your leave year matches your start date, the two run together. If your employer runs a calendar leave year and you join in June, your entitlement for that first leave year is a share of the full year, counted by GOV.UK in months, rounded up to the next half day; the ${h.a('holiday-entitlement-calculator', 'holiday entitlement calculator')} works it out. For a ${h.date('2026-01-13')} start in a January leave year, that comes to ${jan13.shown} days.</p>
<p>When the leave year turns over, the pro-rata total is spent or carried over under the usual rules. GOV.UK also allows employers to use an accrual system throughout the first year for regular-hours staff, which follows the same one-twelfth logic.</p>

<h2>A worked example: a September start</h2>
<p>Amira starts a four-day-a-week job on 7 September 2026. Her employer’s leave year runs from 1 April. Her statutory entitlement for a full year would be ${h.num(entitlementDays(4), 1)} days; for the leave year ending on 31 March 2027 she gets the share left on her start date, ${h.num(proRataDays({ daysPerWeek: 4, yearStart: '2026-04-01', start: '2026-09-07' }).shown, 1)} days. Within that total, the first-year rule controls the pace: ${h.num(firstYearAccrued(4, 1), 1)} days from 7 September, ${h.num(firstYearAccrued(4, 3), 1)} days from 7 November, ${h.num(firstYearAccrued(4, 4), 1)} days from 7 December, in time for a week off at Christmas. If the office closes for the bank holidays on 25 and 28 December and counts them in her allowance, two of those days are spoken for. From 1 April 2027 a new leave year starts, with an entitlement of ${h.num(entitlementDays(4), 1)} days for the year. The first-year limit only applies until her first anniversary at work.</p>

<h2>Booking leave as a new starter</h2>
<p>The notice rules are the same as for everyone: twice the length of the leave plus one day, unless your contract says otherwise (${h.a('booking-holiday-notice', 'booking holiday and notice')}). An employer can refuse specific dates by giving notice equal to the leave plus a day, and can tell you to take accrued leave at set times, such as a shutdown. What it cannot do is refuse to let you take statutory leave at all, or make you wait for the end of probation to take what has already accrued.</p>

<h2>Leaving during the first year</h2>
<p>If you leave before the year is out, the calculation on leaving is the regulation 14 formula: the year’s entitlement times the share of the leave year that has passed, minus what you took (${h.a('holiday-pay-when-leaving', 'holiday pay when leaving')}). It does not use the first-year monthly steps, so someone who resigns in the middle of a month is paid for the exact fraction of the year, not rounded to a half day.</p>

<h2>Irregular hours, part-year contracts and Northern Ireland</h2>
<p>In Great Britain, a worker whose hours are wholly or mostly variable, or who works only part of the year, does not use the monthly rule for leave years starting from 1 April 2024. Leave accrues at ${h.pct(H.irregularAccrualRate, 2)} of the hours worked in each pay period and can be taken from the next pay period. In Northern Ireland, where those 2024 changes do not apply, ${h.src('nidHoliday', 'nidirect')} states that holiday starts building up as soon as you start work. Ask your employer how it applies the first-year limit, and the Labour Relations Agency if the answer leaves you without leave you have earned.</p>
`,
});
