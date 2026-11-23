import type { CategoryItem, TopicItem, TopicResource } from '../types'
import { isTopicPublished } from '../config/topicTutorials'

export interface MatchingTopic {
  topic: TopicItem
  category?: CategoryItem
}

export interface MatchingResource {
  resource: TopicResource
  topic: TopicItem
  category?: CategoryItem
}

export interface SearchResults {
  query: string
  terms: string[]
  totalCount: number
  matchingCategories: CategoryItem[]
  matchingTopics: MatchingTopic[]
  matchingResources: MatchingResource[]
}

/**
 * Executes a case-insensitive multi-term search across categories, topics, and public resources.
 * Only published content is searched; Draft and Hidden resources are strictly excluded.
 */
export function executeGlobalSearch(
  query: string,
  categories: CategoryItem[],
  topics: TopicItem[]
): SearchResults {
  const trimmed = query.trim()
  if (!trimmed) {
    return {
      query: '',
      terms: [],
      totalCount: 0,
      matchingCategories: [],
      matchingTopics: [],
      matchingResources: [],
    }
  }

  // Split query into lowercase individual terms for token matching
  const terms = trimmed.toLowerCase().split(/\s+/).filter(Boolean)

  // Map category by id for fast lookups
  const categoryMap = new Map<string, CategoryItem>()
  categories.forEach((c) => categoryMap.set(c.id, c))

  // 1. Search Categories
  const matchingCategories = categories.filter((cat) => {
    const searchable = `${cat.title} ${cat.description || ''} ${cat.slug}`.toLowerCase()
    return terms.every((term) => searchable.includes(term))
  })

  // 2. Search Topics (Only topics with verified published materials or tutorials)
  const matchingTopics: MatchingTopic[] = []
  topics.forEach((topic) => {
    if (!isTopicPublished(topic)) {
      return
    }

    const parentCategory = categoryMap.get(topic.categoryId)
    const searchable = `
      ${topic.title} 
      ${topic.shortDescription || ''} 
      ${topic.detailedDescription || ''} 
      ${topic.difficulty || ''} 
      ${topic.slug} 
      ${parentCategory?.title || ''}
    `.toLowerCase()

    if (terms.every((term) => searchable.includes(term))) {
      matchingTopics.push({
        topic,
        category: parentCategory,
      })
    }
  })

  // 3. Search Public Resources
  const matchingResources: MatchingResource[] = []
  topics.forEach((topic) => {
    const parentCategory = categoryMap.get(topic.categoryId)

    topic.resources.forEach((res) => {
      // Exclude non-public resources (Draft or Hidden)
      if (res.status === 'Draft' || res.status === 'Hidden') {
        return
      }

      const keywordsStr = Array.isArray(res.keywords) ? res.keywords.join(' ') : ''
      const searchable = `
        ${res.title} 
        ${res.description || ''} 
        ${res.type} 
        ${res.creatorName || ''} 
        ${keywordsStr} 
        ${res.difficulty || ''} 
        ${topic.title} 
        ${parentCategory?.title || ''}
      `.toLowerCase()

      if (terms.every((term) => searchable.includes(term))) {
        matchingResources.push({
          resource: res,
          topic,
          category: parentCategory,
        })
      }
    })
  })

  const totalCount = matchingCategories.length + matchingTopics.length + matchingResources.length

  return {
    query: trimmed,
    terms,
    totalCount,
    matchingCategories,
    matchingTopics,
    matchingResources,
  }
}

