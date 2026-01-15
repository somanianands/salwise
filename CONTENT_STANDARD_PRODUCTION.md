# SalaryWise Calculator Content Standard (PRODUCTION)

**Version:** 2.0
**Status:** ✅ Production Ready
**Last Updated:** January 14, 2026

---

## 🎯 Content Requirements

### Word Count Target
- **Minimum:** 2,500 words
- **Target:** 3,000-3,500 words
- **Maximum:** 4,000 words

**Why:** Balance between SEO depth and user engagement. Calculator-first, explanation-second.

---

## ⚠️ CRITICAL RULES (DO NOT VIOLATE)

### 1. ❌ NO Fake Ratings
**NEVER include AggregateRating schema unless:**
- You have real user reviews
- Reviews are displayed visibly on the page
- You can verify review authenticity

### 2. ❌ NO Visible Keyword Lists
**NEVER publish keyword lists in HTML:**
- Keep keywords in planning docs only
- Do NOT render on page
- Google penalizes keyword stuffing

### 3. ✅ Dynamic Year Handling
**NEVER hard-code years in content:**
- Use: "Updated for {CURRENT_YEAR}"
- Use: "latest IRS tax rules"
- Update tax tables via data, not content rewrites

### 4. ✅ Domain Consistency
**Schema URLs MUST match live domain exactly:**
- If domain is `salarywise.io`, use that everywhere
- Never mix domains in schema
- Validate all URLs before publishing

### 5. ✅ Finance Safety (YMYL)
**Always include:**
- Clear assumptions
- Real examples with numbers
- "Estimated" or "Approximately" for calculations
- No guarantees or legal advice disclaimers

---

## 📋 Required Content Sections

### Section 1: Meta Data
**Position:** HTML `<head>` tag

```html
<title>{Country} {Calculator Type} {YEAR} | Free Tax & Take-Home Pay Calculator</title>
<meta name="description" content="{150-160 char description with main keyword and CTA}">
```

**Requirements:**
- Title: 55-60 characters
- Description: 150-160 characters
- Include: Country, calculator type, year, "free"
- CTA in description: "Calculate your..." or "See your..."

---

### Section 2: H1 Heading
**Position:** Top of page, above calculator

```html
<h1>{Country} {Calculator Type} {YEAR} - Calculate Your Take-Home Pay</h1>
```

**Requirements:**
- Include: Country, calculator type, year
- Action-oriented: "Calculate Your..."
- One H1 per page

---

### Section 3: Introduction (Above Calculator)
**Position:** Immediately below H1, above calculator widget
**Length:** 100-150 words
**Format:** Markdown H2

**Structure:**
1. What this calculator does (1 sentence)
2. Key features (3-5 bullet points)
3. Who it's for (1 sentence)

**Example:**
```markdown
## Calculate Your {Country} Salary After Taxes

Quickly calculate your take-home pay with our free {Country} salary calculator for {YEAR}. Enter your annual salary to see how much you'll actually earn after [country-specific taxes].

**Key Features:**
- ✅ Accurate {YEAR} tax brackets
- ✅ [Country-specific feature 1]
- ✅ [Country-specific feature 2]
- ✅ Instant breakdown by annual, monthly, weekly, and hourly rates
```

---

### Section 4: How to Use This Calculator
**Position:** Below calculator
**Length:** 300-400 words
**Format:** Markdown H2 with H3 subsections

**Required Subsections:**
1. Step-by-Step Guide (numbered list, 4-6 steps)
2. What You'll See (bullet list of outputs)

**Example Structure:**
```markdown
## How to Use the {Country} {Calculator Type}

### Step-by-Step Guide:

1. **Enter Your [Input Field]**
   - Brief explanation
   - Example: $75,000, $100,000

2. **Select [Optional Field]** (if applicable)
   - Brief explanation
   - Impact on results

3. **Add Deductions** (Optional)
   - List deduction types
   - Brief explanation each

4. **View Your Results**
   - What calculations are shown
   - How to interpret results

### What You'll See:

- **Output 1:** Description
- **Output 2:** Description
- **Output 3:** Description
```

---

### Section 5: Understanding [Country] Taxes
**Position:** After "How to Use"
**Length:** 800-1,200 words
**Format:** Markdown H2 with H3 subsections for each tax type

**Required Subsections:**
1. Primary tax (e.g., Federal Income Tax, Income Tax)
2. Secondary tax (e.g., Social Security, National Insurance)
3. Regional variations (if applicable)
4. Deductions/allowances

**Structure for Each Tax:**
- Brief explanation (1-2 sentences)
- Tax rates/brackets (table format)
- Example calculation
- Important notes

