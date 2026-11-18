import React, { useState } from 'react'
import { useLearningHub } from '../../context/LearningHubContext'
import { detectResourceTypeFromUrl, type DetectedResourceMeta } from '../../utils/urlDetector'
import type { AdminResourceType, ResourceStatus } from '../../types'
import { 
  PlayCircle, 
  Video as VideoIcon, 
  Image as ImageIcon, 
  FileText, 
  BookOpen, 
  Globe, 
  Check, 
  Sparkles,
  ExternalLink,
  Plus,
  Wand2,
  Edit3,
  ShieldCheck,
  AlertTriangle,
  Info,
  X,
  Scissors,
  Loader2,
  FileCode
} from 'lucide-react'
import { GithubIcon } from '../common/GithubIcon'
import { parseTimeToSeconds, validateClipTimeRange, formatClipDuration } from '../../utils/timeFormat'
import { buildYouTubeEmbedUrl, extractYouTubeVideoId } from '../../utils/youtubeEmbed'
import { fetchYouTubeOembedMetadata, type YouTubeOembedResult } from '../../services/youtubeOembedService'
import { parseGitHubResourceUrl, type GitHubFileMetadata } from '../../utils/githubUrl'
import { ResourceSaveToast } from './ResourceSaveToast'

interface AddResourceQuickFormProps {
  initialCategoryId?: string
  initialTopicId?: string
  onSaved?: (resourceId: string) => void
}

type EntryMode = 'auto-fill' | 'manual'

const RESOURCE_TYPES: Array<{ type: AdminResourceType; label: string; icon: React.ReactNode }> = [
  { type: 'YouTube Video', label: 'YouTube Video', icon: <PlayCircle className="w-4 h-4 text-rose-600" /> },
  { type: 'Facebook Video', label: 'Facebook Video', icon: <VideoIcon className="w-4 h-4 text-blue-600" /> },
  { type: 'Infographic', label: 'Infographic', icon: <ImageIcon className="w-4 h-4 text-emerald-600" /> },
  { type: 'PDF', label: 'PDF Reference', icon: <FileText className="w-4 h-4 text-amber-600" /> },
  { type: 'Tutorial', label: 'Hands-on Tutorial', icon: <BookOpen className="w-4 h-4 text-indigo-600" /> },
  { type: 'External Link', label: 'External Link / Guide', icon: <Globe className="w-4 h-4 text-teal-600" /> },
]

