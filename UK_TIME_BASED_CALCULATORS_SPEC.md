# 🇬🇧 UK TIME-BASED SALARY CALCULATORS (MASTER SPECIFICATION)

**Status:** ✅ Production Standard
**Date:** January 14, 2026
**Inherits From:** UK_CALCULATOR_MASTER_SPEC.md

---

## Calculators Covered

| Calculator | URL Slug |
|-----------|----------|
| Hourly → Salary | `/hourly-to-salary-calculator` |
| Hourly Rate Calculator | `/hourly-rate-calculator` |
| Weekly → Salary | `/weekly-to-salary-calculator` |
| Monthly → Salary | `/monthly-to-salary-calculator` |
| Daily → Salary | `/daily-to-salary-calculator` |

---

## ⚠️ Important Principle

**These calculators DO NOT introduce new tax logic.**

They only **normalize income to annual**, then **reuse the UK tax engine**.

---

## 1️⃣ CORE PRINCIPLES (DO NOT BREAK)

- ❌ No tax year input
- ❌ No manual tax rates / NI / student loan rates
- ❌ No user-entered personal allowance
- ✅ Normalize → annual → tax → redistribute
- ✅ Same inputs across calculators where possible
- ✅ UI can differ, logic must not

---

## 2️⃣ INPUT SPECIFICATION (SHARED)

### 1️⃣ Required Inputs (Always Visible)

#### 1. Income Amount
- **Type:** Number
- **Label:**
  - Hourly: "Hourly Rate"
  - Weekly: "Weekly Pay"
  - Monthly: "Monthly Salary"
  - Daily: "Daily Rate"
- **Unit:** GBP (£)
- **Required:** Yes

#### 2. Pay Frequency (Implicit)

**This is fixed per calculator and NOT user-editable:**

| Calculator | Frequency |
|-----------|-----------|
| Hourly | Hourly |
| Weekly | Weekly |
| Monthly | Monthly |
| Daily | Daily |

❌ Claude must NOT ask for frequency.

#### 3. Tax Code
- **Type:** Text / Select
- **Default:** `1257L`
- **Common Options:**
  - `1257L` (Standard - £12,570 personal allowance)
  - `BR` (Basic Rate - No personal allowance)
  - `D0` (Higher Rate - No personal allowance)
  - `D1` (Additional Rate - No personal allowance)
  - `NT` (No Tax)
  - Custom codes

#### 4. Pension Scheme
- **Type:** Select
- **Options:**
  - None
  - Auto-Enrolment (Workplace Pension)
  - Other
- **Default:** None

#### 5. Student Loan Plan
- **Type:** Select
- **Options:**
  - None (No student loan)
  - Plan 1 (Pre-2012)
  - Plan 2 (Post-2012 England/Wales)
  - Plan 4 (Scotland)
  - Postgraduate Loan
- **Default:** None

#### 6. Employment Type
- **Type:** Select
- **Options:**
  - Employee
  - Self-Employed (affects NI rates)
- **Default:** Employee

---

### 2️⃣ Optional Advanced Inputs (Collapsed)

#### 7. Working Hours (Hourly Only)
- **Type:** Number
- **Default:** 2080
- **Description:** Used to convert hourly → annual income

#### 8. Additional Pension Contribution
- **Type:** Number (GBP)
- **Default:** £0
- **Description:** Pre-tax contributions beyond auto-enrolment

#### 9. Benefits / Allowances (Pre-Tax)
- **Type:** Number (GBP)
- **Default:** £0
- **Examples:** Childcare vouchers, cycle-to-work scheme

#### 10. Dependents
- **Type:** Number
- **Default:** 0
- **Note:** Informational only (UK has no dependent tax credits)

#### 11. Additional Tax Withholding
- **Type:** Number (GBP)
- **Default:** £0
- **Description:** Voluntary extra tax withheld

---

## 3️⃣ NORMALIZATION LOGIC (CRITICAL)

