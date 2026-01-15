# Deploy to Cloudflare Pages

This guide shows you how to deploy the Global Salary Calculator to Cloudflare Pages.

## Why Cloudflare Pages?

- **Free tier**: Unlimited bandwidth, unlimited requests
- **Global CDN**: Lightning-fast performance worldwide
- **Auto deployments**: Push to Git, automatically deploy
- **Custom domains**: Free SSL certificates
- **Analytics**: Built-in web analytics
- **Edge optimization**: Served from 275+ locations

## Prerequisites

- GitHub/GitLab account (for Git integration)
- Cloudflare account (free) - [Sign up here](https://dash.cloudflare.com/sign-up/pages)

## Deployment Methods

### Method 1: Cloudflare Dashboard (Recommended)

#### Step 1: Push to Git

If you haven't already, initialize a Git repository:

```bash
cd /Users/asomani16/Repository/salarycalculators
git init
git add .
git commit -m "Initial commit: Global Salary Calculator"
```

Push to GitHub:

```bash
# Create a new repository on GitHub first, then:
git remote add origin https://github.com/YOUR_USERNAME/salary-calculator.git
git branch -M main
git push -u origin main
```

#### Step 2: Connect to Cloudflare Pages

1. **Log in** to [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Click **Workers & Pages** in the sidebar
3. Click **Create Application** → **Pages** → **Connect to Git**
4. Select your **Git provider** (GitHub/GitLab)
5. Authorize Cloudflare to access your repositories
6. Select your **salary-calculator** repository

#### Step 3: Configure Build Settings

Use these exact settings:

```
Production branch:     main
Framework preset:      Next.js
Build command:         npm run build
Build output directory: out
```

**Environment variables** (optional):
```
NODE_VERSION: 18
```

#### Step 4: Deploy

1. Click **Save and Deploy**
2. Wait 2-3 minutes for the build to complete
3. Your site will be live at: `https://salary-calculator-xxx.pages.dev`

#### Step 5: Custom Domain (Optional)

1. Go to **Custom domains** in your project settings
2. Click **Set up a custom domain**
3. Enter your domain (e.g., `calculator.yourdomain.com`)
4. Follow DNS instructions to add CNAME record
5. SSL certificate is automatically provisioned

### Method 2: Wrangler CLI (Advanced)

Install Wrangler (Cloudflare CLI):

```bash
npm install -g wrangler
```

Login to Cloudflare:

```bash
wrangler login
```

Deploy directly:

```bash
npm run build
wrangler pages deploy out --project-name=salary-calculator
```

## Build Configuration

The project is already configured for Cloudflare Pages:

### next.config.ts
```typescript
const nextConfig: NextConfig = {
  output: 'export',           // Static export
  images: {
    unoptimized: true,        // Required for static export
  },
  trailingSlash: true,        // Better for static hosting
};
```

### .node-version
```
18
```

Cloudflare will automatically use Node.js 18.

## Automatic Deployments

Once connected, Cloudflare Pages will automatically:
- **Deploy on push** to your main branch (production)
- **Preview deployments** for pull requests
- **Atomic deployments** (instant rollbacks if needed)

## Performance Optimizations

Cloudflare Pages automatically provides:
- **Brotli compression**: Smaller file sizes
- **HTTP/3**: Faster connections
- **Smart routing**: Lowest latency paths
- **Caching**: Static assets cached at edge
- **DDoS protection**: Built-in security

## Post-Deployment Checklist

### 1. Update URLs
After deployment, update these files with your actual domain:

**app/sitemap.ts** (line 7):
```typescript
const baseUrl = 'https://your-domain.pages.dev';
```

**app/robots.ts** (line 6):
```typescript
const baseUrl = 'https://your-domain.pages.dev';
```

Commit and push to trigger a new deployment.

### 2. Test All Countries
Visit each calculator to verify functionality:
- https://your-domain.pages.dev/calculators/us/
- https://your-domain.pages.dev/calculators/uk/
- https://your-domain.pages.dev/calculators/canada/
- https://your-domain.pages.dev/calculators/australia/
- https://your-domain.pages.dev/calculators/germany/
- https://your-domain.pages.dev/calculators/france/
- https://your-domain.pages.dev/calculators/india/
- https://your-domain.pages.dev/calculators/singapore/
- https://your-domain.pages.dev/calculators/uae/

### 3. Verify SEO
Check these URLs:
- https://your-domain.pages.dev/sitemap.xml
- https://your-domain.pages.dev/robots.txt

### 4. Performance Testing
Test with [PageSpeed Insights](https://pagespeed.web.dev/):
```
https://pagespeed.web.dev/analysis?url=https://your-domain.pages.dev
```

Expected scores:
- Performance: 95-100
- Accessibility: 95-100
- Best Practices: 95-100
- SEO: 95-100

## Custom Domain Setup

### Option 1: Subdomain (Easiest)
Example: `calculator.yourdomain.com`

**DNS Record:**
```
Type:  CNAME
Name:  calculator
Target: salary-calculator-xxx.pages.dev
Proxy: Yes (orange cloud)
```

### Option 2: Root Domain
Example: `yourdomain.com`

**DNS Records:**
```
Type:  CNAME
Name:  @
Target: salary-calculator-xxx.pages.dev
Proxy: Yes (orange cloud)
```

## Troubleshooting

### Build Fails

**Error: "Module not found"**
```bash
# Clear cache and rebuild
rm -rf node_modules package-lock.json
npm install
npm run build
```

**Error: "Out of memory"**
- Cloudflare Pages has 2GB memory limit
- Our project is well within limits
- If issue persists, contact Cloudflare support

### 404 Errors

If routes return 404:
1. Check `next.config.ts` has `trailingSlash: true`
2. Ensure build output directory is `out`
3. Verify all pages built successfully in build logs

### Animations Not Working

If animations are broken:
1. Check browser console for errors
2. Verify Framer Motion installed: `npm list framer-motion`
3. Clear Cloudflare cache in dashboard

## Monitoring & Analytics

### Cloudflare Web Analytics (Free)

1. Go to your project → **Analytics**
2. Click **Enable Web Analytics**
3. View real-time and historical data:
   - Page views
   - Unique visitors
   - Top pages
   - Traffic sources
   - Geographic distribution

### Performance Metrics

Monitor in Cloudflare dashboard:
- **Bandwidth**: Unlimited on all plans
- **Requests**: Unlimited on all plans
- **Build time**: View in deployment logs
- **Build frequency**: 500/month (Free), Unlimited (Paid)

## Limits (Free Tier)

- **Builds**: 500 per month
- **Bandwidth**: Unlimited
- **Requests**: Unlimited
- **Sites**: 500 projects
- **Custom domains**: 100 per project
- **Collaborators**: Unlimited

## Advanced Features

### Branch Previews
- Each branch gets a preview URL
- Perfect for testing changes
- Format: `branch-name.salary-calculator.pages.dev`

### Rollbacks
- One-click rollback to any previous deployment
- Zero downtime
- Available in dashboard

### Environment Variables
Add in Project Settings → Environment Variables:
```
NODE_ENV=production
```

### Access Control (Paid)
Protect preview deployments:
- JWT verification
- Access policies
- Email OTP

## Cost Estimate

**Free Tier (Recommended for this project):**
- Cost: $0/month
- Includes: Everything needed

**Pro Tier ($20/month):**
- Advanced analytics
- More build minutes
- Priority support

Our calculator works perfectly on the **Free tier**.

## Support & Resources

- **Cloudflare Docs**: https://developers.cloudflare.com/pages/
- **Community Forum**: https://community.cloudflare.com/
- **Status Page**: https://www.cloudflarestatus.com/
- **Discord**: https://discord.cloudflare.com

## Next Steps

After deployment:
1. ✅ Test all 9 country calculators
2. ✅ Verify sitemap.xml and robots.txt
3. ✅ Run PageSpeed Insights test
4. ✅ Set up custom domain (optional)
5. ✅ Enable Cloudflare Analytics
6. ✅ Share your calculator with the world!

---

Need help? Check the [troubleshooting section](#troubleshooting) or ask in [Cloudflare Community](https://community.cloudflare.com/).
