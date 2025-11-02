# Setup Guide

This guide will help you set up and run the Roblox Activity Logger application.

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Initialize Database

```bash
npm run db:push
```

If you encounter Prisma binary download issues, try:

```bash
PRISMA_ENGINES_CHECKSUM_IGNORE_MISSING=1 npm run db:push
```

### 3. Create Admin User

```bash
npx tsx scripts/setup.ts
```

### 4. Start Development Server

```bash
npm run dev
```

### 5. Access the Application

Open your browser and navigate to `http://localhost:3000`

Login with:
- **Username**: `admin`
- **Password**: `admin123`

## Troubleshooting

### Prisma Binary Issues

If you're in an offline environment or behind a firewall:

1. Set environment variable:
   ```bash
   export PRISMA_ENGINES_CHECKSUM_IGNORE_MISSING=1
   ```

2. Or create a `.env` file with:
   ```
   PRISMA_ENGINES_CHECKSUM_IGNORE_MISSING=1
   ```

### Database Not Created

If the database file isn't created, manually run:

```bash
npx prisma generate
npx prisma db push
```

### Port Already in Use

If port 3000 is already in use, start on a different port:

```bash
PORT=3001 npm run dev
```

## Manual Database Setup (Alternative)

If automated setup doesn't work, you can manually create the SQLite database:

1. Create the database file:
   ```bash
   touch prisma/dev.db
   ```

2. Use Prisma Studio to view the database:
   ```bash
   npm run db:studio
   ```

## Verification Steps

After setup, verify everything works:

1. **Check Database**: The file `prisma/dev.db` should exist
2. **Check Tables**: Run `npx prisma studio` to view tables
3. **Check Admin User**: Login with admin/admin123
4. **Create Test User**: From admin dashboard, create a test user
5. **Test User Login**: Logout and login with test user credentials

## Next Steps

After successful setup:

1. Change the default admin password
2. Create additional user accounts
3. Customize the application as needed
4. Set up for production deployment

## Production Deployment

For production environments:

1. Use a proper database (PostgreSQL recommended)
2. Update `prisma/schema.prisma` datasource
3. Set strong passwords
4. Enable HTTPS
5. Configure environment variables
6. Set up proper backup procedures

## Support

If you encounter issues:

1. Check the main README.md for features and documentation
2. Verify all dependencies are installed
3. Ensure Node.js version 18+ is installed
4. Check console logs for error messages
