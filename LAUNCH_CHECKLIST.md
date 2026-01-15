# SalaryWise.io - Launch Checklist

**Domain:** salarywise.io
**First Calculator:** US Salary Calculator
**Status:** Ready to Launch
**Date:** January 14, 2026

---

## ✅ Pre-Launch Checklist

### 1. Calculator Functionality (Already Done ✅)
- [x] All 160 calculator pages functional
- [x] US Salary Calculator working
- [x] Tax calculations accurate
- [x] All input fields correct
- [x] Realistic default values
- [x] Mobile responsive

### 2. Content Ready (Already Done ✅)
- [x] US Salary Calculator content written (~3,400 words)
- [x] Domain updated to salarywise.io
- [x] Site name set to SalaryWise
- [x] 12 FAQs written
- [x] 4 salary examples included
- [x] All schema markup ready

### 3. Before Deploying (TODO)

#### Update Next.js App:
- [ ] Add content to calculator page component
- [ ] Implement schema markup in `<head>`
- [ ] Add meta title and description
- [ ] Add breadcrumb navigation
- [ ] Add internal links section

#### Technical Setup:
- [ ] Verify domain is live (salarywise.io)
- [ ] SSL certificate active (HTTPS)
- [ ] robots.txt allows crawling
- [ ] Sitemap.xml includes calculator pages
- [ ] Google Search Console set up

#### Content Placement:
- [ ] Content appears BELOW calculator (not above)
- [ ] Calculator is first thing users see
- [ ] Sections use proper HTML headings (H2, H3)
- [ ] Tables render correctly
- [ ] Internal links work

### 4. Post-Launch (Day 1)

#### Validation:
- [ ] Page loads in < 3 seconds
- [ ] Mobile version works perfectly
- [ ] Schema validates (Google Rich Results Test)
- [ ] All internal links work
- [ ] Calculator functions correctly
- [ ] No JavaScript errors (check console)

#### SEO:
- [ ] Submit URL to Google Search Console
- [ ] Request indexing
- [ ] Check robots.txt isn't blocking
- [ ] Verify sitemap includes page
- [ ] Test meta title/description display

#### Analytics:
- [ ] Google Analytics tracking code installed
- [ ] Events set up for calculator usage
- [ ] Conversion tracking configured

### 5. Week 1 Monitoring

- [ ] Check indexing status (Search Console)
- [ ] Monitor Core Web Vitals
- [ ] Review any crawl errors
- [ ] Test on multiple devices
- [ ] Check page load speed

---

## 📝 Content Implementation Guide

### Where to Add Content in Next.js

**File:** `app/calculators/[country]/[type]/page.tsx`

**Structure:**
```jsx
export default function CalculatorPage() {
  return (
    <>
      {/* Head with meta & schema */}
      <Head>
        <title>Meta Title Here</title>
        <meta name="description" content="Meta Description Here" />
        <script type="application/ld+json">{JSON.stringify(schema)}</script>
      </Head>

      {/* Page Content */}
      <div className="container">
        {/* 1. Breadcrumbs */}
        <Breadcrumbs />

        {/* 2. H1 Heading */}
        <h1>United States Salary Calculator 2024 - Calculate Your Take-Home Pay</h1>

        {/* 3. Introduction (Short, above calculator) */}
        <section className="intro">
          {/* ~100-150 words from content file */}
        </section>

        {/* 4. CALCULATOR COMPONENT (Most Important - Top) */}
        <SalaryCalculator country="us" mode="gross-to-net" />

        {/* 5. All Content Sections BELOW Calculator */}
        <article className="content">
          {/* How to Use */}
          <section id="how-to-use">
            <h2>How to Use the US Salary Calculator</h2>
            {/* Content from file */}
          </section>

          {/* Understanding Taxes */}
          <section id="understanding-taxes">
            <h2>Understanding Your US Salary and Taxes</h2>
            {/* Content from file */}
          </section>

          {/* Salary Examples */}
          <section id="examples">
            <h2>US Salary Examples: What You'll Actually Take Home</h2>
            {/* Content from file */}
          </section>

          {/* Common Questions */}
          <section id="common-questions">
            <h2>Common Questions About US Salaries</h2>
            {/* Content from file */}
          </section>

          {/* FAQs */}
          <section id="faqs">
            <h2>Frequently Asked Questions</h2>
            {/* Content from file */}
          </section>

          {/* Related Calculators */}
          <section id="related">
            <h2>Related Calculators</h2>
            {/* Internal links from file */}
          </section>
        </article>
      </div>
    </>
  )
}
```

