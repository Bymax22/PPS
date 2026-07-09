'use client'

import { useEffect, useState } from 'react'
import { AlertCircle, CheckCircle, Loader, Wifi, WifiOff } from 'lucide-react'

interface LiveKitStatus {
  status: 'checking' | 'healthy' | 'error'
  message: string
  details?: {
    apiKeyConfigured: boolean
    apiSecretConfigured: boolean
    liveKitUrl?: string
    tokenGenerated?: boolean
    tokenLength?: number
  }
  error?: string
}

export default function LiveKitTestPage() {
  const [status, setStatus] = useState<LiveKitStatus>({
    status: 'checking',
    message: 'Checking LiveKit configuration...',
  })
  const [tokenTest, setTokenTest] = useState<{
    status: 'idle' | 'loading' | 'success' | 'error'
    message: string
    token?: string
  }>({
    status: 'idle',
    message: 'Ready to fetch token',
  })

  // Check LiveKit health
  useEffect(() => {
    async function checkHealth() {
      try {
        const res = await fetch('/api/livekit/health')
        const data = await res.json()

        if (res.ok && data.status === 'healthy') {
          setStatus({
            status: 'healthy',
            message: '✅ LiveKit is properly configured',
            details: data.details,
          })
        } else {
          setStatus({
            status: 'error',
            message: data.message || 'LiveKit configuration failed',
            details: data.details,
            error: data.error,
          })
        }
      } catch (err: any) {
        setStatus({
          status: 'error',
          message: 'Failed to check LiveKit status',
          error: err?.message,
        })
      }
    }

    checkHealth()
  }, [])

  // Test token generation
  const testTokenGeneration = async () => {
    setTokenTest({ status: 'loading', message: 'Generating token...' })

    try {
      const res = await fetch('/api/livekit/token?room=test-room&host=false')

      if (!res.ok) {
        const error = await res.json()
        setTokenTest({
          status: 'error',
          message: `Token generation failed: ${error.error}`,
        })
        return
      }

      const data = await res.json()
      setTokenTest({
        status: 'success',
        message: `✅ Token generated successfully (${data.token.length} bytes)`,
        token: data.token,
      })
    } catch (err: any) {
      setTokenTest({
        status: 'error',
        message: `Error: ${err?.message}`,
      })
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8">LiveKit Status Check</h1>

        {/* Configuration Status */}
        <div className="bg-slate-700/50 rounded-lg p-6 mb-6 border border-slate-600">
          <div className="flex items-start gap-4">
            {status.status === 'checking' && (
              <Loader className="w-6 h-6 text-blue-400 animate-spin flex-shrink-0 mt-1" />
            )}
            {status.status === 'healthy' && (
              <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0 mt-1" />
            )}
            {status.status === 'error' && (
              <AlertCircle className="w-6 h-6 text-red-400 flex-shrink-0 mt-1" />
            )}

            <div className="flex-1">
              <h2 className="text-lg font-semibold text-white mb-2">Configuration Status</h2>
              <p className={`text-sm mb-3 ${
                status.status === 'healthy' ? 'text-green-300' :
                status.status === 'error' ? 'text-red-300' :
                'text-blue-300'
              }`}>
                {status.message}
              </p>

              {status.error && (
                <div className="bg-red-900/30 rounded p-3 mb-3 border border-red-700">
                  <p className="text-red-200 text-sm font-mono">{status.error}</p>
                </div>
              )}

              {status.details && (
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between py-1 border-b border-slate-600">
                    <span className="text-slate-300">API Key:</span>
                    <span className={status.details.apiKeyConfigured ? 'text-green-300' : 'text-red-300'}>
                      {status.details.apiKeyConfigured ? '✓ Configured' : '✗ Missing'}
                    </span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-600">
                    <span className="text-slate-300">API Secret:</span>
                    <span className={status.details.apiSecretConfigured ? 'text-green-300' : 'text-red-300'}>
                      {status.details.apiSecretConfigured ? '✓ Configured' : '✗ Missing'}
                    </span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-600">
                    <span className="text-slate-300">LiveKit URL:</span>
                    <span className="text-slate-400 font-mono text-xs">{status.details.liveKitUrl}</span>
                  </div>
                  {status.details.tokenGenerated && (
                    <div className="flex justify-between py-1">
                      <span className="text-slate-300">Token Generation:</span>
                      <span className="text-green-300">✓ Working ({status.details.tokenLength} bytes)</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Token Generation Test */}
        <div className="bg-slate-700/50 rounded-lg p-6 border border-slate-600">
          <div className="flex items-start gap-4">
            {tokenTest.status === 'idle' && (
              <Wifi className="w-6 h-6 text-slate-400 flex-shrink-0 mt-1" />
            )}
            {tokenTest.status === 'loading' && (
              <Loader className="w-6 h-6 text-blue-400 animate-spin flex-shrink-0 mt-1" />
            )}
            {tokenTest.status === 'success' && (
              <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0 mt-1" />
            )}
            {tokenTest.status === 'error' && (
              <AlertCircle className="w-6 h-6 text-red-400 flex-shrink-0 mt-1" />
            )}

            <div className="flex-1">
              <h2 className="text-lg font-semibold text-white mb-3">Token Generation Test</h2>

              <p className={`text-sm mb-4 ${
                tokenTest.status === 'success' ? 'text-green-300' :
                tokenTest.status === 'error' ? 'text-red-300' :
                'text-slate-300'
              }`}>
                {tokenTest.message}
              </p>

              {tokenTest.token && (
                <div className="bg-slate-800/50 rounded p-3 mb-4 border border-slate-600">
                  <p className="text-xs text-slate-400 mb-2">Generated Token (first 100 chars):</p>
                  <p className="text-xs text-slate-300 font-mono break-all">{tokenTest.token.substring(0, 100)}...</p>
                </div>
              )}

              <button
                onClick={testTokenGeneration}
                disabled={tokenTest.status === 'loading' || status.status === 'error'}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 disabled:cursor-not-allowed text-white rounded font-semibold transition-colors"
              >
                {tokenTest.status === 'loading' ? 'Testing...' : 'Test Token Generation'}
              </button>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="mt-8 bg-slate-700/30 rounded-lg p-6 border border-slate-600">
          <h3 className="text-lg font-semibold text-white mb-4">Next Steps</h3>
          <ul className="space-y-2 text-sm text-slate-300">
            <li>✓ LiveKit SDK packages are installed</li>
            <li className={status.status === 'healthy' ? '✓' : '✗'} > Configuration is {status.status === 'healthy' ? 'valid' : 'invalid'}</li>
            <li>✓ Go to <code className="bg-slate-800 px-2 py-1 rounded text-slate-200">/student/lessons/[id]</code> to test live lessons</li>
            <li>✓ Go to <code className="bg-slate-800 px-2 py-1 rounded text-slate-200">/teacher/lessons/[id]</code> to start a lesson</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
