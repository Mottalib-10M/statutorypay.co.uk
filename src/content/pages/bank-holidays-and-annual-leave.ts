import { definePage } from '../../lib/guide-types';
import { P } from '../../lib/engine/params';
import { bankHolidaysBetween, bankHolidayProRata, entitlementDays, type Nation } from '../../lib/engine/holiday';
import { dayOfWeek } from '../../lib/engine/dates';
import { displayDate, formatNumber } from '../../lib/format';

const H = P.holiday;
const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const d = (iso: string) => displayDate(iso, 'en-GB');
const wd = (iso: string) => `${DAYS[dayOfWeek(iso)]} ${d(iso)}`;
const NATIONS: Array<[Nation, string]> = [['england-and-wales', 'England and Wales'], ['scotland', 'Scotland'], ['northern-ireland', 'Northern Ireland']];
const y26 = (n: Nation) => bankHolidaysBetween(n, '2026-01-01', '2026-12-31');
const y27 = (n: Nation) => bankHolidaysBetween(n, '2027-01-01', '2027-12-31');
/** One row per holiday name, with its 2026 and 2027 dates (or a dash when it does not occur). */
const rows = (n: Nation) => {
  const names = [...new Set([...y26(n), ...y27(n)].map(([, name]) => name))];
  return names.map((name) => {
    const a = y26(n).find(([, x]) => x === name); const b = y27(n).find(([, x]) => x === name);
    return [name, a ? wd(a[0]) : 'Not a bank holiday', b ? wd(b[0]) : 'Not a bank holiday'];
  });
};
const count = Object.fromEntries(NATIONS.map(([n]) => [n, y26(n).length])) as Record<Nation, number>;
const worldCup = y26('scotland').find(([, name]) => /World Cup/.test(name))!;
const xmas27 = y27('england-and-wales').find(([, name]) => /Christmas/.test(name))!;
const full = entitlementDays(5);
const boxing27 = y27('england-and-wales').find(([, name]) => /Boxing/.test(name))!;
const stPat = y26('northern-ireland').find(([, name]) => /Patrick/.test(name))!;
const boyne26 = y26('northern-ireland').find(([, name]) => /Boyne/.test(name))!;
const boyne27 = y27('northern-ireland').find(([, name]) => /Boyne/.test(name))!;
const plus = H.basicWeeks * 5; // a contract of four weeks plus bank holidays

