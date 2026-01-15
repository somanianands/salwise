# 🇬🇧 UK VARIABLE PAY CALCULATORS (MASTER SPECIFICATION)

**Status:** ✅ Production Standard
**Date:** January 14, 2026
**Inherits From:** UK_CALCULATOR_MASTER_SPEC.md

---

## Calculators Covered

| Calculator | URL Slug |
|-----------|------------|
| Overtime Pay Calculator | `/overtime-pay-calculator` |
| Bonus Tax Calculator | `/bonus-tax-calculator` |
| Commission Calculator | `/commission-calculator` |

---

## 1️⃣ CORE DESIGN RULES (VERY IMPORTANT)

- ❌ User never enters tax rates
- ❌ No tax year selection
- ❌ No flat bonus tax rates
- ✅ All tax logic is automatic
- ✅ Normalize everything to annual income
- ✅ Apply UK tax engine once
- ✅ Redistribute results back to bonus / overtime / commission views

---

## 2️⃣ SHARED INPUTS (ALL 3 CALCULATORS)

These inputs are common and reused.

### A. Personal & Tax Context

#### 1. Tax Code
- **Type:** Text / Select
- **Default:** `1257L`
- **Options:**
  - `1257L` (Standard)
  - `BR` / `D0` / `D1` (No allowance)
  - `NT` (No tax)
  - Custom codes

#### 2. Pension Scheme
- **Type:** Select
- **Options:**
  - None
  - Auto-Enrolment (Workplace Pension)
  - Other
- **Default:** None

#### 3. Student Loan Plan
- **Type:** Select
- **Options:**
  - None
  - Plan 1 (Pre-2012)
  - Plan 2 (Post-2012 England/Wales)
  - Plan 4 (Scotland)
  - Postgraduate Loan
- **Default:** None

#### 4. Employment Type
- **Type:** Select
- **Options:**
  - Employee
  - Self-Employed
- **Default:** Employee

⚠️ **Overtime applies only to Employees**
- Self-employed → hide overtime option

### B. Pre-Tax Adjustments (Optional / Advanced)

- Additional Pension Contribution (£, annual)
- Benefits / Allowances (£, annual)
- Dependents (number - informational only)
- Additional Withholding (£, annual)

---

## 3️⃣ OVERTIME PAY CALCULATOR

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
- **Default:** 1.5
- **Editable:** Yes (some contracts use 2x for Sundays/bank holidays)

#### 5. Weeks Worked Per Year
- **Default:** 52

### Overtime Calculation (Pre-Tax)

```
regularAnnualPay = hourlyRate × regularHours × weeks
overtimeAnnualPay = hourlyRate × overtimeHours × overtimeMultiplier × weeks
annualGross = regularAnnualPay + overtimeAnnualPay
```

### Tax Handling (IMPORTANT)

⚠️ **Critical Rules:**
- Overtime is NOT taxed separately
- It increases total annual income
- Taxes calculated once on total income

### UK Tax Application:

```
annualGross = regularPay + overtimePay

→ Personal Allowance (from tax code)
→ Pre-tax deductions (pension, benefits)
→ Taxable Income
→ Income Tax (PAYE)
→ National Insurance (on gross)
→ Student Loan (on gross if above threshold)
→ Total Tax
→ Net Income
```

### Outputs

#### Earnings Breakdown
- Regular Pay (Annual)
- Overtime Pay (Annual)
- Total Gross Pay

#### Tax Breakdown
- Personal Allowance (from tax code)
- Taxable Income
- Income Tax (PAYE)
- National Insurance
- Student Loan (if applicable)
- Total Tax

#### Net Results
- Net Annual Pay
- Net Monthly Pay
- Net Weekly Pay
- Net Hourly Pay (derived)
- Effective Tax Rate

---

## 4️⃣ BONUS TAX CALCULATOR

### Purpose
Show real take-home from a bonus after UK taxes (PAYE, NI, Student Loan).

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

❌ **Do NOT apply flat bonus tax rate**

✅ **Correct Approach:**
- Treat bonus as supplemental income
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
- Income Tax (PAYE) Increase
- National Insurance Increase
- Student Loan Increase (if applicable)

#### Effective Rates
- Bonus Effective Tax Rate
- Overall Effective Tax Rate

---

## 5️⃣ COMMISSION CALCULATOR

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

### UK Tax Application:

```
annualGross = baseSalary + annualCommission

→ Personal Allowance (from tax code)
→ Pre-tax deductions (pension, benefits)
→ Taxable Income
→ Income Tax (PAYE)
→ National Insurance (on gross)
→ Student Loan (on gross if above threshold)
→ Total Tax
→ Net Income
```

### Outputs

#### Earnings
- Base Salary
- Annual Commission
- Total Gross Income

