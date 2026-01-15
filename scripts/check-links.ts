#!/usr/bin/env tsx
// Link Checker - Validates all href links in the built UI
import * as fs from 'fs';
import * as path from 'path';
import { parse } from 'node-html-parser';

interface LinkInfo {
  page: string;
  href: string;
  status: 'ok' | 'broken' | 'external' | 'warning';
  reason?: string;
}

interface PageSummary {
  page: string;
  totalLinks: number;
  okLinks: number;
  brokenLinks: number;
  externalLinks: number;
  warnings: number;
}

const OUT_DIR = path.join(__dirname, '..', 'out');
const results: LinkInfo[] = [];
const pageSummaries: PageSummary[] = [];

function getAllHtmlFiles(dir: string): string[] {
  const files: string[] = [];

  function walk(currentPath: string) {
    const entries = fs.readdirSync(currentPath, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(currentPath, entry.name);

      if (entry.isDirectory()) {
        walk(fullPath);
      } else if (entry.isFile() && entry.name.endsWith('.html')) {
        files.push(fullPath);
      }
    }
  }

  walk(dir);
  return files;
}

function extractLinks(htmlFile: string): string[] {
  const content = fs.readFileSync(htmlFile, 'utf-8');
  const root = parse(content);

  const links: string[] = [];

  // Extract all <a href="...">
  const aElements = root.querySelectorAll('a[href]');
  aElements.forEach(el => {
    const href = el.getAttribute('href');
    if (href) links.push(href);
  });

  // Extract all <link href="...">
  const linkElements = root.querySelectorAll('link[href]');
  linkElements.forEach(el => {
    const href = el.getAttribute('href');
    if (href) links.push(href);
  });

  return links;
}

function checkLink(href: string, fromPage: string, outDir: string): LinkInfo {
  const relativePage = path.relative(outDir, fromPage);

  // Skip data: and javascript: URLs
  if (href.startsWith('data:') || href.startsWith('javascript:')) {
    return {
      page: relativePage,
      href,
      status: 'ok',
      reason: 'Data/JS URL - skipped'
    };
  }

  // Handle anchor links
  if (href.startsWith('#')) {
    return {
      page: relativePage,
      href,
      status: 'ok',
      reason: 'Anchor link'
    };
  }

  // Handle external URLs
  if (href.startsWith('http://') || href.startsWith('https://')) {
    return {
      page: relativePage,
      href,
      status: 'external',
      reason: 'External URL - not validated'
    };
  }

  // Handle absolute paths from root
  if (href.startsWith('/')) {
    const targetPath = path.join(outDir, href);

    // Check if it's a directory - should have index.html
    if (fs.existsSync(targetPath) && fs.statSync(targetPath).isDirectory()) {
      const indexPath = path.join(targetPath, 'index.html');
      if (fs.existsSync(indexPath)) {
        return {
          page: relativePage,
          href,
          status: 'ok',
          reason: 'Directory with index.html'
        };
      } else {
        return {
          page: relativePage,
          href,
          status: 'broken',
          reason: 'Directory exists but no index.html'
        };
      }
    }

    // Check if file exists
    if (fs.existsSync(targetPath)) {
      return {
        page: relativePage,
        href,
        status: 'ok'
      };
    }

    // Check if adding .html works
    if (fs.existsSync(targetPath + '.html')) {
      return {
        page: relativePage,
        href,
        status: 'ok',
        reason: 'Resolved to .html'
      };
    }

    // Check if it's a path that should have index.html
    const indexPath = path.join(targetPath, 'index.html');
    if (fs.existsSync(indexPath)) {
      return {
        page: relativePage,
        href,
        status: 'ok',
        reason: 'Resolved to /index.html'
      };
    }

    return {
      page: relativePage,
      href,
      status: 'broken',
      reason: 'File not found'
    };
  }

  // Handle relative paths
  const fromDir = path.dirname(fromPage);
  const targetPath = path.resolve(fromDir, href);

  // Check if it's outside out directory
  if (!targetPath.startsWith(outDir)) {
    return {
      page: relativePage,
      href,
      status: 'warning',
      reason: 'Points outside /out directory'
    };
  }

  if (fs.existsSync(targetPath)) {
    if (fs.statSync(targetPath).isDirectory()) {
      const indexPath = path.join(targetPath, 'index.html');
      if (fs.existsSync(indexPath)) {
        return {
          page: relativePage,
          href,
          status: 'ok',
          reason: 'Directory with index.html'
        };
      } else {
        return {
          page: relativePage,
          href,
          status: 'broken',
          reason: 'Directory exists but no index.html'
        };
      }
    }

    return {
      page: relativePage,
      href,
      status: 'ok'
    };
  }

  return {
    page: relativePage,
    href,
    status: 'broken',
    reason: 'File not found'
  };
}

console.log('🔍 Starting Link Checker...\n');
console.log(`Scanning directory: ${OUT_DIR}\n`);

// Get all HTML files
const htmlFiles = getAllHtmlFiles(OUT_DIR);
console.log(`Found ${htmlFiles.length} HTML files\n`);