**Example:**
```markdown
## Understanding Your {Country} Salary and Taxes

### [Primary Tax Name] ({YEAR})

Brief explanation of progressive/flat tax system.

| Tax Rate | Income Range |
|----------|--------------|
| XX% | $X - $Y |
| XX% | $Y - $Z |

**Important:** [Key note about this tax]

**Example:**
- Salary: $75,000
- Tax calculation: [breakdown]
- Total tax: $X,XXX

### [Secondary Tax Name]

- **Rate:** X% of gross income
- **Cap/Limit:** $XXX,XXX (if applicable)
- **What It Funds:** Brief description

**Example:** On $75,000 salary = $X,XXX/year
```

---

### Section 6: Salary Examples (Real-World Scenarios)
**Position:** After tax breakdown
**Length:** 600-800 words
**Format:** Markdown H2 with H3 for each example

**Requirements:**
- **Minimum:** 3 examples
- **Recommended:** 4-5 examples
- **Coverage:** Entry-level to executive salaries
- **Variations:** Include different regions/states if applicable

**Example Structure:**
```markdown
## {Country} Salary Examples: What You'll Actually Take Home

### Example 1: $XX,XXX Salary (Entry-Level)
**Location:** [City/State/Region if applicable]

- **Gross Annual Salary:** $XX,XXX
- **[Tax 1]:** ~$X,XXX
- **[Tax 2]:** $X,XXX
- **[Tax 3]:** $XXX
- **Total Taxes:** $X,XXX
- **Take-Home Pay:** $XX,XXX/year ($X,XXX/month)
- **Effective Tax Rate:** XX.X%

---

### Example 2: $XX,XXX Salary (Mid-Level)
[Same structure]

[Repeat for 3-5 examples covering range]
```

---

### Section 7: Common Questions (Short Q&A)
**Position:** After examples
**Length:** 400-600 words
**Format:** Markdown H2 with H3 for each question

**Requirements:**
- 4-6 common questions
- Short answers (2-4 sentences each)
- Not same as FAQs (these are briefer)

**Topics to Cover:**
- How much is taken out of paycheck
- Gross vs net explanation
- How to reduce taxes
- Regional variations
- Common deductions

**Example:**
```markdown
## Common Questions About {Country} Salaries

### How much is taken out of my paycheck?

For most [country] workers, approximately XX-XX% of gross salary goes to taxes:
- **[Tax 1]:** XX-XX% (details)
- **[Tax 2]:** X.X% (details)
- **[Tax 3]:** X-XX% (if applicable)

### What is gross vs net salary?

- **Gross Salary:** Your salary before any deductions
- **Net Salary (Take-Home Pay):** What actually goes into your bank account

**Example:**
- Gross: $80,000/year
- Net: ~$XX,000/year (after ~$XX,000 in taxes)
```

---

### Section 8: FAQs (Detailed)
**Position:** After Common Questions
**Length:** 1,200-1,600 words
**Format:** Markdown H2, with questions as paragraphs or H3s

**Requirements:**
- **Minimum:** 8 FAQs
- **Recommended:** 10-12 FAQs
- **Length per FAQ:** 80-150 words
- **Must include:** Example numbers, calculations, or tables where relevant

**FAQ Categories:**
1. Calculator accuracy/usage (1-2 FAQs)
2. Tax concepts/definitions (2-3 FAQs)
3. Calculation methods (2-3 FAQs)
4. Regional differences (1-2 FAQs)
5. Optimization/deductions (2-3 FAQs)

**Example Structure:**
```markdown
## Frequently Asked Questions

### FAQ 1: [Question matching user search intent]

**Answer:** [Comprehensive answer with:]
- Clear explanation
- Example with numbers
- Important notes or caveats
- "Tip:" or "Note:" callouts if helpful

[150 words max per FAQ]

---

### FAQ 2: [Next question]
[Same structure]
```

---

## 🔗 Internal Linking Requirements

### Minimum Links: 6
### Recommended Links: 8-10
### Maximum Links: 12

**Link Categories:**

1. **Related Calculators (Same Country):** 3-5 links
   - Different calculator types for same country
   - Example: Hourly, Overtime, Bonus calculators

2. **Same Calculator (Other Countries):** 2-3 links
   - Same calculator type, different countries
   - Prioritize: US, UK, Canada, Australia

3. **Country Overview:** 1 link
   - Link to `/calculators/{country}` page

**Placement:**
- At end of content in dedicated section
- Natural in-content links (1-2) where relevant
- "Related Calculators" section at bottom

