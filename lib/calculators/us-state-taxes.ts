// U.S. State Income Tax Rates — 2026 (Approximate)
// Based on latest state tax rate changes as of early 2026

export type StateTaxType = 'flat' | 'progressive' | 'none' | 'none_on_wages';

export interface TaxBracket {
  min?: number;
  max?: number;
  rate: number;
}

export interface StateTaxConfig {
  type: StateTaxType;
  rate?: number; // For flat tax states
  topRate?: number; // For progressive states (simplified)
  brackets?: TaxBracket[]; // Full bracket details
  note?: string;
}

export const US_STATE_TAXES: Record<string, StateTaxConfig> = {
  AL: {
    type: 'progressive',
    brackets: [
      { min: 0, max: 500, rate: 0.02 },
      { min: 500, max: 3000, rate: 0.04 },
      { min: 3000, max: Infinity, rate: 0.05 }
    ]
  },
  AK: { type: 'none', brackets: [] },
  AZ: { type: 'flat', rate: 0.025 },
  AR: {
    type: 'progressive',
    brackets: [
      { min: 0, max: 5000, rate: 0.02 },
      { min: 5000, max: 10000, rate: 0.04 },
      { min: 10000, max: 14300, rate: 0.045 },
      { min: 14300, max: 23600, rate: 0.06 },
      { min: 23600, max: Infinity, rate: 0.065 }
    ]
  },
  CA: {
    type: 'progressive',
    topRate: 0.133,
    brackets: [
      { min: 0, max: 10412, rate: 0.01 },
      { min: 10412, max: 24684, rate: 0.02 },
      { min: 24684, max: 38959, rate: 0.04 },
      { min: 38959, max: 54081, rate: 0.06 },
      { min: 54081, max: 68350, rate: 0.08 },
      { min: 68350, max: 349137, rate: 0.093 },
      { min: 349137, max: 418961, rate: 0.103 },
      { min: 418961, max: 698271, rate: 0.113 },
      { min: 698271, max: Infinity, rate: 0.133 }
    ]
  },
  CO: { type: 'flat', rate: 0.044 },
  CT: {
    type: 'progressive',
    topRate: 0.0699,
    brackets: [
      { min: 0, max: 10000, rate: 0.03 },
      { min: 10000, max: 50000, rate: 0.05 },
      { min: 50000, max: 100000, rate: 0.055 },
      { min: 100000, max: 200000, rate: 0.06 },
      { min: 200000, max: 250000, rate: 0.065 },
      { min: 250000, max: 500000, rate: 0.069 },
      { min: 500000, max: Infinity, rate: 0.0699 }
    ]
  },
  DE: {
    type: 'progressive',
    brackets: [
      { min: 0, max: 2000, rate: 0 },
      { min: 2000, max: 5000, rate: 0.022 },
      { min: 5000, max: 10000, rate: 0.039 },
      { min: 10000, max: 20000, rate: 0.048 },
      { min: 20000, max: 25000, rate: 0.052 },
      { min: 25000, max: 60000, rate: 0.0555 },
      { min: 60000, max: Infinity, rate: 0.066 }
    ]
  },
  DC: {
    type: 'progressive',
    brackets: [
      { min: 0, max: 10000, rate: 0.04 },
      { min: 10000, max: 40000, rate: 0.06 },
      { min: 40000, max: 60000, rate: 0.065 },
      { min: 60000, max: 250000, rate: 0.085 },
      { min: 250000, max: 500000, rate: 0.0925 },
      { min: 500000, max: 1000000, rate: 0.095 },
      { min: 1000000, max: Infinity, rate: 0.1095 }
    ]
  },
  FL: { type: 'none', brackets: [] },
  GA: { type: 'flat', rate: 0.0549 },
  HI: {
    type: 'progressive',
    topRate: 0.11,
    brackets: [
      { min: 0, max: 2400, rate: 0.014 },
      { min: 2400, max: 4800, rate: 0.032 },
      { min: 4800, max: 9600, rate: 0.055 },
      { min: 9600, max: 14400, rate: 0.064 },
      { min: 14400, max: 19200, rate: 0.068 },
      { min: 19200, max: 24000, rate: 0.072 },
      { min: 24000, max: 36000, rate: 0.076 },
      { min: 36000, max: 48000, rate: 0.079 },
      { min: 48000, max: 150000, rate: 0.0825 },
      { min: 150000, max: 175000, rate: 0.09 },
      { min: 175000, max: 200000, rate: 0.10 },
      { min: 200000, max: Infinity, rate: 0.11 }
    ]
  },
  ID: {
    type: 'progressive',
    brackets: [
      { min: 0, max: 1700, rate: 0.0125 },
      { min: 1700, max: 5100, rate: 0.0300 },
      { min: 5100, max: 8500, rate: 0.0450 },
      { min: 8500, max: 11700, rate: 0.0525 },
      { min: 11700, max: Infinity, rate: 0.058 }
    ]
  },
  IL: { type: 'flat', rate: 0.0495 },
  IN: { type: 'flat', rate: 0.0315 },
  IA: { type: 'flat', rate: 0.039 },
  KS: {
    type: 'progressive',
    topRate: 0.057,
    brackets: [
      { min: 0, max: 15000, rate: 0.031 },
      { min: 15000, max: 30000, rate: 0.0525 },
      { min: 30000, max: Infinity, rate: 0.057 }
    ]
  },
  KY: { type: 'flat', rate: 0.04 },
  LA: {
    type: 'progressive',
    brackets: [
      { min: 0, max: 12500, rate: 0.0185 },
      { min: 12500, max: 50000, rate: 0.035 },
      { min: 50000, max: Infinity, rate: 0.0425 }
    ]
  },
  ME: {
    type: 'progressive',
    brackets: [
      { min: 0, max: 24500, rate: 0.058 },
      { min: 24500, max: 58050, rate: 0.0675 },
      { min: 58050, max: Infinity, rate: 0.0715 }
    ]
  },
  MD: {
    type: 'progressive',
    topRate: 0.0575,
    brackets: [
      { min: 0, max: 1000, rate: 0.02 },
      { min: 1000, max: 2000, rate: 0.03 },
      { min: 2000, max: 3000, rate: 0.04 },
      { min: 3000, max: 100000, rate: 0.0475 },
      { min: 100000, max: 125000, rate: 0.05 },
      { min: 125000, max: 150000, rate: 0.0525 },
      { min: 150000, max: 250000, rate: 0.055 },
      { min: 250000, max: Infinity, rate: 0.0575 }
    ]
  },
  MA: { type: 'flat', rate: 0.05 },
  MI: { type: 'flat', rate: 0.0425 },
  MN: {
    type: 'progressive',
    topRate: 0.0985,
    brackets: [
      { min: 0, max: 31690, rate: 0.0535 },
      { min: 31690, max: 104090, rate: 0.068 },
      { min: 104090, max: 183340, rate: 0.0785 },
      { min: 183340, max: Infinity, rate: 0.0985 }
    ]
  },
  MS: { type: 'flat', rate: 0.04 },
  MO: {
    type: 'progressive',
    topRate: 0.048,
    brackets: [
      { min: 0, max: 1207, rate: 0 },
      { min: 1207, max: 2414, rate: 0.02 },
      { min: 2414, max: 3621, rate: 0.025 },
      { min: 3621, max: 4828, rate: 0.03 },
      { min: 4828, max: 6035, rate: 0.035 },
      { min: 6035, max: 7242, rate: 0.04 },
      { min: 7242, max: 8449, rate: 0.045 },
      { min: 8449, max: Infinity, rate: 0.048 }
    ]
  },
  MT: {
    type: 'progressive',
    topRate: 0.0675,
    brackets: [
      { min: 0, max: 4000, rate: 0.0475 },
      { min: 4000, max: 11600, rate: 0.058 },
      { min: 11600, max: Infinity, rate: 0.0675 }
    ]
  },
  NE: {
    type: 'progressive',
    topRate: 0.0564,
    brackets: [
      { min: 0, max: 3700, rate: 0.0246 },
      { min: 3700, max: 22170, rate: 0.0351 },
      { min: 22170, max: 35730, rate: 0.0501 },
      { min: 35730, max: Infinity, rate: 0.0564 }
    ]
  },
  NV: { type: 'none', brackets: [] },
  NH: { type: 'none_on_wages', note: 'No tax on wages; 4% on dividends/interest', brackets: [] },
  NJ: {
    type: 'progressive',
    topRate: 0.1075,
    brackets: [
      { min: 0, max: 20000, rate: 0.014 },
      { min: 20000, max: 35000, rate: 0.0175 },
      { min: 35000, max: 40000, rate: 0.035 },
      { min: 40000, max: 75000, rate: 0.05525 },
      { min: 75000, max: 500000, rate: 0.0637 },
      { min: 500000, max: 1000000, rate: 0.0897 },
      { min: 1000000, max: Infinity, rate: 0.1075 }
    ]
  },
  NM: {
    type: 'progressive',
    topRate: 0.059,
    brackets: [
      { min: 0, max: 5500, rate: 0.017 },
      { min: 5500, max: 11000, rate: 0.032 },
      { min: 11000, max: 16000, rate: 0.047 },
      { min: 16000, max: Infinity, rate: 0.059 }
    ]
  },
  NY: {
    type: 'progressive',
    topRate: 0.109,
    brackets: [
      { min: 0, max: 8500, rate: 0.04 },
      { min: 8500, max: 11700, rate: 0.045 },
      { min: 11700, max: 13900, rate: 0.0525 },
      { min: 13900, max: 80650, rate: 0.055 },
      { min: 80650, max: 215400, rate: 0.06 },
      { min: 215400, max: 1077550, rate: 0.0685 },
      { min: 1077550, max: 5000000, rate: 0.0965 },
      { min: 5000000, max: 25000000, rate: 0.103 },
      { min: 25000000, max: Infinity, rate: 0.109 }
    ]
  },
  NC: { type: 'flat', rate: 0.0449 },
  ND: {
    type: 'progressive',
    topRate: 0.0275,
    brackets: [
      { min: 0, max: 44725, rate: 0 },
      { min: 44725, max: 110650, rate: 0.0195 },
      { min: 110650, max: 225975, rate: 0.0225 },
      { min: 225975, max: 458350, rate: 0.0251 },
      { min: 458350, max: Infinity, rate: 0.0275 }
    ]
  },
  OH: { type: 'flat', rate: 0.0275 },
  OK: { type: 'flat', rate: 0.045 },
  OR: {
    type: 'progressive',
    topRate: 0.099,
    brackets: [
      { min: 0, max: 4050, rate: 0.0475 },
      { min: 4050, max: 10200, rate: 0.0675 },
      { min: 10200, max: 125000, rate: 0.0875 },
      { min: 125000, max: Infinity, rate: 0.099 }
    ]
  },
  PA: { type: 'flat', rate: 0.0307 },
  RI: {
    type: 'progressive',
    topRate: 0.0599,
    brackets: [
      { min: 0, max: 73450, rate: 0.0375 },
      { min: 73450, max: 166950, rate: 0.0475 },
      { min: 166950, max: Infinity, rate: 0.0599 }
    ]
  },
  SC: { type: 'flat', rate: 0.06 },
  SD: { type: 'none', brackets: [] },
  TN: { type: 'none', brackets: [] },
  TX: { type: 'none', brackets: [] },
  UT: { type: 'flat', rate: 0.0465 },
  VT: {
    type: 'progressive',
    topRate: 0.0875,
    brackets: [
      { min: 0, max: 45400, rate: 0.0335 },
      { min: 45400, max: 110050, rate: 0.066 },
      { min: 110050, max: 229550, rate: 0.076 },
      { min: 229550, max: Infinity, rate: 0.0875 }
    ]
  },
  VA: {
    type: 'progressive',
    brackets: [
      { min: 0, max: 3000, rate: 0.02 },
      { min: 3000, max: 5000, rate: 0.03 },
      { min: 5000, max: 17000, rate: 0.05 },
      { min: 17000, max: Infinity, rate: 0.0575 }
    ]
  },
  WA: { type: 'none', brackets: [] },
  WV: {
    type: 'progressive',
    brackets: [
      { min: 0, max: 10000, rate: 0.0236 },
      { min: 10000, max: 25000, rate: 0.0315 },
      { min: 25000, max: 40000, rate: 0.0354 },
      { min: 40000, max: 60000, rate: 0.0472 },
      { min: 60000, max: Infinity, rate: 0.0512 }
    ]
  },
  WI: {
    type: 'progressive',
    brackets: [
      { min: 0, max: 13810, rate: 0.0354 },
      { min: 13810, max: 27630, rate: 0.0465 },
      { min: 27630, max: 304170, rate: 0.0627 },
      { min: 304170, max: Infinity, rate: 0.0765 }
    ]
  },
  WY: { type: 'none', brackets: [] }
};

