// Extended types for advanced calculator options

export type USState =
  | 'AL' | 'AK' | 'AZ' | 'AR' | 'CA' | 'CO' | 'CT' | 'DE' | 'DC' | 'FL' | 'GA'
  | 'HI' | 'ID' | 'IL' | 'IN' | 'IA' | 'KS' | 'KY' | 'LA' | 'ME' | 'MD'
  | 'MA' | 'MI' | 'MN' | 'MS' | 'MO' | 'MT' | 'NE' | 'NV' | 'NH' | 'NJ'
  | 'NM' | 'NY' | 'NC' | 'ND' | 'OH' | 'OK' | 'OR' | 'PA' | 'RI' | 'SC'
  | 'SD' | 'TN' | 'TX' | 'UT' | 'VT' | 'VA' | 'WA' | 'WV' | 'WI' | 'WY';

export type CanadianProvince =
  | 'AB' | 'BC' | 'MB' | 'NB' | 'NL' | 'NS' | 'NT' | 'NU' | 'ON' | 'PE' | 'QC' | 'SK' | 'YT';

export type FilingStatus = 'single' | 'married_joint' | 'married_separate' | 'head_of_household';

export interface TaxRateOverrides {
  federalTaxRate?: number;
  stateTaxRate?: number;
  socialSecurityRate?: number;
  medicareRate?: number;
  [key: string]: number | undefined;
}

export interface AdvancedCalculatorInputs {
  // Location specific
  usState?: USState;
  canadianProvince?: CanadianProvince;

  // Personal circumstances
  filingStatus?: FilingStatus;
  age?: number;
  dependents?: number;

  // Additional deductions (annual amounts)
  retirement401k?: number;
  traditionalIRA?: number;
  hsa?: number;
  studentLoanInterest?: number;
  mortgageInterest?: number;
  charitableDonations?: number;

  // Pay frequency
  payFrequency?: 'weekly' | 'biweekly' | 'semimonthly' | 'monthly';

  // Tax rate overrides
  taxRateOverrides?: TaxRateOverrides;

  // Show advanced options
  showAdvancedOptions?: boolean;
}

export interface StateInfo {
  code: USState;
  name: string;
  taxRate: number; // Flat rate or average effective rate
  hasTax: boolean;
}

export interface ProvinceInfo {
  code: CanadianProvince;
  name: string;
  taxBrackets: Array<{ min: number; max: number; rate: number }>;
}

