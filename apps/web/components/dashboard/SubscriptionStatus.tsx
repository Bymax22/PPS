// components/dashboard/SubscriptionStatus.tsx
import { CreditCard, AlertCircle, CheckCircle } from 'lucide-react'

export default function SubscriptionStatus({ subscriptions }: any) {
  const activeSubscription = subscriptions.find((subscription: any) => subscription.status === 'ACTIVE')
  
  if (!activeSubscription) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center gap-3 mb-4">
          <CreditCard className="w-5 h-5" style={{ color: '#003087' }} />
          <h2 className="text-xl font-semibold text-gray-900">Subscription</h2>
        </div>
        <div className="text-center py-6">
          <AlertCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-600">No active subscription</p>
          <button 
            className="mt-4 px-4 py-2 rounded-lg text-white text-sm font-medium hover:opacity-90 transition-opacity"
            style={{ backgroundColor: '#003087' }}
          >
            Subscribe Now
          </button>
        </div>
      </div>
    )
  }
  
  const endDate = activeSubscription.endDate ? new Date(activeSubscription.endDate) : null
  const daysLeft = endDate
    ? Math.max(0, Math.ceil((endDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
    : null
  
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center gap-3 mb-4">
        <CheckCircle className="w-5 h-5" style={{ color: '#0EF117' }} />
        <h2 className="text-xl font-semibold text-gray-900">Active Subscription</h2>
      </div>
      <div className="space-y-3">
        <div>
          <p className="text-xs text-gray-500">Plan</p>
          <p className="font-semibold text-gray-900">{activeSubscription.plan.name}</p>
          <p className="text-sm text-gray-600">{activeSubscription.plan.program.name}</p>
        </div>
        {daysLeft !== null && <div>
          <p className="text-xs text-gray-500">Days Remaining</p>
          <p className="text-2xl font-bold" style={{ color: daysLeft < 7 ? '#dc2626' : '#003087' }}>
            {daysLeft}
          </p>
        </div>}
        <div>
          <p className="text-xs text-gray-500">Expires On</p>
          <p className="text-sm text-gray-900">
            {endDate ? endDate.toLocaleDateString() : 'No expiry date'}
          </p>
        </div>
        <button 
          className="w-full mt-3 py-2 px-4 rounded-lg text-white font-medium transition-opacity hover:opacity-90"
          style={{ backgroundColor: '#003087' }}
        >
          Manage Subscription
        </button>
      </div>
    </div>
  )
}