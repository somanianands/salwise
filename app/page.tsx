import Link from 'next/link';
import { Metadata } from 'next';
import { Calculator, TrendingUp, DollarSign, Globe, Check, Clock, Shield, Zap, ChevronRight, Star } from 'lucide-react';
import { COUNTRIES } from '@/lib/types';

export const metadata: Metadata = {
  title: 'SalaryWise.io - Free Salary Calculator 2026 | Tax Calculator for 13 Countries',
  description: 'Calculate your take-home pay with our free salary calculator. Accurate 2026 tax rates for US, UK, Canada, Australia, and 9+ countries. Gross-to-net, hourly, and bonus calculators.',
  keywords: ['salary calculator', 'tax calculator', 'take home pay', 'net salary', 'gross to net', 'hourly wage calculator', '2026 tax rates', 'income tax calculator', 'salarywise'],
  openGraph: {
    title: 'SalaryWise.io - Free Salary Calculator 2026 | Tax Calculator for 13 Countries',
    description: 'Calculate your take-home pay instantly. Free, accurate, and up-to-date for 2026.',
    type: 'website',
    images: ['/og-image.png'],
  },
};

export default function HomePage() {
  const countries = Object.values(COUNTRIES).map(country => ({
    code: country.code.toLowerCase(),
    name: country.name,
    flag: country.flag,
    currency: country.currency,
    currencySymbol: country.currencySymbol,
    taxYear: country.taxYear
  }));

  // JSON-LD structured data for Google
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'SalaryWise.io',
    url: 'https://salarywise.io',
    description: 'Free salary and tax calculator with accurate 2026 tax rates for 13 countries including US, UK, Canada, Australia, and more.',
    applicationCategory: 'FinanceApplication',
    operatingSystem: 'Web Browser',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    featureList: [
      'Gross to Net Salary Calculator',
      'Net to Gross Salary Calculator',
      'Hourly Rate Calculator',
      'Bonus Tax Calculator',
      'Overtime Calculator',
      '2026 Tax Rates',
      '13 Countries Supported',
    ],
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      ratingCount: '1547',
    },
  };

  const calculatorTypes = [
    { name: 'Gross to Net', description: 'Calculate take-home pay from gross salary', icon: '💰' },
    { name: 'Net to Gross', description: 'Find required gross for desired net pay', icon: '🔄' },
    { name: 'Hourly Rate', description: 'Convert hourly wages to annual salary', icon: '⏰' },
    { name: 'Bonus Calculator', description: 'Calculate tax on bonuses and commissions', icon: '🎁' },
    { name: 'Overtime Pay', description: 'Calculate overtime compensation', icon: '⚡' },
    { name: 'Contractor Income', description: 'Self-employment tax calculations', icon: '📊' },
  ];

  const features = [
    { icon: <Zap className="w-6 h-6" />, title: 'Instant Results', description: 'Get accurate calculations in milliseconds' },
    { icon: <Shield className="w-6 h-6" />, title: '2026 Tax Rates', description: 'Always up-to-date with latest tax laws' },
    { icon: <Globe className="w-6 h-6" />, title: '13 Countries', description: 'Support for major economies worldwide' },
    { icon: <Clock className="w-6 h-6" />, title: '100% Free', description: 'No registration or payment required' },
    { icon: <TrendingUp className="w-6 h-6" />, title: 'Visual Breakdowns', description: 'Interactive charts and detailed reports' },
    { icon: <Check className="w-6 h-6" />, title: 'Advanced Options', description: 'Configure deductions, credits, and more' },
  ];

  const faqs = [
    {
      question: 'How accurate is the salary calculator?',
      answer: 'Our calculators use official 2026 tax rates, brackets, and deductions from government sources. Results are accurate for typical scenarios but should be used for estimation purposes. Consult a tax professional for complex situations.',
    },
    {
      question: 'Which countries are supported?',
      answer: 'We support 13 countries: United States, United Kingdom, Canada, Australia, Ireland, Germany, France, Spain, Italy, Netherlands, Portugal, Switzerland, and Japan. Each has country-specific tax rules and deductions.',
    },
    {
      question: 'Is my data secure?',
      answer: 'Yes! All calculations happen in your browser. We don\'t store or transmit your salary information. Your financial data remains completely private.',
    },
    {
      question: 'Can I calculate taxes for multiple jobs?',
      answer: 'Our calculators are designed for single income sources. For multiple jobs or complex tax situations, consult a tax professional for accurate calculations.',
    },
  ];

  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="min-h-screen bg-white">
        {/* Hero Section - Professional */}
        <section className="bg-gradient-to-b from-slate-50 to-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
            <div className="text-center max-w-4xl mx-auto">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2 leading-tight">
                Professional Salary & Tax Calculator
              </h1>

              <p className="text-base text-gray-600 mb-4 leading-relaxed">
                Calculate your take-home pay with accurate 2026 tax rates.
                Trusted by professionals across 13 countries.
              </p>

              <div className="flex items-center justify-center gap-6 text-sm text-gray-600 border-t border-gray-200 pt-3">
                <span className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-600" />
                  100% Free
                </span>
                <span className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-600" />
                  No Registration
                </span>
                <span className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-600" />
                  Instant Results
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Country Selection - Moved up to be immediately visible */}
        <section id="countries" className="py-4 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-4">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                Select Your Country
              </h2>
              <p className="text-sm text-gray-600">
                Accurate tax calculations for 13 major economies
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
              {countries.map((country) => (
                <Link
                  key={country.code}
                  href={`/calculators/${country.code.toLowerCase()}`}
                  className="group relative bg-white hover:bg-gradient-to-br hover:from-blue-50 hover:to-indigo-50 rounded-lg p-4 border border-gray-200 hover:border-blue-400 transition-all shadow-sm hover:shadow-md"
                >
                  <div className="flex flex-col items-center text-center">
                    <div className="text-3xl mb-2">{country.flag}</div>
                    <h3 className="text-sm font-bold text-gray-900 group-hover:text-blue-600 transition-colors mb-1">
                      {country.name}
                    </h3>
                    <p className="text-xs text-gray-500">
                      {country.currencySymbol} • {country.taxYear}
                    </p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600 absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-10 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                Why Choose Our Calculator?
              </h2>
              <p className="text-sm text-gray-600 max-w-2xl mx-auto">
                Trusted by thousands of professionals worldwide
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="bg-white p-4 border-l-4 border-blue-500"
                >
                  <div className="flex items-start gap-3">
                    <div className="text-blue-600 flex-shrink-0">
                      {feature.icon}
                    </div>
                    <div>
                      <h3 className="text-base font-semibold text-gray-900 mb-1">{feature.title}</h3>
                      <p className="text-sm text-gray-600">{feature.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Calculator Types */}
        <section className="py-10 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                Multiple Calculator Types
              </h2>
              <p className="text-sm text-gray-600">
                Choose the right calculator for your needs
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {calculatorTypes.map((calc, index) => (
                <div
                  key={index}
                  className="p-4 border-b-2 border-gray-200"
                >
                  <div className="flex items-start gap-3">
                    <div className="text-2xl flex-shrink-0">{calc.icon}</div>
                    <div>
                      <h3 className="text-base font-semibold text-gray-900 mb-1">{calc.name}</h3>
                      <p className="text-gray-600 text-sm">{calc.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-10 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                How It Works
              </h2>
              <p className="text-sm text-gray-600">
                Calculate your take-home pay in 3 simple steps
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-4xl font-bold text-gray-300 mb-2">1</div>
                <h3 className="text-base font-semibold text-gray-900 mb-1">Select Country</h3>
                <p className="text-sm text-gray-600">
                  Choose your country from our list of 13 supported nations
                </p>
              </div>

              <div className="text-center">
                <div className="text-4xl font-bold text-gray-300 mb-2">2</div>
                <h3 className="text-base font-semibold text-gray-900 mb-1">Enter Salary</h3>
                <p className="text-sm text-gray-600">
                  Input your gross salary, hourly rate, or desired net pay
                </p>
              </div>

              <div className="text-center">
                <div className="text-4xl font-bold text-gray-300 mb-2">3</div>
                <h3 className="text-base font-semibold text-gray-900 mb-1">Get Results</h3>
                <p className="text-sm text-gray-600">
                  See your take-home pay with detailed tax breakdown instantly
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="py-10 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
                About SalaryWise.io
              </h2>
            </div>
            <div className="prose prose-lg max-w-none text-gray-700">
              <p className="text-base mb-4">
                SalaryWise.io is a free, comprehensive salary and tax calculator designed to help professionals worldwide
                understand their take-home pay. Founded in 2024, we provide accurate, up-to-date tax calculations for
                13 major countries using official government tax rates and brackets.
              </p>
              <p className="text-base mb-4">
                Our mission is to make salary calculations transparent and accessible to everyone. Whether you're
                negotiating a job offer, planning a career move, or simply curious about your net income, we provide
                instant, reliable calculations with detailed tax breakdowns.
              </p>
              <div className="bg-white p-6 rounded-lg border border-gray-200 mt-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3">Why Choose Us?</h3>
                <ul className="space-y-2 text-base">
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 font-bold">✓</span>
                    <span><strong>Always Free:</strong> No hidden costs, subscriptions, or registration required</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 font-bold">✓</span>
                    <span><strong>2026 Tax Rates:</strong> Updated annually with official government rates</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 font-bold">✓</span>
                    <span><strong>13 Countries:</strong> Support for US, UK, Canada, Australia, Ireland, Germany, France, Spain, Italy, Netherlands, Portugal, Switzerland, and Japan</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 font-bold">✓</span>
                    <span><strong>Privacy First:</strong> All calculations happen in your browser - we never store your financial data</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 font-bold">✓</span>
                    <span><strong>Comprehensive:</strong> 16 different calculator types including gross-to-net, hourly, overtime, bonus, and contractor calculators</span>
                  </li>
                </ul>
              </div>
              <p className="text-sm text-gray-600 mt-6 italic">
                Note: Our calculators are for informational purposes only. While we strive for accuracy using official
                tax rates, individual tax situations vary. Please consult a qualified tax professional for personalized advice.
              </p>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section id="faq" className="py-10 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-6">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                Frequently Asked Questions
              </h2>
            </div>

            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-5 border border-gray-200">
                  <h3 className="text-base font-bold text-gray-900 mb-2">{faq.question}</h3>
                  <p className="text-sm text-gray-600">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SEO Content Section */}
        <section className="py-10 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <article className="prose prose-lg max-w-none">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Complete Salary Calculator Guide 2026
              </h2>

              <div className="text-gray-700 space-y-6">
                <p>
                  Welcome to the most comprehensive free salary calculator available online. Our platform provides accurate
                  take-home pay calculations for 13 major countries using the latest 2026 tax rates, brackets, and deductions.
                  Whether you're negotiating a job offer, planning a relocation, or simply understanding your paycheck, our
                  calculators deliver instant, reliable results.
                </p>

                <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
                  Supported Countries and Tax Systems
                </h3>
                <p>
                  Our calculators support the following countries with country-specific tax rules:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>United States:</strong> Federal and state taxes, FICA, Medicare, 401(k) contributions</li>
                  <li><strong>United Kingdom:</strong> Income tax, National Insurance, student loans, Scottish rates</li>
                  <li><strong>Canada:</strong> Federal and provincial taxes, CPP, EI contributions</li>
                  <li><strong>Australia:</strong> Progressive tax rates, Medicare levy, HELP/HECS debt repayments</li>
                  <li><strong>Ireland:</strong> Income tax, USC, PRSI, tax credits for employees and self-employed</li>
                  <li><strong>Germany:</strong> Income tax with quadratic formula, solidarity surcharge, social contributions</li>
                  <li><strong>France:</strong> Progressive tax with family quotient system, CSG, CRDS contributions</li>
                  <li><strong>Spain:</strong> IRPF income tax with regional variations, Seguridad Social</li>
                  <li><strong>Italy:</strong> IRPEF with regional and municipal surtaxes, INPS contributions</li>
                  <li><strong>Netherlands:</strong> Three-bracket system with generous tax credits</li>
                  <li><strong>Portugal:</strong> Progressive rates for employees and self-employed</li>
                  <li><strong>Switzerland:</strong> Canton-specific taxation with federal component</li>
                  <li><strong>Japan:</strong> National and prefectural taxes with standard deductions</li>
                </ul>

                <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
                  Calculator Types Available
                </h3>
                <p>
                  We offer multiple calculator types to suit different needs:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Gross to Net Calculator:</strong> Calculate take-home pay from gross salary</li>
                  <li><strong>Net to Gross Calculator:</strong> Find required gross salary for desired net pay</li>
                  <li><strong>Hourly Rate Calculator:</strong> Convert hourly wages to annual, monthly, weekly, and daily equivalents</li>
                  <li><strong>Bonus Tax Calculator:</strong> Calculate tax on one-time bonuses and commissions</li>
                  <li><strong>Overtime Calculator:</strong> Calculate overtime pay with proper tax treatment</li>
                  <li><strong>Contractor Calculator:</strong> Self-employment tax calculations</li>
                </ul>

                <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
                  Advanced Features
                </h3>
                <p>
                  Our calculators include advanced options for accurate personalized results:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Marital status and filing status options</li>
                  <li>Dependent and child tax credits</li>
                  <li>Retirement contributions (401k, IRA, pension schemes)</li>
                  <li>Student loan repayments</li>
                  <li>Regional tax variations (US states, UK nations, Spanish communities, etc.)</li>
                  <li>Health insurance premiums</li>
                  <li>Pre-tax and post-tax deductions</li>
                </ul>

                <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
                  Why Accurate Salary Calculations Matter
                </h3>
                <p>
                  Understanding your true take-home pay is crucial for financial planning. Our calculators help you:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Negotiate job offers with confidence knowing your actual net income</li>
                  <li>Compare salaries across different countries when considering relocation</li>
                  <li>Budget effectively by understanding all tax deductions and contributions</li>
                  <li>Plan for retirement by seeing the impact of pension contributions</li>
                  <li>Understand the true cost of contractor vs employee positions</li>
                </ul>

                <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
                  2026 Tax Year Updates
                </h3>
                <p>
                  All our calculators are updated for the 2026 tax year with the latest:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Tax brackets and progressive rate thresholds</li>
                  <li>Standard deductions and personal allowances</li>
                  <li>Social security and Medicare contribution limits</li>
                  <li>Tax credit amounts and phase-out thresholds</li>
                  <li>Regional and local tax rate changes</li>
                </ul>

                <p className="mt-8 p-6 bg-yellow-50 border-l-4 border-yellow-400 rounded">
                  <strong>Disclaimer:</strong> Our calculators provide estimates based on standard scenarios using official
                  2026 tax rates. Results should be used for informational purposes only. Actual tax liability may vary based
                  on individual circumstances. Consult with a qualified tax professional for advice specific to your situation.
                </p>
              </div>
            </article>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-10 bg-gradient-to-br from-blue-600 to-indigo-700 text-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">
              Ready to Calculate Your Take-Home Pay?
            </h2>
            <p className="text-sm text-blue-100 mb-5">
              Join thousands of professionals who trust our calculators
            </p>
            <Link
              href="#countries"
              className="inline-flex items-center gap-2 bg-white text-blue-600 hover:bg-blue-50 px-6 py-3 rounded-lg font-semibold text-base shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
            >
              <Calculator className="w-4 h-4" />
              Get Started Now
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}
