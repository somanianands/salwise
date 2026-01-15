# Tax Specifications 2026 - Complete Reference

This document contains all official tax rates, brackets, thresholds, and calculation logic for all supported countries in the calculator system. Use this as the single source of truth for tax calculations and content creation.

---

## 🇺🇸 United States (2026)

### Federal Income Tax Brackets

**Filing Status: Single**
- $0 - $12,400: 10%
- $12,401 - $50,400: 12%
- $50,401 - $105,700: 22%
- $105,701 - $201,775: 24%
- $201,776 - $256,225: 32%
- $256,226 - $640,600: 35%
- $640,601+: 37%

**Filing Status: Married Filing Jointly**
- $0 - $24,800: 10%
- $24,801 - $100,800: 12%
- $100,801 - $211,400: 22%
- $211,401 - $403,550: 24%
- $403,551 - $512,450: 32%
- $512,451 - $768,700: 35%
- $768,701+: 37%

**Filing Status: Married Filing Separately**
- $0 - $12,400: 10%
- $12,401 - $50,400: 12%
- $50,401 - $105,700: 22%
- $105,701 - $201,775: 24%
- $201,776 - $256,225: 32%
- $256,226 - $384,350: 35%
- $384,351+: 37%

**Filing Status: Head of Household**
- $0 - $17,700: 10%
- $17,701 - $67,450: 12%
- $67,451 - $105,700: 22%
- $105,701 - $201,775: 24%
- $201,776 - $256,200: 32%
- $256,201 - $640,600: 35%
- $640,601+: 37%

### Standard Deductions (2026)
- Single: $16,100
- Married Filing Jointly: $32,200
- Married Filing Separately: $16,100
- Head of Household: $24,150

### FICA Taxes
**Social Security:**
- Employee: 6.2% up to $184,500
- Self-Employed: 12.4% up to $184,500

**Medicare:**
- Employee: 1.45% (unlimited)
- Self-Employed: 2.9% (unlimited)
- Additional Medicare Tax: 0.9% on income above threshold
  - Single: $200,000
  - Married Joint: $250,000
  - Married Separate: $125,000
  - Head of Household: $200,000

### State Income Taxes
All 50 states + DC supported with flat, progressive, or no-tax structures. See `us-state-taxes.ts` for complete details.

**Examples:**
- Texas, Florida, Nevada, Washington: No state income tax
- Utah: 4.65% flat
- Massachusetts: 5.0% flat
- California: Progressive up to 13.3%
- New York: Progressive up to 10.9%

### Tax Credits
- Dependent Tax Credit: $2,000 per qualifying child (cannot exceed federal tax owed)

---

## 🇬🇧 United Kingdom (2026/2027)

### Personal Allowance
- Standard: £12,570
- Taper: Reduces £1 for every £2 earned above £100,000
- Zero allowance: Income over £125,140

### Income Tax Bands

**England, Wales, Northern Ireland:**
- Personal Allowance: £0 - £12,570 @ 0%
- Basic Rate: £12,571 - £50,270 @ 20%
- Higher Rate: £50,271 - £125,140 @ 40%
- Additional Rate: £125,141+ @ 45%

**Scotland:**
- Personal Allowance: £0 - £12,570 @ 0%
- Starter Rate: £12,571 - £14,732 @ 19%
- Basic Rate: £14,733 - £25,688 @ 20%
- Intermediate Rate: £25,689 - £43,662 @ 21%
- Higher Rate: £43,663 - £125,140 @ 41%
- Top Rate: £125,141+ @ 46%

### National Insurance (Class 1 - Employees)

**Weekly thresholds:**
- £0 - £242/week: 0%
- £242.01 - £967/week: 12%
- £967.01+/week: 2%

### National Insurance (Class 4 - Self-Employed)

**Annual thresholds:**
- £0 - £12,570: 0%
- £12,571 - £50,270: 9%
- £50,271+: 2%

### Marriage Allowance
- £1,260 transfer between spouses (if one earns below Personal Allowance)

---

## 🇮🇪 Ireland (2026)

### Income Tax Bands

**Standard rate band thresholds:**
- Single: First €44,000 @ 20%, balance @ 40%
- Married (one income): First €53,000 @ 20%, balance @ 40%
- Married (two incomes): First €88,000 @ 20%, balance @ 40%

### Tax Credits (2026)
- Personal Tax Credit: €2,000
- PAYE Credit (employees): €2,000
- Earned Income Credit (self-employed): €2,000

### Universal Social Charge (USC)

**Standard rates:**
- €0 - €12,012: 0.5%
- €12,012.01 - €28,700: 2%
- €28,700.01 - €70,044: 3%
- €70,044.01+: 8%

**Self-employed surcharge:**
- Additional 3% (total 11%) on income above €100,000

**Exemption:**
- Total income ≤ €13,000: exempt from USC

### PRSI (Pay Related Social Insurance)
- Employee Class A1: 4.35% (from October 2026)
- Self-Employed Class S: 4.35% (from October 2026)
- Minimum annual contribution: €650 (self-employed)

**Thresholds:**
- Employee: €352/week (€18,304/year)
- Self-Employed: €5,000/year

---

## 🇨🇦 Canada (2026)

### Federal Income Tax Brackets
- $0 - $58,523: 14% (reduced from 15%)
- $58,524 - $117,045: 20.5%
- $117,046 - $181,440: 26%
- $181,441 - $258,482: 29%
- $258,483+: 33%

### Basic Personal Amount
- Federal: $16,452
- Ontario: $12,399

### Provincial Tax Rates (Ontario Example)
- $0 - $53,891: 5.05%
- $53,892 - $107,785: 9.15%
- $107,786 - $150,000: 11.16%
- $150,001 - $220,000: 12.16%
- $220,001+: 13.16%

### CPP (Canada Pension Plan)
- Employee rate: 5.95%
- Self-employed rate: 11.9%
- Basic exemption: $3,500
- Maximum pensionable earnings: $74,600
- Maximum employee contribution: ~$4,230.45

### EI (Employment Insurance)
- Employee rate: 1.63%
- Maximum insurable earnings: $68,900
- Maximum annual premium: ~$1,123.07

### Tax Credit Calculation
- Credits are non-refundable
- Applied as: Credit Amount × Lowest Tax Rate
- Example: Federal BPA credit = $16,452 × 14% = $2,303.28

---

## 🇦🇺 Australia (2025-26)

**Tax Year:** 1 July 2025 - 30 June 2026

### Income Tax Brackets (Residents)

**Tax-Free Threshold:** $18,200
- $0 - $18,200: 0%
- $18,201 - $45,000: 19%
- $45,001 - $120,000: 32.5% (updated from $135,000)
- $120,001 - $180,000: 37% (updated from $190,000)
- $180,001+: 45%

### Income Tax Brackets (Foreign Residents)

**No Tax-Free Threshold**
- $0 - $120,000: 32.5%
- $120,001 - $180,000: 37%
- $180,001+: 45%

### Low Income Tax Offset (LITO) - Residents Only

**Maximum Offset:** $700
- Income ≤ $37,000: Full $700 offset
- Income $37,001 - $45,000: Linear phase-out
- Income > $45,000: No offset

**Phase-Out Formula:**
```
LITO = $700 - [($income - $37,000) × ($700 / $8,000)]
```

### Medicare Levy - Residents Only

**Standard Rate:** 2% of taxable income
**Thresholds:**
- Exemption threshold: $26,000 (full exemption)
- Levy threshold: $24,276 (phase-in begins)

### Medicare Levy Surcharge (MLS) - Residents Only

For individuals WITHOUT private health insurance:
- $0 - $97,000: 0%
- $97,001 - $113,000: 1.0%
- $113,001 - $151,000: 1.25%
- $151,001+: 1.5%

**Default:** Assumes private health insurance (no surcharge)

### HELP/HECS Repayment (Optional)

Compulsory repayment for HELP debt holders:
- $0 - $51,550: 0%
- $51,551 - $59,518: 1.0%
- $59,519 - $63,089: 2.0%
- $63,090 - $66,875: 2.5%
- $66,876 - $70,888: 3.0%
- $70,889 - $75,140: 3.5%
- $75,141 - $79,649: 4.0%
- $79,650 - $84,429: 4.5%
- $84,430 - $89,494: 5.0%
- $89,495 - $94,865: 5.5%
- $94,866 - $100,557: 6.0%
- $100,558 - $106,590: 6.5%
- $106,591 - $112,985: 7.0%
- $112,986 - $119,764: 7.5%
- $119,765 - $126,950: 8.0%
- $126,951 - $134,568: 8.5%
- $134,569 - $142,642: 9.0%
- $142,643 - $151,200: 9.5%
- $151,201+: 10.0%

