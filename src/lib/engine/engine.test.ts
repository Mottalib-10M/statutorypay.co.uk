/**
 * Engine tests. Reference cases come from official material, cited case by case:
 *  - GOV.UK smart-answers test suite (alphagov/smart-answers, RedundancyCalculatorTest,
 *    HolidayEntitlementTest), the code behind the GOV.UK calculators;
 *  - nidirect worked examples (Redundancy pay);
 *  - HMRC Rates and thresholds 2026 to 2027, SSP daily-rate tables;
 *  - the Increase of Limits Orders 2023-2026 (GB and NI).
 */
import { describe, expect, it } from 'vitest';
import { P, redundancyCapOn, CAP_GB, CAP_NI, MAX_REDUNDANCY_GB, MAX_REDUNDANCY_NI, familyRateOn, lelOn } from './params';
import { addYears, fullYears, fullMonths, firstSundayOfApril, weekStartSunday, diffDays } from './dates';
import { computeRedundancy, reckonerWeeks } from './redundancy';
import { computeNotice, statutoryNoticeWeeks } from './notice';
import { entitlementDays, entitlementHours, entitlementShifts, proRataDays, irregularAccrual, rolledUp, holidayPay, leavingPay, bankHolidaysBetween, ceilTo, averageWeeksPay } from './holiday';
import { birthDates, computeSmp, computeSpp, smpSchedule, sharedParental, adoptionDates, uprating } from './family';
import { computeSsp, sspForDays, weeklySsp, linked } from './ssp';
import { computeFinal } from './final';

const govFmt = (x: number) => ceilTo(x, 0.1); // GOV.UK shows days rounded up to one decimal

describe('parameters 2026/27 read at source', () => {
  it('redundancy caps by relevant date, GB and NI', () => {
    expect(CAP_GB).toBe(751); expect(CAP_NI).toBe(783);
    expect(MAX_REDUNDANCY_GB).toBe(22530); expect(MAX_REDUNDANCY_NI).toBe(23490);
    expect(redundancyCapOn('2026-04-05')).toBe(719);
    expect(redundancyCapOn('2026-04-06')).toBe(751);
    expect(redundancyCapOn('2025-04-06')).toBe(719);
    expect(redundancyCapOn('2024-12-01')).toBe(700);
    expect(redundancyCapOn('2023-06-01')).toBe(643);
    expect(redundancyCapOn('2026-04-05', 'NI')).toBe(749);
    expect(redundancyCapOn('2026-04-06', 'NI')).toBe(783);
  });
  it('family and sick pay rates', () => {
    expect(P.ssp.weeklyRate).toBe(123.25);
    expect(familyRateOn('2026-06-01')).toBe(194.32);
    expect(lelOn('2026-04-11')).toBe(129);
    expect(lelOn('2026-04-04')).toBe(125);
    expect(firstSundayOfApril(2026)).toBe('2026-04-05');
    expect(firstSundayOfApril(2027)).toBe('2027-04-04');
  });
});

describe('dates', () => {
  it('ages and service', () => {
    expect(fullYears('1984-02-29', '2025-02-28')).toBe(41);
    expect(fullYears('2020-01-01', '2025-12-31')).toBe(5);
    expect(fullMonths('2026-01-31', '2026-02-27')).toBe(0); expect(fullMonths('2026-01-31', '2026-02-28')).toBe(1);
    expect(addYears('2024-02-29', 1)).toBe('2025-02-28');
    expect(weekStartSunday('2026-10-07')).toBe('2026-10-04');
  });
});

describe('redundancy: GOV.UK ready reckoner cases (smart-answers RedundancyCalculatorTest)', () => {
  const cases: Array<[number, number, number]> = [
    // age at relevant date, complete years, expected weeks
    [45, 12, 14], [42, 22, 20.5], [41, 4, 4], [18, 3, 1.5], [26, 11, 7.5], [32, 11, 10.5], [34, 15, 13.5], [40, 20, 19], [48, 14, 17.5], [61, 20, 30],
  ];
  for (const [age, years, weeks] of cases) it(`age ${age}, ${years} years → ${weeks} weeks`, () => expect(reckonerWeeks(age, years)).toBe(weeks));
});

