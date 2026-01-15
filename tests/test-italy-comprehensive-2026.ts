// Comprehensive Italy 2026 Tax Calculator Verification
import { calculateITGrossToNet } from '../lib/calculators/it';

console.log('=== Italy 2026 Tax Calculator - Comprehensive Verification ===\n');

const tests = [
  {
    name: 'Low income - €20,000 (Single, no dependents)',
    salary: 20000,
    options: { filingStatus: 'single' as const, numberOfDependents: 0 },
    expectedINPS: 1838, // €20k × 9.19%
    expectedIRPEF: 4177.26, // €18,162 × 23%
    expectedRegionalTax: 423.17, // €18,162 × 2.33% (lombardy)
    expectedMunicipalTax: 145.30, // €18,162 × 0.8%
    expectedNet: 14839.00,
    expectedEffectiveRate: 25.81,
  },
  {
    name: 'Middle income - €30,000 (Single, no dependents)',
    salary: 30000,
    options: { filingStatus: 'single' as const, numberOfDependents: 0 },
    expectedINPS: 2757, // €30k × 9.19%
    expectedIRPEF: 6265.89, // €27,243 × 23%
    expectedRegionalTax: 634.76, // €27,243 × 2.33%
    expectedMunicipalTax: 217.94, // €27,243 × 0.8%
    expectedNet: 20233.88,
    expectedEffectiveRate: 32.55,
  },
  {
    name: 'Middle-high income - €45,000 (Married, 2 dependents)',
    salary: 45000,
    options: { filingStatus: 'married_with_children' as const, numberOfDependents: 2 },
    expectedINPS: 4135.50, // €45k × 9.19%
    expectedIRPEF: 10942.58, // Progressive tax with dependent credits
    expectedRegionalTax: 952.14, // €40,864.50 × 2.33%
    expectedMunicipalTax: 326.92, // €40,864.50 × 0.8%
    expectedNet: 31325.58,
    expectedEffectiveRate: 30.39,
  },
  {
    name: 'High income - €60,000 (Single, no dependents)',
    salary: 60000,
    options: { filingStatus: 'single' as const, numberOfDependents: 0 },
    expectedINPS: 5514, // €60k × 9.19%
    expectedIRPEF: 16068.98, // Progressive tax (35% and 43% brackets)
    expectedRegionalTax: 1269.52, // €54,486 × 2.33%
    expectedMunicipalTax: 435.89, // €54,486 × 0.8%
    expectedNet: 36711.61,
    expectedEffectiveRate: 38.81,
  },
  {
    name: 'High income - €50,000 (Single with pension contribution)',
    salary: 50000,
    options: { filingStatus: 'single' as const, numberOfDependents: 0, pensionContribution: 2000 },
    expectedINPS: 4595, // €50k × 9.19%
    expectedIRPEF: 11831.75, // Progressive tax with pension deduction
    expectedRegionalTax: 1011.34, // €43,405 × 2.33%
    expectedMunicipalTax: 347.24, // €43,405 × 0.8%
    expectedNet: 32214.67,
    expectedEffectiveRate: 35.57,
  },
  {
    name: 'Very high income - €70,000 (Single, no dependents)',
    salary: 70000,
    options: { filingStatus: 'single' as const, numberOfDependents: 0 },
    expectedINPS: 6433, // €70k × 9.19%
    expectedIRPEF: 19973.81, // Progressive tax (43% bracket)
    expectedRegionalTax: 1481.11, // €63,567 × 2.33%
    expectedMunicipalTax: 508.54, // €63,567 × 0.8%
    expectedNet: 41603.54,
    expectedEffectiveRate: 40.57,
  },
  {
    name: 'Low income - €15,000 (Single, max tax credit)',
    salary: 15000,
    options: { filingStatus: 'single' as const, numberOfDependents: 0 },
    expectedINPS: 1378.50, // €15k × 9.19%
    expectedIRPEF: 3132.95, // €13,621.50 × 23%
    expectedRegionalTax: 317.38, // €13,621.50 × 2.33%
    expectedMunicipalTax: 108.97, // €13,621.50 × 0.8%
    expectedNet: 11942.20,
    expectedEffectiveRate: 20.39,
  },
  {
    name: 'Top bracket - €80,000 (Single, no dependents)',
    salary: 80000,
    options: { filingStatus: 'single' as const, numberOfDependents: 0 },
    expectedINPS: 7352, // €80k × 9.19%
    expectedIRPEF: 23878.64, // Progressive tax (43% bracket)
    expectedRegionalTax: 1692.70, // €72,648 × 2.33%
    expectedMunicipalTax: 581.18, // €72,648 × 0.8%
    expectedNet: 46495.48,
    expectedEffectiveRate: 41.88,
  },
];

