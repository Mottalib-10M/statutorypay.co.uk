/** Writing helpers (`Helpers`) handed to every page body. */
import { route, ROUTES } from '../i18n/routes';
import { P, type SourceKey } from './engine/params';
import type { Helpers } from './guide-types';
import { formatMoney, formatNumber, formatPercent, displayDate } from './format';

const esc = (s: string | number) => String(s).replace(/&(?!(?:[a-z]+|#\d+);)/g, '&amp;').replace(/</g, '&lt;');

/** `strict`: an unknown page id throws (tests); otherwise the text is left unlinked. */
export function helpers(strict = false, extraIds: string[] = []): Helpers {
  return {
    P,
    a: (id, text) => {
      if (!ROUTES.some((r) => r.id === id)) { if (extraIds.includes(id)) return `<a href="/en/${id}/">${text}</a>`; if (strict) throw new Error(`Unknown page id in a link: ${id}`); return text; }
      return `<a href="${route(id, 'en')}">${text}</a>`;
    },
    gbp: (n, d = 0) => formatMoney(n, d),
    num: (n, d = 0) => formatNumber(n, d),
    pct: (x, d = 1) => formatPercent(x, d),
    date: (iso) => displayDate(iso, 'en-GB'),
    src: (key: SourceKey, text?: string) => { const s = P.sources[key]; return `<a href="${s.url}" target="_blank" rel="nofollow noopener noreferrer">${text ?? s.label.en}</a>`; },
    table: (headers, rows, caption, align = []) => {
      const al = (i: number) => (align[i] === 'r' ? 'text-right' : 'text-left');
      return `<div class="not-prose my-6 overflow-x-auto"><table class="w-full text-sm">${caption ? `<caption class="mb-2 text-left text-sm text-navy-600">${caption}</caption>` : ''}<thead><tr>${headers.map((h, i) => `<th scope="col" class="border-b border-navy-300 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-navy-700 ${al(i)}">${h}</th>`).join('')}</tr></thead><tbody>${rows.map((r) => `<tr>${r.map((c, i) => `<td class="tabular-nums border-b border-navy-100 px-3 py-2 text-navy-800 ${al(i)}">${typeof c === 'number' ? esc(formatNumber(c, 0)) : c}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
    },
  };
}