describe('redundancy from real dates', () => {
  it('nidirect example one: 45, 15 years → 17 weeks (NI cap £783)', () => {
    const r = computeRedundancy({ dob: '1981-03-10', start: '2011-05-01', noticeGiven: '2026-06-01', end: '2026-09-01', weeklyPay: 600, jurisdiction: 'NI' });
    expect(r.countedYears).toBe(15); expect(r.ageAtRelevantDate).toBe(45); expect(r.weeks).toBe(17); expect(r.amount).toBe(10200);
  });
  it('nidirect example two: 30, 10 years, £450 → 9 weeks, £4,050', () => {
    const r = computeRedundancy({ dob: '1996-03-01', start: '2016-06-01', noticeGiven: '2026-07-01', end: '2026-08-31', weeklyPay: 450 });
    expect(r.weeks).toBe(9); expect(r.amount).toBe(4050);
  });
  it('cap follows the relevant date (s.145(2)), not the date notice was given', () => {
    const base = { dob: '1960-01-01', start: '2000-01-01', weeklyPay: 1000 } as const;
    const before = computeRedundancy({ ...base, noticeGiven: '2026-01-05', end: '2026-04-05' });
    const after = computeRedundancy({ ...base, noticeGiven: '2026-01-05', end: '2026-04-06' });
    expect(before.cap).toBe(719); expect(after.cap).toBe(751);
    expect(after.amount).toBe(22530);
  });
  it('s.145(5): pay in lieu extends the date used for service and age', () => {
    // 1 year 11 months on the day of dismissal without notice: statutory notice of 1 week does not
    // reach 2 years, so not eligible; with 12 years' service a dismissal without notice is extended 12 weeks.
    const short = computeRedundancy({ dob: '1990-01-01', start: '2024-07-01', noticeGiven: '2026-06-20', end: '2026-06-20', weeklyPay: 500 });
    expect(short.eligible).toBe(false); expect(short.reason).toBe('service');
    const pilon = computeRedundancy({ dob: '1985-05-01', start: '2014-07-01', noticeGiven: '2026-05-01', end: '2026-05-01', weeklyPay: 500 });
    expect(pilon.statutoryNoticeWeeks).toBe(11);
    expect(pilon.extended).toBe(true); expect(pilon.extendedDate).toBe('2026-07-17');
    expect(pilon.completeYears).toBe(12); // reaches 12 years only thanks to the extension
    expect(pilon.ageAtRelevantDate).toBe(41);
  });
  it('a year counts at 1.5 only when the employee was 41 or over throughout it', () => {
    const r = computeRedundancy({ dob: '1985-06-01', start: '2016-01-01', noticeGiven: '2026-03-01', end: '2026-06-01', weeklyPay: 400 });
    expect(r.lines[0].age).toBe(40); expect(r.lines[0].weeks).toBe(1);
  });
  it('under two years is not eligible, and the next year date is given', () => {
    const r = computeRedundancy({ dob: '1990-01-01', start: '2025-01-15', noticeGiven: '2026-09-01', end: '2026-09-08', weeklyPay: 600 });
    expect(r.eligible).toBe(false); expect(r.nextYearOn).toBe('2027-01-14');
  });
  it('claim window of six months', () => {
    const r = computeRedundancy({ dob: '1980-01-01', start: '2010-01-01', noticeGiven: '2026-06-01', end: '2026-08-31', weeklyPay: 600 });
    expect(r.claimDeadline).toBe('2027-02-27');
  });
});

describe('notice (ERA s.86)', () => {
  it('scale', () => {
    expect(statutoryNoticeWeeks('2026-09-10', '2026-10-05')).toBe(0);
    expect(statutoryNoticeWeeks('2026-01-01', '2026-10-05')).toBe(1);
    expect(statutoryNoticeWeeks('2023-10-06', '2026-10-05')).toBe(3);
    expect(statutoryNoticeWeeks('2000-01-01', '2026-10-05')).toBe(12);
  });
  it('contract longer than statute wins; end date and pay', () => {
    const n = computeNotice({ start: '2021-03-01', noticeGiven: '2026-10-05', contractualWeeks: 4, weeklyPay: 700 });
    expect(n.statutoryWeeks).toBe(5); expect(n.appliedWeeks).toBe(5); expect(n.ruleApplied).toBe('statutory');
    expect(n.endDate).toBe('2026-11-09'); expect(n.noticePay).toBe(3500); expect(n.nextStepUp).toBe('2027-02-28');
  });
  it('employee resigning owes one week', () => {
    expect(computeNotice({ start: '2015-01-01', noticeGiven: '2026-10-05', contractualWeeks: 0, weeklyPay: 0, byEmployee: true }).appliedWeeks).toBe(1);
  });
});