**Format:**
```markdown
## Related Calculators

### Other {Country} Calculators:
1. [{Country} {Calculator Type}](/calculators/{country}/{type}) - Brief description
2. [{Country} {Calculator Type}](/calculators/{country}/{type}) - Brief description
[3-5 total]

### Same Calculator, Other Countries:
1. [{Country} {Calculator Type}](/calculators/{country}/{type})
2. [{Country} {Calculator Type}](/calculators/{country}/{type})
[2-3 total]
```

---

## 📊 Schema Markup Requirements

### Required Schemas (4):
1. WebPage
2. SoftwareApplication
3. FAQPage
4. BreadcrumbList

### ❌ PROHIBITED:
- AggregateRating (unless you have real reviews)
- Organization (unless you have complete business info)
- Author/Person (unless you have real author profiles)

---

### Schema 1: WebPage (Required)
```json
{
  "@context": "https://schema.org",
  "@type": "WebPage",
  "name": "{Country} {Calculator Type} {YEAR}",
  "description": "{Meta description}",
  "url": "https://{YOUR_DOMAIN}/calculators/{country}/{type}",
  "inLanguage": "en-US",
  "datePublished": "{YYYY-MM-DD}",
  "dateModified": "{YYYY-MM-DD}",
  "about": {
    "@type": "Thing",
    "name": "Salary Calculation",
    "description": "{Country} tax calculation for {calculator type}"
  },
  "mainEntityOfPage": {
    "@type": "WebPage",
    "@id": "https://{YOUR_DOMAIN}/calculators/{country}/{type}"
  },
  "publisher": {
    "@type": "Organization",
    "name": "{YOUR_SITE_NAME}",
    "url": "https://{YOUR_DOMAIN}"
  }
}
```

---

### Schema 2: SoftwareApplication (Required)
```json
{
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "{Country} {Calculator Type} {YEAR}",
  "applicationCategory": "FinanceApplication",
  "operatingSystem": "Web Browser",
  "isAccessibleForFree": true,
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  },
  "featureList": [
    "{YEAR} Tax Brackets",
    "{Country-specific feature 1}",
    "{Country-specific feature 2}",
    "Instant Results",
    "No Registration Required"
  ]
}
```

**❌ DO NOT INCLUDE AggregateRating unless you have real reviews displayed on page.**

---

### Schema 3: FAQPage (Required)
```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "[Question text]",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "[Answer text - use plain text, no HTML]"
      }
    }
    // Minimum 8, recommended 10-12
  ]
}
```

**Requirements:**
- Minimum 8 questions
- Plain text answers (no HTML tags)
- Match FAQ section exactly
- Use most common user questions

---

### Schema 4: BreadcrumbList (Required)
```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": "https://{YOUR_DOMAIN}"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "Calculators",
      "item": "https://{YOUR_DOMAIN}/calculators"
    },
    {
      "@type": "ListItem",
      "position": 3,
      "name": "{Country Name}",
      "item": "https://{YOUR_DOMAIN}/calculators/{country}"
    },
    {
      "@type": "ListItem",
      "position": 4,
      "name": "{Calculator Type}",
      "item": "https://{YOUR_DOMAIN}/calculators/{country}/{type}"
    }
  ]
}
```

---

## ✅ Content Quality Checklist

Before publishing any calculator page, verify:

### SEO Basics:
- [ ] Meta title: 55-60 characters
- [ ] Meta description: 150-160 characters
- [ ] H1 includes: country, calculator type, year
- [ ] Primary keyword in first 100 words
- [ ] URL matches content focus

### Content Structure:
- [ ] Introduction (100-150 words)
- [ ] How to use (300-400 words)
- [ ] Tax breakdown (800-1,200 words)
- [ ] 3-5 salary examples (600-800 words)
- [ ] Common questions (400-600 words)
- [ ] 8-12 detailed FAQs (1,200-1,600 words)
- [ ] Total: 3,000-3,500 words

### Finance Safety (YMYL):
- [ ] No guarantees or promises
- [ ] Uses "estimated," "approximately," "typical"
- [ ] Includes clear assumptions
- [ ] Real examples with specific numbers
- [ ] No fake reviews or ratings
- [ ] Current year tax data

### Schema Markup:
- [ ] WebPage schema (with mainEntityOfPage)
- [ ] SoftwareApplication schema (with isAccessibleForFree)
- [ ] FAQPage schema (8+ questions)
- [ ] BreadcrumbList schema
- [ ] ❌ NO AggregateRating (unless real reviews)
- [ ] All URLs match live domain

### Internal Linking:
- [ ] 3-5 related calculators (same country)
- [ ] 2-3 same calculator (other countries)
- [ ] 1 country overview link
- [ ] 6-10 total internal links

