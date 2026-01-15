# 🇪🇸 SPAIN – MASTER SALARY CALCULATOR SPECIFICATION (2026)

**Scope:** Applies to ALL Spain calculators:
- Hourly → Salary
- Daily → Salary
- Weekly → Salary
- Monthly → Salary (Mensual)
- Bi-Weekly → Salary
- Quarterly → Salary
- Annual → Salary (Anual)
- Semi-Annual → Salary
- Bonus Calculator
- Overtime Calculator
- Commission Calculator
- Self-Employed Income Calculator (Autónomo)

**Status:** Production-ready, Claude/Cursor implementation guide
**Tax Year:** 2026
**Currency:** EUR (€)
**Standard Working Hours:** 1,826 hours/year (40 hours/week × 52 weeks - holidays)

---

## 🎯 CORE DESIGN PRINCIPLES

### 1. Normalize → Annual → Apply Tax → Redistribute

**ALL calculators follow this exact pattern:**

```
Input (any frequency)
  → Normalize to ANNUAL gross
  → Apply Spanish tax engine (IRPF + Seguridad Social)
  → Calculate annual net
  → Redistribute to requested frequency
```

### 2. No User-Entered Tax Rates

- **User NEVER enters:** IRPF rate, Seguridad Social rate, regional tax rate
- **System auto-calculates:** All taxes based on income, region, filing status, employment type
- **User ONLY enters:** Gross income, frequency, region, filing status, employment type, pre-tax deductions

### 3. Single Tax Engine

- One `calculateSpainTax()` function in `lib/calculators/es.ts`
- Used by ALL 12 calculators
- Never duplicate tax logic

### 4. Regional Tax Differences

- Spain has 17 autonomous communities with regional IRPF rates
- State (national) IRPF: 19%/24%/30%/37%/45%/47%
- Regional IRPF: Varies by community (typically adds 12-25.5%)
- System must support all 17 regions

---

## 📋 MASTER INPUT SPECIFICATION

### Common Inputs (All Calculators)

```typescript
interface SpainTaxInputs {
  // Required
  grossIncome: number;              // Amount in EUR
  frequency: SpainPayFrequency;     // 'hourly' | 'daily' | 'weekly' | 'monthly' | 'bi-weekly' | 'quarterly' | 'semi-annual' | 'annual'
  region: SpainRegion;              // 17 autonomous communities
  filingStatus: SpainFilingStatus;  // 'single' | 'married' | 'married_with_children' | 'head_of_household'
  employmentType: SpainEmploymentType; // 'employee' | 'autonomo'

  // Optional (with defaults)
  hoursPerWeek?: number;            // Default: 40
  weeksPerYear?: number;            // Default: 52 (but use 1,826 hours/year for annual calc)
  annualWorkingHours?: number;      // Default: 1,826
  pensionContribution?: number;     // Pre-tax pension (Plan de Pensiones), max €1,500/year
  healthInsurance?: number;         // Pre-tax health insurance, max €500/year
  numberOfChildren?: number;        // Default: 0 (affects minimum threshold and deductions)
  age?: number;                     // Default: 35 (affects certain deductions for 65+)
}
```

### Spain-Specific Types

```typescript
export type SpainPayFrequency =
  | 'hourly'
  | 'daily'
  | 'weekly'
  | 'monthly'
  | 'bi-weekly'
  | 'quarterly'
  | 'semi-annual'
  | 'annual';

export type SpainRegion =
  | 'andalucia'          // Andalucía
  | 'aragon'             // Aragón
  | 'asturias'           // Asturias
  | 'baleares'           // Islas Baleares
  | 'canarias'           // Islas Canarias
  | 'cantabria'          // Cantabria
  | 'castilla_la_mancha' // Castilla-La Mancha
  | 'castilla_leon'      // Castilla y León
  | 'cataluna'           // Cataluña
  | 'extremadura'        // Extremadura
  | 'galicia'            // Galicia
  | 'madrid'             // Comunidad de Madrid
  | 'murcia'             // Región de Murcia
  | 'navarra'            // Navarra (Foral system)
  | 'pais_vasco'         // País Vasco (Basque Country - Foral system)
  | 'rioja'              // La Rioja
  | 'valencia';          // Comunidad Valenciana

export type SpainFilingStatus =
  | 'single'                    // Individual taxation
  | 'married'                   // Joint taxation (no children)
  | 'married_with_children'     // Joint taxation with children
  | 'head_of_household';        // Single parent or guardian

export type SpainEmploymentType =
  | 'employee'    // Regular employee (Seguridad Social ~6.35%)
  | 'autonomo';   // Self-employed (Seguridad Social ~30%)
```

---

## 🔢 AUTO-CALCULATED VALUES (Never User Input)

### 1. IRPF (Impuesto sobre la Renta de las Personas Físicas) - Income Tax

**National IRPF Brackets (2026):**

```typescript
const IRPF_NATIONAL_BRACKETS = [
  { min: 0,      max: 12450,  rate: 0.19 },   // 19%
  { min: 12450,  max: 20200,  rate: 0.24 },   // 24%
  { min: 20200,  max: 35200,  rate: 0.30 },   // 30%
  { min: 35200,  max: 60000,  rate: 0.37 },   // 37%
  { min: 60000,  max: 300000, rate: 0.45 },   // 45%
  { min: 300000, max: Infinity, rate: 0.47 }  // 47%
];
```

**Regional IRPF (Example - Madrid):**

Madrid applies a regional scale that typically mirrors the national scale. Combined effective rate:
- €0-€12,450: ~19% (9.5% state + 9.5% regional)
- €12,450-€20,200: ~24% (12% state + 12% regional)
- €20,200-€35,200: ~30% (15% state + 15% regional)
- €35,200-€60,000: ~37% (18.5% state + 18.5% regional)
- €60,000-€300,000: ~45% (22.5% state + 22.5% regional)
- €300,000+: ~47% (23.5% state + 23.5% regional)

**Important:** The national brackets shown above represent the combined state + regional rates. In implementation, you may split them or use the combined rates directly. Most regions follow similar scales with slight variations.

**Filing Status Adjustments:**

```typescript
const PERSONAL_ALLOWANCE_BASE = 5550; // Base personal allowance
const PERSONAL_ALLOWANCE_65_PLUS = 6700; // Age 65+
const PERSONAL_ALLOWANCE_75_PLUS = 8100; // Age 75+

// Additional allowances for married filing jointly
const MARRIED_ALLOWANCE_INCREASE = 3400;
const CHILD_ALLOWANCE_FIRST = 2400;
const CHILD_ALLOWANCE_SECOND = 2700;
const CHILD_ALLOWANCE_THIRD_PLUS = 4000; // Per child
```