describe('holiday entitlement: GOV.UK cases (smart-answers HolidayEntitlementTest)', () => {
  it('full year by days', () => {
    expect(entitlementDays(5)).toBe(28); expect(entitlementDays(6)).toBe(28); expect(govFmt(entitlementDays(3.5))).toBeCloseTo(19.6);
    expect(govFmt(entitlementDays(2))).toBeCloseTo(11.2); expect(govFmt(entitlementDays(0.5))).toBeCloseTo(2.8);
  });
  it('hours and shifts', () => {
    expect(entitlementHours(37.5, 5)).toBeCloseTo(210); expect(entitlementHours(40, 6)).toBeCloseTo(186.6667, 3);
    expect(entitlementShifts(4, 8)).toBeCloseTo(19.6);
  });
  const starter: Array<[string, string, number, number]> = [
    ['2019-06-01', '2019-01-01', 5, 16.5], ['2019-11-23', '2019-04-01', 3, 7], ['2019-11-14', '2019-01-01', 6, 5], ['2020-06-01', '2020-01-01', 5, 16.5],
    ['2021-02-09', '2020-08-01', 3, 8.5], ['2019-09-23', '2019-05-01', 5, 19], ['2020-02-13', '2019-07-01', 1, 2.5], ['2018-10-28', '2018-04-01', 1, 3], ['2019-05-10', '2018-06-06', 2, 1], ['2020-03-03', '2020-03-01', 4, 22.5],
  ];
  for (const [start, ys, d, exp] of starter) it(`starter ${start} (year ${ys}, ${d} days) → ${exp}`, () => expect(govFmt(proRataDays({ daysPerWeek: d, yearStart: ys, start }).shown)).toBeCloseTo(exp));
  const leaver: Array<[string, string, number, number]> = [
    ['2019-06-01', '2019-01-01', 5, 11.7], ['2018-11-23', '2018-04-01', 3, 11], ['2020-06-01', '2020-01-01', 5, 11.8], ['2019-11-23', '2019-04-01', 3, 10.9], ['2020-08-22', '2020-01-01', 6, 18],
  ];
  for (const [leave, ys, d, exp] of leaver) it(`leaver ${leave} (year ${ys}, ${d} days) → ${exp}`, () => expect(govFmt(proRataDays({ daysPerWeek: d, yearStart: ys, leave }).shown)).toBeCloseTo(exp));
  it('irregular hours: 12.07%, nearest hour (GOV.UK example: 30 hours → 4)', () => {
    expect(irregularAccrual(30).credited).toBe(4);
    expect(irregularAccrual(4).credited).toBe(0);
    expect(irregularAccrual(160).credited).toBe(19);
    expect(rolledUp(1000)).toBeCloseTo(120.7);
  });
});

describe('holiday pay', () => {
  it('normal rate for 4 weeks, basic rate for 1.6 weeks (regular hours)', () => {
    const r = holidayPay({ basicWeek: 500, extrasWeek: 100, daysPerWeek: 5, daysTaken: 28, irregular: false });
    expect(r.daysAtNormal).toBe(20); expect(r.daysAtBasic).toBe(8);
    expect(r.pay).toBeCloseTo(20 * 120 + 8 * 100); expect(r.annualPay).toBeCloseTo(3200);
  });
  it('irregular hours: everything at normal rate', () => {
    expect(holidayPay({ basicWeek: 300, extrasWeek: 60, daysPerWeek: 4, daysTaken: 22.4, irregular: true }).pay).toBeCloseTo(22.4 * 90);
  });
  it('52-week average over paid weeks only', () => {
    expect(averageWeeksPay(26000, 52)).toBe(500); expect(averageWeeksPay(13000, 26)).toBe(500); expect(averageWeeksPay(30000, 60)).toBeCloseTo(30000 / 52);
  });
  it('payment in lieu on leaving: (A × B) − C', () => {
    const r = leavingPay({ daysPerWeek: 5, yearStart: '2026-01-01', leave: '2026-06-30', taken: 6, weekPay: 600 });
    expect(r.B).toBeCloseTo(181 / 365); expect(r.days).toBeCloseTo(28 * 181 / 365 - 6); expect(r.pay).toBeCloseTo(r.days * 120);
  });
  it('bank holidays 2026 by nation (gov.uk/bank-holidays.json)', () => {
    expect(bankHolidaysBetween('england-and-wales', '2026-01-01', '2026-12-31')).toHaveLength(8);
    expect(bankHolidaysBetween('scotland', '2026-01-01', '2026-12-31')).toHaveLength(10);
    expect(bankHolidaysBetween('northern-ireland', '2026-01-01', '2026-12-31')).toHaveLength(10);
  });
});

