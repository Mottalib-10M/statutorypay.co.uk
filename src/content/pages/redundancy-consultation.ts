import { definePage } from '../../lib/guide-types';
import { P } from '../../lib/engine/params';
import { addDays } from '../../lib/engine/dates';
import { formatMoney } from '../../lib/format';

const g = (n: number) => formatMoney(n);
const R = P.redundancy;
const X = P.redundancyExtra;
const awardNow = X.protectiveAwardMaxDays[X.protectiveAwardMaxDays.length - 1];
const awardBefore = X.protectiveAwardMaxDays[X.protectiveAwardMaxDays.length - 2].days;
// Timetables computed from a consultation start date.
const START = '2026-11-02';
const big = addDays(START, R.collectiveDays100plus);
const mid = addDays(START, R.collectiveDays20to99);
// What a maximum protective award is worth to someone on £560 a week (180 days = 180/7 weeks).
const weekly = 560;
const awardValue = (weekly / 7) * awardNow.days;

export default definePage({
  id: 'redundancy-consultation',
  group: 'redundancy',
  order: 90,
  mini: 'consultationDeadline',
  related: ['statutory-redundancy-pay', 'voluntary-redundancy', 'suitable-alternative-employment', 'redundancy-time-off-job-hunting', 'redundancy-pay-calculator'],
  sources: ['red_tulrca188', 'red_tulrca189', 'red_tulrca193', 'red_acasConsult', 'red_acasCollective', 'red_govStaffRedundant', 'red_govHr1'],
  slug: 'redundancy-consultation',
  nav: 'Redundancy consultation',
  card: `Collective consultation at ${R.collectiveThreshold20} and ${R.collectiveThreshold100} redundancies, form HR1 and the ${awardNow.days}-day protective award.`,
  title: `Redundancy Consultation 2026: ${R.collectiveDays20to99} or ${R.collectiveDays100plus} Days, HR1, Award`,
  description: `Redundancy consultation in 2026: ${R.collectiveDays20to99} days for ${R.collectiveThreshold20} to 99 job losses, ${R.collectiveDays100plus} days for ${R.collectiveThreshold100} or more, form HR1, and a protective award of up to ${awardNow.days} days’ pay each.`,
  h1: 'Redundancy consultation: individual, collective and the protective award',
  intro: 'Before anyone is dismissed for redundancy the employer has to talk, and once ${R.collectiveThreshold20} jobs are in play the law sets the timetable and the price of skipping it.',
  resume: `Collective consultation is compulsory when an employer proposes to dismiss ${R.collectiveThreshold20} or more employees as redundant at one establishment within ${X.collectiveWindowDays} days or less, under section 188 of the Trade Union and Labour Relations (Consolidation) Act 1992. It must start at least ${R.collectiveDays20to99} days before the first dismissal takes effect for ${R.collectiveThreshold20} to 99 proposed redundancies, and at least ${R.collectiveDays100plus} days before for ${R.collectiveThreshold100} or more. The employer consults a recognised trade union or, where there is none, elected employee representatives, about ways to avoid the dismissals, reduce their number and soften their effect, aiming for agreement. It must also file form HR1 with the Redundancy Payments Service by the same deadlines and before any notice of dismissal goes out. If it fails to consult, a tribunal can order a protective award: since 6 April 2026 up to ${awardNow.days} days’ pay for each affected employee, twice the earlier ${awardBefore}, with no two-year service condition. Below ${R.collectiveThreshold20} redundancies the law sets no minimum period, but a fair dismissal still needs individual consultation.`,
  faqs: [
    { q: `Does the ${R.collectiveDays20to99}-day consultation period mean I cannot be given notice for ${R.collectiveDays20to99} days?`, a: `No. The ${R.collectiveDays20to99} or ${R.collectiveDays100plus} days run from the start of consultation to the day the first dismissal takes effect, not to the day notice is handed out. GOV.UK tells employers to issue redundancy notices once consultation is complete. Your notice then runs on top, so your last day is usually later than the end of the minimum period.` },
    { q: `Are volunteers counted towards the ${R.collectiveThreshold20} redundancies that trigger collective consultation?`, a: 'Yes. Acas says the count includes people who volunteer and people the employer plans to redeploy into other roles, so a proposal for 22 redundancies needs collective consultation even if 6 of those staff volunteer. Fixed-term employees whose agreed term is simply ending are left out, as are employees already covered by a separate consultation.' },
    { q: 'Who can claim a protective award if my employer did not consult?', a: 'Section 189 lets the recognised trade union bring the claim where union representatives were bypassed, the employee representatives concerned where they were, and affected or dismissed employees in other cases, including failures over the election of representatives. Acas notes that no minimum length of service is needed to share in the award.' },
    { q: 'How many representatives must be elected for a redundancy consultation?', a: 'The law does not fix a number. Acas says the employer must make sure there are enough to represent the affected employees, and that anyone affected can stand or vote. Section 188A requires fair arrangements, a vote open to every affected employee and, as far as reasonably practicable, a secret ballot with the votes accurately counted.' },
    { q: 'Can my employer skip consultation if the company is insolvent?', a: 'Only where there are special circumstances that made full consultation not reasonably practicable, and even then it must do as much as it reasonably can. Acas says a sudden, unexpected insolvency may qualify, but financial trouble the employer had seen coming for some time is unlikely to. It is for the employer to prove the defence at the tribunal.' },
  ],
  body: (h) => `
<h2>Below ${R.collectiveThreshold20}: individual consultation</h2>
<p>When fewer than ${R.collectiveThreshold20} redundancies are proposed at an establishment, no statute sets a timetable. That does not make consultation optional. Acas expects the employer to inform and consult each person at risk individually, with at least one private meeting, before any decision is final (${h.src('red_acasConsult', 'Acas, How your employer must consult')}). A dismissal made without it is likely to be unfair even if the redundancy is genuine. You can ask to bring a companion; Acas notes the employer might not agree, though your contract or the employer’s policy may give you that right.</p>

<h2>From ${R.collectiveThreshold20}: the collective rules</h2>
<p>${h.src('red_tulrca188', 'Section 188')} applies when the employer proposes to dismiss as redundant ${R.collectiveThreshold20} or more employees at one establishment within ${X.collectiveWindowDays} days or less. An establishment is the unit to which employees are assigned, which can be a whole company or a distinct site within it. Three small sites each losing a dozen jobs may fall below the threshold one by one; Acas warns that staggering cuts to avoid it can lead to a protective award (${h.src('red_acasCollective', 'Acas, Collective consultation')}).</p>
${h.table(['Proposed redundancies at one establishment', 'Consultation must begin', 'HR1 must reach the RPS', `Example: consultation from ${h.date(START)}`], [
    [`Under ${R.collectiveThreshold20}`, 'No statutory minimum', 'Not required', 'Individual consultation only'],
    [`${R.collectiveThreshold20} to 99`, `At least ${R.collectiveDays20to99} days before the first dismissal`, `At least ${R.collectiveDays20to99} days before, and before any notice`, `First dismissal on or after ${h.date(mid)}`],
    [`${R.collectiveThreshold100} or more`, `At least ${R.collectiveDays100plus} days before the first dismissal`, `At least ${R.collectiveDays100plus} days before, and before any notice`, `First dismissal on or after ${h.date(big)}`],
  ], 'TULRCA 1992 ss.188(1A) and 193; dates computed from the start date in the heading.', ['l', 'l', 'l', 'l'])}

<h3>Who is consulted</h3>
<p>If the employer recognises an independent trade union for the employees concerned, it consults the union’s representatives. Otherwise it may use existing employee representatives with authority to be consulted on redundancies, or arrange an election. Affected employees can vote and stand. If they are invited to elect representatives and fail to do so within a reasonable time, section 188(7B) makes the employer give the written information to each affected employee instead. Representatives must be given access to the staff they represent and appropriate accommodation and facilities (section 188(5A)).</p>

<h3>What must be put in writing</h3>
<p>Section 188(4) lists what the representatives must receive in writing:</p>
<ul>
<li>the reasons for the proposals;</li>
<li>the numbers and descriptions of employees it proposes to dismiss, and the total of each description employed;</li>
<li>the proposed method of selection;</li>
<li>the proposed method of carrying out the dismissals, including the period over which they take effect;</li>
<li>how any redundancy payments other than the statutory ones will be calculated;</li>
<li>the number of agency workers in use, where they work and the type of work they do.</li>
</ul>
<p>Consultation must cover ways of avoiding the dismissals, reducing the numbers and mitigating the consequences, and be carried out “with a view to reaching agreement”. Agreement is not required, but going through the motions after the decision is made does not count.</p>

<h2>Form HR1</h2>
<p>${h.src('red_tulrca193', 'Section 193')} adds a duty to tell the Secretary of State, in practice the Redundancy Payments Service, through the online HR1 form (${h.src('red_govHr1', 'GOV.UK, HR1 guidance')}). The form goes in before any notice of dismissal is given and at least ${R.collectiveDays20to99} or ${R.collectiveDays100plus} days before the first dismissal. A copy goes to the representatives being consulted. One form is needed per site with ${R.collectiveThreshold20} or more proposed redundancies, though a multi-site division managed as one may file a single form with a list of sites. Failing to notify without good cause is a criminal offence for the company and its officers, punishable by a fine. The notice also lets Jobcentre Plus offer help to the staff affected.</p>

<h2>The protective award</h2>
<p>A tribunal that upholds a complaint of failure to consult can order the employer to pay “remuneration for the protected period” to each employee in the group (${h.src('red_tulrca189', 'section 189')}). The protected period starts on the earlier of the first dismissal and the date of the award, and lasts as long as the tribunal finds just and equitable given how serious the failure was, up to a maximum. That maximum doubled on ${h.date(awardNow.from)}, from ${awardBefore} to ${awardNow.days} days, under the Employment Rights Act 2025.</p>
<p>Section 190 pays a week’s pay for each week of the protected period, pro rata for part weeks. For a sense of scale: an employee on ${h.gbp(weekly)} a week who receives the full ${awardNow.days}-day award is owed about ${h.gbp(awardValue)}. The award is separate from redundancy pay and from notice pay, and Acas confirms it does not depend on two years’ service.</p>
<p>The complaint must be presented before the last of the dismissals takes effect or within six months of that date, unless that was not reasonably practicable. Early conciliation through Acas comes first.</p>

<h2>Your part in the process</h2>
<ul>
<li>Ask for the written reasons and the selection criteria, and check your scores.</li>
<li>Raise alternatives: reduced hours, ${h.a('voluntary-redundancy', 'voluntary redundancy')}, redeployment into a ${h.a('suitable-alternative-employment', 'suitable vacancy')}.</li>
<li>Once notice is given, use your right to ${h.a('redundancy-time-off-job-hunting', 'paid time off to look for work')}.</li>
<li>Note the dates: consultation start, notice, last day. They decide your payment, which the ${h.a('redundancy-pay-calculator', 'calculator')} works out.</li>
</ul>
`,
});
