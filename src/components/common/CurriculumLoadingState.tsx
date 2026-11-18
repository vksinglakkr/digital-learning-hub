import React from 'react'
import { Loader2 } from 'lucide-react'

interface CurriculumLoadingStateProps {
  message?: string
}

export const CurriculumLoadingState: React.FC<CurriculumLoadingStateProps> = ({
  message = 'Loading verified educational curriculum...',
}) => {
  return (
    <div className="min-h-[40vh] flex flex-col items-center justify-center p-8 text-center animate-in fade-in duration-150">
      <div className="w-12 h-12 rounded-2xl bg-teal-50 border border-teal-200 text-teal-700 flex items-center justify-center mb-4 shadow-2xs">
        <Loader2 className="w-6 h-6 animate-spin text-teal-700" />
      </div>
      <h3 className="text-sm font-bold text-slate-800 mb-1">{message}</h3>
      <p className="text-xs text-slate-500 max-w-sm">
        Retrieving published knowledge categories, learning topics, and multi-format learning resources.
      </p>
    </div>
  )
}

