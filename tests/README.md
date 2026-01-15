# Tax Calculator Test Suite (2026)

This directory contains comprehensive test suites for all tax calculators. These tests serve multiple purposes:

1. **Verification**: Ensure tax calculations are accurate for 2026
2. **Content Creation**: Provide real-world examples for documentation and marketing
3. **Regression Testing**: Detect breaking changes when updating tax rates
4. **Educational**: Show how tax calculations work with actual examples

---

## 📁 Test Files

### United States
- **test-us-state-taxes-2026.ts**: Tests all 50 states + DC
  - No-tax states (TX, FL, WA, etc.)
  - Flat-rate states (UT, MA, etc.)
  - Progressive states (CA, NY, etc.)
  - California progressive bracket verification

### United Kingdom
- **test-uk-comprehensive-2026.ts**: Tests UK PAYE and NI
  - England/Wales/Northern Ireland tax bands
  - Scottish tax bands (5 brackets)
  - Personal Allowance taper for high earners
  - Weekly NI thresholds (£242/£967)
  - Class 1 (employee) vs Class 4 (self-employed)

### Ireland
- **test-ireland-comprehensive-2026.ts**: Tests Irish tax system
  - Income tax (20%/40% bands)
  - Universal Social Charge (USC) with 4 brackets
  - PRSI at 4.35%
  - Self-employed USC surcharge (3% above €100k)
  - Married vs single filing
  - Tax credits (€2,000 each)

### Canada
- **test-canada-comprehensive-2026.ts**: Tests Canadian federal + provincial
  - Federal tax (14% lowest bracket - new for 2026)
  - Ontario provincial tax
  - CPP (max $74,600)
  - EI (max $68,900)
  - Basic Personal Amount credits

### Australia
- **test-australia-comprehensive-2025-26.ts**: Tests Australian ATO 2025-26 system
  - Tax brackets ($120k and $180k thresholds - updated)
  - Low Income Tax Offset (LITO) - $700 max, phases $37k-$45k
  - Medicare Levy (2%) for residents only
  - Medicare Levy Surcharge (1-1.5%) for high earners without private health
  - Resident vs foreign resident tax treatment
  - HELP/HECS repayment brackets

### Germany
- **test-germany-comprehensive-2026.ts**: Tests German Lohnsteuer 2026 system
  - Progressive income tax formula (polynomial-based, not simple brackets)
  - Basic allowance (Grundfreibetrag): €10,908
  - Solidarity surcharge (Soli): 5.5% on income tax above threshold
  - Church tax: 8% (Bavaria/Baden-Württemberg) or 9% (other states)
  - Social security contributions (pension, health, unemployment, care)
  - Social security ceiling: €90,600

### France
- **test-france-comprehensive-2026.ts**: Tests French Impôt sur le Revenu 2026 system
  - Family quotient system (quotient familial): 1-4 parts based on family
  - Progressive income tax: 0%, 11%, 30%, 41%, 45%
  - URSSAF social contributions: ~23% of gross
  - CSG: 9.2% on 98.25% of gross
  - CRDS: 0.5% on 98.25% of gross
  - Professional expenses: 10% standard deduction

### Netherlands
- **test-netherlands-comprehensive-2026.ts**: Tests Dutch Box 1 income tax 2026 system
  - Box 1 progressive tax brackets: 36.93%, 40.40%, 49.50%
  - Bracket thresholds: €38,000 and €74,000
  - General tax credit (Algemene heffingskorting): €2,888
  - Employed person's tax credit (Arbeidskorting): €4,205
  - Social security included in Box 1 rates (no separate calculation)
  - Non-refundable credits (reduce tax to €0, not below)

### Spain
- **test-spain-comprehensive-2026.ts**: Tests Spanish IRPF 2026 system
  - IRPF progressive brackets: 19%, 24%, 30%, 37%, 45%, 47%
  - Employee social security: 6.35% (capped at €48,840/year)
  - Personal allowances: €5,550 base + age/family increases
  - Social security deducted from gross BEFORE calculating taxable income
  - Pre-tax deductions: Pension (€1,500 cap), Health (€500 cap)
  - Age allowances: €6,700 (65+), €8,100 (75+)
  - Family allowances: Married +€3,400, Children +€2,400+

### Italy
- **test-italy-comprehensive-2026.ts**: Tests Italian IRPEF 2026 system
  - IRPEF progressive brackets: 23%, 35%, 43% (simplified 3-bracket system)
  - Employee INPS: 9.19% (no cap for employees)
  - Regional surtax: ~2.33% (Lombardy default)
  - Municipal surtax: ~0.8% (default)
  - Employment tax credit: Up to €1,880 (phases out €15k-€28k)
  - INPS deducted from gross BEFORE calculating taxable income
  - Four-component tax: IRPEF + Regional + Municipal - Tax Credits

### Portugal
- **test-portugal-comprehensive-2026.ts**: Tests Portuguese IRS 2026 system
  - IRS progressive brackets: 9 brackets from 13.25% to 48%
  - Social Security: 11% (no cap)
  - Social security deducted from gross BEFORE calculating taxable income
  - Most progressive system among covered countries
  - Phase 1: Simple implementation (no NHR, dependents, or tax credits)

