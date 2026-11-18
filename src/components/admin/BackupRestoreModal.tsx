import React from 'react'
import { 
  FileCheck, 
  AlertTriangle, 
  ShieldCheck, 
  X, 
  Layers, 
  BookOpen, 
  Database, 
  Video as VideoIcon, 
  Scissors, 
  Calendar,
  Code2
} from 'lucide-react'
import type { LearningHubBackup } from '../../services/backupService'

interface BackupRestoreModalProps {
  isOpen: boolean
  backup: LearningHubBackup | null
  currentCounts: {
    categoryCount: number
    topicCount: number
    resourceCount: number
  }
  onConfirm: () => void
  onCancel: () => void
}

export const BackupRestoreModal: React.FC<BackupRestoreModalProps> = ({
  isOpen,
  backup,
  currentCounts,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen || !backup) return null

  const summary = backup.summary
  const formattedDate = new Date(backup.exportDate).toLocaleString(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  })

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div 
        className="w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 sm:p-7 animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-teal-50 text-teal-700 border border-teal-200">
              <FileCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-lg">Review & Restore Backup</h3>
              <p className="text-xs text-slate-500">
                Validate record counts and confirm replacement of local curriculum.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onCancel}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* File Metadata Overview */}
        <div className="my-5 p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-2 text-slate-700">
          <div className="flex items-center justify-between">
            <span className="text-slate-500 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-teal-600" />
              <span>Backup Timestamp:</span>
            </span>
            <span className="font-bold text-slate-900">{formattedDate}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-500 flex items-center gap-1.5">
              <Code2 className="w-3.5 h-3.5 text-teal-600" />
              <span>Schema Version:</span>
            </span>
            <span className="font-mono bg-white px-1.5 py-0.5 rounded border border-slate-200 text-slate-800 font-semibold">
              v{backup.schemaVersion}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-500">Application Origin:</span>
            <span className="font-semibold text-teal-800">{backup.app}</span>
          </div>
        </div>

        {/* Summary Comparison Grid */}
        <div className="mb-5 space-y-3">
          <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Record Counts Comparison
          </h4>

          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="p-3 bg-white border border-slate-200 rounded-xl">
              <div className="flex items-center justify-center gap-1 text-[11px] font-bold text-slate-500 mb-1">
                <Layers className="w-3.5 h-3.5 text-teal-600" />
                <span>Categories</span>
              </div>
              <div className="text-base font-extrabold text-slate-900">
                {summary.categoryCount}
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">
                Current: {currentCounts.categoryCount}
              </div>
            </div>

            <div className="p-3 bg-white border border-slate-200 rounded-xl">
              <div className="flex items-center justify-center gap-1 text-[11px] font-bold text-slate-500 mb-1">
                <BookOpen className="w-3.5 h-3.5 text-teal-600" />
                <span>Topics</span>
              </div>
              <div className="text-base font-extrabold text-slate-900">
                {summary.topicCount}
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">
                Current: {currentCounts.topicCount}
              </div>
            </div>

            <div className="p-3 bg-white border border-slate-200 rounded-xl">
              <div className="flex items-center justify-center gap-1 text-[11px] font-bold text-slate-500 mb-1">
                <Database className="w-3.5 h-3.5 text-teal-600" />
                <span>Resources</span>
              </div>
              <div className="text-base font-extrabold text-slate-900">
                {summary.resourceCount}
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">
                Current: {currentCounts.resourceCount}
              </div>
            </div>
          </div>

          {/* Granular Breakdown */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 text-[11px] text-slate-600 space-y-1.5">
            <span className="font-bold text-slate-700 block text-xs">Included Resource Formats:</span>
            <div className="flex flex-wrap gap-2 pt-0.5">
              <span className="inline-flex items-center gap-1 bg-white px-2 py-0.5 rounded-md border border-slate-200 font-medium">
                <VideoIcon className="w-3 h-3 text-rose-600" />
                <span>{summary.videoCount} Videos</span>
              </span>
              {summary.clipCount > 0 && (
                <span className="inline-flex items-center gap-1 bg-rose-50 text-rose-800 px-2 py-0.5 rounded-md border border-rose-200 font-semibold">
                  <Scissors className="w-3 h-3 text-rose-600" />
                  <span>{summary.clipCount} with Clip Timestamps</span>
                </span>
              )}
              <span className="bg-white px-2 py-0.5 rounded-md border border-slate-200 font-medium">
                {summary.infographicCount} Infographics
              </span>
              <span className="bg-white px-2 py-0.5 rounded-md border border-slate-200 font-medium">
                {summary.pdfCount} PDFs
              </span>
              <span className="bg-white px-2 py-0.5 rounded-md border border-slate-200 font-medium">
                {summary.tutorialCount} Tutorials
              </span>
            </div>
          </div>
        </div>

        {/* Automatic Safety Backup Notice */}
        <div className="mb-5 p-3.5 bg-emerald-50/70 border border-emerald-200 rounded-xl text-xs text-emerald-900 flex items-start gap-2.5">
          <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <span className="font-bold block">Automatic Safety Snapshot Guaranteed</span>
            <span>
              Before replacing your data, the system will automatically create a temporary safety snapshot of your current local categories and topics. You can revert if needed.
            </span>
          </div>
        </div>

        {/* Warning Callout */}
        <div className="mb-6 p-3 bg-amber-50/80 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold block">Replacement Confirmation</span>
            <span>
              Restoring this backup will replace current in-browser curriculum records with the records from the file.
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="px-5 py-2 text-xs font-bold text-white bg-teal-700 hover:bg-teal-800 rounded-xl transition-colors shadow-xs"
          >
            Confirm &amp; Restore Backup
          </button>
        </div>
      </div>
    </div>
  )
}

