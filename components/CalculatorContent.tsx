// Calculator Content Display Component
// Renders rich content for calculator pages

'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface CalculatorContentProps {
  content: {
    introduction: string;
    howToUse: string;
    understanding: string;
    examples: string;
    commonQuestions: string;
    faqs: string;
    relatedCalculators: string;
  };
  country: string;
  calculatorName: string;
}

export default function CalculatorContent({ content, country, calculatorName }: CalculatorContentProps) {
  return (
    <div className="mt-12 space-y-8">
      {/* How to Use Section */}
      {content.howToUse && (
        <section className="bg-white rounded-lg p-8 border border-gray-200 shadow-sm">
          <div className="prose prose-lg prose-blue max-w-none">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {content.howToUse}
            </ReactMarkdown>
          </div>
        </section>
      )}

      {/* Understanding Section */}
      {content.understanding && (
        <section className="bg-white rounded-lg p-8 border border-gray-200 shadow-sm">
          <div className="prose prose-lg prose-blue max-w-none">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {content.understanding}
            </ReactMarkdown>
          </div>
        </section>
      )}

      {/* Examples Section */}
      {content.examples && (
        <section className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-8 border border-blue-200 shadow-sm">
          <div className="prose prose-lg prose-blue max-w-none">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {content.examples}
            </ReactMarkdown>
          </div>
        </section>
      )}

      {/* Common Questions Section */}
      {content.commonQuestions && (
        <section className="bg-white rounded-lg p-8 border border-gray-200 shadow-sm">
          <div className="prose prose-lg prose-blue max-w-none">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {content.commonQuestions}
            </ReactMarkdown>
          </div>
        </section>
      )}

      {/* FAQs Section */}
      {content.faqs && (
        <section className="bg-white rounded-lg p-8 border border-gray-200 shadow-sm">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Frequently Asked Questions
          </h2>
          <div className="prose prose-lg prose-blue max-w-none">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {content.faqs}
            </ReactMarkdown>
          </div>
        </section>
      )}

      {/* Related Calculators Section */}
      {content.relatedCalculators && (
        <section className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-8 border border-gray-200 shadow-sm">
          <div className="prose prose-lg prose-blue max-w-none">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {content.relatedCalculators}
            </ReactMarkdown>
          </div>
        </section>
      )}
    </div>
  );
}
