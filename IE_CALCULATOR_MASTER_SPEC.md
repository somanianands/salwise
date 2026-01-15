# 🇮🇪 IRELAND CALCULATOR SYSTEM (MASTER SPECIFICATION)

**Status:** ✅ Production Standard
**Date:** January 14, 2026
**Tax Year:** 2026
**Currency:** EUR (€)

---

## Calculators Covered

| Calculator | URL Slug |
|-----------|----------|
| Salary Calculator | `/salary-calculator` |
| Gross to Net Calculator | `/gross-to-net-calculator` |
| Net to Gross Calculator | `/net-to-gross-salary-calculator` |
| Salary After Tax | `/salary-after-tax` |
| Take Home Pay Calculator | `/take-home-pay-calculator` |
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
- ✅ Always use latest 2026 Ireland rules
- ✅ Update rules centrally (config-based)

### 🔒 USER NEVER ENTERS TAX RATES
- ❌ No income tax rates / bands
- ❌ No USC rates / bands
- ❌ No PRSI rates
- ❌ No tax credits input
- ✅ All tax logic is automatic

### ✅ CORE PRINCIPLE
**Normalize → Annual → Apply Tax Engine → Redistribute**

All calculators:
1. Normalize input to annual gross income
2. Apply Ireland tax engine (Income Tax + USC + PRSI)
3. Redistribute net results to desired output frequency

---

## 2️⃣ MASTER INPUT SPECIFICATION

### A. Core Inputs (Always Visible)

#### 1. Gross Pay Amount
- **Type:** Number
- **Currency:** EUR (€)
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

#### 3. Marital Status
- **Type:** Select
- **Options:**
  - Single
  - Married / Civil Partner
  - Widowed / Surviving Civil Partner
- **Purpose:** Determines standard rate band and tax credits

#### 4. Employment Type
- **Type:** Select
- **Options:**
  - Employee (PAYE)
  - Self-Employed
- **Default:** Employee
- **Purpose:** Determines PRSI class

### B. Optional Advanced Inputs (Collapsed / Hidden)

#### 5. Pension Contribution (Pre-Tax)
- **Type:** Number (EUR)
- **Default:** €0
- **Description:** Pre-tax pension contributions (reduces taxable income)
- **Max:** Age-dependent limits (e.g., 20% under 30, 40% over 60)

#### 6. Health Insurance (Employer-Sponsored)
- **Type:** Number (EUR)
- **Default:** €0
- **Description:** Pre-tax health insurance

#### 7. Other Pre-Tax Benefits
- **Type:** Number (EUR)
- **Default:** €0
- **Examples:** Bike-to-work scheme, etc.

#### 8. Dependents
- **Type:** Number
- **Default:** 0
- **Note:** May affect tax credits (simplified)

#### 9. Additional Tax Withholding
- **Type:** Number (EUR)
- **Default:** €0
- **Description:** Voluntary extra tax withheld

#### 10. Working Hours (Hourly Calculators Only)
- **Type:** Number
- **Default:** 2028 (39 hours/week × 52 weeks)
- **Description:** For hourly → annual normalization

### C. Auto-Calculated (NOT User Input)

Claude / Cursor must calculate these internally:

- Annual Gross Pay (normalized from input)
- Standard Rate Band (from marital status)
- Tax Credits (from marital status + PAYE)
- Income Tax (progressive: 20%, 40%)
- Universal Social Charge (USC - progressive: 0.5%, 2%, 4.5%, 8%)
- Pay Related Social Insurance (PRSI - 4%)
- Total Tax
- Net Income (all frequencies)

❌ **Users must NEVER input tax rates, USC rates, or PRSI rates**

---

## 3️⃣ IRELAND TAX RULES (2026)

### A. Income Tax Bands

**Standard Rate Band:**

| Marital Status | Standard Rate Band | Rate |
|---------------|-------------------|------|
| Single | €0 - €40,000 | 20% |
| Single | €40,001+ | 40% |
| Married / Civil Partner (one income) | €0 - €49,000 | 20% |
| Married / Civil Partner (one income) | €49,001+ | 40% |
| Married / Civil Partner (two incomes) | €0 - €49,000 + €31,000 | 20% |
| Married / Civil Partner (two incomes) | Above | 40% |

