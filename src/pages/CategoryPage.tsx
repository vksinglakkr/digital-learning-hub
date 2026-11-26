import React, { useState, useMemo } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Header } from '../components/Header'
import { Footer } from '../components/Footer'
import { Breadcrumbs } from '../components/Breadcrumbs'
import { NoticeModal } from '../components/NoticeModal'
import { usePublicCurriculum } from '../context/PublicCurriculumContext'
import { CurriculumLoadingState } from '../components/common/CurriculumLoadingState'
import { CurriculumErrorState } from '../components/common/CurriculumErrorState'
import { isTopicPublished, getTopicTutorial } from '../config/topicTutorials'
import { GMAIL_NEEDS } from '../data/gmailNeedsData'
import { CuriosityBanner } from '../components/CuriosityBanner'
import { GMAIL_CURIOSITY_CARDS } from '../data/gmailCuriosityData'
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
  BookOpen
} from 'lucide-react'

// Level sort priority: 1. Beginner, 2. Intermediate, 3. Advanced
const LEVEL_PRIORITY: Record<string, number> = {
  Beginner: 1,
  Intermediate: 2,
  Advanced: 3,
}

type LevelFilter = 'All' | 'Beginner' | 'Intermediate' | 'Advanced'

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

  // Reset search and filters when navigating between categories
  if (prevCategorySlug !== categorySlug) {
    setPrevCategorySlug(categorySlug)
    setSearchQuery('')
    setSelectedLevel('All')
    setSelectedNeedId(null)
    setSelectedProblemId(null)
    setShowAllTopics(false)
  }

  const { categories, topics: allTopics, isLoading, error, retry } = usePublicCurriculum()

  const category = categories.find(
    (c) => c.slug === categorySlug || c.id === categorySlug
  )

  const isGmailCategory = category?.id === 'gmail' || category?.slug === 'gmail'

  // 1. Filter only published topics for this category, ordered: Beginner -> Intermediate -> Advanced -> curriculum displayOrder
  const publishedTopics = useMemo(() => {
    if (!category) return []

    const list = allTopics.filter(
      (t) => t.categoryId === category.id && isTopicPublished(t)
    )

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
  const showLevelFilter = totalPublishedCount >= 16 && (!isGmailCategory || showAllTopics)

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

  // Active need for Gmail category
  const activeNeed = isGmailCategory ? GMAIL_NEEDS.find((n) => n.id === selectedNeedId) : null
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
          
          {/* Gmail Curiosity Banner — Near the top of the Gmail Category Page */}
          {isGmailCategory && !isSearching && (
            <div className="mb-6">
              <CuriosityBanner
                title="अरे वाह! Gmail में ये भी होता है?"
                badgeText="Gmail ट्रिक"
                cards={GMAIL_CURIOSITY_CARDS}
                ariaLabel="Gmail रोचक और उपयोगी ट्रिक्स"
                containerClassName=""
              />
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
                placeholder="क्या ढूँढना चाहते हैं? जैसे: पुरानी Email, Storage, बड़ी File, Spam..."
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

          {/* GMAIL SPECIFIC: Need-Based Finder (when not searching and not showing all topics) */}
          {isGmailCategory && !isSearching && !showAllTopics && (
            <div className="space-y-8 mb-10">
              
              {/* Heading: आप क्या करना चाहते हैं? */}
              <div>
                <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                  <Sparkle className="w-5 h-5 text-teal-600" />
                  <span>आप क्या करना चाहते हैं?</span>
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 mt-1">
                  अपनी जरूरत पर क्लिक करें — उससे जुड़ी आम समस्याएं और सबसे उपयोगी समाधान तुरंत देखें।
                </p>
              </div>

              {/* 6 Need Options Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
                {GMAIL_NEEDS.map((need) => {
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

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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

              {/* Separate Option: सभी 36 विषय देखें */}
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

            </div>
          )}

          {/* SECTION FOR "SHOW ALL TOPICS" OR SEARCH RESULTS OR NON-GMAIL CATEGORIES */}
          {(!isGmailCategory || isSearching || showAllTopics) && (
            <div>
              {/* Back to Need-based view button for Gmail when browsing all */}
              {isGmailCategory && showAllTopics && !isSearching && (
                <div className="mb-6 flex items-center justify-between bg-teal-50/70 border border-teal-200 p-3.5 rounded-xl">
                  <div className="flex items-center gap-2">
                    <Sparkle className="w-4 h-4 text-teal-700" />
                    <span className="text-xs sm:text-sm font-bold text-teal-900">
                      सभी 36 विषय (क्रमवार सूची)
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
    </div>
  )
}
