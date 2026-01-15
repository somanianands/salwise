// France Time-Based Salary Calculators (2026)
import { SalaryCalculation } from '../types';
import { calculateFranceGrossToNet, FRCalculatorOptions } from './france';

// France working hours: 1,607 hours/year (35 hrs/week × 52 weeks - adjustments for legal working time)
const HOURS_PER_YEAR = 1607;
const WEEKS_PER_YEAR = 52;
const MONTHS_PER_YEAR = 12;
const DAYS_PER_YEAR = 218; // Based on 35-hour work week
const BI_WEEKLY_PERIODS = 26;
const QUARTERS_PER_YEAR = 4;
const SEMI_ANNUAL_PERIODS = 2;

export function calculateHourlyToSalaryFrance(hourlyRate: number, options: FRCalculatorOptions = {}): SalaryCalculation {
  return calculateFranceGrossToNet(hourlyRate * HOURS_PER_YEAR, options);
}

export function calculateDailyToSalaryFrance(dailyRate: number, options: FRCalculatorOptions = {}): SalaryCalculation {
  return calculateFranceGrossToNet(dailyRate * DAYS_PER_YEAR, options);
}

export function calculateWeeklyToSalaryFrance(weeklyRate: number, options: FRCalculatorOptions = {}): SalaryCalculation {
  return calculateFranceGrossToNet(weeklyRate * WEEKS_PER_YEAR, options);
}

export function calculateMonthlyToSalaryFrance(monthlyRate: number, options: FRCalculatorOptions = {}): SalaryCalculation {
  return calculateFranceGrossToNet(monthlyRate * MONTHS_PER_YEAR, options);
}

export function calculateBiWeeklyToSalaryFrance(biWeeklyRate: number, options: FRCalculatorOptions = {}): SalaryCalculation {
  return calculateFranceGrossToNet(biWeeklyRate * BI_WEEKLY_PERIODS, options);
}

export function calculateQuarterlyToSalaryFrance(quarterlyRate: number, options: FRCalculatorOptions = {}): SalaryCalculation {
  return calculateFranceGrossToNet(quarterlyRate * QUARTERS_PER_YEAR, options);
}

export function calculateSemiAnnualToSalaryFrance(semiAnnualRate: number, options: FRCalculatorOptions = {}): SalaryCalculation {
  return calculateFranceGrossToNet(semiAnnualRate * SEMI_ANNUAL_PERIODS, options);
}

export class FranceFrequencyConverter {
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
