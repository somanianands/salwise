# 🇩🇪 GERMANY – CALCULATOR SYSTEM (MASTER SPEC 2026)

**Status:** ✅ Production Standard
**Date:** January 14, 2026
**Tax Year:** 2026
**Currency:** EUR (€)

**This is the definitive specification for ALL Germany salary calculators.**

---

## Calculators Covered

| Calculator | URL Slug |
|-----------|----------|
| Salary Calculator | `/salary-calculator` |
| Gross to Net Salary (Brutto-Netto) | `/gross-to-net-salary` |
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

**All calculators share the same Germany tax engine: Lohnsteuer + Solidarity Surcharge + Church Tax + Social Contributions**

---

## 1️⃣ CORE DESIGN PRINCIPLES (VERY IMPORTANT)

### 🔒 NO TAX YEAR INPUT

- ❌ Do NOT ask user for tax year
- ✅ Always use latest 2026 German tax rules
- ✅ Update rules centrally (config-based)

### 🔒 USER NEVER ENTERS TAX RATES

Users must never input:
- ❌ Income tax rates (Lohnsteuer) / brackets
- ❌ Solidarity surcharge rate (Solidaritätszuschlag)
- ❌ Church tax rate (Kirchensteuer)
- ❌ Social security contribution rates
- ❌ Contribution ceilings (Beitragsbemessungsgrenzen)

✅ These are ALL auto-calculated internally

### ✅ CORE PRINCIPLE

**Normalize → Annual → Apply Tax Engine → Redistribute**

All calculators:
1. Normalize input to annual gross income
2. Apply Germany tax engine (Income Tax + Soli + Church Tax + Social Contributions)
3. Redistribute net results to desired output frequency

---

## 2️⃣ MASTER INPUT SPECIFICATION

### 2.1 Core Inputs (Always Visible)

#### 1. Gross Pay Amount (Brutto Einkommen)
- **Type:** Number
- **Label:** Brutto Einkommen
- **Unit:** EUR (€)
- **Required:** Yes
- **Description:** Total gross income before taxes and social contributions

#### 2. Pay Frequency
- **Type:** Select
- **Options:**
  - Annual (Jährlich)
  - Monthly (Monatlich)
  - Weekly (Wöchentlich)
  - Bi-Weekly (14-Tage)
  - Daily (Täglich)
  - Hourly (Stündlich)
- **Default:** Monthly
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

#### 3. Tax Class (Steuerklasse)
- **Type:** Select
- **Required:** Yes
- **Options:**
  - **I** - Single, divorced, widowed (no children)
  - **II** - Single parent with children
  - **III** - Married, higher-earning spouse
  - **IV** - Married, similar earnings (default)
  - **V** - Married, lower-earning spouse (partner in III)
  - **VI** - Second job / multiple employments
- **Default:** I
- **Logic:** Determines basic allowance and tax calculation method

#### 4. Federal State (Bundesland)
- **Type:** Select
- **Required:** Yes (if church tax selected)
- **Options:** All 16 German states
- **Default:** Nordrhein-Westfalen
- **Logic:** Determines church tax rate (8% or 9%)

#### 5. Employment Type
- **Type:** Select
- **Options:**
  - Employee (Arbeitnehmer)
  - Self-Employed (Selbständig)
- **Default:** Employee
- **Logic:** Determines social security obligations

### 2.2 Optional Advanced Inputs (Collapsed)

#### 6. Church Tax Liable (Kirchensteuerpflichtig)
- **Type:** Boolean
- **Default:** No
- **Logic:** If yes, church tax = 8% or 9% of income tax (depends on state)

#### 7. Children / Dependents (Kinder)
- **Type:** Number
- **Default:** 0
- **Logic:** Child allowance (Kinderfreibetrag) reduces taxable income

#### 8. Voluntary Retirement Contributions (Altersvorsorge)
- **Type:** Number
- **Unit:** EUR ($) per year
- **Default:** 0
- **Logic:** Riester, Rürup contributions (tax-deductible within limits)

#### 9. Other Pre-Tax Deductions
- **Type:** Number
- **Unit:** EUR (€) per year
- **Default:** 0
- **Examples:** Professional expenses (Werbungskosten), special expenses

#### 10. Additional Withholding / Tax Adjustment
- **Type:** Number
- **Unit:** EUR (€) per year
- **Default:** 0
- **Logic:** Added to total tax

