import React from 'react'
import { CategoryCard } from './CategoryCard'
import { usePublicCurriculum } from '../context/PublicCurriculumContext'
import { isTopicPublished } from '../config/topicTutorials'
import { BookOpen } from 'lucide-react'

export const CategoriesSection: React.FC = () => {
  const { categories, topics } = usePublicCurriculum()

  // Display a Category on the Home Screen only when it contains at least one published, accessible learning resource.
  // Do not show categories that contain only empty or unpublished topics.
  const activeCategories = React.useMemo(() => {
    return categories.filter((category) => {
      // Digital Banking has 72 published resources bundled directly in its dedicated view
      if (category.id === 'digital-banking') {
        return (category.resourceCount ?? 0) > 0
      }
      const catTopics = topics.filter((t) => t.categoryId === category.id)
      return catTopics.some((topic) => isTopicPublished(topic))
    })
  }, [categories, topics])

  if (activeCategories.length === 0) {
    return null
  }

  return (
    <section id="categories" className="py-12 sm:py-16 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2.5 mb-1.5">
            <BookOpen className="w-6 h-6 text-teal-700" />
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              सीखना शुरू करें
            </h2>
          </div>
          <p className="text-sm sm:text-base text-slate-600">
            उपलब्ध Learning Categories से अपनी पसंद का विषय चुनें
          </p>
        </div>

        {/* Dynamic Category Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {activeCategories.map((category) => (
            <CategoryCard
              key={category.id}
              category={category}
            />
          ))}
        </div>

      </div>
    </section>
  )
}
