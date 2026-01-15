// Portugal Time-Based Calculators - Verification Tests
import {
  calculateHourlyToSalaryPortugal,
  calculateDailyToSalaryPortugal,
  calculateWeeklyToSalaryPortugal,
  calculateMonthlyToSalaryPortugal,
  calculateSalaryToHourlyPortugal
} from '../lib/calculators/pt-time-based';

console.log('=== Portugal Time-Based Calculators - Verification Tests ===\n');

// Test 1: Hourly to Annual (€15/hour)
console.log('Test 1: Hourly to Annual Salary');
const hourlyTest = calculateHourlyToSalaryPortugal(15); // €15/hour × 2,080 hours = €31,200
console.log(`  Hourly Rate: €15.00`);
console.log(`  Annual Gross: €${hourlyTest.grossSalary.toLocaleString()}`);
console.log(`  Annual Net: €${hourlyTest.netSalary.toFixed(2)}`);
console.log(`  Effective Tax Rate: ${hourlyTest.effectiveTaxRate.toFixed(2)}%`);
console.log(`  Expected Gross: €31,200 ${Math.abs(hourlyTest.grossSalary - 31200) < 1 ? '✅' : '❌'}\n`);

// Test 2: Daily to Annual (€120/day)
console.log('Test 2: Daily to Annual Salary');
const dailyTest = calculateDailyToSalaryPortugal(120); // €120/day × 260 days = €31,200
console.log(`  Daily Rate: €120.00`);
console.log(`  Annual Gross: €${dailyTest.grossSalary.toLocaleString()}`);
console.log(`  Annual Net: €${dailyTest.netSalary.toFixed(2)}`);
console.log(`  Effective Tax Rate: ${dailyTest.effectiveTaxRate.toFixed(2)}%`);
console.log(`  Expected Gross: €31,200 ${Math.abs(dailyTest.grossSalary - 31200) < 1 ? '✅' : '❌'}\n`);

// Test 3: Weekly to Annual (€600/week)
console.log('Test 3: Weekly to Annual Salary');
const weeklyTest = calculateWeeklyToSalaryPortugal(600); // €600/week × 52 weeks = €31,200
console.log(`  Weekly Pay: €600.00`);
console.log(`  Annual Gross: €${weeklyTest.grossSalary.toLocaleString()}`);
console.log(`  Annual Net: €${weeklyTest.netSalary.toFixed(2)}`);
console.log(`  Effective Tax Rate: ${weeklyTest.effectiveTaxRate.toFixed(2)}%`);
console.log(`  Expected Gross: €31,200 ${Math.abs(weeklyTest.grossSalary - 31200) < 1 ? '✅' : '❌'}\n`);

// Test 4: Monthly to Annual (€2,600/month)
console.log('Test 4: Monthly to Annual Salary');
const monthlyTest = calculateMonthlyToSalaryPortugal(2600); // €2,600/month × 12 = €31,200
console.log(`  Monthly Salary: €2,600.00`);
console.log(`  Annual Gross: €${monthlyTest.grossSalary.toLocaleString()}`);
console.log(`  Annual Net: €${monthlyTest.netSalary.toFixed(2)}`);
console.log(`  Effective Tax Rate: ${monthlyTest.effectiveTaxRate.toFixed(2)}%`);
console.log(`  Expected Gross: €31,200 ${Math.abs(monthlyTest.grossSalary - 31200) < 1 ? '✅' : '❌'}\n`);

// Test 5: Annual to Hourly (€50,000/year)
console.log('Test 5: Annual Salary to Hourly Rate');
const annualTest = calculateSalaryToHourlyPortugal(50000);
console.log(`  Annual Gross: €${annualTest.grossSalary.toLocaleString()}`);
console.log(`  Hourly Rate: €${annualTest.hourlyRate.toFixed(2)}`);
console.log(`  Annual Net: €${annualTest.netSalary.toFixed(2)}`);
console.log(`  Expected Hourly: €24.04 (€50,000 ÷ 2,080) ${Math.abs(annualTest.hourlyRate - 24.04) < 0.01 ? '✅' : '❌'}\n`);

// Verify all conversions yield same gross salary
const allEqual =
  Math.abs(hourlyTest.grossSalary - 31200) < 1 &&
  Math.abs(dailyTest.grossSalary - 31200) < 1 &&
  Math.abs(weeklyTest.grossSalary - 31200) < 1 &&
  Math.abs(monthlyTest.grossSalary - 31200) < 1;

console.log('=== Summary ===');
console.log(`All time-based conversions produce expected gross: ${allEqual ? '✅ PASS' : '❌ FAIL'}`);
console.log(`\nPortugal time-based calculators are ${allEqual ? 'working correctly' : 'need adjustment'} ✅`);
