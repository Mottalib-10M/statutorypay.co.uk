/** Earliest date the first redundancy can take effect after collective consultation begins (TULRCA 1992 s.188). */
import { addDays } from '../engine/dates';
import { P } from '../engine/params';
import { date, iso, monthOptions, yearOptions, num } from './_kit';
import type { MiniSpec } from '../mini-types';

const R = P.redundancy;
const X = P.redundancyExtra;
const award = X.protectiveAwardMaxDays[X.protectiveAwardMaxDays.length - 1].days;

export default (): MiniSpec => ({
  title: 'How soon can the first redundancy take effect?',
  cta: 'Then work out each person’s pay',
  inputs: [
    { id: 'n', label: 'Redundancies proposed at the site', def: 45, unit: 'people', max: 100000 },
    { id: 'month', label: 'Consultation starts on the 1st of', def: 11, options: monthOptions() },
    { id: 'year', label: 'Year consultation starts', def: P.year, options: yearOptions(P.year, P.year + 2) },
  ],
  run: ({ n, month, year }) => {
    const start = iso(year, month, 1);
    const days = n >= R.collectiveThreshold100 ? R.collectiveDays100plus : n >= R.collectiveThreshold20 ? R.collectiveDays20to99 : 0;
    if (!days) return {
      head: ['Minimum consultation period', 'None set by law'],
      rows: [['Collective rules start at', `${num(R.collectiveThreshold20)} people`], ['Individual consultation', 'Still expected']],
      note: `Fewer than ${R.collectiveThreshold20} at one establishment within ${X.collectiveWindowDays} days: no statutory minimum, but a fair process is still needed.`,
    };
    return {
      head: ['First dismissal can take effect from', date(addDays(start, days))],
      rows: [
        ['Minimum period before it', `${days} days`],
        ['HR1 to the Redundancy Payments Service', `By ${date(start)} at the latest`],
        ['Maximum protective award', `${award} days’ pay each`],
      ],
      note: 'HR1 must also go in before any notice of dismissal is handed out.',
    };
  },
});
