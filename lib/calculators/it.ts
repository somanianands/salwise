// Italy Tax Calculator (2026)
// Based on ITALY_MASTER_SPEC_2026.md
import { SalaryCalculation, TaxBreakdown } from '../types';
import { ITRegion, IT_REGIONS } from '../extended-types';

export type ItalyFilingStatus = 'single' | 'married' | 'married_with_children' | 'head_of_household';
export type ItalyEmploymentType = 'employee' | 'self_employed';

export interface ITCalculatorOptions {
  region?: ITRegion;
  filingStatus?: ItalyFilingStatus;
  employmentType?: ItalyEmploymentType;
  pensionContribution?: number;
  healthInsurance?: number;
  otherDeductions?: number;
  numberOfDependents?: number;
  municipalityRate?: number; // Override default 0.8%
  sector?: 'general' | 'public' | 'industrial'; // For employee INPS rate
}

// Italian Income Tax brackets 2026 (IRPEF - Imposta sul Reddito delle Persone Fisiche)
// SIMPLIFIED 3-BRACKET SYSTEM (2026)
const IRPEF_BRACKETS = [
  { min: 0, max: 28000, rate: 0.23 },      // 23%
  { min: 28000, max: 50000, rate: 0.35 },  // 35%
  { min: 50000, max: Infinity, rate: 0.43 } // 43%
];

// Regional Tax Rates (Addizionale Regionale) 2026
const REGIONAL_TAX_RATES: Record<string, number> = {
  abruzzo: 0.0173,
  aosta: 0.0123,
  apulia: 0.0233,
  basilicata: 0.0123,
  calabria: 0.0214,
  campania: 0.0233,
  emilia_romagna: 0.0233,
  friuli: 0.0123,
  lazio: 0.0233,
  liguria: 0.0233,
  lombardy: 0.0233, // Keep 'lombardy' for backward compatibility
  lombardia: 0.0233,
  marche: 0.0233,
  molise: 0.0173,
  piemonte: 0.0223,
  sardegna: 0.0123,
  sicily: 0.0233, // Keep 'sicily' for backward compatibility
  sicilia: 0.0233,
  toscana: 0.0233,
  trentino: 0.0123,
  umbria: 0.0223,
  veneto: 0.0233
};

// Municipal Tax (Addizionale Comunale) Default
const MUNICIPAL_TAX_DEFAULT = 0.008; // 0.8%

// Social Security (INPS) Rates 2026
const INPS_EMPLOYEE_RATE_GENERAL = 0.0919; // 9.19% (general/commercial)
const INPS_EMPLOYEE_RATE_PUBLIC = 0.0889; // 8.89% (public sector)
const INPS_EMPLOYEE_RATE_INDUSTRIAL = 0.0949; // 9.49% (industrial sector)
const INPS_SELF_EMPLOYED_RATE = 0.2597; // 25.97% (Gestione Separata)
const INPS_SELF_EMPLOYED_CAP = 113520; // €113,520 cap for self-employed

