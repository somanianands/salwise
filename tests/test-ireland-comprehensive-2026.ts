// Comprehensive Ireland 2026 Tax Calculator Verification
import { calculateIEGrossToNet } from '../lib/calculators/ie';

console.log('=== Ireland 2026 Tax Calculator - Comprehensive Verification ===\n');

const tests = [
  {
    name: 'Low income - USC exempt',
    salary: 12000,
    maritalStatus: 'single' as const,
    employmentType: 'employee' as const,
    expectedIncomeTax: 0, // €12k - €4k tax credits = €0
    expectedUSC: 0, // Below €13k exemption
    expectedPRSI: 0, // Below threshold
  },
  {
    name: 'Basic rate - Single Employee €35,000',
    salary: 35000,
    maritalStatus: 'single' as const,
    employmentType: 'employee' as const,
    expectedIncomeTax: 3000, // €35k × 20% = €7k - €4k credits = €3k
    expectedUSC: 582.82, // €12,012×0.5% + €16,688×2% + €6,300×3%
    expectedPRSI: 1522.50, // €35k × 4.35%
  },
  {
    name: 'Higher rate - Single Employee €50,000',
    salary: 50000,
    maritalStatus: 'single' as const,
    employmentType: 'employee' as const,
    expectedIncomeTax: 7200, // €44k×20% + €6k×40% = €11,200 - €4k credits = €7,200
    expectedUSC: 1032.82, // €12,012×0.5% + €16,688×2% + €21,300×3%
    expectedPRSI: 2175.00, // €50k × 4.35%
  },
  {
    name: 'Married (one income) €60,000',
    salary: 60000,
    maritalStatus: 'married_one_earner' as const,
    employmentType: 'employee' as const,
    expectedIncomeTax: 7400, // €53k×20% + €7k×40% = €13,400 - €6k credits = €7,400
    expectedUSC: 1332.82, // €12,012×0.5% + €16,688×2% + €31,300×3%
    expectedPRSI: 2610.00, // €60k × 4.35%
  },
  {
    name: 'Married (two incomes) €90,000',
    salary: 90000,
    maritalStatus: 'married' as const,
    employmentType: 'employee' as const,
    expectedIncomeTax: 12400, // €88k×20% + €2k×40% = €18,400 - €6k credits = €12,400
    expectedUSC: 3230.62, // €12,012×0.5% + €16,688×2% + €41,344×3% + €19,956×8%
    expectedPRSI: 3915.00, // €90k × 4.35%
  },
  {
    name: 'Self-employed €75,000 (no USC surcharge)',
    salary: 75000,
    maritalStatus: 'single' as const,
    employmentType: 'self-employed' as const,
    expectedIncomeTax: 17200, // €44k×20% + €31k×40% = €21,200 - €4k credits (€2k+€2k) = €17,200
    expectedUSC: 2030.62, // €12,012×0.5% + €16,688×2% + €41,344×3% + €4,956×8%
    expectedPRSI: 3262.50, // €75k × 4.35%
  },
  {
    name: 'Self-employed €120,000 (with USC surcharge)',
    salary: 120000,
    maritalStatus: 'single' as const,
    employmentType: 'self-employed' as const,
    expectedIncomeTax: 35200, // €44k×20% + €76k×40% = €39,200 - €4k credits = €35,200
    expectedUSC: 6230.62, // Base USC + €20k × 3% surcharge = €5,630.62 + €600 = €6,230.62
    expectedPRSI: 5220.00, // €120k × 4.35%
  },
];

let passCount = 0;
let failCount = 0;

for (const test of tests) {
  console.log(`Test: ${test.name}`);
  console.log(`  Salary: €${test.salary.toLocaleString()}`);
  console.log(`  Status: ${test.maritalStatus}, ${test.employmentType}`);

  const result = calculateIEGrossToNet(test.salary, {
    maritalStatus: test.maritalStatus,
    employmentType: test.employmentType,
  });

  const incomeTax = result.breakdown.find(b => b.label === 'Income Tax')?.amount || 0;
  const usc = result.breakdown.find(b => b.label === 'USC')?.amount || 0;
  const prsi = result.breakdown.find(b => b.label === 'PRSI')?.amount || 0;

  const incomeTaxMatch = Math.abs(incomeTax - test.expectedIncomeTax) < 1;
  const uscMatch = Math.abs(usc - test.expectedUSC) < 1;
  const prsiMatch = Math.abs(prsi - test.expectedPRSI) < 1;

  console.log(`  Income Tax: €${incomeTax.toFixed(2)} (expected €${test.expectedIncomeTax.toFixed(2)}) ${incomeTaxMatch ? '✅' : '❌'}`);
  console.log(`  USC: €${usc.toFixed(2)} (expected €${test.expectedUSC.toFixed(2)}) ${uscMatch ? '✅' : '❌'}`);
  console.log(`  PRSI: €${prsi.toFixed(2)} (expected €${test.expectedPRSI.toFixed(2)}) ${prsiMatch ? '✅' : '❌'}`);
  console.log(`  Net: €${result.netSalary.toFixed(2)}`);
  console.log(`  Effective Tax Rate: ${result.effectiveTaxRate.toFixed(2)}%`);

  if (incomeTaxMatch && uscMatch && prsiMatch) {
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
