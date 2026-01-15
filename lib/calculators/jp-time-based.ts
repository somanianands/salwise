// Japan Time-Based Salary Calculators
import { calculateJPGrossToNet } from './jp';
import type { JPCalculatorOptions } from './jp';
import type { SalaryCalculation } from '../types';

// Japan Standard Working Hours
// Source: Japanese Labour Standards Act - 40 hours/week standard
const HOURS_PER_YEAR = 2080; // 40 hrs/week × 52 weeks
const DAYS_PER_YEAR = 260; // 5 days/week × 52 weeks (standard working days)
const WEEKS_PER_YEAR = 52;
const MONTHS_PER_YEAR = 12;

/**
 * Calculate annual salary and net pay from hourly rate (Japan)
 * @param hourlyRate Hourly wage in JPY
 * @param options Calculator options (prefecture, deductions)
 * @returns Full salary calculation with breakdown
 */
export function calculateHourlyToSalaryJapan(
  hourlyRate: number,
  options: JPCalculatorOptions = {}
): SalaryCalculation {
  const annualGross = hourlyRate * HOURS_PER_YEAR;
  return calculateJPGrossToNet(annualGross, options);
}

/**
 * Calculate annual salary and net pay from daily rate (Japan)
 * @param dailyRate Daily wage in JPY
 * @param options Calculator options (prefecture, deductions)
 * @returns Full salary calculation with breakdown
 */
export function calculateDailyToSalaryJapan(
  dailyRate: number,
  options: JPCalculatorOptions = {}
): SalaryCalculation {
  const annualGross = dailyRate * DAYS_PER_YEAR;
  return calculateJPGrossToNet(annualGross, options);
}

/**
 * Calculate annual salary and net pay from weekly pay (Japan)
 * @param weeklyPay Weekly wage in JPY
 * @param options Calculator options (prefecture, deductions)
 * @returns Full salary calculation with breakdown
 */
export function calculateWeeklyToSalaryJapan(
  weeklyPay: number,
  options: JPCalculatorOptions = {}
): SalaryCalculation {
  const annualGross = weeklyPay * WEEKS_PER_YEAR;
  return calculateJPGrossToNet(annualGross, options);
}

/**
 * Calculate annual salary and net pay from monthly salary (Japan)
 * @param monthlySalary Monthly wage in JPY
 * @param options Calculator options (prefecture, deductions)
 * @returns Full salary calculation with breakdown
 */
export function calculateMonthlyToSalaryJapan(
  monthlySalary: number,
  options: JPCalculatorOptions = {}
): SalaryCalculation {
  const annualGross = monthlySalary * MONTHS_PER_YEAR;
  return calculateJPGrossToNet(annualGross, options);
}

/**
 * Calculate hourly rate from annual salary (Japan)
 * @param annualSalary Annual gross salary in JPY
 * @param options Calculator options (prefecture, deductions)
 * @returns Hourly rate and full salary calculation
 */
export function calculateSalaryToHourlyJapan(
  annualSalary: number,
  options: JPCalculatorOptions = {}
): SalaryCalculation & { hourlyRate: number } {
  const result = calculateJPGrossToNet(annualSalary, options);
  return {
    ...result,
    hourlyRate: annualSalary / HOURS_PER_YEAR,
  };
}