### User Experience:
- [ ] Calculator placed prominently at top
- [ ] Clear visual hierarchy (H2, H3 structure)
- [ ] Tables for complex data
- [ ] Bullet points for lists
- [ ] Examples in boxes or callouts
- [ ] Reading level: Grade 8-10

### Dynamic Content:
- [ ] Year is dynamic: {CURRENT_YEAR}
- [ ] No hard-coded dates in permanent text
- [ ] Tax tables updatable via data
- [ ] Domain placeholders replaced: {YOUR_DOMAIN}

---

## 🎨 Content Style Guide

### Tone:
- Professional but accessible
- Helpful, not sales-y
- Educational, not promotional
- Finance-safe (YMYL compliant)

### Language:
- **Use:** "Calculate," "Estimate," "Typical," "Generally"
- **Avoid:** "Guaranteed," "Always," "Never," "Best"
- **Use:** "Your take-home pay" (personal)
- **Avoid:** "The take-home pay" (impersonal)

### Numbers:
- Always use commas: $75,000 (not $75000)
- Currency symbols: $75,000 or £75,000
- Percentages: 22% (not 22 percent)
- Round to whole dollars in examples

### Examples:
- Must include specific numbers
- Show full calculation breakdown
- Use realistic salary ranges
- Include regional variations where relevant

---

## 📈 SEO Keyword Strategy

### Keyword Research (Per Calculator):

**Primary Keywords (1-3):**
- High volume, direct intent
- Example: "us salary calculator," "uk take home pay"

**Long-tail Keywords (10-20):**
- Question-based: "how much tax on 75000 salary"
- Specific intents: "salary calculator with 401k"
- Comparison: "california vs texas salary"

**Where to Use Keywords:**

1. **Title Tag:** Primary keyword + year
2. **H1:** Primary keyword + country + year
3. **First 100 words:** Primary keyword naturally
4. **H2 Headings:** Secondary keywords (2-3)
5. **FAQ Questions:** Question-based long-tail keywords
6. **Throughout Content:** Natural keyword variations

**Keyword Density:**
- Primary: 1-2%
- Secondary: 0.5-1%
- Natural language always wins

---

## 🚫 What NOT to Include

### Prohibited Content:
- ❌ Visible keyword lists
- ❌ Fake reviews or ratings
- ❌ Hard-coded years in evergreen content
- ❌ External links to competitors
- ❌ Promotional language ("best calculator ever")
- ❌ Financial advice or guarantees
- ❌ Stock photos of people
- ❌ Popups or aggressive CTAs
- ❌ Autoplay videos
- ❌ Login walls or paywalls

### Thin Content:
- ❌ Pages under 2,500 words
- ❌ Duplicate content across countries
- ❌ Generic tax explanations (must be country-specific)
- ❌ Placeholder text or lorem ipsum
- ❌ Missing examples or FAQs

---

## 🔄 Content Maintenance

### Annual Updates Required:
1. **Tax Year:** Update to current year
2. **Tax Brackets:** Update from official sources
3. **Contribution Limits:** 401(k), IRA, HSA limits
4. **Wage Base Limits:** Social Security cap
5. **Standard Deductions:** IRS updates

### Monthly Checks:
- Broken internal links
- Schema validation
- Page load speed
- Mobile usability

### Quarterly Reviews:
- Search ranking positions
- User engagement metrics
- FAQ additions from user queries
- Content freshness signals

---

## 📊 Success Metrics

### SEO Metrics:
- **Impressions:** Growth month-over-month
- **CTR:** Target 3-5% for long-tail, 1-2% for head terms
- **Average Position:** Under 10 for long-tail within 30 days
- **Indexed Pages:** 100% of published pages

### User Metrics:
- **Bounce Rate:** Under 60%
- **Time on Page:** 2-4 minutes average
- **Pages per Session:** 1.5+ (via internal links)
- **Return Visitors:** 10-15%

### Calculator Usage:
- **Calculation Completions:** 60%+ of visitors
- **Advanced Options Used:** 15-25%
- **Country Switchers:** 5-10%

---

## 🎯 Production Checklist Summary

Before publishing any calculator page:

1. ✅ Word count: 3,000-3,500 words
2. ✅ All 8 required sections present
3. ✅ 8-12 detailed FAQs
4. ✅ 4 schema types (NO fake ratings)
5. ✅ 6-10 internal links
6. ✅ 3-5 salary examples with calculations
7. ✅ Dynamic year handling ({CURRENT_YEAR})
8. ✅ Domain consistency in schema
9. ✅ Finance-safe language (YMYL)
10. ✅ No prohibited content

---

**Version:** 2.0
**Status:** ✅ Production Standard
**Last Review:** January 14, 2026
**Next Review:** Quarterly or when tax laws change
