import { NextResponse } from 'next/server'
import { deleteSession, getCurrentUser, logActivity } from '@/lib/auth'

export async function POST() {
  try {
    const user = await getCurrentUser()

    if (user) {
      await logActivity(user.id, 'LOGOUT', 'Logged out')
    }

    await deleteSession()

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Logout error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
