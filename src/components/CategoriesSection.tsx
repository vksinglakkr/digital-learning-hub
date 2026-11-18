import React from 'react'
import { CategoryCard } from './CategoryCard'
import { usePublicCurriculum } from '../context/PublicCurriculumContext'
import { Compass } from 'lucide-react'

export const CategoriesSection: React.FC = () => {
  const { categories } = usePublicCurriculum()

  return (
    <section id="categories" className="py-16 sm:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <div className="flex items-center gap-2 text-teal-700 text-xs font-bold tracking-wider uppercase mb-2">
              <Compass className="w-4 h-4" />
              <span>Core Knowledge Disciplines</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Explore by Category
            </h2>
            <p className="text-sm sm:text-base text-slate-600 mt-2 max-w-xl">
              Curated resource libraries across modern business intelligence, workflow automation, and analytical disciplines.
            </p>
          </div>

          <div className="text-xs text-slate-600 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg shrink-0 self-start md:self-auto">
            {categories.length} active topic libraries
          </div>
        </div>

        {/* Category Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
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