### Switzerland
- **test-switzerland-comprehensive-2026.ts**: Tests Swiss Federal + Canton 2026 system
  - Federal tax: 6 brackets from 0% to 11.5% (very low rates)
  - Canton/Municipal tax: Config-based rates (6%-13%)
  - Social Security: 6.4% (5.3% AHV/IV/EO + 1.1% ALV, no cap)
  - Social security deducted from gross BEFORE calculating taxable income
  - Two-tier system: Federal + Canton tax
  - Tax-friendly: Overall effective rates 12%-26%

### Japan
- **test-japan-comprehensive-2026.ts**: Tests Japanese National + Resident 2026 system
  - National income tax: 7 brackets from 5% to 45% (progressive)
  - Resident tax: Flat 10% (6% municipal + 4% prefectural)
  - Social Insurance: 14.75% (9.15% pension + 5% health + 0.6% employment, no cap)
  - Basic Allowance: ¥480,000 standard deduction
  - Social insurance deducted from gross BEFORE calculating taxable income
  - Three-component system: National Tax + Resident Tax + Social Insurance

---

## 📅 Time-Based Calculator Tests

These tests verify the time-based conversion calculators (hourly, daily, weekly, monthly → annual salary).

### Portugal Time-Based
- **test-portugal-time-based.ts**: Verifies time-based conversions for Portugal
  - Hourly to annual (2,080 hours/year standard)
  - Daily to annual (260 days/year standard)
  - Weekly to annual (52 weeks/year)
  - Monthly to annual (12 months/year)
  - Annual to hourly conversion
  - All conversions produce consistent gross salary

### Switzerland Time-Based
- **test-switzerland-time-based.ts**: Verifies time-based conversions for Switzerland
  - Hourly to annual (2,184 hours/year - 42 hrs/week Swiss standard)
  - Daily to annual (260 days/year standard)
  - Weekly to annual (52 weeks/year)
  - Monthly to annual (12 months/year)
  - Annual to hourly conversion
  - Tests multiple cantons (Zurich, Zug, Geneva, Basel)

### Japan Time-Based
- **test-japan-time-based.ts**: Verifies time-based conversions for Japan
  - Hourly to annual (2,080 hours/year - 40 hrs/week standard)
  - Daily to annual (260 days/year standard)
  - Weekly to annual (52 weeks/year)
  - Monthly to annual (12 months/year)
  - Annual to hourly conversion
  - Verifies 3-component tax system (National + Resident + Social Insurance)

---

## 🚀 Running Tests

### Run All Core Tax Engine Tests
```bash
npx tsx tests/test-us-state-taxes-2026.ts
npx tsx tests/test-uk-comprehensive-2026.ts
npx tsx tests/test-ireland-comprehensive-2026.ts
npx tsx tests/test-canada-comprehensive-2026.ts
npx tsx tests/test-australia-comprehensive-2025-26.ts
npx tsx tests/test-germany-comprehensive-2026.ts
npx tsx tests/test-france-comprehensive-2026.ts
npx tsx tests/test-netherlands-comprehensive-2026.ts
npx tsx tests/test-spain-comprehensive-2026.ts
npx tsx tests/test-italy-comprehensive-2026.ts
npx tsx tests/test-portugal-comprehensive-2026.ts
npx tsx tests/test-switzerland-comprehensive-2026.ts
npx tsx tests/test-japan-comprehensive-2026.ts
```

### Run All Time-Based Calculator Tests
```bash
npx tsx tests/test-portugal-time-based.ts
npx tsx tests/test-switzerland-time-based.ts
npx tsx tests/test-japan-time-based.ts
```

### Run Specific Test
```bash
npx tsx tests/test-uk-comprehensive-2026.ts
```

---

## 📊 Test Coverage

### United States (test-us-state-taxes-2026.ts)
- ✅ 8 state types tested (no-tax, flat, progressive)
- ✅ 5 California income levels (progressive verification)
- ✅ Federal tax brackets (7 brackets)
- ✅ FICA (Social Security + Medicare)
- ✅ State tax calculations

**Example Outputs:**
```
Texas (TX) - No Tax:
  State Tax: $0.00 (0.00%)
  Net Salary: $61,592.50
  Effective Tax Rate: 17.88%

California (CA) - Progressive (up to 13.3%):
  State Tax: $2,253.40 (3.00%)
  Net Salary: $59,339.10
  Effective Tax Rate: 20.88%
```

### United Kingdom (test-uk-comprehensive-2026.ts)
- ✅ 7 comprehensive scenarios
- ✅ Personal Allowance taper tested
- ✅ Scotland vs England comparison
- ✅ Weekly NI calculation verified
- ✅ Self-employed Class 4 NI

**Example Outputs:**
```
Basic rate taxpayer - £30,000:
  Income Tax: £3,486.00
  National Insurance: £2,089.92
  Net: £24,424.08
  Effective Tax Rate: 18.59%

Scotland vs England (£50,000):
  England Income Tax: £4,972.00
  Scotland Income Tax: £8,975.10
  Difference: £4,003.10 more in Scotland
```

### Ireland (test-ireland-comprehensive-2026.ts)
- ✅ 7 comprehensive scenarios
- ✅ USC exemption (≤€13k)
- ✅ Self-employed surcharge (>€100k)
- ✅ Marital status variations
- ✅ PRSI 4.35% rate

