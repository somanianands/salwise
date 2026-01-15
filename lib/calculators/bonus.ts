// Bonus Tax Calculator
import { SalaryCalculation, TaxBreakdown } from '../types';
import { calculateGrossToNet, CalculatorOptions } from './index';

export interface BonusOptions {
  baseSalary: number;
  bonusAmount: number;
}

export function calculateBonusTax(
  options: BonusOptions,
  country: any,
  calculatorOptions: CalculatorOptions = {}
): SalaryCalculation & { bonusBreakdown: { baseSalary: number; bonusAmount: number; bonusTax: number; bonusNet: number } } {
  const { baseSalary, bonusAmount } = options;

  // Calculate tax on base salary only
  const baseSalaryCalculation = calculateGrossToNet(country, baseSalary, calculatorOptions);

  // Calculate tax on base + bonus
  const totalGross = baseSalary + bonusAmount;
  const totalCalculation = calculateGrossToNet(country, totalGross, calculatorOptions);

  // The difference in tax is the tax on the bonus
  const bonusTax = totalCalculation.totalTax + totalCalculation.socialSecurity -
                   (baseSalaryCalculation.totalTax + baseSalaryCalculation.socialSecurity);
  const bonusNet = bonusAmount - bonusTax;

  return {
    ...totalCalculation,
    bonusBreakdown: {
      baseSalary,
      bonusAmount,
      bonusTax,
      bonusNet
    }
  };
}
