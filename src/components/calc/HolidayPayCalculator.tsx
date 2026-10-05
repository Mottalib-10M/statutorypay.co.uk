import { useMemo } from 'react';
import NumberField from '../ui/NumberField';
import Toggle from '../ui/Toggle';
import { ResultCard, Actions, Frame, useUrlState } from './kit';
import { holidayPay, averageWeeksPay, entitlementDays } from '../../lib/engine/holiday';
import { P } from '../../lib/engine/params';
import { formatMoney, formatNumber } from '../../lib/format';

export default function HolidayPayCalculator({ methodHref }: { methodHref?: string }) {
  const [s, set] = useUrlState({ hours: 'regular', basic: 520, extraTotal: 3900, weeks: 52, dpw: 5, taken: 10 });
  const r = useMemo(() => {
    const extrasWeek = averageWeeksPay(s.extraTotal, s.weeks);
    return { extrasWeek, ...holidayPay({ basicWeek: s.basic, extrasWeek, daysPerWeek: s.dpw, daysTaken: s.taken, irregular: s.hours === 'irregular' }) };
  }, [s]);
  const ent = entitlementDays(s.dpw);
  const summary = () => `Holiday pay for ${formatNumber(s.taken, 1)} days: ${formatMoney(r.pay)} (a week's pay ${formatMoney(r.normalWeek)} at normal rate).`;
  return (
    <Frame>
      <form className="grid gap-x-4 gap-y-4 sm:grid-cols-2" onSubmit={(e) => e.preventDefault()}>
        <Toggle id="hp-hours" label="Working pattern" value={s.hours} onChange={(v) => set('hours', v)} options={[{ value: 'regular', label: 'Regular hours' }, { value: 'irregular', label: 'Irregular' }]} />
        <NumberField id="hp-dpw" label="Days worked per week" value={s.dpw} onChange={(v) => set('dpw', v)} unit="days" max={7} decimals={1} />
        <NumberField id="hp-basic" label="Basic pay for a normal week" value={s.basic} onChange={(v) => set('basic', v)} unit="£" max={100000} help="Contractual pay for the normal hours, gross" />
        <NumberField id="hp-extra" label="Regular overtime and commission, total" value={s.extraTotal} onChange={(v) => set('extraTotal', v)} unit="£" max={1000000} help="Paid over the weeks below; exclude one-off bonuses" />
        <NumberField id="hp-weeks" label="Paid weeks in the reference period" value={s.weeks} onChange={(v) => set('weeks', v)} unit="weeks" max={104} help="Up to 52 weeks in which you were paid" />
        <NumberField id="hp-taken" label="Days of holiday to price" value={s.taken} onChange={(v) => set('taken', v)} unit="days" max={60} decimals={1} />
      </form>
      <div className="mt-6">
        <ResultCard label={`Holiday pay for ${formatNumber(s.taken, 1)} days`} value={formatMoney(r.pay)} sub={`A day’s holiday pay: ${formatMoney(r.dayNormal, 2)} at normal rate`} methodHref={methodHref}
          lines={[
            { label: 'A week’s pay at normal rate (basic + regular extras)', value: formatMoney(r.normalWeek, 2), strong: true },
            { label: 'Average regular extras per week', value: formatMoney(r.extrasWeek, 2), share: r.normalWeek ? r.extrasWeek / r.normalWeek : 0 },
            { label: 'Days priced at normal rate', value: formatNumber(r.daysAtNormal, 1) },
            { label: s.hours === 'irregular' ? 'Days priced at basic rate (none for irregular hours)' : 'Days beyond 4 weeks, priced at basic rate', value: formatNumber(r.daysAtBasic, 1) },
            { label: `Pay for the full statutory year (${formatNumber(ent, 1)} days)`, value: formatMoney(r.annualPay) },
          ]}
          note={<p>Regular hours: the first {P.holiday.basicWeeks} weeks must include regular overtime, commission and seniority pay; the other {formatNumber(P.holiday.additionalWeeks, 1)} weeks may be paid at basic rate. Irregular-hours and part-year workers are paid at the normal rate for all leave. Your contract can be more generous.</p>} />
        <Actions summary={summary} />
      </div>
    </Frame>
  );
}
