import { definePage } from '../../lib/guide-types';
import { CAP_GB, P } from '../../lib/engine/params';
import { computeRedundancy } from '../../lib/engine/redundancy';
import { formatMoney } from '../../lib/format';

const g = (n: number) => formatMoney(n);
const R = P.redundancy;
// Three situations, each computed by the engine (RECETTE §17.4).
// 1. Contractual notice longer than the statutory minimum, worked in full.
const worked = computeRedundancy({ dob: '1969-04-22', start: '2014-03-10', noticeGiven: '2026-09-01', end: '2026-12-01', weeklyPay: 690 });
// 2. Paid in lieu a few days before the second anniversary.
const twoYear = computeRedundancy({ dob: '1996-07-30', start: '2024-10-20', noticeGiven: '2026-10-14', end: '2026-10-14', weeklyPay: 540 });
// 3. Paid in lieu with nine complete years: statutory notice adds a tenth.
const tenth = computeRedundancy({ dob: '1980-01-15', start: '2016-11-01', noticeGiven: '2026-10-20', end: '2026-10-20', weeklyPay: 610 });
const tenthWorked = computeRedundancy({ dob: '1980-01-15', start: '2016-11-01', noticeGiven: '2026-10-20', end: tenth.extendedDate, weeklyPay: 610 });

