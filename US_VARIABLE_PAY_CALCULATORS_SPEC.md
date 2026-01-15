# 🇺🇸 USA VARIABLE PAY CALCULATORS (MASTER SPECIFICATION)

**Status:** ✅ Production Standard
**Date:** January 14, 2026
**Inherits From:** US_CALCULATOR_MASTER_SPEC.md

---

## Calculators Covered

| Calculator | URL Slug |
|-----------|----------|
| Overtime Pay Calculator | `/overtime-pay-calculator` |
| Bonus Tax Calculator | `/bonus-tax-calculator` |
| Commission Calculator | `/commission-calculator` |

---

## 1️⃣ CORE DESIGN RULES (VERY IMPORTANT)

- ❌ User never enters tax rates
- ❌ No tax year selection
- ✅ All tax logic is automatic
- ✅ Normalize everything to annual income
- ✅ Apply USA tax engine once
- ✅ Redistribute results back to bonus / overtime / commission views

---

## 2️⃣ SHARED INPUTS (ALL 3 CALCULATORS)

These inputs are common and reused.

### A. Personal & Tax Context

#### 1. Filing Status
- Single
- Married Filing Jointly
- Married Filing Separately
- Head of Household

#### 2. State
- All US states + DC

#### 3. Employment Type
- Employee
- Self-Employed

⚠️ **Overtime applies only to Employees**
- Self-employed → hide overtime option

### B. Pre-Tax Adjustments (Optional / Advanced)

- 401(k) / IRA (annual)
- Health Insurance (annual)
- HSA
- Other Pre-Tax Deductions
- Dependents
- Additional Withholding

---

## 3️⃣ OVERTIME PAY CALCULATOR

### Purpose
Calculate overtime earnings and their true after-tax impact.

### Overtime-Specific Inputs

#### 1. Base Hourly Rate
- **Type:** USD
- **Required:** Yes

#### 2. Regular Hours Per Week
- **Default:** 40

#### 3. Overtime Hours Per Week
- **Required:** Yes

#### 4. Overtime Multiplier
- **Default:** 1.5
- **Editable:** Yes (some states use 2x)

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

### Outputs

#### Earnings Breakdown
- Regular Pay (Annual)
- Overtime Pay (Annual)
- Total Gross Pay

#### Tax Breakdown
- Federal Tax
- State Tax
- Social Security
- Medicare
- Total Tax

#### Net Results
- Net Annual Pay
- Net Monthly Pay
- Net Weekly Pay
- Effective Tax Rate

---

## 4️⃣ BONUS TAX CALCULATOR

### Purpose
Show real take-home from a bonus.

### Bonus-Specific Inputs

#### 1. Base Annual Salary
- **Type:** USD
- **Required:** Yes

#### 2. Bonus Amount
- **Type:** USD
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

❌ **Do NOT apply flat 22% blindly**

✅ **Correct Approach:**
- Treat bonus as supplemental income
- Calculate tax with and without bonus
- Show additional tax impact