#### Tax Breakdown
- Personal Allowance
- Taxable Income
- Income Tax (PAYE)
- National Insurance
- Student Loan (if applicable)
- Pension Deduction (if applicable)
- Total Tax

#### Net Pay
- Net Annual Pay
- Net Monthly Pay
- Net Commission Take-Home

---

## 6️⃣ OUTPUT CONSISTENCY (ALL 3)

**Every calculator must show:**
- ✅ Gross Income
- ✅ Total Tax (PAYE + NI + Student Loan)
- ✅ Net Income
- ✅ Effective Tax Rate

---

## 7️⃣ UX / EDUCATION NOTES

### Clear Messaging

✅ **Use:**
- "Bonus, overtime, and commission are taxed as regular income"
- "Taxes calculated annually for accuracy"
- "Includes PAYE, National Insurance, and student loan deductions"
- "Pension contributions reduce taxable income"
- "Calculated using 2025/26 UK tax rates"

❌ **Avoid:**
- "Flat bonus tax"
- "Emergency tax code"
- "Exact payslip result"

---

## 8️⃣ CURSOR / CLAUDE IMPLEMENTATION RULES

**IMPORTANT RULES:**
- ✅ Always normalize bonus, overtime, and commission to annual income
- ❌ Never apply flat supplemental tax rates
- ✅ Taxes must be calculated once on total annual income
- ✅ Use the same UK tax engine as the salary calculator
- ✅ Show comparison outputs where applicable
- ✅ Personal allowance from tax code (automatic)
- ✅ NI calculated on gross (before pension)
- ✅ Income tax calculated on taxable (after pension)

---

## 9️⃣ IMPLEMENTATION EXAMPLES

### Overtime Example

**Input:**
- Base Rate: £20/hour
- Regular Hours: 40/week
- Overtime Hours: 10/week
- Multiplier: 1.5
- Weeks: 52

**Calculation:**
```
Regular = £20 × 40 × 52 = £41,600
Overtime = £20 × 10 × 1.5 × 52 = £15,600
Total Gross = £57,200

Then apply standard UK tax engine on £57,200:

Personal Allowance: £12,570
Taxable Income: £57,200 - £12,570 = £44,630

Income Tax:
  £37,700 × 20% = £7,540
  (£44,630 - £37,700) × 40% = £2,772
  Total PAYE: £10,312

National Insurance:
  (£50,270 - £12,570) × 12% = £4,524
  (£57,200 - £50,270) × 2% = £138.60
  Total NI: £4,662.60

Total Tax: £10,312 + £4,662.60 = £14,974.60
Net Annual: £57,200 - £14,974.60 = £42,225.40
Net Hourly: £42,225.40 ÷ 2600 = £16.24

Effective Tax Rate: 26.2%
```

### Bonus Example

**Input:**
- Base Salary: £45,000
- Bonus: £10,000

**Calculation:**
```
Without Bonus:
  Gross = £45,000
  Personal Allowance: £12,570
  Taxable: £32,430
  PAYE: £6,486
  NI: £3,891.60
  Total Tax: £10,377.60
  Net: £34,622.40

With Bonus:
  Gross = £55,000
  Personal Allowance: £12,570
  Taxable: £42,430
  PAYE: £8,486
  NI: £5,091.60
  Total Tax: £13,577.60
  Net: £41,422.40

Bonus Impact:
  Gross Bonus = £10,000
  Additional Tax = £13,577.60 - £10,377.60 = £3,200
  Net Bonus = £10,000 - £3,200 = £6,800
  Bonus Tax Rate = 32%
```

### Commission Example

**Input:**
- Base Salary: £30,000
- Commission: £1,500/month
- Frequency: Monthly

**Calculation:**
```
Annual Commission = £1,500 × 12 = £18,000
Total Gross = £30,000 + £18,000 = £48,000

Then apply standard UK tax engine on £48,000:

Personal Allowance: £12,570
Taxable Income: £48,000 - £12,570 = £35,430

Income Tax:
  £35,430 × 20% = £7,086

National Insurance:
  (£48,000 - £12,570) × 12% = £4,251.60

Total Tax: £7,086 + £4,251.60 = £11,337.60
Net Annual: £48,000 - £11,337.60 = £36,662.40
Net Monthly: £36,662.40 ÷ 12 = £3,055.20

Effective Tax Rate: 23.6%
```

---

## 🔟 VALIDATION CHECKLIST

### Overtime Calculator
- [ ] Calculates regular pay correctly
- [ ] Calculates overtime pay with multiplier
- [ ] Sums to total annual gross
- [ ] Uses shared UK tax engine
- [ ] Shows earnings breakdown
- [ ] Shows effective tax rate
- [ ] Includes NI on total gross
- [ ] Includes PAYE on taxable

