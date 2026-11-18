import React, { useState } from 'react'
import type { PublishedCurriculumResult } from '../../services/publishingService'
import { 
  Globe, 
  X, 
  Download, 
  AlertTriangle, 
  CheckCircle2, 
  FileText, 
  Image as ImageIcon, 
  Video, 
  BookOpen, 
  Info,
  Loader2
} from 'lucide-react'

interface PublishExportModalProps {
  isOpen: boolean
  onClose: () => void
  validationResult: PublishedCurriculumResult | null
  onDownload: () => void
}

export const PublishExportModal: React.FC<PublishExportModalProps> = ({
  isOpen,
  onClose,
  validationResult,
  onDownload,
}) => {
  const [isDownloading, setIsDownloading] = useState(false)
  const [downloadSuccess, setDownloadSuccess] = useState(false)
  const [prevIsOpen, setPrevIsOpen] = useState(isOpen)

  // Reset download state during render when modal opens
  if (prevIsOpen !== isOpen) {
    setPrevIsOpen(isOpen)
    if (isOpen) {
      setIsDownloading(false)
      setDownloadSuccess(false)
    }
  }

  if (!isOpen || !validationResult) return null

  const { isValid, errors, warnings, publishedPayload } = validationResult
  const summary = publishedPayload?.summary

  const handleDownloadClick = () => {
    if (isDownloading) return
    setIsDownloading(true)
    try {
      onDownload()
      setDownloadSuccess(true)
    } finally {
      setIsDownloading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        className="w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="publish-modal-title"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl ${isValid ? 'bg-teal-50 border border-teal-200 text-teal-700' : 'bg-rose-50 border border-rose-200 text-rose-700'}`}>
              {isValid ? <Globe className="w-5 h-5 text-teal-700" /> : <AlertTriangle className="w-5 h-5 text-rose-600" />}
            </div>
            <div>
              <h2 id="publish-modal-title" className="text-base font-bold text-slate-900 flex items-center gap-2">
                <span>Export for Publishing</span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${isValid ? 'bg-teal-100 text-teal-800' : 'bg-rose-100 text-rose-800'}`}>
                  {isValid ? 'curriculum.json' : 'Validation Error'}
                </span>
              </h2>
              <p className="text-xs text-slate-500">
                {isValid ? 'Ready to generate official public website dataset' : 'Errors must be resolved before publishing'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          
          {/* VALIDATION FAILED VIEW */}
          {!isValid && (
            <div className="space-y-4">
              <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-900 text-xs space-y-2">
                <div className="flex items-center gap-2 font-bold text-rose-800 text-sm">
                  <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>Validation Blocked Export</span>
                </div>
                <p>
                  The current working curriculum contains formatting errors that would corrupt the public website. Please fix the following issues in Admin Studio before exporting:
                </p>
              </div>

              <div className="border border-rose-200 bg-white rounded-xl p-4 max-h-56 overflow-y-auto space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-rose-700 block">
                  Detected Errors ({errors.length}):
                </span>
                <ul className="space-y-1.5 text-xs text-slate-700 list-disc list-inside">
                  {errors.map((err, i) => (
                    <li key={i} className="text-rose-950 font-medium">
                      {err}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-500 flex items-center gap-2">
                <Info className="w-4 h-4 text-slate-400 shrink-0" />
                <span>No existing working data or browser files were modified.</span>
              </div>
            </div>
          )}

          {/* VALIDATION PASSED VIEW */}
          {isValid && summary && (
            <div className="space-y-5">
              
              {/* Instructions banner */}
              <div className="p-4 bg-teal-50 border border-teal-200/80 rounded-xl text-xs text-teal-950 space-y-1.5">
                <strong className="block font-bold text-teal-900">
                  Publication Workflow Instruction:
                </strong>
                <p className="leading-relaxed">
                  Download <code className="font-mono bg-white px-1.5 py-0.5 rounded border border-teal-200 text-teal-800 font-bold">curriculum.json</code>, then replace <code className="font-mono bg-white px-1.5 py-0.5 rounded border border-teal-200 text-slate-700">public/data/curriculum.json</code> in your GitHub repository and commit to publish.
                </p>
              </div>

              {/* Status Notice if already downloaded */}
              {downloadSuccess && (
                <div className="p-3.5 bg-emerald-50 border border-emerald-300 rounded-xl text-xs text-emerald-950 flex items-start gap-2.5 animate-in fade-in duration-150">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block font-bold">JSON downloaded successfully!</strong>
                    <span className="text-emerald-800">
                      GitHub upload/commit still required to update the live public website.
                    </span>
                  </div>
                </div>
              )}

              {/* Summary Metrics Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                  <span className="block text-[10px] uppercase font-bold text-slate-400">Categories</span>
                  <span className="text-xl font-extrabold text-slate-900">{summary.categoryCount}</span>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                  <span className="block text-[10px] uppercase font-bold text-slate-400">Topics</span>
                  <span className="text-xl font-extrabold text-slate-900">{summary.topicCount}</span>
                </div>

                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
                  <span className="block text-[10px] uppercase font-bold text-emerald-700">Published Resources</span>
                  <span className="text-xl font-extrabold text-emerald-900">{summary.publishedResourceCount}</span>
                </div>

                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl">
                  <span className="block text-[10px] uppercase font-bold text-amber-700">Drafts Excluded</span>
                  <span className="text-xl font-extrabold text-amber-900">{summary.excludedDraftCount}</span>
                </div>

                <div className="p-3 bg-slate-100 border border-slate-200 rounded-xl">
                  <span className="block text-[10px] uppercase font-bold text-slate-500">Hidden Excluded</span>
                  <span className="text-xl font-extrabold text-slate-700">{summary.excludedHiddenCount}</span>
                </div>

                <div className="p-3 bg-teal-50 border border-teal-200 rounded-xl">
                  <span className="block text-[10px] uppercase font-bold text-teal-700">Video Clips</span>
                  <span className="text-xl font-extrabold text-teal-900">{summary.clipCount}</span>
                </div>
              </div>

              {/* Breakdown by resource formats */}
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Format Breakdown in Published Payload:
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] font-medium text-slate-700">
                  <div className="flex items-center gap-1.5">
                    <Video className="w-3.5 h-3.5 text-rose-600" />
                    <span>{summary.videoCount} Videos</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <ImageIcon className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{summary.infographicCount} Infographics</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-amber-600" />
                    <span>{summary.pdfCount} PDFs</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
                    <span>{summary.tutorialCount} Tutorials</span>
                  </div>
                </div>
              </div>

              {warnings.length > 0 && (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-[11px] text-amber-900 space-y-1">
                  <span className="font-bold block">Notices ({warnings.length}):</span>
                  <ul className="list-disc list-inside space-y-0.5">
                    {warnings.map((w, i) => (
                      <li key={i}>{w}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl transition-colors"
          >
            {downloadSuccess ? 'Close' : 'Cancel'}
          </button>

          {isValid ? (
            <button
              type="button"
              disabled={isDownloading}
              onClick={handleDownloadClick}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-teal-700 hover:bg-teal-800 disabled:bg-slate-300 disabled:text-slate-500 rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              {isDownloading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Preparing Download...</span>
                </>
              ) : downloadSuccess ? (
                <>
                  <Download className="w-4 h-4" />
                  <span>Download Again</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>Download curriculum.json</span>
                </>
              )}
            </button>
          ) : (
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-colors"
            >
              Dismiss
            </button>
          )}
        </div>

      </div>
    </div>
  )
}
