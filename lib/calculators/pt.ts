// Portugal Tax Calculator (2026)
// Based on IRS (Income Tax) and Social Security (Segurança Social)
import { SalaryCalculation, TaxBreakdown } from '../types';

export type PTEmploymentType = 'employee' | 'self-employed';

export interface PTCalculatorOptions {
  employmentType?: PTEmploymentType;
  // Future: Add region, NHR status, dependents, etc.
}

// Portugal IRS (Income Tax) Brackets 2026
// Progressive marginal tax - applied only to portion in each band
const IRS_BRACKETS = [
  { min: 0, max: 7703, rate: 0.1325 },        // 13.25%
  { min: 7703, max: 11623, rate: 0.18 },      // 18%
  { min: 11623, max: 16472, rate: 0.23 },     // 23%
  { min: 16472, max: 21321, rate: 0.26 },     // 26%
  { min: 21321, max: 27146, rate: 0.3275 },   // 32.75%
  { min: 27146, max: 39791, rate: 0.37 },     // 37%
  { min: 39791, max: 51997, rate: 0.435 },    // 43.5%
  { min: 51997, max: 81199, rate: 0.45 },     // 45%
  { min: 81199, max: Infinity, rate: 0.48 }   // 48%
];

// Social Security (Segurança Social) Rates
const SOCIAL_SECURITY_EMPLOYEE_RATE = 0.11; // 11% for employees
const SOCIAL_SECURITY_SELF_EMPLOYED_RATE = 0.214; // 21.4% for self-employed

function calculateProgressiveTax(income: number, brackets: typeof IRS_BRACKETS): number {
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

export function calculatePTGrossToNet(
  grossAnnual: number,
  options: PTCalculatorOptions = {}
): SalaryCalculation {
  const employmentType = options.employmentType || 'employee';

  // Step 1: Calculate Social Security (FIRST - on gross salary)
  // This is deducted from gross BEFORE calculating taxable income for IRS
  const socialSecurityRate = employmentType === 'self-employed'
    ? SOCIAL_SECURITY_SELF_EMPLOYED_RATE
    : SOCIAL_SECURITY_EMPLOYEE_RATE;
  const socialSecurity = grossAnnual * socialSecurityRate;

  // Step 2: Calculate taxable income
  // = gross - social security
  const taxableIncome = grossAnnual - socialSecurity;

  // Step 3: Calculate IRS (progressive income tax on taxable income)
  const irs = calculateProgressiveTax(taxableIncome, IRS_BRACKETS);

  // Step 4: Calculate totals
  const totalTax = irs; // Only IRS is "tax", social security is separate
  const netSalary = grossAnnual - totalTax - socialSecurity;
  const effectiveTaxRate = ((totalTax + socialSecurity) / grossAnnual) * 100;

  // Build breakdown
  const employmentLabel = employmentType === 'self-employed' ? ' (Trabalhador Independente)' : '';
  const breakdown: TaxBreakdown[] = [
    {
      label: 'Income Tax (IRS)',
      amount: irs,
      rate: (irs / grossAnnual) * 100,
      color: '#ef4444'
    },
    {
      label: `Social Security${employmentLabel}`,
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

export function calculatePTNetToGross(
  netAnnual: number,
  options: PTCalculatorOptions = {}
): SalaryCalculation {
  // Initial estimate (30% typical tax burden in Portugal)
  let grossEstimate = netAnnual * 1.43;
  let iterations = 0;
  const maxIterations = 20;

  while (iterations < maxIterations) {
    const result = calculatePTGrossToNet(grossEstimate, options);
    const diff = result.netSalary - netAnnual;

    // Converged within €1
    if (Math.abs(diff) < 1) {
      return result;
    }

    // Adjust estimate
    grossEstimate -= diff;
    iterations++;
  }

  // Return best estimate after max iterations
  return calculatePTGrossToNet(grossEstimate, options);
}
