import { useMemo } from 'react';
import NumberField from '../ui/NumberField';
import { DateField, ResultCard, Actions, Frame, useUrlState } from './kit';
import { ScheduleTable, d, gbp } from './family-ui';
import { adoptionDates, smpSchedule } from '../../lib/engine/family';
import { addDays, addWeeks } from '../../lib/engine/dates';
import { FAMILY_RATE } from '../../lib/engine/params';
import { formatMoney } from '../../lib/format';

export default function AdoptionCalculator({ methodHref }: { methodHref?: string }) {
  const [s, set] = useUrlState({ match: '2026-11-12', place: '2026-12-07', emp: '2025-02-03', pay: 610 });
  const r = useMemo(() => {
    const a = adoptionDates(s.match);
    const service = s.emp <= a.startedBy, earnings = s.pay >= a.lel;
    const earliest = addDays(s.place, -14);
    return { a, service, earnings, earliest, sch: smpSchedule(s.pay, s.place), leaveEnd: addDays(addWeeks(s.place, 52), -1) };
  }, [s]);
  const ok = r.service && r.earnings;
  const summary = () => `Statutory Adoption Pay: ${ok ? gbp(r.sch.total) : 'not due'}, leave from ${d(s.place)}.`;
  return (
    <Frame>
      <form className="grid gap-x-4 gap-y-4 sm:grid-cols-2" onSubmit={(e) => e.preventDefault()}>
        <DateField id="ad-match" label="Told you were matched on" value={s.match} onChange={(v) => set('match', v)} />
        <DateField id="ad-place" label="Leave and pay start on" value={s.place} onChange={(v) => set('place', v)} help="Up to 14 days before placement (UK adoption)" />
        <DateField id="ad-emp" label="Started with this employer on" value={s.emp} onChange={(v) => set('emp', v)} help={`For pay: on or before ${d(r.a.startedBy)}`} />
        <NumberField id="ad-pay" label="Average gross weekly earnings" value={s.pay} onChange={(v) => set('pay', v)} unit="£" max={100000} />
      </form>
      <div className="mt-6">
        <ResultCard label="Statutory Adoption Pay, 39 weeks" value={ok ? gbp(r.sch.total) : 'Not due'} sub={ok ? `6 weeks at ${gbp(r.sch.weeks[0].amount, 2)}, then up to ${gbp(FAMILY_RATE, 2)} a week` : !r.service ? `26 weeks with the employer by ${d(r.a.mwEnd)} are needed` : `Earnings below the ${formatMoney(r.a.lel)} lower earnings limit`} methodHref={methodHref}
          lines={[
            { label: 'Matching week', value: `${d(r.a.mwStart)} to ${d(r.a.mwEnd)}` },
            { label: 'Adoption leave (no qualifying period for employees)', value: `${d(s.place)} to ${d(r.leaveEnd)}`, strong: true },
            { label: 'Tell your employer within 7 days of the match, by', value: d(addDays(s.match, 7)) },
          ]}>
          {ok && <ScheduleTable schedule={r.sch} title="Week-by-week schedule" />}
        </ResultCard>
        <Actions summary={summary} />
      </div>
    </Frame>
  );
}