/**
 * Calculate state income tax based on taxable income
 */
export function calculateStateTax(
  stateCode: string,
  taxableIncome: number
): number {
  const stateConfig = US_STATE_TAXES[stateCode];

  if (!stateConfig) {
    console.warn(`Unknown state code: ${stateCode}, returning 0 state tax`);
    return 0;
  }

  // No state income tax
  if (stateConfig.type === 'none' || stateConfig.type === 'none_on_wages') {
    return 0;
  }

  // Flat tax rate
  if (stateConfig.type === 'flat' && stateConfig.rate) {
    return taxableIncome * stateConfig.rate;
  }

  // Progressive tax with brackets
  if (stateConfig.type === 'progressive' && stateConfig.brackets) {
    let tax = 0;
    let previousMax = 0;

    for (const bracket of stateConfig.brackets) {
      if (taxableIncome <= previousMax) break;

      const bracketMin = bracket.min || previousMax;
      const bracketMax = bracket.max || Infinity;
      const taxableInBracket = Math.min(taxableIncome, bracketMax) - bracketMin;

      if (taxableInBracket > 0) {
        tax += taxableInBracket * bracket.rate;
      }

      previousMax = bracketMax;
    }

    return tax;
  }

  return 0;
}

/**
 * Get state tax information for display
 */
export function getStateTaxInfo(stateCode: string): {
  hasIncomeTax: boolean;
  type: StateTaxType;
  description: string;
} {
  const stateConfig = US_STATE_TAXES[stateCode];

  if (!stateConfig) {
    return {
      hasIncomeTax: false,
      type: 'none',
      description: 'Unknown state'
    };
  }

  if (stateConfig.type === 'none') {
    return {
      hasIncomeTax: false,
      type: 'none',
      description: 'No state income tax'
    };
  }

  if (stateConfig.type === 'none_on_wages') {
    return {
      hasIncomeTax: false,
      type: 'none_on_wages',
      description: stateConfig.note || 'No tax on wages'
    };
  }

  if (stateConfig.type === 'flat') {
    return {
      hasIncomeTax: true,
      type: 'flat',
      description: `Flat tax rate: ${((stateConfig.rate || 0) * 100).toFixed(2)}%`
    };
  }

  return {
    hasIncomeTax: true,
    type: 'progressive',
    description: `Progressive tax up to ${((stateConfig.topRate || 0) * 100).toFixed(2)}%`
  };
}
