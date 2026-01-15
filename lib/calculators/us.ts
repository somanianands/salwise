// United States Tax Calculator (2026)
// Based on IRS Revenue Procedure 2025-32 / Official IRS 2026 Tax Data
import { SalaryCalculation, TaxBreakdown } from '../types';
import { USState, US_STATES, FilingStatus } from '../extended-types';
import { calculateStateTax, getStateTaxInfo } from './us-state-taxes';

// Federal tax brackets 2026 by filing status (OFFICIAL IRS DATA)
const FEDERAL_BRACKETS = {
  single: [
    { min: 0, max: 12400, rate: 0.10 },
    { min: 12400, max: 50400, rate: 0.12 },
    { min: 50400, max: 105700, rate: 0.22 },
    { min: 105700, max: 201775, rate: 0.24 },
    { min: 201775, max: 256225, rate: 0.32 },
    { min: 256225, max: 640600, rate: 0.35 },
    { min: 640600, max: Infinity, rate: 0.37 }
  ],
  married_joint: [
    { min: 0, max: 24800, rate: 0.10 },
    { min: 24800, max: 100800, rate: 0.12 },
    { min: 100800, max: 211400, rate: 0.22 },
    { min: 211400, max: 403550, rate: 0.24 },
    { min: 403550, max: 512450, rate: 0.32 },
    { min: 512450, max: 768700, rate: 0.35 },
    { min: 768700, max: Infinity, rate: 0.37 }
  ],
  married_separate: [
    { min: 0, max: 12400, rate: 0.10 },
    { min: 12400, max: 50400, rate: 0.12 },
    { min: 50400, max: 105700, rate: 0.22 },
    { min: 105700, max: 201775, rate: 0.24 },
    { min: 201775, max: 256225, rate: 0.32 },
    { min: 256225, max: 384350, rate: 0.35 },
    { min: 384350, max: Infinity, rate: 0.37 }
  ],
  head_of_household: [
    { min: 0, max: 17700, rate: 0.10 },
    { min: 17700, max: 67450, rate: 0.12 },
    { min: 67450, max: 105700, rate: 0.22 },
    { min: 105700, max: 201775, rate: 0.24 },
    { min: 201775, max: 256200, rate: 0.32 },
    { min: 256200, max: 640600, rate: 0.35 },
    { min: 640600, max: Infinity, rate: 0.37 }
  ]
};

// Social Security: 6.2% (employee) or 12.4% (self-employed) up to $184,500 (2026 OFFICIAL)
const SOCIAL_SECURITY_RATE_EMPLOYEE = 0.062;
const SOCIAL_SECURITY_RATE_SELF_EMPLOYED = 0.124;
const SOCIAL_SECURITY_MAX = 184500;

// Medicare: 1.45% (employee) or 2.9% (self-employed) + 0.9% additional for high earners
const MEDICARE_RATE_EMPLOYEE = 0.0145;
const MEDICARE_RATE_SELF_EMPLOYED = 0.029;
const MEDICARE_ADDITIONAL_RATE = 0.009;

// Additional Medicare thresholds by filing status
const MEDICARE_ADDITIONAL_THRESHOLDS = {
  single: 200000,
  married_joint: 250000,
  married_separate: 125000,
  head_of_household: 200000
};

// Standard deductions by filing status (2026 OFFICIAL IRS DATA)
const STANDARD_DEDUCTIONS = {
  single: 16100,
  married_joint: 32200,
  married_separate: 16100,
  head_of_household: 24150
};

export type EmploymentType = 'employee' | 'self-employed';

export interface USCalculatorOptions {
  state?: USState;
  filingStatus?: FilingStatus;
  employmentType?: EmploymentType;
  retirement401k?: number;
  traditionalIRA?: number;
  hsa?: number;
  dependents?: number;
  healthInsurance?: number;
  otherPreTaxDeductions?: number;
  additionalWithholding?: number;
  customStateTaxRate?: number;
}