**Example Outputs:**
```
Basic rate - €35,000:
  Income Tax: €3,000.00
  USC: €582.82
  PRSI: €1,522.50
  Net: €29,894.68
  Effective Tax Rate: 14.59%

Self-employed €120,000 (with USC surcharge):
  Income Tax: €35,200.00
  USC: €6,230.62 (includes 3% surcharge)
  PRSI: €5,220.00
  Net: €73,349.38
```

### Canada (test-canada-comprehensive-2026.ts)
- ✅ 5 income levels tested
- ✅ Federal 14% bracket verified
- ✅ CPP/EI caps tested
- ✅ Basic Personal Amount credits
- ✅ Progressive provincial tax

**Example Outputs:**
```
Basic rate - $50,000:
  Federal Tax: $4,696.72
  Provincial Tax: $1,898.85
  CPP: $2,766.75
  EI: $815.00
  Net: $39,822.68
  Effective Tax Rate: 20.35%
```

### Australia (test-australia-comprehensive-2025-26.ts)
- ✅ 8 comprehensive scenarios
- ✅ ATO 2025-26 brackets ($120k/$180k)
- ✅ LITO phase-out tested ($37k-$45k)
- ✅ Medicare Levy Surcharge (1-1.5%)
- ✅ Resident vs non-resident
- ✅ Below threshold, low, mid, high incomes

**Example Outputs:**
```
Low income with full LITO - $30,000:
  Income Tax: $1,542.00
  Medicare Levy: $600.00
  LITO: $700.00
  Net: $27,858.00
  Effective Tax Rate: 7.14%

LITO phase-out - $40,000:
  Income Tax: $3,704.50
  Medicare Levy: $800.00
  LITO: $437.50
  Net: $35,495.50
  Effective Tax Rate: 11.26%

High earner without private health - $120,000:
  Income Tax: $29,467.00
  Medicare Levy: $2,400.00
  Medicare Levy Surcharge: $1,500.00
  Net: $86,633.00
  Effective Tax Rate: 27.81%

Non-resident - $80,000:
  Income Tax: $26,000.00 (32.5% - no tax-free threshold)
  Medicare Levy: $0.00
  Net: $54,000.00
  Effective Tax Rate: 32.50%
```

### Germany (test-germany-comprehensive-2026.ts)
- ✅ 8 comprehensive scenarios
- ✅ Progressive income tax formula (polynomial)
- ✅ Solidarity surcharge above threshold
- ✅ Church tax (Bavaria 8% vs other 9%)
- ✅ Social security capped at €90,600
- ✅ Below allowance, low, middle, high incomes

**Example Outputs:**
```
Low income - €20,000:
  Income Tax: €1,956.40
  Pension: €1,860.00 (9.3%)
  Health: €1,530.00 (7.65%)
  Unemployment: €240.00 (1.2%)
  Care: €305.00 (1.525%)
  Net: €14,108.60
  Effective Tax Rate: 29.46%

Middle income - €40,000:
  Income Tax: €7,828.98
  Social Security: €7,870.00
  Net: €24,301.02
  Effective Tax Rate: 39.25%

With Church tax (Bavaria) - €80,000:
  Income Tax: €23,627.02
  Solidarity Surcharge: €334.62
  Church Tax: €1,890.16 (8%)
  Social Security: €15,740.00
  Net: €38,408.20
  Effective Tax Rate: 51.99%

Top rate - €300,000:
  Income Tax: €116,692.27 (45%)
  Solidarity Surcharge: €5,453.21
  Social Security: €17,825.55 (capped at €90,600)
  Net: €160,028.97
  Effective Tax Rate: 46.66%
```

### France (test-france-comprehensive-2026.ts)
- ✅ 8 comprehensive scenarios
- ✅ Family quotient (parts fiscales)
- ✅ Progressive income tax (5 brackets)
- ✅ URSSAF ~23% employee share
- ✅ CSG/CRDS on 98.25% of gross
- ✅ Single, married, and family scenarios

**Example Outputs:**
```
Low income - €20,000 (Single):
  Income Tax: €794.53
  URSSAF: €4,600.00 (23%)
  CSG: €1,807.80 (9.2%)
  CRDS: €98.25 (0.5%)
  Net: €12,699.42
  Effective Tax Rate: 36.50%

Middle income - €60,000 (Single):
  Income Tax: €9,793.71
  URSSAF: €13,800.00
  CSG/CRDS: €5,718.15
  Net: €30,688.14
  Effective Tax Rate: 48.85%

Married, 2 children - €60,000:
  Family Parts: 3 (2 + 0.5 + 0.5)
  Income Tax: €2,383.59 (much lower due to quotient)
  URSSAF: €13,800.00
  CSG/CRDS: €5,718.15
  Net: €38,098.26
  Effective Tax Rate: 36.50%

Top rate - €200,000 (Single):
  Income Tax: €59,191.25 (45% bracket)
  URSSAF: €46,000.00
  CSG/CRDS: €19,060.50
  Net: €75,748.25
  Effective Tax Rate: 62.13%
```

