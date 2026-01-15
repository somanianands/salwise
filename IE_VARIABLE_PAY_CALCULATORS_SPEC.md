# 🇮🇪 IRELAND VARIABLE PAY CALCULATORS (MASTER SPECIFICATION)

**Status:** ✅ Production Standard
**Date:** January 14, 2026
**Inherits From:** IE_CALCULATOR_MASTER_SPEC.md

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
- ✅ All tax logic is automatic (Income Tax + USC + PRSI)
- ✅ Normalize everything to annual income
- ✅ Apply Ireland tax engine once
- ✅ Redistribute results back to bonus / overtime / commission views

---

## 2️⃣ SHARED INPUTS (ALL 3 CALCULATORS)

These inputs are common and reused.

### A. Personal & Tax Context

#### 1. Marital Status
- **Type:** Select
- **Options:**
  - Single
  - Married / Civil Partner
  - Widowed / Surviving Civil Partner
- **Default:** Single

#### 2. Employment Type
- **Type:** Select
- **Options:**
  - Employee (PAYE)
  - Self-Employed
- **Default:** Employee

⚠️ **Overtime applies only to Employees**
- Self-employed → hide overtime option

### B. Pre-Tax Adjustments (Optional / Advanced)

- Pension Contribution (€, annual)
- Health Insurance (€, annual)
- Other Pre-Tax Benefits (€, annual)
- Dependents (number - informational only)
- Additional Withholding (€, annual)

---

## 3️⃣ OVERTIME PAY CALCULATOR

### Purpose
Calculate overtime earnings and their true after-tax impact.

### Overtime-Specific Inputs

#### 1. Base Hourly Rate
- **Type:** EUR (€)
- **Required:** Yes

#### 2. Regular Hours Per Week
- **Default:** 39 (standard in Ireland)

#### 3. Overtime Hours Per Week
- **Required:** Yes

#### 4. Overtime Multiplier
- **Default:** 1.5
- **Editable:** Yes (some sectors use 2x for Sundays/bank holidays)

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

### Ireland Tax Application:

```
annualGross = regularPay + overtimePay

→ Pre-tax deductions (pension, benefits)
→ Taxable Income
→ Income Tax (20% / 40% with credits)
→ USC (progressive: 0.5%, 2%, 4.5%, 8%)
→ PRSI (4% if above threshold)
→ Total Tax
→ Net Income
```

### Outputs

#### Earnings Breakdown
- Regular Pay (Annual)
- Overtime Pay (Annual)
- Total Gross Pay

#### Tax Breakdown
- Taxable Income
- Income Tax (after credits)
- Universal Social Charge (USC)
- PRSI
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
Show real take-home from a bonus after Ireland taxes (Income Tax, USC, PRSI).

### Bonus-Specific Inputs

#### 1. Base Annual Salary
- **Type:** EUR (€)
- **Required:** Yes

#### 2. Bonus Amount
- **Type:** EUR (€)
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
taxWithoutBonus = calculateIEGrossToNet(baseSalary, options)
taxWithBonus = calculateIEGrossToNet(baseSalary + bonus, options)
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
- USC Increase
- PRSI Increase

#### Effective Rates
- Bonus Effective Tax Rate
- Overall Effective Tax Rate

---

## 5️⃣ COMMISSION CALCULATOR

### Purpose
Calculate commission-based earnings accurately.

### Commission-Specific Inputs

#### 1. Base Salary
- **Type:** EUR (€)
- **Optional:** Yes (default: €0)

#### 2. Commission Amount
- **Type:** EUR (€)
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

### Ireland Tax Application:

```
annualGross = baseSalary + annualCommission

→ Pre-tax deductions (pension, benefits)
→ Taxable Income
→ Income Tax (20% / 40% with credits)
→ USC (progressive)
→ PRSI (4% if above threshold)
→ Total Tax
→ Net Income
```

### Outputs

#### Earnings
- Base Salary
- Annual Commission
- Total Gross Income

#### Tax Breakdown
- Taxable Income
- Income Tax (after credits)
- Universal Social Charge (USC)
- PRSI
- Total Tax

#### Net Pay
- Net Annual Pay
- Net Monthly Pay
- Net Commission Take-Home

---

## 6️⃣ OUTPUT CONSISTENCY (ALL 3)

**Every calculator must show:**
- ✅ Gross Income
- ✅ Total Tax (Income Tax + USC + PRSI)
- ✅ Net Income
- ✅ Effective Tax Rate

---

## 7️⃣ UX / EDUCATION NOTES

### Clear Messaging

✅ **Use:**
- "Bonus, overtime, and commission are taxed as regular income"
- "Taxes calculated annually for accuracy"
- "Includes Income Tax, USC, and PRSI"
- "Tax credits applied automatically"
- "Calculated using 2026 Ireland tax rates"

❌ **Avoid:**
- "Flat bonus tax"
- "Emergency tax"
- "Exact payslip result"

