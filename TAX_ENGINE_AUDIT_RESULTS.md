# Tax Engine Audit Results - 2026 Specification Compliance

**Date:** 2026-01-14
**Purpose:** Compare existing tax engine implementations against master specifications
**Scope:** Spain and Italy (Priority 1 updates needed)

---

## 🇪🇸 SPAIN TAX ENGINE AUDIT

**File:** `lib/calculators/es.ts`
**Specification:** `SPAIN_MASTER_SPEC_2026.md`
**Status:** ❌ **NEEDS MAJOR UPDATES**

### Issues Found

#### CRITICAL (Must Fix):

1. **Social Security Not Capped** ⚠️
   - **Current (Line 37-39):** `return grossAnnual * SOCIAL_SECURITY_RATE;`
   - **Spec Requirement:** Cap at €4,070/month (€48,840/year) for employees
   - **Impact:** High earners pay too much SS
   - **Fix:** `const contributionBase = Math.min(grossAnnual/12, 4070); return contributionBase * 0.0635 * 12;`

2. **No Personal Allowances** ⚠️
   - **Current:** Missing entirely
   - **Spec Requirement:** €5,550 base + €3,400 married + €2,400/€2,700/€4,000 per child
   - **Impact:** IRPF calculated incorrectly (too high)
   - **Fix:** Subtract allowances before calculating IRPF

3. **No Filing Status Support** ⚠️
   - **Current:** Only `ESCalculatorOptions { region?: ESRegion }`
   - **Spec Requirement:** `filingStatus: 'single' | 'married' | 'married_with_children' | 'head_of_household'`
   - **Impact:** Can't handle married/children deductions
   - **Fix:** Add filingStatus to options interface

4. **No Employment Type Distinction** ⚠️
   - **Current:** Only employee logic
   - **Spec Requirement:** `employmentType: 'employee' | 'autonomo'` with different SS calculations
   - **Impact:** Self-employed (autónomo) cannot use calculator
   - **Fix:** Add employmentType and progressive autónomo SS scale

5. **No Autónomo Progressive Scale** ⚠️
   - **Current:** Missing
   - **Spec Requirement:** Progressive scale from €230/month to €1,536/month based on income
   - **Impact:** Self-employed pay incorrect SS (spec lines 203-224)
   - **Fix:** Implement `calculateSeguridadSocialAutonomo()` function

6. **No Pre-Tax Deductions** ⚠️
   - **Current:** Missing
   - **Spec Requirement:** Pension max €1,500, Health insurance max €500
   - **Impact:** Tax calculated on full gross instead of taxable income
   - **Fix:** Apply deductions before tax calculation

7. **No Age-Based Allowances** 🔶
   - **Current:** Missing
   - **Spec Requirement:** €6,700 (age 65+), €8,100 (age 75+)
   - **Impact:** Seniors pay too much tax
   - **Fix:** Add age parameter and adjust allowance

8. **No Children Deductions** ⚠️
   - **Current:** Missing
   - **Spec Requirement:** €2,400 first child, €2,700 second, €4,000 each after
   - **Impact:** Families pay too much tax
   - **Fix:** Add numberOfChildren parameter

### Correct Implementation:

✅ **IRPEF Brackets:** Correct (19%/24%/30%/37%/45%/47%)
✅ **Regional Tax:** Implemented with ES_REGIONS
✅ **Progressive Tax Function:** Works correctly

### Required Changes Summary:

**Update `ESCalculatorOptions` interface:**
```typescript
export interface ESCalculatorOptions {
  region?: ESRegion;
  filingStatus?: 'single' | 'married' | 'married_with_children' | 'head_of_household';
  employmentType?: 'employee' | 'autonomo';
  pensionContribution?: number;
  healthInsurance?: number;
  numberOfChildren?: number;
  age?: number;
}
```

**Update calculation logic:**
1. Apply pre-tax deductions
2. Calculate personal allowance (base + married + children + age)
3. Subtract allowance from taxable income before IRPF
4. Cap employee SS at €4,070/month
5. Use progressive scale for autónomo SS

**Estimated Lines to Change:** ~50 lines (major refactor)

---

## 🇮🇹 ITALY TAX ENGINE AUDIT

**File:** `lib/calculators/it.ts`
**Specification:** `ITALY_MASTER_SPEC_2026.md`
**Status:** ❌ **NEEDS MAJOR UPDATES**

### Issues Found

#### CRITICAL (Must Fix):

1. **WRONG IRPEF BRACKETS** ⚠️⚠️⚠️
   - **Current (Lines 10-14):** 3 brackets
     ```typescript
     { min: 0, max: 28000, rate: 0.23 },
     { min: 28000, max: 50000, rate: 0.35 },
     { min: 50000, max: Infinity, rate: 0.43 }
     ```
   - **Spec Requirement (2026):** 5 brackets
     ```typescript
     { min: 0, max: 15000, rate: 0.23 },
     { min: 15000, max: 28000, rate: 0.25 },  // MISSING
     { min: 28000, max: 50000, rate: 0.35 },
     { min: 50000, max: 75000, rate: 0.43 },  // MISSING
     { min: 75000, max: Infinity, rate: 0.43 }
     ```
   - **Impact:** Tax calculated incorrectly for ALL income levels
   - **Fix:** Add missing brackets at €15k-€28k (25%) and €50k-€75k (43%)