export default definePage({
  id: 'bank-holidays-and-annual-leave',
  group: 'holiday',
  order: 70,
  tool: 'bankHolidays',
  related: ['part-time-holiday-entitlement', 'holiday-entitlement-calculator', 'booking-holiday-notice', 'northern-ireland-employment-rights', 'holiday-pay-calculator'],
  sources: ['govBankHolidays', 'nidBankHolidays', 'govHoliday', 'nidHoliday', 'hol_wtr15', 'hol_ptwr5'],
  slug: 'bank-holidays-and-annual-leave',
  nav: 'Bank holidays and leave',
  card: 'The 2026 and 2027 bank holidays in each nation, and how they sit in your 5.6 weeks.',
  title: 'Bank Holidays 2026 and 2027: Annual Leave Rules by Nation',
  description: `Bank holidays 2026 and 2027 for England and Wales (${count['england-and-wales']}), Scotland (${count.scotland}) and Northern Ireland (${count['northern-ireland']}): whether you get the day off, extra pay, and pro rata leave.`,
  h1: 'Bank holidays and annual leave in each UK nation',
  intro: 'The dates for 2026 and 2027, nation by nation, and what the law does and does not say about time off and pay on those days.',
  resume: `In 2026 there are ${count['england-and-wales']} bank holidays in England and Wales, ${count.scotland} in Scotland, including the one-off World Cup bank holiday on ${wd(worldCup[0])} and 2 January, and ${count['northern-ireland']} in Northern Ireland, where St Patrick’s Day and the Battle of the Boyne are added. None of them carries a statutory right to a day off or to extra pay: GOV.UK says bank holidays do not have to be given as paid leave, and nidirect that there is no automatic right to an enhanced rate for working one. An employer can count them as part of the ${H.statutoryWeeks} weeks of statutory leave, so a full-timer on the legal minimum of ${full} days in England and Wales has ${full - count['england-and-wales']} days left to book once the bank holidays are taken. Where full-timers get bank holidays on top of their leave, part-timers are owed a proportionate share, ${formatNumber(bankHolidayProRata(count['england-and-wales'], 3), 1)} days on a three-day week in England and Wales in 2026.`,
  faqs: [
    { q: 'Does my employer have to pay me extra for working on a bank holiday?', a: 'No. There is no statutory premium for bank holiday work anywhere in the UK. nidirect states that any right to time off or extra pay depends on your contract, and the same is true in Great Britain. Many contracts pay time and a half or give a day in lieu; check the contract, the staff handbook or any collective agreement.' },
    { q: `Is ${d(worldCup[0])} a bank holiday in England?`, a: `No. The ${worldCup[1]} on ${wd(worldCup[0])} is a Scottish bank holiday only, listed on GOV.UK for Scotland. England, Wales and Northern Ireland have no extra day. Even in Scotland it gives no automatic right to a day off: it depends on whether your contract gives bank holidays as leave, and how.` },
    { q: 'Why does Northern Ireland have more bank holidays than England?', a: `Northern Ireland has ${count['northern-ireland']} in 2026 against ${count['england-and-wales']} in England and Wales because it adds St Patrick’s Day on ${d(stPat[0]).replace(/ \d{4}$/, '')} and the Battle of the Boyne (Orangemen’s Day) in July. The statutory leave entitlement is the same ${H.statutoryWeeks} weeks, so a full-timer whose bank holidays are counted inside it has fewer days left to choose.` },
    { q: `Christmas Day 2027 falls on a Saturday. Which day is the bank holiday?`, a: `${wd(xmas27[0])}, as a substitute day, with Boxing Day on ${wd(boxing27[0])}. When a bank holiday falls at a weekend the substitute is normally the following Monday, as nidirect explains, and GOV.UK publishes the substitute dates for each nation. Whether you get the day off still depends on your contract.` },
    { q: 'Can my employer make me take annual leave on bank holidays?', a: 'Yes. GOV.UK says employers can tell staff to take leave, giving bank holidays and Christmas as examples. Under regulation 15 of the Working Time Regulations the notice must be at least twice as many days as the leave required, so two days’ notice for one bank holiday, unless the contract says otherwise. It is common for contracts to fix this in advance.' },
  ],
  body: (h) => `
<h2>Bank holidays by nation, 2026 and 2027</h2>
${NATIONS.map(([n, name]) => h.table(['Holiday', '2026', '2027'], rows(n), `${name}: ${y26(n).length} bank holidays in 2026, ${y27(n).length} in 2027 (${h.src('govBankHolidays', 'GOV.UK')}).`, ['l', 'l', 'l'])).join('\n')}
<p>Scotland’s Summer bank holiday is the first Monday of August, not the last; its 2 January holiday moves to ${h.date(y27('scotland').find(([, x]) => x === '2nd January')![0])} because 2 January is a Saturday. In Northern Ireland the Battle of the Boyne holiday is on ${wd(boyne26[0])}, a substitute day because 12 July 2026 is a Sunday, and on ${wd(boyne27[0])} the following year (${h.src('nidBankHolidays', 'nidirect, Bank holidays')}).</p>

<h2>Inside or on top of the ${H.statutoryWeeks} weeks</h2>
<p>The law sets the total, not the days. A contract can say “${full} days including bank holidays”, which meets the statutory minimum for a five-day week, or “${plus} days plus bank holidays”, which reaches ${plus + count['england-and-wales']} days in England and Wales. What it cannot do is go below ${H.statutoryWeeks} weeks once both are counted. If bank holidays are given on top and you work part-time, your share is pro rata to the days you work, as regulation 5 of the ${h.src('hol_ptwr5', 'Part-time Workers Regulations 2000')} requires in Great Britain and nidirect confirms for Northern Ireland. The tool above counts the bank holidays inside your own leave year, which matters when the year runs from April or from your start date.</p>
`,
});