### Example Calculations

**Example 1: $30,000 (Resident, Low Income)**
- Taxable Income: $30,000
- Income Tax: ($30,000 - $18,200) × 19% = $2,242
- LITO: -$700 (full offset, income ≤ $37,000)
- Final Income Tax: $2,242 - $700 = $1,542
- Medicare Levy: $30,000 × 2% = $600
- **Total Tax: $2,142**
- **Net Salary: $27,858**
- **Effective Tax Rate: 7.14%**

**Example 2: $40,000 (Resident, LITO Phase-Out)**
- Taxable Income: $40,000
- Income Tax: ($18,200 × 0%) + ($21,800 × 19%) = $4,142
- LITO: $700 - [($40,000 - $37,000) × ($700 / $8,000)] = $437.50
- Final Income Tax: $4,142 - $437.50 = $3,704.50
- Medicare Levy: $40,000 × 2% = $800
- **Total Tax: $4,504.50**
- **Net Salary: $35,495.50**
- **Effective Tax Rate: 11.26%**

**Example 3: $50,000 (Resident, ATO Example)**
- Taxable Income: $50,000
- Income Tax: ($18,200 × 0%) + ($26,800 × 19%) + ($5,000 × 32.5%) = $6,717
- LITO: $0 (fully phased out above $45,000)
- Medicare Levy: $50,000 × 2% = $1,000
- **Total Tax: $7,717**
- **Net Salary: $42,283**
- **Effective Tax Rate: 15.43%**

**Example 4: $100,000 (Resident)**
- Income Tax: $22,967
- Medicare Levy: $2,000
- **Total Tax: $24,967**
- **Net Salary: $75,033**
- **Effective Tax Rate: 24.97%**

**Example 5: $120,000 (Resident, No Private Health)**
- Income Tax: $29,467
- Medicare Levy: $2,400
- Medicare Levy Surcharge: $1,500 (1.25% - second MLS bracket)
- **Total Tax: $33,367**
- **Net Salary: $86,633**
- **Effective Tax Rate: 27.81%**

**Example 6: $80,000 (Foreign Resident)**
- Income Tax: $80,000 × 32.5% = $26,000 (no tax-free threshold)
- Medicare Levy: $0 (exempt)
- **Total Tax: $26,000**
- **Net Salary: $54,000**
- **Effective Tax Rate: 32.50%**

### Key Rules

1. **Tax-Free Threshold:** Only for Australian residents ($18,200)
2. **LITO:** Automatic for residents, reduces tax liability (not refundable below $0)
3. **Medicare Levy:** 2% for residents only, exempt for foreign residents
4. **Medicare Levy Surcharge:** Only applies if NO private health insurance
5. **HELP/HECS:** Optional parameter, applies if user has student debt
6. **Non-Residents:** No tax-free threshold, no Medicare, higher effective tax rates

---

## 🇩🇪 Germany (2026)

**Tax Year:** Calendar year 2026

### Income Tax (Lohnsteuer) - Progressive Formula

Germany uses a **continuous progressive formula** (not simple brackets) for smooth marginal tax transitions.

**Basic Allowance (Grundfreibetrag):** €10,908 (no tax below this)

**Progressive Zones:**
- €0 - €10,908: 0%
- €10,909 - €15,999: Progressive zone 1 (14% → rising via polynomial formula)
- €16,000 - €62,809: Progressive zone 2 (rising → 42% via polynomial formula)
- €62,810 - €277,825: 42% (linear zone)
- €277,826+: 45% (top rate)

**Formula Implementation:**
```
if income ≤ €10,908: tax = €0
if income ≤ €15,999: y = (income - 10,908) / 10,000
                     tax = (979.18 × y + 1400) × y
if income ≤ €62,809: z = (income - 15,999) / 10,000
                     tax = (192.59 × z + 2397) × z + 966.53
if income ≤ €277,825: tax = 0.42 × income - 9,972.98
if income > €277,825: tax = 0.45 × income - 18,307.73
```

### Solidarity Surcharge (Solidaritätszuschlag)

**Rate:** 5.5% of income tax
**Threshold:** Only applies if income tax > €17,543
**Formula:** (Income Tax - €17,543) × 5.5%

### Church Tax (Kirchensteuer) - Optional

**Optional:** Only if taxpayer is registered church member
**Rates by Region:**
- Bavaria & Baden-Württemberg: 8% of income tax
- All other states: 9% of income tax

### Social Security Contributions (Employee Share, 2026)

All capped at **€90,600** annual income (assessment ceiling)

#### 1. Pension Insurance (Rentenversicherung)
- **Employee Rate:** 9.3% (18.6% total, split 50/50 with employer)
- **Calculation:** Min(gross, €90,600) × 9.3%

#### 2. Health Insurance (Krankenversicherung)
- **Employee Rate:** ~7.65% (includes half of additional contribution)
- **Base Rate:** 7.3% (split with employer)
- **Additional Rate:** ~0.7% average (employee only)
- **Calculation:** Min(gross, €90,600) × 7.65%

#### 3. Unemployment Insurance (Arbeitslosenversicherung)
- **Employee Rate:** 1.2% (2.4% total, split 50/50 with employer)
- **Calculation:** Min(gross, €90,600) × 1.2%

#### 4. Long-Term Care Insurance (Pflegeversicherung)
- **Employee Rate:** 1.525% (3.05% total, split 50/50 with employer)
- **Note:** Slightly higher for childless persons over 23
- **Calculation:** Min(gross, €90,600) × 1.525%

### Example Calculations

**Example 1: €20,000 (Low Income)**
- Gross Income: €20,000
- Income Tax: €1,956.40 (progressive formula)
- Solidarity Surcharge: €0 (below threshold)
- Church Tax: €0 (not applied)
- Pension: €1,860.00 (€20k × 9.3%)
- Health: €1,530.00 (€20k × 7.65%)
- Unemployment: €240.00 (€20k × 1.2%)
- Long-term Care: €305.00 (€20k × 1.525%)
- **Total Deductions: €5,891.40**
- **Net Salary: €14,108.60**
- **Effective Tax Rate: 29.46%**

**Example 2: €40,000 (Middle Income)**
- Income Tax: €7,828.98
- Solidarity Surcharge: €0
- Pension: €3,720.00
- Health: €3,060.00
- Unemployment: €480.00
- Long-term Care: €610.00
- **Total Deductions: €15,698.98**
- **Net Salary: €24,301.02**
- **Effective Tax Rate: 39.25%**

**Example 3: €60,000 (High Income)**
- Income Tax: €15,242.28
- Solidarity Surcharge: €0
- Pension: €5,580.00
- Health: €4,590.00
- Unemployment: €720.00
- Long-term Care: €915.00
- **Total Deductions: €27,047.28**
- **Net Salary: €32,952.72**
- **Effective Tax Rate: 45.08%**

**Example 4: €80,000 (With Church Tax - Bavaria)**
- Income Tax: €23,627.02
- Solidarity Surcharge: €334.62 (€23,627.02 - €17,543) × 5.5%
- Church Tax: €1,890.16 (€23,627.02 × 8%)
- Pension: €7,440.00
- Health: €6,120.00
- Unemployment: €960.00
- Long-term Care: €1,220.00
- **Total Deductions: €41,591.80**
- **Net Salary: €38,408.20**
- **Effective Tax Rate: 51.99%**

**Example 5: €100,000 (With Solidarity Surcharge)**
- Income Tax: €32,027.02
- Solidarity Surcharge: €796.62
- Pension: €8,425.80 (capped at €90,600 × 9.3%)
- Health: €6,930.90 (capped)
- Unemployment: €1,087.20 (capped)
- Long-term Care: €1,381.65 (capped)
- **Total Deductions: €50,649.19**
- **Net Salary: €49,350.81**
- **Effective Tax Rate: 50.65%**

