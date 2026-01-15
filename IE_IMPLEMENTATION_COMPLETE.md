# 🇮🇪 IRELAND Calculator System - SPECIFICATION COMPLETE

**Date:** January 14, 2026
**Status:** ✅ SPECIFICATION COMPLETE - READY FOR IMPLEMENTATION
**Total Calculators:** 13 calculators documented

---

## 🎉 WHAT'S BEEN ACCOMPLISHED

### 📋 Documentation Created

1. **`IE_CALCULATOR_MASTER_SPEC.md`** ✅
   - Complete master specification for all Ireland calculators
   - The gold standard for Ireland salary calculations
   - Defines all inputs, outputs, formulas, and rules
   - Covers all 13 Ireland calculators
   - Complete Income Tax, USC, and PRSI rules

2. **`IE_TIME_BASED_CALCULATORS_SPEC.md`** ✅
   - Specification for Hourly/Weekly/Monthly/Daily calculators
   - Normalization logic clearly defined (39 hours/week standard)
   - Reuses core Ireland tax engine

3. **`IE_VARIABLE_PAY_CALCULATORS_SPEC.md`** ✅
   - Specification for Bonus/Overtime/Commission calculators
   - Marginal tax calculation approach
   - No flat bonus rates
   - All three tax components included

---

## 💻 SPECIFICATION OVERVIEW

### ✅ All 13 Ireland Calculators Documented

**Core Calculators (3):**
1. ✅ Salary Calculator (Gross → Net)
2. ✅ Net → Gross Calculator
3. ✅ Take Home Pay Calculator

**Time-Based Calculators (5):**
4. ✅ Hourly → Salary Calculator
5. ✅ Hourly Rate Calculator
6. ✅ Weekly → Salary Calculator
7. ✅ Monthly → Salary Calculator
8. ✅ Daily → Salary Calculator

**Variable Pay Calculators (3):**
9. ✅ Overtime Pay Calculator
10. ✅ Bonus Tax Calculator
11. ✅ Commission Calculator

**Additional:**
12. ✅ Salary After Tax Calculator
13. ✅ Gross to Net Calculator

---

## 📊 IRELAND TAX SYSTEM DOCUMENTED

### Complete 2026 Tax Rules

**Income Tax Bands:**
- Standard Rate: 20% (€0 - €40,000 single, €0 - €49,000 married)
- Higher Rate: 40% (Above standard rate band)

**Tax Credits (2026):**
- Single Person: €1,775
- Married / Civil Partner: €3,550
- PAYE Credit (employees only): €1,775
- Total (Single Employee): €3,550
- Total (Married Employee): €5,325

**Universal Social Charge (USC) - Progressive:**
- 0.5% on €0 - €12,012
- 2.0% on €12,013 - €22,920
- 4.5% on €22,921 - €70,044
- 8.0% on €70,045+
- Exempt if income < €13,000

**Pay Related Social Insurance (PRSI):**
- Employee (Class A): 4.0% (if ≥ €18,304 annually)
- Self-Employed (Class S): 4.0% (if ≥ €5,000 annually)
- Employer: 11.05% (reference only, not deducted from employee)

**Pre-Tax Deductions:**
- Pension contributions reduce taxable income
- Health insurance reduces taxable income
- Other pre-tax benefits reduce taxable income

---

## 🔑 KEY FEATURES SPECIFIED

### A. Core Design Principles

1. **No Tax Year Input** ✅
   - Always use 2026 rules
   - Update centrally

2. **No User-Entered Tax Rates** ✅
   - Users never input Income Tax rates
   - Users never input USC rates
   - Users never input PRSI rates
   - Users never input tax credits

3. **Marital Status System** ✅
   - Single: €40,000 standard rate band, €3,550 credits
   - Married: €49,000 standard rate band, €5,325 credits
   - Determines standard rate cutoff and tax credits

4. **Normalize → Tax → Redistribute** ✅
   - All inputs normalize to annual
   - Tax calculated once on annual gross
   - Results redistributed to all time periods

### B. Critical Tax Calculation Rules

