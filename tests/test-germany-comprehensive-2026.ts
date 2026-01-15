// Comprehensive Germany 2026 Tax Calculator Verification
import { calculateGermanyGrossToNet } from '../lib/calculators/germany';

console.log('=== Germany 2026 Tax Calculator - Comprehensive Verification ===\n');

const tests = [
  {
    name: 'Below basic allowance - €10,000',
    salary: 10000,
    churchTax: false,
    expectedIncomeTax: 0, // Below €10,908 basic allowance
    expectedSoli: 0,
    expectedChurchTax: 0,
    expectedPension: 930, // €10,000 × 9.3%
    expectedHealth: 765, // €10,000 × 7.65%
    expectedUnemployment: 120, // €10,000 × 1.2%
    expectedCare: 152.50, // €10,000 × 1.525%
  },
  {
    name: 'Low income - €20,000',
    salary: 20000,
    churchTax: false,
    expectedIncomeTax: 1956.40, // Progressive zone (calculated via German formula)
    expectedSoli: 0, // Below solidarity threshold
    expectedChurchTax: 0,
    expectedPension: 1860, // €20,000 × 9.3%
    expectedHealth: 1530, // €20,000 × 7.65%
    expectedUnemployment: 240, // €20,000 × 1.2%
    expectedCare: 305, // €20,000 × 1.525%
  },
  {
    name: 'Middle income - €40,000',
    salary: 40000,
    churchTax: false,
    expectedIncomeTax: 7828.98, // Progressive zone (calculated via German formula)
    expectedSoli: 0, // Below solidarity threshold
    expectedChurchTax: 0,
    expectedPension: 3720, // €40,000 × 9.3%
    expectedHealth: 3060, // €40,000 × 7.65%
    expectedUnemployment: 480, // €40,000 × 1.2%
    expectedCare: 610, // €40,000 × 1.525%
  },
  {
    name: 'High income - €60,000',
    salary: 60000,
    churchTax: false,
    expectedIncomeTax: 15242.28, // Progressive zone (calculated via German formula)
    expectedSoli: 0, // Below solidarity threshold
    expectedChurchTax: 0,
    expectedPension: 5580, // €60,000 × 9.3%
    expectedHealth: 4590, // €60,000 × 7.65%
    expectedUnemployment: 720, // €60,000 × 1.2%
    expectedCare: 915, // €60,000 × 1.525%
  },
  {
    name: 'Higher income with Soli - €100,000',
    salary: 100000,
    churchTax: false,
    expectedIncomeTax: 32027.02, // Linear zone (42%)
    expectedSoli: 796.62, // (€32,027.02 - €17,543) × 5.5%
    expectedChurchTax: 0,
    expectedPension: 8425.80, // Capped at €90,600 × 9.3%
    expectedHealth: 6930.90, // Capped at €90,600 × 7.65%
    expectedUnemployment: 1087.20, // Capped at €90,600 × 1.2%
    expectedCare: 1381.65, // Capped at €90,600 × 1.525%
  },
  {
    name: 'High income with Church tax (Bavaria) - €80,000',
    salary: 80000,
    churchTax: true,
    churchTaxRegion: 'bavaria' as const,
    expectedIncomeTax: 23627.02, // Linear zone (42%)
    expectedSoli: 334.62, // (€23,627.02 - €17,543) × 5.5%
    expectedChurchTax: 1890.16, // €23,627.02 × 8% (Bavaria)
    expectedPension: 7440, // €80,000 × 9.3%
    expectedHealth: 6120, // €80,000 × 7.65%
    expectedUnemployment: 960, // €80,000 × 1.2%
    expectedCare: 1220, // €80,000 × 1.525%
  },
  {
    name: 'High income with Church tax (Other state) - €80,000',
    salary: 80000,
    churchTax: true,
    churchTaxRegion: 'other' as const,
    expectedIncomeTax: 23627.02, // Linear zone (42%)
    expectedSoli: 334.62, // (€23,627.02 - €17,543) × 5.5%
    expectedChurchTax: 2126.43, // €23,627.02 × 9% (Most states)
    expectedPension: 7440, // €80,000 × 9.3%
    expectedHealth: 6120, // €80,000 × 7.65%
    expectedUnemployment: 960, // €80,000 × 1.2%
    expectedCare: 1220, // €80,000 × 1.525%
  },
  {
    name: 'Very high income (top rate) - €300,000',
    salary: 300000,
    churchTax: false,
    expectedIncomeTax: 116692.27, // Top rate zone (45%)
    expectedSoli: 5453.26, // (€116,692.27 - €17,543) × 5.5%
    expectedChurchTax: 0,
    expectedPension: 8425.80, // Capped at €90,600 × 9.3%
    expectedHealth: 6930.90, // Capped at €90,600 × 7.65%
    expectedUnemployment: 1087.20, // Capped at €90,600 × 1.2%
    expectedCare: 1381.65, // Capped at €90,600 × 1.525%
  },
];

