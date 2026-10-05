/** Registry of content pages: every file of `src/content/pages/` is loaded here. */
import type { PageDef, Group } from './guide-types';

const mods = import.meta.glob<{ default: PageDef }>('../content/pages/*.ts', { eager: true });

export const PAGES: PageDef[] = Object.entries(mods)
  .map(([file, m]) => {
    const g = m.default;
    const base = file.split('/').pop()!.replace(/\.ts$/, '');
    if (g.id !== base) throw new Error(`${file}: id “${g.id}” differs from the file name`);
    return g;
  })
  .sort((a, b) => a.order - b.order || a.id.localeCompare(b.id));

export const GROUPS: Group[] = ['redundancy', 'leaving', 'holiday', 'family', 'sickness', 'nations'];
/** Main calculator of each group: default target of the mini-simulators' button. */
export const GROUP_TOOL: Record<Group, string> = { redundancy: 'redundancy-pay-calculator', leaving: 'notice-period-calculator', holiday: 'holiday-entitlement-calculator', family: 'maternity-pay-calculator', sickness: 'statutory-sick-pay-calculator', nations: 'redundancy-pay-calculator' };
export const pageById = (id: string) => PAGES.find((p) => p.id === id);