---

## 8️⃣ CURSOR / CLAUDE IMPLEMENTATION RULES

**IMPORTANT RULES:**
- ✅ Always normalize bonus, overtime, and commission to annual income
- ❌ Never apply flat supplemental tax rates
- ✅ Taxes must be calculated once on total annual income
- ✅ Use the same Ireland tax engine as the salary calculator
- ✅ Show comparison outputs where applicable
- ✅ Tax credits from marital status (automatic)
- ✅ USC and PRSI calculated on gross income
- ✅ Income tax calculated on taxable income (after pension)

---

## 9️⃣ IMPLEMENTATION EXAMPLES

### Overtime Example

**Input:**
- Base Rate: €20/hour
- Regular Hours: 39/week
- Overtime Hours: 8/week
- Multiplier: 1.5
- Weeks: 52
- Marital Status: Single
- Employment Type: Employee

**Calculation:**
```
Regular = €20 × 39 × 52 = €40,560
Overtime = €20 × 8 × 1.5 × 52 = €12,480
Total Gross = €53,040

Then apply standard Ireland tax engine on €53,040:

Taxable Income: €53,040
Income Tax (Before Credits):
  €40,000 × 20% = €8,000
  €13,040 × 40% = €5,216
  Total: €13,216

Tax Credits:
  Single: €1,775
  PAYE: €1,775
  Total: €3,550

Income Tax (After Credits):
  €13,216 - €3,550 = €9,666

USC:
  €12,012 × 0.5% = €60.06
  (€22,920 - €12,012) × 2% = €218.16
  (€53,040 - €22,920) × 4.5% = €1,355.40
  Total USC: €1,633.62

PRSI:
  €53,040 × 4% = €2,121.60

Total Tax: €9,666 + €1,633.62 + €2,121.60 = €13,421.22
Net Annual: €53,040 - €13,421.22 = €39,618.78
Net Hourly: €39,618.78 ÷ 2444 = €16.21

Effective Tax Rate: 25.3%
```

### Bonus Example

**Input:**
- Base Salary: €45,000
- Bonus: €10,000
- Marital Status: Single
- Employment Type: Employee

**Calculation:**
```
Without Bonus:
  Gross = €45,000
  Taxable: €45,000
  Income Tax: €4,550 (€40k @ 20%, €5k @ 40% - €3,550 credits)
  USC: €1,240.20
  PRSI: €1,800
  Total Tax: €7,590.20
  Net: €37,409.80

With Bonus:
  Gross = €55,000
  Taxable: €55,000
  Income Tax: €8,550 (€40k @ 20%, €15k @ 40% - €3,550 credits)
  USC: €1,690.20
  PRSI: €2,200
  Total Tax: €12,440.20
  Net: €42,559.80

Bonus Impact:
  Gross Bonus = €10,000
  Additional Tax = €12,440.20 - €7,590.20 = €4,850
  Net Bonus = €10,000 - €4,850 = €5,150
  Bonus Tax Rate = 48.5%
```

### Commission Example

**Input:**
- Base Salary: €30,000
- Commission: €1,500/month
- Frequency: Monthly
- Marital Status: Married
- Employment Type: Employee

**Calculation:**
```
Annual Commission = €1,500 × 12 = €18,000
Total Gross = €30,000 + €18,000 = €48,000

Then apply standard Ireland tax engine on €48,000:

Taxable Income: €48,000
Income Tax (Before Credits):
  €48,000 × 20% = €9,600 (all in married standard band €49,000)

Tax Credits:
  Married: €3,550
  PAYE: €1,775
  Total: €5,325

Income Tax (After Credits):
  €9,600 - €5,325 = €4,275

USC:
  €12,012 × 0.5% = €60.06
  (€22,920 - €12,012) × 2% = €218.16
  (€48,000 - €22,920) × 4.5% = €1,128.60
  Total USC: €1,406.82

PRSI:
  €48,000 × 4% = €1,920

Total Tax: €4,275 + €1,406.82 + €1,920 = €7,601.82
Net Annual: €48,000 - €7,601.82 = €40,398.18
Net Monthly: €40,398.18 ÷ 12 = €3,366.52

Effective Tax Rate: 15.8%
```

---

## 🔟 VALIDATION CHECKLIST

### Overtime Calculator
- [ ] Calculates regular pay correctly
- [ ] Calculates overtime pay with multiplier
- [ ] Sums to total annual gross
- [ ] Uses shared Ireland tax engine
- [ ] Shows earnings breakdown
- [ ] Shows effective tax rate
- [ ] Includes USC and PRSI on total gross
- [ ] Includes Income Tax on taxable

### Bonus Calculator
- [ ] Calculates with and without bonus
- [ ] Shows additional tax impact
- [ ] Does NOT use flat bonus tax rate
- [ ] Shows comparison view
- [ ] Calculates bonus effective rate
- [ ] Uses shared Ireland tax engine
- [ ] Includes USC increase
- [ ] Includes PRSI increase

