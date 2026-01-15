'use client';

import { useState } from 'react';
import { Country } from '@/lib/types';
import {
  USState, US_STATES, FilingStatus, FILING_STATUS_INFO,
  CanadianProvince, CANADIAN_PROVINCES,
  IEMaritalStatus, IE_MARITAL_STATUS,
  UKRegion, UK_REGIONS,
  ESRegion, ES_REGIONS,
  ITRegion, IT_REGIONS,
  FRMaritalStatus, FR_MARITAL_STATUS
} from '@/lib/extended-types';
import { UKStudentLoanPlan } from '@/lib/calculators/uk';
import { SwissCanton } from '@/lib/calculators/ch';

interface Props {
  country: Country;
  onOptionsChange: (options: AdvancedCalculatorOptions) => void;
}

export type EmploymentType = 'employee' | 'self-employed';

export interface AdvancedCalculatorOptions {
  // US specific
  usState?: USState;
  filingStatus?: FilingStatus;
  employmentType?: EmploymentType;
  retirement401k?: number;
  traditionalIRA?: number;
  hsa?: number;
  dependents?: number;
  healthInsurance?: number;
  otherPreTaxDeductions?: number;
  additionalWithholding?: number;
  customStateTaxRate?: number;

  // Canada specific
  canadianProvince?: CanadianProvince;

  // Ireland specific
  ieMaritalStatus?: IEMaritalStatus;
  iePAYECredit?: boolean;
  iePensionContribution?: number;

  // UK specific
  ukRegion?: UKRegion;
  ukMarriageAllowance?: boolean;
  ukPensionContribution?: number;
  ukStudentLoan?: UKStudentLoanPlan;

  // Spain specific
  esRegion?: ESRegion;

  // Italy specific
  itRegion?: ITRegion;

  // Germany specific
  age?: number;

  // Australia specific
  auMedicareLevyExemption?: boolean;
  auHELPDebt?: boolean;

  // France specific
  frMaritalStatus?: FRMaritalStatus;
  frChildren?: number;

  // Netherlands specific
  nlGeneralTaxCredit?: boolean;
  nlLaborTaxCredit?: boolean;

  // Portugal specific
  ptEmploymentType?: EmploymentType;

  // Switzerland specific
  chCanton?: SwissCanton;

  // Japan specific
  jpDependents?: number;
}

