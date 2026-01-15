# 🇨🇦 CANADA – CALCULATOR SYSTEM (MASTER SPEC 2026)

**Status:** ✅ Production Standard
**Date:** January 14, 2026
**Tax Year:** 2026
**Currency:** CAD ($)

**This is the definitive specification for ALL Canada salary calculators.**

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

**All calculators share the same Canada tax engine: Federal Tax + Provincial Tax + CPP + EI**

---

## 1️⃣ CORE DESIGN PRINCIPLES (VERY IMPORTANT)

### 🔒 NO TAX YEAR INPUT

- ❌ Do NOT ask user for tax year
- ✅ Always use latest 2026 Canadian rules
- ✅ Update rules centrally (config-based)

### 🔒 USER NEVER ENTERS TAX RATES

Users must never input:
- ❌ Federal tax rates / brackets
- ❌ Provincial tax rates / brackets
- ❌ CPP rates or maximums
- ❌ EI rates or maximums
- ❌ Basic personal amounts

✅ These are ALL auto-calculated internally

### ✅ CORE PRINCIPLE

**Normalize → Annual → Apply Tax Engine → Redistribute**

All calculators:
1. Normalize input to annual gross income
2. Apply Canada tax engine (Federal + Provincial + CPP + EI)
3. Redistribute net results to desired output frequency

---

## 2️⃣ MASTER INPUT SPECIFICATION

### 2.1 Core Inputs (Always Visible)

#### 1. Gross Pay Amount
- **Type:** Number
- **Label:** Gross Income
- **Unit:** CAD ($)
- **Required:** Yes
- **Description:** Total gross income before taxes and deductions

#### 2. Pay Frequency
- **Type:** Select
- **Options:**
  - Annual
  - Monthly
  - Bi-Weekly
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
| Bi-Weekly | `amount × 26` |
| Weekly | `amount × 52` |
| Daily | `amount × workingDays` (default 260) |
| Hourly | `amount × workingHours` (default 2080) |

**Note:** Canada standard work week is 40 hours, so default hourly = 40 × 52 = 2080 hours/year

#### 3. Province / Territory
- **Type:** Select
- **Required:** Yes
- **Options:**
  - Alberta (AB)
  - British Columbia (BC)
  - Manitoba (MB)
  - New Brunswick (NB)
  - Newfoundland and Labrador (NL)
  - Northwest Territories (NT)
  - Nova Scotia (NS)
  - Nunavut (NU)
  - Ontario (ON)
  - Prince Edward Island (PE)
  - Quebec (QC)
  - Saskatchewan (SK)
  - Yukon (YT)
- **Default:** Ontario
- **Logic:** Determines provincial tax rates and basic personal amount

#### 4. Employment Type
- **Type:** Select
- **Options:**
  - Employee
  - Self-Employed
- **Default:** Employee
- **Logic:**
  - Employee: CPP 5.95%, EI 1.63%
  - Self-Employed: CPP 11.9%, EI exempt

### 2.2 Optional Advanced Inputs (Collapsed)

#### 5. RRSP Contributions (Pre-Tax)
- **Type:** Number
- **Unit:** CAD ($) per year
- **Default:** 0
- **Logic:** Reduces taxable income (within 18% of earned income or $31,560 limit)
- **Note:** Registered Retirement Savings Plan

#### 6. Other Pre-Tax Deductions
- **Type:** Number
- **Unit:** CAD ($) per year
- **Default:** 0
- **Examples:** Union dues, professional fees, childcare expenses

#### 7. Dependents
- **Type:** Number
- **Default:** 0
- **Note:** May affect federal and provincial tax credits

#### 8. Additional Withholding (Hidden / Power Users)
- **Type:** Number
- **Unit:** CAD ($) per year
- **Default:** 0
- **Logic:** Added to total tax

#### 9. Working Hours (Hourly Only)
- **Type:** Number
- **Default:** 2080 (40 hours/week × 52 weeks)
- **Logic:** For hourly → annual conversion