### Bonus Calculator
- [ ] Calculates with and without bonus
- [ ] Shows additional tax impact
- [ ] Does NOT use flat bonus tax rate
- [ ] Shows comparison view
- [ ] Calculates bonus effective rate
- [ ] Uses shared UK tax engine
- [ ] Includes NI increase
- [ ] Includes student loan increase if applicable

### Commission Calculator
- [ ] Normalizes commission to annual
- [ ] Handles monthly/quarterly/annual
- [ ] Adds to base salary
- [ ] Uses shared UK tax engine
- [ ] Shows commission breakdown
- [ ] Shows net commission take-home
- [ ] Includes all UK tax components

---

## 1️⃣1️⃣ COMMON PITFALLS TO AVOID

### ❌ Wrong: Flat Bonus Tax
```typescript
// WRONG - Never do this
const bonusTax = bonus * 0.40;
```

### ✅ Correct: Marginal Tax Impact
```typescript
// CORRECT - Calculate actual impact
const withoutBonus = calculateUKGrossToNet(baseSalary, options);
const withBonus = calculateUKGrossToNet(baseSalary + bonus, options);
const bonusTax = withBonus.totalTax - withoutBonus.totalTax;
```

### ❌ Wrong: Separate Overtime Tax
```typescript
// WRONG - Never tax overtime separately
const overtimeTax = overtimePay * 0.30;
```

### ✅ Correct: Combined Income Tax
```typescript
// CORRECT - Tax total income
const totalIncome = regularPay + overtimePay;
const tax = calculateUKGrossToNet(totalIncome, options);
```

### ❌ Wrong: Commission Without Normalization
```typescript
// WRONG - Treating monthly as annual
const totalGross = baseSalary + monthlyCommission;
```

### ✅ Correct: Normalize Commission First
```typescript
// CORRECT - Normalize to annual
const annualCommission = monthlyCommission * 12;
const totalGross = baseSalary + annualCommission;
```

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

---

## 1️⃣2️⃣ DETAILED CALCULATION BREAKDOWN

### UK Tax Components Order:

```
1. Calculate Gross Annual Income
   - Normalize all inputs to annual

2. Calculate Pre-Tax Deductions
   - Pension contributions
   - Benefits/allowances

3. Calculate Personal Allowance
   - From tax code
   - Apply taper if income > £100,000

4. Calculate Taxable Income
   - Gross - Personal Allowance - Pre-Tax Deductions

5. Calculate Income Tax (PAYE)
   - Progressive brackets: 20%, 40%, 45%
   - On taxable income

6. Calculate National Insurance
   - On GROSS income (not taxable)
   - 12% + 2% tiers

7. Calculate Student Loan
   - On GROSS income (not taxable)
   - Only if above threshold for plan

8. Calculate Total Tax
   - PAYE + NI + Student Loan

9. Calculate Net Income
   - Gross - Total Tax

10. Redistribute Results
    - Annual, Monthly, Weekly, Daily, Hourly
```

---

## 1️⃣3️⃣ COMPARISON WITH USA SYSTEM

| Feature | USA | UK |
|---------|-----|-----|
| Tax System | Federal + State + FICA | PAYE + NI + Student Loan |
| Bonus Tax | Marginal rate (combined) | Marginal rate (PAYE + NI) |
| Overtime Tax | No separate tax | No separate tax |
| Commission Tax | Ordinary income | Ordinary income |
| Student Loans | Not in tax system | Automatic deduction |
| Pension | Pre-tax for federal + state | Pre-tax for PAYE only (not NI) |
| Personal Allowance | Standard deduction by filing status | From tax code (1257L) |

---

## 1️⃣4️⃣ EDGE CASES

### High Earner with Personal Allowance Taper

**Scenario:** £120,000 salary + £20,000 bonus

```
Total Gross: £140,000

Personal Allowance Calculation:
  Standard: £12,570
  Taper: (£140,000 - £100,000) / 2 = £20,000
  Reduced Allowance: £12,570 - £20,000 = £0 (fully tapered)

Taxable Income: £140,000 (no allowance)

Income Tax:
  £37,700 × 20% = £7,540
  £87,440 × 40% = £34,976
  £14,860 × 45% = £6,687
  Total PAYE: £49,203

National Insurance:
  (£50,270 - £12,570) × 12% = £4,524
  (£140,000 - £50,270) × 2% = £1,794.60
  Total NI: £6,318.60

Total Tax: £55,521.60
Net: £84,478.40
Effective Rate: 39.7%
```

### Multiple Student Loans

**Scenario:** £50,000 salary with Plan 2 + Postgraduate loan

```
Gross: £50,000

Plan 2 Deduction:
  (£50,000 - £27,295) × 9% = £2,043.45

Postgraduate Deduction:
  (£50,000 - £21,000) × 6% = £1,740

Total Student Loan: £3,783.45

Combined with PAYE and NI:
  PAYE: £7,486
  NI: £4,491.60
  Student Loans: £3,783.45
  Total Tax: £15,761.05

Effective Rate: 31.5%
```