// Process each file
for (const htmlFile of htmlFiles) {
  const relativePath = path.relative(OUT_DIR, htmlFile);
  const links = extractLinks(htmlFile);

  let okCount = 0;
  let brokenCount = 0;
  let externalCount = 0;
  let warningCount = 0;

  for (const href of links) {
    const linkInfo = checkLink(href, htmlFile, OUT_DIR);
    results.push(linkInfo);

    switch (linkInfo.status) {
      case 'ok': okCount++; break;
      case 'broken': brokenCount++; break;
      case 'external': externalCount++; break;
      case 'warning': warningCount++; break;
    }
  }

  pageSummaries.push({
    page: relativePath,
    totalLinks: links.length,
    okLinks: okCount,
    brokenLinks: brokenCount,
    externalLinks: externalCount,
    warnings: warningCount
  });
}

// Generate Report
console.log('═══════════════════════════════════════════════════════════════');
console.log('                      LINK CHECKER REPORT                       ');
console.log('═══════════════════════════════════════════════════════════════\n');

// Overall Statistics
const totalLinks = results.length;
const okLinks = results.filter(r => r.status === 'ok').length;
const brokenLinks = results.filter(r => r.status === 'broken').length;
const externalLinks = results.filter(r => r.status === 'external').length;
const warnings = results.filter(r => r.status === 'warning').length;

console.log('📊 OVERALL STATISTICS\n');
console.log(`  Total Links Checked:  ${totalLinks}`);
console.log(`  ✅ OK:                ${okLinks} (${((okLinks/totalLinks)*100).toFixed(1)}%)`);
console.log(`  ❌ Broken:            ${brokenLinks} (${((brokenLinks/totalLinks)*100).toFixed(1)}%)`);
console.log(`  🌐 External:          ${externalLinks} (${((externalLinks/totalLinks)*100).toFixed(1)}%)`);
console.log(`  ⚠️  Warnings:          ${warnings} (${((warnings/totalLinks)*100).toFixed(1)}%)`);
console.log();

// Broken Links Report
if (brokenLinks > 0) {
  console.log('❌ BROKEN LINKS (404 Errors)\n');
  const broken = results.filter(r => r.status === 'broken');

  // Group by page
  const brokenByPage = broken.reduce((acc, link) => {
    if (!acc[link.page]) acc[link.page] = [];
    acc[link.page].push(link);
    return acc;
  }, {} as Record<string, LinkInfo[]>);

  for (const [page, links] of Object.entries(brokenByPage)) {
    console.log(`  📄 ${page}`);
    for (const link of links) {
      console.log(`     → ${link.href}`);
      if (link.reason) console.log(`        Reason: ${link.reason}`);
    }
    console.log();
  }
} else {
  console.log('✅ NO BROKEN LINKS FOUND!\n');
}

// Warnings Report
if (warnings > 0) {
  console.log('⚠️  WARNINGS\n');
  const warningLinks = results.filter(r => r.status === 'warning');

  for (const link of warningLinks.slice(0, 10)) {
    console.log(`  📄 ${link.page}`);
    console.log(`     → ${link.href}`);
    if (link.reason) console.log(`        Reason: ${link.reason}`);
    console.log();
  }

  if (warningLinks.length > 10) {
    console.log(`  ... and ${warningLinks.length - 10} more warnings\n`);
  }
}

// Per-Page Summary
console.log('📑 PER-PAGE SUMMARY\n');
console.log('  Pages with Issues:\n');

const pagesWithIssues = pageSummaries.filter(p => p.brokenLinks > 0 || p.warnings > 0);

if (pagesWithIssues.length > 0) {
  for (const page of pagesWithIssues) {
    console.log(`  📄 ${page.page}`);
    console.log(`     Total: ${page.totalLinks} | OK: ${page.okLinks} | Broken: ${page.brokenLinks} | External: ${page.externalLinks} | Warnings: ${page.warnings}`);
  }
} else {
  console.log('  ✅ All pages have valid links!');
}

console.log();

// Top Pages by Link Count
console.log('📈 TOP 10 PAGES BY LINK COUNT\n');
const topPages = [...pageSummaries].sort((a, b) => b.totalLinks - a.totalLinks).slice(0, 10);
for (const page of topPages) {
  console.log(`  ${page.totalLinks.toString().padStart(3)} links - ${page.page}`);
}

console.log();

// External Links Summary
if (externalLinks > 0) {
  console.log('🌐 EXTERNAL LINKS (Not Validated)\n');
  const external = results.filter(r => r.status === 'external');
  const uniqueExternal = [...new Set(external.map(e => e.href))];

  console.log(`  Found ${uniqueExternal.length} unique external domains:\n`);

  for (const href of uniqueExternal.slice(0, 20)) {
    const count = external.filter(e => e.href === href).length;
    console.log(`  ${count}x ${href}`);
  }

  if (uniqueExternal.length > 20) {
    console.log(`  ... and ${uniqueExternal.length - 20} more external links`);
  }
}

console.log();
console.log('═══════════════════════════════════════════════════════════════');

// Exit code
if (brokenLinks > 0) {
  console.log(`\n❌ Link check FAILED: ${brokenLinks} broken links found\n`);
  process.exit(1);
} else {
  console.log(`\n✅ Link check PASSED: All internal links are valid!\n`);
  process.exit(0);
}
