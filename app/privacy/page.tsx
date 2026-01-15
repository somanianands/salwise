import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Privacy Policy | SalaryWise.io',
  description: 'Privacy policy for SalaryWise.io - Learn how we protect your data and respect your privacy.',
};

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-white py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">Privacy Policy</h1>

        <div className="prose prose-lg max-w-none">
          <p className="text-gray-600 mb-8">
            <strong>Last Updated:</strong> January 2026
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Commitment to Privacy</h2>
            <p className="text-gray-700 mb-4">
              SalaryWise.io is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your information when you use our salary and tax calculator services.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Information We Collect</h2>
            <p className="text-gray-700 mb-4">
              <strong>Calculator Inputs:</strong> When you use our calculators, we process the salary, tax, and personal information you enter. All calculations are performed locally in your browser or on our servers temporarily. We do not store your personal financial information.
            </p>
            <p className="text-gray-700 mb-4">
              <strong>Analytics Data:</strong> We may collect anonymous usage data including page views, calculator usage, and general browsing behavior to improve our services. This data is aggregated and does not identify individual users.
            </p>
            <p className="text-gray-700 mb-4">
              <strong>Cookies:</strong> We use essential cookies to ensure the website functions properly. We do not use tracking cookies without your consent.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">How We Use Your Information</h2>
            <ul className="list-disc list-inside space-y-2 text-gray-700 mb-4">
              <li>To provide accurate salary and tax calculations</li>
              <li>To improve our calculator functionality and user experience</li>
              <li>To analyze usage patterns and optimize our services</li>
              <li>To ensure the security and proper functioning of our website</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Data Security</h2>
            <p className="text-gray-700 mb-4">
              We implement appropriate technical and organizational measures to protect your data. However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Third-Party Services</h2>
            <p className="text-gray-700 mb-4">
              We may use third-party services for analytics and website functionality. These services have their own privacy policies, and we encourage you to review them.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Rights</h2>
            <p className="text-gray-700 mb-4">
              You have the right to:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 mb-4">
              <li>Access any personal data we hold about you</li>
              <li>Request correction of inaccurate data</li>
              <li>Request deletion of your data</li>
              <li>Opt-out of analytics tracking</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Children's Privacy</h2>
            <p className="text-gray-700 mb-4">
              Our services are not directed to individuals under the age of 18. We do not knowingly collect personal information from children.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Changes to This Policy</h2>
            <p className="text-gray-700 mb-4">
              We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page with an updated "Last Updated" date.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Us</h2>
            <p className="text-gray-700 mb-4">
              If you have any questions about this Privacy Policy, please contact us at:{' '}
              <a href="mailto:contact@salarywise.io" className="text-blue-600 hover:underline">
                contact@salarywise.io
              </a>
            </p>
          </section>
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