// US State tax information (2025)
export const US_STATES: Record<USState, StateInfo> = {
  AL: { code: 'AL', name: 'Alabama', taxRate: 0.05, hasTax: true },
  AK: { code: 'AK', name: 'Alaska', taxRate: 0, hasTax: false },
  AZ: { code: 'AZ', name: 'Arizona', taxRate: 0.025, hasTax: true },
  AR: { code: 'AR', name: 'Arkansas', taxRate: 0.055, hasTax: true },
  CA: { code: 'CA', name: 'California', taxRate: 0.093, hasTax: true },
  CO: { code: 'CO', name: 'Colorado', taxRate: 0.044, hasTax: true },
  CT: { code: 'CT', name: 'Connecticut', taxRate: 0.05, hasTax: true },
  DE: { code: 'DE', name: 'Delaware', taxRate: 0.066, hasTax: true },
  DC: { code: 'DC', name: 'District of Columbia', taxRate: 0.1075, hasTax: true },
  FL: { code: 'FL', name: 'Florida', taxRate: 0, hasTax: false },
  GA: { code: 'GA', name: 'Georgia', taxRate: 0.0575, hasTax: true },
  HI: { code: 'HI', name: 'Hawaii', taxRate: 0.11, hasTax: true },
  ID: { code: 'ID', name: 'Idaho', taxRate: 0.058, hasTax: true },
  IL: { code: 'IL', name: 'Illinois', taxRate: 0.0495, hasTax: true },
  IN: { code: 'IN', name: 'Indiana', taxRate: 0.0305, hasTax: true },
  IA: { code: 'IA', name: 'Iowa', taxRate: 0.06, hasTax: true },
  KS: { code: 'KS', name: 'Kansas', taxRate: 0.057, hasTax: true },
  KY: { code: 'KY', name: 'Kentucky', taxRate: 0.045, hasTax: true },
  LA: { code: 'LA', name: 'Louisiana', taxRate: 0.0425, hasTax: true },
  ME: { code: 'ME', name: 'Maine', taxRate: 0.075, hasTax: true },
  MD: { code: 'MD', name: 'Maryland', taxRate: 0.0575, hasTax: true },
  MA: { code: 'MA', name: 'Massachusetts', taxRate: 0.05, hasTax: true },
  MI: { code: 'MI', name: 'Michigan', taxRate: 0.0425, hasTax: true },
  MN: { code: 'MN', name: 'Minnesota', taxRate: 0.0985, hasTax: true },
  MS: { code: 'MS', name: 'Mississippi', taxRate: 0.05, hasTax: true },
  MO: { code: 'MO', name: 'Missouri', taxRate: 0.054, hasTax: true },
  MT: { code: 'MT', name: 'Montana', taxRate: 0.069, hasTax: true },
  NE: { code: 'NE', name: 'Nebraska', taxRate: 0.0684, hasTax: true },
  NV: { code: 'NV', name: 'Nevada', taxRate: 0, hasTax: false },
  NH: { code: 'NH', name: 'New Hampshire', taxRate: 0, hasTax: false },
  NJ: { code: 'NJ', name: 'New Jersey', taxRate: 0.1075, hasTax: true },
  NM: { code: 'NM', name: 'New Mexico', taxRate: 0.049, hasTax: true },
  NY: { code: 'NY', name: 'New York', taxRate: 0.0882, hasTax: true },
  NC: { code: 'NC', name: 'North Carolina', taxRate: 0.0475, hasTax: true },
  ND: { code: 'ND', name: 'North Dakota', taxRate: 0.029, hasTax: true },
  OH: { code: 'OH', name: 'Ohio', taxRate: 0.0399, hasTax: true },
  OK: { code: 'OK', name: 'Oklahoma', taxRate: 0.05, hasTax: true },
  OR: { code: 'OR', name: 'Oregon', taxRate: 0.099, hasTax: true },
  PA: { code: 'PA', name: 'Pennsylvania', taxRate: 0.0307, hasTax: true },
  RI: { code: 'RI', name: 'Rhode Island', taxRate: 0.0599, hasTax: true },
  SC: { code: 'SC', name: 'South Carolina', taxRate: 0.07, hasTax: true },
  SD: { code: 'SD', name: 'South Dakota', taxRate: 0, hasTax: false },
  TN: { code: 'TN', name: 'Tennessee', taxRate: 0, hasTax: false },
  TX: { code: 'TX', name: 'Texas', taxRate: 0, hasTax: false },
  UT: { code: 'UT', name: 'Utah', taxRate: 0.0465, hasTax: true },
  VT: { code: 'VT', name: 'Vermont', taxRate: 0.0875, hasTax: true },
  VA: { code: 'VA', name: 'Virginia', taxRate: 0.0575, hasTax: true },
  WA: { code: 'WA', name: 'Washington', taxRate: 0, hasTax: false },
  WV: { code: 'WV', name: 'West Virginia', taxRate: 0.065, hasTax: true },
  WI: { code: 'WI', name: 'Wisconsin', taxRate: 0.0765, hasTax: true },
  WY: { code: 'WY', name: 'Wyoming', taxRate: 0, hasTax: false }
};

