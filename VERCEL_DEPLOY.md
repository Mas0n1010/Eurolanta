# Deploy to Vercel - Step by Step

Follow these exact steps to deploy your Roblox Activity Logger to Vercel.

## Step 1: Create Database

### Option A: Vercel Postgres (Easiest) ⭐

1. Go to https://vercel.com/dashboard
2. Click on **Storage** tab
3. Click **Create Database**
4. Select **Postgres**
5. Follow the setup wizard
6. Copy the connection details

### Option B: Supabase (Free Forever)

1. Go to https://supabase.com and create account
2. Create a new project
3. Wait for database to be ready
4. Go to **Project Settings** → **Database**
5. Copy the **Connection String** (URI format)
6. It should look like: `postgresql://postgres:password@db.xxx.supabase.co:5432/postgres`

## Step 2: Deploy to Vercel

1. **Go to Vercel Dashboard**
   - Visit https://vercel.com/dashboard
   - Sign in with GitHub if not already signed in

2. **Import Repository**
   - Click **"Add New..."** → **"Project"**
   - Find and select `Eurolanta` repository
   - Click **"Import"**

3. **Configure Project**
   - Framework Preset: **Next.js** (should auto-detect)
   - Root Directory: `./` (leave as default)
   - Build Command: (leave as default or use `npm run build`)
   - Output Directory: (leave as default)

4. **Add Environment Variable**
   - Click **"Environment Variables"**

   **If using Vercel Postgres:**
   ```
   Name: DATABASE_URL
   Value: ${POSTGRES_URL}
   ```

   **If using Supabase or other database:**
   ```
   Name: DATABASE_URL
   Value: postgresql://postgres:password@db.xxx.supabase.co:5432/postgres
   ```

   - Select: **Production, Preview, Development** (all three)
   - Click **Add**

5. **Deploy**
   - Click **"Deploy"**
   - Wait for build to complete (2-3 minutes)
   - ✅ Deployment successful!

## Step 3: Initialize Database

Your app is deployed but the database is empty. You need to create the tables and admin user.

### Method 1: Using Vercel CLI (Recommended)

```bash
# Install Vercel CLI globally
npm install -g vercel

# Login to your Vercel account
vercel login

# Navigate to your project folder
cd /path/to/Eurolanta

# Link to your Vercel project
vercel link

# Pull environment variables from Vercel
vercel env pull .env

# Push database schema to create tables
npx prisma db push

# Create the admin user
npx tsx scripts/setup.ts
```

### Method 2: Using Local Environment

If you don't want to install Vercel CLI:

1. **Get Database URL**
   - In Vercel dashboard, go to your project
   - Click **Settings** → **Environment Variables**
   - Copy the `DATABASE_URL` value (click "eye" icon to reveal)

2. **Create Local .env File**
   ```bash
   # In your project folder
   echo 'DATABASE_URL="your_copied_database_url_here"' > .env
   ```

3. **Initialize Database**
   ```bash
   # Create tables
   npx prisma db push

   # Create admin user
   npx tsx scripts/setup.ts
   ```

### Method 3: Manual Database Setup

If you prefer using a database GUI:

1. Connect to your database using:
   - **Prisma Studio**: `npx prisma studio`
   - **TablePlus**, **pgAdmin**, or **DBeaver**

2. Run the SQL from `prisma/migrations/20250102000000_init/migration.sql`

3. Create admin user manually or use the setup script

## Step 4: Test Your Deployment

1. **Visit Your Site**
   - Go to the URL shown in Vercel (e.g., `your-project.vercel.app`)

2. **Login**
   - Username: `admin`
   - Password: `admin123`

3. **Test Features**
   - ✅ Login works
   - ✅ Admin dashboard loads
   - ✅ Can create new users
   - ✅ Sessions are tracked

## Step 5: Secure Your App

**🔐 IMPORTANT - Do this immediately:**

1. Change the default admin password
2. Create proper user accounts
3. Delete any test accounts

## Common Issues & Solutions

### Issue: "Prisma schema validation error"

**Solution:**
- Make sure `DATABASE_URL` is set in Vercel environment variables
- Ensure the URL is correctly formatted
- Redeploy after adding environment variables

### Issue: "Can't reach database server"

**Solution for Supabase:**
- Go to Supabase project settings
- Enable **"Allow connections from anywhere"** (or add Vercel's IP ranges)
- Use the connection pooler URL if available

**Solution for Vercel Postgres:**
- Make sure database is in the same region as your Vercel project
- Check that database is not paused

### Issue: "Database tables don't exist"

**Solution:**
```bash
npx prisma db push
```

This creates all necessary tables in your database.

### Issue: "Cannot login - Invalid credentials"

**Solution:**
Make sure you ran the setup script:
```bash
npx tsx scripts/setup.ts
```

### Issue: Build fails with Prisma error

**Solution:**
1. Check that `package.json` has: `"postinstall": "prisma generate"`
2. Ensure `prisma` is in devDependencies
3. Try clearing Vercel cache and redeploying

## Updating Your App

Every time you push to GitHub:
- Vercel automatically builds and deploys
- **Production** branch → production site
- **Other** branches → preview deployments

To update database schema:
```bash
# Make changes to prisma/schema.prisma
# Then push schema to database
npx prisma db push

# Commit and push
git add .
git commit -m "Update database schema"
git push
```

## Custom Domain Setup

1. Go to your Vercel project
2. Click **Settings** → **Domains**
3. Add your domain
4. Follow DNS configuration instructions
5. Wait for DNS propagation (5-30 minutes)

## Need Help?

- Check logs in Vercel dashboard → **Deployments** → Click deployment → **Logs**
- Check runtime logs in Vercel dashboard → **Logs** tab
- Ensure environment variables are set correctly

## Success Checklist

- ✅ Database created (Vercel Postgres or Supabase)
- ✅ Environment variable `DATABASE_URL` set in Vercel
- ✅ App deployed successfully
- ✅ Database schema pushed (`npx prisma db push`)
- ✅ Admin user created (`npx tsx scripts/setup.ts`)
- ✅ Can login to the app
- ✅ Admin password changed from default

---

🎉 **Congratulations!** Your Roblox Activity Logger is now live on Vercel!