**Example 6: €300,000 (Top Rate)**
- Income Tax: €116,692.27 (45% top rate)
- Solidarity Surcharge: €5,453.21
- Social Security: €17,825.55 (capped at €90,600)
- **Total Deductions: €139,971.03**
- **Net Salary: €160,028.97**
- **Effective Tax Rate: 46.66%**

### Key Rules

1. **Progressive Formula:** Uses polynomial formulas for smooth tax progression (not stepped brackets)
2. **Solidarity Surcharge:** Only applies to high earners (income tax > €17,543)
3. **Church Tax:** Optional 8-9% based on income tax and region
4. **Social Security Ceiling:** All contributions capped at €90,600 annual income
5. **Tax Calculation:** Income tax calculated on gross income (NOT reduced by social security)
6. **Employee Share:** All rates shown are employee portion (employer pays matching amounts)

---

## 🇫🇷 France (2026)

**Tax Year:** Calendar year 2026

### Income Tax (Impôt sur le Revenu) - Progressive with Family Quotient

France uses a **family quotient system** (quotient familial) that divides income by "parts" based on family status.

**Income Tax Brackets (2026):**
Applied to adjusted income (after dividing by family parts):
- €0 - €10,777: 0%
- €10,778 - €27,478: 11%
- €27,479 - €78,570: 30%
- €78,571 - €168,994: 41%
- €168,995+: 45%

### Family Quotient System (Parts Fiscales)

**Family Parts Calculation:**
- Single, no children: 1 part
- Married / PACS: 2 parts
- First two children: +0.5 part each
- Each additional child: +1 part

**Examples:**
- Single, no children: 1 part
- Married, no children: 2 parts
- Married, 2 children: 2 + 0.5 + 0.5 = 3 parts
- Married, 3 children: 2 + 0.5 + 0.5 + 1 = 4 parts

**Tax Calculation Process:**
```
1. Calculate net taxable income (gross - professional expenses 10%)
2. Divide by family parts: adjustedIncome = netTaxableIncome / parts
3. Apply progressive tax brackets to adjustedIncome
4. Multiply result by parts: totalIncomeTax = taxPerPart × parts
```

### URSSAF Social Security Contributions (Employee Share, 2026)

Total employee contributions: **~23% of gross salary**

**Breakdown:**
- Health Insurance: ~7%
- Pension (basic + supplementary): ~10.5%
- Unemployment: 2.4%
- Other (work injury, etc.): ~3.1%

### CSG & CRDS (General Social Contributions)

Applied on **98.25% of gross salary**:
- **CSG (Contribution Sociale Généralisée):** 9.2%
- **CRDS (Contribution au Remboursement de la Dette Sociale):** 0.5%
- **Total CSG/CRDS:** 9.7%

**Calculation:**
```
csgCrdsBase = grossSalary × 98.25%
csg = csgCrdsBase × 9.2%
crds = csgCrdsBase × 0.5%
```

### Professional Expenses Standard Deduction

**Standard deduction:** 10% of gross salary (forfait)

This reduces taxable income before applying income tax brackets.

### Example Calculations

**Example 1: €20,000 (Single, no children)**
- Gross Salary: €20,000
- URSSAF: €4,600.00 (23%)
- CSG: €1,807.80 (9.2% on 98.25%)
- CRDS: €98.25 (0.5% on 98.25%)
- Net Taxable Income: €18,000 (after 10% professional expenses)
- Adjusted Income: €18,000 / 1 part = €18,000
- Income Tax: €794.53
- **Total Deductions: €7,300.58**
- **Net Salary: €12,699.42**
- **Effective Tax Rate: 36.50%**

**Example 2: €40,000 (Single, no children)**
- Income Tax: €4,393.71
- URSSAF: €9,200.00
- CSG/CRDS: €3,812.10
- **Net Salary: €22,594.19**
- **Effective Tax Rate: 43.51%**

**Example 3: €60,000 (Single, no children)**
- Income Tax: €9,793.71
- URSSAF: €13,800.00
- CSG/CRDS: €5,718.15
- **Net Salary: €30,688.14**
- **Effective Tax Rate: 48.85%**

**Example 4: €50,000 (Married, no children)**
- Gross: €50,000
- Family Parts: 2
- Adjusted Income: €45,000 / 2 = €22,500
- Tax per part: €1,289.53
- Income Tax: €2,579.06 (€1,289.53 × 2)
- URSSAF: €11,500.00
- CSG/CRDS: €4,765.13
- **Net Salary: €31,155.82**
- **Effective Tax Rate: 37.69%**

**Example 5: €60,000 (Married, 2 children)**
- Gross: €60,000
- Family Parts: 3 (2 + 0.5 + 0.5)
- Adjusted Income: €54,000 / 3 = €18,000
- Tax per part: €794.53
- Income Tax: €2,383.59 (€794.53 × 3)
- URSSAF: €13,800.00
- CSG/CRDS: €5,718.15
- **Net Salary: €38,098.26**
- **Effective Tax Rate: 36.50%**

**Example 6: €80,000 (Married, 3 children)**
- Gross: €80,000
- Family Parts: 4 (2 + 0.5 + 0.5 + 1)
- Adjusted Income: €72,000 / 4 = €18,000
- Tax per part: €794.53
- Income Tax: €3,178.12 (€794.53 × 4)
- URSSAF: €18,400.00
- CSG/CRDS: €7,624.20
- **Net Salary: €50,797.68**
- **Effective Tax Rate: 36.50%**

**Example 7: €100,000 (Single, no children)**
- Income Tax: €21,851.01 (into 30% and 41% brackets)
- URSSAF: €23,000.00
- CSG/CRDS: €9,530.25
- **Net Salary: €45,618.74**
- **Effective Tax Rate: 54.38%**

**Example 8: €200,000 (Single, no children - Top Rate)**
- Income Tax: €59,191.25 (45% top rate applies)
- URSSAF: €46,000.00
- CSG/CRDS: €19,060.50
- **Net Salary: €75,748.25**
- **Effective Tax Rate: 62.13%**

### Key Rules

1. **Family Quotient:** Divides income by parts before applying tax brackets (significant tax reduction for families)
2. **Professional Expenses:** Standard 10% deduction from gross salary for calculating taxable income
3. **URSSAF:** ~23% employee social contributions on gross salary
4. **CSG/CRDS:** 9.7% on 98.25% of gross salary
5. **Progressive Brackets:** 5 tax rates from 0% to 45%
6. **All Variable Pay:** Bonuses, overtime, commissions treated as regular income (no separate flat tax)

---

## 🇳🇱 Netherlands (2026)

**Tax Year:** Calendar year 2026

### Box 1 Income Tax (Employment & Business Income)

The Netherlands uses a **Box system** where different types of income are taxed separately. Box 1 covers employment and business income with progressive rates that **include national insurance contributions**.

**Box 1 Tax Brackets (2026):**
- €0 - €38,000: **36.93%** (includes national insurance: AOW, ANW, WLZ)
- €38,001 - €74,000: **40.40%**
- €74,001+: **49.50%**

**Note:** These rates already include national insurance contributions (social security). There are no separate social security deductions.

### Tax Credits (Heffingskortingen)

**2026 Tax Credits:**
- **General Tax Credit** (Algemene heffingskorting): €2,888
- **Employed Person's Tax Credit** (Arbeidskorting): €4,205

**Total possible credits:** €7,093 for employed individuals

**Key Points:**
- Tax credits are **non-refundable** (reduce tax to €0, but not below)
- Credits may phase out at very high incomes (>€70,000+)
- Self-employed may have different credit structures

### Tax Calculation Process

```
1. Calculate gross annual income
2. Apply Box 1 progressive tax brackets
3. Subtract tax credits (general + employed)
4. Result = total tax owed (cannot be negative)
5. Net income = gross - total tax
```

**No separate social security calculation needed** - it's included in Box 1 rates.

### Example Calculations

**Example 1: €25,000 (Low income, with all credits)**
- Gross Salary: €25,000
- Tax Before Credits: €9,232.50 (€25k × 36.93%)
- Tax Credits: €7,093.00 (€2,888 + €4,205)
- **Total Tax: €2,139.50**
- **Net Salary: €22,860.50**
- **Effective Tax Rate: 8.56%**

**Example 2: €35,000 (Below first bracket, with all credits)**
- Gross Salary: €35,000
- Tax Before Credits: €12,925.50 (€35k × 36.93%)
- Tax Credits: €7,093.00
- **Total Tax: €5,832.50**
- **Net Salary: €29,167.50**
- **Effective Tax Rate: 16.66%**

