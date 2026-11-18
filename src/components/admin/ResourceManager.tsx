import React, { useState } from 'react'
import { useLearningHub } from '../../context/LearningHubContext'
import { DeleteConfirmModal } from './DeleteConfirmModal'
import type { AdminResourceType, ResourceStatus, TopicResource } from '../../types'
import { 
  Plus, 
  Edit3, 
  Trash2, 
  GripVertical, 
  ChevronsUp, 
  ChevronUp, 
  ChevronDown, 
  ChevronsDown,
  PlayCircle,
  Video as VideoIcon,
  Image as ImageIcon,
  FileText,
  BookOpen,
  Globe,
  Layers,
  X,
  Sparkles,
  Scissors,
  AlertTriangle,
  Loader2
} from 'lucide-react'
import { parseTimeToSeconds, validateClipTimeRange, formatClipDuration, formatSecondsToTime } from '../../utils/timeFormat'
import { buildYouTubeEmbedUrl, extractYouTubeVideoId } from '../../utils/youtubeEmbed'
import { fetchYouTubeOembedMetadata } from '../../services/youtubeOembedService'
import { parseGitHubResourceUrl } from '../../utils/githubUrl'
import { ResourceUsageModal } from './ResourceUsageModal'
import { getCanonicalResourceKey } from '../../utils/resourceUsage'
import { ResourceSaveToast } from './ResourceSaveToast'

