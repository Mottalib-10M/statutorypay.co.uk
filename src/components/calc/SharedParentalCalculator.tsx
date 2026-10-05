import { useMemo } from 'react';
import NumberField from '../ui/NumberField';
import { ResultCard, Actions, Frame, useUrlState } from './kit';
import { gbp } from './family-ui';
import { sharedParental, ninety, ceilPenny } from '../../lib/engine/family';
import { FAMILY_RATE, LEL, P } from '../../lib/engine/params';
import { formatMoney } from '../../lib/format';

export default function SharedParentalCalculator({ methodHref }: { methodHref?: string }) {
  const [s, set] = useUrlState({ leave: 20, pay: 20, partnerAwe: 820, partnerWeeks: 12 });
  const r = useMemo(() => {
    const sp = sharedParental({ leaveWeeksTaken: s.leave, payWeeksTaken: s.pay });
    const weekly = ceilPenny(Math.min(FAMILY_RATE, ninety(s.partnerAwe)));
    const taken = Math.min(s.partnerWeeks, sp.splWeeks);
    const paidWeeks = Math.min(taken, sp.shppWeeks);
    return { ...sp, weekly, taken, paidWeeks, unpaid: taken - paidWeeks, amount: paidWeeks * weekly, left: sp.splWeeks - taken, leftPay: sp.shppWeeks - paidWeeks };
  }, [s]);
  const summary = () => `Shared parental: ${r.splWeeks} weeks of leave and ${r.shppWeeks} weeks of pay to share; partner taking ${r.taken} weeks gets ${gbp(r.amount, 2)}.`;
  return (
    <Frame>
      <form className="grid gap-x-4 gap-y-4 sm:grid-cols-2" onSubmit={(e) => e.preventDefault()}>
        <NumberField id="sp-leave" label="Maternity or adoption leave taken" value={s.leave} onChange={(v) => set('leave', v)} unit="weeks" max={52} help="At least 2 weeks after the birth" />
        <NumberField id="sp-pay" label="Weeks of SMP, SAP or Maternity Allowance used" value={s.pay} onChange={(v) => set('pay', v)} unit="weeks" max={39} />
        <NumberField id="sp-partner" label="Weeks the other parent will take" value={s.partnerWeeks} onChange={(v) => set('partnerWeeks', v)} unit="weeks" max={52} />
        <NumberField id="sp-awe" label="Their average gross weekly earnings" value={s.partnerAwe} onChange={(v) => set('partnerAwe', v)} unit="£" max={100000} help={`At least ${formatMoney(LEL)} a week for ShPP`} />
      </form>
      <div className="mt-6">
        <ResultCard label="Left to share between you" value={`${r.splWeeks} weeks of leave`} sub={`of which ${r.shppWeeks} weeks paid at up to ${gbp(FAMILY_RATE, 2)} a week`} methodHref={methodHref}
          lines={[
            { label: `Other parent: ${r.taken} weeks of shared parental leave`, value: s.partnerAwe >= LEL ? gbp(r.amount, 2) : 'no ShPP: earnings too low', strong: true, share: r.splWeeks ? r.taken / r.splWeeks : 0 },
            { label: 'Their weekly ShPP (lower of the flat rate and 90%)', value: gbp(r.weekly, 2) },
            { label: 'Of their weeks, unpaid', value: `${r.unpaid} weeks`, tone: 'red', share: r.taken ? r.unpaid / r.taken : 0 },
            { label: 'Still available for the first parent', value: `${r.left} weeks of leave, ${r.leftPay} weeks of pay` },
          ]}
          note={<p>Up to {P.familyPay.splLeaveWeeks} weeks of leave and {P.familyPay.shppWeeks} weeks of pay, used in the first year after the birth or placement, in up to three notified blocks each. Both parents must meet the work and earnings tests.</p>} />
        <Actions summary={summary} />
      </div>
    </Frame>
  );
}
