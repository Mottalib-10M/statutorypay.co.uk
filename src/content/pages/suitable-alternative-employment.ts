import { definePage } from '../../lib/guide-types';
import { CAP_GB, P } from '../../lib/engine/params';
import { computeRedundancy } from '../../lib/engine/redundancy';
import { addDays, addWeeks } from '../../lib/engine/dates';
import { formatMoney } from '../../lib/format';

const g = (n: number) => formatMoney(n);
const R = P.redundancy;
const X = P.redundancyExtra;
// A depot clerk offered a role at another site: old job ends Friday 27 November 2026.
const oldEnd = '2026-11-27';
const newStart = '2026-11-30';
const trialEnd = addDays(addWeeks(newStart, R.trialPeriodWeeks), -1);
const latestStart = addWeeks(oldEnd, X.renewalGapWeeks);
const atStake = computeRedundancy({ dob: '1979-09-03', start: '2012-04-16', noticeGiven: '2026-09-04', end: oldEnd, weeklyPay: 585 });
// Retraining extension agreed in writing: eight extra weeks.
const retrainEnd = addDays(addWeeks(newStart, R.trialPeriodWeeks + 8), -1);

export default definePage({
  id: 'suitable-alternative-employment',
  group: 'redundancy',
  order: 120,
  mini: 'trialPeriodEnd',
  related: ['statutory-redundancy-pay', 'redundancy-maternity-leave', 'redundancy-relevant-date', 'redundancy-consultation', 'redundancy-pay-calculator'],
  sources: ['red_era138', 'red_era141', 'govRedundancy', 'red_govStaffRedundant', 'red_acasAlternative'],
  slug: 'suitable-alternative-employment',
  nav: 'Suitable alternative employment',
  card: `Offers of another job, the ${R.trialPeriodWeeks}-week trial and when refusing costs you redundancy pay.`,
  title: `Suitable Alternative Employment 2026: the ${R.trialPeriodWeeks}-Week Trial Rule`,
  description: `Suitable alternative employment in 2026: valid offers, the ${R.trialPeriodWeeks}-week trial, retraining extensions and when a refusal loses redundancy pay of up to ${g(R.maxYears * 1.5 * CAP_GB)}.`,
  h1: 'Suitable alternative employment: offers, trials and refusals',
  intro: 'An offer of another job can end a redundancy before it starts, or cost you the payment if you turn it down without good reason.',
  resume: `Suitable alternative employment is another job, with your employer or an associated one, offered before your current contract ends and starting within ${X.renewalGapWeeks} weeks of it. If you accept, you are not treated as dismissed and no redundancy pay is due. If you unreasonably refuse an offer that is suitable for you, section 141 of the Employment Rights Act 1996 removes your statutory redundancy pay. Two questions decide it: is the job suitable, judged on the work, pay and benefits, status, hours, place and your skills, and is your refusal reasonable, judged on your own circumstances such as health, travel and family. Where the new job differs from the old, you have a statutory trial period of ${R.trialPeriodWeeks} weeks from the day you start, extendable only by a written retraining agreement made before you start that states its end date. Leaving within the trial for a good reason keeps your redundancy pay, counted to the end of the original job. Pregnant employees and those on, or back from, maternity, adoption or longer shared parental leave must be offered a suitable vacancy before anyone else.`,
  faqs: [
    { q: 'Do I lose my redundancy pay if I turn down another job with my employer?', a: `Only if the job is suitable and your refusal is unreasonable. A job on lower pay, with a much harder journey, or that your health or caring responsibilities rule out can be refused without losing anything. Acas advises telling the employer in writing why the job is not suitable; if it disagrees and withholds the payment, a tribunal decides. You have ${R.claimMonths} months from the relevant date.` },
    { q: 'Can I try out the new job without losing redundancy pay?', a: `Yes. When the terms or place differ from your old job, the law gives you a trial of ${R.trialPeriodWeeks} weeks beginning on the day you start the new contract. If you leave during it, or the employer ends it because of the differences, you are treated as dismissed for redundancy on the day the old contract ended. Stay beyond the trial and the right is gone.` },
    { q: 'How long can a redundancy trial period be extended for retraining?', a: `As long as you and the employer agree, but only for retraining and only through a written agreement made before you start the new job. Section 138(6) requires it to state the date the retraining ends and the terms that will apply afterwards. A verbal promise of “a few more weeks”, or a letter signed after you start, leaves you with the ordinary ${R.trialPeriodWeeks} weeks.` },
    { q: 'Do I have to apply and interview for an alternative vacancy?', a: 'No. GOV.UK’s employer guide says the job must actually be offered to the employee, who should not have to apply. Acas adds that where several people at risk want the same post, the employer must first offer it to those with special protection, such as pregnant employees, and then run a fair process, which may include interviews, for everyone else.' },
    { q: 'My employer offered a job that starts two months after my current one ends. What then?', a: `Then it is not an offer that can cost you your redundancy pay. Section 141 only bites on offers made before your employment ends to start immediately or within ${X.renewalGapWeeks} weeks of the end. Acas says that if the alternative role does not start within ${X.renewalGapWeeks} weeks you still qualify as redundant and should receive the payment.` },
  ],
  body: (h) => `
<h2>What makes an offer count</h2>
<p>Under ${h.src('red_era141', 'section 141')}, an offer to renew your contract or re-engage you can affect your redundancy pay only if it is made before your employment ends and the new job starts immediately or within ${X.renewalGapWeeks} weeks. GOV.UK’s employer guide adds what a valid offer looks like (${h.src('red_govStaffRedundant', 'Making staff redundant')}):</p>
<ul>
<li>unconditional and in writing;</li>
<li>made before the current contract ends;</li>
<li>showing how the new job differs from the old one;</li>
<li>actually offered to you, not a vacancy you must apply for;</li>
<li>starting within ${X.renewalGapWeeks} weeks of the old job ending.</li>
</ul>
<p>For the depot clerk in our example, whose job ends on ${h.date(oldEnd)}, any alternative must start by ${h.date(latestStart)} to count.</p>

<h2>Suitable, and reasonable to refuse</h2>
<p>The law asks two separate questions. The first is about the job: how close it is to your current one, its terms, the pay including benefits, status, hours and location, and whether your skills fit it (${h.src('govRedundancy', 'GOV.UK')}). The second is about you: given your circumstances, was it reasonable to say no? A job can be suitable on paper and still reasonable for you to refuse. Acas gives examples of good reasons: lower pay, health conditions that rule out the work, difficulty getting there because of a longer journey, higher cost or no public transport, and disruption to family life (${h.src('red_acasAlternative', 'Acas, Suitable alternative employment')}).</p>
<p>Check your contract for a mobility clause. If it lets the employer move you to other sites, refusing a job only because of its location carries more risk. If the employer has a suitable vacancy and does not offer it to you, the redundancy itself may be unfair.</p>

<h2>The trial period</h2>
<p>When the new job’s capacity, place or terms differ from the old ones, ${h.src('red_era138', 'section 138')} gives you a trial period. It starts when the old employment ends and runs until the end of ${R.trialPeriodWeeks} weeks beginning with the day you start work under the new contract.</p>
${h.table(['Step', 'Date'], [
    ['Old job ends', h.date(oldEnd)],
    ['New job starts', h.date(newStart)],
    [`Last day of the ${R.trialPeriodWeeks}-week trial`, h.date(trialEnd)],
    ['With a written retraining agreement for 8 extra weeks', h.date(retrainEnd)],
  ], 'Dates computed from the start of the new job.', ['l', 'l'])}
<p>If you end the new contract during the trial, for whatever reason, or the employer ends it because of the differences, section 138(4) treats you as dismissed on the date the old contract ended, for the original redundancy reason. Your service and age are counted to that day, so the clerk keeps the right to ${h.gbp(atStake.amount)} for ${atStake.countedYears} years. If you leave because the job is unsuitable, say so in writing during the trial: GOV.UK warns that the right is lost if you do not give notice within it. Acas adds that you can leave at any point in the trial without extra notice, and that if you are offered more than one job, each can be tried for ${R.trialPeriodWeeks} weeks.</p>
<p>Leaving during the trial is not automatically safe. If the new job was suitable and your decision to end it was unreasonable, section 141(4) removes the payment in the same way as an unreasonable refusal.</p>

<h3>Extending the trial for retraining</h3>
<p>Only one kind of extension counts: a period of retraining agreed between you, or your representative, and the employer before you start the new job, in writing, stating when the retraining ends and the terms and conditions that will apply after it (section 138(6)). An informal extension does not protect you: after the ${R.trialPeriodWeeks} weeks you are taken to have accepted the job.</p>

<h2>Priority for pregnancy and family leave</h2>
<p>Some employees must be offered a suitable vacancy ahead of colleagues who might be better candidates. GOV.UK’s employer guide lists those who are pregnant, on or returning from maternity or adoption leave, and on shared parental leave or returning from at least ${X.protectedLeaveMinWeeks} continuous weeks of it. For births and placements covered by the 2024 rules, the priority runs until ${X.protectedPeriodMonths} months after the birth or placement. The ${h.a('redundancy-maternity-leave', 'maternity leave and redundancy guide')} sets out the dates.</p>

<h2>Bumping</h2>
<p>Where there is no vacancy, an employer may sometimes move a person at risk into a colleague’s role, and the colleague is made redundant instead. Acas calls this bumping. The bumped employee is dismissed for redundancy and has the same rights to consultation, a fair process and redundancy pay as anyone else.</p>
`,
});