export default function AdvancedOptions({ country, onOptionsChange }: Props) {
  const [options, setOptions] = useState<AdvancedCalculatorOptions>({
    usState: 'CA',
    filingStatus: 'single',
    employmentType: 'employee',
    retirement401k: undefined,
    traditionalIRA: undefined,
    hsa: undefined,
    dependents: undefined,
    healthInsurance: undefined,
    otherPreTaxDeductions: undefined,
    additionalWithholding: undefined,
    canadianProvince: 'ON',
    ieMaritalStatus: 'single',
    iePAYECredit: true,
    iePensionContribution: undefined,
    ukRegion: 'england',
    ukMarriageAllowance: false,
    ukPensionContribution: undefined,
    ukStudentLoan: 'none',
    esRegion: 'madrid',
    itRegion: 'lombardy',
    age: 30,
    auMedicareLevyExemption: false,
    auHELPDebt: false,
    frMaritalStatus: 'single',
    frChildren: 0,
    nlGeneralTaxCredit: true,
    nlLaborTaxCredit: true,
    ptEmploymentType: 'employee',
    chCanton: 'zurich',
    jpDependents: 0
  });

  const updateOption = <K extends keyof AdvancedCalculatorOptions>(
    key: K,
    value: AdvancedCalculatorOptions[K]
  ) => {
    const newOptions = { ...options, [key]: value };
    setOptions(newOptions);
    onOptionsChange(newOptions);
  };

  const isUS = country === 'US';
  const isUK = country === 'UK';
  const isIE = country === 'IE';
  const isCanada = country === 'CA';
  const isAustralia = country === 'AU';
  const isGermany = country === 'DE';
  const isFrance = country === 'FR';
  const isNetherlands = country === 'NL';
  const isSpain = country === 'ES';
  const isItaly = country === 'IT';
  const isPortugal = country === 'PT';
  const isSwitzerland = country === 'CH';
  const isJapan = country === 'JP';

  const showAdvanced = isUS || isUK || isIE || isCanada || isAustralia || isGermany || isFrance || isNetherlands || isSpain || isItaly || isPortugal || isSwitzerland || isJapan;

  if (!showAdvanced) return null;

  return (
    <div className="space-y-2 pt-3">
              {/* US Options */}
              {isUS && (
                <>
                  {/* State Selector */}
                  <div className="flex items-center gap-3">
                    <label className="text-sm font-semibold text-gray-700 whitespace-nowrap min-w-[120px]">
                      State
                    </label>
                    <select
                      value={options.usState}
                      onChange={(e) => updateOption('usState', e.target.value as USState)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm bg-white"
                    >
                      {Object.entries(US_STATES).map(([code, info]) => (
                        <option key={code} value={code}>
                          {info.name} {info.hasTax ? `(${(info.taxRate * 100).toFixed(2)}%)` : '(No state tax)'}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Filing Status */}
                  <div className="flex items-center gap-3">
                    <label className="text-sm font-semibold text-gray-700 whitespace-nowrap min-w-[120px]">
                      Filing Status
                    </label>
                    <select
                      value={options.filingStatus}
                      onChange={(e) => updateOption('filingStatus', e.target.value as FilingStatus)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm bg-white"
                    >
                      {Object.entries(FILING_STATUS_INFO).map(([key, info]) => (
                        <option key={key} value={key}>
                          {info.name}
                        </option>
                      ))}
                    </select>
                    <p className="text-xs text-gray-500 mt-1">
                      {FILING_STATUS_INFO[options.filingStatus || 'single'].description}
                    </p>
                  </div>

                  {/* Employment Type */}
                  <div>
                    <div className="flex items-center gap-3">
                      <label className="text-sm font-semibold text-gray-700 whitespace-nowrap min-w-[120px]">
                        Employment Type
                      </label>
                      <select
                        value={options.employmentType}
                        onChange={(e) => updateOption('employmentType', e.target.value as EmploymentType)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm bg-white"
                      >
                        <option value="employee">Employee (W-2)</option>
                        <option value="self-employed">Self-Employed (1099 / Contractor)</option>
                      </select>
                    </div>
                    <p className="text-xs text-gray-500 mt-1 ml-[132px]">
                      {options.employmentType === 'self-employed'
                        ? 'Self-employment tax: 15.3% (SS 12.4% + Medicare 2.9%)'
                        : 'Employee FICA: 7.65% (SS 6.2% + Medicare 1.45%)'}
                    </p>
                  </div>

                  {/* Dependents */}
                  <div>
                    <div className="flex items-center gap-3">
                      <label className="text-sm font-semibold text-gray-700 whitespace-nowrap min-w-[120px]">
                        Dependents
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="20"
                        value={options.dependents ?? ''}
                        onChange={(e) => updateOption('dependents', e.target.value === '' ? undefined : parseInt(e.target.value))}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm bg-white"
                        placeholder="0"
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1 ml-[132px]">
                      $2,000 tax credit each
                    </p>
                  </div>

                  {/* Pre-tax Deductions */}
                  <div className="space-y-2 pt-2">
                    <h4 className="text-sm font-semibold text-gray-900">Pre-Tax Deductions (Annual)</h4>

                    <div>
                      <div className="flex items-center gap-3">
                        <label className="text-sm font-semibold text-gray-700 whitespace-nowrap min-w-[120px]">
                          401(k)
                        </label>
                        <div className="relative flex-1">
                          <span className="absolute left-3 top-2 text-gray-500 text-xs">$</span>
                          <input
                            type="number"
                            min="0"
                            max="23500"
                            value={options.retirement401k ?? ''}
                            onChange={(e) => updateOption('retirement401k', e.target.value === '' ? undefined : parseInt(e.target.value))}
                            className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm"
                            placeholder="0"
                          />
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 mt-1 ml-[132px]">2026 limit: $23,500</p>
                    </div>

                    <div>
                      <div className="flex items-center gap-3">
                        <label className="text-sm font-semibold text-gray-700 whitespace-nowrap min-w-[120px]">
                          IRA
                        </label>
                        <div className="relative flex-1">
                          <span className="absolute left-3 top-2 text-gray-500 text-xs">$</span>
                          <input
                            type="number"
                            min="0"
                            max="7000"
                            value={options.traditionalIRA ?? ''}
                            onChange={(e) => updateOption('traditionalIRA', e.target.value === '' ? undefined : parseInt(e.target.value))}
                            className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm"
                            placeholder="0"
                          />
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 mt-1 ml-[132px]">2026 limit: $7,000</p>
                    </div>

                    <div>
                      <div className="flex items-center gap-3">
                        <label className="text-sm font-semibold text-gray-700 whitespace-nowrap min-w-[120px]">
                          HSA
                        </label>
                        <div className="relative flex-1">
                          <span className="absolute left-3 top-2 text-gray-500 text-xs">$</span>
                          <input
                            type="number"
                            min="0"
                            max="8550"
                            value={options.hsa ?? ''}
                            onChange={(e) => updateOption('hsa', e.target.value === '' ? undefined : parseInt(e.target.value))}
                            className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm"
                            placeholder="0"
                          />
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 mt-1 ml-[132px]">2026 limit: $4,300 (single), $8,550 (family)</p>
                    </div>

                    <div>
                      <div className="flex items-center gap-3">
                        <label className="text-sm font-semibold text-gray-700 whitespace-nowrap min-w-[120px]">
                          Health Insurance
                        </label>
                        <div className="relative flex-1">
                          <span className="absolute left-3 top-2 text-gray-500 text-xs">$</span>
                          <input
                            type="number"
                            min="0"
                            value={options.healthInsurance ?? ''}
                            onChange={(e) => updateOption('healthInsurance', e.target.value === '' ? undefined : parseInt(e.target.value))}
                            className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm"
                            placeholder="0"
                          />
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 mt-1 ml-[132px]">Pre-tax employer-sponsored health insurance premiums</p>
                    </div>

                    <div>
                      <div className="flex items-center gap-3">
                        <label className="text-sm font-semibold text-gray-700 whitespace-nowrap min-w-[120px]">
                          Other Pre-Tax
                        </label>
                        <div className="relative flex-1">
                          <span className="absolute left-3 top-2 text-gray-500 text-xs">$</span>
                          <input
                            type="number"
                            min="0"
                            value={options.otherPreTaxDeductions ?? ''}
                            onChange={(e) => updateOption('otherPreTaxDeductions', e.target.value === '' ? undefined : parseInt(e.target.value))}
                            className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm"
                            placeholder="0"
                          />
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 mt-1 ml-[132px]">Commuter benefits, FSA, other pre-tax deductions</p>
                    </div>
                  </div>

                  {/* Additional Withholding (Power User) */}
                  <div className="space-y-2 pt-3 border-t border-gray-200">
                    <h4 className="text-sm font-semibold text-gray-900">Additional Options</h4>

                    <div>
                      <div className="flex items-center gap-3">
                        <label className="text-sm font-semibold text-gray-700 whitespace-nowrap min-w-[120px]">
                          Extra Withholding
                        </label>
                        <div className="relative flex-1">
                          <span className="absolute left-3 top-2 text-gray-500 text-xs">$</span>
                          <input
                            type="number"
                            min="0"
                            value={options.additionalWithholding ?? ''}
                            onChange={(e) => updateOption('additionalWithholding', e.target.value === '' ? undefined : parseInt(e.target.value))}
                            className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm"
                            placeholder="0"
                          />
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 mt-1 ml-[132px]">Additional tax withholding from each paycheck (W-4 Step 4c)</p>
                    </div>
                  </div>
                </>
              )}

              {/* Canada Options */}
              {isCanada && (
                <div className="flex items-center gap-3">
                  <label className="text-sm font-semibold text-gray-700 whitespace-nowrap min-w-[120px]">
                    Province/Territory
                  </label>
                  <select
                    value={options.canadianProvince}
                    onChange={(e) => updateOption('canadianProvince', e.target.value as CanadianProvince)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm bg-white"
                  >
                    {Object.entries(CANADIAN_PROVINCES).map(([code, info]) => (
                      <option key={code} value={code}>
                        {info.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Ireland Options */}
              {isIE && (
                <>
                  <div className="flex items-center gap-3">
                    <label className="text-sm font-semibold text-gray-700 whitespace-nowrap min-w-[120px]">
                      Employment Type
                    </label>
                    <select
                      value={options.employmentType}
                      onChange={(e) => updateOption('employmentType', e.target.value as EmploymentType)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm bg-white"
                    >
                      <option value="employee">Employee (PAYE)</option>
                      <option value="self-employed">Self-Employed</option>
                    </select>
                  </div>
                  <div className="flex items-center gap-3">
                    <label className="text-sm font-semibold text-gray-700 whitespace-nowrap min-w-[120px]">
                      Marital Status
                    </label>
                    <select
                      value={options.ieMaritalStatus}
                      onChange={(e) => updateOption('ieMaritalStatus', e.target.value as IEMaritalStatus)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm bg-white"
                    >
                      {Object.entries(IE_MARITAL_STATUS).map(([key, info]) => (
                        <option key={key} value={key}>
                          {info.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <div className="flex items-center gap-3">
                      <label className="text-sm font-semibold text-gray-700 whitespace-nowrap min-w-[120px]">
                        Pension (Annual)
                      </label>
                      <div className="relative flex-1">
                        <span className="absolute left-3 top-2 text-gray-500 text-xs">€</span>
                        <input
                          type="number"
                          value={options.iePensionContribution ?? ''}
                          onChange={(e) => updateOption('iePensionContribution', e.target.value === '' ? undefined : parseInt(e.target.value))}
                          onFocus={(e) => e.target.select()}
                          className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm bg-white"
                          placeholder="0"
                        />
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1 ml-[132px]">
                      Pension reduces taxable income (not USC/PRSI)
                    </p>
                  </div>
                </>
              )}

              {/* UK Options */}
              {isUK && (
                <>
                  <div className="flex items-center gap-3">
                    <label className="text-sm font-semibold text-gray-700 whitespace-nowrap min-w-[120px]">
                      Region
                    </label>
                    <select
                      value={options.ukRegion}
                      onChange={(e) => updateOption('ukRegion', e.target.value as UKRegion)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm bg-white"
                    >
                      {Object.entries(UK_REGIONS).map(([key, info]) => (
                        <option key={key} value={key}>
                          {info.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <div className="flex items-center gap-3">
                      <label className="text-sm font-semibold text-gray-700 whitespace-nowrap min-w-[120px]">
                        Pension (Annual)
                      </label>
                      <div className="relative flex-1">
                        <span className="absolute left-3 top-2 text-gray-500 text-xs">£</span>
                        <input
                          type="number"
                          min="0"
                          max="60000"
                          value={options.ukPensionContribution ?? ''}
                          onChange={(e) => updateOption('ukPensionContribution', e.target.value === '' ? undefined : parseInt(e.target.value))}
                          onFocus={(e) => e.target.select()}
                          className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm"
                          placeholder="0"
                        />
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1 ml-[132px]">Workplace pension (reduces taxable income)</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <label className="text-sm font-semibold text-gray-700 whitespace-nowrap min-w-[120px]">
                      Student Loan Plan
                    </label>
                    <select
                      value={options.ukStudentLoan || 'none'}
                      onChange={(e) => updateOption('ukStudentLoan', e.target.value as UKStudentLoanPlan)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="none">None</option>
                      <option value="plan1">Plan 1 (9% above £24,990)</option>
                      <option value="plan2">Plan 2 (9% above £27,295)</option>
                      <option value="plan4">Plan 4 Scotland (9% above £31,395)</option>
                      <option value="postgraduate">Postgraduate (6% above £21,000)</option>
                    </select>
                  </div>
                  <div className="flex items-center gap-3">
                    <label className="text-sm font-semibold text-gray-700 whitespace-nowrap min-w-[120px]">
                      Marriage Allowance
                    </label>
                    <input
                      type="checkbox"
                      checked={options.ukMarriageAllowance}
                      onChange={(e) => updateOption('ukMarriageAllowance', e.target.checked)}
                      className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                    />
                    <p className="text-xs text-gray-500">Transfer £1,260 personal allowance to spouse</p>
                  </div>
                </>
              )}

              {/* Australia Options */}
              {isAustralia && (
                <>
                  <div className="flex items-center gap-3">
                    <label className="text-sm font-semibold text-gray-700 whitespace-nowrap min-w-[120px]">
                      Medicare Levy Exemption
                    </label>
                    <input
                      type="checkbox"
                      checked={options.auMedicareLevyExemption}
                      onChange={(e) => updateOption('auMedicareLevyExemption', e.target.checked)}
                      className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                    />
                    <p className="text-xs text-gray-500">Low income exemption (under $26,000)</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <label className="text-sm font-semibold text-gray-700 whitespace-nowrap min-w-[120px]">
                      HELP/HECS Debt
                    </label>
                    <input
                      type="checkbox"
                      checked={options.auHELPDebt}
                      onChange={(e) => updateOption('auHELPDebt', e.target.checked)}
                      className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                    />
                    <p className="text-xs text-gray-500">Higher education loan repayment (1-10%)</p>
                  </div>
                </>
              )}

              {/* Spain Options */}
              {isSpain && (
                <div className="flex items-center gap-3">
                  <label className="text-sm font-semibold text-gray-700 whitespace-nowrap min-w-[120px]">
                    Autonomous Community
                  </label>
                  <select
                    value={options.esRegion}
                    onChange={(e) => updateOption('esRegion', e.target.value as ESRegion)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm bg-white"
                  >
                    {Object.entries(ES_REGIONS).map(([key, info]) => (
                      <option key={key} value={key}>
                        {info.name} ({(info.regionalRate * 100).toFixed(1)}% regional rate)
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Italy Options */}
              {isItaly && (
                <div className="flex items-center gap-3">
                  <label className="text-sm font-semibold text-gray-700 whitespace-nowrap min-w-[120px]">
                    Region
                  </label>
                  <select
                    value={options.itRegion}
                    onChange={(e) => updateOption('itRegion', e.target.value as ITRegion)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm bg-white"
                  >
                    {Object.entries(IT_REGIONS).map(([key, info]) => (
                      <option key={key} value={key}>
                        {info.name} ({((info.regionalRate + info.municipalRate) * 100).toFixed(2)}% add.)
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Age (Germany) */}
              {isGermany && (
                <div className="flex items-center gap-3">
                  <label className="text-sm font-semibold text-gray-700 whitespace-nowrap min-w-[120px]">
                    Age
                  </label>
                  <input
                    type="number"
                    min="18"
                    max="100"
                    value={options.age}
                    onChange={(e) => updateOption('age', parseInt(e.target.value) || 30)}
                    onFocus={(e) => e.target.select()}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm bg-white"
                    placeholder="30"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Care insurance rates vary by age (Germany)
                  </p>
                </div>
              )}

              {/* France Options */}
              {isFrance && (
                <>
                  <div>
                    <div className="flex items-center gap-3">
                      <label className="text-sm font-semibold text-gray-700 whitespace-nowrap min-w-[120px]">
                        Marital Status
                      </label>
                      <select
                        value={options.frMaritalStatus}
                        onChange={(e) => updateOption('frMaritalStatus', e.target.value as FRMaritalStatus)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm bg-white"
                      >
                        {Object.entries(FR_MARITAL_STATUS).map(([key, value]) => (
                          <option key={key} value={key}>{value.name}</option>
                        ))}
                      </select>
                    </div>
                    <p className="text-xs text-gray-500 mt-1 ml-[132px]">
                      Family quotient (quotient familial): {FR_MARITAL_STATUS[options.frMaritalStatus || 'single'].description}
                    </p>
                  </div>

                  <div>
                    <div className="flex items-center gap-3">
                      <label className="text-sm font-semibold text-gray-700 whitespace-nowrap min-w-[120px]">
                        Children
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="10"
                        value={options.frChildren}
                        onChange={(e) => updateOption('frChildren', parseInt(e.target.value) || 0)}
                        onFocus={(e) => e.target.select()}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm bg-white"
                        placeholder="0"
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1 ml-[132px]">
                      First 2 children: +0.5 part each, 3rd+ children: +1 part each
                    </p>
                  </div>
                </>
              )}

              {/* Netherlands Options */}
              {isNetherlands && (
                <>
                  <div className="flex items-center gap-3">
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                      <input
                        type="checkbox"
                        checked={options.nlGeneralTaxCredit}
                        onChange={(e) => updateOption('nlGeneralTaxCredit', e.target.checked)}
                        className="w-4 h-4 text-blue-600 bg-white border-gray-300 rounded focus:ring-blue-500"
                      />
                      General Tax Credit
                    </label>
                    <p className="text-xs text-gray-500">
                      Algemene heffingskorting (max €3,362)
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                      <input
                        type="checkbox"
                        checked={options.nlLaborTaxCredit}
                        onChange={(e) => updateOption('nlLaborTaxCredit', e.target.checked)}
                        className="w-4 h-4 text-blue-600 bg-white border-gray-300 rounded focus:ring-blue-500"
                      />
                      Labor Tax Credit
                    </label>
                    <p className="text-xs text-gray-500">
                      Arbeidskorting (max €5,533)
                    </p>
                  </div>
                </>
              )}

              {/* Portugal Options */}
              {isPortugal && (
                <>
                  <div>
                    <div className="flex items-center gap-3">
                      <label className="text-sm font-semibold text-gray-700 whitespace-nowrap min-w-[120px]">
                        Employment Type
                      </label>
                      <select
                        value={options.ptEmploymentType}
                        onChange={(e) => updateOption('ptEmploymentType', e.target.value as EmploymentType)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm bg-white"
                      >
                        <option value="employee">Employee (Trabalhador)</option>
                        <option value="self-employed">Self-Employed (Trabalhador Independente)</option>
                      </select>
                    </div>
                    <p className="text-xs text-gray-500 mt-1 ml-[132px]">
                      {options.ptEmploymentType === 'self-employed'
                        ? 'Self-employed: 21.4% social security vs 11% for employees'
                        : 'Employee: 11% social security (Segurança Social)'}
                    </p>
                  </div>
                </>
              )}

              {/* Switzerland Options */}
              {isSwitzerland && (
                <>
                  <div className="flex items-center gap-3">
                    <label className="text-sm font-semibold text-gray-700 whitespace-nowrap min-w-[120px]">
                      Canton
                    </label>
                    <select
                      value={options.chCanton}
                      onChange={(e) => updateOption('chCanton', e.target.value as SwissCanton)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm bg-white"
                    >
                      <option value="zurich">Zürich (~10% cantonal tax)</option>
                      <option value="geneva">Geneva (~12% cantonal tax)</option>
                      <option value="zug">Zug (~6% cantonal tax - lowest)</option>
                      <option value="bern">Bern (~11% cantonal tax)</option>
                      <option value="basel">Basel (~13% cantonal tax)</option>
                      <option value="vaud">Vaud (~11% cantonal tax)</option>
                      <option value="aargau">Aargau (~9% cantonal tax)</option>
                      <option value="lucerne">Lucerne (~8% cantonal tax)</option>
                      <option value="ticino">Ticino (~10% cantonal tax)</option>
                      <option value="st_gallen">St. Gallen (~9% cantonal tax)</option>
                    </select>
                  </div>
                  <p className="text-xs text-gray-500 mt-1 ml-[132px]">
                    Switzerland has federal (0.77-11.5%), cantonal, and municipal taxes. Total rates vary significantly by canton.
                  </p>
                </>
              )}

              {/* Japan Options */}
              {isJapan && (
                <>
                  <div>
                    <div className="flex items-center gap-3">
                      <label className="text-sm font-semibold text-gray-700 whitespace-nowrap min-w-[120px]">
                        Dependents
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="20"
                        value={options.jpDependents ?? 0}
                        onChange={(e) => updateOption('jpDependents', e.target.value === '' ? 0 : parseInt(e.target.value))}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm bg-white"
                        placeholder="0"
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1 ml-[132px]">
                      Spouse: ¥380,000 deduction. Each dependent: ¥380,000 deduction
                    </p>
                  </div>
                </>
              )}
    </div>
  );
}
