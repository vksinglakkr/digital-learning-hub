import React, { useState, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  BookOpen,
  CheckCircle2,
  Users,
  ShieldCheck,
  AlertTriangle,
  ZoomIn,
  Sparkles,
  Bookmark,
  Trash2,
  X,
  ChevronDown,
  ChevronUp,
  Lightbulb,
  ArrowUp,
  ArrowDown,
  HelpCircle,
  Smartphone
} from 'lucide-react'

import {
  SAATHI_CORE_QUESTIONS,
  SAATHI_MOBILE_FAQS,
  SAATHI_QR_FAQS_BY_PATH,
  SAATHI_QR_ACTIVITIES_BY_PATH,
  SAATHI_BALANCE_FAQS_BY_PATH,
  SAATHI_BALANCE_ACTIVITIES_BY_PATH,
  SAATHI_ATM_FAQS_BY_PATH,
  SAATHI_ATM_ACTIVITIES_BY_PATH,
  LOST_PHONE_MICRO_LESSON,
  QR_HISTORY_MICRO_LESSON,
  QR_SAFE_PRACTICE_MICRO_LESSON,
  QR_VISUAL_INTRO_MICRO_LESSON,
  UPI_APP_RECOGNITION_MICRO_LESSON,
  TRANSFER_COMPARISON_MICRO_LESSON,
  BALANCE_METHODS_OVERVIEW_MICRO_LESSON,
  MISSED_CALL_BALANCE_MICRO_LESSON,
  NETBANKING_DISCOVERY_MICRO_LESSON,
  CDM_CARDLESS_DISCOVERY_MICRO_LESSON,
  ATM_STEP_BY_STEP_MICRO_LESSON,
  ATM_SIMULATED_PRACTICE_MICRO_LESSON,
  BRANCH_WITHDRAWAL_BASICS_MICRO_LESSON,
  getSaathiTopicById,
  UPI_APP_FOLLOW_UP,
  generatePersonalLearningPlan,
  loadStoredSaathiAnswers,
  saveStoredSaathiAnswers,
  loadStoredSaathiCurrentQuestion,
  saveStoredSaathiCurrentQuestion,
  loadStoredSaathiCompleted,
  saveStoredSaathiCompleted,
  loadStoredSaathiUpiCheck,
  saveStoredSaathiUpiCheck,
  clearStoredSaathiData,
  loadStoredSaathiSavedTopics,
  saveStoredSaathiSavedTopic,
  removeStoredSaathiSavedTopic,
  clearAllStoredSaathiSavedTopics,
  loadStoredSaathiKnownTopics,
  saveStoredSaathiKnownTopic,
  loadStoredSaathiSkippedTopics,
  saveStoredSaathiSkippedTopic,
  type SaathiQuestion,
  type SaathiAdviceCard,
  type SaathiLearningTopic,
  type SaathiSavedTopic,
  type HelperGuidance
} from '../../data/digitalBankingSaathiData'

import type { DigitalBankingTab } from './DigitalBankingView'

interface DigitalSaathiPilotProps {
  onNavigateToContent: (tab: DigitalBankingTab, targetId?: string, targetIndex?: number, returnQuestionIndex?: number) => void
  onExitToLibrary: () => void
  onOpenZoom: (url: string, title: string) => void
}

