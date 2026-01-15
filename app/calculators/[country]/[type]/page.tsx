import { notFound } from 'next/navigation';
import Link from 'next/link';
import Script from 'next/script';
import dynamic from 'next/dynamic';
import { Country, COUNTRIES } from '@/lib/types';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import type { Metadata } from 'next';
import { CALCULATORS, getCalculatorBySlug, type CalculatorType as CalcType } from '@/lib/calculator-types';
import { getCalculatorContent } from '@/lib/content-loader';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import SkeletonLoader from '@/components/calculators/SkeletonLoader';

// Lazy load heavy components for better performance
const SalaryCalculator = dynamic(
  () => import('@/components/calculators/SalaryCalculator'),
  {
    loading: () => <SkeletonLoader />,
    ssr: true
  }
);

const CalculatorContent = dynamic(
  () => import('@/components/CalculatorContent'),
  {
    ssr: true
  }
);

// Tax authority sources for each country
const TAX_AUTHORITY_SOURCES: Record<Country, Array<{ name: string; url: string }>> = {
  US: [
    { name: 'IRS - Internal Revenue Service', url: 'https://www.irs.gov' },
    { name: 'Social Security Administration', url: 'https://www.ssa.gov' }
  ],
  UK: [
    { name: 'HMRC - HM Revenue & Customs', url: 'https://www.gov.uk/government/organisations/hm-revenue-customs' },
    { name: 'UK Tax Rates & Allowances', url: 'https://www.gov.uk/income-tax-rates' }
  ],
  IE: [
    { name: 'Revenue - Irish Tax Authority', url: 'https://www.revenue.ie' },
    { name: 'Citizens Information - Tax', url: 'https://www.citizensinformation.ie/en/money-and-tax/tax/' }
  ],
  CA: [
    { name: 'CRA - Canada Revenue Agency', url: 'https://www.canada.ca/en/revenue-agency.html' },
    { name: 'Provincial Tax Information', url: 'https://www.canada.ca/en/revenue-agency/services/tax/individuals/topics/about-your-tax-return/tax-return/completing-a-tax-return/provincial-territorial-tax-credits-individuals.html' }
  ],
  AU: [
    { name: 'ATO - Australian Taxation Office', url: 'https://www.ato.gov.au' },
    { name: 'Income Tax Rates', url: 'https://www.ato.gov.au/rates/individual-income-tax-rates/' }
  ],
  DE: [
    { name: 'Bundesministerium der Finanzen', url: 'https://www.bundesfinanzministerium.de' },
    { name: 'German Tax Portal', url: 'https://www.elster.de' }
  ],
  FR: [
    { name: 'Impots.gouv.fr - French Tax Portal', url: 'https://www.impots.gouv.fr' },
    { name: 'URSSAF - Social Security', url: 'https://www.urssaf.fr' }
  ],
  NL: [
    { name: 'Belastingdienst - Dutch Tax Authority', url: 'https://www.belastingdienst.nl' },
    { name: 'Tax Rates Netherlands', url: 'https://www.belastingdienst.nl/wps/wcm/connect/en/individuals/individuals' }
  ],
  ES: [
    { name: 'Agencia Tributaria - Spanish Tax Agency', url: 'https://www.agenciatributaria.es' },
    { name: 'Seguridad Social', url: 'https://www.seg-social.es' }
  ],
  IT: [
    { name: 'Agenzia delle Entrate', url: 'https://www.agenziaentrate.gov.it' },
    { name: 'INPS - Social Security', url: 'https://www.inps.it' }
  ],
  PT: [
    { name: 'Portal das Finanças', url: 'https://www.portaldasfinancas.gov.pt' },
    { name: 'Segurança Social', url: 'https://www.seg-social.pt' }
  ],
  CH: [
    { name: 'Swiss Federal Tax Administration', url: 'https://www.estv.admin.ch' },
    { name: 'Cantonal Tax Information', url: 'https://www.ch.ch/en/taxes/' }
  ],
  JP: [
    { name: 'National Tax Agency Japan', url: 'https://www.nta.go.jp/english/' },
    { name: 'Japan Pension Service', url: 'https://www.nenkin.go.jp/international/english/index.html' }
  ]
};

interface Props {
  params: Promise<{
    country: string;
    type: string;
  }>;
}

type CalculatorMode = 'gross-to-net' | 'net-to-gross' | 'hourly' | 'weekly' | 'monthly' | 'daily' | 'overtime' | 'bonus' | 'commission' | 'contractor';

// Map calculator types to modes
const CALCULATOR_MODE_MAP: Record<string, CalculatorMode> = {
  'salary-calculator': 'gross-to-net',
  'gross-to-net-salary-calculator': 'gross-to-net',
  'net-to-gross-salary-calculator': 'net-to-gross',
  'salary-after-tax-calculator': 'gross-to-net',
  'take-home-pay-calculator': 'gross-to-net',
  'hourly-to-salary-calculator': 'hourly',
  'hourly-rate-calculator': 'hourly',
  'weekly-to-salary-calculator': 'weekly',
  'monthly-to-salary-calculator': 'monthly',
  'daily-to-salary-calculator': 'daily',
  'overtime-pay-calculator': 'overtime',
  'bonus-tax-calculator': 'bonus',
  'commission-calculator': 'commission',
  'contractor-salary-calculator': 'contractor',
  'freelancer-income-calculator': 'contractor',
  'self-employed-tax-calculator': 'contractor'
};

// Generate static params for all countries and calculator types
export async function generateStaticParams() {
  const countries = Object.keys(COUNTRIES);
  const types = Object.values(CALCULATORS).map(calc => calc.slug);

  const params = [];
  for (const country of countries) {
    for (const type of types) {
      params.push({
        country: country.toLowerCase(),
        type: type
      });
    }
  }

  return params;
}

