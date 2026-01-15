# 🇦🇺 AUSTRALIA – CALCULATOR SYSTEM (MASTER SPEC 2026)

**Status:** ✅ Production Standard
**Date:** January 14, 2026
**Tax Year:** 2025-2026 (FY26)
**Currency:** AUD ($)

**This is the definitive specification for ALL Australia salary calculators.**

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

**All calculators share the same Australia tax engine: Income Tax + Medicare Levy + Superannuation**

---

## 1️⃣ CORE DESIGN PRINCIPLES (VERY IMPORTANT)

### 🔒 NO TAX YEAR INPUT

- ❌ Do NOT ask user for tax year
- ✅ Always use latest 2025-2026 Australian ATO rules
- ✅ Update rules centrally (config-based)

### 🔒 USER NEVER ENTERS TAX RATES

Users must never input:
- ❌ Income tax rates / brackets
- ❌ Medicare levy rate
- ❌ Medicare levy surcharge
- ❌ Superannuation guarantee rate
- ❌ Tax offsets / thresholds

✅ These are ALL auto-calculated internally based on ATO rules

### ✅ CORE PRINCIPLE

**Normalize → Annual → Apply Tax Engine → Redistribute**

All calculators:
1. Normalize input to annual gross income
2. Apply Australia tax engine (Income Tax + Medicare Levy)
3. Redistribute net results to desired output frequency

---

## 2️⃣ MASTER INPUT SPECIFICATION

### 2.1 Core Inputs (Always Visible)

#### 1. Gross Pay Amount
- **Type:** Number
- **Label:** Gross Income
- **Unit:** AUD ($)
- **Required:** Yes
- **Description:** Total gross income before taxes and deductions

#### 2. Pay Frequency
- **Type:** Select
- **Options:**
  - Annual
  - Monthly
  - Fortnightly (Bi-Weekly)
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
| Fortnightly | `amount × 26` |
| Weekly | `amount × 52` |
| Daily | `amount × workingDays` (default 260) |
| Hourly | `amount × workingHours` (default 2080) |

**Note:** Australia commonly uses fortnightly pay (26 pay periods per year)

#### 3. Residency Status
- **Type:** Select
- **Options:**
  - Australian Resident
  - Foreign Resident
  - Working Holiday Maker
- **Default:** Australian Resident
- **Logic:** Determines tax brackets, tax-free threshold, and Medicare levy

#### 4. Employment Type
- **Type:** Select
- **Options:**
  - Employee (PAYG)
  - Contractor / Self-Employed
- **Default:** Employee
- **Logic:**
  - Employee: PAYG withholding, employer pays super
  - Contractor: Self-managed tax, must pay own super

### 2.2 Optional Advanced Inputs (Collapsed)

#### 5. Superannuation Contributions (Voluntary)
- **Type:** Number
- **Unit:** AUD ($) per year
- **Default:** 0
- **Logic:** Reduces taxable income (concessional contributions up to $30,000 cap)
- **Note:** Employer contributions (11.5%) are separate and not user-entered

#### 6. Private Health Insurance
- **Type:** Boolean
- **Default:** No
- **Logic:** Determines Medicare Levy Surcharge (MLS) for high earners

#### 7. Other Pre-Tax Deductions
- **Type:** Number
- **Unit:** AUD ($) per year
- **Default:** 0
- **Examples:** Salary sacrifice arrangements, work-related deductions

#### 8. Dependents
- **Type:** Number
- **Default:** 0
- **Note:** May affect Medicare levy exemption thresholds

#### 9. Additional Withholding / Tax Adjustment
- **Type:** Number
- **Unit:** AUD ($) per year
- **Default:** 0
- **Logic:** Added to total tax

#### 10. Working Hours (Hourly Only)
- **Type:** Number
- **Default:** 2080 (40 hours/week × 52 weeks)
- **Logic:** For hourly → annual conversion

#### 11. Working Days (Daily Only)
- **Type:** Number
- **Default:** 260 (5 days/week × 52 weeks)
- **Logic:** For daily → annual conversion

---

## 3️⃣ AUTO-CALCULATED (NOT USER INPUT)

Claude / Cursor must calculate these internally:

