# Calculator UI Confusion Check

**Purpose:** Verify each calculator's URL matches its actual UI labels and inputs

---

## ❌ PROBLEMS FOUND

### 1. Monthly to Salary Calculator
**URL:** `/calculators/us/monthly-to-salary-calculator`
**User Expectation:** Enter monthly salary (e.g., $5,000/month)
**What Actually Shows:** ❌ "Hourly Rate" + "Hours/Week"
**Problem:** User wants to enter MONTHLY salary but sees HOURLY rate field
**Fix Needed:** Show "Monthly Salary" input instead

---

### 2. Weekly to Salary Calculator
**URL:** `/calculators/us/weekly-to-salary-calculator`
**User Expectation:** Enter weekly salary (e.g., $1,500/week)
**What Actually Shows:** ❌ "Hourly Rate" + "Hours/Week"
**Problem:** User wants to enter WEEKLY salary but sees HOURLY rate field
**Fix Needed:** Show "Weekly Salary" input instead

---

### 3. Daily to Salary Calculator
**URL:** `/calculators/us/daily-to-salary-calculator`
**User Expectation:** Enter daily salary (e.g., $300/day)
**What Actually Shows:** ❌ "Hourly Rate" + "Hours/Week"
**Problem:** User wants to enter DAILY salary but sees HOURLY rate field
**Fix Needed:** Show "Daily Salary" input instead

---

## ✅ CALCULATORS THAT ARE CORRECT

### 1. Salary Calculator
**URL:** `/calculators/us/salary-calculator`
**Shows:** ✅ "Gross Salary"
**Matches:** Yes - users expect to enter annual salary

---

### 2. Gross to Net Salary
**URL:** `/calculators/us/gross-to-net-salary-calculator`
**Shows:** ✅ "Gross Salary"
**Matches:** Yes - clear what to enter

---

### 3. Net to Gross Salary
**URL:** `/calculators/us/net-to-gross-salary-calculator`
**Shows:** ✅ "Net Salary"
**Matches:** Yes - clear reverse calculation

---

### 4. Salary After Tax
**URL:** `/calculators/us/salary-after-tax-calculator`
**Shows:** ✅ "Gross Salary"
**Matches:** Yes - enter salary to see after-tax amount

---

### 5. Take Home Pay Calculator
**URL:** `/calculators/us/take-home-pay-calculator`
**Shows:** ✅ "Gross Salary"
**Matches:** Yes - enter salary to see take-home

---

### 6. Hourly to Salary Calculator
**URL:** `/calculators/us/hourly-to-salary-calculator`
**Shows:** ✅ "Hourly Rate" + "Hours/Week"
**Matches:** Yes - users expect to enter hourly rate

---

### 7. Hourly Rate Calculator
**URL:** `/calculators/us/hourly-rate-calculator`
**Shows:** ✅ "Hourly Rate" + "Hours/Week"
**Matches:** Yes - clear hourly calculator

---

### 8. Overtime Pay Calculator
**URL:** `/calculators/us/overtime-pay-calculator`
**Shows:** ✅ "Regular Hourly Rate" + overtime fields
**Matches:** Yes - clear overtime calculator

---

### 9. Bonus Tax Calculator
**URL:** `/calculators/us/bonus-tax-calculator`
**Shows:** ✅ "Base Salary" + "Bonus Amount"
**Matches:** Yes - clear bonus calculator

---

### 10. Commission Calculator
**URL:** `/calculators/us/commission-calculator`
**Shows:** ✅ "Base Salary" + "Commission Amount"
**Matches:** Yes - clear commission calculator

---

### 11. Contractor Salary Calculator
**URL:** `/calculators/us/contractor-salary-calculator`
**Shows:** ✅ "Gross Income" + "Business Expenses"
**Matches:** Yes - clear contractor calculator

---

### 12. Freelancer Income Calculator
**URL:** `/calculators/us/freelancer-income-calculator`
**Shows:** ✅ "Gross Income" + "Business Expenses"
**Matches:** Yes - clear freelancer calculator

---

### 13. Self-Employed Tax Calculator
**URL:** `/calculators/us/self-employed-tax-calculator`
**Shows:** ✅ "Gross Income" + "Business Expenses"
**Matches:** Yes - clear self-employed calculator

---

