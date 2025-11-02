'use client'

import { useState, useEffect } from 'react'

interface SetupStatus {
  databaseConnected?: boolean
  tablesExist?: boolean
  totalUsers?: number
  adminUsers?: number
  defaultAdminExists?: boolean
  setupComplete?: boolean
  message?: string
  nextSteps?: string[]
  error?: string
  code?: string
}

export default function SetupPage() {
  const [status, setStatus] = useState<SetupStatus | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkSetup()
  }, [])

  const checkSetup = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/setup/check')
      const data = await response.json()
      setStatus(data)
    } catch (error) {
      setStatus({
        error: 'Failed to check setup status',
        message: 'Cannot connect to the API'
      })
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Checking setup status...</p>
          </div>
        </div>
      </div>
    )
  }

  const isSuccess = status?.setupComplete

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl w-full">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Roblox Activity Logger
          </h1>
          <p className="text-gray-600">Setup Status</p>
        </div>

        <div className={`rounded-lg p-6 mb-6 ${
          isSuccess ? 'bg-green-50 border-2 border-green-200' : 'bg-yellow-50 border-2 border-yellow-200'
        }`}>
          <div className="flex items-start">
            <div className="flex-shrink-0">
              {isSuccess ? (
                <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              ) : (
                <svg className="h-8 w-8 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              )}
            </div>
            <div className="ml-4 flex-1">
              <h3 className={`text-lg font-semibold ${
                isSuccess ? 'text-green-800' : 'text-yellow-800'
              }`}>
                {status?.message || 'Setup Status'}
              </h3>
            </div>
          </div>
        </div>

        <div className="space-y-4 mb-6">
          <h2 className="text-xl font-semibold text-gray-800">Status Checks</h2>

          <div className="space-y-2">
            <StatusItem
              label="Database Connected"
              status={status?.databaseConnected}
              error={!status?.databaseConnected && status?.error}
            />
            <StatusItem
              label="Tables Exist"
              status={status?.tablesExist}
            />
            <StatusItem
              label="Users Created"
              status={(status?.totalUsers ?? 0) > 0}
              detail={status?.totalUsers ? `${status.totalUsers} user(s)` : undefined}
            />
            <StatusItem
              label="Admin User Exists"
              status={(status?.adminUsers ?? 0) > 0}
              detail={status?.adminUsers ? `${status.adminUsers} admin(s)` : undefined}
            />
            <StatusItem
              label="Default Admin (username: admin)"
              status={status?.defaultAdminExists}
            />
          </div>
        </div>

        {status?.error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700 font-medium">Error</p>
                <p className="text-sm text-red-600 mt-1">{status.error}</p>
                {status.code && (
                  <p className="text-xs text-red-500 mt-1 font-mono">Code: {status.code}</p>
                )}
              </div>
            </div>
          </div>
        )}

        {status?.nextSteps && status.nextSteps.length > 0 && (
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
            <h3 className="text-sm font-semibold text-blue-800 mb-2">Next Steps:</h3>
            <ol className="list-decimal list-inside space-y-1">
              {status.nextSteps.map((step, index) => (
                <li key={index} className="text-sm text-blue-700 font-mono">
                  {step}
                </li>
              ))}
            </ol>
          </div>
        )}

        <div className="flex space-x-4">
          <button
            onClick={checkSetup}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-200"
          >
            Recheck Status
          </button>
          {isSuccess && (
            <a
              href="/"
              className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 text-center"
            >
              Go to Login
            </a>
          )}
        </div>

        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-sm font-semibold text-gray-700 mb-2">Quick Setup Guide</h3>
          <div className="text-sm text-gray-600 space-y-1">
            <p><strong>1.</strong> Set DATABASE_URL environment variable</p>
            <p><strong>2.</strong> Run: <code className="bg-gray-200 px-2 py-1 rounded">npx prisma db push</code></p>
            <p><strong>3.</strong> Run: <code className="bg-gray-200 px-2 py-1 rounded">npx tsx scripts/setup.ts</code></p>
            <p><strong>4.</strong> Login with username: <code className="bg-gray-200 px-2 py-1 rounded">admin</code> password: <code className="bg-gray-200 px-2 py-1 rounded">admin123</code></p>
          </div>
        </div>
      </div>
    </div>
  )
}

function StatusItem({ label, status, detail, error }: {
  label: string
  status?: boolean
  detail?: string
  error?: string
}) {
  return (
    <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
      <div className="flex-1">
        <span className="text-sm font-medium text-gray-700">{label}</span>
        {detail && <span className="text-xs text-gray-500 ml-2">({detail})</span>}
        {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
      </div>
      <div>
        {status === true ? (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            ✓ OK
          </span>
        ) : status === false ? (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            ✗ Failed
          </span>
        ) : (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            ? Unknown
          </span>
        )}
      </div>
    </div>
  )
}
