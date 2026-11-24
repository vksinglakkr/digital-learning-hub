import React from 'react'
import { Link } from 'react-router-dom'
import { 
  BarChart3, 
  Workflow, 
  TableProperties, 
  GitBranch, 
  Sparkles, 
  Binary, 
  ArrowRight,
  Layers,
  Mail
} from 'lucide-react'
import type { CategoryItem } from '../types'

interface CategoryCardProps {
  category: CategoryItem
}

export const CategoryCard: React.FC<CategoryCardProps> = ({ category }) => {
  const getCategoryDetails = () => {
    switch (category.id) {
      case 'power-bi':
        return {
          icon: <BarChart3 className="w-8 h-8 text-amber-500" />,
          iconBg: 'bg-amber-50 border-amber-200/80',
          cardHover: 'hover:border-amber-300',
          desc: 'Data से Insight और Dashboard बनाना सीखें।'
        }
      case 'math-magic':
        return {
          icon: <Binary className="w-8 h-8 text-blue-500" />,
          iconBg: 'bg-blue-50 border-blue-200/80',
          cardHover: 'hover:border-blue-300',
          desc: 'गणित के आसान और तेज़ Tricks सीखें।'
        }
      case 'gmail':
        return {
          icon: <Mail className="w-8 h-8 text-rose-500" />,
          iconBg: 'bg-rose-50 border-rose-200/80',
          cardHover: 'hover:border-rose-300',
          desc: 'Email को स्मार्ट तरीके से लिखें और Schedule करें।'
        }
      default: {
        let iconElem = <Layers className="w-8 h-8 text-teal-600" />
        if (category.iconName === 'BarChart3') iconElem = <BarChart3 className="w-8 h-8 text-teal-600" />
        else if (category.iconName === 'Workflow') iconElem = <Workflow className="w-8 h-8 text-teal-600" />
        else if (category.iconName === 'TableProperties') iconElem = <TableProperties className="w-8 h-8 text-teal-600" />
        else if (category.iconName === 'GitBranch') iconElem = <GitBranch className="w-8 h-8 text-teal-600" />
        else if (category.iconName === 'Sparkles') iconElem = <Sparkles className="w-8 h-8 text-teal-600" />
        else if (category.iconName === 'Binary') iconElem = <Binary className="w-8 h-8 text-teal-600" />
        else if (category.iconName === 'Mail') iconElem = <Mail className="w-8 h-8 text-rose-600" />
        return {
          icon: iconElem,
          iconBg: 'bg-teal-50 border-teal-200',
          cardHover: 'hover:border-teal-300',
          desc: category.description
        }
      }
    }
  }

  const { icon, iconBg, cardHover, desc } = getCategoryDetails()

  return (
    <Link
      to={`/category/${category.slug}`}
      className={`group relative bg-white border border-slate-200 rounded-2xl p-6 ${cardHover} hover:shadow-lg hover:shadow-slate-200/50 transition-all duration-200 flex items-center justify-between gap-4 focus:outline-hidden`}
    >
      <div className="flex items-center gap-4 min-w-0">
        <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl border flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform ${iconBg}`}>
          {icon}
        </div>
        <div className="min-w-0">
          <h3 className="text-xl font-bold text-slate-900 group-hover:text-teal-700 transition-colors leading-snug mb-1">
            {category.title}
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed line-clamp-2">
            {desc || category.description}
          </p>
        </div>
      </div>

      <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-teal-600 text-white flex items-center justify-center shrink-0 group-hover:bg-teal-700 group-hover:scale-105 transition-all shadow-xs">
        <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-0.5 transition-transform" />
      </div>
    </Link>
  )
}