### 2. Seguridad Social (Social Security Contributions)

**Employee Contributions (2026):**

```typescript
const SEGURIDAD_SOCIAL_EMPLOYEE_RATE = 0.0635; // 6.35%
const SEGURIDAD_SOCIAL_MAX_BASE = 4070;        // €4,070/month (€48,840/year)

// Breakdown (for reference only - use combined rate):
// - Common contingencies: 4.70%
// - Unemployment: 1.55%
// - Training: 0.10%
// Total: 6.35%

function calculateSeguridadSocialEmployee(grossAnnual: number): number {
  const monthlySalary = grossAnnual / 12;
  const contributionBase = Math.min(monthlySalary, SEGURIDAD_SOCIAL_MAX_BASE);
  const monthlyContribution = contributionBase * SEGURIDAD_SOCIAL_EMPLOYEE_RATE;
  return monthlyContribution * 12; // Annual total
}
```

**Autónomo (Self-Employed) Contributions (2026):**

```typescript
const AUTONOMO_BASE_CONTRIBUTION = 310; // €310/month (new system)
const AUTONOMO_RATE_EFFECTIVE = 0.30;   // ~30% of declared income

// New system (2023+): Based on real income (ingresos reales)
// Minimum: €950/month base → €310/month contribution
// Maximum: €4,720/month base → €1,536/month contribution

function calculateSeguridadSocialAutonomo(grossAnnual: number): number {
  const monthlyIncome = grossAnnual / 12;

  // Progressive scale based on monthly income
  if (monthlyIncome <= 670) return 230 * 12;
  if (monthlyIncome <= 900) return 260 * 12;
  if (monthlyIncome <= 1166.70) return 275 * 12;
  if (monthlyIncome <= 1300) return 291 * 12;
  if (monthlyIncome <= 1500) return 294 * 12;
  if (monthlyIncome <= 1700) return 294 * 12;
  if (monthlyIncome <= 1850) return 310 * 12;
  if (monthlyIncome <= 2030) return 320 * 12;
  if (monthlyIncome <= 2330) return 340 * 12;
  if (monthlyIncome <= 2760) return 360 * 12;
  if (monthlyIncome <= 3190) return 380 * 12;
  if (monthlyIncome <= 3620) return 400 * 12;
  if (monthlyIncome <= 4050) return 420 * 12;
  if (monthlyIncome <= 6000) return 500 * 12;

  // Above €6,000/month: maximum contribution
  return 1536 * 12; // €18,432/year
}
```

### 3. Pre-Tax Deductions

```typescript
const MAX_PENSION_DEDUCTION = 1500;  // €1,500/year (Plan de Pensiones)
const MAX_HEALTH_INSURANCE_DEDUCTION = 500; // €500/year

function applyPreTaxDeductions(grossAnnual: number, pension: number, health: number): number {
  const validPension = Math.min(pension, MAX_PENSION_DEDUCTION);
  const validHealth = Math.min(health, MAX_HEALTH_INSURANCE_DEDUCTION);
  return grossAnnual - validPension - validHealth;
}
```

---

## 🧮 SPAIN TAX ENGINE (Complete Implementation)

### Core Function Signature

```typescript
export interface SpainTaxResult {
  grossAnnual: number;
  taxableIncome: number;           // After pre-tax deductions
  irpf: number;                    // Income tax (state + regional)
  seguridadSocial: number;         // Social security
  totalDeductions: number;         // IRPF + SS
  netAnnual: number;               // Take-home pay
  effectiveRate: number;           // Total tax rate as percentage

  // Breakdowns
  irpfNational: number;            // State portion (for reference)
  irpfRegional: number;            // Regional portion (for reference)
  personalAllowance: number;       // Tax-free allowance applied
}

export function calculateSpainTax(
  grossAnnual: number,
  region: SpainRegion,
  filingStatus: SpainFilingStatus,
  employmentType: SpainEmploymentType,
  options: {
    pensionContribution?: number;
    healthInsurance?: number;
    numberOfChildren?: number;
    age?: number;
  } = {}
): SpainTaxResult
```

### Implementation Logic

```typescript
import { calculateProgressiveTax } from './helpers';

// National IRPF brackets (combined state + regional for most regions)
const IRPF_BRACKETS_STANDARD = [
  { min: 0,      max: 12450,  rate: 0.19 },
  { min: 12450,  max: 20200,  rate: 0.24 },
  { min: 20200,  max: 35200,  rate: 0.30 },
  { min: 35200,  max: 60000,  rate: 0.37 },
  { min: 60000,  max: 300000, rate: 0.45 },
  { min: 300000, max: Infinity, rate: 0.47 }
];

// Regional variations (simplified - use standard for most)
const REGIONAL_BRACKETS = {
  madrid: IRPF_BRACKETS_STANDARD, // Same as standard
  cataluna: IRPF_BRACKETS_STANDARD, // Slight variations not shown here
  andalucia: IRPF_BRACKETS_STANDARD,
  // ... (other regions use similar brackets)
};

export function calculateSpainTax(
  grossAnnual: number,
  region: SpainRegion = 'madrid',
  filingStatus: SpainFilingStatus = 'single',
  employmentType: SpainEmploymentType = 'employee',
  options: {
    pensionContribution?: number;
    healthInsurance?: number;
    numberOfChildren?: number;
    age?: number;
  } = {}
): SpainTaxResult {
  const {
    pensionContribution = 0,
    healthInsurance = 0,
    numberOfChildren = 0,
    age = 35
  } = options;

  // Step 1: Apply pre-tax deductions
  const validPension = Math.min(pensionContribution, 1500);
  const validHealth = Math.min(healthInsurance, 500);
  const taxableIncome = grossAnnual - validPension - validHealth;

  // Step 2: Calculate personal allowance
  let personalAllowance = 5550; // Base
  if (age >= 75) personalAllowance = 8100;
  else if (age >= 65) personalAllowance = 6700;

  if (filingStatus === 'married' || filingStatus === 'married_with_children') {
    personalAllowance += 3400;
  }

  // Child allowances
  if (numberOfChildren >= 1) personalAllowance += 2400;
  if (numberOfChildren >= 2) personalAllowance += 2700;
  if (numberOfChildren >= 3) {
    personalAllowance += 4000 * (numberOfChildren - 2);
  }

  // Step 3: Calculate IRPF (Income Tax)
  const irpfBase = Math.max(0, taxableIncome - personalAllowance);
  const brackets = REGIONAL_BRACKETS[region] || IRPF_BRACKETS_STANDARD;
  const irpf = calculateProgressiveTax(irpfBase, brackets);

  // Split into national/regional (50/50 approximation for display)
  const irpfNational = irpf * 0.5;
  const irpfRegional = irpf * 0.5;

  // Step 4: Calculate Seguridad Social
  let seguridadSocial: number;
  if (employmentType === 'employee') {
    const monthlySalary = grossAnnual / 12;
    const contributionBase = Math.min(monthlySalary, 4070);
    seguridadSocial = contributionBase * 0.0635 * 12;
  } else {
    // Autónomo - progressive scale
    seguridadSocial = calculateSeguridadSocialAutonomo(grossAnnual);
  }

  // Step 5: Calculate totals
  const totalDeductions = irpf + seguridadSocial;
  const netAnnual = grossAnnual - totalDeductions;
  const effectiveRate = (totalDeductions / grossAnnual) * 100;

  return {
    grossAnnual,
    taxableIncome,
    irpf,
    seguridadSocial,
    totalDeductions,
    netAnnual,
    effectiveRate,
    irpfNational,
    irpfRegional,
    personalAllowance
  };
}

function calculateSeguridadSocialAutonomo(grossAnnual: number): number {
  const monthlyIncome = grossAnnual / 12;

  if (monthlyIncome <= 670) return 230 * 12;
  if (monthlyIncome <= 900) return 260 * 12;
  if (monthlyIncome <= 1166.70) return 275 * 12;
  if (monthlyIncome <= 1300) return 291 * 12;
  if (monthlyIncome <= 1500) return 294 * 12;
  if (monthlyIncome <= 1700) return 294 * 12;
  if (monthlyIncome <= 1850) return 310 * 12;
  if (monthlyIncome <= 2030) return 320 * 12;
  if (monthlyIncome <= 2330) return 340 * 12;
  if (monthlyIncome <= 2760) return 360 * 12;
  if (monthlyIncome <= 3190) return 380 * 12;
  if (monthlyIncome <= 3620) return 400 * 12;
  if (monthlyIncome <= 4050) return 420 * 12;
  if (monthlyIncome <= 6000) return 500 * 12;

  return 1536 * 12;
}
```

