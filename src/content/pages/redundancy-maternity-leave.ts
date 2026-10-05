import { definePage } from '../../lib/guide-types';
import { CAP_GB, FAMILY_RATE, P } from '../../lib/engine/params';
import { reckonerWeeks } from '../../lib/engine/redundancy';
import { smpSchedule } from '../../lib/engine/family';
import { addDays, addMonths } from '../../lib/engine/dates';
import { formatMoney, formatNumber } from '../../lib/format';

const g = (n: number, d = 0) => formatMoney(n, d);
const X = P.redundancyExtra;
const F = P.familyPay;
// Protected period: 18 months beginning with the day of birth, ending the day before the "relevant day".
const birth = '2026-03-10';
const protectedEnd = addDays(addMonths(birth, X.protectedPeriodMonths), -1);
// An office manager on maternity leave: redundancy pay on normal pay, SMP that keeps running.
const age = 36;
const years = 8;
const normal = 720;
const weeks = reckonerWeeks(age, years);
const onNormal = weeks * Math.min(normal, CAP_GB);
const onSmp = weeks * FAMILY_RATE;
const smp = smpSchedule(normal, '2026-03-01');

export default definePage({
  id: 'redundancy-maternity-leave',
  group: 'redundancy',
  order: 130,
  mini: 'maternityRedundancy',
  related: ['suitable-alternative-employment', 'statutory-maternity-pay', 'maternity-pay-calculator', 'statutory-redundancy-pay', 'redundancy-variable-pay'],
  sources: ['red_si2024_264', 'red_acasProtection', 'red_govOnLeave', 'red_hmrcSmpLeaver', 'red_acasPay', 'red_govStaffRedundant'],
  slug: 'redundancy-maternity-leave',
  nav: 'Redundancy and maternity leave',
  card: `The ${X.protectedPeriodMonths}-month protected period, priority for vacancies, SMP after the job ends and pay on normal earnings.`,
  title: `Redundancy on Maternity Leave 2026: ${X.protectedPeriodMonths}-Month Protection, SMP`,
  description: `Redundancy during pregnancy or maternity leave in 2026: priority for suitable jobs until ${X.protectedPeriodMonths} months after birth, SMP of ${g(FAMILY_RATE, 2)} kept, pay on normal earnings.`,
  h1: 'Redundancy during pregnancy and maternity leave',
  intro: 'Pregnancy and maternity leave do not stop a genuine redundancy, but they change who gets the next suitable job, which pay the redundancy is based on, and what happens to maternity pay.',
  resume: `An employee can be made redundant while pregnant or on maternity leave only if the redundancy is genuine and the choice has nothing to do with the pregnancy; selecting someone because of it is automatically unfair. In Great Britain she also has a right to be offered any suitable available vacancy before other employees, even better-qualified ones, under regulation 10 of the Maternity and Parental Leave etc. Regulations 1999. Since 6 April 2024 that protected period runs from the day the employer is told of the pregnancy until ${X.protectedPeriodMonths} months after the birth, covering the return to work as well as the leave; it ends early if employment ends. The offer must be of work that is suitable and on terms not substantially less favourable. If there is no vacancy, statutory redundancy pay is based on her normal weekly pay, capped at ${g(CAP_GB)}, never on Statutory Maternity Pay. SMP of up to ${F.smpWeeks} weeks, ${g(FAMILY_RATE, 2)} a week after the first ${F.smpHigherRateWeeks}, stays payable after the job ends if she qualified, and cannot be clawed back.`,
  faqs: [
    { q: 'When does redundancy protection start if I tell my employer I am pregnant?', a: `On the day your employer is informed of the pregnancy, for pregnancies notified on or after 6 April 2024. It then runs through maternity leave and continues until ${X.protectedPeriodMonths} months after the birth, or after the start of the expected week of childbirth if you never told your employer the actual date of birth. Telling your employer in writing gives you a clear start date.` },
    { q: `Does the ${X.protectedPeriodMonths}-month redundancy protection apply if I miscarry?`, a: `It depends on the timing. If a pregnancy ends before 24 weeks and there is no right to maternity leave, the protected period ends ${X.protectedPregnancyEndWeeks} weeks after the end of the pregnancy, under regulation 10(1A). Acas confirms that after a stillbirth from 24 weeks of pregnancy the protection continues to ${X.protectedPeriodMonths} months from the date of the birth, as for a live birth.` },
    { q: 'Is my redundancy pay worked out on my SMP if I am on maternity leave?', a: `No. Acas says that for an employee on maternity or other family leave, redundancy pay uses normal contractual gross weekly pay, not the reduced pay received during the leave. On ${g(normal)} a week, ${formatNumber(weeks, 1)} weeks of entitlement gives ${g(onNormal)}; using the SMP rate instead would wrongly give ${g(onSmp)}.` },
    { q: 'Will I still get maternity pay if I am made redundant during maternity leave?', a: 'Yes, if you already qualified. HMRC’s guidance for employers says that an employee who leaves can still be entitled to SMP whatever the reason for leaving, and the employer cannot ask for it to be repaid. The employer keeps paying the remaining weeks of the 39, though maternity leave itself ends with the employment.' },
    { q: 'Do these redundancy protections apply in Northern Ireland?', a: 'Not as described here. The 2024 Regulations amended the Maternity and Parental Leave etc. Regulations 1999, which apply in England, Wales and Scotland. Northern Ireland has separate maternity leave legislation that these changes did not touch, so do not assume the ${X.protectedPeriodMonths}-month period applies there; the Labour Relations Agency can advise on the Northern Ireland rules.' },
  ],
  body: (h) => `
<h2>The protected period, from first notice to ${X.protectedPeriodMonths} months</h2>
<p>The ${h.src('red_si2024_264', 'Maternity Leave, Adoption Leave and Shared Parental Leave (Amendment) Regulations 2024')} rewrote regulation 10 of the 1999 Regulations from ${h.date(X.protectedPeriodFrom)}. The right to priority for a suitable vacancy now applies during three back-to-back periods:</p>
<ol>
<li><strong>The protected period of pregnancy</strong>, from the day the employer is informed of the pregnancy until maternity leave starts;</li>
<li><strong>Statutory maternity leave</strong>, up to ${F.maternityLeaveWeeks} weeks;</li>
<li><strong>The additional protected period</strong>, from the day after maternity leave ends until ${X.protectedPeriodMonths} months after the birth, as long as employment continues.</li>
</ol>
<p>For a baby born on ${h.date(birth)} whose mother told her employer the date of birth, the protection lasts until ${h.date(protectedEnd)}. Someone who returns to work after twelve months is therefore protected for about six months more, which is the example GOV.UK gives (${h.src('red_govOnLeave', 'Employee rights when on leave')}). If the employer was never told the actual date of birth, the ${X.protectedPeriodMonths} months run from the first day of the expected week of childbirth.</p>
<p>The rules apply where the employer was informed of the pregnancy, or the maternity leave ended, on or after 6 April 2024. Acas notes that the protection ends when employment ends, so an employee made redundant at month fifteen does not keep the last three months (${h.src('red_acasProtection', 'Acas, Redundancy protection')}).</p>

<h2>What the priority means in practice</h2>
<p>Where there is a suitable available vacancy with the employer, a successor or an associated employer, the employee must be offered it before her current employment ends, to start as soon as the old contract ends. The new job must involve work that is suitable and appropriate for her, and its place, capacity and other terms must not be substantially less favourable than the old ones (regulation 10(2) and (3)). She does not have to compete for it, even against a colleague who would score higher.</p>
<p>The priority covers vacancies, not the jobs being cut. Acas’s example is an employer reducing twenty administration roles to ten: a pregnant employee goes through the same selection as everyone else for the ten remaining posts, because those are not vacancies. If the restructure creates new roles, for instance by merging two, those can be suitable vacancies she must be offered first. When several protected employees want the same post, the employer chooses on skills, knowledge and experience and should explain its criteria in writing.</p>
<p>Acas warns that failing to offer a suitable vacancy can make the dismissal automatically unfair, and for a pregnant employee or one on maternity leave it could also be discrimination.</p>

<h2>Redundancy pay on normal pay</h2>
<p>A week’s pay for redundancy is your normal contractual gross pay. ${h.src('red_acasPay', 'Acas')} states that redundancy pay during family-related leave is not based on what you were paid during the leave. The years on maternity leave count in full towards your service.</p>
${h.table(['Basis', 'Weekly figure', `Payment (${h.num(weeks, 1)} weeks)`], [
    ['Normal pay, capped (correct)', h.gbp(Math.min(normal, CAP_GB)), h.gbp(onNormal)],
    ['Flat SMP rate (wrong)', h.gbp(FAMILY_RATE, 2), h.gbp(onSmp)],
  ], `An office manager aged ${age} with ${years} complete years on ${h.gbp(normal)} a week. Weeks from the statutory age bands.`, ['l', 'r', 'r'])}

<h2>SMP after the job ends</h2>
<p>Redundancy ends maternity leave, because leave needs a contract. It does not end Statutory Maternity Pay. HMRC’s guidance says an employee who leaves may still qualify for SMP whatever the reason, and the employer cannot ask for it back (${h.src('red_hmrcSmpLeaver', 'SMP: employee circumstances that affect payment')}). If she leaves before the 11th week before the expected week of childbirth, the pay period starts on that week’s Sunday or the day after the birth, whichever is earlier; if she leaves after that, it starts the day after her last day.</p>
<p>For the office manager, whose SMP began on ${h.date('2026-03-01')}, the ${F.smpWeeks} weeks total ${h.gbp(smp.total, 2)}: ${F.smpHigherRateWeeks} weeks at ${h.pct(F.earningsShare, 0)} of earnings, then the lower of ${h.gbp(FAMILY_RATE, 2)} and ${h.pct(F.earningsShare, 0)}. Whatever remains when her job ends is still paid, on top of the redundancy payment and notice pay. The ${h.a('maternity-pay-calculator', 'maternity pay calculator')} lays out each week.</p>

<h2>Other leave with the same protection</h2>
<p>The same 2024 rules extend to adoption leave, to shared parental leave of at least ${X.protectedLeaveMinWeeks} continuous weeks, and Acas adds neonatal care leave and bereaved partner’s paternity leave. Shorter blocks of shared parental leave are protected only while the leave lasts. Ordinary paternity leave is not covered. The general rules on offers and trial periods are in ${h.a('suitable-alternative-employment', 'suitable alternative employment')}.</p>
`,
});