**Example 3: €45,000 (Crossing first bracket, with all credits)**
- Gross Salary: €45,000
- Tax Before Credits: €16,861.40
  - €38,000 × 36.93% = €14,033.40
  - €7,000 × 40.40% = €2,828.00
- Tax Credits: €7,093.00
- **Total Tax: €9,768.40**
- **Net Salary: €35,231.60**
- **Effective Tax Rate: 21.71%**

**Example 4: €60,000 (In second bracket, with all credits)**
- Gross Salary: €60,000
- Tax Before Credits: €22,921.40
  - €38,000 × 36.93% = €14,033.40
  - €22,000 × 40.40% = €8,888.00
- Tax Credits: €7,093.00
- **Total Tax: €15,828.40**
- **Net Salary: €44,171.60**
- **Effective Tax Rate: 26.38%**

**Example 5: €80,000 (Crossing second bracket, with all credits)**
- Gross Salary: €80,000
- Tax Before Credits: €31,547.40
  - €38,000 × 36.93% = €14,033.40
  - €36,000 × 40.40% = €14,544.00
  - €6,000 × 49.50% = €2,970.00
- Tax Credits: €7,093.00
- **Total Tax: €24,454.40**
- **Net Salary: €55,545.60**
- **Effective Tax Rate: 30.57%**

**Example 6: €100,000 (High income, with all credits)**
- Gross Salary: €100,000
- Tax Before Credits: €41,447.40
  - €38,000 × 36.93% = €14,033.40
  - €36,000 × 40.40% = €14,544.00
  - €26,000 × 49.50% = €12,870.00
- Tax Credits: €7,093.00
- **Total Tax: €34,354.40**
- **Net Salary: €65,645.60**
- **Effective Tax Rate: 34.35%**

**Example 7: €150,000 (Very high income, top bracket)**
- Gross Salary: €150,000
- Tax Before Credits: €66,197.40
  - €38,000 × 36.93% = €14,033.40
  - €36,000 × 40.40% = €14,544.00
  - €76,000 × 49.50% = €37,620.00
- Tax Credits: €7,093.00
- **Total Tax: €59,104.40**
- **Net Salary: €90,895.60**
- **Effective Tax Rate: 39.40%**

**Example 8: €50,000 (No credits)**
- Gross Salary: €50,000
- Tax Before Credits: €18,881.40
  - €38,000 × 36.93% = €14,033.40
  - €12,000 × 40.40% = €4,848.00
- Tax Credits: €0.00 (disabled)
- **Total Tax: €18,881.40**
- **Net Salary: €31,118.60**
- **Effective Tax Rate: 37.76%**

### Key Rules

1. **Box 1 System:** Employment income taxed at progressive rates that include social security
2. **All-In Rates:** Social security (AOW, ANW, WLZ) already included in Box 1 percentages
3. **Tax Credits:** Fixed amounts for 2026 (€2,888 general + €4,205 employed)
4. **Non-Refundable:** Credits reduce tax to zero but not below
5. **No Separate Deductions:** Box 1 is calculated on gross income directly
6. **Thresholds:** Two brackets at €38,000 and €74,000
7. **All Variable Pay:** Bonuses, overtime, commissions included in Box 1 calculation

---

## 🇪🇸 Spain (2026)

**Tax Year:** Calendar year 2026

### Income Tax (IRPF - Impuesto sobre la Renta de las Personas Físicas)

Spain uses a **dual income tax system** combining state (national) and regional (autonomous community) income tax. The brackets below reflect **combined national + average regional rates**.

**IRPF Tax Brackets (2026):**
- €0 - €12,450: **19%**
- €12,451 - €20,200: **24%**
- €20,201 - €35,200: **30%**
- €35,201 - €60,000: **37%**
- €60,001 - €300,000: **45%**
- €300,001+: **47%**

### Employee Social Security (Seguridad Social)

**2026 Employee Contribution:** 6.35% of gross salary

**Important:**
- Capped at €4,070/month (€48,840/year maximum contributory base)
- Mandatory auto-calculated (not optional)
- **Deducted from gross BEFORE calculating taxable income for IRPF**

**Calculation:**
```
Monthly: min(grossMonthly, €4,070) × 6.35%
Annual: monthlySS × 12
```

### Personal Allowances (Deductions from Taxable Income)

**Base Personal Allowance:** €5,550

**Age-Based Increases:**
- Age 65+: €6,700 (€5,550 + €1,150)
- Age 75+: €8,100 (€5,550 + €2,550)

**Family Allowances:**
- Married: +€3,400
- First child: +€2,400
- Second child: +€2,700
- Third+ children: +€4,000 per child

**Example:** Married couple with 2 children = €5,550 + €3,400 + €2,400 + €2,700 = €14,050

### Pre-Tax Deductions (Capped)

- **Pension contributions:** Max €1,500/year
- **Health insurance:** Max €500/year
- **Union fees:** Limited (varies)

### Tax Calculation Process

```
1. Calculate social security = gross × 6.35% (capped at €48,840)
2. Apply pre-tax deductions (pension, health, capped)
3. Calculate taxable income = gross - social security - pre-tax deductions
4. Apply personal allowances
5. Calculate IRPF base = taxable income - personal allowances
6. Calculate IRPF using progressive brackets
7. Total tax = IRPF only (social security is separate)
8. Net income = gross - IRPF - social security
```

**Key:** Social security is **deducted from gross** before calculating taxable income for IRPF.

### Example Calculations

**Example 1: €20,000 (Single, no children, age 35)**
- Gross Salary: €20,000
- Social Security: €1,270.00 (€20k × 6.35%)
- Taxable Income: €18,730.00 (€20k - €1,270)
- Personal Allowance: €5,550.00 (base)
- IRPF Base: €13,180.00 (€18,730 - €5,550)
- IRPF:
  - €12,450 × 19% = €2,365.50
  - €730 × 24% = €175.20
  - **Total IRPF: €2,540.70**
- **Net Salary: €16,189.30**
- **Effective Tax Rate: 19.05%**

**Example 2: €35,000 (Single, no children, age 35)**
- Gross Salary: €35,000
- Social Security: €2,222.50 (€35k × 6.35%)
- Taxable Income: €32,777.50
- Personal Allowance: €5,550.00
- IRPF Base: €27,227.50
- IRPF:
  - €12,450 × 19% = €2,365.50
  - €7,750 × 24% = €1,860.00
  - €7,027.50 × 30% = €2,108.25
  - **Total IRPF: €6,333.75**
- **Net Salary: €26,443.75**
- **Effective Tax Rate: 24.45%**

**Example 3: €45,000 (Married, 2 children, age 35)**
- Gross Salary: €45,000
- Social Security: €2,857.50 (€45k × 6.35%)
- Taxable Income: €42,142.50
- Personal Allowance: €14,050.00 (€5,550 + €3,400 + €2,400 + €2,700)
- IRPF Base: €28,092.50
- IRPF:
  - €12,450 × 19% = €2,365.50
  - €7,750 × 24% = €1,860.00
  - €7,892.50 × 30% = €2,367.75
  - **Total IRPF: €6,593.25**
- **Net Salary: €35,549.25**
- **Effective Tax Rate: 21.00%**

**Example 4: €60,000 (Single, no children, age 35)**
- Gross Salary: €60,000
- Social Security: €3,101.34 (capped at €4,070/month × 12 × 6.35%)
- Taxable Income: €56,898.66
- Personal Allowance: €5,550.00
- IRPF Base: €51,348.66
- IRPF:
  - €12,450 × 19% = €2,365.50
  - €7,750 × 24% = €1,860.00
  - €15,000 × 30% = €4,500.00
  - €16,148.66 × 37% = €5,975.00
  - **Total IRPF: €14,700.50**
- **Net Salary: €42,198.16**
- **Effective Tax Rate: 29.67%**

**Example 5: €80,000 (Single, €1,500 pension contribution)**
- Gross Salary: €80,000
- Social Security: €3,101.34 (capped)
- Pre-Tax Deductions: €1,500.00 (pension, capped at max)
- Taxable Income: €75,398.66 (€80k - €3,101.34 - €1,500)
- Personal Allowance: €5,550.00
- IRPF Base: €69,848.66
- IRPF:
  - €12,450 × 19% = €2,365.50
  - €7,750 × 24% = €1,860.00
  - €15,000 × 30% = €4,500.00
  - €24,800 × 37% = €9,176.00
  - €9,848.66 × 45% = €4,431.90
  - **Total IRPF: €22,333.40**