```
taxWithoutBonus = calculateUSGrossToNet(baseSalary, options)
taxWithBonus = calculateUSGrossToNet(baseSalary + bonus, options)
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
- Federal Tax Increase
- State Tax Increase
- FICA Increase

#### Effective Rates
- Bonus Effective Tax Rate
- Overall Effective Tax Rate

---

## 5️⃣ COMMISSION CALCULATOR

### Purpose
Calculate commission-based earnings accurately.

### Commission-Specific Inputs

#### 1. Base Salary
- **Type:** USD
- **Optional:** Yes (default: 0)

#### 2. Commission Amount
- **Type:** USD
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
- Federal Tax
- State Tax
- FICA
- Total Tax

#### Net Pay
- Net Annual Pay
- Net Monthly Pay
- Net Commission Take-Home

---

## 6️⃣ OUTPUT CONSISTENCY (ALL 3)

**Every calculator must show:**
- ✅ Gross Income
- ✅ Total Tax
- ✅ Net Income
- ✅ Effective Tax Rate

---

## 7️⃣ UX / EDUCATION NOTES

### Clear Messaging

✅ **Use:**
- "Bonus and overtime are taxed as regular income"
- "Taxes calculated annually for accuracy"
- "Withholding may differ from actual tax"

❌ **Avoid:**
- "Flat bonus tax"
- "Exact paycheck result"

---

## 8️⃣ CURSOR / CLAUDE IMPLEMENTATION RULES

**IMPORTANT RULES:**
- ✅ Always normalize bonus, overtime, and commission to annual income
- ❌ Never apply flat supplemental tax rates
- ✅ Taxes must be calculated once on total annual income
- ✅ Use the same tax engine as the USA Salary Calculator
- ✅ Show comparison outputs where applicable

---

## 9️⃣ IMPLEMENTATION EXAMPLES

### Overtime Example

**Input:**
- Base Rate: $25/hour
- Regular Hours: 40/week
- Overtime Hours: 10/week
- Multiplier: 1.5
- Weeks: 52

**Calculation:**
```
Regular = $25 × 40 × 52 = $52,000
Overtime = $25 × 10 × 1.5 × 52 = $19,500
Total Gross = $71,500
```

Then apply standard USA tax engine on $71,500.

### Bonus Example

**Input:**
- Base Salary: $80,000
- Bonus: $15,000

**Calculation:**
```
Without Bonus:
  Gross = $80,000
  Tax = $14,200
  Net = $65,800

With Bonus:
  Gross = $95,000
  Tax = $18,700
  Net = $76,300

Bonus Impact:
  Gross Bonus = $15,000
  Additional Tax = $4,500
  Net Bonus = $10,500
  Bonus Tax Rate = 30%
```

### Commission Example

**Input:**
- Base Salary: $50,000
- Commission: $2,000/month
- Frequency: Monthly

**Calculation:**
```
Annual Commission = $2,000 × 12 = $24,000
Total Gross = $50,000 + $24,000 = $74,000
```

Then apply standard USA tax engine on $74,000.

---

## 🔟 VALIDATION CHECKLIST

### Overtime Calculator
- [ ] Calculates regular pay correctly
- [ ] Calculates overtime pay with multiplier
- [ ] Sums to total annual gross
- [ ] Uses shared tax engine
- [ ] Shows earnings breakdown
- [ ] Shows effective tax rate

### Bonus Calculator
- [ ] Calculates with and without bonus
- [ ] Shows additional tax impact
- [ ] Does NOT use flat 22% rate
- [ ] Shows comparison view
- [ ] Calculates bonus effective rate
- [ ] Uses shared tax engine

### Commission Calculator
- [ ] Normalizes commission to annual
- [ ] Handles monthly/quarterly/annual
- [ ] Adds to base salary
- [ ] Uses shared tax engine
- [ ] Shows commission breakdown
- [ ] Shows net commission take-home

---

## 📋 COMMON PITFALLS TO AVOID

### ❌ Wrong: Flat Bonus Tax
```typescript
// WRONG - Never do this
const bonusTax = bonus * 0.22;
```

### ✅ Correct: Marginal Tax Impact
```typescript
// CORRECT - Calculate actual impact
const withoutBonus = calculateUSGrossToNet(baseSalary, options);
const withBonus = calculateUSGrossToNet(baseSalary + bonus, options);
const bonusTax = withBonus.totalTax - withoutBonus.totalTax;
```

### ❌ Wrong: Separate Overtime Tax
```typescript
// WRONG - Never tax overtime separately
const overtimeTax = overtimePay * 0.25;
```

### ✅ Correct: Combined Income Tax
```typescript
// CORRECT - Tax total income
const totalIncome = regularPay + overtimePay;
const tax = calculateUSGrossToNet(totalIncome, options);
```

---

## 🎯 PRODUCTION READINESS

**Status:** Ready for implementation validation

**Next Steps:**
1. Verify current overtime calculator implementation
2. Verify current bonus calculator implementation
3. Verify current commission calculator implementation
4. Test all three with various scenarios
5. Create content for all three calculator pages

---

**This specification is now LOCKED. All variable pay calculators follow this pattern.**