### Netherlands (test-netherlands-comprehensive-2026.ts)
- ✅ 8 comprehensive scenarios
- ✅ Box 1 income tax (3 progressive brackets)
- ✅ Tax credits (general €2,888 + employed €4,205)
- ✅ Social security included in Box 1 rates
- ✅ Non-refundable credits (reduce tax to €0, not below)
- ✅ Optional credit scenarios (with/without)

**Example Outputs:**
```
Low income - €25,000 (with all credits):
  Tax Before Credits: €9,232.50 (36.93%)
  Tax Credits: €7,093.00
  Total Tax: €2,139.50
  Net: €22,860.50
  Effective Tax Rate: 8.56%

Crossing first bracket - €45,000 (with all credits):
  Tax Before Credits: €16,861.40
  Tax Credits: €7,093.00
  Total Tax: €9,768.40
  Net: €35,231.60
  Effective Tax Rate: 21.71%

In second bracket - €60,000 (with all credits):
  Tax Before Credits: €22,921.40
  Tax Credits: €7,093.00
  Total Tax: €15,828.40
  Net: €44,171.60
  Effective Tax Rate: 26.38%

Crossing second bracket - €80,000 (with all credits):
  Tax Before Credits: €31,547.40
  Tax Credits: €7,093.00
  Total Tax: €24,454.40
  Net: €55,545.60
  Effective Tax Rate: 30.57%

High income - €100,000 (with all credits):
  Tax Before Credits: €41,447.40
  Tax Credits: €7,093.00
  Total Tax: €34,354.40
  Net: €65,645.60
  Effective Tax Rate: 34.35%

Very high income - €150,000 (top bracket):
  Tax Before Credits: €66,197.40 (49.50% top rate)
  Tax Credits: €7,093.00
  Total Tax: €59,104.40
  Net: €90,895.60
  Effective Tax Rate: 39.40%

No credits - €50,000:
  Tax Before Credits: €18,881.40
  Tax Credits: €0.00 (disabled)
  Total Tax: €18,881.40
  Net: €31,118.60
  Effective Tax Rate: 37.76%
```

### Spain (test-spain-comprehensive-2026.ts)
- ✅ 8 comprehensive scenarios
- ✅ IRPF progressive tax (6 brackets)
- ✅ Social security 6.35% (capped at €48,840/year)
- ✅ Personal allowances (€5,550 base + age/family)
- ✅ Social security deducted BEFORE taxable income calculation
- ✅ Pre-tax deductions (pension, health)
- ✅ Age-based and family-based allowances

**Example Outputs:**
```
Low income - €20,000 (Single, no children):
  IRPF: €2,540.70
  Social Security: €1,270.00 (6.35%)
  Net: €16,189.30
  Effective Tax Rate: 19.05%

Middle income - €35,000 (Single, no children):
  IRPF: €6,333.75
  Social Security: €2,222.50
  Net: €26,443.75
  Effective Tax Rate: 24.45%

Married, 2 children - €45,000:
  Personal Allowance: €14,050 (€5,550 + €3,400 + €2,400 + €2,700)
  IRPF: €6,593.25
  Social Security: €2,857.50
  Net: €35,549.25
  Effective Tax Rate: 21.00%

High income - €60,000 (Single):
  IRPF: €14,700.50
  Social Security: €3,101.34 (capped)
  Net: €42,198.16
  Effective Tax Rate: 29.67%

With pension - €80,000 (€1,500 pension):
  Pre-Tax Deductions: €1,500.00
  IRPF: €22,333.40
  Social Security: €3,101.34 (capped)
  Net: €54,565.26
  Effective Tax Rate: 31.79%

Very high income - €100,000 (Single):
  IRPF: €32,008.40 (45% bracket)
  Social Security: €3,101.34 (capped)
  Net: €64,890.26
  Effective Tax Rate: 35.11%

Age 70 - €25,000:
  Personal Allowance: €6,700 (age 65+)
  IRPF: €3,388.50
  Social Security: €1,587.50
  Net: €20,024.00
  Effective Tax Rate: 19.90%

Top bracket - €150,000:
  IRPF: €54,508.40 (45% top rate)
  Social Security: €3,101.34 (capped)
  Net: €92,390.26
  Effective Tax Rate: 38.41%
```

### Italy (test-italy-comprehensive-2026.ts)
- ✅ 8 comprehensive scenarios
- ✅ IRPEF simplified 3 brackets (23%, 35%, 43%)
- ✅ INPS 9.19% (no cap for employees)
- ✅ Regional surtax ~2.33% (Lombardy)
- ✅ Municipal surtax ~0.8%
- ✅ Employment tax credit (€0-€1,880, phases out)
- ✅ Dependent deductions tested

