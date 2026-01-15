# 🇮🇪 IRELAND TIME-BASED SALARY CALCULATORS (MASTER SPECIFICATION)

**Status:** ✅ Production Standard
**Date:** January 14, 2026
**Inherits From:** IE_CALCULATOR_MASTER_SPEC.md

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

They only **normalize income to annual**, then **reuse the Ireland tax engine**.

---

## 1️⃣ CORE PRINCIPLES (DO NOT BREAK)

- ❌ No tax year input
- ❌ No manual tax rates / USC / PRSI rates
- ❌ No user-entered tax credits
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
- **Unit:** EUR (€)
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

#### 3. Marital Status
- **Type:** Select
- **Options:**
  - Single
  - Married / Civil Partner
  - Widowed / Surviving Civil Partner
- **Default:** Single

#### 4. Employment Type
- **Type:** Select
- **Options:**
  - Employee (PAYE)
  - Self-Employed
- **Default:** Employee

---

### 2️⃣ Optional Advanced Inputs (Collapsed)

#### 5. Working Hours (Hourly Only)
- **Type:** Number
- **Default:** 2028 (39 hours/week × 52 weeks)
- **Description:** Used to convert hourly → annual income
- **Note:** Ireland standard week is 39 hours

#### 6. Pension Contribution (Pre-Tax)
- **Type:** Number (EUR)
- **Default:** €0
- **Description:** Pre-tax pension contributions

#### 7. Health Insurance (Employer-Sponsored)
- **Type:** Number (EUR)
- **Default:** €0
- **Description:** Pre-tax health insurance

#### 8. Other Pre-Tax Benefits
- **Type:** Number (EUR)
- **Default:** €0
- **Examples:** Bike-to-work scheme

#### 9. Dependents
- **Type:** Number
- **Default:** 0
- **Note:** May affect tax credits (simplified)

#### 10. Additional Tax Withholding
- **Type:** Number (EUR)
- **Default:** €0
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
workingHours = 2028 (39 hours/week × 52 weeks)
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
→ pre-tax deductions (pension, health insurance, benefits)
→ taxable income
→ income tax (20% / 40% with tax credits)
→ USC (progressive: 0.5%, 2%, 4.5%, 8%)
→ PRSI (4% if above threshold)
→ total tax
→ net income
```

💡 **This is identical to the Ireland Salary Calculator logic.**

### Critical Rules:

1. **Income Tax** on taxable income (after pre-tax deductions)
2. **Tax Credits** reduce income tax liability
3. **USC** on gross income (progressive bands)
4. **PRSI** on gross income (4% if above €18,304)
5. **Pension** reduces taxable income (not USC/PRSI)

---

## 5️⃣ REQUIRED OUTPUTS

### Core Outputs

- Gross Annual Income
- Pre-Tax Deductions (if applicable)
- Taxable Income
- Income Tax (after credits)
- Universal Social Charge (USC)
- PRSI
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
- Hourly Rate: €20
- Working Hours: 2028
- Marital Status: Single
- Employment Type: Employee

**Calculation:**
```
Annual Gross = €20 × 2028 = €40,560

Pre-Tax Deductions: €0
Taxable Income: €40,560

Income Tax (Before Credits):
  €40,000 × 20% = €8,000
  €560 × 40% = €224
  Total: €8,224

Tax Credits:
  Single: €1,775
  PAYE: €1,775
  Total: €3,550

Income Tax (After Credits):
  €8,224 - €3,550 = €4,674

USC:
  €12,012 × 0.5% = €60.06
  (€22,920 - €12,012) × 2% = €218.16
  (€40,560 - €22,920) × 4.5% = €793.80
  Total USC: €1,072.02

PRSI:
  €40,560 × 4% = €1,622.40

Total Tax: €4,674 + €1,072.02 + €1,622.40 = €7,368.42
Net Annual: €40,560 - €7,368.42 = €33,191.58