#### 10. Working Days (Daily Only)
- **Type:** Number
- **Default:** 260 (5 days/week × 52 weeks)
- **Logic:** For daily → annual conversion

---

## 3️⃣ AUTO-CALCULATED (NOT USER INPUT)

Claude / Cursor must calculate these internally:

- ✅ Annual Gross Income (normalized from input)
- ✅ Basic Personal Amount (from province)
- ✅ Taxable Income (after RRSP and deductions)
- ✅ Federal Income Tax (progressive 15%/20.5%/26%/29%/33%)
- ✅ Provincial Income Tax (progressive, varies by province)
- ✅ Canada Pension Plan (CPP) contributions
- ✅ Employment Insurance (EI) contributions
- ✅ Total Tax
- ✅ Net Income (all frequencies)

❌ **Users should NEVER enter tax rates, brackets, or contribution rates**

---

## 4️⃣ CANADA TAX ENGINE (2026)

### 4.1 Federal Income Tax Brackets (2026)

**Federal Tax Rates:**

| Bracket | Taxable Income (CAD) | Rate |
|---------|---------------------|------|
| 1 | $0 - $55,867 | 15% |
| 2 | $55,868 - $111,733 | 20.5% |
| 3 | $111,734 - $173,205 | 26% |
| 4 | $173,206 - $246,752 | 29% |
| 5 | $246,753+ | 33% |

**Federal Basic Personal Amount (2026):** $15,705

**Federal Tax Calculation:**

```typescript
// 1. Calculate taxable income
taxableIncome = annualGross - rrsp - otherPreTax - federalBasicPersonalAmount

// 2. Calculate federal tax (progressive)
if (taxableIncome <= 0) {
  federalTax = 0
} else if (taxableIncome <= 55867) {
  federalTax = taxableIncome × 0.15
} else if (taxableIncome <= 111733) {
  federalTax = (55867 × 0.15) + ((taxableIncome - 55867) × 0.205)
} else if (taxableIncome <= 173205) {
  federalTax = (55867 × 0.15) + (55866 × 0.205) + ((taxableIncome - 111733) × 0.26)
} else if (taxableIncome <= 246752) {
  federalTax = (55867 × 0.15) + (55866 × 0.205) + (61472 × 0.26) + ((taxableIncome - 173205) × 0.29)
} else {
  federalTax = (55867 × 0.15) + (55866 × 0.205) + (61472 × 0.26) + (73547 × 0.29) + ((taxableIncome - 246752) × 0.33)
}
```

### 4.2 Provincial Income Tax Brackets (2026)

#### Ontario (ON)
**Basic Personal Amount:** $11,865

| Bracket | Taxable Income | Rate |
|---------|---------------|------|
| 1 | $0 - $51,446 | 5.05% |
| 2 | $51,447 - $102,894 | 9.15% |
| 3 | $102,895 - $150,000 | 11.16% |
| 4 | $150,001 - $220,000 | 12.16% |
| 5 | $220,001+ | 13.16% |

#### British Columbia (BC)
**Basic Personal Amount:** $12,580

| Bracket | Taxable Income | Rate |
|---------|---------------|------|
| 1 | $0 - $47,937 | 5.06% |
| 2 | $47,938 - $95,875 | 7.7% |
| 3 | $95,876 - $110,076 | 10.5% |
| 4 | $110,077 - $133,664 | 12.29% |
| 5 | $133,665 - $181,232 | 14.7% |
| 6 | $181,233 - $252,752 | 16.8% |
| 7 | $252,753+ | 20.5% |

#### Alberta (AB)
**Basic Personal Amount:** $21,885

| Bracket | Taxable Income | Rate |
|---------|---------------|------|
| 1 | $0 - $148,269 | 10% |
| 2 | $148,270 - $177,922 | 12% |
| 3 | $177,923 - $237,230 | 13% |
| 4 | $237,231 - $355,845 | 14% |
| 5 | $355,846+ | 15% |

