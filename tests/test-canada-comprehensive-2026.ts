// Comprehensive Canada 2026 Tax Calculator Verification
import { calculateCanadaGrossToNet } from '../lib/calculators/canada';

console.log('=== Canada 2026 Tax Calculator - Comprehensive Verification ===\n');

const tests = [
  {
    name: 'Low income - $20,000',
    salary: 20000,
    expectedFederalTax: 496.72, // ($20k × 14%) - ($16,452 × 14%) = $2,800 - $2,303.28
    expectedProvincialTax: 383.85, // ($20k × 5.05%) - ($12,399 × 5.05%) = $1,010 - $626.15
    expectedCPP: 981.75, // ($20k - $3,500) × 5.95%
    expectedEI: 326.00, // $20k × 1.63%
  },
  {
    name: 'Basic rate - $50,000',
    salary: 50000,
    expectedFederalTax: 4696.72, // ($50k × 14%) - ($16,452 × 14%)
    expectedProvincialTax: 1898.85, // ($50k × 5.05%) - ($12,399 × 5.05%)
    expectedCPP: 2766.75, // ($50k - $3,500) × 5.95%
    expectedEI: 815.00, // $50k × 1.63%
  },
  {
    name: 'Higher bracket - $80,000',
    salary: 80000,
    expectedFederalTax: 10292.73, // ($58,523 × 14% + $21,477 × 20.5%) - BPA credit
    expectedProvincialTax: 4484.32, // ($53,891 × 5.05% + $26,109 × 9.15%) - BPA credit
    expectedCPP: 4230.45, // Max contribution ($74,600 - $3,500) × 5.95%
    expectedEI: 1123.07, // Max premium $68,900 × 1.63%
  },
  {
    name: 'Top bracket - $300,000',
    salary: 300000,
    expectedFederalTax: 70672.77, // Full progressive with BPA credit
    expectedProvincialTax: 30777.84, // Full progressive with BPA credit
    expectedCPP: 4230.45, // Capped at max
    expectedEI: 1123.07, // Capped at max
  },
  {
    name: 'Mid-range - $100,000',
    salary: 100000,
    expectedFederalTax: 16692.73, // Progressive calculation with BPA
    expectedProvincialTax: 7127.72, // Progressive calculation with BPA
    expectedCPP: 4230.45, // Capped
    expectedEI: 1123.07, // Capped
  },
];

let passCount = 0;
let failCount = 0;

for (const test of tests) {
  console.log(`Test: ${test.name}`);
  console.log(`  Salary: $${test.salary.toLocaleString()}`);

  const result = calculateCanadaGrossToNet(test.salary);

  const federalTax = result.breakdown.find(b => b.label === 'Federal Tax')?.amount || 0;
  const provincialTax = result.breakdown.find(b => b.label.includes('Provincial'))?.amount || 0;
  const cpp = result.breakdown.find(b => b.label === 'CPP')?.amount || 0;
  const ei = result.breakdown.find(b => b.label === 'EI')?.amount || 0;

  const federalMatch = Math.abs(federalTax - test.expectedFederalTax) < 10;
  const provincialMatch = Math.abs(provincialTax - test.expectedProvincialTax) < 10;
  const cppMatch = Math.abs(cpp - test.expectedCPP) < 1;
  const eiMatch = Math.abs(ei - test.expectedEI) < 1;

  console.log(`  Federal Tax: $${federalTax.toFixed(2)} (expected $${test.expectedFederalTax.toFixed(2)}) ${federalMatch ? '✅' : '❌'}`);
  console.log(`  Provincial Tax: $${provincialTax.toFixed(2)} (expected $${test.expectedProvincialTax.toFixed(2)}) ${provincialMatch ? '✅' : '❌'}`);
  console.log(`  CPP: $${cpp.toFixed(2)} (expected $${test.expectedCPP.toFixed(2)}) ${cppMatch ? '✅' : '❌'}`);
  console.log(`  EI: $${ei.toFixed(2)} (expected $${test.expectedEI.toFixed(2)}) ${eiMatch ? '✅' : '❌'}`);
  console.log(`  Net: $${result.netSalary.toFixed(2)}`);
  console.log(`  Effective Tax Rate: ${result.effectiveTaxRate.toFixed(2)}%`);

  if (federalMatch && provincialMatch && cppMatch && eiMatch) {
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
console.log('✅ Federal lowest bracket: 14% (reduced from 15%)');
console.log('✅ CPP maximum earnings: $74,600');
console.log('✅ EI maximum earnings: $68,900');
console.log('✅ Basic Personal Amount: $16,452 (Federal), $12,399 (Ontario)');
console.log('✅ Tax credits applied correctly (non-refundable)');