**Claude must convert ALL calculators into annual gross income first.**

### Hourly → Annual
```
annualGross = hourlyRate × workingHours
```

**Default:**
```
workingHours = 2080 (40 hours/week × 52 weeks)
```

### Weekly → Annual
```
annualGross = weeklyPay × 52
```

### Monthly → Annual
```
annualGross = monthlyPay × 12
```

### Daily → Annual
```
annualGross = dailyRate × workingDays
```

**Default assumption:**
```
workingDays = 260 (5 days/week × 52 weeks)
```

⚠️ Optional: allow override for contractors.

---

## 4️⃣ TAX CALCULATION (REUSED – DO NOT MODIFY)

After normalization:

```
annualGross
→ pre-tax deductions (pension, benefits)
→ personal allowance (from tax code)
→ taxable income
→ income tax (PAYE 2025/26)
→ national insurance (on gross)
→ student loan (on gross)
→ total tax
→ net income
```

💡 **This is identical to the UK Salary Calculator logic.**

### Critical Rules:

1. **Personal Allowance** from tax code (`1257L` = £12,570)
2. **Income Tax** on taxable income (after allowance, pension)
3. **National Insurance** on gross income (before pension)
4. **Student Loan** on gross income (before deductions)
5. **Pension** reduces taxable income (not NI-able income)

---

## 5️⃣ REQUIRED OUTPUTS

### Core Outputs

- Gross Annual Income
- Personal Allowance (from tax code)
- Taxable Income
- Income Tax (PAYE)
- National Insurance (Employee)
- Student Loan (if applicable)
- Pension Deduction (if applicable)
- Total Tax
- Net Annual Pay

### Time-Based Outputs (Calculator-Specific)

#### Hourly Calculator
- Net Hourly Pay
- Net Weekly Pay
- Net Monthly Pay
- Net Annual Pay

#### Weekly Calculator
- Net Weekly Pay
- Net Monthly Pay
- Net Annual Pay
- Net Hourly Pay (derived)

#### Monthly Calculator
- Net Monthly Pay
- Net Weekly Pay
- Net Annual Pay
- Net Hourly Pay

#### Daily Calculator
- Net Daily Pay
- Net Weekly Pay
- Net Monthly Pay
- Net Annual Pay

### Analytics
- Effective Tax Rate (%)
- Take-Home Percentage (%)

---

## 6️⃣ EXAMPLES (VALIDATION)

### Example – Hourly Worker

**Input:**
- Hourly Rate: £20
- Working Hours: 2080
- Tax Code: 1257L
- Pension: None
- Student Loan: None
- Employment: Employee

**Calculation:**
```
Annual Gross = £20 × 2080 = £41,600

Personal Allowance: £12,570
Taxable Income: £41,600 - £12,570 = £29,030

Income Tax:
  £29,030 × 20% = £5,806

National Insurance:
  (£41,600 - £12,570) × 12% = £3,483.60

Total Tax: £5,806 + £3,483.60 = £9,289.60
Net Annual: £41,600 - £9,289.60 = £32,310.40

Net Hourly: £32,310.40 ÷ 2080 = £15.53
Net Weekly: £32,310.40 ÷ 52 = £621.35
Net Monthly: £32,310.40 ÷ 12 = £2,692.53

Effective Tax Rate: 22.3%
```

Then apply standard UK tax engine on £41,600.

### Example – Monthly Salary

**Input:**
- Monthly Pay: £3,500
- Tax Code: 1257L
- Pension: Auto-Enrolment
- Student Loan: Plan 2
- Employment: Employee

