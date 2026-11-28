import React, { useState, useMemo } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Header } from '../components/Header'
import { Footer } from '../components/Footer'
import { Breadcrumbs } from '../components/Breadcrumbs'
import { NoticeModal } from '../components/NoticeModal'
import { usePublicCurriculum } from '../context/PublicCurriculumContext'
import { CurriculumLoadingState } from '../components/common/CurriculumLoadingState'
import { CurriculumErrorState } from '../components/common/CurriculumErrorState'
import { isTopicPublished, getTopicTutorial, buildTutorialUrl } from '../config/topicTutorials'
import { GMAIL_NEEDS } from '../data/gmailNeedsData'
import { CALENDAR_NEEDS } from '../data/calendarNeedsData'
import { CALENDAR_PRACTICE_CARDS } from '../data/calendarPracticeData'
import { CALENDAR_PROJECT_CARDS } from '../data/calendarProjectsData'
import { GMAIL_PROJECT_CARDS } from '../data/gmailProjectsData'
import { CALENDAR_REFERENCE_POSTERS, type CalendarReferencePoster } from '../data/calendarReferencePostersData'
import { CuriosityBanner } from '../components/CuriosityBanner'
import { GMAIL_CURIOSITY_CARDS } from '../data/gmailCuriosityData'
import { CALENDAR_CURIOSITY_CARDS } from '../data/calendarCuriosityData'
import { DigitalBankingView } from '../components/digital-banking/DigitalBankingView'
import type { TopicItem } from '../types'
import { 
  ArrowLeft, 
  ArrowRight, 
  BarChart3, 
  Workflow, 
  TableProperties, 
  GitBranch, 
  Sparkles, 
  Binary, 
  Layers, 
  HelpCircle,
  Search,
  X,
  Mail,
  Inbox,
  Send,
  Clock,
  ShieldCheck,
  Sliders,
  CheckCircle2,
  Sparkle,
  BookOpen,
  Calendar,
  Users,
  ExternalLink,
  Eye,
  ChevronDown,
  ChevronUp
} from 'lucide-react'

// Level sort priority: 1. Beginner, 2. Intermediate, 3. Advanced
const LEVEL_PRIORITY: Record<string, number> = {
  Beginner: 1,
  Intermediate: 2,
  Advanced: 3,
}

type LevelFilter = 'All' | 'Beginner' | 'Intermediate' | 'Advanced'

const getPracticeCategoryColor = (label: string) => {
  if (label.includes('विद्यार्थी') || label.includes('Students')) {
    return 'bg-blue-50 text-blue-700 border-blue-200'
  }
  if (label.includes('ऑफिस') || label.includes('Office')) {
    return 'bg-indigo-50 text-indigo-700 border-indigo-200'
  }
  if (label.includes('वरिष्ठ') || label.includes('Senior')) {
    return 'bg-amber-50 text-amber-800 border-amber-200'
  }
  if (label.includes('परिवार') || label.includes('Family')) {
    return 'bg-purple-50 text-purple-700 border-purple-200'
  }
  return 'bg-emerald-50 text-emerald-700 border-emerald-200'
}

const getRecommendationGridClass = (count: number, isCalendar: boolean) => {
  if (!isCalendar) {
    return 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'
  }
  if (count === 1) {
    return 'grid grid-cols-1 gap-4'
  }
  if (count === 2) {
    return 'grid grid-cols-1 sm:grid-cols-2 gap-4'
  }
  return 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'
}

