# Production Deployment Setup Guide

**Date**: October 24, 2025

This guide explains how to complete the setup for automatic production deployments when pushing to the `main` branch.

---

## 🎯 **What Was Created**

A new GitHub Actions workflow (`.github/workflows/deploy-production.yml`) that:

- ✅ Triggers on every push to `main` branch
- ✅ Runs linting and type checking
- ✅ Builds the application
- ✅ Triggers Vercel deployment via Deploy Hook

---

## 🔧 **Required Setup Steps**

### **Step 1: Create Vercel Deploy Hook**

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your `nest-haus` project
3. Navigate to **Settings** → **Git**
4. Scroll down to **"Deploy Hooks"** section
5. Click **"Create Hook"**

**Configuration:**

- **Hook Name**: `Production Deploy from GitHub Actions`
- **Git Branch**: `main`
- Click **"Create Hook"**

6. **Copy the generated URL** - it will look like:
   ```
   https://api.vercel.com/v1/integrations/deploy/prj_XXXXX/YYYYY
   ```

---

### **Step 2: Add Deploy Hook to GitHub Secrets**

1. Go to your GitHub repository: https://github.com/stenkjan/nest-haus
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **"New repository secret"**

**Secret Configuration:**

- **Name**: `VERCEL_DEPLOY_HOOK_PRODUCTION`
- **Value**: Paste the full deploy hook URL from Step 1
- Click **"Add secret"**

---

### **Step 3: Add Required Build Secrets (If Missing)**

The workflow needs these secrets for the build process. Check if they already exist:

1. In GitHub repository **Settings** → **Secrets and variables** → **Actions**
2. Verify these secrets exist (add if missing):

**Required Secrets:**

| Secret Name                          | Where to Get It           | Purpose             |
| ------------------------------------ | ------------------------- | ------------------- |
| `DATABASE_URL`                       | Neon/PostgreSQL Dashboard | Database connection |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe Dashboard          | Public Stripe key   |

**Optional (for full functionality):**

- `UPSTASH_REDIS_REST_URL` - From Upstash Dashboard
- `UPSTASH_REDIS_REST_TOKEN` - From Upstash Dashboard
- `STRIPE_SECRET_KEY` - From Stripe Dashboard
- `STRIPE_WEBHOOK_SECRET` - From Stripe Dashboard
- `RESEND_API_KEY` - From Resend Dashboard
- `GOOGLE_DRIVE_CLIENT_EMAIL` - From Google Cloud Console
- `GOOGLE_DRIVE_PRIVATE_KEY` - From Google Cloud Console

---

## 🚀 **Test the Setup**

After completing the setup, test it:

```bash
# Create an empty commit to trigger deployment
git commit --allow-empty -m "test: verify production deployment"

# Push to main
git push origin main
```

---

## ✅ **Verify Deployment**

### **Check GitHub Actions:**

1. Go to: https://github.com/stenkjan/nest-haus/actions
2. You should see **"Deploy to Production"** workflow running
3. Click on it to view logs

**Expected Steps:**

- ✅ Checkout code
- ✅ Setup Node.js
- ✅ Install dependencies
- ✅ Run linting
- ✅ Run type checking
- ✅ Build application
- ✅ Trigger Vercel deployment

### **Check Vercel Dashboard:**

1. Go to [Vercel Deployments](https://vercel.com/dashboard)
2. Select `nest-haus` project
3. Click **"Deployments"** tab
4. You should see a new deployment in progress

---

## 🔍 **Troubleshooting**

### **Error: "VERCEL_DEPLOY_HOOK_PRODUCTION secret not configured"**

**Solution:**

- The GitHub secret is missing
- Complete **Step 2** above

---

### **Error: Build fails with type/linting errors**

**Solution:**

```bash
# Run locally to check
npm run lint
npx tsc --noEmit

# Fix any errors, then commit and push
```

---

### **Error: "Failed to trigger deployment" (HTTP 401/403)**

**Solution:**

- Deploy hook URL is invalid or expired
- Regenerate deploy hook in Vercel (Step 1)
- Update GitHub secret with new URL (Step 2)

---

### **Error: Build completes but Vercel doesn't deploy**

**Solution:**

- Check deploy hook is configured for correct branch (`main`)
- Verify deploy hook wasn't deleted in Vercel
- Check Vercel project settings → Git → Deploy Hooks

---

## 📊 **Deployment Flow**

```
Developer pushes to main
         ↓
GitHub Actions triggered
         ↓
Checkout code
         ↓
Install dependencies
         ↓
Run linting (npm run lint)
         ↓
Run type checking (tsc --noEmit)
         ↓
Build application (npm run build)
         ↓
[All checks pass]
         ↓
Call Vercel Deploy Hook
         ↓
Vercel receives hook
         ↓
Vercel builds & deploys
         ↓
Production updated 🎉
```

---

## 🆚 **Difference from Development Branch**

| Branch        | Workflow                 | Trigger               | Purpose            |
| ------------- | ------------------------ | --------------------- | ------------------ |
| `development` | `deploy-development.yml` | Push to `development` | Testing builds     |
| `main`        | `deploy-production.yml`  | Push to `main`        | Production deploys |

---

## 🔄 **Alternative: Native Vercel Integration**

If you prefer Vercel's native Git integration instead of GitHub Actions:

1. **Disable** this workflow by renaming:

   ```bash
   mv .github/workflows/deploy-production.yml .github/workflows/deploy-production.yml.disabled
   ```

2. **Reconnect** Vercel Git integration:
   - Vercel Dashboard → Settings → Git
   - Click "Connect Git Repository"
   - Select `stenkjan/nest-haus`
   - Set Production Branch to `main`

**Pros of Native Integration:**

- ✅ Simpler setup (no GitHub secrets needed)
- ✅ Automatic webhook management
- ✅ Preview deployments for PRs

**Pros of GitHub Actions:**

- ✅ Pre-deployment validation (linting, type checking)
- ✅ Custom build steps and checks
- ✅ Full control over deployment pipeline
- ✅ Consistent with `development` workflow

---

## 📝 **Next Steps**

1. ✅ Created workflow file (`.github/workflows/deploy-production.yml`)
2. ⏳ Complete **Step 1**: Create Vercel Deploy Hook
3. ⏳ Complete **Step 2**: Add GitHub Secret
4. ⏳ Complete **Step 3**: Verify build secrets exist
5. ⏳ Test deployment with empty commit
6. ⏳ Verify deployment succeeds in both GitHub Actions and Vercel

---

## 📞 **Support**

If you encounter issues:

1. Check GitHub Actions logs for detailed error messages
2. Check Vercel deployment logs
3. Review this guide's troubleshooting section
4. Verify all secrets are correctly configured

---

**Workflow created successfully! Complete the setup steps above to enable automatic deployments.**
