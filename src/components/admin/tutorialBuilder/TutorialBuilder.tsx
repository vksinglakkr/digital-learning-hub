import React, { useState, useRef } from 'react'
import type { 
  TutorialDocument, 
  TutorialBlock, 
  TutorialBlockType, 
  TeachingApproach 
} from '../../../types/tutorialBuilder'
import { CONDITIONAL_FORMATTING_PILOT } from './sampleData'
import { ApproachSelector } from './ApproachSelector'
import { OutlineManager } from './OutlineManager'
import { BlockEditor } from './BlockEditor'
import { TutorialPreviewModal } from './TutorialPreviewModal'
import { 
  downloadTutorialHtml, 
  downloadTutorialJson 
} from './htmlExporter'
import { 
  Sparkles, 
  Save, 
  Download, 
  Upload, 
  Eye, 
  FileCode, 
  RotateCcw, 
  CheckCircle2, 
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  FileText,
  Compass,
  ListTree,
  Edit3,
  HardDrive
} from 'lucide-react'

type WizardStep = 1 | 2 | 3 | 4 | 5 | 6

const WIZARD_STEPS: Array<{ step: WizardStep; label: string; shortDesc: string; icon: any }> = [
  { step: 1, label: 'Topic Details', shortDesc: 'Category, title & slug', icon: FileText },
  { step: 2, label: 'Teaching Approach', shortDesc: 'Pedagogical archetype', icon: Compass },
  { step: 3, label: 'Learning Outline', shortDesc: 'Sequence of blocks', icon: ListTree },
  { step: 4, label: 'Edit Content', shortDesc: 'Prose, steps & media', icon: Edit3 },
  { step: 5, label: 'Live Preview', shortDesc: 'Student experience', icon: Eye },
  { step: 6, label: 'Save & Export', shortDesc: 'Drafts, HTML & JSON', icon: HardDrive },
]

const DRAFT_STORAGE_KEY_PREFIX = 'dlh_tutorial_builder_draft_'

