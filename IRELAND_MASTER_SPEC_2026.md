# 🇮🇪 IRELAND – CALCULATOR SYSTEM (MASTER SPEC 2026)

**Status:** ✅ Production Standard
**Date:** January 14, 2026
**Tax Year:** 2026
**Currency:** EUR (€)

**This is the definitive specification for ALL Ireland salary calculators.**

---

## Calculators Covered

| Calculator | URL Slug |
|-----------|----------|
| Salary Calculator | `/salary-calculator` |
| Gross to Net Salary | `/gross-to-net-salary` |
| Salary After Tax | `/salary-after-tax` |
| Take Home Pay | `/take-home-pay` |
| Hourly to Salary | `/hourly-to-salary` |
| Hourly Rate Calculator | `/hourly-rate` |
| Weekly to Salary | `/weekly-to-salary` |
| Monthly to Salary | `/monthly-to-salary` |
| Daily Rate to Salary | `/daily-to-salary` |
| Overtime Pay Calculator | `/overtime-pay` |
| Bonus Tax Calculator | `/bonus-tax` |
| Commission Calculator | `/commission-calculator` |

**All calculators share the same Ireland tax engine: Income Tax + USC + PRSI**

---

## 1️⃣ CORE DESIGN PRINCIPLES (VERY IMPORTANT)

### 🔒 NO TAX YEAR INPUT

- ❌ Do NOT ask user for tax year
- ✅ Always use latest 2026 Ireland rules
- ✅ Update rules centrally (config-based)

### 🔒 USER NEVER ENTERS TAX RATES

Users must never input:
- ❌ Income Tax rates / bands
- ❌ USC rates / bands
- ❌ PRSI rates
- ❌ Standard rate cutoff
- ❌ Tax credits

✅ These are ALL auto-calculated internally

### ✅ CORE PRINCIPLE

**Normalize → Annual → Apply Tax Engine → Redistribute**

All calculators:
1. Normalize input to annual gross income
2. Apply Ireland tax engine (Income Tax + USC + PRSI)
3. Redistribute net results to desired output frequency

---

## 2️⃣ MASTER INPUT SPECIFICATION

### 2.1 Core Inputs (Always Visible)

#### 1. Gross Pay Amount
- **Type:** Number
- **Label:** Gross Income
- **Unit:** EUR (€)
- **Required:** Yes
- **Description:** Total gross income before taxes and deductions

#### 2. Pay Frequency
- **Type:** Select
- **Options:**
  - Annual
  - Monthly
  - Weekly
  - Daily
  - Hourly
- **Default:** Annual
- **Internal Logic:** Convert all frequencies to annual income

**Normalization Formulas:**

| Frequency | Formula |
|-----------|---------|
| Annual | `amount` (as-is) |
| Monthly | `amount × 12` |
| Weekly | `amount × 52` |
| Daily | `amount × workingDays` (default 260) |
| Hourly | `amount × workingHours` (default 2028) |

**Note:** Ireland standard work week is 39 hours, so default hourly = 39 × 52 = 2028 hours/year

#### 3. Marital Status
- **Type:** Select
- **Options:**
  - Single
  - Married / Civil Partner
  - Widowed / Surviving Civil Partner
- **Default:** Single
- **Logic:** Determines standard rate cutoff and tax credits

#### 4. Employment Type
- **Type:** Select
- **Options:**
  - Employee (PAYE)
  - Self-Employed
- **Default:** Employee
- **Logic:** Determines PRSI class and whether PAYE credit applies

### 2.2 Optional Advanced Inputs (Collapsed)

#### 5. Pension Contributions (Pre-Tax)
- **Type:** Number
- **Unit:** EUR (€) per year
- **Default:** 0
- **Logic:** Reduces taxable income for Income Tax (NOT for USC/PRSI)
- **Note:** Age-dependent limits apply (20%-40% of gross)

#### 6. Other Pre-Tax Deductions
- **Type:** Number
- **Unit:** EUR (€) per year
- **Default:** 0
- **Examples:** Health insurance, employer benefits, bike-to-work scheme

#### 7. Dependents
- **Type:** Number
- **Default:** 0
- **Note:** May affect tax credits (simplified for calculator)

#### 8. Additional Withholding (Hidden / Power Users)
- **Type:** Number
- **Unit:** EUR (€) per year
- **Default:** 0
- **Logic:** Added to total tax