#### 11. Age Over 23 and Childless (for Care Insurance)
- **Type:** Boolean
- **Default:** No
- **Logic:** +0.6% additional long-term care insurance

#### 12. Working Hours (Hourly Only)
- **Type:** Number
- **Default:** 2080 (40 hours/week × 52 weeks)
- **Logic:** For hourly → annual conversion

---

## 3️⃣ AUTO-CALCULATED (NOT USER INPUT)

Claude / Cursor must calculate these internally:

- ✅ Annual Gross Income (normalized from input)
- ✅ Basic Allowance (Grundfreibetrag) based on tax class
- ✅ Taxable Income (Zu versteuerndes Einkommen)
- ✅ Income Tax (Lohnsteuer/Einkommensteuer)
- ✅ Solidarity Surcharge (Solidaritätszuschlag) - 5.5%
- ✅ Church Tax (Kirchensteuer) - 8% or 9%
- ✅ Pension Insurance (Rentenversicherung) - 9.3%
- ✅ Health Insurance (Krankenversicherung) - 7.3% + 1.6%
- ✅ Unemployment Insurance (Arbeitslosenversicherung) - 1.3%
- ✅ Long-term Care Insurance (Pflegeversicherung) - 1.7% + 0.6%
- ✅ Total Tax & Contributions
- ✅ Net Income (all frequencies)

❌ **Users should NEVER enter tax rates, brackets, or contribution rates**

---

## 4️⃣ GERMANY TAX ENGINE (2026)

### 4.1 Basic Allowance (Grundfreibetrag)

**2026 Basic Allowance:** €11,604

- Income up to this amount is tax-free
- Applies to all tax classes

### 4.2 Income Tax Brackets (2026)

**Progressive Tax Formula (Einkommensteuer):**

| Zone | Taxable Income (EUR) | Marginal Rate | Formula |
|------|---------------------|---------------|---------|
| 1 | €0 - €11,604 | 0% | Tax-free (Grundfreibetrag) |
| 2 | €11,605 - €17,005 | 14% - 24% | Linear progression |
| 3 | €17,006 - €66,760 | 24% - 42% | Linear progression |
| 4 | €66,761 - €277,825 | 42% | Constant rate |
| 5 | €277,826+ | 45% | Top rate (Reichensteuer) |

**German Tax Calculation (Simplified):**

```typescript
function calculateGermanIncomeTax(taxableIncome: number): number {
  // Basic allowance (tax-free)
  if (taxableIncome <= 11604) {
    return 0;
  }

  // Zone 2: Linear progression 14% to 24%
  if (taxableIncome <= 17005) {
    const y = (taxableIncome - 11604) / 10000;
    return (922.98 * y + 1400) * y;
  }

  // Zone 3: Linear progression 24% to 42%
  if (taxableIncome <= 66760) {
    const z = (taxableIncome - 17005) / 10000;
    return (181.19 * z + 2397) * z + 1025.38;
  }

  // Zone 4: Constant 42%
  if (taxableIncome <= 277825) {
    return taxableIncome * 0.42 - 10602.13;
  }

  // Zone 5: Top rate 45%
  return taxableIncome * 0.45 - 18936.88;
}
```

**Note:** German tax formula uses quadratic functions in zones 2 and 3 for smooth progression.

### 4.3 Tax Class Adjustments

**Basic Allowances by Tax Class (2026):**

| Tax Class | Description | Basic Allowance | Employee Allowance |
|-----------|-------------|-----------------|-------------------|
| I | Single | €11,604 | €1,230 |
| II | Single parent | €11,604 + €4,260 | €1,230 |
| III | Married (higher earner) | €23,208 (double) | €1,230 |
| IV | Married (equal) | €11,604 | €1,230 |
| V | Married (lower earner) | €0 | €1,230 |
| VI | Second job | €0 | €0 |

**Employee Allowance (Arbeitnehmer-Pauschbetrag):** €1,230
- Automatic deduction for work-related expenses

### 4.4 Child Allowance (Kinderfreibetrag)

**Per Child (2026):** €6,384 per year (€3,192 per parent)

- Automatically considered in annual tax assessment
- Either child allowance OR child benefit (Kindergeld) - whichever is more favorable
- Child benefit: €250/month per child (paid separately, not part of salary calculation)

### 4.5 Solidarity Surcharge (Solidaritätszuschlag)

**Rate:** 5.5% of income tax

