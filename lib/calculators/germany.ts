// Germany Tax Calculator (2026)
// Based on official German Lohnsteuer (income tax) and social security rates
import { SalaryCalculation, TaxBreakdown } from '../types';

export interface DECalculatorOptions {
  churchTax?: boolean; // Whether to apply church tax
  churchTaxRegion?: 'bavaria' | 'baden-wurttemberg' | 'other'; // Region determines rate (8% or 9%)
}

// Income tax formula (2026) - progressive formula
// Germany uses a complex polynomial formula rather than simple brackets
function calculateGermanIncomeTax(taxableIncome: number): number {
  // Basic allowance (Grundfreibetrag) - no tax below this
  if (taxableIncome <= 10908) return 0;

  // Progressive zone 1: €10,909 - €15,999 (14% → rising)
  if (taxableIncome <= 15999) {
    const y = (taxableIncome - 10908) / 10000;
    return (979.18 * y + 1400) * y;
  }

  // Progressive zone 2: €16,000 - €62,809 (rising → 42%)
  if (taxableIncome <= 62809) {
    const z = (taxableIncome - 15999) / 10000;
    return (192.59 * z + 2397) * z + 966.53;
  }

  // Linear zone: €62,810 - €277,825 (42%)
  if (taxableIncome <= 277825) {
    return 0.42 * taxableIncome - 9972.98;
  }

  // Top rate zone: €277,826+ (45%)
  return 0.45 * taxableIncome - 18307.73;
}

// Solidarity surcharge: 5.5% of income tax (with exemption threshold)
const SOLIDARITY_SURCHARGE_RATE = 0.055;
const SOLIDARITY_THRESHOLD_SINGLE = 17543; // Tax amount threshold for singles

// Church tax rates by region
const CHURCH_TAX_RATE_BAVARIA = 0.08; // 8%
const CHURCH_TAX_RATE_BADEN_WURTTEMBERG = 0.08; // 8%
const CHURCH_TAX_RATE_OTHER = 0.09; // 9% (most states)

// Social security contributions (employee share, 2026)
const PENSION_INSURANCE_RATE = 0.093; // ~9.3% employee share (18.6% total)
const HEALTH_INSURANCE_RATE = 0.0765; // ~7.65% employee share (includes half of additional)
const UNEMPLOYMENT_INSURANCE_RATE = 0.012; // ~1.2% employee share (2.4% total)
const LONG_TERM_CARE_RATE = 0.01525; // ~1.525% employee share (3.05% total)

const SOCIAL_SECURITY_MAX = 90600; // Annual contribution ceiling 2026

function calculateSocialSecurity(grossAnnual: number): {
  pension: number;
  health: number;
  unemployment: number;
  care: number;
} {
  // Social security contributions are capped at the assessment ceiling
  const assessmentBase = Math.min(grossAnnual, SOCIAL_SECURITY_MAX);

  return {
    pension: assessmentBase * PENSION_INSURANCE_RATE,
    health: assessmentBase * HEALTH_INSURANCE_RATE,
    unemployment: assessmentBase * UNEMPLOYMENT_INSURANCE_RATE,
    care: assessmentBase * LONG_TERM_CARE_RATE
  };
}

export function calculateGermanyGrossToNet(grossAnnual: number, options: DECalculatorOptions = {}): SalaryCalculation {
  const churchTaxEnabled = options.churchTax || false;
  const churchTaxRegion = options.churchTaxRegion || 'other';

  // Calculate social security contributions
  const socialSecurity = calculateSocialSecurity(grossAnnual);
  const totalSocialSecurity =
    socialSecurity.pension +
    socialSecurity.health +
    socialSecurity.unemployment +
    socialSecurity.care;

  // In Germany, income tax is calculated on gross income (not reduced by social security)
  const taxableIncome = grossAnnual;

  // Calculate income tax using German progressive formula
  const incomeTax = calculateGermanIncomeTax(taxableIncome);

  // Solidarity surcharge (only if tax exceeds threshold)
  let solidaritySurcharge = 0;
  if (incomeTax > SOLIDARITY_THRESHOLD_SINGLE) {
    solidaritySurcharge = (incomeTax - SOLIDARITY_THRESHOLD_SINGLE) * SOLIDARITY_SURCHARGE_RATE;
  }

  // Church tax (optional, based on income tax)
  let churchTax = 0;
  if (churchTaxEnabled && incomeTax > 0) {
    if (churchTaxRegion === 'bavaria' || churchTaxRegion === 'baden-wurttemberg') {
      churchTax = incomeTax * CHURCH_TAX_RATE_BAVARIA;
    } else {
      churchTax = incomeTax * CHURCH_TAX_RATE_OTHER;
    }
  }

  const totalTax = incomeTax + solidaritySurcharge + churchTax;
  const netSalary = grossAnnual - totalTax - totalSocialSecurity;

  const breakdown: TaxBreakdown[] = [
    { label: 'Income Tax', amount: incomeTax, rate: (incomeTax / grossAnnual) * 100, color: '#ef4444' }
  ];

  if (solidaritySurcharge > 0) {
    breakdown.push({ label: 'Solidarity Surcharge', amount: solidaritySurcharge, rate: (solidaritySurcharge / grossAnnual) * 100, color: '#f97316' });
  }

  if (churchTax > 0) {
    breakdown.push({ label: 'Church Tax', amount: churchTax, rate: (churchTax / grossAnnual) * 100, color: '#a855f7' });
  }

  breakdown.push(
    { label: 'Pension Insurance', amount: socialSecurity.pension, rate: (socialSecurity.pension / grossAnnual) * 100, color: '#3b82f6' },
    { label: 'Health Insurance', amount: socialSecurity.health, rate: (socialSecurity.health / grossAnnual) * 100, color: '#8b5cf6' },
    { label: 'Unemployment Insurance', amount: socialSecurity.unemployment, rate: (socialSecurity.unemployment / grossAnnual) * 100, color: '#06b6d4' },
    { label: 'Long-term Care', amount: socialSecurity.care, rate: (socialSecurity.care / grossAnnual) * 100, color: '#ec4899' },
    { label: 'Net Salary', amount: netSalary, rate: (netSalary / grossAnnual) * 100, color: '#10b981' }
  );

  return {
    grossSalary: grossAnnual,
    netSalary,
    totalTax,
    socialSecurity: totalSocialSecurity,
    otherDeductions: 0,
    effectiveTaxRate: ((totalTax + totalSocialSecurity) / grossAnnual) * 100,
    breakdown
  };
}

export function calculateGermanyNetToGross(netAnnual: number, options: DECalculatorOptions = {}): SalaryCalculation {
  let grossEstimate = netAnnual * 1.6;
  let iterations = 0;
  const maxIterations = 20;

  while (iterations < maxIterations) {
    const result = calculateGermanyGrossToNet(grossEstimate, options);
    const diff = result.netSalary - netAnnual;

    if (Math.abs(diff) < 1) {
      return result;
    }

    grossEstimate -= diff;
    iterations++;
  }

  return calculateGermanyGrossToNet(grossEstimate, options);
}