---

## 📊 REQUIRED OUTPUTS (All Calculators)

Every calculator must return:

```typescript
interface SpainCalculatorResult {
  // Input echo
  input: {
    gross: number;
    frequency: SpainPayFrequency;
    region: SpainRegion;
    filingStatus: SpainFilingStatus;
    employmentType: SpainEmploymentType;
  };

  // Annual calculations
  annual: {
    gross: number;
    taxableIncome: number;
    irpf: number;
    seguridadSocial: number;
    totalDeductions: number;
    net: number;
    effectiveRate: number;
  };

  // Requested frequency (matches input frequency)
  [frequency]: {
    gross: number;
    irpf: number;
    seguridadSocial: number;
    totalDeductions: number;
    net: number;
  };

  // Breakdown
  breakdown: {
    personalAllowance: number;
    pensionContribution: number;
    healthInsurance: number;
    numberOfChildren: number;
  };
}
```

**Example for Hourly → Salary:**

```typescript
{
  input: {
    gross: 25.00,
    frequency: 'hourly',
    region: 'madrid',
    filingStatus: 'single',
    employmentType: 'employee'
  },
  annual: {
    gross: 45650.00,        // 25 × 1826 hours
    taxableIncome: 45650.00,
    irpf: 9505.50,          // Progressive IRPF
    seguridadSocial: 2898.98, // 6.35% capped
    totalDeductions: 12404.48,
    net: 33245.52,
    effectiveRate: 27.17
  },
  hourly: {
    gross: 25.00,
    irpf: 5.20,
    seguridadSocial: 1.59,
    totalDeductions: 6.79,
    net: 18.21
  },
  breakdown: {
    personalAllowance: 5550,
    pensionContribution: 0,
    healthInsurance: 0,
    numberOfChildren: 0
  }
}
```

---

## 🎨 SPECIAL LOGIC BY CALCULATOR TYPE

### Time-Based Calculators (Hourly, Daily, Weekly, Monthly, etc.)

**1. Hourly → Salary**

```typescript
export function calculateHourlyToSalarySpain(
  hourlyRate: number,
  hoursPerWeek: number = 40,
  annualWorkingHours: number = 1826,
  region: SpainRegion = 'madrid',
  filingStatus: SpainFilingStatus = 'single',
  employmentType: SpainEmploymentType = 'employee',
  options: SpainTaxOptions = {}
): SpainCalculatorResult {
  // Step 1: Normalize to annual
  const annualGross = hourlyRate * annualWorkingHours;

  // Step 2: Apply tax engine
  const taxResult = calculateSpainTax(annualGross, region, filingStatus, employmentType, options);

  // Step 3: Redistribute to hourly
  const hourlyNet = taxResult.netAnnual / annualWorkingHours;
  const hourlyIRPF = taxResult.irpf / annualWorkingHours;
  const hourlySS = taxResult.seguridadSocial / annualWorkingHours;

  return {
    input: { gross: hourlyRate, frequency: 'hourly', region, filingStatus, employmentType },
    annual: {
      gross: taxResult.grossAnnual,
      taxableIncome: taxResult.taxableIncome,
      irpf: taxResult.irpf,
      seguridadSocial: taxResult.seguridadSocial,
      totalDeductions: taxResult.totalDeductions,
      net: taxResult.netAnnual,
      effectiveRate: taxResult.effectiveRate
    },
    hourly: {
      gross: hourlyRate,
      irpf: hourlyIRPF,
      seguridadSocial: hourlySS,
      totalDeductions: hourlyIRPF + hourlySS,
      net: hourlyNet
    },
    breakdown: {
      personalAllowance: taxResult.personalAllowance,
      pensionContribution: options.pensionContribution || 0,
      healthInsurance: options.healthInsurance || 0,
      numberOfChildren: options.numberOfChildren || 0
    }
  };
}
```

**2. Monthly → Salary (Most Common in Spain)**

