# 🇺🇸 UNITED STATES – CALCULATOR SYSTEM (MASTER SPECIFICATION)

**Status:** ✅ Production Standard
**Date:** January 14, 2026
**Applies To:** ALL USA calculators

---

## Scope

This specification applies to ALL USA calculators:

1. Salary Calculator (Gross → Net)
2. Salary After Tax
3. Take-Home Pay Calculator
4. Hourly → Salary Calculator
5. Weekly / Monthly / Daily → Salary
6. Overtime Pay Calculator
7. Bonus Tax Calculator
8. Commission Calculator

**All of these share the same tax engine.**

---

## 1️⃣ CORE DESIGN PRINCIPLES (VERY IMPORTANT)

### 🔒 NO TAX YEAR INPUT

- **Do NOT** ask user for tax year
- **Always** use latest current US federal + state rules
- **Update** rules centrally (config-based)

### 🔒 USER NEVER ENTERS TAX RATES

Users must **NEVER** input:
- ❌ Federal tax %
- ❌ State tax %
- ❌ Social Security %
- ❌ Medicare %
- ❌ Tax brackets
- ❌ Standard deduction

**These are auto-calculated.**

---

## 2️⃣ MASTER INPUT SPECIFICATION

### 1️⃣ Core Inputs (Always Visible)

#### 1. Gross Pay Amount
- **Type:** Number
- **Label:** Gross Income
- **Unit:** USD ($)
- **Required:** Yes
- **Description:** Total gross income before any taxes or deductions.

#### 2. Pay Frequency
- **Type:** Select
- **Options:**
  - Annual
  - Monthly
  - Weekly
  - Bi-Weekly
  - Hourly
- **Default:** Annual

**Internal Logic:**
Convert all values to annual gross income:

| Frequency | Formula |
|-----------|---------|
| Annual | amount |
| Monthly | amount × 12 |
| Weekly | amount × 52 |
| Bi-Weekly | amount × 26 |
| Hourly | amount × workingHours |

#### 3. Filing Status
- **Type:** Select
- **Options:**
  - Single
  - Married Filing Jointly
  - Married Filing Separately
  - Head of Household
- **Required:** Yes

**Logic:**
Determines:
- Federal tax brackets
- Standard deduction
- Medicare threshold

#### 4. State
- **Type:** Select
- **Options:** All 50 US states + Washington DC
- **Required:** Yes

**Logic:**
- Automatically applies state income tax
- Supports:
  - No-tax states (TX, FL, WA, etc.)
  - Flat tax states
  - Progressive tax states

#### 5. Employment Type
- **Type:** Select
- **Options:**
  - Employee
  - Self-Employed (Contractor)
- **Default:** Employee

**Logic:**
- **Employee** → normal FICA split
- **Self-employed** → full SE tax (15.3%)

---

### 2️⃣ Optional Advanced Inputs (Collapsed)

#### 6. Retirement Contributions (Pre-Tax)
- **Type:** Number
- **Label:** 401(k) / Traditional IRA
- **Unit:** USD / year
- **Default:** 0

**Logic:**
- Reduces federal taxable income
- Capped by IRS limits
- Roth contributions are NOT deducted

#### 7. Health Insurance (Pre-Tax)
- **Type:** Number
- **Unit:** USD / year
- **Default:** 0

**Logic:**
- Deducted before federal + FICA if employer-sponsored

#### 8. HSA Contribution
- **Type:** Number
- **Unit:** USD / year
- **Default:** 0

**Logic:**
- Fully pre-tax deduction
- Limited by IRS cap

#### 9. Dependents
- **Type:** Number
- **Default:** 0

**Logic:**
- Used for Child Tax Credit estimation
- Does NOT alter tax brackets directly

#### 10. Other Pre-Tax Deductions
- **Type:** Number
- **Unit:** USD / year
- **Default:** 0

**Examples:**
- Commuter benefits
- Employer benefits

---

### 3️⃣ Power User Overrides (Hidden)

#### 11. Additional Withholding
- **Type:** Number
- **Unit:** USD / year
- **Default:** 0

**Logic:**
- Added to total tax
- Does not affect brackets

#### 12. Working Hours (Hourly Only)
- **Type:** Number
- **Default:** 2080

**Logic:**
- Used only for hourly → annual conversion

---

## 3️⃣ AUTO-CALCULATED (NOT USER INPUT)

Claude / Cursor must calculate internally:

