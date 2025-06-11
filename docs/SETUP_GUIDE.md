# 🚀 **Nest-Haus Setup Guide**

Complete infrastructure setup for Redis, PostgreSQL, Vercel deployment, and admin panel.

## 📋 **Prerequisites**

- Vercel account
- GitHub repository connected
- Node.js 18+ installed

---

## 🔧 **Step 1: Database Setup**

### **1.1 Upstash Redis (Free Tier)**

1. Go to [Upstash Console](https://console.upstash.com/redis)
2. Click "Create Database"
3. Choose:
   - **Name**: `nest-haus-sessions`
   - **Region**: Choose closest to your users
   - **Type**: Regional (free tier)
4. Copy the connection details:
   ```env
   UPSTASH_REDIS_REST_URL="https://xxx-xxx-xxx.upstash.io"
   UPSTASH_REDIS_REST_TOKEN="AXXXaaa"
   ```

### **1.2 Neon PostgreSQL (Free Tier)**

1. Go to [Neon Console](https://console.neon.tech)
2. Click "Create Project"
3. Choose:
   - **Name**: `nest-haus`
   - **Database name**: `nest_haus`
   - **Region**: Same as Redis if possible
4. Copy the connection string:
   ```env
   DATABASE_URL="postgresql://username:password@ep-xxx-xxx.us-east-1.aws.neon.tech/nest_haus?sslmode=require"
   ```

---

## 🎯 **Step 2: Environment Variables**

Create `.env.local` file in project root:

```env
# ===== DATABASE CONFIGURATION =====
DATABASE_URL="postgresql://username:password@ep-xxx-xxx.us-east-1.aws.neon.tech/nest_haus?sslmode=require"

# ===== REDIS CONFIGURATION =====
UPSTASH_REDIS_REST_URL="https://xxx-xxx-xxx.upstash.io"
UPSTASH_REDIS_REST_TOKEN="AXXXaaa"

# ===== VERCEL CONFIGURATION =====
BLOB_READ_WRITE_TOKEN="vercel_blob_rw_xxx"

# ===== ADMIN PANEL =====
ADMIN_USERNAME="admin"
ADMIN_PASSWORD="your-secure-password-here"

# ===== NEXT.JS CONFIGURATION =====
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-random-secret-key-here"
```

---

## 🗄️ **Step 3: Database Migration**

Run these commands to set up your database:

```bash
# Install dependencies
npm install

# Generate Prisma client
npx prisma generate

# Push schema to database
npx prisma db push

# Optional: Seed with test data
npx prisma db seed
```

---

## ☁️ **Step 4: Vercel Deployment**

### **4.1 Automatic Deployment (Recommended)**

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import your GitHub repository
4. Configure:
   - **Framework Preset**: Next.js
   - **Root Directory**: `./`
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`

### **4.2 Environment Variables in Vercel**

In your Vercel project settings, add all environment variables from your `.env.local`:

1. Go to Project Settings > Environment Variables
2. Add each variable:
   ```
   DATABASE_URL = postgresql://username:password@ep-xxx-xxx.us-east-1.aws.neon.tech/nest_haus?sslmode=require
   UPSTASH_REDIS_REST_URL = https://xxx-xxx-xxx.upstash.io
   UPSTASH_REDIS_REST_TOKEN = AXXXaaa
   ADMIN_USERNAME = admin
   ADMIN_PASSWORD = your-secure-password-here
   NEXTAUTH_URL = https://your-domain.vercel.app
   NEXTAUTH_SECRET = your-random-secret-key-here
   ```

### **4.3 Set up Vercel Blob Storage**

1. In Vercel Dashboard, go to Storage tab
2. Create new Blob store:
   - **Name**: `nest-haus-images`
3. Copy the token:
   ```env
   BLOB_READ_WRITE_TOKEN="vercel_blob_rw_xxx"
   ```

---

## 📊 **Step 5: Admin Panel Access**

### **5.1 Local Development**

```bash
# Start development server
npm run dev

# Access admin panel
open http://localhost:3000/admin
```

### **5.2 Production Access**

- **URL**: `https://your-domain.vercel.app/admin`
- **Username**: Value from `ADMIN_USERNAME`
- **Password**: Value from `ADMIN_PASSWORD`

### **5.3 Admin Panel Features**

1. **User Journey Tracking** (`/admin/user-journey`)
   - Session flow analysis
   - Drop-off point identification
   - Time spent analytics

2. **Popular Konfigurationen** (`/admin/popular-configurations`)
   - Top house configurations
   - Price distribution analysis
   - Selection pattern insights

3. **Performance Metrics** (`/admin/performance`)
   - API response times
   - Database query performance
   - User experience metrics

4. **Conversion Analysis** (`/admin/conversion`)
   - Funnel analysis
   - Conversion rate tracking
   - Revenue analytics

---

## 🔄 **Step 6: GitHub Actions (Auto-Documentation)**

Your project already includes:
- `.github/workflows/auto-documentation.yml`
- Automatic commit history tracking
- Documentation updates on every push

---

## 🧪 **Step 7: Testing Your Setup**

### **7.1 Test Database Connection**

```bash
# Test Prisma connection
npx prisma studio

# Test Redis connection
curl -X POST http://localhost:3000/api/test/redis
```

### **7.2 Test User Session Tracking**

1. Open configurator: `http://localhost:3000`
2. Make some selections
3. Check admin panel: `http://localhost:3000/admin`
4. Verify session data in User Journey section

### **7.3 Test Production Deployment**

```bash
# Push to main branch
git add .
git commit -m "🚀 Production deployment"
git push origin main

# Check Vercel deployment logs
# Access admin panel at production URL
```

---

## 📈 **Step 8: Analytics Integration (Optional)**

### **8.1 Google Analytics**

Add to `.env.local`:
```env
NEXT_PUBLIC_GA_ID="G-XXXXXXXXXX"
```

### **8.2 Microsoft Clarity (Heatmaps)**

Add to `.env.local`:
```env
NEXT_PUBLIC_CLARITY_ID="XXXXXXXXX"
```

---

## 🛠️ **Troubleshooting**

### **Common Issues**

1. **Database Connection Fails**
   - Check Neon database is active
   - Verify connection string format
   - Ensure IP whitelist allows connections

2. **Redis Connection Fails**
   - Verify Upstash credentials
   - Check Redis database is active
   - Test with REST API directly

3. **Vercel Build Fails**
   - Check all environment variables are set
   - Verify Prisma schema is valid
   - Check build logs for specific errors

4. **Admin Panel 403/404**
   - Verify admin credentials in environment
   - Check if admin routes are deployed
   - Clear browser cache

### **Need Help?**

- Check the [Documentation](./PROJECT_OVERVIEW.md)
- Review [Migration Plan](./migration/CONFIGURATOR_MIGRATION_PLAN.md)
- Open GitHub issue for support

---

## 🎉 **Success Checklist**

- [ ] Redis database connected
- [ ] PostgreSQL database connected
- [ ] Local development running
- [ ] Vercel deployment successful
- [ ] Admin panel accessible
- [ ] User tracking working
- [ ] Analytics data flowing
- [ ] GitHub Actions running

**Your modular house configurator with analytics is now live! 🏠📊** 