```typescript
export function calculateMonthlyToSalarySpain(
  monthlySalary: number,
  region: SpainRegion = 'madrid',
  filingStatus: SpainFilingStatus = 'single',
  employmentType: SpainEmploymentType = 'employee',
  options: SpainTaxOptions = {}
): SpainCalculatorResult {
  // Step 1: Normalize to annual (12 months)
  const annualGross = monthlySalary * 12;

  // Step 2: Apply tax engine
  const taxResult = calculateSpainTax(annualGross, region, filingStatus, employmentType, options);

  // Step 3: Redistribute to monthly
  const monthlyNet = taxResult.netAnnual / 12;
  const monthlyIRPF = taxResult.irpf / 12;
  const monthlySS = taxResult.seguridadSocial / 12;

  return {
    input: { gross: monthlySalary, frequency: 'monthly', region, filingStatus, employmentType },
    annual: { /* same as above */ },
    monthly: {
      gross: monthlySalary,
      irpf: monthlyIRPF,
      seguridadSocial: monthlySS,
      totalDeductions: monthlyIRPF + monthlySS,
      net: monthlyNet
    },
    breakdown: { /* same as above */ }
  };
}
```

### Variable Pay Calculators

**1. Bonus Calculator**

```typescript
export function calculateBonusSpain(
  baseSalary: number,          // Annual base
  bonusAmount: number,         // Bonus amount
  bonusFrequency: 'monthly' | 'quarterly' | 'annual',
  region: SpainRegion = 'madrid',
  filingStatus: SpainFilingStatus = 'single',
  employmentType: SpainEmploymentType = 'employee',
  options: SpainTaxOptions = {}
): SpainCalculatorResult {
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
  const taxResult = calculateSpainTax(totalAnnualGross, region, filingStatus, employmentType, options);

  // Step 4: Calculate tax on base salary ALONE (for comparison)
  const baseTaxResult = calculateSpainTax(baseSalary, region, filingStatus, employmentType, options);

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
      irpf: taxResult.irpf,
      seguridadSocial: taxResult.seguridadSocial,
      totalDeductions: taxResult.totalDeductions,
      net: taxResult.netAnnual,
      effectiveRate: taxResult.effectiveRate
    },
    bonus: {
      gross: annualBonus,
      irpf: bonusTax * (taxResult.irpf / taxResult.totalDeductions), // Proportional
      seguridadSocial: bonusTax * (taxResult.seguridadSocial / taxResult.totalDeductions),
      totalDeductions: bonusTax,
      net: bonusNet
    },
    breakdown: { /* same as above */ }
  };
}
```

**2. Overtime Calculator**

```typescript
export function calculateOvertimeSpain(
  regularHourlyRate: number,
  regularHours: number,        // Per week
  overtimeHours: number,       // Per week
  overtimeMultiplier: number = 1.5,
  weeksPerYear: number = 52,
  region: SpainRegion = 'madrid',
  filingStatus: SpainFilingStatus = 'single',
  employmentType: SpainEmploymentType = 'employee',
  options: SpainTaxOptions = {}
): SpainCalculatorResult {
  // Step 1: Calculate weekly pay
  const regularWeeklyPay = regularHourlyRate * regularHours;
  const overtimeWeeklyPay = regularHourlyRate * overtimeMultiplier * overtimeHours;
  const totalWeeklyPay = regularWeeklyPay + overtimeWeeklyPay;

  // Step 2: Normalize to annual
  const annualGross = totalWeeklyPay * weeksPerYear;

  // Step 3: Apply tax engine
  const taxResult = calculateSpainTax(annualGross, region, filingStatus, employmentType, options);

  // Step 4: Calculate overtime-specific values
  const annualOvertimePay = overtimeWeeklyPay * weeksPerYear;
  const regularAnnualPay = regularWeeklyPay * weeksPerYear;

  // Tax on regular pay alone
  const regularTaxResult = calculateSpainTax(regularAnnualPay, region, filingStatus, employmentType, options);

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
      irpf: taxResult.irpf,
      seguridadSocial: taxResult.seguridadSocial,
      totalDeductions: taxResult.totalDeductions,
      net: taxResult.netAnnual,
      effectiveRate: taxResult.effectiveRate
    },
    overtime: {
      gross: annualOvertimePay,
      irpf: overtimeTax * (taxResult.irpf / taxResult.totalDeductions),
      seguridadSocial: overtimeTax * (taxResult.seguridadSocial / taxResult.totalDeductions),
      totalDeductions: overtimeTax,
      net: overtimeNet
    },
    breakdown: { /* same as above */ }
  };
}
```

**3. Commission Calculator**

```typescript
export function calculateCommissionSpain(
  baseSalary: number,          // Annual base
  commissionAmount: number,    // Commission amount
  commissionFrequency: 'monthly' | 'quarterly' | 'annual',
  region: SpainRegion = 'madrid',
  filingStatus: SpainFilingStatus = 'single',
  employmentType: SpainEmploymentType = 'employee',
  options: SpainTaxOptions = {}
): SpainCalculatorResult {
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
  const taxResult = calculateSpainTax(totalAnnualGross, region, filingStatus, employmentType, options);

  // Step 4: Calculate marginal tax on commission
  const baseTaxResult = calculateSpainTax(baseSalary, region, filingStatus, employmentType, options);
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
      irpf: taxResult.irpf,
      seguridadSocial: taxResult.seguridadSocial,
      totalDeductions: taxResult.totalDeductions,
      net: taxResult.netAnnual,
      effectiveRate: taxResult.effectiveRate
    },
    commission: {
      gross: annualCommission,
      irpf: commissionTax * (taxResult.irpf / taxResult.totalDeductions),
      seguridadSocial: commissionTax * (taxResult.seguridadSocial / taxResult.totalDeductions),
      totalDeductions: commissionTax,
      net: commissionNet
    },
    breakdown: { /* same as above */ }
  };
}
```

**4. Self-Employed Income Calculator (Autónomo)**

```typescript
export function calculateAutonomoIncomeSpain(
  monthlyIncome: number,       // Declared monthly income
  region: SpainRegion = 'madrid',
  filingStatus: SpainFilingStatus = 'single',
  options: SpainTaxOptions = {}
): SpainCalculatorResult {
  // Step 1: Normalize to annual
  const annualGross = monthlyIncome * 12;

  // Step 2: Apply tax engine with 'autonomo' employment type
  const taxResult = calculateSpainTax(annualGross, region, filingStatus, 'autonomo', options);

  // Step 3: Redistribute to monthly
  const monthlyNet = taxResult.netAnnual / 12;
  const monthlyIRPF = taxResult.irpf / 12;
  const monthlySS = taxResult.seguridadSocial / 12;

  return {
    input: {
      gross: monthlyIncome,
      frequency: 'monthly',
      region,
      filingStatus,
      employmentType: 'autonomo'
    },
    annual: {
      gross: taxResult.grossAnnual,
      taxableIncome: taxResult.taxableIncome,
      irpf: taxResult.irpf,
      seguridadSocial: taxResult.seguridadSocial,
      totalDeductions: taxResult.totalDeductions,
      net: taxResult.netAnnual,
      effectiveRate: taxResult.effectiveRate
    },
    monthly: {
      gross: monthlyIncome,
      irpf: monthlyIRPF,
      seguridadSocial: monthlySS,
      totalDeductions: monthlyIRPF + monthlySS,
      net: monthlyNet
    },
    breakdown: {
      personalAllowance: taxResult.personalAllowance,
      pensionContribution: options.pensionContribution || 0,
      healthInsurance: options.healthInsurance || 0,
      numberOfChildren: options.numberOfChildren || 0
    }
  };
}
```