export const ResourceManager: React.FC = () => {
  const { 
    categories, 
    topics, 
    addResource, 
    updateResource, 
    deleteResource, 
    reorderResource, 
    moveResource 
  } = useLearningHub()

  // Selectors
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>(
    categories[0]?.id || ''
  )

  const categoryTopics = topics.filter((t) => t.categoryId === selectedCategoryId)
  
  const [selectedTopicId, setSelectedTopicId] = useState<string>(
    categoryTopics[0]?.id || ''
  )

  const [typeFilter, setTypeFilter] = useState<string>('All')
  const [statusFilter, setStatusFilter] = useState<string>('All')

  // Edit / Add Modal State
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingResource, setEditingResource] = useState<TopicResource | null>(null)

  // Form State
  const [formType, setFormType] = useState<AdminResourceType>('YouTube Video')
  const [formTitle, setFormTitle] = useState('')
  const [formUrl, setFormUrl] = useState('')
  const [formDescription, setFormDescription] = useState('')
  const [formDuration, setFormDuration] = useState('')
  const [formDifficulty, setFormDifficulty] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Beginner')
  const [formStatus, setFormStatus] = useState<ResourceStatus>('Published')
  const [formCreatorName, setFormCreatorName] = useState('')
  const [formCreatorUrl, setFormCreatorUrl] = useState('')
  const [formThumbnailUrl, setFormThumbnailUrl] = useState('')
  const [formStartTime, setFormStartTime] = useState('')
  const [formEndTime, setFormEndTime] = useState('')
  const [timeRangeError, setTimeRangeError] = useState<string | null>(null)
  const [isTestingClip, setIsTestingClip] = useState(false)
  const [isFetchingOembed, setIsFetchingOembed] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [saveToast, setSaveToast] = useState<{
    type: 'save' | 'update'
    resourceTitle?: string
  } | null>(null)

  // Delete State
  const [deleteTarget, setDeleteTarget] = useState<TopicResource | null>(null)

  // Step 19C: Check Resource Usage modal states
  const [isUsageModalOpen, setIsUsageModalOpen] = useState(false)
  const [usageModalInitialQuery, setUsageModalInitialQuery] = useState('')

  // Precalculate placement counts across all topics
  const resourceUsageCountMap = React.useMemo(() => {
    const map = new Map<string, number>()
    for (const t of topics) {
      for (const r of t.resources) {
        const key = getCanonicalResourceKey(r.url, r.directContentUrl, r.originalSourceUrl)
        if (key) {
          map.set(key, (map.get(key) || 0) + 1)
        }
      }
    }
    return map
  }, [topics])

  // Current topic object
  const currentTopic = topics.find((t) => t.id === selectedTopicId)

  // Resources for current topic
  const topicResources = currentTopic
    ? [...currentTopic.resources]
        .sort((a, b) => a.displayOrder - b.displayOrder)
        .filter((r) => (typeFilter === 'All' ? true : r.type === typeFilter))
        .filter((r) => (statusFilter === 'All' ? true : r.status === statusFilter))
    : []

  const handleCategoryChange = (catId: string) => {
    setSelectedCategoryId(catId)
    const matching = topics.filter((t) => t.categoryId === catId)
    setSelectedTopicId(matching[0]?.id || '')
  }

  const openAddModal = () => {
    setEditingResource(null)
    setFormType('YouTube Video')
    setFormTitle('')
    setFormUrl('')
    setFormDescription('')
    setFormDuration('15 min')
    setFormDifficulty('Beginner')
    setFormStatus('Published')
    setFormCreatorName('')
    setFormCreatorUrl('')
    setFormThumbnailUrl('')
    setFormStartTime('')
    setFormEndTime('')
    setTimeRangeError(null)
    setIsTestingClip(false)
    setIsFetchingOembed(false)
    setFormError(null)
    setIsModalOpen(true)
  }

  const openEditModal = (r: TopicResource) => {
    setEditingResource(r)
    setFormType(r.type)
    setFormTitle(r.title)
    setFormUrl(r.url)
    setFormDescription(r.description || '')
    setFormDuration(r.durationOrPages || '')
    setFormDifficulty(r.difficulty || 'Beginner')
    setFormStatus(r.status || 'Published')
    setFormCreatorName(r.creatorName || '')
    setFormCreatorUrl(r.creatorUrl || '')
    setFormThumbnailUrl(r.thumbnailUrl || '')
    const startStr = r.startTime || (r.startSeconds != null ? formatSecondsToTime(r.startSeconds) : '')
    const endStr = r.endTime || (r.endSeconds != null ? formatSecondsToTime(r.endSeconds) : '')
    setFormStartTime(startStr)
    setFormEndTime(endStr)
    setTimeRangeError(null)
    setIsTestingClip(false)
    setIsFetchingOembed(false)
    setFormError(null)
    setIsModalOpen(true)
  }

  const handleFetchOembedInModal = async () => {
    if (!formUrl.trim()) {
      setFormError('Please enter a YouTube video URL first.')
      return
    }
    const videoId = extractYouTubeVideoId(formUrl.trim())
    if (!videoId) {
      setFormError('Please enter a valid YouTube video URL.')
      return
    }

    setIsFetchingOembed(true)
    setFormError(null)

    const res = await fetchYouTubeOembedMetadata(formUrl.trim())
    setIsFetchingOembed(false)

    if (!res.success || !res.data) {
      setFormError(res.error || 'Failed to fetch YouTube metadata.')
      return
    }

    setFormTitle(res.data.title)
    setFormCreatorName(res.data.authorName)
    setFormCreatorUrl(res.data.authorUrl)
    setFormThumbnailUrl(res.data.thumbnailUrl)
  }

  const handleStartTimeChange = (val: string) => {
    setFormStartTime(val)
    const res = validateClipTimeRange(val, formEndTime)
    setTimeRangeError(res.isValid ? null : (res.error || null))
    setFormError(null)
  }

  const handleEndTimeChange = (val: string) => {
    setFormEndTime(val)
    const res = validateClipTimeRange(formStartTime, val)
    setTimeRangeError(res.isValid ? null : (res.error || null))
    setFormError(null)
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    if (isSaving) return

    if (!formTitle.trim()) {
      setFormError('Please enter a Resource Title.')
      return
    }
    if (!formUrl.trim()) {
      setFormError('Please enter a Resource URL.')
      return
    }
    if (!selectedTopicId) {
      setFormError('Please select a target topic.')
      return
    }

    let startSec: number | undefined
    let endSec: number | undefined

    if (formType === 'YouTube Video' && (formStartTime.trim() || formEndTime.trim())) {
      const timeVal = validateClipTimeRange(formStartTime, formEndTime)
      if (!timeVal.isValid) {
        setFormError(timeVal.error || 'Invalid start or end time format.')
        return
      }
      if (timeVal.startSeconds !== null) startSec = timeVal.startSeconds
      if (timeVal.endSeconds !== null) endSec = timeVal.endSeconds
    }

    let directContentUrl = editingResource?.directContentUrl
    let originalSourceUrl = editingResource?.originalSourceUrl

    if (formUrl.includes('github.com') || formUrl.includes('raw.githubusercontent.com') || formUrl.includes('.github.io')) {
      const gh = parseGitHubResourceUrl(formUrl)
      if (gh.isValidFormat) {
        directContentUrl = gh.directContentUrl
        originalSourceUrl = gh.originalSourceUrl
      }
    }

    setIsSaving(true)
    try {
      const savedTitle = formTitle.trim()
      if (editingResource) {
        updateResource(selectedTopicId, editingResource.id, {
          title: savedTitle,
          url: formUrl.trim(),
          directContentUrl,
          originalSourceUrl,
          description: formDescription.trim() || undefined,
          type: formType,
          durationOrPages: formDuration.trim() || undefined,
          difficulty: formDifficulty,
          status: formStatus,
          creatorName: formCreatorName.trim() || undefined,
          creatorUrl: formCreatorUrl.trim() || undefined,
          thumbnailUrl: formThumbnailUrl.trim() || undefined,
          startTime: formStartTime.trim() || undefined,
          endTime: formEndTime.trim() || undefined,
          startSeconds: startSec,
          endSeconds: endSec,
        })
        setIsModalOpen(false)
        setSaveToast({
          type: 'update',
          resourceTitle: savedTitle,
        })
      } else {
        const newId = addResource(selectedTopicId, {
          title: savedTitle,
          url: formUrl.trim(),
          directContentUrl,
          originalSourceUrl,
          description: formDescription.trim() || undefined,
          type: formType,
          durationOrPages: formDuration.trim() || undefined,
          difficulty: formDifficulty,
          status: formStatus,
          creatorName: formCreatorName.trim() || undefined,
          creatorUrl: formCreatorUrl.trim() || undefined,
          thumbnailUrl: formThumbnailUrl.trim() || undefined,
          startTime: formStartTime.trim() || undefined,
          endTime: formEndTime.trim() || undefined,
          startSeconds: startSec,
          endSeconds: endSec,
          isDemo: true,
        })
        if (!newId) {
          throw new Error('Failed to create resource. Please ensure a valid topic is selected.')
        }
        setIsModalOpen(false)
        setSaveToast({
          type: 'save',
          resourceTitle: savedTitle,
        })
      }
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Failed to save resource. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  const handleDeleteConfirm = () => {
    if (deleteTarget && selectedTopicId) {
      deleteResource(selectedTopicId, deleteTarget.id)
      setDeleteTarget(null)
    }
  }

  const getTypeIcon = (type: AdminResourceType) => {
    switch (type) {
      case 'YouTube Video':
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
    }
  }

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs">
      {/* Section Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 mb-6 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Layers className="w-5 h-5 text-teal-700" />
            <span>Manage Resources ({topicResources.length})</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Reorder, edit, and organize multiple videos, infographics, PDFs, and tutorials under any topic.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2 self-start lg:self-auto">
          <button
            type="button"
            onClick={() => {
              setUsageModalInitialQuery('')
              setIsUsageModalOpen(true)
            }}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 text-xs font-bold rounded-xl transition-colors shrink-0 shadow-2xs cursor-pointer"
            title="Search and inspect where resources are used across all categories and topics"
          >
            <Layers className="w-4 h-4 text-indigo-600" />
            <span>Check Resource Usage</span>
          </button>

          {selectedTopicId && (
            <button
              onClick={openAddModal}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-colors shrink-0 shadow-xs cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Resource</span>
            </button>
          )}
        </div>
      </div>

      {/* Selectors Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200 mb-6 text-xs">
        <div>
          <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
            Category
          </label>
          <select
            value={selectedCategoryId}
            onChange={(e) => handleCategoryChange(e.target.value)}
            className="w-full bg-white border border-slate-300 rounded-lg p-2 font-medium text-slate-800 focus:outline-hidden focus:border-teal-600"
          >
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.title}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
            Topic
          </label>
          <select
            value={selectedTopicId}
            onChange={(e) => setSelectedTopicId(e.target.value)}
            className="w-full bg-white border border-slate-300 rounded-lg p-2 font-medium text-slate-800 focus:outline-hidden focus:border-teal-600"
          >
            {categoryTopics.length === 0 ? (
              <option value="">No topics in category</option>
            ) : (
              categoryTopics.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.title}
                </option>
              ))
            )}
          </select>
        </div>

        <div>
          <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
            Format Filter
          </label>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="w-full bg-white border border-slate-300 rounded-lg p-2 font-medium text-slate-800 focus:outline-hidden focus:border-teal-600"
          >
            <option value="All">All Resource Types</option>
            <option value="YouTube Video">YouTube Video</option>
            <option value="Facebook Video">Facebook Video</option>
            <option value="Infographic">Infographic</option>
            <option value="PDF">PDF Reference</option>
            <option value="Tutorial">Tutorial</option>
            <option value="External Link">External Link</option>
          </select>
        </div>

        <div>
          <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
            Status Filter
          </label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full bg-white border border-slate-300 rounded-lg p-2 font-medium text-slate-800 focus:outline-hidden focus:border-teal-600"
          >
            <option value="All">All Statuses</option>
            <option value="Published">Published</option>
            <option value="Draft">Draft</option>
            <option value="Hidden">Hidden</option>
          </select>
        </div>
      </div>

      {/* Resource List */}
      {!currentTopic ? (
        <div className="p-12 text-center text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
          <p className="text-xs font-medium">Please select a category and topic to manage resources.</p>
        </div>
      ) : topicResources.length === 0 ? (
        <div className="p-12 text-center text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200 space-y-3">
          <p className="text-xs font-medium">No resources found matching the active filter.</p>
          <button
            onClick={openAddModal}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-800"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add First Resource</span>
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {topicResources.map((res, index) => (
            <div
              key={res.id}
              draggable
              onDragStart={(e) => e.dataTransfer.setData('text/plain', index.toString())}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault()
                const fromIdx = parseInt(e.dataTransfer.getData('text/plain'), 10)
                if (!isNaN(fromIdx)) moveResource(selectedTopicId, fromIdx, index)
              }}
              className="group flex flex-col md:flex-row md:items-center justify-between p-4 bg-slate-50/70 hover:bg-white border border-slate-200 hover:border-teal-300 rounded-xl transition-all gap-4"
            >
              {/* Left Info & Drag Handle */}
              <div className="flex items-start md:items-center gap-3">
                <div 
                  className="cursor-grab active:cursor-grabbing p-1.5 text-slate-400 hover:text-slate-600 rounded-md hover:bg-slate-100 transition-colors"
                  title="Drag to reorder"
                >
                  <GripVertical className="w-4 h-4" />
                </div>

                <span className="w-6 h-6 rounded-md bg-slate-200/80 text-slate-700 font-mono font-bold text-xs flex items-center justify-center shrink-0">
                  {res.displayOrder || index + 1}
                </span>

                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                      {getTypeIcon(res.type)}
                      <span>{res.type}</span>
                    </span>
                    <h3 className="font-bold text-slate-900 text-sm">{res.title}</h3>
                    <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded-md ${
                      res.status === 'Published' 
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                        : res.status === 'Draft' 
                        ? 'bg-amber-50 text-amber-700 border border-amber-200' 
                        : 'bg-slate-200 text-slate-600'
                    }`}>
                      {res.status}
                    </span>
                    {(() => {
                      const resKey = getCanonicalResourceKey(res.url, res.directContentUrl, res.originalSourceUrl)
                      const count = resKey ? (resourceUsageCountMap.get(resKey) || 1) : 1
                      if (count > 1) {
                        return (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation()
                              setUsageModalInitialQuery(res.title)
                              setIsUsageModalOpen(true)
                            }}
                            className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 transition-colors cursor-pointer"
                            title={`This file is placed in ${count} topics. Click to view all placements.`}
                          >
                            <Layers className="w-3 h-3 text-purple-600" />
                            <span>Used in {count} topics</span>
                          </button>
                        )
                      }
                      return null
                    })()}
                    {((res.startSeconds != null && res.startSeconds > 0) || (res.endSeconds != null && res.endSeconds > 0)) && (
                      <span className="inline-flex items-center gap-1 font-mono text-[10px] font-semibold text-rose-800 bg-rose-50 px-1.5 py-0.5 rounded border border-rose-200">
                        <Scissors className="w-3 h-3 text-rose-600 shrink-0" />
                        <span>{res.startTime || formatSecondsToTime(res.startSeconds)} – {res.endTime || (res.endSeconds ? formatSecondsToTime(res.endSeconds) : 'End')}</span>
                        {formatClipDuration(res.startSeconds, res.endSeconds) && (
                          <span className="font-sans font-normal text-rose-600">({formatClipDuration(res.startSeconds, res.endSeconds)})</span>
                        )}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                    {res.creatorName && (
                      <span className="font-semibold text-teal-800 bg-teal-50 px-1.5 py-0.2 rounded border border-teal-100 font-sans text-[11px]">
                        By {res.creatorName}
                      </span>
                    )}
                    <span className="truncate max-w-sm font-mono">{res.url}</span>
                    {res.durationOrPages && (
                      <span className="font-sans font-medium text-slate-400 text-[11px]">
                        • {res.durationOrPages}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Actions */}
              <div className="flex items-center justify-between md:justify-end gap-2 pt-2 md:pt-0 border-t md:border-t-0 border-slate-200">
                {/* Directional Reorder buttons */}
                <div className="flex items-center bg-white border border-slate-200 rounded-lg p-0.5 shadow-2xs">
                  <button
                    type="button"
                    onClick={() => reorderResource(selectedTopicId, res.id, 'top')}
                    disabled={index === 0}
                    className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded disabled:opacity-30 disabled:pointer-events-none transition-colors"
                    title="Move to Top"
                    aria-label="Move to Top"
                  >
                    <ChevronsUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => reorderResource(selectedTopicId, res.id, 'up')}
                    disabled={index === 0}
                    className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded disabled:opacity-30 disabled:pointer-events-none transition-colors"
                    title="Move Up"
                    aria-label="Move Up"
                  >
                    <ChevronUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => reorderResource(selectedTopicId, res.id, 'down')}
                    disabled={index === topicResources.length - 1}
                    className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded disabled:opacity-30 disabled:pointer-events-none transition-colors"
                    title="Move Down"
                    aria-label="Move Down"
                  >
                    <ChevronDown className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => reorderResource(selectedTopicId, res.id, 'bottom')}
                    disabled={index === topicResources.length - 1}
                    className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded disabled:opacity-30 disabled:pointer-events-none transition-colors"
                    title="Move to Bottom"
                    aria-label="Move to Bottom"
                  >
                    <ChevronsDown className="w-3.5 h-3.5" />
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => openEditModal(res)}
                  className="p-1.5 text-slate-600 hover:text-teal-700 bg-white hover:bg-teal-50 border border-slate-200 rounded-lg transition-colors"
                  title="Edit Resource"
                >
                  <Edit3 className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => setDeleteTarget(res)}
                  className="p-1.5 text-slate-600 hover:text-rose-600 bg-white hover:bg-rose-50 border border-slate-200 rounded-lg transition-colors"
                  title="Delete Resource"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Resource Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div 
            className="w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto"
            role="dialog"
            aria-modal="true"
          >
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-lg">
                {editingResource ? 'Edit Resource' : 'Add New Resource'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              {/* Type selector */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Format Type <span className="text-rose-500">*</span>
                </label>
                <select
                  value={formType}
                  onChange={(e) => setFormType(e.target.value as AdminResourceType)}
                  className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-900 font-semibold focus:outline-hidden focus:border-teal-600"
                >
                  <option value="YouTube Video">YouTube Video</option>
                  <option value="Facebook Video">Facebook Video</option>
                  <option value="Infographic">Infographic</option>
                  <option value="PDF">PDF Reference</option>
                  <option value="Tutorial">Tutorial</option>
                  <option value="External Link">External Link</option>
                </select>
              </div>

              {/* Title */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="e.g. Master Power BI Drill Through in 15 Minutes"
                  className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-900 focus:outline-hidden focus:border-teal-600"
                />
              </div>

              {/* URL */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Resource URL <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formUrl}
                  onChange={(e) => setFormUrl(e.target.value)}
                  placeholder="https://... or demo://..."
                  className="w-full text-xs font-mono bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-900 focus:outline-hidden focus:border-teal-600"
                />
                {formType === 'YouTube Video' && (
                  <div className="pt-1.5 flex items-center justify-between">
                    <button
                      type="button"
                      disabled={isFetchingOembed}
                      onClick={handleFetchOembedInModal}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-teal-50 hover:bg-teal-100 disabled:opacity-50 text-teal-800 border border-teal-200 rounded-lg text-xs font-bold transition-colors"
                    >
                      {isFetchingOembed ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span>Fetching Metadata...</span>
                        </>
                      ) : (
                        <>
                          <PlayCircle className="w-3.5 h-3.5 text-teal-700" />
                          <span>Fetch Video Details</span>
                        </>
                      )}
                    </button>
                    <span className="text-[10px] text-slate-500 font-medium">
                      Local Development oEmbed Fetch
                    </span>
                  </div>
                )}
              </div>

              {/* Creator Attribution */}
              {(formType === 'YouTube Video' || formType === 'Facebook Video') && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-teal-50/50 rounded-xl border border-teal-100">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Creator / Channel Name
                    </label>
                    <input
                      type="text"
                      value={formCreatorName}
                      onChange={(e) => setFormCreatorName(e.target.value)}
                      placeholder="e.g. Guy in a Cube"
                      className="w-full text-xs bg-white border border-slate-300 rounded-lg p-2 text-slate-900 focus:outline-hidden focus:border-teal-600"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Channel / Profile URL
                    </label>
                    <input
                      type="text"
                      value={formCreatorUrl}
                      onChange={(e) => setFormCreatorUrl(e.target.value)}
                      placeholder="https://youtube.com/@channel"
                      className="w-full text-xs font-mono bg-white border border-slate-300 rounded-lg p-2 text-slate-900 focus:outline-hidden focus:border-teal-600"
                    />
                  </div>
                </div>
              )}

              {/* YouTube Clip Range Controls */}
              {formType === 'YouTube Video' && (
                <div className="p-3.5 bg-rose-50/50 rounded-xl border border-rose-200/80 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-rose-900 uppercase tracking-wider">
                      <Scissors className="w-4 h-4 text-rose-600" />
                      <span>Optional Video Clip / Timestamp Range</span>
                    </div>
                    <span className="text-[10px] font-semibold text-rose-700 bg-white px-2 py-0.5 rounded border border-rose-200">
                      YouTube Only
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    Leave blank to play full video. Enter <strong>MM:SS</strong> (e.g. <code>01:30</code>) or <strong>HH:MM:SS</strong> to spotlight a specific segment.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Start Time <span className="text-slate-400 font-normal lowercase">(optional)</span>
                      </label>
                      <input
                        type="text"
                        value={formStartTime}
                        onChange={(e) => handleStartTimeChange(e.target.value)}
                        placeholder="e.g. 01:15 or 00:01:15"
                        className="w-full text-xs font-mono bg-white border border-slate-300 rounded-lg p-2 text-slate-900 focus:outline-hidden focus:border-rose-600"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                        End Time <span className="text-slate-400 font-normal lowercase">(optional)</span>
                      </label>
                      <input
                        type="text"
                        value={formEndTime}
                        onChange={(e) => handleEndTimeChange(e.target.value)}
                        placeholder="e.g. 05:40 or 00:05:40"
                        className="w-full text-xs font-mono bg-white border border-slate-300 rounded-lg p-2 text-slate-900 focus:outline-hidden focus:border-rose-600"
                      />
                    </div>
                  </div>

                  {/* Time Error or Duration Feedback */}
                  {timeRangeError ? (
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-rose-700">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>{timeRangeError}</span>
                    </div>
                  ) : (formStartTime.trim() || formEndTime.trim()) ? (
                    <div className="flex items-center justify-between text-xs text-rose-800 bg-rose-100/60 p-2 rounded-lg">
                      <span className="font-medium">
                        {formatClipDuration(parseTimeToSeconds(formStartTime), parseTimeToSeconds(formEndTime)) ? (
                          <>Selected Clip Duration: <strong>{formatClipDuration(parseTimeToSeconds(formStartTime), parseTimeToSeconds(formEndTime))}</strong></>
                        ) : (
                          <>Plays from <strong>{formStartTime || '00:00'}</strong> to video end</>
                        )}
                      </span>
                      <span className="text-[10px] text-rose-700 font-mono">
                        [{parseTimeToSeconds(formStartTime) ?? 0}s &rarr; {parseTimeToSeconds(formEndTime) ? `${parseTimeToSeconds(formEndTime)}s` : 'end'}]
                      </span>
                    </div>
                  ) : null}

                  {/* Test Selected Portion Button */}
                  <div className="pt-1 flex flex-wrap items-center gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        if (!formUrl.trim() || !extractYouTubeVideoId(formUrl)) {
                          setFormError('Please enter a valid YouTube video URL above before testing the clip.')
                          return
                        }
                        if (timeRangeError) {
                          setFormError('Please correct the start/end time error before testing.')
                          return
                        }
                        setIsTestingClip(!isTestingClip)
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-rose-50 text-rose-800 border border-rose-300 rounded-lg text-xs font-bold transition-colors shadow-2xs"
                    >
                      <PlayCircle className="w-3.5 h-3.5 text-rose-600" />
                      <span>{isTestingClip ? 'Hide Clip Player' : 'Test Selected Portion'}</span>
                    </button>
                    <span className="text-[10px] text-slate-500">
                      Uses official YouTube <code>?start=...&amp;end=...</code> embed parameters
                    </span>
                  </div>

                  {/* Embed Test Player */}
                  {isTestingClip && formUrl.trim() && extractYouTubeVideoId(formUrl) && (
                    <div className="mt-3 rounded-xl overflow-hidden border border-rose-300 bg-black">
                      <div className="aspect-video w-full">
                        <iframe
                          src={buildYouTubeEmbedUrl(
                            formUrl,
                            parseTimeToSeconds(formStartTime) ?? undefined,
                            parseTimeToSeconds(formEndTime) ?? undefined,
                            true
                          ) || ''}
                          title="Test YouTube Clip"
                          className="w-full h-full border-0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      </div>
                      <div className="p-2 bg-slate-900 text-slate-300 text-[11px] flex items-center justify-between">
                        <span>Testing segment playback ({formStartTime || '00:00'} to {formEndTime || 'End'})</span>
                        <button
                          type="button"
                          onClick={() => setIsTestingClip(false)}
                          className="text-slate-400 hover:text-white"
                        >
                          Close Player
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Brief synopsis of topics covered..."
                  className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-900 focus:outline-hidden focus:border-teal-600"
                />
              </div>

              {/* Format / Duration, Difficulty & Status */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Duration / Length
                  </label>
                  <input
                    type="text"
                    value={formDuration}
                    onChange={(e) => setFormDuration(e.target.value)}
                    placeholder="e.g. 12 min"
                    className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg p-2 text-slate-900 focus:outline-hidden focus:border-teal-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Difficulty
                  </label>
                  <select
                    value={formDifficulty}
                    onChange={(e) => setFormDifficulty(e.target.value as any)}
                    className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg p-2 text-slate-900 focus:outline-hidden focus:border-teal-600"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Status
                  </label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value as ResourceStatus)}
                    className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg p-2 text-slate-900 font-semibold focus:outline-hidden focus:border-teal-600"
                  >
                    <option value="Published">Published</option>
                    <option value="Draft">Draft</option>
                    <option value="Hidden">Hidden</option>
                  </select>
                </div>
              </div>

              {/* Form Error Banner */}
              {formError && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-lg text-xs flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              {/* Mini Preview inside Modal */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-teal-600" />
                  <span>Card Appearance Preview</span>
                </span>
                <div className="text-xs font-bold text-slate-800">
                  {formTitle.trim() || 'Resource Title Preview'}
                </div>
                {formType === 'YouTube Video' && (formStartTime.trim() || formEndTime.trim()) && !timeRangeError && (
                  <div className="inline-flex items-center gap-1 font-mono text-[10px] font-semibold text-rose-800 bg-rose-50 px-1.5 py-0.5 rounded border border-rose-200 mt-1">
                    <Scissors className="w-3 h-3 text-rose-600 shrink-0" />
                    <span>
                      Clip: {formStartTime || '00:00'} – {formEndTime || 'End'}
                      {formatClipDuration(parseTimeToSeconds(formStartTime), parseTimeToSeconds(formEndTime)) && (
                        ` (${formatClipDuration(parseTimeToSeconds(formStartTime), parseTimeToSeconds(formEndTime))})`
                      )}
                    </span>
                  </div>
                )}
                <div className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                  {formDescription.trim() || 'No description provided.'}
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <span>{editingResource ? 'Update Resource' : 'Save Resource'}</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={Boolean(deleteTarget)}
        title={deleteTarget?.title || ''}
        itemDescription="This resource will be permanently removed from this topic."
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
      />

      {/* Step 19C: Check Resource Usage Modal */}
      <ResourceUsageModal
        isOpen={isUsageModalOpen}
        onClose={() => setIsUsageModalOpen(false)}
        initialQuery={usageModalInitialQuery}
        onNavigateToTopic={(catId, topId) => {
          setSelectedCategoryId(catId)
          setSelectedTopicId(topId)
        }}
      />
      {/* Success Toast */}
      {saveToast && (
        <ResourceSaveToast
          type={saveToast.type}
          resourceTitle={saveToast.resourceTitle}
          onClose={() => setSaveToast(null)}
        />
      )}
    </div>
  )
}
