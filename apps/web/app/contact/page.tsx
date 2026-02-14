'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowLeft, MapPin, Phone, Mail, MessageSquare, Clock, Send, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react'

export default function ContactPage() {
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
            Get in Touch
          </span>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-[#003087] mb-6">
            Contact Us
          </h1>
          <p className="text-lg text-gray-600">
            We're here to answer your questions and welcome you to our community
          </p>
        </motion.div>

        {/* Contact Grid */}
        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-1 space-y-6"
          >
            <div className="bg-gradient-to-br from-[#003087] to-[#001f5b] rounded-2xl p-6 text-white">
              <h2 className="text-xl font-bold mb-6">Contact Information</h2>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-[var(--campus-gold)] mt-1 shrink-0" />
                  <div>
                    <p className="font-semibold mb-1">Address</p>
                    <p className="text-sm text-gray-200">
                      Plot 332/8137 Hellen Kaunda Road,<br />
                      off Alick Nkata Road,<br />
                      Lusaka, Zambia
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-[var(--campus-gold)] shrink-0" />
                  <div>
                    <p className="font-semibold mb-1">Phone</p>
                    <a href="tel:+260771050500" className="text-sm text-gray-200 hover:text-[var(--campus-gold)]">
                      0771 050 500
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <MessageSquare className="w-5 h-5 text-[var(--campus-gold)] shrink-0" />
                  <div>
                    <p className="font-semibold mb-1">WhatsApp</p>
                    <a href="https://wa.me/260775455565" className="text-sm text-gray-200 hover:text-[var(--campus-gold)]">
                      0775 455 565
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-[var(--campus-gold)] shrink-0" />
                  <div>
                    <p className="font-semibold mb-1">Email</p>
                    <a href="mailto:progresspreparatoryschool@gmail.com" className="text-sm text-gray-200 hover:text-[var(--campus-gold)] break-all">
                      progresspreparatoryschool@gmail.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-[var(--campus-gold)] mt-1 shrink-0" />
                  <div>
                    <p className="font-semibold mb-1">Office Hours</p>
                    <p className="text-sm text-gray-200">
                      Monday - Thursday: 7:30 AM - 4:30 PM<br />
                      Friday: 7:30 AM - 12:00 PM<br />
                      Saturday - Sunday: Closed
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="bg-gray-50 rounded-2xl p-6">
              <h3 className="font-bold text-[#003087] mb-4">Follow Us</h3>
              <div className="flex gap-3">
                {[
                  { icon: Facebook, href: '#' },
                  { icon: Twitter, href: '#' },
                  { icon: Instagram, href: '#' },
                  { icon: Linkedin, href: '#' }
                ].map((social, index) => {
                  const Icon = social.icon
                  return (
                    <a
                      key={index}
                      href={social.href}
                      className="w-10 h-10 bg-white rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-[var(--campus-gold)] hover:text-gray-900 hover:border-[var(--campus-gold)] transition-all"
                    >
                      <Icon className="w-5 h-5" />
                    </a>
                  )
                })}
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2"
          >
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
              <h2 className="text-2xl font-bold text-[#003087] mb-6">Send us a Message</h2>
              
              <form className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-[var(--campus-gold)] focus:outline-none"
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-[var(--campus-gold)] focus:outline-none"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-[var(--campus-gold)] focus:outline-none"
                    placeholder="0771 050 500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subject <span className="text-red-500">*</span>
                  </label>
                  <select className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-[var(--campus-gold)] focus:outline-none">
                    <option>Admissions Inquiry</option>
                    <option>General Information</option>
                    <option>Schedule a Visit</option>
                    <option>Tuition Questions</option>
                    <option>Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-[var(--campus-gold)] focus:outline-none"
                    placeholder="How can we help you?"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-4 bg-[var(--campus-gold)] text-gray-900 rounded-xl font-semibold hover:bg-yellow-400 transition-colors flex items-center justify-center gap-2"
                >
                  <Send className="w-5 h-5" />
                  Send Message
                </button>
              </form>
            </div>
          </motion.div>
        </div>

        {/* Map */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="h-[400px] rounded-2xl overflow-hidden"
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
      </div>
    </main>
  )
}