import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Country, COUNTRIES } from '@/lib/types';
import { getAllCategories, getCalculatorsByCategory, CALCULATORS } from '@/lib/calculator-types';
import type { Metadata } from 'next';

interface Props {
  params: Promise<{ country: string }>;
}

// Generate static params for all countries
export async function generateStaticParams() {
  return Object.keys(COUNTRIES).map((country) => ({
    country: country.toLowerCase()
  }));
}

// Generate metadata for SEO
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { country } = await params;
  const countryCode = country.toUpperCase() as Country;
  const countryInfo = COUNTRIES[countryCode];

  if (!countryInfo) {
    return {
      title: 'Country Not Found'
    };
  }

  return {
    title: `${countryInfo.name} Salary Calculator ${countryInfo.taxYear} | All Tax Calculators`,
    description: `Comprehensive ${countryInfo.name} salary calculators: Gross-to-Net, Take Home Pay, Hourly Rate, Overtime, Bonus Tax, Contractor, and more. Accurate ${countryInfo.taxYear} tax rates.`,
    keywords: [
      `${countryInfo.name} salary calculator`,
      `${countryInfo.name} tax calculator`,
      `${countryInfo.name} take home pay`,
      `${countryInfo.name} net salary`,
      `${countryInfo.name} gross to net`,
      `${countryInfo.currency} salary`,
      'salary calculator',
      'tax calculator',
      countryInfo.taxYear
    ]
  };
}

export default async function CountryCalculatorPage({ params }: Props) {
  const { country } = await params;
  const countryCode = country.toUpperCase() as Country;
  const countryInfo = COUNTRIES[countryCode];

  if (!countryInfo) {
    notFound();
  }

  const categories = getAllCategories();

  return (
    <div className="min-h-screen bg-white py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header - Compact */}
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">{countryInfo.flag}</div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            {countryInfo.name} Calculators
          </h1>
          <p className="text-base text-gray-600 mb-1">
            Complete suite of salary and tax calculators for {countryInfo.taxYear}
          </p>
          <p className="text-sm text-gray-500">
            {Object.values(CALCULATORS).length} calculators in {categories.length} categories
          </p>
        </div>

        {/* Categories - Compact */}
        <div className="space-y-8">
          {categories.map((category) => {
            const calculators = getCalculatorsByCategory(category.id);

            return (
              <div key={category.id} className="bg-gray-50 rounded-xl border border-gray-200 p-6">
                {/* Category Header */}
                <div className="mb-5">
                  <h2 className="text-2xl font-bold text-gray-900 mb-1 flex items-center gap-2">
                    <span className="text-3xl">{category.icon}</span>
                    {category.name}
                  </h2>
                  <p className="text-sm text-gray-600">{category.description}</p>
                </div>

                {/* Calculator Grid */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                  {calculators.map((calc) => (
                    <Link
                      key={calc.type}
                      href={`/calculators/${country}/${calc.slug}`}
                      className="group p-4 bg-white border border-gray-200 rounded-lg hover:border-blue-400 hover:shadow-md transition-all duration-200"
                    >
                      <div className="flex items-start gap-2.5">
                        <span className="text-xl group-hover:scale-110 transition-transform">
                          {calc.icon}
                        </span>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-semibold text-gray-900 group-hover:text-blue-600 mb-0.5 line-clamp-1">
                            {calc.name}
                          </h3>
                          <p className="text-xs text-gray-600 line-clamp-2">
                            {calc.description}
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Back to Countries */}
        <div className="mt-8 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium text-sm"
          >
            ← Back to all countries
          </Link>
        </div>
      </div>
    </div>
  );
}
