import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    // Test database connection
    await prisma.$connect()

    // Try to query the database
    const userCount = await prisma.user.count()

    await prisma.$disconnect()

    return NextResponse.json({
      status: 'ok',
      database: 'connected',
      userCount,
      timestamp: new Date().toISOString(),
    })
  } catch (error: any) {
    console.error('Health check error:', error)

    let diagnostics = {
      status: 'error',
      database: 'disconnected',
      error: error.message,
      code: error.code,
    }

    // Provide specific error diagnostics
    if (error.code === 'P1001') {
      diagnostics.error = 'Cannot reach database server'
      diagnostics['solution'] = 'Check DATABASE_URL environment variable'
    } else if (error.code === 'P2021') {
      diagnostics.error = 'Table does not exist in database'
      diagnostics['solution'] = 'Run: npx prisma db push'
    } else if (error.message?.includes('prisma')) {
      diagnostics['solution'] = 'Prisma client may not be generated. Run: npx prisma generate'
    }

    return NextResponse.json(diagnostics, { status: 500 })
  }
}