✅ Federal income tax
✅ State income tax
✅ Social Security tax
✅ Medicare tax
✅ Additional Medicare tax
✅ Total tax
✅ Net income

❌ **Never ask user for these**

---

## 4️⃣ FORMULA LOGIC (USA)

### Step 1: Annual Gross Income
```
annualGross = convertFrequencyToAnnual(inputAmount)
```

### Step 2: Pre-Tax Deductions
```
taxableIncome =
  annualGross
  − 401k
  − healthInsurance
  − HSA
  − otherPreTax
  − standardDeduction
```

(Standard deduction depends on filing status)

### Step 3: Federal Income Tax
- Progressive IRS brackets
- Apply marginal rates only to portions
- Filing status specific

### Step 4: State Income Tax
- Based on selected state
- Supports:
  - Progressive
  - Flat
  - Zero tax states

### Step 5: Social Security Tax

**Employee:**
```
SS = min(annualGross, SS_WAGE_CAP) × 6.2%
```

**Self-Employed:**
```
SS = min(annualGross, SS_WAGE_CAP) × 12.4%
```

### Step 6: Medicare Tax

**Base:**
```
Medicare = annualGross × 1.45%
```

**Additional Medicare:**
```
if income > threshold:
  additionalMedicare = excess × 0.9%
```

Threshold depends on filing status.

### Step 7: Total Tax
```
totalTax =
  federalTax
  + stateTax
  + socialSecurity
  + medicare
  + additionalWithholding
```

### Step 8: Net Income
```
netIncome = annualGross − totalTax
```

---

## 5️⃣ REQUIRED OUTPUTS

Claude must return:

### Core Outputs
- Gross Annual Income
- Federal Income Tax
- State Income Tax
- Social Security Tax
- Medicare Tax
- Total Tax
- Net Annual Pay

### Time Breakdown
- Net Monthly Pay
- Net Weekly Pay
- Net Hourly Pay

### Analytics
- Effective Tax Rate (%)

---

## 6️⃣ SPECIAL LOGIC BY CALCULATOR TYPE

### 🔹 Salary / Gross → Net
Uses `annualGross` directly

### 🔹 Hourly → Salary
```
annualGross = hourlyRate × workingHours
```

### 🔹 Weekly / Monthly / Daily
Normalize → annual → tax → redistribute

### 🔹 Overtime Pay Calculator

**Inputs:**
- Base hourly rate
- Overtime hours
- Overtime multiplier (default 1.5)

```
overtimePay = overtimeHours × hourlyRate × multiplier
annualGross = basePay + overtimePay
```

### 🔹 Bonus Tax Calculator

**Inputs:**
- Bonus amount
- Bonus tax method:
  - Supplemental flat rate
  - Combined with salary

Apply IRS bonus rules automatically.

### 🔹 Commission Calculator

**Inputs:**
- Base salary
- Commission amount

Commission treated as supplemental income.

---

## 7️⃣ STRICT INSTRUCTION FOR CURSOR / CLAUDE

**IMPORTANT:**
- ⚠️ Do NOT ask user for tax year.
- ✅ Always use the latest US federal and state tax rules.
- ✅ All taxes must be auto-calculated.
- ❌ Users must never input tax rates or deductions controlled by law.

---

## 8️⃣ IMPLEMENTATION STATUS

### Current Implementation Review

**File:** `components/calculators/SalaryCalculator.tsx`

**Status:** 🟡 Needs Updates

### Required Updates:

1. ✅ Remove tax year input (already done)
2. 🟡 Add all core inputs (Filing Status, State, Employment Type)
3. 🟡 Add optional advanced inputs (collapsed section)
4. 🟡 Implement complete tax calculation engine
5. 🟡 Add all required outputs

### Tax Calculation Engine

**File:** `lib/tax-calculations.ts`

**Status:** 🟡 Partial Implementation

**Needs:**
- Complete federal tax brackets (all filing statuses)
- All 50 states + DC tax logic
- Self-employment tax calculation
- Additional Medicare tax
- Standard deduction by filing status

---

## 9️⃣ NEXT STEPS

1. ✅ Master spec documented
2. 🔄 Audit current calculator against spec
3. 🔄 Update SalaryCalculator component
4. 🔄 Update tax calculation engine
5. 🔄 Test all calculator modes
6. 🔄 Create content for remaining US calculators

---

**This is the gold standard. All other countries will follow this structure.**
