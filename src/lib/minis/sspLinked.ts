/** Do two spells link, and how much of the 28 weeks is left? */
import { P } from '../engine/params';
import { num } from './_kit';
import type { MiniSpec } from '../mini-types';

export default (): MiniSpec => ({
  title: 'Two spells of sickness: one period or two?',
  cta: 'Count the days in the sick pay calculator',
  inputs: [
    { id: 'gap', label: 'Days back at work between the spells', def: 40, unit: 'days', max: 3650 },
    { id: 'paid', label: 'SSP days paid in the first spell', def: 30, unit: 'days', max: 196 },
    { id: 'q', label: 'Days worked a week', def: 5, unit: 'days', max: 7 },
  ],
  run: ({ gap, paid, q }) => {
    const qd = Math.max(1, Math.min(7, Math.round(q)));
    const isLinked = gap <= P.ssp.linkGapWeeks * 7;
    const max = P.ssp.maxWeeks * qd;
    const left = isLinked ? Math.max(0, max - paid) : max;
    return {
      head: [isLinked ? 'Linked: the 28 weeks keep running' : 'Not linked: a fresh 28 weeks', `${num(left)} days left`],
      rows: [
        ['Gap allowed for a link', `${P.ssp.linkGapWeeks * 7} days (${P.ssp.linkGapWeeks} weeks)`],
        ['Ceiling in qualifying days', num(max)],
        ['Weeks of SSP left', num(left / qd, 1)],
      ],
    };
  },
});
