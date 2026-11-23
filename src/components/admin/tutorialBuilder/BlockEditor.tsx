import React, { useRef } from 'react'
import type { TutorialBlock, TutorialBlockType } from '../../../types/tutorialBuilder'
import { 
  ArrowUp, 
  ArrowDown, 
  Trash2, 
  Image as ImageIcon, 
  Upload, 
  Lightbulb, 
  CheckCircle2, 
  Code, 
  FileText, 
  Layers, 
  HelpCircle,
  Eye
} from 'lucide-react'

interface BlockEditorProps {
  block: TutorialBlock
  index: number
  totalBlocks: number
  onUpdateBlock: (updated: TutorialBlock) => void
  onDeleteBlock: (id: string) => void
  onMoveBlock: (index: number, direction: 'up' | 'down') => void
  onPreviewImage?: (src: string) => void
}

export const BlockEditor: React.FC<BlockEditorProps> = ({
  block,
  index,
  totalBlocks,
  onUpdateBlock,
  onDeleteBlock,
  onMoveBlock,
  onPreviewImage,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string
      onUpdateBlock({ ...block, imageUrl: dataUrl })
    }
    reader.readAsDataURL(file)
  }

  const getBlockBadge = (type: TutorialBlockType) => {
    switch (type) {
      case 'text':
        return { label: 'Text / Explanation', color: 'bg-slate-100 text-slate-700 border-slate-200', icon: FileText }
      case 'step':
        return { label: 'Step Instruction', color: 'bg-teal-50 text-teal-800 border-teal-200', icon: Layers }
      case 'image':
        return { label: 'Image / Diagram', color: 'bg-emerald-50 text-emerald-800 border-emerald-200', icon: ImageIcon }
      case 'example':
        return { label: 'Sample Data / Code', color: 'bg-indigo-50 text-indigo-800 border-indigo-200', icon: Code }
      case 'output':
        return { label: 'Expected Output', color: 'bg-amber-50 text-amber-800 border-amber-200', icon: CheckCircle2 }
      case 'quiz':
        return { label: 'Practice Question', color: 'bg-rose-50 text-rose-800 border-rose-200', icon: HelpCircle }
      default:
        return { label: 'Learning Block', color: 'bg-slate-100 text-slate-700 border-slate-200', icon: FileText }
    }
  }

  const badge = getBlockBadge(block.type)
  const Icon = badge.icon

  return (
    <div className="bg-white border border-slate-200 hover:border-slate-300 rounded-2xl p-5 shadow-xs transition-all space-y-4">
      {/* Block Header Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-slate-900 text-white text-xs font-bold flex items-center justify-center">
            {index + 1}
          </span>
          <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-0.5 rounded-full border ${badge.color}`}>
            <Icon className="w-3.5 h-3.5" />
            <span>{badge.label}</span>
          </span>
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            disabled={index === 0}
            onClick={() => onMoveBlock(index, 'up')}
            className="p-1.5 text-slate-400 hover:text-slate-700 disabled:opacity-30 disabled:pointer-events-none rounded-lg hover:bg-slate-100 transition-colors"
            title="Move block up"
          >
            <ArrowUp className="w-4 h-4" />
          </button>
          <button
            type="button"
            disabled={index === totalBlocks - 1}
            onClick={() => onMoveBlock(index, 'down')}
            className="p-1.5 text-slate-400 hover:text-slate-700 disabled:opacity-30 disabled:pointer-events-none rounded-lg hover:bg-slate-100 transition-colors"
            title="Move block down"
          >
            <ArrowDown className="w-4 h-4" />
          </button>
          <div className="w-px h-4 bg-slate-200 mx-1" />
          <button
            type="button"
            onClick={() => onDeleteBlock(block.id)}
            className="p-1.5 text-rose-500 hover:text-rose-700 rounded-lg hover:bg-rose-50 transition-colors"
            title="Delete this block"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Common Title Field */}
      <div>
        <label className="block text-xs font-bold text-slate-700 mb-1">
          {block.type === 'step' ? 'Step Title' : 'Block Heading (Optional)'}
        </label>
        <input
          type="text"
          value={block.title || ''}
          onChange={(e) => onUpdateBlock({ ...block, title: e.target.value })}
          placeholder={block.type === 'step' ? 'e.g., Configure Color Scale Rules' : 'e.g., Executive Overview'}
          className="w-full text-xs sm:text-sm px-3 py-2 border border-slate-300 rounded-xl focus:outline-hidden focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
        />
      </div>

      {/* Block-Type Specific Fields */}
      {block.type === 'text' && (
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Explanation / Instructional Prose
          </label>
          <textarea
            rows={4}
            value={block.content || ''}
            onChange={(e) => onUpdateBlock({ ...block, content: e.target.value })}
            placeholder="Explain the concept clearly using simple language. Supports **bold** and bullet points (•)."
            className="w-full text-xs sm:text-sm px-3 py-2 border border-slate-300 rounded-xl focus:outline-hidden focus:border-teal-500 focus:ring-1 focus:ring-teal-500 leading-relaxed"
          />
        </div>
      )}

      {block.type === 'step' && (
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Step Instruction
            </label>
            <textarea
              rows={4}
              value={block.content || ''}
              onChange={(e) => onUpdateBlock({ ...block, content: e.target.value })}
              placeholder="1. Click Format Pane > Expand Cell Elements > Select Rule..."
              className="w-full text-xs sm:text-sm px-3 py-2 border border-slate-300 rounded-xl focus:outline-hidden focus:border-teal-500 focus:ring-1 focus:ring-teal-500 leading-relaxed"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                <span>Pro Tip (Optional)</span>
              </label>
              <input
                type="text"
                value={block.tip || ''}
                onChange={(e) => onUpdateBlock({ ...block, tip: e.target.value })}
                placeholder="e.g. Always check high contrast readability."
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded-xl focus:outline-hidden focus:border-teal-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" />
                <span>Expected Result (Optional)</span>
              </label>
              <input
                type="text"
                value={block.expectedResult || ''}
                onChange={(e) => onUpdateBlock({ ...block, expectedResult: e.target.value })}
                placeholder="e.g. Dialog opens with min/max rules."
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded-xl focus:outline-hidden focus:border-teal-500"
              />
            </div>
          </div>

          {/* Screenshot Upload for Step */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center justify-between">
              <span>Step Screenshot (Optional)</span>
              {block.imageUrl && (
                <button
                  type="button"
                  onClick={() => onUpdateBlock({ ...block, imageUrl: undefined, caption: undefined })}
                  className="text-[11px] text-rose-600 hover:underline"
                >
                  Remove Screenshot
                </button>
              )}
            </label>

            {block.imageUrl ? (
              <div className="flex items-center gap-3 p-2 bg-slate-50 border border-slate-200 rounded-xl">
                <img
                  src={block.imageUrl}
                  alt="Step preview"
                  className="w-16 h-12 object-cover rounded-lg border border-slate-300 cursor-zoom-in"
                  onClick={() => onPreviewImage && onPreviewImage(block.imageUrl!)}
                />
                <div className="flex-1 min-w-0">
                  <input
                    type="text"
                    value={block.caption || ''}
                    onChange={(e) => onUpdateBlock({ ...block, caption: e.target.value })}
                    placeholder="Enter image caption..."
                    className="w-full text-xs px-2 py-1 bg-white border border-slate-200 rounded-lg"
                  />
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold inline-flex items-center gap-1.5 transition-colors"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload Screenshot</span>
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/svg+xml,image/webp"
                  onChange={handleImageFileChange}
                  className="hidden"
                />
                <span className="text-[11px] text-slate-400">PNG, JPG, or SVG</span>
              </div>
            )}
          </div>
        </div>
      )}

      {block.type === 'image' && (
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Brief Description / Intro (Optional)
            </label>
            <textarea
              rows={2}
              value={block.content || ''}
              onChange={(e) => onUpdateBlock({ ...block, content: e.target.value })}
              placeholder="Describe what the visual model or diagram represents..."
              className="w-full text-xs px-3 py-2 border border-slate-300 rounded-xl focus:outline-hidden focus:border-teal-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Image / Diagram
            </label>
            {block.imageUrl ? (
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-700">Image Loaded</span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => onPreviewImage && onPreviewImage(block.imageUrl!)}
                      className="text-xs text-teal-700 hover:underline inline-flex items-center gap-1"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Zoom</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => onUpdateBlock({ ...block, imageUrl: undefined })}
                      className="text-xs text-rose-600 hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                </div>
                <img
                  src={block.imageUrl}
                  alt={block.caption || 'Diagram'}
                  className="max-h-48 rounded-lg object-contain bg-white border border-slate-200 mx-auto"
                />
                <input
                  type="text"
                  value={block.caption || ''}
                  onChange={(e) => onUpdateBlock({ ...block, caption: e.target.value })}
                  placeholder="Caption label..."
                  className="w-full text-xs px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg"
                />
              </div>
            ) : (
              <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 text-center space-y-2">
                <ImageIcon className="w-8 h-8 text-slate-400 mx-auto" />
                <div className="text-xs text-slate-600 font-medium">
                  Upload screenshot, architecture diagram, or flowchart
                </div>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold inline-flex items-center gap-1.5 shadow-xs"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Choose Image File</span>
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/svg+xml,image/webp"
                  onChange={handleImageFileChange}
                  className="hidden"
                />
              </div>
            )}
          </div>
        </div>
      )}

      {block.type === 'example' && (
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="sm:w-1/3">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Format / Language
              </label>
              <select
                value={block.language || 'DAX'}
                onChange={(e) => onUpdateBlock({ ...block, language: e.target.value })}
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded-xl bg-white focus:outline-hidden"
              >
                <option value="DAX">DAX Measure</option>
                <option value="Power Query M">Power Query (M)</option>
                <option value="Excel Formula">Excel Formula</option>
                <option value="JSON">JSON Payload</option>
                <option value="Git Bash">Git Command</option>
                <option value="Markdown">Sample Data Table</option>
              </select>
            </div>
            <div className="sm:w-2/3">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Description / Context
              </label>
              <input
                type="text"
                value={block.content || ''}
                onChange={(e) => onUpdateBlock({ ...block, content: e.target.value })}
                placeholder="e.g. Dynamic Color Scale Measure calculation"
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded-xl focus:outline-hidden"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Code or Data Payload
            </label>
            <textarea
              rows={4}
              value={block.codeOrData || ''}
              onChange={(e) => onUpdateBlock({ ...block, codeOrData: e.target.value })}
              placeholder="Sales Color = IF([Total Sales] > 50000, '#22c55e', '#ef4444')"
              className="w-full font-mono text-xs px-3 py-2 bg-slate-950 text-slate-100 rounded-xl focus:outline-hidden"
            />
          </div>
        </div>
      )}

      {block.type === 'output' && (
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Callout Tone
            </label>
            <div className="flex items-center gap-2">
              {(['success', 'info', 'warning'] as const).map((style) => (
                <button
                  key={style}
                  type="button"
                  onClick={() => onUpdateBlock({ ...block, outputStyle: style })}
                  className={`px-3 py-1 rounded-lg text-xs font-bold border capitalize transition-all ${
                    block.outputStyle === style
                      ? style === 'success'
                        ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                        : style === 'warning'
                          ? 'bg-amber-100 text-amber-900 border-amber-300'
                          : 'bg-teal-100 text-teal-900 border-teal-300'
                      : 'bg-white text-slate-600 border-slate-200'
                  }`}
                >
                  {style}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Expected Output Description
            </label>
            <textarea
              rows={3}
              value={block.content || ''}
              onChange={(e) => onUpdateBlock({ ...block, content: e.target.value })}
              placeholder="Describe the final visual appearance, KPI value, or dashboard result..."
              className="w-full text-xs sm:text-sm px-3 py-2 border border-slate-300 rounded-xl focus:outline-hidden"
            />
          </div>
        </div>
      )}

      {block.type === 'quiz' && (
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Question Text
            </label>
            <input
              type="text"
              value={block.question || ''}
              onChange={(e) => onUpdateBlock({ ...block, question: e.target.value })}
              placeholder="Which Power BI format style allows coloring cells based on exact thresholds?"
              className="w-full text-xs sm:text-sm px-3 py-2 border border-slate-300 rounded-xl focus:outline-hidden"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700">
              Multiple Choice Options (Select radio for Correct Answer)
            </label>
            {(block.options || ['Rules', 'Gradient', 'Field Value', 'Web URL']).map((opt, optIdx) => (
              <div key={optIdx} className="flex items-center gap-2">
                <input
                  type="radio"
                  name={`correct_${block.id}`}
                  checked={(block.correctOptionIndex ?? 0) === optIdx}
                  onChange={() => onUpdateBlock({ ...block, correctOptionIndex: optIdx })}
                  className="w-4 h-4 text-teal-600 cursor-pointer"
                  title="Mark as correct answer"
                />
                <span className="text-xs font-bold text-slate-400 w-4">
                  {String.fromCharCode(65 + optIdx)}.
                </span>
                <input
                  type="text"
                  value={opt}
                  onChange={(e) => {
                    const newOptions = [...(block.options || ['Rules', 'Gradient', 'Field Value', 'Web URL'])]
                    newOptions[optIdx] = e.target.value
                    onUpdateBlock({ ...block, options: newOptions })
                  }}
                  className="flex-1 text-xs px-2.5 py-1.5 border border-slate-300 rounded-lg focus:outline-hidden"
                />
              </div>
            ))}
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Answer Explanation (Shown after student answers)
            </label>
            <input
              type="text"
              value={block.explanation || ''}
              onChange={(e) => onUpdateBlock({ ...block, explanation: e.target.value })}
              placeholder="Rules format style lets you establish IF >= X AND < Y condition brackets."
              className="w-full text-xs px-3 py-2 border border-slate-300 rounded-xl focus:outline-hidden"
            />
          </div>
        </div>
      )}
    </div>
  )
}