**Simplified for Calculator:**
- Single: €40,000 standard rate band
- Married: €49,000 standard rate band (default)

**Calculation:**
```
if grossIncome <= standardRateBand:
  incomeTax = grossIncome × 0.20
else:
  standardBandTax = standardRateBand × 0.20
  higherBandTax = (grossIncome - standardRateBand) × 0.40
  incomeTax = standardBandTax + higherBandTax
```

### B. Tax Credits (2026)

Tax credits **reduce the tax liability** after tax is calculated.

| Credit | Amount | Applies To |
|--------|--------|-----------|
| Single Person Tax Credit | €1,775 | Single individuals |
| Married Person Tax Credit | €3,550 | Married / Civil Partners |
| PAYE Tax Credit | €1,775 | All employees (PAYE) |
| Employee Tax Credit | €0 | (Merged into PAYE credit) |

**Total Tax Credits:**
- Single Employee: €1,775 + €1,775 = €3,550
- Married Employee: €3,550 + €1,775 = €5,325

**Note:** Self-employed do NOT get PAYE credit.

**Application:**
```
grossTax = calculateIncomeTax(taxableIncome)
taxAfterCredits = max(0, grossTax - taxCredits)
```

### C. Universal Social Charge (USC)

USC is applied progressively on **gross income** (not taxable income).

**2026 USC Bands:**

| Band | Income Range | Rate |
|------|-------------|------|
| 1 | €0 - €12,012 | 0.5% |
| 2 | €12,013 - €22,920 | 2.0% |
| 3 | €22,921 - €70,044 | 4.5% |
| 4 | €70,045+ | 8.0% |

**Exemption:**
- If gross income < €13,000, USC = €0

**Calculation:**
```typescript
function calculateUSC(grossIncome: number): number {
  if (grossIncome < 13000) return 0;

  const bands = [
    { min: 0, max: 12012, rate: 0.005 },
    { min: 12012, max: 22920, rate: 0.02 },
    { min: 22920, max: 70044, rate: 0.045 },
    { min: 70044, max: Infinity, rate: 0.08 }
  ];

  let usc = 0;
  let previousMax = 0;

  for (const band of bands) {
    if (grossIncome <= previousMax) break;

    const taxableInBand = Math.min(grossIncome, band.max) - previousMax;
    if (taxableInBand > 0) {
      usc += taxableInBand * band.rate;
    }

    previousMax = band.max;
  }

  return usc;
}
```

### D. Pay Related Social Insurance (PRSI)

PRSI is calculated on **gross income**.

**Employee (Class A):**
- **Rate:** 4.0%
- **Threshold:** €352 per week (€18,304 annually)
- **Below threshold:** €0
- **At or above threshold:** 4% on ALL income (not just excess)

**Self-Employed (Class S):**
- **Rate:** 4.0%
- **Threshold:** €5,000 annually
- **Below threshold:** €0
- **At or above threshold:** 4% on ALL income

**Employer PRSI (for reference only, not deducted from employee):**
- **Rate:** 11.05%
- **Not shown in net pay calculation**

**Calculation:**
```typescript
function calculatePRSI(grossIncome: number, employmentType: EmploymentType): number {
  if (employmentType === 'employee') {
    const weeklyThreshold = 352;
    const annualThreshold = weeklyThreshold * 52; // €18,304

    if (grossIncome < annualThreshold) return 0;
    return grossIncome * 0.04;
  } else { // self-employed
    const threshold = 5000;

    if (grossIncome < threshold) return 0;
    return grossIncome * 0.04;
  }
}
```

---

## 4️⃣ CALCULATION FLOW (MASTER FORMULA)

### Step-by-Step:

