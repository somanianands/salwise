// Switzerland Time-Based Calculators - Verification Tests
import {
  calculateHourlyToSalarySwitzerland,
  calculateDailyToSalarySwitzerland,
  calculateWeeklyToSalarySwitzerland,
  calculateMonthlyToSalarySwitzerland,
  calculateSalaryToHourlySwitzerland
} from '../lib/calculators/ch-time-based';

console.log('=== Switzerland Time-Based Calculators - Verification Tests ===\n');

// Test 1: Hourly to Annual (CHF 30/hour in Zurich)
console.log('Test 1: Hourly to Annual Salary (Zurich)');
const hourlyTest = calculateHourlyToSalarySwitzerland(30, { canton: 'zurich' }); // CHF 30/hour × 2,184 hours = CHF 65,520
console.log(`  Hourly Rate: CHF 30.00`);
console.log(`  Canton: Zurich (10% cantonal tax)`);
console.log(`  Annual Gross: CHF ${hourlyTest.grossSalary.toLocaleString()}`);
console.log(`  Annual Net: CHF ${hourlyTest.netSalary.toFixed(2)}`);
console.log(`  Effective Tax Rate: ${hourlyTest.effectiveTaxRate.toFixed(2)}%`);
console.log(`  Expected Gross: CHF 65,520 ${Math.abs(hourlyTest.grossSalary - 65520) < 1 ? '✅' : '❌'}\n`);

// Test 2: Daily to Annual (CHF 252/day in Zug)
console.log('Test 2: Daily to Annual Salary (Zug - lowest tax)');
const dailyTest = calculateDailyToSalarySwitzerland(252, { canton: 'zug' }); // CHF 252/day × 260 days = CHF 65,520
console.log(`  Daily Rate: CHF 252.00`);
console.log(`  Canton: Zug (6% cantonal tax - lowest)`);
console.log(`  Annual Gross: CHF ${dailyTest.grossSalary.toLocaleString()}`);
console.log(`  Annual Net: CHF ${dailyTest.netSalary.toFixed(2)}`);
console.log(`  Effective Tax Rate: ${dailyTest.effectiveTaxRate.toFixed(2)}%`);
console.log(`  Expected Gross: CHF 65,520 ${Math.abs(dailyTest.grossSalary - 65520) < 1 ? '✅' : '❌'}\n`);

// Test 3: Weekly to Annual (CHF 1,260/week in Geneva)
console.log('Test 3: Weekly to Annual Salary (Geneva)');
const weeklyTest = calculateWeeklyToSalarySwitzerland(1260, { canton: 'geneva' }); // CHF 1,260/week × 52 weeks = CHF 65,520
console.log(`  Weekly Pay: CHF 1,260.00`);
console.log(`  Canton: Geneva (12% cantonal tax)`);
console.log(`  Annual Gross: CHF ${weeklyTest.grossSalary.toLocaleString()}`);
console.log(`  Annual Net: CHF ${weeklyTest.netSalary.toFixed(2)}`);
console.log(`  Effective Tax Rate: ${weeklyTest.effectiveTaxRate.toFixed(2)}%`);
console.log(`  Expected Gross: CHF 65,520 ${Math.abs(weeklyTest.grossSalary - 65520) < 1 ? '✅' : '❌'}\n`);

// Test 4: Monthly to Annual (CHF 5,460/month in Basel)
console.log('Test 4: Monthly to Annual Salary (Basel - highest tax)');
const monthlyTest = calculateMonthlyToSalarySwitzerland(5460, { canton: 'basel' }); // CHF 5,460/month × 12 = CHF 65,520
console.log(`  Monthly Salary: CHF 5,460.00`);
console.log(`  Canton: Basel (13% cantonal tax - highest)`);
console.log(`  Annual Gross: CHF ${monthlyTest.grossSalary.toLocaleString()}`);
console.log(`  Annual Net: CHF ${monthlyTest.netSalary.toFixed(2)}`);
console.log(`  Effective Tax Rate: ${monthlyTest.effectiveTaxRate.toFixed(2)}%`);
console.log(`  Expected Gross: CHF 65,520 ${Math.abs(monthlyTest.grossSalary - 65520) < 1 ? '✅' : '❌'}\n`);

// Test 5: Annual to Hourly (CHF 100,000/year)
console.log('Test 5: Annual Salary to Hourly Rate');
const annualTest = calculateSalaryToHourlySwitzerland(100000, { canton: 'zurich' });
console.log(`  Annual Gross: CHF ${annualTest.grossSalary.toLocaleString()}`);
console.log(`  Hourly Rate: CHF ${annualTest.hourlyRate.toFixed(2)}`);
console.log(`  Annual Net: CHF ${annualTest.netSalary.toFixed(2)}`);
console.log(`  Expected Hourly: CHF 45.79 (CHF 100,000 ÷ 2,184) ${Math.abs(annualTest.hourlyRate - 45.79) < 0.01 ? '✅' : '❌'}\n`);

// Verify all conversions yield same gross salary
const allEqual =
  Math.abs(hourlyTest.grossSalary - 65520) < 1 &&
  Math.abs(dailyTest.grossSalary - 65520) < 1 &&
  Math.abs(weeklyTest.grossSalary - 65520) < 1 &&
  Math.abs(monthlyTest.grossSalary - 65520) < 1;

console.log('=== Summary ===');
console.log(`All time-based conversions produce expected gross: ${allEqual ? '✅ PASS' : '❌ FAIL'}`);
console.log(`\nSwitzerland time-based calculators are ${allEqual ? 'working correctly' : 'need adjustment'} ✅`);
console.log('\n🇨🇭 Note: Switzerland uses 42 hours/week standard (2,184 hours/year)');