**Exemption Threshold (2026):**
- Single: Income tax ≤ €18,130 → No solidarity surcharge
- Married: Income tax ≤ €36,260 → No solidarity surcharge

**Phase-Out Zone:**
- Gradual reduction between exemption threshold and full rate

```typescript
function calculateSolidaritySurcharge(incomeTax: number, taxClass: string): number {
  // Exemption thresholds
  const singleThreshold = 18130;
  const marriedThreshold = 36260;

  const threshold = (taxClass === 'III') ? marriedThreshold : singleThreshold;

  // Full exemption
  if (incomeTax <= threshold) {
    return 0;
  }

  // Phase-out zone (simplified)
  const phaseOutEnd = threshold * 1.2;
  if (incomeTax <= phaseOutEnd) {
    // Gradual phase-in
    const excessTax = incomeTax - threshold;
    const fullSoli = incomeTax * 0.055;
    return (excessTax / (phaseOutEnd - threshold)) * fullSoli;
  }

  // Full solidarity surcharge (5.5%)
  return incomeTax * 0.055;
}
```

### 4.6 Church Tax (Kirchensteuer)

**Rate by State:**
- **8%:** Most German states
- **9%:** Bavaria (Bayern), Baden-Württemberg

**Applies to:** Income tax amount (after solidarity surcharge calculation)

```typescript
function calculateChurchTax(incomeTax: number, federalState: string): number {
  const rate = (federalState === 'Bayern' || federalState === 'Baden-Württemberg')
    ? 0.09
    : 0.08;

  return incomeTax * rate;
}
```

### 4.7 Social Security Contributions (Sozialversicherung)

**2026 Contribution Rates (Employee Share):**

| Insurance | German Name | Employee Rate | Employer Rate | Total Rate |
|-----------|-------------|---------------|---------------|------------|
| Pension | Rentenversicherung | 9.3% | 9.3% | 18.6% |
| Health | Krankenversicherung | 7.3% + 1.6%* | 7.3% | 14.6% + 1.6% |
| Unemployment | Arbeitslosenversicherung | 1.3% | 1.3% | 2.6% |
| Long-term Care | Pflegeversicherung | 1.7% + 0.6%** | 1.7% | 3.4% + 0.6% |

*Additional contribution (Zusatzbeitrag) - average 1.6% (employee only)
**Childless supplement - 0.6% extra if over 23 and childless

**Contribution Ceilings (Beitragsbemessungsgrenzen) 2026:**

| Insurance | West Germany | East Germany |
|-----------|--------------|--------------|
| Pension & Unemployment | €90,600/year (€7,550/month) | €89,400/year (€7,450/month) |
| Health & Care | €62,100/year (€5,175/month) | €62,100/year (€5,175/month) |

**Note:** Contributions only calculated up to ceiling, income above ceiling is not subject to contributions.

**Social Contribution Calculation:**

```typescript
function calculateSocialContributions(
  grossAnnual: number,
  isChildless: boolean,
  region: 'west' | 'east'
): SocialContributions {
  // Annual ceilings
  const pensionCeiling = region === 'west' ? 90600 : 89400;
  const healthCeiling = 62100;

  // Calculate contributable income
  const pensionableIncome = Math.min(grossAnnual, pensionCeiling);
  const healthableIncome = Math.min(grossAnnual, healthCeiling);

  // Pension insurance (9.3%)
  const pension = pensionableIncome * 0.093;

  // Health insurance (7.3% + 1.6% additional)
  const health = healthableIncome * (0.073 + 0.016);

  // Unemployment insurance (1.3%)
  const unemployment = pensionableIncome * 0.013;

  // Long-term care insurance (1.7% + 0.6% if childless over 23)
  const careRate = isChildless ? 0.017 + 0.006 : 0.017;
  const care = healthableIncome * careRate;

  return {
    pension,
    health,
    unemployment,
    care,
    total: pension + health + unemployment + care
  };
}
```

### 4.8 Total Tax & Net Pay Calculation

