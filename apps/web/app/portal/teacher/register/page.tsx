"use client"

import PortalLayout from '@/components/PortalLayout'
import AuthForm from '@/components/AuthForm'

export default function TeacherRegisterPage() {
  return (
    <PortalLayout role="teacher">
      <div className="py-16">
        <h1 className="text-2xl font-bold mb-6">Teacher Register</h1>
        <AuthForm role="TEACHER" />
      </div>
    </PortalLayout>
  )
}
