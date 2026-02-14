import { Suspense } from 'react'
import { StudentRegisterForm } from './student-register-form'

export default function StudentRegisterPage() {
  return (
    <Suspense>
      <StudentRegisterForm />
    </Suspense>
  )
}