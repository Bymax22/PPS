import PortalLayout from '@/components/PortalLayout'
import DashboardCard from '@/components/dashboard/DashboardCard'
import { Calendar, Users, FileText } from 'lucide-react'

export default function TeacherPage() {
  return (
    <PortalLayout role="teacher">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Teacher Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">Manage classes, lessons and grading.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <DashboardCard title="Today — Schedule">
            <ul className="space-y-2 text-sm">
              <li className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-[#003087]" />
                  <div>
                    <div className="font-medium">Grade 10 — Physics</div>
                    <div className="text-xs text-gray-400">11:00 AM — 12:00 PM</div>
                  </div>
                </div>
                <div className="text-xs text-gray-500">Start</div>
              </li>
            </ul>
          </DashboardCard>

          <DashboardCard title="To Grade">
            <div className="text-sm">2 assignments awaiting grading</div>
          </DashboardCard>
        </div>

        <div className="space-y-6">
          <DashboardCard title="Class Roster">
            <div className="flex items-center gap-3">
              <Users className="w-5 h-5 text-[#001f5b]" />
              <div className="text-sm">Manage attendees and send notices</div>
            </div>
          </DashboardCard>

          <DashboardCard title="Resources & Uploads">
            <div className="flex items-center gap-3">
              <FileText className="w-5 h-5 text-emerald-500" />
              <div className="text-sm">Upload lesson materials and recordings</div>
            </div>
          </DashboardCard>
        </div>
      </div>
    </PortalLayout>
  )
}