#### Quebec (QC)
**Basic Personal Amount:** $18,056

| Bracket | Taxable Income | Rate |
|---------|---------------|------|
| 1 | $0 - $51,780 | 14% |
| 2 | $51,781 - $103,545 | 19% |
| 3 | $103,546 - $126,000 | 24% |
| 4 | $126,001+ | 25.75% |

**Note:** Quebec has separate QPP (Quebec Pension Plan) instead of CPP

#### Saskatchewan (SK)
**Basic Personal Amount:** $18,491

| Bracket | Taxable Income | Rate |
|---------|---------------|------|
| 1 | $0 - $52,057 | 10.5% |
| 2 | $52,058 - $148,734 | 12.5% |
| 3 | $148,735+ | 14.5% |

#### Manitoba (MB)
**Basic Personal Amount:** $15,000

| Bracket | Taxable Income | Rate |
|---------|---------------|------|
| 1 | $0 - $47,000 | 10.8% |
| 2 | $47,001 - $100,000 | 12.75% |
| 3 | $100,001+ | 17.4% |

#### Nova Scotia (NS)
**Basic Personal Amount:** $11,481

| Bracket | Taxable Income | Rate |
|---------|---------------|------|
| 1 | $0 - $29,590 | 8.79% |
| 2 | $29,591 - $59,180 | 14.95% |
| 3 | $59,181 - $93,000 | 16.67% |
| 4 | $93,001 - $150,000 | 17.5% |
| 5 | $150,001+ | 21% |

#### New Brunswick (NB)
**Basic Personal Amount:** $13,044

| Bracket | Taxable Income | Rate |
|---------|---------------|------|
| 1 | $0 - $49,958 | 9.4% |
| 2 | $49,959 - $99,916 | 14% |
| 3 | $99,917 - $185,064 | 16% |
| 4 | $185,065+ | 19.5% |

#### Newfoundland and Labrador (NL)
**Basic Personal Amount:** $10,382

| Bracket | Taxable Income | Rate |
|---------|---------------|------|
| 1 | $0 - $43,198 | 8.7% |
| 2 | $43,199 - $86,395 | 14.5% |
| 3 | $86,396 - $154,244 | 15.8% |
| 4 | $154,245 - $215,943 | 17.3% |
| 5 | $215,944 - $275,870 | 18.3% |
| 6 | $275,871 - $551,739 | 19.3% |
| 7 | $551,740 - $1,103,478 | 20.3% |
| 8 | $1,103,479+ | 21.3% |

#### Prince Edward Island (PE)
**Basic Personal Amount:** $13,500

| Bracket | Taxable Income | Rate |
|---------|---------------|------|
| 1 | $0 - $32,656 | 9.8% |
| 2 | $32,657 - $64,313 | 13.8% |
| 3 | $64,314+ | 16.7% |

#### Northwest Territories (NT)
**Basic Personal Amount:** $16,593

| Bracket | Taxable Income | Rate |
|---------|---------------|------|
| 1 | $0 - $50,597 | 5.9% |
| 2 | $50,598 - $101,198 | 8.6% |
| 3 | $101,199 - $164,525 | 12.2% |
| 4 | $164,526+ | 14.05% |

#### Nunavut (NU)
**Basic Personal Amount:** $18,767

| Bracket | Taxable Income | Rate |
|---------|---------------|------|
| 1 | $0 - $53,268 | 4% |
| 2 | $53,269 - $106,537 | 7% |
| 3 | $106,538 - $173,205 | 9% |
| 4 | $173,206+ | 11.5% |

#### Yukon (YT)
**Basic Personal Amount:** $15,705

| Bracket | Taxable Income | Rate |
|---------|---------------|------|
| 1 | $0 - $55,867 | 6.4% |
| 2 | $55,868 - $111,733 | 9% |
| 3 | $111,734 - $173,205 | 10.9% |
| 4 | $173,206 - $500,000 | 12.8% |
| 5 | $500,001+ | 15% |

