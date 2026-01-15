// Japan Tax Calculator (2026)
// Based on National Income Tax, Resident Tax, and Social Insurance
import { SalaryCalculation, TaxBreakdown } from '../types';

export interface JPCalculatorOptions {
  dependents?: number; // Number of dependents (spouse + children)
  // Future: Add prefecture-specific rates, etc.
}

// Japan National Income Tax Brackets 2026
// Progressive marginal tax - applied only to portion in each band
const NATIONAL_INCOME_TAX_BRACKETS = [
  { min: 0, max: 1950000, rate: 0.05 },          // 5%
  { min: 1950000, max: 3300000, rate: 0.10 },    // 10%
  { min: 3300000, max: 6950000, rate: 0.20 },    // 20%
  { min: 6950000, max: 9000000, rate: 0.23 },    // 23%
  { min: 9000000, max: 18000000, rate: 0.33 },   // 33%
  { min: 18000000, max: 40000000, rate: 0.40 },  // 40%
  { min: 40000000, max: Infinity, rate: 0.45 }   // 45%
];

// Resident Tax (Local Tax) - Flat Rate
const RESIDENT_TAX_RATE = 0.10; // 10% (6% municipal + 4% prefectural)

// Social Insurance (Employee Share) - Average Rates
const SOCIAL_INSURANCE_PENSION = 0.0915;          // 9.15% (Pension)
const SOCIAL_INSURANCE_HEALTH = 0.05;             // 5% (Health Insurance)
const SOCIAL_INSURANCE_EMPLOYMENT = 0.006;        // 0.6% (Employment Insurance)
const TOTAL_SOCIAL_INSURANCE_RATE = SOCIAL_INSURANCE_PENSION + SOCIAL_INSURANCE_HEALTH + SOCIAL_INSURANCE_EMPLOYMENT; // 14.75%

// Basic Allowance (Standard Deduction)
const BASIC_ALLOWANCE = 480000; // ¥480,000

// Dependent Deductions
const DEPENDENT_DEDUCTION = 380000; // ¥380,000 per dependent (spouse/child)

function calculateProgressiveTax(income: number, brackets: typeof NATIONAL_INCOME_TAX_BRACKETS): number {
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

export function calculateJPGrossToNet(
  grossAnnual: number,
  options: JPCalculatorOptions = {}
): SalaryCalculation {
  const dependents = options.dependents || 0;

  // Step 1: Calculate Social Insurance (FIRST - on gross salary)
  // Pension (9.15%) + Health (5%) + Employment (0.6%) = 14.75%
  const socialInsurance = grossAnnual * TOTAL_SOCIAL_INSURANCE_RATE;

  // Step 2: Calculate taxable income
  // = gross - social insurance - basic allowance - dependent deductions
  const totalDependentDeductions = dependents * DEPENDENT_DEDUCTION;
  const taxableIncome = Math.max(0, grossAnnual - socialInsurance - BASIC_ALLOWANCE - totalDependentDeductions);

  // Step 3: Calculate National Income Tax (progressive on taxable income)
  const nationalIncomeTax = calculateProgressiveTax(taxableIncome, NATIONAL_INCOME_TAX_BRACKETS);

  // Step 4: Calculate Resident Tax (flat 10% on taxable income)
  const residentTax = taxableIncome * RESIDENT_TAX_RATE;

  // Step 5: Calculate totals
  const totalTax = nationalIncomeTax + residentTax;
  const netSalary = grossAnnual - totalTax - socialInsurance;
  const effectiveTaxRate = ((totalTax + socialInsurance) / grossAnnual) * 100;

  // Build breakdown
  const breakdown: TaxBreakdown[] = [
    {
      label: 'National Income Tax',
      amount: nationalIncomeTax,
      rate: (nationalIncomeTax / grossAnnual) * 100,
      color: '#ef4444'
    },
    {
      label: 'Resident Tax (Municipal + Prefectural)',
      amount: residentTax,
      rate: (residentTax / grossAnnual) * 100,
      color: '#f97316'
    },
    {
      label: 'Social Insurance (Pension/Health/Employment)',
      amount: socialInsurance,
      rate: (socialInsurance / grossAnnual) * 100,
      color: '#3b82f6'
    }
  ];

  // Add dependent deduction info if applicable
  if (dependents > 0) {
    breakdown.unshift({
      label: `Dependent Deductions (${dependents})`,
      amount: -totalDependentDeductions,
      rate: -(totalDependentDeductions / grossAnnual) * 100,
      color: '#22c55e'
    });
  }

  breakdown.push({
    label: 'Net Salary',
    amount: netSalary,
    rate: (netSalary / grossAnnual) * 100,
    color: '#10b981'
  });

  return {
    grossSalary: grossAnnual,
    netSalary,
    totalTax,
    socialSecurity: socialInsurance,
    otherDeductions: 0,
    effectiveTaxRate,
    breakdown
  };
}

export function calculateJPNetToGross(
  netAnnual: number,
  options: JPCalculatorOptions = {}
): SalaryCalculation {
  // Initial estimate (25% typical tax burden in Japan)
  let grossEstimate = netAnnual * 1.33;
  let iterations = 0;
  const maxIterations = 20;

  while (iterations < maxIterations) {
    const result = calculateJPGrossToNet(grossEstimate, options);
    const diff = result.netSalary - netAnnual;

    // Converged within ¥1
    if (Math.abs(diff) < 1) {
      return result;
    }

    // Adjust estimate
    grossEstimate -= diff;
    iterations++;
  }

  // Return best estimate after max iterations
  return calculateJPGrossToNet(grossEstimate, options);
}
