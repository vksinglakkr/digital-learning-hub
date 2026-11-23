import React, { useState } from 'react'
import type { TutorialBlock, TutorialBlockType } from '../../../types/tutorialBuilder'
import { BLOCK_TYPE_INFOS } from '../../../types/tutorialBuilder'
import { 
  ArrowUp, 
  ArrowDown, 
  Trash2, 
  Plus, 
  Layers, 
  FileText,
  ImageIcon,
  Code,
  CheckCircle2,
  HelpCircle
} from 'lucide-react'

interface OutlineManagerProps {
  blocks: TutorialBlock[]
  onAddBlock: (type: TutorialBlockType) => void
  onDeleteBlock: (id: string) => void
  onMoveBlock: (index: number, direction: 'up' | 'down') => void
  onGoToEditBlock: (index: number) => void
}

export const OutlineManager: React.FC<OutlineManagerProps> = ({
  blocks,
  onAddBlock,
  onDeleteBlock,
  onMoveBlock,
  onGoToEditBlock,
}) => {
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null)

  const getIconForType = (type: TutorialBlockType) => {
    switch (type) {
      case 'text':
        return <FileText className="w-4 h-4 text-slate-600" />
      case 'step':
        return <Layers className="w-4 h-4 text-teal-600" />
      case 'image':
        return <ImageIcon className="w-4 h-4 text-emerald-600" />
      case 'example':
        return <Code className="w-4 h-4 text-indigo-600" />
      case 'output':
        return <CheckCircle2 className="w-4 h-4 text-amber-600" />
      case 'quiz':
        return <HelpCircle className="w-4 h-4 text-rose-600" />
      default:
        return <FileText className="w-4 h-4 text-slate-600" />
    }
  }

  const availableBlockTypes: TutorialBlockType[] = ['text', 'step', 'image', 'example', 'output', 'quiz']

  return (
    <div className="space-y-8">
      
      {/* 1. ACTUAL BLOCKS IN CURRENT TUTORIAL */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
          <div>
            <h3 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
              <span>Learning Outline</span>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-teal-50 text-teal-800 border border-teal-200">
                This Tutorial Contains {blocks.length} Learning Block{blocks.length === 1 ? '' : 's'}
              </span>
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              The high-level structural sequence of your tutorial. Use arrows to reorder.
            </p>
          </div>
        </div>

        {blocks.length === 0 ? (
          <div className="bg-slate-50 border-2 border-dashed border-slate-300 rounded-2xl p-8 text-center text-slate-500 space-y-2">
            <Layers className="w-8 h-8 text-slate-400 mx-auto" />
            <h4 className="font-bold text-slate-700 text-sm">Your tutorial outline is currently empty</h4>
            <p className="text-xs text-slate-500">
              Select one or more block types from the "Add a Learning Block" section below to begin building.
            </p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {blocks.map((block, idx) => {
              const info = BLOCK_TYPE_INFOS[block.type]
              const isDeleting = deleteConfirmId === block.id

              return (
                <div
                  key={block.id}
                  className="bg-white border border-slate-200 hover:border-slate-300 rounded-xl p-3.5 sm:p-4 shadow-2xs transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  {/* Left: Number, Badge, Title & Preview */}
                  <div className="flex items-start sm:items-center gap-3 min-w-0 flex-1">
                    <span className="w-7 h-7 rounded-full bg-slate-900 text-white text-xs font-black flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>

                    <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-0.5 rounded-full border shrink-0 ${info.badgeColor}`}>
                      {getIconForType(block.type)}
                      <span>{info.label.split('/')[0].trim()}</span>
                    </span>

                    <div className="min-w-0 flex-1">
                      <h4 className="text-sm font-bold text-slate-900 truncate">
                        {block.title || (block.type === 'step' ? `Step ${block.stepNumber || idx + 1}` : block.question || 'Untitled Block')}
                      </h4>
                      <p className="text-xs text-slate-500 truncate">
                        {block.content ? block.content.slice(0, 100) : info.oneSentenceExplanation}
                      </p>
                    </div>
                  </div>

                  {/* Right: Actions */}
                  <div className="flex items-center justify-end gap-1 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => onMoveBlock(idx, 'up')}
                      className="p-1.5 text-slate-400 hover:text-slate-700 disabled:opacity-20 disabled:pointer-events-none rounded-lg hover:bg-slate-100 transition-colors"
                      title="Move block up"
                    >
                      <ArrowUp className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      disabled={idx === blocks.length - 1}
                      onClick={() => onMoveBlock(idx, 'down')}
                      className="p-1.5 text-slate-400 hover:text-slate-700 disabled:opacity-20 disabled:pointer-events-none rounded-lg hover:bg-slate-100 transition-colors"
                      title="Move block down"
                    >
                      <ArrowDown className="w-4 h-4" />
                    </button>

                    <button
                      type="button"
                      onClick={() => onGoToEditBlock(idx)}
                      className="px-2.5 py-1 text-xs font-semibold text-teal-700 hover:text-teal-900 hover:bg-teal-50 rounded-lg transition-colors ml-1"
                    >
                      Edit Content
                    </button>

                    {isDeleting ? (
                      <div className="flex items-center gap-1 ml-2 bg-rose-50 border border-rose-200 px-2 py-1 rounded-lg">
                        <span className="text-[11px] font-bold text-rose-800">Confirm?</span>
                        <button
                          type="button"
                          onClick={() => {
                            onDeleteBlock(block.id)
                            setDeleteConfirmId(null)
                          }}
                          className="text-[11px] font-bold text-white bg-rose-600 px-1.5 py-0.5 rounded hover:bg-rose-700"
                        >
                          Yes
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteConfirmId(null)}
                          className="text-[11px] text-slate-600 hover:text-slate-900 px-1"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setDeleteConfirmId(block.id)}
                        className="p-1.5 text-slate-300 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors ml-1"
                        title="Delete block"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* 2. AVAILABLE BLOCK TYPES (EXPLICIT ADD SECTION) */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 sm:p-6 space-y-4">
        <div>
          <h4 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Plus className="w-4 h-4 text-teal-600" />
            <span>Add a Learning Block</span>
          </h4>
          <p className="text-xs text-slate-600 mt-0.5">
            Choose from the 6 available learning block types below. Each block adds one new unit to your outline.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {availableBlockTypes.map((type) => {
            const info = BLOCK_TYPE_INFOS[type]
            return (
              <div
                key={type}
                className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col justify-between hover:border-teal-300 hover:shadow-2xs transition-all"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {getIconForType(type)}
                      <span className="font-bold text-slate-900 text-xs sm:text-sm">
                        {info.label}
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed mb-4">
                    {info.oneSentenceExplanation}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => onAddBlock(type)}
                  className="w-full py-2 px-3 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold inline-flex items-center justify-center gap-1.5 transition-colors shadow-2xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add {info.label.split('/')[0].trim()}</span>
                </button>
              </div>
            )
          })}
        </div>
      </div>

    </div>
  )
}