### 4.3 Canada Pension Plan (CPP) Contributions (2026)

**Employee Contribution:**
- **Rate:** 5.95%
- **Basic Exemption:** $3,500
- **Maximum Pensionable Earnings:** $68,500
- **Maximum Annual Contribution:** $3,867.50

**Self-Employed Contribution:**
- **Rate:** 11.9% (both employee and employer portions)
- **Maximum Annual Contribution:** $7,735.00

**CPP Calculation:**

```typescript
function calculateCPP(grossAnnual: number, employmentType: 'employee' | 'self-employed'): number {
  const basicExemption = 3500;
  const maxPensionableEarnings = 68500;
  const employeeRate = 0.0595;
  const selfEmployedRate = 0.119;

  // CPP-eligible earnings
  const pensionableEarnings = Math.min(grossAnnual, maxPensionableEarnings) - basicExemption;

  if (pensionableEarnings <= 0) {
    return 0;
  }

  const rate = employmentType === 'self-employed' ? selfEmployedRate : employeeRate;
  const cpp = pensionableEarnings * rate;

  // Apply maximum cap
  const maxContribution = employmentType === 'self-employed' ? 7735 : 3867.50;
  return Math.min(cpp, maxContribution);
}
```

**CPP Example (Employee, $60,000):**
```
Pensionable Earnings = $60,000 - $3,500 = $56,500
CPP = $56,500 × 5.95% = $3,361.75
```

### 4.4 Employment Insurance (EI) Contributions (2026)

**Employee Contribution:**
- **Rate:** 1.63%
- **Maximum Insurable Earnings:** $63,200
- **Maximum Annual Contribution:** $1,030.16

**Self-Employed:**
- EI is **voluntary** for self-employed individuals
- Default: $0 (not included)

**EI Calculation:**

```typescript
function calculateEI(grossAnnual: number, employmentType: 'employee' | 'self-employed'): number {
  if (employmentType === 'self-employed') {
    return 0; // Self-employed don't pay EI by default
  }

  const maxInsurableEarnings = 63200;
  const employeeRate = 0.0163;

  const insurableEarnings = Math.min(grossAnnual, maxInsurableEarnings);
  const ei = insurableEarnings * employeeRate;

  // Apply maximum cap
  const maxContribution = 1030.16;
  return Math.min(ei, maxContribution);
}
```

**EI Example (Employee, $60,000):**
```
Insurable Earnings = $60,000 (below max)
EI = $60,000 × 1.63% = $978
```

### 4.5 Total Tax & Net Pay Calculation

```typescript
// 1. Normalize input to annual gross
annualGross = normalizeToAnnual(inputAmount, frequency)

// 2. Calculate pre-tax deductions
totalPreTaxDeductions = rrsp + otherPreTax

// 3. Calculate federal taxable income
federalTaxableIncome = annualGross - totalPreTaxDeductions - federalBasicPersonalAmount

// 4. Calculate provincial taxable income
provincialTaxableIncome = annualGross - totalPreTaxDeductions - provincialBasicPersonalAmount

// 5. Calculate federal income tax
federalTax = calculateFederalTax(federalTaxableIncome)

// 6. Calculate provincial income tax
provincialTax = calculateProvincialTax(provincialTaxableIncome, province)

// 7. Calculate CPP (on gross income)
cpp = calculateCPP(annualGross, employmentType)

// 8. Calculate EI (on gross income)
ei = calculateEI(annualGross, employmentType)

// 9. Calculate total tax
totalTax = federalTax + provincialTax + cpp + ei + additionalWithholding

// 10. Calculate net income
netAnnual = annualGross - totalTax

// 11. Redistribute to output frequencies
netMonthly = netAnnual / 12
netBiWeekly = netAnnual / 26
netWeekly = netAnnual / 52
netDaily = netAnnual / 260
netHourly = netAnnual / workingHours

// 12. Calculate effective tax rate
effectiveTaxRate = (totalTax / annualGross) × 100
```

