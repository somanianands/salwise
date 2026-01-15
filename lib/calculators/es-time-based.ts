// Spain Time-Based Salary Calculators (2026)
// Based on SPAIN_MASTER_SPEC_2026.md
import { SalaryCalculation } from '../types';
import { calculateESGrossToNet, ESCalculatorOptions } from './es';

// Spain working hours: 1,826 hours/year (40 hrs/week × 52 weeks - holidays)
const HOURS_PER_YEAR = 1826;
const WEEKS_PER_YEAR = 52;
const MONTHS_PER_YEAR = 12;
const DAYS_PER_YEAR = 260; // ~52 weeks × 5 days
const BI_WEEKLY_PERIODS = 26;
const QUARTERS_PER_YEAR = 4;
const SEMI_ANNUAL_PERIODS = 2;

/**
 * Calculate annual salary from hourly rate
 * Spain: 1,826 hours/year standard
 */
export function calculateHourlyToSalarySpain(
  hourlyRate: number,
  options: ESCalculatorOptions = {}
): SalaryCalculation {
  // Normalize to annual
  const annualGross = hourlyRate * HOURS_PER_YEAR;

  // Calculate taxes using Spain tax engine
  const result = calculateESGrossToNet(annualGross, options);

  // Return with hourly breakdown in result
  return {
    ...result,
    // Add hourly details to breakdown for reference
    breakdown: [
      ...result.breakdown,
      {
        label: 'Hourly Rate',
        amount: hourlyRate,
        rate: 0,
        color: '#6366f1'
      }
    ]
  };
}

/**
 * Calculate annual salary from daily rate
 * Spain: 260 working days/year
 */
export function calculateDailyToSalarySpain(
  dailyRate: number,
  options: ESCalculatorOptions = {}
): SalaryCalculation {
  // Normalize to annual
  const annualGross = dailyRate * DAYS_PER_YEAR;

  // Calculate taxes using Spain tax engine
  return calculateESGrossToNet(annualGross, options);
}

/**
 * Calculate annual salary from weekly rate
 * Spain: 52 weeks/year
 */
export function calculateWeeklyToSalarySpain(
  weeklyRate: number,
  options: ESCalculatorOptions = {}
): SalaryCalculation {
  // Normalize to annual
  const annualGross = weeklyRate * WEEKS_PER_YEAR;

  // Calculate taxes using Spain tax engine
  return calculateESGrossToNet(annualGross, options);
}

/**
 * Calculate annual salary from monthly rate
 * Spain: 12 months/year (standard)
 */
export function calculateMonthlyToSalarySpain(
  monthlyRate: number,
  options: ESCalculatorOptions = {}
): SalaryCalculation {
  // Normalize to annual
  const annualGross = monthlyRate * MONTHS_PER_YEAR;

  // Calculate taxes using Spain tax engine
  return calculateESGrossToNet(annualGross, options);
}

/**
 * Calculate annual salary from bi-weekly rate
 * Spain: 26 bi-weekly periods/year
 */
export function calculateBiWeeklyToSalarySpain(
  biWeeklyRate: number,
  options: ESCalculatorOptions = {}
): SalaryCalculation {
  // Normalize to annual
  const annualGross = biWeeklyRate * BI_WEEKLY_PERIODS;

  // Calculate taxes using Spain tax engine
  return calculateESGrossToNet(annualGross, options);
}

/**
 * Calculate annual salary from quarterly rate
 * Spain: 4 quarters/year
 */
export function calculateQuarterlyToSalarySpain(
  quarterlyRate: number,
  options: ESCalculatorOptions = {}
): SalaryCalculation {
  // Normalize to annual
  const annualGross = quarterlyRate * QUARTERS_PER_YEAR;

  // Calculate taxes using Spain tax engine
  return calculateESGrossToNet(annualGross, options);
}

/**
 * Calculate annual salary from semi-annual rate
 * Spain: 2 semi-annual periods/year
 */
export function calculateSemiAnnualToSalarySpain(
  semiAnnualRate: number,
  options: ESCalculatorOptions = {}
): SalaryCalculation {
  // Normalize to annual
  const annualGross = semiAnnualRate * SEMI_ANNUAL_PERIODS;

  // Calculate taxes using Spain tax engine
  return calculateESGrossToNet(annualGross, options);
}

/**
 * Frequency converter utility for Spain
 * Converts between different pay frequencies
 */
export class SpainFrequencyConverter {
  static readonly HOURS_PER_YEAR = HOURS_PER_YEAR;
  static readonly WEEKS_PER_YEAR = WEEKS_PER_YEAR;
  static readonly MONTHS_PER_YEAR = MONTHS_PER_YEAR;
  static readonly DAYS_PER_YEAR = DAYS_PER_YEAR;
  static readonly BI_WEEKLY_PERIODS = BI_WEEKLY_PERIODS;
  static readonly QUARTERS_PER_YEAR = QUARTERS_PER_YEAR;
  static readonly SEMI_ANNUAL_PERIODS = SEMI_ANNUAL_PERIODS;

  /**
   * Convert any frequency to annual
   */
  static toAnnual(
    amount: number,
    frequency: 'hourly' | 'daily' | 'weekly' | 'monthly' | 'bi-weekly' | 'quarterly' | 'semi-annual' | 'annual'
  ): number {
    switch (frequency) {
      case 'hourly':
        return amount * HOURS_PER_YEAR;
      case 'daily':
        return amount * DAYS_PER_YEAR;
      case 'weekly':
        return amount * WEEKS_PER_YEAR;
      case 'monthly':
        return amount * MONTHS_PER_YEAR;
      case 'bi-weekly':
        return amount * BI_WEEKLY_PERIODS;
      case 'quarterly':
        return amount * QUARTERS_PER_YEAR;
      case 'semi-annual':
        return amount * SEMI_ANNUAL_PERIODS;
      case 'annual':
        return amount;
      default:
        return amount;
    }
  }

  /**
   * Convert annual amount to any frequency
   */
  static fromAnnual(
    annualAmount: number,
    frequency: 'hourly' | 'daily' | 'weekly' | 'monthly' | 'bi-weekly' | 'quarterly' | 'semi-annual' | 'annual'
  ): number {
    switch (frequency) {
      case 'hourly':
        return annualAmount / HOURS_PER_YEAR;
      case 'daily':
        return annualAmount / DAYS_PER_YEAR;
      case 'weekly':
        return annualAmount / WEEKS_PER_YEAR;
      case 'monthly':
        return annualAmount / MONTHS_PER_YEAR;
      case 'bi-weekly':
        return annualAmount / BI_WEEKLY_PERIODS;
      case 'quarterly':
        return annualAmount / QUARTERS_PER_YEAR;
      case 'semi-annual':
        return annualAmount / SEMI_ANNUAL_PERIODS;
      case 'annual':
        return annualAmount;
      default:
        return annualAmount;
    }
  }

  /**
   * Convert between any two frequencies
   */
  static convert(
    amount: number,
    fromFrequency: 'hourly' | 'daily' | 'weekly' | 'monthly' | 'bi-weekly' | 'quarterly' | 'semi-annual' | 'annual',
    toFrequency: 'hourly' | 'daily' | 'weekly' | 'monthly' | 'bi-weekly' | 'quarterly' | 'semi-annual' | 'annual'
  ): number {
    const annual = this.toAnnual(amount, fromFrequency);
    return this.fromAnnual(annual, toFrequency);
  }
}
