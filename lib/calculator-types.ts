// Calculator Types and Categories

export type CalculatorType =
  // Salary Calculators
  | 'salary-calculator'
  | 'gross-to-net-salary-calculator'
  | 'net-to-gross-salary-calculator'
  | 'salary-after-tax-calculator'
  | 'take-home-pay-calculator'
  // Hourly & Time-Based
  | 'hourly-to-salary-calculator'
  | 'hourly-rate-calculator'
  | 'weekly-to-salary-calculator'
  | 'monthly-to-salary-calculator'
  | 'daily-to-salary-calculator'
  // Overtime & Bonus
  | 'overtime-pay-calculator'
  | 'bonus-tax-calculator'
  | 'commission-calculator'
  // Contractor / Freelancer
  | 'contractor-salary-calculator'
  | 'freelancer-income-calculator'
  | 'self-employed-tax-calculator';

export type CalculatorCategory =
  | 'salary'
  | 'hourly-time'
  | 'overtime-bonus'
  | 'contractor-freelancer';

export interface CalculatorInfo {
  type: CalculatorType;
  name: string;
  slug: string;
  description: string;
  category: CalculatorCategory;
  icon: string;
  keywords: string[];
}

export interface CategoryInfo {
  id: CalculatorCategory;
  name: string;
  description: string;
  icon: string;
  order: number;
}

// Category definitions
export const CALCULATOR_CATEGORIES: Record<CalculatorCategory, CategoryInfo> = {
  'salary': {
    id: 'salary',
    name: 'Salary Calculators',
    description: 'Calculate your net salary, take-home pay, and taxes',
    icon: '💰',
    order: 1
  },
  'hourly-time': {
    id: 'hourly-time',
    name: 'Hourly & Time-Based',
    description: 'Convert between hourly, weekly, monthly rates and annual salary',
    icon: '⏰',
    order: 2
  },
  'overtime-bonus': {
    id: 'overtime-bonus',
    name: 'Overtime & Bonus',
    description: 'Calculate overtime pay, bonus taxes, and commission',
    icon: '💸',
    order: 3
  },
  'contractor-freelancer': {
    id: 'contractor-freelancer',
    name: 'Contractor / Freelancer',
    description: 'Tax and income calculators for self-employed professionals',
    icon: '💼',
    order: 4
  }
};