// Generate metadata for SEO
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { country, type } = await params;
  const countryCode = country.toUpperCase() as Country;
  const countryInfo = COUNTRIES[countryCode];
  const calculatorInfo = getCalculatorBySlug(type);

  if (!countryInfo || !calculatorInfo) {
    return {
      title: 'Calculator Not Found'
    };
  }

  // Try to load custom content
  const content = getCalculatorContent(country, type);

  // Use custom content if available, otherwise use defaults
  const title = content?.metaTitle || `${countryInfo.name} ${calculatorInfo.name} ${countryInfo.taxYear} | Free Tax Calculator`;
  const description = content?.metaDescription || `${calculatorInfo.description} for ${countryInfo.name}. Accurate ${countryInfo.taxYear} tax rates, social security, and all deductions. Free, fast, and easy to use.`;

  return {
    title,
    description,
    keywords: [
      `${countryInfo.name} ${type.replace(/-/g, ' ')}`,
      `${countryInfo.name} salary calculator`,
      `${countryInfo.name} tax calculator`,
      `${countryInfo.name} take home pay`,
      `${countryInfo.currency} salary`,
      ...calculatorInfo.keywords,
      countryInfo.taxYear,
      'salary calculator',
      'tax calculator'
    ],
    openGraph: {
      title,
      description,
      type: 'website',
    }
  };
}

export default async function CalculatorTypePage({ params }: Props) {
  const { country, type } = await params;
  const countryCode = country.toUpperCase() as Country;
  const countryInfo = COUNTRIES[countryCode];
  const calculatorInfo = getCalculatorBySlug(type);

  if (!countryInfo || !calculatorInfo) {
    notFound();
  }

  const mode = CALCULATOR_MODE_MAP[type] || 'gross-to-net';

  // Load custom content if available
  const content = getCalculatorContent(country, type);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100">
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-1">
              {content?.h1 || `${countryInfo.name} ${calculatorInfo.name}`}
            </h1>
            <p className="text-gray-600">
              {calculatorInfo.description}
            </p>
          </div>
        </div>
      </header>

      {/* Back to All Calculators */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
        <Link
          href={`/calculators/${country}`}
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          View all {countryInfo.name} calculators
        </Link>
      </div>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
        {/* Calculator Component - Main Tool (Top Priority) */}
        <SalaryCalculator country={countryCode} initialMode={mode} />

        {/* Introduction (short, below calculator) */}
        {content?.introduction && (
          <section className="mt-8 bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
            <div className="prose prose-lg prose-blue max-w-none">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {content.introduction}
              </ReactMarkdown>
            </div>
          </section>
        )}

        {/* Rich Content Below Calculator */}
        {content ? (
          <CalculatorContent
            content={content}
            country={countryInfo.name}
            calculatorName={calculatorInfo.name}
          />
        ) : (
          // Fallback content if no custom content file exists
          <div className="mt-6 bg-white rounded-lg p-6 border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              About {countryInfo.name} {calculatorInfo.name}
            </h2>
            <div className="prose prose-blue max-w-none">
              <p className="text-gray-700">
                Our {countryInfo.name} {calculatorInfo.name.toLowerCase()} helps you understand your salary
                and taxes for the {countryInfo.taxYear} tax year. {calculatorInfo.description}.
              </p>

              <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">
                What's Included in the Calculation?
              </h3>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>Income tax based on {countryInfo.taxYear} tax brackets</li>
                <li>Social security and pension contributions</li>
                <li>Health insurance and Medicare (where applicable)</li>
                <li>All mandatory deductions specific to {countryInfo.name}</li>
                <li>Detailed breakdown by annual, monthly, weekly, daily, and hourly</li>
              </ul>

              <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">
                More {countryInfo.name} Calculators
              </h3>
              <div className="flex flex-wrap gap-3">
                <Link
                  href={`/calculators/${country}`}
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold shadow-md"
                >
                  View All {countryInfo.name} Calculators →
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Sources Section - Official Tax Authority Links */}
        <section className="mt-8 bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Official Sources
          </h2>
          <p className="text-gray-600 mb-4">
            Tax calculations are based on official rates from {countryInfo.name} tax authorities. For the most up-to-date information, please visit:
          </p>
          <ul className="space-y-3">
            {TAX_AUTHORITY_SOURCES[countryCode].map((source, index) => (
              <li key={index}>
                <a
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-blue-600 hover:text-blue-700 hover:underline transition-colors"
                >
                  <ExternalLink className="w-4 h-4 flex-shrink-0" />
                  <span>{source.name}</span>
                </a>
              </li>
            ))}
          </ul>
          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-gray-700">
              <strong>Disclaimer:</strong> This calculator is for informational purposes only. Tax calculations are based on {countryInfo.taxYear} tax rates and standard deductions. Your actual tax liability may vary based on your specific circumstances. Always consult with a qualified tax professional for personalized advice.
            </p>
          </div>
        </section>
      </main>

      <footer className="bg-white border-t border-gray-200 mt-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 text-center">
          <p className="text-sm text-gray-600">
            © {countryInfo.taxYear} <Link href="/" className="text-blue-600 hover:underline">SalaryWise.io</Link> - {countryInfo.name} {calculatorInfo.name}
          </p>
        </div>
      </footer>

      {/* Schema Markup - Add to head */}
      {content && (content.schema.webPage || content.schema.softwareApplication || content.schema.faqPage || content.schema.breadcrumbList) && (
        <Script
          id="schema-markup"
          type="application/ld+json"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@graph': [
                content.schema.webPage,
                content.schema.softwareApplication,
                content.schema.faqPage,
                content.schema.breadcrumbList,
              ].filter(Boolean),
            }),
          }}
        />
      )}
    </div>
  );
}
