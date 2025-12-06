# Vercel Environment Variables

## Instructions
1. Go to: https://vercel.com/tuordenyas-projects/restorder/settings/environment-variables
2. Copy each variable below and add it to Vercel
3. After adding all 3 variables, click "Redeploy" in Vercel

---

## Variables to Add

### DATABASE_URL
```
postgresql://postgres.jqpelyhmichbtmbhcckp:xYsDt1XPrvTXTOlb@aws-1-sa-east-1.pooler.supabase.com:5432/postgres
```

### JWT_SECRET
```
your-super-secret-jwt-key-change-in-production
```

### ADMIN_PASSWORD
```
SuperAdmin2024!
```

---

## After Adding Variables

1. Click "Redeploy" button in Vercel
2. Wait for deployment to complete (~2-3 minutes)
3. Test the production URL
4. Configure DNS for custom domain tuordenya.com

---

## DNS Configuration (After Vercel Redeploy)

### Step 1: Add Wildcard CNAME
In your DNS provider (where you bought tuordenya.com):
```
Type: CNAME
Name: *
Value: cname.vercel-dns.com
```

### Step 2: Add Root Domain
```
Type: A
Name: @
Value: 76.76.21.21
```

### Step 3: Add Domains in Vercel
Go to: https://vercel.com/tuordenyas-projects/restorder/settings/domains

Add these domains:
- `admin.tuordenya.com`
- `backoffice.tuordenya.com`
- `*.tuordenya.com` (wildcard)
- `tuordenya.com`

Vercel will automatically configure SSL certificates.

---

## Testing Production

After everything is configured, test:
- https://admin.tuordenya.com (Super Admin Panel)
- https://backoffice.tuordenya.com (Restaurant Backoffice)
- https://demo-restaurant.tuordenya.com (Customer Menu - after creating tenant with slug "demo-restaurant")
