#!/usr/bin/env tsx
/**
 * Advanced Options Verification Script
 *
 * Tests that advanced options properly impact calculations for ALL countries.
 * This verifies the fix for the bug where advanced options were being collected
 * but not passed to the tax calculators.
 *
 * Usage: npx tsx scripts/verify-advanced-options.ts
 */

import { calculateGrossToNet } from '../lib/calculators';

interface TestResult {
  country: string;
  testName: string;
  passed: boolean;
  expected: string;
  actual: string;
  details?: string;
}

const results: TestResult[] = [];

function addTest(country: string, testName: string, passed: boolean, expected: string, actual: string, details?: string) {
  results.push({ country, testName, passed, expected, actual, details });
}

console.log('🧪 Advanced Options Verification Test\n');
console.log('Testing that advanced options properly impact calculations...\n');

// Test 1: IRELAND - Marital Status
console.log('1️⃣ Testing IRELAND - Marital Status...');
const ieSingle = calculateGrossToNet('IE', 75000, { ieMaritalStatus: 'single' });
const ieMarried = calculateGrossToNet('IE', 75000, { ieMaritalStatus: 'married' });
const ieMaritalStatusWorks = ieMarried.netSalary > ieSingle.netSalary;
addTest(
  'Ireland',
  'Marital status changes calculation',
  ieMaritalStatusWorks,
  'Married net salary > Single net salary',
  `Single: €${ieSingle.netSalary.toFixed(2)}, Married: €${ieMarried.netSalary.toFixed(2)}`,
  ieMaritalStatusWorks ? '✅ Married couples get higher net salary due to larger standard rate band' : '❌ Marital status not affecting calculation'
);

// Test 2: IRELAND - Employment Type
console.log('2️⃣ Testing IRELAND - Employment Type...');
const ieEmployee = calculateGrossToNet('IE', 120000, { employmentType: 'employee' });
const ieSelfEmployed = calculateGrossToNet('IE', 120000, { employmentType: 'self-employed' });
const ieEmploymentTypeWorks = ieSelfEmployed.totalTax > ieEmployee.totalTax;
addTest(
  'Ireland',
  'Employment type changes calculation',
  ieEmploymentTypeWorks,
  'Self-employed pays more tax (3% USC surcharge)',
  `Employee tax: €${ieEmployee.totalTax.toFixed(2)}, Self-employed tax: €${ieSelfEmployed.totalTax.toFixed(2)}`,
  ieEmploymentTypeWorks ? '✅ Self-employed pays 3% USC surcharge on income above €100k' : '❌ Employment type not affecting calculation'
);

// Test 3: IRELAND - Pension Contribution
console.log('3️⃣ Testing IRELAND - Pension Contribution...');
const ieNoPension = calculateGrossToNet('IE', 75000, {});
const ieWithPension = calculateGrossToNet('IE', 75000, { iePensionContribution: 5000 });
const iePensionWorks = ieWithPension.netSalary > ieNoPension.netSalary;
addTest(
  'Ireland',
  'Pension contribution reduces tax',
  iePensionWorks,
  'Pension reduces taxable income',
  `No pension: €${ieNoPension.netSalary.toFixed(2)}, With €5k pension: €${ieWithPension.netSalary.toFixed(2)}`,
  iePensionWorks ? '✅ Pension contribution reduces taxable income' : '❌ Pension contribution not affecting calculation'
);

// Test 4: UK - Region
console.log('4️⃣ Testing UK - Region...');
const ukEngland = calculateGrossToNet('UK', 60000, { ukRegion: 'england' });
const ukScotland = calculateGrossToNet('UK', 60000, { ukRegion: 'scotland' });
const ukRegionWorks = ukScotland.totalTax !== ukEngland.totalTax;
addTest(
  'UK',
  'Region changes tax calculation',
  ukRegionWorks,
  'Scotland and England have different tax rates',
  `England tax: £${ukEngland.totalTax.toFixed(2)}, Scotland tax: £${ukScotland.totalTax.toFixed(2)}`,
  ukRegionWorks ? '✅ Regional tax rates applied' : '❌ Region not affecting calculation'
);

