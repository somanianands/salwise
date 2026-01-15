# Quick Start Guide

## Run the Development Server

```bash
cd /Users/asomani16/Repository/salarycalculators
npm run dev
```

Visit http://localhost:3000

## Build for Production

```bash
npm run build
```

The static site will be exported to the `out/` directory.

## Preview Production Build

```bash
npx serve@latest out
```

## Project Highlights

### Tax Calculators Implemented
All 9 countries have fully functional tax calculators with 2025/2026 rates:

1. **US** - Federal + State (CA), Social Security, Medicare
2. **UK** - Income Tax, National Insurance
3. **Canada** - Federal + Provincial (ON), CPP, EI
4. **Australia** - Income Tax, Medicare Levy
5. **Germany** - Progressive formula, Social Security, Solidarity Surcharge
6. **France** - Income Tax, CSG, CRDS, Social charges
7. **India** - New tax regime, EPF, Professional tax
8. **Singapore** - Progressive rates, CPF
9. **UAE** - Tax-free (no income tax)

### Features
- **Gross-to-Net**: Calculate take-home pay from gross salary
- **Net-to-Gross**: Calculate required gross salary for desired net pay
- **Hourly Converter**: Convert hourly rates to all frequencies
- **Visual Breakdown**: Interactive pie charts showing tax distribution
- **Frequency Table**: Annual, monthly, weekly, daily, and hourly breakdowns
- **Responsive Design**: Works on desktop, tablet, and mobile
- **SEO Optimized**: Static pages, metadata, sitemap, robots.txt

### Performance
- Static site generation (no server required)
- Fast loading times
- All calculations run client-side
- Optimized bundle size

## Next Steps

1. **Update Domain**: Replace placeholder URLs in:
   - `app/sitemap.ts`
   - `app/robots.ts`

2. **Deploy**:
   - Vercel: `vercel` (automatic detection)
   - Netlify: Deploy the `out/` directory
   - Static hosting: Upload `out/` to any web server

3. **Customize**:
   - Update tax rates in `lib/calculators/`
   - Modify styling in Tailwind config
   - Add more countries or features

## File Structure
```
/Users/asomani16/Repository/salarycalculators/
├── app/                    # Next.js app router pages
│   ├── calculators/[country]/  # Country-specific calculator pages
│   ├── page.tsx           # Home page
│   ├── layout.tsx         # Root layout with metadata
│   ├── sitemap.ts         # Dynamic sitemap
│   └── robots.ts          # Robots.txt
├── components/            # React components
│   └── calculators/       # Calculator UI components
├── lib/                   # Business logic
│   ├── types.ts          # TypeScript types
│   └── calculators/      # Tax calculation engines (9 countries)
├── public/               # Static assets
└── out/                  # Build output (after npm run build)
```

## Key Technologies
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Recharts (visualizations)
- Lucide React (icons)

## Support
See README.md for full documentation.
