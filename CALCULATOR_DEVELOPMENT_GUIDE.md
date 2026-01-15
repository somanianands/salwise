# Calculator Development Guide

**Purpose:** Complete guide for building new calculators and adding new countries
**Date:** January 14, 2026
**Version:** 2.0

---

## 🎯 Key Learnings from Development

### 1. URL MUST MATCH UI Labels

**CRITICAL RULE:** The calculator URL must match what the user sees in the UI.

**❌ BAD Example:**
```
URL: /monthly-to-salary-calculator
UI Shows: "Hourly Rate"
Result: USER CONFUSED!
```

**✅ GOOD Example:**
```
URL: /monthly-to-salary-calculator
UI Shows: "Monthly Salary"
Result: Clear and intuitive
```

### 2. Default Values Must Be Realistic

**CRITICAL RULE:** Default values should match typical real-world values for that calculator type.

**❌ BAD:**
- Hourly calculator: $100,000 default (unrealistic for hourly workers)
- Monthly calculator: $10,000 default (too high for most workers)

**✅ GOOD:**
- Hourly calculator: $25/hour default (realistic hourly wage)
- Monthly calculator: $4,500/month default (realistic monthly salary)
- Contractor: $80,000 gross with $8,000 expenses (10% ratio)

### 3. Only Show Relevant Input Fields

**CRITICAL RULE:** Don't show fields that aren't needed for that calculator type.

**Example - Monthly Salary Calculator:**
- ✅ Show: "Monthly Salary" input
- ❌ Don't show: "Hours/Week" (not relevant for monthly salary)

### 4. Calculator-Specific Outputs Are Essential

**CRITICAL RULE:** Each calculator type needs unique outputs showing its specific insights.

**Example:**
- **Overtime:** Must show regular vs overtime pay split
- **Bonus:** Must show how much tax is paid on just the bonus
- **Commission:** Must show commission as % of base
- **Contractor:** Must show business expenses and self-employment tax

---

## 📚 Architecture Overview

### File Structure

```
salarycalculators/
├── app/
│   └── calculators/
│       └── [country]/
│           ├── page.tsx                    # Country overview (lists all calculators)
│           └── [type]/
│               └── page.tsx                # Individual calculator page
├── components/
│   └── calculators/
│       ├── SalaryCalculator.tsx            # Main calculator component
│       ├── TaxBreakdownChart.tsx           # Pie chart visualization
│       ├── AdvancedOptions.tsx             # Country-specific options
│       └── SkeletonLoader.tsx              # Loading state
├── lib/
│   ├── types.ts                            # Country definitions
│   ├── calculator-types.ts                 # Calculator type definitions
│   └── calculators/
│       ├── index.ts                        # Main calculation logic
│       ├── overtime.ts                     # Overtime calculator
│       ├── bonus.ts                        # Bonus tax calculator
│       ├── commission.ts                   # Commission calculator
│       └── contractor.ts                   # Self-employed calculator
└── docs/
    ├── CALCULATOR_DEVELOPMENT_GUIDE.md     # This file
    ├── CALCULATOR_FIELDS_REVIEW.md         # Field reference
    └── COMPLETE_IMPLEMENTATION.md          # Implementation docs
```

---

## 🛠️ How to Add a New Calculator Type

### Step 1: Define Calculator Type

**File:** `lib/calculator-types.ts`

```typescript
// 1. Add to CalculatorType union
export type CalculatorType =
  | 'salary-calculator'
  // ... existing types ...
  | 'your-new-calculator';  // Add here

// 2. Add to CALCULATORS object
export const CALCULATORS: Record<CalculatorType, CalculatorInfo> = {
  // ... existing calculators ...
  'your-new-calculator': {
    type: 'your-new-calculator',
    name: 'Your New Calculator',
    slug: 'your-new-calculator',
    description: 'Clear description of what it calculates',
    category: 'salary', // or 'hourly-time', 'overtime-bonus', 'contractor'
    icon: '🎯',
    keywords: ['keyword1', 'keyword2']
  }
};
```

### Step 2: Create Calculator Logic (if needed)

**File:** `lib/calculators/your-calculator.ts`