// Test 5: UK - Pension Contribution
console.log('5️⃣ Testing UK - Pension Contribution...');
const ukNoPension = calculateGrossToNet('UK', 50000, {});
const ukWithPension = calculateGrossToNet('UK', 50000, { ukPensionContribution: 3000 });
const ukPensionWorks = ukWithPension.netSalary > ukNoPension.netSalary;
addTest(
  'UK',
  'Pension contribution reduces tax',
  ukPensionWorks,
  'Pension reduces taxable income',
  `No pension: £${ukNoPension.netSalary.toFixed(2)}, With £3k pension: £${ukWithPension.netSalary.toFixed(2)}`,
  ukPensionWorks ? '✅ Pension contribution reduces taxable income' : '❌ Pension not affecting calculation'
);

// Test 6: UK - Student Loan
console.log('6️⃣ Testing UK - Student Loan...');
const ukNoLoan = calculateGrossToNet('UK', 35000, {});
const ukWithLoan = calculateGrossToNet('UK', 35000, { ukStudentLoan: 'plan1' });
const ukLoanWorks = ukWithLoan.netSalary < ukNoLoan.netSalary;
addTest(
  'UK',
  'Student loan reduces net salary',
  ukLoanWorks,
  'Student loan repayment reduces net',
  `No loan: £${ukNoLoan.netSalary.toFixed(2)}, With loan: £${ukWithLoan.netSalary.toFixed(2)}`,
  ukLoanWorks ? '✅ Student loan repayment deducted' : '❌ Student loan not affecting calculation'
);

// Test 7: AUSTRALIA - Medicare Levy Exemption
console.log('7️⃣ Testing AUSTRALIA - Medicare Levy Exemption...');
const auNoExemption = calculateGrossToNet('AU', 80000, { auMedicareLevyExemption: false });
const auWithExemption = calculateGrossToNet('AU', 80000, { auMedicareLevyExemption: true });
const auExemptionWorks = auWithExemption.netSalary > auNoExemption.netSalary;
addTest(
  'Australia',
  'Medicare levy exemption increases net',
  auExemptionWorks,
  'Exemption removes 2% Medicare levy',
  `No exemption: $${auNoExemption.netSalary.toFixed(2)}, With exemption: $${auWithExemption.netSalary.toFixed(2)}`,
  auExemptionWorks ? '✅ Medicare levy exemption applied (saves ~2%)' : '❌ Exemption not affecting calculation'
);

// Test 8: AUSTRALIA - HELP Debt
console.log('8️⃣ Testing AUSTRALIA - HELP Debt...');
const auNoDebt = calculateGrossToNet('AU', 60000, { auHELPDebt: false });
const auWithDebt = calculateGrossToNet('AU', 60000, { auHELPDebt: true });
const auDebtWorks = auWithDebt.netSalary < auNoDebt.netSalary;
addTest(
  'Australia',
  'HELP debt reduces net salary',
  auDebtWorks,
  'HELP repayment reduces net',
  `No debt: $${auNoDebt.netSalary.toFixed(2)}, With debt: $${auWithDebt.netSalary.toFixed(2)}`,
  auDebtWorks ? '✅ HELP debt repayment deducted' : '❌ HELP debt not affecting calculation'
);

// Test 9: SPAIN - Region
console.log('9️⃣ Testing SPAIN - Region...');
const esMadrid = calculateGrossToNet('ES', 50000, { esRegion: 'madrid' });
const esCatalonia = calculateGrossToNet('ES', 50000, { esRegion: 'catalonia' });
const esRegionWorks = esMadrid.totalTax !== esCatalonia.totalTax;
addTest(
  'Spain',
  'Region changes tax calculation',
  esRegionWorks,
  'Different autonomous communities have different tax rates',
  `Madrid tax: €${esMadrid.totalTax.toFixed(2)}, Catalonia tax: €${esCatalonia.totalTax.toFixed(2)}`,
  esRegionWorks ? '✅ Regional tax rates applied' : '❌ Region not affecting calculation'
);

// Test 10: ITALY - Region
console.log('🔟 Testing ITALY - Region...');
const itLazio = calculateGrossToNet('IT', 40000, { itRegion: 'lazio' });
const itLombardy = calculateGrossToNet('IT', 40000, { itRegion: 'lombardy' });
const itRegionWorks = itLazio.totalTax !== itLombardy.totalTax;
addTest(
  'Italy',
  'Region changes tax calculation',
  itRegionWorks,
  'Different regions have different surtax rates',
  `Lazio tax: €${itLazio.totalTax.toFixed(2)}, Lombardy tax: €${itLombardy.totalTax.toFixed(2)}`,
  itRegionWorks ? '✅ Regional surtax applied' : '❌ Region not affecting calculation'
);

