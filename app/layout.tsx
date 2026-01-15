import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Breadcrumb from "@/components/layout/Breadcrumb";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL('https://salarywise.io'), // Update with your production domain
  title: "SalaryWise.io - Salary Calculator 2026 | Tax Calculator for 13 Countries",
  description: "Free salary calculator with accurate 2026 tax rates for US, UK, Canada, Australia, Germany, France, Spain, Italy, Netherlands, Portugal, Switzerland, Japan, and Ireland. Calculate take-home pay, gross-to-net, hourly rates, overtime, bonus tax, and contractor rates instantly. 100% free, no registration required.",
  keywords: [
    "salary calculator",
    "tax calculator",
    "take home pay calculator",
    "gross to net calculator",
    "net to gross calculator",
    "paycheck calculator",
    "income tax calculator",
    "wage calculator",
    "hourly rate calculator",
    "annual salary calculator",
    "2026 tax rates",
    "2026 tax calculator",
    "bonus tax calculator",
    "overtime calculator",
    "contractor tax calculator",
    "self employed tax calculator",
    "US salary calculator",
    "UK salary calculator",
    "Canada salary calculator",
    "Australia salary calculator",
    "Germany salary calculator",
    "France salary calculator",
    "Spain salary calculator",
    "Italy salary calculator",
    "Portugal salary calculator",
    "Switzerland salary calculator",
    "Japan salary calculator",
    "salarywise",
    "salary converter",
    "tax estimator"
  ],
  authors: [{ name: "SalaryWise.io", url: "https://salarywise.io" }],
  creator: "SalaryWise.io",
  publisher: "SalaryWise.io",
  applicationName: "SalaryWise.io",
  openGraph: {
    title: "SalaryWise.io - Free Salary & Tax Calculator 2026",
    description: "Calculate your take-home pay with accurate 2026 tax rates for 13 countries. Free salary calculator with gross-to-net, hourly, overtime, bonus, and contractor calculators. No registration required.",
    type: "website",
    locale: "en_US",
    siteName: "SalaryWise.io",
    url: "https://salarywise.io",
  },
  twitter: {
    card: "summary_large_image",
    title: "SalaryWise.io - Salary Calculator 2026",
    description: "Free salary and tax calculator for 13 countries with accurate 2026 tax rates.",
    creator: "@salarywise",
    site: "@salarywise",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  alternates: {
    canonical: "https://salarywise.io",
  },
  category: "Finance",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // JSON-LD structured data for AI and search engines
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "SalaryWise.io",
    "url": "https://salarywise.io",
    "description": "Free salary and tax calculator for 13 countries with accurate 2026 tax rates",
    "applicationCategory": "FinanceApplication",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    }
  };

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${inter.variable} ${poppins.variable} antialiased font-sans min-h-screen flex flex-col`}
      >
        <Header />
        <Breadcrumb />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
