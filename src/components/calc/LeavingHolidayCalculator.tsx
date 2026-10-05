import { useMemo } from 'react';
import NumberField from '../ui/NumberField';
import { DateField, ResultCard, Actions, Frame, useUrlState } from './kit';
import { leavingPay } from '../../lib/engine/holiday';
import { formatMoney, formatNumber, displayDate } from '../../lib/format';

const d = (iso: string) => displayDate(iso, 'en-GB');

export default function LeavingHolidayCalculator({ methodHref }: { methodHref?: string }) {
  const [s, set] = useUrlState({ dpw: 5, ys: '2026-01-01', leave: '2026-10-30', taken: 14, extra: 0, pay: 600 });
  const r = useMemo(() => leavingPay({ daysPerWeek: s.dpw, yearStart: s.ys, leave: s.leave, taken: s.taken, weekPay: s.pay, extraContractDays: s.extra }), [s]);
  const summary = () => `Untaken holiday on leaving: ${formatNumber(r.days, 2)} days, ${formatMoney(r.pay)} gross.`;
  return (
    <Frame>
      <form className="grid gap-x-4 gap-y-4 sm:grid-cols-2" onSubmit={(e) => e.preventDefault()}>
        <DateField id="lh-ys" label="Leave year started on" value={s.ys} onChange={(v) => set('ys', v)} />
        <DateField id="lh-leave" label="Last day of employment" value={s.leave} onChange={(v) => set('leave', v)} />
        <NumberField id="lh-dpw" label="Days worked per week" value={s.dpw} onChange={(v) => set('dpw', v)} unit="days" max={7} decimals={1} />
        <NumberField id="lh-taken" label="Days taken this leave year" value={s.taken} onChange={(v) => set('taken', v)} unit="days" max={60} decimals={1} help="Include bank holidays taken if they count in your allowance" />
        <NumberField id="lh-extra" label="Extra contractual days a year" value={s.extra} onChange={(v) => set('extra', v)} unit="days" max={40} decimals={1} help="Above 5.6 weeks; only if the contract pays them out" />
        <NumberField id="lh-pay" label="A week’s pay" value={s.pay} onChange={(v) => set('pay', v)} unit="£" max={100000} />
      </form>
      <div className="mt-6">
        <ResultCard label={r.owedByWorker ? 'You have taken more than you accrued' : 'Holiday pay due on your last payslip'} value={r.owedByWorker ? `${formatNumber(-r.days, 1)} days` : formatMoney(r.pay)} sub={r.owedByWorker ? 'Your employer can only deduct this if a written agreement or your contract allows it.' : `${formatNumber(r.days, 2)} days × ${formatMoney(r.dayPay, 2)}`} methodHref={methodHref}
          lines={[
            { label: 'A: annual entitlement', value: `${formatNumber(r.A, 1)} days` },
            { label: `B: share of the leave year worked (${d(r.leaveYear.start)} to ${d(s.leave)})`, value: `${formatNumber(r.B * 100, 1)}%`, share: r.B },
            { label: 'A × B: holiday accrued', value: `${formatNumber(r.accrued, 2)} days` },
            { label: 'C: holiday taken', value: `${formatNumber(s.taken, 1)} days` },
            { label: '(A × B) − C', value: `${formatNumber(r.days, 2)} days`, strong: true },
          ]}
          note={<p>Working Time Regulations 1998, regulation 14, unless your contract sets another method. Payment in lieu is the only time statutory leave can be swapped for money, and it is owed even after a dismissal for gross misconduct.</p>} />
        <Actions summary={summary} />
      </div>
    </Frame>
  );
}