```typescript
import { SalaryCalculation, Country } from '../types';
import { calculateGrossToNet, CalculatorOptions } from './index';

export interface YourCalculatorOptions {
  input1: number;
  input2: number;
}

export function calculateYourCalculator(
  options: YourCalculatorOptions,
  country: Country,
  calculatorOptions: CalculatorOptions = {}
): SalaryCalculation & { yourBreakdown: { /* your data */ } } {
  const { input1, input2 } = options;

  // Your calculation logic here
  const result = input1 + input2;

  // Use existing tax calculation
  const taxCalculation = calculateGrossToNet(country, result, calculatorOptions);

  // Return with your custom breakdown
  return {
    ...taxCalculation,
    yourBreakdown: {
      input1,
      input2,
      result
    }
  };
}
```

### Step 3: Add Mode Mapping

**File:** `app/calculators/[country]/[type]/page.tsx`

```typescript
// 1. Add to CalculatorMode type
type CalculatorMode = 'gross-to-net' | 'net-to-gross' | 'your-mode';

// 2. Add to mode map
const CALCULATOR_MODE_MAP: Record<string, CalculatorMode> = {
  // ... existing mappings ...
  'your-new-calculator': 'your-mode'
};
```

### Step 4: Update Calculator Component

**File:** `components/calculators/SalaryCalculator.tsx`

```typescript
// 1. Add to CalculatorMode type
type CalculatorMode = 'gross-to-net' | /* ... */ | 'your-mode';

// 2. Add default value
const getDefaultInputValue = () => {
  // ... existing conditions ...
  if (mode === 'your-mode') return '1000'; // Realistic default
  return '75000';
};

// 3. Add state variables (if needed)
const [yourInput, setYourInput] = useState<string>('1000');

// 4. Add label
<label>
  {mode === 'your-mode' && 'Your Input Label'}
  {/* ... other modes ... */}
</label>

// 5. Add calculation logic
if (mode === 'your-mode') {
  const value1 = parseFloat(yourInput) || 1000;
  calculation = calculateYourCalculator({ input1: value1 }, country, calculatorOptions);
}

// 6. Add input fields (if needed)
{mode === 'your-mode' && (
  <motion.div>
    <div className="flex items-center gap-3">
      <label>Your Extra Field</label>
      <input
        type="number"
        value={yourInput}
        onChange={(e) => setYourInput(e.target.value)}
        placeholder="1000"
      />
    </div>
  </motion.div>
)}

// 7. Add unique output section (optional)
{mode === 'your-mode' && (result as any).yourBreakdown && (
  <motion.div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg shadow-sm p-3">
    <h3>🎯 Your Calculator Breakdown</h3>
    <div className="space-y-2">
      <div className="flex justify-between">
        <span>Input 1</span>
        <span>{formatCurrency((result as any).yourBreakdown.input1)}</span>
      </div>
      {/* More breakdown fields */}
    </div>
  </motion.div>
)}

// 8. Update useEffect dependencies
useEffect(() => {
  // ... existing timer ...
}, [inputValue, /* ... existing deps ... */, yourInput, mode]);
```

---

## 🌍 How to Add a New Country

### Step 1: Add Country to Types

**File:** `lib/types.ts`

```typescript
// 1. Add country code to Country type
export type Country = 'US' | 'UK' | /* ... */ | 'XX';  // Your country code

// 2. Add country info
export const COUNTRIES: Record<Country, CountryInfo> = {
  // ... existing countries ...
  XX: {
    name: 'Your Country',
    code: 'XX',
    currency: 'XXX',  // Currency code (e.g., 'USD', 'EUR')
    currencySymbol: '$',  // Symbol to display
    taxYear: 2024,
    flag: '🇽🇽'  // Country flag emoji
  }
};
```

### Step 2: Add Tax Calculation Logic

**File:** `lib/calculators/index.ts`