export const TutorialBuilder: React.FC = () => {
  // Current active wizard step (1 through 6)
  const [currentStep, setCurrentStep] = useState<WizardStep>(1)

  // Tutorial document state (initialized with Power BI Conditional Formatting pilot sample)
  const [doc, setDoc] = useState<TutorialDocument>(() => {
    try {
      const saved = localStorage.getItem(`${DRAFT_STORAGE_KEY_PREFIX}conditional-formatting`)
      if (saved) {
        return JSON.parse(saved)
      }
    } catch {
      // Fallback
    }
    return CONDITIONAL_FORMATTING_PILOT
  })

  // Selected block index for focused editing in Step 4
  const [selectedBlockIdx, setSelectedBlockIdx] = useState<number>(0)

  // UI state
  const [showHelpGuide, setShowHelpGuide] = useState(false)
  const [showMoreOptions, setShowMoreOptions] = useState(false)
  const [isModalPreviewOpen, setIsModalPreviewOpen] = useState(false)
  const [notification, setNotification] = useState<{ type: 'success' | 'info' | 'error'; message: string } | null>(null)
  const jsonFileInputRef = useRef<HTMLInputElement>(null)

  const showNotification = (type: 'success' | 'info' | 'error', message: string) => {
    setNotification({ type, message })
    setTimeout(() => setNotification(null), 4000)
  }

  // Sync title and slug
  const handleTitleChange = (newTitle: string) => {
    const slug = newTitle
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
    setDoc((prev) => ({
      ...prev,
      topicTitle: newTitle,
      topicSlug: prev.topicSlug === prev.topicTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-') || !prev.topicSlug
        ? slug
        : prev.topicSlug,
      updatedAt: new Date().toISOString(),
    }))
  }

  // Change Teaching Approach without deleting existing blocks
  const handleApproachChange = (approach: TeachingApproach) => {
    setDoc((prev) => ({
      ...prev,
      approach,
      updatedAt: new Date().toISOString(),
    }))
    showNotification('info', `Approach template set to "${approach}". All ${doc.blocks.length} existing blocks were preserved.`)
  }

  // Explicitly Add Block
  const handleAddBlock = (type: TutorialBlockType) => {
    const id = `block_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`
    let newBlock: TutorialBlock

    switch (type) {
      case 'text':
        newBlock = {
          id,
          type: 'text',
          title: 'Section Overview',
          content: 'Add explanation, background context, or business value here.',
        }
        break
      case 'step':
        const nextStepNum = doc.blocks.filter((b) => b.type === 'step').length + 1
        newBlock = {
          id,
          type: 'step',
          stepNumber: nextStepNum,
          title: `Step ${nextStepNum}: Action Title`,
          content: 'Describe the precise actions the student must perform...',
          tip: 'Helpful shortcut or reminder...',
          expectedResult: 'What changes on the canvas or screen after completing this step.',
        }
        break
      case 'image':
        newBlock = {
          id,
          type: 'image',
          title: 'Visual Architecture Model',
          content: 'Visual diagram representing key component relationships.',
          caption: 'Figure: Component Hierarchy',
        }
        break
      case 'example':
        newBlock = {
          id,
          type: 'example',
          title: 'Sample Calculation or Formula',
          language: 'DAX',
          codeOrData: '// Enter formula or sample dataset here',
          content: 'Example scenario and implementation notes.',
        }
        break
      case 'output':
        newBlock = {
          id,
          type: 'output',
          title: 'Checkpoint: Verification Criteria',
          outputStyle: 'success',
          content: 'Confirm the visual displays formatted cells matching the target color thresholds.',
        }
        break
      case 'quiz':
        newBlock = {
          id,
          type: 'quiz',
          question: 'What is the primary benefit of this configuration?',
          options: ['Option A (Correct)', 'Option B', 'Option C', 'Option D'],
          correctOptionIndex: 0,
          explanation: 'Option A is correct because it matches Power BI production guidelines.',
        }
        break
    }

    setDoc((prev) => ({
      ...prev,
      blocks: [...prev.blocks, newBlock],
      updatedAt: new Date().toISOString(),
    }))
    showNotification('success', `Added new block #${doc.blocks.length + 1}: ${type.toUpperCase()}`)
  }

  const handleUpdateBlock = (updated: TutorialBlock) => {
    setDoc((prev) => ({
      ...prev,
      blocks: prev.blocks.map((b) => (b.id === updated.id ? updated : b)),
      updatedAt: new Date().toISOString(),
    }))
  }

  const handleDeleteBlock = (id: string) => {
    setDoc((prev) => ({
      ...prev,
      blocks: prev.blocks.filter((b) => b.id !== id),
      updatedAt: new Date().toISOString(),
    }))
    showNotification('info', 'Block removed from tutorial.')
  }

  const handleMoveBlock = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1
    if (targetIndex < 0 || targetIndex >= doc.blocks.length) return

    const newBlocks = [...doc.blocks]
    const temp = newBlocks[index]
    newBlocks[index] = newBlocks[targetIndex]
    newBlocks[targetIndex] = temp

    setDoc((prev) => ({
      ...prev,
      blocks: newBlocks,
      updatedAt: new Date().toISOString(),
    }))
  }

  const handleSaveDraft = () => {
    try {
      const key = `${DRAFT_STORAGE_KEY_PREFIX}${doc.topicSlug || 'default'}`
      localStorage.setItem(key, JSON.stringify(doc))
      showNotification('success', `Saved draft for "${doc.topicTitle}" (${doc.blocks.length} blocks) in your browser.`)
    } catch {
      showNotification('error', 'Browser storage is full. Please export JSON backup.')
    }
  }

  const handleExportJson = () => {
    downloadTutorialJson(doc)
    showNotification('success', `Exported tutorial-${doc.topicSlug || 'manifest'}.json`)
  }

  const handleImportJsonFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string)
        if (!parsed.topicTitle || !Array.isArray(parsed.blocks)) {
          throw new Error('Invalid tutorial manifest JSON format.')
        }
        setDoc(parsed)
        showNotification('success', `Loaded "${parsed.topicTitle}" with ${parsed.blocks.length} blocks!`)
      } catch (err: any) {
        showNotification('error', `Import failed: ${err.message || 'Corrupted file'}`)
      }
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  const handleExportHtml = () => {
    downloadTutorialHtml(doc)
    showNotification('success', `Downloaded standalone HTML: ${doc.topicSlug || 'tutorial'}-index.html`)
  }

  const handleResetPilot = () => {
    setDoc(CONDITIONAL_FORMATTING_PILOT)
    setCurrentStep(1)
    showNotification('info', 'Reset to Power BI Conditional Formatting pilot sample (3 blocks).')
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      
      {/* Toast Notification */}
      {notification && (
        <div className={`p-4 rounded-xl text-xs flex items-center justify-between gap-3 font-semibold shadow-sm transition-all ${
          notification.type === 'success'
            ? 'bg-emerald-50 border border-emerald-200 text-emerald-900'
            : notification.type === 'error'
              ? 'bg-rose-50 border border-rose-200 text-rose-900'
              : 'bg-teal-50 border border-teal-200 text-teal-900'
        }`}>
          <div className="flex items-center gap-2">
            {notification.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
            {notification.type === 'error' && <AlertCircle className="w-4 h-4 text-rose-600" />}
            {notification.type === 'info' && <Sparkles className="w-4 h-4 text-teal-600" />}
            <span>{notification.message}</span>
          </div>
        </div>
      )}

      {/* Top Banner with Block Counter & Collapsible Help */}
      <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-xs space-y-4">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold border border-indigo-200">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Tutorial Builder • Guided Mode</span>
              </span>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-teal-50 text-teal-800 border border-teal-200">
                This Tutorial Contains {doc.blocks.length} Learning Block{doc.blocks.length === 1 ? '' : 's'}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              {doc.topicTitle || 'New Tutorial'}
            </h2>
          </div>

          <button
            type="button"
            onClick={() => setShowHelpGuide(!showHelpGuide)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold self-start sm:self-auto transition-colors"
          >
            <HelpCircle className="w-3.5 h-3.5 text-teal-600" />
            <span>How to Use This Page</span>
            {showHelpGuide ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Collapsible Help Guide */}
        {showHelpGuide && (
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-600 space-y-2 animate-in fade-in duration-150">
            <h4 className="font-bold text-slate-900 text-sm">6-Step Guided Workflow Overview:</h4>
            <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 pt-1 text-slate-700">
              <li className="bg-white p-2.5 rounded-xl border border-slate-200">
                <strong>1. Topic Details:</strong> Set category, title, slug, and difficulty level.
              </li>
              <li className="bg-white p-2.5 rounded-xl border border-slate-200">
                <strong>2. Teaching Approach:</strong> Choose starting archetype (procedural, masterclass, visual, etc.).
              </li>
              <li className="bg-white p-2.5 rounded-xl border border-slate-200">
                <strong>3. Review Outline:</strong> See current total blocks, reorder them, or add new blocks.
              </li>
              <li className="bg-white p-2.5 rounded-xl border border-slate-200">
                <strong>4. Edit Content:</strong> Write step instructions, paste code, and upload screenshots.
              </li>
              <li className="bg-white p-2.5 rounded-xl border border-slate-200">
                <strong>5. Live Preview:</strong> Test exactly how learners will interact with your tutorial.
              </li>
              <li className="bg-white p-2.5 rounded-xl border border-slate-200">
                <strong>6. Save & Export:</strong> Save a local browser draft or download the standalone HTML page.
              </li>
            </ul>
          </div>
        )}

        {/* 6-Step Visual Progress Bar */}
        <div className="pt-2 border-t border-slate-100">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
            {WIZARD_STEPS.map(({ step, label, shortDesc, icon: Icon }) => {
              const isActive = currentStep === step
              const isPast = currentStep > step

              return (
                <button
                  key={step}
                  type="button"
                  onClick={() => setCurrentStep(step)}
                  className={`p-3 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                    isActive
                      ? 'bg-slate-900 text-white border-slate-900 shadow-sm ring-2 ring-teal-500/30'
                      : isPast
                        ? 'bg-teal-50/70 border-teal-200 text-teal-900 hover:bg-teal-100/50'
                        : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className={`w-5 h-5 rounded-full text-[10px] font-black flex items-center justify-center ${
                      isActive ? 'bg-teal-400 text-slate-950' : isPast ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-500'
                    }`}>
                      {step}
                    </span>
                    <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-teal-300' : isPast ? 'text-teal-700' : 'text-slate-400'}`} />
                  </div>
                  <div>
                    <span className={`block text-xs font-bold leading-tight ${isActive ? 'text-white' : 'text-slate-900'}`}>
                      {label}
                    </span>
                    <span className={`block text-[10px] truncate ${isActive ? 'text-slate-300' : 'text-slate-500'}`}>
                      {shortDesc}
                    </span>
                  </div>
                </button>
              )
            })}
          </div>
        </div>

      </div>

      {/* STEP CONTAINER: SHOWS ONE STEP AT A TIME */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs">
        
        {/* ============================================================== */}
        {/* STEP 1: TOPIC DETAILS                                          */}
        {/* ============================================================== */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div className="pb-4 border-b border-slate-200">
              <span className="text-xs font-bold text-teal-700 uppercase tracking-wider">Step 1 of 6</span>
              <h3 className="text-xl font-black text-slate-900 tracking-tight mt-0.5">
                Topic Details & Basic Information
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Define the discipline, topic name, target URL slug, and learner difficulty.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  1. Discipline / Category
                </label>
                <select
                  value={doc.categoryId}
                  onChange={(e) => setDoc({ ...doc, categoryId: e.target.value })}
                  className="w-full text-sm px-3.5 py-2.5 border border-slate-300 rounded-xl bg-white focus:outline-hidden focus:border-teal-500 font-medium"
                >
                  <option value="power-bi">Power BI</option>
                  <option value="excel">Excel</option>
                  <option value="n8n">n8n Automation</option>
                  <option value="github">GitHub</option>
                  <option value="smart-work">Smart Work</option>
                  <option value="math-magic">Math Magic</option>
                </select>
                <span className="text-[11px] text-slate-400 mt-1 block">The high-level discipline for this topic.</span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  2. Topic Title
                </label>
                <input
                  type="text"
                  value={doc.topicTitle}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="e.g. Conditional Formatting"
                  className="w-full text-sm px-3.5 py-2.5 border border-slate-300 rounded-xl focus:outline-hidden focus:border-teal-500 font-bold"
                />
                <span className="text-[11px] text-slate-400 mt-1 block">Clear, descriptive topic name.</span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  3. URL Slug
                </label>
                <input
                  type="text"
                  value={doc.topicSlug}
                  onChange={(e) => setDoc({ ...doc, topicSlug: e.target.value })}
                  placeholder="conditional-formatting"
                  className="w-full text-sm px-3.5 py-2.5 font-mono text-slate-700 border border-slate-300 rounded-xl focus:outline-hidden focus:border-teal-500"
                />
                <span className="text-[11px] text-slate-400 mt-1 block">Folder path on disk: /tutorials/{doc.categoryId}/{doc.topicSlug}</span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  4. Learner Difficulty Level
                </label>
                <select
                  value={doc.difficulty}
                  onChange={(e) => setDoc({ ...doc, difficulty: e.target.value as any })}
                  className="w-full text-sm px-3.5 py-2.5 border border-slate-300 rounded-xl bg-white focus:outline-hidden focus:border-teal-500 font-medium"
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  5. Instructional Subtitle / Value Proposition
                </label>
                <input
                  type="text"
                  value={doc.subtitle}
                  onChange={(e) => setDoc({ ...doc, subtitle: e.target.value })}
                  placeholder="e.g. Master dynamic color rules, data bars, and KPI indicators in tables."
                  className="w-full text-sm px-3.5 py-2.5 border border-slate-300 rounded-xl focus:outline-hidden focus:border-teal-500"
                />
                <span className="text-[11px] text-slate-400 mt-1 block">One sentence explaining what practical superpower the learner gains.</span>
              </div>
            </div>

            {/* Navigation Footer */}
            <div className="flex items-center justify-end pt-6 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold inline-flex items-center gap-2 shadow-xs transition-colors"
              >
                <span>Next: Choose Teaching Approach</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* STEP 2: CHOOSE TEACHING APPROACH                               */}
        {/* ============================================================== */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div className="pb-4 border-b border-slate-200">
              <span className="text-xs font-bold text-teal-700 uppercase tracking-wider">Step 2 of 6</span>
              <h3 className="text-xl font-black text-slate-900 tracking-tight mt-0.5">
                Choose Teaching Approach Archetype
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Select a starting pedagogical model. Remember: this is a helpful template, not a lock-in. All existing blocks are preserved.
              </p>
            </div>

            {/* Approach Selector Component */}
            <ApproachSelector
              selectedApproach={doc.approach}
              onSelectApproach={handleApproachChange}
            />

            {/* Info Callout */}
            <div className="p-4 bg-teal-50/70 border border-teal-200 rounded-2xl text-xs text-teal-900 flex items-start gap-3">
              <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
              <div>
                <strong>Flexible Template Assurance: </strong>
                <span>
                  Your tutorial currently holds <strong>{doc.blocks.length} learning blocks</strong>. Choosing an approach sets the theme, but will never silently delete your work. In Step 3, you can add, remove, or customize any blocks freely.
                </span>
              </div>
            </div>

            {/* Navigation Footer */}
            <div className="flex items-center justify-between pt-6 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setCurrentStep(1)}
                className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold inline-flex items-center gap-1.5 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back: Topic Details</span>
              </button>

              <button
                type="button"
                onClick={() => setCurrentStep(3)}
                className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold inline-flex items-center gap-2 shadow-xs transition-colors"
              >
                <span>Next: Review Outline ({doc.blocks.length} Blocks)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* STEP 3: REVIEW LEARNING OUTLINE                                */}
        {/* ============================================================== */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <div className="pb-4 border-b border-slate-200">
              <span className="text-xs font-bold text-teal-700 uppercase tracking-wider">Step 3 of 6</span>
              <h3 className="text-xl font-black text-slate-900 tracking-tight mt-0.5">
                Review & Assemble Learning Outline
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                View all blocks in your tutorial, reorder them, or add new blocks with one click.
              </p>
            </div>

            {/* Outline Manager Component */}
            <OutlineManager
              blocks={doc.blocks}
              onAddBlock={handleAddBlock}
              onDeleteBlock={handleDeleteBlock}
              onMoveBlock={handleMoveBlock}
              onGoToEditBlock={(idx) => {
                setSelectedBlockIdx(idx)
                setCurrentStep(4)
              }}
            />

            {/* Navigation Footer */}
            <div className="flex items-center justify-between pt-6 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold inline-flex items-center gap-1.5 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back: Teaching Approach</span>
              </button>

              <button
                type="button"
                onClick={() => setCurrentStep(4)}
                className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold inline-flex items-center gap-2 shadow-xs transition-colors"
              >
                <span>Next: Edit Block Content</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* STEP 4: EDIT CONTENT                                           */}
        {/* ============================================================== */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <div className="pb-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-xs font-bold text-teal-700 uppercase tracking-wider">Step 4 of 6</span>
                <h3 className="text-xl font-black text-slate-900 tracking-tight mt-0.5">
                  Edit Block Content & Upload Media
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Fill in step instructions, code formulas, pro tips, and screenshots for each block.
                </p>
              </div>

              <span className="text-xs font-bold px-3 py-1 rounded-full bg-slate-100 text-slate-700 self-start sm:self-auto">
                Total: {doc.blocks.length} Blocks
              </span>
            </div>

            {doc.blocks.length === 0 ? (
              <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl p-8 text-center text-slate-500 space-y-2">
                <p className="text-sm font-bold text-slate-700">No blocks to edit yet</p>
                <p className="text-xs text-slate-500">Go back to Step 3 (Outline) to add learning blocks.</p>
                <button
                  type="button"
                  onClick={() => setCurrentStep(3)}
                  className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold mt-2"
                >
                  Return to Outline
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Block Switcher Tabs */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-slate-100">
                  <span className="text-xs font-bold text-slate-400 mr-1 shrink-0">Select Block:</span>
                  {doc.blocks.map((b, idx) => (
                    <button
                      key={b.id}
                      type="button"
                      onClick={() => setSelectedBlockIdx(idx)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                        selectedBlockIdx === idx
                          ? 'bg-slate-900 text-white shadow-2xs'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                      }`}
                    >
                      <span className="w-4 h-4 rounded-full bg-white/20 text-center text-[10px] inline-flex items-center justify-center">
                        {idx + 1}
                      </span>
                      <span className="capitalize">{b.type}</span>
                    </button>
                  ))}
                </div>

                {/* Focused Single Block Editor */}
                {doc.blocks[selectedBlockIdx] && (
                  <BlockEditor
                    key={doc.blocks[selectedBlockIdx].id}
                    block={doc.blocks[selectedBlockIdx]}
                    index={selectedBlockIdx}
                    totalBlocks={doc.blocks.length}
                    onUpdateBlock={handleUpdateBlock}
                    onDeleteBlock={handleDeleteBlock}
                    onMoveBlock={handleMoveBlock}
                  />
                )}
              </div>
            )}

            {/* Navigation Footer */}
            <div className="flex items-center justify-between pt-6 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setCurrentStep(3)}
                className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold inline-flex items-center gap-1.5 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back: Outline</span>
              </button>

              <button
                type="button"
                onClick={() => setCurrentStep(5)}
                className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold inline-flex items-center gap-2 shadow-xs transition-colors"
              >
                <span>Next: Live Student Preview</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* STEP 5: PREVIEW TUTORIAL                                       */}
        {/* ============================================================== */}
        {currentStep === 5 && (
          <div className="space-y-6">
            <div className="pb-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-xs font-bold text-teal-700 uppercase tracking-wider">Step 5 of 6</span>
                <h3 className="text-xl font-black text-slate-900 tracking-tight mt-0.5">
                  Live Interactive Student Preview
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Test and inspect the tutorial exactly as your learners will experience it.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsModalPreviewOpen(true)}
                className="px-4 py-2 bg-teal-50 hover:bg-teal-100 text-teal-900 border border-teal-200 rounded-xl text-xs font-bold inline-flex items-center gap-1.5 self-start sm:self-auto transition-colors"
              >
                <Eye className="w-3.5 h-3.5 text-teal-700" />
                <span>Open Fullscreen Modal</span>
              </button>
            </div>

            {/* Embedded Student Preview View */}
            <div className="rounded-2xl border border-slate-200 overflow-hidden bg-slate-50/70 p-4 sm:p-6 space-y-5">
              
              {/* Header Card */}
              <div className="bg-gradient-to-br from-slate-900 via-slate-850 to-teal-950 text-white rounded-2xl p-6 shadow-md border border-teal-500/30">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="text-[10px] font-bold text-teal-300 bg-teal-500/20 px-2 py-0.5 rounded-full uppercase">
                    {doc.categoryId}
                  </span>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-white/10 text-slate-200">
                    {doc.difficulty}
                  </span>
                </div>
                <h2 className="text-2xl font-black tracking-tight">{doc.topicTitle}</h2>
                <p className="text-xs text-slate-300 mt-1 max-w-xl">{doc.subtitle}</p>
              </div>

              {/* Render Blocks Preview List */}
              <div className="space-y-4">
                {doc.blocks.map((block, idx) => (
                  <div key={block.id} className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-slate-900 text-white text-[10px] font-black flex items-center justify-center">
                        {idx + 1}
                      </span>
                      <h4 className="text-base font-bold text-slate-900">
                        {block.title || (block.type === 'step' ? `Step ${block.stepNumber || idx + 1}` : 'Block Content')}
                      </h4>
                    </div>

                    {block.content && (
                      <p className="text-xs text-slate-700 whitespace-pre-line leading-relaxed pl-7">
                        {block.content}
                      </p>
                    )}

                    {block.imageUrl && (
                      <div className="pl-7 pt-2">
                        <img
                          src={block.imageUrl}
                          alt={block.caption || 'Illustration'}
                          className="max-h-64 rounded-lg border border-slate-200 object-contain"
                        />
                        {block.caption && <p className="text-[11px] text-slate-500 italic mt-1">{block.caption}</p>}
                      </div>
                    )}

                    {block.outputStyle && (
                      <div className="ml-7 p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-900 font-medium">
                        ✓ Checkpoint: {block.content}
                      </div>
                    )}
                  </div>
                ))}
              </div>

            </div>

            {/* Navigation Footer */}
            <div className="flex items-center justify-between pt-6 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setCurrentStep(4)}
                className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold inline-flex items-center gap-1.5 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back: Edit Content</span>
              </button>

              <button
                type="button"
                onClick={() => setCurrentStep(6)}
                className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold inline-flex items-center gap-2 shadow-xs transition-colors"
              >
                <span>Next: Save & Export</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* STEP 6: SAVE & EXPORT                                          */}
        {/* ============================================================== */}
        {currentStep === 6 && (
          <div className="space-y-6">
            <div className="pb-4 border-b border-slate-200">
              <span className="text-xs font-bold text-teal-700 uppercase tracking-wider">Step 6 of 6</span>
              <h3 className="text-xl font-black text-slate-900 tracking-tight mt-0.5">
                Save Draft or Export for Distribution
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Choose how you want to save or distribute this tutorial module.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Option A: Save Draft Locally */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 flex flex-col justify-between space-y-4">
                <div>
                  <div className="w-9 h-9 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center mb-3">
                    <Save className="w-4 h-4" />
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm mb-1">
                    1. Save Draft in Browser Storage
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Saves your work directly in your browser's local memory. You can close your browser tab or return tomorrow without losing any edits or uploaded screenshots.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleSaveDraft}
                  className="w-full py-2.5 px-4 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-bold inline-flex items-center justify-center gap-2 shadow-xs transition-colors"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Local Draft</span>
                </button>
              </div>

              {/* Option B: Export Standalone HTML */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 flex flex-col justify-between space-y-4">
                <div>
                  <div className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center mb-3">
                    <Download className="w-4 h-4" />
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm mb-1">
                    2. Export Standalone HTML Webpage
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Downloads a single, self-contained webpage (<code>{doc.topicSlug || 'tutorial'}-index.html</code>) with embedded CSS, interactive quiz logic, and image zoom. Works completely offline.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleExportHtml}
                  className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold inline-flex items-center justify-center gap-2 shadow-xs transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Standalone HTML</span>
                </button>
              </div>

              {/* Option C: Export JSON Manifest */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 flex flex-col justify-between space-y-4">
                <div>
                  <div className="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-800 flex items-center justify-center mb-3">
                    <FileCode className="w-4 h-4" />
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm mb-1">
                    3. Export JSON Configuration Backup
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Downloads a structured <code>.json</code> manifest holding all raw block data. Use this for Git backups or to move this tutorial to another computer.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleExportJson}
                  className="w-full py-2.5 px-4 bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 rounded-xl text-xs font-bold inline-flex items-center justify-center gap-2 transition-colors"
                >
                  <FileCode className="w-3.5 h-3.5" />
                  <span>Download JSON Manifest</span>
                </button>
              </div>

              {/* Option D: Import Existing JSON */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 flex flex-col justify-between space-y-4">
                <div>
                  <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center mb-3">
                    <Upload className="w-4 h-4" />
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm mb-1">
                    4. Load Previous JSON Manifest
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Upload a previously saved tutorial JSON file from your computer to continue editing right where you left off.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => jsonFileInputRef.current?.click()}
                  className="w-full py-2.5 px-4 bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 rounded-xl text-xs font-bold inline-flex items-center justify-center gap-2 transition-colors"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Choose JSON File to Load</span>
                </button>
                <input
                  ref={jsonFileInputRef}
                  type="file"
                  accept=".json"
                  onChange={handleImportJsonFile}
                  className="hidden"
                />
              </div>

            </div>

            {/* Collapsible Advanced / More Options */}
            <div className="pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowMoreOptions(!showMoreOptions)}
                className="text-xs font-semibold text-slate-500 hover:text-slate-800 inline-flex items-center gap-1 transition-colors"
              >
                <span>{showMoreOptions ? 'Hide Advanced Options' : 'More Options (Reset & Manifest Stats)'}</span>
                {showMoreOptions ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>

              {showMoreOptions && (
                <div className="mt-3 p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs space-y-3 animate-in fade-in duration-150">
                  <div className="flex items-center justify-between">
                    <div>
                      <strong className="block text-slate-900">Reset to Power BI Conditional Formatting Pilot</strong>
                      <span className="text-slate-500">Reverts current canvas to the default 3-block pilot sample.</span>
                    </div>
                    <button
                      type="button"
                      onClick={handleResetPilot}
                      className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-lg font-bold text-xs inline-flex items-center gap-1"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Reset to Pilot</span>
                    </button>
                  </div>
                  <div className="pt-2 border-t border-slate-200/60 font-mono text-[11px] text-slate-500">
                    Document ID: {doc.id} • Category: {doc.categoryId} • Status: {doc.status} • Total Blocks: {doc.blocks.length}
                  </div>
                </div>
              )}
            </div>

            {/* Navigation Footer */}
            <div className="flex items-center justify-between pt-6 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setCurrentStep(5)}
                className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold inline-flex items-center gap-1.5 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back: Live Preview</span>
              </button>

              <button
                type="button"
                onClick={handleExportHtml}
                className="px-6 py-2.5 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-bold inline-flex items-center gap-2 shadow-xs transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>Export Standalone HTML Webpage</span>
              </button>
            </div>
          </div>
        )}

      </div>

      {/* Fullscreen Preview Modal */}
      <TutorialPreviewModal
        isOpen={isModalPreviewOpen}
        document={doc}
        onClose={() => setIsModalPreviewOpen(false)}
      />

    </div>
  )
}