---

## 5️⃣ REQUIRED OUTPUTS (ALL CALCULATORS)

### Core Outputs

| Output | Description |
|--------|-------------|
| Gross Annual Income | Normalized from input |
| Pre-Tax Deductions | RRSP + Other (if any) |
| Federal Taxable Income | After deductions & basic personal amount |
| Provincial Taxable Income | After deductions & provincial BPA |
| Federal Income Tax | Progressive federal tax |
| Provincial Income Tax | Progressive provincial tax |
| CPP Contribution | Canada Pension Plan |
| EI Contribution | Employment Insurance |
| Total Tax | Federal + Provincial + CPP + EI |
| Net Annual Pay | Gross – Total Tax |

### Time-Based Outputs

| Output | Formula |
|--------|---------|
| Net Monthly Pay | Net Annual ÷ 12 |
| Net Bi-Weekly Pay | Net Annual ÷ 26 |
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
Output: Net hourly, weekly, bi-weekly, monthly, annual
```

### Weekly → Salary Calculator
```
Input: Weekly pay
Normalization: annualGross = weeklyPay × 52
Logic: Apply tax engine on annual gross
Output: Net weekly, bi-weekly, monthly, annual, hourly
```

### Bi-Weekly → Salary Calculator
```
Input: Bi-weekly pay
Normalization: annualGross = biWeeklyPay × 26
Logic: Apply tax engine on annual gross
Output: Net bi-weekly, weekly, monthly, annual, hourly
```

### Monthly → Salary Calculator
```
Input: Monthly salary
Normalization: annualGross = monthlySalary × 12
Logic: Apply tax engine on annual gross
Output: Net monthly, bi-weekly, weekly, annual, hourly
```

### Daily → Salary Calculator
```
Input: Daily rate
Normalization: annualGross = dailyRate × 260 (5 days/week × 52 weeks)
Logic: Apply tax engine on annual gross
Output: Net daily, weekly, bi-weekly, monthly, annual
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

### Example 1: Ontario Employee ($70,000)

**Input:**
- Gross Salary: $70,000
- Province: Ontario
- Employment Type: Employee
- RRSP: $0

**Calculation:**
```
Annual Gross: $70,000

Federal Taxable Income:
  $70,000 - $15,705 (BPA) = $54,295

Federal Income Tax:
  $54,295 × 15% = $8,144.25

Provincial Taxable Income (ON):
  $70,000 - $11,865 (BPA) = $58,135

Provincial Income Tax:
  $51,446 × 5.05% = $2,598.02
  ($58,135 - $51,446) × 9.15% = $612.04
  Total: $3,210.06

CPP (Employee):
  ($70,000 - $3,500) × 5.95% = $3,956.75
  Capped at: $3,867.50

EI (Employee):
  $70,000 × 1.63% = $1,141
  Capped at: $1,030.16

Total Tax: $8,144.25 + $3,210.06 + $3,867.50 + $1,030.16 = $16,251.97
Net Annual: $70,000 - $16,251.97 = $53,748.03
Net Monthly: $53,748.03 ÷ 12 = $4,479.00
Net Bi-Weekly: $53,748.03 ÷ 26 = $2,067.23

Effective Tax Rate: 23.2%
```

### Example 2: Alberta Employee with RRSP ($90,000)

**Input:**
- Gross Salary: $90,000
- Province: Alberta
- Employment Type: Employee
- RRSP: $9,000 (10%)

**Calculation:**
```
Annual Gross: $90,000
RRSP: $9,000

Federal Taxable Income:
  $90,000 - $9,000 - $15,705 = $65,295

Federal Income Tax:
  $55,867 × 15% = $8,380.05
  ($65,295 - $55,867) × 20.5% = $1,932.74
  Total: $10,312.79

Provincial Taxable Income (AB):
  $90,000 - $9,000 - $21,885 = $59,115

Provincial Income Tax:
  $59,115 × 10% = $5,911.50

CPP: $3,867.50 (maxed out)
EI: $1,030.16 (maxed out)

Total Tax: $10,312.79 + $5,911.50 + $3,867.50 + $1,030.16 = $21,121.95
Net Annual: $90,000 - $21,121.95 = $68,878.05
Net Monthly: $68,878.05 ÷ 12 = $5,739.84

Effective Tax Rate: 23.5%
```