Net Hourly: €33,191.58 ÷ 2028 = €16.37
Net Weekly: €33,191.58 ÷ 52 = €638.30
Net Monthly: €33,191.58 ÷ 12 = €2,765.97

Effective Tax Rate: 18.2%
```

### Example – Monthly Salary

**Input:**
- Monthly Pay: €3,500
- Marital Status: Married
- Employment Type: Employee
- Pension: €350/month (10%)

**Calculation:**
```
Annual Gross = €3,500 × 12 = €42,000

Pre-Tax Deductions: €350 × 12 = €4,200 (pension)
Taxable Income: €42,000 - €4,200 = €37,800

Standard Rate Band (Married): €49,000

Income Tax (Before Credits):
  €37,800 × 20% = €7,560 (all in standard band)

Tax Credits:
  Married: €3,550
  PAYE: €1,775
  Total: €5,325

Income Tax (After Credits):
  €7,560 - €5,325 = €2,235

USC (on gross €42,000):
  €12,012 × 0.5% = €60.06
  (€22,920 - €12,012) × 2% = €218.16
  (€42,000 - €22,920) × 4.5% = €858.60
  Total USC: €1,136.82

PRSI:
  €42,000 × 4% = €1,680

Total Tax: €2,235 + €1,136.82 + €1,680 = €5,051.82
Net Annual: €42,000 - €5,051.82 = €36,948.18

Net Monthly: €36,948.18 ÷ 12 = €3,079.02
Net Weekly: €36,948.18 ÷ 52 = €710.54

Effective Tax Rate: 12.0%
```

### Example – Self-Employed Weekly

**Input:**
- Weekly Pay: €1,000
- Marital Status: Single
- Employment Type: Self-Employed

**Calculation:**
```
Annual Gross = €1,000 × 52 = €52,000

Pre-Tax Deductions: €0
Taxable Income: €52,000

Income Tax (Before Credits):
  €40,000 × 20% = €8,000
  €12,000 × 40% = €4,800
  Total: €12,800

