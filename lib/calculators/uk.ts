// United Kingdom Tax Calculator (2026)
// Based on HMRC 2026 PAYE and National Insurance rates
import { SalaryCalculation, TaxBreakdown } from '../types';
import { UKRegion } from '../extended-types';

export type UKEmploymentType = 'employee' | 'self-employed';
export type UKStudentLoanPlan = 'none' | 'plan1' | 'plan2' | 'plan4' | 'postgraduate';

export interface UKCalculatorOptions {
  region?: UKRegion;
  employmentType?: UKEmploymentType;
  taxCode?: string; // e.g., '1257L' (default)
  pensionContribution?: number; // Annual pension contribution
  pensionScheme?: 'relief_at_source' | 'net_pay' | 'salary_sacrifice'; // Pension scheme type
  studentLoanPlan?: UKStudentLoanPlan;
  marriageAllowance?: boolean;
  otherPreTaxDeductions?: number;
  additionalWithholding?: number;
}

// England, Wales, Northern Ireland Tax brackets 2026
// These are applied to TAXABLE income (after personal allowance deduction)
const INCOME_TAX_BRACKETS_ENGLAND = [
  { min: 0, max: 37700, rate: 0.20 }, // Basic rate: £12,570-£50,270 = £37,700 taxable
  { min: 37700, max: 112570, rate: 0.40 }, // Higher rate: £50,270-£125,140 = £75,000 taxable (ends at £112,570 from £0)
  { min: 112570, max: Infinity, rate: 0.45 } // Additional rate: £125,140+ = £112,570+ taxable
];

// Scotland has different tax bands (2026)
// These are applied to TAXABLE income (after personal allowance deduction)
const INCOME_TAX_BRACKETS_SCOTLAND = [
  { min: 0, max: 2162, rate: 0.19 }, // Starter rate: £12,570-£14,732 = £2,162 taxable
  { min: 2162, max: 13118, rate: 0.20 }, // Basic rate: £14,732-£25,688 = £10,956 taxable (ends at £13,118 from £0)
  { min: 13118, max: 31092, rate: 0.21 }, // Intermediate: £25,688-£43,662 = £17,974 taxable (ends at £31,092 from £0)
  { min: 31092, max: 112570, rate: 0.41 }, // Higher rate: £43,662-£125,140 = £81,478 taxable (ends at £112,570 from £0)
  { min: 112570, max: Infinity, rate: 0.46 } // Top rate: £125,140+ = £112,570+ taxable
];

// National Insurance 2026 (WEEKLY thresholds)
const NI_WEEKLY_THRESHOLD = 242; // £242/week (£12,584/year)
const NI_WEEKLY_UPPER_LIMIT = 967; // £967/week (£50,284/year)

// Class 1 (Employee)
const NI_RATE_EMPLOYEE_BELOW_UPPER = 0.12; // 12% between £242-£967/week
const NI_RATE_EMPLOYEE_ABOVE_UPPER = 0.02; // 2% above £967/week

// Class 4 (Self-Employed) - applied to annual profits
const NI_SELF_EMPLOYED_THRESHOLD = 12570; // Annual threshold
const NI_SELF_EMPLOYED_UPPER_LIMIT = 50270; // Annual upper limit
const NI_RATE_SELF_EMPLOYED_BELOW_UPPER = 0.09; // 9% between thresholds
const NI_RATE_SELF_EMPLOYED_ABOVE_UPPER = 0.02; // 2% above upper limit

// Student Loan Thresholds 2025/2026
const STUDENT_LOAN_THRESHOLDS = {
  plan1: 22015,
  plan2: 27295,
  plan4: 27660,
  postgraduate: 21000
};

const STUDENT_LOAN_RATES = {
  plan1: 0.09,
  plan2: 0.09,
  plan4: 0.09,
  postgraduate: 0.06
};