let passCount = 0;
let failCount = 0;

for (const test of tests) {
  console.log(`Test: ${test.name}`);
  console.log(`  Salary: €${test.salary.toLocaleString()}`);
  if (test.churchTax) {
    console.log(`  Church Tax: Yes (${test.churchTaxRegion === 'bavaria' ? 'Bavaria - 8%' : 'Other state - 9%'})`);
  }

  const result = calculateGermanyGrossToNet(test.salary, {
    churchTax: test.churchTax,
    churchTaxRegion: test.churchTaxRegion,
  });

  const incomeTax = result.breakdown.find(b => b.label === 'Income Tax')?.amount || 0;
  const soli = result.breakdown.find(b => b.label === 'Solidarity Surcharge')?.amount || 0;
  const churchTax = result.breakdown.find(b => b.label === 'Church Tax')?.amount || 0;
  const pension = result.breakdown.find(b => b.label === 'Pension Insurance')?.amount || 0;
  const health = result.breakdown.find(b => b.label === 'Health Insurance')?.amount || 0;
  const unemployment = result.breakdown.find(b => b.label === 'Unemployment Insurance')?.amount || 0;
  const care = result.breakdown.find(b => b.label === 'Long-term Care')?.amount || 0;

  const incomeTaxMatch = Math.abs(incomeTax - test.expectedIncomeTax) < 10;
  const soliMatch = Math.abs(soli - test.expectedSoli) < 10;
  const churchTaxMatch = Math.abs(churchTax - test.expectedChurchTax) < 10;
  const pensionMatch = Math.abs(pension - test.expectedPension) < 10;
  const healthMatch = Math.abs(health - test.expectedHealth) < 10;
  const unemploymentMatch = Math.abs(unemployment - test.expectedUnemployment) < 1;
  const careMatch = Math.abs(care - test.expectedCare) < 1;

  console.log(`  Income Tax: €${incomeTax.toFixed(2)} (expected €${test.expectedIncomeTax.toFixed(2)}) ${incomeTaxMatch ? '✅' : '❌'}`);
  if (test.expectedSoli > 0 || soli > 0) {
    console.log(`  Solidarity Surcharge: €${soli.toFixed(2)} (expected €${test.expectedSoli.toFixed(2)}) ${soliMatch ? '✅' : '❌'}`);
  }
  if (test.churchTax) {
    console.log(`  Church Tax: €${churchTax.toFixed(2)} (expected €${test.expectedChurchTax.toFixed(2)}) ${churchTaxMatch ? '✅' : '❌'}`);
  }
  console.log(`  Pension Insurance: €${pension.toFixed(2)} (expected €${test.expectedPension.toFixed(2)}) ${pensionMatch ? '✅' : '❌'}`);
  console.log(`  Health Insurance: €${health.toFixed(2)} (expected €${test.expectedHealth.toFixed(2)}) ${healthMatch ? '✅' : '❌'}`);
  console.log(`  Unemployment: €${unemployment.toFixed(2)} (expected €${test.expectedUnemployment.toFixed(2)}) ${unemploymentMatch ? '✅' : '❌'}`);
  console.log(`  Long-term Care: €${care.toFixed(2)} (expected €${test.expectedCare.toFixed(2)}) ${careMatch ? '✅' : '❌'}`);
  console.log(`  Net: €${result.netSalary.toFixed(2)}`);
  console.log(`  Effective Tax Rate: ${result.effectiveTaxRate.toFixed(2)}%`);

  if (incomeTaxMatch && soliMatch && churchTaxMatch && pensionMatch && healthMatch && unemploymentMatch && careMatch) {
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
console.log('✅ Basic allowance (Grundfreibetrag): €10,908');
console.log('✅ Progressive income tax formula (piecewise polynomial)');
console.log('✅ Solidarity surcharge: 5.5% on income tax above threshold');
console.log('✅ Church tax: 8% (Bavaria/Baden-Württemberg) or 9% (other states)');
console.log('✅ Social security contributions:');
console.log('   - Pension: 9.3% employee share');
console.log('   - Health: 7.65% employee share');
console.log('   - Unemployment: 1.2% employee share');
console.log('   - Long-term care: 1.525% employee share');
console.log('✅ Social security ceiling: €90,600');
