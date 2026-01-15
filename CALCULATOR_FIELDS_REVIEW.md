# Calculator Fields & Outputs Review

**Date:** January 14, 2026
**Purpose:** Overview of input fields and outputs for each calculator type

---

## 🧮 1. Salary Calculator (Standard Gross-to-Net)

**URL Pattern:** `/calculators/{country}/salary-calculator`

### Input Fields:
1. **Gross Salary** - Default: $75,000
2. Hours/Week - NOT shown (not needed)
3. Advanced Options (collapsible) - Country-specific

### Output Sections:
1. **Summary Cards** (3 cards):
   - Gross Salary (Annual)
   - Net Salary (Take Home)
   - Total Deductions (with effective tax rate)

2. **Salary Breakdown Table**:
   - Annual, Monthly, Weekly, Daily, Hourly breakdown
   - Shows both Gross and Net for each period

3. **Tax Breakdown Chart** (Pie chart)

4. **Detailed Tax Breakdown**:
   - Income Tax, Social Security, etc.
   - Each item with amount and percentage

**Unique Features:** None - standard calculator

---

## 🔄 2. Net-to-Gross Calculator

**URL Pattern:** `/calculators/{country}/net-to-gross-salary-calculator`

### Input Fields:
1. **Net Salary** - Default: $75,000
2. Hours/Week - NOT shown (not needed)
3. Advanced Options (collapsible)

### Output Sections:
Same as standard salary calculator

**Unique Features:** Reverse calculation - you enter desired take-home, it calculates required gross

---

## ⏰ 3. Hourly Rate Calculator

**URL Pattern:** `/calculators/{country}/hourly-to-salary-calculator`

### Input Fields:
1. **Hourly Rate** - Default: $25/hour
2. **Hours/Week** - Default: 40
3. Advanced Options (collapsible)

### Output Sections:
Same standard outputs PLUS:
- Hourly breakdown prominently featured in frequency table

**Unique Features:** Converts hourly wage to annual salary

---

## 💰 4. Overtime Pay Calculator

**URL Pattern:** `/calculators/{country}/overtime-pay-calculator`

### Input Fields:
1. **Regular Hourly Rate** - Default: $25/hour (✅ Updated for clarity)
2. **Regular Hours/Week** - Default: 40
3. **Overtime Hours/Week** - Default: 10
4. **Overtime Multiplier** - Dropdown:
   - 1.5× (Time and a Half) - DEFAULT
   - 2× (Double Time)
   - 2.5× (2.5 Time)
5. Advanced Options (collapsible)

### Output Sections:
Standard outputs PLUS:

**⏰ UNIQUE: Overtime Pay Breakdown** (Orange gradient box):
- Regular Pay (Annual): Shows base pay from regular hours
- Overtime Pay (Annual): Shows additional pay from OT hours
- Overtime Rate: Shows calculated hourly rate with multiplier (e.g., $37.50/hr)

**Example:**
```
Regular Pay (Annual):    $52,000
Overtime Pay (Annual):   $19,500
Overtime Rate:           $37.50/hr
```

**Unique Features:**
- Multiple OT multiplier options
- Breaks down regular vs overtime pay
- Shows effective overtime hourly rate

---

## 💸 5. Bonus Tax Calculator

**URL Pattern:** `/calculators/{country}/bonus-tax-calculator`

### Input Fields:
1. **Base Salary** - Default: $60,000
2. **Bonus Amount** - Default: $10,000
3. Advanced Options (collapsible)

### Output Sections:
Standard outputs PLUS:

**💸 UNIQUE: Bonus Tax Analysis** (Purple gradient box):
- Base Salary: Your regular annual salary
- Bonus Amount (Gross): The bonus before tax
- Tax on Bonus: Shows incremental tax specifically on the bonus
- **Net Bonus (After Tax)**: What you actually receive ✨

**Example:**
```
Base Salary:              $60,000
Bonus Amount (Gross):     $10,000
Tax on Bonus:            -$2,200
Net Bonus (After Tax):    $7,800
```

**Unique Features:**
- Shows how bonus affects your tax bracket
- Calculates incremental tax on just the bonus
- Highlights net bonus received

---

## 💼 6. Commission Calculator

**URL Pattern:** `/calculators/{country}/commission-calculator`

### Input Fields:
1. **Base Salary** - Default: $60,000
2. **Commission Amount** - Default: $20,000
3. Advanced Options (collapsible)

### Output Sections:
Standard outputs PLUS:

**💼 UNIQUE: Commission Breakdown** (Teal gradient box):
- Base Salary: Your fixed salary component
- Commission: Your variable commission income
- **Commission as % of Base**: Key metric (e.g., 33.3%) ✨
- Total Gross: Combined compensation

**Example:**
```
Base Salary:                $60,000
Commission:                 $20,000
Commission as % of Base:    33.3%
Total Gross:                $80,000
```

**Unique Features:**
- Shows commission as percentage of base
- Highlights split between fixed and variable pay
- Useful for sales roles

---

## 🏢 7. Contractor / Self-Employed Calculator

**URL Patterns:**
- `/calculators/{country}/contractor-salary-calculator`
- `/calculators/{country}/freelancer-income-calculator`
- `/calculators/{country}/self-employed-tax-calculator`

