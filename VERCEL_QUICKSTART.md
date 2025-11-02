# Vercel Quick Start Guide

Get your Roblox Activity Logger deployed to Vercel in under 5 minutes!

## Step 1: Fork or Import Repository

1. Go to [Vercel](https://vercel.com)
2. Sign in with GitHub
3. Click "Add New..." → "Project"
4. Import the `Eurolanta` repository

## Step 2: Set Up Database

### Quick Option: Vercel Postgres

1. In your Vercel dashboard, go to the **Storage** tab
2. Click **Create Database** → **Postgres**
3. Follow the prompts to create a new database
4. Vercel will automatically set the `POSTGRES_URL` variable

### Alternative: Use Supabase (Free)

1. Go to [Supabase](https://supabase.com) and create a free account
2. Create a new project
3. Go to Project Settings → Database
4. Copy the connection string (URI format)
5. In Vercel, add environment variable:
   ```
   DATABASE_URL=your_supabase_connection_string
   ```

## Step 3: Configure Environment Variable

In your Vercel project settings → Environment Variables:

**If using Vercel Postgres:**
```
DATABASE_URL=${POSTGRES_URL}
```

**If using external database:**
```
DATABASE_URL=postgresql://user:password@host:5432/database
```

Make sure to add this to **all environments** (Production, Preview, Development)

## Step 4: Deploy

1. Click **Deploy**
2. Wait for the build (usually 1-2 minutes)
3. Your app will be live at `your-project.vercel.app`

## Step 5: Initialize Database

### Option A: Use Vercel CLI (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Link project
vercel link

# Pull environment variables
vercel env pull

# Run migration
npx prisma migrate deploy

# Create admin user
npx tsx scripts/setup.ts
```

### Option B: Use Your Local Machine

1. Copy your `DATABASE_URL` from Vercel environment variables
2. Create a `.env` file locally:
   ```
   DATABASE_URL=your_production_database_url
   ```
3. Run:
   ```bash
   npx prisma migrate deploy
   npx tsx scripts/setup.ts
   ```

## Step 6: Login

Visit your Vercel URL and login with:
- **Username:** `admin`
- **Password:** `admin123`

**⚠️ IMPORTANT:** Change the admin password immediately!

## Troubleshooting

### Build Failed?
- Check that `DATABASE_URL` is set in environment variables
- Ensure the database is accessible from Vercel

### Can't Login?
- Make sure you ran `npx tsx scripts/setup.ts` to create the admin user
- Check database tables were created with `npx prisma studio`

### Need to Reset?
```bash
# Drop all tables and recreate
npx prisma migrate reset

# Create admin user again
npx tsx scripts/setup.ts
```

## Next Steps

✅ Change default admin password
✅ Add a custom domain in Vercel settings
✅ Create additional users
✅ Test session tracking
✅ Set up monitoring

## Automatic Deployments

Every push to your GitHub repository will trigger a new deployment automatically!

- **Main branch** → Production deployment
- **Other branches** → Preview deployments

---

Need more details? Check out the full [DEPLOYMENT.md](DEPLOYMENT.md) guide.
