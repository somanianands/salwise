// Italy Time-Based Salary Calculators (2026)
// Based on ITALY_MASTER_SPEC_2026.md
import { SalaryCalculation } from '../types';
import { calculateITGrossToNet, ITCalculatorOptions } from './it';

// Italy working hours: 1,824 hours/year (38 hrs/week × 48 weeks)
const HOURS_PER_YEAR = 1824;
const WEEKS_PER_YEAR = 48; // 52 weeks - 4 weeks vacation
const MONTHS_PER_YEAR = 12;
const DAYS_PER_YEAR = 240; // ~48 weeks × 5 days
const BI_WEEKLY_PERIODS = 24;
const QUARTERS_PER_YEAR = 4;
const SEMI_ANNUAL_PERIODS = 2;

/**
 * Calculate annual salary from hourly rate
 * Italy: 1,824 hours/year standard (38 hrs/week × 48 weeks)
 */
export function calculateHourlyToSalaryItaly(
  hourlyRate: number,
  options: ITCalculatorOptions = {}
): SalaryCalculation {
  // Normalize to annual
  const annualGross = hourlyRate * HOURS_PER_YEAR;

  // Calculate taxes using Italy tax engine
  return calculateITGrossToNet(annualGross, options);
}

/**
 * Calculate annual salary from daily rate
 * Italy: 240 working days/year
 */
export function calculateDailyToSalaryItaly(
  dailyRate: number,
  options: ITCalculatorOptions = {}
): SalaryCalculation {
  // Normalize to annual
  const annualGross = dailyRate * DAYS_PER_YEAR;

  // Calculate taxes using Italy tax engine
  return calculateITGrossToNet(annualGross, options);
}

/**
 * Calculate annual salary from weekly rate
 * Italy: 48 weeks/year (accounting for vacation)
 */
export function calculateWeeklyToSalaryItaly(
  weeklyRate: number,
  options: ITCalculatorOptions = {}
): SalaryCalculation {
  // Normalize to annual
  const annualGross = weeklyRate * WEEKS_PER_YEAR;

  // Calculate taxes using Italy tax engine
  return calculateITGrossToNet(annualGross, options);
}

/**
 * Calculate annual salary from monthly rate
 * Italy: 12 months/year (standard)
 */
export function calculateMonthlyToSalaryItaly(
  monthlyRate: number,
  options: ITCalculatorOptions = {}
): SalaryCalculation {
  // Normalize to annual
  const annualGross = monthlyRate * MONTHS_PER_YEAR;

  // Calculate taxes using Italy tax engine
  return calculateITGrossToNet(annualGross, options);
}

/**
 * Calculate annual salary from bi-weekly rate
 * Italy: 24 bi-weekly periods/year
 */
export function calculateBiWeeklyToSalaryItaly(
  biWeeklyRate: number,
  options: ITCalculatorOptions = {}
): SalaryCalculation {
  // Normalize to annual
  const annualGross = biWeeklyRate * BI_WEEKLY_PERIODS;

  // Calculate taxes using Italy tax engine
  return calculateITGrossToNet(annualGross, options);
}

/**
 * Calculate annual salary from quarterly rate
 * Italy: 4 quarters/year
 */
export function calculateQuarterlyToSalaryItaly(
  quarterlyRate: number,
  options: ITCalculatorOptions = {}
): SalaryCalculation {
  // Normalize to annual
  const annualGross = quarterlyRate * QUARTERS_PER_YEAR;

  // Calculate taxes using Italy tax engine
  return calculateITGrossToNet(annualGross, options);
}

/**
 * Calculate annual salary from semi-annual rate
 * Italy: 2 semi-annual periods/year
 */
export function calculateSemiAnnualToSalaryItaly(
  semiAnnualRate: number,
  options: ITCalculatorOptions = {}
): SalaryCalculation {
  // Normalize to annual
  const annualGross = semiAnnualRate * SEMI_ANNUAL_PERIODS;

  // Calculate taxes using Italy tax engine
  return calculateITGrossToNet(annualGross, options);
}

/**
 * Frequency converter utility for Italy
 * Converts between different pay frequencies
 */
export class ItalyFrequencyConverter {
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
