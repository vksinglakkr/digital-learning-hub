import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useLearningHub } from '../../context/LearningHubContext'
import { 
  parseGitHubTreeUrl, 
  cleanFileNameToTitle, 
  isImageExtension, 
  isPdfExtension 
} from '../../utils/githubUrl'
import { 
  getGitHubCanonicalKey, 
  findResourcePlacements,
  type ResourcePlacement 
} from '../../utils/resourceUsage'
import type { AdminResourceType } from '../../types'
import { 
  FolderGit2, 
  Search, 
  AlertTriangle, 
  CheckCircle2, 
  ExternalLink, 
  FileText, 
  Image as ImageIcon, 
  Info, 
  Loader2, 
  CheckSquare, 
  Square, 
  BookOpen, 
  Layers, 
  PlusCircle,
  X
} from 'lucide-react'

export type PlacementStatusType = 'in-selected-topic' | 'in-other-topics' | 'new' | 'unsupported'

interface ScannedFileItem {
  id: string
  name: string
  path: string
  size: number
  fileType: AdminResourceType
  isSupported: boolean
  extension: string
  downloadUrl: string
  htmlUrl: string
  pagesUrl: string
  canonicalKey: string
  suggestedTitle: string
  editedTitle: string
  selected: boolean
  owner: string
  repo: string
}

interface PendingImportData {
  itemsToImport: ScannedFileItem[]
  duplicatesToSkip: ScannedFileItem[]
  categoryTitle: string
  topicTitle: string
  categoryId: string
  topicId: string
  categorySlug?: string
  topicSlug?: string
}