```
1. Normalize Input to Annual Gross
   annualGross = normalizeToAnnual(inputAmount, frequency)

2. Calculate Pre-Tax Deductions
   pensionContribution = pensionAmount
   healthInsurance = healthInsuranceAmount
   otherPreTax = otherBenefitsAmount
   totalPreTaxDeductions = pension + health + other

3. Calculate Taxable Income
   taxableIncome = annualGross - totalPreTaxDeductions

4. Determine Standard Rate Band
   standardRateBand = maritalStatus === 'single' ? 40000 : 49000

5. Calculate Income Tax (Before Credits)
   if (taxableIncome <= standardRateBand):
     grossIncomeTax = taxableIncome × 0.20
   else:
     standardBandTax = standardRateBand × 0.20
     higherBandTax = (taxableIncome - standardRateBand) × 0.40
     grossIncomeTax = standardBandTax + higherBandTax

6. Determine Tax Credits
   if (maritalStatus === 'single'):
     personalCredit = 1775
   else:
     personalCredit = 3550

   if (employmentType === 'employee'):
     payeCredit = 1775
   else:
     payeCredit = 0

   totalCredits = personalCredit + payeCredit

7. Calculate Income Tax (After Credits)
   incomeTax = max(0, grossIncomeTax - totalCredits)

8. Calculate USC (on gross income, not taxable)
   usc = calculateUSC(annualGross)

9. Calculate PRSI (on gross income)
   prsi = calculatePRSI(annualGross, employmentType)

10. Calculate Additional Withholding
    additionalTax = additionalWithholding

11. Calculate Total Tax
    totalTax = incomeTax + usc + prsi + additionalTax

12. Calculate Net Income
    netAnnual = annualGross - totalTax

13. Redistribute to Output Frequencies
    netMonthly = netAnnual / 12
    netWeekly = netAnnual / 52
    netDaily = netAnnual / 260
    netHourly = netAnnual / workingHours

14. Calculate Effective Tax Rate
    effectiveTaxRate = (totalTax / annualGross) × 100
```

---

## 5️⃣ REQUIRED OUTPUTS (ALL CALCULATORS)

### A. Core Outputs

| Output | Description |
|--------|-------------|
| Gross Annual Income | Normalized from input |
| Pre-Tax Deductions | Pension + Health Insurance + Other |
| Taxable Income | After pre-tax deductions |
| Income Tax | After tax credits |
| Universal Social Charge (USC) | Progressive |
| PRSI (Employee) | 4% on gross if above threshold |
| Total Tax | Income Tax + USC + PRSI |
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
- ✅ Pre-Tax Deductions (if applicable)
- ✅ Taxable Income
- ✅ Income Tax @ 20% / 40%
- ✅ Tax Credits Applied
- ✅ Universal Social Charge (USC)
- ✅ PRSI (4%)
- ✅ Total Tax
- ✅ Net Annual Pay
- ✅ Net Monthly / Weekly / Daily / Hourly

---

## 6️⃣ IMPLEMENTATION EXAMPLES

### Example 1: Single Employee (€35,000)

**Input:**
- Gross Salary: €35,000
- Marital Status: Single
- Employment Type: Employee
- Pension: €0
- Pre-Tax Deductions: €0

**Calculation:**
```
Annual Gross: €35,000
Pre-Tax Deductions: €0
Taxable Income: €35,000

Income Tax (Before Credits):
  €35,000 × 20% = €7,000 (all in standard rate band)

Tax Credits:
  Single Person: €1,775
  PAYE: €1,775
  Total: €3,550

Income Tax (After Credits):
  €7,000 - €3,550 = €3,450

USC:
  €12,012 × 0.5% = €60.06
  (€22,920 - €12,012) × 2% = €218.16
  (€35,000 - €22,920) × 4.5% = €543.60
  Total USC: €821.82

PRSI:
  €35,000 × 4% = €1,400

Total Tax: €3,450 + €821.82 + €1,400 = €5,671.82
Net Annual: €35,000 - €5,671.82 = €29,328.18
Net Monthly: €29,328.18 ÷ 12 = €2,444.02

Effective Tax Rate: 16.2%
```

### Example 2: Married Employee with Pension (€60,000)

**Input:**
- Gross Salary: €60,000
- Marital Status: Married
- Employment Type: Employee
- Pension: €6,000 (10%)
- Pre-Tax Deductions: €0

