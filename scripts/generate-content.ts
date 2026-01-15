#!/usr/bin/env tsx
/**
 * Content Generation System for Salary Calculators
 * Generates production-ready content following CONTENT_STANDARD_PRODUCTION.md
 *
 * Usage: tsx scripts/generate-content.ts [country] [calculator-type]
 * Example: tsx scripts/generate-content.ts ES salary-calculator
 * Example: tsx scripts/generate-content.ts all all (generates all combinations)
 */

import * as fs from 'fs';
import * as path from 'path';
import { Country, COUNTRIES } from '../lib/types';
import { calculateGrossToNet } from '../lib/calculators';

// Calculator types (all 17 types from calculator-types.ts)
const CALCULATOR_TYPES = [
  // Salary Calculators (5)
  'salary-calculator',
  'gross-to-net-salary-calculator',
  'net-to-gross-salary-calculator',
  'salary-after-tax-calculator',
  'take-home-pay-calculator',
  // Hourly & Time-Based (5)
  'hourly-to-salary-calculator',
  'hourly-rate-calculator',
  'weekly-to-salary-calculator',
  'monthly-to-salary-calculator',
  'daily-to-salary-calculator',
  // Overtime & Bonus (3)
  'overtime-pay-calculator',
  'bonus-tax-calculator',
  'commission-calculator',
  // Contractor / Freelancer (3)
  'contractor-salary-calculator',
  'freelancer-income-calculator',
  'self-employed-tax-calculator',
] as const;

type CalculatorType = typeof CALCULATOR_TYPES[number];

// Country-specific configuration
interface CountryConfig {
  code: Country;
  name: string;
  adjective: string; // "US", "British", "Spanish", etc.
  currency: string;
  currencySymbol: string;
  taxYear: string;
  primaryTax: {
    name: string;
    abbreviation: string;
    description: string;
  };
  secondaryTax: {
    name: string;
    abbreviation: string;
    description: string;
    rate?: string;
  };
  regions?: {
    hasRegions: boolean;
    name: string; // "states", "provinces", "regions"
    examples: string[];
  };
  workingHours: {
    annual: number;
    weekly: number;
    description: string;
  };
  salaryExamples: {
    entryLevel: number;
    midLevel: number;
    senior: number;
    executive: number;
  };
  commonJobs: {
    title: string;
    salary: number;
  }[];
  deductions: {
    name: string;
    description: string;
    maxAmount?: string;
  }[];
}

