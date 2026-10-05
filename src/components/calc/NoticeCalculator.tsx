import { useMemo } from 'react';
import NumberField from '../ui/NumberField';
import Toggle from '../ui/Toggle';
import { DateField, ResultCard, Actions, Frame, useUrlState } from './kit';
import { computeNotice } from '../../lib/engine/notice';
import { formatMoney, displayDate } from '../../lib/format';

const d = (iso: string) => displayDate(iso, 'en-GB');
const wk = (n: number) => `${n} week${n === 1 ? '' : 's'}`;

export default function NoticeCalculator({ methodHref }: { methodHref?: string }) {
  const [s, set] = useUrlState({ by: 'employer', start: '2019-03-11', given: '2026-10-05', contract: 4, pay: 620 });
  const r = useMemo(() => computeNotice({ start: s.start, noticeGiven: s.given, contractualWeeks: s.contract, weeklyPay: s.pay, byEmployee: s.by === 'employee' }), [s]);
  const bad = s.given < s.start;
  const summary = () => `Notice: ${wk(r.appliedWeeks)} (statutory ${wk(r.statutoryWeeks)}, contract ${wk(r.contractualWeeks)}), last day ${d(r.endDate)}, notice pay ${formatMoney(r.noticePay)}.`;
  return (
    <Frame>
      <form className="grid gap-x-4 gap-y-4 sm:grid-cols-2" onSubmit={(e) => e.preventDefault()}>
        <Toggle id="nt-by" label="Who gives notice?" value={s.by} onChange={(v) => set('by', v)} options={[{ value: 'employer', label: 'Employer' }, { value: 'employee', label: 'Employee' }]} />
        <NumberField id="nt-contract" label="Notice in the contract" value={s.contract} onChange={(v) => set('contract', v)} unit="weeks" max={52} help="0 if the contract says nothing; 1 month ≈ 4 weeks" />
        <DateField id="nt-start" label="First day of continuous employment" value={s.start} onChange={(v) => set('start', v)} />
        <DateField id="nt-given" label="Day notice is given" value={s.given} onChange={(v) => set('given', v)} help="Notice starts running the next day" />
        <NumberField id="nt-pay" label="Gross weekly pay" value={s.pay} onChange={(v) => set('pay', v)} unit="£" max={100000} help="For the value of the notice period or pay in lieu" />
      </form>
      <div className="mt-6">
        {bad ? <ResultCard label="Check the dates" value="—" sub="Notice cannot be given before employment starts." /> : (
          <ResultCard label={s.by === 'employee' ? 'Notice you owe your employer' : 'Notice your employer owes you'} value={wk(r.appliedWeeks)} sub={r.appliedWeeks ? `Employment ends on ${d(r.endDate)}` : 'Under one month of service: no statutory minimum, the contract alone decides.'} methodHref={methodHref}
            lines={[
              { label: s.by === 'employee' ? 'Statutory minimum for an employee' : `Statutory minimum (${r.serviceYears} complete year${r.serviceYears === 1 ? '' : 's'})`, value: wk(r.statutoryWeeks), share: r.appliedWeeks ? r.statutoryWeeks / Math.max(r.appliedWeeks, 1) : 0 },
              { label: 'Contract', value: wk(r.contractualWeeks), share: r.appliedWeeks ? r.contractualWeeks / Math.max(r.appliedWeeks, 1) : 0 },
              { label: 'Rule applied', value: r.ruleApplied === 'contract' ? 'contract (longer)' : r.ruleApplied === 'statutory' ? 'statute (longer or equal)' : '—', strong: true },
              { label: 'Value of the notice period, gross', value: formatMoney(r.noticePay) },
              ...(s.by === 'employer' && r.nextStepUp ? [{ label: 'Notice given from this date would carry one more week', value: d(r.nextStepUp) }] : []),
            ]} />
        )}
        <Actions summary={summary} />
      </div>
    </Frame>
  );
}
