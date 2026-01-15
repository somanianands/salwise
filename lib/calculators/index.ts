// Main calculator entry point
import { Country, SalaryCalculation } from '../types';
import { calculateUSGrossToNet, calculateUSNetToGross, USCalculatorOptions } from './us';
import { calculateUKGrossToNet, calculateUKNetToGross } from './uk';
import { calculateIEGrossToNet, calculateIENetToGross } from './ie';
import { calculateCanadaGrossToNet, calculateCanadaNetToGross } from './canada';
import { calculateAustraliaGrossToNet, calculateAustraliaNetToGross } from './australia';
import { calculateGermanyGrossToNet, calculateGermanyNetToGross } from './germany';
import { calculateFranceGrossToNet, calculateFranceNetToGross } from './france';
import { calculateNLGrossToNet, calculateNLNetToGross } from './nl';
import { calculateESGrossToNet, calculateESNetToGross } from './es';
import { calculateITGrossToNet, calculateITNetToGross } from './it';
import { calculatePTGrossToNet, calculatePTNetToGross } from './pt';
import { calculateCHGrossToNet, calculateCHNetToGross } from './ch';
import { calculateJPGrossToNet, calculateJPNetToGross } from './jp';

// Re-export all country-specific calculators
export * from './us';
export * from './uk';
export * from './ie';
export * from './canada';
export * from './australia';
export * from './germany';
export * from './france';
export * from './nl';
export * from './es';
export * from './it';
export * from './pt';
export * from './ch';
export * from './jp';

export interface CalculatorOptions {
  // US specific
  usState?: USCalculatorOptions['state'];
  filingStatus?: USCalculatorOptions['filingStatus'];
  employmentType?: USCalculatorOptions['employmentType'];
  retirement401k?: number;
  traditionalIRA?: number;
  hsa?: number;
  dependents?: number;
  healthInsurance?: number;
  otherPreTaxDeductions?: number;
  additionalWithholding?: number;
  customStateTaxRate?: number;

  // Canada specific
  canadianProvince?: string;

  // UK specific
  ukRegion?: import('../extended-types').UKRegion;
  ukMarriageAllowance?: boolean;
  ukPensionContribution?: number;
  ukStudentLoan?: import('./uk').UKStudentLoanPlan;

  // Ireland specific
  ieMaritalStatus?: import('../extended-types').IEMaritalStatus;
  iePensionContribution?: number;

  // Australia specific
  auMedicareLevyExemption?: boolean;
  auHELPDebt?: boolean;

  // France specific
  frMaritalStatus?: import('../extended-types').FRMaritalStatus;
  frChildren?: number;

  // Netherlands specific
  nlGeneralTaxCredit?: boolean;
  nlLaborTaxCredit?: boolean;

  // Spain specific
  esRegion?: import('../extended-types').ESRegion;

  // Italy specific
  itRegion?: import('../extended-types').ITRegion;

  // Portugal specific
  ptEmploymentType?: 'employee' | 'self-employed';

  // Switzerland specific
  chCanton?: 'zurich' | 'geneva' | 'zug' | 'bern' | 'basel' | 'vaud' | 'aargau' | 'lucerne' | 'ticino' | 'st_gallen';

  // Japan specific
  jpDependents?: number;

  // Singapore/Germany specific
  age?: number;
}

export function calculateGrossToNet(
  country: Country,
  grossAnnual: number,
  options: CalculatorOptions = {}
): SalaryCalculation {
  switch (country) {
    case 'US':
      return calculateUSGrossToNet(grossAnnual, {
        state: options.usState,
        filingStatus: options.filingStatus,
        employmentType: options.employmentType,
        retirement401k: options.retirement401k,
        traditionalIRA: options.traditionalIRA,
        hsa: options.hsa,
        dependents: options.dependents,
        healthInsurance: options.healthInsurance,
        otherPreTaxDeductions: options.otherPreTaxDeductions,
        additionalWithholding: options.additionalWithholding,
        customStateTaxRate: options.customStateTaxRate
      });
    case 'UK':
      return calculateUKGrossToNet(grossAnnual, {
        region: options.ukRegion,
        marriageAllowance: options.ukMarriageAllowance,
        pensionContribution: options.ukPensionContribution,
        studentLoanPlan: options.ukStudentLoan
      });
    case 'IE':
      return calculateIEGrossToNet(grossAnnual, {
        maritalStatus: options.ieMaritalStatus,
        employmentType: options.employmentType,
        pensionContribution: options.iePensionContribution,
        healthInsurance: options.healthInsurance,
        otherPreTaxBenefits: options.otherPreTaxDeductions,
        dependents: options.dependents,
        additionalWithholding: options.additionalWithholding
      });
    case 'CA':
      return calculateCanadaGrossToNet(grossAnnual);
    case 'AU':
      return calculateAustraliaGrossToNet(grossAnnual, {
        medicareLevyExemption: options.auMedicareLevyExemption,
        helpDebt: options.auHELPDebt
      });
    case 'DE':
      return calculateGermanyGrossToNet(grossAnnual);
    case 'FR':
      return calculateFranceGrossToNet(grossAnnual, {
        maritalStatus: options.frMaritalStatus,
        children: options.frChildren
      });
    case 'NL':
      return calculateNLGrossToNet(grossAnnual, {
        generalTaxCredit: options.nlGeneralTaxCredit,
        employedTaxCredit: options.nlLaborTaxCredit
      });
    case 'ES':
      return calculateESGrossToNet(grossAnnual, {
        region: options.esRegion
      });
    case 'IT':
      return calculateITGrossToNet(grossAnnual, {
        region: options.itRegion
      });
    case 'PT':
      return calculatePTGrossToNet(grossAnnual, {
        employmentType: options.ptEmploymentType
      });
    case 'CH':
      return calculateCHGrossToNet(grossAnnual, {
        canton: options.chCanton
      });
    case 'JP':
      return calculateJPGrossToNet(grossAnnual, {
        dependents: options.jpDependents
      });
    default:
      throw new Error(`Unsupported country: ${country}`);
  }
}

