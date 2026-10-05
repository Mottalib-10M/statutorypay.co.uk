/**
 * Shared pieces of the calculators: date field, result card with proportional bars, actions (copy,
 * share link, print) and the URL-state hook. Hydration rule (RECETTE §17.5): the first render uses
 * the build defaults only; the shared link is read in an effect after mount.
 */
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { readParams, updateURL } from '../../lib/url-state';
import { isISO } from '../../lib/engine/dates';

export function DateField({ id, label, value, onChange, help, className = '' }: { id: string; label: string; value: string; onChange: (v: string) => void; help?: string; className?: string }) {
  return (
    <div className={`grid grid-rows-subgrid row-span-3 content-start gap-y-0 ${className}`}>
      <label htmlFor={id} className="mb-1 block text-sm font-medium text-navy-700">{label}</label>
      <input id={id} type="date" value={value} min="1930-01-01" max="2099-12-31" onChange={(e) => { if (isISO(e.target.value)) onChange(e.target.value); }} aria-describedby={help ? `${id}-help` : undefined}
        className="tabular-nums h-12 w-full rounded-lg border border-navy-300 bg-white px-3 text-navy-900 focus:border-accent-500 focus:outline-none focus:ring-2 focus:ring-accent-500/20" />
      {help ? <p id={`${id}-help`} className="mt-1 text-xs text-navy-500">{help}</p> : <span aria-hidden="true" />}
    </div>
  );
}

export interface Line { label: string; value: string; share?: number; strong?: boolean; tone?: 'red' }
export function ResultCard({ label, value, sub, lines = [], note, methodHref, children }: { label: string; value: string; sub?: string; lines?: Line[]; note?: ReactNode; methodHref?: string; children?: ReactNode }) {
  return (
    <div aria-live="polite" className="result-card p-5">
      <p className="text-sm font-medium text-navy-700">{label}</p>
      <p className="tabular-nums mt-1 text-4xl font-bold text-navy-900">{value}</p>
      {sub && <p className="mt-1 text-sm text-navy-700">{sub}</p>}
      {lines.length > 0 && (
        <table className="mt-4 w-full text-sm"><tbody>
          {lines.map((l) => (
            <tr key={l.label} className="border-t border-accent-100 align-top">
              <td className="py-2 pr-3 text-navy-700">{l.label}{l.share !== undefined && <div className="bar-track mt-1.5"><div className={l.tone === 'red' ? 'bar-fill-red' : 'bar-fill'} style={{ width: `${Math.max(0, Math.min(100, l.share * 100))}%` }} /></div>}</td>
              <td className={`tabular-nums py-2 text-right ${l.strong ? 'font-semibold text-navy-900' : 'text-navy-900'}`}>{l.value}</td>
            </tr>
          ))}
        </tbody></table>
      )}
      {children}
      {note && <div className="mt-3 text-xs text-navy-600">{note}</div>}
      {methodHref && <p className="mt-3 text-xs"><a href={methodHref} className="font-medium text-accent-700 underline">How this is calculated</a></p>}
    </div>
  );
}

export function Actions({ summary }: { summary: () => string }) {
  const [msg, setMsg] = useState('');
  const flash = (m: string) => { setMsg(m); setTimeout(() => setMsg(''), 2000); };
  const copy = async (text: string, m: string) => { try { await navigator.clipboard.writeText(text); flash(m); } catch { flash('Copy not available in this browser'); } };
  return (
    <div className="no-print mt-4 flex flex-wrap items-center gap-2 text-sm">
      <button type="button" onClick={() => copy(summary(), 'Result copied')} className="rounded-lg border border-navy-300 px-3 py-2 font-medium text-navy-700 hover:bg-navy-50">Copy result</button>
      <button type="button" onClick={() => copy(window.location.href, 'Link copied')} className="rounded-lg border border-navy-300 px-3 py-2 font-medium text-navy-700 hover:bg-navy-50">Copy share link</button>
      <button type="button" onClick={() => window.print()} className="rounded-lg border border-navy-300 px-3 py-2 font-medium text-navy-700 hover:bg-navy-50">Print</button>
      <span role="status" className="text-navy-600">{msg}</span>
    </div>
  );
}

type Val = string | number;
/** State mirrored in the address bar (share link). Defaults on first render, link values after mount. */
export function useUrlState<T extends Record<string, Val>>(defaults: T): [T, <K extends keyof T>(k: K, v: T[K]) => void] {
  const [s, setS] = useState<T>(defaults);
  const loaded = useRef(false);
  useEffect(() => {
    const sp = readParams(window.location.search);
    const next = { ...defaults } as Record<string, Val>;
    for (const k of Object.keys(defaults)) {
      const v = sp.get(k);
      if (v === null) continue;
      if (typeof defaults[k] === 'number') { const n = parseFloat(v); if (!Number.isNaN(n)) next[k] = n; }
      else if (typeof defaults[k] === 'string' && (!/^\d{4}-/.test(String(defaults[k])) || isISO(v))) next[k] = v;
    }
    setS(next as T); loaded.current = true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => { if (loaded.current) updateURL(s); }, [s]);
  const set = <K extends keyof T>(k: K, v: T[K]) => setS((o) => ({ ...o, [k]: v }));
  return [s, set];
}

export const Frame = ({ children }: { children: ReactNode }) => <div className="rechner rounded-xl border border-navy-200 bg-white p-4 sm:p-6">{children}</div>;
