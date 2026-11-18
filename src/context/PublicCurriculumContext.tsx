/* oxlint-disable react/only-export-components */
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import type { CategoryItem, TopicItem, TopicResource } from '../types'
import { 
  validatePublishedCurriculumJson, 
  type PublishedCurriculumSummary 
} from '../services/publishingService'

export interface PublicCurriculumContextType {
  categories: CategoryItem[]
  topics: TopicItem[]
  publishedResources: TopicResource[]
  isLoading: boolean
  error: string | null
  retry: () => void
  publishedAt: string | null
  summary: PublishedCurriculumSummary | null
}

const PublicCurriculumContext = createContext<PublicCurriculumContextType | undefined>(undefined)

/**
 * Builds the runtime URL for curriculum.json using Vite's BASE_URL
 */
export function getPublishedCurriculumUrl(): string {
  const base = import.meta.env.BASE_URL || '/'
  const cleanBase = base.endsWith('/') ? base : `${base}/`
  return `${cleanBase}data/curriculum.json`
}

export const PublicCurriculumProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [categories, setCategories] = useState<CategoryItem[]>([])
  const [topics, setTopics] = useState<TopicItem[]>([])
  const [publishedResources, setPublishedResources] = useState<TopicResource[]>([])
  const [summary, setSummary] = useState<PublishedCurriculumSummary | null>(null)
  const [publishedAt, setPublishedAt] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [fetchTrigger, setFetchTrigger] = useState(0)

  const retry = useCallback(() => {
    setIsLoading(true)
    setError(null)
    setFetchTrigger((prev) => prev + 1)
  }, [])

  useEffect(() => {
    let ignore = false

    async function fetchCurriculum() {
      const url = getPublishedCurriculumUrl()

      try {
        // Step 20D Requirement 8: fetch cache: 'no-cache' for fresh ETag revalidation
        const response = await fetch(url, {
          cache: 'no-cache',
          headers: {
            Accept: 'application/json',
          },
        })

        if (!response.ok) {
          throw new Error(
            `Unable to retrieve published curriculum (HTTP ${response.status} ${response.statusText || 'Error'}).`
          )
        }

        const jsonText = await response.text()
        const validation = validatePublishedCurriculumJson(jsonText)

        if (!validation.isValid || !validation.payload) {
          throw new Error(
            validation.error || 'The curriculum file does not match the required schema version.'
          )
        }

        if (!ignore) {
          const payload = validation.payload

          // Flatten published resources for quick public consumption
          const allPubRes: TopicResource[] = []
          payload.topics.forEach((top) => {
            if (Array.isArray(top.resources)) {
              top.resources.forEach((r) => {
                if (r.status === 'Published') {
                  allPubRes.push(r)
                }
              })
            }
          })

          setCategories(payload.categories)
          setTopics(payload.topics)
          setPublishedResources(allPubRes)
          setSummary(payload.summary)
          setPublishedAt(payload.generatedAt)
          setIsLoading(false)
        }
      } catch (err: any) {
        if (!ignore) {
          setError(
            err.message || 'An unexpected error occurred while loading the curriculum data.'
          )
          setIsLoading(false)
        }
      }
    }

    fetchCurriculum()

    return () => {
      ignore = true
    }
  }, [fetchTrigger])

  return (
    <PublicCurriculumContext.Provider
      value={{
        categories,
        topics,
        publishedResources,
        isLoading,
        error,
        retry,
        publishedAt,
        summary,
      }}
    >
      {children}
    </PublicCurriculumContext.Provider>
  )
}

export const usePublicCurriculum = (): PublicCurriculumContextType => {
  const context = useContext(PublicCurriculumContext)
  if (!context) {
    throw new Error('usePublicCurriculum must be used within a PublicCurriculumProvider')
  }
  return context
}
