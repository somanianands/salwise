# 🇫🇷 FRANCE – CALCULATOR SYSTEM (MASTER SPEC 2026)

**Status:** ✅ Production Standard
**Date:** January 14, 2026
**Tax Year:** 2026
**Currency:** EUR (€)

**This is the definitive specification for ALL France salary calculators.**

---

## Calculators Covered

| Calculator | URL Slug |
|-----------|----------|
| Salary Calculator | `/salary-calculator` |
| Gross to Net Salary (Brut-Net) | `/gross-to-net-salary` |
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

**All calculators share the same France tax engine: Income Tax (with Family Quotient) + CSG/CRDS + Social Contributions**

---

## 1️⃣ CORE DESIGN PRINCIPLES (VERY IMPORTANT)

### 🔒 NO TAX YEAR INPUT

- ❌ Do NOT ask user for tax year
- ✅ Always use latest 2026 French tax rules
- ✅ Update rules centrally (config-based)

### 🔒 USER NEVER ENTERS TAX RATES

Users must never input:
- ❌ Income tax rates (Impôt sur le revenu) / brackets
- ❌ CSG rate (Contribution Sociale Généralisée)
- ❌ CRDS rate (Contribution au Remboursement de la Dette Sociale)
- ❌ Social security contribution rates
- ❌ Family quotient calculation

✅ These are ALL auto-calculated internally

### ✅ CORE PRINCIPLE

**Normalize → Annual → Apply Tax Engine → Redistribute**

All calculators:
1. Normalize input to annual gross income
2. Apply France tax engine (Income Tax + CSG/CRDS + Social Contributions)
3. Redistribute net results to desired output frequency

---

## 2️⃣ MASTER INPUT SPECIFICATION

### 2.1 Core Inputs (Always Visible)

#### 1. Gross Pay Amount (Salaire Brut)
- **Type:** Number
- **Label:** Salaire Brut
- **Unit:** EUR (€)
- **Required:** Yes
- **Description:** Total gross income before taxes and social contributions

#### 2. Pay Frequency
- **Type:** Select
- **Options:**
  - Annual (Annuel)
  - Monthly (Mensuel)
  - Weekly (Hebdomadaire)
  - Bi-Weekly (Bimensuel)
  - Daily (Quotidien)
  - Hourly (Horaire)
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
| Hourly | `amount × workingHours` (default 1607 for full-time in France) |

**Note:** Standard French working hours = 35 hours/week (1607 hours/year with paid leave)

#### 3. Marital Status (Situation Familiale)
- **Type:** Select
- **Required:** Yes
- **Options:**
  - Single (Célibataire)
  - Married / PACS (Marié / Pacsé)
  - Divorced (Divorcé)
  - Widowed (Veuf/Veuve)
- **Default:** Single
- **Logic:** Determines family quotient parts for income tax

#### 4. Number of Children / Dependents (Nombre d'Enfants)
- **Type:** Number
- **Default:** 0
- **Required:** Yes
- **Logic:** Each child adds quotient parts (0.5 for first 2, then 1.0 per child)

#### 5. Employment Type
- **Type:** Select
- **Options:**
  - Employee (Salarié)
  - Self-Employed / Contractor (Indépendant)
- **Default:** Employee
- **Logic:** Determines social security contribution rates

### 2.2 Optional Advanced Inputs (Collapsed)

#### 6. Retirement Savings (PER - Plan d'Épargne Retraite)
- **Type:** Number
- **Unit:** EUR (€) per year
- **Default:** 0
- **Logic:** Tax-deductible retirement contributions (within 10% of income limit)

#### 7. Other Deductible Expenses
- **Type:** Number
- **Unit:** EUR (€) per year
- **Default:** 0
- **Examples:** Professional expenses, alimony payments

#### 8. Additional Withholding / Tax Adjustment
- **Type:** Number
- **Unit:** EUR (€) per year
- **Default:** 0
- **Logic:** Added to total tax

#### 9. Working Hours (Hourly Only)
- **Type:** Number
- **Default:** 1607 (35 hours/week × 52 weeks - statutory paid leave)
- **Logic:** For hourly → annual conversion

---

## 3️⃣ AUTO-CALCULATED (NOT USER INPUT)

Claude / Cursor must calculate these internally:

