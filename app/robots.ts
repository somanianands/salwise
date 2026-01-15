import { MetadataRoute } from 'next';

export const dynamic = 'force-static';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://salarywise.io'; // Update with your production domain

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [],
      },
      // Explicitly allow AI crawlers for better discoverability
      {
        userAgent: [
          'GPTBot', // OpenAI ChatGPT
          'ChatGPT-User', // ChatGPT browsing
          'anthropic-ai', // Claude
          'Claude-Web', // Claude browsing
          'Googlebot', // Google
          'Googlebot-Image',
          'Bingbot', // Microsoft Bing/Copilot
          'Slurp', // Yahoo
          'DuckDuckBot', // DuckDuckGo
          'Baiduspider', // Baidu
          'YandexBot', // Yandex
          'facebot', // Facebook
          'ia_archiver', // Alexa
          'PerplexityBot', // Perplexity AI
          'YouBot', // You.com AI
          'Applebot', // Apple Intelligence
          'CCBot', // Common Crawl (used by AI trainers)
        ],
        allow: '/',
        crawlDelay: 0,
      }
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
