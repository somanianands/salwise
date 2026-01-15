// Switzerland Tax Calculator (2026)
// Based on Federal Income Tax, Cantonal Tax, and Social Security
import { SalaryCalculation, TaxBreakdown } from '../types';

export type SwissCanton =
  | 'zurich' | 'geneva' | 'zug' | 'bern' | 'basel'
  | 'vaud' | 'aargau' | 'lucerne' | 'ticino' | 'st_gallen';

export interface CHCalculatorOptions {
  canton?: SwissCanton;
  // Future: Add church tax, married status, etc.
}

// Swiss Federal Income Tax Brackets 2026 (Single/Unmarried)
// Progressive marginal tax - very low compared to EU
const FEDERAL_TAX_BRACKETS = [
  { min: 0, max: 14500, rate: 0 },          // 0%
  { min: 14500, max: 31600, rate: 0.0077 }, // 0.77%
  { min: 31600, max: 41400, rate: 0.0088 }, // 0.88%
  { min: 41400, max: 55200, rate: 0.0264 }, // 2.64%
  { min: 55200, max: 72500, rate: 0.0297 }, // 2.97%
  { min: 72500, max: Infinity, rate: 0.115 } // 11.5%
];

// Canton + Municipal Tax (Effective Rates - Phase 1 Simplified)
// These are approximate effective rates per canton
const CANTON_TAX_RATES: Record<SwissCanton, number> = {
  zurich: 0.10,      // 10%
  geneva: 0.12,      // 12%
  zug: 0.06,         // 6% (lowest)
  bern: 0.11,        // 11%
  basel: 0.13,       // 13%
  vaud: 0.11,        // 11%
  aargau: 0.09,      // 9%
  lucerne: 0.08,     // 8%
  ticino: 0.10,      // 10%
  st_gallen: 0.09    // 9%
};

// Social Security Contributions (Employee)
const SOCIAL_SECURITY_AHV_IV_EO = 0.053; // 5.3% (AHV/IV/EO - Old age/disability/maternity)
const SOCIAL_SECURITY_ALV = 0.011;       // 1.1% (ALV - Unemployment insurance)
const TOTAL_SOCIAL_SECURITY_RATE = SOCIAL_SECURITY_AHV_IV_EO + SOCIAL_SECURITY_ALV; // 6.4%

function calculateProgressiveTax(income: number, brackets: typeof FEDERAL_TAX_BRACKETS): number {
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

export function calculateCHGrossToNet(
  grossAnnual: number,
  options: CHCalculatorOptions = {}
): SalaryCalculation {
  const canton = options.canton || 'zurich';

  // Step 1: Calculate Social Security (FIRST - on gross salary)
  // AHV/IV/EO (5.3%) + ALV (1.1%) = 6.4%
  const socialSecurity = grossAnnual * TOTAL_SOCIAL_SECURITY_RATE;

  // Step 2: Calculate taxable income
  // = gross - social security
  const taxableIncome = grossAnnual - socialSecurity;

  // Step 3: Calculate Federal Income Tax (progressive on taxable income)
  const federalTax = calculateProgressiveTax(taxableIncome, FEDERAL_TAX_BRACKETS);

  // Step 4: Calculate Canton + Municipal Tax (flat effective rate on taxable income)
  const cantonRate = CANTON_TAX_RATES[canton];
  const cantonTax = taxableIncome * cantonRate;

  // Step 5: Calculate totals
  const totalTax = federalTax + cantonTax;
  const netSalary = grossAnnual - totalTax - socialSecurity;
  const effectiveTaxRate = ((totalTax + socialSecurity) / grossAnnual) * 100;

  // Build breakdown
  const breakdown: TaxBreakdown[] = [
    {
      label: 'Federal Income Tax',
      amount: federalTax,
      rate: (federalTax / grossAnnual) * 100,
      color: '#ef4444'
    },
    {
      label: `Cantonal/Municipal Tax (${canton.charAt(0).toUpperCase() + canton.slice(1)})`,
      amount: cantonTax,
      rate: (cantonTax / grossAnnual) * 100,
      color: '#f97316'
    },
    {
      label: 'Social Security (AHV/IV/EO/ALV)',
      amount: socialSecurity,
      rate: (socialSecurity / grossAnnual) * 100,
      color: '#3b82f6'
    },
    {
      label: 'Net Salary',
      amount: netSalary,
      rate: (netSalary / grossAnnual) * 100,
      color: '#10b981'
    }
  ];

  return {
    grossSalary: grossAnnual,
    netSalary,
    totalTax,
    socialSecurity,
    otherDeductions: 0,
    effectiveTaxRate,
    breakdown
  };
}

export function calculateCHNetToGross(
  netAnnual: number,
  options: CHCalculatorOptions = {}
): SalaryCalculation {
  // Initial estimate (20% typical tax burden in Switzerland)
  let grossEstimate = netAnnual * 1.25;
  let iterations = 0;
  const maxIterations = 20;

  while (iterations < maxIterations) {
    const result = calculateCHGrossToNet(grossEstimate, options);
    const diff = result.netSalary - netAnnual;

    // Converged within CHF 1
    if (Math.abs(diff) < 1) {
      return result;
    }

    // Adjust estimate
    grossEstimate -= diff;
    iterations++;
  }

  // Return best estimate after max iterations
  return calculateCHGrossToNet(grossEstimate, options);
}