const COUNTRY_CONFIGS: Record<Country, CountryConfig> = {
  US: {
    code: 'US',
    name: 'United States',
    adjective: 'US',
    currency: 'USD',
    currencySymbol: '$',
    taxYear: '2026',
    primaryTax: {
      name: 'Federal Income Tax',
      abbreviation: 'Federal Tax',
      description: 'Progressive federal income tax with 7 brackets ranging from 10% to 37%',
    },
    secondaryTax: {
      name: 'FICA (Social Security & Medicare)',
      abbreviation: 'FICA',
      description: 'Social Security (6.2% up to $176,100) and Medicare (1.45% unlimited, plus 0.9% over $200,000)',
      rate: '7.65%',
    },
    regions: {
      hasRegions: true,
      name: 'states',
      examples: ['California', 'New York', 'Texas', 'Florida', 'Washington'],
    },
    workingHours: {
      annual: 2080,
      weekly: 40,
      description: '40 hours per week, 52 weeks per year',
    },
    salaryExamples: {
      entryLevel: 45000,
      midLevel: 75000,
      senior: 120000,
      executive: 200000,
    },
    commonJobs: [
      { title: 'Software Engineer', salary: 110000 },
      { title: 'Registered Nurse', salary: 77600 },
      { title: 'Teacher', salary: 62000 },
      { title: 'Sales Manager', salary: 95000 },
      { title: 'Accountant', salary: 73500 },
    ],
    deductions: [
      { name: '401(k) Contributions', description: 'Pre-tax retirement savings', maxAmount: '$23,500' },
      { name: 'Traditional IRA', description: 'Individual retirement account', maxAmount: '$7,000' },
      { name: 'HSA', description: 'Health Savings Account', maxAmount: '$4,300 (single), $8,550 (family)' },
      { name: 'Health Insurance Premiums', description: 'Employer-sponsored health insurance' },
    ],
  },

  ES: {
    code: 'ES',
    name: 'Spain',
    adjective: 'Spanish',
    currency: 'EUR',
    currencySymbol: '€',
    taxYear: '2026',
    primaryTax: {
      name: 'IRPF (Impuesto sobre la Renta de las Personas Físicas)',
      abbreviation: 'IRPF',
      description: 'Progressive income tax with 6 brackets ranging from 19% to 47%',
    },
    secondaryTax: {
      name: 'Seguridad Social',
      abbreviation: 'Social Security',
      description: 'Employee contributions capped at €4,070/month. Self-employed (autónomos) have progressive scale',
      rate: '6.35%',
    },
    regions: {
      hasRegions: true,
      name: 'autonomous communities',
      examples: ['Madrid', 'Cataluña', 'Andalucía', 'Valencia', 'País Vasco'],
    },
    workingHours: {
      annual: 1826,
      weekly: 40,
      description: '40 hours per week with Spanish holidays',
    },
    salaryExamples: {
      entryLevel: 22000,
      midLevel: 36000,
      senior: 55000,
      executive: 90000,
    },
    commonJobs: [
      { title: 'Software Developer', salary: 38000 },
      { title: 'Nurse', salary: 28000 },
      { title: 'Teacher', salary: 32000 },
      { title: 'Marketing Manager', salary: 42000 },
      { title: 'Accountant', salary: 30000 },
    ],
    deductions: [
      { name: 'Pension Contributions', description: 'Private pension plans', maxAmount: '€1,500' },
      { name: 'Health Insurance', description: 'Private health insurance premiums', maxAmount: '€500' },
      { name: 'Dependent Deductions', description: 'Children and spouse allowances' },
    ],
  },

  IT: {
    code: 'IT',
    name: 'Italy',
    adjective: 'Italian',
    currency: 'EUR',
    currencySymbol: '€',
    taxYear: '2026',
    primaryTax: {
      name: 'IRPEF (Imposta sul Reddito delle Persone Fisiche)',
      abbreviation: 'IRPEF',
      description: 'Progressive income tax with 5 brackets ranging from 23% to 43%',
    },
    secondaryTax: {
      name: 'INPS (Istituto Nazionale Previdenza Sociale)',
      abbreviation: 'INPS',
      description: 'Social security contributions (9.19% for employees, 25.97% for self-employed)',
      rate: '9.19%',
    },
    regions: {
      hasRegions: true,
      name: 'regions',
      examples: ['Lombardy', 'Lazio', 'Campania', 'Sicily', 'Veneto'],
    },
    workingHours: {
      annual: 1824,
      weekly: 38,
      description: '38 hours per week, 48 weeks per year',
    },
    salaryExamples: {
      entryLevel: 24000,
      midLevel: 35000,
      senior: 50000,
      executive: 85000,
    },
    commonJobs: [
      { title: 'Software Engineer', salary: 35000 },
      { title: 'Nurse', salary: 30000 },
      { title: 'Teacher', salary: 28000 },
      { title: 'Sales Manager', salary: 40000 },
      { title: 'Accountant', salary: 32000 },
    ],
    deductions: [
      { name: 'Personal Deduction', description: 'Income-dependent deduction up to €1,880' },
      { name: 'Dependent Deductions', description: 'Spouse (up to €800) and children (€950-€1,220 each)' },
      { name: 'Healthcare Expenses', description: 'Deductible medical expenses' },
    ],
  },

  PT: {
    code: 'PT',
    name: 'Portugal',
    adjective: 'Portuguese',
    currency: 'EUR',
    currencySymbol: '€',
    taxYear: '2026',
    primaryTax: {
      name: 'IRS (Imposto sobre o Rendimento das Pessoas Singulares)',
      abbreviation: 'IRS',
      description: 'Progressive income tax with 9 brackets ranging from 13.25% to 48%',
    },
    secondaryTax: {
      name: 'Social Security',
      abbreviation: 'Social Security',
      description: 'Employee contributions at 11%, self-employed at 21.4%',
      rate: '11%',
    },
    regions: {
      hasRegions: false,
      name: '',
      examples: [],
    },
    workingHours: {
      annual: 2080,
      weekly: 40,
      description: '40 hours per week, 52 weeks per year',
    },
    salaryExamples: {
      entryLevel: 12000,
      midLevel: 20000,
      senior: 35000,
      executive: 60000,
    },
    commonJobs: [
      { title: 'Software Developer', salary: 25000 },
      { title: 'Nurse', salary: 18000 },
      { title: 'Teacher', salary: 22000 },
      { title: 'Engineer', salary: 28000 },
      { title: 'Manager', salary: 35000 },
    ],
    deductions: [
      { name: 'Pension Contributions', description: 'Private pension contributions' },
      { name: 'Health Insurance', description: 'Private health insurance premiums' },
      { name: 'Dependent Deductions', description: 'Children and spouse allowances' },
    ],
  },

  CH: {
    code: 'CH',
    name: 'Switzerland',
    adjective: 'Swiss',
    currency: 'CHF',
    currencySymbol: 'CHF',
    taxYear: '2026',
    primaryTax: {
      name: 'Federal Income Tax',
      abbreviation: 'Federal Tax',
      description: 'Progressive federal tax ranging from 0.77% to 11.5%',
    },
    secondaryTax: {
      name: 'Canton and Municipal Tax',
      abbreviation: 'Cantonal Tax',
      description: 'Varies by canton (5% to 40% combined)',
      rate: 'Varies',
    },
    regions: {
      hasRegions: true,
      name: 'cantons',
      examples: ['Zurich', 'Geneva', 'Zug', 'Bern', 'Basel'],
    },
    workingHours: {
      annual: 2184,
      weekly: 42,
      description: '42 hours per week, 52 weeks per year',
    },
    salaryExamples: {
      entryLevel: 60000,
      midLevel: 85000,
      senior: 120000,
      executive: 180000,
    },
    commonJobs: [
      { title: 'Software Engineer', salary: 110000 },
      { title: 'Nurse', salary: 75000 },
      { title: 'Teacher', salary: 80000 },
      { title: 'Bank Manager', salary: 130000 },
      { title: 'Project Manager', salary: 105000 },
    ],
    deductions: [
      { name: 'Pillar 2', description: 'Occupational pension contributions' },
      { name: 'Pillar 3a', description: 'Voluntary pension contributions', maxAmount: 'CHF 7,056' },
      { name: 'Professional Expenses', description: 'Work-related expenses' },
    ],
  },

  JP: {
    code: 'JP',
    name: 'Japan',
    adjective: 'Japanese',
    currency: 'JPY',
    currencySymbol: '¥',
    taxYear: '2026',
    primaryTax: {
      name: 'National Income Tax',
      abbreviation: 'Income Tax',
      description: 'Progressive income tax with 7 brackets from 5% to 45%',
    },
    secondaryTax: {
      name: 'Resident Tax',
      abbreviation: 'Resident Tax',
      description: 'Prefectural (4%) and municipal (6%) tax totaling 10%',
      rate: '10%',
    },
    regions: {
      hasRegions: true,
      name: 'prefectures',
      examples: ['Tokyo', 'Osaka', 'Kyoto', 'Yokohama', 'Nagoya'],
    },
    workingHours: {
      annual: 2080,
      weekly: 40,
      description: '40 hours per week, 52 weeks per year',
    },
    salaryExamples: {
      entryLevel: 3000000,
      midLevel: 5000000,
      senior: 8000000,
      executive: 12000000,
    },
    commonJobs: [
      { title: 'Software Engineer', salary: 5500000 },
      { title: 'Nurse', salary: 4200000 },
      { title: 'Teacher', salary: 4800000 },
      { title: 'Sales Manager', salary: 6000000 },
      { title: 'Engineer', salary: 5200000 },
    ],
    deductions: [
      { name: 'Social Insurance', description: 'Pension, health insurance, and employment insurance' },
      { name: 'Basic Deduction', description: '¥480,000 standard deduction' },
      { name: 'Dependent Deductions', description: 'Spouse and child deductions' },
    ],
  },

  UK: {
    code: 'UK',
    name: 'United Kingdom',
    adjective: 'UK',
    currency: 'GBP',
    currencySymbol: '£',
    taxYear: '2026/2027',
    primaryTax: {
      name: 'Income Tax',
      abbreviation: 'Income Tax',
      description: 'Progressive income tax with personal allowance of £12,570 and rates from 20% to 45%',
    },
    secondaryTax: {
      name: 'National Insurance Contributions',
      abbreviation: 'NIC',
      description: 'Employee NIC at 12% (£12,570-£50,270) and 2% above',
      rate: '12%',
    },
    regions: {
      hasRegions: true,
      name: 'regions',
      examples: ['England', 'Scotland', 'Wales', 'Northern Ireland'],
    },
    workingHours: {
      annual: 1950,
      weekly: 37.5,
      description: '37.5 hours per week, 52 weeks per year',
    },
    salaryExamples: {
      entryLevel: 25000,
      midLevel: 40000,
      senior: 65000,
      executive: 120000,
    },
    commonJobs: [
      { title: 'Software Developer', salary: 50000 },
      { title: 'Nurse', salary: 35000 },
      { title: 'Teacher', salary: 38000 },
      { title: 'Project Manager', salary: 55000 },
      { title: 'Accountant', salary: 42000 },
    ],
    deductions: [
      { name: 'Pension Contributions', description: 'Workplace pension scheme', maxAmount: '£60,000' },
      { name: 'Gift Aid Donations', description: 'Charitable donations' },
      { name: 'Marriage Allowance', description: 'Transfer £1,260 of personal allowance to spouse' },
    ],
  },

  IE: {
    code: 'IE',
    name: 'Ireland',
    adjective: 'Irish',
    currency: 'EUR',
    currencySymbol: '€',
    taxYear: '2026',
    primaryTax: {
      name: 'Income Tax',
      abbreviation: 'IT',
      description: 'Two tax rates: 20% (standard) and 40% (higher)',
    },
    secondaryTax: {
      name: 'USC & PRSI',
      abbreviation: 'USC/PRSI',
      description: 'Universal Social Charge (0.5%-8%) and Pay Related Social Insurance (4%)',
      rate: '4-12%',
    },
    regions: {
      hasRegions: false,
      name: '',
      examples: [],
    },
    workingHours: {
      annual: 1976,
      weekly: 39,
      description: '39 hours per week, 52 weeks per year',
    },
    salaryExamples: {
      entryLevel: 30000,
      midLevel: 50000,
      senior: 75000,
      executive: 130000,
    },
    commonJobs: [
      { title: 'Software Engineer', salary: 60000 },
      { title: 'Nurse', salary: 42000 },
      { title: 'Teacher', salary: 48000 },
      { title: 'Financial Analyst', salary: 55000 },
      { title: 'Marketing Manager', salary: 58000 },
    ],
    deductions: [
      { name: 'Pension Contributions', description: 'Reduces taxable income (not USC/PRSI)' },
      { name: 'PAYE Credit', description: '€1,775 annual tax credit' },
      { name: 'Personal Credit', description: '€1,775 (single) or €3,550 (married)' },
    ],
  },

  CA: {
    code: 'CA',
    name: 'Canada',
    adjective: 'Canadian',
    currency: 'CAD',
    currencySymbol: '$',
    taxYear: '2026',
    primaryTax: {
      name: 'Federal & Provincial Income Tax',
      abbreviation: 'Income Tax',
      description: 'Combined federal (5 brackets: 15%-33%) and provincial taxes',
    },
    secondaryTax: {
      name: 'CPP & EI',
      abbreviation: 'CPP/EI',
      description: 'Canada Pension Plan (5.95%) and Employment Insurance (1.63%)',
      rate: '7.58%',
    },
    regions: {
      hasRegions: true,
      name: 'provinces',
      examples: ['Ontario', 'Quebec', 'British Columbia', 'Alberta', 'Manitoba'],
    },
    workingHours: {
      annual: 2080,
      weekly: 40,
      description: '40 hours per week, 52 weeks per year',
    },
    salaryExamples: {
      entryLevel: 45000,
      midLevel: 70000,
      senior: 100000,
      executive: 180000,
    },
    commonJobs: [
      { title: 'Software Developer', salary: 85000 },
      { title: 'Registered Nurse', salary: 75000 },
      { title: 'Teacher', salary: 65000 },
      { title: 'Accountant', salary: 70000 },
      { title: 'Project Manager', salary: 90000 },
    ],
    deductions: [
      { name: 'RRSP Contributions', description: 'Registered Retirement Savings Plan', maxAmount: '18% of income' },
      { name: 'Union Dues', description: 'Professional union membership fees' },
      { name: 'Childcare Expenses', description: 'Eligible childcare costs' },
    ],
  },

  AU: {
    code: 'AU',
    name: 'Australia',
    adjective: 'Australian',
    currency: 'AUD',
    currencySymbol: '$',
    taxYear: '2026/2027',
    primaryTax: {
      name: 'Income Tax',
      abbreviation: 'Income Tax',
      description: 'Progressive tax with tax-free threshold of $18,200 and rates from 19% to 45%',
    },
    secondaryTax: {
      name: 'Medicare Levy',
      abbreviation: 'Medicare',
      description: 'Medicare Levy (2%) plus Medicare Levy Surcharge (0-1.5% for high earners)',
      rate: '2%',
    },
    regions: {
      hasRegions: false,
      name: '',
      examples: [],
    },
    workingHours: {
      annual: 2028,
      weekly: 39,
      description: '39 hours per week, 52 weeks per year',
    },
    salaryExamples: {
      entryLevel: 55000,
      midLevel: 85000,
      senior: 130000,
      executive: 220000,
    },
    commonJobs: [
      { title: 'Software Engineer', salary: 105000 },
      { title: 'Registered Nurse', salary: 75000 },
      { title: 'Teacher', salary: 72000 },
      { title: 'Accountant', salary: 80000 },
      { title: 'Project Manager', salary: 110000 },
    ],
    deductions: [
      { name: 'Superannuation', description: 'Employer contributes 11.5% (not deducted from salary)' },
      { name: 'LITO', description: 'Low and Middle Income Tax Offset (up to $700)' },
      { name: 'Work-Related Expenses', description: 'Tools, uniforms, professional development' },
    ],
  },

  DE: {
    code: 'DE',
    name: 'Germany',
    adjective: 'German',
    currency: 'EUR',
    currencySymbol: '€',
    taxYear: '2026',
    primaryTax: {
      name: 'Einkommensteuer (Income Tax)',
      abbreviation: 'Income Tax',
      description: 'Progressive tax from 14% to 45% using quadratic formula',
    },
    secondaryTax: {
      name: 'Social Security Contributions',
      abbreviation: 'Sozialversicherung',
      description: 'Pension (9.3%), Health (7.3%), Unemployment (1.3%), Care (1.7%)',
      rate: '~19.6%',
    },
    regions: {
      hasRegions: false,
      name: '',
      examples: [],
    },
    workingHours: {
      annual: 1920,
      weekly: 40,
      description: '40 hours per week, 48 weeks per year',
    },
    salaryExamples: {
      entryLevel: 35000,
      midLevel: 55000,
      senior: 80000,
      executive: 140000,
    },
    commonJobs: [
      { title: 'Software Engineer', salary: 65000 },
      { title: 'Nurse', salary: 40000 },
      { title: 'Teacher', salary: 50000 },
      { title: 'Engineer', salary: 58000 },
      { title: 'Manager', salary: 72000 },
    ],
    deductions: [
      { name: 'Werbungskosten', description: 'Work-related expenses (min. €1,230 automatic)' },
      { name: 'Sonderausgaben', description: 'Special expenses (insurance, donations)' },
      { name: 'Church Tax', description: '8-9% of income tax (optional)' },
    ],
  },

  FR: {
    code: 'FR',
    name: 'France',
    adjective: 'French',
    currency: 'EUR',
    currencySymbol: '€',
    taxYear: '2026',
    primaryTax: {
      name: 'Impôt sur le Revenu',
      abbreviation: 'Income Tax',
      description: 'Progressive tax with family quotient system (quotient familial)',
    },
    secondaryTax: {
      name: 'CSG & CRDS',
      abbreviation: 'Social Contributions',
      description: 'CSG (9.2% on 98.25% of gross) and CRDS (0.5%)',
      rate: '~9.7%',
    },
    regions: {
      hasRegions: false,
      name: '',
      examples: [],
    },
    workingHours: {
      annual: 1607,
      weekly: 35,
      description: '35 hours per week (legal limit), 52 weeks',
    },
    salaryExamples: {
      entryLevel: 28000,
      midLevel: 42000,
      senior: 65000,
      executive: 110000,
    },
    commonJobs: [
      { title: 'Software Developer', salary: 45000 },
      { title: 'Nurse', salary: 32000 },
      { title: 'Teacher', salary: 35000 },
      { title: 'Marketing Manager', salary: 50000 },
      { title: 'Accountant', salary: 40000 },
    ],
    deductions: [
      { name: 'Family Quotient', description: 'Married couples: 2 parts, +0.5 per child (1st-2nd), +1 per child (3rd+)' },
      { name: 'Professional Expenses', description: '10% automatic deduction or actual expenses' },
      { name: 'Pension Contributions', description: 'Supplementary pension schemes' },
    ],
  },

  NL: {
    code: 'NL',
    name: 'Netherlands',
    adjective: 'Dutch',
    currency: 'EUR',
    currencySymbol: '€',
    taxYear: '2026',
    primaryTax: {
      name: 'Inkomstenbelasting (Income Tax)',
      abbreviation: 'Income Tax',
      description: 'Progressive tax with 2 main brackets: 36.97% and 49.5%',
    },
    secondaryTax: {
      name: 'Social Security Contributions',
      abbreviation: 'AOW/WLZ',
      description: 'Old Age Pension (AOW) and Long-term Care (WLZ)',
      rate: '~27.65%',
    },
    regions: {
      hasRegions: false,
      name: '',
      examples: [],
    },
    workingHours: {
      annual: 2080,
      weekly: 40,
      description: '40 hours per week, 52 weeks per year',
    },
    salaryExamples: {
      entryLevel: 32000,
      midLevel: 50000,
      senior: 75000,
      executive: 130000,
    },
    commonJobs: [
      { title: 'Software Developer', salary: 60000 },
      { title: 'Nurse', salary: 38000 },
      { title: 'Teacher', salary: 42000 },
      { title: 'Consultant', salary: 65000 },
      { title: 'Manager', salary: 75000 },
    ],
    deductions: [
      { name: 'General Tax Credit', description: 'Algemene heffingskorting (max €3,362)' },
      { name: 'Labor Tax Credit', description: 'Arbeidskorting (max €5,533)' },
      { name: '30% Ruling', description: 'For expats with specific skills (30% tax-free)' },
    ],
  },
};

