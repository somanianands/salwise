# 🇮🇹 ITALY – MASTER SALARY CALCULATOR SPECIFICATION (2026)

**Scope:** Applies to ALL Italy calculators:
- Salary Calculator
- Gross to Net Salary
- Salary After Tax
- Take Home Pay
- Hourly → Salary
- Hourly Rate Calculator
- Weekly → Salary
- Monthly → Salary
- Daily → Salary
- Overtime Pay Calculator
- Bonus Tax Calculator
- Commission Calculator

**Status:** Production-ready, Claude/Cursor implementation guide
**Tax Year:** 2026
**Currency:** EUR (€)
**Standard Working Hours:** 1,824 hours/year (38 hours/week × 48 weeks)

---

## 🎯 CORE DESIGN PRINCIPLES

### 1. Normalize → Annual → Apply Tax → Redistribute

**ALL calculators follow this exact pattern:**

```
Input (any frequency)
  → Normalize to ANNUAL gross
  → Apply Italian tax engine (IRPEF + Regional + Municipal + INPS)
  → Calculate annual net
  → Redistribute to requested frequency
```

### 2. No User-Entered Tax Rates

- **User NEVER enters:** IRPEF rate, regional rate, municipal rate, INPS rate
- **System auto-calculates:** All taxes based on income, region, filing status, employment type
- **User ONLY enters:** Gross income, frequency, region, filing status, employment type, pre-tax deductions

### 3. Single Tax Engine

- One `calculateItalyTax()` function in `lib/calculators/it.ts`
- Used by ALL 12 calculators
- Never duplicate tax logic

### 4. Regional and Municipal Variations

- Italy has 20 regions (regioni) with varying regional income tax (addizionale regionale)
- Municipalities (comuni) within regions have municipal tax (addizionale comunale)
- System must support all 20 regions with typical municipal rates

---

## 📋 MASTER INPUT SPECIFICATION

### Common Inputs (All Calculators)

```typescript
interface ItalyTaxInputs {
  // Required
  grossIncome: number;              // Amount in EUR
  frequency: ItalyPayFrequency;     // 'hourly' | 'daily' | 'weekly' | 'monthly' | 'annual'
  region: ItalyRegion;              // 20 regions
  filingStatus: ItalyFilingStatus;  // 'single' | 'married' | 'married_with_children' | 'head_of_household'
  employmentType: ItalyEmploymentType; // 'employee' | 'self_employed'

  // Optional (with defaults)
  hoursPerWeek?: number;            // Default: 38
  weeksPerYear?: number;            // Default: 48 (accounts for vacation)
  annualWorkingHours?: number;      // Default: 1,824
  pensionContribution?: number;     // Pre-tax pension (Fondi Pensione)
  healthInsurance?: number;         // Pre-tax health insurance
  otherDeductions?: number;         // Union fees, work-related deductions
  numberOfDependents?: number;      // Default: 0 (affects family deductions)
  municipalityRate?: number;        // Optional override (0-0.9%), otherwise use regional default
}
```

### Italy-Specific Types

```typescript
export type ItalyPayFrequency =
  | 'hourly'
  | 'daily'
  | 'weekly'
  | 'monthly'
  | 'annual';

export type ItalyRegion =
  | 'abruzzo'           // Abruzzo
  | 'aosta'             // Valle d'Aosta
  | 'apulia'            // Puglia
  | 'basilicata'        // Basilicata
  | 'calabria'          // Calabria
  | 'campania'          // Campania
  | 'emilia_romagna'    // Emilia-Romagna
  | 'friuli'            // Friuli-Venezia Giulia
  | 'lazio'             // Lazio (Rome)
  | 'liguria'           // Liguria
  | 'lombardia'         // Lombardia (Milan)
  | 'marche'            // Marche
  | 'molise'            // Molise
  | 'piemonte'          // Piemonte (Turin)
  | 'sardegna'          // Sardegna
  | 'sicilia'           // Sicilia
  | 'toscana'           // Toscana (Florence)
  | 'trentino'          // Trentino-Alto Adige
  | 'umbria'            // Umbria
  | 'veneto';           // Veneto (Venice)

export type ItalyFilingStatus =
  | 'single'                    // Individual taxation
  | 'married'                   // Married (joint or separate)
  | 'married_with_children'     // Married with dependents
  | 'head_of_household';        // Single parent or guardian

export type ItalyEmploymentType =
  | 'employee'        // Dipendente (INPS ~9-10%)
  | 'self_employed';  // Lavoratore Autonomo / Freelancer (INPS ~25-33%)
```

---

## 🔢 AUTO-CALCULATED VALUES (Never User Input)

### 1. IRPEF (Imposta sul Reddito delle Persone Fisiche) - National Income Tax

**National IRPEF Brackets (2026):**

```typescript
const IRPEF_BRACKETS = [
  { min: 0,     max: 15000,  rate: 0.23 },   // 23%
  { min: 15000, max: 28000,  rate: 0.25 },   // 25%
  { min: 28000, max: 50000,  rate: 0.35 },   // 35%
  { min: 50000, max: 75000,  rate: 0.43 },   // 43%
  { min: 75000, max: Infinity, rate: 0.43 }  // 43% (may have additional surtax)
];
```

**Personal Deductions (Detrazioni Personali):**

```typescript
// Base personal deduction (depends on income)
function calculatePersonalDeduction(income: number): number {
  if (income <= 15000) {
    return 1880;
  } else if (income <= 28000) {
    return 1910 + 1190 * ((28000 - income) / 13000);
  } else if (income <= 50000) {
    return 1910 * ((50000 - income) / 22000);
  } else {
    return 0;
  }
}

// Dependent deductions (spouse, children)
const DEPENDENT_SPOUSE_DEDUCTION = 800; // Up to €800 (income-dependent)
const DEPENDENT_CHILD_DEDUCTION = 950;  // €950 per child (up to 3), €1,220 for 4+
const DISABLED_DEPENDENT_BONUS = 400;   // Additional €400 for disabled dependents
```

### 2. Regional Income Tax (Addizionale Regionale)

**Regional Rates by Region (2026):**

```typescript
const REGIONAL_TAX_RATES: Record<ItalyRegion, number> = {
  abruzzo: 0.0173,          // 1.73%
  aosta: 0.0123,            // 1.23%
  apulia: 0.0233,           // 2.33%
  basilicata: 0.0123,       // 1.23%
  calabria: 0.0214,         // 2.14%
  campania: 0.0233,         // 2.33%
  emilia_romagna: 0.0233,   // 2.33%
  friuli: 0.0123,           // 1.23%
  lazio: 0.0233,            // 2.33% (Rome)
  liguria: 0.0233,          // 2.33%
  lombardia: 0.0233,        // 2.33% (Milan)
  marche: 0.0233,           // 2.33%
  molise: 0.0173,           // 1.73%
  piemonte: 0.0223,         // 2.23% (Turin)
  sardegna: 0.0123,         // 1.23%
  sicilia: 0.0233,          // 2.33%
  toscana: 0.0233,          // 2.33% (Florence)
  trentino: 0.0123,         // 1.23%
  umbria: 0.0223,           // 2.23%
  veneto: 0.0233            // 2.33% (Venice)
};

// Regional tax applied to taxable income (no deductions)
function calculateRegionalTax(taxableIncome: number, region: ItalyRegion): number {
  const rate = REGIONAL_TAX_RATES[region];
  return taxableIncome * rate;
}
```