#### 9. Working Hours (Hourly Only)
- **Type:** Number
- **Default:** 2028 (39 hours/week × 52 weeks)
- **Logic:** For hourly → annual conversion

#### 10. Working Days (Daily Only)
- **Type:** Number
- **Default:** 260 (5 days/week × 52 weeks)
- **Logic:** For daily → annual conversion

---

## 3️⃣ AUTO-CALCULATED (NOT USER INPUT)

Claude / Cursor must calculate these internally:

- ✅ Annual Gross Income (normalized from input)
- ✅ Standard Rate Cutoff (from marital status)
- ✅ Tax Credits (from marital status + employment type)
- ✅ Taxable Income (after pre-tax deductions)
- ✅ Income Tax (progressive 20%/40%, minus credits)
- ✅ Universal Social Charge (USC - progressive 0.5%/2%/4.5%/8%)
- ✅ PRSI (4% with threshold)
- ✅ Total Tax
- ✅ Net Income (all frequencies)

❌ **Users should NEVER enter tax rates, bands, or credits**

---

## 4️⃣ IRELAND TAX ENGINE (2026)

### 4.1 Income Tax Bands

**Standard Rate Cutoff by Marital Status:**

| Marital Status | Standard Rate Band | Higher Rate |
|---------------|-------------------|-------------|
| Single | €0 - €40,000 (20%) | €40,001+ (40%) |
| Married / Civil Partner (one income) | €0 - €49,000 (20%) | €49,001+ (40%) |
| Married / Civil Partner (two incomes) | €0 - €80,000* (20%) | Above (40%) |

*For two-income married couples: €49,000 + €31,000 transferable

**Simplified for Calculator:**
- Single: €40,000 standard rate band
- Married: €49,000 standard rate band

**Tax Credits (2026):**

| Credit | Amount | Applies To |
|--------|--------|-----------|
| Single Person Tax Credit | €1,775 | Single individuals |
| Married Person Tax Credit | €3,550 | Married / Civil Partners |
| PAYE Tax Credit | €1,775 | All employees (not self-employed) |

**Total Tax Credits:**
- Single Employee: €1,775 + €1,775 = **€3,550**
- Married Employee: €3,550 + €1,775 = **€5,325**
- Single Self-Employed: €1,775 (no PAYE credit)
- Married Self-Employed: €3,550 (no PAYE credit)

**Income Tax Calculation:**

```typescript
// 1. Calculate taxable income
taxableIncome = annualGross - pensionContribution - preTaxDeductions

// 2. Determine standard rate cutoff
standardRateCutoff = maritalStatus === 'single' ? 40000 : 49000

// 3. Calculate tax before credits
if (taxableIncome <= standardRateCutoff) {
  grossIncomeTax = taxableIncome × 0.20
} else {
  standardBandTax = standardRateCutoff × 0.20
  higherBandTax = (taxableIncome - standardRateCutoff) × 0.40
  grossIncomeTax = standardBandTax + higherBandTax
}

// 4. Determine tax credits
if (maritalStatus === 'single') {
  personalCredit = 1775
} else {
  personalCredit = 3550
}

if (employmentType === 'employee') {
  payeCredit = 1775
} else {
  payeCredit = 0
}

totalCredits = personalCredit + payeCredit

// 5. Calculate income tax after credits
incomeTax = max(0, grossIncomeTax - totalCredits)
```

### 4.2 Universal Social Charge (USC)

USC is applied progressively on **gross income** (not taxable income).

**2026 USC Bands:**

| Band | Income Range | Rate |
|------|-------------|------|
| 1 | €0 - €12,012 | 0.5% |
| 2 | €12,013 - €22,920 | 2.0% |
| 3 | €22,921 - €70,044 | 4.5% |
| 4 | €70,045+ | 8.0% |

**USC Exemption:**
- If gross income < €13,000, USC = €0

**USC Calculation:**

```typescript
function calculateUSC(grossIncome: number): number {
  // Exemption for low earners
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

    const incomeInBand = Math.min(grossIncome, band.max) - previousMax;
    if (incomeInBand > 0) {
      usc += incomeInBand * band.rate;
    }

    previousMax = band.max;
  }

  return usc;
}
```

**USC Example (€50,000 gross):**
```
Band 1: €12,012 × 0.5% = €60.06
Band 2: (€22,920 - €12,012) × 2% = €218.16
Band 3: (€50,000 - €22,920) × 4.5% = €1,218.60
Total USC: €1,496.82
```

### 4.3 Pay Related Social Insurance (PRSI)