```typescript
// Add tax brackets and rates
const TAX_BRACKETS_XX: TaxBracket[] = [
  { min: 0, max: 10000, rate: 0 },      // Tax-free allowance
  { min: 10000, max: 30000, rate: 0.10 },  // 10% bracket
  { min: 30000, max: 60000, rate: 0.20 },  // 20% bracket
  { min: 60000, max: Infinity, rate: 0.30 } // 30% top rate
];

// Add to calculateGrossToNet function
export function calculateGrossToNet(
  country: Country,
  grossSalary: number,
  options: CalculatorOptions = {}
): SalaryCalculation {

  // ... existing code ...

  if (country === 'XX') {
    // Tax calculation
    const incomeTax = calculateProgressiveTax(grossSalary, TAX_BRACKETS_XX);

    // Social security (if applicable)
    const socialSecurity = grossSalary * 0.08; // 8% social security

    // Total deductions
    const totalTax = incomeTax;
    const totalDeductions = incomeTax + socialSecurity;
    const netSalary = grossSalary - totalDeductions;

    return {
      grossSalary,
      netSalary,
      totalTax,
      socialSecurity,
      otherDeductions: 0,
      effectiveTaxRate: (totalDeductions / grossSalary) * 100,
      breakdown: [
        {
          label: 'Gross Salary',
          amount: grossSalary,
          rate: 100,
          color: '#3b82f6'
        },
        {
          label: 'Income Tax',
          amount: incomeTax,
          rate: (incomeTax / grossSalary) * 100,
          color: '#ef4444'
        },
        {
          label: 'Social Security',
          amount: socialSecurity,
          rate: (socialSecurity / grossSalary) * 100,
          color: '#f59e0b'
        },
        {
          label: 'Net Salary',
          amount: netSalary,
          rate: (netSalary / grossSalary) * 100,
          color: '#10b981'
        }
      ]
    };
  }

  // ... rest of function ...
}
```

### Step 3: Add Self-Employment Tax Rates (for contractor calculators)

**File:** `lib/calculators/contractor.ts`

```typescript
const SELF_EMPLOYMENT_RATES: Record<Country, { rate: number; name: string; description: string }> = {
  // ... existing countries ...
  XX: {
    rate: 0.15,  // 15% self-employment tax
    name: 'SE Tax',
    description: '15% self-employment tax'
  }
};
```

### Step 4: Add Advanced Options (Optional)

**File:** `components/calculators/AdvancedOptions.tsx`

Add country-specific options like:
- State/province selection (if applicable)
- Retirement contributions
- Dependents
- Regional tax variations

```typescript
// Add your country-specific options
{country === 'XX' && (
  <>
    <div className="space-y-1">
      <label>Your Region</label>
      <select
        value={options.yourRegion || ''}
        onChange={(e) => handleChange('yourRegion', e.target.value)}
      >
        <option value="">Select region...</option>
        <option value="region1">Region 1</option>
        <option value="region2">Region 2</option>
      </select>
    </div>
  </>
)}
```

---

## ✅ Validation Checklist

Before launching a new calculator or country:

### Calculator Checklist:
- [ ] URL slug matches calculator purpose
- [ ] Label matches URL (e.g., "Monthly Salary" for monthly-to-salary)
- [ ] Default values are realistic for that calculator type
- [ ] Only relevant input fields are shown
- [ ] Calculation logic is correct
- [ ] Has unique output section (if applicable)
- [ ] Placeholders match default values
- [ ] Mode mapping is correct
- [ ] All edge cases handled (0 values, very high values)

### Country Checklist:
- [ ] Tax brackets are accurate for current year
- [ ] Social security rates are correct
- [ ] Currency symbol displays properly
- [ ] Progressive tax calculation works correctly
- [ ] Self-employment tax rate added (if applicable)
- [ ] Regional variations implemented (if applicable)
- [ ] Advanced options added (if applicable)
- [ ] All 16 calculator types work for this country
- [ ] Tested with various income levels

---

## 🎨 UI/UX Best Practices

### 1. Labels
- Use clear, unambiguous labels
- "Regular Hourly Rate" not "Regular Rate"
- "Monthly Salary" not "Salary"
- "Business Expenses" not "Expenses"

### 2. Default Values
- Should be realistic for that calculator type
- Hourly: $20-$30/hour
- Daily: $150-$250/day
- Weekly: $800-$1200/week
- Monthly: $3500-$5000/month
- Annual: $60k-$80k/year
- Contractor: $80k with 10% expenses

### 3. Input Fields
- Only show fields relevant to that calculator
- Use appropriate input types (number, select)
- Add placeholders that match defaults
- Enable auto-select on focus for easy editing

### 4. Output Sections
- Standard outputs for all calculators:
  - Summary cards (Gross, Net, Deductions)
  - Frequency breakdown table
  - Tax breakdown chart
  - Detailed tax breakdown list
- Unique outputs for specific calculators:
  - Overtime: Regular vs OT pay
  - Bonus: Incremental tax on bonus
  - Commission: Commission as % of base
  - Contractor: Expenses + SE tax

### 5. Colors
Use consistent color coding:
- Blue: Gross/income amounts
- Green: Net/take-home amounts
- Red: Taxes/deductions
- Orange: Special items (SE tax, OT pay)
- Purple: Bonus-related
- Teal: Commission-related
- Amber: Contractor-related