### Commission Calculator
- [ ] Normalizes commission to annual
- [ ] Handles monthly/quarterly/annual
- [ ] Adds to base salary
- [ ] Uses shared Ireland tax engine
- [ ] Shows commission breakdown
- [ ] Shows net commission take-home
- [ ] Includes all Ireland tax components

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
const withoutBonus = calculateIEGrossToNet(baseSalary, options);
const withBonus = calculateIEGrossToNet(baseSalary + bonus, options);
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
const tax = calculateIEGrossToNet(totalIncome, options);
```

### ❌ Wrong: USC on Taxable Income
```typescript
// WRONG - USC is on gross, not taxable
const usc = taxableIncome * 0.045;
```

### ✅ Correct: USC on Gross Income
```typescript
// CORRECT - USC calculated on gross
const usc = calculateUSC(grossIncome);
```

---

## 1️⃣2️⃣ EDGE CASES

### High Earner with USC Top Band

**Scenario:** €80,000 salary + €20,000 bonus

```
Total Gross: €100,000

Income Tax:
  €40,000 × 20% = €8,000
  €60,000 × 40% = €24,000
  Gross Tax: €32,000
  Credits: €3,550
  Net Tax: €28,450

USC:
  €12,012 × 0.5% = €60.06
  (€22,920 - €12,012) × 2% = €218.16
  (€70,044 - €22,920) × 4.5% = €2,120.58
  (€100,000 - €70,044) × 8% = €2,396.48
  Total USC: €4,795.28

PRSI:
  €100,000 × 4% = €4,000

Total Tax: €28,450 + €4,795.28 + €4,000 = €37,245.28
Effective Rate: 37.2%
```

### Self-Employed with Commission

**Scenario:** Self-employed, €35,000 base + €15,000 annual commission

```
Total Gross: €50,000

Income Tax:
  €40,000 × 20% = €8,000
  €10,000 × 40% = €4,000
  Gross Tax: €12,000
  Credits: €1,775 (no PAYE credit)
  Net Tax: €10,225

USC:
  €12,012 × 0.5% = €60.06
  (€22,920 - €12,012) × 2% = €218.16
  (€50,000 - €22,920) × 4.5% = €1,218.60
  Total USC: €1,496.82

PRSI:
  €50,000 × 4% = €2,000

Total Tax: €10,225 + €1,496.82 + €2,000 = €13,721.82
Effective Rate: 27.4%
```

---

## 1️⃣3️⃣ TEST SCENARIOS

### Test 1: Standard Employee with Overtime

**Input:**
- Base Rate: €18/hour
- Regular Hours: 39/week
- Overtime Hours: 5/week
- Weeks: 52
- Marital Status: Single

**Expected Output:**
```
Regular: €36,504
Overtime: €7,020 (€18 × 5 × 1.5 × 52)
Total Gross: €43,524

Income Tax: €4,793.80
USC: €1,177.58
PRSI: €1,740.96
Total Tax: €7,712.34
Net Annual: €35,811.66
Effective Rate: 17.7%
```

### Test 2: Married with Bonus

**Input:**
- Base Salary: €50,000
- Bonus: €8,000
- Marital Status: Married

**Expected Output:**
```
Without Bonus:
  Gross: €50,000
  Tax: €7,746.82
  Net: €42,253.18

With Bonus:
  Gross: €58,000
  Tax: €11,106.82
  Net: €46,893.18

Bonus Impact:
  Gross Bonus: €8,000
  Additional Tax: €3,360
  Net Bonus: €4,640
  Bonus Tax Rate: 42%
```

### Test 3: Commission with Pension

**Input:**
- Base Salary: €40,000
- Commission: €2,000/month
- Frequency: Monthly
- Pension: €4,000/year (10% of base)
- Marital Status: Single

**Expected Output:**
```
Base: €40,000
Annual Commission: €24,000
Total Gross: €64,000

Pension: €4,000
Taxable: €60,000

Income Tax: €11,650
USC: €2,211.42
PRSI: €2,560
Total Tax: €16,421.42
Net Annual: €47,578.58
Net Monthly: €3,964.88

Effective Rate: 25.7%
```

---

## 1️⃣4️⃣ FINAL STATUS

**Ireland Variable Pay Calculators:** ✅ **SPECIFICATION COMPLETE**

All 3 calculators documented and ready for implementation:
1. ✅ Overtime Pay Calculator
2. ✅ Bonus Tax Calculator
3. ✅ Commission Calculator

**Ready for:**
- ✅ Ireland tax engine integration
- ✅ Calculator-specific UI
- ✅ Test scenario validation
- ✅ Content creation

---

**This specification is now LOCKED. All Ireland variable pay calculators follow this pattern.**

**Last Updated:** January 14, 2026
**Next Review:** After implementation complete
