/** Can a laid-off employee claim redundancy pay? ERA 1996 s.148(2); guarantee pay limit s.31. */
import { P } from '../engine/params';
import { gbp } from './_kit';
import type { MiniSpec } from '../mini-types';

const R = P.redundancy;
const X = P.redundancyExtra;
const dayRate = X.guaranteePayDay[X.guaranteePayDay.length - 1].day;

export default (): MiniSpec => ({
  title: 'Laid off or on short time: can you claim yet?',
  cta: 'Work out what the claim is worth',
  inputs: [
    { id: 'run', label: 'Longest run of weeks in a row', def: 3, unit: 'weeks', max: 52 },
    { id: 'total', label: `Weeks affected in the last ${X.layOffSeriesWindowWeeks}`, def: 6, unit: 'weeks', max: 13 },
    { id: 'dpw', label: 'Days you normally work a week', def: 5, unit: 'days', max: 7 },
  ],
  run: ({ run, total, dpw }) => {
    const a = run >= R.layOffWeeksInRow;
    const b = !a && total >= R.layOffWeeksIn13 && run <= X.layOffMaxConsecutiveInSeries;
    const route = a ? `${R.layOffWeeksInRow} or more weeks in a row` : b ? `${R.layOffWeeksIn13} or more weeks in ${X.layOffSeriesWindowWeeks}` : 'Neither test met yet';
    const gDays = Math.min(Math.max(0, Math.round(dpw)), X.guaranteeMaxDays);
    return {
      head: ['Notice of intention to claim', a || b ? 'You can serve it' : 'Not yet'],
      rows: [
        ['Test met', route],
        ['Write within', `${X.layOffClaimWithinWeeks} weeks of the last week`],
        [`Guarantee pay ceiling per ${X.guaranteePeriodMonths} months`, gbp(gDays * dayRate)],
      ],
      note: `Guarantee pay is at most ${gbp(dayRate)} a day for workless days, for up to ${X.guaranteeMaxDays} days in any ${X.guaranteePeriodMonths} months.`,
    };
  },
});