PRSI is calculated on **gross income** (not taxable income).

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

**PRSI Calculation:**

```typescript
function calculatePRSI(
  grossIncome: number,
  employmentType: 'employee' | 'self-employed'
): number {
  if (employmentType === 'employee') {
    const weeklyThreshold = 352;
    const annualThreshold = weeklyThreshold * 52; // €18,304

    if (grossIncome < annualThreshold) {
      return 0;
    } else {
      return grossIncome * 0.04;
    }
  } else { // self-employed
    const annualThreshold = 5000;

    if (grossIncome < annualThreshold) {
      return 0;
    } else {
      return grossIncome * 0.04;
    }
  }
}
```

### 4.4 Total Tax & Net Pay Calculation

```typescript
// 1. Normalize input to annual gross
annualGross = normalizeToAnnual(inputAmount, frequency)

// 2. Calculate pre-tax deductions
totalPreTaxDeductions = pension + otherPreTax

// 3. Calculate taxable income
taxableIncome = annualGross - totalPreTaxDeductions

// 4. Calculate Income Tax (on taxable income, after credits)
incomeTax = calculateIncomeTax(taxableIncome, maritalStatus, employmentType)

// 5. Calculate USC (on gross income)
usc = calculateUSC(annualGross)

// 6. Calculate PRSI (on gross income)
prsi = calculatePRSI(annualGross, employmentType)

// 7. Calculate total tax
totalTax = incomeTax + usc + prsi + additionalWithholding

// 8. Calculate net income
netAnnual = annualGross - totalTax

// 9. Redistribute to output frequencies
netMonthly = netAnnual / 12
netWeekly = netAnnual / 52
netDaily = netAnnual / 260
netHourly = netAnnual / workingHours

// 10. Calculate effective tax rate
effectiveTaxRate = (totalTax / annualGross) × 100
```

---

## 5️⃣ REQUIRED OUTPUTS (ALL CALCULATORS)

### Core Outputs

| Output | Description |
|--------|-------------|
| Gross Annual Income | Normalized from input |
| Pre-Tax Deductions | Pension + Other (if any) |
| Taxable Income | After pre-tax deductions |
| Income Tax | After tax credits |
| Universal Social Charge (USC) | Progressive on gross |
| PRSI | 4% on gross (if above threshold) |
| Total Tax | Income Tax + USC + PRSI |
| Net Annual Pay | Gross – Total Tax |

### Time-Based Outputs

| Output | Formula |
|--------|---------|
| Net Monthly Pay | Net Annual ÷ 12 |
| Net Weekly Pay | Net Annual ÷ 52 |
| Net Daily Pay | Net Annual ÷ 260 |
| Net Hourly Pay | Net Annual ÷ Working Hours |

### Analytics

| Output | Formula |
|--------|---------|
| Effective Tax Rate | (Total Tax ÷ Gross Annual) × 100 |
| Take-Home % | (Net Annual ÷ Gross Annual) × 100 |

---

## 6️⃣ SPECIAL LOGIC BY CALCULATOR TYPE

### Salary / Gross → Net Calculator
```
Input: Annual gross salary
Logic: Apply tax engine directly
Output: Net annual and redistributed
```

### Hourly → Salary Calculator
```
Input: Hourly rate
Normalization: annualGross = hourlyRate × 2028 (39 hrs/week × 52 weeks)
Logic: Apply tax engine on annual gross
Output: Net hourly, weekly, monthly, annual
```

### Weekly → Salary Calculator
```
Input: Weekly pay
Normalization: annualGross = weeklyPay × 52
Logic: Apply tax engine on annual gross
Output: Net weekly, monthly, annual, hourly
```

### Monthly → Salary Calculator
```
Input: Monthly salary
Normalization: annualGross = monthlySalary × 12
Logic: Apply tax engine on annual gross
Output: Net monthly, weekly, annual, hourly
```

### Daily → Salary Calculator
```
Input: Daily rate
Normalization: annualGross = dailyRate × 260 (5 days/week × 52 weeks)
Logic: Apply tax engine on annual gross
Output: Net daily, weekly, monthly, annual
```

### Overtime Pay Calculator
```
Input: Base hourly rate, regular hours, overtime hours, multiplier, weeks
Calculation:
  regularAnnualPay = baseRate × regularHours × weeks
  overtimeAnnualPay = baseRate × overtimeHours × multiplier × weeks
  annualGross = regularAnnualPay + overtimeAnnualPay
Logic: Apply tax engine on total annual gross
Output: Regular pay, overtime pay, net breakdown
Note: Overtime is NOT taxed separately; it increases total income
```

