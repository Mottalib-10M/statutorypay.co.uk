/** Weekly redundancy cap in force on a last day, by nation (Increase of Limits Orders, art. 4). */
import { P, redundancyCapOn } from '../engine/params';
import { gbp, iso, monthOptions, yearOptions, nationOptions } from './_kit';
import type { MiniSpec } from '../mini-types';

const maxWeeks = P.redundancy.maxYears * P.redundancy.bands[0].weeks;
const first = Number(P.redundancy.weeklyCapGB[0].from.slice(0, 4));

export default (): MiniSpec => ({
  title: 'Which weekly cap applies to your last day?',
  cta: 'Work out the full payment from your dates',
  inputs: [
    { id: 'year', label: 'Year your notice ends', def: 2026, options: yearOptions(first, P.year + 1) },
    { id: 'month', label: 'Month your notice ends', def: 11, options: monthOptions() },
    { id: 'nation', label: 'Where you work', def: 0, options: nationOptions() },
  ],
  run: ({ year, month, nation }) => {
    const j = nation === 1 ? 'NI' : 'GB';
    const other = j === 'NI' ? 'GB' : 'NI';
    // Mid-month date: April is split by the 6 April changeover, shown in the note.
    const day = iso(year, month, 15);
    const cap = redundancyCapOn(day, j);
    const before = redundancyCapOn(iso(year, 4, 5), j);
    return {
      head: [`Weekly cap (${j === 'NI' ? 'Northern Ireland' : 'Great Britain'})`, gbp(cap)],
      rows: [
        ['Highest possible statutory payment', gbp(cap * maxWeeks)],
        [`Same date in ${other === 'NI' ? 'Northern Ireland' : 'Great Britain'}`, gbp(redundancyCapOn(day, other))],
        ['Cap a year earlier', gbp(redundancyCapOn(iso(year - 1, month, 15), j))],
      ],
      note: month === 4 ? `A last day from 1 to 5 April ${year} still takes the earlier cap of ${gbp(before)}.` : undefined,
    };
  },
});
