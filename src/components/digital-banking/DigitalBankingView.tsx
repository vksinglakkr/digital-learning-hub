import React, { useState, useMemo, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
  ShieldAlert,
  PhoneCall,
  AlertTriangle,
  CheckCircle2,
  ExternalLink,
  ZoomIn,
  ArrowLeft,
  ArrowRight,
  Eye,
  X,
  Smartphone,
  Wallet,
  FileText,
  ShieldCheck,
  Building2,
  ChevronRight,
  Sparkles,
  Lightbulb,
  Radio,
  Search,
  BookOpen,
  Info
} from 'lucide-react'

import {
  DIGITAL_BANKING_CORE_LESSONS,
  DIGITAL_BANKING_POSTERS
} from '../../data/digitalBankingLessonsData'

import {
  DIGITAL_BANKING_HABITS,
  type DigitalBankingHabit
} from '../../data/digitalBankingHabitsData'

import {
  DIGITAL_BANKING_SCAMS,
  type DigitalBankingScam,
  type ScamNavigationFilter
} from '../../data/digitalBankingScamsData'

import {
  DIGITAL_BANKING_EMERGENCY_GUIDES,
  type DigitalBankingEmergencyGuide
} from '../../data/digitalBankingEmergencyData'

import {
  DIGITAL_BANKING_PROJECTS
} from '../../data/digitalBankingProjectsData'

import { saveStoredSaathiCurrentQuestion } from '../../data/digitalBankingSaathiData'
import { DigitalSaathiPilot } from './DigitalSaathiPilot'

export type DigitalBankingTab =
  | 'capability'
  | 'overview'
  | 'fear-removal'
  | 'banking-savings'
  | 'upi-payments'
  | 'habits'
  | 'scams'
  | 'phone-identity'
  | 'emergency'
  | 'projects'
  | 'posters'

export interface ReusableViewerData {
  title: string
  englishTitle?: string
  categoryBadge: string
  realLifeProblem: string
  whatYouWillLearn: string[]
  infographicImages: string[]
  simpleExplanation: string
  safePracticalActivity: string
  keyTakeaway: string
  updatedSafetyNote?: string
  currentIndex?: number
  totalCount?: number
  onPrev?: () => void
  onNext?: () => void
}

