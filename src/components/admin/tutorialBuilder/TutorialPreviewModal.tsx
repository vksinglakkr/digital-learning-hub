import React, { useState } from 'react'
import type { TutorialDocument } from '../../../types/tutorialBuilder'
import { 
  X, 
  Lightbulb, 
  CheckCircle2, 
  Copy, 
  Check, 
  HelpCircle,
  Eye
} from 'lucide-react'

interface TutorialPreviewModalProps {
  isOpen: boolean
  document: TutorialDocument
  onClose: () => void
}

export const TutorialPreviewModal: React.FC<TutorialPreviewModalProps> = ({
  isOpen,
  document,
  onClose,
}) => {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({})
  const [copiedBlockId, setCopiedBlockId] = useState<string | null>(null)
  const [zoomedImage, setZoomedImage] = useState<string | null>(null)

  if (!isOpen) return null

  const handleSelectQuizOption = (blockId: string, optionIdx: number) => {
    setSelectedAnswers((prev) => ({ ...prev, [blockId]: optionIdx }))
  }

  const handleCopyCode = (blockId: string, code: string) => {
    navigator.clipboard.writeText(code)
    setCopiedBlockId(blockId)
    setTimeout(() => setCopiedBlockId(null), 2000)
  }

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Modal Top Bar */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-teal-500/20 text-teal-300 text-xs font-bold border border-teal-500/30">
              <Eye className="w-3.5 h-3.5" />
              <span>Live Student Preview</span>
            </span>
            <span className="text-xs text-slate-400 hidden sm:inline">
              Exact replica of how learners will interact with this module
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            title="Close Preview"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Preview Canvas */}
        <div className="overflow-y-auto flex-1 bg-slate-50/70 p-4 sm:p-8 space-y-6">
          
          {/* Header Banner */}
          <div className="bg-gradient-to-br from-slate-900 via-slate-850 to-teal-950 text-white rounded-3xl p-6 sm:p-8 shadow-md border border-teal-500/30">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="text-[11px] font-bold text-teal-300 bg-teal-500/20 px-2.5 py-0.5 rounded-full border border-teal-500/30 uppercase tracking-wider">
                {document.categoryId.toUpperCase()}
              </span>
              <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-white/10 text-slate-200">
                {document.difficulty}
              </span>
              <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-teal-500/10 text-teal-200 border border-teal-500/20 capitalize">
                {document.approach.replace('-', ' ')}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black tracking-tight mb-2">
              {document.topicTitle || 'Untitled Topic'}
            </h1>

            <p className="text-slate-300 text-sm leading-relaxed max-w-2xl">
              {document.subtitle || 'Learn practical skills through structured micro-steps and examples.'}
            </p>
          </div>

          {/* Render Blocks */}
          <div className="space-y-5">
            {document.blocks.map((block, idx) => (
              <div
                key={block.id}
                className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4"
              >
                {/* 1. TEXT BLOCK */}
                {block.type === 'text' && (
                  <div>
                    {block.title && (
                      <h3 className="text-lg font-bold text-slate-900 mb-2">
                        {block.title}
                      </h3>
                    )}
                    <div className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                      {block.content}
                    </div>
                  </div>
                )}

                {/* 2. STEP BLOCK */}
                {block.type === 'step' && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <span className="w-7 h-7 rounded-full bg-slate-900 text-white text-xs font-black flex items-center justify-center shrink-0">
                        {block.stepNumber || idx + 1}
                      </span>
                      <h3 className="text-base sm:text-lg font-bold text-slate-900">
                        {block.title || `Step ${block.stepNumber || idx + 1}`}
                      </h3>
                    </div>

                    <div className="text-sm text-slate-700 leading-relaxed whitespace-pre-line pl-10">
                      {block.content}
                    </div>

                    {block.imageUrl && (
                      <div className="pl-10">
                        <div 
                          onClick={() => setZoomedImage(block.imageUrl!)}
                          className="rounded-xl overflow-hidden border border-slate-200 bg-slate-50 cursor-zoom-in max-w-lg group relative"
                        >
                          <img
                            src={block.imageUrl}
                            alt={block.caption || 'Step illustration'}
                            className="w-full max-h-72 object-cover group-hover:scale-101 transition-transform"
                          />
                          <div className="absolute inset-0 bg-slate-900/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <span className="px-3 py-1 bg-slate-900/80 text-white text-xs rounded-lg font-medium">Click to Zoom</span>
                          </div>
                        </div>
                        {block.caption && (
                          <p className="text-xs text-slate-500 italic mt-1.5">{block.caption}</p>
                        )}
                      </div>
                    )}

                    {block.tip && (
                      <div className="ml-10 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 flex items-start gap-2">
                        <Lightbulb className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <div>
                          <strong className="font-bold">Pro Tip: </strong>
                          <span>{block.tip}</span>
                        </div>
                      </div>
                    )}

                    {block.expectedResult && (
                      <div className="ml-10 p-3 bg-teal-50 border border-teal-200 rounded-xl text-xs text-teal-900 flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                        <div>
                          <strong className="font-bold">Expected Result: </strong>
                          <span>{block.expectedResult}</span>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* 3. IMAGE BLOCK */}
                {block.type === 'image' && (
                  <div className="space-y-2">
                    {block.title && (
                      <h3 className="text-lg font-bold text-slate-900">
                        {block.title}
                      </h3>
                    )}
                    {block.content && (
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                        {block.content}
                      </p>
                    )}
                    {block.imageUrl ? (
                      <div 
                        onClick={() => setZoomedImage(block.imageUrl!)}
                        className="rounded-xl overflow-hidden border border-slate-200 bg-slate-50 cursor-zoom-in group relative text-center"
                      >
                        <img
                          src={block.imageUrl}
                          alt={block.caption || 'Model diagram'}
                          className="max-h-80 mx-auto object-contain p-2"
                        />
                      </div>
                    ) : (
                      <div className="p-8 border-2 border-dashed border-slate-200 rounded-xl text-center text-xs text-slate-400">
                        [Image Screenshot Placeholder]
                      </div>
                    )}
                    {block.caption && (
                      <p className="text-xs text-slate-500 italic text-center">{block.caption}</p>
                    )}
                  </div>
                )}

                {/* 4. EXAMPLE BLOCK */}
                {block.type === 'example' && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="text-base font-bold text-slate-900">
                        {block.title || 'Example Formula / Payload'}
                      </h3>
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200">
                        {block.language || 'DAX'}
                      </span>
                    </div>

                    {block.content && (
                      <p className="text-xs text-slate-600">{block.content}</p>
                    )}

                    {block.codeOrData && (
                      <div className="relative group">
                        <pre className="bg-slate-950 text-slate-100 p-4 rounded-xl text-xs font-mono overflow-x-auto leading-relaxed">
                          <code>{block.codeOrData}</code>
                        </pre>
                        <button
                          type="button"
                          onClick={() => handleCopyCode(block.id, block.codeOrData!)}
                          className="absolute top-2 right-2 px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-[11px] font-semibold flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity"
                        >
                          {copiedBlockId === block.id ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-400" />
                              <span className="text-emerald-400">Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              <span>Copy</span>
                            </>
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* 5. OUTPUT BLOCK */}
                {block.type === 'output' && (
                  <div className={`p-4 rounded-xl border ${
                    block.outputStyle === 'warning'
                      ? 'bg-amber-50 border-amber-200 text-amber-950'
                      : 'bg-emerald-50 border-emerald-200 text-emerald-950'
                  } space-y-1`}>
                    <h4 className="text-sm font-bold flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>{block.title || 'Expected Result Checkpoint'}</span>
                    </h4>
                    <p className="text-xs sm:text-sm whitespace-pre-line leading-relaxed">
                      {block.content}
                    </p>
                  </div>
                )}

                {/* 6. QUIZ BLOCK */}
                {block.type === 'quiz' && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-rose-700 text-xs font-bold uppercase tracking-wider">
                      <HelpCircle className="w-4 h-4" />
                      <span>Practice Question</span>
                    </div>

                    <p className="text-sm font-bold text-slate-900">
                      {block.question || 'Select the correct option:'}
                    </p>

                    <div className="space-y-2">
                      {(block.options || []).map((opt, optIdx) => {
                        const isSelected = selectedAnswers[block.id] === optIdx
                        const isAnswered = selectedAnswers[block.id] !== undefined
                        const isCorrect = optIdx === (block.correctOptionIndex ?? 0)

                        let btnClass = 'bg-slate-50 border-slate-200 hover:bg-teal-50 hover:border-teal-300 text-slate-700'
                        if (isAnswered) {
                          if (isSelected) {
                            btnClass = isCorrect 
                              ? 'bg-emerald-100 border-emerald-400 text-emerald-950 font-bold'
                              : 'bg-rose-100 border-rose-400 text-rose-950 font-bold'
                          } else if (isCorrect) {
                            btnClass = 'bg-emerald-50 border-emerald-300 text-emerald-900 font-bold'
                          }
                        }

                        return (
                          <button
                            key={optIdx}
                            type="button"
                            disabled={isAnswered}
                            onClick={() => handleSelectQuizOption(block.id, optIdx)}
                            className={`w-full text-left p-3 rounded-xl border text-xs sm:text-sm transition-all flex items-center gap-2 ${btnClass}`}
                          >
                            <span className="font-bold">{String.fromCharCode(65 + optIdx)}.</span>
                            <span>{opt}</span>
                            {isAnswered && isSelected && (
                              <span className="ml-auto text-xs font-bold">
                                {isCorrect ? '✓ Correct' : '✗ Incorrect'}
                              </span>
                            )}
                          </button>
                        )
                      })}
                    </div>

                    {selectedAnswers[block.id] !== undefined && block.explanation && (
                      <div className="p-3 bg-slate-100 border-l-4 border-teal-600 rounded-r-xl text-xs text-slate-700">
                        <strong className="text-slate-900">Explanation: </strong>
                        <span>{block.explanation}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

        </div>

        {/* Modal Bottom Bar */}
        <div className="bg-slate-100 px-6 py-3 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>{document.blocks.length} Learning Blocks in Preview</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-xl transition-colors"
          >
            Close Preview
          </button>
        </div>

      </div>

      {/* Screenshot Zoom Modal */}
      {zoomedImage && (
        <div 
          onClick={() => setZoomedImage(null)}
          className="fixed inset-0 z-60 bg-slate-950/90 flex items-center justify-center p-4 cursor-zoom-out"
        >
          <img
            src={zoomedImage}
            alt="Enlarged screenshot"
            className="max-w-[95vw] max-h-[90vh] rounded-xl shadow-2xl object-contain"
          />
        </div>
      )}
    </div>
  )
}
