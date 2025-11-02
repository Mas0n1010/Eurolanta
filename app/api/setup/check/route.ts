import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    // Check if database is accessible
    await prisma.$connect()

    // Check if User table exists and has data
    const userCount = await prisma.user.count()
    const adminCount = await prisma.user.count({
      where: { isAdmin: true }
    })

    // Check if default admin exists
    const defaultAdmin = await prisma.user.findUnique({
      where: { username: 'admin' }
    })

    await prisma.$disconnect()

    const setupStatus = {
      databaseConnected: true,
      tablesExist: true,
      totalUsers: userCount,
      adminUsers: adminCount,
      defaultAdminExists: !!defaultAdmin,
      setupComplete: userCount > 0 && adminCount > 0,
    }

    let message = ''
    let nextSteps: string[] = []

    if (!setupStatus.setupComplete) {
      if (userCount === 0) {
        message = 'Database is empty. Please create the admin user.'
        nextSteps.push('Run: npx tsx scripts/setup.ts')
      } else if (adminCount === 0) {
        message = 'No admin users found. Please create an admin user.'
        nextSteps.push('Run: npx tsx scripts/setup.ts')
      }
    } else {
      message = 'Setup complete! You can login.'
      if (defaultAdmin) {
        nextSteps.push('Login with username: admin, password: admin123')
        nextSteps.push('IMPORTANT: Change the default password after first login')
      }
    }

    return NextResponse.json({
      ...setupStatus,
      message,
      nextSteps,
    })
  } catch (error: any) {
    console.error('Setup check error:', error)

    let errorDetails = {
      databaseConnected: false,
      tablesExist: false,
      error: error.message,
      code: error.code,
      message: '',
      nextSteps: [] as string[],
    }

    if (error.code === 'P1001') {
      errorDetails.message = 'Cannot connect to database'
      errorDetails.nextSteps = [
        'Set DATABASE_URL environment variable',
        'Example: DATABASE_URL=postgresql://user:pass@host:5432/db'
      ]
    } else if (error.code === 'P2021') {
      errorDetails.databaseConnected = true
      errorDetails.message = 'Database tables do not exist'
      errorDetails.nextSteps = [
        'Run: npx prisma db push',
        'Then run: npx tsx scripts/setup.ts'
      ]
    } else if (!process.env.DATABASE_URL) {
      errorDetails.message = 'DATABASE_URL environment variable is not set'
      errorDetails.nextSteps = [
        'Set DATABASE_URL in your environment variables',
        'For Vercel: Add in project settings',
        'For local: Create .env file with DATABASE_URL'
      ]
    } else {
      errorDetails.message = 'Database error'
      errorDetails.nextSteps = [
        'Check database connection',
        'Verify DATABASE_URL is correct',
        'Run: npx prisma generate',
        'Run: npx prisma db push'
      ]
    }

    return NextResponse.json(errorDetails, { status: 500 })
  }
}