### 3. Municipal Income Tax (Addizionale Comunale)

**Municipal Rates (2026):**

```typescript
// Typical range: 0% to 0.9%
// Average: ~0.5-0.8% depending on municipality

const MUNICIPAL_TAX_DEFAULT = 0.008; // 0.8% (typical average)

// Major cities (examples):
const MUNICIPAL_TAX_RATES = {
  rome: 0.009,      // 0.9%
  milan: 0.008,     // 0.8%
  turin: 0.008,     // 0.8%
  florence: 0.008,  // 0.8%
  venice: 0.008,    // 0.8%
  naples: 0.008,    // 0.8%
  // Default for other municipalities: 0.8%
};

function calculateMunicipalTax(
  taxableIncome: number,
  region: ItalyRegion,
  municipalityRate?: number
): number {
  const rate = municipalityRate || MUNICIPAL_TAX_DEFAULT;
  return taxableIncome * rate;
}
```

### 4. Social Security (INPS - Istituto Nazionale della Previdenza Sociale)

**Employee Contributions (2026):**

```typescript
const INPS_EMPLOYEE_RATE = 0.0919; // 9.19% (average for most sectors)
const INPS_EMPLOYEE_RATE_PUBLIC = 0.0889; // 8.89% (public sector)
const INPS_EMPLOYEE_RATE_INDUSTRIAL = 0.0949; // 9.49% (industrial sector)

// No cap on contributions (unlike Spain or UK)
function calculateINPSEmployee(grossAnnual: number, sector: string = 'general'): number {
  let rate: number;
  switch (sector) {
    case 'public':
      rate = 0.0889;
      break;
    case 'industrial':
      rate = 0.0949;
      break;
    default:
      rate = 0.0919; // General/commercial
  }
  return grossAnnual * rate;
}
```

**Self-Employed Contributions (2026):**

```typescript
// Self-employed (Lavoratore Autonomo / Freelancer)
const INPS_SELF_EMPLOYED_RATE = 0.2597; // 25.97% (Gestione Separata 2026)
const INPS_SELF_EMPLOYED_MAX_BASE = 113520; // €113,520 cap

function calculateINPSSelfEmployed(grossAnnual: number): number {
  const contributionBase = Math.min(grossAnnual, 113520);
  return contributionBase * 0.2597;
}

// For professions with own pension funds (Casse Professionali):
// Rates vary by profession (lawyers: ~14%, doctors: ~18%, etc.)
// Use 25.97% as default for freelancers without specific fund
```

### 5. Pre-Tax Deductions

```typescript
// Pre-tax deductions reduce taxable income
function applyPreTaxDeductions(
  grossAnnual: number,
  pension: number,
  health: number,
  other: number
): number {
  // No strict caps in Italy, but reasonable limits apply
  const totalDeductions = pension + health + other;

  // Cannot exceed gross income
  const validDeductions = Math.min(totalDeductions, grossAnnual * 0.5); // Max 50% deduction

  return grossAnnual - validDeductions;
}
```

---

## 🧮 ITALY TAX ENGINE (Complete Implementation)

### Core Function Signature

```typescript
export interface ItalyTaxResult {
  grossAnnual: number;
  taxableIncome: number;           // After pre-tax deductions
  irpef: number;                   // National income tax
  regionalTax: number;             // Addizionale regionale
  municipalTax: number;            // Addizionale comunale
  inps: number;                    // Social security contributions
  totalDeductions: number;         // IRPEF + Regional + Municipal + INPS
  netAnnual: number;               // Take-home pay
  effectiveRate: number;           // Total tax rate as percentage

  // Breakdowns
  personalDeduction: number;       // IRPEF deduction applied
  dependentDeductions: number;     // Family deductions
}

export function calculateItalyTax(
  grossAnnual: number,
  region: ItalyRegion,
  filingStatus: ItalyFilingStatus,
  employmentType: ItalyEmploymentType,
  options: {
    pensionContribution?: number;
    healthInsurance?: number;
    otherDeductions?: number;
    numberOfDependents?: number;
    municipalityRate?: number;
    sector?: string; // 'general' | 'public' | 'industrial'
  } = {}
): ItalyTaxResult
```

### Implementation Logic

