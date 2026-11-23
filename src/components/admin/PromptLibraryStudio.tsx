import React, { useState, useEffect, useMemo } from 'react'
import { useLearningHub } from '../../context/LearningHubContext'
import { PROMPT_TEMPLATES } from '../../data/promptTemplates'
import { getTopicTutorial } from '../../config/topicTutorials'
import { 
  Sparkles, 
  Copy, 
  Check, 
  RotateCcw, 
  Save, 
  AlertTriangle, 
  CheckCircle2, 
  BookOpen, 
  Info,
  Terminal,
  Compass,
  Target
} from 'lucide-react'

const DRAFT_STORAGE_PREFIX = 'learning_hub_prompt_draft_v1_2_'

export const PromptLibraryStudio: React.FC = () => {
  const { categories, topics } = useLearningHub()

  // 1. Template selection
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>(
    PROMPT_TEMPLATES[0].id
  )
  const selectedTemplate = useMemo(() => {
    return PROMPT_TEMPLATES.find((t) => t.id === selectedTemplateId) || PROMPT_TEMPLATES[0]
  }, [selectedTemplateId])

  // 2. Feature / Property for Micro-Learning template
  const isMicroLearning = selectedTemplate.id === 'micro-learning-one-feature-v1'
  const [featureName, setFeatureName] = useState<string>('Dropdown Slicer')
  const [learnerLevel, setLearnerLevel] = useState<string>('Absolute Beginner')

  // 3. Category & Topic Selection
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>(
    categories[0]?.id || 'power-bi'
  )
  const categoryTopics = useMemo(() => {
    return topics.filter((t) => t.categoryId === selectedCategoryId)
  }, [topics, selectedCategoryId])

  const [selectedTopicId, setSelectedTopicId] = useState<string>(() => {
    const defaultTopic = topics.find((t) => t.categoryId === 'power-bi' && t.slug.includes('slicer'))
      || topics.find((t) => t.categoryId === 'power-bi' && t.slug.includes('bookmark'))
    return defaultTopic?.id || categoryTopics[0]?.id || topics[0]?.id || ''
  })

  // When category changes, auto-select first topic in that category if current doesn't belong
  useEffect(() => {
    const currentBelongs = categoryTopics.some((t) => t.id === selectedTopicId)
    if (!currentBelongs && categoryTopics.length > 0) {
      setSelectedTopicId(categoryTopics[0].id)
    }
  }, [selectedCategoryId, categoryTopics, selectedTopicId])

  const activeCategory = useMemo(() => {
    return categories.find((c) => c.id === selectedCategoryId) || categories[0]
  }, [categories, selectedCategoryId])

  const activeTopic = useMemo(() => {
    return topics.find((t) => t.id === selectedTopicId) || topics[0]
  }, [topics, selectedTopicId])

  // 3. Prompt Content & Draft State
  const [promptText, setPromptText] = useState<string>(selectedTemplate.basePromptText)
  const [hasDraftEdits, setHasDraftEdits] = useState<boolean>(false)
  const [additionalRequirements, setAdditionalRequirements] = useState<string>('')
  const [notice, setNotice] = useState<{ type: 'success' | 'info' | 'warning'; message: string } | null>(null)
  const [isCopied, setIsCopied] = useState<boolean>(false)

  // 4. Output Path Computation & Existing File Safety
  const [useSafePreviewPath, setUseSafePreviewPath] = useState<boolean>(true)

  // Determine proposed path based on project conventions
  const { targetPath, previewPath, fileAlreadyExists } = useMemo(() => {
    const catSlug = activeCategory?.slug || 'general'
    // Normalize topic slug (e.g. 'bookmarks' or 'bookmark')
    let topSlug = activeTopic?.slug || 'topic'
    if (topSlug.endsWith('s') && topSlug !== 'dax-measures') {
      // e.g. 'bookmarks' -> 'bookmark' for folder convention
      topSlug = topSlug.replace(/s$/, '')
    }

    if (isMicroLearning) {
      const featSlug = featureName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '') || 'feature'
      const standardPath = `public/tutorials/${catSlug}/${topSlug}/${featSlug}/index.html`
      const previewSafePath = `public/tutorials/${catSlug}/${topSlug}/${featSlug}/index.preview.html`
      return {
        targetPath: standardPath,
        previewPath: previewSafePath,
        fileAlreadyExists: false
      }
    }

    const standardPath = `public/tutorials/${catSlug}/${topSlug}/index.html`
    const previewSafePath = `public/tutorials/${catSlug}/${topSlug}/index.preview.html`

    // Check if the file or tutorial is registered or matches existing Power BI Bookmark tutorial
    const hasRegisteredTutorial = activeTopic ? Boolean(getTopicTutorial(activeTopic.id)) : false
    const isBookmarkGoldStandard = 
      (catSlug === 'power-bi' && (topSlug === 'bookmark' || topSlug === 'bookmarks')) ||
      hasRegisteredTutorial

    return {
      targetPath: standardPath,
      previewPath: previewSafePath,
      fileAlreadyExists: isBookmarkGoldStandard
    }
  }, [activeCategory, activeTopic, isMicroLearning, featureName])

  const chosenOutputPath = useMemo(() => {
    if (fileAlreadyExists && useSafePreviewPath) {
      return previewPath
    }
    return targetPath
  }, [fileAlreadyExists, useSafePreviewPath, previewPath, targetPath])

  // Load saved draft on mount or template switch
  useEffect(() => {
    try {
      const savedDraft = localStorage.getItem(`${DRAFT_STORAGE_PREFIX}${selectedTemplate.id}`)
      if (savedDraft) {
        setPromptText(savedDraft)
        setHasDraftEdits(true)
      } else {
        setPromptText(selectedTemplate.basePromptText)
        setHasDraftEdits(false)
      }
    } catch {
      setPromptText(selectedTemplate.basePromptText)
      setHasDraftEdits(false)
    }
  }, [selectedTemplate])

  const showNotification = (type: 'success' | 'info' | 'warning', message: string) => {
    setNotice({ type, message })
    setTimeout(() => setNotice(null), 5000)
  }

  // Handle Save Draft locally
  const handleSaveDraft = () => {
    try {
      localStorage.setItem(`${DRAFT_STORAGE_PREFIX}${selectedTemplate.id}`, promptText)
      setHasDraftEdits(true)
      showNotification('success', 'Draft prompt saved locally! Original project base remains untouched.')
    } catch {
      showNotification('warning', 'Unable to save to localStorage. Browser storage may be restricted.')
    }
  }

  // Handle Reset to Base Template
  const handleResetToBase = () => {
    try {
      localStorage.removeItem(`${DRAFT_STORAGE_PREFIX}${selectedTemplate.id}`)
    } catch {
      // ignore
    }
    setPromptText(selectedTemplate.basePromptText)
    setHasDraftEdits(false)
    showNotification('info', 'Reset prompt to project-managed base version.')
  }

  // Assemble Complete Prompt for Antigravity
  const generatedCompletePrompt = useMemo(() => {
    let output = promptText
    const catTitle = activeCategory?.title || 'Power BI'
    const catSlug = activeCategory?.slug || 'power-bi'
    const topTitle = activeTopic?.title || 'Bookmarks'
    const topSlug = activeTopic?.slug || 'bookmarks'

    output = output.replace(/\{\{CATEGORY_TITLE\}\}/g, catTitle)
    output = output.replace(/\{\{CATEGORY_SLUG\}\}/g, catSlug)
    output = output.replace(/\{\{TOPIC_TITLE\}\}/g, topTitle)
    output = output.replace(/\{\{TOPIC_SLUG\}\}/g, topSlug)
    output = output.replace(/\{\{FEATURE_NAME\}\}/g, featureName.trim() || 'Single Feature')
    output = output.replace(/\{\{LEVEL\}\}/g, learnerLevel)
    output = output.replace(/\{\{TARGET_OUTPUT_PATH\}\}/g, chosenOutputPath)

    const extra = additionalRequirements.trim() 
      ? additionalRequirements.trim() 
      : 'None specified. Follow standard role-model guidelines.'
    output = output.replace(/\{\{ADDITIONAL_REQUIREMENTS\}\}/g, extra)

    const featSuffix = isMicroLearning ? ` — ${featureName.trim()}` : ''
    // Append metadata block for Antigravity
    const fullPrompt = `${output}

---

## Digital Learning Hub Integration Checklist for Antigravity
1. **Target Output File:** \`${chosenOutputPath}\`
2. **Category:** ${catTitle} (\`${catSlug}\`)
3. **Topic ID / Slug:** \`${activeTopic?.id || topSlug}\` (\`${topSlug}\`)${isMicroLearning ? ` | Feature: ${featureName.trim()}` : ''}
4. **Registration:** After generating the standalone HTML, add or verify an entry in \`src/config/topicTutorials.ts\`:
   \`\`\`typescript
   '${activeTopic?.id || `${catSlug}-${topSlug}`}': {
     tutorialPath: '${chosenOutputPath.replace(/^public\//, '')}',
     title: '${topTitle}${featSuffix}: Interactive Tutorial',
     subtitle: 'Hands-on interactive learning with live demonstration and practice.',
     hasSimulator: true,
     hasQuiz: true,
     hasChallenge: true,
     difficultyBadge: '${isMicroLearning ? learnerLevel : (activeTopic?.difficulty || 'Beginner to Intermediate')}',
   }
   \`\`\`
5. **Verification & Build:**
   - Verify the tutorial renders in the browser under the Vite server.
   - Run \`npm run build\` to confirm zero compilation errors.
   - Do NOT commit, push, or deploy without explicit approval.`

    return fullPrompt
  }, [
    promptText, 
    activeCategory, 
    activeTopic, 
    chosenOutputPath, 
    additionalRequirements,
    isMicroLearning,
    featureName,
    learnerLevel
  ])

  // Copy Complete Prompt
  const handleCopyPrompt = async () => {
    try {
      await navigator.clipboard.writeText(generatedCompletePrompt)
      setIsCopied(true)
      showNotification('success', 'Complete prompt copied to clipboard! Paste directly into Antigravity.')
      setTimeout(() => setIsCopied(false), 3000)
    } catch {
      // Fallback
      const textarea = document.createElement('textarea')
      textarea.value = generatedCompletePrompt
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
      setIsCopied(true)
      showNotification('success', 'Complete prompt copied to clipboard! Paste directly into Antigravity.')
      setTimeout(() => setIsCopied(false), 3000)
    }
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-teal-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-teal-500/30">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-bold border border-teal-500/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Prompt Template Library • Pilot Phase 1</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Interactive Masterclass Prompt Studio
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              Curate, edit, and assemble production-grade master prompts for Antigravity. Generate gold-standard standalone HTML tutorials using our role-model teaching philosophy.
            </p>
          </div>

          <div className="shrink-0 flex items-center gap-3">
            <button
              type="button"
              onClick={handleCopyPrompt}
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-teal-400 hover:bg-teal-300 text-slate-950 font-black text-xs sm:text-sm rounded-2xl shadow-lg transition-all transform hover:-translate-y-0.5"
            >
              {isCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{isCopied ? 'Copied Prompt!' : 'Copy Complete Prompt for Antigravity'}</span>
            </button>
          </div>
        </div>

        {/* Template Status / Notice Banner */}
        {selectedTemplate.reconstructionNotice ? (
          <div className="mt-5 p-3.5 bg-amber-950/40 border border-amber-500/30 rounded-2xl flex items-start gap-3 text-xs text-amber-200">
            <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <span className="font-bold text-amber-300 block">
                Draft Reconstructed from Bookmark Gold-Standard Tutorial (Review Required)
              </span>
              <p className="text-[11px] text-amber-200/90 leading-relaxed">
                {selectedTemplate.reconstructionNotice}
              </p>
            </div>
          </div>
        ) : (
          <div className="mt-5 p-3.5 bg-emerald-950/40 border border-emerald-500/30 rounded-2xl flex items-start gap-3 text-xs text-emerald-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <span className="font-bold text-emerald-300 block">
                Production-Ready Micro-Learning Engine Active
              </span>
              <p className="text-[11px] text-emerald-200/90 leading-relaxed">
                Focused single-feature generator. Automatically plans 1 WOW demo, practical problem, 3–6 micro-steps, and hands-on practice.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Action Notification */}
      {notice && (
        <div className={`p-4 rounded-xl text-xs flex items-center justify-between gap-3 font-medium animate-in fade-in duration-150 ${
          notice.type === 'success'
            ? 'bg-emerald-50 border border-emerald-200 text-emerald-900'
            : notice.type === 'warning'
            ? 'bg-amber-50 border border-amber-200 text-amber-900'
            : 'bg-teal-50 border border-teal-200 text-teal-900'
        }`}>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{notice.message}</span>
          </div>
        </div>
      )}

      {/* Grid: Config & Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Template & Topic Selection */}
        <div className="space-y-6">
          
          {/* Card 1: Available Prompt Templates */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="text-xs font-bold uppercase tracking-wider text-teal-700">1. Select Prompt Template</span>
              <span className="text-[10px] font-bold px-2 py-0.5 bg-teal-50 text-teal-800 rounded-full border border-teal-200">
                {PROMPT_TEMPLATES.length} Templates Available
              </span>
            </div>

            <div className="space-y-2">
              {PROMPT_TEMPLATES.map((tmpl) => {
                const isSelected = tmpl.id === selectedTemplateId
                return (
                  <div
                    key={tmpl.id}
                    onClick={() => setSelectedTemplateId(tmpl.id)}
                    className={`p-4 rounded-2xl border text-left cursor-pointer transition-all ${
                      isSelected
                        ? 'border-teal-600 bg-teal-50/70 shadow-xs ring-2 ring-teal-500/20'
                        : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <h4 className="font-bold text-slate-900 text-sm">{tmpl.name}</h4>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md shrink-0 border ${
                        tmpl.id === 'micro-learning-one-feature-v1'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          : 'bg-amber-50 text-amber-800 border-amber-200'
                      }`}>
                        {tmpl.id === 'micro-learning-one-feature-v1' ? 'One Feature V1' : 'Masterclass V1'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed mb-2.5">
                      {tmpl.description}
                    </p>
                    <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-500 font-medium">
                      <span>Philosophy</span>
                      <span className="text-teal-800 font-semibold truncate max-w-[160px]">
                        {tmpl.id === 'micro-learning-one-feature-v1' ? 'One Feature at a Time' : 'First Show the Power → Practice'}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Card 2: Target Category & Topic Selection */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="text-xs font-bold uppercase tracking-wider text-teal-700">2. Target Topic & Output Path</span>
              <BookOpen className="w-4 h-4 text-teal-600" />
            </div>

            <div className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
                <select
                  value={selectedCategoryId}
                  onChange={(e) => setSelectedCategoryId(e.target.value)}
                  className="w-full text-xs font-semibold px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.title} ({topics.filter((t) => t.categoryId === c.id).length} topics)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Topic</label>
                <select
                  value={selectedTopicId}
                  onChange={(e) => setSelectedTopicId(e.target.value)}
                  className="w-full text-xs font-semibold px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  {categoryTopics.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.title} ({t.difficulty})
                    </option>
                  ))}
                </select>
              </div>

              {/* Feature / Property Input specifically for Micro-Learning */}
              {isMicroLearning && (
                <div className="p-3.5 bg-teal-50/70 border border-teal-200 rounded-2xl space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-teal-900 mb-1 flex items-center gap-1.5">
                      <Target className="w-3.5 h-3.5 text-teal-700" />
                      <span>Feature / Property to Teach <span className="text-teal-600">*</span></span>
                    </label>
                    <input
                      type="text"
                      value={featureName}
                      onChange={(e) => setFeatureName(e.target.value)}
                      placeholder="e.g. Dropdown Slicer"
                      className="w-full text-xs font-semibold px-3 py-2 bg-white border border-teal-300 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500 shadow-2xs"
                    />
                    <span className="text-[10px] text-teal-700/90 mt-1 block">
                      Enter the single feature (e.g. Dropdown Slicer, XLOOKUP Exact Match).
                    </span>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-teal-900 mb-1">
                      Learner Target Level
                    </label>
                    <select
                      value={learnerLevel}
                      onChange={(e) => setLearnerLevel(e.target.value)}
                      className="w-full text-xs font-semibold px-3 py-2 bg-white border border-teal-300 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    >
                      <option value="Absolute Beginner">Absolute Beginner (First-time user)</option>
                      <option value="Beginner">Beginner (Basic familiarity)</option>
                      <option value="Intermediate">Intermediate</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Path & Existing File Warning */}
              <div className="pt-2 border-t border-slate-100 space-y-2">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                  Proposed Output Path:
                </span>
                <code className="block p-2.5 bg-slate-100 rounded-xl text-xs font-mono text-slate-800 break-all border border-slate-200">
                  {chosenOutputPath}
                </code>

                {/* Existing File Warning */}
                {fileAlreadyExists && (
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 space-y-2">
                    <div className="flex items-center gap-2 font-bold text-amber-800">
                      <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                      <span>Existing Tutorial Detected!</span>
                    </div>
                    <p className="text-[11px] leading-relaxed text-amber-800/90">
                      An approved gold-standard tutorial is already present at <code className="font-mono bg-amber-100 px-1 py-0.5 rounded">{targetPath}</code>. To avoid overwriting genuine teaching materials, a safe preview path is recommended.
                    </p>
                    <div className="flex items-center gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => setUseSafePreviewPath(true)}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                          useSafePreviewPath
                            ? 'bg-amber-700 text-white shadow-2xs'
                            : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        Safe Preview Path (index.preview.html)
                      </button>
                      <button
                        type="button"
                        onClick={() => setUseSafePreviewPath(false)}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                          !useSafePreviewPath
                            ? 'bg-rose-700 text-white shadow-2xs'
                            : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        Target Original File (index.html)
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Card 3: Additional Requirements */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="text-xs font-bold uppercase tracking-wider text-teal-700">3. Additional Requirements</span>
              <span className="text-[10px] text-slate-400 font-medium">Optional</span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Specify any custom business scenario, target audience, specific columns, or unique simulators to include in the generated prompt.
            </p>
            <textarea
              rows={4}
              value={additionalRequirements}
              onChange={(e) => setAdditionalRequirements(e.target.value)}
              placeholder="e.g. Focus on retail shop transactions; emphasize toggle between Category vs City analysis; include 5 practical steps..."
              className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 leading-relaxed"
            />
          </div>

        </div>

        {/* Right 2 Columns: Prompt Editor & Live Complete Preview */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Editor Header Controls */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-teal-600" />
                <h3 className="font-bold text-slate-900 text-sm">Prompt Template Editor</h3>
                {hasDraftEdits ? (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                    Local Draft Active
                  </span>
                ) : (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-50 text-teal-800 border border-teal-200">
                    Base Project Version
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleResetToBase}
                  disabled={!hasDraftEdits}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                    hasDraftEdits
                      ? 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                      : 'bg-slate-50 text-slate-300 cursor-not-allowed'
                  }`}
                  title="Discard local draft and reset to project base template"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset to Base</span>
                </button>

                <button
                  type="button"
                  onClick={handleSaveDraft}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 rounded-lg text-xs font-bold transition-colors"
                >
                  <Save className="w-3.5 h-3.5 text-teal-700" />
                  <span>Save Draft Copy</span>
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                Base Template Text (Editable):
              </span>
              <textarea
                rows={12}
                value={promptText}
                onChange={(e) => {
                  setPromptText(e.target.value)
                  setHasDraftEdits(true)
                }}
                className="w-full font-mono text-xs p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 leading-relaxed"
              />
              <span className="text-[11px] text-slate-400 block">
                Variables like <code className="text-teal-700 font-mono">{'{{TOPIC_TITLE}}'}</code>, <code className="text-teal-700 font-mono">{'{{CATEGORY_SLUG}}'}</code>, and <code className="text-teal-700 font-mono">{'{{TARGET_OUTPUT_PATH}}'}</code> are automatically filled below.
              </span>
            </div>
          </div>

          {/* Complete Assembled Prompt Preview for Antigravity */}
          <div className="bg-slate-900 text-slate-100 rounded-3xl p-5 sm:p-6 shadow-xl border border-slate-800 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-teal-400" />
                <h4 className="font-bold text-white text-sm">
                  Complete Generated Prompt for Antigravity
                </h4>
              </div>

              <button
                type="button"
                onClick={handleCopyPrompt}
                className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-teal-400 hover:bg-teal-300 text-slate-950 font-bold text-xs rounded-xl transition-all shadow-xs"
              >
                {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{isCopied ? 'Copied to Clipboard!' : 'Copy Complete Prompt'}</span>
              </button>
            </div>

            <div className="max-h-[380px] overflow-y-auto rounded-2xl bg-slate-950 p-4 border border-slate-800/80 font-mono text-xs text-slate-300 leading-relaxed whitespace-pre-wrap select-all">
              {generatedCompletePrompt}
            </div>

            <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800/80">
              <span className="flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-teal-400" />
                <span>Target: <code className="text-teal-300 font-mono">{chosenOutputPath}</code></span>
              </span>
              <span>Ready for copy & paste into Antigravity</span>
            </div>
          </div>

        </div>

      </div>

    </div>
  )
}