export const DigitalBankingView: React.FC = () => {
  const [searchParams] = useSearchParams()

  // Navigation State - defaults to 'capability' (Digital Saathi as primary focus)
  const [activeTab, setActiveTab] = useState<DigitalBankingTab>(() => {
    const tabParam = searchParams.get('tab') as DigitalBankingTab | null
    if (tabParam && ['capability', 'overview', 'fear-removal', 'banking-savings', 'upi-payments', 'habits', 'scams', 'phone-identity', 'emergency', 'posters', 'projects'].includes(tabParam)) {
      return tabParam
    }
    return 'capability'
  })
  const [scamFilter, setScamFilter] = useState<ScamNavigationFilter | 'all'>('all')
  const [searchQuery, setSearchQuery] = useState('')

  // Return to Saathi tracker for seamless return navigation
  const [returnToSaathi, setReturnToSaathi] = useState<boolean>(() => {
    return searchParams.get('from') === 'saathi'
  })

  // Guided Projects Navigation & Interactive Pilot State
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null)
  const [pilotStepIndex, setPilotStepIndex] = useState<number>(0)
  const [pilotAnswers, setPilotAnswers] = useState<Record<string, string>>({})

  // Reusable Learning Viewer State
  const [viewerData, setViewerData] = useState<ReusableViewerData | null>(null)

  // Zoomable Image Modal State
  const [zoomedImage, setZoomedImage] = useState<{ url: string; title: string } | null>(null)

  // Filtered Scams
  const filteredScams = useMemo(() => {
    return DIGITAL_BANKING_SCAMS.filter(scam => {
      const matchesFilter = scamFilter === 'all' || scam.navigationFilter === scamFilter
      const matchesSearch =
        searchQuery === '' ||
        scam.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        scam.realLifeStory.toLowerCase().includes(searchQuery.toLowerCase()) ||
        scam.englishTitle.toLowerCase().includes(searchQuery.toLowerCase())
      return matchesFilter && matchesSearch
    })
  }, [scamFilter, searchQuery])

  // Helper to open Core Lesson in Reusable Viewer
  const openLessonViewer = (lessonIndex: number) => {
    const lesson = DIGITAL_BANKING_CORE_LESSONS[lessonIndex]
    if (!lesson) return

    setViewerData({
      title: lesson.hindiTitle,
      englishTitle: lesson.englishTitle,
      categoryBadge: lesson.category,
      realLifeProblem: lesson.realLifeProblem,
      whatYouWillLearn: lesson.whatYouWillLearn,
      infographicImages: lesson.infographicImages,
      simpleExplanation: lesson.simpleExplanation,
      safePracticalActivity: lesson.safePracticalActivity,
      keyTakeaway: lesson.keyTakeaway,
      updatedSafetyNote: lesson.updatedSafetyNote,
      currentIndex: lessonIndex + 1,
      totalCount: DIGITAL_BANKING_CORE_LESSONS.length,
      onPrev: lessonIndex > 0 ? () => openLessonViewer(lessonIndex - 1) : undefined,
      onNext: lessonIndex < DIGITAL_BANKING_CORE_LESSONS.length - 1 ? () => openLessonViewer(lessonIndex + 1) : undefined
    })
    window.scrollTo({ top: 320, behavior: 'smooth' })
  }

  // Helper to open Habit in Reusable Viewer
  const openHabitViewer = (habit: DigitalBankingHabit) => {
    setViewerData({
      title: habit.title,
      englishTitle: habit.englishTitle,
      categoryBadge: '4. Good Digital Habits',
      realLifeProblem: `आम गलती: ${habit.wrongHabit}`,
      whatYouWillLearn: [
        `सही व सुरक्षित आदत: ${habit.rightHabit}`,
        'दैनिक जीवन में आदत डालने का आसान तरीका',
        'संबंधित साइबर खतरों से बचाव'
      ],
      infographicImages: [habit.imagePath],
      simpleExplanation: `गलत आदत से बचने के लिए यह समझना जरूरी है कि ${habit.rightHabit}। जब आप शांत मन से जांचते हैं, तो धोखेबाज का जाल तुरंत विफल हो जाता है।`,
      safePracticalActivity: habit.practicalAction,
      keyTakeaway: `${habit.title}: हमेशा सुरक्षित आदत को अपनी पहली प्रतिक्रिया बनाएं।`,
      updatedSafetyNote: habit.updatedSafetyNote
    })
    window.scrollTo({ top: 320, behavior: 'smooth' })
  }

  // Helper to open Scam in Reusable Viewer
  const openScamViewer = (scam: DigitalBankingScam) => {
    setViewerData({
      title: scam.title,
      englishTitle: scam.englishTitle,
      categoryBadge: `5. Cyber Frauds • ${scam.navigationFilter}`,
      realLifeProblem: scam.realLifeStory,
      whatYouWillLearn: [
        `धोखेबाज का तरीका: ${scam.howTheScamWorks}`,
        ...scam.warningSigns.map(w => `खतरे का संकेत: ${w}`),
        ...scam.prevention.map(p => `बचाव: ${p}`)
      ],
      infographicImages: scam.imagePaths,
      simpleExplanation: `${scam.howTheScamWorks}\n\nयदि आप इस स्थिति में फंस गए हैं: ${scam.whatToDoIfAffected.join(' | ')}`,
      safePracticalActivity: 'इस प्रकार के संदिग्ध मैसेज या कॉल आने पर कभी कोई लिंक न खोलें और न ही OTP बताएं। अपने फोन में हेल्पलाइन 1930 सेव रखें।',
      keyTakeaway: 'डर और लालच से दूर रहें। कोई भी वास्तविक पुलिस या बैंक अधिकारी कभी फोन/वीडियो कॉल पर गिरफ्तारी की धमकी या पैसे नहीं मांगता।',
      updatedSafetyNote: scam.legalRegulatoryFact
    })
    window.scrollTo({ top: 320, behavior: 'smooth' })
  }

  // Helper to open Emergency Guide in Reusable Viewer
  const openEmergencyViewer = (guide: DigitalBankingEmergencyGuide) => {
    setViewerData({
      title: guide.situationTitle,
      englishTitle: guide.englishTitle,
      categoryBadge: `7. Emergency Help • ${guide.priorityBadge}`,
      realLifeProblem: guide.situationDescription,
      whatYouWillLearn: [
        `समय सीमा की संवेदनशीलता: ${guide.timeSensitivity}`,
        ...guide.immediateAction.map(a => `तुरंत कार्रवाई: ${a}`)
      ],
      infographicImages: guide.sourceInfographics,
      simpleExplanation: `इस आपात स्थिति में सबसे जरूरी है कि आप घबराएं नहीं। ${guide.immediateAction[0]}। इसके बाद ${guide.officialHelp.map(h => `${h.name} (${h.contactNumber})`).join(' तथा ')} से तुरंत संपर्क करें।`,
      safePracticalActivity: 'अपने फोन में राष्ट्रीय साइबर हेल्पलाइन 1930 और अपने बैंक का आपातकालीन हॉटलिस्टिंग नंबर सेव करें।',
      keyTakeaway: 'आपात स्थिति में पहले 60 मिनट (Golden Hour) में सूचना देने से पैसा फ्रीज होने की संभावना सबसे अधिक होती है।',
      updatedSafetyNote: guide.proceduralCardNote
    })
    window.scrollTo({ top: 320, behavior: 'smooth' })
  }

  const handleReturnToSaathi = () => {
    setViewerData(null)
    setActiveTab('capability')
    setSelectedProjectId(null)
    setReturnToSaathi(false)
    const savedY = parseInt(sessionStorage.getItem('dlh_saathi_scroll_y') || '320', 10)
    setTimeout(() => {
      window.scrollTo({ top: savedY, behavior: 'smooth' })
    }, 40)
  }

  useEffect(() => {
    const handlePopState = (e: PopStateEvent) => {
      if (viewerData) {
        setViewerData(null)
      }
      if (returnToSaathi || (e.state && e.state.returnToSaathi)) {
        setActiveTab('capability')
        setViewerData(null)
        setSelectedProjectId(null)
        setReturnToSaathi(false)
        const savedY = (e.state && typeof e.state.scrollY === 'number')
          ? e.state.scrollY
          : parseInt(sessionStorage.getItem('dlh_saathi_scroll_y') || '320', 10)
        setTimeout(() => {
          window.scrollTo({ top: savedY, behavior: 'smooth' })
        }, 40)
      }
    }
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [viewerData, returnToSaathi])

  useEffect(() => {
    const tabParam = searchParams.get('tab') as DigitalBankingTab | null
    if (tabParam && ['capability', 'overview', 'fear-removal', 'banking-savings', 'upi-payments', 'habits', 'scams', 'phone-identity', 'emergency', 'posters', 'projects'].includes(tabParam)) {
      setActiveTab(tabParam)
    }
    const modeParam = searchParams.get('mode')
    const saathiParam = searchParams.get('saathi')
    if (modeParam === 'assessment' || modeParam === 'capability' || saathiParam === '1' || searchParams.get('plan') === '1' || searchParams.get('advice')) {
      setActiveTab('capability')
    }
    const lessonParam = searchParams.get('lesson')
    if (lessonParam) {
      const idx = parseInt(lessonParam, 10) - 1
      if (idx >= 0 && idx < DIGITAL_BANKING_CORE_LESSONS.length) {
        openLessonViewer(idx)
      }
    }
    const projectParam = searchParams.get('project')
    if (projectParam) {
      setActiveTab('projects')
      const pIdx = parseInt(projectParam, 10) - 1
      if (pIdx >= 0 && pIdx < DIGITAL_BANKING_PROJECTS.length) {
        setSelectedProjectId(DIGITAL_BANKING_PROJECTS[pIdx].id)
      } else {
        const found = DIGITAL_BANKING_PROJECTS.find(p => p.id === projectParam)
        if (found) setSelectedProjectId(found.id)
      }
    }
  }, [searchParams])

  return (
    <div className="bg-slate-50 text-slate-900 min-h-screen">
      {/* 1. TOP STICKY EMERGENCY RED BANNER */}
      <div className="sticky top-16 sm:top-20 z-30 bg-rose-700 text-white shadow-md border-b border-rose-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 sm:py-3 flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
          <div className="flex items-center gap-2.5">
            <span className="flex h-3 w-3 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
            </span>
            <div className="text-sm sm:text-base font-bold">
              <span>🚨 वित्तीय साइबर धोखाधड़ी हुई है? तुरंत कॉल करें: </span>
              <a
                href="tel:1930"
                className="underline hover:text-amber-200 font-extrabold text-lg sm:text-xl ml-1 inline-flex items-center gap-1"
                title="1930 पर सीधे कॉल करें"
              >
                1930
              </a>
              <span className="text-xs sm:text-sm font-normal text-rose-100 ml-1.5 hidden md:inline">
                (गृह मंत्रालय / I4C — 24×7 निःशुल्क हेल्पलाइन)
              </span>
            </div>
          </div>
          <button
            onClick={() => {
              setActiveTab('emergency')
              setViewerData(null)
              window.scrollTo({ top: 400, behavior: 'smooth' })
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1 bg-white text-rose-800 hover:bg-rose-50 rounded-full text-xs sm:text-sm font-bold shadow-xs transition-colors cursor-pointer"
          >
            <ShieldAlert className="w-4 h-4 text-rose-600" />
            आपातकालीन सहायता केंद्र (8 स्थितियां) देखें →
          </button>
        </div>
      </div>

      {/* 2. HERO HEADER & AUTHOR TRIBUTE (COMPACT PEDAGOGICAL HEADER) */}
      <section className="bg-gradient-to-b from-emerald-900 via-teal-950 to-slate-900 text-white pt-5 pb-5 sm:pt-6 sm:pb-6 px-4 sm:px-6 lg:px-8 shadow-inner">
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumb / Top Bar */}
          <div className="flex items-center gap-2 text-emerald-300 text-xs sm:text-sm mb-2.5">
            <ShieldCheck className="w-4 h-4" />
            <span>Digital Learning Hub</span>
            <span>/</span>
            <span className="text-white font-medium">Digital Banking & Security</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
            <div className="lg:col-span-8 space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                वरिष्ठ नागरिकों व नए उपयोगकर्ताओं के लिए संपूर्ण सचित्र मार्गदर्शिका
              </div>
              <h1 className="text-xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight leading-tight text-white">
                डिजिटल बैंकिंग और सुरक्षा गाइड
              </h1>
              <p className="text-xs sm:text-base text-emerald-100 font-medium leading-relaxed">
                सीखें • समझें • सुरक्षित रहें — डर को दूर भगाएं और आत्मविश्वास के साथ सुरक्षित डिजिटल भुगतान अपनाएं।
              </p>

              {/* Author Tribute Card - Compact */}
              <div className="bg-white/10 backdrop-blur-md rounded-xl px-3.5 py-2 border border-white/15 max-w-2xl text-xs text-slate-200">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-semibold text-emerald-300">शैक्षणिक रचनाकार:</span>
                  <span className="text-white font-bold">श्री विनोद सिंगला</span>
                  <span className="text-slate-400 hidden sm:inline">•</span>
                  <span className="text-slate-300 text-[11px]">
                    भूतपूर्व वरिष्ठ निदेशक एवं डीआईओ, राष्ट्रीय सूचना विज्ञान केंद्र (NIC), कुरुक्षेत्र
                  </span>
                </div>
                <div className="text-emerald-200 text-[11px] italic mt-0.5">
                  "72 मौलिक सचित्र इन्फोग्राफिक्स पर आधारित जनहितैषी पहल।"
                </div>
              </div>
            </div>

            {/* Quick Stats / Overview Banner - Compact */}
            <div className="lg:col-span-4 grid grid-cols-2 gap-2.5">
              <div className="bg-white/10 backdrop-blur-md p-2.5 rounded-xl border border-white/10 text-center">
                <div className="text-xl sm:text-2xl font-black text-emerald-400">72</div>
                <div className="text-[11px] text-slate-300 font-medium">मौलिक इन्फोग्राफिक्स</div>
              </div>
              <div className="bg-white/10 backdrop-blur-md p-2.5 rounded-xl border border-white/10 text-center">
                <div className="text-xl sm:text-2xl font-black text-amber-300">11</div>
                <div className="text-[11px] text-slate-300 font-medium">सुरक्षा आदतें</div>
              </div>
              <div className="bg-white/10 backdrop-blur-md p-2.5 rounded-xl border border-white/10 text-center">
                <div className="text-xl sm:text-2xl font-black text-rose-300">19</div>
                <div className="text-[11px] text-slate-300 font-medium">वास्तविक स्कैम केस</div>
              </div>
              <div className="bg-white/10 backdrop-blur-md p-2.5 rounded-xl border border-white/10 text-center">
                <div className="text-xl sm:text-2xl font-black text-cyan-300">8</div>
                <div className="text-[11px] text-slate-300 font-medium">आपातकालीन गाइड्स</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. SECTION NAVIGATION PILLS */}
      <nav aria-label="डिजिटल बैंकिंग अनुभाग" className="sticky top-28 sm:top-32 z-20 bg-white border-b border-slate-200 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 overflow-x-auto py-2 scrollbar-thin">
            {/* Primary Focus: Digital Saathi */}
            <button
              onClick={() => {
                setActiveTab('capability')
                setViewerData(null)
                setSelectedProjectId(null)
                setReturnToSaathi(false)
              }}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-extrabold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 shadow-xs ${
                activeTab === 'capability'
                  ? 'bg-emerald-700 text-white ring-2 ring-emerald-400'
                  : 'bg-emerald-100 text-emerald-950 hover:bg-emerald-200 border border-emerald-300'
              }`}
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>🤝 डिजिटल साथी (4 आसान सवाल)</span>
            </button>

            {/* Smaller secondary link right next to Digital Saathi */}
            <button
              onClick={() => {
                setActiveTab('overview')
                setViewerData(null)
                setSelectedProjectId(null)
                setReturnToSaathi(false)
              }}
              className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'overview'
                  ? 'bg-slate-800 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5 text-slate-500" />
              <span>संपूर्ण संदर्भ पुस्तकालय</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('fear-removal')
                setViewerData(null)
              }}
              className={`px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-bold whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'fear-removal'
                  ? 'bg-teal-700 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
              <span>1. डर दूर करें</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('banking-savings')
                setViewerData(null)
              }}
              className={`px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-bold whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'banking-savings'
                  ? 'bg-teal-700 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>2. बैंकिंग व बचत</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('upi-payments')
                setViewerData(null)
              }}
              className={`px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-bold whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'upi-payments'
                  ? 'bg-teal-700 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <Wallet className="w-3.5 h-3.5" />
              <span>3. UPI व भुगतान</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('habits')
                setViewerData(null)
              }}
              className={`px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-bold whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'habits'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-amber-50 text-amber-900 border border-amber-200 hover:bg-amber-100'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
              <span>4. 11 सुरक्षा आदतें</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('scams')
                setViewerData(null)
              }}
              className={`px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-bold whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'scams'
                  ? 'bg-rose-700 text-white shadow-xs'
                  : 'bg-rose-50 text-rose-900 border border-rose-200 hover:bg-rose-100'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
              <span>5. 19 स्कैम केस</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('phone-identity')
                setViewerData(null)
              }}
              className={`px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-bold whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'phone-identity'
                  ? 'bg-indigo-700 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>6. फोन व पहचान</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('emergency')
                setViewerData(null)
              }}
              className={`px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-bold whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'emergency'
                  ? 'bg-red-800 text-white shadow-xs'
                  : 'bg-red-100 text-red-900 border border-red-300 hover:bg-red-200'
              }`}
            >
              <PhoneCall className="w-3.5 h-3.5 text-red-700" />
              <span>7. आपातकालीन सहायता (1930)</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('projects')
                setSelectedProjectId(null)
                setViewerData(null)
              }}
              className={`px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-bold whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'projects'
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'bg-emerald-50 text-emerald-900 border border-emerald-200 hover:bg-emerald-100'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>4 गाइडेड प्रोजेक्ट्स</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('posters')
                setViewerData(null)
              }}
              className={`px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-bold whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'posters'
                  ? 'bg-slate-800 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>संदर्भ पोस्टर्स (6)</span>
            </button>
          </div>
        </div>
      </nav>

      {/* 4. MAIN CONTENT AREA */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        {/* REUSABLE LEARNING VIEWER (DISPLAYS IN EXACT APPROVED PEDAGOGICAL ORDER 1–8) */}
        {viewerData && (
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-6 sm:p-8 mb-10 transition-all">
            {/* Viewer Top Navigation Bar */}
            <div className="flex items-center justify-between border-b border-slate-200 pb-4 mb-6">
              <div className="flex items-center gap-2">
                {returnToSaathi ? (
                  <button
                    onClick={handleReturnToSaathi}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-300 text-xs sm:text-sm font-bold hover:bg-emerald-100 transition-colors cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>← डिजिटल साथी में वापस जाएँ</span>
                  </button>
                ) : (
                  <button
                    onClick={() => setViewerData(null)}
                    className="inline-flex items-center gap-1.5 text-sm font-bold text-slate-600 hover:text-emerald-700 transition-colors cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>वापस सूची पर जाएं</span>
                  </button>
                )}
              </div>

              {viewerData.currentIndex && viewerData.totalCount && (
                <div className="text-xs text-slate-500 font-semibold">
                  पाठ {viewerData.currentIndex} / {viewerData.totalCount}
                </div>
              )}

              <div className="flex items-center gap-2">
                {viewerData.onPrev && (
                  <button
                    onClick={viewerData.onPrev}
                    className="px-2.5 py-1 rounded-lg border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-100 cursor-pointer"
                  >
                    ← पिछला पाठ
                  </button>
                )}
                {viewerData.onNext && (
                  <button
                    onClick={viewerData.onNext}
                    className="px-2.5 py-1 rounded-lg bg-emerald-700 text-white text-xs font-semibold hover:bg-emerald-800 cursor-pointer"
                  >
                    अगला पाठ →
                  </button>
                )}
              </div>
            </div>

            {/* Strict Pedagogical Order (1 through 8) */}
            <div className="space-y-6">
              {/* Header */}
              <div>
                <span className="inline-block px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-bold mb-2">
                  {viewerData.categoryBadge}
                </span>
                <h2 className="text-xl sm:text-3xl font-extrabold text-slate-900 leading-snug">
                  {viewerData.title}
                </h2>
                {viewerData.englishTitle && (
                  <div className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
                    {viewerData.englishTitle}
                  </div>
                )}
              </div>

              {/* 1. Real-Life Problem (वास्तविक समस्या / किस्सा) */}
              <div className="bg-amber-50/80 border-l-4 border-amber-500 p-4 rounded-r-xl">
                <div className="flex items-center gap-2 text-amber-900 font-bold text-sm sm:text-base mb-1">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  <span>1. आम वास्तविक समस्या (Real-Life Problem)</span>
                </div>
                <p className="text-sm sm:text-base text-amber-950 leading-relaxed whitespace-pre-line">
                  {viewerData.realLifeProblem}
                </p>
              </div>

              {/* 2. What You Will Learn (आप क्या सीखेंगे) */}
              <div className="bg-emerald-50/60 border border-emerald-200/60 p-4 rounded-xl">
                <div className="flex items-center gap-2 text-emerald-900 font-bold text-sm sm:text-base mb-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>2. आप इस पाठ में क्या सीखेंगे (What You Will Learn)</span>
                </div>
                <ul className="space-y-1.5 text-sm sm:text-base text-slate-800">
                  {viewerData.whatYouWillLearn.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-emerald-600 font-bold">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* 3. Original Infographics (सचित्र मौलिक इन्फोग्राफिक्स - Zoomable) */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2 text-slate-900 font-bold text-sm sm:text-base">
                    <Eye className="w-4 h-4 text-teal-600" />
                    <span>3. मौलिक सचित्र चार्ट (Original Infographics) — बड़ा करके देखने हेतु क्लिक करें</span>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {viewerData.infographicImages.map((imgUrl, idx) => (
                    <div
                      key={idx}
                      onClick={() => setZoomedImage({ url: imgUrl, title: `${viewerData.title} (चित्र ${idx + 1})` })}
                      className="group relative bg-slate-100 rounded-xl overflow-hidden border border-slate-200 shadow-xs hover:shadow-md transition-all cursor-zoom-in"
                    >
                      <img
                        src={imgUrl}
                        alt={`${viewerData.title} infographic ${idx + 1}`}
                        className="w-full h-auto object-contain max-h-96"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white font-bold text-sm gap-1.5">
                        <ZoomIn className="w-5 h-5" />
                        <span>बड़ा करके देखें (Full Size)</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 4. Simple Explanation (सरल व्याख्या) */}
              <div className="bg-slate-50 border border-slate-200 p-5 rounded-xl">
                <div className="flex items-center gap-2 text-slate-900 font-bold text-sm sm:text-base mb-2">
                  <BookOpen className="w-4 h-4 text-teal-700" />
                  <span>4. सरल भाषा में समझें (Simple Explanation)</span>
                </div>
                <p className="text-sm sm:text-base text-slate-800 leading-relaxed whitespace-pre-line font-normal">
                  {viewerData.simpleExplanation}
                </p>
              </div>

              {/* 5. Safe Practical Activity (आज का सुरक्षित अभ्यास - शून्य वित्तीय जोखिम) */}
              <div className="bg-teal-50/70 border-l-4 border-teal-600 p-4 rounded-r-xl">
                <div className="flex items-center gap-2 text-teal-900 font-bold text-sm sm:text-base mb-1">
                  <ShieldCheck className="w-4 h-4 text-teal-700" />
                  <span>5. आज का सुरक्षित अभ्यास (Safe Practical Activity — शून्य वित्तीय जोखिम)</span>
                </div>
                <p className="text-sm sm:text-base text-teal-950 font-medium">
                  {viewerData.safePracticalActivity}
                </p>
                <div className="text-xs text-teal-800 mt-1 italic">
                  *इस अभ्यास में कोई वास्तविक पैसे ट्रांसफर नहीं करने हैं; यह केवल फोन सेटिंग्स या ऐप स्क्रीन देखने का सुरक्षित अभ्यास है।
                </div>
              </div>

              {/* 6. Key Takeaway (मुख्य सीख) */}
              <div className="bg-indigo-50 border border-indigo-200 p-4 rounded-xl">
                <div className="flex items-center gap-2 text-indigo-900 font-bold text-sm sm:text-base mb-1">
                  <Sparkles className="w-4 h-4 text-indigo-600" />
                  <span>6. मुख्य निष्कर्ष (Key Takeaway)</span>
                </div>
                <p className="text-sm sm:text-base text-indigo-950 font-semibold">
                  {viewerData.keyTakeaway}
                </p>
              </div>

              {/* 7. Updated Safety Note (अद्यतन सुरक्षा सुझाव - यदि लागू हो) */}
              {viewerData.updatedSafetyNote && (
                <div className="bg-amber-100/70 border border-amber-300 p-4 rounded-xl">
                  <div className="flex items-center gap-2 text-amber-900 font-bold text-sm mb-1">
                    <Info className="w-4 h-4 text-amber-700" />
                    <span>7. अद्यतन सुरक्षा सुझाव (Updated Safety & Regulatory Note)</span>
                  </div>
                  <p className="text-xs sm:text-sm text-amber-950">
                    {viewerData.updatedSafetyNote}
                  </p>
                </div>
              )}

              {/* 8. Bottom Close / Back Bar */}
              <div className="pt-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
                {returnToSaathi && (
                  <button
                    onClick={handleReturnToSaathi}
                    className="px-4 py-2.5 bg-emerald-700 text-white rounded-xl text-xs sm:text-sm font-bold hover:bg-emerald-800 transition-colors cursor-pointer inline-flex items-center gap-1.5"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>← डिजिटल साथी में वापस जाएँ</span>
                  </button>
                )}
                <button
                  onClick={() => {
                    if (returnToSaathi) {
                      handleReturnToSaathi()
                    } else {
                      setViewerData(null)
                    }
                  }}
                  className="px-5 py-2.5 bg-slate-900 text-white rounded-xl text-xs sm:text-sm font-bold hover:bg-slate-800 transition-colors cursor-pointer ml-auto"
                >
                  पाठ पूरा हुआ ({returnToSaathi ? 'साथी पर लौटें' : 'सूची पर लौटें'})
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ----------------- TAB: DIGITAL SAATHI PILOT (PHASE 5.6) ----------------- */}
        {activeTab === 'capability' && (
          <div className={viewerData ? 'hidden' : 'block'}>
            <DigitalSaathiPilot
              onNavigateToContent={(tab, targetId, targetIndex, qIndex) => {
                setReturnToSaathi(true)
                if (typeof qIndex === 'number') {
                  saveStoredSaathiCurrentQuestion(qIndex)
                }
                try {
                  sessionStorage.setItem('dlh_saathi_scroll_y', window.scrollY.toString())
                  window.history.pushState({ tab, returnToSaathi: true, qIndex, scrollY: window.scrollY }, '')
                } catch {
                  // Ignore history push state errors in strict environments
                }
                if (tab === 'projects') {
                  setActiveTab('projects')
                  let projId = targetId
                  if (projId === 'project-01') projId = 'project-safe-upi-setup'
                  else if (projId === 'project-02') projId = 'project-autopay-management'
                  else if (projId === 'project-03') projId = 'project-lost-phone-lockdown'
                  else if (projId === 'project-04') projId = 'project-digital-identity-audit'
                  if (projId) setSelectedProjectId(projId)
                  setViewerData(null)
                  window.scrollTo({ top: 320, behavior: 'smooth' })
                } else if (tab === 'habits') {
                  let habit = DIGITAL_BANKING_HABITS.find(h => h.id === targetId)
                  if (!habit && typeof targetIndex === 'number' && DIGITAL_BANKING_HABITS[targetIndex]) {
                    habit = DIGITAL_BANKING_HABITS[targetIndex]
                  }
                  if (!habit) habit = DIGITAL_BANKING_HABITS[6]
                  openHabitViewer(habit)
                } else if (tab === 'scams') {
                  let scam = DIGITAL_BANKING_SCAMS.find(s => s.id === targetId)
                  if (!scam && typeof targetIndex === 'number' && DIGITAL_BANKING_SCAMS[targetIndex]) {
                    scam = DIGITAL_BANKING_SCAMS[targetIndex]
                  }
                  if (!scam) scam = DIGITAL_BANKING_SCAMS[2]
                  openScamViewer(scam)
                } else if (tab === 'posters') {
                  setActiveTab('posters')
                  setViewerData(null)
                  if (typeof targetIndex === 'number' && DIGITAL_BANKING_POSTERS[targetIndex]) {
                    setZoomedImage({
                      url: DIGITAL_BANKING_POSTERS[targetIndex].imagePath,
                      title: DIGITAL_BANKING_POSTERS[targetIndex].title
                    })
                  }
                  window.scrollTo({ top: 320, behavior: 'smooth' })
                } else if (typeof targetIndex === 'number') {
                  openLessonViewer(targetIndex)
                } else {
                  setActiveTab(tab)
                  setViewerData(null)
                  window.scrollTo({ top: 320, behavior: 'smooth' })
                }
              }}
              onExitToLibrary={() => {
                setActiveTab('overview')
                window.scrollTo({ top: 320, behavior: 'smooth' })
              }}
              onOpenZoom={(url, title) => {
                setZoomedImage({ url, title })
              }}
            />
          </div>
        )}

        {/* ----------------- TAB 1: OVERVIEW SCREEN ----------------- */}
        {activeTab === 'overview' && !viewerData && (
          <div className="space-y-10">
            {/* New Category Entry: Two Prominent Pathways (Phase 5.6) */}
            <div className="bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 border-2 border-emerald-300 rounded-3xl p-6 sm:p-8 shadow-sm">
              <div className="text-center max-w-2xl mx-auto mb-6">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold mb-2">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                  शिक्षार्थी-प्रथम दृष्टिकोण (Learner-First Pathways)
                </span>
                <h2 className="text-xl sm:text-3xl font-extrabold text-slate-900">
                  आपके लिए उपयुक्त शुरुआत चुनें
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 mt-1">
                  आप 2 मिनट की दोस्ताना बातचीत से शुरुआत कर सकते हैं या सीधे पूरी संदर्भ सामग्री देख सकते हैं।
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Pathway A */}
                <div
                  onClick={() => {
                    setActiveTab('capability')
                    window.scrollTo({ top: 320, behavior: 'smooth' })
                  }}
                  className="bg-white p-6 rounded-2xl border-2 border-emerald-400 hover:border-emerald-600 hover:shadow-lg transition-all cursor-pointer group flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-black rounded-full">
                        मार्ग 1 (अनुशंसित)
                      </span>
                      <span className="text-xs font-semibold text-slate-500">⏱️ केवल 4 सवाल</span>
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-slate-900 group-hover:text-emerald-700 transition-colors flex items-center gap-2">
                      <span>🤝 डिजिटल साथी (4 आसान सवाल)</span>
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      एक सवाल → तुरंत सलाह → आपकी पसंद। केवल 4 आसान सवालों में जानिए कि आप पहले से क्या जानते हैं और उपयोगी सुधार सीखिए।
                    </p>
                    <ul className="text-xs text-slate-600 space-y-1.5 pt-1">
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>कोई परीक्षा, अंक या पास/फेल नहीं</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>हर सवाल के बाद तुरंत उपयोगी सलाह कार्ड</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>आपकी पसंद के अनुसार व्यक्तिगत शिक्षण योजना</span>
                      </li>
                    </ul>
                  </div>
                  <div className="pt-4 mt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs font-extrabold text-emerald-700 group-hover:underline">
                      डिजिटल साथी से बात करें →
                    </span>
                    <span className="w-8 h-8 rounded-full bg-emerald-50 group-hover:bg-emerald-700 group-hover:text-white text-emerald-700 flex items-center justify-center transition-colors">
                      <ChevronRight className="w-4 h-4" />
                    </span>
                  </div>
                </div>

                {/* Pathway B */}
                <div
                  onClick={() => {
                    const el = document.getElementById('seven-sections-heading')
                    if (el) el.scrollIntoView({ behavior: 'smooth' })
                  }}
                  className="bg-white p-6 rounded-2xl border-2 border-slate-200 hover:border-slate-400 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="px-3 py-1 bg-slate-100 text-slate-700 text-xs font-black rounded-full">
                        मार्ग 2
                      </span>
                      <span className="text-xs font-semibold text-slate-500">72 मौलिक चित्र</span>
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-slate-900 group-hover:text-slate-800 transition-colors flex items-center gap-2">
                      <span>📚 संपूर्ण संदर्भ पुस्तकालय</span>
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      डिजिटल बैंकिंग के सभी 7 अनुभाग, 19 स्कैम केस, 11 आदतें और 4 प्रोजेक्ट्स को अपनी पसंद से सीधे ब्राउज़ करें।
                    </p>
                    <ul className="text-xs text-slate-600 space-y-1.5 pt-1">
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                        <span>सभी 7 प्रमुख शिक्षण अनुभाग उपलब्ध</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                        <span>19 वास्तविक स्कैम केस व 8 आपातकालीन गाइड्स</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                        <span>ज़ूमेबल इन्फोग्राफिक्स व सुरक्षित अभ्यास</span>
                      </li>
                    </ul>
                  </div>
                  <div className="pt-4 mt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs font-extrabold text-slate-700 group-hover:underline">
                      पुस्तकालय नीचे ब्राउज़ करें ↓
                    </span>
                    <span className="w-8 h-8 rounded-full bg-slate-50 group-hover:bg-slate-800 group-hover:text-white text-slate-700 flex items-center justify-center transition-colors">
                      <ChevronRight className="w-4 h-4" />
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* 1. Seven Pillar Cards Quick RoadMap */}
            <div>
              <div className="mb-4">
                <h2 id="seven-sections-heading" className="text-xl sm:text-2xl font-bold text-slate-900 scroll-mt-36">
                  सात प्रमुख शिक्षण अनुभाग (Seven Learning Sections)
                </h2>
                <p className="text-sm text-slate-600">
                  अपनी आवश्यकतानुसार किसी भी अनुभाग पर टैप करके सीखना शुरू करें।
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Card 1 */}
                <div
                  onClick={() => setActiveTab('fear-removal')}
                  className="bg-white p-5 rounded-xl border border-slate-200 hover:border-emerald-500 hover:shadow-md transition-all cursor-pointer group"
                >
                  <div className="w-10 h-10 rounded-lg bg-teal-100 text-teal-800 flex items-center justify-center font-bold mb-3 group-hover:bg-teal-700 group-hover:text-white transition-colors">
                    1
                  </div>
                  <h3 className="font-bold text-slate-900 text-base sm:text-lg mb-1 group-hover:text-teal-700 transition-colors">
                    बैंकिंग का डर दूर करें
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 mb-3">
                    वस्तु विनिमय से UPI तक भुगतान का इतिहास और मन के दो बड़े डरों का आसान समाधान।
                  </p>
                  <span className="text-xs font-bold text-teal-700 flex items-center gap-1">
                    पाठ देखें <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>

                {/* Card 2 */}
                <div
                  onClick={() => setActiveTab('banking-savings')}
                  className="bg-white p-5 rounded-xl border border-slate-200 hover:border-emerald-500 hover:shadow-md transition-all cursor-pointer group"
                >
                  <div className="w-10 h-10 rounded-lg bg-teal-100 text-teal-800 flex items-center justify-center font-bold mb-3 group-hover:bg-teal-700 group-hover:text-white transition-colors">
                    2
                  </div>
                  <h3 className="font-bold text-slate-900 text-base sm:text-lg mb-1 group-hover:text-teal-700 transition-colors">
                    बैंक खाते, बचत व योजनाएं
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 mb-3">
                    वरिष्ठ नागरिक खाते, ₹5 लाख DICGC बीमा, SCSS, डाकघर बचत, लोन और बैंक ड्राफ्ट।
                  </p>
                  <span className="text-xs font-bold text-teal-700 flex items-center gap-1">
                    पाठ देखें <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>

                {/* Card 3 */}
                <div
                  onClick={() => setActiveTab('upi-payments')}
                  className="bg-white p-5 rounded-xl border border-slate-200 hover:border-emerald-500 hover:shadow-md transition-all cursor-pointer group"
                >
                  <div className="w-10 h-10 rounded-lg bg-teal-100 text-teal-800 flex items-center justify-center font-bold mb-3 group-hover:bg-teal-700 group-hover:text-white transition-colors">
                    3
                  </div>
                  <h3 className="font-bold text-slate-900 text-base sm:text-lg mb-1 group-hover:text-teal-700 transition-colors">
                    डिजिटल भुगतान, UPI व बिल
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 mb-3">
                    UPI पिन नियम, फिक्स QR कोड, बिजली-पानी बिल भुगतान और ऑटो-डेबिट (AutoPay) रोकना।
                  </p>
                  <span className="text-xs font-bold text-teal-700 flex items-center gap-1">
                    पाठ देखें <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>

                {/* Card 4 */}
                <div
                  onClick={() => setActiveTab('habits')}
                  className="bg-white p-5 rounded-xl border border-amber-200 hover:border-amber-500 hover:shadow-md transition-all cursor-pointer group bg-gradient-to-br from-amber-50/50 to-white"
                >
                  <div className="w-10 h-10 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center font-bold mb-3 group-hover:bg-amber-600 group-hover:text-white transition-colors">
                    4
                  </div>
                  <h3 className="font-bold text-slate-900 text-base sm:text-lg mb-1 group-hover:text-amber-700 transition-colors">
                    11 सुनहरी सुरक्षा आदतें
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 mb-3">
                    Observe Before Click, Never Share OTP, अलग छोटा खाता और पब्लिक वाई-फाई सुरक्षा।
                  </p>
                  <span className="text-xs font-bold text-amber-700 flex items-center gap-1">
                    11 आदतें खोलें <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>

                {/* Card 5 */}
                <div
                  onClick={() => setActiveTab('scams')}
                  className="bg-white p-5 rounded-xl border border-rose-200 hover:border-rose-500 hover:shadow-md transition-all cursor-pointer group bg-gradient-to-br from-rose-50/50 to-white"
                >
                  <div className="w-10 h-10 rounded-lg bg-rose-100 text-rose-800 flex items-center justify-center font-bold mb-3 group-hover:bg-rose-700 group-hover:text-white transition-colors">
                    5
                  </div>
                  <h3 className="font-bold text-slate-900 text-base sm:text-lg mb-1 group-hover:text-rose-700 transition-colors">
                    19 साइबर फ्रॉड व स्कैम लाइब्रेरी
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 mb-3">
                    डिजिटल अरेस्ट, फर्जी KYC, स्क्रीन शेयरिंग, व्हाट्सएप हैकिंग और गलत QR कोड से बचाव।
                  </p>
                  <span className="text-xs font-bold text-rose-700 flex items-center gap-1">
                    19 स्कैम केस देखें <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>

                {/* Card 6 */}
                <div
                  onClick={() => setActiveTab('phone-identity')}
                  className="bg-white p-5 rounded-xl border border-slate-200 hover:border-indigo-500 hover:shadow-md transition-all cursor-pointer group"
                >
                  <div className="w-10 h-10 rounded-lg bg-indigo-100 text-indigo-800 flex items-center justify-center font-bold mb-3 group-hover:bg-indigo-700 group-hover:text-white transition-colors">
                    6
                  </div>
                  <h3 className="font-bold text-slate-900 text-base sm:text-lg mb-1 group-hover:text-indigo-700 transition-colors">
                    फोन व डिजिटल पहचान सुरक्षा
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 mb-3">
                    eSIM, 4-इन-1 सुरक्षा ऑडिट (आधार, गूगल, वॉट्सऐप), और पुराना फोन बेचने की चेकलिस्ट।
                  </p>
                  <span className="text-xs font-bold text-indigo-700 flex items-center gap-1">
                    पाठ देखें <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </div>

            {/* 2. FOUR GUIDED PROJECTS SPOTLIGHT */}
            <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 rounded-2xl p-6 sm:p-8 text-white shadow-lg">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                  <span className="px-3 py-1 bg-emerald-500/30 text-emerald-300 rounded-full text-xs font-bold uppercase tracking-wider">
                    व्यावहारिक अभ्यास (Hands-on Practice)
                  </span>
                  <h2 className="text-xl sm:text-3xl font-extrabold mt-1 text-white">
                    चार व्यावहारिक गाइडेड प्रोजेक्ट्स (Four Guided Projects)
                  </h2>
                  <p className="text-xs sm:text-sm text-emerald-100 mt-1">
                    मौलिक कहानी → मौलिक इन्फोग्राफिक्स → सुरक्षित अभ्यास कदम → दैनिक जीवन में उपयोग।
                  </p>
                </div>
                <button
                  onClick={() => {
                    setActiveTab('projects')
                    setSelectedProjectId(null)
                    window.scrollTo({ top: 320, behavior: 'smooth' })
                  }}
                  className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs sm:text-sm transition-colors cursor-pointer self-start sm:self-auto"
                >
                  सभी 4 प्रोजेक्ट्स खोलें →
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {DIGITAL_BANKING_PROJECTS.map(proj => (
                  <div
                    key={proj.id}
                    onClick={() => {
                      setActiveTab('projects')
                      setSelectedProjectId(proj.id)
                      setPilotStepIndex(0)
                      window.scrollTo({ top: 320, behavior: 'smooth' })
                    }}
                    className="bg-white/10 hover:bg-white/15 backdrop-blur-md rounded-xl p-4 border border-white/15 transition-all cursor-pointer flex flex-col justify-between"
                  >
                    <div>
                      <span className="text-[11px] font-bold text-emerald-300 block mb-1">
                        {proj.stepsCount}
                      </span>
                      <h3 className="font-bold text-white text-sm sm:text-base mb-2 line-clamp-2">
                        {proj.title}
                      </h3>
                      <p className="text-xs text-slate-300 line-clamp-3 mb-3">
                        {proj.description}
                      </p>
                    </div>
                    <span className="text-xs text-emerald-300 font-bold flex items-center gap-1 mt-auto">
                      शुरू करें <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* 3. CORE LESSONS PREVIEW */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                    मुख्य पाठ्य सामग्री (17 Core Conceptual Lessons)
                  </h2>
                  <p className="text-sm text-slate-600">
                    बैंकिंग और सुरक्षा की चरणबद्ध समझ — किसी भी पाठ पर टैप करके पूरा विवरण देखें।
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {DIGITAL_BANKING_CORE_LESSONS.slice(0, 6).map((lesson, idx) => (
                  <div
                    key={lesson.id}
                    onClick={() => openLessonViewer(idx)}
                    className="bg-white p-5 rounded-xl border border-slate-200 hover:border-emerald-600 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
                  >
                    <div>
                      <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full mb-2 inline-block">
                        पाठ {lesson.sequenceNumber} • {lesson.category.split('.')[1]?.trim()}
                      </span>
                      <h3 className="font-bold text-slate-900 text-base mb-2 group-hover:text-emerald-700 transition-colors">
                        {lesson.hindiTitle}
                      </h3>
                      <p className="text-xs text-slate-600 line-clamp-2 mb-3">
                        {lesson.shortDescription}
                      </p>
                    </div>
                    <span className="text-xs font-bold text-emerald-700 flex items-center gap-1 mt-auto">
                      विस्तार से पढ़ें <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                ))}
              </div>

              <div className="text-center mt-6">
                <button
                  onClick={() => {
                    setActiveTab('banking-savings')
                    window.scrollTo({ top: 300, behavior: 'smooth' })
                  }}
                  className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs sm:text-sm font-bold transition-colors cursor-pointer"
                >
                  सभी 17 पाठ देखें →
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ----------------- TAB 2: FEAR REMOVAL (डर दूर करें) ----------------- */}
        {activeTab === 'fear-removal' && !viewerData && (
          <div className="space-y-6">
            <div className="bg-teal-50 border border-teal-200 p-6 rounded-2xl">
              <h2 className="text-2xl font-bold text-teal-950 mb-2">
                स्तंभ 1: बैंकिंग का डर दूर करें (Overcoming Apprehension)
              </h2>
              <p className="text-slate-700 text-sm sm:text-base leading-relaxed">
                वस्तु विनिमय से लेकर डिजिटल भुगतान तक मानव सभ्यता के विकास को समझें। गलती होने के डर और मोबाइल खोने के डर का आसान समाधान जानें।
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {DIGITAL_BANKING_CORE_LESSONS.filter(l => l.category.includes('डर दूर करें')).map(lesson => {
                const idx = DIGITAL_BANKING_CORE_LESSONS.findIndex(l => l.id === lesson.id)
                return (
                  <div
                    key={lesson.id}
                    onClick={() => openLessonViewer(idx)}
                    className="bg-white p-6 rounded-2xl border border-slate-200 hover:border-teal-600 hover:shadow-lg transition-all cursor-pointer"
                  >
                    <span className="text-xs font-bold text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded-full mb-3 inline-block">
                      पाठ {lesson.sequenceNumber}
                    </span>
                    <h3 className="font-bold text-slate-900 text-lg sm:text-xl mb-2">
                      {lesson.hindiTitle}
                    </h3>
                    <p className="text-sm text-slate-600 mb-4">
                      {lesson.shortDescription}
                    </p>
                    <div className="flex items-center gap-2 text-xs font-bold text-teal-700">
                      <span>पूरा पाठ खोलें</span>
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* ----------------- TAB 3: BANKING & SAVINGS (बैंकिंग व बचत) ----------------- */}
        {activeTab === 'banking-savings' && !viewerData && (
          <div className="space-y-6">
            <div className="bg-teal-50 border border-teal-200 p-6 rounded-2xl">
              <h2 className="text-2xl font-bold text-teal-950 mb-2">
                स्तंभ 2: बैंक के प्रकार, बचत योजनाएं और सुरक्षित लोन
              </h2>
              <p className="text-slate-700 text-sm sm:text-base leading-relaxed">
                वरिष्ठ नागरिक बचत खाते, ₹5 लाख DICGC सुरक्षा गारंटी, SCSS, डाकघर बचत, सुरक्षित चेक और बैंक ड्राफ्ट का संपूर्ण विवरण।
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {DIGITAL_BANKING_CORE_LESSONS.filter(l => l.category.includes('Banking, Savings')).map(lesson => {
                const idx = DIGITAL_BANKING_CORE_LESSONS.findIndex(l => l.id === lesson.id)
                return (
                  <div
                    key={lesson.id}
                    onClick={() => openLessonViewer(idx)}
                    className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-teal-600 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
                  >
                    <div>
                      <span className="text-xs font-bold text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded-full mb-2 inline-block">
                        पाठ {lesson.sequenceNumber}
                      </span>
                      <h3 className="font-bold text-slate-900 text-base mb-2">
                        {lesson.hindiTitle}
                      </h3>
                      <p className="text-xs text-slate-600 line-clamp-3 mb-3">
                        {lesson.shortDescription}
                      </p>
                    </div>
                    <span className="text-xs font-bold text-teal-700 flex items-center gap-1 mt-auto">
                      अध्ययन करें <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* ----------------- TAB 4: UPI & PAYMENTS (UPI व भुगतान) ----------------- */}
        {activeTab === 'upi-payments' && !viewerData && (
          <div className="space-y-6">
            <div className="bg-teal-50 border border-teal-200 p-6 rounded-2xl">
              <h2 className="text-2xl font-bold text-teal-950 mb-2">
                स्तंभ 3: डिजिटल भुगतान, UPI और दैनिक बिल
              </h2>
              <p className="text-slate-700 text-sm sm:text-base leading-relaxed">
                पिन का सही नियम (पैसे पाने के लिए कभी पिन नहीं लगता), Google Pay में फिक्स QR कोड, बिजली बिल भुगतान और AutoPay रद्द करना।
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {DIGITAL_BANKING_CORE_LESSONS.filter(l => l.category.includes('Digital Payments')).map(lesson => {
                const idx = DIGITAL_BANKING_CORE_LESSONS.findIndex(l => l.id === lesson.id)
                return (
                  <div
                    key={lesson.id}
                    onClick={() => openLessonViewer(idx)}
                    className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-teal-600 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
                  >
                    <div>
                      <span className="text-xs font-bold text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded-full mb-2 inline-block">
                        पाठ {lesson.sequenceNumber}
                      </span>
                      <h3 className="font-bold text-slate-900 text-base mb-2">
                        {lesson.hindiTitle}
                      </h3>
                      <p className="text-xs text-slate-600 line-clamp-3 mb-3">
                        {lesson.shortDescription}
                      </p>
                    </div>
                    <span className="text-xs font-bold text-teal-700 flex items-center gap-1 mt-auto">
                      अध्ययन करें <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* ----------------- TAB 5: 11 GOOD DIGITAL HABITS (11 सुरक्षा आदतें) ----------------- */}
        {activeTab === 'habits' && !viewerData && (
          <div className="space-y-6">
            <div className="bg-amber-50 border border-amber-200 p-6 rounded-2xl">
              <span className="px-3 py-1 bg-amber-200 text-amber-900 rounded-full text-xs font-bold uppercase tracking-wider">
                दैनिक सुरक्षा मंत्र
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-amber-950 mt-1 mb-2">
                11 सुनहरी सुरक्षा आदतें (Golden Digital Habits)
              </h2>
              <p className="text-slate-700 text-sm sm:text-base leading-relaxed">
                हर आदत एक सरल तुलना सिखाती है: <strong>आम गलती (Wrong Habit) → सुरक्षित आदत (Right Habit) → आज का अभ्यास (Practical Action)</strong>।
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {DIGITAL_BANKING_HABITS.map(habit => (
                <div
                  key={habit.id}
                  className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    {/* Header */}
                    <div className="flex items-center justify-between mb-3">
                      <span className="w-8 h-8 rounded-full bg-amber-100 text-amber-900 font-bold flex items-center justify-center text-sm">
                        {habit.habitNumber}
                      </span>
                      <span className="text-xs font-semibold text-slate-400">
                        Habit #{habit.habitNumber}
                      </span>
                    </div>

                    <h3 className="font-bold text-slate-900 text-base sm:text-lg mb-1 leading-snug">
                      {habit.title}
                    </h3>
                    <div className="text-xs text-slate-500 mb-3 font-medium">
                      {habit.englishTitle}
                    </div>

                    {/* Infographic Thumbnail */}
                    <div
                      onClick={() => setZoomedImage({ url: habit.imagePath, title: habit.title })}
                      className="group relative bg-slate-100 rounded-xl overflow-hidden mb-4 border border-slate-200 cursor-zoom-in"
                    >
                      <img
                        src={habit.imagePath}
                        alt={habit.title}
                        className="w-full h-44 object-cover object-top"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold gap-1">
                        <ZoomIn className="w-4 h-4" />
                        <span>बड़ा करें</span>
                      </div>
                    </div>

                    {/* Wrong vs Right */}
                    <div className="space-y-2.5 text-xs sm:text-sm mb-4">
                      <div className="bg-rose-50 border-l-2 border-rose-500 p-2.5 rounded-r-lg">
                        <span className="font-bold text-rose-800 block text-xs">🔴 आम गलती:</span>
                        <span className="text-slate-800">{habit.wrongHabit}</span>
                      </div>
                      <div className="bg-emerald-50 border-l-2 border-emerald-500 p-2.5 rounded-r-lg">
                        <span className="font-bold text-emerald-800 block text-xs">🟢 सही व सुरक्षित आदत:</span>
                        <span className="text-slate-800">{habit.rightHabit}</span>
                      </div>
                    </div>

                    {/* Practical Action */}
                    <div className="bg-teal-50 border border-teal-200 p-3 rounded-xl mb-3">
                      <span className="font-bold text-teal-900 block text-xs mb-0.5">🎯 आज का सुरक्षित अभ्यास:</span>
                      <span className="text-xs sm:text-sm text-teal-950">{habit.practicalAction}</span>
                    </div>

                    {/* Updated Safety Note */}
                    <div className="text-[11px] text-amber-900 bg-amber-50/80 p-2.5 rounded-lg border border-amber-200 mb-3">
                      <span className="font-bold">⚠️ अद्यतन सुझाव: </span>
                      {habit.updatedSafetyNote}
                    </div>
                  </div>

                  {/* Actions / Viewer Trigger */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <button
                      onClick={() => openHabitViewer(habit)}
                      className="text-xs font-bold text-amber-800 hover:text-amber-950 flex items-center gap-1 cursor-pointer"
                    >
                      <span>सचित्र विवरण पढ़ें</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                    <div className="flex flex-wrap gap-1 text-[10px]">
                      {habit.relatedScamIds.map(sId => (
                        <span key={sId} className="px-1.5 py-0.5 bg-rose-100 text-rose-800 rounded font-bold">
                          {sId}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ----------------- TAB 6: 19 SCAM CASES (19 स्कैम केस लाइब्रेरी) ----------------- */}
        {activeTab === 'scams' && !viewerData && (
          <div className="space-y-6">
            <div className="bg-rose-50 border border-rose-200 p-6 rounded-2xl">
              <span className="px-3 py-1 bg-rose-200 text-rose-900 rounded-full text-xs font-bold uppercase tracking-wider">
                सचेत नागरिक • सुरक्षित परिवार
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-rose-950 mt-1 mb-2">
                19 वास्तविक साइबर फ्रॉड एवं स्कैम केस लाइब्रेरी
              </h2>
              <p className="text-slate-700 text-sm sm:text-base leading-relaxed">
                धोखेबाज किस तरह जाल बिछाते हैं, पीड़ित की क्या गलती हुई, और यदि आप या आपका कोई परिचित फंस जाए तो तुरंत क्या कदम उठाने चाहिए।
              </p>

              {/* Filter Tabs & Search */}
              <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-rose-200/60">
                <div className="flex flex-wrap gap-1.5 w-full sm:w-auto">
                  <button
                    onClick={() => setScamFilter('all')}
                    className={`px-3 py-1 rounded-full text-xs font-bold transition-colors cursor-pointer ${
                      scamFilter === 'all'
                        ? 'bg-rose-800 text-white shadow-xs'
                        : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-100'
                    }`}
                  >
                    सभी 19 केस
                  </button>
                  <button
                    onClick={() => setScamFilter('इंपर्सनेशन व धमकी')}
                    className={`px-3 py-1 rounded-full text-xs font-bold transition-colors cursor-pointer ${
                      scamFilter === 'इंपर्सनेशन व धमकी'
                        ? 'bg-rose-800 text-white shadow-xs'
                        : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-100'
                    }`}
                  >
                    इंपर्सनेशन व धमकी (5)
                  </button>
                  <button
                    onClick={() => setScamFilter('भुगतान व QR स्कैम')}
                    className={`px-3 py-1 rounded-full text-xs font-bold transition-colors cursor-pointer ${
                      scamFilter === 'भुगतान व QR स्कैम'
                        ? 'bg-rose-800 text-white shadow-xs'
                        : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-100'
                    }`}
                  >
                    भुगतान व QR स्कैम (7)
                  </button>
                  <button
                    onClick={() => setScamFilter('रिमोट एक्सेस व मालवेयर')}
                    className={`px-3 py-1 rounded-full text-xs font-bold transition-colors cursor-pointer ${
                      scamFilter === 'रिमोट एक्सेस व मालवेयर'
                        ? 'bg-rose-800 text-white shadow-xs'
                        : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-100'
                    }`}
                  >
                    रिमोट एक्सेस व मालवेयर (3)
                  </button>
                  <button
                    onClick={() => setScamFilter('फोन व सिम सुरक्षा')}
                    className={`px-3 py-1 rounded-full text-xs font-bold transition-colors cursor-pointer ${
                      scamFilter === 'फोन व सिम सुरक्षा'
                        ? 'bg-rose-800 text-white shadow-xs'
                        : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-100'
                    }`}
                  >
                    फोन व सिम सुरक्षा (4)
                  </button>
                </div>

                {/* Search Bar */}
                <div className="relative w-full sm:w-64">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="स्कैम खोजें..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-1.5 rounded-full text-xs border border-slate-300 bg-white focus:outline-hidden focus:border-rose-600"
                  />
                </div>
              </div>
            </div>

            {/* Scam Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredScams.map(scam => (
                <div
                  key={scam.id}
                  className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    {/* Badge & Category */}
                    <div className="flex items-center justify-between mb-3">
                      <span className="px-2.5 py-0.5 bg-rose-100 text-rose-800 rounded-full text-xs font-bold">
                        {scam.navigationFilter}
                      </span>
                      <span className="text-xs text-slate-400 font-semibold">
                        Case #{scam.scamNumber}
                      </span>
                    </div>

                    <h3 className="font-extrabold text-slate-900 text-lg sm:text-xl mb-1 leading-snug">
                      {scam.title}
                    </h3>
                    <div className="text-xs text-slate-500 mb-4 font-medium">
                      {scam.englishTitle}
                    </div>

                    {/* Infographic Images (Preserving Variants) */}
                    <div className="mb-4">
                      {scam.variants && scam.variants.length > 0 ? (
                        <div className="space-y-3">
                          {scam.variants.map(v => (
                            <div key={v.variantCode} className="border border-slate-200 rounded-xl p-2.5 bg-slate-50">
                              <div className="font-bold text-xs text-slate-800 mb-1 flex items-center justify-between">
                                <span>वेरिएंट {v.variantCode}: {v.variantTitle}</span>
                                <span className="text-[10px] text-teal-700 font-bold">सचित्र</span>
                              </div>
                              <div
                                onClick={() => setZoomedImage({ url: v.imagePath, title: v.variantTitle })}
                                className="group relative bg-white rounded-lg overflow-hidden border border-slate-200 cursor-zoom-in"
                              >
                                <img
                                  src={v.imagePath}
                                  alt={v.variantTitle}
                                  className="w-full h-36 object-contain"
                                  loading="lazy"
                                />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold gap-1">
                                  <ZoomIn className="w-4 h-4" />
                                  <span>बड़ा करें</span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div
                          onClick={() => setZoomedImage({ url: scam.imagePaths[0], title: scam.title })}
                          className="group relative bg-slate-50 rounded-xl overflow-hidden border border-slate-200 cursor-zoom-in"
                        >
                          <img
                            src={scam.imagePaths[0]}
                            alt={scam.title}
                            className="w-full h-48 object-contain"
                            loading="lazy"
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold gap-1">
                            <ZoomIn className="w-4 h-4" />
                            <span>बड़ा करके देखें</span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* 1. Real-life Story */}
                    <div className="bg-amber-50/70 border-l-2 border-amber-500 p-3 rounded-r-lg text-xs sm:text-sm mb-3">
                      <span className="font-bold text-amber-900 block text-xs">📖 वास्तविक किस्सा (Real-Life Story):</span>
                      <span className="text-slate-800 leading-relaxed">{scam.realLifeStory}</span>
                    </div>

                    {/* 2. Modus Operandi */}
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs sm:text-sm mb-3">
                      <span className="font-bold text-slate-900 block text-xs mb-0.5">⚙️ ठग कैसे काम करते हैं (Modus Operandi):</span>
                      <span className="text-slate-700 leading-relaxed">{scam.howTheScamWorks}</span>
                    </div>

                    {/* 3. Warning Signs */}
                    <div className="mb-3">
                      <span className="font-bold text-rose-900 text-xs block mb-1">🚩 खतरे के संकेत (Warning Signs):</span>
                      <ul className="text-xs text-slate-700 space-y-1">
                        {scam.warningSigns.map((w, idx) => (
                          <li key={idx} className="flex items-start gap-1.5">
                            <span className="text-rose-600 font-bold">⚠️</span>
                            <span>{w}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* 4. Prevention */}
                    <div className="bg-emerald-50/80 border border-emerald-200 p-3 rounded-xl text-xs mb-3">
                      <span className="font-bold text-emerald-900 block mb-1">🛡️ बचाव के नियम (Prevention):</span>
                      <ul className="space-y-1 text-emerald-950">
                        {scam.prevention.map((p, idx) => (
                          <li key={idx} className="flex items-start gap-1.5">
                            <span className="text-emerald-700 font-bold">✓</span>
                            <span>{p}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* 5. What to do if affected */}
                    <div className="bg-rose-50/80 border border-rose-200 p-3 rounded-xl text-xs mb-3">
                      <span className="font-bold text-rose-900 block mb-1">🚨 अगर फंस गए हैं तो तुरंत क्या करें:</span>
                      <ul className="space-y-1 text-rose-950">
                        {scam.whatToDoIfAffected.map((a, idx) => (
                          <li key={idx} className="flex items-start gap-1.5">
                            <span className="text-rose-700 font-bold">→</span>
                            <span>{a}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Legal Fact if present */}
                    {scam.legalRegulatoryFact && (
                      <div className="bg-slate-100 p-2.5 rounded-lg text-[11px] text-slate-700 border border-slate-300 italic mb-3">
                        <span className="font-bold not-italic text-slate-900">⚖️ कानूनी तथ्य: </span>
                        {scam.legalRegulatoryFact}
                      </div>
                    )}
                  </div>

                  {/* Actions / Viewer Trigger */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <button
                      onClick={() => openScamViewer(scam)}
                      className="text-xs font-bold text-rose-700 hover:text-rose-950 flex items-center gap-1 cursor-pointer"
                    >
                      <span>संपूर्ण केस स्टडी व्यू में खोलें</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                    <div className="flex flex-wrap gap-1 text-[10px]">
                      {scam.relatedHabitIds.map(hId => (
                        <span key={hId} className="px-1.5 py-0.5 bg-amber-100 text-amber-900 rounded font-bold">
                          {hId}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ----------------- TAB 7: PHONE & IDENTITY SECURITY ----------------- */}
        {activeTab === 'phone-identity' && !viewerData && (
          <div className="space-y-6">
            <div className="bg-indigo-50 border border-indigo-200 p-6 rounded-2xl">
              <h2 className="text-2xl font-bold text-indigo-950 mb-2">
                स्तंभ 6: फोन व डिजिटल पहचान सुरक्षा (Device & Identity Protection)
              </h2>
              <p className="text-slate-700 text-sm sm:text-base leading-relaxed">
                eSIM सुरक्षा, 4-इन-1 डिजिटल सुरक्षा ऑडिट (आधार, गूगल, वॉट्सऐप), बायोमेट्रिक पासकी और पुराना फोन बेचने से पहले की सावधानियां।
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {DIGITAL_BANKING_CORE_LESSONS.filter(l => l.category.includes('Phone & Identity')).map(lesson => {
                const idx = DIGITAL_BANKING_CORE_LESSONS.findIndex(l => l.id === lesson.id)
                return (
                  <div
                    key={lesson.id}
                    onClick={() => openLessonViewer(idx)}
                    className="bg-white p-6 rounded-2xl border border-slate-200 hover:border-indigo-600 hover:shadow-lg transition-all cursor-pointer flex flex-col justify-between"
                  >
                    <div>
                      <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full mb-2 inline-block">
                        पाठ {lesson.sequenceNumber}
                      </span>
                      <h3 className="font-bold text-slate-900 text-lg mb-2">
                        {lesson.hindiTitle}
                      </h3>
                      <p className="text-sm text-slate-600 mb-4">
                        {lesson.shortDescription}
                      </p>
                    </div>
                    <span className="text-xs font-bold text-indigo-700 flex items-center gap-1 mt-auto">
                      विस्तार से अध्ययन करें <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* ----------------- TAB 8: EMERGENCY HELP (आपातकालीन सहायता केंद्र) ----------------- */}
        {activeTab === 'emergency' && !viewerData && (
          <div className="space-y-8">
            {/* National Helplines Official Directory */}
            <div className="bg-gradient-to-br from-red-900 via-rose-950 to-slate-900 text-white p-6 sm:p-8 rounded-2xl shadow-xl">
              <div className="flex items-center gap-2 text-rose-300 text-xs font-bold uppercase tracking-wider mb-2">
                <Radio className="w-4 h-4 animate-pulse text-red-400" />
                <span>भारत सरकार अधिकृत आपातकालीन सेवाएं</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-black text-white mb-3">
                आपातकालीन सहायता केंद्र — अब क्या करें?
              </h2>
              <p className="text-sm sm:text-base text-rose-100 max-w-3xl leading-relaxed mb-6">
                धोखाधड़ी होने पर सबसे महत्वपूर्ण होता है <strong>पहले 60 मिनट (Golden Hour)</strong>। नीचे दी गई आधिकारिक सेवाओं के जरिए अपने पैसे को आगे निकलने से पहले तुरंत फ्रीज करवाएं।
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-slate-900">
                {/* 1930 Box */}
                <div className="bg-white rounded-xl p-4 border border-rose-300 shadow-md">
                  <div className="text-xs font-bold text-rose-600 uppercase">वित्तीय साइबर धोखाधड़ी</div>
                  <div className="text-2xl font-black text-slate-950 mt-1 mb-1">
                    <a href="tel:1930" className="hover:underline text-rose-700">1930</a>
                  </div>
                  <p className="text-xs text-slate-600 mb-2">
                    I4C / गृह मंत्रालय (24×7 निःशुल्क हेल्पलाइन)।
                  </p>
                  <a
                    href="https://cybercrime.gov.in"
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-bold text-rose-700 flex items-center gap-1 hover:underline"
                  >
                    cybercrime.gov.in <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                {/* Chakshu Box */}
                <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-md">
                  <div className="text-xs font-bold text-indigo-700 uppercase">संदिग्ध कॉल / SMS फ्रॉड</div>
                  <div className="text-xl font-black text-slate-950 mt-1 mb-1">
                    चक्षु (Chakshu)
                  </div>
                  <p className="text-xs text-slate-600 mb-2">
                    धमकी, फर्जी लॉटरी या ठगों के नंबर देशव्यापी ब्लॉक कराने हेतु।
                  </p>
                  <a
                    href="https://sancharsaathi.gov.in/sfc/"
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-bold text-indigo-700 flex items-center gap-1 hover:underline"
                  >
                    चक्षु पोर्टल खोलें <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                {/* CEIR Box */}
                <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-md">
                  <div className="text-xs font-bold text-teal-700 uppercase">खोया या चोरी हुआ फोन</div>
                  <div className="text-xl font-black text-slate-950 mt-1 mb-1">
                    CEIR पोर्टल
                  </div>
                  <p className="text-xs text-slate-600 mb-2">
                    चोरी हुए मोबाइल के 15-अंकों के IMEI को ब्लॉक करने हेतु।
                  </p>
                  <a
                    href="https://ceir.sancharsaathi.gov.in"
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-bold text-teal-700 flex items-center gap-1 hover:underline"
                  >
                    CEIR ब्लॉक पोर्टल <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                {/* TAFCOP Box */}
                <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-md">
                  <div className="text-xs font-bold text-amber-700 uppercase">पहचान चोरी / अज्ञात सिम</div>
                  <div className="text-xl font-black text-slate-950 mt-1 mb-1">
                    TAFCOP पोर्टल
                  </div>
                  <p className="text-xs text-slate-600 mb-2">
                    आपके आधार से कितने सिम कार्ड चल रहे हैं, जांचें व बंद करें।
                  </p>
                  <a
                    href="https://tafcop.sancharsaathi.gov.in"
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-bold text-amber-700 flex items-center gap-1 hover:underline"
                  >
                    TAFCOP खोलें <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>

            {/* Eight Situation-Specific Emergency Action Guides */}
            <div>
              <div className="mb-4">
                <h3 className="text-xl sm:text-2xl font-bold text-slate-900">
                  आठ विशिष्ट आपातकालीन स्थितियां (8 Situation-Specific Guides)
                </h3>
                <p className="text-sm text-slate-600">
                  अपनी समस्या की स्थिति चुनें और तुरंत क्रमबद्ध आधिकारिक कार्रवाई का पालन करें:
                </p>
              </div>

              <div className="space-y-4">
                {DIGITAL_BANKING_EMERGENCY_GUIDES.map(guide => (
                  <div
                    key={guide.id}
                    className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs hover:shadow-md transition-all"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                      <div className="flex items-center gap-2">
                        <span className="px-3 py-1 bg-rose-100 text-rose-800 rounded-full text-xs font-bold">
                          {guide.priorityBadge}
                        </span>
                        <span className="text-xs text-slate-500 font-semibold">
                          समय सीमा: {guide.timeSensitivity}
                        </span>
                      </div>
                      <span className="text-xs text-slate-400 font-mono">
                        Guide #{guide.sequenceNumber}
                      </span>
                    </div>

                    <h4 className="text-lg sm:text-xl font-extrabold text-slate-900 mb-2">
                      {guide.situationTitle}
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-600 mb-4">
                      {guide.situationDescription}
                    </p>

                    {/* Immediate Actions */}
                    <div className="bg-rose-50/70 border border-rose-200 p-4 rounded-xl mb-4">
                      <div className="font-bold text-rose-950 text-xs sm:text-sm mb-2 flex items-center gap-1.5">
                        <AlertTriangle className="w-4 h-4 text-rose-600" />
                        <span>तुरंत करने योग्य कार्रवाई (Immediate Action Steps):</span>
                      </div>
                      <ol className="space-y-2 text-xs sm:text-sm text-slate-900">
                        {guide.immediateAction.map((step, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="font-extrabold text-rose-700">{idx + 1}.</span>
                            <span className="leading-relaxed">{step}</span>
                          </li>
                        ))}
                      </ol>
                    </div>

                    {/* Actions / Viewer Trigger */}
                    <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                      <button
                        onClick={() => openEmergencyViewer(guide)}
                        className="text-xs font-bold text-rose-700 hover:text-rose-950 flex items-center gap-1 cursor-pointer"
                      >
                        <span>संपूर्ण आपातकालीन गाइड व्यू में खोलें</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ----------------- TAB 9: GUIDED PRACTICAL PROJECTS ----------------- */}
        {activeTab === 'projects' && !viewerData && (
          <div>
            {/* OVERVIEW: SHOW 4 PROJECT CARDS IF NO PROJECT SELECTED */}
            {!selectedProjectId ? (
              <div className="space-y-8">
                {returnToSaathi && (
                  <div className="bg-emerald-50 border-2 border-emerald-500/40 p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
                    <span className="text-xs sm:text-sm font-bold text-emerald-950">
                      💡 आप डिजिटल साथी के सुझाव से यहाँ आए हैं।
                    </span>
                    <button
                      onClick={handleReturnToSaathi}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-700 text-white text-xs sm:text-sm font-bold hover:bg-emerald-800 transition-colors cursor-pointer w-full sm:w-auto justify-center"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span>डिजिटल साथी में वापस जाएँ</span>
                    </button>
                  </div>
                )}

                {/* Header */}
                <div className="bg-emerald-950 text-white p-6 sm:p-8 rounded-2xl shadow-lg border border-emerald-800">
                  <div className="flex items-center gap-2 text-emerald-300 text-xs font-bold uppercase tracking-wider mb-2">
                    <Sparkles className="w-4 h-4 text-emerald-400" />
                    <span>प्रैक्टिकल लर्निंग हब</span>
                  </div>
                  <h2 className="text-2xl sm:text-4xl font-black text-white mb-2">
                    चार व्यावहारिक गाइडेड प्रोजेक्ट्स (Four Guided Projects)
                  </h2>
                  <p className="text-sm sm:text-base text-emerald-100 max-w-3xl leading-relaxed">
                    सीखने से आगे — घर बैठे सुरक्षित तरीके से अपने फोन और बैंक खाते में सुरक्षा व्यवस्था स्थापित करें।
                    <br />
                    <span className="text-xs text-emerald-300 font-normal">
                      *सभी अभ्यास 100% सुरक्षित और केवल फोन सेटिंग्स देखने पर आधारित हैं। कोई वास्तविक धन स्थानांतरण या पिन साझा नहीं किया जाता।
                    </span>
                  </p>
                </div>

                {/* 4 Project Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {DIGITAL_BANKING_PROJECTS.map((project, idx) => (
                    <div
                      key={project.id}
                      onClick={() => {
                        setSelectedProjectId(project.id)
                        setPilotStepIndex(0)
                        window.scrollTo({ top: 320, behavior: 'smooth' })
                      }}
                      className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs hover:shadow-lg hover:border-emerald-500 transition-all cursor-pointer flex flex-col justify-between group"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-3">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${project.badgeColor}`}>
                            प्रोजेक्ट {idx + 1} • {project.stepsCount}
                          </span>
                          {project.isInteractivePilot && (
                            <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-amber-100 text-amber-800 border border-amber-300 flex items-center gap-1">
                              ⭐ इंटरैक्टिव पायलट
                            </span>
                          )}
                        </div>

                        <h3 className="text-xl sm:text-2xl font-black text-slate-900 group-hover:text-emerald-700 transition-colors mb-2">
                          {project.title}
                        </h3>
                        <p className="text-xs sm:text-sm text-slate-500 mb-4 font-medium">
                          {project.subtitle}
                        </p>
                        <p className="text-sm text-slate-700 line-clamp-3 mb-4 leading-relaxed font-normal">
                          {project.description}
                        </p>
                      </div>

                      <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-emerald-700 font-bold text-sm">
                        <span>यह प्रोजेक्ट शुरू करें</span>
                        <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              /* DETAILED VIEW: ONLY SHOW SELECTED PROJECT */
              (() => {
                const currentProject = DIGITAL_BANKING_PROJECTS.find(p => p.id === selectedProjectId) || DIGITAL_BANKING_PROJECTS[0]
                const projectIndex = DIGITAL_BANKING_PROJECTS.findIndex(p => p.id === currentProject.id)
                const isPilot = currentProject.isInteractivePilot
                const activeStep = currentProject.handsOnSteps[pilotStepIndex] || currentProject.handsOnSteps[0]

                return (
                  <div className="space-y-6">
                    {/* Top Navigation Bar */}
                    <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
                      <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                        {returnToSaathi && (
                          <button
                            onClick={handleReturnToSaathi}
                            className="px-3.5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs sm:text-sm flex items-center gap-1.5 cursor-pointer transition-colors"
                          >
                            <ArrowLeft className="w-4 h-4" />
                            <span>डिजिटल साथी में वापस जाएँ</span>
                          </button>
                        )}
                        <button
                          onClick={() => {
                            setSelectedProjectId(null)
                            window.scrollTo({ top: 320, behavior: 'smooth' })
                          }}
                          className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-sm flex items-center gap-2 cursor-pointer transition-colors w-full sm:w-auto justify-center"
                        >
                          <ArrowLeft className="w-4 h-4" />
                          <span>← सभी प्रोजेक्ट्स</span>
                        </button>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-slate-600 bg-slate-100 px-3 py-1 rounded-full">
                          प्रोजेक्ट {projectIndex + 1} / {DIGITAL_BANKING_PROJECTS.length}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
                        <button
                          disabled={projectIndex === 0}
                          onClick={() => {
                            setSelectedProjectId(DIGITAL_BANKING_PROJECTS[projectIndex - 1].id)
                            setPilotStepIndex(0)
                            window.scrollTo({ top: 320, behavior: 'smooth' })
                          }}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 ${
                            projectIndex === 0
                              ? 'text-slate-400 bg-slate-50 cursor-not-allowed'
                              : 'text-slate-700 bg-slate-100 hover:bg-slate-200 cursor-pointer'
                          }`}
                        >
                          <ArrowLeft className="w-3.5 h-3.5" />
                          <span>पिछला प्रोजेक्ट</span>
                        </button>

                        <button
                          disabled={projectIndex === DIGITAL_BANKING_PROJECTS.length - 1}
                          onClick={() => {
                            setSelectedProjectId(DIGITAL_BANKING_PROJECTS[projectIndex + 1].id)
                            setPilotStepIndex(0)
                            window.scrollTo({ top: 320, behavior: 'smooth' })
                          }}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 ${
                            projectIndex === DIGITAL_BANKING_PROJECTS.length - 1
                              ? 'text-slate-400 bg-slate-50 cursor-not-allowed'
                              : 'text-emerald-800 bg-emerald-100 hover:bg-emerald-200 cursor-pointer'
                          }`}
                        >
                          <span>अगला प्रोजेक्ट</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Project Header Card */}
                    <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${currentProject.badgeColor}`}>
                          {currentProject.stepsCount}
                        </span>
                        {isPilot && (
                          <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-amber-100 text-amber-800 border border-amber-300">
                            ⭐ इंटरैक्टिव पायलट — सोचिए, समझिए व अभ्यास कीजिए
                          </span>
                        )}
                      </div>

                      <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mb-1">
                        {currentProject.title}
                      </h2>
                      <p className="text-sm text-slate-500 mb-4 font-medium">
                        {currentProject.subtitle}
                      </p>
                      <p className="text-base text-slate-700 leading-relaxed mb-6">
                        {currentProject.description}
                      </p>

                      {/* Real Life Story */}
                      <div className="bg-amber-50/80 border-l-4 border-amber-500 p-4 sm:p-5 rounded-r-xl">
                        <span className="font-bold text-amber-900 text-sm block mb-1">
                          📖 मूल वास्तविक कहानी (Original Story):
                        </span>
                        <p className="text-sm sm:text-base text-slate-800 leading-relaxed">
                          {currentProject.originalStory}
                        </p>
                      </div>
                    </div>

                    {/* IF INTERACTIVE PILOT (PROJECT 1): STEPPER + 6 STAGES */}
                    {isPilot ? (
                      <div className="space-y-6">
                        {/* 5-Step Stepper Tabs */}
                        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                          <div className="flex items-center justify-between text-xs font-bold text-slate-500 mb-3 px-1">
                            <span>चरण दर चरण अभ्यास (Step-by-Step Interactive Flow)</span>
                            <span>चरण {pilotStepIndex + 1} / {currentProject.handsOnSteps.length}</span>
                          </div>

                          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                            {currentProject.handsOnSteps.map((s, idx) => (
                              <button
                                key={s.stepNumber}
                                onClick={() => {
                                  setPilotStepIndex(idx)
                                  window.scrollTo({ top: 400, behavior: 'smooth' })
                                }}
                                className={`p-2.5 rounded-xl text-left font-bold text-xs sm:text-sm transition-all cursor-pointer flex items-center gap-2 ${
                                  pilotStepIndex === idx
                                    ? 'bg-emerald-700 text-white shadow-md'
                                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                                }`}
                              >
                                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs shrink-0 ${
                                  pilotStepIndex === idx ? 'bg-white text-emerald-800 font-extrabold' : 'bg-slate-300 text-slate-800'
                                }`}>
                                  {idx + 1}
                                </span>
                                <span className="truncate">{s.title.split(' ')[0]} {s.title.split(' ')[1] || ''}</span>
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Active Step Container (The 6 Stages) */}
                        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
                          {/* Step Header */}
                          <div className="border-b border-slate-200 pb-4">
                            <span className="text-xs font-extrabold uppercase text-emerald-700 tracking-wider">
                              चरण {activeStep.stepNumber} / 5
                            </span>
                            <h3 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
                              {activeStep.title}
                            </h3>
                            <p className="text-sm sm:text-base text-slate-600 mt-1">
                              <strong>उद्देश्य: </strong>{activeStep.objective}
                            </p>
                          </div>

                          {/* STAGE 1: सोचिए (Relatable Real-Life Question) */}
                          {activeStep.thinkQuestion && (
                            <div className="bg-amber-50/70 border-l-4 border-amber-500 p-4 sm:p-5 rounded-r-2xl">
                              <div className="flex items-center gap-2 text-amber-900 font-extrabold text-sm sm:text-base mb-1.5">
                                <span className="text-xl">🤔</span>
                                <span>१. ज़रा सोचिए (Think)</span>
                              </div>
                              <p className="text-base sm:text-lg text-slate-900 font-semibold leading-relaxed">
                                {activeStep.thinkQuestion}
                              </p>
                            </div>
                          )}

                          {/* STAGE 2: अपना जवाब चुनिए (Simple Interactive Multiple-Choice with Instant Feedback) */}
                          {activeStep.thinkInteraction && (
                            <div className="bg-slate-50 border border-slate-200 p-4 sm:p-5 rounded-2xl">
                              <div className="flex items-center gap-2 text-slate-900 font-extrabold text-sm sm:text-base mb-3">
                                <span>🔘</span>
                                <span>२. अपना जवाब चुनिए (Choose Your Answer)</span>
                              </div>
                              <p className="text-sm sm:text-base text-slate-700 font-medium mb-3">
                                {activeStep.thinkInteraction.question}
                              </p>

                              <div className="space-y-2.5">
                                {activeStep.thinkInteraction.options.map(opt => {
                                  const key = `${pilotStepIndex}-think`
                                  const isSelected = pilotAnswers[key] === opt.id

                                  return (
                                    <div key={opt.id} className="space-y-2">
                                      <button
                                        onClick={() => setPilotAnswers(prev => ({ ...prev, [key]: opt.id }))}
                                        className={`w-full text-left p-3.5 sm:p-4 rounded-xl border text-sm sm:text-base font-semibold transition-all cursor-pointer flex items-start gap-3 ${
                                          isSelected
                                            ? opt.isCorrect
                                              ? 'bg-emerald-50 border-emerald-500 text-emerald-950 shadow-xs'
                                              : 'bg-amber-50 border-amber-500 text-amber-950 shadow-xs'
                                            : 'bg-white border-slate-300 text-slate-800 hover:bg-slate-100 hover:border-slate-400'
                                        }`}
                                      >
                                        <span className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-0.5 ${
                                          isSelected
                                            ? opt.isCorrect
                                              ? 'border-emerald-600 bg-emerald-600 text-white'
                                              : 'border-amber-600 bg-amber-600 text-white'
                                            : 'border-slate-400'
                                        }`}>
                                          {isSelected ? (opt.isCorrect ? '✓' : '!') : ''}
                                        </span>
                                        <span>{opt.text}</span>
                                      </button>

                                      {isSelected && (
                                        <div className={`p-3.5 rounded-xl text-xs sm:text-sm font-medium leading-relaxed pl-10 ${
                                          opt.isCorrect ? 'bg-emerald-100/70 text-emerald-950 border border-emerald-300' : 'bg-amber-100/70 text-amber-950 border border-amber-300'
                                        }`}>
                                          <strong>{opt.isCorrect ? '✅ प्रतिक्रिया: ' : 'ℹ️ सही जानकारी: '}</strong>
                                          {opt.feedback}
                                        </div>
                                      )}
                                    </div>
                                  )
                                })}
                              </div>
                            </div>
                          )}

                          {/* STAGE 3: अब समझिए (Short Explanation) */}
                          <div className="bg-blue-50/70 border-l-4 border-blue-500 p-4 sm:p-5 rounded-r-2xl">
                            <div className="flex items-center gap-2 text-blue-900 font-extrabold text-sm sm:text-base mb-1.5">
                              <Lightbulb className="w-5 h-5 text-blue-700" />
                              <span>३. अब समझिए (Understand)</span>
                            </div>
                            <p className="text-sm sm:text-base text-slate-800 leading-relaxed font-medium">
                              {activeStep.instruction}
                            </p>
                          </div>

                          {/* STAGE 4: चित्र देखकर सीखिए (Original Infographic Integration) */}
                          {activeStep.relatedInfographic && (
                            <div className="bg-slate-900 text-white rounded-2xl p-4 sm:p-6 shadow-inner">
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                                <div className="flex items-center gap-2">
                                  <Eye className="w-5 h-5 text-amber-400" />
                                  <h4 className="font-bold text-sm sm:text-base text-white">
                                    ४. चित्र देखकर सीखिए (Visual Discovery)
                                  </h4>
                                </div>
                                <span className="text-xs text-amber-300 font-medium">
                                  {activeStep.relatedInfographic.title}
                                </span>
                              </div>

                              <div className="relative group bg-slate-950 rounded-xl overflow-hidden border border-slate-800 max-w-2xl mx-auto">
                                <img
                                  src={activeStep.relatedInfographic.path}
                                  alt={activeStep.relatedInfographic.title}
                                  className="w-full h-auto max-h-[480px] object-contain mx-auto cursor-zoom-in"
                                  onClick={() => setZoomedImage({
                                    url: activeStep.relatedInfographic!.path,
                                    title: activeStep.relatedInfographic!.title
                                  })}
                                />
                                <button
                                  onClick={() => setZoomedImage({
                                    url: activeStep.relatedInfographic!.path,
                                    title: activeStep.relatedInfographic!.title
                                  })}
                                  className="absolute bottom-3 right-3 bg-slate-900/90 text-white px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-lg border border-slate-700 hover:bg-slate-800 transition-colors"
                                >
                                  <ZoomIn className="w-4 h-4 text-amber-400" />
                                  <span>संबंधित चित्र बड़ा देखें</span>
                                </button>
                              </div>

                              <p className="text-xs sm:text-sm text-slate-300 mt-3 text-center">
                                {activeStep.relatedInfographic.caption}
                              </p>
                            </div>
                          )}

                          {/* STAGE 5: सुरक्षित अभ्यास (Observation-Only Task) */}
                          <div className="bg-emerald-50/70 border border-emerald-200 p-4 sm:p-5 rounded-2xl space-y-3">
                            <div className="flex items-center gap-2 text-emerald-900 font-extrabold text-sm sm:text-base">
                              <CheckCircle2 className="w-5 h-5 text-emerald-700" />
                              <span>५. घर बैठे सुरक्षित अभ्यास (Safe Hands-on Practice)</span>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                              <div className="bg-white p-3.5 rounded-xl border border-emerald-200 text-xs sm:text-sm text-emerald-950">
                                <span className="font-extrabold block mb-1">🎯 अपेक्षित परिणाम (Expected Result):</span>
                                {activeStep.expectedResult}
                              </div>
                              <div className="bg-amber-50 p-3.5 rounded-xl border border-amber-200 text-xs sm:text-sm text-amber-950">
                                <span className="font-extrabold block mb-1">🛡️ सुरक्षा नियम (Safety Rule):</span>
                                {activeStep.safetyRule}
                              </div>
                            </div>
                          </div>

                          {/* STAGE 6: क्या सीखा? (Self-Check Question) */}
                          {activeStep.selfCheck && (
                            <div className="bg-purple-50/70 border border-purple-200 p-4 sm:p-5 rounded-2xl">
                              <div className="flex items-center gap-2 text-purple-900 font-extrabold text-sm sm:text-base mb-2">
                                <span>✅</span>
                                <span>६. क्या सीखा? (Quick Self-Check)</span>
                              </div>
                              <p className="text-sm sm:text-base text-slate-900 font-semibold mb-3">
                                {activeStep.selfCheck.question}
                              </p>

                              <div className="space-y-2">
                                {activeStep.selfCheck.options.map(opt => {
                                  const key = `${pilotStepIndex}-self`
                                  const isSelected = pilotAnswers[key] === opt.id

                                  return (
                                    <div key={opt.id} className="space-y-1.5">
                                      <button
                                        onClick={() => setPilotAnswers(prev => ({ ...prev, [key]: opt.id }))}
                                        className={`w-full text-left p-3 rounded-xl border text-sm font-semibold transition-all cursor-pointer flex items-center justify-between ${
                                          isSelected
                                            ? opt.isCorrect
                                              ? 'bg-purple-100 border-purple-500 text-purple-950'
                                              : 'bg-rose-50 border-rose-400 text-rose-950'
                                            : 'bg-white border-slate-300 text-slate-800 hover:bg-slate-100'
                                        }`}
                                      >
                                        <span>{opt.text}</span>
                                        {isSelected && (
                                          <span className="font-bold text-xs">{opt.isCorrect ? '✅ सही' : '❌ गलत'}</span>
                                        )}
                                      </button>
                                      {isSelected && (
                                        <div className={`p-2.5 rounded-lg text-xs font-medium pl-3 ${
                                          opt.isCorrect ? 'bg-purple-100/70 text-purple-950' : 'bg-rose-100/70 text-rose-950'
                                        }`}>
                                          {opt.feedback}
                                        </div>
                                      )}
                                    </div>
                                  )
                                })}
                              </div>
                            </div>
                          )}

                          {/* Bottom Step Navigation Bar */}
                          <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
                            <button
                              disabled={pilotStepIndex === 0}
                              onClick={() => {
                                setPilotStepIndex(prev => Math.max(0, prev - 1))
                                window.scrollTo({ top: 400, behavior: 'smooth' })
                              }}
                              className={`w-full sm:w-auto px-5 py-2.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 ${
                                pilotStepIndex === 0
                                  ? 'text-slate-400 bg-slate-100 cursor-not-allowed'
                                  : 'text-slate-800 bg-slate-100 hover:bg-slate-200 cursor-pointer'
                              }`}
                            >
                              <ArrowLeft className="w-4 h-4" />
                              <span>← पिछला चरण</span>
                            </button>

                            <div className="text-xs font-bold text-slate-500">
                              चरण {pilotStepIndex + 1} of 5
                            </div>

                            {pilotStepIndex < currentProject.handsOnSteps.length - 1 ? (
                              <button
                                onClick={() => {
                                  setPilotStepIndex(prev => prev + 1)
                                  window.scrollTo({ top: 400, behavior: 'smooth' })
                                }}
                                className="w-full sm:w-auto px-6 py-2.5 rounded-xl font-bold text-sm bg-emerald-700 hover:bg-emerald-800 text-white flex items-center justify-center gap-2 cursor-pointer shadow-md"
                              >
                                <span>अगला चरण →</span>
                                <ArrowRight className="w-4 h-4" />
                              </button>
                            ) : (
                              <button
                                onClick={() => {
                                  setSelectedProjectId(null)
                                  window.scrollTo({ top: 320, behavior: 'smooth' })
                                }}
                                className="w-full sm:w-auto px-6 py-2.5 rounded-xl font-bold text-sm bg-emerald-800 hover:bg-emerald-900 text-white flex items-center justify-center gap-2 cursor-pointer shadow-md"
                              >
                                <span>🎉 प्रोजेक्ट पूर्ण! सभी प्रोजेक्ट्स देखें →</span>
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ) : (
                      /* FOR PROJECTS 2, 3, 4: EXPANDED DETAILED STEPS WITH INFOGRAPHIC BUTTONS */
                      <div className="space-y-6">
                        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
                          <h3 className="text-xl sm:text-2xl font-black text-slate-900 mb-4 flex items-center gap-2">
                            <Sparkles className="w-6 h-6 text-emerald-600" />
                            <span>प्रोजेक्ट के 5 गाइडेड चरण (Five Guided Steps):</span>
                          </h3>

                          {currentProject.id === 'project-lost-phone-lockdown' && (
                            <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-xl text-xs sm:text-sm text-amber-950 font-medium mb-6">
                              <strong className="block mb-1">💡 महत्वपूर्ण शैक्षणिक नोट (Educational Context):</strong>
                              यह 5-चरणीय प्रक्रिया सीखने और समझने के लिए चरणबद्ध रूप से प्रस्तुत की गई है। वास्तविक जीवन में यदि फोन चोरी हुआ हो या फ्रॉड की सक्रिय आशंका हो, तो प्रतीक्षा न करें — सिम ब्लॉकिंग और बैंक सुरक्षा की कार्रवाई समानांतर (Parallel) रूप से सबसे पहले और तुरंत करें।
                            </div>
                          )}

                          <div className="space-y-6">
                            {currentProject.handsOnSteps.map(step => (
                              <div
                                key={step.stepNumber}
                                className="bg-slate-50 border border-slate-200 rounded-2xl p-5 sm:p-6 text-sm"
                              >
                                <div className="flex items-center gap-3 font-black text-slate-900 text-base sm:text-lg mb-2">
                                  <span className="w-8 h-8 rounded-xl bg-emerald-700 text-white flex items-center justify-center text-sm shrink-0">
                                    {step.stepNumber}
                                  </span>
                                  <span>{step.title}</span>
                                </div>

                                <div className="text-slate-600 text-xs sm:text-sm mb-3 pl-11">
                                  <strong>उद्देश्य: </strong>{step.objective}
                                </div>

                                <div className="text-slate-800 text-sm sm:text-base leading-relaxed mb-4 pl-11 font-medium">
                                  <strong className="text-slate-950">निर्देश: </strong>
                                  {step.instruction}
                                </div>

                                {/* Infographic Button if exists */}
                                {step.relatedInfographic && (
                                  <div className="mb-4 pl-11">
                                    <button
                                      onClick={() => setZoomedImage({
                                        url: step.relatedInfographic!.path,
                                        title: step.relatedInfographic!.title
                                      })}
                                      className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-xl text-xs sm:text-sm font-bold shadow-xs transition-colors cursor-pointer"
                                    >
                                      <Eye className="w-4 h-4 text-amber-400" />
                                      <span>संबंधित चित्र देखें: {step.relatedInfographic.title}</span>
                                      <ZoomIn className="w-3.5 h-3.5 text-slate-400" />
                                    </button>
                                  </div>
                                )}

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pl-11">
                                  <div className="bg-white p-3.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-emerald-950">
                                    <strong className="block mb-1">अपेक्षित परिणाम:</strong>
                                    {step.expectedResult}
                                  </div>
                                  <div className="bg-amber-50 p-3.5 rounded-xl border border-amber-200 text-xs sm:text-sm text-amber-950">
                                    <strong className="block mb-1">सुरक्षा नियम:</strong>
                                    {step.safetyRule}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Real-Life Outcome */}
                        <div className="bg-emerald-50 border border-emerald-200 p-5 sm:p-6 rounded-2xl flex items-center gap-4">
                          <CheckCircle2 className="w-8 h-8 text-emerald-600 shrink-0" />
                          <div>
                            <span className="font-black text-emerald-950 text-base block mb-0.5">
                              वास्तविक परिणाम (Real-Life Outcome):
                            </span>
                            <span className="text-sm text-emerald-900 font-medium">
                              {currentProject.realLifeOutcome}
                            </span>
                          </div>
                        </div>

                        {/* Bottom Return Bar */}
                        <div className="flex items-center justify-between pt-2">
                          <button
                            onClick={() => {
                              setSelectedProjectId(null)
                              window.scrollTo({ top: 320, behavior: 'smooth' })
                            }}
                            className="px-5 py-2.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-sm cursor-pointer"
                          >
                            ← सभी प्रोजेक्ट्स सूची
                          </button>
                          {projectIndex < DIGITAL_BANKING_PROJECTS.length - 1 && (
                            <button
                              onClick={() => {
                                setSelectedProjectId(DIGITAL_BANKING_PROJECTS[projectIndex + 1].id)
                                window.scrollTo({ top: 320, behavior: 'smooth' })
                              }}
                              className="px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm flex items-center gap-1.5 cursor-pointer shadow-md"
                            >
                              <span>अगला प्रोजेक्ट</span>
                              <ArrowRight className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )
              })()
            )}
          </div>
        )}

        {/* ----------------- TAB 10: REFERENCE POSTERS (संदर्भ पोस्टर्स) ----------------- */}
        {activeTab === 'posters' && !viewerData && (
          <div className="space-y-6">
            <div className="bg-slate-900 text-white p-6 rounded-2xl">
              <h2 className="text-2xl font-bold mb-2">
                मास्टर संदर्भ पोस्टर्स (6 Master Reference Posters)
              </h2>
              <p className="text-slate-300 text-sm">
                डिजिटल दुनिया के उपयोगी संकेत, चेक के प्रकार, RTGS/NEFT/IMPS तुलना और 16 जरूरी नियम।
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {DIGITAL_BANKING_POSTERS.map(poster => (
                <div
                  key={poster.id}
                  className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full mb-2 inline-block">
                      {poster.categoryBadge}
                    </span>
                    <h3 className="font-bold text-slate-900 text-base mb-1">
                      {poster.title}
                    </h3>
                    <p className="text-xs text-slate-600 mb-3">
                      {poster.description}
                    </p>

                    <div
                      onClick={() => setZoomedImage({ url: poster.imagePath, title: poster.title })}
                      className="group relative bg-slate-100 rounded-xl overflow-hidden mb-3 border border-slate-200 cursor-zoom-in"
                    >
                      <img
                        src={poster.imagePath}
                        alt={poster.title}
                        className="w-full h-48 object-contain"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold gap-1">
                        <ZoomIn className="w-4 h-4" />
                        <span>बड़ा करके देखें</span>
                      </div>
                    </div>

                    <div className="space-y-1 text-xs text-slate-700">
                      {poster.keyHighlights.map((k, idx) => (
                        <div key={idx} className="flex items-start gap-1">
                          <span className="text-teal-600 font-bold">•</span>
                          <span>{k}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => setZoomedImage({ url: poster.imagePath, title: poster.title })}
                    className="mt-4 w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-lg transition-colors cursor-pointer text-center"
                  >
                    पूरा पोस्टर देखें (Full Size)
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* 5. LIGHTBOX / ZOOMABLE IMAGE MODAL */}
      {zoomedImage && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="zoomed-image-title"
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6"
        >
          <div className="relative max-w-5xl w-full bg-slate-900 rounded-2xl overflow-hidden border border-slate-700 shadow-2xl flex flex-col max-h-[95vh]">
            <div className="flex items-center justify-between p-4 bg-slate-950 text-white border-b border-slate-800">
              <div id="zoomed-image-title" className="font-bold text-sm sm:text-base text-emerald-300 truncate pr-4">
                {zoomedImage.title}
              </div>
              <button
                onClick={() => setZoomedImage(null)}
                className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                title="बंद करें"
                aria-label="बंद करें"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-2 sm:p-4 overflow-auto flex items-center justify-center bg-slate-950/50">
              <img
                src={zoomedImage.url}
                alt={zoomedImage.title}
                className="max-h-[80vh] w-auto max-w-full object-contain rounded-lg"
              />
            </div>
            <div className="p-3 bg-slate-950 text-slate-400 text-xs text-center border-t border-slate-800">
              स्पर्श या माउस स्क्रॉल करके ज़ूम करें। मूल सचित्र शैक्षिक कृति: श्री विनोद सिंगला (भूतपूर्व DIO, NIC, कुरुक्षेत्र)।
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
