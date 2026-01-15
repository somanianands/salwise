# 🇬🇧 UNITED KINGDOM CALCULATOR SYSTEM (MASTER SPECIFICATION)

**Status:** ✅ Production Standard
**Date:** January 14, 2026
**Tax Year:** 2025/2026
**Currency:** GBP (£)

---

## Calculators Covered

| Calculator | URL Slug |
|-----------|----------|
| Salary Calculator | `/salary-calculator` |
| Gross to Net Calculator | `/gross-to-net-calculator` |
| Net to Gross Calculator | `/net-to-gross-salary-calculator` |
| Hourly to Salary | `/hourly-to-salary-calculator` |
| Hourly Rate Calculator | `/hourly-rate-calculator` |
| Weekly to Salary | `/weekly-to-salary-calculator` |
| Monthly to Salary | `/monthly-to-salary-calculator` |
| Daily to Salary | `/daily-to-salary-calculator` |
| Overtime Pay Calculator | `/overtime-pay-calculator` |
| Bonus Tax Calculator | `/bonus-tax-calculator` |
| Commission Calculator | `/commission-calculator` |

---

## 1️⃣ CORE DESIGN RULES (VERY IMPORTANT)

### 🔒 NO TAX YEAR INPUT
- ❌ User never selects tax year
- ✅ Always use latest 2025/2026 UK rules
- ✅ Update rules centrally (config-based)

### 🔒 USER NEVER ENTERS TAX RATES
- ❌ No income tax rates / bands
- ❌ No National Insurance rates
- ❌ No student loan rates / thresholds
- ❌ No personal allowance input
- ✅ All tax logic is automatic

### ✅ CORE PRINCIPLE
**Normalize → Annual → Apply Tax Engine → Redistribute**

All calculators:
1. Normalize input to annual gross income
2. Apply UK tax engine (PAYE + NI + Student Loan + Pension)
3. Redistribute net results to desired output frequency

---

## 2️⃣ MASTER INPUT SPECIFICATION

### A. Core Inputs (Always Visible)

#### 1. Gross Pay Amount
- **Type:** Number
- **Currency:** GBP (£)
- **Required:** Yes
- **Description:** Total gross income before taxes

#### 2. Pay Frequency
- **Type:** Select
- **Options:**
  - Annual
  - Monthly
  - Weekly
  - Daily
  - Hourly
- **Used For:** Normalizing to annual income internally
- **Note:** This is for input normalization, NOT for setting tax calculation period

#### 3. Tax Code
- **Type:** Text / Select
- **Default:** `1257L`
- **Common Options:**
  - `1257L` (Standard - £12,570 personal allowance)
  - `BR` (Basic Rate - No personal allowance)
  - `D0` (Higher Rate - No personal allowance)
  - `D1` (Additional Rate - No personal allowance)
  - `NT` (No Tax)
  - Custom codes (e.g., `1200L`, `K100`)
- **Purpose:** Determines personal allowance automatically

#### 4. Pension Scheme
- **Type:** Select
- **Options:**
  - None
  - Auto-Enrolment (Workplace Pension)
  - Other
- **Default:** None
- **Note:** Auto-enrolment = minimum 5% employee + 3% employer (employee portion is pre-tax)

#### 5. Student Loan Plan
- **Type:** Select
- **Options:**
  - None (No student loan)
  - Plan 1 (Pre-2012)
  - Plan 2 (Post-2012 England/Wales)
  - Plan 4 (Scotland)
  - Postgraduate Loan
- **Default:** None

### B. Optional Advanced Inputs (Collapsed / Hidden)

#### 6. Additional Pension Contribution
- **Type:** Number (GBP)
- **Default:** £0
- **Description:** Pre-tax pension contributions beyond auto-enrolment
- **Max:** No statutory limit, but tax relief limited to £60,000/year (2025/26)

#### 7. Benefits / Allowances (Pre-Tax)
- **Type:** Number (GBP)
- **Default:** £0
- **Examples:** Childcare vouchers, cycle-to-work scheme
- **Note:** Reduces taxable income

