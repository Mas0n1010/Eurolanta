'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { formatDistanceToNow, format } from 'date-fns'

interface Session {
  id: string
  startTime: string
  endTime: string | null
  ipAddress: string | null
  userAgent: string | null
  createdAt: string
}

interface ActivityLog {
  id: string
  action: string
  details: string | null
  timestamp: string
}

interface UserDetail {
  id: string
  username: string
  isAdmin: boolean
  robloxUsername: string | null
  createdAt: string
  sessions: Session[]
  activityLogs: ActivityLog[]
}

export default function UserDetailPage() {
  const [user, setUser] = useState<UserDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'sessions' | 'activity'>('sessions')
  const router = useRouter()
  const params = useParams()
  const userId = params.id as string

  useEffect(() => {
    checkAuth()
    fetchUser()
  }, [userId])

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/auth/me')
      if (!response.ok) {
        router.push('/')
        return
      }
      const data = await response.json()
      if (!data.user.isAdmin) {
        router.push('/dashboard')
      }
    } catch (err) {
      router.push('/')
    }
  }

  const fetchUser = async () => {
    try {
      const response = await fetch(`/api/users/${userId}`)
      const data = await response.json()
      if (response.ok) {
        setUser(data.user)
      }
    } catch (err) {
      console.error('Failed to fetch user:', err)
    } finally {
      setLoading(false)
    }
  }

  const calculateSessionDuration = (startTime: string, endTime: string | null) => {
    const start = new Date(startTime)
    const end = endTime ? new Date(endTime) : new Date()
    const durationMs = end.getTime() - start.getTime()
    const hours = Math.floor(durationMs / (1000 * 60 * 60))
    const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60))
    return `${hours}h ${minutes}m`
  }

  const getTotalSessionTime = () => {
    if (!user) return '0h 0m'

    const totalMs = user.sessions.reduce((acc, session) => {
      const start = new Date(session.startTime)
      const end = session.endTime ? new Date(session.endTime) : new Date()
      return acc + (end.getTime() - start.getTime())
    }, 0)

    const hours = Math.floor(totalMs / (1000 * 60 * 60))
    const minutes = Math.floor((totalMs % (1000 * 60 * 60)) / (1000 * 60))
    return `${hours}h ${minutes}m`
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">User not found</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push('/admin')}
                className="text-blue-600 hover:text-blue-800"
              >
                ← Back to Dashboard
              </button>
              <div className="border-l border-gray-300 h-6"></div>
              <h1 className="text-2xl font-bold text-gray-900">
                User Details
              </h1>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <p className="text-sm text-gray-600">Username</p>
              <p className="text-lg font-semibold text-gray-900">{user.username}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Roblox Username</p>
              <p className="text-lg font-semibold text-gray-900">
                {user.robloxUsername || 'Not set'}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Role</p>
              <span
                className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${
                  user.isAdmin
                    ? 'bg-purple-100 text-purple-800'
                    : 'bg-green-100 text-green-800'
                }`}
              >
                {user.isAdmin ? 'Admin' : 'User'}
              </span>
            </div>
            <div>
              <p className="text-sm text-gray-600">Member Since</p>
              <p className="text-lg font-semibold text-gray-900">
                {format(new Date(user.createdAt), 'MMM d, yyyy')}
              </p>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-blue-50 rounded-lg p-4">
                <p className="text-sm text-blue-700">Total Sessions</p>
                <p className="text-3xl font-bold text-blue-900">{user.sessions.length}</p>
              </div>
              <div className="bg-green-50 rounded-lg p-4">
                <p className="text-sm text-green-700">Total Time Logged</p>
                <p className="text-3xl font-bold text-green-900">{getTotalSessionTime()}</p>
              </div>
              <div className="bg-purple-50 rounded-lg p-4">
                <p className="text-sm text-purple-700">Activity Logs</p>
                <p className="text-3xl font-bold text-purple-900">{user.activityLogs.length}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab('sessions')}
                className={`py-4 px-6 text-sm font-medium border-b-2 ${
                  activeTab === 'sessions'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Sessions ({user.sessions.length})
              </button>
              <button
                onClick={() => setActiveTab('activity')}
                className={`py-4 px-6 text-sm font-medium border-b-2 ${
                  activeTab === 'activity'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Activity Logs ({user.activityLogs.length})
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'sessions' ? (
              <div className="space-y-4">
                {user.sessions.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No sessions found</p>
                ) : (
                  user.sessions.map((session) => (
                    <div
                      key={session.id}
                      className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <span
                              className={`inline-flex px-2 py-1 text-xs font-semibold rounded ${
                                session.endTime
                                  ? 'bg-gray-100 text-gray-700'
                                  : 'bg-green-100 text-green-700'
                              }`}
                            >
                              {session.endTime ? 'Ended' : 'Active'}
                            </span>
                            <span className="text-sm text-gray-600">
                              Duration: {calculateSessionDuration(session.startTime, session.endTime)}
                            </span>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                            <div>
                              <span className="text-gray-600">Start:</span>{' '}
                              <span className="text-gray-900">
                                {format(new Date(session.startTime), 'MMM d, yyyy HH:mm:ss')}
                              </span>
                            </div>
                            {session.endTime && (
                              <div>
                                <span className="text-gray-600">End:</span>{' '}
                                <span className="text-gray-900">
                                  {format(new Date(session.endTime), 'MMM d, yyyy HH:mm:ss')}
                                </span>
                              </div>
                            )}
                            {session.ipAddress && (
                              <div>
                                <span className="text-gray-600">IP:</span>{' '}
                                <span className="text-gray-900">{session.ipAddress}</span>
                              </div>
                            )}
                            {session.userAgent && (
                              <div className="md:col-span-2">
                                <span className="text-gray-600">User Agent:</span>{' '}
                                <span className="text-gray-900 text-xs">{session.userAgent}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            ) : (
              <div className="space-y-3">
                {user.activityLogs.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No activity logs found</p>
                ) : (
                  user.activityLogs.map((log) => (
                    <div
                      key={log.id}
                      className="border-l-4 border-blue-500 bg-gray-50 p-4 rounded"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="font-semibold text-gray-900">{log.action}</span>
                            <span className="text-xs text-gray-500">
                              {formatDistanceToNow(new Date(log.timestamp), { addSuffix: true })}
                            </span>
                          </div>
                          {log.details && (
                            <p className="text-sm text-gray-700">{log.details}</p>
                          )}
                          <p className="text-xs text-gray-500 mt-1">
                            {format(new Date(log.timestamp), 'MMM d, yyyy HH:mm:ss')}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
