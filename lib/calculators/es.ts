// Spain Tax Calculator (2026)
// Based on SPAIN_MASTER_SPEC_2026.md
import { SalaryCalculation, TaxBreakdown } from '../types';
import { ESRegion, ES_REGIONS } from '../extended-types';

export type SpainFilingStatus = 'single' | 'married' | 'married_with_children' | 'head_of_household';
export type SpainEmploymentType = 'employee' | 'autonomo';

export interface ESCalculatorOptions {
  region?: ESRegion;
  filingStatus?: SpainFilingStatus;
  employmentType?: SpainEmploymentType;
  pensionContribution?: number;
  healthInsurance?: number;
  numberOfChildren?: number;
  age?: number;
}

// Spanish Income Tax brackets 2026 (IRPF - Impuesto sobre la Renta)
// Combined state + regional rates for most regions
const INCOME_TAX_BRACKETS = [
  { min: 0, max: 12450, rate: 0.19 },      // 19%
  { min: 12450, max: 20200, rate: 0.24 },  // 24%
  { min: 20200, max: 35200, rate: 0.30 },  // 30%
  { min: 35200, max: 60000, rate: 0.37 },  // 37%
  { min: 60000, max: 300000, rate: 0.45 }, // 45%
  { min: 300000, max: Infinity, rate: 0.47 } // 47%
];

// Personal Allowances (Deductions from taxable income before IRPF)
const PERSONAL_ALLOWANCE_BASE = 5550; // Base personal allowance
const PERSONAL_ALLOWANCE_65_PLUS = 6700; // Age 65+
const PERSONAL_ALLOWANCE_75_PLUS = 8100; // Age 75+
const MARRIED_ALLOWANCE_INCREASE = 3400; // Additional for married filing jointly
const CHILD_ALLOWANCE_FIRST = 2400; // First child
const CHILD_ALLOWANCE_SECOND = 2700; // Second child
const CHILD_ALLOWANCE_THIRD_PLUS = 4000; // Per child after second

// Social Security Contributions (Employee) 2026
const SOCIAL_SECURITY_EMPLOYEE_RATE = 0.0635; // 6.35%
const SOCIAL_SECURITY_MAX_BASE = 4070; // €4,070/month cap (€48,840/year)

// Pre-tax Deduction Caps
const MAX_PENSION_DEDUCTION = 1500; // €1,500/year
const MAX_HEALTH_INSURANCE_DEDUCTION = 500; // €500/year

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

function calculatePersonalAllowance(
  filingStatus: SpainFilingStatus,
  numberOfChildren: number,
  age: number
): number {
  // Base allowance depends on age
  let allowance = PERSONAL_ALLOWANCE_BASE;
  if (age >= 75) {
    allowance = PERSONAL_ALLOWANCE_75_PLUS;
  } else if (age >= 65) {
    allowance = PERSONAL_ALLOWANCE_65_PLUS;
  }

  // Add married allowance
  if (filingStatus === 'married' || filingStatus === 'married_with_children') {
    allowance += MARRIED_ALLOWANCE_INCREASE;
  }

  // Add child allowances
  if (numberOfChildren >= 1) {
    allowance += CHILD_ALLOWANCE_FIRST;
  }
  if (numberOfChildren >= 2) {
    allowance += CHILD_ALLOWANCE_SECOND;
  }
  if (numberOfChildren >= 3) {
    allowance += CHILD_ALLOWANCE_THIRD_PLUS * (numberOfChildren - 2);
  }

  return allowance;
}

function calculateSocialSecurityEmployee(grossAnnual: number): number {
  // Cap at €4,070/month (€48,840/year)
  const monthlySalary = grossAnnual / 12;
  const contributionBase = Math.min(monthlySalary, SOCIAL_SECURITY_MAX_BASE);
  const monthlyContribution = contributionBase * SOCIAL_SECURITY_EMPLOYEE_RATE;
  return monthlyContribution * 12;
}

