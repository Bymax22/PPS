import PortalLayout from '@/components/PortalLayout'
import DashboardCard from '@/components/dashboard/DashboardCard'
import { Wallet, User, FileText } from 'lucide-react'

export default function ParentPage() {
  return (
    <PortalLayout role="parent">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Parent Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">Manage children, payments and academic progress.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <DashboardCard title="Child Overview">
            <div className="flex items-center gap-4">
              <User className="w-8 h-8 text-[#003087]" />
              <div>
                <div className="font-medium">Samuel — Grade 8</div>
                <div className="text-xs text-gray-400">72% course completion • Algebra II</div>
              </div>
            </div>
          </DashboardCard>

          <DashboardCard title="Recent Activities">
            <ul className="text-sm space-y-2">
              <li>Viewed Algebra II recording — 2 days ago</li>
              <li>Submitted Assignment — 5 days ago</li>
            </ul>
          </DashboardCard>
        </div>

        <div className="space-y-6">
          <DashboardCard title="Payments & Invoices">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Wallet className="w-5 h-5 text-emerald-500" />
                <div>
                  <div className="font-medium">No outstanding invoices</div>
                  <div className="text-xs text-gray-400">Last payment: 2026-01-12</div>
                </div>
              </div>
              <a className="text-sm text-[#003087] hover:underline">Manage payments</a>
            </div>
          </DashboardCard>

          <DashboardCard title="Resources">
            <div className="flex items-center gap-3">
              <FileText className="w-5 h-5 text-[#001f5b]" />
              <div className="text-sm">Download past papers, notes and worksheets</div>
            </div>
          </DashboardCard>
        </div>
      </div>
    </PortalLayout>
  )
}
