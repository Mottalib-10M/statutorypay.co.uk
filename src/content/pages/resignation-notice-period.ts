import { definePage } from '../../lib/guide-types';
import { P } from '../../lib/engine/params';
import { computeNotice } from '../../lib/engine/notice';
import { leavingPay } from '../../lib/engine/holiday';
import { addMonths } from '../../lib/engine/dates';
import { displayDate, formatNumber } from '../../lib/format';

const N = P.notice;
const d = (iso: string) => displayDate(iso, 'en-GB');
// Resignation handed in on Friday 16 October 2026 under a four-week clause.
const quit = computeNotice({ start: '2021-02-01', noticeGiven: '2026-10-16', contractualWeeks: 4, weeklyPay: 600, byEmployee: true });
// No clause at all: the statutory week.
const bare = computeNotice({ start: '2021-02-01', noticeGiven: '2026-10-16', contractualWeeks: 0, weeklyPay: 600, byEmployee: true });
// Holiday left at the end of that notice (calendar leave year, 5-day week, 20 days already taken).
const oneMonth = addMonths('2026-10-16', 1);
const hol = leavingPay({ daysPerWeek: 5, yearStart: '2026-01-01', leave: quit.endDate, taken: 20, weekPay: 600 });

export default definePage({
  id: 'resignation-notice-period',
  group: 'leaving',
  order: 40,
  mini: 'resignLastDay',
  miniHref: 'notice-period-calculator',
  related: ['notice-period-calculator', 'statutory-notice-period', 'holiday-pay-when-leaving', 'payment-in-lieu-of-notice', 'booking-holiday-notice'],
  sources: ['govNoticeResign', 'era86', 'lv_era87', 'nidNotice', 'govHoliday'],
  slug: 'resignation-notice-period',
  nav: 'Notice when you resign',
  card: 'How much notice you owe when you quit, your last day, garden leave and leaving early.',
  title: `Resignation Notice Period 2026: ${N.employeeWeeks} Week Minimum and Last Day`,
  description: `Resignation notice period in 2026: the law asks ${N.employeeWeeks} week after ${N.minServiceMonths} month of service unless the contract says more; last day, garden leave, quitting early.`,
  h1: 'Notice when you resign: what you owe and your last day',
  intro: 'Handing in your notice starts a countdown fixed by your contract, with a floor set by law; here is how to count it and what can change it.',
  resume: `When you resign, the law requires you to give at least ${N.employeeWeeks} week’s notice once you have worked for the employer for ${N.minServiceMonths} month or more (Employment Rights Act 1996, section 86(2); the same rule applies in Northern Ireland). Unlike the employer’s notice, this minimum does not grow with service: after twenty years it is still ${N.employeeWeeks} week. Most contracts ask for more, often a month or three months for senior roles, and that longer clause binds you. Notice usually runs from the start of the day after you hand it in, so four weeks given on Friday ${d('2026-10-16')} end on ${d(quit.endDate)}. You are normally paid your usual rate throughout, including bonuses and commission unless the contract excludes them. Leaving before the notice runs out without your employer’s agreement is a breach of contract, and the employer can claim the loss it causes, such as the extra cost of cover.`,
  faqs: [
    { q: 'My contract says nothing about notice. How much do I have to give when I quit?', a: `At least the statutory ${N.employeeWeeks} week if you have worked there for ${N.minServiceMonths} month or more. nidirect adds that where the contract is silent, a reasonable period is implied, which depends on your seniority and how long you have worked there. The more senior the role, the longer that implied period is likely to be.` },
    { q: 'Do I have to hand in my notice in writing?', a: 'Only if the contract says so; otherwise a spoken resignation is valid. GOV.UK still recommends writing it down if you might need to refer to it later, for example at an employment tribunal. Giving notice verbally when the contract asks for writing can be a breach. Keep a copy that shows the date, since the countdown starts the next day.' },
    { q: 'Can I take back a resignation I made in the heat of the moment?', a: 'You can ask, and you should do it immediately. GOV.UK says that if you resign during an argument and change your mind, the employer can choose whether to accept your resignation or not. Because the decision is theirs, tell your employer straight away and confirm the change of mind in writing.' },
    { q: 'My new job starts before my notice ends. What can I do?', a: 'Ask your employer to agree a shorter notice period, and get the agreement in writing. nidirect says employment then ends on the agreed date and you are paid only up to it. Walking out without agreement breaks the contract: the employer could sue for its losses, for instance the extra cost of a temporary replacement.' },
    { q: 'Can I use my remaining holiday to cover part of my notice?', a: `Often, with your employer’s agreement. GOV.UK says you may be able to take what is left of your statutory leave during notice, and the employer can also tell you to take it, provided it gives the right notice. Any statutory leave still untaken on your last day must be paid. Leaving on ${d(quit.endDate)} after taking 20 days of a calendar leave year leaves ${hol.days >= 0 ? `${formatNumber(hol.days, 1)} days to be paid` : 'an overdrawn balance'}.` },
  ],
  body: (h) => `
<h2>How much notice you owe</h2>
<p>The statutory floor for an employee is ${N.employeeWeeks} week after ${N.minServiceMonths} month of continuous employment (${h.src('era86', 'section 86(2)')}). Before that first month, only the contract counts. The floor never rises, which is the big asymmetry with the employer’s side, where notice grows by a week for each complete year up to ${N.maxWeeks}. If your contract sets a longer period, that is the figure you owe, and it is the one an employer could rely on if you left early. A contract cannot set less than the statutory week once you have been there a month.</p>
${h.table(['Your situation', 'Notice you owe'], [
    [`Under ${N.minServiceMonths} month of service`, 'What the contract says, if anything'],
    ['Contract silent, one month or more', `${N.employeeWeeks} week at least; a reasonable period may be implied`],
    ['Contract sets a longer period', 'The contract period'],
    ['Employer in serious breach of contract', 'None: you may resign at once (constructive dismissal)'],
  ], 'Employee’s notice: ERA 1996 s.86(2) (art. 118(2) of the Northern Ireland Order); nidirect on implied notice.', ['l', 'l'])}

<h2>Counting to your last day</h2>
<p>Notice usually runs from the day after you hand it in. Four weeks given on Friday ${h.date('2026-10-16')} start on Saturday ${h.date('2026-10-17')} and end on ${h.date(quit.endDate)}, the same weekday four weeks on. With no notice clause, the statutory week would end on ${h.date(bare.endDate)}. A contract in months counts calendar months: one month given on ${h.date('2026-10-16')} ends on ${h.date(oneMonth)}. If the end falls on a weekend or a day you do not normally work, it is still the legal end of employment; your last working day is simply earlier. Use the calculator on the ${h.a('notice-period-calculator', 'notice period page')} and choose “Employee” to check a date.</p>

<h2>Pay during your notice</h2>
<p>GOV.UK’s guide to handing in your notice says you will usually get your normal pay rate, and that bonuses and commission are due during notice unless the contract states otherwise. If you are off sick, on holiday or on family leave during notice, sections 88 and 89 can guarantee a week’s pay for each week of the statutory minimum. There is a catch for resignations: that guarantee only applies once you actually leave at the end of your notice (sections 88(3) and 89(5)), and not at all if you join a strike after resigning (section 91(2)). The ${h.a('statutory-notice-period', 'statutory notice guide')} sets out the rule.</p>

<h2>Garden leave and being asked to go now</h2>
<p>Your employer may ask you to stay away from work, work from home or work somewhere else during notice. That is garden leave: GOV.UK says you get the same pay and contractual benefits, and nidirect adds that your contractual duties, such as confidentiality, carry on until notice ends and you can be called back. It is often used when you are going to a competitor.</p>
<p>Alternatively the employer may want you gone at once and offer a one-off payment instead of the remaining notice. GOV.UK says you can only get payment in lieu if it is in your contract or you agree to it; if you do not agree, you can work out your notice. The ${h.a('payment-in-lieu-of-notice', 'payment in lieu guide')} explains what the sum must cover and how it is taxed.</p>

<h2>Leaving early</h2>
<p>Not giving enough notice, or giving it verbally when the contract requires writing, may put you in breach of contract, and GOV.UK warns the employer could take you to court. In practice the claim is for the loss your early departure causes, which is often small, but restrictive covenants in the contract (for example, not working for a competitor or contacting clients for a period) are a separate matter: GOV.UK says the company could take you to court if you breach them. The safe route is a written agreement to a shorter notice.</p>

<h2>Holiday and your final pay</h2>
<p>Holiday interacts with notice in three ways. You can ask to take leave during notice, which brings your last working day forward without changing the date employment ends. Your employer can require you to take leave, if it gives the notice the Working Time Regulations require (see ${h.a('booking-holiday-notice', 'notice for booking holiday')}). And on the last day, any statutory leave you have accrued but not taken must be paid. If you have taken more leave than you have accrued, the employer can only deduct it from your final pay if that was agreed in writing beforehand.</p>
<p>In the example above, the leave year runs from 1 January and the employee leaves on ${h.date(quit.endDate)}, having taken 20 days. They have accrued ${h.num(hol.accrued, 1)} days, so ${h.num(hol.days, 1)} days are paid on leaving, worth ${h.gbp(hol.pay)} at ${h.gbp(600)} a week. The ${h.a('holiday-pay-when-leaving', 'holiday pay on leaving')} page has the calculator.</p>
`,
});
