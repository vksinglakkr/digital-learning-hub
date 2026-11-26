import React, { useState } from 'react'
import { Header } from '../components/Header'
import { Hero } from '../components/Hero'
import { CuriosityBanner } from '../components/CuriosityBanner'
import { CategoriesSection } from '../components/CategoriesSection'
import { RecentlyAddedLessonsSection } from '../components/RecentlyAddedLessonsSection'
import { Footer } from '../components/Footer'
import { NoticeModal } from '../components/NoticeModal'
import { ResourceDemoModal } from '../components/ResourceDemoModal'
import { usePublicCurriculum } from '../context/PublicCurriculumContext'
import { CurriculumLoadingState } from '../components/common/CurriculumLoadingState'
import { CurriculumErrorState } from '../components/common/CurriculumErrorState'
import type { TopicResource } from '../types'

export const HomePage: React.FC = () => {
  const { isLoading, error, retry } = usePublicCurriculum()

  const [selectedResource, setSelectedResource] = useState<TopicResource | null>(null)

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
      message: 'Digital Learning Hub is a focused open educational platform. Structured for independent learners with bite-sized lessons and interactive practice.',
    })
  }

  const handleCloseModal = () => {
    setModalState((prev) => ({ ...prev, isOpen: false }))
  }

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-teal-100 selection:text-teal-900 flex flex-col justify-between">
      <div>
        {/* Top Navigation */}
        <Header onNotifyComingSoon={handleNotifyComingSoon} />

        {/* Main Educational Journey */}
        <main>
          {/* 1. Hero with Prominent Search */}
          <Hero onNotifyComingSoon={handleNotifyComingSoon} />

          {/* Curiosity Banner: अरे वाह! ये भी हो सकता है? */}
          <CuriosityBanner />

          {/* Dynamic Content or Loading/Error States */}
          {isLoading ? (
            <CurriculumLoadingState />
          ) : error ? (
            <CurriculumErrorState error={error} onRetry={retry} />
          ) : (
            <>
              {/* 2. Core Knowledge Disciplines: सीखना शुरू करें */}
              <CategoriesSection />

              {/* 3. Recently Added Lessons: हाल ही में जोड़ी गई Learning सामग्री */}
              <RecentlyAddedLessonsSection onSelectResource={(resource) => setSelectedResource(resource)} />
            </>
          )}
        </main>
      </div>

      {/* Educational Footer */}
      <Footer onNotifyComingSoon={handleNotifyComingSoon} />

      {/* Resource Demo Modal for opening any recently added lesson */}
      <ResourceDemoModal
        resource={selectedResource}
        onClose={() => setSelectedResource(null)}
      />

      {/* Informational Notice Modal */}
      <NoticeModal
        isOpen={modalState.isOpen}
        title={modalState.title}
        message={modalState.message}
        onClose={handleCloseModal}
      />
    </div>
  )
}
