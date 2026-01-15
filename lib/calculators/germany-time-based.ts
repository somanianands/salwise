// Germany Time-Based Salary Calculators (2026)
import { SalaryCalculation } from '../types';
import { calculateGermanyGrossToNet, DECalculatorOptions } from './germany';

// Germany working hours: 1,920 hours/year (40 hrs/week × 48 weeks)
const HOURS_PER_YEAR = 1920;
const WEEKS_PER_YEAR = 48; // 52 weeks - 4 weeks vacation
const MONTHS_PER_YEAR = 12;
const DAYS_PER_YEAR = 240; // ~48 weeks × 5 days
const BI_WEEKLY_PERIODS = 24;
const QUARTERS_PER_YEAR = 4;
const SEMI_ANNUAL_PERIODS = 2;

export function calculateHourlyToSalaryGermany(hourlyRate: number, options: DECalculatorOptions = {}): SalaryCalculation {
  return calculateGermanyGrossToNet(hourlyRate * HOURS_PER_YEAR, options);
}

export function calculateDailyToSalaryGermany(dailyRate: number, options: DECalculatorOptions = {}): SalaryCalculation {
  return calculateGermanyGrossToNet(dailyRate * DAYS_PER_YEAR, options);
}

export function calculateWeeklyToSalaryGermany(weeklyRate: number, options: DECalculatorOptions = {}): SalaryCalculation {
  return calculateGermanyGrossToNet(weeklyRate * WEEKS_PER_YEAR, options);
}

export function calculateMonthlyToSalaryGermany(monthlyRate: number, options: DECalculatorOptions = {}): SalaryCalculation {
  return calculateGermanyGrossToNet(monthlyRate * MONTHS_PER_YEAR, options);
}

export function calculateBiWeeklyToSalaryGermany(biWeeklyRate: number, options: DECalculatorOptions = {}): SalaryCalculation {
  return calculateGermanyGrossToNet(biWeeklyRate * BI_WEEKLY_PERIODS, options);
}

export function calculateQuarterlyToSalaryGermany(quarterlyRate: number, options: DECalculatorOptions = {}): SalaryCalculation {
  return calculateGermanyGrossToNet(quarterlyRate * QUARTERS_PER_YEAR, options);
}

export function calculateSemiAnnualToSalaryGermany(semiAnnualRate: number, options: DECalculatorOptions = {}): SalaryCalculation {
  return calculateGermanyGrossToNet(semiAnnualRate * SEMI_ANNUAL_PERIODS, options);
}

export class GermanyFrequencyConverter {
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
