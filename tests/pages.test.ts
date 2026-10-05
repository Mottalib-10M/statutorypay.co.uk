/**
 * Every page file is checked here before the build (RECETTE §7, §11, §21): snippet lengths, key term
 * first, citable block, FAQ bounds and uniqueness, links, sources, mini-simulators.
 * Check one file alone: PAGE_FILES=<id> npx vitest run tests/pages.test.ts
 */
import { describe, expect, it } from 'vitest';
import { PAGES } from '../src/lib/guides';
import { HOME } from '../src/content/home';
import { helpers } from '../src/lib/helpers';
import { P } from '../src/lib/engine/params';
import { MINIS, getSpec } from '../src/lib/mini-specs';
import { ROUTES } from '../src/i18n/routes';

/** Pages planned but possibly not written yet while the site is being built: accepted as link targets.
 *  TO EMPTY once every page exists (then any link to a missing page fails). */
const PLANNED: string[] = [
  'redundancy-pay-calculator', 'statutory-redundancy-pay', 'redundancy-pay-table', 'redundancy-pay-cap', 'redundancy-relevant-date', 'redundancy-pay-tax', 'voluntary-redundancy', 'redundancy-variable-pay', 'redundancy-consultation', 'redundancy-time-off-job-hunting', 'lay-off-short-time-redundancy', 'suitable-alternative-employment', 'redundancy-maternity-leave',
  'notice-period-calculator', 'statutory-notice-period', 'payment-in-lieu-of-notice', 'resignation-notice-period', 'final-pay-calculator', 'weeks-pay-explained', 'employment-status-rights',
  'holiday-entitlement-calculator', 'holiday-pay-calculator', 'part-time-holiday-entitlement', 'irregular-hours-holiday-calculator', 'rolled-up-holiday-pay', 'holiday-pay-when-leaving', 'bank-holidays-and-annual-leave', 'carry-over-holiday', 'holiday-first-year', 'holiday-pay-overtime-commission', 'holiday-during-sick-leave', 'term-time-part-year-holiday', 'zero-hours-holiday-pay', 'booking-holiday-notice', 'holiday-on-maternity-leave',
  'maternity-pay-calculator', 'statutory-maternity-pay', 'maternity-leave-dates-calculator', 'smp-average-weekly-earnings', 'maternity-allowance', 'enhanced-maternity-pay', 'keeping-in-touch-days', 'paternity-pay-calculator', 'paternity-leave-2026', 'shared-parental-pay-calculator', 'adoption-pay-calculator', 'neonatal-care-pay', 'parental-bereavement-pay', 'unpaid-parental-leave',
  'statutory-sick-pay-calculator', 'statutory-sick-pay', 'ssp-changes-april-2026', 'ssp-linked-periods', 'fit-note-rules', 'company-sick-pay-vs-ssp', 'ssp-part-time-multiple-jobs',
  'redundancy-pay-northern-ireland', 'northern-ireland-employment-rights', 'method', 'about',
];
const known = (id: string) => ROUTES.some((r) => r.id === id) || PLANNED.includes(id);
const only = process.env.PAGE_FILES?.split(',').map((s) => s.trim()).filter(Boolean);
const pages = only?.length ? PAGES.filter((p) => only.includes(p.id)) : PAGES;
const words = (s: string) => s.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length;
const FORBIDDEN_START = /^(uk |united kingdom|british|calculator\b|calculate\b|about\b|faq\b|methodology\b|how\b|what\b|when\b)/i;
const STOCK = /(it'?s important to note|dive into|delve|whether you'?re|in today'?s world|moreover,|furthermore,)/i;

describe('pages', () => {
  it('there are pages', () => expect(pages.length).toBeGreaterThan(0));
  for (const p of pages) {
    describe(p.id, () => {
      const body = p.body(helpers(true, PLANNED));
      it('snippets: title 50-60, description 150-160, key term first, year present', () => {
        expect(p.title.length, p.title).toBeGreaterThanOrEqual(50); expect(p.title.length, p.title).toBeLessThanOrEqual(60);
        expect(p.description.length, p.description).toBeGreaterThanOrEqual(150); expect(p.description.length, p.description).toBeLessThanOrEqual(160);
        expect(p.title).toMatch(/2026/); expect(p.description).toMatch(/2026/);
        expect(FORBIDDEN_START.test(p.title), p.title).toBe(false);
        expect(/[—]/.test(p.title + p.description)).toBe(false);
      });
      it('slug: lower case, no year, no 3-digit number, no service word', () => {
        expect(p.slug).toMatch(/^[a-z0-9-]+$/); expect(p.slug).not.toMatch(/20\d\d|\b\d{3}\b/);
        expect(p.slug).not.toMatch(/(^|-)(contact|legal|method|cookie|privacy|about|terms)(-|$)/);
      });
      it('citable block: one paragraph of 120 words or more', () => {
        expect(words(p.resume), p.resume.slice(0, 60)).toBeGreaterThanOrEqual(120);
        expect(p.resume).not.toMatch(/\n\s*\n|<p>/);
      });
      it('FAQ: 3 to 8 questions, answers of 40 to 90 words', () => {
        expect(p.faqs.length).toBeGreaterThanOrEqual(3); expect(p.faqs.length).toBeLessThanOrEqual(8);
        for (const f of p.faqs) { const n = words(f.a); expect(n, `${f.q} (${n} words)`).toBeGreaterThanOrEqual(40); expect(n, `${f.q} (${n} words)`).toBeLessThanOrEqual(90); }
      });
      it('length: guides 1,050 words or more (resume + body + FAQ), tools 300 or more', () => {
        const n = words(p.resume) + words(body) + p.faqs.reduce((s, f) => s + words(f.q) + words(f.a), 0);
        expect(n, `${n} words`).toBeGreaterThanOrEqual(p.tool ? 300 : 1050);
      });
      it('no em dash, no stock phrases', () => {
        const all = [p.title, p.description, p.h1, p.intro, p.resume, body, ...p.faqs.flatMap((f) => [f.q, f.a])].join(' ');
        expect(/—|&mdash;|&#8212;/.test(all)).toBe(false);
        expect(STOCK.test(all), all.match(STOCK)?.[0]).toBe(false);
      });
      it('related and sources exist; a guide has a mini-simulator', () => {
        expect(p.related.length).toBeGreaterThanOrEqual(3);
        for (const id of p.related) expect(known(id), id).toBe(true);
        expect(p.sources.length).toBeGreaterThanOrEqual(2);
        for (const k of p.sources) expect(P.sources[k], k).toBeTruthy();
        if (!p.tool) { expect(p.mini, 'mini').toBeTruthy(); expect(MINIS[p.mini!], p.mini).toBeTruthy(); }
        for (const m of body.matchAll(/<!--mini:([A-Za-z0-9_]+)-->/g)) expect(MINIS[m[1]], m[1]).toBeTruthy();
      });
      it('H1 has no year, body uses h2 and no h1', () => {
        expect(p.h1).not.toMatch(/20\d\d/); expect(body).not.toMatch(/<h1/i); expect(body).toMatch(/<h2/);
      });
    });
  }
});

describe('site-wide uniqueness', () => {
  it('ids, slugs, titles and descriptions are unique', () => {
    for (const k of ['id', 'slug', 'title', 'description'] as const) {
      const v = PAGES.map((p) => p[k]); expect(new Set(v).size, k).toBe(v.length);
    }
  });
  it('a FAQ question appears on one page only (home included)', () => {
    const qs = [...PAGES.flatMap((p) => p.faqs.map((f) => f.q.toLowerCase())), ...HOME.faqs.map((f) => f.q.toLowerCase())];
    const dup = qs.filter((q, i) => qs.indexOf(q) !== i);
    expect(dup).toEqual([]);
  });
  it('home snippets', () => {
    expect(HOME.title.length).toBeGreaterThanOrEqual(50); expect(HOME.title.length).toBeLessThanOrEqual(60);
    expect(HOME.description.length).toBeGreaterThanOrEqual(150); expect(HOME.description.length).toBeLessThanOrEqual(160);
    expect(words(HOME.resume)).toBeGreaterThanOrEqual(120);
  });
});

describe('mini-simulators run on their defaults', () => {
  for (const [kind] of Object.entries(MINIS)) {
    it(kind, () => {
      const spec = getSpec(kind);
      const out = spec.run(Object.fromEntries(spec.inputs.map((i) => [i.id, i.def])));
      expect(out.head[1]).not.toMatch(/NaN|undefined|Infinity/);
      for (const [, v] of out.rows) expect(v).not.toMatch(/NaN|undefined|Infinity/);
      expect(spec.inputs.length).toBeGreaterThanOrEqual(1); expect(spec.inputs.length).toBeLessThanOrEqual(3);
    });
  }
});