1. **Income Tax on TAXABLE Income** ✅
   - Calculated AFTER pre-tax deductions
   - Progressive: 20%, 40%
   - THEN subtract tax credits

2. **USC on GROSS Income** ✅
   - Calculated BEFORE any deductions
   - Progressive: 0.5%, 2%, 4.5%, 8%
   - Exempt if < €13,000

3. **PRSI on GROSS Income** ✅
   - Calculated BEFORE any deductions
   - 4% flat rate
   - Only if above threshold

4. **Pension Reduces Taxable Only** ✅
   - Pre-tax for income tax
   - NOT pre-tax for USC/PRSI

### C. Employment Types

**Employee (PAYE):**
- Gets PAYE credit (€1,775)
- PRSI threshold: €18,304
- Can claim overtime

**Self-Employed:**
- No PAYE credit
- PRSI threshold: €5,000
- No overtime (contractually)

---

## 📖 SPECIFICATION QUALITY

### Complete Documentation Structure:

Each specification includes:
- ✅ Core design principles
- ✅ Input specifications (required & optional)
- ✅ Tax calculation formulas with bands
- ✅ Output specifications
- ✅ Implementation examples with full calculations
- ✅ Common pitfalls to avoid
- ✅ Validation checklists
- ✅ Test scenarios
- ✅ Cursor/Claude implementation rules

### Example Calculations Provided:

**Single Employee (€35,000):**
```
Income Tax: €3,450 (after €3,550 credits)
USC: €821.82
PRSI: €1,400
Total Tax: €5,671.82
Net: €29,328.18
Effective Rate: 16.2%
```

**Married with Pension (€60,000):**
```
Income Tax: €6,475 (after €5,325 credits)
USC: €1,946.82
PRSI: €2,400
Total Tax: €10,821.82
Net: €49,178.18
Effective Rate: 18.0%
```

**High Earner (€100,000):**
```
Income Tax: €28,450 (40% on €60k above standard)
USC: €4,795.28 (hits 8% top band)
PRSI: €4,000
Total Tax: €37,245.28
Net: €62,754.72
Effective Rate: 37.2%
```

---

## 🎯 COMPLIANCE WITH GOLD STANDARD

| Requirement | Status |
|------------|--------|
| ❌ No tax year input | ✅ COMPLIANT |
| ❌ No user-entered tax rates | ✅ COMPLIANT |
| ✅ Auto-calculated taxes | ✅ COMPLIANT |
| ✅ Marital status system | ✅ COMPLIANT |
| ✅ Employment types | ✅ COMPLIANT |
| ✅ Time-based normalization | ✅ COMPLIANT |
| ✅ Variable pay logic | ✅ COMPLIANT |
| ✅ Three tax components | ✅ COMPLIANT |

---

## 🚀 IMPLEMENTATION ROADMAP

### Phase 1: Ireland Tax Engine (Priority 1)

**File:** `lib/calculators/ie.ts`

**Required Functions:**
```typescript
export function calculateIEGrossToNet(
  grossAnnual: number,
  options: IECalculatorOptions
): SalaryCalculation

export function calculateIENetToGross(
  netAnnual: number,
  options: IECalculatorOptions
): SalaryCalculation

interface IECalculatorOptions {
  maritalStatus?: MaritalStatus;     // Single / Married / Widowed
  employmentType?: EmploymentType;   // Employee / Self-Employed
  pensionContribution?: number;
  healthInsurance?: number;
  otherPreTaxBenefits?: number;
  dependents?: number;
  additionalWithholding?: number;
}
```

**Implementation Tasks:**
- [ ] Standard rate band calculation (by marital status)
- [ ] Progressive income tax brackets (20%, 40%)
- [ ] Tax credits calculation (personal + PAYE)
- [ ] USC progressive bands (0.5%, 2%, 4.5%, 8%)
- [ ] PRSI with threshold (4%)
- [ ] Pre-tax deduction handling

**Estimated Time:** 8-12 hours

### Phase 2: Time-Based Calculators (Priority 2)