- ✅ Annual Gross Income (normalized from input)
- ✅ Tax-Free Threshold (for residents)
- ✅ Taxable Income (after super and deductions)
- ✅ Income Tax (progressive 0%/16%/30%/37%/45%)
- ✅ Medicare Levy (2% for most taxpayers)
- ✅ Medicare Levy Surcharge (0-1.5% for high earners without PHI)
- ✅ Low Income Tax Offset (LITO) - up to $700
- ✅ Total Tax
- ✅ Net Income (all frequencies)

❌ **Users should NEVER enter tax rates, brackets, or levy rates**

---

## 4️⃣ AUSTRALIA TAX ENGINE (2025-2026 FY)

### 4.1 Income Tax Brackets (Residents)

**Australian Residents - Tax Rates 2025-2026:**

| Bracket | Taxable Income (AUD) | Rate | Tax on Bracket |
|---------|---------------------|------|----------------|
| 1 | $0 - $18,200 | 0% | $0 |
| 2 | $18,201 - $45,000 | 16% | 16% of excess over $18,200 |
| 3 | $45,001 - $135,000 | 30% | $4,288 + 30% of excess over $45,000 |
| 4 | $135,001 - $190,000 | 37% | $31,288 + 37% of excess over $135,000 |
| 5 | $190,001+ | 45% | $51,638 + 45% of excess over $190,000 |

**Resident Income Tax Calculation:**

```typescript
function calculateResidentIncomeTax(taxableIncome: number): number {
  if (taxableIncome <= 18200) {
    return 0;
  } else if (taxableIncome <= 45000) {
    return (taxableIncome - 18200) * 0.16;
  } else if (taxableIncome <= 135000) {
    return 4288 + (taxableIncome - 45000) * 0.30;
  } else if (taxableIncome <= 190000) {
    return 31288 + (taxableIncome - 135000) * 0.37;
  } else {
    return 51638 + (taxableIncome - 190000) * 0.45;
  }
}
```

### 4.2 Income Tax Brackets (Foreign Residents)

**Foreign Residents (Non-Residents) - Tax Rates 2025-2026:**

| Bracket | Taxable Income (AUD) | Rate | Tax on Bracket |
|---------|---------------------|------|----------------|
| 1 | $0 - $135,000 | 30% | 30% of income |
| 2 | $135,001 - $190,000 | 37% | $40,500 + 37% of excess over $135,000 |
| 3 | $190,001+ | 45% | $60,850 + 45% of excess over $190,000 |

**Note:** Foreign residents do NOT get:
- Tax-free threshold ($0 - $18,200)
- Low Income Tax Offset
- Medicare Levy exemption

**Foreign Resident Income Tax Calculation:**

```typescript
function calculateForeignResidentIncomeTax(taxableIncome: number): number {
  if (taxableIncome <= 135000) {
    return taxableIncome * 0.30;
  } else if (taxableIncome <= 190000) {
    return 40500 + (taxableIncome - 135000) * 0.37;
  } else {
    return 60850 + (taxableIncome - 190000) * 0.45;
  }
}
```

### 4.3 Working Holiday Maker Tax Rates

**Working Holiday Maker (WHM) - Special Tax Rates:**

| Bracket | Taxable Income (AUD) | Rate |
|---------|---------------------|------|
| 1 | $0 - $45,000 | 15% |
| 2 | $45,001 - $135,000 | 30% |
| 3 | $135,001 - $190,000 | 37% |
| 4 | $190,001+ | 45% |

### 4.4 Low Income Tax Offset (LITO)

**LITO 2025-2026 (Australian Residents Only):**

- **Maximum Offset:** $700
- **Full Offset:** Income up to $37,500
- **Phase-Out:** Income $37,501 - $45,000
- **Phase-Out Rate:** $0.05 per $1 over $37,500

**LITO Calculation:**

```typescript
function calculateLITO(taxableIncome: number): number {
  if (taxableIncome <= 37500) {
    return 700;
  } else if (taxableIncome <= 45000) {
    const reduction = (taxableIncome - 37500) * 0.05;
    return Math.max(0, 700 - reduction);
  } else {
    return 0;
  }
}
```

**LITO Example:**
```
Income $30,000: LITO = $700 (full offset)
Income $40,000: LITO = $700 - ($40,000 - $37,500) × 0.05 = $575
Income $50,000: LITO = $0 (fully phased out)
```

### 4.5 Medicare Levy

