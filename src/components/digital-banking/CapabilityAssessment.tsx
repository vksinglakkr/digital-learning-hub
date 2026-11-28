import React, { useState, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  BookOpen,
  CheckCircle2,
  Clock,
  Users,
  ShieldCheck,
  AlertTriangle,
  ZoomIn,
  Sparkles,
  Bookmark,
  Trash2,
  X,
  Info
} from 'lucide-react'

import {
  CAPABILITY_QUESTIONS,
  PRACTICAL_RECOMMENDATIONS_CATALOG,
  ADVANCED_SAFETY_RECOMMENDATIONS,
  evaluateRecommendations,
  loadStoredAssessmentAnswers,
  saveStoredAssessmentAnswers,
  clearStoredAssessmentAnswers,
  loadStoredSavedSkills,
  saveStoredSavedSkill,
  removeStoredSavedSkill,
  clearAllStoredSavedSkills,
  loadStoredKnownSkills,
  saveStoredKnownSkill,
  clearAllStoredKnownSkills,
  type PracticalRecommendation
} from '../../data/digitalBankingCapabilityData'

import type { DigitalBankingTab } from './DigitalBankingView'

interface CapabilityAssessmentProps {
  onNavigateToContent: (tab: DigitalBankingTab, targetId?: string, targetIndex?: number) => void
  onExitToLibrary: () => void
  onOpenZoom: (url: string, title: string) => void
}