- ✅ Annual Gross Income (normalized from input)
- ✅ Net Taxable Income (Revenu net imposable)
- ✅ Family Quotient Parts (Parts fiscales)
- ✅ Quotient Income (per part)
- ✅ Income Tax (Impôt sur le revenu) - progressive
- ✅ CSG (Contribution Sociale Généralisée) - 9.2%
- ✅ CRDS (Contribution pour le Remboursement de la Dette Sociale) - 0.5%
- ✅ Social Security Contributions (employee share):
  - Old-age insurance (Assurance vieillesse)
  - Supplementary pension (Retraite complémentaire)
  - Unemployment (Assurance chômage)
  - Health insurance (Assurance maladie)
- ✅ Total Tax & Contributions
- ✅ Net Income (all frequencies)

❌ **Users should NEVER enter tax rates, brackets, or contribution rates**

---

## 4️⃣ FRANCE TAX ENGINE (2026)

### 4.1 Family Quotient System (Quotient Familial)

The French tax system divides income by "parts" based on family situation.

**Family Quotient Parts (2026):**

| Family Situation | Parts (Parts fiscales) |
|------------------|------------------------|
| Single, no children | 1 |
| Single, 1 child | 1.5 |
| Single, 2 children | 2 |
| Single, 3 children | 3 |
| Single, 4+ children | 3 + 1 per additional child |
| Married/PACS, no children | 2 |
| Married/PACS, 1 child | 2.5 |
| Married/PACS, 2 children | 3 |
| Married/PACS, 3 children | 4 |
| Married/PACS, 4+ children | 4 + 1 per additional child |

**Calculation Logic:**
- First 2 children: +0.5 parts each
- 3rd and subsequent children: +1 part each
- Single parent: +0.5 additional part (first child)

**Family Quotient Ceiling (Plafonnement):**
- The tax reduction from family quotient is capped at €1,759 per half-part (2026)

```typescript
function calculateFamilyParts(
  maritalStatus: 'single' | 'married',
  numberOfChildren: number,
  isSingleParent: boolean
): number {
  let parts = maritalStatus === 'married' ? 2 : 1;

  if (isSingleParent && numberOfChildren >= 1) {
    parts += 0.5; // Single parent bonus for first child
  }

  // Add parts for children
  if (numberOfChildren >= 1) {
    parts += 0.5; // First child
  }
  if (numberOfChildren >= 2) {
    parts += 0.5; // Second child
  }
  if (numberOfChildren >= 3) {
    parts += numberOfChildren - 2; // Third+ children = 1 part each
  }

  return parts;
}
```

### 4.2 Income Tax Brackets (2026)

**Progressive Tax Rates (Impôt sur le revenu) 2026:**

Calculated on **quotient income** (income per family part).

| Bracket | Quotient Income per Part (EUR) | Rate |
|---------|-------------------------------|------|
| 1 | €0 - €11,294 | 0% |
| 2 | €11,295 - €28,797 | 11% |
| 3 | €28,798 - €82,341 | 30% |
| 4 | €82,342 - €177,106 | 41% |
| 5 | €177,107+ | 45% |

**Income Tax Calculation:**

```typescript
function calculateFrenchIncomeTax(
  netTaxableIncome: number,
  familyParts: number
): number {
  // 1. Calculate quotient income (income per part)
  const quotientIncome = netTaxableIncome / familyParts;

  // 2. Apply progressive tax to quotient income
  let taxPerPart = 0;

  if (quotientIncome <= 11294) {
    taxPerPart = 0;
  } else if (quotientIncome <= 28797) {
    taxPerPart = (quotientIncome - 11294) * 0.11;
  } else if (quotientIncome <= 82341) {
    taxPerPart = (28797 - 11294) * 0.11 + (quotientIncome - 28797) * 0.30;
  } else if (quotientIncome <= 177106) {
    taxPerPart = (28797 - 11294) * 0.11 + (82341 - 28797) * 0.30 + (quotientIncome - 82341) * 0.41;
  } else {
    taxPerPart = (28797 - 11294) * 0.11 + (82341 - 28797) * 0.30 + (177106 - 82341) * 0.41 + (quotientIncome - 177106) * 0.45;
  }

  // 3. Multiply by number of parts to get total tax
  let totalTax = taxPerPart * familyParts;

  // 4. Apply family quotient ceiling (if applicable)
  // Tax reduction capped at €1,759 per half-part beyond basic parts
  if (familyParts > (maritalStatus === 'married' ? 2 : 1)) {
    const extraParts = familyParts - (maritalStatus === 'married' ? 2 : 1);
    const taxWithoutQuotient = calculateTaxWithoutQuotient(netTaxableIncome);
    const quotientBenefit = taxWithoutQuotient - totalTax;
    const maxBenefit = extraParts * 2 * 1759; // €1,759 per half-part

    if (quotientBenefit > maxBenefit) {
      totalTax = taxWithoutQuotient - maxBenefit;
    }
  }

  return Math.max(0, totalTax);
}
```