2. **No Personal Deduction** ⚠️
   - **Current:** IRPEF calculated directly on gross
   - **Spec Requirement:** Income-dependent deduction (€1,880 max at low income, €0 at €50k+)
   - **Formula:**
     - ≤€15k: €1,880
     - €15k-€28k: €1,910 + €1,190 × ((€28,000 - income) / €13,000)
     - €28k-€50k: €1,910 × ((€50,000 - income) / €22,000)
     - >€50k: €0
   - **Impact:** All taxpayers pay too much IRPEF
   - **Fix:** Calculate IRPEF gross, then subtract personal deduction

3. **Deduction Applied Wrong** ⚠️
   - **Current:** Deduction would be applied to taxable income (if implemented)
   - **Spec Requirement:** Apply deduction to IRPEF TAX amount, not income
   - **Fix:** `const irpef = Math.max(0, irpefGross - personalDeduction - dependentDeductions);`

4. **No Dependent Deductions** ⚠️
   - **Current:** Missing
   - **Spec Requirement:**
     - Spouse: up to €800 (phases out €40k-€80k)
     - Children: €950 each (first 3), €1,220 each (4+)
   - **Impact:** Married taxpayers with dependents pay too much
   - **Fix:** Add dependent deduction calculation

5. **No Filing Status** ⚠️
   - **Current:** Only region option
   - **Spec Requirement:** `filingStatus: 'single' | 'married' | 'married_with_children' | 'head_of_household'`
   - **Impact:** Can't apply spouse/dependent deductions
   - **Fix:** Add filingStatus parameter

6. **No Employment Type** ⚠️
   - **Current:** Only employee logic (9.19%)
   - **Spec Requirement:** Employee 9.19% uncapped, Self-employed 25.97% capped at €113,520
   - **Impact:** Self-employed cannot use calculator
   - **Fix:** Add employmentType and self-employed logic

7. **No Self-Employed INPS Cap** ⚠️
   - **Current:** N/A (not implemented)
   - **Spec Requirement:** Cap at €113,520 for self-employed
   - **Impact:** High-earning self-employed pay too much
   - **Fix:** `const contributionBase = Math.min(grossAnnual, 113520);`

8. **Regional/Municipal Tax on Wrong Base** 🔶
   - **Current (Lines 46-47):** Applied to gross
   - **Spec Requirement:** Applied to taxable income (same base as IRPEF), NO deductions apply
   - **Impact:** Minor discrepancy
   - **Fix:** Change to `taxableIncome * regionalRate`

9. **No Pre-Tax Deductions** ⚠️
   - **Current:** Missing
   - **Spec Requirement:** Pension, health insurance (no strict caps but max 50% of gross)
   - **Impact:** Tax calculated on full gross
   - **Fix:** Add pre-tax deduction support

### Correct Implementation:

✅ **Regional Tax:** Implemented with IT_REGIONS
✅ **Municipal Tax:** Included (though applied to wrong base)
✅ **INPS Rate:** Correct (9.19%)

### Required Changes Summary:

**Update `ITCalculatorOptions` interface:**
```typescript
export interface ITCalculatorOptions {
  region?: ITRegion;
  filingStatus?: 'single' | 'married' | 'married_with_children' | 'head_of_household';
  employmentType?: 'employee' | 'self_employed';
  pensionContribution?: number;
  healthInsurance?: number;
  otherDeductions?: number;
  numberOfDependents?: number;
  municipalityRate?: number; // Override default 0.8%
}
```

**Update IRPEF brackets:**
- Add €15k-€28k @ 25%
- Add €50k-€75k @ 43%

**Update calculation logic:**
1. Apply pre-tax deductions to get taxable income
2. Calculate IRPEF gross on taxable income
3. Calculate personal deduction (income-dependent formula)
4. Calculate dependent deductions (spouse + children)
5. Subtract deductions from IRPEF tax: `irpef = irpefGross - personalDeduction - dependentDeductions`
6. Regional/municipal tax on taxable income (no deductions)
7. INPS on gross (employee uncapped, self-employed capped at €113,520)

**Estimated Lines to Change:** ~60 lines (major refactor)

---

## Priority Order

### Immediate (Phase 2.1):
1. ✅ **Spain:** Update to full spec (50 lines)
2. ✅ **Italy:** Update to full spec (60 lines)

### Validation (Phase 2.2):
3. ⚠️ Canada, Australia, Germany, France - Spot-check against specs

---

## Test Plan

After updates, validate with spec examples:

**Spain:**
- Example 1: Monthly €3,000 (madrid, single, employee) → Net: €2,201.13
- Example 2: Hourly €25 @ 1,826 hrs → Net: €17.64/hr
- Example 3: Bonus €5,000 on €40k base → Bonus net: €2,884.25
- Example 4: Autónomo €2,500/month → Net: €1,701.63
- ... (7 examples total from spec)

**Italy:**
- Example 1: Monthly €3,000 (Milan, single, employee) → Net: €1,940.07
- Example 2: Hourly €25 @ 1,824 hrs (Rome) → Net: €15.05/hr
- Example 3: Bonus €5,000 on €40k base → Bonus net: €2,200
- Example 4: Self-employed €50k (Rome) → Net: €21,000 (58% effective rate!)
- ... (7 examples total from spec)

---

**Next Steps:**
1. Update Spain tax engine (`lib/calculators/es.ts`)
2. Update Italy tax engine (`lib/calculators/it.ts`)
3. Test with all spec examples
4. Move to Phase 3: Time-based calculators
