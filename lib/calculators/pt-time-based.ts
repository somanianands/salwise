// Portugal Time-Based Salary Calculators
import { calculatePTGrossToNet } from './pt';
import type { PTCalculatorOptions } from './pt';
import type { SalaryCalculation } from '../types';

// Portugal Standard Working Hours
// Source: Portuguese Labour Code - 40 hours/week standard
const HOURS_PER_YEAR = 2080; // 40 hrs/week × 52 weeks
const DAYS_PER_YEAR = 260; // 5 days/week × 52 weeks (standard working days)
const WEEKS_PER_YEAR = 52;
const MONTHS_PER_YEAR = 12;

/**
 * Calculate annual salary and net pay from hourly rate (Portugal)
 * @param hourlyRate Hourly wage in EUR
 * @param options Calculator options (employment type, deductions)
 * @returns Full salary calculation with breakdown
 */
export function calculateHourlyToSalaryPortugal(
  hourlyRate: number,
  options: PTCalculatorOptions = {}
): SalaryCalculation {
  const annualGross = hourlyRate * HOURS_PER_YEAR;
  return calculatePTGrossToNet(annualGross, options);
}

/**
 * Calculate annual salary and net pay from daily rate (Portugal)
 * @param dailyRate Daily wage in EUR
 * @param options Calculator options (employment type, deductions)
 * @returns Full salary calculation with breakdown
 */
export function calculateDailyToSalaryPortugal(
  dailyRate: number,
  options: PTCalculatorOptions = {}
): SalaryCalculation {
  const annualGross = dailyRate * DAYS_PER_YEAR;
  return calculatePTGrossToNet(annualGross, options);
}

/**
 * Calculate annual salary and net pay from weekly pay (Portugal)
 * @param weeklyPay Weekly wage in EUR
 * @param options Calculator options (employment type, deductions)
 * @returns Full salary calculation with breakdown
 */
export function calculateWeeklyToSalaryPortugal(
  weeklyPay: number,
  options: PTCalculatorOptions = {}
): SalaryCalculation {
  const annualGross = weeklyPay * WEEKS_PER_YEAR;
  return calculatePTGrossToNet(annualGross, options);
}

/**
 * Calculate annual salary and net pay from monthly salary (Portugal)
 * @param monthlySalary Monthly wage in EUR
 * @param options Calculator options (employment type, deductions)
 * @returns Full salary calculation with breakdown
 */
export function calculateMonthlyToSalaryPortugal(
  monthlySalary: number,
  options: PTCalculatorOptions = {}
): SalaryCalculation {
  const annualGross = monthlySalary * MONTHS_PER_YEAR;
  return calculatePTGrossToNet(annualGross, options);
}

/**
 * Calculate hourly rate from annual salary (Portugal)
 * @param annualSalary Annual gross salary in EUR
 * @param options Calculator options (employment type, deductions)
 * @returns Hourly rate and full salary calculation
 */
export function calculateSalaryToHourlyPortugal(
  annualSalary: number,
  options: PTCalculatorOptions = {}
): SalaryCalculation & { hourlyRate: number } {
  const result = calculatePTGrossToNet(annualSalary, options);
  return {
    ...result,
    hourlyRate: annualSalary / HOURS_PER_YEAR,
  };
}