**Calculation:**
```
Annual Gross = £3,500 × 12 = £42,000

Pension (5% of £42,000):
  £42,000 × 5% = £2,100

Personal Allowance: £12,570
Taxable Income: £42,000 - £12,570 - £2,100 = £27,330

Income Tax:
  £27,330 × 20% = £5,466

National Insurance (on gross):
  (£42,000 - £12,570) × 12% = £3,531.60

Student Loan Plan 2:
  (£42,000 - £27,295) × 9% = £1,323.45

Total Tax: £5,466 + £3,531.60 + £1,323.45 = £10,321.05
Net Annual: £42,000 - £10,321.05 = £31,678.95

Net Monthly: £31,678.95 ÷ 12 = £2,639.91
Net Weekly: £31,678.95 ÷ 52 = £609.21

Effective Tax Rate: 24.6%
```

Taxes calculated once on £42,000 → split monthly.

### Example – Self-Employed Daily Rate

**Input:**
- Daily Rate: £200
- Working Days: 260
- Tax Code: 1257L
- Employment: Self-Employed

**Calculation:**
```
Annual Gross = £200 × 260 = £52,000

Personal Allowance: £12,570
Taxable Income: £52,000 - £12,570 = £39,430

Income Tax:
  £37,700 × 20% = £7,540
  (£39,430 - £37,700) × 40% = £692
  Total Income Tax: £8,232

National Insurance (Self-Employed Class 4):
  £12,570 - £12,570 = £0 (Lower Profits Limit)
  (£50,270 - £12,570) × 9% = £3,393
  (£52,000 - £50,270) × 2% = £34.60
  Total NI: £3,427.60

Total Tax: £8,232 + £3,427.60 = £11,659.60
Net Annual: £52,000 - £11,659.60 = £40,340.40

Net Daily: £40,340.40 ÷ 260 = £155.16
Net Weekly: £40,340.40 ÷ 52 = £775.78
Net Monthly: £40,340.40 ÷ 12 = £3,361.70

Effective Tax Rate: 22.4%
```

---

## 7️⃣ SEO / UX NOTES

### Page Messaging

✅ **Use:**
- "Converted to annual salary before taxes"
- "Taxes calculated once for accuracy"
- "Same results as salary calculator"
- "Calculated using current UK tax rules (PAYE, NI, Student Loan)"
- "Includes 2025/26 tax rates"

❌ **Avoid:**
- "Estimated"
- "Approximate"
- "Based on average tax"
- "Exact payslip result"

### Educational Notes

Add helpful context:
- "Your personal allowance is determined by your tax code"
- "National Insurance is calculated on your gross pay"
- "Student loan deductions only apply if you earn above the threshold"
- "Pension contributions reduce your taxable income"

---

## 8️⃣ STRICT CURSOR / CLAUDE PROMPT