### 4.3 Standard Deduction (Déduction Forfaitaire)

**Automatic 10% Deduction for Professional Expenses:**
- Minimum: €482 (2026)
- Maximum: €13,522 (2026)
- Applies automatically unless actual expenses claimed

```typescript
function calculateNetTaxableIncome(grossIncome: number): number {
  // Standard 10% deduction for professional expenses
  const deduction = Math.min(Math.max(grossIncome * 0.10, 482), 13522);
  return grossIncome - deduction;
}
```

### 4.4 CSG and CRDS (Social Contributions on Income)

**CSG (Contribution Sociale Généralisée) 2026:**
- **Rate:** 9.2% on 98.25% of gross income
- **Deductible:** 6.8% is tax-deductible, 2.4% is non-deductible

**CRDS (Contribution au Remboursement de la Dette Sociale) 2026:**
- **Rate:** 0.5% on 98.25% of gross income
- **Non-deductible**

```typescript
function calculateCSGCRDS(grossIncome: number): {
  csg: number;
  crds: number;
  deductibleCSG: number;
} {
  const contributionBase = grossIncome * 0.9825; // 98.25% of gross

  const csg = contributionBase * 0.092; // 9.2%
  const crds = contributionBase * 0.005; // 0.5%
  const deductibleCSG = contributionBase * 0.068; // 6.8% deductible portion

  return { csg, crds, deductibleCSG };
}
```

### 4.5 Social Security Contributions (URSSAF - Employee Share)

**2026 Social Security Contribution Rates (Employee):**

| Contribution | French Name | Rate | Ceiling |
|--------------|-------------|------|---------|
| Old-Age Basic | Assurance vieillesse (base) | 6.90% | Tranche 1 (€46,368) |
| Old-Age Supplementary | Assurance vieillesse (complément) | 0.40% | Entire salary |
| Health Insurance | Assurance maladie | 0% | Employer only |
| Supplementary Pension AGIRC-ARRCO | Retraite complémentaire | 3.15% | Tranche 1 |
| Supplementary Pension AGIRC-ARRCO | Retraite complémentaire | 8.64% | Tranche 2 (€46,368-€370,944) |
| APEC (Executives) | APEC | 0.024% | Tranche 1 + 2 |
| Unemployment Insurance | Assurance chômage | 0% | Employer only (employee exempt) |

**Social Security Ceilings (Plafond de la Sécurité Sociale) 2026:**
- **Tranche 1:** €0 - €46,368 (1× PSS)
- **Tranche 2:** €46,369 - €370,944 (1-8× PSS)
- **PSS Monthly:** €3,864

```typescript
function calculateSocialContributions(grossAnnual: number, isExecutive: boolean): SocialContributions {
  const tranche1Ceiling = 46368;
  const tranche2Ceiling = 370944;

  // Calculate income in each tranche
  const tranche1Income = Math.min(grossAnnual, tranche1Ceiling);
  const tranche2Income = Math.max(0, Math.min(grossAnnual, tranche2Ceiling) - tranche1Ceiling);

  // Old-age insurance (basic + supplementary)
  const oldAgeBasic = tranche1Income * 0.069;
  const oldAgeSupplementary = grossAnnual * 0.004;

  // Supplementary pension (AGIRC-ARRCO)
  const pensionTranche1 = tranche1Income * 0.0315;
  const pensionTranche2 = tranche2Income * 0.0864;

  // APEC (executives only)
  const apec = isExecutive ? (tranche1Income + tranche2Income) * 0.00024 : 0;

  // Health insurance: 0% for employee (employer only)
  const healthInsurance = 0;

  // Unemployment: 0% for employee (employer only)
  const unemployment = 0;

  return {
    oldAge: oldAgeBasic + oldAgeSupplementary,
    pension: pensionTranche1 + pensionTranche2,
    apec,
    health: healthInsurance,
    unemployment,
    total: oldAgeBasic + oldAgeSupplementary + pensionTranche1 + pensionTranche2 + apec
  };
}
```