#### 8. Dependents
- **Type:** Number
- **Default:** 0
- **Note:** Informational only (UK has no dependent tax credits like USA)

#### 9. Additional Tax Withholding
- **Type:** Number (GBP)
- **Default:** £0
- **Description:** Voluntary extra tax withheld

#### 10. Working Hours (Hourly Calculators Only)
- **Type:** Number
- **Default:** 2080 (40 hours/week × 52 weeks)
- **Description:** For hourly → annual normalization

### C. Auto-Calculated (NOT User Input)

Claude / Cursor must calculate these internally:

- Annual Gross Pay (normalized from input)
- Personal Allowance (from tax code)
- Income Tax (PAYE bands 2025/26)
- National Insurance (Employee Class 1)
- Student Loan Deduction (if applicable)
- Pension Deduction (pre-tax)
- Total Tax
- Net Income (all frequencies)

❌ **Users must NEVER input tax rates or thresholds**

---

## 3️⃣ UK TAX RULES (2025/2026)

### A. Personal Allowance

**Standard Personal Allowance:** £12,570

**Tax Code Logic:**
- `1257L` → £12,570 personal allowance
- `1200L` → £12,000 personal allowance
- `BR` → £0 (Basic Rate, no allowance)
- `D0` → £0 (Higher Rate, no allowance)
- `D1` → £0 (Additional Rate, no allowance)
- `NT` → No tax applied
- `K` codes → Negative allowance (deductions exceed allowances)

**Allowance Taper:**
- Personal allowance reduces by £1 for every £2 earned above £100,000
- Fully tapered at £125,140 (income where allowance = £0)

```
if (grossIncome > 100000) {
  personalAllowance = max(0, 12570 - ((grossIncome - 100000) / 2))
}
```

### B. Income Tax (PAYE) Bands

| Band | Income Range | Rate | Tax on Band |
|------|-------------|------|-------------|
| Personal Allowance | £0 – £12,570 | 0% | £0 |
| Basic Rate | £12,571 – £50,270 | 20% | £7,540 |
| Higher Rate | £50,271 – £125,140 | 40% | £29,948 |
| Additional Rate | £125,141+ | 45% | Variable |

**Calculation:**
```
taxableIncome = grossIncome - personalAllowance - pensionContributions - benefits

if taxableIncome <= 0: incomeTax = 0
else if taxableIncome <= 37700: incomeTax = taxableIncome × 0.20
else if taxableIncome <= 112570: incomeTax = 7540 + ((taxableIncome - 37700) × 0.40)
else: incomeTax = 7540 + 29948 + ((taxableIncome - 112570) × 0.45)
```

### C. National Insurance (Employee Class 1)

**2025/26 Rates:**

| Income Range | Rate | Type |
|-------------|------|------|
| £0 – £12,570 | 0% | Below threshold |
| £12,571 – £50,270 | 12% | Primary threshold to upper earnings limit |
| £50,271+ | 2% | Above upper earnings limit |

**Calculation:**
```
niableIncome = grossIncome  // Calculated on GROSS, not taxable income

if niableIncome <= 12570:
  nationalInsurance = 0
else if niableIncome <= 50270:
  nationalInsurance = (niableIncome - 12570) × 0.12
else:
  nationalInsurance = ((50270 - 12570) × 0.12) + ((niableIncome - 50270) × 0.02)
```

**Important:**
- NI calculated on **gross income** (before pension deductions)
- NOT on taxable income (unlike income tax)

### D. Student Loan Deductions

| Plan | Threshold | Rate | Applies To |
|------|----------|------|-----------|
| Plan 1 | £22,015 | 9% | Pre-September 2012 (England/Wales) |
| Plan 2 | £27,295 | 9% | Post-September 2012 (England/Wales) |
| Plan 4 | £25,375 | 9% | Scotland |
| Postgraduate | £21,000 | 6% | Postgraduate loans |

**Calculation:**
```
if studentLoanPlan == 'none':
  studentLoanDeduction = 0
else:
  repayableIncome = max(0, grossIncome - threshold[plan])
  studentLoanDeduction = repayableIncome × rate[plan]
```

