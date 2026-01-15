// Ireland Time-Based Salary Calculators (2026)
import { SalaryCalculation } from '../types';
import { calculateIEGrossToNet, IECalculatorOptions } from './ie';

// Ireland working hours: 1,976 hours/year (39 hrs/week × 52 weeks - holidays)
const HOURS_PER_YEAR = 1976;
const WEEKS_PER_YEAR = 52;
const MONTHS_PER_YEAR = 12;
const DAYS_PER_YEAR = 260;
const BI_WEEKLY_PERIODS = 26;
const QUARTERS_PER_YEAR = 4;
const SEMI_ANNUAL_PERIODS = 2;

export function calculateHourlyToSalaryIreland(hourlyRate: number, options: IECalculatorOptions = {}): SalaryCalculation {
  return calculateIEGrossToNet(hourlyRate * HOURS_PER_YEAR, options);
}

export function calculateDailyToSalaryIreland(dailyRate: number, options: IECalculatorOptions = {}): SalaryCalculation {
  return calculateIEGrossToNet(dailyRate * DAYS_PER_YEAR, options);
}

export function calculateWeeklyToSalaryIreland(weeklyRate: number, options: IECalculatorOptions = {}): SalaryCalculation {
  return calculateIEGrossToNet(weeklyRate * WEEKS_PER_YEAR, options);
}

export function calculateMonthlyToSalaryIreland(monthlyRate: number, options: IECalculatorOptions = {}): SalaryCalculation {
  return calculateIEGrossToNet(monthlyRate * MONTHS_PER_YEAR, options);
}

export function calculateBiWeeklyToSalaryIreland(biWeeklyRate: number, options: IECalculatorOptions = {}): SalaryCalculation {
  return calculateIEGrossToNet(biWeeklyRate * BI_WEEKLY_PERIODS, options);
}

export function calculateQuarterlyToSalaryIreland(quarterlyRate: number, options: IECalculatorOptions = {}): SalaryCalculation {
  return calculateIEGrossToNet(quarterlyRate * QUARTERS_PER_YEAR, options);
}

export function calculateSemiAnnualToSalaryIreland(semiAnnualRate: number, options: IECalculatorOptions = {}): SalaryCalculation {
  return calculateIEGrossToNet(semiAnnualRate * SEMI_ANNUAL_PERIODS, options);
}

export class IrelandFrequencyConverter {
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
