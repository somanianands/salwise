import { MetadataRoute } from 'next';
import { COUNTRIES } from '@/lib/types';
import { CALCULATORS } from '@/lib/calculator-types';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://salarywise.io';

  // Use static date for pages that don't change often to avoid unnecessary recrawling
  const staticDate = new Date('2026-01-15');
  const recentUpdate = new Date();

  // Homepage - highest priority
  const homePage = {
    url: baseUrl,
    lastModified: recentUpdate,
    changeFrequency: 'weekly' as const,
    priority: 1.0,
  };

  // Important content pages
  const contentPages = [
    {
      url: `${baseUrl}/contact/`,
      lastModified: staticDate,
      changeFrequency: 'yearly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/privacy/`,
      lastModified: staticDate,
      changeFrequency: 'yearly' as const,
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms/`,
      lastModified: staticDate,
      changeFrequency: 'yearly' as const,
      priority: 0.3,
    },
    {
      url: `${baseUrl}/disclaimer/`,
      lastModified: staticDate,
      changeFrequency: 'yearly' as const,
      priority: 0.3,
    },
  ];

  // Country landing pages - very important for SEO
  const countryPages = Object.keys(COUNTRIES).map(country => ({
    url: `${baseUrl}/calculators/${country.toLowerCase()}/`,
    lastModified: recentUpdate,
    changeFrequency: 'monthly' as const,
    priority: 0.9,
  }));

  // Popular calculator types get higher priority
  const popularCalculators = [
    'gross-to-net-salary-calculator',
    'net-to-gross-salary-calculator',
    'salary-calculator',
    'take-home-pay-calculator',
    'hourly-to-salary-calculator',
  ];

  // Generate calculator pages with prioritization
  const calculatorPages: MetadataRoute.Sitemap = [];
  const allCalculatorTypes = Object.values(CALCULATORS).map(calc => calc.slug);

  for (const country of Object.keys(COUNTRIES)) {
    for (const type of allCalculatorTypes) {
      // Higher priority for popular calculators
      const isPopular = popularCalculators.includes(type);

      calculatorPages.push({
        url: `${baseUrl}/calculators/${country.toLowerCase()}/${type}/`,
        lastModified: recentUpdate,
        changeFrequency: 'monthly' as const,
        priority: isPopular ? 0.85 : 0.75,
      });
    }
  }

  // Return in order of priority for better crawl budget usage
  return [
    homePage,
    ...countryPages,        // Country pages (high value)
    ...contentPages,        // Content/legal pages
    ...calculatorPages,     // Individual calculators
  ];
}
