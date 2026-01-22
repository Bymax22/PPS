'use client'

import { useState } from 'react'
import { FaTimes, FaCreditCard, FaMobile, FaUniversity, FaLock } from 'react-icons/fa'

interface Invoice {
  id: string
  invoiceNumber: string
  studentName: string
  amount: number
  dueDate: string
  status: string
  items: {
    description: string
    amount: number
  }[]
}

type PaymentMethodType = 'AIRTEL_MONEY' | 'MTN_MONEY' | 'BANK_TRANSFER' | 'CARD'

interface PaymentModalProps {
  invoice: Invoice
  onClose: () => void
  onSuccess: () => void
}

export default function PaymentModal({ invoice, onClose, onSuccess }: PaymentModalProps) {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodType>('AIRTEL_MONEY')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [cardDetails, setCardDetails] = useState({
    number: '',
    expiry: '',
    cvv: '',
    name: ''
  })
  const [isProcessing, setIsProcessing] = useState(false)

  const paymentMethods = [
    {
      id: 'AIRTEL_MONEY',
      name: 'Airtel Money',
      icon: FaMobile,
      description: 'Pay using your Airtel Money account',
      color: 'bg-red-500'
    },
    {
      id: 'MTN_MONEY',
      name: 'MTN Money',
      icon: FaMobile,
      description: 'Pay using your MTN Money account',
      color: 'bg-yellow-500'
    },
    {
      id: 'BANK_TRANSFER',
      name: 'Bank Transfer',
      icon: FaUniversity,
      description: 'Transfer directly to our bank account',
      color: 'bg-blue-500'
    },
    {
      id: 'CARD',
      name: 'Credit/Debit Card',
      icon: FaCreditCard,
      description: 'Pay with Visa, MasterCard, or UnionPay',
      color: 'bg-purple-500'
    }
  ]

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsProcessing(true)

    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 3000))
      
      // In real implementation, integrate with payment gateway
      const paymentData = {
        invoiceId: invoice.id,
        amount: invoice.amount,
        method: paymentMethod,
        phoneNumber: paymentMethod.includes('MONEY') ? phoneNumber : undefined,
        cardDetails: paymentMethod === 'CARD' ? cardDetails : undefined
      }

      console.log('Processing payment:', paymentData)
      
      // Simulate successful payment
      onSuccess()
    } catch (error) {
      console.error('Payment failed:', error)
    } finally {
      setIsProcessing(false)
    }
  }

  const formatCardNumber = (value: string) => {
    return value.replace(/\s?/g, '').replace(/(\d{4})/g, '$1 ').trim()
  }

  const formatExpiry = (value: string) => {
    return value.replace(/\//g, '').replace(/(\d{2})(\d{2})/, '$1/$2')
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Make Payment</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <FaTimes className="text-gray-500" />
          </button>
        </div>

        {/* Invoice Summary */}
        <div className="p-6 border-b border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-3">Invoice Summary</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Invoice #</span>
              <span className="font-medium">{invoice.invoiceNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Student</span>
              <span className="font-medium">{invoice.studentName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Due Date</span>
              <span className="font-medium">{new Date(invoice.dueDate).toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between text-lg font-bold text-gray-900 pt-2 border-t border-gray-200">
              <span>Total Amount</span>
              <span>K{invoice.amount.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Payment Form */}
        <form onSubmit={handlePayment} className="p-6">
          {/* Payment Method Selection */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 mb-3">Select Payment Method</h3>
            <div className="grid grid-cols-2 gap-3">
              {paymentMethods.map(method => {
                const Icon = method.icon
                return (
                  <button
                    key={method.id}
                    type="button"
                    onClick={() => setPaymentMethod(method.id as PaymentMethodType)}
                    className={`p-3 border-2 rounded-xl text-left transition-all ${
                      paymentMethod === method.id
                        ? 'border-[#0713FB] bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center space-x-2 mb-1">
                      <div className={`p-2 rounded-lg ${method.color}`}>
                        <Icon className="text-white text-sm" />
                      </div>
                      <span className="font-medium text-sm">{method.name}</span>
                    </div>
                    <span className="text-xs text-gray-600">{method.description}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Payment Details */}
          <div className="space-y-4">
            {/* Mobile Money Input */}
            {(paymentMethod === 'AIRTEL_MONEY' || paymentMethod === 'MTN_MONEY') && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="Enter your mobile money number"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0713FB] focus:border-transparent"
                  required
                />
                <p className="text-xs text-gray-600 mt-1">
                  You will receive a payment prompt on your phone
                </p>
              </div>
            )}

            {/* Card Details */}
            {paymentMethod === 'CARD' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Card Number
                  </label>
                  <input
                    type="text"
                    value={cardDetails.number}
                    onChange={(e) => setCardDetails(prev => ({
                      ...prev,
                      number: formatCardNumber(e.target.value)
                    }))}
                    placeholder="1234 5678 9012 3456"
                    maxLength={19}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0713FB] focus:border-transparent"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Expiry Date
                    </label>
                    <input
                      type="text"
                      value={cardDetails.expiry}
                      onChange={(e) => setCardDetails(prev => ({
                        ...prev,
                        expiry: formatExpiry(e.target.value)
                      }))}
                      placeholder="MM/YY"
                      maxLength={5}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0713FB] focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      CVV
                    </label>
                    <input
                      type="text"
                      value={cardDetails.cvv}
                      onChange={(e) => setCardDetails(prev => ({
                        ...prev,
                        cvv: e.target.value.replace(/\D/g, '')
                      }))}
                      placeholder="123"
                      maxLength={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0713FB] focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cardholder Name
                  </label>
                  <input
                    type="text"
                    value={cardDetails.name}
                    onChange={(e) => setCardDetails(prev => ({
                      ...prev,
                      name: e.target.value
                    }))}
                    placeholder="Enter cardholder name"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0713FB] focus:border-transparent"
                    required
                  />
                </div>
              </div>
            )}

            {/* Bank Transfer Instructions */}
            {paymentMethod === 'BANK_TRANSFER' && (
              <div className="bg-blue-50 rounded-xl p-4">
                <h4 className="font-semibold text-blue-800 mb-2">Bank Transfer Instructions</h4>
                <div className="space-y-2 text-sm text-blue-700">
                  <div><strong>Bank:</strong> Zanaco</div>
                  <div><strong>Account Name:</strong> Progress Preparatory School</div>
                  <div><strong>Account Number:</strong> 1234567890</div>
                  <div><strong>Branch:</strong> Lusaka Main</div>
                  <div><strong>Reference:</strong> INV-{invoice.invoiceNumber}</div>
                </div>
                <p className="text-xs text-blue-600 mt-3">
                  Please use the invoice number as reference. Payment will be verified within 24 hours.
                </p>
              </div>
            )}
          </div>

          {/* Security Notice */}
          <div className="flex items-center space-x-2 mt-6 p-3 bg-green-50 rounded-lg border border-green-200">
            <FaLock className="text-green-500 flex-shrink-0" />
            <span className="text-sm text-green-700">
              Your payment information is secure and encrypted
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
              disabled={isProcessing}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isProcessing}
              className="flex-1 bg-[#0713FB] text-white px-4 py-3 rounded-xl font-medium hover:bg-[#060EDB] transition-colors disabled:opacity-50 flex items-center justify-center space-x-2"
            >
              {isProcessing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  <span>Processing...</span>
                </>
              ) : (
                <span>Pay K{invoice.amount.toLocaleString()}</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}