**Implementation Tasks:**
- [ ] Hourly normalization (× 2028, 39 hours/week)
- [ ] Weekly normalization (× 52)
- [ ] Monthly normalization (× 12)
- [ ] Daily normalization (× 260)
- [ ] Redistribution logic

**Estimated Time:** 4-6 hours

### Phase 3: Variable Pay Calculators (Priority 3)

**Files:**
- `lib/calculators/ie-overtime.ts`
- `lib/calculators/ie-bonus.ts`
- `lib/calculators/ie-commission.ts`

**Implementation Tasks:**
- [ ] Overtime calculator with weeks parameter
- [ ] Bonus calculator with comparison logic
- [ ] Commission calculator with frequency normalization

**Estimated Time:** 6-8 hours

### Phase 4: Testing & Validation (Priority 4)

**Tasks:**
- [ ] Unit tests for Ireland tax engine
- [ ] Integration tests for all calculators
- [ ] Test with documented scenarios
- [ ] Verify USC progressive calculation
- [ ] Edge case testing (high earners, USC top band)

**Estimated Time:** 8-10 hours

### Phase 5: UI Components (Priority 5)

**Tasks:**
- [ ] Marital status selector
- [ ] Employment type selector
- [ ] Ireland-specific advanced options
- [ ] Tax breakdown display (Income Tax, USC, PRSI)

**Estimated Time:** 4-6 hours

### Phase 6: Content Creation (Priority 6)

**Tasks:**
- [ ] Create content for 13 Ireland calculator pages
- [ ] SEO optimization
- [ ] Educational content about Irish taxes

**Estimated Time:** 14-18 hours

---

## ⏱️ TOTAL ESTIMATED IMPLEMENTATION TIME

**Total:** 44-60 hours

**Breakdown:**
- Ireland Tax Engine: 8-12 hours
- Time-Based Calculators: 4-6 hours
- Variable Pay Calculators: 6-8 hours
- Testing & Validation: 8-10 hours
- UI Components: 4-6 hours
- Content Creation: 14-18 hours

---

## 📊 COUNTRY COMPARISON

### USA System: ✅ IMPLEMENTED
- Tax engine: COMPLETE
- Time-based calculators: COMPLETE
- Variable pay calculators: COMPLETE (validated & fixed)
- Total: 10 working calculators

### UK System: 📋 SPECIFICATION COMPLETE
- Tax engine: DOCUMENTED
- Time-based calculators: DOCUMENTED
- Variable pay calculators: DOCUMENTED
- Total: 11 calculators specified

### Ireland System: 📋 SPECIFICATION COMPLETE
- Tax engine: DOCUMENTED
- Time-based calculators: DOCUMENTED
- Variable pay calculators: DOCUMENTED
- Total: 13 calculators specified

### All Three Systems Follow Gold Standard:
- ✅ No tax year input
- ✅ No user-entered rates
- ✅ Normalize → Tax → Redistribute
- ✅ Single tax engine per country
- ✅ Complete specifications
- ✅ Test scenarios provided

---

## 🎯 IRELAND-SPECIFIC FEATURES

### Unique to Ireland:

1. **Three Tax Components:**
   - Income Tax (20%, 40%)
   - USC (0.5%, 2%, 4.5%, 8%)
   - PRSI (4%)

2. **Tax Credits System:**
   - Direct reduction of tax liability
   - Personal + PAYE credits
   - Employees get more credits than self-employed

3. **Standard Rate Band:**
   - Varies by marital status
   - Single: €40,000
   - Married: €49,000

4. **USC Exemption:**
   - Income < €13,000: No USC

5. **Working Week:**
   - Standard: 39 hours (vs 40 US, 40 UK)
   - Hourly default: 2028 hours/year

---

## 🧪 TEST SCENARIOS DOCUMENTED

### Time-Based Calculators:
- €20/hour employee (€40,560 annual)
- €3,500/month with pension
- €1,000/week self-employed

### Variable Pay Calculators:
- €20/hour + 8 hours overtime/week @ 1.5x
- €45,000 + €10,000 bonus
- €30,000 + €1,500/month commission