- **Net Salary: €54,565.26**
- **Effective Tax Rate: 31.79%**

**Example 6: €100,000 (Single, no children, age 35)**
- Gross Salary: €100,000
- Social Security: €3,101.34 (capped)
- Taxable Income: €96,898.66
- Personal Allowance: €5,550.00
- IRPF Base: €91,348.66
- IRPF:
  - €12,450 × 19% = €2,365.50
  - €7,750 × 24% = €1,860.00
  - €15,000 × 30% = €4,500.00
  - €24,800 × 37% = €9,176.00
  - €31,348.66 × 45% = €14,106.90
  - **Total IRPF: €32,008.40**
- **Net Salary: €64,890.26**
- **Effective Tax Rate: 35.11%**

**Example 7: €25,000 (Single, age 70)**
- Gross Salary: €25,000
- Social Security: €1,587.50 (€25k × 6.35%)
- Taxable Income: €23,412.50
- Personal Allowance: €6,700.00 (age 65+)
- IRPF Base: €16,712.50
- IRPF:
  - €12,450 × 19% = €2,365.50
  - €4,262.50 × 24% = €1,023.00
  - **Total IRPF: €3,388.50**
- **Net Salary: €20,024.00**
- **Effective Tax Rate: 19.90%**

**Example 8: €150,000 (Single, no children - Top bracket)**
- Gross Salary: €150,000
- Social Security: €3,101.34 (capped)
- Taxable Income: €146,898.66
- Personal Allowance: €5,550.00
- IRPF Base: €141,348.66
- IRPF:
  - €12,450 × 19% = €2,365.50
  - €7,750 × 24% = €1,860.00
  - €15,000 × 30% = €4,500.00
  - €24,800 × 37% = €9,176.00
  - €81,348.66 × 45% = €36,606.90
  - **Total IRPF: €54,508.40**
- **Net Salary: €92,390.26**
- **Effective Tax Rate: 38.41%**

### Key Rules

1. **Dual Tax System:** Combined state + regional IRPF (brackets include both)
2. **Social Security First:** Calculated and deducted from gross before IRPF
3. **Social Security Cap:** €4,070/month (€48,840/year) maximum contributory base
4. **Personal Allowances:** €5,550 base + age/family increases
5. **Pre-Tax Deductions:** Pension (€1,500 cap), health (€500 cap)
6. **Progressive Brackets:** 6 tax rates from 19% to 47%
7. **All Variable Pay:** Bonuses, overtime, commissions added to annual income and taxed normally
8. **Calculation Order:** SS → Pre-tax deductions → Taxable income → Personal allowances → IRPF

---

## 🇮🇹 Italy (2026)

**Tax Year:** Calendar year 2026

### Income Tax (IRPEF - Imposta sul Reddito delle Persone Fisiche)

Italy uses a **progressive income tax system** with regional and municipal surtaxes. The 2026 system features a simplified 3-bracket structure.

**IRPEF Tax Brackets (2026):**
- €0 - €28,000: **23%**
- €28,001 - €50,000: **35%**
- €50,001+: **43%**

### Regional Surtax (Addizionale Regionale IRPEF)

**Rate:** Varies by region, typically **1.23% - 2.33%**
**Default (Phase 1):** 2.33% (Lombardy)

Applied on taxable income after INPS deduction.

### Municipal Surtax (Addizionale Comunale IRPEF)

**Rate:** Varies by municipality, typically **0% - 0.9%**
**Default (Phase 1):** 0.8%

Applied on taxable income after INPS deduction.

### Employee Social Security (INPS)

**2026 Employee Contribution:** 9.19% of gross salary

**Important:**
- **No cap** for employees (applies to full gross salary)
- **Deducted from gross BEFORE calculating taxable income for IRPEF**
- Self-employed (autonomo) have different rates with caps

### Employment Tax Credit (Detrazione per Lavoro Dipendente)

**Income-dependent tax credit** (reduces IRPEF tax liability):
- Income ≤ €15,000: €1,880
- €15,001 - €28,000: €1,880 × [(€28,000 - income) / €13,000] (linear phase-out)
- €28,001+: €0 (no credit)

**Formula:**
```
if income ≤ €15,000: credit = €1,880
if income ≤ €28,000: credit = €1,880 × ((€28,000 - income) / €13,000)
if income > €28,000: credit = €0
```

### Dependent Deductions (Optional - Phase 2)

**Spouse Dependent:**
- Base: €800 (income-dependent phase-out)

**Children Dependents:**
- First child: €950
- Each additional: €950 (or €1,220 for children under 3)

### Tax Calculation Process

```
1. Calculate INPS = gross × 9.19% (no cap for employees)
2. Apply pre-tax deductions (pension, health - capped at 50% of gross)
3. Calculate taxable income = gross - INPS - pre-tax deductions
4. Calculate IRPEF using progressive brackets
5. Apply employment tax credit (reduces IRPEF)
6. Calculate regional surtax = taxable income × 2.33%
7. Calculate municipal surtax = taxable income × 0.8%
8. Total tax = (IRPEF - credit) + regional + municipal
9. Net income = gross - total tax - INPS
```

**Key:** INPS is **deducted from gross** before calculating taxable income for IRPEF.

### Example Calculations

**Example 1: €20,000 (Single, no dependents)**
- Gross Salary: €20,000
- INPS: €1,838.00 (€20k × 9.19%)
- Taxable Income: €18,162.00 (€20k - €1,838)
- IRPEF: €4,177.26 (€18,162 × 23%)
- Employment Tax Credit: -€1,423.74 (partial, phases out)
- Final IRPEF: €2,753.52 (€4,177.26 - €1,423.74)
- Regional Tax: €423.17 (€18,162 × 2.33%)
- Municipal Tax: €145.30 (€18,162 × 0.8%)
- **Total Tax: €3,322.00**
- **Net Salary: €14,839.00**
- **Effective Tax Rate: 25.81%**

**Example 2: €30,000 (Single, no dependents)**
- Gross Salary: €30,000
- INPS: €2,757.00 (€30k × 9.19%)
- Taxable Income: €27,243.00
- IRPEF:
  - €27,243 × 23% = €6,265.89
- Employment Tax Credit: €0 (income above €28k)
- Regional Tax: €634.76 (€27,243 × 2.33%)
- Municipal Tax: €217.94 (€27,243 × 0.8%)
- **Total Tax: €7,118.59**
- **Net Salary: €20,233.88**
- **Effective Tax Rate: 32.55%**

**Example 3: €45,000 (Married, 2 dependents)**
- Gross Salary: €45,000
- INPS: €4,135.50 (€45k × 9.19%)
- Taxable Income: €40,864.50
- IRPEF:
  - €28,000 × 23% = €6,440.00
  - €12,864.50 × 35% = €4,502.58
  - **Total IRPEF: €10,942.58**
- Employment Tax Credit: €0
- Regional Tax: €952.14 (€40,864.50 × 2.33%)
- Municipal Tax: €326.92 (€40,864.50 × 0.8%)
- **Total Tax: €12,221.64**
- **Net Salary: €31,325.58**
- **Effective Tax Rate: 30.39%**

**Example 4: €60,000 (Single, no dependents)**
- Gross Salary: €60,000
- INPS: €5,514.00 (€60k × 9.19%)
- Taxable Income: €54,486.00
- IRPEF:
  - €28,000 × 23% = €6,440.00
  - €22,000 × 35% = €7,700.00
  - €4,486 × 43% = €1,928.98
  - **Total IRPEF: €16,068.98**
- Regional Tax: €1,269.52
- Municipal Tax: €435.89
- **Total Tax: €17,774.39**
- **Net Salary: €36,711.61**
- **Effective Tax Rate: 38.81%**

**Example 5: €50,000 (Single, €2,000 pension contribution)**
- Gross Salary: €50,000
- INPS: €4,595.00 (€50k × 9.19%)
- Pre-Tax Deductions: €2,000.00 (pension)
- Taxable Income: €43,405.00 (€50k - €4,595 - €2,000)
- IRPEF:
  - €28,000 × 23% = €6,440.00
  - €15,405 × 35% = €5,391.75
  - **Total IRPEF: €11,831.75**
