# Troubleshooting Guide

## Getting "Internal Server Error" on Login

If you're getting an internal server error when trying to login, follow these steps:

### Step 1: Check Setup Status

Visit the setup page to diagnose the issue:
```
https://your-app.vercel.app/setup
```

Or for local development:
```
http://localhost:3000/setup
```

This page will show you:
- ✓ Database connection status
- ✓ Whether tables exist
- ✓ If users have been created
- ✓ Specific error messages and solutions

### Step 2: Common Issues and Solutions

#### Issue: "Cannot reach database server"

**Cause:** DATABASE_URL environment variable is not set or incorrect

**Solution:**

1. **For Vercel:**
   - Go to your project settings → Environment Variables
   - Add `DATABASE_URL` with your database connection string
   - Redeploy the application

2. **For local development:**
   - Create a `.env` file in the project root
   - Add: `DATABASE_URL="postgresql://user:password@host:5432/database"`

#### Issue: "Database table does not exist"

**Cause:** Database tables haven't been created

**Solution:**

```bash
# Push the schema to create tables
npx prisma db push
```

#### Issue: "Invalid credentials" or "User not found"

**Cause:** Admin user hasn't been created

**Solution:**

```bash
# Create the default admin user
npx tsx scripts/setup.ts
```

This creates:
- Username: `admin`
- Password: `admin123`

### Step 3: Complete Setup Checklist

Run these commands in order:

```bash
# 1. Install dependencies
npm install

# 2. Generate Prisma client
npx prisma generate

# 3. Push database schema (creates tables)
npx prisma db push

# 4. Create admin user
npx tsx scripts/setup.ts

# 5. Start the application
npm run dev
```

### Step 4: Verify Database Connection

Test your database connection:

```bash
# Open Prisma Studio
npx prisma studio
```

This should open a web interface showing your database tables.

### Step 5: Check Environment Variables

**Verify DATABASE_URL is set:**

```bash
# For local development
cat .env

# For Vercel
vercel env pull
cat .env
```

**Valid DATABASE_URL formats:**

```bash
# PostgreSQL
DATABASE_URL="postgresql://user:password@host:5432/database"

# Vercel Postgres
DATABASE_URL="${POSTGRES_URL}"

# Supabase
DATABASE_URL="postgresql://postgres:[password]@db.[project].supabase.co:5432/postgres"
```

## Detailed Error Codes

### Prisma Error Codes

- **P1001**: Can't reach database server
  - Check DATABASE_URL
  - Ensure database is running
  - Check firewall/network settings

- **P2021**: Table does not exist
  - Run `npx prisma db push`
  - Or run `npx prisma migrate deploy`

- **P2002**: Unique constraint violation
  - Admin user already exists
  - Try logging in with existing credentials

- **P1008**: Connection timeout
  - Database server is too slow or unreachable
  - Check network connection
  - Try increasing connection timeout

## Health Check Endpoints

Use these API endpoints to diagnose issues:

### 1. Health Check
```bash
curl https://your-app.vercel.app/api/health
```

Returns database connection status.

### 2. Setup Check
```bash
curl https://your-app.vercel.app/api/setup/check
```

Returns detailed setup status and next steps.

## Getting More Information

### View Vercel Logs

1. Go to Vercel dashboard
2. Select your project
3. Click on a deployment
4. Click "Logs" or "Runtime Logs"
5. Look for error messages

### View Local Logs

Check the console where you ran `npm run dev` for error messages.

### Enable Debug Mode

For local development, add to your `.env`:
```
NODE_ENV=development
DEBUG=*
```

This will show more detailed error messages.

## Database Setup by Provider

### Vercel Postgres

```bash
# In Vercel dashboard
1. Storage → Create Database → Postgres
2. Environment Variables → Add:
   DATABASE_URL=${POSTGRES_URL}
3. Deploy the app
4. Run: vercel env pull
5. Run: npx prisma db push
6. Run: npx tsx scripts/setup.ts
```

### Supabase

```bash
# Get connection string from Supabase
1. Create project at supabase.com
2. Go to Settings → Database
3. Copy "Connection string" (URI mode)
4. Set DATABASE_URL to that string
5. Run: npx prisma db push
6. Run: npx tsx scripts/setup.ts
```

### Railway

```bash
# Get connection string from Railway
1. Create project at railway.app
2. Add PostgreSQL service
3. Copy DATABASE_URL from variables
4. Set in your environment
5. Run: npx prisma db push
6. Run: npx tsx scripts/setup.ts
```

## Still Having Issues?

1. Visit `/setup` page for diagnostics
2. Check Vercel deployment logs
3. Verify DATABASE_URL format is correct
4. Ensure database allows connections from Vercel
5. Try redeploying after setting environment variables

## Reset Everything

If you need to start fresh:

```bash
# WARNING: This deletes all data!

# Reset database
npx prisma migrate reset

# Or manually drop tables and recreate
npx prisma db push --force-reset

# Create admin user again
npx tsx scripts/setup.ts
```

## Contact & Support

- Check logs in Vercel dashboard
- Verify all environment variables are set
- Visit `/setup` page for automated diagnostics
- Ensure database is accessible and running
