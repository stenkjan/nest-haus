# 🚀 Quick Setup: Production Deployment

**Status**: Workflow created ✅ | Node 20 configured ✅ | Vercel hook setup required ⏳

---

## ⚡ **3-Step Setup (5 minutes)**

### **1️⃣ Create Deploy Hook**

- Go to: https://vercel.com/dashboard
- Select `nest-haus` → **Settings** → **Git** → **Deploy Hooks**
- Click **"Create Hook"**
  - Name: `Production Deploy from GitHub Actions`
  - Branch: `main`
- **Copy the URL**

### **2️⃣ Add GitHub Secret**

- Go to: https://github.com/stenkjan/nest-haus/settings/secrets/actions
- Click **"New repository secret"**
  - Name: `VERCEL_DEPLOY_HOOK_PRODUCTION`
  - Value: [Paste the deploy hook URL]
- Click **"Add secret"**

### **3️⃣ Test It**

```bash
git commit --allow-empty -m "test: verify deployment"
git push origin main
```

---

## ✅ **Verification**

**GitHub Actions**: https://github.com/stenkjan/nest-haus/actions

- Should show "Deploy to Production" running

**Vercel**: https://vercel.com/dashboard

- Should show new deployment in progress

---

## 📖 **Full Guide**

See `docs/PRODUCTION_DEPLOYMENT_SETUP.md` for:

- Detailed troubleshooting
- All required secrets
- Deployment flow diagram
- Alternative setup options

---

**Created**: October 24, 2025