**IMPORTANT RULES:**
- ⚠️ This calculator converts income to annual salary first, then applies UK tax rules.
- ❌ Do NOT ask user for tax year or tax rates.
- ❌ Do NOT calculate tax per period.
- ❌ Do NOT ask for pay frequency (it's implicit per calculator type).
- ✅ Always calculate tax annually, then redistribute.
- ✅ Personal allowance from tax code (automatic).
- ✅ All PAYE, NI, Student Loan, and Pension taxes must be auto-calculated.
- ✅ NI calculated on gross income (before pension).
- ✅ Income tax calculated on taxable income (after pension).

---

## 9️⃣ IMPLEMENTATION STATUS

### Current Implementation

**File:** `components/calculators/SalaryCalculator.tsx`

**Status:** 🚧 TO BE IMPLEMENTED (UK calculators)

### Required Implementation:

✅ **Hourly Mode:**
```typescript
const hours = parseFloat(hoursPerWeek) || 40;
const annualGross = hourlyRate * (hours * 52); // 2080 default
calculation = calculateGrossToNet('UK', annualGross, calculatorOptions);
```
- Default hours: 40/week = 2080/year ✅
- Normalizes to annual ✅
- Uses shared UK tax engine ✅

✅ **Weekly Mode:**
```typescript
const annualGross = weeklyPay * 52;
calculation = calculateGrossToNet('UK', annualGross, calculatorOptions);
```
- Multiplies by 52 weeks ✅
- Uses shared UK tax engine ✅

✅ **Monthly Mode:**
```typescript
const annualGross = monthlyPay * 12;
calculation = calculateGrossToNet('UK', annualGross, calculatorOptions);
```
- Multiplies by 12 months ✅
- Uses shared UK tax engine ✅

✅ **Daily Mode:**
```typescript
const annualGross = dailyRate * 260; // 5 days × 52 weeks
calculation = calculateGrossToNet('UK', annualGross, calculatorOptions);
```
- Multiplies by 260 working days ✅
- Uses shared UK tax engine ✅

### All Requirements:

1. ✅ No tax year input
2. ✅ No user-entered tax rates
3. ✅ Normalization to annual first
4. ✅ Shared UK tax engine
5. ✅ All time-based outputs generated
6. ✅ Tax code support
7. ✅ Pension scheme support
8. ✅ Student loan plan support
9. ✅ Employment type support (Employee/Self-Employed)

---

## 🔟 VALIDATION CHECKLIST

### Normalization Logic
- [ ] Hourly: Correctly multiplies by 2080 (or custom hours)
- [ ] Weekly: Correctly multiplies by 52
- [ ] Monthly: Correctly multiplies by 12
- [ ] Daily: Correctly multiplies by 260

### Tax Engine
- [ ] Uses shared UK tax calculation
- [ ] No duplicate tax logic
- [ ] All tax rules applied once (annually)
- [ ] Personal allowance from tax code
- [ ] NI on gross income
- [ ] Income tax on taxable income

### Employee vs Self-Employed
- [ ] Employee: Class 1 NI (12% + 2%)
- [ ] Self-Employed: Class 4 NI (9% + 2%)
- [ ] Correctly labeled in breakdown

### Student Loan Plans
- [ ] Plan 1: £22,015 threshold, 9%
- [ ] Plan 2: £27,295 threshold, 9%
- [ ] Plan 4: £25,375 threshold, 9%
- [ ] Postgraduate: £21,000 threshold, 6%
- [ ] Only applies above threshold

### Pension Contributions
- [ ] Auto-Enrolment: 5% of qualifying earnings
- [ ] Reduces taxable income
- [ ] Does NOT reduce NI-able income
- [ ] Custom pension amounts supported

### Personal Allowance
- [ ] Standard: £12,570 (1257L)
- [ ] Tapers above £100,000
- [ ] BR/D0/D1 codes: No allowance
- [ ] NT code: No tax

---

## 1️⃣1️⃣ PRODUCTION READINESS CHECKLIST

### Code Quality
- [ ] No duplicate tax calculation logic
- [ ] All modes use shared calculateGrossToNet
- [ ] Normalization formulas match spec
- [ ] Clean separation of concerns

### Accuracy
- [ ] PAYE brackets correct (2025/26)
- [ ] NI thresholds correct (£12,570 / £50,270)
- [ ] Student loan thresholds correct by plan
- [ ] Personal allowance correct (£12,570)
- [ ] Pension calculations correct

### User Experience
- [ ] Clear input labels per calculator type
- [ ] Realistic default values
- [ ] Tax code selector visible
- [ ] All optional inputs available
- [ ] Results show all time breakdowns

### Compliance with Master Spec
- [ ] No tax year input
- [ ] No user-entered tax rates
- [ ] Normalize → annual → tax → redistribute
- [ ] All inputs from master spec available

---

## 1️⃣2️⃣ COMMON PATTERNS

### Tax Calculation Pattern
```typescript
// 1. Normalize to annual
const annualGross = normalizeToAnnual(amount, frequency);

// 2. Calculate taxes (uses UK engine)
const calculation = calculateUKGrossToNet(annualGross, {
  taxCode: '1257L',
  pensionScheme: 'auto-enrolment',
  studentLoanPlan: 'plan2',
  employmentType: 'employee',
  additionalPension: 0,
  benefits: 0,
  additionalWithholding: 0
});

// 3. Redistribute results
const netHourly = calculation.netAnnual / workingHours;
const netWeekly = calculation.netAnnual / 52;
const netMonthly = calculation.netAnnual / 12;
const netDaily = calculation.netAnnual / 260;
```

### Normalization Helper
```typescript
function normalizeToAnnual(
  amount: number,
  frequency: 'hourly' | 'weekly' | 'monthly' | 'daily',
  workingHours: number = 2080
): number {
  switch (frequency) {
    case 'hourly':
      return amount * workingHours;
    case 'weekly':
      return amount * 52;
    case 'monthly':
      return amount * 12;
    case 'daily':
      return amount * 260;
    default:
      return amount;
  }
}
```

---

## 1️⃣3️⃣ TEST SCENARIOS

### Test 1: Hourly Worker (£15/hour)

**Input:**
- Hourly Rate: £15
- Working Hours: 2080
- Tax Code: 1257L
- Pension: None
- Student Loan: None

**Expected:**
```
Annual Gross: £31,200
Income Tax: £3,726 (20% on £18,630)
NI: £2,235.60 (12% on £18,630)
Total Tax: £5,961.60
Net Annual: £25,238.40
Net Hourly: £12.13
Effective Tax Rate: 19.1%
```

### Test 2: Self-Employed Weekly (£800/week)

**Input:**
- Weekly Pay: £800
- Tax Code: 1257L
- Employment: Self-Employed
- Pension: None

**Expected:**
```
Annual Gross: £41,600
Income Tax: £5,806
NI (Class 4): £2,871 (9% on £29,030 + 2% on £0)
Total Tax: £8,677
Net Annual: £32,923
Net Weekly: £633.13
Effective Tax Rate: 20.9%
```

### Test 3: Monthly with Student Loan (£4,000/month)

**Input:**
- Monthly Salary: £4,000
- Tax Code: 1257L
- Student Loan: Plan 2
- Pension: Auto-Enrolment

**Expected:**
```
Annual Gross: £48,000
Pension: £2,400 (5%)
Taxable: £32,930
Income Tax: £6,586
NI: £4,251.60
Student Loan: £1,863.45 ((£48,000 - £27,295) × 9%)
Total Tax: £12,701.05
Net Annual: £35,298.95
Net Monthly: £2,941.58
Effective Tax Rate: 26.5%
```

---

## 1️⃣4️⃣ FINAL STATUS

**UK Time-Based Calculators:** 🚧 **SPECIFICATION COMPLETE**

All 5 calculators documented and ready for implementation:
1. ✅ Hourly → Salary Calculator
2. ✅ Hourly Rate Calculator
3. ✅ Weekly → Salary Calculator
4. ✅ Monthly → Salary Calculator
5. ✅ Daily → Salary Calculator

**Ready for:**
- ✅ UK tax engine implementation
- ✅ Time-based calculator UI
- ✅ Test scenario validation
- ✅ Content creation

---

## 📝 Test URLs

Test these on your local server after implementation:
- `http://localhost:3000/calculators/uk/hourly-to-salary-calculator`
- `http://localhost:3000/calculators/uk/hourly-rate-calculator`
- `http://localhost:3000/calculators/uk/weekly-to-salary-calculator`
- `http://localhost:3000/calculators/uk/monthly-to-salary-calculator`
- `http://localhost:3000/calculators/uk/daily-to-salary-calculator`

**Test with these values:**
- Hourly: £20 → Should show ~£41,600 annual
- Weekly: £800 → Should show ~£41,600 annual
- Monthly: £3,467 → Should show ~£41,604 annual
- Daily: £160 → Should show ~£41,600 annual

All should produce similar net results (allowing for rounding).

---

**Specification Complete:** January 14, 2026
**This specification is now LOCKED. All UK time-based calculators follow this pattern.**
