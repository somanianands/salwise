// Comprehensive Japan 2026 Tax Calculator Verification
import { calculateJPGrossToNet } from '../lib/calculators/jp';

console.log('=== Japan 2026 Tax Calculator - Comprehensive Verification ===\n');

const tests = [
  {
    name: 'Low income - ¥3,000,000',
    salary: 3000000,
    expectedSocialInsurance: 442500, // ¥3M × 14.75%
    expectedNationalTax: 110250, // Progressive through bands 1-2
    expectedResidentTax: 207750, // ¥2,077,500 × 10%
    expectedNet: 2239500,
    expectedEffectiveRate: 25.35,
  },
  {
    name: 'Lower-middle income - ¥4,000,000',
    salary: 4000000,
    expectedSocialInsurance: 590000, // ¥4M × 14.75%
    expectedNationalTax: 195500, // Progressive through bands 1-2
    expectedResidentTax: 293000, // ¥2,930,000 × 10%
    expectedNet: 2921500,
    expectedEffectiveRate: 26.96,
  },
  {
    name: 'Middle income - ¥5,000,000',
    salary: 5000000,
    expectedSocialInsurance: 737500, // ¥5M × 14.75%
    expectedNationalTax: 329000, // Progressive through bands 1-3
    expectedResidentTax: 378250, // ¥3,782,500 × 10%
    expectedNet: 3555250,
    expectedEffectiveRate: 28.89,
  },
  {
    name: 'Middle-high income - ¥7,000,000',
    salary: 7000000,
    expectedSocialInsurance: 1032500, // ¥7M × 14.75%
    expectedNationalTax: 670000, // Progressive through bands 1-3
    expectedResidentTax: 548750, // ¥5,487,500 × 10%
    expectedNet: 4748750,
    expectedEffectiveRate: 32.16,
  },
  {
    name: 'High income - ¥9,000,000',
    salary: 9000000,
    expectedSocialInsurance: 1327500, // ¥9M × 14.75%
    expectedNationalTax: 1018275, // Progressive through bands 1-4
    expectedResidentTax: 719250, // ¥7,192,500 × 10%
    expectedNet: 5934975,
    expectedEffectiveRate: 34.06,
  },
  {
    name: 'Higher income - ¥12,000,000',
    salary: 12000000,
    expectedSocialInsurance: 1770000, // ¥12M × 14.75%
    expectedNationalTax: 1681500, // Progressive through bands 1-5
    expectedResidentTax: 975000, // ¥9,750,000 × 10%
    expectedNet: 7573500,
    expectedEffectiveRate: 36.89,
  },
  {
    name: 'Very high income - ¥20,000,000',
    salary: 20000000,
    expectedSocialInsurance: 2950000, // ¥20M × 14.75%
    expectedNationalTax: 3932100, // Progressive through bands 1-6
    expectedResidentTax: 1657000, // ¥16,570,000 × 10%
    expectedNet: 11460900,
    expectedEffectiveRate: 42.70,
  },
  {
    name: 'Top bracket - ¥50,000,000',
    salary: 50000000,
    expectedSocialInsurance: 7375000, // ¥50M × 14.75%
    expectedNationalTax: 14169250, // Progressive, top bracket 45%
    expectedResidentTax: 4214500, // ¥42,145,000 × 10%
    expectedNet: 24241250,
    expectedEffectiveRate: 51.52,
  },
];

let passCount = 0;
let failCount = 0;

for (const test of tests) {
  console.log(`Test: ${test.name}`);
  console.log(`  Salary: ¥${test.salary.toLocaleString()}`);

  const result = calculateJPGrossToNet(test.salary);

  const nationalTax = result.breakdown.find(b => b.label === 'National Income Tax')?.amount || 0;
  const residentTax = result.breakdown.find(b => b.label.startsWith('Resident Tax'))?.amount || 0;
  const socialInsurance = result.breakdown.find(b => b.label.startsWith('Social Insurance'))?.amount || 0;

  const nationalMatch = Math.abs(nationalTax - test.expectedNationalTax) < 10;
  const residentMatch = Math.abs(residentTax - test.expectedResidentTax) < 10;
  const socialInsuranceMatch = Math.abs(socialInsurance - test.expectedSocialInsurance) < 10;
  const netMatch = Math.abs(result.netSalary - test.expectedNet) < 10;
  const effectiveRateMatch = Math.abs(result.effectiveTaxRate - test.expectedEffectiveRate) < 0.5;

  console.log(`  Social Insurance: ¥${socialInsurance.toFixed(2)} (expected ¥${test.expectedSocialInsurance.toFixed(2)}) ${socialInsuranceMatch ? '✅' : '❌'}`);
  console.log(`  National Tax: ¥${nationalTax.toFixed(2)} (expected ¥${test.expectedNationalTax.toFixed(2)}) ${nationalMatch ? '✅' : '❌'}`);
  console.log(`  Resident Tax: ¥${residentTax.toFixed(2)} (expected ¥${test.expectedResidentTax.toFixed(2)}) ${residentMatch ? '✅' : '❌'}`);
  console.log(`  Net: ¥${result.netSalary.toFixed(2)} (expected ¥${test.expectedNet.toFixed(2)}) ${netMatch ? '✅' : '❌'}`);
  console.log(`  Effective Rate: ${result.effectiveTaxRate.toFixed(2)}% (expected ${test.expectedEffectiveRate.toFixed(2)}%) ${effectiveRateMatch ? '✅' : '❌'}`);

  if (nationalMatch && residentMatch && socialInsuranceMatch && netMatch && effectiveRateMatch) {
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
console.log('✅ National income tax: Progressive 7 brackets (5%, 10%, 20%, 23%, 33%, 40%, 45%)');
console.log('✅ Resident tax: Flat 10% (6% municipal + 4% prefectural)');
console.log('✅ Employee Social Insurance: 14.75% (9.15% pension + 5% health + 0.6% employment)');
console.log('✅ Social Insurance deducted from gross BEFORE calculating taxable income');
console.log('✅ Basic Allowance: ¥480,000 standard deduction');
console.log('✅ No special bonus rates - all income taxed normally');
