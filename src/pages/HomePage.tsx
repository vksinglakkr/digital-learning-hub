import React, { useState } from 'react'
import { Header } from '../components/Header'
import { Hero } from '../components/Hero'
import { CategoriesSection } from '../components/CategoriesSection'
import { ResourcesSection } from '../components/ResourcesSection'
import { Footer } from '../components/Footer'
import { NoticeModal } from '../components/NoticeModal'
import { usePublicCurriculum } from '../context/PublicCurriculumContext'
import { CurriculumLoadingState } from '../components/common/CurriculumLoadingState'
import { CurriculumErrorState } from '../components/common/CurriculumErrorState'

export const HomePage: React.FC = () => {
  const { isLoading, error, retry } = usePublicCurriculum()

  const [modalState, setModalState] = useState<{
    isOpen: boolean
    title: string
    message: string
  }>({
    isOpen: false,
    title: '',
    message: '',
  })

  const handleNotifyComingSoon = (featureName: string) => {
    setModalState({
      isOpen: true,
      title: featureName,
      message: `The "${featureName}" feature is part of our upcoming roadmap. In this initial prototype phase, data indexing and backend resources are not connected yet. Stay tuned as we build out the full catalog!`,
    })
  }

  const handleCloseModal = () => {
    setModalState((prev) => ({ ...prev, isOpen: false }))
  }

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-teal-100 selection:text-teal-900">
      {/* Top Navigation */}
      <Header onNotifyComingSoon={handleNotifyComingSoon} />

      {/* Main Educational Content */}
      <main>
        {/* 1. Hero with Prominent Search */}
        <Hero onNotifyComingSoon={handleNotifyComingSoon} />

        {/* Dynamic Content or Loading/Error States */}
        {isLoading ? (
          <CurriculumLoadingState />
        ) : error ? (
          <CurriculumErrorState error={error} onRetry={retry} />
        ) : (
          <>
            {/* 2. Core Knowledge Disciplines */}
            <CategoriesSection />

            {/* 3. Latest Multi-Format Resources */}
            <ResourcesSection onNotifyComingSoon={handleNotifyComingSoon} />
          </>
        )}
      </main>

      {/* Educational Footer */}
      <Footer onNotifyComingSoon={handleNotifyComingSoon} />

      {/* Interactive Prototype Notice Modal */}
      <NoticeModal
        isOpen={modalState.isOpen}
        title={modalState.title}
        message={modalState.message}
        onClose={handleCloseModal}
      />
    </div>
  )
}

