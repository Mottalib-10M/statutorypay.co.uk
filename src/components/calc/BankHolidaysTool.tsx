import { useMemo } from 'react';
import NumberField from '../ui/NumberField';
import SelectField from '../ui/SelectField';
import { DateField, ResultCard, Actions, Frame, useUrlState } from './kit';
import { bankHolidaysBetween, bankHolidayProRata, entitlementDays, leaveYearContaining, type Nation } from '../../lib/engine/holiday';
import { addDays, addYears } from '../../lib/engine/dates';
import { formatNumber, displayDate } from '../../lib/format';

const d = (iso: string) => displayDate(iso, 'en-GB');
const NAMES: Record<Nation, string> = { 'england-and-wales': 'England and Wales', scotland: 'Scotland', 'northern-ireland': 'Northern Ireland' };

export default function BankHolidaysTool({ methodHref }: { methodHref?: string }) {
  const [s, set] = useUrlState({ nation: 'england-and-wales', ys: '2026-01-01', dpw: 3 });
  const r = useMemo(() => {
    const from = s.ys, to = addDays(addYears(s.ys, 1), -1);
    const list = bankHolidaysBetween(s.nation as Nation, from, to);
    const known = to <= '2027-12-31';
    return { from, to, list, known, ent: entitlementDays(s.dpw), share: bankHolidayProRata(list.length, s.dpw) };
  }, [s]);
  const summary = () => `${NAMES[s.nation as Nation]}: ${r.list.length} bank holidays between ${d(r.from)} and ${d(r.to)}.`;
  return (
    <Frame>
      <form className="grid gap-x-4 gap-y-4 sm:grid-cols-2" onSubmit={(e) => e.preventDefault()}>
        <SelectField id="bh-n" label="Nation" value={s.nation} onChange={(v) => set('nation', v)} options={Object.entries(NAMES).map(([value, label]) => ({ value, label }))} />
        <DateField id="bh-ys" label="Leave year starts on" value={s.ys} onChange={(v) => set('ys', v)} help="Bank holidays published up to the end of 2027" />
        <NumberField id="bh-dpw" label="Days worked per week" value={s.dpw} onChange={(v) => set('dpw', v)} unit="days" max={7} decimals={1} />
      </form>
      <div className="mt-6">
        <ResultCard label={`Bank holidays in this leave year, ${NAMES[s.nation as Nation]}`} value={String(r.list.length)} sub={`${d(r.from)} to ${d(r.to)}${r.known ? '' : ' (dates after 2027 are not published yet)'}`} methodHref={methodHref}
          lines={[
            { label: 'Your statutory holiday (5.6 weeks, bank holidays can be inside it)', value: `${formatNumber(r.ent, 1)} days` },
            { label: 'Pro-rata share if your employer gives bank holidays on top', value: `${formatNumber(r.share, 1)} days`, strong: true },
          ]}>
          <ul className="mt-3 grid gap-1 text-sm sm:grid-cols-2">{r.list.map(([day, name]) => <li key={day} className="tabular-nums text-navy-800">{d(day)} · {name}</li>)}</ul>
        </ResultCard>
        <Actions summary={summary} />
      </div>
    </Frame>
  );
}
