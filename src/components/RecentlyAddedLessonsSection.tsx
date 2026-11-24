import React from 'react'
import { Link } from 'react-router-dom'
import { Zap, ArrowRight, PlayCircle, BookOpen, Image as ImageIcon, FileText, ArrowUpRight, BarChart3, Binary, Layers, Mail } from 'lucide-react'
import { usePublicCurriculum } from '../context/PublicCurriculumContext'
import type { TopicResource } from '../types'

interface RecentlyAddedLessonsSectionProps {
  onSelectResource: (resource: TopicResource) => void
}

export const RecentlyAddedLessonsSection: React.FC<RecentlyAddedLessonsSectionProps> = ({ onSelectResource }) => {
  const { publishedResources, topics, categories } = usePublicCurriculum()

  /**
   * Documented Stable Fallback Ordering:
   * When individual publication timestamps are absent in curriculum data,
   * prioritize standalone interactive tutorials (type === 'Tutorial') first,
   * followed by other verified published resources in stable curriculum order.
   * Displays up to 3 verified published resources.
   */
  const recentLessons = React.useMemo(() => {
    const workingResources = publishedResources.filter((r) => r.status === 'Published')
    const sorted = [...workingResources].sort((a, b) => {
      const aIsTutorial = a.type === 'Tutorial' ? 1 : 0
      const bIsTutorial = b.type === 'Tutorial' ? 1 : 0
      return bIsTutorial - aIsTutorial
    })
    return sorted.slice(0, 3)
  }, [publishedResources])

  if (recentLessons.length === 0) {
    return null
  }

  const getCategoryForResource = (resource: TopicResource) => {
    const parentTopic = topics.find((t) => t.resources?.some((r) => r.id === resource.id))
    const parentCategory = categories.find((c) => c.id === parentTopic?.categoryId)
    return {
      categoryName: parentCategory?.title || 'General Discipline',
      categoryId: parentCategory?.id || '',
      topicDescription: parentTopic?.shortDescription || '',
    }
  }

  const getCategoryBadge = (catId: string, catName: string) => {
    if (catId === 'power-bi') {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
          <BarChart3 className="w-3.5 h-3.5 text-amber-600" />
          <span>{catName}</span>
        </span>
      )
    }
    if (catId === 'math-magic') {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
          <Binary className="w-3.5 h-3.5 text-emerald-600" />
          <span>{catName}</span>
        </span>
      )
    }
    if (catId === 'gmail') {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold bg-rose-50 text-rose-800 border border-rose-200">
          <Mail className="w-3.5 h-3.5 text-rose-600" />
          <span>{catName}</span>
        </span>
      )
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold bg-teal-50 text-teal-800 border border-teal-200">
        <Layers className="w-3.5 h-3.5 text-teal-600" />
        <span>{catName}</span>
      </span>
    )
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Tutorial':
        return (
          <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-600 flex items-center justify-center" title="Interactive Tutorial">
            <BookOpen className="w-4 h-4" />
          </div>
        )
      case 'YouTube Video':
      case 'Facebook Video':
      case 'Video':
        return (
          <div className="w-8 h-8 rounded-lg bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center" title="Video Lesson">
            <PlayCircle className="w-4 h-4" />
          </div>
        )
      case 'PDF':
        return (
          <div className="w-8 h-8 rounded-lg bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center" title="PDF Document">
            <FileText className="w-4 h-4" />
          </div>
        )
      default:
        return (
          <div className="w-8 h-8 rounded-lg bg-teal-50 border border-teal-200 text-teal-600 flex items-center justify-center" title="Visual Reference">
            <ImageIcon className="w-4 h-4" />
          </div>
        )
    }
  }

  return (
    <section id="recent-lessons" className="py-12 sm:py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <Zap className="w-6 h-6 text-amber-500 fill-amber-500" />
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Recently Added Lessons
              </h2>
            </div>
            <p className="text-sm sm:text-base text-slate-600">
              हाल ही में जोड़ी गई Learning सामग्री
            </p>
          </div>

          <Link
            to="/search"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-teal-700 hover:text-teal-800 border border-teal-200 hover:bg-teal-50 px-3.5 py-1.5 rounded-full transition-colors shrink-0 self-start sm:self-auto"
            title="सभी उपलब्ध Tutorials और Resources देखें"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Dynamic 3 Lessons Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {recentLessons.map((resource) => {
            const { categoryName, categoryId, topicDescription } = getCategoryForResource(resource)
            const description = resource.description || topicDescription || 'Interactive educational learning lesson'

            return (
              <div
                key={resource.id}
                className="group bg-white border border-slate-200 rounded-2xl p-6 hover:border-teal-300 hover:shadow-lg hover:shadow-slate-200/50 transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Top: Category Tag & Resource Type Icon */}
                  <div className="flex items-center justify-between gap-2 mb-4">
                    {getCategoryBadge(categoryId, categoryName)}
                    {getTypeIcon(resource.type)}
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-teal-800 transition-colors mb-2 leading-snug">
                    {resource.title}
                  </h3>

                  {/* Description */}
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed line-clamp-3 mb-6">
                    {description}
                  </p>
                </div>

                {/* Open Lesson Action */}
                <div className="pt-4 border-t border-slate-100">
                  <button
                    onClick={() => onSelectResource(resource)}
                    className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-teal-700 text-white text-xs font-bold transition-colors cursor-pointer shadow-xs"
                  >
                    <span>Open Lesson</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )
          })}
        </div>

      </div>
    </section>
  )
}