// Test 11: FRANCE - Marital Status
console.log('1️⃣1️⃣ Testing FRANCE - Marital Status...');
const frSingle = calculateGrossToNet('FR', 60000, { frMaritalStatus: 'single' });
const frMarried = calculateGrossToNet('FR', 60000, { frMaritalStatus: 'married' });
const frMaritalWorks = frMarried.netSalary > frSingle.netSalary;
addTest(
  'France',
  'Marital status changes calculation',
  frMaritalWorks,
  'Married status changes parts fiscales',
  `Single: €${frSingle.netSalary.toFixed(2)}, Married: €${frMarried.netSalary.toFixed(2)}`,
  frMaritalWorks ? '✅ Family quotient (parts fiscales) applied' : '❌ Marital status not affecting calculation'
);

// Test 12: FRANCE - Children
console.log('1️⃣2️⃣ Testing FRANCE - Children...');
const frNoChildren = calculateGrossToNet('FR', 60000, { frMaritalStatus: 'married', frChildren: 0 });
const frWithChildren = calculateGrossToNet('FR', 60000, { frMaritalStatus: 'married', frChildren: 2 });
const frChildrenWorks = frWithChildren.netSalary > frNoChildren.netSalary;
addTest(
  'France',
  'Children increase net salary',
  frChildrenWorks,
  'Children increase parts fiscales',
  `0 children: €${frNoChildren.netSalary.toFixed(2)}, 2 children: €${frWithChildren.netSalary.toFixed(2)}`,
  frChildrenWorks ? '✅ Additional parts fiscales for children applied' : '❌ Children not affecting calculation'
);

// Test 13: NETHERLANDS - Tax Credits
console.log('1️⃣3️⃣ Testing NETHERLANDS - Tax Credits...');
const nlNoCredits = calculateGrossToNet('NL', 50000, { nlGeneralTaxCredit: false, nlLaborTaxCredit: false });
const nlWithCredits = calculateGrossToNet('NL', 50000, { nlGeneralTaxCredit: true, nlLaborTaxCredit: true });
const nlCreditsWork = nlWithCredits.netSalary > nlNoCredits.netSalary;
addTest(
  'Netherlands',
  'Tax credits increase net salary',
  nlCreditsWork,
  'Tax credits reduce total tax',
  `No credits: €${nlNoCredits.netSalary.toFixed(2)}, With credits: €${nlWithCredits.netSalary.toFixed(2)}`,
  nlCreditsWork ? '✅ Tax credits applied' : '❌ Tax credits not affecting calculation'
);

// Test 14: GERMANY - Age (Care Insurance)
console.log('1️⃣4️⃣ Testing GERMANY - Age (Care Insurance)...');
const deYoung = calculateGrossToNet('DE', 50000, { age: 22 });
const deOlder = calculateGrossToNet('DE', 50000, { age: 25 });
const deAgeWorks = deOlder.netSalary !== deYoung.netSalary;
addTest(
  'Germany',
  'Age changes care insurance rate',
  deAgeWorks,
  'Care insurance rate changes at age 23+',
  `Age 22: €${deYoung.netSalary.toFixed(2)}, Age 25: €${deOlder.netSalary.toFixed(2)}`,
  deAgeWorks ? '✅ Age-based care insurance rate applied' : '⚠️ Age not affecting calculation (may be same rate)'
);

// Test 15: US - State
console.log('1️⃣5️⃣ Testing US - State...');
const usTexas = calculateGrossToNet('US', 80000, { usState: 'TX' }); // No state tax
const usCalifornia = calculateGrossToNet('US', 80000, { usState: 'CA' }); // High state tax
const usStateWorks = usCalifornia.totalTax > usTexas.totalTax;
addTest(
  'US',
  'State changes tax calculation',
  usStateWorks,
  'Different states have different tax rates',
  `Texas tax: $${usTexas.totalTax.toFixed(2)}, California tax: $${usCalifornia.totalTax.toFixed(2)}`,
  usStateWorks ? '✅ State tax rates applied (CA has income tax, TX does not)' : '❌ State not affecting calculation'
);