**Multiple Loans:**
- Can have both undergraduate + postgraduate loans
- Deductions stack (9% + 6% = 15% above threshold)

### E. Pension Contributions

**Auto-Enrolment (Workplace Pension):**
- Minimum employee contribution: 5% of qualifying earnings
- Minimum employer contribution: 3%
- Qualifying earnings: £6,240 – £50,270 (2025/26)

**Pre-Tax Benefit:**
- Employee pension contributions are deducted **before** income tax
- But **after** National Insurance (NI calculated on gross)

**Calculation:**
```
if pensionScheme == 'auto-enrolment':
  qualifyingEarnings = min(max(grossIncome, 6240), 50270)
  employeePensionContribution = qualifyingEarnings × 0.05
else if pensionScheme == 'other':
  employeePensionContribution = additionalPensionContribution
else:
  employeePensionContribution = 0

// Reduce taxable income (but not NI-able income)
taxableIncome = grossIncome - personalAllowance - employeePensionContribution
```

---

## 4️⃣ CALCULATION FLOW (MASTER FORMULA)

### Step-by-Step:

```
1. Normalize Input to Annual Gross
   annualGross = normalizeToAnnual(inputAmount, frequency)

2. Calculate Personal Allowance
   personalAllowance = calculatePersonalAllowance(taxCode, annualGross)

3. Calculate Pre-Tax Deductions
   pensionContribution = calculatePension(annualGross, pensionScheme, additionalPension)
   benefits = preTaxBenefits

4. Calculate Taxable Income
   taxableIncome = annualGross - personalAllowance - pensionContribution - benefits

5. Calculate Income Tax (PAYE)
   incomeTax = calculateProgressiveTax(taxableIncome, PAYE_BRACKETS)

6. Calculate National Insurance (on GROSS)
   nationalInsurance = calculateNI(annualGross, NI_RATES)

7. Calculate Student Loan (on GROSS)
   studentLoanDeduction = calculateStudentLoan(annualGross, studentLoanPlan)

8. Calculate Additional Withholding
   additionalTax = additionalWithholding

9. Calculate Total Tax
   totalTax = incomeTax + nationalInsurance + studentLoanDeduction + additionalTax

10. Calculate Net Income
    netAnnual = annualGross - totalTax

11. Redistribute to Output Frequencies
    netMonthly = netAnnual / 12
    netWeekly = netAnnual / 52
    netDaily = netAnnual / 260
    netHourly = netAnnual / workingHours

12. Calculate Effective Tax Rate
    effectiveTaxRate = (totalTax / annualGross) × 100
```

---

## 5️⃣ REQUIRED OUTPUTS (ALL CALCULATORS)

### A. Core Outputs

| Output | Description |
|--------|-------------|
| Gross Annual Income | Normalized from input |
| Personal Allowance | Based on tax code |
| Taxable Income | After deductions |
| Income Tax (PAYE) | Annual |
| National Insurance | Annual (Employee Class 1) |
| Student Loan | Annual (if applicable) |
| Pension Contribution | Annual pre-tax (employee portion) |
| Total Tax | Sum of all deductions |
| Net Annual Pay | Gross – Total Tax |

### B. Time-Based Outputs

| Output | Formula |
|--------|---------|
| Net Monthly Pay | Net Annual ÷ 12 |
| Net Weekly Pay | Net Annual ÷ 52 |
| Net Daily Pay | Net Annual ÷ 260 |
| Net Hourly Pay | Net Annual ÷ Working Hours |

### C. Analytics

| Output | Formula |
|--------|---------|
| Effective Tax Rate | (Total Tax ÷ Gross Annual) × 100 |
| Take-Home % | (Net Annual ÷ Gross Annual) × 100 |

### D. Breakdown for Display

Show detailed breakdown:
- ✅ Gross Annual Salary
- ✅ Personal Allowance (from tax code)
- ✅ Taxable Income
- ✅ Income Tax @ 20% / 40% / 45%
- ✅ National Insurance @ 12% / 2%
- ✅ Student Loan (if applicable)
- ✅ Pension Contribution (if applicable)
- ✅ Total Deductions
- ✅ Net Annual Pay
- ✅ Net Monthly / Weekly / Daily / Hourly

