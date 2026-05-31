import Link from 'next/link'

interface StudentSubpageProps {
  params: {
    slug: string
  }
}

export default function StudentSubpage({ params }: StudentSubpageProps) {
  const title = params.slug
    .split('-')
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(' ')

  return (
    <div className="min-h-screen bg-slate-50 pt-[112px] lg:pt-[120px]">
      <div className="mx-auto max-w-4xl px-6 py-10">
        <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
          <h1 className="text-3xl font-semibold text-gray-900">{title}</h1>
          <p className="mt-3 text-gray-600">
            This section is ready. Use the student sidebar to navigate back to your dashboard or other student tools.
          </p>
          <div className="mt-6">
            <Link
              href="/student"
              className="inline-flex items-center rounded-full bg-[#003087] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#00286d]"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
