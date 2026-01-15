// Netherlands Time-Based Salary Calculators (2026)
import { SalaryCalculation } from '../types';
import { calculateNLGrossToNet, NLCalculatorOptions } from './nl';

// Netherlands working hours: 1,872 hours/year (36 hrs/week × 52 weeks average)
const HOURS_PER_YEAR = 1872;
const WEEKS_PER_YEAR = 52;
const MONTHS_PER_YEAR = 12;
const DAYS_PER_YEAR = 260;
const BI_WEEKLY_PERIODS = 26;
const QUARTERS_PER_YEAR = 4;
const SEMI_ANNUAL_PERIODS = 2;

export function calculateHourlyToSalaryNL(hourlyRate: number, options: NLCalculatorOptions = {}): SalaryCalculation {
  return calculateNLGrossToNet(hourlyRate * HOURS_PER_YEAR, options);
}

export function calculateDailyToSalaryNL(dailyRate: number, options: NLCalculatorOptions = {}): SalaryCalculation {
  return calculateNLGrossToNet(dailyRate * DAYS_PER_YEAR, options);
}

export function calculateWeeklyToSalaryNL(weeklyRate: number, options: NLCalculatorOptions = {}): SalaryCalculation {
  return calculateNLGrossToNet(weeklyRate * WEEKS_PER_YEAR, options);
}

export function calculateMonthlyToSalaryNL(monthlyRate: number, options: NLCalculatorOptions = {}): SalaryCalculation {
  return calculateNLGrossToNet(monthlyRate * MONTHS_PER_YEAR, options);
}

export function calculateBiWeeklyToSalaryNL(biWeeklyRate: number, options: NLCalculatorOptions = {}): SalaryCalculation {
  return calculateNLGrossToNet(biWeeklyRate * BI_WEEKLY_PERIODS, options);
}

export function calculateQuarterlyToSalaryNL(quarterlyRate: number, options: NLCalculatorOptions = {}): SalaryCalculation {
  return calculateNLGrossToNet(quarterlyRate * QUARTERS_PER_YEAR, options);
}

export function calculateSemiAnnualToSalaryNL(semiAnnualRate: number, options: NLCalculatorOptions = {}): SalaryCalculation {
  return calculateNLGrossToNet(semiAnnualRate * SEMI_ANNUAL_PERIODS, options);
}

export class NLFrequencyConverter {
  static readonly HOURS_PER_YEAR = HOURS_PER_YEAR;
  static readonly WEEKS_PER_YEAR = WEEKS_PER_YEAR;
  static readonly MONTHS_PER_YEAR = MONTHS_PER_YEAR;
  static readonly DAYS_PER_YEAR = DAYS_PER_YEAR;

  static toAnnual(amount: number, frequency: string): number {
    switch (frequency) {
      case 'hourly': return amount * HOURS_PER_YEAR;
      case 'daily': return amount * DAYS_PER_YEAR;
      case 'weekly': return amount * WEEKS_PER_YEAR;
      case 'monthly': return amount * MONTHS_PER_YEAR;
      case 'bi-weekly': return amount * BI_WEEKLY_PERIODS;
      case 'quarterly': return amount * QUARTERS_PER_YEAR;
      case 'semi-annual': return amount * SEMI_ANNUAL_PERIODS;
      default: return amount;
    }
  }

  static fromAnnual(annual: number, frequency: string): number {
    switch (frequency) {
      case 'hourly': return annual / HOURS_PER_YEAR;
      case 'daily': return annual / DAYS_PER_YEAR;
      case 'weekly': return annual / WEEKS_PER_YEAR;
      case 'monthly': return annual / MONTHS_PER_YEAR;
      case 'bi-weekly': return annual / BI_WEEKLY_PERIODS;
      case 'quarterly': return annual / QUARTERS_PER_YEAR;
      case 'semi-annual': return annual / SEMI_ANNUAL_PERIODS;
      default: return annual;
    }
  }
}