**Medicare Levy Rate:** 2% of taxable income

**Medicare Levy Exemption Thresholds 2025-2026:**

| Category | Threshold (Below = Exempt) | Phase-In Range |
|----------|---------------------------|----------------|
| Single | $26,000 | $26,001 - $32,500 |
| Family | $43,846 | $43,847 - $54,808 |
| Single Senior | $41,089 | $41,090 - $51,362 |
| Family Senior | $57,198 | $57,199 - $71,498 |

**Medicare Levy Calculation:**

```typescript
function calculateMedicareLevy(
  taxableIncome: number,
  familyStatus: 'single' | 'family',
  hasDependents: boolean
): number {
  // Exemption thresholds
  const singleThreshold = 26000;
  const singlePhaseInEnd = 32500;

  // For family (add $4,027 per dependent)
  const familyThreshold = hasDependents ? 43846 : singleThreshold;
  const familyPhaseInEnd = hasDependents ? 54808 : singlePhaseInEnd;

  const threshold = familyStatus === 'family' ? familyThreshold : singleThreshold;
  const phaseInEnd = familyStatus === 'family' ? familyPhaseInEnd : singlePhaseInEnd;

  // Full exemption
  if (taxableIncome <= threshold) {
    return 0;
  }

  // Phase-in range (gradual increase)
  if (taxableIncome <= phaseInEnd) {
    const fullLevy = taxableIncome * 0.02;
    const exemptAmount = threshold;
    const phaseInRange = phaseInEnd - threshold;
    const incomeAboveThreshold = taxableIncome - threshold;

    // Gradual phase-in (10% of levy per 10% of phase-in range)
    const phaseInFactor = incomeAboveThreshold / phaseInRange;
    return fullLevy * phaseInFactor;
  }

  // Full Medicare levy (2%)
  return taxableIncome * 0.02;
}
```

**Medicare Levy Example (Single):**
```
Income $20,000: Levy = $0 (exempt)
Income $29,000: Levy = $29,000 × 2% × 46% = $266.80 (phase-in)
Income $50,000: Levy = $50,000 × 2% = $1,000 (full levy)
```

### 4.6 Medicare Levy Surcharge (MLS)

**MLS applies to high-income earners without adequate private health insurance.**

**MLS Rates 2025-2026:**

| Income Tier | Single Income | Family Income | MLS Rate |
|-------------|--------------|---------------|----------|
| Tier 0 | $0 - $97,000 | $0 - $194,000 | 0% |
| Tier 1 | $97,001 - $113,000 | $194,001 - $226,000 | 1.0% |
| Tier 2 | $113,001 - $151,000 | $226,001 - $302,000 | 1.25% |
| Tier 3 | $151,001+ | $302,001+ | 1.5% |

**MLS Calculation:**

```typescript
function calculateMedicareLevySurcharge(
  taxableIncome: number,
  familyStatus: 'single' | 'family',
  hasPrivateHealthInsurance: boolean
): number {
  // No surcharge if has private health insurance
  if (hasPrivateHealthInsurance) {
    return 0;
  }

  // Determine tier based on income
  const singleTiers = [
    { max: 97000, rate: 0 },
    { max: 113000, rate: 0.01 },
    { max: 151000, rate: 0.0125 },
    { max: Infinity, rate: 0.015 }
  ];

  const familyTiers = [
    { max: 194000, rate: 0 },
    { max: 226000, rate: 0.01 },
    { max: 302000, rate: 0.0125 },
    { max: Infinity, rate: 0.015 }
  ];

  const tiers = familyStatus === 'family' ? familyTiers : singleTiers;

  for (const tier of tiers) {
    if (taxableIncome <= tier.max) {
      return taxableIncome * tier.rate;
    }
  }

  return 0;
}
```

**MLS Example:**
```
Single, Income $80,000, No PHI: MLS = $0 (below threshold)
Single, Income $100,000, No PHI: MLS = $100,000 × 1% = $1,000
Single, Income $100,000, With PHI: MLS = $0 (exempt)
```

### 4.7 Superannuation (Super)

**Superannuation Guarantee (SG) Rate 2025-2026:** 11.5%

**Key Rules:**
- Employer must contribute 11.5% of ordinary time earnings
- Super is NOT deducted from employee pay (employer pays separately)
- Voluntary contributions (salary sacrifice) can reduce taxable income
- Concessional contributions cap: $30,000 per year

