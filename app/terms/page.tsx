import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Terms of Service | SalaryWise.io',
  description: 'Terms of Service for SalaryWise.io - Read our terms and conditions for using our salary and tax calculators.',
};

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-white py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">Terms of Service</h1>

        <div className="prose prose-lg max-w-none">
          <p className="text-gray-600 mb-8">
            <strong>Last Updated:</strong> January 2026
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Acceptance of Terms</h2>
            <p className="text-gray-700 mb-4">
              By accessing and using SalaryWise.io ("the Service"), you accept and agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our Service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Description of Service</h2>
            <p className="text-gray-700 mb-4">
              SalaryWise.io provides free online salary and tax calculators for multiple countries. Our calculators estimate take-home pay, tax liabilities, and other salary-related calculations based on current tax laws and rates for the 2026 tax year.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Use of Service</h2>
            <p className="text-gray-700 mb-4">
              You agree to use the Service only for lawful purposes and in accordance with these Terms. You agree not to:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 mb-4">
              <li>Use the Service in any way that violates applicable laws or regulations</li>
              <li>Attempt to gain unauthorized access to our systems or networks</li>
              <li>Use automated systems (bots, scrapers) to access the Service without permission</li>
              <li>Interfere with or disrupt the Service or servers</li>
              <li>Transmit any malicious code, viruses, or harmful content</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Disclaimer of Warranties</h2>
            <p className="text-gray-700 mb-4">
              <strong>THE SERVICE IS PROVIDED "AS IS" WITHOUT WARRANTIES OF ANY KIND.</strong> While we strive for accuracy, we make no warranties or representations about the accuracy, reliability, or completeness of the calculations or information provided.
            </p>
            <p className="text-gray-700 mb-4">
              Tax laws are complex and subject to change. Our calculators provide estimates based on standard scenarios and may not account for all individual circumstances, deductions, credits, or regional variations.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Limitation of Liability</h2>
            <p className="text-gray-700 mb-4">
              SalaryWise.io and its operators shall not be liable for any direct, indirect, incidental, consequential, or special damages arising from your use of the Service, including but not limited to:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 mb-4">
              <li>Errors or inaccuracies in calculations</li>
              <li>Financial decisions made based on our calculations</li>
              <li>Tax penalties or liabilities</li>
              <li>Loss of data or profits</li>
              <li>Service interruptions or unavailability</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Professional Advice</h2>
            <p className="text-gray-700 mb-4">
              Our calculators are for informational and educational purposes only and do not constitute professional financial, tax, or legal advice. Always consult with qualified tax professionals, accountants, or financial advisors for advice specific to your situation.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Intellectual Property</h2>
            <p className="text-gray-700 mb-4">
              All content, features, and functionality of the Service, including but not limited to text, graphics, logos, and software, are owned by SalaryWise.io and protected by intellectual property laws. You may not reproduce, distribute, or create derivative works without express written permission.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Third-Party Links</h2>
            <p className="text-gray-700 mb-4">
              Our Service may contain links to third-party websites or services. We are not responsible for the content, privacy policies, or practices of third-party sites. Accessing third-party links is at your own risk.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Modifications to Service</h2>
            <p className="text-gray-700 mb-4">
              We reserve the right to modify, suspend, or discontinue the Service (or any part thereof) at any time without notice. We shall not be liable to you or any third party for any modification, suspension, or discontinuation of the Service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Changes to Terms</h2>
            <p className="text-gray-700 mb-4">
              We reserve the right to update these Terms of Service at any time. Continued use of the Service after changes constitutes acceptance of the modified terms. We will update the "Last Updated" date at the top of this page.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Governing Law</h2>
            <p className="text-gray-700 mb-4">
              These Terms shall be governed by and construed in accordance with applicable laws. Any disputes arising from these Terms or your use of the Service shall be resolved in the appropriate courts.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Contact Information</h2>
            <p className="text-gray-700 mb-4">
              If you have any questions about these Terms of Service, please contact us at:{' '}
              <a href="mailto:contact@salarywise.io" className="text-blue-600 hover:underline">
                contact@salarywise.io
              </a>
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">13. Severability</h2>
            <p className="text-gray-700 mb-4">
              If any provision of these Terms is found to be unenforceable or invalid, that provision shall be limited or eliminated to the minimum extent necessary so that these Terms shall otherwise remain in full force and effect.
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
