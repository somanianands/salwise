# 🇺🇸 USA Calculator Implementation Audit

**Date:** January 14, 2026
**Status:** 🟡 In Progress
**Reference:** US_CALCULATOR_MASTER_SPEC.md

---

## ✅ WHAT'S WORKING

### Current Implementation Strengths:

1. **✅ NO TAX YEAR INPUT**
   - Currently NOT asking users for tax year
   - Using hardcoded 2024 tax rules
   - **Status:** ✅ Compliant

2. **✅ AUTO-CALCULATED TAXES**
   - Users don't manually enter tax rates
   - All taxes calculated internally
   - **Status:** ✅ Compliant

3. **✅ Multiple Calculator Modes**
   - Gross-to-Net ✅
   - Net-to-Gross ✅
   - Hourly ✅
   - Weekly ✅
   - Monthly ✅
   - Daily ✅
   - Overtime ✅
   - Bonus ✅
   - Commission ✅
   - Contractor ✅
   - **Status:** ✅ All modes implemented

4. **✅ Advanced Options (Partial)**
   - State selection ✅
   - Filing Status ✅
   - 401(k) ✅
   - Traditional IRA ✅
   - HSA ✅
   - Dependents ✅
   - **Status:** 🟡 Exists but needs reorganization

---

## ❌ GAPS AGAINST MASTER SPEC

### 1. Input Organization (HIGH PRIORITY)

**Issue:** Inputs are not organized per master spec

**Current State:**
- State → Hidden in "Advanced Options"
- Filing Status → Hidden in "Advanced Options"
- Employment Type → Missing entirely

**Master Spec Requires:**
- State → **Core Input (Always Visible)**
- Filing Status → **Core Input (Always Visible)**
- Employment Type → **Core Input (Always Visible)**

**Action Required:**
1. Move State to main form (always visible)
2. Move Filing Status to main form (always visible)
3. Add Employment Type selector (Employee / Self-Employed)

---

### 2. Missing Inputs

#### ❌ Employment Type (CRITICAL)
- **Required:** Yes
- **Options:** Employee, Self-Employed
- **Impact:** Determines FICA split (6.2% vs 12.4%)
- **Location:** Should be Core Input (always visible)
- **Priority:** 🔴 HIGH

#### ❌ Health Insurance (Pre-Tax)
- **Type:** Number (USD/year)
- **Default:** 0
- **Location:** Should be in Advanced Options (collapsed)
- **Priority:** 🟡 MEDIUM

#### ❌ Other Pre-Tax Deductions
- **Type:** Number (USD/year)
- **Default:** 0
- **Examples:** Commuter benefits, employer benefits
- **Location:** Should be in Advanced Options (collapsed)
- **Priority:** 🟡 MEDIUM

#### ❌ Additional Withholding
- **Type:** Number (USD/year)
- **Default:** 0
- **Location:** Power User Overrides (hidden)
- **Priority:** 🟢 LOW

#### ❌ Working Hours Override
- **Type:** Number
- **Default:** 2080
- **Currently:** Only used internally for hourly mode
- **Should:** Be available as power user override
- **Priority:** 🟢 LOW

---

### 3. Tax Calculation Engine Gaps

**File:** `lib/tax-calculations.ts`

#### Issues:

1. **❌ Self-Employment Tax**
   - Currently: Only employee FICA (6.2% + 1.45%)
   - Needed: Self-employed tax (12.4% + 2.9%)
   - Priority: 🔴 HIGH

2. **❌ Additional Medicare Tax**
   - Threshold: $200k (single), $250k (married jointly)
   - Rate: 0.9% on excess
   - Currently: Not implemented
   - Priority: 🔴 HIGH

3. **❌ Standard Deduction by Filing Status**
   - Single: $14,600 (2024)
   - Married Filing Jointly: $29,200
   - Head of Household: $21,900
   - Currently: Using simplified calculation
   - Priority: 🟡 MEDIUM

4. **❌ All 50 States + DC Tax Logic**
   - Currently: Simplified flat rate per state
   - Needed: Progressive brackets for states with them (CA, NY, etc.)
   - Priority: 🟡 MEDIUM

---

### 4. Output Requirements

**Master Spec Requires:**

#### Core Outputs ✅
- Gross Annual Income ✅
- Federal Income Tax ✅
- State Income Tax ✅
- Social Security Tax ✅
- Medicare Tax ✅
- Total Tax ✅
- Net Annual Pay ✅

#### Time Breakdown ✅
- Net Monthly Pay ✅
- Net Weekly Pay ✅
- Net Hourly Pay ✅

#### Analytics 🟡
- Effective Tax Rate (%) → **Needs verification**

**Status:** 🟢 Mostly compliant, verify effective rate calculation

---

## 📋 PRIORITIZED ACTION PLAN

### Phase 1: Critical Fixes (Do First)

