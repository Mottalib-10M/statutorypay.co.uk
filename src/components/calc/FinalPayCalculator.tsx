import { useMemo } from 'react';
import NumberField from '../ui/NumberField';
import { ResultCard, Actions, Frame, useUrlState } from './kit';
import { computeFinal } from '../../lib/engine/final';
import { formatMoney } from '../../lib/format';

export default function FinalPayCalculator({ methodHref }: { methodHref?: string }) {
  const [s, set] = useUrlState({ red: 9600, extra: 0, notice: 8, pay: 640, hol: 6, dpw: 5, arrears: 0 });
  const r = useMemo(() => computeFinal({ statutoryRedundancy: s.red, extraRedundancy: s.extra, noticeWeeks: s.notice, weeklyPay: s.pay, holidayDays: s.hol, daysPerWeek: s.dpw, arrears: s.arrears }), [s]);
  const t = r.total || 1;
  const summary = () => `Final pay (gross): ${formatMoney(r.total)}: redundancy ${formatMoney(r.redundancy)}, notice ${formatMoney(r.notice)}, holiday ${formatMoney(r.holiday)}, arrears ${formatMoney(r.arrears)}.`;
  return (
    <Frame>
      <form className="grid gap-x-4 gap-y-4 sm:grid-cols-2" onSubmit={(e) => e.preventDefault()}>
        <NumberField id="fp-red" label="Statutory redundancy pay" value={s.red} onChange={(v) => set('red', v)} unit="£" max={100000} help="From the redundancy pay calculator" />
        <NumberField id="fp-extra" label="Extra redundancy pay from the employer" value={s.extra} onChange={(v) => set('extra', v)} unit="£" max={5000000} help="Enhanced or ex gratia amount, if any" />
        <NumberField id="fp-pay" label="Gross weekly pay" value={s.pay} onChange={(v) => set('pay', v)} unit="£" max={100000} />
        <NumberField id="fp-notice" label="Notice paid in lieu or not worked" value={s.notice} onChange={(v) => set('notice', v)} unit="weeks" max={52} />
        <NumberField id="fp-hol" label="Untaken holiday" value={s.hol} onChange={(v) => set('hol', v)} unit="days" max={60} decimals={1} />
        <NumberField id="fp-dpw" label="Days worked per week" value={s.dpw} onChange={(v) => set('dpw', v)} unit="days" max={7} decimals={1} />
        <NumberField id="fp-arrears" label="Wages still owed (arrears)" value={s.arrears} onChange={(v) => set('arrears', v)} unit="£" max={1000000} />
      </form>
      <div className="mt-6">
        <ResultCard label="Total due when the job ends, before tax" value={formatMoney(r.total)} methodHref={methodHref}
          lines={[
            { label: 'Redundancy pay (statutory + extra)', value: formatMoney(r.redundancy), share: r.redundancy / t },
            { label: 'Notice pay', value: formatMoney(r.notice), share: r.notice / t },
            { label: 'Holiday pay for untaken days', value: formatMoney(r.holiday), share: r.holiday / t },
            { label: 'Arrears of pay', value: formatMoney(r.arrears), share: r.arrears / t },
            { label: `Redundancy pay inside the ${formatMoney(r.threshold)} threshold`, value: formatMoney(r.withinThreshold), strong: true },
            { label: 'Redundancy pay above the threshold (taxable)', value: formatMoney(r.aboveThreshold), tone: 'red' },
            { label: 'Taxed as earnings (notice, holiday, arrears)', value: formatMoney(r.earnings) },
          ]}
          note={<p>Gross amounts. Only redundancy pay benefits from the {formatMoney(r.threshold)} threshold (ITEPA 2003 s.403); notice pay, including pay in lieu, and holiday pay go through payroll like wages. This page does not work out income tax or National Insurance.</p>} />
        <Actions summary={summary} />
      </div>
    </Frame>
  );
}