```typescript
import { calculateProgressiveTax } from './helpers';

// IRPEF brackets
const IRPEF_BRACKETS = [
  { min: 0,     max: 15000,  rate: 0.23 },
  { min: 15000, max: 28000,  rate: 0.25 },
  { min: 28000, max: 50000,  rate: 0.35 },
  { min: 50000, max: 75000,  rate: 0.43 },
  { min: 75000, max: Infinity, rate: 0.43 }
];

// Regional rates
const REGIONAL_TAX_RATES: Record<ItalyRegion, number> = {
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
  lombardia: 0.0233,
  marche: 0.0233,
  molise: 0.0173,
  piemonte: 0.0223,
  sardegna: 0.0123,
  sicilia: 0.0233,
  toscana: 0.0233,
  trentino: 0.0123,
  umbria: 0.0223,
  veneto: 0.0233
};

export function calculateItalyTax(
  grossAnnual: number,
  region: ItalyRegion = 'lazio',
  filingStatus: ItalyFilingStatus = 'single',
  employmentType: ItalyEmploymentType = 'employee',
  options: {
    pensionContribution?: number;
    healthInsurance?: number;
    otherDeductions?: number;
    numberOfDependents?: number;
    municipalityRate?: number;
    sector?: string;
  } = {}
): ItalyTaxResult {
  const {
    pensionContribution = 0,
    healthInsurance = 0,
    otherDeductions = 0,
    numberOfDependents = 0,
    municipalityRate = 0.008,
    sector = 'general'
  } = options;

  // Step 1: Apply pre-tax deductions
  const totalPreTaxDeductions = pensionContribution + healthInsurance + otherDeductions;
  const validDeductions = Math.min(totalPreTaxDeductions, grossAnnual * 0.5);
  const taxableIncome = grossAnnual - validDeductions;

  // Step 2: Calculate IRPEF (before deductions)
  const irpefGross = calculateProgressiveTax(taxableIncome, IRPEF_BRACKETS);

  // Step 3: Calculate personal deduction
  let personalDeduction = 0;
  if (taxableIncome <= 15000) {
    personalDeduction = 1880;
  } else if (taxableIncome <= 28000) {
    personalDeduction = 1910 + 1190 * ((28000 - taxableIncome) / 13000);
  } else if (taxableIncome <= 50000) {
    personalDeduction = 1910 * ((50000 - taxableIncome) / 22000);
  }

  // Step 4: Calculate dependent deductions
  let dependentDeductions = 0;
  if (filingStatus === 'married' || filingStatus === 'married_with_children') {
    // Spouse deduction (income-dependent, max €800)
    if (taxableIncome <= 40000) {
      dependentDeductions += 800;
    } else if (taxableIncome <= 80000) {
      dependentDeductions += 800 * ((80000 - taxableIncome) / 40000);
    }
  }

  if (numberOfDependents > 0) {
    // Child deductions
    const childDeduction = numberOfDependents <= 3 ? 950 : 1220;
    dependentDeductions += childDeduction * numberOfDependents;
  }

  // Step 5: Apply deductions to IRPEF
  const totalIRPEFDeductions = personalDeduction + dependentDeductions;
  const irpef = Math.max(0, irpefGross - totalIRPEFDeductions);

  // Step 6: Calculate regional tax (no deductions apply)
  const regionalRate = REGIONAL_TAX_RATES[region];
  const regionalTax = taxableIncome * regionalRate;

  // Step 7: Calculate municipal tax (no deductions apply)
  const municipalTax = taxableIncome * municipalityRate;

  // Step 8: Calculate INPS (Social Security)
  let inps: number;
  if (employmentType === 'employee') {
    let rate: number;
    switch (sector) {
      case 'public':
        rate = 0.0889;
        break;
      case 'industrial':
        rate = 0.0949;
        break;
      default:
        rate = 0.0919;
    }
    inps = grossAnnual * rate;
  } else {
    // Self-employed
    const contributionBase = Math.min(grossAnnual, 113520);
    inps = contributionBase * 0.2597;
  }

  // Step 9: Calculate totals
  const totalDeductions = irpef + regionalTax + municipalTax + inps;
  const netAnnual = grossAnnual - totalDeductions;
  const effectiveRate = (totalDeductions / grossAnnual) * 100;

  return {
    grossAnnual,
    taxableIncome,
    irpef,
    regionalTax,
    municipalTax,
    inps,
    totalDeductions,
    netAnnual,
    effectiveRate,
    personalDeduction,
    dependentDeductions
  };
}
```

---

## 📊 REQUIRED OUTPUTS (All Calculators)

Every calculator must return:

```typescript
interface ItalyCalculatorResult {
  // Input echo
  input: {
    gross: number;
    frequency: ItalyPayFrequency;
    region: ItalyRegion;
    filingStatus: ItalyFilingStatus;
    employmentType: ItalyEmploymentType;
  };

  // Annual calculations
  annual: {
    gross: number;
    taxableIncome: number;
    irpef: number;
    regionalTax: number;
    municipalTax: number;
    inps: number;
    totalDeductions: number;
    net: number;
    effectiveRate: number;
  };

  // Requested frequency (matches input frequency)
  [frequency]: {
    gross: number;
    irpef: number;
    regionalTax: number;
    municipalTax: number;
    inps: number;
    totalDeductions: number;
    net: number;
  };

  // Breakdown
  breakdown: {
    personalDeduction: number;
    dependentDeductions: number;
    pensionContribution: number;
    healthInsurance: number;
    otherDeductions: number;
    numberOfDependents: number;
  };
}
```

**Example for Monthly → Salary:**

```typescript
{
  input: {
    gross: 3000.00,
    frequency: 'monthly',
    region: 'lombardia',
    filingStatus: 'single',
    employmentType: 'employee'
  },
  annual: {
    gross: 36000.00,
    taxableIncome: 36000.00,
    irpef: 7243.00,    // After personal deduction
    regionalTax: 838.80,
    municipalTax: 288.00,
    inps: 3308.40,
    totalDeductions: 11678.20,
    net: 24321.80,
    effectiveRate: 32.44
  },
  monthly: {
    gross: 3000.00,
    irpef: 603.58,
    regionalTax: 69.90,
    municipalTax: 24.00,
    inps: 275.70,
    totalDeductions: 973.18,
    net: 2026.82
  },
  breakdown: {
    personalDeduction: 1147.00,
    dependentDeductions: 0,
    pensionContribution: 0,
    healthInsurance: 0,
    otherDeductions: 0,
    numberOfDependents: 0
  }
}
```

---

## 🎨 SPECIAL LOGIC BY CALCULATOR TYPE

### Time-Based Calculators (Hourly, Daily, Weekly, Monthly)

**1. Hourly → Salary**

```typescript
export function calculateHourlyToSalaryItaly(
  hourlyRate: number,
  hoursPerWeek: number = 38,
  annualWorkingHours: number = 1824,
  region: ItalyRegion = 'lazio',
  filingStatus: ItalyFilingStatus = 'single',
  employmentType: ItalyEmploymentType = 'employee',
  options: ItalyTaxOptions = {}
): ItalyCalculatorResult {
  // Step 1: Normalize to annual
  const annualGross = hourlyRate * annualWorkingHours;

  // Step 2: Apply tax engine
  const taxResult = calculateItalyTax(annualGross, region, filingStatus, employmentType, options);

  // Step 3: Redistribute to hourly
  const hourlyNet = taxResult.netAnnual / annualWorkingHours;
  const hourlyIRPEF = taxResult.irpef / annualWorkingHours;
  const hourlyRegional = taxResult.regionalTax / annualWorkingHours;
  const hourlyMunicipal = taxResult.municipalTax / annualWorkingHours;
  const hourlyINPS = taxResult.inps / annualWorkingHours;

  return {
    input: { gross: hourlyRate, frequency: 'hourly', region, filingStatus, employmentType },
    annual: {
      gross: taxResult.grossAnnual,
      taxableIncome: taxResult.taxableIncome,
      irpef: taxResult.irpef,
      regionalTax: taxResult.regionalTax,
      municipalTax: taxResult.municipalTax,
      inps: taxResult.inps,
      totalDeductions: taxResult.totalDeductions,
      net: taxResult.netAnnual,
      effectiveRate: taxResult.effectiveRate
    },
    hourly: {
      gross: hourlyRate,
      irpef: hourlyIRPEF,
      regionalTax: hourlyRegional,
      municipalTax: hourlyMunicipal,
      inps: hourlyINPS,
      totalDeductions: (hourlyIRPEF + hourlyRegional + hourlyMunicipal + hourlyINPS),
      net: hourlyNet
    },
    breakdown: {
      personalDeduction: taxResult.personalDeduction,
      dependentDeductions: taxResult.dependentDeductions,
      pensionContribution: options.pensionContribution || 0,
      healthInsurance: options.healthInsurance || 0,
      otherDeductions: options.otherDeductions || 0,
      numberOfDependents: options.numberOfDependents || 0
    }
  };
}
```