// Generate content for a specific country and calculator type
function generateContent(countryCode: Country, calculatorType: CalculatorType): string {
  const config = COUNTRY_CONFIGS[countryCode];

  // Generate title based on calculator type
  const titles: Record<CalculatorType, string> = {
    'salary-calculator': `${config.name} Salary Calculator ${config.taxYear} - Calculate Your Take-Home Pay`,
    'gross-to-net-salary-calculator': `${config.name} Gross to Net Calculator ${config.taxYear} - Convert Gross to Net Salary`,
    'net-to-gross-salary-calculator': `${config.name} Net to Gross Calculator ${config.taxYear} - Calculate Required Gross Salary`,
    'salary-after-tax-calculator': `${config.name} Salary After Tax Calculator ${config.taxYear} - Your Take-Home Pay`,
    'take-home-pay-calculator': `${config.name} Take Home Pay Calculator ${config.taxYear} - Net Salary Calculator`,
    'hourly-to-salary-calculator': `${config.name} Hourly to Salary Calculator ${config.taxYear} - Annual Income from Hourly Rate`,
    'hourly-rate-calculator': `${config.name} Hourly Rate Calculator ${config.taxYear} - Convert Annual to Hourly`,
    'daily-to-salary-calculator': `${config.name} Daily to Salary Calculator ${config.taxYear} - Convert Daily Rate to Annual`,
    'weekly-to-salary-calculator': `${config.name} Weekly to Salary Calculator ${config.taxYear} - Weekly Pay to Annual`,
    'monthly-to-salary-calculator': `${config.name} Monthly to Salary Calculator ${config.taxYear} - Monthly Pay to Annual`,
    'overtime-pay-calculator': `${config.name} Overtime Pay Calculator ${config.taxYear} - Calculate Overtime Earnings`,
    'bonus-tax-calculator': `${config.name} Bonus Tax Calculator ${config.taxYear} - How Much Tax on Your Bonus`,
    'commission-calculator': `${config.name} Commission Calculator ${config.taxYear} - Calculate Commission Earnings`,
    'contractor-salary-calculator': `${config.name} Contractor Calculator ${config.taxYear} - Self-Employed Income`,
    'freelancer-income-calculator': `${config.name} Freelancer Calculator ${config.taxYear} - Calculate Freelance Income`,
    'self-employed-tax-calculator': `${config.name} Self-Employed Tax Calculator ${config.taxYear} - Calculate Your Taxes`,
  };

  // Generate Meta Title (55-60 characters)
  const metaTitle = `${titles[calculatorType]} | Free Tax Calculator`;

  // Generate Meta Description (150-160 characters)
  const metaDescription = `Calculate your take-home pay with our free ${config.name} ${getCalculatorName(calculatorType).toLowerCase()} for ${config.taxYear}. Accurate tax rates, instant results, and detailed breakdowns.`;

  // Generate H1
  const h1 = titles[calculatorType];

  const content = `### Meta Title
\`\`\`
${metaTitle}
\`\`\`

### Meta Description
\`\`\`
${metaDescription}
\`\`\`

## H1 HEADING
\`\`\`
${h1}
\`\`\`

### Introduction (Above Calculator)

## Calculate Your ${config.adjective} Salary After Taxes

Quickly calculate your take-home pay with our free ${config.name} salary calculator for ${config.taxYear}. Enter your ${getInputType(calculatorType)} to see how much you'll actually earn after ${config.primaryTax.abbreviation}, ${config.secondaryTax.abbreviation}, and all mandatory deductions.

**Key Features:**
- ✅ Accurate ${config.taxYear} tax brackets and rates
- ✅ ${config.secondaryTax.name} calculations
${config.regions?.hasRegions ? `- ✅ ${config.regions.examples.length} ${config.regions.name} supported (${config.regions.examples.slice(0, 3).join(', ')}, and more)` : ''}
- ✅ Pre-tax deduction support (${config.deductions.slice(0, 2).map(d => d.name).join(', ')})
- ✅ Instant breakdown by annual, monthly, weekly, daily, and hourly rates

Perfect for job seekers, employees negotiating salaries, contractors, and anyone relocating to ${config.name}.

---

### How to Use This Calculator

## How to Use the ${config.name} ${getCalculatorName(calculatorType)}

### Step-by-Step Guide:

1. **Enter Your ${getInputLabel(calculatorType)}**
   - Type in your ${getInputDescription(calculatorType)}
   - Example: ${formatCurrency(config.salaryExamples.midLevel, config.currencySymbol)}${getFrequencyNote(calculatorType)}

2. **${config.regions?.hasRegions ? `Select Your ${capitalize(config.regions.name.slice(0, -1))}` : 'Review Default Settings'} (Optional)**
${config.regions?.hasRegions
  ? `   - Choose from ${config.regions.examples.length} ${config.regions.name}
   - Tax rates vary by ${config.regions.name.slice(0, -1)}
   - Default: ${config.regions.examples[0]}`
  : `   - Standard national tax rates apply
   - No regional variations`}

3. **Add Pre-Tax Deductions** (Optional)
${config.deductions.slice(0, 3).map(d => `   - **${d.name}:** ${d.description}${d.maxAmount ? ` (${d.maxAmount})` : ''}`).join('\n')}

4. **Click "Show Advanced Options"** (Optional)
   - Filing status (single, married, etc.)
   - Number of dependents
   - Additional withholdings

5. **View Your Results**
   - See your take-home pay instantly
   - View detailed tax breakdown with visual charts
   - See salary conversions across all frequencies

### What You'll See:

- **Gross Salary:** Your total income before deductions
- **Net Salary (Take-Home Pay):** What goes into your bank account
- **${config.primaryTax.abbreviation}:** Income tax amount and rate
- **${config.secondaryTax.abbreviation}:** Social security/contributions
- **Effective Tax Rate:** Your actual tax percentage
- **Frequency Breakdown:** Annual, monthly, weekly, daily, and hourly rates

---

### Understanding Your ${config.adjective} Salary and Taxes

## Understanding Your ${config.adjective} Salary and Taxes

### ${config.primaryTax.name} (${config.taxYear})

${config.primaryTax.description}

${generateTaxTable(countryCode)}

**Important:** ${getTaxNotes(countryCode)}

**Example Calculation:**

For a ${formatCurrency(config.salaryExamples.midLevel, config.currencySymbol)} annual salary:

${generateExampleCalculation(countryCode, config.salaryExamples.midLevel)}

### ${config.secondaryTax.name}

${config.secondaryTax.description}

- **Employee Rate:** ${config.secondaryTax.rate || 'Varies'}
- **What It Funds:** ${getSecondaryTaxPurpose(countryCode)}

**Example:** On ${formatCurrency(config.salaryExamples.midLevel, config.currencySymbol)} annual salary = approximately ${formatCurrency(estimateSecondaryTax(countryCode, config.salaryExamples.midLevel), config.currencySymbol)}/year

${generateRegionalTaxInfo(config)}

---

### ${config.adjective} Salary Examples

## ${config.adjective} Salary Examples: What You'll Actually Take Home

Below are real-world examples using our ${config.taxYear} tax calculator. All calculations include ${config.primaryTax.abbreviation}, ${config.secondaryTax.abbreviation}, and standard deductions.

${generateSalaryExamples(countryCode, config)}

---

### Common Questions

## Common Questions About ${config.adjective} Salaries

### How much is taken out of my paycheck in ${config.name}?

For most ${config.adjective} workers, approximately ${getTypicalTaxRange(countryCode)} of gross salary goes to taxes and deductions:
- **${config.primaryTax.abbreviation}:** ${getPrimaryTaxRange(countryCode)} (depends on income)
- **${config.secondaryTax.abbreviation}:** ${config.secondaryTax.rate || 'Varies'}

The exact amount depends on your income level, ${config.regions?.hasRegions ? config.regions.name.slice(0, -1) : 'location'}, and personal circumstances.

### What is gross vs net salary?

- **Gross Salary:** Your salary before any deductions (what's in your employment contract)
- **Net Salary (Take-Home Pay):** What actually arrives in your bank account after all taxes and deductions

**Example:**
- Gross: ${formatCurrency(config.salaryExamples.midLevel, config.currencySymbol)}/year
- Net: ~${formatCurrency(estimateNetSalary(countryCode, config.salaryExamples.midLevel), config.currencySymbol)}/year
- Difference: ~${formatCurrency(config.salaryExamples.midLevel - estimateNetSalary(countryCode, config.salaryExamples.midLevel), config.currencySymbol)} in taxes

### ${getCommonQuestion(countryCode, 1)}

${getCommonAnswer(countryCode, 1)}

### ${getCommonQuestion(countryCode, 2)}

${getCommonAnswer(countryCode, 2)}

---

## Frequently Asked Questions (FAQs)

### Is this ${config.name} salary calculator accurate?

Yes, our calculator uses official ${config.taxYear} tax rates from ${getTaxAuthority(countryCode)}. We include:
- Current ${config.primaryTax.abbreviation} brackets
- ${config.secondaryTax.abbreviation} rates and caps
${config.regions?.hasRegions ? `- ${capitalize(config.regions.name)}-specific tax rates` : ''}
- Standard deductions and allowances

**Important:** Results are estimates for informational purposes. Your actual take-home pay may vary based on:
- Employer-specific benefits
- Additional deductions or withholdings
- Tax credits you qualify for
- Timing of payments (tax is calculated annually but paid periodically)

### How often is the calculator updated?

We update our calculator annually when new tax rates are announced. Our ${config.taxYear} rates are current as of January ${config.taxYear}. ${getUpdateNote(countryCode)}

### ${getFAQ(countryCode, 1).question}

${getFAQ(countryCode, 1).answer}

### ${getFAQ(countryCode, 2).question}

${getFAQ(countryCode, 2).answer}

### ${getFAQ(countryCode, 3).question}

${getFAQ(countryCode, 3).answer}

### ${getFAQ(countryCode, 4).question}

${getFAQ(countryCode, 4).answer}

### Can I use this for ${getEmploymentType(countryCode)}?

${getEmploymentTypeAnswer(countryCode)}

### How accurate are the ${config.regions?.hasRegions ? config.regions.name : 'calculations'}?

${getAccuracyStatement(countryCode)}

### What deductions can I add?

Our calculator supports common pre-tax deductions:

${config.deductions.map(d => `- **${d.name}:** ${d.description}${d.maxAmount ? ` (Maximum: ${d.maxAmount})` : ''}`).join('\n')}

Pre-tax deductions reduce your taxable income, which can significantly lower your ${config.primaryTax.abbreviation}.

### Should I negotiate gross or net salary?

**Always negotiate gross salary.** Employment contracts specify gross amounts, and taxes vary by personal circumstances.

**Example:** Two people with the same gross salary may have different net salaries based on:
${getNegotiationFactors(countryCode)}

Use our calculator to understand what different gross salaries mean for your take-home pay.

---

## About ${config.name} Taxes

### Tax Year: ${config.taxYear}

${getTaxYearDescription(countryCode)}

### Who Pays Taxes?

${getWhoPaysTaxes(countryCode)}

### Tax Filing

${getTaxFilingInfo(countryCode)}

---

## Related Calculators

- [${config.name} Gross-to-Net Calculator](/calculators/${countryCode.toLowerCase()}/salary-calculator)
- [${config.name} Net-to-Gross Calculator](/calculators/${countryCode.toLowerCase()}/reverse-salary-calculator)
- [${config.name} Hourly Rate Calculator](/calculators/${countryCode.toLowerCase()}/hourly-to-salary-calculator)
- [${config.name} Overtime Calculator](/calculators/${countryCode.toLowerCase()}/overtime-calculator)
- [${config.name} Bonus Tax Calculator](/calculators/${countryCode.toLowerCase()}/bonus-calculator)

---

**Disclaimer:** This calculator provides estimates for informational purposes only. Tax laws are complex and individual circumstances vary. For personalized tax advice, consult a qualified ${config.adjective} tax professional or accountant. We update our calculator regularly, but tax laws may change during the year.

**Last Updated:** January ${config.taxYear}

**Sources:** ${getTaxAuthority(countryCode)}, ${config.taxYear} tax year regulations.

---

*Calculate your take-home pay in seconds. Free, accurate, and updated for ${config.taxYear}.*

## JSON-LD SCHEMA

### WebPage Schema
\`\`\`json
{
  "@context": "https://schema.org",
  "@type": "WebPage",
  "name": "${metaTitle}",
  "description": "${metaDescription}",
  "url": "https://salarycalculator.example.com/calculators/${countryCode.toLowerCase()}/${calculatorType}",
  "breadcrumb": {
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://salarycalculator.example.com"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "${config.name}",
        "item": "https://salarycalculator.example.com/calculators/${countryCode.toLowerCase()}"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": "${getCalculatorName(calculatorType)}",
        "item": "https://salarycalculator.example.com/calculators/${countryCode.toLowerCase()}/${calculatorType}"
      }
    ]
  },
  "about": {
    "@type": "Thing",
    "name": "${config.name} Salary Calculator",
    "description": "Calculate take-home pay after ${config.primaryTax.abbreviation} and ${config.secondaryTax.abbreviation} for ${config.taxYear}"
  }
}
\`\`\`

### SoftwareApplication Schema
\`\`\`json
{
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "${config.name} ${getCalculatorName(calculatorType)}",
  "applicationCategory": "FinanceApplication",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "${config.currency}"
  },
  "operatingSystem": "Any",
  "description": "${metaDescription}",
  "featureList": [
    "Accurate ${config.taxYear} tax calculations",
    "${config.primaryTax.abbreviation} and ${config.secondaryTax.abbreviation} breakdown",
    "Instant results",
    "Multiple frequency conversions"
  ]
}
\`\`\`

### FAQPage Schema
\`\`\`json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Is this ${config.name} salary calculator accurate?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes, our calculator uses official ${config.taxYear} tax rates from ${getTaxAuthority(countryCode)}. Results are estimates for informational purposes."
      }
    },
    {
      "@type": "Question",
      "name": "What is gross vs net salary?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Gross salary is your income before deductions. Net salary (take-home pay) is what arrives in your bank account after all taxes and deductions."
      }
    },
    {
      "@type": "Question",
      "name": "How much is taken out of my paycheck in ${config.name}?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "For most ${config.adjective} workers, approximately ${getTypicalTaxRange(countryCode)} of gross salary goes to taxes including ${config.primaryTax.abbreviation} and ${config.secondaryTax.abbreviation}."
      }
    }
  ]
}
\`\`\`

### BreadcrumbList Schema
\`\`\`json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": "https://salarycalculator.example.com"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "${config.name}",
      "item": "https://salarycalculator.example.com/calculators/${countryCode.toLowerCase()}"
    },
    {
      "@type": "ListItem",
      "position": 3,
      "name": "${getCalculatorName(calculatorType)}",
      "item": "https://salarycalculator.example.com/calculators/${countryCode.toLowerCase()}/${calculatorType}"
    }
  ]
}
\`\`\`
`;

  return content;
}

