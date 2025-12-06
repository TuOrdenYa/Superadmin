# Deployment Guide - Vercel

## 🚀 Quick Deploy (5 Minutes)

### Step 1: Install Vercel CLI (if not installed)
```bash
npm install -g vercel
```

### Step 2: Login to Vercel
```bash
vercel login
```

### Step 3: Deploy
```bash
# From project root
cd C:\Users\becoa\abastta-reactlocal\restorder
vercel --prod
```

Follow prompts:
- Set up and deploy? **Yes**
- Which scope? (Select your account)
- Link to existing project? **No** (first time)
- What's your project's name? **restorder** (or your choice)
- In which directory is your code located? **./** 
- Want to override settings? **No**

### Step 4: Add Environment Variables

After first deploy, go to Vercel Dashboard:
1. Go to your project → Settings → Environment Variables
2. Add these variables:

```
DATABASE_URL=postgresql://postgres.jqpelyhmichbtmbhcckp:xYsDt1XPrvTXTOlb@aws-1-sa-east-1.pooler.supabase.com:5432/postgres

JWT_SECRET=your-super-secret-jwt-key-change-in-production

ADMIN_PASSWORD=SuperAdmin2024!

NEXT_PUBLIC_APP_NAME=RestOrder
```

3. Select all environments: Production, Preview, Development
4. Click "Save"

### Step 5: Redeploy
```bash
vercel --prod
```

---

## ✅ What's Protected

- **`/admin`**: Password-protected (ADMIN_PASSWORD)
- **`/backoffice/[tenant]`**: JWT auth required (login at `/backoffice/login`)
- **API endpoints**: No changes yet (future: add JWT verification)

---

## 🔑 Access After Deployment

### Super Admin Panel
- URL: `https://your-app.vercel.app/admin`
- Password: `SuperAdmin2024!`

### Backoffice Login
- URL: `https://your-app.vercel.app/backoffice/login`
- Credentials: `admin@test.com` / `password123`

### Customer Menu (After tenant created)
- URL: `https://your-app.vercel.app/1` (replace 1 with tenant ID)

---

## 🛡️ Security Notes

**Current Protection:**
- ✅ Admin panel: Password protected
- ✅ Backoffice: Login required
- ⚠️ API endpoints: Still open (low risk for read-only operations)

**Recommended Next Steps:**
1. Change `ADMIN_PASSWORD` to something strong
2. Change `JWT_SECRET` to a random 32+ character string
3. Add API middleware to verify JWT tokens (later)

---

## 🌐 Custom Domain (Optional)

In Vercel Dashboard:
1. Go to Settings → Domains
2. Add your domain: `yourapp.com`
3. Configure DNS as instructed

---

## 📝 Test Checklist After Deploy

- [ ] Visit `/admin` - password prompt appears
- [ ] Login with password - see admin panel
- [ ] Create a test tenant
- [ ] Visit `/backoffice/login` - login page appears
- [ ] Login with test credentials
- [ ] See backoffice - can manage menu
- [ ] Test logout - redirects to login

---

## 🔧 Troubleshooting

**"Build failed":**
- Check build logs in Vercel dashboard
- Ensure all dependencies in package.json

**"Database connection error":**
- Verify DATABASE_URL in environment variables
- Check Supabase is accessible from Vercel IPs

**"Environment variables not working":**
- Make sure you redeployed after adding variables
- Check variable names match exactly (case-sensitive)

---

## 🎯 Ready to Deploy?

Run this command:
```bash
vercel --prod
```

Your app will be live in ~2 minutes! 🚀