### Self-Employed with Commission

**Scenario:** Self-employed, £40,000 base + £12,000 annual commission

```
Total Gross: £52,000

NI Class 4 (Self-Employed):
  £12,570 - £12,570 = £0 (Lower Profits Limit)
  (£50,270 - £12,570) × 9% = £3,393
  (£52,000 - £50,270) × 2% = £34.60
  Total NI: £3,427.60

PAYE:
  Personal Allowance: £12,570
  Taxable: £39,430
  £37,700 × 20% = £7,540
  £1,730 × 40% = £692
  Total PAYE: £8,232

Total Tax: £11,659.60
Effective Rate: 22.4%
```

---

## 1️⃣5️⃣ PRODUCTION READINESS

**Status:** Ready for implementation validation

**Next Steps:**
1. Verify current overtime calculator implementation
2. Verify current bonus calculator implementation
3. Verify current commission calculator implementation
4. Test all three with various scenarios
5. Create content for all three calculator pages

---

## 1️⃣6️⃣ TEST SCENARIOS

### Test 1: Standard Employee with Overtime

**Input:**
- Base Rate: £15/hour
- Regular Hours: 37.5/week
- Overtime Hours: 5/week
- Weeks: 52
- Tax Code: 1257L

**Expected Output:**
```
Regular: £29,250
Overtime: £5,850 (£15 × 5 × 1.5 × 52)
Total Gross: £35,100

PAYE: £4,506
NI: £2,703.60
Total Tax: £7,209.60
Net Annual: £27,890.40
Effective Rate: 20.5%
```

### Test 2: High Bonus with Student Loan

**Input:**
- Base Salary: £55,000
- Bonus: £15,000
- Student Loan: Plan 2
- Tax Code: 1257L

**Expected Output:**
```
Without Bonus:
  Gross: £55,000
  Tax: £13,577.60
  Net: £41,422.40

With Bonus:
  Gross: £70,000
  PAYE: £11,486
  NI: £5,891.60
  Student Loan: £3,843.45
  Total Tax: £21,221.05
  Net: £48,778.95

Bonus Impact:
  Gross Bonus: £15,000
  Additional Tax: £7,643.45
  Net Bonus: £7,356.55
  Bonus Tax Rate: 51% (includes student loan)
```

### Test 3: Commission with Pension

**Input:**
- Base Salary: £35,000
- Commission: £2,000/month
- Frequency: Monthly
- Pension: Auto-Enrolment
- Tax Code: 1257L

**Expected Output:**
```
Base: £35,000
Annual Commission: £24,000
Total Gross: £59,000

Pension (5% of £50,270): £2,513.50
Personal Allowance: £12,570
Taxable: £43,916.50

PAYE: £9,403.30
NI: £5,571.60
Total Tax: £14,974.90
Net Annual: £44,025.10
Net Monthly: £3,668.76

Effective Rate: 25.4%
```

---

## 1️⃣7️⃣ IMPLEMENTATION CHECKLIST

### Code Implementation
- [ ] Overtime calculator with weeks parameter
- [ ] Bonus calculator with comparison logic
- [ ] Commission calculator with frequency normalization
- [ ] All use shared UK tax engine
- [ ] Personal allowance from tax code
- [ ] NI on gross income
- [ ] PAYE on taxable income
- [ ] Student loan threshold checks

### Tax Calculations
- [ ] Personal allowance taper above £100k
- [ ] Progressive PAYE brackets
- [ ] Two-tier NI (12% + 2%)
- [ ] Student loan by plan (1/2/4/Postgraduate)
- [ ] Pension reduces taxable (not NI)
- [ ] Multiple loan deductions stack

### Outputs
- [ ] Earnings breakdown for each calculator
- [ ] Tax component breakdown
- [ ] Net pay all time periods
- [ ] Effective tax rates
- [ ] Comparison views (bonus/commission)

### Validation
- [ ] Test with example scenarios
- [ ] Verify against HMRC calculations
- [ ] Edge cases (high earners, multiple loans)
- [ ] Employment types (employee/self-employed)

---

## 1️⃣8️⃣ FINAL STATUS

**UK Variable Pay Calculators:** ✅ **SPECIFICATION COMPLETE**

All 3 calculators documented and ready for implementation:
1. ✅ Overtime Pay Calculator
2. ✅ Bonus Tax Calculator
3. ✅ Commission Calculator

**Ready for:**
- ✅ UK tax engine integration
- ✅ Calculator-specific UI
- ✅ Test scenario validation
- ✅ Content creation

---

**This specification is now LOCKED. All UK variable pay calculators follow this pattern.**

**Last Updated:** January 14, 2026
**Next Review:** After implementation complete
