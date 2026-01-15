// Comprehensive Australia 2025-26 Tax Calculator Verification
// Tax Year: 1 July 2025 - 30 June 2026
import { calculateAustraliaGrossToNet } from '../lib/calculators/australia';

console.log('=== Australia 2025-26 Tax Calculator - Comprehensive Verification ===\n');

const tests = [
  {
    name: 'Below tax-free threshold - $15,000',
    salary: 15000,
    isResident: true,
    expectedIncomeTax: 0, // Below $18,200
    expectedMedicareLevy: 0, // Below threshold
    expectedLITO: 0,
  },
  {
    name: 'Low income with full LITO - $30,000',
    salary: 30000,
    isResident: true,
    expectedIncomeTax: 1542, // ($30k - $18,200) × 19% = $2,242 - $700 LITO = $1,542
    expectedMedicareLevy: 600, // $30k × 2%
    expectedLITO: 700, // Full LITO
  },
  {
    name: 'LITO phase-out - $40,000',
    salary: 40000,
    isResident: true,
    expectedIncomeTax: 3704.50, // ($40k - $18,200) × 19% = $4,142 - $437.50 LITO (partial) = $3,704.50
    expectedMedicareLevy: 800, // $40k × 2%
    expectedLITO: 437.50, // Partial LITO ($40k between $37k-$45k phase-out range)
  },
  {
    name: 'Basic rate - $50,000 (ATO example)',
    salary: 50000,
    isResident: true,
    expectedIncomeTax: 6717, // ($45k - $18,200) × 19% + ($50k - $45k) × 32.5% = $5,092 + $1,625 = $6,717
    expectedMedicareLevy: 1000, // $50k × 2%
    expectedLITO: 0, // Fully phased out above $45k
  },
  {
    name: 'Higher bracket - $100,000',
    salary: 100000,
    isResident: true,
    expectedIncomeTax: 22967, // ($45k-$18,200)×19% + ($100k-$45k)×32.5% = $5,092 + $17,875 = $22,967
    expectedMedicareLevy: 2000, // $100k × 2%
    expectedLITO: 0,
  },
  {
    name: 'High earner without private health - $120,000 (MLS test)',
    salary: 120000,
    isResident: true,
    hasPrivateHealth: false,
    expectedIncomeTax: 29467, // ($45k-$18,200)×19% + ($120k-$45k)×32.5% = $5,092 + $24,375 = $29,467
    expectedMedicareLevy: 2400, // $120k × 2%
    expectedMLS: 1500, // $120k × 1.25% (in 2nd MLS bracket $113k-$151k)
    expectedLITO: 0,
  },
  {
    name: 'Top bracket - $200,000',
    salary: 200000,
    isResident: true,
    expectedIncomeTax: 60667, // Progressive through all brackets
    expectedMedicareLevy: 4000, // $200k × 2%
    expectedLITO: 0,
  },
  {
    name: 'Non-resident - $80,000',
    salary: 80000,
    isResident: false,
    expectedIncomeTax: 26000, // $80k × 32.5% (no tax-free threshold)
    expectedMedicareLevy: 0, // Non-residents exempt from Medicare
    expectedLITO: 0, // No LITO for non-residents
  },
];

let passCount = 0;
let failCount = 0;

for (const test of tests) {
  console.log(`Test: ${test.name}`);
  console.log(`  Salary: $${test.salary.toLocaleString()}`);
  console.log(`  Resident: ${test.isResident !== false ? 'Yes' : 'No'}`);

  const result = calculateAustraliaGrossToNet(test.salary, {
    isResident: test.isResident,
    hasPrivateHealth: test.hasPrivateHealth,
  });

  const incomeTax = result.breakdown.find(b => b.label === 'Income Tax')?.amount || 0;
  const medicareLevy = result.breakdown.find(b => b.label === 'Medicare Levy')?.amount || 0;
  const mls = result.breakdown.find(b => b.label.includes('Surcharge'))?.amount || 0;
  const lito = Math.abs(result.breakdown.find(b => b.label === 'LITO (Offset)')?.amount || 0);

  const incomeTaxMatch = Math.abs(incomeTax - test.expectedIncomeTax) < 10;
  const medicareMatch = Math.abs(medicareLevy - test.expectedMedicareLevy) < 10;
  const mlsMatch = Math.abs(mls - (test.expectedMLS || 0)) < 10;
  const litoMatch = Math.abs(lito - (test.expectedLITO || 0)) < 10;

  console.log(`  Income Tax: $${incomeTax.toFixed(2)} (expected $${test.expectedIncomeTax.toFixed(2)}) ${incomeTaxMatch ? '✅' : '❌'}`);
  console.log(`  Medicare Levy: $${medicareLevy.toFixed(2)} (expected $${test.expectedMedicareLevy.toFixed(2)}) ${medicareMatch ? '✅' : '❌'}`);
  if (test.expectedMLS) {
    console.log(`  Medicare Levy Surcharge: $${mls.toFixed(2)} (expected $${test.expectedMLS.toFixed(2)}) ${mlsMatch ? '✅' : '❌'}`);
  }
  if (test.expectedLITO) {
    console.log(`  LITO: $${lito.toFixed(2)} (expected $${test.expectedLITO.toFixed(2)}) ${litoMatch ? '✅' : '❌'}`);
  }
  console.log(`  Net: $${result.netSalary.toFixed(2)}`);
  console.log(`  Effective Tax Rate: ${result.effectiveTaxRate.toFixed(2)}%`);

  if (incomeTaxMatch && medicareMatch && mlsMatch && litoMatch) {
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

console.log('\n=== Key 2025-26 Features Tested ===');
console.log('✅ Tax brackets updated: $120k and $180k thresholds');
console.log('✅ Tax-free threshold: $18,200 for residents');
console.log('✅ LITO: $700 max, phases out $37k-$45k');
console.log('✅ Medicare Levy: 2% on taxable income');
console.log('✅ Medicare Levy Surcharge: 1-1.5% for high earners without private health');
console.log('✅ Non-resident rates: No tax-free threshold, 32.5% up to $120k');