```typescript
// 1. Normalize input to annual gross
annualGross = normalizeToAnnual(inputAmount, frequency)

// 2. Calculate pre-tax deductions
totalPreTaxDeductions = voluntaryRetirement + otherPreTax

// 3. Calculate taxable income
const basicAllowance = getTaxClassAllowance(taxClass);
const employeeAllowance = 1230;
const childAllowance = numberOfChildren * 6384;

taxableIncome = annualGross - totalPreTaxDeductions - basicAllowance - employeeAllowance - childAllowance

// 4. Calculate income tax
incomeTax = calculateGermanIncomeTax(taxableIncome)

// 5. Calculate solidarity surcharge
solidaritySurcharge = calculateSolidaritySurcharge(incomeTax, taxClass)

// 6. Calculate church tax (if applicable)
churchTax = churchTaxLiable ? calculateChurchTax(incomeTax, federalState) : 0

// 7. Calculate social security contributions
socialContributions = calculateSocialContributions(annualGross, isChildless, region)

// 8. Calculate total tax
totalTax = incomeTax + solidaritySurcharge + churchTax + socialContributions.total + additionalWithholding

// 9. Calculate net income
netAnnual = annualGross - totalTax

// 10. Redistribute to output frequencies
netMonthly = netAnnual / 12
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
| Gross Annual Income (Brutto) | Normalized from input |
| Pre-Tax Deductions | Retirement + Other (if any) |
| Taxable Income (Zu versteuerndes Einkommen) | After allowances and deductions |
| Income Tax (Lohnsteuer) | Progressive tax |
| Solidarity Surcharge (Soli) | 5.5% of income tax (with exemptions) |
| Church Tax (Kirchensteuer) | 8-9% of income tax (if liable) |
| Pension Insurance (Rentenversicherung) | 9.3% |
| Health Insurance (Krankenversicherung) | 8.9% (7.3% + 1.6%) |
| Unemployment Insurance (Arbeitslosenversicherung) | 1.3% |
| Long-term Care Insurance (Pflegeversicherung) | 1.7% or 2.3% |
| Total Tax & Contributions | All deductions |
| Net Annual Pay (Netto) | Gross – Total Tax |

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
Normalization: annualGross = hourlyRate × 2080 (40 hrs/week × 52 weeks)
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

### Example 1: Single Employee Tax Class I (€50,000)

**Input:**
- Gross Salary: €50,000
- Tax Class: I (Single)
- Church Tax: No
- Children: 0
- Federal State: Nordrhein-Westfalen
- Region: West

**Calculation:**
```
Annual Gross: €50,000

Taxable Income:
  €50,000 - €11,604 (basic allowance) - €1,230 (employee allowance) = €37,166

Income Tax:
  Zone 3 formula: €7,217

Solidarity Surcharge:
  €7,217 < €18,130 → €0 (exempt)

Church Tax: €0 (not liable)

Social Contributions (on gross €50,000):
  Pension: €50,000 × 9.3% = €4,650
  Health: €50,000 × 8.9% = €4,450
  Unemployment: €50,000 × 1.3% = €650
  Care: €50,000 × 1.7% = €850
  Total Social: €10,600

Total Tax: €7,217 + €0 + €0 + €10,600 = €17,817
Net Annual: €50,000 - €17,817 = €32,183
Net Monthly: €32,183 ÷ 12 = €2,681.92

Effective Rate: 35.6%
```

### Example 2: Married Tax Class III with Church Tax (€75,000)

**Input:**
- Gross Salary: €75,000
- Tax Class: III (Married, higher earner)
- Church Tax: Yes
- Children: 2
- Federal State: Bayern (9% church tax)
- Region: West

**Calculation:**
```
Annual Gross: €75,000

Taxable Income:
  €75,000 - €23,208 (double basic allowance) - €1,230 (employee) - €12,768 (2 children) = €37,794

Income Tax: €7,376

Solidarity Surcharge: €0 (below €36,260 threshold for married)

Church Tax: €7,376 × 9% = €664

Social Contributions (on gross €75,000):
  Pension: €75,000 × 9.3% = €6,975
  Health: €62,100 × 8.9% = €5,527 (capped at €62,100)
  Unemployment: €75,000 × 1.3% = €975
  Care: €62,100 × 1.7% = €1,056 (capped)
  Total Social: €14,533

Total Tax: €7,376 + €0 + €664 + €14,533 = €22,573
Net Annual: €75,000 - €22,573 = €52,427
Net Monthly: €52,427 ÷ 12 = €4,368.92

Effective Rate: 30.1%
```

### Example 3: High Earner Tax Class I (€120,000)

**Input:**
- Gross Salary: €120,000
- Tax Class: I (Single)
- Church Tax: No
- Children: 0
- Childless over 23: Yes (+0.6% care insurance)
- Region: West

**Calculation:**
```
Annual Gross: €120,000

Taxable Income:
  €120,000 - €11,604 - €1,230 = €107,166

