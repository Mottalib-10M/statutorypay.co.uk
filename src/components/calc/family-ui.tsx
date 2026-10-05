/** Shared bits of the family-pay calculators. */
import { formatMoney, displayDate } from '../../lib/format';
import type { PaySchedule } from '../../lib/engine/family';
export const d = (iso: string) => displayDate(iso, 'en-GB');
export const gbp = (x: number, dec = 0) => formatMoney(x, dec);

export function ScheduleTable({ schedule, title }: { schedule: PaySchedule; title: string }) {
  return (
    <details className="mt-4 rounded-lg border border-navy-200 px-4 py-3 text-sm">
      <summary className="cursor-pointer font-medium text-navy-800">{title}</summary>
      <div className="mt-3 max-h-96 overflow-auto"><table className="journal w-full text-sm"><thead><tr><th scope="col" className="py-1 pr-3 text-left">Week</th><th scope="col" className="py-1 pr-3 text-left">From</th><th scope="col" className="py-1 pr-3 text-left">Rule</th><th scope="col" className="py-1 text-right">Gross</th></tr></thead>
        <tbody>{schedule.weeks.map((w) => <tr key={w.n} className="border-t border-navy-100"><td className="tabular-nums py-1 pr-3">{w.n}</td><td className="py-1 pr-3">{d(w.start)}</td><td className="py-1 pr-3">{w.rule === 'flat' ? `flat rate${w.rateKnown ? '' : ' (2027/28 rate not set yet)'}` : '90% of earnings'}</td><td className="tabular-nums py-1 text-right">{gbp(w.amount, 2)}</td></tr>)}</tbody></table></div>
    </details>
  );
}