describe('maternity and family pay 2026/27', () => {
  it('key dates (structure of HMRC calculator: due 9 Apr 2012 → QW 25-31 Dec 2011, start by 9 Jul 2011)', () => {
    const d = birthDates('2012-04-09');
    expect(d.ewcStart).toBe('2012-04-08'); expect(d.qwStart).toBe('2011-12-25'); expect(d.qwEnd).toBe('2011-12-31');
    expect(d.startedBy).toBe('2011-07-09'); expect(d.earliestLeave).toBe('2012-01-22'); expect(d.sicknessTrigger).toBe('2012-03-11');
  });
  it('SMP at £600 a week, leave from 1 March 2026: all flat weeks at £194.32', () => {
    const s = smpSchedule(600, '2026-03-01');
    expect(s.weeks[0].amount).toBe(540); expect(s.weeks[6].amount).toBe(194.32);
    expect(s.total).toBeCloseTo(6 * 540 + 33 * 194.32, 2);
  });
  it('SMP straddling the April uprating: weeks before 5 April at £187.18', () => {
    const s = smpSchedule(600, '2026-01-04');
    expect(s.weeks[12].amount).toBe(187.18); expect(s.weeks[13].amount).toBe(194.32);
    expect(s.total).toBeCloseTo(3240 + 7 * 187.18 + 26 * 194.32, 2);
  });
  it('uprating follows the weekday of the leave start (Wednesday start → 8 April 2026)', () => {
    expect(uprating(2026, '2026-01-07')).toBe('2026-04-08');
  });
  it('low earner: 90% of AWE throughout', () => {
    expect(smpSchedule(200, '2026-06-07').total).toBeCloseTo(39 * 180, 2);
  });
  it('weeks after April 2027 are flagged: the 2027/28 rate is not set yet', () => {
    expect(smpSchedule(600, '2026-12-06').unknownRateWeeks).toBeGreaterThan(0);
  });
  it('eligibility: LEL £129 and 26 weeks into the qualifying week', () => {
    const r = computeSmp({ dueDate: '2027-02-15', leaveStart: '2027-01-31', awe: 128, employmentStart: '2026-01-01' });
    expect(r.dates.qwEnd).toBe('2026-11-07'); expect(r.dates.lel).toBe(129); expect(r.reasons).toContain('earnings');
    const ok = computeSmp({ dueDate: '2027-02-15', leaveStart: '2027-01-31', awe: 129, employmentStart: '2026-05-16' });
    expect(ok.eligible).toBe(true); expect(ok.dates.startedBy).toBe('2026-05-16');
  });
  it('paternity: GB day-one leave since 6 April 2026, NI keeps 26 weeks and 56 days', () => {
    const gb = computeSpp({ dueDate: '2026-12-01', awe: 500, employmentStart: '2026-09-01', weeks: 2, leaveStart: '2026-12-01', jurisdiction: 'GB' });
    expect(gb.leaveEligible).toBe(true); expect(gb.payEligible).toBe(false);
    const ni = computeSpp({ dueDate: '2026-12-01', awe: 500, employmentStart: '2026-09-01', weeks: 2, leaveStart: '2026-12-01', jurisdiction: 'NI' });
    expect(ni.leaveEligible).toBe(false); expect(ni.windowEnd).toBe('2027-01-25');
    const paid = computeSpp({ dueDate: '2026-12-01', awe: 500, employmentStart: '2025-01-01', weeks: 2, leaveStart: '2026-12-01', jurisdiction: 'GB' });
    expect(paid.schedule.total).toBeCloseTo(2 * 194.32, 2);
  });
  it('shared parental: GOV.UK example, 22 weeks taken → 30 weeks SPL, 17 weeks ShPP', () => {
    expect(sharedParental({ leaveWeeksTaken: 22, payWeeksTaken: 22 })).toEqual({ splWeeks: 30, shppWeeks: 17 });
    expect(sharedParental({ leaveWeeksTaken: 0, payWeeksTaken: 0 })).toEqual({ splWeeks: 50, shppWeeks: 37 });
  });
  it('adoption: matching week', () => {
    const a = adoptionDates('2026-10-07');
    expect(a.mwStart).toBe('2026-10-04'); expect(a.lel).toBe(129); expect(diffDays(a.startedBy, a.mwEnd)).toBe(175);
  });
});

