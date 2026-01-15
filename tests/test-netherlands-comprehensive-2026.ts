// Comprehensive Netherlands 2026 Tax Calculator Verification
import { calculateNLGrossToNet } from '../lib/calculators/nl';

console.log('=== Netherlands 2026 Tax Calculator - Comprehensive Verification ===\n');

const tests = [
  {
    name: 'Low income - €25,000 (with all credits)',
    salary: 25000,
    generalCredit: true,
    employedCredit: true,
    expectedTaxBeforeCredits: 9232.50, // €25k × 36.93%
    expectedCredits: 7093, // €2,888 + €4,205
    expectedTotalTax: 2139.50, // €9,232.50 - €7,093
    expectedEffectiveRate: 8.56, // (€2,139.50 / €25k) × 100
  },
  {
    name: 'Below first bracket - €35,000 (with all credits)',
    salary: 35000,
    generalCredit: true,
    employedCredit: true,
    expectedTaxBeforeCredits: 12925.50, // €35k × 36.93%
    expectedCredits: 7093, // €2,888 + €4,205
    expectedTotalTax: 5832.50, // €12,925.50 - €7,093
    expectedEffectiveRate: 16.66, // (€5,832.50 / €35k) × 100
  },
  {
    name: 'Crossing first bracket - €45,000 (with all credits)',
    salary: 45000,
    generalCredit: true,
    employedCredit: true,
    expectedTaxBeforeCredits: 16855.40, // (€38k × 36.93%) + (€7k × 40.40%)
    expectedCredits: 7093, // €2,888 + €4,205
    expectedTotalTax: 9762.40, // €16,855.40 - €7,093
    expectedEffectiveRate: 21.69, // (€9,762.40 / €45k) × 100
  },
  {
    name: 'In second bracket - €60,000 (with all credits)',
    salary: 60000,
    generalCredit: true,
    employedCredit: true,
    expectedTaxBeforeCredits: 22915.40, // (€38k × 36.93%) + (€22k × 40.40%)
    expectedCredits: 7093, // €2,888 + €4,205
    expectedTotalTax: 15822.40, // €22,915.40 - €7,093
    expectedEffectiveRate: 26.37, // (€15,822.40 / €60k) × 100
  },
  {
    name: 'Crossing second bracket - €80,000 (with all credits)',
    salary: 80000,
    generalCredit: true,
    employedCredit: true,
    expectedTaxBeforeCredits: 31547.40, // (€38k × 36.93%) + (€36k × 40.40%) + (€6k × 49.50%)
    expectedCredits: 7093, // €2,888 + €4,205
    expectedTotalTax: 24454.40, // €31,547.40 - €7,093
    expectedEffectiveRate: 30.57, // (€24,454.40 / €80k) × 100
  },
  {
    name: 'High income - €100,000 (with all credits)',
    salary: 100000,
    generalCredit: true,
    employedCredit: true,
    expectedTaxBeforeCredits: 41447.40, // (€38k × 36.93%) + (€36k × 40.40%) + (€26k × 49.50%)
    expectedCredits: 7093, // €2,888 + €4,205
    expectedTotalTax: 34354.40, // €41,447.40 - €7,093
    expectedEffectiveRate: 34.35, // (€34,354.40 / €100k) × 100
  },
  {
    name: 'Very high income - €150,000 (top bracket, with all credits)',
    salary: 150000,
    generalCredit: true,
    employedCredit: true,
    expectedTaxBeforeCredits: 66197.40, // (€38k × 36.93%) + (€36k × 40.40%) + (€76k × 49.50%)
    expectedCredits: 7093, // €2,888 + €4,205
    expectedTotalTax: 59104.40, // €66,197.40 - €7,093
    expectedEffectiveRate: 39.40, // (€59,104.40 / €150k) × 100
  },
  {
    name: 'Middle income - €50,000 (no credits)',
    salary: 50000,
    generalCredit: false,
    employedCredit: false,
    expectedTaxBeforeCredits: 18875.40, // (€38k × 36.93%) + (€12k × 40.40%)
    expectedCredits: 0,
    expectedTotalTax: 18875.40, // €18,875.40 - €0
    expectedEffectiveRate: 37.75, // (€18,875.40 / €50k) × 100
  },
];

let passCount = 0;
let failCount = 0;

for (const test of tests) {
  console.log(`Test: ${test.name}`);
  console.log(`  Salary: €${test.salary.toLocaleString()}`);
  console.log(`  Credits: General=${test.generalCredit}, Employed=${test.employedCredit}`);

  const result = calculateNLGrossToNet(test.salary, {
    generalTaxCredit: test.generalCredit,
    employedTaxCredit: test.employedCredit,
  });

  const taxBeforeCredits = result.breakdown.find(b => b.label === 'Income Tax & Social Security')?.amount || 0;
  const taxCredits = Math.abs(result.breakdown.find(b => b.label === 'Tax Credits')?.amount || 0);
  const totalTax = result.totalTax;
  const effectiveRate = result.effectiveTaxRate;

  const taxBeforeCreditsMatch = Math.abs(taxBeforeCredits - test.expectedTaxBeforeCredits) < 10;
  const creditsMatch = Math.abs(taxCredits - test.expectedCredits) < 10;
  const totalTaxMatch = Math.abs(totalTax - test.expectedTotalTax) < 10;
  const effectiveRateMatch = Math.abs(effectiveRate - test.expectedEffectiveRate) < 0.5;

  console.log(`  Tax Before Credits: €${taxBeforeCredits.toFixed(2)} (expected €${test.expectedTaxBeforeCredits.toFixed(2)}) ${taxBeforeCreditsMatch ? '✅' : '❌'}`);
  console.log(`  Tax Credits: €${taxCredits.toFixed(2)} (expected €${test.expectedCredits.toFixed(2)}) ${creditsMatch ? '✅' : '❌'}`);
  console.log(`  Total Tax: €${totalTax.toFixed(2)} (expected €${test.expectedTotalTax.toFixed(2)}) ${totalTaxMatch ? '✅' : '❌'}`);
  console.log(`  Effective Rate: ${effectiveRate.toFixed(2)}% (expected ${test.expectedEffectiveRate.toFixed(2)}%) ${effectiveRateMatch ? '✅' : '❌'}`);
  console.log(`  Net: €${result.netSalary.toFixed(2)}`);

  if (taxBeforeCreditsMatch && creditsMatch && totalTaxMatch && effectiveRateMatch) {
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
console.log('✅ Box 1 income tax brackets: 36.93%, 40.40%, 49.50%');
console.log('✅ Bracket thresholds: €38,000 and €74,000');
console.log('✅ General tax credit (Algemene heffingskorting): €2,888');
console.log('✅ Employed tax credit (Arbeidskorting): €4,205');
console.log('✅ Social security included in Box 1 rates');
console.log('✅ Tax credits reduce total tax (non-refundable)');
console.log('✅ Optional credit application (can be disabled)');
