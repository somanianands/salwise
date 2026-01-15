// Overtime Pay Calculator
import { SalaryCalculation, TaxBreakdown } from '../types';
import { calculateGrossToNet, CalculatorOptions } from './index';

export interface OvertimeOptions {
  regularHourlyRate: number;
  regularHours: number;
  overtimeHours: number;
  overtimeMultiplier: number; // 1.5 for time-and-a-half, 2 for double-time
  hoursPerWeek: number;
  weeksPerYear?: number; // Default: 52 (some employees work 50, 48, etc.)
}

export function calculateOvertimePay(
  options: OvertimeOptions,
  country: any,
  calculatorOptions: CalculatorOptions = {}
): SalaryCalculation & { overtimeBreakdown: { regularPay: number; overtimePay: number; overtimeRate: number } } {
  const {
    regularHourlyRate,
    regularHours,
    overtimeHours,
    overtimeMultiplier,
    hoursPerWeek,
    weeksPerYear = 52 // Default to 52 weeks if not specified
  } = options;

  // Calculate overtime rate
  const overtimeRate = regularHourlyRate * overtimeMultiplier;

  // Calculate weekly pay
  const regularPay = regularHours * regularHourlyRate;
  const overtimePay = overtimeHours * overtimeRate;
  const totalWeeklyPay = regularPay + overtimePay;

  // Convert to annual (using specified weeks per year)
  const annualGrossSalary = totalWeeklyPay * weeksPerYear;

  // Calculate taxes on total annual gross
  const taxCalculation = calculateGrossToNet(country, annualGrossSalary, calculatorOptions);

  // Return calculation with overtime breakdown
  return {
    ...taxCalculation,
    overtimeBreakdown: {
      regularPay: regularPay * weeksPerYear, // Annual regular pay
      overtimePay: overtimePay * weeksPerYear, // Annual overtime pay
      overtimeRate
    }
  };
}
