import PortalLayout from '@/components/PortalLayout'
import DashboardCard from '@/components/dashboard/DashboardCard'
import { Users, Database, BarChart2 } from 'lucide-react'

export default function AdminPage() {
  return (
    <PortalLayout role="admin">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Admin Console</h1>
        <p className="text-sm text-gray-500 mt-1">Overview of users, subscriptions and system health.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <DashboardCard title="Users & Roles">
          <div className="flex items-center gap-3">
            <Users className="w-6 h-6 text-[#003087]" />
            <div>
              <div className="font-medium">3,482 active users</div>
              <div className="text-xs text-gray-400">Last 30 days</div>
            </div>
          </div>
        </DashboardCard>

        <DashboardCard title="Subscriptions">
          <div className="flex items-center gap-3">
            <BarChart2 className="w-6 h-6 text-emerald-500" />
            <div>
              <div className="font-medium">1,023 active subscriptions</div>
              <div className="text-xs text-gray-400">Monthly recurring</div>
            </div>
          </div>
        </DashboardCard>

        <DashboardCard title="System Health">
          <div className="flex items-center gap-3">
            <Database className="w-6 h-6 text-[#001f5b]" />
            <div className="text-sm">DB connections: healthy • Background jobs: idle</div>
          </div>
        </DashboardCard>
      </div>
    </PortalLayout>
  )
}
