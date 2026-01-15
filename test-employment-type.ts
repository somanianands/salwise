// Quick test to verify employment type is working
import { calculateGrossToNet } from './lib/calculators/index';

console.log('Testing Ireland Employment Type Change\n');
console.log('Salary: €120,000\n');

// Test 1: Employee
console.log('1. Employee (PAYE):');
const employee = calculateGrossToNet('IE', 120000, { employmentType: 'employee' });
console.log(`   Net Salary: €${employee.netSalary.toFixed(2)}`);
console.log(`   Total Tax: €${employee.totalTax.toFixed(2)}`);
console.log(`   Effective Rate: ${employee.effectiveTaxRate.toFixed(2)}%`);
console.log('');

// Test 2: Self-Employed
console.log('2. Self-Employed:');
const selfEmployed = calculateGrossToNet('IE', 120000, { employmentType: 'self-employed' });
console.log(`   Net Salary: €${selfEmployed.netSalary.toFixed(2)}`);
console.log(`   Total Tax: €${selfEmployed.totalTax.toFixed(2)}`);
console.log(`   Effective Rate: ${selfEmployed.effectiveTaxRate.toFixed(2)}%`);
console.log('');

// Test 3: Default (no option specified)
console.log('3. Default (no employment type):');
const defaultCalc = calculateGrossToNet('IE', 120000, {});
console.log(`   Net Salary: €${defaultCalc.netSalary.toFixed(2)}`);
console.log(`   Total Tax: €${defaultCalc.totalTax.toFixed(2)}`);
console.log(`   Effective Rate: ${defaultCalc.effectiveTaxRate.toFixed(2)}%`);
console.log('');

// Analysis
console.log('Analysis:');
const difference = selfEmployed.totalTax - employee.totalTax;
console.log(`Tax Difference: €${difference.toFixed(2)}`);
console.log(`Self-employed should pay €600 MORE (3% USC surcharge on €20k above €100k threshold)`);
console.log('');

if (Math.abs(difference - 600) < 10) {
  console.log('✅ Employment type IS working correctly!');
} else if (difference === 0) {
  console.log('❌ Employment type NOT affecting calculation - values are identical');
} else {
  console.log(`⚠️ Unexpected difference: €${difference.toFixed(2)}`);
}
