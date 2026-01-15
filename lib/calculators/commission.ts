// Commission Calculator
import { SalaryCalculation, TaxBreakdown } from '../types';
import { calculateGrossToNet, CalculatorOptions } from './index';

export type CommissionFrequency = 'monthly' | 'quarterly' | 'annual';

export interface CommissionOptions {
  baseSalary: number;
  commissionAmount: number; // Commission amount per period
  commissionFrequency: CommissionFrequency; // How often commission is paid
}

export interface CommissionBreakdown {
  baseSalary: number;
  commissionAmount: number; // Period commission (as entered)
  annualCommission: number; // Normalized to annual
  commissionFrequency: CommissionFrequency;
  totalGross: number;
  netCommissionTakeHome: number; // Net commission after taxes
}

export function calculateCommission(
  options: CommissionOptions,
  country: any,
  calculatorOptions: CalculatorOptions = {}
): SalaryCalculation & { commissionBreakdown: CommissionBreakdown } {
  const { baseSalary, commissionAmount, commissionFrequency } = options;

  // Normalize commission to annual based on frequency
  let annualCommission: number;
  switch (commissionFrequency) {
    case 'monthly':
      annualCommission = commissionAmount * 12;
      break;
    case 'quarterly':
      annualCommission = commissionAmount * 4;
      break;
    case 'annual':
      annualCommission = commissionAmount;
      break;
    default:
      annualCommission = commissionAmount;
  }

  // Calculate total annual gross income
  const totalGross = baseSalary + annualCommission;

  // Calculate taxes on total income (uses shared USA tax engine)
  const calculation = calculateGrossToNet(country, totalGross, calculatorOptions);

  // Calculate net pay without commission (for comparison)
  const baseSalaryCalculation = calculateGrossToNet(country, baseSalary, calculatorOptions);
  const netCommissionTakeHome = calculation.netSalary - baseSalaryCalculation.netSalary;

  return {
    ...calculation,
    commissionBreakdown: {
      baseSalary,
      commissionAmount,
      annualCommission,
      commissionFrequency,
      totalGross,
      netCommissionTakeHome
    }
  };
}
