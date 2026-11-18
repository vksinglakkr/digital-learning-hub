import React from 'react'
import { Clock, BookOpen, Layers, ArrowRight } from 'lucide-react'
import type { LearningPathItem } from '../types'

interface LearningPathCardProps {
  path: LearningPathItem
  onSelect: (pathTitle: string) => void
}

export const LearningPathCard: React.FC<LearningPathCardProps> = ({ path, onSelect }) => {
  const getLevelBadgeClass = (level: string) => {
    switch (level) {
      case 'Beginner':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200'
      case 'Intermediate':
        return 'bg-blue-50 text-blue-700 border-blue-200'
      case 'Advanced':
        return 'bg-purple-50 text-purple-700 border-purple-200'
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200'
    }
  }

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-7 flex flex-col justify-between hover:border-slate-300 hover:shadow-md transition-all">
      <div>
        {/* Top Badges */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
          <span className="text-xs font-bold text-teal-700 bg-teal-50 px-2.5 py-1 rounded-md border border-teal-100">
            {path.category}
          </span>
          <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${getLevelBadgeClass(path.level)}`}>
            {path.level}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-slate-900 mb-2 leading-snug">
          {path.title}
        </h3>

        {/* Description */}
        <p className="text-sm text-slate-600 leading-relaxed mb-6">
          {path.description}
        </p>

        {/* Structured Meta Info */}
        <div className="grid grid-cols-2 gap-3 py-3 px-4 bg-slate-50 rounded-xl border border-slate-100 mb-6 text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-slate-400" />
            <span>{path.duration}</span>
          </div>
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-slate-400" />
            <span>{path.moduleCount} Modules</span>
          </div>
        </div>
      </div>

      {/* Action CTA */}
      <button
        onClick={() => onSelect(path.title)}
        className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 text-xs font-semibold transition-colors"
      >
        <BookOpen className="w-4 h-4 text-teal-600" />
        <span>View Syllabus (Coming Soon)</span>
        <ArrowRight className="w-3.5 h-3.5 text-slate-400 ml-auto" />
      </button>
    </div>
  )
}

