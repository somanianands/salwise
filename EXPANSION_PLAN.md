# Salary Calculator Expansion Plan

## 🎯 Goal
Expand from 3 calculator types × 9 countries to **16 calculator types × 10 countries** = 160 calculator pages

## 📊 Current State (v1.0)
- **Countries:** 9 (US, UK, CA, AU, DE, FR, IN, SG, UAE)
- **Calculators:** 3 per country (Gross-to-Net, Net-to-Gross, Hourly)
- **Total Pages:** 27
- **Status:** ✅ Production ready

---

## 🌍 Phase 1: Add Countries (Priority Order)

### Immediate (Week 1)
1. ✅ **US** - Already complete
2. ✅ **UK** - Already complete
3. ✅ **IE (Ireland)** - Complete (English-speaking, high demand)

### High Priority (Week 2)
4. ✅ **CA (Canada)** - Already complete
5. ✅ **AU (Australia)** - Already complete

### Medium Priority (Week 3-4)
6. ✅ **DE (Germany)** - Already complete
7. ✅ **FR (France)** - Already complete
8. ✅ **NL (Netherlands)** - Complete
9. ✅ **ES (Spain)** - Complete
10. ✅ **IT (Italy)** - Complete

### Countries to Remove (Not in new list)
- ✅ **IN (India)** - Removed from Phase 1
- ✅ **SG (Singapore)** - Moved to Phase 2
- ✅ **UAE** - Moved to Phase 2

---

## 🧮 Phase 2: Expand Calculator Types

### Current Calculators (3)
- ✅ Gross to Net Salary (`gross-to-net-salary-calculator`)
- ✅ Net to Gross Salary (`net-to-gross-salary-calculator`)
- ✅ Hourly Rate (`hourly-rate-calculator`)

### New Calculators to Add (13)

#### 1️⃣ Salary Calculators (1 new)
- ⏳ `salary-calculator` - General salary calculator (master page, redirects to gross-to-net)
- ⏳ `salary-after-tax` - Alias for gross-to-net
- ⏳ `take-home-pay` - Alias for gross-to-net

#### 2️⃣ Hourly & Time-Based (4 new)
- ⏳ `hourly-to-salary` - Convert hourly rate to annual salary
- ⏳ `weekly-to-salary` - Convert weekly pay to annual
- ⏳ `monthly-to-salary` - Convert monthly pay to annual
- ⏳ `daily-to-salary` - Convert daily rate to annual

#### 3️⃣ Overtime & Bonus (3 new)
- ⏳ `overtime-pay` - Calculate overtime pay (time-and-a-half)
- ⏳ `bonus-tax` - Calculate tax on one-time bonus
- ⏳ `commission-calculator` - Base + commission calculations

#### 4️⃣ Contractor / Freelancer (3 new)
- ⏳ `contractor-salary` - 1099/contractor equivalent salary
- ⏳ `freelancer-income` - Freelance income after expenses
- ⏳ `self-employed-tax` - Self-employment tax calculator

---

## 🏗️ Implementation Strategy

### Phase 1A: Add Ireland (Week 1)
**Effort:** 2-3 hours
1. Add IE to `lib/types.ts` COUNTRIES
2. Create `lib/calculators/ie.ts` with Irish tax logic
3. Add Irish tax rates (20% + 40% brackets)
4. Add PRSI (social insurance)
5. Add USC (Universal Social Charge)
6. Test all 3 existing calculators for IE

### Phase 1B: Add Netherlands, Spain, Italy (Week 2)
**Effort:** 6-8 hours total
1. Create `lib/calculators/nl.ts` (Netherlands)
2. Create `lib/calculators/es.ts` (Spain)
3. Create `lib/calculators/it.ts` (Italy)
4. Research and implement accurate tax logic for each
5. Test thoroughly

### Phase 2A: Refactor Calculator Type System (Week 3)
**Effort:** 4-6 hours
1. Create unified calculator type registry
2. Map aliases (salary-after-tax → gross-to-net)
3. Update URL routing to support all types
4. Update `generateStaticParams()` to generate all combinations

### Phase 2B: Implement Time-Based Calculators (Week 3-4)
**Effort:** 6-8 hours
1. Create conversion logic (weekly/monthly/daily → annual)
2. Reuse existing tax calculation logic
3. Update UI to show input frequency selector
4. Add "Convert to Annual" flow

