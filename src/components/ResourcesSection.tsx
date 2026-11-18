import React from 'react'
import { ResourceCard } from './ResourceCard'
import { usePublicCurriculum } from '../context/PublicCurriculumContext'
import type { ResourceItem, ResourceType } from '../types'
import { FileCode, ArrowUpRight } from 'lucide-react'

interface ResourcesSectionProps {
  onNotifyComingSoon: (featureName: string) => void
}

export const ResourcesSection: React.FC<ResourcesSectionProps> = ({ onNotifyComingSoon }) => {
  const { publishedResources, topics, categories } = usePublicCurriculum()

  // Map published resources dynamically to public ResourceItem view models
  const displayResources: ResourceItem[] = React.useMemo(() => {
    return publishedResources.slice(0, 6).map((res) => {
      const parentTopic = topics.find((t) => t.resources.some((r) => r.id === res.id))
      const parentCategory = categories.find((c) => c.id === parentTopic?.categoryId)

      let resType: ResourceType = 'PDF'
      if (res.type === 'YouTube Video' || res.type === 'Facebook Video' || (res.type as any) === 'Video') {
        resType = 'Video'
      } else if (res.type === 'Infographic') {
        resType = 'Infographic'
      }

      return {
        id: res.id,
        title: res.title,
        category: parentCategory?.title || 'General Discipline',
        type: resType,
        description: res.description || parentTopic?.shortDescription || 'Educational learning resource',
        readOrWatchTime: res.durationOrPages || '5 min',
        tag: res.difficulty || 'Essential',
        publishedDate: 'Published Curriculum',
        creatorName: res.creatorName,
        creatorUrl: res.creatorUrl,
      }
    })
  }, [publishedResources, topics, categories])

  return (
    <section id="resources" className="py-16 sm:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <div className="flex items-center gap-2 text-teal-700 text-xs font-bold tracking-wider uppercase mb-2">
              <FileCode className="w-4 h-4" />
              <span>Multi-Format Library</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Latest Learning Resources
            </h2>
            <p className="text-sm sm:text-base text-slate-600 mt-2 max-w-xl">
              Curated infographics, video tutorials, and reference documentation ready for immediate practical application.
            </p>
          </div>

          <button
            onClick={() => onNotifyComingSoon('All Formats Resource Catalog')}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-700 hover:text-teal-800 transition-colors shrink-0 self-start md:self-auto"
          >
            <span>View all resources ({publishedResources.length})</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>

        {/* Dynamic Resource Cards Grid */}
        {displayResources.length === 0 ? (
          <div className="p-8 text-center text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200 text-xs">
            No published resources found in the current curriculum.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayResources.map((resource) => (
              <ResourceCard
                key={resource.id}
                resource={resource}
                onSelect={(title) => onNotifyComingSoon(`Resource: ${title}`)}
              />
            ))}
          </div>
        )}

      </div>
    </section>
  )
}


