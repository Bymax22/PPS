'use client'

import { useState, useEffect } from 'react'
import { FaCrown, FaCheck, FaSync, FaExclamationTriangle } from 'react-icons/fa'
import UpgradeModal from '../UpgradeModal'

interface SubscriptionPlan {
  id: string
  name: string
  description: string
  price: number
  duration: number // in months
  features: string[]
  isPopular: boolean
  isCurrent: boolean
}

interface CurrentSubscription {
  id: string
  planName: string
  startDate: string
  endDate: string
  status: 'active' | 'expired' | 'cancelled' | 'pending'
  autoRenew: boolean
  nextBillingDate?: string
  students: string[]
}

export default function SubscriptionPage() {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([])
  const [currentSubscription, setCurrentSubscription] = useState<CurrentSubscription | null>(null)
  const [loading, setLoading] = useState(true)
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null)

  useEffect(() => {
    const fetchSubscriptionData = async () => {
      try {
        const [plansResponse, subscriptionResponse] = await Promise.all([
          fetch('/api/parent/subscription-plans'),
          fetch('/api/parent/current-subscription')
        ])
        
        const plansData = await plansResponse.json()
        const subscriptionData = await subscriptionResponse.json()
        
        setPlans(plansData)
        setCurrentSubscription(subscriptionData)
      } catch (error) {
        console.error('Error fetching subscription data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchSubscriptionData()
  }, [])

  const handleUpgrade = (plan: SubscriptionPlan) => {
    setSelectedPlan(plan)
    setShowUpgradeModal(true)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'expired': return 'bg-red-100 text-red-800'
      case 'cancelled': return 'bg-gray-100 text-gray-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0713FB]"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Subscription Plans</h1>
          <p className="text-gray-600 mt-1">Choose the perfect plan for your family&apos;s educational needs</p>
        </div>
      </div>

      {/* Current Subscription Banner */}
      {currentSubscription && (
        <div className={`rounded-xl p-6 ${
          currentSubscription.status === 'active' 
            ? 'bg-gradient-to-r from-green-500 to-green-600 text-white'
            : currentSubscription.status === 'expired'
            ? 'bg-gradient-to-r from-red-500 to-red-600 text-white'
            : 'bg-gradient-to-r from-gray-500 to-gray-600 text-white'
        }`}>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-bold mb-2">
                {currentSubscription.status === 'active' ? 'Active Plan' : 
                 currentSubscription.status === 'expired' ? 'Expired Plan' : 'Subscription Status'}
              </h2>
              <div className="flex items-center space-x-4 text-sm opacity-90">
                <span>{currentSubscription.planName}</span>
                <span>•</span>
                <span>Valid until: {new Date(currentSubscription.endDate).toLocaleDateString()}</span>
                <span>•</span>
                <span>{currentSubscription.students.length} student(s)</span>
              </div>
            </div>
            <div className="mt-4 sm:mt-0 flex items-center space-x-3">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(currentSubscription.status)}`}>
                {currentSubscription.status.toUpperCase()}
              </span>
              {currentSubscription.autoRenew && currentSubscription.status === 'active' && (
                <span className="text-sm opacity-90 flex items-center space-x-1">
                  <FaSync className="text-xs" />
                  <span>Auto-renewal ON</span>
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Subscription Plans */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map(plan => (
          <div
            key={plan.id}
            className={`relative bg-white rounded-xl shadow-sm border-2 transition-all hover:scale-105 ${
              plan.isCurrent 
                ? 'border-[#0713FB] ring-2 ring-[#0713FB] ring-opacity-20'
                : plan.isPopular
                ? 'border-[#0EF117]'
                : 'border-gray-200'
            }`}
          >
            {/* Popular Badge */}
            {plan.isPopular && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <div className="bg-[#0EF117] text-gray-900 px-4 py-1 rounded-full text-sm font-bold flex items-center space-x-1">
                  <FaCrown className="text-xs" />
                  <span>MOST POPULAR</span>
                </div>
              </div>
            )}

            {/* Current Plan Badge */}
            {plan.isCurrent && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <div className="bg-[#0713FB] text-white px-4 py-1 rounded-full text-sm font-bold">
                  CURRENT PLAN
                </div>
              </div>
            )}

            <div className="p-6">
              {/* Plan Header */}
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
                <p className="text-gray-600 text-sm mt-1">{plan.description}</p>
              </div>

              {/* Price */}
              <div className="text-center mb-6">
                <div className="text-3xl font-bold text-gray-900">
                  K{plan.price.toLocaleString()}
                </div>
                <div className="text-gray-600 text-sm">
                  per {plan.duration} month{plan.duration > 1 ? 's' : ''}
                </div>
              </div>

              {/* Features */}
              <div className="space-y-3 mb-6">
                {plan.features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <FaCheck className="text-green-500 flex-shrink-0" />
                    <span className="text-sm text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>

              {/* Action Button */}
              <button
                onClick={() => handleUpgrade(plan)}
                disabled={plan.isCurrent}
                className={`w-full py-3 rounded-xl font-semibold transition-colors ${
                  plan.isCurrent
                    ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                    : plan.isPopular
                    ? 'bg-[#0EF117] text-gray-900 hover:bg-[#0CD714]'
                    : 'bg-[#0713FB] text-white hover:bg-[#060EDB]'
                }`}
              >
                {plan.isCurrent ? 'Current Plan' : 'Choose Plan'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Billing Information */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Billing Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-medium text-gray-900 mb-3">Payment Methods</h3>
            <div className="space-y-2">
              {['Airtel Money', 'MTN Money', 'Bank Transfer', 'Credit/Debit Card'].map(method => (
                <div key={method} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                  <span className="text-sm text-gray-700">{method}</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-green-500 text-sm">✓ Available</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h3 className="font-medium text-gray-900 mb-3">Billing Support</h3>
            <div className="space-y-3 text-sm text-gray-600">
              <p>Need help with billing or have questions about your subscription?</p>
              <div className="space-y-1">
                <div className="flex items-center space-x-2"><FaExclamationTriangle className="text-yellow-600" /><span>📞 Call: +260 211 123 456</span></div>
                <div>✉️ Email: billing@progressprep.edu.zm</div>
                <div>🕒 Hours: Mon-Fri, 8AM-5PM</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Upgrade Modal */}
      {showUpgradeModal && selectedPlan && (
        <UpgradeModal
          plan={selectedPlan}
          currentPlan={currentSubscription}
          onClose={() => {
            setShowUpgradeModal(false)
            setSelectedPlan(null)
          }}
          onSuccess={() => {
            setShowUpgradeModal(false)
            setSelectedPlan(null)
            // Refresh data
            window.location.reload()
          }}
        />
      )}
    </div>
  )
}