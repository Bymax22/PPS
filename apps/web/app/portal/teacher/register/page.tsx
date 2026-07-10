import Link from 'next/link'
import PortalLayout from '@/components/PortalLayout'

export default function TeacherRegisterPage() {
  return (
    <PortalLayout role="teacher">
      <div className="py-16 max-w-2xl mx-auto rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-bold mb-4 text-[#003087]">Teacher registration is disabled</h1>
        <p className="text-gray-700 mb-6">
          Teacher accounts are created by the school administration and login details are shared directly with new teachers.
        </p>
        <div className="flex gap-3">
          <Link href="/portal/teacher/login" className="rounded-lg bg-[#003087] px-4 py-2 text-white hover:bg-[#001f5b]">
            Go to teacher sign in
          </Link>
          <Link href="/portal" className="rounded-lg border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50">
            Back to portals
          </Link>
        </div>
      </div>
    </PortalLayout>
  )
}