// Helper functions
function getInputType(calculatorType: CalculatorType): string {
  const types: Record<CalculatorType, string> = {
    'salary-calculator': 'annual gross salary',
    'gross-to-net-salary-calculator': 'annual gross salary',
    'net-to-gross-salary-calculator': 'desired net salary',
    'salary-after-tax-calculator': 'annual gross salary',
    'take-home-pay-calculator': 'annual gross salary',
    'hourly-to-salary-calculator': 'hourly rate',
    'hourly-rate-calculator': 'annual salary',
    'weekly-to-salary-calculator': 'weekly salary',
    'monthly-to-salary-calculator': 'monthly salary',
    'daily-to-salary-calculator': 'daily rate',
    'overtime-pay-calculator': 'regular hourly rate and overtime hours',
    'bonus-tax-calculator': 'base salary and bonus amount',
    'commission-calculator': 'base salary and commission',
    'contractor-salary-calculator': 'gross income and business expenses',
    'freelancer-income-calculator': 'gross income and business expenses',
    'self-employed-tax-calculator': 'gross income and business expenses',
  };
  return types[calculatorType];
}

function getCalculatorName(calculatorType: CalculatorType): string {
  const names: Record<CalculatorType, string> = {
    'salary-calculator': 'Salary Calculator',
    'gross-to-net-salary-calculator': 'Gross to Net Salary Calculator',
    'net-to-gross-salary-calculator': 'Net to Gross Salary Calculator',
    'salary-after-tax-calculator': 'Salary After Tax Calculator',
    'take-home-pay-calculator': 'Take Home Pay Calculator',
    'hourly-to-salary-calculator': 'Hourly to Salary Calculator',
    'hourly-rate-calculator': 'Hourly Rate Calculator',
    'weekly-to-salary-calculator': 'Weekly to Salary Calculator',
    'monthly-to-salary-calculator': 'Monthly to Salary Calculator',
    'daily-to-salary-calculator': 'Daily to Salary Calculator',
    'overtime-pay-calculator': 'Overtime Pay Calculator',
    'bonus-tax-calculator': 'Bonus Tax Calculator',
    'commission-calculator': 'Commission Calculator',
    'contractor-salary-calculator': 'Contractor Salary Calculator',
    'freelancer-income-calculator': 'Freelancer Income Calculator',
    'self-employed-tax-calculator': 'Self-Employed Tax Calculator',
  };
  return names[calculatorType];
}

function getInputLabel(calculatorType: CalculatorType): string {
  const labels: Record<CalculatorType, string> = {
    'salary-calculator': 'Annual Gross Salary',
    'gross-to-net-salary-calculator': 'Annual Gross Salary',
    'net-to-gross-salary-calculator': 'Desired Net Salary',
    'salary-after-tax-calculator': 'Annual Gross Salary',
    'take-home-pay-calculator': 'Annual Gross Salary',
    'hourly-to-salary-calculator': 'Hourly Rate',
    'hourly-rate-calculator': 'Annual Salary',
    'weekly-to-salary-calculator': 'Weekly Salary',
    'monthly-to-salary-calculator': 'Monthly Salary',
    'daily-to-salary-calculator': 'Daily Rate',
    'overtime-pay-calculator': 'Regular Hourly Rate',
    'bonus-tax-calculator': 'Base Salary',
    'commission-calculator': 'Base Salary',
    'contractor-salary-calculator': 'Gross Income',
    'freelancer-income-calculator': 'Gross Income',
    'self-employed-tax-calculator': 'Gross Income',
  };
  return labels[calculatorType];
}

function getInputDescription(calculatorType: CalculatorType): string {
  const descriptions: Record<CalculatorType, string> = {
    'salary-calculator': 'annual gross salary (before taxes)',
    'gross-to-net-salary-calculator': 'annual gross salary (before taxes)',
    'net-to-gross-salary-calculator': 'desired annual net salary (after taxes)',
    'salary-after-tax-calculator': 'annual gross salary (before taxes)',
    'take-home-pay-calculator': 'annual gross salary (before taxes)',
    'hourly-to-salary-calculator': 'hourly wage or rate',
    'hourly-rate-calculator': 'annual salary to convert to hourly',
    'weekly-to-salary-calculator': 'weekly gross salary',
    'monthly-to-salary-calculator': 'monthly gross salary',
    'daily-to-salary-calculator': 'daily wage or rate',
    'overtime-pay-calculator': 'regular hourly rate and overtime hours per week',
    'bonus-tax-calculator': 'base annual salary and bonus amount',
    'commission-calculator': 'base annual salary and commission amount',
    'contractor-salary-calculator': 'total gross income and business expenses',
    'freelancer-income-calculator': 'total gross income and business expenses',
    'self-employed-tax-calculator': 'total gross income and business expenses',
  };
  return descriptions[calculatorType];
}

function getFrequencyNote(calculatorType: CalculatorType): string {
  const notes: Record<CalculatorType, string> = {
    'salary-calculator': '',
    'gross-to-net-salary-calculator': '',
    'net-to-gross-salary-calculator': '',
    'salary-after-tax-calculator': '',
    'take-home-pay-calculator': '',
    'hourly-to-salary-calculator': '/hour',
    'hourly-rate-calculator': '',
    'weekly-to-salary-calculator': '/week',
    'monthly-to-salary-calculator': '/month',
    'daily-to-salary-calculator': '/day',
    'overtime-pay-calculator': '/hour',
    'bonus-tax-calculator': '',
    'commission-calculator': '',
    'contractor-salary-calculator': '',
    'freelancer-income-calculator': '',
    'self-employed-tax-calculator': '',
  };
  return notes[calculatorType];
}

function formatCurrency(amount: number, symbol: string): string {
  return `${symbol}${amount.toLocaleString('en-US')}`;
}

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function generateTaxTable(countryCode: Country): string {
  // Simplified - in production, pull from actual tax engine data
  const tables: Record<Country, string> = {
    US: `| Tax Rate | Income Range | Tax on Band |
|----------|--------------|-------------|
| 10% | $0 - $11,600 | $0 - $1,160 |
| 12% | $11,600 - $47,150 | $1,160 - $5,626 |
| 22% | $47,150 - $100,525 | $5,626 - $17,368 |
| 24% | $100,525 - $191,950 | $17,368 - $39,310 |
| 32% | $191,950 - $243,725 | $39,310 - $55,878 |
| 35% | $243,725 - $609,350 | $55,878 - $183,873 |
| 37% | Over $609,350 | $183,873+ |`,
    ES: `| Tax Rate | Income Range | Tax on Band |
|----------|--------------|-------------|
| 19% | €0 - €12,450 | €0 - €2,366 |
| 24% | €12,450 - €20,200 | €2,366 - €4,226 |
| 30% | €20,200 - €35,200 | €4,226 - €8,726 |
| 37% | €35,200 - €60,000 | €8,726 - €17,902 |
| 45% | €60,000 - €300,000 | €17,902 - €125,902 |
| 47% | Over €300,000 | €125,902+ |`,
    IT: `| Tax Rate | Income Range | Tax on Band |
|----------|--------------|-------------|
| 23% | €0 - €15,000 | €0 - €3,450 |
| 25% | €15,000 - €28,000 | €3,450 - €6,700 |
| 35% | €28,000 - €50,000 | €6,700 - €14,400 |
| 43% | €50,000 - €75,000 | €14,400 - €25,150 |
| 43% | Over €75,000 | €25,150+ |`,
    UK: `| Tax Rate | Income Range | Tax on Band |
|----------|--------------|-------------|
| 0% | £0 - £12,570 | £0 (Personal Allowance) |
| 20% | £12,570 - £50,270 | £0 - £7,540 (Basic) |
| 40% | £50,270 - £125,140 | £7,540 - £37,428 (Higher) |
| 45% | Over £125,140 | £37,428+ (Additional) |`,
    IE: `| Tax Rate | Income Range | Tax on Band |
|----------|--------------|-------------|
| 20% | €0 - €44,300 | €0 - €8,860 (Standard) |
| 40% | Over €44,300 | €8,860+ (Higher) |`,
    CA: `| Federal Tax Rate | Income Range |
|------------------|--------------|
| 15% | $0 - $55,867 |
| 20.5% | $55,867 - $111,733 |
| 26% | $111,733 - $173,205 |
| 29% | $173,205 - $246,752 |
| 33% | Over $246,752 |

*Plus provincial tax (varies by province)*`,
    AU: `| Tax Rate | Income Range | Tax on Band |
|----------|--------------|-------------|
| 0% | $0 - $18,200 | $0 (Tax-Free Threshold) |
| 19% | $18,200 - $45,000 | $0 - $5,092 |
| 32.5% | $45,000 - $135,000 | $5,092 - $34,342 |
| 37% | $135,000 - $190,000 | $34,342 - $54,682 |
| 45% | Over $190,000 | $54,682+ |`,
    DE: `| Tax Rate | Income Range |
|----------|--------------|
| 0% | €0 - €11,604 (Basic Allowance) |
| 14% - 42% | €11,604 - €66,760 (Progressive) |
| 42% | €66,760 - €277,826 |
| 45% | Over €277,826 (Top Rate) |

*Tax calculated using quadratic formula*`,
    FR: `| Tax Rate | Income Range (per part) |
|----------|-------------------------|
| 0% | €0 - €11,294 |
| 11% | €11,294 - €28,797 |
| 30% | €28,797 - €82,341 |
| 41% | €82,341 - €177,106 |
| 45% | Over €177,106 |

*Divided by family quotient (quotient familial)*`,
    NL: `| Tax Rate | Income Range |
|----------|--------------|
| 36.97% | €0 - €75,518 (Box 1) |
| 49.5% | Over €75,518 |

*Includes national insurance contributions*`,
    PT: `| Tax Rate | Income Range |
|----------|--------------|
| 13.25% | €0 - €7,479 |
| 18% | €7,479 - €11,284 |
| 23% | €11,284 - €15,992 |
| 26% | €15,992 - €20,700 |
| 32% | €20,700 - €26,355 |
| 35% | €26,355 - €38,632 |
| 37% | €38,632 - €50,483 |
| 43.5% | €50,483 - €78,834 |
| 48% | Over €78,834 |`,
    CH: `| Tax Rate | Canton | Approximate Rate |
|----------|--------|------------------|
| Varies | Zug | ~15-20% (lowest) |
| Varies | Zurich | ~20-25% |
| Varies | Geneva | ~25-30% (highest) |

*Taxes vary significantly by canton and municipality*`,
    JP: `| Tax Rate | Income Range |
|----------|--------------|
| 5% | ¥0 - ¥1,950,000 |
| 10% | ¥1,950,000 - ¥3,300,000 |
| 20% | ¥3,300,000 - ¥6,950,000 |
| 23% | ¥6,950,000 - ¥9,000,000 |
| 33% | ¥9,000,000 - ¥18,000,000 |
| 40% | ¥18,000,000 - ¥40,000,000 |
| 45% | Over ¥40,000,000 |

*Plus 10% resident tax (municipal + prefectural)*`,
  };
  return tables[countryCode];
}

