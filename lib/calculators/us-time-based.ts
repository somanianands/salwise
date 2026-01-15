// USA Time-Based Salary Calculators (2026)
import { SalaryCalculation } from '../types';
import { calculateUSGrossToNet, USCalculatorOptions } from './us';

// USA working hours: 2,080 hours/year (40 hrs/week × 52 weeks)
const HOURS_PER_YEAR = 2080;
const WEEKS_PER_YEAR = 52;
const MONTHS_PER_YEAR = 12;
const DAYS_PER_YEAR = 260; // ~52 weeks × 5 days
const BI_WEEKLY_PERIODS = 26;
const QUARTERS_PER_YEAR = 4;
const SEMI_ANNUAL_PERIODS = 2;

/**
 * Calculate annual salary from hourly rate
 * USA: 2,080 hours/year standard (40 hrs/week × 52 weeks)
 */
export function calculateHourlyToSalaryUS(
  hourlyRate: number,
  options: USCalculatorOptions = {}
): SalaryCalculation {
  const annualGross = hourlyRate * HOURS_PER_YEAR;
  return calculateUSGrossToNet(annualGross, options);
}

/**
 * Calculate annual salary from daily rate
 * USA: 260 working days/year
 */
export function calculateDailyToSalaryUS(
  dailyRate: number,
  options: USCalculatorOptions = {}
): SalaryCalculation {
  const annualGross = dailyRate * DAYS_PER_YEAR;
  return calculateUSGrossToNet(annualGross, options);
}

/**
 * Calculate annual salary from weekly rate
 * USA: 52 weeks/year
 */
export function calculateWeeklyToSalaryUS(
  weeklyRate: number,
  options: USCalculatorOptions = {}
): SalaryCalculation {
  const annualGross = weeklyRate * WEEKS_PER_YEAR;
  return calculateUSGrossToNet(annualGross, options);
}

/**
 * Calculate annual salary from monthly rate
 * USA: 12 months/year
 */
export function calculateMonthlyToSalaryUS(
  monthlyRate: number,
  options: USCalculatorOptions = {}
): SalaryCalculation {
  const annualGross = monthlyRate * MONTHS_PER_YEAR;
  return calculateUSGrossToNet(annualGross, options);
}

/**
 * Calculate annual salary from bi-weekly rate
 * USA: 26 bi-weekly periods/year
 */
export function calculateBiWeeklyToSalaryUS(
  biWeeklyRate: number,
  options: USCalculatorOptions = {}
): SalaryCalculation {
  const annualGross = biWeeklyRate * BI_WEEKLY_PERIODS;
  return calculateUSGrossToNet(annualGross, options);
}

/**
 * Calculate annual salary from quarterly rate
 * USA: 4 quarters/year
 */
export function calculateQuarterlyToSalaryUS(
  quarterlyRate: number,
  options: USCalculatorOptions = {}
): SalaryCalculation {
  const annualGross = quarterlyRate * QUARTERS_PER_YEAR;
  return calculateUSGrossToNet(annualGross, options);
}

/**
 * Calculate annual salary from semi-annual rate
 * USA: 2 semi-annual periods/year
 */
export function calculateSemiAnnualToSalaryUS(
  semiAnnualRate: number,
  options: USCalculatorOptions = {}
): SalaryCalculation {
  const annualGross = semiAnnualRate * SEMI_ANNUAL_PERIODS;
  return calculateUSGrossToNet(annualGross, options);
}

/**
 * Frequency converter utility for USA
 */
export class USFrequencyConverter {
  static readonly HOURS_PER_YEAR = HOURS_PER_YEAR;
  static readonly WEEKS_PER_YEAR = WEEKS_PER_YEAR;
  static readonly MONTHS_PER_YEAR = MONTHS_PER_YEAR;
  static readonly DAYS_PER_YEAR = DAYS_PER_YEAR;
  static readonly BI_WEEKLY_PERIODS = BI_WEEKLY_PERIODS;
  static readonly QUARTERS_PER_YEAR = QUARTERS_PER_YEAR;
  static readonly SEMI_ANNUAL_PERIODS = SEMI_ANNUAL_PERIODS;

  static toAnnual(
    amount: number,
    frequency: 'hourly' | 'daily' | 'weekly' | 'monthly' | 'bi-weekly' | 'quarterly' | 'semi-annual' | 'annual'
  ): number {
    switch (frequency) {
      case 'hourly': return amount * HOURS_PER_YEAR;
      case 'daily': return amount * DAYS_PER_YEAR;
      case 'weekly': return amount * WEEKS_PER_YEAR;
      case 'monthly': return amount * MONTHS_PER_YEAR;
      case 'bi-weekly': return amount * BI_WEEKLY_PERIODS;
      case 'quarterly': return amount * QUARTERS_PER_YEAR;
      case 'semi-annual': return amount * SEMI_ANNUAL_PERIODS;
      case 'annual': return amount;
      default: return amount;
    }
  }

  static fromAnnual(
    annualAmount: number,
    frequency: 'hourly' | 'daily' | 'weekly' | 'monthly' | 'bi-weekly' | 'quarterly' | 'semi-annual' | 'annual'
  ): number {
    switch (frequency) {
      case 'hourly': return annualAmount / HOURS_PER_YEAR;
      case 'daily': return annualAmount / DAYS_PER_YEAR;
      case 'weekly': return annualAmount / WEEKS_PER_YEAR;
      case 'monthly': return annualAmount / MONTHS_PER_YEAR;
      case 'bi-weekly': return annualAmount / BI_WEEKLY_PERIODS;
      case 'quarterly': return annualAmount / QUARTERS_PER_YEAR;
      case 'semi-annual': return annualAmount / SEMI_ANNUAL_PERIODS;
      case 'annual': return annualAmount;
      default: return annualAmount;
    }
  }

  static convert(
    amount: number,
    fromFrequency: 'hourly' | 'daily' | 'weekly' | 'monthly' | 'bi-weekly' | 'quarterly' | 'semi-annual' | 'annual',
    toFrequency: 'hourly' | 'daily' | 'weekly' | 'monthly' | 'bi-weekly' | 'quarterly' | 'semi-annual' | 'annual'
  ): number {
    const annual = this.toAnnual(amount, fromFrequency);
    return this.fromAnnual(annual, toFrequency);
  }
}
