# Vercel Deployment Setup Guide

## Getting Required Values for GitHub Actions

### 1. VERCEL_TOKEN
1. Go to [Vercel Dashboard](https://vercel.com/account/tokens)
2. Create a new token with a descriptive name like "GitHub Actions Deploy"
3. Copy the token and add it as `VERCEL_TOKEN` secret in GitHub

### 2. VERCEL_ORG_ID & VERCEL_PROJECT_ID
1. Install Vercel CLI: `npm i -g vercel`
2. Login: `vercel login`
3. In your project root, run: `vercel link`
4. Follow the prompts to link your project
5. Check the `.vercel/project.json` file that gets created:
   ```json
   {
     "projectId": "your-project-id-here",
     "orgId": "your-org-id-here"
   }
   ```

### 3. Alternative: Manual Method
1. Go to your [Vercel Dashboard](https://vercel.com/dashboard)
2. Click on your project
3. Go to Settings → General
4. Find "Project ID" and "Team ID" (this is your org ID)

## Setting up GitHub Secrets
1. Go to your GitHub repository
2. Settings → Secrets and variables → Actions
3. Click "New repository secret"
4. Add each of the three secrets:
   - `VERCEL_TOKEN` (from step 1)
   - `VERCEL_ORG_ID` (from step 2)
   - `VERCEL_PROJECT_ID` (from step 2)

## Testing the Deployment
Once secrets are set up:
1. Push any change to the `development` branch
2. Go to Actions tab in GitHub
3. You should see the deployment workflow running
4. Check the summary for deployment status and URL