---

## 6️⃣ TIME-BASED CALCULATORS

### Covered Calculators:
1. Hourly → Salary Calculator
2. Hourly Rate Calculator
3. Weekly → Salary Calculator
4. Monthly → Salary Calculator
5. Daily → Salary Calculator

### Normalization Logic:

```
Hourly → Annual:
  annualGross = hourlyRate × workingHours
  (Default: workingHours = 2080)

Weekly → Annual:
  annualGross = weeklyPay × 52

Monthly → Annual:
  annualGross = monthlyPay × 12

Daily → Annual:
  annualGross = dailyRate × 260
  (260 = 5 days/week × 52 weeks)
```

### Tax Handling:
- ✅ Normalize to annual first
- ✅ Apply full UK tax engine once
- ✅ Redistribute net to all time periods
- ❌ Do NOT calculate tax per period

### Outputs:
- Net Annual Pay
- Net Monthly Pay
- Net Weekly Pay
- Net Daily Pay
- Net Hourly Pay

---

## 7️⃣ OVERTIME PAY CALCULATOR

### Purpose
Calculate overtime earnings and their true after-tax impact.

### Overtime-Specific Inputs

#### 1. Base Hourly Rate
- **Type:** GBP (£)
- **Required:** Yes

#### 2. Regular Hours Per Week
- **Default:** 40

#### 3. Overtime Hours Per Week
- **Required:** Yes

#### 4. Overtime Multiplier
- **Default:** 1.5 (time-and-a-half)
- **Editable:** Yes (some industries use 2x on Sundays)

#### 5. Weeks Worked Per Year
- **Default:** 52
- **Editable:** Yes (accounts for unpaid leave)

### Overtime Calculation (Pre-Tax)

```
regularAnnualPay = baseRate × regularHours × weeks
overtimeAnnualPay = baseRate × overtimeHours × overtimeMultiplier × weeks
annualGross = regularAnnualPay + overtimeAnnualPay
```

### Tax Handling (IMPORTANT)

⚠️ **Critical Rules:**
- Overtime is NOT taxed separately
- It increases total annual income
- Taxes calculated once on total income
- Use standard UK tax engine

### Outputs

#### Earnings Breakdown
- Regular Pay (Annual)
- Overtime Pay (Annual)
- Total Gross Pay

#### Tax Breakdown
- Income Tax (PAYE)
- National Insurance
- Student Loan (if applicable)
- Total Tax

#### Net Results
- Net Annual Pay
- Net Monthly Pay
- Net Weekly Pay
- Effective Tax Rate

---

## 8️⃣ BONUS TAX CALCULATOR

### Purpose
Show real take-home from a bonus after UK taxes.

### Bonus-Specific Inputs

#### 1. Base Annual Salary
- **Type:** GBP (£)
- **Required:** Yes

#### 2. Bonus Amount
- **Type:** GBP (£)
- **Required:** Yes

#### 3. Bonus Type (UI ONLY)
- Lump Sum
- Percentage of Salary

⚠️ **Tax logic stays identical** regardless of type

### Bonus Calculation

```
annualGross = baseSalary + bonusAmount
```

### Bonus Tax Logic (IMPORTANT)

❌ **Do NOT apply emergency tax rate blindly**

✅ **Correct Approach:**
- Treat bonus as ordinary income
- Calculate tax with and without bonus
- Show additional tax impact

```
taxWithoutBonus = calculateUKGrossToNet(baseSalary, options)
taxWithBonus = calculateUKGrossToNet(baseSalary + bonus, options)
additionalTax = taxWithBonus.totalTax - taxWithoutBonus.totalTax
netBonus = bonus - additionalTax
```

### Outputs

#### Bonus Impact
- Gross Bonus
- Additional Tax Due Because of Bonus
- Net Bonus Take-Home

#### Salary Comparison
- Net Pay Without Bonus
- Net Pay With Bonus

#### Tax Breakdown
- Income Tax Increase
- National Insurance Increase
- Student Loan Increase (if applicable)

#### Effective Rates
- Bonus Effective Tax Rate
- Overall Effective Tax Rate

