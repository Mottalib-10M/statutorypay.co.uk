/** Shared helpers for mini-simulators (ignored by the registry: “_” prefix). */
import { formatMoney, formatNumber, formatPercent, displayDate } from '../format';
export const gbp = (x: number, d = 0) => formatMoney(x, d);
export const num = (x: number, d = 0) => formatNumber(x, d);
export const pct = (x: number, d = 1) => formatPercent(x, d);
export const date = (iso: string) => displayDate(iso, 'en-GB');
export const rows = (...r: Array<[string, string]>) => r;
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
/** Month options for a select (value 1-12). */
export const monthOptions = () => MONTHS.map((m, i) => ({ value: String(i + 1), label: m }));
/** Year options. */
export const yearOptions = (from: number, to: number) => Array.from({ length: to - from + 1 }, (_, i) => ({ value: String(from + i), label: String(from + i) }));
/** ISO date of the 1st (or given day) of a month. */
export const iso = (y: number, m: number, d = 1) => `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
/** Nation select: 0 = Great Britain, 1 = Northern Ireland. */
export const nationOptions = () => [{ value: '0', label: 'England, Wales or Scotland' }, { value: '1', label: 'Northern Ireland' }];
