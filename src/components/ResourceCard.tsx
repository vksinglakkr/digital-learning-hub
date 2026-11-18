import React from 'react'
import { FileText, PlayCircle, Image as ImageIcon, ArrowUpRight, Clock, Tag } from 'lucide-react'
import type { ResourceItem, ResourceType } from '../types'

interface ResourceCardProps {
  resource: ResourceItem
  onSelect: (resourceTitle: string) => void
}

export const ResourceCard: React.FC<ResourceCardProps> = ({ resource, onSelect }) => {
  const getTypeBadge = (type: ResourceType) => {
    switch (type) {
      case 'Infographic':
        return {
          icon: <ImageIcon className="w-4 h-4 text-emerald-600" />,
          label: 'Infographic',
          badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        }
      case 'Video':
        return {
          icon: <PlayCircle className="w-4 h-4 text-rose-600" />,
          label: 'YouTube Video',
          badgeClass: 'bg-rose-50 text-rose-700 border-rose-200',
        }
      case 'PDF':
        return {
          icon: <FileText className="w-4 h-4 text-amber-600" />,
          label: 'PDF Reference',
          badgeClass: 'bg-amber-50 text-amber-700 border-amber-200',
        }
      default:
        return {
          icon: <FileText className="w-4 h-4 text-slate-600" />,
          label: 'Resource',
          badgeClass: 'bg-slate-50 text-slate-700 border-slate-200',
        }
    }
  }

  const { icon, label, badgeClass } = getTypeBadge(resource.type)

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 hover:border-slate-300 hover:shadow-md transition-all flex flex-col justify-between">
      <div>
        {/* Top Badges: Category & Type */}
        <div className="flex items-center justify-between gap-2 mb-4">
          <span className="text-xs font-semibold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-md">
            {resource.category}
          </span>
          <div className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border ${badgeClass}`}>
            {icon}
            <span>{label}</span>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-lg font-bold text-slate-900 mb-2 leading-snug">
          {resource.title}
        </h3>

        {/* Description */}
        <p className="text-sm text-slate-600 leading-relaxed mb-6">
          {resource.description}
        </p>
      </div>

      {/* Meta info & Action */}
      <div className="pt-4 border-t border-slate-100">
        <div className="flex items-center justify-between text-xs text-slate-600 mb-4">
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>{resource.readOrWatchTime}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Tag className="w-3.5 h-3.5 text-slate-400" />
            <span>{resource.tag}</span>
          </div>
        </div>

        <button
          onClick={() => onSelect(resource.title)}
          className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition-colors"
        >
          <span>Open Resource</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  )
}