**Note for Calculator:**
- Display employer super contribution separately
- Only deduct voluntary/salary sacrifice super from taxable income

```typescript
function calculateSuperannuation(grossIncome: number): number {
  const sgRate = 0.115; // 11.5%
  return grossIncome * sgRate;
}
```

### 4.8 Total Tax & Net Pay Calculation

```typescript
// 1. Normalize input to annual gross
annualGross = normalizeToAnnual(inputAmount, frequency)

// 2. Calculate pre-tax deductions
totalPreTaxDeductions = voluntarySuper + otherPreTax

// 3. Calculate taxable income
taxableIncome = annualGross - totalPreTaxDeductions

// 4. Calculate income tax based on residency
let incomeTax = 0;
if (residencyStatus === 'resident') {
  incomeTax = calculateResidentIncomeTax(taxableIncome);

  // Apply LITO (residents only)
  const lito = calculateLITO(taxableIncome);
  incomeTax = Math.max(0, incomeTax - lito);
} else if (residencyStatus === 'foreign') {
  incomeTax = calculateForeignResidentIncomeTax(taxableIncome);
} else if (residencyStatus === 'whm') {
  incomeTax = calculateWHMIncomeTax(taxableIncome);
}

// 5. Calculate Medicare Levy (residents only)
let medicareLevy = 0;
if (residencyStatus === 'resident') {
  medicareLevy = calculateMedicareLevy(taxableIncome, familyStatus, hasDependents);
}

// 6. Calculate Medicare Levy Surcharge (if applicable)
let medicareLevySurcharge = 0;
if (residencyStatus === 'resident' && !hasPrivateHealthInsurance) {
  medicareLevySurcharge = calculateMedicareLevySurcharge(
    taxableIncome,
    familyStatus,
    hasPrivateHealthInsurance
  );
}

// 7. Calculate employer superannuation (display only, not deducted)
const employerSuper = calculateSuperannuation(annualGross);

// 8. Calculate total tax
totalTax = incomeTax + medicareLevy + medicareLevySurcharge + additionalWithholding

// 9. Calculate net income
netAnnual = annualGross - totalTax - totalPreTaxDeductions

// 10. Redistribute to output frequencies
netMonthly = netAnnual / 12
netFortnightly = netAnnual / 26
netWeekly = netAnnual / 52
netDaily = netAnnual / 260
netHourly = netAnnual / workingHours

// 11. Calculate effective tax rate
effectiveTaxRate = (totalTax / annualGross) × 100
```

---

## 5️⃣ REQUIRED OUTPUTS (ALL CALCULATORS)

### Core Outputs

| Output | Description |
|--------|-------------|
| Gross Annual Income | Normalized from input |
| Pre-Tax Deductions | Voluntary super + Other (if any) |
| Taxable Income | After pre-tax deductions |
| Income Tax | Progressive tax (minus LITO for residents) |
| Medicare Levy | 2% of taxable income (with exemptions) |
| Medicare Levy Surcharge | 0-1.5% (if no PHI and high income) |
| Total Tax | Income Tax + Medicare Levy + MLS |
| Employer Superannuation | 11.5% (display only, not deducted) |
| Net Annual Pay | Gross – Total Tax – Pre-Tax Deductions |

### Time-Based Outputs

| Output | Formula |
|--------|---------|
| Net Monthly Pay | Net Annual ÷ 12 |
| Net Fortnightly Pay | Net Annual ÷ 26 |
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
Normalization: annualGross = hourlyRate × 2080 (40 hrs/week × 52 weeks)
Logic: Apply tax engine on annual gross
Output: Net hourly, weekly, fortnightly, monthly, annual
```

### Weekly → Salary Calculator
```
Input: Weekly pay
Normalization: annualGross = weeklyPay × 52
Logic: Apply tax engine on annual gross
Output: Net weekly, fortnightly, monthly, annual, hourly
```

### Fortnightly → Salary Calculator
```
Input: Fortnightly pay
Normalization: annualGross = fortnightlyPay × 26
Logic: Apply tax engine on annual gross
Output: Net fortnightly, weekly, monthly, annual, hourly
```

### Monthly → Salary Calculator
```
Input: Monthly salary
Normalization: annualGross = monthlySalary × 12
Logic: Apply tax engine on annual gross
Output: Net monthly, fortnightly, weekly, annual, hourly
```

### Daily → Salary Calculator
```
Input: Daily rate
Normalization: annualGross = dailyRate × 260 (5 days/week × 52 weeks)
Logic: Apply tax engine on annual gross
Output: Net daily, weekly, fortnightly, monthly, annual
```

### Overtime Pay Calculator
```
Input: Base hourly rate, regular hours, overtime hours, multiplier
Calculation:
  regularAnnualPay = baseRate × regularHours × 52
  overtimeAnnualPay = baseRate × overtimeHours × multiplier × 52
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

