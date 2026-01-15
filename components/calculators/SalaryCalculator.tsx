'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Country, COUNTRIES, SalaryCalculation } from '@/lib/types';
import { calculateGrossToNet, calculateNetToGross, convertFrequency, CalculatorOptions } from '@/lib/calculators';
import { calculateOvertimePay } from '@/lib/calculators/overtime';
import { calculateBonusTax } from '@/lib/calculators/bonus';
import { calculateCommission } from '@/lib/calculators/commission';
import { calculateContractorIncome } from '@/lib/calculators/contractor';
import { Calculator, Loader2 } from 'lucide-react';
import TaxBreakdownChart from './TaxBreakdownChart';
import SkeletonLoader from './SkeletonLoader';
import AdvancedOptions, { AdvancedCalculatorOptions } from './AdvancedOptions';

interface Props {
  country: Country;
  initialMode?: CalculatorMode;
}

type CalculatorMode = 'gross-to-net' | 'net-to-gross' | 'hourly' | 'weekly' | 'monthly' | 'daily' | 'overtime' | 'bonus' | 'commission' | 'contractor';

export default function SalaryCalculator({ country, initialMode = 'gross-to-net' }: Props) {
  const mode = initialMode; // Mode is now fixed based on the page URL

  // Set appropriate default values based on calculator mode
  const getDefaultInputValue = () => {
    if (mode === 'hourly') return '25'; // $25/hour for hourly workers
    if (mode === 'daily') return '200'; // $200/day for daily workers
    if (mode === 'weekly') return '1000'; // $1,000/week
    if (mode === 'monthly') return '4500'; // $4,500/month
    if (mode === 'overtime') return '25'; // $25/hour regular rate
    if (mode === 'bonus' || mode === 'commission') return '60000'; // $60k base for commission/bonus roles
    if (mode === 'contractor') return '80000'; // $80k gross for contractors
    return '75000'; // $75k for standard salary calculators
  };

  const [inputValue, setInputValue] = useState<string>(getDefaultInputValue());
  const [hoursPerWeek, setHoursPerWeek] = useState<string>('40');
  const [result, setResult] = useState<SalaryCalculation | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [advancedOptions, setAdvancedOptions] = useState<AdvancedCalculatorOptions>({});

  // Overtime specific states - realistic for hourly workers
  const [regularHourlyRate, setRegularHourlyRate] = useState<string>('25'); // $25/hour (typical hourly wage)
  const [regularHours, setRegularHours] = useState<string>('40');
  const [overtimeHours, setOvertimeHours] = useState<string>('10');
  const [overtimeMultiplier, setOvertimeMultiplier] = useState<string>('1.5');

  // Bonus specific states - realistic bonus scenarios
  const [baseSalary, setBaseSalary] = useState<string>('60000'); // $60k base
  const [bonusAmount, setBonusAmount] = useState<string>('10000'); // $10k bonus (15-20% typical)

  // Commission specific states - realistic for sales roles
  const [commissionAmount, setCommissionAmount] = useState<string>('20000'); // $20k commission

  // Contractor specific states - realistic self-employed income
  const [businessExpenses, setBusinessExpenses] = useState<string>('8000'); // $8k expenses (10% of $80k)

  // Advanced options toggle state
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);

  const countryInfo = COUNTRIES[country];

  const handleCalculate = async () => {
    const value = parseFloat(inputValue);
    if (isNaN(value) || value <= 0) return;

    setIsCalculating(true);

    // Optional delay for animation visibility (set to 0 for instant results)
    const ANIMATION_DELAY = 0; // Instant calculations - no artificial delay
    if (ANIMATION_DELAY > 0) {
      await new Promise(resolve => setTimeout(resolve, ANIMATION_DELAY));
    }

    // Convert AdvancedCalculatorOptions to CalculatorOptions
    const calculatorOptions: CalculatorOptions = {
      // US specific
      usState: advancedOptions.usState,
      filingStatus: advancedOptions.filingStatus,
      employmentType: advancedOptions.employmentType,
      retirement401k: advancedOptions.retirement401k,
      traditionalIRA: advancedOptions.traditionalIRA,
      hsa: advancedOptions.hsa,
      dependents: advancedOptions.dependents,
      healthInsurance: advancedOptions.healthInsurance,
      otherPreTaxDeductions: advancedOptions.otherPreTaxDeductions,
      additionalWithholding: advancedOptions.additionalWithholding,
      customStateTaxRate: advancedOptions.customStateTaxRate,
      // Canada specific
      canadianProvince: advancedOptions.canadianProvince,
      // Ireland specific
      ieMaritalStatus: advancedOptions.ieMaritalStatus,
      iePensionContribution: advancedOptions.iePensionContribution,
      // UK specific
      ukRegion: advancedOptions.ukRegion,
      ukMarriageAllowance: advancedOptions.ukMarriageAllowance,
      ukPensionContribution: advancedOptions.ukPensionContribution,
      ukStudentLoan: advancedOptions.ukStudentLoan,
      // Australia specific
      auMedicareLevyExemption: advancedOptions.auMedicareLevyExemption,
      auHELPDebt: advancedOptions.auHELPDebt,
      // Spain specific
      esRegion: advancedOptions.esRegion,
      // Italy specific
      itRegion: advancedOptions.itRegion,
      // France specific
      frMaritalStatus: advancedOptions.frMaritalStatus,
      frChildren: advancedOptions.frChildren,
      // Netherlands specific
      nlGeneralTaxCredit: advancedOptions.nlGeneralTaxCredit,
      nlLaborTaxCredit: advancedOptions.nlLaborTaxCredit,
      // Germany specific
      age: advancedOptions.age
    };

    let calculation: any;

    if (mode === 'gross-to-net') {
      calculation = calculateGrossToNet(country, value, calculatorOptions);
    } else if (mode === 'net-to-gross') {
      calculation = calculateNetToGross(country, value, calculatorOptions);
    } else if (mode === 'hourly') {
      // Hourly mode - convert to annual first
      const hours = parseFloat(hoursPerWeek) || 40;
      const conversion = convertFrequency(value, 'hourly', hours);
      calculation = calculateGrossToNet(country, conversion.annual, calculatorOptions);
    } else if (mode === 'daily') {
      // Daily mode - convert daily salary to annual (assumes 5 days/week, 52 weeks/year)
      const annualSalary = value * 5 * 52; // 5 days per week * 52 weeks = 260 working days
      calculation = calculateGrossToNet(country, annualSalary, calculatorOptions);
    } else if (mode === 'weekly') {
      // Weekly mode - convert weekly salary to annual
      const annualSalary = value * 52; // 52 weeks per year
      calculation = calculateGrossToNet(country, annualSalary, calculatorOptions);
    } else if (mode === 'monthly') {
      // Monthly mode - convert monthly salary to annual
      const annualSalary = value * 12; // 12 months per year
      calculation = calculateGrossToNet(country, annualSalary, calculatorOptions);
    } else if (mode === 'overtime') {
      // Overtime mode
      const rate = parseFloat(regularHourlyRate) || 25;
      const regHours = parseFloat(regularHours) || 40;
      const otHours = parseFloat(overtimeHours) || 10;
      const multiplier = parseFloat(overtimeMultiplier) || 1.5;
      const hours = parseFloat(hoursPerWeek) || 40;

      calculation = calculateOvertimePay({
        regularHourlyRate: rate,
        regularHours: regHours,
        overtimeHours: otHours,
        overtimeMultiplier: multiplier,
        hoursPerWeek: hours
      }, country, calculatorOptions);
    } else if (mode === 'bonus') {
      // Bonus mode
      const salary = parseFloat(baseSalary) || 60000;
      const bonus = parseFloat(bonusAmount) || 10000;

      calculation = calculateBonusTax({
        baseSalary: salary,
        bonusAmount: bonus
      }, country, calculatorOptions);
    } else if (mode === 'commission') {
      // Commission mode
      const salary = parseFloat(baseSalary) || 60000;
      const commission = parseFloat(commissionAmount) || 20000;

      calculation = calculateCommission({
        baseSalary: salary,
        commissionAmount: commission,
        commissionFrequency: 'monthly'
      }, country, calculatorOptions);
    } else if (mode === 'contractor') {
      // Contractor/Self-employed mode
      const income = parseFloat(inputValue) || 80000;
      const expenses = parseFloat(businessExpenses) || 8000;

      calculation = calculateContractorIncome({
        grossIncome: income,
        businessExpenses: expenses
      }, country, calculatorOptions);
    } else {
      calculation = calculateGrossToNet(country, value, calculatorOptions);
    }

    setResult(calculation);
    setIsCalculating(false);
  };

  // Auto-calculate when inputs change
  useEffect(() => {
    const timer = setTimeout(() => {
      handleCalculate();
    }, 500); // Debounce for 500ms

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputValue, hoursPerWeek, JSON.stringify(advancedOptions), regularHourlyRate, regularHours, overtimeHours, overtimeMultiplier, baseSalary, bonusAmount, commissionAmount, businessExpenses, mode]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: countryInfo.currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getFrequencyBreakdown = () => {
    if (!result) return null;

    const grossConversion = convertFrequency(result.grossSalary, 'annual');
    const netConversion = convertFrequency(result.netSalary, 'annual');

    return { gross: grossConversion, net: netConversion };
  };

  const breakdown = getFrequencyBreakdown();

  // Get automatically applied tax parameters based on country and options
  const getTaxParameters = () => {
    if (!result) return null;

    const params: Array<{ label: string; value: string; tooltip?: string }> = [];

    switch (country) {
      case 'IE': // Ireland
        // Income Level
        const ieGrossSalary = result.grossSalary;
        const ieMaritalStatus = advancedOptions.ieMaritalStatus || 'single';
        const ieEmploymentType = advancedOptions.employmentType || 'employee';

        params.push({
          label: 'Annual Income',
          value: `€${ieGrossSalary.toLocaleString('en-IE', { maximumFractionDigits: 0 })}`,
          tooltip: 'Your gross annual salary'
        });

        // Tax Bracket - Dynamic based on income
        let ieTaxBracket = '20% (Standard Rate)';
        let standardRateBandValue = 44000;
        if (ieMaritalStatus === 'married') standardRateBandValue = 88000;
        else if (ieMaritalStatus === 'married_one_earner') standardRateBandValue = 53000;

        if (ieGrossSalary > standardRateBandValue) {
          const amountInHigherBand = ieGrossSalary - standardRateBandValue;
          ieTaxBracket = `20% + 40% (€${amountInHigherBand.toLocaleString('en-IE', { maximumFractionDigits: 0 })} @ higher rate)`;
        }
        params.push({
          label: 'Tax Bracket',
          value: ieTaxBracket,
          tooltip: `Standard rate band: €${standardRateBandValue.toLocaleString('en-IE')}`
        });

        // Personal Tax Credit
        const personalCredit = ieMaritalStatus === 'single' ? '€2,000' : '€4,000';
        params.push({
          label: 'Personal Tax Credit',
          value: personalCredit,
          tooltip: ieMaritalStatus === 'single' ? 'Single person credit' : 'Married couple credit (€2,000 × 2)'
        });

        // Employment Credit
        if (ieEmploymentType === 'employee') {
          params.push({
            label: 'PAYE Credit',
            value: '€2,000',
            tooltip: 'Tax credit for employees (PAYE workers)'
          });
        } else {
          params.push({
            label: 'Earned Income Credit',
            value: '€2,000',
            tooltip: 'Tax credit for self-employed workers'
          });
        }

        // USC Status - Dynamic based on income
        if (ieGrossSalary < 13000) {
          params.push({
            label: 'USC (Universal Social Charge)',
            value: 'Exempt',
            tooltip: 'Income below €13,000 exemption threshold'
          });
        } else {
          let uscRate = '0.5-8%';
          if (ieEmploymentType === 'self-employed' && ieGrossSalary > 100000) {
            const surchargeAmount = ieGrossSalary - 100000;
            params.push({
              label: 'USC + Surcharge',
              value: `0.5-11% (€${surchargeAmount.toLocaleString('en-IE', { maximumFractionDigits: 0 })} @ 11%)`,
              tooltip: 'Self-employed pay additional 3% USC above €100k (total 11%)'
            });
          } else {
            params.push({
              label: 'USC (Universal Social Charge)',
              value: uscRate,
              tooltip: 'Progressive rates: 0.5%, 2%, 3%, 8%'
            });
          }
        }

        // PRSI Status - Dynamic based on income
        const prsiThreshold = ieEmploymentType === 'employee' ? 18304 : 5000;
        if (ieGrossSalary < prsiThreshold) {
          params.push({
            label: 'PRSI',
            value: 'Below threshold',
            tooltip: `Income below €${prsiThreshold.toLocaleString('en-IE')} threshold`
          });
        } else {
          params.push({
            label: 'PRSI',
            value: '4.35% (on all income)',
            tooltip: 'Pay Related Social Insurance - applies to full income above threshold'
          });
        }
        break;

      case 'UK': // United Kingdom
        const ukGrossSalary = result.grossSalary;
        const ukRegion = advancedOptions.ukRegion || 'england';

        params.push({
          label: 'Annual Income',
          value: `£${ukGrossSalary.toLocaleString('en-GB', { maximumFractionDigits: 0 })}`,
          tooltip: 'Your gross annual salary'
        });

        params.push({
          label: 'Region',
          value: ukRegion === 'scotland' ? 'Scotland' :
                 ukRegion === 'wales' ? 'Wales' : 'England',
          tooltip: 'Tax rates vary by region'
        });

        // Tax Bracket - Dynamic
        let ukTaxBracket = 'Personal Allowance (0%)';
        if (ukGrossSalary > 12570 && ukGrossSalary <= 50270) {
          ukTaxBracket = 'Basic Rate (20%)';
        } else if (ukGrossSalary > 50270 && ukGrossSalary <= 125140) {
          ukTaxBracket = 'Higher Rate (40%)';
        } else if (ukGrossSalary > 125140) {
          ukTaxBracket = 'Additional Rate (45%)';
        }
        params.push({
          label: 'Tax Bracket',
          value: ukTaxBracket,
          tooltip: 'Your highest marginal tax rate'
        });

        // Personal Allowance - tapers above £100k
        let personalAllowance = 12570;
        if (ukGrossSalary > 100000) {
          const reduction = Math.floor((ukGrossSalary - 100000) / 2);
          personalAllowance = Math.max(0, 12570 - reduction);
        }
        params.push({
          label: 'Personal Allowance',
          value: `£${personalAllowance.toLocaleString('en-GB')}`,
          tooltip: ukGrossSalary > 100000 ? 'Reduced by £1 for every £2 above £100k' : 'Tax-free personal allowance (2025/26)'
        });

        if (advancedOptions.ukMarriageAllowance) {
          params.push({
            label: 'Marriage Allowance',
            value: '£1,260',
            tooltip: 'Transfer of unused personal allowance'
          });
        }

        // National Insurance - Dynamic
        if (ukGrossSalary <= 12570) {
          params.push({
            label: 'National Insurance',
            value: 'Below threshold',
            tooltip: 'No NI contributions below £12,570'
          });
        } else if (ukGrossSalary <= 50270) {
          params.push({
            label: 'National Insurance',
            value: '12%',
            tooltip: 'Employee NI on earnings £12,570-£50,270'
          });
        } else {
          const niAmount = ukGrossSalary - 50270;
          params.push({
            label: 'National Insurance',
            value: `12% + 2% (£${niAmount.toLocaleString('en-GB')} @ 2%)`,
            tooltip: 'NI reduces to 2% above £50,270'
          });
        }

        // Student Loan - Dynamic
        if (advancedOptions.ukStudentLoan && advancedOptions.ukStudentLoan !== 'none') {
          const plan = advancedOptions.ukStudentLoan;
          const threshold = plan === 'plan1' ? 24990 :
                           plan === 'plan2' ? 27295 :
                           plan === 'plan4' ? 31395 :
                           plan === 'postgraduate' ? 21000 : 25000;
          if (ukGrossSalary <= threshold) {
            params.push({
              label: `Student Loan (${plan.toUpperCase()})`,
              value: 'Below threshold',
              tooltip: `No repayment below £${threshold.toLocaleString('en-GB')}`
            });
          } else {
            const repaymentAmount = ukGrossSalary - threshold;
            params.push({
              label: `Student Loan (${plan.toUpperCase()})`,
              value: `9% on £${repaymentAmount.toLocaleString('en-GB')}`,
              tooltip: `9% repayment on income above £${threshold.toLocaleString('en-GB')}`
            });
          }
        }
        break;

      case 'US': // United States
        const usGrossSalary = result.grossSalary;
        const usState = advancedOptions.usState || 'CA';
        const filingStatus = advancedOptions.filingStatus || 'single';

        params.push({
          label: 'Annual Income',
          value: `$${usGrossSalary.toLocaleString('en-US', { maximumFractionDigits: 0 })}`,
          tooltip: 'Your gross annual salary'
        });

        params.push({
          label: 'State',
          value: usState,
          tooltip: 'State tax rates apply'
        });

        params.push({
          label: 'Filing Status',
          value: filingStatus === 'married_joint' ? 'Married (Joint)' :
                 filingStatus === 'married_separate' ? 'Married (Separate)' :
                 filingStatus === 'head_of_household' ? 'Head of Household' : 'Single',
          tooltip: 'Tax bracket determined by filing status'
        });

        // Federal Tax Bracket - Dynamic
        let usFederalBracket = '10%';
        if (filingStatus === 'single') {
          if (usGrossSalary > 256225) usFederalBracket = '32-37%';
          else if (usGrossSalary > 201775) usFederalBracket = '24-32%';
          else if (usGrossSalary > 105700) usFederalBracket = '22-24%';
          else if (usGrossSalary > 50400) usFederalBracket = '12-22%';
          else if (usGrossSalary > 12400) usFederalBracket = '10-12%';
        } else if (filingStatus === 'married_joint') {
          if (usGrossSalary > 512450) usFederalBracket = '32-37%';
          else if (usGrossSalary > 403550) usFederalBracket = '24-32%';
          else if (usGrossSalary > 211400) usFederalBracket = '22-24%';
          else if (usGrossSalary > 100800) usFederalBracket = '12-22%';
          else if (usGrossSalary > 24800) usFederalBracket = '10-12%';
        }
        params.push({
          label: 'Federal Tax Bracket',
          value: usFederalBracket,
          tooltip: 'Progressive federal income tax brackets'
        });

        const standardDeduction = filingStatus === 'married_joint' ? '$32,200' :
                                 filingStatus === 'head_of_household' ? '$24,150' : '$16,100';
        params.push({
          label: 'Standard Deduction',
          value: standardDeduction,
          tooltip: '2026 standard deduction amount'
        });

        // Social Security - Dynamic
        if (usGrossSalary <= 184500) {
          params.push({
            label: 'Social Security Tax',
            value: '6.2%',
            tooltip: 'Below $184,500 wage base limit'
          });
        } else {
          params.push({
            label: 'Social Security Tax',
            value: '6.2% (capped at $184,500)',
            tooltip: `No SS tax on $${(usGrossSalary - 184500).toLocaleString('en-US')} above cap`
          });
        }

        // Medicare - Dynamic
        const medicareThreshold = filingStatus === 'married_joint' ? 250000 : 200000;
        if (usGrossSalary <= medicareThreshold) {
          params.push({
            label: 'Medicare Tax',
            value: '1.45%',
            tooltip: 'Standard Medicare rate'
          });
        } else {
          const additionalAmount = usGrossSalary - medicareThreshold;
          params.push({
            label: 'Medicare Tax',
            value: `1.45% + 0.9% ($${additionalAmount.toLocaleString('en-US')} @ 2.35%)`,
            tooltip: 'Additional 0.9% Medicare tax on high earners'
          });
        }
        break;

      case 'AU': // Australia
        const auGrossSalary = result.grossSalary;

        params.push({
          label: 'Annual Income',
          value: `$${auGrossSalary.toLocaleString('en-AU', { maximumFractionDigits: 0 })}`,
          tooltip: 'Your gross annual salary'
        });

        // Tax Bracket - Dynamic
        let auTaxBracket = 'Tax-Free (0%)';
        if (auGrossSalary > 180000) auTaxBracket = 'Top Rate (45%)';
        else if (auGrossSalary > 135000) auTaxBracket = '37-45%';
        else if (auGrossSalary > 45000) auTaxBracket = '30-37%';
        else if (auGrossSalary > 18200) auTaxBracket = '19-30%';
        params.push({
          label: 'Tax Bracket',
          value: auTaxBracket,
          tooltip: 'Your marginal tax rate'
        });

        // LITO - Dynamic based on income
        if (auGrossSalary <= 37500) {
          params.push({
            label: 'LITO (Low Income Tax Offset)',
            value: '$700',
            tooltip: 'Full low income tax offset applied'
          });
        } else if (auGrossSalary < 45000) {
          const reducedLITO = Math.max(0, 700 - Math.floor((auGrossSalary - 37500) * 0.05));
          params.push({
            label: 'LITO (Low Income Tax Offset)',
            value: `$${reducedLITO}`,
            tooltip: 'Reduced LITO (phases out $37,500-$45,000)'
          });
        } else {
          params.push({
            label: 'LITO (Low Income Tax Offset)',
            value: 'Not applicable',
            tooltip: 'Income above $45,000 threshold'
          });
        }

        // Medicare Levy - Dynamic
        if (!advancedOptions.auMedicareLevyExemption) {
          if (auGrossSalary < 24276) {
            params.push({
              label: 'Medicare Levy',
              value: 'Below threshold',
              tooltip: 'Income below Medicare levy threshold'
            });
          } else {
            params.push({
              label: 'Medicare Levy',
              value: '2%',
              tooltip: 'Medicare levy on taxable income'
            });
          }
        } else {
          params.push({
            label: 'Medicare Levy',
            value: 'Exempt',
            tooltip: 'Medicare levy exemption applied'
          });
        }

        // HELP Debt - Dynamic
        if (advancedOptions.auHELPDebt) {
          if (auGrossSalary < 51550) {
            params.push({
              label: 'HELP/HECS Debt',
              value: 'No repayment',
              tooltip: 'Income below $51,550 repayment threshold'
            });
          } else {
            let helpRate = 1.0;
            if (auGrossSalary >= 151201) helpRate = 10.0;
            else if (auGrossSalary >= 142398) helpRate = 9.5;
            else if (auGrossSalary >= 133708) helpRate = 9.0;
            else if (auGrossSalary >= 125124) helpRate = 8.5;
            else if (auGrossSalary >= 116879) helpRate = 8.0;
            else if (auGrossSalary >= 109151) helpRate = 7.5;
            else if (auGrossSalary >= 101899) helpRate = 7.0;
            else if (auGrossSalary >= 95119) helpRate = 6.5;
            else if (auGrossSalary >= 88767) helpRate = 6.0;
            else if (auGrossSalary >= 82551) helpRate = 5.5;
            else if (auGrossSalary >= 76630) helpRate = 5.0;
            else if (auGrossSalary >= 71008) helpRate = 4.5;
            else if (auGrossSalary >= 65494) helpRate = 4.0;
            else if (auGrossSalary >= 60293) helpRate = 3.5;
            else if (auGrossSalary >= 55627) helpRate = 3.0;
            else if (auGrossSalary >= 51550) helpRate = 1.0;
            params.push({
              label: 'HELP/HECS Repayment',
              value: `${helpRate}% (${(auGrossSalary * helpRate / 100).toLocaleString('en-AU', { style: 'currency', currency: 'AUD', maximumFractionDigits: 0 })})`,
              tooltip: `${helpRate}% repayment rate at your income level`
            });
          }
        }
        break;

      case 'FR': // France
        const frGrossSalary = result.grossSalary;
        const frMaritalStatus = advancedOptions.frMaritalStatus || 'single';
        const frChildren = advancedOptions.frChildren || 0;

        params.push({
          label: 'Annual Income',
          value: `€${frGrossSalary.toLocaleString('fr-FR', { maximumFractionDigits: 0 })}`,
          tooltip: 'Your gross annual salary'
        });

        let parts = 1.0;
        if (frMaritalStatus === 'married') parts = 2.0;
        else if (frMaritalStatus === 'single_parent') parts = 1.5;
        parts += (frChildren || 0) * 0.5;

        params.push({
          label: 'Marital Status',
          value: frMaritalStatus === 'married' ? 'Married' :
                 frMaritalStatus === 'single_parent' ? 'Single Parent' : 'Single',
          tooltip: 'Affects parts fiscales calculation'
        });

        if (frChildren > 0) {
          params.push({
            label: 'Dependent Children',
            value: `${frChildren}`,
            tooltip: '+0.5 parts per child'
          });
        }

        // Quotient Familial - Dynamic calculation
        const quotient = Math.floor(frGrossSalary / parts);
        params.push({
          label: 'Parts Fiscales (Family Quotient)',
          value: `${parts.toFixed(1)} parts → €${quotient.toLocaleString('fr-FR')}`,
          tooltip: `Income divided by parts: €${frGrossSalary.toLocaleString('fr-FR')} ÷ ${parts.toFixed(1)} = €${quotient.toLocaleString('fr-FR')}`
        });

        // Tax Bracket based on quotient
        let frTaxBracket = '0%';
        if (quotient > 177106) frTaxBracket = '45%';
        else if (quotient > 78570) frTaxBracket = '41%';
        else if (quotient > 28797) frTaxBracket = '30%';
        else if (quotient > 11294) frTaxBracket = '11%';
        else if (quotient > 11109) frTaxBracket = '0%';
        params.push({
          label: 'Tax Bracket (on quotient)',
          value: frTaxBracket,
          tooltip: 'Marginal tax rate on family quotient'
        });

        params.push({
          label: 'CSG Rate',
          value: '9.2%',
          tooltip: 'Contribution Sociale Généralisée on 98.25% of gross'
        });

        params.push({
          label: 'CRDS Rate',
          value: '0.5%',
          tooltip: 'Contribution au Remboursement de la Dette Sociale'
        });
        break;

      case 'DE': // Germany
        const age = advancedOptions.age;

        params.push({
          label: 'Income Tax',
          value: '14-45% (progressive)',
          tooltip: 'Calculated using quadratic formula'
        });

        params.push({
          label: 'Solidarity Surcharge',
          value: '5.5% (with exemptions)',
          tooltip: 'Applied to income tax amount'
        });

        if (age && age >= 23) {
          params.push({
            label: 'Care Insurance Surcharge',
            value: '0.35% (childless 23+)',
            tooltip: 'Additional contribution for those 23+ without children'
          });
        }

        params.push({
          label: 'Social Contributions',
          value: '~20% (capped)',
          tooltip: 'Pension, unemployment, health, care insurance'
        });
        break;

      case 'ES': // Spain
        const esRegion = advancedOptions.esRegion || 'madrid';
        params.push({
          label: 'Autonomous Community',
          value: esRegion.charAt(0).toUpperCase() + esRegion.slice(1),
          tooltip: 'Regional tax rates apply'
        });

        params.push({
          label: 'IRPF (Income Tax)',
          value: '19-47% (progressive)',
          tooltip: 'National + regional income tax'
        });

        params.push({
          label: 'Social Security (Employee)',
          value: '6.35%',
          tooltip: 'Seguridad Social employee contribution'
        });

        params.push({
          label: 'Personal Allowance',
          value: '€5,550+',
          tooltip: 'Base allowance, increases with circumstances'
        });
        break;

      case 'IT': // Italy
        const itRegion = advancedOptions.itRegion || 'lazio';
        params.push({
          label: 'Region',
          value: itRegion.charAt(0).toUpperCase() + itRegion.slice(1),
          tooltip: 'Regional surtax varies by region'
        });

        params.push({
          label: 'IRPEF (Income Tax)',
          value: '23-43% (progressive)',
          tooltip: 'National income tax with 5 brackets'
        });

        params.push({
          label: 'Regional Tax',
          value: '1.23-2.33%',
          tooltip: 'Addizionale regionale (varies by region)'
        });

        params.push({
          label: 'Municipal Tax',
          value: '0-0.9%',
          tooltip: 'Addizionale comunale (varies by municipality)'
        });

        params.push({
          label: 'INPS (Social Security)',
          value: '9.19%',
          tooltip: 'Employee social security contribution'
        });
        break;

      case 'NL': // Netherlands
        params.push({
          label: 'Tax Brackets',
          value: '3 brackets (36.93%, 36.93%, 49.5%)',
          tooltip: '2026 Dutch income tax rates'
        });

        if (advancedOptions.nlGeneralTaxCredit !== false) {
          params.push({
            label: 'General Tax Credit',
            value: '~€3,070 (income-dependent)',
            tooltip: 'Algemene heffingskorting'
          });
        }

        if (advancedOptions.nlLaborTaxCredit !== false) {
          params.push({
            label: 'Labor Tax Credit',
            value: '~€5,052 (income-dependent)',
            tooltip: 'Arbeidskorting'
          });
        }

        params.push({
          label: 'Social Contributions',
          value: '~27.65%',
          tooltip: 'Pension, unemployment, health insurance'
        });
        break;

      case 'CA': // Canada
        const province = advancedOptions.canadianProvince || 'ON';
        params.push({
          label: 'Province',
          value: province,
          tooltip: 'Provincial tax rates vary'
        });

        params.push({
          label: 'Basic Personal Amount',
          value: '$15,705',
          tooltip: '2026 federal tax-free amount'
        });

        params.push({
          label: 'CPP Contribution',
          value: '5.95% (employee)',
          tooltip: 'Canada Pension Plan (with $3,500 exemption)'
        });

        params.push({
          label: 'EI Contribution',
          value: '1.63%',
          tooltip: 'Employment Insurance (max $63,200 income)'
        });
        break;
    }

    return params;
  };

  const taxParams = getTaxParameters();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* Calculator Section - LEFT */}
      <motion.div
        className="bg-white rounded-lg shadow-sm border border-gray-200 p-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-100">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-600 rounded-lg flex items-center justify-center">
            <Calculator className="w-4 h-4 text-white" />
          </div>
          <h2 className="text-lg font-semibold text-gray-900">Calculator</h2>
        </div>

        <div className="space-y-2.5">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
              <label className="text-sm sm:text-base font-semibold text-gray-700 sm:whitespace-nowrap sm:min-w-[120px]">
                {mode === 'gross-to-net' && 'Gross Salary'}
                {mode === 'net-to-gross' && 'Net Salary'}
                {mode === 'hourly' && 'Hourly Rate'}
                {mode === 'daily' && 'Daily Salary'}
                {mode === 'weekly' && 'Weekly Salary'}
                {mode === 'monthly' && 'Monthly Salary'}
                {mode === 'overtime' && 'Regular Hourly Rate'}
                {(mode === 'bonus' || mode === 'commission') && 'Base Salary'}
                {mode === 'contractor' && 'Gross Income'}
              </label>
              <input
                type="number"
                value={mode === 'overtime' ? regularHourlyRate : (mode === 'bonus' || mode === 'commission' ? baseSalary : inputValue)}
                onChange={(e) => {
                  if (mode === 'overtime') setRegularHourlyRate(e.target.value);
                  else if (mode === 'bonus' || mode === 'commission') setBaseSalary(e.target.value);
                  else setInputValue(e.target.value);
                }}
                onFocus={(e) => e.target.select()}
                className="w-full sm:flex-1 px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-base"
                placeholder={mode === 'hourly' ? '25' : mode === 'daily' ? '200' : mode === 'weekly' ? '1000' : mode === 'monthly' ? '4500' : mode === 'overtime' ? '25' : mode === 'bonus' || mode === 'commission' ? '60000' : mode === 'contractor' ? '80000' : '75000'}
                disabled={isCalculating}
              />
            </div>
          </motion.div>

          <AnimatePresence mode="wait">
            {/* Only show Hours/Week for hourly mode, not for weekly/monthly/daily */}
            {mode === 'hourly' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                  <label className="text-sm sm:text-base font-semibold text-gray-700 sm:whitespace-nowrap sm:min-w-[120px]">
                    Hours/Week
                  </label>
                  <input
                    type="number"
                    value={hoursPerWeek}
                    onChange={(e) => setHoursPerWeek(e.target.value)}
                    onFocus={(e) => e.target.select()}
                    className="w-full sm:flex-1 px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-base"
                    placeholder="40"
                    disabled={isCalculating}
                  />
                </div>
              </motion.div>
            )}

            {mode === 'overtime' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-2.5"
              >
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                  <label className="text-sm sm:text-base font-semibold text-gray-700 sm:whitespace-nowrap sm:min-w-[120px]">
                    Regular Hours/Week
                  </label>
                  <input
                    type="number"
                    value={regularHours}
                    onChange={(e) => setRegularHours(e.target.value)}
                    onFocus={(e) => e.target.select()}
                    className="w-full sm:flex-1 px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-base"
                    placeholder="40"
                    disabled={isCalculating}
                  />
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                  <label className="text-sm sm:text-base font-semibold text-gray-700 sm:whitespace-nowrap sm:min-w-[120px]">
                    Overtime Hours/Week
                  </label>
                  <input
                    type="number"
                    value={overtimeHours}
                    onChange={(e) => setOvertimeHours(e.target.value)}
                    onFocus={(e) => e.target.select()}
                    className="w-full sm:flex-1 px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-base"
                    placeholder="10"
                    disabled={isCalculating}
                  />
                </div>
                <div className="flex items-center gap-3">
                  <label className="text-sm font-semibold text-gray-700 whitespace-nowrap min-w-[120px]">
                    Overtime Multiplier
                  </label>
                  <select
                    value={overtimeMultiplier}
                    onChange={(e) => setOvertimeMultiplier(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm bg-white"
                    disabled={isCalculating}
                  >
                    <option value="1.5">1.5× (Time and a Half)</option>
                    <option value="2">2× (Double Time)</option>
                    <option value="2.5">2.5× (2.5 Time)</option>
                  </select>
                </div>
              </motion.div>
            )}

            {mode === 'bonus' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center gap-3">
                  <label className="text-sm font-semibold text-gray-700 whitespace-nowrap min-w-[120px]">
                    Bonus Amount
                  </label>
                  <input
                    type="number"
                    value={bonusAmount}
                    onChange={(e) => setBonusAmount(e.target.value)}
                    onFocus={(e) => e.target.select()}
                    className="w-full sm:flex-1 px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-base"
                    placeholder="10000"
                    disabled={isCalculating}
                  />
                </div>
              </motion.div>
            )}

            {mode === 'commission' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center gap-3">
                  <label className="text-sm font-semibold text-gray-700 whitespace-nowrap min-w-[120px]">
                    Commission Amount
                  </label>
                  <input
                    type="number"
                    value={commissionAmount}
                    onChange={(e) => setCommissionAmount(e.target.value)}
                    onFocus={(e) => e.target.select()}
                    className="w-full sm:flex-1 px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-base"
                    placeholder="20000"
                    disabled={isCalculating}
                  />
                </div>
              </motion.div>
            )}

            {mode === 'contractor' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center gap-3">
                  <label className="text-sm font-semibold text-gray-700 whitespace-nowrap min-w-[120px]">
                    Business Expenses
                  </label>
                  <input
                    type="number"
                    value={businessExpenses}
                    onChange={(e) => setBusinessExpenses(e.target.value)}
                    onFocus={(e) => e.target.select()}
                    className="w-full sm:flex-1 px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-base"
                    placeholder="8000"
                    disabled={isCalculating}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Advanced Options Toggle Button */}
          <motion.button
            onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}
            className="w-full flex items-center justify-between px-3 py-2 text-sm font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-md transition-all border border-gray-200"
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            <span>{showAdvancedOptions ? 'Hide' : 'Show'} Advanced Options</span>
            <motion.span
              animate={{ rotate: showAdvancedOptions ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              ▼
            </motion.span>
          </motion.button>

          {/* Integrated Advanced Options (Collapsible) */}
          <AnimatePresence>
            {showAdvancedOptions && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                style={{ overflow: 'hidden' }}
              >
                <AdvancedOptions country={country} onOptionsChange={setAdvancedOptions} />
              </motion.div>
            )}
          </AnimatePresence>

          <motion.button
            onClick={handleCalculate}
            disabled={isCalculating}
            className={`w-full font-semibold py-2 px-4 rounded-md transition-all text-sm ${
              isCalculating
                ? 'bg-blue-400 cursor-not-allowed text-white'
                : 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm'
            }`}
            whileHover={!isCalculating ? { scale: 1.01 } : {}}
            whileTap={!isCalculating ? { scale: 0.99 } : {}}
          >
            {isCalculating ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                Calculating...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <Calculator className="w-4 h-4" />
                {result ? 'Re-calculate' : 'Calculate'}
              </span>
            )}
          </motion.button>

          {/* Tax Parameters Applied - Below Calculate Button */}
          <AnimatePresence>
            {result && !isCalculating && taxParams && taxParams.length > 0 && (
              <motion.div
                key={`tax-params-${result.grossSalary}-${JSON.stringify(advancedOptions)}`}
                className="mt-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg shadow-sm p-3 border border-blue-200"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center">
                    <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-base font-semibold text-gray-900">Tax Rules Applied</h3>
                  <span className="text-xs text-gray-500 ml-auto">(Auto-calculated)</span>
                </div>
                <div className="space-y-2 max-h-80 overflow-y-auto">
                  {taxParams.map((param, index) => (
                    <motion.div
                      key={`${param.label}-${param.value}`}
                      className="flex items-center justify-between py-1.5 px-2 bg-white/60 rounded border border-blue-100"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.02 }}
                      title={param.tooltip}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-700">{param.label}</span>
                        {param.tooltip && (
                          <div className="relative group">
                            <svg className="w-3.5 h-3.5 text-gray-400 cursor-help" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <div className="absolute left-0 bottom-full mb-2 hidden group-hover:block w-48 p-2 bg-gray-900 text-white text-xs rounded shadow-lg z-10">
                              {param.tooltip}
                            </div>
                          </div>
                        )}
                      </div>
                      <span className="text-sm font-semibold text-blue-700">{param.value}</span>
                    </motion.div>
                  ))}
                </div>
                <div className="mt-3 pt-2 border-t border-blue-200">
                  <p className="text-xs text-gray-600 italic">
                    💡 These values are automatically calculated based on your country's {new Date().getFullYear()} tax laws and your selected options.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Results Section - RIGHT */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-100">
          <div className="w-8 h-8 bg-gradient-to-br from-green-600 to-green-600 rounded-lg flex items-center justify-center">
            <span className="text-white text-sm">📊</span>
          </div>
          <h2 className="text-lg font-semibold text-gray-900">Results</h2>
        </div>

        <AnimatePresence mode="wait">
          {isCalculating && (
            <motion.div
              key="skeleton"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <SkeletonLoader />
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          {result && !isCalculating && (
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Summary Cards */}
            <div className="grid grid-cols-3 gap-2">
              {[
                {
                  label: 'Gross Salary',
                  value: result.grossSalary,
                  sublabel: 'Annual',
                  gradient: 'from-blue-600 to-blue-600',
                  delay: 0
                },
                {
                  label: 'Net Salary',
                  value: result.netSalary,
                  sublabel: 'Take Home',
                  gradient: 'from-green-600 to-green-600',
                  delay: 0.1
                },
                {
                  label: 'Total Deductions',
                  value: result.totalTax + result.socialSecurity,
                  sublabel: `${result.effectiveTaxRate.toFixed(1)}% Effective Rate`,
                  gradient: 'from-red-600 to-red-600',
                  delay: 0.2
                }
              ].map((card, index) => (
                <motion.div
                  key={card.label}
                  className={`bg-gradient-to-br ${card.gradient} rounded-lg shadow-sm p-3 text-white`}
                  initial={{ opacity: 0, y: 20, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ delay: card.delay, type: 'spring', stiffness: 100 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                >
                  <p className="text-xs opacity-90 mb-1">{card.label}</p>
                  <motion.p
                    className="text-xl font-semibold"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: card.delay + 0.2 }}
                  >
                    {formatCurrency(card.value)}
                  </motion.p>
                  <p className="text-xs opacity-75 mt-0.5">{card.sublabel}</p>
                </motion.div>
              ))}
            </div>

          {/* Frequency Breakdown */}
          {breakdown && (
            <motion.div
              className="bg-white rounded-lg shadow-sm p-3 border border-gray-200"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <h3 className="text-base font-semibold text-gray-900 mb-3">Salary Breakdown</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-2 px-2 font-medium text-gray-700">Period</th>
                      <th className="text-right py-2 px-2 font-medium text-gray-700">Gross</th>
                      <th className="text-right py-2 px-2 font-medium text-gray-700">Net</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {[
                      { label: 'Annual', gross: breakdown.gross.annual, net: breakdown.net.annual },
                      { label: 'Monthly', gross: breakdown.gross.monthly, net: breakdown.net.monthly },
                      { label: 'Weekly', gross: breakdown.gross.weekly, net: breakdown.net.weekly },
                      { label: 'Daily', gross: breakdown.gross.daily, net: breakdown.net.daily },
                      { label: 'Hourly', gross: breakdown.gross.hourly, net: breakdown.net.hourly }
                    ].map((row, index) => (
                      <motion.tr
                        key={row.label}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 + index * 0.05 }}
                      >
                        <td className="py-2 px-2 font-medium">{row.label}</td>
                        <td className="text-right py-2 px-2">{formatCurrency(row.gross)}</td>
                        <td className="text-right py-2 px-2 text-green-600 font-semibold">
                          {formatCurrency(row.net)}
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {/* Calculator-Specific Breakdowns */}
          {mode === 'overtime' && (result as any).overtimeBreakdown && (
            <motion.div
              className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg shadow-sm p-3 border border-orange-200"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <h3 className="text-base font-semibold text-gray-900 mb-3">⏰ Overtime Pay Breakdown</h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-700">Regular Pay (Annual)</span>
                  <span className="font-semibold text-gray-900">{formatCurrency((result as any).overtimeBreakdown?.regularPay || 0)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-700">Overtime Pay (Annual)</span>
                  <span className="font-semibold text-orange-600">{formatCurrency((result as any).overtimeBreakdown?.overtimePay || 0)}</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-orange-200">
                  <span className="text-sm text-gray-700">Overtime Rate</span>
                  <span className="font-semibold text-gray-900">{formatCurrency((result as any).overtimeBreakdown?.overtimeRate || 0)}/hr</span>
                </div>
              </div>
            </motion.div>
          )}

          {mode === 'bonus' && (result as any).bonusBreakdown && (
            <motion.div
              className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg shadow-sm p-3 border border-purple-200"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <h3 className="text-base font-semibold text-gray-900 mb-3">💸 Bonus Tax Analysis</h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-700">Base Salary</span>
                  <span className="font-semibold text-gray-900">{formatCurrency((result as any).bonusBreakdown?.baseSalary || 0)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-700">Bonus Amount (Gross)</span>
                  <span className="font-semibold text-purple-600">{formatCurrency((result as any).bonusBreakdown?.bonusAmount || 0)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-700">Tax on Bonus</span>
                  <span className="font-semibold text-red-600">-{formatCurrency((result as any).bonusBreakdown?.bonusTax || 0)}</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-purple-200">
                  <span className="text-sm font-medium text-gray-700">Net Bonus (After Tax)</span>
                  <span className="font-bold text-green-600">{formatCurrency((result as any).bonusBreakdown?.bonusNet || 0)}</span>
                </div>
              </div>
            </motion.div>
          )}

          {mode === 'commission' && (result as any).commissionBreakdown && (
            <motion.div
              className="bg-gradient-to-br from-teal-50 to-teal-100 rounded-lg shadow-sm p-3 border border-teal-200"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <h3 className="text-base font-semibold text-gray-900 mb-3">💼 Commission Breakdown</h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-700">Base Salary</span>
                  <span className="font-semibold text-gray-900">{formatCurrency((result as any).commissionBreakdown?.baseSalary || 0)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-700">Commission</span>
                  <span className="font-semibold text-teal-600">{formatCurrency((result as any).commissionBreakdown?.commissionAmount || 0)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-700">Commission as % of Base</span>
                  <span className="font-semibold text-teal-700">{((result as any).commissionBreakdown?.commissionPercentage || 0).toFixed(1)}%</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-teal-200">
                  <span className="text-sm font-medium text-gray-700">Total Gross</span>
                  <span className="font-bold text-gray-900">{formatCurrency((result as any).commissionBreakdown?.totalGross || 0)}</span>
                </div>
              </div>
            </motion.div>
          )}

          {mode === 'contractor' && (result as any).contractorBreakdown && (
            <motion.div
              className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-lg shadow-sm p-3 border border-amber-200"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <h3 className="text-base font-semibold text-gray-900 mb-3">🏢 Self-Employed Breakdown</h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-700">Gross Income</span>
                  <span className="font-semibold text-gray-900">{formatCurrency((result as any).contractorBreakdown?.grossIncome || 0)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-700">Business Expenses</span>
                  <span className="font-semibold text-red-600">-{formatCurrency((result as any).contractorBreakdown?.businessExpenses || 0)}</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-amber-200">
                  <span className="text-sm text-gray-700">Net Business Income</span>
                  <span className="font-semibold text-gray-900">{formatCurrency((result as any).contractorBreakdown?.netBusinessIncome || 0)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-700">Self-Employment Tax</span>
                  <span className="font-semibold text-orange-600">{formatCurrency((result as any).contractorBreakdown?.selfEmploymentTax || 0)} ({(((result as any).contractorBreakdown?.selfEmploymentRate || 0) * 100).toFixed(1)}%)</span>
                </div>
              </div>
            </motion.div>
          )}

          {/* Detailed Breakdown */}
          <motion.div
            className="bg-white rounded-lg shadow-sm p-3 border border-gray-200"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <h3 className="text-base font-semibold text-gray-900 mb-3">Detailed Tax Breakdown</h3>
            <div className="space-y-2">
              {result.breakdown.map((item, index) => (
                <motion.div
                  key={index}
                  className="flex items-center justify-between py-1.5 border-b border-gray-100 last:border-0"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.75 + index * 0.05 }}
                  whileHover={{ x: 5, backgroundColor: 'rgba(243, 244, 246, 0.5)' }}
                >
                  <div className="flex items-center gap-2">
                    <motion.div
                      className="w-3 h-3 rounded"
                      style={{ backgroundColor: item.color }}
                      whileHover={{ scale: 1.3, rotate: 180 }}
                      transition={{ type: 'spring', stiffness: 300 }}
                    />
                    <span className="font-medium text-gray-700 text-sm">{item.label}</span>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900 text-sm">{formatCurrency(item.amount)}</p>
                    {item.rate !== undefined && (
                      <p className="text-xs text-gray-500">{item.rate.toFixed(2)}%</p>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Visual Breakdown */}
          <motion.div
            className="bg-white rounded-lg shadow-sm p-3 border border-gray-200"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.85 }}
          >
            <h3 className="text-base font-semibold text-gray-900 mb-3">Visual Breakdown</h3>
            <TaxBreakdownChart breakdown={result.breakdown} currency={countryInfo.currencySymbol} />
          </motion.div>
        </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
