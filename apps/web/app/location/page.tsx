'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowLeft, MapPin, Phone, Mail, Clock, Bus, Car } from 'lucide-react'

export default function LocationPage() {
  return (
    <main className="pt-32 pb-20 min-h-screen bg-white">
      <div className="container mx-auto px-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-[#003087] hover:text-[var(--campus-gold)] transition-colors mb-8 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Home
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl mx-auto text-center mb-16"
        >
          <span className="inline-block text-xs font-bold uppercase tracking-[0.2em] text-[var(--campus-gold)] mb-4">
            Visit Us
          </span>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-[#003087] mb-6">
            Our Location
          </h1>
          <p className="text-lg text-gray-600">
            Conveniently located in Lusaka, Zambia
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Map */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-gray-100 rounded-2xl h-[400px] overflow-hidden"
          >
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d12345.67890!2d28.2839!3d-15.4167!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTXCsDI1JzAwLjAiUyAyOMKwMTcnMDIuMCJF!5e0!3m2!1sen!2szm!4v1234567890"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
            />
          </motion.div>

          {/* Location Details */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="bg-gradient-to-br from-[#003087] to-[#001f5b] text-white rounded-2xl p-8">
              <h2 className="text-2xl font-bold mb-6">Contact Information</h2>
              
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <MapPin className="w-5 h-5 text-[var(--campus-gold)] mt-1" />
                  <div>
                    <p className="font-semibold mb-1">Address</p>
                    <p className="text-gray-200 text-sm">
                      Plot 332/8137 Hellen Kaunda Road,<br />
                      off Alick Nkata Road,<br />
                      Lusaka, Zambia
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <Phone className="w-5 h-5 text-[var(--campus-gold)]" />
                  <div>
                    <p className="font-semibold mb-1">Phone</p>
                    <p className="text-gray-200 text-sm">0771 050 500</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <Mail className="w-5 h-5 text-[var(--campus-gold)]" />
                  <div>
                    <p className="font-semibold mb-1">Email</p>
                    <p className="text-gray-200 text-sm">progresspreparatoryschool@gmail.com</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <Clock className="w-5 h-5 text-[var(--campus-gold)] mt-1" />
                  <div>
                    <p className="font-semibold mb-1">Office Hours</p>
                    <p className="text-gray-200 text-sm">
                      Monday - Thursday: 7:30 AM - 4:30 PM<br />
                      Friday: 7:30 AM - 12:00 PM<br />
                      Saturday - Sunday: Closed
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Transportation */}
            <div className="bg-gray-50 rounded-2xl p-6">
              <h3 className="text-lg font-bold text-[#003087] mb-4">Getting Here</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-[var(--campus-gold)]/10 rounded-lg">
                    <Bus className="w-5 h-5 text-[var(--campus-gold)]" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">Public Transport</p>
                    <p className="text-xs text-gray-500">Buses from town center</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-[var(--campus-gold)]/10 rounded-lg">
                    <Car className="w-5 h-5 text-[var(--campus-gold)]" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">Parking</p>
                    <p className="text-xs text-gray-500">Free on-site parking</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </main>
  )
}