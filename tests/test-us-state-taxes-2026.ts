// Test script for US State Tax Calculations (2026)
import { calculateUSGrossToNet } from '../lib/calculators/us';

console.log('=== Testing US State Tax Calculations (2026) ===\n');

const testSalary = 75000;
const testStates = [
  { code: 'TX', name: 'Texas', type: 'No Tax' },
  { code: 'FL', name: 'Florida', type: 'No Tax' },
  { code: 'UT', name: 'Utah', type: 'Flat 4.65%' },
  { code: 'MA', name: 'Massachusetts', type: 'Flat 5.0%' },
  { code: 'CA', name: 'California', type: 'Progressive (up to 13.3%)' },
  { code: 'NY', name: 'New York', type: 'Progressive (up to 10.9%)' },
  { code: 'DC', name: 'District of Columbia', type: 'Progressive (up to 10.75%)' },
  { code: 'AL', name: 'Alabama', type: 'Progressive (up to 5%)' },
];

console.log(`Test Salary: $${testSalary.toLocaleString()}`);
console.log(`Filing Status: Single`);
console.log(`Employment Type: Employee\n`);

for (const state of testStates) {
  const result = calculateUSGrossToNet(testSalary, {
    state: state.code as any,
    filingStatus: 'single',
    employmentType: 'employee',
  });

  const stateTaxBreakdown = result.breakdown.find(b => b.label.includes('State Tax'));
  const stateTaxAmount = stateTaxBreakdown ? stateTaxBreakdown.amount : 0;
  const stateTaxRate = stateTaxBreakdown ? stateTaxBreakdown.rate : 0;

  console.log(`${state.name} (${state.code}) - ${state.type}:`);
  console.log(`  State Tax: $${stateTaxAmount.toFixed(2)} (${stateTaxRate?.toFixed(2) || '0.00'}%)`);
  console.log(`  Net Salary: $${result.netSalary.toFixed(2)}`);
  console.log(`  Effective Tax Rate: ${result.effectiveTaxRate.toFixed(2)}%`);
  console.log('');
}

console.log('\n=== Testing Progressive State Brackets ===\n');

// Test California at different income levels to verify progressive brackets
const californiaTests = [
  { salary: 20000, description: 'Low income' },
  { salary: 50000, description: 'Middle income' },
  { salary: 100000, description: 'High income' },
  { salary: 250000, description: 'Very high income' },
  { salary: 500000, description: 'Top bracket' },
];

console.log('California Progressive Bracket Test:\n');

for (const test of californiaTests) {
  const result = calculateUSGrossToNet(test.salary, {
    state: 'CA',
    filingStatus: 'single',
    employmentType: 'employee',
  });

  const stateTaxBreakdown = result.breakdown.find(b => b.label.includes('State Tax'));
  const stateTaxAmount = stateTaxBreakdown ? stateTaxBreakdown.amount : 0;
  const stateTaxRate = stateTaxBreakdown ? stateTaxBreakdown.rate : 0;

  console.log(`Salary: $${test.salary.toLocaleString()} (${test.description}):`);
  console.log(`  State Tax: $${stateTaxAmount.toFixed(2)} (${stateTaxRate?.toFixed(2) || '0.00'}% of gross)`);
  console.log(`  Net Salary: $${result.netSalary.toFixed(2)}`);
  console.log('');
}

console.log('=== Test Complete ===');
