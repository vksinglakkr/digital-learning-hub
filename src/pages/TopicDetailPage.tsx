import React, { useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { Header } from '../components/Header'
import { Footer } from '../components/Footer'
import { Breadcrumbs } from '../components/Breadcrumbs'
import { ResourceDemoModal } from '../components/ResourceDemoModal'
import { NoticeModal } from '../components/NoticeModal'
import { usePublicCurriculum } from '../context/PublicCurriculumContext'
import { CurriculumLoadingState } from '../components/common/CurriculumLoadingState'
import { CurriculumErrorState } from '../components/common/CurriculumErrorState'
import type { AdminResourceType, TopicResource } from '../types'
import { 
  ArrowLeft, 
  ArrowRight,
  PlayCircle, 
  Video as VideoIcon,
  Image as ImageIcon, 
  FileText, 
  BookOpen, 
  Globe,
  HelpCircle,
  Clock,
  Layers,
  Sparkles,
  ExternalLink,
  Milestone,
  User,
  Scissors
} from 'lucide-react'
import { formatSecondsToTime, formatClipDuration } from '../utils/timeFormat'
import { extractYouTubeVideoId } from '../utils/youtubeEmbed'

type ResourceTabKey = 'All' | 'Infographics' | 'Videos' | 'PDFs' | 'Tutorials' | 'External Links'

export const TopicDetailPage: React.FC = () => {
  const { categorySlug, topicSlug } = useParams<{ categorySlug: string; topicSlug: string }>()
  const navigate = useNavigate()
  const { categories, topics: allTopics, isLoading, error, retry } = usePublicCurriculum()

  const [activeTab, setActiveTab] = useState<ResourceTabKey>('All')
  const [selectedDemoResource, setSelectedDemoResource] = useState<TopicResource | null>(null)
  
  const [noticeModalState, setNoticeModalState] = useState<{
    isOpen: boolean
    title: string
    message: string
  }>({
    isOpen: false,
    title: '',
    message: '',
  })

  const category = categories.find(
    (c) => c.slug === categorySlug || c.id === categorySlug
  )

  const topic = allTopics.find(
    (t) => (t.categoryId === category?.id) && (t.slug === topicSlug || t.id === topicSlug)
  )

  const handleNotifyComingSoon = (featureName: string) => {
    setNoticeModalState({
      isOpen: true,
      title: featureName,
      message: `The "${featureName}" feature is currently in prototype mode. Data will be fully searchable when backend indexing is connected.`,
    })
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white text-slate-900 flex flex-col justify-between font-sans">
        <Header onNotifyComingSoon={handleNotifyComingSoon} />
        <CurriculumLoadingState />
        <Footer onNotifyComingSoon={handleNotifyComingSoon} />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white text-slate-900 flex flex-col justify-between font-sans">
        <Header onNotifyComingSoon={handleNotifyComingSoon} />
        <CurriculumErrorState error={error} onRetry={retry} />
        <Footer onNotifyComingSoon={handleNotifyComingSoon} />
      </div>
    )
  }

  if (!category || !topic) {
    return (
      <div className="min-h-screen bg-white text-slate-900 flex flex-col justify-between font-sans">
        <Header onNotifyComingSoon={handleNotifyComingSoon} />
        <div className="max-w-2xl mx-auto py-20 px-4 text-center">
          <HelpCircle className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Topic Not Found</h1>
          <p className="text-sm text-slate-600 mb-6">
            The topic requested could not be located in this category.
          </p>
          <Link
            to={category ? `/category/${category.slug}` : '/'}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-semibold hover:bg-slate-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{category ? `Back to ${category.title}` : 'Return to Home'}</span>
          </Link>
        </div>
        <Footer onNotifyComingSoon={handleNotifyComingSoon} />
      </div>
    )
  }

  // Filter public visible resources: ONLY 'Published' resources (Draft and Hidden are strictly excluded)
  const visibleResources = topic.resources.filter((r) => r.status === 'Published')

  // Count resources by format
  const videoCount = visibleResources.filter((r) => r.type === 'YouTube Video' || r.type === 'Facebook Video' || (r.type as any) === 'Video').length
  const infoCount = visibleResources.filter((r) => r.type === 'Infographic').length
  const pdfCount = visibleResources.filter((r) => r.type === 'PDF').length
  const tutCount = visibleResources.filter((r) => r.type === 'Tutorial').length
  const linkCount = visibleResources.filter((r) => r.type === 'External Link').length

  const tabs: Array<{ key: ResourceTabKey; label: string; count: number }> = [
    { key: 'All', label: 'All Resources', count: visibleResources.length },
    { key: 'Infographics', label: 'Infographics', count: infoCount },
    { key: 'Videos', label: 'Videos', count: videoCount },
    { key: 'PDFs', label: 'PDFs', count: pdfCount },
    { key: 'Tutorials', label: 'Tutorials', count: tutCount },
    ...(linkCount > 0 ? [{ key: 'External Links' as ResourceTabKey, label: 'External Links', count: linkCount }] : []),
  ]

  // Filter resources based on active tab
  const filteredResources = visibleResources
    .filter((r) => {
      if (activeTab === 'All') return true
      if (activeTab === 'Infographics') return r.type === 'Infographic'
      if (activeTab === 'Videos') return r.type === 'YouTube Video' || r.type === 'Facebook Video' || (r.type as any) === 'Video'
      if (activeTab === 'PDFs') return r.type === 'PDF'
      if (activeTab === 'Tutorials') return r.type === 'Tutorial'
      if (activeTab === 'External Links') return r.type === 'External Link'
      return true
    })
    .sort((a, b) => a.displayOrder - b.displayOrder)

  // Find related topics objects
  const relatedTopics = allTopics.filter((t) => (topic.relatedTopicIds || []).includes(t.id))

  const getTypeIcon = (type: AdminResourceType | string) => {
    switch (type) {
      case 'YouTube Video':
      case 'Video':
        return <PlayCircle className="w-4 h-4 text-rose-600" />
      case 'Facebook Video':
        return <VideoIcon className="w-4 h-4 text-blue-600" />
      case 'Infographic':
        return <ImageIcon className="w-4 h-4 text-emerald-600" />
      case 'PDF':
        return <FileText className="w-4 h-4 text-amber-600" />
      case 'Tutorial':
        return <BookOpen className="w-4 h-4 text-indigo-600" />
      case 'External Link':
        return <Globe className="w-4 h-4 text-teal-600" />
      default:
        return <Globe className="w-4 h-4 text-teal-600" />
    }
  }

  const getTypeBadgeStyle = (type: AdminResourceType | string) => {
    switch (type) {
      case 'YouTube Video':
      case 'Video':
        return 'bg-rose-50 text-rose-700 border-rose-200'
      case 'Facebook Video':
        return 'bg-blue-50 text-blue-700 border-blue-200'
      case 'Infographic':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200'
      case 'PDF':
        return 'bg-amber-50 text-amber-700 border-amber-200'
      case 'Tutorial':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200'
      case 'External Link':
        return 'bg-teal-50 text-teal-700 border-teal-200'
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200'
    }
  }

  return (
    <div className="min-h-screen bg-slate-50/50 text-slate-900 flex flex-col justify-between font-sans">
      <div>
        <Header onNotifyComingSoon={handleNotifyComingSoon} />

        {/* Working Breadcrumbs */}
        <div className="bg-white border-b border-slate-200">
          <Breadcrumbs
            items={[
              { label: category.title, to: `/category/${category.slug}` },
              { label: topic.title },
            ]}
          />
        </div>

        {/* Topic Header */}
        <section className="bg-white border-b border-slate-200 py-10 sm:py-14">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <button
              onClick={() => navigate(`/category/${category.slug}`)}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-teal-700 transition-colors mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to {category.title}</span>
            </button>

            <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
              <div className="space-y-3 max-w-3xl">
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="text-xs font-bold text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-100 uppercase tracking-wider">
                    {category.title}
                  </span>
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                    Level: {topic.difficulty}
                  </span>
                  <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                    Demo Dataset
                  </span>
                </div>

                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
                  {topic.title}
                </h1>

                <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
                  {topic.detailedDescription}
                </p>
              </div>

              {/* Topic Resource Summary Box */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 shrink-0 w-full lg:w-72">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-3">
                  Resource Inventory
                </span>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between text-slate-600">
                    <span className="flex items-center gap-1.5">
                      <ImageIcon className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Infographics</span>
                    </span>
                    <span className="font-semibold text-slate-900">{infoCount}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-600">
                    <span className="flex items-center gap-1.5">
                      <PlayCircle className="w-3.5 h-3.5 text-rose-600" />
                      <span>Videos</span>
                    </span>
                    <span className="font-semibold text-slate-900">{videoCount}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-600">
                    <span className="flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-amber-600" />
                      <span>PDF Handbooks</span>
                    </span>
                    <span className="font-semibold text-slate-900">{pdfCount}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-600">
                    <span className="flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
                      <span>Tutorials / Labs</span>
                    </span>
                    <span className="font-semibold text-slate-900">{tutCount}</span>
                  </div>
                  {linkCount > 0 && (
                    <div className="flex items-center justify-between text-slate-600">
                      <span className="flex items-center gap-1.5">
                        <Globe className="w-3.5 h-3.5 text-teal-600" />
                        <span>External Links</span>
                      </span>
                      <span className="font-semibold text-slate-900">{linkCount}</span>
                    </div>
                  )}
                  <div className="pt-2 border-t border-slate-200 flex items-center justify-between font-bold text-slate-900">
                    <span>Total Resources</span>
                    <span>{visibleResources.length}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content Area */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
          
          {/* Section: Recommended Learning Sequence */}
          {topic.recommendedSequence && topic.recommendedSequence.length > 0 && (
            <section className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-teal-50 text-teal-700 border border-teal-100">
                    <Milestone className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                      Recommended Learning Sequence
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-500">
                      A structured multi-format progression combining visual infographics, video walkthroughs, hands-on tutorials, and reference documentation.
                    </p>
                  </div>
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-teal-50 text-teal-800 border border-teal-200 self-start sm:self-auto shrink-0">
                  {topic.recommendedSequence.length} Ordered Steps
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {topic.recommendedSequence.map((step) => {
                  const linkedResource = topic.resources.find((r) => r.id === step.resourceId)

                  return (
                    <div
                      key={step.stepNumber}
                      onClick={() => linkedResource && setSelectedDemoResource(linkedResource)}
                      className="group cursor-pointer bg-slate-50/70 hover:bg-white border border-slate-200 hover:border-teal-300 rounded-xl p-4 transition-all duration-150 flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="w-6 h-6 rounded-full bg-slate-900 text-white font-bold text-xs flex items-center justify-center">
                            {step.stepNumber}
                          </span>
                          {linkedResource && (
                            <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full border ${getTypeBadgeStyle(linkedResource.type)}`}>
                              {getTypeIcon(linkedResource.type)}
                              <span>{linkedResource.type}</span>
                            </span>
                          )}
                        </div>

                        <h4 className="font-bold text-slate-900 text-sm mb-1 group-hover:text-teal-800 transition-colors">
                          {step.phaseTitle}
                        </h4>
                        <p className="text-xs text-slate-600 leading-relaxed mb-3">
                          {step.objective}
                        </p>
                      </div>

                      {linkedResource && (
                        <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-teal-700 font-semibold">
                          <span className="line-clamp-1">{linkedResource.title}</span>
                          <ArrowRight className="w-3.5 h-3.5 shrink-0 ml-1 group-hover:translate-x-0.5 transition-transform" />
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </section>
          )}

          {/* Section: All Topic Resources organized by Tabs */}
          <section className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
                  Learning Resource Library
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  Explore and filter all {visibleResources.length} available resources dedicated to {topic.title}.
                </p>
              </div>

              {/* Resource Format Tabs */}
              <div className="flex items-center gap-1.5 p-1 bg-white border border-slate-200 rounded-xl overflow-x-auto">
                {tabs.map((tab) => {
                  const isActive = activeTab === tab.key
                  return (
                    <button
                      key={tab.key}
                      onClick={() => setActiveTab(tab.key)}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all shrink-0 flex items-center gap-1.5 ${
                        isActive
                          ? 'bg-slate-900 text-white shadow-xs'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                      }`}
                    >
                      <span>{tab.label}</span>
                      <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                        isActive ? 'bg-slate-800 text-teal-300' : 'bg-slate-100 text-slate-500'
                      }`}>
                        {tab.count}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Resources Grid */}
            {filteredResources.length === 0 ? (
              <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center text-slate-500">
                <Layers className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                <p className="font-semibold text-slate-700">No resources found in this category tab</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredResources.map((resource) => (
                  <div
                    key={resource.id}
                    className="bg-white border border-slate-200 rounded-2xl p-6 hover:border-teal-300 hover:shadow-lg hover:shadow-slate-200/50 transition-all flex flex-col justify-between"
                  >
                    <div>
                      {/* Top Badges */}
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <div className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border ${getTypeBadgeStyle(resource.type)}`}>
                          {getTypeIcon(resource.type)}
                          <span>{resource.type}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200">
                            DEMO
                          </span>
                          <span className="text-[11px] font-mono text-slate-600 font-semibold">
                            #{resource.displayOrder}
                          </span>
                        </div>
                      </div>

                      {/* Video Thumbnail if present */}
                      {resource.thumbnailUrl && (
                        <div 
                          onClick={() => setSelectedDemoResource(resource)}
                          className="cursor-pointer relative aspect-video w-full rounded-xl overflow-hidden mb-3 border border-slate-200 bg-slate-950 group"
                        >
                          <img
                            src={resource.thumbnailUrl}
                            alt={resource.title}
                            className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-200"
                          />
                          <div className="absolute inset-0 bg-slate-900/25 group-hover:bg-slate-900/10 transition-colors flex items-center justify-center">
                            <div className="p-2 rounded-full bg-rose-600/90 text-white shadow-md group-hover:scale-110 transition-transform">
                              <PlayCircle className="w-5 h-5" />
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Resource Title */}
                      <h3 className="text-base font-bold text-slate-900 leading-snug mb-1.5">
                        {resource.title}
                      </h3>

                      {/* Creator attribution if video */}
                      {resource.creatorName && (
                        <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-2 font-medium">
                          <User className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                          <span>By {resource.creatorName}</span>
                        </div>
                      )}

                      {/* Clip indicator if start/end times exist */}
                      {((resource.startSeconds != null && resource.startSeconds > 0) || (resource.endSeconds != null && resource.endSeconds > 0)) && (
                        <div className="inline-flex items-center gap-1.5 text-[11px] font-semibold px-2 py-0.5 rounded-md bg-rose-50 text-rose-800 border border-rose-200 mb-2">
                          <Scissors className="w-3 h-3 text-rose-600 shrink-0" />
                          <span>
                            Clip: {resource.startTime || formatSecondsToTime(resource.startSeconds)} – {resource.endTime || (resource.endSeconds ? formatSecondsToTime(resource.endSeconds) : 'End')}
                            {formatClipDuration(resource.startSeconds, resource.endSeconds) && ` (${formatClipDuration(resource.startSeconds, resource.endSeconds)})`}
                          </span>
                        </div>
                      )}

                      {/* Description */}
                      <p className="text-xs text-slate-600 leading-relaxed mb-4">
                        {resource.description || 'Comprehensive learning material tailored for this topic.'}
                      </p>
                    </div>

                    {/* Metadata & Open Action */}
                    <div className="pt-3 border-t border-slate-100 space-y-2.5">
                      <div className="flex items-center justify-between text-xs text-slate-500">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          <span>{resource.durationOrPages || 'Guide'}</span>
                        </div>
                        <span className="text-[11px] font-medium text-slate-600">
                          {resource.difficulty || 'All Levels'}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setSelectedDemoResource(resource)}
                          className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition-colors"
                        >
                          <span>Open Resource</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </button>

                        {(resource.type === 'YouTube Video' || resource.type === 'Facebook Video' || (resource.type as string) === 'Video') && (
                          <a
                            href={
                              resource.url.startsWith('demo://')
                                ? '#'
                                : (extractYouTubeVideoId(resource.url) && resource.startSeconds && resource.startSeconds > 0)
                                  ? `https://www.youtube.com/watch?v=${extractYouTubeVideoId(resource.url)}&t=${Math.floor(resource.startSeconds)}s`
                                  : resource.url
                            }
                            target={resource.url.startsWith('demo://') ? '_self' : '_blank'}
                            rel="noreferrer"
                            onClick={(e) => {
                              if (resource.url.startsWith('demo://')) {
                                e.preventDefault()
                                setSelectedDemoResource(resource)
                              }
                            }}
                            className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors flex items-center justify-center"
                            title="Watch on Original Platform"
                            aria-label="Watch on Original Platform"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Section: Related Topics */}
          {relatedTopics.length > 0 && (
            <section className="pt-8 border-t border-slate-200">
              <div className="mb-6">
                <div className="flex items-center gap-2 text-teal-700 text-xs font-bold tracking-wider uppercase mb-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Cross-Discipline Connections</span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 tracking-tight">
                  Related Topics in {category.title}
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {relatedTopics.map((relTopic) => (
                  <Link
                    key={relTopic.id}
                    to={`/category/${category.slug}/topic/${relTopic.slug}`}
                    className="group bg-white border border-slate-200 hover:border-teal-300 rounded-xl p-5 transition-all hover:shadow-md flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[11px] font-bold text-teal-700 uppercase">
                          {relTopic.difficulty}
                        </span>
                        <span className="text-xs text-slate-600 font-medium">
                          {relTopic.resources.length} items
                        </span>
                      </div>
                      <h4 className="font-bold text-slate-900 text-base mb-1.5 group-hover:text-teal-800 transition-colors">
                        {relTopic.title}
                      </h4>
                      <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-4">
                        {relTopic.shortDescription}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-teal-700 group-hover:text-teal-800">
                      <span>View Topic</span>
                      <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

        </main>
      </div>

      <Footer onNotifyComingSoon={handleNotifyComingSoon} />

      {/* Demo Resource Inspector Modal */}
      <ResourceDemoModal
        resource={selectedDemoResource}
        onClose={() => setSelectedDemoResource(null)}
      />

      {/* Notice Modal */}
      <NoticeModal
        isOpen={noticeModalState.isOpen}
        title={noticeModalState.title}
        message={noticeModalState.message}
        onClose={() => setNoticeModalState((prev) => ({ ...prev, isOpen: false }))}
      />
    </div>
  )
}
