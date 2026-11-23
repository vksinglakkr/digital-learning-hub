import React, { useState, useRef } from 'react'
import { useLearningHub } from '../../context/LearningHubContext'
import type { 
  TopicResource, 
  AdminResourceType, 
  ResourceStatus, 
  TopicPresentationStyle 
} from '../../types'
import { checkTopicDuplicateOrSimilar } from '../../utils/topicDuplicateCheck'
import { 
  Plus, 
  Edit3, 
  Trash2, 
  ArrowUp, 
  ArrowDown, 
  ExternalLink, 
  Layers, 
  BookOpen, 
  CheckCircle2, 
  AlertTriangle, 
  Eye, 
  Upload, 
  Sparkles, 
  Compass, 
  ListOrdered, 
  Briefcase, 
  LayoutGrid, 
  X
} from 'lucide-react'
import { extractYouTubeVideoId } from '../../utils/youtubeEmbed'

const PRESENTATION_STYLES: Array<{
  id: TopicPresentationStyle
  title: string
  badge: string
  description: string
  icon: any
}> = [
  {
    id: 'gallery',
    title: 'Resource Gallery',
    badge: 'Multi-Format',
    description: 'Clean format-organized tabs (Videos, Infographics, PDFs, Tutorials) with media cards and preview modals.',
    icon: LayoutGrid,
  },
  {
    id: 'guided-sequence',
    title: 'Guided Learning Sequence',
    badge: 'Step-by-Step',
    description: 'A structured, chronological sequence (Step 1, Step 2, Step 3...) leading the student from foundation to execution.',
    icon: ListOrdered,
  },
  {
    id: 'situation-based',
    title: 'Situation-Based Tutorial',
    badge: 'Problem & Solution',
    description: 'Presents a real-world business scenario and context first, followed by a curated solution toolkit.',
    icon: Briefcase,
  },
  {
    id: 'masterclass',
    title: 'Interactive Masterclass',
    badge: 'Role Model',
    description: 'Full-featured masterclass layout with interactive tutorial hero card, supporting resources, and practice checkpoints.',
    icon: Sparkles,
  },
  {
    id: 'custom-mixed',
    title: 'Custom / Mixed Layout',
    badge: 'Hybrid View',
    description: 'Featured primary media card positioned prominently at the top with compact supporting resources below.',
    icon: Layers,
  },
]

