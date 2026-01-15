import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Disclaimer | SalaryWise.io',
  description: 'Important disclaimer about using SalaryWise.io salary and tax calculators.',
};

export default function Disclaimer() {
  return (
    <div className="min-h-screen bg-white py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">Disclaimer</h1>

        <div className="prose prose-lg max-w-none">
          <p className="text-gray-600 mb-8">
            <strong>Last Updated:</strong> January 2026
          </p>

          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 mb-8">
            <p className="text-gray-800 font-semibold mb-2">
              IMPORTANT: Please Read Carefully
            </p>
            <p className="text-gray-700">
              The information and calculations provided by SalaryWise.io are for informational and educational purposes only. They should not be relied upon as the sole basis for financial, tax, or legal decisions.
            </p>
          </div>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Purpose of Our Calculators</h2>
            <p className="text-gray-700 mb-4">
              SalaryWise.io provides salary and tax calculators designed to offer general estimates based on standard tax rules and rates for the 2026 tax year. Our calculators are intended to:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 mb-4">
              <li>Help you understand how taxes affect your take-home pay</li>
              <li>Provide quick estimates for salary negotiations and budgeting</li>
              <li>Offer educational insights into tax systems across different countries</li>
              <li>Serve as a starting point for financial planning</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Limitations and Accuracy</h2>
            <p className="text-gray-700 mb-4">
              <strong>No Guarantee of Accuracy:</strong> While we strive to provide accurate calculations based on current tax laws, we cannot guarantee 100% accuracy. Tax laws are:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 mb-4">
              <li>Complex and subject to frequent changes</li>
              <li>Interpreted differently by tax authorities</li>
              <li>Applied differently based on individual circumstances</li>
              <li>Varied by region, state, province, or canton within countries</li>
            </ul>
            <p className="text-gray-700 mb-4">
              Our calculators use standard assumptions and may not account for all possible deductions, credits, exemptions, or special circumstances that apply to your situation.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Not Professional Advice</h2>
            <p className="text-gray-700 mb-4">
              <strong>The calculators and information on this website do NOT constitute:</strong>
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 mb-4">
              <li>Professional tax advice</li>
              <li>Financial planning or investment advice</li>
              <li>Legal advice or opinions</li>
              <li>Accounting services</li>
              <li>Recommendations for specific financial decisions</li>
            </ul>
            <p className="text-gray-700 mb-4">
              We strongly recommend consulting with qualified professionals (certified tax advisors, accountants, financial planners, or lawyers) for advice tailored to your specific situation before making any financial or tax-related decisions.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Individual Circumstances</h2>
            <p className="text-gray-700 mb-4">
              Your actual tax liability and take-home pay may differ from our calculations due to:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 mb-4">
              <li>Unique personal circumstances (dependents, disabilities, age)</li>
              <li>Additional income sources (investments, rental income, side businesses)</li>
              <li>Specific deductions and credits you may be eligible for</li>
              <li>Employer-specific benefits and deductions</li>
              <li>Regional tax variations (state, provincial, cantonal, municipal)</li>
              <li>Tax treaty provisions for international workers</li>
              <li>Changes in tax laws after our last update</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">No Liability</h2>
            <p className="text-gray-700 mb-4">
              By using SalaryWise.io, you acknowledge and agree that:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 mb-4">
              <li>We are not responsible for any financial losses, tax penalties, or legal issues arising from reliance on our calculators</li>
              <li>You use the Service entirely at your own risk</li>
              <li>We make no warranties about the completeness, accuracy, or reliability of our calculations</li>
              <li>Any action you take based on information from our site is strictly at your own discretion</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Tax Year and Updates</h2>
            <p className="text-gray-700 mb-4">
              Our calculators are based on tax rates and rules for the <strong>2026 tax year</strong>. Tax laws change regularly, and information may become outdated. We update our calculators periodically, but cannot guarantee they reflect the most current regulations at all times.
            </p>
            <p className="text-gray-700 mb-4">
              Always verify current tax rates and rules with official government sources or tax professionals before filing taxes or making financial decisions.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Official Sources</h2>
            <p className="text-gray-700 mb-4">
              For official tax information, please consult:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 mb-4">
              <li>Your country's tax authority website</li>
              <li>Official government tax publications</li>
              <li>Licensed tax professionals in your jurisdiction</li>
              <li>Certified public accountants or tax advisors</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Questions or Concerns</h2>
            <p className="text-gray-700 mb-4">
              If you have questions about this disclaimer or our calculators, please contact us at:{' '}
              <a href="mailto:contact@salarywise.io" className="text-blue-600 hover:underline">
                contact@salarywise.io
              </a>
            </p>
          </section>

          <div className="bg-blue-50 border-l-4 border-blue-400 p-6 mt-8">
            <p className="text-gray-800 font-semibold mb-2">
              Bottom Line
            </p>
            <p className="text-gray-700">
              Use SalaryWise.io as a helpful tool for understanding salary and taxes, but always verify with official sources and consult professionals for important financial decisions.
            </p>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200">
          <Link
            href="/"
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
