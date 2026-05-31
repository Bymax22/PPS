'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function TeacherSettingsPage() {
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [prefEmailNotifications, setPrefEmailNotifications] = useState(true)
  const [prefLightMode, setPrefLightMode] = useState(true)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    fetch('/api/teacher/dashboard')
      .then(async (res) => {
        if (!res.ok) throw new Error('Unable to load profile')
        return res.json()
      })
      .then((data) => {
        setProfile(data.teacher)
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : 'Unable to load profile')
      })
      .finally(() => setLoading(false))
  }, [])

  function savePreferences() {
    setSaved(true)
    window.setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="min-h-screen bg-slate-50 pt-[112px] lg:pt-[120px]">
      <div className="mx-auto max-w-5xl px-6 py-10">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Teacher settings</p>
            <h1 className="text-3xl font-semibold text-slate-900">Settings</h1>
          </div>
          <Link
            href="/teacher"
            className="inline-flex items-center rounded-full bg-[#003087] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#00286d]"
          >
            Back to Dashboard
          </Link>
        </div>

        {loading ? (
          <p className="text-slate-500">Loading settings…</p>
        ) : error ? (
          <p className="text-sm text-red-600">{error}</p>
        ) : (
          <div className="space-y-6">
            <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-slate-900">Profile</h2>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <InfoField label="Name" value={profile?.name ?? 'Teacher'} />
                <InfoField label="Email" value={profile?.email ?? 'Not available'} />
                <InfoField label="Role" value={profile?.role ?? 'Teacher'} />
              </div>
            </div>

            <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-slate-900">Preferences</h2>
              <div className="mt-5 space-y-4">
                <ToggleRow
                  label="Email notifications"
                  checked={prefEmailNotifications}
                  onChange={() => setPrefEmailNotifications((current) => !current)}
                />
                <ToggleRow
                  label="Light mode"
                  checked={prefLightMode}
                  onChange={() => setPrefLightMode((current) => !current)}
                />
              </div>
              <div className="mt-6 flex items-center gap-3">
                <button
                  type="button"
                  onClick={savePreferences}
                  className="rounded-2xl bg-[#003087] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#00286d]"
                >
                  Save preferences
                </button>
                {saved ? <p className="text-sm text-emerald-600">Preferences saved locally.</p> : null}
              </div>
            </div>

            <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-slate-900">Security</h2>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Use the portal settings to keep your account information up to date and configure how you hear about class updates and student progress.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function InfoField({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-3xl bg-slate-50 p-4">
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-2 text-base font-semibold text-slate-900">{value}</p>
    </div>
  )
}

function ToggleRow({ label, checked, onChange }: { label: string; checked: boolean; onChange: () => void }) {
  return (
    <button
      type="button"
      onClick={onChange}
      className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 w-full"
    >
      <span className="text-sm font-medium text-slate-900">{label}</span>
      <span className={`rounded-full px-3 py-1 text-sm font-semibold ${checked ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>
        {checked ? 'On' : 'Off'}
      </span>
    </button>
  )
}
