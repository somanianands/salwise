// Canada Time-Based Salary Calculators (2026)
import { SalaryCalculation } from '../types';
import { calculateCanadaGrossToNet } from './canada';

// Canada working hours: 2,080 hours/year (40 hrs/week × 52 weeks)
const HOURS_PER_YEAR = 2080;
const WEEKS_PER_YEAR = 52;
const MONTHS_PER_YEAR = 12;
const DAYS_PER_YEAR = 260;
const BI_WEEKLY_PERIODS = 26;
const QUARTERS_PER_YEAR = 4;
const SEMI_ANNUAL_PERIODS = 2;

export function calculateHourlyToSalaryCanada(hourlyRate: number): SalaryCalculation {
  return calculateCanadaGrossToNet(hourlyRate * HOURS_PER_YEAR);
}

export function calculateDailyToSalaryCanada(dailyRate: number): SalaryCalculation {
  return calculateCanadaGrossToNet(dailyRate * DAYS_PER_YEAR);
}

export function calculateWeeklyToSalaryCanada(weeklyRate: number): SalaryCalculation {
  return calculateCanadaGrossToNet(weeklyRate * WEEKS_PER_YEAR);
}

export function calculateMonthlyToSalaryCanada(monthlyRate: number): SalaryCalculation {
  return calculateCanadaGrossToNet(monthlyRate * MONTHS_PER_YEAR);
}

export function calculateBiWeeklyToSalaryCanada(biWeeklyRate: number): SalaryCalculation {
  return calculateCanadaGrossToNet(biWeeklyRate * BI_WEEKLY_PERIODS);
}

export function calculateQuarterlyToSalaryCanada(quarterlyRate: number): SalaryCalculation {
  return calculateCanadaGrossToNet(quarterlyRate * QUARTERS_PER_YEAR);
}

export function calculateSemiAnnualToSalaryCanada(semiAnnualRate: number): SalaryCalculation {
  return calculateCanadaGrossToNet(semiAnnualRate * SEMI_ANNUAL_PERIODS);
}

export class CanadaFrequencyConverter {
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
