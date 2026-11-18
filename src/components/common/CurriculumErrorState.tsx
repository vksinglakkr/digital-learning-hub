import React from 'react'
import { AlertTriangle, RotateCcw } from 'lucide-react'

interface CurriculumErrorStateProps {
  error: string | null
  onRetry: () => void
}

export const CurriculumErrorState: React.FC<CurriculumErrorStateProps> = ({ error, onRetry }) => {
  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center p-8 text-center max-w-lg mx-auto animate-in fade-in duration-150">
      <div className="w-14 h-14 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center mb-4 shadow-2xs">
        <AlertTriangle className="w-7 h-7" />
      </div>
      <h2 className="text-lg font-bold text-slate-900 mb-2">Unable to Load Curriculum</h2>
      <p className="text-xs text-slate-600 mb-6 leading-relaxed">
        {error || 'An unexpected problem occurred while retrieving published curriculum data. Please check your internet connection and try again.'}
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={onRetry}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors shadow-xs cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Retry Loading</span>
        </button>
      </div>
    </div>
  )
}