function calculateSocialSecurityAutonomo(grossAnnual: number): number {
  // Progressive scale based on monthly income (2026 system)
  const monthlyIncome = grossAnnual / 12;

  // Progressive scale from SPAIN_MASTER_SPEC_2026.md lines 207-223
  if (monthlyIncome <= 670) return 230 * 12;
  if (monthlyIncome <= 900) return 260 * 12;
  if (monthlyIncome <= 1166.70) return 275 * 12;
  if (monthlyIncome <= 1300) return 291 * 12;
  if (monthlyIncome <= 1500) return 294 * 12;
  if (monthlyIncome <= 1700) return 294 * 12;
  if (monthlyIncome <= 1850) return 310 * 12;
  if (monthlyIncome <= 2030) return 320 * 12;
  if (monthlyIncome <= 2330) return 340 * 12;
  if (monthlyIncome <= 2760) return 360 * 12;
  if (monthlyIncome <= 3190) return 380 * 12;
  if (monthlyIncome <= 3620) return 400 * 12;
  if (monthlyIncome <= 4050) return 420 * 12;
  if (monthlyIncome <= 6000) return 500 * 12;

  // Above €6,000/month: maximum contribution
  return 1536 * 12; // €18,432/year
}

export function calculateESGrossToNet(
  grossAnnual: number,
  options: ESCalculatorOptions = {}
): SalaryCalculation {
  // Extract options with defaults
  const region = options.region || 'madrid';
  const filingStatus = options.filingStatus || 'single';
  const employmentType = options.employmentType || 'employee';
  const pensionContribution = options.pensionContribution || 0;
  const healthInsurance = options.healthInsurance || 0;
  const numberOfChildren = options.numberOfChildren || 0;
  const age = options.age || 35;

  // Step 1: Calculate Seguridad Social (Social Security) - FIRST
  // This is deducted from gross before calculating taxable income for IRPF
  let socialSecurity: number;
  if (employmentType === 'autonomo') {
    socialSecurity = calculateSocialSecurityAutonomo(grossAnnual);
  } else {
    socialSecurity = calculateSocialSecurityEmployee(grossAnnual);
  }

  // Step 2: Apply pre-tax deductions (capped)
  const validPension = Math.min(pensionContribution, MAX_PENSION_DEDUCTION);
  const validHealth = Math.min(healthInsurance, MAX_HEALTH_INSURANCE_DEDUCTION);
  const totalPreTaxDeductions = validPension + validHealth;

  // Step 3: Calculate taxable income (BASE IMPONIBLE)
  // = gross - social security - pre-tax deductions
  const taxableIncome = grossAnnual - socialSecurity - totalPreTaxDeductions;

  // Step 4: Calculate personal allowance
  const personalAllowance = calculatePersonalAllowance(filingStatus, numberOfChildren, age);

  // Step 5: Calculate IRPF base (taxable income - personal allowance)
  const irpfBase = Math.max(0, taxableIncome - personalAllowance);

  // Step 6: Calculate IRPF (Income Tax) using combined national + regional brackets
  // Note: INCOME_TAX_BRACKETS already include average regional rates
  const incomeTax = calculateProgressiveTax(irpfBase, INCOME_TAX_BRACKETS);

  // Step 7: Calculate totals
  const totalTax = incomeTax; // Only IRPF is "tax", social security is separate
  const netSalary = grossAnnual - totalTax - socialSecurity;
  const effectiveTaxRate = ((totalTax + socialSecurity) / grossAnnual) * 100;

  // Build breakdown
  const breakdown: TaxBreakdown[] = [
    {
      label: 'Income Tax (IRPF)',
      amount: incomeTax,
      rate: (incomeTax / grossAnnual) * 100,
      color: '#ef4444'
    },
    {
      label: `Social Security${employmentType === 'autonomo' ? ' (Autónomo)' : ''}`,
      amount: socialSecurity,
      rate: (socialSecurity / grossAnnual) * 100,
      color: '#3b82f6'
    }
  ];

  // Add pre-tax deductions to breakdown if present
  if (totalPreTaxDeductions > 0) {
    breakdown.push({
      label: 'Pre-Tax Deductions',
      amount: totalPreTaxDeductions,
      rate: (totalPreTaxDeductions / grossAnnual) * 100,
      color: '#8b5cf6'
    });
  }

  // Add net salary
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
    socialSecurity,
    otherDeductions: totalPreTaxDeductions,
    effectiveTaxRate,
    breakdown
  };
}

export function calculateESNetToGross(
  netAnnual: number,
  options: ESCalculatorOptions = {}
): SalaryCalculation {
  // Initial estimate (35% typical tax burden in Spain)
  let grossEstimate = netAnnual * 1.35;
  let iterations = 0;
  const maxIterations = 20;

  while (iterations < maxIterations) {
    const result = calculateESGrossToNet(grossEstimate, options);
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
  return calculateESGrossToNet(grossEstimate, options);
}
