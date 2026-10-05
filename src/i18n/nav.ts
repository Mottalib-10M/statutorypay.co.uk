import { route, type Locale } from './routes';
import { PAGES, pageById } from '../lib/guides';
import type { Group } from '../lib/guide-types';
export interface NavLink { href: string; label: string } export interface NavCategory { label: string; links: NavLink[] }
const CORE: Record<string, string> = { home: 'Home', method: 'Method and sources', about: 'About', widget: 'Embed a calculator', contact: 'Contact', editorial: 'Editorial policy', privacy: 'Privacy', terms: 'Legal notice', cookies: 'Cookies' };
const GROUP_LABEL: Record<Group, string> = { redundancy: 'Redundancy', leaving: 'Notice and final pay', holiday: 'Holiday', family: 'Family leave', sickness: 'Sick pay', nations: 'Northern Ireland' };
export const groupLabel = (g: Group) => GROUP_LABEL[g];
export const label = (id: string, _lang: Locale = 'en') => CORE[id] ?? pageById(id)?.nav ?? id;
const link = (id: string, lang: Locale): NavLink => ({ href: route(id, lang), label: label(id, lang) });
const inGroup = (g: Group, lang: Locale) => PAGES.filter((p) => p.group === g).map((p) => link(p.id, lang));
export function navCategories(lang: Locale): NavCategory[] {
  return (['redundancy', 'leaving', 'holiday', 'family', 'sickness', 'nations'] as Group[]).map((g) => ({ label: GROUP_LABEL[g], links: inGroup(g, lang) })).filter((c) => c.links.length);
}
export const navDirect = (lang: Locale): NavLink[] => [link('method', lang)];
export const footerColumns = (lang: Locale): NavCategory[] => [...navCategories(lang), { label: 'This site', links: ['home', 'method', 'about', 'contact', 'editorial', 'widget', 'terms', 'privacy', 'cookies'].map((i) => link(i, lang)) }];
export const popularLinks = (_lang: Locale): NavLink[] => [];