export const CategoryPage: React.FC = () => {
  const { categorySlug } = useParams<{ categorySlug: string }>()

  const [modalState, setModalState] = useState<{
    isOpen: boolean
    title: string
    message: string
  }>({
    isOpen: false,
    title: '',
    message: '',
  })

  const [searchQuery, setSearchQuery] = useState('')
  const [selectedLevel, setSelectedLevel] = useState<LevelFilter>('All')
  const [prevCategorySlug, setPrevCategorySlug] = useState(categorySlug)

  // Gmail Need-based state
  const [selectedNeedId, setSelectedNeedId] = useState<string | null>(null)
  const [selectedProblemId, setSelectedProblemId] = useState<string | null>(null)
  const [showAllTopics, setShowAllTopics] = useState(false)
  const [selectedPoster, setSelectedPoster] = useState<CalendarReferencePoster | null>(null)

  // Calendar collapsible sections state
  const [isSeriesExpanded, setIsSeriesExpanded] = useState(false)
  const [isPracticeExpanded, setIsPracticeExpanded] = useState(false)
  const [isProjectsExpanded, setIsProjectsExpanded] = useState(false)
  const [isPostersExpanded, setIsPostersExpanded] = useState(false)

  // Gmail collapsible projects state (default open for easy discovery)
  const [isGmailProjectsExpanded, setIsGmailProjectsExpanded] = useState(true)

  const handleQuickNav = (
    sectionId: string,
    expandStateSetter?: React.Dispatch<React.SetStateAction<boolean>>
  ) => {
    if (expandStateSetter) {
      expandStateSetter(true)
    }
    setTimeout(() => {
      const el = document.getElementById(sectionId)
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }, 60)
  }

  // Reset search and filters when navigating between categories
  if (prevCategorySlug !== categorySlug) {
    setPrevCategorySlug(categorySlug)
    setSearchQuery('')
    setSelectedLevel('All')
    setSelectedNeedId(null)
    setSelectedProblemId(null)
    setShowAllTopics(false)
    setIsSeriesExpanded(false)
    setIsPracticeExpanded(false)
    setIsProjectsExpanded(false)
    setIsPostersExpanded(false)
    setIsGmailProjectsExpanded(true)
  }

  const { categories, topics: allTopics, isLoading, error, retry } = usePublicCurriculum()

  const category = categories.find(
    (c) => c.slug === categorySlug || c.id === categorySlug
  )

  const isGmailCategory = category?.id === 'gmail' || category?.slug === 'gmail'
  const isCalendarCategory = category?.id === 'calendar' || category?.slug === 'calendar'
  const isDigitalBankingCategory = category?.id === 'digital-banking' || category?.slug === 'digital-banking' || categorySlug === 'digital-banking'
  const isNeedBasedCategory = isGmailCategory || isCalendarCategory

  // 1. Filter only published topics for this category, ordered: Beginner -> Intermediate -> Advanced -> curriculum displayOrder
  const publishedTopics = useMemo(() => {
    if (!category) return []

    const list = allTopics.filter(
      (t) => t.categoryId === category.id && isTopicPublished(t)
    )

    if (category.id === 'calendar') {
      const CALENDAR_DAY_ORDER: Record<string, number> = {
        'calendar-create-event': 1,
        'calendar-mobile-vs-desktop': 30,
        'calendar-smart-habits': 29,
        'calendar-offline-sync': 28,
        'calendar-notification-settings': 27,
        'calendar-events-from-gmail': 26,
        'calendar-trash-restore': 25,
        'calendar-time-zones': 24,
        'calendar-settings-preferences': 23,
        'calendar-print-calendar': 22,
        'calendar-import-export': 21,
        'calendar-views-navigation': 20,
        'calendar-common-mistakes': 19,
        'calendar-public-holidays': 18,
        'calendar-tasks-in-calendar': 17,
        'calendar-appointment-schedule': 16,
        'calendar-working-hours': 15,
        'calendar-google-meet': 14,
        'calendar-invite-guests': 13,
        'calendar-search-events': 12,
        'calendar-multiple-calendars': 11,
        'calendar-color-coding': 10,
        'calendar-all-day-events': 9,
        'calendar-departure-time': 8,
        'calendar-alarm-vs-calendar': 7,
        'calendar-share-calendar': 6,
        'calendar-event-location': 5,
        'calendar-notifications-reminders': 4,
        'calendar-edit-delete-events': 3,
        'calendar-recurring-events': 2,
      }
      return [...list].sort((a, b) => {
        const orderA = CALENDAR_DAY_ORDER[a.id] ?? (a.displayOrder || 99)
        const orderB = CALENDAR_DAY_ORDER[b.id] ?? (b.displayOrder || 99)
        return orderA - orderB
      })
    }

    if (category.id === 'gmail') {
      const GMAIL_DAY_ORDER: Record<string, number> = {
        'gmail-translate': 1,
        'gmail-email-summarize': 2,
        'gmail-preview-pane': 3,
        'gmail-inbox-density': 4,
        'gmail-inbox-categories': 5,
        'gmail-inbox-type': 6,
        'gmail-multiple-inboxes': 7,
        'gmail-search-operators': 8,
        'gmail-filters': 9,
        'gmail-block-spam-phishing': 10,
        'gmail-snooze-email': 11,
        'gmail-schedule-send': 12,
        'gmail-confidential-mode': 13,
        'gmail-undo-send': 14,
        'gmail-archive-email': 15,
        'gmail-email-suggestions-contacts': 16,
        'gmail-conversation-view': 17,
        'gmail-add-to-tasks': 18,
        'gmail-signature': 19,
        'gmail-templates': 20,
        'gmail-vacation-responder': 21,
        'gmail-storage': 22,
        'gmail-large-files-drive': 23,
        'gmail-contact-labels': 24,
        'gmail-mute-conversation': 25,
        'gmail-mobile-vs-desktop': 26,
        'gmail-delegation': 27,
        'gmail-forward-as-attachment': 28,
        'gmail-alias': 29,
        'gmail-offline': 30,
        'gmail-nudges': 31,
        'gmail-smart-reply-smart-compose': 32,
        'gmail-multiple-stars': 33,
        'gmail-send-and-archive': 34,
        'gmail-swipe-actions': 35,
        'gmail-keyboard-shortcuts': 36,
      }
      return [...list].sort((a, b) => {
        const orderA = GMAIL_DAY_ORDER[a.id] ?? (a.displayOrder || 99)
        const orderB = GMAIL_DAY_ORDER[b.id] ?? (b.displayOrder || 99)
        return orderA - orderB
      })
    }

    return [...list].sort((a, b) => {
      const priorityA = (a.difficulty && LEVEL_PRIORITY[a.difficulty]) || 99
      const priorityB = (b.difficulty && LEVEL_PRIORITY[b.difficulty]) || 99
      if (priorityA !== priorityB) {
        return priorityA - priorityB
      }
      return (a.displayOrder || 0) - (b.displayOrder || 0)
    })
  }, [allTopics, category])

  // Fast lookup dictionary for topics by ID
  const topicMap = useMemo(() => {
    const map = new Map<string, TopicItem>()
    publishedTopics.forEach((t) => map.set(t.id, t))
    return map
  }, [publishedTopics])

  // Count published learning resources for a topic accurately
  const getTopicPublishedResourceCount = (topic: TopicItem) => {
    const publishedList = Array.isArray(topic.resources)
      ? topic.resources.filter((r) => r.status === 'Published')
      : []
    const hasRegisteredTutorial = Boolean(getTopicTutorial(topic.id))
    const tutorialInResources = publishedList.some((r) => r.type === 'Tutorial')
    return hasRegisteredTutorial && !tutorialInResources
      ? publishedList.length + 1
      : publishedList.length
  }

  // 2. Smart Topic Finder Conditional Thresholds
  const totalPublishedCount = publishedTopics.length
  const showSearch = totalPublishedCount >= 7
  const showLevelFilter = totalPublishedCount >= 16 && (!isNeedBasedCategory || showAllTopics)

  // 3. Search and Level Filtering
  const visibleTopics = useMemo(() => {
    return publishedTopics.filter((topic) => {
      // Search filter (active when search is enabled)
      if (showSearch && searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim()
        const titleMatch = topic.title.toLowerCase().includes(q)
        const descMatch = (topic.shortDescription || '').toLowerCase().includes(q) ||
                          (topic.detailedDescription || '').toLowerCase().includes(q)
        
        // Also match Hindi title in resources if present
        const resMatch = Array.isArray(topic.resources) && topic.resources.some((r) => {
          return (r.title && r.title.toLowerCase().includes(q)) ||
                 (r.description && r.description.toLowerCase().includes(q))
        })

        if (!titleMatch && !descMatch && !resMatch) {
          return false
        }
      }

      // Level filter (active when level filter is enabled)
      if (showLevelFilter && selectedLevel !== 'All') {
        if (topic.difficulty !== selectedLevel) {
          return false
        }
      }

      return true
    })
  }, [publishedTopics, showSearch, showLevelFilter, searchQuery, selectedLevel])

  const getCategoryIcon = (iconName?: string) => {
    switch (iconName) {
      case 'BarChart3':
        return <BarChart3 className="w-8 h-8 text-amber-600" />
      case 'Workflow':
        return <Workflow className="w-8 h-8 text-teal-700" />
      case 'TableProperties':
        return <TableProperties className="w-8 h-8 text-teal-700" />
      case 'GitBranch':
        return <GitBranch className="w-8 h-8 text-teal-700" />
      case 'Sparkles':
        return <Sparkles className="w-8 h-8 text-teal-700" />
      case 'Binary':
        return <Binary className="w-8 h-8 text-blue-600" />
      case 'Mail':
        return <Mail className="w-8 h-8 text-rose-600" />
      default:
        return <Layers className="w-8 h-8 text-teal-700" />
    }
  }

  const getNeedIcon = (iconName: string) => {
    switch (iconName) {
      case 'Calendar':
        return <Calendar className="w-5 h-5 text-teal-600" />
      case 'Inbox':
        return <Inbox className="w-5 h-5 text-teal-600" />
      case 'Search':
        return <Search className="w-5 h-5 text-blue-600" />
      case 'Send':
        return <Send className="w-5 h-5 text-indigo-600" />
      case 'Clock':
        return <Clock className="w-5 h-5 text-amber-600" />
      case 'ShieldCheck':
        return <ShieldCheck className="w-5 h-5 text-emerald-600" />
      case 'Sliders':
        return <Sliders className="w-5 h-5 text-purple-600" />
      case 'Users':
        return <Users className="w-5 h-5 text-indigo-600" />
      case 'Sparkles':
        return <Sparkles className="w-5 h-5 text-purple-600" />
      default:
        return <BookOpen className="w-5 h-5 text-teal-600" />
    }
  }

  const getCategoryDescription = () => {
    if (category?.id === 'power-bi' || category?.slug === 'power-bi') {
      return 'Data से उपयोगी Reports और Dashboards बनाना सीखें।'
    }
    if (category?.id === 'gmail' || category?.slug === 'gmail') {
      return 'Gmail सीखें — अपनी जरूरत के अनुसार'
    }
    if (category?.id === 'calendar' || category?.slug === 'calendar') {
      return 'Google Calendar सीखें — समय की कद्र, जीवन में शांति'
    }
    return category?.description || ''
  }

  const getDifficultyBadgeStyle = (difficulty?: string) => {
    switch (difficulty) {
      case 'Beginner':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200'
      case 'Intermediate':
        return 'bg-teal-50 text-teal-800 border-teal-200'
      case 'Advanced':
        return 'bg-indigo-50 text-indigo-800 border-indigo-200'
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200'
    }
  }

  const handleNotifyComingSoon = (featureName: string) => {
    setModalState({
      isOpen: true,
      title: featureName,
      message: 'Digital Learning Hub is structured for open education. Interactive tutorials and resources are actively maintained.',
    })
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white text-slate-900 flex flex-col justify-between font-sans">
        <Header onNotifyComingSoon={handleNotifyComingSoon} />
        <CurriculumLoadingState />
        <Footer onNotifyComingSoon={handleNotifyComingSoon} />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white text-slate-900 flex flex-col justify-between font-sans">
        <Header onNotifyComingSoon={handleNotifyComingSoon} />
        <CurriculumErrorState error={error} onRetry={retry} />
        <Footer onNotifyComingSoon={handleNotifyComingSoon} />
      </div>
    )
  }

  if (!category) {
    return (
      <div className="min-h-screen bg-white text-slate-900 flex flex-col justify-between font-sans">
        <Header onNotifyComingSoon={handleNotifyComingSoon} />
        <div className="max-w-2xl mx-auto py-20 px-4 text-center">
          <HelpCircle className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Category Not Found</h1>
          <p className="text-sm text-slate-600 mb-6">
            The category requested could not be located in the curriculum.
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-semibold hover:bg-slate-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Home</span>
          </Link>
        </div>
        <Footer onNotifyComingSoon={handleNotifyComingSoon} />
      </div>
    )
  }

  // Dedicated View for Digital Banking & Security Category
  if (isDigitalBankingCategory) {
    return (
      <div className="min-h-screen bg-slate-50/50 text-slate-900 flex flex-col justify-between font-sans">
        <div>
          <Header onNotifyComingSoon={handleNotifyComingSoon} />
          <Breadcrumbs items={[{ label: 'Digital Banking & Security' }]} />
          <DigitalBankingView />
        </div>
        <Footer onNotifyComingSoon={handleNotifyComingSoon} />
        <NoticeModal
          isOpen={modalState.isOpen}
          title={modalState.title}
          message={modalState.message}
          onClose={() => setModalState((prev) => ({ ...prev, isOpen: false }))}
        />
      </div>
    )
  }

  // Active need for Need-based categories (Gmail & Calendar)
  const activeNeeds = isGmailCategory ? GMAIL_NEEDS : (isCalendarCategory ? CALENDAR_NEEDS : [])
  const activeCuriosityCards = isGmailCategory ? GMAIL_CURIOSITY_CARDS : (isCalendarCategory ? CALENDAR_CURIOSITY_CARDS : [])
  const activeNeed = isNeedBasedCategory ? activeNeeds.find((n) => n.id === selectedNeedId) : null
  const activeProblem = activeNeed?.problems.find((p) => p.id === selectedProblemId)

  // Is user actively searching?
  const isSearching = searchQuery.trim().length > 0

  return (
    <div className="min-h-screen bg-slate-50/50 text-slate-900 flex flex-col justify-between font-sans">
      <div>
        {/* Approved Home Screen V1 Header */}
        <Header onNotifyComingSoon={handleNotifyComingSoon} />

        {/* Breadcrumb Navigation: Home → Category */}
        <div className="bg-white border-b border-slate-200">
          <Breadcrumbs items={[{ label: category.title }]} />
        </div>

        {/* Category Hero / Introduction */}
        <section className="bg-white border-b border-slate-200 py-6 sm:py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-4 sm:gap-5">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-teal-50 border border-teal-100 flex items-center justify-center shrink-0">
                {getCategoryIcon(category.iconName)}
              </div>
              <div className="min-w-0">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight mb-1">
                  {category.title}
                </h1>
                <p className="text-sm sm:text-base text-slate-600 max-w-2xl leading-relaxed">
                  {getCategoryDescription()}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content Area */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
          
          {/* Curiosity Banner — Near the top of Gmail & Calendar Category Pages */}
          {isNeedBasedCategory && !isSearching && (
            <div className="mb-6">
              <CuriosityBanner
                title={isCalendarCategory ? "अरे वाह! Calendar में ये भी होता है?" : "अरे वाह! Gmail में ये भी होता है?"}
                badgeText={isCalendarCategory ? "Calendar ट्रिक" : "Gmail ट्रिक"}
                cards={activeCuriosityCards}
                ariaLabel={isCalendarCategory ? "Calendar रोचक और उपयोगी ट्रिक्स" : "Gmail रोचक और उपयोगी ट्रिक्स"}
                containerClassName=""
              />
            </div>
          )}

          {/* QUICK NAVIGATION: Google Calendar Only (आप क्या करना चाहते हैं?) */}
          {isCalendarCategory && !isSearching && (
            <div className="mb-8 p-4 sm:p-5 bg-white border border-teal-200/80 rounded-2xl shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-3.5 pb-2.5 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Sparkle className="w-4 h-4 text-teal-600" />
                  <h2 className="text-sm sm:text-base font-extrabold text-slate-900">
                    आप क्या करना चाहते हैं?
                  </h2>
                </div>
                <p className="text-xs text-slate-500">
                  सीधे अपने पसंदीदा सेक्शन पर जाएँ
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 sm:gap-3">
                {/* 1. सीखना शुरू करें — Need-Based Learning */}
                <button
                  type="button"
                  onClick={() => handleQuickNav('section-calendar-need-based')}
                  className="p-3 bg-slate-50 hover:bg-teal-50/70 border border-slate-200 hover:border-teal-300 rounded-xl text-left transition-all group cursor-pointer flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="p-1.5 rounded-lg bg-teal-100/60 text-teal-700 group-hover:bg-teal-600 group-hover:text-white transition-colors">
                      <BookOpen className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] font-bold text-teal-700 bg-teal-50 px-1.5 py-0.5 rounded border border-teal-200">
                      जरूरत
                    </span>
                  </div>
                  <div>
                    <div className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-teal-900 transition-colors">
                      सीखना शुरू करें
                    </div>
                    <div className="text-[11px] text-slate-500 font-medium">
                      Need-Based Learning
                    </div>
                  </div>
                </button>

                {/* 2. 30-Day Series — 30 Tutorials */}
                <button
                  type="button"
                  onClick={() => handleQuickNav('section-calendar-30-day-series', setIsSeriesExpanded)}
                  className="p-3 bg-slate-50 hover:bg-teal-50/70 border border-slate-200 hover:border-teal-300 rounded-xl text-left transition-all group cursor-pointer flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="p-1.5 rounded-lg bg-blue-100/60 text-blue-700 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                      <Calendar className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200">
                      30 Day
                    </span>
                  </div>
                  <div>
                    <div className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-teal-900 transition-colors">
                      30-Day Series
                    </div>
                    <div className="text-[11px] text-slate-500 font-medium">
                      30 Tutorials
                    </div>
                  </div>
                </button>

                {/* 3. Practice करें — 40 Practice Sheets */}
                <button
                  type="button"
                  onClick={() => handleQuickNav('section-calendar-practice-library', setIsPracticeExpanded)}
                  className="p-3 bg-slate-50 hover:bg-teal-50/70 border border-slate-200 hover:border-teal-300 rounded-xl text-left transition-all group cursor-pointer flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="p-1.5 rounded-lg bg-emerald-100/60 text-emerald-700 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                      40 Sheets
                    </span>
                  </div>
                  <div>
                    <div className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-teal-900 transition-colors">
                      Practice करें
                    </div>
                    <div className="text-[11px] text-slate-500 font-medium">
                      40 Practice Sheets
                    </div>
                  </div>
                </button>

                {/* 4. Practical Projects — 3 Projects */}
                <button
                  type="button"
                  onClick={() => handleQuickNav('section-calendar-projects', setIsProjectsExpanded)}
                  className="p-3 bg-slate-50 hover:bg-teal-50/70 border border-slate-200 hover:border-teal-300 rounded-xl text-left transition-all group cursor-pointer flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="p-1.5 rounded-lg bg-indigo-100/60 text-indigo-700 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                      <Workflow className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-200">
                      3 Projects
                    </span>
                  </div>
                  <div>
                    <div className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-teal-900 transition-colors">
                      Practical Projects
                    </div>
                    <div className="text-[11px] text-slate-500 font-medium">
                      3 Projects & Cases
                    </div>
                  </div>
                </button>

                {/* 5. Reference Posters — 8 Posters */}
                <button
                  type="button"
                  onClick={() => handleQuickNav('section-calendar-posters', setIsPostersExpanded)}
                  className="p-3 bg-slate-50 hover:bg-teal-50/70 border border-slate-200 hover:border-teal-300 rounded-xl text-left transition-all group cursor-pointer flex flex-col justify-between col-span-2 sm:col-span-1"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="p-1.5 rounded-lg bg-amber-100/60 text-amber-700 group-hover:bg-amber-600 group-hover:text-white transition-colors">
                      <Eye className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                      8 Posters
                    </span>
                  </div>
                  <div>
                    <div className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-teal-900 transition-colors">
                      Reference Posters
                    </div>
                    <div className="text-[11px] text-slate-500 font-medium">
                      8 Reference Posters
                    </div>
                  </div>
                </button>
              </div>
            </div>
          )}

          {/* QUICK NAVIGATION: Gmail (आप क्या करना चाहते हैं?) */}
          {isGmailCategory && !isSearching && !showAllTopics && (
            <div className="mb-8 p-4 sm:p-5 bg-white border border-teal-200/80 rounded-2xl shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-3.5 pb-2.5 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Sparkle className="w-4 h-4 text-teal-600" />
                  <h2 className="text-sm sm:text-base font-extrabold text-slate-900">
                    आप क्या करना चाहते हैं?
                  </h2>
                </div>
                <p className="text-xs text-slate-500">
                  सीधे अपने पसंदीदा सेक्शन पर जाएँ
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3">
                {/* 1. सीखना शुरू करें — Need-Based Learning */}
                <button
                  type="button"
                  onClick={() => handleQuickNav('section-gmail-need-based')}
                  className="p-3 bg-slate-50 hover:bg-teal-50/70 border border-slate-200 hover:border-teal-300 rounded-xl text-left transition-all group cursor-pointer flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="p-1.5 rounded-lg bg-teal-100/60 text-teal-700 group-hover:bg-teal-600 group-hover:text-white transition-colors">
                      <BookOpen className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] font-bold text-teal-700 bg-teal-50 px-1.5 py-0.5 rounded border border-teal-200">
                      जरूरत
                    </span>
                  </div>
                  <div>
                    <div className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-teal-900 transition-colors">
                      सीखना शुरू करें
                    </div>
                    <div className="text-[11px] text-slate-500 font-medium">
                      Need-Based Learning (6 श्रेणियां)
                    </div>
                  </div>
                </button>

                {/* 2. Practical Projects — 4 Projects */}
                <button
                  type="button"
                  onClick={() => handleQuickNav('section-gmail-projects', setIsGmailProjectsExpanded)}
                  className="p-3 bg-slate-50 hover:bg-teal-50/70 border border-slate-200 hover:border-teal-300 rounded-xl text-left transition-all group cursor-pointer flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="p-1.5 rounded-lg bg-indigo-100/60 text-indigo-700 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                      <Workflow className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-200">
                      4 Projects
                    </span>
                  </div>
                  <div>
                    <div className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-teal-900 transition-colors">
                      Practical Projects
                    </div>
                    <div className="text-[11px] text-slate-500 font-medium">
                      4 गाइडेड प्रोजेक्ट्स
                    </div>
                  </div>
                </button>

                {/* 3. 36-Day Series — 36 Tutorials */}
                <button
                  type="button"
                  onClick={() => setShowAllTopics(true)}
                  className="p-3 bg-slate-50 hover:bg-teal-50/70 border border-slate-200 hover:border-teal-300 rounded-xl text-left transition-all group cursor-pointer flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="p-1.5 rounded-lg bg-blue-100/60 text-blue-700 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                      <Mail className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200">
                      36 Topics
                    </span>
                  </div>
                  <div>
                    <div className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-teal-900 transition-colors">
                      36-Day Series
                    </div>
                    <div className="text-[11px] text-slate-500 font-medium">
                      सभी 36 ट्यूटोरियल्स
                    </div>
                  </div>
                </button>
              </div>
            </div>
          )}

          {/* Search Box always visible and friendly */}
          <div className="mb-8">
            <div className="relative max-w-2xl">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Search className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={isCalendarCategory ? "क्या ढूँढना चाहते हैं? जैसे: Event, Reminder, Time, Meeting..." : "क्या ढूँढना चाहते हैं? जैसे: पुरानी Email, Storage, बड़ी File, Spam..."}
                className="w-full pl-10 pr-9 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:outline-hidden focus:border-teal-600 focus:ring-1 focus:ring-teal-600 shadow-xs transition-all text-slate-900 placeholder-slate-400"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                  aria-label="Clear search"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            {isSearching && (
              <p className="text-xs text-slate-500 mt-2">
                खोज परिणाम: <strong>{visibleTopics.length}</strong> विषय मिले
              </p>
            )}
          </div>

          {/* NEED-BASED FINDER (Gmail & Calendar) */}
          {isNeedBasedCategory && !isSearching && !showAllTopics && (
            <div id={isCalendarCategory ? "section-calendar-need-based" : "section-gmail-need-based"} className="space-y-8 mb-10 scroll-mt-24">
              
              {/* Heading: आप क्या करना चाहते हैं? for Gmail / सीखना शुरू करें for Calendar */}
              <div>
                <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                  <Sparkle className="w-5 h-5 text-teal-600" />
                  <span>{isCalendarCategory ? 'सीखना शुरू करें — जरूरत अनुसार चुनें' : 'आप क्या करना चाहते हैं?'}</span>
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 mt-1">
                  अपनी जरूरत पर क्लिक करें — उससे जुड़ी आम समस्याएं और सबसे उपयोगी समाधान तुरंत देखें।
                </p>
              </div>

              {/* 6 Need Options Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
                {activeNeeds.map((need) => {
                  const isSelected = selectedNeedId === need.id

                  return (
                    <button
                      key={need.id}
                      type="button"
                      onClick={() => {
                        if (isSelected) {
                          setSelectedNeedId(null)
                          setSelectedProblemId(null)
                        } else {
                          setSelectedNeedId(need.id)
                          // Auto-select first problem for convenience
                          setSelectedProblemId(need.problems[0]?.id || null)
                        }
                      }}
                      className={`p-3.5 sm:p-4 rounded-xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-teal-50 border-teal-400 shadow-sm ring-1 ring-teal-400'
                          : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-xs'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="p-2 rounded-lg bg-slate-50 border border-slate-100">
                          {getNeedIcon(need.iconName)}
                        </div>
                        {isSelected && (
                          <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                        )}
                      </div>
                      <div>
                        <h3 className={`text-sm font-bold leading-snug ${isSelected ? 'text-teal-900' : 'text-slate-900'}`}>
                          {need.title}
                        </h3>
                        <p className="text-[11px] text-slate-500 mt-1 line-clamp-2 leading-tight">
                          {need.subtitle}
                        </p>
                      </div>
                    </button>
                  )
                })}
              </div>

              {/* Selected Need Details Box (Everyday Problems & Recommendations) */}
              {activeNeed && (
                <div className="bg-white border border-teal-200 rounded-2xl p-5 sm:p-7 shadow-xs space-y-6">
                  
                  {/* Active Need Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
                    <div>
                      <span className="text-[11px] font-bold text-teal-700 uppercase tracking-wider bg-teal-50 px-2 py-0.5 rounded border border-teal-100">
                        चुनी हुई जरूरत
                      </span>
                      <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 mt-1">
                        {activeNeed.title} — आम समस्याएं
                      </h3>
                    </div>
                    <span className="text-xs text-slate-500">
                      {activeNeed.primaryTopicIds.length} विषय उपलब्ध
                    </span>
                  </div>

                  {/* Problem Selection Pills */}
                  <div>
                    <p className="text-xs font-semibold text-slate-600 mb-2.5">
                      आपकी स्थिति क्या है? (समस्या चुनें):
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {activeNeed.problems.map((prob) => {
                        const isProbActive = selectedProblemId === prob.id
                        return (
                          <button
                            key={prob.id}
                            type="button"
                            onClick={() => setSelectedProblemId(prob.id)}
                            className={`px-3 py-2 rounded-xl text-xs font-medium border text-left transition-all cursor-pointer ${
                              isProbActive
                                ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100 hover:border-slate-300'
                            }`}
                          >
                            👉 {prob.problemText}
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  {/* Recommended Tutorials for Selected Problem */}
                  {activeProblem && (
                    <div className="pt-2 space-y-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-800">
                          🎯 सबसे उपयोगी समाधान ({activeProblem.recommendations.length}):
                        </span>
                      </div>

                      <div className={getRecommendationGridClass(activeProblem.recommendations.length, isCalendarCategory)}>
                        {activeProblem.recommendations.map((rec) => {
                          const topic = topicMap.get(rec.topicId)
                          if (!topic) return null
                          const resourceCount = getTopicPublishedResourceCount(topic)

                          return (
                            <Link
                              key={rec.topicId}
                              to={`/category/${category.slug}/topic/${topic.slug}`}
                              className="group bg-slate-50/70 hover:bg-white border border-slate-200 hover:border-teal-400 rounded-xl p-4.5 transition-all flex flex-col justify-between shadow-xs hover:shadow-md"
                            >
                              <div>
                                <div className="flex items-center justify-between mb-2">
                                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${getDifficultyBadgeStyle(topic.difficulty)}`}>
                                    {topic.difficulty}
                                  </span>
                                  <span className="text-[10px] font-semibold text-slate-500">
                                    {resourceCount} Resource
                                  </span>
                                </div>
                                <h4 className="text-sm font-bold text-slate-900 group-hover:text-teal-700 transition-colors mb-1.5">
                                  {topic.title}
                                </h4>
                                <p className="text-xs text-teal-800 bg-teal-50/80 p-2 rounded-lg border border-teal-100/80 leading-relaxed mb-3">
                                  💡 {rec.reason}
                                </p>
                              </div>
                              <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-xs font-bold text-teal-700 group-hover:text-teal-800">
                                <span>सीखना शुरू करें</span>
                                <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
                              </div>
                            </Link>
                          )
                        })}
                      </div>
                    </div>
                  )}

                  {/* All Topics inside this primary need */}
                  <div className="pt-4 border-t border-slate-100">
                    <p className="text-xs font-semibold text-slate-600 mb-3">
                      इस जरूरत से जुड़े सभी {activeNeed.primaryTopicIds.length} विषय:
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                      {activeNeed.primaryTopicIds.map((tid) => {
                        const t = topicMap.get(tid)
                        if (!t) return null
                        return (
                          <Link
                            key={tid}
                            to={`/category/${category.slug}/topic/${t.slug}`}
                            className="px-3 py-2 bg-slate-50 hover:bg-white border border-slate-200 hover:border-teal-300 rounded-lg text-xs font-semibold text-slate-800 hover:text-teal-700 flex items-center justify-between transition-colors"
                          >
                            <span className="truncate">{t.title}</span>
                            <ArrowRight className="w-3 h-3 text-slate-400 shrink-0 ml-1" />
                          </Link>
                        )
                      })}
                    </div>
                  </div>

                </div>
              )}

              {/* SECTION (GMAIL): Real-Life Practical Projects - Collapsible */}
              {isGmailCategory && (
                <div id="section-gmail-projects" className="bg-gradient-to-br from-teal-50/70 via-slate-50 to-indigo-50/40 border border-teal-200/80 rounded-2xl p-5 sm:p-6 shadow-xs scroll-mt-24 transition-all">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-teal-700 text-white tracking-wide">
                          Real-Life Practical Projects
                        </span>
                        <h3 className="text-base sm:text-lg font-bold text-slate-900">
                          खुद बनाकर सीखें — वास्तविक जीवन के गाइडेड प्रोजेक्ट्स
                        </h3>
                      </div>
                      <p className="text-xs sm:text-sm text-slate-600 mt-1">
                        Smart Inbox, Heavy File Sharing, Office Communication व Gmail Security पर आधारित 4 संपूर्ण प्रैक्टिकल प्रोजेक्ट्स।
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 self-start sm:self-auto">
                      <span className="text-xs font-bold text-teal-800 bg-white px-3 py-1.5 rounded-lg border border-teal-200 shadow-2xs">
                        कुल {GMAIL_PROJECT_CARDS.length} गाइडेड प्रोजेक्ट्स
                      </span>
                      <button
                        type="button"
                        onClick={() => setIsGmailProjectsExpanded(!isGmailProjectsExpanded)}
                        className={`inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                          isGmailProjectsExpanded
                            ? 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-300'
                            : 'bg-teal-700 hover:bg-teal-800 text-white shadow-2xs'
                        }`}
                      >
                        <span>{isGmailProjectsExpanded ? 'बंद करें' : 'सभी देखें'}</span>
                        {isGmailProjectsExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  {isGmailProjectsExpanded && (
                    <div className="mt-6 pt-5 border-t border-teal-100 space-y-5 animate-in fade-in duration-200">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-5">
                        {GMAIL_PROJECT_CARDS.map((project) => (
                          <div
                            key={project.id}
                            className="bg-white border border-slate-200 hover:border-teal-400 rounded-xl p-5 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
                          >
                            <div>
                              <div className="flex items-center justify-between gap-2 mb-3">
                                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${project.badgeColor}`}>
                                  {project.typeLabel}
                                </span>
                                <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                                  {project.stepsCount}
                                </span>
                              </div>

                              <h4 className="text-sm sm:text-base font-bold text-slate-900 mb-1 leading-snug">
                                {project.title}
                              </h4>
                              <p className="text-[11px] font-medium text-teal-700 mb-2">
                                {project.subtitle}
                              </p>

                              <p className="text-xs text-slate-600 mb-4 leading-relaxed">
                                {project.description}
                              </p>

                              <div className="mb-4 bg-slate-50 border border-slate-100 rounded-lg p-2.5">
                                <p className="text-[11px] font-bold text-slate-700 mb-1.5">मुख्य सीख (Key Highlights):</p>
                                <ul className="text-[11px] text-slate-600 space-y-1">
                                  {project.keyLearnings.map((item, idx) => (
                                    <li key={idx} className="flex items-start gap-1.5">
                                      <span className="text-teal-600 font-bold shrink-0">✓</span>
                                      <span>{item}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </div>

                            <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
                              <a
                                href={buildTutorialUrl(project.projectUrl)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center justify-center gap-1.5 w-full py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-lg text-xs font-bold transition-colors shadow-2xs"
                              >
                                <span>प्रोजेक्ट गाइड खोलें</span>
                                <ExternalLink className="w-3.5 h-3.5" />
                              </a>
                              <Link
                                to={`/category/${category.slug}/topic/${project.primaryTopicSlug}`}
                                className="inline-flex items-center justify-between text-[11px] font-medium text-slate-500 hover:text-slate-800 transition-colors pt-1"
                              >
                                <span>संबंधित मुख्य ट्यूटोरियल</span>
                                <ArrowRight className="w-3 h-3" />
                              </Link>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="pt-2 flex justify-center">
                        <button
                          type="button"
                          onClick={() => {
                            setIsGmailProjectsExpanded(false)
                            handleQuickNav('section-gmail-projects')
                          }}
                          className="inline-flex items-center gap-1.5 px-4 py-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-bold rounded-lg transition-colors cursor-pointer shadow-2xs"
                        >
                          <span>कम दिखाएं / बंद करें</span>
                          <ChevronUp className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Separate Option: सभी विषय देखें (क्रमवार पूरी सीरीज) - FOR GMAIL / NON-CALENDAR */}
              {!isCalendarCategory && (
                <div className="pt-2 flex flex-col sm:flex-row items-center justify-between p-4 bg-white border border-slate-200 rounded-xl gap-3">
                  <div className="text-center sm:text-left">
                    <p className="text-xs sm:text-sm font-bold text-slate-800">
                      क्रमवार पूरी सीरीज देखना चाहते हैं?
                    </p>
                    <p className="text-xs text-slate-500">
                      Day 1 से Day 36 तक सभी विषय एक साथ देखें
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowAllTopics(true)}
                    className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer shrink-0"
                  >
                    सभी 36 विषय देखें →
                  </button>
                </div>
              )}

              {/* SECTION 2 (CALENDAR): Complete 30-Day Series - Collapsible */}
              {isCalendarCategory && (
                <div id="section-calendar-30-day-series" className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-xs scroll-mt-24 transition-all">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-blue-600 text-white tracking-wide">
                          30-Day Series
                        </span>
                        <h3 className="text-base sm:text-lg font-bold text-slate-900">
                          क्रमवार पूरी 30-दिवसीय सीरीज
                        </h3>
                      </div>
                      <p className="text-xs sm:text-sm text-slate-600">
                        Day 01 से Day 30 तक सभी 30 ट्यूटोरियल्स क्रमवार उपलब्ध हैं।
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 self-start sm:self-auto">
                      <span className="text-xs font-bold text-blue-800 bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-200">
                        कुल 30 ट्यूटोरियल्स
                      </span>
                      <button
                        type="button"
                        onClick={() => setIsSeriesExpanded(!isSeriesExpanded)}
                        className={`inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                          isSeriesExpanded 
                            ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300' 
                            : 'bg-blue-600 hover:bg-blue-700 text-white shadow-2xs'
                        }`}
                      >
                        <span>{isSeriesExpanded ? 'बंद करें' : 'सभी देखें'}</span>
                        {isSeriesExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  {isSeriesExpanded && (
                    <div className="mt-6 pt-5 border-t border-slate-100 space-y-5 animate-in fade-in duration-200">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {publishedTopics.map((topic, index) => (
                          <Link
                            key={topic.id}
                            to={`/category/${category.slug}/topic/${topic.slug}`}
                            className="group bg-slate-50/60 hover:bg-white border border-slate-200 hover:border-blue-300 rounded-xl p-4 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between"
                          >
                            <div>
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-800 border border-blue-200">
                                  Day {String(index + 1).padStart(2, '0')} of 30
                                </span>
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${getDifficultyBadgeStyle(topic.difficulty)}`}>
                                  {topic.difficulty}
                                </span>
                              </div>
                              <h4 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-blue-700 transition-colors mb-1 line-clamp-2">
                                {topic.title}
                              </h4>
                              <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed mb-3">
                                {topic.shortDescription}
                              </p>
                            </div>
                            <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-blue-700 group-hover:text-blue-800">
                              <span>Tutorial खोलें</span>
                              <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
                            </div>
                          </Link>
                        ))}
                      </div>

                      <div className="pt-2 flex justify-center">
                        <button
                          type="button"
                          onClick={() => {
                            setIsSeriesExpanded(false)
                            handleQuickNav('section-calendar-30-day-series')
                          }}
                          className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg transition-colors cursor-pointer"
                        >
                          <span>कम दिखाएं / बंद करें</span>
                          <ChevronUp className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* SECTION 3 (CALENDAR): Practice Library (वास्तविक जीवन के अभ्यास) - Collapsible */}
              {isCalendarCategory && (
                <div id="section-calendar-practice-library" className="bg-gradient-to-br from-teal-50/70 via-slate-50 to-blue-50/50 border border-teal-200/80 rounded-2xl p-5 sm:p-6 shadow-xs scroll-mt-24 transition-all">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-teal-600 text-white tracking-wide">
                          Practice Library
                        </span>
                        <h3 className="text-base sm:text-lg font-bold text-slate-900">
                          वास्तविक जीवन के अभ्यास
                        </h3>
                      </div>
                      <p className="text-xs sm:text-sm text-slate-600 mt-1">
                        विद्यार्थी, ऑफिस प्रोफेशनल्स, वरिष्ठ नागरिक, परिवार और शुरुआत के सभी वास्तविक जीवन परिदृश्य।
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 self-start sm:self-auto">
                      <span className="text-xs font-bold text-teal-800 bg-white px-3 py-1.5 rounded-lg border border-teal-200 shadow-2xs">
                        कुल {CALENDAR_PRACTICE_CARDS.length} अभ्यास शीट्स
                      </span>
                      <button
                        type="button"
                        onClick={() => setIsPracticeExpanded(!isPracticeExpanded)}
                        className={`inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                          isPracticeExpanded
                            ? 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-300'
                            : 'bg-teal-600 hover:bg-teal-700 text-white shadow-2xs'
                        }`}
                      >
                        <span>{isPracticeExpanded ? 'बंद करें' : 'सभी देखें'}</span>
                        {isPracticeExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  {isPracticeExpanded && (
                    <div className="mt-6 pt-5 border-t border-teal-100 space-y-5 animate-in fade-in duration-200">
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {CALENDAR_PRACTICE_CARDS.map((card) => (
                          <div
                            key={card.id}
                            className="bg-white border border-teal-100/90 rounded-xl p-4 shadow-2xs hover:border-teal-300 hover:shadow-xs transition-all flex flex-col justify-between"
                          >
                            <div>
                              <div className="flex items-center justify-between gap-1 mb-2">
                                <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${getPracticeCategoryColor(card.categoryLabel)} line-clamp-1`}>
                                  {card.categoryLabel}
                                </span>
                                <span className="text-[10px] text-slate-500 font-medium shrink-0">
                                  {card.sheetNumber}
                                </span>
                              </div>
                              <h4 className="text-xs sm:text-sm font-bold text-slate-900 mb-1 leading-snug line-clamp-2">
                                {card.title}
                              </h4>
                              <p className="text-[11px] sm:text-xs text-slate-600 mb-3 leading-relaxed line-clamp-3">
                                {card.description}
                              </p>
                            </div>

                            <div className="pt-2.5 border-t border-slate-100 flex flex-col gap-1.5">
                              <a
                                href={buildTutorialUrl(card.imagePath)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center justify-between text-xs font-bold text-teal-700 hover:text-teal-900 transition-colors"
                              >
                                <span>मूल अभ्यास शीट खोलें</span>
                                <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                              </a>
                              <Link
                                to={`/category/${category.slug}/topic/${card.topicSlug}`}
                                className="inline-flex items-center justify-between text-[11px] font-medium text-slate-500 hover:text-slate-800 transition-colors"
                              >
                                <span>संबंधित ट्यूटोरियल</span>
                                <ArrowRight className="w-3 h-3 shrink-0" />
                              </Link>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="pt-2 flex justify-center">
                        <button
                          type="button"
                          onClick={() => {
                            setIsPracticeExpanded(false)
                            handleQuickNav('section-calendar-practice-library')
                          }}
                          className="inline-flex items-center gap-1.5 px-4 py-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-bold rounded-lg transition-colors cursor-pointer shadow-2xs"
                        >
                          <span>कम दिखाएं / बंद करें</span>
                          <ChevronUp className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* SECTION 4 (CALENDAR): Practical Projects & Case Studies - Collapsible */}
              {isCalendarCategory && (
                <div id="section-calendar-projects" className="bg-gradient-to-br from-indigo-50/70 via-slate-50 to-teal-50/40 border border-indigo-200/80 rounded-2xl p-5 sm:p-6 shadow-xs scroll-mt-24 transition-all">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-indigo-600 text-white tracking-wide">
                          Projects & Case Studies
                        </span>
                        <h3 className="text-base sm:text-lg font-bold text-slate-900">
                          खुद बनाकर सीखें — वास्तविक जीवन के उदाहरण
                        </h3>
                      </div>
                      <p className="text-xs sm:text-sm text-slate-600 mt-1">
                        स्कूल/कॉलेज वार्षिक कैलेंडर, डिजिटल क्लास टाइमटेबल व पब्लिक अपॉइंटमेंट सिस्टम के विस्तृत प्रैक्टिकल प्रोजेक्ट्स।
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 self-start sm:self-auto">
                      <span className="text-xs font-bold text-indigo-800 bg-white px-3 py-1.5 rounded-lg border border-indigo-200 shadow-2xs">
                        कुल {CALENDAR_PROJECT_CARDS.length} गाइडेड प्रोजेक्ट्स
                      </span>
                      <button
                        type="button"
                        onClick={() => setIsProjectsExpanded(!isProjectsExpanded)}
                        className={`inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                          isProjectsExpanded
                            ? 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-300'
                            : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-2xs'
                        }`}
                      >
                        <span>{isProjectsExpanded ? 'बंद करें' : 'सभी देखें'}</span>
                        {isProjectsExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  {isProjectsExpanded && (
                    <div className="mt-6 pt-5 border-t border-indigo-100 space-y-5 animate-in fade-in duration-200">
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                        {CALENDAR_PROJECT_CARDS.map((project) => (
                          <div
                            key={project.id}
                            className="bg-white border border-slate-200 hover:border-indigo-300 rounded-xl p-5 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
                          >
                            <div>
                              <div className="flex items-center justify-between gap-2 mb-3">
                                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${project.badgeColor}`}>
                                  {project.typeLabel}
                                </span>
                                <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                                  {project.stepsCount}
                                </span>
                              </div>

                              <h4 className="text-sm sm:text-base font-bold text-slate-900 mb-1 leading-snug">
                                {project.title}
                              </h4>
                              <p className="text-[11px] font-medium text-indigo-600 mb-2">
                                {project.subtitle}
                              </p>

                              <p className="text-xs text-slate-600 mb-4 leading-relaxed">
                                {project.description}
                              </p>

                              <div className="mb-4 bg-slate-50 border border-slate-100 rounded-lg p-2.5">
                                <p className="text-[11px] font-bold text-slate-700 mb-1.5">मुख्य सीख (Key Highlights):</p>
                                <ul className="text-[11px] text-slate-600 space-y-1">
                                  {project.keyLearnings.map((item, idx) => (
                                    <li key={idx} className="flex items-start gap-1.5">
                                      <span className="text-teal-600 font-bold shrink-0">✓</span>
                                      <span>{item}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </div>

                            <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
                              <a
                                href={buildTutorialUrl(project.projectUrl)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center justify-center gap-1.5 w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition-colors shadow-2xs"
                              >
                                <span>प्रोजेक्ट गाइड खोलें</span>
                                <ExternalLink className="w-3.5 h-3.5" />
                              </a>
                              <Link
                                to={`/category/${category.slug}/topic/${project.primaryTopicSlug}`}
                                className="inline-flex items-center justify-between text-[11px] font-medium text-slate-500 hover:text-slate-800 transition-colors pt-1"
                              >
                                <span>संबंधित मुख्य ट्यूटोरियल</span>
                                <ArrowRight className="w-3 h-3" />
                              </Link>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="pt-2 flex justify-center">
                        <button
                          type="button"
                          onClick={() => {
                            setIsProjectsExpanded(false)
                            handleQuickNav('section-calendar-projects')
                          }}
                          className="inline-flex items-center gap-1.5 px-4 py-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-bold rounded-lg transition-colors cursor-pointer shadow-2xs"
                        >
                          <span>कम दिखाएं / बंद करें</span>
                          <ChevronUp className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* SECTION 5 (CALENDAR): Additional Learning Resources (अन्य उपयोगी सामग्री — 8 Reference Posters) - Collapsible */}
              {isCalendarCategory && (
                <div id="section-calendar-posters" className="bg-gradient-to-br from-amber-50/70 via-slate-50 to-teal-50/40 border border-amber-200/80 rounded-2xl p-5 sm:p-6 shadow-xs scroll-mt-24 transition-all">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-amber-600 text-white tracking-wide">
                          Reference Posters
                        </span>
                        <h3 className="text-base sm:text-lg font-bold text-slate-900">
                          अन्य उपयोगी सामग्री (त्वरित संदर्भ पोस्टर्स)
                        </h3>
                      </div>
                      <p className="text-xs sm:text-sm text-slate-600 mt-1">
                        डेस्कटॉप व मोबाइल इंटरफेस, इवेंट क्रिएशन, कीबोर्ड शॉर्टकट्स और सम्पूर्ण 30-दिवसीय लर्निंग रोडमैप के आधिकारिक चार्ट।
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 self-start sm:self-auto">
                      <span className="text-xs font-bold text-amber-800 bg-white px-3 py-1.5 rounded-lg border border-amber-200 shadow-2xs">
                        कुल {CALENDAR_REFERENCE_POSTERS.length} संदर्भ पोस्टर्स
                      </span>
                      <button
                        type="button"
                        onClick={() => setIsPostersExpanded(!isPostersExpanded)}
                        className={`inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                          isPostersExpanded
                            ? 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-300'
                            : 'bg-amber-600 hover:bg-amber-700 text-white shadow-2xs'
                        }`}
                      >
                        <span>{isPostersExpanded ? 'बंद करें' : 'सभी देखें'}</span>
                        {isPostersExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  {isPostersExpanded && (
                    <div className="mt-6 pt-5 border-t border-amber-100 space-y-5 animate-in fade-in duration-200">
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {CALENDAR_REFERENCE_POSTERS.map((poster) => (
                          <div
                            key={poster.id}
                            className="bg-white border border-slate-200 hover:border-amber-300 rounded-xl p-3.5 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between"
                          >
                            <div>
                              {/* Poster Thumbnail */}
                              <div 
                                className="relative mb-3 aspect-[4/3] rounded-lg overflow-hidden bg-slate-100 border border-slate-200 group cursor-pointer"
                                onClick={() => setSelectedPoster(poster)}
                              >
                                <img
                                  src={buildTutorialUrl(poster.imagePath)}
                                  alt={poster.title}
                                  className="w-full h-full object-cover object-top transition-transform duration-300 group-hover:scale-105"
                                  loading="lazy"
                                />
                                <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/30 transition-colors flex items-center justify-center">
                                  <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 text-slate-900 text-[11px] font-bold px-2 py-1 rounded shadow-xs flex items-center gap-1">
                                    <Eye className="w-3.5 h-3.5" /> बड़ा देखें
                                  </span>
                                </div>
                              </div>

                              <div className="mb-2">
                                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                                  {poster.categoryBadge}
                                </span>
                              </div>

                              <h4 className="text-xs sm:text-sm font-bold text-slate-900 mb-0.5 leading-snug">
                                {poster.title}
                              </h4>
                              <p className="text-[10px] text-slate-500 font-medium mb-1.5">
                                {poster.englishTitle}
                              </p>
                              <p className="text-[11px] text-slate-600 leading-relaxed mb-3 line-clamp-3">
                                {poster.description}
                              </p>
                            </div>

                            <div className="pt-2.5 border-t border-slate-100 flex flex-col gap-1.5">
                              <button
                                type="button"
                                onClick={() => setSelectedPoster(poster)}
                                className="inline-flex items-center justify-between text-xs font-bold text-amber-700 hover:text-amber-900 transition-colors cursor-pointer"
                              >
                                <span>पूरा पोस्टर देखें</span>
                                <Eye className="w-3.5 h-3.5 shrink-0" />
                              </button>
                              <Link
                                to={`/category/${category.slug}/topic/${poster.relatedTopicSlug}`}
                                className="inline-flex items-center justify-between text-[11px] font-medium text-slate-500 hover:text-slate-800 transition-colors"
                              >
                                <span className="truncate">{poster.relatedTopicName}</span>
                                <ArrowRight className="w-3 h-3 shrink-0 ml-1" />
                              </Link>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="pt-2 flex justify-center">
                        <button
                          type="button"
                          onClick={() => {
                            setIsPostersExpanded(false)
                            handleQuickNav('section-calendar-posters')
                          }}
                          className="inline-flex items-center gap-1.5 px-4 py-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-bold rounded-lg transition-colors cursor-pointer shadow-2xs"
                        >
                          <span>कम दिखाएं / बंद करें</span>
                          <ChevronUp className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

            </div>
          )}

          {/* SECTION FOR "SHOW ALL TOPICS" OR SEARCH RESULTS OR NON-NEED-BASED CATEGORIES */}
          {(!isNeedBasedCategory || isSearching || showAllTopics) && (
            <div>
              {/* Back to Need-based view button when browsing all */}
              {isNeedBasedCategory && showAllTopics && !isSearching && (
                <div className="mb-6 flex items-center justify-between bg-teal-50/70 border border-teal-200 p-3.5 rounded-xl">
                  <div className="flex items-center gap-2">
                    <Sparkle className="w-4 h-4 text-teal-700" />
                    <span className="text-xs sm:text-sm font-bold text-teal-900">
                      {isCalendarCategory ? 'सभी 30 विषय (क्रमवार सूची)' : 'सभी 36 विषय (क्रमवार सूची)'}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowAllTopics(false)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-teal-300 text-teal-800 hover:bg-teal-50 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>जरूरत अनुसार चुनें</span>
                  </button>
                </div>
              )}

              {/* Section Header for non-Gmail or All topics */}
              <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">
                    {category.title} Topics
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
                    {isSearching
                      ? 'खोज परिणाम'
                      : 'अपना Topic चुनें और सीखना शुरू करें।'}
                  </p>
                </div>

                {/* Level Filter for non-Gmail or all topics */}
                {showLevelFilter && (
                  <div className="flex flex-wrap items-center gap-1.5">
                    {(['All', 'Beginner', 'Intermediate', 'Advanced'] as const).map((lvl) => (
                      <button
                        key={lvl}
                        type="button"
                        onClick={() => setSelectedLevel(lvl)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                          selectedLevel === lvl
                            ? 'bg-teal-700 text-white shadow-xs'
                            : 'bg-white border border-slate-200 hover:bg-slate-100 text-slate-700'
                        }`}
                      >
                        {lvl}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Topics Grid or Empty State */}
              {publishedTopics.length === 0 ? (
                <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center text-slate-500">
                  <HelpCircle className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <p className="text-base font-semibold text-slate-700">No published topics yet</p>
                  <p className="text-xs text-slate-400 mt-1">
                    Learning topics for {category.title} are currently being curated. Check back soon!
                  </p>
                </div>
              ) : visibleTopics.length === 0 ? (
                <div className="bg-white border border-slate-200 rounded-2xl p-10 text-center text-slate-500">
                  <Search className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                  <p className="text-base font-bold text-slate-800">कोई Topic नहीं मिला</p>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-sm mx-auto">
                    आपके द्वारा खोजे गए शब्द या Filter से मेल खाता कोई Topic उपलब्ध नहीं है।
                  </p>
                  <button
                    type="button"
                    onClick={() => { setSearchQuery(''); setSelectedLevel('All'); }}
                    className="mt-4 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                  >
                    Clear Search
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
                  {visibleTopics.map((topic) => {
                    const resourceCount = getTopicPublishedResourceCount(topic)

                    return (
                      <Link
                        key={topic.id}
                        to={`/category/${category.slug}/topic/${topic.slug}`}
                        className="group bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 hover:border-teal-300 hover:shadow-lg hover:shadow-slate-200/50 transition-all flex flex-col justify-between"
                      >
                        <div>
                          {/* Top Badges: Learning Level & Published Resources Count */}
                          <div className="flex items-center justify-between mb-3">
                            <span className={`text-xs font-bold px-2.5 py-1 rounded-md border ${getDifficultyBadgeStyle(topic.difficulty)}`}>
                              {topic.difficulty}
                            </span>
                            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                              {resourceCount} {resourceCount === 1 ? 'Resource' : 'Resources'}
                            </span>
                          </div>

                          {/* Topic Name */}
                          <h3 className="text-lg sm:text-xl font-bold text-slate-900 group-hover:text-teal-700 transition-colors mb-2">
                            {topic.title}
                          </h3>

                          {/* Short Description */}
                          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-5">
                            {topic.shortDescription}
                          </p>
                        </div>

                        {/* Bottom Action: Open Topic */}
                        <div className="pt-3.5 border-t border-slate-100 flex items-center justify-end">
                          <div className="inline-flex items-center gap-1.5 font-bold text-teal-700 group-hover:text-teal-800 text-xs sm:text-sm transition-colors">
                            <span>Open Topic</span>
                            <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                          </div>
                        </div>
                      </Link>
                    )
                  })}
                </div>
              )}
            </div>
          )}

        </main>
      </div>

      <Footer onNotifyComingSoon={handleNotifyComingSoon} />

      <NoticeModal
        isOpen={modalState.isOpen}
        title={modalState.title}
        message={modalState.message}
        onClose={() => setModalState((prev) => ({ ...prev, isOpen: false }))}
      />

      {/* Lightbox / Modal for Viewing Full Reference Poster */}
      {selectedPoster && (
        <div 
          className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6"
          onClick={() => setSelectedPoster(null)}
        >
          <div 
            className="bg-white rounded-2xl max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="px-4 py-3 sm:px-6 sm:py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50 shrink-0">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">
                    {selectedPoster.categoryBadge}
                  </span>
                  <h3 className="text-sm sm:text-base font-bold text-slate-900">
                    {selectedPoster.title}
                  </h3>
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  {selectedPoster.englishTitle}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href={buildTutorialUrl(selectedPoster.imagePath)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-200 rounded-lg transition-colors"
                  title="मूल फ़ाइल अलग टैब में खोलें"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
                <button
                  type="button"
                  onClick={() => setSelectedPoster(null)}
                  className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
                  aria-label="Close modal"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Image Area */}
            <div className="flex-1 overflow-auto p-3 sm:p-6 bg-slate-900/5 flex items-center justify-center">
              <img
                src={buildTutorialUrl(selectedPoster.imagePath)}
                alt={selectedPoster.title}
                className="max-h-[70vh] w-auto max-w-full rounded-lg shadow-sm border border-slate-200 object-contain"
              />
            </div>

            {/* Modal Footer */}
            <div className="px-4 py-3 sm:px-6 sm:py-3 border-t border-slate-200 bg-white flex flex-col sm:flex-row items-center justify-between gap-2 text-xs shrink-0">
              <p className="text-slate-600 text-center sm:text-left text-[11px] sm:text-xs">
                {selectedPoster.description}
              </p>
              <div className="flex items-center gap-3 shrink-0">
                <Link
                  to={`/category/${category?.slug || 'calendar'}/topic/${selectedPoster.relatedTopicSlug}`}
                  onClick={() => setSelectedPoster(null)}
                  className="text-teal-700 font-bold hover:underline inline-flex items-center gap-1"
                >
                  <span>{selectedPoster.relatedTopicName} खोलें</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