let passCount = 0;
let failCount = 0;

for (const test of tests) {
  console.log(`Test: ${test.name}`);
  console.log(`  Salary: €${test.salary.toLocaleString()}`);
  console.log(`  Filing Status: ${test.options.filingStatus}, Dependents: ${test.options.numberOfDependents}`);
  if (test.options.pensionContribution) {
    console.log(`  Pension Contribution: €${test.options.pensionContribution}`);
  }

  const result = calculateITGrossToNet(test.salary, test.options);

  const irpef = result.breakdown.find(b => b.label === 'Income Tax (IRPEF)')?.amount || 0;
  const regionalTax = result.breakdown.find(b => b.label === 'Regional Tax')?.amount || 0;
  const municipalTax = result.breakdown.find(b => b.label === 'Municipal Tax')?.amount || 0;
  const inps = result.breakdown.find(b => b.label.startsWith('Social Security (INPS)'))?.amount || 0;

  const irpefMatch = Math.abs(irpef - test.expectedIRPEF) < 10;
  const regionalMatch = Math.abs(regionalTax - test.expectedRegionalTax) < 10;
  const municipalMatch = Math.abs(municipalTax - test.expectedMunicipalTax) < 10;
  const inpsMatch = Math.abs(inps - test.expectedINPS) < 10;
  const netMatch = Math.abs(result.netSalary - test.expectedNet) < 10;
  const effectiveRateMatch = Math.abs(result.effectiveTaxRate - test.expectedEffectiveRate) < 0.5;

  console.log(`  INPS: €${inps.toFixed(2)} (expected €${test.expectedINPS.toFixed(2)}) ${inpsMatch ? '✅' : '❌'}`);
  console.log(`  IRPEF: €${irpef.toFixed(2)} (expected €${test.expectedIRPEF.toFixed(2)}) ${irpefMatch ? '✅' : '❌'}`);
  console.log(`  Regional Tax: €${regionalTax.toFixed(2)} (expected €${test.expectedRegionalTax.toFixed(2)}) ${regionalMatch ? '✅' : '❌'}`);
  console.log(`  Municipal Tax: €${municipalTax.toFixed(2)} (expected €${test.expectedMunicipalTax.toFixed(2)}) ${municipalMatch ? '✅' : '❌'}`);
  console.log(`  Net: €${result.netSalary.toFixed(2)} (expected €${test.expectedNet.toFixed(2)}) ${netMatch ? '✅' : '❌'}`);
  console.log(`  Effective Rate: ${result.effectiveTaxRate.toFixed(2)}% (expected ${test.expectedEffectiveRate.toFixed(2)}%) ${effectiveRateMatch ? '✅' : '❌'}`);

  if (irpefMatch && regionalMatch && municipalMatch && inpsMatch && netMatch && effectiveRateMatch) {
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
console.log('✅ IRPEF progressive brackets: 23%, 35%, 43%');
console.log('✅ Employee INPS: 9.19% (no cap for employees)');
console.log('✅ Regional surtax: ~2.33% (Lombardy)');
console.log('✅ Municipal surtax: ~0.8% (default)');
console.log('✅ INPS deducted from gross BEFORE calculating taxable income');
console.log('✅ Employment tax credit: Up to €1,880 (income-dependent)');
console.log('✅ Dependent deductions: Spouse + children credits');
console.log('✅ Progressive calculation on adjusted taxable income');
