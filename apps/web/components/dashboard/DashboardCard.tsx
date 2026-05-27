"use client"

import React from 'react'

export default function DashboardCard({ title, children, className = '' }: { title: string; children?: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-white rounded-2xl shadow p-5 ${className}`}>
      <h3 className="text-sm font-medium text-gray-600 mb-3">{title}</h3>
      <div className="text-sm text-gray-800">{children}</div>
    </div>
  )
}
