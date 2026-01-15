// Content Loader for Calculator Pages
// Loads content from markdown files and makes it available to pages

import fs from 'fs';
import path from 'path';
import { Country } from './types';

export interface CalculatorContent {
  metaTitle: string;
  metaDescription: string;
  h1: string;
  introduction: string;
  howToUse: string;
  understanding: string;
  examples: string;
  commonQuestions: string;
  faqs: string;
  relatedCalculators: string;
  schema: {
    webPage: object;
    softwareApplication: object;
    faqPage: object;
    breadcrumbList: object;
  };
}

/**
 * Get content for a specific calculator
 * @param country - Country code (e.g., 'us', 'uk')
 * @param calculatorType - Calculator slug (e.g., 'salary-calculator')
 * @returns Calculator content object or null if not found
 */
export function getCalculatorContent(
  country: string,
  calculatorType: string
): CalculatorContent | null {
  try {
    const contentPath = path.join(
      process.cwd(),
      'content',
      `${country}-${calculatorType}.md`
    );

    // Check if content file exists
    if (!fs.existsSync(contentPath)) {
      console.warn(`Content file not found: ${contentPath}`);
      return null;
    }

    // Read markdown file
    const markdown = fs.readFileSync(contentPath, 'utf-8');

    // Parse markdown content into sections
    const content = parseMarkdownContent(markdown);

    return content;
  } catch (error) {
    console.error(`Error loading content for ${country}-${calculatorType}:`, error);
    return null;
  }
}

/**
 * Parse markdown content into structured sections
 */
function parseMarkdownContent(markdown: string): CalculatorContent {
  // Extract meta data
  const metaTitleMatch = markdown.match(/### Meta Title\s*```\s*(.*?)\s*```/s);
  const metaDescMatch = markdown.match(/### Meta Description\s*```\s*(.*?)\s*```/s);
  const h1Match = markdown.match(/## H1 HEADING\s*```\s*(.*?)\s*```/s);

  // Extract content sections - only use --- as boundaries, not headers
  const introMatch = markdown.match(/### Introduction \(Above Calculator\)\s*\n+(.*?)(?=\n---)/s);
  const howToMatch = markdown.match(/### How to Use This Calculator\s*\n+(.*?)(?=\n---)/s);
  const understandingMatch = markdown.match(/### Understanding[^\n]*\s*\n+(.*?)(?=\n---)/s);
  const examplesMatch = markdown.match(/### .*Examples\s*\n+(.*?)(?=\n---)/s);
  const commonQMatch = markdown.match(/### Common Questions\s*\n+(.*?)(?=\n---)/s);
  const faqsMatch = markdown.match(/## Frequently Asked Questions\s*\n+(.*?)(?=\n---)/s);
  const relatedMatch = markdown.match(/## Related Calculators\s*\n+(.*?)(?=\n##\s+JSON-LD SCHEMA)/s);

  // Extract schemas
  const webPageSchema = extractSchema(markdown, 'WebPage Schema');
  const softwareAppSchema = extractSchema(markdown, 'SoftwareApplication Schema');
  const faqPageSchema = extractSchema(markdown, 'FAQPage Schema');
  const breadcrumbSchema = extractSchema(markdown, 'BreadcrumbList Schema');

  return {
    metaTitle: metaTitleMatch?.[1]?.trim() || '',
    metaDescription: metaDescMatch?.[1]?.trim() || '',
    h1: h1Match?.[1]?.trim() || '',
    introduction: introMatch?.[1]?.trim() || '',
    howToUse: howToMatch?.[1]?.trim() || '',
    understanding: understandingMatch?.[1]?.trim() || '',
    examples: examplesMatch?.[1]?.trim() || '',
    commonQuestions: commonQMatch?.[1]?.trim() || '',
    faqs: faqsMatch?.[1]?.trim() || '',
    relatedCalculators: relatedMatch?.[1]?.trim() || '',
    schema: {
      webPage: webPageSchema,
      softwareApplication: softwareAppSchema,
      faqPage: faqPageSchema,
      breadcrumbList: breadcrumbSchema,
    },
  };
}

/**
 * Extract JSON schema from markdown
 */
function extractSchema(markdown: string, schemaName: string): object {
  const regex = new RegExp(`### ${schemaName}\\s*\`\`\`json\\s*({[\\s\\S]*?})\\s*\`\`\``, 'm');
  const match = markdown.match(regex);

  if (match && match[1]) {
    try {
      return JSON.parse(match[1]);
    } catch (error) {
      console.error(`Error parsing ${schemaName}:`, error);
      return {};
    }
  }

  return {};
}

/**
 * Check if content exists for a calculator
 */
export function hasCalculatorContent(country: string, calculatorType: string): boolean {
  const contentPath = path.join(
    process.cwd(),
    'content',
    `${country}-${calculatorType}.md`
  );
  return fs.existsSync(contentPath);
}

/**
 * List all available content files
 */
export function listAvailableContent(): Array<{ country: string; type: string }> {
  const contentDir = path.join(process.cwd(), 'content');

  if (!fs.existsSync(contentDir)) {
    return [];
  }

  const files = fs.readdirSync(contentDir);
  const contentFiles = files
    .filter((file) => file.endsWith('.md'))
    .map((file) => {
      const parts = file.replace('.md', '').split('-');
      const country = parts[0];
      const type = parts.slice(1).join('-');
      return { country, type };
    });

  return contentFiles;
}