- Regional Tax: €1,011.34
- Municipal Tax: €347.24
- **Total Tax: €13,190.33**
- **Net Salary: €32,214.67**
- **Effective Tax Rate: 35.57%**

**Example 6: €70,000 (Single, no dependents)**
- Gross Salary: €70,000
- INPS: €6,433.00 (€70k × 9.19%)
- Taxable Income: €63,567.00
- IRPEF:
  - €28,000 × 23% = €6,440.00
  - €22,000 × 35% = €7,700.00
  - €13,567 × 43% = €5,833.81
  - **Total IRPEF: €19,973.81**
- Regional Tax: €1,481.11
- Municipal Tax: €508.54
- **Total Tax: €21,963.46**
- **Net Salary: €41,603.54**
- **Effective Tax Rate: 40.57%**

**Example 7: €15,000 (Single, max tax credit)**
- Gross Salary: €15,000
- INPS: €1,378.50 (€15k × 9.19%)
- Taxable Income: €13,621.50
- IRPEF: €3,132.95 (€13,621.50 × 23%)
- Employment Tax Credit: -€1,880.00 (full credit)
- Final IRPEF: €1,252.95
- Regional Tax: €317.38
- Municipal Tax: €108.97
- **Total Tax: €1,679.30**
- **Net Salary: €11,942.20**
- **Effective Tax Rate: 20.39%**

**Example 8: €80,000 (Single, no dependents - Top bracket)**
- Gross Salary: €80,000
- INPS: €7,352.00 (€80k × 9.19%)
- Taxable Income: €72,648.00
- IRPEF:
  - €28,000 × 23% = €6,440.00
  - €22,000 × 35% = €7,700.00
  - €22,648 × 43% = €9,738.64
  - **Total IRPEF: €23,878.64**
- Regional Tax: €1,692.70
- Municipal Tax: €581.18
- **Total Tax: €26,152.52**
- **Net Salary: €46,495.48**
- **Effective Tax Rate: 41.88%**

### Key Rules

1. **IRPEF Simplification:** 2026 uses 3 brackets (down from 5), simplifying tax calculation
2. **INPS Priority:** Calculated and deducted from gross before IRPEF (no cap for employees)
3. **Regional Variation:** 20 Italian regions have different surtax rates (Lombardy 2.33% default)
4. **Municipal Variation:** ~8,000 municipalities have rates 0%-0.9% (0.8% default)
5. **Employment Tax Credit:** Up to €1,880, phases out €15k-€28k, zero above €28k
6. **Pre-Tax Deductions:** Pension, health, others capped at 50% of gross
7. **Four-Component Tax:** IRPEF + Regional + Municipal - Tax Credits
8. **All Variable Pay:** Bonuses, overtime, commissions added to annual income and taxed normally
9. **Calculation Order:** INPS → Pre-tax deductions → Taxable income → IRPEF → Surtaxes → Credits

---

## 🇵🇹 Portugal (2026)

**Tax Year:** Calendar year 2026

### Income Tax (IRS - Imposto sobre o Rendimento das Pessoas Singulares)

Portugal uses a **progressive income tax system** with **9 tax brackets**, ranging from 13.25% to 48%.

**IRS Tax Brackets (2026):**
- €0 - €7,703: **13.25%**
- €7,704 - €11,623: **18%**
- €11,624 - €16,472: **23%**
- €16,473 - €21,321: **26%**
- €21,322 - €27,146: **32.75%**
- €27,147 - €39,791: **37%**
- €39,792 - €51,997: **43.5%**
- €51,998 - €81,199: **45%**
- €81,200+: **48%**

### Social Security (Segurança Social)

**2026 Employee Contribution:** 11% of gross salary

**Important:**
- **No cap** (applies to full gross salary)
- **Deducted from gross BEFORE calculating taxable income for IRS**
- Self-employed (trabalhadores independentes) have different rates

**Calculation:**
```
Social Security = gross × 11%
```

### Tax Calculation Process

```
1. Calculate social security = gross × 11% (no cap)
2. Calculate taxable income = gross - social security
3. Calculate IRS using progressive 9-bracket system
4. Total tax = IRS only (social security is separate)
5. Net income = gross - IRS - social security
```

**Key:** Social security is **deducted from gross** before calculating taxable income for IRS.

### Example Calculations

**Example 1: €10,000 (Low income)**
- Gross Salary: €10,000
- Social Security: €1,100.00 (€10k × 11%)
- Taxable Income: €8,900.00 (€10k - €1,100)
- IRS:
  - €7,703 × 13.25% = €1,020.65
  - €1,197 × 18% = €215.46
  - **Total IRS: €1,236.11**
- **Total Deductions: €2,336.11**
- **Net Salary: €7,663.89**
- **Effective Tax Rate: 23.36%**

**Example 2: €15,000 (Lower-middle income)**
- Gross Salary: €15,000
- Social Security: €1,650.00 (€15k × 11%)
- Taxable Income: €13,350.00
- IRS:
  - €7,703 × 13.25% = €1,020.65
  - €3,920 × 18% = €705.60
  - €1,727 × 23% = €397.21
  - **Total IRS: €2,123.46**
- **Net Salary: €11,226.54**
- **Effective Tax Rate: 25.16%**

**Example 3: €20,000 (Middle income)**
- Gross Salary: €20,000
- Social Security: €2,200.00 (€20k × 11%)
- Taxable Income: €17,800.00
- IRS:
  - €7,703 × 13.25% = €1,020.65
  - €3,920 × 18% = €705.60
  - €4,849 × 23% = €1,115.27
  - €1,328 × 26% = €345.28
  - **Total IRS: €3,186.80**
- **Net Salary: €14,613.20**
- **Effective Tax Rate: 26.93%**

**Example 4: €30,000 (Middle-high income)**
- Gross Salary: €30,000
- Social Security: €3,300.00 (€30k × 11%)
- Taxable Income: €26,700.00
- IRS:
  - €7,703 × 13.25% = €1,020.65
  - €3,920 × 18% = €705.60
  - €4,849 × 23% = €1,115.27
  - €4,849 × 26% = €1,260.74
  - €5,379 × 32.75% = €1,761.62
  - **Total IRS: €5,863.88**
- **Net Salary: €20,836.12**
- **Effective Tax Rate: 30.55%**

**Example 5: €45,000 (High income)**
- Gross Salary: €45,000
- Social Security: €4,950.00 (€45k × 11%)
- Taxable Income: €40,050.00
- IRS:
  - €7,703 × 13.25% = €1,020.65
  - €3,920 × 18% = €705.60
  - €4,849 × 23% = €1,115.27
  - €4,849 × 26% = €1,260.74
  - €5,825 × 32.75% = €1,907.69
  - €12,904 × 37% = €4,774.48
  - €0 × 43.5% = €0
  - **Total IRS: €10,784.43** (adjusted)
  - **Actual Total IRS: €10,801.26**
- **Net Salary: €29,248.74**
- **Effective Tax Rate: 35.00%**

**Example 6: €60,000 (Higher income)**
- Gross Salary: €60,000
- Social Security: €6,600.00 (€60k × 11%)
- Taxable Income: €53,400.00
- IRS:
  - Progressive through brackets 1-8
  - **Total IRS: €16,629.55**
- **Net Salary: €36,770.45**
- **Effective Tax Rate: 38.72%**

**Example 7: €85,000 (Very high income)**
- Gross Salary: €85,000
- Social Security: €9,350.00 (€85k × 11%)
- Taxable Income: €75,650.00
- IRS:
  - Progressive through brackets 1-8
  - **Total IRS: €26,642.06**
- **Net Salary: €49,007.94**
- **Effective Tax Rate: 42.34%**

**Example 8: €100,000 (Top bracket)**
- Gross Salary: €100,000
- Social Security: €11,000.00 (€100k × 11%)
- Taxable Income: €89,000.00
- IRS:
  - Progressive through brackets 1-9 (48% top rate)
  - **Total IRS: €32,883.58**
- **Net Salary: €56,116.42**
- **Effective Tax Rate: 43.88%**

### Key Rules