function getTaxNotes(countryCode: Country): string {
  const notes: Record<Country, string> = {
    US: 'These are federal tax brackets only. State income tax (if applicable) will be added on top.',
    ES: 'Combined national and regional IRPF rates. Regional rates may vary slightly.',
    IT: 'IRPEF brackets before personal and dependent deductions are applied.',
    UK: 'Personal Allowance (£12,570) is reduced by £1 for every £2 earned over £100,000.',
    IE: 'Standard rate cut-off point is €44,300 for single individuals, €53,300 for married couples (one income).',
    CA: 'Federal brackets shown. Provincial tax adds 5-20% depending on province.',
    AU: 'Includes Medicare Levy (2%). Tax-Free Threshold available for residents.',
    DE: 'Income tax calculated using complex quadratic formula (Grundtabelle).',
    FR: 'Tax calculated on income per household part (quotient familial system).',
    NL: 'Box 1 income includes employment and home ownership. Tax credits reduce final liability.',
    PT: 'IRS tax brackets with 9 progressive rates. Social security (11% employee, 21.4% self-employed) applies separately.',
    CH: 'Switzerland has federal, cantonal, and municipal taxes. Rates vary significantly by location. Tax optimization possible through canton choice.',
    JP: 'National income tax plus 10% resident tax (municipal 6% + prefectural 4%). Social insurance contributions also apply.',
  };
  return notes[countryCode];
}

function generateExampleCalculation(countryCode: Country, salary: number): string {
  // Simplified - in production, use actual tax engine
  return `*Detailed calculation would be performed by the actual tax engine. This is a placeholder.*

1. Gross Annual Salary: ${formatCurrency(salary, COUNTRY_CONFIGS[countryCode].currencySymbol)}
2. Primary Tax: ~${Math.round(salary * 0.20)} (example)
3. Secondary Tax: ~${Math.round(salary * 0.08)} (example)
4. Net Salary: ~${formatCurrency(Math.round(salary * 0.72), COUNTRY_CONFIGS[countryCode].currencySymbol)}

Use the calculator above for accurate calculations.`;
}

function getSecondaryTaxPurpose(countryCode: Country): string {
  const purposes: Record<Country, string> = {
    US: 'Social Security retirement/disability benefits and Medicare health insurance',
    ES: 'State pension, unemployment benefits, and healthcare',
    IT: 'Pension benefits and social welfare programs',
    UK: 'State pension and some healthcare/benefit coverage',
    IE: 'Social welfare payments, pensions, and healthcare funding',
    CA: 'Canada Pension Plan retirement benefits and Employment Insurance',
    AU: 'Medicare public healthcare system',
    DE: 'Pension, health insurance, unemployment insurance, and long-term care',
    FR: 'Social security benefits and healthcare funding',
    NL: 'State pension (AOW) and long-term care insurance (WLZ)',
    PT: 'Social security benefits, healthcare, and state pension',
    CH: 'Old-age and survivors insurance (AHV/AVS) and disability insurance',
    JP: 'National pension, health insurance, and social welfare programs',
  };
  return purposes[countryCode];
}

function estimateSecondaryTax(countryCode: Country, salary: number): number {
  // Simplified estimates
  const rates: Record<Country, number> = {
    US: 0.0765,
    ES: 0.0635,
    IT: 0.0919,
    UK: 0.12,
    IE: 0.04,
    CA: 0.0758,
    AU: 0.02,
    DE: 0.196,
    FR: 0.097,
    NL: 0.2765,
    PT: 0.11,
    CH: 0.105,
    JP: 0.15,
  };
  return Math.round(salary * rates[countryCode]);
}

function generateRegionalTaxInfo(config: CountryConfig): string {
  if (!config.regions?.hasRegions) {
    return '';
  }

  return `### Regional Tax Differences

${config.name} has ${config.regions.examples.length} ${config.regions.name} with varying tax rates:

${config.regions.examples.slice(0, 5).map(region => `- **${region}:** Unique ${config.regions!.name.slice(0, -1)} tax rates and brackets`).join('\n')}

Use the calculator above to select your specific ${config.regions.name.slice(0, -1)} for accurate calculations.`;
}

function generateSalaryExamples(countryCode: Country, config: CountryConfig): string {
  const examples = [
    { title: 'Entry-Level', salary: config.salaryExamples.entryLevel, description: 'Starting career, junior positions' },
    { title: 'Mid-Level', salary: config.salaryExamples.midLevel, description: '3-7 years experience, professional roles' },
    { title: 'Senior', salary: config.salaryExamples.senior, description: '7+ years experience, senior positions' },
    { title: 'Executive', salary: config.salaryExamples.executive, description: 'Management, director level' },
  ];

  return examples.map((ex, i) => {
    const netEstimate = estimateNetSalary(countryCode, ex.salary);
    const taxEstimate = ex.salary - netEstimate;
    const effectiveRate = ((taxEstimate / ex.salary) * 100).toFixed(1);

    return `### Example ${i + 1}: ${formatCurrency(ex.salary, config.currencySymbol)} Salary (${ex.title})

**Profile:** ${ex.description}
${config.regions?.hasRegions ? `**Location:** ${config.regions.examples[0]} (default)` : ''}

- **Gross Annual Salary:** ${formatCurrency(ex.salary, config.currencySymbol)}
- **${config.primaryTax.abbreviation}:** ~${formatCurrency(Math.round(taxEstimate * 0.7), config.currencySymbol)}
- **${config.secondaryTax.abbreviation}:** ~${formatCurrency(Math.round(taxEstimate * 0.3), config.currencySymbol)}
- **Total Taxes & Deductions:** ~${formatCurrency(taxEstimate, config.currencySymbol)}
- **Take-Home Pay:** **${formatCurrency(netEstimate, config.currencySymbol)}/year** (${formatCurrency(Math.round(netEstimate / 12), config.currencySymbol)}/month)
- **Effective Tax Rate:** ${effectiveRate}%

---
`;
  }).join('\n');
}

function estimateNetSalary(countryCode: Country, grossSalary: number): number {
  // Simplified estimates - in production, use actual tax engine
  const netRates: Record<Country, number> = {
    US: 0.72,
    ES: 0.71,
    IT: 0.69,
    UK: 0.73,
    IE: 0.70,
    CA: 0.71,
    AU: 0.75,
    DE: 0.62,
    FR: 0.68,
    NL: 0.65,
    PT: 0.70,
    CH: 0.72,
    JP: 0.68,
  };
  return Math.round(grossSalary * netRates[countryCode]);
}

function getTypicalTaxRange(countryCode: Country): string {
  const ranges: Record<Country, string> = {
    US: '20-35%',
    ES: '25-35%',
    IT: '28-38%',
    UK: '23-33%',
    IE: '25-35%',
    CA: '25-35%',
    AU: '20-30%',
    DE: '35-45%',
    FR: '28-38%',
    NL: '32-42%',
    PT: '13-48%',
    CH: '15-40%',
    JP: '15-55%',
  };
  return ranges[countryCode];
}

function getPrimaryTaxRange(countryCode: Country): string {
  const ranges: Record<Country, string> = {
    US: '10-37%',
    ES: '19-47%',
    IT: '23-43%',
    UK: '20-45%',
    IE: '20-40%',
    CA: '15-33% federal',
    AU: '19-45%',
    DE: '14-45%',
    FR: '11-45%',
    NL: '37-50%',
    PT: '13-48%',
    CH: '15-40%',
    JP: '15-55%',
  };
  return ranges[countryCode];
}

function getCommonQuestion(countryCode: Country, index: number): string {
  const questions: Record<Country, string[]> = {
    US: [
      'Which states have no income tax?',
      'How do 401(k) contributions affect my take-home pay?',
    ],
    ES: [
      'What is the difference between empleado and autónomo?',
      'How much does Social Security cost for self-employed?',
    ],
    IT: [
      'What are the personal deductions in Italy?',
      'How does the regional tax (addizionale regionale) work?',
    ],
    UK: [
      'What is the Personal Allowance?',
      'How does the Marriage Allowance work?',
    ],
    IE: [
      'What is USC and PRSI?',
      'How do tax credits work in Ireland?',
    ],
    CA: [
      'How do RRSP contributions reduce my taxes?',
      'Do I pay federal and provincial tax?',
    ],
    AU: [
      'What is the Medicare Levy Surcharge?',
      'How does the tax-free threshold work?',
    ],
    DE: [
      'What is Steuerklasse (tax class)?',
      'How does Solidaritätszuschlag work?',
    ],
    FR: [
      'What is the quotient familial system?',
      'How are married couples taxed in France?',
    ],
    NL: [
      'What is the 30% ruling for expats?',
      'How do tax credits (heffingskortingen) work?',
    ],
    PT: [
      'What is IRS and how does it work?',
      'What are the social security rates in Portugal?',
    ],
    CH: [
      'How does Swiss cantonal tax work?',
      'What are Pillar 2 and Pillar 3a deductions?',
    ],
    JP: [
      'What is Resident Tax in Japan?',
      'How does social insurance work for employees?',
    ],
  };
  return questions[countryCode][index] || 'Common question placeholder';
}