### Example 1: Australian Resident ($80,000)

**Input:**
- Gross Salary: $80,000
- Residency: Australian Resident
- Employment Type: Employee
- Private Health Insurance: No
- Voluntary Super: $0

**Calculation:**
```
Annual Gross: $80,000
Taxable Income: $80,000

Income Tax (Before LITO):
  $0 - $18,200: $0
  $18,201 - $45,000: ($45,000 - $18,200) × 16% = $4,288
  $45,001 - $80,000: ($80,000 - $45,000) × 30% = $10,500
  Total: $14,788

LITO: $0 (income above $45,000)

Income Tax (After LITO): $14,788

Medicare Levy:
  $80,000 × 2% = $1,600

Medicare Levy Surcharge:
  Income $80,000 < $97,000 (no surcharge)
  MLS = $0

Total Tax: $14,788 + $1,600 = $16,388
Net Annual: $80,000 - $16,388 = $63,612
Net Fortnightly: $63,612 ÷ 26 = $2,446.62
Net Monthly: $63,612 ÷ 12 = $5,301

Employer Super (11.5%): $9,200 (not deducted from pay)

Effective Tax Rate: 20.5%
```

### Example 2: High Earner Without PHI ($120,000)

**Input:**
- Gross Salary: $120,000
- Residency: Australian Resident
- Private Health Insurance: No
- Family Status: Single

**Calculation:**
```
Annual Gross: $120,000
Taxable Income: $120,000

Income Tax (Before LITO):
  $0 - $18,200: $0
  $18,201 - $45,000: $4,288
  $45,001 - $120,000: ($120,000 - $45,000) × 30% = $22,500
  Total: $26,788

LITO: $0 (income above $45,000)

Income Tax: $26,788

Medicare Levy:
  $120,000 × 2% = $2,400

Medicare Levy Surcharge (Tier 2):
  Single income $120,000 ($113,001 - $151,000)
  MLS = $120,000 × 1.25% = $1,500

Total Tax: $26,788 + $2,400 + $1,500 = $30,688
Net Annual: $120,000 - $30,688 = $89,312
Net Fortnightly: $89,312 ÷ 26 = $3,435.08

Effective Tax Rate: 25.6%
```

### Example 3: Resident with Voluntary Super ($70,000)

**Input:**
- Gross Salary: $70,000
- Voluntary Super (Salary Sacrifice): $7,000 (10%)
- Residency: Australian Resident

**Calculation:**
```
Annual Gross: $70,000
Voluntary Super: $7,000
Taxable Income: $70,000 - $7,000 = $63,000

Income Tax (Before LITO):
  $0 - $18,200: $0
  $18,201 - $45,000: $4,288
  $45,001 - $63,000: ($63,000 - $45,000) × 30% = $5,400
  Total: $9,688

LITO: $0 (income above $45,000)

Income Tax: $9,688

Medicare Levy:
  $63,000 × 2% = $1,260

Total Tax: $9,688 + $1,260 = $10,948
Net Annual: $70,000 - $10,948 - $7,000 = $52,052
Net Fortnightly: $52,052 ÷ 26 = $2,002.00

Employer Super (on $70k): $8,050

Effective Tax Rate: 25.6% (including voluntary super as deduction)
```

### Example 4: Low Income with LITO ($35,000)

**Input:**
- Gross Salary: $35,000
- Residency: Australian Resident

