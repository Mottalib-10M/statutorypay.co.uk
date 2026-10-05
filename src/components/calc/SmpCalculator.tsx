import { useMemo } from 'react';
import NumberField from '../ui/NumberField';
import Toggle from '../ui/Toggle';
import { DateField, ResultCard, Actions, Frame, useUrlState } from './kit';
import { ScheduleTable, d, gbp } from './family-ui';
import { computeSmp } from '../../lib/engine/family';
import { FAMILY_RATE, P } from '../../lib/engine/params';
import { formatMoney } from '../../lib/format';

export default function SmpCalculator({ methodHref, kind = 'smp' }: { methodHref?: string; kind?: 'smp' | 'ma' }) {
  const [s, set] = useUrlState({ mode: 'week', pay: 560, due: '2027-03-15', leave: '2027-02-28', emp: '2024-04-01' });
  const awe = s.mode === 'year' ? s.pay / 52 : s.pay;
  const r = useMemo(() => computeSmp({ dueDate: s.due, leaveStart: s.leave, awe, employmentStart: s.emp }), [s, awe]);
  const sch = r.schedule;
  const summary = () => `SMP: ${gbp(sch.total)} over 39 weeks (6 × ${gbp(sch.weeks[0]?.amount ?? 0, 2)}, then up to ${gbp(FAMILY_RATE, 2)} a week), from ${d(s.leave)} to ${d(sch.lastDay)}.`;
  const why: Record<string, string> = { earnings: `average weekly earnings below the ${formatMoney(r.dates.lel)} lower earnings limit`, service: `employment must have started by ${d(r.dates.startedBy)}`, leaveTooEarly: `leave cannot start before ${d(r.dates.earliestLeave)}` };
  return (
    <Frame>
      <form className="grid gap-x-4 gap-y-4 sm:grid-cols-2" onSubmit={(e) => e.preventDefault()}>
        <Toggle id="smp-mode" label="Enter your pay" value={s.mode} onChange={(v) => { set('mode', v); set('pay', v === 'year' ? Math.round(s.pay * 52) : Math.round(s.pay / 52)); }} options={[{ value: 'week', label: 'Per week' }, { value: 'year', label: 'Per year' }]} />
        <NumberField id="smp-pay" label={s.mode === 'year' ? 'Gross pay per year' : 'Average gross weekly earnings'} value={s.pay} onChange={(v) => set('pay', v)} unit="£" max={2000000} help="Average of the 8 weeks up to the qualifying week" />
        <DateField id="smp-due" label="Baby due on" value={s.due} onChange={(v) => set('due', v)} />
        <DateField id="smp-leave" label="Maternity leave starts on" value={s.leave} onChange={(v) => set('leave', v)} help={`Earliest: ${d(r.dates.earliestLeave)}`} />
        <DateField id="smp-emp" label="Started with this employer on" value={s.emp} onChange={(v) => set('emp', v)} help={`Must be on or before ${d(r.dates.startedBy)}`} />
      </form>
      <div className="mt-6">
        <ResultCard label={r.eligible ? 'Statutory Maternity Pay, 39 weeks' : 'Statutory Maternity Pay'} value={r.eligible ? gbp(sch.total) : 'Not due'} sub={r.eligible ? `About ${gbp(sch.total / 9)} a month on average over 9 months, before tax` : r.reasons.map((x) => why[x]).join('; ')} methodHref={methodHref}
          lines={r.eligible ? [
            { label: `Weeks 1 to 6: 90% of ${formatMoney(awe, 2)}`, value: `${gbp(sch.weeks[0].amount, 2)} a week`, share: sch.first6 / sch.total },
            { label: `Weeks 7 to 39: ${formatMoney(FAMILY_RATE, 2)} or 90% if lower`, value: `${gbp(sch.weeks[38].amount, 2)} a week`, share: sch.rest / sch.total },
            { label: 'Qualifying week', value: `${d(r.dates.qwStart)} to ${d(r.dates.qwEnd)}` },
            { label: 'Tell your employer by (leave dates)', value: d(r.dates.noticeBy) },
            { label: 'Ask for SMP in writing by (28 days before)', value: d(r.noticeForPay) },
            { label: 'SMP ends on / leave ends on', value: `${d(sch.lastDay)} / ${d(r.leaveEnd)}`, strong: true },
          ] : [
            { label: 'Qualifying week', value: `${d(r.dates.qwStart)} to ${d(r.dates.qwEnd)}` },
            { label: `Maternity Allowance instead (if earning £${P.familyPay.maEarningsThreshold}+ in 13 of 66 weeks)`, value: `up to ${gbp(FAMILY_RATE, 2)} a week` },
          ]}
          note={kind === 'smp' ? <p>The flat rate rises each April with the first pay week that starts on or after the first Sunday of April{sch.unknownRateWeeks ? `; ${sch.unknownRateWeeks} week(s) fall after April 2027, priced at the 2026/27 rate until the new rate is published` : ''}. Tax and National Insurance are deducted from SMP like wages.</p> : undefined}>
          {r.eligible && <ScheduleTable schedule={sch} title="Week-by-week schedule" />}
        </ResultCard>
        <Actions summary={summary} />
      </div>
    </Frame>
  );
}
