# Deployment Guide - Vercel

This guide will walk you through deploying the Roblox Activity Logger to Vercel via GitHub.

## Prerequisites

- GitHub account with this repository
- Vercel account (sign up at https://vercel.com)
- Database provider (Vercel Postgres, Supabase, or any PostgreSQL database)

## Step 1: Prepare Your Database

### Option A: Vercel Postgres (Recommended)

1. Go to your Vercel dashboard
2. Navigate to Storage → Create Database → Postgres
3. Create a new Postgres database
4. Vercel will automatically provide the `POSTGRES_URL` environment variable

### Option B: External PostgreSQL Provider

You can use any PostgreSQL provider:
- **Supabase**: https://supabase.com (Free tier available)
- **Neon**: https://neon.tech (Serverless PostgreSQL)
- **Railway**: https://railway.app
- **ElephantSQL**: https://www.elephantsql.com

Get your PostgreSQL connection string in this format:
```
postgresql://user:password@host:5432/database?schema=public
```

## Step 2: Connect GitHub to Vercel

1. Go to https://vercel.com and sign in
2. Click "Add New..." → "Project"
3. Import your GitHub repository (`Eurolanta`)
4. Select the repository and click "Import"

## Step 3: Configure Environment Variables

In the Vercel project settings, add the following environment variables:

### If using Vercel Postgres:
```
DATABASE_URL=${POSTGRES_URL}
```

### If using external PostgreSQL:
```
DATABASE_URL=postgresql://user:password@host:5432/database?schema=public
```

**Important**: Add this variable to all environments (Production, Preview, Development)

## Step 4: Deploy

1. Click "Deploy" in Vercel
2. Wait for the build to complete
3. Vercel will automatically:
   - Install dependencies
   - Generate Prisma client
   - Run database migrations
   - Build the Next.js application

## Step 5: Initialize Database

After the first deployment, you need to create the database tables and initial admin user:

### Method 1: Using Vercel CLI (Recommended)

1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Login to Vercel:
   ```bash
   vercel login
   ```

3. Link your project:
   ```bash
   vercel link
   ```

4. Pull environment variables:
   ```bash
   vercel env pull
   ```

5. Run database migration:
   ```bash
   npx prisma migrate deploy
   ```

6. Create admin user:
   ```bash
   npx tsx scripts/setup.ts
   ```

### Method 2: Using Prisma Studio

1. Go to your Vercel project settings
2. Copy the `DATABASE_URL` from environment variables
3. On your local machine, create a `.env` file:
   ```
   DATABASE_URL=your_production_database_url
   ```

4. Run migrations:
   ```bash
   npx prisma migrate deploy
   ```

5. Create admin user:
   ```bash
   npx tsx scripts/setup.ts
   ```

### Method 3: Manual Database Setup

1. Use Prisma Studio or your database provider's interface
2. Create the tables manually using the schema from `prisma/schema.prisma`
3. Insert an admin user:
   ```sql
   INSERT INTO "User" (id, username, password, "isAdmin", "createdAt", "updatedAt")
   VALUES (
     gen_random_uuid(),
     'admin',
     '$2a$10$YourHashedPasswordHere',
     true,
     NOW(),
     NOW()
   );
   ```

Note: Generate the password hash using bcrypt with the password "admin123"

## Step 6: Access Your Application

1. Once deployment is complete, Vercel will provide a URL (e.g., `your-app.vercel.app`)
2. Visit the URL
3. Login with:
   - Username: `admin`
   - Password: `admin123`

## Step 7: Custom Domain (Optional)

1. Go to your Vercel project settings
2. Navigate to "Domains"
3. Add your custom domain and follow the DNS configuration instructions

## Troubleshooting

### Build Failures

**Issue**: Prisma client generation fails
- **Solution**: Ensure `DATABASE_URL` is set in environment variables
- Add `PRISMA_ENGINES_CHECKSUM_IGNORE_MISSING=1` if needed

**Issue**: Database connection fails
- **Solution**: Check that your `DATABASE_URL` is correct
- Ensure your database allows connections from Vercel's IP addresses

### Database Issues

**Issue**: Tables don't exist
- **Solution**: Run `npx prisma migrate deploy` or `npx prisma db push`

**Issue**: Cannot login
- **Solution**: Ensure admin user was created using the setup script

### Environment Variables

**Issue**: Changes not reflecting
- **Solution**: Redeploy the application after changing environment variables
- Environment variable changes require a new deployment

## Production Checklist

Before going live:

- [ ] Change default admin password
- [ ] Set up custom domain
- [ ] Configure production database with backups
- [ ] Review and adjust environment variables
- [ ] Test user creation and session tracking
- [ ] Set up monitoring and logging
- [ ] Configure CORS if needed
- [ ] Review security settings

## Automatic Deployments

Vercel automatically deploys:
- **Production**: When you push to the main branch
- **Preview**: When you push to feature branches or create PRs

Every push to your GitHub repository will trigger a new deployment.

## Database Migrations

When you update the database schema:

1. Create a migration locally:
   ```bash
   npx prisma migrate dev --name description_of_changes
   ```

2. Commit the migration files to Git

3. Push to GitHub - Vercel will automatically run migrations during deployment

## Support

For more information:
- Vercel Documentation: https://vercel.com/docs
- Prisma Documentation: https://www.prisma.io/docs
- Next.js Documentation: https://nextjs.org/docs

## Cost Considerations

### Free Tier Limits (Vercel)
- Unlimited deployments
- 100 GB bandwidth per month
- Serverless function execution time limits

### Database Costs
- **Vercel Postgres**: Free tier available with limits
- **Supabase**: Free tier includes 500MB database
- **Neon**: Free tier with generous limits

Monitor your usage to avoid unexpected charges.