### Edge Cases:
- High earner hitting USC 8% band (€100,000+)
- Self-employed with commission
- Married with pension contributions

---

## ✅ SUCCESS METRICS

### Specification Phase: ✅ COMPLETE
- ✅ **13/13 calculators** documented
- ✅ **100%** gold standard compliance
- ✅ **All tax rules** specified (Income Tax, USC, PRSI)
- ✅ **Complete examples** provided
- ✅ **Test scenarios** defined

### Implementation Phase: 🚧 PENDING
- [ ] **0/13 calculators** implemented
- [ ] **0%** code coverage
- [ ] **0/0** tests passing
- [ ] Ireland tax engine ready

### Content Phase: 🚧 PENDING
- [ ] **0/13** content files created
- [ ] **0%** SEO optimization
- [ ] **0%** educational content

---

## 🎉 FINAL STATUS

**Ireland Calculator System:** ✅ **SPECIFICATION COMPLETE & LOCKED**

**Documentation Quality:**
- ✅ Production-grade specifications
- ✅ Follows USA/UK gold standard
- ✅ Ready for Cursor/Claude implementation
- ✅ Complete test scenarios
- ✅ All edge cases documented

**Ready for:**
- ✅ Ireland tax engine implementation
- ✅ Time-based calculator development
- ✅ Variable pay calculator development
- ✅ Testing & validation
- ✅ Content creation

---

## 📚 REFERENCE DOCUMENTS

### For Implementation:
1. `IE_CALCULATOR_MASTER_SPEC.md` - Start here
2. `IE_TIME_BASED_CALCULATORS_SPEC.md` - For time-based logic
3. `IE_VARIABLE_PAY_CALCULATORS_SPEC.md` - For bonus/overtime/commission

### For Comparison:
1. `USA_IMPLEMENTATION_COMPLETE.md` - USA system reference
2. `UK_IMPLEMENTATION_COMPLETE.md` - UK system reference

### For Patterns:
1. `lib/calculators/us.ts` - USA implementation patterns
2. `lib/calculators/uk.ts` - UK implementation patterns (when complete)
3. Ireland will follow the same pattern

---

## 📈 KEY DIFFERENCES FROM USA/UK

| Feature | USA | UK | Ireland |
|---------|-----|-----|---------|
| Tax Components | Federal + State + FICA | PAYE + NI + Student Loan | Income Tax + USC + PRSI |
| Personal Allowance | Standard deduction | From tax code | From marital status |
| Tax Credits | Child credits | None (built into allowance) | Personal + PAYE |
| Progressive Payroll | FICA flat until cap | NI two-tier | USC four-tier |
| Standard Week | 40 hours | 40 hours | 39 hours |
| Highest Rate | 37% federal | 45% PAYE | 40% + 8% USC = 48% |

---

## 🎯 NEXT STEPS

### Immediate (Week 1):
1. **Implement Ireland Tax Engine**
   - Start with `calculateIEGrossToNet`
   - Implement all three tax components
   - Test with example scenarios

2. **Create Basic Salary Calculator**
   - Integrate Ireland tax engine
   - Build UI for marital status
   - Test basic functionality

### Short Term (Week 2):
3. **Implement Time-Based Calculators**
   - Add normalization logic (39 hours/week)
   - Reuse redistribution patterns
   - Test all 5 modes

4. **Implement Variable Pay Calculators**
   - Overtime with weeks parameter
   - Bonus with comparison logic
   - Commission with frequency

### Medium Term (Week 3-4):
5. **Testing & Validation**
   - Unit tests for all functions
   - Integration tests
   - Edge case testing
   - USC/PRSI threshold verification

6. **UI Polish & Content**
   - Ireland-specific input components
   - Educational content
   - SEO optimization

---

**This is the gold standard. The Ireland system specification is now complete and ready for implementation.**

**Last Updated:** January 14, 2026
**Next Milestone:** Ireland tax engine implementation
**Final Goal:** Production-ready Ireland calculator system
