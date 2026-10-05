/** A company sick pay scheme against the statutory minimum over the same absence. */
import { weeklySsp } from '../engine/ssp';
import { P } from '../engine/params';
import { gbp } from './_kit';
import type { MiniSpec } from '../mini-types';

export default (): MiniSpec => ({
  title: 'Company sick pay against SSP over one long absence',
  cta: 'Statutory Sick Pay calculator',
  inputs: [
    { id: 'pay', label: 'Normal gross weekly pay', def: 650, unit: '£', max: 100000 },
    { id: 'full', label: 'Weeks on full pay in your scheme', def: 4, unit: 'weeks', max: 104 },
    { id: 'weeks', label: 'Weeks off sick', def: 12, unit: 'weeks', max: 104 },
  ],
  run: ({ pay, full, weeks }) => {
    const w = Math.max(0, weeks);
    const ssp = weeklySsp(pay);
    const sspWeeks = Math.min(w, P.ssp.maxWeeks);
    const statutory = ssp * sspWeeks;
    const fullWeeks = Math.min(w, full);
    const scheme = fullWeeks * pay + Math.max(0, sspWeeks - fullWeeks) * ssp;
    return {
      head: ['Scheme over the statutory minimum', gbp(scheme - statutory)],
      rows: [
        ['Statutory minimum (SSP only)', gbp(statutory)],
        ['Scheme: full pay, then SSP', gbp(scheme)],
        ['SSP a week for this pay', gbp(ssp, 2)],
      ],
      note: 'Assumes the scheme pays full pay first and falls back to SSP; read your own policy.',
    };
  },
});