---

## 📊 Schema Implementation

### Add to `<head>` tag:

```jsx
<script type="application/ld+json">
  {JSON.stringify({
    "@context": "https://schema.org",
    "@graph": [
      webPageSchema,
      softwareApplicationSchema,
      faqPageSchema,
      breadcrumbListSchema
    ]
  })}
</script>
```

**Copy all 4 schemas from:** `content/us-salary-calculator.md`

---

## 🔍 Testing Checklist

### Before Going Live:

**Functionality:**
- [ ] Calculator loads instantly
- [ ] Enter $75,000 → See results
- [ ] Change state → Tax updates
- [ ] Try 401(k) deduction → Tax reduces
- [ ] Mobile version works

**Content:**
- [ ] All headings render (H1, H2, H3)
- [ ] Tables display correctly
- [ ] Links work (click internal links)
- [ ] No broken images
- [ ] No lorem ipsum text

**SEO:**
- [ ] View page source → See meta title
- [ ] View page source → See meta description
- [ ] View page source → See schema markup
- [ ] Title shows in browser tab
- [ ] Description shows in Google preview

**Performance:**
- [ ] PageSpeed Insights score > 90
- [ ] Lighthouse SEO score 100
- [ ] First Contentful Paint < 1.5s
- [ ] Time to Interactive < 3s
- [ ] No JavaScript errors in console

---

## 🚀 Launch Day Tasks

### Morning:
1. Final code review
2. Test on staging
3. Deploy to production
4. Verify live site loads

### Afternoon:
5. Submit to Google Search Console
6. Request indexing
7. Share on social media (optional)
8. Monitor analytics

### Evening:
9. Check for any errors
10. Review first day traffic
11. Celebrate! 🎉

---

## 📈 Success Metrics (Week 1)

**Day 1:**
- [ ] Page indexed by Google
- [ ] 0 crawl errors
- [ ] Page loads < 3 seconds
- [ ] 10-50 impressions in Search Console

**Day 7:**
- [ ] 50-200 impressions
- [ ] 1-10 clicks
- [ ] Calculator used 5-20 times
- [ ] No bounce rate over 80%

---

## 🎯 Next Calculators to Launch

After US Salary Calculator is live and stable:

**Week 1:**
1. UK Salary Calculator
2. IE Salary Calculator
3. US Hourly to Salary Calculator

**Week 2-3:**
4. US Overtime Pay Calculator
5. US Bonus Tax Calculator
6. UK Hourly to Salary Calculator

**Week 4:**
7. Continue with high-priority calculators
8. Monitor performance of first batch
9. Optimize based on data

---

## ⚠️ Important Notes

### Don't Forget:
- ✅ Calculator must be ABOVE content (users see it first)
- ✅ Content is supporting material, not the main feature
- ✅ Keep introduction SHORT (100-150 words max above calculator)
- ✅ Most content goes BELOW calculator
- ✅ Mobile experience is critical (60%+ of traffic)

### Common Mistakes to Avoid:
- ❌ Putting too much text before calculator
- ❌ Making calculator hard to find
- ❌ Forgetting to add schema markup
- ❌ Not testing on mobile
- ❌ Launching without sitemap
- ❌ Not submitting to Search Console

---

## 🎓 Resources

**Your Files:**
- Content: `content/us-salary-calculator.md`
- Standard: `CONTENT_STANDARD_PRODUCTION.md`
- Guide: `CONTENT_IMPLEMENTATION_GUIDE.md`
- Domain Info: `DOMAIN_UPDATED.md`

**Testing Tools:**
- Google Rich Results Test: https://search.google.com/test/rich-results
- PageSpeed Insights: https://pagespeed.web.dev/
- Mobile-Friendly Test: https://search.google.com/test/mobile-friendly
- Schema Validator: https://validator.schema.org/

**Google Tools:**
- Search Console: https://search.google.com/search-console
- Analytics: https://analytics.google.com
- Tag Manager: https://tagmanager.google.com

---

## ✅ Final Status

**Calculator Built:** ✅ Yes (160 pages functional)
**Content Written:** ✅ Yes (US Salary Calculator ready)
**Domain Set:** ✅ salarywise.io
**Schema Ready:** ✅ All 4 types
**Ready to Deploy:** ✅ YES!

---

**You're ready to launch! 🚀**

**First step:** Add content to your Next.js page and deploy.
**Need help?** Reference the implementation guide or ask questions.

**Good luck with the launch!**
