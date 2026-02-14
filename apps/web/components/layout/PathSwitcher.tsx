'use client'

import { useRouter } from 'next/navigation'
import { ArrowLeftRight } from 'lucide-react'
import { storage } from '@/lib/utils'

export default function PathSwitcher() {
  const router = useRouter()

  const switchPath = () => {
    storage.remove('preferredLearningPath')
    router.push('/')
  }

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
      <button
        onClick={switchPath}
        className="
          flex items-center gap-3 
          bg-white/90 backdrop-blur-lg 
          px-6 py-3 rounded-full 
          shadow-xl border border-white/50
          hover:bg-white hover:border-[var(--campus-gold)] 
          transition-all duration-300 
          group
          active:scale-95
        "
      >
        <div className="w-8 h-8 rounded-full bg-[#003087]/10 flex items-center justify-center transition-colors group-hover:bg-[var(--campus-gold)]">
          <ArrowLeftRight 
            className="w-4 h-4 text-[#003087] group-hover:text-black transition-all duration-300 group-hover:rotate-180" 
          />
        </div>
        
        <span className="text-sm font-semibold text-[#003087] pr-1">
          Switch Learning Path
        </span>
      </button>
    </div>
  )
}