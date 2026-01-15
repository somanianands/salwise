// Switzerland Time-Based Salary Calculators
import { calculateCHGrossToNet } from './ch';
import type { CHCalculatorOptions } from './ch';
import type { SalaryCalculation } from '../types';

// Switzerland Standard Working Hours
// Source: Swiss Labour Law - 42 hours/week standard (varies by sector)
// Using 42 hrs/week as general standard
const HOURS_PER_YEAR = 2184; // 42 hrs/week × 52 weeks
const DAYS_PER_YEAR = 260; // 5 days/week × 52 weeks (standard working days)
const WEEKS_PER_YEAR = 52;
const MONTHS_PER_YEAR = 12;

/**
 * Calculate annual salary and net pay from hourly rate (Switzerland)
 * @param hourlyRate Hourly wage in CHF
 * @param options Calculator options (canton, deductions)
 * @returns Full salary calculation with breakdown
 */
export function calculateHourlyToSalarySwitzerland(
  hourlyRate: number,
  options: CHCalculatorOptions = {}
): SalaryCalculation {
  const annualGross = hourlyRate * HOURS_PER_YEAR;
  return calculateCHGrossToNet(annualGross, options);
}

/**
 * Calculate annual salary and net pay from daily rate (Switzerland)
 * @param dailyRate Daily wage in CHF
 * @param options Calculator options (canton, deductions)
 * @returns Full salary calculation with breakdown
 */
export function calculateDailyToSalarySwitzerland(
  dailyRate: number,
  options: CHCalculatorOptions = {}
): SalaryCalculation {
  const annualGross = dailyRate * DAYS_PER_YEAR;
  return calculateCHGrossToNet(annualGross, options);
}

/**
 * Calculate annual salary and net pay from weekly pay (Switzerland)
 * @param weeklyPay Weekly wage in CHF
 * @param options Calculator options (canton, deductions)
 * @returns Full salary calculation with breakdown
 */
export function calculateWeeklyToSalarySwitzerland(
  weeklyPay: number,
  options: CHCalculatorOptions = {}
): SalaryCalculation {
  const annualGross = weeklyPay * WEEKS_PER_YEAR;
  return calculateCHGrossToNet(annualGross, options);
}

/**
 * Calculate annual salary and net pay from monthly salary (Switzerland)
 * @param monthlySalary Monthly wage in CHF
 * @param options Calculator options (canton, deductions)
 * @returns Full salary calculation with breakdown
 */
export function calculateMonthlyToSalarySwitzerland(
  monthlySalary: number,
  options: CHCalculatorOptions = {}
): SalaryCalculation {
  const annualGross = monthlySalary * MONTHS_PER_YEAR;
  return calculateCHGrossToNet(annualGross, options);
}

/**
 * Calculate hourly rate from annual salary (Switzerland)
 * @param annualSalary Annual gross salary in CHF
 * @param options Calculator options (canton, deductions)
 * @returns Hourly rate and full salary calculation
 */
export function calculateSalaryToHourlySwitzerland(
  annualSalary: number,
  options: CHCalculatorOptions = {}
): SalaryCalculation & { hourlyRate: number } {
  const result = calculateCHGrossToNet(annualSalary, options);
  return {
    ...result,
    hourlyRate: annualSalary / HOURS_PER_YEAR,
  };
}
