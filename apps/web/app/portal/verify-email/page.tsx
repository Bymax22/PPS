import VerifyEmailClient from './VerifyEmailClient'

interface VerifyEmailPageProps {
  searchParams?: Promise<{
    token?: string
    email?: string
  }> | {
    token?: string
    email?: string
  }
}

export default async function VerifyEmailPage({ searchParams }: VerifyEmailPageProps) {
  const resolvedSearchParams = await Promise.resolve(searchParams ?? {})

  return <VerifyEmailClient token={resolvedSearchParams.token ?? null} email={resolvedSearchParams.email ?? null} />
}
