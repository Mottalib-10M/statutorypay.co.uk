/** Self-certification or fit note, from the length of the absence. */
import { P } from '../engine/params';
import { num } from './_kit';
import type { MiniSpec } from '../mini-types';

export default (): MiniSpec => ({
  title: 'Do you need a fit note for this absence?',
  cta: 'Sick pay for the same absence',
  inputs: [
    { id: 'days', label: 'Days off in a row, weekends included', def: 9, unit: 'days', max: 400 },
  ],
  run: ({ days }) => {
    const d = Math.round(days);
    const need = d > P.ssp.fitNoteAfterDays;
    return {
      head: ['Proof your employer can ask for', need ? 'Fit note' : 'Self-certification'],
      rows: [
        ['Calendar days off', num(d)],
        ['Self-certification covers up to', `${P.ssp.fitNoteAfterDays} days`],
        ['Fit note free of charge', need ? 'yes, illness of more than 7 days' : 'a fee may be charged'],
      ],
    };
  },
});