**Calculation:**
```
Annual Gross: €60,000
Pre-Tax Deductions: €6,000 (pension)
Taxable Income: €60,000 - €6,000 = €54,000

Standard Rate Band (Married): €49,000

Income Tax (Before Credits):
  €49,000 × 20% = €9,800
  (€54,000 - €49,000) × 40% = €2,000
  Total: €11,800

Tax Credits:
  Married: €3,550
  PAYE: €1,775
  Total: €5,325

Income Tax (After Credits):
  €11,800 - €5,325 = €6,475

USC (on gross €60,000):
  €12,012 × 0.5% = €60.06
  (€22,920 - €12,012) × 2% = €218.16
  (€60,000 - €22,920) × 4.5% = €1,668.60
  Total USC: €1,946.82

PRSI:
  €60,000 × 4% = €2,400

Total Tax: €6,475 + €1,946.82 + €2,400 = €10,821.82
Net Annual: €60,000 - €10,821.82 = €49,178.18
Net Monthly: €49,178.18 ÷ 12 = €4,098.18

Effective Tax Rate: 18.0%
```

### Example 3: High Earner (€100,000)

**Input:**
- Gross Salary: €100,000
- Marital Status: Single
- Employment Type: Employee
- Pension: €0

**Calculation:**
```
Annual Gross: €100,000
Taxable Income: €100,000

Income Tax (Before Credits):
  €40,000 × 20% = €8,000
  €60,000 × 40% = €24,000
  Total: €32,000

Tax Credits: €3,550

Income Tax (After Credits):
  €32,000 - €3,550 = €28,450

USC:
  €12,012 × 0.5% = €60.06
  (€22,920 - €12,012) × 2% = €218.16
  (€70,044 - €22,920) × 4.5% = €2,120.58
  (€100,000 - €70,044) × 8% = €2,396.48
  Total USC: €4,795.28

PRSI:
  €100,000 × 4% = €4,000

Total Tax: €28,450 + €4,795.28 + €4,000 = €37,245.28
Net Annual: €100,000 - €37,245.28 = €62,754.72
Net Monthly: €62,754.72 ÷ 12 = €5,229.56

Effective Tax Rate: 37.2%
```

---

## 7️⃣ COMMON PITFALLS TO AVOID

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

### ❌ Wrong: Income Tax Without Credits
```typescript
// WRONG - Forgetting to subtract tax credits
const incomeTax = taxableIncome * 0.20;
```

### ✅ Correct: Income Tax After Credits
```typescript
// CORRECT - Apply progressive rates then subtract credits
const grossTax = calculateProgressiveTax(taxableIncome);
const incomeTax = max(0, grossTax - taxCredits);
```

### ❌ Wrong: PRSI Below Threshold
```typescript
// WRONG - Applying PRSI without threshold check
const prsi = grossIncome * 0.04;
```

### ✅ Correct: PRSI With Threshold
```typescript
// CORRECT - Check threshold first
if (grossIncome < 18304) {
  prsi = 0;
} else {
  prsi = grossIncome * 0.04;
}
```

---

## 8️⃣ CURSOR / CLAUDE IMPLEMENTATION RULES

**IMPORTANT RULES:**
- ✅ Always normalize to annual income first
- ❌ Never apply per-period tax rates
- ✅ Taxes must be calculated once on total annual income
- ✅ Tax credits from marital status (automatic)
- ✅ USC calculated on gross income
- ✅ PRSI calculated on gross income (with threshold)
- ✅ Income tax calculated on taxable income (after pension)
- ✅ Show all three tax components (Income Tax, USC, PRSI)

---

## 9️⃣ PRODUCTION READINESS

**Status:** Ready for implementation

**Next Steps:**
1. Implement Ireland tax engine (`lib/calculators/ie.ts`)
2. Implement time-based calculators (reuse normalization logic)
3. Implement variable pay calculators (overtime/bonus/commission)
4. Test all calculators with example scenarios
5. Create content for all Ireland calculator pages

---

**This specification is now LOCKED. All Ireland calculators follow this pattern.**

**Last Updated:** January 14, 2026
**Next Review:** After implementation complete
