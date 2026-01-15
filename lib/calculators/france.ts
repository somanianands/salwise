// France Tax Calculator (2026)
// Based on official French Impôt sur le Revenu and URSSAF social contribution rates
import { SalaryCalculation, TaxBreakdown } from '../types';

export interface FRCalculatorOptions {
  maritalStatus?: 'single' | 'married' | 'single_parent';
  children?: number;
}

// Income tax brackets 2026 (applied to adjusted income after family quotient)
const INCOME_TAX_BRACKETS = [
  { min: 0, max: 10777, rate: 0 }, // 0%
  { min: 10777, max: 27478, rate: 0.11 }, // 11%
  { min: 27478, max: 78570, rate: 0.30 }, // 30%
  { min: 78570, max: 168994, rate: 0.41 }, // 41%
  { min: 168994, max: Infinity, rate: 0.45 } // 45%
];

// URSSAF Social Security Contributions (employee share, 2026)
// These are deducted from gross salary before any other calculation
const URSSAF_HEALTH_INSURANCE_RATE = 0.07; // ~7% health insurance
const URSSAF_PENSION_RATE = 0.105; // ~10.5% pension (basic + supplementary)
const URSSAF_UNEMPLOYMENT_RATE = 0.024; // 2.4% unemployment
const URSSAF_OTHER_RATE = 0.031; // ~3.1% other (work injury, etc.)

// Total URSSAF (approximate aggregate): ~22.5%
const TOTAL_URSSAF_RATE = URSSAF_HEALTH_INSURANCE_RATE + URSSAF_PENSION_RATE + URSSAF_UNEMPLOYMENT_RATE + URSSAF_OTHER_RATE;

// CSG & CRDS (General Social Contributions)
// Applied on 98.25% of gross salary
const CSG_RATE = 0.092; // 9.2% CSG
const CRDS_RATE = 0.005; // 0.5% CRDS
const SOCIAL_CHARGE_BASE_RATE = 0.9825; // CSG/CRDS base (98.25% of gross)

// Professional expenses standard deduction (forfait)
const PROFESSIONAL_EXPENSES_RATE = 0.10; // 10% standard deduction

function calculateFamilyQuotientParts(maritalStatus: string, children: number): number {
  let parts = 1; // Base for single

  if (maritalStatus === 'married') {
    parts = 2;
  } else if (maritalStatus === 'single_parent') {
    parts = 1.5; // Single parent gets extra 0.5 part
  }

  // First two children add 0.5 part each
  // Children after the second add 1 part each
  if (children > 0) {
    const firstTwoChildren = Math.min(children, 2);
    const additionalChildren = Math.max(children - 2, 0);
    parts += firstTwoChildren * 0.5 + additionalChildren * 1;
  }

  return parts;
}

function calculateProgressiveTax(income: number, brackets: typeof INCOME_TAX_BRACKETS): number {
  let tax = 0;
  let previousMax = 0;

  for (const bracket of brackets) {
    if (income <= previousMax) break;

    const taxableInBracket = Math.min(income, bracket.max) - previousMax;
    if (taxableInBracket > 0) {
      tax += taxableInBracket * bracket.rate;
    }

    previousMax = bracket.max;
  }

  return tax;
}

export function calculateFranceGrossToNet(grossAnnual: number, options: FRCalculatorOptions = {}): SalaryCalculation {
  const maritalStatus = options.maritalStatus || 'single';
  const children = options.children || 0;

  // Step 1: URSSAF Social Security Contributions (employee share)
  // Deducted directly from gross salary
  const urssafContributions = grossAnnual * TOTAL_URSSAF_RATE;

  // Step 2: CSG & CRDS (on 98.25% of gross)
  const csgCrdsBase = grossAnnual * SOCIAL_CHARGE_BASE_RATE;
  const csg = csgCrdsBase * CSG_RATE;
  const crds = csgCrdsBase * CRDS_RATE;
  const totalCsgCrds = csg + crds;

  // Total social contributions
  const totalSocialCharges = urssafContributions + totalCsgCrds;

  // Step 3: Calculate net taxable income
  // After social contributions and professional expenses deduction (10%)
  const professionalExpenses = grossAnnual * PROFESSIONAL_EXPENSES_RATE;
  const netTaxableIncome = grossAnnual - professionalExpenses;

  // Step 4: Apply family quotient (quotient familial)
  const quotientParts = calculateFamilyQuotientParts(maritalStatus, children);

  // Divide income by parts, calculate tax, then multiply by parts
  const incomePerPart = netTaxableIncome / quotientParts;
  const taxPerPart = calculateProgressiveTax(incomePerPart, INCOME_TAX_BRACKETS);
  const incomeTax = taxPerPart * quotientParts;

  // Step 5: Calculate net salary
  const totalTax = incomeTax;
  const netSalary = grossAnnual - totalTax - totalSocialCharges;

  const breakdown: TaxBreakdown[] = [
    { label: 'Income Tax', amount: incomeTax, rate: (incomeTax / grossAnnual) * 100, color: '#ef4444' },
    { label: 'URSSAF (Social Security)', amount: urssafContributions, rate: (urssafContributions / grossAnnual) * 100, color: '#3b82f6' },
    { label: 'CSG', amount: csg, rate: (csg / grossAnnual) * 100, color: '#8b5cf6' },
    { label: 'CRDS', amount: crds, rate: (crds / grossAnnual) * 100, color: '#06b6d4' },
    { label: 'Net Salary', amount: netSalary, rate: (netSalary / grossAnnual) * 100, color: '#10b981' }
  ];

  return {
    grossSalary: grossAnnual,
    netSalary,
    totalTax,
    socialSecurity: totalSocialCharges,
    otherDeductions: 0,
    effectiveTaxRate: ((totalTax + totalSocialCharges) / grossAnnual) * 100,
    breakdown
  };
}

export function calculateFranceNetToGross(netAnnual: number, options: FRCalculatorOptions = {}): SalaryCalculation {
  let grossEstimate = netAnnual * 1.5;
  let iterations = 0;
  const maxIterations = 20;

  while (iterations < maxIterations) {
    const result = calculateFranceGrossToNet(grossEstimate, options);
    const diff = result.netSalary - netAnnual;

    if (Math.abs(diff) < 1) {
      return result;
    }

    grossEstimate -= diff;
    iterations++;
  }

  return calculateFranceGrossToNet(grossEstimate, options);
}