## 📊 SUMMARY

| Calculator | URL Says | UI Shows | Match? | Fix Needed |
|------------|----------|----------|--------|------------|
| Salary Calculator | Annual salary | "Gross Salary" | ✅ Yes | None |
| Gross to Net | Annual salary | "Gross Salary" | ✅ Yes | None |
| Net to Gross | Annual salary | "Net Salary" | ✅ Yes | None |
| Salary After Tax | Annual salary | "Gross Salary" | ✅ Yes | None |
| Take Home Pay | Annual salary | "Gross Salary" | ✅ Yes | None |
| Hourly to Salary | Hourly rate | "Hourly Rate" | ✅ Yes | None |
| Hourly Rate | Hourly rate | "Hourly Rate" | ✅ Yes | None |
| **Weekly to Salary** | **Weekly salary** | **"Hourly Rate"** | ❌ **NO** | **Show "Weekly Salary"** |
| **Monthly to Salary** | **Monthly salary** | **"Hourly Rate"** | ❌ **NO** | **Show "Monthly Salary"** |
| **Daily to Salary** | **Daily salary** | **"Hourly Rate"** | ❌ **NO** | **Show "Daily Salary"** |
| Overtime Pay | Overtime pay | "Regular Hourly Rate" | ✅ Yes | None |
| Bonus Tax | Bonus taxes | "Base Salary" + "Bonus" | ✅ Yes | None |
| Commission | Commission income | "Base Salary" + "Commission" | ✅ Yes | None |
| Contractor Salary | Contractor income | "Gross Income" | ✅ Yes | None |
| Freelancer Income | Freelancer income | "Gross Income" | ✅ Yes | None |
| Self-Employed Tax | Self-employed taxes | "Gross Income" | ✅ Yes | None |

---

## 🔧 REQUIRED FIXES

### Fix 1: Update SalaryCalculator Component
Need to detect calculator type and show appropriate label:

- `weekly-to-salary-calculator` → Show "Weekly Salary"
- `monthly-to-salary-calculator` → Show "Monthly Salary"
- `daily-to-salary-calculator` → Show "Daily Salary"
- `hourly-to-salary-calculator` → Show "Hourly Rate" (already correct)
- `hourly-rate-calculator` → Show "Hourly Rate" (already correct)

### Fix 2: Update Calculator Logic
Need to handle conversion differently based on frequency:
- Weekly: `input * 52 weeks = annual`
- Monthly: `input * 12 months = annual`
- Daily: `input * 5 days * 52 weeks = annual` (assuming 5-day work week)
- Hourly: `input * hours/week * 52 weeks = annual` (already working)

---

## 🎯 USER CONFUSION SCENARIOS

### Scenario 1: User visits Monthly to Salary Calculator
1. User sees URL: `/monthly-to-salary-calculator`
2. User expects to enter: $5,000 (their monthly salary)
3. User sees label: "Hourly Rate" ❌
4. **Result:** CONFUSED - "Why is it asking for hourly rate when I want monthly?"

### Scenario 2: User visits Weekly to Salary Calculator
1. User sees URL: `/weekly-to-salary-calculator`
2. User expects to enter: $1,200 (their weekly salary)
3. User sees label: "Hourly Rate" ❌
4. **Result:** CONFUSED - "This calculator doesn't match the URL"

### Scenario 3: User visits Daily to Salary Calculator
1. User sees URL: `/daily-to-salary-calculator`
2. User expects to enter: $250 (their daily rate)
3. User sees label: "Hourly Rate" ❌
4. **Result:** CONFUSED - "I don't know my hourly rate, only daily"

---

## ✅ SOLUTION

Update the component to:
1. Accept a `frequency` prop or detect from calculator type
2. Show appropriate label based on frequency
3. Convert correctly based on frequency

**Example:**
- weekly-to-salary → Show "Weekly Salary" input, multiply by 52
- monthly-to-salary → Show "Monthly Salary" input, multiply by 12
- daily-to-salary → Show "Daily Salary" input, multiply by 260 (52 weeks × 5 days)
- hourly → Show "Hourly Rate" + hours/week, multiply as needed

---

**Status:** ❌ 3 calculators have confusing UI that doesn't match user expectations
**Priority:** HIGH - Users will be confused by mismatch between URL and UI
