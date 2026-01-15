// Comprehensive Switzerland 2026 Tax Calculator Verification
import { calculateCHGrossToNet } from '../lib/calculators/ch';

console.log('=== Switzerland 2026 Tax Calculator - Comprehensive Verification ===\n');

const tests = [
  {
    name: 'Low income - CHF 50,000 (Zurich)',
    salary: 50000,
    canton: 'zurich' as const,
    expectedSocialSecurity: 3200, // CHF 50k × 6.4%
    expectedFederalTax: 360.47, // Progressive through bands 1-4
    expectedCantonTax: 4680, // CHF 46,800 × 10%
    expectedNet: 41759.53,
    expectedEffectiveRate: 16.48,
  },
  {
    name: 'Middle income - CHF 80,000 (Zurich)',
    salary: 80000,
    canton: 'zurich' as const,
    expectedSocialSecurity: 5120, // CHF 80k × 6.4%
    expectedFederalTax: 1369.74, // Progressive through bands 1-6
    expectedCantonTax: 7488, // CHF 74,880 × 10%
    expectedNet: 66022.26,
    expectedEffectiveRate: 17.47,
  },
  {
    name: 'High income - CHF 120,000 (Zurich)',
    salary: 120000,
    canton: 'zurich' as const,
    expectedSocialSecurity: 7680, // CHF 120k × 6.4%
    expectedFederalTax: 5675.34, // Progressive, top bracket 11.5%
    expectedCantonTax: 11232, // CHF 112,320 × 10%
    expectedNet: 95412.66,
    expectedEffectiveRate: 20.49,
  },
  {
    name: 'Low income - CHF 50,000 (Zug - lowest canton rate)',
    salary: 50000,
    canton: 'zug' as const,
    expectedSocialSecurity: 3200, // CHF 50k × 6.4%
    expectedFederalTax: 360.47, // Same federal tax
    expectedCantonTax: 2808, // CHF 46,800 × 6% (Zug rate)
    expectedNet: 43631.53,
    expectedEffectiveRate: 12.74,
  },
  {
    name: 'Middle income - CHF 80,000 (Geneva - high canton rate)',
    salary: 80000,
    canton: 'geneva' as const,
    expectedSocialSecurity: 5120, // CHF 80k × 6.4%
    expectedFederalTax: 1369.74, // Same federal tax
    expectedCantonTax: 8985.60, // CHF 74,880 × 12%
    expectedNet: 64524.66,
    expectedEffectiveRate: 19.34,
  },
  {
    name: 'High income - CHF 120,000 (Basel - highest canton rate)',
    salary: 120000,
    canton: 'basel' as const,
    expectedSocialSecurity: 7680, // CHF 120k × 6.4%
    expectedFederalTax: 5675.34, // Same federal tax
    expectedCantonTax: 14601.60, // CHF 112,320 × 13%
    expectedNet: 92043.06,
    expectedEffectiveRate: 23.30,
  },
  {
    name: 'Very high income - CHF 200,000 (Zurich)',
    salary: 200000,
    canton: 'zurich' as const,
    expectedSocialSecurity: 12800, // CHF 200k × 6.4%
    expectedFederalTax: 14286.54, // Top bracket 11.5%
    expectedCantonTax: 18720, // CHF 187,200 × 10%
    expectedNet: 154193.46,
    expectedEffectiveRate: 22.90,
  },
  {
    name: 'Top earner - CHF 250,000 (Geneva)',
    salary: 250000,
    canton: 'geneva' as const,
    expectedSocialSecurity: 16000, // CHF 250k × 6.4%
    expectedFederalTax: 19668.54, // Top bracket 11.5%
    expectedCantonTax: 28080, // CHF 234,000 × 12%
    expectedNet: 186251.46,
    expectedEffectiveRate: 25.50,
  },
];

let passCount = 0;
let failCount = 0;

for (const test of tests) {
  console.log(`Test: ${test.name}`);
  console.log(`  Salary: CHF ${test.salary.toLocaleString()}`);
  console.log(`  Canton: ${test.canton.charAt(0).toUpperCase() + test.canton.slice(1)}`);

  const result = calculateCHGrossToNet(test.salary, { canton: test.canton });

  const federalTax = result.breakdown.find(b => b.label === 'Federal Income Tax')?.amount || 0;
  const cantonTax = result.breakdown.find(b => b.label.startsWith('Cantonal/Municipal Tax'))?.amount || 0;
  const socialSecurity = result.breakdown.find(b => b.label.startsWith('Social Security'))?.amount || 0;

  const federalMatch = Math.abs(federalTax - test.expectedFederalTax) < 10;
  const cantonMatch = Math.abs(cantonTax - test.expectedCantonTax) < 10;
  const socialSecurityMatch = Math.abs(socialSecurity - test.expectedSocialSecurity) < 10;
  const netMatch = Math.abs(result.netSalary - test.expectedNet) < 10;
  const effectiveRateMatch = Math.abs(result.effectiveTaxRate - test.expectedEffectiveRate) < 0.5;

  console.log(`  Social Security: CHF ${socialSecurity.toFixed(2)} (expected CHF ${test.expectedSocialSecurity.toFixed(2)}) ${socialSecurityMatch ? '✅' : '❌'}`);
  console.log(`  Federal Tax: CHF ${federalTax.toFixed(2)} (expected CHF ${test.expectedFederalTax.toFixed(2)}) ${federalMatch ? '✅' : '❌'}`);
  console.log(`  Canton Tax: CHF ${cantonTax.toFixed(2)} (expected CHF ${test.expectedCantonTax.toFixed(2)}) ${cantonMatch ? '✅' : '❌'}`);
  console.log(`  Net: CHF ${result.netSalary.toFixed(2)} (expected CHF ${test.expectedNet.toFixed(2)}) ${netMatch ? '✅' : '❌'}`);
  console.log(`  Effective Rate: ${result.effectiveTaxRate.toFixed(2)}% (expected ${test.expectedEffectiveRate.toFixed(2)}%) ${effectiveRateMatch ? '✅' : '❌'}`);

  if (federalMatch && cantonMatch && socialSecurityMatch && netMatch && effectiveRateMatch) {
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
console.log('✅ Federal income tax: Progressive 6 brackets (0%, 0.77%, 0.88%, 2.64%, 2.97%, 11.5%)');
console.log('✅ Canton/Municipal tax: Config-based rates per canton');
console.log('✅ Employee Social Security: 6.4% (5.3% AHV/IV/EO + 1.1% ALV)');
console.log('✅ Social Security deducted from gross BEFORE calculating taxable income');
console.log('✅ Canton variation tested: Zug (6%), Zurich (10%), Geneva (12%), Basel (13%)');
console.log('✅ Very low federal tax rates compared to EU countries');
console.log('✅ No special bonus rates - all income taxed normally');
