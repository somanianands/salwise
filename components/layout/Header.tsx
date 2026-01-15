'use client';

import Link from 'next/link';
import { Calculator, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const countries = [
    { code: 'us', name: 'United States', flag: '🇺🇸' },
    { code: 'uk', name: 'United Kingdom', flag: '🇬🇧' },
    { code: 'canada', name: 'Canada', flag: '🇨🇦' },
    { code: 'australia', name: 'Australia', flag: '🇦🇺' },
    { code: 'ireland', name: 'Ireland', flag: '🇮🇪' },
    { code: 'germany', name: 'Germany', flag: '🇩🇪' },
    { code: 'france', name: 'France', flag: '🇫🇷' },
    { code: 'spain', name: 'Spain', flag: '🇪🇸' },
    { code: 'italy', name: 'Italy', flag: '🇮🇹' },
    { code: 'netherlands', name: 'Netherlands', flag: '🇳🇱' },
    { code: 'portugal', name: 'Portugal', flag: '🇵🇹' },
    { code: 'switzerland', name: 'Switzerland', flag: '🇨🇭' },
    { code: 'japan', name: 'Japan', flag: '🇯🇵' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center shadow-lg">
              <Calculator className="w-6 h-6 text-white" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg font-bold text-gray-900">SalaryWise.io</h1>
              <p className="text-xs text-gray-500">2026 Tax Rates</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/"
              className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
            >
              Home
            </Link>

            {/* Countries Dropdown */}
            <div className="relative group">
              <button className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors flex items-center gap-1">
                Calculators
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Dropdown Menu */}
              <div className="absolute left-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform group-hover:translate-y-0 translate-y-2">
                <div className="p-2 max-h-96 overflow-y-auto">
                  {countries.map((country) => (
                    <Link
                      key={country.code}
                      href={`/calculators/${country.code}/salary-calculator`}
                      className="flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-md transition-colors"
                    >
                      <span className="text-2xl">{country.flag}</span>
                      <span>{country.name}</span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            <Link
              href="/#about"
              className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
            >
              About
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-gray-700 hover:text-blue-600 transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden border-t border-gray-200 bg-white overflow-hidden"
          >
            <div className="px-4 py-4 space-y-3 max-h-[70vh] overflow-y-auto">
              <Link
                href="/"
                className="block px-3 py-2 text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-md transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </Link>

              <div className="px-3 py-2 text-sm font-semibold text-gray-900">
                Calculators
              </div>

              <div className="pl-4 space-y-2">
                {countries.map((country) => (
                  <Link
                    key={country.code}
                    href={`/calculators/${country.code}/salary-calculator`}
                    className="flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-md transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <span className="text-xl">{country.flag}</span>
                    <span>{country.name}</span>
                  </Link>
                ))}
              </div>

              <Link
                href="/#about"
                className="block px-3 py-2 text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-md transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                About
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
