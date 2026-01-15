import type { Metadata } from 'next';
import Link from 'next/link';
import { Mail, MessageSquare, Globe } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Contact Us | SalaryWise.io',
  description: 'Get in touch with SalaryWise.io - We\'re here to help with your salary calculation questions.',
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-white py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Contact Us</h1>
          <p className="text-lg text-gray-600">
            We'd love to hear from you! Get in touch with any questions, feedback, or suggestions.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {/* Email Contact */}
          <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Email Us</h3>
            <p className="text-sm text-gray-600 mb-3">
              For general inquiries and support
            </p>
            <a
              href="mailto:contact@salarywise.io"
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              contact@salarywise.io
            </a>
          </div>

          {/* Feedback */}
          <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageSquare className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Feedback</h3>
            <p className="text-sm text-gray-600 mb-3">
              Share your suggestions and ideas
            </p>
            <a
              href="mailto:feedback@salarywise.io"
              className="text-green-600 hover:text-green-700 font-medium"
            >
              feedback@salarywise.io
            </a>
          </div>

          {/* Website */}
          <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Globe className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Visit Us</h3>
            <p className="text-sm text-gray-600 mb-3">
              Explore our calculators
            </p>
            <Link
              href="/"
              className="text-purple-600 hover:text-purple-700 font-medium"
            >
              salarywise.io
            </Link>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-8 rounded-lg border border-blue-200 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Get in Touch</h2>
          <div className="space-y-4 text-gray-700">
            <p>
              <strong>General Inquiries:</strong> For questions about our calculators, tax rates, or
              how to use our services, email us at{' '}
              <a href="mailto:contact@salarywise.io" className="text-blue-600 hover:underline">
                contact@salarywise.io
              </a>
            </p>
            <p>
              <strong>Technical Support:</strong> Experiencing issues with our calculators? Let us know
              so we can help resolve them quickly.
            </p>
            <p>
              <strong>Feature Requests:</strong> Have ideas for new calculators or features? We're
              always looking to improve! Send your suggestions to{' '}
              <a href="mailto:feedback@salarywise.io" className="text-blue-600 hover:underline">
                feedback@salarywise.io
              </a>
            </p>
            <p>
              <strong>Business Partnerships:</strong> Interested in partnering with us? Reach out
              to discuss collaboration opportunities.
            </p>
          </div>
        </div>

        {/* FAQ Reference */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-3">Before You Contact Us</h2>
          <p className="text-gray-700 mb-4">
            You might find answers to common questions in our FAQ section. Check out our{' '}
            <Link href="/#faq" className="text-blue-600 hover:underline font-medium">
              Frequently Asked Questions
            </Link>
            {' '}to see if your question is already answered.
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="border-l-4 border-blue-500 pl-4">
              <h3 className="font-semibold text-gray-900 mb-1">Popular Topics:</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• How accurate are the calculations?</li>
                <li>• Which countries are supported?</li>
                <li>• Is my data secure?</li>
                <li>• How often are tax rates updated?</li>
              </ul>
            </div>
            <div className="border-l-4 border-green-500 pl-4">
              <h3 className="font-semibold text-gray-900 mb-1">Quick Links:</h3>
              <ul className="text-sm space-y-1">
                <li>
                  <Link href="/" className="text-blue-600 hover:underline">
                    • Home - Select Your Country
                  </Link>
                </li>
                <li>
                  <Link href="/#about" className="text-blue-600 hover:underline">
                    • About SalaryWise.io
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="text-blue-600 hover:underline">
                    • Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="text-blue-600 hover:underline">
                    • Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Response Time Notice */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600">
            We typically respond to all inquiries within 24-48 hours during business days.
            Thank you for your patience!
          </p>
        </div>

        {/* Back to Home */}
        <div className="mt-8 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
