import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, ExternalLink, Sparkles } from 'lucide-react'
import type { TopicItem, CategoryItem, TopicResource } from '../../types'
import { getTopicTutorial, buildTutorialUrl } from '../../config/topicTutorials'

interface ProminentTopicCardProps {
  topic: TopicItem
  category?: CategoryItem
}

export const ProminentTopicCard: React.FC<ProminentTopicCardProps> = ({ topic, category }) => {
  const tutorial = getTopicTutorial(topic.id)
  const catSlug = category?.slug || 'category'

  // Count resource formats
  const videoCount = topic.resources.filter(
    (r: TopicResource) => r.type === 'YouTube Video' || r.type === 'Facebook Video' || (r.type as any) === 'Video'
  ).length
  const infoCount = topic.resources.filter((r: TopicResource) => r.type === 'Infographic').length
  const pdfCount = topic.resources.filter((r: TopicResource) => r.type === 'PDF').length

  const tutorialUrl = tutorial ? buildTutorialUrl(tutorial.tutorialPath) : null

  return (
    <div className="bg-white border-2 border-teal-500/40 hover:border-teal-500 rounded-2xl shadow-sm hover:shadow-md transition-all p-6 sm:p-7 relative overflow-hidden">
      {/* Featured Accent Strip */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-linear-to-r from-teal-500 via-blue-500 to-indigo-500" />

      {/* Top Meta Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-1.5 text-xs font-bold text-teal-800">
          {category && (
            <Link
              to={`/category/${catSlug}`}
              className="hover:underline flex items-center gap-1"
            >
              <span>{category.title}</span>
            </Link>
          )}
          <span className="text-slate-300">/</span>
          <span className="text-slate-600 font-semibold">{topic.title}</span>
        </div>

        <div className="flex items-center gap-2">
          {tutorial && (
            <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-teal-50 text-teal-800 border border-teal-200">
              <Sparkles className="w-3 h-3 text-teal-600" />
              <span>Interactive Guide</span>
            </span>
          )}
          <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
            {topic.difficulty}
          </span>
        </div>
      </div>

      {/* Title & Short Description */}
      <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mb-2">
        {topic.title}
      </h2>

      <p className="text-sm text-slate-600 leading-relaxed mb-5 max-w-3xl">
        {tutorial ? tutorial.subtitle : topic.shortDescription}
      </p>

      {/* Resource Highlights Summary Pills */}
      <div className="flex flex-wrap items-center gap-2 mb-6 text-xs">
        <span className="text-slate-600 font-medium mr-1">Includes:</span>
        {tutorial && (
          <span className="px-2.5 py-1 rounded-lg bg-teal-50 border border-teal-200 text-teal-800 font-semibold flex items-center gap-1">
            <span>🕹️</span>
            <span>Interactive Tutorial</span>
          </span>
        )}
        {videoCount > 0 && (
          <span className="px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200 text-slate-700 font-medium flex items-center gap-1">
            <span>🎥</span>
            <span>{videoCount} Video Walkthrough{videoCount > 1 ? 's' : ''}</span>
          </span>
        )}
        {infoCount > 0 && (
          <span className="px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200 text-slate-700 font-medium flex items-center gap-1">
            <span>🖼️</span>
            <span>{infoCount} Architecture Infographic{infoCount > 1 ? 's' : ''}</span>
          </span>
        )}
        {pdfCount > 0 && (
          <span className="px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200 text-slate-700 font-medium flex items-center gap-1">
            <span>📄</span>
            <span>{pdfCount} Reference Handbook{pdfCount > 1 ? 's' : ''}</span>
          </span>
        )}
        {tutorial?.hasQuiz && (
          <span className="px-2.5 py-1 rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-800 font-medium flex items-center gap-1">
            <span>📝</span>
            <span>Interactive Quiz</span>
          </span>
        )}
      </div>

      {/* Primary Action Buttons */}
      <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center gap-3">
        {tutorialUrl ? (
          <>
            <a
              href={tutorialUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm shadow-sm transition-all hover:shadow"
            >
              <span>Start Learning</span>
              <ExternalLink className="w-4 h-4" />
            </a>

            <Link
              to={`/category/${catSlug}/topic/${topic.slug}`}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm transition-colors"
            >
              <span>View Resources ({topic.resources.length})</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </>
        ) : (
          <Link
            to={`/category/${catSlug}/topic/${topic.slug}`}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm shadow-sm transition-all"
          >
            <span>Explore Topic Resources ({topic.resources.length})</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        )}
      </div>
    </div>
  )
}
