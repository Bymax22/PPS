'use client'

import { useEffect, useState } from 'react'
import { AlertCircle, CheckCircle, Loader, AlertTriangle, Wifi } from 'lucide-react'

interface FeatureDiagnostics {
  timestamp: string
  checks: Record<string, boolean>
  details: Record<string, any>
  issues: string[]
  error?: string
}

export default function FeatureDiagnosticsPage() {
  const [diagnostics, setDiagnostics] = useState<FeatureDiagnostics | null>(null)
  const [loading, setLoading] = useState(true)
  const [autoRefresh, setAutoRefresh] = useState(false)

  const fetchDiagnostics = async () => {
    try {
      const res = await fetch('/api/diagnostics/features')
      const data = await res.json()
      setDiagnostics(data)
    } catch (err) {
      console.error('Failed to fetch diagnostics:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDiagnostics()

    let interval: NodeJS.Timeout
    if (autoRefresh) {
      interval = setInterval(fetchDiagnostics, 5000) // Refresh every 5 seconds
    }

    return () => clearInterval(interval)
  }, [autoRefresh])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 text-blue-400 animate-spin mx-auto mb-4" />
          <p className="text-slate-300">Loading diagnostics...</p>
        </div>
      </div>
    )
  }

  if (!diagnostics) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-900/30 border border-red-700 rounded-lg p-6 text-center">
            <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
            <p className="text-red-300">Failed to load diagnostics</p>
          </div>
        </div>
      </div>
    )
  }

  const allHealthy = Object.values(diagnostics.checks).every(v => v === true)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Feature Diagnostics</h1>
          <p className="text-slate-400">Real-time status check for all LMS features</p>
        </div>

        {/* Overall Status */}
        <div className={`rounded-lg p-6 mb-8 border ${ allHealthy
            ? 'bg-green-900/20 border-green-700'
            : 'bg-yellow-900/20 border-yellow-700'
          }`}>
          <div className="flex items-center gap-4">
            {allHealthy ? (
              <CheckCircle className="w-8 h-8 text-green-400" />
            ) : (
              <AlertTriangle className="w-8 h-8 text-yellow-400" />
            )}
            <div className="flex-1">
              <p className={`text-lg font-semibold ${allHealthy ? 'text-green-300' : 'text-yellow-300'}`}>
                {allHealthy ? '✓ All Systems Operational' : '⚠ Some Features Need Attention'}
              </p>
              <p className="text-sm text-slate-400 mt-1">
                Last updated: {new Date(diagnostics.timestamp).toLocaleTimeString()}
              </p>
            </div>
            <button
              onClick={fetchDiagnostics}
              disabled={loading}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded font-semibold transition-colors disabled:bg-slate-600"
            >
              Refresh
            </button>
            <button
              onClick={() => setAutoRefresh(!autoRefresh)}
              className={`px-4 py-2 rounded font-semibold transition-colors ${
                autoRefresh
                  ? 'bg-green-600 hover:bg-green-700 text-white'
                  : 'bg-slate-700 hover:bg-slate-600 text-slate-300'
              }`}
            >
              {autoRefresh ? '◉ Live' : '○ Manual'}
            </button>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Database */}
          <FeatureCard
            title="Database Connection"
            status={diagnostics.checks.database}
            icon="database"
            details={diagnostics.details.database}
          />

          {/* Subjects */}
          <FeatureCard
            title="Subjects Management"
            status={diagnostics.checks.subjects}
            icon="book"
            details={diagnostics.details.subjects}
          />

          {/* Resources */}
          <FeatureCard
            title="Resource Uploads"
            status={diagnostics.checks.resources}
            icon="upload"
            details={diagnostics.details.resources}
          />

          {/* Grades */}
          <FeatureCard
            title="Grades & Exams"
            status={diagnostics.checks.grades}
            icon="chart"
            details={diagnostics.details.grades}
          />

          {/* Online Enrollment */}
          <FeatureCard
            title="Online Learning"
            status={diagnostics.checks.onlineEnrollment}
            icon="globe"
            details={diagnostics.details.onlineEnrollment}
          />

          {/* Cloudinary */}
          <FeatureCard
            title="File Upload Service"
            status={diagnostics.checks.cloudinary}
            icon="cloud"
            details={diagnostics.details.cloudinary}
          />
        </div>

        {/* Issues Section */}
        {diagnostics.issues.length > 0 && (
          <div className="bg-yellow-900/20 border border-yellow-700 rounded-lg p-6 mb-8">
            <h3 className="text-lg font-semibold text-yellow-300 mb-4 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Items Needing Attention
            </h3>
            <ul className="space-y-3">
              {diagnostics.issues.map((issue, i) => (
                <li key={i} className="flex gap-3 text-sm text-yellow-200">
                  <span className="text-yellow-400 mt-1">•</span>
                  <span>{issue}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Setup Guide */}
        <div className="bg-slate-700/50 rounded-lg p-6 border border-slate-600">
          <h3 className="text-lg font-semibold text-white mb-4">Setup Checklist</h3>
          <div className="space-y-3">
            <ChecklistItem
              done={diagnostics.checks.database}
              label="Database connected and working"
            />
            <ChecklistItem
              done={diagnostics.checks.subjects}
              label="Subjects created in admin panel"
            />
            <ChecklistItem
              done={diagnostics.checks.cloudinary}
              label="Cloudinary configured for file uploads"
            />
            <ChecklistItem
              done={diagnostics.checks.resources}
              label="Teachers uploading resources"
            />
            <ChecklistItem
              done={diagnostics.checks.grades}
              label="Grading system active (students taking exams)"
            />
            <ChecklistItem
              done={diagnostics.checks.onlineEnrollment}
              label="Students enrolled in online program"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

function FeatureCard({
  title,
  status,
  icon,
  details,
}: {
  title: string
  status: boolean
  icon: string
  details: any
}) {
  return (
    <div className={`rounded-lg p-6 border transition-all ${
      status
        ? 'bg-slate-700/30 border-green-700/50'
        : 'bg-slate-700/20 border-yellow-700/50'
    }`}>
      <div className="flex items-start gap-4 mb-4">
        <div className={`p-3 rounded-lg ${status ? 'bg-green-900/30' : 'bg-yellow-900/30'}`}>
          {status ? (
            <CheckCircle className="w-6 h-6 text-green-400" />
          ) : (
            <AlertTriangle className="w-6 h-6 text-yellow-400" />
          )}
        </div>
        <div>
          <h3 className="text-white font-semibold">{title}</h3>
          <p className={`text-sm ${status ? 'text-green-400' : 'text-yellow-400'}`}>
            {status ? '✓ Working' : '⚠ Check Status'}
          </p>
        </div>
      </div>

      {details && (
        <div className="text-xs space-y-2 text-slate-300">
          {details.count !== undefined && (
            <div className="flex justify-between py-1 border-t border-slate-600 pt-2">
              <span>Total:</span>
              <span className="font-mono text-slate-200">{details.count}</span>
            </div>
          )}
          {details.error && (
            <div className="text-red-400 py-2">
              Error: {String(details.error).substring(0, 100)}...
            </div>
          )}
          {details.sample && (
            <div className="mt-3 pt-3 border-t border-slate-600">
              <p className="text-slate-400 mb-2">Sample Data:</p>
              {Array.isArray(details.sample) && details.sample.length > 0 && (
                <div className="space-y-1 text-xs">
                  {details.sample.slice(0, 2).map((item: any, i: number) => (
                    <div key={i} className="text-slate-400">
                      {JSON.stringify(item, null, 2)
                        .split('\n')
                        .slice(0, 3)
                        .join(' ')}
                      ...
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function ChecklistItem({ done, label }: { done: boolean; label: string }) {
  return (
    <div className="flex items-center gap-3 text-slate-300">
      <div className={`w-5 h-5 rounded border flex items-center justify-center ${
        done
          ? 'bg-green-600 border-green-500'
          : 'bg-slate-600 border-slate-500'
      }`}>
        {done && <span className="text-white text-sm font-bold">✓</span>}
      </div>
      <span className={done ? 'text-slate-200' : 'text-slate-400'}>{label}</span>
    </div>
  )
}
