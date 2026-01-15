'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight, Home } from 'lucide-react';

export default function Breadcrumb() {
  const pathname = usePathname();

  // Don't show breadcrumb on home page
  if (pathname === '/') {
    return null;
  }

  // Parse the pathname into breadcrumb segments
  const pathSegments = pathname.split('/').filter(Boolean);

  // Country code to name mapping
  const countryNames: Record<string, string> = {
    us: 'United States',
    uk: 'United Kingdom',
    canada: 'Canada',
    australia: 'Australia',
    ireland: 'Ireland',
    germany: 'Germany',
    france: 'France',
    spain: 'Spain',
    italy: 'Italy',
    netherlands: 'Netherlands',
    portugal: 'Portugal',
    switzerland: 'Switzerland',
    japan: 'Japan',
    ie: 'Ireland',
    de: 'Germany',
    fr: 'France',
    es: 'Spain',
    it: 'Italy',
    nl: 'Netherlands',
    pt: 'Portugal',
    ch: 'Switzerland',
    jp: 'Japan',
    au: 'Australia',
    ca: 'Canada',
  };

  // Mode/type to readable name mapping
  const modeNames: Record<string, string> = {
    'salary-calculator': 'Salary Calculator',
    'gross-to-net': 'Gross to Net',
    'net-to-gross': 'Net to Gross',
    'hourly-calculator': 'Hourly Calculator',
    'daily-calculator': 'Daily Calculator',
    'weekly-calculator': 'Weekly Calculator',
    'monthly-calculator': 'Monthly Calculator',
    'overtime-calculator': 'Overtime Calculator',
    'bonus-calculator': 'Bonus Calculator',
    'commission-calculator': 'Commission Calculator',
    'contractor-calculator': 'Contractor Calculator',
    calculators: 'Calculators',
  };

  // Build breadcrumb items
  const breadcrumbItems = [];
  let currentPath = '';

  for (let i = 0; i < pathSegments.length; i++) {
    const segment = pathSegments[i];
    currentPath += `/${segment}`;

    // Skip the "calculators" segment as it doesn't have its own page
    if (segment.toLowerCase() === 'calculators') {
      continue;
    }

    // Determine display name
    let displayName = segment;

    // Check if it's a country code
    if (countryNames[segment.toLowerCase()]) {
      displayName = countryNames[segment.toLowerCase()];
    }
    // Check if it's a mode/type
    else if (modeNames[segment.toLowerCase()]) {
      displayName = modeNames[segment.toLowerCase()];
    }
    // Otherwise capitalize first letter of each word
    else {
      displayName = segment
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    }

    breadcrumbItems.push({
      name: displayName,
      href: currentPath,
      isLast: i === pathSegments.length - 1,
    });
  }

  return (
    <nav className="bg-gray-50 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <ol className="flex items-center flex-wrap gap-2 text-sm">
          {/* Home */}
          <li>
            <Link
              href="/"
              className="flex items-center gap-1 text-gray-600 hover:text-blue-600 transition-colors"
            >
              <Home className="w-4 h-4" />
              <span className="hidden sm:inline">Home</span>
            </Link>
          </li>

          {/* Breadcrumb items */}
          {breadcrumbItems.map((item, index) => (
            <li key={item.href} className="flex items-center gap-2">
              <ChevronRight className="w-4 h-4 text-gray-400" />
              {item.isLast ? (
                <span className="font-medium text-gray-900">{item.name}</span>
              ) : (
                <Link
                  href={item.href}
                  className="text-gray-600 hover:text-blue-600 transition-colors"
                >
                  {item.name}
                </Link>
              )}
            </li>
          ))}
        </ol>
      </div>
    </nav>
  );
}
