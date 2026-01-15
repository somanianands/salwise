'use client';

import Link from 'next/link';
import { Calculator, Mail, Globe, Github } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const countries = [
    { code: 'us', name: 'United States' },
    { code: 'uk', name: 'United Kingdom' },
    { code: 'canada', name: 'Canada' },
    { code: 'australia', name: 'Australia' },
    { code: 'ireland', name: 'Ireland' },
    { code: 'germany', name: 'Germany' },
    { code: 'france', name: 'France' },
    { code: 'spain', name: 'Spain' },
    { code: 'italy', name: 'Italy' },
    { code: 'netherlands', name: 'Netherlands' },
    { code: 'portugal', name: 'Portugal' },
    { code: 'switzerland', name: 'Switzerland' },
    { code: 'japan', name: 'Japan' },
  ];

  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <Calculator className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900">SalaryWise.io</h2>
                <p className="text-xs text-gray-500">Smart Tax Calculator</p>
              </div>
            </Link>
            <p className="text-sm text-gray-600 mb-4">
              Free salary and tax calculator with accurate {currentYear} tax rates for 13 countries.
            </p>
            <div className="flex items-center gap-3">
              <a
                href="mailto:contact@salarywise.io"
                className="text-gray-600 hover:text-blue-600 transition-colors"
                aria-label="Email"
              >
                <Mail className="w-5 h-5" />
              </a>
              <a
                href="https://github.com"
                className="text-gray-600 hover:text-blue-600 transition-colors"
                aria-label="GitHub"
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href="/"
                className="text-gray-600 hover:text-blue-600 transition-colors"
                aria-label="Website"
              >
                <Globe className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Calculators Section - Split into 2 columns */}
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
              Calculators by Country
            </h3>
            <div className="grid grid-cols-2 gap-x-6 gap-y-2">
              {countries.map((country) => (
                <Link
                  key={country.code}
                  href={`/calculators/${country.code}/salary-calculator`}
                  className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
                >
                  {country.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Resources Section */}
          <div className="col-span-1">
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
              Resources
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/"
                  className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/#about"
                  className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  href="/#features"
                  className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
                >
                  Features
                </Link>
              </li>
              <li>
                <Link
                  href="/#faq"
                  className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
                >
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-8 pt-8 border-t border-gray-200">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-500 text-center md:text-left">
              © {currentYear} SalaryWise.io. All rights reserved.
            </p>
            <div className="flex items-center gap-6 text-sm text-gray-500">
              <Link
                href="/privacy"
                className="hover:text-blue-600 transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms"
                className="hover:text-blue-600 transition-colors"
              >
                Terms of Service
              </Link>
              <Link
                href="/disclaimer"
                className="hover:text-blue-600 transition-colors"
              >
                Disclaimer
              </Link>
            </div>
          </div>
          <p className="text-xs text-gray-500 text-center md:text-left mt-4">
            ⚠️ For informational purposes only. Tax calculations based on {currentYear} rates. Consult a tax professional for advice.
          </p>
        </div>
      </div>
    </footer>
  );
}
