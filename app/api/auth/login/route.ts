import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyPassword, createSession, logActivity } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json()

    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username and password are required' },
        { status: 400 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { username },
    })

    if (!user || !(await verifyPassword(password, user.password))) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    const ipAddress = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || undefined
    const userAgent = request.headers.get('user-agent') || undefined

    await createSession(user.id, ipAddress, userAgent)
    await logActivity(user.id, 'LOGIN', `Logged in from ${ipAddress}`)

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        isAdmin: user.isAdmin,
        robloxUsername: user.robloxUsername,
      },
    })
  } catch (error: any) {
    console.error('Login error:', error)

    // Provide more specific error messages
    let errorMessage = 'Internal server error'

    if (error.message?.includes('prisma')) {
      errorMessage = 'Database connection error. Please ensure the database is set up correctly.'
    } else if (error.code === 'P2021') {
      errorMessage = 'Database table does not exist. Please run database migrations.'
    } else if (error.code === 'P1001') {
      errorMessage = 'Cannot reach database server. Please check DATABASE_URL.'
    }

    return NextResponse.json(
      {
        error: errorMessage,
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    )
  }
}
