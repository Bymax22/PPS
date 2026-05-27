import PortalLayout from '@/components/PortalLayout'
import DashboardCard from '@/components/dashboard/DashboardCard'
import { Calendar, BarChart2, PlayCircle } from 'lucide-react'

export default function StudentPage() {
  return (
    <PortalLayout role="student">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Welcome back — Student</h1>
        <p className="text-sm text-gray-500 mt-1">Quick overview of your classes, progress and upcoming lessons.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <DashboardCard title="Upcoming Lessons">
            <ul className="space-y-3">
              <li className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <PlayCircle className="w-5 h-5 text-[#003087]" />
                  <div>
                    <div className="font-medium">Math — Algebra II</div>
                    <div className="text-xs text-gray-400">Tomorrow, 10:00 AM</div>
                  </div>
                </div>
                <div className="text-xs text-gray-500">Join</div>
              </li>
            </ul>
          </DashboardCard>

          <DashboardCard title="Progress">
            <div className="flex items-center gap-4">
              <BarChart2 className="w-8 h-8 text-emerald-500" />
              <div>
                <div className="text-lg font-semibold">72%</div>
                <div className="text-xs text-gray-400">Average completion across enrolled courses</div>
              </div>
            </div>
          </DashboardCard>
        </div>

        <div className="space-y-6">
          <DashboardCard title="Today's Schedule">
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-[#001f5b]" />
              <div>
                <div className="text-sm">10:00 AM — Algebra II</div>
                <div className="text-xs text-gray-400">Join live class or watch recording</div>
              </div>
            </div>
          </DashboardCard>

          <DashboardCard title="Quick Actions">
            <div className="flex flex-col gap-2">
              <a className="text-sm text-[#003087] hover:underline">View assignments</a>
              <a className="text-sm text-[#003087] hover:underline">View invoices</a>
              <a className="text-sm text-[#003087] hover:underline">Contact teacher</a>
            </div>
          </DashboardCard>
        </div>
      </div>
    </PortalLayout>
  )
}
