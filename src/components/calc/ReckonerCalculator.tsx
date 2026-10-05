import { useMemo } from 'react';
import NumberField from '../ui/NumberField';
import SelectField from '../ui/SelectField';
import { ResultCard, Actions, Frame, useUrlState } from './kit';
import { reckonerWeeks } from '../../lib/engine/redundancy';
import { CAP_GB, CAP_NI, P } from '../../lib/engine/params';
import { formatMoney, formatNumber } from '../../lib/format';

export default function ReckonerCalculator({ methodHref }: { methodHref?: string }) {
  const [s, set] = useUrlState({ n: 'GB', age: 47, years: 16, pay: 700 });
  const cap = s.n === 'NI' ? CAP_NI : CAP_GB;
  const years = Math.min(s.years, P.redundancy.maxYears);
  const weeks = s.years >= P.redundancy.qualifyingYears ? reckonerWeeks(s.age, years) : 0;
  const week = Math.min(s.pay, cap);
  const amount = useMemo(() => weeks * week, [weeks, week]);
  const summary = () => `Age ${s.age}, ${s.years} years: ${formatNumber(weeks, 1)} weeks × ${formatMoney(week, 2)} = ${formatMoney(amount)}.`;
  return (
    <Frame>
      <form className="grid gap-x-4 gap-y-4 sm:grid-cols-2" onSubmit={(e) => e.preventDefault()}>
        <NumberField id="rk-age" label="Age on the relevant date" value={s.age} onChange={(v) => set('age', v)} unit="years" max={99} />
        <NumberField id="rk-years" label="Complete years of service" value={s.years} onChange={(v) => set('years', v)} unit="years" max={60} help="Only the last 20 count" />
        <NumberField id="rk-pay" label="Gross weekly pay" value={s.pay} onChange={(v) => set('pay', v)} unit="£" max={100000} />
        <SelectField id="rk-n" label="Where you work" value={s.n} onChange={(v) => set('n', v)} options={[{ value: 'GB', label: `Great Britain (cap ${formatMoney(CAP_GB)})` }, { value: 'NI', label: `Northern Ireland (cap ${formatMoney(CAP_NI)})` }]} />
      </form>
      <div className="mt-6">
        <ResultCard label="Statutory redundancy pay" value={formatMoney(amount)} sub={s.years < P.redundancy.qualifyingYears ? 'Under two complete years: no statutory redundancy pay.' : `${formatNumber(weeks, 1)} weeks of pay at ${formatMoney(week, 2)}`} methodHref={methodHref}
          lines={[
            { label: 'Weeks from the age × service table', value: formatNumber(weeks, 1), strong: true },
            { label: 'Years counted', value: String(s.years >= P.redundancy.qualifyingYears ? years : 0) },
            { label: 'Weekly pay used', value: `${formatMoney(week, 2)}${s.pay > cap ? ' (capped)' : ''}` },
          ]} note={<p>The table counts each year back from your age on the relevant date, one year younger each time, as the official ready reckoner does. For exact dates (birthday close to the start of a year of service, notice not given in full) use the full calculator.</p>} />
        <Actions summary={summary} />
      </div>
    </Frame>
  );
}