---

## 📝 IMPLEMENTATION EXAMPLES (Complete Calculations)

### Example 1: Monthly Salary → Annual (Employee, Madrid, Single)

**Input:**
- Monthly Salary: €3,000
- Region: Madrid
- Filing Status: Single
- Employment Type: Employee
- No pre-tax deductions

**Step-by-Step:**

```typescript
// Step 1: Normalize to annual
const annualGross = 3000 * 12 = €36,000

// Step 2: Calculate personal allowance
const personalAllowance = €5,550 (base for single, age < 65)

// Step 3: Calculate IRPF
const irpfBase = €36,000 - €5,550 = €30,450

IRPF progressive calculation:
- €0 to €12,450 @ 19%: €2,365.50
- €12,450 to €20,200 @ 24%: €1,860.00
- €20,200 to €30,450 @ 30%: €3,075.00
Total IRPF = €7,300.50

// Step 4: Calculate Seguridad Social (Employee)
const monthlySalary = €3,000 (below cap of €4,070)
const monthlySS = €3,000 × 6.35% = €190.50
const annualSS = €190.50 × 12 = €2,286.00

// Step 5: Calculate totals
Total Deductions = €7,300.50 + €2,286.00 = €9,586.50
Net Annual = €36,000 - €9,586.50 = €26,413.50
Effective Rate = (€9,586.50 / €36,000) × 100 = 26.63%

// Step 6: Redistribute to monthly
Monthly Net = €26,413.50 / 12 = €2,201.13
Monthly IRPF = €7,300.50 / 12 = €608.38
Monthly SS = €2,286.00 / 12 = €190.50
```

**Result:**
```typescript
{
  input: { gross: 3000, frequency: 'monthly', region: 'madrid', filingStatus: 'single', employmentType: 'employee' },
  annual: {
    gross: 36000.00,
    taxableIncome: 36000.00,
    irpf: 7300.50,
    seguridadSocial: 2286.00,
    totalDeductions: 9586.50,
    net: 26413.50,
    effectiveRate: 26.63
  },
  monthly: {
    gross: 3000.00,
    irpf: 608.38,
    seguridadSocial: 190.50,
    totalDeductions: 798.88,
    net: 2201.13
  }
}
```

---

### Example 2: Hourly Rate → Salary (Employee, Madrid, Single)

**Input:**
- Hourly Rate: €25.00
- Annual Working Hours: 1,826
- Region: Madrid
- Filing Status: Single
- Employment Type: Employee

**Step-by-Step:**

```typescript
// Step 1: Normalize to annual
const annualGross = €25 × 1,826 = €45,650

// Step 2: Personal allowance
const personalAllowance = €5,550

// Step 3: Calculate IRPF
const irpfBase = €45,650 - €5,550 = €40,100

IRPF progressive:
- €0 to €12,450 @ 19%: €2,365.50
- €12,450 to €20,200 @ 24%: €1,860.00
- €20,200 to €35,200 @ 30%: €4,500.00
- €35,200 to €40,100 @ 37%: €1,813.00
Total IRPF = €10,538.50

// Step 4: Seguridad Social (Employee)
const monthlySalary = €45,650 / 12 = €3,804.17 (below cap)
const annualSS = €3,804.17 × 0.0635 × 12 = €2,898.98

// Step 5: Totals
Total Deductions = €10,538.50 + €2,898.98 = €13,437.48
Net Annual = €45,650 - €13,437.48 = €32,212.52
Effective Rate = 29.43%

// Step 6: Redistribute to hourly
Hourly Net = €32,212.52 / 1,826 = €17.64
Hourly IRPF = €10,538.50 / 1,826 = €5.77
Hourly SS = €2,898.98 / 1,826 = €1.59
```

**Result:**
```typescript
{
  input: { gross: 25.00, frequency: 'hourly', region: 'madrid', filingStatus: 'single', employmentType: 'employee' },
  annual: {
    gross: 45650.00,
    taxableIncome: 45650.00,
    irpf: 10538.50,
    seguridadSocial: 2898.98,
    totalDeductions: 13437.48,
    net: 32212.52,
    effectiveRate: 29.43
  },
  hourly: {
    gross: 25.00,
    irpf: 5.77,
    seguridadSocial: 1.59,
    totalDeductions: 7.36,
    net: 17.64
  }
}
```

---

### Example 3: Bonus Calculator (Employee, Madrid, Single)

**Input:**
- Base Salary: €40,000 (annual)
- Bonus Amount: €5,000
- Bonus Frequency: Annual
- Region: Madrid
- Filing Status: Single

**Step-by-Step:**

```typescript
// Step 1: Calculate total compensation
Total Annual Gross = €40,000 + €5,000 = €45,000

// Step 2: Apply tax engine to TOTAL
Personal Allowance = €5,550
IRPF Base = €45,000 - €5,550 = €39,450

IRPF on €45,000 total:
- €0 to €12,450 @ 19%: €2,365.50
- €12,450 to €20,200 @ 24%: €1,860.00
- €20,200 to €35,200 @ 30%: €4,500.00
- €35,200 to €39,450 @ 37%: €1,572.50
Total IRPF = €10,298.00

SS on €45,000:
Monthly = €45,000 / 12 = €3,750
Annual SS = €3,750 × 0.0635 × 12 = €2,858.25

Total Deductions = €10,298.00 + €2,858.25 = €13,156.25
Net Total = €45,000 - €13,156.25 = €31,843.75

// Step 3: Calculate tax on BASE SALARY alone
IRPF Base (€40,000) = €34,450
IRPF on €40,000:
- €0 to €12,450 @ 19%: €2,365.50
- €12,450 to €20,200 @ 24%: €1,860.00
- €20,200 to €34,450 @ 30%: €4,275.00
Total IRPF (base) = €8,500.50

SS on €40,000:
Monthly = €40,000 / 12 = €3,333.33
Annual SS = €3,333.33 × 0.0635 × 12 = €2,540.00

Total Deductions (base) = €8,500.50 + €2,540.00 = €11,040.50

// Step 4: Marginal tax on bonus
Bonus Tax = €13,156.25 - €11,040.50 = €2,115.75
Bonus Net = €5,000 - €2,115.75 = €2,884.25
Bonus Effective Rate = 42.32%
```