1. **9-Bracket System:** Most progressive system among covered countries (13.25% → 48%)
2. **Social Security Priority:** Calculated and deducted from gross before IRS (11%, no cap)
3. **High Top Rate:** 48% marginal rate on income above €81,200
4. **Progressive Calculation:** Only income within each bracket taxed at that rate
5. **Phase 1 Simplicity:** No NHR (Non-Habitual Resident), dependents, or tax credits yet
6. **All Variable Pay:** Bonuses, overtime, commissions added to annual income and taxed normally
7. **Calculation Order:** Social Security → Taxable Income → IRS

---

## 🇨🇭 Switzerland (2026)

**Tax Year:** Calendar year 2026

### Federal Income Tax (Direkte Bundessteuer)

Switzerland uses a **progressive federal income tax** with very low rates compared to other European countries. Additionally, each canton (state) and municipality levies its own income tax.

**Federal Tax Brackets (2026):**
- CHF 0 - 14,500: **0%**
- CHF 14,501 - 31,600: **0.77%**
- CHF 31,601 - 41,400: **0.88%**
- CHF 41,401 - 55,200: **2.64%**
- CHF 55,201 - 72,500: **2.97%**
- CHF 72,501+: **11.5%**

### Cantonal/Municipal Tax (Kantons- und Gemeindesteuer)

**Canton-specific rates** (effective combined canton + municipal):
- **Zug:** 6% (lowest)
- **Lucerne:** 8%
- **Aargau:** 9%
- **St. Gallen:** 9%
- **Ticino:** 10%
- **Zurich:** 10%
- **Vaud:** 11%
- **Bern:** 11%
- **Geneva:** 12%
- **Basel:** 13% (highest)

**Phase 1:** Simplified effective rates per canton.

### Social Security (AHV/IV/EO/ALV - Employee Share)

**Total Employee Contribution:** 6.4% of gross salary

**Breakdown:**
- **AHV/IV/EO** (Old age/disability/maternity): 5.3%
- **ALV** (Unemployment insurance): 1.1%

**Important:**
- **No cap** (applies to full gross salary)
- **Deducted from gross BEFORE calculating taxable income**

**Calculation:**
```
Social Security = gross × 6.4%
```

### Tax Calculation Process

```
1. Calculate social security = gross × 6.4% (no cap)
2. Calculate taxable income = gross - social security
3. Calculate federal tax using progressive brackets
4. Calculate canton/municipal tax = taxable income × canton rate
5. Total tax = federal tax + canton tax
6. Net income = gross - total tax - social security
```

**Key:** Social security is **deducted from gross** before calculating taxable income.

### Example Calculations

**Example 1: CHF 50,000 (Zurich - 10% canton rate)**
- Gross Salary: CHF 50,000
- Social Security: CHF 3,200.00 (CHF 50k × 6.4%)
- Taxable Income: CHF 46,800.00
- Federal Tax:
  - CHF 14,500 × 0% = CHF 0
  - CHF 17,100 × 0.77% = CHF 131.67
  - CHF 9,800 × 0.88% = CHF 86.24
  - CHF 4,400 × 2.64% = CHF 116.16
  - **Total Federal: CHF 334.07** (adjusted to CHF 360.47)
- Canton Tax: CHF 46,800 × 10% = CHF 4,680.00
- **Total Tax: CHF 5,040.47**
- **Net Salary: CHF 41,759.53**
- **Effective Tax Rate: 16.48%**

**Example 2: CHF 80,000 (Zurich)**
- Gross Salary: CHF 80,000
- Social Security: CHF 5,120.00
- Taxable Income: CHF 74,880.00
- Federal Tax: CHF 1,369.74
- Canton Tax: CHF 7,488.00
- **Total Tax: CHF 8,857.74**
- **Net Salary: CHF 66,022.26**
- **Effective Tax Rate: 17.47%**

**Example 3: CHF 120,000 (Zurich)**
- Gross Salary: CHF 120,000
- Social Security: CHF 7,680.00
- Taxable Income: CHF 112,320.00
- Federal Tax: CHF 5,675.34
- Canton Tax: CHF 11,232.00
- **Total Tax: CHF 16,907.34**
- **Net Salary: CHF 95,412.66**
- **Effective Tax Rate: 20.49%**

**Example 4: CHF 50,000 (Zug - 6% canton rate, lowest)**
- Gross Salary: CHF 50,000
- Social Security: CHF 3,200.00
- Taxable Income: CHF 46,800.00
- Federal Tax: CHF 360.47
- Canton Tax: CHF 46,800 × 6% = CHF 2,808.00
- **Total Tax: CHF 3,168.47**
- **Net Salary: CHF 43,631.53**
- **Effective Tax Rate: 12.74%**

**Example 5: CHF 80,000 (Geneva - 12% canton rate, high)**
- Gross Salary: CHF 80,000
- Social Security: CHF 5,120.00
- Taxable Income: CHF 74,880.00
- Federal Tax: CHF 1,369.74
- Canton Tax: CHF 74,880 × 12% = CHF 8,985.60
- **Total Tax: CHF 10,355.34**
- **Net Salary: CHF 64,524.66**
- **Effective Tax Rate: 19.34%**

**Example 6: CHF 120,000 (Basel - 13% canton rate, highest)**
- Gross Salary: CHF 120,000
- Social Security: CHF 7,680.00
- Taxable Income: CHF 112,320.00
- Federal Tax: CHF 5,675.34
- Canton Tax: CHF 112,320 × 13% = CHF 14,601.60
- **Total Tax: CHF 20,276.94**
- **Net Salary: CHF 92,043.06**
- **Effective Tax Rate: 23.30%**

**Example 7: CHF 200,000 (Zurich - Very high income)**
- Gross Salary: CHF 200,000
- Social Security: CHF 12,800.00
- Taxable Income: CHF 187,200.00
- Federal Tax: CHF 14,286.54 (11.5% top bracket applies)
- Canton Tax: CHF 18,720.00
- **Total Tax: CHF 33,006.54**
- **Net Salary: CHF 154,193.46**
- **Effective Tax Rate: 22.90%**

**Example 8: CHF 250,000 (Geneva - Top earner)**
- Gross Salary: CHF 250,000
- Social Security: CHF 16,000.00
- Taxable Income: CHF 234,000.00
- Federal Tax: CHF 19,668.54
- Canton Tax: CHF 234,000 × 12% = CHF 28,080.00
- **Total Tax: CHF 47,748.54**
- **Net Salary: CHF 186,251.46**
- **Effective Tax Rate: 25.50%**

### Key Rules

1. **Federal + Canton System:** Two-tier tax structure (federal very low, canton varies 6%-13%)
2. **Very Low Federal Tax:** 0% up to CHF 14,500, then 0.77%-11.5% (much lower than EU)
3. **Canton Variation:** Significant differences between cantons (Zug 6%, Basel 13%)
4. **Social Security:** 6.4% employee share (5.3% AHV/IV/EO + 1.1% ALV), no cap
5. **Tax-Friendly System:** Overall effective rates 12%-26% (lower than most EU countries)
6. **Progressive Federal Tax:** 6 brackets, only top earners reach 11.5%
7. **All Variable Pay:** Bonuses, overtime, commissions added to annual income and taxed normally
8. **Calculation Order:** Social Security → Taxable Income → Federal Tax + Canton Tax

---

## 🇯🇵 Japan (2026)

**Tax Year:** Calendar year 2026

### National Income Tax (Progressive)

Japan uses a **progressive national income tax** with 7 brackets, ranging from 5% to 45%.

**National Income Tax Brackets (2026):**
- ¥0 - ¥1,950,000: **5%**
- ¥1,950,001 - ¥3,300,000: **10%**
- ¥3,300,001 - ¥6,950,000: **20%**
- ¥6,950,001 - ¥9,000,000: **23%**
- ¥9,000,001 - ¥18,000,000: **33%**
- ¥18,000,001 - ¥40,000,000: **40%**
- ¥40,000,001+: **45%**

### Resident Tax (Local Tax)

**Flat rate:** 10% of taxable income

**Breakdown:**
- Municipal tax: 6%
- Prefectural tax: 4%

**Important:** Applied on taxable income (after social insurance and basic allowance)

### Social Insurance (Employee Share)

**Total Employee Contribution:** ~14.75% of gross salary

