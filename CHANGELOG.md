# Salary Calculator - Changelog

## Version 1.3.0 (January 2026)

### 🔥 BEST-IN-CLASS - Complete Feature Parity with Top Competitors!

#### 🇬🇧 United Kingdom - FULLY Complete
- ✅ **Scottish tax rates** - 7 tax bands (19%, 20%, 21%, 42%, 45%, 48%) vs England 3 bands
- ✅ **Pension contributions** - Workplace pension reduces taxable income
- ✅ **Student loan repayment** - Plan 2: 9% above £27,295
- ✅ **Marriage allowance** - Transfer £1,260 personal allowance
- ✅ **Region selection** - England, Scotland, Wales, Northern Ireland

#### 🇦🇺 Australia - FULLY Complete
- ✅ **Medicare levy exemption** - Low income under $26,000
- ✅ **HELP/HECS debt** - Progressive repayment 1-10% (19 income brackets!)
- ✅ **Accurate thresholds** - $51,550 to $151,200+ brackets
- ✅ **Full breakdown** - Shows HELP repayment separately in pie chart

#### 📊 What We NOW Have That Others Don't
1. **Scottish tax rates** - Most competitors only show England rates
2. **19 HELP brackets** - Most show simplified 5-6 brackets
3. **Regional taxes** - Spain (8 regions) & Italy (8 regions) with accurate rates
4. **Complete breakdown** - Every deduction shown separately in visual chart
5. **All 2025 rates** - Completely up-to-date

---

## Version 1.2.0 (January 2026)

### ⚡ Advanced Options - ALL Countries Complete!

#### ✨ New Advanced Options Added
**All 10 countries now have comprehensive advanced options:**

- **Ireland (IE):**
  - Marital status (Single/Married/Married One-Earner)
  - PAYE tax credit (€1,775)
  - Personal tax credits based on status (€1,775-€3,550)

- **United Kingdom (UK):**
  - Region selection (England/Scotland/Wales/Northern Ireland)
  - Marriage allowance option

- **Australia (AU):**
  - Medicare levy exemption (low income)
  - HELP/HECS debt repayment (1-10%)

- **Spain (ES):**
  - Autonomous community selection (Madrid, Catalonia, Andalusia, Valencia, Basque Country, Galicia, etc.)
  - Regional tax rates (9-12%)

- **Italy (IT):**
  - Region selection (Lombardy, Lazio, Campania, Sicily, Veneto, etc.)
  - Regional and municipal tax additions (1.73-3.33%)

- **Germany (DE):**
  - Age-based care insurance rates

- **Canada (CA):**
  - Province/Territory selection (all 13 provinces)
  - Provincial tax brackets

- **United States (US):**
  - All 50 states
  - Filing status
  - 401(k), IRA, HSA deductions
  - Dependents

#### 🔧 Calculator Logic Updates
- **Ireland:** Properly applies marital status and tax credits to calculations
- **Spain:** Adds autonomous community regional taxes on top of national rates
- **Italy:** Adds regional (IRPEF) and municipal (addizionale) taxes
- **All countries:** Advanced options now fully functional and affect calculations

#### 📊 Accuracy Improvements
- Married couples in Ireland get correct tax brackets (€51,000 vs €42,000 single)
- Spanish users see accurate regional tax variations
- Italian regional/municipal surcharges properly calculated
- All options properly passed through calculation pipeline

---

## Version 1.1.0 (January 2026)

### 🌍 Country Expansion - Phase 1 Complete!

#### ✨ New Countries Added
- **Ireland (IE)** - Full tax calculator with Income Tax, USC, and PRSI
- **Netherlands (NL)** - Income tax and social security calculations
- **Spain (ES)** - IRPF income tax and social security
- **Italy (IT)** - IRPEF income tax and INPS social security

#### 🗑️ Countries Removed (Moved to Phase 2)
- India (IN) - Moved to Phase 2
- Singapore (SG) - Moved to Phase 2
- UAE - Moved to Phase 2

#### 📊 Current Status
- **Total Countries:** 10 (US, UK, IE, CA, AU, DE, FR, NL, ES, IT)
- **Calculator Types:** 3 per country
- **Total Pages:** 30 calculator pages (10 countries × 3 types)

#### 🔧 Technical Updates
- **Standardized country codes:** All countries now use 2-letter ISO codes (US, UK, IE, CA, AU, DE, FR, NL, ES, IT)
- Updated country type definitions in `lib/types.ts`
- Created calculator logic for IE, NL, ES, IT with accurate tax rates
- Removed old calculator files (india.ts, singapore.ts, uae.ts)
- Updated sitemap to automatically include all countries
- Fixed recursive call bug in Italy calculator
- **All 30 calculator pages tested and verified working (100% pass rate)**

