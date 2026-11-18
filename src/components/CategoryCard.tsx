import React from 'react'
import { Link } from 'react-router-dom'
import { 
  BarChart3, 
  Workflow, 
  TableProperties, 
  GitBranch, 
  Sparkles, 
  Binary, 
  ArrowRight 
} from 'lucide-react'
import type { CategoryItem } from '../types'

interface CategoryCardProps {
  category: CategoryItem
}

export const CategoryCard: React.FC<CategoryCardProps> = ({ category }) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'BarChart3':
        return <BarChart3 className="w-6 h-6 text-teal-700" />
      case 'Workflow':
        return <Workflow className="w-6 h-6 text-teal-700" />
      case 'TableProperties':
        return <TableProperties className="w-6 h-6 text-teal-700" />
      case 'GitBranch':
        return <GitBranch className="w-6 h-6 text-teal-700" />
      case 'Sparkles':
        return <Sparkles className="w-6 h-6 text-teal-700" />
      case 'Binary':
        return <Binary className="w-6 h-6 text-teal-700" />
      default:
        return <Sparkles className="w-6 h-6 text-teal-700" />
    }
  }

  return (
    <Link
      to={`/category/${category.slug}`}
      className="group relative bg-white border border-slate-200 rounded-2xl p-6 hover:border-teal-300 hover:shadow-lg hover:shadow-slate-200/50 transition-all duration-200 flex flex-col justify-between block focus:outline-hidden"
    >
      <div>
        {/* Header: Icon & Resource count badge */}
        <div className="flex items-center justify-between mb-4">
          <div className="w-12 h-12 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center group-hover:scale-105 group-hover:bg-teal-100/70 transition-all">
            {getIcon(category.iconName)}
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
            {category.resourceCount} items
          </span>
        </div>

        {/* Title & Description */}
        <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-teal-800 transition-colors">
          {category.title}
        </h3>
        <p className="text-sm text-slate-600 leading-relaxed line-clamp-3 mb-6">
          {category.description}
        </p>
      </div>

      {/* Action link */}
      <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
        <span className="text-xs text-slate-400 font-medium">Curated Tracks</span>
        <span className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-700 group-hover:text-teal-800 transition-colors">
          <span>Explore Category</span>
          <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
        </span>
      </div>
    </Link>
  )
}