export default definePage({
  id: 'redundancy-relevant-date',
  group: 'redundancy',
  order: 50,
  mini: 'relevantDateExtension',
  related: ['redundancy-pay-calculator', 'payment-in-lieu-of-notice', 'statutory-notice-period', 'redundancy-pay-cap', 'redundancy-variable-pay', 'suitable-alternative-employment'],
  sources: ['era145', 'era155', 'era162', 'era86', 'acasRedundancyPay', 'red_acasPay'],
  slug: 'redundancy-relevant-date',
  nav: 'The relevant date',
  card: 'Section 145 in practice: the day that fixes your years, your age and your cap.',
  title: 'Redundancy Relevant Date 2026: Notice, PILON and s.145(5)',
  description: `Redundancy relevant date in 2026: the day notice ends fixes the ${g(CAP_GB)} cap, while pay in lieu adds up to ${P.notice.maxWeeks} weeks of statutory notice to your service and age.`,
  h1: 'The relevant date for redundancy pay, case by case',
  intro: 'Every statutory redundancy figure is measured on one day; the law calls it the relevant date and gives it two versions.',
  resume: `The relevant date is the day from which statutory redundancy pay is counted, defined by section 145 of the Employment Rights Act 1996. If you are dismissed with notice, it is the day the notice runs out; if the contract ends without notice, including with a payment in lieu, it is the day the termination takes effect; at the end of a fixed-term contract it is the day the term expires. Section 145(5) then adds a second, later date: when the employer gives less than the statutory minimum notice of one week per complete year, up to ${P.notice.maxWeeks}, the relevant date for the two-year qualifying test and for counting years and ages becomes the day that statutory notice would have ended. The weekly cap of ${g(CAP_GB)} and the ${R.claimMonths}-month time limit stay on the first date. With pay in lieu at nine years and some months, the extension can add a tenth year and with it a week or more of pay.`,
  faqs: [
    { q: 'Is the relevant date the same as the effective date of termination?', a: 'Usually the two fall on the same day, but they belong to different parts of the Act. The effective date of termination in section 97 governs unfair dismissal; the relevant date in section 145 governs redundancy payments. Each has its own extension rule, and a tribunal handling both claims applies each date to its own claim.' },
    { q: 'My employer let me go early during my notice. Which date counts?', a: 'If the employer shortened the notice it gave, the contract ends on the earlier day, and that becomes the relevant date under section 145(2). But section 145(5) still measures from the day notice was first given: if statutory notice from that day runs later, your years and age are counted to that later day. Keep the original letter showing when notice was given.' },
    { q: 'What happens to the relevant date if I resign during my redundancy notice?', a: 'If you give written counter-notice to leave earlier, within the obligatory notice period, you are still treated as dismissed for redundancy under section 136(3). Section 145(3) then makes the relevant date the day your own notice expires. Your employer can object in writing; if you leave anyway, a tribunal decides how much of the payment you keep.' },
    { q: 'Does statutory notice extend the date if my contract notice is already longer?', a: `No. The extension only applies when the notice actually given is shorter than the statutory minimum, which is a week for each complete year up to ${P.notice.maxWeeks}. If you work a three-month contractual notice and statutory notice would be ten weeks, the relevant date is simply the end of the three months.` },
    { q: 'How do I find the relevant date if I took a trial in a new job and it did not work out?', a: 'Under section 145(4), when a trial period in a renewed or new contract ends in dismissal, the relevant date for working out the payment is the end of the original contract, not the end of the trial. Your years and age are therefore counted to the day the old job ended, before you started trying the new one.' },
  ],
  body: (h) => `
<h2>The basic rule in section 145(2)</h2>
<p>The ${h.src('era145', 'Act')} gives three answers depending on how the employment ends:</p>
<ul>
<li><strong>Dismissal with notice</strong>, by the employer or by the employee: the date the notice expires.</li>
<li><strong>Dismissal without notice</strong>, including a payment in lieu with immediate effect: the date the termination takes effect.</li>
<li><strong>A limited-term contract</strong> that ends when its term or task runs out and is not renewed: the date it ends.</li>
</ul>
<p>The date is a calendar day, not a payroll date. It does not move because the final payslip arrives later or because holiday pay is settled weeks after.</p>

<h2>The second date in section 145(5)</h2>
<p>Where the employer ends the contract and the notice required by ${h.src('era86', 'section 86')}, “if duly given on the material date”, would expire later than the basic relevant date, “for the purposes of sections 155, 162(1)” the later date is used. The material date is the day the employer gave notice, or, if it gave none, the day it terminated the contract. In plain terms: count the statutory notice from the day you were told, and if it ends after your real last day, your service and your age are measured to its end.</p>
<p>Three things use the extended date: the two-year qualifying test (${h.src('era155', 'section 155')}), the number of complete years, and your age in each year (${h.src('era162', 'section 162(1)')}). Two things stay on the basic date: the weekly cap and the ${R.claimMonths}-month time limit for claiming.</p>

<h2>Three cases, worked out</h2>
<h3>Long notice, worked in full</h3>
<p>A warehouse supervisor who started on ${h.date('2014-03-10')} is given three months’ contractual notice on ${h.date('2026-09-01')}. Statutory notice would be ${worked.statutoryNoticeWeeks} weeks, ending earlier than the contract notice, so there is no extension. The relevant date is ${h.date(worked.relevantDate)}; ${worked.countedYears} years are counted, worth ${h.num(worked.weeks, 1)} weeks and ${h.gbp(worked.amount)} at ${h.gbp(690)} a week.</p>
<h3>Paid in lieu, six days short of two years</h3>
<p>An employee who started on ${h.date('2024-10-20')} is dismissed with pay in lieu on ${h.date(twoYear.relevantDate)}. On that day the service is one year and fifty-one weeks. The one week of statutory notice runs to ${h.date(twoYear.extendedDate)}, which passes the second anniversary: ${twoYear.eligible ? `the employee qualifies, with ${h.gbp(twoYear.amount)}` : 'the employee still does not qualify'}.</p>
<h3>Paid in lieu with nine years and eleven months</h3>
<p>Someone who started on ${h.date('2016-11-01')} is paid in lieu on ${h.date(tenth.relevantDate)}. They have nine complete years, so statutory notice is ${tenth.statutoryNoticeWeeks} weeks and ends on ${h.date(tenth.extendedDate)}, after the tenth anniversary. The payment counts ${tenth.countedYears} years: ${h.gbp(tenth.amount)}. Had the employee worked the same notice to that day the result would be identical, ${h.gbp(tenthWorked.amount)}, which is the point of the rule: pay in lieu cannot be used to shave a year off.</p>
${h.table(['Case', 'Relevant date', 'Extended date', 'Years counted', 'Statutory pay'], [
    ['Contract notice worked', h.date(worked.relevantDate), worked.extended ? h.date(worked.extendedDate) : 'No extension', worked.countedYears, h.gbp(worked.amount)],
    ['Pay in lieu near 2 years', h.date(twoYear.relevantDate), h.date(twoYear.extendedDate), twoYear.eligible ? twoYear.countedYears : 0, h.gbp(twoYear.amount)],
    ['Pay in lieu at 9 years', h.date(tenth.relevantDate), h.date(tenth.extendedDate), tenth.countedYears, h.gbp(tenth.amount)],
  ], 'Each line computed with the site’s redundancy engine from the dates given in the text.', ['l', 'l', 'l', 'r', 'r'])}

<h2>Special cases with their own date</h2>
<p>Three other provisions replace the basic rule. If you serve counter-notice to leave early during the employer’s notice, the relevant date is the expiry of your own notice (section 145(3)). If you start a trial in an alternative job and it ends, the payment is measured to the end of the original contract (section 145(4)), a point covered in ${h.a('suitable-alternative-employment', 'suitable alternative employment')}. And if you claim after a long lay-off or short time, section 153 sets the relevant date at the end of the last week of lay-off counted in your claim.</p>

<h2>Why the date also matters for a week’s pay</h2>
<p>The 12-week average used for variable pay ends with a calculation date that is tied to the relevant date: section 226 places it where statutory notice would have been given had it expired on the relevant date. Where section 145(5) applies, the unextended relevant date is used instead. The detail is in ${h.a('redundancy-variable-pay', 'redundancy pay when your pay varies')}.</p>
<p>When you check your employer’s figures, write down the day notice was given, the day it ends and your start date, then let the ${h.a('redundancy-pay-calculator', 'calculator')} find both dates. Acas’s own example matches this approach: ${h.src('red_acasPay', 'eight years and eleven months with pay in lieu becomes nine years and one month')}.</p>
`,
});