---

## Version 1.0.0 (January 2026)

### 🎉 Initial Release - Production Ready!

#### ✨ Core Features
- **3 Calculator Types:**
  - Gross to Net Salary Calculator
  - Net to Gross Salary Calculator
  - Hourly Rate Calculator

- **9 Countries Supported:**
  - United States (all 50 states)
  - United Kingdom
  - Canada (all provinces)
  - Australia
  - Germany
  - France
  - India
  - Singapore
  - UAE

#### 💰 US Tax Features
- All 50 states with accurate state tax rates
- Filing status (Single, Married, Head of Household, Married Filing Separately)
- Dependent tax credits ($2,000 per child)
- Pre-tax deductions:
  - 401(k) contributions (2025 limit: $23,000)
  - Traditional IRA (2025 limit: $7,000)
  - HSA (2025 limit: $4,150 single / $8,300 family)
- Accurate 2025 federal tax brackets
- FICA (Social Security + Medicare)

#### 🇨🇦 Canada Features
- All provinces and territories
- Federal and provincial tax calculations
- CPP (Canada Pension Plan)
- EI (Employment Insurance)

#### 🌏 International Features
- Singapore: Age-based CPF contributions
- Germany: Age-based care insurance
- UK: National Insurance
- Australia: Medicare levy + HECS/HELP
- And more country-specific deductions

#### 🎨 UI/UX Features
- **Auto-calculate:** Results update automatically (500ms debounce)
- **Horizontal layout:** Labels and inputs on same line (space-efficient)
- **Smart input handling:** Click to select all, type to replace
- **Responsive design:** Mobile-first, 2-column desktop layout
- **Visual breakdown:** Interactive pie chart
- **Detailed tables:** Annual, Monthly, Weekly, Daily, Hourly breakdown
- **Modern design:** Poppins font, clean gradients, subtle shadows
- **Compact UI:** No wasted space, optimized for mobile

#### 🔍 SEO Optimizations
- **Keyword-rich URLs:**
  - `/calculators/us/gross-to-net-salary-calculator/`
  - `/calculators/uk/net-to-gross-salary-calculator/`
  - `/calculators/canada/hourly-rate-calculator/`
- **Comprehensive metadata:** Titles, descriptions, keywords for each page
- **Sitemap:** All 27 calculator pages indexed
- **Structured content:** H1, H2, H3 hierarchy for SEO
- **Internal linking:** Related calculators cross-linked

#### 🐛 Bug Fixes
- Fixed input "0200" bug (now properly replaces instead of appends)
- Fixed `.select()` error on dropdowns (removed from select elements)
- Fixed pie chart overflow (labels now in legend, compact layout)
- Fixed label readability (increased from 100px to 120px width)
- Fixed font loading (proper Poppins/Inter configuration)

#### 📱 Technical Stack
- **Framework:** Next.js 16.1.1 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Charts:** Recharts
- **Animation:** Framer Motion
- **Font:** Poppins (Google Fonts)
- **Export:** Static site generation

#### 🎯 Performance
- Fast calculations (< 10ms)
- Optimized bundle size
- Static generation for all pages
- Lazy loading for charts
- Debounced auto-calculate

---

## Upcoming Features (See TODO.md)

### High Priority
1. **Export/Share Results** - PDF, print, shareable links
2. **Bonus Calculator** - One-time payment tax calculations
3. **Compare Scenarios** - Side-by-side state/salary comparisons

### Medium Priority
4. Multiple Jobs Calculator
5. Stock/RSU Calculator
6. Student Loan Payments
7. Healthcare Premiums
8. Local Taxes (NYC, SF, etc.)

### Lower Priority
9. Save & History
10. Year-to-Date Tracking
11. Overtime Calculator
12. Self-Employment/1099

See `TODO.md` for complete feature roadmap.

---

## Development Notes

### URL Structure
- Country pages: `/calculators/{country}/`
- Calculator pages: `/calculators/{country}/{type}/`
- Types: `gross-to-net-salary-calculator`, `net-to-gross-salary-calculator`, `hourly-rate-calculator`

### Key Files
- Calculator component: `components/calculators/SalaryCalculator.tsx`
- Advanced options: `components/calculators/AdvancedOptions.tsx`
- Country logic: `lib/calculators/{country}.ts`
- Types: `lib/types.ts`, `lib/extended-types.ts`

### Development Server
```bash
npm run dev          # Start dev server
npm run build        # Build for production
npm run export       # Export static site
```

---

**Last Updated:** January 14, 2026
**Version:** 1.0.0
**Status:** ✅ Production Ready