---

## 9️⃣ COMMISSION CALCULATOR

### Purpose
Calculate commission-based earnings accurately.

### Commission-Specific Inputs

#### 1. Base Salary
- **Type:** GBP (£)
- **Optional:** Yes (default: £0)

#### 2. Commission Amount
- **Type:** GBP (£)
- **Required:** Yes

#### 3. Commission Frequency
- Monthly
- Quarterly
- Annual

### Commission Normalization

```
annualCommission =
  monthly × 12
  quarterly × 4
  annual × 1

annualGross = baseSalary + annualCommission
```

### Tax Handling

- Commission is ordinary income
- No separate tax logic
- Full amount flows into annual tax calculation

### Outputs

#### Earnings
- Base Salary
- Annual Commission
- Total Gross Income

#### Tax Breakdown
- Income Tax (PAYE)
- National Insurance
- Student Loan (if applicable)
- Total Tax

#### Net Pay
- Net Annual Pay
- Net Monthly Pay
- Net Commission Take-Home

---

## 🔟 OUTPUT CONSISTENCY (ALL CALCULATORS)

**Every calculator must show:**
- ✅ Gross Income
- ✅ Total Tax (PAYE + NI + Student Loan)
- ✅ Net Income
- ✅ Effective Tax Rate

---

## 1️⃣1️⃣ UX / EDUCATION NOTES

### Clear Messaging

✅ **Use:**
- "Calculated using 2025/26 UK tax rates"
- "Includes PAYE, National Insurance, and student loan"
- "Pension contributions reduce taxable income"
- "Tax calculated annually for accuracy"

❌ **Avoid:**
- "Estimated"
- "Emergency tax code"
- "Exact payslip result" (employers may use different methods)

---

## 1️⃣2️⃣ CURSOR / CLAUDE IMPLEMENTATION RULES

**IMPORTANT RULES:**
- ✅ Always normalize to annual income first
- ❌ Never apply per-period tax rates
- ✅ Taxes must be calculated once on total annual income
- ✅ Personal allowance from tax code (automatic)
- ✅ NI calculated on gross (before pension)
- ✅ Income tax calculated on taxable (after pension)
- ✅ Show comparison outputs where applicable

---

## 1️⃣3️⃣ IMPLEMENTATION EXAMPLES

### Example 1: Basic Salary (£35,000)

**Input:**
- Gross Salary: £35,000
- Tax Code: 1257L
- Pension: None
- Student Loan: None

**Calculation:**
```
Annual Gross: £35,000
Personal Allowance: £12,570
Taxable Income: £35,000 - £12,570 = £22,430

Income Tax:
  £22,430 × 20% = £4,486

National Insurance:
  (£35,000 - £12,570) × 12% = £2,692

Total Tax: £4,486 + £2,692 = £7,178
Net Annual: £35,000 - £7,178 = £27,822
Net Monthly: £27,822 ÷ 12 = £2,318.50

Effective Tax Rate: 20.5%
```

### Example 2: Higher Earner with Student Loan (£60,000)

**Input:**
- Gross Salary: £60,000
- Tax Code: 1257L
- Pension: Auto-Enrolment
- Student Loan: Plan 2

**Calculation:**
```
Annual Gross: £60,000

Pension (5% of £50,270):
  £50,270 × 5% = £2,513.50

Personal Allowance: £12,570
Taxable Income: £60,000 - £12,570 - £2,513.50 = £44,916.50

Income Tax:
  £37,700 × 20% = £7,540
  (£44,916.50 - £37,700) × 40% = £2,886.60
  Total Income Tax: £10,426.60

National Insurance (on gross):
  (£50,270 - £12,570) × 12% = £4,524
  (£60,000 - £50,270) × 2% = £194.60
  Total NI: £4,718.60

Student Loan Plan 2:
  (£60,000 - £27,295) × 9% = £2,943.45

Total Tax: £10,426.60 + £4,718.60 + £2,943.45 = £18,088.65
Net Annual: £60,000 - £18,088.65 = £41,911.35
Net Monthly: £41,911.35 ÷ 12 = £3,492.61

Effective Tax Rate: 30.1%
```

