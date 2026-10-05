import { useMemo } from 'react';
import NumberField from '../ui/NumberField';
import SelectField from '../ui/SelectField';
import { DateField, ResultCard, Actions, Frame, useUrlState } from './kit';
import { computeSsp } from '../../lib/engine/ssp';
import { P } from '../../lib/engine/params';
import { formatMoney, formatNumber, displayDate } from '../../lib/format';

const d = (iso: string) => displayDate(iso, 'en-GB');
export const PATTERNS: Record<string, { label: string; days: number[] }> = {
  mf: { label: 'Monday to Friday', days: [1, 2, 3, 4, 5] },
  ms: { label: 'Monday to Saturday', days: [1, 2, 3, 4, 5, 6] },
  all: { label: 'Every day', days: [0, 1, 2, 3, 4, 5, 6] },
  mt: { label: 'Monday to Thursday', days: [1, 2, 3, 4] },
  mw: { label: 'Monday to Wednesday', days: [1, 2, 3] },
  ts: { label: 'Tuesday to Saturday', days: [2, 3, 4, 5, 6] },
  we: { label: 'Saturday and Sunday', days: [0, 6] },
  one: { label: 'One day (Monday)', days: [1] },
};

export default function SspCalculator({ methodHref }: { methodHref?: string }) {
  const [s, set] = useUrlState({ awe: 480, pat: 'mf', from: '2026-10-12', to: '2026-10-23', paid: 0 });
  const r = useMemo(() => computeSsp({ awe: s.awe, pattern: (PATTERNS[s.pat] ?? PATTERNS.mf).days, firstDay: s.from, lastDay: s.to, alreadyPaidDays: s.paid }), [s]);
  const summary = () => `SSP: ${formatMoney(r.total, 2)} for ${r.paidDays} qualifying days (weekly rate ${formatMoney(r.weeklyRate, 2)}).`;
  return (
    <Frame>
      <form className="grid gap-x-4 gap-y-4 sm:grid-cols-2" onSubmit={(e) => e.preventDefault()}>
        <NumberField id="ssp-awe" label="Average gross weekly earnings" value={s.awe} onChange={(v) => set('awe', v)} unit="£" max={100000} help="Usually the 8 weeks before the first day off sick" />
        <SelectField id="ssp-pat" label="Days you normally work" value={s.pat} onChange={(v) => set('pat', v)} options={Object.entries(PATTERNS).map(([value, p]) => ({ value, label: p.label }))} />
        <DateField id="ssp-from" label="First day off sick" value={s.from} onChange={(v) => set('from', v)} help="On or after 6 April 2026" />
        <DateField id="ssp-to" label="Last day off sick" value={s.to} onChange={(v) => set('to', v)} />
        <NumberField id="ssp-paid" label="SSP days already paid in a linked spell" value={s.paid} onChange={(v) => set('paid', v)} unit="days" max={200} help="Spells 8 weeks or less apart count together" />
      </form>
      <div className="mt-6">
        {!r.supported ? (
          <ResultCard label="Statutory Sick Pay" value="—" sub={s.from < P.ssp.reformDate ? `This calculator applies the rules for sickness starting on or after 6 April 2026. Earlier spells had ${P.ssp.pre2026.waitingDays} waiting days, a ${formatMoney(P.ssp.pre2026.lel)} earnings threshold and a ${formatMoney(P.ssp.pre2026.weeklyRate, 2)} rate.` : 'Check the dates and the working pattern.'} methodHref={methodHref} />
        ) : (
          <ResultCard label={`Statutory Sick Pay for ${r.paidDays} qualifying day${r.paidDays === 1 ? '' : 's'}`} value={formatMoney(r.total, 2)} sub={`Weekly rate ${formatMoney(r.weeklyRate, 2)}: ${r.rule === 'flat' ? 'the flat rate' : `80% of ${formatMoney(s.awe, 2)}`}; ${formatMoney(r.dailyRate, 4)} a day`} methodHref={methodHref}
            lines={[
              ...r.weeks.map((w) => ({ label: `Week ending ${d(w.weekEnding)} (${w.days} day${w.days === 1 ? '' : 's'})`, value: formatMoney(w.amount, 2), share: r.total ? w.amount / r.total : 0 })),
              { label: `Days left of the ${P.ssp.maxWeeks}-week limit`, value: `${formatNumber(r.remainingDays)} of ${formatNumber(r.maxDays)}`, strong: true },
              ...(r.exhaustedOn ? [{ label: 'SSP runs out on', value: d(r.exhaustedOn), tone: 'red' as const }] : []),
            ]}
            note={<p>Paid from the first day you would have worked, with no waiting days (Employment Rights Act 2025, in force 6 April 2026, Great Britain and Northern Ireland). {r.fitNoteNeeded ? 'Off more than 7 days in a row: your employer can ask for a fit note.' : 'Up to 7 days: you can self-certify.'}</p>} />
        )}
        <Actions summary={summary} />
      </div>
    </Frame>
  );
}