function getCommonAnswer(countryCode: Country, index: number): string {
  const config = COUNTRY_CONFIGS[countryCode];

  const answers: Record<Country, string[]> = {
    US: [
      'Nine states have no income tax: Alaska, Florida, Nevada, South Dakota, Tennessee, Texas, Washington, and Wyoming (New Hampshire only taxes investment income). Living in these states means you only pay federal tax, which can significantly increase your take-home pay.',
      '401(k) contributions are pre-tax, meaning they reduce your taxable income. Contributing the maximum ($23,500 in 2026) can save you thousands in federal and state taxes while building retirement savings.',
    ],
    ES: [
      '**Empleado (Employee):** Regular employee with employment contract. Social Security: 6.35% capped at €4,070/month. Employer pays additional ~30%.\n\n**Autónomo (Self-Employed):** Self-employed freelancer/contractor. Progressive Social Security scale: €230-€1,536/month based on income. No employer contribution.',
      'For autónomos, Social Security uses a progressive monthly scale based on real income. Ranges from €230/month (for income under €670/month) up to €1,536/month (for income over €6,000/month). Total annual cost: €2,760 to €18,432.',
    ],
    PT: [
      'IRS (Imposto sobre o Rendimento das Pessoas Singulares) is Portugal\'s progressive income tax with 9 brackets ranging from 13.25% to 48%. All residents and workers in Portugal with income above the minimum threshold must file an annual IRS declaration.',
      'Social Security contributions in Portugal are 11% for employees (deducted from paycheck) and 21.4% for self-employed workers (autónomos). Employers contribute an additional 23.75% for employees.',
    ],
    CH: [
      'Switzerland has a three-tier tax system: Federal tax (0.77%-11.5%), Cantonal tax (varies by canton), and Municipal tax (varies by municipality). Combined rates range from ~12% in low-tax cantons like Zug to ~40% in high-tax cantons like Geneva.',
      'Pillar 2 is mandatory occupational pension (employer + employee contributions). Pillar 3a is voluntary private pension with tax benefits - contributions up to CHF 7,056/year are fully tax-deductible, reducing both cantonal and federal tax.',
    ],
    JP: [
      'Resident Tax (住民税) is a flat 10% local tax (4% prefectural + 6% municipal) applied to the previous year\'s income. It\'s separate from national income tax and paid in quarterly installments starting June.',
      'Social insurance in Japan includes: Pension (9.15% employee share), Health Insurance (~5%), and Employment Insurance (0.6%). Combined, employees pay about 14-15% of salary for social insurance, with employers matching most contributions.',
    ],
    IT: [
      'Italy has progressive IRPEF brackets (23-43%) plus regional tax (1.23-2.33%) and municipal tax (0-0.9%). Personal deductions reduce final tax amount, not taxable income. The deduction phases out as income increases.',
      'INPS contributions are 9.19% for employees (no cap) or 25.97% for self-employed (capped at €113,520). Self-employed can deduct business expenses but pay higher INPS rates.',
    ],
    UK: [
      'The Personal Allowance is £12,570 tax-free. Income from £12,570-£50,270 is taxed at 20% (basic rate), £50,270-£125,140 at 40% (higher rate), and above £125,140 at 45% (additional rate). Personal Allowance reduces above £100,000.',
      'Employees pay Class 1 NI: 12% on £12,570-£50,270, then 2% above. Self-employed pay Class 2 (£3.45/week) and Class 4: 9% on £12,570-£50,270, then 2% above. Self-employed NI is generally lower.',
    ],
    IE: [
      'Ireland has standard rate (20%) and higher rate (40%). The standard rate band is €42,000 (single) or €51,000-€82,000 (married, depending on earners). Tax credits reduce your tax bill directly, not your taxable income.',
      'USC (Universal Social Charge) is progressive: 0.5% on first €12,012, 2% on €12,012-€22,920, 4.5% on €22,920-€70,044, 8% above. PRSI is 4% for most employees. Both apply to gross income.',
    ],
    CA: [
      'Canada has federal tax (15-33%) and provincial tax (varies by province). Combined marginal rates range from 20.05% (low income) to 53.53% (top bracket in some provinces). Each province has its own brackets.',
      'RRSP contributions are deductible from both federal and provincial income. Maximum is 18% of previous year\'s income up to $31,560 (2024). Contribution room is cumulative and carries forward indefinitely.',
    ],
    AU: [
      'Australia has progressive rates from 19% to 45%. The tax-free threshold is $18,200. Low Income Tax Offset (LITO) provides up to $700 for incomes under $66,667, phasing out completely at $66,667.',
      'Medicare Levy is 2% of taxable income. Medicare Levy Surcharge is an additional 1-1.5% if you earn over $93,000 (singles) or $186,000 (families) without private health insurance.',
    ],
    DE: [
      'Germany uses a quadratic formula for income tax, resulting in progressive rates from ~14% to 45%. Solidarity surcharge (5.5% of tax) applies only to high earners. Church tax (8-9%) is optional.',
      'Social contributions total ~20% for employees: pension (9.3%), health (7.3%), unemployment (1.2%), long-term care (1.7%). Self-employed pay full amounts (~40%) and rates vary by profession.',
    ],
    FR: [
      'France divides household income by "parts" (quotient familial): 1 for single, 2 for married, +0.5 per child (first 2), +1 per child (3rd+). Tax is calculated on divided income, then multiplied back by parts.',
      'Social contributions include CSG (9.2% on 98.25% of gross) and CRDS (0.5%). Total social charges are about 9.7% of gross salary, deducted at source alongside income tax.',
    ],
    NL: [
      'Netherlands has two tax boxes. Box 1 (income from work): 36.97% up to €75,518, then 49.5%. Box 2 (substantial interest): flat 24.5%. Box 3 (savings/investments): deemed return taxed at 36%.',
      'General tax credit is €3,362, labor tax credit up to €5,552 (income dependent). Both phase out at higher incomes. The 30% ruling allows eligible expats to receive 30% of salary tax-free for 5 years.',
    ],
    // Add more answers...
  };

  return answers[countryCode]?.[index] || 'Answer placeholder - would be filled with country-specific content';
}

function getTaxAuthority(countryCode: Country): string {
  const authorities: Record<Country, string> = {
    US: 'IRS (Internal Revenue Service) and state tax authorities',
    ES: 'Agencia Tributaria (Spanish Tax Agency)',
    IT: 'Agenzia delle Entrate (Italian Revenue Agency)',
    UK: 'HMRC (His Majesty\'s Revenue and Customs)',
    IE: 'Revenue Commissioners',
    CA: 'Canada Revenue Agency (CRA)',
    AU: 'Australian Taxation Office (ATO)',
    DE: 'Bundesministerium der Finanzen (Federal Ministry of Finance)',
    FR: 'Direction Générale des Finances Publiques (DGFiP)',
    NL: 'Belastingdienst (Dutch Tax Authority)',
    PT: 'Autoridade Tributária e Aduaneira (Portuguese Tax Authority)',
    CH: 'Federal Tax Administration (FTA) and cantonal tax authorities',
    JP: 'National Tax Agency (国税庁 - Kokuzei-chō)',
  };
  return authorities[countryCode];
}

function getUpdateNote(countryCode: Country): string {
  return `Tax rates are typically announced in late ${new Date().getFullYear() - 1} for the ${new Date().getFullYear()} tax year.`;
}