function calculateProgressiveTax(income: number, brackets: Array<{ min: number; max: number; rate: number }>): number {
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

export function calculateUSGrossToNet(
  grossAnnual: number,
  options: USCalculatorOptions = {}
): SalaryCalculation {
  const {
    state = 'CA',
    filingStatus = 'single',
    employmentType = 'employee',
    retirement401k = 0,
    traditionalIRA = 0,
    hsa = 0,
    dependents = 0,
    healthInsurance = 0,
    otherPreTaxDeductions = 0,
    additionalWithholding = 0,
    customStateTaxRate
  } = options;

  // Calculate pre-tax deductions
  const total401k = Math.min(retirement401k, 23000); // 2025 limit
  const totalIRA = Math.min(traditionalIRA, 7000); // 2025 limit
  const totalHSA = Math.min(hsa, 4150); // 2025 limit for single
  const totalHealthInsurance = healthInsurance;
  const totalOtherPreTax = otherPreTaxDeductions;
  const totalPreTaxDeductions = total401k + totalIRA + totalHSA + totalHealthInsurance + totalOtherPreTax;

  // Standard deduction by filing status
  const standardDeduction = STANDARD_DEDUCTIONS[filingStatus];

  // Taxable income after pre-tax deductions and standard deduction
  const taxableIncome = Math.max(grossAnnual - totalPreTaxDeductions - standardDeduction, 0);

  // Federal income tax based on filing status
  const brackets = FEDERAL_BRACKETS[filingStatus];
  const federalTax = calculateProgressiveTax(taxableIncome, brackets);

  // FICA taxes (different rates for employee vs self-employed)
  const socialSecurityRate = employmentType === 'self-employed'
    ? SOCIAL_SECURITY_RATE_SELF_EMPLOYED
    : SOCIAL_SECURITY_RATE_EMPLOYEE;

  const medicareRate = employmentType === 'self-employed'
    ? MEDICARE_RATE_SELF_EMPLOYED
    : MEDICARE_RATE_EMPLOYEE;

  // Social Security tax (capped, calculated on gross)
  const socialSecurityBase = Math.min(grossAnnual, SOCIAL_SECURITY_MAX);
  const socialSecurity = socialSecurityBase * socialSecurityRate;

  // Medicare tax (calculated on gross, with additional for high earners)
  let medicare = grossAnnual * medicareRate;

  // Additional Medicare tax (0.9% on income above threshold by filing status)
  const additionalMedicareThreshold = MEDICARE_ADDITIONAL_THRESHOLDS[filingStatus];
  if (grossAnnual > additionalMedicareThreshold) {
    medicare += (grossAnnual - additionalMedicareThreshold) * MEDICARE_ADDITIONAL_RATE;
  }

  // State tax (using comprehensive state tax calculator)
  // Support custom rate override for manual adjustments
  let stateTax: number;
  if (customStateTaxRate !== undefined) {
    // Use custom rate if provided
    stateTax = taxableIncome * customStateTaxRate;
  } else {
    // Use comprehensive state tax calculator (handles flat, progressive, none)
    stateTax = calculateStateTax(state, taxableIncome);
  }

  // Get state info for display purposes
  const stateInfo = getStateTaxInfo(state);

  // Dependent tax credit (simplified - $2000 per child)
  const dependentCredit = Math.min(dependents * 2000, federalTax); // Cannot exceed federal tax owed

  // Final federal tax after credits and additional withholding
  const federalTaxAfterCredits = Math.max(federalTax - dependentCredit, 0);
  const totalFederalTax = federalTaxAfterCredits + additionalWithholding;

  const totalTax = totalFederalTax + stateTax;
  const totalDeductions = socialSecurity + medicare;
  const netSalary = grossAnnual - totalTax - totalDeductions;

  const employmentLabel = employmentType === 'self-employed' ? ' (Self-Employed)' : '';

  const breakdown: TaxBreakdown[] = [
    { label: 'Federal Tax', amount: totalFederalTax, rate: (totalFederalTax / grossAnnual) * 100, color: '#ef4444' },
    ...(stateTax > 0 ? [{ label: `State Tax (${US_STATES[state].name})`, amount: stateTax, rate: (stateTax / grossAnnual) * 100, color: '#f97316' }] : []),
    { label: `Social Security${employmentLabel}`, amount: socialSecurity, rate: (socialSecurity / grossAnnual) * 100, color: '#3b82f6' },
    { label: `Medicare${employmentLabel}`, amount: medicare, rate: (medicare / grossAnnual) * 100, color: '#8b5cf6' },
    ...(totalPreTaxDeductions > 0 ? [{ label: 'Pre-Tax Deductions', amount: totalPreTaxDeductions, rate: (totalPreTaxDeductions / grossAnnual) * 100, color: '#10b981' }] : []),
    ...(dependentCredit > 0 ? [{ label: 'Dependent Tax Credit', amount: -dependentCredit, rate: -(dependentCredit / grossAnnual) * 100, color: '#22c55e' }] : []),
    ...(additionalWithholding > 0 ? [{ label: 'Additional Withholding', amount: additionalWithholding, rate: (additionalWithholding / grossAnnual) * 100, color: '#ef4444' }] : []),
    { label: 'Net Salary', amount: netSalary, rate: (netSalary / grossAnnual) * 100, color: '#10b981' }
  ];

  return {
    grossSalary: grossAnnual,
    netSalary,
    totalTax,
    socialSecurity: totalDeductions,
    otherDeductions: totalPreTaxDeductions,
    effectiveTaxRate: ((totalTax + totalDeductions) / grossAnnual) * 100,
    breakdown
  };
}

export function calculateUSNetToGross(
  netAnnual: number,
  options: USCalculatorOptions = {}
): SalaryCalculation {
  // Iterative approach to find gross salary
  let grossEstimate = netAnnual * 1.4; // Start with 40% overhead estimate
  let iterations = 0;
  const maxIterations = 20;

  while (iterations < maxIterations) {
    const result = calculateUSGrossToNet(grossEstimate, options);
    const diff = result.netSalary - netAnnual;

    if (Math.abs(diff) < 1) {
      return result;
    }

    // Adjust estimate
    grossEstimate -= diff;
    iterations++;
  }

  return calculateUSGrossToNet(grossEstimate, options);
}
