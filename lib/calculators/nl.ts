// Netherlands Tax Calculator (2026)
// Based on Dutch Box 1 income tax and national insurance contributions
import { SalaryCalculation, TaxBreakdown } from '../types';

export interface NLCalculatorOptions {
  generalTaxCredit?: boolean; // Algemene heffingskorting
  employedTaxCredit?: boolean; // Employed person's tax credit (arbeidskorting)
}

// Dutch Income Tax Brackets 2026 (Box 1)
// These rates INCLUDE national insurance contributions (AOW, ANW, WLZ)
const INCOME_TAX_BRACKETS = [
  { min: 0, max: 38000, rate: 0.3693 }, // 36.93% (includes national insurance)
  { min: 38000, max: 74000, rate: 0.4040 }, // 40.40%
  { min: 74000, max: Infinity, rate: 0.4950 } // 49.50%
];

// Tax Credits 2026
const GENERAL_TAX_CREDIT = 2888; // €2,888 - Algemene heffingskorting
const EMPLOYED_TAX_CREDIT = 4205; // €4,205 - Employed person's tax credit (arbeidskorting)

// Note: In reality, these credits may phase out with higher income,
// but for simplicity we'll apply full credits. Can be enhanced later.

function calculateProgressiveTax(income: number, brackets: typeof INCOME_TAX_BRACKETS): number {
  let tax = 0;

  for (const bracket of brackets) {
    if (income <= bracket.min) break;

    const taxableInBracket = Math.min(income, bracket.max) - bracket.min;
    if (taxableInBracket > 0) {
      tax += taxableInBracket * bracket.rate;
    }
  }

  return tax;
}

export function calculateNLGrossToNet(grossAnnual: number, options: NLCalculatorOptions = {}): SalaryCalculation {
  const useGeneralCredit = options.generalTaxCredit !== false; // Default true
  const useEmployedCredit = options.employedTaxCredit !== false; // Default true

  const taxBeforeCredits = calculateProgressiveTax(grossAnnual, INCOME_TAX_BRACKETS);

  // Calculate tax credits (fixed amounts for 2026)
  const generalCredit = useGeneralCredit ? GENERAL_TAX_CREDIT : 0;
  const employedCredit = useEmployedCredit ? EMPLOYED_TAX_CREDIT : 0;
  const totalCredits = generalCredit + employedCredit;

  // Tax after credits (can't be negative)
  const totalTax = Math.max(0, taxBeforeCredits - totalCredits);
  const socialSecurity = 0; // Included in tax rate
  const netSalary = grossAnnual - totalTax;

  const breakdown: TaxBreakdown[] = [
    { label: 'Income Tax & Social Security', amount: taxBeforeCredits, rate: (taxBeforeCredits / grossAnnual) * 100, color: '#ef4444' }
  ];

  if (totalCredits > 0) {
    breakdown.push({ label: 'Tax Credits', amount: -totalCredits, rate: -(totalCredits / grossAnnual) * 100, color: '#3b82f6' });
  }

  breakdown.push({ label: 'Net Salary', amount: netSalary, rate: (netSalary / grossAnnual) * 100, color: '#10b981' });

  return {
    grossSalary: grossAnnual,
    netSalary,
    totalTax,
    socialSecurity,
    otherDeductions: 0,
    effectiveTaxRate: (totalTax / grossAnnual) * 100,
    breakdown
  };
}

export function calculateNLNetToGross(netAnnual: number, options: NLCalculatorOptions = {}): SalaryCalculation {
  let grossEstimate = netAnnual * 1.55; // Initial estimate
  let iterations = 0;
  const maxIterations = 20;

  while (iterations < maxIterations) {
    const result = calculateNLGrossToNet(grossEstimate, options);
    const diff = result.netSalary - netAnnual;

    if (Math.abs(diff) < 1) {
      return result;
    }

    grossEstimate -= diff;
    iterations++;
  }

  return calculateNLGrossToNet(grossEstimate, options);
}