describe('statutory sick pay from 6 April 2026', () => {
  it('HMRC daily-rate table, 7 qualifying days', () => {
    expect([1, 2, 3, 4, 5, 6, 7].map((d) => sspForDays(1000, 7, d))).toEqual([17.61, 35.22, 52.83, 70.43, 88.04, 105.65, 123.25]);
  });
  it('HMRC table, 6, 5, 4 and 3 qualifying days', () => {
    expect([1, 2, 3, 4, 5, 6].map((d) => sspForDays(1000, 6, d))).toEqual([20.55, 41.09, 61.63, 82.17, 102.71, 123.25]);
    expect([1, 2, 3, 4, 5].map((d) => sspForDays(1000, 5, d))).toEqual([24.65, 49.3, 73.95, 98.6, 123.25]);
    expect([1, 2, 3, 4].map((d) => sspForDays(1000, 4, d))).toEqual([30.82, 61.63, 92.44, 123.25]);
    expect([1, 2, 3].map((d) => sspForDays(1000, 3, d))).toEqual([41.09, 82.17, 123.25]);
  });
  it('80% of earnings below £154.06 a week', () => {
    expect(weeklySsp(100)).toBe(80); expect(weeklySsp(154.0625)).toBeCloseTo(123.25); expect(weeklySsp(500)).toBe(123.25);
  });
  it('paid from the first day, no waiting days', () => {
    const r = computeSsp({ awe: 600, pattern: [1, 2, 3, 4, 5], firstDay: '2026-10-05', lastDay: '2026-10-07' });
    expect(r.paidDays).toBe(3); expect(r.total).toBe(73.95); expect(r.fitNoteNeeded).toBe(false);
  });
  it('28-week limit across linked periods', () => {
    const r = computeSsp({ awe: 600, pattern: [1, 2, 3, 4, 5], firstDay: '2026-10-05', lastDay: '2026-10-16', alreadyPaidDays: 135 });
    expect(r.paidDays).toBe(5); expect(r.remainingDays).toBe(0); expect(r.exhaustedOn).toBe('2026-10-12');
  });
  it('periods 8 weeks or less apart link', () => {
    expect(linked('2026-06-01', '2026-07-28')).toBe(true); expect(linked('2026-06-01', '2026-07-29')).toBe(false);
  });
  it('sickness that started before the reform is not computed', () => {
    expect(computeSsp({ awe: 600, pattern: [1, 2, 3, 4, 5], firstDay: '2026-04-01', lastDay: '2026-04-20' }).supported).toBe(false);
  });
});

describe('final pay', () => {
  it('£30,000 threshold applies to redundancy pay only', () => {
    const f = computeFinal({ statutoryRedundancy: 22530, extraRedundancy: 15000, noticeWeeks: 12, weeklyPay: 1000, holidayDays: 5, daysPerWeek: 5, arrears: 0 });
    expect(f.withinThreshold).toBe(30000); expect(f.aboveThreshold).toBe(7530); expect(f.earnings).toBe(13000); expect(f.total).toBe(50530);
  });
});

import { firstQualifyingEwc } from './family';
describe('service test for family pay', () => {
  it('earliest qualifying week of childbirth is consistent with birthDates()', () => {
    const start = '2026-03-11';
    const ewc = firstQualifyingEwc(start);
    expect(birthDates(ewc).startedBy >= start).toBe(true);
    expect(birthDates(addDaysT(ewc, -7)).startedBy < start).toBe(true);
  });
});
import { addDays as addDaysT } from './dates';

import { pre2026Ssp, post2026Ssp } from './ssp';
describe('SSP before and after the reform (comparison helper)', () => {
  it('3 days off: nothing before, three days now', () => {
    expect(pre2026Ssp(500, 5, 3).amount).toBe(0); expect(post2026Ssp(500, 5, 3).amount).toBe(73.95);
  });
  it('below £125: nothing before, 80% now', () => {
    expect(pre2026Ssp(100, 5, 10).amount).toBe(0); expect(post2026Ssp(100, 5, 5).amount).toBe(80);
  });
  it('10 days at £500: 7 days at £118.75/5 before', () => {
    expect(pre2026Ssp(500, 5, 10)).toEqual({ paidDays: 7, amount: 166.25 });
  });
});

import { firstYearAccrued, bookingNotice } from './holiday';
describe('holiday: first year and booking notice (GOV.UK examples)', () => {
  it('after the third month, 7 days (28 ÷ 12 × 3); January start gives 2.5 days', () => {
    expect(firstYearAccrued(5, 3)).toBe(7); expect(firstYearAccrued(5, 1)).toBe(2.5); expect(firstYearAccrued(3, 1)).toBe(1.5);
  });
  it('3 days’ notice for 1 day; employer refusal of 10 days needs 11', () => {
    expect(bookingNotice(1).worker).toBe(3); expect(bookingNotice(10).employerRefusal).toBe(11);
  });
});