**Example Outputs:**
```
Low income - €20,000 (Single, no dependents):
  INPS: €1,838.00 (9.19%)
  IRPEF: €4,177.26 (23% bracket)
  Employment Tax Credit: -€1,423.74
  Regional Tax: €423.17
  Municipal Tax: €145.30
  Net: €14,839.00
  Effective Tax Rate: 25.81%

Middle income - €30,000 (Single, no dependents):
  INPS: €2,757.00
  IRPEF: €6,265.89
  Employment Tax Credit: €0 (above €28k)
  Regional Tax: €634.76
  Municipal Tax: €217.94
  Net: €20,233.88
  Effective Tax Rate: 32.55%

Married, 2 dependents - €45,000:
  INPS: €4,135.50
  IRPEF: €10,942.58 (35% and 43% brackets)
  Regional Tax: €952.14
  Municipal Tax: €326.92
  Net: €31,325.58
  Effective Tax Rate: 30.39%

High income - €60,000 (Single, no dependents):
  INPS: €5,514.00
  IRPEF: €16,068.98 (43% top bracket)
  Regional Tax: €1,269.52
  Municipal Tax: €435.89
  Net: €36,711.61
  Effective Tax Rate: 38.81%

With pension - €50,000 (€2,000 pension contribution):
  INPS: €4,595.00
  Pre-Tax Deductions: €2,000.00
  IRPEF: €11,831.75
  Regional Tax: €1,011.34
  Municipal Tax: €347.24
  Net: €32,214.67
  Effective Tax Rate: 35.57%

Very high income - €70,000 (Single, no dependents):
  INPS: €6,433.00
  IRPEF: €19,973.81
  Regional Tax: €1,481.11
  Municipal Tax: €508.54
  Net: €41,603.54
  Effective Tax Rate: 40.57%

Max tax credit - €15,000 (Single):
  INPS: €1,378.50
  IRPEF: €3,132.95
  Employment Tax Credit: -€1,880.00 (full credit)
  Regional Tax: €317.38
  Municipal Tax: €108.97
  Net: €11,942.20
  Effective Tax Rate: 20.39%

Top bracket - €80,000:
  INPS: €7,352.00
  IRPEF: €23,878.64
  Regional Tax: €1,692.70
  Municipal Tax: €581.18
  Net: €46,495.48
  Effective Tax Rate: 41.88%
```

### Portugal (test-portugal-comprehensive-2026.ts)
- ✅ 8 comprehensive scenarios
- ✅ IRS 9 progressive brackets (13.25% → 48%)
- ✅ Social Security 11% (no cap)
- ✅ Most progressive system among covered countries
- ✅ All income levels tested (low to top bracket)

**Example Outputs:**
```
Low income - €10,000:
  Social Security: €1,100.00 (11%)
  IRS: €1,236.11
  Net: €7,663.89
  Effective Tax Rate: 23.36%

Lower-middle income - €15,000:
  Social Security: €1,650.00
  IRS: €2,123.46
  Net: €11,226.54
  Effective Tax Rate: 25.16%

Middle income - €20,000:
  Social Security: €2,200.00
  IRS: €3,186.80
  Net: €14,613.20
  Effective Tax Rate: 26.93%

Middle-high income - €30,000:
  Social Security: €3,300.00
  IRS: €5,863.88
  Net: €20,836.12
  Effective Tax Rate: 30.55%

High income - €45,000:
  Social Security: €4,950.00
  IRS: €10,801.26
  Net: €29,248.74
  Effective Tax Rate: 35.00%

Higher income - €60,000:
  Social Security: €6,600.00
  IRS: €16,629.55
  Net: €36,770.45
  Effective Tax Rate: 38.72%

Very high income - €85,000:
  Social Security: €9,350.00
  IRS: €26,642.06
  Net: €49,007.94
  Effective Tax Rate: 42.34%

Top bracket - €100,000 (48% rate):
  Social Security: €11,000.00
  IRS: €32,883.58
  Net: €56,116.42
  Effective Tax Rate: 43.88%
```

### Switzerland (test-switzerland-comprehensive-2026.ts)
- ✅ 8 comprehensive scenarios
- ✅ Federal tax 6 brackets (0% → 11.5%)
- ✅ Canton tax variation (Zug 6%, Basel 13%)
- ✅ Social Security 6.4% (no cap)
- ✅ Very low federal rates compared to EU
- ✅ Tax-friendly system tested

**Example Outputs:**
```
Low income - CHF 50,000 (Zurich 10%):
  Social Security: CHF 3,200.00 (6.4%)
  Federal Tax: CHF 360.47
  Canton Tax: CHF 4,680.00
  Net: CHF 41,759.53
  Effective Tax Rate: 16.48%

Middle income - CHF 80,000 (Zurich 10%):
  Social Security: CHF 5,120.00
  Federal Tax: CHF 1,369.74
  Canton Tax: CHF 7,488.00
  Net: CHF 66,022.26
  Effective Tax Rate: 17.47%

High income - CHF 120,000 (Zurich 10%):
  Social Security: CHF 7,680.00
  Federal Tax: CHF 5,675.34
  Canton Tax: CHF 11,232.00
  Net: CHF 95,412.66
  Effective Tax Rate: 20.49%

Low income - CHF 50,000 (Zug 6% - lowest canton):
  Social Security: CHF 3,200.00
  Federal Tax: CHF 360.47
  Canton Tax: CHF 2,808.00
  Net: CHF 43,631.53
  Effective Tax Rate: 12.74%

Middle income - CHF 80,000 (Geneva 12% - high canton):
  Social Security: CHF 5,120.00
  Federal Tax: CHF 1,369.74
  Canton Tax: CHF 8,985.60
  Net: CHF 64,524.66
  Effective Tax Rate: 19.34%

High income - CHF 120,000 (Basel 13% - highest canton):
  Social Security: CHF 7,680.00
  Federal Tax: CHF 5,675.34
  Canton Tax: CHF 14,601.60
  Net: CHF 92,043.06
  Effective Tax Rate: 23.30%

Very high income - CHF 200,000 (Zurich):
  Social Security: CHF 12,800.00
  Federal Tax: CHF 14,286.54 (11.5% top bracket)
  Canton Tax: CHF 18,720.00
  Net: CHF 154,193.46
  Effective Tax Rate: 22.90%

Top earner - CHF 250,000 (Geneva):
  Social Security: CHF 16,000.00
  Federal Tax: CHF 19,668.54
  Canton Tax: CHF 28,080.00
  Net: CHF 186,251.46
  Effective Tax Rate: 25.50%
```