### Bonus Tax Calculator
```
Input: Base salary, bonus amount
Calculation:
  annualGross = baseSalary + bonusAmount
Logic:
  taxWithoutBonus = calculateTax(baseSalary)
  taxWithBonus = calculateTax(baseSalary + bonus)
  additionalTax = taxWithBonus - taxWithoutBonus
  netBonus = bonus - additionalTax
Output: Gross bonus, additional tax, net bonus, comparison
Note: Bonus is NOT taxed with flat rate; use marginal tax approach
```

### Commission Calculator
```
Input: Base salary, commission amount, frequency (monthly/quarterly/annual)
Normalization:
  annualCommission = commission × frequency multiplier (12, 4, or 1)
  annualGross = baseSalary + annualCommission
Logic: Apply tax engine on total annual gross
Output: Base, commission, total, net breakdown
Note: Commission is ordinary income, taxed as part of total
```

---

## 7️⃣ IMPLEMENTATION EXAMPLES

### Example 1: Single Employee (€35,000)

**Input:**
- Gross Salary: €35,000
- Marital Status: Single
- Employment Type: Employee
- Pension: €0

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

PRSI (Employee):
  €35,000 × 4% = €1,400

Total Tax: €3,450 + €821.82 + €1,400 = €5,671.82
Net Annual: €35,000 - €5,671.82 = €29,328.18
Net Monthly: €29,328.18 ÷ 12 = €2,444.02
Net Weekly: €29,328.18 ÷ 52 = €564.00
Net Hourly: €29,328.18 ÷ 2028 = €14.46

Effective Tax Rate: 16.2%
```

### Example 2: Married Employee with Pension (€60,000)

**Input:**
- Gross Salary: €60,000
- Marital Status: Married
- Employment Type: Employee
- Pension: €6,000 (10%)

**Calculation:**
```
Annual Gross: €60,000
Pre-Tax Deductions: €6,000 (pension)
Taxable Income: €54,000

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

PRSI (on gross):
  €60,000 × 4% = €2,400

Total Tax: €6,475 + €1,946.82 + €2,400 = €10,821.82
Net Annual: €60,000 - €10,821.82 = €49,178.18
Net Monthly: €49,178.18 ÷ 12 = €4,098.18

Effective Tax Rate: 18.0%
```

### Example 3: High Earner Hitting USC Top Band (€100,000)

**Input:**
- Gross Salary: €100,000
- Marital Status: Single
- Employment Type: Employee

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

USC (hits 8% top band):
  €12,012 × 0.5% = €60.06
  (€22,920 - €12,012) × 2% = €218.16
  (€70,044 - €22,920) × 4.5% = €2,120.58
  (€100,000 - €70,044) × 8% = €2,396.48
  Total USC: €4,795.28

PRSI:
  €100,000 × 4% = €4,000

Total Tax: €28,450 + €4,795.28 + €4,000 = €37,245.28
Net Annual: €100,000 - €37,245.28 = €62,754.72

Effective Tax Rate: 37.2%
```

### Example 4: Hourly Worker (€20/hour)

**Input:**
- Hourly Rate: €20
- Working Hours: 2028 (39 hrs/week × 52)
- Marital Status: Single
- Employment Type: Employee

**Calculation:**
```
Annual Gross = €20 × 2028 = €40,560

(Apply standard tax engine)

Income Tax: €4,674 (after credits)
USC: €1,072.02
PRSI: €1,622.40
Total Tax: €7,368.42
Net Annual: €33,191.58

Net Hourly: €33,191.58 ÷ 2028 = €16.37
Net Weekly: €33,191.58 ÷ 52 = €638.30
Net Monthly: €33,191.58 ÷ 12 = €2,765.97

Effective Tax Rate: 18.2%
```

### Example 5: Bonus Calculation (€45,000 + €10,000 bonus)

**Input:**
- Base Salary: €45,000
- Bonus: €10,000
- Marital Status: Single

**Calculation:**
```
Without Bonus:
  Gross: €45,000
  Income Tax: €4,550
  USC: €1,240.20
  PRSI: €1,800
  Total Tax: €7,590.20
  Net: €37,409.80

With Bonus:
  Gross: €55,000
  Income Tax: €8,550
  USC: €1,690.20
  PRSI: €2,200
  Total Tax: €12,440.20
  Net: €42,559.80

Bonus Impact:
  Gross Bonus: €10,000
  Additional Tax: €4,850
  Net Bonus: €5,150
  Bonus Tax Rate: 48.5%
```