// All calculator definitions
export const CALCULATORS: Record<CalculatorType, CalculatorInfo> = {
  // 1️⃣ SALARY CALCULATORS
  'salary-calculator': {
    type: 'salary-calculator',
    name: 'Salary Calculator',
    slug: 'salary-calculator',
    description: 'Calculate your salary with taxes and deductions',
    category: 'salary',
    icon: '💰',
    keywords: ['salary', 'income', 'tax', 'calculator']
  },
  'gross-to-net-salary-calculator': {
    type: 'gross-to-net-salary-calculator',
    name: 'Gross to Net Salary',
    slug: 'gross-to-net-salary-calculator',
    description: 'Calculate net salary from gross income after tax and deductions',
    category: 'salary',
    icon: '📊',
    keywords: ['gross', 'net', 'salary', 'tax', 'deductions']
  },
  'net-to-gross-salary-calculator': {
    type: 'net-to-gross-salary-calculator',
    name: 'Net to Gross Salary',
    slug: 'net-to-gross-salary-calculator',
    description: 'Calculate gross salary needed to achieve desired net income',
    category: 'salary',
    icon: '📈',
    keywords: ['net', 'gross', 'reverse', 'salary']
  },
  'salary-after-tax-calculator': {
    type: 'salary-after-tax-calculator',
    name: 'Salary After Tax',
    slug: 'salary-after-tax-calculator',
    description: 'See exactly how much you keep after all taxes',
    category: 'salary',
    icon: '💵',
    keywords: ['after tax', 'net', 'take home']
  },
  'take-home-pay-calculator': {
    type: 'take-home-pay-calculator',
    name: 'Take Home Pay',
    slug: 'take-home-pay-calculator',
    description: 'Calculate your actual take-home pay after all deductions',
    category: 'salary',
    icon: '🏠',
    keywords: ['take home', 'net pay', 'actual income']
  },

  // 2️⃣ HOURLY & TIME-BASED
  'hourly-to-salary-calculator': {
    type: 'hourly-to-salary-calculator',
    name: 'Hourly to Salary',
    slug: 'hourly-to-salary-calculator',
    description: 'Convert hourly rate to annual salary',
    category: 'hourly-time',
    icon: '⏰',
    keywords: ['hourly', 'salary', 'annual', 'conversion']
  },
  'hourly-rate-calculator': {
    type: 'hourly-rate-calculator',
    name: 'Hourly Rate Calculator',
    slug: 'hourly-rate-calculator',
    description: 'Calculate your hourly rate from annual salary',
    category: 'hourly-time',
    icon: '⏱️',
    keywords: ['hourly rate', 'salary', 'per hour']
  },
  'weekly-to-salary-calculator': {
    type: 'weekly-to-salary-calculator',
    name: 'Weekly to Salary',
    slug: 'weekly-to-salary-calculator',
    description: 'Convert weekly pay to annual salary',
    category: 'hourly-time',
    icon: '📅',
    keywords: ['weekly', 'salary', 'annual']
  },
  'monthly-to-salary-calculator': {
    type: 'monthly-to-salary-calculator',
    name: 'Monthly to Salary',
    slug: 'monthly-to-salary-calculator',
    description: 'Convert monthly pay to annual salary',
    category: 'hourly-time',
    icon: '📆',
    keywords: ['monthly', 'salary', 'annual']
  },
  'daily-to-salary-calculator': {
    type: 'daily-to-salary-calculator',
    name: 'Daily Rate to Salary',
    slug: 'daily-to-salary-calculator',
    description: 'Convert daily rate to annual salary',
    category: 'hourly-time',
    icon: '🌅',
    keywords: ['daily', 'day rate', 'salary']
  },

  // 3️⃣ OVERTIME & BONUS
  'overtime-pay-calculator': {
    type: 'overtime-pay-calculator',
    name: 'Overtime Pay Calculator',
    slug: 'overtime-pay-calculator',
    description: 'Calculate overtime pay with time-and-a-half or double-time rates',
    category: 'overtime-bonus',
    icon: '⏰',
    keywords: ['overtime', 'extra hours', 'time and half']
  },
  'bonus-tax-calculator': {
    type: 'bonus-tax-calculator',
    name: 'Bonus Tax Calculator',
    slug: 'bonus-tax-calculator',
    description: 'Calculate taxes on bonuses and one-time payments',
    category: 'overtime-bonus',
    icon: '🎁',
    keywords: ['bonus', 'tax', 'one-time payment']
  },
  'commission-calculator': {
    type: 'commission-calculator',
    name: 'Commission Calculator',
    slug: 'commission-calculator',
    description: 'Calculate commission earnings and taxes',
    category: 'overtime-bonus',
    icon: '💸',
    keywords: ['commission', 'sales', 'earnings']
  },

  // 4️⃣ CONTRACTOR / FREELANCER
  'contractor-salary-calculator': {
    type: 'contractor-salary-calculator',
    name: 'Contractor Salary Calculator',
    slug: 'contractor-salary-calculator',
    description: 'Calculate contractor income with self-employment taxes',
    category: 'contractor-freelancer',
    icon: '💼',
    keywords: ['contractor', 'self employed', 'freelance']
  },
  'freelancer-income-calculator': {
    type: 'freelancer-income-calculator',
    name: 'Freelancer Income Calculator',
    slug: 'freelancer-income-calculator',
    description: 'Calculate freelance income after taxes and expenses',
    category: 'contractor-freelancer',
    icon: '👨‍💻',
    keywords: ['freelancer', 'income', 'self employed']
  },
  'self-employed-tax-calculator': {
    type: 'self-employed-tax-calculator',
    name: 'Self-Employed Tax Calculator',
    slug: 'self-employed-tax-calculator',
    description: 'Calculate self-employment taxes and deductions',
    category: 'contractor-freelancer',
    icon: '📋',
    keywords: ['self employed', 'tax', '1099', 'freelance']
  }
};

// Helper functions
export function getCalculatorsByCategory(category: CalculatorCategory): CalculatorInfo[] {
  return Object.values(CALCULATORS).filter(calc => calc.category === category);
}

export function getAllCategories(): CategoryInfo[] {
  return Object.values(CALCULATOR_CATEGORIES).sort((a, b) => a.order - b.order);
}

export function getCalculatorInfo(type: CalculatorType): CalculatorInfo {
  return CALCULATORS[type];
}

export function getCalculatorBySlug(slug: string): CalculatorInfo | undefined {
  return Object.values(CALCULATORS).find(calc => calc.slug === slug);
}
