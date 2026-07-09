import VerifyEmailClient from './VerifyEmailClient'

interface VerifyEmailPageProps {
  searchParams: {
    token?: string
    email?: string
  }
}

export default function VerifyEmailPage({ searchParams }: VerifyEmailPageProps) {
  return <VerifyEmailClient token={searchParams.token ?? null} email={searchParams.email ?? null} />
}
