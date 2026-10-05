import { useMemo } from 'react';
import NumberField from '../ui/NumberField';
import SelectField from '../ui/SelectField';
import Toggle from '../ui/Toggle';
import { DateField, ResultCard, Actions, Frame, useUrlState } from './kit';
import { d, gbp } from './family-ui';
import { computeSpp } from '../../lib/engine/family';
import { FAMILY_RATE } from '../../lib/engine/params';
import { formatMoney } from '../../lib/format';

export default function PaternityCalculator({ methodHref }: { methodHref?: string }) {
  const [s, set] = useUrlState({ n: 'GB', due: '2027-01-18', emp: '2025-11-03', pay: 690, weeks: 2, leave: '2027-01-18' });
  const r = useMemo(() => computeSpp({ dueDate: s.due, awe: s.pay, employmentStart: s.emp, weeks: s.weeks === 1 ? 1 : 2, leaveStart: s.leave, jurisdiction: s.n === 'NI' ? 'NI' : 'GB' }), [s]);
  const summary = () => `Paternity: leave ${r.leaveEligible ? 'yes' : 'no'}, pay ${r.payEligible ? gbp(r.schedule.total, 2) : 'not due'}; take it by ${d(r.windowEnd)}.`;
  return (
    <Frame>
      <form className="grid gap-x-4 gap-y-4 sm:grid-cols-2" onSubmit={(e) => e.preventDefault()}>
        <SelectField id="pp-n" label="Where you work" value={s.n} onChange={(v) => set('n', v)} options={[{ value: 'GB', label: 'England, Wales or Scotland' }, { value: 'NI', label: 'Northern Ireland' }]} />
        <Toggle id="pp-weeks" label="Weeks of leave" value={String(s.weeks)} onChange={(v) => set('weeks', Number(v))} options={[{ value: '1', label: '1 week' }, { value: '2', label: '2 weeks' }]} />
        <DateField id="pp-due" label="Baby due on" value={s.due} onChange={(v) => set('due', v)} />
        <DateField id="pp-leave" label="Paternity leave starts on" value={s.leave} onChange={(v) => set('leave', v)} help="Not before the birth" />
        <DateField id="pp-emp" label="Started with this employer on" value={s.emp} onChange={(v) => set('emp', v)} help={`For pay: on or before ${d(r.dates.startedBy)}`} />
        <NumberField id="pp-pay" label="Average gross weekly earnings" value={s.pay} onChange={(v) => set('pay', v)} unit="£" max={100000} />
      </form>
      <div className="mt-6">
        <ResultCard label="Statutory Paternity Pay" value={r.payEligible ? gbp(r.schedule.total, 2) : 'Not due'} sub={r.payEligible ? `${s.weeks} × ${gbp(r.schedule.weeks[0]?.amount ?? 0, 2)} (the lower of ${formatMoney(FAMILY_RATE, 2)} and 90% of earnings)` : r.reasons.includes('service') ? `Pay needs 26 weeks with the employer by ${d(r.dates.qwEnd)} (start by ${d(r.dates.startedBy)})` : `Earnings below the ${formatMoney(r.dates.lel)} lower earnings limit`} methodHref={methodHref}
          lines={[
            { label: 'Paternity leave', value: r.leaveEligible ? (s.n === 'GB' ? 'Yes, a day-one right' : 'Yes') : 'No: 26 weeks’ service needed in NI', strong: true },
            { label: 'How it can be taken', value: r.consecutiveOnly ? 'One block of 1 or 2 consecutive weeks' : '1 or 2 weeks, together or as two separate weeks' },
            { label: 'Leave must end by', value: d(r.windowEnd) },
            { label: 'Tell your employer the due date by', value: d(r.dates.noticeBy) },
          ]}
          note={<p>{s.n === 'GB' ? 'Great Britain: since 6 April 2026 paternity leave has no qualifying period (Employment Rights Act 2025, s.16). Pay keeps the 26-week and earnings conditions.' : 'Northern Ireland: the 26-week qualifying period still applies to leave, which must be taken within 56 days of the birth.'}</p>} />
        <Actions summary={summary} />
      </div>
    </Frame>
  );
}
