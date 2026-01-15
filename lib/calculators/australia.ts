// Australia Tax Calculator (2025-26 Tax Year: 1 July 2025 - 30 June 2026)
// Based on ATO official rates
import { SalaryCalculation, TaxBreakdown } from '../types';

export interface AUCalculatorOptions {
  medicareLevyExemption?: boolean;
  helpDebt?: boolean;
  isResident?: boolean; // Default true (residents get tax-free threshold)
  hasPrivateHealth?: boolean; // For Medicare Levy Surcharge
}

// Income tax brackets 2025-26 (Residents)
const INCOME_TAX_BRACKETS_RESIDENT = [
  { min: 0, max: 18200, rate: 0 }, // Tax-free threshold
  { min: 18200, max: 45000, rate: 0.19 },
  { min: 45000, max: 120000, rate: 0.325 }, // Updated from 135000 to 120000
  { min: 120000, max: 180000, rate: 0.37 }, // Updated from 190000 to 180000
  { min: 180000, max: Infinity, rate: 0.45 }
];

// Income tax brackets 2025-26 (Non-Residents)
const INCOME_TAX_BRACKETS_NON_RESIDENT = [
  { min: 0, max: 120000, rate: 0.325 }, // No tax-free threshold
  { min: 120000, max: 180000, rate: 0.37 },
  { min: 180000, max: Infinity, rate: 0.45 }
];

// Low Income Tax Offset (LITO) 2025-26
const LITO_MAX = 700;
const LITO_THRESHOLD_START = 37000; // Starts phasing out
const LITO_THRESHOLD_END = 45000; // Fully phased out

// Medicare levy: 2%
const MEDICARE_LEVY_RATE = 0.02;
const MEDICARE_LEVY_THRESHOLD = 24276;
const MEDICARE_LEVY_EXEMPTION_THRESHOLD = 26000;

// Medicare Levy Surcharge (for high earners without private health)
const MLS_THRESHOLD_SINGLE = 97000;
const MLS_THRESHOLD_FAMILY = 194000;
const MLS_RATES = [
  { min: 0, max: 97000, rate: 0 }, // Below threshold
  { min: 97000, max: 113000, rate: 0.01 }, // 1%
  { min: 113000, max: 151000, rate: 0.0125 }, // 1.25%
  { min: 151000, max: Infinity, rate: 0.015 } // 1.5%
];

// HELP/HECS repayment thresholds 2025/2026
const HELP_REPAYMENT_BRACKETS = [
  { min: 0, max: 51550, rate: 0 },
  { min: 51550, max: 59518, rate: 0.01 },
  { min: 59518, max: 63089, rate: 0.02 },
  { min: 63089, max: 66875, rate: 0.025 },
  { min: 66875, max: 70888, rate: 0.03 },
  { min: 70888, max: 75140, rate: 0.035 },
  { min: 75140, max: 79649, rate: 0.04 },
  { min: 79649, max: 84429, rate: 0.045 },
  { min: 84429, max: 89494, rate: 0.05 },
  { min: 89494, max: 94865, rate: 0.055 },
  { min: 94865, max: 100557, rate: 0.06 },
  { min: 100557, max: 106590, rate: 0.065 },
  { min: 106590, max: 112985, rate: 0.07 },
  { min: 112985, max: 119764, rate: 0.075 },
  { min: 119764, max: 126950, rate: 0.08 },
  { min: 126950, max: 134568, rate: 0.085 },
  { min: 134568, max: 142642, rate: 0.09 },
  { min: 142642, max: 151200, rate: 0.095 },
  { min: 151200, max: Infinity, rate: 0.10 }
];