function calculateProgressiveTax(income: number, brackets: typeof INCOME_TAX_BRACKETS_ENGLAND): number {
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

function parseTaxCode(taxCode: string): number {
  // Default tax code 1257L = £12,570 personal allowance
  if (!taxCode || taxCode === '') {
    return 12570;
  }

  // Extract numeric part from tax code (e.g., '1257L' -> 1257)
  const numericPart = parseInt(taxCode.replace(/[^0-9]/g, ''), 10);

  if (isNaN(numericPart)) {
    return 12570; // Default if parsing fails
  }

  // Tax code number × 10 = personal allowance
  return numericPart * 10;
}

function calculatePersonalAllowance(grossAnnual: number, baseAllowance: number): number {
  // Personal allowance taper: reduce by £1 for every £2 earned above £100,000
  const taperThreshold = 100000;

  if (grossAnnual <= taperThreshold) {
    return baseAllowance;
  }

  const excess = grossAnnual - taperThreshold;
  const reduction = Math.floor(excess / 2);
  const taperedAllowance = Math.max(0, baseAllowance - reduction);

  return taperedAllowance;
}

function calculateNationalInsurance(grossAnnual: number, employmentType: UKEmploymentType): number {
  let ni = 0;

  if (employmentType === 'employee') {
    // Class 1 NI: Calculate based on WEEKLY earnings
    const weeklyGross = grossAnnual / 52;

    if (weeklyGross <= NI_WEEKLY_THRESHOLD) {
      return 0; // No NI below threshold
    }

    // NI between £242 and £967 per week at 12%
    const primaryNI = Math.min(weeklyGross, NI_WEEKLY_UPPER_LIMIT) - NI_WEEKLY_THRESHOLD;
    ni += primaryNI * NI_RATE_EMPLOYEE_BELOW_UPPER;

    // NI above £967 per week at 2%
    if (weeklyGross > NI_WEEKLY_UPPER_LIMIT) {
      const upperNI = weeklyGross - NI_WEEKLY_UPPER_LIMIT;
      ni += upperNI * NI_RATE_EMPLOYEE_ABOVE_UPPER;
    }

    // Multiply by 52 weeks to get annual NI
    ni = ni * 52;
  } else {
    // Class 4 NI (Self-Employed): Calculate on annual profits
    if (grossAnnual <= NI_SELF_EMPLOYED_THRESHOLD) {
      return 0;
    }

    // 9% on profits between £12,570 and £50,270
    const tierOne = Math.min(grossAnnual, NI_SELF_EMPLOYED_UPPER_LIMIT) - NI_SELF_EMPLOYED_THRESHOLD;
    if (tierOne > 0) {
      ni += tierOne * NI_RATE_SELF_EMPLOYED_BELOW_UPPER;
    }

    // 2% on profits above £50,270
    if (grossAnnual > NI_SELF_EMPLOYED_UPPER_LIMIT) {
      ni += (grossAnnual - NI_SELF_EMPLOYED_UPPER_LIMIT) * NI_RATE_SELF_EMPLOYED_ABOVE_UPPER;
    }
  }

  return ni;
}

export function calculateUKGrossToNet(grossAnnual: number, options: UKCalculatorOptions = {}): SalaryCalculation {
  const region = options.region || 'england';
  const employmentType = options.employmentType || 'employee';
  const taxCode = options.taxCode || '1257L';
  const pensionContribution = options.pensionContribution || 0;
  const pensionScheme = options.pensionScheme || 'net_pay';
  const studentLoanPlan = options.studentLoanPlan || 'none';
  const marriageAllowance = options.marriageAllowance || false;
  const otherPreTaxDeductions = options.otherPreTaxDeductions || 0;
  const additionalWithholding = options.additionalWithholding || 0;

  // Parse tax code to get base personal allowance
  const basePersonalAllowance = parseTaxCode(taxCode);

  // Apply personal allowance taper for high earners
  let personalAllowance = calculatePersonalAllowance(grossAnnual, basePersonalAllowance);

  // Marriage allowance: can transfer £1,260 from spouse if income < basic rate limit
  if (marriageAllowance && grossAnnual < 50270) {
    personalAllowance += 1260;
  }

  // Calculate total pre-tax deductions (depends on pension scheme)
  let totalPreTaxDeductions = 0;
  let pensionForTaxCalculation = 0;

  if (pensionScheme === 'net_pay' || pensionScheme === 'salary_sacrifice') {
    // Net pay and salary sacrifice: pension reduces taxable income
    totalPreTaxDeductions = pensionContribution + otherPreTaxDeductions;
    pensionForTaxCalculation = pensionContribution;
  } else {
    // Relief at source: pension doesn't reduce taxable income (gets 20% relief)
    totalPreTaxDeductions = otherPreTaxDeductions;
    pensionForTaxCalculation = 0;
  }

  // Calculate income after pre-tax deductions
  const grossAfterPreTax = grossAnnual - pensionForTaxCalculation - otherPreTaxDeductions;

  // Calculate taxable income (after personal allowance)
  const taxableIncome = Math.max(0, grossAfterPreTax - personalAllowance);

  // Select tax brackets based on region (brackets are for TAXABLE income, after PA)
  const brackets = region === 'scotland' ? INCOME_TAX_BRACKETS_SCOTLAND : INCOME_TAX_BRACKETS_ENGLAND;

  // Calculate PAYE income tax
  const incomeTax = calculateProgressiveTax(taxableIncome, brackets);

  // Calculate National Insurance (on GROSS income, not affected by pension or personal allowance)
  const nationalInsurance = calculateNationalInsurance(grossAnnual, employmentType);

  // Calculate student loan repayment based on plan
  let studentLoanRepayment = 0;
  if (studentLoanPlan !== 'none') {
    const threshold = STUDENT_LOAN_THRESHOLDS[studentLoanPlan];
    const rate = STUDENT_LOAN_RATES[studentLoanPlan];

    if (grossAnnual > threshold) {
      studentLoanRepayment = (grossAnnual - threshold) * rate;
    }
  }

  const totalTax = incomeTax + additionalWithholding;
  const totalDeductions = nationalInsurance + studentLoanRepayment;
  const netSalary = grossAnnual - totalTax - totalDeductions - totalPreTaxDeductions;

  const employmentLabel = employmentType === 'self-employed' ? ' (Class 4)' : ' (Class 1)';

  const breakdown: TaxBreakdown[] = [
    { label: 'Income Tax (PAYE)', amount: incomeTax, rate: (incomeTax / grossAnnual) * 100, color: '#ef4444' },
    { label: `National Insurance${employmentLabel}`, amount: nationalInsurance, rate: (nationalInsurance / grossAnnual) * 100, color: '#3b82f6' }
  ];

  // Add pre-tax deductions to breakdown if applicable
  if (pensionContribution > 0) {
    const pensionLabel = pensionScheme === 'relief_at_source'
      ? 'Pension (Relief at Source)'
      : pensionScheme === 'salary_sacrifice'
      ? 'Pension (Salary Sacrifice)'
      : 'Pension (Net Pay)';
    breakdown.push({ label: pensionLabel, amount: pensionContribution, rate: (pensionContribution / grossAnnual) * 100, color: '#8b5cf6' });
  }

  if (otherPreTaxDeductions > 0) {
    breakdown.push({ label: 'Other Pre-Tax Deductions', amount: otherPreTaxDeductions, rate: (otherPreTaxDeductions / grossAnnual) * 100, color: '#a855f7' });
  }

  if (studentLoanRepayment > 0) {
    const loanLabel = `Student Loan (${studentLoanPlan.charAt(0).toUpperCase() + studentLoanPlan.slice(1)})`;
    breakdown.push({ label: loanLabel, amount: studentLoanRepayment, rate: (studentLoanRepayment / grossAnnual) * 100, color: '#f59e0b' });
  }

  if (additionalWithholding > 0) {
    breakdown.push({ label: 'Additional Withholding', amount: additionalWithholding, rate: (additionalWithholding / grossAnnual) * 100, color: '#dc2626' });
  }

  breakdown.push({ label: 'Net Salary', amount: netSalary, rate: (netSalary / grossAnnual) * 100, color: '#10b981' });

  return {
    grossSalary: grossAnnual,
    netSalary,
    totalTax: totalTax,
    socialSecurity: nationalInsurance,
    otherDeductions: totalPreTaxDeductions + studentLoanRepayment,
    effectiveTaxRate: ((totalTax + totalDeductions) / grossAnnual) * 100,
    breakdown
  };
}

export function calculateUKNetToGross(netAnnual: number, options: UKCalculatorOptions = {}): SalaryCalculation {
  let grossEstimate = netAnnual * 1.35;
  let iterations = 0;
  const maxIterations = 20;

  while (iterations < maxIterations) {
    const result = calculateUKGrossToNet(grossEstimate, options);
    const diff = result.netSalary - netAnnual;

    if (Math.abs(diff) < 1) {
      return result;
    }

    grossEstimate -= diff;
    iterations++;
  }

  return calculateUKGrossToNet(grossEstimate, options);
}