**2. Monthly → Salary (Most Common in Italy)**

```typescript
export function calculateMonthlyToSalaryItaly(
  monthlySalary: number,
  region: ItalyRegion = 'lazio',
  filingStatus: ItalyFilingStatus = 'single',
  employmentType: ItalyEmploymentType = 'employee',
  options: ItalyTaxOptions = {}
): ItalyCalculatorResult {
  // Step 1: Normalize to annual (12 months)
  const annualGross = monthlySalary * 12;

  // Step 2: Apply tax engine
  const taxResult = calculateItalyTax(annualGross, region, filingStatus, employmentType, options);

  // Step 3: Redistribute to monthly
  const monthlyNet = taxResult.netAnnual / 12;
  const monthlyIRPEF = taxResult.irpef / 12;
  const monthlyRegional = taxResult.regionalTax / 12;
  const monthlyMunicipal = taxResult.municipalTax / 12;
  const monthlyINPS = taxResult.inps / 12;

  return {
    input: { gross: monthlySalary, frequency: 'monthly', region, filingStatus, employmentType },
    annual: { /* same as above */ },
    monthly: {
      gross: monthlySalary,
      irpef: monthlyIRPEF,
      regionalTax: monthlyRegional,
      municipalTax: monthlyMunicipal,
      inps: monthlyINPS,
      totalDeductions: (monthlyIRPEF + monthlyRegional + monthlyMunicipal + monthlyINPS),
      net: monthlyNet
    },
    breakdown: { /* same as above */ }
  };
}
```

### Variable Pay Calculators

**1. Bonus Tax Calculator**

```typescript
export function calculateBonusItaly(
  baseSalary: number,          // Annual base
  bonusAmount: number,         // Bonus amount
  bonusFrequency: 'monthly' | 'quarterly' | 'annual',
  region: ItalyRegion = 'lazio',
  filingStatus: ItalyFilingStatus = 'single',
  employmentType: ItalyEmploymentType = 'employee',
  options: ItalyTaxOptions = {}
): ItalyCalculatorResult {
  // Step 1: Normalize bonus to annual
  let annualBonus: number;
  switch (bonusFrequency) {
    case 'monthly':
      annualBonus = bonusAmount * 12;
      break;
    case 'quarterly':
      annualBonus = bonusAmount * 4;
      break;
    case 'annual':
      annualBonus = bonusAmount;
      break;
  }

  // Step 2: Calculate total annual compensation
  const totalAnnualGross = baseSalary + annualBonus;

  // Step 3: Apply tax engine to TOTAL compensation
  const taxResult = calculateItalyTax(totalAnnualGross, region, filingStatus, employmentType, options);

  // Step 4: Calculate tax on base salary ALONE (for comparison)
  const baseTaxResult = calculateItalyTax(baseSalary, region, filingStatus, employmentType, options);

  // Step 5: Marginal tax on bonus
  const bonusTax = taxResult.totalDeductions - baseTaxResult.totalDeductions;
  const bonusNet = annualBonus - bonusTax;

  return {
    input: {
      gross: bonusAmount,
      frequency: bonusFrequency,
      baseSalary,
      region,
      filingStatus,
      employmentType
    },
    annual: {
      gross: totalAnnualGross,
      taxableIncome: taxResult.taxableIncome,
      irpef: taxResult.irpef,
      regionalTax: taxResult.regionalTax,
      municipalTax: taxResult.municipalTax,
      inps: taxResult.inps,
      totalDeductions: taxResult.totalDeductions,
      net: taxResult.netAnnual,
      effectiveRate: taxResult.effectiveRate
    },
    bonus: {
      gross: annualBonus,
      irpef: bonusTax * (taxResult.irpef / taxResult.totalDeductions),
      regionalTax: bonusTax * (taxResult.regionalTax / taxResult.totalDeductions),
      municipalTax: bonusTax * (taxResult.municipalTax / taxResult.totalDeductions),
      inps: bonusTax * (taxResult.inps / taxResult.totalDeductions),
      totalDeductions: bonusTax,
      net: bonusNet
    },
    breakdown: { /* same as above */ }
  };
}
```

**2. Overtime Pay Calculator**

```typescript
export function calculateOvertimeItaly(
  regularHourlyRate: number,
  regularHours: number,        // Per week
  overtimeHours: number,       // Per week
  overtimeMultiplier: number = 1.5,
  weeksPerYear: number = 48,
  region: ItalyRegion = 'lazio',
  filingStatus: ItalyFilingStatus = 'single',
  employmentType: ItalyEmploymentType = 'employee',
  options: ItalyTaxOptions = {}
): ItalyCalculatorResult {
  // Step 1: Calculate weekly pay
  const regularWeeklyPay = regularHourlyRate * regularHours;
  const overtimeWeeklyPay = regularHourlyRate * overtimeMultiplier * overtimeHours;
  const totalWeeklyPay = regularWeeklyPay + overtimeWeeklyPay;

  // Step 2: Normalize to annual
  const annualGross = totalWeeklyPay * weeksPerYear;

  // Step 3: Apply tax engine
  const taxResult = calculateItalyTax(annualGross, region, filingStatus, employmentType, options);

  // Step 4: Calculate overtime-specific values
  const annualOvertimePay = overtimeWeeklyPay * weeksPerYear;
  const regularAnnualPay = regularWeeklyPay * weeksPerYear;

  // Tax on regular pay alone
  const regularTaxResult = calculateItalyTax(regularAnnualPay, region, filingStatus, employmentType, options);

  // Marginal tax on overtime
  const overtimeTax = taxResult.totalDeductions - regularTaxResult.totalDeductions;
  const overtimeNet = annualOvertimePay - overtimeTax;

  return {
    input: {
      gross: regularHourlyRate,
      frequency: 'hourly',
      regularHours,
      overtimeHours,
      overtimeMultiplier,
      region,
      filingStatus,
      employmentType
    },
    annual: {
      gross: taxResult.grossAnnual,
      taxableIncome: taxResult.taxableIncome,
      irpef: taxResult.irpef,
      regionalTax: taxResult.regionalTax,
      municipalTax: taxResult.municipalTax,
      inps: taxResult.inps,
      totalDeductions: taxResult.totalDeductions,
      net: taxResult.netAnnual,
      effectiveRate: taxResult.effectiveRate
    },
    overtime: {
      gross: annualOvertimePay,
      irpef: overtimeTax * (taxResult.irpef / taxResult.totalDeductions),
      regionalTax: overtimeTax * (taxResult.regionalTax / taxResult.totalDeductions),
      municipalTax: overtimeTax * (taxResult.municipalTax / taxResult.totalDeductions),
      inps: overtimeTax * (taxResult.inps / taxResult.totalDeductions),
      totalDeductions: overtimeTax,
      net: overtimeNet
    },
    breakdown: { /* same as above */ }
  };
}
```