**Calculation:**
```
Annual Gross: $35,000
Taxable Income: $35,000

Income Tax (Before LITO):
  $0 - $18,200: $0
  $18,201 - $35,000: ($35,000 - $18,200) × 16% = $2,688

LITO (Full):
  Income $35,000 < $37,500
  LITO = $700

Income Tax (After LITO):
  $2,688 - $700 = $1,988

Medicare Levy:
  Income $35,000 > $32,500 (full levy)
  $35,000 × 2% = $700

Total Tax: $1,988 + $700 = $2,688
Net Annual: $35,000 - $2,688 = $32,312
Net Fortnightly: $32,312 ÷ 26 = $1,242.77

Effective Tax Rate: 7.7%
```

### Example 5: Foreign Resident ($90,000)

**Input:**
- Gross Income: $90,000
- Residency: Foreign Resident

**Calculation:**
```
Annual Gross: $90,000
Taxable Income: $90,000 (no deductions for foreign residents)

Income Tax:
  $90,000 × 30% = $27,000
  (No tax-free threshold for foreign residents)

LITO: $0 (not eligible)

Medicare Levy: $0 (foreign residents exempt)

Total Tax: $27,000
Net Annual: $90,000 - $27,000 = $63,000
Net Fortnightly: $63,000 ÷ 26 = $2,423.08

Effective Tax Rate: 30.0%
```

### Example 6: Hourly Worker ($30/hour)

**Input:**
- Hourly Rate: $30
- Working Hours: 2080
- Residency: Australian Resident

**Calculation:**
```
Annual Gross = $30 × 2080 = $62,400

(Apply standard tax engine)

Income Tax (Before LITO): $9,008
LITO: $0
Income Tax: $9,008
Medicare Levy: $1,248
Total Tax: $10,256
Net Annual: $52,144

Net Hourly: $52,144 ÷ 2080 = $25.07
Net Weekly: $52,144 ÷ 52 = $1,002.77
Net Fortnightly: $52,144 ÷ 26 = $2,005.54
Net Monthly: $52,144 ÷ 12 = $4,345.33

Effective Tax Rate: 16.4%
```

### Example 7: Bonus Calculation ($75,000 + $15,000)

**Input:**
- Base Salary: $75,000
- Bonus: $15,000
- Residency: Australian Resident

**Calculation:**
```
Without Bonus:
  Gross: $75,000
  Income Tax: $12,788
  Medicare Levy: $1,500
  Total Tax: $14,288
  Net: $60,712

With Bonus:
  Gross: $90,000
  Income Tax: $17,288
  Medicare Levy: $1,800
  Total Tax: $19,088
  Net: $70,912

Bonus Impact:
  Gross Bonus: $15,000
  Additional Tax: $4,800
  Net Bonus: $10,200
  Bonus Tax Rate: 32%
```

---

## 8️⃣ VALIDATION CHECKLIST

### Core Tax Engine
- [ ] Income tax calculated on taxable income (after voluntary super)
- [ ] Correct tax brackets applied based on residency status
- [ ] LITO applied correctly for Australian residents (up to $700)
- [ ] Medicare Levy calculated on taxable income (2%)
- [ ] Medicare Levy exemption thresholds applied correctly
- [ ] Medicare Levy Surcharge applied for high earners without PHI
- [ ] Voluntary super reduces taxable income
- [ ] Residency status determines tax treatment

### Time-Based Calculators
- [ ] Hourly: Normalizes to annual (× 2080)
- [ ] Fortnightly: Normalizes to annual (× 26)
- [ ] Weekly: Normalizes to annual (× 52)
- [ ] Monthly: Normalizes to annual (× 12)
- [ ] Daily: Normalizes to annual (× 260)
- [ ] All use shared Australia tax engine
- [ ] Results match salary calculator for same annual amount

### Variable Pay Calculators
- [ ] Overtime: Combined with regular pay, not taxed separately
- [ ] Bonus: Marginal tax approach, NOT flat rate
- [ ] Commission: Normalized by frequency, taxed as ordinary income
- [ ] All components included (Income Tax + Medicare Levy + MLS)

---

## 9️⃣ COMMON PITFALLS TO AVOID

### ❌ Wrong: Not Applying Tax-Free Threshold for Residents
```typescript
// WRONG - Residents have tax-free threshold
const tax = income * 0.16;
```

### ✅ Correct: Apply Tax-Free Threshold
```typescript
// CORRECT - $0 - $18,200 is tax-free for residents
if (income <= 18200) {
  tax = 0;
} else if (income <= 45000) {
  tax = (income - 18200) * 0.16;
}
```