### Japan (test-japan-comprehensive-2026.ts)
- ✅ 8 comprehensive scenarios
- ✅ National income tax 7 brackets (5% → 45%)
- ✅ Resident tax 10% flat (6% municipal + 4% prefectural)
- ✅ Social Insurance 14.75% (no cap)
- ✅ Basic Allowance ¥480,000
- ✅ Three-component tax system

**Example Outputs:**
```
Low income - ¥3,000,000:
  Social Insurance: ¥442,500 (14.75%)
  National Tax: ¥110,250
  Resident Tax: ¥207,750 (10%)
  Net: ¥2,239,500
  Effective Tax Rate: 25.35%

Lower-middle income - ¥4,000,000:
  Social Insurance: ¥590,000
  National Tax: ¥195,500
  Resident Tax: ¥293,000
  Net: ¥2,921,500
  Effective Tax Rate: 26.96%

Middle income - ¥5,000,000:
  Social Insurance: ¥737,500
  National Tax: ¥329,000
  Resident Tax: ¥378,250
  Net: ¥3,555,250
  Effective Tax Rate: 28.89%

Middle-high income - ¥7,000,000:
  Social Insurance: ¥1,032,500
  National Tax: ¥670,000
  Resident Tax: ¥548,750
  Net: ¥4,748,750
  Effective Tax Rate: 32.16%

High income - ¥9,000,000:
  Social Insurance: ¥1,327,500
  National Tax: ¥1,018,275 (23% bracket)
  Resident Tax: ¥719,250
  Net: ¥5,934,975
  Effective Tax Rate: 34.06%

Higher income - ¥12,000,000:
  Social Insurance: ¥1,770,000
  National Tax: ¥1,681,500 (33% bracket)
  Resident Tax: ¥975,000
  Net: ¥7,573,500
  Effective Tax Rate: 36.89%

Very high income - ¥20,000,000:
  Social Insurance: ¥2,950,000
  National Tax: ¥3,932,100 (40% bracket)
  Resident Tax: ¥1,657,000
  Net: ¥11,460,900
  Effective Tax Rate: 42.70%

Top bracket - ¥50,000,000:
  Social Insurance: ¥7,375,000
  National Tax: ¥14,169,250 (45% top bracket)
  Resident Tax: ¥4,214,500
  Net: ¥24,241,250
  Effective Tax Rate: 51.52%
```

---

## 💡 Using Test Data for Content

### Blog Posts
Use test outputs to create real-world examples:
- "How much will I pay in taxes on a $75,000 salary in California?"
- "UK vs Scotland tax comparison: Where do you pay less?"
- "Self-employed in Ireland? Here's what you'll pay above €100k"

### Documentation
Reference exact calculations from tests:
- "For a £30,000 salary in England, you'll pay £3,486 in income tax and £2,089.92 in National Insurance"
- "California's progressive tax means you pay just 3% state tax on $75,000"

### Marketing Materials
Highlight differences between states/regions:
- "Save $2,253 in state taxes: Texas vs California comparison"
- "Scottish taxpayers pay £4,003 more on £50,000 salary"

### FAQs
Answer common questions with real data:
- Q: "Do I pay PRSI if I earn below €18,304?"
- A: "No, PRSI has a threshold of €18,304/year (€352/week). Below this, you pay €0."

---

## 🔧 Maintaining Tests

### When Tax Rates Change
1. Update the relevant calculator in `lib/calculators/`
2. Update expected values in test files
3. Run tests to verify
4. Update `TAX_SPECIFICATIONS_2026.md`

### Adding New Tests
1. Create new test file in `tests/` directory
2. Follow existing naming convention: `test-{country}-{type}-{year}.ts`
3. Include comprehensive scenarios (low, middle, high income)
4. Test edge cases (thresholds, caps, tapers)
5. Add documentation to this README

### Test Structure
```typescript
const tests = [
  {
    name: 'Descriptive test name',
    salary: 50000,
    // ... other options
    expectedTax: 1234.56,
    expectedDeductions: 789.01,
  },
];

// Run tests and compare actual vs expected
// Mark as PASS ✅ or FAIL ❌
```

---

## 📈 Expected Results Summary

### United States ($75,000 salary)
| State | State Tax | Net Salary | Effective Rate |
|-------|-----------|------------|----------------|
| Texas | $0 | $61,592.50 | 17.88% |
| California | $2,253.40 | $59,339.10 | 20.88% |
| New York | $3,074.50 | $58,518.00 | 21.98% |

