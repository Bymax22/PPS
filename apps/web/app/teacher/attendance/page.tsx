'use client'
import React, { useEffect, useState } from 'react'

function AttendancePage() {
  const [classes, setClasses] = useState<any[]>([])
  const [selectedClass, setSelectedClass] = useState<string | null>(null)
  const [students, setStudents] = useState<any[]>([])
  const [attendance, setAttendance] = useState<Record<string, any>>({})
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetch('/api/teacher/classes').then(r => r.json()).then(data => {
      setClasses(data)
      if (data[0]) setSelectedClass(data[0].id)
    }).catch(() => {})
  }, [])

  useEffect(() => {
    if (!selectedClass) return
    const cls = classes.find(c => c.id === selectedClass)
    setStudents(cls?.students || [])
    // initialize attendance status to PRESENT
    const init: any = {};

(cls?.students || []).forEach((s: any) => {
  init[s.id] = {
    status: 'PRESENT',
    remarks: ''
  }
})
    setAttendance(init)
  }, [selectedClass, classes])

  function setStatus(userId: string, status: string) {
    setAttendance(prev => ({ ...prev, [userId]: { ...(prev[userId] || {}), status } }))
  }

  function setRemarks(userId: string, remarks: string) {
    setAttendance(prev => ({ ...prev, [userId]: { ...(prev[userId] || {}), remarks } }))
  }

  async function save() {
    setSaving(true)
    try {
      const payload = { classId: selectedClass, date: new Date().toISOString(), attendance: Object.keys(attendance).map(userId => ({ userId, ...attendance[userId] })) }
      const res = await fetch('/api/teacher/attendance', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
      const data = await res.json()
      console.log('saved', data)
      // optionally show toast
    } catch (err) {
      console.error(err)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Take Attendance</h1>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Class</label>
        <select value={selectedClass || ''} onChange={(e) => setSelectedClass(e.target.value)} className="px-3 py-2 border rounded-lg">
          {classes.map(c => <option key={c.id} value={c.id}>{c.name} — Grade {c.grade} — {c.subject}</option>)}
        </select>
      </div>

      <div className="space-y-3">
        {students.map((s: any) => (
          <div key={s.id} className="p-3 rounded-lg bg-white shadow-sm flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center font-bold">{s.firstName[0]}{s.lastName[0]}</div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">{s.firstName} {s.lastName}</div>
                  <div className="text-xs text-gray-500">Grade {s.grade}</div>
                </div>
                <div className="flex items-center gap-2">
                  <select value={attendance[s.id]?.status || 'PRESENT'} onChange={(e) => setStatus(s.id, e.target.value)} className="px-2 py-1 border rounded">
                    <option value="PRESENT">Present</option>
                    <option value="ABSENT">Absent</option>
                    <option value="LATE">Late</option>
                    <option value="EXCUSED">Excused</option>
                    <option value="ONLINE">Online</option>
                  </select>
                </div>
              </div>
              <div className="mt-2">
                <input value={attendance[s.id]?.remarks || ''} onChange={(e) => setRemarks(s.id, e.target.value)} placeholder="Remarks (optional)" className="w-full px-2 py-1 border rounded" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6">
        <button onClick={save} disabled={saving} className="px-4 py-2 rounded bg-[#003087] text-white">{saving ? 'Saving...' : 'Save Attendance'}</button>
      </div>
    </div>
  )
}

export default AttendancePage
