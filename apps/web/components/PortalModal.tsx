'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X, GraduationCap, Users, BookOpen, LogIn, UserPlus, HelpCircle, Key } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

interface PortalModalProps {
  isOpen: boolean
  onClose: () => void
}

const portals = [
  {
    category: 'Students',
    icon: GraduationCap,
    color: 'bg-blue-500',
    lightColor: 'bg-blue-50',
    textColor: 'text-blue-600',
    links: [
      { name: 'Login', href: '/portal/student/login', icon: LogIn },
      { name: 'Register', href: '/portal/student/register', icon: UserPlus }
    ]
  },
  {
    category: 'Parents',
    icon: Users,
    color: 'bg-emerald-500',
    lightColor: 'bg-emerald-50',
    textColor: 'text-emerald-600',
    links: [
      { name: 'Login', href: '/portal/parent/login', icon: LogIn },
      { name: 'Register', href: '/portal/parent/register', icon: UserPlus }
    ]
  },
  {
    category: 'Teachers',
    icon: BookOpen,
    color: 'bg-purple-500',
    lightColor: 'bg-purple-50',
    textColor: 'text-purple-600',
    links: [
      { name: 'Login', href: '/portal/teacher/login', icon: LogIn }
    ]
  },
  {
    category: 'Alumni',
    icon: Users,
    color: 'bg-amber-500',
    lightColor: 'bg-amber-50',
    textColor: 'text-amber-600',
    links: [
      { name: 'Login', href: '/portal/alumni/login', icon: LogIn },
      { name: 'Update Info', href: '/portal/alumni/update', icon: UserPlus }
    ]
  }
]

export default function PortalModal({ isOpen, onClose }: PortalModalProps) {
  const [selectedPortal, setSelectedPortal] = useState<string | null>(null)

  const handlePortalSelect = (category: string) => {
    setSelectedPortal(selectedPortal === category ? null : category)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="fixed inset-0 flex items-center justify-center p-4 z-50 pointer-events-none"
          >
            <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-3xl shadow-2xl pointer-events-auto">
            {/* Header - keeping the nice header you like */}
            <div className="sticky top-0 bg-gradient-to-r from-[#003087] to-[#001f5b] text-white p-6 rounded-t-3xl">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl md:text-3xl font-serif font-bold">Portals</h2>
                  <p className="text-blue-100 text-sm mt-1">Select your portal to continue</p>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                  aria-label="Close modal"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Content - simplified and spacious */}
            <div className="p-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {portals.map((portal) => {
                  const Icon = portal.icon
                  const isSelected = selectedPortal === portal.category
                  
                  return (
                    <div key={portal.category} className="space-y-2">
                      {/* Portal Card */}
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handlePortalSelect(portal.category)}
                        className={`w-full p-4 rounded-xl transition-all ${
                          isSelected 
                            ? `${portal.lightColor} ring-2 ring-offset-2 ${portal.color.replace('bg-', 'ring-')}`
                            : 'bg-gray-50 hover:bg-gray-100'
                        }`}
                      >
                        <div className={`w-12 h-12 ${portal.color} rounded-xl flex items-center justify-center mx-auto mb-3`}>
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <h3 className={`font-semibold text-center ${isSelected ? portal.textColor : 'text-gray-700'}`}>
                          {portal.category}
                        </h3>
                      </motion.button>

                      {/* Links - appear when selected */}
                      <AnimatePresence>
                        {isSelected && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="space-y-2 overflow-hidden"
                          >
                            {portal.links.map((link) => {
                              const LinkIcon = link.icon
                              return (
                                <Link
                                  key={link.name}
                                  href={link.href}
                                  onClick={onClose}
                                  className="flex items-center gap-2 px-3 py-2 text-sm bg-white rounded-lg hover:bg-gray-50 transition-colors group"
                                >
                                  <LinkIcon className="w-4 h-4 text-gray-400 group-hover:text-[#003087]" />
                                  <span className="text-gray-600 group-hover:text-[#003087]">{link.name}</span>
                                </Link>
                              )
                            })}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )
                })}
              </div>

              {/* Simple Help Section */}
              <div className="mt-8 pt-6 border-t border-gray-100">
                <div className="flex items-center justify-center gap-4 text-sm">
                  <Link
                    href="/portal/help"
                    onClick={onClose}
                    className="flex items-center gap-1 text-gray-500 hover:text-[#003087] transition-colors"
                  >
                    <HelpCircle className="w-4 h-4" />
                    Help
                  </Link>
                  <span className="text-gray-300">|</span>
                  <Link
                    href="/portal/forgot-password"
                    onClick={onClose}
                    className="flex items-center gap-1 text-gray-500 hover:text-[#003087] transition-colors"
                  >
                    <Key className="w-4 h-4" />
                    Forgot Password
                  </Link>
                </div>
              </div>
            </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}