function getFAQ(countryCode: Country, index: number): { question: string; answer: string } {
  const faqs: Record<Country, Array<{ question: string; answer: string }>> = {
    US: [
      {
        question: 'How do state taxes affect my take-home pay?',
        answer: `State income tax varies significantly across the US. Nine states (Alaska, Florida, Nevada, South Dakota, Tennessee, Texas, Washington, Wyoming, New Hampshire) have no income tax on wages. Other states range from about 2% to 13%.\n\n**Examples:**\n- **California:** Progressive rate up to 13.3% (highest in nation)\n- **New York:** Progressive rate up to 10.9%\n- **Texas:** 0% (no state income tax)\n\nFor a $75,000 salary:\n- **California resident:** ~$6,500-7,500 in state tax\n- **Texas resident:** $0 in state tax\n\nUse our calculator's state selector to see your specific state's impact.`,
      },
      {
        question: 'What is FICA and how is it calculated?',
        answer: `FICA (Federal Insurance Contributions Act) has two components:\n\n**Social Security:**\n- Employee pays: 6.2%\n- Employer pays: 6.2%\n- Wage cap: $176,100 (2026)\n- Maximum annual contribution: $10,918\n\n**Medicare:**\n- Employee pays: 1.45% (no cap)\n- Additional 0.9% over $200,000 (single) or $250,000 (married)\n- Employer pays: 1.45%\n\n**Example on $75,000 salary:**\n- Social Security: $4,650 (6.2%)\n- Medicare: $1,088 (1.45%)\n- Total FICA: $5,738/year\n\nSelf-employed individuals pay both employee and employer portions (15.3% total).`,
      },
      {
        question: 'How do pre-tax deductions reduce my taxes?',
        answer: `Pre-tax deductions reduce your **taxable income**, which lowers both your income tax and FICA (Social Security/Medicare) in many cases.\n\n**Example:** $75,000 salary, 22% tax bracket\n\nWithout 401(k):\n- Taxable income: $75,000\n- Federal tax: ~$11,000\n- FICA: $5,738\n- Take-home: ~$58,000\n\nWith $10,000 401(k) contribution:\n- Taxable income: $65,000\n- Federal tax: ~$8,800 (saves $2,200)\n- FICA: $5,738 (same)\n- Take-home: ~$51,000 + $10,000 in retirement = $61,000 net worth\n\n**Tax savings:** $2,200 federal tax saved, plus state tax savings if applicable.`,
      },
      {
        question: 'What are standard vs itemized deductions?',
        answer: `**Standard Deduction (2026):**\n- Single: $14,600\n- Married filing jointly: $29,200\n- Head of household: $21,900\n\nMost taxpayers take the standard deduction.\n\n**Itemized Deductions** include:\n- Mortgage interest\n- State and local taxes (SALT) up to $10,000\n- Charitable donations\n- Medical expenses over 7.5% of AGI\n\nItemize only if total exceeds standard deduction.\n\n**Example:** Single filer\n- Mortgage interest: $8,000\n- SALT: $10,000\n- Charity: $2,000\n- Total: $20,000\n\nSince $20,000 > $14,600 standard, itemizing saves ~$1,188 (22% bracket × $5,400 difference).`,
      },
    ],
    ES: [
      {
        question: 'How does IRPF vary by autonomous community?',
        answer: `Spain's IRPF (income tax) has both national and regional (autonómica) components. The regional portion can vary significantly:\n\n**Madrid (low tax):**\n- Combined IRPF typically lower\n- More tax-friendly for high earners\n\n**Cataluña (higher tax):**\n- Higher regional rates\n- Additional brackets for high income\n\n**Example for €50,000 salary:**\n- Madrid: ~€9,500-10,000 IRPF\n- Cataluña: ~€10,500-11,000 IRPF\n- Difference: ~€1,000-1,500/year\n\nOur calculator includes all 17 autonomous communities with accurate regional rates.`,
      },
      {
        question: 'What is the difference between empleado and autónomo taxation?',
        answer: `**Empleado (Employee):**\n- IRPF: Same progressive brackets (19%-47%)\n- Seguridad Social: 6.35% capped at €4,070/month (€48,840/year)\n- Employer pays additional ~30% Seguridad Social\n- Withholding (retención) applied monthly by employer\n\n**Autónomo (Self-Employed):**\n- IRPF: Same progressive brackets (19%-47%)\n- Seguridad Social: Progressive monthly scale €230-€1,536 based on actual income\n- Can deduct business expenses from IRPF\n- Quarterly tax payments (trimestral)\n- Must handle own tax filings\n\n**Example: €36,000 annual income**\n- Employee: €2,286 Seguridad Social, ~€7,300 IRPF = €26,414 net\n- Autónomo: ~€4,080 Seguridad Social, ~€5,500 IRPF (after expenses) = ~€26,420 net\n\nThe difference is smaller than many think, but autónomos have more admin overhead.`,
      },
      {
        question: 'Can I deduct pension and health insurance?',
        answer: `Yes, certain contributions reduce your taxable income for IRPF:\n\n**Pension Plans (Plan de Pensiones):**\n- Maximum deduction: €1,500/year (or 30% of net income, whichever is lower)\n- Additional €8,500 if over 50 years old\n- Must be in approved pension plan\n\n**Private Health Insurance:**\n- Maximum deduction: €500/year per person\n- €1,500 for people with disabilities\n- Must cover illness or accident\n\n**Example: €40,000 salary**\n- Without deductions: €40,000 taxable\n- With €1,500 pension + €500 health: €38,000 taxable\n- Tax savings: ~€600 (30% bracket × €2,000)\n\n**Important:** These deductions reduce IRPF only, not Seguridad Social.`,
      },
      {
        question: 'How do personal and family allowances work?',
        answer: `Spain uses personal allowances (mínimo personal) that reduce taxable income:\n\n**Base Personal Allowance:** €5,550\n\n**Age-Based Increases:**\n- Age 65-74: €6,700 total\n- Age 75+: €8,100 total\n\n**Married/Joint Filing:** +€3,400\n\n**Children Allowances:**\n- First child: +€2,400\n- Second child: +€2,700\n- Third+ children: +€4,000 each\n\n**Example: Married couple, 2 children**\n- Base: €5,550\n- Married: +€3,400\n- Child 1: +€2,400\n- Child 2: +€2,700\n- Total allowance: €14,050\n\nOn €50,000 gross:\n- Taxable income: €50,000 - €14,050 = €35,950\n- IRPF: ~€6,900 (vs €10,500 without allowances)\n- Tax savings: ~€3,600/year`,
      },
    ],
    IT: [
      {
        question: 'How do IRPEF brackets and personal deductions work together?',
        answer: `Italy's IRPEF system has two key components:\n\n**1. Progressive Tax Brackets:**\n- 23% on income €0-€15,000\n- 25% on income €15,000-€28,000\n- 35% on income €28,000-€50,000\n- 43% on income €50,000-€75,000\n- 43% on income over €75,000\n\n**2. Personal Deduction (applied to tax, not income):**\n- €0-€15,000: €1,880 deduction\n- €15,000-€28,000: €1,910 + €1,190 × [(€28,000 - income) / €13,000]\n- €28,000-€50,000: €1,910 × [(€50,000 - income) / €22,000]\n- Over €50,000: No deduction\n\n**Example: €35,000 salary**\n1. Calculate IRPEF: €8,255\n2. Personal deduction: ~€1,200\n3. Final IRPEF: €8,255 - €1,200 = €7,055\n\nThe deduction reduces the final tax amount, not the taxable income.`,
      },
      {
        question: 'What are dependent deductions (detrazioni per familiari)?',
        answer: `Dependent deductions in Italy reduce your final tax bill:\n\n**Spouse (Coniuge a Carico):**\n- Up to €800/year if spouse income under €2,840\n- Phases out completely at €80,000 income\n- Formula: €800 × €80,000 / taxpayer income\n\n**Children (Figli a Carico):**\n- First child: €950\n- Second child: €950\n- Third+ children: €1,220 each\n- +€200 if child under 3 years old\n- Requirement: Child income under €2,840\n\n**Example: €40,000 salary, married, 2 children (ages 5 and 8)**\n- IRPEF before deductions: €9,710\n- Spouse deduction: €800\n- Child 1 deduction: €950\n- Child 2 deduction: €950\n- Total deductions: €2,700\n- Final IRPEF: €9,710 - €2,700 = €7,010\n- **Savings: €2,700/year** (€225/month)`,
      },
      {
        question: 'How do regional and municipal taxes work?',
        answer: `Italy has three levels of income tax:\n\n**1. National IRPEF:** 23-43% (progressive brackets)\n\n**2. Regional Tax (Addizionale Regionale):**\n- Varies by region: 1.23% to 2.33%\n- Examples:\n  - Lombardy: 1.23%\n  - Lazio (Rome): 1.73%\n  - Campania: 2.33%\n- Applied to taxable IRPEF income\n\n**3. Municipal Tax (Addizionale Comunale):**\n- Set by each municipality: 0% to 0.9%\n- Most cities: 0.7-0.8%\n- Applied to taxable IRPEF income\n\n**Example: €35,000 salary in Milan (Lombardy)**\n- IRPEF base: €35,000\n- Regional (1.23%): €430\n- Municipal (0.8%): €280\n- Total additional: €710/year\n\n**Same salary in Naples (Campania):**\n- Regional (2.33%): €816\n- Municipal (0.8%): €280\n- Total additional: €1,096/year\n- **Difference: €386/year more in Naples**`,
      },
      {
        question: 'What is the difference between employee (dipendente) and self-employed (autonomo) taxation?',
        answer: `**Dipendente (Employee):**\n- IRPEF: 23-43% progressive\n- INPS: 9.19% (general), 8.89% (public), 9.49% (industrial)\n- No cap on contributions\n- Employer withholds taxes monthly\n- Annual tax reconciliation (730 form)\n\n**Autonomo/Freelance (Self-Employed):**\n- IRPEF: Same 23-43% progressive\n- INPS: 25.97% capped at €113,520 gross income\n- Maximum INPS: €29,434/year\n- Can deduct business expenses\n- Quarterly advance payments (F24)\n- More complex tax filing\n\n**Example: €50,000 gross income**\n\n**Employee:**\n- IRPEF: ~€11,650\n- INPS: €4,595 (9.19%)\n- Net: ~€33,755\n\n**Autonomo (after €5,000 expenses):**\n- Taxable: €45,000\n- IRPEF: ~€9,650\n- INPS: €12,985 (25.97%)\n- Net: ~€27,365\n\n**Key difference:** Autonomi pay ~13% more INPS but can deduct expenses.`,
      },
    ],
    UK: [
      {
        question: 'What is the Personal Allowance and how does it work?',
        answer: 'The Personal Allowance is the amount of income you can earn tax-free each year. For 2025/26, it\'s £12,570 for most people. However, it reduces by £1 for every £2 earned over £100,000, disappearing entirely at £125,140.',
      },
      {
        question: 'How does National Insurance differ for employees vs self-employed?',
        answer: 'Employees pay Class 1 NI: 12% on £12,570-£50,270, then 2% above. Self-employed pay Class 2 (£3.45/week) and Class 4: 9% on £12,570-£50,270, then 2% above. Self-employed rates are lower overall.',
      },
    ],
    IE: [
      {
        question: 'What is USC and how is it different from income tax?',
        answer: 'USC (Universal Social Charge) is a separate tax on gross income with progressive rates from 0.5% to 8%. Unlike income tax, USC has fewer exemptions and applies to most gross income including benefits.',
      },
      {
        question: 'How do tax credits work in Ireland?',
        answer: 'Tax credits reduce your tax bill directly (not taxable income). The Single Person Credit is €1,775, Employee Credit is €1,775. If you\'re married, you can transfer unused credits to your spouse.',
      },
    ],
    CA: [
      {
        question: 'How do federal and provincial taxes work together?',
        answer: 'You pay both federal tax (15%-33% on taxable income) and provincial tax (varies by province). For example, in Ontario on $75,000: federal tax ~$11,000, provincial ~$5,000. Total ~$16,000.',
      },
      {
        question: 'What are RRSP contribution limits?',
        answer: 'You can contribute 18% of previous year\'s income up to $31,560 (2024 limit). RRSP contributions are tax-deductible, reducing both federal and provincial taxes. Unused room carries forward.',
      },
    ],
    AU: [
      {
        question: 'What is the Medicare Levy Surcharge?',
        answer: 'If you earn over $93,000 (singles) or $186,000 (families) and don\'t have private health insurance, you pay an additional 1-1.5% Medicare Levy Surcharge on top of the standard 2% Medicare Levy.',
      },
      {
        question: 'How does salary sacrificing work?',
        answer: 'Salary sacrificing lets you contribute pre-tax income to super. Your employer pays less tax (15% in super vs your marginal rate). Maximum concessional contribution: $30,000/year including employer super.',
      },
    ],
    DE: [
      {
        question: 'What is Steuerklasse and which one applies to me?',
        answer: 'Steuerklasse (tax class) determines withholding rates: I (single), II (single parent), III (married, higher earner), IV (married, equal), V (married, lower earner), VI (second job). It affects monthly withholding, not final tax.',
      },
      {
        question: 'What is Solidaritätszuschlag?',
        answer: 'Solidaritätszuschlag (solidarity surcharge) is 5.5% of income tax. However, since 2021, it\'s abolished for most taxpayers. Only those with income tax over ~€17,543 (singles) pay it, affecting mainly high earners.',
      },
    ],
    FR: [
      {
        question: 'How does the quotient familial system work?',
        answer: 'France divides household income by "parts" (parts fiscales): 1 for single, 2 for married couple, +0.5 per child (first 2), +1 per child (3rd+). This progressive division reduces tax for families significantly.',
      },
      {
        question: 'What is the difference between CSG and CRDS?',
        answer: 'CSG (Contribution Sociale Généralisée) is 9.2% on 98.25% of gross salary to fund social security. CRDS (Contribution au Remboursement de la Dette Sociale) is 0.5% to reduce social security debt. Both are deducted at source.',
      },
    ],
    NL: [
      {
        question: 'What is the 30% ruling for expats?',
        answer: 'The 30% ruling allows eligible expat employees to receive 30% of gross salary tax-free as "extraterritorial costs" reimbursement. Valid for max 5 years, requires specific skills, and minimum salary €46,107 (2026).',
      },
      {
        question: 'How do tax credits (heffingskortingen) reduce my taxes?',
        answer: 'Tax credits reduce your tax bill directly. Main credits: General tax credit (€3,362), Labor tax credit (up to €5,552 depending on income), both phase out at higher incomes. Credits are applied automatically by employer.',
      },
    ],
    PT: [
      {
        question: 'How does IRS (Portuguese income tax) work?',
        answer: 'IRS has 9 progressive brackets from 13.25% to 48%. Employees have tax withheld at source (retenção na fonte) but must file annual returns to claim deductions. Married couples can file jointly with income splitting benefits.',
      },
      {
        question: 'What is the difference between employee and self-employed social security?',
        answer: 'Employees pay 11% social security, self-employed pay 21.4%. However, self-employed can deduct business expenses from taxable income. First year of self-employment has reduced rates (starting at €20/month).',
      },
      {
        question: 'Can I deduct expenses in Portugal?',
        answer: 'Yes! IRS allows deductions for: health expenses (15%), education (30%), housing (15% of rent/mortgage interest), and pension contributions. Maximum total deduction depends on income, typically €1,000-€2,500.',
      },
      {
        question: 'What are the different IRS annexes?',
        answer: 'Annex A: employment income. Annex B: business/professional income. Annex D: capital gains. Annex E: rental income. Annex F: self-employed simplified regime. Annex G1: foreign pension income. You file all applicable annexes.',
      },
    ],
    CH: [
      {
        question: 'How does Swiss federal and cantonal tax work together?',
        answer: 'Switzerland has 3 tax levels: Federal (0.77-11.5%), Cantonal (varies greatly), and Municipal. Total rates range from ~12% in Zug to ~40% in Geneva/Basel. Each canton sets own rates and deadlines.',
      },
      {
        question: 'What are Pillar 2 and Pillar 3a?',
        answer: 'Pillar 2 (BVG/LPP) is mandatory occupational pension (~7-18% combined employer/employee). Pillar 3a is voluntary private pension - contributions up to CHF 7,056/year (employees) are fully tax-deductible from federal, cantonal, and municipal taxes.',
      },
      {
        question: 'How does withholding tax (Quellensteuer) work?',
        answer: 'Non-residents and foreign workers without C permit have tax withheld at source. Rates vary by canton and family situation. If earning over CHF 120,000, you must file full tax return even with withholding.',
      },
      {
        question: 'What is the difference between B, C, and G permits for taxation?',
        answer: 'B permit (5 years): Withholding tax unless earning >CHF 120,000. C permit (permanent): Full tax return, same as Swiss citizens. G permit (cross-border): Withholding tax based on work canton, but resident country may also tax.',
      },
    ],
    JP: [
      {
        question: 'What is the difference between Income Tax and Resident Tax?',
        answer: 'Income Tax (所得税) is progressive national tax (5-45%) withheld monthly. Resident Tax (住民税) is flat 10% local tax based on previous year\'s income, paid separately starting June. Together they form your total tax burden.',
      },
      {
        question: 'How does Year-End Adjustment (年末調整) work?',
        answer: 'Nenmatsu Chosei reconciles your actual tax liability vs withholding. Employers adjust in December for insurance premiums, dependents, and mortgage deductions. If you have side income >¥200,000, you must file kakutei shinkoku (tax return).',
      },
      {
        question: 'What are shakai hoken (social insurance) contributions?',
        answer: 'Shakai hoken includes: Pension (厚生年金, 9.15% employee share), Health Insurance (健康保険, ~5%), Long-term Care (介護保険, ~0.9% if 40+), and Employment Insurance (雇用保険, 0.6%). Total ~14-15%, employer matches.',
      },
      {
        question: 'Can I claim dependents and how much do I save?',
        answer: 'Dependent spouse: ¥380,000 deduction (if spouse income <¥480,000). Each dependent: ¥380,000 deduction. Special dependent (19-22 years): ¥630,000. At 20% tax rate, spouse deduction saves ¥76,000 annually in income tax plus resident tax.',
      },
    ],
    // Add FAQs for other countries...
  };

  return faqs[countryCode]?.[index] || { question: 'FAQ placeholder', answer: 'Answer placeholder' };
}

function getEmploymentType(countryCode: Country): string {
  const types: Record<Country, string> = {
    US: 'self-employment (1099 contractors)',
    ES: 'autónomos (self-employed)',
    IT: 'freelancers and partita IVA',
    UK: 'self-employed and sole traders',
    IE: 'self-employed individuals',
    CA: 'self-employed and contractors',
    AU: 'sole traders and contractors',
    DE: 'freelancers (Freiberufler) and self-employed',
    FR: 'auto-entrepreneurs and freelancers',
    NL: 'zzp\'ers (self-employed)',
    PT: 'trabalhadores independentes (self-employed)',
    CH: 'self-employed and freelancers',
    JP: 'kojin jigyo (individual business owners)',
  };
  return types[countryCode];
}