export const TopicContentStudio: React.FC = () => {
  const { 
    categories, 
    topics, 
    addTopic, 
    updateTopic, 
    addResource, 
    updateResource, 
    deleteResource, 
    reorderResource 
  } = useLearningHub()

  // 1. Selected Category
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>(
    categories[0]?.id || 'power-bi'
  )

  // 2. Selected Topic ID
  const categoryTopics = topics
    .filter((t) => t.categoryId === selectedCategoryId)
    .sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0))

  const [selectedTopicId, setSelectedTopicId] = useState<string>(
    categoryTopics[0]?.id || ''
  )

  // Auto-select first topic when category changes if current topic is not in category
  const activeTopic = topics.find((t) => t.id === selectedTopicId && t.categoryId === selectedCategoryId) 
    || categoryTopics[0] 
    || null

  // Create Topic Form State
  const [isCreatingTopic, setIsCreatingTopic] = useState(false)
  const [newTopicTitle, setNewTopicTitle] = useState('')
  const [newTopicSlug, setNewTopicSlug] = useState('')
  const [newTopicShortDesc, setNewTopicShortDesc] = useState('')
  const [newTopicDetailedDesc, setNewTopicDetailedDesc] = useState('')
  const [newTopicDifficulty, setNewTopicDifficulty] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Beginner')
  const [newTopicPresentation, setNewTopicPresentation] = useState<TopicPresentationStyle>('gallery')
  const [forceAllowDuplicate, setForceAllowDuplicate] = useState(false)

  // Edit Topic Details Modal
  const [isEditingTopicMeta, setIsEditingTopicMeta] = useState(false)
  const [editTitle, setEditTitle] = useState('')
  const [editShortDesc, setEditShortDesc] = useState('')
  const [editDetailedDesc, setEditDetailedDesc] = useState('')
  const [editDifficulty, setEditDifficulty] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Beginner')

  // Resource Form State (Add / Edit)
  const [isResourceModalOpen, setIsResourceModalOpen] = useState(false)
  const [editingResourceId, setEditingResourceId] = useState<string | null>(null)
  const [resType, setResType] = useState<AdminResourceType>('YouTube Video')
  const [resTitle, setResTitle] = useState('')
  const [resUrl, setResUrl] = useState('')
  const [resDescription, setResDescription] = useState('')
  const [resDuration, setResDuration] = useState('')
  const [resDifficulty, setResDifficulty] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Beginner')
  const [resStatus, setResStatus] = useState<ResourceStatus>('Published')
  const [resCreatorName, setResCreatorName] = useState('')
  const [resStartTime, setResStartTime] = useState('')
  const [resEndTime, setResEndTime] = useState('')
  const [deleteConfirmResId, setDeleteConfirmResId] = useState<string | null>(null)

  // File upload ref
  const fileUploadInputRef = useRef<HTMLInputElement>(null)

  // Notification Banner
  const [notice, setNotice] = useState<{ type: 'success' | 'info' | 'error'; message: string } | null>(null)

  const showNotice = (type: 'success' | 'info' | 'error', message: string) => {
    setNotice({ type, message })
    setTimeout(() => setNotice(null), 5000)
  }

  // Real-time Duplicate / Similarity Check for Topic Creation
  const duplicateCheck = checkTopicDuplicateOrSimilar(
    newTopicTitle,
    newTopicSlug,
    selectedCategoryId,
    topics
  )

  const handleTitleChangeForNewTopic = (title: string) => {
    setNewTopicTitle(title)
    setForceAllowDuplicate(false)
    const slug = title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
    setNewTopicSlug(slug)
  }

  // Create Topic Submit
  const handleCreateTopicSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTopicTitle.trim()) {
      showNotice('error', 'Please enter a topic title.')
      return
    }

    if (duplicateCheck.hasDuplicateOrSimilar && !forceAllowDuplicate) {
      showNotice('error', 'Please resolve the duplicate topic warning before creating.')
      return
    }

    const finalSlug = (newTopicSlug.trim() || newTopicTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-'))
      + (forceAllowDuplicate ? `-${Date.now().toString().slice(-4)}` : '')

    const createdId = addTopic({
      categoryId: selectedCategoryId,
      title: newTopicTitle.trim(),
      slug: finalSlug,
      shortDescription: newTopicShortDesc.trim() || 'Comprehensive practical topic module.',
      detailedDescription: newTopicDetailedDesc.trim() || newTopicShortDesc.trim(),
      difficulty: newTopicDifficulty,
      presentationStyle: newTopicPresentation,
    })

    setSelectedTopicId(createdId)
    setIsCreatingTopic(false)
    setNewTopicTitle('')
    setNewTopicSlug('')
    setNewTopicShortDesc('')
    setNewTopicDetailedDesc('')
    setForceAllowDuplicate(false)
    showNotice('success', `Created new topic "${newTopicTitle}" in ${selectedCategoryId.toUpperCase()}.`)
  }

  // Open Edit Topic Details Modal
  const handleOpenEditTopicMeta = () => {
    if (!activeTopic) return
    setEditTitle(activeTopic.title)
    setEditShortDesc(activeTopic.shortDescription || '')
    setEditDetailedDesc(activeTopic.detailedDescription || '')
    setEditDifficulty(activeTopic.difficulty || 'Beginner')
    setIsEditingTopicMeta(true)
  }

  const handleSaveTopicMeta = (e: React.FormEvent) => {
    e.preventDefault()
    if (!activeTopic || !editTitle.trim()) return

    updateTopic(activeTopic.id, {
      title: editTitle.trim(),
      shortDescription: editShortDesc.trim(),
      detailedDescription: editDetailedDesc.trim() || editShortDesc.trim(),
      difficulty: editDifficulty,
    })
    setIsEditingTopicMeta(false)
    showNotice('success', `Updated details for "${editTitle.trim()}". (ID & URL slug preserved).`)
  }

  // Switch Presentation Style (guaranteed zero resource loss)
  const handlePresentationStyleChange = (style: TopicPresentationStyle) => {
    if (!activeTopic) return
    updateTopic(activeTopic.id, { presentationStyle: style })
    showNotice('info', `Topic presentation set to "${style}". All ${activeTopic.resources.length} resources are preserved.`)
  }

  // Open Add Resource Modal
  const handleOpenAddResource = () => {
    setEditingResourceId(null)
    setResType('YouTube Video')
    setResTitle('')
    setResUrl('')
    setResDescription('')
    setResDuration('')
    setResDifficulty('Beginner')
    setResStatus('Published')
    setResCreatorName('')
    setResStartTime('')
    setResEndTime('')
    setIsResourceModalOpen(true)
  }

  // Open Edit Resource Modal
  const handleOpenEditResource = (r: TopicResource) => {
    setEditingResourceId(r.id)
    setResType(r.type)
    setResTitle(r.title)
    setResUrl(r.url)
    setResDescription(r.description || '')
    setResDuration(r.durationOrPages || '')
    setResDifficulty(r.difficulty || 'Beginner')
    setResStatus(r.status || 'Published')
    setResCreatorName(r.creatorName || '')
    setResStartTime(r.startTime || '')
    setResEndTime(r.endTime || '')
    setIsResourceModalOpen(true)
  }

  // Handle Local File Upload (Base64 data URL for in-browser testing)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string
      setResUrl(dataUrl)
      if (!resTitle) {
        setResTitle(file.name.replace(/\.[^/.]+$/, ''))
      }
      showNotice('info', `File "${file.name}" loaded for in-browser local testing.`)
    }
    reader.readAsDataURL(file)
  }

  // Save Resource Submit
  const handleSaveResourceSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!activeTopic || !resTitle.trim()) {
      showNotice('error', 'Please enter a resource title.')
      return
    }

    if (!resUrl.trim()) {
      showNotice('error', 'Please provide a URL, file reference, or upload a local file.')
      return
    }

    // Auto-detect YouTube thumbnail if YouTube
    let autoThumb = ''
    if (resType === 'YouTube Video') {
      const videoId = extractYouTubeVideoId(resUrl.trim())
      if (videoId) {
        autoThumb = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
      }
    }

    if (editingResourceId) {
      updateResource(activeTopic.id, editingResourceId, {
        type: resType,
        title: resTitle.trim(),
        url: resUrl.trim(),
        description: resDescription.trim(),
        durationOrPages: resDuration.trim(),
        difficulty: resDifficulty,
        status: resStatus,
        creatorName: resCreatorName.trim(),
        thumbnailUrl: autoThumb || undefined,
        startTime: resStartTime.trim() || undefined,
        endTime: resEndTime.trim() || undefined,
      })
      showNotice('success', `Updated resource "${resTitle.trim()}".`)
    } else {
      addResource(activeTopic.id, {
        type: resType,
        title: resTitle.trim(),
        url: resUrl.trim(),
        description: resDescription.trim(),
        durationOrPages: resDuration.trim(),
        difficulty: resDifficulty,
        status: resStatus,
        creatorName: resCreatorName.trim(),
        thumbnailUrl: autoThumb || undefined,
        startTime: resStartTime.trim() || undefined,
        endTime: resEndTime.trim() || undefined,
      })
      showNotice('success', `Added new ${resType} "${resTitle.trim()}" to ${activeTopic.title}.`)
    }

    setIsResourceModalOpen(false)
  }

  // Reorder resources
  const handleMoveResource = (resourceId: string, direction: 'up' | 'down') => {
    if (!activeTopic) return
    reorderResource(activeTopic.id, resourceId, direction)
  }

  // Delete resource
  const handleDeleteResource = (resourceId: string) => {
    if (!activeTopic) return
    deleteResource(activeTopic.id, resourceId)
    setDeleteConfirmResId(null)
    showNotice('info', 'Resource removed from topic.')
  }

  const selectedCategory = categories.find((c) => c.id === selectedCategoryId)

  return (
    <div className="space-y-8 animate-in fade-in duration-150">
      
      {/* Toast Notification */}
      {notice && (
        <div className={`p-4 rounded-xl text-xs flex items-center justify-between gap-3 font-semibold shadow-sm transition-all ${
          notice.type === 'success'
            ? 'bg-emerald-50 border border-emerald-200 text-emerald-900'
            : notice.type === 'error'
              ? 'bg-rose-50 border border-rose-200 text-rose-900'
              : 'bg-teal-50 border border-teal-200 text-teal-900'
        }`}>
          <div className="flex items-center gap-2">
            {notice.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />}
            {notice.type === 'error' && <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />}
            {notice.type === 'info' && <Sparkles className="w-4 h-4 text-teal-600 shrink-0" />}
            <span>{notice.message}</span>
          </div>
        </div>
      )}

      {/* TOP HEADER: Simple 5-Step Workflow Banner */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-7 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 text-teal-800 text-xs font-bold border border-teal-200 mb-2">
              <Compass className="w-3.5 h-3.5 text-teal-600" />
              <span>Primary Workflow • Real Content Studio</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              One Topic → Multiple Resources → Flexible Presentation
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Assemble real videos, infographics, PDFs, or interactive HTML tutorials into any topic and preview immediately.
            </p>
          </div>

          {activeTopic && (
            <a
              href={`/category/${selectedCategory?.slug || selectedCategoryId}/topic/${activeTopic.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold inline-flex items-center gap-1.5 self-start sm:self-auto shadow-xs transition-colors shrink-0"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Preview Live Student Page</span>
              <ExternalLink className="w-3 h-3 text-slate-400" />
            </a>
          )}
        </div>

        {/* Workflow Breadcrumb Strip */}
        <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-600">
          <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-800">1. Choose Category</span>
          <span className="text-slate-300">→</span>
          <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-800">2. Select/Create Topic</span>
          <span className="text-slate-300">→</span>
          <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-800">3. Choose Presentation</span>
          <span className="text-slate-300">→</span>
          <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-800">4. Add Multiple Resources</span>
          <span className="text-slate-300">→</span>
          <span className="px-2 py-0.5 rounded-md bg-teal-50 text-teal-800 border border-teal-200">5. Student Preview</span>
        </div>
      </div>

      {/* STEP 1: CHOOSE CATEGORY */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <span className="text-xs font-bold uppercase tracking-wider text-teal-700">Step 1: Choose Knowledge Discipline</span>
          <span className="text-xs text-slate-500">{categories.length} Categories Active</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {categories.map((cat) => {
            const isSelected = selectedCategoryId === cat.id
            const count = topics.filter((t) => t.categoryId === cat.id).length

            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => {
                  setSelectedCategoryId(cat.id)
                  setIsCreatingTopic(false)
                }}
                className={`p-3.5 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                  isSelected
                    ? 'border-teal-600 bg-teal-50/80 shadow-xs ring-2 ring-teal-500/20'
                    : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/60'
                }`}
              >
                <span className="text-xs font-black text-slate-900 truncate block mb-1">
                  {cat.title}
                </span>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md w-fit ${
                  isSelected ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-600'
                }`}>
                  {count} {count === 1 ? 'Topic' : 'Topics'}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* STEP 2: SELECT OR CREATE TOPIC */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-teal-700">Step 2: Select or Create Topic</span>
            <h3 className="text-lg font-black text-slate-900 tracking-tight mt-0.5">
              Topics in {selectedCategory?.title || selectedCategoryId}
            </h3>
          </div>

          <button
            type="button"
            onClick={() => {
              setIsCreatingTopic(!isCreatingTopic)
              setNewTopicTitle('')
              setNewTopicSlug('')
            }}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold inline-flex items-center gap-1.5 transition-colors self-start sm:self-auto shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{isCreatingTopic ? 'Cancel & View List' : 'Create New Topic'}</span>
          </button>
        </div>

        {/* Topic Creation Form (with Duplicate Check) */}
        {isCreatingTopic && (
          <form onSubmit={handleCreateTopicSubmit} className="bg-slate-50 border border-slate-200 rounded-2xl p-5 sm:p-6 space-y-5 animate-in fade-in duration-150">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-teal-600" />
                <span>Create New Topic in {selectedCategory?.title}</span>
              </h4>
              <span className="text-xs text-slate-500">Duplicate detection active</span>
            </div>

            {/* DUPLICATE / SIMILARITY WARNING BOX */}
            {duplicateCheck.hasDuplicateOrSimilar && !forceAllowDuplicate && duplicateCheck.matchedTopic && (
              <div className="p-4 bg-amber-50 border-2 border-amber-300 rounded-2xl text-xs text-amber-950 space-y-3">
                <div className="flex items-start gap-2.5">
                  <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-sm font-bold block text-amber-900">
                      Similar Topic Already Exists in this Category!
                    </strong>
                    <p className="mt-1 leading-relaxed">
                      {duplicateCheck.message} It currently has <strong>{duplicateCheck.matchedTopic.resources.length} resources</strong>.
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-amber-200/60">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedTopicId(duplicateCheck.matchedTopic!.id)
                      setIsCreatingTopic(false)
                      showNotice('info', `Switched to existing topic "${duplicateCheck.matchedTopic!.title}".`)
                    }}
                    className="px-4 py-2 bg-amber-700 hover:bg-amber-800 text-white rounded-xl font-bold transition-colors shadow-2xs"
                  >
                    Open Existing Topic ("{duplicateCheck.matchedTopic.title}")
                  </button>

                  <button
                    type="button"
                    onClick={() => setForceAllowDuplicate(true)}
                    className="px-3 py-2 bg-white hover:bg-amber-100 text-amber-900 border border-amber-300 rounded-xl font-semibold transition-colors"
                  >
                    Create Separate Topic Anyway
                  </button>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Topic Title *
                </label>
                <input
                  type="text"
                  required
                  value={newTopicTitle}
                  onChange={(e) => handleTitleChangeForNewTopic(e.target.value)}
                  placeholder="e.g. Conditional Formatting"
                  className="w-full text-xs sm:text-sm px-3.5 py-2 border border-slate-300 rounded-xl focus:outline-hidden focus:border-teal-500 font-bold bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  URL Slug *
                </label>
                <input
                  type="text"
                  required
                  value={newTopicSlug}
                  onChange={(e) => setNewTopicSlug(e.target.value)}
                  placeholder="conditional-formatting"
                  className="w-full text-xs sm:text-sm px-3.5 py-2 font-mono text-slate-700 border border-slate-300 rounded-xl focus:outline-hidden focus:border-teal-500 bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Difficulty Level
                </label>
                <select
                  value={newTopicDifficulty}
                  onChange={(e) => setNewTopicDifficulty(e.target.value as any)}
                  className="w-full text-xs sm:text-sm px-3.5 py-2 border border-slate-300 rounded-xl bg-white focus:outline-hidden"
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Short Description
                </label>
                <input
                  type="text"
                  value={newTopicShortDesc}
                  onChange={(e) => setNewTopicShortDesc(e.target.value)}
                  placeholder="e.g. Master cell elements, color scales, and rule-based formatting in Power BI."
                  className="w-full text-xs sm:text-sm px-3.5 py-2 border border-slate-300 rounded-xl bg-white focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Initial Presentation Choice
                </label>
                <select
                  value={newTopicPresentation}
                  onChange={(e) => setNewTopicPresentation(e.target.value as any)}
                  className="w-full text-xs sm:text-sm px-3.5 py-2 border border-slate-300 rounded-xl bg-white focus:outline-hidden font-medium"
                >
                  <option value="gallery">Resource Gallery</option>
                  <option value="guided-sequence">Guided Learning Sequence</option>
                  <option value="situation-based">Situation-Based Tutorial</option>
                  <option value="masterclass">Interactive Masterclass</option>
                  <option value="custom-mixed">Custom / Mixed Layout</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setIsCreatingTopic(false)}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl text-xs font-semibold transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={duplicateCheck.hasDuplicateOrSimilar && !forceAllowDuplicate}
                className="px-5 py-2 bg-teal-700 hover:bg-teal-800 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-colors shadow-xs"
              >
                Create Topic & Start Adding Content
              </button>
            </div>
          </form>
        )}

        {/* Existing Topics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {categoryTopics.map((t) => {
            const isSelected = activeTopic?.id === t.id
            const pubCount = t.resources.filter((r) => r.status === 'Published').length

            return (
              <div
                key={t.id}
                onClick={() => setSelectedTopicId(t.id)}
                className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'border-teal-600 bg-teal-50/60 shadow-xs ring-2 ring-teal-500/20'
                    : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200 uppercase">
                      {t.presentationStyle || 'Gallery'}
                    </span>
                    <span className="text-[11px] font-semibold text-slate-600">
                      {t.resources.length} {t.resources.length === 1 ? 'Resource' : 'Resources'} ({pubCount} pub)
                    </span>
                  </div>

                  <h4 className="font-bold text-slate-900 text-sm mb-1 line-clamp-1">
                    {t.title}
                  </h4>
                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                    {t.shortDescription}
                  </p>
                </div>

                <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-[11px] text-slate-400 font-mono truncate">/{t.slug}</span>
                  <span className={`font-bold ${isSelected ? 'text-teal-800' : 'text-slate-600'}`}>
                    {isSelected ? '✓ Active Topic' : 'Select'}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* ACTIVE TOPIC WORKSPACE */}
      {activeTopic ? (
        <div className="space-y-6">

          {/* STEP 3: CHOOSE PRESENTATION STYLE (No Content Loss) */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-teal-700">Step 3: Presentation Archetype</span>
                <h3 className="text-base font-black text-slate-900">
                  How Students Experience "{activeTopic.title}"
                </h3>
              </div>
              <span className="text-xs text-slate-400 italic">
                Only changes visual layout — never alters or deletes resources.
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3">
              {PRESENTATION_STYLES.map((pres) => {
                const isSelected = (activeTopic.presentationStyle || 'gallery') === pres.id
                const Icon = pres.icon

                return (
                  <button
                    key={pres.id}
                    type="button"
                    onClick={() => handlePresentationStyleChange(pres.id)}
                    className={`p-3.5 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                      isSelected
                        ? 'border-teal-600 bg-teal-50/90 shadow-xs ring-2 ring-teal-500/20'
                        : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <Icon className={`w-4 h-4 ${isSelected ? 'text-teal-700' : 'text-slate-500'}`} />
                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                          isSelected ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-600'
                        }`}>
                          {pres.badge}
                        </span>
                      </div>
                      <h5 className="font-bold text-xs text-slate-900 mb-1 leading-tight">{pres.title}</h5>
                      <p className="text-[11px] text-slate-500 leading-snug line-clamp-3">{pres.description}</p>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* STEP 4: RESOURCE MANAGEMENT (Multiple Resources of Any Type) */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-teal-700">Step 4: Manage Topic Resources</span>
                <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                  <span>Resources in "{activeTopic.title}"</span>
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
                    {activeTopic.resources.length} Total ({activeTopic.resources.filter((r) => r.status === 'Published').length} Published)
                  </span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Add multiple infographics, YouTube videos, Facebook posts, PDFs, or HTML tutorials in any combination.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleOpenEditTopicMeta}
                  className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold inline-flex items-center gap-1.5 transition-colors"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit Topic Info</span>
                </button>

                <button
                  type="button"
                  onClick={handleOpenAddResource}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold inline-flex items-center gap-1.5 transition-colors shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Resource</span>
                </button>
              </div>
            </div>

            {/* Resources List */}
            {activeTopic.resources.length === 0 ? (
              <div className="border-2 border-dashed border-slate-200 rounded-2xl p-10 text-center text-slate-400 space-y-3">
                <Layers className="w-10 h-10 text-slate-300 mx-auto" />
                <h4 className="font-bold text-slate-700 text-sm">No resources in this topic yet</h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Click "+ Add Resource" above to add an infographic, YouTube video, PDF, or HTML tutorial.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {activeTopic.resources.map((r, idx) => {
                  const isPublished = r.status === 'Published'
                  const isLocalFile = r.url.startsWith('data:')

                  return (
                    <div
                      key={r.id}
                      className="bg-slate-50/70 border border-slate-200 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-white hover:border-slate-300 transition-all"
                    >
                      <div className="flex items-start sm:items-center gap-3 min-w-0 flex-1">
                        <span className="w-6 h-6 rounded-full bg-slate-900 text-white text-xs font-bold flex items-center justify-center shrink-0">
                          {idx + 1}
                        </span>

                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border shrink-0 ${
                          r.type.includes('Video') 
                            ? 'bg-rose-50 text-rose-700 border-rose-200' 
                            : r.type === 'Infographic' 
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                              : r.type === 'PDF' 
                                ? 'bg-amber-50 text-amber-700 border-amber-200' 
                                : 'bg-indigo-50 text-indigo-700 border-indigo-200'
                        }`}>
                          {r.type}
                        </span>

                        <div className="min-w-0 flex-1">
                          <h5 className="font-bold text-slate-900 text-sm truncate">{r.title}</h5>
                          <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                            <span className="truncate max-w-xs text-[11px] font-mono">{r.url}</span>
                            {isLocalFile && (
                              <span className="text-[10px] font-semibold text-amber-700 bg-amber-50 px-1.5 py-0.2 rounded border border-amber-200">
                                Browser Draft File
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-end gap-1.5 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-200">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                          isPublished ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {r.status || 'Published'}
                        </span>

                        <div className="flex items-center gap-0.5 ml-2">
                          <button
                            type="button"
                            disabled={idx === 0}
                            onClick={() => handleMoveResource(r.id, 'up')}
                            className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-20"
                            title="Move Up"
                          >
                            <ArrowUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            disabled={idx === activeTopic.resources.length - 1}
                            onClick={() => handleMoveResource(r.id, 'down')}
                            className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-20"
                            title="Move Down"
                          >
                            <ArrowDown className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleOpenEditResource(r)}
                          className="p-1.5 text-slate-500 hover:text-teal-700 rounded-lg hover:bg-slate-100 transition-colors ml-1"
                          title="Edit Resource"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>

                        {deleteConfirmResId === r.id ? (
                          <div className="flex items-center gap-1 ml-1 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-md">
                            <span className="text-[10px] font-bold text-rose-800">Delete?</span>
                            <button
                              type="button"
                              onClick={() => handleDeleteResource(r.id)}
                              className="text-[10px] font-bold text-white bg-rose-600 px-1 rounded"
                            >
                              Yes
                            </button>
                            <button
                              type="button"
                              onClick={() => setDeleteConfirmResId(null)}
                              className="text-[10px] text-slate-600"
                            >
                              No
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setDeleteConfirmResId(r.id)}
                            className="p-1.5 text-slate-300 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                            title="Delete Resource"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center text-slate-400">
          <BookOpen className="w-10 h-10 text-slate-300 mx-auto mb-2" />
          <h4 className="text-base font-bold text-slate-700">No topic selected</h4>
          <p className="text-xs text-slate-500">Select an existing topic above or click "Create New Topic".</p>
        </div>
      )}

      {/* STEP 5: PREVIEW & PUBLISHING SAFETY GUIDANCE */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-850 text-white rounded-3xl p-6 sm:p-7 shadow-md space-y-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-teal-400" />
          <h3 className="text-sm font-bold text-teal-200 uppercase tracking-wider">
            Safe Publishing Workflow & Verification
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-300">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-1.5">
            <strong className="text-white block font-bold">1. Immediate Local Draft</strong>
            <p className="text-slate-400 leading-relaxed">
              Every topic and resource entered in Admin Studio is instantly persisted in your browser's LocalStorage. You can close or reload the page safely.
            </p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-1.5">
            <strong className="text-white block font-bold">2. Public Content Gating</strong>
            <p className="text-slate-400 leading-relaxed">
              Only resources marked with status <strong>"Published"</strong> appear to students. Draft and Hidden resources remain strictly excluded from public search and topic pages.
            </p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-1.5">
            <strong className="text-white block font-bold">3. Production Release to GitHub</strong>
            <p className="text-slate-400 leading-relaxed">
              To publish changes to the live website, click <strong>"Export for Publishing"</strong> in the top header, download <code>curriculum.json</code>, and commit it to GitHub.
            </p>
          </div>
        </div>
      </div>

      {/* RESOURCE ADD / EDIT MODAL */}
      {isResourceModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="text-lg font-bold text-slate-900">
                {editingResourceId ? 'Edit Resource' : `Add Resource to "${activeTopic?.title}"`}
              </h3>
              <button
                type="button"
                onClick={() => setIsResourceModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveResourceSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Resource Format / Type *
                  </label>
                  <select
                    value={resType}
                    onChange={(e) => setResType(e.target.value as AdminResourceType)}
                    className="w-full text-xs sm:text-sm px-3 py-2 border border-slate-300 rounded-xl bg-white focus:outline-hidden font-medium"
                  >
                    <option value="YouTube Video">YouTube Video</option>
                    <option value="Facebook Video">Facebook Video / Post</option>
                    <option value="Infographic">Infographic / Visual Model</option>
                    <option value="PDF">PDF Handbook / Notes</option>
                    <option value="Tutorial">HTML Tutorial</option>
                    <option value="External Link">General External Link</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Publication Status *
                  </label>
                  <select
                    value={resStatus}
                    onChange={(e) => setResStatus(e.target.value as ResourceStatus)}
                    className="w-full text-xs sm:text-sm px-3 py-2 border border-slate-300 rounded-xl bg-white focus:outline-hidden font-bold"
                  >
                    <option value="Published">Published (Publicly Visible)</option>
                    <option value="Draft">Draft (Admin Only)</option>
                    <option value="Hidden">Hidden / Archived</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Resource Title *
                </label>
                <input
                  type="text"
                  required
                  value={resTitle}
                  onChange={(e) => setResTitle(e.target.value)}
                  placeholder="e.g. Video 1: Foundations of Drill Through & Destination Pages"
                  className="w-full text-xs sm:text-sm px-3 py-2 border border-slate-300 rounded-xl focus:outline-hidden font-bold"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-slate-700">
                    URL or File Reference *
                  </label>
                  {(resType === 'Infographic' || resType === 'PDF' || resType === 'Tutorial') && (
                    <button
                      type="button"
                      onClick={() => fileUploadInputRef.current?.click()}
                      className="text-xs text-teal-700 hover:text-teal-900 font-bold inline-flex items-center gap-1"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload Local File (Browser Draft)</span>
                    </button>
                  )}
                  <input
                    ref={fileUploadInputRef}
                    type="file"
                    accept={resType === 'Infographic' ? 'image/*' : resType === 'PDF' ? 'application/pdf' : '.html,.htm'}
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </div>

                <input
                  type="text"
                  required
                  value={resUrl}
                  onChange={(e) => setResUrl(e.target.value)}
                  placeholder={
                    resType === 'YouTube Video' 
                      ? 'https://www.youtube.com/watch?v=...' 
                      : resType === 'Facebook Video' 
                        ? 'https://www.facebook.com/...' 
                        : resType === 'Tutorial'
                          ? 'tutorials/power-bi/bookmark/index.html'
                          : 'https://... or uploaded data URL'
                  }
                  className="w-full text-xs sm:text-sm px-3 py-2 font-mono text-slate-700 border border-slate-300 rounded-xl focus:outline-hidden"
                />

                {resUrl.startsWith('data:') && (
                  <p className="text-[11px] text-amber-700 bg-amber-50 p-2 rounded-lg border border-amber-200 mt-1.5">
                    <strong>Notice:</strong> This file is stored in your browser's local memory for testing. To include it in production, save the file to <code>public/</code> and enter its relative path here.
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Short Description (Optional)
                </label>
                <textarea
                  rows={2}
                  value={resDescription}
                  onChange={(e) => setResDescription(e.target.value)}
                  placeholder="Summary of what this learning material covers..."
                  className="w-full text-xs sm:text-sm px-3 py-2 border border-slate-300 rounded-xl focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Duration or Pages (Optional)
                  </label>
                  <input
                    type="text"
                    value={resDuration}
                    onChange={(e) => setResDuration(e.target.value)}
                    placeholder="e.g. 5 min read, 12 min video, 4-page PDF"
                    className="w-full text-xs sm:text-sm px-3 py-2 border border-slate-300 rounded-xl focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Creator / Channel (Optional)
                  </label>
                  <input
                    type="text"
                    value={resCreatorName}
                    onChange={(e) => setResCreatorName(e.target.value)}
                    placeholder="e.g. Guy in a Cube, Microsoft Learn"
                    className="w-full text-xs sm:text-sm px-3 py-2 border border-slate-300 rounded-xl focus:outline-hidden"
                  />
                </div>
              </div>

              {/* YouTube Clip Start / End Timestamps */}
              {resType === 'YouTube Video' && (
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                  <span className="text-xs font-bold text-slate-700 block">
                    Optional Video Clip Timestamps (HH:MM:SS or MM:SS)
                  </span>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] text-slate-500 mb-1">Start Time</label>
                      <input
                        type="text"
                        value={resStartTime}
                        onChange={(e) => setResStartTime(e.target.value)}
                        placeholder="01:30"
                        className="w-full text-xs px-2.5 py-1.5 border border-slate-300 rounded-lg bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-slate-500 mb-1">End Time</label>
                      <input
                        type="text"
                        value={resEndTime}
                        onChange={(e) => setResEndTime(e.target.value)}
                        placeholder="04:45"
                        className="w-full text-xs px-2.5 py-1.5 border border-slate-300 rounded-lg bg-white"
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsResourceModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shadow-xs"
                >
                  {editingResourceId ? 'Save Resource Changes' : 'Add Resource'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT TOPIC META MODAL */}
      {isEditingTopicMeta && activeTopic && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-lg p-6 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <h3 className="text-base font-bold text-slate-900">
                Edit Details: {activeTopic.title}
              </h3>
              <button
                type="button"
                onClick={() => setIsEditingTopicMeta(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveTopicMeta} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Topic Title *</label>
                <input
                  type="text"
                  required
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full text-xs sm:text-sm px-3 py-2 border border-slate-300 rounded-xl font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Difficulty Level</label>
                <select
                  value={editDifficulty}
                  onChange={(e) => setEditDifficulty(e.target.value as any)}
                  className="w-full text-xs sm:text-sm px-3 py-2 border border-slate-300 rounded-xl bg-white"
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Short Description</label>
                <textarea
                  rows={2}
                  value={editShortDesc}
                  onChange={(e) => setEditShortDesc(e.target.value)}
                  className="w-full text-xs sm:text-sm px-3 py-2 border border-slate-300 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Detailed Description (Optional)</label>
                <textarea
                  rows={3}
                  value={editDetailedDesc}
                  onChange={(e) => setEditDetailedDesc(e.target.value)}
                  className="w-full text-xs sm:text-sm px-3 py-2 border border-slate-300 rounded-xl"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsEditingTopicMeta(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold"
                >
                  Save Topic Details
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  )
}