### Example 3: BC Self-Employed ($50,000)

**Input:**
- Gross Income: $50,000
- Province: British Columbia
- Employment Type: Self-Employed
- RRSP: $0

**Calculation:**
```
Annual Gross: $50,000

Federal Taxable Income:
  $50,000 - $15,705 = $34,295

Federal Income Tax:
  $34,295 × 15% = $5,144.25

Provincial Taxable Income (BC):
  $50,000 - $12,580 = $37,420

Provincial Income Tax:
  $37,420 × 5.06% = $1,893.45

CPP (Self-Employed):
  ($50,000 - $3,500) × 11.9% = $5,533.50

EI (Self-Employed): $0 (exempt)

Total Tax: $5,144.25 + $1,893.45 + $5,533.50 = $12,571.20
Net Annual: $50,000 - $12,571.20 = $37,428.80

Effective Tax Rate: 25.1%
```

### Example 4: Hourly Worker Ontario ($25/hour)

**Input:**
- Hourly Rate: $25
- Working Hours: 2080
- Province: Ontario
- Employment Type: Employee

**Calculation:**
```
Annual Gross = $25 × 2080 = $52,000

(Apply standard tax engine)

Federal Tax: $5,444.25
Provincial Tax: $2,032.44
CPP: $2,885.50
EI: $847.60
Total Tax: $11,209.79
Net Annual: $40,790.21

Net Hourly: $40,790.21 ÷ 2080 = $19.61
Net Weekly: $40,790.21 ÷ 52 = $784.43
Net Bi-Weekly: $40,790.21 ÷ 26 = $1,568.85
Net Monthly: $40,790.21 ÷ 12 = $3,399.18

Effective Tax Rate: 21.6%
```

### Example 5: Bonus Calculation Ontario ($60,000 + $10,000)

**Input:**
- Base Salary: $60,000
- Bonus: $10,000
- Province: Ontario

**Calculation:**
```
Without Bonus:
  Gross: $60,000
  Federal Tax: $6,644.25
  Provincial Tax: $2,430.47
  CPP: $3,357.50
  EI: $978
  Total Tax: $13,410.22
  Net: $46,589.78

With Bonus:
  Gross: $70,000
  Federal Tax: $8,144.25
  Provincial Tax: $3,210.06
  CPP: $3,867.50
  EI: $1,030.16
  Total Tax: $16,251.97
  Net: $53,748.03

Bonus Impact:
  Gross Bonus: $10,000
  Additional Tax: $2,841.75
  Net Bonus: $7,158.25
  Bonus Tax Rate: 28.4%
```

---

## 8️⃣ VALIDATION CHECKLIST

### Core Tax Engine
- [ ] Federal tax calculated on taxable income (after RRSP and BPA)
- [ ] Provincial tax calculated on taxable income (after RRSP and provincial BPA)
- [ ] CPP calculated on gross income (minus $3,500 exemption)
- [ ] EI calculated on gross income (capped at $63,200)
- [ ] RRSP reduces both federal and provincial taxable income
- [ ] Province selection affects provincial tax rates and BPA
- [ ] Employment type affects CPP rate (5.95% vs 11.9%)
- [ ] Self-employed exempt from EI

### Time-Based Calculators
- [ ] Hourly: Normalizes to annual (× 2080)
- [ ] Bi-Weekly: Normalizes to annual (× 26)
- [ ] Weekly: Normalizes to annual (× 52)
- [ ] Monthly: Normalizes to annual (× 12)
- [ ] Daily: Normalizes to annual (× 260)
- [ ] All use shared Canada tax engine
- [ ] Results match salary calculator for same annual amount