---

## 🧮 Calculation Formulas

### Time-Based Conversions

```typescript
// Hourly to Annual
annual = hourlyRate * hoursPerWeek * 52

// Daily to Annual (assumes 5-day work week)
annual = dailyRate * 5 * 52  // = dailyRate * 260

// Weekly to Annual
annual = weeklyRate * 52

// Monthly to Annual
annual = monthlyRate * 12
```

### Overtime Calculation

```typescript
// Regular pay
regularPayAnnual = regularRate * regularHours * 52

// Overtime pay
overtimeRate = regularRate * multiplier  // 1.5, 2, or 2.5
overtimePayAnnual = overtimeRate * overtimeHours * 52

// Total
totalGross = regularPayAnnual + overtimePayAnnual
```

### Progressive Tax

```typescript
function calculateProgressiveTax(income: number, brackets: TaxBracket[]): number {
  let totalTax = 0;

  for (const bracket of brackets) {
    if (income > bracket.min) {
      const taxableInBracket = Math.min(
        income - bracket.min,
        bracket.max - bracket.min
      );
      totalTax += taxableInBracket * bracket.rate;
    }
  }

  return totalTax;
}
```

### Self-Employment Tax

```typescript
// Gross income minus deductible expenses
netBusinessIncome = grossIncome - businessExpenses

// Self-employment tax (country-specific rate)
selfEmploymentTax = netBusinessIncome * seRate

// Income tax on net business income
incomeTax = calculateProgressiveTax(netBusinessIncome, taxBrackets)

// Net income after all taxes
netIncome = netBusinessIncome - selfEmploymentTax - incomeTax
```

### Bonus Tax (Incremental Method)

```typescript
// Tax on base salary only
baseTax = calculateTax(baseSalary)

// Tax on base + bonus
totalTax = calculateTax(baseSalary + bonus)

// Incremental tax on just the bonus
bonusTax = totalTax - baseTax

// Net bonus received
netBonus = bonus - bonusTax
```

---

## 🐛 Common Issues and Fixes

### Issue 1: Calculator shows wrong input label
**Symptom:** URL says "monthly-to-salary" but shows "Hourly Rate"
**Fix:** Check CALCULATOR_MODE_MAP - ensure each calculator type has correct mode

### Issue 2: Default value too high/low
**Symptom:** Calculator shows $100,000 default for hourly rate
**Fix:** Update getDefaultInputValue() with realistic values for each mode

### Issue 3: Unnecessary fields showing
**Symptom:** "Hours/Week" showing on monthly salary calculator
**Fix:** Add conditional rendering: `{mode === 'hourly' && <HoursField />}`

### Issue 4: Wrong calculation result
**Symptom:** Monthly salary of $4,000 shows incorrect annual
**Fix:** Check conversion formula - should be `monthly * 12` not `monthly * 52`

### Issue 5: Missing unique breakdown
**Symptom:** Overtime calculator doesn't show OT breakdown
**Fix:** Ensure calculator function returns custom breakdown object

---

## 📈 Performance Considerations

### Auto-calculate Debounce
- Use 500ms debounce for input changes
- Prevents excessive calculations while typing
- Provides smooth user experience

```typescript
useEffect(() => {
  const timer = setTimeout(() => {
    handleCalculate();
  }, 500);
  return () => clearTimeout(timer);
}, [inputValue, /* deps */]);
```

### Static Site Generation
- All 160 calculator pages pre-generated at build time
- Fast page loads (< 100ms)
- SEO optimized

```typescript
export async function generateStaticParams() {
  // Generate all country × calculator type combinations
  const params = [];
  for (const country of countries) {
    for (const type of calculatorTypes) {
      params.push({ country, type });
    }
  }
  return params;
}
```

---

## 🎓 Key Takeaways

1. **URL = UI**: Calculator URL must match UI labels exactly
2. **Realistic Defaults**: Use real-world values for default inputs
3. **Relevant Fields Only**: Don't show unnecessary input fields
4. **Unique Outputs**: Each calculator type needs specific insights
5. **Clear Labels**: Be explicit - "Regular Hourly Rate" not "Rate"
6. **Test Thoroughly**: Check all calculators for all countries
7. **Document Everything**: Future developers need clear guidance

---

## 📝 Example: Adding a Pension Calculator

Let's walk through adding a complete new calculator:

