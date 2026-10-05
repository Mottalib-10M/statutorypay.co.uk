/** Which statutory rights covered on this site follow an employment status, with the figures for one case. */
import { statutoryNoticeWeeks } from '../engine/notice';
import { entitlementDays } from '../engine/holiday';
import { weeklySsp } from '../engine/ssp';
import { addYears } from '../engine/dates';
import { P } from '../engine/params';
import { gbp, num } from './_kit';
import type { MiniSpec } from '../mini-types';

export default (): MiniSpec => ({
  title: 'Your status, your rights',
  cta: 'Check every right from your start date',
  inputs: [
    { id: 'status', label: 'Status', def: 0, options: [{ value: '0', label: 'Employee' }, { value: '1', label: 'Worker (casual, zero hours, agency)' }, { value: '2', label: 'Self-employed' }] },
    { id: 'years', label: 'Complete years with the business', def: 3, unit: 'years', max: 60 },
    { id: 'pay', label: 'Gross weekly pay', def: 480, unit: '£', max: 100000 },
  ],
  run: ({ status, years, pay }) => {
    const employee = status === 0, worker = status <= 1;
    const today = P.retrieved_at;
    const notice = employee ? statutoryNoticeWeeks(addYears(today, -years), today) : 0;
    const redundancy = employee && years >= P.redundancy.qualifyingYears;
    // Six rights: notice, redundancy pay, holiday, SSP, family leave (employees), statutory family pay.
    const count = [employee, redundancy, worker, worker, employee, worker].filter(Boolean).length;
    return {
      head: ['Rights in play, out of six', `${count}`],
      rows: [
        ['Notice from the employer', employee ? `${notice} week${notice === 1 ? '' : 's'}` : 'None by statute'],
        ['Statutory redundancy pay', redundancy ? 'Yes' : employee ? `After ${P.redundancy.qualifyingYears} years` : 'No'],
        ['Paid holiday, 5-day week', worker ? `${num(entitlementDays(5), 0)} days` : 'No'],
        ['Statutory Sick Pay a week', worker ? gbp(weeklySsp(pay), 2) : 'No'],
      ],
      note: employee ? 'Employees also have maternity, paternity and parental leave.' : worker ? 'Leave rights such as maternity and paternity leave are for employees; statutory pay can still be due on the payroll.' : 'Maternity Allowance from the government can replace SMP for the self-employed.',
    };
  },
});
