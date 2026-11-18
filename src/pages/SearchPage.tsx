import React, { useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { Header } from '../components/Header'
import { Footer } from '../components/Footer'
import { Breadcrumbs } from '../components/Breadcrumbs'
import { ResourceDemoModal } from '../components/ResourceDemoModal'
import { NoticeModal } from '../components/NoticeModal'
import { usePublicCurriculum } from '../context/PublicCurriculumContext'
import { CurriculumLoadingState } from '../components/common/CurriculumLoadingState'
import { CurriculumErrorState } from '../components/common/CurriculumErrorState'
import { executeGlobalSearch } from '../utils/searchEngine'
import type { AdminResourceType, TopicResource } from '../types'
import { 
  Search, 
  X, 
  ArrowRight, 
  BookOpen, 
  Layers, 
  ExternalLink, 
  PlayCircle, 
  Video as VideoIcon, 
  Image as ImageIcon, 
  FileText, 
  Sparkles, 
  HelpCircle, 
  User, 
  Tag, 
  BarChart3, 
  Workflow, 
  TableProperties, 
  GitBranch, 
  Binary
} from 'lucide-react'

type SearchTab = 'all' | 'categories' | 'topics' | 'resources'

const POPULAR_TAGS = [
  'Power BI DAX',
  'n8n Webhooks',
  'Excel XLOOKUP',
  'GitHub Branching',
  'Smart Work AI',
  'Vedic Math',
  'Infographic',
  'PDF Reference'
]

export const SearchPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const queryParam = searchParams.get('q') || ''

  const { categories, topics, isLoading, error, retry } = usePublicCurriculum()

  // Form input state synchronized with query param
  const [prevQuery, setPrevQuery] = useState(queryParam)
  const [inputValue, setInputValue] = useState(queryParam)
  const [activeTab, setActiveTab] = useState<SearchTab>('all')

  // Synchronize state during render when URL queryParam changes (e.g. browser back/forward)
  if (prevQuery !== queryParam) {
    setPrevQuery(queryParam)
    setInputValue(queryParam)
  }

  // Selected resource for preview modal
  const [previewResource, setPreviewResource] = useState<TopicResource | null>(null)

  // Prototype notice modal
  const [modalState, setModalState] = useState<{
    isOpen: boolean
    title: string
    message: string
  }>({
    isOpen: false,
    title: '',
    message: '',
  })

  // Execute search using live context data
  const searchResults = executeGlobalSearch(queryParam, categories, topics)
  const { totalCount, matchingCategories, matchingTopics, matchingResources } = searchResults

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = inputValue.trim()
    if (trimmed) {
      setSearchParams({ q: trimmed })
    } else {
      setSearchParams({})
    }
  }

  const handleTagClick = (tag: string) => {
    setInputValue(tag)
    setSearchParams({ q: tag })
  }

  const handleClear = () => {
    setInputValue('')
    setSearchParams({})
  }

  const handleNotifyComingSoon = (featureName: string) => {
    setModalState({
      isOpen: true,
      title: featureName,
      message: `The "${featureName}" feature is part of our upcoming roadmap. Stay tuned as we build out the full catalog!`,
    })
  }

  const getCategoryIcon = (iconName?: string) => {
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
        return <Layers className="w-6 h-6 text-teal-700" />
    }
  }

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
        return <ExternalLink className="w-4 h-4 text-teal-600" />
      default:
        return <ExternalLink className="w-4 h-4 text-teal-600" />
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50/50 text-slate-900 flex flex-col justify-between font-sans">
        <Header onNotifyComingSoon={handleNotifyComingSoon} />
        <CurriculumLoadingState />
        <Footer onNotifyComingSoon={handleNotifyComingSoon} />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50/50 text-slate-900 flex flex-col justify-between font-sans">
        <Header onNotifyComingSoon={handleNotifyComingSoon} />
        <CurriculumErrorState error={error} onRetry={retry} />
        <Footer onNotifyComingSoon={handleNotifyComingSoon} />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50/50 text-slate-900 flex flex-col justify-between font-sans">
      <div>
        <Header onNotifyComingSoon={handleNotifyComingSoon} />

        {/* Breadcrumbs Navigation */}
        <div className="bg-white border-b border-slate-200">
          <Breadcrumbs
            items={[
              { label: 'Search Results' }
            ]}
          />
        </div>

        {/* Search Input Banner */}
        <section className="bg-white border-b border-slate-200 py-8 sm:py-10">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <form 
              onSubmit={handleSearchSubmit}
              className="relative flex items-center bg-white rounded-2xl shadow-sm border border-slate-300 focus-within:border-teal-600 focus-within:ring-2 focus-within:ring-teal-100 transition-all p-1.5"
            >
              <div className="pl-4 pr-2 text-slate-400">
                <Search className="w-5 h-5" />
              </div>

              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Search across all categories, topics, tutorials, videos, and PDFs..."
                className="w-full py-2.5 px-2 text-sm sm:text-base text-slate-900 placeholder-slate-400 bg-transparent focus:outline-hidden"
                autoFocus={!queryParam}
              />

              {inputValue && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="p-1.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 mr-1 transition-colors"
                  title="Clear search"
                >
                  <X className="w-4 h-4" />
                </button>
              )}

              <button
                type="submit"
                className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold rounded-xl transition-colors shrink-0 shadow-xs"
              >
                <span>Search</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {/* Quick Suggestion Chips */}
            <div className="flex flex-wrap items-center gap-1.5 mt-3 text-xs text-slate-500">
              <span className="font-medium text-slate-400 mr-1">Popular searches:</span>
              {POPULAR_TAGS.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => handleTagClick(tag)}
                  className="px-2.5 py-0.5 rounded-lg bg-slate-50 hover:bg-teal-50 border border-slate-200 hover:border-teal-300 text-slate-600 hover:text-teal-800 transition-colors font-medium text-[11px]"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Results Body */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
          
          {/* Query Summary & Counts */}
          {queryParam.trim() ? (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-8 border-b border-slate-200">
              <div>
                <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                  <span>Results for</span>
                  <span className="text-teal-700">"{queryParam}"</span>
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  Found <strong className="text-slate-800 font-bold">{totalCount}</strong> matching learning item{totalCount === 1 ? '' : 's'} 
                  {totalCount > 0 && ` (${matchingCategories.length} categories, ${matchingTopics.length} topics, ${matchingResources.length} resources)`}.
                </p>
              </div>

              {/* View / Filter Tabs */}
              {totalCount > 0 && (
                <div className="flex flex-wrap items-center gap-1 bg-white p-1 rounded-xl border border-slate-200 text-xs">
                  <button
                    type="button"
                    onClick={() => setActiveTab('all')}
                    className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                      activeTab === 'all' 
                        ? 'bg-slate-900 text-white' 
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    All ({totalCount})
                  </button>
                  {matchingCategories.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setActiveTab('categories')}
                      className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                        activeTab === 'categories' 
                          ? 'bg-slate-900 text-white' 
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                      }`}
                    >
                      Categories ({matchingCategories.length})
                    </button>
                  )}
                  {matchingTopics.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setActiveTab('topics')}
                      className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                        activeTab === 'topics' 
                          ? 'bg-slate-900 text-white' 
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                      }`}
                    >
                      Topics ({matchingTopics.length})
                    </button>
                  )}
                  {matchingResources.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setActiveTab('resources')}
                      className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                        activeTab === 'resources' 
                          ? 'bg-slate-900 text-white' 
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                      }`}
                    >
                      Resources ({matchingResources.length})
                    </button>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-16 max-w-xl mx-auto space-y-4">
              <div className="w-14 h-14 bg-teal-50 border border-teal-200 text-teal-700 rounded-2xl flex items-center justify-center mx-auto shadow-xs">
                <Search className="w-7 h-7" />
              </div>
              <h2 className="text-xl font-bold text-slate-900">What do you want to learn today?</h2>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                Enter a topic, keyword, or concept above (e.g. <strong>DAX</strong>, <strong>Power BI</strong>, <strong>Webhooks</strong>, or <strong>Vedic Math</strong>) to search across all public learning paths and resources.
              </p>
            </div>
          )}

          {/* Empty Results State */}
          {queryParam.trim() && totalCount === 0 && (
            <div className="bg-white border border-slate-200 rounded-2xl p-8 sm:p-12 text-center max-w-2xl mx-auto shadow-xs">
              <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400 mx-auto mb-4">
                <HelpCircle className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">
                No matching learning resources found
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mb-6 leading-relaxed">
                We couldn't find any categories, topics, or materials matching <strong>"{queryParam}"</strong>.
              </p>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-600 text-left space-y-2 mb-6">
                <span className="font-bold text-slate-800 block">Search Suggestions:</span>
                <ul className="list-disc list-inside space-y-1 text-slate-500">
                  <li>Check your spelling or try fewer search terms.</li>
                  <li>Search for general technology names like <strong className="text-slate-700">Power BI</strong>, <strong className="text-slate-700">n8n</strong>, or <strong className="text-slate-700">Excel</strong>.</li>
                  <li>Search by resource formats such as <strong className="text-slate-700">Infographic</strong> or <strong className="text-slate-700">PDF</strong>.</li>
                  <li>Or return to our categorized learning paths below.</li>
                </ul>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={handleClear}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-colors"
                >
                  Clear Search
                </button>
                <Link
                  to="/"
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold transition-colors"
                >
                  Return to Homepage
                </Link>
              </div>
            </div>
          )}

          {/* Results Lists */}
          {totalCount > 0 && (
            <div className="space-y-12">
              
              {/* 1. MATCHING CATEGORIES */}
              {(activeTab === 'all' || activeTab === 'categories') && matchingCategories.length > 0 && (
                <section className="space-y-4">
                  <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
                    <Layers className="w-4 h-4 text-teal-700" />
                    <h2 className="text-sm font-extrabold uppercase tracking-wider text-slate-900">
                      Disciplines & Categories ({matchingCategories.length})
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {matchingCategories.map((cat) => (
                      <Link
                        key={cat.id}
                        to={`/category/${cat.slug}`}
                        className="group p-5 bg-white border border-slate-200 hover:border-teal-400 rounded-2xl shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex items-center justify-between mb-3">
                            <div className="p-2.5 rounded-xl bg-teal-50 border border-teal-100 group-hover:bg-teal-100/80 transition-colors">
                              {getCategoryIcon(cat.iconName)}
                            </div>
                            <span className="text-[11px] font-semibold text-slate-500 bg-slate-50 px-2 py-0.5 rounded-full border border-slate-200">
                              {cat.resourceCount} Topics
                            </span>
                          </div>
                          <h3 className="font-bold text-slate-900 text-base group-hover:text-teal-800 transition-colors mb-1.5">
                            {cat.title}
                          </h3>
                          <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                            {cat.description}
                          </p>
                        </div>

                        <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-teal-700 group-hover:text-teal-900">
                          <span>Explore Category Topics</span>
                          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                        </div>
                      </Link>
                    ))}
                  </div>
                </section>
              )}

              {/* 2. MATCHING TOPICS */}
              {(activeTab === 'all' || activeTab === 'topics') && matchingTopics.length > 0 && (
                <section className="space-y-4">
                  <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
                    <BookOpen className="w-4 h-4 text-teal-700" />
                    <h2 className="text-sm font-extrabold uppercase tracking-wider text-slate-900">
                      Topics ({matchingTopics.length})
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {matchingTopics.map(({ topic, category }) => {
                      const catSlug = category?.slug || 'category'
                      return (
                        <Link
                          key={topic.id}
                          to={`/category/${catSlug}/topic/${topic.slug}`}
                          className="group p-5 bg-white border border-slate-200 hover:border-teal-400 rounded-2xl shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
                        >
                          <div>
                            <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
                              {category && (
                                <span className="text-[10px] font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded-md border border-teal-100 uppercase tracking-wider">
                                  {category.title}
                                </span>
                              )}
                              <span className="text-[10px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">
                                {topic.difficulty}
                              </span>
                            </div>

                            <h3 className="font-bold text-slate-900 text-base group-hover:text-teal-800 transition-colors mb-1.5">
                              {topic.title}
                            </h3>
                            <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                              {topic.shortDescription}
                            </p>
                          </div>

                          <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                            <span>{topic.resources.length} resources</span>
                            <span className="font-semibold text-teal-700 group-hover:text-teal-900 inline-flex items-center gap-1">
                              <span>Open Topic</span>
                              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                            </span>
                          </div>
                        </Link>
                      )
                    })}
                  </div>
                </section>
              )}

              {/* 3. MATCHING RESOURCES */}
              {(activeTab === 'all' || activeTab === 'resources') && matchingResources.length > 0 && (
                <section className="space-y-4">
                  <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
                    <Sparkles className="w-4 h-4 text-teal-700" />
                    <h2 className="text-sm font-extrabold uppercase tracking-wider text-slate-900">
                      Learning Resources & Materials ({matchingResources.length})
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {matchingResources.map(({ resource, topic, category }) => {
                      const catSlug = category?.slug || 'category'
                      return (
                        <div
                          key={resource.id}
                          className="p-5 bg-white border border-slate-200 hover:border-slate-300 rounded-2xl shadow-xs transition-all flex flex-col justify-between"
                        >
                          <div>
                            {/* Badges Bar */}
                            <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
                              <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-0.5 rounded-full border ${getTypeBadgeStyle(resource.type)}`}>
                                {getTypeIcon(resource.type)}
                                <span>{resource.type}</span>
                              </span>

                              <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                                {category && (
                                  <Link
                                    to={`/category/${catSlug}`}
                                    className="hover:text-teal-700 hover:underline"
                                  >
                                    {category.title}
                                  </Link>
                                )}
                                <span>•</span>
                                <Link
                                  to={`/category/${catSlug}/topic/${topic.slug}`}
                                  className="font-medium text-slate-600 hover:text-teal-700 hover:underline"
                                >
                                  {topic.title}
                                </Link>
                              </div>
                            </div>

                            {/* Title & Creator */}
                            <h3 className="font-bold text-slate-900 text-base leading-snug mb-1">
                              {resource.title}
                            </h3>

                            {resource.creatorName && (
                              <div className="text-[11px] font-semibold text-teal-700 flex items-center gap-1 mb-2">
                                <User className="w-3.5 h-3.5" />
                                <span>By {resource.creatorName}</span>
                              </div>
                            )}

                            {/* Description */}
                            <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-3">
                              {resource.description || 'Curated educational material designed to build hands-on skills.'}
                            </p>

                            {/* Keywords tags */}
                            {resource.keywords && resource.keywords.length > 0 && (
                              <div className="flex flex-wrap gap-1 mb-3">
                                {resource.keywords.map((kw, i) => (
                                  <button
                                    key={i}
                                    type="button"
                                    onClick={() => handleTagClick(kw)}
                                    className="text-[10px] bg-slate-100 hover:bg-slate-200 text-slate-600 px-1.5 py-0.2 rounded transition-colors inline-flex items-center gap-0.5"
                                  >
                                    <Tag className="w-2.5 h-2.5 text-slate-400" />
                                    <span>{kw}</span>
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>

                          {/* Footer action buttons */}
                          <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                            <span className="text-[11px] text-slate-400 font-medium">
                              {resource.durationOrPages || resource.difficulty || 'Interactive Resource'}
                            </span>

                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => setPreviewResource(resource)}
                                className="px-3 py-1.5 bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 rounded-lg text-xs font-bold transition-colors inline-flex items-center gap-1 shadow-2xs"
                              >
                                <span>Preview Material</span>
                                <ExternalLink className="w-3 h-3" />
                              </button>

                              <Link
                                to={`/category/${catSlug}/topic/${topic.slug}`}
                                className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold transition-colors"
                              >
                                Open Topic
                              </Link>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </section>
              )}

            </div>
          )}

        </main>
      </div>

      <Footer onNotifyComingSoon={handleNotifyComingSoon} />

      {/* Interactive Resource Demo Modal */}
      <ResourceDemoModal
        resource={previewResource}
        onClose={() => setPreviewResource(null)}
      />

      {/* Notice Prototype Modal */}
      <NoticeModal
        isOpen={modalState.isOpen}
        title={modalState.title}
        message={modalState.message}
        onClose={() => setModalState((prev) => ({ ...prev, isOpen: false }))}
      />
    </div>
  )
}