### Phase 2C: Implement Overtime & Bonus (Week 4-5)
**Effort:** 8-10 hours
1. **Overtime:** Time-and-a-half calculation
2. **Bonus:** Supplemental wage withholding (US: 22% flat, UK: different)
3. **Commission:** Base + variable pay calculations
4. Create new UI components for these

### Phase 2D: Implement Contractor/Freelancer (Week 5-6)
**Effort:** 10-12 hours
1. **Contractor:** W-2 vs 1099 comparison
2. **Freelancer:** Income - expenses - self-employment tax
3. **Self-employed:** 15.3% FICA for US, different for other countries
4. Create business expense input UI

---

## 📐 URL Structure

### Format
```
/calculators/{country}/{calculator-type}/
```

### Examples
```
/calculators/us/gross-to-net-salary-calculator/
/calculators/uk/salary-after-tax/
/calculators/ie/hourly-to-salary/
/calculators/de/bonus-tax/
/calculators/fr/contractor-salary/
```

### Total Pages at Completion
- 10 countries × 16 calculator types = **160 pages**
- Plus 10 country landing pages = **170 total pages**

---

## 🎨 Design Consistency

### All calculators will follow v1.0 design:
- ✅ Poppins font
- ✅ 2-column responsive layout
- ✅ Horizontal labels + inputs
- ✅ Auto-calculate (500ms debounce)
- ✅ Visual pie chart breakdown
- ✅ Detailed frequency tables
- ✅ Clean, compact spacing
- ✅ Modern gradients & shadows

---

## 📊 Priority Matrix

### High Priority (Launch First)
1. **IE (Ireland)** + existing 3 calculators
2. **NL, ES, IT** + existing 3 calculators
3. **US, UK** + `salary-after-tax`, `take-home-pay` (aliases)

### Medium Priority
4. Time-based calculators (hourly-to-salary, weekly, monthly, daily)
5. Bonus tax calculator (high demand)

### Lower Priority
6. Overtime calculator
7. Commission calculator
8. Contractor/Freelancer calculators

---

## 🔍 SEO Strategy

### URL Keywords
Each URL includes salary-related keywords:
- `salary-calculator` ← Main keyword
- `gross-to-net-salary` ← Long-tail
- `take-home-pay` ← Common search term
- `hourly-to-salary` ← Conversion keyword
- `bonus-tax` ← Specific use case

### Content Strategy
- Unique H1, H2 for each calculator type
- Country-specific tax information
- Year indicators (2025/2026)
- Local currency formatting

### Internal Linking
- Country landing page links to all 16 calculators
- Each calculator links to related calculators
- Breadcrumbs for navigation

---

## 📦 Deliverables

### Phase 1 (Weeks 1-2) ✅ COMPLETE
- [x] Ireland tax logic
- [x] Netherlands tax logic
- [x] Spain tax logic
- [x] Italy tax logic
- [x] Remove India, Singapore, UAE (move to Phase 2)
- [x] Update sitemap
- [x] Test all country pages

### Phase 2 (Weeks 3-4)
- [ ] Refactor calculator type system
- [ ] Implement aliases (salary-after-tax, take-home-pay)
- [ ] Time-based calculators (weekly, monthly, daily)
- [ ] Update URL routing
- [ ] Generate all 160 static pages

### Phase 3 (Weeks 5-6)
- [ ] Overtime calculator
- [ ] Bonus tax calculator
- [ ] Commission calculator
- [ ] Contractor calculators
- [ ] Freelancer calculators
- [ ] Self-employment tax

---

## 🧪 Testing Checklist

For each new calculator:
- [ ] Accurate calculations
- [ ] Proper currency formatting
- [ ] Responsive on mobile
- [ ] Auto-calculate works
- [ ] Chart displays correctly
- [ ] No overflow issues
- [ ] Fast page load (< 2s)
- [ ] SEO metadata correct

---

## 📈 Success Metrics

### Traffic Goals
- 10x traffic increase with 160 pages vs 27 pages
- Target: 100k+ monthly visitors in 6 months

### SEO Goals
- Rank top 3 for "{country} salary calculator"
- Rank top 10 for specific calculator types
- Featured snippets for common queries

### User Engagement
- Time on page > 2 minutes
- Bounce rate < 40%
- Multiple calculator usage per session

---

**Timeline:** 6 weeks total
**Total Pages:** 170 (160 calculators + 10 country pages)
**Status:** ✅ Phase 1 Complete (30 calculator pages live) | 📋 Ready for Phase 2
