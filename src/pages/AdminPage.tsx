import React, { useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useLearningHub } from '../context/LearningHubContext'
import { AddResourceQuickForm } from '../components/admin/AddResourceQuickForm'
import { TopicContentStudio } from '../components/admin/TopicContentStudio'
import { PromptLibraryStudio } from '../components/admin/PromptLibraryStudio'
import { CategoryManager } from '../components/admin/CategoryManager'
import { TopicManager } from '../components/admin/TopicManager'
import { ResourceManager } from '../components/admin/ResourceManager'
import { GitHubFolderScanner } from '../components/admin/GitHubFolderScanner'
import { TutorialBuilder } from '../components/admin/tutorialBuilder/TutorialBuilder'
import { BackupRestoreModal } from '../components/admin/BackupRestoreModal'
import { PublishExportModal } from '../components/admin/PublishExportModal'
import { backupService, type LearningHubBackup } from '../services/backupService'
import { 
  generatePublishedCurriculum, 
  downloadPublishedCurriculum, 
  type PublishedCurriculumResult 
} from '../services/publishingService'
import { 
  ShieldAlert, 
  ArrowLeft, 
  RotateCcw, 
  Layers, 
  BookOpen, 
  PlusCircle, 
  Database,
  ExternalLink,
  CheckCircle2,
  Download,
  Upload,
  History,
  AlertTriangle,
  FolderGit2,
  Globe,
  Sparkles,
  Terminal,
  X
} from 'lucide-react'

type AdminTab = 'content-studio' | 'prompt-library' | 'quick-add' | 'bulk-import' | 'resources' | 'topics' | 'categories' | 'tutorial-builder'

