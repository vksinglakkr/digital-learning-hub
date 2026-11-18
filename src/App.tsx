import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { LearningHubProvider } from './context/LearningHubContext'
import { PublicCurriculumProvider } from './context/PublicCurriculumContext'
import { HomePage } from './pages/HomePage'
import { CategoryPage } from './pages/CategoryPage'
import { TopicDetailPage } from './pages/TopicDetailPage'
import { AdminPage } from './pages/AdminPage'
import { CopyrightPage } from './pages/CopyrightPage'
import { SearchPage } from './pages/SearchPage'
import { ScrollToTop } from './components/ScrollToTop'

export default function App() {
  return (
    <LearningHubProvider>
      <PublicCurriculumProvider>
        <BrowserRouter basename={import.meta.env.BASE_URL}>
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/category/:categorySlug" element={<CategoryPage />} />
            <Route path="/category/:categorySlug/topic/:topicSlug" element={<TopicDetailPage />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/copyright" element={<CopyrightPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </PublicCurriculumProvider>
    </LearningHubProvider>
  )
}