### Variable Pay Calculators
- [ ] Overtime: Combined with regular pay, not taxed separately
- [ ] Bonus: Marginal tax approach, NOT flat rate
- [ ] Commission: Normalized by frequency, taxed as ordinary income
- [ ] All components included (Federal + Provincial + CPP + EI)

---

## 9️⃣ COMMON PITFALLS TO AVOID

### ❌ Wrong: CPP on All Income
```typescript
// WRONG - CPP has a basic exemption
const cpp = grossIncome * 0.0595;
```

### ✅ Correct: CPP with Basic Exemption
```typescript
// CORRECT - Subtract basic exemption first
const pensionableEarnings = Math.min(grossIncome, 68500) - 3500;
const cpp = pensionableEarnings * 0.0595;
```

### ❌ Wrong: Federal and Provincial Use Same BPA
```typescript
// WRONG - Each has different basic personal amount
const taxableIncome = gross - 15705;
```

### ✅ Correct: Separate BPA for Federal and Provincial
```typescript
// CORRECT - Different BPA values
const federalTaxableIncome = gross - federalBPA; // $15,705
const provincialTaxableIncome = gross - provincialBPA; // Varies by province
```

### ❌ Wrong: Flat Bonus Tax
```typescript
// WRONG - Never use flat bonus tax
const bonusTax = bonus * 0.30;
```

### ✅ Correct: Marginal Bonus Tax
```typescript
// CORRECT - Calculate actual marginal impact
const withoutBonus = calculateCA(baseSalary);
const withBonus = calculateCA(baseSalary + bonus);
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
   - Always use 2026 Canadian rules
   - Update centrally when rules change

3. ❌ **Never ask for tax rates**
   - Federal tax rates are 15%, 20.5%, 26%, 29%, 33%
   - Provincial tax rates vary by province (auto-lookup)
   - CPP rates are 5.95% (employee) or 11.9% (self-employed)
   - EI rate is 1.63%
   - All automatic

4. ❌ **Never ask for basic personal amounts**
   - Determine from province selection
   - Federal BPA: $15,705
   - Provincial BPA varies by province

5. ✅ **Four tax components**
   - Federal Income Tax (on federal taxable income)
   - Provincial Income Tax (on provincial taxable income)
   - CPP (on gross income, minus exemption)
   - EI (on gross income, employees only)

6. ✅ **RRSP reduces taxable income only**
   - Pre-tax for both Federal and Provincial income tax
   - NOT pre-tax for CPP/EI

7. ✅ **Show all breakdowns**
   - Gross annual
   - Each tax component
   - Total tax
   - Net annual, monthly, bi-weekly, weekly, daily, hourly
   - Effective tax rate

8. ✅ **Province matters**
   - Different provincial tax rates
   - Different basic personal amounts
   - Always require province selection

9. ✅ **Employment type matters**
   - Employee: CPP 5.95%, EI 1.63%
   - Self-Employed: CPP 11.9%, EI $0

10. ✅ **Comparison for variable pay**
    - Bonus: Show with/without comparison
    - Commission: Show net commission take-home
    - Overtime: Show regular vs overtime breakdown

---

## 🎯 PRODUCTION READINESS

**Status:** Ready for implementation

**Implementation Priority:**
1. Core tax engine (Federal + Provincial + CPP + EI)
2. Salary calculator (baseline)
3. Time-based calculators (hourly/weekly/bi-weekly/monthly/daily)
4. Variable pay calculators (bonus/overtime/commission)

**Testing Requirements:**
- Verify all example calculations
- Test CPP basic exemption and maximum cap
- Test EI maximum cap
- Test provincial tax differences
- Test employment type differences
- Test RRSP deduction logic

---

**This specification is now LOCKED. All Canada calculators follow this pattern.**

**Last Updated:** January 14, 2026
**Next Review:** Tax year 2027 rule updates