export const GitHubFolderScanner: React.FC = () => {
  const { categories, topics, addResourcesBatch } = useLearningHub()

  // Form input states
  const [folderUrl, setFolderUrl] = useState('')
  const [selectedCategoryId, setSelectedCategoryId] = useState(categories[0]?.id || '')
  const [selectedTopicId, setSelectedTopicId] = useState(
    topics.filter((t) => t.categoryId === (categories[0]?.id || ''))[0]?.id || ''
  )

  // Scanner states
  const [isScanning, setIsScanning] = useState(false)
  const [scanError, setScanError] = useState<string | null>(null)
  const [rateLimitInfo, setRateLimitInfo] = useState<string | null>(null)
  const [scannedFiles, setScannedFiles] = useState<ScannedFileItem[]>([])
  const [hasScanned, setHasScanned] = useState(false)
  const [activeFilter, setActiveFilter] = useState<'all' | 'selected' | 'in-selected-topic' | 'in-other-topics' | 'new' | 'unsupported'>('all')

  // Import & Confirmation states
  const [pendingImportData, setPendingImportData] = useState<PendingImportData | null>(null)
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false)
  const [isImporting, setIsImporting] = useState(false)
  const [importNotice, setImportNotice] = useState<{
    type: 'success' | 'error'
    message: string
    importedCount?: number
    skippedCount?: number
    categorySlug?: string
    topicSlug?: string
  } | null>(null)

  // Sample folder shortcut for quick testing
  const SAMPLE_FOLDER_URL = 'https://github.com/vksinglakkr/math-magic-playground/tree/main/Multiplication'

  // Update topic selector when category changes
  const handleCategoryChange = (catId: string) => {
    setSelectedCategoryId(catId)
    const matchingTopics = topics.filter((t) => t.categoryId === catId)
    setSelectedTopicId(matchingTopics[0]?.id || '')
  }

  // Evaluates a file's placement status specifically against the currently selected topic
  const getFilePlacementInfo = (file: ScannedFileItem) => {
    if (!file.isSupported) {
      return {
        status: 'unsupported' as PlacementStatusType,
        canImport: false,
        inSelectedTopic: [] as ResourcePlacement[],
        inOtherTopics: [] as ResourcePlacement[],
      }
    }

    const allPlacements = findResourcePlacements(file.canonicalKey, categories, topics)
    const inSelectedTopic = allPlacements.filter((p) => p.topicId === selectedTopicId)
    const inOtherTopics = allPlacements.filter((p) => p.topicId !== selectedTopicId)

    if (inSelectedTopic.length > 0) {
      return {
        status: 'in-selected-topic' as PlacementStatusType,
        canImport: false,
        inSelectedTopic,
        inOtherTopics,
      }
    }

    if (inOtherTopics.length > 0) {
      return {
        status: 'in-other-topics' as PlacementStatusType,
        canImport: true,
        inSelectedTopic: [],
        inOtherTopics,
      }
    }

    return {
      status: 'new' as PlacementStatusType,
      canImport: true,
      inSelectedTopic: [],
      inOtherTopics,
    }
  }

  const handleScan = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    setScanError(null)
    setRateLimitInfo(null)
    setScannedFiles([])
    setHasScanned(false)
    setImportNotice(null)

    const trimmedUrl = folderUrl.trim()
    if (!trimmedUrl) {
      setScanError('Please enter a public GitHub folder URL.')
      return
    }

    // Parse the GitHub tree URL
    const parsedTree = parseGitHubTreeUrl(trimmedUrl)
    if (!parsedTree.isTree || !parsedTree.owner || !parsedTree.repo || !parsedTree.branch || !parsedTree.apiContentsUrl) {
      setScanError(
        parsedTree.error || 
        'Invalid GitHub folder URL. Please enter a URL in the format: https://github.com/OWNER/REPO/tree/BRANCH/FOLDER'
      )
      return
    }

    setIsScanning(true)

    try {
      const response = await fetch(parsedTree.apiContentsUrl, {
        headers: {
          Accept: 'application/vnd.github.v3+json',
        },
      })

      // Check Rate Limit headers
      const remaining = response.headers.get('x-ratelimit-remaining')
      const resetTime = response.headers.get('x-ratelimit-reset')
      if (remaining && resetTime) {
        const resetDate = new Date(parseInt(resetTime, 10) * 1000).toLocaleTimeString()
        setRateLimitInfo(`GitHub API Quota: ${remaining} requests remaining (resets at ${resetDate})`)
      }

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error(
            `Folder or repository not found (404). Please verify that "${parsedTree.owner}/${parsedTree.repo}" is public and that branch "${parsedTree.branch}" with folder "${parsedTree.folderPath}" exists.`
          )
        }
        if (response.status === 403) {
          throw new Error(
            'GitHub API rate limit exceeded (403) or repository access is restricted. Unauthenticated GitHub requests are limited to 60/hour. Please try again later.'
          )
        }
        if (response.status === 401) {
          throw new Error('Access denied (401). This repository may be private. Only public repositories can be scanned.')
        }
        throw new Error(`GitHub API request failed with status HTTP ${response.status} (${response.statusText}).`)
      }

      const data = await response.json()
      if (!Array.isArray(data)) {
        throw new Error(
          'The provided URL points to a single file, not a folder. Please provide a folder URL (/tree/BRANCH/FOLDER).'
        )
      }

      // Process items in folder
      const items: ScannedFileItem[] = []

      for (const item of data) {
        // Skip subdirectories (non-recursive folder scan)
        if (item.type !== 'file') continue

        const fileName = item.name as string
        const filePath = item.path as string
        const ext = fileName.split('.').pop()?.toLowerCase() || ''

        const isImage = isImageExtension(ext)
        const isPdf = isPdfExtension(ext)
        const isSupported = isImage || isPdf

        const fileType: AdminResourceType = isImage 
          ? 'Infographic' 
          : isPdf 
          ? 'PDF' 
          : 'External Link'

        const downloadUrl = (item.download_url as string) || 
          `https://raw.githubusercontent.com/${parsedTree.owner}/${parsedTree.repo}/${parsedTree.branch}/${filePath}`
        const htmlUrl = (item.html_url as string) || 
          `https://github.com/${parsedTree.owner}/${parsedTree.repo}/blob/${parsedTree.branch}/${filePath}`
        const pagesUrl = `https://${parsedTree.owner}.github.io/${parsedTree.repo}/${filePath}`

        const suggestedTitle = cleanFileNameToTitle(fileName)
        const canonicalKey = getGitHubCanonicalKey(parsedTree.owner, parsedTree.repo, filePath)

        // Initial check against selectedTopicId
        const existingPlacements = isSupported 
          ? findResourcePlacements(canonicalKey, categories, topics) 
          : []
        const isAlreadyInTopic = existingPlacements.some((p) => p.topicId === selectedTopicId)

        items.push({
          id: item.sha || `${filePath}-${Date.now()}`,
          name: fileName,
          path: filePath,
          size: item.size || 0,
          fileType,
          isSupported,
          extension: ext,
          downloadUrl,
          htmlUrl,
          pagesUrl,
          canonicalKey,
          suggestedTitle,
          editedTitle: suggestedTitle,
          owner: parsedTree.owner,
          repo: parsedTree.repo,
          // Selectable if supported and not already in this specific topic
          selected: isSupported && !isAlreadyInTopic,
        })
      }

      setScannedFiles(items)
      setHasScanned(true)
    } catch (err: any) {
      setScanError(err.message || 'Failed to scan GitHub folder. Please check your network connection.')
    } finally {
      setIsScanning(false)
    }
  }

  // Toggle selection for an individual file
  const handleToggleSelect = (id: string) => {
    setScannedFiles((prev) =>
      prev.map((f) => {
        if (f.id !== id) return f
        const placement = getFilePlacementInfo(f)
        if (!placement.canImport) return f
        return { ...f, selected: !f.selected }
      })
    )
  }

  // In-place title edit
  const handleTitleChange = (id: string, newTitle: string) => {
    setScannedFiles((prev) =>
      prev.map((f) => (f.id === id ? { ...f, editedTitle: newTitle } : f))
    )
  }

  // Select all valid files that are allowed for the selected topic
  const handleSelectAllValid = () => {
    setScannedFiles((prev) =>
      prev.map((f) => {
        const info = getFilePlacementInfo(f)
        return info.canImport ? { ...f, selected: true } : { ...f, selected: false }
      })
    )
  }

  // Deselect all
  const handleDeselectAll = () => {
    setScannedFiles((prev) => prev.map((f) => ({ ...f, selected: false })))
  }

  // ================= INITIATE & CONFIRM BULK IMPORT =================

  const handleInitiateImport = () => {
    setImportNotice(null)
    setScanError(null)

    if (!selectedCategoryId) {
      setScanError('Please select a destination Category before importing.')
      return
    }

    if (!selectedTopicId) {
      setScanError('Please select a destination Topic belonging to the selected Category.')
      return
    }

    const targetCategory = categories.find((c) => c.id === selectedCategoryId)
    const targetTopic = topics.find((t) => t.id === selectedTopicId)

    if (!targetCategory || !targetTopic) {
      setScanError('The chosen Category or Topic could not be found.')
      return
    }

    const selected = scannedFiles.filter((f) => f.selected && f.isSupported)
    if (selected.length === 0) {
      setScanError('No resources are selected for import. Please select at least one file checkbox.')
      return
    }

    // Step 19C: Re-check same-topic duplicates immediately before saving against targetTopic.id
    const duplicatesToSkip: ScannedFileItem[] = []
    const itemsToImport: ScannedFileItem[] = []

    for (const file of selected) {
      const placements = findResourcePlacements(file.canonicalKey, categories, topics)
      const existsInTargetTopic = placements.some((p) => p.topicId === targetTopic.id)

      if (existsInTargetTopic) {
        duplicatesToSkip.push(file)
      } else {
        itemsToImport.push(file)
      }
    }

    if (itemsToImport.length === 0) {
      setScanError(
        `All ${selected.length} selected file(s) already exist in "${targetTopic.title}". No new resources to import.`
      )
      return
    }

    // Prepare pending import data and open confirmation dialog
    setPendingImportData({
      itemsToImport,
      duplicatesToSkip,
      categoryTitle: targetCategory.title,
      topicTitle: targetTopic.title,
      categoryId: targetCategory.id,
      topicId: targetTopic.id,
      categorySlug: targetCategory.slug,
      topicSlug: targetTopic.slug,
    })
    setIsConfirmModalOpen(true)
  }

  const handleConfirmImport = () => {
    if (!pendingImportData || isImporting) return

    setIsImporting(true)

    try {
      const { itemsToImport, duplicatesToSkip, topicId, topicTitle, categoryTitle, categorySlug, topicSlug } = pendingImportData

      // Map each selected file into a TopicResource payload
      const batchPayload = itemsToImport.map((file) => ({
        title: file.editedTitle.trim() || file.suggestedTitle,
        type: file.fileType,
        url: file.htmlUrl,
        directContentUrl: file.downloadUrl,
        originalSourceUrl: file.htmlUrl,
        thumbnailUrl: file.fileType === 'Infographic' ? file.downloadUrl : undefined,
        creatorName: file.owner,
        creatorUrl: `https://github.com/${file.owner}`,
        status: 'Published' as const,
        durationOrPages: file.fileType === 'Infographic' ? 'Visual Infographic' : 'PDF Document',
        description: undefined,
      }))

      // Atomic batch storage update
      const result = addResourcesBatch(topicId, batchPayload)

      // Unselect newly imported files
      const importedPaths = new Set(itemsToImport.map((f) => f.path))
      setScannedFiles((prev) =>
        prev.map((f) => (importedPaths.has(f.path) ? { ...f, selected: false } : f))
      )

      // Show completion summary
      setImportNotice({
        type: 'success',
        message: `Successfully imported ${result.count} new resource(s) into "${categoryTitle} → ${topicTitle}".`,
        importedCount: result.count,
        skippedCount: duplicatesToSkip.length,
        categorySlug,
        topicSlug,
      })

      setIsConfirmModalOpen(false)
      setPendingImportData(null)
    } catch (err: any) {
      setImportNotice({
        type: 'error',
        message: `Import failed: ${err.message || 'An unexpected error occurred while saving resources.'}`,
      })
    } finally {
      setIsImporting(false)
    }
  }

  // Compute live placement statuses and counts for all files relative to selectedTopicId
  const filesWithPlacement = scannedFiles.map((file) => ({
    file,
    info: getFilePlacementInfo(file),
  }))

  const totalFilesInFolder = scannedFiles.length
  const supportedFiles = scannedFiles.filter((f) => f.isSupported)

  const inSelectedTopicFiles = filesWithPlacement.filter((x) => x.info.status === 'in-selected-topic')
  const inOtherTopicsFiles = filesWithPlacement.filter((x) => x.info.status === 'in-other-topics')
  const newFiles = filesWithPlacement.filter((x) => x.info.status === 'new')
  const unsupportedFiles = filesWithPlacement.filter((x) => x.info.status === 'unsupported')

  const inSelectedTopicCount = inSelectedTopicFiles.length
  const inOtherTopicsCount = inOtherTopicsFiles.length
  const newCount = newFiles.length
  const unsupportedCount = unsupportedFiles.length

  // Ready to import are those selected AND can be imported
  const readyToImportCount = filesWithPlacement.filter(
    (x) => x.file.selected && x.info.canImport
  ).length

  // Filtered view
  const visibleItems = filesWithPlacement.filter((x) => {
    if (activeFilter === 'selected') return x.file.selected && x.info.canImport
    if (activeFilter === 'in-selected-topic') return x.info.status === 'in-selected-topic'
    if (activeFilter === 'in-other-topics') return x.info.status === 'in-other-topics'
    if (activeFilter === 'new') return x.info.status === 'new'
    if (activeFilter === 'unsupported') return x.info.status === 'unsupported'
    return true
  })

  // Selected topic object for display
  const currentSelectedTopic = topics.find((t) => t.id === selectedTopicId)
  const currentSelectedCategory = categories.find((c) => c.id === selectedCategoryId)

  return (
    <div className="space-y-6">
      
      {/* Intro Banner */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-7 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-200">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-[11px] font-bold mb-2">
              <FolderGit2 className="w-3.5 h-3.5 text-teal-600" />
              <span>Step 19C &mdash; Topic-wise Duplicate Detection</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              Bulk Import Infographics & PDFs from GitHub
            </h2>
            <p className="text-xs text-slate-500 mt-1 max-w-2xl leading-relaxed">
              Scan any public GitHub folder. Same files can be reused across different topics, while duplicates within the same topic are safely blocked.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              setFolderUrl(SAMPLE_FOLDER_URL)
            }}
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-colors shrink-0 flex items-center gap-1.5 self-start sm:self-center"
          >
            <FolderGit2 className="w-3.5 h-3.5 text-teal-700" />
            <span>Load Multiplication Sample</span>
          </button>
        </div>

        {/* Scan Input Form */}
        <form onSubmit={handleScan} className="pt-5 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider mb-1.5">
              1. GitHub Folder Tree URL <span className="text-rose-500">*</span>
            </label>
            <div className="relative flex items-center">
              <input
                type="text"
                required
                value={folderUrl}
                onChange={(e) => setFolderUrl(e.target.value)}
                placeholder="e.g. https://github.com/vksinglakkr/math-magic-playground/tree/main/Multiplication"
                className="w-full text-xs sm:text-sm font-mono bg-white border border-slate-300 rounded-xl py-3 pl-4 pr-10 text-slate-900 placeholder-slate-400 focus:outline-hidden focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
              />
            </div>
            <span className="text-[11px] text-slate-500 mt-1 block">
              Format: <code className="font-mono text-slate-700">https://github.com/OWNER/REPO/tree/BRANCH/FOLDER</code>
            </span>
          </div>

          {/* Destination Category & Topic Selectors */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-teal-700" />
                <span>Destination Category <span className="text-rose-500">*</span></span>
              </label>
              <select
                value={selectedCategoryId}
                onChange={(e) => handleCategoryChange(e.target.value)}
                className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-900 font-semibold focus:outline-hidden focus:border-teal-600"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-teal-700" />
                <span>Destination Topic <span className="text-rose-500">*</span></span>
              </label>
              <select
                value={selectedTopicId}
                onChange={(e) => setSelectedTopicId(e.target.value)}
                className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-900 font-semibold focus:outline-hidden focus:border-teal-600"
              >
                {topics.filter((t) => t.categoryId === selectedCategoryId).length === 0 ? (
                  <option value="">No topics in this category</option>
                ) : (
                  topics
                    .filter((t) => t.categoryId === selectedCategoryId)
                    .map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.title} ({t.resources.length} current resources)
                      </option>
                    ))
                )}
              </select>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <button
              type="submit"
              disabled={isScanning}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-400 text-white rounded-xl text-xs font-bold transition-colors shadow-xs cursor-pointer disabled:cursor-not-allowed"
            >
              {isScanning ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Scanning GitHub Folder...</span>
                </>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  <span>Scan GitHub Folder</span>
                </>
              )}
            </button>

            {rateLimitInfo && (
              <span className="text-[11px] text-slate-500 font-mono flex items-center gap-1">
                <Info className="w-3.5 h-3.5 text-slate-400" />
                <span>{rateLimitInfo}</span>
              </span>
            )}
          </div>
        </form>

        {/* Scan Error Callout */}
        {scanError && (
          <div className="mt-5 p-4 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 font-medium flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <strong className="block font-bold mb-0.5">Notice</strong>
              <span>{scanError}</span>
            </div>
          </div>
        )}

        {/* Import Completion Notice */}
        {importNotice && (
          <div className={`mt-5 p-4 rounded-xl text-xs flex items-start justify-between gap-3 font-medium animate-in fade-in duration-150 ${
            importNotice.type === 'success'
              ? 'bg-emerald-50 border border-emerald-200 text-emerald-900'
              : 'bg-rose-50 border border-rose-200 text-rose-900'
          }`}>
            <div className="flex items-start gap-2.5">
              {importNotice.type === 'success' ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              )}
              <div className="space-y-1">
                <strong className="block font-bold">{importNotice.message}</strong>
                {importNotice.type === 'success' && (
                  <div className="flex flex-wrap items-center gap-3 pt-1 text-[11px]">
                    {importNotice.skippedCount && importNotice.skippedCount > 0 ? (
                      <span className="text-amber-800">
                        ({importNotice.skippedCount} same-topic duplicate{importNotice.skippedCount === 1 ? '' : 's'} skipped automatically)
                      </span>
                    ) : null}
                    {importNotice.categorySlug && importNotice.topicSlug && (
                      <Link
                        to={`/category/${importNotice.categorySlug}/topic/${importNotice.topicSlug}`}
                        target="_blank"
                        className="underline font-bold text-teal-800 hover:text-teal-950 inline-flex items-center gap-1"
                      >
                        <span>View Topic in Live Portal</span>
                        <ExternalLink className="w-3 h-3" />
                      </Link>
                    )}
                  </div>
                )}
              </div>
            </div>
            <button
              type="button"
              onClick={() => setImportNotice(null)}
              className="text-slate-400 hover:text-slate-600 p-1 rounded"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* SCAN RESULTS & PREVIEW TABLE */}
      {hasScanned && (
        <div className="space-y-5">
          
          {/* Summary Stat Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            <div className="p-3.5 bg-white border border-slate-200 rounded-xl">
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Total in Folder</span>
              <span className="text-lg font-extrabold text-slate-900">{totalFilesInFolder}</span>
            </div>

            <div className="p-3.5 bg-white border border-slate-200 rounded-xl">
              <span className="text-teal-700 block text-[10px] uppercase font-bold">Supported Files</span>
              <span className="text-lg font-extrabold text-teal-800">{supportedFiles.length}</span>
            </div>

            <div className="p-3.5 bg-white border border-emerald-200 rounded-xl bg-emerald-50/30">
              <span className="text-emerald-700 block text-[10px] uppercase font-bold">Ready to Import</span>
              <span className="text-lg font-extrabold text-emerald-800">{readyToImportCount}</span>
            </div>

            <div className="p-3.5 bg-white border border-amber-200 rounded-xl bg-amber-50/30">
              <span className="text-amber-700 block text-[10px] uppercase font-bold">In Selected Topic</span>
              <span className="text-lg font-extrabold text-amber-800">{inSelectedTopicCount}</span>
            </div>

            <div className="p-3.5 bg-white border border-indigo-200 rounded-xl bg-indigo-50/30">
              <span className="text-indigo-700 block text-[10px] uppercase font-bold">In Other Topics</span>
              <span className="text-lg font-extrabold text-indigo-800">{inOtherTopicsCount}</span>
            </div>
          </div>

          {/* Table Container */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">
                  Scanned Files Preview ({visibleItems.length} shown)
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Showing placement status relative to &ldquo;{currentSelectedTopic?.title || 'Selected Topic'}&rdquo;.
                </p>
              </div>

              {/* View filter chips */}
              <div className="flex flex-wrap items-center gap-1.5 text-xs">
                <button
                  type="button"
                  onClick={() => setActiveFilter('all')}
                  className={`px-2.5 py-1 rounded-lg font-semibold transition-colors ${
                    activeFilter === 'all'
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  All ({scannedFiles.length})
                </button>
                <button
                  type="button"
                  onClick={() => setActiveFilter('selected')}
                  className={`px-2.5 py-1 rounded-lg font-semibold transition-colors ${
                    activeFilter === 'selected'
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Selected ({readyToImportCount})
                </button>
                {inSelectedTopicCount > 0 && (
                  <button
                    type="button"
                    onClick={() => setActiveFilter('in-selected-topic')}
                    className={`px-2.5 py-1 rounded-lg font-semibold transition-colors ${
                      activeFilter === 'in-selected-topic'
                        ? 'bg-amber-600 text-white'
                        : 'bg-amber-50 text-amber-800 border border-amber-200'
                    }`}
                  >
                    In Selected Topic ({inSelectedTopicCount})
                  </button>
                )}
                {inOtherTopicsCount > 0 && (
                  <button
                    type="button"
                    onClick={() => setActiveFilter('in-other-topics')}
                    className={`px-2.5 py-1 rounded-lg font-semibold transition-colors ${
                      activeFilter === 'in-other-topics'
                        ? 'bg-indigo-600 text-white'
                        : 'bg-indigo-50 text-indigo-800 border border-indigo-200'
                    }`}
                  >
                    In Other Topics ({inOtherTopicsCount})
                  </button>
                )}
                {newCount > 0 && (
                  <button
                    type="button"
                    onClick={() => setActiveFilter('new')}
                    className={`px-2.5 py-1 rounded-lg font-semibold transition-colors ${
                      activeFilter === 'new'
                        ? 'bg-emerald-600 text-white'
                        : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                    }`}
                  >
                    New ({newCount})
                  </button>
                )}
                {unsupportedCount > 0 && (
                  <button
                    type="button"
                    onClick={() => setActiveFilter('unsupported')}
                    className={`px-2.5 py-1 rounded-lg font-semibold transition-colors ${
                      activeFilter === 'unsupported'
                        ? 'bg-slate-700 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    Unsupported ({unsupportedCount})
                  </button>
                )}
              </div>
            </div>

            {/* Quick Selection Buttons */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 text-xs">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleSelectAllValid}
                  className="font-semibold text-teal-700 hover:text-teal-900 inline-flex items-center gap-1.5"
                >
                  <CheckSquare className="w-4 h-4" />
                  <span>Select All Allowed ({supportedFiles.length - inSelectedTopicCount})</span>
                </button>
                <button
                  type="button"
                  onClick={handleDeselectAll}
                  className="font-semibold text-slate-500 hover:text-slate-800 inline-flex items-center gap-1.5"
                >
                  <Square className="w-4 h-4" />
                  <span>Deselect All</span>
                </button>
              </div>

              <span className="text-[11px] text-slate-400">
                Titles are editable in-place below
              </span>
            </div>

            {/* Files Preview Table */}
            <div className="overflow-x-auto pt-2">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                    <th className="py-2.5 px-3 w-10 text-center">Select</th>
                    <th className="py-2.5 px-3 w-20">Preview</th>
                    <th className="py-2.5 px-3 min-w-[220px]">Title & Filename</th>
                    <th className="py-2.5 px-3 w-28">Type</th>
                    <th className="py-2.5 px-3 min-w-[200px]">Placement Status</th>
                    <th className="py-2.5 px-3 w-24 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {visibleItems.map(({ file, info }) => {
                    const isBlockedInTopic = info.status === 'in-selected-topic'
                    const isReusedInOther = info.status === 'in-other-topics'
                    const isBrandNew = info.status === 'new'

                    return (
                      <tr 
                        key={file.id} 
                        className={`hover:bg-slate-50/80 transition-colors ${
                          isBlockedInTopic 
                            ? 'bg-amber-50/30' 
                            : isReusedInOther
                            ? 'bg-indigo-50/15'
                            : !file.isSupported 
                            ? 'bg-slate-50/50 opacity-60' 
                            : ''
                        }`}
                      >
                        {/* Checkbox */}
                        <td className="py-3 px-3 text-center align-middle">
                          <input
                            type="checkbox"
                            disabled={!info.canImport}
                            checked={info.canImport && file.selected}
                            onChange={() => handleToggleSelect(file.id)}
                            className="w-4 h-4 text-teal-600 rounded border-slate-300 focus:ring-teal-500 cursor-pointer disabled:cursor-not-allowed"
                            title={
                              isBlockedInTopic 
                                ? 'Already exists in selected topic' 
                                : !file.isSupported 
                                ? 'Unsupported file format' 
                                : 'Select to import'
                            }
                          />
                        </td>

                        {/* Thumbnail or Icon */}
                        <td className="py-3 px-3 align-middle">
                          {file.fileType === 'Infographic' ? (
                            <div className="w-14 h-10 rounded-lg overflow-hidden border border-slate-200 bg-slate-100 flex items-center justify-center">
                              <img
                                src={file.downloadUrl}
                                alt={file.name}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  (e.target as HTMLElement).style.display = 'none'
                                }}
                              />
                            </div>
                          ) : file.fileType === 'PDF' ? (
                            <div className="w-14 h-10 rounded-lg border border-amber-200 bg-amber-50 text-amber-700 flex items-center justify-center">
                              <FileText className="w-5 h-5" />
                            </div>
                          ) : (
                            <div className="w-14 h-10 rounded-lg border border-slate-200 bg-slate-100 text-slate-400 flex items-center justify-center text-[10px] font-mono">
                              .{file.extension}
                            </div>
                          )}
                        </td>

                        {/* Title & Filename */}
                        <td className="py-3 px-3 align-middle space-y-1">
                          {file.isSupported ? (
                            <input
                              type="text"
                              value={file.editedTitle}
                              onChange={(e) => handleTitleChange(file.id, e.target.value)}
                              className="w-full text-xs font-bold text-slate-900 bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 focus:border-teal-600 rounded-lg p-1.5 focus:outline-hidden"
                              placeholder="Enter resource title"
                            />
                          ) : (
                            <span className="font-bold text-slate-500 block truncate max-w-sm">
                              {file.name}
                            </span>
                          )}
                          <span className="text-[11px] font-mono text-slate-400 block truncate max-w-xs">
                            {file.name} ({Math.round(file.size / 1024)} KB)
                          </span>
                        </td>

                        {/* Resource Type */}
                        <td className="py-3 px-3 align-middle">
                          {file.isSupported ? (
                            <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                              file.fileType === 'Infographic'
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                : 'bg-amber-50 text-amber-700 border-amber-200'
                            }`}>
                              {file.fileType === 'Infographic' ? (
                                <ImageIcon className="w-3 h-3 text-emerald-600" />
                              ) : (
                                <FileText className="w-3 h-3 text-amber-600" />
                              )}
                              <span>{file.fileType}</span>
                            </span>
                          ) : (
                            <span className="text-[10px] font-semibold text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                              Unsupported
                            </span>
                          )}
                        </td>

                        {/* Placement Status (Step 19C) */}
                        <td className="py-3 px-3 align-middle">
                          {isBlockedInTopic ? (
                            <div className="space-y-1">
                              <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300 px-2 py-0.5 rounded-md">
                                <AlertTriangle className="w-3 h-3 text-amber-700 shrink-0" />
                                <span>Already in selected Topic</span>
                              </span>
                              <span className="block text-[11px] text-amber-800 font-medium">
                                Exists in &ldquo;{currentSelectedTopic?.title}&rdquo; (skipped)
                              </span>
                            </div>
                          ) : isReusedInOther ? (
                            <div className="space-y-1">
                              <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-indigo-50 text-indigo-800 border border-indigo-200 px-2 py-0.5 rounded-md">
                                <Layers className="w-3 h-3 text-indigo-600 shrink-0" />
                                <span>Used in other Topics</span>
                              </span>
                              <p className="text-[11px] text-slate-600 font-medium line-clamp-2" title={info.inOtherTopics.map((p) => `${p.categoryTitle} → ${p.topicTitle}`).join(', ')}>
                                Used in: {info.inOtherTopics.map((p) => `${p.categoryTitle} → ${p.topicTitle}`).join(', ')}
                              </p>
                            </div>
                          ) : isBrandNew ? (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-md">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                              <span>New Resource</span>
                            </span>
                          ) : (
                            <span className="text-[10px] text-slate-400 font-medium">
                              Unsupported Format
                            </span>
                          )}
                        </td>

                        {/* Links Actions */}
                        <td className="py-3 px-3 align-middle text-right space-x-2">
                          <a
                            href={file.htmlUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="p-1.5 text-slate-400 hover:text-slate-700 inline-flex rounded hover:bg-slate-100"
                            title="Open original GitHub file page"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            {/* ACTION BAR: DESTINATION INFO & ACTIVE IMPORT BUTTON */}
            <div className="mt-6 pt-5 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs text-slate-700">
                  <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Target Destination:</span>
                  <span className="font-bold text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-200">
                    {currentSelectedCategory?.title || 'No Category'} &rarr; {currentSelectedTopic?.title || 'No Topic'}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500">
                  {readyToImportCount} item{readyToImportCount === 1 ? '' : 's'} ready for import. Same-topic duplicates are blocked, while cross-topic placements are fully permitted.
                </p>
              </div>

              <button
                type="button"
                disabled={readyToImportCount === 0 || isImporting || !selectedTopicId}
                onClick={handleInitiateImport}
                className="px-5 py-2.5 bg-teal-700 hover:bg-teal-800 disabled:bg-slate-300 disabled:text-slate-500 text-white rounded-xl text-xs font-bold transition-colors shadow-xs flex items-center justify-center gap-2 shrink-0 cursor-pointer disabled:cursor-not-allowed"
              >
                {isImporting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Saving Resources...</span>
                  </>
                ) : (
                  <>
                    <PlusCircle className="w-4 h-4" />
                    <span>Import {readyToImportCount} Selected Resource{readyToImportCount === 1 ? '' : 's'}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CONFIRMATION MODAL */}
      {isConfirmModalOpen && pendingImportData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div 
            className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 sm:p-7 animate-in fade-in zoom-in-95 duration-150 space-y-5"
            role="dialog"
            aria-modal="true"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-teal-50 border border-teal-100 text-teal-700">
                  <FolderGit2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-lg leading-snug">
                    Confirm Bulk Resource Import
                  </h3>
                  <span className="text-xs text-teal-700 font-semibold block">
                    Atomic Batch Save
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsConfirmModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Destination Topic Summary Card */}
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Target Category:</span>
                <span className="font-bold text-slate-800">{pendingImportData.categoryTitle}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Target Topic:</span>
                <span className="font-bold text-teal-800">{pendingImportData.topicTitle}</span>
              </div>
            </div>

            {/* Metrics Breakdown */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-950">
                <span className="block text-[10px] uppercase font-bold text-emerald-700">New Resources to Add</span>
                <span className="text-xl font-extrabold text-emerald-900">{pendingImportData.itemsToImport.length}</span>
              </div>
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-950">
                <span className="block text-[10px] uppercase font-bold text-amber-700">Same-Topic Duplicates Skipped</span>
                <span className="text-xl font-extrabold text-amber-900">{pendingImportData.duplicatesToSkip.length}</span>
              </div>
            </div>

            {/* Scrollable Preview List */}
            <div className="space-y-1.5 max-h-48 overflow-y-auto border border-slate-200 rounded-xl p-3 bg-white divide-y divide-slate-100">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Items to be created:
              </span>
              {pendingImportData.itemsToImport.map((item, idx) => (
                <div key={item.id} className="pt-1.5 pb-1 flex items-center justify-between text-xs gap-2">
                  <div className="flex items-center gap-2 truncate">
                    <span className="text-[10px] font-mono text-slate-400">#{idx + 1}</span>
                    {item.fileType === 'Infographic' ? (
                      <ImageIcon className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    ) : (
                      <FileText className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    )}
                    <span className="font-semibold text-slate-800 truncate">
                      {item.editedTitle || item.suggestedTitle}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400 shrink-0 font-mono">
                    .{item.extension}
                  </span>
                </div>
              ))}
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                disabled={isImporting}
                onClick={() => setIsConfirmModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isImporting}
                onClick={handleConfirmImport}
                className="px-5 py-2.5 text-xs font-bold text-white bg-teal-700 hover:bg-teal-800 disabled:bg-teal-400 rounded-xl transition-colors shadow-xs flex items-center gap-2"
              >
                {isImporting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Importing...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Confirm & Import ({pendingImportData.itemsToImport.length})</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
