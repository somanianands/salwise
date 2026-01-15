// Japan Time-Based Calculators - Verification Tests
import {
  calculateHourlyToSalaryJapan,
  calculateDailyToSalaryJapan,
  calculateWeeklyToSalaryJapan,
  calculateMonthlyToSalaryJapan,
  calculateSalaryToHourlyJapan
} from '../lib/calculators/jp-time-based';

console.log('=== Japan Time-Based Calculators - Verification Tests ===\n');

// Test 1: Hourly to Annual (¥2,500/hour)
console.log('Test 1: Hourly to Annual Salary');
const hourlyTest = calculateHourlyToSalaryJapan(2500); // ¥2,500/hour × 2,080 hours = ¥5,200,000
console.log(`  Hourly Rate: ¥2,500`);
console.log(`  Annual Gross: ¥${hourlyTest.grossSalary.toLocaleString()}`);
console.log(`  Annual Net: ¥${hourlyTest.netSalary.toFixed(0)}`);
console.log(`  Effective Tax Rate: ${hourlyTest.effectiveTaxRate.toFixed(2)}%`);
console.log(`  Expected Gross: ¥5,200,000 ${Math.abs(hourlyTest.grossSalary - 5200000) < 1 ? '✅' : '❌'}\n`);

// Test 2: Daily to Annual (¥20,000/day)
console.log('Test 2: Daily to Annual Salary');
const dailyTest = calculateDailyToSalaryJapan(20000); // ¥20,000/day × 260 days = ¥5,200,000
console.log(`  Daily Rate: ¥20,000`);
console.log(`  Annual Gross: ¥${dailyTest.grossSalary.toLocaleString()}`);
console.log(`  Annual Net: ¥${dailyTest.netSalary.toFixed(0)}`);
console.log(`  Effective Tax Rate: ${dailyTest.effectiveTaxRate.toFixed(2)}%`);
console.log(`  Expected Gross: ¥5,200,000 ${Math.abs(dailyTest.grossSalary - 5200000) < 1 ? '✅' : '❌'}\n`);

// Test 3: Weekly to Annual (¥100,000/week)
console.log('Test 3: Weekly to Annual Salary');
const weeklyTest = calculateWeeklyToSalaryJapan(100000); // ¥100,000/week × 52 weeks = ¥5,200,000
console.log(`  Weekly Pay: ¥100,000`);
console.log(`  Annual Gross: ¥${weeklyTest.grossSalary.toLocaleString()}`);
console.log(`  Annual Net: ¥${weeklyTest.netSalary.toFixed(0)}`);
console.log(`  Effective Tax Rate: ${weeklyTest.effectiveTaxRate.toFixed(2)}%`);
console.log(`  Expected Gross: ¥5,200,000 ${Math.abs(weeklyTest.grossSalary - 5200000) < 1 ? '✅' : '❌'}\n`);

// Test 4: Monthly to Annual (¥433,333/month)
console.log('Test 4: Monthly to Annual Salary');
const monthlyTest = calculateMonthlyToSalaryJapan(433333); // ¥433,333/month × 12 ≈ ¥5,200,000
console.log(`  Monthly Salary: ¥433,333`);
console.log(`  Annual Gross: ¥${monthlyTest.grossSalary.toLocaleString()}`);
console.log(`  Annual Net: ¥${monthlyTest.netSalary.toFixed(0)}`);
console.log(`  Effective Tax Rate: ${monthlyTest.effectiveTaxRate.toFixed(2)}%`);
console.log(`  Expected Gross: ¥5,199,996 ${Math.abs(monthlyTest.grossSalary - 5199996) < 5 ? '✅' : '❌'}\n`);

// Test 5: Annual to Hourly (¥6,000,000/year)
console.log('Test 5: Annual Salary to Hourly Rate');
const annualTest = calculateSalaryToHourlyJapan(6000000);
console.log(`  Annual Gross: ¥${annualTest.grossSalary.toLocaleString()}`);
console.log(`  Hourly Rate: ¥${annualTest.hourlyRate.toFixed(2)}`);
console.log(`  Annual Net: ¥${annualTest.netSalary.toFixed(0)}`);
console.log(`  Expected Hourly: ¥2,884.62 (¥6,000,000 ÷ 2,080) ${Math.abs(annualTest.hourlyRate - 2884.62) < 0.01 ? '✅' : '❌'}\n`);

// Verify all conversions yield approximately same gross salary (within ¥10)
const allEqual =
  Math.abs(hourlyTest.grossSalary - 5200000) < 1 &&
  Math.abs(dailyTest.grossSalary - 5200000) < 1 &&
  Math.abs(weeklyTest.grossSalary - 5200000) < 1 &&
  Math.abs(monthlyTest.grossSalary - 5199996) < 5;

console.log('=== Summary ===');
console.log(`All time-based conversions produce expected gross: ${allEqual ? '✅ PASS' : '❌ FAIL'}`);
console.log(`\nJapan time-based calculators are ${allEqual ? 'working correctly' : 'need adjustment'} ✅`);
console.log('\n🇯🇵 Note: Japan uses 40 hours/week standard (2,080 hours/year)');
console.log('Tax components: National Income Tax (progressive 5%-45%) + Resident Tax (flat 10%) + Social Insurance (14.75%)');
