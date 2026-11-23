import React from 'react'
import { TEACHING_APPROACHES, type TeachingApproach } from '../../../types/tutorialBuilder'
import { Check, Sparkles } from 'lucide-react'

interface ApproachSelectorProps {
  selectedApproach: TeachingApproach
  onSelectApproach: (approach: TeachingApproach) => void
}

export const ApproachSelector: React.FC<ApproachSelectorProps> = ({
  selectedApproach,
  onSelectApproach,
}) => {
  return (
    <div className="space-y-3">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-teal-600" />
          <span>Teaching Approach Archetype</span>
        </label>
        <span className="text-[11px] text-slate-500 italic">
          Starting template — you can add or remove any blocks freely later.
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3">
        {TEACHING_APPROACHES.map((app) => {
          const isSelected = selectedApproach === app.id
          return (
            <button
              key={app.id}
              type="button"
              onClick={() => onSelectApproach(app.id)}
              className={`p-3.5 rounded-xl border text-left transition-all relative flex flex-col justify-between ${
                isSelected
                  ? 'border-teal-600 bg-teal-50/70 shadow-xs ring-2 ring-teal-500/20'
                  : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                    isSelected ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {app.badge}
                  </span>
                  {isSelected && (
                    <div className="w-4 h-4 rounded-full bg-teal-600 text-white flex items-center justify-center">
                      <Check className="w-2.5 h-2.5" />
                    </div>
                  )}
                </div>

                <h4 className="font-bold text-slate-900 text-xs sm:text-sm mb-1 leading-snug">
                  {app.title}
                </h4>
                <p className="text-[11px] text-slate-500 leading-relaxed mb-2 line-clamp-3">
                  {app.description}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-100 text-[10px] font-medium text-teal-700 truncate">
                Ideal: {app.recommendedFor.split(',')[0]}
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
