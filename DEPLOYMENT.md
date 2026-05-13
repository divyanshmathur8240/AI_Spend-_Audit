# Deployment Guide

## Quick Vercel Deploy (Recommended)

### Prerequisites
- GitHub account with repo access
- Vercel account (free tier available)
- Optional: Anthropic API key for AI summaries

### Step 1: Import Project to Vercel
1. Go to https://vercel.com/new
2. Click **Continue with GitHub**
3. Find and select `divyanshmathur8240/AI_Spend-_Audit`
4. Click **Import**

### Step 2: Configure Environment Variables
Vercel will prompt you to add environment variables. Configure:

| Variable | Value | Required? | Notes |
|----------|-------|-----------|-------|
| `ANTHROPIC_API_KEY` | `sk-ant-...` | ❌ No | Get from https://console.anthropic.com/account/keys. If omitted, summaries use fallback template. |
| `NEXT_PUBLIC_APP_URL` | `https://yourapp.vercel.app` | ⚠️ Optional | Use the auto-generated Vercel URL after first deploy. Update manually if custom domain added. |

**To get Anthropic API key (optional):**
1. Go to https://console.anthropic.com/account/keys
2. Create new API key
3. Copy and paste into Vercel environment variables

### Step 3: Deploy
1. Click **Deploy**
2. Wait 2–3 minutes
3. Once complete, you'll see "Congratulations!" with live URL

### Step 4: Update Environment Variable (if needed)
After first deploy:
1. Go to Vercel dashboard → your project → **Settings** → **Environment Variables**
2. Update `NEXT_PUBLIC_APP_URL` to your actual Vercel domain
3. Redeploy by pushing to `main` branch or clicking **Redeploy** in Vercel UI

## Local Development with Environment Variables

Create a `.env.local` file in project root (never commit to git):
```bash
ANTHROPIC_API_KEY=sk-ant-your-key-here
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

Then run:
```bash
npm run dev
```

## Verification Checklist

After deployment, verify:
- ✅ Site loads at Vercel URL
- ✅ Form input works (enter team size, select tools, set spend)
- ✅ Audit results show recommendations
- ✅ AI summary generates (or fallback appears if no API key)
- ✅ Shareable URL works and shows public version of audit
- ✅ Open Graph preview displays correctly (test at https://www.opengraph.xyz/)

## Performance Targets
- Lighthouse Performance: ≥85
- Lighthouse Accessibility: ≥90
- Lighthouse Best Practices: ≥90
- Core Web Vitals: Excellent

## Troubleshooting

**"AI API key not configured" appears:**
- Summary endpoint is optional — this is expected if no Anthropic key set
- User will see fallback summary template instead
- To fix: Add `ANTHROPIC_API_KEY` to Vercel environment variables and redeploy

**Shareable URL broken or shows 404:**
- Make sure `NEXT_PUBLIC_APP_URL` matches your deployed domain
- Update in Vercel environment and redeploy

**Build fails:**
- Check Vercel build logs for errors
- Ensure all dependencies installed: `npm install`
- Verify Node version: Vercel uses Node 18+ by default (project requires Node 16+)

## Post-Deploy CI/CD

Your GitHub repo has `.github/workflows/ci.yml` configured. After deployment:
- Every push to `main` triggers automatic tests and lint checks
- Vercel auto-deploys every successful push
- Deployment status visible in GitHub commit checks and Vercel dashboard

