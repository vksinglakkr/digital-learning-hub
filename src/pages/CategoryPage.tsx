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
  Mail
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

  // Reset search and filters when navigating between categories
  if (prevCategorySlug !== categorySlug) {
    setPrevCategorySlug(categorySlug)
    setSearchQuery('')
    setSelectedLevel('All')
  }

  const { categories, topics: allTopics, isLoading, error, retry } = usePublicCurriculum()

  const category = categories.find(
    (c) => c.slug === categorySlug || c.id === categorySlug
  )

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
  const showLevelFilter = totalPublishedCount >= 16

  // 3. Search and Level Filtering
  const visibleTopics = useMemo(() => {
    return publishedTopics.filter((topic) => {
      // Search filter (active when search is enabled)
      if (showSearch && searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim()
        const titleMatch = topic.title.toLowerCase().includes(q)
        const descMatch = (topic.shortDescription || '').toLowerCase().includes(q) ||
                          (topic.detailedDescription || '').toLowerCase().includes(q)
        if (!titleMatch && !descMatch) {
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

  const getCategoryDescription = () => {
    if (category?.id === 'power-bi' || category?.slug === 'power-bi') {
      return 'Data से उपयोगी Reports और Dashboards बनाना सीखें।'
    }
    if (category?.id === 'gmail' || category?.slug === 'gmail') {
      return 'Email को स्मार्ट तरीके से लिखें, शेड्यूल करें और समय बचाएँ।'
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

  return (
    <div className="min-h-screen bg-slate-50/50 text-slate-900 flex flex-col justify-between font-sans">
      <div>
        {/* Approved Home Screen V1 Header */}
        <Header onNotifyComingSoon={handleNotifyComingSoon} />

        {/* Breadcrumb Navigation: Home → Category */}
        <div className="bg-white border-b border-slate-200">
          <Breadcrumbs items={[{ label: category.title }]} />
        </div>

        {/* Category Hero / Introduction with reduced vertical spacing */}
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

        {/* Topics Section */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
          
          {/* Section Header */}
          <div className="mb-6 sm:mb-8">
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              {category.title} Topics
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              अपना Topic चुनें और सीखना शुरू करें।
            </p>
          </div>

          {/* Smart Topic Finder Toolbar (Conditional: Search at 7+, Level Filter at 16+) */}
          {(showSearch || showLevelFilter) && (
            <div className="mb-6 p-3 sm:p-4 bg-white border border-slate-200 rounded-2xl shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              {/* Compact Search Input */}
              {showSearch && (
                <div className="relative flex-1 min-w-[220px]">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Search className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Topic नाम या विवरण खोजें..."
                    className="w-full pl-9 pr-8 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-teal-600 focus:bg-white transition-all text-slate-900 placeholder-slate-400"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                      aria-label="Clear search"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              )}

              {/* Compact Level Filter (Shown at 16+ Topics) */}
              {showLevelFilter && (
                <div className="flex flex-wrap items-center gap-1.5 shrink-0">
                  {(['All', 'Beginner', 'Intermediate', 'Advanced'] as const).map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setSelectedLevel(lvl)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                        selectedLevel === lvl
                          ? 'bg-teal-700 text-white shadow-xs'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

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
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {visibleTopics.map((topic) => {
                const resourceCount = getTopicPublishedResourceCount(topic)

                return (
                  <Link
                    key={topic.id}
                    to={`/category/${category.slug}/topic/${topic.slug}`}
                    className="group bg-white border border-slate-200 rounded-2xl p-6 sm:p-7 hover:border-teal-300 hover:shadow-lg hover:shadow-slate-200/50 transition-all flex flex-col justify-between"
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
                      <h3 className="text-xl font-bold text-slate-900 group-hover:text-teal-700 transition-colors mb-2">
                        {topic.title}
                      </h3>

                      {/* Short Description */}
                      <p className="text-sm text-slate-600 leading-relaxed mb-6">
                        {topic.shortDescription}
                      </p>
                    </div>

                    {/* Bottom Action: Open Topic */}
                    <div className="pt-4 border-t border-slate-100 flex items-center justify-end">
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
