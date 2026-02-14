'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowLeft, Calendar, Clock, Users, Home, Laptop, Phone, Mail, CheckCircle } from 'lucide-react'
import { useState } from 'react'

export default function BookAppointmentPage() {
  const [appointmentType, setAppointmentType] = useState('')
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedTime, setSelectedTime] = useState('')

  const types = [
    { id: 'tour', name: 'Campus Tour', icon: Home, description: 'Visit our facilities and meet our team' },
    { id: 'meeting', name: 'Admissions Meeting', icon: Users, description: 'Discuss admissions with our staff' },
    { id: 'assessment', name: 'Student Assessment', icon: Calendar, description: 'Schedule your child\'s assessment' },
    { id: 'online', name: 'Online Consultation', icon: Laptop, description: 'Virtual meeting via Zoom/Google Meet' }
  ]

  const dates = [
    'Monday, March 25',
    'Tuesday, March 26',
    'Wednesday, March 27',
    'Thursday, March 28',
    'Friday, March 29'
  ]

  const times = [
    '9:00 AM',
    '10:00 AM',
    '11:00 AM',
    '2:00 PM',
    '3:00 PM',
    '4:00 PM'
  ]

  return (
    <main className="pt-32 pb-20 min-h-screen bg-white">
      <div className="container mx-auto px-6">
        {/* Back Button */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-[#003087] hover:text-[var(--campus-gold)] transition-colors mb-8 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Home
        </Link>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl mx-auto text-center mb-16"
        >
          <span className="inline-block text-xs font-bold uppercase tracking-[0.2em] text-[var(--campus-gold)] mb-4">
            Schedule a Visit
          </span>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-[#003087] mb-6">
            Book an Appointment
          </h1>
          <p className="text-lg text-gray-600">
            Choose a time that works best for you to visit or speak with us
          </p>
        </motion.div>

        {/* Appointment Type */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-12"
        >
          <h2 className="text-xl font-bold text-[#003087] mb-6">
            Select Appointment Type <span className="text-red-500">*</span>
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {types.map((type) => {
              const Icon = type.icon
              const isSelected = appointmentType === type.id
              return (
                <button
                  key={type.id}
                  onClick={() => setAppointmentType(type.id)}
                  className={`
                    flex items-start gap-4 p-6 rounded-xl border-2 transition-all text-left
                    ${isSelected 
                      ? 'border-[var(--campus-gold)] bg-[var(--campus-gold)]/5' 
                      : 'border-gray-200 hover:border-[#003087]/30'
                    }
                  `}
                >
                  <Icon className={`w-6 h-6 mt-1 ${isSelected ? 'text-[var(--campus-gold)]' : 'text-gray-400'}`} />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="font-semibold text-gray-900">{type.name}</p>
                      {isSelected && <CheckCircle className="w-5 h-5 text-[var(--campus-gold)]" />}
                    </div>
                    <p className="text-sm text-gray-500 mt-1">{type.description}</p>
                  </div>
                </button>
              )
            })}
          </div>
        </motion.div>

        {/* Date Selection */}
        {appointmentType && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <h2 className="text-xl font-bold text-[#003087] mb-6">
              Select Date <span className="text-red-500">*</span>
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {dates.map((date) => (
                <button
                  key={date}
                  onClick={() => setSelectedDate(date)}
                  className={`
                    p-4 rounded-xl border-2 transition-all text-center
                    ${selectedDate === date 
                      ? 'border-[var(--campus-gold)] bg-[var(--campus-gold)]/5' 
                      : 'border-gray-200 hover:border-[#003087]/30'
                    }
                  `}
                >
                  <Calendar className={`w-5 h-5 mx-auto mb-2 ${selectedDate === date ? 'text-[var(--campus-gold)]' : 'text-gray-400'}`} />
                  <p className="text-sm font-medium text-gray-900">{date}</p>
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Time Selection */}
        {selectedDate && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <h2 className="text-xl font-bold text-[#003087] mb-6">
              Select Time <span className="text-red-500">*</span>
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {times.map((time) => (
                <button
                  key={time}
                  onClick={() => setSelectedTime(time)}
                  className={`
                    p-4 rounded-xl border-2 transition-all text-center
                    ${selectedTime === time 
                      ? 'border-[var(--campus-gold)] bg-[var(--campus-gold)]/5' 
                      : 'border-gray-200 hover:border-[#003087]/30'
                    }
                  `}
                >
                  <Clock className={`w-5 h-5 mx-auto mb-2 ${selectedTime === time ? 'text-[var(--campus-gold)]' : 'text-gray-400'}`} />
                  <p className="text-sm font-medium text-gray-900">{time}</p>
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Contact Information */}
        {selectedTime && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <h2 className="text-xl font-bold text-[#003087] mb-6">
              Your Information
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-[var(--campus-gold)] focus:outline-none"
                  placeholder="Enter your full name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-[var(--campus-gold)] focus:outline-none"
                  placeholder="Enter your email"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-[var(--campus-gold)] focus:outline-none"
                  placeholder="Enter your phone number"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Child's Name (if applicable)
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-[var(--campus-gold)] focus:outline-none"
                  placeholder="Enter child's name"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Additional Notes
                </label>
                <textarea
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-[var(--campus-gold)] focus:outline-none"
                  placeholder="Any specific questions or requirements?"
                />
              </div>
            </div>
          </motion.div>
        )}

        {/* Summary & Confirm */}
        {selectedTime && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-[#003087] to-[#001f5b] rounded-3xl p-8 text-white"
          >
            <h2 className="text-xl font-bold mb-4">Appointment Summary</h2>
            <div className="grid md:grid-cols-3 gap-4 mb-6">
              <div>
                <p className="text-sm text-gray-300">Type</p>
                <p className="font-semibold">{types.find(t => t.id === appointmentType)?.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-300">Date</p>
                <p className="font-semibold">{selectedDate}</p>
              </div>
              <div>
                <p className="text-sm text-gray-300">Time</p>
                <p className="font-semibold">{selectedTime}</p>
              </div>
            </div>
            <button className="w-full py-4 bg-[var(--campus-gold)] text-gray-900 rounded-xl font-semibold hover:bg-yellow-400 transition-colors">
              Confirm Appointment
            </button>
            <p className="text-xs text-gray-300 text-center mt-4">
              You will receive a confirmation email with appointment details
            </p>
          </motion.div>
        )}

        {/* Contact Alternative */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-12 text-center text-sm text-gray-500"
        >
          <p>Prefer to call? Contact us directly:</p>
          <div className="flex justify-center gap-4 mt-2">
            <a href="tel:+260771050500" className="flex items-center gap-1 text-[#003087] hover:text-[var(--campus-gold)]">
              <Phone className="w-4 h-4" /> 0771 050 500
            </a>
            <a href="mailto:progresspreparatoryschool@gmail.com" className="flex items-center gap-1 text-[#003087] hover:text-[var(--campus-gold)]">
              <Mail className="w-4 h-4" /> Email Us
            </a>
          </div>
        </motion.div>
      </div>
    </main>
  )
}