Income Tax: €38,788

Solidarity Surcharge:
  €38,788 × 5.5% = €2,133

Church Tax: €0

Social Contributions (on gross €120,000, with ceilings):
  Pension: €90,600 × 9.3% = €8,426 (capped)
  Health: €62,100 × 8.9% = €5,527 (capped)
  Unemployment: €90,600 × 1.3% = €1,178 (capped)
  Care: €62,100 × 2.3% = €1,428 (capped, with childless supplement)
  Total Social: €16,559

Total Tax: €38,788 + €2,133 + €0 + €16,559 = €57,480
Net Annual: €120,000 - €57,480 = €62,520
Net Monthly: €62,520 ÷ 12 = €5,210

Effective Rate: 47.9%
```

### Example 4: Single Parent Tax Class II (€40,000)

**Input:**
- Gross Salary: €40,000
- Tax Class: II (Single parent)
- Church Tax: No
- Children: 1
- Region: West

**Calculation:**
```
Annual Gross: €40,000

Taxable Income:
  €40,000 - €11,604 (basic) - €4,260 (single parent relief) - €1,230 (employee) - €6,384 (1 child) = €16,522

Income Tax: €827

Solidarity Surcharge: €0 (below threshold)

Church Tax: €0

Social Contributions:
  Pension: €40,000 × 9.3% = €3,720
  Health: €40,000 × 8.9% = €3,560
  Unemployment: €40,000 × 1.3% = €520
  Care: €40,000 × 1.7% = €680
  Total Social: €8,480

Total Tax: €827 + €0 + €0 + €8,480 = €9,307
Net Annual: €40,000 - €9,307 = €30,693
Net Monthly: €30,693 ÷ 12 = €2,557.75

Effective Rate: 23.3%
```

### Example 5: Hourly Worker (€25/hour)

**Input:**
- Hourly Rate: €25
- Working Hours: 2080
- Tax Class: I
- Region: West

**Calculation:**
```
Annual Gross = €25 × 2080 = €52,000

(Apply standard tax engine)

Taxable Income: €39,166
Income Tax: €7,541
Solidarity Surcharge: €0
Church Tax: €0
Social Contributions: €11,024
Total Tax: €18,565
Net Annual: €33,435

Net Hourly: €33,435 ÷ 2080 = €16.08
Net Weekly: €33,435 ÷ 52 = €643.17
Net Monthly: €33,435 ÷ 12 = €2,786.25

Effective Rate: 35.7%
```

### Example 6: Bonus Calculation (€60,000 + €10,000)

**Input:**
- Base Salary: €60,000
- Bonus: €10,000
- Tax Class: I

**Calculation:**
```
Without Bonus:
  Gross: €60,000
  Income Tax: €11,381
  Solidarity Surcharge: €0
  Social Contributions: €12,720
  Total Tax: €24,101
  Net: €35,899

With Bonus:
  Gross: €70,000
  Income Tax: €14,741
  Solidarity Surcharge: €0
  Social Contributions: €14,840
  Total Tax: €29,581
  Net: €40,419

Bonus Impact:
  Gross Bonus: €10,000
  Additional Tax: €5,480
  Net Bonus: €4,520
  Bonus Tax Rate: 54.8%