### 4.6 Total Tax & Net Pay Calculation

```typescript
// 1. Normalize input to annual gross
annualGross = normalizeToAnnual(inputAmount, frequency)

// 2. Calculate CSG/CRDS
const { csg, crds, deductibleCSG } = calculateCSGCRDS(annualGross)

// 3. Calculate social security contributions
const socialContributions = calculateSocialContributions(annualGross, isExecutive)

// 4. Calculate net taxable income
const netTaxableIncome = calculateNetTaxableIncome(annualGross - deductibleCSG - retirementContributions)

// 5. Calculate family parts
const familyParts = calculateFamilyParts(maritalStatus, numberOfChildren, isSingleParent)

// 6. Calculate income tax
const incomeTax = calculateFrenchIncomeTax(netTaxableIncome, familyParts)

// 7. Calculate total tax & contributions
totalTax = incomeTax + csg + crds + socialContributions.total + additionalWithholding

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
| Gross Annual Income (Salaire Brut) | Normalized from input |
| CSG (Contribution Sociale Généralisée) | 9.2% on 98.25% of gross |
| CRDS (Contribution Dette Sociale) | 0.5% on 98.25% of gross |
| Social Security Contributions | Old-age, pension, APEC |
| Net Taxable Income (Revenu imposable) | After 10% deduction |
| Family Quotient Parts | Based on marital status + children |
| Income Tax (Impôt sur le revenu) | Progressive with quotient |
| Total Tax & Contributions | All deductions |
| Net Annual Pay (Salaire Net) | Gross – Total Tax |

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
Normalization: annualGross = hourlyRate × 1607 (35 hrs/week × 52 - paid leave)
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

### Example 1: Single Employee (€40,000)

**Input:**
- Gross Salary: €40,000
- Marital Status: Single
- Children: 0

**Calculation:**
```
Annual Gross: €40,000

CSG/CRDS:
  Base: €40,000 × 98.25% = €39,300
  CSG: €39,300 × 9.2% = €3,616
  CRDS: €39,300 × 0.5% = €197
  Deductible CSG: €39,300 × 6.8% = €2,672

Social Contributions:
  Old-age: €40,000 × 7.3% = €2,920
  Pension: €40,000 × 3.15% = €1,260
  Total Social: €4,180

Net Taxable Income:
  €40,000 - 10% deduction (€4,000) - €2,672 (deductible CSG) = €33,328

Family Parts: 1 (single, no children)

Quotient Income: €33,328 / 1 = €33,328

Income Tax:
  €0 - €11,294: €0
  €11,295 - €28,797: €17,503 × 11% = €1,925
  €28,798 - €33,328: €4,530 × 30% = €1,359
  Total: €3,284

Total Tax: €3,284 + €3,616 + €197 + €4,180 = €11,277
Net Annual: €40,000 - €11,277 = €28,723
Net Monthly: €28,723 ÷ 12 = €2,393.58

Effective Rate: 28.2%
```

### Example 2: Married with 2 Children (€60,000)

**Input:**
- Gross Salary: €60,000
- Marital Status: Married
- Children: 2

**Calculation:**
```
Annual Gross: €60,000

CSG/CRDS:
  CSG: €58,950 × 9.2% = €5,423
  CRDS: €58,950 × 0.5% = €295
  Deductible CSG: €58,950 × 6.8% = €4,009

Social Contributions: €6,270

Net Taxable Income: €48,891

Family Parts: 3 (married = 2, +0.5 per child × 2 = 1)

Quotient Income: €48,891 / 3 = €16,297

Income Tax per Part:
  €11,295 - €16,297: €5,002 × 11% = €550

Total Income Tax: €550 × 3 = €1,650

Total Tax: €1,650 + €5,423 + €295 + €6,270 = €13,638
Net Annual: €60,000 - €13,638 = €46,362
Net Monthly: €46,362 ÷ 12 = €3,863.50

Effective Rate: 22.7%
```

### Example 3: High Earner Single (€100,000)

**Input:**
- Gross Salary: €100,000
- Marital Status: Single
- Children: 0

**Calculation:**
```
Annual Gross: €100,000