Tax Credits:
  Single: €1,775
  PAYE: €0 (self-employed don't get PAYE credit)
  Total: €1,775

Income Tax (After Credits):
  €12,800 - €1,775 = €11,025

USC:
  €12,012 × 0.5% = €60.06
  (€22,920 - €12,012) × 2% = €218.16
  (€52,000 - €22,920) × 4.5% = €1,308.60
  Total USC: €1,586.82

PRSI (Self-Employed):
  €52,000 × 4% = €2,080

Total Tax: €11,025 + €1,586.82 + €2,080 = €14,691.82
Net Annual: €52,000 - €14,691.82 = €37,308.18

Net Weekly: €37,308.18 ÷ 52 = €717.47

Effective Tax Rate: 28.3%
```

---

## 7️⃣ SEO / UX NOTES

### Page Messaging

✅ **Use:**
- "Converted to annual salary before taxes"
- "Taxes calculated once for accuracy"
- "Same results as salary calculator"
- "Calculated using current Ireland tax rules (Income Tax, USC, PRSI)"
- "Includes 2026 tax rates and credits"

❌ **Avoid:**
- "Estimated"
- "Approximate"
- "Based on average tax"

### Educational Notes

Add helpful context:
- "Income tax reduced by personal and PAYE tax credits"
- "USC is calculated on your gross pay"
- "PRSI only applies if you earn over €352 per week"
- "Pension contributions reduce your taxable income"

---

## 8️⃣ STRICT CURSOR / CLAUDE PROMPT

**IMPORTANT RULES:**
- ⚠️ This calculator converts income to annual salary first, then applies Ireland tax rules.
- ❌ Do NOT ask user for tax year or tax rates.
- ❌ Do NOT calculate tax per period.
- ❌ Do NOT ask for pay frequency (it's implicit per calculator type).
- ✅ Always calculate tax annually, then redistribute.
- ✅ Tax credits from marital status (automatic).
- ✅ All Income Tax, USC, and PRSI must be auto-calculated.
- ✅ USC and PRSI calculated on gross income.
- ✅ Income tax calculated on taxable income (after pension).

---

## 9️⃣ VALIDATION CHECKLIST

### Normalization Logic
- [ ] Hourly: Correctly multiplies by 2028 (or custom hours)
- [ ] Weekly: Correctly multiplies by 52
- [ ] Monthly: Correctly multiplies by 12
- [ ] Daily: Correctly multiplies by 260

### Tax Engine
- [ ] Uses shared Ireland tax calculation
- [ ] No duplicate tax logic
- [ ] All tax rules applied once (annually)
- [ ] Tax credits from marital status
- [ ] USC on gross income (progressive)
- [ ] PRSI on gross income (with threshold)
- [ ] Income tax on taxable income

### Marital Status
- [ ] Single: €40,000 standard rate band
- [ ] Married: €49,000 standard rate band
- [ ] Single: €3,550 total credits (€1,775 + €1,775)
- [ ] Married: €5,325 total credits (€3,550 + €1,775)

### Employee vs Self-Employed
- [ ] Employee: Gets PAYE credit (€1,775)
- [ ] Self-Employed: No PAYE credit
- [ ] Both: PRSI 4% (different thresholds)

### USC Bands
- [ ] €0 - €12,012: 0.5%
- [ ] €12,013 - €22,920: 2.0%
- [ ] €22,921 - €70,044: 4.5%
- [ ] €70,045+: 8.0%
- [ ] Exempt if < €13,000

### PRSI Thresholds
- [ ] Employee: €18,304 annual threshold
- [ ] Self-Employed: €5,000 annual threshold
- [ ] 4% on ALL income if above threshold

---

## 🔟 TEST SCENARIOS

### Test 1: Hourly Worker (€15/hour)

**Input:**
- Hourly Rate: €15
- Working Hours: 2028
- Marital Status: Single
- Employment Type: Employee

**Expected:**
```
Annual Gross: €30,420
Income Tax: €2,508
USC: €541.86
PRSI: €1,216.80
Total Tax: €4,266.66
Net Annual: €26,153.34
Net Hourly: €12.89
Effective Tax Rate: 14.0%
```

### Test 2: Self-Employed Weekly (€800/week)

**Input:**
- Weekly Pay: €800
- Marital Status: Single
- Employment Type: Self-Employed

**Expected:**
```
Annual Gross: €41,600
Income Tax: €5,495 (no PAYE credit)
USC: €1,113.72
PRSI: €1,664
Total Tax: €8,272.72
Net Annual: €33,327.28
Net Weekly: €640.91
Effective Tax Rate: 19.9%
```

### Test 3: Monthly with Pension (€4,500/month)

**Input:**
- Monthly Salary: €4,500
- Marital Status: Married
- Pension: €450/month (10%)
- Employment Type: Employee

**Expected:**
```
Annual Gross: €54,000
Pension: €5,400
Taxable: €48,600
Income Tax: €4,395 (€49,000 standard band)
USC: €1,466.22
PRSI: €2,160
Total Tax: €8,021.22
Net Annual: €45,978.78
Net Monthly: €3,831.57
Effective Tax Rate: 14.9%
```

---

## 1️⃣1️⃣ FINAL STATUS

**Ireland Time-Based Calculators:** ✅ **SPECIFICATION COMPLETE**

All 5 calculators documented and ready for implementation:
1. ✅ Hourly → Salary Calculator
2. ✅ Hourly Rate Calculator
3. ✅ Weekly → Salary Calculator
4. ✅ Monthly → Salary Calculator
5. ✅ Daily → Salary Calculator

**Ready for:**
- ✅ Ireland tax engine implementation
- ✅ Time-based calculator UI
- ✅ Test scenario validation
- ✅ Content creation

---

**Specification Complete:** January 14, 2026
**This specification is now LOCKED. All Ireland time-based calculators follow this pattern.**
