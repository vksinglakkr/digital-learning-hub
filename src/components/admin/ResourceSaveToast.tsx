import React, { useEffect } from 'react'
import { CheckCircle2, X } from 'lucide-react'

export interface ResourceSaveToastProps {
  type: 'save' | 'update'
  resourceTitle?: string
  message?: string
  onClose: () => void
  durationMs?: number
}

export const ResourceSaveToast: React.FC<ResourceSaveToastProps> = ({
  type,
  resourceTitle,
  message,
  onClose,
  durationMs = 5000,
}) => {
  useEffect(() => {
    if (durationMs <= 0) return
    const timer = setTimeout(() => {
      onClose()
    }, durationMs)
    return () => clearTimeout(timer)
  }, [durationMs, onClose])

  const heading = type === 'update' ? 'Resource Updated Successfully!' : 'Resource Saved Successfully!'

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-5 right-5 z-50 max-w-sm sm:max-w-md w-[calc(100%-2.5rem)] sm:w-auto bg-white border border-emerald-300 rounded-xl shadow-lg p-3.5 sm:p-4 text-slate-800 animate-in fade-in duration-150"
    >
      <div className="flex items-start gap-3">
        <div className="p-1 bg-emerald-100 text-emerald-600 rounded-full shrink-0 mt-0.5">
          <CheckCircle2 className="w-5 h-5" />
        </div>
        <div className="space-y-1 flex-1 min-w-0 pr-1">
          <p className="text-xs sm:text-sm font-bold text-slate-900 tracking-tight">
            {heading}
          </p>
          {resourceTitle && (
            <p className="text-xs text-slate-600 font-medium truncate">
              "{resourceTitle}"
            </p>
          )}
          {message && (
            <p className="text-xs text-slate-600 font-medium">
              {message}
            </p>
          )}
          <p className="text-[11px] sm:text-xs text-emerald-700 font-medium pt-0.5 leading-snug">
            Saved in Admin Studio. Export curriculum.json to update the Public Website.
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close notification"
          className="text-slate-400 hover:text-slate-700 p-1 -mr-1 -mt-1 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer shrink-0"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}