**Result:**
```typescript
{
  input: { gross: 5000, frequency: 'annual', baseSalary: 40000, region: 'madrid', filingStatus: 'single', employmentType: 'employee' },
  annual: {
    gross: 45000.00,
    taxableIncome: 45000.00,
    irpf: 10298.00,
    seguridadSocial: 2858.25,
    totalDeductions: 13156.25,
    net: 31843.75,
    effectiveRate: 29.24
  },
  bonus: {
    gross: 5000.00,
    irpf: 1655.27,  // Proportional from marginal tax
    seguridadSocial: 460.48,
    totalDeductions: 2115.75,
    net: 2884.25
  }
}
```

---

### Example 4: Autónomo (Self-Employed, Monthly Income)

**Input:**
- Monthly Income: €2,500
- Region: Madrid
- Filing Status: Single

**Step-by-Step:**

```typescript
// Step 1: Normalize to annual
const annualGross = €2,500 × 12 = €30,000

// Step 2: Personal allowance
const personalAllowance = €5,550

// Step 3: Calculate IRPF
const irpfBase = €30,000 - €5,550 = €24,450

IRPF:
- €0 to €12,450 @ 19%: €2,365.50
- €12,450 to €20,200 @ 24%: €1,860.00
- €20,200 to €24,450 @ 30%: €1,275.00
Total IRPF = €5,500.50

// Step 4: Seguridad Social (Autónomo)
Monthly Income = €2,500
Using progressive scale: €2,500 falls in €2,330-€2,760 bracket
Monthly SS = €340
Annual SS = €340 × 12 = €4,080

// Step 5: Totals
Total Deductions = €5,500.50 + €4,080 = €9,580.50
Net Annual = €30,000 - €9,580.50 = €20,419.50
Effective Rate = 31.94%

// Step 6: Redistribute to monthly
Monthly Net = €20,419.50 / 12 = €1,701.63
Monthly IRPF = €5,500.50 / 12 = €458.38
Monthly SS = €340.00
```

**Result:**
```typescript
{
  input: { gross: 2500, frequency: 'monthly', region: 'madrid', filingStatus: 'single', employmentType: 'autonomo' },
  annual: {
    gross: 30000.00,
    taxableIncome: 30000.00,
    irpf: 5500.50,
    seguridadSocial: 4080.00,
    totalDeductions: 9580.50,
    net: 20419.50,
    effectiveRate: 31.94
  },
  monthly: {
    gross: 2500.00,
    irpf: 458.38,
    seguridadSocial: 340.00,
    totalDeductions: 798.38,
    net: 1701.63
  }
}
```

---

### Example 5: High Earner with Pre-Tax Deductions (Employee, Cataluña, Married)

**Input:**
- Annual Salary: €120,000
- Region: Cataluña
- Filing Status: Married (no children)
- Pension Contribution: €2,000 (capped at €1,500)
- Health Insurance: €600 (capped at €500)

**Step-by-Step:**

```typescript
// Step 1: Apply pre-tax deductions
Valid Pension = min(€2,000, €1,500) = €1,500
Valid Health = min(€600, €500) = €500
Taxable Income = €120,000 - €1,500 - €500 = €118,000

// Step 2: Personal allowance (married)
Personal Allowance = €5,550 + €3,400 = €8,950

// Step 3: Calculate IRPF
IRPF Base = €118,000 - €8,950 = €109,050

IRPF:
- €0 to €12,450 @ 19%: €2,365.50
- €12,450 to €20,200 @ 24%: €1,860.00
- €20,200 to €35,200 @ 30%: €4,500.00
- €35,200 to €60,000 @ 37%: €9,176.00
- €60,000 to €109,050 @ 45%: €22,072.50
Total IRPF = €39,974.00

// Step 4: Seguridad Social (Employee, capped)
Monthly Salary = €120,000 / 12 = €10,000
Contribution Base = min(€10,000, €4,070) = €4,070
Monthly SS = €4,070 × 0.0635 = €258.45
Annual SS = €258.45 × 12 = €3,101.40

// Step 5: Totals
Total Deductions = €39,974.00 + €3,101.40 = €43,075.40
Net Annual = €120,000 - €43,075.40 = €76,924.60
Effective Rate = 35.90%

// Step 6: Redistribute to monthly
Monthly Gross = €10,000
Monthly Net = €76,924.60 / 12 = €6,410.38
Monthly IRPF = €39,974.00 / 12 = €3,331.17
Monthly SS = €258.45
```

**Result:**
```typescript
{
  input: { gross: 120000, frequency: 'annual', region: 'cataluna', filingStatus: 'married', employmentType: 'employee' },
  annual: {
    gross: 120000.00,
    taxableIncome: 118000.00,
    irpf: 39974.00,
    seguridadSocial: 3101.40,
    totalDeductions: 43075.40,
    net: 76924.60,
    effectiveRate: 35.90
  },
  monthly: {
    gross: 10000.00,
    irpf: 3331.17,
    seguridadSocial: 258.45,
    totalDeductions: 3589.62,
    net: 6410.38
  },
  breakdown: {
    personalAllowance: 8950,
    pensionContribution: 1500,
    healthInsurance: 500,
    numberOfChildren: 0
  }
}
```

---

### Example 6: Commission Calculator (Monthly, Madrid, Single)

**Input:**
- Base Salary: €35,000 (annual)
- Commission Amount: €1,200
- Commission Frequency: Monthly
- Region: Madrid
- Filing Status: Single

**Step-by-Step:**

