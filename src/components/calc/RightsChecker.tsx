/**
 * Home page tool: what the statutory minimums give someone today, from three facts (start date,
 * date of birth, pay). Every line calls the engine used by the dedicated calculators.
 */
import { useEffect, useMemo } from 'react';
import NumberField from '../ui/NumberField';
import SelectField from '../ui/SelectField';
import { DateField, Frame, useUrlState } from './kit';
import { computeRedundancy } from '../../lib/engine/redundancy';
import { statutoryNoticeWeeks, noticeEnd } from '../../lib/engine/notice';
import { entitlementDays } from '../../lib/engine/holiday';
import { weeklySsp } from '../../lib/engine/ssp';
import { firstQualifyingEwc, ninety } from '../../lib/engine/family';
import { FAMILY_RATE, LEL, P } from '../../lib/engine/params';
import { fullYears, addDays, addWeeks } from '../../lib/engine/dates';
import { formatMoney, formatNumber, displayDate } from '../../lib/format';

const d = (iso: string) => displayDate(iso, 'en-GB');

export default function RightsChecker({ links }: { links: Record<string, string> }) {
  const [s, set] = useUrlState({ n: 'GB', start: '2018-02-05', dob: '1986-07-21', pay: 650, dpw: 5, on: '2026-10-05' });
  // The reference day is today, set after mount (hydration rule, RECETTE §17.5).
  useEffect(() => { if (!new URLSearchParams(window.location.search).get('on')) set('on', new Date().toISOString().slice(0, 10)); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, []);
  const r = useMemo(() => {
    const ni = s.n === 'NI';
    const nw = statutoryNoticeWeeks(s.start, s.on);
    const red = computeRedundancy({ dob: s.dob, start: s.start, noticeGiven: s.on, end: noticeEnd(s.on, nw), weeklyPay: s.pay, jurisdiction: ni ? 'NI' : 'GB' });
    const years = fullYears(s.start, addDays(s.on, 1));
    const ewc = firstQualifyingEwc(s.start);
    const famOk = s.pay >= LEL;
    const ninetyPct = ninety(s.pay);
    const patLeaveOn = ni ? addWeeks(s.start, P.familyPay.serviceWeeks) : s.start;
    return { nw, red, years, ewc, famOk, ninetyPct, patLeaveOn, ni };
  }, [s]);
  const bad = !(s.dob < s.start && s.start <= s.on);
  const Row = ({ title, value, detail, href }: { title: string; value: string; detail: string; href?: string }) => (
    <tr className="border-t border-navy-200 align-top">
      <th scope="row" className="py-3 pr-3 text-left font-medium text-navy-900">{href ? <a href={href} className="underline decoration-accent-300 underline-offset-2 hover:text-accent-700">{title}</a> : title}</th>
      <td className="tabular-nums py-3 pr-3 text-right font-semibold text-navy-900">{value}</td>
      <td className="hidden py-3 text-sm text-navy-700 md:table-cell">{detail}</td>
    </tr>
  );
  return (
    <Frame>
      <form className="grid gap-x-4 gap-y-4 sm:grid-cols-2 lg:grid-cols-3" onSubmit={(e) => e.preventDefault()}>
        <DateField id="rc-start" label="Started with your employer on" value={s.start} onChange={(v) => set('start', v)} />
        <DateField id="rc-dob" label="Date of birth" value={s.dob} onChange={(v) => set('dob', v)} />
        <NumberField id="rc-pay" label="Gross weekly pay" value={s.pay} onChange={(v) => set('pay', v)} unit="£" max={100000} help="Annual salary ÷ 52" />
        <NumberField id="rc-dpw" label="Days worked per week" value={s.dpw} onChange={(v) => set('dpw', v)} unit="days" max={7} decimals={1} />
        <SelectField id="rc-n" label="Where you work" value={s.n} onChange={(v) => set('n', v)} options={[{ value: 'GB', label: 'England, Wales or Scotland' }, { value: 'NI', label: 'Northern Ireland' }]} />
        <DateField id="rc-on" label="Check on" value={s.on} onChange={(v) => set('on', v)} help="Today by default" />
      </form>
      <div aria-live="polite" className="result-card mt-6 p-4 sm:p-5">
        {bad ? <p className="text-navy-800">Check the dates: birth before start, start before the check date.</p> : (<>
          <p className="text-sm font-medium text-navy-700">On {d(s.on)}, after {r.years} complete year{r.years === 1 ? '' : 's'} of service, the law gives you at least:</p>
          <div className="mt-2 overflow-x-auto"><table className="w-full text-sm"><tbody>
            <Row title="Notice from your employer" value={`${r.nw} week${r.nw === 1 ? '' : 's'}`} detail={r.nw === 0 ? 'Nothing in law before one month of service.' : r.nw < P.notice.maxWeeks ? `Rises by one week on each work anniversary, up to ${P.notice.maxWeeks}.` : 'The statutory maximum.'} href={links.notice} />
            <Row title="Redundancy pay if notice were given today" value={r.red.eligible ? formatMoney(r.red.amount) : formatMoney(0)} detail={r.red.eligible ? `${formatNumber(r.red.weeks, 1)} weeks × ${formatMoney(r.red.weekUsed, 2)}${r.red.capped ? ` (capped at ${formatMoney(r.red.cap)})` : ''}.` : `Two complete years are needed${r.red.nextYearOn ? `; reached by a last day of ${d(r.red.nextYearOn)}` : ''}.`} href={links.redundancy} />
            <Row title="Paid holiday a year" value={`${formatNumber(entitlementDays(s.dpw), 1)} days`} detail={`5.6 weeks, capped at ${P.holiday.maxDays} days; bank holidays may be included.`} href={links.holiday} />
            <Row title="Statutory Sick Pay" value={`${formatMoney(weeklySsp(s.pay), 2)} a week`} detail={`From the first qualifying day, for up to ${P.ssp.maxWeeks} weeks: the lower of ${formatMoney(P.ssp.weeklyRate, 2)} and 80% of your pay.`} href={links.ssp} />
            <Row title="Maternity, adoption or paternity pay" value={r.famOk ? `from week of ${d(r.ewc)}` : 'earnings too low'} detail={r.famOk ? `You meet the 26-week test for a baby due in that week or later. SMP: 6 weeks at ${formatMoney(r.ninetyPct, 2)}, then ${formatMoney(Math.min(FAMILY_RATE, r.ninetyPct), 2)}.` : `Average earnings must reach ${formatMoney(LEL)} a week; Maternity Allowance may apply instead.`} href={links.smp} />
            <Row title="Paternity leave" value={r.patLeaveOn <= s.on ? 'yes' : `from ${d(r.patLeaveOn)}`} detail={r.ni ? 'Northern Ireland: after 26 weeks of service, within 56 days of the birth.' : 'A day-one right in Great Britain since 6 April 2026; pay still needs 26 weeks.'} href={links.paternity} />
          </tbody></table></div>
          <p className="mt-3 text-xs text-navy-600">Statutory minimums for an employee. Your contract can give more, never less.</p>
        </>)}
      </div>
    </Frame>
  );
}