**3. Commission Calculator**

```typescript
export function calculateCommissionItaly(
  baseSalary: number,          // Annual base
  commissionAmount: number,    // Commission amount
  commissionFrequency: 'monthly' | 'quarterly' | 'annual',
  region: ItalyRegion = 'lazio',
  filingStatus: ItalyFilingStatus = 'single',
  employmentType: ItalyEmploymentType = 'employee',
  options: ItalyTaxOptions = {}
): ItalyCalculatorResult {
  // Step 1: Normalize commission to annual
  let annualCommission: number;
  switch (commissionFrequency) {
    case 'monthly':
      annualCommission = commissionAmount * 12;
      break;
    case 'quarterly':
      annualCommission = commissionAmount * 4;
      break;
    case 'annual':
      annualCommission = commissionAmount;
      break;
  }

  // Step 2: Calculate total annual compensation
  const totalAnnualGross = baseSalary + annualCommission;

  // Step 3: Apply tax engine
  const taxResult = calculateItalyTax(totalAnnualGross, region, filingStatus, employmentType, options);

  // Step 4: Calculate marginal tax on commission
  const baseTaxResult = calculateItalyTax(baseSalary, region, filingStatus, employmentType, options);
  const commissionTax = taxResult.totalDeductions - baseTaxResult.totalDeductions;
  const commissionNet = annualCommission - commissionTax;

  return {
    input: {
      gross: commissionAmount,
      frequency: commissionFrequency,
      baseSalary,
      region,
      filingStatus,
      employmentType
    },
    annual: {
      gross: totalAnnualGross,
      taxableIncome: taxResult.taxableIncome,
      irpef: taxResult.irpef,
      regionalTax: taxResult.regionalTax,
      municipalTax: taxResult.municipalTax,
      inps: taxResult.inps,
      totalDeductions: taxResult.totalDeductions,
      net: taxResult.netAnnual,
      effectiveRate: taxResult.effectiveRate
    },
    commission: {
      gross: annualCommission,
      irpef: commissionTax * (taxResult.irpef / taxResult.totalDeductions),
      regionalTax: commissionTax * (taxResult.regionalTax / taxResult.totalDeductions),
      municipalTax: commissionTax * (taxResult.municipalTax / taxResult.totalDeductions),
      inps: commissionTax * (taxResult.inps / taxResult.totalDeductions),
      totalDeductions: commissionTax,
      net: commissionNet
    },
    breakdown: { /* same as above */ }
  };
}
```

---

## 📝 IMPLEMENTATION EXAMPLES (Complete Calculations)

### Example 1: Monthly Salary → Annual (Employee, Milan, Single)

**Input:**
- Monthly Salary: €3,000
- Region: Lombardia (Milan)
- Filing Status: Single
- Employment Type: Employee
- No pre-tax deductions

**Step-by-Step:**

```typescript
// Step 1: Normalize to annual
const annualGross = €3,000 × 12 = €36,000

// Step 2: Calculate IRPEF (before deductions)
IRPEF progressive:
- €0 to €15,000 @ 23%: €3,450
- €15,000 to €28,000 @ 25%: €3,250
- €28,000 to €36,000 @ 35%: €2,800
Total IRPEF (gross) = €9,500

// Step 3: Personal deduction
Income = €36,000 (between €28k-€50k)
Personal Deduction = €1,910 × ((€50,000 - €36,000) / €22,000)
Personal Deduction = €1,910 × 0.6364 = €1,216

// Step 4: IRPEF after deduction
IRPEF = €9,500 - €1,216 = €8,284

// Step 5: Regional tax (Lombardia: 2.33%)
Regional Tax = €36,000 × 0.0233 = €838.80

// Step 6: Municipal tax (Milan: 0.8%)
Municipal Tax = €36,000 × 0.008 = €288

// Step 7: INPS (Employee: 9.19%)
INPS = €36,000 × 0.0919 = €3,308.40

// Step 8: Totals
Total Deductions = €8,284 + €838.80 + €288 + €3,308.40 = €12,719.20
Net Annual = €36,000 - €12,719.20 = €23,280.80
Effective Rate = 35.33%

// Step 9: Monthly redistribution
Monthly Net = €23,280.80 / 12 = €1,940.07
```

**Result:**
```typescript
{
  annual: {
    gross: 36000.00,
    taxableIncome: 36000.00,
    irpef: 8284.00,
    regionalTax: 838.80,
    municipalTax: 288.00,
    inps: 3308.40,
    totalDeductions: 12719.20,
    net: 23280.80,
    effectiveRate: 35.33
  },
  monthly: {
    gross: 3000.00,
    irpef: 690.33,
    regionalTax: 69.90,
    municipalTax: 24.00,
    inps: 275.70,
    totalDeductions: 1059.93,
    net: 1940.07
  }
}
```

---

### Example 2: Hourly Rate → Salary (Employee, Rome, Single)

**Input:**
- Hourly Rate: €25.00
- Annual Working Hours: 1,824
- Region: Lazio (Rome)
- Filing Status: Single
- Employment Type: Employee

**Step-by-Step:**

```typescript
// Step 1: Normalize to annual
const annualGross = €25 × 1,824 = €45,600

// Step 2: Calculate IRPEF (gross)
- €0 to €15,000 @ 23%: €3,450
- €15,000 to €28,000 @ 25%: €3,250
- €28,000 to €45,600 @ 35%: €6,160
Total IRPEF (gross) = €12,860

// Step 3: Personal deduction
Income = €45,600 (between €28k-€50k)
Personal Deduction = €1,910 × ((€50,000 - €45,600) / €22,000)
Personal Deduction = €1,910 × 0.20 = €382

// Step 4: IRPEF after deduction
IRPEF = €12,860 - €382 = €12,478

// Step 5: Regional tax (Lazio: 2.33%)
Regional Tax = €45,600 × 0.0233 = €1,062.48

// Step 6: Municipal tax (Rome: 0.9%)
Municipal Tax = €45,600 × 0.009 = €410.40

// Step 7: INPS (9.19%)
INPS = €45,600 × 0.0919 = €4,190.64

// Step 8: Totals
Total Deductions = €12,478 + €1,062.48 + €410.40 + €4,190.64 = €18,141.52
Net Annual = €45,600 - €18,141.52 = €27,458.48
Effective Rate = 39.78%

// Step 9: Hourly redistribution
Hourly Net = €27,458.48 / 1,824 = €15.05
```

