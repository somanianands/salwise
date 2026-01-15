// Ireland Tax Calculator (2026)
import { SalaryCalculation, TaxBreakdown } from '../types';
import { IEMaritalStatus } from '../extended-types';

export type IEEmploymentType = 'employee' | 'self-employed';

export interface IECalculatorOptions {
  maritalStatus?: IEMaritalStatus;
  employmentType?: IEEmploymentType;
  pensionContribution?: number; // Annual pension contribution
  healthInsurance?: number; // Employer-sponsored health insurance
  otherPreTaxBenefits?: number; // Other pre-tax deductions
  dependents?: number; // Number of dependents
  additionalWithholding?: number; // Voluntary extra tax withheld
}

// Irish Income Tax brackets 2026
// Standard rate band thresholds per Revenue 2026
const INCOME_TAX_BRACKETS_SINGLE = [
  { min: 0, max: 44000, rate: 0.20 }, // Standard rate 20% - €44,000
  { min: 44000, max: Infinity, rate: 0.40 } // Higher rate 40%
];

const INCOME_TAX_BRACKETS_MARRIED = [
  { min: 0, max: 88000, rate: 0.20 }, // Married (two incomes) - max €88,000
  { min: 88000, max: Infinity, rate: 0.40 }
];

const INCOME_TAX_BRACKETS_MARRIED_ONE_EARNER = [
  { min: 0, max: 53000, rate: 0.20 }, // Married (single income) - €53,000
  { min: 53000, max: Infinity, rate: 0.40 }
];

// USC (Universal Social Charge) 2026
const USC_BRACKETS = [
  { min: 0, max: 12012, rate: 0.005 }, // 0.5%
  { min: 12012, max: 28700, rate: 0.02 }, // 2% (updated threshold for 2026)
  { min: 28700, max: 70044, rate: 0.03 }, // 3% (corrected from 4.5%)
  { min: 70044, max: Infinity, rate: 0.08 } // 8%
];

// USC Exemption threshold
const USC_EXEMPTION_THRESHOLD = 13000;

// USC Self-Employed surcharge (3% additional on income above €100k)
const USC_SELF_EMPLOYED_SURCHARGE_THRESHOLD = 100000;
const USC_SELF_EMPLOYED_SURCHARGE_RATE = 0.03; // Total 11% (8% + 3%) above €100k

// PRSI (Pay Related Social Insurance) 2026
// Rate increased to 4.35% from October 2026
const PRSI_RATE = 0.0435; // 4.35%

// PRSI thresholds
const PRSI_THRESHOLD_EMPLOYEE = 18304; // €352 per week × 52
const PRSI_THRESHOLD_SELF_EMPLOYED = 5000;