### Input Fields:
1. **Gross Income** - Default: $80,000
2. **Business Expenses** - Default: $8,000 (10% of income)
3. Advanced Options (collapsible)

### Output Sections:
Standard outputs PLUS:

**🏢 UNIQUE: Self-Employed Breakdown** (Amber gradient box):
- Gross Income: Total revenue
- Business Expenses: Deductible expenses (shown as negative)
- Net Business Income: After expense deduction
- **Self-Employment Tax**: Country-specific SE tax with rate ✨

**Example (US):**
```
Gross Income:              $80,000
Business Expenses:         -$8,000
Net Business Income:       $72,000
Self-Employment Tax:       $11,016 (15.3%)
```

**Example (UK):**
```
Gross Income:              £80,000
Business Expenses:         -£8,000
Net Business Income:       £72,000
Self-Employment Tax:       £6,480 (9.0%)
```

**Country-Specific SE Tax Rates:**
- 🇺🇸 US: 15.3% (Social Security + Medicare)
- 🇬🇧 UK: 9% (Class 2 & 4 NI)
- 🇮🇪 Ireland: 4% (PRSI Class S)
- 🇨🇦 Canada: 10.7% (CPP + EI)
- 🇦🇺 Australia: 0% (same as employees)
- 🇩🇪 Germany: 19% (Selbstständige)
- 🇫🇷 France: 22% (Cotisations sociales)
- 🇳🇱 Netherlands: 0% (same as employees)
- 🇪🇸 Spain: 30% (Autónomo)
- 🇮🇹 Italy: 26% (INPS)

**Unique Features:**
- Business expense deduction
- Country-specific self-employment taxes
- Shows the unique tax burden of self-employment
- Critical for freelancers/contractors

---

## 📊 Common Elements Across ALL Calculators

These appear in every calculator type:

### 1. Summary Cards (3 cards):
- Gross Salary
- Net Salary
- Total Deductions (with effective tax rate %)

### 2. Salary Breakdown Table:
- Annual, Monthly, Weekly, Daily, Hourly
- Both Gross and Net columns

### 3. Tax Breakdown Chart:
- Visual pie chart of tax components
- Color-coded segments

### 4. Detailed Tax Breakdown:
- Line-by-line breakdown
- Each tax type with amount and percentage
- Includes: Income Tax, Social Security, State Tax (if applicable), Net Salary

### 5. Advanced Options (Collapsible):
- Country-specific options
- Examples: US state selection, retirement contributions, dependents, etc.

---

## 🎯 What Makes Each Calculator UNIQUE

| Calculator | Unique Input | Unique Output | Key Insight |
|------------|-------------|---------------|-------------|
| **Standard Salary** | None | None | Basic calculation |
| **Net-to-Gross** | Net instead of Gross | None | Reverse calculation |
| **Hourly** | Hours/Week | Hourly emphasis | Hourly → Annual conversion |
| **Overtime** | OT hours + multiplier | ⏰ Overtime breakdown | Regular vs OT pay split |
| **Bonus** | Bonus amount | 💸 Bonus tax analysis | Incremental tax on bonus |
| **Commission** | Commission amount | 💼 Commission breakdown | Commission as % of base |
| **Contractor** | Business expenses | 🏢 SE breakdown | SE tax + expense deduction |

---

## ✅ Field Visibility Matrix

| Field Name | Salary | Net-to-Gross | Hourly | Overtime | Bonus | Commission | Contractor |
|------------|--------|--------------|--------|----------|-------|------------|------------|
| Gross Salary | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Net Salary | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Hourly Rate | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Hours/Week | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Regular Hourly Rate | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ |
| Regular Hours | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ |
| Overtime Hours | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ |
| OT Multiplier | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ |
| Base Salary | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ | ❌ |
| Bonus Amount | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ |
| Commission | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ |
| Gross Income | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |
| Business Expenses | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |
| Advanced Options | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |

✅ = Field is shown
❌ = Field is hidden

---

## 🎨 Color-Coding of Unique Sections

Each calculator type has a unique color scheme for its special breakdown:

- **⏰ Overtime**: Orange gradient (`from-orange-50 to-orange-100`, `border-orange-200`)
- **💸 Bonus**: Purple gradient (`from-purple-50 to-purple-100`, `border-purple-200`)
- **💼 Commission**: Teal gradient (`from-teal-50 to-teal-100`, `border-teal-200`)
- **🏢 Contractor**: Amber gradient (`from-amber-50 to-amber-100`, `border-amber-200`)

This makes each calculator visually distinctive at a glance.

---

## 📝 Summary

**Total Calculator Types:** 7
**Total Unique Input Configurations:** 7
**Calculators with Unique Output Sections:** 4 (Overtime, Bonus, Commission, Contractor)
**Total Countries Supported:** 10
**Total Calculator Pages:** 160 (16 types × 10 countries)

**Result:** Each calculator now shows ONLY the relevant fields for its specific use case, with unique outputs that provide calculator-specific insights.

---

**Status:** ✅ Complete - All calculators have appropriate fields and unique outputs
**Last Updated:** January 14, 2026
