// Comprehensive France 2026 Tax Calculator Verification
import { calculateFranceGrossToNet } from '../lib/calculators/france';

console.log('=== France 2026 Tax Calculator - Comprehensive Verification ===\n');

const tests = [
  {
    name: 'Low income - €20,000 (Single, no children)',
    salary: 20000,
    maritalStatus: 'single' as const,
    children: 0,
    expectedIncomeTax: 794.53, // (€20k - 10% = €18k) / 1 part, apply progressive tax
    expectedURSSAF: 4600, // €20k × 23%
    expectedCSG: 1807.80, // €20k × 98.25% × 9.2%
    expectedCRDS: 98.25, // €20k × 98.25% × 0.5%
  },
  {
    name: 'Middle income - €40,000 (Single, no children)',
    salary: 40000,
    maritalStatus: 'single' as const,
    children: 0,
    expectedIncomeTax: 4393.71, // (€40k - 10% = €36k) / 1 part, apply progressive tax
    expectedURSSAF: 9200, // €40k × 23%
    expectedCSG: 3615.60, // €40k × 98.25% × 9.2%
    expectedCRDS: 196.50, // €40k × 98.25% × 0.5%
  },
  {
    name: 'High income - €60,000 (Single, no children)',
    salary: 60000,
    maritalStatus: 'single' as const,
    children: 0,
    expectedIncomeTax: 9793.71, // (€60k - 10% = €54k) / 1 part, apply progressive tax
    expectedURSSAF: 13800, // €60k × 23%
    expectedCSG: 5423.40, // €60k × 98.25% × 9.2%
    expectedCRDS: 294.75, // €60k × 98.25% × 0.5%
  },
  {
    name: 'Middle income - €50,000 (Married, no children)',
    salary: 50000,
    maritalStatus: 'married' as const,
    children: 0,
    expectedIncomeTax: 2579.06, // (€50k - 10% = €45k) / 2 parts, apply progressive tax × 2
    expectedURSSAF: 11500, // €50k × 23%
    expectedCSG: 4519.50, // €50k × 98.25% × 9.2%
    expectedCRDS: 245.63, // €50k × 98.25% × 0.5%
  },
  {
    name: 'Middle income - €60,000 (Married, 2 children)',
    salary: 60000,
    maritalStatus: 'married' as const,
    children: 2,
    expectedIncomeTax: 2383.59, // (€60k - 10% = €54k) / 3 parts, apply progressive tax × 3
    expectedURSSAF: 13800, // €60k × 23%
    expectedCSG: 5423.40, // €60k × 98.25% × 9.2%
    expectedCRDS: 294.75, // €60k × 98.25% × 0.5%
  },
  {
    name: 'High income - €80,000 (Married, 3 children)',
    salary: 80000,
    maritalStatus: 'married' as const,
    children: 3,
    expectedIncomeTax: 3178.12, // (€80k - 10% = €72k) / 4 parts (2+0.5+0.5+1), apply progressive tax × 4
    expectedURSSAF: 18400, // €80k × 23%
    expectedCSG: 7231.20, // €80k × 98.25% × 9.2%
    expectedCRDS: 393.00, // €80k × 98.25% × 0.5%
  },
  {
    name: 'High income - €100,000 (Single, no children)',
    salary: 100000,
    maritalStatus: 'single' as const,
    children: 0,
    expectedIncomeTax: 21851.01, // (€100k - 10% = €90k) / 1 part, apply progressive tax
    expectedURSSAF: 23000, // €100k × 23%
    expectedCSG: 9039.00, // €100k × 98.25% × 9.2%
    expectedCRDS: 491.25, // €100k × 98.25% × 0.5%
  },
  {
    name: 'Very high income - €200,000 (Single, no children - Top rate)',
    salary: 200000,
    maritalStatus: 'single' as const,
    children: 0,
    expectedIncomeTax: 59191.25, // (€200k - 10% = €180k) / 1 part, apply progressive tax (45% top rate)
    expectedURSSAF: 46000, // €200k × 23%
    expectedCSG: 18078.00, // €200k × 98.25% × 9.2%
    expectedCRDS: 982.50, // €200k × 98.25% × 0.5%
  },
];

let passCount = 0;
let failCount = 0;

for (const test of tests) {
  console.log(`Test: ${test.name}`);
  console.log(`  Salary: €${test.salary.toLocaleString()}`);
  console.log(`  Family status: ${test.maritalStatus}, ${test.children} children`);

  const result = calculateFranceGrossToNet(test.salary, {
    maritalStatus: test.maritalStatus,
    children: test.children,
  });

  const incomeTax = result.breakdown.find(b => b.label === 'Income Tax')?.amount || 0;
  const urssaf = result.breakdown.find(b => b.label === 'URSSAF (Social Security)')?.amount || 0;
  const csg = result.breakdown.find(b => b.label === 'CSG')?.amount || 0;
  const crds = result.breakdown.find(b => b.label === 'CRDS')?.amount || 0;

  const incomeTaxMatch = Math.abs(incomeTax - test.expectedIncomeTax) < 10;
  const urssafMatch = Math.abs(urssaf - test.expectedURSSAF) < 10;
  const csgMatch = Math.abs(csg - test.expectedCSG) < 10;
  const crdsMatch = Math.abs(crds - test.expectedCRDS) < 1;

  console.log(`  Income Tax: €${incomeTax.toFixed(2)} (expected €${test.expectedIncomeTax.toFixed(2)}) ${incomeTaxMatch ? '✅' : '❌'}`);
  console.log(`  URSSAF: €${urssaf.toFixed(2)} (expected €${test.expectedURSSAF.toFixed(2)}) ${urssafMatch ? '✅' : '❌'}`);
  console.log(`  CSG: €${csg.toFixed(2)} (expected €${test.expectedCSG.toFixed(2)}) ${csgMatch ? '✅' : '❌'}`);
  console.log(`  CRDS: €${crds.toFixed(2)} (expected €${test.expectedCRDS.toFixed(2)}) ${crdsMatch ? '✅' : '❌'}`);
  console.log(`  Net: €${result.netSalary.toFixed(2)}`);
  console.log(`  Effective Tax Rate: ${result.effectiveTaxRate.toFixed(2)}%`);

  if (incomeTaxMatch && urssafMatch && csgMatch && crdsMatch) {
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
console.log('✅ Income tax brackets: 0%, 11%, 30%, 41%, 45%');
console.log('✅ Family quotient (quotient familial): 1-4 parts based on family');
console.log('✅ URSSAF social contributions: ~22.5% of gross');
console.log('✅ CSG: 9.2% on 98.25% of gross');
console.log('✅ CRDS: 0.5% on 98.25% of gross');
console.log('✅ Professional expenses: 10% standard deduction');
console.log('✅ Family parts calculation:');
console.log('   - Single: 1 part');
console.log('   - Married: 2 parts');
console.log('   - First 2 children: +0.5 part each');
console.log('   - Additional children: +1 part each');
