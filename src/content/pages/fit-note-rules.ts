import { definePage } from '../../lib/guide-types';
import { P } from '../../lib/engine/params';

const S = P.ssp;

export default definePage({
  id: 'fit-note-rules',
  group: 'sickness',
  order: 50,
  mini: 'fitNote',
  related: ['statutory-sick-pay', 'ssp-linked-periods', 'company-sick-pay-vs-ssp', 'statutory-sick-pay-calculator'],
  sources: ['govTakingSick', 'govEmployerSsp', 'govSsp', 'acasSsp'],
  slug: 'fit-note-rules',
  nav: 'Fit notes and self-certification',
  card: 'When you need a fit note, who can sign it and what “may be fit” means.',
  title: `Fit Note Rules 2026: 7 Days Self-Certified, Then Proof`,
  description: `Fit note rules in 2026: self-certify up to ${S.fitNoteAfterDays} days, then a fit note from a GP, nurse, pharmacist or therapist, free after 7 days; a late note cannot stop SSP.`,
  h1: 'Fit notes: when you need one and what it changes',
  intro: 'Seven days on your own word, then medical evidence: who can sign it, what the two boxes mean, and how it affects sick pay.',
  resume: `An employee who is off sick for ${S.fitNoteAfterDays} days or fewer in a row does not need medical evidence: the employer can ask you to confirm the absence yourself, which is called self-certification. Once the absence goes beyond ${S.fitNoteAfterDays} calendar days, weekends and bank holidays included, the employer can ask for a fit note (the statement of fitness for work, still often called a sick note). It can be issued, after an assessment, by a GP or hospital doctor, a registered nurse, a pharmacist, an occupational therapist or a physiotherapist, on paper or digitally, and it is free once you have been ill for more than seven days. The note says either that you are not fit for work or that you may be fit for work with changes. A late fit note does not allow the employer to withhold Statutory Sick Pay, which since April 2026 starts on the first day of sickness.`,
  faqs: [
    { q: 'My fit note says I may be fit for work. Do I have to go back?', a: 'Only if you and your employer agree the changes it suggests, such as shorter hours, lighter duties or a phased return. If the changes cannot be made or are not agreed, GOV.UK says you must be treated as not fit for work, and the note covers your absence and your sick pay as before.' },
    { q: 'Can my employer insist on a doctor’s note for a two-day absence?', a: `They can ask you to self-certify, often on a form or by email, but a fit note is only required after ${S.fitNoteAfterDays} days in a row. A healthcare professional may charge for a note covering seven days or less, and the employer cannot refuse Statutory Sick Pay for that period simply because no note was produced.` },
    { q: 'Is a pharmacist’s fit note as valid as one from my GP?', a: 'Yes. Since the rules were widened, pharmacists, registered nurses, occupational therapists and physiotherapists can certify fitness for work after assessing you, in the same form and with the same effect as a doctor. The employer should not treat the note differently because of who signed it.' },
    { q: 'What is an AHP Health and Work Report?', a: 'A report written by an allied health professional, such as a paramedic, podiatrist, dietitian or speech and language therapist, describing what you can and cannot do at work. Your employer may accept it instead of a fit note if they agree, but it cannot be used to claim Employment and Support Allowance.' },
  ],
  body: (h) => `
<h2>The seven-day line</h2>
<p>The count runs in calendar days from the first day of sickness, not in working days. Someone who falls ill on a Thursday and comes back the following Thursday has been off seven days, weekends included, and needs no fit note. One more day and the employer can ask for one. Self-certification itself is not a legal form: GOV.UK leaves it to employer and employee to agree how it is done, typically a short form on return or an email listing the dates and the reason.</p>
<p>The calculator above shows which side of the line an absence falls and whether the note should be free. It is a check on proof, not on pay: Statutory Sick Pay depends on your qualifying days and earnings, which the ${h.a('statutory-sick-pay-calculator', 'sick pay calculator')} works out.</p>

<h2>Who can issue a fit note</h2>
<ul>
<li>a GP or a hospital doctor;</li>
<li>a registered nurse;</li>
<li>a pharmacist;</li>
<li>an occupational therapist;</li>
<li>a physiotherapist.</li>
</ul>
<p>Each of them must assess your fitness for work before signing; a note cannot be issued on request without that assessment. Physiotherapists and occupational therapists can choose between a fit note and an AHP Health and Work Report depending on what you need. The original stays with you; the employer may take a copy. Digital fit notes are as valid as paper ones.</p>

<h2>“Not fit” and “may be fit”</h2>
<p>A fit note has two outcomes. “Not fit for work” covers you for the period stated. “May be fit for work taking into account the following advice” is the more interesting one: the professional can tick a phased return, amended duties, altered hours or workplace adaptations, and add comments. It is advice to the employer, not an instruction. The employer should discuss it with you; if nothing can be put in place, you are treated as not fit and stay on sick leave. If you are disabled, the duty to make reasonable adjustments under the Equality Act sits alongside the note and goes further.</p>

<h2>Fit notes and Statutory Sick Pay</h2>
<p>Your employer can ask for a fit note only for absences of more than seven days. It cannot hold back SSP because the note arrives late. What can cost you SSP is reporting the sickness late: an employer can set a deadline, or seven days if none is set, and need not pay for the days before you told them unless you had a good reason. Since 6 April 2026 SSP is paid from the first day off, so a short self-certified absence of two or three days now carries pay as well (${h.a('ssp-changes-april-2026', 'what changed in April 2026')}).</p>
<p>For long absences, the dates on successive fit notes also build the record you will need if SSP runs out after ${S.maxWeeks} weeks and you claim Employment and Support Allowance or Universal Credit with form SSP1. Gaps between notes make that claim harder, so ask for the next one before the current one ends.</p>

<h2>Company policies and occupational health</h2>
<p>A contract or sickness policy can ask for more, such as a return-to-work interview or a referral to occupational health, and a company sick pay scheme can make its own enhanced pay conditional on following those steps (${h.a('company-sick-pay-vs-ssp', 'company sick pay against SSP')}). It cannot make Statutory Sick Pay depend on a fit note for the first seven days. If your employer pays for a private medical report, you have the right to see it before it is sent under the Access to Medical Reports Act 1988 when it comes from a doctor who has treated you; ask Acas if the request seems excessive.</p>

<h2>Holidays and sickness</h2>
<p>If you fall ill just before or during booked holiday, you can ask to treat those days as sick leave and take the holiday later; the employer may ask for evidence in the usual way, self-certification for up to seven days, a fit note beyond. Holiday keeps building up while you are off sick, and leave you could not take because of illness can be carried over (${h.a('holiday-during-sick-leave', 'holiday during sick leave')}).</p>
`,
});
