import { useMemo } from 'react';
import { DateField, ResultCard, Actions, Frame, useUrlState } from './kit';
import { d } from './family-ui';
import { birthDates } from '../../lib/engine/family';
import { addDays, addWeeks } from '../../lib/engine/dates';
import { P } from '../../lib/engine/params';

export default function MaternityDatesTool({ methodHref }: { methodHref?: string }) {
  const [s, set] = useUrlState({ due: '2027-04-20', leave: '2027-04-04' });
  const r = useMemo(() => {
    const b = birthDates(s.due);
    const F = P.familyPay;
    return { b, oml: addDays(addWeeks(s.leave, F.ordinaryLeaveWeeks), -1), aml: addDays(addWeeks(s.leave, F.maternityLeaveWeeks), -1), smpEnd: addDays(addWeeks(s.leave, F.smpWeeks), -1), payClaim: addDays(s.leave, -F.noticeDaysPay) };
  }, [s]);
  const early = s.leave < r.b.earliestLeave;
  const summary = () => `Due ${d(s.due)}: qualifying week ${d(r.b.qwStart)}-${d(r.b.qwEnd)}, earliest leave ${d(r.b.earliestLeave)}, leave from ${d(s.leave)} to ${d(r.aml)}.`;
  return (
    <Frame>
      <form className="grid gap-x-4 gap-y-4 sm:grid-cols-2" onSubmit={(e) => e.preventDefault()}>
        <DateField id="md-due" label="Baby due on" value={s.due} onChange={(v) => set('due', v)} />
        <DateField id="md-leave" label="Planned first day of leave" value={s.leave} onChange={(v) => set('leave', v)} help={early ? `Too early: earliest is ${d(r.b.earliestLeave)}` : 'Any day of the week'} />
      </form>
      <div className="mt-6">
        <ResultCard label="Return to work after the full 52 weeks on" value={d(addDays(r.aml, 1))} methodHref={methodHref}
          lines={[
            { label: 'Expected week of childbirth starts (Sunday)', value: d(r.b.ewcStart) },
            { label: 'Qualifying week (15th week before)', value: `${d(r.b.qwStart)} to ${d(r.b.qwEnd)}` },
            { label: 'Tell your employer about the pregnancy and leave by', value: d(r.b.noticeBy), strong: true },
            { label: 'Earliest start of maternity leave', value: d(r.b.earliestLeave) },
            { label: 'Pregnancy-related absence triggers leave from', value: d(r.b.sicknessTrigger) },
            { label: 'Ask for SMP (28 days before it starts) by', value: d(r.payClaim) },
            { label: 'Ordinary maternity leave ends', value: d(r.oml) },
            { label: 'SMP ends (39 weeks)', value: d(r.smpEnd) },
            { label: 'Additional maternity leave ends (52 weeks)', value: d(r.aml) },
          ]}
          note={<p>Weeks run Sunday to Saturday. If the baby arrives before leave starts, leave starts the day after the birth. To come back before the 52 weeks are up, give {P.familyPay.returnChangeNoticeWeeks} weeks’ notice of the new date.</p>} />
        <Actions summary={summary} />
      </div>
    </Frame>
  );
}