function calculateProgressiveTax(income: number, brackets: typeof INCOME_TAX_BRACKETS_SINGLE): number {
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

function calculateUSC(grossAnnual: number, employmentType: IEEmploymentType): number {
  // USC exemption for low earners
  if (grossAnnual < USC_EXEMPTION_THRESHOLD) {
    return 0;
  }

  let usc = calculateProgressiveTax(grossAnnual, USC_BRACKETS);

  // Self-employed surcharge: additional 3% on income above €100k (total 11%)
  if (employmentType === 'self-employed' && grossAnnual > USC_SELF_EMPLOYED_SURCHARGE_THRESHOLD) {
    const surchargeAmount = grossAnnual - USC_SELF_EMPLOYED_SURCHARGE_THRESHOLD;
    usc += surchargeAmount * USC_SELF_EMPLOYED_SURCHARGE_RATE;
  }

  return usc;
}

function calculatePRSI(grossAnnual: number, employmentType: IEEmploymentType): number {
  // Different thresholds for employee vs self-employed
  const threshold = employmentType === 'employee' ? PRSI_THRESHOLD_EMPLOYEE : PRSI_THRESHOLD_SELF_EMPLOYED;

  if (grossAnnual < threshold) {
    return 0;
  }

  // PRSI applies to ALL income if above threshold (not just the excess)
  return grossAnnual * PRSI_RATE;
}

export function calculateIEGrossToNet(grossAnnual: number, options: IECalculatorOptions = {}): SalaryCalculation {
  const maritalStatus = options.maritalStatus || 'single';
  const employmentType = options.employmentType || 'employee';
  const pensionContribution = options.pensionContribution || 0;
  const healthInsurance = options.healthInsurance || 0;
  const otherPreTaxBenefits = options.otherPreTaxBenefits || 0;
  const additionalWithholding = options.additionalWithholding || 0;

  // Calculate total pre-tax deductions
  const totalPreTaxDeductions = pensionContribution + healthInsurance + otherPreTaxBenefits;

  // Select appropriate tax brackets based on marital status
  let brackets = INCOME_TAX_BRACKETS_SINGLE;
  if (maritalStatus === 'married') {
    brackets = INCOME_TAX_BRACKETS_MARRIED;
  } else if (maritalStatus === 'married_one_earner') {
    brackets = INCOME_TAX_BRACKETS_MARRIED_ONE_EARNER;
  }

  // Pension and other pre-tax deductions reduce taxable income for Income Tax ONLY
  const taxableIncome = Math.max(0, grossAnnual - totalPreTaxDeductions);

  // Calculate income tax on taxable income (before credits)
  let grossIncomeTax = calculateProgressiveTax(taxableIncome, brackets);

  // Tax Credits 2026 (updated from €1,775 to €2,000)
  const personalCredit = maritalStatus === 'single' ? 2000 : 4000; // €2,000 per person
  const payeCredit = employmentType === 'employee' ? 2000 : 0; // PAYE Credit for employees
  const earnedIncomeCredit = employmentType === 'self-employed' ? 2000 : 0; // Earned Income Credit for self-employed
  const totalTaxCredits = personalCredit + payeCredit + earnedIncomeCredit;

  // Tax credits reduce income tax owed (but not below 0)
  const incomeTax = Math.max(0, grossIncomeTax - totalTaxCredits);

  // USC and PRSI are calculated on GROSS income (NOT reduced by pension or pre-tax deductions)
  const usc = calculateUSC(grossAnnual, employmentType);
  const prsi = calculatePRSI(grossAnnual, employmentType);

  const totalTax = incomeTax + usc + prsi + additionalWithholding;
  const socialSecurity = prsi;
  const netSalary = grossAnnual - totalTax - totalPreTaxDeductions;

  const breakdown: TaxBreakdown[] = [
    { label: 'Income Tax', amount: incomeTax, rate: (incomeTax / grossAnnual) * 100, color: '#ef4444' },
    { label: 'USC', amount: usc, rate: (usc / grossAnnual) * 100, color: '#f97316' },
    { label: 'PRSI', amount: prsi, rate: (prsi / grossAnnual) * 100, color: '#3b82f6' }
  ];

  // Add pre-tax deductions to breakdown if applicable
  if (pensionContribution > 0) {
    breakdown.push({ label: 'Pension', amount: pensionContribution, rate: (pensionContribution / grossAnnual) * 100, color: '#8b5cf6' });
  }

  if (healthInsurance > 0) {
    breakdown.push({ label: 'Health Insurance', amount: healthInsurance, rate: (healthInsurance / grossAnnual) * 100, color: '#a855f7' });
  }

  if (otherPreTaxBenefits > 0) {
    breakdown.push({ label: 'Other Pre-Tax Benefits', amount: otherPreTaxBenefits, rate: (otherPreTaxBenefits / grossAnnual) * 100, color: '#9333ea' });
  }

  if (additionalWithholding > 0) {
    breakdown.push({ label: 'Additional Withholding', amount: additionalWithholding, rate: (additionalWithholding / grossAnnual) * 100, color: '#dc2626' });
  }

  breakdown.push({ label: 'Net Salary', amount: netSalary, rate: (netSalary / grossAnnual) * 100, color: '#10b981' });

  return {
    grossSalary: grossAnnual,
    netSalary,
    totalTax: incomeTax + usc + prsi + additionalWithholding,
    socialSecurity: prsi,
    otherDeductions: totalPreTaxDeductions,
    effectiveTaxRate: ((incomeTax + usc + prsi + additionalWithholding) / grossAnnual) * 100,
    breakdown
  };
}

export function calculateIENetToGross(netAnnual: number, options: IECalculatorOptions = {}): SalaryCalculation {
  let grossEstimate = netAnnual * 1.45; // Initial estimate
  let iterations = 0;
  const maxIterations = 20;

  while (iterations < maxIterations) {
    const result = calculateIEGrossToNet(grossEstimate, options);
    const diff = result.netSalary - netAnnual;

    if (Math.abs(diff) < 1) {
      return result;
    }

    grossEstimate -= diff;
    iterations++;
  }

  return calculateIEGrossToNet(grossEstimate, options);
}