CSG/CRDS:
  CSG: €98,250 × 9.2% = €9,039
  CRDS: €98,250 × 0.5% = €491
  Deductible CSG: €6,681

Social Contributions: €10,450 (capped at tranches)

Net Taxable Income: €82,869

Family Parts: 1

Quotient Income: €82,869

Income Tax:
  €0 - €11,294: €0
  €11,295 - €28,797: €17,503 × 11% = €1,925
  €28,798 - €82,341: €53,543 × 30% = €16,063
  €82,342 - €82,869: €528 × 41% = €216
  Total: €18,204

Total Tax: €18,204 + €9,039 + €491 + €10,450 = €38,184
Net Annual: €100,000 - €38,184 = €61,816
Net Monthly: €61,816 ÷ 12 = €5,151.33

Effective Rate: 38.2%
```

### Example 4: Single Parent with 1 Child (€35,000)

**Input:**
- Gross Salary: €35,000
- Marital Status: Single parent
- Children: 1

**Calculation:**
```
Annual Gross: €35,000

CSG/CRDS: €3,440 + €172 = €3,612
Social Contributions: €3,658

Net Taxable Income: €28,788

Family Parts: 2 (1 + 0.5 single parent + 0.5 first child)

Quotient Income: €28,788 / 2 = €14,394

Income Tax per Part:
  €11,295 - €14,394: €3,099 × 11% = €341

Total Income Tax: €341 × 2 = €682

Total Tax: €682 + €3,612 + €3,658 = €7,952
Net Annual: €35,000 - €7,952 = €27,048
Net Monthly: €27,048 ÷ 12 = €2,254

Effective Rate: 22.7%
```

### Example 5: Hourly Worker (€20/hour)

**Input:**
- Hourly Rate: €20
- Working Hours: 1607
- Marital Status: Single

**Calculation:**
```
Annual Gross = €20 × 1607 = €32,140

(Apply standard tax engine)

CSG/CRDS: €3,163
Social Contributions: €3,355
Net Taxable Income: €26,345
Income Tax: €1,866
Total Tax: €8,384
Net Annual: €23,756

Net Hourly: €23,756 ÷ 1607 = €14.78
Net Weekly: €23,756 ÷ 52 = €456.85
Net Monthly: €23,756 ÷ 12 = €1,979.67

Effective Rate: 26.1%
```

### Example 6: Bonus Calculation (€50,000 + €10,000)

**Input:**
- Base Salary: €50,000
- Bonus: €10,000
- Marital Status: Single

**Calculation:**
```
Without Bonus:
  Gross: €50,000
  Income Tax: €4,784
  CSG/CRDS: €4,915
  Social: €5,225
  Total Tax: €14,924
  Net: €35,076

With Bonus:
  Gross: €60,000
  Income Tax: €7,284
  CSG/CRDS: €5,898
  Social: €6,270
  Total Tax: €19,452
  Net: €40,548

Bonus Impact:
  Gross Bonus: €10,000
  Additional Tax: €4,528
  Net Bonus: €5,472
  Bonus Tax Rate: 45.3%