### 1. Define Type
```typescript
// lib/calculator-types.ts
'pension-calculator': {
  type: 'pension-calculator',
  name: 'Pension Calculator',
  slug: 'pension-calculator',
  description: 'Calculate your pension contributions and tax relief',
  category: 'salary',
  icon: '🏦',
  keywords: ['pension', 'retirement', '401k', 'contributions']
}
```

### 2. Create Logic
```typescript
// lib/calculators/pension.ts
export interface PensionOptions {
  grossSalary: number;
  employeeContribution: number; // percentage
  employerContribution: number; // percentage
}

export function calculatePension(
  options: PensionOptions,
  country: Country,
  calculatorOptions: CalculatorOptions = {}
): SalaryCalculation & { pensionBreakdown: any } {
  const { grossSalary, employeeContribution, employerContribution } = options;

  const employeeAmount = grossSalary * (employeeContribution / 100);
  const employerAmount = grossSalary * (employerContribution / 100);
  const totalPension = employeeAmount + employerAmount;

  // Pension contributions are pre-tax, so reduce taxable income
  const taxableIncome = grossSalary - employeeAmount;
  const taxCalculation = calculateGrossToNet(country, taxableIncome, calculatorOptions);

  return {
    ...taxCalculation,
    netSalary: taxCalculation.netSalary, // Already reduced by pension
    pensionBreakdown: {
      employeeContribution: employeeAmount,
      employerContribution: employerAmount,
      totalPension,
      taxRelief: employeeAmount * 0.2 // Simplified
    }
  };
}
```

### 3. Add Mode
```typescript
// app/calculators/[country]/[type]/page.tsx
type CalculatorMode = /* ... */ | 'pension';

const CALCULATOR_MODE_MAP = {
  // ...
  'pension-calculator': 'pension'
};
```

### 4. Update Component
```typescript
// components/calculators/SalaryCalculator.tsx
const [employeeContribution, setEmployeeContribution] = useState<string>('5');
const [employerContribution, setEmployerContribution] = useState<string>('3');

// In calculation logic:
if (mode === 'pension') {
  const empContr = parseFloat(employeeContribution) || 5;
  const emprContr = parseFloat(employerContribution) || 3;

  calculation = calculatePension({
    grossSalary: value,
    employeeContribution: empContr,
    employerContribution: emprContr
  }, country, calculatorOptions);
}

// In UI:
{mode === 'pension' && (
  <>
    <div className="flex items-center gap-3">
      <label>Employee Contribution %</label>
      <input
        type="number"
        value={employeeContribution}
        onChange={(e) => setEmployeeContribution(e.target.value)}
        placeholder="5"
      />
    </div>
    <div className="flex items-center gap-3">
      <label>Employer Contribution %</label>
      <input
        type="number"
        value={employerContribution}
        onChange={(e) => setEmployerContribution(e.target.value)}
        placeholder="3"
      />
    </div>
  </>
)}

// Unique output:
{mode === 'pension' && (result as any).pensionBreakdown && (
  <motion.div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-lg shadow-sm p-3">
    <h3>🏦 Pension Breakdown</h3>
    <div className="space-y-2">
      <div className="flex justify-between">
        <span>Your Contribution</span>
        <span>{formatCurrency((result as any).pensionBreakdown.employeeContribution)}</span>
      </div>
      <div className="flex justify-between">
        <span>Employer Contribution</span>
        <span>{formatCurrency((result as any).pensionBreakdown.employerContribution)}</span>
      </div>
      <div className="flex justify-between">
        <span>Tax Relief</span>
        <span className="text-green-600">+{formatCurrency((result as any).pensionBreakdown.taxRelief)}</span>
      </div>
      <div className="flex justify-between border-t pt-2">
        <span className="font-medium">Total Pension Pot</span>
        <span className="font-bold">{formatCurrency((result as any).pensionBreakdown.totalPension)}</span>
      </div>
    </div>
  </motion.div>
)}
```

### 5. Test
- Test with various salary levels
- Test with different contribution percentages
- Verify tax relief is correct
- Check output is clear and helpful
- Test on all 10 countries

---

## 🔗 Additional Resources

- [Tax Calculation Logic](lib/calculators/index.ts)
- [Calculator Component](components/calculators/SalaryCalculator.tsx)
- [Type Definitions](lib/calculator-types.ts)
- [Country Definitions](lib/types.ts)

---

**Version:** 2.0
**Last Updated:** January 14, 2026
**Status:** ✅ Production Ready
