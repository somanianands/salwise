# Global Salary Calculator

A fast, accurate, and SEO-optimized salary calculator built with Next.js 14, supporting 9 major countries with 2025/2026 tax rates.

## Features

- **9 Countries Supported**: US, UK, Canada, Australia, Germany, France, India, Singapore, UAE
- **Multiple Calculators**:
  - Gross-to-Net (calculate take-home pay)
  - Net-to-Gross (reverse calculation)
  - Hourly rate converter
- **Accurate Tax Calculations**: Based on 2025/2026 tax rates, including:
  - Income tax with progressive brackets
  - Social security contributions
  - Medicare/health insurance
  - All mandatory deductions
- **Visual Breakdown**: Interactive pie charts and detailed breakdowns
- **All Frequencies**: Annual, monthly, weekly, daily, and hourly conversions
- **Smooth Animations**: Polished UI with loading states, transitions, and micro-interactions
- **SEO Optimized**: Static generation, metadata, sitemap, robots.txt
- **Fast Performance**: Optimized for Core Web Vitals

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Charts**: Recharts
- **Icons**: Lucide React
- **Build**: Static export for maximum performance

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

### Build

```bash
npm run build
```

This generates a static export in the `out` directory.

### Preview Production Build

```bash
npm run build
npx serve@latest out
```

## Project Structure

```
├── app/
│   ├── calculators/[country]/   # Dynamic country pages
│   ├── layout.tsx               # Root layout with metadata
│   ├── page.tsx                 # Home page
│   ├── sitemap.ts               # Dynamic sitemap
│   └── robots.ts                # Robots.txt
├── components/
│   └── calculators/
│       ├── SalaryCalculator.tsx # Main calculator component
│       └── TaxBreakdownChart.tsx # Chart component
├── lib/
│   ├── types.ts                 # Type definitions
│   └── calculators/
│       ├── us.ts                # US tax calculator
│       ├── uk.ts                # UK tax calculator
│       ├── canada.ts            # Canada tax calculator
│       ├── australia.ts         # Australia tax calculator
│       ├── germany.ts           # Germany tax calculator
│       ├── france.ts            # France tax calculator
│       ├── india.ts             # India tax calculator
│       ├── singapore.ts         # Singapore tax calculator
│       ├── uae.ts               # UAE tax calculator
│       └── index.ts             # Main calculator exports
└── public/                      # Static assets
```

## Tax Calculation Details

### United States (2025)
- Federal tax brackets (10% - 37%)
- Social Security (6.2% up to $168,600)
- Medicare (1.45% + 0.9% above $200,000)
- State tax (simplified at 5%)

### United Kingdom (2025/2026)
- Personal allowance: £12,570
- Basic rate (20%), Higher rate (40%), Additional rate (45%)
- National Insurance (8% / 2%)

### Canada (2025)
- Federal tax (15% - 33%)
- Provincial tax (Ontario: 5.05% - 13.16%)
- CPP (5.95%)
- EI (1.58%)

### Australia (2025/2026)
- Tax-free threshold: $18,200
- Progressive rates (19% - 45%)
- Medicare levy (2%)

### Germany (2025)
- Progressive formula
- Social security (pension, health, unemployment, care)
- Solidarity surcharge

### France (2025)
- Progressive rates (11% - 45%)
- CSG (9.2%), CRDS (0.5%)
- Social charges

### India (2025-2026)
- New tax regime
- Standard deduction: ₹50,000
- EPF (12%)
- Professional tax

### Singapore (2025)
- Progressive rates (0% - 24%)
- CPF (20% for employees under 55)

### UAE (2025)
- No personal income tax
- Optional pension for UAE nationals

## Customization

### Update Domain

Replace the domain in:
- `app/sitemap.ts`: Update `baseUrl`
- `app/robots.ts`: Update `baseUrl`

### Update Tax Rates

Tax calculators are in `lib/calculators/`. Each country has its own file with clearly documented rates and brackets.

### Styling

Tailwind configuration is in `tailwind.config.ts`. Customize colors, fonts, and other design tokens there.

## Deployment

### Vercel (Recommended)

```bash
npm install -g vercel
vercel
```

### Netlify

```bash
npm run build
# Deploy the 'out' directory
```

### Static Hosting

The `out` directory after build can be hosted on any static hosting service (AWS S3, GitHub Pages, etc.).

## Performance

- Static generation for instant loading
- Optimized bundle size
- No runtime dependencies for calculations
- Lighthouse score target: 90+

## SEO Features

- Server-side metadata generation
- Dynamic sitemap for all country pages
- Structured data
- Optimized title and description tags
- Keywords for each country

## License

MIT License - feel free to use for any purpose.

## Disclaimer

Tax calculations are estimates based on published tax rates for the specified tax year. Actual tax obligations may vary based on personal circumstances, deductions, credits, and other factors. This tool is for informational purposes only and should not be considered professional tax advice. Consult with a qualified tax professional for personalized guidance.

## Contributing

Contributions are welcome! Please ensure:
- Tax rates are accurate and sourced
- Code follows existing patterns
- TypeScript types are properly defined
- Components are responsive

## Support

For issues or questions, please open an issue on GitHub.