```

---

## 8️⃣ VALIDATION CHECKLIST

### Core Tax Engine
- [ ] CSG calculated on 98.25% of gross income
- [ ] CRDS calculated on 98.25% of gross income
- [ ] Deductible CSG (6.8%) reduces net taxable income
- [ ] Standard 10% deduction applied (min €482, max €13,522)
- [ ] Family quotient parts calculated correctly
- [ ] Income tax calculated on quotient income
- [ ] Family quotient ceiling applied (€1,759 per half-part)
- [ ] Social contributions capped at tranches
- [ ] Marital status affects family parts
- [ ] Children affect family parts correctly

### Time-Based Calculators
- [ ] Hourly: Normalizes to annual (× 1607 for full-time)
- [ ] Weekly: Normalizes to annual (× 52)
- [ ] Monthly: Normalizes to annual (× 12)
- [ ] Daily: Normalizes to annual (× 260)
- [ ] All use shared France tax engine
- [ ] Results match salary calculator for same annual amount

### Variable Pay Calculators
- [ ] Overtime: Combined with regular pay, not taxed separately
- [ ] Bonus: Marginal tax approach, NOT flat rate
- [ ] Commission: Normalized by frequency, taxed as ordinary income
- [ ] All components included (Income Tax + CSG/CRDS + Social)

---

## 9️⃣ COMMON PITFALLS TO AVOID

### ❌ Wrong: Not Using Family Quotient
```typescript
// WRONG - Direct tax on total income
const tax = calculateTax(totalIncome);
```

### ✅ Correct: Apply Family Quotient System
```typescript
// CORRECT - Divide by family parts
const parts = calculateFamilyParts(maritalStatus, children);
const quotientIncome = totalIncome / parts;
const taxPerPart = calculateTax(quotientIncome);
const totalTax = taxPerPart * parts;
```

### ❌ Wrong: CSG/CRDS on Full Gross
```typescript
// WRONG - Should be on 98.25%
const csg = grossIncome * 0.092;
```

### ✅ Correct: CSG/CRDS on 98.25% of Gross
```typescript
// CORRECT - Apply 98.25% base
const contributionBase = grossIncome * 0.9825;
const csg = contributionBase * 0.092;
```

### ❌ Wrong: Forgetting Standard 10% Deduction
```typescript
// WRONG - Not applying automatic deduction
const taxableIncome = grossIncome;
```

### ✅ Correct: Apply 10% Standard Deduction
```typescript
// CORRECT - Automatic 10% deduction
const deduction = Math.min(Math.max(grossIncome * 0.10, 482), 13522);
const taxableIncome = grossIncome - deduction;
```

### ❌ Wrong: Flat Bonus Tax
```typescript
// WRONG - Never use flat bonus tax
const bonusTax = bonus * 0.30;
```

### ✅ Correct: Marginal Bonus Tax
```typescript
// CORRECT - Calculate actual marginal impact
const withoutBonus = calculateFR(baseSalary);
const withBonus = calculateFR(baseSalary + bonus);
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
   - Always use 2026 French tax rules
   - Update centrally when year changes

3. ❌ **Never ask for tax rates**
   - Income tax: Progressive 0%, 11%, 30%, 41%, 45%
   - CSG: 9.2% on 98.25% of gross
   - CRDS: 0.5% on 98.25% of gross
   - Social contributions: Fixed percentages
   - All automatic

4. ❌ **Never ask for family quotient calculation**
   - Determine from marital status + children automatically
   - Single: 1 part
   - Married: 2 parts
   - First 2 children: +0.5 each
   - 3rd+ children: +1 each

5. ✅ **Three primary tax/contribution components**
   - Income Tax (on net taxable income, with family quotient)
   - CSG/CRDS (on 98.25% of gross)
   - Social Contributions (old-age, pension, APEC)

6. ✅ **Standard deductions apply automatically**
   - 10% professional expense deduction (min €482, max €13,522)
   - Deductible CSG (6.8%) reduces taxable income

7. ✅ **Show all breakdowns**
   - Gross annual
   - Each tax component separately
   - Each social contribution separately
   - Total tax & contributions
   - Net annual, monthly, weekly, daily, hourly
   - Effective tax rate

8. ✅ **Marital status and children matter**
   - Determine family quotient parts
   - Single: 1 part
   - Married: 2 parts (doubles allowances)
   - Children add 0.5 or 1 part each

9. ✅ **French working hours**
   - Standard: 35 hours/week
   - Annual full-time: 1607 hours (includes paid leave)

10. ✅ **Comparison for variable pay**
    - Bonus: Show with/without comparison
    - Commission: Show net commission take-home
    - Overtime: Show regular vs overtime breakdown

---

## 🎯 PRODUCTION READINESS

**Status:** Ready for implementation

**Implementation Priority:**
1. Core tax engine (Income Tax with Family Quotient + CSG/CRDS + Social Contributions)
2. Salary calculator (baseline)
3. Time-based calculators (hourly/weekly/monthly/daily)
4. Variable pay calculators (bonus/overtime/commission)

**Testing Requirements:**
- Verify all example calculations
- Test family quotient calculation for all scenarios
- Test family quotient ceiling (€1,759 per half-part)
- Test standard 10% deduction (min/max)
- Test CSG/CRDS on 98.25% base
- Test social contribution ceilings (tranches)
- Test deductible CSG reduces taxable income

---

**This specification is now LOCKED. All France calculators follow this pattern.**

**Last Updated:** January 14, 2026
**Next Review:** 2027 tax year updates
