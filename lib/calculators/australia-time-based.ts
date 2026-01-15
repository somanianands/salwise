// Australia Time-Based Salary Calculators (2026)
import { SalaryCalculation } from '../types';
import { calculateAustraliaGrossToNet, AUCalculatorOptions } from './australia';

// Australia working hours: 2,028 hours/year (39 hrs/week × 52 weeks)
const HOURS_PER_YEAR = 2028;
const WEEKS_PER_YEAR = 52;
const MONTHS_PER_YEAR = 12;
const DAYS_PER_YEAR = 260;
const BI_WEEKLY_PERIODS = 26;
const QUARTERS_PER_YEAR = 4;
const SEMI_ANNUAL_PERIODS = 2;

export function calculateHourlyToSalaryAustralia(hourlyRate: number, options: AUCalculatorOptions = {}): SalaryCalculation {
  return calculateAustraliaGrossToNet(hourlyRate * HOURS_PER_YEAR, options);
}

export function calculateDailyToSalaryAustralia(dailyRate: number, options: AUCalculatorOptions = {}): SalaryCalculation {
  return calculateAustraliaGrossToNet(dailyRate * DAYS_PER_YEAR, options);
}

export function calculateWeeklyToSalaryAustralia(weeklyRate: number, options: AUCalculatorOptions = {}): SalaryCalculation {
  return calculateAustraliaGrossToNet(weeklyRate * WEEKS_PER_YEAR, options);
}

export function calculateMonthlyToSalaryAustralia(monthlyRate: number, options: AUCalculatorOptions = {}): SalaryCalculation {
  return calculateAustraliaGrossToNet(monthlyRate * MONTHS_PER_YEAR, options);
}

export function calculateBiWeeklyToSalaryAustralia(biWeeklyRate: number, options: AUCalculatorOptions = {}): SalaryCalculation {
  return calculateAustraliaGrossToNet(biWeeklyRate * BI_WEEKLY_PERIODS, options);
}

export function calculateQuarterlyToSalaryAustralia(quarterlyRate: number, options: AUCalculatorOptions = {}): SalaryCalculation {
  return calculateAustraliaGrossToNet(quarterlyRate * QUARTERS_PER_YEAR, options);
}

export function calculateSemiAnnualToSalaryAustralia(semiAnnualRate: number, options: AUCalculatorOptions = {}): SalaryCalculation {
  return calculateAustraliaGrossToNet(semiAnnualRate * SEMI_ANNUAL_PERIODS, options);
}

export class AustraliaFrequencyConverter {
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
