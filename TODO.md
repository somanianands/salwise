# Salary Calculator - Future Features TODO

## High Priority Features

### 1. 📋 Export/Share Results
- [ ] Print button for calculator results
- [ ] Export to PDF functionality
- [ ] Share link (URL with parameters to reproduce calculation)
- [ ] Copy results to clipboard
- [ ] Email results option

### 2. 💰 Bonus Calculator
- [ ] One-time bonus/payment calculator
- [ ] Accurate bonus tax withholding (different from regular salary)
- [ ] Show bonus vs. regular income tax differences
- [ ] Option to add bonus to annual calculation

### 3. 📈 Compare Scenarios
- [ ] Side-by-side comparison tool (e.g., CA vs TX)
- [ ] Compare different states for same salary
- [ ] Compare different salary levels
- [ ] Show tax savings/costs when moving states
- [ ] "What if" scenarios (more dependents, 401k contributions, etc.)

## Medium Priority Features

### 4. 🏢 Multiple Jobs Calculator
- [ ] Calculate combined income from 2+ jobs
- [ ] Show accurate tax withholding for multiple W-2s
- [ ] W-2 + 1099 combination support
- [ ] Tax bracket implications

### 5. 📊 Stock/RSU Calculator
- [ ] RSU vesting schedule input
- [ ] ISO vs NSO stock options
- [ ] ESPP calculations
- [ ] AMT (Alternative Minimum Tax) for ISOs
- [ ] Capital gains calculations

### 6. 🎓 Student Loan Payments
- [ ] Monthly student loan payment calculator
- [ ] Show impact on take-home pay
- [ ] PAYE/REPAYE/IBR plan calculations
- [ ] Public Service Loan Forgiveness tracking

### 7. 🏥 Healthcare Premiums
- [ ] Pre-tax medical insurance premiums
- [ ] FSA (Flexible Spending Account)
- [ ] Dental/Vision insurance
- [ ] Dependent care FSA

### 8. 🌃 Local Taxes
- [ ] NYC city tax
- [ ] San Francisco city tax
- [ ] Philadelphia wage tax
- [ ] Other major city/county taxes
- [ ] School district taxes (PA, OH, etc.)

## Lower Priority (Nice to Have)

### 9. 💾 Save & History
- [ ] Save calculations to browser localStorage
- [ ] Named scenarios (e.g., "Current Job", "Job Offer")
- [ ] History of past calculations
- [ ] Compare saved scenarios

### 10. 📅 Year-to-Date Tracking
- [ ] Input paystubs to track YTD earnings
- [ ] Project end-of-year totals
- [ ] Tax refund/owed estimate
- [ ] Quarterly estimated tax calculator (for 1099)

### 11. ⏰ Overtime Calculator
- [ ] Time-and-a-half calculations
- [ ] Double-time for holidays
- [ ] Show overtime tax impact
- [ ] Weekly/biweekly overtime projections

### 12. 👨‍💼 Self-Employment/1099
- [ ] Self-employment tax (15.3% FICA)
- [ ] Quarterly estimated tax payments
- [ ] Business expense deductions
- [ ] QBI (Qualified Business Income) deduction
- [ ] Self-employed retirement (SEP IRA, Solo 401k)

## UI/UX Improvements

### 13. 📱 Mobile Optimization
- [ ] Better mobile layout for small screens
- [ ] Touch-friendly inputs
- [ ] Swipe gestures for scenarios

### 14. 🎨 Themes & Customization
- [ ] Dark mode
- [ ] Custom color themes
- [ ] Font size options
- [ ] Accessibility improvements (WCAG 2.1 AA)

### 15. 📊 Enhanced Visualizations
- [ ] Tax bracket visualization (where you fall)
- [ ] Marginal vs effective tax rate chart
- [ ] Year-over-year comparison charts
- [ ] Interactive sliders for "what if" scenarios

### 16. 🌍 Additional Countries
- [ ] More European countries (Spain, Italy, Netherlands, etc.)
- [ ] Asian countries (Japan, South Korea, etc.)
- [ ] Latin American countries
- [ ] Middle Eastern countries

## Technical Improvements

### 17. ⚡ Performance
- [ ] Optimize bundle size
- [ ] Lazy load charts
- [ ] Service worker for offline use
- [ ] Faster calculation algorithms

### 18. 🧪 Testing
- [ ] Unit tests for all tax calculations
- [ ] E2E tests with Playwright/Cypress
- [ ] Visual regression tests
- [ ] Accuracy validation against real tax calculators

### 19. 📈 Analytics
- [ ] Track which features are used most
- [ ] Error tracking
- [ ] Performance monitoring
- [ ] User feedback collection

### 20. 🔄 Auto-Updates
- [ ] Automatic tax rate updates for new year
- [ ] Notification system for tax law changes
- [ ] Version change log

## Integration Features

### 21. 🔗 API Integration
- [ ] Public API for calculations
- [ ] Embed calculator widget for other sites
- [ ] Browser extension
- [ ] Mobile app (React Native)

### 22. 💼 Payroll Integration
- [ ] Import from ADP, Gusto, etc.
- [ ] Sync with accounting software
- [ ] Bank account connection for actual vs calculated

## Documentation

### 23. 📚 Help & Guides
- [ ] Tax guide for each country
- [ ] FAQ section
- [ ] Video tutorials
- [ ] Blog with tax tips
- [ ] Glossary of tax terms

---

## Current Status: ✅ v1.0 Complete!

**Implemented Features:**
- ✅ Gross to Net, Net to Gross, Hourly calculators
- ✅ 9 countries (US, UK, Canada, Australia, Germany, France, India, Singapore, UAE)
- ✅ All 50 US states with accurate state taxes
- ✅ Filing status (Single, Married, HOH, MFS)
- ✅ Dependents (child tax credits)
- ✅ Pre-tax deductions (401k, IRA, HSA)
- ✅ Canadian provinces
- ✅ Age-based calculations (Singapore CPF, Germany insurance)
- ✅ Auto-calculate on input change
- ✅ Detailed breakdown (Annual, Monthly, Weekly, Daily, Hourly)
- ✅ Visual pie chart
- ✅ Responsive design
- ✅ Clean, modern UI
- ✅ Compact layout
- ✅ Proper input handling (no "0200" bug)

---

**Last Updated:** January 2026
**Version:** 1.0.0
