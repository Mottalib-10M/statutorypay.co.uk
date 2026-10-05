import { useMemo } from 'react';
import NumberField from '../ui/NumberField';
import SelectField from '../ui/SelectField';
import { DateField, ResultCard, Actions, Frame, useUrlState } from './kit';
import { computeRedundancy } from '../../lib/engine/redundancy';
import { formatMoney, formatNumber, displayDate } from '../../lib/format';

const d = (iso: string) => displayDate(iso, 'en-GB');
const wk = (n: number) => `${formatNumber(n, n % 1 ? 1 : 0)} week${n === 1 ? '' : 's'}`;

export default function RedundancyCalculator({ methodHref, compact = false }: { methodHref?: string; compact?: boolean }) {
  const [s, set] = useUrlState({ n: 'GB', dob: '1979-05-14', start: '2011-09-05', notice: '2026-10-01', end: '2026-12-24', pay: 640 });
  const r = useMemo(() => computeRedundancy({ dob: s.dob, start: s.start, noticeGiven: s.notice, end: s.end, weeklyPay: s.pay, jurisdiction: s.n === 'NI' ? 'NI' : 'GB' }), [s]);
  const total = r.weeks || 1;
  const summary = () => `Statutory redundancy pay: ${formatMoney(r.amount, 2)} (${wk(r.weeks)} × ${formatMoney(r.weekUsed, 2)}), ${r.countedYears} years counted, relevant date ${d(r.relevantDate)}.`;
  return (
    <Frame>
      <form className="grid gap-x-4 gap-y-4 sm:grid-cols-2" onSubmit={(e) => e.preventDefault()}>
        <NumberField id="rp-pay" label="Gross weekly pay" value={s.pay} onChange={(v) => set('pay', v)} unit="£" max={100000} help="Before tax. If it varies, the average of the 12 weeks before notice" />
        <SelectField id="rp-n" label="Where you work" value={s.n} onChange={(v) => set('n', v)} options={[{ value: 'GB', label: 'England, Wales or Scotland' }, { value: 'NI', label: 'Northern Ireland' }]} />
        <DateField id="rp-dob" label="Date of birth" value={s.dob} onChange={(v) => set('dob', v)} />
        <DateField id="rp-start" label="First day of continuous employment" value={s.start} onChange={(v) => set('start', v)} />
        <DateField id="rp-notice" label="Day notice of dismissal was given" value={s.notice} onChange={(v) => set('notice', v)} help="If dismissed without notice, the dismissal date" />
        <DateField id="rp-end" label="Last day of employment" value={s.end} onChange={(v) => set('end', v)} help="End of notice, or the dismissal date if paid in lieu" />
      </form>
      <div className="mt-6">
        {r.reason === 'dates' ? (
          <ResultCard label="Check the dates" value="—" sub="Birth, start, notice and last day must follow each other in that order." />
        ) : !r.eligible ? (
          <ResultCard label="Statutory redundancy pay" value={formatMoney(0)} sub={`Not due: ${r.completeYears} complete year${r.completeYears === 1 ? '' : 's'} of service on ${d(r.extendedDate)}, two are needed.`}
            lines={r.nextYearOn ? [{ label: 'Two years would be reached by a relevant date of', value: d(r.nextYearOn) }] : []} methodHref={methodHref} />
        ) : (
          <ResultCard label="Statutory redundancy pay" value={formatMoney(r.amount)} sub={`${wk(r.weeks)} × ${formatMoney(r.weekUsed, Number.isInteger(r.weekUsed) ? 0 : 2)}${r.capped ? ` (weekly pay capped at ${formatMoney(r.cap)})` : ''}`} methodHref={methodHref}
            lines={[
              { label: `Years at age 41 or over (× 1.5)`, value: `${r.byBand.oneHalf} → ${wk(r.byBand.oneHalf * 1.5)}`, share: (r.byBand.oneHalf * 1.5) / total },
              { label: `Years at age 22 to 40 (× 1)`, value: `${r.byBand.one} → ${wk(r.byBand.one)}`, share: r.byBand.one / total },
              { label: `Years under 22 (× 0.5)`, value: `${r.byBand.half} → ${wk(r.byBand.half * 0.5)}`, share: (r.byBand.half * 0.5) / total },
              { label: 'Complete years of service (20 counted at most)', value: `${r.completeYears} (${r.countedYears} counted)` },
              { label: `Weekly cap in force on ${d(r.relevantDate)} (${s.n === 'NI' ? 'NI' : 'GB'})`, value: formatMoney(r.cap) },
              { label: 'Claim in writing no later than', value: d(r.claimDeadline) },
            ]}
            note={<>
              {r.extended
                ? <p>Your employment ends before the {wk(r.statutoryNoticeWeeks)} of statutory notice would have run out, so service and age are counted to <strong>{d(r.extendedDate)}</strong> (Employment Rights Act 1996, s.145(5)). The cap still follows the real last day.</p>
                : <p>Statutory notice owed: {wk(r.statutoryNoticeWeeks)}. Service and age are counted to {d(r.relevantDate)}.</p>}
              {r.nextYearOn && <p className="mt-1">One more complete year would be reached on {d(r.nextYearOn)}.</p>}
            </>} />
        )}
        {r.eligible && !compact && (
          <details className="mt-4 rounded-lg border border-navy-200 px-4 py-3 text-sm">
            <summary className="cursor-pointer font-medium text-navy-800">Year-by-year count, from the relevant date backwards</summary>
            <div className="mt-3 overflow-x-auto"><table className="w-full text-sm journal"><thead><tr><th scope="col" className="py-1 pr-3 text-left">Year of employment</th><th scope="col" className="py-1 pr-3 text-right">Age at its start</th><th scope="col" className="py-1 text-right">Weeks</th></tr></thead>
              <tbody>{r.lines.map((l) => <tr key={l.from} className="border-t border-navy-100"><td className="py-1 pr-3">{d(l.from)} to {d(l.to)}</td><td className="tabular-nums py-1 pr-3 text-right">{l.age}</td><td className="tabular-nums py-1 text-right">{formatNumber(l.weeks, 1)}</td></tr>)}</tbody></table></div>
          </details>
        )}
        <Actions summary={summary} />
      </div>
    </Frame>
  );
}