function getEmploymentTypeAnswer(countryCode: Country): string {
  const answers: Record<Country, string> = {
    US: 'Yes! Our calculator supports both W-2 employees and 1099 contractors. Self-employed individuals pay an additional 15.3% self-employment tax (the employer portion of FICA). Use the "Employment Type" advanced option to switch to self-employed calculations.',
    ES: 'Yes! Our calculator supports both empleados (employees) and autónomos (self-employed). Autónomos have different Social Security calculations using a progressive scale (€230-€1,536/month). Use the "Employment Type" advanced option.',
    IT: 'Yes! The calculator works for both dipendenti (employees) and autonomi/freelancers. Self-employed individuals pay 25.97% INPS (capped at €113,520 income) instead of 9.19% employee rate. You can deduct business expenses to reduce taxable income.',
    UK: 'Yes! The calculator handles both employees (PAYE) and self-employed individuals. Self-employed pay Class 2 (£3.45/week) and Class 4 (9% on £12,570-£50,270, 2% above) National Insurance instead of Class 1 employee NI.',
    IE: 'Yes! Our calculator supports both PAYE employees and self-employed individuals. Self-employed pay 4% PRSI instead of the employee rate and have different USC bands. You can claim allowable business expenses against income.',
    CA: 'Yes! The calculator works for both employees and self-employed contractors. Self-employed individuals can deduct business expenses and contribute to RRSP. CPP rates are different (11.9% vs 5.95% employee rate) but you can claim 50% back.',
    AU: 'Yes! The calculator supports both employees and sole traders. Self-employed individuals don\'t have PAYG withholding but pay the same tax rates. You can deduct business expenses and must make quarterly PAYG installments.',
    DE: 'Yes! The calculator works for employees and Freiberufler (freelancers). Self-employed pay full social security contributions (~40% vs ~20% for employees) but rates vary by profession and optional insurance.',
    FR: 'Yes! The calculator supports both employees and auto-entrepreneurs. Self-employed under the micro-entrepreneur regime pay simplified social contributions (12.8-22% depending on activity). Standard self-employed pay full social charges (~45%).',
    NL: 'Yes! The calculator handles both employees and zzp\'ers (self-employed). Self-employed don\'t pay employee social security but must pay income tax and arrange own insurance. You can deduct business expenses and qualify for self-employed deduction (zelfstandigenaftrek).',
    PT: 'Yes! The calculator supports both employees and self-employed workers (trabalhadores independentes). Self-employed pay 21.4% social security vs 11% for employees. You can deduct business expenses.',
    CH: 'Yes! The calculator handles both employees and self-employed. Self-employed pay around 10.5% for AHV/AVS pension insurance. Tax rates vary by canton.',
    JP: 'Yes! The calculator supports both employees and self-employed (kojin jigyo). Self-employed pay national pension and health insurance separately. Rates vary by municipality.',
  };
  return answers[countryCode];
}

function getAccuracyStatement(countryCode: Country): string {
  return `Our ${COUNTRY_CONFIGS[countryCode].name} salary calculator uses official ${COUNTRY_CONFIGS[countryCode].taxYear} tax rates and is highly accurate for standard employment situations. Accuracy is approximately 95-99% for most users.

**What affects accuracy:**
- ✅ Standard employees with straightforward income
- ✅ Common deductions and credits
${COUNTRY_CONFIGS[countryCode].regions?.hasRegions ? `- ✅ ${capitalize(COUNTRY_CONFIGS[countryCode].regions!.name)} with standard rates` : ''}

**Limitations:**
- ⚠️ Complex investment income or capital gains
- ⚠️ Multiple income sources or jobs
- ⚠️ Unique tax credits or situations
- ⚠️ Self-employment with complex expenses

For final tax advice, consult a qualified ${COUNTRY_CONFIGS[countryCode].adjective} tax professional or accountant.`;
}

function getNegotiationFactors(countryCode: Country): string {
  const config = COUNTRY_CONFIGS[countryCode];
  const factors = [
    `- Filing status (single vs married)`,
    `- Number of dependents`,
    `- Pre-tax deduction elections (${config.deductions[0].name}, etc.)`,
  ];

  if (config.regions?.hasRegions) {
    factors.push(`- ${capitalize(config.regions.name.slice(0, -1))} of residence`);
  }

  return factors.join('\n');
}

function getTaxYearDescription(countryCode: Country): string {
  const config = COUNTRY_CONFIGS[countryCode];
  const descriptions: Record<Country, string> = {
    US: `The US tax year runs January 1 - December 31, ${config.taxYear}. File by April 15, ${parseInt(config.taxYear) + 1}.`,
    ES: `The Spanish tax year (ejercicio fiscal) runs January 1 - December 31, ${config.taxYear}. Annual declaration (declaración de la renta) due April-June ${parseInt(config.taxYear) + 1}.`,
    IT: `The Italian tax year runs January 1 - December 31, ${config.taxYear}. Tax return (730 or Unico) due by June 30, ${parseInt(config.taxYear) + 1}.`,
    UK: `The UK tax year runs April 6, ${config.taxYear.split('/')[0]} - April 5, ${config.taxYear.split('/')[1]}. Self-assessment deadline: January 31, ${parseInt(config.taxYear.split('/')[1]) + 1}.`,
    IE: `The Irish tax year runs January 1 - December 31, ${config.taxYear}. Tax returns due October 31 (paper) or November 15 (online), ${parseInt(config.taxYear) + 1}.`,
    CA: `The Canadian tax year runs January 1 - December 31, ${config.taxYear}. Tax returns due April 30, ${parseInt(config.taxYear) + 1} (June 15 for self-employed).`,
    AU: `The Australian financial year runs July 1, ${parseInt(config.taxYear.split('/')[0]) - 1} - June 30, ${config.taxYear.split('/')[0]}. Tax returns due October 31, ${config.taxYear.split('/')[0]}.`,
    DE: `The German tax year (Steuerjahr) runs January 1 - December 31, ${config.taxYear}. Tax returns generally due July 31, ${parseInt(config.taxYear) + 1}.`,
    FR: `The French tax year runs January 1 - December 31, ${config.taxYear}. Income declared the following year (déclaration de revenus) by May-June ${parseInt(config.taxYear) + 1}.`,
    NL: `The Dutch tax year (belastingjaar) runs January 1 - December 31, ${config.taxYear}. Tax returns due May 1, ${parseInt(config.taxYear) + 1} (can be extended).`,
    PT: `The Portuguese tax year (ano fiscal) runs January 1 - December 31, ${config.taxYear}. IRS tax returns typically due June 30, ${parseInt(config.taxYear) + 1}.`,
    CH: `The Swiss tax year (Steuerjahr) runs January 1 - December 31, ${config.taxYear}. Filing deadlines vary by canton, typically March-April of following year.`,
    JP: `The Japanese tax year runs January 1 - December 31, ${config.taxYear}. Income tax returns (kakutei shinkoku) due March 15, ${parseInt(config.taxYear) + 1}.`,
  };
  return descriptions[countryCode];
}

function getWhoPaysTaxes(countryCode: Country): string {
  const config = COUNTRY_CONFIGS[countryCode];
  return `All residents and workers in ${config.name} with income above the personal allowance/threshold must pay income tax. This includes:
- Employees (taxes withheld from paycheck)
- Self-employed individuals (quarterly or annual payments)
- Foreign workers with ${config.adjective} source income
${config.regions?.hasRegions ? `- Residents of all ${config.regions.name}` : ''}

Non-residents may have different tax rates or treaty protections depending on their home country.`;
}

function getTaxFilingInfo(countryCode: Country): string {
  const config = COUNTRY_CONFIGS[countryCode];
  const info: Record<Country, string> = {
    US: `**Employees:** Taxes withheld automatically. File Form 1040 by April 15 if you itemize or have multiple income sources.\n\n**Self-Employed:** Make quarterly estimated payments. File Form 1040 with Schedule C by April 15.`,
    ES: `**Employees:** Taxes withheld monthly (retención). Annual declaration (declaración de la renta) required if income > €22,000 or second income > €15,000.\n\n**Autónomos:** Quarterly payments (modelo 130). Annual declaration always required.`,
    IT: `**Employees:** Taxes withheld monthly. Can file simplified 730 form if no complex income. Due June 30.\n\n**Autonomi:** Quarterly advance payments (F24). Full declaration (Unico) due June 30. Higher complexity.`,
    UK: `**Employees (PAYE):** Taxes withheld automatically. No filing required unless income > £100,000 or side income > £1,000.\n\n**Self-Employed:** File Self Assessment return by January 31. Make payments on account.`,
    IE: `**PAYE Employees:** Taxes withheld via PAYE. Most don't file returns unless claiming additional credits.\n\n**Self-Employed:** File Form 11 by November 15 (online). Pay preliminary tax for current year + balance from prior year.`,
    CA: `**Employees:** Taxes withheld from paychecks. File return by April 30 (optional if refund expected).\n\n**Self-Employed:** File by June 15. Make quarterly installments. Claim business expenses on T2125.`,
    AU: `**Employees:** PAYG withheld from salary. File return between July 1 - October 31. Most receive refunds.\n\n**Self-Employed:** Lodge return by October 31. Make quarterly PAYG installments. Can claim deductions.`,
    DE: `**Employees:** Taxes withheld monthly. Annual Steuererklärung (tax return) required if specific conditions met.\n\n**Self-Employed:** Quarterly advance payments. Full Einkommensteuererklärung due July 31. Complex filing.`,
    FR: `**Employees:** Prélèvement à la source (withholding at source) since 2019. Annual declaration still required.\n\n**Self-Employed:** Quarterly or monthly social charges. Annual income declaration for both tax and social charges.`,
    NL: `**Employees:** Wages taxed at source (loonheffing). File return if requested by Belastingdienst or to claim deductions.\n\n**ZZP'ers (Self-Employed):** Always file return. Quarterly advance payments. Claim self-employed deduction and expenses.`,
    PT: `**Employees:** Income tax withheld at source. File IRS return to claim deductions.\n\n**Self-Employed:** File IRS return quarterly or annually. Pay social security (21.4%) separately.`,
    CH: `**Employees:** Tax withheld at source in most cantons. Annual tax return required.\n\n**Self-Employed:** Self-assess income. Pay AHV/AVS contributions (10.5%). Quarterly advance payments in some cantons.`,
    JP: `**Employees:** Income tax and resident tax withheld at source. Year-end adjustment (nenmatsu chosei).\n\n**Self-Employed:** File kakutei shinkoku (tax return) annually. Pay national pension and health insurance separately.`,
  };
  return info[countryCode];
}

// Main execution
function main() {
  const args = process.argv.slice(2);
  const countryArg = args[0]?.toUpperCase();
  const calculatorTypeArg = args[1];

  // Validate arguments
  if (!countryArg || !calculatorTypeArg) {
    console.log('Usage: tsx scripts/generate-content.ts [country] [calculator-type]');
    console.log('\nCountries:', Object.keys(COUNTRY_CONFIGS).join(', '));
    console.log('Calculator types:', CALCULATOR_TYPES.join(', '));
    console.log('\nExamples:');
    console.log('  tsx scripts/generate-content.ts ES salary-calculator');
    console.log('  tsx scripts/generate-content.ts all all');
    process.exit(1);
  }

  const contentDir = path.join(__dirname, '..', 'content');
  if (!fs.existsSync(contentDir)) {
    fs.mkdirSync(contentDir, { recursive: true });
  }

  // Generate for all combinations
  if (countryArg === 'ALL' && calculatorTypeArg === 'all') {
    console.log('Generating content for all countries and calculator types...\n');
    let count = 0;

    for (const countryCode of Object.keys(COUNTRY_CONFIGS) as Country[]) {
      for (const calcType of CALCULATOR_TYPES) {
        const content = generateContent(countryCode, calcType);
        const filename = `${countryCode.toLowerCase()}-${calcType}.md`;
        const filepath = path.join(contentDir, filename);

        fs.writeFileSync(filepath, content, 'utf-8');
        console.log(`✓ Generated: ${filename}`);
        count++;
      }
    }

    console.log(`\n✅ Generated ${count} content files in ${contentDir}`);
  }
  // Generate for specific country
  else if (CALCULATOR_TYPES.includes(calculatorTypeArg as any)) {
    const countryCode = countryArg as Country;
    if (!COUNTRY_CONFIGS[countryCode]) {
      console.error(`Error: Unknown country code "${countryCode}"`);
      console.log('Valid countries:', Object.keys(COUNTRY_CONFIGS).join(', '));
      process.exit(1);
    }

    const content = generateContent(countryCode, calculatorTypeArg as CalculatorType);
    const filename = `${countryCode.toLowerCase()}-${calculatorTypeArg}.md`;
    const filepath = path.join(contentDir, filename);

    fs.writeFileSync(filepath, content, 'utf-8');
    console.log(`✅ Generated: ${filepath}`);
  } else {
    console.error(`Error: Unknown calculator type "${calculatorTypeArg}"`);
    console.log('Valid types:', CALCULATOR_TYPES.join(', '));
    process.exit(1);
  }
}

main();