### United Kingdom (£50,000 salary)
| Region | Income Tax | NI | Net | Effective Rate |
|--------|------------|-----|-----|----------------|
| England | £4,972.00 | £4,489.92 | £40,538.08 | 18.92% |
| Scotland | £8,975.10 | £4,489.92 | £36,534.98 | 26.93% |

### Ireland (€50,000 salary)
| Component | Employee | Self-Employed |
|-----------|----------|---------------|
| Income Tax | €7,200 | €17,200 |
| USC | €1,032.82 | €1,032.82 |
| PRSI | €2,175 | €2,175 |
| **Net** | **€39,592.18** | **€29,592.18** |

### Canada ($80,000 salary - Ontario)
| Component | Amount | Rate |
|-----------|--------|------|
| Federal Tax | $10,292.73 | 12.87% |
| Provincial Tax | $4,484.32 | 5.61% |
| CPP | $4,230.45 | 5.29% |
| EI | $1,123.07 | 1.40% |
| **Net** | **$59,869.44** | **25.16%** |

### Australia ($50,000 salary - Resident)
| Component | Amount | Rate |
|-----------|--------|------|
| Income Tax | $6,717.00 | 13.43% |
| Medicare Levy | $1,000.00 | 2.00% |
| LITO | $0.00 | - |
| **Net** | **$42,283.00** | **15.43%** |

### Australia ($120,000 salary - Resident, No Private Health)
| Component | Amount | Rate |
|-----------|--------|------|
| Income Tax | $29,467.00 | 24.56% |
| Medicare Levy | $2,400.00 | 2.00% |
| Medicare Levy Surcharge | $1,500.00 | 1.25% |
| **Net** | **$86,633.00** | **27.81%** |

### Germany (€60,000 salary)
| Component | Amount | Rate |
|-----------|--------|------|
| Income Tax | €15,242.28 | 25.40% |
| Solidarity Surcharge | €0.00 | 0.00% |
| Pension | €5,580.00 | 9.30% |
| Health | €4,590.00 | 7.65% |
| Unemployment | €720.00 | 1.20% |
| Long-term Care | €915.00 | 1.525% |
| **Net** | **€32,952.72** | **45.08%** |

### Germany (€80,000 salary - With Church Tax Bavaria)
| Component | Amount | Rate |
|-----------|--------|------|
| Income Tax | €23,627.02 | 29.53% |
| Solidarity Surcharge | €334.62 | 0.42% |
| Church Tax | €1,890.16 | 2.36% |
| Social Security | €15,740.00 | 19.68% |
| **Net** | **€38,408.20** | **51.99%** |

### France (€60,000 salary - Single, no children)
| Component | Amount | Rate |
|-----------|--------|------|
| Income Tax | €9,793.71 | 16.32% |
| URSSAF | €13,800.00 | 23.00% |
| CSG | €5,423.40 | 9.04% |
| CRDS | €294.75 | 0.49% |
| **Net** | **€30,688.14** | **48.85%** |

### France (€60,000 salary - Married, 2 children)
| Component | Amount | Rate |
|-----------|--------|------|
| Income Tax | €2,383.59 | 3.97% |
| URSSAF | €13,800.00 | 23.00% |
| CSG | €5,423.40 | 9.04% |
| CRDS | €294.75 | 0.49% |
| **Net** | **€38,098.26** | **63.50%** |

**Note:** Family quotient dramatically reduces tax burden for families (€9,794 vs €2,384 for same €60k income)

### Netherlands (€60,000 salary - with all credits)
| Component | Amount | Rate |
|-----------|--------|------|
| Tax Before Credits | €22,921.40 | 38.20% |
| General Tax Credit | €2,888.00 | 4.81% |
| Employed Tax Credit | €4,205.00 | 7.01% |
| **Total Tax** | **€15,828.40** | **26.38%** |
| **Net** | **€44,171.60** | **73.62%** |

### Netherlands (€100,000 salary - with all credits)
| Component | Amount | Rate |
|-----------|--------|------|
| Tax Before Credits | €41,447.40 | 41.45% |
| Total Credits | €7,093.00 | 7.09% |
| **Total Tax** | **€34,354.40** | **34.35%** |
| **Net** | **€65,645.60** | **65.65%** |

**Note:** Tax credits (€7,093 total) significantly reduce effective tax rate, especially for lower-middle incomes

### Spain (€60,000 salary - Single, no children)
| Component | Amount | Rate |
|-----------|--------|------|
| Social Security | €3,101.34 | 5.17% |
| Taxable Income | €56,898.66 | - |
| Personal Allowance | €5,550.00 | - |
| IRPF | €14,700.50 | 24.50% |
| **Total Tax** | **€14,700.50** | **24.50%** |
| **Net** | **€42,198.16** | **70.33%** |

### Spain (€45,000 salary - Married, 2 children)
| Component | Amount | Rate |
|-----------|--------|------|
| Social Security | €2,857.50 | 6.35% |
| Personal Allowance | €14,050.00 | - |
| IRPF | €6,593.25 | 14.65% |
| **Total Tax** | **€6,593.25** | **14.65%** |
| **Net** | **€35,549.25** | **79.00%** |

**Note:** Personal allowances significantly reduce tax burden for families (€14,050 total allowances vs. €5,550 for single)