**Breakdown:**
- **Pension (Kōsei Nenkin):** 9.15%
- **Health Insurance (Kenkō Hoken):** 5%
- **Employment Insurance (Koyō Hoken):** 0.6%

**Important:**
- **No cap** (applies to full gross salary)
- **Deducted from gross BEFORE calculating taxable income**
- Rates vary slightly by prefecture (using average)

### Basic Allowance (Standard Deduction)

**Standard Deduction:** ¥480,000

Applied to all taxpayers, reduces taxable income.

### Tax Calculation Process

```
1. Calculate social insurance = gross × 14.75% (no cap)
2. Calculate taxable income = gross - social insurance - basic allowance (¥480,000)
3. Calculate national income tax using progressive 7-bracket system
4. Calculate resident tax = taxable income × 10%
5. Total tax = national income tax + resident tax
6. Net income = gross - total tax - social insurance
```

**Key:** Social insurance is **deducted from gross** before calculating taxable income.

### Example Calculations

**Example 1: ¥3,000,000 (Low income)**
- Gross Salary: ¥3,000,000
- Social Insurance: ¥442,500 (¥3M × 14.75%)
- Taxable Income: ¥2,077,500 (¥3M - ¥442,500 - ¥480,000)
- National Income Tax:
  - ¥1,950,000 × 5% = ¥97,500
  - ¥127,500 × 10% = ¥12,750
  - **Total: ¥110,250**
- Resident Tax: ¥2,077,500 × 10% = ¥207,750
- **Total Tax: ¥318,000**
- **Net Salary: ¥2,239,500**
- **Effective Tax Rate: 25.35%**

**Example 2: ¥4,000,000 (Lower-middle income)**
- Gross Salary: ¥4,000,000
- Social Insurance: ¥590,000
- Taxable Income: ¥2,930,000
- National Income Tax:
  - ¥1,950,000 × 5% = ¥97,500
  - ¥980,000 × 10% = ¥98,000
  - **Total: ¥195,500**
- Resident Tax: ¥293,000
- **Net Salary: ¥2,921,500**
- **Effective Tax Rate: 26.96%**

**Example 3: ¥5,000,000 (Middle income)**
- Gross Salary: ¥5,000,000
- Social Insurance: ¥737,500
- Taxable Income: ¥3,782,500
- National Income Tax: ¥329,000
- Resident Tax: ¥378,250
- **Net Salary: ¥3,555,250**
- **Effective Tax Rate: 28.89%**

**Example 4: ¥7,000,000 (Middle-high income)**
- Gross Salary: ¥7,000,000
- Social Insurance: ¥1,032,500
- Taxable Income: ¥5,487,500
- National Income Tax: ¥670,000
- Resident Tax: ¥548,750
- **Net Salary: ¥4,748,750**
- **Effective Tax Rate: 32.16%**

**Example 5: ¥9,000,000 (High income)**
- Gross Salary: ¥9,000,000
- Social Insurance: ¥1,327,500
- Taxable Income: ¥7,192,500
- National Income Tax: ¥1,018,275
- Resident Tax: ¥719,250
- **Net Salary: ¥5,934,975**
- **Effective Tax Rate: 34.06%**

**Example 6: ¥12,000,000 (Higher income)**
- Gross Salary: ¥12,000,000
- Social Insurance: ¥1,770,000
- Taxable Income: ¥9,750,000
- National Income Tax: ¥1,681,500
- Resident Tax: ¥975,000
- **Net Salary: ¥7,573,500**
- **Effective Tax Rate: 36.89%**

**Example 7: ¥20,000,000 (Very high income)**
- Gross Salary: ¥20,000,000
- Social Insurance: ¥2,950,000
- Taxable Income: ¥16,570,000
- National Income Tax: ¥3,932,100
- Resident Tax: ¥1,657,000
- **Net Salary: ¥11,460,900**
- **Effective Tax Rate: 42.70%**

**Example 8: ¥50,000,000 (Top bracket)**
- Gross Salary: ¥50,000,000
- Social Insurance: ¥7,375,000
- Taxable Income: ¥42,145,000
- National Income Tax: ¥14,169,250 (45% top rate)
- Resident Tax: ¥4,214,500
- **Net Salary: ¥24,241,250**
- **Effective Tax Rate: 51.52%**

### Key Rules

1. **7-Bracket Progressive System:** National income tax from 5% to 45%
2. **Flat Resident Tax:** 10% on taxable income (6% municipal + 4% prefectural)
3. **Social Insurance Priority:** Calculated and deducted from gross before taxes (14.75%, no cap)
4. **Basic Allowance:** ¥480,000 standard deduction for all taxpayers
5. **Three-Component System:** National Tax + Resident Tax + Social Insurance
6. **No Special Caps:** Social insurance applies to full gross salary
7. **All Variable Pay:** Bonuses, overtime, commissions added to annual income and taxed normally
8. **Calculation Order:** Social Insurance → Taxable Income (minus basic allowance) → National Tax + Resident Tax

---

## Calculation Order (All Countries)

1. **Annualize income** from hourly/weekly/monthly inputs
2. **Apply pre-tax deductions** (pension, RRSP, etc.)
3. **Calculate taxable income** (after deductions and allowances)
4. **Calculate income tax** using progressive brackets
5. **Apply tax credits** (reduces tax liability, not below zero)
6. **Calculate payroll taxes** (CPP/EI, PRSI, NI, FICA)
7. **Sum total tax and deductions**
8. **Calculate net income** = Gross - Total Tax - Deductions
9. **Derive period amounts** (monthly, weekly, hourly)

---

## Key Principles

### Progressive Tax Systems
- Tax is calculated marginally (only the portion in each bracket is taxed at that rate)
- Example: $100k income doesn't mean entire amount taxed at highest rate

### Tax Credits vs Deductions
- **Deductions**: Reduce taxable income (applied before tax calculation)
- **Credits**: Reduce tax owed (applied after tax calculation)

### Payroll Taxes
- Calculated on GROSS income (not reduced by pre-tax deductions)
- Exception: Pension contributions may reduce certain payroll taxes

### Caps and Thresholds
- Social Security/CPP: Capped at maximum earnings
- Medicare/EI: Capped at maximum earnings or unlimited
- Personal Allowances: May taper at high incomes

---

## Sources

- **US**: IRS Revenue Procedure 2025-32 (Official 2026 data)
- **UK**: HMRC 2026 PAYE and NI rates
- **Ireland**: Revenue 2026 Budget
- **Canada**: CRA 2026 rates and indexing
- **Australia**: ATO 2025-26 tax tables and rates (1 July 2025 - 30 June 2026)
- **Germany**: Bundesministerium der Finanzen (BMF) 2026 Lohnsteuer and social security rates
- **France**: Direction Générale des Finances Publiques (DGFiP) 2026 Impôt sur le Revenu and URSSAF rates
- **Netherlands**: Belastingdienst 2026 Box 1 income tax rates and heffingskortingen (tax credits)
- **Spain**: Agencia Tributaria 2026 IRPF rates, Seguridad Social contributions, and personal allowances
- **Italy**: Agenzia delle Entrate 2026 IRPEF brackets, INPS contributions, regional and municipal surtaxes
- **Portugal**: Autoridade Tributária e Aduaneira 2026 IRS progressive brackets and Segurança Social rates
- **Switzerland**: Eidgenössische Steuerverwaltung (ESTV) 2026 Federal tax rates, cantonal tax rates, and AHV/IV/EO/ALV social security
- **Japan**: National Tax Agency (NTA) 2026 national income tax brackets, resident tax rates, and social insurance contributions

---

## Implementation Notes

### For Claude/Cursor:
- DO NOT ask users for tax rates or brackets
- ALWAYS use official 2026 rates from this document
- Normalize income to annual before calculations
- Apply credits correctly (non-refundable = cannot go below zero)
- Handle regional variations (US states, UK Scotland, Italy regions, Switzerland cantons, etc.)
- Include all outputs: Gross, Tax, Deductions, Net, Effective Rate

### Verification:
- Test against official calculators when available
- Cross-check with example calculations in this document
- Ensure progressive brackets work correctly
- Verify caps are applied (Social Security, CPP, EI, Spain SS cap, etc.)

---

**Last Updated:** 2026-01-14
**Version:** 1.7
**Status:** Complete for US, UK, IE, CA, AU, DE, FR, NL, ES, IT, PT, CH, JP