// Canadian provinces (simplified - using average effective rates)
export const CANADIAN_PROVINCES: Record<CanadianProvince, ProvinceInfo> = {
  AB: { code: 'AB', name: 'Alberta', taxBrackets: [{ min: 0, max: 142292, rate: 0.10 }, { min: 142292, max: 170751, rate: 0.12 }, { min: 170751, max: 227668, rate: 0.13 }, { min: 227668, max: 341502, rate: 0.14 }, { min: 341502, max: Infinity, rate: 0.15 }] },
  BC: { code: 'BC', name: 'British Columbia', taxBrackets: [{ min: 0, max: 47937, rate: 0.0506 }, { min: 47937, max: 95875, rate: 0.077 }, { min: 95875, max: 110076, rate: 0.105 }, { min: 110076, max: 133664, rate: 0.1229 }, { min: 133664, max: 181232, rate: 0.147 }, { min: 181232, max: Infinity, rate: 0.168 }] },
  MB: { code: 'MB', name: 'Manitoba', taxBrackets: [{ min: 0, max: 47000, rate: 0.108 }, { min: 47000, max: 100000, rate: 0.1275 }, { min: 100000, max: Infinity, rate: 0.174 }] },
  NB: { code: 'NB', name: 'New Brunswick', taxBrackets: [{ min: 0, max: 49958, rate: 0.094 }, { min: 49958, max: 99916, rate: 0.14 }, { min: 99916, max: 185064, rate: 0.16 }, { min: 185064, max: Infinity, rate: 0.195 }] },
  NL: { code: 'NL', name: 'Newfoundland and Labrador', taxBrackets: [{ min: 0, max: 43198, rate: 0.087 }, { min: 43198, max: 86395, rate: 0.145 }, { min: 86395, max: 154244, rate: 0.158 }, { min: 154244, max: 215943, rate: 0.178 }, { min: 215943, max: Infinity, rate: 0.208 }] },
  NS: { code: 'NS', name: 'Nova Scotia', taxBrackets: [{ min: 0, max: 29590, rate: 0.0879 }, { min: 29590, max: 59180, rate: 0.1495 }, { min: 59180, max: 93000, rate: 0.1667 }, { min: 93000, max: 150000, rate: 0.175 }, { min: 150000, max: Infinity, rate: 0.21 }] },
  NT: { code: 'NT', name: 'Northwest Territories', taxBrackets: [{ min: 0, max: 50597, rate: 0.059 }, { min: 50597, max: 101198, rate: 0.086 }, { min: 101198, max: 164525, rate: 0.122 }, { min: 164525, max: Infinity, rate: 0.1405 }] },
  NU: { code: 'NU', name: 'Nunavut', taxBrackets: [{ min: 0, max: 53268, rate: 0.04 }, { min: 53268, max: 106537, rate: 0.07 }, { min: 106537, max: 173205, rate: 0.09 }, { min: 173205, max: Infinity, rate: 0.115 }] },
  ON: { code: 'ON', name: 'Ontario', taxBrackets: [{ min: 0, max: 51446, rate: 0.0505 }, { min: 51446, max: 102894, rate: 0.0915 }, { min: 102894, max: 150000, rate: 0.1116 }, { min: 150000, max: 220000, rate: 0.1216 }, { min: 220000, max: Infinity, rate: 0.1316 }] },
  PE: { code: 'PE', name: 'Prince Edward Island', taxBrackets: [{ min: 0, max: 32656, rate: 0.098 }, { min: 32656, max: 64313, rate: 0.138 }, { min: 64313, max: Infinity, rate: 0.167 }] },
  QC: { code: 'QC', name: 'Quebec', taxBrackets: [{ min: 0, max: 51780, rate: 0.14 }, { min: 51780, max: 103545, rate: 0.19 }, { min: 103545, max: 126000, rate: 0.24 }, { min: 126000, max: Infinity, rate: 0.2575 }] },
  SK: { code: 'SK', name: 'Saskatchewan', taxBrackets: [{ min: 0, max: 52057, rate: 0.105 }, { min: 52057, max: 148734, rate: 0.125 }, { min: 148734, max: Infinity, rate: 0.145 }] },
  YT: { code: 'YT', name: 'Yukon', taxBrackets: [{ min: 0, max: 55867, rate: 0.064 }, { min: 55867, max: 111733, rate: 0.09 }, { min: 111733, max: 173205, rate: 0.109 }, { min: 173205, max: 500000, rate: 0.128 }, { min: 500000, max: Infinity, rate: 0.15 }] }
};

