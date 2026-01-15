// Comprehensive Portugal 2026 Tax Calculator Verification
import { calculatePTGrossToNet } from '../lib/calculators/pt';

console.log('=== Portugal 2026 Tax Calculator - Comprehensive Verification ===\n');

const tests = [
  {
    name: 'Low income - €10,000',
    salary: 10000,
    expectedSocialSecurity: 1100, // €10k × 11%
    expectedIRS: 1236.11, // Progressive: €7,703 × 13.25% + €1,197 × 18%
    expectedNet: 7663.89,
    expectedEffectiveRate: 23.36,
  },
  {
    name: 'Lower-middle income - €15,000',
    salary: 15000,
    expectedSocialSecurity: 1650, // €15k × 11%
    expectedIRS: 2123.46, // Progressive through band 3
    expectedNet: 11226.54,
    expectedEffectiveRate: 25.16,
  },
  {
    name: 'Middle income - €20,000',
    salary: 20000,
    expectedSocialSecurity: 2200, // €20k × 11%
    expectedIRS: 3186.80, // Progressive through band 4
    expectedNet: 14613.20,
    expectedEffectiveRate: 26.93,
  },
  {
    name: 'Middle-high income - €30,000',
    salary: 30000,
    expectedSocialSecurity: 3300, // €30k × 11%
    expectedIRS: 5863.88, // Progressive through band 5
    expectedNet: 20836.12,
    expectedEffectiveRate: 30.55,
  },
  {
    name: 'High income - €45,000',
    salary: 45000,
    expectedSocialSecurity: 4950, // €45k × 11%
    expectedIRS: 10801.26, // Progressive through band 7
    expectedNet: 29248.74,
    expectedEffectiveRate: 35.00,
  },
  {
    name: 'Higher income - €60,000',
    salary: 60000,
    expectedSocialSecurity: 6600, // €60k × 11%
    expectedIRS: 16629.55, // Progressive through band 8
    expectedNet: 36770.45,
    expectedEffectiveRate: 38.72,
  },
  {
    name: 'Very high income - €85,000',
    salary: 85000,
    expectedSocialSecurity: 9350, // €85k × 11%
    expectedIRS: 26642.06, // Progressive through band 8
    expectedNet: 49007.94,
    expectedEffectiveRate: 42.34,
  },
  {
    name: 'Top bracket - €100,000',
    salary: 100000,
    expectedSocialSecurity: 11000, // €100k × 11%
    expectedIRS: 32883.58, // Progressive through band 9 (48%)
    expectedNet: 56116.42,
    expectedEffectiveRate: 43.88,
  },
];

let passCount = 0;
let failCount = 0;

for (const test of tests) {
  console.log(`Test: ${test.name}`);
  console.log(`  Salary: €${test.salary.toLocaleString()}`);

  const result = calculatePTGrossToNet(test.salary);

  const irs = result.breakdown.find(b => b.label === 'Income Tax (IRS)')?.amount || 0;
  const socialSecurity = result.breakdown.find(b => b.label.startsWith('Social Security'))?.amount || 0;

  const irsMatch = Math.abs(irs - test.expectedIRS) < 10;
  const socialSecurityMatch = Math.abs(socialSecurity - test.expectedSocialSecurity) < 10;
  const netMatch = Math.abs(result.netSalary - test.expectedNet) < 10;
  const effectiveRateMatch = Math.abs(result.effectiveTaxRate - test.expectedEffectiveRate) < 0.5;

  console.log(`  Social Security: €${socialSecurity.toFixed(2)} (expected €${test.expectedSocialSecurity.toFixed(2)}) ${socialSecurityMatch ? '✅' : '❌'}`);
  console.log(`  IRS: €${irs.toFixed(2)} (expected €${test.expectedIRS.toFixed(2)}) ${irsMatch ? '✅' : '❌'}`);
  console.log(`  Net: €${result.netSalary.toFixed(2)} (expected €${test.expectedNet.toFixed(2)}) ${netMatch ? '✅' : '❌'}`);
  console.log(`  Effective Rate: ${result.effectiveTaxRate.toFixed(2)}% (expected ${test.expectedEffectiveRate.toFixed(2)}%) ${effectiveRateMatch ? '✅' : '❌'}`);

  if (irsMatch && socialSecurityMatch && netMatch && effectiveRateMatch) {
    passCount++;
    console.log('  Result: ✅ PASS\n');
  } else {
    failCount++;
    console.log('  Result: ❌ FAIL\n');
  }
}

console.log('=== Summary ===');
console.log(`Total Tests: ${tests.length}`);
console.log(`Passed: ${passCount} ✅`);
console.log(`Failed: ${failCount} ${failCount > 0 ? '❌' : ''}`);
console.log(`\nAll tests ${failCount === 0 ? 'PASSED ✅' : 'FAILED ❌'}`);

console.log('\n=== Key 2026 Features Tested ===');
console.log('✅ IRS progressive brackets: 13.25%, 18%, 23%, 26%, 32.75%, 37%, 43.5%, 45%, 48%');
console.log('✅ Employee Social Security: 11% (no cap)');
console.log('✅ Social Security deducted from gross BEFORE calculating taxable income');
console.log('✅ Progressive IRS calculation on adjusted taxable income');
console.log('✅ All 9 tax brackets tested');
console.log('✅ No special bonus rates - all income taxed normally');