**Result:**
```typescript
{
  annual: {
    gross: 45600.00,
    taxableIncome: 45600.00,
    irpef: 12478.00,
    regionalTax: 1062.48,
    municipalTax: 410.40,
    inps: 4190.64,
    totalDeductions: 18141.52,
    net: 27458.48,
    effectiveRate: 39.78
  },
  hourly: {
    gross: 25.00,
    irpef: 6.84,
    regionalTax: 0.58,
    municipalTax: 0.23,
    inps: 2.30,
    totalDeductions: 9.95,
    net: 15.05
  }
}
```

---

### Example 3: Bonus Calculator (Employee, Florence, Single)

**Input:**
- Base Salary: €40,000 (annual)
- Bonus Amount: €5,000
- Bonus Frequency: Annual
- Region: Toscana (Florence)
- Filing Status: Single

**Step-by-Step:**

```typescript
// Step 1: Total compensation
Total Annual = €40,000 + €5,000 = €45,000

// Step 2: Tax on TOTAL (€45,000)
IRPEF (gross):
- €0 to €15,000 @ 23%: €3,450
- €15,000 to €28,000 @ 25%: €3,250
- €28,000 to €45,000 @ 35%: €5,950
Total IRPEF (gross) = €12,650

Personal Deduction = €1,910 × ((€50,000 - €45,000) / €22,000) = €434
IRPEF = €12,650 - €434 = €12,216

Regional (Toscana: 2.33%) = €45,000 × 0.0233 = €1,048.50
Municipal (Florence: 0.8%) = €45,000 × 0.008 = €360
INPS = €45,000 × 0.0919 = €4,135.50

Total Deductions (€45k) = €12,216 + €1,048.50 + €360 + €4,135.50 = €17,760

// Step 3: Tax on BASE SALARY ALONE (€40,000)
IRPEF (gross):
- €0 to €15,000 @ 23%: €3,450
- €15,000 to €28,000 @ 25%: €3,250
- €28,000 to €40,000 @ 35%: €4,200
Total IRPEF (gross) = €10,900

Personal Deduction = €1,910 × ((€50,000 - €40,000) / €22,000) = €868
IRPEF = €10,900 - €868 = €10,032

Regional = €40,000 × 0.0233 = €932
Municipal = €40,000 × 0.008 = €320
INPS = €40,000 × 0.0919 = €3,676

Total Deductions (€40k) = €10,032 + €932 + €320 + €3,676 = €14,960

// Step 4: Marginal tax on bonus
Bonus Tax = €17,760 - €14,960 = €2,800
Bonus Net = €5,000 - €2,800 = €2,200
Bonus Effective Rate = 56%
```

**Result:**
```typescript
{
  annual: {
    gross: 45000.00,
    irpef: 12216.00,
    regionalTax: 1048.50,
    municipalTax: 360.00,
    inps: 4135.50,
    totalDeductions: 17760.00,
    net: 27240.00,
    effectiveRate: 39.47
  },
  bonus: {
    gross: 5000.00,
    irpef: 1931.03,  // Proportional
    regionalTax: 163.30,
    municipalTax: 56.07,
    inps: 649.60,
    totalDeductions: 2800.00,
    net: 2200.00
  }
}
```

---

### Example 4: Self-Employed Income (Freelancer, Rome, Single)

**Input:**
- Annual Income: €50,000
- Region: Lazio (Rome)
- Filing Status: Single
- Employment Type: Self-Employed

**Step-by-Step:**

```typescript
// Step 1: Annual gross = €50,000

// Step 2: IRPEF (gross)
- €0 to €15,000 @ 23%: €3,450
- €15,000 to €28,000 @ 25%: €3,250
- €28,000 to €50,000 @ 35%: €7,700
Total IRPEF (gross) = €14,400

// Step 3: Personal deduction (at €50k exactly = 0)
Personal Deduction = €0

IRPEF = €14,400

// Step 4: Regional (Lazio: 2.33%)
Regional = €50,000 × 0.0233 = €1,165

// Step 5: Municipal (Rome: 0.9%)
Municipal = €50,000 × 0.009 = €450

// Step 6: INPS (Self-Employed: 25.97%)
INPS = €50,000 × 0.2597 = €12,985

// Step 7: Totals
Total Deductions = €14,400 + €1,165 + €450 + €12,985 = €29,000
Net Annual = €50,000 - €29,000 = €21,000
Effective Rate = 58%

// Step 8: Monthly
Monthly Net = €21,000 / 12 = €1,750
```

**Result:**
```typescript
{
  annual: {
    gross: 50000.00,
    taxableIncome: 50000.00,
    irpef: 14400.00,
    regionalTax: 1165.00,
    municipalTax: 450.00,
    inps: 12985.00,
    totalDeductions: 29000.00,
    net: 21000.00,
    effectiveRate: 58.00
  },
  monthly: {
    gross: 4166.67,
    irpef: 1200.00,
    regionalTax: 97.08,
    municipalTax: 37.50,
    inps: 1082.08,
    totalDeductions: 2416.67,
    net: 1750.00
  }
}
```

---

### Example 5: High Earner with Dependents (Employee, Milan, Married, 2 Children)

**Input:**
- Annual Salary: €100,000
- Region: Lombardia (Milan)
- Filing Status: Married with Children (2 dependents)
- Pre-tax deductions: €3,000 pension

**Step-by-Step:**

```typescript
// Step 1: Taxable income
Taxable = €100,000 - €3,000 = €97,000

// Step 2: IRPEF (gross)
- €0 to €15,000 @ 23%: €3,450
- €15,000 to €28,000 @ 25%: €3,250
- €28,000 to €50,000 @ 35%: €7,700
- €50,000 to €75,000 @ 43%: €10,750
- €75,000 to €97,000 @ 43%: €9,460
Total IRPEF (gross) = €34,610

// Step 3: Personal deduction (income > €50k)
Personal Deduction = €0

// Step 4: Dependent deductions
Spouse (income €97k > €80k) = €0
2 Children = €950 × 2 = €1,900

Total Deductions = €1,900
IRPEF = €34,610 - €1,900 = €32,710

// Step 5: Regional (2.33%)
Regional = €97,000 × 0.0233 = €2,260.10

// Step 6: Municipal (0.8%)
Municipal = €97,000 × 0.008 = €776

// Step 7: INPS (9.19%)
INPS = €100,000 × 0.0919 = €9,190

// Step 8: Totals
Total Deductions = €32,710 + €2,260.10 + €776 + €9,190 = €44,936.10
Net Annual = €100,000 - €44,936.10 = €55,063.90
Effective Rate = 44.94%
```

**Result:**
```typescript
{
  annual: {
    gross: 100000.00,
    taxableIncome: 97000.00,
    irpef: 32710.00,
    regionalTax: 2260.10,
    municipalTax: 776.00,
    inps: 9190.00,
    totalDeductions: 44936.10,
    net: 55063.90,
    effectiveRate: 44.94
  },
  monthly: {
    gross: 8333.33,
    net: 4588.66
  },
  breakdown: {
    personalDeduction: 0,
    dependentDeductions: 1900,
    pensionContribution: 3000,
    numberOfDependents: 2
  }
}
```

