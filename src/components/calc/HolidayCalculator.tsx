import { useMemo } from 'react';
import NumberField from '../ui/NumberField';
import SelectField from '../ui/SelectField';
import { DateField, ResultCard, Actions, Frame, useUrlState } from './kit';
import { entitlementDays, entitlementHours, entitlementShifts, proRataDays, ceilTo } from '../../lib/engine/holiday';
import { P } from '../../lib/engine/params';
import { formatNumber, displayDate } from '../../lib/format';

const d = (iso: string) => displayDate(iso, 'en-GB');
const f1 = (x: number) => formatNumber(ceilTo(x, 0.1), 1).replace(/\.0$/, '');

export default function HolidayCalculator({ methodHref }: { methodHref?: string }) {
  const [s, set] = useUrlState({ basis: 'days', dpw: 3, hpw: 22.5, shifts: 4, cycle: 8, part: 'full', ys: '2026-01-01', start: '2026-06-15', leave: '2026-11-20' });
  const r = useMemo(() => {
    const days = entitlementDays(s.dpw);
    const hours = entitlementHours(s.hpw, s.dpw);
    const shifts = entitlementShifts(s.shifts, s.cycle);
    const pr = proRataDays({ daysPerWeek: s.dpw, yearStart: s.ys, start: s.part === 'started' || s.part === 'both' ? s.start : undefined, leave: s.part === 'left' || s.part === 'both' ? s.leave : undefined });
    return { days, hours, shifts, pr };
  }, [s]);
  const frac = r.pr.fraction;
  const hoursPart = s.part === 'full' ? r.hours : s.part === 'started' && s.dpw > 0 ? r.pr.shown * s.hpw / s.dpw : r.hours * frac;
  const head = s.basis === 'hours' ? `${f1(hoursPart)} hours` : s.basis === 'shifts' ? `${f1(r.shifts * (s.part === 'full' ? 1 : frac))} shifts` : `${f1(s.part === 'full' ? r.days : r.pr.shown)} days`;
  const summary = () => `Statutory holiday: ${head} (${s.part === 'full' ? 'full leave year' : `${formatNumber(frac * 100, 1)}% of the leave year`}).`;
  return (
    <Frame>
      <form className="grid gap-x-4 gap-y-4 sm:grid-cols-2" onSubmit={(e) => e.preventDefault()}>
        <SelectField id="hl-basis" label="Work out the entitlement in" value={s.basis} onChange={(v) => set('basis', v)} options={[{ value: 'days', label: 'Days worked per week' }, { value: 'hours', label: 'Hours worked per week' }, { value: 'shifts', label: 'Shifts in a repeating pattern' }]} />
        <SelectField id="hl-part" label="Leave year" value={s.part} onChange={(v) => set('part', v)} options={[{ value: 'full', label: 'Worked the whole year' }, { value: 'started', label: 'Started part way through' }, { value: 'left', label: 'Leaving part way through' }, { value: 'both', label: 'Started and leaving in the same year' }]} />
        {s.basis === 'shifts' ? (<>
          <NumberField id="hl-shifts" label="Shifts in the pattern" value={s.shifts} onChange={(v) => set('shifts', v)} unit="shifts" max={100} />
          <NumberField id="hl-cycle" label="Length of the pattern" value={s.cycle} onChange={(v) => set('cycle', v)} unit="days" max={365} help="4 on, 4 off = 4 shifts in 8 days" />
        </>) : (<>
          <NumberField id="hl-dpw" label="Days worked per week" value={s.dpw} onChange={(v) => set('dpw', v)} unit="days" max={7} decimals={1} />
          {s.basis === 'hours' ? <NumberField id="hl-hpw" label="Hours worked per week" value={s.hpw} onChange={(v) => set('hpw', v)} unit="hours" max={100} decimals={1} /> : <span aria-hidden="true" />}
        </>)}
        {s.part !== 'full' && <DateField id="hl-ys" label="Leave year starts on" value={s.ys} onChange={(v) => set('ys', v)} help="From the contract; otherwise your start date" />}
        {(s.part === 'started' || s.part === 'both') && <DateField id="hl-start" label="Start date" value={s.start} onChange={(v) => set('start', v)} />}
        {(s.part === 'left' || s.part === 'both') && <DateField id="hl-leave" label="Last day of work" value={s.leave} onChange={(v) => set('leave', v)} />}
      </form>
      <div className="mt-6">
        <ResultCard label={s.part === 'full' ? 'Statutory holiday for a full leave year' : 'Statutory holiday for this leave year'} value={head} methodHref={methodHref}
          lines={[
            ...(s.basis === 'days' || s.part !== 'full' ? [{ label: 'Full-year entitlement in days', value: `${f1(r.days)} days`, share: r.days / P.holiday.maxDays }] : []),
            ...(s.basis === 'hours' ? [{ label: 'Full-year entitlement in hours', value: `${f1(r.hours)} hours` }] : []),
            ...(s.basis === 'shifts' ? [{ label: 'Average shifts a week (capped at 5)', value: formatNumber(Math.min(s.cycle > 0 ? s.shifts / s.cycle * 7 : 0, 5), 2) }] : []),
            ...(s.part !== 'full' ? [{ label: `Share of the leave year (${d(r.pr.leaveYear.start)} to ${d(r.pr.leaveYear.end)})`, value: `${formatNumber(frac * 100, 1)}%` }] : []),
            { label: 'Legal ceiling', value: `${P.holiday.maxDays} days` },
          ]}
          note={<p>{s.part === 'started' ? 'For a starter the figure is rounded up to the next half day, as on GOV.UK.' : s.part !== 'full' ? 'For a leaver the exact share of the year is shown; anything not taken is paid on the last payslip.' : 'Bank holidays can be counted inside these 5.6 weeks.'} Irregular hours or part-year work in Great Britain: use the 12.07% accrual calculator instead.</p>} />
        <Actions summary={summary} />
      </div>
    </Frame>
  );
}
