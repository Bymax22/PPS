"use client"

import PortalLayout from '@/components/PortalLayout'
import AuthForm from '@/components/AuthForm'

export default function ParentRegisterPage() {
  return (
    <PortalLayout role="parent">
      <div className="py-16">
        <h1 className="text-2xl font-bold mb-6">Parent Register</h1>
        <AuthForm role="PARENT" />
      </div>
    </PortalLayout>
  )
}