function calculateProgressiveTax(income: number, brackets: typeof IRPEF_BRACKETS): number {
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

function calculateEmploymentTaxCredit(taxableIncome: number): number {
  // Employment tax credit (Lavoro Dipendente) - 2026 simplified formula
  // Up to €1,880 for income ≤ €15,000
  // Decreasing from €15,001 to €28,000
  // Zero above €28,000
  if (taxableIncome <= 15000) {
    return 1880;
  } else if (taxableIncome <= 28000) {
    return 1880 * ((28000 - taxableIncome) / 13000);
  }
  return 0; // No credit above €28,000
}

function calculateDependentDeductions(
  filingStatus: ItalyFilingStatus,
  numberOfDependents: number,
  taxableIncome: number
): number {
  let deductions = 0;

  // Spouse deduction (income-dependent, max €800)
  if (filingStatus === 'married' || filingStatus === 'married_with_children') {
    if (taxableIncome <= 40000) {
      deductions += 800;
    } else if (taxableIncome <= 80000) {
      deductions += 800 * ((80000 - taxableIncome) / 40000);
    }
  }

  // Child deductions
  if (numberOfDependents > 0) {
    const childDeduction = numberOfDependents <= 3 ? 950 : 1220;
    deductions += childDeduction * numberOfDependents;
  }

  return deductions;
}

function calculateINPS(
  grossAnnual: number,
  employmentType: ItalyEmploymentType,
  sector: string
): number {
  if (employmentType === 'self_employed') {
    // Self-employed: 25.97% capped at €113,520
    const contributionBase = Math.min(grossAnnual, INPS_SELF_EMPLOYED_CAP);
    return contributionBase * INPS_SELF_EMPLOYED_RATE;
  } else {
    // Employee: sector-specific rates, no cap
    let rate: number;
    switch (sector) {
      case 'public':
        rate = INPS_EMPLOYEE_RATE_PUBLIC;
        break;
      case 'industrial':
        rate = INPS_EMPLOYEE_RATE_INDUSTRIAL;
        break;
      default:
        rate = INPS_EMPLOYEE_RATE_GENERAL;
    }
    return grossAnnual * rate;
  }
}

export function calculateITGrossToNet(
  grossAnnual: number,
  options: ITCalculatorOptions = {}
): SalaryCalculation {
  // Extract options with defaults
  const region = options.region || 'lombardy';
  const filingStatus = options.filingStatus || 'single';
  const employmentType = options.employmentType || 'employee';
  const pensionContribution = options.pensionContribution || 0;
  const healthInsurance = options.healthInsurance || 0;
  const otherDeductions = options.otherDeductions || 0;
  const numberOfDependents = options.numberOfDependents || 0;
  const municipalityRate = options.municipalityRate !== undefined
    ? options.municipalityRate
    : MUNICIPAL_TAX_DEFAULT;
  const sector = options.sector || 'general';

  // Step 1: Calculate INPS (FIRST - on gross salary)
  const inps = calculateINPS(grossAnnual, employmentType, sector);

  // Step 2: Calculate taxable income (BASE IMPONIBILE)
  // = gross - INPS - other deductible contributions
  const totalPreTaxDeductions = pensionContribution + healthInsurance + otherDeductions;
  const validDeductions = Math.min(totalPreTaxDeductions, grossAnnual * 0.5);
  const taxableIncome = grossAnnual - inps - validDeductions;

  // Step 3: Calculate IRPEF (progressive tax on taxable income)
  const irpef = calculateProgressiveTax(taxableIncome, IRPEF_BRACKETS);

  // Step 4: Calculate regional surtax (Addizionale Regionale)
  const regionalRate = REGIONAL_TAX_RATES[region] || 0.02; // Default 2%
  const regionalTax = taxableIncome * regionalRate;

  // Step 5: Calculate municipal surtax (Addizionale Comunale)
  const municipalTax = taxableIncome * municipalityRate;

  // Step 6: Calculate employment tax credit (Lavoro Dipendente)
  const employmentTaxCredit = calculateEmploymentTaxCredit(taxableIncome);

  // Step 7: Calculate dependent deductions (optional - spouse + children credits)
  const dependentDeductions = calculateDependentDeductions(
    filingStatus,
    numberOfDependents,
    taxableIncome
  );

  // Step 8: Apply tax credits to reduce total tax
  const totalTaxBeforeCredits = irpef + regionalTax + municipalTax;
  const totalCredits = employmentTaxCredit + dependentDeductions;
  const totalTax = Math.max(0, totalTaxBeforeCredits - totalCredits);

  // Step 9: Calculate net salary
  const netSalary = grossAnnual - totalTax - inps;
  const effectiveTaxRate = ((totalTax + inps) / grossAnnual) * 100;

  // Build breakdown
  const breakdown: TaxBreakdown[] = [
    {
      label: 'Income Tax (IRPEF)',
      amount: irpef,
      rate: (irpef / grossAnnual) * 100,
      color: '#ef4444'
    },
    {
      label: 'Regional Tax',
      amount: regionalTax,
      rate: (regionalTax / grossAnnual) * 100,
      color: '#f97316'
    },
    {
      label: 'Municipal Tax',
      amount: municipalTax,
      rate: (municipalTax / grossAnnual) * 100,
      color: '#f59e0b'
    },
    {
      label: `Social Security (INPS)${employmentType === 'self_employed' ? ' - Self-Employed' : ''}`,
      amount: inps,
      rate: (inps / grossAnnual) * 100,
      color: '#3b82f6'
    }
  ];

  // Add pre-tax deductions to breakdown if present
  if (validDeductions > 0) {
    breakdown.push({
      label: 'Pre-Tax Deductions',
      amount: validDeductions,
      rate: (validDeductions / grossAnnual) * 100,
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
    socialSecurity: inps,
    otherDeductions: validDeductions,
    effectiveTaxRate,
    breakdown
  };
}

export function calculateITNetToGross(
  netAnnual: number,
  options: ITCalculatorOptions = {}
): SalaryCalculation {
  // Initial estimate (45% typical tax burden in Italy)
  let grossEstimate = netAnnual * 1.45;
  let iterations = 0;
  const maxIterations = 20;

  while (iterations < maxIterations) {
    const result = calculateITGrossToNet(grossEstimate, options);
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
  return calculateITGrossToNet(grossEstimate, options);
}
