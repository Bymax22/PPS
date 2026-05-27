"use client"

import Link from 'next/link'
import React, { useState } from 'react'
import PortalModal from './PortalModal'
import { User, Bell } from 'lucide-react'

export default function PortalLayout({ children, role }: { children: React.ReactNode; role?: string }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="sticky top-0 z-40">
        <div className="bg-gradient-to-r from-[#003087] to-[#001f5b] text-white p-4 shadow">
          <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Link href="/" className="text-lg md:text-2xl font-serif font-bold">Progress Preparatory School</Link>
              {role && (
                <span className="ml-2 inline-flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full text-sm font-medium">
                  <User className="w-4 h-4 text-white/90" />
                  <span className="capitalize">{role}</span>
                </span>
              )}
            </div>

            <div className="flex items-center gap-3">
              <button onClick={() => setOpen(true)} className="bg-white/10 hover:bg-white/20 px-3 py-1 rounded text-sm">Portals</button>
              <Link href="/portal/help" className="text-sm text-white/90 hover:underline">Help</Link>
              <button className="relative p-2 rounded hover:bg-white/10">
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-1.5 py-0.5 text-xs bg-amber-400 text-black rounded-full">3</span>
              </button>
            </div>
          </div>
        </div>
        <nav className="bg-white border-b">
          <div className="max-w-6xl mx-auto px-4 py-2 flex items-center gap-4 text-sm">
            <Link href="/student" className="text-gray-700 hover:text-[#003087]">Student</Link>
            <Link href="/parent" className="text-gray-700 hover:text-[#003087]">Parent</Link>
            <Link href="/teacher" className="text-gray-700 hover:text-[#003087]">Teacher</Link>
            <Link href="/admin" className="text-gray-700 hover:text-[#003087]">Admin</Link>
          </div>
        </nav>
      </header>

      <main className="max-w-6xl mx-auto p-4">{children}</main>
      <PortalModal isOpen={open} onClose={() => setOpen(false)} />
    </div>
  )
}
