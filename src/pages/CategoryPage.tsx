import React from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { Header } from '../components/Header'
import { Footer } from '../components/Footer'
import { Breadcrumbs } from '../components/Breadcrumbs'
import { NoticeModal } from '../components/NoticeModal'
import { usePublicCurriculum } from '../context/PublicCurriculumContext'
import { CurriculumLoadingState } from '../components/common/CurriculumLoadingState'
import { CurriculumErrorState } from '../components/common/CurriculumErrorState'
import { isTopicPublished } from '../config/topicTutorials'
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
  FileCode2
} from 'lucide-react'

export const CategoryPage: React.FC = () => {
  const { categorySlug } = useParams<{ categorySlug: string }>()
  const navigate = useNavigate()

  const [modalState, setModalState] = React.useState<{
    isOpen: boolean
    title: string
    message: string
  }>({
    isOpen: false,
    title: '',
    message: '',
  })

  const { categories, topics: allTopics, isLoading, error, retry } = usePublicCurriculum()

  const category = categories.find(
    (c) => c.slug === categorySlug || c.id === categorySlug
  )

  const topics = allTopics
    .filter((t) => t.categoryId === category?.id && isTopicPublished(t))
    .sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0))

  const getCategoryIcon = (iconName?: string) => {
    switch (iconName) {
      case 'BarChart3':
        return <BarChart3 className="w-8 h-8 text-teal-700" />
      case 'Workflow':
        return <Workflow className="w-8 h-8 text-teal-700" />
      case 'TableProperties':
        return <TableProperties className="w-8 h-8 text-teal-700" />
      case 'GitBranch':
        return <GitBranch className="w-8 h-8 text-teal-700" />
      case 'Sparkles':
        return <Sparkles className="w-8 h-8 text-teal-700" />
      case 'Binary':
        return <Binary className="w-8 h-8 text-teal-700" />
      default:
        return <Layers className="w-8 h-8 text-teal-700" />
    }
  }

  const handleNotifyComingSoon = (featureName: string) => {
    setModalState({
      isOpen: true,
      title: featureName,
      message: `The "${featureName}" feature is currently in prototype mode. Data will be fully searchable when backend indexing is connected.`,
    })
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white text-slate-900 flex flex-col justify-between">
        <Header onNotifyComingSoon={handleNotifyComingSoon} />
        <CurriculumLoadingState />
        <Footer onNotifyComingSoon={handleNotifyComingSoon} />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white text-slate-900 flex flex-col justify-between">
        <Header onNotifyComingSoon={handleNotifyComingSoon} />
        <CurriculumErrorState error={error} onRetry={retry} />
        <Footer onNotifyComingSoon={handleNotifyComingSoon} />
      </div>
    )
  }

  if (!category) {
    return (
      <div className="min-h-screen bg-white text-slate-900 flex flex-col justify-between">
        <Header onNotifyComingSoon={handleNotifyComingSoon} />
        <div className="max-w-2xl mx-auto py-20 px-4 text-center">
          <HelpCircle className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Category Not Found</h1>
          <p className="text-sm text-slate-600 mb-6">
            The category you are looking for does not exist in our demo library.
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
        <Header onNotifyComingSoon={handleNotifyComingSoon} />

        {/* Breadcrumb Navigation */}
        <div className="bg-white border-b border-slate-200">
          <Breadcrumbs items={[{ label: category.title }]} />
        </div>

        {/* Category Hero / Header */}
        <section className="bg-white border-b border-slate-200 py-10 sm:py-14">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <button
              onClick={() => navigate('/')}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-teal-700 transition-colors mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to all categories</span>
            </button>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
              <div className="w-16 h-16 rounded-2xl bg-teal-50 border border-teal-100 flex items-center justify-center shrink-0">
                {getCategoryIcon(category.iconName)}
              </div>
              <div className="space-y-1.5">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-teal-700 uppercase tracking-wider bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-100">
                    Domain Library
                  </span>
                  <span className="text-xs text-slate-400">
                    {topics.length} Available Topics
                  </span>
                </div>
                <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                  {category.title}
                </h1>
                <p className="text-sm sm:text-base text-slate-600 max-w-2xl leading-relaxed">
                  {category.description}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Topics List / Grid Section */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                Curated Topics in {category.title}
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Select a topic below to inspect comprehensive learning guides, videos, cheat sheets, and hands-on tutorials.
              </p>
            </div>
            <span className="text-xs font-semibold text-teal-800 bg-teal-50 border border-teal-200 px-3 py-1 rounded-lg">
              {topics.length} Published Topic{topics.length === 1 ? '' : 's'}
            </span>
          </div>

          {topics.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center text-slate-500">
              <FileCode2 className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-base font-semibold text-slate-700">No completed tutorials yet</p>
              <p className="text-xs text-slate-400 mt-1">
                Tutorials and masterclasses for {category.title} are currently in active development. Check back soon!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
              {topics.map((topic) => {
                const videoCount = topic.resources.filter((r) => r.type === 'YouTube Video' || r.type === 'Facebook Video' || r.type === 'Video').length
                const infoCount = topic.resources.filter((r) => r.type === 'Infographic').length
                const pdfCount = topic.resources.filter((r) => r.type === 'PDF').length
                const tutCount = topic.resources.filter((r) => r.type === 'Tutorial').length

                return (
                  <Link
                    key={topic.id}
                    to={`/category/${category.slug}/topic/${topic.slug}`}
                    className="group bg-white border border-slate-200 rounded-2xl p-6 sm:p-7 hover:border-teal-300 hover:shadow-lg hover:shadow-slate-200/50 transition-all flex flex-col justify-between"
                  >
                    <div>
                      {/* Top Badges */}
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-bold text-teal-700 bg-teal-50 px-2.5 py-1 rounded-md border border-teal-100">
                          {topic.difficulty}
                        </span>
                        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                          {topic.resources.length} Resources
                        </span>
                      </div>

                      {/* Topic Title */}
                      <h3 className="text-xl font-bold text-slate-900 group-hover:text-teal-800 transition-colors mb-2">
                        {topic.title}
                      </h3>

                      {/* Short Description */}
                      <p className="text-sm text-slate-600 leading-relaxed mb-6">
                        {topic.shortDescription}
                      </p>
                    </div>

                    {/* Breakdown of formats & action */}
                    <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
                      <div className="flex flex-wrap items-center gap-1.5 text-slate-500 font-medium">
                        {videoCount > 0 && (
                          <span className="bg-slate-50 px-2 py-0.5 rounded-md border border-slate-200">
                            {videoCount} {videoCount === 1 ? 'Video' : 'Videos'}
                          </span>
                        )}
                        {infoCount > 0 && (
                          <span className="bg-slate-50 px-2 py-0.5 rounded-md border border-slate-200">
                            {infoCount} {infoCount === 1 ? 'Infographic' : 'Infographics'}
                          </span>
                        )}
                        {pdfCount > 0 && (
                          <span className="bg-slate-50 px-2 py-0.5 rounded-md border border-slate-200">
                            {pdfCount} {pdfCount === 1 ? 'PDF' : 'PDFs'}
                          </span>
                        )}
                        {tutCount > 0 && (
                          <span className="bg-slate-50 px-2 py-0.5 rounded-md border border-slate-200">
                            {tutCount} {tutCount === 1 ? 'Tutorial' : 'Tutorials'}
                          </span>
                        )}
                      </div>

                      <div className="inline-flex items-center gap-1 font-bold text-teal-700 group-hover:text-teal-800 transition-colors">
                        <span>Open Topic</span>
                        <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
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