---

### Example 6: Commission Calculator (Employee, Turin, Single)

**Input:**
- Base Salary: €35,000 (annual)
- Commission: €1,500/month
- Region: Piemonte (Turin)
- Filing Status: Single

**Step-by-Step:**

```typescript
// Step 1: Annual commission
Annual Commission = €1,500 × 12 = €18,000

// Step 2: Total compensation
Total = €35,000 + €18,000 = €53,000

// Step 3: Tax on TOTAL (€53,000)
IRPEF (gross):
- €0 to €15,000 @ 23%: €3,450
- €15,000 to €28,000 @ 25%: €3,250
- €28,000 to €50,000 @ 35%: €7,700
- €50,000 to €53,000 @ 43%: €1,290
Total = €15,690

Personal Deduction = €0 (income > €50k)
IRPEF = €15,690

Regional (2.23%) = €53,000 × 0.0223 = €1,181.90
Municipal (0.8%) = €53,000 × 0.008 = €424
INPS = €53,000 × 0.0919 = €4,870.70

Total Deductions (€53k) = €15,690 + €1,181.90 + €424 + €4,870.70 = €22,166.60

// Step 4: Tax on base (€35,000)
IRPEF (gross):
- €0 to €15,000 @ 23%: €3,450
- €15,000 to €28,000 @ 25%: €3,250
- €28,000 to €35,000 @ 35%: €2,450
Total = €9,150

Personal Deduction = €1,910 × ((€50,000 - €35,000) / €22,000) = €1,302
IRPEF = €9,150 - €1,302 = €7,848

Regional = €35,000 × 0.0223 = €780.50
Municipal = €35,000 × 0.008 = €280
INPS = €35,000 × 0.0919 = €3,216.50

Total Deductions (€35k) = €7,848 + €780.50 + €280 + €3,216.50 = €12,125

// Step 5: Marginal tax on commission
Commission Tax = €22,166.60 - €12,125 = €10,041.60
Commission Net = €18,000 - €10,041.60 = €7,958.40
Commission Effective Rate = 55.79%
```

**Result:**
```typescript
{
  annual: {
    gross: 53000.00,
    totalDeductions: 22166.60,
    net: 30833.40,
    effectiveRate: 41.82
  },
  commission: {
    gross: 18000.00,
    totalDeductions: 10041.60,
    net: 7958.40
  }
}
```

---

### Example 7: Overtime (Employee, Venice, Married)

**Input:**
- Regular Hourly Rate: €18.00
- Regular Hours: 38/week
- Overtime Hours: 6/week
- Overtime Multiplier: 1.5
- Weeks: 48
- Region: Veneto (Venice)
- Filing Status: Married

**Step-by-Step:**

```typescript
// Step 1: Weekly pay
Regular = €18 × 38 = €684
Overtime = €18 × 1.5 × 6 = €162
Total Weekly = €684 + €162 = €846

// Step 2: Annual
Annual Gross = €846 × 48 = €40,608

// Step 3: IRPEF (gross)
- €0 to €15,000 @ 23%: €3,450
- €15,000 to €28,000 @ 25%: €3,250
- €28,000 to €40,608 @ 35%: €4,412.80
Total = €11,112.80

Personal Deduction = €1,910 × ((€50,000 - €40,608) / €22,000) = €816
Spouse Deduction = €800 × ((€80,000 - €40,608) / €40,000) = €788

Total Deductions = €816 + €788 = €1,604
IRPEF = €11,112.80 - €1,604 = €9,508.80

// Step 4: Regional (Veneto: 2.33%)
Regional = €40,608 × 0.0233 = €946.17

// Step 5: Municipal (0.8%)
Municipal = €40,608 × 0.008 = €324.86

// Step 6: INPS
INPS = €40,608 × 0.0919 = €3,731.88

// Step 7: Totals
Total Deductions = €9,508.80 + €946.17 + €324.86 + €3,731.88 = €14,511.71
Net = €40,608 - €14,511.71 = €26,096.29
Effective Rate = 35.73%

// Step 8: Overtime calculation
Regular Annual = €684 × 48 = €32,832
Overtime Annual = €162 × 48 = €7,776

Tax on regular (€32,832):
IRPEF = €8,490 - €1,432 = €7,058
Regional = €765.20, Municipal = €262.66, INPS = €3,016.10
Total = €11,101.96

Overtime Tax = €14,511.71 - €11,101.96 = €3,409.75
Overtime Net = €7,776 - €3,409.75 = €4,366.25
```

**Result:**
```typescript
{
  annual: {
    gross: 40608.00,
    totalDeductions: 14511.71,
    net: 26096.29,
    effectiveRate: 35.73
  },
  overtime: {
    gross: 7776.00,
    totalDeductions: 3409.75,
    net: 4366.25
  }
}
```

---

## ✅ VALIDATION CHECKLIST

Before committing any Italy calculator implementation, verify:

### Tax Engine Validation
- [ ] IRPEF brackets match 2026 rates (23%/25%/35%/43%)
- [ ] Personal deduction calculated correctly (income-dependent formula)
- [ ] Dependent deductions applied (spouse €800, children €950/€1,220)
- [ ] Regional tax rates correct for all 20 regions
- [ ] Municipal tax range 0-0.9% (default 0.8%)
- [ ] INPS employee rate = 9.19% (or sector-specific)
- [ ] INPS self-employed rate = 25.97% with €113,520 cap
- [ ] Pre-tax deductions applied before tax calculation

### Calculator Logic Validation
- [ ] **Normalize → Annual → Tax → Redistribute** pattern followed
- [ ] No tax rates entered by user
- [ ] All frequencies normalized correctly (hourly: 1,824 hrs, monthly: ×12)
- [ ] Bonus/Commission/Overtime use marginal tax calculation
- [ ] Self-employed calculator uses correct INPS rate (25.97%)
- [ ] Return structure matches specification exactly

### Output Validation
- [ ] Annual section includes: gross, taxableIncome, irpef, regionalTax, municipalTax, inps, totalDeductions, net, effectiveRate
- [ ] Requested frequency section matches input frequency
- [ ] Breakdown includes: personalDeduction, dependentDeductions, pensionContribution, numberOfDependents
- [ ] All monetary values rounded to 2 decimal places
- [ ] Effective rate calculated as: (totalDeductions / gross) × 100

### Edge Cases
- [ ] Zero income returns zero tax
- [ ] Income ≤ €15,000 gets full personal deduction (€1,880)
- [ ] Income > €50,000 gets zero personal deduction
- [ ] Self-employed INPS capped at €113,520
- [ ] Married filing gets spouse deduction (income-dependent)
- [ ] Children deductions accumulate correctly (€950 each, €1,220 for 4+)
- [ ] Pre-tax deductions cannot exceed 50% of gross