export const AdminPage: React.FC = () => {
  const { 
    categories, 
    topics, 
    resetDemoData,
    exportBackup,
    importBackupData,
    safetySnapshot,
    restoreSafetySnapshot
  } = useLearningHub()
  const [activeTab, setActiveTab] = useState<AdminTab>('content-studio')
  const [showResetConfirm, setShowResetConfirm] = useState(false)
  const [resetNotice, setResetNotice] = useState(false)

  // Backup & Restore State
  const [pendingBackup, setPendingBackup] = useState<LearningHubBackup | null>(null)
  const [isRestoreModalOpen, setIsRestoreModalOpen] = useState(false)
  const [validationError, setValidationError] = useState<string | null>(null)
  const [actionNotice, setActionNotice] = useState<{ type: 'success' | 'info'; message: string } | null>(null)
  const [showSafetyRevertConfirm, setShowSafetyRevertConfirm] = useState(false)

  // Step 20C: Publish Export State
  const [publishValidationResult, setPublishValidationResult] = useState<PublishedCurriculumResult | null>(null)
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false)

  const fileInputRef = useRef<HTMLInputElement>(null)

  // Compute total resources across all topics
  const totalResourcesCount = topics.reduce((acc, t) => acc + t.resources.length, 0)

  const handleResetConfirm = () => {
    resetDemoData()
    setShowResetConfirm(false)
    setResetNotice(true)
    setTimeout(() => setResetNotice(false), 4000)
  }

  const handleExportBackup = () => {
    exportBackup()
    setActionNotice({
      type: 'success',
      message: `Export completed: Saved full curriculum backup (${categories.length} categories, ${topics.length} topics, ${totalResourcesCount} resources) as JSON.`,
    })
    setTimeout(() => setActionNotice(null), 5000)
  }

  // Step 20C: Initiate Publish Export using CURRENT in-memory working data
  const handleInitiatePublishExport = () => {
    const result = generatePublishedCurriculum(categories, topics)
    setPublishValidationResult(result)
    setIsPublishModalOpen(true)
  }

  const handleConfirmPublishDownload = () => {
    if (!publishValidationResult?.publishedPayload) return
    downloadPublishedCurriculum(publishValidationResult.publishedPayload)
    setActionNotice({
      type: 'info',
      message: 'JSON downloaded — GitHub upload/commit still required to update the live website.',
    })
    setTimeout(() => setActionNotice(null), 7000)
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      const content = event.target?.result as string
      const result = backupService.validateBackupJson(content)
      if (!result.isValid || !result.backup) {
        setValidationError(result.error || 'Failed to validate backup file.')
      } else {
        setPendingBackup(result.backup)
        setIsRestoreModalOpen(true)
      }
    }
    reader.onerror = () => {
      setValidationError('Could not read the selected file. Please verify file permissions.')
    }
    reader.readAsText(file)

    // Reset input so same file can be re-selected if needed
    e.target.value = ''
  }

  const handleConfirmRestore = () => {
    if (!pendingBackup) return
    const sum = pendingBackup.summary
    importBackupData(pendingBackup)
    setIsRestoreModalOpen(false)
    setPendingBackup(null)
    setActionNotice({
      type: 'success',
      message: `Curriculum restored successfully! Loaded ${sum.categoryCount} categories, ${sum.topicCount} topics, and ${sum.resourceCount} resources. A safety snapshot of your previous data was saved.`,
    })
    setTimeout(() => setActionNotice(null), 6000)
  }

  const handleRevertSafetySnapshot = () => {
    const success = restoreSafetySnapshot()
    setShowSafetyRevertConfirm(false)
    if (success) {
      setActionNotice({
        type: 'info',
        message: 'Reverted to previous safety snapshot successfully.',
      })
      setTimeout(() => setActionNotice(null), 5000)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50/60 text-slate-900 font-sans">
      {/* Top Warning / Safety Banner */}
      <div className="bg-amber-500/10 border-b border-amber-500/20 text-amber-900 py-2.5 px-4 text-xs">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
            <span>
              <strong>LOCAL DEMO ADMIN:</strong> Changes are saved in your browser's LocalStorage only. No external database or authentication credentials are required or exposed.
            </span>
          </div>
          <span className="text-[11px] font-semibold text-amber-700 bg-amber-100 px-2.5 py-0.5 rounded-full shrink-0">
            Local Prototype Studio
          </span>
        </div>
      </div>

      {/* Main Admin Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            
            <div className="flex items-center gap-4">
              <Link
                to="/"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-teal-700 p-2 rounded-lg hover:bg-slate-50 transition-colors"
                title="Return to Public Educational Portal"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Exit to Portal</span>
              </Link>

              <div className="h-6 w-px bg-slate-200 hidden sm:block" />

              <div>
                <h1 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                  <span>Digital Learning Hub Studio</span>
                  <span className="text-[10px] uppercase font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-100">
                    Admin
                  </span>
                </h1>
                <p className="text-xs text-slate-400 hidden sm:block">
                  Curate learning resources, reorder modules, and publish educational guides.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              {/* Step 20C: Export for Publishing Button */}
              <button
                type="button"
                onClick={handleInitiatePublishExport}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-teal-700 hover:bg-teal-800 rounded-lg shadow-2xs transition-colors cursor-pointer"
                title="Export curriculum.json for public website release"
              >
                <Globe className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Export for Publishing</span>
                <span className="sm:hidden">Publish</span>
              </button>

              {/* Export Backup Button */}
              <button
                type="button"
                onClick={handleExportBackup}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg transition-colors shadow-2xs"
                title="Export full curriculum JSON backup"
              >
                <Download className="w-3.5 h-3.5 text-teal-700" />
                <span className="hidden lg:inline">Export Backup</span>
                <span className="lg:hidden">Backup</span>
              </button>

              {/* Import Backup Button */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg transition-colors shadow-2xs"
                title="Import and restore from backup file"
              >
                <Upload className="w-3.5 h-3.5 text-teal-700" />
                <span className="hidden lg:inline">Import Backup</span>
                <span className="lg:hidden">Import</span>
              </button>

              <input
                ref={fileInputRef}
                type="file"
                accept=".json,application/json"
                onChange={handleFileSelect}
                className="hidden"
              />

              <button
                type="button"
                onClick={() => setShowResetConfirm(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                title="Restore default mock dataset"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="hidden xl:inline">Reset Demo Data</span>
              </button>

              <Link
                to="/"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-xs transition-colors"
              >
                <span>Live Portal View</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>

          </div>

          {/* Navigation Tabs Bar */}
          <div className="flex items-center gap-2 -mb-px overflow-x-auto text-xs font-semibold">
            <button
              onClick={() => setActiveTab('content-studio')}
              className={`flex items-center gap-2 py-3 px-3.5 border-b-2 transition-all whitespace-nowrap ${
                activeTab === 'content-studio'
                  ? 'border-teal-600 text-teal-800 font-bold'
                  : 'border-transparent text-slate-500 hover:text-slate-900 hover:border-slate-300'
              }`}
            >
              <Sparkles className="w-4 h-4 text-teal-600" />
              <span>Topic Content Studio</span>
              <span className="text-[10px] bg-teal-100 text-teal-800 font-bold px-1.5 py-0.5 rounded-full">Primary</span>
            </button>

            <button
              onClick={() => setActiveTab('prompt-library')}
              className={`flex items-center gap-2 py-3 px-3.5 border-b-2 transition-all whitespace-nowrap ${
                activeTab === 'prompt-library'
                  ? 'border-teal-600 text-teal-800 font-bold'
                  : 'border-transparent text-slate-500 hover:text-slate-900 hover:border-slate-300'
              }`}
            >
              <Terminal className="w-4 h-4 text-teal-600" />
              <span>Prompt Library</span>
              <span className="text-[10px] bg-teal-50 text-teal-700 font-bold px-1.5 py-0.5 rounded-full border border-teal-200">Pilot V1</span>
            </button>

            <button
              onClick={() => setActiveTab('topics')}
              className={`flex items-center gap-2 py-3 px-3.5 border-b-2 transition-all whitespace-nowrap ${
                activeTab === 'topics'
                  ? 'border-teal-600 text-teal-800 font-bold'
                  : 'border-transparent text-slate-500 hover:text-slate-900 hover:border-slate-300'
              }`}
            >
              <BookOpen className="w-4 h-4 text-teal-600" />
              <span>All Topics ({topics.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('resources')}
              className={`flex items-center gap-2 py-3 px-3.5 border-b-2 transition-all whitespace-nowrap ${
                activeTab === 'resources'
                  ? 'border-teal-600 text-teal-800 font-bold'
                  : 'border-transparent text-slate-500 hover:text-slate-900 hover:border-slate-300'
              }`}
            >
              <Database className="w-4 h-4 text-teal-600" />
              <span>All Resources ({totalResourcesCount})</span>
            </button>

            <button
              onClick={() => setActiveTab('categories')}
              className={`flex items-center gap-2 py-3 px-3.5 border-b-2 transition-all whitespace-nowrap ${
                activeTab === 'categories'
                  ? 'border-teal-600 text-teal-800 font-bold'
                  : 'border-transparent text-slate-500 hover:text-slate-900 hover:border-slate-300'
              }`}
            >
              <Layers className="w-4 h-4 text-teal-600" />
              <span>Categories ({categories.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('bulk-import')}
              className={`flex items-center gap-2 py-3 px-3.5 border-b-2 transition-all whitespace-nowrap ${
                activeTab === 'bulk-import'
                  ? 'border-teal-600 text-teal-800 font-bold'
                  : 'border-transparent text-slate-500 hover:text-slate-900 hover:border-slate-300'
              }`}
            >
              <FolderGit2 className="w-4 h-4 text-teal-600" />
              <span>Bulk GitHub Import</span>
            </button>

            <button
              onClick={() => setActiveTab('quick-add')}
              className={`flex items-center gap-2 py-3 px-3.5 border-b-2 transition-all whitespace-nowrap ${
                activeTab === 'quick-add'
                  ? 'border-teal-600 text-teal-800 font-bold'
                  : 'border-transparent text-slate-500 hover:text-slate-900 hover:border-slate-300'
              }`}
            >
              <PlusCircle className="w-4 h-4 text-teal-600" />
              <span>Quick Add Single</span>
            </button>

            <button
              onClick={() => setActiveTab('tutorial-builder')}
              className={`flex items-center gap-2 py-3 px-3.5 border-b-2 transition-all whitespace-nowrap ${
                activeTab === 'tutorial-builder'
                  ? 'border-indigo-600 text-indigo-800 font-bold'
                  : 'border-transparent text-slate-500 hover:text-slate-900 hover:border-slate-300'
              }`}
            >
              <Sparkles className="w-4 h-4 text-indigo-500" />
              <span>Tutorial Builder</span>
              <span className="text-[10px] bg-indigo-50 text-indigo-700 font-bold px-1.5 py-0.5 rounded-full border border-indigo-200">Experimental</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Body */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        
        {/* Action Notice (Export / Restore Success) */}
        {actionNotice && (
          <div className={`p-4 rounded-xl text-xs flex items-center justify-between gap-3 font-medium animate-in fade-in duration-150 ${
            actionNotice.type === 'success'
              ? 'bg-emerald-50 border border-emerald-200 text-emerald-900'
              : 'bg-teal-50 border border-teal-200 text-teal-900'
          }`}>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{actionNotice.message}</span>
            </div>
            <button
              type="button"
              onClick={() => setActionNotice(null)}
              className="text-slate-400 hover:text-slate-600 p-1"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Step 20C: Publishing Workflow Card */}
        <div className="bg-white border border-teal-200/80 rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-200 text-teal-800 flex items-center justify-center shrink-0">
              <Globe className="w-5 h-5 text-teal-700" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-slate-900">Publish Curriculum to Website</h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-50 text-teal-800 border border-teal-200">
                  Release Ready
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-0.5">
                Download <code className="font-mono text-teal-900 bg-teal-50 px-1 py-0.5 rounded font-semibold">curriculum.json</code>, then replace <code className="font-mono text-slate-700 bg-slate-100 px-1 py-0.5 rounded">public/data/curriculum.json</code> in the GitHub repository and commit to publish.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleInitiatePublishExport}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-teal-700 hover:bg-teal-800 rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Export for Publishing</span>
            </button>
          </div>
        </div>

        {/* Safety Snapshot Bar if available */}
        {safetySnapshot && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3.5 bg-slate-100/90 border border-slate-200 rounded-xl text-xs text-slate-700">
            <div className="flex items-center gap-2">
              <History className="w-4 h-4 text-teal-700 shrink-0" />
              <span>
                Safety snapshot available from <strong>{new Date(safetySnapshot.savedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</strong> ({safetySnapshot.summary.categoryCount} categories, {safetySnapshot.summary.topicCount} topics, {safetySnapshot.summary.resourceCount} resources).
              </span>
            </div>
            <button
              type="button"
              onClick={() => setShowSafetyRevertConfirm(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1 bg-white hover:bg-slate-200 text-slate-800 border border-slate-300 rounded-lg text-xs font-semibold transition-colors shrink-0 shadow-2xs"
            >
              <RotateCcw className="w-3 h-3 text-slate-600" />
              <span>Revert to Safety Snapshot</span>
            </button>
          </div>
        )}

        {/* Reset Confirmation Banner */}
        {resetNotice && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center gap-2 font-medium">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Success: All categories, topics, and sample resources have been reset to factory demo values.</span>
          </div>
        )}

        {/* Quick Storage Info Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="bg-white border border-slate-200 rounded-xl p-3.5">
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Categories</span>
            <span className="text-lg font-bold text-slate-900">{categories.length}</span>
          </div>
          <div className="bg-white border border-slate-200 rounded-xl p-3.5">
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Topics</span>
            <span className="text-lg font-bold text-slate-900">{topics.length}</span>
          </div>
          <div className="bg-white border border-slate-200 rounded-xl p-3.5">
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Total Resources</span>
            <span className="text-lg font-bold text-slate-900">{totalResourcesCount}</span>
          </div>
          <div className="bg-white border border-slate-200 rounded-xl p-3.5">
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Persistence</span>
            <span className="text-xs font-semibold text-teal-700">Browser LocalStorage</span>
          </div>
        </div>

        {/* Active Tab Component */}
        {activeTab === 'content-studio' && <TopicContentStudio />}
        {activeTab === 'prompt-library' && <PromptLibraryStudio />}
        {activeTab === 'quick-add' && <AddResourceQuickForm onSaved={() => {}} />}
        {activeTab === 'bulk-import' && <GitHubFolderScanner />}
        {activeTab === 'resources' && <ResourceManager />}
        {activeTab === 'topics' && <TopicManager />}
        {activeTab === 'categories' && <CategoryManager />}
        {activeTab === 'tutorial-builder' && <TutorialBuilder />}

      </main>

      {/* Backup & Restore Review Modal */}
      <BackupRestoreModal
        isOpen={isRestoreModalOpen}
        backup={pendingBackup}
        currentCounts={{
          categoryCount: categories.length,
          topicCount: topics.length,
          resourceCount: totalResourcesCount,
        }}
        onConfirm={handleConfirmRestore}
        onCancel={() => {
          setIsRestoreModalOpen(false)
          setPendingBackup(null)
        }}
      />

      {/* Validation Error Modal */}
      {validationError && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div 
            className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-rose-200 p-6 animate-in fade-in zoom-in-95 duration-150"
            role="dialog"
            aria-modal="true"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 rounded-xl bg-rose-50 text-rose-600 border border-rose-100">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base">Invalid Backup File</h3>
                <span className="text-xs text-rose-700 font-medium">Validation Check Failed</span>
              </div>
            </div>

            <p className="text-xs text-slate-600 mb-6 leading-relaxed">
              {validationError}
            </p>

            <div className="flex justify-end pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setValidationError(null)}
                className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Revert Safety Snapshot Confirmation Modal */}
      {showSafetyRevertConfirm && safetySnapshot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div 
            className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 animate-in fade-in zoom-in-95 duration-150"
            role="dialog"
            aria-modal="true"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 rounded-xl bg-teal-50 text-teal-700 border border-teal-100">
                <History className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base">Revert to Safety Snapshot?</h3>
                <span className="text-xs text-teal-700 font-medium">
                  Recorded at {new Date(safetySnapshot.savedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-600 mb-6 leading-relaxed">
              This will restore your local curriculum back to the automatic snapshot saved right before the last import ({safetySnapshot.summary.categoryCount} categories, {safetySnapshot.summary.topicCount} topics, {safetySnapshot.summary.resourceCount} resources).
            </p>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowSafetyRevertConfirm(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleRevertSafetySnapshot}
                className="px-4 py-2 text-xs font-bold text-white bg-teal-700 hover:bg-teal-800 rounded-lg transition-colors shadow-xs"
              >
                Yes, Revert Data
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reset Confirmation Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div 
            className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 animate-in fade-in zoom-in-95 duration-150"
            role="dialog"
            aria-modal="true"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 rounded-xl bg-amber-50 text-amber-600 border border-amber-100">
                <RotateCcw className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base">Reset Demo Data?</h3>
                <span className="text-xs text-amber-700 font-medium">Reverts to original sample content</span>
              </div>
            </div>

            <p className="text-xs text-slate-600 mb-6 leading-relaxed">
              This will discard all local categories, topics, and custom resources you added in this browser and restore the default demo records (including Power BI Drill Through, n8n, Excel, etc.).
            </p>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowResetConfirm(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleResetConfirm}
                className="px-4 py-2 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-lg transition-colors shadow-xs"
              >
                Yes, Reset All
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Step 20C: Publish Export Modal */}
      <PublishExportModal
        isOpen={isPublishModalOpen}
        onClose={() => setIsPublishModalOpen(false)}
        validationResult={publishValidationResult}
        onDownload={handleConfirmPublishDownload}
      />
    </div>
  )
}