// Test 16: US - Filing Status
console.log('1️⃣6️⃣ Testing US - Filing Status...');
const usSingle = calculateGrossToNet('US', 100000, { usState: 'CA', filingStatus: 'single' });
const usMarried = calculateGrossToNet('US', 100000, { usState: 'CA', filingStatus: 'married_joint' });
const usFilingWorks = usMarried.netSalary > usSingle.netSalary;
addTest(
  'US',
  'Filing status changes calculation',
  usFilingWorks,
  'Married filing has different brackets',
  `Single: $${usSingle.netSalary.toFixed(2)}, Married: $${usMarried.netSalary.toFixed(2)}`,
  usFilingWorks ? '✅ Filing status affects tax brackets' : '❌ Filing status not affecting calculation'
);

// Test 17: US - 401k Contribution
console.log('1️⃣7️⃣ Testing US - 401k Contribution...');
const usNo401k = calculateGrossToNet('US', 100000, { usState: 'CA' });
const usWith401k = calculateGrossToNet('US', 100000, { usState: 'CA', retirement401k: 10000 });
const us401kWorks = usWith401k.netSalary > usNo401k.netSalary;
addTest(
  'US',
  '401k contribution reduces tax',
  us401kWorks,
  '401k reduces taxable income',
  `No 401k: $${usNo401k.netSalary.toFixed(2)}, With $10k 401k: $${usWith401k.netSalary.toFixed(2)}`,
  us401kWorks ? '✅ 401k reduces taxable income' : '❌ 401k not affecting calculation'
);

// Test 18: CANADA - Province
console.log('1️⃣8️⃣ Testing CANADA - Province...');
const caOntario = calculateGrossToNet('CA', 70000, { canadianProvince: 'ON' });
const caAlberta = calculateGrossToNet('CA', 70000, { canadianProvince: 'AB' });
const caProvinceWorks = caOntario.totalTax !== caAlberta.totalTax;
addTest(
  'Canada',
  'Province changes tax calculation',
  caProvinceWorks,
  'Different provinces have different tax rates',
  `Ontario tax: $${caOntario.totalTax.toFixed(2)}, Alberta tax: $${caAlberta.totalTax.toFixed(2)}`,
  caProvinceWorks ? '✅ Provincial tax rates applied' : '❌ Province not affecting calculation'
);

console.log('\n' + '='.repeat(80));
console.log('📊 TEST RESULTS SUMMARY');
console.log('='.repeat(80) + '\n');

const passedTests = results.filter(r => r.passed);
const failedTests = results.filter(r => !r.passed);

console.log(`Total Tests: ${results.length}`);
console.log(`✅ Passed: ${passedTests.length} (${((passedTests.length / results.length) * 100).toFixed(1)}%)`);
console.log(`❌ Failed: ${failedTests.length} (${((failedTests.length / results.length) * 100).toFixed(1)}%)`);
console.log('');

// Group by country
const byCountry = results.reduce((acc, result) => {
  if (!acc[result.country]) acc[result.country] = [];
  acc[result.country].push(result);
  return acc;
}, {} as Record<string, TestResult[]>);

Object.entries(byCountry).forEach(([country, tests]) => {
  const countryPassed = tests.filter(t => t.passed).length;
  const countryTotal = tests.length;
  const status = countryPassed === countryTotal ? '✅' : '❌';
  console.log(`${status} ${country}: ${countryPassed}/${countryTotal} tests passed`);

  tests.forEach(test => {
    const icon = test.passed ? '  ✅' : '  ❌';
    console.log(`${icon} ${test.testName}`);
    if (!test.passed) {
      console.log(`     Expected: ${test.expected}`);
      console.log(`     Actual: ${test.actual}`);
    }
    if (test.details) {
      console.log(`     ${test.details}`);
    }
  });
  console.log('');
});

console.log('='.repeat(80));

if (failedTests.length === 0) {
  console.log('🎉 ALL TESTS PASSED! Advanced options are working correctly across all countries.');
  console.log('');
  console.log('✅ The bug fix successfully ensures that advanced options now properly');
  console.log('   impact tax calculations for all supported countries.');
  process.exit(0);
} else {
  console.log('⚠️ SOME TESTS FAILED. Advanced options may not be fully working.');
  console.log('');
  console.log('Failed tests indicate that some advanced options are still not being');
  console.log('passed through the calculation pipeline correctly.');
  process.exit(1);
}