### Example 3: Bonus Calculation (£50,000 + £10,000 bonus)

**Input:**
- Base Salary: £50,000
- Bonus: £10,000
- Tax Code: 1257L

**Calculation:**
```
Without Bonus:
  Gross: £50,000
  Tax: £7,540 (income tax) + £4,524 (NI) = £12,064
  Net: £37,936

With Bonus:
  Gross: £60,000
  Tax: £10,426.60 + £4,718.60 = £15,145.20
  Net: £44,854.80

Bonus Impact:
  Gross Bonus: £10,000
  Additional Tax: £15,145.20 - £12,064 = £3,081.20
  Net Bonus: £10,000 - £3,081.20 = £6,918.80
  Bonus Tax Rate: 30.8%
```

---

## 1️⃣4️⃣ VALIDATION CHECKLIST

### Core Calculator
- [ ] Calculates personal allowance from tax code
- [ ] Applies progressive PAYE tax brackets
- [ ] Calculates NI on gross income correctly
- [ ] Handles student loan plans (1/2/4/Postgraduate)
- [ ] Applies pension contributions pre-tax
- [ ] Shows all time-based outputs
- [ ] Displays effective tax rate

### Time-Based Calculators
- [ ] Hourly normalizes to annual (× 2080)
- [ ] Weekly normalizes to annual (× 52)
- [ ] Monthly normalizes to annual (× 12)
- [ ] Daily normalizes to annual (× 260)
- [ ] All use shared UK tax engine
- [ ] Results match salary calculator for same annual amount

### Overtime Calculator
- [ ] Calculates regular and overtime pay correctly
- [ ] Applies overtime multiplier
- [ ] Sums to total annual gross
- [ ] Uses shared UK tax engine
- [ ] Shows earnings breakdown

### Bonus Calculator
- [ ] Calculates with and without bonus
- [ ] Shows additional tax impact
- [ ] Does NOT use emergency tax code
- [ ] Uses shared UK tax engine
- [ ] Shows comparison view

### Commission Calculator
- [ ] Normalizes commission to annual (monthly × 12, etc.)
- [ ] Handles all three frequencies
- [ ] Adds to base salary
- [ ] Uses shared UK tax engine
- [ ] Shows commission breakdown

---

## 1️⃣5️⃣ COMMON PITFALLS TO AVOID

### ❌ Wrong: NI on Taxable Income
```typescript
// WRONG - NI is on gross, not taxable
const ni = taxableIncome * 0.12;
```

### ✅ Correct: NI on Gross Income
```typescript
// CORRECT - NI calculated on gross
const ni = calculateNI(grossIncome);
```

### ❌ Wrong: Income Tax on Gross
```typescript
// WRONG - Income tax is on taxable income
const incomeTax = grossIncome * 0.20;
```

### ✅ Correct: Income Tax on Taxable Income
```typescript
// CORRECT - Income tax after allowances and pensions
const taxableIncome = grossIncome - personalAllowance - pension;
const incomeTax = calculateProgressiveTax(taxableIncome, TAX_BRACKETS);
```

### ❌ Wrong: Emergency Tax on Bonus
```typescript
// WRONG - Do not apply emergency tax rates
const bonusTax = bonus * 0.50;
```

### ✅ Correct: Marginal Tax on Bonus
```typescript
// CORRECT - Calculate actual marginal impact
const withoutBonus = calculateUKGrossToNet(salary);
const withBonus = calculateUKGrossToNet(salary + bonus);
const bonusTax = withBonus.totalTax - withoutBonus.totalTax;
```

---

## 1️⃣6️⃣ PRODUCTION READINESS

**Status:** Ready for implementation

**Next Steps:**
1. Implement UK tax engine (`lib/calculators/uk.ts`)
2. Implement time-based calculators (reuse normalization logic)
3. Implement variable pay calculators (overtime/bonus/commission)
4. Test all calculators with example scenarios
5. Create content for all UK calculator pages

---

**This specification is now LOCKED. All UK calculators follow this pattern.**

**Last Updated:** January 14, 2026
**Next Review:** After implementation complete
