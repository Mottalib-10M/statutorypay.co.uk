import { definePage } from '../../lib/guide-types';
import { P } from '../../lib/engine/params';
import { weeklySsp } from '../../lib/engine/ssp';
import { formatMoney } from '../../lib/format';

const S = P.ssp;
const g = (n: number, d = 0) => formatMoney(n, d);
// Three typical scheme shapes against the statutory minimum, 16 weeks off at £700 a week.
const pay = 700, off = 16, ssp = weeklySsp(pay);
const statutory = ssp * off;
const schemes: Array<[string, number, number]> = [['No scheme: SSP only', 0, 0], ['4 weeks full pay, then SSP', 4, 0], ['8 weeks full pay, 8 weeks half pay', 8, 8], ['26 weeks full pay', 26, 0]];
const value = (full: number, half: number) => {
  let total = 0;
  for (let w = 1; w <= off; w++) total += w <= full ? pay : w <= full + half ? Math.max(pay / 2, ssp) : ssp;
  return total;
};

export default definePage({
  id: 'company-sick-pay-vs-ssp',
  group: 'sickness',
  order: 60,
  mini: 'companySick',
  related: ['statutory-sick-pay', 'statutory-sick-pay-calculator', 'fit-note-rules', 'ssp-linked-periods', 'enhanced-maternity-pay'],
  sources: ['govEmployerSsp', 'govSsp', 'acasSsp', 'hmrcRates'],
  slug: 'company-sick-pay-vs-ssp',
  nav: 'Company sick pay and SSP',
  card: 'How an occupational sick pay scheme sits on top of the statutory minimum.',
  title: `Company Sick Pay vs SSP 2026: What the Contract Adds`,
  description: `Company sick pay vs SSP in 2026: a scheme can pay more but never less than ${g(S.weeklyRate, 2)} a week or 80% of pay; how full and half pay weeks combine with SSP.`,
  h1: 'Company sick pay against Statutory Sick Pay',
  intro: 'Occupational schemes, the floor beneath them, and what to look for in your contract when you are off for weeks.',
  resume: `Statutory Sick Pay is the legal minimum; company sick pay, also called occupational or contractual sick pay, is whatever your employer has promised on top of it in your contract or staff handbook. A common pattern is a number of weeks on full pay followed by weeks on half pay, often growing with length of service. The scheme can be as generous as the employer likes but cannot leave you below SSP, which is ${g(S.weeklyRate, 2)} a week, or 80% of your normal weekly earnings if that is lower, paid from the first qualifying day for up to ${S.maxWeeks} weeks. Most schemes count the SSP they owe as part of what they pay, so you do not receive both in full. Unlike family pay, SSP cannot be recovered from HMRC by the employer. Read the scheme for its conditions: notification rules, fit notes, service thresholds and what happens once the enhanced weeks run out.`,
  faqs: [
    { q: 'Do I get company sick pay and SSP on top of each other?', a: 'Usually not. Most schemes say that the company payment includes any SSP due, so a week on full pay is your normal pay, not normal pay plus SSP. Your contract or handbook decides; the only legal rule is that the total for each qualifying day cannot fall below the SSP you are owed.' },
    { q: 'Can a company scheme require a year of service before it pays?', a: 'Yes, for the enhanced part. Employers can set service conditions for their own scheme, so a new starter may get only SSP for the first months. Since April 2026 that floor itself starts on the first day of sickness, whatever the length of service, and cannot be delayed by the scheme.' },
    { q: 'My scheme pays half pay after four weeks. Can half pay be less than SSP?', a: `For a low earner it can, and then the employer must top it up to SSP. At ${g(200)} a week, half pay is ${g(100)} while SSP is ${g(weeklySsp(200), 2)} a week, so ${g(weeklySsp(200), 2)} is the minimum for each full week of sickness, until the ${S.maxWeeks} weeks are used.` },
    { q: 'Can my employer withdraw company sick pay if I miss a return-to-work meeting?', a: 'If the scheme makes enhanced pay conditional on following the sickness procedure, it may be withheld under the contract. Statutory Sick Pay cannot be withheld for that reason, only for late notification without good reason or because a condition of SSP itself is not met.' },
  ],
  body: (h) => `
<h2>Four schemes over the same absence</h2>
<p>An employee earning ${h.gbp(pay)} a week is off sick for ${off} weeks. Statutory Sick Pay alone gives ${h.gbp(ssp, 2)} a week, ${h.gbp(statutory)} in total. The table compares that with three common scheme shapes, assuming the scheme includes SSP rather than adding to it and never pays less than SSP in a week.</p>
${h.table(['Scheme', `Total for ${off} weeks`, 'Above the statutory minimum'], schemes.map(([label, full, half]) => [label, h.gbp(value(full, half)), h.gbp(value(full, half) - statutory)]), 'Gross amounts before tax and National Insurance.', ['l', 'r', 'r'])}
<p>The difference between schemes is far larger than any change in the statutory rate. That is why the sickness clause in a job offer is worth reading as closely as the salary.</p>

<h2>What a scheme usually sets</h2>
<ul>
<li><strong>How long and how much</strong>: weeks on full pay and on half pay, often in bands by length of service, and whether the allowance is counted over a rolling twelve months or per spell.</li>
<li><strong>Whether SSP is included</strong>: the usual wording is that company sick pay is “inclusive of” SSP.</li>
<li><strong>Conditions</strong>: reporting by a set time, fit notes, keeping in touch, attending occupational health appointments.</li>
<li><strong>Exclusions</strong>: injuries from dangerous sports or second jobs, absences during a disciplinary process, probation periods.</li>
<li><strong>Discretion</strong>: some schemes leave payment to the manager’s discretion, which makes the right harder to enforce; a contractual scheme can be enforced like wages.</li>
</ul>

<h2>The statutory floor under every scheme</h2>
<p>Whatever the scheme says, each week of sickness must carry at least the SSP you are entitled to. Since 6 April 2026 that floor starts on the first qualifying day and has no minimum earnings, so a scheme that used to start paying on day four, or excluded staff below the old earnings limit, now sits below the law for those days and must pay SSP (${h.a('ssp-changes-april-2026', 'the April 2026 changes')}). When the scheme’s enhanced weeks run out, SSP continues until ${S.maxWeeks} weeks have been paid in the period of sickness, counting linked spells (${h.a('ssp-linked-periods', 'linked periods')}).</p>

<h2>Reading your payslip during a long absence</h2>
<p>Payroll software often shows sick pay on two lines: “SSP” and “OSP” or “company sick pay top-up”. Add them for each week and compare with the scheme: the total should match full or half pay for the weeks the scheme covers, and never fall below the SSP line once the enhanced weeks are over. Monthly payslips mix weeks, so count qualifying days rather than calendar weeks. Three errors come up again and again: SSP paid at the flat rate to someone whose earnings call for the 80% figure, which overpays under the 2026 rules; half pay paid without the SSP top-up for a low earner; and SSP stopped when the company scheme ends although statutory weeks remain. A share link from the ${h.a('statutory-sick-pay-calculator', 'calculator')} with your dates gives your employer the exact figures to check against.</p>

<h2>Tax, pension and holiday while off sick</h2>
<p>Company sick pay and SSP are both earnings: income tax and National Insurance are deducted in the usual way through payroll. Workplace pension contributions are usually calculated on what you are actually paid, so a long spell on SSP lowers them. Statutory holiday keeps building up throughout the absence, whatever you are paid, and you can ask to take paid holiday instead of sick pay, for instance when a scheme has run out, but your employer cannot make you.</p>

<h2>When the money stops</h2>
<p>A scheme that has run out does not end the job, and the end of SSP does not either. Before dismissing someone for long-term sickness, GOV.UK says an employer must look at a return to work, consult the employee and consider alternatives such as different hours or duties. If SSP is ending while you are still ill, form SSP1 lets you claim Universal Credit or Employment and Support Allowance. For your own dates, the ${h.a('statutory-sick-pay-calculator', 'Statutory Sick Pay calculator')} gives the statutory part week by week.</p>
`,
});