export const DigitalSaathiPilot: React.FC<DigitalSaathiPilotProps> = ({
  onNavigateToContent,
  onExitToLibrary,
  onOpenZoom
}) => {
  const [searchParams] = useSearchParams()

  // Answers State
  const [answers, setAnswers] = useState<Record<string, string>>(() => {
    const profileParam = searchParams.get('profile')
    if (profileParam === 'A') {
      return {
        q1_mobile: 'fingerprint_face',
        q2_qr: 'yes_self',
        q3_balance: 'yes_self',
        q4_atm: 'yes_self'
      }
    }
    if (profileParam === 'B') {
      return {
        q1_mobile: 'pin_pattern',
        q2_qr: 'with_help',
        q3_balance: 'with_help',
        q4_atm: 'with_help'
      }
    }
    if (profileParam === 'C') {
      return {
        q1_mobile: 'swipe',
        q2_qr: 'cannot_pay',
        q3_balance: 'no',
        q4_atm: 'no'
      }
    }
    if (profileParam === 'D') {
      return {
        q1_mobile: 'pin_pattern',
        q2_qr: 'yes_self',
        q3_balance: 'yes_self',
        q4_atm: 'decline'
      }
    }

    const stored = loadStoredSaathiAnswers()
    if (searchParams.get('plan') === '1') {
      return {
        q1_mobile: 'swipe',
        q2_qr: 'with_help',
        q3_balance: 'no',
        q4_atm: 'yes_self'
      }
    }
    const qParam = searchParams.get('q')
    const adviceParam = searchParams.get('advice')
    if (qParam === '2' && adviceParam) {
      const mapped = adviceParam === 'upi_check' ? 'cannot_pay' : adviceParam
      return { q1_mobile: 'swipe', q2_qr: mapped }
    }
    if (qParam === '3' && adviceParam) {
      return { q1_mobile: 'swipe', q2_qr: 'yes_self', q3_balance: adviceParam }
    }
    if (qParam === '4' && adviceParam) {
      const mapped = adviceParam === 'not_interested' ? 'decline' : adviceParam
      return { q1_mobile: 'swipe', q2_qr: 'yes_self', q3_balance: 'yes_self', q4_atm: mapped }
    }
    if (adviceParam) {
      return { q1_mobile: adviceParam }
    }
    if (searchParams.get('faq') || searchParams.get('microlesson')) {
      return { q1_mobile: 'swipe' }
    }
    return stored
  })

  // Conditional UPI App check for Q2
  const [upiAppAnswer, setUpiAppAnswer] = useState<string>(() => {
    const profileParam = searchParams.get('profile')
    if (profileParam === 'C') return 'app_unknown'
    if (profileParam === 'A' || profileParam === 'D') return 'app_exists'

    const stored = loadStoredSaathiUpiCheck()
    if (searchParams.get('q') === '2') {
      if (searchParams.get('upi') === '1' || searchParams.get('advice') === 'upi_check') {
        return 'app_unknown'
      }
      if (searchParams.get('upi') === 'exists') return 'app_exists'
      if (searchParams.get('upi') === 'no') return 'no_app'
    }
    return stored
  })

  // Current Question Index (0 to 3)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(() => {
    const qParam = searchParams.get('q')
    if (qParam) {
      const idx = parseInt(qParam, 10) - 1
      if (idx >= 0 && idx < SAATHI_CORE_QUESTIONS.length) return idx
    }
    return loadStoredSaathiCurrentQuestion()
  })

  // Completed State
  const [isCompleted, setIsCompleted] = useState<boolean>(() => {
    if (searchParams.get('profile')) return true
    if (searchParams.get('plan') === '1') return true
    if (loadStoredSaathiCompleted()) return true
    return false
  })

  // Saved Topics (Full Objects from localStorage)
  const [savedTopics, setSavedTopics] = useState<SaathiSavedTopic[]>(() => {
    const stored = loadStoredSaathiSavedTopics()
    if (stored.length > 0) return stored
    if (searchParams.get('saved') === '1') {
      return [
        getSaathiTopicById('topic_mobile_security'),
        getSaathiTopicById('topic_lost_phone_readiness')
      ]
    }
    return []
  })

  const [knownTopics, setKnownTopics] = useState<string[]>(() => loadStoredSaathiKnownTopics())
  const [skippedTopics, setSkippedTopics] = useState<string[]>(() => loadStoredSaathiSkippedTopics())
  const [showAdditionalTopics, setShowAdditionalTopics] = useState<boolean>(() => searchParams.get('more') === '1')
  const [feedbackMessages, setFeedbackMessages] = useState<Record<string, string>>({})
  const [activeHelperModal, setActiveHelperModal] = useState<HelperGuidance | null>(null)

  // Reusable Micro-Lesson Modal state
  const [activeMicroLessonKey, setActiveMicroLessonKey] = useState<
    | 'lost_phone'
    | 'qr_history'
    | 'qr_safe_practice'
    | 'qr_visual_intro'
    | 'upi_app_recognition'
    | 'transfer_comparison'
    | 'balance_methods_overview'
    | 'missed_call_balance'
    | 'netbanking_discovery'
    | 'cdm_cardless_discovery'
    | 'atm_step_by_step'
    | 'atm_simulated_practice'
    | 'branch_withdrawal_basics'
    | null
  >(() => {
    const mlParam = searchParams.get('microlesson')
    if (!mlParam) return null
    if (mlParam === '1' || mlParam === 'lost_phone') return 'lost_phone'
    if (mlParam === 'qr_history') return 'qr_history'
    if (mlParam === 'qr_safe_practice') return 'qr_safe_practice'
    if (mlParam === 'qr_visual_intro') return 'qr_visual_intro'
    if (mlParam === 'upi_app_recognition') return 'upi_app_recognition'
    if (mlParam === 'transfer_comparison') return 'transfer_comparison'
    if (mlParam === 'balance_methods_overview') return 'balance_methods_overview'
    if (mlParam === 'missed_call_balance') return 'missed_call_balance'
    if (mlParam === 'netbanking_discovery') return 'netbanking_discovery'
    if (mlParam === 'cdm_cardless_discovery') return 'cdm_cardless_discovery'
    if (mlParam === 'atm_step_by_step') return 'atm_step_by_step'
    if (mlParam === 'atm_simulated_practice') return 'atm_simulated_practice'
    if (mlParam === 'branch_withdrawal_basics') return 'branch_withdrawal_basics'
    return null
  })

  const [showSavedDrawer, setShowSavedDrawer] = useState<boolean>(() => {
    return searchParams.get('saved') === '1'
  })

  // Expandable FAQs State for Question 1 & Question 2
  const [expandedFaqId, setExpandedFaqId] = useState<string | null>(() => {
    const faqParam = searchParams.get('faq')
    if (!faqParam) return null
    if (faqParam.startsWith('faq_')) return faqParam
    if (faqParam === '2') return 'faq_2_pattern_vs_fingerprint'
    if (faqParam === '1') return 'faq_1_why_lock'
    if (faqParam === '3') return 'faq_3_worn_fingerprints'
    if (faqParam === '4') return 'faq_4_spouse_sharing'
    if (faqParam === '5') return 'faq_5_lost_phone_prep'
    return null
  })

  // Current Question Object
  const currentQuestion: SaathiQuestion = SAATHI_CORE_QUESTIONS[currentQuestionIndex] || SAATHI_CORE_QUESTIONS[0]
  const currentSelectedOptionId = answers[currentQuestion.id]
  const currentAdvice: SaathiAdviceCard | undefined = currentSelectedOptionId
    ? currentQuestion.adviceByOption[currentSelectedOptionId]
    : undefined

  // Personal Learning Plan with reordering support & filtering
  const [userReorderedPlan, setUserReorderedPlan] = useState<SaathiLearningTopic[] | null>(null)

  const rawPlan = useMemo(() => {
    if (userReorderedPlan !== null) return userReorderedPlan
    return generatePersonalLearningPlan(answers, upiAppAnswer)
  }, [answers, upiAppAnswer, userReorderedPlan])

  // Filter out topics marked as already known or skipped
  const learningPlan = useMemo(() => {
    return rawPlan.filter(
      topic => !knownTopics.includes(topic.id) && !skippedTopics.includes(topic.id)
    )
  }, [rawPlan, knownTopics, skippedTopics])

  // Up to 3 priority recommendations; remaining topics go under "और क्या सीख सकते हैं?"
  const priorityTopics = useMemo(() => learningPlan.slice(0, 3), [learningPlan])
  const additionalTopics = useMemo(() => learningPlan.slice(3), [learningPlan])

  // Select Option Handler
  const handleSelectOption = (questionId: string, optionId: string) => {
    const updated = { ...answers, [questionId]: optionId }
    setAnswers(updated)
    saveStoredSaathiAnswers(updated)
    saveStoredSaathiCurrentQuestion(currentQuestionIndex)
  }

  // Next Question Handler
  const handleNextQuestion = () => {
    if (currentQuestionIndex < SAATHI_CORE_QUESTIONS.length - 1) {
      const nextIdx = currentQuestionIndex + 1
      setCurrentQuestionIndex(nextIdx)
      saveStoredSaathiCurrentQuestion(nextIdx)
      saveStoredSaathiCompleted(false)
      window.scrollTo({ top: 320, behavior: 'smooth' })
    } else {
      setIsCompleted(true)
      saveStoredSaathiCompleted(true)
      window.scrollTo({ top: 320, behavior: 'smooth' })
    }
  }

  // Previous Question Handler
  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      const prevIdx = currentQuestionIndex - 1
      setCurrentQuestionIndex(prevIdx)
      saveStoredSaathiCurrentQuestion(prevIdx)
      saveStoredSaathiCompleted(false)
      window.scrollTo({ top: 320, behavior: 'smooth' })
    }
  }

  // Reset Handler
  const handleReset = () => {
    if (window.confirm('क्या आप बातचीत को शुरू से दोबारा करना चाहते हैं?')) {
      clearStoredSaathiData()
      saveStoredSaathiCurrentQuestion(0)
      saveStoredSaathiCompleted(false)
      setAnswers({})
      setUpiAppAnswer('')
      setCurrentQuestionIndex(0)
      setIsCompleted(false)
      setUserReorderedPlan(null)
      setSavedTopics([])
      setKnownTopics([])
      setSkippedTopics([])
      setShowAdditionalTopics(false)
      setFeedbackMessages({})
      window.scrollTo({ top: 320, behavior: 'smooth' })
    }
  }

  // Helper to preserve scroll position and question index before opening lessons/projects
  const navigateWithState = (targetTab: DigitalBankingTab, targetId?: string, targetIndex?: number) => {
    try {
      sessionStorage.setItem('dlh_saathi_scroll_y', window.scrollY.toString())
      sessionStorage.setItem('dlh_saathi_last_q', currentQuestionIndex.toString())
    } catch {}
    saveStoredSaathiCurrentQuestion(currentQuestionIndex)
    onNavigateToContent(targetTab, targetId, targetIndex, currentQuestionIndex)
  }

  // Learner Choice Handlers
  const handleChoiceLearnNow = (advice: SaathiAdviceCard) => {
    if (advice.isMicroLesson && advice.microLessonKey) {
      setActiveMicroLessonKey(advice.microLessonKey)
    } else {
      navigateWithState(advice.targetTab, advice.targetId, advice.targetIndex)
    }
  }

  const handleChoiceHelper = (advice: SaathiAdviceCard) => {
    if (advice.helperGuidance) {
      setActiveHelperModal(advice.helperGuidance)
    } else {
      setActiveHelperModal({
        title: advice.titleHindi,
        helperRole: 'वरिष्ठ नागरिक के साथ बैठकर शांति से सेटिंग्स व प्रक्रिया दिखाएं।',
        stepsForHelper: [
          'वरिष्ठ नागरिक को स्क्रीन पर सही बटन दिखाएं।',
          'उन्हें खुद अपनी उंगली से दबाने दें।',
          'समझाएं कि बिना घबराए शांत रहकर कैसे पढ़ा जाता है।'
        ],
        strictSecurityRule: 'सहयोगी के लिए नियम: अपना PIN, पासवर्ड या OTP कभी किसी को न बताएं।'
      })
    }
  }

  // Topic Helper for Learning Plan cards
  const handleTopicHelper = (topic: SaathiLearningTopic) => {
    setActiveHelperModal({
      title: topic.titleHindi,
      helperRole: `वरिष्ठ नागरिक के साथ बैठकर '${topic.titleHindi}' का शांत व धैर्यपूर्वक अभ्यास करवाएं।`,
      stepsForHelper: [
        'वरिष्ठ नागरिक को स्क्रीन पर सही विकल्प और बटन दिखाएं।',
        'उन्हें खुद अपनी उंगली से दबाने दें और सोचने का पूरा समय दें।',
        `व्यावहारिक लाभ समझाएं: ${topic.practicalBenefitHindi}`,
        'उन्हें आश्वस्त करें कि जब तक सही पुष्टि न हो, कोई गलत ट्रांजैक्शन नहीं होता।'
      ],
      strictSecurityRule: 'सहयोगी के लिए नियम: वरिष्ठ नागरिक का बैंक PIN, पासवर्ड या OTP कभी न पूछें और न खुद दर्ज करें।'
    })
  }

  // Bulletproof "बाद में सीखें" Handler
  const handleChoiceSaveLater = (topicIdOrKey: string) => {
    const topicToSave = getSaathiTopicById(topicIdOrKey)
    saveStoredSaathiSavedTopic(topicToSave)
    const updatedSaved = loadStoredSaathiSavedTopics()
    setSavedTopics(updatedSaved)
    setFeedbackMessages(prev => ({
      ...prev,
      [topicIdOrKey]: `✓ '${topicToSave.titleHindi}' को "बाद में सीखेंगे" में सुरक्षित सहेज लिया गया है।`
    }))
  }

  // Remove Single Saved Topic
  const handleRemoveSavedTopic = (topicId: string) => {
    removeStoredSaathiSavedTopic(topicId)
    setSavedTopics(loadStoredSaathiSavedTopics())
  }

  // Clear All Saved Topics
  const handleClearAllSaved = () => {
    if (window.confirm('क्या आप "बाद में सीखेंगे" सूची के सभी विषयों को हटाना चाहते हैं?')) {
      clearAllStoredSaathiSavedTopics()
      setSavedTopics([])
    }
  }

  const handleChoiceAlreadyKnow = (topicId: string) => {
    saveStoredSaathiKnownTopic(topicId)
    setKnownTopics(loadStoredSaathiKnownTopics())
    removeStoredSaathiSavedTopic(topicId)
    setSavedTopics(loadStoredSaathiSavedTopics())
    if (userReorderedPlan) {
      setUserReorderedPlan(userReorderedPlan.filter(t => t.id !== topicId))
    }
    setFeedbackMessages(prev => ({
      ...prev,
      [topicId]: 'आपने बताया कि यह आता है ✓'
    }))
  }

  // Learning Plan Reorder Handlers
  const handleMoveTopicUp = (index: number) => {
    if (index === 0) return
    const updated = [...learningPlan]
    const temp = updated[index - 1]
    updated[index - 1] = updated[index]
    updated[index] = temp
    setUserReorderedPlan(updated)
  }

  const handleMoveTopicDown = (index: number) => {
    if (index === learningPlan.length - 1) return
    const updated = [...learningPlan]
    const temp = updated[index + 1]
    updated[index + 1] = updated[index]
    updated[index] = temp
    setUserReorderedPlan(updated)
  }

  const handleSkipTopic = (topicId: string) => {
    saveStoredSaathiSkippedTopic(topicId)
    setSkippedTopics(loadStoredSaathiSkippedTopics())
    if (userReorderedPlan) {
      setUserReorderedPlan(userReorderedPlan.filter(t => t.id !== topicId))
    }
    setFeedbackMessages(prev => ({
      ...prev,
      [topicId]: 'विषय छोड़ दिया गया है (अब यह योजना में नहीं दिखेगा) ✓'
    }))
  }

  const toggleFaq = (faqId: string) => {
    setExpandedFaqId(prev => (prev === faqId ? null : faqId))
  }

  return (
    <div className="space-y-8">
      {/* 1. Dignity & Privacy Top Banner */}
      <div className="bg-emerald-50/90 border border-emerald-200 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="p-2.5 bg-emerald-100 text-emerald-800 rounded-xl mt-0.5">
            <ShieldCheck className="w-6 h-6 text-emerald-700" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-extrabold text-slate-900 text-base sm:text-lg">
                डिजिटल साथी (Digital Saathi) — 4 आसान सवाल
              </h3>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-200 text-emerald-950">
                शिक्षार्थी-प्रथम संवाद
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              यह कोई परीक्षा या टेस्ट नहीं है। कोई अंक या पास/फेल नहीं है। हम केवल यह समझना चाहते हैं कि आप पहले से क्या जानते हैं और क्या सीखना चाहते हैं।
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setShowSavedDrawer(prev => !prev)}
            className="px-3.5 py-2 bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
          >
            <Bookmark className="w-4 h-4 text-amber-600" />
            <span>बाद में सीखेंगे ({savedTopics.length})</span>
          </button>
          <button
            onClick={onExitToLibrary}
            className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            title="72 मौलिक सचित्र चार्ट पुस्तकालय में सीधे जाएं"
          >
            <BookOpen className="w-4 h-4 text-slate-600" />
            <span>संपूर्ण संदर्भ पुस्तकालय</span>
          </button>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* SAVED TOPICS DRAWER: "बाद में सीखेंगे"                         */}
      {/* ------------------------------------------------------------- */}
      {showSavedDrawer && (
        <div className="bg-amber-50/90 border-2 border-amber-300 rounded-3xl p-5 sm:p-7 space-y-4 shadow-sm animate-in fade-in duration-200">
          <div className="flex items-center justify-between border-b border-amber-200 pb-3">
            <div className="flex items-center gap-2.5">
              <Bookmark className="w-5 h-5 text-amber-800" />
              <div>
                <h3 className="text-lg sm:text-xl font-extrabold text-slate-900">
                  बाद में सीखेंगे (Saved Topics)
                </h3>
                <span className="text-xs text-slate-600">
                  यहाँ वे सभी विषय सुरक्षित हैं जिन्हें आपने बाद में पढ़ने के लिए सहेजा है।
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {savedTopics.length > 0 && (
                <button
                  onClick={handleClearAllSaved}
                  className="px-3 py-1.5 bg-white border border-rose-200 text-rose-700 hover:bg-rose-50 rounded-xl text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>सभी हटाएं</span>
                </button>
              )}
              <button
                onClick={() => setShowSavedDrawer(false)}
                className="p-1.5 text-slate-500 hover:text-slate-800 rounded-lg cursor-pointer"
                title="बंद करें"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {savedTopics.length === 0 ? (
            <p className="text-sm text-slate-600 italic py-3 text-center">
              अभी आपकी "बाद में सीखेंगे" सूची खाली है। किसी भी सवाल या गतिविधि के नीचे "बाद में सीखें" दबाने पर वह विषय यहाँ सुरक्षित जुड़ जाएगा।
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-1">
              {savedTopics.map(topic => (
                <div
                  key={topic.id}
                  className="bg-white p-4 sm:p-5 rounded-2xl border border-amber-200 shadow-xs flex flex-col justify-between gap-3"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900">
                        सहेजा गया विषय
                      </span>
                      <button
                        onClick={() => handleRemoveSavedTopic(topic.id)}
                        className="text-slate-400 hover:text-rose-600 text-xs font-bold flex items-center gap-0.5 cursor-pointer"
                        title="सूची से हटाएं"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>हटाएं</span>
                      </button>
                    </div>
                    <h4 className="font-extrabold text-slate-900 text-sm sm:text-base">
                      {topic.titleHindi}
                    </h4>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {topic.descriptionHindi || topic.practicalBenefitHindi}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-end">
                    <button
                      onClick={() => {
                        if (topic.isMicroLesson && topic.microLessonKey) {
                          setActiveMicroLessonKey(topic.microLessonKey)
                        } else {
                          navigateWithState(topic.targetTab, topic.targetId, topic.targetIndex)
                        }
                      }}
                      className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-extrabold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                    >
                      <span>अभी सीखें</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* VIEW A: CONVERSATIONAL QUESTION SCREEN (1 AT A TIME)          */}
      {/* ------------------------------------------------------------- */}
      {!isCompleted && currentQuestion && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-10 max-w-4xl mx-auto space-y-7">
          {/* Progress Header */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs sm:text-sm font-semibold text-slate-500">
              <span className="flex items-center gap-1.5 text-emerald-800 font-bold">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                सवाल {currentQuestionIndex + 1} / {SAATHI_CORE_QUESTIONS.length}
              </span>
              <span className="text-slate-400">
                {currentQuestion.order === 1
                  ? 'मोबाइल सुरक्षा'
                  : currentQuestion.order === 2
                  ? 'QR कोड पेमेंट'
                  : currentQuestion.order === 3
                  ? 'बैंक बैलेंस'
                  : 'ATM का उपयोग'}
              </span>
            </div>

            {/* Step Progress Dots */}
            <div className="flex items-center gap-2 w-full">
              {SAATHI_CORE_QUESTIONS.map((q, idx) => (
                <div
                  key={q.id}
                  className={`h-2.5 rounded-full transition-all flex-1 ${
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

          {/* Question Heading in Large Senior-Friendly Font */}
          <div className="space-y-1.5">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 leading-snug">
              {currentQuestion.titleHindi}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 font-medium">
              {currentQuestion.englishSubtext}
            </p>
          </div>

          {/* Options Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {currentQuestion.options.map(option => {
              const isSelected = currentSelectedOptionId === option.id
              return (
                <button
                  key={option.id}
                  onClick={() => handleSelectOption(currentQuestion.id, option.id)}
                  className={`text-left p-4 sm:p-5 rounded-2xl border-2 transition-all flex items-start gap-3.5 cursor-pointer group ${
                    isSelected
                      ? 'border-emerald-600 bg-emerald-50/90 shadow-xs ring-2 ring-emerald-200'
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

          {/* ------------------------------------------------------------- */}
          {/* IMMEDIATE ADVICE CARD (DISPLAYED DIRECTLY ON SELECTION)       */}
          {/* ------------------------------------------------------------- */}
          {currentAdvice && (
            <div className="bg-gradient-to-br from-emerald-50/70 via-teal-50/50 to-white border-2 border-emerald-300 rounded-3xl p-5 sm:p-7 space-y-5 shadow-sm animate-in fade-in duration-300">
              <div className="flex items-center justify-between gap-2 border-b border-emerald-200/80 pb-3">
                <div className="flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-amber-600 shrink-0" />
                  <h3 className="text-base sm:text-lg font-extrabold text-slate-900">
                    {currentAdvice.titleHindi}
                  </h3>
                </div>
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-200 text-emerald-900">
                  तुरंत सलाह
                </span>
              </div>

              {/* Explanation */}
              <div className="space-y-3">
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                  {currentAdvice.explanationHindi}
                </p>
                {currentAdvice.practicalSuggestionHindi && (
                  <div className="p-3 bg-white rounded-xl border border-emerald-200 text-xs sm:text-sm text-slate-800">
                    <span className="font-bold text-emerald-900">व्यावहारिक सुझाव: </span>
                    <span>{currentAdvice.practicalSuggestionHindi}</span>
                  </div>
                )}
              </div>

              {/* --------------------------------------------------------- */}
              {/* SPECIAL FOR Q1: ADAPTIVE OPTIONAL ACTIVITIES (PHASE 5.12A)*/}
              {/* --------------------------------------------------------- */}
              {currentQuestion.id === 'q1_mobile' && currentSelectedOptionId && (
                <div className="space-y-3 pt-2 border-t border-emerald-200">
                  <div className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
                    {currentSelectedOptionId === 'biometric' || currentSelectedOptionId === 'pin_pattern'
                      ? 'आपके लिए उपयोगी सुरक्षा तैयारी (Choose Any or Proceed):'
                      : 'आपके लिए दो उपयोगी व्यावहारिक गतिविधियां (Choose Any or Proceed):'}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                    {/* Activity A: Only for Swipe (Lock Setup) or Unknown (Lock Identity) */}
                    {currentSelectedOptionId === 'swipe' && (
                      <div className="bg-white p-4 rounded-2xl border-2 border-emerald-300 shadow-xs flex flex-col justify-between space-y-3">
                        <div>
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] font-black px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900">
                              गतिविधि A
                            </span>
                            <span className="text-xs text-slate-400">वैकल्पिक</span>
                          </div>
                          <h4 className="font-extrabold text-slate-900 text-sm sm:text-base mt-1.5">
                            📱 Mobile Lock लगाना सीखें
                          </h4>
                          <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                            PIN, Pattern, Fingerprint या Face Lock सेट करने की सचित्र मार्गदर्शिका।
                          </p>
                        </div>

                        <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                          <button
                            onClick={() => handleChoiceLearnNow(currentAdvice)}
                            className="px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold flex items-center gap-1 shadow-xs transition-colors cursor-pointer"
                          >
                            <span>सचित्र अभ्यास खोलें</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleChoiceSaveLater('topic_mobile_security')}
                            className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-300 text-slate-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                          >
                            बाद में सीखें
                          </button>
                        </div>
                      </div>
                    )}

                    {currentSelectedOptionId === 'unknown' && (
                      <div className="bg-white p-4 rounded-2xl border-2 border-teal-300 shadow-xs flex flex-col justify-between space-y-3">
                        <div>
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] font-black px-2 py-0.5 rounded-full bg-teal-100 text-teal-900">
                              गतिविधि A
                            </span>
                            <span className="text-xs text-slate-400">वैकल्पिक</span>
                          </div>
                          <h4 className="font-extrabold text-slate-900 text-sm sm:text-base mt-1.5">
                            🔍 फोन लॉक है या नहीं, ऐसे जांचें
                          </h4>
                          <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                            स्क्रीन बंद करके दोबारा चालू करें और देखें कि फोन सीधे खुलता है या कोई कोड/पैटर्न मांगता है।
                          </p>
                        </div>

                        <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                          <button
                            onClick={() => handleChoiceLearnNow(currentAdvice)}
                            className="px-3.5 py-1.5 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-bold flex items-center gap-1 shadow-xs transition-colors cursor-pointer"
                          >
                            <span>सचित्र पहचान देखें</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleChoiceSaveLater('topic_mobile_lock_identify')}
                            className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-300 text-slate-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                          >
                            बाद में सीखें
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Activity: Lost Phone Readiness (Shown for all, never as deficiency) */}
                    <div className="bg-white p-4 rounded-2xl border-2 border-amber-300 shadow-xs flex flex-col justify-between space-y-3">
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-black px-2 py-0.5 rounded-full bg-amber-100 text-amber-900">
                            {currentSelectedOptionId === 'swipe' || currentSelectedOptionId === 'unknown' ? 'गतिविधि B' : 'अनुशंसित तैयारी'}
                          </span>
                          <span className="text-xs text-slate-400">वैकल्पिक</span>
                        </div>
                        <h4 className="font-extrabold text-slate-900 text-sm sm:text-base mt-1.5">
                          🛡️ फोन खो जाए तो क्या करें? पहले से तैयारी रखें
                        </h4>
                        <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                          Find My Device, रिकवरी ईमेल व फोन नंबर जांचने की 2-मिनट की तैयारी।
                        </p>
                      </div>

                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                        <button
                          onClick={() => setActiveMicroLessonKey('lost_phone')}
                          className="px-3.5 py-1.5 bg-amber-700 hover:bg-amber-800 text-white rounded-xl text-xs font-bold flex items-center gap-1 shadow-xs transition-colors cursor-pointer"
                        >
                          <span>तैयारी गाइड खोलें</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleChoiceSaveLater('topic_lost_phone_readiness')}
                          className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-300 text-slate-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                        >
                          बाद में सीखें
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* --------------------------------------------------------- */}
              {/* SPECIAL FOR Q2: DUAL ADAPTIVE ACTIVITIES (PHASE 5.8)      */}
              {/* --------------------------------------------------------- */}
              {currentQuestion.id === 'q2_qr' &&
                currentSelectedOptionId &&
                SAATHI_QR_ACTIVITIES_BY_PATH[currentSelectedOptionId] && (
                  <div className="space-y-3 pt-2 border-t border-emerald-200">
                    <div className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
                      आपके चुने हुए उत्तर के अनुसार दो अनुशंसित गतिविधियां (Choose Any or Proceed):
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                      {SAATHI_QR_ACTIVITIES_BY_PATH[currentSelectedOptionId].map(act => (
                        <div
                          key={act.id}
                          className={`bg-white p-4 rounded-2xl border-2 shadow-xs flex flex-col justify-between space-y-3 ${
                            act.letterBadge === 'A' ? 'border-emerald-300' : 'border-teal-300'
                          }`}
                        >
                          <div>
                            <div className="flex items-center justify-between">
                              <span
                                className={`text-[11px] font-black px-2 py-0.5 rounded-full ${
                                  act.letterBadge === 'A'
                                    ? 'bg-emerald-100 text-emerald-900'
                                    : 'bg-teal-100 text-teal-900'
                                }`}
                              >
                                गतिविधि {act.letterBadge}
                              </span>
                              <span className="text-xs text-slate-400">वैकल्पिक</span>
                            </div>
                            <h4 className="font-extrabold text-slate-900 text-sm sm:text-base mt-1.5">
                              {act.titleHindi}
                            </h4>
                            <p className="text-[11px] font-semibold text-slate-500 mt-0.5">
                              {act.subtitleHindi}
                            </p>
                            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                              {act.descriptionHindi}
                            </p>
                          </div>

                          <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                            <button
                              onClick={() => {
                                if (act.isMicroLesson && act.microLessonKey) {
                                  setActiveMicroLessonKey(act.microLessonKey)
                                } else {
                                  navigateWithState(act.targetTab, act.targetId, act.targetIndex)
                                }
                              }}
                              className={`px-3.5 py-1.5 text-white rounded-xl text-xs font-bold flex items-center gap-1 shadow-xs transition-colors cursor-pointer ${
                                act.letterBadge === 'A'
                                  ? 'bg-emerald-700 hover:bg-emerald-800'
                                  : 'bg-teal-700 hover:bg-teal-800'
                              }`}
                            >
                              <span>{act.actionLabelHindi}</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleChoiceSaveLater(act.id)}
                              className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-300 text-slate-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                            >
                              बाद में सीखें
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              {/* --------------------------------------------------------- */}
              {/* SPECIAL FOR Q3: DUAL ADAPTIVE ACTIVITIES (PHASE 5.9)      */}
              {/* --------------------------------------------------------- */}
              {currentQuestion.id === 'q3_balance' &&
                currentSelectedOptionId &&
                SAATHI_BALANCE_ACTIVITIES_BY_PATH[currentSelectedOptionId] && (
                  <div className="space-y-3 pt-2 border-t border-emerald-200">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
                        आपके चुने हुए उत्तर के अनुसार दो अनुशंसित गतिविधियां (Choose Any or Proceed):
                      </div>
                      {/* Optional Internet Banking Discovery Link on Path A */}
                      {currentSelectedOptionId === 'yes_self' && (
                        <button
                          onClick={() => setActiveMicroLessonKey('netbanking_discovery')}
                          className="text-xs font-bold text-teal-800 hover:text-teal-950 underline flex items-center gap-1 cursor-pointer"
                        >
                          <span>🌐 Internet Banking से क्या-क्या कर सकते हैं?</span>
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                      {SAATHI_BALANCE_ACTIVITIES_BY_PATH[currentSelectedOptionId].map(act => (
                        <div
                          key={act.id}
                          className={`bg-white p-4 rounded-2xl border-2 shadow-xs flex flex-col justify-between space-y-3 ${
                            act.letterBadge === 'A' ? 'border-emerald-300' : 'border-teal-300'
                          }`}
                        >
                          <div>
                            <div className="flex items-center justify-between">
                              <span
                                className={`text-[11px] font-black px-2 py-0.5 rounded-full ${
                                  act.letterBadge === 'A'
                                    ? 'bg-emerald-100 text-emerald-900'
                                    : 'bg-teal-100 text-teal-900'
                                }`}
                              >
                                गतिविधि {act.letterBadge}
                              </span>
                              <span className="text-xs text-slate-400">वैकल्पिक</span>
                            </div>
                            <h4 className="font-extrabold text-slate-900 text-sm sm:text-base mt-1.5">
                              {act.titleHindi}
                            </h4>
                            <p className="text-[11px] font-semibold text-slate-500 mt-0.5">
                              {act.subtitleHindi}
                            </p>
                            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                              {act.descriptionHindi}
                            </p>
                          </div>

                          <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                            <button
                              onClick={() => {
                                if (act.isMicroLesson && act.microLessonKey) {
                                  setActiveMicroLessonKey(act.microLessonKey)
                                } else {
                                  navigateWithState(act.targetTab, act.targetId, act.targetIndex)
                                }
                              }}
                              className={`px-3.5 py-1.5 text-white rounded-xl text-xs font-bold flex items-center gap-1 shadow-xs transition-colors cursor-pointer ${
                                act.letterBadge === 'A'
                                  ? 'bg-emerald-700 hover:bg-emerald-800'
                                  : 'bg-teal-700 hover:bg-teal-800'
                              }`}
                            >
                              <span>{act.actionLabelHindi}</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleChoiceSaveLater(act.id)}
                              className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-300 text-slate-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                            >
                              बाद में सीखें
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* ------------------------------------------------------------- */}
                {/* QUESTION 4: DUAL ADAPTIVE ACTIVITIES (PHASE 5.10)            */}
                {/* ------------------------------------------------------------- */}
                {currentQuestion.id === 'q4_atm' &&
                  currentSelectedOptionId &&
                  SAATHI_ATM_ACTIVITIES_BY_PATH[currentSelectedOptionId] && (
                    <div className="pt-2 space-y-3">
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <div className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
                          आपके चुने हुए उत्तर के अनुसार दो अनुशंसित गतिविधियां (Choose Any or Proceed):
                        </div>
                        {/* Optional CDM/Cardless Discovery Link on Path A */}
                        {currentSelectedOptionId === 'yes_self' && (
                          <button
                            onClick={() => setActiveMicroLessonKey('cdm_cardless_discovery')}
                            className="text-xs font-bold text-teal-800 hover:text-teal-950 underline flex items-center gap-1 cursor-pointer"
                          >
                            <span>🏧 UPI-ATM व CDM मशीन क्या है?</span>
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                        {SAATHI_ATM_ACTIVITIES_BY_PATH[currentSelectedOptionId].map(act => (
                          <div
                            key={act.id}
                            className={`bg-white p-4 rounded-2xl border-2 shadow-xs flex flex-col justify-between space-y-3 ${
                              act.letterBadge === 'A' ? 'border-emerald-300' : 'border-teal-300'
                            }`}
                          >
                            <div>
                              <div className="flex items-center justify-between">
                                <span
                                  className={`text-[11px] font-black px-2 py-0.5 rounded-full ${
                                    act.letterBadge === 'A'
                                      ? 'bg-emerald-100 text-emerald-900'
                                      : 'bg-teal-100 text-teal-900'
                                  }`}
                                >
                                  गतिविधि {act.letterBadge}
                                </span>
                                <span className="text-xs text-slate-400">वैकल्पिक</span>
                              </div>
                              <h4 className="font-extrabold text-slate-900 text-sm sm:text-base mt-1.5">
                                {act.titleHindi}
                              </h4>
                              <p className="text-[11px] font-semibold text-slate-500 mt-0.5">
                                {act.subtitleHindi}
                              </p>
                              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                                {act.descriptionHindi}
                              </p>
                            </div>

                            <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                              <button
                                onClick={() => {
                                  if (act.isMicroLesson && act.microLessonKey) {
                                    setActiveMicroLessonKey(act.microLessonKey)
                                  } else {
                                    navigateWithState(act.targetTab, act.targetId, act.targetIndex)
                                  }
                                }}
                                className={`px-3.5 py-1.5 text-white rounded-xl text-xs font-bold flex items-center gap-1 shadow-xs transition-colors cursor-pointer ${
                                  act.letterBadge === 'A'
                                    ? 'bg-emerald-700 hover:bg-emerald-800'
                                    : 'bg-teal-700 hover:bg-teal-800'
                                }`}
                              >
                                <span>{act.actionLabelHindi}</span>
                                <ArrowRight className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleChoiceSaveLater(act.id)}
                                className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-300 text-slate-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                              >
                                बाद में सीखें
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

              {/* Forward Navigation on Q1 after activities */}
              {currentQuestion.id === 'q1_mobile' && (
                <div className="pt-3 border-t border-emerald-100 flex items-center justify-between gap-3">
                  <span className="text-xs text-slate-500">
                    आप बिना अभ्यास किए भी अगले सवाल पर आगे बढ़ सकते हैं:
                  </span>
                  <button
                    onClick={handleNextQuestion}
                    className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs sm:text-sm font-extrabold flex items-center gap-1.5 transition-colors shadow-sm cursor-pointer"
                  >
                    <span>अगला प्रश्न →</span>
                  </button>
                </div>
              )}

              {/* Forward Navigation on Q2 after activities */}
              {currentQuestion.id === 'q2_qr' && (
                <div className="pt-3 border-t border-emerald-100 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      onClick={() => handleChoiceHelper(currentAdvice)}
                      className="px-3.5 py-2 bg-teal-50 hover:bg-teal-100 border border-teal-300 text-teal-900 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Users className="w-3.5 h-3.5 text-teal-700" />
                      <span>सहायता से सीखें</span>
                    </button>
                    <button
                      onClick={() => handleChoiceAlreadyKnow('topic_qr_payment')}
                      className="px-3 py-2 text-slate-500 hover:text-slate-800 text-xs font-bold transition-colors cursor-pointer"
                    >
                      मुझे पहले से आता है
                    </button>
                  </div>
                  <button
                    onClick={handleNextQuestion}
                    className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs sm:text-sm font-extrabold flex items-center gap-1.5 transition-colors shadow-sm cursor-pointer ml-auto"
                  >
                    <span>अगला प्रश्न →</span>
                  </button>
                </div>
              )}

              {/* Forward Navigation on Q3 after activities */}
              {currentQuestion.id === 'q3_balance' && (
                <div className="pt-3 border-t border-emerald-100 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      onClick={() => handleChoiceHelper(currentAdvice)}
                      className="px-3.5 py-2 bg-teal-50 hover:bg-teal-100 border border-teal-300 text-teal-900 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Users className="w-3.5 h-3.5 text-teal-700" />
                      <span>सहायता से सीखें</span>
                    </button>
                    <button
                      onClick={() => handleChoiceAlreadyKnow('topic_balance_checking')}
                      className="px-3 py-2 text-slate-500 hover:text-slate-800 text-xs font-bold transition-colors cursor-pointer"
                    >
                      मुझे पहले से आता है
                    </button>
                  </div>
                  <button
                    onClick={handleNextQuestion}
                    className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs sm:text-sm font-extrabold flex items-center gap-1.5 transition-colors shadow-sm cursor-pointer ml-auto"
                  >
                    <span>अगला प्रश्न →</span>
                  </button>
                </div>
              )}

              {/* Forward Navigation on Q4 after activities */}
              {currentQuestion.id === 'q4_atm' && (
                <div className="pt-3 border-t border-emerald-100 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      onClick={() => handleChoiceHelper(currentAdvice)}
                      className="px-3.5 py-2 bg-teal-50 hover:bg-teal-100 border border-teal-300 text-teal-900 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Users className="w-3.5 h-3.5 text-teal-700" />
                      <span>सहायता से सीखें</span>
                    </button>
                    <button
                      onClick={() => handleChoiceAlreadyKnow('topic_atm_safety')}
                      className="px-3 py-2 text-slate-500 hover:text-slate-800 text-xs font-bold transition-colors cursor-pointer"
                    >
                      मुझे पहले से आता है
                    </button>
                  </div>
                  <button
                    onClick={handleNextQuestion}
                    className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs sm:text-sm font-extrabold flex items-center gap-1.5 transition-colors shadow-sm cursor-pointer ml-auto"
                  >
                    <span>योजना देखें →</span>
                  </button>
                </div>
              )}

              {/* Clear Hindi Feedback Toast */}
              {feedbackMessages[currentQuestion.id] && (
                <div className="p-3 bg-emerald-100 text-emerald-950 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 animate-in fade-in">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span>{feedbackMessages[currentQuestion.id]}</span>
                </div>
              )}
              {Object.entries(feedbackMessages).map(([key, msg]) => {
                if (key === currentQuestion.id) return null
                return (
                  <div
                    key={key}
                    className="p-3 bg-emerald-100 text-emerald-950 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 animate-in fade-in"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                    <span>{msg}</span>
                  </div>
                )
              })}
            </div>
          )}

          {/* ------------------------------------------------------------- */}
          {/* QUESTION 1 SPECIAL: FIVE REAL-LIFE FAQS (PHASE 5.7)           */}
          {/* ------------------------------------------------------------- */}
          {currentQuestion.id === 'q1_mobile' && (
            <div className="bg-slate-50 rounded-3xl border border-slate-200 p-5 sm:p-7 space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
                <HelpCircle className="w-5 h-5 text-emerald-700 shrink-0" />
                <div>
                  <h3 className="text-base sm:text-lg font-extrabold text-slate-900">
                    आपके मन में भी ये सवाल हो सकते हैं
                  </h3>
                  <span className="text-xs text-slate-500">
                    वरिष्ठ नागरिकों द्वारा अक्सर पूछे जाने वाले 5 महत्वपूर्ण व्यावहारिक सवाल:
                  </span>
                </div>
              </div>

              <div className="space-y-2.5">
                {SAATHI_MOBILE_FAQS.map(faq => {
                  const isExpanded = expandedFaqId === faq.id
                  return (
                    <div
                      key={faq.id}
                      className="bg-white rounded-2xl border border-slate-200 overflow-hidden transition-all shadow-xs"
                    >
                      <button
                        onClick={() => toggleFaq(faq.id)}
                        className="w-full p-4 text-left flex items-center justify-between gap-3 font-bold text-slate-900 text-xs sm:text-sm hover:bg-slate-50 transition-colors cursor-pointer"
                      >
                        <span className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-emerald-600 shrink-0" />
                          <span>{faq.questionHindi}</span>
                        </span>
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4 text-emerald-700 shrink-0" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                        )}
                      </button>

                      {isExpanded && (
                        <div className="px-4 pb-4 pt-1 text-xs sm:text-sm text-slate-700 leading-relaxed border-t border-slate-100 bg-slate-50/50 space-y-2.5 animate-in fade-in">
                          <p className="whitespace-pre-line">{faq.answerHindi}</p>
                          <div className="p-2.5 bg-emerald-50 text-emerald-950 rounded-xl text-xs font-semibold flex items-center gap-2">
                            <Lightbulb className="w-4 h-4 text-amber-600 shrink-0" />
                            <span>{faq.keyTakeawayHindi}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* ------------------------------------------------------------- */}
          {/* QUESTION 2 SPECIAL: CONDITIONAL UPI APP RECOGNITION PROMPT    */}
          {/* ------------------------------------------------------------- */}
          {currentQuestion.id === 'q2_qr' &&
            currentSelectedOptionId === 'cannot_pay' && (
              <div className="bg-teal-50/70 border-2 border-teal-300 rounded-3xl p-5 sm:p-6 space-y-4">
                <div className="flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-teal-700 shrink-0" />
                  <h3 className="text-sm sm:text-base font-extrabold text-slate-900">
                    {UPI_APP_FOLLOW_UP.questionHindi}
                  </h3>
                </div>
                <p className="text-xs sm:text-sm text-slate-600">
                  {UPI_APP_FOLLOW_UP.subtextHindi}
                </p>

                {/* Sub-options for UPI App */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {UPI_APP_FOLLOW_UP.options.map(subOpt => (
                    <button
                      key={subOpt.id}
                      onClick={() => {
                        setUpiAppAnswer(subOpt.id)
                        saveStoredSaathiUpiCheck(subOpt.id)
                      }}
                      className={`text-left p-3.5 rounded-xl border-2 transition-all cursor-pointer ${
                        upiAppAnswer === subOpt.id
                          ? 'border-teal-700 bg-teal-100/90 font-bold text-teal-950 ring-2 ring-teal-200'
                          : 'border-slate-200 bg-white hover:border-teal-400 text-slate-800'
                      }`}
                    >
                      <div className="text-xs sm:text-sm font-bold">{subOpt.textHindi}</div>
                      <div className="text-[11px] text-slate-500 mt-0.5">{subOpt.subtextHindi}</div>
                    </button>
                  ))}
                </div>

                {/* Immediate guidance on recognizing app icon */}
                {upiAppAnswer && UPI_APP_FOLLOW_UP.guidanceByOption[upiAppAnswer] && (
                  <div className="p-3.5 bg-white rounded-xl border border-teal-200 space-y-1.5 text-xs sm:text-sm">
                    <div className="font-bold text-teal-900">
                      {UPI_APP_FOLLOW_UP.guidanceByOption[upiAppAnswer].titleHindi}
                    </div>
                    <p className="text-slate-700 whitespace-pre-line">
                      {UPI_APP_FOLLOW_UP.guidanceByOption[upiAppAnswer].messageHindi}
                    </p>
                    <div className="font-semibold text-emerald-800 pt-1">
                      💡 {UPI_APP_FOLLOW_UP.guidanceByOption[upiAppAnswer].actionSuggestionHindi}
                    </div>
                  </div>
                )}
              </div>
            )}

          {/* ------------------------------------------------------------- */}
          {/* QUESTION 2 SPECIAL: THREE ADAPTIVE PATH-SPECIFIC FAQS (PHASE 5.8) */}
          {/* ------------------------------------------------------------- */}
          {currentQuestion.id === 'q2_qr' &&
            currentSelectedOptionId &&
            SAATHI_QR_FAQS_BY_PATH[currentSelectedOptionId] && (
              <div className="bg-slate-50 rounded-3xl border border-slate-200 p-5 sm:p-7 space-y-4">
                <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
                  <HelpCircle className="w-5 h-5 text-emerald-700 shrink-0" />
                  <div>
                    <h3 className="text-base sm:text-lg font-extrabold text-slate-900">
                      इस स्थिति में अक्सर पूछे जाने वाले 3 सवाल
                    </h3>
                    <span className="text-xs text-slate-500">
                      आपके उत्तर के अनुसार महत्वपूर्ण व्यावहारिक स्पष्टीकरण:
                    </span>
                  </div>
                </div>

                <div className="space-y-2.5">
                  {SAATHI_QR_FAQS_BY_PATH[currentSelectedOptionId].map(faq => {
                    const isExpanded = expandedFaqId === faq.id
                    return (
                      <div
                        key={faq.id}
                        className="bg-white rounded-2xl border border-slate-200 overflow-hidden transition-all shadow-xs"
                      >
                        <button
                          onClick={() => toggleFaq(faq.id)}
                          className="w-full p-4 text-left flex items-center justify-between gap-3 font-bold text-slate-900 text-xs sm:text-sm hover:bg-slate-50 transition-colors cursor-pointer"
                        >
                          <span className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-emerald-600 shrink-0" />
                            <span>{faq.questionHindi}</span>
                          </span>
                          {isExpanded ? (
                            <ChevronUp className="w-4 h-4 text-emerald-700 shrink-0" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                          )}
                        </button>

                        {isExpanded && (
                          <div className="px-4 pb-4 pt-1 text-xs sm:text-sm text-slate-700 leading-relaxed border-t border-slate-100 bg-slate-50/50 space-y-2.5 animate-in fade-in">
                            <p className="whitespace-pre-line">{faq.answerHindi}</p>
                            <div className="p-2.5 bg-emerald-50 text-emerald-950 rounded-xl text-xs font-semibold flex items-center gap-2">
                              <Lightbulb className="w-4 h-4 text-amber-600 shrink-0" />
                              <span>{faq.keyTakeawayHindi}</span>
                            </div>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

          {/* ------------------------------------------------------------- */}
          {/* QUESTION 3 SPECIAL: THREE ADAPTIVE PATH-SPECIFIC FAQS (PHASE 5.9) */}
          {/* ------------------------------------------------------------- */}
          {currentQuestion.id === 'q3_balance' &&
            currentSelectedOptionId &&
            SAATHI_BALANCE_FAQS_BY_PATH[currentSelectedOptionId] && (
              <div className="bg-slate-50 rounded-3xl border border-slate-200 p-5 sm:p-7 space-y-4">
                <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
                  <HelpCircle className="w-5 h-5 text-emerald-700 shrink-0" />
                  <div>
                    <h3 className="text-base sm:text-lg font-extrabold text-slate-900">
                      इस स्थिति में अक्सर पूछे जाने वाले 3 सवाल
                    </h3>
                    <span className="text-xs text-slate-500">
                      आपके उत्तर के अनुसार महत्वपूर्ण व्यावहारिक स्पष्टीकरण:
                    </span>
                  </div>
                </div>

                <div className="space-y-2.5">
                  {SAATHI_BALANCE_FAQS_BY_PATH[currentSelectedOptionId].map(faq => {
                    const isExpanded = expandedFaqId === faq.id
                    return (
                      <div
                        key={faq.id}
                        className="bg-white rounded-2xl border border-slate-200 overflow-hidden transition-all shadow-xs"
                      >
                        <button
                          onClick={() => toggleFaq(faq.id)}
                          className="w-full p-4 text-left flex items-center justify-between gap-3 font-bold text-slate-900 text-xs sm:text-sm hover:bg-slate-50 transition-colors cursor-pointer"
                        >
                          <span className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-emerald-600 shrink-0" />
                            <span>{faq.questionHindi}</span>
                          </span>
                          {isExpanded ? (
                            <ChevronUp className="w-4 h-4 text-emerald-700 shrink-0" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                          )}
                        </button>

                        {isExpanded && (
                          <div className="px-4 pb-4 pt-1 text-xs sm:text-sm text-slate-700 leading-relaxed border-t border-slate-100 bg-slate-50/50 space-y-2.5 animate-in fade-in">
                            <p className="whitespace-pre-line">{faq.answerHindi}</p>
                            <div className="p-2.5 bg-emerald-50 text-emerald-950 rounded-xl text-xs font-semibold flex items-center gap-2">
                              <Lightbulb className="w-4 h-4 text-amber-600 shrink-0" />
                              <span>{faq.keyTakeawayHindi}</span>
                            </div>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

          {/* ------------------------------------------------------------- */}
          {/* QUESTION 4 SPECIAL: THREE ADAPTIVE PATH-SPECIFIC FAQS (PHASE 5.10) */}
          {/* ------------------------------------------------------------- */}
          {currentQuestion.id === 'q4_atm' &&
            currentSelectedOptionId &&
            SAATHI_ATM_FAQS_BY_PATH[currentSelectedOptionId] && (
              <div className="bg-slate-50 rounded-3xl border border-slate-200 p-5 sm:p-7 space-y-4">
                <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
                  <HelpCircle className="w-5 h-5 text-emerald-700 shrink-0" />
                  <div>
                    <h3 className="text-base sm:text-lg font-extrabold text-slate-900">
                      इस स्थिति में अक्सर पूछे जाने वाले 3 सवाल
                    </h3>
                    <span className="text-xs text-slate-500">
                      आपके उत्तर के अनुसार महत्वपूर्ण व्यावहारिक स्पष्टीकरण:
                    </span>
                  </div>
                </div>

                <div className="space-y-2.5">
                  {SAATHI_ATM_FAQS_BY_PATH[currentSelectedOptionId].map(faq => {
                    const isExpanded = expandedFaqId === faq.id
                    return (
                      <div
                        key={faq.id}
                        className="bg-white rounded-2xl border border-slate-200 overflow-hidden transition-all shadow-xs"
                      >
                        <button
                          onClick={() => toggleFaq(faq.id)}
                          className="w-full p-4 text-left flex items-center justify-between gap-3 font-bold text-slate-900 text-xs sm:text-sm hover:bg-slate-50 transition-colors cursor-pointer"
                        >
                          <span className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-emerald-600 shrink-0" />
                            <span>{faq.questionHindi}</span>
                          </span>
                          {isExpanded ? (
                            <ChevronUp className="w-4 h-4 text-emerald-700 shrink-0" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                          )}
                        </button>

                        {isExpanded && (
                          <div className="px-4 pb-4 pt-1 text-xs sm:text-sm text-slate-700 leading-relaxed border-t border-slate-100 bg-slate-50/50 space-y-2.5 animate-in fade-in">
                            <p className="whitespace-pre-line">{faq.answerHindi}</p>
                            <div className="p-2.5 bg-emerald-50 text-emerald-950 rounded-xl text-xs font-semibold flex items-center gap-2">
                              <Lightbulb className="w-4 h-4 text-amber-600 shrink-0" />
                              <span>{faq.keyTakeawayHindi}</span>
                            </div>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

          {/* Navigation Controls: Back & Exit */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
            <button
              onClick={handlePrevQuestion}
              disabled={currentQuestionIndex === 0}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
                currentQuestionIndex === 0
                  ? 'text-slate-300 cursor-not-allowed bg-slate-50'
                  : 'text-slate-700 bg-slate-100 hover:bg-slate-200'
              }`}
            >
              <ArrowLeft className="w-4 h-4" />
              <span>पिछला सवाल</span>
            </button>

            <button
              onClick={onExitToLibrary}
              className="px-4 py-2.5 text-xs sm:text-sm font-bold text-slate-500 hover:text-slate-800 rounded-xl transition-colors cursor-pointer"
            >
              पुस्तकालय में सभी विषय देखें
            </button>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* VIEW B: PERSONAL LEARNING PLAN (AFTER 4 QUESTIONS)            */}
      {/* ------------------------------------------------------------- */}
      {isCompleted && (
        <div className="space-y-8 max-w-5xl mx-auto">
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-teal-900 to-emerald-900 text-white rounded-3xl p-6 sm:p-8 shadow-md">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold mb-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  बातचीत पूर्ण हुई
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                  🎯 आपकी व्यक्तिगत शिक्षण योजना (Personal Learning Plan)
                </h2>
                <p className="text-xs sm:text-base text-emerald-100 mt-1 max-w-2xl">
                  आपके उत्तरों के आधार पर हमने आपके लिए ये सरल व उपयोगी गतिविधियां चुनी हैं। आप जिसे चाहें पहले सीखें, छोड़ें या अपनी गति से अभ्यास करें।
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2.5">
                <button
                  onClick={handleReset}
                  className="px-3.5 py-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs sm:text-sm font-bold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4 text-amber-300" />
                  <span>दोबारा शुरू करें</span>
                </button>
                <button
                  onClick={onExitToLibrary}
                  className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs sm:text-sm font-extrabold rounded-xl flex items-center gap-1.5 transition-colors shadow-sm cursor-pointer"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>संपूर्ण पुस्तकालय</span>
                </button>
              </div>
            </div>
          </div>

          {/* Empty State: If all topics are marked known or skipped */}
          {learningPlan.length === 0 && (
            <div className="bg-emerald-50/80 border-2 border-emerald-300 rounded-3xl p-6 sm:p-8 text-center space-y-4">
              <div className="w-14 h-14 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center mx-auto shadow-xs">
                <CheckCircle2 className="w-8 h-8 text-emerald-700" />
              </div>
              <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                बहुत खूब! आपकी व्यक्तिगत शिक्षण सूची पूरी हो चुकी है
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto">
                आपने सभी सुझाए गए विषयों की समीक्षा कर ली है या वे आपको पहले से आते हैं। अब आप जब चाहें सीधे संपूर्ण संदर्भ पुस्तकालय में 72 मौलिक सचित्र चार्ट देख सकते हैं।
              </p>
              <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
                <button
                  onClick={onExitToLibrary}
                  className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs sm:text-sm font-bold shadow-xs transition-colors cursor-pointer flex items-center gap-2"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>संपूर्ण संदर्भ पुस्तकालय में जाएं →</span>
                </button>
                <button
                  onClick={handleReset}
                  className="px-4 py-2.5 bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 rounded-xl text-xs sm:text-sm font-bold transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <RotateCcw className="w-4 h-4 text-slate-500" />
                  <span>बातचीत दोबारा शुरू करें</span>
                </button>
              </div>
            </div>
          )}

          {/* Primary Priority Activity Card (Featured Prominently - Item 1) */}
          {priorityTopics.length > 0 && (
            <div className="bg-gradient-to-br from-amber-50/80 via-white to-emerald-50/50 border-2 border-amber-300 rounded-3xl p-6 sm:p-8 shadow-sm space-y-5">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <span className="px-3 py-1 bg-amber-100 text-amber-900 border border-amber-200 rounded-full text-xs font-extrabold flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  प्राथमिकता 1: मुख्य अनुशंसित गतिविधि (Primary Activity)
                </span>
                <span className="text-xs font-bold text-slate-500">
                  प्राथमिक कार्य 1 / {priorityTopics.length}
                </span>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                <div className="lg:col-span-8 space-y-4">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-slate-900 text-white">
                        {priorityTopics[0].badgeText}
                      </span>
                      {savedTopics.some(t => t.id === priorityTopics[0].id) && (
                        <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800">
                          सहेजा गया ✓
                        </span>
                      )}
                    </div>
                    <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                      {priorityTopics[0].titleHindi}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
                      {priorityTopics[0].englishTitle}
                    </p>
                  </div>

                  {/* Structured Details: What, Why, How */}
                  <div className="space-y-2.5 text-xs sm:text-sm">
                    <div className="p-3 bg-white/90 rounded-xl border border-slate-200">
                      <span className="font-bold text-slate-900">क्या सीखेंगे: </span>
                      <span className="text-slate-700">{priorityTopics[0].reasonHindi}</span>
                    </div>

                    <div className="p-3 bg-white/90 rounded-xl border border-amber-200">
                      <span className="font-bold text-amber-900">यह क्यों जरूरी है (व्यावहारिक लाभ): </span>
                      <span className="text-slate-800">{priorityTopics[0].practicalBenefitHindi}</span>
                    </div>

                    <div className="p-3 bg-emerald-50/70 rounded-xl border border-emerald-200 text-emerald-950">
                      <span className="font-bold text-emerald-900">शुरुआत कैसे करें: </span>
                      <span>सचित्र गाइड खोलें या सहयोगी के साथ बैठकर 2-मिनट में शांत अभ्यास करें।</span>
                    </div>
                  </div>

                  {/* Feedback Message */}
                  {feedbackMessages[priorityTopics[0].id] && (
                    <div className="p-2.5 bg-emerald-100/80 text-emerald-900 text-xs font-bold rounded-xl border border-emerald-200 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                      <span>{feedbackMessages[priorityTopics[0].id]}</span>
                    </div>
                  )}

                  {/* 5 Explicit Learner Action Buttons */}
                  <div className="pt-2 flex flex-wrap items-center gap-2">
                    {/* Action 1: Learn Now */}
                    <button
                      onClick={() => {
                        if (priorityTopics[0].isMicroLesson && priorityTopics[0].microLessonKey) {
                          setActiveMicroLessonKey(priorityTopics[0].microLessonKey)
                        } else {
                          navigateWithState(
                            priorityTopics[0].targetTab,
                            priorityTopics[0].targetId,
                            priorityTopics[0].targetIndex
                          )
                        }
                      }}
                      className="px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                    >
                      <span>अभी स्वयं सीखें</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>

                    {/* Action 2: Learn with Helper */}
                    <button
                      onClick={() => handleTopicHelper(priorityTopics[0])}
                      className="px-3.5 py-2.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-800 border border-indigo-200 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Users className="w-4 h-4 text-indigo-600" />
                      <span>सहायता से सीखें</span>
                    </button>

                    {/* Action 3: Save for Later */}
                    <button
                      onClick={() => handleChoiceSaveLater(priorityTopics[0].id)}
                      className="px-3.5 py-2.5 bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Bookmark className="w-4 h-4 text-amber-600" />
                      <span>बाद में सीखें</span>
                    </button>

                    {/* Action 4: Already Know */}
                    <button
                      onClick={() => handleChoiceAlreadyKnow(priorityTopics[0].id)}
                      className="px-3 py-2 text-slate-600 hover:text-slate-900 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>मुझे पहले से आता है</span>
                    </button>

                    {/* Action 5: Skip Topic */}
                    <button
                      onClick={() => handleSkipTopic(priorityTopics[0].id)}
                      className="px-3 py-2 text-slate-400 hover:text-rose-600 text-xs font-bold transition-colors cursor-pointer"
                    >
                      छोड़ें
                    </button>
                  </div>
                </div>

                {/* Infographic Thumbnail */}
                <div className="lg:col-span-4 bg-white p-3 rounded-2xl border border-amber-200 text-center">
                  <div className="relative group overflow-hidden rounded-xl bg-slate-50 border border-slate-200 aspect-[4/3] flex items-center justify-center">
                    <img
                      src={priorityTopics[0].infographicPreview}
                      alt={priorityTopics[0].infographicTitle}
                      className="w-full h-full object-contain p-1 group-hover:scale-105 transition-transform"
                      loading="lazy"
                    />
                    <button
                      onClick={() =>
                        onOpenZoom(
                          priorityTopics[0].infographicPreview,
                          priorityTopics[0].infographicTitle
                        )
                      }
                      className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-1.5 text-white text-xs font-bold transition-opacity cursor-pointer"
                    >
                      <ZoomIn className="w-4 h-4" />
                      बड़ा चित्र देखें
                    </button>
                  </div>
                  <div className="text-[11px] font-semibold text-slate-600 mt-2 truncate">
                    {priorityTopics[0].infographicTitle}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Secondary Priority Topics List (Items 2 and 3 of Priority) */}
          {priorityTopics.length > 1 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <h3 className="text-base sm:text-lg font-bold text-slate-900">
                  अन्य प्राथमिक अनुशंसित गतिविधियां ({priorityTopics.length - 1}):
                </h3>
                <span className="text-xs text-slate-500">
                  आप तीर (↑ ↓) से अपनी पसंद के अनुसार क्रम बदल सकते हैं
                </span>
              </div>

              <div className="space-y-4">
                {priorityTopics.slice(1).map((topic, idx) => {
                  const actualIndex = idx + 1
                  const isSaved = savedTopics.some(t => t.id === topic.id)

                  return (
                    <div
                      key={topic.id}
                      className={`bg-white rounded-2xl border p-5 sm:p-6 transition-all shadow-xs space-y-4 ${
                        isSaved
                          ? 'border-amber-300 bg-amber-50/20'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                        <div className="space-y-2 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-xs font-black w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center">
                              {actualIndex + 1}
                            </span>
                            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
                              {topic.badgeText}
                            </span>
                            {isSaved && (
                              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800">
                                सहेजा गया ✓
                              </span>
                            )}
                          </div>

                          <h4 className="text-base sm:text-lg font-bold text-slate-900">
                            {topic.titleHindi}
                          </h4>
                          <p className="text-xs text-slate-500 font-medium">
                            {topic.englishTitle}
                          </p>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1">
                            <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                              <span className="font-bold text-slate-800">क्या सीखेंगे: </span>
                              <span className="text-slate-600">{topic.reasonHindi}</span>
                            </div>
                            <div className="p-2.5 bg-amber-50/60 rounded-xl border border-amber-200/80">
                              <span className="font-bold text-amber-900">यह क्यों जरूरी है: </span>
                              <span className="text-slate-700">{topic.practicalBenefitHindi}</span>
                            </div>
                          </div>
                        </div>

                        {/* Reorder Buttons */}
                        <div className="flex items-center gap-1 shrink-0 self-start">
                          <button
                            onClick={() => handleMoveTopicUp(actualIndex)}
                            title="ऊपर ले जाएं"
                            className="p-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-100 cursor-pointer"
                          >
                            <ArrowUp className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleMoveTopicDown(actualIndex)}
                            disabled={actualIndex === priorityTopics.length - 1}
                            title="नीचे ले जाएं"
                            className="p-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-100 disabled:opacity-40 cursor-pointer"
                          >
                            <ArrowDown className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Feedback Message */}
                      {feedbackMessages[topic.id] && (
                        <div className="p-2 bg-emerald-100 text-emerald-900 text-xs font-bold rounded-lg border border-emerald-200 flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                          <span>{feedbackMessages[topic.id]}</span>
                        </div>
                      )}

                      {/* 5 Action Buttons */}
                      <div className="pt-1 flex flex-wrap items-center gap-2 border-t border-slate-100">
                        <button
                          onClick={() => {
                            if (topic.isMicroLesson && topic.microLessonKey) {
                              setActiveMicroLessonKey(topic.microLessonKey)
                            } else {
                              navigateWithState(
                                topic.targetTab,
                                topic.targetId,
                                topic.targetIndex
                              )
                            }
                          }}
                          className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs sm:text-sm font-bold rounded-xl transition-colors cursor-pointer flex items-center gap-1.5 shadow-2xs"
                        >
                          <span>अभी स्वयं सीखें</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => handleTopicHelper(topic)}
                          className="px-3.5 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-800 border border-indigo-200 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <Users className="w-3.5 h-3.5 text-indigo-600" />
                          <span>सहायता से सीखें</span>
                        </button>

                        <button
                          onClick={() => handleChoiceSaveLater(topic.id)}
                          className="px-3 py-2 bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <Bookmark className="w-3.5 h-3.5 text-amber-600" />
                          <span>बाद में सीखें</span>
                        </button>

                        <button
                          onClick={() => handleChoiceAlreadyKnow(topic.id)}
                          className="px-3 py-2 text-slate-600 hover:text-slate-900 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>मुझे पहले से आता है</span>
                        </button>

                        <button
                          onClick={() => handleSkipTopic(topic.id)}
                          className="px-3 py-2 text-xs font-bold text-slate-400 hover:text-rose-600 cursor-pointer"
                        >
                          छोड़ें
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Additional Recommendations: "और क्या सीख सकते हैं?" (Collapsed by default) */}
          {additionalTopics.length > 0 && (
            <div className="bg-slate-50/90 border border-slate-200 rounded-3xl p-5 sm:p-6 space-y-4">
              <button
                onClick={() => setShowAdditionalTopics(prev => !prev)}
                className="w-full flex items-center justify-between gap-3 text-left cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-indigo-100 text-indigo-800 rounded-2xl group-hover:bg-indigo-200 transition-colors">
                    <Sparkles className="w-5 h-5 text-indigo-700" />
                  </div>
                  <div>
                    <h4 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-indigo-900 transition-colors">
                      और क्या सीख सकते हैं? ({additionalTopics.length} अतिरिक्त विषय)
                    </h4>
                    <p className="text-xs text-slate-500">
                      ये विषय भी आपके उत्तरों के अनुसार उपयोगी हैं — जब चाहें अपनी पसंद से देखें
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-indigo-700 hidden sm:inline">
                    {showAdditionalTopics ? 'छुपाएं' : 'देखें'}
                  </span>
                  {showAdditionalTopics ? (
                    <ChevronUp className="w-5 h-5 text-slate-600 group-hover:text-indigo-700" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-slate-600 group-hover:text-indigo-700" />
                  )}
                </div>
              </button>

              {showAdditionalTopics && (
                <div className="pt-3 space-y-3.5 border-t border-slate-200">
                  {additionalTopics.map((topic, idx) => {
                    const displayIndex = priorityTopics.length + idx + 1
                    const isSaved = savedTopics.some(t => t.id === topic.id)

                    return (
                      <div
                        key={topic.id}
                        className={`bg-white rounded-2xl border p-4 sm:p-5 transition-all shadow-xs space-y-3 ${
                          isSaved
                            ? 'border-amber-300 bg-amber-50/20'
                            : 'border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-xs font-black w-6 h-6 rounded-full bg-slate-600 text-white flex items-center justify-center">
                                {displayIndex}
                              </span>
                              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                                {topic.badgeText}
                              </span>
                              {isSaved && (
                                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                                  सहेजा गया ✓
                                </span>
                              )}
                            </div>
                            <h5 className="text-base font-bold text-slate-900">
                              {topic.titleHindi}
                            </h5>
                            <p className="text-xs text-slate-600">
                              {topic.reasonHindi}
                            </p>
                            <p className="text-xs text-amber-900 font-medium">
                              लाभ: {topic.practicalBenefitHindi}
                            </p>
                          </div>
                        </div>

                        {/* Feedback Message */}
                        {feedbackMessages[topic.id] && (
                          <div className="p-2 bg-emerald-100 text-emerald-900 text-xs font-bold rounded-lg border border-emerald-200 flex items-center gap-1.5">
                            <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                            <span>{feedbackMessages[topic.id]}</span>
                          </div>
                        )}

                        {/* 5 Actions */}
                        <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-100">
                          <button
                            onClick={() => {
                              if (topic.isMicroLesson && topic.microLessonKey) {
                                setActiveMicroLessonKey(topic.microLessonKey)
                              } else {
                                navigateWithState(
                                  topic.targetTab,
                                  topic.targetId,
                                  topic.targetIndex
                                )
                              }
                            }}
                            className="px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer flex items-center gap-1"
                          >
                            <span>सीखें</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => handleTopicHelper(topic)}
                            className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-800 border border-indigo-200 rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer"
                          >
                            <Users className="w-3.5 h-3.5 text-indigo-600" />
                            <span>सहायता</span>
                          </button>

                          <button
                            onClick={() => handleChoiceSaveLater(topic.id)}
                            className="px-3 py-1.5 bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer"
                          >
                            <Bookmark className="w-3.5 h-3.5 text-amber-600" />
                            <span>सहेजें</span>
                          </button>

                          <button
                            onClick={() => handleChoiceAlreadyKnow(topic.id)}
                            className="px-2.5 py-1.5 text-slate-600 hover:text-slate-900 text-xs font-bold cursor-pointer"
                          >
                            आता है ✓
                          </button>

                          <button
                            onClick={() => handleSkipTopic(topic.id)}
                            className="px-2.5 py-1.5 text-xs font-bold text-slate-400 hover:text-rose-600 cursor-pointer"
                          >
                            छोड़ें
                          </button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )}

          {/* Bottom Reference Library Card */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 text-center space-y-4">
            <h3 className="text-lg sm:text-xl font-bold text-slate-900">
              संपूर्ण संदर्भ पुस्तकालय (72 मौलिक सचित्र चार्ट)
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto">
              आप 19 साइबर स्कैम केस, 11 आदतें, 4 प्रोजेक्ट्स और आपातकालीन नंबर 1930 को कभी भी सीधे पुस्तकालय में देख सकते हैं।
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={onExitToLibrary}
                className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-sm font-extrabold flex items-center gap-2 shadow-sm transition-colors cursor-pointer"
              >
                <BookOpen className="w-4 h-4" />
                <span>संपूर्ण संदर्भ पुस्तकालय में जाएं →</span>
              </button>
              <button
                onClick={handleReset}
                className="px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>बातचीत दोबारा शुरू करें</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* REUSABLE MICRO-LESSON MODAL (PHASE 5.7 & 5.8)                  */}
      {/* ------------------------------------------------------------- */}
      {activeMicroLessonKey && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 shadow-2xl border border-slate-200 animate-in fade-in">
            {/* Header */}
            <div className="flex items-start justify-between gap-4 border-b border-slate-150 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-amber-100 text-amber-800 rounded-2xl">
                  <Smartphone className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xs font-bold text-amber-800 uppercase tracking-wider">
                    माइक्रो-गाइड (2 मिनट)
                  </span>
                  <h3 className="text-lg sm:text-xl font-extrabold text-slate-900">
                    {activeMicroLessonKey === 'lost_phone'
                      ? LOST_PHONE_MICRO_LESSON.titleHindi
                      : activeMicroLessonKey === 'qr_history'
                      ? QR_HISTORY_MICRO_LESSON.titleHindi
                      : activeMicroLessonKey === 'qr_safe_practice'
                      ? QR_SAFE_PRACTICE_MICRO_LESSON.titleHindi
                      : activeMicroLessonKey === 'qr_visual_intro'
                      ? QR_VISUAL_INTRO_MICRO_LESSON.titleHindi
                      : activeMicroLessonKey === 'upi_app_recognition'
                      ? UPI_APP_RECOGNITION_MICRO_LESSON.titleHindi
                      : activeMicroLessonKey === 'transfer_comparison'
                      ? TRANSFER_COMPARISON_MICRO_LESSON.titleHindi
                      : activeMicroLessonKey === 'balance_methods_overview'
                      ? BALANCE_METHODS_OVERVIEW_MICRO_LESSON.titleHindi
                      : activeMicroLessonKey === 'missed_call_balance'
                      ? MISSED_CALL_BALANCE_MICRO_LESSON.titleHindi
                      : activeMicroLessonKey === 'netbanking_discovery'
                      ? NETBANKING_DISCOVERY_MICRO_LESSON.titleHindi
                      : activeMicroLessonKey === 'cdm_cardless_discovery'
                      ? CDM_CARDLESS_DISCOVERY_MICRO_LESSON.titleHindi
                      : activeMicroLessonKey === 'atm_step_by_step'
                      ? ATM_STEP_BY_STEP_MICRO_LESSON.titleHindi
                      : activeMicroLessonKey === 'atm_simulated_practice'
                      ? ATM_SIMULATED_PRACTICE_MICRO_LESSON.titleHindi
                      : BRANCH_WITHDRAWAL_BASICS_MICRO_LESSON.titleHindi}
                  </h3>
                </div>
              </div>
              <button
                onClick={() => setActiveMicroLessonKey(null)}
                className="p-2 text-slate-400 hover:text-slate-700 rounded-full cursor-pointer"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {activeMicroLessonKey === 'lost_phone'
                ? LOST_PHONE_MICRO_LESSON.subtitleHindi
                : activeMicroLessonKey === 'qr_history'
                ? QR_HISTORY_MICRO_LESSON.subtitleHindi
                : activeMicroLessonKey === 'qr_safe_practice'
                ? QR_SAFE_PRACTICE_MICRO_LESSON.subtitleHindi
                : activeMicroLessonKey === 'qr_visual_intro'
                ? QR_VISUAL_INTRO_MICRO_LESSON.subtitleHindi
                : activeMicroLessonKey === 'upi_app_recognition'
                ? UPI_APP_RECOGNITION_MICRO_LESSON.subtitleHindi
                : activeMicroLessonKey === 'transfer_comparison'
                ? TRANSFER_COMPARISON_MICRO_LESSON.subtitleHindi
                : activeMicroLessonKey === 'balance_methods_overview'
                ? BALANCE_METHODS_OVERVIEW_MICRO_LESSON.subtitleHindi
                : activeMicroLessonKey === 'missed_call_balance'
                ? MISSED_CALL_BALANCE_MICRO_LESSON.subtitleHindi
                : activeMicroLessonKey === 'netbanking_discovery'
                ? NETBANKING_DISCOVERY_MICRO_LESSON.subtitleHindi
                : activeMicroLessonKey === 'cdm_cardless_discovery'
                ? CDM_CARDLESS_DISCOVERY_MICRO_LESSON.subtitleHindi
                : activeMicroLessonKey === 'atm_step_by_step'
                ? ATM_STEP_BY_STEP_MICRO_LESSON.subtitleHindi
                : activeMicroLessonKey === 'atm_simulated_practice'
                ? ATM_SIMULATED_PRACTICE_MICRO_LESSON.subtitleHindi
                : BRANCH_WITHDRAWAL_BASICS_MICRO_LESSON.subtitleHindi}
            </p>

            {/* If Lost Phone: render platforms */}
            {activeMicroLessonKey === 'lost_phone' && (
              <div className="space-y-4">
                {LOST_PHONE_MICRO_LESSON.platforms.map((platform, idx) => (
                  <div
                    key={idx}
                    className="bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200 space-y-2.5"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="font-extrabold text-slate-900 text-sm sm:text-base flex items-center gap-2">
                        <span>{platform.platformNameHindi}</span>
                      </h4>
                      <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-white border border-slate-200 text-slate-700">
                        {platform.platformBadge}
                      </span>
                    </div>

                    <ul className="space-y-1.5 text-xs sm:text-sm text-slate-700">
                      {platform.steps.map((st, sIdx) => (
                        <li key={sIdx} className="flex items-start gap-2">
                          <span className="font-bold text-emerald-700 shrink-0">{sIdx + 1}.</span>
                          <span>{st}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="p-2.5 bg-amber-50 rounded-xl text-xs text-amber-950 font-medium flex items-center gap-1.5">
                      <Lightbulb className="w-4 h-4 text-amber-600 shrink-0" />
                      <span>{platform.tipHindi}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* If Other Micro Lesson: render steps */}
            {activeMicroLessonKey !== 'lost_phone' && (() => {
              const currentLesson =
                activeMicroLessonKey === 'qr_history'
                  ? QR_HISTORY_MICRO_LESSON
                  : activeMicroLessonKey === 'qr_safe_practice'
                  ? QR_SAFE_PRACTICE_MICRO_LESSON
                  : activeMicroLessonKey === 'qr_visual_intro'
                  ? QR_VISUAL_INTRO_MICRO_LESSON
                  : activeMicroLessonKey === 'upi_app_recognition'
                  ? UPI_APP_RECOGNITION_MICRO_LESSON
                  : activeMicroLessonKey === 'transfer_comparison'
                  ? TRANSFER_COMPARISON_MICRO_LESSON
                  : activeMicroLessonKey === 'balance_methods_overview'
                  ? BALANCE_METHODS_OVERVIEW_MICRO_LESSON
                  : activeMicroLessonKey === 'missed_call_balance'
                  ? MISSED_CALL_BALANCE_MICRO_LESSON
                  : activeMicroLessonKey === 'netbanking_discovery'
                  ? NETBANKING_DISCOVERY_MICRO_LESSON
                  : activeMicroLessonKey === 'cdm_cardless_discovery'
                  ? CDM_CARDLESS_DISCOVERY_MICRO_LESSON
                  : activeMicroLessonKey === 'atm_step_by_step'
                  ? ATM_STEP_BY_STEP_MICRO_LESSON
                  : activeMicroLessonKey === 'atm_simulated_practice'
                  ? ATM_SIMULATED_PRACTICE_MICRO_LESSON
                  : BRANCH_WITHDRAWAL_BASICS_MICRO_LESSON
              return (
                <div className="space-y-3">
                  <div className="space-y-2.5">
                    {currentLesson.steps.map((step, idx) => (
                      <div
                        key={idx}
                        className="bg-slate-50 p-3.5 sm:p-4 rounded-2xl border border-slate-200 space-y-1"
                      >
                        <h4 className="font-extrabold text-slate-900 text-xs sm:text-sm flex items-center gap-2">
                          <span>{step.titleHindi}</span>
                        </h4>
                        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                          {step.descriptionHindi}
                        </p>
                        {step.detailActionKey && (
                          <div className="pt-1.5">
                            <button
                              type="button"
                              onClick={() => setActiveMicroLessonKey(step.detailActionKey!)}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                            >
                              <span>{step.detailActionLabel || 'विस्तार से सीखें →'}</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs sm:text-sm text-emerald-950 font-semibold flex items-center gap-2">
                    <Lightbulb className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>{currentLesson.safetyTipHindi}</span>
                  </div>
                </div>
              )
            })()}

            {/* Modal Actions */}
            <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
              <button
                onClick={() => {
                  const topicIdToSave =
                    activeMicroLessonKey === 'lost_phone'
                      ? 'topic_lost_phone_readiness'
                      : activeMicroLessonKey === 'qr_history'
                      ? 'topic_qr_history'
                      : activeMicroLessonKey === 'qr_safe_practice'
                      ? 'topic_qr_safe_practice'
                      : activeMicroLessonKey === 'qr_visual_intro'
                      ? 'topic_qr_visual_intro'
                      : activeMicroLessonKey === 'upi_app_recognition'
                      ? 'topic_upi_app_recognition'
                      : activeMicroLessonKey === 'transfer_comparison'
                      ? 'topic_transfer_methods_comparison'
                      : activeMicroLessonKey === 'balance_methods_overview'
                      ? 'topic_balance_methods_overview'
                      : activeMicroLessonKey === 'missed_call_balance'
                      ? 'topic_missed_call_balance'
                      : activeMicroLessonKey === 'netbanking_discovery'
                      ? 'topic_internet_banking_discovery'
                      : activeMicroLessonKey === 'cdm_cardless_discovery'
                      ? 'topic_cdm_cardless_discovery'
                      : activeMicroLessonKey === 'atm_step_by_step'
                      ? 'topic_atm_step_by_step'
                      : activeMicroLessonKey === 'atm_simulated_practice'
                      ? 'topic_atm_simulated_practice'
                      : 'topic_branch_withdrawal_basics'
                  handleChoiceSaveLater(topicIdToSave)
                  setActiveMicroLessonKey(null)
                }}
                className="px-4 py-2.5 bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 cursor-pointer"
              >
                <Bookmark className="w-4 h-4 text-amber-600" />
                <span>बाद में सीखेंगे में जोड़ें</span>
              </button>

              <button
                onClick={() => setActiveMicroLessonKey(null)}
                className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs sm:text-sm font-bold transition-colors cursor-pointer"
              >
                समझ आ गया (बंद करें)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* HELPER GUIDANCE MODAL                                          */}
      {/* ------------------------------------------------------------- */}
      {activeHelperModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 shadow-2xl border border-slate-200 animate-in fade-in">
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
                    {activeHelperModal.title}
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
                {activeHelperModal.strictSecurityRule}
              </p>
              <p className="text-xs text-rose-800">
                सहयोग का उद्देश्य वरिष्ठ नागरिक को आत्मविश्वास देना है, उनका पासवर्ड या नियंत्रण अपने हाथ में लेना नहीं।
              </p>
            </div>

            {/* Helper Role */}
            <div className="space-y-1.5">
              <h4 className="text-sm font-bold text-slate-900">सहयोगी की भूमिका:</h4>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                {activeHelperModal.helperRole}
              </p>
            </div>

            {/* Step-by-Step Practical Steps */}
            <div className="space-y-2.5">
              <h4 className="text-sm font-bold text-slate-900">
                साथ मिलकर करने के 3-4 आसान चरण:
              </h4>
              <div className="space-y-2">
                {activeHelperModal.stepsForHelper.map((step, idx) => (
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

            {/* Close Button */}
            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setActiveHelperModal(null)}
                className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs sm:text-sm font-bold transition-colors cursor-pointer"
              >
                समझ आ गया (बंद करें)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
