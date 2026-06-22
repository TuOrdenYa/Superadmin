# Cloudinary Configuration Guide

## 📋 Problem
The upload feature requires Cloudinary API credentials. The error "Must supply api_key" means these environment variables are not set.

## ✅ Solution: Set Up Cloudinary

### Step 1: Create a Cloudinary Account (Free)
1. Go to [cloudinary.com](https://cloudinary.com)
2. Click "Sign Up Free"
3. Complete the registration with your email
4. Verify your email

### Step 2: Get Your Credentials
1. After login, go to your [Cloudinary Dashboard](https://cloudinary.com/console)
2. Look for the "API Key" section showing:
   - **Cloud Name** (e.g., `dxyz1234ab`)
   - **API Key** (e.g., `123456789012345`)
   - **API Secret** (e.g., `abcdefghijk_lmnopqrst`)

### Step 3: Local Development (.env.local)

Create a `.env.local` file in the project root:

```
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

Then restart your development server:
```bash
npm run dev
```

### Step 4: Production Deployment (Vercel)

1. Go to your Vercel project: https://vercel.com/tuordenyas-projects/restorder
2. Click **Settings** → **Environment Variables**
3. Add these three variables:
   - `CLOUDINARY_CLOUD_NAME` = your cloud name
   - `CLOUDINARY_API_KEY` = your API key
   - `CLOUDINARY_API_SECRET` = your API secret
4. Click **Save**
5. Click **Deployments** → **Redeploy** on the latest deployment

### ⚠️ Security Notes
- **Never commit** `.env.local` to git
- **Keep API Secret private** - it's sensitive
- Consider restricting API Key permissions in Cloudinary dashboard:
  - Set "Restricted to API methods" if available
  - Limit to Upload and Destroy operations

## 🧪 Testing

After setting up environment variables, test the upload functionality:

1. Start the local dev server: `npm run dev`
2. Visit the backoffice: http://localhost:3000/backoffice/your-tenant-slug
3. Try uploading a logo/image
4. Check the browser console and server logs for any errors

## 🆘 Troubleshooting

### "Must supply api_key" Error
- Verify `.env.local` file exists in the project root
- Check that all three variables are spelled correctly
- Restart the development server after adding `.env.local`
- Make sure no extra spaces in the values

### "Cloudinary configuration missing" Error
- At least one of the three environment variables is missing
- See Step 3 or Step 4 above to add them

### Upload still fails
- Check that your Cloudinary account is active
- Verify the API credentials in Cloudinary dashboard
- Check server logs for detailed error messages
- Ensure the uploaded file is a valid image format

## 📚 More Info
- [Cloudinary Node.js SDK Docs](https://cloudinary.com/documentation/node_integration)
- [Cloudinary Dashboard](https://cloudinary.com/console)