export const FILING_STATUS_INFO: Record<FilingStatus, { name: string; description: string }> = {
  single: {
    name: 'Single',
    description: 'Unmarried, divorced, or legally separated'
  },
  married_joint: {
    name: 'Married Filing Jointly',
    description: 'Married couple filing one tax return together'
  },
  married_separate: {
    name: 'Married Filing Separately',
    description: 'Married couple filing separate tax returns'
  },
  head_of_household: {
    name: 'Head of Household',
    description: 'Unmarried and paying more than half the costs of keeping up a home for a qualifying person'
  }
};

// Ireland marital status
export type IEMaritalStatus = 'single' | 'married' | 'married_one_earner';

export const IE_MARITAL_STATUS: Record<IEMaritalStatus, { name: string; taxCredit: number; description: string }> = {
  single: { name: 'Single', taxCredit: 1775, description: 'Single person tax credit' },
  married: { name: 'Married (Dual Income)', taxCredit: 3550, description: 'Married couple, both earning' },
  married_one_earner: { name: 'Married (Single Income)', taxCredit: 3550, description: 'Married couple, one earner' }
};

// UK regions
export type UKRegion = 'england' | 'scotland' | 'wales' | 'northern_ireland';

export const UK_REGIONS: Record<UKRegion, { name: string; description: string }> = {
  england: { name: 'England', description: 'Standard UK tax rates' },
  scotland: { name: 'Scotland', description: 'Scottish tax rates (slightly different)' },
  wales: { name: 'Wales', description: 'Standard UK tax rates' },
  northern_ireland: { name: 'Northern Ireland', description: 'Standard UK tax rates' }
};

// Spain autonomous communities (simplified - major ones)
export type ESRegion = 'madrid' | 'catalonia' | 'andalusia' | 'valencia' | 'basque' | 'galicia' | 'castilla_leon' | 'other';

export const ES_REGIONS: Record<ESRegion, { name: string; regionalRate: number }> = {
  madrid: { name: 'Madrid', regionalRate: 0.09 },
  catalonia: { name: 'Catalonia (Catalunya)', regionalRate: 0.12 },
  andalusia: { name: 'Andalusia (Andalucía)', regionalRate: 0.115 },
  valencia: { name: 'Valencia', regionalRate: 0.11 },
  basque: { name: 'Basque Country (País Vasco)', regionalRate: 0.095 },
  galicia: { name: 'Galicia', regionalRate: 0.10 },
  castilla_leon: { name: 'Castilla y León', regionalRate: 0.095 },
  other: { name: 'Other Region', regionalRate: 0.10 }
};

// Italy regions (simplified - using average regional/municipal rates)
export type ITRegion = 'lombardy' | 'lazio' | 'campania' | 'sicily' | 'veneto' | 'emilia' | 'piedmont' | 'other';

export const IT_REGIONS: Record<ITRegion, { name: string; regionalRate: number; municipalRate: number }> = {
  lombardy: { name: 'Lombardy (Lombardia)', regionalRate: 0.0173, municipalRate: 0.008 },
  lazio: { name: 'Lazio', regionalRate: 0.0333, municipalRate: 0.009 },
  campania: { name: 'Campania', regionalRate: 0.0273, municipalRate: 0.008 },
  sicily: { name: 'Sicily (Sicilia)', regionalRate: 0.0173, municipalRate: 0.008 },
  veneto: { name: 'Veneto', regionalRate: 0.0173, municipalRate: 0.007 },
  emilia: { name: 'Emilia-Romagna', regionalRate: 0.0173, municipalRate: 0.008 },
  piedmont: { name: 'Piedmont (Piemonte)', regionalRate: 0.0323, municipalRate: 0.008 },
  other: { name: 'Other Region', regionalRate: 0.0173, municipalRate: 0.008 }
};

// France marital status for family quotient (quotient familial)
export type FRMaritalStatus = 'single' | 'married' | 'single_parent';

export const FR_MARITAL_STATUS: Record<FRMaritalStatus, { name: string; parts: number; description: string }> = {
  single: { name: 'Single', parts: 1, description: '1 part fiscale' },
  married: { name: 'Married/PACS', parts: 2, description: '2 parts fiscales' },
  single_parent: { name: 'Single Parent', parts: 1.5, description: '1.5 parts fiscales (0.5 extra)' }
};
