// Canada Tax Calculator (2026) - Federal + Provincial
// Based on CRA 2026 rates and indexing
import { SalaryCalculation, TaxBreakdown } from '../types';

// Federal tax brackets 2026 (updated with 14% lowest rate)
const FEDERAL_BRACKETS = [
  { min: 0, max: 58523, rate: 0.14 }, // Reduced from 15% to 14% in 2026
  { min: 58523, max: 117045, rate: 0.205 },
  { min: 117045, max: 181440, rate: 0.26 },
  { min: 181440, max: 258482, rate: 0.29 },
  { min: 258482, max: Infinity, rate: 0.33 }
];

// Basic Personal Amount (Federal) 2026
const BASIC_PERSONAL_AMOUNT = 16452;

// Ontario provincial tax brackets 2026 (updated)
const ONTARIO_BRACKETS = [
  { min: 0, max: 53891, rate: 0.0505 },
  { min: 53891, max: 107785, rate: 0.0915 },
  { min: 107785, max: 150000, rate: 0.1116 },
  { min: 150000, max: 220000, rate: 0.1216 },
  { min: 220000, max: Infinity, rate: 0.1316 }
];

// Ontario Basic Personal Amount 2026
const ONTARIO_BASIC_PERSONAL_AMOUNT = 12399;

// CPP (Canada Pension Plan) 2026
const CPP_RATE = 0.0595;
const CPP_EXEMPTION = 3500;
const CPP_MAX_EARNINGS = 74600; // Updated from 71,300

// EI (Employment Insurance) 2026
const EI_RATE = 0.0163; // Updated from 0.0164 to 1.63%
const EI_MAX_EARNINGS = 68900; // Updated from 65,000

function calculateProgressiveTax(income: number, brackets: typeof FEDERAL_BRACKETS): number {
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

export function calculateCanadaGrossToNet(grossAnnual: number): SalaryCalculation {
  // Calculate federal tax before credits
  const federalTaxBeforeCredits = calculateProgressiveTax(grossAnnual, FEDERAL_BRACKETS);

  // Apply federal Basic Personal Amount credit (at lowest rate 14%)
  const federalBPACredit = BASIC_PERSONAL_AMOUNT * 0.14;
  const federalTax = Math.max(0, federalTaxBeforeCredits - federalBPACredit);

  // Calculate provincial tax before credits
  const provincialTaxBeforeCredits = calculateProgressiveTax(grossAnnual, ONTARIO_BRACKETS);

  // Apply Ontario Basic Personal Amount credit (at lowest rate 5.05%)
  const ontarioBPACredit = ONTARIO_BASIC_PERSONAL_AMOUNT * 0.0505;
  const provincialTax = Math.max(0, provincialTaxBeforeCredits - ontarioBPACredit);

  // CPP contribution
  const cppBase = Math.min(Math.max(grossAnnual - CPP_EXEMPTION, 0), CPP_MAX_EARNINGS - CPP_EXEMPTION);
  const cpp = cppBase * CPP_RATE;

  // EI contribution
  const eiBase = Math.min(grossAnnual, EI_MAX_EARNINGS);
  const ei = eiBase * EI_RATE;

  const totalTax = federalTax + provincialTax;
  const totalDeductions = cpp + ei;
  const netSalary = grossAnnual - totalTax - totalDeductions;

  const breakdown: TaxBreakdown[] = [
    { label: 'Federal Tax', amount: federalTax, rate: (federalTax / grossAnnual) * 100, color: '#ef4444' },
    { label: 'Provincial Tax (ON)', amount: provincialTax, rate: (provincialTax / grossAnnual) * 100, color: '#f97316' },
    { label: 'CPP', amount: cpp, rate: (cpp / grossAnnual) * 100, color: '#3b82f6' },
    { label: 'EI', amount: ei, rate: (ei / grossAnnual) * 100, color: '#8b5cf6' },
    { label: 'Net Salary', amount: netSalary, rate: (netSalary / grossAnnual) * 100, color: '#10b981' }
  ];

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

export function calculateCanadaNetToGross(netAnnual: number): SalaryCalculation {
  let grossEstimate = netAnnual * 1.4;
  let iterations = 0;
  const maxIterations = 20;

  while (iterations < maxIterations) {
    const result = calculateCanadaGrossToNet(grossEstimate);
    const diff = result.netSalary - netAnnual;

    if (Math.abs(diff) < 1) {
      return result;
    }

    grossEstimate -= diff;
    iterations++;
  }

  return calculateCanadaGrossToNet(grossEstimate);
}
