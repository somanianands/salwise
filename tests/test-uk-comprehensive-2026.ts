// Comprehensive UK 2026 Tax Calculator Verification
import { calculateUKGrossToNet } from '../lib/calculators/uk';

console.log('=== UK 2026 Tax Calculator - Comprehensive Verification ===\n');

const tests = [
  {
    name: 'Low income - Below NI threshold',
    salary: 12000,
    region: 'england' as const,
    expectedIncomeTax: 0,
    expectedNI: 0,
  },
  {
    name: 'Basic rate taxpayer',
    salary: 30000,
    region: 'england' as const,
    expectedIncomeTax: 3486,
    expectedNI: 2089.92,
  },
  {
    name: 'Higher rate taxpayer',
    salary: 60000,
    region: 'england' as const,
    expectedIncomeTax: 11432,
    expectedNI: 4718.32,
  },
  {
    name: 'PA taper - £110k',
    salary: 110000,
    region: 'england' as const,
    expectedIncomeTax: 33432,
    expectedNI: 5718.32,
  },
  {
    name: 'PA fully tapered - £130k',
    salary: 130000,
    region: 'england' as const,
    expectedIncomeTax: 45331.50, // PA = £0, Tax = £37,700×20% + £74,870×40% + £17,430×45%
    expectedNI: 6118.32,
  },
  {
    name: 'Scotland basic rate',
    salary: 50000,
    region: 'scotland' as const,
    expectedIncomeTax: 8975.10,
    expectedNI: 4489.92, // Weekly £961.54: (£961.54-£242)×12%×52
  },
  {
    name: 'Scotland higher rate',
    salary: 80000,
    region: 'scotland' as const,
    expectedIncomeTax: 21275.10, // Taxable £67,430 through Scottish brackets
    expectedNI: 5118.32, // Weekly £1,538.46: (£725×12% + £571.46×2%)×52
  },
];

let passCount = 0;
let failCount = 0;

for (const test of tests) {
  console.log(`Test: ${test.name}`);
  console.log(`  Salary: £${test.salary.toLocaleString()}`);

  const result = calculateUKGrossToNet(test.salary, {
    region: test.region,
    employmentType: 'employee',
  });

  const incomeTax = result.breakdown.find(b => b.label.includes('Income Tax'))?.amount || 0;
  const ni = result.breakdown.find(b => b.label.includes('National Insurance'))?.amount || 0;

  const incomeTaxMatch = Math.abs(incomeTax - test.expectedIncomeTax) < 1;
  const niMatch = Math.abs(ni - test.expectedNI) < 1;

  console.log(`  Income Tax: £${incomeTax.toFixed(2)} (expected £${test.expectedIncomeTax.toFixed(2)}) ${incomeTaxMatch ? '✅' : '❌'}`);
  console.log(`  National Insurance: £${ni.toFixed(2)} (expected £${test.expectedNI.toFixed(2)}) ${niMatch ? '✅' : '❌'}`);
  console.log(`  Net: £${result.netSalary.toFixed(2)}`);
  console.log(`  Effective Tax Rate: ${result.effectiveTaxRate.toFixed(2)}%`);

  if (incomeTaxMatch && niMatch) {
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
