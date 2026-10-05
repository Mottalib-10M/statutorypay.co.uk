import { useMemo } from 'react';
import NumberField from '../ui/NumberField';
import SelectField from '../ui/SelectField';
import { ResultCard, Actions, Frame, useUrlState } from './kit';
import { irregularAccrual, rolledUp } from '../../lib/engine/holiday';
import { P } from '../../lib/engine/params';
import { formatMoney, formatNumber, formatPercent } from '../../lib/format';

const PERIODS: Record<string, number> = { weekly: 52, fortnightly: 26, fourweekly: 13, monthly: 12 };

export default function IrregularHoursCalculator({ methodHref }: { methodHref?: string }) {
  const [s, set] = useUrlState({ n: 'GB', freq: 'monthly', hours: 96, pay: 1220 });
  const r = useMemo(() => {
    const acc = irregularAccrual(s.hours);
    const perYear = PERIODS[s.freq] ?? 12;
    return { acc, rolled: rolledUp(s.pay), yearHours: acc.credited * perYear, perYear };
  }, [s]);
  const gb = s.n === 'GB';
  const summary = () => gb ? `${formatNumber(s.hours, 1)} hours worked → ${r.acc.credited} hours of holiday accrued; rolled-up holiday pay ${formatMoney(r.rolled, 2)}.` : 'Northern Ireland: 5.6 weeks a year, no 12.07% accrual.';
  return (
    <Frame>
      <form className="grid gap-x-4 gap-y-4 sm:grid-cols-2" onSubmit={(e) => e.preventDefault()}>
        <SelectField id="ir-n" label="Where you work" value={s.n} onChange={(v) => set('n', v)} options={[{ value: 'GB', label: 'England, Wales or Scotland' }, { value: 'NI', label: 'Northern Ireland' }]} />
        <SelectField id="ir-freq" label="Pay period" value={s.freq} onChange={(v) => set('freq', v)} options={[{ value: 'weekly', label: 'Weekly' }, { value: 'fortnightly', label: 'Fortnightly' }, { value: 'fourweekly', label: 'Every 4 weeks' }, { value: 'monthly', label: 'Monthly' }]} />
        <NumberField id="ir-hours" label="Hours worked in the pay period" value={s.hours} onChange={(v) => set('hours', v)} unit="hours" max={800} decimals={1} help="Hours actually worked, not hours on leave" />
        <NumberField id="ir-pay" label="Pay for that work, gross" value={s.pay} onChange={(v) => set('pay', v)} unit="£" max={100000} help="Basic pay, overtime and commission for the period" />
      </form>
      <div className="mt-6">
        {gb ? (
          <ResultCard label="Holiday accrued this pay period" value={`${r.acc.credited} hours`} sub={`${formatNumber(s.hours, 1)} hours × ${formatPercent(P.holiday.irregularAccrualRate, 2)} = ${formatNumber(r.acc.exact, 2)}, rounded to the nearest hour`} methodHref={methodHref}
            lines={[
              { label: 'Rolled-up holiday pay if your employer uses it', value: formatMoney(r.rolled, 2), strong: true },
              { label: `If every period looked like this: hours accrued in a year (${r.perYear} periods)`, value: `${formatNumber(r.yearHours)} hours` },
              { label: 'Ceiling in a leave year', value: `${P.holiday.maxDays} days` },
            ]}
            note={<p>Great Britain, leave years starting on or after 1 April 2024, for irregular-hours and part-year workers (Working Time Regulations 1998, regs 15B and 16A). Rolled-up pay must appear as its own line on the payslip and be paid with the wages for the work.</p>} />
        ) : (
          <ResultCard label="Northern Ireland" value="5.6 weeks" sub="The 12.07% accrual and rolled-up holiday pay are Great Britain rules only." methodHref={methodHref}
            note={<p>In Northern Ireland irregular and casual workers still get 5.6 weeks a year under the Working Time Regulations (NI) 2016, built up in proportion to the time worked; holiday pay is a separate payment when leave is taken.</p>} />
        )}
        <Actions summary={summary} />
      </div>
    </Frame>
  );
}