export const CapabilityAssessment: React.FC<CapabilityAssessmentProps> = ({
  onNavigateToContent,
  onExitToLibrary,
  onOpenZoom
}) => {
  const [searchParams] = useSearchParams()

  // Assessment State (Lazy initialized from LocalStorage or query params)
  const [answers, setAnswers] = useState<Record<string, string>>(() => {
    const stored = loadStoredAssessmentAnswers()
    if (Object.keys(stored).length > 0) return stored
    if (searchParams.get('view') === 'recommendations' || searchParams.get('helper') === '1') {
      return {
        q1: 'swipe_only',
        q2: 'atm_self',
        q3: 'branch_passbook',
        q4: 'has_app_fear',
        q5: 'qr_afraid_wrong_deduct',
        q6: 'single_main_account',
        q10: 'panicked',
        q11: 'unsure_delay'
      }
    }
    return {}
  })

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0)
  const [isCompleted, setIsCompleted] = useState<boolean>(() => {
    if (searchParams.get('view') === 'recommendations' || searchParams.get('helper') === '1') {
      return true
    }
    const stored = loadStoredAssessmentAnswers()
    return Object.keys(stored).length >= 5
  })

  // Saved / Known Skills State (Lazy initialized from LocalStorage)
  const [savedSkillIds, setSavedSkillIds] = useState<string[]>(() => loadStoredSavedSkills())
  const [knownSkillIds, setKnownSkillIds] = useState<string[]>(() => loadStoredKnownSkills())
  const [activeHelperModal, setActiveHelperModal] = useState<PracticalRecommendation | null>(() => {
    if (searchParams.get('helper') === '1') {
      return PRACTICAL_RECOMMENDATIONS_CATALOG[0] // Handset Lock Helper Guide
    }
    return null
  })
  const [feedbackMessages, setFeedbackMessages] = useState<Record<string, string>>({})
  const [showSavedDrawer, setShowSavedDrawer] = useState<boolean>(false)

  // Calculate Active Questions based on conditions
  const activeQuestions = useMemo(() => {
    return CAPABILITY_QUESTIONS.filter(q => {
      if (q.isCore) return true
      if (q.condition) return q.condition(answers)
      return true
    })
  }, [answers])

  // Current Question
  const currentQuestion = activeQuestions[currentQuestionIndex] || activeQuestions[0]

  // Recommendations calculated from answers
  const recommendations = useMemo(() => {
    return evaluateRecommendations(answers)
  }, [answers])

  // All catalog items for lookup
  const allRecommendationsCatalog = useMemo(() => {
    return [...PRACTICAL_RECOMMENDATIONS_CATALOG, ...ADVANCED_SAFETY_RECOMMENDATIONS]
  }, [])

  // Handle Option Select
  const handleSelectOption = (questionId: string, optionId: string) => {
    const updatedAnswers = { ...answers, [questionId]: optionId }
    setAnswers(updatedAnswers)
    saveStoredAssessmentAnswers(updatedAnswers)

    // Advance to next question or complete
    if (currentQuestionIndex < activeQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1)
      window.scrollTo({ top: 320, behavior: 'smooth' })
    } else {
      setIsCompleted(true)
      window.scrollTo({ top: 320, behavior: 'smooth' })
    }
  }

  // Handle Back
  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1)
      window.scrollTo({ top: 320, behavior: 'smooth' })
    }
  }

  // Handle Skip
  const handleSkipQuestion = () => {
    if (currentQuestionIndex < activeQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1)
      window.scrollTo({ top: 320, behavior: 'smooth' })
    } else {
      setIsCompleted(true)
      window.scrollTo({ top: 320, behavior: 'smooth' })
    }
  }

  // Handle Reset Assessment
  const handleResetAssessment = () => {
    if (window.confirm('क्या आप बातचीत को शुरू से दोबारा करना चाहते हैं?')) {
      clearStoredAssessmentAnswers()
      setAnswers({})
      setCurrentQuestionIndex(0)
      setIsCompleted(false)
      setFeedbackMessages({})
      window.scrollTo({ top: 320, behavior: 'smooth' })
    }
  }

  // Four-Way Learner Choice Handlers:
  // 1. Learn Independently
  const handleChoiceLearnSelf = (rec: PracticalRecommendation) => {
    onNavigateToContent(rec.targetTab, rec.targetId, rec.targetIndex)
  }

  // 2. Learn with Helper
  const handleChoiceLearnHelper = (rec: PracticalRecommendation) => {
    setActiveHelperModal(rec)
  }

  // 3. Save for Later
  const handleChoiceSaveLater = (rec: PracticalRecommendation) => {
    saveStoredSavedSkill(rec.id)
    setSavedSkillIds(loadStoredSavedSkills())
    setFeedbackMessages(prev => ({
      ...prev,
      [rec.id]: 'यह विषय आपकी सहेजी गई सूची में सुरक्षित है। जब आपका मन हो, तब पढ़ सकते हैं।'
    }))
  }

  // 4. Already Know
  const handleChoiceAlreadyKnow = (rec: PracticalRecommendation) => {
    saveStoredKnownSkill(rec.id)
    setKnownSkillIds(loadStoredKnownSkills())
    // If it was in saved, remove it
    removeStoredSavedSkill(rec.id)
    setSavedSkillIds(loadStoredSavedSkills())
    setFeedbackMessages(prev => ({
      ...prev,
      [rec.id]: 'शानदार! आपकी यह कुशलता डिजिटल दुनिया में आपको सुरक्षित रखती है।'
    }))
  }

  // Clear Saved Choices
  const handleClearSavedChoices = () => {
    if (window.confirm('क्या आप सभी सहेजे गए विषयों को हटाना चाहते हैं?')) {
      clearAllStoredSavedSkills()
      clearAllStoredKnownSkills()
      setSavedSkillIds([])
      setKnownSkillIds([])
      setFeedbackMessages({})
    }
  }

  return (
    <div className="space-y-8">
      {/* Privacy & Dignity Assurance Banner */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-emerald-100 text-emerald-800 rounded-xl mt-0.5">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-base sm:text-lg flex items-center gap-2">
              <span>मेरी आवश्यकता पहचानें (Conversational Capability Check)</span>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-200 text-emerald-900">
                गोपनीय व सुरक्षित
              </span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              यह कोई परीक्षा या टेस्ट नहीं है। यहाँ कोई अंक, रैंकिंग या पास/फेल नहीं है। हम कभी भी आपका पिन, पासवर्ड, OTP या बैंक खाता संख्या नहीं पूछते।
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setShowSavedDrawer(prev => !prev)}
            className="px-3.5 py-2 bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
          >
            <Bookmark className="w-4 h-4 text-amber-600" />
            <span>सहेजे गए विषय ({savedSkillIds.length})</span>
          </button>
          <button
            onClick={onExitToLibrary}
            className="px-3.5 py-2 bg-slate-900 text-white hover:bg-slate-800 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
          >
            <BookOpen className="w-4 h-4" />
            <span>संपूर्ण पुस्तकालय देखें</span>
          </button>
        </div>
      </div>

      {/* Saved Topics Drawer / Modal */}
      {showSavedDrawer && (
        <div className="bg-amber-50/70 border-2 border-amber-200 rounded-2xl p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bookmark className="w-5 h-5 text-amber-700" />
              <h3 className="text-lg font-bold text-slate-900">
                मेरी सहेजी गई सूचियाँ (My Saved Learning Topics)
              </h3>
            </div>
            <div className="flex items-center gap-2">
              {savedSkillIds.length > 0 && (
                <button
                  onClick={handleClearSavedChoices}
                  className="text-xs text-rose-700 hover:text-rose-900 font-bold flex items-center gap-1 px-2.5 py-1 bg-white rounded-lg border border-rose-200 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  सभी हटाएं
                </button>
              )}
              <button
                onClick={() => setShowSavedDrawer(false)}
                className="p-1.5 text-slate-500 hover:text-slate-800 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {savedSkillIds.length === 0 ? (
            <p className="text-sm text-slate-600 italic">
              अभी आपने कोई विषय सहेज कर नहीं रखा है। सुझावों में "बाद में सीखूँगा" चुनने पर विषय यहाँ जुड़ जाएंगे।
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {savedSkillIds.map(skillId => {
                const item = allRecommendationsCatalog.find(r => r.id === skillId)
                if (!item) return null
                return (
                  <div
                    key={skillId}
                    className="bg-white p-4 rounded-xl border border-amber-200 shadow-xs flex items-center justify-between gap-3"
                  >
                    <div>
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 mb-1 inline-block">
                        {item.badge}
                      </span>
                      <h4 className="font-bold text-slate-900 text-sm">{item.title}</h4>
                      <p className="text-xs text-slate-500 mt-0.5">{item.practicalBenefit}</p>
                    </div>
                    <button
                      onClick={() => onNavigateToContent(item.targetTab, item.targetId, item.targetIndex)}
                      className="shrink-0 px-3 py-1.5 bg-emerald-700 text-white rounded-lg text-xs font-bold hover:bg-emerald-800 transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <span>पढ़ें</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* VIEW A: QUESTIONNAIRE (ONE QUESTION AT A TIME)                 */}
      {/* ------------------------------------------------------------- */}
      {!isCompleted && currentQuestion && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-10 max-w-4xl mx-auto space-y-8">
          {/* Progress Header */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs sm:text-sm font-semibold text-slate-500">
              <span className="flex items-center gap-1.5 text-emerald-800 font-bold">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                प्रश्न {currentQuestionIndex + 1} / {activeQuestions.length}
              </span>
              <span>विषय: {currentQuestion.topic}</span>
            </div>

            {/* Visual Step Progress Dots */}
            <div className="flex items-center gap-1.5 w-full">
              {activeQuestions.map((q, idx) => (
                <div
                  key={q.id}
                  className={`h-2 rounded-full transition-all flex-1 ${
                    idx === currentQuestionIndex
                      ? 'bg-emerald-600 ring-2 ring-emerald-200'
                      : idx < currentQuestionIndex
                      ? 'bg-emerald-400'
                      : 'bg-slate-200'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Question Text in Large Senior-Friendly Font */}
          <div className="space-y-2">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-slate-900 leading-snug">
              {currentQuestion.conversationalHindi}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 font-medium">
              {currentQuestion.englishSubtext}
            </p>
          </div>

          {/* Options List */}
          <div className="space-y-3.5">
            {currentQuestion.options.map(option => {
              const isSelected = answers[currentQuestion.id] === option.id
              return (
                <button
                  key={option.id}
                  onClick={() => handleSelectOption(currentQuestion.id, option.id)}
                  className={`w-full text-left p-4 sm:p-5 rounded-2xl border-2 transition-all flex items-start gap-4 cursor-pointer group ${
                    isSelected
                      ? 'border-emerald-600 bg-emerald-50/80 shadow-sm ring-2 ring-emerald-200'
                      : 'border-slate-200 hover:border-emerald-400 hover:bg-slate-50/80 bg-white'
                  }`}
                >
                  <div
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                      isSelected
                        ? 'border-emerald-600 bg-emerald-600 text-white'
                        : 'border-slate-300 group-hover:border-emerald-500'
                    }`}
                  >
                    {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-white" />}
                  </div>

                  <div className="space-y-1">
                    <div
                      className={`text-base sm:text-lg font-bold leading-relaxed ${
                        isSelected ? 'text-emerald-950' : 'text-slate-900 group-hover:text-emerald-900'
                      }`}
                    >
                      {option.textHindi}
                    </div>
                    {option.subtextHindi && (
                      <div className="text-xs sm:text-sm text-slate-600">
                        {option.subtextHindi}
                      </div>
                    )}
                  </div>
                </button>
              )
            })}
          </div>

          {/* Navigation Controls: Back, Skip, Exit */}
          <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
            <button
              onClick={handlePreviousQuestion}
              disabled={currentQuestionIndex === 0}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
                currentQuestionIndex === 0
                  ? 'text-slate-300 cursor-not-allowed bg-slate-50'
                  : 'text-slate-700 bg-slate-100 hover:bg-slate-200'
              }`}
            >
              <ArrowLeft className="w-4 h-4" />
              <span>पिछला प्रश्न</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={handleSkipQuestion}
                className="px-4 py-2.5 text-xs sm:text-sm font-bold text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              >
                यह प्रश्न छोड़ें (Skip)
              </button>

              <button
                onClick={onExitToLibrary}
                className="px-4 py-2.5 text-xs sm:text-sm font-bold text-rose-700 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
              >
                बातचीत समाप्त करें
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* VIEW B: RECOMMENDATIONS SCREEN (MAX 3 PRACTICAL SKILLS)        */}
      {/* ------------------------------------------------------------- */}
      {isCompleted && (
        <div className="space-y-8 max-w-5xl mx-auto">
          {/* Completion Banner */}
          <div className="bg-gradient-to-r from-teal-900 to-emerald-900 text-white rounded-3xl p-6 sm:p-8 shadow-md">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold mb-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  क्षमता संवाद पूर्ण हुआ
                </div>
                <h2 className="text-xl sm:text-3xl font-extrabold text-white">
                  🎯 आपके लिए उपयोगी व्यावहारिक सुझाव
                </h2>
                <p className="text-xs sm:text-base text-emerald-100 mt-1 max-w-2xl">
                  आपकी बातचीत के आधार पर हमने आपके लिए ये प्रमुख सुरक्षा व उपयोगी कौशल चुने हैं। आप तय करें कि आप क्या सीखना चाहते हैं:
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2.5">
                <button
                  onClick={handleResetAssessment}
                  className="px-3.5 py-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs sm:text-sm font-bold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4 text-amber-300" />
                  <span>दोबारा जांचें</span>
                </button>

                <button
                  onClick={onExitToLibrary}
                  className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs sm:text-sm font-extrabold rounded-xl flex items-center gap-1.5 transition-colors shadow-sm cursor-pointer"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>पुस्तकालय में सब देखें</span>
                </button>
              </div>
            </div>
          </div>

          {/* Recommendations Cards (Max 3) */}
          <div className="space-y-6">
            {recommendations.map((rec, index) => {
              const isSaved = savedSkillIds.includes(rec.id)
              const isKnown = knownSkillIds.includes(rec.id)
              const feedback = feedbackMessages[rec.id]

              return (
                <div
                  key={rec.id}
                  className={`bg-white rounded-3xl border-2 transition-all p-6 sm:p-8 shadow-xs ${
                    isKnown
                      ? 'border-emerald-300 bg-emerald-50/30'
                      : isSaved
                      ? 'border-amber-300 bg-amber-50/20'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  {/* Card Header */}
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2">
                      <span className="w-7 h-7 rounded-full bg-slate-900 text-white text-xs font-black flex items-center justify-center">
                        {index + 1}
                      </span>
                      <span
                        className={`text-xs font-bold px-3 py-1 rounded-full ${
                          rec.badgeColor === 'rose'
                            ? 'bg-rose-100 text-rose-800 border border-rose-200'
                            : rec.badgeColor === 'amber'
                            ? 'bg-amber-100 text-amber-800 border border-amber-200'
                            : rec.badgeColor === 'indigo'
                            ? 'bg-indigo-100 text-indigo-800 border border-indigo-200'
                            : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                        }`}
                      >
                        {rec.badge}
                      </span>
                    </div>

                    {isKnown && (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        अनुभवी कौशल (Already Mastered)
                      </span>
                    )}

                    {isSaved && !isKnown && (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-800 bg-amber-100 px-3 py-1 rounded-full">
                        <Clock className="w-3.5 h-3.5" />
                        बाद के लिए सहेजा गया (Saved)
                      </span>
                    )}
                  </div>

                  {/* Title & Pedagogical Justification */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                    <div className="lg:col-span-8 space-y-3">
                      <div>
                        <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                          {rec.title}
                        </h3>
                        <p className="text-xs sm:text-sm text-slate-500 font-medium">
                          {rec.englishTitle}
                        </p>
                      </div>

                      {/* Why Recommended */}
                      <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1.5">
                        <div className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                          <Info className="w-4 h-4 text-emerald-600" />
                          <span>यह आपके लिए क्यों ज़रूरी है?</span>
                        </div>
                        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                          {rec.whyRecommended}
                        </p>
                      </div>

                      {/* Practical Benefit */}
                      <div className="flex items-start gap-2 text-xs sm:text-sm text-slate-600">
                        <span className="font-bold text-slate-900 shrink-0">व्यावहारिक लाभ:</span>
                        <span>{rec.practicalBenefit}</span>
                      </div>

                      {/* Optional Feedback Toast / Note */}
                      {feedback && (
                        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs sm:text-sm font-semibold text-emerald-900 flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span>{feedback}</span>
                        </div>
                      )}
                    </div>

                    {/* Infographic Preview Thumbnail */}
                    <div className="lg:col-span-4 bg-slate-50 p-3 rounded-2xl border border-slate-200 text-center">
                      <div className="relative group overflow-hidden rounded-xl bg-white border border-slate-200 aspect-[4/3] flex items-center justify-center">
                        <img
                          src={rec.infographicPreview}
                          alt={rec.infographicTitle}
                          className="w-full h-full object-contain p-1 group-hover:scale-105 transition-transform"
                          loading="lazy"
                        />
                        <button
                          onClick={() => onOpenZoom(rec.infographicPreview, rec.infographicTitle)}
                          className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-1.5 text-white text-xs font-bold transition-opacity cursor-pointer"
                        >
                          <ZoomIn className="w-4 h-4" />
                          बड़ा चित्र देखें
                        </button>
                      </div>
                      <div className="text-[11px] font-semibold text-slate-600 mt-2 truncate">
                        {rec.infographicTitle}
                      </div>
                    </div>
                  </div>

                  {/* ------------------------------------------------------------- */}
                  {/* FOUR LEARNER CHOICES PER RECOMMENDATION                       */}
                  {/* ------------------------------------------------------------- */}
                  <div className="mt-6 pt-5 border-t border-slate-100">
                    <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
                      आप इस विषय में क्या करना चाहेंगे? (Choose Your Learning Path):
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                      {/* 1. Learn Independently */}
                      <button
                        onClick={() => handleChoiceLearnSelf(rec)}
                        className="p-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-2xl text-xs sm:text-sm font-bold flex flex-col items-center justify-center gap-1 shadow-xs transition-colors cursor-pointer text-center"
                      >
                        <div className="flex items-center gap-1.5">
                          <span>👤</span>
                          <span>मैं स्वयं सीखूँगा</span>
                        </div>
                        <span className="text-[11px] font-normal text-emerald-100">
                          सचित्र पाठ खोलें →
                        </span>
                      </button>

                      {/* 2. Learn with Trusted Helper */}
                      <button
                        onClick={() => handleChoiceLearnHelper(rec)}
                        className="p-3 bg-teal-50 hover:bg-teal-100 border border-teal-300 text-teal-900 rounded-2xl text-xs sm:text-sm font-bold flex flex-col items-center justify-center gap-1 transition-colors cursor-pointer text-center"
                      >
                        <div className="flex items-center gap-1.5">
                          <Users className="w-4 h-4 text-teal-700" />
                          <span>किसी की मदद से सीखूँगा</span>
                        </div>
                        <span className="text-[11px] font-normal text-teal-700">
                          सहयोगी के लिए नियम देखें
                        </span>
                      </button>

                      {/* 3. Save for Later */}
                      <button
                        onClick={() => handleChoiceSaveLater(rec)}
                        className={`p-3 border rounded-2xl text-xs sm:text-sm font-bold flex flex-col items-center justify-center gap-1 transition-colors cursor-pointer text-center ${
                          isSaved
                            ? 'bg-amber-100 border-amber-400 text-amber-900'
                            : 'bg-slate-50 hover:bg-slate-100 border-slate-300 text-slate-700'
                        }`}
                      >
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-4 h-4 text-amber-700" />
                          <span>बाद में सीखूँगा</span>
                        </div>
                        <span className="text-[11px] font-normal text-slate-500">
                          {isSaved ? 'सूची में सुरक्षित है ✓' : 'सहेज कर रखें'}
                        </span>
                      </button>

                      {/* 4. Already Know */}
                      <button
                        onClick={() => handleChoiceAlreadyKnow(rec)}
                        className={`p-3 border rounded-2xl text-xs sm:text-sm font-bold flex flex-col items-center justify-center gap-1 transition-colors cursor-pointer text-center ${
                          isKnown
                            ? 'bg-emerald-100 border-emerald-400 text-emerald-900'
                            : 'bg-slate-50 hover:bg-slate-100 border-slate-300 text-slate-700'
                        }`}
                      >
                        <div className="flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                          <span>मुझे पहले से आता है</span>
                        </div>
                        <span className="text-[11px] font-normal text-slate-500">
                          {isKnown ? 'कौशल प्रमाणित ✓' : 'छोड़ें (Skip)'}
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Bottom Summary & Exploration Options */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 text-center space-y-4">
            <h3 className="text-lg font-bold text-slate-900">
              पुस्तकालय में 72 सचित्र इन्फोग्राफिक्स उपलब्ध हैं
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto">
              यदि आप अन्य सभी विषयों जैसे 19 वास्तविक स्कैम केस, 11 आदतें, 4 प्रोजेक्ट्स या आपातकालीन गाइड्स को अपनी रुचि से देखना चाहते हैं:
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={onExitToLibrary}
                className="px-6 py-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-sm font-extrabold flex items-center gap-2 shadow-sm transition-colors cursor-pointer"
              >
                <BookOpen className="w-4 h-4" />
                <span>संपूर्ण संदर्भ पुस्तकालय में जाएं →</span>
              </button>
              <button
                onClick={handleResetAssessment}
                className="px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>मूल्यांकन दोबारा करें</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* HELPER GUIDANCE MODAL (WHEN OPTION 2 IS SELECTED)              */}
      {/* ------------------------------------------------------------- */}
      {activeHelperModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 shadow-2xl border border-slate-200">
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4 border-b border-slate-150 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-teal-100 text-teal-800 rounded-2xl">
                  <Users className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xs font-bold text-teal-700 uppercase tracking-wider">
                    पारिवारिक सहयोगी गाइड
                  </span>
                  <h3 className="text-lg sm:text-xl font-extrabold text-slate-900">
                    {activeHelperModal.helperGuidance.title}
                  </h3>
                </div>
              </div>
              <button
                onClick={() => setActiveHelperModal(null)}
                className="p-2 text-slate-400 hover:text-slate-700 rounded-full cursor-pointer"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Strict Security Alert For Helper */}
            <div className="bg-rose-50 border-2 border-rose-300 rounded-2xl p-4 sm:p-5 space-y-2">
              <div className="flex items-center gap-2 text-rose-800 font-extrabold text-sm sm:text-base">
                <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
                <span>अति-महत्वपूर्ण सुरक्षा नियम (Strict Security Rule)</span>
              </div>
              <p className="text-xs sm:text-sm text-rose-950 leading-relaxed font-semibold">
                {activeHelperModal.helperGuidance.strictSecurityRule}
              </p>
              <p className="text-xs text-rose-800">
                सहयोग का अर्थ है वरिष्ठ नागरिक को सिखाना, उनका पासवर्ड या नियंत्रण अपने हाथ में लेना नहीं।
              </p>
            </div>

            {/* Helper Role Description */}
            <div className="space-y-1.5">
              <h4 className="text-sm font-bold text-slate-900">सहयोगी की भूमिका:</h4>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                {activeHelperModal.helperGuidance.helperRole}
              </p>
            </div>

            {/* Step-by-Step Practical Steps for Helper */}
            <div className="space-y-2.5">
              <h4 className="text-sm font-bold text-slate-900">
                साथ मिलकर करने के 4 आसान चरण:
              </h4>
              <div className="space-y-2">
                {activeHelperModal.helperGuidance.stepsForHelper.map((step, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-800"
                  >
                    <span className="w-5 h-5 rounded-full bg-teal-700 text-white font-bold flex items-center justify-center shrink-0 text-xs mt-0.5">
                      {idx + 1}
                    </span>
                    <span>{step}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons in Modal */}
            <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-end gap-3">
              <button
                onClick={() => {
                  const targetRec = activeHelperModal
                  setActiveHelperModal(null)
                  onNavigateToContent(targetRec.targetTab, targetRec.targetId, targetRec.targetIndex)
                }}
                className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <span>साथ मिलकर सचित्र पाठ देखें →</span>
              </button>
              <button
                onClick={() => setActiveHelperModal(null)}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs sm:text-sm font-bold transition-colors cursor-pointer"
              >
                बंद करें
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
