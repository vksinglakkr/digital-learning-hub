import React, { useState, useMemo } from 'react'
import { useLearningHub } from '../../context/LearningHubContext'
import { searchAllResourceUsage } from '../../utils/resourceUsage'
import type { AdminResourceType } from '../../types'
import { 
  Search, 
  X, 
  Layers, 
  ExternalLink, 
  FileText, 
  Image as ImageIcon, 
  Video, 
  Globe, 
  ArrowRight, 
  Copy, 
  Check, 
  AlertCircle,
  Sparkles
} from 'lucide-react'

interface ResourceUsageModalProps {
  isOpen: boolean
  onClose: () => void
  initialQuery?: string
  onNavigateToTopic?: (categoryId: string, topicId: string) => void
}

export const ResourceUsageModal: React.FC<ResourceUsageModalProps> = ({
  isOpen,
  onClose,
  initialQuery = '',
  onNavigateToTopic,
}) => {
  const { categories, topics } = useLearningHub()
  const [searchQuery, setSearchQuery] = useState(initialQuery)
  const [copiedKey, setCopiedKey] = useState<string | null>(null)
  const [prevProps, setPrevProps] = useState({ isOpen, initialQuery })

  // Synchronize query state during render when modal is opened or initial query changes
  if (prevProps.isOpen !== isOpen || prevProps.initialQuery !== initialQuery) {
    setPrevProps({ isOpen, initialQuery })
    if (isOpen) {
      setSearchQuery(initialQuery)
      setCopiedKey(null)
    }
  }

  // Get grouped usage summaries
  const results = useMemo(() => {
    return searchAllResourceUsage(searchQuery, categories, topics)
  }, [searchQuery, categories, topics])

  // Calculate high-level curriculum usage stats
  const stats = useMemo(() => {
    const allSummaries = searchAllResourceUsage('', categories, topics)
    const totalUniqueFiles = allSummaries.length
    let totalPlacements = 0
    let reusedFilesCount = 0

    allSummaries.forEach((s) => {
      totalPlacements += s.totalPlacements
      if (s.totalPlacements > 1) {
        reusedFilesCount++
      }
    })

    return { totalUniqueFiles, totalPlacements, reusedFilesCount }
  }, [categories, topics])

  if (!isOpen) return null

  const handleCopyUrl = (url: string, key: string) => {
    navigator.clipboard.writeText(url)
    setCopiedKey(key)
    setTimeout(() => setCopiedKey(null), 2000)
  }

  const getTypeIcon = (type: AdminResourceType) => {
    switch (type) {
      case 'Infographic':
        return <ImageIcon className="w-3.5 h-3.5 text-emerald-600" />
      case 'PDF':
        return <FileText className="w-3.5 h-3.5 text-rose-600" />
      case 'YouTube Video':
      case 'Facebook Video':
      case 'Video':
        return <Video className="w-3.5 h-3.5 text-sky-600" />
      default:
        return <Globe className="w-3.5 h-3.5 text-slate-500" />
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden border border-slate-200"
        role="dialog"
        aria-modal="true"
        aria-labelledby="usage-checker-title"
      >
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50/80 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center shadow-2xs">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h2 id="usage-checker-title" className="text-base font-bold text-slate-900 flex items-center gap-2">
                <span>Check Resource Usage</span>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                  Read-Only Inspection
                </span>
              </h2>
              <p className="text-xs text-slate-500">
                Discover all categories and topics where a file, video, or URL is placed.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-xl transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Bar & Quick Metrics */}
        <div className="p-6 pb-4 border-b border-slate-100 bg-white shrink-0 space-y-4">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title, file name, GitHub repo path, or paste file URL..."
              className="w-full pl-10 pr-9 py-2.5 bg-slate-50 border border-slate-300 focus:border-indigo-600 focus:bg-white rounded-xl text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-hidden transition-all shadow-2xs"
              autoFocus
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 rounded-md"
                aria-label="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Metric Badges */}
          <div className="flex flex-wrap items-center justify-between text-xs text-slate-500 gap-2">
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 font-medium text-slate-700">
                <span className="font-bold text-slate-900">{stats.totalUniqueFiles}</span> unique files
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 font-medium text-slate-700">
                <span className="font-bold text-slate-900">{stats.totalPlacements}</span> total placements
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-purple-50 text-purple-700 border border-purple-200 font-medium">
                <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                <span className="font-bold text-purple-900">{stats.reusedFilesCount}</span> reused across multiple topics
              </span>
            </div>

            {searchQuery && (
              <span className="text-xs font-semibold text-indigo-700">
                Showing {results.length} matching resource{results.length === 1 ? '' : 's'}
              </span>
            )}
          </div>
        </div>

        {/* Content Body: Scrollable Results */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {results.length === 0 ? (
            <div className="py-16 text-center space-y-3 bg-slate-50 rounded-xl border border-dashed border-slate-200">
              <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                <AlertCircle className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-bold text-slate-700">No resources found</p>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  {searchQuery 
                    ? `No existing curriculum resources match "${searchQuery}". This file or URL is not currently placed in any topic.`
                    : 'No resources currently exist in the curriculum.'}
                </p>
              </div>
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg text-xs font-semibold text-slate-700"
                >
                  Clear filter
                </button>
              )}
            </div>
          ) : (
            results.map((summary) => {
              const isMultiTopic = summary.totalPlacements > 1

              return (
                <div 
                  key={summary.canonicalKey}
                  className="bg-white rounded-xl border border-slate-200 hover:border-slate-300 shadow-2xs overflow-hidden transition-all"
                >
                  {/* Resource Card Header */}
                  <div className="p-4 bg-slate-50/60 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-start sm:items-center gap-2.5">
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-white text-slate-700 border border-slate-200 shadow-2xs">
                        {getTypeIcon(summary.resourceType)}
                        <span>{summary.resourceType}</span>
                      </span>
                      <h3 className="text-sm font-bold text-slate-900">
                        {summary.primaryTitle}
                      </h3>
                      {isMultiTopic ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 border border-purple-200 shrink-0">
                          <Layers className="w-3 h-3 text-purple-600" />
                          <span>Placed in {summary.totalPlacements} topics</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 shrink-0">
                          Single topic
                        </span>
                      )}
                    </div>

                    {/* URL actions */}
                    <div className="flex items-center gap-2 text-xs">
                      <button
                        type="button"
                        onClick={() => handleCopyUrl(summary.displayUrl, summary.canonicalKey)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg font-medium transition-colors"
                        title="Copy direct file URL"
                      >
                        {copiedKey === summary.canonicalKey ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                            <span className="text-emerald-700">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5 text-slate-500" />
                            <span>Copy URL</span>
                          </>
                        )}
                      </button>

                      <a
                        href={summary.displayUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 px-2.5 py-1 text-slate-600 hover:text-indigo-600 bg-white hover:bg-indigo-50 border border-slate-200 rounded-lg font-medium transition-colors"
                        title="Open file in new tab"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Open</span>
                      </a>
                    </div>
                  </div>

                  {/* Canonical key subtitle */}
                  <div className="px-4 py-1.5 bg-slate-50/30 border-b border-slate-100 text-[11px] font-mono text-slate-400 truncate">
                    Canonical Key: {summary.canonicalKey}
                  </div>

                  {/* Placements List */}
                  <div className="p-4 space-y-2">
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      Current Placements ({summary.placements.length})
                    </p>

                    <div className="divide-y divide-slate-100 border border-slate-100 rounded-lg overflow-hidden">
                      {summary.placements.map((placement, pIdx) => (
                        <div 
                          key={`${placement.topicId}-${placement.resourceId}-${pIdx}`}
                          className="p-3 bg-white hover:bg-slate-50/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors text-xs"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                            {/* Category & Topic Path */}
                            <div className="flex items-center gap-1.5 font-semibold text-slate-800">
                              <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[11px]">
                                {placement.categoryTitle}
                              </span>
                              <span className="text-slate-400">→</span>
                              <span className="px-2 py-0.5 rounded bg-teal-50 text-teal-800 border border-teal-200 text-[11px]">
                                {placement.topicTitle}
                              </span>
                            </div>

                            {/* Resource title in this placement */}
                            <div className="flex items-center gap-2 text-slate-600">
                              <span className="font-bold text-slate-900">
                                &ldquo;{placement.resourceTitle}&rdquo;
                              </span>
                              <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded-md ${
                                placement.status === 'Published' 
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                                  : placement.status === 'Draft' 
                                  ? 'bg-amber-50 text-amber-700 border border-amber-200' 
                                  : 'bg-slate-200 text-slate-600'
                              }`}>
                                {placement.status}
                              </span>
                            </div>
                          </div>

                          {/* Quick Navigate Button */}
                          {onNavigateToTopic && (
                            <button
                              type="button"
                              onClick={() => {
                                onNavigateToTopic(placement.categoryId, placement.topicId)
                                onClose()
                              }}
                              className="inline-flex items-center gap-1 px-3 py-1 bg-slate-100 hover:bg-teal-600 hover:text-white text-slate-700 rounded-lg font-medium text-[11px] transition-colors self-start sm:self-auto shrink-0"
                            >
                              <span>Manage in Topic</span>
                              <ArrowRight className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )
            })
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 border-t border-slate-200 bg-slate-50 flex items-center justify-between shrink-0 text-xs text-slate-500">
          <p>
            Files can be placed in multiple topics with independent titles, ordering, and notes.
          </p>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-xl transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  )
}