```typescript
// Step 1: Normalize commission to annual
Annual Commission = €1,200 × 12 = €14,400

// Step 2: Calculate total compensation
Total Annual Gross = €35,000 + €14,400 = €49,400

// Step 3: Apply tax engine to TOTAL
Personal Allowance = €5,550
IRPF Base = €49,400 - €5,550 = €43,850

IRPF on €49,400:
- €0 to €12,450 @ 19%: €2,365.50
- €12,450 to €20,200 @ 24%: €1,860.00
- €20,200 to €35,200 @ 30%: €4,500.00
- €35,200 to €43,850 @ 37%: €3,200.50
Total IRPF = €11,926.00

SS on €49,400:
Monthly = €49,400 / 12 = €4,116.67
Capped at €4,070
Annual SS = €4,070 × 0.0635 × 12 = €3,101.40

Total Deductions = €11,926.00 + €3,101.40 = €15,027.40
Net Total = €49,400 - €15,027.40 = €34,372.60

// Step 4: Tax on base salary alone
IRPF Base (€35,000) = €29,450
IRPF on €35,000:
- €0 to €12,450 @ 19%: €2,365.50
- €12,450 to €20,200 @ 24%: €1,860.00
- €20,200 to €29,450 @ 30%: €2,775.00
Total IRPF (base) = €7,000.50

SS on €35,000:
Monthly = €35,000 / 12 = €2,916.67
Annual SS = €2,916.67 × 0.0635 × 12 = €2,221.67

Total Deductions (base) = €7,000.50 + €2,221.67 = €9,222.17

// Step 5: Marginal tax on commission
Commission Tax = €15,027.40 - €9,222.17 = €5,805.23
Commission Net = €14,400 - €5,805.23 = €8,594.77
Commission Effective Rate = 40.31%
```

**Result:**
```typescript
{
  input: { gross: 1200, frequency: 'monthly', baseSalary: 35000, region: 'madrid', filingStatus: 'single', employmentType: 'employee' },
  annual: {
    gross: 49400.00,
    taxableIncome: 49400.00,
    irpf: 11926.00,
    seguridadSocial: 3101.40,
    totalDeductions: 15027.40,
    net: 34372.60,
    effectiveRate: 30.42
  },
  commission: {
    gross: 14400.00,
    irpf: 4811.50,  // Proportional
    seguridadSocial: 993.73,
    totalDeductions: 5805.23,
    net: 8594.77
  }
}
```

---

### Example 7: Overtime (Employee, Valencia, Married with 2 Children)

**Input:**
- Regular Hourly Rate: €18.00
- Regular Hours: 40/week
- Overtime Hours: 8/week
- Overtime Multiplier: 1.5
- Weeks Per Year: 52
- Region: Valencia
- Filing Status: Married with children (2 children)

**Step-by-Step:**

```typescript
// Step 1: Calculate weekly pay
Regular Weekly = €18 × 40 = €720
Overtime Weekly = €18 × 1.5 × 8 = €216
Total Weekly = €720 + €216 = €936

// Step 2: Normalize to annual
Annual Gross = €936 × 52 = €48,672

// Step 3: Personal allowance (married + 2 children)
Personal Allowance = €5,550 + €3,400 + €2,400 + €2,700 = €14,050

// Step 4: Calculate IRPF
IRPF Base = €48,672 - €14,050 = €34,622

IRPF:
- €0 to €12,450 @ 19%: €2,365.50
- €12,450 to €20,200 @ 24%: €1,860.00
- €20,200 to €34,622 @ 30%: €4,326.60
Total IRPF = €8,552.10

// Step 5: Seguridad Social
Monthly Salary = €48,672 / 12 = €4,056
Annual SS = €4,056 × 0.0635 × 12 = €3,090.67

// Step 6: Totals
Total Deductions = €8,552.10 + €3,090.67 = €11,642.77
Net Annual = €48,672 - €11,642.77 = €37,029.23
Effective Rate = 23.92%

// Step 7: Calculate tax on regular pay alone (no overtime)
Regular Annual = €720 × 52 = €37,440
IRPF Base (regular) = €37,440 - €14,050 = €23,390

IRPF (regular):
- €0 to €12,450 @ 19%: €2,365.50
- €12,450 to €20,200 @ 24%: €1,860.00
- €20,200 to €23,390 @ 30%: €957.00
Total IRPF (regular) = €5,182.50

SS (regular) = (€37,440 / 12) × 0.0635 × 12 = €2,377.44

Total Deductions (regular) = €5,182.50 + €2,377.44 = €7,559.94

// Step 8: Marginal tax on overtime
Overtime Annual = €216 × 52 = €11,232
Overtime Tax = €11,642.77 - €7,559.94 = €4,082.83
Overtime Net = €11,232 - €4,082.83 = €7,149.17
```

**Result:**
```typescript
{
  input: {
    gross: 18.00,
    frequency: 'hourly',
    regularHours: 40,
    overtimeHours: 8,
    overtimeMultiplier: 1.5,
    region: 'valencia',
    filingStatus: 'married_with_children',
    employmentType: 'employee'
  },
  annual: {
    gross: 48672.00,
    taxableIncome: 48672.00,
    irpf: 8552.10,
    seguridadSocial: 3090.67,
    totalDeductions: 11642.77,
    net: 37029.23,
    effectiveRate: 23.92
  },
  overtime: {
    gross: 11232.00,
    irpf: 3006.86,
    seguridadSocial: 1075.97,
    totalDeductions: 4082.83,
    net: 7149.17
  },
  breakdown: {
    personalAllowance: 14050,
    pensionContribution: 0,
    healthInsurance: 0,
    numberOfChildren: 2
  }
}
```

---

## ✅ VALIDATION CHECKLIST

Before committing any Spain calculator implementation, verify:

### Tax Engine Validation
- [ ] IRPF brackets match 2026 rates (19%/24%/30%/37%/45%/47%)
- [ ] Personal allowance correctly applied (€5,550 base, +€3,400 married, +€2,400/€2,700/€4,000 per child)
- [ ] Seguridad Social employee rate = 6.35%, capped at €4,070/month
- [ ] Seguridad Social autónomo uses progressive scale (€230-€1,536/month)
- [ ] Pre-tax deductions capped (€1,500 pension, €500 health)
- [ ] Regional tax variations implemented (if applicable)

### Calculator Logic Validation
- [ ] **Normalize → Annual → Tax → Redistribute** pattern followed
- [ ] No tax rates entered by user
- [ ] All frequencies normalized correctly (hourly: 1,826 hrs, monthly: ×12, etc.)
- [ ] Bonus/Commission/Overtime use marginal tax calculation
- [ ] Autónomo calculator uses correct employment type
- [ ] Return structure matches specification exactly

### Output Validation
- [ ] Annual section includes: gross, taxableIncome, irpf, seguridadSocial, totalDeductions, net, effectiveRate
- [ ] Requested frequency section matches input frequency
- [ ] Breakdown includes: personalAllowance, pensionContribution, healthInsurance, numberOfChildren
- [ ] All monetary values rounded to 2 decimal places
- [ ] Effective rate calculated as: (totalDeductions / gross) × 100