export const AddResourceQuickForm: React.FC<AddResourceQuickFormProps> = ({
  initialCategoryId,
  initialTopicId,
  onSaved,
}) => {
  const { categories, topics, addResource } = useLearningHub()

  // Entry Mode: 'auto-fill' vs 'manual'
  const [entryMode, setEntryMode] = useState<EntryMode>('auto-fill')

  // Top Prominent URL
  const [url, setUrl] = useState('')
  const [detectedMeta, setDetectedMeta] = useState<DetectedResourceMeta | null>(null)

  // Field Values
  const [categoryId, setCategoryId] = useState<string>(initialCategoryId || (categories[0]?.id ?? ''))
  const availableTopics = topics.filter((t) => t.categoryId === categoryId)
  const [topicId, setTopicId] = useState<string>(initialTopicId || (availableTopics[0]?.id ?? ''))

  const [resourceType, setResourceType] = useState<AdminResourceType>('YouTube Video')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [creatorName, setCreatorName] = useState('')
  const [creatorUrl, setCreatorUrl] = useState('')
  const [thumbnailUrl, setThumbnailUrl] = useState('')
  const [directContentUrl, setDirectContentUrl] = useState('')
  const [originalSourceUrl, setOriginalSourceUrl] = useState('')
  const [gitHubMetadata, setGitHubMetadata] = useState<GitHubFileMetadata | null>(null)
  const [fileValidationError, setFileValidationError] = useState<string | null>(null)
  const [keywords, setKeywords] = useState('')
  const [durationOrPages, setDurationOrPages] = useState('')
  const [difficulty, setDifficulty] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Beginner')
  const [status, setStatus] = useState<ResourceStatus>('Published')

  // YouTube Clip Time Range
  const [startTime, setStartTime] = useState('')
  const [endTime, setEndTime] = useState('')
  const [timeRangeError, setTimeRangeError] = useState<string | null>(null)
  const [isTestingClip, setIsTestingClip] = useState(false)

  // YouTube Metadata Fetch State
  const [isFetchingMeta, setIsFetchingMeta] = useState(false)
  const [pendingOembed, setPendingOembed] = useState<YouTubeOembedResult | null>(null)
  const [showOembedOverwriteModal, setShowOembedOverwriteModal] = useState(false)

  // Field Provenance Badges: tracks whether a field is 'manual' or 'verified-source'
  const [fieldSource, setFieldSource] = useState<{
    type: 'verified-source' | 'manual'
    creator: 'verified-source' | 'manual'
  }>({
    type: 'manual',
    creator: 'manual',
  })

  // Overwrite Confirmation Dialog State for URL Auto-Detection
  const [overwriteConfirm, setOverwriteConfirm] = useState<{
    isOpen: boolean
    pendingType: AdminResourceType
    pendingCreator?: string
    pendingCreatorUrl?: string
    pendingDuration?: string
  }>({
    isOpen: false,
    pendingType: 'YouTube Video',
  })

  // Notifications
  const [successMessage, setSuccessMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [saveToast, setSaveToast] = useState<{
    type: 'save' | 'update'
    resourceTitle?: string
    message?: string
  } | null>(null)

  // Handle URL change & basic resource type auto-detection
  const handleUrlChange = (newUrl: string) => {
    setUrl(newUrl)
    if (!newUrl.trim()) {
      setDetectedMeta(null)
      setGitHubMetadata(null)
      setDirectContentUrl('')
      setOriginalSourceUrl('')
      setFileValidationError(null)
      return
    }

    const detected = detectResourceTypeFromUrl(newUrl)
    setDetectedMeta(detected)

    // Check if GitHub file link (including GitHub Pages *.github.io)
    if (
      newUrl.toLowerCase().includes('github.com') || 
      newUrl.toLowerCase().includes('raw.githubusercontent.com') ||
      newUrl.toLowerCase().includes('.github.io')
    ) {
      const gh = parseGitHubResourceUrl(newUrl)
      setGitHubMetadata(gh)
      setDirectContentUrl(gh.directContentUrl)
      setOriginalSourceUrl(gh.originalSourceUrl)

      if (gh.error) {
        setFileValidationError(gh.error)
      } else {
        setFileValidationError(null)
      }

      if (entryMode === 'auto-fill' && gh.isValidFormat && (gh.fileType === 'Infographic' || gh.fileType === 'PDF')) {
        const hasCustomTitle = title.trim() !== '' && title.trim() !== gh.suggestedTitle
        if (!hasCustomTitle && gh.suggestedTitle) {
          setTitle(gh.suggestedTitle)
        }
        setResourceType(gh.fileType)
        if (gh.fileType === 'Infographic') {
          setThumbnailUrl(gh.directContentUrl)
          if (!durationOrPages) setDurationOrPages('Visual Infographic')
        } else if (gh.fileType === 'PDF') {
          if (!durationOrPages) setDurationOrPages('PDF Reference')
        }
        if (gh.owner && !creatorName) {
          setCreatorName(gh.owner)
          setFieldSource((prev) => ({ ...prev, creator: 'verified-source' }))
        }
        if (gh.owner && !creatorUrl) {
          setCreatorUrl(`https://github.com/${gh.owner}`)
        }
        setFieldSource((prev) => ({ ...prev, type: 'verified-source' }))
      }
    } else {
      // Non-GitHub: check if generic image or PDF
      const generic = parseGitHubResourceUrl(newUrl)
      setGitHubMetadata(null)
      setFileValidationError(null)

      if (generic.isValidFormat && (generic.fileType === 'Infographic' || generic.fileType === 'PDF')) {
        setDirectContentUrl(newUrl.trim())
        setOriginalSourceUrl(newUrl.trim())
        if (entryMode === 'auto-fill') {
          if (!title.trim() && generic.suggestedTitle) {
            setTitle(generic.suggestedTitle)
          }
          setResourceType(generic.fileType)
          if (generic.fileType === 'Infographic') {
            setThumbnailUrl(newUrl.trim())
            if (!durationOrPages) setDurationOrPages('Visual Infographic')
          } else if (generic.fileType === 'PDF') {
            if (!durationOrPages) setDurationOrPages('PDF Reference')
          }
        }
      } else {
        setDirectContentUrl('')
        setOriginalSourceUrl('')
      }
    }

    if (detected && entryMode === 'auto-fill' && detected.type !== 'Infographic' && detected.type !== 'PDF') {
      const hasCustomData = title.trim() !== '' || description.trim() !== ''
      
      if (hasCustomData && resourceType !== detected.type) {
        setOverwriteConfirm({
          isOpen: true,
          pendingType: detected.type,
          pendingCreator: detected.suggestedCreator,
          pendingCreatorUrl: detected.suggestedCreatorUrl,
          pendingDuration: detected.suggestedDurationOrFormat,
        })
      } else {
        setResourceType(detected.type)
        if (detected.suggestedDurationOrFormat && !durationOrPages) {
          setDurationOrPages(detected.suggestedDurationOrFormat)
        }
        if (detected.suggestedCreator && !creatorName) {
          setCreatorName(detected.suggestedCreator)
          setFieldSource((prev) => ({ ...prev, creator: 'verified-source' }))
        }
        if (detected.suggestedCreatorUrl && !creatorUrl) {
          setCreatorUrl(detected.suggestedCreatorUrl)
        }
        setFieldSource((prev) => ({ ...prev, type: 'verified-source' }))
      }
    }
  }

  // Handle Category Change -> Reset Topic
  const handleCategoryChange = (newCatId: string) => {
    setCategoryId(newCatId)
    const matchingTopics = topics.filter((t) => t.categoryId === newCatId)
    setTopicId(matchingTopics[0]?.id ?? '')
  }

  // Confirm overwrite handler for URL pattern detection
  const handleConfirmOverwrite = () => {
    setResourceType(overwriteConfirm.pendingType)
    if (overwriteConfirm.pendingDuration) setDurationOrPages(overwriteConfirm.pendingDuration)
    if (overwriteConfirm.pendingCreator) {
      setCreatorName(overwriteConfirm.pendingCreator)
      setFieldSource((prev) => ({ ...prev, creator: 'verified-source' }))
    }
    if (overwriteConfirm.pendingCreatorUrl) setCreatorUrl(overwriteConfirm.pendingCreatorUrl)
    setFieldSource((prev) => ({ ...prev, type: 'verified-source' }))
    setOverwriteConfirm({ isOpen: false, pendingType: 'YouTube Video' })
  }

  const handleCancelOverwrite = () => {
    setOverwriteConfirm({ isOpen: false, pendingType: 'YouTube Video' })
  }

  // Handle "Fetch Video Details" action via official YouTube oEmbed endpoint
  const handleFetchVideoDetails = async () => {
    if (!url.trim()) {
      setErrorMessage('Please enter a YouTube video URL first.')
      return
    }

    const videoId = extractYouTubeVideoId(url.trim())
    if (!videoId) {
      setErrorMessage('The entered URL is not recognized as a valid YouTube video. Please use a link like https://www.youtube.com/watch?v=... or https://youtu.be/...')
      return
    }

    setIsFetchingMeta(true)
    setErrorMessage('')

    const result = await fetchYouTubeOembedMetadata(url.trim())
    setIsFetchingMeta(false)

    if (!result.success || !result.data) {
      setErrorMessage(result.error || 'Failed to fetch YouTube metadata.')
      return
    }

    const data = result.data
    const hasCustomData = (title.trim() !== '' && title.trim() !== data.title) || 
                          (creatorName.trim() !== '' && creatorName.trim() !== data.authorName)

    if (hasCustomData) {
      setPendingOembed(data)
      setShowOembedOverwriteModal(true)
    } else {
      applyOembedData(data)
    }
  }

  const applyOembedData = (data: YouTubeOembedResult) => {
    setTitle(data.title)
    setCreatorName(data.authorName)
    setCreatorUrl(data.authorUrl)
    setThumbnailUrl(data.thumbnailUrl)
    setResourceType('YouTube Video')
    setFieldSource({
      type: 'verified-source',
      creator: 'verified-source',
    })
    setSuccessMessage(`Fetched metadata for "${data.title}" successfully via official YouTube oEmbed.`)
    setTimeout(() => setSuccessMessage(''), 5000)
  }

  const handleConfirmOembedOverwrite = () => {
    if (pendingOembed) {
      applyOembedData(pendingOembed)
    }
    setShowOembedOverwriteModal(false)
    setPendingOembed(null)
  }

  const handleCancelOembedOverwrite = () => {
    setShowOembedOverwriteModal(false)
    setPendingOembed(null)
  }

  // Handle "Extract GitHub / File Details" action
  const handleExtractGitHubDetails = () => {
    if (!url.trim()) {
      setErrorMessage('Please enter a GitHub or direct file URL first.')
      return
    }

    const gh = parseGitHubResourceUrl(url.trim())
    setGitHubMetadata(gh)
    setDirectContentUrl(gh.directContentUrl)
    setOriginalSourceUrl(gh.originalSourceUrl)

    if (!gh.isValidFormat || gh.error) {
      setErrorMessage(gh.error || 'The entered URL is not recognized as a supported Infographic or PDF file.')
      return
    }

    const hasCustomData = (title.trim() !== '' && title.trim() !== gh.suggestedTitle) ||
                          (creatorName.trim() !== '' && gh.owner && creatorName.trim() !== gh.owner)

    if (hasCustomData) {
      setOverwriteConfirm({
        isOpen: true,
        pendingType: gh.fileType,
        pendingCreator: gh.owner,
        pendingCreatorUrl: gh.owner ? `https://github.com/${gh.owner}` : undefined,
        pendingDuration: gh.fileType === 'Infographic' ? 'Visual Infographic' : 'PDF Document',
      })
    } else {
      applyGitHubDetails(gh)
    }
  }

  const applyGitHubDetails = (gh: GitHubFileMetadata) => {
    setTitle(gh.suggestedTitle)
    setResourceType(gh.fileType)
    setDirectContentUrl(gh.directContentUrl)
    setOriginalSourceUrl(gh.originalSourceUrl)
    if (gh.fileType === 'Infographic') {
      setThumbnailUrl(gh.directContentUrl)
      if (!durationOrPages) setDurationOrPages('Visual Infographic')
    } else if (gh.fileType === 'PDF') {
      if (!durationOrPages) setDurationOrPages('PDF Reference')
    }
    if (gh.owner) {
      setCreatorName(gh.owner)
      setCreatorUrl(`https://github.com/${gh.owner}`)
      setFieldSource((prev) => ({ ...prev, creator: 'verified-source' }))
    }
    setFieldSource((prev) => ({ ...prev, type: 'verified-source' }))
    setSuccessMessage(`Auto-filled details from "${gh.fileName || 'file'}" (${gh.fileType}).`)
    setTimeout(() => setSuccessMessage(''), 5000)
  }

  const validate = () => {
    if (!url.trim()) {
      setErrorMessage('Please enter or paste a Resource URL.')
      return false
    }
    if (!categoryId) {
      setErrorMessage('Please select a target Category.')
      return false
    }
    if (!topicId) {
      setErrorMessage('Please select a target Topic under this Category.')
      return false
    }
    if (!title.trim()) {
      setErrorMessage('Please enter a Resource Title.')
      return false
    }
    setErrorMessage('')
    return true
  }

  const handleStartTimeChange = (val: string) => {
    setStartTime(val)
    const res = validateClipTimeRange(val, endTime)
    setTimeRangeError(res.isValid ? null : (res.error || null))
  }

  const handleEndTimeChange = (val: string) => {
    setEndTime(val)
    const res = validateClipTimeRange(startTime, val)
    setTimeRangeError(res.isValid ? null : (res.error || null))
  }

  const handleSave = (addAnother: boolean = false) => {
    if (isSaving) return
    if (!validate()) return

    let startSec: number | undefined
    let endSec: number | undefined

    if (resourceType === 'YouTube Video' && (startTime.trim() || endTime.trim())) {
      const timeVal = validateClipTimeRange(startTime, endTime)
      if (!timeVal.isValid) {
        setErrorMessage(timeVal.error || 'Invalid clip time format.')
        return
      }
      if (timeVal.startSeconds !== null) startSec = timeVal.startSeconds
      if (timeVal.endSeconds !== null) endSec = timeVal.endSeconds
    }

    const parsedKeywords = keywords
      .split(',')
      .map((k) => k.trim())
      .filter((k) => k.length > 0)

    setIsSaving(true)
    try {
      const savedTitle = title.trim()
      const newId = addResource(topicId, {
        title: savedTitle,
        url: url.trim(),
        directContentUrl: directContentUrl.trim() || undefined,
        originalSourceUrl: originalSourceUrl.trim() || undefined,
        description: description.trim() || undefined,
        type: resourceType,
        durationOrPages: durationOrPages.trim() || undefined,
        difficulty,
        status,
        creatorName: creatorName.trim() || undefined,
        creatorUrl: creatorUrl.trim() || undefined,
        thumbnailUrl: (resourceType === 'Infographic' && (directContentUrl || url) ? (directContentUrl || url) : thumbnailUrl).trim() || undefined,
        keywords: parsedKeywords.length > 0 ? parsedKeywords : undefined,
        startTime: startTime.trim() || undefined,
        endTime: endTime.trim() || undefined,
        startSeconds: startSec,
        endSeconds: endSec,
        isDemo: true,
      })

      if (!newId) {
        throw new Error('Could not save resource. Please verify category and topic selection.')
      }

      setErrorMessage('')
      setSuccessMessage('')
      setSaveToast({
        type: 'save',
        resourceTitle: savedTitle,
        message: addAnother ? 'You can now add another resource.' : undefined,
      })

      if (onSaved) onSaved(newId)

      // Reset editable fields
      setUrl('')
      setDetectedMeta(null)
      setDirectContentUrl('')
      setOriginalSourceUrl('')
      setGitHubMetadata(null)
      setFileValidationError(null)
      setTitle('')
      setDescription('')
      setCreatorName('')
      setCreatorUrl('')
      setThumbnailUrl('')
      setKeywords('')
      setDurationOrPages('')
      setStartTime('')
      setEndTime('')
      setTimeRangeError(null)
      setIsTestingClip(false)
      setFieldSource({ type: 'manual', creator: 'manual' })
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : 'Failed to save resource.')
    } finally {
      setIsSaving(false)
    }
  }

  const getTypeIcon = (type: AdminResourceType) => {
    const item = RESOURCE_TYPES.find((r) => r.type === type)
    return item?.icon || <Globe className="w-4 h-4 text-teal-600" />
  }

  const selectedCategoryObj = categories.find((c) => c.id === categoryId)
  const selectedTopicObj = topics.find((t) => t.id === topicId)

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs space-y-8">
      
      {/* Top Header & Mode Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Plus className="w-5 h-5 text-teal-700" />
            <span>Add Resource to Curriculum</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Choose between automated URL detection with AI review, or traditional manual entry.
          </p>
        </div>

        {/* Workflow Mode Tabs */}
        <div className="flex items-center p-1 bg-slate-100 rounded-xl border border-slate-200 text-xs font-semibold shrink-0">
          <button
            type="button"
            onClick={() => setEntryMode('auto-fill')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg transition-all ${
              entryMode === 'auto-fill'
                ? 'bg-white text-teal-900 shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Wand2 className="w-3.5 h-3.5 text-teal-600" />
            <span>Auto Fill from URL</span>
          </button>

          <button
            type="button"
            onClick={() => setEntryMode('manual')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg transition-all ${
              entryMode === 'manual'
                ? 'bg-white text-slate-900 shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Edit3 className="w-3.5 h-3.5 text-slate-600" />
            <span>Enter Manually</span>
          </button>
        </div>
      </div>

      {/* Success & Error alerts */}
      {successMessage && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center gap-2 font-medium">
          <Check className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs font-medium flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* SECTION 1: PROMINENT RESOURCE URL INPUT AT THE TOP */}
      <div className="bg-slate-50/80 border border-slate-200 rounded-2xl p-5 sm:p-6 space-y-3">
        <div className="flex items-center justify-between">
          <label className="block text-xs font-extrabold text-slate-900 uppercase tracking-wider">
            1. Resource Destination URL <span className="text-rose-500">*</span>
          </label>
          <span className="text-[11px] font-semibold text-slate-500">
            Supports YouTube, Facebook, GitHub images, Google Drive, PDFs, Tutorials
          </span>
        </div>

        <div className="relative flex items-center">
          <input
            type="text"
            required
            value={url}
            onChange={(e) => handleUrlChange(e.target.value)}
            placeholder="Paste URL here (e.g. https://www.youtube.com/watch?v=pRUzfNsp-Hw or https://youtu.be/...)"
            className="w-full text-xs sm:text-sm font-mono bg-white border border-slate-300 rounded-xl py-3 pl-4 pr-10 text-slate-900 placeholder-slate-400 focus:outline-hidden focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
          />
          {url && (
            <button
              type="button"
              onClick={() => {
                setUrl('')
                setDetectedMeta(null)
                setThumbnailUrl('')
              }}
              className="absolute right-3 p-1 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100"
              title="Clear URL"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Live URL Recognition Banner */}
        {detectedMeta ? (
          <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 bg-teal-50 border border-teal-200 rounded-xl text-xs text-teal-900">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-teal-700 shrink-0" />
              <span>
                <strong>Verified Source Detected:</strong> {detectedMeta.type} ({detectedMeta.reason})
              </span>
            </div>
            <span className="text-[10px] font-bold text-teal-800 bg-white px-2 py-0.5 rounded border border-teal-200">
              Confidence: {detectedMeta.confidence}
            </span>
          </div>
        ) : url.trim().length > 0 ? (
          <div className="text-[11px] text-slate-500 flex items-center gap-1.5 pl-1">
            <Info className="w-3.5 h-3.5 text-slate-400" />
            <span>Analyzing URL pattern... Defaulting to External Link.</span>
          </div>
        ) : null}

        {/* GitHub / File Link Validation Notice */}
        {fileValidationError && (
          <div className="flex items-start gap-2.5 p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <strong className="block font-semibold">GitHub / File Format Notice:</strong>
              <span>{fileValidationError}</span>
            </div>
          </div>
        )}

        {/* GitHub Asset Recognized Card */}
        {gitHubMetadata && gitHubMetadata.isValidFormat && (
          <div className="p-3 bg-slate-900 text-slate-100 rounded-xl text-xs space-y-1.5 border border-slate-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-semibold">
                <GithubIcon className="w-4 h-4 text-teal-400" />
                <span>GitHub Asset: {gitHubMetadata.owner}/{gitHubMetadata.repo}</span>
              </div>
              {gitHubMetadata.branch && (
                <span className="text-[10px] font-mono bg-slate-800 text-teal-300 px-2 py-0.5 rounded border border-slate-700">
                  Branch: {gitHubMetadata.branch}
                </span>
              )}
            </div>
            <div className="text-slate-300 text-[11px] flex flex-wrap gap-x-4">
              <span>File: <strong className="text-white">{gitHubMetadata.fileName}</strong></span>
              <span>Type: <strong className="text-white">{gitHubMetadata.fileType}</strong></span>
              <span>Direct Link: <span className="text-emerald-400 font-semibold">Direct Raw CDN Ready</span></span>
            </div>
          </div>
        )}

        {/* Action Buttons in Auto Fill Mode */}
        {entryMode === 'auto-fill' && (
          <div className="pt-2 flex flex-wrap items-center gap-3">
            {(detectedMeta?.type === 'YouTube Video' || url.toLowerCase().includes('youtube.com') || url.toLowerCase().includes('youtu.be')) ? (
              <>
                <button
                  type="button"
                  disabled={isFetchingMeta}
                  onClick={handleFetchVideoDetails}
                  className="inline-flex items-center gap-2 px-4 py-2.5 bg-teal-700 hover:bg-teal-800 disabled:bg-teal-400 text-white rounded-xl text-xs font-bold transition-colors shadow-xs"
                >
                  {isFetchingMeta ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Fetching Video Details...</span>
                    </>
                  ) : (
                    <>
                      <PlayCircle className="w-4 h-4" />
                      <span>Fetch Video Details</span>
                    </>
                  )}
                </button>

                <span className="text-[11px] font-semibold text-teal-900 bg-teal-50 border border-teal-200 px-3 py-1.5 rounded-lg flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                  <span>LOCAL DEV PROXY (Vite Dev Proxy to Official YouTube oEmbed)</span>
                </span>
              </>
            ) : (gitHubMetadata || resourceType === 'Infographic' || resourceType === 'PDF') ? (
              <>
                <button
                  type="button"
                  onClick={handleExtractGitHubDetails}
                  className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors shadow-xs"
                >
                  <FileCode className="w-4 h-4 text-teal-400" />
                  <span>Extract GitHub Details</span>
                </button>

                <span className="text-[11px] font-semibold text-slate-700 bg-white border border-slate-200 px-3 py-1.5 rounded-lg flex items-center gap-1.5">
                  <GithubIcon className="w-3.5 h-3.5 text-slate-900 shrink-0" />
                  <span>Direct raw link generated • Title parsed from filename</span>
                </span>
              </>
            ) : null}
          </div>
        )}
      </div>

      {/* SECTION 2: REVIEWABLE METADATA FORM & LIVE PREVIEW */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Form Fields (7 cols) */}
        <form 
          onSubmit={(e) => { e.preventDefault(); handleSave(false) }}
          className="lg:col-span-7 space-y-4"
        >
          <div className="flex items-center justify-between pb-2 border-b border-slate-200">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-800 flex items-center gap-2">
              <span>2. Review & Refine Metadata</span>
              <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full font-normal">
                All fields editable
              </span>
            </h3>

            <div className="flex items-center gap-2 text-[10px] text-slate-400">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-teal-500" />
                <span>Verified Source</span>
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-slate-400" />
                <span>Manual Entry</span>
              </span>
            </div>
          </div>

          {/* Target Category & Topic */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Category <span className="text-rose-500">*</span>
                </label>
                <span className="text-[10px] font-medium text-slate-500 bg-slate-100 px-1.5 py-0.2 rounded">
                  Manual Select
                </span>
              </div>
              <select
                value={categoryId}
                onChange={(e) => handleCategoryChange(e.target.value)}
                className="w-full text-xs font-medium bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-900 focus:outline-hidden focus:border-teal-600"
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Topic <span className="text-rose-500">*</span>
                </label>
                <span className="text-[10px] font-medium text-slate-500 bg-slate-100 px-1.5 py-0.2 rounded">
                  Manual Select
                </span>
              </div>
              <select
                value={topicId}
                onChange={(e) => setTopicId(e.target.value)}
                className="w-full text-xs font-medium bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-900 focus:outline-hidden focus:border-teal-600"
              >
                {availableTopics.length === 0 ? (
                  <option value="">No topics in this category</option>
                ) : (
                  availableTopics.map((top) => (
                    <option key={top.id} value={top.id}>
                      {top.title}
                    </option>
                  ))
                )}
              </select>
            </div>
          </div>

          {/* Resource Type */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Resource Type <span className="text-rose-500">*</span>
              </label>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                fieldSource.type === 'verified-source'
                  ? 'bg-teal-50 text-teal-800 border border-teal-200'
                  : 'bg-slate-100 text-slate-600'
              }`}>
                {fieldSource.type === 'verified-source' ? 'Source Detected' : 'Manual Entry'}
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {RESOURCE_TYPES.map((rt) => {
                const isSelected = resourceType === rt.type
                return (
                  <button
                    key={rt.type}
                    type="button"
                    onClick={() => {
                      setResourceType(rt.type)
                      setFieldSource((prev) => ({ ...prev, type: 'manual' }))
                    }}
                    className={`flex items-center gap-2 p-2.5 rounded-lg border text-xs font-semibold transition-all text-left ${
                      isSelected
                        ? 'border-teal-600 bg-teal-50/70 text-teal-900 shadow-xs ring-1 ring-teal-600'
                        : 'border-slate-200 bg-slate-50 hover:bg-white text-slate-700'
                    }`}
                  >
                    {rt.icon}
                    <span className="truncate">{rt.label}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Title */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Title <span className="text-rose-500">*</span>
              </label>
              <span className="text-[10px] font-medium text-slate-500 bg-slate-100 px-1.5 py-0.2 rounded">
                Manual Entry
              </span>
            </div>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Master Power BI Drill Through in 15 Minutes"
              className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-900 placeholder-slate-400 focus:outline-hidden focus:border-teal-600"
            />
          </div>

          {/* Description */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Description <span className="text-slate-400 font-normal lowercase">(optional)</span>
              </label>
              <span className="text-[10px] font-medium text-slate-500 bg-slate-100 px-1.5 py-0.2 rounded">
                Manual Entry
              </span>
            </div>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Summary of learning concepts and takeaways..."
              className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-900 placeholder-slate-400 focus:outline-hidden focus:border-teal-600"
            />
          </div>

          {/* Creator Attribution (shown for videos or optional for any) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-3.5 bg-slate-50 rounded-xl border border-slate-200">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                  Creator / Channel Name
                </label>
                {fieldSource.creator === 'verified-source' && (
                  <span className="text-[9px] font-bold text-teal-800 bg-teal-50 px-1.5 rounded">
                    Detected
                  </span>
                )}
              </div>
              <input
                type="text"
                value={creatorName}
                onChange={(e) => {
                  setCreatorName(e.target.value)
                  setFieldSource((prev) => ({ ...prev, creator: 'manual' }))
                }}
                placeholder="e.g. Guy in a Cube, Curbal"
                className="w-full text-xs bg-white border border-slate-300 rounded-lg p-2 text-slate-900 focus:outline-hidden focus:border-teal-600"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                Channel / Profile URL
              </label>
              <input
                type="text"
                value={creatorUrl}
                onChange={(e) => setCreatorUrl(e.target.value)}
                placeholder="e.g. https://youtube.com/@channel"
                className="w-full text-xs font-mono bg-white border border-slate-300 rounded-lg p-2 text-slate-900 focus:outline-hidden focus:border-teal-600"
              />
            </div>
          </div>

          {/* YouTube Video Clip Range (Optional) */}
          {resourceType === 'YouTube Video' && (
            <div className="p-4 bg-rose-50/50 rounded-xl border border-rose-200/80 space-y-3">
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
                Leave empty to play the entire video. Enter <strong>MM:SS</strong> (e.g. <code>01:30</code>) or <strong>HH:MM:SS</strong> to spotlight a specific section.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Start Time <span className="text-slate-400 font-normal lowercase">(optional)</span>
                  </label>
                  <input
                    type="text"
                    value={startTime}
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
                    value={endTime}
                    onChange={(e) => handleEndTimeChange(e.target.value)}
                    placeholder="e.g. 05:40 or 00:05:40"
                    className="w-full text-xs font-mono bg-white border border-slate-300 rounded-lg p-2 text-slate-900 focus:outline-hidden focus:border-rose-600"
                  />
                </div>
              </div>

              {/* Time error or duration info */}
              {timeRangeError ? (
                <div className="flex items-center gap-1.5 text-xs font-semibold text-rose-700">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>{timeRangeError}</span>
                </div>
              ) : (startTime.trim() || endTime.trim()) ? (
                <div className="flex items-center justify-between text-xs text-rose-800 bg-rose-100/60 p-2 rounded-lg">
                  <span className="font-medium">
                    {formatClipDuration(parseTimeToSeconds(startTime), parseTimeToSeconds(endTime)) ? (
                      <>Selected Clip Duration: <strong>{formatClipDuration(parseTimeToSeconds(startTime), parseTimeToSeconds(endTime))}</strong></>
                    ) : (
                      <>Plays from <strong>{startTime || '00:00'}</strong> to video end</>
                    )}
                  </span>
                  <span className="text-[10px] text-rose-700 font-mono">
                    [{parseTimeToSeconds(startTime) ?? 0}s &rarr; {parseTimeToSeconds(endTime) ? `${parseTimeToSeconds(endTime)}s` : 'end'}]
                  </span>
                </div>
              ) : null}

              {/* Test Selected Portion Button */}
              <div className="pt-1 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    if (!url.trim() || !extractYouTubeVideoId(url)) {
                      setErrorMessage('Please enter a valid YouTube video URL above before testing the clip.')
                      return
                    }
                    if (timeRangeError) {
                      setErrorMessage('Please correct the start/end time error before testing.')
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
              {isTestingClip && url.trim() && extractYouTubeVideoId(url) && (
                <div className="mt-3 rounded-xl overflow-hidden border border-rose-300 bg-black">
                  <div className="aspect-video w-full">
                    <iframe
                      src={buildYouTubeEmbedUrl(
                        url,
                        parseTimeToSeconds(startTime) ?? undefined,
                        parseTimeToSeconds(endTime) ?? undefined,
                        true
                      ) || ''}
                      title="Test YouTube Clip"
                      className="w-full h-full border-0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                  <div className="p-2 bg-slate-900 text-slate-300 text-[11px] flex items-center justify-between">
                    <span>Testing segment playback ({startTime || '00:00'} to {endTime || 'End'})</span>
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

          {/* Keywords / Tags Input */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Keywords & Tags <span className="text-slate-400 font-normal lowercase">(comma separated)</span>
            </label>
            <input
              type="text"
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
              placeholder="e.g. DAX, filter context, bookmarks, tutorial"
              className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-900 placeholder-slate-400 focus:outline-hidden focus:border-teal-600"
            />
          </div>

          {/* Format / Duration, Difficulty & Status */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Length / Format
              </label>
              <input
                type="text"
                value={durationOrPages}
                onChange={(e) => setDurationOrPages(e.target.value)}
                placeholder="e.g. 15 min watch, 8 pages"
                className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg p-2 text-slate-900 placeholder-slate-400 focus:outline-hidden focus:border-teal-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Difficulty
              </label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as any)}
                className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg p-2 text-slate-900 focus:outline-hidden focus:border-teal-600"
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Publish Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as ResourceStatus)}
                className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg p-2 text-slate-900 focus:outline-hidden focus:border-teal-600 font-semibold"
              >
                <option value="Published">Published</option>
                <option value="Draft">Draft</option>
                <option value="Hidden">Hidden</option>
              </select>
            </div>
          </div>

          {/* Form Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-3">
            <button
              type="submit"
              disabled={isSaving}
              className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl text-xs font-bold transition-colors shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <span>Save Resource</span>
              )}
            </button>
            <button
              type="button"
              disabled={isSaving}
              onClick={() => handleSave(true)}
              className="px-4 py-2.5 bg-teal-50 hover:bg-teal-100 disabled:opacity-50 disabled:cursor-not-allowed text-teal-800 border border-teal-200 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <span>Save & Add Another</span>
              )}
            </button>
          </div>
        </form>

        {/* Live Preview Panel (5 cols) */}
        <div className="lg:col-span-5 bg-slate-50/70 border border-slate-200 rounded-2xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
              <Sparkles className="w-3.5 h-3.5 text-teal-600" />
              <span>Live Card Preview</span>
            </div>

            {/* Preview Card */}
            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-3">
              <div className="flex items-center justify-between gap-2">
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-teal-50 text-teal-800 border border-teal-200">
                  {getTypeIcon(resourceType)}
                  <span>{resourceType}</span>
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                  status === 'Published' 
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                    : status === 'Draft' 
                    ? 'bg-amber-50 text-amber-700 border border-amber-200' 
                    : 'bg-slate-100 text-slate-600 border border-slate-200'
                }`}>
                  {status}
                </span>
              </div>

              {/* Infographic Image Preview */}
              {resourceType === 'Infographic' && (directContentUrl || thumbnailUrl || url) && (
                <div className="relative w-full rounded-lg overflow-hidden border border-slate-200 bg-slate-100 flex items-center justify-center p-2 group max-h-56">
                  <img
                    src={directContentUrl || thumbnailUrl || url}
                    alt={title || 'Infographic preview'}
                    className="max-h-52 w-auto object-contain rounded shadow-xs"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none'
                    }}
                  />
                  <span className="absolute top-2 right-2 text-[10px] font-semibold bg-slate-900/80 text-white px-2 py-0.5 rounded backdrop-blur-xs">
                    Direct Image Preview
                  </span>
                </div>
              )}

              {/* PDF Preview in Preview Card */}
              {resourceType === 'PDF' && (
                <div className="p-3.5 rounded-lg border border-amber-200 bg-amber-50/70 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-lg bg-amber-100 text-amber-700">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-900 block truncate max-w-[170px]">
                        {title || 'PDF Document'}
                      </span>
                      <span className="text-[11px] text-amber-700 font-medium">
                        Public PDF Document
                      </span>
                    </div>
                  </div>
                  {(directContentUrl || url) && (
                    <a
                      href={directContentUrl || url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-[11px] font-bold rounded-lg shadow-xs transition-colors shrink-0"
                    >
                      Open PDF
                    </a>
                  )}
                </div>
              )}

              {/* YouTube Video Thumbnail Display */}
              {resourceType === 'YouTube Video' && thumbnailUrl && (
                <div className="relative aspect-video w-full rounded-lg overflow-hidden border border-slate-200 bg-slate-950 group">
                  <img
                    src={thumbnailUrl}
                    alt={title || 'YouTube thumbnail'}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-slate-900/20 group-hover:bg-slate-900/10 transition-colors flex items-center justify-center">
                    <div className="p-2 rounded-full bg-rose-600/90 text-white shadow-md">
                      <PlayCircle className="w-5 h-5" />
                    </div>
                  </div>
                  {(startTime.trim() || endTime.trim()) && (
                    <span className="absolute bottom-2 right-2 text-[10px] font-mono font-bold bg-slate-900/90 text-rose-300 px-1.5 py-0.5 rounded border border-rose-500/30">
                      Clip: {startTime || '00:00'} – {endTime || 'End'}
                    </span>
                  )}
                </div>
              )}

              <div>
                <h4 className="font-bold text-slate-900 text-sm leading-snug">
                  {title.trim() || 'Resource Title Will Appear Here'}
                </h4>
                {creatorName.trim() && (
                  <div className="text-[11px] font-semibold text-teal-700 mt-0.5">
                    By {creatorName.trim()}
                  </div>
                )}
                {resourceType === 'YouTube Video' && (startTime.trim() || endTime.trim()) && !timeRangeError && (
                  <div className="inline-flex items-center gap-1.5 text-[10px] font-semibold text-rose-800 bg-rose-50 px-2 py-0.5 rounded border border-rose-200 mt-1">
                    <Scissors className="w-3 h-3 text-rose-600 shrink-0" />
                    <span>
                      Clip: {startTime || '00:00'} – {endTime || 'End'}
                      {formatClipDuration(parseTimeToSeconds(startTime), parseTimeToSeconds(endTime)) && (
                        ` (${formatClipDuration(parseTimeToSeconds(startTime), parseTimeToSeconds(endTime))})`
                      )}
                    </span>
                  </div>
                )}
                <p className="text-xs text-slate-500 line-clamp-2 mt-1 leading-relaxed">
                  {description.trim() || 'Optional description preview describing what students will learn from this material.'}
                </p>
              </div>

              {keywords.trim() && (
                <div className="flex flex-wrap gap-1 pt-1">
                  {keywords.split(',').map((kw, i) => kw.trim() && (
                    <span key={i} className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded">
                      #{kw.trim()}
                    </span>
                  ))}
                </div>
              )}

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                <span>{durationOrPages || '15 min'}</span>
                <span className="font-medium text-slate-700">{difficulty}</span>
              </div>

              <div className="p-2 bg-slate-100/70 rounded-lg text-[10px] text-slate-500 font-mono truncate">
                {url.trim() || 'https://...'}
              </div>

              {/* Action Links */}
              <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs">
                {(directContentUrl || url) && (
                  <a
                    href={directContentUrl || url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 font-semibold text-teal-700 hover:text-teal-900 hover:underline"
                  >
                    <span>View Resource</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
                {originalSourceUrl && originalSourceUrl.includes('github.com') && (
                  <a
                    href={originalSourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 font-semibold text-slate-700 hover:text-slate-900 hover:underline"
                  >
                    <GithubIcon className="w-3.5 h-3.5" />
                    <span>Open Original GitHub File</span>
                  </a>
                )}
              </div>
            </div>

            {/* Destination Metadata */}
            <div className="mt-4 p-3 bg-white border border-slate-200 rounded-xl text-xs space-y-1 text-slate-600">
              <div className="flex justify-between">
                <span className="text-slate-400">Target Domain:</span>
                <span className="font-semibold text-slate-800">{selectedCategoryObj?.title || 'None'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Target Topic:</span>
                <span className="font-semibold text-slate-800">{selectedTopicObj?.title || 'None'}</span>
              </div>
            </div>
          </div>

          <div className="pt-4 text-center">
            <span className="text-[11px] text-slate-400 inline-flex items-center gap-1">
              <span>Preview updates instantly as you type</span>
              <ExternalLink className="w-3 h-3" />
            </span>
          </div>
        </div>
      </div>

      {/* OVERWRITE CONFIRMATION MODAL */}
      {overwriteConfirm.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div 
            className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 animate-in fade-in zoom-in-95 duration-150"
            role="dialog"
            aria-modal="true"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 rounded-xl bg-amber-50 text-amber-600 border border-amber-100">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base">Overwrite Existing Fields?</h3>
                <span className="text-xs text-amber-700 font-medium">New Source Pattern Detected</span>
              </div>
            </div>

            <p className="text-xs text-slate-600 mb-6 leading-relaxed">
              The pasted URL matches <strong>{overwriteConfirm.pendingType}</strong>. You have already entered custom content in the form. Would you like to update the resource type and platform attributes to match the detected URL?
            </p>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={handleCancelOverwrite}
                className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
              >
                Keep Existing Values
              </button>
              <button
                type="button"
                onClick={handleConfirmOverwrite}
                className="px-4 py-2 text-xs font-bold text-white bg-teal-700 hover:bg-teal-800 rounded-lg transition-colors shadow-xs"
              >
                Yes, Update to {overwriteConfirm.pendingType}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* OEMBED METADATA OVERWRITE CONFIRMATION MODAL */}
      {showOembedOverwriteModal && pendingOembed && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div 
            className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 animate-in fade-in zoom-in-95 duration-150"
            role="dialog"
            aria-modal="true"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 rounded-xl bg-amber-50 text-amber-600 border border-amber-100">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base">Replace Existing Field Values?</h3>
                <span className="text-xs text-amber-700 font-medium">Verified YouTube Metadata Available</span>
              </div>
            </div>

            <p className="text-xs text-slate-600 mb-4 leading-relaxed">
              You already have custom values in Title or Creator. Would you like to overwrite them with the official metadata retrieved from YouTube?
            </p>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-2 mb-5">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">New Video Title:</span>
                <span className="font-bold text-slate-900">{pendingOembed.title}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Creator / Channel:</span>
                <span className="font-semibold text-teal-800">{pendingOembed.authorName}</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={handleCancelOembedOverwrite}
                className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
              >
                Keep My Values
              </button>
              <button
                type="button"
                onClick={handleConfirmOembedOverwrite}
                className="px-4 py-2 text-xs font-bold text-white bg-teal-700 hover:bg-teal-800 rounded-lg transition-colors shadow-xs"
              >
                Yes, Apply YouTube Metadata
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Toast */}
      {saveToast && (
        <ResourceSaveToast
          type={saveToast.type}
          resourceTitle={saveToast.resourceTitle}
          message={saveToast.message}
          onClose={() => setSaveToast(null)}
        />
      )}
    </div>
  )
}