export function calculateNetToGross(
  country: Country,
  netAnnual: number,
  options: CalculatorOptions = {}
): SalaryCalculation {
  switch (country) {
    case 'US':
      return calculateUSNetToGross(netAnnual, {
        state: options.usState,
        filingStatus: options.filingStatus,
        employmentType: options.employmentType,
        retirement401k: options.retirement401k,
        traditionalIRA: options.traditionalIRA,
        hsa: options.hsa,
        dependents: options.dependents,
        healthInsurance: options.healthInsurance,
        otherPreTaxDeductions: options.otherPreTaxDeductions,
        additionalWithholding: options.additionalWithholding,
        customStateTaxRate: options.customStateTaxRate
      });
    case 'UK':
      return calculateUKNetToGross(netAnnual, {
        region: options.ukRegion,
        marriageAllowance: options.ukMarriageAllowance,
        pensionContribution: options.ukPensionContribution,
        studentLoanPlan: options.ukStudentLoan
      });
    case 'IE':
      return calculateIENetToGross(netAnnual, {
        maritalStatus: options.ieMaritalStatus,
        employmentType: options.employmentType,
        pensionContribution: options.iePensionContribution,
        healthInsurance: options.healthInsurance,
        otherPreTaxBenefits: options.otherPreTaxDeductions,
        dependents: options.dependents,
        additionalWithholding: options.additionalWithholding
      });
    case 'CA':
      return calculateCanadaNetToGross(netAnnual);
    case 'AU':
      return calculateAustraliaNetToGross(netAnnual, {
        medicareLevyExemption: options.auMedicareLevyExemption,
        helpDebt: options.auHELPDebt
      });
    case 'DE':
      return calculateGermanyNetToGross(netAnnual);
    case 'FR':
      return calculateFranceNetToGross(netAnnual, {
        maritalStatus: options.frMaritalStatus,
        children: options.frChildren
      });
    case 'NL':
      return calculateNLNetToGross(netAnnual, {
        generalTaxCredit: options.nlGeneralTaxCredit,
        employedTaxCredit: options.nlLaborTaxCredit
      });
    case 'ES':
      return calculateESNetToGross(netAnnual, {
        region: options.esRegion
      });
    case 'IT':
      return calculateITNetToGross(netAnnual, {
        region: options.itRegion
      });
    case 'PT':
      return calculatePTNetToGross(netAnnual, {
        employmentType: options.ptEmploymentType
      });
    case 'CH':
      return calculateCHNetToGross(netAnnual, {
        canton: options.chCanton
      });
    case 'JP':
      return calculateJPNetToGross(netAnnual, {
        dependents: options.jpDependents
      });
    default:
      throw new Error(`Unsupported country: ${country}`);
  }
}

export interface FrequencyConversion {
  annual: number;
  monthly: number;
  weekly: number;
  daily: number;
  hourly: number;
}

export function convertFrequency(
  amount: number,
  fromFrequency: 'annual' | 'monthly' | 'weekly' | 'daily' | 'hourly',
  hoursPerWeek: number = 40
): FrequencyConversion {
  const hoursPerYear = hoursPerWeek * 52;
  const daysPerYear = 260; // ~52 weeks * 5 days
  const weeksPerYear = 52;
  const monthsPerYear = 12;

  // Convert to annual first
  let annual: number;
  switch (fromFrequency) {
    case 'annual':
      annual = amount;
      break;
    case 'monthly':
      annual = amount * monthsPerYear;
      break;
    case 'weekly':
      annual = amount * weeksPerYear;
      break;
    case 'daily':
      annual = amount * daysPerYear;
      break;
    case 'hourly':
      annual = amount * hoursPerYear;
      break;
  }

  return {
    annual,
    monthly: annual / monthsPerYear,
    weekly: annual / weeksPerYear,
    daily: annual / daysPerYear,
    hourly: annual / hoursPerYear
  };
}

// Time-based calculator exports (hourly, daily, weekly, monthly, bi-weekly, quarterly, semi-annual)
export * from './es-time-based';
export * from './it-time-based';
export * from './us-time-based';
export * from './uk-time-based';
export * from './ie-time-based';
export * from './canada-time-based';
export * from './australia-time-based';
export * from './germany-time-based';
export * from './france-time-based';
export * from './nl-time-based';
export * from './pt-time-based';
export * from './ch-time-based';
export * from './jp-time-based';
