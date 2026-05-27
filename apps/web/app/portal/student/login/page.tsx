"use client"

import PortalLayout from '@/components/PortalLayout'
import AuthForm from '@/components/AuthForm'

export default function StudentLoginPage() {
  return (
    <PortalLayout role="student">
      <div className="py-16">
        <h1 className="text-2xl font-bold mb-6">Student Sign In</h1>
        <AuthForm role="STUDENT" />
      </div>
    </PortalLayout>
  )
}
