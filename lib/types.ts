// Core types for salary calculations

export type Country = 'US' | 'UK' | 'IE' | 'CA' | 'AU' | 'DE' | 'FR' | 'NL' | 'ES' | 'IT' | 'PT' | 'CH' | 'JP';

export interface CountryInfo {
  code: Country;
  name: string;
  currency: string;
  currencySymbol: string;
  taxYear: string;
  flag: string;
}

export interface TaxBracket {
  min: number;
  max: number | null;
  rate: number;
  label: string;
}

export interface SalaryCalculation {
  grossSalary: number;
  netSalary: number;
  totalTax: number;
  socialSecurity: number;
  otherDeductions: number;
  effectiveTaxRate: number;
  breakdown: TaxBreakdown[];
}

export interface TaxBreakdown {
  label: string;
  amount: number;
  rate?: number;
  color: string;
}

export interface CalculatorInput {
  grossSalary?: number;
  netSalary?: number;
  country: Country;
  frequency: 'annual' | 'monthly' | 'hourly';
  hoursPerWeek?: number;
}

export const COUNTRIES: Record<Country, CountryInfo> = {
  US: {
    code: 'US',
    name: 'United States',
    currency: 'USD',
    currencySymbol: '$',
    taxYear: '2026',
    flag: '🇺🇸'
  },
  UK: {
    code: 'UK',
    name: 'United Kingdom',
    currency: 'GBP',
    currencySymbol: '£',
    taxYear: '2026/2027',
    flag: '🇬🇧'
  },
  IE: {
    code: 'IE',
    name: 'Ireland',
    currency: 'EUR',
    currencySymbol: '€',
    taxYear: '2026',
    flag: '🇮🇪'
  },
  CA: {
    code: 'CA',
    name: 'Canada',
    currency: 'CAD',
    currencySymbol: '$',
    taxYear: '2026',
    flag: '🇨🇦'
  },
  AU: {
    code: 'AU',
    name: 'Australia',
    currency: 'AUD',
    currencySymbol: '$',
    taxYear: '2026/2027',
    flag: '🇦🇺'
  },
  DE: {
    code: 'DE',
    name: 'Germany',
    currency: 'EUR',
    currencySymbol: '€',
    taxYear: '2026',
    flag: '🇩🇪'
  },
  FR: {
    code: 'FR',
    name: 'France',
    currency: 'EUR',
    currencySymbol: '€',
    taxYear: '2026',
    flag: '🇫🇷'
  },
  NL: {
    code: 'NL',
    name: 'Netherlands',
    currency: 'EUR',
    currencySymbol: '€',
    taxYear: '2026',
    flag: '🇳🇱'
  },
  ES: {
    code: 'ES',
    name: 'Spain',
    currency: 'EUR',
    currencySymbol: '€',
    taxYear: '2026',
    flag: '🇪🇸'
  },
  IT: {
    code: 'IT',
    name: 'Italy',
    currency: 'EUR',
    currencySymbol: '€',
    taxYear: '2026',
    flag: '🇮🇹'
  },
  PT: {
    code: 'PT',
    name: 'Portugal',
    currency: 'EUR',
    currencySymbol: '€',
    taxYear: '2026',
    flag: '🇵🇹'
  },
  CH: {
    code: 'CH',
    name: 'Switzerland',
    currency: 'CHF',
    currencySymbol: 'CHF',
    taxYear: '2026',
    flag: '🇨🇭'
  },
  JP: {
    code: 'JP',
    name: 'Japan',
    currency: 'JPY',
    currencySymbol: '¥',
    taxYear: '2026',
    flag: '🇯🇵'
  }
};