### Edge Cases
- [ ] Zero income returns zero tax
- [ ] Income below personal allowance returns zero IRPF (but SS still applies for employees)
- [ ] Seguridad Social employee capped at €4,070/month
- [ ] Autónomo progressive scale handles all income brackets
- [ ] Pre-tax deductions cannot exceed maximums
- [ ] Married status increases personal allowance correctly
- [ ] Children allowances accumulate correctly (2,400 + 2,700 + 4,000/child)

---

## ⚠️ COMMON PITFALLS

### 1. Seguridad Social Cap
**WRONG:**
```typescript
const seguridadSocial = grossAnnual * 0.0635;
```

**CORRECT:**
```typescript
const monthlySalary = grossAnnual / 12;
const contributionBase = Math.min(monthlySalary, 4070);
const seguridadSocial = contributionBase * 0.0635 * 12;
```

### 2. Autónomo vs Employee
**WRONG:**
```typescript
// Using same SS rate for both
const seguridadSocial = grossAnnual * 0.0635;
```

**CORRECT:**
```typescript
if (employmentType === 'employee') {
  const monthlySalary = grossAnnual / 12;
  const contributionBase = Math.min(monthlySalary, 4070);
  seguridadSocial = contributionBase * 0.0635 * 12;
} else {
  seguridadSocial = calculateSeguridadSocialAutonomo(grossAnnual);
}
```

### 3. Personal Allowance Before IRPF
**WRONG:**
```typescript
const irpf = calculateProgressiveTax(grossAnnual, IRPF_BRACKETS);
```

**CORRECT:**
```typescript
const irpfBase = Math.max(0, taxableIncome - personalAllowance);
const irpf = calculateProgressiveTax(irpfBase, IRPF_BRACKETS);
```

### 4. Bonus/Commission Tax Rate
**WRONG:**
```typescript
// Applying average tax rate to bonus
const bonusTax = bonusAmount * effectiveRate;
```

**CORRECT:**
```typescript
// Marginal tax rate
const totalTax = calculateSpainTax(baseSalary + bonusAmount);
const baseTax = calculateSpainTax(baseSalary);
const bonusTax = totalTax.totalDeductions - baseTax.totalDeductions;
```

### 5. Pre-Tax Deduction Caps
**WRONG:**
```typescript
const taxableIncome = grossAnnual - pensionContribution - healthInsurance;
```

**CORRECT:**
```typescript
const validPension = Math.min(pensionContribution, 1500);
const validHealth = Math.min(healthInsurance, 500);
const taxableIncome = grossAnnual - validPension - validHealth;
```

### 6. Regional Tax Variations
**WRONG:**
```typescript
// Ignoring region parameter
const irpf = calculateProgressiveTax(irpfBase, IRPF_BRACKETS);
```

**CORRECT:**
```typescript
const brackets = REGIONAL_BRACKETS[region] || IRPF_BRACKETS_STANDARD;
const irpf = calculateProgressiveTax(irpfBase, brackets);
```

### 7. Children Allowance Accumulation
**WRONG:**
```typescript
const childAllowance = numberOfChildren * 2400;
```

**CORRECT:**
```typescript
let childAllowance = 0;
if (numberOfChildren >= 1) childAllowance += 2400;
if (numberOfChildren >= 2) childAllowance += 2700;
if (numberOfChildren >= 3) childAllowance += 4000 * (numberOfChildren - 2);
```

---

## 🎯 STRICT CURSOR/CLAUDE INSTRUCTIONS

When implementing Spain calculators:

### DO:
1. **Always** follow Normalize → Annual → Tax → Redistribute
2. **Always** use single `calculateSpainTax()` function
3. **Always** apply personal allowance before IRPF
4. **Always** cap Seguridad Social employee at €4,070/month
5. **Always** use progressive scale for autónomo SS
6. **Always** cap pre-tax deductions (€1,500 pension, €500 health)
7. **Always** calculate marginal tax for bonus/commission/overtime
8. **Always** return complete result structure with breakdowns
9. **Always** round monetary values to 2 decimal places
10. **Always** validate edge cases (zero income, below allowance, etc.)

### DON'T:
1. **Never** let user enter tax rates
2. **Never** calculate tax without normalizing to annual first
3. **Never** apply IRPF to gross income directly (subtract allowance first)
4. **Never** use same SS rate for employee and autónomo
5. **Never** forget to cap employee SS at monthly maximum
6. **Never** apply average tax rate to bonus/commission (use marginal)
7. **Never** exceed pre-tax deduction limits
8. **Never** ignore filing status when calculating personal allowance
9. **Never** forget to include children allowances
10. **Never** duplicate tax calculation logic across calculators

### Testing Requirements:
- Test with at least 3 income levels: low (<€20k), medium (€35-50k), high (>€100k)
- Test all filing statuses: single, married, married_with_children (1, 2, 3+ children), head_of_household
- Test both employment types: employee and autónomo
- Test with and without pre-tax deductions
- Test edge cases: zero income, below personal allowance, above SS cap
- Test all regions (at minimum: Madrid, Cataluña, Valencia, País Vasco, Navarra)
- Verify marginal tax calculations for bonus/commission/overtime

---

## 📚 ADDITIONAL NOTES

### Tax Year 2026
All calculations based on 2026 Spanish tax law. Update brackets and thresholds annually.

### Regional Differences
- Most regions follow national brackets with minor adjustments
- **País Vasco** and **Navarra** have foral (autonomous) tax systems with different brackets
- Implement region-specific brackets only if accurate data available; otherwise use standard

### Autónomo System
- New system (2023+) bases contributions on real income
- Progressive scale from €230/month to €1,536/month
- Replaces old flat-rate system

### Pre-Tax Deductions
- Pension: Max €1,500/year (Plan de Pensiones)
- Health Insurance: Max €500/year
- Other deductions (mortgage, etc.) not included in this calculator

### Working Hours
- Standard: 1,826 hours/year (accounts for holidays)
- Can be customized per calculator

---

## 🚀 IMPLEMENTATION PRIORITY

1. **Monthly → Salary** (Most common in Spain)
2. **Annual → Salary**
3. **Hourly → Salary**
4. **Self-Employed Calculator (Autónomo)**
5. **Bonus Calculator**
6. **Commission Calculator**
7. **Overtime Calculator**
8. **Weekly → Salary**
9. **Bi-Weekly → Salary**
10. **Daily → Salary**
11. **Quarterly → Salary**
12. **Semi-Annual → Salary**

---

**End of Spain Master Specification**

This document is production-ready and contains all information needed for Claude/Cursor to implement the complete Spain salary calculator system.