### ❌ Wrong: Foreign Residents Get Tax-Free Threshold
```typescript
// WRONG - Foreign residents don't get tax-free threshold
if (residency === 'foreign' && income <= 18200) {
  return 0;
}
```

### ✅ Correct: Foreign Residents Pay From First Dollar
```typescript
// CORRECT - Foreign residents taxed from $1
if (residency === 'foreign') {
  return income * 0.30; // 30% on all income
}
```

### ❌ Wrong: Forgetting LITO
```typescript
// WRONG - Missing Low Income Tax Offset
const tax = calculateProgressiveTax(income);
```

### ✅ Correct: Apply LITO for Eligible Residents
```typescript
// CORRECT - Apply LITO reduction
let tax = calculateProgressiveTax(income);
const lito = calculateLITO(income);
tax = Math.max(0, tax - lito);
```

### ❌ Wrong: Medicare Levy on All Income
```typescript
// WRONG - Not checking exemption threshold
const levy = income * 0.02;
```

### ✅ Correct: Medicare Levy with Exemption
```typescript
// CORRECT - Apply exemption and phase-in
if (income <= 26000) {
  levy = 0;
} else if (income <= 32500) {
  levy = (income * 0.02) * phaseInFactor;
} else {
  levy = income * 0.02;
}
```

### ❌ Wrong: Flat Bonus Tax
```typescript
// WRONG - Never use flat bonus tax
const bonusTax = bonus * 0.30;
```

### ✅ Correct: Marginal Bonus Tax
```typescript
// CORRECT - Calculate actual marginal impact
const withoutBonus = calculateAU(baseSalary);
const withBonus = calculateAU(baseSalary + bonus);
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
   - Always use 2025-2026 Australian ATO rules
   - Update centrally when FY changes

3. ❌ **Never ask for tax rates**
   - Resident tax rates: 0%, 16%, 30%, 37%, 45%
   - Foreign resident rates: 30%, 37%, 45%
   - Medicare Levy: 2%
   - Medicare Levy Surcharge: 0-1.5%
   - All automatic based on residency

4. ❌ **Never ask for tax offsets**
   - LITO calculated automatically for residents
   - Up to $700 for income under $37,500
   - Phases out by $45,000

5. ✅ **Three primary tax components**
   - Income Tax (on taxable income, minus LITO for residents)
   - Medicare Levy (2% with exemptions)
   - Medicare Levy Surcharge (0-1.5% if no PHI)

6. ✅ **Voluntary super reduces taxable income only**
   - Pre-tax for Income Tax calculation
   - NOT included in Medicare Levy base

7. ✅ **Show all breakdowns**
   - Gross annual
   - Each tax component
   - Employer super (display only)
   - Total tax
   - Net annual, monthly, fortnightly, weekly, daily, hourly
   - Effective tax rate

8. ✅ **Residency status matters**
   - Resident: Tax-free threshold, LITO, Medicare Levy
   - Foreign Resident: No threshold, no LITO, no Medicare Levy
   - WHM: Special 15% starting rate

9. ✅ **Private Health Insurance matters**
   - High earners without PHI pay Medicare Levy Surcharge
   - Tiers: 1%, 1.25%, 1.5%

10. ✅ **Comparison for variable pay**
    - Bonus: Show with/without comparison
    - Commission: Show net commission take-home
    - Overtime: Show regular vs overtime breakdown

---

## 🎯 PRODUCTION READINESS

**Status:** Ready for implementation

**Implementation Priority:**
1. Core tax engine (Income Tax + Medicare Levy + LITO)
2. Salary calculator (baseline)
3. Time-based calculators (hourly/weekly/fortnightly/monthly/daily)
4. Variable pay calculators (bonus/overtime/commission)

**Testing Requirements:**
- Verify all example calculations
- Test tax-free threshold for residents
- Test LITO phase-out logic
- Test Medicare Levy exemption thresholds
- Test Medicare Levy Surcharge tiers
- Test foreign resident vs resident differences
- Test voluntary super deduction logic

---

**This specification is now LOCKED. All Australia calculators follow this pattern.**

**Last Updated:** January 14, 2026
**Next Review:** FY 2026-2027 budget updates (July 2026)
