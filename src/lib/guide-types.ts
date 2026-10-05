/**
 * One page = ONE data file in `src/content/pages/<id>.ts`. It carries everything: URL, title,
 * description, H1, intro, citable block, FAQ, body, sources, mini-simulator or full tool, related
 * pages. The core (routes, menus, footer, sitemap, schemas, internal links) reads it alone.
 * How to add a page: CONTRIBUTING-PAGES.md at the repository root.
 */
import type { SourceKey, Params } from './engine/params';

export type Group = 'redundancy' | 'leaving' | 'holiday' | 'family' | 'sickness' | 'nations';
export interface FAQ { q: string; a: string }
export type ToolKind = 'redundancy' | 'reckoner' | 'notice' | 'final' | 'holiday' | 'holidayPay' | 'leavingHoliday' | 'irregular' | 'bankHolidays' | 'smp' | 'maternityDates' | 'paternity' | 'shared' | 'adoption' | 'ssp';

/** Writing helpers passed to each page body. */
export interface Helpers {
  /** Internal link to another page by id (unknown id = test failure). */
  a: (id: string, text: string) => string;
  /** Pounds, no decimals by default (“£1,234”). */
  gbp: (n: number, decimals?: number) => string;
  /** Number in en-GB format. */
  num: (n: number, decimals?: number) => string;
  /** Percentage from a fraction (0.1207 → “12.07%”, decimals given). */
  pct: (x: number, decimals?: number) => string;
  /** ISO date written out (“6 April 2026”). */
  date: (iso: string) => string;
  /** Newspaper-style table. */
  table: (headers: string[], rows: Array<Array<string | number>>, caption?: string, align?: Array<'l' | 'r'>) => string;
  /** Link to an official source of the parameter file. */
  src: (key: SourceKey, text?: string) => string;
  /** 2026/27 parameters: every statutory value is read here, never typed in a page. */
  P: Params;
}

export interface PageDef {
  id: string;
  group: Group;
  /** Order inside its menu group (small = top), steps of 10. */
  order: number;
  /** Full calculator of the page (tool pages only). */
  tool?: ToolKind;
  /** Mini-simulator after the citable block (file `src/lib/minis/<kind>.ts`). Ignored if `tool`. */
  mini?: string;
  /** Page the mini-simulator button points to (default: the group's main calculator). */
  miniHref?: string;
  /** 3 to 6 ids of related pages. */
  related: string[];
  /** Keys of `params-2026.json > sources` (2 at least). */
  sources: SourceKey[];
  /** URL segment: lower case, hyphens. No year, no 3-digit number. */
  slug: string;
  /** Short label for menus and breadcrumb. */
  nav: string;
  /** One sentence for “related pages” cards. */
  card: string;
  /** 50 to 60 characters, key term first, year included (RECETTE §11). */
  title: string;
  /** 150 to 160 characters, year included. */
  description: string;
  h1: string;
  /** One-sentence standfirst under the H1. */
  intro: string;
  /** Citable block: ONE paragraph of 120 words or more, with the figures (RECETTE §21). */
  resume: string;
  /** 4 to 8 questions unique to the page, answers of 40 to 90 words (RECETTE §7). */
  faqs: FAQ[];
  /** HTML body (h2, h3, p, ul, ol, tables through h.table). `<!--mini:kind-->` inserts another mini-simulator. */
  body: (h: Helpers) => string;
}

export const definePage = (g: PageDef): PageDef => g;