#### 1.1 Add Employment Type Input
**Priority:** 🔴 CRITICAL
**Files:** `AdvancedOptions.tsx`, `SalaryCalculator.tsx`
**Tasks:**
- [ ] Add `employmentType` field to `AdvancedCalculatorOptions`
- [ ] Add Employment Type selector in main form (not advanced)
- [ ] Default to "Employee"
- [ ] Update tax calculations to use this field

#### 1.2 Implement Self-Employment Tax
**Priority:** 🔴 CRITICAL
**Files:** `lib/tax-calculations.ts`, `lib/calculators/index.ts`
**Tasks:**
- [ ] Add SE tax calculation (12.4% SS + 2.9% Medicare)
- [ ] Apply to contractors and self-employed
- [ ] Test with contractor calculator mode

#### 1.3 Implement Additional Medicare Tax
**Priority:** 🔴 CRITICAL
**Files:** `lib/tax-calculations.ts`
**Tasks:**
- [ ] Add 0.9% tax on income above threshold
- [ ] Thresholds by filing status:
  - Single: $200,000
  - Married Filing Jointly: $250,000
  - Married Filing Separately: $125,000
  - Head of Household: $200,000

---

### Phase 2: Reorganize Inputs

#### 2.1 Move Inputs to Core (Always Visible)
**Priority:** 🟡 HIGH
**Files:** `SalaryCalculator.tsx`, `AdvancedOptions.tsx`
**Tasks:**
- [ ] Move State selector to main form
- [ ] Move Filing Status to main form
- [ ] Keep all other inputs in collapsed "Advanced Options"

#### 2.2 Add Missing Optional Inputs
**Priority:** 🟡 MEDIUM
**Files:** `AdvancedOptions.tsx`
**Tasks:**
- [ ] Add Health Insurance (Pre-Tax) field
- [ ] Add Other Pre-Tax Deductions field
- [ ] Add Additional Withholding (hidden/power user section)

---

### Phase 3: Tax Engine Improvements

#### 3.1 Standard Deduction by Filing Status
**Priority:** 🟡 MEDIUM
**Files:** `lib/tax-calculations.ts`
**Tasks:**
- [ ] Implement correct 2024 standard deductions:
  - Single: $14,600
  - Married Filing Jointly: $29,200
  - Married Filing Separately: $14,600
  - Head of Household: $21,900

#### 3.2 Progressive State Tax Brackets
**Priority:** 🟡 MEDIUM
**Files:** `lib/extended-types.ts`, `lib/tax-calculations.ts`
**Tasks:**
- [ ] Implement progressive brackets for CA, NY, and other states
- [ ] Keep simplified flat rate for states with flat tax
- [ ] Document which states use progressive vs flat

---

### Phase 4: Testing & Validation

#### 4.1 Test All Calculator Modes
**Priority:** 🟡 MEDIUM
**Tasks:**
- [ ] Test salary calculator with all filing statuses
- [ ] Test hourly → salary with employee vs self-employed
- [ ] Test overtime calculator
- [ ] Test bonus tax calculator
- [ ] Test commission calculator
- [ ] Test contractor calculator (self-employment)
- [ ] Verify all states calculate correctly

#### 4.2 Accuracy Validation
**Priority:** 🟡 MEDIUM
**Tasks:**
- [ ] Compare results with IRS tax calculator
- [ ] Compare with ADP salary calculator
- [ ] Validate Social Security wage cap ($168,600 for 2024)
- [ ] Validate Medicare thresholds
- [ ] Document accuracy limitations

---

## 🎯 COMPLETION CRITERIA

### Before marking USA as "Production Ready":

- [ ] All Phase 1 (Critical) tasks completed
- [ ] All Phase 2 (Reorganize) tasks completed
- [ ] Employment Type fully functional
- [ ] Self-employment tax working
- [ ] Additional Medicare tax working
- [ ] All inputs organized per master spec
- [ ] All calculator modes tested
- [ ] Accuracy validated against IRS calculator

---

## 📁 FILES TO UPDATE

### Primary Files:
1. `components/calculators/SalaryCalculator.tsx` - Main calculator UI
2. `components/calculators/AdvancedOptions.tsx` - Input organization
3. `lib/tax-calculations.ts` - Tax calculation engine
4. `lib/calculators/index.ts` - Calculator logic
5. `lib/calculators/contractor.ts` - Self-employment specific
6. `lib/extended-types.ts` - Type definitions

### Testing Files:
- Create `lib/calculators/__tests__/us-tax-calculations.test.ts`
- Add test cases for all scenarios

---

## 🚀 NEXT IMMEDIATE STEPS

1. **Start with Phase 1.1:** Add Employment Type input
2. **Then Phase 1.2:** Implement self-employment tax
3. **Then Phase 1.3:** Implement additional Medicare tax
4. **Test thoroughly** with all calculator modes

Once Phase 1 is complete, USA calculators will be functionally accurate for the most critical scenarios (employee vs self-employed).

---

**Last Updated:** January 14, 2026
**Next Review:** After Phase 1 completion
