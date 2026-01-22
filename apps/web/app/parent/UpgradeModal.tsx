'use client'

import { FaTimes } from 'react-icons/fa'

interface SubscriptionPlan {
  id: string
  name: string
  description: string
  price: number
  duration: number
  features: string[]
}

interface CurrentSubscription {
  id: string
  planName: string
}

export default function UpgradeModal({ plan, currentPlan: _currentPlan, onClose, onSuccess }: { plan: SubscriptionPlan, currentPlan: CurrentSubscription | null, onClose: () => void, onSuccess: () => void }) {
  const handleConfirm = async () => {
    // Simulate upgrade
    await new Promise(resolve => setTimeout(resolve, 1000))
    onSuccess()
  }

  // mark current plan usage to avoid unused variable lint
  if (_currentPlan) {
    // noop: keep reference for linting
    void _currentPlan
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold">Upgrade to {plan.name}</h3>
          <button onClick={onClose} className="p-2 rounded-md hover:bg-gray-100">
            <FaTimes />
          </button>
        </div>
        <p className="text-sm text-gray-600 mb-4">{plan.description}</p>
        <div className="mb-4">
          <div className="text-2xl font-bold">K{plan.price.toLocaleString()}</div>
          <div className="text-sm text-gray-600">per {plan.duration} month{plan.duration > 1 ? 's' : ''}</div>
        </div>
        <div className="flex space-x-3">
          <button onClick={handleConfirm} className="flex-1 bg-[#0713FB] text-white py-2 rounded-xl">Confirm Upgrade</button>
          <button onClick={onClose} className="flex-1 border border-gray-300 py-2 rounded-xl">Cancel</button>
        </div>
      </div>
    </div>
  )
}