function calculateProgressiveTax(income: number, brackets: typeof INCOME_TAX_BRACKETS_RESIDENT): number {
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

function calculateLITO(taxableIncome: number): number {
  // Low Income Tax Offset phases out between $37,000 and $45,000
  if (taxableIncome <= LITO_THRESHOLD_START) {
    return LITO_MAX; // Full $700 offset
  } else if (taxableIncome >= LITO_THRESHOLD_END) {
    return 0; // No offset
  } else {
    // Linear phase out between $37,000 and $45,000
    const phaseOutRange = LITO_THRESHOLD_END - LITO_THRESHOLD_START;
    const excess = taxableIncome - LITO_THRESHOLD_START;
    const phaseOutRate = LITO_MAX / phaseOutRange;
    return Math.max(0, LITO_MAX - (excess * phaseOutRate));
  }
}

function calculateMedicareLevy(grossAnnual: number, exemption: boolean): number {
  if (exemption && grossAnnual < MEDICARE_LEVY_EXEMPTION_THRESHOLD) return 0;
  if (grossAnnual < MEDICARE_LEVY_THRESHOLD) return 0;
  return grossAnnual * MEDICARE_LEVY_RATE;
}

function calculateMedicareLevySurcharge(grossAnnual: number, hasPrivateHealth: boolean): number {
  // No surcharge if has private health insurance
  if (hasPrivateHealth) return 0;

  // Apply surcharge for high earners without private health
  for (const bracket of MLS_RATES) {
    if (grossAnnual >= bracket.min && grossAnnual < bracket.max) {
      return grossAnnual * bracket.rate;
    }
  }
  return grossAnnual * 0.015; // Max rate 1.5%
}

function calculateHELPRepayment(grossAnnual: number): number {
  for (const bracket of HELP_REPAYMENT_BRACKETS) {
    if (grossAnnual >= bracket.min && grossAnnual < bracket.max) {
      return grossAnnual * bracket.rate;
    }
  }
  return grossAnnual * 0.10; // Max rate
}

export function calculateAustraliaGrossToNet(grossAnnual: number, options: AUCalculatorOptions = {}): SalaryCalculation {
  const medicareLevyExemption = options.medicareLevyExemption || false;
  const helpDebt = options.helpDebt || false;
  const isResident = options.isResident !== false; // Default true
  const hasPrivateHealth = options.hasPrivateHealth !== false; // Default true

  // Select appropriate tax brackets based on residency
  const brackets = isResident ? INCOME_TAX_BRACKETS_RESIDENT : INCOME_TAX_BRACKETS_NON_RESIDENT;

  // Calculate income tax
  const incomeTaxBeforeOffset = calculateProgressiveTax(grossAnnual, brackets);

  // Apply LITO (Low Income Tax Offset) for residents only
  const litoOffset = isResident ? calculateLITO(grossAnnual) : 0;
  const incomeTax = Math.max(0, incomeTaxBeforeOffset - litoOffset);

  // Calculate Medicare Levy (2%) - ONLY for residents
  const medicareLevy = isResident ? calculateMedicareLevy(grossAnnual, medicareLevyExemption) : 0;

  // Calculate Medicare Levy Surcharge (for high earners without private health) - ONLY for residents
  const medicareLevySurcharge = isResident ? calculateMedicareLevySurcharge(grossAnnual, hasPrivateHealth) : 0;

  // Calculate HELP/HECS repayment
  const helpRepayment = helpDebt ? calculateHELPRepayment(grossAnnual) : 0;

  const totalTax = incomeTax;
  const totalDeductions = medicareLevy + medicareLevySurcharge + helpRepayment;
  const netSalary = grossAnnual - totalTax - totalDeductions;

  const breakdown: TaxBreakdown[] = [
    { label: 'Income Tax', amount: incomeTax, rate: (incomeTax / grossAnnual) * 100, color: '#ef4444' },
    { label: 'Medicare Levy', amount: medicareLevy, rate: (medicareLevy / grossAnnual) * 100, color: '#3b82f6' }
  ];

  if (medicareLevySurcharge > 0) {
    breakdown.push({ label: 'Medicare Levy Surcharge', amount: medicareLevySurcharge, rate: (medicareLevySurcharge / grossAnnual) * 100, color: '#f97316' });
  }

  if (helpRepayment > 0) {
    breakdown.push({ label: 'HELP/HECS', amount: helpRepayment, rate: (helpRepayment / grossAnnual) * 100, color: '#f59e0b' });
  }

  // Only show LITO if it actually reduces tax (i.e., there was tax to offset)
  if (litoOffset > 0 && incomeTaxBeforeOffset > 0) {
    breakdown.push({ label: 'LITO (Offset)', amount: -litoOffset, rate: -(litoOffset / grossAnnual) * 100, color: '#22c55e' });
  }

  breakdown.push({ label: 'Net Salary', amount: netSalary, rate: (netSalary / grossAnnual) * 100, color: '#10b981' });

  return {
    grossSalary: grossAnnual,
    netSalary,
    totalTax,
    socialSecurity: totalDeductions,
    otherDeductions: 0,
    effectiveTaxRate: ((totalTax + totalDeductions) / grossAnnual) * 100,
    breakdown
  };
}

export function calculateAustraliaNetToGross(netAnnual: number, options: AUCalculatorOptions = {}): SalaryCalculation {
  let grossEstimate = netAnnual * 1.35;
  let iterations = 0;
  const maxIterations = 20;

  while (iterations < maxIterations) {
    const result = calculateAustraliaGrossToNet(grossEstimate, options);
    const diff = result.netSalary - netAnnual;

    if (Math.abs(diff) < 1) {
      return result;
    }

    grossEstimate -= diff;
    iterations++;
  }

  return calculateAustraliaGrossToNet(grossEstimate, options);
}
