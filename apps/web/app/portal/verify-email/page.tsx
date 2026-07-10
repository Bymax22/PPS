import VerifyEmailClient from './VerifyEmailClient'

interface VerifyEmailPageProps {
  searchParams?: Promise<{
    token?: string
    email?: string
    firstName?: string
    lastName?: string
  }> | {
    token?: string
    email?: string
    firstName?: string
    lastName?: string
  }
}

export default async function VerifyEmailPage({ searchParams }: VerifyEmailPageProps) {
  const resolvedSearchParams = await Promise.resolve(searchParams ?? {})

  return (
    <VerifyEmailClient
      token={resolvedSearchParams.token ?? null}
      email={resolvedSearchParams.email ?? null}
      firstName={resolvedSearchParams.firstName ?? null}
      lastName={resolvedSearchParams.lastName ?? null}
    />
  )
}