---

## 8️⃣ VALIDATION CHECKLIST

### Core Tax Engine
- [ ] Income Tax calculated on taxable income (after pension)
- [ ] Tax credits correctly applied (personal + PAYE)
- [ ] USC calculated on gross income (progressive 4 bands)
- [ ] PRSI calculated on gross income (with threshold)
- [ ] Pension reduces taxable income (NOT USC/PRSI)
- [ ] Marital status affects standard rate band
- [ ] Employment type affects PAYE credit

### Time-Based Calculators
- [ ] Hourly: Normalizes to annual (× 2028)
- [ ] Weekly: Normalizes to annual (× 52)
- [ ] Monthly: Normalizes to annual (× 12)
- [ ] Daily: Normalizes to annual (× 260)
- [ ] All use shared Ireland tax engine
- [ ] Results match salary calculator for same annual amount

### Variable Pay Calculators
- [ ] Overtime: Combined with regular pay, not taxed separately
- [ ] Bonus: Marginal tax approach, NOT flat rate
- [ ] Commission: Normalized by frequency, taxed as ordinary income
- [ ] All three tax components included (Income Tax, USC, PRSI)

---

## 9️⃣ COMMON PITFALLS TO AVOID

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
// CORRECT - Calculate gross tax, then subtract credits
const grossTax = calculateProgressiveTax(taxableIncome);
const incomeTax = Math.max(0, grossTax - taxCredits);
```

### ❌ Wrong: Flat Bonus Tax
```typescript
// WRONG - Never use flat bonus tax
const bonusTax = bonus * 0.40;
```

### ✅ Correct: Marginal Bonus Tax
```typescript
// CORRECT - Calculate actual marginal impact
const withoutBonus = calculateIE(baseSalary);
const withBonus = calculateIE(baseSalary + bonus);
const bonusTax = withBonus.totalTax - withoutBonus.totalTax;
```

---

## 🔟 STRICT CURSOR / CLAUDE INSTRUCTIONS

**IMPORTANT RULES:**

1. ✅ **Always normalize to annual first**
   - Convert all input frequencies to annual gross
   - Apply tax once on annual amount
   - Redistribute to output frequencies

2. ❌ **Never ask for tax year**
   - Always use 2026 Ireland rules
   - Update centrally when rules change

3. ❌ **Never ask for tax rates**
   - Income Tax rates are 20%, 40%
   - USC rates are 0.5%, 2%, 4.5%, 8%
   - PRSI rate is 4%
   - All automatic

4. ❌ **Never ask for tax credits**
   - Determine from marital status + employment type
   - Single employee: €3,550
   - Married employee: €5,325

5. ✅ **Three tax components**
   - Income Tax (on taxable)
   - USC (on gross)
   - PRSI (on gross, with threshold)

6. ✅ **Pension reduces taxable only**
   - Pre-tax for Income Tax
   - NOT pre-tax for USC/PRSI

7. ✅ **Show all breakdowns**
   - Gross annual
   - Each tax component
   - Total tax
   - Net annual, monthly, weekly, daily, hourly
   - Effective tax rate

8. ✅ **Marital status matters**
   - Single: €40,000 standard rate band
   - Married: €49,000 standard rate band

9. ✅ **Employment type matters**
   - Employee: Gets PAYE credit €1,775
   - Self-Employed: No PAYE credit

10. ✅ **Comparison for variable pay**
    - Bonus: Show with/without comparison
    - Commission: Show net commission take-home
    - Overtime: Show regular vs overtime breakdown

---

## 🎯 PRODUCTION READINESS

**Status:** Ready for implementation

**Implementation Priority:**
1. Core tax engine (Income Tax + USC + PRSI)
2. Salary calculator (baseline)
3. Time-based calculators (hourly/weekly/monthly/daily)
4. Variable pay calculators (bonus/overtime/commission)

**Testing Requirements:**
- Verify all example calculations
- Test USC progressive bands
- Test PRSI thresholds
- Test tax credit application
- Test marital status differences
- Test employment type differences

---

**This specification is now LOCKED. All Ireland calculators follow this pattern.**

**Last Updated:** January 14, 2026
**Next Review:** Tax year 2027 rule updates
