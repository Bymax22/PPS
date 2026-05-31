import { BookOpen, FileText, ClipboardList, DownloadCloud } from 'lucide-react'

type ResourceType =
  | 'PDF_NOTE'
  | 'WORKSHEET'
  | 'PAST_PAPER'
  | 'SOLUTION_MANUAL'
  | 'FLASHCARD_SET'
  | 'VIDEO_TUTORIAL'
  | 'STUDY_GUIDE'

interface ResourceItem {
  id: string
  title: string
  description?: string | null
  type: ResourceType
  subject?: string | null
  author?: string | null
  createdAt: Date
  cloudinaryUrl?: string | null
  downloadCount?: number | null
}

interface ResourcesWidgetProps {
  resources: ResourceItem[]
}

const getResourceTypeLabel = (type: ResourceType) => {
  switch (type) {
    case 'PDF_NOTE':
      return 'PDF Note'
    case 'WORKSHEET':
      return 'Worksheet'
    case 'PAST_PAPER':
      return 'Past Paper'
    case 'SOLUTION_MANUAL':
      return 'Solution Manual'
    case 'FLASHCARD_SET':
      return 'Flashcard Set'
    case 'VIDEO_TUTORIAL':
      return 'Video Tutorial'
    case 'STUDY_GUIDE':
      return 'Study Guide'
    default:
      return 'Resource'
  }
}

const getResourceIcon = (type: ResourceType) => {
  switch (type) {
    case 'VIDEO_TUTORIAL':
      return <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 3l14 9-14 9V3z" /></svg>
    case 'FLASHCARD_SET':
      return <ClipboardList className="w-4 h-4" />
    default:
      return <FileText className="w-4 h-4" />
  }
}

export default function ResourcesWidget({ resources }: ResourcesWidgetProps) {
  if (!resources || resources.length === 0) {
    return (
      <div className="text-center py-12">
        <BookOpen className="mx-auto mb-3 w-12 h-12 text-slate-300" />
        <p className="text-sm font-medium text-slate-900">No resources available</p>
        <p className="text-sm text-slate-500 mt-1">Check back later for new learning materials.</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {resources.map((resource) => (
        <div key={resource.id} className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-slate-50 text-slate-700">
              {getResourceIcon(resource.type)}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div className="min-w-0">
                  <h3 className="truncate text-sm font-semibold text-slate-900">{resource.title}</h3>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                    {resource.description ?? 'No description available.'}
                  </p>
                </div>
                <span className="rounded-full bg-slate-100 px-2 py-1 text-[11px] font-medium uppercase tracking-wide text-slate-600">
                  {getResourceTypeLabel(resource.type)}
                </span>
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-2 text-[12px] text-slate-500">
                {resource.subject && <span>{resource.subject}</span>}
                {resource.author && <span>• {resource.author}</span>}
                <span>• {new Date(resource.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
          {resource.cloudinaryUrl && (
            <div className="mt-3 flex items-center justify-between gap-3">
              <a
                href={resource.cloudinaryUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-lg bg-[#003087] px-3 py-2 text-xs font-medium text-white transition hover:opacity-90"
              >
                <DownloadCloud className="w-4 h-4" />
                Open resource
              </a>
              <span className="text-[12px] text-slate-400">{resource.downloadCount ?? 0} downloads</span>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