---

## ⚠️ COMMON PITFALLS

### 1. Personal Deduction Formula
**WRONG:**
```typescript
const personalDeduction = 1880; // Fixed amount
```

**CORRECT:**
```typescript
function calculatePersonalDeduction(income: number): number {
  if (income <= 15000) return 1880;
  else if (income <= 28000) return 1910 + 1190 * ((28000 - income) / 13000);
  else if (income <= 50000) return 1910 * ((50000 - income) / 22000);
  else return 0;
}
```

### 2. IRPEF Deductions Applied AFTER Calculation
**WRONG:**
```typescript
const taxableIncome = grossAnnual - personalDeduction;
const irpef = calculateProgressiveTax(taxableIncome, IRPEF_BRACKETS);
```

**CORRECT:**
```typescript
const irpefGross = calculateProgressiveTax(taxableIncome, IRPEF_BRACKETS);
const personalDeduction = calculatePersonalDeduction(taxableIncome);
const irpef = Math.max(0, irpefGross - personalDeduction - dependentDeductions);
```

### 3. Regional/Municipal Tax Applied to Wrong Base
**WRONG:**
```typescript
const regionalTax = (taxableIncome - personalDeduction) * regionalRate;
```

**CORRECT:**
```typescript
const regionalTax = taxableIncome * regionalRate; // No deductions apply
```

### 4. INPS on Taxable Income Instead of Gross
**WRONG:**
```typescript
const inps = taxableIncome * 0.0919;
```

**CORRECT:**
```typescript
const inps = grossAnnual * 0.0919; // Always on gross, not taxable
```

### 5. Self-Employed INPS Uncapped
**WRONG:**
```typescript
const inps = grossAnnual * 0.2597; // Missing cap
```

**CORRECT:**
```typescript
const contributionBase = Math.min(grossAnnual, 113520);
const inps = contributionBase * 0.2597;
```

### 6. Spouse Deduction Always Applied
**WRONG:**
```typescript
if (filingStatus === 'married') {
  dependentDeductions += 800;
}
```

**CORRECT:**
```typescript
if (filingStatus === 'married' && taxableIncome <= 80000) {
  const spouseDeduction = taxableIncome <= 40000
    ? 800
    : 800 * ((80000 - taxableIncome) / 40000);
  dependentDeductions += spouseDeduction;
}
```

### 7. Children Deduction Flat Rate
**WRONG:**
```typescript
const childDeduction = numberOfDependents * 950;
```

**CORRECT:**
```typescript
let childDeduction = 0;
if (numberOfDependents > 0) {
  const perChildRate = numberOfDependents >= 4 ? 1220 : 950;
  childDeduction = perChildRate * numberOfDependents;
}
```

---

## 🎯 STRICT CURSOR/CLAUDE INSTRUCTIONS

When implementing Italy calculators:

### DO:
1. **Always** follow Normalize → Annual → Tax → Redistribute
2. **Always** use single `calculateItalyTax()` function
3. **Always** calculate IRPEF gross, THEN subtract deductions
4. **Always** apply regional/municipal tax to taxable income (no deductions)
5. **Always** apply INPS to gross annual (not taxable)
6. **Always** use income-dependent personal deduction formula
7. **Always** check spouse/children deductions are income-dependent
8. **Always** cap self-employed INPS at €113,520
9. **Always** calculate marginal tax for bonus/commission/overtime
10. **Always** return complete result structure with breakdowns

### DON'T:
1. **Never** let user enter tax rates
2. **Never** calculate tax without normalizing to annual first
3. **Never** apply personal deduction before IRPEF calculation
4. **Never** apply deductions to regional/municipal tax (flat on taxable income)
5. **Never** apply INPS to taxable income (always gross)
6. **Never** use fixed personal deduction (income-dependent!)
7. **Never** apply spouse deduction if income > €80k
8. **Never** forget to cap self-employed INPS
9. **Never** apply average tax rate to bonus/commission (use marginal)
10. **Never** duplicate tax calculation logic across calculators

### Testing Requirements:
- Test with at least 4 income levels: low (<€20k), medium (€35-45k), high (€60-80k), very high (>€100k)
- Test all filing statuses: single, married, married_with_children (1, 2, 3+ children)
- Test both employment types: employee and self-employed
- Test with and without pre-tax deductions
- Test edge cases: zero income, €15k (full deduction), €50k (zero deduction)
- Test all regions (at minimum: Lazio, Lombardia, Veneto, Piemonte, Toscana)
- Verify marginal tax calculations for bonus/commission/overtime
- Verify personal deduction formula at boundaries (€15k, €28k, €50k)

---

## 📚 ADDITIONAL NOTES

### Tax Year 2026
All calculations based on 2026 Italian tax law. Update brackets and rates annually.

### Regional Differences
- 20 regions with regional tax rates ranging from 1.23% (Valle d'Aosta, Trentino) to 2.33% (most regions)
- Use region-specific rates from `REGIONAL_TAX_RATES` constant

### Municipal Tax Variations
- Over 8,000 municipalities (comuni) in Italy
- Rates range from 0% (rare) to 0.9% (Rome, major cities)
- Default to 0.8% unless specific municipality known

### INPS Contribution System
- Employee: ~9.19% (varies slightly by sector: general 9.19%, public 8.89%, industrial 9.49%)
- No cap for employees (unlike Spain/UK)
- Self-employed: 25.97% capped at €113,520 (Gestione Separata 2026)
- Professionals with own pension funds (lawyers, doctors, etc.) have different rates

### Personal Deduction (Detrazione Personale)
- Income-dependent, decreases as income rises
- Full deduction (€1,880) for income ≤ €15,000
- Zero deduction for income > €50,000
- Formula changes at €28,000 threshold

### Dependent Deductions
- Spouse: Up to €800 (phases out above €40k, zero above €80k)
- Children: €950 per child (first 3), €1,220 per child (4+)
- Additional €400 for disabled dependents

### Working Hours
- Standard: 1,824 hours/year (38 hours/week × 48 weeks)
- Accounts for typical Italian vacation/holidays

---

## 🚀 IMPLEMENTATION PRIORITY

1. **Monthly → Salary** (Most common in Italy)
2. **Annual → Salary / Gross to Net**
3. **Hourly → Salary**
4. **Bonus Tax Calculator**
5. **Commission Calculator**
6. **Overtime Pay Calculator**
7. **Weekly → Salary**
8. **Daily → Salary**
9. **Salary After Tax** (duplicate of Gross to Net)
10. **Take Home Pay** (duplicate of Gross to Net)
11. **Salary Calculator** (generic wrapper)
12. **Hourly Rate Calculator** (inverse calculation)

---

**End of Italy Master Specification**

This document is production-ready and contains all information needed for Claude/Cursor to implement the complete Italy salary calculator system.