### Italy (€60,000 salary - Single, no dependents)
| Component | Amount | Rate |
|-----------|--------|------|
| INPS | €5,514.00 | 9.19% |
| Taxable Income | €54,486.00 | - |
| IRPEF | €16,068.98 | 26.78% |
| Regional Tax | €1,269.52 | 2.12% |
| Municipal Tax | €435.89 | 0.73% |
| **Total Tax** | **€17,774.39** | **29.62%** |
| **Net** | **€36,711.61** | **61.19%** |

### Italy (€45,000 salary - Married, 2 dependents)
| Component | Amount | Rate |
|-----------|--------|------|
| INPS | €4,135.50 | 9.19% |
| Taxable Income | €40,864.50 | - |
| IRPEF | €10,942.58 | 24.32% |
| Regional Tax | €952.14 | 2.12% |
| Municipal Tax | €326.92 | 0.73% |
| **Total Tax** | **€12,221.64** | **27.16%** |
| **Net** | **€31,325.58** | **69.61%** |

**Note:** Four-component tax system (IRPEF + Regional + Municipal - Tax Credits) with simplified 3-bracket IRPEF

### Portugal (€60,000 salary)
| Component | Amount | Rate |
|-----------|--------|------|
| Social Security | €6,600.00 | 11.00% |
| Taxable Income | €53,400.00 | - |
| IRS | €16,629.55 | 27.72% |
| **Total Deductions** | **€23,229.55** | **38.72%** |
| **Net** | **€36,770.45** | **61.28%** |

### Portugal (€100,000 salary - Top bracket)
| Component | Amount | Rate |
|-----------|--------|------|
| Social Security | €11,000.00 | 11.00% |
| Taxable Income | €89,000.00 | - |
| IRS | €32,883.58 | 32.88% |
| **Total Deductions** | **€43,883.58** | **43.88%** |
| **Net** | **€56,116.42** | **56.12%** |

**Note:** Most progressive system with 9 IRS brackets (13.25% → 48%), social security 11% uncapped

### Switzerland (CHF 120,000 salary - Zurich 10%)
| Component | Amount | Rate |
|-----------|--------|------|
| Social Security | CHF 7,680.00 | 6.40% |
| Taxable Income | CHF 112,320.00 | - |
| Federal Tax | CHF 5,675.34 | 4.73% |
| Canton Tax | CHF 11,232.00 | 9.36% |
| **Total Tax** | **CHF 16,907.34** | **14.09%** |
| **Net** | **CHF 95,412.66** | **79.51%** |

### Switzerland (CHF 120,000 salary - Zug 6% vs Basel 13%)
| Canton | Federal Tax | Canton Tax | Total Tax | Net | Effective Rate |
|--------|-------------|-----------|-----------|-----|----------------|
| Zug (6%) | CHF 5,675.34 | CHF 6,739.20 | CHF 12,414.54 | CHF 99,905.46 | **16.74%** |
| Zurich (10%) | CHF 5,675.34 | CHF 11,232.00 | CHF 16,907.34 | CHF 95,412.66 | **20.49%** |
| Basel (13%) | CHF 5,675.34 | CHF 14,601.60 | CHF 20,276.94 | CHF 92,043.06 | **23.30%** |

**Note:** Very low federal tax (0%-11.5%) + canton variation (6%-13%) = tax-friendly system (effective 12%-26%)

### Japan (¥9,000,000 salary)
| Component | Amount | Rate |
|-----------|--------|------|
| Social Insurance | ¥1,327,500 | 14.75% |
| Taxable Income | ¥7,192,500 | - |
| National Income Tax | ¥1,018,275 | 11.31% |
| Resident Tax | ¥719,250 | 7.99% |
| **Total Tax** | **¥1,737,525** | **19.31%** |
| **Net** | **¥5,934,975** | **65.94%** |

### Japan (¥50,000,000 salary - Top bracket)
| Component | Amount | Rate |
|-----------|--------|------|
| Social Insurance | ¥7,375,000 | 14.75% |
| Taxable Income | ¥42,145,000 | - |
| National Income Tax | ¥14,169,250 | 28.34% |
| Resident Tax | ¥4,214,500 | 8.43% |
| **Total Tax** | **¥18,383,750** | **36.77%** |
| **Net** | **¥24,241,250** | **48.48%** |

**Note:** Three-component system (National 5-45% + Resident 10% + Social Insurance 14.75%) with ¥480,000 basic allowance

---

## 🎯 Test Goals

- **Accuracy**: All calculations within $1 or 0.01% of expected values
- **Coverage**: Test low, middle, high, and extreme incomes
- **Edge Cases**: Thresholds, caps, tapers, exemptions
- **Real-World**: Use common salary amounts ($50k, $75k, $100k, etc.)
- **Regional Variations**: Test all regions where tax rates differ

---

## 📝 Notes

- All tests use 2026 tax rates and thresholds
- Tests assume employee status unless specified as self-employed
- Default filing status: Single (US), England (UK), Single (IE), Ontario (CA), Resident (AU), No Church Tax (DE), Single no children (FR)
- Tests verify both tax calculations and deduction caps
- Results formatted with currency symbols and 2 decimal places

---

**Last Updated:** 2026-01-14
**Test Suite Version:** 1.7
**Countries Covered:** US, UK, IE, CA, AU, DE, FR, NL, ES, IT, PT, CH, JP
