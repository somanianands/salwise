// Contractor / Self-Employed Tax Calculator
import { SalaryCalculation, TaxBreakdown, Country } from '../types';
import { calculateGrossToNet, CalculatorOptions } from './index';

export interface ContractorOptions {
  grossIncome: number;
  businessExpenses: number;
}

// Self-employment tax rates by country
const SELF_EMPLOYMENT_RATES: Record<Country, { rate: number; name: string; description: string }> = {
  US: { rate: 0.153, name: 'Self-Employment Tax', description: '15.3% (Social Security 12.4% + Medicare 2.9%)' },
  UK: { rate: 0.09, name: 'Class 2 & 4 NI', description: '9% on profits over £12,570' },
  IE: { rate: 0.04, name: 'PRSI Class S', description: '4% on income over €5,000' },
  CA: { rate: 0.107, name: 'CPP & EI', description: '10.7% (CPP 10.5% + EI 0.2%)' },
  AU: { rate: 0, name: 'No additional SE tax', description: 'Same tax rates as employees' },
  DE: { rate: 0.19, name: 'Selbstständige', description: '~19% social security' },
  FR: { rate: 0.22, name: 'Cotisations sociales', description: '~22% social contributions' },
  NL: { rate: 0, name: 'No additional SE tax', description: 'Same tax rates apply' },
  ES: { rate: 0.30, name: 'Autónomo', description: '~30% flat rate quota' },
  IT: { rate: 0.26, name: 'INPS', description: '~26% social security' },
  PT: { rate: 0.214, name: 'Trabalhadores Independentes', description: '21.4% social security for self-employed' },
  CH: { rate: 0.105, name: 'Self-Employed AVS/AI', description: '~10.5% pension & disability insurance' },
  JP: { rate: 0.15, name: 'National Pension & Health', description: '~15% social insurance for self-employed' }
};

export function calculateContractorIncome(
  options: ContractorOptions,
  country: Country,
  calculatorOptions: CalculatorOptions = {}
): SalaryCalculation & { contractorBreakdown: { grossIncome: number; businessExpenses: number; netBusinessIncome: number; selfEmploymentTax: number; selfEmploymentRate: number } } {
  const { grossIncome, businessExpenses } = options;

  // Calculate net business income after expenses
  const netBusinessIncome = Math.max(0, grossIncome - businessExpenses);

  // Get self-employment tax rate for this country
  const seInfo = SELF_EMPLOYMENT_RATES[country];
  const selfEmploymentTax = netBusinessIncome * seInfo.rate;

  // For tax calculation purposes, use net business income
  // Self-employment tax is deductible in some countries (like US), but for simplicity we'll calculate on net income
  const taxableIncome = netBusinessIncome;

  // Calculate regular income tax on taxable income
  const taxCalculation = calculateGrossToNet(country, taxableIncome, calculatorOptions);

  // Add self-employment tax to the breakdown
  const updatedBreakdown: TaxBreakdown[] = [
    ...taxCalculation.breakdown.filter(b => b.label !== 'Net Salary'),
    {
      label: seInfo.name,
      amount: selfEmploymentTax,
      rate: (selfEmploymentTax / grossIncome) * 100,
      color: '#f59e0b'
    },
    {
      label: 'Net Income',
      amount: Math.max(0, taxCalculation.netSalary - selfEmploymentTax),
      rate: ((taxCalculation.netSalary - selfEmploymentTax) / grossIncome) * 100,
      color: '#10b981'
    }
  ];

  return {
    grossSalary: grossIncome,
    netSalary: Math.max(0, taxCalculation.netSalary - selfEmploymentTax),
    totalTax: taxCalculation.totalTax + selfEmploymentTax,
    socialSecurity: taxCalculation.socialSecurity + selfEmploymentTax,
    otherDeductions: businessExpenses,
    effectiveTaxRate: ((taxCalculation.totalTax + selfEmploymentTax + taxCalculation.socialSecurity) / grossIncome) * 100,
    breakdown: updatedBreakdown,
    contractorBreakdown: {
      grossIncome,
      businessExpenses,
      netBusinessIncome,
      selfEmploymentTax,
      selfEmploymentRate: seInfo.rate
    }
  };
}