```

---

## 8️⃣ VALIDATION CHECKLIST

### Core Tax Engine
- [ ] Income tax calculated using German quadratic formula
- [ ] Basic allowance applied based on tax class
- [ ] Employee allowance (€1,230) applied
- [ ] Child allowance (€6,384 per child) applied
- [ ] Solidarity surcharge calculated with exemption threshold
- [ ] Church tax calculated (8% or 9% based on state)
- [ ] Pension insurance capped at contribution ceiling
- [ ] Health insurance capped at contribution ceiling
- [ ] Unemployment insurance capped at contribution ceiling
- [ ] Care insurance includes childless supplement if applicable
- [ ] Tax class determines allowances correctly

### Time-Based Calculators
- [ ] Hourly: Normalizes to annual (× 2080)
- [ ] Weekly: Normalizes to annual (× 52)
- [ ] Monthly: Normalizes to annual (× 12)
- [ ] Daily: Normalizes to annual (× 260)
- [ ] All use shared Germany tax engine
- [ ] Results match salary calculator for same annual amount

### Variable Pay Calculators
- [ ] Overtime: Combined with regular pay, not taxed separately
- [ ] Bonus: Marginal tax approach, NOT flat rate
- [ ] Commission: Normalized by frequency, taxed as ordinary income
- [ ] All components included (Income Tax + Soli + Church + Social)

---

## 9️⃣ COMMON PITFALLS TO AVOID

### ❌ Wrong: Not Applying Basic Allowance
```typescript
// WRONG - Basic allowance is mandatory
const tax = calculateTax(grossIncome);
```

### ✅ Correct: Apply Basic Allowance by Tax Class
```typescript
// CORRECT - Tax class determines allowance
const basicAllowance = getTaxClassAllowance(taxClass);
const taxableIncome = grossIncome - basicAllowance - employeeAllowance;
```

### ❌ Wrong: Forgetting Contribution Ceilings
```typescript
// WRONG - Social contributions unlimited
const pension = grossIncome * 0.093;
```

### ✅ Correct: Apply Contribution Ceilings
```typescript
// CORRECT - Cap contributions at ceiling
const pensionableIncome = Math.min(grossIncome, 90600);
const pension = pensionableIncome * 0.093;
```

### ❌ Wrong: Flat Solidarity Surcharge
```typescript
// WRONG - Not checking exemption threshold
const soli = incomeTax * 0.055;
```

### ✅ Correct: Solidarity Surcharge with Exemption
```typescript
// CORRECT - Apply exemption threshold
if (incomeTax <= 18130) {
  soli = 0;
} else {
  soli = calculateSoliWithPhaseIn(incomeTax);
}
```

### ❌ Wrong: Flat Bonus Tax
```typescript
// WRONG - Never use flat bonus tax
const bonusTax = bonus * 0.42;
```

### ✅ Correct: Marginal Bonus Tax
```typescript
// CORRECT - Calculate actual marginal impact
const withoutBonus = calculateDE(baseSalary);
const withBonus = calculateDE(baseSalary + bonus);
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
   - Always use 2026 German tax rules
   - Update centrally when year changes

3. ❌ **Never ask for tax rates**
   - Income tax uses German quadratic formula
   - Solidarity surcharge: 5.5% (with exemptions)
   - Church tax: 8% or 9%
   - Social contributions: Fixed percentages
   - All automatic

4. ❌ **Never ask for allowances**
   - Determine from tax class automatically
   - Basic allowance: €11,604 to €23,208
   - Employee allowance: €1,230
   - Child allowance: €6,384 per child

5. ✅ **Four primary tax/contribution components**
   - Income Tax (on taxable income, after allowances)
   - Solidarity Surcharge (5.5% of income tax, with exemptions)
   - Church Tax (8-9% of income tax, if liable)
   - Social Contributions (pension, health, unemployment, care)

6. ✅ **Contribution ceilings matter**
   - Pension & Unemployment: €90,600 (West) / €89,400 (East)
   - Health & Care: €62,100
   - Contributions only on income up to ceiling

7. ✅ **Show all breakdowns**
   - Gross annual
   - Each tax component separately
   - Each social contribution separately
   - Total tax & contributions
   - Net annual, monthly, weekly, daily, hourly
   - Effective tax rate

8. ✅ **Tax class matters**
   - I: Single (default)
   - II: Single parent (+€4,260 relief)
   - III: Married higher earner (double allowance)
   - IV: Married equal (normal allowance)
   - V: Married lower earner (no allowance)
   - VI: Second job (no allowances)

9. ✅ **Regional differences**
   - West vs East Germany for contribution ceilings
   - Federal state for church tax rate (8% vs 9%)

10. ✅ **Comparison for variable pay**
    - Bonus: Show with/without comparison
    - Commission: Show net commission take-home
    - Overtime: Show regular vs overtime breakdown

---

## 🎯 PRODUCTION READINESS

**Status:** Ready for implementation

**Implementation Priority:**
1. Core tax engine (Income Tax + Soli + Church + Social Contributions)
2. Salary calculator (baseline)
3. Time-based calculators (hourly/weekly/monthly/daily)
4. Variable pay calculators (bonus/overtime/commission)

**Testing Requirements:**
- Verify all example calculations
- Test German tax formula (quadratic zones)
- Test solidarity surcharge exemption thresholds
- Test contribution ceilings (West vs East)
- Test all six tax classes
- Test church tax rates by state
- Test childless care insurance supplement

---

**This specification is now LOCKED. All Germany calculators follow this pattern.**

**Last Updated:** January 14, 2026
**Next Review:** 2027 tax year updates
