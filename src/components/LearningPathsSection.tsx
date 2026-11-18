import React from 'react'
import { LearningPathCard } from './LearningPathCard'
import { DEMO_LEARNING_PATHS } from '../data/mockData'
import { GraduationCap } from 'lucide-react'

interface LearningPathsSectionProps {
  onNotifyComingSoon: (featureName: string) => void
}

export const LearningPathsSection: React.FC<LearningPathsSectionProps> = ({ onNotifyComingSoon }) => {
  return (
    <section id="learning-paths" className="py-16 sm:py-20 bg-slate-50/70 border-y border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <div className="flex items-center gap-2 text-teal-700 text-xs font-bold tracking-wider uppercase mb-2">
              <GraduationCap className="w-4 h-4" />
              <span>Step-by-Step Academies</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Featured Learning Paths
            </h2>
            <p className="text-sm sm:text-base text-slate-600 mt-2 max-w-xl">
              Sequenced, goal-oriented roadmaps designed to take you from foundational concepts to practical execution.
            </p>
          </div>

          <div className="text-xs text-slate-500 bg-white border border-slate-200 px-3 py-1.5 rounded-lg shrink-0 self-start md:self-auto">
            Self-paced roadmaps
          </div>
        </div>

        {/* 3 Learning Paths Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {DEMO_LEARNING_PATHS.map((path) => (
            <LearningPathCard
              key={path.id}
              path={path}
              onSelect={(title) => onNotifyComingSoon(`Learning Path: ${title}`)}
            />
          ))}
        </div>

      </div>
    </section>
  )
}

