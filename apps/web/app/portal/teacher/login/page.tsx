"use client"

import PortalLayout from '@/components/PortalLayout'
import AuthForm from '@/components/AuthForm'

export default function TeacherLoginPage() {
  return (
    <PortalLayout role="teacher">
      <div className="py-16">
        <h1 className="text-2xl font-bold mb-6">Teacher Sign In</h1>
        <AuthForm role="TEACHER" />
      </div>
    </PortalLayout>
  )
}
