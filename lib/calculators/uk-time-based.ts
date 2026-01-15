// UK Time-Based Salary Calculators (2025/2026)
import { SalaryCalculation } from '../types';
import { calculateUKGrossToNet, UKCalculatorOptions } from './uk';

// UK working hours: 1,950 hours/year (37.5 hrs/week × 52 weeks)
const HOURS_PER_YEAR = 1950;
const WEEKS_PER_YEAR = 52;
const MONTHS_PER_YEAR = 12;
const DAYS_PER_YEAR = 260;
const BI_WEEKLY_PERIODS = 26;
const QUARTERS_PER_YEAR = 4;
const SEMI_ANNUAL_PERIODS = 2;

export function calculateHourlyToSalaryUK(hourlyRate: number, options: UKCalculatorOptions = {}): SalaryCalculation {
  return calculateUKGrossToNet(hourlyRate * HOURS_PER_YEAR, options);
}

export function calculateDailyToSalaryUK(dailyRate: number, options: UKCalculatorOptions = {}): SalaryCalculation {
  return calculateUKGrossToNet(dailyRate * DAYS_PER_YEAR, options);
}

export function calculateWeeklyToSalaryUK(weeklyRate: number, options: UKCalculatorOptions = {}): SalaryCalculation {
  return calculateUKGrossToNet(weeklyRate * WEEKS_PER_YEAR, options);
}

export function calculateMonthlyToSalaryUK(monthlyRate: number, options: UKCalculatorOptions = {}): SalaryCalculation {
  return calculateUKGrossToNet(monthlyRate * MONTHS_PER_YEAR, options);
}

export function calculateBiWeeklyToSalaryUK(biWeeklyRate: number, options: UKCalculatorOptions = {}): SalaryCalculation {
  return calculateUKGrossToNet(biWeeklyRate * BI_WEEKLY_PERIODS, options);
}

export function calculateQuarterlyToSalaryUK(quarterlyRate: number, options: UKCalculatorOptions = {}): SalaryCalculation {
  return calculateUKGrossToNet(quarterlyRate * QUARTERS_PER_YEAR, options);
}

export function calculateSemiAnnualToSalaryUK(semiAnnualRate: number, options: UKCalculatorOptions = {}): SalaryCalculation {
  return calculateUKGrossToNet(semiAnnualRate * SEMI_ANNUAL_PERIODS, options);
}

export class UKFrequencyConverter {
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

  static fromAnnual(annualAmount: number, frequency: string): number {
    switch (frequency) {
      case 'hourly': return annualAmount / HOURS_PER_YEAR;
      case 'daily': return annualAmount / DAYS_PER_YEAR;
      case 'weekly': return annualAmount / WEEKS_PER_YEAR;
      case 'monthly': return annualAmount / MONTHS_PER_YEAR;
      case 'bi-weekly': return annualAmount / BI_WEEKLY_PERIODS;
      case 'quarterly': return annualAmount / QUARTERS_PER_YEAR;
      case 'semi-annual': return annualAmount / SEMI_ANNUAL_PERIODS;
      default: return annualAmount;
    }
  }
}
